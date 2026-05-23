'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Sparkles, Handshake } from 'lucide-react'
import { SPECIALTIES } from '@/lib/specialties'

export function SpecialtiesSection() {
  const [active, setActive] = useState(SPECIALTIES[0])
  const isAvailable = active.status === 'available'

  return (
    <section className="py-24" style={{ background: 'var(--card)' }} id="specialita">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
            Una specialità live, cinque in co-design
          </p>
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
            Fibonacci è una piattaforma modulare
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Medicina Estetica è il primo modulo, già in produzione e demo
            accessibile. Le altre cinque specialità sono in <strong>co-design
            con cliniche partner</strong>: ogni workflow viene costruito a
            quattro mani con chi userà davvero il modulo, non da consulenti
            esterni o template generici.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar specialità */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SPECIALTIES.map((s) => {
              const available = s.status === 'available'
              const isActive = active.id === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap lg:whitespace-normal transition-all shrink-0"
                  style={{
                    background: isActive ? s.accent : 'transparent',
                    border: `1.5px solid ${isActive ? s.color + '66' : 'var(--border)'}`,
                    color: isActive ? 'var(--fg)' : 'var(--muted)',
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
                    style={{
                      background: s.color,
                      opacity: isActive ? 1 : 0.4,
                    }}
                  />
                  <span className="text-sm font-semibold flex-1">{s.label}</span>
                  {available ? (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: '#16a34a', color: 'white' }}
                      title="Modulo live, demo disponibile"
                    >
                      Live
                    </span>
                  ) : (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                      title="In co-design con clinica partner"
                    >
                      Co-design
                    </span>
                  )}
                </button>
              )
            })}
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

                  {isAvailable ? (
                    <Link
                      href={`/specialita/${active.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ background: active.color }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Prova {active.label} in demo live
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/specialita/${active.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: active.color }}
                      >
                        <Handshake className="w-4 h-4" />
                        Diventa clinica partner di co-design
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/specialita/${active.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                        style={{ color: 'var(--fg)', border: '1.5px solid var(--border)', background: 'white' }}
                      >
                        Vedi cosa stiamo progettando
                      </Link>
                    </div>
                  )}
                </div>

                {/* Stat highlight — integrata nel pannello, non box isolato */}
                <div
                  className="md:w-40 flex flex-col items-center justify-center text-center rounded-2xl p-6 shrink-0"
                  style={{ background: active.color }}
                >
                  <span className="font-[var(--font-playfair)] text-5xl font-bold text-white leading-none">
                    {active.heroStat.value}
                  </span>
                  <span className="text-xs mt-3 leading-snug font-medium" style={{ color: 'rgba(255,255,255,0.95)' }}>
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
