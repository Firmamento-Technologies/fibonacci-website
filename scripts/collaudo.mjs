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
import { esigiStile } from './lib/stile-caricato.mjs'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

import { schermateFresche } from './schermate-fresche.mjs'
import { paritaMappaViso } from './parita-viso.mjs'
import { paritaCatalogo } from './parita-catalogo.mjs'
import { paritaFarmaci } from './parita-farmaci.mjs'
import { paritaProdotto } from './parita-prodotto.mjs'
import { paritaListino } from './parita-listino.mjs'
import { classiEsistono } from './classi-esistono.mjs'
import { nienteLineetta } from './niente-lineetta.mjs'
import { nienteDatiElenco } from './niente-dati-elenco.mjs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))

/**
 * Le lingue del sito, lette da `src/lib/lingua.ts`, che è la fonte.
 *
 * ⛔ NON riscritte a mano qui: un elenco copiato è un elenco che divergerà, e in
 * questo repo è già la causa scritta di due presidi rotti. Lo stesso file legge
 * già `site-config.ts` allo stesso modo (vedi il controllo sui canali di
 * contatto): il precedente c'è, e questo lo segue.
 * ⚠️ Se la lettura fallisce si **muore**: un ripiego silenzioso su `['it']`
 * farebbe passare per buona una pagina tradotta che dichiara la lingua sbagliata,
 * cioè spegnerebbe il controllo proprio nel caso per cui esiste.
 */
const LINGUE_SITO = (() => {
  const src = readFileSync(join(QUI, '..', 'src/lib/lingua.ts'), 'utf8')
  const m = src.match(/LINGUE_SITO\s*=\s*\[([^\]]+)\]/)
  if (!m) throw new Error("collaudo: LINGUE_SITO non è leggibile da src/lib/lingua.ts")
  return m[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean)
})()

/**
 * Che lingua deve dichiarare questo percorso. `/de/prezzi/` → `de`, `/prezzi/`
 * → `it` (l'italiano non ha prefisso).
 */
function linguaAttesaPer(percorso) {
  const primo = percorso.split('/').filter(Boolean)[0]
  return LINGUE_SITO.includes(primo) && primo !== 'it' ? primo : 'it'
}

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

/* 🔴 **Il modulo di contatto non deve poter dire «inviato» senza endpoint.**
 * Misurato dal vivo il 2026-08-12, e costato un contatto vero: `LEAD_API_URL`
 * era `''`, e `fetch('')` **non fallisce** — manda la POST alla pagina
 * corrente, che su un sito statico risponde **200**. Quindi `risposta.ok` era
 * vero, il ripiego via posta non scattava mai, e a chi compilava il modulo
 * usciva *«Ti scriviamo entro un giorno lavorativo»* mentre il messaggio non
 * era andato da nessuna parte.
 *
 * ⚠️ Il ripiego esisteva ed era scritto bene: copriva «l'endpoint non
 * risponde», non «l'endpoint non c'è». Un controllo sul comportamento a
 * schermo non lo avrebbe preso — il modulo si comportava «bene». Si prende
 * solo guardando che la chiamata sia **protetta prima di partire**. */
function moduloProtettoSenzaEndpoint() {
  const src = readFileSync(join(QUI, '..', 'src', 'components', 'ModuloDemo.tsx'), 'utf-8')
  const i = src.indexOf('await fetch(LEAD_API_URL')
  if (i === -1) return 'ModuloDemo non chiama piu fetch(LEAD_API_URL): controllo da riscrivere'
  const prima = src.slice(0, i)
  if (!/if\s*\(!LEAD_API_URL\)\s*throw/.test(prima)) {
    return 'ModuloDemo chiama fetch(LEAD_API_URL) SENZA aver prima escluso il valore vuoto: '
      + 'con URL vuoto la POST va alla pagina, risponde 200 e il modulo dichiara «inviato»'
  }
  return null
}

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
 * ⚠️ **SERVIVANO A VISITARLE, ORA SERVONO A PRETENDERE CHE NON RISPONDANO.**
 * Fino al 2026-08-12 questo elenco alimentava `PAGINE`; l'utente ha poi chiesto
 * di togliere il manuale dal sito pubblico, e lo stesso elenco è diventato la
 * lista degli indirizzi che **devono dare 404**. Il modo di leggerlo non
 * cambia, e il motivo per cui si legge dal sorgente nemmeno: un elenco scritto
 * a mano qui aveva già fallito in silenzio (2026-08-09, le guide passarono da
 * 7 a 14 e le nuove non venivano aperte da niente). Se domani nasce una guida
 * nuova, questo presidio verifica **anche lei**.
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

