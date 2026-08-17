#!/usr/bin/env node
/**
 * Le traduzioni del manuale sono ancora allineate all'italiano?
 *
 * ── PERCHÉ ESISTE, ED È IL PUNTO DI TUTTO IL LAVORO ─────────────────────────
 * Il 2026-08-17 il manuale è stato tradotto in quattro lingue. La traduzione in
 * sé è la parte facile: quella difficile è che fra sei mesi l'italiano sarà
 * cambiato e le altre no. E **non si vedrà**: la pagina si apre, l'indice è
 * completo, i titoli sono nella lingua giusta, e il capitolo racconta una
 * schermata che non esiste più.
 *
 * ⇒ questo confronta le date. Un capitolo tradotto più vecchio del suo
 *   originale è **scaduto**, e va ritradotto:
 *       node scripts/traduci-manuale.mjs --lingua=de --solo=<slug>
 *
 * ── LE TRE CONDIZIONI, in ordine di gravità ─────────────────────────────────
 *  🔴 SCADUTO — l'italiano è cambiato dopo la traduzione. È il caso peggiore
 *     perché **sembra fatto**: il lettore straniero legge istruzioni sbagliate
 *     credendole aggiornate.
 *  🟠 MANCANTE, a lingua avviata — la lingua esiste ma quel capitolo no: il
 *     prodotto ripiega sull'italiano, e si vede. Va chiuso, non è urgente.
 *  ⚪ LINGUA NON GENERATA — zero capitoli: non è un difetto, è una lingua che
 *     non è mai stata tradotta. Si dice e si va avanti.
 *
 * USO:  node scripts/manuale-lingue.mjs           # esce 1 se c'è uno SCADUTO
 *       node scripts/manuale-lingue.mjs --solo-avviso   # non fallisce mai
 */
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(RADICE, 'src', 'content', 'docs')
const LINGUE = ['en', 'es', 'fr', 'de']

const rosso = (s) => `\x1b[31m${s}\x1b[0m`
const giallo = (s) => `\x1b[33m${s}\x1b[0m`

const italiani = readdirSync(DOCS)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.slice(0, -3))

let scaduti = 0
let mancanti = 0
const righe = []

for (const l of LINGUE) {
  const cartella = join(DOCS, l)
  if (!existsSync(cartella)) {
    righe.push(`⚪ ${l}: non generata`)
    continue
  }
  let ok = 0
  const suoiScaduti = []
  const suoiMancanti = []
  for (const slug of italiani) {
    const originale = join(DOCS, `${slug}.md`)
    const tradotto = join(cartella, `${slug}.md`)
    if (!existsSync(tradotto)) {
      suoiMancanti.push(slug)
      continue
    }
    /* ⚠️ Il confronto è su `mtime`, ⛔ non sul contenuto. Non c'è modo di
       sapere dal testo se una traduzione riflette l'ultima versione: l'unica
       cosa misurabile è **quale dei due file è stato scritto per ultimo**.
       È grossolano e sbaglia per eccesso (un ritocco di battitura all'italiano
       marca scaduti i quattro), ⛔ e va bene così: il costo di un falso allarme
       è ritradurre un capitolo, quello di un falso silenzio è un manuale che
       mente. */
    if (statSync(originale).mtimeMs > statSync(tradotto).mtimeMs) suoiScaduti.push(slug)
    else ok++
  }
  scaduti += suoiScaduti.length
  mancanti += suoiMancanti.length
  const stato =
    suoiScaduti.length > 0
      ? rosso(`🔴 ${suoiScaduti.length} SCADUTI`)
      : suoiMancanti.length > 0
        ? giallo(`🟠 ${suoiMancanti.length} mancanti`)
        : '✅'
  righe.push(`${stato}  ${l}: ${ok}/${italiani.length} allineati`)
  if (suoiScaduti.length) righe.push(`      scaduti: ${suoiScaduti.join(', ')}`)
  if (suoiMancanti.length) righe.push(`      mancanti: ${suoiMancanti.join(', ')}`)
}

console.log(`[manuale-lingue] ${italiani.length} capitoli italiani`)
for (const r of righe) console.log(`  ${r}`)

if (scaduti > 0 && !process.argv.includes('--solo-avviso')) {
  console.error(
    rosso(
      `\n⛔ ${scaduti} capitoli tradotti sono più vecchi del loro originale italiano.`,
    ),
  )
  console.error('   Ritraduci: node scripts/traduci-manuale.mjs --lingua=<xx> --solo=<slug>')
  console.error('   ⚠️ Una traduzione scaduta non si vede: la pagina si apre e racconta')
  console.error('      una schermata che non esiste più.')
  process.exit(1)
}
if (mancanti > 0) {
  console.log(
    giallo(
      `\n🟠 ${mancanti} capitoli non tradotti: il prodotto ripiega sull'italiano (si vede, non è urgente).`,
    ),
  )
}
