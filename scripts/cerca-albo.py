#!/usr/bin/env python3
"""Cerca l'iscrizione all'ALBO nelle pagine legali, per la coda di revisione.

    python3 scripts/cerca-albo.py            # giro 1: SOLO cache, ⛔ nessuna rete
    python3 scripts/cerca-albo.py --rete     # giro 2: scarica le pagine legali mancanti
    python3 scripts/cerca-albo.py --scrivi   # scrive l'esito accanto alla coda

── PERCHE' ESISTE ────────────────────────────────────────────────────────────
La coda di revisione (`coda-revisione.py`) mette in fila 679 schede che
dichiarano un iniettivo e sono escluse dall'elenco. La domanda da farsi
aprendone il sito e' una sola: **c'e' un medico dietro?**

Il segno migliore e' l'**iscrizione all'albo**: la pubblicita' sanitaria deve
indicarla (L. 145/2018 c. 536), una societa' ⛔ non ce l'ha, e la prova ⛔ non
dipende da come e' scritto il nome. ⇒ trovarla e' il lavoro che si puo' fare
per chi rivede, invece di farglielo fare 679 volte a mano.

── 🔑 PERCHE' LA RACCOLTA NON L'AVEVA GIA' TROVATA ──────────────────────────
`raccolta-cliniche.py` **cerca gia'** l'albo, e `RE_INTERNI` include perfino
`privacy` e `note-legali`. ⛔ Ma `analizza()` legge **al massimo 3 pagine per
sito**, e le prime tre sono quasi sempre home, contatti e chi-siamo.
📏 Misurato il 2026-08-18: sulle **2.109 pagine gia' in cache** dei 679 domini,
l'albo si trova in **14** (2%). ⚠️ Ma **425 di quei siti hanno un link a una
pagina legale che ⛔ non e' mai stata scaricata**.
⇒ ⛔ Non e' che l'albo non c'e': e' che ⛔ non e' stato letto dove sta.

── COME SI COMPORTA ─────────────────────────────────────────────────────────
- **Giro 1 senza rete**: legge la cache di `raccolta-cliniche.py`. Gratis,
  istantaneo, ripetibile. E' il modo predefinito.
- **Giro 2 con `--rete`**: segue **solo** i link che `RE_LEGALI` riconosce
  (privacy, note legali, termini, trasparenza), al massimo 3 per sito.
  ⚠️ Chiede `robots.txt` **prima** di ogni sito e rinuncia al dominio se vieta.
  Le pagine finiscono nella stessa cache ⇒ il giro dopo e' di nuovo gratis.
- ⛔ **Non promuove niente e ⛔ non tocca le schede**: scrive l'esito accanto
  alla coda, che resta una coda. Chi decide e' una persona.

⛔ Riusa `raccolta-cliniche.py` invece di ricopiarne i pezzi: `leggi()` (con la
   cache), `robots_permette()`, `RE_ALBO`, `RE_LEGALI`, `host_di()`. Una
   seconda copia di quelle regex divergerebbe, e a divergere sarebbe quella che
   nessuno rilegge.
"""

from __future__ import annotations

import argparse
import concurrent.futures as cf
import gzip
import importlib.util
import json
import os
import re
import sys
import threading
import time
from pathlib import Path
from urllib.parse import urljoin

QUI = Path(__file__).resolve().parent
CARTELLA = QUI.parent / "src/dati/cliniche"
CODA = CARTELLA / "_coda-revisione.json"
USCITA = CARTELLA / "_coda-albo.json"

_spec = importlib.util.spec_from_file_location("racc", QUI / "raccolta-cliniche.py")
racc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(racc)   # ⚠️ solo letture da disco, misurato: 0,1 s

