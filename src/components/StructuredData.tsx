import { SITE_URL, CONTACT_EMAIL, FIRMAMENTO } from '@/lib/site-config'

// JSON-LD structured data per rich snippet Google e altri motori di ricerca.
// Schema.org: Organization + SoftwareApplication + MedicalBusiness.
// Vedi https://developers.google.com/search/docs/appearance/structured-data

export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fibonacci',
    legalName: 'Firmamento Technologies Società Cooperativa',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      'Fibonacci e\' la cartella clinica digitale per medici italiani, prodotto da Firmamento Technologies Soc. Coop. Software SaaS multi-specialita\': medicina estetica, dermatologia, ortopedia, psicologia, nutrizione, oculistica.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: FIRMAMENTO.address.street,
      postalCode: FIRMAMENTO.address.postalCode,
      addressLocality: FIRMAMENTO.address.locality,
      addressRegion: FIRMAMENTO.address.region,
      addressCountry: FIRMAMENTO.address.country,
    },
    taxID: FIRMAMENTO.fiscalCode,
    vatID: FIRMAMENTO.vatEU,
    parentOrganization: {
      '@type': 'Organization',
      name: FIRMAMENTO.legalName,
      url: FIRMAMENTO.website,
      description: FIRMAMENTO.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: FIRMAMENTO.address.street,
        postalCode: FIRMAMENTO.address.postalCode,
        addressLocality: FIRMAMENTO.address.locality,
        addressRegion: FIRMAMENTO.address.region,
        addressCountry: FIRMAMENTO.address.country,
      },
      taxID: FIRMAMENTO.fiscalCode,
      vatID: FIRMAMENTO.vatEU,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: CONTACT_EMAIL,
      availableLanguage: ['Italian'],
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function SoftwareApplicationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fibonacci',
    description:
      'Cartella clinica digitale SaaS per medici italiani. Dettatura AI, body-map 2D, consensi informati, GDPR by design, FHIR R4 nativo.',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web Browser',
    url: SITE_URL,
    inLanguage: 'it-IT',
    producer: {
      '@type': 'Organization',
      name: FIRMAMENTO.legalName,
      url: FIRMAMENTO.website,
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Solo',
        price: '89',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '89',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
      },
      {
        '@type': 'Offer',
        name: 'Studio',
        price: '199',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '199',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
      },
      {
        '@type': 'Offer',
        name: 'Clinica',
        price: '449',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '449',
          priceCurrency: 'EUR',
          billingDuration: 'P1M',
        },
        eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
      },
    ],
    featureList: [
      'Anagrafica paziente FHIR R4',
      'Anamnesi con dettatura AI Voxtral',
      'Body-map 2D con pallini numerati',
      'Consensi informati generati in PDF',
      'Audit log immutabile hash-chain',
      'Catalogo farmaci AIFA integrato',
      'Agenda condivisa multi-operatore',
      'MFA TOTP per accesso sicuro',
      'Export ZIP FHIR R4 GDPR',
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function MedicalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Fibonacci',
    description: 'Software SaaS per la gestione della cartella clinica digitale di medici e studi medici italiani. Prodotto da Firmamento Technologies Soc. Coop.',
    url: SITE_URL,
    medicalSpecialty: [
      'PlasticSurgery',
      'Dermatology',
      'Orthopedic',
      'Psychiatric',
      'Dietetic',
      'Ophthalmologic',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Genova',
      addressRegion: 'Liguria',
      addressCountry: 'IT',
    },
    provider: {
      '@type': 'Organization',
      name: FIRMAMENTO.legalName,
      url: FIRMAMENTO.website,
      taxID: FIRMAMENTO.fiscalCode,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
