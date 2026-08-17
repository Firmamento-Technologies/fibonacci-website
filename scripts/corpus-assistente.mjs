#!/usr/bin/env node
/**
 * Il corpus dell'assistente: SOLO ciò che il sito pubblica davvero.
 *
 *   node scripts/corpus-assistente.mjs            # scrive out/assistente-corpus.json
 *   node scripts/corpus-assistente.mjs --verifica # non scrive, controlla e basta
 *
 * ── PERCHÉ ESISTE, E PERCHÉ NON È UN PROMPT SCRITTO A MANO ──────────────────
 * C'era già un assistente per il sito (`/website-chat` nel transcriber) con i
 * fatti scritti a mano. ✅ È stato **rimosso il 2026-08-12** (TD-99), proprio
 * perché questo script esiste: i fatti ora si estraggono dal sito costruito e
 * non possono divergere in silenzio. Quel che segue è la misura che lo motivò.
 * fatti **scritti a mano** nel prompt di sistema. Misurati l'11 agosto 2026,
 * quei fatti erano diventati falsi:
 *
 *   · prezzi «39 / 79 / 149 €» quando il listino vero è **129 / 279 / 549**
 *     — un terzo del prezzo, detto a chi sta valutando l'acquisto;
 *   · dominio `app.fibonacci.it` e caselle `info@`/`supporto@fibonacci.it`,
 *     tutti inesistenti;
 *   · una demo live «senza registrazione» che non c'è;
 *   · sei specialità, quando il prodotto è la medicina estetica;
 *   · un link a `/tutorial` che risponde **404**.
 *
 * Nessuno di questi era un errore di programmazione: erano **verità
 * invecchiate**, ed è la modalità di guasto normale di un prompt scritto a
 * mano. Vive accanto al prodotto, cambia con lui, e nessun test lo guarda.
 *
 * ⇒ Qui la conoscenza si **estrae dal sito costruito**. Conseguenze, che sono
 * il punto:
 *
 *   1. **Non può contenere informazioni non pubbliche.** Non perché lo
 *      promettiamo: perché la sorgente è letteralmente ciò che chiunque legge
 *      aprendo il sito. Non c'è un percorso da cui possa entrare il knowledge
 *      base, la wiki o il codice dell'EMR.
 *   2. **Non può invecchiare in silenzio.** Si rigenera a ogni build: se un
 *      prezzo cambia sul sito, cambia qui. Se una pagina sparisce, sparisce.
 *
 * ⛔ Volutamente NON incluso: nulla che non sia sotto `out/`. Se una cosa non è
 * pubblicata, l'assistente non deve poterla dire — e il modo di garantirlo non
 * è chiederglielo, è non dargliela.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

const RADICE = new URL('..', import.meta.url).pathname
const OUT = join(RADICE, 'out')
const DESTINAZIONE = join(OUT, 'assistente-corpus.json')

/* Pagine che NON entrano nel corpus.
 *
 * ⚠️ I documenti legali sono pubblici ma sono **testo contrattuale**: un
 * assistente che ne riassume pezzi produce parafrasi di clausole, e una
 * parafrasi di una clausola non è la clausola. Meglio rimandare alla pagina.
 *
 * 🔴 **L'elenco si legge dalla cartella, e c'è un motivo misurato.** Scritto a
 * mano ne conteneva cinque su sei: mancava `/sicurezza/`. Non era una svista
 * innocua — è la pagina **più lunga del sito** (26.022 caratteri contro 11.644
 * della seconda), e con quella mole finiva prima in classifica su domande che
 * non c'entravano niente, «a cosa serve Fibonacci?» e «dove sono i dati?»
 * comprese. ⇒ Una lista scritta a mano accanto a una cartella che cambia è la
 * stessa modalità di guasto del prompt scritto a mano: diverge in silenzio.
 */
const LEGALI = join(RADICE, 'src', 'app', '(legale)')

function paginaLegali() {
  if (!existsSync(LEGALI)) return []
  return readdirSync(LEGALI, { withFileTypes: true })
    .filter((v) => v.isDirectory())
    .map((v) => `/${v.name}/`)
}

/* ⚠️ `/404` NON è il nome della pagina d'errore nel costruito: Next.js genera
 * anche `/_not-found/`, e il 2026-08-12 quella pagina era **dentro il corpus**.
 * Non è un dettaglio di igiene: l'assistente mostra sempre le fonti, quindi
 * poteva citare una pagina d'errore come fonte di una risposta. Restano
 * entrambi i nomi perché esiste anche `out/404.html`. */
const ESCLUSE = [...paginaLegali(), '/404', '/_not-found', '/index.txt']