# Il numero e la provincia: e' **la prova**, ⛔ non il fatto che la parola
# «albo» compaia. «Ordine dei Medici di Varese n. 6458» si verifica; «rispetta
# la linea guida FNOMCeO» ⛔ no.
# 🔴 **Riscritte il 2026-08-18 dopo aver guardato le stringhe vere**: una sola
# espressione ⛔ non regge le forme che i siti usano davvero.
#   «Iscrizione Albo Odontoiatri **Taranto n. 23**»   → provincia PRIMA
#   «ordine provinciale **di Roma** dei medici … **con il n° 070**» → DOPO
#   «**N. M47936**»                                    → una lettera davanti
#   «**n 4931**»                                       → senza punto
#   «Iscrizione **Albo 8088**»                         → ⛔ senza provincia
RE_NUM = re.compile(r"\bn[.°º]?\s*:?\s*([A-Z]{0,2}\d{2,6})\b(?!\d)", re.I)
RE_NUM_NUDO = re.compile(r"\balbo\s+(\d{2,6})\b(?!\d)", re.I)
RE_PROV_DOPO = re.compile(r"\bdi\s+([A-ZÀ-Þ][\wÀ-ÿ'’-]{2,19})", re.I)
# ⚠️ La provincia che sta appena PRIMA del numero: una parola con la maiuscola,
# ⛔ non una qualsiasi (`dei`, `degli`, `chirurghi` ⛔ non sono province).
RE_PROV_PRIMA = re.compile(
    r"\b([A-ZÀ-Þ][A-ZÀ-Þa-zà-ÿ'’-]{2,19})\s+n[.°º]?\s*:?\s*[A-Z]{0,2}\d{2,6}\b")
_NON_PROVINCE = {"medici", "medico", "chirurghi", "chirurgo", "odontoiatri", "albo", "ordine",
                 "provinciale", "iscrizione", "iscritto", "iscritta", "dei", "degli", "delle"}


def numero_e_provincia(frammento):
    """(provincia, numero) dal testo intorno all'albo. Stringhe vuote se ⛔ non c'e'.

    🔑 **Nel dubbio si restituisce vuoto**: un numero sbagliato accanto a un nome
    e' peggio di nessun numero — chi rivede si fida della prova, e una prova
    falsa gli fa approvare la scheda sbagliata.
    """
    # ⚠️ Le due cose sono **indipendenti**: «ordine provinciale di Roma dei
    # medici chirurghi» ⛔ non porta un numero, ⛔ ma la provincia c'e' ed e' utile
    # a chi rivede (ordina il lavoro per zona). Legarle faceva perdere la
    # provincia ogni volta che il numero mancava.
    m = RE_NUM.search(frammento) or RE_NUM_NUDO.search(frammento)
    numero = m.group(1) if m else ""

    if m:
        prima = RE_PROV_PRIMA.search(frammento[:m.end()])
        if prima and prima.group(1).lower() not in _NON_PROVINCE:
            return prima.group(1), numero
    for pm in RE_PROV_DOPO.finditer(frammento):
        if pm.group(1).lower() not in _NON_PROVINCE:
            return pm.group(1), numero
    return "", numero


# ⚠️ Il direttore sanitario lo nomina una STRUTTURA: se l'albo sta accanto a
# quella formula, la prova dice «qui c'e' un medico», ⛔ non «e' un libero
# professionista». Sono due domande diverse e vanno tenute separate.
RE_DIRSAN = re.compile(r"direttore\s+sanitari[oa]", re.I)
RE_TAG = re.compile(r"<[^>]+>")
_PAUSA = threading.Semaphore(4)


def pagine_in_cache(dominio):
    """(testo, url) di ogni pagina gia' scaricata per quel dominio."""
    for h in (dominio, "www." + dominio):
        d = Path(racc.CACHE) / h
        if not d.is_dir():
            continue
        for f in d.iterdir():
            try:
                testo = gzip.open(f, "rt", encoding="utf-8").read()
            except Exception:
                continue
            url, _, corpo = testo.partition("\n")
            yield corpo, url


def estrai(testo, url):
    """(esito | None) — l'esito porta **la prova**, ⛔ non un booleano."""
    m = racc.RE_ALBO.search(testo)
    if not m:
        return None
    i = m.start()
    intorno = RE_TAG.sub(" ", testo[max(0, i - 220):i + 320])
    intorno = re.sub(r"\s+", " ", intorno).strip()
    prov, num = numero_e_provincia(RE_TAG.sub(" ", testo[max(0, i - 120):i + 260]))
    return {
        "dove": url,
        "provincia": prov,
        "numero": num,
        "conDirettoreSanitario": bool(RE_DIRSAN.search(testo[max(0, i - 260):i + 260])),
        "contesto": intorno[:300],
    }


def link_legali(dominio):
    """Gli URL legali citati nelle pagine in cache, mai scaricati. Al massimo 3."""
    visti, fuori = set(), []
    for corpo, url in pagine_in_cache(dominio):
        for rel in racc.RE_LEGALI.findall(corpo):
            pieno = urljoin(url, rel)
            if racc.host_di(pieno) != racc.host_di(url) or pieno in visti:
                continue
            visti.add(pieno)
            if not os.path.exists(racc.percorso_cache(pieno)):
                fuori.append(pieno)
    return fuori[:3]


