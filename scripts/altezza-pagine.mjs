#!/usr/bin/env node
/**
 * Ogni TAPPA sta in una schermata?
 *
 * ⚠️ PERCHÉ È CAMBIATO. Fino all'11 agosto misurava l'altezza della PAGINA, ed
 * era la domanda giusta finché una pagina era una schermata sola. Ora il sito è
 * un percorso: una pagina lunga è **normale** (la home ha undici tappe, quindi
 * undici schermate), e la cosa che può rompersi è un'altra — che una singola
 * tappa sfori, e la V per proseguire finisca sotto il bordo. Chi scorre non la
 * vede, non sa che c'è un seguito, ed esce.
 *
 * Misurare ancora la pagina intera avrebbe dato **rosso su tutto** per una
 * ragione voluta: un presidio sempre rosso viene spento, e sarebbe stato il
 * terzo presidio perso allo stesso modo.
 *
 * ⛔ Non è la stessa cosa di «il contenuto è tagliato»: le tappe hanno
 * `min-height`, quindi una tappa lunga si scorre e si legge tutta. Il difetto è
 * che la freccia sparisce dalla vista, non che il testo sparisca.
 *
 * TOLLERANZA. Una tappa può arrivare al 108% della schermata: sotto quella
 * soglia la V resta agganciabile con un filo di scorrimento e comprimere il
 * contenuto costerebbe più di quanto rende. Sopra, è un difetto.
 *
 * USO:  node scripts/altezza-pagine.mjs [url]
 * Esce 1 se una tappa sfora ⇒ è un cancello, e sta in `collaudo.mjs`.
 */
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
import { esigiStile } from './lib/stile-caricato.mjs'

/* ⚠️ CRICCA, NON SOGLIA. Sei tappe superano il 108% per ragioni scritte una a
 * una in `tappe-alte.json` (il questionario è un gesto solo, i tre piani si
 * confrontano affiancati…). Un cancello assoluto sarebbe rosso dal primo
 * giorno, e in questo progetto un presidio sempre rosso è già stato spento due
 * volte. Da qui il numero può solo scendere: una tappa NUOVA che sfora è rossa,
 * una vecchia che rientra va tolta dal file. */
const CRICCA = JSON.parse(readFileSync(new URL('./tappe-alte.json', import.meta.url), 'utf8'))

const TOLLERATE = new Set(
  CRICCA.tollerate.map((t) => `${t.pagina}#${t.tappa}`),
)

const BASE = process.argv[2] ?? 'http://localhost:3210'
const VIEWPORT = { width: 1440, height: 900 }
/* L'intestazione è `sticky`: lo spazio davvero disponibile è la finestra meno
   la sua altezza. È lo stesso numero di `--h-intestazione` in `globals.css`. */
const UTILE = VIEWPORT.height - 91
/* ⚠️ ERA 1.08, ED ERA SBAGLIATA. «Un filo di scorrimento e la V si aggancia»
   suonava ragionevole finché non l'ho guardata: la prima schermata della home
   misurava 844px su 809 utili — dentro l'8% — e la V stava **35px sotto il
   bordo**, cioè invisibile senza scorrere. Ma la V serve proprio a dire che
   c'è un seguito: se non si vede, non esiste.
   L'intestazione è `sticky` e copre sempre i primi 91px ⇒ il conto è secco:
   una tappa alta più di `finestra − 91` manda la freccia fuori campo. Nessuna
   tolleranza da dare. */
const TOLLERANZA = 1.0

/* Le pagine del percorso più quelle di vendita fuori percorso. ⛔ Fuori le
 * legali e le guide: sono testi integrali, non hanno tappe e non devono averle. */
const PAGINE = [
  '/', '/prezzi', '/come-funziona', '/consensi-informati', '/sicurezza-e-dati',
  '/integrazioni', '/domande', '/chi-siamo', '/intelligenza-artificiale',
  '/che-software-serve', '/autovalutazione', '/verifica', '/richiedi-una-demo',
  '/per-le-societa-scientifiche',
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: VIEWPORT })
const sforate = []
const tollerate = []
const vuote = []
const perPagina = []

