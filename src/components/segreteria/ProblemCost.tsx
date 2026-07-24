import { X, Check } from 'lucide-react'

// Dati dal piano di prodotto (wiki: piano-segretaria-prodotto-autonomo):
// segretaria umana €1.200–1.800/mese, ~40h/settimana, introvabile nei piccoli centri.
const ROWS: { label: string; human: string; ai: string }[] = [
  { label: 'Costo mensile', human: '€1.200–1.800 + contributi', ai: 'da €149, tutto incluso' },
  { label: 'Copertura oraria', human: '~40 ore su 168', ai: '168 ore su 168, festivi inclusi' },
  { label: 'Ferie e malattia', human: 'Sì, con preavviso o senza', ai: 'Mai assente' },
  { label: 'Conversazioni simultanee', human: 'Una telefonata alla volta', ai: 'Più pazienti in parallelo' },
  { label: 'Tempo di attivazione', human: 'Settimane di selezione', ai: 'Pochi giorni' },
]

export function ProblemCost() {
  return (
    <section className="py-24" style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Il problema
          </p>
          <h2
            className="font-[family-name:var(--font-geist)] tracking-[-0.025em] text-3xl md:text-4xl font-semibold mb-5"
            style={{ color: 'var(--fg)' }}
          >
            Una segretaria brava è introvabile. E quando se ne va, se ne va da un giorno
            all&apos;altro.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            Ogni chiamata senza risposta è un paziente che prenota altrove. Le ore in cui
            il telefono squilla a vuoto — la pausa pranzo, la sera, il weekend — sono
            esattamente le ore in cui molti pazienti trovano il tempo di chiamare.
          </p>
        </div>

        {/* Tabella comparativa */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[1.1fr_1fr_1fr] text-sm font-semibold"
            style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="px-5 py-4" style={{ color: 'var(--muted)' }} />
            <div className="px-5 py-4" style={{ color: 'var(--fg)' }}>
              Segretaria tradizionale
            </div>
            <div className="px-5 py-4 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
              Segretaria AI Fibonacci
            </div>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.label}
              className="grid grid-cols-[1.1fr_1fr_1fr] text-sm"
              style={{
                borderBottom: i < ROWS.length - 1 ? '1px solid var(--border)' : 'none',
                background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)',
              }}
            >
              <div className="px-5 py-4 font-medium" style={{ color: 'var(--fg)' }}>
                {r.label}
              </div>
              <div className="px-5 py-4 flex items-start gap-2" style={{ color: 'var(--muted)' }}>
                <X className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#b91c1c' }} aria-hidden="true" />
                {r.human}
              </div>
              <div className="px-5 py-4 flex items-start gap-2 font-medium" style={{ color: 'var(--fg)' }}>
                <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                {r.ai}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
          Costo di riferimento di una risorsa a tempo pieno in Italia, contributi esclusi.
          Prezzo del piano Studio, IVA esclusa.
        </p>
      </div>
    </section>
  )
}
