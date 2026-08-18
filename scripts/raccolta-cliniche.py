#!/usr/bin/env python3
"""Raccolta delle cliniche di medicina estetica dai loro siti — canale paziente.

    python3 scripts/raccolta-cliniche.py Milano:MI Roma:RM
    python3 scripts/raccolta-cliniche.py --geocodifica MI RM

🔑 **La regola che rende lecita tutta l'operazione è una sola: i fatti sono
liberi, le raccolte altrui no.** Da qui discende la forma del programma:

  · la **scoperta** prende dal motore di ricerca **solo l'indirizzo del sito**,
    mai un dato di contenuto;
  · la **lettura** prende i fatti **dal sito della clinica**, e ogni campo si
    porta dietro `fonteUrl` — la pagina esatta da cui viene;
  · gli aggregatori sono esclusi **prima di scaricare** ([[domini-esclusi]]),
    perché filtrare a valle vorrebbe dire aver già estratto.

**Imprese e professionisti si separano, ⛔ ma non perché uno dei due sia
vietato.** ⚠️ Questo commento diceva che raccogliere un libero professionista
«riapre gli obblighi GDPR» come se fosse un divieto: **è sbagliato**, e la
correzione è del 2026-08-13 dopo aver letto le fonti invece di ricordarle.

  · sul **professionista** il GDPR si applica, e la base c'è: legittimo
    interesse (art. 6.1.f). Il considerando 47 lo àncora alle «ragionevoli
    aspettative»: chi pubblica il proprio recapito **per farsi trovare dai
    pazienti** può aspettarsi di finire in un elenco che gli manda pazienti.
    E l'art. 6.4 chiede il «nesso tra le finalità»: qui la finalità ⛔ non è
    compatibile, è **la stessa**;
  · restano **tre obblighi**, tutti eseguibili: informativa (art. 14 — in
    forma non individuale sul nostro sito, come fa l'art. 4 del Codice
    deontologico sull'informazione commerciale), diritto di opposizione
    (art. 21), esattezza e aggiornamento — quest'ultimo è già il campo
    `fonteUrl`, che il Codice deontologico impone all'art. 3 c. 4 lett. b;
  · sull'**impresa** il GDPR ⛔ non si applica affatto ⇒ zero obblighi. Da qui
    la separazione: ⛔ non è «lecito contro illecito», è **quanto lavoro
    comporta**, e la scelta di pubblicare i professionisti è di prodotto.

🔴 **Il vincolo vero ⛔ non è il canale, è la finalità.** «Non gli scriviamo,
ci scoprono loro» regge **finché queste schede ⛔ non diventano un elenco di
prospect**: se finiscono nel CRM come contatti da lavorare, la finalità
diventa prospezione commerciale e l'art. 6.4 si valuta su quella, ⛔ non sul
fatto che il messaggio non sia ancora partito.
⇒ **Da qui ⛔ non si scrive mai nel CRM.** È il gemello della regola già
scritta in testa a `src/lib/medici-pubblici.ts` («da qui non si legge mai il
CRM»): stesso muro, verso opposto. Un medico entra nel CRM **solo quando si fa
vivo lui**.

⚠️ E ⛔ non è un dato dell'art. 9: la specialità di un medico è la sua
**professione**, ⛔ non la sua salute.

⚠️ **La regola sui nomi è cambiata il 2026-08-13** e prima diceva «nessun nome
di persona entra nel database». ⛔ Non regge più da quando si pubblicano anche i
professionisti: **su di loro il nome è l'insegna** — è il titolo del sito, è
come il paziente li cerca, ed è quello che rende verificabile l'iscrizione
all'albo. Toglierlo darebbe una scheda senza soggetto.

⛔ **Resta fuori chi ⛔ non è l'insegna**: il direttore sanitario di una clinica
e il resto dello staff. Di loro si registra **se sono dichiarati**, ⛔ non **chi
sono** — ⚠️ la differenza ⛔ non è la categoria di dato, è **chi ha scelto di
esporsi**: un professionista pubblica il proprio nome per farsi trovare, un
dipendente ⛔ no.

Bright Data ⛔ non serve: misurato il 2026-08-13 su 16 siti, la lettura diretta
li ha presi **16/16 con schede identiche** (una perfino più completa) a costo
zero. Vedi `log.md`, voce «Prova di raccolta cliniche».
"""
import gzip
import hashlib
import html
import json, os, re, sys, threading, time, unicodedata
import urllib.error, urllib.parse, urllib.request
import urllib.robotparser
from concurrent.futures import ThreadPoolExecutor, as_completed

QUI = os.path.dirname(os.path.abspath(__file__))
RADICE = os.path.dirname(QUI)
USCITA = os.path.join(RADICE, "src", "dati", "cliniche")
CONTATTO = "https://fibonaccimedica.it"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")
INTESTAZIONI = {"User-Agent": UA, "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
                "Accept": "text/html,application/xhtml+xml,*/*;q=0.8"}

# ═════════════════════════════════════════════════ lista di esclusione
def domini_esclusi():
    """Legge [[domini-esclusi]] dal file TS: una sola fonte di verità.

    🔴 **Questo lettore ha sbagliato due volte, e ⛔ non ha mai protestato.**
    Le due lezioni sono diverse e valgono entrambe:

    1. **2026-08-13, mattina** — si divideva sulla prima `]`, che sta dentro
       l'annotazione `readonly string[]` ⇒ **zero domini letti**. MioDottore,
       TopDoctors e Doctolib finirono nella raccolta;
    2. **2026-08-13, sera** — un apostrofo **dentro un commento**
       (`directory d'impresa`) sfasa l'accoppiamento degli apici: da lì in poi
       Pagine Gialle, Google, Facebook, Instagram e le federazioni ⛔ non erano
       più bloccati. ⚠️ E il controllo «almeno 10 voci» **è passato**, perché
       di stringhe ne contava 24 — erano 24 stringhe sbagliate.

    🔑 ⇒ **contare ⛔ non è validare.** Si tolgono i commenti prima di leggere,
    e poi si pretende che **ogni voce somigli a un dominio**: è quel controllo,
    ⛔ non il conteggio, che avrebbe fermato entrambi i difetti.
    """
    p = os.path.join(RADICE, "src", "lib", "domini-esclusi.ts")
    corpo = open(p, encoding="utf-8").read()
    corpo = corpo.split("DOMINI_ESCLUSI", 1)[1].split("= [", 1)[1].split("\n]", 1)[0]
    corpo = re.sub(r'//[^\n]*', '', corpo)      # ⛔ i commenti fuori: contengono apostrofi
    lista = re.findall(r"'([^']+)'", corpo)
    storti = [d for d in lista if not re.fullmatch(r'[a-z0-9][a-z0-9.\-]{2,60}\.[a-z]{2,10}', d)]
    if storti or len(lista) < 10:
        raise SystemExit(f"⛔ lista di esclusione illeggibile: {len(lista)} voci, "
                         f"{len(storti)} ⛔ non sono domini ({storti[:3]}) — "
                         "⛔ non si scarica niente finché non torna leggibile.")
    return lista

ESCLUSI = domini_esclusi()

def host_di(url):
    try:
        return (urllib.parse.urlparse(url).hostname or "").lower().removeprefix("www.")
    except Exception:
        return ""

def da_escludere(url):
    h = host_di(url)
    return True if not h else any(h == d or h.endswith("." + d) for d in ESCLUSI)

# ═════════════════════════════════════════════════ rete
_LUCCHETTO = threading.Lock()
CONTI = {"ricerche": 0, "pagine": 0, "falliti": 0, "robots_no": 0, "da_cache": 0}

def conta(k, n=1):
    with _LUCCHETTO:
        CONTI[k] += n

CACHE = os.path.join(RADICE, "raccolta-cache")
GIORNI_CACHE = 14

def percorso_cache(url):
    """⚠️ **Compressa, e ⛔ non è un dettaglio di comodo.** 995 pagine in chiaro
    pesano **179 MB** (~180 KB l'una): su 15.000 siti × 12 pagine farebbe **~32
    GB** sul disco dell'utente. Con gzip scende sotto i 5 GB, e l'HTML si
    comprime di 6-8× perché è quasi tutto markup ripetuto.
    ⛔ Si comprime e basta: ⛔ non si sfoltisce l'HTML prima di salvarlo — dentro
    i `<script type="application/ld+json">` c'è il **JSON-LD**, che spesso
    contiene indirizzo, telefono e orari già strutturati."""
    return os.path.join(CACHE, host_di(url) or "_sconosciuto",
                        hashlib.sha1(url.encode()).hexdigest()[:16] + ".html.gz")

def leggi(url, timeout=25, cache=True):
    """Legge una pagina, **conservandola su disco**.

    🔑 **La cache ⛔ non è un'ottimizzazione: è ciò che rende possibile lavorare
    sul vocabolario.** Portarlo da 10 a ~200 voci richiede decine di
    iterazioni; senza cache ognuna ⇒ **una scansione nazionale**, e per giunta
    ⛔ non confrontabile — se la resa cambia ⛔ non si sa se è migliorata
    l'estrazione o se è cambiato il sito. Con i byte fermi, la differenza è
    **solo** il dizionario.

    ⚠️ **La cache è dato personale come le schede**, ⛔ non un file tecnico:
    stessa scadenza, e va cancellata quando qualcuno si oppone (`--dimentica`).
    """
    p = percorso_cache(url)
    if cache and os.path.exists(p) and time.time() - os.path.getmtime(p) < GIORNI_CACHE * 86400:
        try:
            testo = gzip.open(p, "rt", encoding="utf-8").read()
            finale, _, corpo = testo.partition("\n")   # 1ª riga: l'URL dopo i reindirizzamenti
            conta("da_cache")
            return corpo, finale
        except Exception:
            pass
    try:
        with urllib.request.urlopen(
                urllib.request.Request(url, headers=INTESTAZIONI), timeout=timeout) as r:
            grezzo = r.read(3_000_000)
            tipo = r.headers.get_content_charset() or "utf-8"
            corpo, finale = grezzo.decode(tipo, "replace"), r.geturl()
            if cache:
                os.makedirs(os.path.dirname(p), exist_ok=True)
                with gzip.open(p, "wt", encoding="utf-8", compresslevel=6) as f:
                    f.write(f"{finale}\n{corpo}")
            return corpo, finale
    except Exception:
        return None, None

_ROBOTS = {}

def robots_permette(url):
    """⚠️ Si chiede al sito **prima** di leggerlo. Se `robots.txt` non risponde
    si procede (assenza ≠ divieto), se vieta si rinuncia al dominio intero."""
    h = host_di(url)
    with _LUCCHETTO:
        rp = _ROBOTS.get(h)
    if rp is None:
        rp = urllib.robotparser.RobotFileParser()
        testo, _ = leggi(f"https://{h}/robots.txt", timeout=12)
        try:
            rp.parse((testo or "").splitlines())
        except Exception:
            rp.parse([])
        with _LUCCHETTO:
            _ROBOTS[h] = rp
    try:
        return rp.can_fetch(UA, url)
    except Exception:
        return True

# ═════════════════════════════════════════════════ 1. scoperta
MODELLI = [
    "studio medicina estetica {c}",
    "centro medicina estetica {c}",
    "ambulatorio medicina estetica {c}",
    "poliambulatorio medicina estetica {c}",
    "clinica medicina estetica {c}",
    "medicina estetica {c} filler acido ialuronico",
    "medicina estetica {c} tossina botulinica",
    "medicina estetica {c} biostimolazione viso",
]
# 🔑 I **professionisti** ⛔ non escono dalle ricerche qui sopra: chi cerca
# «studio medicina estetica» trova le insegne, ⛔ non i medici. Servono parole
# diverse — misurato il 2026-08-13: queste quattro hanno restituito **dieci
# domini nuovi** che le otto precedenti ⛔ non avevano mai visto.
# ⚠️ E fanno emergere **un'altra famiglia di aggregatori** (Guidaestetica,
# iDoctors): la lista di esclusione si allunga ad ogni nuovo taglio di ricerca.
# 🔑 **Misurato il 2026-08-14: la griglia ⛔ non satura.** 14 query in più su
# Milano — che ne aveva già 12 — hanno reso **49 domini nuovi (+76%)**. E la resa
# dice dove sta la leva: **comuni della provincia 6,8 nuovi/query**, trattamento
# specifico 3,5, **quartieri della città 2,3** — i quartieri sembravano l'idea
# furba e sono i peggiori.
# ⚠️ E la profondità ⛔ non è una via d'uscita: su DuckDuckGo la pagina 2 rende
# **0 domini nuovi** (il parametro `s=` è ignorato) ⇒ 10 risultati per ricerca è
# un **tetto**, e la copertura si prende solo con **più query diverse**.
MODELLI_TRATTAMENTO = [
    "botulino {c} medico",
    "filler labbra {c}",
    "laser viso {c} medico",
    "criolipolisi {c}",
    "biorivitalizzazione viso {c}",
    "chirurgo plastico {c}",
]
# Per i **comuni** bastano quattro modelli: sono centri piccoli, e oltre il
# quarto la resa crolla perché l'inventario locale finisce, ⛔ non il motore.
MODELLI_COMUNE = [
    "medicina estetica {c}",
    "medico estetico {c}",
    "centro medico estetico {c}",
    "filler {c}",
]
# 🔴 **Misurato il 2026-08-14: il soffitto ⛔ non è il ranking, è la nostra
# pigrizia.** Avevo ipotizzato che il limite fosse strutturale — «il motore dà 10
# risultati e restituisce solo chi si posiziona, la coda lunga è invisibile».
# **È falso**, e la prova l'ha smontato: 40 query nuove su Milano, che ne aveva
# già 18, hanno portato **+107 domini (84 → 191)**, e le **ultime 10 rendevano
# ancora 22**. ⇒ ⛔ non stiamo campionando i più visibili: stiamo **facendo
# troppe poche domande**.
# 🔑 ⇒ la profondità della griglia va **proporzionata alla città**: 58 modelli
# per le grandi, 18 per i capoluoghi minori, 4 per i comuni.
MODELLI_PROFONDI = [
    "rughe viso {c} medico estetico", "acido ialuronico viso {c}", "peeling viso {c} medico",
    "mesoterapia {c}", "fili di trazione viso {c}", "blefaroplastica {c}", "rinofiller {c}",
    "lipofilling viso {c}", "radiofrequenza viso {c}", "microneedling {c}", "PRP viso {c}",
    "trattamento occhiaie {c}", "zigomi filler {c}", "mento filler {c}", "cellulite {c} medico",
    "criolipolisi addome {c}", "epilazione laser {c} medico", "macchie viso laser {c}",
    "couperose {c} medico", "acne cicatrici {c} medico", "caduta capelli {c} medico",
    "iperidrosi ascellare {c}", "medicina estetica {c} prima visita", "ambulatorio estetico {c}",
    "poliambulatorio estetico {c}", "clinica estetica {c} prezzi", "medico estetico {c} centro",
    "medicina anti-aging {c}", "medicina rigenerativa viso {c}", "dermatologo estetico {c}",
    "specialista filler {c}", "botulino rughe fronte {c}", "skinbooster {c}", "profhilo {c}",
    "trattamento viso uomo {c}", "medicina estetica {c} nord", "medicina estetica {c} sud",
    "studio medicina estetica {c} centro", "centro laser {c} medico", "medicina estetica corpo {c}",
    "rimodellamento corpo {c}", "trattamento collo {c} medico", "décolleté trattamento {c}",
    "mani ringiovanimento {c}", "smagliature {c} medico", "medicina estetica {c} uomo",
    "labbra volume {c} medico", "sopracciglia lifting {c}", "doppio mento {c} trattamento",
    "medicina estetica {c} recensioni", "chirurgia estetica {c} clinica", "medico estetico {c} online",
    "prenota medicina estetica {c}", "consulenza medicina estetica {c}", "aesthetic clinic {c}",
    "medicina estetica {c} viso naturale", "biorivitalizzante {c}", "vitamine viso {c} medico",
    "ossigenoterapia viso {c}", "carbossiterapia {c}", "pressoterapia {c} medico",
    "onde d urto cellulite {c}", "laser co2 frazionato {c}", "hifu {c} lifting",
    "ultherapy {c}", "morpheus8 {c}", "emsculpt {c}",
]
# 🔑 **Quattro modelli su 85 cercavano una persona, e infatti le persone erano
# 324 su 1.986.** ⚠️ Il difetto ⛔ non era solo la classificazione (corretta il
# 2026-08-15: +326 professionisti recuperati **dalle schede già raccolte**):
# metà del problema è **a monte**, nella domanda che si fa al motore. «studio
# medicina estetica {c}» trova insegne; un libero professionista ⛔ non ha
# un'insegna — ha **un titolo, un albo e un cognome**.
# ⇒ i modelli qui sotto cercano *come si presenta una persona*, ⛔ non una
# struttura. Misurato sul motore prima di scriverli: `"medico estetico" Milano
# "iscritto all'albo"` rende **9 host** contro i 2 di una query con `site:`.
MODELLI_PROFESSIONISTI = [
    "medico estetico {c} studio privato",
    "dottoressa medicina estetica {c} studio",
    "specialista medicina estetica {c} visita",
    "medico estetico {c} filler labbra",
    # ⚠️ Le virgolette **contano**: senza, il motore allarga a «medicina
    # estetica» generico e torna la stessa manciata di portali.
    '"medico estetico" {c} "iscritto all\'albo"',
    '"medicina estetica" {c} "ordine dei medici"',
    "dott medicina estetica {c} sito ufficiale",
    "dott.ssa medicina estetica {c} studio",
    "specialista in medicina estetica {c} curriculum",
    "chirurgo plastico {c} studio privato",
    "dermatologo {c} medicina estetica studio",
    "medico estetico {c} biografia formazione",
    "medico chirurgo estetico {c} riceve su appuntamento",
    "medicina estetica {c} dott visita privata",
]

