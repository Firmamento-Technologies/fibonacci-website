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
 *   5. l'obiezione del consulente → conformità europea
 *   6. quanto costa     → prezzi
 *   7. i dubbi residui  → domande
 *   8. con chi ho a che fare → chi siamo
 *   9. l'azione         → richiedi una demo
 *
 * ⛔ Le pagine legali e le guide NON stanno nel percorso: si raggiungono dal
 * piè di pagina quando servono, e sono testi integrali che non stanno né
 * devono stare in una schermata.
 */

import { t } from '@/lib/testo'

export interface Tappa {
  href: string
  /** Come si chiama la tappa nella freccia: «Avanti: <titolo>». */
  titolo: string
}

export const PERCORSO: Tappa[] = [
  { href: '/', titolo: t('lib.percorso.come_funziona') },
  { href: '/come-funziona', titolo: t('lib.percorso.i_consensi') },
  { href: '/consensi-informati', titolo: t('lib.percorso.sicurezza_e_dati') },
  /* ⚠️ Tappa aggiunta il 2026-08-16, e sta QUI per una ragione precisa:
     «sicurezza e dati» risponde a *i miei dati sono al sicuro*, «conformità
     europea» risponde a *e io sono coperto*. Sono due obiezioni diverse e la
     seconda viene dopo la prima, perché è quella che il medico non si pone da
     solo: gliela pone il consulente. */
  { href: '/sicurezza-e-dati', titolo: t('lib.percorso.conformita_europea') },
  { href: '/conformita-europea', titolo: t('lib.percorso.prezzi') },
  { href: '/prezzi', titolo: t('lib.percorso.domande') },
  { href: '/domande', titolo: t('lib.percorso.chi_siamo') },
  { href: '/chi-siamo', titolo: t('lib.percorso.richiedi_una_demo') },
  { href: '/richiedi-una-demo', titolo: '' },
]

/** La tappa dopo `href`, o `null` se è l'ultima (o fuori percorso). */
export function prossima(href: string): { href: string; titolo: string } | null {
  const pulito = href.replace(/\/$/, '') || '/'
  const i = PERCORSO.findIndex((t) => t.href === pulito)
  if (i < 0 || i === PERCORSO.length - 1) return null
  return { href: PERCORSO[i + 1].href, titolo: PERCORSO[i].titolo }
}