/**
 * Il contenuto della pagina, senza la parte che si ripete ovunque.
 *
 * 🔴 **Misurato il 12 agosto 2026, e cambiava tutto.** Prima si prendeva la
 * pagina intera: su `/prezzi/` sono **55.314** caratteri, di cui solo **4.368**
 * sono la pagina — il resto è navigazione e piè di pagina, identici su tutte e
 * 37. Conseguenza: la parola «prezzi» compariva in **37 pagine su 37** e
 * smetteva di distinguere qualcosa. Chiedendo «quanto costa Fibonacci?»
 * l'assistente pescava la home e rispondeva *«il listino è pubblico, ma non è
 * riportato negli estratti»* — **avendo i prezzi nel corpus**.
 *
 * ⇒ Il rimedio non era pesare meglio le parole: era smettere di contare il
 * menu come contenuto.
 */
function contenutoPrincipale(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  return rimuoviFuoriCorpus(m ? m[1] : html)
}

/**
 * Via i pezzi di **interfaccia** che stanno dentro `<main>`.
 *
 * 🔴 **Misurato il 2026-08-12: l'assistente leggeva sé stesso.** Il suo widget
 * vive dentro `<main>`, quindi le sue etichette e le sue domande di esempio
 * finivano nel corpus: **520 caratteri** dentro `/domande/`, e **una delle tre
 * occorrenze di «costa»** su quella pagina era la scritta del pulsante
 * *«Quanto costa?»* — non una risposta, un bottone. Con il widget anche sulla
 * home il conto raddoppiava, e su una domanda di prezzo avrebbe spinto in alto
 * due pagine che il prezzo non lo dicono.
 *
 * ⇒ È lo stesso principio per cui si prende solo `<main>`: **ciò che serve a
 * usare il sito non è ciò che il sito dice**. La navigazione stava fuori per
 * costruzione, questi pezzi vanno marcati a mano — `data-fuori-corpus` — perché
 * sono dentro il contenuto.
 *
 * ⚠️ Non si usa una regex sola: `<div>…</div>` annidati la ingannerebbero
 * tagliando al primo `</div>` e lasciando dentro metà widget. Qui si conta la
 * profondità, che è l'unico modo corretto senza un parser vero.
 */
export function rimuoviFuoriCorpus(html) {
  const apertura = /<([a-z][a-z0-9]*)\b[^>]*\sdata-fuori-corpus[\s=>]/i
  let fuori = html
  for (let giro = 0; giro < 50; giro++) {
    const m = fuori.match(apertura)
    if (!m) return fuori
    const tag = m[1]
    const dentro = new RegExp(`</?${tag}\\b[^>]*>`, 'gi')
    dentro.lastIndex = m.index
    let profondita = 0
    let fine = -1
    for (let t = dentro.exec(fuori); t; t = dentro.exec(fuori)) {
      profondita += t[0][1] === '/' ? -1 : 1
      if (profondita === 0) {
        fine = t.index + t[0].length
        break
      }
    }
    // Tag non chiuso: si taglia fino in fondo, che è meglio che lasciarlo entrare.
    fuori = fuori.slice(0, m.index) + ' ' + (fine === -1 ? '' : fuori.slice(fine))
  }
  return fuori
}

/* Le entità con un nome. Poche, perché sono le uniche che una regola numerica
 * non può risolvere da sé. */
const NOMINATE = { nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }

/**
 * Le entità HTML, decodificate **per costruzione** e non per elenco.
 *
 * 🔴 **Misurato il 2026-08-12, ed è un errore istruttivo.** L'elenco scritto a
 * mano gestiva `&#39;` e `&apos;` — e nel sito costruito ce ne sono **zero**.
 * L'unica forma che Next.js emette è l'esadecimale `&#x27;`, di cui c'erano
 * **983 occorrenze**: il decodificatore copriva la forma che non compare mai e
 * mancava l'unica che compare. Nel corpus finiva *«l&#x27;ha fatta»*, cioè
 * l'assistente leggeva — e poteva citare — un apostrofo scritto in esadecimale.
 *
 * ⇒ Le forme numeriche ora si risolvono con una regola, non aggiungendo il
 * caso che abbiamo visto: **è la terza volta in questo stesso file che un
 * elenco scritto a mano diverge da ciò che esiste davvero** (i legali senza
 * `/sicurezza/`, il prompt del vecchio assistente, questo). E ciò che l'elenco
 * non può garantire lo garantisce il presidio a valle, che boccia **qualunque**
 * entità residua: se domani ne comparisse una forma nuova diventa rossa,
 * invece di entrare nel corpus in silenzio.
 *
 * ⚠️ L'ordine conta: prima le numeriche, poi le nominate. Al contrario,
 * `&amp;#x27;` — che nella pagina è il **testo** «&#x27;» — verrebbe prima
 * ridotto a `&#x27;` e poi decodificato in un apostrofo, cioè si cambierebbe
 * ciò che la pagina dice.
 */
