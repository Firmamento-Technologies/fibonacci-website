#!/usr/bin/env python3
"""Rimette a posto `provincia`: oggi contiene DOVE ABBIAMO CERCATO.

    python3 scripts/provincia-vera.py            # il rapporto, ⛔ non scrive
    python3 scripts/provincia-vera.py --scrivi

── 🔴 IL DIFETTO ⛔ NON E' DI FORMATO, E' DI SIGNIFICATO ─────────────────────
Il campo `provincia` sembra rotto perche' su **7.312 schede su 10.669 (69%)**
contiene uno **slug** invece della sigla: «mazzarino», «grottaferrata»,
«cadelbosco-di-sopra», «appartenenza».

⚠️ **Ma convertirlo in sigla sarebbe la cosa peggiore da fare**, perche' quello
slug ⛔ non e' la provincia dello studio: e' **il posto in cui la ricerca stava
guardando** quando ha trovato quel dominio. `dolomitimedica.it` ha slug
`san-giorgio-delle-pertiche` e lo studio sta a **Castelfranco (TV)**.
⇒ tradurre lo slug in sigla renderebbe un dato **falso** ⛔ ma
**apparentemente giusto**, e ogni conferma costruita sopra continuerebbe a
passare.

📏 E ⛔ non e' un difetto delle sole schede con lo slug: fra quelle che **hanno
gia' una sigla** e il cui comune e' un **capoluogo**, **224 su 1.760 (13%) sono
DISCORDI** — `gemaclinique.it` ha comune **Roma** e sigla **na**.

── COSA FA ──────────────────────────────────────────────────────────────────
1. **Sposta** il valore attuale in `cercatoIn`: ⛔ non si butta, si chiama con
   il suo nome. Serve a sapere da quale ricerca e' uscita una scheda.
2. **Ricava `provincia` dai dati della scheda stessa**, e solo da quelli:
   · il **comune** e' un capoluogo ⇒ la sigla e' in `province.json` (107 voci);
   · il **CAP** ha una sigla **dominante** fra le schede che ne hanno una
     plausibile (almeno 3 schede e almeno l'80%).
3. **Lascia `provincia` VUOTA** dove ⛔ non e' ricavabile. 🔑 Un campo vuoto e'
   onesto; un campo pieno e sbagliato fa passare le conferme che gli si
   appoggiano — ed e' esattamente quello che e' successo finora.
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
PROVINCE = QUI / "province.json"
SIGLA = re.compile(r"^[A-Za-z]{2}$")
CAP = re.compile(r"^\d{5}$")


def _piatto(s):
    s = "".join(c for c in unicodedata.normalize("NFD", s or "") if not unicodedata.combining(c))
    return re.sub(r"[^a-z]", "", s.lower())


def capoluoghi():
    """`comune appiattito → sigla`, dai 107 capoluoghi di `province.json`."""
    return {_piatto(n): s.lower() for n, s in json.loads(PROVINCE.read_text(encoding="utf-8"))}


def sigle_dai_cap(schede):
    """`CAP → sigla`, ma **solo dove il dato e' forte**.

    ⚠️ Soglia doppia: la sigla dominante deve comparire **almeno 3 volte** e
    coprire **almeno l'80%** delle schede di quel CAP. Senza soglia, 144 CAP su
    796 risultavano **ambigui** — e un CAP intero identifica **un solo** comune,
    quindi l'ambiguita' ⛔ non e' del CAP: e' delle sigle che gia' abbiamo.
    """
    per_cap = collections.defaultdict(collections.Counter)
    for s in schede:
        c, p = (s.get("cap") or "").strip(), (s.get("provincia") or "").strip().lower()
        if CAP.match(c) and SIGLA.match(p):
            per_cap[c][p] += 1
    fuori = {}
    for c, v in per_cap.items():
        sigla, n = v.most_common(1)[0]
        if n >= 3 and n >= 0.8 * sum(v.values()):
            fuori[c] = sigla
    return fuori


def provincia_vera(scheda, capo, da_cap):
    """`(sigla, perche')` dai dati **della scheda**, oppure `(None, None)`."""
    com = _piatto(scheda.get("comune"))
    if com in capo:
        return capo[com], "il comune è un capoluogo di provincia"
    c = (scheda.get("cap") or "").strip()
    if c in da_cap:
        return da_cap[c], f"il CAP {c} ha una sigla dominante fra le schede"
    return None, None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrivi", action="store_true")
    args = ap.parse_args()

    per_file = {}
    for f in sorted(CARTELLA.glob("*.json")):
        if f.name.startswith("_"):
            continue
        try:
            per_file[f] = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
    schede = [s for righe in per_file.values() for s in righe
              if isinstance(s, dict) and s.get("dominio")]
    if not schede:
        print("⚠️  nessuna scheda: ⛔ NON e' stato misurato niente.")
        return 0

    capo, da_cap = capoluoghi(), sigle_dai_cap(schede)
    slug = sum(1 for s in schede
               if (s.get("provincia") or "").strip() and not SIGLA.match((s.get("provincia") or "").strip()))
    ric = {id(s): provincia_vera(s, capo, da_cap) for s in schede}
    trovate = sum(1 for v in ric.values() if v[0])
    disc = [s for s in schede
            if SIGLA.match((s.get("provincia") or "").strip())
            and ric[id(s)][0] and ric[id(s)][0] != (s.get("provincia") or "").strip().lower()]

    print(f"── {len(schede)} schede ──\n")
    print(f"  `provincia` con uno SLUG (dove abbiamo cercato) : {slug}  ({slug/len(schede):.0%})")
    print(f"  🟢 provincia ricavabile dalla scheda stessa      : {trovate}  ({trovate/len(schede):.0%})")
    print(f"     · dal comune capoluogo : "
          f"{sum(1 for v in ric.values() if v[1] and v[1].startswith('il comune'))}")
    print(f"     · dal CAP dominante    : "
          f"{sum(1 for v in ric.values() if v[1] and v[1].startswith('il CAP'))}   "
          f"({len(da_cap)} CAP abbastanza forti)")
    print(f"  ⬜ resta VUOTA                                   : {len(schede)-trovate}")
    print(f"\n  🔴 sigle attuali SMENTITE dai dati della scheda  : {len(disc)}")
    for s in disc[:8]:
        print(f"       {s['dominio'][:30]:32} {str(s.get('comune'))[:14]:16} "
              f"{s.get('provincia')} → {ric[id(s)][0]}")

    if not args.scrivi:
        print("\n(nessun file scritto: --scrivi per farlo)")
        return 0

    spostati = riempite = svuotate = 0
    for f, righe in per_file.items():
        for s in righe:
            if not isinstance(s, dict) or not s.get("dominio"):
                continue
            vecchio = (s.get("provincia") or "").strip()
            if vecchio and not SIGLA.match(vecchio):
                s["cercatoIn"] = vecchio          # ⛔ non si butta: si nomina
                spostati += 1
            elif vecchio:
                s.setdefault("cercatoIn", vecchio)
            nuova, perche = ric[id(s)]
            if nuova:
                s["provincia"] = nuova
                s["precisioneProvincia"] = perche
                riempite += 1
            else:
                if vecchio:
                    svuotate += 1
                s["provincia"] = ""
                s.pop("precisioneProvincia", None)
        f.write_text(json.dumps(righe, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"\n✅ `cercatoIn` scritto su {spostati} schede (lo slug, col suo nome vero)")
    print(f"✅ `provincia` ricavata su {riempite}, svuotata su {svuotate}")
    print("   🔑 Un campo vuoto è onesto; un campo pieno e sbagliato fa passare")
    print("      le conferme che gli si appoggiano.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
