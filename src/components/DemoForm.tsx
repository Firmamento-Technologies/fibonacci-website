'use client'
import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SPECIALTIES } from '@/lib/specialties'

interface FormState {
  nome: string
  specialty: string
  email: string
  telefono: string
}

const INITIAL_FORM: FormState = { nome: '', specialty: '', email: '', telefono: '' }

export function DemoForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const specialtyLabel =
      SPECIALTIES.find((s) => s.id === form.specialty)?.label ??
      (form.specialty === 'altro' ? 'Altra specialità' : form.specialty)

    const subject = encodeURIComponent(`Richiesta demo Fibonacci - ${form.nome}`)
    const body = encodeURIComponent(
      [
        'Buongiorno,',
        '',
        'vorrei prenotare una demo di Fibonacci. Di seguito i miei dati:',
        '',
        `Nome e cognome: ${form.nome}`,
        `Specialità: ${specialtyLabel}`,
        `Email: ${form.email}`,
        `Telefono: ${form.telefono}`,
        '',
        'Grazie,',
        form.nome,
        '',
        '---',
        'Richiesta inviata da fibonacci.it',
      ].join('\n'),
    )

    window.location.href = `mailto:info@fibonacci.it?subject=${subject}&body=${body}`

    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 400)
  }

  return (
    <section className="py-24" id="demo" style={{ background: 'var(--fg)' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: '#f0d27a' }}
        >
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
            <h3 className="text-xl font-semibold text-white">Email pronta!</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }} className="max-w-md">
              Si è aperto il tuo client di posta con i dati precompilati. Conferma
              l&apos;invio e ti contatteremo entro 24 ore.
            </p>
            <button
              onClick={() => {
                setSent(false)
                setForm(INITIAL_FORM)
              }}
              className="text-sm underline transition-opacity hover:opacity-75"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Compila un&apos;altra richiesta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Nome e cognome"
                value={form.nome}
                onChange={(e) => update('nome', e.target.value)}
                className="px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 w-full"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              />
              <select
                required
                aria-label="Specialità medica"
                value={form.specialty}
                onChange={(e) => update('specialty', e.target.value)}
                className="px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 w-full"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: form.specialty ? 'white' : 'rgba(255,255,255,0.85)',
                }}
              >
                <option value="">Specialità medica</option>
                {SPECIALTIES.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                    style={{ color: 'var(--fg)', background: 'white' }}
                  >
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
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
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
                value={form.telefono}
                onChange={(e) => update('telefono', e.target.value)}
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
              {loading ? 'Apertura email…' : 'Prenota demo gratuita'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Si aprirà il tuo client di posta con i dati precompilati verso{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>info@fibonacci.it</span>.
              Nessun vincolo contrattuale. I tuoi dati non vengono ceduti a terzi. GDPR compliant.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
