#!/usr/bin/env node
// Capture screenshot + video MP4 dell'app live medicina estetica via Playwright.
// Usa account medico1 (senza MFA) per attraversare il flow OAuth Medplum completo:
//   startLogin -> code -> processCode -> navigate('/pazienti')
// Output: public/screenshots/estetica/*.png e public/videos/*.webm + MP4/GIF conversion

import { chromium } from 'playwright'
import { mkdir, readdir, rename, rm } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SCREENSHOTS_DIR = join(ROOT, 'public', 'screenshots', 'estetica')
const VIDEOS_DIR = join(ROOT, 'public', 'videos')

const APP_URL = 'https://82.25.101.118.nip.io'
// medico1 e' un account dev SENZA MFA — necessario per l'automation
const LOGIN_EMAIL = process.env.EMR_EMAIL ?? 'medico1@emr-estetica.local'
const LOGIN_PASSWORD = process.env.EMR_PASSWORD ?? 'aYo1AreVEsO7Iarm8NF5QeuyZRZNhYY'

const VIEWPORT = { width: 1440, height: 900 }
const DEVICE_SCALE_FACTOR = 2

async function ensureDir(p) { await mkdir(p, { recursive: true }) }

async function login(page) {
  console.log(`[login] -> ${APP_URL}/login`)
  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle', timeout: 20000 })

  await page.fill('input#email', LOGIN_EMAIL)
  await page.fill('input#password', LOGIN_PASSWORD)
  console.log(`[login] submitting credentials for ${LOGIN_EMAIL}`)

  // Submit + wait for navigation to /pazienti (success path)
  await Promise.all([
    page.waitForURL(/\/pazienti/, { timeout: 20000 }).catch((e) => {
      throw new Error(`login non ha portato a /pazienti: ${e.message}`)
    }),
    page.locator('button[type="submit"]').click(),
  ])

  console.log(`[login] OK url=${page.url()}`)
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
  await page.waitForTimeout(1500)
}

async function shot(page, name, opts = {}) {
  const path = join(SCREENSHOTS_DIR, `${name}.png`)
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(opts.delay ?? 1000)
  await page.screenshot({ path, fullPage: opts.fullPage ?? false, type: 'png' })
  console.log(`[shot] ${name}`)
}

async function goShot(page, route, name, opts = {}) {
  console.log(`[nav] -> ${route}`)
  await page.goto(`${APP_URL}${route}`, { waitUntil: 'networkidle', timeout: 20000 }).catch((e) => {
    console.warn(`[nav] fail ${route}: ${e.message}`)
  })
  await page.waitForTimeout(1200)
  await shot(page, name, opts)
}