def cerca(r, con_rete):
    dom = r["dominio"]
    for corpo, url in pagine_in_cache(dom):
        e = estrai(corpo, url)
        if e:
            return dict(r, albo=e, giro="cache")
    if not con_rete:
        return dict(r, albo=None, giro="cache")

    urls = link_legali(dom)
    if not urls:
        return dict(r, albo=None, giro="rete-niente-da-leggere")
    for u in urls:
        # ⚠️ Si chiede al sito PRIMA di leggerlo, ogni volta.
        if not racc.robots_permette(u):
            return dict(r, albo=None, giro="robots-vieta")
        with _PAUSA:
            corpo, finale = racc.leggi(u, timeout=15)
            time.sleep(0.4)
        if not corpo:
            continue
        e = estrai(corpo, finale or u)
        if e:
            return dict(r, albo=e, giro="rete")
    return dict(r, albo=None, giro="rete-non-trovato")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--rete", action="store_true",
                    help="scarica le pagine legali mancanti (⛔ predefinito: solo cache)")
    ap.add_argument("--scrivi", action="store_true", help="scrive `_coda-albo.json`")
    ap.add_argument("--solo", metavar="GRUPPO", help="limita a un gruppo della coda")
    args = ap.parse_args()

    if not CODA.is_file():
        print("⚠️  `_coda-revisione.json` non c'e': la ricerca dell'albo ⛔ NON e' stata fatta.")
        print("    (⛔ non e' «nessun albo trovato» — e' una misura che non c'e')")
        print("    Si genera con: python3 scripts/coda-revisione.py --scrivi")
        return 0
    coda = json.loads(CODA.read_text(encoding="utf-8"))
    if args.solo:
        coda = [r for r in coda if r["gruppo"] == args.solo]

    t0 = time.time()
    if args.rete:
        with cf.ThreadPoolExecutor(max_workers=4) as ex:
            esiti = list(ex.map(lambda r: cerca(r, True), coda))
    else:
        esiti = [cerca(r, False) for r in coda]

    con = [e for e in esiti if e["albo"]]
    numerati = [e for e in con if e["albo"]["numero"]]
    dirsan = [e for e in con if e["albo"]["conDirettoreSanitario"]]

    print(f"── albo cercato su {len(coda)} schede in {time.time()-t0:.0f}s "
          f"({'con rete' if args.rete else '⛔ SENZA rete, solo cache'}) ──\n")
    print(f"  🟢 albo TROVATO            : {len(con):4}  ({len(con)/max(1,len(coda)):.0%})")
    print(f"       con numero e provincia: {len(numerati):4}   ← la prova verificabile")
    print(f"       accanto a «direttore sanitario»: {len(dirsan):3}"
          "   ⚠️ dice «c'e' un medico», ⛔ non «e' un libero professionista»")
    import collections
    for g, n in collections.Counter(e["giro"] for e in esiti).most_common():
        print(f"  {g:28}: {n:4}")
    if not args.rete:
        senza = sum(1 for r in coda if not any(e["albo"] for e in esiti if e["dominio"] == r["dominio"])
                    and link_legali(r["dominio"]))
        print(f"\n⚠️  {senza} siti hanno un link a una pagina legale ⛔ MAI SCARICATA.")
        print("    ⇒ questo giro ⛔ non puo' vederli: `--rete` per leggerli.")

    if con:
        print("\n── esempi della prova trovata ──")
        for e in numerati[:8]:
            a = e["albo"]
            dove = f"di {a['provincia']} " if a["provincia"] else ""
            print(f"   {e['nome'][:30]:32} albo {dove}n. {a['numero']}")

    if args.scrivi:
        USCITA.write_text(json.dumps(esiti, ensure_ascii=False, indent=1) + "\n",
                          encoding="utf-8")
        print(f"\n✓ scritto {USCITA.name} (⛔ ignorato da git)")
    else:
        print("\n(nessun file scritto: --scrivi per farlo)")
    print("\n⛔ Nessuna scheda e' stata promossa: l'albo e' una PROVA per chi rivede,")
    print("   ⛔ non una decisione. La coda resta una coda.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
