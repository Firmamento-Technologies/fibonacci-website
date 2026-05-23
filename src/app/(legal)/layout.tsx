import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LEGAL_DOCS } from '@/lib/legal-docs'
import { FileText, ShieldCheck } from 'lucide-react'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'var(--bg)' }}>
        {/* Header sezione legale */}
        <section
          className="border-b"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex items-center gap-2 text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>Documentazione legale</span>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-light)' }}
              >
                <ShieldCheck className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="flex-1">
                <h1
                  className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: 'var(--fg)' }}
                >
                  Documentazione legale
                </h1>
                <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
                  Privacy, cookie, accordo art. 28 GDPR e termini di servizio del software Fibonacci.
                  Tutti i documenti sono redatti secondo il diritto italiano e il GDPR.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-14 items-start">
            {/* Sidebar indice */}
            <aside className="lg:sticky lg:top-24">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--muted)' }}
              >
                Indice documenti
              </p>
              <nav className="flex flex-col gap-1">
                {LEGAL_DOCS.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/${doc.slug}`}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-[var(--card)]"
                  >
                    <FileText
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: 'var(--muted)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold leading-tight"
                        style={{ color: 'var(--fg)' }}
                      >
                        {doc.shortTitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </nav>
              <div
                className="mt-8 p-4 rounded-xl text-xs leading-relaxed"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                Hai domande sulla compliance del nostro servizio?
                Scrivi a{' '}
                <a
                  href="mailto:privacy@fibonacci.it"
                  className="font-semibold transition-opacity hover:opacity-75"
                  style={{ color: 'var(--accent)' }}
                >
                  privacy@fibonacci.it
                </a>
              </div>
            </aside>

            {/* Contenuto pagina */}
            <article className="min-w-0">{children}</article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