def scopri(citta, pausa=4.0):
    """⛔ Dal motore si prende **solo l'URL**: nessun titolo, nessuno snippet,
    nessuna scheda. Il contenuto arriva dal sito della clinica."""
    trovati, scartati = {}, {}
    for i, modello in enumerate(MODELLI + MODELLI_PROFESSIONISTI):
        q = urllib.parse.quote_plus(modello.format(c=citta))
        testo, _ = leggi(f"https://html.duckduckgo.com/html/?q={q}&kl=it-it", timeout=30)
        conta("ricerche")
        if not testo:
            conta("falliti")
            continue
        grezzi = [urllib.parse.unquote(u) for u in re.findall(r'uddg=([^&"]+)', testo)]
        for u in grezzi:
            if not u.startswith("http"):
                continue
            h = host_di(u)
            if not h or "duckduckgo" in h:
                continue
            if da_escludere(u):
                scartati[h] = scartati.get(h, 0) + 1
            elif h not in trovati:
                trovati[h] = f"https://{h}/"
        print(f"    {i+1}/{len(MODELLI)+len(MODELLI_PROFESSIONISTI)} «{modello.format(c=citta)}» → {len(trovati)} domini",
              flush=True)
        time.sleep(pausa)
    return trovati, scartati

# ═════════════════════════════════════════════════ 2. lettura
RE_TEL_HREF = re.compile(r'href="tel:([^"]+)"', re.I)
RE_MAIL = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]{2,10}')
RE_PIVA = re.compile(r'(?:p\.?\s*(?:iva|i\.v\.a\.)|partita\s+iva|vat(?:\s*n)?)\D{0,15}(\d{11})', re.I)
# ⚠️ Due espressioni separate, ⛔ non una sola: pretendere via+civico+CAP+comune
# **di seguito** ha fatto crollare la resa dal 92% al 12%, perché nei piè di
# pagina veri i due pezzi sono quasi sempre divisi (celle, righe, `<br>`).
# ⚠️ Dopo il tipo di strada ci vuole una **maiuscola**: senza, «corso della
# vita» (una frase di un piè di pagina) veniva schedata come indirizzo.
RE_VIA = re.compile(
    r'\b((?:[Vv]ia|[Vv]iale|V\.le|[Cc]orso|C\.so|[Pp]iazza|P\.zza|[Pp]iazzale|[Ll]argo|'
    r'[Vv]icolo|[Ss]trada|[Ll]ungotevere|[Cc]irconvallazione)\s+(?:d[aeiou]ll?[ae]?\s+)?'
    r'[A-ZÀ-Ù][^<>\n,;|]{2,42}?,?\s*(?:n\.?\s*)?\d{1,4}[a-z]?)(?!\d)')
# ⚠️ Il comune si prende **a parole**, ⛔ non con una coda che deve finire su un
# segno preciso: pretendendo il segno la resa era del 48%, perché nei piè di
# pagina dopo «20121 Milano» arriva quasi sempre altro testo con uno spazio solo.
RE_CAPCOM = re.compile(
    r'(?<!\d)(\d{5})[\s,\-–]+((?:[A-ZÀ-Ù][a-zà-ùA-ZÀ-Ù\'’\.\-]+)(?:\s+[A-ZÀ-Ù\'’][a-zà-ù\'’\.\-]+){0,2})')
# ⛔ Parole che seguono il comune e ⛔ non ne fanno parte: si tagliano da destra.
CODA_NON_COMUNE = {"tel", "telefono", "fax", "email", "mail", "pec", "p", "piva", "partita",
                   "cell", "cellulare", "italia", "italy", "orari", "aperto", "lun", "mar",
                   "via", "viale", "corso", "piazza", "sede", "c", "cap", "n", "info", "contatti",
                   "seguici", "scopri", "prenota", "chiama", "scrivi", "dove", "come", "il", "la",
                   # ⚠️ Parole di **richiamo** e preposizioni: nei piè di pagina il
                   # comune è seguito dal pulsante («Roma Entra») o dalla frase
                   # successiva («Roma Per informazioni…»).
                   "entra", "leggi", "vai", "clicca", "apri", "richiedi", "contattaci",
                   "per", "con", "da", "in", "su", "tra", "e", "o", "lo", "gli", "le", "un", "una"}
# 🔴 **I gruppi con più sedi rompono il modello «un dominio = una clinica».**
# Misurato il 2026-08-13: Altamedica è finita sotto Milano con l'indirizzo di
# **Roma**, CDI con una sede di **Besozzo** (VA). Il primo indirizzo che compare
# in pagina ⛔ non è necessariamente quello della città cercata.
# ⇒ se il CAP ⛔ non appartiene alla provincia, la scheda ⛔ non si pubblica: va
# in verifica, perché il dato **c'è ma è di un'altra sede**.
# Le parole che **continuano** un nome di comune. ⚠️ È volutamente un elenco
# **chiuso**: se un comune vero non è coperto perde una parola (Cologno invece
# di Cologno Monzese) — ⛔ non prende una parola sbagliata, che è il difetto che
# si sta chiudendo.
SEGUITO_DI_COMUNE = {
    "san", "santa", "santo", "sant", "ss", "del", "della", "dei", "degli", "delle",
    "di", "da", "sul", "sulla", "sui", "sotto", "sopra", "al", "alla", "in", "a",
    "terme", "ligure", "marittima", "monzese", "milanese", "romano", "lodigiano",
    "brianza", "balsamo", "giovanni", "naviglio", "adda", "ticino", "garda", "mare",
    "grigna", "lambro", "olona", "seveso", "martesana", "laziale", "sabina",
}
CAP_PROVINCIA = {"MI": ("20",), "RM": ("00",), "TO": ("10",), "NA": ("80",),
                 "FI": ("50",), "BO": ("40",), "GE": ("16",), "PA": ("90",)}
RE_SOCIETA = re.compile(
    r'\b(s\.?\s?r\.?\s?l\.?\s?s?\.?|s\.?\s?p\.?\s?a\.?|s\.?\s?a\.?\s?s\.?|s\.?\s?n\.?\s?c\.?'
    r'|societ[àa]\s+(?:a\s+responsabilit|per\s+azioni|semplice)|s\.?\s?s\.?\s?d\.?)(?![\w])', re.I)
RE_STRUTTURA = re.compile(
    r'\b(centro\s+medic|poliambulatori|clinic|casa\s+di\s+cura|istituto|medical\s+(?:center|group|institute)'
    r'|ambulatorio|studio\s+(?:medico\s+)?associato)', re.I)
RE_STRUTTURA_HOST = re.compile(
    r'(clinic|poliambulator|centromedic|medicalcenter|istituto|casadicura|ambulator)', re.I)
RE_DIRSAN = re.compile(r'direttore\s+sanitari[oa]', re.I)
RE_AUT = re.compile(r'autorizzazione\s+sanitaria|aut\.\s*san(?:it)?\.|accreditat[oa]\s+(?:con|dal)|ats\s+\w+', re.I)
# 🔑 **Il segnale più forte di «libero professionista» ⛔ non è il titolo: è
# l'ALBO.** Misurato il 2026-08-15 su 1.080 schede finite in «incerto», tutte
# con lo stesso motivo — *«nessuna forma societaria e nessun nome di
# struttura»*, che è **la definizione di un libero professionista**: chi lavora
# in proprio ⛔ non ha una S.r.l. e ⛔ non si chiama «Poliambulatorio».
# ⇒ il classificatore era tarato sulle **imprese** e buttava nel dubbio proprio
# la categoria che mancava. L'albo lo risolve: la pubblicità sanitaria **deve**
# indicare l'iscrizione (L. 145/2018 c. 536), una società ⛔ non ce l'ha, e la
# prova ⛔ non dipende da come è scritto il nome.
# 🔴 **ALLARGATA il 2026-08-18, e la misura dice quanto perdeva: 14 → 34**, cioe'
# **piu' del doppio**, sulle stesse 679 schede e sulle stesse pagine.
# Cinque forme reali che la versione stretta ⛔ non vedeva, tutte raccolte da
# siti veri:
#   1. **la provincia IN MEZZO** — «ordine provinciale **di Roma** dei medici
#      chirurghi»: la vecchia pretendeva `provinciale dei medici` di seguito;
#   2. **il sostantivo invece del participio** — «**Iscrizione** Ordine Medici
#      Brescia n. 5366»: la vecchia voleva «iscritt**o**/iscritt**a** all'albo»,
#      oppure «**n.** iscrizione albo» col `n.` davanti;
#   3. **«Albo Provinciale dei Medici Chirurghi»** — `albo\s+(?:dei\s+)?medici`
#      ⛔ non ammette «provinciale» in mezzo;
#   4. **gli odontoiatri** — «Albo Odontoiatri Taranto n. 23». Un odontoiatra che
#      inietta filler e' un medico a tutti gli effetti per questo elenco;
#   5. **l'abbreviazione** — «Ordine **Prov.le** dei Medici Chirurghi».
# 🔑 ⇒ il classificatore mandava in «incerto» schede che **dichiaravano l'albo**,
# e l'albo e' l'UNICA via a `persona`. ⚠️ Questo ⛔ non e' un cambio di prodotto:
# e' una regex che ⛔ non trovava cio' che era stata scritta per trovare.
RE_ALBO = re.compile(
    r"(iscri\w*\s+(?:all[a']?\s*)?(?:albo|ordine)"
    r"|albo\s+(?:prov\w*\.?\s*(?:le)?\s+)?(?:(?:dei|degli|delle)\s+)?"
    r"(?:medic|odontoiatr|chirurg)"
    r"|ordine\s+(?:prov\w*\.?\s*(?:le)?\s+)?(?:di\s+[A-Za-zÀ-ÿ'’-]+\s+)?"
    r"(?:(?:dei|degli)\s+)?(?:medic|odontoiatr)"
    r"|omceo|o\.m\.c\.e\.o)", re.I)
RE_SPECIALITA = re.compile(
    r'(specialist[ao]\s+in|specializzat[oa]\s+in|medico\s+chirurg|chirurgo\s+plastic'
    r'|medicina\s+estetica|dermatolog|medico\s+estetic)', re.I)
# ⛔ **L'estetista ⛔ non è un medico**, e un centro estetico in questo elenco
# sarebbe un errore di categoria: la directory promette medici. Il segnale è
# **l'assenza** di qualunque termine medico accanto a un lessico di bellezza.
RE_BELLEZZA = re.compile(
    r'(centro\s+estetic|istituto\s+di\s+bellezza|estetista|beauty\s*(?:center|room|spa)'
    r'|nail\s*(?:art|center)|solarium|massaggi\s+rilassanti|extension\s+cigli)', re.I)
RE_MEDICO_QUALSIASI = re.compile(
    r'(medic|dott|chirurg|dermatolog|ambulatori|sanitari|infermier|albo|specialist)', re.I)
# ⛔ **Un dentista è un medico, ⛔ ma ⛔ non è questa directory.** Misurato il
# 2026-08-15 alla prima prova del riclassificatore: `studiopinzarrone.it`
# («Studio Dentistico») e `nazzarenobassetti.it` («il tuo dentista») passavano
# come professionisti, perché **hanno davvero l'albo e una specializzazione**.
# ⚠️ Il filtro ⛔ non può essere «niente dentisti»: moltissimi odontoiatri fanno
# **anche** filler e botulino, ed è lecito. ⇒ si guarda se la medicina estetica
# è **dichiarata**, ⛔ non la specialità di partenza.
RE_ALTRA_SPECIALITA = re.compile(
    r'(odontoiatr|dentist|ortodonz|implantolog|igiene\s+dentale|veterinari|fisioterap|osteopat|podolog)', re.I)
RE_ESTETICA_VERA = re.compile(
    r'(medicina\s+estetica|medico\s+estetic|chirurgia\s+estetica|chirurgo\s+plastic|\bfiller\b'
    r'|botulin|botox|acido\s+ialuronico|biostimolaz|biorivitalizzaz|mesoterap|blefaroplastic'
    r'|rinofiller|fili\s+di\s+trazione|criolipolisi|medicina\s+rigenerativa)', re.I)
# ⚠️ La forma societaria sta anche **nel dominio** (`bonelliodontoiatrisrl.it`),
# dove ⛔ non c'è confine di parola e `RE_SOCIETA` ⛔ non la vede mai.
RE_SOCIETA_HOST = re.compile(r'(srls?|spa|snc|sas)(?:\.|$)', re.I)
# ⚠️ Il titolo professionale è **obbligatorio**: senza, si riconosce il marchio
# e ⛔ non la persona. Vedi la nota in `classifica`.
# ⚠️ Il titolo è insensibile alle maiuscole — `Dr.` ⛔ non combacia con `dr` —
# ⛔ ma il **nome** no: deve restare maiuscolo, altrimenti il filtro si riapre
# su qualsiasi parola. Da qui i gruppi `(?i:…)` solo sul titolo.
# 🔴 **Due difetti misurati il 2026-08-18 su schede vere ancora in coda**, e
# ⛔ nessuno dei due si vedeva senza guardare i nomi che restavano fuori:
#
#   1. **il titolo scritto per esteso.** `dott|dr|prof` + `ssa` facoltativo
#      copre «Dott.», «Dr.», «Dott.ssa» ⛔ ma **non** «**Dottoressa** Elena
#      Fasola» né «**Dottor** Mario Rossi»: dopo `dott` la regex pretendeva un
#      punto o uno spazio, e trovava `oressa`.
#   2b. **l'apostrofo con la maiuscola dopo.** «Marco **D'Ettorre**»: il gruppo
#      voleva `[A-ZÀ-Ù]` **una sola volta**, poi solo minuscole ⇒ dopo la `D` e
#      l'apostrofo trovava una `E` **maiuscola** e si fermava. ⚠️ `piatto()`
#      **toglieva già** l'apostrofo per confrontare col dominio — quel commento
#      c'è dal 13 agosto — ⛔ ma la coppia ⛔ non veniva mai formata, quindi quel
#      lavoro ⛔ non serviva a niente. 🔑 **Due presidi allineati sullo stesso
#      caso, e nessuno dei due funzionava**, perché stavano in due punti diversi
#      della stessa catena.
#   2. **il cognome in due parole.** «Dott.ssa Roberta **Di Maggio**»: il
#      secondo gruppo vuole almeno 3 caratteri (`[A-ZÀ-Ù][a-zà-ù]{2,15}`), e
#      «Di» ne ha due ⇒ **nessuna coppia**, quindi ⛔ nessuna delle tre vie a
#      `persona`. ⚠️ E il dominio era `dottoressa**dimaggio**.it`: la prova
#      c'era, ⛔ non veniva letta.
#
# ⚠️ La soglia dei 6 caratteri del cognome ⛔ **NON** è stata toccata: è
# **misurata** (2026-08-16) e sotto i 6 il rischio che una parola comune
# coincida col dominio diventa reale. `siino` (5) resta fuori **di proposito**.
RE_PERSONA = re.compile(
    r'\b(?i:dott(?:oressa|ore|or)?|dr|prof)\.?(?i:\s?ssa)?\.?\s+'
    r'([A-ZÀ-Ù][a-zà-ù\'’]{2,15})\s+'
    r'((?:(?i:d[ei]|d[ae]l|d[ae]lla|d[ae]gli|l[ao]|van|von|mac|mc)\s+)?'
    r'[A-ZÀ-Ù](?:[\'’][A-ZÀ-Ù])?[a-zà-ù\'’]{2,15})\b')
PAROLE_NON_NOME = {
    "medicina", "estetica", "estetico", "clinic", "clinica", "medical", "centro", "studio",
    "milano", "roma", "torino", "napoli", "chirurgia", "chirurgo", "specialista", "medico",
    "poliambulatorio", "ambulatorio", "istituto", "dermatologia", "salute", "home", "magazine",
}
RE_INTERNI = re.compile(r'href="([^"#?]{1,120}?(?:contatt|dove-siamo|dove_siamo|sedi|'
                        r'note-legali|privacy|chi-siamo|about)[^"#?]{0,40})"', re.I)
# 🔑 Secondo giro: la **ragione sociale** quasi mai sta in homepage — sta
# nell'informativa privacy, che deve nominare il titolare del trattamento, e
# nelle note legali. È lì che si decide se un «incerto» è un'impresa.
RE_LEGALI = re.compile(r'href="([^"#?]{1,120}?(?:privacy|note-legali|note_legali|cookie|'
                       r'termini|condizioni|trasparenza|societ|legal)[^"#?]{0,40})"', re.I)
CASELLE_DI_RUOLO = ("info", "segreteria", "prenotazioni", "prenota", "contatti", "contatto",
                    "amministrazione", "reception", "studio", "clinica", "centro", "accoglienza")
PRESTAZIONI = {
    "Filler": r"\bfiller\b|acido\s+ialuronico",
    "Tossina botulinica": r"botulin|botox",
    "Biostimolazione": r"biostimolaz|biorivitalizzaz",
    "Peeling chimico": r"peeling",
    "Laser": r"\blaser\b",
    "Mesoterapia": r"mesoterap",
    "Radiofrequenza": r"radiofrequenz",
    "Fili di trazione": r"fili\s+di\s+trazione|fili\s+riassorbibili",
    "Trattamento cicatrici": r"cicatric",
    "Epilazione": r"epilazion",
}

def testo_di(grezzo):
    """⚠️ Le entità si sciolgono con `html.unescape`, ⛔ non con una lista fatta
    a mano: la lista mia lasciava passare `&#039;` e un nome usciva come
    «Dermatologia d&#039;eccellenza» — visibile solo guardando il risultato."""
    grezzo = re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>', ' ', grezzo)
    grezzo = re.sub(r'(?s)<[^>]+>', ' ', grezzo)
    return re.sub(r'[ \t\xa0]+', ' ', html.unescape(grezzo))

def normalizza_tel(t):
    """⚠️ Deve essere un numero **italiano**: `+5551234567` (un segnaposto
    lasciato in un `tel:`) passava il controllo delle sole cifre ed è finito
    sulla scheda di un gruppo ospedaliero."""
    t = re.sub(r'[^\d+]', '', urllib.parse.unquote(t))
    if t.startswith("+") and not t.startswith("+39"):
        return None
    n = re.sub(r'\D', '', t)
    if n.startswith("0039"):
        n = n[4:]
    elif n.startswith("39") and n[2:3] in ("0", "3"):
        # ⚠️ La condizione era `len(n) > 11` e su un numero di **esattamente**
        # 11 cifre non scattava ⇒ `+39 02 6700485` usciva come `+3939026700485`.
        n = n[2:]
    return "+39" + n if 8 <= len(n) <= 11 and n[0] in "03" else None

