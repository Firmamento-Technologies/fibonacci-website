#!/usr/bin/env python3
"""Costruisce `directory.sqlite` dalle schede JSON — TD-162.

🔑 **Perché SQLite e ⛔ non un motore di ricerca.** 4.658 schede con ~20 campi
puliti sono **poche**: un indice relazionale risponde in **millisecondi**, e la
ricerca semantica su domande **strutturate** («filler labbra a Verona») ha
notoriamente **bassa precisione** — la cura è il **filtro sui metadati**, ⛔ non
l'embedding. ⇒ il vettoriale resta per un problema **diverso e più piccolo**:
mappare il **linguaggio libero** del paziente sul vocabolario dei trattamenti
(~200 voci), ⛔ **non** sui 4.658 profili. Vedi TD-156.

⛔ **Questo file ⛔ NON pubblica niente.** Costruisce un database **locale**, che
⛔ non è raggiungibile dal sito e ⛔ non entra nella build: il cablaggio è
**l'ultimo passaggio** e richiede il permesso esplicito dell'utente
(2026-08-16). ⇒ qui si prepara **la capacità**, ⛔ non l'esposizione.

    python3 scripts/costruisci-db.py            # costruisce
    python3 scripts/costruisci-db.py --prova    # interroga, per vedere se serve
"""
import json, glob, math, os, sqlite3, sys, unicodedata

QUI = os.path.dirname(os.path.abspath(__file__))
USCITA = os.path.join(QUI, "..", "src", "dati", "cliniche")
DB = os.path.join(QUI, "directory.sqlite")

SCHEMA = """
PRAGMA journal_mode = WAL;

CREATE TABLE studi (
  dominio            TEXT PRIMARY KEY,
  nome               TEXT NOT NULL,
  tipo               TEXT NOT NULL,     -- impresa | persona
  sito               TEXT,
  indirizzo          TEXT,
  cap                TEXT,
  comune             TEXT,
  provincia          TEXT,
  telefono           TEXT,
  email              TEXT,
  partita_iva        TEXT,
  lat                REAL,
  lon                REAL,
  precisione_coord   TEXT,              -- civico | comune | NULL
  direttore_sanitario INTEGER NOT NULL DEFAULT 0,
  autorizzazione     INTEGER NOT NULL DEFAULT 0,
  orari              TEXT,              -- JSON, come dichiarato dal sito
  fonte              TEXT,              -- da quale pagina
  letto_il           TEXT,
  -- 🔑 `elenco` = letta da fonti pubbliche · `studio` = **dichiarata dallo
  -- studio** che è cliente e ha acceso l'interruttore (TD-93). Vedi
  -- `fondi_i_pubblicati` per il perché la seconda vince sulla prima.
  origine            TEXT NOT NULL DEFAULT 'elenco'
);

-- ⚠️ Le prestazioni stanno in una tabella PROPRIA, ⛔ non in una colonna con le
-- virgole: «chi fa il filler» è **la** domanda del progetto, e su una stringa
-- si risponde solo con un LIKE che ⛔ non usa indici.
CREATE TABLE prestazioni (
  dominio      TEXT NOT NULL REFERENCES studi(dominio) ON DELETE CASCADE,
  prestazione  TEXT NOT NULL,
  PRIMARY KEY (dominio, prestazione)
);

CREATE INDEX idx_studi_comune     ON studi(comune);
CREATE INDEX idx_studi_provincia  ON studi(provincia);
CREATE INDEX idx_studi_tipo       ON studi(tipo);
-- ⚠️ Indice sulle coordinate: serve al **riquadro** che precede il calcolo
-- della distanza. ⛔ Senza, «vicino a me» leggerebbe tutte le righe.
CREATE INDEX idx_studi_geo        ON studi(lat, lon);
CREATE INDEX idx_prest_nome       ON prestazioni(prestazione);

-- 🔑 FTS solo sul **nome**: serve a chi cerca **uno studio che già conosce**
-- («Studio Rossi»), che è il primo pubblico della directory. ⛔ Non è ricerca
-- semantica e ⛔ non prova a esserlo.
--
-- 🔴 **`content=''` è stato TOLTO il 2026-08-16, ed era un difetto vero.**
-- Una tabella FTS5 *contentless* ⛔ non conserva i valori delle colonne: la
-- ricerca trovava le righe ⛔ ma restituiva `dominio = NULL`, cioè **trovava
-- senza saper dire chi**. ⚠️ Il banco di `--prova` non se n'era accorto perché
-- **contava le righe** («2 righe · 0,1 ms») invece di guardarle: una misura
-- che ⛔ non può fallire ⛔ non è una misura. Trovato provando la fusione di
-- TD-167, ⛔ non leggendo.
-- ⚠️ Seconda conseguenza, più insidiosa: su una tabella contentless
-- `DELETE ... WHERE dominio=?` ⛔ **non cancella niente e ⛔ non dà errore**
-- (`rowcount` 0) ⇒ una scheda aggiornata sarebbe rimasta **due volte**
-- nell'indice, la seconda col nome vecchio.
-- Il costo di tenere il contenuto è ~5.700 nomi: irrilevante.
CREATE VIRTUAL TABLE studi_fts USING fts5(dominio UNINDEXED, nome, comune);
"""


