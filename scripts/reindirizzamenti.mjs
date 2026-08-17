#!/usr/bin/env node
/**
 * Genera le pagine di reindirizzamento dai vecchi indirizzi ai nuovi.
 *
 * Perché servono: il sito è esportato statico su GitHub Pages, dove non c'è
 * un server che possa rispondere 301. L'unico reindirizzamento possibile è
 * una paginetta HTML con `<meta http-equiv="refresh">` più il `rel=canonical`
 * che dice al motore qual è l'indirizzo buono. Non è un 301 e non trasferisce
 * la stessa autorità, ma evita che chi ha un vecchio collegamento trovi un 404.
 *
 * Gira dopo `next build`, dentro `out/`.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RADICE = join(__dirname, '..')
const OUT = join(RADICE, 'out')
/* ⚠️ Terza copia della stessa regola, trovata l'11 agosto passando al dominio
 * proprio: `next.config.ts`, `src/lib/asset-path.ts` e questo script decidevano
 * il prefisso ognuno per conto suo, con condizioni diverse. Con il dominio
 * acceso gli altri due lo toglievano e questo continuava a scriverlo, quindi
 * **11 stub di reindirizzamento** mandavano a un percorso inesistente — e un
 * reindirizzamento rotto è peggio di una pagina mancante, perché il visitatore
 * ci arriva convinto di essere sulla strada giusta.
 * Ora la sorgente è UNA: `NEXT_PUBLIC_DOMINIO_SITO`. */
const dominioProprio = (process.env.NEXT_PUBLIC_DOMINIO_SITO ?? '').trim()
const BASE = dominioProprio ? '' : (process.env.NEXT_PUBLIC_BASE_PATH ?? '/fibonacci-website')

/** vecchio → nuovo. Chi non ha un nuovo posto va alla home, non a un 404. */
const MAPPA = {
  '/faq': '/domande',
  '/verify': '/verifica',
  '/prova-demo': '/richiedi-una-demo',
  // Pagine tolte con il rifacimento: /specialita vendeva sei prodotti di cui
  // cinque non esistono; /segreteria è un prodotto di un'altra società;
  // /partners e /status non erano né aggiornati né verificabili, e una
  // pagina di stato ferma toglie fiducia invece di darne.
  '/specialita': '/',
  /* Dall'8 agosto `/partners` ha di nuovo una destinazione propria: la pagina
     per le società scientifiche. Mandava a `/chi-siamo` solo perché non
     c'era niente di meglio. */
  '/partners': '/per-le-societa-scientifiche',
  '/status': '/sicurezza-e-dati',
  '/segreteria': '/',
  '/ambassador': '/',
}

/* ⚠️ Anche questi vanno nella lingua della costruzione.
 *
 * Sono otto indirizzi vecchi che rimandano ai nuovi, e vengono generati **per
 * ogni lingua** (`out/de/faq`, `out/fr/faq`, …). Misurato il 2026-08-17: gli
 * otto `<title>` erano «Pagina spostata» in tutte e cinque le lingue, e
 * `<html lang="it">` anche nella cartella tedesca — cioe' otto pagine che
 * dichiarano a Google la lingua sbagliata.
 *
 * ⛔ Il dizionario NON si importa da qui: questo e' uno script Node che gira
 *    fuori dal bundle, e `@/lib/testo` non si risolve. Si legge il JSON, che e'
 *    la stessa fonte. */
const LINGUA = (process.env.NEXT_PUBLIC_LINGUA ?? 'it').trim() || 'it'
const TAG = { it: 'it-IT', en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' }
const DIZ = JSON.parse(
  await readFile(join(RADICE, 'src', 'i18n', 'sito', `${LINGUA}.json`), 'utf8'),
)
/* ⛔ Se la chiave manca si FERMA, invece di scrivere italiano in una pagina
 *    tedesca: e' il ripiego silenzioso che tutto questo lavoro chiude. */
const testo = (k) => {
  const v = DIZ[k]
  if (v === undefined) throw new Error(`[reindirizzamenti] chiave «${k}» assente da ${LINGUA}.json`)
  return v
}

const pagina = (destinazione) => `<!doctype html>
<html lang="${TAG[LINGUA] ?? 'it-IT'}">
<head>
<meta charset="utf-8">
<title>${testo('reindirizzamenti.titolo')}</title>
<link rel="canonical" href="${BASE}${destinazione === '/' ? '/' : destinazione}">
<meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0; url=${BASE}${destinazione === '/' ? '/' : destinazione}">
</head>
<body>
<p>${testo('reindirizzamenti.corpo')} <a href="${BASE}${destinazione === '/' ? '/' : destinazione}">${testo('reindirizzamenti.continua')}</a>.</p>
</body>
</html>
`

let fatte = 0
for (const [vecchio, nuovo] of Object.entries(MAPPA)) {
  const cartella = join(OUT, vecchio)
  await mkdir(cartella, { recursive: true })
  await writeFile(join(cartella, 'index.html'), pagina(nuovo), 'utf8')
  fatte += 1
}

console.log(`[reindirizzamenti] ${fatte} vecchi indirizzi mandati ai nuovi`)
