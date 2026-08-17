import { t } from '@/lib/testo'
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

export function WebSiteSchema() {
  /* Il **nome del sito** che Google mostra nei risultati, sopra il titolo.
   *
   * Fonte primaria — Google Search Central, «Site Names in Google Search»
   * (https://developers.google.com/search/docs/appearance/site-names):
   * il nome è generato in automatico dalla home, ma *«per indicare la tua
   * preferenza, aggiungi i dati strutturati `WebSite` alla home page. Il
   * sistema considera anche `og:site_name`, `<title>` e le intestazioni, ma
   * **`WebSite` è il più importante** se vuoi specificare una preferenza»*.
   *
   * ⚠️ Qui NON c'è anagrafica societaria, ed è deliberato: `Organization`
   * resta silenzioso finché la S.r.l. non è costituita (vedi il commento in
   * testa a questo file). `WebSite` dichiara il **sito**, non l'editore —
   * niente che non sia già vero e verificabile sulla pagina.
   *
   * ⛔ Nessuna `SearchAction`: il sito non ha una ricerca interna, e
   * dichiararla farebbe comparire un riquadro di ricerca che non funziona. */
  return (
    <Json
      dati={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Fibonacci',
        url: SITE_URL,
        inLanguage: 'it-IT',
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
        applicationSubCategory: t('structureddata.cartella_clinica_per_la_medicina_estetica'),
        operatingSystem: 'Web',
        url: SITE_URL,
        inLanguage: 'it-IT',
        description:
          t('structureddata.cartella_clinica_per_studi_di_medicina'),
        // I prezzi dichiarati qui sono gli stessi di /prezzi. Se divergono, è
        // la pagina a fare fede e questo va corretto.
        offers: [
          {
            '@type': 'Offer',
            name: 'Solo',
            price: '129',
            priceCurrency: 'EUR',
            description: t('structureddata.un_medico_uno_studio_prezzo_mensile'),
          },
          {
            '@type': 'Offer',
            name: 'Studio',
            price: '279',
            priceCurrency: 'EUR',
            description: t('structureddata.fino_a_cinque_operatori_prezzo_mensile'),
          },
          {
            '@type': 'Offer',
            name: 'Clinica',
            price: '549',
            priceCurrency: 'EUR',
            description: t('structureddata.piu_sedi_o_oltre_cinque_operatori'),
          },
        ],
      }}
    />
  )
}
