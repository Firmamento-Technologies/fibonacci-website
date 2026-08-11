/**
 * Il catalogo copiato nel sito deve restare uguale a quello dell'applicazione.
 *
 * ⚠️ Stessa ragione di `parita-viso.mjs`: `src/lib/catalogo-consensi.json` è una
 * copia di `EMR/data/consensi/procedure-catalog.json`, e una copia senza
 * presidio diverge in silenzio. Qui il silenzio sarebbe particolarmente caro:
 * la vetrina dichiara **quante procedure hanno un modello pronto**, e quel
 * numero è un claim commerciale. Se il catalogo clinico cresce e la vetrina no,
 * il sito dice il falso per difetto; se il catalogo cala e la vetrina no, per
 * eccesso — e questo è peggio.
 *
 * Si esegue anche da solo:  node scripts/parita-catalogo.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))

export function paritaCatalogo(problemi, avvisa = console.log) {
  const copiaPath = join(QUI, '..', 'src/lib/catalogo-consensi.json')
  if (!existsSync(copiaPath)) {
    problemi.push('catalogo: manca `src/lib/catalogo-consensi.json` — esegui `node scripts/catalogo.mjs`')
    return
  }
  const copia = JSON.parse(readFileSync(copiaPath, 'utf8'))

  // ⛔ Un catalogo vuoto non è «tutto uguale»: è il presidio rotto.
  if (!Array.isArray(copia.procedure) || copia.procedure.length === 0) {
    problemi.push('catalogo: la copia nel sito è vuota o malformata — il confronto NON è stato fatto')
    return
  }

  const sorgente = join(QUI, '../../EMR/data/consensi/procedure-catalog.json')
  if (!existsSync(sorgente)) {
    avvisa(`Catalogo consensi: non verificato contro l’EMR (il sottomodulo non è in questo clone). ${copia.procedure.length} procedure nella copia.`)
    return
  }

  const vere = JSON.parse(readFileSync(sorgente, 'utf8')).procedures
  const slugVeri = new Set(vere.map((p) => p.slug))
  const slugCopia = new Set(copia.procedure.map((p) => p.slug))

  const mancanti = [...slugVeri].filter((s) => !slugCopia.has(s))
  const inPiu = [...slugCopia].filter((s) => !slugVeri.has(s))
  if (mancanti.length || inPiu.length) {
    problemi.push(
      `catalogo: diverge dall'EMR — ` +
        (mancanti.length ? `${mancanti.length} procedure nell'applicazione e non nel sito (${mancanti.slice(0, 3).join(', ')})` : '') +
        (mancanti.length && inPiu.length ? ' | ' : '') +
        (inPiu.length ? `${inPiu.length} nel sito e non nell'applicazione (${inPiu.slice(0, 3).join(', ')})` : '') +
        ' — rigenera con `node scripts/catalogo.mjs`',
    )
  }

  // I titoli, non solo gli slug: un titolo cambiato in clinica e non in vetrina
  // è una procedura che il medico cerca col nome nuovo e non trova.
  const titoloVero = new Map(vere.map((p) => [p.slug, p.title]))
  const scostati = copia.procedure.filter((p) => titoloVero.has(p.slug) && titoloVero.get(p.slug) !== p.titolo)
  if (scostati.length) {
    problemi.push(
      `catalogo: ${scostati.length} titoli diversi fra applicazione e sito ` +
        `(es. «${scostati[0].titolo}» contro «${titoloVero.get(scostati[0].slug)}») — rigenera`,
    )
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problemi = []
  paritaCatalogo(problemi, (m) => console.log(`\x1b[33m${m}\x1b[0m`))
  if (problemi.length) {
    console.log(`\x1b[31m${problemi.length} problemi:\x1b[0m`)
    for (const p of problemi) console.log('  ' + p)
    process.exitCode = 1
  } else {
    console.log('\x1b[32mCatalogo consensi: la copia nel sito è identica a quella dell’applicazione.\x1b[0m')
  }
}