def senza_accenti(s):
    return "".join(c for c in unicodedata.normalize("NFD", s or "")
                   if not unicodedata.combining(c))


def schede():
    """⛔ Solo le pubblicabili: i file `-da-verificare` ⛔ non entrano, e ⛔ non è
    una svista — un database che mescola le due pile farebbe finire un «fuori
    tema» in una risposta al primo che ⛔ non filtra."""
    for p in sorted(glob.glob(os.path.join(USCITA, "*.json"))):
        b = os.path.basename(p)
        if b.startswith("_") or b.endswith("-da-verificare.json"):
            continue
        try:
            for x in json.load(open(p, encoding="utf-8")):
                if isinstance(x, dict) and x.get("dominio") and x.get("nome"):
                    yield x
        except Exception:
            continue


def costruisci():
    # ⚠️ Si ricostruisce **da zero** ad ogni giro: il database è un **derivato**
    # dei JSON, ⛔ non una fonte. Aggiornarlo in luogo lascerebbe righe di
    # schede cancellate — comprese quelle **rimosse per opposizione**, che è
    # esattamente ciò che ⛔ non deve sopravvivere da nessuna parte.
    if os.path.exists(DB):
        os.remove(DB)
    for coda in ("-wal", "-shm"):
        if os.path.exists(DB + coda):
            os.remove(DB + coda)
    db = sqlite3.connect(DB)
    db.executescript(SCHEMA)
    # 🔑 I domini dichiarati si conoscono **prima** di scrivere: così la riga
    # letta da fuori ⛔ non entra affatto, invece di entrare e venire corretta.
    # Cancellare dopo è la strada che ha già prodotto un difetto (l'indice FTS
    # restava con il nome vecchio, e la `DELETE` ⛔ non lo diceva).
    pubblicati = _pubblicati()
    n = p = saltate = 0
    for s in schede():
        if s["dominio"].strip().lower().removeprefix("www.") in pubblicati:
            saltate += 1
            continue
        orari = s.get("orari")
        db.execute(
            "INSERT OR REPLACE INTO studi VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'elenco')",
            (s["dominio"], s["nome"], s.get("tipoSoggetto", "?"), s.get("sitoUrl"),
             s.get("indirizzo"), s.get("cap"), s.get("comune"), s.get("provincia"),
             s.get("telefono"), s.get("email"), s.get("partitaIva"),
             s.get("lat"), s.get("lon"), s.get("precisioneCoord"),
             1 if s.get("dichiaraDirettoreSanitario") else 0,
             1 if s.get("dichiaraAutorizzazioneSanitaria") else 0,
             json.dumps(orari, ensure_ascii=False) if orari else None,
             (s.get("fonteUrl") or [None])[0] if isinstance(s.get("fonteUrl"), list)
             else s.get("fonteUrl"),
             s.get("lettoIl")))
        n += 1
        for pr in (s.get("prestazioni") or []):
            db.execute("INSERT OR IGNORE INTO prestazioni VALUES (?,?)", (s["dominio"], pr))
            p += 1
        db.execute("INSERT INTO studi_fts (dominio, nome, comune) VALUES (?,?,?)",
                   (s["dominio"], senza_accenti(s["nome"]), senza_accenti(s.get("comune") or "")))
    dichiarati = fondi_i_pubblicati(db, pubblicati)
    db.commit()
    print(f"✅ {DB}")
    print(f"   {n + dichiarati} studi · {p} prestazioni · {os.path.getsize(DB) // 1024} KB")
    if dichiarati:
        print(f"   di cui dichiarati dallo studio: {dichiarati} "
              f"({saltate} hanno sostituito una scheda letta da fuori, "
              f"{dichiarati - saltate} nuovi)")
    return db


