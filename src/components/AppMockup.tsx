import type { Specialty } from '@/lib/specialties'

// Body map mostrata per Medicina Estetica: pallini numerati sulle aree trattate
function BodyMapScene({ color }: { color: string }) {
  return (
    <div className="flex gap-2 h-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 200" className="h-full max-h-[260px] w-auto">
          <ellipse cx="50" cy="20" rx="14" ry="16" fill={`${color}30`} stroke={color} strokeWidth="1" />
          <path d="M 38 36 Q 50 42 62 36 L 70 90 Q 70 110 65 130 L 60 180 L 55 196 L 45 196 L 40 180 L 35 130 Q 30 110 30 90 Z" fill={`${color}25`} stroke={color} strokeWidth="1" />
          <line x1="30" y1="60" x2="14" y2="90" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.4" />
          <line x1="70" y1="60" x2="86" y2="90" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.4" />
          {[
            { cx: 50, cy: 22, n: '1' },
            { cx: 42, cy: 55, n: '2' },
            { cx: 58, cy: 55, n: '3' },
            { cx: 50, cy: 80, n: '4' },
          ].map((p) => (
            <g key={p.n}>
              <circle cx={p.cx} cy={p.cy} r="5" fill={color} />
              <text x={p.cx} y={p.cy + 1.5} fontSize="5" fill="white" textAnchor="middle" fontWeight="bold">{p.n}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        {[
          { n: '1', area: 'Glabella', prod: 'Botox 20U' },
          { n: '2', area: 'Zigomo dx', prod: 'Filler 0.5ml' },
          { n: '3', area: 'Zigomo sx', prod: 'Filler 0.5ml' },
          { n: '4', area: 'Mento', prod: 'Filler 0.8ml' },
        ].map((row) => (
          <div
            key={row.n}
            className="flex items-center gap-2 p-1.5 rounded-md"
            style={{ background: 'rgba(255,255,255,0.7)' }}
          >
            <div
              className="w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center shrink-0"
              style={{ background: color }}
            >
              {row.n}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] font-semibold leading-tight" style={{ color: 'var(--fg)' }}>{row.area}</div>
              <div className="text-[7px] leading-tight" style={{ color: color }}>{row.prod}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Mappa lesioni dermatologiche con classificazione ABCDE
function LesionMapScene({ color }: { color: string }) {
  return (
    <div className="flex gap-2 h-full">
      <div className="flex-1 relative rounded-md" style={{ background: `${color}15` }}>
        <div className="absolute inset-2 grid grid-cols-4 gap-1">
          {[...Array(16)].map((_, i) => {
            const lesion = i === 5 || i === 10 || i === 13
            return (
              <div
                key={i}
                className="rounded"
                style={{
                  background: lesion ? color : 'rgba(255,255,255,0.4)',
                  opacity: lesion ? 1 : 0.5,
                  border: lesion ? `1px solid ${color}` : '1px solid transparent',
                }}
              />
            )
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          Classificazione ABCDE
        </div>
        {[
          { l: 'A', label: 'Asimmetria', val: 'Lieve', dot: 0.4 },
          { l: 'B', label: 'Bordi', val: 'Regolari', dot: 0.2 },
          { l: 'C', label: 'Colore', val: 'Disomogeneo', dot: 0.8 },
          { l: 'D', label: 'Diametro', val: '6mm', dot: 0.6 },
          { l: 'E', label: 'Evoluzione', val: 'Stabile', dot: 0.3 },
        ].map((row) => (
          <div
            key={row.l}
            className="flex items-center gap-2 p-1 rounded"
            style={{ background: 'rgba(255,255,255,0.7)' }}
          >
            <div
              className="w-3.5 h-3.5 rounded text-[7px] font-bold text-white flex items-center justify-center shrink-0"
              style={{ background: color }}
            >
              {row.l}
            </div>
            <div className="text-[7px] font-medium" style={{ color: 'var(--fg)' }}>{row.label}</div>
            <div className="flex-1 text-right text-[7px]" style={{ color: color, opacity: 0.4 + row.dot * 0.6 }}>{row.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Schema articolazione + ROM gauge per Ortopedia
function JointRomScene({ color }: { color: string }) {
  return (
    <div className="flex gap-2 h-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 120" className="h-full max-h-[200px]">
          <line x1="50" y1="10" x2="50" y2="55" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="60" r="8" fill={color} />
          <line x1="50" y1="65" x2="30" y2="110" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <path d="M 35 60 A 18 18 0 0 1 60 75" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="62" y="68" fontSize="6" fill={color} fontWeight="bold">120°</text>
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          ROM ginocchio dx
        </div>
        {[
          { name: 'Flessione', value: '120°', max: 135, current: 120 },
          { name: 'Estensione', value: '0°', max: 0, current: 0 },
          { name: 'Rotazione int.', value: '15°', max: 20, current: 15 },
          { name: 'Rotazione est.', value: '20°', max: 25, current: 20 },
        ].map((row) => (
          <div key={row.name}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="text-[7px] font-medium" style={{ color: 'var(--fg)' }}>{row.name}</div>
              <div className="text-[7px] font-bold" style={{ color }}>{row.value}</div>
            </div>
            <div className="h-1 rounded-full" style={{ background: `${color}20` }}>
              <div
                className="h-1 rounded-full"
                style={{ background: color, width: `${(row.current / Math.max(row.max, 1)) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <div
          className="mt-1 px-2 py-1 rounded text-[7px] font-semibold text-white"
          style={{ background: color }}
        >
          Pain VAS: 4/10
        </div>
      </div>
    </div>
  )
}

// Timeline sessioni psicologiche + punteggi PHQ-9 / GAD-7
function SessionTimelineScene({ color }: { color: string }) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
        Timeline trattamento
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        {[
          { date: '03/04', label: '1° colloquio', score: 18, max: 27, test: 'PHQ-9' },
          { date: '17/04', label: 'Seduta 2', score: 15, max: 27, test: 'PHQ-9' },
          { date: '02/05', label: 'Seduta 3', score: 12, max: 27, test: 'PHQ-9' },
          { date: '15/05', label: 'Seduta 4', score: 10, max: 27, test: 'PHQ-9' },
        ].map((row) => (
          <div key={row.date} className="flex items-center gap-2 p-1.5 rounded" style={{ background: 'rgba(255,255,255,0.7)' }}>
            <div className="text-[7px] font-mono shrink-0 w-8" style={{ color: 'var(--muted)' }}>{row.date}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[7px] font-semibold leading-tight" style={{ color: 'var(--fg)' }}>{row.label}</div>
              <div className="text-[6px] leading-tight" style={{ color: 'var(--muted)' }}>{row.test}: {row.score}/{row.max}</div>
            </div>
            <div className="w-12 h-1.5 rounded-full shrink-0" style={{ background: `${color}25` }}>
              <div
                className="h-1.5 rounded-full"
                style={{ background: color, width: `${(row.score / row.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="text-[7px] italic px-2 py-1.5 rounded" style={{ background: `${color}15`, color: 'var(--fg)' }}>
        Trend in miglioramento: -44% PHQ-9 in 6 settimane
      </div>
    </div>
  )
}

// Piano alimentare giornaliero + macronutrienti per Nutrizione
function MealPlanScene({ color }: { color: string }) {
  return (
    <div className="flex gap-2 h-full">
      <div className="flex-1 flex flex-col gap-1">
        {[
          { name: 'Colazione', kcal: 380, items: 'Yogurt greco, avena, frutti rossi' },
          { name: 'Spuntino', kcal: 150, items: 'Mandorle 30g' },
          { name: 'Pranzo', kcal: 620, items: 'Pasta integrale, pollo, verdure' },
          { name: 'Cena', kcal: 480, items: 'Salmone, riso, broccoli' },
        ].map((meal) => (
          <div key={meal.name} className="p-1.5 rounded" style={{ background: 'rgba(255,255,255,0.7)' }}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="text-[7px] font-bold" style={{ color: 'var(--fg)' }}>{meal.name}</div>
              <div className="text-[7px] font-mono" style={{ color }}>{meal.kcal} kcal</div>
            </div>
            <div className="text-[6px] leading-tight" style={{ color: 'var(--muted)' }}>{meal.items}</div>
          </div>
        ))}
      </div>
      <div className="w-20 flex flex-col gap-1.5">
        <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          Macro
        </div>
        {[
          { name: 'Proteine', val: 110, pct: 28 },
          { name: 'Carbo', val: 180, pct: 47 },
          { name: 'Grassi', val: 55, pct: 25 },
        ].map((m) => (
          <div key={m.name}>
            <div className="flex items-center justify-between">
              <div className="text-[6px]" style={{ color: 'var(--fg)' }}>{m.name}</div>
              <div className="text-[6px] font-mono" style={{ color }}>{m.val}g</div>
            </div>
            <div className="h-1 rounded-full" style={{ background: `${color}20` }}>
              <div className="h-1 rounded-full" style={{ background: color, width: `${m.pct * 2}%` }} />
            </div>
          </div>
        ))}
        <div className="mt-1 text-center py-1.5 rounded" style={{ background: color }}>
          <div className="text-[8px] font-bold text-white">1630</div>
          <div className="text-[6px]" style={{ color: 'rgba(255,255,255,0.8)' }}>kcal totali</div>
        </div>
      </div>
    </div>
  )
}

// Scheda refrazione tabellare per Oculistica
function RefractionScene({ color }: { color: string }) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
        Scheda refrazione
      </div>
      <div className="rounded overflow-hidden" style={{ border: `1px solid ${color}30` }}>
        <div className="grid grid-cols-5 text-[7px]" style={{ background: `${color}15`, color: 'var(--fg)' }}>
          <div className="px-1.5 py-1 font-bold">Occhio</div>
          <div className="px-1.5 py-1 font-bold">Sfera</div>
          <div className="px-1.5 py-1 font-bold">Cil.</div>
          <div className="px-1.5 py-1 font-bold">Asse</div>
          <div className="px-1.5 py-1 font-bold">Add.</div>
        </div>
        <div className="grid grid-cols-5 text-[7px]" style={{ background: 'rgba(255,255,255,0.7)' }}>
          <div className="px-1.5 py-1 font-bold" style={{ color }}>OD</div>
          <div className="px-1.5 py-1 font-mono">-2.25</div>
          <div className="px-1.5 py-1 font-mono">-0.75</div>
          <div className="px-1.5 py-1 font-mono">180°</div>
          <div className="px-1.5 py-1 font-mono">+1.50</div>
        </div>
        <div className="grid grid-cols-5 text-[7px]" style={{ background: 'rgba(255,255,255,0.5)' }}>
          <div className="px-1.5 py-1 font-bold" style={{ color }}>OS</div>
          <div className="px-1.5 py-1 font-mono">-2.50</div>
          <div className="px-1.5 py-1 font-mono">-0.50</div>
          <div className="px-1.5 py-1 font-mono">175°</div>
          <div className="px-1.5 py-1 font-mono">+1.50</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="p-1.5 rounded" style={{ background: 'rgba(255,255,255,0.7)' }}>
          <div className="text-[6px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Tono OD</div>
          <div className="text-[10px] font-bold font-mono" style={{ color }}>16 mmHg</div>
        </div>
        <div className="p-1.5 rounded" style={{ background: 'rgba(255,255,255,0.7)' }}>
          <div className="text-[6px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Tono OS</div>
          <div className="text-[10px] font-bold font-mono" style={{ color }}>17 mmHg</div>
        </div>
      </div>
      <div className="mt-auto text-[6px] italic" style={{ color: 'var(--muted)' }}>
        Acuità visiva: 10/10 entrambi con correzione
      </div>
    </div>
  )
}

function SceneFor({ specialty }: { specialty: Specialty }) {
  switch (specialty.id) {
    case 'estetica':
      return <BodyMapScene color={specialty.color} />
    case 'dermatologia':
      return <LesionMapScene color={specialty.color} />
    case 'ortopedia':
      return <JointRomScene color={specialty.color} />
    case 'psicologia':
      return <SessionTimelineScene color={specialty.color} />
    case 'nutrizione':
      return <MealPlanScene color={specialty.color} />
    case 'oculistica':
      return <RefractionScene color={specialty.color} />
    default:
      return <BodyMapScene color={specialty.color} />
  }
}

export function AppMockup({ specialty }: { specialty: Specialty }) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ border: `1px solid ${specialty.color}33` }}
      role="img"
      aria-label={`Anteprima visiva del modulo ${specialty.label} di Fibonacci`}
      aria-hidden="true"
    >
      {/* Chrome bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: '#ede9e2', borderBottom: `1px solid ${specialty.color}22` }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div
          className="flex-1 mx-4 px-3 py-1 rounded-md text-xs font-mono"
          style={{ background: 'rgba(255,255,255,0.7)', color: 'var(--muted)' }}
        >
          app.fibonacci.it/{specialty.id}/paziente
        </div>
      </div>

      {/* App body */}
      <div className="relative aspect-[16/10]" style={{ background: specialty.accent }}>
        {/* Sidebar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center py-3 gap-2"
          style={{ background: `${specialty.color}18` }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-lg"
              style={{
                background: i === 0 ? specialty.color : `${specialty.color}30`,
                opacity: i === 0 ? 1 : 0.6,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="absolute left-14 right-3 top-3 bottom-3 flex flex-col gap-2">
          {/* Top bar paziente */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-md" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                style={{ background: specialty.color }}
              >
                MR
              </div>
              <div className="min-w-0">
                <div className="text-[8px] font-bold truncate" style={{ color: 'var(--fg)' }}>
                  Maria Rossi
                </div>
                <div className="text-[6px] leading-tight" style={{ color: 'var(--muted)' }}>
                  {specialty.label} · Visita 2 di 4
                </div>
              </div>
            </div>
            <div
              className="px-2 py-1 rounded text-[7px] font-bold text-white shrink-0"
              style={{ background: specialty.color }}
            >
              + Nuovo
            </div>
          </div>

          {/* Scene specialty-specific */}
          <div className="flex-1 rounded-xl p-2.5 min-h-0" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <SceneFor specialty={specialty} />
          </div>

          {/* Footer azione */}
          <div className="flex gap-1.5">
            <div className="flex-1 h-6 rounded-md flex items-center px-2 text-[7px]" style={{ background: `${specialty.color}20`, color: 'var(--fg)' }}>
              Audit log · firmato {specialty.id} · 14:32
            </div>
            <div
              className="h-6 px-3 rounded-md flex items-center text-[7px] font-bold text-white"
              style={{ background: specialty.color }}
            >
              Salva visita
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
