import { t } from '@/lib/testo'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: t('manifest.fibonacci_cartella_clinica_per_medici_italiani'),
    short_name: 'Fibonacci',
    description: t('manifest.cartella_clinica_digitale_fhir_r4_per'),
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
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
        name: t('manifest.prova_demo'),
        short_name: 'Demo',
        description: t('manifest.apri_la_demo_live_di_fibonacci'),
        url: '/prova-demo',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: t('manifest.stato_servizi'),
        short_name: 'Status',
        url: '/status',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}