function decodificaEntita(testo) {
  return testo
    .replace(/&#x([0-9a-f]+);/gi, (_, esa) => String.fromCodePoint(parseInt(esa, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (intero, nome) => NOMINATE[nome.toLowerCase()] ?? intero)
}

/** Da HTML a testo leggibile: via script, stile e marcatura. */
function testoDaHtml(html) {
  const senzaTesta = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
  return decodificaEntita(senzaTesta.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

/* ⚠️ Anche il titolo va decodificato, e il 2026-08-12 non lo era: nel corpus
 * appena costruito stava «Catalogo farmaci: com&#x27;è aggiornato». Il difetto
 * è lo stesso di `testoDaHtml`, ma è sopravvissuto al rimedio **perché il
 * presidio guardava solo `testo`** — e si è visto solo mettendo i titoli in un
 * elenco da dare a un modello. ⇒ ora `problemiDelCorpus` controlla entrambi i
 * campi: un presidio che copre metà della struttura dice «sano» a metà prezzo. */
function titoloDaHtml(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i)
  return m ? decodificaEntita(m[1]).replace(/\s+\|\s+Fibonacci.*$/, '').trim() : ''
}

/**
 * La `<meta name="description">` della pagina: una riga che dice di cosa parla.
 *
 * 🔑 **Aggiunta il 2026-08-12 perché una misura l'ha chiesta.** Il banco delle
 * domande (`EMR/services/pdf-signer/eval_assistenza.py`) ha mostrato che
 * l'assistente in-app sceglieva la guida sbagliata **3 volte su 11**, e due
 * erano spiegate dallo stesso motivo: nell'indice vedeva **solo il titolo**, e
 * «Body map 2D» o «Catalogo farmaci» non contengono le parole con cui la
 * domanda si presenta. La descrizione invece sì — quella del catalogo dice alla
 * lettera *«perché «forza sync» è disabilitato»*, che era la domanda mancata.
 *
 * ⇒ Il rimedio non è stato riscrivere i titoli per compiacere un modello — che
 * li avrebbe resi peggiori per le persone — ma **dargli la riga che esiste già,
 * scritta per gli umani e mantenuta insieme alla guida**.
 */
function descrizioneDaHtml(html) {
  const m = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
  return m ? decodificaEntita(m[1]).trim() : ''
}

async function* pagine(dir) {
  for (const voce of await readdir(dir, { withFileTypes: true })) {
    const intero = join(dir, voce.name)
    if (voce.isDirectory()) yield* pagine(intero)
    else if (voce.name.endsWith('.html')) yield intero
  }
}

export function percorsoPubblico(file, radice = OUT) {
  const rel = '/' + relative(radice, file).replace(/\\/g, '/')
  return rel.replace(/index\.html$/, '').replace(/\.html$/, '/')
}

export function daEscludere(percorso, escluse = ESCLUSE) {
  return escluse.some((e) => percorso === e || percorso.startsWith(e))
}

/* Pavimento, non bersaglio: serve a intercettare un corpus **crollato** (un
 * `out/` mezzo costruito, uno spoglio che smette di trovare il contenuto), non
 * a fissare quante pagine debba avere il sito.
 * ⚠️ Sceso da 25 a 15 il 2026-08-12: il manuale è uscito dal sito pubblico
 * (20 pagine su 41), e un pavimento tarato su un corpus che comprendeva le
 * guide sarebbe rosso per costruzione — cioè spento al primo giorno. */
const MINIMO_PAGINE = 15

/**
 * Le guide che ⛔ NON devono stare nel corpus pubblico.
 *
 * ⚠️ **QUESTA REGOLA È STATA ROVESCIATA IL 2026-08-12**, e il perché conta più
 * della regola: fino a quel giorno qui si pretendeva che le 19 guide **ci
 * fossero**, perché l'assistente del sito doveva saper rispondere sul prodotto.
 * L'utente ha poi chiesto di togliere il manuale dal sito — *«diciamo alla
 * concorrenza tutto quello che abbiamo e ci possono copiare»* — e allora quel
 * controllo stava garantendo esattamente la fuga: `assistente-corpus.json` è
 * **pubblicato**, quindi chiunque poteva scaricarsi le 19 guide per intero
 * senza nemmeno aprire una pagina.
 *
 * Ora il manuale vive in `manuale/manuale-corpus.json` (fuori da `out/`, vedi
 * `scripts/manuale-privato.mjs`) e lo leggono solo i servizi autenticati.
 *
 * La verità su quali guide esistono sta in `src/lib/docs-data.ts`, non nella
 * cartella dei `.md`: una guida senza voce in `DOCS` non viene costruita.
 */
function guideAttese() {
  const sorgente = readFileSync(join(RADICE, 'src', 'lib', 'docs-data.ts'), 'utf-8')
  /* Slug **e titolo**: il titolo serve al controllo per contenuto, che è
     l'unico che prende una guida rientrata senza il suo indirizzo. */
  const RE = /slug:\s*'([a-z0-9-]+)',\s*(?:\/\/[^\n]*\n\s*)*title:\s*'((?:[^'\\]|\\.)*)'/g
  const guide = [...sorgente.matchAll(RE)].map((m) => ({
    slug: m[1],
    titolo: m[2].replace(/\\'/g, "'"),
  }))
  // ⛔ Zero guide lette NON vuol dire «non ci sono guide»: vuol dire che la
  // lettura è fallita — file rinominato, formato cambiato. Un presidio che in
  // quel caso dicesse «nessuna trapelata» sarebbe l'ennesimo controllo che
  // misura una tabella vuota e per questo non può fallire.
  if (guide.length === 0) {
    throw new Error('`docs-data.ts` non espone nessuna guida: il presidio non può dire niente.')
  }
  return guide
}

