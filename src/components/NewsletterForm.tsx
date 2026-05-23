'use client'
import { useState } from 'react'
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react'

interface NewsletterFormProps {
  variant?: 'inline' | 'card'
  title?: string
  body?: string
}

export function NewsletterForm({
  variant = 'card',
  title = 'Guide pratiche per medici italiani',
  body = 'Risorse GDPR, FHIR, AI clinica. Una email ogni due settimane, niente spam.',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    const subject = encodeURIComponent('Iscrizione newsletter Fibonacci')
    const body = encodeURIComponent(
      [
        'Buongiorno,',
        '',
        `vorrei iscrivermi alla newsletter Fibonacci con questa email: ${email}`,
        '',
        'Grazie,',
      ].join('\n'),
    )
    window.location.href = `mailto:news@fibonacci.it?subject=${subject}&body=${body}`

    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 400)
  }

  if (sent) {
    return (
      <div
        className={`flex items-center gap-3 p-4 rounded-xl ${variant === 'card' ? 'flex-col text-center py-8' : ''}`}
        style={{ background: 'var(--accent-light)', border: '1px solid var(--border)' }}
      >
        <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: 'var(--accent)' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
            Email pronta!
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Conferma l&apos;invio dal tuo client di posta. Ti aggiungeremo entro 24h.
          </p>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          required
          type="email"
          placeholder="email@professionale.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--fg)' }}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'var(--fg)' }}
        >
          {loading ? 'Apertura email…' : 'Iscriviti'}
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>
    )
  }

  return (
    <div
      className="p-6 rounded-2xl"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent-light)' }}
        >
          <Mail className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--fg)' }}>
            {title}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            {body}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          required
          type="email"
          placeholder="email@professionale.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'var(--accent)' }}
        >
          {loading ? '…' : 'Iscriviti'}
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>
      <p className="text-[10px] mt-3" style={{ color: 'var(--muted)' }}>
        Iscrivendoti accetti la <a href="/privacy/" className="underline">Privacy Policy</a>.
        Disiscrivi quando vuoi.
      </p>
    </div>
  )
}
