// Aggiunge il basePath GitHub Pages a path assoluti per asset binari
// (img, video, source, poster) che non passano da next/Link.
// Necessario perche' i tag HTML standard non ereditano il basePath di Next.config.

const isProd = process.env.NODE_ENV === 'production'

export const BASE_PATH = isProd ? '/fibonacci-website' : ''

export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path
  return `${BASE_PATH}${path}`
}

// Photo URLs per le 9 foto stock Unsplash usate nel sito (commercial license free)
export const PHOTOS = {
  // Set originale (Hero, AppPreview, ChiSiamo hero, DemoForm)
  doctorFemaleStethoscope: assetPath('/photos/doctor-female-stethoscope.jpg'),
  doctorFemaleCoat: assetPath('/photos/doctor-female-coat.jpg'),
  doctorTablet: assetPath('/photos/doctor-tablet.jpg'),
  // Set espanso (ProcessSteps, AIFeatures, /intelligenza-artificiale, ChiSiamo team)
  doctorPatientTalk: assetPath('/photos/doctor-patient-talk.jpg'),
  doctorComforting: assetPath('/photos/doctor-comforting.jpg'),
  doctorWritingChart: assetPath('/photos/doctor-writing-chart.jpg'),
  fourFemaleDoctors: assetPath('/photos/four-female-doctors.jpg'),
  femaleDoctorSmile: assetPath('/photos/female-doctor-smile.jpg'),
  handWritingStethoscope: assetPath('/photos/hand-writing-stethoscope.jpg'),
} as const

// Screenshot reali dell'app Fibonacci live (catturati con Playwright dal
// container emr-web-prod, post-rebrand terracotta + Inter + Playfair).
export const APP_SCREENSHOTS = {
  pazientiList: assetPath('/screenshots/estetica/01-pazienti-list.png'),
  pazienteDetail: assetPath('/screenshots/estetica/02-paziente-detail.png'),
  consensiCatalog: assetPath('/screenshots/estetica/05-consensi.png'),
  agenda: assetPath('/screenshots/estetica/06-agenda.png'),
  auditLog: assetPath('/screenshots/estetica/07-audit-log.png'),
  impostazioni: assetPath('/screenshots/estetica/08-impostazioni.png'),
  farmaciAifa: assetPath('/screenshots/estetica/09-farmaci-aifa.png'),
  dashboard: assetPath('/screenshots/estetica/10-dashboard.png'),
} as const
