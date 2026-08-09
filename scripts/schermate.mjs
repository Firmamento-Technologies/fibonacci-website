/**
 * Rigenera le schermate del prodotto che il sito pubblica.
 *
 * ⚠️ PERCHÉ ESISTE, e perché non basta rifarle a mano una volta ogni tanto.
 * Il 2026-08-09 l'analisi UI ha trovato che l'immagine dell'hero — pubblicata
 * sotto la didascalia «Schermata dall'applicazione, non un disegno» — mostrava
 * **due banner di allergia sovrapposti**, cioè un difetto che il prodotto aveva
 * già corretto, più la cartella a 11 voci al posto delle 5 e le icone ✨ in
 * colonna che erano state tolte. E `trattamenti.png` era **lo stesso file** di
 * `cartella-paziente.png` (stesso SHA-256), usato come due passi diversi di
 * `/come-funziona`: il passo che promette «Dove, quanto, con che lotto» era
 * illustrato da una schermata senza prodotti né lotti.
 *
 * Quelle immagini erano già state rifatte a mano il 6 agosto **proprio perché
 * scadute**, ed erano riscadute in 48 ore. Quindi il rimedio non è rifarle: è
 * che smettano di essere un gesto manuale. Questo script le prende
 * dall'applicazione vera, e scrive accanto un manifesto con il commit dell'EMR
 * da cui vengono — così `collaudo.mjs` può dire quando sono invecchiate.
 * ([[sintesi-analisi-ui-ux-2026-08-09]] §S1, §S2, §S4)
 *
 * Emette anche le MISURE: erano PNG da 2880 px serviti per 544 (5,3×) e per
 * 346 su telefono (8,3×), 351 KB in `fetchpriority=high`. Con l'export statico
 * `next/image` non ottimizza niente a runtime, quindi le varianti si fanno qui,
 * in build, e il componente `<Schermata>` le serve con `srcset`.
 *
 * USO:  node scripts/schermate.mjs
 * Prerequisito: l'EMR in esecuzione su :4173 (build di produzione) con `/demo`
 * accesa. Non digita credenziali: entra dalla porta pubblica della demo.
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const RADICE = join(QUI, '..')
const USCITA = join(RADICE, 'public/schermate')
const EMR = process.env.EMR_URL ?? 'http://localhost:4173'

/** Le larghezze servite. Coprono 1× e 2× dei tre riquadri in cui compaiono:
 *  346 px (telefono), 544 px (hero desktop), 664 px (/come-funziona). */
const LARGHEZZE = [720, 1120, 1400]

/** Le cinque schermate, e COME si arriva a ciascuna. */
const SCHERMATE = [
  {
    nome: 'agenda',
    vai: async (p) => { await p.goto(`${EMR}/appuntamenti`); await p.waitForTimeout(2500) },
  },
  {
    nome: 'cartella-paziente',
    vai: async (p) => { await apriPaziente(p); await p.waitForTimeout(1500) },
  },
  {
    // ⚠️ La schermata che PRIMA era un duplicato: qui si apre davvero la
    // scheda «Cure», che è dove stanno prodotto, unità e lotto — cioè la cosa
    // che il passo delle 09:35 di /come-funziona promette.
    nome: 'trattamenti',
    vai: async (p) => {
      await apriPaziente(p)
      await p.getByRole('tab', { name: /Cure/i }).click()
      await p.waitForTimeout(2000)
      // Porta in vista l'elenco dei trattamenti, non il riepilogo delle visite.
      await p.evaluate(() => {
        const t = [...document.querySelectorAll('h3,h2')].find((h) => /Trattamenti/i.test(h.textContent ?? ''))
        t?.scrollIntoView({ block: 'start' })
      })
      await p.waitForTimeout(900)
    },
  },
  {
    nome: 'catalogo-consensi',
    vai: async (p) => { await p.goto(`${EMR}/consensi`); await p.waitForTimeout(2000) },
  },
  {
    nome: 'registro-accessi',
    vai: async (p) => { await p.goto(`${EMR}/audit`); await p.waitForTimeout(2000) },
  },
]

async function apriPaziente(p) {
  await p.goto(`${EMR}/pazienti`, { waitUntil: 'networkidle' })
  // Il paziente con la storia clinica piena, non il primo che capita.
  const riga = p.getByRole('link', { name: 'Bertini Laura' })
  await riga.waitFor({ timeout: 15000 })
  await riga.click()
  await p.waitForTimeout(1200)
}

