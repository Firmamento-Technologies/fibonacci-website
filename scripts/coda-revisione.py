#!/usr/bin/env python3
"""La coda di revisione dei 678: chi dichiara di iniettare ed e' fuori dall'elenco.

    python3 scripts/coda-revisione.py              # il rapporto
    python3 scripts/coda-revisione.py --scrivi     # scrive anche la coda da lavorare
    python3 scripts/coda-revisione.py --decisa dominio.it --come medico --nota "albo in home"

── PERCHE' ESISTE ────────────────────────────────────────────────────────────
Il 18 agosto 2026 l'utente ha chiesto: «guarda i 1.350 incerto». Sono 2.975,
tutte con `escluso: true` e **un solo** motivo: «nessuna forma societaria e
nessun nome di struttura».

Dentro ci sono **678 schede che dichiarano un INIETTIVO** (filler, tossina
botulinica, biostimolazione, mesoterapia, fili). Gli studi con iniettivi
RIMASTI nell'elenco sono 1.402 ⇒ **un terzo di chi inietta e' fuori**, e
l'elenco che resta e' 90,6% imprese contro 6,9% persone fisiche.

🔑 Il difetto era gia' stato visto il 2026-08-15 e sta scritto in
`raccolta-cliniche.py`: «il classificatore era tarato sulle imprese e buttava
nel dubbio proprio la categoria che mancava». La direzione era giusta, il
rimedio e' rimasto a meta': l'unica via a `persona` e' l'iscrizione all'albo
dichiarata sul sito, e «la pubblicita' sanitaria DEVE indicarla» (L. 145/2018
c. 536) ⛔ non vuol dire che lo faccia.

── ⛔ PERCHE' NON PROMUOVE NIENTE, ED E' IL PUNTO ────────────────────────────
Dichiarare un iniettivo prova **una** di due cose: che dietro c'e' un medico,
**oppure** che qualcuno pubblicizza un atto che ⛔ non puo' eseguire. Nella
stessa lista ci sono `Estetista Irene | Filler` e `Amira Estetica Avanzata |
Tossina botulinica`. Solo la prima lettura appartiene a un elenco di medici, e
la seconda e' un rilievo in se'.
⇒ questo script fa una **coda da guardare**, ⛔ non una promozione. Il difetto
che corregge ⛔ non e' «sono esclusi», e' «sono esclusi **insieme a 2.297
scarti veri, con lo stesso motivo**», quindi invisibili.

⛔ NON tocca i file delle schede. Quella cartella ha lavoro non committato di
   altre sessioni (1.827 file non tracciati al 18 agosto): si scrive **solo**
   nei `_coda-*` , che sono ignorati da git come `_recapiti.json`.
⛔ NON tocca la rete, ⛔ non spedisce niente, ⛔ non pubblica niente.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
CARTELLA = QUI.parent / "src/dati/cliniche"
CODA_JSON = CARTELLA / "_coda-revisione.json"
CODA_MD = CARTELLA / "_coda-revisione.md"
DECISIONI = CARTELLA / "_coda-decisioni.json"
ALBO = CARTELLA / "_coda-albo.json"

# Atti che un centro estetico ⛔ non esegue: iniezioni. Sono il motivo per cui
# la scheda entra in coda.
# ⚠️ Distinzione **operativa**, ⛔ non una citazione normativa: nessuno dei due
# brain copre la L. 1/1990 sull'attivita' di estetista (verificato 2026-08-18).
INIETTIVI = {"Filler", "Tossina botulinica", "Biostimolazione", "Mesoterapia", "Fili di trazione"}

# Titolo personale nel nome: il segnale piu' forte che dietro c'e' una persona.
TITOLO = re.compile(r"\b(dott(?:\.|oressa|ore|\.ssa)?|dr\.?|d\.ssa|dssa|prof(?:\.|essor)?"
                    r"|chirurg[oa]|dermatolog[oa]|medic[oa])\b", re.I)
# Lessico di estetica ⛔ non medica: ⛔ NON squalifica (un medico puo' operare
# dentro un centro estetico) ⚠️ ma cambia la domanda da fare guardando il sito.
BELLEZZA = re.compile(r"\b(estetist|centro\s+estetic|estetica\s+avanzata|beauty|solarium"
                      r"|nail|spa\b|benessere|profum|parrucchier)", re.I)
# ⚠️ Il lessico di bellezza da solo ⛔ non basta: «MEDICINA ESTETICA AVANZATA» e
# «Beautystudium Chirurgia Estetica» lo contengono **e** nominano la medicina.
# ⇒ il segnale contrario e' «bellezza **senza** nessun termine medico», ed e' la
# stessa forma gia' usata in `raccolta-cliniche.py` per `non_medico`.
MEDICO = re.compile(r"\b(medic|chirurg|dermatolog|dott|dr\.?|prof|ambulator|clinic|poliambulator"
                    r"|odontoiatr|dentist|specialist|sanitari)", re.I)

# ⛔ **TOLTA il 2026-08-18: «il nome sembra un nome di persona».**
# Sembrava il secondo segnale migliore. Misurata, ⛔ non lo era: su **254** schede
# che la superavano, dentro c'erano `Best Dermatology NYC`, `Hyaluronic Filler
# Market`, `The Tweakments Guide`, `Medical Aesthetic Equipment Company` e
# `Art of Dermatology`. ⇒ «due parole con la maiuscola» ⛔ non distingue
# «Alessandra Ranza» da «AD Aesthetics», e ⛔ non c'e' modo di farlo senza un
# elenco di nomi propri scritto a mano.
# 🔑 Meglio un gruppo 🟢 **piccolo e affidabile** (203, col titolo scritto) che
# uno grande e mezzo falso: chi lavora la coda si fida del primo gruppo, e un
# 🟢 gonfio gli fa perdere la fiducia in tutti e quattro.


def carica():
    schede = {}
    for f in sorted(CARTELLA.glob("*.json")):
        if f.name.startswith("_"):
            continue
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        voci = d if isinstance(d, list) else d.get("studi", d.get("cliniche", []))
        if isinstance(voci, dict):
            voci = list(voci.values())
        for v in voci:
            if isinstance(v, dict) and v.get("dominio"):
                schede[v["dominio"]] = v
    return schede


def collocata(v):
    """Vero se la scheda dice **dove** si trova, in qualunque modo.

    🔴 Un elenco di medici funziona per **vicinanza**: una scheda senza un luogo
    ⛔ non e' un candidato, e' rumore. Misurato il 2026-08-18: **85 su 678** non
    avevano ne' comune, ne' partita IVA, ne' un telefono italiano — e dentro
    c'erano `swissmedic.ch` (l'agenzia svizzera del farmaco), un rivenditore di
    botox online, un fabbricante di apparecchiature e una guida inglese.
    ⚠️ ⛔ Non si chiamano «stranieri»: **40 su 85 sono `.it`**. Si chiamano
    «senza collocazione», che e' cio' che la misura dice davvero.
    """
    tel = (v.get("telefono") or "").replace(" ", "")
    return bool((v.get("comune") or "").strip()) or bool((v.get("partitaIva") or "").strip()) \
        or tel.startswith(("+39", "0039", "0", "3"))


def valuta(v):
    """(gruppo, perche') — ⛔ nessuno dei quattro e' un verdetto: sono quattro code."""
    nome = f"{v.get('nomeStrutturato') or ''} {v.get('nome') or ''}".strip()
    if not collocata(v):
        return "senza-collocazione", (
            "ne' comune, ne' partita IVA, ne' un telefono italiano: ⛔ non e' collocabile")
    if TITOLO.search(nome):
        return "medico-probabile", "titolo professionale nel nome"
    if BELLEZZA.search(nome) and not MEDICO.search(nome):
        return "segnale-contrario", (
            "lessico di estetica non medica nel nome e nessun termine medico: o c'e' "
            "un medico dentro il centro, o si pubblicizza un atto che non si puo' eseguire")
    return "da-guardare", "nessun titolo e nessun lessico di estetica: si apre il sito"


# 🔑 «Nome proprio dopo il titolo»: serve a separare `Dott.ssa Monica Congiu`
# da `Chirurgo Plastico a Milano`. ⚠️ Le parole qui sotto sono **qualifiche**,
# ⛔ non nomi.
_QUALIFICA = {
    "chirurgo", "chirurga", "medico", "medica", "dentista", "dermatologo", "dermatologa",
    "odontoiatra", "odontoiatri", "specialista", "estetico", "estetica", "plastico", "plastica",
    "maxillo", "studio", "centro", "clinica", "poliambulatorio", "ambulatorio", "medicina",
    "chirurgia", "laser", "nutrizionista", "fisioterapista", "psicologo", "veterinario",
    # ⚠️ Parole d'**interfaccia**: ⛔ non compaiono nel nome di una scheda, ⛔ ma se
    # un giorno qualcuno estendesse `nome_proprio()` al corpo della pagina si
    # ritroverebbe «Dott… **Prenota** una visita» ⇒ «il nome proprio è Prenota».
    # 🔴 È successo il 2026-08-18 in una misura, e la regola prometteva a
    # `persona` **l'ASL di Novara** e un **giornale locale**.
    "prenota", "prenotazioni", "contatti", "contattaci", "scopri", "leggi", "chiama",
    "tutto", "home", "seguici", "richiedi",
}
# ⚠️ `re.I` **serve**: senza, il modello cerca `dott` minuscolo e nei titoli dei
# siti c'e' `Dott.ssa`. Misurato: senza la bandiera il gruppo A contava **1**
# scheda invece di 38, e ⛔ non protestava.
_TITOLO_NOME = re.compile(
    r"\b(?:dott(?:oressa|ore|or)?|dr|prof)\.?\s*(?:ssa)?\.?\s+([A-ZÀ-Ù][A-Za-zÀ-ÿ'’]{2,15})",
    re.I)


def nome_proprio(testo):
    """La prima parola dopo un titolo professionale che ⛔ non sia una qualifica.

    ⚠️ Si guarda **solo il nome della scheda**, ⛔ mai il corpo della pagina:
    misurato il 2026-08-18, cercando nel testo si estraeva «**Prenota**» da
    «Dott… Prenota una visita», e la regola prometteva a `persona` **l'ASL di
    Novara** e un **giornale locale**.
    """
    for w in _TITOLO_NOME.findall(testo or ""):
        if w.lower() not in _QUALIFICA:
            return w
    return None


ORDINE = ["medico-probabile", "da-guardare", "segnale-contrario", "senza-collocazione"]
ETICHETTA = {
    "medico-probabile": "🟢 MEDICO PROBABILE",
    "da-guardare": "🟡 DA GUARDARE",
    "segnale-contrario": "🔴 SEGNALE CONTRARIO",
    "senza-collocazione": "🔵 SENZA COLLOCAZIONE",
}


def costruisci(schede, decisioni):
    coda = []
    for dom, v in schede.items():
        if v.get("tipoSoggetto") != "incerto":
            continue
        iniet = sorted(INIETTIVI & set(v.get("prestazioni") or []))
        if not iniet:
            continue
        gruppo, perche = valuta(v)
        coda.append({
            "dominio": dom,
            "gruppo": gruppo,
            "perche": perche,
            "nome": v.get("nomeStrutturato") or v.get("nome") or "",
            "comune": v.get("comune") or "",
            "provincia": (v.get("provincia") or "").upper(),
            "sito": v.get("sitoUrl") or f"https://{dom}/",
            "iniettivi": iniet,
            "altre": sorted(set(v.get("prestazioni") or []) - INIETTIVI),
            "partitaIva": v.get("partitaIva") or "",
            "telefono": v.get("telefono") or "",
            "email": v.get("email") or "",
            "direttoreSanitario": bool(v.get("dichiaraDirettoreSanitario")),
            "autorizzazione": bool(v.get("dichiaraAutorizzazioneSanitaria")),
            "decisa": decisioni.get(dom),
        })
    # Piu' iniettivi dichiarati = prova piu' forte; poi la partita IVA.
    coda.sort(key=lambda r: (ORDINE.index(r["gruppo"]), -len(r["iniettivi"]),
                             not r["partitaIva"], r["nome"].lower()))
    return coda


def albo_trovato():
    """`dominio → prova dell'albo`, se `cerca-albo.py` e' gia' passato.

    🔑 Sta **qui** e ⛔ non in un secondo file da aprire a parte: chi rivede
    guarda **una** tabella. Una prova che vive in un altro file e' una prova che
    nessuno legge.
    ⚠️ Se il file ⛔ non c'e', la colonna dice **«?»**, ⛔ non «no»: sono due
    cose diverse, e confonderle e' come dire «zero problemi» quando la misura
    ⛔ non e' stata fatta.
    """
    if not ALBO.is_file():
        return None
    return {e["dominio"]: e["albo"] for e in json.loads(ALBO.read_text(encoding="utf-8"))}


def scrivi_md(coda):
    aperte = [r for r in coda if not r["decisa"]]
    albi = albo_trovato()
    righe = [
        "# Coda di revisione — chi dichiara di iniettare ed e' fuori dall'elenco",
        "",
        "> ⛔ **Questo file ⛔ non e' l'elenco e ⛔ non pubblica niente.** E' la lista di chi va",
        "> guardato a mano. Rigenerarlo: `python3 scripts/coda-revisione.py --scrivi`.",
        "> Registrare una decisione:",
        "> `python3 scripts/coda-revisione.py --decisa <dominio> --come "
        + "|".join(ESITI) + " --nota \"…\"`",
        "",
        f"**{len(aperte)} da guardare** su {len(coda)} in coda "
        f"({len(coda)-len(aperte)} gia' decise).",
        "",
        (f"✅ **Albo gia' cercato**: trovato per **{sum(1 for v in albi.values() if v)}** "
         f"schede (`scripts/cerca-albo.py`). La colonna **albo** porta la prova."
         if albi is not None else
         "⚠️ **L'albo ⛔ non e' ancora stato cercato**: la colonna dice `?`, che ⛔ non e' «no».\n"
         "> Si cerca con `python3 scripts/cerca-albo.py --rete --scrivi`."),
        "",
        "⚠️ **La domanda da farsi aprendo il sito** e' una sola: **c'e' un medico dietro?**",
        "Il segno migliore e' l'**iscrizione all'albo**, e ⛔ quasi mai sta in homepage:",
        "sta nelle **note legali** e nell'**informativa privacy**, che deve nominare il titolare.",
        "",
    ]
    for g in ORDINE:
        blocco = [r for r in aperte if r["gruppo"] == g]
        if not blocco:
            continue
        righe += [f"## {ETICHETTA[g]} — {len(blocco)}", "", f"*{blocco[0]['perche']}*", "",
                  "| # | nome | dove | albo | iniettivi | P.IVA | sito |",
                  "|--:|---|---|---|---|---|---|"]
        for i, r in enumerate(blocco, 1):
            dove = f"{r['comune']} ({r['provincia']})" if r["comune"] else "n/d"
            piva = r["partitaIva"] or "n/d"
            if albi is None:
                col = "?"
            elif not albi.get(r["dominio"]):
                col = "—"
            else:
                a = albi[r["dominio"]]
                col = (f"🟢 {a['provincia']} n. {a['numero']}" if a["numero"]
                       else "🟡 citato, senza numero")
                if a["conDirettoreSanitario"]:
                    col += " ⚠️ dir. san."
            righe.append(f"| {i} | {r['nome'][:44]} | {dove} | {col} "
                         f"| {', '.join(r['iniettivi'])} | {piva} | {r['sito']} |")
        righe.append("")
    CODA_MD.write_text("\n".join(righe) + "\n", encoding="utf-8")


# ⛔ Parole che RE_PERSONA cattura ma ⛔ non sono nomi.
_NON_NOMI = {"menu", "chirurgo", "chirurga", "radiografia", "odontoiatria", "dermatologo",
             "dermatologa", "estetico", "estetica", "plastico", "plastica", "associato",
             "prenota", "contatti", "medico", "medica", "studio", "centro", "clinica"}


def medici_nominati(testo, re_persona, non_nomi=frozenset()):
    """I medici **distinti** nominati nel testo, con nome e cognome.

    🔑 **Perche' e' la prova che conta.** Un sito che nomina **un solo** medico
    e' lo studio di quel medico; uno che ne nomina **piu' d'uno** e' uno studio
    con piu' medici — cioe' un'impresa, che nell'elenco ci sta comunque, ⛔ ma
    con l'etichetta giusta.

    ⚠️ **Due deduplicazioni, e la seconda ⛔ non e' ovvia**:
    1. **l'ordine**: «Manca Thomas» e «Thomas Manca» sono la stessa persona ⇒ si
       confronta l'**insieme** dei due token, ⛔ non la stringa;
    2. **i nomi a TRE parole**: «Maria Grazia Rosella» produce le coppie
       «Maria Grazia» e «Rosella Maria», che condividono «maria» ⇒ sembrano due
       persone. 🔴 ⛔ Ma ⛔ non si possono fondere tutte le coppie che
       condividono un token: «Umberto **Longo**» e «Filippo **Longo**» sono
       **due fratelli**, e condividono il cognome.
       ✅ Il discriminante e' la **posizione**: nel nome a tre parole il token
       condiviso sta in posizioni **diverse** (2ª e 1ª); fra due fratelli sta
       nella **stessa** (il cognome, sempre 2ª).
    """
    coppie = []
    for a, b in re_persona.findall(testo or ""):
        # ⚠️ `non_nomi` si **riceve**, ⛔ non si ricopia: l'elenco vero e'
        # `PAROLE_NON_NOME` in `raccolta-cliniche.py`, e una seconda copia
        # divergerebbe. 🔴 Senza, «Medicina Estetica» finiva **contato fra i
        # medici**: i siti con «un solo medico» passavano da 112 a 39, cioe' la
        # misura si ribaltava.
        fuori = _NON_NOMI | non_nomi
        if a.lower() in fuori or b.lower() in fuori or a.lower() == b.lower():
            continue
        coppie.append((a, b))
    gruppi = []                       # ogni gruppo = una persona
    for a, b in coppie:
        ta, tb = a.lower(), b.lower()
        for g in gruppi:
            for (xa, xb) in g:
                # ⚠️ **In minuscolo da entrambe le parti**: la prima versione
                # confrontava `ta` (minuscolo) con `xb` (com'era scritto), e
                # ⛔ non fondeva mai niente — «thomas» ⛔ non e' «Thomas».
                # 🔴 **Tre casi, e il primo l'avevo perso riscrivendo**: la
                # coppia IDENTICA (lo stesso nome ripetuto nella pagina), che
                # ⛔ non condivide token «in posizione diversa» e quindi ⛔ non
                # si fondeva. Misurato: «Massimo Macrì» contato **4 volte**, e
                # il suo studio finiva fra le imprese.
                if ({ta, tb} == {xa.lower(), xb.lower()}          # identica o invertita
                        or ta == xb.lower() or tb == xa.lower()):  # nome a tre parole
                    g.append((a, b))
                    break
            else:
                continue
            break
        else:
            gruppi.append([(a, b)])
    return [f"{g[0][0]} {g[0][1]}" for g in gruppi]


# 🔑 L'UNICO posto dove vive il vocabolario delle decisioni.
# ⛔ Non riscriverlo altrove: `--come` e `--applica` lo leggono da qui, e
# `test_coda_revisione.py` fa fallire chi li fa divergere. Il difetto era
# reale: `impresa` era gia' usato **80 volte** nel registro ⛔ ma `--come`
# ⛔ non lo accettava, quindi dalla riga di comando ⛔ non era scrivibile.
TIPO_DI = {"medico": "persona", "impresa": "impresa"}   # promuovono nell'elenco
SOLO_REGISTRATI = ("non-medico", "scarta")              # restano fuori
ESITI = tuple(TIPO_DI) + SOLO_REGISTRATI


def gruppo_deciso(coda, con_piva):
    """Le schede del gruppo **A** (`con_piva=True`) o **B** (`False`).

    ⚠️ Sta **fuori** da `decisioni_in_blocco()` di proposito: se il criterio
    vive dentro il comando, il test deve **riscriverlo** per verificarlo — e un
    test che riscrive il criterio **conferma se stesso**. Misurato il
    2026-08-18: la prova per mutazione ⛔ non diventava rossa perche' il test
    ⛔ non chiamava questo codice.
    """
    return [r for r in coda
            if r["gruppo"] == "medico-probabile"
            and nome_proprio(r["nome"])
            and bool(r["partitaIva"]) == con_piva]


def decisioni_in_blocco(args, decisioni):
    """`--decidi-A` registra il gruppo A · `--applica` lo scrive nelle schede.

    **A** = nome proprio dopo il titolo **+ partita IVA** (cinque prove).
    **B** = lo stesso **senza** la partita IVA (quattro prove), perché quei siti
    ⛔ non la pubblicano — misurato: la sola **parola** «P.IVA/codice
    fiscale/VAT» compare in **0 su 33**, e **26 su 33** hanno già una pagina
    legale letta. ⇒ la gamba mancante è **cercata e non trovata**, ⛔ non
    dimenticata, e **la nota della decisione lo dice**.

    🔑 **Perché passa da un file di decisioni e ⛔ non da una regola nel
    classificatore.** Provato e **misurato** il 2026-08-18: il criterio del
    gruppo A ⛔ non si può scrivere in `classifica()`, perché lì manca il pezzo
    che lo rende sicuro — **«dichiara un iniettivo»**, che sta nelle
    `prestazioni` della scheda e ⛔ non nel testo che il classificatore riceve.
    Provandolo lo stesso, la regola prometteva **l'ASL di Novara** e un
    **giornale locale**.
    ⇒ la decisione è **di prodotto, presa su una popolazione già filtrata**, e
    si registra come tale: con **chi**, **quando** e **la prova**.

    ⚠️ Sopravvive a `--riclassifica` perché quel ripasso è **monotòno** e
    ⛔ non declassa mai un `persona`. ⛔ Ma ⛔ NON sopravvive a una raccolta
    nuova sullo stesso dominio, che ricalcola la scheda da zero: per quello
    servirebbe che `analizza()` leggesse questo file. → voce aperta.
    """
    schede = carica()
    coda = costruisci(schede, decisioni)

    if args.decidi_A or args.decidi_B:
        conPiva = bool(args.decidi_A)
        lettera = "A" if conPiva else "B"
        gruppo = gruppo_deciso(coda, conPiva)
        for r in gruppo:
            prove = [f"nome proprio dopo il titolo («{nome_proprio(r['nome'])}»)"]
            if conPiva:
                prove.append(f"partita IVA {r['partitaIva']}")
            prove += ["⛔ nessuna forma societaria", "⛔ nessun nome di struttura",
                      f"iniettivi dichiarati ({', '.join(r['iniettivi'])})"]
            nota = (f"gruppo {lettera}, decisione dell'utente del 2026-08-18: "
                    + " · ".join(prove))
            if not conPiva:
                # 🔑 Si scrive PERCHE' manca, ⛔ non si tace: chi rilegge deve
                # sapere che la gamba mancante e' stata **cercata e non
                # trovata**, ⛔ non dimenticata.
                nota += (" — ⚠️ la partita IVA ⛔ NON e' fra le prove perche' questi siti "
                         "⛔ non la pubblicano: misurato il 2026-08-18, la sola parola "
                         "«P.IVA/codice fiscale/VAT» compare in 0 su 33, e 26 su 33 hanno "
                         "gia' una pagina legale letta. ⛔ Cercarla nei registri d'impresa "
                         "e' vietato: sono raccolte altrui (DOMINI_ESCLUSI)")
            decisioni[r["dominio"]] = {"come": "medico", "nota": nota}
        DECISIONI.write_text(json.dumps(decisioni, ensure_ascii=False, indent=1, sort_keys=True)
                             + "\n", encoding="utf-8")
        print(f"✓ registrate {len(gruppo)} decisioni «medico» (gruppo {lettera}) "
              f"in {DECISIONI.name}")
        print("  ⇒ ⛔ le schede NON sono ancora cambiate: `--applica` per scriverle.")
        return 0

    # --applica
    # `medico` → `persona` · `impresa` → `impresa`. ⛔ `non-medico`/`scarta`
    # ⛔ non promuovono: si registrano, ⛔ ma la scheda resta fuori.
    _TIPO = dict(TIPO_DI)
    da_fare = {d: dict(v, tipo=_TIPO[v["come"]]) for d, v in decisioni.items()
               if v.get("come") in _TIPO}
    if not da_fare:
        print("⛔ nessuna decisione «medico» registrata: prima `--decidi-A`.")
        return 0
    scritte, gia = 0, 0
    for f in sorted(CARTELLA.glob("*.json")):
        if f.name.startswith("_"):
            continue
        try:
            righe = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        tocca = False
        for s in righe if isinstance(righe, list) else []:
            if not isinstance(s, dict) or s.get("dominio") not in da_fare:
                continue
            if s.get("tipoSoggetto") == da_fare[s["dominio"]]["tipo"]:
                gia += 1
                continue
            s["tipoSoggetto"] = da_fare[s["dominio"]]["tipo"]
            s["ragioneClassificazione"] = da_fare[s["dominio"]]["nota"]
            s["escluso"] = False
            s["motivoEsclusione"] = ""
            scritte += 1
            tocca = True
        if tocca:
            f.write_text(json.dumps(righe, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"✅ {scritte} schede portate al tipo deciso ({gia} c'erano già)")
    print("   La ragione scritta nella scheda porta la prova, ⛔ non solo l'esito.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrivi", action="store_true", help="scrive la coda (json + markdown)")
    ap.add_argument("--decisa", metavar="DOMINIO", help="registra la decisione su una scheda")
    ap.add_argument("--come", choices=ESITI,
                    help="l'esito della revisione")
    ap.add_argument("--nota", default="", help="la prova: dove hai visto l'albo, che cosa dice")
    ap.add_argument("--decidi-A", action="store_true",
                    help="registra come «medico» il gruppo A: nome proprio dopo il titolo E partita IVA")
    ap.add_argument("--decidi-B", action="store_true",
                    help="registra come «medico» il gruppo B: come A ⛔ ma SENZA la partita IVA")
    ap.add_argument("--applica", action="store_true",
                    help="SCRIVE nelle schede le decisioni gia' registrate (tipoSoggetto=persona)")
    args = ap.parse_args()

    decisioni = json.loads(DECISIONI.read_text(encoding="utf-8")) if DECISIONI.is_file() else {}

    if args.decisa:
        if not args.come:
            print("⛔ serve --come " + "|".join(ESITI)); return 2
        decisioni[args.decisa] = {"come": args.come, "nota": args.nota}
        DECISIONI.write_text(json.dumps(decisioni, ensure_ascii=False, indent=1, sort_keys=True)
                             + "\n", encoding="utf-8")
        print(f"✓ {args.decisa} → {args.come}" + (f" ({args.nota})" if args.nota else ""))
        return 0

    if args.decidi_A or args.decidi_B or args.applica:
        return decisioni_in_blocco(args, decisioni)

    schede = carica()
    if not schede:
        print("⚠️  nessuna scheda in `src/dati/cliniche/`: la coda NON e' stata calcolata")
        print("    (⛔ non e' «zero da guardare» — e' una misura che non c'e')")
        return 0
    coda = costruisci(schede, decisioni)
    aperte = [r for r in coda if not r["decisa"]]

    print(f"── coda di revisione: {len(coda)} schede ──")
    print(f"   lette {len(schede)} schede in `src/dati/cliniche/`\n")
    for g in ORDINE:
        n = sum(1 for r in coda if r["gruppo"] == g)
        na = sum(1 for r in aperte if r["gruppo"] == g)
        print(f"  {ETICHETTA[g]:24} {n:5}   (da guardare: {na})")
    print(f"\n  con partita IVA        : {sum(1 for r in coda if r['partitaIva']):5}")
    print(f"  con telefono           : {sum(1 for r in coda if r['telefono']):5}")
    print(f"  dichiarano un direttore sanitario: {sum(1 for r in coda if r['direttoreSanitario']):3}"
          "   ⚠️ e' il segno di una STRUTTURA, non di un libero professionista")
    if decisioni:
        print(f"\n  gia' decise            : {len(coda)-len(aperte):5}")

    print("\n⛔ Nessuna di queste e' stata promossa: la coda ⛔ non tocca l'elenco.")
    print("   Dichiarare un iniettivo prova UNA di due cose — che dietro c'e' un medico,")
    print("   oppure che si pubblicizza un atto che ⛔ non si puo' eseguire.")

    if args.scrivi:
        CODA_JSON.write_text(json.dumps(coda, ensure_ascii=False, indent=1) + "\n",
                             encoding="utf-8")
        scrivi_md(coda)
        print(f"\n✓ scritti {CODA_JSON.name} e {CODA_MD.name} (⛔ ignorati da git)")
    else:
        print("\n(nessun file scritto: --scrivi per farlo)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
