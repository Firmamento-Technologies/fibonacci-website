// Aggiunge il basePath GitHub Pages a path assoluti per asset binari
// (img, video, source, poster) che non passano da next/Link.
// Necessario perche' i tag HTML standard non ereditano il basePath di Next.config.

const isProd = process.env.NODE_ENV === 'production'

export const BASE_PATH = isProd ? '/fibonacci-website' : ''

export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path
  return `${BASE_PATH}${path}`
}

// Photo URLs per le 3 foto stock Unsplash usate nel sito (commercial license free)
export const PHOTOS = {
  doctorFemaleStethoscope: assetPath('/photos/doctor-female-stethoscope.jpg'),
  doctorFemaleCoat: assetPath('/photos/doctor-female-coat.jpg'),
  doctorTablet: assetPath('/photos/doctor-tablet.jpg'),
} as const
