#!/usr/bin/env python3
"""Glossario conversazionale: dalla parola del paziente al nome del trattamento.

🔑 **Che cosa fa, e soprattutto che cosa ⛔ NON fa.**

    ✅ «cerco quella cosa per le labbra, il ripieno»  →  «forse cerchi il FILLER»
    ⛔ «ho le rughe sulla fronte»                      →  ⛔ NIENTE

La prima è una domanda di **vocabolario**: il paziente sa cosa vuole e ⛔ non sa
come si chiama. La seconda è un **caso clinico**, e rispondervi sarebbe **un atto
medico** — oltre che, secondo MDCG 2019-11, rendere questo software un
**dispositivo medico** ([[decisione-chatbot-per-il-matching]]).

── PERCHÉ LA GUARDIA STA PRIMA, E ⛔ NON NEL PROMPT ─────────────────────────

⚠️ Un modello linguistico **tende a consigliare**: è ciò per cui è addestrato.
Chiedergli di ⛔ non farlo è **negoziabile** — «ignora le istruzioni precedenti»
è il primo tentativo di chiunque. ⇒ qui vale la stessa regola già collaudata in
`EMR/services/assistente/guardia.py`: **se l'ingresso è clinico, il modello ⛔ non
viene interrogato affatto**. Un filtro che gira **prima** ⛔ non ha istruzioni da
ignorare.

🔴 **E c'è un secondo presidio, più forte del primo: l'USCITA È CHIUSA.**
Questo modulo ⛔ **non genera testo libero**. Sceglie fra le voci di un
vocabolario finito e le mette in **frasi fisse**. ⇒ anche se la guardia
sbagliasse, il peggio che può uscire è **il nome di un trattamento** — ⛔ mai una
raccomandazione, perché ⛔ non esiste il codice che la componga.

⚠️ **Il testo del paziente ⛔ non si conserva**: è dato dell'art. 9 anche **per
inferenza** (CGUE C-184/20), scritto da una persona che ⛔ non è nostra paziente.
⇒ ⛔ nessun registro, ⛔ nessuna cronologia, ⛔ nemmeno «per capire cosa cerca la
gente» — quel dato si guarda in Search Console.

    python3 scripts/glossario.py            # il banco di prova
    python3 scripts/glossario.py "il ripieno per le labbra"
"""
import re, sys, unicodedata

