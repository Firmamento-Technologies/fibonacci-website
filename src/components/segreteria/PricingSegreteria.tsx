import { Check, ArrowRight } from 'lucide-react'

const PLANS = [
  {
    name: 'Studio',
    price: '€149',
    tagline: 'Per il singolo professionista o lo studio piccolo.',
    features: [
      'Numero dedicato dello studio',
      'Canale SMS attivo 24/7',
      'Prenotazioni, spostamenti e disdette sull\u2019agenda',
      'Richieste di ricetta in bozza da approvare',
      'Medico e farmacia di turno',
      'Handoff a operatore con notifica',
      'Dashboard conversazioni e prenotazioni',
    ],
    highlighted: false,
  },
  {
    name: 'Studio Plus',
    price: '€279',
    tagline: 'Per poliambulatori e studi con più agende.',
    features: [
      'Tutto il piano Studio',
      'Più agende e più professionisti',
      'Canale WhatsApp (in attivazione)',
      'Preparazioni e FAQ personalizzate (“digiuno prima dell\u2019ecografia”)',
      'Risposte con identità e tono del tuo studio',
      'Supporto prioritario',
    ],
    highlighted: true,
  },
]

export function PricingSegreteria() {
  return (
    <section id="prezzi" className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Prezzi
          </p>
          <h2
            className="font-[family-name:var(--font-geist)] tracking-[-0.025em] text-3xl md:text-4xl font-semibold mb-5"
            style={{ color: 'var(--fg)' }}
          >
            Meno di una settimana di stipendio, per un mese intero di copertura.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            Prezzi di lancio, IVA esclusa. Nessun vincolo: disdici quando vuoi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-8 flex flex-col"
              style={
                plan.highlighted
                  ? {
                      background: 'var(--card)',
                      border: '2px solid var(--accent)',
                      boxShadow: '0 12px 32px -12px rgba(11,105,159,0.25)',
                    }
                  : { background: 'var(--card)', border: '1px solid var(--border)' }
              }
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--fg)' }}>
                  {plan.name}
                </h3>
                {plan.highlighted && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    Più scelto
                  </span>
                )}
              </div>
              <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
                {plan.tagline}
              </p>
              <p className="mb-6">
                <span
                  className="text-4xl font-semibold font-[family-name:var(--font-geist)] tracking-[-0.03em]"
                  style={{ color: 'var(--fg)' }}
                >
                  {plan.price}
                </span>
                <span className="text-sm ml-1.5" style={{ color: 'var(--muted)' }}>
                  /mese
                </span>
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--fg)' }}>
                    <Check
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: 'var(--accent)' }}
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={
                  plan.highlighted
                    ? { background: 'var(--fg)', color: 'white' }
                    : { background: 'var(--accent-light)', color: 'var(--accent)' }
                }
              >
                Richiedi una demo
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <p className="text-sm mt-8 text-center" style={{ color: 'var(--muted)' }}>
          La risposta vocale al telefono — la segretaria che parla — è in sviluppo e sarà
          inclusa in tutti i piani senza aumenti per i clienti attivi.
        </p>
      </div>
    </section>
  )
}