/**
 * Il corpus è utilizzabile? Ritorna l'elenco dei problemi, vuoto se sano.
 *
 * ⚠️ **Esiste perché `--verifica` non poteva diventare rosso**: fino al
 * 2026-08-12 stampava i conteggi e ritornava, quindi metterlo in CI avrebbe
 * aggiunto un passo verde qualunque cosa fosse successo — la forma di presidio
 * che questo progetto ha già preso più volte.
 */
/**
 * La frase più lunga del corpo di una guida, normalizzata come il testo
 * pubblico. È l'impronta della guida: se **questa** compare in una pagina di
 * vendita, qualcuno ha incollato.
 *
 * ⛔ Ritorna `null` se il file non c'è o non ha frasi abbastanza lunghe: in quel
 * caso la guida **non viene controllata**, e va detto invece di far finta.
 * ⚠️ Si legge il markdown italiano (`src/content/docs/<slug>.md`), che è la
 * sorgente; le traduzioni ne discendono.
 */
function passaggioDistintivo(slug) {
  let markdown
  try {
    markdown = readFileSync(join(RADICE, 'src', 'content', 'docs', `${slug}.md`), 'utf-8')
  } catch {
    return null
  }
  const frasi = markdown
    .replace(/```[\s\S]*?```/g, ' ') // via i blocchi di codice
    .replace(/[#>*_`|-]+/g, ' ') // via la punteggiatura di markdown
    .split(/(?<=[.!?])\s+/)
    .map((f) => f.replace(/\s+/g, ' ').trim())
    .filter((f) => f.length >= 80)
  if (frasi.length === 0) return null
  return frasi.sort((a, b) => b.length - a.length)[0]
}

export function problemiDelCorpus(voci, guide = guideAttese()) {
  const problemi = []

  if (voci.length < MINIMO_PAGINE) {
    problemi.push(`solo ${voci.length} pagine nel corpus (minimo ${MINIMO_PAGINE}): è crollato.`)
  }

  /* ⛔ Il manuale NON deve entrare qui. Due modi di rientrare, e vanno chiusi
     tutti e due: una pagina sotto `/documentazione/` (se qualcuno rimette la
     rotta pubblica) e un pezzo di guida finito dentro un'altra pagina. */
  const trapelate = voci.filter((v) => v.percorso.startsWith('/documentazione'))
  if (trapelate.length) {
    problemi.push(
      `${trapelate.length} pagine del manuale sono nel corpus PUBBLICO ` +
        `(${trapelate.slice(0, 3).map((v) => v.percorso).join(', ')}…). ` +
        'Il corpus è servito su https://fibonaccimedica.it/assistente-corpus.json: ' +
        'metterci il manuale vuol dire pubblicarlo.',
    )
  }

  /* La prova per CONTENUTO, non per indirizzo: una guida può rientrare anche
     senza il suo percorso — per esempio se qualcuno ne incolla un pezzo in una
     pagina di vendita.
     
     🔴 **Cercava il TITOLO, e il 2026-08-17 è diventato rosso a torto.** Quel
     giorno il sito ha cominciato a promuovere due funzioni che hanno anche una
     guida: «Analisi del volto» e «Atlante anatomico 3D». Sono i **nomi delle
     funzioni**, e compaiono in una pagina di vendita e in una voce di listino
     esattamente come deve essere: il presidio ha letto quei due nomi e ha
     detto «il manuale è trapelato», mentre del manuale non c'era una riga.
     ⚠️ Il costo di un falso rosso è lo stesso di un falso verde e si paga
     dopo: chi lo vede due volte lo spegne, e da lì in poi il controllo non
     esiste più. ⇒ non si allenta la regola, si **misura la cosa giusta**.
     
     🔑 Ora si cerca un **passaggio distintivo del corpo** della guida, non il
     suo titolo: la frase più lunga di ogni capitolo (≥ 80 caratteri), che
     nessuno scrive per caso due volte. Nominare una funzione resta lecito;
     **incollarne un paragrafo** no, ed è la cosa che questo presidio è nato
     per prendere. */
  const testoPubblico = voci.map((v) => `${v.titolo} ${v.testo}`).join(' \n ')
  const titoliTrapelati = guide
    .filter((g) => {
      const passaggio = passaggioDistintivo(g.slug)
      return passaggio && testoPubblico.includes(passaggio)
    })
    .map((g) => g.slug)
  if (titoliTrapelati.length) {
    problemi.push(
      `il testo di ${titoliTrapelati.length} guide compare nel corpus pubblico: ` +
        `${titoliTrapelati.join(', ')}.`,
    )
  }

  // Qualunque entità residua, non solo quelle già viste: è ciò che rende la
  // decodifica auto-sorvegliata invece di curata caso per caso.
  const RESIDUE = /&(?:[a-z]+|#\d+|#x[0-9a-f]+);/gi
  for (const v of voci) {
    // ⚠️ Tutti i campi di testo, non uno: guardando solo `testo`, questo
    // controllo ha dichiarato sano un corpus in cui 2 titoli su 40 portavano
    // `&#x27;`. `descrizione` è entrata dopo, e la lezione vale anche per lei.
    for (const campo of ['titolo', 'descrizione', 'testo']) {
      const trovate = (v[campo] ?? '').match(RESIDUE)
      if (trovate) {
        const forme = [...new Set(trovate)].slice(0, 5).join(' ')
        problemi.push(
          `${v.percorso} (${campo}): ${trovate.length} entità HTML non decodificate (${forme}).`,
        )
      }
    }
  }

  return problemi
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("⛔ `out/` non esiste: costruisci il sito prima (npm run build).")
    process.exit(1)
  }
  const soloVerifica = process.argv.includes('--verifica')

  const voci = []
  for await (const file of pagine(OUT)) {
    const percorso = percorsoPubblico(file)
    if (daEscludere(percorso)) continue
    const html = readFileSync(file, 'utf-8')
    const testo = testoDaHtml(contenutoPrincipale(html))
    // Pagine quasi vuote (redirect, gusci) non aggiungono niente e diluiscono.
    if (testo.length < 200) continue
    voci.push({
      percorso,
      titolo: titoloDaHtml(html),
      descrizione: descrizioneDaHtml(html),
      testo,
    })
  }

  voci.sort((a, b) => a.percorso.localeCompare(b.percorso))
  const corpus = { generato_da: 'scripts/corpus-assistente.mjs', pagine: voci }

  const parole = voci.reduce((n, v) => n + v.testo.split(' ').length, 0)
  console.log(`   pagine nel corpus: ${voci.length}`)
  console.log(`   parole totali:     ${parole.toLocaleString('it-IT')}`)

  // ⛔ Il controllo vale in ENTRAMBI i modi, e non solo con `--verifica`: se
  // valesse solo lì, un corpus rotto verrebbe comunque **scritto** dal
  // `postbuild` e pubblicato, e la CI lo scoprirebbe dopo. Qui invece un corpus
  // rotto fa fallire la build che lo ha prodotto, ovunque venga costruita.
  const problemi = problemiDelCorpus(voci)
  if (problemi.length) {
    console.error('⛔ il corpus non è utilizzabile:')
    for (const p of problemi) console.error(`   · ${p}`)
    process.exit(1)
  }

  if (soloVerifica) {
    console.log('   ✅ corpus sano')
    return
  }

  writeFileSync(DESTINAZIONE, JSON.stringify(corpus), 'utf-8')
  console.log(`   scritto: ${relative(RADICE, DESTINAZIONE)}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error('⛔', e.message)
    process.exit(1)
  })
}
