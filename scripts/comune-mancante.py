#!/usr/bin/env python3
"""Riempie il COMUNE mancante, con DUE metodi indipendenti.

    python3 scripts/comune-mancante.py            # il rapporto, ⛔ non scrive
    python3 scripts/comune-mancante.py --scrivi   # riempie il campo `comune`

  **A · dal DOMINIO** — la citta' e' incollata nel nome del sito
        (`dermacarepadova.it`), e la **provincia** della scheda conferma.
  **B · dal CAP** — nella pagina c'e' un CAP, e la mappa **CAP → comune**
        costruita **dai nostri stessi dati** dice quale citta' e'.

🔑 B esiste perche' A arriva solo dove il proprietario ha messo la citta' nel
dominio. Il CAP invece sta nel **piede di pagina** di quasi tutti i siti veri, e
⛔ non e' ambiguo: e' un codice.

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
import importlib.util
import json
import re
import sys
import unicodedata
from pathlib import Path

QUI = Path(__file__).resolve().parent
CARTELLA = QUI.parent / "src/dati/cliniche"

# ⛔ La cache e il ripulitore del testo ⛔ NON si riscrivono: sono in
# `raccolta-cliniche.py`, e una seconda copia divergerebbe.
_spec = importlib.util.spec_from_file_location("racc", QUI / "raccolta-cliniche.py")
racc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(racc)


def _pagine(dominio):
    return [corpo for _, corpo in racc.pagine_in_cache(dominio)]


def _testo(html):
    return racc.testo_di(html)

# ⛔ Parole del mestiere finite nel campo `comune` di qualche scheda sbagliata.
# «Medicina» e «Estetica» ⛔ non sono la citta' di `medicina-estetica-milano.it`.
SPAZZATURA = {
    "medicina", "estetica", "estetico", "centri", "centro", "studio", "studi", "clinica",
    "salute", "indirizzo", "servizi", "comment", "convenzione", "chirurgia", "bellezza",
    # 🔴 Valori che ⛔ non sono comuni italiani e stavano nel campo `comune` di
    # qualche scheda. Trovati il 2026-08-18 **dopo** aver corretto `provincia`:
    # finche' il campo conteneva uno slug, il confronto fra province li teneva
    # fuori **per caso**; svuotandolo, la guardia e' caduta e sono usciti.
    # ⚠️ Sono **14 voci su 1.652** (0,8%): un elenco esplicito costa meno di una
    # soglia, che a ≥3 ne lascerebbe comunque passare 2 e butterebbe via
    # Abbiategrasso, Acerra e Acireale.
    "zagreb", "gdpr", "usa", "del", "handcrafted", "monday", "italy", "italia",
    "web", "europe", "accesso", "accessi", "home", "cookie",
    "catalogo", "zoominfo", "chicago", "berlin", "london", "paris", "madrid",
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


def mappa_cap(schede):
    """`CAP → (comune, provincia)`, dalle schede **gia' verificate**.

    🔑 Come per i comuni, la fonte e' **dentro casa**: 7.312 schede hanno CAP e
    comune insieme. ⛔ Nessun elenco da procurarsi, e nessuna licenza da
    rispettare.

    ⚠️ **I CAP ambigui si buttano.** 326 CAP su 2.022 compaiono con **piu' di un
    comune** — i CAP di citta' grandi coprono piu' frazioni, e certi comuni li
    condividono. Un CAP che punta a due posti ⛔ non e' una prova: si scarta.
    """
    per_cap = collections.defaultdict(collections.Counter)
    for _, s in schede:
        c = (s.get("cap") or "").strip()
        com = (s.get("comune") or "").strip()
        p = (s.get("provincia") or "").strip().lower()
        if re.fullmatch(r"\d{5}", c) and cap_plausibile(c) and len(com) > 2:
            per_cap[c][(com, p)] += 1
    # ⛔ Comuni **troncati** ereditati da schede sbagliate: «San», «Santa»,
    # «Sant» ⛔ non sono comuni, sono l'inizio di un nome tagliato a meta'.
    # Misurato: 5 schede sarebbero finite a «San».
    # ⚠️ «Porto» e' arrivato dopo gli altri: il CAP 07046 e' **Porto Torres**,
    # e la mappa aveva imparato il nome tagliato a meta' da una scheda sbagliata.
    # 🔑 Sono tutti **primi pezzi di nomi composti**: se il valore e' solo
    # quello, la scheda da cui viene era gia' monca.
    monchi = {"san", "santa", "sant", "santo", "borgo", "villa", "monte", "castel", "citta",
              "porto", "torre", "torri", "campo", "cava", "sesto", "rocca", "colle", "casal",
              "cerreto", "serra", "pieve", "bagno", "bagni", "castello", "castelli"}
    return {c: v.most_common(1)[0][0] for c, v in per_cap.items()
            if len({x[0].lower() for x in v}) == 1
            and v.most_common(1)[0][0][0].strip().lower() not in monchi
            and _piatto(v.most_common(1)[0][0][0]) not in SPAZZATURA}


RE_CAP = re.compile(r"(?<!\d)(\d{5})(?!\d)")


def cap_plausibile(cap):
    """Vero se il numero puo' essere un CAP **italiano**.

    🔴 Aggiunto il 2026-08-18 **dopo aver guardato la provenienza scritta**: il
    CAP **`00000`** aveva imparato «Bergamo» da una scheda sbagliata e l'ha
    dato a **11 schede**; e i CAP `13485`, `27701`, `60606` — che sono di
    **Berlino, Durham e Chicago** — avevano imparato «Catálogo», «ZoomInfo» e
    **«Chicago»**.
    ⚠️ I CAP italiani vanno da **00010** a **98168**: `00000` ⛔ non e' un CAP, e
    un cinque cifre trovato in una pagina puo' benissimo essere **straniero**.
    """
    return cap.isdigit() and "00010" <= cap <= "98168"


def estrai_dal_cap(scheda, cap_comune, testo):
    """`(comune, perche')` dal primo CAP della pagina che la provincia conferma."""
    prov = (scheda.get("provincia") or "").strip().lower()
    for cap in dict.fromkeys(RE_CAP.findall(testo or "")):
        if not cap_plausibile(cap):
            continue
        coppia = cap_comune.get(cap)
        if not coppia:
            continue
        com, p = coppia
        # ⚠️ Se la provincia della scheda e quella del CAP **divergono**, ⛔ non
        # si sceglie: si scarta. Misurato: 234 casi, e sceglierne uno a caso
        # avrebbe messo studi nella citta' sbagliata.
        if prov and p and prov != p:
            continue
        return com, f"dal CAP {cap} trovato nella pagina, con la provincia che concorda"
    return None, None


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


def nomi_veri(schede):
    """`comune appiattito → come si scrive davvero`.

    🔴 Il metodo dal dominio restituiva la forma **appiattita**, e scriveva
    «genova» minuscolo nel campo `comune` (da `andi**genova**.it`). ⚠️ Sembra un
    dettaglio, ⛔ ma quel campo lo si confronta con altri comuni e lo si mostra:
    una forma diversa dalle altre e' un dato che ⛔ non combacia.
    """
    conta = collections.Counter()
    for _, s in schede:
        com = (s.get("comune") or "").strip()
        if len(com) > 2:
            conta[(_piatto(com), com)] += 1
    fuori = {}
    for (piatto_, vero), n in conta.most_common():
        fuori.setdefault(piatto_, vero)
    return fuori


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
    veri = nomi_veri(schede)
    if not schede:
        print("⚠️  nessuna scheda in `src/dati/cliniche/`: ⛔ NON e' stato estratto niente.")
        print("    (⛔ non e' «zero da riempire» — e' una misura che non c'e')")
        return 0
    senza = [(f, s) for f, s in schede if not (s.get("comune") or "").strip()]
    cap_comune = mappa_cap(schede)
    tro = []
    for f, s in senza:
        c, perche = estrai(s, per_prov)                    # A · dal dominio
        if not c:                                          # B · dal CAP
            testo = re.sub(r"\s+", " ",
                           "\n".join(_testo(x) for x in _pagine(s["dominio"])))
            c, perche = estrai_dal_cap(s, cap_comune, testo)
        if c:
            # ⚠️ Si scrive il comune **come si scrive davvero**, ⛔ non la forma
            # appiattita che serve solo a confrontare.
            tro.append((f, s, veri.get(_piatto(c), c), perche))

    print(f"── {len(schede)} schede · {len(senza)} senza comune "
          f"({len(senza)/len(schede):.0%}) ──\n")
    print(f"  provincie con comuni noti : {len(per_prov)}")
    print(f"  comuni di riferimento     : {len({c for cs in per_prov.values() for c in cs})}")
    print(f"\n  🟢 comune estratto e confermato dalla provincia: {len(tro)}")
    print(f"  ⬜ resta senza                                  : {len(senza)-len(tro)}")
    dal_cap = sum(1 for _, _, _, p in tro if p.startswith("dal CAP"))
    print(f"       A · dal dominio : {len(tro)-dal_cap}")
    print(f"       B · dal CAP     : {dal_cap}")
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
                # ⚠️ **⛔ Non si scrive «dal dominio» a prescindere.** Il
                # prefisso era **fisso**, e i 145 comuni venuti dal **CAP** si
                # portavano dietro l'etichetta sbagliata: una provenienza che
                # ⛔ non dice il metodo vero ⛔ non serve a niente.
                s["precisioneComune"] = (perche if perche.startswith("dal CAP")
                                         else f"dal dominio: {perche}")
                scritte += 1
        f.write_text(json.dumps(righe, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"\n✅ scritto `comune` su {scritte} schede, con `precisioneComune` che dice da dove viene")
    print("   ⛔ Nessun altro campo toccato: ⛔ non cambia il tipo né l'inclusione nell'elenco.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
