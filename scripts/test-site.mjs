#!/usr/bin/env node
// Test E2E del sito live con Playwright.
// Verifica: HTTP status 200 di tutte le route, video player carica risorse,
// link interni cliccabili senza 404, console errors.

import { chromium } from 'playwright'

const BASE = 'https://firmamento-technologies.github.io/fibonacci-website'

const ROUTES = [
  '/',
  '/faq/',
  '/chi-siamo/',
  '/specialita/estetica/',
  '/specialita/dermatologia/',
  '/specialita/ortopedia/',
  '/specialita/psicologia/',
  '/specialita/nutrizione/',
  '/specialita/oculistica/',
  '/privacy/',
  '/cookie/',
  '/dpa/',
  '/termini/',
  '/sicurezza/',
  '/sub-responsabili/',
  '/docs/',
  '/docs/installazione/',
  '/docs/anagrafica-paziente/',
  '/docs/anamnesi-dettatura/',
  '/docs/body-map/',
  '/docs/consensi-sicpre/',
  '/docs/agenda-appuntamenti/',
  '/docs/audit-log/',
  '/tutorial/',
  '/tutorial/panoramica/',
  '/tutorial/prima-visita/',
  '/tutorial/body-map-consenso/',
]

const results = { ok: [], failed: [], consoleErrors: [], video: {}, brokenLinks: [] }

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'it-IT',
    ignoreHTTPSErrors: true,
  })
  const page = await ctx.newPage()

  // Capture console errors
  page.on('pageerror', (err) => {
    results.consoleErrors.push(`pageerror: ${err.message}`)
  })
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(`console: ${msg.text()}`)
    }
  })

  // 1. Verifica HTTP status di ogni route
  console.log('=== 1/3 HTTP status check ===')
  for (const route of ROUTES) {
    const url = `${BASE}${route}`
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch((e) => null)
    const status = resp?.status() ?? 0
    if (status >= 200 && status < 300) {
      results.ok.push(route)
      process.stdout.write(`  OK ${status}  ${route}\n`)
    } else {
      results.failed.push({ route, status })
      process.stdout.write(`  FAIL ${status}  ${route}\n`)
    }
  }

  // 2. Verifica video player su /tutorial/
  console.log('\n=== 2/3 Video player check su /tutorial/ ===')
  await page.goto(`${BASE}/tutorial/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  const videos = await page.locator('video').all()
  console.log(`  trovati ${videos.length} <video> elements`)
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i]
    const sources = await v.locator('source').all()
    for (const src of sources) {
      const url = await src.getAttribute('src')
      const type = await src.getAttribute('type')
      const fullUrl = url.startsWith('http') ? url : `https://firmamento-technologies.github.io${url}`
      const resp = await page.request.head(fullUrl).catch(() => null)
      const status = resp?.status() ?? 0
      const ok = status >= 200 && status < 300
      results.video[`video${i + 1}-${type}`] = { url, status, ok }
      console.log(`  video${i + 1} ${type} -> ${status} ${ok ? 'OK' : 'FAIL'} ${url}`)
    }
  }

  // 3. Verifica link "Vedi anche" su /docs/audit-log/ (era il caso reportato)
  console.log('\n=== 3/3 Link "Vedi anche" check ===')
  await page.goto(`${BASE}/docs/audit-log/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  // Trova la sezione "Vedi anche" e clicca ogni link
  const headings = await page.locator('h2:has-text("Vedi anche")').all()
  if (headings.length === 0) {
    console.log('  warn: h2 "Vedi anche" non trovato')
  } else {
    // Prendi i link successivi al h2
    const links = await page.locator('h2:has-text("Vedi anche") ~ ul a, h2:has-text("Vedi anche") + ul a').all()
    console.log(`  trovati ${links.length} link in "Vedi anche"`)
    for (const link of links) {
      const href = await link.getAttribute('href')
      const text = (await link.textContent()).trim().substring(0, 50)
      const fullUrl = href.startsWith('http') ? href : `https://firmamento-technologies.github.io${href}`
      const resp = await page.request.head(fullUrl).catch(() => null)
      const status = resp?.status() ?? 0
      const ok = status >= 200 && status < 300
      if (!ok) results.brokenLinks.push({ href, text, status })
      console.log(`  ${ok ? 'OK' : 'FAIL'} ${status} ${href} (${text})`)
    }
  }

  // 4. Verifica errori console accumulati
  console.log('\n=== Console errors accumulated ===')
  if (results.consoleErrors.length === 0) {
    console.log('  nessun errore')
  } else {
    results.consoleErrors.forEach((e) => console.log(`  ${e}`))
  }

  await browser.close()

  console.log('\n=== SUMMARY ===')
  console.log(`Routes: ${results.ok.length}/${ROUTES.length} OK, ${results.failed.length} FAIL`)
  console.log(`Video sources: ${Object.values(results.video).filter((v) => v.ok).length}/${Object.keys(results.video).length} OK`)
  console.log(`Broken links: ${results.brokenLinks.length}`)
  console.log(`Console errors: ${results.consoleErrors.length}`)

  const exitCode = results.failed.length > 0 || results.brokenLinks.length > 0 || Object.values(results.video).some((v) => !v.ok) ? 1 : 0
  process.exit(exitCode)
}

main().catch((e) => {
  console.error('[fatal]', e)
  process.exit(1)
})
