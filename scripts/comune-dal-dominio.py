#!/usr/bin/env python3
"""Estrae il COMUNE dal dominio, quando la provincia lo conferma.

    python3 scripts/comune-dal-dominio.py            # il rapporto, ⛔ non scrive
    python3 scripts/comune-dal-dominio.py --scrivi   # riempie il campo `comune`

── PERCHE' ESISTE ────────────────────────────────────────────────────────────
**3.312 schede su 10.649 (31%) ⛔ non hanno il comune**, e un elenco di medici
funziona per **vicinanza**: senza un luogo la scheda ⛔ non e' collocabile.
⚠️ Ma in molte la citta' e' **scritta nel dominio**, incollata:
`dermacarepadova.it`, `chirurgiaesteticavarese.com`, `medicinaesteticabrindisi.com`.

⛔ NON tocca la rete. ⛔ NON cambia il tipo di soggetto ne' l'inclusione: scrive
   **solo** `comune` (e `precisioneComune`, che dice **da dove viene**).

── 🔴 QUATTRO STRUMENTI SBAGLIATI PRIMA DI QUELLO GIUSTO ─────────────────────
Vale la pena scriverli, perche' ognuno sembrava ragionevole:

  1. **il comune come SOTTOSTRINGA del testo appiattito.** «**Medicina**» e' un
     comune vero (BO) e combaciava con «medicina estetica» in 13 schede; «Arese»
     sta dentro «v-ARESE»; «Vinci» dentro «da-VINCI»; «**asti**» dentro
     «chirurgia-pl-ASTI-ca».
  2. **il comune come PAROLA INTERA.** Trovava **1 su 72**: nei domini la citta'
     e' **incollata** (`chirurgiaesteticavarese`), ⛔ non separata.
  3. **`scripts/comuni.json`.** ⛔ NON CONTIENE ROMA. Ne' Milano, ne' Napoli, ne'
     Varese: sono 1.099 comuni su ~7.900, e sono i **piccoli**. Cercare li'
     dentro ⛔ non poteva funzionare, e per due giri ho creduto a un difetto dei
     dati.
  4. **il comune in fondo al pezzo, senza guardare cosa lo precede.**
     `daniela-SIRAGUSA.it` finisce per «ragusa», e la provincia era **RG**:
     confermato da entrambi i controlli, e **sbagliato**.

✅ Quello giusto era **gia' nei dati**: i comuni **veri** sono i valori del
campo `comune` delle schede gia' raccolte, e la **provincia della scheda** dice
se il comune trovato e' plausibile. Due prove indipendenti, e nessuna fonte
nuova da procurarsi.
"""

from __future__ import annotations

import argparse
import collections
import json
import re
import sys
import unicodedata
from pathlib import Path

QUI = Path(__file__).resolve().parent
CARTELLA = QUI.parent / "src/dati/cliniche"

# ⛔ Parole del mestiere finite nel campo `comune` di qualche scheda sbagliata.
# «Medicina» e «Estetica» ⛔ non sono la citta' di `medicina-estetica-milano.it`.
SPAZZATURA = {
    "medicina", "estetica", "estetico", "centri", "centro", "studio", "studi", "clinica",
    "salute", "indirizzo", "servizi", "comment", "convenzione", "chirurgia", "bellezza",
}

# 🔑 Le parole che nei domini stanno DAVANTI alla citta'. Distinguono
# «medicinaestetica|brindisi» (termine noto + citta') da «danielasi|ragusa»
# (un cognome che *finisce* per «ragusa»).
TERMINI = (
    "medicinaestetica", "medicina", "estetica", "estetico", "estetiche", "chirurgia", "chirurgo",
    "chirurgiaplastica", "chirurgiaestetica", "centro", "centroestetico", "centrolaser", "studio",
    "studiomedico", "clinica", "clinicalaser", "laser", "dermatologia", "dermatologo",
    "dermatologa", "medico", "medicoestetico", "poli", "polimedica", "polimedical",
    "poliambulatorio", "polimed", "filler", "fillerlabbra", "criolipolisi", "skinmed", "beautylab",
    "estetika", "antiaging", "rimozionetatuaggi", "mbc", "asl", "asp", "unipegaso", "bakeca",
    "news", "medical", "viso", "visoestetica", "benessere", "esteticabenessere", "migliore",
    "citylife", "porta", "portanuova", "sfera", "centrosfera", "cmo", "estelab", "radiofrequenza",
    "radiofrequenzaviso", "esteticasolarium", "medicinaechirurgiaestetica", "medicinaesteticadelviso",
)
MIN = 6   # ⚠️ sotto le 6 lettere («asti», «roma», «terni») il rumore vince


def _piatto(s):
    s = "".join(c for c in unicodedata.normalize("NFD", s or "") if not unicodedata.combining(c))
    return re.sub(r"[^a-z]", "", s.lower())


