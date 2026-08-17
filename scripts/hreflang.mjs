/**
 * Dichiara a Google che le cinque versioni di una pagina sono LA STESSA pagina
 * in lingue diverse, e corregge il `canonical` di ognuna.
 *
 * ── PERCHE' UNO SCRIPT DOPO LA COSTRUZIONE ──────────────────────────────────
 * `hreflang` vuole l'indirizzo **completo di ogni traduzione**, e una pagina
 * non conosce il proprio percorso in un export statico: lo conosce il file
 * system. Metterlo nel `metadata` di ognuna avrebbe voluto **29 modifiche a
 * mano**, e una pagina nuova dimenticata non darebbe nessun errore: sarebbe
 * semplicemente invisibile nelle altre lingue.
 * ⇒ qui si deriva dal percorso del file, e vale anche per le pagine che
 *   nasceranno domani.
 *
 * ── CHE COSA SISTEMA, di preciso ────────────────────────────────────────────
 * 1. `<link rel="alternate" hreflang>` per tutte e cinque + `x-default`
 *    sull'italiano (che e' la lingua sorgente e sta alla radice);
 * 2. il **canonical**, che senza questo passaggio punterebbe all'indirizzo
 *    italiano anche dalla pagina tedesca — ⇒ Google indicizzerebbe solo
 *    l'italiano e le altre quattro sparirebbero, che e' il contrario dello
 *    scopo di tutto il lavoro.
 *
 * ⚠️ Ogni pagina deve dichiarare **anche se stessa** fra gli alternate: e' una
 * richiesta esplicita di Google («each language version must list itself»), e
 * senza, l'insieme viene scartato per intero.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(RADICE, 'out')

const LINGUE = ['it', 'en', 'es', 'fr', 'de']
const TAG = { it: 'it-IT', en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' }
const PREFISSI = new Set(LINGUE.filter((l) => l !== 'it'))

const ORIGINE = (process.env.NEXT_PUBLIC_DOMINIO_SITO ?? '').trim()
  ? `https://${process.env.NEXT_PUBLIC_DOMINIO_SITO.trim()}`
  : 'https://fibonaccimedica.it'

function html(dir) {
  const fuori = []
  for (const v of readdirSync(dir)) {
    const p = join(dir, v)
    if (statSync(p).isDirectory()) fuori.push(...html(p))
    else if (p.endsWith('.html')) fuori.push(p)
  }
  return fuori
}

/** Il percorso della pagina **senza** lingua: `/de/prezzi/` → `/prezzi/`. */
function percorsoNeutro(file) {
  const parti = relative(OUT, file).split(sep)
  if (PREFISSI.has(parti[0])) parti.shift()
  const senzaIndice = parti[parti.length - 1] === 'index.html' ? parti.slice(0, -1) : parti
  const p = senzaIndice.join('/').replace(/\.html$/, '')
  return p ? `/${p}/` : '/'
}

function linguaDi(file) {
  const primo = relative(OUT, file).split(sep)[0]
  return PREFISSI.has(primo) ? primo : 'it'
}

function indirizzo(lingua, neutro) {
  return `${ORIGINE}${lingua === 'it' ? '' : `/${lingua}`}${neutro}`
}

let toccati = 0
let saltati = 0

for (const file of html(OUT)) {
  const neutro = percorsoNeutro(file)
  const mia = linguaDi(file)

  // ⛔ Le pagine che esistono in una lingua sola non ricevono alternate:
  //    dichiarare una traduzione che non c'e' fa scartare l'intero insieme.
  const presenti = LINGUE.filter((l) => {
    const candidato =
      l === 'it'
        ? join(OUT, neutro === '/' ? 'index.html' : join(neutro, 'index.html'))
        : join(OUT, l, neutro === '/' ? 'index.html' : join(neutro, 'index.html'))
    try {
      return statSync(candidato).isFile()
    } catch {
      return false
    }
  })
  if (presenti.length < 2) {
    saltati += 1
    continue
  }

  let testo = readFileSync(file, 'utf8')

  // Via i vecchi, o a ogni giro se ne accumulano.
  testo = testo.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*"\/?>/g, '')

  const righe = presenti
    .map((l) => `<link rel="alternate" hreflang="${TAG[l]}" href="${indirizzo(l, neutro)}"/>`)
    .concat(
      presenti.includes('it')
        ? [`<link rel="alternate" hreflang="x-default" href="${indirizzo('it', neutro)}"/>`]
        : [],
    )
    .join('')

  // Il canonical di OGNI lingua deve puntare a se stessa.
  const mioIndirizzo = indirizzo(mia, neutro)
  if (/<link rel="canonical"[^>]*>/.test(testo)) {
    testo = testo.replace(
      /<link rel="canonical" href="[^"]*"\/?>/,
      `<link rel="canonical" href="${mioIndirizzo}"/>`,
    )
  } else {
    testo = testo.replace('</head>', `<link rel="canonical" href="${mioIndirizzo}"/></head>`)
  }

  testo = testo.replace('</head>', `${righe}</head>`)
  writeFileSync(file, testo)
  toccati += 1
}

console.log(
  `[hreflang] ${toccati} pagine collegate fra le lingue` +
    (saltati ? `, ${saltati} lasciate stare (esistono in una lingua sola)` : ''),
)