PUBBLICATI = os.path.join(USCITA, "_pubblicati.json")


def _pubblicati():
    """I domini che hanno acceso l'interruttore, letti **prima** di costruire."""
    return {(s.get("dominio") or "").strip().lower().removeprefix("www.")
            for s in _leggi_pubblicati() if s.get("dominio") and s.get("nome")}


def _leggi_pubblicati():
    if not os.path.exists(PUBBLICATI):
        return []
    try:
        return json.load(open(PUBBLICATI, encoding="utf-8"))
    except Exception as e:
        # ⛔ Ci si ferma: proseguire pubblicherebbe nel matching la versione
        # **letta da fuori** di studi che ci hanno dato la loro. È il caso in
        # cui un dato vecchio verrebbe preso per quello attuale.
        raise SystemExit(f"⛔ `_pubblicati.json` illeggibile ({e}): ⛔ non si costruisce "
                         "il database con l'elenco a metà.")


def fondi_i_pubblicati(db, _domini):
    """Unisce all'elenco gli studi **clienti** che hanno acceso l'interruttore. — TD-167

    🔴 **Il problema che risolve**: erano **due elenchi che ⛔ non si
    incontravano**. L'interruttore di TD-93 (extension
    `urn:firmamento:pagina-pubblica` sull'`Organization`) porta lo studio nella
    **pagina pubblica**; il **matching** invece gira su questo database, che
    contiene solo le schede lette da fonti pubbliche. ⇒ un medico che accendeva
    l'interruttore **⛔ non entrava nel matching**, e uno già nell'elenco che
    diventava cliente sarebbe comparso **due volte**.

    ✅ **La chiave ⛔ non è stata inventata: è il DOMINIO**, che è già chiave
    primaria qui ed è già il `sito` che lo studio dichiara.

    🔑 **A righe coincidenti vince lo studio, e la sostituzione è di RIGA INTERA,
    ⛔ non campo per campo.** Tenere metà campi dell'uno e metà dell'altro
    produrrebbe una riga di cui **nessuno può dire di chi è**, e la ragione per
    cui lo studio vince è precisamente **di chi risponde**: davanti all'Ordine
    risponde lui. È la stessa ragione già scritta in `medici-pubblici.ts` per
    ⛔ non prendere l'albo dal CRM.
    ⇒ **anche le prestazioni si sostituiscono**: quelle lette dal suo sito erano
    una nostra deduzione, quelle dichiarate sono sue.

    ⚠️ **Oggi il file ⛔ non esiste e la funzione ⛔ non fa niente**, ed è lo stato
    vero del progetto: **zero studi** hanno acceso l'interruttore. Lo scriverà
    chi caverà l'elenco dal sidecar (TD-94). ⛔ Non è un finto: è cablatura
    pronta, e il conteggio a schermo lo dice.
    """
    scritti = 0
    for s in _leggi_pubblicati():
        d = (s.get("dominio") or "").strip().lower().removeprefix("www.")
        if not d or not s.get("nome"):
            continue
        db.execute(
            "INSERT OR REPLACE INTO studi VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'studio')",
            (d, s["nome"], s.get("tipoSoggetto", "?"), s.get("sitoUrl"),
             s.get("indirizzo"), s.get("cap"), s.get("comune"), s.get("provincia"),
             s.get("telefono"), s.get("email"), s.get("partitaIva"),
             s.get("lat"), s.get("lon"), s.get("precisioneCoord"),
             1 if s.get("dichiaraDirettoreSanitario") else 0,
             1 if s.get("dichiaraAutorizzazioneSanitaria") else 0,
             json.dumps(s["orari"], ensure_ascii=False) if s.get("orari") else None,
             s.get("fonteUrl"), s.get("lettoIl")))
        for pr in (s.get("prestazioni") or []):
            db.execute("INSERT OR IGNORE INTO prestazioni VALUES (?,?)", (d, pr))
        db.execute("INSERT INTO studi_fts (dominio, nome, comune) VALUES (?,?,?)",
                   (d, senza_accenti(s["nome"]), senza_accenti(s.get("comune") or "")))
        scritti += 1
    return scritti


