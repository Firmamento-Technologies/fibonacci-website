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
import { commitFrontendEmr } from './ancora-emr.mjs'
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
    /* 🔴 **Non basta aprire l'agenda: bisogna trovare una settimana con dentro
     * qualcosa.** Misurato il 2026-08-12: la settimana corrente aveva **0**
     * appuntamenti e quella precedente **11** — i dati della demo sono del 3-9
     * agosto. Lo script fotografava sempre «questa settimana», quindi pubblicava
     * una griglia vuota sotto la didascalia «Schermata dall'applicazione».
     * ⇒ Si torna indietro finché non si trova una settimana piena. Cosi' regge
     * anche fra sei mesi, quando i dati saranno ancora piu' vecchi: si cerca il
     * contenuto, non una data. Se non lo trova, `pieno` boccia e non si scrive. */
    /* 🔴 **CORRETTO il 2026-08-16: «almeno uno» era una soglia troppo bassa.**
     * La ricerca si fermava alla **prima** settimana non vuota, e la settimana
     * del 10-16 agosto ne aveva **due**, sparsi, uno dei quali senza nome del
     * paziente («n/d»). Risultato: il presidio dava verde e pubblicava
     * un'agenda che sembra un prodotto **non usato**, peggiore di quella che
     * stava già sul sito (11 appuntamenti). ⚠️ È la stessa lezione del 12
     * agosto, applicata male: allora il difetto era *zero* appuntamenti e la
     * correzione fu «cercane almeno uno»; ma *uno* non illustra niente più di
     * zero. ⇒ Non si cerca la prima settimana **non vuota**: si cerca la
     * **più piena** fra quelle guardate, e ci si torna. */
    vai: async (p) => {
      const conta = () => p.locator('.rbc-event').count()
      const indietro = async () => {
        await p.getByRole('button', { name: 'Indietro', exact: true }).click().catch(() => {})
        await p.waitForTimeout(1200)
      }
      await p.goto(`${EMR}/appuntamenti`)
      await p.waitForTimeout(2500)

      let miglioreIndietro = 0
      let miglioreConteggio = await conta()
      for (let i = 1; i <= 10; i++) {
        await indietro()
        const n = await conta()
        if (n > miglioreConteggio) {
          miglioreConteggio = n
          miglioreIndietro = i
        }
      }
      // Si riparte da capo e si torna indietro esattamente fino alla migliore:
      // premere «Avanti» sarebbe equivalente, ma ricaricare azzera lo stato e
      // rende il conteggio ripetibile.
      await p.goto(`${EMR}/appuntamenti`)
      await p.waitForTimeout(2500)
      for (let i = 0; i < miglioreIndietro; i++) await indietro()
    },
    /* ⚠️ **Quattro, non uno.** È la soglia sotto la quale una griglia
     * settimanale si legge come «nessuno usa questo prodotto». Se nessuna
     * delle undici settimane guardate ne ha quattro, il presidio **boccia e
     * non scrive niente**: meglio le schermate di ieri che una vetrina che
     * mostra un'agenda deserta. */
    pieno: async (p) => (await p.locator('.rbc-event, [data-appuntamento]').count()) >= 4,
  },
  {
    nome: 'cartella-paziente',
    vai: async (p) => { await apriPaziente(p); await p.waitForTimeout(1500) },
    pieno: async (p) => !(await p.getByText(/nessun|0 trattamenti|caricamento/i).first().isVisible().catch(() => false)),
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
    // ⛔ Questa è LA schermata che promette «Dove, quanto, con che lotto»: se
    // dice «0 trattamenti registrati» sta promettendo il contrario.
    pieno: async (p) => !(await p.getByText(/0 trattamenti registrati/i).first().isVisible().catch(() => false)),
  },
  {
    nome: 'catalogo-consensi',
    vai: async (p) => { await p.goto(`${EMR}/consensi`); await p.waitForTimeout(2000) },
    pieno: async (p) => !(await p.getByText(/nessun consenso|0 consensi/i).first().isVisible().catch(() => false)),
  },
  {
    nome: 'registro-accessi',
    /* ⚠️ Si aspetta la PRIMA RIGA, non un tempo fisso: con la macchina carica
     * 2 secondi non bastavano e la schermata usciva vuota pur essendoci **20**
     * righe. Un'attesa a tempo misura la macchina, non la pagina. */
    vai: async (p) => {
      await p.goto(`${EMR}/audit`)
      await p.locator('tbody tr').first().waitFor({ timeout: 20000 }).catch(() => {})
      await p.waitForTimeout(800)
    },
    pieno: async (p) => (await p.locator('tbody tr').count()) > 0,
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

/* L'ancora vive in `ancora-emr.mjs`, UNA sola volta: generatore e collaudo
   devono per forza essere d'accordo, e finche' erano due copie si sono scostate
   due volte (l'ultima il 2026-08-10, lasciando il presidio rosso su immagini
   appena rigenerate). */

const browser = await chromium.launch()
// deviceScaleFactor 2: si cattura in alta risoluzione una volta sola, poi si
// scala. Ricatturare a ogni misura cambierebbe l'impaginazione dell'app.
const ctx = await browser.newContext({ viewport: { width: 1400, height: 875 }, deviceScaleFactor: 2, locale: 'it-IT' })
const page = await ctx.newPage()

console.log(`→ entro nella demo su ${EMR}`)
await entra(page)

mkdirSync(USCITA, { recursive: true })
const manifesto = { generato: new Date().toISOString(), commitFrontendEmr: commitFrontendEmr([join(RADICE, '../EMR'), process.env.EMR_REPO]), larghezze: LARGHEZZE, schermate: {} }

/* 🔴 **Perché esiste questo controllo, misurato il 2026-08-12.**
 * Le schermate si possono rigenerare servendo la `dist/` con `vite preview`,
 * **senza** il resto dello stack. Girano, non danno errore, e il manifesto
 * viene stampato col commit giusto ⇒ `collaudo.mjs` diventa **verde**.
 * Ma le immagini mostrano un prodotto **vuoto**: l'agenda senza un solo
 * appuntamento, i trattamenti con scritto *«0 trattamenti registrati»* e i
 * riquadri di caricamento al posto dei dati. Pubblicate sotto la didascalia
 * «Schermata dall'applicazione, non un disegno», sono peggio di una scaduta.
 *
 * ⇒ Il manifesto prova la **provenienza**, non la **correttezza**: dice da
 * quale commit vengono, non che mostrino qualcosa. Senza questo controllo il
 * presidio si può soddisfare con immagini peggiori — che è il modo più
 * silenzioso di perderlo. */
/* ⚠️ **La soglia in byte è il controllo che regge davvero.** Le condizioni
 * `pieno` scritte pagina per pagina cercano le parole giuste, e il 2026-08-12
 * ne hanno prese **2 su 5**: `catalogo-consensi` è passata pur essendo **1 KB**
 * di AVIF contro i 24 abituali, cioè un rettangolo quasi bianco. Un'immagine
 * senza informazione **si comprime a niente**, e quello non dipende da come è
 * scritta l'interfaccia: è la misura che non invecchia. Le due cose si sommano.
 * ⇒ 1400px sotto 6 KB = non c'è dentro niente. Le vere stanno fra 16 e 34 KB. */
const MINIMO_AVIF_1400 = 6 * 1024

const vuote = []
const daScrivere = []
for (const s of SCHERMATE) {
  await s.vai(page)
  if (s.pieno && !(await s.pieno(page))) {
    vuote.push(`${s.nome} (la pagina dice che è vuota)`)
    continue
  }
  /* ⚠️ Via il fuoco prima di scattare: lo script naviga **cliccando**, e
   * l'anello di messa a fuoco resta sull'ultimo pulsante premuto. Sull'agenda
   * si vedeva «Indietro» evidenziato — un dettaglio che nella pagina pubblicata
   * racconta che qualcuno ha frugato, non come si presenta il prodotto. */
  await page.evaluate(() => (document.activeElement)?.blur?.())
  await page.waitForTimeout(200)
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
    /* ⛔ NON si scrive qui. Prima si controlla tutto, poi si scrive tutto: la
     * prima stesura scriveva dentro il ciclo e, quando il controllo bocciava
     * alla terza schermata, le prime due erano **già finite su disco** — cioè
     * il presidio lasciava il repository in uno stato peggiore di quello da cui
     * era partito. */
    daScrivere.push({ file: `${s.nome}-${w}.webp`, dato: webp })
    daScrivere.push({ file: `${s.nome}-${w}.avif`, dato: avif })
    varianti.push({ w, webp: webp.length, avif: avif.length })
  }
  const grande = varianti.at(-1)
  if (grande.avif < MINIMO_AVIF_1400) {
    vuote.push(`${s.nome} (${Math.round(grande.avif / 1024)} KB di AVIF: non c'è dentro niente)`)
    continue
  }
  // Il PNG storico resta, come ripiego per chi non ha nessuno dei due formati.
  daScrivere.push({
    file: `${s.nome}.png`,
    dato: await sharp(grezza).resize({ width: LARGHEZZE.at(-1) }).png({ compressionLevel: 9 }).toBuffer(),
  })
  manifesto.schermate[s.nome] = { sorgente: `${meta.width}×${meta.height}`, varianti }
  const kb = (n) => Math.round(n / 1024) + ' KB'
  console.log(`  ✓ ${s.nome.padEnd(20)} ${varianti.map((v) => `${v.w}px avif ${kb(v.avif)}`).join(' · ')}`)
}

if (vuote.length) {
  console.error(`\n⛔ ${vuote.length} schermate su ${SCHERMATE.length} sono VUOTE: ${vuote.join(', ')}`)
  console.error('   Serve lo stack completo, non solo `vite preview` sulla dist:')
  console.error('   senza il backend le pagine si disegnano ma non hanno dati.')
  console.error('   ⛔ Niente è stato scritto: una schermata vuota è peggio di una scaduta.')
  process.exit(1)
}

// ⇒ Solo ora si tocca il disco: o tutte, o nessuna.
for (const { file, dato } of daScrivere) writeFileSync(join(USCITA, file), dato)

writeFileSync(join(USCITA, 'manifesto.json'), JSON.stringify(manifesto, null, 2) + '\n')
// Le vecchie varianti non più prodotte non restano a occupare posto.
for (const morto of ['farmaci.png']) {
  const f = join(USCITA, morto)
  if (existsSync(f)) { rmSync(f); console.log(`  🗑  rimossa ${morto} (non referenziata da nessuna pagina)`) }
}

await browser.close()
console.log(`\n✓ manifesto scritto · commit EMR: ${manifesto.commitFrontendEmr?.slice(0, 8) ?? '(sconosciuto)'}`)
