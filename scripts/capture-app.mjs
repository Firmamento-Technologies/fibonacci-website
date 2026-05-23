#!/usr/bin/env node
// Capture HD screenshot + video MP4 dei mockup specialty-aware dal sito Fibonacci.
// Pivot rispetto al piano iniziale: app live richiede OAuth code (fuori scope).
// Cattura invece i mockup React AppMockup gia renderizzati sul sito vetrina.

import { chromium } from 'playwright'
import { mkdir, readdir, rename } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SCREENSHOTS_DIR = join(ROOT, 'public', 'screenshots')
const VIDEOS_DIR = join(ROOT, 'public', 'videos')

const SITE_URL = 'https://firmamento-technologies.github.io/fibonacci-website'

const VIEWPORT = { width: 1440, height: 900 }
const DEVICE_SCALE_FACTOR = 2 // retina

const SPECIALTIES = ['estetica', 'dermatologia', 'ortopedia', 'psicologia', 'nutrizione', 'oculistica']

async function ensureDir(p) {
  await mkdir(p, { recursive: true })
}

async function shot(page, name, opts = {}) {
  const fullName = `${name}.png`
  const path = join(SCREENSHOTS_DIR, fullName)
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(opts.delay ?? 1000)
  await page.screenshot({ path, fullPage: opts.fullPage ?? false, type: 'png' })
  console.log(`[shot] ${name} -> ${path}`)
}

async function shotElement(page, selector, name) {
  const el = page.locator(selector).first()
  await el.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
  const path = join(SCREENSHOTS_DIR, `${name}.png`)
  await el.screenshot({ path, type: 'png' }).catch((e) => console.warn(`[shot-el] fail ${name}: ${e.message}`))
  console.log(`[shot-el] ${name} -> ${path}`)
}

async function main() {
  await ensureDir(SCREENSHOTS_DIR)
  await ensureDir(VIDEOS_DIR)

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    locale: 'it-IT',
    timezoneId: 'Europe/Rome',
    reducedMotion: 'reduce', // disabilita animazioni framer-motion per stabilita screenshot
  })
  const page = await ctx.newPage()

  // --- Home Hero (full + cropped mockup) ---
  console.log(`[nav] home`)
  await page.goto(`${SITE_URL}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await shot(page, 'home-hero', { delay: 500 })

  // --- 6 specialty pages: cattura full hero + zoom sul mockup AppMockup ---
  for (const slug of SPECIALTIES) {
    console.log(`[nav] specialita/${slug}`)
    await page.goto(`${SITE_URL}/specialita/${slug}/`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2500)

    // Screenshot hero intero della specialty page (above the fold)
    await shot(page, `specialty-${slug}-hero`, { delay: 500 })

    // Screenshot zoom sul mockup app (il container browser-frame rounded-2xl)
    // Il mockup è il primo div.rounded-2xl con shadow-2xl dentro la sezione Hero
    const mockup = page.locator('.shadow-2xl').first()
    if (await mockup.isVisible({ timeout: 4000 }).catch(() => false)) {
      const path = join(SCREENSHOTS_DIR, `mockup-${slug}.png`)
      await mockup.screenshot({ path, type: 'png' }).catch((e) =>
        console.warn(`[mockup-screenshot] ${slug}: ${e.message}`),
      )
      console.log(`[mockup] ${slug} -> ${path}`)
    }
  }

  await ctx.close()

  // --- Sessione 2: video MP4 con scrolling/navigation sul sito ---
  console.log(`[video] starting`)

  const flows = [
    {
      name: 'home-walkthrough',
      steps: async (page) => {
        await page.goto(`${SITE_URL}/`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(2500)
        await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }))
        await page.waitForTimeout(2000)
        await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'smooth' }))
        await page.waitForTimeout(2000)
        await page.evaluate(() => window.scrollTo({ top: 2400, behavior: 'smooth' }))
        await page.waitForTimeout(2000)
        await page.evaluate(() => window.scrollTo({ top: 3600, behavior: 'smooth' }))
        await page.waitForTimeout(2000)
      },
    },
    {
      name: 'specialty-tour',
      steps: async (page) => {
        for (const slug of ['estetica', 'dermatologia', 'ortopedia']) {
          await page.goto(`${SITE_URL}/specialita/${slug}/`, { waitUntil: 'networkidle' })
          await page.waitForTimeout(2500)
          await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'smooth' }))
          await page.waitForTimeout(1500)
        }
      },
    },
    {
      name: 'specialty-tour-2',
      steps: async (page) => {
        for (const slug of ['psicologia', 'nutrizione', 'oculistica']) {
          await page.goto(`${SITE_URL}/specialita/${slug}/`, { waitUntil: 'networkidle' })
          await page.waitForTimeout(2500)
          await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'smooth' }))
          await page.waitForTimeout(1500)
        }
      },
    },
  ]

  for (const flow of flows) {
    console.log(`[video] flow=${flow.name}`)
    const videoCtx = await browser.newContext({
      viewport: VIEWPORT,
      locale: 'it-IT',
      timezoneId: 'Europe/Rome',
      recordVideo: { dir: VIDEOS_DIR, size: VIEWPORT },
    })
    const videoPage = await videoCtx.newPage()
    try {
      await flow.steps(videoPage)
    } catch (e) {
      console.warn(`[video] error ${flow.name}: ${e.message}`)
    } finally {
      await videoPage.close()
      await videoCtx.close()
    }
  }

  // Rinomina i video webm
  const files = await readdir(VIDEOS_DIR)
  const webms = files.filter((f) => f.endsWith('.webm')).sort()
  for (let i = 0; i < webms.length && i < flows.length; i++) {
    const src = join(VIDEOS_DIR, webms[i])
    const dst = join(VIDEOS_DIR, `${flows[i].name}.webm`)
    if (src !== dst) {
      await rename(src, dst).catch((e) => console.warn(`[rename] ${e.message}`))
    }
  }

  await browser.close()
  console.log('[done]')
}

main().catch((e) => {
  console.error('[fatal]', e)
  process.exit(1)
})
