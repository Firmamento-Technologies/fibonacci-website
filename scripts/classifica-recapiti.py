#!/usr/bin/env python3
"""Classifica i recapiti raccolti PRIMA di scriverci, e dice perche'.

    python3 scripts/classifica-recapiti.py            # il rapporto
    python3 scripts/classifica-recapiti.py --scrivi   # scrive anche il file classificato

── PERCHE' ESISTE ────────────────────────────────────────────────────────────
Il 18 agosto 2026 l'utente ha chiesto di mandare l'informativa dell'art. 14 GDPR
ai recapiti raccolti, e alla proposta di spedirne 3.224 ha risposto: «non posso
mandare 3000 mail, non ha senso». Aveva ragione, e misurando si e' visto perche':

  - una parte di quegli indirizzi ⛔ NON e' dello studio. Il raccoglitore ha
    preso l'email che trovava sulla pagina senza verificare che quella pagina
    fosse dello studio di quella scheda: un portale ha dato l'indirizzo di una
    societa' di marketing, un sito di prodotto quello dell'azienda
    farmaceutica, un elenco telefonico ha dato se' stesso;
  - e una parte grossa e' di PERSONE GIURIDICHE (Srl, Spa, Casa di cura), che
    il GDPR ⛔ non protegge: l'art. 4(1) parla di «persona fisica».

⇒ scrivere a tutti vorrebbe dire raccontare la raccolta a terzi che non
c'entrano, e sprecare l'unica prima impressione che si ha con gli altri.

── LA REGOLA DI SICUREZZA, ED E' L'UNICA COSA DA NON TOCCARE ────────────────
🔴 Nel dubbio si classifica come **persona fisica**, cioe' «l'informativa E'
dovuta». Il verso sbagliato in cui fallire e' saltare qualcuno che aveva
diritto a saperlo; mandare un'informativa a una S.r.l. che non ne aveva bisogno
⛔ non fa male a nessuno. ⛔ Non invertire questa asimmetria per far scendere il
numero.

⛔ QUESTO SCRIPT NON SPEDISCE NIENTE e non tocca la rete. Classifica e basta.
"""

from __future__ import annotations

import argparse
import collections
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from recapiti_filtri import (  # noqa: E402
    _e_nominativa, _origine_non_propria, studi_per_dominio,
)

QUI = Path(__file__).resolve().parent
CARTELLA = QUI.parent / "src/dati/cliniche"
FONTE = CARTELLA / "_recapiti.json"
USCITA = CARTELLA / "_recapiti-classificati.json"


def carica_schede():
    """`dominio → scheda`, dai file per comune di `src/dati/cliniche/`.

    🔴 **Esiste perché il 18 agosto questo script ha dato una risposta sbagliata
    per difetto**, e l'utente l'ha vista subito: *«solo 256 liberi
    professionisti abbiamo trovato??? che ricerca è?»*.

    Il secondo asse (l'art. 4(1): «identifica una persona fisica?») guardava
    **la parte prima della `@`** e concludeva che `info@michelasalmaso.com`
    ⛔ non identificasse nessuno, mentre **la scheda dice `Michela Salmaso`**.
    ⇒ contava **256** persone fisiche dove ce n'erano **almeno 448**.

    🔑 E il dato giusto **c'era già**: ogni scheda porta `tipoSoggetto` e
    `ragioneClassificazione`, calcolati durante la raccolta guardando forma
    societaria, partita IVA, iscrizione all'albo e nome della struttura. Questo
    script ne aveva scritto una **seconda** versione, peggiore, che li ignorava.
    ⇒ ⛔ non indovinare ciò che la raccolta ha già deciso: **leggilo**.

    ⚠️ La nota di limite c'era, stampata **sotto il numero** («un nome
    commerciale che contiene un cognome identifica comunque una persona»), e
    ⛔ non ha presidiato niente: chi legge prende il numero. Un avvertimento
    ⛔ non è un presidio.
    """
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

# Domini che ⛔ non sono di nessuno studio: segnaposto dei modelli di sito e
# elenchi telefonici da cui la scheda e' stata presa.
SEGNAPOSTO = (
    "website.com", "mysite.com", "esempio.it", "example.com", "example.org",
    "wixsite.com", "telefono.click", "paginegialle.it", "misterimprese.it",
)
# Caselle gratuite: l'indirizzo e' quasi sempre vero, ⛔ ma ⛔ non dice niente su
# CHI sia il titolare, e spesso e' la casella personale di una persona fisica.
GRATUITE = (
    "gmail.com", "libero.it", "hotmail.it", "hotmail.com", "yahoo.it",
    "yahoo.com", "outlook.it", "outlook.com", "tiscali.it", "alice.it",
    "virgilio.it", "icloud.com", "pec.it", "live.it", "email.it",
)
# Indirizzi di RUOLO: `info@`, `segreteria@`… ⛔ Non identificano nessuno.
# 🔑 E' il criterio che conta davvero, ed e' arrivato dopo il primo giro: il test
# dell'art. 4(1) ⛔ non e' «e' una societa'?», e' **«identifica una persona
# fisica?»**. Una scheda con un nome commerciale («Effe Medical Center») e un
# indirizzo di ruolo (`info@…`) ⛔ non identifica nessuno ⇒ ⛔ non e' dato
# personale, e l'art. 14 ⛔ non si applica. Col primo criterio finivano tutte fra
# gli «incerti» e quindi fra gli obblighi: 2.310 informative dovute a nessuno.
RUOLO = {
    "info", "segreteria", "amministrazione", "prenotazioni", "studio", "contatti",
    "reception", "contatto", "prenota", "direzione", "ufficio", "clinica", "centro",
    "staff", "mail", "posta", "commerciale", "marketing", "agenda", "servizioclienti",
    "gestione", "contattaci", "accettazione", "appuntamenti",
}

