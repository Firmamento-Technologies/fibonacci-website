/**
 * La mappa del viso del sito deve essere RIGENERATA quando cambia l'originale.
 *
 * ── COM'ERA, E PERCHÉ È CAMBIATO (TD-155) ────────────────────────────────────
 * Prima qui c'erano regex che rileggevano le tabelle letterali dell'EMR e le
 * confrontavano con una copia a mano nel sito. Il rifacimento della mappa
 * (2026-08-14) ha spostato le tabelle in `volto-mappa.ts` e le ha rese
 * CALCOLATE: la regex agganciava il blocco sbagliato (`BODY_AREA_COORDS`) e
 * denunciava 5 divergenze prive di senso — un presidio rotto che bloccava
 * ogni push «per sicurezza», cioè il modo in cui i presidi vengono spenti.
 *
 * Ora i dati del sito sono GENERATI (`scripts/rigenera-aree-viso.mjs` esegue
 * il modulo vero dell'applicazione) e portano l'IMPRONTA dei file sorgente.
 * Questo presidio confronta quell'impronta con l'EMR attuale:
 *   · combacia   → i dati del sito vengono da QUESTA revisione dell'app;
 *   · non combacia → l'app è cambiata e il sito non è stato rigenerato:
 *     ROSSO, col comando esatto.
 * Niente più regex su valori: il generatore esegue il codice, il presidio
 * verifica la provenienza. ⚠️ Resta il confronto del RITAGLIO fra
 * `aree-viso.ts` e `volti.mjs`: quello è un numero del sito, scritto in due
 * posti, e i pallini finiscono fuori posto se divergono.
 *
 * ⚖️ NON è più in parità, di proposito: il raggio d'aggancio (l'app usa la
 * partizione a bande, la demo l'aggancio al centro più vicino — meccanismi
 * diversi, dichiarati in `aree-viso.ts`).
 *
 * ⚠️ Modulo a sé, eseguibile da solo:  node scripts/parita-viso.mjs
 * `collaudo.mjs` lo importa.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { improntaSorgenti } from './rigenera-aree-viso.mjs'

const QUI = dirname(fileURLToPath(import.meta.url))

/**
 * Aggiunge a `problemi` ogni divergenza trovata.
 * @param {string[]} problemi
 * @param {(msg: string) => void} avvisa  come segnalare ciò che non si è potuto verificare
 */
export function paritaMappaViso(problemi, avvisa = console.log) {
  // (1) Il ritaglio è scritto in due posti e devono coincidere.
  const copia = readFileSync(join(QUI, '..', 'src/lib/aree-viso.ts'), 'utf8')
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

  // (2) I dati generati esistono e non sono vuoti.
  const percorsoDati = join(QUI, '..', 'src/lib/aree-viso-dati.json')
  if (!existsSync(percorsoDati)) {
    problemi.push(
      'mappa del viso: manca `src/lib/aree-viso-dati.json` — genera con ' +
        '`node scripts/rigenera-aree-viso.mjs`',
    )
    return
  }
  let dati
  try {
    dati = JSON.parse(readFileSync(percorsoDati, 'utf8'))
  } catch {
    problemi.push('mappa del viso: `aree-viso-dati.json` non è JSON valido — rigenera')
    return
  }
  if (!dati.aree?.length || !Object.keys(dati.coordDonna ?? {}).length || !Object.keys(dati.coordUomo ?? {}).length) {
    // ⛔ Il modo in cui un presidio così diventa inutile: dati vuoti che
    // «combaciano». Qui è rosso, non verde.
    problemi.push('mappa del viso: i dati generati sono vuoti — rigenera e NON committare vuoto')
    return
  }

  // (3) L'impronta: i dati vengono dalla revisione ATTUALE dell'applicazione?
  const sorgente = join(QUI, '../../EMR/apps/web/src/lib/volto-mappa.ts')
  if (!existsSync(sorgente)) {
    avvisa('Mappa del viso: non verificata contro l’EMR (il sottomodulo non è in questo clone).')
    return
  }
  let attuale
  try {
    attuale = improntaSorgenti()
  } catch (e) {
    problemi.push(`mappa del viso: impronta dell'EMR non calcolabile (${e.message}) — il confronto NON è stato fatto`)
    return
  }
  if (dati.revisione !== attuale) {
    problemi.push(
      `mappa del viso: l'applicazione è cambiata (impronta ${attuale}) e i dati del sito ` +
        `vengono da ${dati.revisione ?? 'nessuna impronta'} — rigenera con ` +
        '`node scripts/rigenera-aree-viso.mjs` e guarda la demo prima di committare',
    )
  }
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
    console.log('\x1b[32mMappa del viso: i dati del sito vengono dalla revisione attuale dell’applicazione.\x1b[0m')
  }
}
