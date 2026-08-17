/**
 * Il presidio della traduzione che legge i **SORGENTI**, non il costruito.
 *
 * ── PERCHE' NE SERVE UNO SECONDO ────────────────────────────────────────────
 * `lingue-tradotte.mjs` misura il testo delle pagine costruite, ed è la misura
 * vera. ⚠️ Ma richiede il costruito **in cinque lingue** (`costruisci-lingue.mjs`,
 * ~20 minuti su questa macchina): pretenderlo a ogni push vorrebbe dire un
 * cancello che si salta sempre, cioè nessun cancello.
 *
 * 🔑 Questo invece costa **meno di un secondo** e prende le tre regressioni che
 * succedono davvero mentre si scrive:
 *   1. una **stringa nuova scritta dentro il codice** invece che nel dizionario;
 *   2. una **chiave aggiunta in italiano e non nelle altre quattro** lingue;
 *   3. un **dizionario copiato** dall'italiano.
 *
 * ⛔ Non sostituisce l'altro, e il cancello lo dice: quando `out/` non è il
 *    costruito a cinque lingue, stampa **quale controllo non ha girato**. Un
 *    presidio che tace su ciò che non ha guardato è il difetto che questo
 *    lavoro ha passato la notte a chiudere.
 *
 * USO:  node scripts/lingue-sorgenti.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(RADICE, 'src')
const DIZIONARI = join(SRC, 'i18n', 'sito')
const LINGUE = ['en', 'es', 'fr', 'de']

/**
 * Misurato il 2026-08-17 **dopo aver allargato lo sguardo** (vedi `CAMPO` più
 * sotto): **23** stringhe visibili nei sorgenti che NON stanno nel dizionario,
 * a 1.259 chiavi tradotte in cinque lingue.
 *
 * ⚠️ **Il 30 di prima non era una soglia più larga: era una vista più stretta.**
 * Quel numero contava i campi di un elenco chiuso di nomi, e intanto sul sito
 * vivo c'erano **174 righe ancora in italiano su `/en/`** in **24 pagine su 27**.
 * Allargando il campo a qualunque nome sono saltate fuori **136** stringhe; ne
 * sono state estratte **116** e tradotte **112 chiavi nuove** nelle quattro
 * lingue. ⇒ il numero è sceso perché è **stato fatto il lavoro**, ⛔ non perché
 * la soglia si sia mossa. Le due cose si distinguono solo scrivendolo qui.
 *
 * ⚠️ Il primo numero scritto qui era **26**, ed era **indovinato**: l'ho messo
 * prima di eseguire lo script, e il presidio è nato rosso. ⛔ La correzione non
 * è stata «alzare la soglia»: è stata **misurare**, che è quello che andava
 * fatto prima. La differenza fra le due cose è tutta nel fatto che il numero qui
 * sotto viene da un'esecuzione, non da una stima.
 *
 * **Che cosa sono le 23 che restano**, guardate una per una il 2026-08-17: sono
 * **tutte frammenti di frase** attorno a un elemento in linea — «Il listino è
 * <Link>pubblico</Link>», «L'elenco è <strong>chiuso</strong>». ⛔ Non si
 * estraggono a pezzi: una lingua con un altro ordine delle parole li rimette
 * insieme sbagliati, e siccome il testo c'è tutto **nessun test se ne accorge**.
 * Vogliono una frase intera con segnaposto, o un `<Trans>`, ed è lavoro a sé.
 * 🔎 Provato sul campo lo stesso giorno: un'estrazione automatica ne aveva presi
 * **22**, e uno era diventato «Nessuno apre uno studio per fare l&apos;» — cioè
 * un'entità HTML finita **dentro il dizionario**, che a video si sarebbe letta
 * così com'è. Ripristinati tutti e 22.
 *
 * ⛔ Non si alza. Se un file nuovo lo fa salire, le sue stringhe vanno nel
 *    dizionario: è letteralmente il lavoro che questo numero misura. È la
 *    stessa forma di `testo-estratto.test.ts` nell'app e di
 *    `scripts/lint-produzione.py` nel knowledge, e per la stessa ragione: una
 *    regola scritta non è un presidio, un numero che non può salire sì.
 */
