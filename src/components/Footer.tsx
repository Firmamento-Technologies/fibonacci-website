import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SPECIALTIES } from '@/lib/specialties'
import { APP_URL, FIRMAMENTO } from '@/lib/site-config'
import { FibonacciLogo, FibonacciWordmark } from '@/components/Logo'
import { NewsletterForm } from '@/components/NewsletterForm'

const PRODUCT_LINKS = [
  { label: 'Come funziona', href: '/#come-funziona', external: false },
  { label: 'Intelligenza Artificiale', href: '/intelligenza-artificiale', external: false },
  { label: 'Consensi informati', href: '/consensi-informati', external: false },
  { label: 'Prezzi', href: '/#prezzi', external: false },
  { label: 'Programma Ambassador', href: '/partners', external: false },
  { label: 'Stato dei servizi', href: '/status', external: false },
  { label: 'Verifica firma consenso', href: '/verify', external: false },
  { label: 'Documentazione', href: '/docs', external: false },
  { label: 'FAQ', href: '/faq', external: false },
  { label: 'Chi siamo', href: '/chi-siamo', external: false },
  { label: 'Accedi al software', href: APP_URL, external: true },
] as const

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy', external: false },
  { label: 'Cookie Policy', href: '/cookie', external: false },
  { label: 'DPA (GDPR art. 28)', href: '/dpa', external: false },
  { label: 'Termini di Servizio', href: '/termini', external: false },
  { label: 'Sicurezza', href: '/sicurezza', external: false },
  { label: 'Sub-responsabili', href: '/sub-responsabili', external: false },
  { label: 'Contatti', href: 'mailto:info@fibonacci.it', external: true },
] as const

export function Footer() {
  return (
    <footer
      className="py-16 border-t"
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter band */}
        <div className="mb-12 max-w-2xl">
          <NewsletterForm />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FibonacciLogo size={28} />
              <FibonacciWordmark className="text-sm" />
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
              La cartella clinica specialistica per medici italiani. GDPR by design. Dati in EU.
            </p>
            <div
              className="text-[10px] leading-relaxed pt-3 border-t"
              style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
            >
              <p className="font-semibold mb-1" style={{ color: 'var(--fg)' }}>
                Un prodotto di
              </p>
              <a
                href={FIRMAMENTO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold transition-colors hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Firmamento Technologies Soc. Coop.
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <p className="mt-1.5">C.F./P.IVA {FIRMAMENTO.vatNumber}</p>
              <p>Genova · Italia</p>
            </div>
          </div>

          {/* Specialità */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--fg)' }}
            >
              Specialità
            </p>
            <ul className="space-y-2">
              {SPECIALTIES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/specialita/${s.id}`}
                    className="text-xs transition-colors hover:underline"
                    style={{ color: 'var(--muted)' }}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Prodotto */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--fg)' }}
            >
              Prodotto
            </p>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      className="text-xs transition-colors hover:underline"
                      style={{ color: 'var(--muted)' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-xs transition-colors hover:underline"
                      style={{ color: 'var(--muted)' }}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legale */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--fg)' }}
            >
              Legale
            </p>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      className="text-xs transition-colors hover:underline"
                      style={{ color: 'var(--muted)' }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-xs transition-colors hover:underline"
                      style={{ color: 'var(--muted)' }}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © 2026 Fibonacci · Tutti i diritti riservati
          </p>
          <div className="flex items-center gap-4">
            {['Dati in EU', 'HL7 FHIR R4', 'GDPR'].map((badge) => (
              <span
                key={badge}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: 'var(--card)',
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
