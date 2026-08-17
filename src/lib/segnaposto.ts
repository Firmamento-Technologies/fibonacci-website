import { t } from '@/lib/testo'
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
const LACUNA = t('lib.segnaposto.da_indicare')

/** Un recapito che non esiste non diventa un indirizzo finto: diventa il
 *  modulo di contatto, come già fa il piè di pagina dei legali. */
const ripiegoModulo = (indirizzo: string) => indirizzo || t('lib.segnaposto.il_modulo_di_contatto_del_sito')

/* ⚠️ Ogni riga porta il proprio `> `: la riga successiva NON deve iniziare a sua
 * volta con `> `, o markdown legge una citazione annidata e il riquadro esce con
 * due barre verticali. Trovato guardando la pagina, non il codice. */
/* 🔴 PASSA DAL DIZIONARIO DAL 2026-08-17, e prima no.
 * Queste otto righe sono **iniettate in testa a ogni documento legale**, e
 * `risolviSegnaposto` gira uguale in tutte e cinque le lingue: un lettore
 * inglese apriva l'informativa privacy tradotta e trovava **il riquadro in
 * italiano**, cioè la prima cosa che si legge sulla pagina che più di ogni
 * altra deve farsi capire.
 * ⚠️ Nessun presidio poteva vederlo: `lingue-tradotte.mjs` confronta le frasi
 * **che stanno nel dizionario**, e queste non c'erano; `lingue-sorgenti.mjs`
 * aveva questo file fra le esclusioni, ⛔ e per giunta con la motivazione
 * sbagliata («dati dei due studi dimostrativi», che stanno invece in
 * `medici-pubblici.ts`). ⇒ una riga di esclusione scritta a occhio è costata
 * otto righe di italiano su 28 pagine tradotte.
 * 🔑 Trovato **rimisurando il costruito** con lo stesso metodo usato sul sito
 * vivo, ⛔ non da un controllo: il presidio diceva «3 residui», il confronto
 * riga per riga ne trovava 96. */
const AVVISO_BOZZA = [
  t('lib.segnaposto.bozza_non_sottoscritta_pubblicata_a_scopo'),
  t('lib.segnaposto.l_intestazione_societaria_di_questo_documento'),
  t('lib.segnaposto.societa_che_erogher_il_servizio_e'),
  t('lib.segnaposto.riportare_l_anagrafica_della_societa_che'),
  t('lib.segnaposto.una_controparte_contrattuale_sbagliata_denominazione_sede'),
  t('lib.segnaposto.numero_rea_e_recapiti_vengono_compilati'),
  t('lib.segnaposto.delle_imprese_fino_ad_allora_il'),
  t('lib.segnaposto.effetti_fra_le_parti'),
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
