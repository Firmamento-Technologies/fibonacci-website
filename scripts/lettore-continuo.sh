#!/bin/bash
# 🔑 Il lettore è a TERMINE: svuota la coda ed esce. La scoperta invece continua
# ⇒ la coda si riforma da sola, e senza questo giro nessuno la guarda più.
# ⚠️ Misurato il 2026-08-15: la scoperta produce ~1.400 domini/ora e il lettore
# ne legge ~900 ⇒ ⛔ NON sta dietro. Questo giro serve a non perdere terreno,
# ⛔ non a pareggiare: il recupero si fa quando la scoperta finisce.
cd "$(dirname "$0")/.." || exit 1
while true; do
  if ! pgrep -f "raccolta-cliniche.py --leggi-stato" > /dev/null; then
    LETTORE_PARALLELI=${LETTORE_PARALLELI:-16} nice -n 10 python3 scripts/raccolta-cliniche.py --leggi-stato >> scripts/lettura.log 2>&1
  fi
  sleep 600
done
