// Mono-verticale dal 2026-08-04 ([[decisione-fibonacci-solo-estetica]]): resta un
// solo valore. Il tipo tiene ancora 'codesign' perche' e' usato dai componenti,
// ma nessuna voce lo usa: non si promettono specialita' che non esistono.
export type SpecialtyStatus = 'available' | 'codesign'

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
  /** Stato del modulo:
   *  - 'available': prodotto live, demo accessibile pubblicamente
   *  - 'codesign': in sviluppo con clinica partner, lista d'attesa aperta */
  status: SpecialtyStatus
}

export const SPECIALTIES: Specialty[] = [
  {
    id: 'estetica',
    name: 'Fibonacci Estetica',
    label: 'Medicina Estetica',
    color: '#0b699f',
    accent: '#e6f2fb',
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
    status: 'available',
  },
]
