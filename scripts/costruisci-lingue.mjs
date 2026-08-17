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
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(RADICE, 'out')

/**
 * La cartella d'appoggio sta **fuori dal progetto**, e non è un dettaglio.
 *
 * 🔴 Prima era `.out-lingue/` dentro la radice, e una costruzione interrotta la
 * lasciava lì: **52 MB e 123 pagine costruite**. Tailwind v4 scandisce da sé
 * tutto ciò che non è ignorato, quindi da quel momento **ogni** build leggeva
 * anche l'HTML e il JavaScript generati e ne ricavava un candidato che produce
 * CSS non valido.
 *
 * ⚠️ E l'errore era ingannevole al punto da costare un'ora:
 *     CssSyntaxError: src/app/globals.css:2:19614 Missed semicolon
 * cioè una posizione **che in quel file non esiste** (la riga 2 è vuota, il
 * file ha 89.437 caratteri in 2.365 righe). Puntava al sorgente sbagliato, e
 * il difetto compariva **solo dopo un fallimento**, quando la cache veniva
 * pulita: le costruzioni riuscite prima erano riuscite grazie alla cache.
 *
 * ⇒ fuori dall'albero, e ripulita anche quando lo script muore.
 */
const APPOGGIO = join(tmpdir(), `fibonacci-lingue-${process.pid}`)

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
}


// ⛔ Qualunque cosa succeda, l'appoggio sparisce: e' la riga che chiude il
// difetto descritto sopra. `exit` copre anche le eccezioni e Ctrl-C.
process.on('exit', () => rmSync(APPOGGIO, { recursive: true, force: true }))
for (const segnale of ['SIGINT', 'SIGTERM']) process.on(segnale, () => process.exit(1))

let attese = null

for (const lingua of LINGUE) {
  if (solo && lingua !== solo && lingua !== 'it') continue
  if (solo && lingua === 'it' && solo !== 'it') {
    // Con `--solo` serve comunque il conteggio dell'italiano già costruito.
    attese = existsSync(OUT) ? html(OUT).length : null
    continue
  }

  const pagine = costruisci(lingua)
  verifica(lingua, pagine, lingua === 'it' ? null : attese)

  if (lingua === 'it') {
    attese = pagine.length
    // Da parte, o la costruzione successiva lo cancella.
    rmSync(APPOGGIO, { recursive: true, force: true })
    cpSync(OUT, APPOGGIO, { recursive: true })
    rmSync(OUT, { recursive: true, force: true })
    console.log(`✅ it: ${pagine.length} pagine, messe da parte`)
    continue
  }

  // 🔴 QUI C'ERA IL CONFRONTO SUI BYTE, ED E' STATO TOLTO.
  //
  //     if (testo === campioneItaliano) throw new Error(…)
  //
  // ⛔ **E' passato mentre la prosa ERA italiana**, per mesi di lavoro: le due
  // pagine differiscono sempre per l'attributo `lang` e per i percorsi degli
  // asset (`/de/_next/…` contro `/_next/…`), quindi non sono mai byte-identiche.
  // Il controllo diceva «diverse» e si fermava lì, mentre un visitatore tedesco
  // leggeva titoli, sommari, domande frequenti e bollini in italiano.
  // 🔑 E' la ragione per cui SEI difetti dell'estrattore sono stati trovati a
  //    mano guardando le pagine, e non da qui.
  // ⇒ il controllo vero e' `scripts/lingue-tradotte.mjs`, chiamato in fondo:
  //   confronta il TESTO VISIBILE, e va eseguito **dopo l'assemblaggio** perche'
  //   deve vedere tutte e cinque le lingue insieme.

  const destinazione = join(APPOGGIO, lingua)
  mkdirSync(destinazione, { recursive: true })
  cpSync(OUT, destinazione, { recursive: true })
  rmSync(OUT, { recursive: true, force: true })
  console.log(`✅ ${lingua}: ${pagine.length} pagine, innestate in out/${lingua}/`)
}

rmSync(OUT, { recursive: true, force: true })
// ⚠️ `cpSync` e non `renameSync`: l'appoggio ora sta in `/tmp`, che su questa
// macchina puo' essere un altro volume, e `rename` fra volumi da' EXDEV.
cpSync(APPOGGIO, OUT, { recursive: true })
rmSync(APPOGGIO, { recursive: true, force: true })

// ⚠️ `hreflang` va DOPO l'assemblaggio, non nel `postbuild` di ogni lingua:
// per collegare le versioni deve vederle tutte e cinque nello stesso `out/`.
execFileSync('node', [join(RADICE, 'scripts', 'hreflang.mjs')], { cwd: RADICE, stdio: 'inherit' })

// ── IL PRESIDIO DELLA TRADUZIONE, sul TESTO e non sui byte ──────────────────
// ⚠️ Se e' rosso lo script esce 1 e `out/` resta lì: il costruito c'e', ⛔ ma non
// lo si rilascia. E' voluto — si guarda che cosa segnala e si corregge, invece
// di pubblicare cinque lingue di cui una e' italiana.
execFileSync('node', [join(RADICE, 'scripts', 'lingue-tradotte.mjs')], { cwd: RADICE, stdio: 'inherit' })

console.log(`\n✅ out/ contiene ${html(OUT).length} pagine in ${LINGUE.length} lingue`)
