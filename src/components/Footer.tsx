import Link from 'next/link'
import { SPECIALTIES } from '@/lib/specialties'
import { FibonacciLogo, FibonacciWordmark } from '@/components/Logo'

const PRODUCT_LINKS = [
  { label: 'Come funziona', href: '/#come-funziona', external: false },
  { label: 'Prezzi', href: '/#prezzi', external: false },
  { label: 'Specialità', href: '/#specialita', external: false },
  { label: 'Richiedi demo', href: '/#demo', external: false },
  { label: 'Accedi al software', href: 'https://app.fibonacci.it', external: true },
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
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FibonacciLogo size={28} />
              <FibonacciWordmark className="text-sm" />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              La cartella clinica specialistica per medici italiani. GDPR by design. Dati in EU.
            </p>
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
