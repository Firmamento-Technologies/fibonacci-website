'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { SPECIALTIES } from '@/lib/specialties'

export function SpecialtiesSection() {
  const [active, setActive] = useState(SPECIALTIES[0])

  return (
    <section className="py-24" style={{ background: 'var(--card)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
            Specialità disponibili
          </p>
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
            Una piattaforma, ogni specialità
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Ogni modulo è costruito con i workflow reali della specialità — non adattato da un template generico.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar specialità */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SPECIALTIES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap lg:whitespace-normal transition-all shrink-0"
                style={{
                  background: active.id === s.id ? s.accent : 'transparent',
                  border: `1.5px solid ${active.id === s.id ? s.color + '44' : 'var(--border)'}`,
                  color: active.id === s.id ? s.color : 'var(--muted)',
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
                  style={{
                    background: s.color,
                    opacity: active.id === s.id ? 1 : 0.4,
                  }}
                />
                <span className="text-sm font-semibold">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Pannello dettaglio */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-8"
              style={{ background: active.accent, border: `1px solid ${active.color}22` }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="font-[var(--font-playfair)] text-2xl font-bold mb-3" style={{ color: active.color }}>
                    {active.name}
                  </h3>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--fg)' }}>
                    {active.tagline}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {active.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: active.color }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--fg)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`/specialita/${active.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: active.color }}
                  >
                    Scopri {active.label}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Stat highlight — integrata nel pannello, non box isolato */}
                <div
                  className="md:w-40 flex flex-col items-center justify-center text-center rounded-2xl p-6 shrink-0"
                  style={{ background: active.color }}
                >
                  <span className="font-[var(--font-playfair)] text-5xl font-bold text-white leading-none">
                    {active.heroStat.value}
                  </span>
                  <span className="text-xs mt-3 leading-snug font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {active.heroStat.label}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
