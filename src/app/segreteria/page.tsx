import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SegreteriaHero } from '@/components/segreteria/SegreteriaHero'
import { ProblemCost } from '@/components/segreteria/ProblemCost'
import { HowItWorks } from '@/components/segreteria/HowItWorks'
import { Features } from '@/components/segreteria/Features'
import { Safety } from '@/components/segreteria/Safety'
import { PricingSegreteria } from '@/components/segreteria/PricingSegreteria'
import { FaqSegreteria } from '@/components/segreteria/FaqSegreteria'
import { LeadFormSegreteria } from '@/components/segreteria/LeadFormSegreteria'

export const metadata: Metadata = {
  title: 'Segretaria AI per studi medici — risponde sempre, anche alle 22 di domenica',
  description:
    'La segretaria AI di Fibonacci risponde ai pazienti 24/7 via SMS: prenota, sposta e annulla appuntamenti, prepara le richieste di ricetta in bozza. Funziona senza cambiare gestionale. Emergenze gestite con regola deterministica 118, mai dall\u2019AI. Dati e AI in Europa.',
  keywords: [
    'segretaria AI studio medico',
    'segreteria virtuale medico',
    'prenotazioni SMS studio medico',
    'assistente virtuale medico di base',
    'risposta automatica pazienti',
    'segretaria artificiale ambulatorio',
  ],
  alternates: { canonical: '/segreteria/' },
  openGraph: {
    title: 'Segretaria AI per studi medici — non perderai mai più una telefonata',
    description:
      'Risponde ai pazienti 24/7, prenota e sposta appuntamenti, prepara le ricette in bozza. Funziona con il tuo gestionale attuale. Dati e AI in Europa.',
    url: '/segreteria/',
    type: 'website',
  },
}

export default function SegreteriaPage() {
  return (
    <>
      <Navbar />
      <main>
        <SegreteriaHero />
        <ProblemCost />
        <HowItWorks />
        <Features />
        <Safety />
        <PricingSegreteria />
        <FaqSegreteria />
        <LeadFormSegreteria />
      </main>
      <Footer />
    </>
  )
}
