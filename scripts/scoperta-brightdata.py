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
import json, os, re, sys, threading, time, urllib.parse, urllib.request
import concurrent.futures as cf
import importlib.util

QUI = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("r", os.path.join(QUI, "raccolta-cliniche.py"))
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)

CHIAVE = os.environ["BRIGHTDATA_API_KEY"]
# ⚠️ **La zona ⛔ non si scrive più nel codice.** Era `cli_unlocker`, di un
# account che il 2026-08-15 è finito **sospeso**; la chiave nuova appartiene a
# un **account diverso** (`hl_685bc5fb` contro `hl_6f2fb327`) con zone proprie.
# ⇒ un nome di zona fisso ⛔ non è una costante: è **una credenziale**, e come
# tale vive nell'ambiente. Senza, si esce **dicendolo** — perché l'errore
# altrimenti arriva dal servizio come «Unknown zone», che ⛔ non fa capire che
# il nome era nostro e vecchio.
ZONA = os.environ.get("BD_ZONA_SERP") or ""
if not ZONA:
    raise SystemExit("⛔ manca BD_ZONA_SERP: è il nome della zona sul cruscotto Bright Data.\n"
                     "   Caricalo con `set -a && . ./.env.brightdata && set +a`.\n"
                     "   Le zone dell'account si elencano con:\n"
                     "     curl -s -H \"Authorization: Bearer $BRIGHTDATA_API_KEY\" \\\n"
                     "          https://api.brightdata.com/zone/get_active_zones")
STATO = os.path.join(QUI, "stato-scoperta-bd.json")
# 🔑 Qui il tetto **è in dollari e funziona davvero**, a differenza di
# `scoperta-browser.mjs`: `/zone/cost` vuole il Bearer, e con questa chiave ce
# l'abbiamo. ⇒ la spesa si legge dal **contatore di Bright Data**, ⛔ non da una
# nostra stima di byte.
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
    speso, fatte_dal_controllo = 0.0, 0
    print(f"tetto ${TETTO_DOLLARI:.2f} · speso finora questo mese ${partenza:.4f} · "
          f"zona {ZONA}", flush=True)

    finestre = st.setdefault("resa", {})
    lucchetto = threading.Lock()
    fermati = threading.Event()
    PARALLELI = int(os.environ.get("BD_PARALLELI", "6"))
    print(f"  {len(bersagli)} località · {PARALLELI} in parallelo", flush=True)

    def lavora(bersaglio):
        """🔑 **Si parallelizza FRA località, ⛔ non dentro.** La regola di resa
        guarda **le ultime 8 ricerche di quella località**: eseguirle fuori
        ordine ⛔ non la accelera, la **falsa** — la finestra smetterebbe di
        misurare «quanto rende continuare qui» e misurerebbe una mescolanza
        casuale. ⇒ ogni thread prende **una località intera** e la lavora in
        ordine; il parallelismo sta nel numero di località aperte insieme.
        ⚠️ Le richieste sono I/O: i thread bastano, ⛔ non serve altro."""
        global speso, fatte_dal_controllo
        citta, sigla, pool = bersaglio
        with lucchetto:
            if sigla in st["chiuse"] or sigla in gratis.get("chiuse", []):
                return
        for m in pool:
            if fermati.is_set():
                return
            k = f"{sigla}|{m}"
            with lucchetto:
                if k in st["fatte"] or k in gratis["fatte"]:
                    continue
                # ⚠️ Il costo si chiede **ogni 25 ricerche**, ⛔ non ad ognuna:
                # era una chiamata API in più **per ogni ricerca**, cioè il
                # doppio del traffico per un controllo che a $0,00064 l'una può
                # sforare al massimo di **due centesimi**.
                if fatte_dal_controllo % 25 == 0:
                    speso = costo_ora() - partenza
                fatte_dal_controllo += 1
                if speso >= TETTO_DOLLARI:
                    print(f"\n⛔ tetto raggiunto: ${speso:.2f}. Fermo.", flush=True)
                    fermati.set()
                    return
            # ⚠️ **La rete sta FUORI dal lucchetto**, o i thread si metterebbero
            # in fila proprio sulla parte lenta e il parallelismo sarebbe finto.
            url = cerca(m.format(c=citta))
            with lucchetto:
                nuovi = 0
                for u in url:
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
                # ⚠️ Salvataggio **dentro** il lucchetto: due thread che scrivono
                # lo stesso JSON lo troncano, ed è il guasto che ⛔ non si vede
                # finché ⛔ non si rilegge. ⚠️ E si scrive **ogni 10**, ⛔ non ad
                # ogni ricerca: a 6 thread erano 6 riscritture al secondo di un
                # file da 250 KB.
                if len(st["fatte"]) % 10 == 0 or nuovi or chiusa:
                    json.dump(st, open(STATO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
                print(f"  {sigla:22} «{m.format(c=citta)[:38]}» +{nuovi} → {len(st['domini'])}"
                      + (f" · ⛔ {sigla} esaurita" if chiusa else f" · ${speso:.2f}"), flush=True)
                if chiusa:
                    return

    with cf.ThreadPoolExecutor(max_workers=PARALLELI) as pool_thread:
        list(pool_thread.map(lavora, bersagli))
    with lucchetto:
        json.dump(st, open(STATO, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n═══ {len(st['domini'])} domini nuovi · speso ${costo_ora()-partenza:.2f} ═══")
