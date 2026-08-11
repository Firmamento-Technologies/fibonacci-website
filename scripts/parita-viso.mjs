/**
 * La copia della mappa del viso deve restare uguale all'originale.
 *
 * ⚠️ PERCHÉ ESISTE. `src/lib/aree-viso.ts` è una COPIA di
 * `EMR/apps/web/src/lib/body-areas.ts`: il sito è un repo separato e statico,
 * non può importare da un altro repo. Una copia senza presidio è esattamente il
 * difetto che questo progetto insegue da giorni — *due copie di una regola
 * divergono, e la seconda diverge in silenzio*. Qui il silenzio sarebbe totale:
 * spostare una coordinata nell'applicazione non romperebbe niente nel sito, i
 * pallini finirebbero solo fuori posto sopra un viso, in vetrina.
 *
 * ⚖️ Confronta **i dati** — codici, etichette, coordinate — e il numero del
 * ritaglio. ⛔ NON l'aspetto: colori e spaziature del sito sono diversi da
 * quelli dell'applicazione **di proposito** (decisione TD-15: marchio, accento e
 * ritmo attraversano il confine; carattere e tono no).
 *
 * ⚠️ È un modulo a sé, e si esegue anche da solo:
 *     node scripts/parita-viso.mjs
 * `collaudo.mjs` lo importa. Un presidio che gira solo dentro un collaudo da
 * due minuti con Playwright è un presidio che nessuno lancia mentre lavora.
 */
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const QUI = dirname(fileURLToPath(import.meta.url))

/** Le voci `{ code: 'x', label: 'y' }` di un array TypeScript dichiarato. */
function leggiAree(testo, nomeArray) {
  const blocco = testo.match(new RegExp(`${nomeArray}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\]`))
  if (!blocco) return null
  const voci = [...blocco[1].matchAll(/code:\s*'([^']+)'\s*,\s*label:\s*'([^']+)'/g)]
  return voci.length ? voci.map((m) => `${m[1]}=${m[2]}`) : null
}

/** Le voci `'codice': { x: n, y: n }` di una tabella di coordinate. */
function leggiCoord(testo, nomeTabella) {
  const blocco = testo.match(new RegExp(`${nomeTabella}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}`))
  if (!blocco) return null
  const voci = [...blocco[1].matchAll(/'([^']+)':\s*\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)\s*\}/g)]
  return voci.length ? voci.map((m) => `${m[1]}:${Number(m[2])},${Number(m[3])}`) : null
}

function confronta(problemi, che, atteso, trovato) {
  // ⛔ Il modo in cui un presidio così diventa inutile: la lettura fallisce, i
  // due insiemi sono entrambi vuoti, e «combaciano». Qui è rosso, non verde.
  if (!atteso || !trovato) {
    problemi.push(
      `mappa del viso: non sono riuscito a leggere ${che} da uno dei due file — ` +
        'il confronto NON è stato fatto (i regex in `parita-viso.mjs` non reggono più)',
    )
    return
  }
  const soloEmr = atteso.filter((v) => !trovato.includes(v))
  const soloSito = trovato.filter((v) => !atteso.includes(v))
  if (soloEmr.length || soloSito.length) {
    problemi.push(
      `mappa del viso: ${che} diverge fra applicazione e sito — ` +
        (soloEmr.length ? `solo nell'EMR: ${soloEmr.slice(0, 4).join(' · ')}` : '') +
        (soloEmr.length && soloSito.length ? ' | ' : '') +
        (soloSito.length ? `solo nel sito: ${soloSito.slice(0, 4).join(' · ')}` : '') +
        ' — riallinea `src/lib/aree-viso.ts` a `EMR/apps/web/src/lib/body-areas.ts`',
    )
  }
}

/**
 * Aggiunge a `problemi` ogni divergenza trovata.
 * @param {string[]} problemi
 * @param {(msg: string) => void} avvisa  come segnalare ciò che non si è potuto verificare
 */
export function paritaMappaViso(problemi, avvisa = console.log) {
  const copia = readFileSync(join(QUI, '..', 'src/lib/aree-viso.ts'), 'utf8')

  // (1) Il ritaglio è scritto in due posti e devono coincidere. Se scostano, i
  //     pallini vanno fuori posto e nient'altro se ne accorge.
  const script = readFileSync(join(QUI, 'volti.mjs'), 'utf8')
  const numeri = (t) => t.match(/RITAGLIO\s*=\s*\{\s*x0:\s*([\d.]+),\s*larghezza:\s*([\d.]+)\s*\}/)
  const rc = numeri(copia)
  const rs = numeri(script)
  if (!rc || !rs) {
    problemi.push('mappa del viso: non trovo `RITAGLIO` in aree-viso.ts o in volti.mjs')
  } else if (rc[1] !== rs[1] || rc[2] !== rs[2]) {
    problemi.push(
      `mappa del viso: il ritaglio non coincide — aree-viso.ts dice ${rc[1]}/${rc[2]}, ` +
        `volti.mjs taglia a ${rs[1]}/${rs[2]}: i pallini finiscono fuori posto`,
    )
  }

  // (2) Codici, etichette, coordinate e RAGGIO D'AGGANCIO contro l'originale.
  const sorgente = join(QUI, '../../EMR/apps/web/src/lib/body-areas.ts')
  if (!existsSync(sorgente)) {
    avvisa('Mappa del viso: non verificata contro l’EMR (il sottomodulo non è in questo clone).')
    return
  }
  const originale = readFileSync(sorgente, 'utf8')

  // Il raggio entro cui un click si aggancia a un'area. ⚠️ Se qui fosse più
  // generoso che nel prodotto, il sito mostrerebbe una precisione che
  // l'applicazione non ha — cioè una promessa, che è il difetto che questo
  // sito ha già pagato più volte.
  const raggioEmr = originale.match(/maxDistance\s*=\s*([\d.]+)/)?.[1]
  const raggioSito = copia.match(/RAGGIO_AGGANCIO\s*=\s*([\d.]+)/)?.[1]
  if (!raggioEmr || !raggioSito) {
    problemi.push('mappa del viso: non trovo il raggio d’aggancio in uno dei due file')
  } else if (Number(raggioEmr) !== Number(raggioSito)) {
    problemi.push(
      `mappa del viso: il raggio d’aggancio diverge — l'applicazione usa ${raggioEmr}, ` +
        `il sito ${raggioSito}: la vetrina promette una precisione diversa da quella vera`,
    )
  }

  confronta(problemi, 'le aree del volto', leggiAree(originale, 'FACE_AREAS'), leggiAree(copia, 'AREE_VISO'))
  confronta(problemi, 'le coordinate donna', leggiCoord(originale, 'FACE_AREA_COORDS_FEMALE'), leggiCoord(copia, 'COORD_DONNA'))
  confronta(problemi, 'le coordinate uomo', leggiCoord(originale, 'FACE_AREA_COORDS_MALE'), leggiCoord(copia, 'COORD_UOMO'))
}

// Eseguito direttamente: stampa l'esito e imposta il codice d'uscita.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problemi = []
  paritaMappaViso(problemi, (m) => console.log(`\x1b[33m${m}\x1b[0m`))
  if (problemi.length) {
    console.log(`\x1b[31m${problemi.length} problemi:\x1b[0m`)
    for (const p of problemi) console.log('  ' + p)
    process.exitCode = 1
  } else {
    console.log('\x1b[32mMappa del viso: la copia nel sito è identica a quella dell’applicazione.\x1b[0m')
  }
}
