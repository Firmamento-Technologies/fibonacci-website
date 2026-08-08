import type { MetadataRoute } from 'next'

// `output: export` esige che queste rotte siano statiche in modo esplicito.
export const dynamic = 'force-static'
import { SITE_URL } from '@/lib/site-config'
import { DOCS } from '@/lib/docs-data'
import { LEGAL_DOCS } from '@/lib/legal-docs'

/* La mappa del sito.
 *
 * Le priorità non sono decorative: dicono al motore quali pagine valgono la
 * scansione. Qui l'ordine rispecchia il percorso d'acquisto — capire, poi
 * fidarsi, poi il prezzo — e i documenti legali restano indicizzabili
 * perché è esattamente lì che il consulente del cliente arriva da Google. */
/* ⚠️ DUE DIFETTI CORRETTI IL 2026-08-07, misurati sul sito pubblicato.
 *
 * 1. LA BARRA FINALE. `next.config.ts` ha `trailingSlash: true`, ma qui i
 *    percorsi erano costruiti senza: il sitemap dichiarava `…/come-funziona`,
 *    che risponde **301** verso `…/come-funziona/`, mentre il canonical della
 *    pagina dichiarava la versione con la barra. Cioè 23 URL su 24 proposti ai
 *    motori redirigevano, e nessuno coincideva con il canonical che la pagina
 *    stessa indicava. Un sitemap deve elencare URL canonici, non tappe.
 *
 * 2. LA DATA. `lastModified` era `new Date()`, valutata durante la
 *    costruzione: tutti e 24 gli URL portavano lo stesso timbro e ogni
 *    ricostruzione dichiarava ai motori che l'intero sito era cambiato, anche
 *    quando non era cambiato niente. È lo stesso difetto che E2.2 aveva già
 *    corretto nei documenti (`doc-dates.ts`) e che qui era sopravvissuto.
 *    Ora le date sono PINNATE: si aggiornano a mano quando la pagina cambia
 *    davvero, che è l'unico momento in cui l'informazione è vera. */

/** Ultima revisione reale, per percorso. Aggiornare quando la pagina cambia. */
const REVISIONE: Record<string, string> = {
  '/': '2026-08-07',
  '/come-funziona': '2026-08-07',
  '/consensi-informati': '2026-08-07',
  '/che-software-serve': '2026-08-08',
  '/autovalutazione': '2026-08-08',
  '/integrazioni': '2026-08-08',
  '/per-le-societa-scientifiche': '2026-08-08',
  '/prezzi': '2026-08-08',
  '/sicurezza-e-dati': '2026-08-07',
  '/richiedi-una-demo': '2026-08-07',
  '/verifica': '2026-08-07',
  '/domande': '2026-08-07',
  '/intelligenza-artificiale': '2026-08-07',
  '/chi-siamo': '2026-08-07',
  '/documentazione': '2026-08-07',
}

/** Default per le pagine non elencate sopra (guide e documenti legali). */
const REVISIONE_DEFAULT = '2026-08-07'

export default function sitemap(): MetadataRoute.Sitemap {
  const pagina = (percorso: string, priorita: number) => ({
    // La barra finale è obbligatoria: senza, l'URL risponde 301 e contraddice
    // il canonical della pagina. La radice ce l'ha già.
    url: `${SITE_URL}${percorso}${percorso.endsWith('/') ? '' : '/'}`,
    lastModified: new Date(`${REVISIONE[percorso] ?? REVISIONE_DEFAULT}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: priorita,
  })

  return [
    pagina('/', 1),
    pagina('/come-funziona', 0.9),
    pagina('/consensi-informati', 0.9),
    /* Le tre pagine dell'8 agosto. `che-software-serve` sta alto perché è
       l'unica che risponde a chi cerca «gestionale medicina estetica»;
       `autovalutazione` è lo strumento, e vale quanto una pagina di prodotto. */
    pagina('/che-software-serve', 0.85),
    pagina('/autovalutazione', 0.8),
    pagina('/prezzi', 0.85),
    pagina('/integrazioni', 0.6),
    pagina('/per-le-societa-scientifiche', 0.5),
    pagina('/sicurezza-e-dati', 0.85),
    pagina('/richiedi-una-demo', 0.8),
    pagina('/verifica', 0.7),
    pagina('/domande', 0.7),
    pagina('/intelligenza-artificiale', 0.6),
    pagina('/chi-siamo', 0.6),
    pagina('/documentazione', 0.5),
    ...DOCS.map((d) => pagina(`/documentazione/${d.slug}`, 0.4)),
    ...LEGAL_DOCS.map((d) => pagina(`/${d.slug}`, 0.3)),
  ]
}
