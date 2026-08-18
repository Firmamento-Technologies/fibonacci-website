/**
 * Le clausole vessatorie del contratto contro quelle della schermata di
 * accettazione.
 *
 * ── 🔴 PERCHE' ESISTE, ED E' LA PIU' COSTOSA DELLE PARITA' ──────────────────
 * L'art. 1341 co. 2 c.c. dice che certe clausole «**non hanno effetto**, se non
 * sono specificamente approvate per iscritto». L'applicazione mostra al medico
 * un secondo flag con l'elenco di quelle clausole; il contratto le elenca al suo
 * art. 20.1. **Sono due copie, e il 2026-08-17 divergevano su tutto:**
 *
 *   contratto (art. 20.1)                    schermata (accettazione-condizioni.ts)
 *   art. 6  Modifiche dei corrispettivi       —
 *   art. 8  SLA, limitazione dei rimedi       art. 8  «Limitazione di responsabilità»
 *   art. 12 Limitazione di responsabilità     art. 12 «Rinnovo automatico»
 *   art. 13 Sospensione e risoluzione         —
 *   art. 15 Modifiche al Servizio             art. 15 «Foro competente»
 *   art. 17 Cessione del contratto            —
 *   art. 19 Legge applicabile e foro          —
 *   —                                         art. 9  «Facoltà di sospendere»
 *
 * ⇒ Sette clausole nel contratto, quattro nella schermata, e i numeri che
 * coincidono indicano **cose diverse**. Conseguenza: tre clausole vessatorie su
 * sette **non erano approvate da nessuno**, e le altre erano approvate con la
 * descrizione sbagliata. Saltano proprio quelle che proteggono il fornitore.
 *
 * 🔑 Il commento in testa a `accettazione-condizioni.ts` **lo aveva previsto**
 * («l'elenco va tenuto allineato all'EULA: una clausola che sta nel contratto ma
 * non qui non ha effetto»). ⚠️ Non è bastato, ed è la lezione che questo repo ha
 * già imparato sui prezzi: *una regola scritta non è un presidio, un confronto
 * che diventa rosso sì*. Vedi `parita-listino.mjs`, nato dallo stesso difetto.
 *
 * ⚠️ Si confrontano i **numeri di articolo**, non i titoli: il titolo nella
 * schermata è per forza più corto di quello del contratto, e pretenderli uguali
 * darebbe un presidio che grida sempre. A divergere in silenzio è **quali**
 * clausole vengono approvate, ed è l'unica cosa che rende inefficace una
 * clausola.
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const CONTRATTO = join(QUI, '..', 'src', 'content', 'legal', 'termini.md')
const SCHERMATA = join(QUI, '..', '..', 'EMR', 'apps', 'web', 'src', 'lib', 'accettazione-condizioni.ts')

/** Gli articoli elencati all'art. 20.1 del contratto. */
function dalContratto() {
  const testo = readFileSync(CONTRATTO, 'utf8')
  /* ⚠️ Si parte dall'INTESTAZIONE `## Art. 20`, ⛔ non dal primo «20.1» del
     documento: quel numero compare anche nell'art. 3.4, che rimanda qui, e
     agganciarlo lì faceva leggere al presidio il paragrafo sbagliato. Trovato
     eseguendolo: diceva «la registrazione fa approvare art. 8, 9, 12, 15 che
     non sono nel contratto» mentre tre dei quattro c'erano. */
  const sezione = testo.match(/##\s*Art\.\s*20[\s\S]*/)
  if (!sezione) return null
  const blocco = sezione[0].match(/20\.1[\s\S]*?(?=\n20\.2|\n## )/)
  if (!blocco) return null
  return new Set([...blocco[0].matchAll(/\*\*Art\.\s*(\d+)\*\*/gi)].map((m) => Number(m[1])))
}

/** Gli articoli che la schermata fa approvare. */
function dallaSchermata() {
  if (!existsSync(SCHERMATA)) return null
  const testo = readFileSync(SCHERMATA, 'utf8')
  const blocco = testo.match(/CLAUSOLE_VESSATORIE\s*=\s*\[([\s\S]*?)\]/)
  if (!blocco) return null
  return new Set([...blocco[1].matchAll(/art\.\s*(\d+)/gi)].map((m) => Number(m[1])))
}

export function paritaVessatorie(problemi, avvisa) {
  const contratto = dalContratto()
  const schermata = dallaSchermata()

  /* ⛔ «Non trovato» NON è «tutto bene»: se il formato cambia e questo tace,
     il presidio smette di esistere senza che nessuno se ne accorga. */
  if (!contratto) {
    problemi.push('parita-vessatorie: l’art. 20.1 di termini.md non è leggibile, il confronto non è stato fatto')
    return
  }
  if (!schermata) {
    avvisa?.('⚠️  parita-vessatorie: il submodule EMR non è in questo clone, confronto saltato')
    return
  }

  const soloContratto = [...contratto].filter((a) => !schermata.has(a)).sort((x, y) => x - y)
  const soloSchermata = [...schermata].filter((a) => !contratto.has(a)).sort((x, y) => x - y)

  if (soloContratto.length) {
    problemi.push(
      `parita-vessatorie: ${soloContratto.length} clausole vessatorie del contratto NON sono ` +
        `fatte approvare alla registrazione (art. ${soloContratto.join(', ')}) ⇒ ex art. 1341 co. 2 c.c. NON hanno effetto`,
    )
  }
  if (soloSchermata.length) {
    problemi.push(
      `parita-vessatorie: la registrazione fa approvare art. ${soloSchermata.join(', ')}, ` +
        'che non sono elencati all’art. 20.1 del contratto',
    )
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problemi = []
  paritaVessatorie(problemi, (m) => console.log(m))
  if (problemi.length === 0) console.log('✅ le clausole vessatorie del contratto e della registrazione combaciano')
  else {
    for (const p of problemi) console.log('⛔ ' + p)
    process.exit(1)
  }
}
