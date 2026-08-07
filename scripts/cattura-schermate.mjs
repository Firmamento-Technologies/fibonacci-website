#!/usr/bin/env node
/**
 * Cattura le schermate dell'applicazione per il sito.
 *
 * Punta allo STACK LOCALE, non alla produzione: le schermate del sito devono
 * mostrare l'interfaccia com'è oggi, e sull'ambiente locale si possono creare
 * dati finti verosimili senza toccare pazienti veri.
 *
 *   cd EMR/infra && docker compose up -d postgres valkey medplum-server
 *   cd EMR/apps/web && npm run dev
 *   node website/scripts/cattura-schermate.mjs
 *
 * Le credenziali arrivano da EMR/infra/.secrets/dev.env (gitignored). Non
 * vengono mai stampate.
 */

import { chromium } from 'playwright'
import { mkdir, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DEST = join(ROOT, 'public', 'schermate')
const SEGRETI = join(ROOT, '..', 'EMR', 'infra', '.secrets', 'dev.env')

const APP = process.env.APP_URL ?? 'http://localhost:5173'
const VIEWPORT = { width: 1440, height: 900 }
/** deviceScaleFactor 2: su schermo retina una schermata a 1x si vede sfocata. */
const SCALA = 2

async function credenziali() {
  const testo = await readFile(SEGRETI, 'utf8')
  const leggi = (chiave) => {
    const riga = testo.split('\n').find((r) => r.startsWith(`${chiave}=`))
    if (!riga) throw new Error(`manca ${chiave} in ${SEGRETI}`)
    return riga.slice(chiave.length + 1).trim().replace(/^["']|["']$/g, '')
  }
  return { email: leggi('LOCAL_MEDICO_EMAIL'), password: leggi('LOCAL_MEDICO_PASSWORD') }
}

async function accedi(page, { email, password }) {
  await page.goto(`${APP}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForSelector('input[type="email"], input#email', { timeout: 15000 })
  await page.fill('input[type="email"], input#email', email)
  await page.fill('input[type="password"], input#password', password)
  await page.locator('button[type="submit"]').first().click()
  // Non impongo la rotta di arrivo: a seconda dello stato dell'utente l'app
  // può mandare su /onboarding o sulla configurazione MFA, e un'attesa
  // troppo specifica fa fallire il capture senza dire perché.
  await page
    .waitForFunction(() => !location.pathname.startsWith('/login'), null, { timeout: 30000 })
    .catch(async () => {
      const errore = await page
        .locator('[role="alert"], .mantine-Alert-message, [data-testid="error"]')
        .first()
        .textContent()
        .catch(() => null)
      throw new Error(
        `l'accesso non ha lasciato /login${errore ? ` — messaggio a schermo: ${errore.trim()}` : ' e non c\'è nessun messaggio a schermo'}`,
      )
    })
  console.log(`[accesso] ok -> ${new URL(page.url()).pathname}`)
}

async function scatta(page, rotta, nome, { attesa = 1800, intera = false } = {}) {
  await page.goto(`${APP}${rotta}`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(attesa)
  // Il cursore lampeggiante e i tooltip al passaggio sporcano lo scatto.
  await page.mouse.move(0, 0)
  await page.screenshot({ path: join(DEST, `${nome}.png`), fullPage: intera, type: 'png' })
  console.log(`[scatto] ${nome}`)
}

async function main() {
  await mkdir(DEST, { recursive: true })
  const cred = await credenziali()

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALA,
    locale: 'it-IT',
    timezoneId: 'Europe/Rome',
    colorScheme: 'light',
    reducedMotion: 'reduce', // niente animazioni a metà nello scatto
  })
  const page = await context.newPage()

  try {
    await accedi(page, cred)

    await scatta(page, '/pazienti', 'elenco-pazienti')
    await scatta(page, '/dashboard', 'cruscotto')
    await scatta(page, '/appuntamenti', 'agenda')
    await scatta(page, '/consensi', 'catalogo-consensi')
    await scatta(page, '/audit', 'registro-accessi')
    await scatta(page, '/farmaci', 'farmaci')

    // La cartella della paziente vetrina: è la schermata dell'eroe, e deve
    // avere dentro una storia clinica vera (allergia, visite, trattamenti),
    // seminata da semina-dati-vetrina.mjs. Cerco lei per nome invece di
    // prendere il primo dell'elenco, che è ordinato e cambia.
    await page.goto(`${APP}/pazienti`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    const riga = page
      .locator('a[href^="/pazienti/"]:not([href$="/nuovo"])')
      .filter({ hasText: 'Bertini' })
      .first()
    if (!(await riga.count())) {
      throw new Error('paziente vetrina «Bertini» non in elenco: esegui semina-dati-vetrina.mjs')
    }
    const href = await riga.getAttribute('href')
    await scatta(page, href, 'cartella-paziente', { attesa: 2600 })
    await scatta(page, `${href}?tab=trattamenti`, 'trattamenti', { attesa: 2400 })
  } finally {
    await context.close()
    await browser.close()
  }
  console.log(`\nSchermate in ${DEST}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