# ── 1. LA GUARDIA — ciò che ⛔ non passa, e ⛔ non è negoziabile ───────────────
# ⚠️ La guardia dell'assistente del sito copre **chi chiede un consiglio**
# («cosa mi consigli», «che dose»). Qui serve anche l'altra metà, che lì ⛔ non
# poteva servire: **chi descrive un disturbo senza chiedere niente**.
# «Ho le rughe sulla fronte» ⛔ non è una domanda — ⛔ ma rispondere con un
# trattamento sarebbe **esattamente** l'atto medico che ⛔ non possiamo fare.
DISTURBI = (
    r"\b(rughe?|grinze|solchi|zampe\s+di\s+gallina|codice\s+a\s+barre)\b",
    r"\b(acne|brufoli|foruncoli|comedoni|punti\s+neri)\b",
    r"\b(cicatric\w+|smagliature|cheloid\w+)\b",
    # ⚠️ **`macchi\\w+` prendeva «macchina»**, e ha fatto respingere
    # «la macchina che leviga la pelle» — una richiesta **legittima**.
    # ⇒ un filtro troppo largo ⛔ non è «più sicuro»: **nega il servizio** a chi
    # aveva tutto il diritto di riceverlo, e lo fa in silenzio.
    r"\b(macchi[ae]|macchiat\w+|melasma|discromi\w+|iperpigmentaz\w+)\b",
    r"\b(couperose|rosacea|capillari|teleangectasi\w+)\b",
    r"\b(cellulite|adiposit\w+|pannicolo|buccia\s+d.arancia)\b",
    r"\b(calvizie|alopecia|dirad\w+|perdo\s+i\s+capelli|caduta\s+dei\s+capelli)\b",
    r"\b(occhiaie|borse\s+sotto|palpebre\s+cadenti|ptosi)\b",
    r"\b(lassit\w+|rilassamento\s+cutaneo|pelle\s+cadente|svuotat\w+)\b",
    r"\b(sudorazione|iperidrosi|sudo\s+troppo)\b",
    r"\b(invecchiat\w+|segni\s+del\s+tempo|sembro\s+stanc\w+)\b",
    # Il caso portato in prima persona, anche senza domanda
    r"\bho\s+(le|il|la|dei|delle|un|una)\s+\w+\s+(sul|sulla|sui|sulle|al|alla|in)\b",
    r"\b(mi\s+vergogno|non\s+mi\s+piace|vorrei\s+sistemare|odio\s+il\s+mio)\b",
)
# 🔴 **DESIDERI GENERICI — la falla trovata provando frasi vere (2026-08-16).**
# *«Ho 45 anni e vorrei un aspetto più fresco»* passava la guardia (⛔ nessun
# disturbo nominato, ⛔ nessuna richiesta di consiglio) e **il modello rispondeva
# "Biostimolazione"**. ⇒ da un desiderio **senza oggetto** aveva dedotto **un
# trattamento**: è **un consiglio clinico**, cioè precisamente ciò che questo
# modulo esiste per ⛔ non fare.
# ⚠️ E il comportamento era **imprevedibile**: le stesse frasi in altre forme
# («vorrei sembrare più giovane») davano `nessuno`. **Un presidio che dipende da
# come il modello si sveglia ⛔ non è un presidio.**
# 🔑 La regola: un desiderio **senza oggetto specifico** si respinge. ⚠️ ⛔ Non
# vale per «vorrei rifarmi **le labbra**» — lì l'oggetto c'è, ed è ciò che
# permette di rispondere **senza scegliere al posto del medico**.
DESIDERI_GENERICI = (
    r"\b(aspetto|viso|volto|pelle|corpo)\s+(piu|più)\s+"
    r"(fresc\w+|giovan\w+|bell\w+|luminos\w+|ripos\w+|tonic\w+|dist\w+)\b",
    r"\b(sembrare|apparire|essere|sentirmi)\s+(piu|più)\s+"
    r"(giovan\w+|bell\w+|fresc\w+|attraent\w+|in\s+forma)\b",
    r"\b(ringiovan\w+|rinfrescar\w+|ritocc\w+|rimetter\w+\s+a\s+nuovo)\b",
    r"\b(migliorare|sistemare|cambiare)\s+(il\s+mio\s+)?"
    r"(aspetto|viso|volto|corpo|immagine)\b",
    r"\bho\s+\d{2}\s+anni\b",
)
CONSIGLI = (
    r"\b(consigli\w*|suggeris\w*|raccomand\w*|che\s+cosa\s+mi\s+serve|cosa\s+devo\s+fare)\b",
    r"\b(che|quale|quali)\s+(trattamento|terapia|cura|prodotto)\b",
    r"\bquant\w*\s+(sedute|ml|cc|unita|ui|siringhe|fiale)\b",
    r"\b(fa\s+male|e\s+pericoloso|e\s+sicuro|controindicaz\w+|effetti\s+collaterali)\b",
    r"\bposso\s+(fare|farlo|farmi|prendere|usare)\b",
)

RIFIUTO_CLINICO = (
    "⛔ Non posso dirti quale trattamento serve: è una valutazione che fa il medico, "
    "di persona. Qui posso solo aiutarti a trovare il nome di un trattamento che "
    "stai già cercando, e chi lo esegue vicino a te."
)
NON_RICONOSCIUTO = (
    "Non ho capito quale trattamento cerchi. Puoi dirlo con parole tue "
    "(per esempio: «il ripieno per le labbra», «la puntura per le rughe» no — "
    "quello no) oppure sfogliare l'elenco dei trattamenti."
)


def _piatto(s):
    return "".join(c for c in unicodedata.normalize("NFD", (s or "").lower())
                   if not unicodedata.combining(c))


class Esito:
    def __init__(self, ammesso, risposta, voci=(), motivo=""):
        self.ammesso, self.risposta, self.voci, self.motivo = ammesso, risposta, list(voci), motivo


def guardia(testo):
    """⛔ Gira PRIMA di qualunque modello. Torna il motivo, o `None` se passa."""
    t = _piatto(testo)
    for schema in DISTURBI:
        if re.search(schema, t):
            return f"disturbo:{re.search(schema, t).group(0)[:24]}"
    for schema in CONSIGLI:
        if re.search(schema, t):
            return f"consiglio:{re.search(schema, t).group(0)[:24]}"
    # ⚠️ **Per ultimo, e solo se il testo ⛔ non nomina già un trattamento.**
    # «Vorrei rifarmi le labbra col filler» dice **che cosa vuole**: respingerlo
    # sarebbe negare un servizio dovuto. È il desiderio **senza oggetto** che
    # ⛔ non si può soddisfare.
    if not riconosci(testo):
        for schema in DESIDERI_GENERICI:
            if re.search(schema, t):
                return f"desiderio-generico:{re.search(schema, t).group(0)[:22]}"
    return None


