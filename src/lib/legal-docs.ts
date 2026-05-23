import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

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
      'Informativa ex artt. 13-14 GDPR sul trattamento dei dati personali raccolti tramite il sito fibonacci.it e l\'applicazione Fibonacci.',
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
    description:
      'Accordo ex art. 28 GDPR fra il medico cliente (Titolare) e Firmamento Technologies S.r.l. (Responsabile) per il trattamento dei dati dei pazienti.',
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

export interface SitePage {
  slug: string
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
  priority: number
}

export const STATIC_SITE_PAGES: SitePage[] = [
  { slug: 'faq', changeFrequency: 'monthly', priority: 0.7 },
  { slug: 'chi-siamo', changeFrequency: 'yearly', priority: 0.6 },
]

export function getLegalDocMeta(slug: string): LegalDocMeta | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug)
}

export async function loadLegalDoc(slug: string): Promise<string> {
  const filePath = join(process.cwd(), 'src', 'content', 'legal', `${slug}.md`)
  const raw = await readFile(filePath, 'utf-8')
  const today = new Date().toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return raw.replaceAll('{ULTIMA_REVISIONE}', today)
}
