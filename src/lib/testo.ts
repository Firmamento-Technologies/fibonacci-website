/**
 * Il testo del sito, preso dal dizionario della lingua di costruzione.
 *
 * ── COME SI USA ─────────────────────────────────────────────────────────────
 *   import { t } from '@/lib/testo'
 *   <h1>{t('prezzi.titolo')}</h1>
 *
 * ⚠️ È una funzione **sincrona e senza hook**, di proposito: le pagine di
 * questo sito sono Server Component, e un hook di React le costringerebbe
 * tutte a diventare client. La lingua è fissata alla costruzione
 * (`NEXT_PUBLIC_LINGUA`), quindi non c'è niente da reagire a runtime.
 *
 * ── CHE COSA SUCCEDE SE UNA CHIAVE MANCA ────────────────────────────────────
 * 🔑 In **costruzione** (`npm run build`) una chiave mancante **ferma la
 * build**. ⛔ Non ripiega in silenzio sull'italiano, e la ragione è misurata
 * altrove in questo progetto: un ripiego silenzioso produce una pagina tedesca
 * con dentro frasi italiane, che sembra tradotta e non lo è. Chi guarda non se
 * ne accorge, e nessun controllo diventa rosso.
 *
 * In **sviluppo** invece restituisce l'italiano e lo segnala in console: chi
 * sta scrivendo una pagina nuova deve poterla vedere prima di aver tradotto.
 */
import de from '@/i18n/sito/de.json'
import en from '@/i18n/sito/en.json'
import es from '@/i18n/sito/es.json'
import fr from '@/i18n/sito/fr.json'
import it from '@/i18n/sito/it.json'

import { LINGUA, type LinguaSito } from './lingua'

const DIZIONARI: Record<LinguaSito, Record<string, string>> = { it, en, es, fr, de }

/** Le chiavi esistenti, tipizzate sull'italiano che è la sorgente.
 *  ⇒ una chiave inventata è un **errore di compilazione**, non una sorpresa a
 *  video. */
export type ChiaveSito = keyof typeof it

const dizionario = DIZIONARI[LINGUA]

export function t(chiave: ChiaveSito): string {
  const valore = dizionario[chiave]
  if (valore !== undefined) return valore

  const italiano = (it as Record<string, string>)[chiave]
  if (process.env.NODE_ENV === 'production') {
    // ⛔ Fermare la build è il punto: vedi il capoverso in testa al file.
    throw new Error(
      `[testo] chiave «${chiave}» assente da ${LINGUA}.json. ` +
        `Aggiungila (anche uguale all'italiano se è un nome proprio), ` +
        `⛔ non toglierla dalla pagina.`,
    )
  }
  console.warn(`[testo] «${chiave}» manca in ${LINGUA}.json: mostro l'italiano`)
  return italiano ?? chiave
}

/**
 * Testo con un valore dentro: `t2('prezzi.da', { euro: '129' })`.
 * ⚠️ Esiste perché la scorciatoia è concatenare (`t('da') + euro + t('mese')`),
 * e concatenare **rompe le lingue con un altro ordine delle parole**: il testo
 * c'è tutto, quindi nessun controllo se ne accorge. Il segnaposto tiene la
 * frase intera in mano al traduttore.
 */
export function t2(chiave: ChiaveSito, valori: Record<string, string | number>): string {
  return t(chiave).replace(/\{\{(\w+)\}\}/g, (intero, nome: string) =>
    nome in valori ? String(valori[nome]) : intero,
  )
}
