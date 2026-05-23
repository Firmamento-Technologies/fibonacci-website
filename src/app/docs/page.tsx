import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { DOCS, DOC_CATEGORIES, type DocMeta } from '@/lib/docs-data'

export const metadata: Metadata = {
  title: 'Guide utente',
  description:
    'Documentazione completa di Fibonacci: onboarding, anagrafica paziente, dettatura AI, body-map, consensi informati, agenda, audit log.',
  alternates: { canonical: '/docs' },
}

export default function DocsIndex() {
  const grouped = (Object.keys(DOC_CATEGORIES) as DocMeta['category'][]).map((cat) => ({
    category: cat,
    label: DOC_CATEGORIES[cat],
    items: DOCS.filter((d) => d.category === cat),
  }))

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1
          className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4 leading-tight"
          style={{ color: 'var(--fg)' }}
        >
          Documentazione Fibonacci
        </h1>
        <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
          Sette guide tematiche che coprono l&apos;intero ciclo di utilizzo: dall&apos;attivazione
          dell&apos;account alla compilazione di una visita reale, fino alla compliance e alla
          tracciabilità.
        </p>
      </div>

      {grouped.map((g) => (
        <div key={g.category}>
          <h2
            className="font-[var(--font-playfair)] text-xl font-bold mb-5"
            style={{ color: 'var(--fg)' }}
          >
            {g.label}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {g.items.map((doc) => (
              <Link
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className="flex items-start gap-4 p-5 rounded-xl transition-all hover:shadow-md"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--accent-light)' }}
                >
                  <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-base font-semibold mb-1 leading-tight"
                    style={{ color: 'var(--fg)' }}
                  >
                    {doc.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {doc.description}
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 mt-1 shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: 'var(--muted)' }}
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
