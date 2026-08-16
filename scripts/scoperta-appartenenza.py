#!/usr/bin/env python3
"""Scoperta **per APPARTENENZA DICHIARATA** — il terzo asse.

🔑 **La scoperta che ha cambiato l'approccio (2026-08-16).** L'idea di partenza
era leggere gli **elenchi ufficiali**: soci delle società scientifiche, «trova un
centro» dei produttori di dispositivi. ⛔ **Non si può, e ⛔ non per un divieto**:
sono **dietro JavaScript**. Misurato aprendoli — `aiteb.it/soci/` dice *«Elenco
dei medici associati»* ⛔ ma nell'HTML **0 nomi**; `ultherapy.it/trova-medico/`
dice *«Trova il Centro Medico più vicino a te»* ⛔ ma **0 studi**. Servirebbe un
browser, e su questo account ⛔ non c'è una zona browser.

🔑 **La via che funziona è l'opposto: ⛔ non l'elenco di chi certifica, ma ciò che
il medico SCRIVE DI SÉ.** Chi è socio lo dichiara sul proprio sito, e chi ha
comprato un macchinario **lo mette in vetrina** — è marketing, quindi è scritto
in chiaro. Provato: `"socio AITEB"` ha reso **5 studi** alla prima ricerca.

⇒ è un **terzo asse**, diverso sia da «trattamento + città» (esaurito) sia da
«nome della struttura» (reso 1,25):
    per trattamento   →  che cosa fa
    per nome          →  come si chiama
    per appartenenza  →  **a chi appartiene / che cosa possiede**
"""
import json, os, sys, threading
import concurrent.futures as cf
import importlib.util

QUI = os.path.dirname(os.path.abspath(__file__))
_argv, sys.argv = sys.argv, [sys.argv[0], "--modulo"]
spec = importlib.util.spec_from_file_location("bd", os.path.join(QUI, "scoperta-brightdata.py"))
bd = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bd)
sys.argv = _argv
r = bd.r
STATO = os.path.join(QUI, "stato-scoperta-bd.json")

# ⚠️ **Fra virgolette, sempre.** Senza, il motore allarga al generico e torna ai
# soliti portali — la stessa lezione della ricerca per nome.
APPARTENENZA = [
    # società scientifiche italiane (SIME 1975, Agorà 1984 — brain estetica)
    '"socio AITEB"', '"socio SIME"', '"socio Agorà"', '"socio AICPE"',
    '"socio SICPRE"', '"socia AITEB"', '"membro AITEB"',
    '"Società Italiana di Medicina Estetica" socio',
    '"Agorà" "medicina estetica" socio studio',
    # dispositivi: chi lo compra lo mette in vetrina
    '"centro Ultherapy"', '"Ultherapy PRIME"', '"Morpheus8"', '"centro Morpheus8"',
    '"Fotona 4D"', '"SmartXide"', '"Ultraformer"', '"Emsculpt"', '"CoolSculpting"',
    '"Thermage"', '"Hydrafacial"', '"Endymed"', '"Lumenis"', '"Cynosure"',
    '"Candela" laser medicina estetica', '"Alma Harmony"', '"Sculptra" centro',
]


def citta(quante):
    prov = json.load(open(os.path.join(QUI, "province.json"), encoding="utf-8"))
    return [c for c, _ in prov[:quante]]


if __name__ == "__main__":
    n_citta = next((int(a.split("=")[1]) for a in sys.argv if a.startswith("--citta=")), 20)
    tetto = next((int(a.split("=")[1]) for a in sys.argv if a.startswith("--tetto=")), 200)
    st = bd.carica()
    for k, v in (("fatte", []), ("domini", {}), ("scartati", {})):
        st.setdefault(k, v)
    gratis = json.load(open(r.STATO_P6, encoding="utf-8"))
    noti = set(gratis["domini"]) | set(st["domini"])
    fatte = set(st["fatte"])

    lavoro = []
    for frase in APPARTENENZA:
        # 🔴 **ASSUNZIONE SBAGLIATA, corretta misurando (2026-08-16).** Avevo
        # scritto che «la città serve a scendere in profondità»: **è falso su
        # questo asse**. Misurato: le query **nazionali** rendono **1,727**
        # domini nuovi, le stesse frasi **con la città** rendono **0,31** —
        # cinque volte peggio.
        # 🔑 Il motivo è nella natura della frase: *«socio AITEB»* è **già**
        # selettiva, e aggiungere «Foggia» ⛔ non approfondisce — **restringe**
        # a un insieme che spesso è vuoto. ⇒ su questo asse il volume si prende
        # **allargando le FRASI**, ⛔ non le città: ogni marchio e ogni società
        # in più vale quanto venti città.
        # ⚠️ Le città restano ⛔ ma poche, e solo le maggiori: sotto una certa
        # dimensione la combinazione frase×città è **quasi sempre vuota**.
        for c in [None] + citta(n_citta):
            k = f"APPART|{frase}|{c or '-'}"
            if k not in fatte:
                lavoro.append((frase, c, k))
    lavoro = lavoro[:tetto]
    print(f"━━━ {len(APPARTENENZA)} frasi × ({n_citta}+1) → {len(lavoro)} ricerche "
          f"(tetto {tetto}) ━━━", flush=True)

    lucchetto = threading.Lock()
    conta = [0, 0, 0]

    def cerca(v):
        frase, c, k = v
        if conta[2] >= 25:
            return
        url = bd.cerca(f"{frase} {c}" if c else frase)
        with lucchetto:
            if url is None:
                conta[2] += 1
                return
            conta[2] = 0
            nuovi = 0
            for u in url:
                h = r.host_di(u)
                if not h:
                    continue
                if r.da_escludere(u):
                    st["scartati"][h] = st["scartati"].get(h, 0) + 1
                elif h not in noti:
                    st["domini"][h] = r.slug(c) if c else "appartenenza"
                    noti.add(h); nuovi += 1
            st["fatte"].append(k)
            conta[0] += 1; conta[1] += nuovi
            if conta[0] % 10 == 0 or nuovi:
                json.dump(st, open(STATO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            print(f"  [{conta[0]}/{len(lavoro)}] {frase[:26]:26} {(c or '(nazionale)')[:14]:14} "
                  f"+{nuovi} → {conta[1]}", flush=True)

    with cf.ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(cerca, lavoro))
    json.dump(st, open(STATO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n═══ {conta[0]} ricerche · **{conta[1]} domini nuovi** · "
          f"resa {conta[1]/max(1,conta[0]):.3f} ═══")
