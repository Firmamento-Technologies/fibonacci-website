/* L'ordine in cui le pagine si susseguono.
 *
 * ⚠️ SERVE PERCHÉ IL SITO NON È PIÙ UN MUCCHIO DI PAGINE, È UN PERCORSO.
 * Ogni pagina occupa **una schermata** e in fondo ha una freccia a V che porta
 * alla successiva: senza un ordine dichiarato quella freccia non saprebbe dove
 * andare, e ognuno ne inventerebbe uno diverso pagina per pagina — cioè la
 * solita seconda copia destinata a divergere.
 *
 * L'ordine non è alfabetico: è **il ragionamento di chi compra**.
 *   1. cos'è            → home
 *   2. come si usa      → come funziona
 *   3. il differenziante → consensi
 *   4. l'obiezione n.1  → sicurezza e dati
 *   5. quanto costa     → prezzi
 *   6. i dubbi residui  → domande
 *   7. con chi ho a che fare → chi siamo
 *   8. l'azione         → richiedi una demo
 *
 * ⛔ Le pagine legali e le guide NON stanno nel percorso: si raggiungono dal
 * piè di pagina quando servono, e sono testi integrali che non stanno né
 * devono stare in una schermata.
 */

export interface Tappa {
  href: string
  /** Come si chiama la tappa nella freccia: «Avanti: <titolo>». */
  titolo: string
}

export const PERCORSO: Tappa[] = [
  { href: '/', titolo: 'Come funziona' },
  { href: '/come-funziona', titolo: 'I consensi' },
  { href: '/consensi-informati', titolo: 'Sicurezza e dati' },
  { href: '/sicurezza-e-dati', titolo: 'Prezzi' },
  { href: '/prezzi', titolo: 'Domande' },
  { href: '/domande', titolo: 'Chi siamo' },
  { href: '/chi-siamo', titolo: 'Richiedi una demo' },
  { href: '/richiedi-una-demo', titolo: '' },
]

/** La tappa dopo `href`, o `null` se è l'ultima (o fuori percorso). */
export function prossima(href: string): { href: string; titolo: string } | null {
  const pulito = href.replace(/\/$/, '') || '/'
  const i = PERCORSO.findIndex((t) => t.href === pulito)
  if (i < 0 || i === PERCORSO.length - 1) return null
  return { href: PERCORSO[i + 1].href, titolo: PERCORSO[i].titolo }
}
