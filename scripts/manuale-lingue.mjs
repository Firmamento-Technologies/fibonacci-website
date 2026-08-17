#!/usr/bin/env node
/**
 * Le traduzioni del manuale sono ancora allineate all'italiano?
 *
 * ── PERCHÉ ESISTE, ED È IL PUNTO DI TUTTO IL LAVORO ─────────────────────────
 * Il 2026-08-17 il manuale è stato tradotto in quattro lingue. La traduzione in
 * sé è la parte facile: quella difficile è che fra sei mesi l'italiano sarà
 * cambiato e le altre no. E **non si vedrà**: la pagina si apre, l'indice è
 * completo, i titoli sono nella lingua giusta, e il capitolo racconta una
 * schermata che non esiste più. Un manuale che mente è peggio di uno che manca.
 *
 * ⇒ ogni traduzione porta con sé **l'impronta dell'italiano da cui viene**
 *   (`_sorgenti.json`). Se l'italiano di oggi ha un'altra impronta, quella
 *   traduzione è **scaduta** e va rifatta:
 *       node scripts/traduci-manuale.mjs --lingua=de --solo=<slug>
 *
 * ── 🔴 PERCHÉ L'IMPRONTA E NON LA DATA DEL FILE ─────────────────────────────
 * La prima versione confrontava `mtime`, e **si è bloccata da sola** al primo
 * push da un worktree pulito: **git non conserva le date**. In un clone appena
 * fatto i file escono in ordine arbitrario, quindi metà delle traduzioni
 * risulta più vecchia del proprio originale e il presidio è rosso **a caso**.
 * ⛔ Un presidio rosso a caso è peggio di uno che manca: viene spento, ed è già
 *    successo due volte in questo progetto (vedi `collaudo-cricca.json`).
 * L'impronta del contenuto sopravvive a cloni, worktree e CI.
 *
 * ── LE TRE CONDIZIONI, in ordine di gravità ─────────────────────────────────
 *  🔴 SCADUTO — l'italiano è cambiato dopo la traduzione. È il caso peggiore
 *     perché **sembra fatto**.
 *  🟠 MANCANTE, a lingua avviata — il prodotto ripiega sull'italiano, e si vede.
 *  ⚪ LINGUA NON GENERATA — zero capitoli: non è un difetto.
 *
 * USO:  node scripts/manuale-lingue.mjs           # esce 1 se c'è uno SCADUTO
 *       node scripts/manuale-lingue.mjs --solo-avviso   # non fallisce mai
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(RADICE, 'src', 'content', 'docs')
const LINGUE = ['en', 'es', 'fr', 'de']

/** ⚠️ Deve restare identica a `improntaSorgente` in `traduci-manuale.mjs`:
 *  due impronte calcolate in modo diverso dichiarano scaduto tutto, sempre. */
const impronta = (md) => createHash('sha256').update(md, 'utf8').digest('hex').slice(0, 16)

const rosso = (s) => `\x1b[31m${s}\x1b[0m`
const giallo = (s) => `\x1b[33m${s}\x1b[0m`

const italiani = readdirSync(DOCS)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.slice(0, -3))

let scaduti = 0
let mancanti = 0
let senzaImpronta = 0
const righe = []

for (const l of LINGUE) {
  const cartella = join(DOCS, l)
  if (!existsSync(cartella)) {
    righe.push(`⚪ ${l}: non generata`)
    continue
  }
  let registro = {}
  const fileRegistro = join(cartella, '_sorgenti.json')
  if (existsSync(fileRegistro)) {
    try {
      registro = JSON.parse(readFileSync(fileRegistro, 'utf8'))
    } catch {
      righe.push(rosso(`🔴 ${l}: _sorgenti.json illeggibile`))
    }
  }

  let ok = 0
  const suoiScaduti = []
  const suoiMancanti = []
  const suoiSenzaImpronta = []
  for (const slug of italiani) {
    if (!existsSync(join(cartella, `${slug}.md`))) {
      suoiMancanti.push(slug)
      continue
    }
    const attesa = registro[slug]
    if (!attesa) {
      /* ⚠️ Tradotto ma senza impronta: succede solo alle traduzioni fatte
         prima che il registro esistesse. ⛔ Non è «scaduto» (non lo sappiamo)
         e ⛔ non è «a posto» (non lo sappiamo): è **non verificabile**, e va
         detto con parole sue invece di essere infilato in una delle due. */
      suoiSenzaImpronta.push(slug)
      continue
    }
    if (impronta(readFileSync(join(DOCS, `${slug}.md`), 'utf8')) !== attesa) suoiScaduti.push(slug)
    else ok++
  }
  scaduti += suoiScaduti.length
  mancanti += suoiMancanti.length
  senzaImpronta += suoiSenzaImpronta.length

  const stato =
    suoiScaduti.length > 0
      ? rosso(`🔴 ${suoiScaduti.length} SCADUTI`)
      : suoiMancanti.length > 0 || suoiSenzaImpronta.length > 0
        ? giallo('🟠')
        : '✅'
  righe.push(`${stato}  ${l}: ${ok}/${italiani.length} verificati allineati`)
  if (suoiScaduti.length) righe.push(`      scaduti: ${suoiScaduti.join(', ')}`)
  if (suoiMancanti.length) righe.push(`      mancanti: ${suoiMancanti.join(', ')}`)
  if (suoiSenzaImpronta.length) {
    righe.push(`      senza impronta (non verificabili): ${suoiSenzaImpronta.length}`)
  }
}

console.log(`[manuale-lingue] ${italiani.length} capitoli italiani`)
for (const r of righe) console.log(`  ${r}`)

if (scaduti > 0 && !process.argv.includes('--solo-avviso')) {
  console.error(rosso(`\n⛔ ${scaduti} capitoli tradotti vengono da una versione VECCHIA dell'italiano.`))
  console.error('   Ritraduci: node scripts/traduci-manuale.mjs --lingua=<xx> --solo=<slug>')
  console.error('   ⚠️ Una traduzione scaduta non si vede: la pagina si apre e racconta')
  console.error('      una schermata che non esiste più.')
  process.exit(1)
}
if (mancanti > 0) {
  console.log(giallo(`\n🟠 ${mancanti} capitoli non tradotti: il prodotto ripiega sull'italiano.`))
}
if (senzaImpronta > 0) {
  console.log(
    giallo(
      `\n🟠 ${senzaImpronta} capitoli senza impronta: tradotti prima che il registro esistesse, ` +
        `non si può dire se sono allineati. Si chiude ritraducendoli una volta.`,
    ),
  )
}
