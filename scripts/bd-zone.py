#!/usr/bin/env python3
"""Elenca le zone dell'account Bright Data e prepara le righe per `.env.brightdata`.

🔑 **Perché esiste.** Il 2026-08-15 l'account `hl_6f2fb327` è finito **sospeso**
a metà lavoro e ne è stato creato un altro (`hl_685bc5fb`). In quel passaggio si
perdono tre cose per volta — **nome della zona, password della zona e customer
id** — e ognuna, se sbagliata, dà un errore che ⛔ non dice quale delle tre è:
il servizio risponde «Unknown zone» sia se il nome è vecchio, sia se il token è
di un altro account.
⇒ qui si **chiedono al servizio**, ⛔ non si ricopiano a mano dal cruscotto.

⚠️ Legge soltanto: ⛔ non crea zone e ⛔ non cambia niente.

    set -a && . ./.env.brightdata && set +a && python3 scripts/bd-zone.py
"""
import json, os, sys, urllib.error, urllib.request

CHIAVE = os.environ.get("BRIGHTDATA_API_KEY")
if not CHIAVE:
    raise SystemExit("⛔ manca BRIGHTDATA_API_KEY (`set -a && . ./.env.brightdata && set +a`)")


def api(percorso):
    req = urllib.request.Request(f"https://api.brightdata.com/{percorso}",
                                 headers={"Authorization": f"Bearer {CHIAVE}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            corpo = r.read().decode("utf-8", "replace")
        try:
            return json.loads(corpo), None
        except json.JSONDecodeError:
            return corpo, None
    except urllib.error.HTTPError as e:
        return None, f"HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:120]}"
    except Exception as e:
        return None, f"{type(e).__name__}: {e}"


stato, err = api("status")
if err:
    raise SystemExit(f"⛔ il token ⛔ non risponde — {err}")
cliente = stato.get("customer", "?")
print(f"account   {cliente} · stato «{stato.get('status')}» · "
      f"può fare richieste: {stato.get('can_make_requests')}")
if stato.get("auth_fail_reason"):
    print(f"          ⚠️ auth_fail_reason: {stato['auth_fail_reason']}")

zone, err = api("zone/get_active_zones")
if err:
    raise SystemExit(f"⛔ elenco zone non leggibile — {err}")
if not zone:
    print("\n⛔ NESSUNA ZONA su questo account.")
    print("   Creane una su https://brightdata.com/cp/zones — poi rilancia questo comando.")
    print("   · «SERP API»          → la più economica (~$0,00128 a ricerca)")
    print("   · «Scraping Browser»  → si paga a GB, ma `scoperta-browser.mjs` è già collaudato")
    sys.exit(1)

print(f"\n{len(zone)} zone:")
for z in zone:
    nome = z.get("name") if isinstance(z, dict) else str(z)
    tipo = (z.get("type") or "?") if isinstance(z, dict) else "?"
    pwd, err_p = api(f"zone/passwords?zone={nome}")
    password = (pwd or {}).get("passwords", [None])[0] if isinstance(pwd, dict) else None
    costo, _ = api(f"zone/cost?zone={nome}")
    speso = ""
    if isinstance(costo, dict) and costo:
        d = list(costo.values())[0]
        if isinstance(d, dict):
            speso = f" · speso questo mese ${d.get('back_m0', {}).get('cost', 0):.4f}"
    print(f"  · {nome}  (tipo: {tipo}){speso}")
    if not password:
        print(f"      ⚠️ password non leggibile ({err_p or 'permesso mancante'}): prendila dal cruscotto")
        continue
    # ⚠️ Il customer id viene da `status`, ⛔ non dal file: è **il** campo che
    # cambia quando si passa a un account nuovo, ed è quello che si dimentica.
    print(f"      BD_WSS='wss://brd-customer-{cliente}-zone-{nome}:{password}@brd.superproxy.io:9222'")
    print(f"      BD_ZONA_SERP='{nome}'   # se è una zona SERP API")
