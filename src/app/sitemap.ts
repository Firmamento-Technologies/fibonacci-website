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
export default function sitemap(): MetadataRoute.Sitemap {
  const oggi = new Date()
  const pagina = (percorso: string, priorita: number) => ({
    url: `${SITE_URL}${percorso}`,
    lastModified: oggi,
    changeFrequency: 'monthly' as const,
    priority: priorita,
  })

  return [
    pagina('/', 1),
    pagina('/come-funziona', 0.9),
    pagina('/consensi-informati', 0.9),
    pagina('/prezzi', 0.85),
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
