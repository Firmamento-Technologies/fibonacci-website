'use client'

import { useState, useMemo } from 'react'
import { Calculator, Users, Banknote, Sparkles } from 'lucide-react'

// MRR (Monthly Recurring Revenue) per tier piano scelto dal referito
const PLAN_MRR = {
  solo: 149,
  studio: 349,
  clinica: 749,
  enterprise: 1999,
} as const

type Plan = keyof typeof PLAN_MRR

function tierForReferrals(n: number) {
  if (n >= 25) return { name: 'Platino', oneTimePct: 0.4, recurringPct: 0.12, bonus: 1000, color: '#a85b53' }
  if (n >= 10) return { name: 'Oro', oneTimePct: 0.35, recurringPct: 0.1, bonus: 0, color: '#d4a017' }
  if (n >= 4) return { name: 'Argento', oneTimePct: 0.3, recurringPct: 0.08, bonus: 0, color: '#c0c0c0' }
  return { name: 'Cinco', oneTimePct: 0.25, recurringPct: 0.05, bonus: 0, color: '#cd7f32' }
}

const PLAN_LABELS: Record<Plan, string> = {
  solo: 'Solo Pro 149 €',
  studio: 'Studio 349 €',
  clinica: 'Clinica 749 €',
  enterprise: 'Enterprise 1999 €',
}

export function PartnersCalculator() {
  const [numReferrals, setNumReferrals] = useState(10)
  const [plan, setPlan] = useState<Plan>('studio')

  const calc = useMemo(() => {
    const mrr = PLAN_MRR[plan]
    const annualPerReferral = mrr * 12
    const tier = tierForReferrals(numReferrals)

    const oneTime = numReferrals * annualPerReferral * tier.oneTimePct
    const recurringYear = numReferrals * annualPerReferral * tier.recurringPct
    const year1Total = oneTime + recurringYear + tier.bonus
    const year2Total = recurringYear

    return {
      mrr,
      annualPerReferral,
      tier,
      oneTime,
      recurringYear,
      year1Total,
      year2Total,
      fibonacciAnnualRevenue: numReferrals * annualPerReferral,
    }
  }, [numReferrals, plan])

  return (
    <div
      className="rounded-2xl p-8"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold mb-3"
              style={{ color: 'var(--fg)' }}
            >
              <Users className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              Quanti studi medici porti su Fibonacci all&apos;anno?
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={numReferrals}
              onChange={(e) => setNumReferrals(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--muted)' }}>
              <span>1</span>
              <span
                className="text-base font-bold font-[var(--font-playfair)]"
                style={{ color: 'var(--accent)' }}
              >
                {numReferrals} studi
              </span>
              <span>50</span>
            </div>
          </div>

          <div>
            <label
              className="flex items-center gap-2 text-sm font-semibold mb-3"
              style={{ color: 'var(--fg)' }}
            >
              <Calculator className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              Piano medio dei referiti
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PLAN_MRR) as Plan[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left`}
                  style={{
                    background: plan === p ? 'var(--accent)' : 'var(--bg)',
                    color: plan === p ? 'white' : 'var(--fg)',
                    border: plan === p ? '1px solid var(--accent)' : '1px solid var(--border)',
                  }}
                >
                  {PLAN_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div
            className="p-4 rounded-lg text-xs"
            style={{
              background: 'var(--accent-light)',
              color: 'var(--fg)',
              border: '1px solid var(--accent)',
            }}
          >
            <p className="font-semibold mb-1">📊 Cosa stai vedendo</p>
            <p className="leading-relaxed">
              MRR del piano scelto × 12 = ricavi annui Fibonacci per referral. La commissione si calcola
              come percentuale di quel valore, secondo il tuo tier (auto-aggiornato in base al numero di
              studi attivi che porti).
            </p>
          </div>
        </div>

        {/* Results */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                Tier raggiunto
              </p>
              <p
                className="font-[var(--font-playfair)] text-2xl font-bold"
                style={{ color: calc.tier.color }}
              >
                {calc.tier.name}
              </p>
            </div>
            <Sparkles className="w-8 h-8" style={{ color: calc.tier.color }} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                Ricavi generati per Fibonacci
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--fg)' }}>
                {Math.round(calc.fibonacciAnnualRevenue).toLocaleString('it-IT')} €/anno
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                Commissione one-time ({Math.round(calc.tier.oneTimePct * 100)}%)
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--fg)' }}>
                {Math.round(calc.oneTime).toLocaleString('it-IT')} €
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                Recurring annuale ({Math.round(calc.tier.recurringPct * 100)}%)
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--fg)' }}>
                {Math.round(calc.recurringYear).toLocaleString('it-IT')} €
              </span>
            </div>

            {calc.tier.bonus > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  Cash bonus Platino
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  +{calc.tier.bonus.toLocaleString('it-IT')} €
                </span>
              </div>
            )}

            <div
              className="mt-4 p-4 rounded-lg flex items-center justify-between"
              style={{ background: 'var(--accent)' }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-1 text-white opacity-70">
                  Tuo guadagno anno 1
                </p>
                <p className="font-[var(--font-playfair)] text-2xl font-bold text-white">
                  {Math.round(calc.year1Total).toLocaleString('it-IT')} €
                </p>
              </div>
              <Banknote className="w-8 h-8 text-white opacity-80" />
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                Tuo guadagno anno 2+ (passivo)
              </p>
              <p
                className="font-[var(--font-playfair)] text-xl font-bold"
                style={{ color: 'var(--fg)' }}
              >
                {Math.round(calc.year2Total).toLocaleString('it-IT')} €/anno
              </p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
                Finché i referiti restano clienti Fibonacci
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] mt-6" style={{ color: 'var(--muted)' }}>
        Calcoli indicativi · Cap massimo 50 referral attivi · Commissione liberata dopo 60 gg dall&apos;attivazione del referito
      </p>
    </div>
  )
}