/* I titoli delle guide: servono a cercare il manuale **per contenuto** dentro
 * il corpus pubblico, non solo per indirizzo. Una guida può rientrare senza il
 * suo percorso — basta che qualcuno ne incolli un pezzo in una pagina — e in
 * quel caso il controllo sugli indirizzi resterebbe verde. */
function titoliDelleGuide() {
  const sorgente = readFileSync(join(QUI, '..', 'src', 'lib', 'docs-data.ts'), 'utf8')
  const daDocsInPoi = sorgente.slice(sorgente.indexOf('export const DOCS'))
  const RE = /slug:\s*'[a-z0-9-]+',\s*(?:\/\/[^\n]*\n\s*)*title:\s*'((?:[^'\\]|\\.)*)'/g
  return [...daDocsInPoi.matchAll(RE)].map((m) => m[1].replace(/\\'/g, "'"))
}

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
  /* ⚠️ Aggiunta il 2026-08-16 insieme alla pagina: una pagina fuori da questo
     elenco non è collaudata da nessuno, e il cancello resta verde. Stessa
     dimenticanza già corretta in `altezza-pagine.mjs`. */
  '/conformita-europea',
  /* ⚠️ Aggiunta il 2026-08-16 **insieme** alla pagina, non dopo: è la pagina che
     il medico raggiunge cliccando dall'email del canale di contatto (TD-166), ed
     è l'unico posto dove possiamo parlare del gestionale. Se resta fuori da
     questo elenco, un difetto lì non lo vede nessuno e il cancello resta verde. */
  '/medici',
  /* ⚠️ La scheda del medico d'esempio: è l'unica pagina dove vive il modulo di
     contatto (TD-166). Aggiunta insieme al modulo, ⛔ non dopo. */
  '/pazienti/medico/studio-dimostrativo',
  '/richiedi-una-demo', '/verifica', '/domande', '/intelligenza-artificiale',
  '/chi-siamo', '/privacy', '/cookie', '/dpa', '/termini',
  '/sub-responsabili', '/sicurezza',
  /* Le tre dell'8 agosto. Una pagina che non è in questo elenco non viene
     controllata da niente: non è un dettaglio di manutenzione, è il motivo
     per cui i difetti del 7 agosto erano rimasti in piedi per settimane. */
  '/che-software-serve', '/autovalutazione', '/integrazioni',
  '/per-le-societa-scientifiche',
  /* Il lato paziente (TD-95). ⚠️ La scheda di esempio è `noindex` e fuori dal
     sitemap **di proposito**, ma va comunque collaudata: è la pagina su cui si
     costruiscono tutte le altre, ed è esattamente il caso in cui «non è
     indicizzata» diventerebbe la scusa per non controllarla. */
  '/pazienti/medico/studio-dimostrativo',
  '/pazienti', '/pazienti/verificare-un-medico', '/pazienti/prima-di-un-trattamento',
  '/pazienti/consenso-informato', '/pazienti/privacy',
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
  /* Controllo di SORGENTE, prima ancora di aprire una pagina: il difetto che
   * chiude non si vede navigando, perche' a schermo il modulo si comporta
   * «bene» — dichiara inviato. Vedi `moduloProtettoSenzaEndpoint`. */
  const guasto = moduloProtettoSenzaEndpoint()
  if (guasto) problemi.push(`MODULO DI CONTATTO: ${guasto}`)

  const daRiscrivere = new Set()
  const pagineConUrlDiPubblicazione = new Set()
  const erroriConsole = []
  page.on('pageerror', (e) => erroriConsole.push(`${page.url()} → ${e.message}`))

  for (const percorso of PAGINE) {
    const risposta = await page.goto(BASE + percorso, { waitUntil: 'networkidle', timeout: 45000 })
    /* ⚠️ Sul PRIMO indirizzo, e prima di qualunque misura: una pagina senza
       CSS risponde 200 e si misura benissimo. Vedi `lib/stile-caricato.mjs`. */
    if (percorso === PAGINE[0]) await esigiStile(page, 'collaudo')
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
    /* ⚠️ Si guarda la SOTTOETICHETTA PRIMARIA, non la stringa intera, e la
       differenza è costata 26 falsi rossi. Questo controllo pretendeva
       `lang === 'it'`; col multilingua il layout emette `TAG_LINGUA[LINGUA]`,
       cioè **`it-IT`** — che è valido per BCP 47 e più preciso, non un difetto.
       Il cancello era rimasto indietro rispetto a una modifica voluta, e ha
       segnato rosse tutte le pagine del sito.
       🔑 Il senso del controllo resta intatto: serve a impedire che una pagina
       tradotta dichiari la lingua sbagliata (un lettore di schermo leggerebbe il
       tedesco con la pronuncia italiana). Per quello basta la sottoetichetta
       primaria: `de`, `de-DE` e `de-AT` sono tutte «tedesco», e distinguerle
       qui vorrebbe dire ricodificare qui l'elenco delle varianti ammesse.
       ⛔ Ciò che NON va allentato è il confronto con la lingua ATTESA per quel
       percorso: `lang` vuoto o di un'altra lingua resta un problema. */
    const linguaAttesa = linguaAttesaPer(percorso)
    const linguaBase = (struttura.lang || '').toLowerCase().split('-')[0]
    if (linguaBase !== linguaAttesa)
      problemi.push(`${percorso}: lang="${struttura.lang}" (attesa "${linguaAttesa}")`)
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

  /* ── ⛔ IL MANUALE NON DEVE ESSERE PUBBLICO ──────────────────────────────
   *
   * Richiesta dell'utente, 2026-08-12: *«non deve essere online sul sito
   * altrimenti diciamo alla concorrenza tutto quello che abbiamo e ci possono
   * copiare»*. Le guide restano e si leggono dalla dashboard, a sessione
   * autenticata.
   *
   * ⚠️ I CANALI ERANO DUE, e il secondo non si vede guardando il sito:
   *   1. le pagine `/documentazione/*`;
   *   2. **`assistente-corpus.json`**, che il sito pubblica di proposito (per
   *      rendere verificabile che l'assistente non sa niente di privato) e che
   *      conteneva **il testo integrale delle 19 guide**. Chiunque poteva
   *      scaricarlo senza aprire nemmeno una pagina.
   * Chiudere solo il primo avrebbe dato l'impressione di aver chiuso, ed è
   * esattamente il genere di mezza correzione che questo presidio esiste per
   * impedire.
   *
   * ⛔ Non si controlla «il link non c'è più»: si controlla che l'indirizzo
   * **non risponda** e che il testo **non ci sia**. Un link tolto e una pagina
   * ancora servita è lo stato peggiore: invisibile a noi, raggiungibile da chi
   * la cerca. */
  {
    const nonDovrebbero = ['/documentazione', ...GUIDE]
    for (const percorso of nonDovrebbero) {
      const r = await page.goto(BASE + percorso, { waitUntil: 'domcontentloaded', timeout: 45000 })
      const stato = r?.status() ?? 0
      if (stato < 400) {
        problemi.push(`${percorso}: risponde ${stato} ed è pubblica — il manuale non deve stare sul sito`)
      }
    }

    /* Il corpus: si scarica come lo scaricherebbe un estraneo, e ci si cerca
       dentro il manuale — per indirizzo E per titolo. */
    const corpus = await page.evaluate(async (base) => {
      const r = await fetch(`${base}/assistente-corpus.json`)
      if (!r.ok) return { errore: r.status }
      const d = await r.json()
      return { pagine: (d.pagine ?? []).map((v) => ({ percorso: v.percorso, titolo: v.titolo, testo: v.testo })) }
    }, BASE)

    if (corpus.errore) {
      problemi.push(`assistente-corpus.json: HTTP ${corpus.errore} — il presidio non può dire niente`)
    } else {
      const perIndirizzo = corpus.pagine.filter((v) => v.percorso.startsWith('/documentazione'))
      if (perIndirizzo.length) {
        problemi.push(
          `assistente-corpus.json: ${perIndirizzo.length} pagine del manuale nel corpus PUBBLICO`,
        )
      }
      const tutto = corpus.pagine.map((v) => `${v.titolo} ${v.testo}`).join(' \n ')
      const titoli = titoliDelleGuide()
      const dentro = titoli.filter((t) => tutto.includes(t))
      if (dentro.length) {
        problemi.push(
          `assistente-corpus.json: il testo di ${dentro.length} guide è nel corpus pubblico (${dentro[0]}…)`,
        )
      }
      if (titoli.length === 0) {
        problemi.push('presidio rotto: non ho letto nessun titolo di guida da docs-data.ts')
      }
    }

    /* E il sitemap non deve invitare nessuno a cercarle. */
    const sitemap = await page.evaluate(async (base) => {
      const r = await fetch(`${base}/sitemap.xml`)
      return r.ok ? await r.text() : ''
    }, BASE)
    if (sitemap.includes('/documentazione')) {
      problemi.push('sitemap.xml: contiene ancora /documentazione — lo stiamo dicendo ai motori')
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

  /* ── Nessuna specialità medica scritta fissa nei dati strutturati (TD-108) ──
   *
   * 🔴 La scheda di ogni medico dichiarava a Google
   * `medicalSpecialty: PlasticSurgery`, **uguale per chiunque**: una qualifica
   * che quel medico può benissimo non avere — la medicina estetica non è
   * chirurgia plastica — asserita nel formato che i motori trattano come parola
   * del titolare del sito, su una pagina che esiste **per essere verificabile**.
   *
   * ⚠️ **Perché il controllo è statico e non sulla pagina resa**: i dati
   * strutturati escono **solo** per un medico non-di-esempio, e finché non
   * esiste un medico vero **nessuna pagina costruita li contiene** ⇒ un
   * controllo sull'HTML sarebbe verde per assenza, cioè non guarderebbe niente.
   * Questo invece diventa rosso il giorno in cui qualcuno riscrive il valore,
   * anche se in rete non si vede ancora nulla.
   *
   * ⛔ Non si sostituisce con un altro valore: schema.org/MedicalSpecialty è
   * un'enumerazione chiusa di 43 voci e **non ne ha una per la medicina
   * estetica** (verificato alla fonte il 2026-08-12). Si dichiara quando sarà un
   * dato del medico, scelto da lui. */
  {
    const colpevoli = []
    for (const f of [...walkSrc()]) {
      const testo = readFileSync(f, 'utf8')
      // Solo le righe di CODICE: un commento che spiega perché non si mette
      // dev'essere permesso, altrimenti il presidio vieta la propria spiegazione.
      for (const riga of testo.split('\n')) {
        const pulita = riga.trim()
        if (pulita.startsWith('*') || pulita.startsWith('//')) continue
        if (/medicalSpecialty\s*:/.test(pulita)) colpevoli.push(`${f.split('/src/')[1]}: ${pulita.slice(0, 60)}`)
      }
    }
    if (colpevoli.length) {
      problemi.push(
        `dati strutturati: specialità medica scritta fissa (${colpevoli.length}) — ` +
          `una qualifica che il medico può non avere: ${colpevoli.join(' · ')}`,
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

    /* ── L'origine su cui il sito è PUBBLICATO ────────────────────────────
     *
     * Serve solo ai valori **relativi**: un percorso come `/contatto/lead` non
     * ha un host suo, e va risolto sull'origine che il browser di chi compila
     * il modulo sta già usando.
     *
     * ⛔ Quell'origine NON si scrive qui a mano. Sarebbe un secondo posto da
     * aggiornare al prossimo cambio di dominio, cioè la stessa trappola che il
     * commento di `demoUrlDelSito()` descrive: un controllo che misura un
     * indirizzo che il sito non usa più. Si ricava dal recapito pubblico —
     * l'unico dominio che il sito dichiara come proprio — e **si verifica che
     * serva davvero il sito** prima di fidarsene. Se non risponde, la domanda
     * resta senza risposta e lo si dice: non si inventa un rosso. */
    let origineNota
    const origineDelSitoPubblicato = async () => {
      if (origineNota !== undefined) return origineNota
      const dominio = (leggi('CONTACT_EMAIL') ?? '').split('@')[1]?.trim()
      if (!dominio) return (origineNota = null)
      const origine = `https://${dominio}`
      try {
        const r = await fetch(`${origine}/`, { method: 'HEAD', signal: AbortSignal.timeout(15000) })
        return (origineNota = r.ok ? origine : null)
      } catch {
        return (origineNota = null)
      }
    }

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

      /* ⚠️ E il QUARTO stato, che è costato un rosso su una cosa sana il
         2026-08-13: il valore può essere un **percorso relativo**.
         `LEAD_API_URL` vale `/contatto/lead`, e in Node `fetch('/contatto/lead')`
         non è una richiesta che fallisce — è un `TypeError: Failed to parse
         URL`, che il `catch` qui sotto raccontava come «l'indirizzo non
         risponde». Misurato: quell'endpoint risponde **405 a HEAD e 400 a POST
         `{}`**, cioè è vivo e valida pure il corpo. Il presidio dichiarava
         morto il canale dei contatti mentre funzionava, ed è stato scavalcato
         con `--no-verify` **due volte in un giorno**: è esattamente così che un
         presidio smette di esistere — la terza volta nessuno lo rilegge più. */
      let assoluto = url
      const relativo = !/^[a-z][a-z0-9+.-]*:/i.test(url)
      if (relativo) {
        const origine = await origineDelSitoPubblicato()
        if (!origine) {
          console.log(
            giallo(
              `\n${nome} (${atteso}) è un percorso relativo (${url}) e il sito pubblicato non è raggiungibile da qui:\n` +
                '  non misurabile in questo giro — non è un difetto del sito, è una domanda rimasta senza risposta.',
            ),
          )
          continue
        }
        assoluto = new URL(url, origine).href
      }

      try {
        // HEAD basta: qui si chiede «questo host esiste?», non «cosa risponde».
        const r = await fetch(assoluto, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(15000) })
        if (r.status >= 500) {
          problemi.push(`${nome} (${atteso}): ${assoluto} risponde HTTP ${r.status}, e il sito lo promuove`)
        } else if (relativo && r.status === 404) {
          /* ⚠️ Sul percorso relativo il 404 è il difetto vero, e va distinto
             dal 405: l'host c'è per costruzione — è il sito stesso — quindi
             «l'host risponde» non dimostra niente. L'unica cosa che questo
             controllo può ancora dimostrare è che quel percorso sia
             **instradato** a qualcosa. Un 405 (metodo non ammesso) o un 400
             (corpo rifiutato) sono risposte di chi c'è; un 404 vuol dire che
             il modulo consegna i contatti a nessuno. */
          problemi.push(
            `${nome} (${atteso}): ${assoluto} risponde 404 — il sito manda i ${atteso} a un percorso che nessuno instrada`,
          )
        }
      } catch (e) {
        problemi.push(
          `${nome} (${atteso}): ${assoluto} non risponde (${String(e).slice(0, 60)}) — il sito offre un canale che non esiste`,
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

    /* (b) vengono dal codice che gira adesso?
     *
     * 🔄 **SPOSTATO DA BLOCCO AD AVVISO il 2026-08-16.** Il controllo non è
     * sparito: è diventato **bloccante nel rilascio** (`scripts/rilascia.mjs`),
     * che è il gesto in cui una schermata vecchia fa davvero danno. Il push non
     * pubblica niente.
     *
     * 🔴 La ragione è misurata, non teorica: fra una rigenerazione e il push
     * un'altra sessione ha committato sul frontend EMR e il cancello è tornato
     * rosso in pochi minuti, per un commit che toccava la mappa 3D — **nessuna**
     * delle cinque schermate pubblicate. Finché l'EMR è in sviluppo attivo,
     * qui è rosso quasi sempre, e un presidio sempre rosso in questo repo è
     * già stato spento due volte.
     *
     * ⛔ Non si restringe l'ancora per farlo tacere: vedi il perché, per esteso,
     * in `schermate-fresche.mjs`. */
    const freschezza = schermateFresche(join(QUI, '..'))
    if (freschezza.stato !== 'fresche') {
      console.log(giallo(`\n⚠️  Schermate: ${freschezza.motivo}`))
      console.log(giallo('   Non blocca il push. ⛔ Blocca il RILASCIO: `node scripts/rilascia.mjs`.'))
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
  paritaFarmaci(problemi, (m) => console.log(giallo('\n' + m)))
  paritaProdotto(problemi, (m) => console.log(giallo('\n' + m)))
  classiEsistono(problemi)
  nienteLineetta(problemi)
  /* 🔴 Il piu' serio: guarda il COSTRUITO e fallisce se un recapito
     dell'elenco (3.118 indirizzi di persone reali) e' finito in una pagina
     pubblicabile. Vedi la testa di `niente-dati-elenco.mjs`. */
  nienteDatiElenco(problemi)

  /* ⚠️ LE TAPPE. Il sito è un percorso: ogni sezione è una schermata con la V
     in fondo. Due cose si rompono in silenzio e le prende solo una misura sul
     reso — una tappa VUOTA (è successo: il JSON-LD di `/domande` era diventato
     una schermata bianca) e una tappa troppo alta, che manda la V sotto il
     bordo. Gira in un processo a parte perché apre un suo browser. */
  try {
    execFileSync('node', ['scripts/altezza-pagine.mjs', BASE], { stdio: 'inherit' })
  } catch {
    problemi.push('tappe: vedi `node scripts/altezza-pagine.mjs` qui sopra')
  }

  if (problemi.length) {
    console.log(rosso(`\n${problemi.length} problemi:`))
    for (const p of problemi) console.log('  ' + (p.includes('a11y') ? giallo(p) : rosso(p)))
    process.exitCode = 1
  } else {
    console.log(verde('\nNessun problema: struttura, claim, accessibilità e movimento ridotto a posto.'))
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
