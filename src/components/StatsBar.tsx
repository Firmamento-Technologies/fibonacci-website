// Striscia fatti — statica e sobria (redesign 2026-07-16).
// Niente contatori animati (vanity) né oro: numeri fermi in azzurro chiaro
// su fondo inchiostro. Fatti onesti sullo stadio del prodotto, senza iperboli.
const STATS = [
  { value: '3 min', label: 'per documentare una visita' },
  { value: 'UE', label: 'dati e backup su server europei' },
  { value: '0', label: 'moduli da comprare a parte: è tutto incluso' },
  { value: '10 anni', label: 'di conservazione prevista per la cartella' },
]

export function StatsBar() {
  return (
    <section className="py-16" style={{ background: 'var(--fg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x divide-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center px-6 py-2">
              <div
                className="font-[family-name:var(--font-geist)] tracking-[-0.02em] text-4xl md:text-5xl font-semibold mb-2"
                style={{ color: '#8bc3ee' }}
              >
                {s.value}
              </div>
              <p className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