# Segni di persona GIURIDICA nel nome. ⚠️ Elenco volutamente stretto: una forma
# societaria e' un fatto, «centro» o «clinica» da soli ⛔ non lo sono (uno studio
# individuale puo' chiamarsi «Centro X» ed essere una persona fisica).
GIURIDICA = re.compile(
    r"\b(s\.?\s?r\.?\s?l\.?|s\.?\s?p\.?\s?a\.?|s\.?\s?a\.?\s?s\.?|s\.?\s?n\.?\s?c\.?|"
    r"s\.?\s?s\.?\s?d\.?|societa|cooperativa|casa di cura|poliambulatorio|ospedale|"
    r"fondazione|istituto|gruppo)\b",
    re.I,
)
# Segni di persona FISICA. Se compare, vince sempre sulla forma societaria:
# «Studio Dott. Rossi Srl» resta una scheda che identifica una persona.
FISICA = re.compile(r"\b(dott|dr|prof|dssa|d\.ssa)\b\.?", re.I)


def dominio(email: str) -> str:
    email = (email or "").strip().lower()
    return email.split("@", 1)[1] if "@" in email else ""


def pulisci_nome(nome: str) -> str:
    """Toglie il rumore dell'elenco telefonico davanti al nome vero."""
    return re.sub(r"^\d+\s*(Numero telefonico dell['’]utenza)?\s*", "", nome or "").strip()


