'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Play, ArrowRight } from 'lucide-react'
import { SPECIALTIES, type Specialty } from '@/lib/specialties'

// Spirale di Fibonacci decorativa SVG — elemento identitario di sfondo
function SpiralDecor({ color, opacity = 0.06 }: { color: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute pointer-events-none"
      style={{ opacity, color }}
    >
      <path
        d="M 300 300 Q 300 100 500 100 Q 700 100 700 300 Q 700 500 500 500 Q 300 500 300 300 Q 300 200 400 200 Q 500 200 500 300 Q 500 400 400 400 Q 300 400 300 300 Q 300 250 350 250 Q 400 250 400 300"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 300 300 Q 325 300 325 325 Q 325 350 300 350"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

export function Hero() {
  const [selected, setSelected] = useState<Specialty>(SPECIALTIES[0])
  const [dropOpen, setDropOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex flex-col pt-16 overflow-hidden">
      {/* Sfondo gradient dinamico */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 65% 5%, ${selected.accent} 0%, transparent 65%)`,
        }}
      />

      {/* Spirale decorativa in alto a destra */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4">
        <SpiralDecor color={selected.color} opacity={0.08} />
      </div>
      {/* Spirale secondaria in basso a sinistra */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] translate-y-1/3 -translate-x-1/3 rotate-180">
        <SpiralDecor color={selected.color} opacity={0.04} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-20 lg:pt-24 pb-20 flex-1">
        {/* Colonna sinistra */}
        <div className="flex-1 max-w-xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: selected.accent, color: selected.color }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: selected.color }} />
            Software specialistico per medici italiani
          </motion.div>

          {/* Headline — mobile safe: "di [Specialità]" su unica riga */}
          <h1
            className="font-[var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6"
            style={{ color: 'var(--fg)' }}
          >
            La cartella clinica
            <br />
            <span className="inline-flex items-baseline gap-2 flex-wrap">
              <span style={{ color: 'var(--muted)', fontSize: '0.9em' }}>di</span>

              {/* Selettore specialità */}
              <span className="relative inline-block">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="inline-flex items-center gap-1.5 pb-1 border-b-2 transition-colors leading-tight"
                  style={{ color: selected.color, borderColor: selected.color }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={selected.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {selected.label}
                    </motion.span>
                  </AnimatePresence>
                  <ChevronDown className="w-5 h-5 shrink-0" />
                </button>

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
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm font-medium"
                          style={{
                            color: selected.id === s.id ? s.color : 'var(--fg)',
                            background: selected.id === s.id ? s.accent : 'transparent',
                          }}
                        >
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                          {s.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
            </span>
          </h1>

          {/* Tagline */}
          <AnimatePresence mode="wait">
            <motion.p
              key={selected.id + '-tag'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="text-lg leading-relaxed mb-6"
              style={{ color: 'var(--muted)' }}
            >
              {selected.tagline}
            </motion.p>
          </AnimatePresence>

          {/* Stat pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id + '-stat'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
              style={{ background: selected.accent, border: `1px solid ${selected.color}22` }}
            >
              <span
                className="text-2xl font-bold font-[var(--font-playfair)]"
                style={{ color: selected.color }}
              >
                {selected.heroStat.value}
              </span>
              <span className="text-sm font-medium" style={{ color: selected.color }}>
                {selected.heroStat.label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: 'var(--fg)' }}
            >
              Richiedi demo gratuita
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#come-funziona"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
            >
              <Play className="w-3.5 h-3.5" />
              Guarda come funziona
            </a>
          </div>
        </div>

        {/* Colonna destra: UI mockup */}
        <div className="flex-1 w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 32, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -32, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              {/* Browser frame */}
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: `1px solid ${selected.color}33` }}
              >
                {/* Chrome bar */}
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ background: '#ede9e2', borderBottom: `1px solid ${selected.color}22` }}
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
                    app.fibonacci.it/{selected.id}
                  </div>
                </div>

                {/* App mockup */}
                <div
                  className="relative aspect-[16/10] overflow-hidden"
                  style={{ background: selected.accent }}
                >
                  {/* Sidebar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center py-3 gap-2"
                    style={{ background: `${selected.color}18` }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-lg"
                        style={{
                          background: i === 0 ? selected.color : `${selected.color}30`,
                          opacity: i === 0 ? 1 : 0.6,
                        }}
                      />
                    ))}
                  </div>

                  {/* Content area */}
                  <div className="absolute left-14 right-4 top-3 bottom-3 flex flex-col gap-2">
                    {/* Top bar */}
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-28 rounded" style={{ background: `${selected.color}40` }} />
                      <div
                        className="h-6 w-20 rounded-lg text-[8px] flex items-center justify-center font-bold text-white"
                        style={{ background: selected.color }}
                      >
                        + Nuovo
                      </div>
                    </div>

                    {/* Cards row */}
                    <div className="flex gap-2 mt-1">
                      {['Body map', 'Anamnesi', 'Consensi'].map((label, i) => (
                        <div
                          key={label}
                          className="flex-1 rounded-xl p-2 flex flex-col gap-1"
                          style={{
                            background: i === 0 ? selected.color : 'rgba(255,255,255,0.6)',
                            color: i === 0 ? 'white' : selected.color,
                          }}
                        >
                          <div className="text-[7px] font-semibold opacity-80">{label}</div>
                          <div
                            className="h-2 w-4/5 rounded"
                            style={{ background: i === 0 ? 'rgba(255,255,255,0.3)' : `${selected.color}30` }}
                          />
                          <div
                            className="h-1.5 w-3/5 rounded"
                            style={{ background: i === 0 ? 'rgba(255,255,255,0.2)' : `${selected.color}20` }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Main content */}
                    <div
                      className="flex-1 rounded-xl p-3 flex flex-col gap-2"
                      style={{ background: 'rgba(255,255,255,0.7)' }}
                    >
                      <div className="h-2.5 w-2/5 rounded" style={{ background: `${selected.color}50` }} />
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ background: i < 2 ? selected.color : `${selected.color}30` }}
                          />
                          <div
                            className="h-1.5 rounded"
                            style={{
                              width: `${[70, 55, 80, 45][i]}%`,
                              background: `${selected.color}25`,
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Bottom action */}
                    <div className="flex gap-2">
                      <div className="flex-1 h-7 rounded-lg" style={{ background: `${selected.color}20` }} />
                      <div
                        className="h-7 w-24 rounded-lg flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ background: selected.color }}
                      >
                        Salva visita
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge floating GDPR */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                🇪🇺 <span>GDPR · FHIR R4 · Dati in EU</span>
              </motion.div>

              {/* Badge floating specialty */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id + '-badge'}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ background: selected.color }}
                >
                  {selected.name}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
