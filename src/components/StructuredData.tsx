import { SITE_URL, SOCIETA } from '@/lib/site-config'

/* Dati strutturati per i motori di ricerca.
 *
 * Regola: qui dentro non finisce niente che non sia vero e verificabile
 * altrove sul sito. I dati strutturati sono la prima cosa che un motore
 * confronta con il contenuto della pagina, e una discrepanza vale più di
 * un'omissione. Per questo l'anagrafica societaria compare SOLO quando la
 * S.r.l. è costituita: finché `SOCIETA.costituita` è falso, il grafo
 * descrive il prodotto e tace sull'editore. */

function Json({ dati }: { dati: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dati) }}
    />
  )
}

export function OrganizationSchema() {
  if (!SOCIETA.costituita) return null
  return (
    <Json
      dati={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SOCIETA.nomeBreve,
        legalName: SOCIETA.ragioneSociale,
        url: SITE_URL,
        vatID: SOCIETA.partitaIva,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SOCIETA.sede.via,
          postalCode: SOCIETA.sede.cap,
          addressLocality: SOCIETA.sede.comune,
          addressCountry: 'IT',
        },
      }}
    />
  )
}

export function SoftwareApplicationSchema() {
  return (
    <Json
      dati={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Fibonacci',
        applicationCategory: 'HealthApplication',
        applicationSubCategory: 'Cartella clinica per la medicina estetica',
        operatingSystem: 'Web',
        url: SITE_URL,
        inLanguage: 'it-IT',
        description:
          'Cartella clinica per studi di medicina estetica: consenso informato firmato in studio, mappa del viso per le sedute, foto cliniche cifrate, anamnesi dettata, registro accessi con catena di impronte.',
        // I prezzi dichiarati qui sono gli stessi di /prezzi. Se divergono, è
        // la pagina a fare fede e questo va corretto.
        offers: [
          {
            '@type': 'Offer',
            name: 'Solo',
            price: '99',
            priceCurrency: 'EUR',
            description: 'Un medico, uno studio. Prezzo mensile, IVA esclusa.',
          },
          {
            '@type': 'Offer',
            name: 'Studio',
            price: '189',
            priceCurrency: 'EUR',
            description: 'Fino a cinque operatori. Prezzo mensile, IVA esclusa.',
          },
        ],
      }}
    />
  )
}
