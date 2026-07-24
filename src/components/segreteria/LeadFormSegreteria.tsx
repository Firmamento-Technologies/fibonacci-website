'use client'
import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { LEAD_API_URL } from '@/lib/site-config'

interface FormState {
  nome: string
  studio: string
  citta: string
  email: string
  telefono: string
  note: string
}

const INITIAL_FORM: FormState = {
  nome: '',
  studio: '',
  citta: '',
  email: '',
  telefono: '',
  note: '',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: 'white',
}

export function LeadFormSegreteria() {
  const [sent, setSent] = useState(false)
  // 'api' = lead registrato dal backend; 'mailto' = fallback client di posta
  // (l'utente deve ancora premere invio). Due messaggi diversi, come in DemoForm.
  const [sentVia, setSentVia] = useState<'api' | 'mailto' | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const subject = encodeURIComponent(`Richiesta Segretaria AI - ${form.nome}`)
    const lines = [
      'Buongiorno,',
      '',
      'vorrei una demo della Segretaria AI per il mio studio. Di seguito i miei dati:',
      '',
      `Nome e cognome: ${form.nome}`,
      `Studio: ${form.studio}`,
      `Città: ${form.citta}`,
      `Email: ${form.email}`,
      `Telefono: ${form.telefono}`,
      '',
      form.note ? `Note: ${form.note}` : '',
      '',
      'Grazie,',
      form.nome,
      '',
      '---',
      'Richiesta inviata dal sito · intent=segreteria',
    ]

    // Prova prima l'endpoint lead strutturato (tracciabile, non dipende dal
    // client di posta). Il mailto resta come fallback.
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 6000)
      const resp = await fetch(LEAD_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          intent: 'segreteria',
          nome: form.nome,
          specialty: 'Segretaria AI',
          email: form.email,
          telefono: form.telefono,
          motivazione: `Studio: ${form.studio} · Città: ${form.citta}${form.note ? ` · Note: ${form.note}` : ''}`,
          source: 'fibonacci-website-segreteria',
        }),
      })
      clearTimeout(timeout)
      if (resp.ok) {
        setSentVia('api')
        setSent(true)
        setLoading(false)
        return
      }
    } catch {
      // Endpoint non disponibile: fallback mailto.
    }

    const body = encodeURIComponent(lines.filter(Boolean).join('\n'))
    window.location.href = `mailto:info@firmamentotechnologies.com?subject=${subject}&body=${body}`

    setTimeout(() => {
      setSentVia('mailto')
      setSent(true)
      setLoading(false)
    }, 400)
  }

  return (
    <section id="demo" className="py-24" style={{ background: 'var(--fg)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--accent-light)' }}
          >
            Inizia adesso
          </p>
          <h2 className="font-[family-name:var(--font-geist)] tracking-[-0.025em] text-3xl md:text-4xl font-semibold text-white mb-4">
            Vedi la segretaria al lavoro sul tuo studio.
          </h2>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
            30 minuti, nessun vincolo. Ti mostriamo una conversazione reale e come
            apparirebbe l&apos;agenda del tuo studio.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <CheckCircle2 className="w-14 h-14" style={{ color: 'var(--accent-light)' }} />
            <h3 className="text-xl font-semibold text-white">
              {sentVia === 'mailto' ? 'Email pronta!' : 'Richiesta inviata!'}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }} className="max-w-md">
              {sentVia === 'mailto' ? (
                <>
                  Si è aperto il tuo client di posta con i dati precompilati.{' '}
                  <strong>Conferma l&apos;invio dell&apos;email</strong> per completare la
                  richiesta: ti ricontatteremo entro 24 ore.
                </>
              ) : (
                <>Abbiamo ricevuto la tua richiesta. Ti ricontatteremo entro 24 ore.</>
              )}
            </p>
            <button
              onClick={() => {
                setSent(false)
                setSentVia(null)
                setForm(INITIAL_FORM)
              }}
              className="text-sm underline transition-opacity hover:opacity-75"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Compila un&apos;altra richiesta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-1">
              <label htmlFor="seg-nome" className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Nome e cognome *
              </label>
              <input
                id="seg-nome"
                required
                value={form.nome}
                onChange={(e) => update('nome', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
                style={inputStyle}
                placeholder="Dott.ssa Maria Rossi"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="seg-studio" className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Nome dello studio
              </label>
              <input
                id="seg-studio"
                value={form.studio}
                onChange={(e) => update('studio', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
                style={inputStyle}
                placeholder="Studio Medico San Giorgio"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="seg-email" className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Email *
              </label>
              <input
                id="seg-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
                style={inputStyle}
                placeholder="maria.rossi@email.it"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="seg-telefono" className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Telefono
              </label>
              <input
                id="seg-telefono"
                type="tel"
                value={form.telefono}
                onChange={(e) => update('telefono', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
                style={inputStyle}
                placeholder="+39 333 000 0000"
              />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="seg-citta" className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Città
              </label>
              <input
                id="seg-citta"
                value={form.citta}
                onChange={(e) => update('citta', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent-light)]"
                style={inputStyle}
                placeholder="Genova"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="seg-note" className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Note
              </label>
              <textarea
                id="seg-note"
                rows={3}
                value={form.note}
                onChange={(e) => update('note', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent-light)] resize-none"
                style={inputStyle}
                placeholder="Es. siamo due medici, la segretaria va in pensione a giugno…"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
              >
                {loading ? 'Invio in corso…' : 'Richiedi la demo gratuita'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              <p className="text-[11px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Inviando accetti di essere ricontattato. Dati trattati secondo la{' '}
                <a href="/privacy" className="underline">privacy policy</a>.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
