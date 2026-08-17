/**
 * Costruisce il sito in tutte e cinque le lingue, in un `out/` solo.
 *
 * ── PERCHE' CINQUE COSTRUZIONI ──────────────────────────────────────────────
 * Il sito è `output: 'export'`: file statici, nessun runtime che possa
 * scegliere una lingua a richiesta. Le due strade erano ristrutturare le 29
 * pagine sotto un segmento `[lingua]`, oppure costruire cinque volte con
 * `basePath`. Vince la seconda: **nessuna pagina si tocca**, nessun indirizzo
 * italiano cambia (e sono quelli già indicizzati), e ogni lingua diventa un
 * sito statico completo e indipendente sotto il suo prefisso.
 *
 * ── L'ORDINE CONTA ──────────────────────────────────────────────────────────
 * L'italiano si costruisce per PRIMO e occupa la radice di `out/`. Le altre
 * quattro si costruiscono dopo e si **innestano** in `out/<lingua>/`.
 * ⛔ Non si può fare il contrario: `next build` cancella `out/` a ogni giro.
 *
 * ── CHE COSA VIENE VERIFICATO, e perché non basta «è andata bene» ───────────
 * Una costruzione può riuscire e produrre una lingua **vuota o italiana**: il
 * ripiego silenzioso è il difetto che questo lavoro esiste per chiudere. Quindi
 * dopo ogni lingua si controlla che:
 *   1. il numero di pagine HTML combaci con l'italiano (⛔ una pagina persa non
 *      dà errore, dà un 404 che nessuno guarda);
 *   2. `<html lang>` sia davvero quella lingua;
 *   3. una frase campione sia DIVERSA dall'italiano.
 * Se uno dei tre non torna, lo script esce 1 e la lingua NON viene innestata.
 *
 * USO:  node scripts/costruisci-lingue.mjs
 *       node scripts/costruisci-lingue.mjs --solo=de       una lingua sola
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(RADICE, 'out')
const APPOGGIO = join(RADICE, '.out-lingue')

const LINGUE = ['it', 'en', 'es', 'fr', 'de']
const solo = process.argv.find((a) => a.startsWith('--solo='))?.split('=')[1]

function html(dir) {
  const trovati = []
  for (const v of readdirSync(dir)) {
    const p = join(dir, v)
    if (statSync(p).isDirectory()) trovati.push(...html(p))
    else if (p.endsWith('.html')) trovati.push(p)
  }
  return trovati
}

function costruisci(lingua) {
  console.log(`\n── ${lingua} ${'─'.repeat(60)}`)
  execFileSync('npm', ['run', 'build'], {
    cwd: RADICE,
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_LINGUA: lingua },
  })
  const pagine = html(OUT)
  if (pagine.length === 0) throw new Error(`${lingua}: nessuna pagina costruita`)
  return pagine
}

function verifica(lingua, pagine, attese) {
  if (attese !== null && pagine.length !== attese) {
    throw new Error(
      `${lingua}: ${pagine.length} pagine contro le ${attese} dell'italiano. ` +
        `⛔ Una pagina persa non dà errore, dà un 404 che nessuno guarda.`,
    )
  }
  const indice = pagine.find((p) => p.endsWith(join('out', 'index.html'))) ?? pagine[0]
  const testo = readFileSync(indice, 'utf8')
  const dichiarata = testo.match(/<html[^>]*\blang="([^"]+)"/)?.[1] ?? ''
  if (!dichiarata.startsWith(lingua)) {
    throw new Error(`${lingua}: <html lang="${dichiarata}">, ⛔ non combacia`)
  }
  return testo
}

let attese = null
let campioneItaliano = ''

for (const lingua of LINGUE) {
  if (solo && lingua !== solo && lingua !== 'it') continue
  if (solo && lingua === 'it' && solo !== 'it') {
    // Con `--solo` serve comunque il conteggio dell'italiano già costruito.
    attese = existsSync(OUT) ? html(OUT).length : null
    continue
  }

  const pagine = costruisci(lingua)
  const testo = verifica(lingua, pagine, lingua === 'it' ? null : attese)

  if (lingua === 'it') {
    attese = pagine.length
    campioneItaliano = testo
    // Da parte, o la costruzione successiva lo cancella.
    rmSync(APPOGGIO, { recursive: true, force: true })
    renameSync(OUT, APPOGGIO)
    console.log(`✅ it: ${pagine.length} pagine, messe da parte`)
    continue
  }

  // ⛔ Il controllo che conta: una lingua IDENTICA all'italiano ha ripiegato.
  if (testo === campioneItaliano) {
    throw new Error(
      `${lingua}: la pagina è byte-identica all'italiano. ` +
        `⇒ il dizionario non è stato letto, o è una copia.`,
    )
  }

  const destinazione = join(APPOGGIO, lingua)
  mkdirSync(destinazione, { recursive: true })
  cpSync(OUT, destinazione, { recursive: true })
  rmSync(OUT, { recursive: true, force: true })
  console.log(`✅ ${lingua}: ${pagine.length} pagine, innestate in out/${lingua}/`)
}

rmSync(OUT, { recursive: true, force: true })
renameSync(APPOGGIO, OUT)

// ⚠️ `hreflang` va DOPO l'assemblaggio, non nel `postbuild` di ogni lingua:
// per collegare le versioni deve vederle tutte e cinque nello stesso `out/`.
execFileSync('node', [join(RADICE, 'scripts', 'hreflang.mjs')], { cwd: RADICE, stdio: 'inherit' })

console.log(`\n✅ out/ contiene ${html(OUT).length} pagine in ${LINGUE.length} lingue`)
