import { Check, ArrowRight } from 'lucide-react'

interface Plan {
  name: string
  price: number
  description: string
  features: readonly string[]
  cta: string
  highlighted: boolean
}

const PLANS: readonly Plan[] = [
  {
    name: 'Solo',
    price: 149,
    description: 'Un medico, uno studio',
    features: [
      'Cartella clinica digitale',
      'Body map 2D',
      'Consensi informati pronti',
      'Firma elettronica paziente',
      'Conservazione a norma',
    ],
    cta: 'Inizia gratis',
    highlighted: false,
  },
  {
    name: 'Studio',
    price: 349,
    description: 'Fino a 5 operatori',
    features: [
      'Tutto di Solo',
      'Dettatura durante la visita',
      'Agenda condivisa',
      'Reminder appuntamenti',
      'Supporto chat',
    ],
    cta: 'Inizia gratis',
    highlighted: true,
  },
  {
    name: 'Clinica',
    price: 749,
    description: 'Operatori illimitati, multi-sede',
    features: [
      'Tutto di Studio',
      'Più sedi',
      'Branding personalizzato',
      'Account manager dedicato',
      'Supporto prioritario',
    ],
    cta: 'Inizia gratis',
    highlighted: false,
  },
] as const

export function Pricing() {
  return (
    <section className="py-24" style={{ background: 'var(--card)' }} id="prezzi">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
            Prezzi
          </p>
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
            Prezzi semplici, niente sorprese
          </h2>
          <p className="text-base" style={{ color: 'var(--muted)' }}>
            14 giorni gratis, senza carta di credito. Disdici quando vuoi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-8 flex flex-col gap-6 relative transition-transform duration-300 hover:-translate-y-1"
              style={
                plan.highlighted
                  ? { background: 'var(--fg)', border: 'none' }
                  : { background: 'var(--bg)', border: '1px solid var(--border)' }
              }
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white whitespace-nowrap"
                  style={{ background: 'var(--accent)' }}
                >
                  PIÙ SCELTO
                </div>
              )}

              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span
                    className="font-[var(--font-playfair)] text-5xl font-bold"
                    style={{ color: plan.highlighted ? 'white' : 'var(--fg)' }}
                  >
                    €{plan.price}
                  </span>
                  <span
                    className="text-sm mb-2"
                    style={{ color: plan.highlighted ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}
                  >
                    /mese
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: 'var(--accent)' }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: plan.highlighted ? 'rgba(255,255,255,0.9)' : 'var(--fg)' }}
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

        <p className="text-center text-xs mt-10" style={{ color: 'var(--muted)' }}>
          IVA esclusa · Fattura elettronica inclusa · 100% deducibile come spesa professionale
        </p>
      </div>
    </section>
  )
}