def classifica(dati: dict, schede: dict | None = None) -> list[dict]:
    schede = schede if schede is not None else carica_schede()
    # Un dominio che serve PIU' studi diversi ⛔ non e' il sito di uno studio:
    # e' un'agenzia, un gruppo o un portale. Si deduce dai dati, ⛔ non da un
    # elenco scritto a mano, cosi' un portale nuovo viene preso il giorno stesso.
    per_dominio: dict[str, set[str]] = collections.defaultdict(set)
    for voce in dati.values():
        d = dominio(voce.get("email", ""))
        if d:
            per_dominio[d].add(pulisci_nome(voce.get("nome", ""))[:40])
    condivisi = {d for d, nomi in per_dominio.items() if len(nomi) > 1}

    fuori = []
    for chiave, voce in dati.items():
        email = (voce.get("email") or "").strip().lower()
        d = dominio(email)
        nome = pulisci_nome(voce.get("nome", ""))

        if any(s in d for s in SEGNAPOSTO):
            esito, perche = "scartare", f"dominio segnaposto o elenco telefonico ({d})"
        elif d in condivisi and d not in GRATUITE:
            altri = len(per_dominio[d])
            esito, perche = "verificare", f"dominio condiviso da {altri} studi diversi ({d})"
        elif d in GRATUITE:
            esito, perche = "verificare", f"casella gratuita ({d}): non dice chi e' il titolare"
        elif not d:
            esito, perche = "scartare", "nessun indirizzo"
        else:
            esito, perche = "usare", "dominio che serve solo questo studio"

        # Il taglio del GDPR, e ⛔ SOLO su chi passa il primo.
        # ⚠️ La domanda dell'art. 4(1) e' «identifica una persona fisica?», e la
        # risposta sta nella SCHEDA (nome, forma societaria, partita IVA,
        # iscrizione all'albo), ⛔ non nella parte prima della @.
        locale = email.split("@", 1)[0] if "@" in email else ""
        scheda = schede.get(chiave, {})
        tipo = (scheda.get("tipoSoggetto") or "").strip()
        ragione = (scheda.get("ragioneClassificazione") or "").strip()

        if FISICA.search(nome):
            soggetto, perche_s = "fisica", "il nome contiene un titolo personale"
        elif tipo == "persona":
            soggetto, perche_s = "fisica", f"la scheda dice «persona»: {ragione}"
        elif tipo == "impresa":
            soggetto, perche_s = "giuridica", f"la scheda dice «impresa»: {ragione}"
        elif tipo in ("incerto", "", "non_pertinente", "non_medico"):
            # 🔴 «incerto» ⛔ NON diventa «non identifica nessuno»: sarebbe
            # esattamente il modo in cui il numero e' sceso a 256. Resta una
            # categoria propria, che si vede nel rapporto e va guardata.
            soggetto, perche_s = "da-guardare", (
                f"la scheda dice «{tipo or 'vuoto'}»: {ragione or 'nessuna ragione registrata'}")
        elif not scheda:
            # ⚠️ Ripiego dichiarato: nessuna scheda per questo dominio (schede
            # non ancora committate). Si torna all'euristica sull'indirizzo, e
            # ⛔ nel dubbio si dice «fisica», ⛔ non «nessuno».
            base = re.split(r"[._-]", locale)[0]
            if base in RUOLO or locale in RUOLO:
                soggetto, perche_s = "da-guardare", "nessuna scheda: indirizzo di ruolo, soggetto ignoto"
            else:
                soggetto, perche_s = "fisica", f"nessuna scheda: indirizzo personale ({locale}@)"
        elif GIURIDICA.search(nome):
            soggetto, perche_s = "giuridica", "forma societaria nel nome"
        else:
            soggetto, perche_s = "da-guardare", "scheda senza tipo: da guardare"

        fuori.append({
            "chiave": chiave, "nome": nome, "email": email,
            "esito": esito, "perche": perche,
            "soggetto": soggetto, "perche_soggetto": perche_s,
            "informativa_dovuta": esito == "usare" and soggetto == "fisica",
        })
    return fuori


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrivi", action="store_true", help="scrive il file classificato")
    ap.add_argument(
        "--applica",
        action="store_true",
        help="RIMUOVE dal file dei recapiti le righe che l'informativa vieta",
    )
    args = ap.parse_args()

    dati = json.loads(FONTE.read_text(encoding="utf-8"))
    schede = carica_schede()
    righe = classifica(dati, schede)

    print(f"── {len(righe)} recapiti ──\n")
    print("Indirizzo:")
    for esito in ("usare", "verificare", "scartare"):
        n = sum(1 for r in righe if r["esito"] == esito)
        print(f"  {n:5}  {100*n/len(righe):5.1f}%  {esito}")
    print("\nSoggetto (solo per i 'usare'):")
    usabili = [r for r in righe if r["esito"] == "usare"]
    for s in ("fisica", "giuridica", "da-guardare"):
        n = sum(1 for r in usabili if r["soggetto"] == s)
        print(f"  {n:5}  {100*n/len(usabili):5.1f}%  {s}")

    dovuta = [r for r in righe if r["informativa_dovuta"]]
    print(f"\n⇒ INFORMATIVA ART. 14 DOVUTA E SPEDIBILE: {len(dovuta)}")
    giur = sum(1 for r in usabili if r["soggetto"] == "giuridica")
    noid = sum(1 for r in usabili if r["soggetto"] == "da-guardare")
    print(f"  (da {len(righe)}: -{len(righe)-len(usabili)} indirizzi da scartare o verificare, "
          f"-{giur} persone giuridiche, -{noid} da guardare)")
    print(f"\n📇 Schede lette per decidere il soggetto: {len(schede)}")
    senza = sum(1 for r in righe if r["chiave"] not in schede)
    if senza:
        print(f"⚠️  {senza} recapiti ⛔ NON hanno una scheda in `src/dati/cliniche/`:")
        print("    per loro si ripiega sull'indirizzo, che e' il criterio DEBOLE.")
    print("\n🔴 I 'da-guardare' ⛔ NON sono «nessuna persona identificata»: sono i casi")
    print("   che la raccolta ha lasciato aperti (nessuna forma societaria e nessun")
    print("   nome di struttura e' spesso proprio un libero professionista).")
    print("   ⛔ Contarli come «non dovuta» e' l'errore che il 18 agosto ha fatto")
    print("   scendere il numero da 448 a 256.")
    print("\n⚠️ I 'verificare' NON sono esclusi dall'obbligo: sono esclusi dall'INVIO")
    print("   finche' non si sa a chi appartiene quell'indirizzo. Per loro resta")
    print("   l'informativa pubblicata, e vanno guardati a mano.")

    if args.applica:
        # ⚠️ Il filtro definitivo sta nel raccoglitore (`costruisci-db.py`): questo
        # e' il rimedio sul file GIA' scritto, per non dover rifare la raccolta.
        # ⛔ Non e' un doppione: e' la **stessa** funzione, importata.
        conta = studi_per_dominio(
            ((v.get("nome") or ""), v.get("email")) for v in dati.values()
        )
        tenute = {
            k: v for k, v in dati.items()
            if not _e_nominativa(v.get("email", ""))
            and not _origine_non_propria(v.get("email", ""), conta)
        }
        FONTE.write_text(json.dumps(tenute, ensure_ascii=False, indent=0, sort_keys=True) + "\n",
                         encoding="utf-8")
        print(f"\n✓ applicato: {len(dati)} → {len(tenute)} "
              f"(-{len(dati)-len(tenute)} righe che l'informativa vieta)")

    if args.scrivi:
        USCITA.write_text(json.dumps(righe, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"\n✓ scritto {USCITA.relative_to(QUI.parent)}")
    else:
        print("\n(nessun file scritto: --scrivi per farlo)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