async function main() {
  await ensureDir(SCREENSHOTS_DIR)
  await ensureDir(VIDEOS_DIR)

  // Clean vecchie catture (sostituiamo con quelle dell'APP vera)
  console.log('[cleanup] rm vecchi screenshots/videos di test')
  await rm(SCREENSHOTS_DIR, { recursive: true, force: true })
  await ensureDir(SCREENSHOTS_DIR)

  const browser = await chromium.launch({ headless: true })

  // --- Sessione 1: screenshot ---
  const ctxShot = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    locale: 'it-IT',
    timezoneId: 'Europe/Rome',
    ignoreHTTPSErrors: true,
  })
  const page = await ctxShot.newPage()

  try {
    await login(page)
    // /pazienti landing (lista pazienti)
    await shot(page, '01-pazienti-list')

    // Apri primo paziente per dettaglio
    const firstPatientLink = page.locator('a[href*="/pazienti/"]:not([href$="/pazienti"]):not([href$="/pazienti/"])').first()
    const hasFirst = await firstPatientLink.isVisible({ timeout: 4000 }).catch(() => false)
    if (hasFirst) {
      await firstPatientLink.click()
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      await page.waitForTimeout(1500)
      await shot(page, '02-paziente-detail')

      // Tab anamnesi
      const anamnesiTab = page.locator('a:has-text("Anamnesi"), button:has-text("Anamnesi"), [role="tab"]:has-text("Anamnesi")').first()
      if (await anamnesiTab.isVisible({ timeout: 2500 }).catch(() => false)) {
        await anamnesiTab.click()
        await page.waitForTimeout(1500)
        await shot(page, '03-anamnesi')
      }

      // Tab trattamenti / body-map
      for (const label of ['Trattamenti', 'Body map', 'Body-map']) {
        const tab = page.locator(`a:has-text("${label}"), button:has-text("${label}"), [role="tab"]:has-text("${label}")`).first()
        if (await tab.isVisible({ timeout: 1500 }).catch(() => false)) {
          await tab.click()
          await page.waitForTimeout(1500)
          await shot(page, '04-body-map-trattamenti')
          break
        }
      }

      // Tab consensi
      const consensiTab = page.locator('a:has-text("Consensi"), button:has-text("Consensi"), [role="tab"]:has-text("Consensi")').first()
      if (await consensiTab.isVisible({ timeout: 1500 }).catch(() => false)) {
        await consensiTab.click()
        await page.waitForTimeout(1500)
        await shot(page, '05-consensi')
      }
    } else {
      console.log('[note] nessun paziente trovato, skip detail screenshots')
    }

    // Agenda
    await goShot(page, '/appuntamenti', '06-agenda')

    // Audit log
    await goShot(page, '/audit', '07-audit-log')

    // Impostazioni
    await goShot(page, '/impostazioni', '08-impostazioni')

    // Farmaci AIFA catalog
    await goShot(page, '/farmaci', '09-farmaci-aifa')

    // Dashboard / Home post-login
    await goShot(page, '/', '10-dashboard')
  } catch (e) {
    console.error(`[error] capture failed: ${e.message}`)
    await shot(page, '99-error-state').catch(() => {})
  } finally {
    await ctxShot.close()
  }

  // --- Sessione 2: video MP4 dei flussi reali nell'app ---
  console.log(`[video] starting flows on real app`)
  // Clean vecchi webm (sostituiamo con video real-app)
  const existingFiles = await readdir(VIDEOS_DIR).catch(() => [])
  for (const f of existingFiles) {
    if (f.endsWith('.webm') || f.endsWith('.mp4') || f.endsWith('.gif')) {
      await rm(join(VIDEOS_DIR, f)).catch(() => {})
    }
  }

  const flows = [
    {
      name: 'panoramica-app',
      description: 'Tour generale: pazienti -> agenda -> audit -> impostazioni',
      steps: async (page) => {
        await login(page)
        await page.waitForTimeout(2500)
        await page.goto(`${APP_URL}/pazienti`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(3000)
        await page.goto(`${APP_URL}/appuntamenti`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(3000)
        await page.goto(`${APP_URL}/audit`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(3000)
        await page.goto(`${APP_URL}/impostazioni`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(3000)
      },
    },
    {
      name: 'navigazione-paziente',
      description: 'Apertura paziente e navigazione tra tab cartella',
      steps: async (page) => {
        await login(page)
        await page.goto(`${APP_URL}/pazienti`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(2000)
        const link = page.locator('a[href*="/pazienti/"]:not([href$="/pazienti"]):not([href$="/pazienti/"])').first()
        if (await link.isVisible().catch(() => false)) {
          await link.click()
          await page.waitForTimeout(3000)
          for (const label of ['Anamnesi', 'Trattamenti', 'Body map', 'Consensi']) {
            const t = page.locator(`a:has-text("${label}"), button:has-text("${label}"), [role="tab"]:has-text("${label}")`).first()
            if (await t.isVisible({ timeout: 1500 }).catch(() => false)) {
              await t.click()
              await page.waitForTimeout(2500)
            }
          }
        }
      },
    },
    {
      name: 'agenda-audit',
      description: 'Agenda appuntamenti + audit log',
      steps: async (page) => {
        await login(page)
        await page.goto(`${APP_URL}/appuntamenti`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(3000)
        await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }))
        await page.waitForTimeout(2500)
        await page.goto(`${APP_URL}/audit`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(3000)
        await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }))
        await page.waitForTimeout(2500)
      },
    },
  ]

  const flowVideoMap = new Map() // key = webm path letto, value = target name

  for (const flow of flows) {
    console.log(`[video] flow=${flow.name}`)
    const videoCtx = await browser.newContext({
      viewport: VIEWPORT,
      locale: 'it-IT',
      timezoneId: 'Europe/Rome',
      ignoreHTTPSErrors: true,
      recordVideo: { dir: VIDEOS_DIR, size: VIEWPORT },
    })
    const videoPage = await videoCtx.newPage()
    try {
      await flow.steps(videoPage)
    } catch (e) {
      console.warn(`[video] ${flow.name} error: ${e.message}`)
    } finally {
      const videoPath = await videoPage.video()?.path()
      await videoPage.close()
      await videoCtx.close()
      if (videoPath) flowVideoMap.set(videoPath, flow.name)
    }
  }

  // Rinomina webm
  for (const [src, targetName] of flowVideoMap.entries()) {
    const dst = join(VIDEOS_DIR, `${targetName}.webm`)
    if (src !== dst) await rename(src, dst).catch((e) => console.warn(`[rename] ${e.message}`))
  }

  await browser.close()
  console.log('[done]')
}

main().catch((e) => { console.error('[fatal]', e); process.exit(1) })
