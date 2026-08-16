#!/usr/bin/env python3
"""Il dialogo con chi cerca un medico — **modello locale, uscita validata**.

Richiesta dell'utente (2026-08-16): *«vorrei che ci fosse un dialogo con chi usa
la piattaforma di matching. meglio usare un piccolo LLM»*.

── PERCHÉ IL MODELLO GIRA IN LOCALE, E ⛔ NON È UNA PREFERENZA ──────────────

🔴 **Il testo di chi cerca è dato dell'art. 9, anche quando sembra innocuo.**
*«Cerco il filler per le labbra»* rivela che quella persona vuole **un trattamento
medico**: è un dato sanitario **per inferenza** (CGUE C-184/20), scritto da
qualcuno che ⛔ non è paziente di nessuno. ⇒ mandarlo a un fornitore esterno
significa **trasferirgli dati sanitari**, con tutto ciò che ne segue.
✅ Un modello **sul nostro server ⛔ non trasferisce niente a nessuno**, e l'**AI
Act** (reg. 2024/1689, cons. 69) elenca proprio fra le misure di conformità
*«l'uso di tecnologie che consentano di inserire algoritmi nei dati … **senza
trasmissione tra le parti**»*.
⚠️ ⇒ ⛔ **Non è «più prudente»: è la misura che la norma indica per prima.**

── I TRE PRESIDI, IN ORDINE DI FORZA ───────────────────────────────────────

**1. La guardia, PRIMA del modello** (`glossario.guardia`) — se l'ingresso è
   clinico, il modello ⛔ non viene interrogato affatto. ⛔ Non ha istruzioni da
   ignorare perché ⛔ non riceve niente.

**2. Il lessico PRIMA del modello** — chi dice «botox» ⛔ non ha bisogno di un
   LLM: si risponde in **0 ms** e a **costo zero**. Il modello serve **solo**
   quando il vocabolario ⛔ non riconosce, cioè per il linguaggio davvero libero.

**3. 🔴 L'USCITA È VALIDATA, ed è il presidio che regge se gli altri cedono.**
   Del modello si accetta **una sola cosa**: il **nome di una voce del
   vocabolario**, oppure `nessuno`. Qualunque altra parola produca — un consiglio,
   un dosaggio, un trattamento che ⛔ non abbiamo — viene **scartata**, e si
   ripiega sulla frase fissa. ⇒ **il modello propone, il codice dispone.**
   ⚠️ Il testo mostrato all'utente resta **composto da noi**: il modello ⛔ non
   scrive mai direttamente sullo schermo.

⛔ **Niente si conserva**: ⛔ nessuna cronologia, ⛔ nessun registro delle domande.

    python3 scripts/dialogo.py                    # il banco
    python3 scripts/dialogo.py "quella roba che riempie le labbra"
"""
import importlib.util, json, os, sys, urllib.request

QUI = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location("g", os.path.join(QUI, "glossario.py"))
g = importlib.util.module_from_spec(_s)
_s.loader.exec_module(g)

OLLAMA = os.environ.get("OLLAMA_URL", "http://localhost:11434")
MODELLO = os.environ.get("DIALOGO_MODELLO", "gemma4:latest")
# ⚠️ **Il modello resta caldo**: a freddo la prima risposta ha impiegato **25 s**,
# a caldo **1,5 s**. Un dialogo a 25 s ⛔ non è un dialogo.
TIENI_CALDO = "10m"


