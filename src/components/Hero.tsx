'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Play, ArrowRight } from 'lucide-react'
import { SPECIALTIES, type Specialty } from '@/lib/specialties'

export function Hero() {
  const [selected, setSelected] = useState<Specialty>(SPECIALTIES[0])
  const [dropOpen, setDropOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex flex-col pt-16 overflow-hidden">
      {/* Sfondo gradient sottile */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 60% 10%, ${selected.accent} 0%, transparent 70%)`,
          transition: 'background 0.6s ease',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 pt-24 pb-20 flex-1">
        {/* Left: testo */}
        <div className="flex-1 max-w-xl">
          {/* Badge specialità */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: selected.accent, color: selected.color }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: selected.color }} />
            Software specialistico per medici
          </motion.div>

          {/* Headline con selettore specialità */}
          <h1 className="font-[var(--font-playfair)] text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ color: 'var(--fg)' }}
          >
            La cartella clinica
            <br />
            di{' '}
            {/* Selettore inline */}
            <span className="relative inline-block">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="inline-flex items-center gap-2 pb-1 border-b-2 transition-colors"
                style={{ color: selected.color, borderColor: selected.color }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={selected.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selected.label}
                  </motion.span>
                </AnimatePresence>
                <ChevronDown className="w-5 h-5 shrink-0" />
              </button>

              {/* Dropdown specialità */}
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl shadow-2xl p-1.5 z-50"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    {SPECIALTIES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setSelected(s); setDropOpen(false) }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-[var(--bg)] text-sm font-medium"
                        style={{ color: selected.id === s.id ? s.color : 'var(--fg)' }}
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                        {s.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
          </h1>

          {/* Tagline dinamica */}
          <AnimatePresence mode="wait">
            <motion.p
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-lg leading-relaxed mb-8"
              style={{ color: 'var(--muted)' }}
            >
              {selected.tagline}
            </motion.p>
          </AnimatePresence>

          {/* Stat dinamica */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id + '-stat'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
              style={{ background: selected.accent }}
            >
              <span className="text-2xl font-bold font-[var(--font-playfair)]" style={{ color: selected.color }}>
                {selected.heroStat.value}
              </span>
              <span className="text-sm" style={{ color: selected.color }}>
                {selected.heroStat.label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--fg)' }}
            >
              Richiedi demo gratuita
              <ArrowRight className="w-4 h-4" />
            </a>
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: 'var(--fg)', background: 'transparent', border: '1.5px solid var(--border)' }}
            >
              <Play className="w-4 h-4" />
              Guarda 90 secondi
            </button>
          </div>
        </div>

        {/* Right: screenshot prodotto */}
        <div className="flex-1 w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative"
            >
              {/* Frame browser */}
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid var(--border)' }}
              >
                {/* Browser chrome */}
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ background: '#f0ece6', borderBottom: '1px solid var(--border)' }}
                >
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div
                    className="flex-1 mx-4 px-3 py-1 rounded-md text-xs"
                    style={{ background: 'var(--bg)', color: 'var(--muted)' }}
                  >
                    app.fibonacci.it/{selected.id}
                  </div>
                </div>
                {/* Screenshot area */}
                <div
                  className="aspect-[16/10] flex items-center justify-center relative"
                  style={{ background: selected.accent }}
                >
                  {/* Placeholder UI mockup */}
                  <div className="w-full h-full p-6 flex flex-col gap-3">
                    {/* Fake navbar */}
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-24 rounded-lg opacity-40" style={{ background: selected.color }} />
                      <div className="h-8 flex-1 rounded-lg opacity-20" style={{ background: selected.color }} />
                      <div className="h-8 w-20 rounded-lg opacity-30" style={{ background: selected.color }} />
                    </div>
                    {/* Fake content */}
                    <div className="flex gap-3 flex-1">
                      <div className="flex flex-col gap-2 w-1/3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="rounded-lg p-3 opacity-30" style={{ background: selected.color, height: 52 }} />
                        ))}
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="rounded-xl p-4 opacity-25 flex-1" style={{ background: selected.color }} />
                        <div className="flex gap-2">
                          <div className="rounded-lg opacity-20 h-10 flex-1" style={{ background: selected.color }} />
                          <div className="rounded-lg opacity-40 h-10 w-24" style={{ background: selected.color }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Label specialty */}
                  <div
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: selected.color }}
                  >
                    {selected.name}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                🇪🇺 GDPR · FHIR R4 · Dati in EU
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
