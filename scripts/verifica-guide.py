#!/usr/bin/env python3
"""Le guide non devono promettere cose che nell'applicazione non esistono.

── PERCHE' ESISTE ──────────────────────────────────────────────────────────────
Il 2026-08-10, controllando il TONO delle 19 guide, e' emerso qualcosa di piu'
grave: **quattro descrivevano funzioni inesistenti**. `audit-log` prometteva un
pulsante «Verifica integrita», una «linea del tempo», l'export in PDF firmato e
la ricerca per IP — nessuno dei quali esiste. `agenda-appuntamenti` prometteva
un tipo «Telemedicina» e una «Pausa pranzo». `anagrafica-paziente` un filtro
«Includi archiviati» e un campo «Tutore legale». `body-map` elencava cinque
valori per un campo che esiste ma che quei valori non li ha.

Il difetto e' peggiore di un errore di tono: chi legge una guida si fida, cerca
il pulsante, non lo trova, e conclude che il prodotto e' rotto. **Erano guide
scritte da un piano, non dal prodotto.**

── COSA CONTROLLA, E COSA NO ───────────────────────────────────────────────────
Estrae dalle guide i frammenti fra `backtick` e fra «virgolette» — cioe' i punti
in cui una guida NOMINA qualcosa che l'utente dovrebbe vedere — e li cerca nel
sorgente dell'applicazione, traduzioni comprese.

⚠️ **Un frammento non trovato e' un SOSPETTO, non un verdetto**: un'etichetta
puo' essere composta a pezzi, o scritta diversamente. E ci sono falsi positivi
legittimi — le frasi che un paziente potrebbe dire, i codici d'esempio, i nomi
di classificazioni esterne: stanno in AMMESSI qui sotto, con il motivo.

⛔ E non copre le affermazioni NARRATIVE («il sistema invia una notifica via
email»): quelle si verificano solo aprendo la schermata. Questo comando riduce
il lavoro manuale, non lo sostituisce.

Uso:  cd website && python3 scripts/verifica-guide.py
Esce 1 se trova un sospetto non ancora giustificato.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
# ⚠️ `EMR/` e' un sottomodulo condiviso fra piu' sessioni, e puo' trovarsi su un
# ramo indietro rispetto a `main`: il 2026-08-17 era **74 commit** dietro, e
# controllare le guide contro quella copia significa verificarle contro un
# prodotto che non e' quello che verra' rilasciato. `FIBO_APP_SRC` permette di
# puntare a un worktree allineato senza toccare l'albero condiviso.
APP = Path(os.environ.get("FIBO_APP_SRC") or QUI.parent.parent / "EMR" / "apps" / "web" / "src")
DOCS = QUI.parent / "src" / "content" / "docs"

# ⚠️ Non tutte le etichette a video stanno in `src`. I nomi dei sistemi
# dell'atlante 3D («Sistema linfatico», «Inserzioni muscolari»…) arrivano dal
# manifesto degli assets, che il browser scarica e il pannello mostra tali e
# quali. Senza questi file il controllo direbbe «non esiste» di cose che il
# medico legge a schermo, e la conseguenza pratica sarebbe una guida costretta a
# NON nominarle: cioe' meno precisa per colpa del presidio.
# ⛔ Non aggiungere qui cartelle intere: ogni file in piu' e' una possibilita' in
# piu' che un termine risulti «trovato» per caso.
# ⚠️ Il percorso si ricava da APP e non dalla radice del sito: con `FIBO_APP_SRC`
# la radice del sito puo' essere un worktree in `/tmp`, accanto al quale non c'e'
# nessun `EMR/`. Il manifesto deve venire dallo **stesso** albero dell'app che si
# sta controllando, o si finisce a verificare due prodotti diversi.
ALTRE_SORGENTI = [
    APP.parent / "public" / "anatomy" / "granular" / "manifest.json",
]

# Sospetti gia' esaminati e giustificati, con il perche'. Chi ne aggiunge uno
# deve scrivere la ragione: senza, questa lista diventa il posto dove si
# nascondono i difetti invece di correggerli.
AMMESSI = {
    "Voglio una copia dei miei dati": "frase che dice il paziente, non un'etichetta",
    "Cancellate i miei dati": "idem",
    "Correggete questo dato": "idem",
    "Revoco il consenso": "idem: e' la quarta riga della stessa tabella di frasi "
    "che dice il paziente (esportazioni-e-diritti), le altre tre sono qui sopra",
    "A1234-B": "codice di lotto d'esempio",
    "A1234 B": "idem",
    "Alta efficienza": "impostazione della fotocamera dell'iPhone, non nostra",
    "ICD-10": "nome di una classificazione esterna",
}

TERMINI = re.compile(r"[`«]([A-ZÀ-Ù][^`»\n]{3,40})[`»]")

# I collegamenti interni fra guide, nella forma `[testo](/percorso)`.
COLLEGAMENTI = re.compile(r"\]\((/[^)\s]+)\)")


def controlla_collegamenti() -> dict[str, list[str]]:
    """I rimandi fra guide devono portare a un capitolo che esiste.

    ⚠️ PERCHE'. Fino al 2026-08-17 le guide si rimandavano l'un l'altra con
    `/docs/<slug>/` e `/documentazione/<slug>` — gli indirizzi che avevano **sul
    sito pubblico**. Il manuale e' dentro l'applicazione dal 13 agosto, dove
    quelle rotte non esistono: **26 collegamenti in 9 guide** buttavano il
    lettore sul catch-all del router, cioe' fuori dal manuale, perdendogli il
    segno. Nessun errore in console, nessun test rosso: un link che non porta da
    nessuna parte e' silenzioso per costruzione.

    Qui si verificano due cose insieme: la forma (`/manuale/<slug>`) e
    l'esistenza del capitolo, perche' un rimando a un capitolo cancellato ha lo
    stesso effetto di un percorso sbagliato.
    """
    slug_esistenti = {p.stem for p in DOCS.glob("*.md")}
    rotti: dict[str, list[str]] = {}
    for g in sorted(DOCS.glob("*.md")):
        fuori = []
        for percorso in COLLEGAMENTI.findall(g.read_text(encoding="utf-8")):
            if not percorso.startswith("/manuale/"):
                fuori.append(f"{percorso}  (il manuale vive su /manuale/<capitolo>)")
            elif percorso.removeprefix("/manuale/").strip("/") not in slug_esistenti:
                fuori.append(f"{percorso}  (capitolo inesistente)")
        if fuori:
            rotti[g.stem] = sorted(fuori)
    return rotti


def main() -> int:
    if not APP.exists():
        print(f"⚠️  sorgente dell'app non trovato in {APP} — controllo saltato")
        return 0

    corpus = []
    for f in list(APP.rglob("*.tsx")) + list(APP.rglob("*.ts")) + list(APP.rglob("*.json")):
        if ".test." in f.name:
            continue
        try:
            corpus.append(f.read_text(encoding="utf-8"))
        except OSError:
            pass
    for f in ALTRE_SORGENTI:
        if f.exists():
            corpus.append(f.read_text(encoding="utf-8"))
    tutto = "\n".join(corpus).lower()

    # Controprova: se il corpus e' rotto il controllo direbbe «tutto assente»,
    # cioe' darebbe rosso ovunque — o, peggio, verrebbe disattivato.
    if len(corpus) < 50 or "esporta" not in tutto:
        print(f"❌ corpus sospetto ({len(corpus)} file): il controllo misurerebbe il nulla")
        return 1

    sospetti: dict[str, list[str]] = {}
    for g in sorted(DOCS.glob("*.md")):
        fuori = []
        for frammento in set(TERMINI.findall(g.read_text(encoding="utf-8"))):
            frammento = frammento.strip()
            if frammento in AMMESSI or frammento.lower() in tutto:
                continue
            parole = [p for p in re.split(r"[^a-zà-ù]+", frammento.lower()) if len(p) > 3]
            if parole and all(p in tutto for p in parole):
                continue
            fuori.append(frammento)
        if fuori:
            sospetti[g.stem] = sorted(fuori)

    collegamenti_rotti = controlla_collegamenti()
    if collegamenti_rotti:
        print("❌ Collegamenti fra guide che non portano da nessuna parte:\n", file=sys.stderr)
        for k, v in collegamenti_rotti.items():
            print(f"   {k}", file=sys.stderr)
            for x in v:
                print(f"     · {x}", file=sys.stderr)
        print("", file=sys.stderr)

    if not sospetti and not collegamenti_rotti:
        print(
            f"✅ {len(list(DOCS.glob('*.md')))} guide: nessun elemento nominato risulta "
            "assente dall'app, nessun collegamento rotto"
        )
        return 0

    if not sospetti:
        return 1

    print("❌ Le guide nominano cose che nell'app non si trovano:\n", file=sys.stderr)
    for k, v in sospetti.items():
        print(f"   {k}", file=sys.stderr)
        for x in v:
            print(f"     · {x}", file=sys.stderr)
    print(
        "\n   Guardare la schermata: o l'elemento esiste con un altro nome (si corregge la\n"
        "   guida), o non esiste (si toglie la promessa), o e' un falso positivo legittimo\n"
        "   (si aggiunge ad AMMESSI **con il motivo**).",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