def interroga(db):
    """Le domande che il database deve saper reggere. 🔑 ⛔ Non è una dimostrazione:
    è la **prova che le faccette bastano**, ed è il motivo per cui ⛔ non serve
    un motore vettoriale sul catalogo."""
    def crono(eti, sql, args=()):
        import time
        t = time.perf_counter()
        r = db.execute(sql, args).fetchall()
        print(f"  {eti:52} {len(r):5} righe · {(time.perf_counter()-t)*1000:.1f} ms")
        return r

    print("\n━━━ le domande vere, e quanto ci mettono ━━━")
    crono("chi fa il filler, ovunque",
          "SELECT dominio FROM prestazioni WHERE prestazione='Filler'")
    crono("chi fa il filler a Milano",
          "SELECT s.dominio FROM studi s JOIN prestazioni p USING(dominio) "
          "WHERE p.prestazione='Filler' AND s.comune='Milano'")
    crono("professionisti (⛔ non strutture) che fanno botulino",
          "SELECT s.dominio FROM studi s JOIN prestazioni p USING(dominio) "
          "WHERE p.prestazione='Tossina botulinica' AND s.tipo='persona'")
    # ⚠️ Il riquadro **prima**, la distanza **dopo**: senza, si calcolerebbe il
    # coseno su 4.658 righe per scartarne 4.600.
    lat, lon, raggio = 45.4642, 9.1900, 25.0      # Milano, 25 km
    dlat = raggio / 111.0
    dlon = raggio / (111.0 * math.cos(math.radians(lat)))
    vicini = crono(f"a meno di {raggio:.0f} km da Milano, che fanno laser",
                   "SELECT s.dominio, s.nome, s.lat, s.lon FROM studi s "
                   "JOIN prestazioni p USING(dominio) WHERE p.prestazione='Laser' "
                   "AND s.lat BETWEEN ? AND ? AND s.lon BETWEEN ? AND ?",
                   (lat - dlat, lat + dlat, lon - dlon, lon + dlon))
    # 🔴 **Questa riga contava le righe e diceva «sano» mentre ⛔ non lo era**:
    # con la tabella *contentless* la ricerca trovava e restituiva
    # `dominio = NULL`, cioè **trovava senza saper dire chi**. ⇒ ora si guarda
    # che il dominio ci sia davvero, e che sia **uno vero**: una misura che
    # ⛔ non può fallire ⛔ non è una misura.
    r = crono("cerca «rossi» per nome", "SELECT dominio FROM studi_fts WHERE studi_fts MATCH ?",
              ("rossi",))
    orfane = [x for x in r if not x[0]]
    if orfane:
        print(f"  🔴 {len(orfane)} righe trovate SENZA dominio: la ricerca per nome "
              f"trova e ⛔ non sa dire di chi (tabella FTS contentless?)")
    elif r and not db.execute("SELECT 1 FROM studi WHERE dominio=?", (r[0][0],)).fetchone():
        print(f"  🔴 l'indice FTS cita `{r[0][0]}`, che ⛔ non è in `studi`: "
              f"indice e tabella sono disallineati")
    if vicini:
        def km(a, b, c, d):
            return 2 * 6371 * math.asin(math.sqrt(
                math.sin(math.radians(c - a) / 2) ** 2 + math.cos(math.radians(a)) *
                math.cos(math.radians(c)) * math.sin(math.radians(d - b) / 2) ** 2))
        vicini = sorted(((km(lat, lon, v[2], v[3]), v[1]) for v in vicini if v[2]))[:3]
        print("\n  i tre più vicini a Milano che fanno laser:")
        for d, nome in vicini:
            print(f"     {d:5.1f} km  {nome[:44]}")
    print("\n🔑 Tutte sotto il millisecondo o poco più ⇒ **le faccette bastano**, "
          "e il vettoriale sul catalogo ⛔ non serve.")


if __name__ == "__main__":
    db = sqlite3.connect(DB) if "--prova" in sys.argv and os.path.exists(DB) else costruisci()
    interroga(db)
    print("\n⛔ Database LOCALE: ⛔ non è raggiungibile dal sito e ⛔ non entra nella build.")
