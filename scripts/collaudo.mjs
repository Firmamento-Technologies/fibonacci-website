#!/usr/bin/env node
/**
 * Collaudo del sito: accessibilità, struttura, claim vietati, movimento.
 *
 * Gira contro il server di sviluppo (o contro `out/` servito):
 *   node website/scripts/collaudo.mjs [url]
 *
 * Non è un test di stile. Controlla cinque cose che, se sbagliate, si
 * pagano: violazioni WCAG serie, più di un H1, immagini senza testo
 * alternativo, affermazioni che il prodotto oggi non regge, e il rispetto
 * di prefers-reduced-motion.
 */

import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

import { PERCORSI_CHE_CAMBIANO_LA_RESA } from './ancora-emr.mjs'
import { paritaMappaViso } from './parita-viso.mjs'
import { paritaCatalogo } from './parita-catalogo.mjs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))

/** Tutti i sorgenti di `src/`: serve ai controlli statici che leggono il codice
 *  invece della pagina resa. */
function* walkSrc(dir = join(QUI, '..', 'src')) {
  for (const voce of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, voce.name)
    if (voce.isDirectory()) yield* walkSrc(p)
    else if (/\.(tsx?|css)$/.test(voce.name)) yield p
  }
}
const BASE = process.argv[2] ?? 'http://localhost:3210'

/* La demo pubblica sta su un'altra macchina e il sito la promuove: va
 * controllata anche lei. Tenuta qui e non importata da `src/lib/site-config.ts`
 * perché questo script è JavaScript semplice e quello è un modulo TypeScript
 * con gli alias di Next; se le due stringhe divergono, il controllo qui sotto
 * misura un indirizzo che il sito non usa. Un test lo impedisce. */
const DEMO_URL = demoUrlDelSito()

/* Il test promesso dal commento qui sopra. Legge la stringa vera dal sorgente
 * del sito: se qualcuno cambia `DEMO_URL` in `site-config.ts` e non qui, il
 * controllo della demo starebbe misurando un indirizzo che il sito non usa
 * più, cioè darebbe verde su una cosa che non esiste. */
function demoUrlDelSito() {
  const cfg = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'lib', 'site-config.ts'),
    'utf8',
  )
  return cfg.match(/export const DEMO_URL(?::\s*string)?\s*=\s*['"]([^'"]*)['"]/)?.[1]
}

/* I documenti in markdown: bozze legali ereditate, da riscrivere in blocco
   quando la società esiste. */
const LEGALI = ['/privacy', '/cookie', '/dpa', '/termini', '/sub-responsabili', '/sicurezza']

/* Le guide della documentazione, lette dal sorgente invece che ricopiate.
 *
 * ⚠️ Qui l'elenco scritto a mano aveva già fallito, e in silenzio. Il sitemap
 * le pubblica tutte perché le prende da `DOCS`; questo elenco no, e il
 * 2026-08-09 le guide sono passate da 7 a 14 senza che una sola delle nuove
 * venisse mai aperta da niente. Non erano rotte — semplicemente, se lo fossero
 * state, non l'avrebbe saputo nessuno. È lo stesso difetto che il commento in
 * fondo a PAGINE descrive, ripetuto su una rotta dinamica.
 *
 * Due elenchi da tenere allineati a mano sono un difetto che torna: si legge
 * quello vero. La tecnica è quella di `demoUrlDelSito()` — questo script è
 * JavaScript semplice, `docs-data.ts` è TypeScript con gli alias di Next.
 * L'ancoraggio parte da `export const DOCS` così l'interfaccia `DocMeta` (che
 * ha anch'essa un campo `slug`) resta fuori; la virgoletta nella regex tiene
 * fuori le firme `slug: string` delle funzioni che seguono l'array. */
function guideDelSito() {
  const sorgente = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'lib', 'docs-data.ts'),
    'utf8',
  )
  const daDocsInPoi = sorgente.slice(sorgente.indexOf('export const DOCS'))
  return [...daDocsInPoi.matchAll(/slug:\s*'([^']+)'/g)].map((m) => `/documentazione/${m[1]}`)
}

const GUIDE = guideDelSito()

/* Leggere il sorgente con una regex ha un modo di fallire che non si vede:
 * se qualcuno riscrive `docs-data.ts` con le virgolette doppie, o rinomina
 * l'array, `GUIDE` torna vuoto e il collaudo riprende a non controllare
 * nessuna guida — esattamente il difetto che questa riga esiste per chiudere,
 * ma senza più il sospetto che l'ha fatto scoprire. Un elenco vuoto qui è un
 * presidio rotto, non un sito senza guide: si ferma subito e si dice perché. */
