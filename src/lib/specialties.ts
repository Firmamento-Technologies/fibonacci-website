export interface Specialty {
  id: string
  name: string
  label: string
  color: string
  accent: string
  tagline: string
  screenshot: string        // placeholder path
  features: string[]
  heroStat: { value: string; label: string }
}

export const SPECIALTIES: Specialty[] = [
  {
    id: 'estetica',
    name: 'Fibonacci Estetica',
    label: 'Medicina Estetica',
    color: '#a85b53',
    accent: '#f5e8e7',
    tagline: 'Body map, consensi informati e dettatura AI. La visita documentata in 3 minuti.',
    screenshot: '/screenshots/estetica.png',
    features: [
      'Body map 2D con pallini per area trattata',
      'Consensi informati generati in PDF',
      'Dettatura AI — anamnesi compilata mentre parli',
      'Catalogo farmaci AIFA integrato',
      'Foto cliniche cifrate GDPR',
    ],
    heroStat: { value: '3 min', label: 'per documentare una visita' },
  },
  {
    id: 'dermatologia',
    name: 'Fibonacci Dermatologia',
    label: 'Dermatologia',
    color: '#3d7a58',
    accent: '#e5f4eb',
    tagline: 'Classificazione lesioni, fototipo e follow-up in un click.',
    screenshot: '/screenshots/dermatologia.png',
    features: [
      'Mappa lesioni cutanee su modello 3D',
      'Classificazione ABCDE melanoma assistita',
      'Follow-up fotografico automatico',
      'Template visita dermatologica standard',
      'Referto generato con un click',
    ],
    heroStat: { value: '40%', label: 'riduzione tempo refertazione' },
  },
  {
    id: 'ortopedia',
    name: 'Fibonacci Ortopedia',
    label: 'Ortopedia',
    color: '#2d5c80',
    accent: '#e5eef5',
    tagline: 'Schede articolari, imaging DICOM e piano riabilitativo integrato.',
    screenshot: '/screenshots/ortopedia.png',
    features: [
      'Scala del dolore e ROM articolare',
      'Visualizzatore DICOM integrato',
      'Piano fisioterapico strutturato',
      'Template visite ortopediche per distretto',
      'Lettere di dimissione automatiche',
    ],
    heroStat: { value: '0 carta', label: 'dalla prima visita alla dimissione' },
  },
  {
    id: 'psicologia',
    name: 'Fibonacci Psicologia',
    label: 'Psicologia',
    color: '#5e4d9a',
    accent: '#eeebf5',
    tagline: 'Sessioni, test validati e note di seduta protette con cifratura end-to-end.',
    screenshot: '/screenshots/psicologia.png',
    features: [
      'Test validati PHQ-9, GAD-7, BDI inclusi',
      'Note di seduta con dettatura discreta',
      'Cifratura note cliniche extra-protezione',
      'Timeline terapia per paziente',
      'Gestione consenso trattamento psicologico',
    ],
    heroStat: { value: 'E2E', label: 'cifratura note di seduta' },
  },
  {
    id: 'nutrizione',
    name: 'Fibonacci Nutrizione',
    label: 'Nutrizione',
    color: '#806228',
    accent: '#f5f0e5',
    tagline: 'Piani alimentari, composizione corporea e follow-up peso integrati.',
    screenshot: '/screenshots/nutrizione.png',
    features: [
      'Piano alimentare personalizzato in PDF',
      'Plicometria e impedenziometria',
      'Diario alimentare del paziente',
      'Calcolo fabbisogno calorico automatico',
      'Obiettivi e progress tracking',
    ],
    heroStat: { value: '2 min', label: 'per generare un piano alimentare' },
  },
  {
    id: 'oculistica',
    name: 'Fibonacci Oculistica',
    label: 'Oculistica',
    color: '#205b66',
    accent: '#e4f2f4',
    tagline: 'Refrazione, campo visivo e tonometria documentati con precisione clinica.',
    screenshot: '/screenshots/oculistica.png',
    features: [
      'Scheda refrazione completa',
      'Import dati da autorefraktometro',
      'Campo visivo e fundus documentati',
      'Prescrizione occhiali/lenti in PDF',
      'Follow-up glaucoma strutturato',
    ],
    heroStat: { value: '100%', label: 'interoperabile con strumentazione' },
  },
]

export const DEFAULT_SPECIALTY = SPECIALTIES[0]
