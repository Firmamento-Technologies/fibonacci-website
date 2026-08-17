#!/usr/bin/env node
/**
 * Il manuale esce da `out/` PRIMA che qualcuno lo pubblichi.
 *
 * ── PERCHÉ ─────────────────────────────────────────────────────────────────
 * Il 2026-08-12 l'utente ha chiesto di togliere il manuale dal sito pubblico:
 * *«diciamo alla concorrenza tutto quello che abbiamo e ci possono copiare»*.
 * Le guide restano e si leggono **dalla dashboard**, cioè da dentro l'app.
 *
 * La rotta `app/manuale-privato/route.ts` le raccoglie in un file solo — deve
 * girare dentro la build perché il testo va risolto dai segnaposto, e quella
 * regola sta in un modulo TypeScript che uno script `.mjs` non può importare
 * senza riscriverne una seconda copia.
 * Ma una rotta di Next scrive **dentro `out/`**, e `out/` è esattamente ciò che
 * finisce in `/var/www/fibonaccimedica`. Quindi qui il file si **sposta** fuori.
 *
 * ⛔ Non basta «non linkarlo»: il rilascio è un `rsync` della cartella intera,
 * e un file dentro `out/` è pubblicato per costruzione. L'unica difesa è che
 * non ci sia.
 *
 * ⚠️ Questo script è un CANCELLO: se non trova il file, se il file non ha le
 * 19 guide, o se dopo lo spostamento è rimasto qualcosa in `out/`, esce 1 e la
 * build fallisce. Un manuale a metà consegnato alla macchina spegnerebbe
 * l'assistente in-app **in silenzio** (`carica_guide()` torna un dizionario
 * vuoto e il prompt dice solo «non posso consultare le guide adesso»).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const SORGENTE = join(RADICE, 'out', 'manuale-privato')
const CARTELLA = join(RADICE, 'manuale')
const DESTINAZIONE = join(CARTELLA, 'manuale-corpus.json')

/** Le guide attese: si contano dal sorgente, non da un numero scritto a mano. */
function guideAttese() {
  const sorgente = readFileSync(join(RADICE, 'src', 'lib', 'docs-data.ts'), 'utf8')
  const daDocsInPoi = sorgente.slice(sorgente.indexOf('export const DOCS'))
  return [...daDocsInPoi.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
}

const rosso = (s) => `\x1b[31m${s}\x1b[0m`

function ferma(messaggio, comeSiRipara) {
  console.error(rosso(`[manuale-privato] ${messaggio}`))
  if (comeSiRipara) console.error(`               ${comeSiRipara}`)
  process.exit(1)
}

if (!existsSync(SORGENTE)) {
  ferma(
    `manca ${relative(RADICE, SORGENTE)}: la build non ha reso la rotta del manuale.`,
    'Controlla che `src/app/manuale-privato/route.ts` esista e abbia `dynamic = "force-static"`.',
  )
}

let dati
try {
  dati = JSON.parse(readFileSync(SORGENTE, 'utf8'))
} catch (e) {
  ferma(`${relative(RADICE, SORGENTE)} non è JSON valido: ${String(e).slice(0, 120)}`)
}

const attese = guideAttese()
const pagine = dati.pagine ?? []
if (pagine.length !== attese.length) {
  ferma(
    `il manuale ha ${pagine.length} guide, ne servono ${attese.length}.`,
    'DOCS in src/lib/docs-data.ts e il file reso non coincidono.',
  )
}

const vuote = pagine.filter((p) => !p.markdown?.trim() || !p.testo?.trim())
if (vuote.length) {
  ferma(
    `${vuote.length} guide senza testo: ${vuote.map((p) => p.percorso).join(', ')}.`,
    'Una guida vuota passa inosservata: il manuale sembra completo e non lo è.',
  )
}

mkdirSync(CARTELLA, { recursive: true })
writeFileSync(DESTINAZIONE, JSON.stringify(dati), 'utf-8')

/* Lo spostamento è il punto di tutto lo script: se il file resta anche in
   `out/`, il manuale è di nuovo pubblico e nessuno se ne accorge. */
rmSync(SORGENTE, { force: true })
if (existsSync(SORGENTE)) {
  ferma(`non sono riuscito a togliere ${relative(RADICE, SORGENTE)} da out/: NON rilasciare.`)
}


/* ── LE ALTRE QUATTRO LINGUE ────────────────────────────────────────────────
 *
 * Stesso trattamento dell'italiano: si spostano fuori da `out/` (sono lo stesso
 * manuale, e la ragione per cui l'italiano non e' pubblico vale identica) e si
 * controllano.
 *
 * ⚠️ IL CONTROLLO CHE CONTA e' quello sulle traduzioni A META'. Una lingua
 * assente e' un fatto visibile: l'app ripiega sull'italiano e si vede subito.
 * Una lingua tradotta a meta' invece **sembra fatta**: l'indice e' completo,
 * i titoli sono nella lingua giusta, e dentro certi capitoli il testo e'
 * italiano. Quindi: 0 guide tradotte = lingua non generata, si passa oltre;
 * fra 1 e tutte-meno-una = si ferma la build.
 */
const LINGUE = ['en', 'es', 'fr', 'de']
const perLingua = []
for (const l of LINGUE) {
  const sorgenteL = join(RADICE, 'out', 'manuale-privato', l)
  if (!existsSync(sorgenteL)) continue
  let datiL
  try {
    datiL = JSON.parse(readFileSync(sorgenteL, 'utf8'))
  } catch (e) {
    ferma(`manuale-privato/${l} non è JSON valido: ${String(e).slice(0, 120)}`)
  }
  const pagineL = datiL.pagine ?? []
  if (pagineL.length !== attese.length) {
    ferma(`il manuale ${l} ha ${pagineL.length} guide, ne servono ${attese.length}.`)
  }
  const ripiegati = datiL.ripiegati ?? 0
  if (ripiegati > 0 && ripiegati < attese.length) {
    ferma(
      `la lingua ${l} è tradotta a METÀ: ${attese.length - ripiegati} capitoli su ${attese.length}.`,
      'Completa con `node scripts/traduci-manuale.mjs --lingua=' + l + ' --riprendi`, ' +
        'oppure togli src/content/docs/' + l + '/ per tornare a un ripiego pulito sull\'italiano. ' +
        'Una lingua a metà sembra fatta e non lo è: è il caso peggiore dei tre.',
    )
  }
  writeFileSync(join(CARTELLA, `manuale-corpus.${l}.json`), JSON.stringify(datiL), 'utf-8')
  rmSync(sorgenteL, { force: true })
  if (existsSync(sorgenteL)) {
    ferma(`non sono riuscito a togliere out/manuale-privato/${l}: NON rilasciare.`)
  }
  perLingua.push(`${l}:${attese.length - ripiegati}/${attese.length}`)
}
if (perLingua.length) {
  console.log(`[manuale-privato] lingue → ${perLingua.join('  ')}`)
}

const caratteri = pagine.reduce((n, p) => n + p.markdown.length, 0)
console.log(
  `[manuale-privato] ${pagine.length} guide, ${caratteri.toLocaleString('it-IT')} caratteri → ` +
    `${relative(RADICE, DESTINAZIONE)} (fuori da out/, NON pubblicato)`,
)
