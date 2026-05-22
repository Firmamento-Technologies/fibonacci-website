import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Fibonacci — La cartella clinica per ogni specialità medica',
  description:
    'Software specialistico per medici italiani. Dettatura AI, consensi inclusi, GDPR by design. Fibonacci Estetica, Ortopedia, Dermatologia e altro.',
  keywords: 'cartella clinica digitale, software medicina estetica, gestionale medico, GDPR, FHIR',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  )
}
