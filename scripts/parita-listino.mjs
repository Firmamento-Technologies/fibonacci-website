/**
 * Il listino della vetrina contro quello del modulo di registrazione.
 *
 * ── PERCHÉ ESISTE, E PERCHÉ NON BASTAVA RIALLINEARE ─────────────────────────
 * Il prezzo vive in due posti: `website/src/lib/listino.ts` (quello che il
 * mercato legge) e `EMR/apps/web/src/lib/listino.ts` (quello che vede chi si
 * sta registrando, nel selettore del piano).
 *
 * 🔴 **Sono divergiti due volte, e la seconda dopo essere stati corretti.**
 *   · fino al 2026-08-09 i prezzi erano scritti a mano dentro `signup.tsx`:
 *     «€79/mese» e «€149» contro 99 e 189 pubblicati;
 *   · furono spostati in `listino.ts` e riallineati — ma **copiati**, non
 *     collegati. Quando l'11 agosto il listino è passato a **129 · 279 · 549**,
 *     il file dell'applicazione è rimasto a **99 · 189**: per un giorno intero
 *     chi apriva la registrazione leggeva **€99** per una cosa che ne costa 129.
 *
 * ⇒ La lezione non è «stai più attento»: è che **una copia riallineata a mano
 * diverge di nuovo alla prima modifica**, e nessuno se ne accorge perché niente
 * la guarda. Questo confronto è ciò che rende la copia sostenibile.
 *
 * ⚠️ Si confrontano i **numeri**, non le frasi: le descrizioni possono
 * legittimamente essere diverse (la vetrina vende, il modulo riassume). A
 * divergere in silenzio è il prezzo, ed è l'unica cosa che costa soldi veri.
 *
 * ⛔ **Clinica non è un errore se manca nel modulo**: `main.py` accetta solo
 * `trial|solo|studio`, quindi offrirla lì spedirebbe una scelta che il server
 * nega. Il confronto vale sui piani che il modulo dichiara, non sull'insieme.
 *
 * Si esegue anche da solo:  node scripts/parita-listino.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))

/* ⚠️ **I due file non parlano la stessa lingua, e non è un difetto.** La
 * vetrina chiama il piano `solo-pro` e usa la parola `chiave`; l'applicazione
 * lo chiama `solo` e usa `codice`. È la stessa doppia denominazione che il
 * server già traduce in `PIANI_STRIPE_VERSO_INTERNO`. ⇒ Il confronto normalizza
 * prima, altrimenti direbbe «piano che sulla vetrina non esiste» su una cosa
 * che esiste e ha lo stesso prezzo. */
const STESSO_PIANO = { 'solo-pro': 'solo', enterprise: 'clinica' }
const normalizza = (c) => STESSO_PIANO[c] ?? c

/** `piano → prezzo` letti da un `listino.ts`, senza importarlo (è TypeScript). */
function prezziDa(sorgente) {
  const fuori = new Map()
  /* Si aggancia alla COPPIA nome-del-piano + `prezzo` dentro lo stesso oggetto:
     un `prezzo:` cercato da solo prenderebbe anche numeri di altre strutture. */
  for (const m of sorgente.matchAll(/(?:codice|chiave):\s*'([a-z-]+)'[\s\S]{0,240}?prezzo:\s*(null|\d+)/g)) {
    fuori.set(normalizza(m[1]), m[2] === 'null' ? null : Number(m[2]))
  }
  return fuori
}

/* ⚠️ Firma `(problemi, avvisa)` come le altre `parita-*`: `problemi` e' un
 * array su cui si accoda, non una funzione. Invertirli non darebbe errore —
 * darebbe un presidio che non segnala mai. */
export function paritaListino(problemi, avvisa) {
  const fallisci = (m) => problemi.push(m)
  const vetrina = join(QUI, '..', 'src', 'lib', 'listino.ts')
  const app = join(QUI, '../../EMR/apps/web/src/lib/listino.ts')

  if (!existsSync(app)) {
    // Il sottomodulo può non esserci in un clone del solo sito: si dice, non si
    // finge che sia andato bene.
    avvisa('Listino: non verificato contro l’applicazione (il sottomodulo EMR non è in questo clone).')
    return
  }

  const daVetrina = prezziDa(readFileSync(vetrina, 'utf8'))
  const daApp = prezziDa(readFileSync(app, 'utf8'))

  if (daVetrina.size === 0 || daApp.size === 0) {
    // ⛔ Zero piani letti NON è «tutto a posto»: è la lettura che è fallita.
    fallisci(`Listino: letti ${daVetrina.size} piani dalla vetrina e ${daApp.size} dall’applicazione. ` +
      'Uno dei due file ha cambiato forma e il confronto non sta guardando niente.')
    return
  }

  for (const [codice, prezzoApp] of daApp) {
    if (prezzoApp === null) continue // la prova non ha prezzo
    const prezzoVetrina = daVetrina.get(codice)
    if (prezzoVetrina === undefined) {
      fallisci(`Listino: il modulo di registrazione offre «${codice}», che sulla vetrina non esiste.`)
    } else if (prezzoVetrina !== prezzoApp) {
      fallisci(
        `Listino: «${codice}» costa ${prezzoVetrina} € sul sito e ${prezzoApp} € nel modulo di ` +
          'registrazione. Chi si registra legge una cifra e ne pagherebbe un’altra.',
      )
    }
  }
}

