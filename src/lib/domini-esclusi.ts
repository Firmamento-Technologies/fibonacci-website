/* I domini che ⛔ non si raccolgono mai. — canale paziente
 *
 * 🔑 **Non è una lista di concorrenti: è la linea che tiene in piedi tutto il
 * resto.** La regola che rende lecita la raccolta è una sola — *i fatti sono
 * liberi, le raccolte altrui no*. Un aggregatore **è** una raccolta altrui:
 * prendere una riga da lì significa estrarre dalla sua banca dati, ⛔ non
 * osservare un fatto pubblicato dalla clinica.
 *
 * ⚠️ Perché serve una lista scritta e ⛔ non il buon senso: cercando «medicina
 * estetica Milano» il 2026-08-13, **MioDottore era fra i primi dieci
 * risultati**. Senza questo elenco sarebbe finito nella raccolta al primo giro,
 * e nessuno se ne sarebbe accorto — la riga sarebbe sembrata una clinica come
 * le altre.
 *
 * ⛔ **Si esclude prima di scaricare, non dopo.** Filtrare a valle vorrebbe dire
 * aver già estratto.
 */
export const DOMINI_ESCLUSI: readonly string[] = [
  // Portali e marketplace sanitari (raccolte altrui)
  'miodottore.it',
  'doctolib.it',
  'dottori.it',
  'top-doctors.it',
  'topdoctors.it',
  'medicitalia.it',
  'guidapsicologi.it',
  // ⚠️ Incontrato cercando «tossina botulinica Milano» il 2026-08-13: è un
  // **elenco di strutture sanitarie**, cioè esattamente una raccolta altrui.
  // Sembra una fonte istituzionale e ⛔ non lo è.
  'micuro.it',
  // Emersi solo alle pagine 2-4 dei risultati (2026-08-13): ⚠️ gli aggregatori
  // ⛔ non stanno tutti in cima — cercare in profondità ne fa uscire di nuovi.
  'idoctors.it',
  'youmed.it',
  // ⚠️ Uscito cercando **i professionisti**, ⛔ non le cliniche (2026-08-13):
  // «Filler labbra: 276 dottori specializzati a Milano». Cambiando il tipo di
  // ricerca cambia anche la famiglia di aggregatori che si incontra ⇒ la lista
  // ⛔ non è finita, si allunga ad ogni nuovo taglio di ricerca.
  'guidaestetica.it',
  // Elenchi generalisti e directory d'impresa
  'paginegialle.it',
  'paginebianche.it',
  'virgilio.it',
  'registroaziende.it',
  'ufficiocamerale.it',
  'reportaziende.it',
  // Mappe e recensioni
  'google.com',
  'google.it',
  'maps.google.com',
  'tripadvisor.it',
  'yelp.it',
  'facebook.com',
  'instagram.com',
  // Federazioni e associazioni: sono un CANALE, ⛔ non una fonte da estrarre
  'federazionemediciestetici.it',
  'agorasocieta.it',
  'sime-medicinaestetica.it',
]

/** `true` se l'indirizzo appartiene a un dominio da ⛔ non raccogliere.
 *  ⚠️ Confronta anche i sottodomini (`www.`, `lp.`): un `endsWith` sul nome
 *  nudo lascerebbe passare `lp.paginegialle.it`. */
export function daEscludere(url: string): boolean {
  let host: string
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return true // ⛔ un indirizzo che non si sa leggere ⛔ non si visita.
  }
  return DOMINI_ESCLUSI.some((d) => host === d || host.endsWith(`.${d}`))
}
