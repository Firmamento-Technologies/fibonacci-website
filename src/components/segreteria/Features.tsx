import {
  CalendarCheck,
  CalendarClock,
  Pill,
  Stethoscope,
  PhoneForwarded,
  ClipboardList,
} from 'lucide-react'

// Funzioni reali degli 8 tool dell'agente (wiki: segretaria-ai), raggruppate
// per il lettore non tecnico. Nessun claim inventato.
const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Prenota gli appuntamenti',
    text: 'Propone gli orari liberi dell\u2019agenda dello studio e conferma in autonomia. Niente più telefonate di rimbalzo per trovare un posto.',
  },
  {
    icon: CalendarClock,
    title: 'Sposta e annulla',
    text: 'Gestisce cambi e disdette in pochi messaggi, liberando subito lo slot per un altro paziente.',
  },
  {
    icon: Pill,
    title: 'Ricette ripetute in bozza',
    text: 'Raccoglie la richiesta del paziente e prepara una bozza: tu approvi e firmi. Non conferma mai una terapia da sola.',
  },
  {
    icon: Stethoscope,
    title: 'Medico e farmacia di turno',
    text: 'Risponde all\u2019istante alle domande di routine: orari, turni, preparazioni alle visite.',
  },
  {
    icon: PhoneForwarded,
    title: 'Passa a un umano quando serve',
    text: 'Se la richiesta esce dal suo ruolo, la gira allo studio con tutto il contesto. Il paziente non resta mai senza risposta.',
  },
  {
    icon: ClipboardList,
    title: 'Ogni conversazione tracciata',
    text: 'Tutto è registrato e rileggibile dalla dashboard: cosa ha chiesto il paziente, cosa ha risposto lei, cosa è stato prenotato.',
  },
]

export function Features() {
  return (
    <section
      className="py-24"
      style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Cosa fa
          </p>
          <h2
            className="font-[family-name:var(--font-geist)] tracking-[-0.025em] text-3xl md:text-4xl font-semibold mb-5"
            style={{ color: 'var(--fg)' }}
          >
            Fa la segretaria. Solo la segretaria.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            Si occupa del front-office e basta: niente diagnosi, niente consigli medici,
            niente accesso alle cartelle cliniche. Il perimetro è chiaro per costruzione,
            non per promessa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-7 transition-shadow hover:shadow-md"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'var(--accent-light)' }}
              >
                <f.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
