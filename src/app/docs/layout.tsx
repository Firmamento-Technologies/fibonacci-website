import Link from 'next/link'
import { BookOpen, LogIn, UserPlus, Mic, MapPin, FileSignature, Calendar, Shield } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { DOCS, DOC_CATEGORIES, type DocMeta } from '@/lib/docs-data'

const ICON_MAP = {
  LogIn,
  UserPlus,
  Mic,
  MapPin,
  FileSignature,
  Calendar,
  Shield,
}

function DocIcon({ name }: { name: string }) {
  const Icon = (ICON_MAP as Record<string, typeof BookOpen>)[name] ?? BookOpen
  return <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--muted)' }} />
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const grouped = (Object.keys(DOC_CATEGORIES) as DocMeta['category'][]).map((cat) => ({
    category: cat,
    label: DOC_CATEGORIES[cat],
    items: DOCS.filter((d) => d.category === cat),
  }))

  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'var(--bg)' }}>
        <section
          className="border-b"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex items-center gap-2 text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>Documentazione</span>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-light)' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h1
                  className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: 'var(--fg)' }}
                >
                  Guide utente
                </h1>
                <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
                  Documentazione step-by-step per usare Fibonacci. Dall&apos;onboarding ai workflow clinici quotidiani.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 flex flex-col gap-6">
              {grouped.map((g) => (
                <div key={g.category}>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--muted)' }}
                  >
                    {g.label}
                  </p>
                  <nav className="flex flex-col gap-0.5">
                    {g.items.map((doc) => (
                      <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-[var(--card)]"
                      >
                        <DocIcon name={doc.icon} />
                        <span
                          className="text-sm font-medium leading-tight"
                          style={{ color: 'var(--fg)' }}
                        >
                          {doc.title}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}

              <div
                className="p-4 rounded-xl text-xs leading-relaxed mt-4"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                Non trovi quello che cerchi? Scrivi a{' '}
                <a
                  href="mailto:supporto@fibonacci.it"
                  className="font-semibold transition-opacity hover:opacity-75"
                  style={{ color: 'var(--accent)' }}
                >
                  supporto@fibonacci.it
                </a>{' '}
                o consulta le{' '}
                <Link
                  href="/faq"
                  className="font-semibold transition-opacity hover:opacity-75"
                  style={{ color: 'var(--accent)' }}
                >
                  FAQ
                </Link>.
              </div>
            </aside>

            <article className="min-w-0">{children}</article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
