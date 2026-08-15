#!/usr/bin/env python3
"""Scoperta via SERP a pagamento — **in parallelo** a quella gratuita.

🔑 **Perché serve, e ⛔ non è un ripiego.** La scoperta gratuita dipende da **un
solo** servizio, e quel servizio ci sta stringendo: 57 blocchi, pausa salita da
20 a 84 secondi, stima passata da 20 a oltre 100 ore. Questa lavora **dalla coda
dell'elenco** mentre l'altra lavora dalla testa: si incontrano nel mezzo.

⚠️ **Stato SEPARATO, ⛔ non condiviso.** Due processi che scrivono lo stesso file
JSON lo corrompono, e il danno ⛔ non si vede subito — si vede quando il file
⛔ non si rilegge più, cioè quando è troppo tardi. ⇒ questo scrive
`stato-scoperta-bd.json` e la fusione si fa **dopo**, a processi fermi.

⚠️ **Tetto di spesa esplicito.** ⛔ Non si lascia correre un servizio a consumo
sperando che basti: si conta, e ci si ferma. Il contatore vero è quello di
Bright Data, ⛔ non il nostro — l'unico che sa davvero cosa è stato fatturato.
"""
import json, os, re, sys, time, urllib.parse, urllib.request
import importlib.util

QUI = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("r", os.path.join(QUI, "raccolta-cliniche.py"))
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)

CHIAVE = os.environ["BRIGHTDATA_API_KEY"]
ZONA = "cli_unlocker"
STATO = os.path.join(QUI, "stato-scoperta-bd.json")
TETTO_DOLLARI = float(os.environ.get("TETTO_DOLLARI", "4.00"))

def costo_ora():
    q = urllib.request.Request(f"https://api.brightdata.com/zone/cost?zone={ZONA}",
                               headers={"Authorization": f"Bearer {CHIAVE}"})
    with urllib.request.urlopen(q, timeout=30) as x:
        d = list(json.load(x).values())[0]
    return d.get("back_m0", {}).get("cost", 0.0)

def cerca(query):
    """SERP con risultati **già strutturati** (`brd_json=1`): ⛔ nessun parsing
    di HTML che cambia sotto i piedi."""
    u = ("https://www.google.com/search?q=" + urllib.parse.quote_plus(query)
         + "&num=20&gl=it&hl=it&brd_json=1")
    corpo = json.dumps({"zone": ZONA, "url": u, "format": "raw"}).encode()
    req = urllib.request.Request("https://api.brightdata.com/request", data=corpo,
                                 headers={"Authorization": f"Bearer {CHIAVE}",
                                          "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as x:
            d = json.loads(x.read().decode("utf-8", "replace"))
    except Exception as e:
        print(f"    ✗ {type(e).__name__}", flush=True)
        return []
    # ⛔ SOLO `organic`: lo `snack_pack` **è** la scheda Maps, cioè la raccolta
    # altrui — la regola ⛔ non cambia perché qui stiamo pagando.
    return [o.get("link", "") for o in d.get("organic", []) if o.get("link", "").startswith("http")]

def carica():
    if os.path.exists(STATO):
        return json.load(open(STATO, encoding="utf-8"))
    return {"fatte": [], "domini": {}, "scartati": {}, "chiuse": [], "resa": {}}

if __name__ == "__main__":
    prov = json.load(open(os.path.join(QUI, "province.json"), encoding="utf-8"))
    comuni = json.load(open(os.path.join(QUI, "comuni.json"), encoding="utf-8"))
    base = r.MODELLI + r.MODELLI_PROFESSIONISTI + r.MODELLI_TRATTAMENTO
    bersagli = [(c, s, base + r.MODELLI_PROFONDI) for c, s in prov]
    bersagli += [(c, c, r.MODELLI_COMUNE + base + r.MODELLI_PROFONDI) for c in comuni]
    # 🔑 **Dalla coda**: il processo gratuito parte dalla testa. ⛔ Non si
    # coordinano fra loro — si evitano per costruzione, che è più robusto.
    bersagli.reverse()

    st = carica()
    gratis = json.load(open(r.STATO_P6, encoding="utf-8"))
    noti = set(gratis["domini"]) | set(st["domini"])
    partenza = costo_ora()
    print(f"tetto ${TETTO_DOLLARI:.2f} · speso finora questo mese ${partenza:.4f}", flush=True)

    finestre = st.setdefault("resa", {})
    for citta, sigla, pool in bersagli:
        if sigla in st["chiuse"] or sigla in gratis.get("chiuse", []):
            continue
        for m in pool:
            k = f"{sigla}|{m}"
            if k in st["fatte"] or k in gratis["fatte"]:
                continue
            speso = costo_ora() - partenza
            if speso >= TETTO_DOLLARI:
                print(f"\n⛔ tetto raggiunto: ${speso:.2f}. Fermo.", flush=True)
                json.dump(st, open(STATO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
                sys.exit(0)
            nuovi = 0
            for u in cerca(m.format(c=citta)):
                h = r.host_di(u)
                if not h:
                    continue
                if r.da_escludere(u):
                    st["scartati"][h] = st["scartati"].get(h, 0) + 1
                elif h not in noti:
                    st["domini"][h] = sigla
                    noti.add(h)
                    nuovi += 1
            st["fatte"].append(k)
            f = finestre.setdefault(sigla, [])
            f.append(nuovi)
            chiusa = len(f) >= 8 and sum(f[-8:]) / 8 < 1.0
            if chiusa:
                st["chiuse"].append(sigla)
            json.dump(st, open(STATO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            print(f"  {sigla:22} «{m.format(c=citta)[:38]}» +{nuovi} → {len(st['domini'])}"
                  + (f" · ⛔ {sigla} esaurita" if chiusa else f" · ${speso:.2f}"), flush=True)
            if chiusa:
                break
    print(f"\n═══ {len(st['domini'])} domini nuovi · speso ${costo_ora()-partenza:.2f} ═══")
