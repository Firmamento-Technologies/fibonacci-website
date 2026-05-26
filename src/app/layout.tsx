import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { OrganizationSchema, SoftwareApplicationSchema, MedicalBusinessSchema } from '@/components/StructuredData'
import { WebsiteChatbot } from '@/components/WebsiteChatbot'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://firmamento-technologies.github.io/fibonacci-website'
const SITE_NAME = 'Fibonacci'
const SITE_DESCRIPTION =
  'Cartella clinica digitale per medici italiani: medicina estetica, dermatologia, ortopedia, psicologia, nutrizione, oculistica. Dettatura AI, consensi inclusi, GDPR by design, FHIR R4.'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#a85b53' },
    { media: '(prefers-color-scheme: dark)', color: '#7d3530' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fibonacci — La cartella clinica per ogni specialità medica',
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
    'software dermatologia',
    'software ortopedia',
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
    title: 'Fibonacci — La cartella clinica per ogni specialità medica',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fibonacci — La cartella clinica per ogni specialità medica',
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
    <html lang="it" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <OrganizationSchema />
        <SoftwareApplicationSchema />
        <MedicalBusinessSchema />
      </head>
      <body className="min-h-screen flex flex-col font-[var(--font-inter)]">
        {children}
        <WebsiteChatbot />
      </body>
    </html>
  )
}
