'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Play, ArrowRight } from 'lucide-react'
import { SPECIALTIES, type Specialty } from '@/lib/specialties'
import { AppMockup } from '@/components/AppMockup'

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
      {/* Dot grid pattern premium texture - statico, no animazioni */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(27, 46, 75, 0.12) 1px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Soft gradient radial specialty-tinted - statico, transition smooth */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 65% 50% at 70% 10%, ${selected.accent} 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Spirale Fibonacci sottile in alto a destra - firma brand */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] -translate-y-1/4 translate-x-1/4 pointer-events-none"
        aria-hidden="true"
      >
        <SpiralDecor color={selected.color} opacity={0.06} />
      </div>

      {/* Spirale Fibonacci secondaria piccola in basso a sinistra */}
      <div
        className="absolute bottom-0 left-0 w-[260px] h-[260px] translate-y-1/3 -translate-x-1/3 rotate-180 pointer-events-none"
        aria-hidden="true"
      >
        <SpiralDecor color={selected.color} opacity={0.03} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-20 lg:pt-24 pb-20 flex-1">
        {/* Colonna sinistra */}
        <div className="flex-1 max-w-xl">
          {/* Selettore specialità come pill — sopra il titolo */}
          <div className="relative mb-5">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              aria-label={`Cambia specialità, attualmente ${selected.label}`}
              aria-expanded={dropOpen}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: selected.accent, color: 'var(--fg)', border: `1.5px solid ${selected.color}66` }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: selected.color }} />
              {selected.label}
              <ChevronDown className="w-4 h-4" />
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
          </div>

          {/* Headline fisso — nessun selettore embedded, zero problemi di wrap */}
          <h1
            className="font-[var(--font-playfair)] text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-5 break-words"
            style={{ color: 'var(--fg)' }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                La cartella clinica<br />
                <span style={{ color: selected.color }}>di {selected.label}</span>
              </motion.span>
            </AnimatePresence>
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
                style={{ color: 'var(--fg)' }}
              >
                {selected.heroStat.value}
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                {selected.heroStat.label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* CTA con aurora glow attorno al primario */}
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
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-colors backdrop-blur-sm"
              style={{ color: 'var(--fg)', border: '1.5px solid var(--border)', background: 'rgba(255,255,255,0.4)' }}
            >
              <Play className="w-3.5 h-3.5" />
              Guarda come funziona
            </a>
          </div>
          {/* Note: Hero esiste solo sulla home, gli anchor #demo/#come-funziona qui sono safe */}
        </div>

        {/* Colonna destra: UI mockup — nascosto su mobile, visibile da lg */}
        <div className="hidden lg:block flex-1 w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 32, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -32, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              <AppMockup specialty={selected} />

              {/* Badge floating GDPR */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                <span>GDPR · FHIR R4 · Dati in UE</span>
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
