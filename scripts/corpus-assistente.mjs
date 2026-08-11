#!/usr/bin/env node
/**
 * Il corpus dell'assistente: SOLO ciò che il sito pubblica davvero.
 *
 *   node scripts/corpus-assistente.mjs            # scrive out/assistente-corpus.json
 *   node scripts/corpus-assistente.mjs --verifica # non scrive, controlla e basta
 *
 * ── PERCHÉ ESISTE, E PERCHÉ NON È UN PROMPT SCRITTO A MANO ──────────────────
 * C'era già un assistente per il sito (`/website-chat` nel transcriber) con i
 * fatti **scritti a mano** nel prompt di sistema. Misurati l'11 agosto 2026,
 * quei fatti erano diventati falsi:
 *
 *   · prezzi «39 / 79 / 149 €» quando il listino vero è **129 / 279 / 549**
 *     — un terzo del prezzo, detto a chi sta valutando l'acquisto;
 *   · dominio `app.fibonacci.it` e caselle `info@`/`supporto@fibonacci.it`,
 *     tutti inesistenti;
 *   · una demo live «senza registrazione» che non c'è;
 *   · sei specialità, quando il prodotto è la medicina estetica;
 *   · un link a `/tutorial` che risponde **404**.
 *
 * Nessuno di questi era un errore di programmazione: erano **verità
 * invecchiate**, ed è la modalità di guasto normale di un prompt scritto a
 * mano. Vive accanto al prodotto, cambia con lui, e nessun test lo guarda.
 *
 * ⇒ Qui la conoscenza si **estrae dal sito costruito**. Conseguenze, che sono
 * il punto:
 *
 *   1. **Non può contenere informazioni non pubbliche.** Non perché lo
 *      promettiamo: perché la sorgente è letteralmente ciò che chiunque legge
 *      aprendo il sito. Non c'è un percorso da cui possa entrare il knowledge
 *      base, la wiki o il codice dell'EMR.
 *   2. **Non può invecchiare in silenzio.** Si rigenera a ogni build: se un
 *      prezzo cambia sul sito, cambia qui. Se una pagina sparisce, sparisce.
 *
 * ⛔ Volutamente NON incluso: nulla che non sia sotto `out/`. Se una cosa non è
 * pubblicata, l'assistente non deve poterla dire — e il modo di garantirlo non
 * è chiederglielo, è non dargliela.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

const RADICE = new URL('..', import.meta.url).pathname
const OUT = join(RADICE, 'out')
const DESTINAZIONE = join(OUT, 'assistente-corpus.json')

/* Pagine che NON entrano nel corpus.
 *
 * ⚠️ I documenti legali sono pubblici ma sono **testo contrattuale**: un
 * assistente che ne riassume pezzi produce parafrasi di clausole, e una
 * parafrasi di una clausola non è la clausola. Meglio rimandare alla pagina.
 *
 * 🔴 **L'elenco si legge dalla cartella, e c'è un motivo misurato.** Scritto a
 * mano ne conteneva cinque su sei: mancava `/sicurezza/`. Non era una svista
 * innocua — è la pagina **più lunga del sito** (26.022 caratteri contro 11.644
 * della seconda), e con quella mole finiva prima in classifica su domande che
 * non c'entravano niente, «a cosa serve Fibonacci?» e «dove sono i dati?»
 * comprese. ⇒ Una lista scritta a mano accanto a una cartella che cambia è la
 * stessa modalità di guasto del prompt scritto a mano: diverge in silenzio.
 */
const LEGALI = join(RADICE, 'src', 'app', '(legale)')

function paginaLegali() {
  if (!existsSync(LEGALI)) return []
  return readdirSync(LEGALI, { withFileTypes: true })
    .filter((v) => v.isDirectory())
    .map((v) => `/${v.name}/`)
}

const ESCLUSE = [...paginaLegali(), '/404', '/index.txt']

/**
 * Il contenuto della pagina, senza la parte che si ripete ovunque.
 *
 * 🔴 **Misurato il 12 agosto 2026, e cambiava tutto.** Prima si prendeva la
 * pagina intera: su `/prezzi/` sono **55.314** caratteri, di cui solo **4.368**
 * sono la pagina — il resto è navigazione e piè di pagina, identici su tutte e
 * 37. Conseguenza: la parola «prezzi» compariva in **37 pagine su 37** e
 * smetteva di distinguere qualcosa. Chiedendo «quanto costa Fibonacci?»
 * l'assistente pescava la home e rispondeva *«il listino è pubblico, ma non è
 * riportato negli estratti»* — **avendo i prezzi nel corpus**.
 *
 * ⇒ Il rimedio non era pesare meglio le parole: era smettere di contare il
 * menu come contenuto.
 */
function contenutoPrincipale(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  return m ? m[1] : html
}

/** Da HTML a testo leggibile: via script, stile e marcatura. */
function testoDaHtml(html) {
  const senzaTesta = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
  return senzaTesta
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function titoloDaHtml(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i)
  return m ? m[1].replace(/\s+\|\s+Fibonacci.*$/, '').trim() : ''
}

async function* pagine(dir) {
  for (const voce of await readdir(dir, { withFileTypes: true })) {
    const intero = join(dir, voce.name)
    if (voce.isDirectory()) yield* pagine(intero)
    else if (voce.name.endsWith('.html')) yield intero
  }
}

export function percorsoPubblico(file, radice = OUT) {
  const rel = '/' + relative(radice, file).replace(/\\/g, '/')
  return rel.replace(/index\.html$/, '').replace(/\.html$/, '/')
}

export function daEscludere(percorso, escluse = ESCLUSE) {
  return escluse.some((e) => percorso === e || percorso.startsWith(e))
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("⛔ `out/` non esiste: costruisci il sito prima (npm run build).")
    process.exit(1)
  }
  const soloVerifica = process.argv.includes('--verifica')

  const voci = []
  for await (const file of pagine(OUT)) {
    const percorso = percorsoPubblico(file)
    if (daEscludere(percorso)) continue
    const html = readFileSync(file, 'utf-8')
    const testo = testoDaHtml(contenutoPrincipale(html))
    // Pagine quasi vuote (redirect, gusci) non aggiungono niente e diluiscono.
    if (testo.length < 200) continue
    voci.push({ percorso, titolo: titoloDaHtml(html), testo })
  }

  voci.sort((a, b) => a.percorso.localeCompare(b.percorso))
  const corpus = { generato_da: 'scripts/corpus-assistente.mjs', pagine: voci }

  const parole = voci.reduce((n, v) => n + v.testo.split(' ').length, 0)
  console.log(`   pagine nel corpus: ${voci.length}`)
  console.log(`   parole totali:     ${parole.toLocaleString('it-IT')}`)

  if (soloVerifica) return

  writeFileSync(DESTINAZIONE, JSON.stringify(corpus), 'utf-8')
  console.log(`   scritto: ${relative(RADICE, DESTINAZIONE)}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error('⛔', e.message)
    process.exit(1)
  })
}
