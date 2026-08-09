import { docRevisionDate } from './doc-dates'
import { SOCIETA, PRIVACY_EMAIL, SUPPORT_EMAIL, CONTACT_EMAIL, SITE_URL, APP_URL } from './site-config'

/* Sostituzione dei segnaposto nei documenti in markdown — UN POSTO SOLO.
 *
 * Prima la logica stava dentro `loadLegalDoc`, e `loadDoc` (le guide) ne aveva
 * una copia parziale: sostituiva `{ULTIMA_REVISIONE}` e basta. Risultato
 * misurato il 2026-08-07: una guida conteneva `{URL_APP}` mai risolto, perché
 * quel loader non lo conosceva. Due copie della stessa regola divergono sempre,
 * e la seconda diverge in silenzio — nessuno la guarda.
 *
 * Quindi: entrambi i loader chiamano questa funzione. Aggiungere un segnaposto
 * qui lo rende disponibile ovunque, e nessun documento può restare indietro.
 *
 * ⚠️ INTESTAZIONE SOCIETARIA — DA COMPLETARE ALLA COSTITUZIONE.
 * I sei documenti legali erano intestati a Firmamento Technologies Soc. Coop. e
 * ne riportavano le caselle di posta. Quella società non è il prestatore del
 * servizio: Fibonacci sarà una S.r.l. che alla data di questa revisione NON è
 * ancora costituita. Pubblicare l'anagrafica e gli indirizzi di un soggetto
 * diverso da chi eroga il servizio non è forma — in un documento ex art. 28
 * GDPR l'intestazione È la controparte contrattuale, e manda chi deve
 * esercitare un diritto o notificare una violazione al destinatario sbagliato.
 *
 * Qui non si inventa e non si eredita: il dato che non esiste resta un vuoto
 * dichiarato. Si compila `site-config.ts` il giorno dell'iscrizione al registro
 * delle imprese, e questi documenti si popolano da soli.
 *
 * ⚠️ Finché i vuoti restano, il sito è fuori dall'art. 7 c. 1 D.Lgs. 70/2003 e
 * i documenti NON sono sottoscrivibili: è la ragione dell'avviso in testa a
 * ciascuno di essi. */

/* Segnaposto volutamente CORTO. La prima versione diceva «da indicare alla
 * costituzione della società» per esteso, e nella riga «Fornitore» dei Termini
 * ricorre cinque volte di fila: la frase è corretta e il paragrafo diventa
 * illeggibile. La spiegazione sta una volta sola, nell'avviso in testa. */
const LACUNA = '⟨da indicare⟩'

/** Un recapito che non esiste non diventa un indirizzo finto: diventa il
 *  modulo di contatto, come già fa il piè di pagina dei legali. */
const ripiegoModulo = (indirizzo: string) => indirizzo || 'il modulo di contatto del sito'

/* ⚠️ Ogni riga porta il proprio `> `: la riga successiva NON deve iniziare a sua
 * volta con `> `, o markdown legge una citazione annidata e il riquadro esce con
 * due barre verticali. Trovato guardando la pagina, non il codice. */
const AVVISO_BOZZA = [
  '**Bozza non sottoscritta, pubblicata a scopo di consultazione.**',
  "L'intestazione societaria di questo documento è deliberatamente vuota: la",
  'società che erogherà il servizio è una S.r.l. **non ancora costituita**, e',
  "riportare l'anagrafica della società che ha sviluppato il software indicherebbe",
  'una controparte contrattuale sbagliata. Denominazione, sede, partita IVA,',
  "numero REA e recapiti vengono compilati il giorno dell'iscrizione al registro",
  'delle imprese; fino ad allora il documento non è sottoscrivibile e non produce',
  'effetti fra le parti.',
]
  .map((riga) => `> ${riga}`)
  .join('\n')

const sedeEstesa = () =>
  SOCIETA.sede.via
    ? `${SOCIETA.sede.via}, ${SOCIETA.sede.cap} ${SOCIETA.sede.comune} (${SOCIETA.sede.provincia})`
    : LACUNA

/**
 * Risolve i segnaposto di un documento markdown.
 *
 * @param testo contenuto grezzo del file
 * @param slug  identificativo del documento, per la data di revisione pinnata
 */
export function risolviSegnaposto(testo: string, slug: string): string {
  return (
    testo
      // Data di revisione PINNATA (E2.2): non la data di build (vedi doc-dates.ts).
      .replaceAll('{ULTIMA_REVISIONE}', docRevisionDate(slug))
      .replaceAll('{AVVISO_BOZZA}', AVVISO_BOZZA)
      // Anagrafica societaria: vuota finché la S.r.l. non esiste.
      .replaceAll('{DENOMINAZIONE}', SOCIETA.ragioneSociale || LACUNA)
      .replaceAll('{SEDE_LEGALE}', sedeEstesa())
      .replaceAll('{PARTITA_IVA}', SOCIETA.partitaIva || LACUNA)
      .replaceAll('{REA}', SOCIETA.rea || LACUNA)
      .replaceAll('{PEC}', SOCIETA.pec || LACUNA)
      // Recapiti: assenti finché non esistono le caselle della S.r.l.
      .replaceAll('{EMAIL_PRIVACY}', ripiegoModulo(PRIVACY_EMAIL))
      .replaceAll('{EMAIL_SUPPORTO}', ripiegoModulo(SUPPORT_EMAIL))
      .replaceAll('{EMAIL_COMMERCIALE}', ripiegoModulo(CONTACT_EMAIL))
      .replaceAll('{EMAIL_SICUREZZA}', ripiegoModulo(PRIVACY_EMAIL))
      // Indirizzi. Cambiano entrambi quando si registra il dominio proprio.
      .replaceAll('{URL_SITO}', SITE_URL)
      /* Un URL che non esiste non entra in un documento legale come stringa
         vuota: diventa la lacuna dichiarata, come gli altri dati mancanti. */
      .replaceAll('{URL_APP}', APP_URL || LACUNA)
  )
}
