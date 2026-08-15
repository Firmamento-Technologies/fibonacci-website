#!/bin/bash
# Una riga di stato ogni 10 minuti in `scripts/polso.log`.
#
# 🔑 **Perché serve, ⛔ e non basta il cron.** Il promemoria di ricontrollo vive
# **dentro la sessione Claude**: se la sessione si chiude, ⛔ non parte. I
# processi di raccolta invece girano con `nohup` e **sopravvivono**. ⇒ senza
# questo, due ore di lavoro non lascerebbero **nessuna traccia di come sono
# andate**: si vedrebbe solo il punto d'arrivo, ⛔ non se qualcosa si è fermato
# alle 20:10 e il resto è stato tempo perso.
# ⚠️ Registra anche **cosa NON gira**: un processo morto è precisamente il fatto
# che si vuole scoprire, e un log che riporta solo i vivi ⛔ non lo direbbe.
cd "$(dirname "$0")/.." || exit 1
while true; do
  vivi=""
  for p in "scoperta-brightdata" "cliniche.py --nazionale" "leggi-stato"; do
    pgrep -f "$p" > /dev/null && vivi="$vivi ✓${p:0:12}" || vivi="$vivi ✗${p:0:12}"
  done
  python3 - "$vivi" <<'PY' >> scripts/polso.log
import json, glob, sys, datetime
from collections import Counter
t = Counter()
for p in glob.glob('src/dati/cliniche/*.json'):
    if p.endswith('-da-verificare.json'): continue
    try:
        for x in json.load(open(p)):
            if isinstance(x, dict): t[x.get('tipoSoggetto', '?')] += 1
    except Exception: pass
try:
    bd = json.load(open('scripts/stato-scoperta-bd.json'))
    gr = json.load(open('scripts/stato-scoperta.json'))
    dom, ric = len(set(bd['domini']) | set(gr['domini'])), len(bd['fatte']) + len(gr['fatte'])
except Exception:
    dom = ric = -1   # ⚠️ -1, ⛔ non 0: uno stato illeggibile ⛔ non è uno stato vuoto
ora = datetime.datetime.now().strftime('%H:%M')
print(f"{ora} · {t['impresa']} imprese · {t['persona']} prof · {dom} domini · "
      f"{ric} ricerche ·{sys.argv[1]}", flush=True)
PY
  sleep 600
done
