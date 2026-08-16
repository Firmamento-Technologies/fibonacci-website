#!/usr/bin/env python3
"""Scoperta **per NOME della struttura**, dal file del Ministero della Salute.

🔑 **Perché è un asse diverso, e ⛔ non «più ricerche».** Tutta la raccolta finora
ha battuto **un solo asse**: *trattamento + città*. Quel pozzo si è esaurito
(resa scesa da 0,278 a 0,047 domini per ricerca) — ⛔ ma l'esaurimento è **di
quell'asse**, ⛔ non del territorio. Qui si cerca **il nome proprio** di una
struttura che **sappiamo già esistere**: `strutture-da-cercare.json` è **già nel
repo** e contiene **2.466** voci, di cui ne avevamo trovate **20**.

⚠️ **⛔ Non si cercano tutte, e ⛔ non è per risparmiare.** 1.381 voci sono
**amministrative** — «ATTIVITÀ CLINICA», «LP CSM», consultori, SERT — o di
specialità che ⛔ non c'entrano (psichiatria, dialisi, veterinaria, RSA).
Cercarle ⛔ non è costoso: è **rumore che entra nell'elenco**, e il filtro a valle
poi lo deve buttare. ⇒ si filtra **prima**, dove costa zero.

Uso:
    set -a && . ./.env.brightdata && set +a
    python3 scripts/scoperta-strutture.py [--tetto=1200]
"""
import json, os, re, sys, threading, time
import concurrent.futures as cf
import importlib.util

QUI = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("bd", os.path.join(QUI, "scoperta-brightdata.py"))
# ⚠️ Il modulo esegue il proprio `main` se lo si importa senza argomenti: si
# neutralizza `sys.argv` **prima**, o parte una scoperta nazionale per sbaglio.
_argv, sys.argv = sys.argv, [sys.argv[0], "--modulo"]
bd = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bd)
sys.argv = _argv
r = bd.r

STATO = os.path.join(QUI, "stato-scoperta-bd.json")

# ⛔ Fuori: voci amministrative e specialità che ⛔ non fanno medicina estetica.
FUORI = re.compile(r"(ATTIVIT[AÀ]'?\s+CLINICA|LIBERA PROFESSION|\bLP\b|\bCSM\b|PSICHIATR|PSICOLOG|"
                   r"\bSERT\b|DIPENDENZE|CONSULTORIO|VETERINAR|RIABILITAZ|LUNGODEGEN|HOSPICE|"
                   r"\bRSA\b|ANZIANI|DIALISI|LABORATORIO ANALISI|RADIOLOG|FISIOTERAP|TERMAL|"
                   r"OSPEDALIER|INFERMIERISTIC|VULNOLOG|PRELIEVI|VACCINA|MEDICINA DELLO SPORT)", re.I)
# ✅ Dentro: nomi che somigliano a una struttura **privata e cercabile**.
DENTRO = re.compile(r"(CASA DI CURA|POLIAMBULATORIO|CLINICA|CENTRO MEDIC|ISTITUTO|MEDICAL|"
                    r"AMBULATORIO|POLICLINIC|CHIRURG|DERMATOLOG|ESTETIC)", re.I)


def da_cercare():
    voci = json.load(open(os.path.join(QUI, "strutture-da-cercare.json"), encoding="utf-8"))
    fuori = utili = []
    utili = [x for x in voci if not FUORI.search(x["nome"]) and DENTRO.search(x["nome"])]
    # ⚠️ Nomi quasi identici nello stesso comune («POLIAMBULATORIO VILLA IGEA» e
    # «POLIAMBULATORIO VILLA IGEA - PIAZZA M. FERRARIS») sono **la stessa
    # struttura**: cercarli due volte paga due volte lo stesso risultato.
    visti, netti = set(), []
    for x in utili:
        k = (re.split(r'\s+[-–]\s+', x["nome"])[0].strip().upper(), x["comune"].upper())
        if k in visti:
            continue
        visti.add(k)
        netti.append({"nome": k[0], "comune": x["comune"]})
    print(f"  {len(voci)} voci · {len(voci)-len(utili)} scartate (amministrative o fuori "
          f"specialità) · {len(utili)-len(netti)} duplicate ⇒ **{len(netti)} da cercare**",
          flush=True)
    return netti


if __name__ == "__main__":
    tetto = next((int(a.split("=")[1]) for a in sys.argv if a.startswith("--tetto=")), 1200)
    st = bd.carica()
    st.setdefault("fatte", []); st.setdefault("domini", {}); st.setdefault("scartati", {})
    gratis = json.load(open(r.STATO_P6, encoding="utf-8"))
    noti = set(gratis["domini"]) | set(st["domini"])
    fatte = set(st["fatte"])
    lavoro = [x for x in da_cercare() if f"STRUTT|{x['nome']}|{x['comune']}" not in fatte]
    lavoro = lavoro[:tetto]
    print(f"━━━ {len(lavoro)} strutture da cercare per NOME (tetto {tetto}) ━━━", flush=True)

    lucchetto = threading.Lock()
    conta = [0, 0, 0]      # fatte, domini nuovi, guasti di fila

    def cerca_una(x):
        if conta[2] >= 25:
            return
        # 🔑 Il nome **fra virgolette** e il comune accanto: senza virgolette il
        # motore allarga a «poliambulatorio» generico e torna la solita manciata
        # di portali, che è **esattamente il pozzo già esaurito**.
        q = f'"{x["nome"]}" {x["comune"]}'
        url = bd.cerca(q)
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
                    st["domini"][h] = r.slug(x["comune"])
                    noti.add(h); nuovi += 1
            st["fatte"].append(f"STRUTT|{x['nome']}|{x['comune']}")
            conta[0] += 1; conta[1] += nuovi
            if conta[0] % 10 == 0 or nuovi:
                json.dump(st, open(STATO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            print(f"  [{conta[0]}/{len(lavoro)}] {x['nome'][:40]:40} {x['comune'][:16]:16} "
                  f"+{nuovi} → {conta[1]} nuovi", flush=True)

    with cf.ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(cerca_una, lavoro))
    json.dump(st, open(STATO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n═══ {conta[0]} strutture cercate · **{conta[1]} domini nuovi** · "
          f"resa {conta[1]/max(1,conta[0]):.3f} per ricerca ═══")
