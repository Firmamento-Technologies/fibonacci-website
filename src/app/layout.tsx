import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { OrganizationSchema, SoftwareApplicationSchema, MedicalBusinessSchema } from '@/components/StructuredData'
import { WebsiteChatbot } from '@/components/WebsiteChatbot'
import './globals.css'

// Sistema tutto-sans (redesign 2026-07-16): NIENTE serif nei titoli. Geist
// (grotesque con carattere) per titoli + UI + corpo; gerarchia via peso/size/
// spazio. Le var legacy --font-inter / --font-playfair sono aliasate a Geist in
// globals.css, così ogni riferimento esistente rende Geist (zero serif residuo).
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://firmamento-technologies.github.io/fibonacci-website'
const SITE_NAME = 'Fibonacci'
// Mono-verticale dal 2026-08-04 (decisione-fibonacci-solo-estetica): una sola
// specialità, nessun elenco di specialità "in arrivo". La descrizione dice cosa
// fa il prodotto oggi, non cosa potrebbe fare.
const SITE_DESCRIPTION =
  'La cartella clinica per la medicina estetica: consensi informati generati e firmati dal paziente, body map, dettatura durante la visita, foto cliniche cifrate. Dati su server europei.'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1016' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fibonacci — La cartella clinica per la medicina estetica',
    template: '%s | Fibonacci',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'cartella clinica digitale',
    'software medicina estetica',
    'gestionale medico italiano',
    'GDPR sanitario',
    'FHIR R4',
    'dettatura AI medica',
    'consenso informato medicina estetica',
    'software studio medicina estetica',
    'consensi informati',
    'body map paziente',
  ],
  authors: [{ name: 'Fibonacci' }],
  creator: 'Fibonacci',
  publisher: 'Fibonacci',
  applicationName: SITE_NAME,
  category: 'Healthcare Software',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Fibonacci — La cartella clinica per la medicina estetica',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fibonacci — La cartella clinica per la medicina estetica',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={geist.variable}>
      <head>
        <OrganizationSchema />
        <SoftwareApplicationSchema />
        <MedicalBusinessSchema />
      </head>
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-geist)]">
        {children}
        <WebsiteChatbot />
      </body>
    </html>
  )
}