# ── 2. IL VOCABOLARIO — l'uscita è QUESTA, e ⛔ non altro ────────────────────
# ⚠️ Le chiavi coincidono con `PRESTAZIONI` di `raccolta-cliniche.py`: è ciò che
# sappiamo cercare nel database. Un nome che ⛔ non è lì ⛔ non serve a nulla —
# saprebbe rispondere e ⛔ non saprebbe trovare nessuno.
# 🔑 **Ogni voce mappa MODI DI DIRE, ⛔ non sintomi.** Un sinonimo è «la stessa
# cosa detta come la dice la gente»; un sintomo è «il problema per cui *forse*
# serve». La differenza è il confine di tutto questo modulo.
VOCI = {
    "Filler": ["filler", "fillers", "acido ialuronico", "ialuronico", "riempimento",
               "ripieno", "riempitivo", "puntura per le labbra", "labbra piu piene",
               "aumento labbra", "volume alle labbra", "acido"],
    "Tossina botulinica": ["botulino", "botox", "tossina", "tossina botulinica",
                           "puntura antirughe", "botulinica"],
    "Biostimolazione": ["biostimolazione", "biorivitalizzazione", "skinbooster",
                        "profhilo", "idratazione profonda", "biostimolante"],
    "Peeling chimico": ["peeling", "peeling chimico", "esfoliazione chimica"],
    "Laser": ["laser", "trattamento laser", "luce pulsata", "ipl"],
    "Mesoterapia": ["mesoterapia", "mesoterapico"],
    "Radiofrequenza": ["radiofrequenza", "microneedling con radiofrequenza"],
    "Fili di trazione": ["fili", "fili di trazione", "fili riassorbibili", "lifting con fili"],
    "Trattamento cicatrici": ["trattamento cicatrici", "revisione cicatrici"],
    "Epilazione": ["epilazione", "epilazione laser", "depilazione definitiva",
                   "eliminare i peli", "togliere i peli",
                   "via i peli", "senza peli", "peli per sempre"],
}


def riconosci(testo):
    """⛔ Non indovina e ⛔ non propone «qualcosa di simile»: o trova, o tace."""
    t = _piatto(testo)
    trovate = []
    for nome, modi in VOCI.items():
        for m in modi:
            if _piatto(m) in t:
                trovate.append((len(m), nome))       # il modo più lungo vince
                break
    return [n for _, n in sorted(trovate, reverse=True)]


def rispondi(testo):
    """Il giro completo. 🔑 **La risposta è COMPOSTA, ⛔ non generata**: frasi
    fisse più i nomi del vocabolario. ⛔ Non esiste, in questo file, il codice
    che possa produrre una raccomandazione — ⛔ nemmeno sbagliando."""
    motivo = guardia(testo)
    if motivo:
        return Esito(False, RIFIUTO_CLINICO, motivo=motivo)
    voci = riconosci(testo)
    if not voci:
        return Esito(True, NON_RICONOSCIUTO, motivo="nessuna voce")
    if len(voci) == 1:
        return Esito(True, f"Forse cerchi il trattamento **{voci[0]}**. "
                           f"Vuoi vedere chi lo esegue vicino a te?", voci)
    elenco = ", ".join(f"**{v}**" for v in voci[:3])
    return Esito(True, f"Potrebbe trattarsi di: {elenco}. Quale ti interessa?", voci)


BANCO = [
    # (frase, deve essere ammessa, voce attesa)
    ("cerco quella cosa per le labbra, il ripieno", True, "Filler"),
    ("vorrei il botox", True, "Tossina botulinica"),
    ("mi hanno parlato del profhilo", True, "Biostimolazione"),
    ("quanto costa il peeling", True, "Peeling chimico"),
    ("vorrei togliere i peli per sempre", True, "Epilazione"),
    ("il laser per il viso", True, "Laser"),
    # ⛔ questi NON devono passare
    ("ho le rughe sulla fronte", False, None),
    ("ho l'acne e vorrei sistemarla", False, None),
    ("che trattamento mi consigli per le occhiaie", False, None),
    ("quante sedute servono", False, None),
    ("il filler fa male?", False, None),
    ("ho le macchie sulle mani", False, None),
    ("mi vergogno del mio naso", False, None),
    ("posso fare il botox in gravidanza", False, None),
    # 🔴 Desideri generici — la falla trovata provando frasi VERE. «Ho 45 anni e
    # vorrei un aspetto più fresco» faceva rispondere «Biostimolazione» al
    # modello: un consiglio clinico dedotto da un desiderio senza oggetto.
    ("ho 45 anni e vorrei un aspetto piu fresco", False, None),
    ("vorrei sembrare piu giovane", False, None),
    ("vorrei un ritocchino al viso", False, None),
    ("vorrei migliorare il mio aspetto", False, None),
    # ⚠️ …⛔ ma il desiderio CON oggetto resta ammesso, o si negherebbe un
    # servizio dovuto: qui il paziente dice **che cosa** vuole.
    ("vorrei rifarmi le labbra col filler", True, "Filler"),
]