/* ⚠️ Niente `rosso()` qui: è un `const` definito più in basso, e chiamarlo
 * prima lo troverebbe nella temporal dead zone — il presidio morirebbe con un
 * ReferenceError invece del messaggio che spiega cosa fare. */
if (GUIDE.length === 0) {
  console.error('Collaudo interrotto: nessuna guida estratta da src/lib/docs-data.ts.')
  console.error("L'array DOCS è stato rinominato o riscritto: aggiorna guideDelSito().")
  process.exit(1)
}

const PAGINE = [
  '/', '/come-funziona', '/consensi-informati', '/prezzi', '/sicurezza-e-dati',
  '/richiedi-una-demo', '/verifica', '/domande', '/intelligenza-artificiale',
  '/chi-siamo', '/documentazione', '/privacy', '/cookie', '/dpa', '/termini',
  '/sub-responsabili', '/sicurezza',
  /* Le tre dell'8 agosto. Una pagina che non è in questo elenco non viene
     controllata da niente: non è un dettaglio di manutenzione, è il motivo
     per cui i difetti del 7 agosto erano rimasti in piedi per settimane. */
  '/che-software-serve', '/autovalutazione', '/integrazioni',
  '/per-le-societa-scientifiche',
  ...GUIDE,
]

/* Affermazioni che oggi il prodotto non regge. Se una compare in una pagina
 * pubblica è un debito verso il cliente, non un errore di stile.
 *   · la firma QUALIFICATA non è attiva (certificati non rilasciati);
 *   · la conservazione a norma non ha un conservatore accreditato;
 *   · non esiste un percorso di iscrizione self-service né una prova gratuita;
 *   · il dominio fibonacci.it è di terzi;
 *   · le testimonianze in pubblicità sanitaria sono vietate (L. 145/2018). */
const VIETATI = [
  { re: /firma\s+(elettronica\s+)?qualificata\s+(attiva|inclusa|disponibile)/i, perche: 'la FEQ non è attiva' },
  { re: /\beIDAS\s+art\.?\s*26\b/i, perche: 'claim eIDAS non sostenibile oggi' },
  { re: /prova\s+gratuita\s+di\s+\d+\s+giorni/i, perche: 'non esiste una prova gratuita a tempo' },
  { re: /\btrial\s+(gratuito|di\s+\d+)/i, perche: 'non esiste un trial' },
  { re: /\biniz(ia|iare)\s+gratis\b/i, perche: 'non esiste il self-service' },
  { re: /fibonacci\.it/i, perche: 'dominio di terzi' },
  { re: /dermatolog|ortopedi|psicolog|nutrizion|oculistic/i, perche: 'residuo multi-specialità' },
  { re: /dpo@/i, perche: 'nessun DPO designato' },
  { re: /Firmamento/i, perche: 'intestazione societaria da rimuovere', soloInterfaccia: true },
  /* ✅ **Le due funzioni dell'8 agosto SONO state costruite**, e queste due
   * righe sono state tolte il 2026-08-09.
   *
   * Il presidio le teneva fuori con la formula giusta: «si tolgono da qui il
   * giorno in cui si possono dimostrare, non prima». Quel giorno è arrivato:
   * la tracciabilità del lotto è chiusa T1-T5 (`a2c2803`, provata e2e — due
   * sedute con lo stesso lotto su due pazienti diversi, trovate in una sola
   * chiamata) e il controllo delle comunicazioni è chiuso C1-C4 (`ce4f29b`,
   * banco a due direzioni 17/17 e 0/18).
   *
   * ⚠️ Entrambe sono dietro un interruttore spento di suo
   * (`VITE_TRACCIABILITA_LOTTO`, `VITE_COMUNICAZIONE_CONFORME`): esistono nel
   * prodotto, non sono accese su ogni studio. La guida lo dice a chiare
   * lettere — «se la voce non compare nel menu, la funzione non è stata
   * abilitata» — ed è la ragione per cui parlarne non è più un claim vuoto.
   *
   * ⛔ Se un domani venissero ritirate, queste due righe tornano qui. */
  /* ⚠️ La prima versione era /conform\w*\s+(all[oa]\s+)?EHDS/ e NON scattava su
   * «conforme all’EHDS»: il sito usa l'apostrofo tipografico, la regex si
   * aspettava «allo »/«alla » con lo spazio. Cinque test l'avrebbero dichiarata
   * verde; la prova per mutazione l'ha vista. Ora si misura la VICINANZA fra le
   * due parole, così l'elisione non conta. Un enunciato di fatto sulle date
   * («l'EHDS si applica dal 2027, la conformità sarà richiesta dal 2029») resta
   * fuori: sono più di 20 caratteri. */
  { re: /conform\w*[^.]{0,20}EHDS|EHDS[^.]{0,20}conform\w*|EHDS[\s-]?ready|conform\w*\s+al\s+regolamento\s+2025\/327/i, perche: 'gli atti di esecuzione EHDS non esistono: la conformità non è dichiarabile' },
]

