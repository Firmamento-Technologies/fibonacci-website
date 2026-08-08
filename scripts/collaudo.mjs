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

const BASE = process.argv[2] ?? 'http://localhost:3210'

/* I documenti in markdown: bozze legali ereditate, da riscrivere in blocco
   quando la società esiste. */
const LEGALI = ['/privacy', '/cookie', '/dpa', '/termini', '/sub-responsabili', '/sicurezza']

const PAGINE = [
  '/', '/come-funziona', '/consensi-informati', '/prezzi', '/sicurezza-e-dati',
  '/richiedi-una-demo', '/verifica', '/domande', '/intelligenza-artificiale',
  '/chi-siamo', '/documentazione', '/privacy', '/cookie', '/dpa', '/termini',
  '/sub-responsabili', '/sicurezza',
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
  /* Le due funzioni progettate l'8 agosto 2026 e NON ancora costruite. Il sito
   * dice già «prodotto, lotto, unità» ed è vero: i campi esistono. Quello che
   * non esiste è cercarli — «dammi un lotto, ti dico chi l'ha ricevuto» — e il
   * controllo delle comunicazioni contro la L. 145/2018. Sono esattamente le
   * due righe che un cliente citerebbe dopo la firma, quindi il presidio le
   * tiene fuori finché non diventano vere. Si tolgono da qui il giorno in cui
   * si possono dimostrare, non prima. */
  { re: /ricerca\s+per\s+lotto|cerca(re)?\s+per\s+lotto|richiamo\s+del\s+lotto|tracciabilit[àa]\s+(del\s+)?lott/i, perche: 'la ricerca per lotto non è costruita' },
  { re: /comunicazion\w*\s+conform\w*|controllo\s+(di\s+)?conformit[àa]\s+delle\s+comunicazioni/i, perche: 'il controllo delle comunicazioni non è costruito' },
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

  if (problemi.length) {
    console.log(rosso(`\n${problemi.length} problemi:`))
    for (const p of problemi) console.log('  ' + (p.includes('a11y') ? giallo(p) : rosso(p)))
    process.exitCode = 1
  } else {
    console.log(verde('\nNessun problema: struttura, claim, accessibilità e movimento ridotto a posto.'))
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
