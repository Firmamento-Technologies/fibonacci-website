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
