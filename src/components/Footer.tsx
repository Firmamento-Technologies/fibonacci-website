import { SPECIALTIES } from '@/lib/specialties'

export function Footer() {
  return (
    <footer className="py-16 border-t" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'var(--fg)' }}
              >
                F
              </div>
              <span className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>Fibonacci</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              La cartella clinica specialistica per medici italiani. GDPR by design. Dati in EU.
            </p>
            <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
              Firmamento Technologies S.r.l.<br />
              P.IVA IT·············<br />
              Genova, Italia
            </p>
          </div>

          {/* Specialità */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--fg)' }}>
              Specialità
            </p>
            <ul className="space-y-2">
              {SPECIALTIES.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/specialita/${s.id}`}
                    className="text-xs transition-colors hover:underline"
                    style={{ color: 'var(--muted)' }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Prodotto */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--fg)' }}>
              Prodotto
            </p>
            <ul className="space-y-2">
              {['Come funziona', 'Prezzi', 'Sicurezza', 'FHIR & Interoperabilità', 'Changelog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs transition-colors hover:underline" style={{ color: 'var(--muted)' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legale */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--fg)' }}>
              Legale
            </p>
            <ul className="space-y-2">
              {['Privacy Policy', 'Cookie Policy', 'DPA (GDPR art. 28)', 'Termini di Servizio', 'Contatti'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs transition-colors hover:underline" style={{ color: 'var(--muted)' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © 2026 Firmamento Technologies S.r.l. · Tutti i diritti riservati
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              🇪🇺 Dati in EU
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              HL7 FHIR R4
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              GDPR
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
