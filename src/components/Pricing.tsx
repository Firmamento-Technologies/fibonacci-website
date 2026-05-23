import { Check, ArrowRight } from 'lucide-react'

const PLANS = [
  {
    name: 'Solo',
    price: 39,
    description: '1 medico, studio singolo',
    features: [
      'Pazienti illimitati',
      'Tutte le feature della specialità',
      'Consensi informati inclusi',
      'Dettatura AI illimitata',
      'Backup giornaliero',
      'Supporto via email',
    ],
    cta: 'Inizia 14 giorni gratis',
    highlighted: false,
  },
  {
    name: 'Studio',
    price: 79,
    description: 'fino a 3 operatori',
    features: [
      'Tutto di Solo',
      'Fino a 3 operatori',
      'Agenda condivisa',
      'Report mensili',
      'Supporto prioritario',
      'Onboarding guidato',
    ],
    cta: 'Inizia 14 giorni gratis',
    highlighted: true,
  },
  {
    name: 'Clinica',
    price: 149,
    description: 'operatori illimitati',
    features: [
      'Tutto di Studio',
      'Operatori illimitati',
      'Branding personalizzato',
      'API access',
      'Account manager dedicato',
      'SLA 99.9%',
    ],
    cta: 'Contattaci',
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section className="py-24" style={{ background: 'var(--card)' }} id="prezzi">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
            Prezzi
          </p>
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
            Meno di una visita al mese
          </h2>
          <p className="text-base" style={{ color: 'var(--muted)' }}>
            14 giorni gratis, nessuna carta di credito richiesta. Deducibile al 100% come spesa professionale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col gap-6 relative transition-transform duration-300 hover:-translate-y-1 ${plan.highlighted ? '' : 'liquid-glass'}`}
              style={
                plan.highlighted
                  ? { background: 'var(--fg)', border: 'none' }
                  : undefined
              }
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  Più popolare
                </div>
              )}

              <div>
                <p className="text-sm font-semibold mb-1"
                  style={{ color: plan.highlighted ? 'rgba(255,255,255,0.6)' : 'var(--muted)' }}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5">
                  <span className="font-[var(--font-playfair)] text-4xl font-bold"
                    style={{ color: plan.highlighted ? 'white' : 'var(--fg)' }}
                  >
                    €{plan.price}
                  </span>
                  <span className="text-sm mb-1.5" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}>
                    /mese
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: plan.highlighted ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: plan.highlighted ? 'var(--accent)' : 'var(--accent)' }}
                    />
                    <span className="text-sm"
                      style={{ color: plan.highlighted ? 'rgba(255,255,255,0.8)' : 'var(--fg)' }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/#demo"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: plan.highlighted ? 'var(--accent)' : 'var(--fg)',
                  color: 'white',
                }}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: 'var(--muted)' }}>
          Tutti i prezzi IVA esclusa · Fattura elettronica italiana inclusa · Disdici quando vuoi
        </p>
      </div>
    </section>
  )
}
