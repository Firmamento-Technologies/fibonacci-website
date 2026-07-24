'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export interface ChatMessage {
  from: 'patient' | 'ai'
  text: string
}

interface PhoneMockupProps {
  messages: ChatMessage[]
  /** Etichetta contesto mostrata sopra la chat (es. "Domenica · 22:04") */
  caption: string
  /** Variante "emergency": evidenzia la risposta di sicurezza 118 */
  variant?: 'default' | 'emergency'
  /** Sotto-testo nell'header del telefono */
  status?: string
}

// Rileva la bolla di risposta all'emergenza nella variante "emergency"
// (prima risposta AI): la evidenzia col bordo accento + icona.
export function PhoneMockup({
  messages,
  caption,
  variant = 'default',
  status = 'risponde subito',
}: PhoneMockupProps) {
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    let i = 0
    function clearAll() {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
    function step() {
      if (i >= messages.length) {
        // Conversazione completa: pausa lunga poi ricomincia (loop infinito)
        timers.current.push(
          setTimeout(() => {
            i = 0
            setVisible(0)
            step()
          }, 6500),
        )
        return
      }
      const msg = messages[i]
      if (msg.from === 'ai') {
        setTyping(true)
        timers.current.push(
          setTimeout(
            () => {
              setTyping(false)
              i += 1
              setVisible(i)
              step()
            },
            // La risposta all'emergenza è immediata: pausa di typing minima
            variant === 'emergency' ? 700 : 1400,
          ),
        )
      } else {
        i += 1
        setVisible(i)
        timers.current.push(setTimeout(step, 1300))
      }
    }
    step()
    return clearAll
  }, [messages, variant])

  const firstAiIndex = messages.findIndex((m) => m.from === 'ai')

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Caption contesto (es. "Domenica · 22:04") */}
      <span
        className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
      >
        {caption}
      </span>

      {/* Frame telefono */}
      <div
        className="w-[300px] sm:w-[330px] rounded-[2rem] p-2 shadow-2xl"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div
          className="rounded-[1.6rem] overflow-hidden flex flex-col"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', height: 460 }}
        >
          {/* Header conversazione */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: 'var(--accent)' }}
              aria-hidden="true"
            >
              S
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>
                Studio Medico
              </p>
              <p className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: '#16a34a' }}
                  aria-hidden="true"
                />
                {status}
              </p>
            </div>
          </div>

          {/* Corpo chat */}
          <div className="flex-1 px-3 py-4 space-y-2.5 overflow-hidden">
            <AnimatePresence initial={false}>
              {messages.slice(0, visible).map((m, idx) => {
                const isEmergencyReply = variant === 'emergency' && idx === firstAiIndex
                return (
                  <motion.div
                    key={`${idx}-${m.text.slice(0, 8)}`}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${m.from === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-[82%] px-3.5 py-2.5 text-[13px] leading-snug"
                      style={
                        m.from === 'patient'
                          ? {
                              background: 'var(--card)',
                              color: 'var(--fg)',
                              border: '1px solid var(--border)',
                              borderRadius: '14px 14px 4px 14px',
                            }
                          : isEmergencyReply
                            ? {
                                background: 'var(--accent-light)',
                                color: 'var(--fg)',
                                border: '1.5px solid var(--accent)',
                                borderRadius: '14px 14px 14px 4px',
                              }
                            : {
                                background: 'var(--accent-light)',
                                color: 'var(--fg)',
                                border: '1px solid transparent',
                                borderRadius: '14px 14px 14px 4px',
                              }
                      }
                    >
                      {isEmergencyReply && (
                        <span
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1.5"
                          style={{ color: 'var(--accent)' }}
                        >
                          <ShieldAlert className="w-3 h-3" />
                          Risposta immediata
                        </span>
                      )}
                      {m.text}
                    </div>
                  </motion.div>
                )
              })}
              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="px-4 py-3 flex items-center gap-1"
                    style={{ background: 'var(--accent-light)', borderRadius: '14px 14px 14px 4px' }}
                    aria-label="Sta scrivendo"
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--accent)' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input finto */}
          <div
            className="px-3 py-2.5 shrink-0"
            style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}
          >
            <div
              className="text-xs px-3.5 py-2 rounded-full"
              style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              Scrivi un messaggio…
            </div>
          </div>
        </div>
      </div>
      <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
        Esempio illustrativo di conversazione
      </p>
    </div>
  )
}
