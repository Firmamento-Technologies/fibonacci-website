/* Cancello: nessun dato dell'elenco dei medici finisce nel sito costruito.
 *
 * 🔴 PERCHE' ESISTE, e perche' e' il piu' serio dei cancelli di questa cartella.
 * In `src/dati/cliniche/` ci sono **2.746 file** con le schede di persone e
 * studi reali, raccolte da fonti pubbliche: nomi, indirizzi, telefoni, **oltre
 * 3.100 indirizzi email**. Quelle persone non ci hanno chiesto niente, e
 * l'informativa dell'art. 14 non e' ancora valida perche' la societa' titolare
 * non esiste. ⇒ finche' non lo e', **niente di tutto questo puo' comparire in
 * una pagina pubblicata**, e la decisione dell'utente e' esplicita: il
 * cablaggio delle schede al sito e' l'ultimo passaggio di tutti.
 *
 * ⚠️ Il rischio non e' teorico ed e' del tipo silenzioso: quella cartella sta
 * dentro `src/`, cioe' dentro l'albero da cui Next costruisce. Basta un
 * `import` da una pagina, o un `fs.readdirSync` in un componente di server, e
 * i dati entrano nell'HTML **senza che niente diventi rosso**. Il giorno che
 * succede non se ne accorge nessuno guardando: le pagine sembrerebbero solo
 * "piu' piene".
 *
 * ⛔ Non guarda i sorgenti, guarda **il costruito**: e' l'unico posto dove la
 *    domanda "questo dato e' pubblicato?" ha una risposta certa. Un controllo
 *    sugli import si aggira in dieci modi; questo no.
 *
 * 🔑 E cerca **gli indirizzi email**, non i nomi: un nome di studio puo'
 *    comparire legittimamente in un testo (un esempio, una citazione), un
 *    indirizzo email raccolto no, mai, in nessun contesto. E' il campo che
 *    rende il dato inequivocabilmente "preso dall'elenco".
 *
 * Quando l'elenco sara' pubblicabile — informativa valida, titolare reale,
 * permesso esplicito — questo file va **cambiato insieme a quella decisione**,
 * non tolto di corsa perche' e' diventato rosso.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const OUT = join(QUI, '..', 'out')
const RECAPITI = join(QUI, '..', 'src', 'dati', 'cliniche', '_recapiti.json')

/** I file che un visitatore puo' scaricare. ⛔ Non solo `.html`: se i dati
 *  finissero in un chunk JavaScript o in un JSON servito, sarebbero pubblicati
 *  esattamente allo stesso modo. */
const ESTENSIONI = ['.html', '.js', '.json', '.txt', '.xml', '.css']

function* file(dir) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome)
    if (statSync(p).isDirectory()) yield* file(p)
    else if (ESTENSIONI.some((e) => nome.endsWith(e))) yield p
  }
}

export function nienteDatiElenco(problemi) {
  if (!existsSync(OUT)) return 0
  if (!existsSync(RECAPITI)) {
    // ⚠️ Senza il file non si puo' concludere niente, e **tacere sarebbe la
    // cosa sbagliata**: un cancello che si spegne da solo quando manca il suo
    // riferimento e' un cancello che un giorno risulta verde senza aver
    // guardato. Si dice, e si prosegue.
    problemi.push(
      'dati elenco: manca `_recapiti.json`, quindi il controllo sui dati ' +
        'pubblicati NON e stato fatto.\n' +
        '      ⚠️ In un `git worktree` e NORMALE: il file e generato e sta in .gitignore,\n' +
        '      quindi ⛔ non e un guasto da cercare.\n' +
        '      Riparazione, ~0,5 s:  python3 scripts/costruisci-db.py\n' +
        '      ⛔ Non copiarlo dall albero condiviso: la e generato da dati con le\n' +
        '      modifiche non committate di altre sessioni, e ⛔ non combacia con out/.',
    )
    return 0
  }
  const recapiti = JSON.parse(readFileSync(RECAPITI, 'utf8'))
  const mail = new Set(
    Object.values(recapiti)
      .map((v) => (v?.email ?? '').trim().toLowerCase())
      .filter((e) => e.includes('@')),
  )
  if (mail.size === 0) return 0

  const colpevoli = []
  for (const f of file(OUT)) {
    const testo = readFileSync(f, 'utf8').toLowerCase()
    // Prima un filtro grossolano: la stragrande maggioranza dei file non ha
    // nemmeno una chiocciola, e cosi' non si paga 3.100 ricerche per file.
    if (!testo.includes('@')) continue
    for (const e of mail) {
      if (testo.includes(e)) {
        colpevoli.push(`${f.slice(OUT.length + 1)}  →  ${e}`)
        break
      }
    }
  }
  if (colpevoli.length) {
    problemi.push(
      `🔴 DATI DELL'ELENCO PUBBLICATI: ${colpevoli.length} file del sito costruito ` +
        `contengono un recapito raccolto da fonti pubbliche. Non si pubblica finche' ` +
        `l'informativa dell'art. 14 non e' valida:\n` +
        colpevoli.slice(0, 10).map((c) => '      ' + c).join('\n'),
    )
  }
  return colpevoli.length
}

// Eseguibile da solo: `node scripts/niente-dati-elenco.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  const problemi = []
  const n = nienteDatiElenco(problemi)
  console.log(problemi.length ? problemi.join('\n') : '✅ nessun dato dell’elenco nel sito costruito')
  process.exit(n ? 1 : 0)
}
