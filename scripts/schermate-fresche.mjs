/**
 * «Le schermate del sito vengono dal codice che gira adesso?»
 *
 * ⚠️ UNA SOLA DEFINIZIONE, e sta qui per la stessa ragione di `ancora-emr.mjs`:
 * la domanda viene posta da **due chiamanti con due risposte diverse**, e
 * scrivere la regola due volte è il modo in cui questo progetto ha già rotto
 * due presidi.
 *
 *   · `collaudo.mjs`  → **avviso**. Non blocca il push.
 *   · `rilascia.mjs`  → **blocco**. Non si pubblica con schermate vecchie.
 *
 * ── PERCHÉ AVVISO SUL PUSH E BLOCCO SUL RILASCIO (decisione, 2026-08-16) ────
 * Una schermata vecchia fa danno **solo quando è pubblicata**. Il push non
 * pubblica niente: il sito va online con un `rsync`. Tenere il blocco sul push
 * significa fermare un gesto che non può fare il danno che il presidio previene,
 * e il prezzo è alto:
 *
 * 🔴 **Misurato il 2026-08-16**: fra la rigenerazione delle schermate e il push
 * un'altra sessione ha committato sul frontend EMR, e il cancello è tornato
 * rosso **in pochi minuti**. Quel commit toccava `mappa-corpo-3d` e il visore
 * anatomia, cioè **nessuna** delle cinque schermate pubblicate. ⇒ Finché l'EMR
 * è in sviluppo attivo questo controllo è rosso **quasi sempre**, e in questo
 * repo un presidio sempre rosso è già stato spento **due volte** (sta scritto
 * in `tappe-alte.json` e in `collaudo-cricca.json`).
 *
 * ⛔ **E la strada apparentemente ovvia è peggiore**: restringere l'ancora ai
 * soli file che disegnano quelle cinque schermate scambierebbe i falsi positivi
 * con **falsi negativi**. Un componente condiviso, un token di colore o una
 * regola di `globals.css` cambiano la resa senza comparire in nessuna mappa
 * schermata→file, e il risultato sarebbe un'immagine che mente sul prodotto
 * **senza che nessuno se ne accorga**. Fra un presidio che grida troppo e uno
 * che tace quando conta, si sposta il primo; non lo si trasforma nel secondo.
 * (`ancora-emr.mjs` questo ragionamento l'ha già fatto una volta, escludendo i
 * file di test, e si è fermato lì: quella riga è il confine difendibile.)
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PERCORSI_CHE_CAMBIANO_LA_RESA } from './ancora-emr.mjs'

/**
 * @param {string} radiceSito  la cartella `website/`
 * @returns {{stato: 'fresche'|'vecchie'|'non-verificabile', motivo: string|null}}
 */
export function schermateFresche(radiceSito) {
  const manifestoPath = join(radiceSito, 'public/schermate/manifesto.json')
  let manifesto
  try {
    manifesto = JSON.parse(readFileSync(manifestoPath, 'utf8'))
  } catch (e) {
    return {
      stato: 'vecchie',
      motivo: `manifesto delle schermate illeggibile (${e.message}) — esegui \`node scripts/schermate.mjs\``,
    }
  }

  const repoEmr = join(radiceSito, '..', 'EMR')
  if (!existsSync(repoEmr)) {
    return {
      stato: 'non-verificabile',
      motivo: 'il sottomodulo EMR non è in questo clone: freschezza non verificabile',
    }
  }
  if (!manifesto.commitFrontendEmr) {
    return { stato: 'non-verificabile', motivo: 'il manifesto non registra il commit EMR' }
  }

  let attuale
  try {
    attuale = execFileSync(
      'git',
      ['-C', repoEmr, 'log', '-1', '--format=%H', '--', ...PERCORSI_CHE_CAMBIANO_LA_RESA],
      { encoding: 'utf8' },
    ).trim()
  } catch {
    return { stato: 'non-verificabile', motivo: 'EMR non è un repo git leggibile da qui' }
  }

  if (attuale === manifesto.commitFrontendEmr) return { stato: 'fresche', motivo: null }

  return {
    stato: 'vecchie',
    motivo:
      `schermate prese dal frontend EMR ${manifesto.commitFrontendEmr.slice(0, 8)}, ` +
      `ma l'ultimo commit che tocca la resa è ${attuale.slice(0, 8)}.\n` +
      '   Rigenerale così (lo stack Medplum locale deve essere acceso):\n' +
      '     cd ../EMR/apps/web && npm run build && npx vite preview --port 4173 &\n' +
      '     cd ../../../website && node scripts/schermate.mjs\n' +
      '   ⚠️ Poi GUARDALE: i controlli automatici passano anche su un’agenda\n' +
      '   quasi vuota, che mostra un prodotto che sembra non usato.',
  }
}
