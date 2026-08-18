#!/usr/bin/env python3
"""Cancello: i dati raccolti rispettano quello che l'informativa PROMETTE.

    python3 scripts/promesse-informativa.py     # 0 se le promesse reggono

── PERCHE' ESISTE, E PERCHE' NON BASTA `niente-dati-elenco.mjs` ─────────────
Quel cancello guarda **il costruito**: nessun indirizzo dell'elenco deve finire
in una pagina pubblicata. Questo guarda **la fonte**: che cosa c'e' nel file dei
recapiti. Sono due domande diverse, e la seconda ⛔ non e' meno seria.

🔴 Il 18 agosto 2026 si e' misurato che l'informativa **pubblicata** dichiarava
due cose che i dati contraddicevano:

  §2 «⛔ Non sono trattati indirizzi **nominativi** … vengono scartati
      automaticamente»        → ne restavano **16**
  §2 «L'origine e' **una sola**: il sito internet dell'interessato»
                              → **11** venivano da un elenco telefonico, altre
                                da portali e da agenzie web

⚠️ Un'informativa che dichiara «⛔ non trattiamo X» mentre X e' nell'archivio e'
**peggio di un'informativa assente**: e' una dichiarazione inesatta resa
all'interessato, e mina tutto il resto del documento. E si e' scelto di **far
diventare vera la promessa**, ⛔ non di indebolirla — quella promessa e' anche la
mitigazione piu' forte del bilanciamento del legittimo interesse.

🔑 ⇒ questo cancello esiste perche' la promessa **resti** vera. Il filtro sta nel
raccoglitore, ⛔ ma un raccoglitore si cambia, e nessuno rilegge l'informativa per
controllare se e' ancora vera.

⚠️ Se il file dei recapiti ⛔ non c'e', **lo dice** e ⛔ non finge di aver
guardato: un presidio che tace su cio' che ⛔ non ha visto e' il difetto che
questo progetto ha gia' pagato piu' volte.
"""

from __future__ import annotations

import collections
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from recapiti_filtri import _e_nominativa, _origine_non_propria  # noqa: E402

FONTE = Path(__file__).resolve().parent.parent / "src/dati/cliniche/_recapiti.json"


def main() -> int:
    if not FONTE.is_file():
        print("⚠️  `_recapiti.json` non c'e': le promesse dell'informativa")
        print("    NON sono state verificate (⛔ non e' «tutto a posto»).")
        print("    Si rigenera con: python3 scripts/costruisci-db.py")
        return 0

    dati = json.loads(FONTE.read_text(encoding="utf-8"))
    conta = collections.Counter(
        (v.get("email") or "").strip().lower().split("@")[-1] for v in dati.values()
    )
    nominativi = [v["email"] for v in dati.values() if _e_nominativa(v.get("email", ""))]
    estranei = [
        v["email"] for v in dati.values()
        if _origine_non_propria(v.get("email", ""), conta)
    ]

    if not nominativi and not estranei:
        print(f"✅ le promesse dell'informativa reggono su {len(dati)} recapiti")
        print("   (0 indirizzi nominativi · 0 da portali, agenzie o segnaposto)")
        return 0

    print("⛔ I DATI CONTRADDICONO L'INFORMATIVA PUBBLICATA\n")
    if nominativi:
        print(f"   {len(nominativi)} indirizzi NOMINATIVI, che §2 dichiara scartati:")
        for e in nominativi[:5]:
            print(f"     {e}")
    if estranei:
        print(f"   {len(estranei)} indirizzi che ⛔ NON vengono dal sito dello studio,")
        print("   mentre §2 dichiara che l'origine e' una sola:")
        for e in estranei[:5]:
            print(f"     {e}")
    print("\n   Si sana FACENDO quello che l'informativa promette:")
    print("     python3 scripts/classifica-recapiti.py --applica")
    print("   ⛔ Non indebolendo l'informativa: quella promessa e' la mitigazione")
    print("      piu' forte del bilanciamento del legittimo interesse.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
