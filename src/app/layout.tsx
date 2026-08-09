import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Newsreader } from 'next/font/google'
import { OrganizationSchema, SoftwareApplicationSchema } from '@/components/StructuredData'
import { SITE_URL } from '@/lib/site-config'
import './globals.css'

/* Tre caratteri, tre mestieri distinti.
 *
 * Newsreader (Production Type, licenza SIL OFL) porta i titoli. È un serif
 * disegnato per lo schermo, con asse ottico: alle misure grandi si stringe da
 * solo. Serve a dare al sito il tono del DOCUMENTO, che è la cosa che
 * vendiamo. La decisione «tutto sans» del 2026-07-16 nasceva dal voler
 * evitare l'estetica dei siti generati (serif svolazzante + gradiente +
 * vetro): qui non c'è né gradiente né vetro, e il serif è un carattere da
 * redazione, non da decorazione.
 *
 * Geist resta per il corpo del testo, dove la neutralità è una virtù.
 * Geist Mono per occhielli ed etichette: piccole, spaziate, tecniche.
 *
 * next/font scarica e SERVE IN PROPRIO i file al momento della build:
 * nessuna chiamata a fonts.googleapis.com dal browser del visitatore,
 * quindi nessun trasferimento di indirizzo IP verso Google. È la ragione
 * per cui il banner cookie non serve. */
const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
  axes: ['opsz'],
  display: 'swap',
})
const geist = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

const SITE_NAME = 'Fibonacci'

/* La descrizione dice cosa fa il prodotto oggi. Niente conservazione a norma
 * (conservatore non contrattualizzato), niente firma qualificata (certificati
 * non rilasciati): due gate ancora chiusi, e un sito che li promette li fa
 * diventare un debito verso il cliente il giorno della firma del contratto. */
const SITE_DESCRIPTION =
  'La cartella clinica per la medicina estetica. Consenso informato firmato in studio, mappa ' +
  'del viso per le sedute, foto cifrate, anamnesi dettata durante la visita. Ogni scrittura ' +
  'entra in un registro che non si può ritoccare. Dati su server europei.'

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Fibonacci — la cartella clinica della medicina estetica',
    template: '%s · Fibonacci',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'software medicina estetica',
    'cartella clinica medicina estetica',
    'consenso informato medicina estetica',
    'gestionale studio medicina estetica',
    'consensi informati digitali',
    'foto cliniche prima e dopo privacy',
    'documentazione sanitaria GDPR',
  ],
  applicationName: SITE_NAME,
  category: 'Healthcare Software',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Fibonacci — la cartella clinica della medicina estetica',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fibonacci — la cartella clinica della medicina estetica',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }] },
  formatDetection: { email: false, address: false, telephone: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}>
      <head>
        {/* ⛔ QUI NON VA UNO <script>, e vale la pena dire perché.
            Il primo tentativo (2026-08-09) metteva in testa uno script in linea
            che aggiungeva `html.anim`, l'interruttore che permette alle
            rivelazioni di nascondere il contenuto **solo se il JavaScript è
            vivo**. Ha prodotto subito un errore di idratazione: un'estensione
            del browser inietta il proprio `<script>` in `<head>`, sposta il
            nostro, e React trova un albero diverso da quello che ha generato.
            La lezione non è «colpa dell'estensione»: è che `<head>` è terreno
            conteso e quell'interruttore **non ha bisogno di JavaScript**.
            La stessa condizione si esprime in CSS con `@media (scripting:
            enabled)` — vedi `globals.css`. Nessuno script, nessuna idratazione
            da far combaciare, nessuna estensione che possa rompere niente. */}
        <OrganizationSchema />
        <SoftwareApplicationSchema />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#contenuto" className="salta-al-contenuto">Salta al contenuto</a>
        {children}
      </body>
    </html>
  )
}
