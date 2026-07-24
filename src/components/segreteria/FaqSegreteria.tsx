'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Risposte allineate allo stato reale del prodotto (wiki: piano-segretaria-prodotto-autonomo):
// SMS = canale live; WhatsApp = in attivazione; voce = in sviluppo.
const FAQS = [
  {
    q: 'Devo cambiare il gestionale del mio studio?',
    a: 'No. La segretaria funziona a fianco di qualunque gestionale, o anche senza: l\u2019agenda degli appuntamenti la gestiamo noi, e tu vedi tutto dalla dashboard. Se un domani vorrai la cartella clinica completa di Fibonacci, l\u2019agenda è già lì.',
  },
  {
    q: 'I pazienti devono installare un\u2019app?',
    a: 'No. Scrivono un normale SMS al numero dello studio, come scriverebbero a una persona. Il canale WhatsApp è in attivazione; la risposta vocale al telefono è in sviluppo.',
  },
  {
    q: 'Cosa succede se un paziente scrive per un\u2019emergenza?',
    a: 'Ogni messaggio passa prima da un controllo deterministico anti-emergenza, indipendente dall\u2019intelligenza artificiale. Se rileva un rischio, il paziente riceve immediatamente le indicazioni di chiamare il 118 o il 112 e la conversazione viene segnalata allo studio. L\u2019AI non gestisce mai questi casi.',
  },
  {
    q: 'Può dare consigli medici, dosaggi o interpretare sintomi?',
    a: 'No, per costruzione. Il suo perimetro è la segreteria: appuntamenti, orari, turni, richieste amministrative. Qualunque domanda clinica viene rinviata al medico.',
  },
  {
    q: 'E le ricette? Le fa da sola?',
    a: 'No. Raccoglie la richiesta di rinnovo e prepara una bozza: sei tu ad approvarla e firmarla. Nessuna ricetta parte mai senza il tuo controllo.',
  },
  {
    q: 'E se non sa rispondere a una richiesta?',
    a: 'Passa la conversazione a una persona dello studio, con tutto il contesto di quanto già scritto. Il paziente non resta mai senza risposta.',
  },
  {
    q: 'Dove finiscono i dati dei pazienti?',
    a: 'Su server in Europa, con conversazioni cifrate e tracciate. Anche il modello linguistico è europeo: i messaggi dei pazienti non lasciano l\u2019Unione.',
  },
  {
    q: 'Quanto tempo serve per attivarla?',
    a: 'Pochi giorni: definiamo insieme orari, tipi di visita, durate e regole dello studio, poi attiviamo il numero. Nessun hardware, niente da installare.',
  },
]

export function FaqSegreteria() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="py-24"
      style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <p
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--accent)' }}
        >
          Domande frequenti
        </p>
        <h2
          className="font-[family-name:var(--font-geist)] tracking-[-0.025em] text-3xl md:text-4xl font-semibold mb-12"
          style={{ color: 'var(--fg)' }}
        >
          Quello che i medici ci chiedono.
        </h2>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.q}
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--accent)' }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-5 pb-5 text-sm leading-relaxed"
                        style={{ color: 'var(--muted)' }}
                      >
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
