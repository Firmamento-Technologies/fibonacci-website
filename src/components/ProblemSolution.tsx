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
  'Cartella compilata mentre parli (AI)',
  'Consensi informati generati e inviati in PDF',
  'Foto cifrate AES-256, GDPR by design',
  '3 minuti per documentare una visita',
  'Dati su server EU, compliance automatica',
  'FHIR R4: pronto per il FSE 2.0',
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
          {/* Prima */}
          <div className="rounded-2xl p-8" style={{ background: '#fff5f5', border: '1px solid #fecaca' }}>
            <p className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: '#dc2626' }}>
              Senza Fibonacci
            </p>
            <ul className="space-y-4">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-600" />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--fg)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dopo */}
          <div className="rounded-2xl p-8" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: '#15803d' }}>
              Con Fibonacci
            </p>
            <ul className="space-y-4">
              {AFTER.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" style={{ color: '#15803d' }} />
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
