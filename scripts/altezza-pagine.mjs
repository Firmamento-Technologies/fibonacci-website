#!/usr/bin/env node
/**
 * Quanto è alta ogni pagina, in schermate.
 *
 * ⚠️ PERCHÉ ESISTE. «Diverse pagine non stanno dentro una schermata» era un
 * rilievo a occhio (utente, 2026-08-11) — vero, ma senza un numero non si sa
 * quali, né se una modifica migliora o peggiora. Questo lo misura, e stampa
 * anche **dove finisce il primo contenuto utile**: su una pagina di listino la
 * cosa che deve stare sopra la piega sono i prezzi, non il titolo.
 *
 * ⛔ NON è un cancello che fallisce: le pagine legali (privacy, DPA, termini)
 * sono testi integrali e devono essere lunghe — un presidio che le bocciasse
 * sarebbe rosso per sempre, e un rosso permanente non porta informazione.
 * Stampa e basta: serve a decidere, non a bloccare.
 *
 * USO:  node scripts/altezza-pagine.mjs [url]
 * Prerequisito: `out/` servito (o il sito vero).
 */
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:3210'
const VIEWPORT = { width: 1440, height: 900 }

/* Le pagine "di vendita": quelle per cui la lunghezza è una scelta, non un
 * obbligo. ⛔ Fuori le legali e le guide: lì il testo integrale è il punto. */
const PAGINE = [
  '/', '/prezzi', '/come-funziona', '/consensi-informati', '/sicurezza-e-dati',
  '/integrazioni', '/domande', '/chi-siamo', '/intelligenza-artificiale',
  '/che-software-serve', '/autovalutazione', '/verifica', '/richiedi-una-demo',
  '/per-le-societa-scientifiche',
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: VIEWPORT })
const righe = []

for (const u of PAGINE) {
  await page.goto(BASE + u, { waitUntil: 'networkidle' })
  const m = await page.evaluate(() => {
    const main = document.querySelector('main')
    const prima = main?.querySelector('section, div')
    return {
      altezza: document.body.scrollHeight,
      finePrimaSezione: prima ? Math.round(prima.getBoundingClientRect().bottom + window.scrollY) : null,
    }
  })
  righe.push({ u, ...m, schermate: +(m.altezza / VIEWPORT.height).toFixed(1) })
}
await browser.close()

righe.sort((a, b) => b.schermate - a.schermate)
console.log(`Altezze a ${VIEWPORT.width}×${VIEWPORT.height}\n`)
console.log('  schermate   altezza   1ª sez.  pagina')
for (const r of righe) {
  const bandiera = r.schermate > 4 ? '  ⚠️' : ''
  console.log(
    `  ${String(r.schermate).padStart(6)}   ${String(r.altezza).padStart(7)}   ${String(r.finePrimaSezione ?? '—').padStart(7)}  ${r.u}${bandiera}`,
  )
}
const oltre = righe.filter((r) => r.schermate > 4)
console.log(`\n${oltre.length} pagine oltre le 4 schermate${oltre.length ? ': ' + oltre.map((r) => r.u).join(', ') : ''}`)
