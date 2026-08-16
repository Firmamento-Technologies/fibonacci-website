/* Cancello: nessuna lineetta lunga nel testo che il visitatore legge.
 *
 * Richiesta esplicita dell'utente, 2026-08-15: «togli dal sito web dalla SEO
 * dalla descrizione e da ogni altra parte della piattaforma sto simbolo da LLM
 * "—" che non voglio mai più vedere».
 *
 * ⚠️ NON è il primo controllo sulla lineetta, ed è importante sapere perché ne
 * serve un secondo. `collaudo.mjs` ne ha già uno (`const LINEETTA = /\s—\s/`) e
 * dice la stessa cosa: *«la punteggiatura più riconoscibile dei testi generati.
 * Il sito non la usa mai»*. Ma quello guarda il **testo RESO** delle pagine, e
 * ha due buchi da cui la lineetta è passata lo stesso:
 *   · il `<title>` e i metadati OpenGraph **non stanno nel corpo** della pagina,
 *     e infatti «Fibonacci — la cartella clinica» è sopravvissuto lì per mesi,
 *     cioè proprio nel punto più visibile che esista (la scheda del browser e
 *     l'anteprima quando qualcuno condivide il collegamento);
 *   · la regex vuole gli **spazi** attorno, quindi `parola—parola` passa.
 * Questo guarda la SORGENTE, metadati e contenuti compresi. I due si coprono a
 * vicenda: ⛔ non toglierne uno pensando che l'altro basti.
 *
 * 🔑 Perché è un cancello e non una passata sola: la lineetta la scriviamo per
 * abitudine, e senza qualcosa che la faccia valere tornerebbe al primo testo
 * nuovo. È la stessa lezione di `lint-state` nel knowledge, dove una regola
 * scritta è tornata rossa in cinque giorni perché nessun comando la eseguiva.
 *
 * ⛔ Guarda SOLO ciò che finisce a schermo: i commenti del codice ne contengono
 * ancora ~226 e non li legge nessun visitatore. Un cancello rosso dal primo
 * giorno viene spento, ed è precisamente come si perdono i cancelli.
 *
 * Che cosa scrivere al suo posto: due punti quando quello che segue spiega
 * («Fibonacci: la cartella clinica»), virgola quando è una congiunzione
 * («…valide, ma il confronto»), parentesi quando è un inciso.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const SRC = join(QUI, '..', 'src')
const ESTENSIONI = ['.tsx', '.ts', '.md', '.mdx', '.json']

/* ⛔ Fuori: le schede raccolte da fonti pubbliche. Sono i nomi che gli studi
 * hanno scelto per se stessi, letti dai loro siti: se contengono una lineetta,
 * riscriverla vorrebbe dire pubblicare un nome DIVERSO da quello dichiarato,
 * cioe' falsificare il dato invece di correggere il nostro stile. La regola
 * dell'utente riguarda cio' che scriviamo noi.
 *
 * ⚠️ E non e' un'esenzione di comodo, e' cio' che tiene in vita il cancello:
 * qui dentro ce ne sono 5 e ne arriveranno altre a ogni raccolta, quindi
 * senza questa riga il controllo sarebbe rosso per sempre. Un cancello rosso
 * dal primo giorno viene spento, ed e' precisamente come si perdono i
 * cancelli (stessa lezione di `lint-produzione` nel knowledge).
 */
const FUORI = ['dati/cliniche/']

function* file(dir) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome)
    if (FUORI.some((f) => p.replaceAll('\\', '/').includes(f))) continue
    if (statSync(p).isDirectory()) yield* file(p)
    else if (ESTENSIONI.some((e) => nome.endsWith(e))) yield p
  }
}

/** Toglie i commenti mantenendo la numerazione delle righe. */
function senzaCommenti(testo, percorso) {
  if (percorso.endsWith('.json') || percorso.endsWith('.md') || percorso.endsWith('.mdx')) {
    return testo // niente commenti da togliere: è tutto contenuto
  }
  return testo
    .replace(/\/\*[\s\S]*?\*\//g, (m) => '\n'.repeat((m.match(/\n/g) ?? []).length))
    .replace(/(^|[^:\w"'`])\/\/.*$/gm, '$1')
}

export function nienteLineetta(problemi) {
  const colpevoli = []
  for (const f of file(SRC)) {
    const testo = readFileSync(f, 'utf8')
    if (!testo.includes('—')) continue
    senzaCommenti(testo, f)
      .split('\n')
      .forEach((riga, i) => {
        if (riga.includes('—')) {
          colpevoli.push(`${f.slice(SRC.length + 1)}:${i + 1}  ${riga.trim().slice(0, 100)}`)
        }
      })
  }
  if (colpevoli.length) {
    problemi.push(
      `lineetta lunga in ${colpevoli.length} punti del testo (usa due punti, virgola o parentesi):\n` +
        colpevoli.map((c) => '      ' + c).join('\n'),
    )
  }
  return colpevoli.length
}

// Eseguibile da solo: `node scripts/niente-lineetta.mjs`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problemi = []
  const n = nienteLineetta(problemi)
  if (n) {
    console.error(problemi[0])
    process.exit(1)
  }
  console.log('Nessuna lineetta lunga nel testo del sito.')
}
