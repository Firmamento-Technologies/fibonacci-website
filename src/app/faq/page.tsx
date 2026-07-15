import type { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FAQ_ITEMS, FAQ_CATEGORIES, type FaqItem } from '@/lib/faq-data'
import { FaqAccordionItem } from './FaqAccordionItem'

export const metadata: Metadata = {
  title: 'Domande frequenti · Fibonacci',
  description:
    'Tutto quello che i medici ci chiedono prima di sottoscrivere Fibonacci: prezzi, sicurezza, consensi AI, dati in Italia, migrazione.',
  alternates: { canonical: '/faq' },
}

export default function FaqPage() {
  const grouped = (Object.keys(FAQ_CATEGORIES) as FaqItem['category'][]).map((cat) => ({
    category: cat,
    label: FAQ_CATEGORIES[cat],
    items: FAQ_ITEMS.filter((i) => i.category === cat),
  }))

  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <section
          className="border-b"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
            <div
              className="flex items-center gap-2 text-xs font-medium mb-3"
              style={{ color: 'var(--muted)' }}
            >
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>Domande frequenti</span>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-light)' }}
              >
                <HelpCircle className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h1
                  className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-3 leading-tight"
                  style={{ color: 'var(--fg)' }}
                >
                  Domande frequenti
                </h1>
                <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
                  Tutto quello che i medici ci chiedono prima di sottoscrivere Fibonacci.
                  Se non trovi la risposta, scrivici a{' '}
                  <a
                    href="mailto:info@firmamentotechnologies.com"
                    className="font-semibold transition-opacity hover:opacity-75"
                    style={{ color: 'var(--accent)' }}
                  >
                    info@firmamentotechnologies.com
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ groups */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 flex flex-col gap-12">
            {grouped.map((g) => (
              <div key={g.category}>
                <h2
                  className="font-[var(--font-playfair)] text-2xl font-bold mb-6"
                  style={{ color: 'var(--fg)' }}
                >
                  {g.label}
                </h2>
                <div className="flex flex-col gap-3">
                  {g.items.map((item, idx) => (
                    <FaqAccordionItem
                      key={item.question}
                      item={item}
                      idx={idx}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA finale */}
        <section className="py-16" style={{ background: 'var(--card)' }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-3"
              style={{ color: 'var(--fg)' }}
            >
              Hai una domanda specifica?
            </h2>
            <p className="text-base mb-6" style={{ color: 'var(--muted)' }}>
              Una demo di 30 minuti vale più di qualsiasi FAQ. Nessun vincolo, nessun trucco.
            </p>
            <Link
              href="/#demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--fg)' }}
            >
              Richiedi demo gratuita
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
