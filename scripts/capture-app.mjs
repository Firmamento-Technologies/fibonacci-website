#!/usr/bin/env node
// Capture screenshot + video MP4 dell'app live in UNA SOLA sessione browser
// per evitare rate limit /auth/login (10/IP/h). Login una volta, poi sequenza
// completa di navigazione che genera 1 video lungo + N screenshot inline.

import { chromium } from 'playwright'
import { mkdir, readdir, rename, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SCREENSHOTS_DIR = join(ROOT, 'public', 'screenshots', 'estetica')
const VIDEOS_DIR = join(ROOT, 'public', 'videos')

const APP_URL = 'https://82.25.101.118.nip.io'
const LOGIN_EMAIL = process.env.EMR_EMAIL ?? 'medico@studio.test'
const LOGIN_PASSWORD = process.env.EMR_PASSWORD ?? 'fYS9mBWK3-teH3sJm2wOyE7l'

const VIEWPORT = { width: 1440, height: 900 }

async function ensureDir(p) { await mkdir(p, { recursive: true }) }

async function loginWithRetry(page, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[login] attempt ${attempt}/${maxAttempts}`)
      await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 20000 })
      await page.waitForSelector('input#email', { timeout: 10000 })
      await page.fill('input#email', LOGIN_EMAIL)
      await page.fill('input#password', LOGIN_PASSWORD)
      await Promise.all([
        page.waitForURL(/\/(pazienti|appuntamenti|dashboard)/, { timeout: 25000 }),
        page.locator('button[type="submit"]').click(),
      ])
      console.log(`[login] OK -> ${page.url()}`)
      return
    } catch (e) {
      console.warn(`[login] attempt ${attempt} failed: ${e.message.split('\n')[0]}`)
      if (attempt === maxAttempts) throw e
      // backoff: aspetta 8-15s prima del prossimo tentativo (anche per evitare rate limit)
      await page.waitForTimeout(8000 + attempt * 2000)
    }
  }
}

async function shot(page, name, opts = {}) {
  const path = join(SCREENSHOTS_DIR, `${name}.png`)
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(opts.delay ?? 1200)
  await page.screenshot({ path, fullPage: opts.fullPage ?? false, type: 'png' })
  console.log(`[shot] ${name}`)
}

async function goShot(page, route, name, opts = {}) {
  console.log(`[nav] -> ${route}`)
  await page.goto(`${APP_URL}${route}`, { waitUntil: 'networkidle', timeout: 20000 }).catch((e) => {
    console.warn(`[nav] fail ${route}: ${e.message}`)
  })
  await page.waitForTimeout(opts.beforeShot ?? 1500)
  await shot(page, name, opts)
}

async function main() {
  await ensureDir(SCREENSHOTS_DIR)
  await ensureDir(VIDEOS_DIR)

  // Cleanup
  console.log('[cleanup]')
  await rm(SCREENSHOTS_DIR, { recursive: true, force: true })
  await ensureDir(SCREENSHOTS_DIR)
  // Rimuovi solo video binari, non altri asset
  for (const f of await readdir(VIDEOS_DIR).catch(() => [])) {
    if (/\.(webm|mp4|gif)$/.test(f)) await rm(join(VIDEOS_DIR, f)).catch(() => {})
  }

  const browser = await chromium.launch({ headless: true })

  // UNA sola sessione context con recordVideo
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // retina screenshots
    locale: 'it-IT',
    timezoneId: 'Europe/Rome',
    ignoreHTTPSErrors: true,
    recordVideo: { dir: VIDEOS_DIR, size: VIEWPORT },
  })
  const page = await ctx.newPage()

  try {
    await loginWithRetry(page, 3)
    await page.waitForTimeout(2500)

    // Step 1: lista pazienti (landing post-login)
    await shot(page, '01-pazienti-list', { delay: 2500 })

    // Step 2: apri primo paziente
    const firstPatient = page.locator('a[href*="/pazienti/"]:not([href$="/pazienti"]):not([href$="/pazienti/"])').first()
    if (await firstPatient.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('[nav] apertura primo paziente')
      await firstPatient.click()
      await page.waitForTimeout(2500)
      await shot(page, '02-paziente-detail')

      // Tab anamnesi
      for (const label of ['Anamnesi', 'anamnesi']) {
        const tab = page.locator(`a:has-text("${label}"), button:has-text("${label}"), [role="tab"]:has-text("${label}")`).first()
        if (await tab.isVisible({ timeout: 1500 }).catch(() => false)) {
          await tab.click()
          await page.waitForTimeout(2500)
          await shot(page, '03-anamnesi')
          break
        }
      }

      // Tab trattamenti / body-map
      for (const label of ['Trattamenti', 'Body map', 'Body-map']) {
        const tab = page.locator(`a:has-text("${label}"), button:has-text("${label}"), [role="tab"]:has-text("${label}")`).first()
        if (await tab.isVisible({ timeout: 1500 }).catch(() => false)) {
          await tab.click()
          await page.waitForTimeout(2500)
          await shot(page, '04-body-map-trattamenti')
          break
        }
      }

      // Tab consensi
      for (const label of ['Consensi', 'consensi']) {
        const tab = page.locator(`a:has-text("${label}"), button:has-text("${label}"), [role="tab"]:has-text("${label}")`).first()
        if (await tab.isVisible({ timeout: 1500 }).catch(() => false)) {
          await tab.click()
          await page.waitForTimeout(2500)
          await shot(page, '05-consensi')
          break
        }
      }
    } else {
      console.log('[note] nessun paziente — skip tab')
    }

    // Step 3: agenda
    await goShot(page, '/appuntamenti', '06-agenda', { beforeShot: 2500 })

    // Step 4: audit log
    await goShot(page, '/audit', '07-audit-log', { beforeShot: 2500 })

    // Step 5: impostazioni
    await goShot(page, '/impostazioni', '08-impostazioni', { beforeShot: 2500 })

    // Step 6: farmaci AIFA
    await goShot(page, '/farmaci', '09-farmaci-aifa', { beforeShot: 2500 })

    // Step 7: dashboard home
    await goShot(page, '/', '10-dashboard', { beforeShot: 2500 })

    // Pausa finale per il video
    await page.waitForTimeout(2000)
  } catch (e) {
    console.error(`[error] ${e.message}`)
    await shot(page, '99-error-state').catch(() => {})
  } finally {
    // CHIUDI page PRIMA del context per chiudere il video
    const videoPath = await page.video()?.path()
    await page.close()
    await ctx.close()
    if (videoPath) {
      // Rinomina il video con nome semantico
      const dst = join(VIDEOS_DIR, 'panoramica-app.webm')
      await rename(videoPath, dst).catch((e) => console.warn(`[rename] ${e.message}`))
      console.log(`[video] -> ${dst}`)
    }
  }

  await browser.close()
  console.log('[done]')
}

main().catch((e) => { console.error('[fatal]', e); process.exit(1) })
