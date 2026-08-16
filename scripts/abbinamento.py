#!/usr/bin/env python3
"""Abbinamento paziente → medico, nella **sola forma lecita** — TD-156.

🔴 **La linea da ⛔ non superare, e ⛔ non è una cautela: è il confine
dell'esercizio abusivo della professione.**

    LECITO      «chi fa il filler, vicino a me»      ← il paziente sceglie
    ⛔ VIETATO  «per le tue rughe serve il filler»    ← è un ATTO MEDICO

Il brain di medicina estetica lo dice con le fonti: la scelta del trattamento
dipende da una **valutazione in presenza** — fototipo di Fitzpatrick, qualità e
spessore della pelle, lassità, danno attinico, atrofia ossea e adiposa,
simmetria, **analisi dinamica** (il volto in movimento), etnia, genere — e il
piano **cambia fra una seduta e l'altra dello stesso paziente**, con un ordine
obbligato (il terzo medio **prima** di quello superiore e inferiore, poi si
rivaluta). ⇒ ⛔ **nessun software può sostituirla**, e chi ci provasse ⛔ non
sbaglierebbe «di poco»: farebbe **un'altra cosa**.

Da qui tre regole che il codice fa rispettare, ⛔ non solo raccomanda:

1. **Il glossario mappa SINONIMI, ⛔ non sintomi.** «botox» → *Tossina
   botulinica* è un **sinonimo** (la stessa cosa, detta come la dice la gente).
   «rughe della fronte» → *Tossina botulinica* sarebbe **un consiglio clinico**,
   e ⛔ non sta qui. La differenza ⛔ non è sottile: nel primo caso il paziente ha
   già scelto, nel secondo **scegliamo noi al posto di un medico**.
2. **Filtri DURI prima, ordinamento dopo.** Chi ⛔ non fa quel trattamento ⛔ non
   compare — ⛔ non compare «più in basso».
3. **⛔ Nessun punteggio verso l'esterno.** L. 145/2018 c. 525 esclude
   «qualsiasi elemento di carattere attrattivo e suggestivo»: un «93 %
   compatibile» accanto a un nome **è una classifica**. L'ordinamento esiste
   **dentro**; ⛔ non esce.

⛔ **E il testo del paziente ⛔ non si conserva**: «ho le rughe e una cicatrice»
è dato dell'**art. 9** — sanitario **anche per inferenza** (CGUE C-184/20).
Questo modulo ⛔ non scrive **niente** da nessuna parte.
"""
import json, math, os, sqlite3, sys, unicodedata

QUI = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(QUI, "directory.sqlite")

# 🔑 **Sinonimi, ⛔ non sintomi.** Ogni riga è «un modo diverso di dire la stessa
# cosa», ⛔ mai «un problema e la sua cura». ⚠️ Se un giorno qualcuno aggiunge
# `"rughe": "Tossina botulinica"`, questo file smette di essere un glossario e
# diventa **un consulto**: il controllo `--lint` qui sotto lo intercetta.
VOCABOLARIO = {
    "Filler": ["filler", "acido ialuronico", "riempimento", "fillers"],
    "Tossina botulinica": ["botulino", "botox", "tossina botulinica", "tossina"],
    "Biostimolazione": ["biostimolazione", "biorivitalizzazione", "skinbooster", "profhilo"],
    "Peeling chimico": ["peeling", "peeling chimico"],
    "Laser": ["laser", "trattamento laser"],
    "Mesoterapia": ["mesoterapia"],
    "Radiofrequenza": ["radiofrequenza"],
    "Fili di trazione": ["fili di trazione", "fili riassorbibili", "fili"],
    "Trattamento cicatrici": ["cicatrici", "trattamento cicatrici"],
    "Epilazione": ["epilazione", "epilazione laser", "depilazione definitiva"],
}

# ⛔ **Parole che ⛔ NON devono comparire nel vocabolario**: sono **disturbi**, e
# associarle a un trattamento significherebbe rispondere a *«che cosa ho»*
# invece che a *«chi fa X»*. L'elenco ⛔ non è esaustivo per caso: serve a far
# fallire il controllo quando qualcuno prova ad allargare il glossario nella
# direzione sbagliata.
SINTOMI_VIETATI = [
    "ruga", "rughe", "acne", "cicatrice da", "macchia", "macchie", "couperose",
    "cellulite", "smagliature", "calvizie", "alopecia", "occhiaie", "lassità",
    "invecchiamento", "melasma", "rosacea", "adiposità", "ptosi",
]


def _piatto(s):
    return "".join(c for c in unicodedata.normalize("NFD", (s or "").lower())
                   if not unicodedata.combining(c)).strip()


def lint_vocabolario():
    """Fa fallire la costruzione se il glossario è scivolato verso il consulto."""
    guai = []
    for prestazione, sinonimi in VOCABOLARIO.items():
        for s in sinonimi:
            for sintomo in SINTOMI_VIETATI:
                if sintomo in _piatto(s):
                    guai.append(f"«{s}» → {prestazione}: «{sintomo}» è un DISTURBO, "
                                f"⛔ non un sinonimo del trattamento")
    if guai:
        print("⛔ IL GLOSSARIO È DIVENTATO UN CONSULTO:")
        for g in guai:
            print(f"   {g}")
        print("\n   Un glossario dice **come si chiama** una cosa.\n"
              "   Dire quale trattamento serve per un disturbo è **un atto medico**.")
        return False
    print(f"✅ glossario sano — {len(VOCABOLARIO)} trattamenti, "
          f"{sum(len(v) for v in VOCABOLARIO.values())} modi di chiamarli, 0 sintomi")
    return True