def email_di_ruolo(e):
    """⛔ `mario.rossi@clinica.it` è una **persona**, non un recapito d'impresa."""
    locale = e.split("@")[0].lower()
    if re.search(r'\.(png|jpe?g|gif|webp|svg|css|js)$', e, re.I):
        return False
    if any(x in e.lower() for x in ("sentry", "example", "wixpress", "@2x", "domain.com")):
        return False
    return any(locale == r or locale.startswith(r + ".") or locale.startswith(r + "-")
               for r in CASELLE_DI_RUOLO)

def ripulisci_comune(grezzo):
    """«Milano Tel» → «Milano»; «Sesto San Giovanni» resta intero."""
    # ⚠️ Il comune finisce al primo punto: «Roma. Autorizzato…» dava «Roma.
    # Autorizz». Un elenco di parole da scartare ⛔ non basta — è infinito.
    pezzi = re.sub(r'\s+', ' ', grezzo.split(".")[0]).strip(" ,-").split()
    # ⚠️ Si taglia **da sinistra** al primo intruso, ⛔ non da destra: «Milano
    # Orari Apertura» si fermava subito perché «Apertura» ⛔ non è in elenco, e
    # teneva tutte e tre le parole.
    # 🔑 Da un **elenco aperto di parole da buttare** a uno **chiuso di parole
    # da tenere**: l'elenco degli intrusi è infinito e infatti lasciava passare
    # «Milano Direz» e «Italia Indir». I nomi di comune composti invece pescano
    # da poche parole ricorrenti — quelle si possono elencare per intero.
    if not pezzi or pezzi[0].strip(".,").lower() in CODA_NON_COMUNE:
        return ""
    tenuti = [pezzi[0]]
    for p in pezzi[1:3]:
        if p.strip(".,'’").lower() not in SEGUITO_DI_COMUNE:
            break
        tenuti.append(p)
    return " ".join(tenuti)

def senza_accenti(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if not unicodedata.combining(c))

# ═════════════════════════ chi entra nell'elenco, e chi l'ha deciso
#
# 🔴 **Questa funzione esiste perche' la regola era scritta in DUE posti che
# ⛔ non dicevano la stessa cosa**, e per settimane nessuno se n'e' accorto:
#
#     `analizza()`      `escluso = tipo != "impresa"`          ⇒ una PERSONA fuori
#     `riclassifica()`  `escluso = tipo in (incerto, non_medico)` ⇒ una PERSONA dentro
#
# 📏 Misurato il 2026-08-18: **1.079 schede `persona` erano ESCLUSE** e 685 no —
# stesso tipo, due destini. E il loro `motivoEsclusione` diceva, alla lettera:
# «⛔ persona: studio di un professionista: dott. …» ⇒ **erano fuori dall'elenco
# dei medici per il fatto di essere medici.** Piu' 150 `non_pertinente` DENTRO,
# che sono «altra specialita' e nessuna medicina estetica dichiarata».
# 🔑 ⇒ una regola sola, in una funzione sola, chiamata da tutti e due.
DENTRO = ("impresa", "persona")


def stato_elenco(tipo, ragione):
    """`(escluso, motivoEsclusione)` — **l'unico posto** che lo decide."""
    if tipo in DENTRO:
        return False, ""
    return True, f"⛔ {tipo}: {ragione}"


def carica_decisioni():
    """Le revisioni fatte da una persona, che **vincono** sul classificatore.

    🔑 **Perche' serve.** `analizza()` ricalcola la scheda **da zero** ad ogni
    raccolta: senza questo file, una decisione presa guardando il sito verrebbe
    cancellata al giro dopo **senza un errore**, e chi l'ha presa lo scoprirebbe
    solo ricontando.

    ⚠️ Il file e' **tracciato da git** di proposito (⛔ non ignorato come
    `_recapiti.json`): e' un **registro di decisioni**, e le schede su cui
    decide sono gia' tracciate. Un file di decisioni che vive su una sola
    macchina ⛔ non e' un registro, e' un appunto.
    """
    p = os.path.join(USCITA, "_coda-decisioni.json")
    if not os.path.exists(p):
        return {}
    try:
        d = json.load(open(p, encoding="utf-8"))
    except Exception:
        return {}
    # `medico` → `persona` · `impresa` → `impresa`. ⛔ `non-medico` e `scarta`
    # ⛔ NON promuovono: una revisione che dice «⛔ non è un medico» deve poter
    # essere registrata **senza** far entrare la scheda nell'elenco.
    _TIPO = {"medico": "persona", "impresa": "impresa"}
    return {k: dict(v, tipo=_TIPO[v["come"]]) for k, v in d.items()
            if isinstance(v, dict) and v.get("come") in _TIPO}


DECISE = carica_decisioni()


def classifica(host, nome, testo, ctx_piva):
    """impresa · persona · incerto — ⛔ si pubblica **solo** `impresa`.

    🔴 **Due difetti misurati il 2026-08-13, entrambi sul riconoscimento della
    persona, entrambi invisibili senza guardare gli scarti:**

    1. il confronto era `a+b in (stelo, b+a)`: quando le due parole sono
       **uguali**, `a+b == b+a` ⇒ **sempre vero**. Bastava un «Home Home» nel
       titolo per dichiarare persona un poliambulatorio;
    2. «il dominio coincide con due parole maiuscole» ⛔ non riconosce una
       persona, riconosce **il marchio**: `ultraclinic.it` → «Ultra Clinic»,
       `poliambulatoriovenere.it` → «Poliambulatorio Venere». Su 25 scarti,
       **19 erano cliniche vere**.

    ⇒ ora una persona si riconosce **solo** da un titolo professionale che
    precede il nome (`Dott.`, `Dr.`, `Prof.`) **e** dal dominio che quel nome
    lo ripete. Due prove indipendenti, ⛔ non una coincidenza di lettere.
    """
    def piatto(s):
        """⚠️ L'apostrofo ⛔ non è un accento e `senza_accenti` ⛔ non lo toglie:
        `D'Ettorre` ⛔ non combaciava mai con `dettorre` nel dominio."""
        # ⚠️ **E nemmeno lo spazio**: un cognome in due parole («Di Maggio»)
        # nel dominio è **incollato** (`dottoressadimaggio.it`), esattamente
        # come l'apostrofo di `D'Ettorre`.
        return (senza_accenti(s).lower()
                .replace("'", "").replace("’", "").replace("-", "").replace(" ", ""))

    stelo = piatto(host.split(".")[0].replace("_", ""))
    struttura_nel_dominio = bool(RE_STRUTTURA_HOST.search(host))
    # ⛔ **Fuori scopo prima di tutto il resto**: un'altra specialità che ⛔ non
    # nomina mai la medicina estetica ⛔ non appartiene a questo elenco, e
    # decidere *dopo* se sia impresa o persona è una domanda che ⛔ non ha senso
    # porsi. ⚠️ Basta che la dichiari **una volta** per restare: il filtro
    # guarda ciò che il sito **offre**, ⛔ non da dove viene il medico.
    if RE_ALTRA_SPECIALITA.search(nome + " " + testo[:3000]) and not RE_ESTETICA_VERA.search(testo):
        return "non_pertinente", "altra specialità e nessuna medicina estetica dichiarata"
    if RE_SOCIETA_HOST.search(host.split(".")[0]):
        return "impresa", "forma societaria nel dominio"
    for a, b in RE_PERSONA.findall(nome + " " + testo[:4000]):
        if a.lower() == b.lower() or a.lower() in PAROLE_NON_NOME or b.lower() in PAROLE_NON_NOME:
            continue
        acc, inv = piatto(a + b), piatto(b + a)
        if len(stelo) > 7 and (acc == stelo or inv == stelo):
            return "persona", f"studio di un professionista: dott. {a} {b}, e il dominio lo ripete"
        # ⚠️ Il dominio porta spesso **il solo cognome** (`anniboletti.it`).
        for cognome in (piatto(b), piatto(a)):
            if len(cognome) > 7 and cognome == stelo:
                return "persona", f"studio di un professionista: dott. {a} {b}, cognome nel dominio"
        # 🔑 **Il cognome CONTENUTO, ⛔ non uguale**: `medicinaesteticamassicci.it`
        # è lo studio di Massicci, ⛔ ma il dominio dice anche il mestiere e
        # l'uguaglianza ⛔ non scattava mai. ⚠️ Allargare qui è sicuro **solo**
        # perché le due prove restano due: il titolo professionale davanti al
        # nome **e** il cognome nel dominio. ⛔ Non vale se il dominio dichiara
        # una struttura (`clinicarossi.it` è una clinica, ⛔ non il dott. Rossi).
        if not struttura_nel_dominio:
            # ⚠️ **6 caratteri, ⛔ non 7.** Misurato il 2026-08-16 sulle schede
            # ancora incerte: la soglia a 7 lasciava fuori **96 professionisti**
            # con cognomi normalissimi — Rubini, Caroni, Cuciti, Salemi. ⛔ Non è
            # un allargamento a caso: le **due prove** restano due (titolo
            # professionale davanti al nome **e** cognome nel dominio), e sotto
            # i 6 il rischio che una parola comune coincida diventa reale.
            for cognome in (piatto(b), piatto(a)):
                if len(cognome) > 5 and cognome in stelo:
                    return "persona", f"studio di un professionista: dott. {a} {b}, cognome dentro il dominio"
    if RE_SOCIETA.search(ctx_piva):
        return "impresa", "forma societaria accanto alla partita IVA"
    if RE_SOCIETA.search(testo):
        return "impresa", "forma societaria dichiarata nel sito"
    if RE_STRUTTURA.search(nome) or RE_STRUTTURA.search(testo[:400]):
        return "impresa", "il nome dichiara una struttura"
    # ⚠️ Nel dominio le parole sono **incollate** (`ultraclinic.it`): il confine
    # di parola ⛔ non c'è, e cercarlo lì lasciava fuori cliniche evidenti.
    if struttura_nel_dominio:
        return "impresa", "il dominio dichiara una struttura"
    # 🔑 **L'albo, quando il nome ⛔ non aiuta.** Qui siamo già oltre ogni prova
    # d'impresa: niente forma societaria, niente struttura nel nome né nel
    # dominio. Un sito che in queste condizioni dichiara **l'iscrizione
    # all'albo** e **una specializzazione medica** è un professionista che
    # lavora in proprio — ed è il caso che riempiva «incerto».
    # ⚠️ `direttore sanitario` è il segnale contrario: lo nomina una **struttura**.
    if RE_ALBO.search(testo) and RE_SPECIALITA.search(testo) and not RE_DIRSAN.search(testo):
        return "persona", "iscrizione all'albo e specializzazione, senza forma societaria né struttura"
    # ⛔ **Estetista, ⛔ non medico.** Lessico di bellezza e **nessun** termine
    # medico in tutta la pagina ⇒ ⛔ non appartiene a una directory di medici.
    if RE_BELLEZZA.search(nome + " " + testo[:2000]) and not RE_MEDICO_QUALSIASI.search(testo):
        return "non_medico", "lessico di estetica non medica e nessun termine medico"
    return "incerto", "nessuna forma societaria e nessun nome di struttura"

def analizza(host, provincia, dove_cercare=None, max_pagine=3):
    base = f"https://{host}/"
    dove_cercare = dove_cercare or RE_INTERNI
    if not robots_permette(base):
        conta("robots_no")
        return {"dominio": host, "escluso": True, "motivoEsclusione": "robots.txt vieta la lettura"}
    # ⚠️ ⛔ non chiamarla `html`: quel nome è il **modulo** che serve a sciogliere
    # le entità qui sotto, e ombreggiarlo rompe `html.unescape` a metà funzione.
    # ⚠️ Quattro tentativi, e i due in chiaro ⛔ non sono un di piu'.
    # 📏 Misurato il 2026-08-18 su un campione delle **343** schede archiviate
    # come «il sito non ha risposto»: **17 su 40 rispondevano**, e **14 di
    # quelle 17 solo su `http`**. ⇒ un terzo di quelle schede ⛔ non erano
    # irraggiungibili: **⛔ non le avevamo mai chiamate al numero giusto.**
    # 🔑 Leggere in chiaro una pagina pubblica e' cio' che fa un browser quando
    # il sito ⛔ non offre altro: ⛔ nessuna credenziale, ⛔ nessun dato inviato.
    for tentativo in (base, f"https://www.{host}/", f"http://{host}/", f"http://www.{host}/"):
        radice, url_reale = leggi(tentativo)
        if radice:
            break
    if not radice:
        conta("falliti")
        return {"dominio": host, "escluso": True, "motivoEsclusione": "il sito non ha risposto"}
    conta("pagine")
    pagine = [(url_reale or base, radice)]
    visti = set()
    for m in dove_cercare.finditer(radice):
        if len(pagine) >= max_pagine:
            break
        link = urllib.parse.urljoin(url_reale or base, m.group(1))
        if host_di(link) != host or link in visti:
            continue
        visti.add(link)
        if not robots_permette(link):
            continue
        h2, u2 = leggi(link)
        if h2:
            conta("pagine")
            pagine.append((u2 or link, h2))

    tutto = "\n".join(h for _, h in pagine)
    testo = "\n".join(testo_di(h) for _, h in pagine)
    piatto = re.sub(r'\s+', ' ', testo)

    tit = re.search(r'(?is)<title[^>]*>(.*?)</title>', pagine[0][1])
    nome = re.sub(r'\s+', ' ', testo_di(tit.group(1))).strip() if tit else host
    nome = re.split(r'\s+[|–—-]\s+', nome)[0].strip()[:70] or host
    # ⚠️ Due schede si chiamavano «Home»: il `<title>` di molti siti è generico.
    # ⇒ si ripiega su `og:site_name`, ⛔ non si pubblica un nome che non è un nome.
    if nome.lower() in ("home", "homepage", "benvenuti", "index", "sito", "home page"):
        og = re.search(r'property=["\']og:site_name["\']\s+content=["\']([^"\']{2,70})',
                       pagine[0][1], re.I)
        nome = html.unescape(og.group(1)).strip() if og else host

    piva_m = RE_PIVA.search(piatto)
    ctx = piatto[max(0, piva_m.start() - 160):piva_m.start() + 40] if piva_m else ""
    tipo, ragione = classifica(host, nome, piatto, ctx)
    # ⚠️ **La revisione umana vince**, e sta QUI e ⛔ non dopo: cosi' anche il
    # CAP fuori provincia qui sotto ⛔ non puo' riportarla a «incerto».
    if host in DECISE:
        tipo, ragione = DECISE[host]["tipo"], DECISE[host]["nota"]

    tel = [normalizza_tel(t) for t in RE_TEL_HREF.findall(tutto)]
    tel = [t for t in dict.fromkeys(tel) if t]
    mail = [e.lower() for e in dict.fromkeys(RE_MAIL.findall(tutto)) if email_di_ruolo(e)]
    via = RE_VIA.search(piatto)
    # il CAP+comune più vicino alla via: un sito con più sedi ne elenca parecchi
    capcom = min(RE_CAPCOM.finditer(piatto),
                 key=lambda m: abs(m.start() - (via.end() if via else 0)), default=None)
    soc = RE_SOCIETA.search(ctx)

    atteso = CAP_PROVINCIA.get(provincia)
    # ⚠️ Vale per **chiunque**, ⛔ non solo per le imprese: era vincolato a
    # `tipo == "impresa"` e un professionista è finito sotto Milano con il
    # comune di **Padova**. Chi ha più sedi ⛔ non è per forza una società.
    if atteso and capcom and host not in DECISE and not capcom.group(1).startswith(atteso):
        tipo, ragione = "incerto", (
            f"CAP {capcom.group(1)} fuori dalla provincia {provincia}: probabile gruppo con "
            "più sedi ⇒ l'indirizzo letto ⛔ non è quello della città cercata")

    return {
        "dominio": host,
        "nome": nome,
        "formaSocietaria": re.sub(r'[.\s]', '', soc.group(1)).upper() if soc else "",
        "partitaIva": piva_m.group(1) if piva_m else "",
        "telefono": tel[0] if tel else "",
        "email": mail[0] if mail else "",
        "sitoUrl": pagine[0][0],
        "indirizzo": re.sub(r'\s+', ' ', via.group(1)).strip(" ,") if via else "",
        "cap": capcom.group(1) if capcom else "",
        "comune": ripulisci_comune(capcom.group(2)) if capcom else "",
        "provincia": provincia,
        "prestazioni": [n for n, r in PRESTAZIONI.items() if re.search(r, piatto, re.I)],
        "dichiaraDirettoreSanitario": bool(RE_DIRSAN.search(piatto)),
        "dichiaraAutorizzazioneSanitaria": bool(RE_AUT.search(piatto)),
        "tipoSoggetto": tipo,
        "ragioneClassificazione": ragione,
        "fonteUrl": [u for u, _ in pagine],
        "lettoIl": time.strftime("%Y-%m-%d"),
        "escluso": stato_elenco(tipo, ragione)[0],
        "motivoEsclusione": stato_elenco(tipo, ragione)[1],
    }

# ═══════════════════════════ P6 · la scoperta nazionale
#
# 🔑 **Un lavoro da ore, quindi progettato per morire e riprendere.** 107
# province × 12 modelli ≈ **1.284 ricerche**, e il motore gratuito regge solo se
# lo si tratta con garbo ⇒ 16 ore circa. Un programma che ⛔ non sa riprendere
# trasforma un'interruzione all'ora nona in un ricominciare da capo.
#
# ⚠️ **Il blocco ⛔ non è un errore HTTP**: DuckDuckGo risponde **200** con una
# pagina senza risultati (o 202). Misurato il 2026-08-13: ⛔ non si accorge di
# nulla chi guarda solo il codice di stato — si guarda **se ci sono link**.
STATO_P6 = os.path.join(QUI, "stato-scoperta.json")

def carica_stato():
    if os.path.exists(STATO_P6):
        try:
            return json.load(open(STATO_P6, encoding="utf-8"))
        except Exception:
            pass
    return {"fatte": [], "domini": {}, "scartati": {}}

