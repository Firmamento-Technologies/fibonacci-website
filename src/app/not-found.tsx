import Link from 'next/link'
import { ArrowRight, Home, HelpCircle, FileText } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-[calc(100vh-64px)] flex flex-col" style={{ background: 'var(--bg)' }}>
        <section className="flex-1 flex items-center">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--accent)' }}
            >
              Errore 404
            </p>
            <h1
              className="font-[var(--font-playfair)] text-4xl md:text-6xl font-bold mb-5 leading-[1.05] break-words"
              style={{ color: 'var(--fg)' }}
            >
              Questa pagina non esiste
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: 'var(--muted)' }}
            >
              Hai seguito un link rotto o l&apos;URL è stato digitato male. Da qui puoi
              tornare alla home, esplorare le specialità, o consultare la documentazione.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--fg)' }}
              >
                <Home className="w-4 h-4" />
                Torna alla home
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
              >
                <HelpCircle className="w-4 h-4" />
                Domande frequenti
              </Link>
            </div>

            {/* Quick links */}
            <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {[
                { href: '/#specialita', label: 'Specialità', icon: ArrowRight },
                { href: '/docs', label: 'Documentazione', icon: FileText },
                { href: '/consensi-informati', label: 'Consensi informati', icon: ArrowRight },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-4 rounded-xl transition-colors text-sm font-medium hover:bg-[var(--card)]"
                  style={{
                    color: 'var(--fg)',
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
