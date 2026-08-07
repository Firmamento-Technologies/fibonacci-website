#!/usr/bin/env node
/**
 * Prova visiva del sito: carica le pagine, scorre a posizioni note e salva
 * gli scatti in /tmp/prova-sito. Serve a guardare il risultato invece di
 * dedurlo dal DOM, e a produrre le immagini da mostrare.
 *
 *   node website/scripts/prova-visiva.mjs [url]
 */

import { chromium } from 'playwright'
import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.argv[2] ?? 'http://localhost:3210'
const DEST = '/tmp/prova-sito'
const VIEWPORT = { width: 1440, height: 900 }

/** [percorso, nome, scorrimenti in px] */
const GIRO = [
  ['/', 'home', [0, 2400, 4400, 5600, 6600, 8000, 9400, 10600, 12000, 13400, 14600]],
  ['/prezzi', 'prezzi', [0, 900]],
  ['/sicurezza-e-dati', 'sicurezza', [0]],
  ['/come-funziona', 'come-funziona', [0, 1200]],
  ['/consensi-informati', 'consensi', [0]],
  ['/richiedi-una-demo', 'demo', [0]],
]

async function main() {
  await rm(DEST, { recursive: true, force: true })
  await mkdir(DEST, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, locale: 'it-IT' })
  const page = await ctx.newPage()

  const errori = []
  page.on('pageerror', (e) => errori.push(`pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') errori.push(`console: ${m.text().slice(0, 160)}`) })

  for (const [percorso, nome, posizioni] of GIRO) {
    await page.goto(BASE + percorso, { waitUntil: 'networkidle', timeout: 60000 })
    // Le animazioni d'ingresso durano ~0,9 s: senza attesa si fotografa il vuoto.
    await page.waitForTimeout(1600)

    for (const y of posizioni) {
      await page.evaluate((v) => {
        document.documentElement.style.scrollBehavior = 'auto'
        window.scrollTo(0, v)
      }, y)
      // Il movimento legato allo scorrimento ha una molla: va lasciata posare.
      await page.waitForTimeout(700)
      const etichetta = String(y).padStart(5, '0')
      await page.screenshot({ path: join(DEST, `${nome}-${etichetta}.png`), type: 'png' })
    }
    console.log(`[${nome}] ${posizioni.length} scatti · altezza pagina ${await page.evaluate(() => document.documentElement.scrollHeight)}px`)
  }

  await browser.close()

  if (errori.length) {
    console.log('\n⚠️  errori in pagina:')
    for (const e of [...new Set(errori)]) console.log('   ' + e)
  } else {
    console.log('\nNessun errore in console.')
  }
  console.log(`Scatti in ${DEST}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