def salva_stato(st):
    json.dump(st, open(STATO_P6, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

def cerca_una(query, pausa):
    """Torna (domini, bloccato). ⚠️ `bloccato` ⛔ non è un'eccezione: è una
    pagina che risponde bene e ⛔ non contiene risultati."""
    u = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote_plus(query) + "&kl=it-it"
    testo, _ = leggi(u, timeout=30, cache=False)
    if not testo:
        return [], True
    grezzi = [urllib.parse.unquote(x) for x in re.findall(r'uddg=([^&"]+)', testo)]
    url = [x for x in grezzi if x.startswith("http")]
    return url, len(url) == 0

def scoperta_nazionale(province, pausa=20.0, pausa_max=420.0):
    """`province` = [("Milano","MI"), …]. Riprende da dove si era fermata."""
    st = carica_stato()
    comuni = json.load(open(os.path.join(QUI, "comuni.json"), encoding="utf-8"))
    # 🔑 **La profondità ⛔ non è un numero che scelgo io: la decide la resa.**
    # «58 modelli bastano?» ⛔ non ha risposta a tavolino — 58 era dove avevo
    # smesso di misurare, e le ultime 10 query rendevano ancora 2,2 domini
    # ciascuna. ⇒ ogni città consuma il proprio elenco **finché rende**, e si
    # chiude quando la media delle ultime 8 ricerche scende sotto 1 dominio
    # nuovo. Milano si prenderà 90 ricerche, Isernia 12, e ⛔ non devo saperlo
    # prima.
    base = MODELLI + MODELLI_PROFESSIONISTI + MODELLI_TRATTAMENTO
    bersagli = [(c, s, base + MODELLI_PROFONDI) for c, s in province]
    # ⚠️ I comuni ⛔ non hanno sigla di provincia: si etichettano col comune
    # stesso, ⛔ non si indovina la provincia — sbagliarla manderebbe la scheda
    # nella pagina di città sbagliata, che è peggio di ⛔ non averla.
    # 🔑 **Stesso elenco per tutti, e a decidere è solo la resa.**
    # I comuni hanno avuto due tetti scelti da me, entrambi caduti:
    #   · **4 modelli fissi** — e con una finestra di 8 la regola di arresto
    #     ⛔ non poteva nemmeno scattare: era il «numero deciso a tavolino» che
    #     l'adattivo doveva eliminare, sopravvissuto in un angolo;
    #   · poi **22**, per paura che su un comune piccolo il motore restituisse
    #     cliniche della **città vicina**, tenendo viva la finestra all'infinito.
    # ⚠️ Quella paura era infondata, e la ragione è nell'**ordine**: i capoluoghi
    # girano **prima**. Quando si arriva a Legnano le cliniche milanesi sono già
    # in archivio e ⛔ non contano come nuove — il meccanismo che temevo è già
    # disinnescato da come è ordinato il lavoro.
    # ⇒ un paese si chiude in 8 ricerche, una città in 75, e ⛔ non lo decido io.
    bersagli += [(c, c, MODELLI_COMUNE + base + MODELLI_PROFONDI) for c in comuni]
    lavoro = [(c, s, m) for c, s, pool in bersagli for m in pool
              if f"{s}|{m}" not in st["fatte"] and s not in st.get("chiuse", [])]
    print(f"━━━ scoperta nazionale: {len(lavoro)} ricerche da fare "
          f"({len(st['fatte'])} già fatte) ━━━", flush=True)
    blocchi = 0
    st.setdefault("chiuse", [])
    # 🔴 **La finestra va SALVATA, ⛔ non tenuta in memoria.** Difetto misurato il
    # 2026-08-14: viveva in un dizionario locale e si azzerava ad ogni riavvio
    # (tre, quel giorno). ⇒ alla ripartenza una città veniva giudicata sulla
    # **coda del proprio elenco** — dove stanno i trattamenti di nicchia, che
    # rendono poco **per definizione**, ⛔ non perché la città sia esaurita.
    # Napoli si è chiusa così: **8 ricerche** su `fili di trazione`,
    # `lipofilling`, `microneedling`… dopo averne fatte 22 generiche con buona
    # resa che nessuno ha più contato.
    # ⚠️ Una finestra **per città**: la resa di Milano ⛔ non deve chiudere Lecco.
    finestre = st.setdefault("resa", {})
    for i, (citta, sigla, modello) in enumerate(lavoro):
        if sigla in st["chiuse"]:
            continue
        q = modello.format(c=citta)
        url, bloccato = cerca_una(q, pausa)
        if bloccato:
            blocchi += 1
            pausa = min(pausa * 2, pausa_max)
            print(f"  ⚠️ bloccato su «{q[:44]}» → attesa {pausa:.0f}s", flush=True)
            time.sleep(pausa)
            continue
        # ⚠️ ripresa graduale: ⛔ non si torna subito al ritmo che ha fatto
        # scattare il blocco, o si rimbalza fra blocco e ripresa all'infinito.
        pausa = max(pausa * 0.85, 20.0)
        nuovi = 0
        for u in url:
            h = host_di(u)
            if not h or "duckduckgo" in h:
                continue
            if da_escludere(u):
                st["scartati"][h] = st["scartati"].get(h, 0) + 1
            elif h not in st["domini"]:
                st["domini"][h] = sigla
                nuovi += 1
        st["fatte"].append(f"{sigla}|{modello}")
        # 🔑 Regola di arresto: media delle **ultime 8** ricerche di QUESTA città
        # sotto 1 dominio nuovo ⇒ la città è esaurita e si passa oltre.
        # ⚠️ Serve la finestra piena: chiudere su 2-3 ricerche magre taglierebbe
        # città vive — la resa oscilla molto fra un modello e l'altro (misurato:
        # 33, 17, 35, 22 su Milano a blocchi di 10).
        f = finestre.setdefault(sigla, [])  # persistito in `st["resa"]`
        f.append(nuovi)
        chiusa = len(f) >= 8 and sum(f[-8:]) / 8 < 1.0
        if chiusa:
            st["chiuse"].append(sigla)
        if i % 10 == 0 or nuovi or chiusa:
            salva_stato(st)
        print(f"  [{i+1}/{len(lavoro)}] {sigla} «{q[:38]}» +{nuovi} → "
              f"{len(st['domini'])} domini"
              + (f" · ⛔ {sigla} esaurita dopo {len(f)}" if chiusa else f" · pausa {pausa:.0f}s"),
              flush=True)
        time.sleep(pausa)
    salva_stato(st)
    print(f"\n═══ {len(st['domini'])} domini · {sum(st['scartati'].values())} scartati "
          f"da {len(st['scartati'])} aggregatori · {blocchi} blocchi · costo $0 ═══")
    for h, n in sorted(st["scartati"].items(), key=lambda x: -x[1])[:10]:
        print(f"    ⛔ {h} ({n})")

# ═══════════════════════════ P1 · le pagine del profilo, dalla sitemap
RE_LOC = re.compile(r'<loc>\s*([^<\s]+)\s*</loc>', re.I)
# Le pagine dove stanno **davvero** i dispositivi: ⛔ non la homepage.
RE_PAGINA_UTILE = re.compile(
    r'(trattament|tecnolog|servizi|prestazion|medicina-estetica|apparecchiat|macchinar|'
    r'filler|botulin|laser|radiofrequenz|hifu|lifting|viso|corpo|dermatolog|chirurgia)', re.I)

def pagine_profilo(host, limite=12):
    """🔑 Le pagine giuste si **enumerano** dalla sitemap, ⛔ non si cercano
    seguendo i link: quasi tutti questi siti sono WordPress e ne pubblicano una.
    Un file, e si conosce l'intero sito senza esplorare a tentoni.

    ⚠️ Ripiego sui link solo se la sitemap manca: senza ripiego si perdono i
    siti fatti a mano, che in questo settore ⛔ non sono pochi."""
    viste = []
    for nome in ("sitemap.xml", "wp-sitemap.xml", "sitemap_index.xml", "sitemap-index.xml"):
        testo, _ = leggi(f"https://{host}/{nome}", timeout=20)
        if not testo or "<loc" not in testo.lower():
            continue
        loc = RE_LOC.findall(testo)
        # una sitemap-**indice** punta ad altre sitemap: si scende di un livello
        for f in [u for u in loc if u.lower().endswith(".xml")][:4]:
            t2, _ = leggi(f, timeout=20)
            if t2:
                loc += RE_LOC.findall(t2)
        viste = [u for u in dict.fromkeys(loc)
                 if not u.lower().endswith(".xml") and host_di(u) == host]
        if viste:
            break
    if not viste:   # ripiego: i link della homepage
        home, base = leggi(f"https://{host}/")
        if home:
            viste = [urllib.parse.urljoin(base or f"https://{host}/", m)
                     for m in re.findall(r'href="([^"#?]{2,120})"', home)]
            viste = [u for u in dict.fromkeys(viste) if host_di(u) == host]
    # 🔴 **Gli articoli si escludono PRIMA di scegliere, ⛔ non dopo.** Misurato
    # il 2026-08-13: su `multimedica.it` **tutte e 12** le pagine scaricate
    # erano `/news/…`, perché le parole del filtro («chirurgia», «laser»,
    # «trattamento») compaiono benissimo negli URL dei **titoli degli
    # articoli**. Risultato: scaricato il blog, ignorati i servizi — e la
    # scheda risultava senza prestazioni pur essendo un ospedale.
    # ⚠️ ⛔ Non è solo qualità del dato: sono 12 richieste sprecate per sito.
    viste = [u for u in viste if not RE_BLOG.search(u)]
    utili = [u for u in viste if RE_PAGINA_UTILE.search(u)]
    # ⚠️ A parità di pertinenza vince la pagina **meno profonda**: le pagine di
    # servizio stanno in alto (`/medicina-estetica/`), gli approfondimenti in
    # fondo (`/medicina-estetica/viso/filler/labbra/come-funziona/`).
    return sorted(utili or viste, key=lambda u: u.count("/"))[:limite]

# ═══════════════════════════ P3 · i dispositivi: il campo che nessuno ha
# ⚠️ Solo marchi **inequivocabili**: «Icon», «Genius», «Clarity», «Discovery» da
# soli sono parole comuni e darebbero falsi positivi ovunque ⇒ o la forma
# estesa, o fuori. Un dizionario che sbaglia in eccesso ⛔ non è misurabile.
DISPOSITIVI = [
    "Ultherapy", "Ulthera", "Morpheus8", "Fotona", "Cynosure", "Candela", "Lumenis",
    "Emsculpt", "Emsella", "Emtone", "Emface", "CoolSculpting", "Thermage", "Exilis",
    "Venus Legacy", "Venus Freeze", "Sofwave", "Renuvion", "HydraFacial", "Dermapen",
    "Secret RF", "Scarlet RF", "Vivace", "PicoSure", "PicoWay", "Enlighten",
    "Discovery Pico", "Motus AX", "Soprano ICE", "Soprano Titanium", "Primelase",
    "LightSheer", "GentleLase", "GentleMax", "Excel V", "Vbeam", "SmartXide", "CO2RE",
    "Fraxel", "Clear + Brilliant", "Endymed", "Onda Coolwaves", "Accent Prime",
    "Velashape", "Cooltech", "TruSculpt", "Vanquish", "Jett Plasma", "Plexr", "Tixel",
    "Nordlys", "Stellar M22", "Splendor X", "Harmony XL", "Alma Hybrid", "Alma Harmony",
    "Regenera Activa", "Rigenera", "Zeltiq", "Ultraformer", "Doublo", "Liposonix",
    "Aptos", "Silhouette Soft", "Endolift", "Bodytite", "Facetite", "Agnes RF",
]
# ⚠️ Marchi di **prodotto**, ⛔ non di macchina: dicono cosa **inietta**, ⛔ non
# cosa **possiede**. Contati a parte perché rispondono a una domanda diversa.
PRODOTTI = [
    "Juvederm", "Juvéderm", "Restylane", "Belotero", "Teosyal", "Stylage", "Neauvia",
    "Definisse", "Ellansé", "Radiesse", "Sculptra", "Profhilo", "Aliaxin", "Saypha",
    "Bocouture", "Azzalure", "Vistabex", "Dysport", "Xeomin", "Botox", "Aqualyx",
]

def marchi_in(testo, elenco):
    return [m for m in elenco
            if re.search(r'(?<![\w])' + re.escape(m).replace(r'\ ', r'\s+') + r'(?![\w])',
                         testo, re.I)]

def misura_dispositivi(sigle, limite_pagine=12):
    """🔑 **Il bivio del progetto, e costa mezz'ora.** Se le cliniche ⛔ non
    dichiarano il macchinario, il filtro duro che nessun portale italiano ha
    ⛔ non esiste — e va saputo **prima** di raccogliere 15.000 siti."""
    schede = []
    for s in sigle:
        schede += json.load(open(os.path.join(USCITA, f"{s.lower()}.json"), encoding="utf-8"))
    print(f"━━━ dispositivi su {len(schede)} schede (max {limite_pagine} pagine per sito) ━━━",
          flush=True)

    def per_sito(sc):
        host = sc["dominio"]
        testi = []
        for u in pagine_profilo(host, limite_pagine):
            if not robots_permette(u):
                continue
            t, _ = leggi(u)
            if t:
                conta("pagine")
                testi.append(testo_di(t))
        piatto = re.sub(r'\s+', ' ', "\n".join(testi))
        return {"dominio": host, "pagine": len(testi),
                "dispositivi": marchi_in(piatto, DISPOSITIVI),
                "prodotti": marchi_in(piatto, PRODOTTI)}

    with ThreadPoolExecutor(max_workers=5) as ex:
        esiti = list(ex.map(per_sito, schede))

    json.dump(esiti, open(os.path.join(QUI, "misura-dispositivi.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    n = len(esiti) or 1
    disp = [e for e in esiti if e["dispositivi"]]
    prod = [e for e in esiti if e["prodotti"]]
    for e in sorted(esiti, key=lambda x: -len(x["dispositivi"]))[:14]:
        print(f"  {e['dominio'][:30]:32} {e['pagine']:2}p  {', '.join(e['dispositivi'][:4]) or '—'}")
    print(f"\n  con almeno un DISPOSITIVO : {len(disp):3}/{n}  ({100*len(disp)//n}%)")
    print(f"  con almeno un PRODOTTO    : {len(prod):3}/{n}  ({100*len(prod)//n}%)")
    print(f"  marchi distinti           : {len({m for e in esiti for m in e['dispositivi']})}")
    print(f"  pagine lette {CONTI['pagine']} · dalla cache {CONTI['da_cache']} · costo $0")

# ═══════════════════════════ P4 · i dizionari
#
# 🔑 **Chiusi, e ⛔ non generati da un modello.** Un vocabolario chiuso si può
# leggere, correggere e discutere; è anche ciò che rende il campo un **filtro**
# invece di un'opinione. ⛔ Nessun prezzo, ⛔ nessun superlativo, ⛔ nessuna
# promessa di risultato: L. 145/2018 c. 525 colpisce **il medico**, ⛔ non noi.
#
# ⚠️ Ogni voce è una regola, ⛔ non una parola: «laser» da solo prenderebbe
# qualsiasi cosa, e infatti sta in TECNOLOGIE con la sua famiglia, ⛔ non fra i
# trattamenti.
TRATTAMENTI = {
    "Filler acido ialuronico": r"\bfiller\b|acido\s+ialuronic",
    "Filler labbra": r"filler\s+labbra|aumento\s+labbra|labbra\s+(?:più\s+)?volum",
    "Rinofiller": r"rinofiller|rinoplastica\s+non\s+chirurgic|naso\s+senza\s+bisturi",
    "Tossina botulinica": r"botulin|\bbotox\b|tossina\s+botulin",
    "Biostimolazione": r"biostimolaz|biorivitalizzaz|bio-?rivitalizz",
    "Skin booster": r"skin\s?booster|idratazione\s+profonda",
    "Mesoterapia": r"mesoterap",
    "PRP": r"\bp\.?r\.?p\.?\b|plasma\s+ricco\s+di\s+piastrine|gel\s+piastrinic",
    "Fili di trazione": r"fili\s+di\s+trazione|fili\s+riassorbibil|fili\s+di\s+sospension",
    "Peeling chimico": r"peeling",
    "Microneedling": r"micro-?needling|\bneedling\b",
    "Carbossiterapia": r"carbossiterap",
    "Ossigenoterapia": r"ossigenoterap",
    "Lipolisi iniettiva": r"lipolisi\s+iniett|intralipoterap|lipolitic",
    "Medicina rigenerativa": r"medicina\s+rigenerativ|rigenerazione\s+tissut",
    "Trattamento occhiaie": r"occhiaie|solco\s+lacrimale|tear\s+trough",
    "Volumizzazione zigomi": r"zigom",
    "Definizione mandibola": r"mandibol|jawline|profiloplastic",
    "Trattamento cicatrici": r"cicatric",
    "Trattamento smagliature": r"smagliatur",
    "Trattamento cellulite": r"cellulit|pannicolopat",
    "Trattamento acne": r"\bacne\b",
    "Trattamento macchie": r"macchie\s+(?:cutanee|della\s+pelle|solari)|melasma|iperpigmentaz",
    "Couperose e rosacea": r"couperose|rosacea|capillari\s+(?:del\s+)?vis",
    "Iperidrosi": r"iperidrosi|sudorazione\s+eccessiv",
    "Tricologia e capelli": r"tricolog|caduta\s+dei\s+capelli|alopec|\bprp\s+capell",
    "Epilazione": r"epilazion|depilazione\s+definitiv",
    "Rimodellamento corpo": r"rimodellamento\s+(?:del\s+)?corp|body\s+contouring",
    "Trattamento intimo": r"ginecologia\s+estetic|ringiovanimento\s+intim|labioplast",
}
CHIRURGIA = {
    "Rinoplastica": r"rinoplastic|settorinoplastic",
    "Blefaroplastica": r"blefaroplastic",
    "Lifting viso": r"lifting\s+(?:del\s+)?vis|lifting\s+cervico|mini-?lifting|face\s?lift",
    "Mastoplastica additiva": r"mastoplastica\s+additiv|aumento\s+(?:del\s+)?sen|protesi\s+mammar",
    "Mastoplastica riduttiva": r"mastoplastica\s+ridutt|riduzione\s+(?:del\s+)?sen",
    "Mastopessi": r"mastopess|sollevamento\s+(?:del\s+)?sen",
    "Addominoplastica": r"addominoplastic",
    "Liposuzione": r"liposuzion|liposcultur|lipoaspiraz",
    "Lipofilling": r"lipofilling|lipostruttur|trapianto\s+di\s+grass",
    "Otoplastica": r"otoplastic|orecchie\s+a\s+sventol",
    "Ginecomastia": r"ginecomast",
    "Gluteoplastica": r"gluteoplastic|aumento\s+glute",
    "Trapianto di capelli": r"trapianto\s+(?:di\s+)?capell|autotrapianto|\bfue\b",
}
AREE = {
    "Viso": r"\bvis[oi]\b", "Labbra": r"\blabbra\b", "Sguardo": r"sguardo|palpebr|contorno\s+occhi",
    "Zigomi": r"zigom", "Mento e mandibola": r"\bmento\b|mandibol", "Collo": r"\bcollo\b",
    "Décolleté": r"d[ée]collet", "Mani": r"\bmani\b", "Addome": r"\baddome\b|pancia",
    "Glutei": r"\bglute", "Gambe": r"\bgambe\b|cosce", "Seno": r"\bseno\b|mammell",
    "Capelli": r"\bcapelli\b|cuoio\s+capellut", "Corpo": r"\bcorpo\b",
}
# 🔴 **P5 · i due campi che ⛔ non sono preferenze: sono sicurezza.**
# Un intervento chirurgico ⛔ non si fa in un ambulatorio semplice, e un filler
# ⛔ non lo mette un ambulatorio senza medico. ⇒ nel matching sono **filtri
# duri**: se il dato manca la scheda ⛔ non compare fra i risultati chirurgici —
# ⛔ non compare in fondo. ⚠️ «In fondo» significa che qualcuno ci arriva.
TIPO_SEDE = {
    "Casa di cura": r"casa\s+di\s+cura|clinica\s+privata\s+accreditat|day\s?surgery|sala\s+operatori",
    "Poliambulatorio": r"poliambulator|polispecialistic|centro\s+medico\s+polispecialistic",
    "Ambulatorio": r"\bambulator",
    "Studio medico": r"studio\s+medic",
}
SPECIALIZZAZIONI = {
    "Chirurgia plastica": r"chirurg[oa]?\s+plastic|specialist[ae]\s+in\s+chirurgia\s+plastic|chirurgia\s+plastica\s+ricostrutt",
    "Dermatologia": r"dermatolog|specialist[ae]\s+in\s+dermatolog",
    "Medicina estetica": r"medic[oa]\s+estetic|specialist[ae]\s+in\s+medicina\s+estetic|master\s+in\s+medicina\s+estetic",
    "Chirurgia maxillo-facciale": r"maxillo-?facc",
    "Angiologia e flebologia": r"angiolog|flebolog",
    "Ginecologia estetica": r"ginecolog",
    "Odontoiatria": r"odontoiatr|dentist",
    "Nutrizione": r"nutrizionist|dietolog|scienze\s+dell.alimentaz",
}
TECNOLOGIE = {
    "Laser CO2 frazionato": r"co\s?2\s+frazionat|laser\s+co\s?2|frazionato\s+ablativ",
    "Laser Nd:YAG": r"nd\s?:?\s?yag|neodimio",
    "Laser a diodo": r"laser\s+a\s+diod|diodo\s+\d{3}",
    "Laser vascolare": r"laser\s+vascolar|dye\s+laser",
    "Luce pulsata": r"luce\s+pulsata|\bipl\b|fotoringiovanimento",
    "Radiofrequenza": r"radiofrequenz",
    "Radiofrequenza microneedling": r"radiofrequenza\s+(?:con\s+)?micro-?ago|micro-?needling\s+con\s+radiofrequenz",
    "Ultrasuoni focalizzati (HIFU)": r"\bhifu\b|ultrasuoni\s+(?:micro)?focalizzat",
    "Criolipolisi": r"criolipolisi|crioadipolisi",
    "Cavitazione": r"cavitazione\s+(?:medica|ultrasonica)?",
    "Onde d'urto": r"onde\s+d.?urto",
    "Pressoterapia": r"pressoterap",
    "Elettroporazione": r"elettroporaz|veicolazione\s+transdermic",
    "LED terapia": r"led\s+terap|fototerapia\s+led",
    "Plasma exeresi": r"plasma\s+exeresi|plexr|jett\s+plasma",
    "Endolaser": r"endolaser|endolift",
}

# ═══════════════════════════ P2 · «cita» ⛔ non vuol dire «lo fa»
RE_TITOLI = re.compile(r'(?is)<h[12][^>]*>(.*?)</h[12]>')
RE_ANCORA = re.compile(r'(?is)<a\s[^>]*href="[^"]*"[^>]*>(.*?)</a>')
RE_BLOG = re.compile(r'/(blog|news|articol|magazine|approfondiment|rassegna|\d{4}/\d{2})/', re.I)
# 🔑 **Il discrimine ⛔ non è «titolo contro corpo»: è «pagina di servizio contro
# articolo».** Una pagina intitolata «MEDICINA ESTETICA» che nel corpo nomina il
# filler **sta dichiarando un servizio**, ⛔ non raccontando una curiosità — e
# fermarsi ai titoli lasciava a zero 13 schede su 65, tutti ospedali e
# poliambulatori grandi, che descrivono **reparti** invece di elencare voci.
# 🔴 **Il primo tentativo di chiudere il limite ha riportato dentro il rumore**,
# e il testo lo diceva a chiare lettere: la pagina «MEDICINA ESTETICA» di
# `milanomedica.it` recita *«i trattamenti che un medico estetico **può
# eseguire** includono, **ma non sono limitati a**: …»*. È **divulgazione sulla
# professione**, ⛔ non un elenco di ciò che quello studio fa — e il conteggio
# era schizzato a 12,9 trattamenti medi per scheda senza che nessuno lo
# dichiarasse.
#
# 🔑 **Il segnale che le separa è la forma, ⛔ non l'argomento: una pagina che
# offre ELENCA, una che spiega FA DOMANDE.** I sottotitoli di quel sito sono
# letteralmente «Chi è il medico estetico?», «Di cosa si occupa la Chirurgia
# Vascolare?».
RE_DIVULGATIVA = re.compile(
    r'(può\s+eseguire|possono\s+essere\s+eseguit|includono,?\s+ma\s+non\s+sono\s+limitat|'
    r'che\s+cos.?è|di\s+cosa\s+si\s+occupa|chi\s+è\s+il\s+|a\s+cosa\s+serve|'
    r'in\s+che\s+cosa\s+consiste|quali\s+sono\s+i\s+trattamenti)', re.I)

def divulgativa(titoli, corpo):
    """⚠️ Due prove indipendenti, ne basta una: **un sottotitolo interrogativo**
    o una **formula da manuale**. ⛔ Non si guarda l'argomento — una pagina sul
    filler può essere sia un'offerta sia una spiegazione."""
    domande = sum(1 for t in re.split(r'\s{2,}|\n', titoli) if t.strip().endswith("?"))
    return domande >= 1 or bool(RE_DIVULGATIVA.search(corpo[:4000]))

RE_SERVIZIO = re.compile(
    r'(medicina[-\s]estetica|chirurgia[-\s](?:plastica|estetica)|trattament|prestazion|'
    r'servizi|area[-_\s]specialistica|ambulator|specialit|dermatolog|medicina[-\s]rigenerativ|'
    r'reparto|poliambulator)', re.I)

def pagine_in_cache(host):
    """Rilegge dal disco tutto ciò che si era scaricato per quel dominio.
    ⚠️ L'URL ⛔ non si ricava dal nome del file (è uno sha): sta nella **prima
    riga** del contenuto, ed è per quello che ce l'abbiamo messa."""
    d = os.path.join(CACHE, host)
    if not os.path.isdir(d):
        return
    for f in sorted(os.listdir(d)):
        if not f.endswith(".html.gz"):
            continue
        try:
            testo = gzip.open(os.path.join(d, f), "rt", encoding="utf-8", errors="replace").read()
        except Exception:
            continue
        url, _, corpo = testo.partition("\n")
        yield url, corpo

def offerte_del_sito(host, vocabolario):
    """Separa **ciò che lo studio fa** da **ciò di cui parla**.

    🔴 Oggi una prestazione si conta se la parola compare **da qualche parte**:
    un sito con un articolo di blog sul botulino risulta **identico** a chi lo
    pratica. ⚠️ È invisibile in qualsiasi conteggio aggregato — la resa media
    resta bella — e manda il paziente dalla persona sbagliata.

    Tre prove, e ne basta **una**:
    · il termine è nell'**indirizzo** di una pagina che ⛔ non è un articolo;
    · è in un **`<h1>`/`<h2>`** di una pagina che ⛔ non è un articolo;
    · è nel testo di un **collegamento ripetuto su ≥3 pagine** ⇒ è una voce di
      menu. 🔑 Questa terza prova evita di dover riconoscere la navigazione:
      un menu **si ripete**, un link dentro un articolo no.
    """
    testo_pagine, titoli, ancore = [], [], {}
    for url, corpo in pagine_in_cache(host):
        if url.endswith((".xml", "robots.txt")):
            continue
        blog = bool(RE_BLOG.search(url))
        piatto = re.sub(r'\s+', ' ', testo_di(corpo))
        testo_pagine.append(piatto)
        if not blog:
            titoli.append(url.lower() + " " + " ".join(
                re.sub(r'\s+', ' ', testo_di(t)) for t in RE_TITOLI.findall(corpo)))
        viste = {re.sub(r'\s+', ' ', testo_di(a)).strip().lower()
                 for a in RE_ANCORA.findall(corpo)}
        for a in viste:
            if 2 < len(a) < 60:
                ancore[a] = ancore.get(a, 0) + 1

    menu = " · ".join(a for a, n in ancore.items() if n >= 3)
    forte = " ".join(titoli) + " · " + menu
    ovunque = " ".join(testo_pagine)

    offerte, citate = [], []
    for nome, regola in vocabolario.items():
        if re.search(regola, forte, re.I):
            offerte.append(nome)
        elif re.search(regola, ovunque, re.I):
            citate.append(nome)
    return offerte, citate, len(testo_pagine)

def misura_offerte(sigle):
    schede = []
    for s in sigle:
        schede += json.load(open(os.path.join(USCITA, f"{s.lower()}.json"), encoding="utf-8"))
    print(f"━━━ «lo fa» contro «ne parla» su {len(schede)} schede (dalla cache, $0) ━━━")
    tot_o = tot_c = 0
    esiti = []
    for sc in schede:
        o, c, n = offerte_del_sito(sc["dominio"], PRESTAZIONI)
        tot_o += len(o)
        tot_c += len(c)
        esiti.append({"dominio": sc["dominio"], "pagine": n, "offerte": o, "solo_citate": c})
    json.dump(esiti, open(os.path.join(QUI, "misura-offerte.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    for e in sorted(esiti, key=lambda x: -len(x["solo_citate"]))[:12]:
        print(f"  {e['dominio'][:28]:30} fa {len(e['offerte']):2} · ne parla {len(e['solo_citate']):2}"
              f"   ⚠️ {', '.join(e['solo_citate'][:4])}")
    tot = tot_o + tot_c or 1
    print(f"\n  prestazioni contate col metodo di oggi : {tot}")
    print(f"  di cui **davvero offerte**             : {tot_o}  ({100*tot_o//tot}%)")
    print(f"  🔴 solo citate, ⇒ ⛔ fuori dal matching  : {tot_c}  ({100*tot_c//tot}%)")
    vuote = [e for e in esiti if not e["offerte"]]
    print(f"  ⚠️ schede senza NESSUNA prestazione provata: {len(vuote)}/{len(esiti)}")

def slug(z):
    """Nome di file da una zona. ⚠️ Le zone ⛔ non sono tutte sigle: i comuni si
    chiamano «Sesto San Giovanni», e uno spazio in un nome di file rompe tutto
    il resto della catena in modo silenzioso."""
    z = unicodedata.normalize("NFD", (z or "ignoto").lower())
    z = "".join(c for c in z if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", z).strip("-") or "ignoto"

def leggi_dallo_stato(solo_nuovi=True, per_giro=None):
    """Secondo passaggio: legge i siti di **tutti i domini già scoperti**.

    🔑 Gira **in parallelo alla scoperta** e ⛔ non la disturba: la scoperta
    interroga **un solo** servizio (che infatti ci sta stringendo), la lettura
    distribuisce le richieste su **migliaia di host diversi**, un paio a testa.
    Sono due colli di bottiglia diversi, quindi si sommano invece di sottrarsi.

    ⚠️ `solo_nuovi`: si saltano i domini che hanno già una scheda. Rileggerli
    ⛔ non aggiungerebbe niente e sprecherebbe richieste verso siti che ⛔ non ce
    l'hanno chiesto.
    """
    st = json.load(open(STATO_P6, encoding="utf-8"))
    # ⚠️ **Si LEGGONO entrambi gli stati, ⛔ non si fondono.** Il file della
    # scoperta gratuita è **aperto in scrittura** da un altro processo: fondere
    # lì dentro lo corromperebbe, e il guasto si vedrebbe solo quando ⛔ non si
    # rilegge più. ⇒ l'unione si fa **in memoria**, qui, a ogni giro.
    bd = os.path.join(QUI, "stato-scoperta-bd.json")
    if os.path.exists(bd):
        try:
            altro = json.load(open(bd, encoding="utf-8"))
            prima = len(st["domini"])
            for d, z in altro.get("domini", {}).items():
                st["domini"].setdefault(d, z)
            print(f"  (+{len(st['domini']) - prima} domini dalla scoperta a pagamento)", flush=True)
        except Exception as e:
            print(f"  ⚠️ stato Bright Data illeggibile ({e}): si procede senza", flush=True)
    fatti = set()
    if solo_nuovi and os.path.isdir(USCITA):
        for f in os.listdir(USCITA):
            if f.endswith(".json") and not f.startswith("_"):
                try:
                    for x in json.load(open(os.path.join(USCITA, f), encoding="utf-8")):
                        if isinstance(x, dict) and x.get("dominio"):
                            fatti.add(x["dominio"])
                except Exception:
                    pass
    per_zona = {}
    for d, z in st["domini"].items():
        if d not in fatti:
            per_zona.setdefault(z, []).append(d)
    zone = sorted(per_zona, key=lambda z: -len(per_zona[z]))
    if per_giro:
        zone = zone[:per_giro]
    tot = sum(len(per_zona[z]) for z in zone)
    print(f"━━━ lettura di {tot} domini nuovi in {len(zone)} zone "
          f"({len(fatti)} già letti) ━━━", flush=True)
    # 🔴 **Un pool solo su TUTTI i domini, ⛔ non un pool per zona.**
    # Prima si chiamava `raccogli()` **zona per zona**, e ognuna apriva il
    # proprio `ThreadPoolExecutor(6)`: il codice *sembrava* parallelo ⛔ ma le
    # zone giravano **in fila**, e una zona con 4 domini teneva occupati **4
    # thread su 6**. Misurato il 2026-08-15 su un giro vero: **mediana 6 domini
    # per zona**, e **13 zone su 44 sotto i 6** ⇒ il parallelismo dichiarato
    # ⛔ non c'era quasi mai.
    # ⇒ si appiattisce il lavoro in **un elenco solo** e lo si dà a un pool
    # unico; lo smistamento per zona si fa **dopo**, sui risultati.
    # ⚠️ Resta gentile verso i siti **per costruzione**: i domini sono **host
    # diversi**, e le 3 pagine di ciascuno restano in sequenza dentro
    # `analizza`. ⛔ Alzare i thread ⛔ non aumenta le richieste **per sito**.
    quanti = int(os.environ.get("LETTORE_PARALLELI", "16"))
    # ⚠️ Il filtro degli esclusi va **rifatto qui**: lo faceva `raccogli()`, che
    # ⛔ non passa più di mezzo. Un dominio può essere entrato nello stato
    # **prima** che finisse nella lista di esclusione, e lo stato ⛔ non si
    # ripulisce da solo.
    lavoro = [(d, z) for z in zone for d in per_zona[z]
              if not da_escludere(f"https://{d}/")]
    saltati = sum(len(v) for v in per_zona.values()) - len(lavoro)
    print(f"  {len(lavoro)} domini in un pool unico da {quanti} "
          f"(erano {len(zone)} pool da 6, in fila)"
          + (f" · {saltati} esclusi" if saltati else ""), flush=True)
    # 🔴 **Si scrive appena una zona è completa, ⛔ non alla fine di tutto.**
    # La prima versione usava `ex.map`, che restituisce **solo quando ha finito
    # l'ultimo**: con 991 domini in un pool solo, ⛔ nulla sarebbe finito su
    # disco per l'intera corsa, e **un'interruzione avrebbe buttato via tutto**.
    # ⚠️ Il difetto ⛔ non esisteva prima — la versione a pool-per-zona salvava
    # ad ogni zona — ⇒ è **un difetto introdotto dalla riparazione**, e lo si
    # vede solo pensando a cosa succede se il processo muore a metà.
    b_tot = i_tot = p_tot = 0
    attesi = {}
    for _, z in lavoro:
        attesi[z] = attesi.get(z, 0) + 1
    raccolte = {}
    with ThreadPoolExecutor(max_workers=quanti) as ex:
        futuri = {ex.submit(analizza, d, slug(z)): z for d, z in lavoro}
        for f in as_completed(futuri):
            z = futuri[f]
            try:
                scheda = f.result()
            except Exception as e:
                conta("falliti")
                scheda = {"dominio": "?", "escluso": True, "motivoEsclusione": f"errore: {e}"}
            raccolte.setdefault(z, []).append(scheda)
            if len(raccolte[z]) == attesi[z]:      # zona completa ⇒ si scrive
                b, i, p = smista(raccolte.pop(z), slug(z))
                b_tot += len(b); i_tot += len(i); p_tot += len(p)
                print(f"  {z:24} {attesi[z]:3} letti → {len(b):3} imprese · "
                      f"{len(p):2} professionisti · {len(i):3} da verificare", flush=True)
    print(f"\n═══ {b_tot} imprese · {p_tot} professionisti · {i_tot} da verificare ═══")
    print(f"    pagine {CONTI['pagine']} · dalla cache {CONTI['da_cache']} · "
          f"falliti {CONTI['falliti']} · robots {CONTI['robots_no']} · costo $0")

def chiave_nome(s):
    """Nome confrontabile fra fonti diverse: via accenti, forme societarie e
    parole generiche. ⚠️ Senza, «CASA DI CURA S. ANNA S.R.L.» e «Casa di Cura
    Sant\'Anna» ⛔ non si incontrano mai."""
    s = unicodedata.normalize("NFD", (s or "").lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"\b(s\.?r\.?l\.?s?|s\.?p\.?a\.?|s\.?a\.?s\.?|s\.?n\.?c\.?|soc\.?|societa)\b", " ", s)
    s = re.sub(r"\b(casa di cura|clinica|istituto|centro|privata?|accreditat[ao]|dott\.?)\b", " ", s)
    return re.sub(r"[^a-z0-9]+", "", s)

def _case_ufficiali():
    f = os.path.join(QUI, "case-di-cura-minsalute.json")
    return json.load(open(f, encoding="utf-8")) if os.path.exists(f) else {}

CASE_UFFICIALI = _case_ufficiali()

def arricchisci(sigle):
    """Scrive il **profilo ricco** dentro le schede, leggendo solo dalla cache.

    🔑 Ogni campo nasce **già distinto** fra «lo fa» e «ne parla» (P2): la
    versione citata resta nella scheda perché ⛔ non è spazzatura — dice di cosa
    lo studio **si occupa** — ⛔ ma nel matching entra solo la prima.

    ⚠️ ⛔ Non tocca i campi di contatto: quelli restano come li ha scritti la
    raccolta, con la loro `fonteUrl`."""
    for sigla in sigle:
        f = os.path.join(USCITA, f"{sigla.lower()}.json")
        schede = json.load(open(f, encoding="utf-8"))
        for sc in schede:
            host = sc["dominio"]
            testi, forti = [], []
            for url, corpo in pagine_in_cache(host):
                if url.endswith((".xml", "robots.txt")):
                    continue
                piatto = re.sub(r'\s+', ' ', testo_di(corpo))
                testi.append(piatto)
                if RE_BLOG.search(url):
                    continue
                titoli = " ".join(re.sub(r'\s+', ' ', testo_di(t))
                                  for t in RE_TITOLI.findall(corpo))
                forti.append(url.lower() + " " + titoli)
                # 🔑 Se la pagina **è** una pagina di servizio, vale anche il suo
                # corpo: lì dentro l'elenco dei trattamenti c'è, solo che ⛔ non
                # sta nei titoli. Vedi la nota su RE_SERVIZIO.
                if (RE_SERVIZIO.search(url) or RE_SERVIZIO.search(titoli)) \
                        and not divulgativa(titoli, piatto):
                    forti.append(piatto)
            forte, ovunque = " ".join(forti), " ".join(testi)
            prova = lambda voc: ([n for n, r in voc.items() if re.search(r, forte, re.I)],
                                 [n for n, r in voc.items()
                                  if not re.search(r, forte, re.I) and re.search(r, ovunque, re.I)])
            sc["trattamenti"], sc["trattamentiCitati"] = prova(TRATTAMENTI)
            sc["chirurgia"], sc["chirurgiaCitata"] = prova(CHIRURGIA)
            sc["tecnologie"], _ = prova(TECNOLOGIE)
            # ⚠️ P5 — filtri di **sicurezza**: il tipo di sede si legge anche
            # dal nome, che è dove uno studio lo dichiara per primo.
            sedi, _ = prova(TIPO_SEDE)
            dal_nome = [k for k, r in TIPO_SEDE.items() if re.search(r, sc.get("nome", ""), re.I)]
            # 🔑 Si tiene **la più strutturata**: chi ha una casa di cura ha anche
            # gli ambulatori, ⛔ non viceversa — e il filtro chirurgico guarda la
            # prima, ⛔ non l'ultima.
            ordine = list(TIPO_SEDE)
            tutte_sedi = [x for x in ordine if x in set(sedi) | set(dal_nome)]
            sc["tipoSede"] = tutte_sedi[0] if tutte_sedi else ""
            sc["tipoSedeTutte"] = tutte_sedi
            sc["specializzazioni"], _ = prova(SPECIALIZZAZIONI)
            # 🔑 **Conferma da fonte ufficiale, dove esiste.** Il tipo di sede
            # oggi lo deduce una regex sul sito dello studio — ed è il filtro da
            # cui dipende se una scheda compare fra i risultati **chirurgici**.
            # L'elenco delle case di cura accreditate del **Ministero della
            # Salute** (445 nomi, nazionale) lo conferma per nome+comune.
            # ⚠️ Conferma e basta: se il Ministero ⛔ non ha la struttura, ⛔ non
            # significa che ⛔ non sia autorizzata — significa che ⛔ non è una
            # casa di cura **accreditata col SSN**, che è un'altra cosa.
            # 🔴 **Una chiave corta ⛔ non basta a confermare niente.** Togliendo
            # le parole generiche «Clinica Forma» diventa `forma` e «Casa di Cura
            # e Clinica Privata» diventa `e`: chiavi così combaciano **per caso**,
            # e la conseguenza sarebbe dichiarare *casa di cura accreditata dal
            # Ministero* uno studio che ⛔ non lo è — un'affermazione falsa su un
            # terzo, e la peggiore che questo programma possa produrre.
            # ⇒ sotto le 8 lettere ⛔ non si confronta: meglio ⛔ nessuna conferma
            # che una sbagliata.
            k = chiave_nome(sc.get("nome", ""))
            uff = CASE_UFFICIALI.get(k, []) if len(k) >= 8 else []
            uff = [u for u in uff if chiave_nome(u["comune"]) == chiave_nome(sc.get("comune", ""))]
            if uff:
                sc["tipoSede"] = "Casa di cura"
                sc["sedeConfermataDa"] = "Ministero della Salute"
                sc["sedeUfficiale"] = uff[0]["nome"]
            sc["aree"], _ = prova(AREE)
            sc["dispositivi"] = marchi_in(ovunque, DISPOSITIVI)
            sc["prodotti"] = marchi_in(ovunque, PRODOTTI)
            sc["pagineLette"] = len(testi)
            sc.pop("prestazioni", None)   # sostituito dai campi qui sopra
        json.dump(schede, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"→ {len(schede)} schede arricchite in {f}")

    tutte = []
    for s in sigle:
        tutte += json.load(open(os.path.join(USCITA, f"{s.lower()}.json"), encoding="utf-8"))
    n = len(tutte) or 1
    print(f"\n━━━ profilo ricco su {len(tutte)} schede (dalla cache, costo $0) ━━━")
    for campo in ("trattamenti", "chirurgia", "tecnologie", "aree", "dispositivi",
                  "prodotti", "specializzazioni"):
        con = [t for t in tutte if t.get(campo)]
        medio = sum(len(t.get(campo, [])) for t in tutte) / n
        print(f"  {campo:14} {len(con):3}/{n} schede ({100*len(con)//n:3}%) · media {medio:.1f} voci")
    ricche = [t for t in tutte if len(t.get("trattamenti", [])) + len(t.get("chirurgia", [])) >= 3]
    print(f"\n  🔑 schede con ≥3 prestazioni **provate**: {len(ricche)}/{n} ({100*len(ricche)//n}%)")
    import collections
    sedi = collections.Counter(t.get("tipoSede") or "⛔ non dichiarato" for t in tutte)
    print("\n  tipo di sede (filtro di sicurezza):")
    for k, v in sedi.most_common():
        print(f"    {k:22} {v:3}/{n}")
    chir = [t for t in tutte if "Chirurgia plastica" in t.get("specializzazioni", [])]
    senza = [t for t in chir if t.get("tipoSede") in ("", "Studio medico", "Ambulatorio")]
    print(f"  🔴 dichiarano chirurgia plastica ma ⛔ non una sede adeguata: {len(senza)}/{len(chir)}")
    vuote = [t["dominio"] for t in tutte if not t.get("trattamenti") and not t.get("chirurgia")]
    print(f"  ⚠️ schede senza nessuna prestazione provata: {len(vuote)} — {', '.join(vuote[:6])}")

# ═════════════════════════════════════════════════ 3. geocodifica (a parte)
def coordinate_dal_comune(prova=True):
    """Dà a ogni scheda le coordinate **del suo comune**, da un file ISTAT.

    🔴 **Perché ⛔ non si geocodifica indirizzo per indirizzo, ed è un vincolo
    ⛔ non una scorciatoia.** La *usage policy* di **Nominatim** consente *«limited,
    non-bulk creative use»* — e **4.002 richieste sono esattamente bulk**.
    ⇒ lanciare il geocodificatore su tutto l'elenco ⛔ non sarebbe «lento»:
    sarebbe **un uso che il servizio ⛔ non ci concede**, per giunta di un bene
    pubblico mantenuto da volontari.
    🔑 La via d'uscita ⛔ non è pagare: è **cambiare il dato che serve**. Per
    «mostrami i medici vicino a me» la precisione utile è **il comune**, ⛔ non il
    civico — e le coordinate dei **7.904 comuni italiani** sono **un file**.
    ⇒ copertura alta, **zero richieste**, ⛔ nessuna policy violata.

    ⚠️ **La precisione si DICHIARA nel dato**, ⛔ non si lascia intuire: chi legge
    `lat`/`lon` deve sapere se è **il civico** (dal JSON-LD del sito) o **il
    centro del comune**. Un punto disegnato dove lo studio ⛔ non è, senza dirlo,
    è **peggio di nessun punto**.
    """
    import csv, glob
    percorsi = [os.path.join(QUI, "coordinate.csv"), "/tmp/coord.csv"]
    percorso = next((p for p in percorsi if os.path.exists(p)), None)
    if not percorso:
        raise SystemExit("⛔ manca `scripts/coordinate.csv` (comune → lat/long, fonte ISTAT):\n"
                         "   curl -sO https://raw.githubusercontent.com/opendatasicilia/"
                         "comuni-italiani/main/dati/coordinate.csv")
    codice = {}
    for r in csv.DictReader(open(os.path.join(QUI, "comuni.csv"), encoding="utf-8")):
        codice[senza_accenti(r["comune"]).lower()] = r["pro_com_t"].lstrip("0")
    punti = {}
    for r in csv.DictReader(open(percorso, encoding="utf-8")):
        try:
            punti[r["pro_com_t"].lstrip("0")] = (float(r["lat"]), float(r["long"]))
        except Exception:
            pass
    per_cap = {}
    if os.path.exists(os.path.join(QUI, "cap.csv")):
        for r in csv.DictReader(open(os.path.join(QUI, "cap.csv"), encoding="utf-8")):
            c = (r.get("cap") or "").strip().zfill(5)
            k = (r.get("pro_com_t") or "").lstrip("0")
            if c and k:
                per_cap.setdefault(c, k)
    dati, scritte, senza = {}, 0, 0
    for p in sorted(glob.glob(os.path.join(USCITA, "*.json"))):
        if os.path.basename(p).startswith("_"):
            continue
        try:
            dati[p] = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
    for p, schede in dati.items():
        for s in schede:
            if not isinstance(s, dict):
                continue
            if s.get("lat"):
                # ⚠️ Chi ha già le coordinate dal JSON-LD le tiene: sono **del
                # civico**, e sovrascriverle col centro del comune sarebbe
                # **peggiorare** un dato buono.
                s.setdefault("precisioneCoord", "civico")
                continue
            c = senza_accenti(s.get("comune") or "").lower().strip()
            k = punti.get(codice.get(c, ""))
            # ⚠️ **Ripiego sul CAP**, che identifica il comune quando il campo
            # `comune` manca o è scritto in un modo che l'anagrafe ⛔ non
            # riconosce («Roma RM», «Milano (MI)», un quartiere). ⛔ Non è meno
            # preciso: porta **allo stesso** centro comunale.
            # ⚠️ Un CAP può servire **più comuni**: si prende il primo, e la
            # precisione resta dichiarata «comune» — che è già quel che è.
            if not k and s.get("cap"):
                k = punti.get(per_cap.get(str(s["cap"]).strip().zfill(5), ""))
            if not k:
                senza += 1
                continue
            s["lat"], s["lon"] = round(k[0], 6), round(k[1], 6)
            s["precisioneCoord"] = "comune"
            scritte += 1
    tot = sum(len(v) for v in dati.values())
    print(f"━━━ {tot} schede · {scritte} coordinate dal comune · {senza} senza comune "
          f"riconosciuto ━━━")
    print(f"   ⚠️ precisione **comune**, ⛔ non civico: dichiarata in `precisioneCoord`.")
    if prova:
        print("\n⚠️ PROVA: niente scritto. Rilancia con `--coord-comune --scrivi`.")
        return
    for p, schede in dati.items():
        json.dump(schede, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n✅ riscritti {len(dati)} file")


def geocodifica(sigla, pausa=1.1):
    """Nominatim, gratuito. ⚠️ Un punto disegnato dove lo studio **non è** è
    peggio di nessun punto ⇒ `esatta` dice se viene dal civico o dal comune."""
    f = os.path.join(USCITA, f"{sigla.lower()}.json")
    schede = json.load(open(f, encoding="utf-8"))
    testa = dict(INTESTAZIONI, **{"User-Agent": f"FibonacciMedica/1.0 (+{CONTATTO})"})
    fatti = 0
    for s in schede:
        if s.get("coordinate") or not s.get("indirizzo"):
            continue
        q = f"{s['indirizzo']}, {s['cap']} {s['comune']}, Italia"
        u = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + \
            urllib.parse.quote(q)
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=testa), timeout=25) as r:
                d = json.load(r)
        except Exception:
            d = []
        if d:
            s["coordinate"] = {"lat": float(d[0]["lat"]), "lon": float(d[0]["lon"]),
                               "esatta": d[0].get("class") in ("place", "building", "amenity")
                                         and "house" in (d[0].get("type") or "")
                                         or "house_number" in (d[0].get("display_name") or "")}
            fatti += 1
        print(f"  {'✓' if d else '✗'} {s['dominio']}", flush=True)
        time.sleep(pausa)
    json.dump(schede, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"→ {fatti} coordinate scritte in {f}")

# ═════════════════════════════════════════════════ main
def raccogli(citta, sigla, elenco=None):
    print(f"\n━━━ {citta} ({sigla}) ━━━\n[1/2] scoperta")
    if elenco is not None:
        # ⚠️ Scoperta fatta a mano: **nessun motore programmabile e gratuito
        # funziona** (misurato 2026-08-13: DuckDuckGo risponde 202-anomalia
        # dopo 2 ricerche, Brave 429, Ecosia 403, Startpage e lite-DDG
        # bloccati, Mojeek non ha l'indice). Qui entrano **solo indirizzi**.
        scartati = {}
        trovati = {}
        for u in elenco:
            h = host_di(u if u.startswith("http") else f"https://{u}")
            if not h:
                continue
            if da_escludere(f"https://{h}/"):
                scartati[h] = scartati.get(h, 0) + 1
            else:
                trovati[h] = f"https://{h}/"
    else:
        trovati, scartati = scopri(citta)
    print(f"  {len(trovati)} domini candidati · {sum(scartati.values())} risultati scartati "
          f"da {len(scartati)} aggregatori")
    for h, n in sorted(scartati.items(), key=lambda x: -x[1])[:6]:
        print(f"    ⛔ {h} ({n})")

    print(f"[2/2] lettura di {len(trovati)} siti")
    with ThreadPoolExecutor(max_workers=6) as ex:
        schede = list(ex.map(lambda h: analizza(h, sigla), trovati))

    return smista(schede, sigla)

def smista(schede, sigla):
    """Tre esiti, ⛔ non due — e uno **non si conserva**.

    🔑 «Prendiamo tutto e verifichiamo dopo» vale per gli **incerti**: sono una
    classificazione debole, ⛔ non un divieto, e un secondo giro sulle note
    legali quasi sempre li risolve. ⇒ restano in magazzino con tutti i campi.

    ⚠️ **I professionisti ora si pubblicano** (decisione dell'utente,
    2026-08-13: «ora cerchiamo anche i liberi professionisti»). Restano
    **classificati** perché la differenza conta a valle — su un professionista
    il nome **è** l'insegna e l'iscrizione all'albo è verificabile da chiunque,
    su una SRL no — ⛔ ma non è più un motivo di scarto.

    🔴 **`_opposizioni.json` ⛔ non è un elenco di scarti: è l'art. 21.** Chi
    chiede di sparire finisce lì, e da lì il dominio ⛔ non viene più letto né
    pubblicato, a ogni giro, per sempre. ⚠️ È **l'unico file di questa cartella
    che ⛔ non si rigenera**: svuotarlo o perderlo rimette online chi aveva
    detto di no, e nessun rifacimento della raccolta se ne accorgerebbe.
    """
    negati = opposizioni()
    schede = [s for s in schede if s.get("dominio") not in negati]
    imprese = [s for s in schede if s.get("tipoSoggetto") == "impresa"]
    professionisti = [s for s in schede if s.get("tipoSoggetto") == "persona"]
    # ⚠️ `non_medico` sta **qui dentro**, ⛔ non in una quarta pila: un esito
    # nuovo che ⛔ non compare in nessuna delle liste farebbe **sparire** la
    # scheda senza una riga di avviso. Resta in magazzino, ⛔ non si pubblica,
    # e il motivo dice perché.
    incerte = [s for s in schede if s.get("tipoSoggetto") in ("incerto", "non_medico", "non_pertinente") or
               (s.get("escluso") and not s.get("tipoSoggetto"))]
    os.makedirs(USCITA, exist_ok=True)

    def scrivi(nome, dati, togli=frozenset()):
        """🔴 **Si FONDE col file esistente, ⛔ non lo si sovrascrive.**

        Difetto misurato il 2026-08-15, e stava **perdendo dati in silenzio**:
        `leggi_dallo_stato()` passa **solo i domini nuovi** (`solo_nuovi=True`),
        quindi un giro che trovava 5 nuovi siti a Roma riscriveva `rm.json`
        **con 5 schede**, buttando le altre. ⇒ **165 schede sparite da 51 file**
        nel solo pomeriggio, confrontando col commit del mattino.
        ⚠️ **Nessun errore, nessun log**: i totali continuavano a **salire**,
        perché le zone nuove aggiungevano più di quanto le vecchie perdessero.
        È il motivo per cui ⛔ non l'ha visto nessuno.
        🔑 Le schede nuove **vincono** su quelle vecchie con lo stesso dominio
        (sono una rilettura più fresca); le altre restano. ⇒ l'operazione è
        **idempotente** e ⛔ non dipende più da quanti domini arrivano in un giro.
        """
        percorso = os.path.join(USCITA, nome)
        unite = {}
        if os.path.exists(percorso):
            try:
                for x in json.load(open(percorso, encoding="utf-8")):
                    if isinstance(x, dict) and x.get("dominio"):
                        unite[x["dominio"]] = x
            except Exception:
                pass  # ⚠️ un file illeggibile ⛔ non deve fermare la raccolta
        for x in dati:
            if isinstance(x, dict) and x.get("dominio"):
                unite[x["dominio"]] = x
        # ⚠️ **`togli` è il rovescio necessario della fusione.** Le due pile
        # sono **esclusive**: se una scheda passa da «incerto» a «persona»,
        # fondere senza togliere la lascerebbe in **entrambi** i file, e
        # comparirebbe due volte — un difetto **creato** dalla riparazione.
        for d in togli:
            unite.pop(d, None)
        json.dump(sorted(unite.values(), key=lambda s: s["dominio"]),
                  open(percorso, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    pubblicate = sorted(imprese + professionisti, key=lambda s: s["dominio"])
    da_verificare = sorted(incerte, key=lambda s: s["dominio"])
    scrivi(f"{sigla.lower()}.json", pubblicate,
           togli={s["dominio"] for s in da_verificare})
    scrivi(f"{sigla.lower()}-da-verificare.json", da_verificare,
           togli={s["dominio"] for s in pubblicate})
    # ⚠️ Si restituiscono **tutte e tre** le pile: il riepilogo che ne contava
    # due dava «45 + 14» su 67 letti, e le 8 persone sparivano senza una riga.
    return imprese, incerte, professionisti

RE_JSONLD = re.compile(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                       re.I | re.S)

def _oggetti_jsonld(grezzo):
    """Srotola i blocchi `ld+json`: possono essere un oggetto, una lista, o un
    `@graph`. ⚠️ Molti siti ne hanno **più d'uno** e ⛔ non sempre valido: un
    blocco rotto ⛔ non deve far perdere gli altri."""
    for m in RE_JSONLD.finditer(grezzo):
        try:
            d = json.loads(m.group(1).strip())
        except Exception:
            continue
        for x in (d if isinstance(d, list) else [d]):
            if not isinstance(x, dict):
                continue
            if isinstance(x.get("@graph"), list):
                for g in x["@graph"]:
                    if isinstance(g, dict):
                        yield g
            else:
                yield x


def dati_da_jsonld(host):
    """Rilegge dalla cache **ciò che il sito pubblica già in forma strutturata**.

    🔑 **Misurato il 2026-08-16: il 68 % dei siti pubblica `schema.org`** — cioè
    gli stessi dati che stiamo cavando a fatica con le espressioni regolari, ⛔ ma
    **puliti dal sito stesso**, e quindi più affidabili di una nostra congettura
    sul testo. ⇒ è il miglioramento a **costo zero** più grande che resta: ⛔ non
    una richiesta di rete, i file sono **già sul disco**.

    ⛔ **⛔ NON si prende l'immagine, e ⛔ non è prudenza eccessiva.** Quattro
    ragioni indipendenti, ognuna sufficiente da sola:
    **(1)** la foto di una persona **identificata** è un **dato personale**, e la
    CGUE (C-184/20) ha stabilito che il contesto **professionale ⛔ non toglie**
    quella qualifica; **(2)** *«far comparire su una pagina Internet dati
    personali costituisce un trattamento»* (stessa sentenza) ⇒ mostrarla è un
    trattamento **nostro**, ⛔ non del medico; **(3)** linkarla dal loro server
    (*hotlinking*) ⛔ non aggira niente: in **Fashion ID** (C-40/17) chi incorpora
    risorse di terzi diventa **contitolare** per i dati che il browser del
    visitatore trasmette; **(4)** l'art. 56 del **Codice di deontologia FNOMCeO**
    elenca **esclusivamente** titoli, specializzazioni, attività, caratteristiche
    del servizio e onorario — **l'immagine ⛔ non è in quell'elenco**.
    ⇒ ⛔ **niente `image`, niente `photo`, niente `logo`.**
    ⛔ **E nessun prezzo** (`priceRange`, `offers`): L. 145/2018 c. 525.
    """
    # ⚠️ **Il JSON-LD è scritto da migliaia di siti diversi e ⛔ non rispetta i
    # tipi**: il CAP arriva come **intero**, il giorno della settimana come
    # **oggetto**, il telefono come **lista**. ⇒ si normalizza **una volta sola**
    # in entrata, ⛔ non si rattoppa campo per campo quando esplode.
    def testo(v):
        if isinstance(v, list):
            v = v[0] if v else ""
        if isinstance(v, dict):
            v = v.get("@id") or v.get("name") or ""
        return str(v).strip() if v is not None else ""

    fuori = {}
    for x in _oggetti_jsonld("\n".join(g for _, g in pagine_in_cache(host))):
        tipo = x.get("@type") or ""
        tipi = " ".join(tipo) if isinstance(tipo, list) else str(tipo)
        if not re.search(r'(Organization|Business|Clinic|Physician|Hospital|Dentist|'
                         r'MedicalBusiness|HealthAndBeauty|Place|Person)', tipi, re.I):
            continue
        ind = x.get("address")
        if isinstance(ind, list) and ind:
            ind = ind[0]
        if isinstance(ind, dict):
            fuori.setdefault("indirizzo", testo(ind.get("streetAddress")))
            fuori.setdefault("cap", testo(ind.get("postalCode")))
            fuori.setdefault("comune", testo(ind.get("addressLocality")))
        geo = x.get("geo")
        if isinstance(geo, list) and geo:
            geo = geo[0]
        if isinstance(geo, dict):
            try:
                lat, lon = float(geo["latitude"]), float(geo["longitude"])
                # ⚠️ Un controllo di plausibilità: l'Italia sta in questo riquadro.
                # Coordinate a `0,0` o di un'altra nazione sono **errori del sito**,
                # e scriverle metterebbe uno studio in mezzo al mare.
                if 35.0 <= lat <= 47.5 and 6.0 <= lon <= 19.0:
                    fuori.setdefault("lat", round(lat, 6))
                    fuori.setdefault("lon", round(lon, 6))
            except Exception:
                pass
        for chiave, campo in (("telephone", "telefono"), ("email", "email"),
                              ("name", "nomeStrutturato"), ("vatID", "partitaIva")):
            v = testo(x.get(chiave))
            if v:
                fuori.setdefault(campo, v[:120])
        ore = x.get("openingHours") or x.get("openingHoursSpecification")
        if ore:
            righe = []
            for o in (ore if isinstance(ore, list) else [ore]):
                if isinstance(o, str):
                    righe.append(o.strip()[:60])
                elif isinstance(o, dict):
                    # ⚠️ `dayOfWeek` ⛔ non è sempre una stringa né una lista di
                    # stringhe: alcuni siti ci mettono **oggetti** (`{"@id": …}`).
                    # Un `join` cieco esplode — misurato alla prima corsa.
                    g = o.get("dayOfWeek")
                    g = ", ".join(testo(y) for y in g) if isinstance(g, list) else testo(g)
                    g = re.sub(r'https?://schema\.org/', '', g)
                    a, b = testo(o.get("opens")), testo(o.get("closes"))
                    if g and a:
                        righe.append(f"{g} {a}-{b}".strip())
            if righe:
                fuori.setdefault("orari", righe[:14])
        if tipi:
            fuori.setdefault("tipoDichiarato", tipi[:60])
    return fuori


def arricchisci_da_jsonld(prova=True):
    """Passa tutte le schede e vi versa ciò che il JSON-LD dichiara.

    ⚠️ **Riempie i campi VUOTI, ⛔ non sovrascrive quelli pieni** — tranne le
    coordinate e gli orari, che ⛔ non li avevamo affatto. Un dato che abbiamo
    già estratto e verificato ⛔ non si butta per uno che ⛔ non abbiamo ancora
    guardato: se divergono, lo si scopre **confrontando**, ⛔ non sovrascrivendo.
    """
    import glob
    per_file, tocchi, campi = {}, 0, {}
    for p in sorted(glob.glob(os.path.join(USCITA, "*.json"))):
        if os.path.basename(p).startswith("_"):
            continue
        try:
            per_file[p] = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
    for p, schede in per_file.items():
        for s in schede:
            if not isinstance(s, dict) or not s.get("dominio"):
                continue
            d = dati_da_jsonld(s["dominio"])
            if not d:
                continue
            cambiato = False
            for k, v in d.items():
                if k in ("lat", "lon", "orari", "tipoDichiarato", "nomeStrutturato"):
                    if s.get(k) != v and v not in ("", [], None):
                        s[k] = v; cambiato = True; campi[k] = campi.get(k, 0) + 1
                elif v and not s.get(k):
                    s[k] = v; cambiato = True; campi[k] = campi.get(k, 0) + 1
            tocchi += 1 if cambiato else 0
    print(f"━━━ {sum(len(v) for v in per_file.values())} schede · {tocchi} arricchite ━━━")
    for k, n in sorted(campi.items(), key=lambda x: -x[1]):
        print(f"  {k:18} +{n}")
    if prova:
        print("\n⚠️ PROVA: niente scritto. Rilancia con `--json-ld --scrivi`.")
        return
    for p, schede in per_file.items():
        json.dump(schede, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n✅ riscritti {len(per_file)} file")


def un_dominio_un_file(prova=True):
    """Fa valere l'invariante **«un dominio, una scheda sola»** su tutta l'uscita.

    🔑 **Serve perché i modi di violarlo sono due, e ⛔ nessuno dà errore:**
    **(1)** una scheda promossa da «incerto» a «persona» resta nel file
    `-da-verificare` se qualcuno la reinserisce (è successo **recuperando da
    git** le 165 schede perse: la copia vecchia era «incerto», quella viva era
    già stata promossa); **(2)** lo **stesso studio trovato sotto due province**
    — `galenosalute.it` sta in `marsala` e in `trapani`, ed è normale, perché la
    sigla la decide **chi lo trova per primo**, ⛔ non l'indirizzo.
    ⇒ nel sito lo stesso studio comparirebbe **due volte**.

    Vince la scheda **letta più di recente**; a parità, quella nel file
    **coerente col proprio `tipoSoggetto`** (pubblicabile ⇒ file principale).
    """
    import glob
    from collections import defaultdict
    dove = defaultdict(list)
    for p in sorted(glob.glob(os.path.join(USCITA, "*.json"))):
        if os.path.basename(p).startswith("_"):
            continue
        try:
            for x in json.load(open(p, encoding="utf-8")):
                if isinstance(x, dict) and x.get("dominio"):
                    dove[x["dominio"]].append((p, x))
        except Exception:
            continue
    doppi = {d: v for d, v in dove.items() if len(v) > 1}
    print(f"━━━ {len(dove)} domini · {len(doppi)} presenti in più file ━━━")
    da_togliere = defaultdict(set)
    for d, copie in doppi.items():
        def punteggio(pv):
            p, x = pv
            verificare = p.endswith("-da-verificare.json")
            pubblicabile = x.get("tipoSoggetto") in ("impresa", "persona")
            return (x.get("lettoIl", ""), pubblicabile != verificare)
        tiene = max(copie, key=punteggio)[0]
        for p, x in copie:
            if p != tiene:
                da_togliere[p].add(d)
        print(f"  {d:38} tiene {os.path.basename(tiene)}")
    if prova:
        print("\n⚠️ PROVA: niente è stato scritto. Rilancia con `--un-file --scrivi`.")
        return
    for p, domini in da_togliere.items():
        dati = [x for x in json.load(open(p, encoding="utf-8"))
                if not (isinstance(x, dict) and x.get("dominio") in domini)]
        json.dump(dati, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n✅ ripulite {sum(len(v) for v in da_togliere.values())} copie in {len(da_togliere)} file")


def riprova_falliti(prova=True):
    """Ritenta i domini archiviati come «il sito non ha risposto».

    📏 **Perche' esiste**: 343 schede su 10.694 portavano quel motivo, e un
    sondaggio su 40 ha trovato che **17 rispondevano** — **14 solo su `http`**.
    ⇒ ⛔ non erano irraggiungibili: `analizza()` provava **solo `https`**.

    ⚠️ Va lanciato **dopo** la ricaduta su `http`, altrimenti rifa' esattamente
    le stesse quattro chiamate che erano gia' fallite.
    """
    import glob
    per_file, da_fare = {}, []
    for p in sorted(glob.glob(os.path.join(USCITA, "*.json"))):
        if os.path.basename(p).startswith("_"):
            continue
        try:
            per_file[p] = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
        for s in per_file[p]:
            if isinstance(s, dict) and s.get("motivoEsclusione", "").startswith("il sito non ha risposto"):
                da_fare.append((p, s))
    print(f"━━━ {len(da_fare)} schede da ritentare ━━━")
    ripresi, ancora = 0, 0
    for p, s in da_fare:
        nuova = analizza(s["dominio"], s.get("provincia", "") or "")
        if nuova.get("motivoEsclusione", "").startswith("il sito non ha risposto"):
            ancora += 1
            continue
        ripresi += 1
        print(f"  ✅ {s['dominio'][:40]:42} {str(nuova.get('nome'))[:30]:32} "
              f"{nuova.get('tipoSoggetto')}")
        if not prova:
            # ⚠️ Si **sostituisce** la scheda: quella vecchia ⛔ non contiene
            # niente da salvare — solo il dominio e il motivo del fallimento.
            s.clear()
            s.update(nuova)
        time.sleep(0.5)
    print(f"\n━━━ {ripresi} recuperate · {ancora} ancora mute ━━━")
    if prova:
        print("\n⚠️ PROVA: niente scritto. Rilancia con `--riprova-falliti --scrivi`.")
        return
    for p, schede in per_file.items():
        json.dump(schede, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"✅ riscritti {len(per_file)} file")


def riclassifica(prova=True):
    """Ripassa le schede **già raccolte** col classificatore aggiornato,
    leggendo dalla **cache** e ⛔ senza una sola richiesta di rete.

    🔑 **Perché esiste.** Il 2026-08-15 le schede in «incerto» erano **1.080**,
    e **tutte** con lo stesso motivo — *«nessuna forma societaria e nessun nome
    di struttura»*, che ⛔ non è un dubbio: è **la definizione di un libero
    professionista**. Il classificatore era tarato sulle imprese e scartava
    esattamente la categoria che mancava all'elenco. ⇒ il recupero ⛔ non
    richiede di ricercare né di rileggere niente: i siti sono **già stati
    scaricati**, la cache ce l'ha, e il costo è **$0**.

    ⚠️ `prova=True` ⛔ non scrive: conta e mostra. Un riclassificatore che
    riscrive 3.000 schede prima di essere stato guardato è il modo di perdere
    in silenzio le classificazioni buone.
    """
    import glob
    per_sigla, letti, senza_cache = {}, 0, 0
    for p in sorted(glob.glob(os.path.join(USCITA, "*.json"))):
        b = os.path.basename(p)
        if b.startswith("_"):
            continue
        sigla = b[:-5].replace("-da-verificare", "")
        try:
            per_sigla.setdefault(sigla, []).extend(json.load(open(p, encoding="utf-8")))
        except Exception:
            continue
    cambi, esiti = [], {}
    for sigla, schede in per_sigla.items():
        for s in schede:
            if not isinstance(s, dict) or not s.get("dominio"):
                continue
            pagine = list(pagine_in_cache(s["dominio"]))
            if not pagine:
                senza_cache += 1
                continue
            letti += 1
            grezzo = "\n".join(h for _, h in pagine)
            piatto = re.sub(r'\s+', ' ', "\n".join(testo_di(h) for _, h in pagine))
            piva_m = RE_PIVA.search(piatto)
            ctx = piatto[max(0, piva_m.start() - 160):piva_m.start() + 40] if piva_m else ""
            prima = s.get("tipoSoggetto", "?")
            dopo, ragione = classifica(s["dominio"], s.get("nome", ""), piatto, ctx)
            if s["dominio"] in DECISE:      # ⚠️ la revisione umana vince, qui come in analizza()
                dopo, ragione = DECISE[s["dominio"]]["tipo"], DECISE[s["dominio"]]["nota"]
            # 🔑 **Il ripasso è MONOTÒNO: recupera, ⛔ non declassa.** Il testo
            # riletto dalla cache può essere **più povero** di quello letto in
            # origine (`analizza` segue fino a 3 pagine interne; in cache può
            # essercene una sola) ⇒ un `impresa → incerto` ⛔ non è una scoperta,
            # è **una pagina che manca**. Misurato alla prima prova: **29
            # imprese** sarebbero retrocesse così, perdendo classificazioni
            # buone senza una riga di avviso.
            # ⚠️ `non_pertinente` e `non_medico` fanno eccezione **di
            # proposito**: lì il ripasso ⛔ non perde informazione, la **aggiunge**
            # — sono fuori scopo, e restarci era l'errore.
            if dopo == "incerto" and prima in ("impresa", "persona"):
                esiti[f"{prima} → incerto (IGNORATO: cache più povera)"] = \
                    esiti.get(f"{prima} → incerto (IGNORATO: cache più povera)", 0) + 1
                continue
            esiti[f"{prima} → {dopo}"] = esiti.get(f"{prima} → {dopo}", 0) + 1
            if dopo != prima:
                cambi.append((s["dominio"], s.get("nome", "")[:38], prima, dopo, ragione))
                if not prova:
                    s["tipoSoggetto"] = dopo
                    s["ragioneClassificazione"] = ragione
                    s["escluso"], s["motivoEsclusione"] = stato_elenco(dopo, ragione)
            # 🔴 **E si riconcilia `escluso` ANCHE quando il tipo ⛔ non cambia.**
            # Era il buco: questo ripasso scriveva **solo** se il tipo cambiava,
            # quindi una scheda gia' `persona` e gia' esclusa da `analizza()`
            # ⛔ non veniva mai corretta. Sono **1.079 medici** rimasti fuori
            # dall'elenco perche' nessuno rileggeva la loro casella.
            atteso_e, atteso_m = stato_elenco(dopo, s.get("ragioneClassificazione") or ragione)
            if bool(s.get("escluso")) != atteso_e:
                esiti["🔧 «escluso» riconciliato col tipo"] = \
                    esiti.get("🔧 «escluso» riconciliato col tipo", 0) + 1
                if not prova:
                    s["escluso"], s["motivoEsclusione"] = atteso_e, atteso_m
    print(f"━━━ {letti} schede ripassate dalla cache · {senza_cache} senza cache · "
          f"{len(cambi)} cambiano ━━━")
    for k, n in sorted(esiti.items(), key=lambda x: -x[1]):
        # ⚠️ ⛔ Non tutte le chiavi sono «prima → dopo»: la riconciliazione di
        # `escluso` ⛔ non e' un passaggio di tipo. Assumerlo faceva **saltare
        # il rapporto** con un IndexError — e il rapporto sta **prima** di
        # `smista()`, quindi il ripasso moriva senza scrivere niente.
        pezzi = k.split(" → ")
        marchio = "  " if len(pezzi) == 2 and pezzi[0] == pezzi[1] else "🔄"
        print(f"  {marchio} {k:34} {n}")
    for d, n, a, b, r in cambi[:25]:
        print(f"     {d:36} {n:40} {a} → {b}")
    if prova:
        print("\n⚠️ PROVA: niente è stato scritto. Rilancia con `--riclassifica --scrivi`.")
        return
    for sigla, schede in per_sigla.items():
        smista(schede, sigla)
    print(f"\n✅ riscritte le schede di {len(per_sigla)} zone")


def opposizioni():
    """I domini che hanno chiesto di ⛔ non comparire (art. 21).

    ⚠️ Se il file manca si procede — all'inizio ⛔ non esiste. Ma se è
    **illeggibile si ferma tutto**: proseguire vorrebbe dire ripubblicare chi
    si era opposto, ed è l'unico errore di questa raccolta che ⛔ non si
    ripara rifacendo il giro.

    🔑 **Due file, e il secondo è la ragione per cui il primo può restare com'è.**
    Da TD-166 l'opposizione arriva anche dal **collegamento nell'email**, cioè
    da un endpoint, e a quel punto gli scrittori diventano **due**. Due
    scrittori che **riscrivono un JSON intero** si perdono a vicenda: è
    esattamente il difetto già pagato in `smista()`, dove 165 schede sono
    sparite perché si sovrascriveva invece di fondere — e lì i totali
    **salivano**, quindi ⛔ non se ne accorse nessuno.
    ⇒ l'endpoint **appende** righe a `_opposizioni.jsonl` (`O_APPEND`, che su
    righe piccole è atomico: ⛔ niente lock, ⛔ niente riscrittura, ⛔ nessuna
    corsa). Qui si leggono **entrambi**, e ⛔ **il `.json` ⛔ non si migra**: è
    l'unico file di questa cartella che ⛔ non si rigenera, e toccarlo per
    ordine sarebbe rischiare l'unica cosa irreparabile.
    ⚠️ Una riga rotta nel `.jsonl` ⛔ **non ferma le altre**: fermarsi
    lascerebbe pubblicato chi si è opposto **dopo** quella riga."""
    f = os.path.join(USCITA, "_opposizioni.json")
    fuori_jsonl = _opposizioni_appese()
    if not os.path.exists(f):
        return fuori_jsonl
    try:
        elenco = json.load(open(f, encoding="utf-8"))
    except Exception as e:
        raise SystemExit(f"⛔ `_opposizioni.json` illeggibile ({e}) — ⛔ non si pubblica "
                         "niente finché non torna leggibile.")
    # ⚠️ **Due formati, ⛔ non uno.** Il registro nasce come elenco di stringhe;
    # da quando `--opponi` lo scrive, ogni voce è un oggetto con **la data della
    # richiesta** — che serve a dimostrare *quando* è stata accolta. ⇒ si leggono
    # entrambi: un file vecchio ⛔ non deve smettere di proteggere chi c'è dentro,
    # ed è **l'unico file di questa cartella che ⛔ non si rigenera**.
    fuori = set(fuori_jsonl)
    for d in elenco:
        s = d.get("dominio", "") if isinstance(d, dict) else str(d)
        s = s.strip().lower().removeprefix("www.")
        if s:
            fuori.add(s)
    return fuori


def _opposizioni_appese():
    """Le opposizioni arrivate dall'endpoint, una per riga (vedi `opposizioni`)."""
    f = os.path.join(USCITA, "_opposizioni.jsonl")
    if not os.path.exists(f):
        return set()
    fuori, rotte = set(), 0
    with open(f, encoding="utf-8") as fh:
        for riga in fh:
            riga = riga.strip()
            if not riga:
                continue
            try:
                d = json.loads(riga)
                s = str(d.get("dominio", "")).strip().lower().removeprefix("www.")
            except Exception:
                rotte += 1
                continue
            if s:
                fuori.add(s)
    if rotte:
        # ⚠️ Si segnala e si prosegue: fermarsi qui lascerebbe pubblicato chi si
        # è opposto **dopo** la riga rotta, che è il danno peggiore dei due.
        print(f"  ⚠️  {rotte} righe illeggibili in `_opposizioni.jsonl` "
              f"(le altre {len(fuori)} valgono lo stesso)")
    return fuori

def registra_opposizione(domini, motivo=""):
    """Registra un'opposizione dell'art. 21 e **rimuove subito** le schede.

    🔑 **L'informativa promette due cose, e finora il codice ne faceva una.**
    `opposizioni()` **leggeva** il registro ad ogni giro — ⛔ ma per *scriverci*
    bisognava aprire il JSON a mano, ed è precisamente il gesto che ⛔ non si fa
    quando arriva una mail e si ha fretta. ⇒ un diritto che dipende dalla
    diligenza di chi legge la posta ⛔ non è un presidio: è una promessa.

    ⚠️ **Rimuove anche le schede già scritte**, ⛔ non solo i giri futuri:
    escludere dalle prossime letture lascerebbe online quella di oggi, che è
    esattamente ciò a cui l'interessato si è opposto.

    ⛔ **⛔ Non si chiede il motivo, e ⛔ non si valuta**: l'art. 21 sul legittimo
    interesse ⛔ non lo richiede, e l'informativa dichiara *«l'opposizione ⛔ non
    richiede motivazione e viene accolta senza eccezioni»*. Il parametro serve
    solo a **datare la richiesta**, ⛔ non a filtrarla.
    """
    import glob
    f = os.path.join(USCITA, "_opposizioni.json")
    elenco = []
    if os.path.exists(f):
        try:
            elenco = json.load(open(f, encoding="utf-8"))
        except Exception as e:
            raise SystemExit(f"⛔ `_opposizioni.json` illeggibile ({e}): ⛔ non lo sovrascrivo. "
                             "Va riparato a mano, o si perderebbero le opposizioni già accolte.")
    puliti = [d.strip().lower().removeprefix("https://").removeprefix("http://")
              .removeprefix("www.").rstrip("/") for d in domini if d.strip()]
    prima = {x["dominio"] if isinstance(x, dict) else str(x) for x in elenco}
    oggi = time.strftime("%Y-%m-%d")
    for d in puliti:
        if d not in prima:
            elenco.append({"dominio": d, "chiestoIl": oggi, "nota": motivo[:200]})
    json.dump(elenco, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"✅ registro: {len(elenco)} opposizioni ({len(set(puliti) - prima)} nuove)")

    tolte = 0
    for p in sorted(glob.glob(os.path.join(USCITA, "*.json"))):
        if os.path.basename(p).startswith("_"):
            continue
        try:
            dati = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
        resta = [x for x in dati
                 if not (isinstance(x, dict) and x.get("dominio", "").lower() in set(puliti))]
        if len(resta) != len(dati):
            tolte += len(dati) - len(resta)
            json.dump(resta, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"✅ rimosse {tolte} schede già pubblicate")
    print("⚠️ La cache ⛔ NON viene toccata: serve a ⛔ non ricontattare il sito. "
          "Il dominio ⛔ non verrà più letto perché sta nel registro.")


def rinfresca(giorni=90, quanti=None):
    """Rilegge le schede più vecchie di `giorni`, perché **l'esattezza decade**.

    🔑 L'informativa dell'art. 14 **promette** che i dati sono *«verificati
    periodicamente rileggendo il sito di origine»* e che *«se il sito cessa di
    essere raggiungibile la scheda viene rimossa»*. ⇒ senza questo comando
    quella riga sarebbe **falsa**, e una promessa scritta in un'informativa
    ⛔ non è una dichiarazione d'intenti: è ciò su cui l'interessato fa
    affidamento per ⛔ non oppporsi.

    ⚠️ Riusa `--leggi-stato`: ⛔ non duplica la lettura, **rimette in coda**.
    """
    import glob
    limite = time.time() - giorni * 86400
    vecchie = []
    for p in sorted(glob.glob(os.path.join(USCITA, "*.json"))):
        if os.path.basename(p).startswith("_"):
            continue
        try:
            for x in json.load(open(p, encoding="utf-8")):
                if not isinstance(x, dict) or not x.get("dominio"):
                    continue
                letto = x.get("lettoIl", "")
                try:
                    quando = time.mktime(time.strptime(letto, "%Y-%m-%d"))
                except Exception:
                    quando = 0     # ⚠️ senza data si rilegge: ⛔ non si assume fresca
                if quando < limite:
                    vecchie.append((x["dominio"], letto or "(mai)"))
        except Exception:
            continue
    vecchie.sort(key=lambda v: v[1])
    if quanti:
        vecchie = vecchie[:quanti]
    print(f"━━━ {len(vecchie)} schede più vecchie di {giorni} giorni ━━━")
    for d, q in vecchie[:10]:
        print(f"  {d:40} letta il {q}")
    if not vecchie:
        print("  ✅ nessuna: l'elenco è fresco.")
        return
    print(f"\n⇒ per rileggerle: cancella la loro scheda e rilancia `--leggi-stato`,\n"
          f"   oppure passa i domini a `--elenco`. ⚠️ Il rinfresco ⛔ non è ancora\n"
          f"   automatico: questo comando **misura il debito**, ⛔ non lo salda.")


def verifica(sigla):
    """Secondo giro sugli incerti: si leggono le pagine legali e si ri-decide."""
    f = os.path.join(USCITA, f"{sigla.lower()}-da-verificare.json")
    incerte = json.load(open(f, encoding="utf-8"))
    print(f"\n━━━ secondo giro su {len(incerte)} incerti di {sigla} ━━━")
    with ThreadPoolExecutor(max_workers=6) as ex:
        rifatte = list(ex.map(
            lambda s: analizza(s["dominio"], sigla, dove_cercare=RE_LEGALI, max_pagine=5),
            incerte))
    vecchie = {s["dominio"]: s for s in json.load(
        open(os.path.join(USCITA, f"{sigla.lower()}.json"), encoding="utf-8"))}
    for s in rifatte:
        stato = s.get("tipoSoggetto", "—")
        print(f"  {'✓' if stato == 'impresa' else '·'} {s['dominio'][:32]:34} {stato:9} "
              f"{s.get('ragioneClassificazione', s.get('motivoEsclusione', ''))[:44]}")
    # ⚠️ Le schede già buone ⛔ non si toccano: il secondo giro **aggiunge**.
    tutte = list(vecchie.values()) + [s for s in rifatte if s.get("dominio") not in vecchie]
    b, i, _ = smista(tutte, sigla)
    print(f"→ {len(b)} imprese ({len(b)-len(vecchie)} promosse) · {len(i)} ancora incerte")

if __name__ == "__main__":
    arg = sys.argv[1:]
    if "--geocodifica" in arg:
        for s in [a for a in arg if a != "--geocodifica"]:
            geocodifica(s)
        sys.exit(0)
    if "--nazionale" in arg:
        prov = json.load(open(os.path.join(QUI, "province.json"), encoding="utf-8"))
        n = [a for a in arg if a.isdigit()]
        prov = prov[:int(n[0])] if n else prov
        scoperta_nazionale([(c, s) for c, s in prov])
        sys.exit(0)
    if "--coord-comune" in arg:
        coordinate_dal_comune(prova="--scrivi" not in arg)
        sys.exit(0)
    if "--opponi" in arg:
        d = [a for a in arg if a != "--opponi" and not a.startswith("--")]
        if not d:
            raise SystemExit("uso: --opponi dominio.it [altro.it] — accoglie l'opposizione\n"
                             "     dell'art. 21: registro permanente + rimozione delle schede.")
        registra_opposizione(d)
        sys.exit(0)
    if "--rinfresca" in arg:
        n = [int(a) for a in arg if a.isdigit()]
        rinfresca(giorni=n[0] if n else 90)
        sys.exit(0)
    if "--json-ld" in arg:
        arricchisci_da_jsonld(prova="--scrivi" not in arg)
        sys.exit(0)
    if "--un-file" in arg:
        un_dominio_un_file(prova="--scrivi" not in arg)
        sys.exit(0)
    if "--riprova-falliti" in arg:
        # 🔑 Ritenta **solo** le schede archiviate come «il sito non ha
        # risposto», e ⛔ nient'altro: e' la coda che la ricaduta su `http` ha
        # reso recuperabile. ⛔ Non tocca le schede che avevano gia' risposto.
        riprova_falliti(prova="--scrivi" not in arg)
        sys.exit(0)
    if "--riclassifica" in arg:
        riclassifica(prova="--scrivi" not in arg)
        sys.exit(0)
    if "--riapri" in arg:
        # 🔑 Una località «esaurita» lo è **rispetto ai modelli di allora**.
        # Aggiungerne di nuovi (2026-08-15: 10 modelli per i liberi
        # professionisti) ⛔ non li fa girare da solo: il ciclo salta ciò che sta
        # in `chiuse`, e quei modelli ⛔ non verrebbero provati **mai più**.
        # 🔴 **⛔ Non si tocca mentre la scoperta gira**: il processo tiene lo
        # stato **in memoria** e lo riscrive al primo salvataggio ⇒ la riapertura
        # sparirebbe **senza un errore**, e me ne accorgerei solo contando le
        # ricerche che ⛔ non sono state fatte.
        # ⚠️ **Si guarda il PROCESSO, ⛔ non l'orario del file.** La prima
        # versione usava solo l'`mtime` e ha dato un **falso positivo** un
        # minuto dopo aver fermato la scoperta: «scritto 57s fa» ⛔ non vuol dire
        # «sta scrivendo», vuol dire «ha scritto». ⇒ un presidio che confonde le
        # due cose blocca il lavoro buono e ⛔ non protegge da niente in più.
        import subprocess
        vivi = subprocess.run(["pgrep", "-f", "raccolta-cliniche.py.*--nazionale"],
                              capture_output=True, text=True).stdout.split()
        vivi = [p for p in vivi if p != str(os.getpid())]
        if vivi:
            raise SystemExit(f"⛔ la scoperta gira ancora (PID {', '.join(vivi)}): "
                             "il processo tiene lo stato in memoria e la riapertura sparirebbe "
                             "senza un errore. Fermala, poi riapri.")
        st = carica_stato()
        quante = len(st.get("chiuse", []))
        st["chiuse"], st["resa"] = [], {}
        salva_stato(st)
        print(f"✅ riaperte {quante} località · {len(st['fatte'])} ricerche già fatte restano "
              f"tali (⛔ non si rifanno), i modelli nuovi girano su tutte")
        sys.exit(0)
    if "--leggi-stato" in arg:
        n = [a for a in arg if a.isdigit()]
        leggi_dallo_stato(per_giro=int(n[0]) if n else None)
        sys.exit(0)
    if "--arricchisci" in arg:
        arricchisci([a for a in arg if a != "--arricchisci"])
        sys.exit(0)
    if "--offerte" in arg:
        misura_offerte([a for a in arg if a != "--offerte"])
        sys.exit(0)
    if "--dispositivi" in arg:
        misura_dispositivi([a for a in arg if a != "--dispositivi"])
        sys.exit(0)
    if "--verifica" in arg:
        for s in [a for a in arg if a != "--verifica"]:
            verifica(s)
        sys.exit(0)
    if not arg:
        raise SystemExit("uso: raccolta-cliniche.py Milano:MI Roma:RM\n"
                         "     raccolta-cliniche.py --elenco domini.json")

    print(f"lista di esclusione: {len(ESCLUSI)} domini · uscita: {USCITA}")
    tot_b, tot_i, tot_p = [], [], []
    if "--elenco" in arg:
        d = json.load(open(arg[arg.index("--elenco") + 1], encoding="utf-8"))
        for sigla, voce in d.items():
            b, i, p_ = raccogli(voce["citta"], sigla, elenco=voce["domini"])
            tot_b += b; tot_i += i; tot_p += p_
    else:
        for a in arg:
            citta, sigla = a.split(":")
            b, i, p_ = raccogli(citta, sigla)
            tot_b += b; tot_i += i; tot_p += p_

    n = len(tot_b) or 1
    letti = len(tot_b) + len(tot_i) + len(tot_p)
    print(f"\n═══ {letti} siti letti → {len(tot_b)} imprese pubblicabili · "
          f"{len(tot_i)} da verificare · {len(tot_p)} professionisti ═══")
    for campo in ("partitaIva", "telefono", "email", "indirizzo", "comune"):
        c = sum(1 for s in tot_b if s.get(campo))
        print(f"  {campo:34} {c:3}/{len(tot_b)}  ({100*c//n}%)")
    for campo in ("dichiaraDirettoreSanitario", "dichiaraAutorizzazioneSanitaria"):
        c = sum(1 for s in tot_b if s.get(campo))
        print(f"  {campo:34} {c:3}/{len(tot_b)}  ({100*c//n}%)")
    motivi = {}
    for s in tot_i:
        k = s["motivoEsclusione"].split(":")[0]
        motivi[k] = motivi.get(k, 0) + 1
    print("  scartate per:", ", ".join(f"{k} ×{v}" for k, v in sorted(motivi.items(), key=lambda x: -x[1])))
    print(f"  rete: {CONTI['ricerche']} ricerche · {CONTI['pagine']} pagine · "
          f"{CONTI['falliti']} falliti · {CONTI['robots_no']} vietati da robots.txt · costo $0")
