// URL dell'applicazione SaaS Fibonacci, usato dai CTA "Accedi" su Navbar e Footer.
// Mentre il dominio fibonacci.it non e' ancora registrato, punta al VPS attuale
// che ospita la versione live medicina estetica con HTTPS valido.
// TODO: cambia a 'https://app.fibonacci.it' una volta registrato il dominio
// (FASE 0-3 piano go-to-market).
export const APP_URL = 'https://82.25.101.118.nip.io'
// Demo live: auto-login con account isolato medico@studio.test, redirect a /pazienti.
// Visitatori possono testare body-map, dettatura, consensi, agenda senza registrarsi.
export const DEMO_URL = 'https://82.25.101.118.nip.io/demo'
// Endpoint pubblico chatbot AI: assistente Mistral con knowledge base sito.
// Rate limit 30 msg / 15 min per IP. Endpoint nel container emr-transcriber-prod.
export const CHAT_API_URL = 'https://transcriber.82.25.101.118.nip.io/website-chat'

// URL pubblici del sito vetrina e dei contatti.
export const SITE_URL = 'https://firmamento-technologies.github.io/fibonacci-website'
export const CONTACT_EMAIL = 'info@fibonacci.it'
export const SUPPORT_EMAIL = 'supporto@fibonacci.it'
export const NEWS_EMAIL = 'news@fibonacci.it'
export const PRIVACY_EMAIL = 'privacy@fibonacci.it'

// Firmamento Technologies Soc. Coop. - società produttrice/madre di Fibonacci.
// Cooperativa di lavoro a mutualità prevalente (artt. 2512-2513 c.c.).
// Patrocinata da Legacoop Liguria e Coopfond.
export const FIRMAMENTO = {
  legalName: 'Firmamento Technologies Società Cooperativa',
  shortName: 'Firmamento Technologies',
  fiscalCode: '03038500991',
  vatNumber: '03038500991',
  vatEU: 'IT03038500991',
  rea: 'GE-528629',
  pec: 'firmamentotechnologies@pec.it',
  address: {
    street: 'Via Brigata Liguria 105 R',
    postalCode: '16121',
    locality: 'Genova',
    province: 'GE',
    region: 'Liguria',
    country: 'IT',
  },
  legalForm: 'Società Cooperativa',
  website: 'https://firmamentotechnologies.com',
  email: 'info@firmamentotechnologies.com',
  description:
    'Cooperativa deep-tech di Genova, ponte operativo tra ricerca accademica e industria. Verticali: AI agentica, aerospace, simulazione CFD, healthcare.',
  patronage: ['Legacoop Liguria', 'Coopfond'],
  partners: ['DOPE Hubs', 'Università di Genova'],
} as const
