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
 * Misurato il 2026-08-17, a 1.147 chiavi tradotte: **30** stringhe visibili nei
 * sorgenti che NON stanno nel dizionario.
 *
 * ⚠️ Il primo numero scritto qui era **26**, ed era **indovinato**: l'ho messo
 * prima di eseguire lo script, e il presidio è nato rosso. ⛔ La correzione non
 * è stata «alzare la soglia»: è stata **misurare**, che è quello che andava
 * fatto prima. La differenza fra le due cose è tutta nel fatto che il numero qui
 * sotto viene da un'esecuzione, non da una stima.
 *
 * Sono quello che resta dopo nove giri di estrazione, e sono di tre tipi, tutti
 * legittimi: **frammenti** di frase attorno a un'espressione (spezzarli rompe
 * le lingue con un altro ordine delle parole), **dati** dei due studi
 * dimostrativi, e **nomi propri** che nessuna lingua traduce.
 *
 * ⛔ Non si alza. Se un file nuovo lo fa salire, le sue stringhe vanno nel
 *    dizionario: è letteralmente il lavoro che questo numero misura. È la
 *    stessa forma di `testo-estratto.test.ts` nell'app e di
 *    `scripts/lint-produzione.py` nel knowledge, e per la stessa ragione: una
 *    regola scritta non è un presidio, un numero che non può salire sì.
 */
const MASSIMO_FUORI_DIZIONARIO = 30

/** Quanto un dizionario può coincidere con l'italiano prima di essere sospetto.
 *  ⚠️ Non zero: nomi propri, sigle e veri omografi coincidono a ragione.
 *  Misurato: en 1,7% · es 2,4% · fr 1,2% · de 1,1%. Soglia al 15%, cioè sei
 *  volte il caso peggiore: prende un dizionario **copiato**, ⛔ non inseguisce
 *  le coincidenze. */
const MASSIMA_COINCIDENZA = 0.15

const NON_SI_TRADUCE = new Set([
  'Fibonacci', 'Medplum', 'FHIR', 'AIFA', 'GDPR', 'PEC', 'AGENAS', 'REA',
  'Ordine dei Medici', 'Garante', 'ISO 27001', 'eIDAS', 'PDF/A-3b',
])

/* Le stesse forme che `estrai-sito` cerca: testo fra due tag, attributi di
 * prosa, e i campi di prosa negli array di dati. ⛔ Se qui e là divergono,
 * questo numero misura una cosa e l'estrattore un'altra. */
const TESTO_JSX = />\s*([A-ZÀÈÉÌÒÙ][^<>{}\n]{6,}?)\s*</g
const ATTRIBUTO =
  /\b(?:title|placeholder|aria-label|alt|sommario|occhiello|etichetta|didascalia|sottotitolo)="([A-ZÀÈÉÌÒÙ][^"]{5,})"/g
const CAMPO =
  /\b(?:voce|perche|titolo|testo|descrizione|descr|corpo|prova|domanda|risposta|campo|valore|d|r|p)\s*:\s*'((?:[^'\\]|\\.){6,}?)'/g

const ESCLUSI = ['.test.', '.stories.', '/i18n/']

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
  for (const re of [TESTO_JSX, ATTRIBUTO, CAMPO]) {
    re.lastIndex = 0
    for (const m of testo.matchAll(re)) {
      const v = m[1].replace(/\\'/g, "'").trim()
      if (NON_SI_TRADUCE.has(v) || valori.has(v)) continue
      // ⛔ Le stringhe fatte solo di segnaposto o di codice non sono prosa.
      if (/^\{|\}$|^https?:/.test(v)) continue
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
