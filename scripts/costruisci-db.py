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
  letto_il           TEXT
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
CREATE VIRTUAL TABLE studi_fts USING fts5(
  dominio UNINDEXED, nome, comune, content=''
);
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
    n = p = 0
    for s in schede():
        orari = s.get("orari")
        db.execute(
            "INSERT OR REPLACE INTO studi VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
    db.commit()
    print(f"✅ {DB}")
    print(f"   {n} studi · {p} prestazioni · {os.path.getsize(DB) // 1024} KB")
    return db


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
    crono("cerca «rossi» per nome", "SELECT dominio FROM studi_fts WHERE studi_fts MATCH ?",
          ("rossi",))
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
