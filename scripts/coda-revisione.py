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


def scrivi_md(coda):
    aperte = [r for r in coda if not r["decisa"]]
    righe = [
        "# Coda di revisione — chi dichiara di iniettare ed e' fuori dall'elenco",
        "",
        "> ⛔ **Questo file ⛔ non e' l'elenco e ⛔ non pubblica niente.** E' la lista di chi va",
        "> guardato a mano. Rigenerarlo: `python3 scripts/coda-revisione.py --scrivi`.",
        "> Registrare una decisione:",
        "> `python3 scripts/coda-revisione.py --decisa <dominio> --come medico|non-medico|scarta --nota \"…\"`",
        "",
        f"**{len(aperte)} da guardare** su {len(coda)} in coda "
        f"({len(coda)-len(aperte)} gia' decise).",
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
                  "| # | nome | dove | iniettivi | P.IVA | sito |", "|--:|---|---|---|---|---|"]
        for i, r in enumerate(blocco, 1):
            dove = f"{r['comune']} ({r['provincia']})" if r["comune"] else "n/d"
            piva = r["partitaIva"] or "n/d"
            righe.append(f"| {i} | {r['nome'][:44]} | {dove} | {', '.join(r['iniettivi'])} "
                         f"| {piva} | {r['sito']} |")
        righe.append("")
    CODA_MD.write_text("\n".join(righe) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrivi", action="store_true", help="scrive la coda (json + markdown)")
    ap.add_argument("--decisa", metavar="DOMINIO", help="registra la decisione su una scheda")
    ap.add_argument("--come", choices=("medico", "non-medico", "scarta"),
                    help="l'esito della revisione")
    ap.add_argument("--nota", default="", help="la prova: dove hai visto l'albo, che cosa dice")
    args = ap.parse_args()

    decisioni = json.loads(DECISIONI.read_text(encoding="utf-8")) if DECISIONI.is_file() else {}

    if args.decisa:
        if not args.come:
            print("⛔ serve --come medico|non-medico|scarta"); return 2
        decisioni[args.decisa] = {"come": args.come, "nota": args.nota}
        DECISIONI.write_text(json.dumps(decisioni, ensure_ascii=False, indent=1, sort_keys=True)
                             + "\n", encoding="utf-8")
        print(f"✓ {args.decisa} → {args.come}" + (f" ({args.nota})" if args.nota else ""))
        return 0

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