/* ⚠️ L'URL DI PUBBLICAZIONE CONTIENE «firmamento», E NON È UN'INTESTAZIONE.
 *
 * Il sito è ospitato su `firmamento-technologies.github.io`, quindi ogni pagina
 * che cita il proprio indirizzo — i documenti legali lo fanno, per dire dove
 * sono pubblicati — contiene quella stringa. Il 2026-08-07, sostituiti i
 * segnaposto rotti con l'indirizzo vero, il controllo qui sopra è passato da 0 a
 * 5 segnalazioni **senza che una sola intestazione fosse tornata**.
 *
 * Spegnere il controllo sarebbe stato il rimedio sbagliato: cercava una cosa
 * vera. Quindi l'URL di pubblicazione viene tolto dal testo PRIMA del confronto,
 * e il fatto — che il sito sta sotto l'organizzazione della vecchia società —
 * viene detto a parte, una volta, invece di travestirsi da cinque intestazioni.
 * Si chiude registrando il dominio proprio, non toccando i documenti. */
const URL_PUBBLICAZIONE = 'https://firmamento-technologies.github.io/fibonacci-website'
const senzaUrlDiPubblicazione = (testo) => testo.replaceAll(URL_PUBBLICAZIONE, '«il sito»')

/* La lineetta lunga con spazi è la punteggiatura più riconoscibile dei testi
 * generati. Il sito non la usa mai: se compare, è rientrata da un copia-incolla. */
const LINEETTA = /\s—\s/

const rosso = (s) => `\x1b[31m${s}\x1b[0m`
const verde = (s) => `\x1b[32m${s}\x1b[0m`
const giallo = (s) => `\x1b[33m${s}\x1b[0m`

