'use client'
import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare, Clock, Globe } from 'lucide-react'
import { PhoneMockup, type ChatMessage } from './PhoneMockup'

// Conversazione dimostrativa: prenotazione fuori orario (domenica sera).
// Contenuto coerente col comportamento reale del servizio (wiki: segretaria-ai).
const BOOKING_CHAT: ChatMessage[] = [
  { from: 'patient', text: 'Buonasera, avrei bisogno di una visita questa settimana. C\u2019è posto?' },
  {
    from: 'ai',
    text: 'Buonasera! Certo. Lo studio ha disponibilità giovedì alle 10:30 oppure venerdì alle 16:00. Quale preferisce?',
  },
  { from: 'patient', text: 'Giovedì alle 10:30 va bene, grazie' },
  {
    from: 'ai',
    text: 'Fatto. Visita prenotata per giovedì alle 10:30. Le invieremo un promemoria il giorno prima. Buona serata!',
  },
]

// Spirale di Fibonacci decorativa — stesso elemento identitario dell'hero home
function SpiralDecor({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute pointer-events-none"
      style={{ opacity, color: 'var(--accent)' }}
      aria-hidden="true"
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

export function SegreteriaHero() {
  return (
    <section className="relative min-h-screen flex flex-col pt-16 overflow-hidden">
      {/* Dot grid — stessa texture dell'hero home */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(27, 46, 75, 0.12) 1px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] -translate-y-1/4 translate-x-1/4 pointer-events-none"
        aria-hidden="true"
      >
        <SpiralDecor />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20 lg:pt-24 pb-20 flex-1 w-full">
        {/* Colonna sinistra: copy */}
        <div className="flex-1 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1.5px solid rgba(11,105,159,0.25)' }}
          >
            <MessageSquare className="w-4 h-4" />
            Segretaria AI per studi medici
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="font-[family-name:var(--font-geist)] tracking-[-0.03em] text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.08] mb-5"
            style={{ color: 'var(--fg)' }}
          >
            Non perderai mai più{' '}
            <span style={{ color: 'var(--accent)' }}>una telefonata.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="text-lg leading-relaxed mb-4"
            style={{ color: 'var(--muted)' }}
          >
            Risponde ai pazienti 24 ore su 24, prenota e sposta gli appuntamenti,
            prepara le richieste di ricetta per la tua approvazione. Non si ammala,
            non si licenzia, non va in ferie — risponde anche alle 22 di domenica.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="text-base font-medium mb-8"
            style={{ color: 'var(--fg)' }}
          >
            Funziona a fianco del tuo gestionale attuale.{' '}
            <span style={{ color: 'var(--accent)' }}>Non devi cambiare nulla.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: 'var(--fg)' }}
            >
              Richiedi una demo gratuita
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#come-funziona"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold transition-colors hover:bg-[var(--accent-light)]"
              style={{ color: 'var(--fg)', border: '1px solid var(--border)', background: 'var(--card)' }}
            >
              Vedi come funziona
            </a>
          </motion.div>

          {/* Rassicurazioni — solo claim veri dal prodotto */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            style={{ color: 'var(--muted)' }}
          >
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
              Attiva 24/7, anche festivi
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
              Nessuna app per i pazienti: basta un SMS
            </li>
            <li className="flex items-center gap-2">
              <Globe className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
              Dati e intelligenza artificiale in Europa
            </li>
          </motion.ul>
        </div>

        {/* Colonna destra: il prodotto che si vede — chat reale */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 flex justify-center"
        >
          <PhoneMockup messages={BOOKING_CHAT} caption="Domenica · 22:04" />
        </motion.div>
      </div>
    </section>
  )
}
