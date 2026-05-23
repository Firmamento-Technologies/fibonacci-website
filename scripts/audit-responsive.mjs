#!/usr/bin/env node
// Audit responsive del sito Fibonacci a 3 viewport: mobile / tablet / desktop.
// Output: PNG fullPage per ogni route x viewport in scripts/audit/

import { chromium } from 'playwright'
import { mkdir, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, 'audit')

const BASE = 'https://firmamento-technologies.github.io/fibonacci-website'

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667, deviceScaleFactor: 2 },
  { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'desktop', width: 1280, height: 800, deviceScaleFactor: 1 },
]

const ROUTES = [
  { slug: 'home', path: '/' },
  { slug: 'specialty-estetica', path: '/specialita/estetica/' },
  { slug: 'faq', path: '/faq/' },
  { slug: 'chi-siamo', path: '/chi-siamo/' },
  { slug: 'tutorial', path: '/tutorial/' },
  { slug: 'docs', path: '/docs/' },
  { slug: 'doc-installazione', path: '/docs/installazione/' },
  { slug: 'privacy', path: '/privacy/' },
]

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Viewport ${vp.name} ${vp.width}x${vp.height} ===`)
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      locale: 'it-IT',
      ignoreHTTPSErrors: true,
      hasTouch: vp.name === 'mobile',
    })
    const page = await ctx.newPage()

    for (const route of ROUTES) {
      const url = `${BASE}${route.path}`
      console.log(`  ${route.slug} -> ${url}`)
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
        await page.waitForTimeout(2000)

        // Calcola le metriche pagina
        const dims = await page.evaluate(() => ({
          scrollHeight: document.documentElement.scrollHeight,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight,
          // Detect overflow orizzontale (peggior offender mobile)
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          // Trova elementi più larghi del viewport
          overflowElements: Array.from(document.querySelectorAll('*'))
            .filter((el) => el.scrollWidth > document.documentElement.clientWidth + 1)
            .slice(0, 5)
            .map((el) => `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ').slice(0, 2).join('.') : ''}`),
        }))

        console.log(`    HOverflow=${dims.horizontalOverflow} viewport=${dims.clientWidth}px scrollW=${dims.scrollWidth}px`)
        if (dims.overflowElements.length > 0) {
          console.log(`    overflow elements: ${dims.overflowElements.join(', ')}`)
        }

        const path = join(OUT_DIR, `${vp.name}-${route.slug}.png`)
        await page.screenshot({ path, fullPage: true, type: 'png' })
      } catch (e) {
        console.warn(`    error: ${e.message}`)
      }
    }

    await ctx.close()
  }

  await browser.close()
  console.log(`\n=== Done — output in ${OUT_DIR} ===`)
}

main().catch((e) => { console.error('[fatal]', e); process.exit(1) })