const MASSIMO_FUORI_DIZIONARIO = 23

/** Quanto un dizionario può coincidere con l'italiano prima di essere sospetto.
 *  ⚠️ Non zero: nomi propri, sigle e veri omografi coincidono a ragione.
 *  Misurato: en 1,7% · es 2,4% · fr 1,2% · de 1,1%. Soglia al 15%, cioè sei
 *  volte il caso peggiore: prende un dizionario **copiato**, ⛔ non inseguisce
 *  le coincidenze. */
const MASSIMA_COINCIDENZA = 0.15

const NON_SI_TRADUCE = new Set([
  'Fibonacci', 'Medplum', 'FHIR', 'AIFA', 'GDPR', 'PEC', 'AGENAS', 'REA',
  'Ordine dei Medici', 'Garante', 'ISO 27001', 'eIDAS', 'PDF/A-3b',
  /* ⚠️ Istituzioni e documenti italiani: ⛔ non si traducono, si nominano.
   * «Agenzia delle Entrate» in tedesco non esiste, e tradurla darebbe a un
   * lettore straniero l'impressione che esista un ente equivalente nel suo
   * paese. Stanno in `lib/giurisdizione.ts`, che è il file che dice a chi legge
   * da fuori **quali obblighi non lo riguardano**. */
  'Agenzia delle Entrate', 'Sistema Tessera Sanitaria', 'Codice Fiscale',
])

/* Le stesse forme che l'estrattore cerca: testo fra due tag, attributi di
 * prosa, e i campi di prosa negli array di dati. ⛔ Se qui e là divergono,
 * questo numero misura una cosa e l'estrattore un'altra. */
/* ⚠️ L'INIZIALE: `[A-ZÀÈÉÌÒÙ(«]`, e la maiuscola da sola era la quinta cecità.
 * Il 2026-08-17 `(si apre in una nuova scheda)` è rimasto in italiano su **nove
 * collegamenti per pagina** in tutte e quattro le lingue, ⛔ perché comincia con
 * una parentesi. È testo per chi usa uno screen reader: invisibile a video,
 * invisibile al presidio, e letto ad alta voce a chi non vede la pagina. */
const TESTO_JSX = />\s*([A-ZÀÈÉÌÒÙ(«][^<>{}\n]{6,}?)\s*</g
const ATTRIBUTO =
  /\b(?:title|placeholder|aria-label|alt|sommario|occhiello|etichetta|didascalia|sottotitolo)="([A-ZÀÈÉÌÒÙ][^"]{5,})"/g

/* 🔴 CAMPO GUARDA QUALUNQUE NOME, E IL 2026-08-17 GUARDAVA UN ELENCO.
 *
 * Prima qui c'era una lista di nomi ammessi
 * (`voce|perche|titolo|testo|descrizione|…`), e un campo che si chiamava
 * diversamente **non esisteva** per questo presidio. Misurato quel giorno sul
 * sito vivo: **174 righe ancora in italiano su `/en/`**, in **24 pagine su 27**,
 * mentre qui il numero era **verde a 30**. Con le stesse identiche espressioni,
 * tolto solo l'elenco: **110**, cioè **109 invisibili** — `description` (23),
 * `come` (10), `title` (9), `alt` (7), `aCosaServe`, `cosaFa`, `cosaNonFa`,
 * `cosaE`, `bastaSe`, `nonBastaSe`, `perNoi`, `noi`, `punto`, `aiuto`, `fonte`.
 *
 * 🔑 **Un elenco di ammessi dimentica in silenzio; uno di esclusi fa rumore
 * quando dimentica**, ed è il verso giusto per un presidio. Quindi ora il campo
 * è qualunque, e a decidere è la **forma del valore**: se ha uno spazio ed è
 * prosa lo conta, se è CSS o un identificatore no. Un nome di campo nuovo entra
 * da solo, che è precisamente ciò che è mancato.
 * ⚠️ Conseguenza voluta: chi inventa `mioCampoNuovo: 'Frase italiana'` lo vede
 * subito, ⛔ non fra due mesi guardando le pagine tradotte a mano.
 */
