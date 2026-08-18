/**
 * «C'è uno spazio fra il testo e il tag che gli sta accanto?»
 *
 * ── 🔴 PERCHE' ESISTE, ed è un difetto che ho fatto io ──────────────────────
 * Il 2026-08-17, estraendo le stringhe nel dizionario, un ripristino automatico
 * ha rimesso 22 frammenti di frase nella forma `>Testo<strong>` — cioè
 * **attaccati**. In JSX lo spazio fra il testo e il tag veniva dall'**a capo**
 * del sorgente, e riscrivendo la riga su una riga sola quell'a capo è sparito.
 *
 * Risultato, in linea per un'ora in cinque lingue:
 *     «Fibonacci è due cose. Un**elenco pubblico** di medici…»
 *     «Il listino è**pubblico**, e qui c'è come funziona»
 *     «Scrivici a**info@fibonaccimedica.it**»
 *     «Hai il diritto di**rifiutare** in tutto o in parte»
 *
 * ⚠️ **Nessun controllo poteva vederlo**, ed è il punto: il sorgente è valido,
 * il tipo è giusto, la build passa, i presidi della traduzione contano le
 * stringhe e le trovano tutte, e nel testo reso «Unelenco» è **una parola** come
 * un'altra. Si vede solo leggendo la pagina.
 * 🔑 Quindi il controllo va fatto dove il difetto è visibile: nel **sorgente**,
 * sulla forma `>parola<tag`, che è quasi sempre uno spazio perso.
 *
 * ── QUANDO L'ADIACENZA E' GIUSTA ────────────────────────────────────────────
 * Dopo apostrofo, parentesi aperta, virgolette aperte o trattino: «l'<span>
 * archivista</span>» è corretto e non vuole spazio. Sono le uniche eccezioni
 * viste sul repo, ed è per questo che la regola guarda **l'ultimo carattere**
 * invece di tentare un elenco di parole.
 *
 * USO:  node scripts/parole-attaccate.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(RADICE, 'src')

/** I tag IN LINEA: quelli che stanno dentro una frase. ⛔ Un `<div>` o un `<p>`
 *  attaccati non sono un difetto, sono struttura. */
const IN_LINEA = 'strong|em|code|b|i|a|span|Link|Enfasi'

/** Testo che finisce con una lettera, subito seguito da un tag in linea. */
const ATTACCATO = new RegExp(`>([^<>{}\\n]*[\\p{L}\\p{N}.,:;!?])<(${IN_LINEA})\\b`, 'gu')

/** Dopo questi caratteri l'adiacenza è giusta e va lasciata stare.
 *  ⚠️ Le **entità HTML** contano: nel sorgente l'apostrofo si scrive `&apos;`,
 *  che finisce con un punto e virgola. Senza questa metà, la regola segnalava
 *  `Nessuno apre uno studio per fare l&apos;<span>archivista</span>` — che è
 *  scritto giusto. Trovato eseguendola, ⛔ non ragionandoci sopra. */
const SENZA_SPAZIO = /['’(«\-/]$|&(?:apos|rsquo|lsquo|laquo|#39|#8217);$/

const ESCLUSI = ['.test.', '.stories.']

function sorgenti(dir) {
  const o = []
  for (const v of readdirSync(dir)) {
    const p = join(dir, v)
    if (statSync(p).isDirectory()) o.push(...sorgenti(p))
    else if ((p.endsWith('.tsx') || p.endsWith('.ts')) && !ESCLUSI.some((e) => p.includes(e))) o.push(p)
  }
  return o
}

export function paroleAttaccate() {
  const trovate = []
  for (const f of sorgenti(SRC)) {
    const testo = readFileSync(f, 'utf8')
    for (const riga of testo.split('\n')) {
      // ⛔ I commenti no: contengono esempi di codice apposta.
      if (riga.trim().startsWith('*') || riga.trim().startsWith('//')) continue
      ATTACCATO.lastIndex = 0
      for (const m of riga.matchAll(ATTACCATO)) {
        if (SENZA_SPAZIO.test(m[1])) continue
        trovate.push({ file: relative(SRC, f), testo: m[1].slice(-46), tag: m[2] })
      }
    }
  }
  return trovate
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const t = paroleAttaccate()
  if (t.length === 0) {
    console.log('✅ nessuna parola attaccata al tag che le sta accanto')
    process.exit(0)
  }
  console.log(`⛔ ${t.length} punti in cui manca lo spazio fra testo e tag:`)
  for (const x of t) console.log(`   ${x.file}\n      «…${x.testo}» <${x.tag}>`)
  console.log('   ⇒ metti uno spazio prima del tag: `>Testo <strong>`.')
  console.log('   ⚠️ In JSX lo spazio che vedi a capo NON sopravvive se la riga viene riscritta.')
  process.exit(1)
}