/**
 * I prezzi che l'applicazione **pubblica davvero**, letti dal pacchetto servito.
 *
 * 🔴 **Misurato il 2026-08-13, ed è il difetto di questo presidio.** Il
 * confronto qui sopra guarda due file `.ts` e diceva «✓ listino allineato»
 * mentre chi apriva la registrazione in rete leggeva **€99 e €189**: il
 * sorgente era corretto, il pacchetto servito no, perché nessuno aveva
 * ricostruito il frontend. Un presidio verde su un prodotto sbagliato è peggio
 * di nessun presidio — certifica proprio la cosa che non ha guardato.
 *
 * ⇒ Questa funzione chiude il salto: legge gli `assets/*.js` che il server
 * consegna e ci cerca dentro le cifre. Non è elegante — è l'unico punto in cui
 * si osserva ciò che l'utente vede davvero.
 */
export async function prezziPubblicati(urlApp) {
  const base = urlApp.replace(/\/$/, '')
  const pagina = await fetch(`${base}/signup`).then((r) => r.text())

  /* ⚠️ Non bastano i bundle citati nell'HTML: il listino vive in un pezzo
   * caricato **a richiesta**, che l'HTML non nomina. Alla prima stesura questa
   * funzione leggeva solo i primi e trovava **zero** prezzi. Quindi si segue un
   * livello di riferimenti: ogni bundle nomina i propri. */
  const daVisitare = [...pagina.matchAll(/\/assets\/[A-Za-z0-9._-]+\.js/g)].map((m) => m[0])
  const visti = new Set()
  const trovati = new Set()
  let letti = 0

  while (daVisitare.length && letti < 400) {
    const j = daVisitare.shift()
    if (visti.has(j)) continue
    visti.add(j)
    const r = await fetch(base + j)
    if (!r.ok) continue
    const testo = await r.text()
    letti++
    for (const m of testo.matchAll(/€\s?(\d{2,4})/g)) trovati.add(Number(m[1]))
    /* ⚠️ **Tre forme diverse per la stessa cosa, misurate il 2026-08-13.** Nel
     * bundle d'ingresso lo stesso chunk compare come `"assets/signup-….js"`
     * (senza barra iniziale) nella lista di preload, e come
     * import(`./signup-….js`) — **fra backtick** — nell'import dinamico.
     * Cercando solo `"/assets/…"` si leggevano **20 bundle su 124**, e quello
     * del listino era fra i 104 mancanti: il controllo non trovava alcun
     * prezzo e diceva «nessuno». Da qui la regola di far fallire una misura
     * vuota invece di darle il verde. */
    for (const m of testo.matchAll(/["'`](?:\.\/|\/)?(?:assets\/)?([A-Za-z0-9._-]+\.js)["'`]/g)) {
      const p = `/assets/${m[1]}`
      if (!visti.has(p)) daVisitare.push(p)
    }
  }
  return { trovati, letti }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const iPub = process.argv.indexOf('--pubblicato')
  if (iPub !== -1 && process.argv[iPub + 1]) {
    const url = process.argv[iPub + 1]
    const attesi = new Set(
      [...prezziDa(readFileSync(join(QUI, '..', 'src', 'lib', 'listino.ts'), 'utf8')).values()].filter(
        (v) => v !== null,
      ),
    )
    const { trovati: pubblicati, letti } = await prezziPubblicati(url)
    const intrusi = [...pubblicati].filter((p) => !attesi.has(p))
    console.log(`   attesi dal sito: ${[...attesi].join(', ')}`)
    console.log(`   letti ${letti} bundle da ${url}`)
    console.log(`   prezzi pubblicati: ${[...pubblicati].join(', ') || '(nessuno)'}`)
    // ⛔ Zero cifre lette NON e' «tutto a posto»: e' la misura che non c'e'.
    // Questo controllo e' nato proprio perche' un presidio verde su una cosa
    // non guardata e' peggio di nessun presidio — e alla prima stesura ci e'
    // ricascato dentro, passando con «(nessuno trovato)».
    if (pubblicati.size === 0) {
      console.error(
        `⛔ Nessun prezzo trovato nei ${letti} bundle letti. Non e' una conferma: ` +
          'il confronto non ha guardato niente. Controlla che l’URL sia quello ' +
          'dell’applicazione e che i bundle siano raggiungibili.',
      )
      process.exit(1)
    }
    if (intrusi.length) {
      console.error(
        `⛔ In rete compaiono cifre che il listino non prevede: ${intrusi.join(', ')} € — ` +
          'il frontend pubblicato è più vecchio del sorgente. Ricostruiscilo.',
      )
      process.exit(1)
    }
    console.log('✓ i prezzi pubblicati coincidono col listino')
    process.exit(0)
  }
  const problemi = []
  paritaListino(problemi, (m) => console.log('⚠️ ', m))
  for (const p of problemi) console.error('⛔', p)
  console.log(
    problemi.length
      ? `\n${problemi.length} problemi`
      : '✓ listino allineato fra i SORGENTI di sito e registrazione',
  )
  console.log(
    '⚠️  Non verifica cosa è PUBBLICATO. Per quello: node scripts/parita-listino.mjs --pubblicato <url-app>',
  )
  process.exit(problemi.length ? 1 : 0)
}