async function main() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'it-IT' })
  const page = await ctx.newPage()

  const problemi = []
  const daRiscrivere = new Set()
  const pagineConUrlDiPubblicazione = new Set()
  const erroriConsole = []
  page.on('pageerror', (e) => erroriConsole.push(`${page.url()} → ${e.message}`))

  for (const percorso of PAGINE) {
    const risposta = await page.goto(BASE + percorso, { waitUntil: 'networkidle', timeout: 45000 })
    if (!risposta || risposta.status() >= 400) {
      problemi.push(`${percorso}: HTTP ${risposta?.status()}`)
      continue
    }
    await page.waitForTimeout(700)

    // ── Struttura ──────────────────────────────────────────────────────
    const struttura = await page.evaluate(() => ({
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent?.trim().slice(0, 60)),
      titolo: document.title,
      immaginiSenzaAlt: [...document.images].filter((i) => !i.alt).map((i) => i.src.split('/').pop()),
      /* Un riferimento a un file inesistente non si vede finché non si
         guarda la pagina: `alt` c'è, il markup è valido, e il browser
         disegna un rettangolo vuoto. È successo davvero, su due pagine,
         dopo aver scartato tre foto senza aggiornare i riferimenti. */
      immaginiRotte: [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.src.split('/').pop()),
      lang: document.documentElement.lang,
      testo: document.body.innerText,
    }))

    if (struttura.h1.length !== 1) problemi.push(`${percorso}: ${struttura.h1.length} elementi H1 (ne serve esattamente uno)`)
    if (!struttura.titolo) problemi.push(`${percorso}: <title> vuoto`)
    if (struttura.lang !== 'it') problemi.push(`${percorso}: lang="${struttura.lang}"`)
    for (const img of struttura.immaginiSenzaAlt) problemi.push(`${percorso}: immagine senza alt (${img})`)
    for (const img of struttura.immaginiRotte) problemi.push(`${percorso}: immagine ROTTA, il file non esiste (${img})`)

    // ── Claim ──────────────────────────────────────────────────────────
    /* I documenti legali sono bozze da far validare: se un'intestazione
     * societaria ricompare va segnalata a parte, non mescolata ai problemi. */
    const documentoLegale = LEGALI.includes(percorso)
    /* L'indirizzo di pubblicazione contiene «firmamento» ma è un fatto di
     * hosting, non un'intestazione: va tolto prima del confronto (vedi il
     * commento su URL_PUBBLICAZIONE). */
    const testoDaControllare = senzaUrlDiPubblicazione(struttura.testo)
    if (struttura.testo.includes(URL_PUBBLICAZIONE)) pagineConUrlDiPubblicazione.add(percorso)
    for (const { re, perche, soloInterfaccia } of VIETATI) {
      const trovato = testoDaControllare.match(re)
      if (!trovato) continue
      if (soloInterfaccia && documentoLegale) {
        daRiscrivere.add(percorso)
        continue
      }
      problemi.push(`${percorso}: «${trovato[0]}» → ${perche}`)
    }
    if (LINEETTA.test(struttura.testo)) {
      const ctx = struttura.testo.match(/.{0,40}\s—\s.{0,40}/)
      problemi.push(`${percorso}: lineetta lunga spaziata → «${ctx?.[0].trim()}»`)
    }

    // ── Accessibilità ──────────────────────────────────────────────────
    const esito = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    const gravi = esito.violations.filter((v) => ['serious', 'critical'].includes(v.impact))
    for (const v of gravi) {
      problemi.push(`${percorso}: a11y ${v.impact} · ${v.id} · ${v.nodes.length} nodi · ${v.help}`)
    }
  }

  /* ── L'autovalutazione, esercitata davvero ──────────────────────────────
   *
   * Il giro qui sopra guarda le pagine come arrivano. Ma di questa pagina la
   * parte che conta non esiste finché non la si usa: l'esito compare dopo otto
   * risposte, ed è lì che vivono la regione live, il fuoco e le voci generate.
   * Una pagina interattiva controllata solo nello stato iniziale è controllata
   * a metà, e la metà scoperta è quella che il visitatore legge davvero. */
  {
    const p = '/autovalutazione'
    await page.goto(BASE + p, { waitUntil: 'networkidle' })

    /* 1. La convalida deve parlare, non disabilitare in silenzio.
     *
     * ⚠️ DUE DIFETTI IN QUESTO SOLO CONTROLLO, trovati per mutazione.
     *
     * 1. `locator.count()` NON aspetta: contava i nodi nell'istante subito
     *    dopo il clic, prima che React avesse ri-disegnato.
     * 2. Peggio: il selettore era `[role="alert"]` senza contesto, e i
     *    localizzatori di Playwright ATTRAVERSANO lo shadow DOM. In sviluppo
     *    l'overlay di Next.js ne espone uno dentro `<nextjs-portal>`, quindi
     *    il controllo trovava sempre un `role="alert"` e non poteva fallire:
     *    misurava il framework, non il prodotto. `document.querySelectorAll`
     *    ne contava zero mentre Playwright ne contava uno, ed è così che si
     *    è visto.
     *
     * Il rimedio è ancorare il controllo a `main`, dove sta il prodotto e non
     * l'impalcatura di sviluppo. */
    await page.getByRole('button', { name: /vedi l/i }).click()
    try {
      await page.waitForSelector('main [role="alert"]', { timeout: 3000 })
    } catch {
      problemi.push(`${p}: senza risposte il pulsante non segnala che cosa manca`)
    }

    // 2. Otto risposte tutte «scoperte»: l'esito deve elencarle tutte.
    const gruppi = page.locator('fieldset')
    const quanti = await gruppi.count()
    if (quanti !== 8) problemi.push(`${p}: ${quanti} domande invece di 8`)
    for (let i = 0; i < quanti; i++) {
      const radio = gruppi.nth(i).locator('input[type="radio"]')
      const n = await radio.count()
      // L'ultima opzione di ogni domanda è sempre una che scopre il punto.
      await radio.nth(n - 1).check()
    }
    await page.getByRole('button', { name: /vedi l/i }).click()
    await page.waitForTimeout(300)

    const esitoTesto = await page.evaluate(() => document.body.innerText)
    if (!/Risultano scoperti 8 punti su otto/.test(esitoTesto)) {
      problemi.push(`${p}: con otto risposte scoperte l'esito non li conta tutti e otto`)
    }
    if (!/In Fibonacci:/.test(esitoTesto)) {
      problemi.push(`${p}: l'esito non dice che cosa fa il prodotto per i punti scoperti`)
    }
    // Ancorato a `main` per la stessa ragione del controllo qui sopra.
    const stato = await page.locator('main [role="status"][aria-live="polite"]').count()
    if (stato === 0) problemi.push(`${p}: l'esito non è in una regione live: chi non vede non sa che è comparso`)
    const fuocoSulTitolo = await page.evaluate(() => document.activeElement?.tagName === 'H2')
    if (!fuocoSulTitolo) problemi.push(`${p}: dopo il calcolo il fuoco non va sul titolo dell'esito`)

    /* 3. L'altro ramo. Se non risulta scoperto niente, la pagina dice che non
     *    abbiamo niente da vendere: è la frase più insolita del sito e vive in
     *    un ramo che il giro qui sopra non attraversa mai. Un ramo che nessuno
     *    controlla è un ramo che si rompe in silenzio. */
    await page.goto(BASE + p, { waitUntil: 'networkidle' })
    for (let i = 0; i < quanti; i++) {
      const radio = gruppi.nth(i).locator('input[type="radio"]')
      // Nella prima domanda la risposta che NON scopre è la seconda.
      await radio.nth(i === 0 ? 1 : 0).check()
    }
    await page.getByRole('button', { name: /vedi l/i }).click()
    await page.waitForTimeout(300)
    const testoZero = await page.evaluate(() => document.body.innerText)
    if (!/Non risulta scoperto nessuno degli otto punti/.test(testoZero)) {
      problemi.push(`${p}: rispondendo bene a tutte, l'esito non riconosce che non c'è niente di scoperto`)
    }
    if (/In Fibonacci:/.test(testoZero)) {
      problemi.push(`${p}: senza punti scoperti la pagina vende comunque qualcosa`)
    }

    // 4. Accessibilità dello stato che prima non esisteva.
    const esitoAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    for (const v of esitoAxe.violations.filter((v) => ['serious', 'critical'].includes(v.impact))) {
      problemi.push(`${p} (esito): a11y ${v.impact} · ${v.id} · ${v.nodes.length} nodi · ${v.help}`)
    }
  }

  /* ── Le due varianti del modulo ─────────────────────────────────────────
   *
   * `ModuloDemo` ha una variante per le società scientifiche, e il suo valore
   * predefinito è ciò che tiene le due pagine storiche identiche a prima.
   * Un valore predefinito è una promessa silenziosa: se cambia, nessuno se ne
   * accorge finché un medico non si trova a dichiarare il proprio ruolo in una
   * società che non ha. Qui la promessa diventa verificabile. */
  {
    await page.goto(BASE + '/richiedi-una-demo', { waitUntil: 'networkidle' })
    const demo = await page.evaluate(() => document.body.innerText)
    if (!/Che procedure fai/.test(demo)) {
      problemi.push('/richiedi-una-demo: il modulo non è più quello della demo')
    }
    if (/Che ruolo hai nella società/.test(demo)) {
      problemi.push('/richiedi-una-demo: al medico viene chiesto il ruolo in una società scientifica')
    }

    await page.goto(BASE + '/per-le-societa-scientifiche', { waitUntil: 'networkidle' })
    const soc = await page.evaluate(() => document.body.innerText)
    if (!/Che ruolo hai nella società/.test(soc)) {
      problemi.push('/per-le-societa-scientifiche: il modulo non è la variante per le società')
    }
    if ((await page.locator('main select').count()) > 0) {
      problemi.push('/per-le-societa-scientifiche: c\'è ancora l\'elenco obbligatorio delle procedure estetiche')
    }
  }

  /* ── La demo pubblica risponde davvero? ──────────────────────────────────
   *
   * Dall'8 agosto «Entra nella demo» è il pulsante principale della home. È
   * l'unica cosa che un medico può verificare da solo, di notte, senza parlare
   * con nessuno — e vive su un'ALTRA macchina, che non passa da questo deploy.
   *
   * Il rischio è preciso e ha una data: `VITE_DEMO` ha default `false`, quindi
   * il primo rilascio dell'applicazione che non porti `WEB_DEMO=true` fa
   * sparire la rotta `/demo`, e la vetrina resta a pubblicizzare una porta
   * chiusa senza che nessuno se ne accorga. Questo controllo è il campanello.
   *
   * ⚠️ Non basta un 200: l'applicazione è a pagina singola e risponde 200 a
   * qualunque percorso, anche a quelli che non esistono. Si guarda dove si
   * FINISCE: a demo accesa l'auto-accesso porta all'elenco dei pazienti; a
   * demo spenta la rotta non è registrata e il router rimanda al login. */
  if (!DEMO_URL) {
    /* ⛔ Demo VUOTA DI PROPOSITO (2026-08-09): non c'è nessun host. Non è un
       difetto da segnalare, ed è la differenza che tiene vivo un presidio —
       uno che si lamenta di una scelta deliberata viene spento, e con lui la
       segnalazione vera. Qui si controlla l'altra metà: che il sito non
       promuova la demo mentre l'indirizzo non c'è. */
    const home = await ctx.newPage()
    await home.goto(BASE, { waitUntil: 'networkidle', timeout: 45000 })
    const inviti = await home.locator('a:has-text("Entra nella demo")').count()
    if (inviti > 0) {
      problemi.push(
        `demo: DEMO_URL è vuoto ma la home mostra ancora ${inviti} invito/i «Entra nella demo» — un pulsante senza indirizzo`,
      )
    }
    await home.close()
  } else {
    const demo = await ctx.newPage()
    try {
      await demo.goto(DEMO_URL, { waitUntil: 'networkidle', timeout: 45000 })
      await demo.waitForTimeout(4000)
      const dove = new URL(demo.url()).pathname
      if (/\/login/.test(dove)) {
        problemi.push(
          `demo: ${DEMO_URL} finisce su ${dove} — la rotta /demo non è accesa (manca WEB_DEMO=true?), ma la home la promuove come pulsante principale`,
        )
      } else if (!/\/pazienti/.test(dove)) {
        problemi.push(`demo: ${DEMO_URL} finisce su ${dove}, non sull'elenco dei pazienti`)
      }
    } catch (e) {
      problemi.push(`demo: ${DEMO_URL} non risponde (${String(e).slice(0, 80)}), e la home la promuove`)
    }
    await demo.close()
  }

  /* ── TD-11 · il livello display resta a TRE gradini, e in rapporto φ ──
   *
   * La decisione: φ non tocca il testo (la scala a 9 misure è già in territorio
   * Major Second, che è ciò che Material 3 raccomanda) ma governa il display.
   * Prima erano **sei** rampe `clamp(...)` sparse nei componenti, e tre
   * distavano meno del 13 % l'una dall'altra — indistinguibili. Sono tornate una
   * volta: senza questo controllo tornano ancora, perché aggiungere un
   * `text-[clamp(...)]` in una pagina nuova costa zero e non lo vede nessuno. */
  {
    const css = readFileSync(join(QUI, '..', 'src', 'app', 'globals.css'), 'utf8')
    const gradini = [1, 2, 3].map((n) => {
      const m = css.match(new RegExp(`--display-${n}:\\s*clamp\\(([^)]+)\\)`))
      if (!m) return null
      const max = m[1].split(',').at(-1).trim()
      return parseFloat(max)
    })
    if (gradini.some((g) => g === null)) {
      problemi.push('display: manca uno dei tre gradini --display-1/2/3 in globals.css')
    } else {
      for (const [a, b] of [[0, 1], [1, 2]]) {
        const r = gradini[a] / gradini[b]
        if (Math.abs(r - 1.618) > 0.05) {
          problemi.push(
            `display: --display-${a + 1}/--display-${b + 1} = ${r.toFixed(3)}, non è φ (1.618 ±0.05)`,
          )
        }
      }
    }
    // Nessuna rampa ad hoc fuori dai token: è così che erano diventate sei.
    const fuori = new Set()
    for (const f of [...walkSrc()]) {
      for (const m of readFileSync(f, 'utf8').matchAll(/text-\[clamp\([^\]]+\]/g)) fuori.add(m[0])
    }
    if (fuori.size) {
      problemi.push(
        `display: ${fuori.size} rampa/e tipografica/he fuori dai token: ${[...fuori].join(' · ')}`,
      )
    }
  }

  /* ── Gli ALTRI due canali che il sito promette ────────────────────────
   *
   * Il controllo qui sopra copriva la demo e basta, e per due mesi e' bastato
   * perche' i tre indirizzi stavano sulla stessa macchina viva. Il 2026-08-09
   * quella macchina e' sparita, e si e' visto che il presidio ne sorvegliava
   * **uno su tre**: la vetrina promuove anche «Accedi» (`APP_URL`, in
   * intestazione e pie' di pagina) e un modulo di contatto che consegna a
   * `LEAD_API_URL`. Un presidio che copre una superficie e non le sorelle da'
   * verde su un sito che non funziona.
   *
   * ⚠️ Il modulo NON mente quando l'endpoint e' morto — il ripiego `mailto` e'
   * protetto da `if (CONTACT_EMAIL)` e senza casella dichiara l'errore invece
   * di far credere che sia partito. Ma dichiarare bene un fallimento non e'
   * riceverlo: **senza questi due, il sito non ha nessun canale per essere
   * contattato**, ed e' il moltiplicatore del rilievo n. 1 (zero interviste). */
  {
    const cfg = readFileSync(new URL('../src/lib/site-config.ts', import.meta.url), 'utf8')
    /* ⚠️ `(?::\\s*\\w+)?` NON e' pedanteria: `APP_URL` e `DEMO_URL` sono
       dichiarati `: string = ''` — l'annotazione serve a non farne inferire il
       tipo letterale `''`, che romperebbe i `DEMO_URL ? … : …` nei componenti.
       Senza questo pezzo la regex non trovava niente e il controllo diceva
       «non e' leggibile da site-config.ts»: un ROSSO su una cosa giusta, cioe'
       il modo piu' rapido di far spegnere un presidio. E l'annotazione l'avevo
       aggiunta io, nello stesso commit che ha creato il bisogno del controllo. */
    const leggi = (nome) =>
      cfg.match(new RegExp(`export const ${nome}(?::\\s*\\w+)?\\s*=\\s*['"]([^'"]*)['"]`))?.[1]

    for (const [nome, atteso] of [['APP_URL', 'accesso'], ['LEAD_API_URL', 'contatti']]) {
      const url = leggi(nome)
      /* ⚠️ TRE stati, non due, e confonderli e' costato un rosso su una cosa
         giusta (2026-08-10):
           · `undefined` → la regex non trova la riga: il presidio e' ROTTO;
           · `''`        → il valore c'e' ed e' VUOTO DI PROPOSITO — `APP_URL` e
                           `DEMO_URL` sono vuoti dichiarati perche' la macchina
                           non esiste. Non e' un difetto: e' la scelta che il
                           collaudo stesso ha verificato in pagina;
           · una stringa → si prova l'host.
         La prima versione faceva `if (!url)` e trattava il vuoto deliberato
         come una lettura fallita: un presidio che segnala la propria decisione
         e' il modo piu' rapido per farsi spegnere. */
      if (url === undefined) {
        problemi.push(`${nome} non e' leggibile da site-config.ts: il controllo e' rotto, non il sito`)
        continue
      }
      if (url === '') continue  // assenza dichiarata: gia' verificata altrove
      try {
        // HEAD basta: qui si chiede «questo host esiste?», non «cosa risponde».
        const r = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(15000) })
        if (r.status >= 500) {
          problemi.push(`${nome} (${atteso}): ${url} risponde HTTP ${r.status}, e il sito lo promuove`)
        }
      } catch (e) {
        problemi.push(
          `${nome} (${atteso}): ${url} non risponde (${String(e).slice(0, 60)}) — il sito offre un canale che non esiste`,
        )
      }
    }

    // Un recapito vuoto e' una scelta dichiarata (segnaposto.ts), ma diventa un
    // difetto quando e' l'UNICO ripiego di un modulo il cui endpoint e' morto.
    if (!leggi('CONTACT_EMAIL')) {
      problemi.push(
        'CONTACT_EMAIL e\' vuoto: il ripiego del modulo di contatto non esiste ⇒ se LEAD_API_URL e\' giu\', il sito non puo\' ricevere NESSUN contatto',
      )
    }
  }

  // ── Movimento ridotto ────────────────────────────────────────────────
  const ctxFermo = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  const pFermo = await ctxFermo.newPage()
  await pFermo.goto(BASE + '/', { waitUntil: 'networkidle' })
  await pFermo.waitForTimeout(800)
  const conMovimentoRidotto = await pFermo.evaluate(() => ({
    altezza: document.documentElement.scrollHeight,
    sezioneAppiccicata: !!document.querySelector('#il-documento .sticky'),
    testoVisibile: !!document.body.innerText.includes('Come si compone un consenso'),
  }))
  if (conMovimentoRidotto.sezioneAppiccicata) {
    problemi.push('reduced-motion: la sezione a scorrimento bloccato è ancora attiva')
  }
  if (!conMovimentoRidotto.testoVisibile) {
    problemi.push('reduced-motion: la versione statica del documento non compare')
  }
  await ctxFermo.close()

  await browser.close()

  // ── Esito ────────────────────────────────────────────────────────────
  console.log(`\nPagine controllate: ${PAGINE.length}`)
  console.log(`Con reduced-motion la pagina passa da 15.000 px a ${conMovimentoRidotto.altezza} px (niente scorrimento bloccato).`)

  if (daRiscrivere.size) {
    console.log(giallo(`\nDocumenti ancora intestati alla vecchia società (${daRiscrivere.size}), da riscrivere alla costituzione:`))
    console.log('  ' + [...daRiscrivere].join(' · '))
  }

  if (pagineConUrlDiPubblicazione.size) {
    console.log(
      giallo(
        `\nIl sito è ospitato sotto l'organizzazione della vecchia società, e ${pagineConUrlDiPubblicazione.size} pagine citano il proprio indirizzo:`
      )
    )
    console.log('  ' + URL_PUBBLICAZIONE)
    console.log("  Non è un'intestazione: si chiude registrando il dominio proprio.")
  }

  if (erroriConsole.length) {
    console.log(rosso(`\nErrori JavaScript (${erroriConsole.length}):`))
    for (const e of [...new Set(erroriConsole)]) console.log('  ' + e)
  }

  // ── Le schermate dicono la verità? ───────────────────────────────────
  //
  // ⚠️ Perché questo controllo esiste. Il 2026-08-09 l'immagine dell'hero —
  // pubblicata sotto la didascalia «Schermata dall'applicazione, non un
  // disegno» — mostrava **due banner di allergia sovrapposti**, cioè un
  // difetto che il prodotto aveva già corretto; e `trattamenti.png` era **lo
  // stesso file** di `cartella-paziente.png`, usato come due passi diversi di
  // /come-funziona. Quelle immagini erano già state rifatte a mano il 6 agosto
  // *proprio perché scadute*, e sono riscadute in **48 ore**.
  // Un gesto manuale che va rifatto a ogni rilascio non è un rimedio: è un
  // debito con la scadenza mobile. Qui si controllano le due cose che una
  // macchina può controllare — che siano **distinte** e che vengano dal
  // **commit dell'EMR che gira adesso**. ([[sintesi-analisi-ui-ux-2026-08-09]])
  try {
    const manifesto = JSON.parse(readFileSync(join(QUI, '../public/schermate/manifesto.json'), 'utf8'))

    // (a) due passi diversi non devono mostrare la stessa immagine
    const impronte = new Map()
    for (const nome of Object.keys(manifesto.schermate)) {
      const f = join(QUI, `../public/schermate/${nome}.png`)
      const h = createHash('sha256').update(readFileSync(f)).digest('hex')
      if (impronte.has(h)) {
        problemi.push(
          `schermate: «${nome}» e «${impronte.get(h)}» sono lo STESSO file — ` +
            'due passi non possono illustrarsi con la stessa immagine',
        )
      }
      impronte.set(h, nome)
    }

    // (b) vengono dal codice che gira adesso?
    const repoEmr = join(QUI, '../../EMR')
    // ⚠️ Si confronta il commit che ha toccato per ultimo **il frontend**, non
    // HEAD: un rilascio sul `pdf-signer` non cambia una schermata, e un
    // presidio che si lamenta di cose che non cambiano l'immagine viene spento.
    if (manifesto.commitFrontendEmr && existsSync(repoEmr)) {
      const attuale = execFileSync(
        /* L'elenco dei percorsi viene da `ancora-emr.mjs`, la stessa fonte che
           il generatore usa per scriverlo nel manifesto. Due copie di questa
           regola si sono gia' scostate due volte. */
        'git', ['-C', repoEmr, 'log', '-1', '--format=%H', '--', ...PERCORSI_CHE_CAMBIANO_LA_RESA],
        { encoding: 'utf8' },
      ).trim()
      if (attuale !== manifesto.commitFrontendEmr) {
        problemi.push(
          `schermate: prese dal frontend EMR ${manifesto.commitFrontendEmr.slice(0, 8)}, ` +
            `ma l'ultimo commit su apps/web/src è ${attuale.slice(0, 8)} — ` +
            'rigenerale con `node scripts/schermate.mjs`',
        )
      }
    } else if (!existsSync(repoEmr)) {
      console.log(
        giallo('\nSchermate: non verificate contro l’EMR (il sottomodulo non è in questo clone).'),
      )
    }
  } catch (e) {
    problemi.push(`schermate: manifesto illeggibile (${e.message}) — esegui \`node scripts/schermate.mjs\``)
  }

  // ── Mappa del viso: la copia deve restare uguale all'originale ─────────
  //
  // ⚠️ PERCHÉ ESISTE. `src/lib/aree-viso.ts` è una COPIA di
  // `EMR/apps/web/src/lib/body-areas.ts` — il sito è un repo separato e non può
  // importarne uno. Una copia senza presidio è precisamente il difetto che
  // questo progetto insegue da giorni: *due copie di una regola divergono, e la
  // seconda diverge in silenzio*. Qui il silenzio sarebbe totale — cambiare una
  // coordinata nell'applicazione non romperebbe niente nel sito, i pallini
  // finirebbero solo fuori posto sopra un viso, in vetrina.
  //
  // Cosa confronta: **i dati** (codici, etichette, coordinate) e il numero del
  // ritaglio. ⛔ NON l'aspetto: colori e spaziature del sito sono diversi da
  // quelli dell'applicazione **di proposito** — è la decisione TD-15.
  paritaMappaViso(problemi, (m) => console.log(giallo('\n' + m)))
  paritaCatalogo(problemi, (m) => console.log(giallo('\n' + m)))

  if (problemi.length) {
    console.log(rosso(`\n${problemi.length} problemi:`))
    for (const p of problemi) console.log('  ' + (p.includes('a11y') ? giallo(p) : rosso(p)))
    process.exitCode = 1
  } else {
    console.log(verde('\nNessun problema: struttura, claim, accessibilità e movimento ridotto a posto.'))
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