for (const u of PAGINE) {
  await page.goto(BASE + u, { waitUntil: 'networkidle' })
  await esigiStile(page, 'altezza-pagine')
  /* `Reveal` monta il contenuto quando entra in vista: senza scorrere fino in
     fondo le ultime tappe misurerebbero l'altezza del loro guscio vuoto, cioè
     un verde falso. Si scorre, si torna su, poi si misura. */
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => requestAnimationFrame(r))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(250)

  const tappe = await page.evaluate(() =>
    [...document.querySelectorAll('.tappa')].map((t) => {
      /* Il testo della tappa TOLTA la freccia: la freccia c'è sempre, quindi
         guardare `textContent` direbbe «piena» anche su una tappa vuota. */
      const corpo = [...t.children].filter((c) => !c.classList.contains('freccia-avanti'))
      return {
        id: t.id,
        altezza: Math.round(t.getBoundingClientRect().height),
        /* Il titolo della tappa, per dire QUALE sfora senza contare a mano. */
        titolo: (t.querySelector('h1, h2, h3')?.textContent ?? '').trim().slice(0, 46),
        caratteri: corpo.map((c) => c.textContent ?? '').join('').replace(/\s+/g, ' ').trim().length,
      }
    }),
  )
  perPagina.push({ u, tappe })
  for (const t of tappe) {
    if (t.altezza > UTILE * TOLLERANZA) {
      const chiave = `${u}#${t.id}`
      ;(TOLLERATE.has(chiave) ? tollerate : sforate).push({ u, ...t, quote: t.altezza / UTILE })
      TOLLERATE.delete(chiave)
    }
    /* Una tappa vuota è una schermata bianca in mezzo al percorso, con in
       fondo una freccia. È successo su `/domande`, dove il JSON-LD dello
       schema FAQ era finito fra i figli. Vedi il filtro in `Tappe.tsx`. */
    if (t.caratteri < 40) vuote.push({ u, ...t })
  }
}
/* ── E SUL TELEFONO ──────────────────────────────────────────────────────────
   ⚠️ QUI SI MISURA UNA COSA DIVERSA, E IL PERCHÉ È UN FATTO DI ARITMETICA.
   375×721 offre **3,8 volte meno area** di 1264×809. Lo stesso contenuto, con
   le colonne impilate, fa 1,5-3 schermate: farlo stare vorrebbe dire togliere
   parole o rimpicciolire il testo, e non si fa né l'una né l'altra cosa.
   Misurato: tre leve (figure a 30vh, stacchi ridotti, interlinea al tetto di
   Butterick) hanno portato le tappe fuori misura da **38 a 37**. Non è poco
   lavoro mal fatto: è che il conto non torna.

   ⇒ Il difetto che l'altezza misurava non è «la tappa è alta», è **la V
   finisce fuori campo**. Su telefono la V è agganciata al fondo della finestra
   (vedi `globals.css`), quindi il difetto si misura direttamente: si scorre la
   pagina e da OGNI posizione ci dev'essere una V visibile. Questo è il
   cancello. L'altezza resta come **cricca**, per non perdere il guadagno.

   ⛔ Non sostituire questo controllo con quello dell'altezza «così è uguale»:
   uno è ottenibile e l'altro no, e un cancello non ottenibile viene spento. */
const TEL = { width: 375, height: 812 }
const UTILE_TEL = TEL.height - 91
const telefono = await browser.newPage({ viewport: TEL, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
let oltreTel = 0
const senzaV = []
for (const u of PAGINE) {
  await telefono.goto(BASE + u, { waitUntil: 'networkidle' })
  await telefono.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => requestAnimationFrame(r))
    }
    window.scrollTo(0, 0)
  })
  await telefono.waitForTimeout(200)
  oltreTel += await telefono.evaluate(
    (utile) => [...document.querySelectorAll('.tappa')].filter((t) => t.getBoundingClientRect().height > utile * 1.02).length,
    UTILE_TEL,
  )

  /* ⚠️ SI SCORRE DAVVERO, non si simula. La prima versione calcolava
     `top + window.scrollY` da fermo e chiedeva se la V sarebbe stata in vista:
     ma per un elemento `sticky` quella è la posizione **non agganciata**,
     cioè esattamente ciò che l'aggancio serve a cambiare. Il controllo
     ri-misurava l'altezza travestita da controllo sulla V, e infatti dava
     rosso sulle stesse pagine. Un `getBoundingClientRect()` su uno sticky
     vale solo alla posizione in cui lo si legge.
     ⛔ L'ultima tappa del percorso non ha una V: lì finisce, ed è giusto. */
  const finePercorso = await telefono.evaluate(() => {
    const tappe = [...document.querySelectorAll('.tappa')]
    const ultima = tappe[tappe.length - 1]
    return ultima && !ultima.querySelector('.freccia-avanti')
      ? ultima.getBoundingClientRect().top + window.scrollY
      : Infinity
  })
  const altezzaDoc = await telefono.evaluate(() => document.body.scrollHeight)
  const buchi = []
  for (let y = 0; y + TEL.height < altezzaDoc && y + TEL.height < finePercorso; y += 300) {
    await telefono.evaluate((y) => window.scrollTo(0, y), y)
    await telefono.waitForTimeout(60)
    const vista = await telefono.evaluate(
      () =>
        [...document.querySelectorAll('.freccia-avanti')].some((f) => {
          const r = f.getBoundingClientRect()
          /* Sotto l'intestazione `sticky` e dentro la finestra. */
          return r.bottom > 91 && r.top < window.innerHeight
        }),
    )
    if (!vista) buchi.push(y)
  }
  if (buchi.length) senzaV.push({ u, buchi })
}
await browser.close()

