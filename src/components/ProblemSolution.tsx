import { X, Check } from 'lucide-react'

const BEFORE = [
  'Cartella clinica su carta o Word',
  'Consensi stampati e firmati a mano',
  'Foto dei pazienti su WhatsApp',
  '20+ minuti di burocrazia per visita',
  'Rischio GDPR su dati sensibili',
  'Nessuna interoperabilità con altri medici',
]

const AFTER = [
  'Cartella compilata mentre parli, con l\'AI',
  'Consensi informati generati e inviati in PDF',
  'Foto cifrate, protette per legge',
  '3 minuti per documentare una visita',
  'Dati su server in UE, conformità continua',
  'Pronta per il Fascicolo Sanitario Elettronico',
]

export function ProblemSolution() {
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }} id="problema-soluzione">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
            Prima e dopo
          </p>
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold" style={{ color: 'var(--fg)' }}>
            La tua giornata cambia davvero
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Prima — carta neutra, sobria (il "male" è sussurrato, non urlato) */}
          <div className="rounded-2xl p-8" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--muted)' }}>
              Senza Fibonacci
            </p>
            <ul className="space-y-4">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--border)' }}>
                    <X className="w-3 h-3" style={{ color: 'var(--muted)' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dopo — accento azzurro piatto (la soluzione è il brand) */}
          <div className="rounded-2xl p-8" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
            <p className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--accent)' }}>
              Con Fibonacci
            </p>
            <ul className="space-y-4">
              {AFTER.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--card)' }}>
                    <Check className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