/** Entra dalla demo e chiude il tour, che altrimenti finisce nelle schermate. */
async function entra(p) {
  await p.goto(`${EMR}/demo`, { waitUntil: 'networkidle' })
  await p.waitForURL(/\/pazienti/, { timeout: 30000 })
  for (let i = 0; i < 40; i++) {
    if (await p.evaluate(() => document.body.innerText.includes('ASSISTENTE AI'))) break
    await p.waitForTimeout(100)
  }
  await p.keyboard.press('Escape')
  await p.waitForTimeout(500)
}

/**
 * Il commit che ha toccato per ultimo **il frontend** dell'EMR — non HEAD.
 *
 * ⚠️ La differenza non è pedanteria. Il primo tentativo registrava `HEAD`, e il
 * collaudo è diventato rosso appena un'altra sessione ha committato quattro
 * correzioni al `pdf-signer`: schermate identiche, presidio rosso. Un presidio
 * che si lamenta di cose che non cambiano l'immagine viene spento, e con lui se
 * ne va anche la segnalazione vera. Si àncora a `apps/web/src`, che è l'unica
 * cosa che può cambiare come appare l'applicazione.
 */
function commitFrontendEmr() {
  for (const dir of [join(RADICE, '../EMR'), process.env.EMR_REPO]) {
    if (!dir || !existsSync(dir)) continue
    try {
      return execFileSync('git', ['-C', dir, 'log', '-1', '--format=%H', '--', 'apps/web/src'], {
        encoding: 'utf8',
      }).trim()
    } catch { /* non è un repo: si tira avanti senza */ }
  }
  return null
}

const browser = await chromium.launch()
// deviceScaleFactor 2: si cattura in alta risoluzione una volta sola, poi si
// scala. Ricatturare a ogni misura cambierebbe l'impaginazione dell'app.
const ctx = await browser.newContext({ viewport: { width: 1400, height: 875 }, deviceScaleFactor: 2, locale: 'it-IT' })
const page = await ctx.newPage()

console.log(`→ entro nella demo su ${EMR}`)
await entra(page)

mkdirSync(USCITA, { recursive: true })
const manifesto = { generato: new Date().toISOString(), commitFrontendEmr: commitFrontendEmr(), larghezze: LARGHEZZE, schermate: {} }

for (const s of SCHERMATE) {
  await s.vai(page)
  const grezza = await page.screenshot()
  const meta = await sharp(grezza).metadata()
  const varianti = []
  for (const w of LARGHEZZE) {
    const base = sharp(grezza).resize({ width: w, withoutEnlargement: true })
    // ⛔ Niente PNG per ogni larghezza: servirebbero a un browser che conosce
    // né AVIF né WebP, cioè a nessuno dal 2020 in poi. Quindici file per un
    // caso che non esiste sono peso nel repository e niente altro. Resta UN
    // solo PNG per schermata, come ripiego finale.
    const webp = await base.clone().webp({ quality: 82 }).toBuffer()
    const avif = await base.clone().avif({ quality: 55 }).toBuffer()
    writeFileSync(join(USCITA, `${s.nome}-${w}.webp`), webp)
    writeFileSync(join(USCITA, `${s.nome}-${w}.avif`), avif)
    varianti.push({ w, webp: webp.length, avif: avif.length })
  }
  // Il PNG storico resta, come ripiego per chi non ha nessuno dei due formati.
  writeFileSync(join(USCITA, `${s.nome}.png`), await sharp(grezza).resize({ width: LARGHEZZE.at(-1) }).png({ compressionLevel: 9 }).toBuffer())
  manifesto.schermate[s.nome] = { sorgente: `${meta.width}×${meta.height}`, varianti }
  const kb = (n) => Math.round(n / 1024) + ' KB'
  console.log(`  ✓ ${s.nome.padEnd(20)} ${varianti.map((v) => `${v.w}px avif ${kb(v.avif)}`).join(' · ')}`)
}

writeFileSync(join(USCITA, 'manifesto.json'), JSON.stringify(manifesto, null, 2) + '\n')
// Le vecchie varianti non più prodotte non restano a occupare posto.
for (const morto of ['farmaci.png']) {
  const f = join(USCITA, morto)
  if (existsSync(f)) { rmSync(f); console.log(`  🗑  rimossa ${morto} (non referenziata da nessuna pagina)`) }
}

await browser.close()
console.log(`\n✓ manifesto scritto · commit EMR: ${manifesto.commitFrontendEmr?.slice(0, 8) ?? '(sconosciuto)'}`)
