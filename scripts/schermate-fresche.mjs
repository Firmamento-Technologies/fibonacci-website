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
export function schermateFresche(radiceSito, rif = null) {
  // ⚠️ **Il manifesto del RIFERIMENTO CHE SI RILASCIA, ⛔ non quello sul disco**
  // (2026-08-18). Terza istanza dello stesso difetto in un pomeriggio: il
  // rilascio costruisce da un worktree su `origin/main`, ⛔ ma la freschezza
  // veniva letta dall'albero **locale**, che e' condiviso e quasi sempre
  // indietro. Risultato misurato: schermate rigenerate e spinte, cancello
  // ancora rosso, e il motivo nominava un manifesto che nessuno stava per
  // pubblicare.
  // 🔑 La regola generale, e vale per tutti e tre i casi: **un controllo di
  // rilascio deve leggere ciò che si rilascia**, non ciò che si ha sotto mano.
  const manifestoPath = join(radiceSito, 'public/schermate/manifesto.json')
  let manifesto
  try {
    manifesto = JSON.parse(
      rif
        ? execFileSync('git', ['-C', radiceSito, 'show', `${rif}:public/schermate/manifesto.json`], {
            encoding: 'utf8',
          })
        : readFileSync(manifestoPath, 'utf8'),
    )
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

  // ⚠️ **Contro `origin/main`, ⛔ non contro `HEAD`** (corretto il 2026-08-18).
  // 🔴 Il difetto misurato: `git log -1` senza riferimento legge il **ramo su
  // cui l'albero EMR condiviso si trova adesso**, e quell'albero è di tutte le
  // sessioni. Il 18 agosto era su `claude/cancelli-1-2-3` a `a05fbd93`, che ⛔
  // **non è su `origin/main`**: il cancello ha fermato un rilascio nominando
  // un commit che non sarebbe mai stato pubblicato.
  // 🔑 La domanda giusta è «le schermate corrispondono a **ciò che si
  // rilascia**», e ciò che si rilascia è `origin/main` (lo dice `rilascia.mjs`,
  // che costruisce da un worktree su quel riferimento). Un ramo di lavoro
  // altrui ⛔ non c'entra, in nessuna delle due direzioni: potrebbe anche
  // renderlo **verde per sbaglio**, se quell'albero stesse su un commit vecchio.
  let attuale
  try {
    attuale = execFileSync(
      'git',
      [
        '-C',
        repoEmr,
        'log',
        '-1',
        '--format=%H',
        'refs/remotes/origin/main',
        '--',
        ...PERCORSI_CHE_CAMBIANO_LA_RESA,
      ],
      { encoding: 'utf8' },
    ).trim()
  } catch {
    return {
      stato: 'non-verificabile',
      // ⚠️ Dichiarare che cosa NON si è guardato, ⛔ non tacere: senza il
      // riferimento remoto la freschezza non è verificabile, e un presidio
      // che tace su ciò che non ha guardato è peggio di uno assente.
      motivo:
        "EMR non è leggibile da qui, oppure manca `refs/remotes/origin/main` " +
        '(serve un `git -C ../EMR fetch origin main`): freschezza non verificata',
    }
  }

  if (attuale === manifesto.commitFrontendEmr) return { stato: 'fresche', motivo: null }

  return {
    stato: 'vecchie',
    motivo:
      `schermate prese dal frontend EMR ${manifesto.commitFrontendEmr.slice(0, 8)}, ` +
      `ma l'ultimo commit che tocca la resa è ${attuale.slice(0, 8)}.\n` +
      '   Rigenerale così (lo stack Medplum locale deve essere acceso):\n' +
      '     cd ../EMR/apps/web && npm run build && npx vite preview --port 5173 --host 127.0.0.1 &\n' +
      '     cd ../../../website && node scripts/schermate.mjs\n' +
      '   ⚠️ La porta 5173 NON è indifferente: il pdf-signer ammette in CORS solo\n' +
      '   5173-5175, e altrove il catalogo consensi esce «non raggiungibile».\n' +
      '   ⚠️ Poi GUARDALE: i controlli automatici passano anche su un’agenda\n' +
      '   quasi vuota, e passano anche su una schermata che mostra un ERRORE —\n' +
      '   successo il 2026-08-17, e l’ha visto una persona, non un controllo.',
  }
}