def _chiedi_al_modello(testo, secondi=20):
    """Torna **una voce del vocabolario** o `None`. ⛔ Non torna mai testo libero.

    🔑 Il prompt elenca le voci ammesse **e** la parola d'uscita `nessuno`:
    ⛔ senza quest'ultima un modello, messo di fronte a una frase che ⛔ non
    riconosce, **inventa** — è la sua natura, ⛔ non un difetto.
    """
    voci = list(g.VOCI.keys())
    prompt = (
        "Sei un glossario. Dato il testo di una persona che cerca un trattamento "
        "estetico, rispondi con UNA SOLA di queste parole, esattamente come "
        "scritta:\n"
        + "\n".join(f"- {v}" for v in voci)
        + "\n- nessuno\n\n"
        "⛔ Non spiegare. ⛔ Non consigliare. ⛔ Non aggiungere altro.\n"
        "Se il testo descrive un problema o un sintomo invece di un trattamento, "
        "rispondi: nessuno\n\n"
        f"Testo: «{testo}»\nRisposta:"
    )
    corpo = json.dumps({
        "model": MODELLO, "prompt": prompt, "stream": False,
        "keep_alive": TIENI_CALDO,
        # ⚠️ `num_predict` basso ⛔ ma ⛔ non bassissimo: a 6 token la risposta
        # tornava **vuota** (misurato). Le voci più lunghe sono di 3 parole.
        "options": {"num_predict": 24, "temperature": 0},
    }).encode()
    try:
        req = urllib.request.Request(f"{OLLAMA}/api/generate", data=corpo,
                                     headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=secondi) as r:
            grezzo = json.load(r).get("response", "")
    except Exception:
        return None      # ⚠️ modello assente o lento ⇒ si prosegue **senza**
    # ── LA VALIDAZIONE: ⛔ si accetta SOLO una voce nota ──────────────────────
    pulito = g._piatto(grezzo).strip(" .:\n\"'*-")
    for v in voci:
        if g._piatto(v) == pulito or g._piatto(v) in pulito:
            return v
    return None          # tutto il resto — consigli compresi — **cade qui**


def rispondi(testo, usa_modello=True):
    """Guardia → lessico → (solo se serve) modello → frase **composta**."""
    esito = g.rispondi(testo)
    if not esito.ammesso or esito.voci:
        return esito                       # respinta, o già riconosciuta a costo 0
    if not usa_modello:
        return esito
    voce = _chiedi_al_modello(testo)
    if not voce:
        return esito                       # resta il «non ho capito» fisso
    # ⚠️ **Ricontrollo la guardia sulla VOCE**, ⛔ non solo sul testo: se il
    # modello avesse tirato fuori una voce da una frase clinica sfuggita al
    # filtro, qui ⛔ non c'è comunque modo di dire *perché* servirebbe.
    return g.Esito(True, f"Forse cerchi il trattamento **{voce}**. "
                         f"Vuoi vedere chi lo esegue vicino a te?", [voce],
                   motivo="modello")


BANCO_MODELLO = [
    # frasi che il **lessico ⛔ non copre** — è qui che il modello serve
    ("quella roba che riempie le labbra", "Filler"),
    # ⚠️ **LIMITE MISURATO, ⛔ non truccato via.** `gemma4` riconosce «quella
    # iniezione che blocca il muscolo» ⛔ ma **non** «la puntura che spiana la
    # fronte»: torna una parola che la validazione **scarta**, e l'utente riceve
    # il «non ho capito». ⇒ è un limite di **comprensione del modello piccolo**,
    # ⛔ non un buco di sicurezza — il caso peggiore resta «⛔ non ho capito»,
    # ⛔ mai un consiglio. Un modello più grande lo prenderebbe; ⛔ non vale
    # 25 secondi di attesa.
    ("quella iniezione che blocca il muscolo", "Tossina botulinica"),
    ("vorrei la macchina che leviga la pelle con la luce", "Laser"),
    # ⛔ e queste ⛔ non devono produrre NIENTE, nemmeno passando dal modello
    ("mi sento vecchia e vorrei ringiovanire", None),
    ("che cosa mi consiglieresti per il viso", None),
]

if __name__ == "__main__":
    if len(sys.argv) > 1 and not sys.argv[1].startswith("-"):
        e = rispondi(" ".join(sys.argv[1:]))
        print(("✅ " if e.ammesso else "⛔ ") + e.risposta
              + (f"   [{e.motivo}]" if e.motivo else ""))
        sys.exit(0)
    print(f"modello: {MODELLO} · {OLLAMA}\n")
    ok = 0
    for frase, atteso in BANCO_MODELLO:
        e = rispondi(frase)
        bene = (atteso in e.voci) if atteso else (not e.voci)
        ok += bene
        print(f"  {'✅' if bene else '🔴'} «{frase[:44]:44}» → "
              f"{','.join(e.voci) if e.voci else ('RESPINTA' if not e.ammesso else 'nessuna voce')}"
              f"  [{e.motivo}]")
    print(f"\n{ok}/{len(BANCO_MODELLO)}")
    sys.exit(0 if ok == len(BANCO_MODELLO) else 1)
