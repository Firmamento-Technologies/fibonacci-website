'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FAQ_ITEMS, FAQ_CATEGORIES, type FaqItem } from '@/lib/faq-data'

function FaqAccordionItem({ item, idx }: { item: FaqItem; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--bg)]"
        aria-expanded={open}
        aria-controls={`faq-${idx}`}
      >
        <span className="text-base font-semibold" style={{ color: 'var(--fg)' }}>
          {item.question}
        </span>
        <ChevronDown
          className="w-5 h-5 shrink-0 transition-transform"
          style={{
            color: 'var(--muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${idx}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 -mt-1">
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
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
                    href="mailto:info@fibonacci.it"
                    className="font-semibold transition-opacity hover:opacity-75"
                    style={{ color: 'var(--accent)' }}
                  >
                    info@fibonacci.it
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
