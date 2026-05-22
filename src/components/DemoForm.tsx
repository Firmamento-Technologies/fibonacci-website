'use client'
import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SPECIALTIES } from '@/lib/specialties'

export function DemoForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // TODO: integra con endpoint backend o Brevo
    await new Promise((r) => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  return (
    <section className="py-24" id="demo" style={{ background: 'var(--fg)' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
          Inizia adesso
        </p>
        <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white mb-4">
          Prenota la tua demo gratuita
        </h2>
        <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
          30 minuti, nessun vincolo. Ti mostriamo Fibonacci nella tua specialità.
        </p>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <CheckCircle2 className="w-14 h-14" style={{ color: 'var(--accent)' }} />
            <h3 className="text-xl font-semibold text-white">Richiesta ricevuta!</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Ti contatteremo entro 24 ore per fissare la demo.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Nome e cognome"
                className="px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 w-full"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              />
              <select
                required
                className="px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 w-full"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <option value="">Specialità medica</option>
                {SPECIALTIES.map((s) => (
                  <option key={s.id} value={s.id} style={{ color: 'var(--fg)', background: 'white' }}>
                    {s.label}
                  </option>
                ))}
                <option value="altro" style={{ color: 'var(--fg)', background: 'white' }}>
                  Altra specialità
                </option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                type="email"
                placeholder="Email professionale"
                className="px-4 py-3.5 rounded-xl text-sm outline-none w-full"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              />
              <input
                required
                type="tel"
                placeholder="Telefono"
                className="px-4 py-3.5 rounded-xl text-sm outline-none w-full"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--accent)' }}
            >
              {loading ? 'Invio in corso…' : 'Prenota demo gratuita'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Nessun vincolo contrattuale. I tuoi dati non vengono ceduti a terzi. GDPR compliant.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