def carica():
    """Tutte le schede, e `provincia → comuni visti li dentro`."""
    schede, per_prov = [], collections.defaultdict(collections.Counter)
    for f in sorted(CARTELLA.glob("*.json")):
        if f.name.startswith("_"):
            continue
        try:
            righe = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        for s in righe if isinstance(righe, list) else []:
            if not isinstance(s, dict) or not s.get("dominio"):
                continue
            schede.append((f, s))
            c, p = _piatto(s.get("comune")), (s.get("provincia") or "").strip().lower()
            # ⚠️ `n >= 2` piu' avanti: un comune visto UNA volta sola puo' essere
            # l'errore di battitura di una scheda sola.
            if len(c) >= MIN and len(p) == 2 and c not in SPAZZATURA:
                per_prov[p][c] += 1
    return schede, {p: sorted((c for c, n in cs.items() if n >= 2), key=len, reverse=True)
                    for p, cs in per_prov.items()}


def _prefisso_valido(pref):
    """Vero se davanti alla citta' c'e' **niente** o una parola riconoscibile."""
    return pref == "" or any(pref.endswith(t) for t in TERMINI)


def _citta_nel_titolo(comune, nome):
    """La citta' compare nel titolo come **parola intera**.

    🔑 Serve perche' `TERMINI` e' una lista scritta a mano, e una lista scritta a
    mano e' per definizione incompleta: `dermacare|padova` e' buono e
    «dermacare» ⛔ non ci sara' mai dentro. Il titolo e' un **secondo segnale
    preso dai dati**, ⛔ non un elenco da mantenere.

    ⚠️ **Parola intera, ⛔ non sottostringa**: «Dott.ssa Daniela **Siragusa**»
    contiene «ragusa» come **pezzo di cognome**, e cercarlo come sottostringa
    riaprirebbe la trappola numero 2.
    """
    return comune in {_piatto(w) for w in re.findall(r"[A-Za-zÀ-ÿ']{3,}", nome or "")}


def estrai(scheda, per_prov):
    """`(comune, perche')` oppure `(None, None)`. ⛔ Mai un tiro a indovinare."""
    p = (scheda.get("provincia") or "").strip().lower()
    if len(p) != 2 or p not in per_prov:
        return None, None
    pezzi = [_piatto(x) for x in re.split(r"[.\-_]", scheda["dominio"].rsplit(".", 1)[0]) if x]
    for c in per_prov[p]:                      # ⚠️ i piu' lunghi per primi
        for seg in pezzi:
            if seg == c:
                return c, "il pezzo del dominio È il comune"
            if seg.startswith(c):
                return c, "il pezzo del dominio inizia col comune"
            if seg.endswith(c):
                pref = seg[:-len(c)]
                if _prefisso_valido(pref):
                    return c, f"il pezzo finisce col comune, preceduto da «{pref}»"
                if _citta_nel_titolo(c, scheda.get("nome")):
                    return c, "il pezzo finisce col comune, che è anche una parola del titolo"
    return None, None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrivi", action="store_true", help="riempie il campo `comune`")
    args = ap.parse_args()

    schede, per_prov = carica()
    if not schede:
        print("⚠️  nessuna scheda in `src/dati/cliniche/`: ⛔ NON e' stato estratto niente.")
        print("    (⛔ non e' «zero da riempire» — e' una misura che non c'e')")
        return 0
    senza = [(f, s) for f, s in schede if not (s.get("comune") or "").strip()]
    tro = [(f, s, *estrai(s, per_prov)) for f, s in senza]
    tro = [t for t in tro if t[2]]

    print(f"── {len(schede)} schede · {len(senza)} senza comune "
          f"({len(senza)/len(schede):.0%}) ──\n")
    print(f"  provincie con comuni noti : {len(per_prov)}")
    print(f"  comuni di riferimento     : {len({c for cs in per_prov.values() for c in cs})}")
    print(f"\n  🟢 comune estratto e confermato dalla provincia: {len(tro)}")
    print(f"  ⬜ resta senza                                  : {len(senza)-len(tro)}")
    q = collections.Counter(p.split(",")[0] for _, _, _, p in tro)
    for k, n in q.most_common():
        print(f"       {n:4}  {k}")
    print("\n  ── quali città ──")
    for c, n in collections.Counter(c for _, _, c, _ in tro).most_common(12):
        print(f"       {n:3}  {c}")

    if not args.scrivi:
        print("\n(nessun file scritto: --scrivi per farlo)")
        return 0

    per_file = collections.defaultdict(list)
    for f, s, c, perche in tro:
        per_file[f].append((s["dominio"], c, perche))
    scritte = 0
    for f, voci in per_file.items():
        righe = json.loads(f.read_text(encoding="utf-8"))
        indice = {d: (c, p) for d, c, p in voci}
        for s in righe:
            if isinstance(s, dict) and s.get("dominio") in indice:
                c, perche = indice[s["dominio"]]
                s["comune"] = c
                # 🔑 **La provenienza si scrive.** Un comune deciso dal dominio
                # ⛔ non e' un comune letto sulla pagina, e chi lo rilegge deve
                # poterli distinguere — come `precisioneCoord` fa per le
                # coordinate.
                s["precisioneComune"] = f"dal dominio: {perche}"
                scritte += 1
        f.write_text(json.dumps(righe, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"\n✅ scritto `comune` su {scritte} schede, con `precisioneComune` che dice da dove viene")
    print("   ⛔ Nessun altro campo toccato: ⛔ non cambia il tipo né l'inclusione nell'elenco.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
