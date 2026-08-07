import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { docRevisionDate } from './doc-dates'
import { SOCIETA, PRIVACY_EMAIL, SUPPORT_EMAIL, CONTACT_EMAIL } from './site-config'

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

export interface SitePage {
  slug: string
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
  priority: number
}

export const STATIC_SITE_PAGES: SitePage[] = [
  { slug: 'faq', changeFrequency: 'monthly', priority: 0.7 },
  { slug: 'chi-siamo', changeFrequency: 'yearly', priority: 0.6 },
  { slug: 'docs', changeFrequency: 'monthly', priority: 0.7 },
  { slug: 'consensi-informati', changeFrequency: 'monthly', priority: 0.8 },
  { slug: 'intelligenza-artificiale', changeFrequency: 'monthly', priority: 0.8 },
  { slug: 'segreteria', changeFrequency: 'weekly', priority: 0.9 },
  { slug: 'prova-demo', changeFrequency: 'monthly', priority: 0.9 },
  { slug: 'partners', changeFrequency: 'monthly', priority: 0.6 },
  { slug: 'status', changeFrequency: 'weekly', priority: 0.5 },
  { slug: 'verify', changeFrequency: 'monthly', priority: 0.5 },
]

export function getLegalDocMeta(slug: string): LegalDocMeta | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug)
}

/* ── Intestazione societaria dei documenti legali ──────────────────────────
 * I sei documenti erano intestati a Firmamento Technologies Soc. Coop. e ne
 * riportavano le caselle di posta. Quella società non è il prestatore del
 * servizio: Fibonacci sarà una S.r.l. che alla data di questa revisione NON è
 * ancora costituita. Pubblicare l'anagrafica e gli indirizzi di un soggetto
 * diverso da chi eroga il servizio non è un dettaglio di forma — manda chi
 * deve esercitare un diritto o notificare una violazione al destinatario
 * sbagliato, e in un documento ex art. 28 GDPR il destinatario è la controparte
 * contrattuale.
 *
 * Quindi qui NON si inventa e non si eredita: il dato che non esiste resta un
 * vuoto dichiarato, esattamente come in `site-config.ts`. Quando la S.r.l. è
 * iscritta si compila quel file e questi sei documenti si popolano da soli.
 *
 * ⚠️ Finché i vuoti restano, il sito è fuori dall'art. 7 c. 1 D.Lgs. 70/2003 e
 * i documenti NON sono sottoscrivibili: è la ragione dell'avviso in testa a
 * ciascuno di essi. */
/* Il segnaposto è volutamente CORTO. La prima versione diceva «da indicare alla
 * costituzione della società» per esteso, e nella riga «Fornitore» dei Termini
 * ricorre cinque volte di fila: la frase è corretta e il paragrafo diventa
 * illeggibile. La spiegazione sta una volta sola, nell'avviso in testa al
 * documento; qui basta il segno che marca il vuoto. */
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
].map((riga) => `> ${riga}`).join('\n')

export async function loadLegalDoc(slug: string): Promise<string> {
  const filePath = join(process.cwd(), 'src', 'content', 'legal', `${slug}.md`)
  const raw = await readFile(filePath, 'utf-8')
  // Data di revisione PINNATA (E2.2): non la data di build (vedi doc-dates.ts).
  return raw
    .replaceAll('{ULTIMA_REVISIONE}', docRevisionDate(slug))
    .replaceAll('{AVVISO_BOZZA}', AVVISO_BOZZA)
    .replaceAll('{DENOMINAZIONE}', SOCIETA.ragioneSociale || LACUNA)
    .replaceAll('{SEDE_LEGALE}', SOCIETA.sede.via ? `${SOCIETA.sede.via}, ${SOCIETA.sede.cap} ${SOCIETA.sede.comune} (${SOCIETA.sede.provincia})` : LACUNA)
    .replaceAll('{PARTITA_IVA}', SOCIETA.partitaIva || LACUNA)
    .replaceAll('{REA}', SOCIETA.rea || LACUNA)
    .replaceAll('{PEC}', SOCIETA.pec || LACUNA)
    .replaceAll('{EMAIL_PRIVACY}', ripiegoModulo(PRIVACY_EMAIL))
    .replaceAll('{EMAIL_SUPPORTO}', ripiegoModulo(SUPPORT_EMAIL))
    .replaceAll('{EMAIL_COMMERCIALE}', ripiegoModulo(CONTACT_EMAIL))
    .replaceAll('{EMAIL_SICUREZZA}', ripiegoModulo(PRIVACY_EMAIL))
}
