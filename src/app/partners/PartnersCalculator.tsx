'use client'

import { useState, useMemo } from 'react'
import { Users, Banknote } from 'lucide-react'

const PLAN_PRICE = {
  solo: 89,
  studio: 199,
  clinica: 449,
} as const

type Plan = keyof typeof PLAN_PRICE

const PLAN_LABEL: Record<Plan, string> = {
  solo: 'Solo · 89 €',
  studio: 'Studio · 199 €',
  clinica: 'Clinica · 449 €',
}

const ONE_TIME_PCT = 0.2
const RECURRING_PCT = 0.1

export function PartnersCalculator() {
  const [numReferrals, setNumReferrals] = useState(5)
  const [plan, setPlan] = useState<Plan>('studio')

  const calc = useMemo(() => {
    const annual = PLAN_PRICE[plan] * 12
    const firstYear = numReferrals * annual * ONE_TIME_PCT
    const recurringYear = numReferrals * annual * RECURRING_PCT
    return { firstYear, recurringYear, year1: firstYear + recurringYear }
  }, [numReferrals, plan])

  return (
    <div
      className="rounded-2xl p-8 max-w-3xl mx-auto"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: 'var(--fg)' }}>
              <Users className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              Quanti colleghi porti
            </label>
            <input
              type="range"
              min={1}
              max={20}
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
                {numReferrals} {numReferrals === 1 ? 'collega' : 'colleghi'}
              </span>
              <span>20</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--fg)' }}>
              Piano del collega
            </label>
            <div className="space-y-2">
              {(Object.keys(PLAN_PRICE) as Plan[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left"
                  style={{
                    background: plan === p ? 'var(--accent)' : 'var(--bg)',
                    color: plan === p ? 'white' : 'var(--fg)',
                    border: plan === p ? '1px solid var(--accent)' : '1px solid var(--border)',
                  }}
                >
                  {PLAN_LABEL[p]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                20% del primo anno
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--fg)' }}>
                {Math.round(calc.firstYear).toLocaleString('it-IT')} €
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                10% ricorrente (anno 1)
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--fg)' }}>
                {Math.round(calc.recurringYear).toLocaleString('it-IT')} €
              </span>
            </div>

            <div className="rounded-lg p-4 flex items-center justify-between" style={{ background: 'var(--accent)' }}>
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-1 text-white opacity-70">
                  Anno 1
                </p>
                <p className="font-[var(--font-playfair)] text-2xl font-bold text-white">
                  {Math.round(calc.year1).toLocaleString('it-IT')} €
                </p>
              </div>
              <Banknote className="w-7 h-7 text-white opacity-80" />
            </div>

            <div className="rounded-lg p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                Dal secondo anno
              </p>
              <p className="font-[var(--font-playfair)] text-xl font-bold" style={{ color: 'var(--fg)' }}>
                {Math.round(calc.recurringYear).toLocaleString('it-IT')} €/anno
              </p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
                Finché restano clienti
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