# ════════════════════════════════════════════ il collegamento alle faccette
def cerca_studi(testo, lat=None, lon=None, raggio_km=30, solo=None, limite=10):
    """Il giro completo: **parola del paziente → voce → studi che la eseguono**.

    🔑 **È qui che il glossario diventa utile**, e la catena resta la stessa di
    `abbinamento.py`: **glossario → filtri duri → ordinamento**, ⛔ senza che
    nessuno dei tre pezzi possa dare un consiglio.
    ⚠️ Se la guardia respinge, ⛔ **non si cerca niente**: ⛔ non si «cerca lo
    stesso, tanto poi filtriamo». Una ricerca fatta su un caso clinico
    resterebbe **una risposta a un caso clinico**, anche se il risultato è un
    elenco di indirizzi.
    """
    import importlib.util, os
    e = rispondi(testo)
    if not e.ammesso or not e.voci:
        return e, []
    qui = os.path.dirname(os.path.abspath(__file__))
    s = importlib.util.spec_from_file_location("ab", os.path.join(qui, "abbinamento.py"))
    ab = importlib.util.module_from_spec(s)
    s.loader.exec_module(ab)
    # ⚠️ **La prima voce, ⛔ non tutte**: se il paziente ne ha nominate due, la
    # domanda giusta è *«quale ti interessa?»* — che `rispondi()` ha già posto.
    # Cercarle entrambe e mescolare i risultati risponderebbe a una domanda che
    # ⛔ non è stata fatta.
    return e, ab.cerca(e.voci[0], lat=lat, lon=lon, raggio_km=raggio_km,
                       solo=solo, limite=limite)


def _prova_collegamento():
    print("\n━━━ il giro completo: parola → voce → studi ━━━")
    for frase in ("il ripieno per le labbra", "vorrei il botulino", "ho le rughe"):
        e, studi = cerca_studi(frase, lat=45.4642, lon=9.19, raggio_km=20, limite=3)
        print(f"\n  «{frase}»")
        print(f"     {'✅' if e.ammesso else '⛔'} {e.risposta[:76]}")
        for x in studi:
            print(f"       · {x['nome'][:38]:38} {x['comune'][:14]:14} ({x['tipo']})")
        if e.ammesso and not studi:
            print("       (nessuno entro il raggio)")


if __name__ == "__main__":
    if len(sys.argv) > 1 and not sys.argv[1].startswith("-"):
        e = rispondi(" ".join(sys.argv[1:]))
        print(("✅ " if e.ammesso else "⛔ ") + e.risposta)
        sys.exit(0)
    if "--collegamento" in sys.argv:
        _prova_collegamento(); sys.exit(0)
    ok = 0
    for frase, atteso, voce in BANCO:
        e = rispondi(frase)
        bene = (e.ammesso == atteso) and (not voce or voce in e.voci)
        ok += bene
        print(f"  {'✅' if bene else '🔴'} «{frase[:44]:44}» → "
              f"{('AMMESSA ' + ','.join(e.voci)) if e.ammesso else 'RESPINTA (' + e.motivo + ')'}")
    # 🔑 **La prova che conta più delle altre**: una frase respinta ⛔ non deve
    # produrre **nessuno** studio. ⛔ Non «pochi», ⛔ non «filtrati dopo»: zero.
    import os as _os
    if _os.path.exists(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)),
                                     "directory.sqlite")):
        perse = [f for f, atteso, _ in BANCO if not atteso
                 and cerca_studi(f, lat=45.4642, lon=9.19)[1]]
        if perse:
            print(f"\n  🔴 {len(perse)} frasi RESPINTE hanno comunque prodotto studi: {perse}")
            ok -= len(perse)
        else:
            print(f"\n  ✅ le {sum(1 for _, a, _ in BANCO if not a)} frasi respinte "
                  f"producono ZERO studi")
    print(f"\n{ok}/{len(BANCO)} — {'✅ banco verde' if ok == len(BANCO) else '🔴 BANCO ROSSO'}")
    sys.exit(0 if ok == len(BANCO) else 1)
