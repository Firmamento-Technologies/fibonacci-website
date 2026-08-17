import { t } from '@/lib/testo'
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
    title: t('lib.legaldocs.informativa_sulla_privacy'),
    shortTitle: t('lib.legaldocs.privacy_policy'),
    description:
      t('lib.legaldocs.informativa_ex_artt_13_14_gdpr'),
  },
  {
    /* ⚠️ L'obbligo scatta con la **raccolta**, ⛔ non con la pubblicazione:
       art. 14.3(a) dà **un mese dall'ottenimento** dei dati. Le prime schede
       sono state raccolte il 2026-08-13 ⇒ questo documento ⛔ non poteva
       aspettare che l'elenco andasse online. */
    slug: 'elenco-medici',
    title: t('lib.legaldocs.informativa_sull_elenco_pubblico_di_medici'),
    shortTitle: t('lib.legaldocs.elenco_medici'),
    description:
      t('lib.legaldocs.informativa_ex_art_14_gdpr_per'),
  },
  {
    slug: 'cookie',
    title: t('lib.legaldocs.cookie_policy'),
    shortTitle: t('lib.legaldocs.cookie_policy'),
    description:
      t('lib.legaldocs.informativa_ex_art_122_d_lgs'),
  },
  {
    slug: 'dpa',
    title: t('lib.legaldocs.accordo_per_il_trattamento_dei_dati'),
    shortTitle: t('lib.legaldocs.dpa_art_28_gdpr'),
    description: t('lib.legaldocs.accordo_ex_art_28_gdpr_fra'),
  },
  {
    slug: 'termini',
    title: t('lib.legaldocs.termini_di_servizio'),
    shortTitle: t('lib.legaldocs.termini_di_servizio'),
    description:
      t('lib.legaldocs.condizioni_generali_di_contratto_saas_b2b'),
  },
  {
    slug: 'sicurezza',
    title: t('lib.legaldocs.sicurezza_e_protezione_dei_dati'),
    shortTitle: t('lib.legaldocs.sicurezza'),
    description:
      t('lib.legaldocs.scheda_tecnica_delle_misure_di_sicurezza'),
  },
  {
    slug: 'sub-responsabili',
    title: t('lib.legaldocs.sub_responsabili_del_trattamento'),
    shortTitle: t('lib.legaldocs.sub_responsabili'),
    description:
      t('lib.legaldocs.elenco_nominativo_aggiornato_dei_sub_responsabili'),
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