def riconosci(testo):
    """Da come lo dice il paziente al nome della prestazione. ⛔ Torna vuoto se
    ⛔ non riconosce: **⛔ non indovina**, e ⛔ non propone un ripiego «simile»."""
    t = _piatto(testo)
    return sorted({p for p, sin in VOCABOLARIO.items() if any(_piatto(s) in t for s in sin)})


def cerca(prestazione, lat=None, lon=None, raggio_km=30, solo=None, limite=20):
    """Filtri **duri**, poi ordinamento. ⛔ Nessun punteggio in uscita.

    🔴 **Limite misurato il 2026-08-16, e ⛔ non è un difetto di questo modulo:**
    la prima prova ha restituito **tutti i risultati a 0,3 km**. Il motivo è a
    monte — il **77 % delle coordinate è del CENTRO DEL COMUNE**, ⛔ non del
    civico (vedi `precisioneCoord`) ⇒ **dentro una stessa città sono tutti nello
    stesso punto**, e ordinarli per distanza ⛔ non discrimina niente.
    ⇒ **La distanza separa le CITTÀ, ⛔ non gli studi di una città.** Il campo
    `precisione` esce insieme al risultato **apposta**: chi costruirà la pagina
    deve poter dire *«a Milano»* invece di *«a 0,3 km»*, che sarebbe **falso**.
    ⚠️ Per ordinare **dentro** una città servirebbe il civico, cioè una
    geocodifica puntuale — che la *usage policy* di Nominatim ⛔ non concede in
    blocco. ⇒ o un servizio a pagamento, o ⛔ non si ordina per distanza in città.
    """
    db = sqlite3.connect(DB)
    sql = ["SELECT s.dominio, s.nome, s.comune, s.lat, s.lon, s.tipo, s.telefono,",
           "       s.precisione_coord,",
           "       (SELECT COUNT(*) FROM prestazioni q WHERE q.dominio = s.dominio) AS ricchezza",
           "FROM studi s JOIN prestazioni p USING(dominio) WHERE p.prestazione = ?"]
    arg = [prestazione]
    if solo:                                   # filtro DURO sul tipo di soggetto
        sql.append("AND s.tipo = ?"); arg.append(solo)
    if lat is not None and lon is not None:
        d1 = raggio_km / 111.0
        d2 = raggio_km / (111.0 * max(0.2, math.cos(math.radians(lat))))
        sql.append("AND s.lat BETWEEN ? AND ? AND s.lon BETWEEN ? AND ?")
        arg += [lat - d1, lat + d1, lon - d2, lon + d2]
    righe = db.execute(" ".join(sql), arg).fetchall()

    def km(a, b, c, d):
        return 2 * 6371 * math.asin(math.sqrt(
            math.sin(math.radians(c - a) / 2) ** 2 + math.cos(math.radians(a)) *
            math.cos(math.radians(c)) * math.sin(math.radians(d - b) / 2) ** 2))

    fuori = []
    for r in righe:
        d = km(lat, lon, r[3], r[4]) if (lat is not None and r[3]) else None
        if d is not None and d > raggio_km:     # il riquadro è largo: si rifinisce
            continue
        fuori.append({"dominio": r[0], "nome": r[1], "comune": r[2], "tipo": r[5],
                      "telefono": r[6], "precisione": r[7],
                      "distanzaKm": round(d, 1) if d is not None else None,
                      # ⚠️ `_ordine` ha l'underscore **apposta**: è interno.
                      # ⛔ Non deve finire in una pagina, o diventa una classifica.
                      "_ordine": (round(d, 1) if d is not None else 999, -r[8])})
    fuori.sort(key=lambda x: x["_ordine"])
    for x in fuori:
        del x["_ordine"]
    return fuori[:limite]


if __name__ == "__main__":
    if "--lint" in sys.argv:
        sys.exit(0 if lint_vocabolario() else 1)
    if not os.path.exists(DB):
        raise SystemExit("⛔ manca directory.sqlite: `python3 scripts/costruisci-db.py`")
    lint_vocabolario()
    print("\n━━━ il giro completo, come lo farebbe un paziente ━━━")
    for frase in ["vorrei il botox", "cerco un filler per le labbra", "peeling"]:
        p = riconosci(frase)
        print(f"\n  «{frase}» → {p or '⛔ non riconosciuto (⛔ non si indovina)'}")
        for pr in p[:1]:
            r = cerca(pr, lat=45.4642, lon=9.19, raggio_km=15, limite=3)
            print(f"     {len(r)} entro 15 km da Milano:")
            for x in r:
                print(f"       {x['distanzaKm']:5} km  {x['nome'][:38]:38} "
                      f"({x['tipo']}, {x['precisione']})")
    print("\n  «ho le rughe della fronte» → ", end="")
    print(riconosci("ho le rughe della fronte") or
          "⛔ NIENTE, ed è corretto: è un disturbo, e dire cosa serve è un atto medico.")
