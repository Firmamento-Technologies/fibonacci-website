import { Phone, MessageSquare, LayoutDashboard } from 'lucide-react'

const STEPS = [
  {
    icon: Phone,
    title: 'Attiviamo il numero del tuo studio',
    text: 'Definiamo insieme orari, tipi di visita, durate e regole dello studio. Attiviamo un numero dedicato: niente hardware, niente da installare, nessun gestionale da cambiare.',
  },
  {
    icon: MessageSquare,
    title: 'I pazienti scrivono, lei risponde',
    text: 'Un semplice SMS, come scrivere a una persona. La segretaria propone gli orari liberi, conferma, sposta e annulla — in pochi scambi, a qualunque ora.',
  },
  {
    icon: LayoutDashboard,
    title: 'Tu controlli tutto dalla dashboard',
    text: 'Conversazioni, prenotazioni e richieste in attesa del tuo OK. Le ricette arrivano come bozze da approvare con un tocco: l\u2019ultima parola è sempre la tua.',
  },
]

export function HowItWorks() {
  return (
    <section id="come-funziona" className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Come funziona
          </p>
          <h2
            className="font-[family-name:var(--font-geist)] tracking-[-0.025em] text-3xl md:text-4xl font-semibold"
            style={{ color: 'var(--fg)' }}
          >
            Operativa in pochi giorni, non in settimane.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl p-7 relative"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <span
                className="absolute top-6 right-7 text-5xl font-semibold font-[family-name:var(--font-geist)] tracking-[-0.03em] select-none"
                style={{ color: 'var(--accent-light)' }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'var(--accent-light)' }}
              >
                <s.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2.5" style={{ color: 'var(--fg)' }}>
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