console.log(`Tappe a ${VIEWPORT.width}×${VIEWPORT.height} — spazio utile ${UTILE}px\n`)
for (const p of perPagina) {
  const oltre = p.tappe.filter(
    (t) => t.altezza > UTILE * TOLLERANZA && !tollerate.some((x) => x.u === p.u && x.id === t.id),
  ).length
  console.log(
    `  ${String(p.tappe.length).padStart(3)} tappe   ${oltre ? `⚠️ ${oltre} sfora` : '✓        '}   ${p.u}`,
  )
}

if (vuote.length) {
  console.log(`\n⛔ ${vuote.length} tappe SENZA contenuto visibile (una schermata bianca col ritorno a capo):\n`)
  for (const v of vuote) console.log(`  ${v.u}#${v.id}   ${v.altezza}px, ${v.caratteri} caratteri`)
  console.log(
    '\n   Quasi sempre è un figlio che non rende niente — un `<script>` di dati\n' +
      '   strutturati, un componente di soli metadati — passato fra i figli di\n' +
      '   `<Tappe>`. Va spostato dentro una sezione che ha contenuto.',
  )
}

if (tollerate.length) {
  console.log(`\n· ${tollerate.length} tappe alte per ragione scritta (scritta in scripts/tappe-alte.json):`)
  for (const s of tollerate.sort((a, b) => b.quote - a.quote)) {
    console.log(`  ${(s.quote * 100).toFixed(0).padStart(4)}%  ${String(s.altezza).padStart(5)}px  ${s.u}#${s.id}`)
  }
}

/* Una tolleranza rimasta inutilizzata vuol dire che la tappa è rientrata: la
   riga va tolta, altrimenti il file cresce e smette di dire qualcosa. */
if (TOLLERATE.size) {
  console.log(`\n✓ ${TOLLERATE.size} tolleranze non servono più — TOGLILE da scripts/tappe-alte.json:`)
  for (const k of TOLLERATE) console.log(`  ${k}`)
}

if (sforate.length) {
  console.log(`\n⚠️ ${sforate.length} tappe NUOVE oltre la schermata (la V finisce sotto il bordo):\n`)
  sforate.sort((a, b) => b.quote - a.quote)
  for (const s of sforate) {
    console.log(`  ${(s.quote * 100).toFixed(0).padStart(4)}%  ${s.altezza}px  ${s.u}#${s.id}  ${s.titolo}`)
  }
  console.log(
    '\n⛔ Si accorcia il CONTENUTO della tappa (o la si divide in due), non si\n' +
      '   comprime il contenitore: `height` + `overflow:hidden` nasconderebbe testo.',
  )
}

const attesoTel = CRICCA.telefono_fuori_misura
console.log(
  `\nSu telefono (${TEL.width}×${TEL.height}): ${oltreTel} tappe più alte di una schermata` +
    ` — la cricca dice ${attesoTel}.`,
)
if (oltreTel > attesoTel) {
  console.log(
    `\n⛔ PEGGIORATO su telefono: ${oltreTel} contro ${attesoTel}.\n` +
      '   Lì le colonne si impilano, quindi ogni riga in più costa il doppio.',
  )
} else if (oltreTel < attesoTel) {
  console.log(`\n✓ Migliorato: porta \`telefono_fuori_misura\` a ${oltreTel} in scripts/tappe-alte.json.`)
}

if (senzaV.length) {
  console.log(`\n⛔ Su telefono, ${senzaV.length} pagine hanno tratti SENZA una V in vista:`)
  for (const s of senzaV) console.log(`  ${s.u}: a y = ${s.buchi.slice(0, 6).join(', ')}${s.buchi.length > 6 ? '…' : ''}`)
  console.log(
    '\n   Chi scorre lì non ha nessun segno che ci sia un seguito. La V è\n' +
      '   `position: sticky; bottom: 0` sotto i 768px: se un tratto ne è privo,\n' +
      '   quasi sempre un antenato ha `overflow` o `transform`, che rompono lo\n' +
      '   sticky **senza dare errore**.',
  )
} else {
  console.log('\n✓ Su telefono la V è in vista da ogni punto del percorso.')
}

if (sforate.length || vuote.length || TOLLERATE.size || oltreTel > attesoTel || senzaV.length) process.exit(1)
console.log('\n✓ nessuna tappa vuota, nessuna nuova tappa fuori misura')
