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

# ── la ricerca per luogo: il caso emerso provando frasi vere ────────────────
BANCO_CITTA = [
    ("cerco un medico bravo per il viso a roma", "ROMA", None),
    ("chi fa il filler a milano", "MILANO", "Filler"),
    ("vorrei il botox vicino a torino", "TORINO", "Tossina botulinica"),
    ("zona bergamo", "Bergamo", None),
    # ⚠️ **La preposizione ambigua ⛔ non deve inventare un comune**: «un viso da
    # alba» ⛔ non è una richiesta per il comune di Alba.
    ("vorrei un viso da alba", None, None),
    # 🔑 **La guardia vince sulla città**: un caso clinico resta respinto anche
    # se nomina un luogo — ⛔ non si risponde «ecco chi c'è a Napoli» a chi ha
    # appena descritto un disturbo.
    ("ho le rughe a napoli", None, None),
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


def conta_per_citta(comune, prestazione=None):
    """Quanti sono **davvero**, ⛔ non quanti ne mostriamo.

    ⚠️ Difetto preso subito: la risposta diceva *«10 studi»* ⛔ ma **10 era il
    limite**, ⛔ non il totale. Dire a chi cerca che a Roma ce ne sono «10» quando
    sono centinaia ⛔ non è un arrotondamento: **è un'informazione falsa**, e
    lo sarebbe anche al contrario.
    """
    import sqlite3, os
    db = os.path.join(os.path.dirname(os.path.abspath(__file__)), "directory.sqlite")
    if not os.path.exists(db):
        return 0
    sql = ("SELECT COUNT(DISTINCT s.dominio) FROM studi s {join} "
           "WHERE UPPER(s.comune) = UPPER(?) {filtro}").format(
        join="JOIN prestazioni p USING(dominio)" if prestazione else "",
        filtro="AND p.prestazione = ?" if prestazione else "")
    with sqlite3.connect(db) as c:
        return c.execute(sql, [comune] + ([prestazione] if prestazione else [])).fetchone()[0]


def cerca_per_citta(comune, prestazione=None, limite=10):
    """Chi c'è in un comune — con o senza un trattamento richiesto."""
    import sqlite3, os
    db = os.path.join(os.path.dirname(os.path.abspath(__file__)), "directory.sqlite")
    if not os.path.exists(db):
        return []
    sql = ("SELECT s.nome, s.comune, s.tipo, s.telefono FROM studi s "
           "{join} WHERE UPPER(s.comune) = UPPER(?) {filtro} "
           "ORDER BY (SELECT COUNT(*) FROM prestazioni q WHERE q.dominio=s.dominio) DESC "
           "LIMIT ?")
    sql = sql.format(join="JOIN prestazioni p USING(dominio)" if prestazione else "",
                     filtro="AND p.prestazione = ?" if prestazione else "")
    arg = [comune] + ([prestazione] if prestazione else []) + [limite]
    with sqlite3.connect(db) as c:
        return [{"nome": r[0], "comune": r[1], "tipo": r[2], "telefono": r[3]}
                for r in c.execute(sql, arg)]


def rispondi_completo(testo):
    """🔑 **Tre casi, e ⛔ non due.** La ricerca per luogo ⛔ non sostituisce il
    glossario: lo **completa**.

        trattamento + città  →  chi fa X a Y
        solo città           →  chi c'è a Y            ← mancava, e cadeva nel «⛔ non ho capito»
        solo trattamento     →  chi fa X (poi si chiede dove)

    ⛔ **«Bravo» ⛔ non diventa un ordinamento per qualità**: ⛔ non abbiamo un
    criterio, e mostrarne uno sarebbe **una classifica** (L. 145/2018 c. 525).
    Si ordina per **ricchezza del profilo** — quanto lo studio ha dichiarato di
    sé — che ⛔ non è un giudizio su di lui.
    """
    e = rispondi(testo)
    citta = riconosci_citta(testo)
    if not e.ammesso:
        return e, []
    if e.voci and citta:
        studi = cerca_per_citta(citta, e.voci[0])
        tot = conta_per_citta(citta, e.voci[0])
        e.risposta = (f"**{e.voci[0]}** a **{citta.title()}**: "
                      f"{tot} stud{'io' if tot == 1 else 'i'}"
                      + (f" (ne mostro {len(studi)})." if tot > len(studi) else ".")
                      if studi else
                      f"A **{citta.title()}** ⛔ non risulta nessuno che faccia **{e.voci[0]}**.")
        return e, studi
    if citta and not e.voci:
        studi = cerca_per_citta(citta)
        tot = conta_per_citta(citta)
        e.risposta = (f"A **{citta.title()}** ci sono **{tot}** fra studi e cliniche. "
                      f"Se dici quale trattamento cerchi, restringo."
                      if studi else f"A **{citta.title()}** ⛔ non ho ancora nessuno.")
        e.motivo = "citta"
        return e, studi
    return e, []


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


# ════════════════════════════════════════════════════ la ricerca per città
# 🔑 **Perché serve, e ⛔ non è un di più.** Provando frasi vere è emerso che
# *«cerco un medico bravo per il viso a Roma»* cadeva nel «⛔ non ho capito»:
# è una richiesta **legittima** ⛔ ma ⛔ non di trattamento — è una **ricerca per
# luogo**, e il database sa già rispondere.
# ⛔ **«Bravo» ⛔ non si traduce in un ordinamento per qualità**: ⛔ non abbiamo un
# criterio, e mostrarne uno sarebbe **una classifica** (L. 145/2018 c. 525).
# Si risponde con **chi c'è**, ⛔ non con **chi è meglio**.
RE_LUOGO = None      # compilata alla prima chiamata, dai comuni del database


def _comuni_noti():
    """I comuni **che abbiamo davvero**, ⛔ non un elenco teorico: rispondere
    «a Fiumefreddo non c'è nessuno» è utile solo se lo sappiamo per certo."""
    import sqlite3, os
    db = os.path.join(os.path.dirname(os.path.abspath(__file__)), "directory.sqlite")
    if not os.path.exists(db):
        return []
    with sqlite3.connect(db) as c:
        return [r[0] for r in c.execute(
            "SELECT DISTINCT comune FROM studi WHERE comune IS NOT NULL AND comune != ''")]


def riconosci_citta(testo):
    """Il comune nominato, o `None`.

    ⚠️ **Serve la preposizione, e ⛔ non è pignoleria.** 132 comuni hanno un nome
    di ≤4 lettere — *Alba, Arco, Este, Bra, Cava* — che sono anche **parole
    comuni**: cercarli nudi farebbe leggere «alba» in *«vorrei un viso da alba»*.
    ⇒ si accetta solo **«a Roma», «in zona Milano», «vicino a Torino»**, che è
    poi **come si dice davvero**.
    """
    global RE_LUOGO
    if RE_LUOGO is None:
        comuni = _comuni_noti()
        if not comuni:
            RE_LUOGO = False
        else:
            # i più lunghi prima: «Reggio Emilia» ⛔ non deve perdere contro «Reggio»
            alt = "|".join(re.escape(_piatto(c)) for c in
                           sorted(set(comuni), key=len, reverse=True) if len(c) > 2)
            RE_LUOGO = re.compile(
                # ⚠️ **⛔ Niente «da» né «di»**: sono ambigue e producono falsi
                # positivi veri — *«vorrei un viso da alba»* faceva riconoscere
                # il comune di **Alba**. Le preposizioni di **luogo** sono
                # queste, e bastano perché sono come si dice davvero.
                r"\b(?:a|ad|in|vicino\s+a|zona|provincia\s+di|presso|nei\s+pressi\s+di)"
                r"\s+(" + alt + r")\b")
    if RE_LUOGO is False:
        return None
    m = RE_LUOGO.search(_piatto(testo))
    if not m:
        return None
    trovato = m.group(1)
    for c in _comuni_noti():          # si restituisce il nome **come sta a database**
        if _piatto(c) == trovato:
            return c
    return None


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
    tot = len(BANCO)
    for frase, citta_attesa, voce_attesa in BANCO_CITTA:
        e, studi = rispondi_completo(frase)
        c = riconosci_citta(frase) if e.ammesso else None
        bene = (c == citta_attesa) and (not voce_attesa or voce_attesa in e.voci)
        if citta_attesa is None and not e.ammesso:
            bene = True                       # respinta dalla guardia: corretto
        ok += bene; tot += 1
        print(f"  {'✅' if bene else '🔴'} «{frase[:44]:44}» → "
              f"{c or ('RESPINTA' if not e.ammesso else 'nessun luogo')}"
              f"{' · ' + ','.join(e.voci) if e.voci else ''}")
    print(f"\n{ok}/{tot} — {'✅ banco verde' if ok == tot else '🔴 BANCO ROSSO'}")
    sys.exit(0 if ok == len(BANCO) else 1)
