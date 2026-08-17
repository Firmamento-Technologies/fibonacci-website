import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { risolviSegnaposto } from './segnaposto'

export interface LegalDocMeta {
  slug: string
  title: string
  shortTitle: string
  description: string
}

export const LEGAL_DOCS: LegalDocMeta[] = [
  {
    slug: 'privacy',
    title: 'Informativa sulla Privacy',
    shortTitle: 'Privacy Policy',
    description:
      'Informativa ex artt. 13-14 GDPR sul trattamento dei dati personali raccolti tramite il sito e l\'applicazione Fibonacci.',
  },
  {
    /* ⚠️ L'obbligo scatta con la **raccolta**, ⛔ non con la pubblicazione:
       art. 14.3(a) dà **un mese dall'ottenimento** dei dati. Le prime schede
       sono state raccolte il 2026-08-13 ⇒ questo documento ⛔ non poteva
       aspettare che l'elenco andasse online. */
    slug: 'elenco-medici',
    title: 'Informativa sull\'elenco pubblico di medici e strutture',
    shortTitle: 'Elenco medici',
    description:
      'Informativa ex art. 14 GDPR per i medici e le strutture il cui profilo compare nell\'elenco pubblico consultabile dai pazienti, con le istruzioni per farlo rimuovere.',
  },
  {
    slug: 'cookie',
    title: 'Cookie Policy',
    shortTitle: 'Cookie Policy',
    description:
      'Informativa ex art. 122 D.Lgs. 196/2003 e Provv. Garante 2021 sui cookie e tecnologie analoghe utilizzati da Fibonacci.',
  },
  {
    slug: 'dpa',
    title: 'Accordo per il Trattamento dei Dati (DPA)',
    shortTitle: 'DPA art. 28 GDPR',
    description: 'Accordo ex art. 28 GDPR fra il medico cliente, titolare del trattamento, e il fornitore del servizio, responsabile, per il trattamento dei dati dei pazienti.',
  },
  {
    slug: 'termini',
    title: 'Termini di Servizio',
    shortTitle: 'Termini di Servizio',
    description:
      'Condizioni generali di contratto SaaS B2B per l\'utilizzo del software Fibonacci da parte di medici e strutture sanitarie.',
  },
  {
    slug: 'sicurezza',
    title: 'Sicurezza e protezione dei dati',
    shortTitle: 'Sicurezza',
    description:
      'Scheda tecnica delle misure di sicurezza ex art. 32 GDPR adottate da Fibonacci. Allegato A del DPA.',
  },
  {
    slug: 'sub-responsabili',
    title: 'Sub-responsabili del trattamento',
    shortTitle: 'Sub-responsabili',
    description:
      'Elenco nominativo aggiornato dei sub-responsabili del trattamento autorizzati ex art. 28.2 GDPR. Allegato B del DPA.',
  },
]

export function getLegalDocMeta(slug: string): LegalDocMeta | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug)
}

/**
 * Il documento legale nella lingua di questa costruzione.
 *
 * ⚠️ **Il ripiego sull'italiano è VOLUTO qui, ed è l'opposto della regola del
 * dizionario.** Per un'etichetta di interfaccia una chiave mancante ferma la
 * build, perché una pagina tedesca con dentro frasi italiane sembra tradotta e
 * non lo è. Per un documento legale la scelta si rovescia: 🔑 **mostrare
 * l'informativa privacy in italiano è molto meglio che non mostrarla affatto**
 * — è un obbligo di legge, e una pagina che non c'è è un'inadempienza, mentre
 * una pagina nella lingua sbagliata è solo scomoda.
 *
 * ⚠️ Le traduzioni portano già in testa la clausola «in caso di discrepanza fa
 * fede la versione italiana» (decisione dell'utente, 2026-08-17): la antepone
 * `scripts/traduci-sito.mjs`, ⛔ non va aggiunta qui o comparirebbe due volte.
 *
 * 🔎 Il presidio contro il ripiego silenzioso è nel collaudo
 * (`scripts/collaudo.mjs`, controllo `legali-tradotti`): conta quanti
 * documenti ripiegano e lo **dice**. Un ripiego che nessuno conta diventa
 * permanente.
 */
export async function loadLegalDoc(slug: string): Promise<string> {
  const cartella = join(process.cwd(), 'src', 'content', 'legal')
  const lingua = (process.env.NEXT_PUBLIC_LINGUA ?? 'it').trim()
  const percorsi =
    lingua && lingua !== 'it'
      ? [join(cartella, lingua, `${slug}.md`), join(cartella, `${slug}.md`)]
      : [join(cartella, `${slug}.md`)]

  for (const p of percorsi) {
    try {
      return risolviSegnaposto(await readFile(p, 'utf-8'), slug)
    } catch {
      /* prova il prossimo */
    }
  }
  throw new Error(`[legal-docs] «${slug}» non esiste né in ${lingua} né in italiano`)
}
