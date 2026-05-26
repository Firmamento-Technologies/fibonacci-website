import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fibonacci · Cartella clinica per medici italiani',
    short_name: 'Fibonacci',
    description:
      'Cartella clinica digitale FHIR R4 per medici italiani. Multi-specialità: medicina estetica, dermatologia, ortopedia, psicologia, nutrizione, oculistica.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#a85b53',
    lang: 'it-IT',
    dir: 'ltr',
    orientation: 'portrait-primary',
    categories: ['medical', 'health', 'productivity', 'business'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Prova demo',
        short_name: 'Demo',
        description: 'Apri la demo live di Fibonacci',
        url: '/prova-demo',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Stato servizi',
        short_name: 'Status',
        url: '/status',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}