const CAMPO = /\b[A-Za-z][A-Za-z0-9_]*\s*:\s*'((?:[^'\\]|\\.){6,}?)'/g

/* 🔴 LA QUARTA FORMA, trovata il 2026-08-17 mentre si correggeva la terza.
 * Una stringa può essere **elemento di un array**, senza nome di campo davanti:
 *
 *     {[['Cosa fa', d.cosaFa], ['Cosa non fa', d.cosaNonFa]].map(…)}
 *
 * Quelle due etichette si leggono a video su `/intelligenza-artificiale`, cioè
 * sulla pagina che esiste per dichiarare i limiti dell'IA, e ⛔ **nessuna delle
 * tre espressioni qui sopra poteva vederle**: non c'è un `>` prima, non c'è un
 * `attributo=`, non c'è un `campo:`.
 * 🔑 Vale la pena notare come è saltata fuori: ⛔ non da questo presidio, ma
 * **guardando la pagina** mentre se ne riscriveva un pezzo. È la ragione per
 * cui `lingue-tradotte.mjs`, che legge il costruito, non è sostituibile da
 * questo: qui si elencano le forme che ci si aspetta, lì si guarda il risultato. */
const ELEMENTO = /[[,]\s*'([A-ZÀÈÉÌÒÙ][^'\\]*\s[^'\\]*)'/g

/* Che cosa NON è prosa, per forma e non per nome. Ogni riga è una famiglia
 * misurata sul repo, ⛔ non un'ipotesi:
 *   · `var(--x)`, `1px solid …`, `repeat(auto-fit, …)`  → CSS
 *   · `0px 0px -10% 0px`, `+39 000 0000000`             → misure e recapiti
 *   · `#ffffff`, `"opsz" 40`, `%s · Fibonacci`          → colori, font, modelli
 *   · niente spazi                                       → identificatori, rotte,
 *     slug, chiavi (`Europe/Rome`, `2-digit`, `LayoutDashboard`)
 * ⚠️ Se un domani una di queste forme portasse prosa vera, il rimedio è
 * **restringere la riga**, ⛔ non rimettere un elenco di nomi. */
const NON_E_PROSA = [
  /var\(--/,
  /\b(?:repeat|minmax|calc|rgba?|hsla?|url|translate\w*|cubic-bezier)\(/,
  /^-?\d/,
  /\d\s*(?:px|rem|em|vh|vw|fr|%)\b/,
  /^#[0-9a-fA-F]{3,8}\b/,
  /^["']/,
  /^%s/,
  /^[+]\d/,
]

const ESCLUSI = [
  '.test.',
  '.stories.',
  '/i18n/',
  /* 🔴 QUI C'ERA `lib/segnaposto.ts`, ed era **sbagliato due volte**.
   * La motivazione scritta («dati dei due studi dimostrativi») descriveva un
   * ALTRO file: quelli stanno in `lib/medici-pubblici.ts`. E il file escluso
   * conteneva invece l'**avviso di bozza iniettato in testa a ogni documento
   * legale**, che così è rimasto in italiano su 28 pagine tradotte.
   * ⇒ tolto il 2026-08-17, e l'avviso è passato nel dizionario.
   * 🔑 La lezione, che vale per la prossima esclusione: un'esclusione per file
   * si scrive **dopo** aver letto il file, ⛔ non dal nome. */
  /* ⚠️ Titoli e descrizioni dei capitoli del manuale: **hanno già una filiera
   * di traduzione propria**, e non passano dal dizionario del sito. Stanno in
   * `src/content/docs/<lingua>/_indice.json` (23 capitoli × 4 lingue, verificati
   * il 2026-08-17) e li legge `loadIndiceLingua`. ⇒ contarli qui direbbe che 48
   * stringhe non sono tradotte **mentre lo sono**, e un presidio che grida al
   * lupo viene spento. Il presidio di quella filiera è un altro, ed è già in
   * piedi: `scripts/manuale-privato.mjs` fallisce se una lingua è tradotta a
   * metà. */
  'lib/docs-data.ts',
]

function sorgenti(dir) {
  const fuori = []
  for (const v of readdirSync(dir)) {
    const p = join(dir, v)
    if (statSync(p).isDirectory()) fuori.push(...sorgenti(p))
    else if ((p.endsWith('.tsx') || p.endsWith('.ts')) && !ESCLUSI.some((e) => p.includes(e)))
      fuori.push(p)
  }
  return fuori
}

const it = JSON.parse(readFileSync(join(DIZIONARI, 'it.json'), 'utf8'))
const valori = new Set(Object.values(it))
let uscita = 0

// ── 1. Le stringhe visibili che NON stanno nel dizionario ───────────────────
const fuori = []
for (const f of sorgenti(SRC)) {
  const testo = readFileSync(f, 'utf8')
  for (const re of [TESTO_JSX, ATTRIBUTO, CAMPO, ELEMENTO]) {
    re.lastIndex = 0
    for (const m of testo.matchAll(re)) {
      const v = m[1].replace(/\\'/g, "'").trim()
      if (NON_SI_TRADUCE.has(v) || valori.has(v)) continue
      // ⛔ Le stringhe fatte solo di segnaposto o di codice non sono prosa.
      if (/^\{|\}$|^https?:/.test(v)) continue
      // ⛔ E nemmeno il CSS, le misure e gli identificatori: vedi `NON_E_PROSA`.
      //    Serve almeno uno spazio, perché una parola sola è una chiave.
      if (!v.includes(' ') || NON_E_PROSA.some((r) => r.test(v))) continue
      fuori.push({ file: relative(SRC, f), testo: v })
    }
  }
}

if (fuori.length > MASSIMO_FUORI_DIZIONARIO) {
  uscita = 1
  console.log(`⛔ ${fuori.length} stringhe visibili NON nel dizionario (massimo ${MASSIMO_FUORI_DIZIONARIO}):`)
  for (const x of fuori.slice(0, 12)) console.log(`   ${x.file}\n      «${x.testo.slice(0, 66)}»`)
  console.log(`   ⇒ mettile in src/i18n/sito/it.json e usale con t('chiave').`)
  console.log(`   ⛔ NON alzare MASSIMO_FUORI_DIZIONARIO: è il lavoro che misura.`)
} else {
  console.log(`✅ ${fuori.length} stringhe fuori dal dizionario (massimo ${MASSIMO_FUORI_DIZIONARIO})`)
}

// ── 2. Le cinque lingue hanno le stesse chiavi ───────────────────────────────
// ⚠️ Una chiave aggiunta in italiano e non nelle altre **ferma la build**
//    (`lib/testo.ts` lancia in produzione), ⛔ ma solo quando qualcuno
//    costruisce. Qui si vede subito, e prima.
for (const l of LINGUE) {
  const d = JSON.parse(readFileSync(join(DIZIONARI, `${l}.json`), 'utf8'))
  const mancanti = Object.keys(it).filter((k) => d[k] === undefined)
  const in_piu = Object.keys(d).filter((k) => it[k] === undefined)
  if (mancanti.length || in_piu.length) {
    uscita = 1
    console.log(`⛔ ${l}.json disallineato: ${mancanti.length} mancanti, ${in_piu.length} in più`)
    for (const k of mancanti.slice(0, 6)) console.log(`   manca  ${k}\n      «${it[k].slice(0, 60)}»`)
    for (const k of in_piu.slice(0, 3)) console.log(`   in più ${k}`)
    continue
  }
  // ── 3. E non è una copia dell'italiano ────────────────────────────────────
  const uguali = Object.keys(it).filter((k) => it[k] === d[k]).length
  const quota = uguali / Object.keys(it).length
  if (quota > MASSIMA_COINCIDENZA) {
    uscita = 1
    console.log(`⛔ ${l}.json coincide con l'italiano nel ${(quota * 100).toFixed(1)}% dei valori`)
    console.log(`   ⇒ è una copia, non una traduzione.`)
  } else {
    console.log(`✅ ${l}: ${Object.keys(d).length} chiavi allineate, ${(quota * 100).toFixed(1)}% coincidenti`)
  }
}

process.exit(uscita)
