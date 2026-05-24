'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Award, Sparkles } from 'lucide-react'
import { SPECIALTIES } from '@/lib/specialties'
import { PHOTOS } from '@/lib/asset-path'

interface FormState {
  nome: string
  specialty: string
  email: string
  telefono: string
  // Campi extra solo per intent=ambassador
  ordineProvincia: string
  numeroAlbo: string
  partitaIva: string
  networkSize: string
  motivazione: string
}

const INITIAL_FORM: FormState = {
  nome: '',
  specialty: '',
  email: '',
  telefono: '',
  ordineProvincia: '',
  numeroAlbo: '',
  partitaIva: '',
  networkSize: '',
  motivazione: '',
}

const REF_STORAGE_KEY = 'fibonacci_ref_code'
const REF_TS_KEY = 'fibonacci_ref_ts'
const REF_TTL_MS = 90 * 24 * 60 * 60 * 1000 // 90 giorni

function readPersistedRef(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const ref = localStorage.getItem(REF_STORAGE_KEY)
    const ts = Number(localStorage.getItem(REF_TS_KEY) || '0')
    if (!ref || !ts) return null
    if (Date.now() - ts > REF_TTL_MS) {
      localStorage.removeItem(REF_STORAGE_KEY)
      localStorage.removeItem(REF_TS_KEY)
      return null
    }
    return ref
  } catch {
    return null
  }
}

function persistRef(ref: string) {
  try {
    localStorage.setItem(REF_STORAGE_KEY, ref)
    localStorage.setItem(REF_TS_KEY, String(Date.now()))
  } catch {
    // localStorage potrebbe essere disabilitato (incognito strict)
  }
}

export function DemoForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [intent, setIntent] = useState<'demo' | 'ambassador'>('demo')
  const [refCode, setRefCode] = useState<string | null>(null)

  // Capture URL params (?intent, ?ref) e persistenza ref 90gg
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)

    const intentParam = params.get('intent')
    if (intentParam === 'ambassador') {
      setIntent('ambassador')
    }

    const refParam = params.get('ref')
    if (refParam && /^[A-Za-z0-9_-]{1,32}$/.test(refParam)) {
      persistRef(refParam)
      setRefCode(refParam)
    } else {
      const persisted = readPersistedRef()
      if (persisted) setRefCode(persisted)
    }
  }, [])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const specialtyLabel =
      SPECIALTIES.find((s) => s.id === form.specialty)?.label ??
      (form.specialty === 'altro' ? 'Altra specialità' : form.specialty)

    const isAmbassador = intent === 'ambassador'

    const subject = encodeURIComponent(
      isAmbassador
        ? `Candidatura Ambassador Fibonacci - ${form.nome}`
        : `Richiesta demo Fibonacci - ${form.nome}`,
    )

    const lines: string[] = ['Buongiorno,', '']

    if (isAmbassador) {
      lines.push(
        'desidero candidarmi come Ambassador del programma Fibonacci.',
        'Sono cliente attivo e vorrei portare colleghi della mia rete professionale.',
        '',
      )
    } else {
      lines.push('vorrei prenotare una demo di Fibonacci. Di seguito i miei dati:', '')
    }

    lines.push(
      `Nome e cognome: ${form.nome}`,
      `Specialità: ${specialtyLabel}`,
      `Email: ${form.email}`,
      `Telefono: ${form.telefono}`,
    )

    if (isAmbassador) {
      lines.push(
        `Ordine medici provincia: ${form.ordineProvincia}`,
        `Numero albo: ${form.numeroAlbo}`,
        `Partita IVA: ${form.partitaIva || 'non comunicata'}`,
        `Dimensione network: ${form.networkSize || 'non indicata'}`,
        '',
        'Motivazione candidatura:',
        form.motivazione || '(non compilata)',
      )
    }

    if (refCode) {
      lines.push('', `🔗 Segnalato da Ambassador: ${refCode}`)
    }

    lines.push('', 'Grazie,', form.nome, '', '---', `Richiesta inviata da fibonacci.it · intent=${intent}`)

    const body = encodeURIComponent(lines.join('\n'))
    const to = isAmbassador ? 'partners@fibonacci.it' : 'info@fibonacci.it'
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`

    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 400)
  }

  const isAmbassador = intent === 'ambassador'

  return (
    <section className="py-24 relative overflow-hidden" id="demo" style={{ background: 'var(--fg)' }}>
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-[1fr_auto] items-center gap-12">
        <div className="hidden md:block w-64 lg:w-80 order-2">
          <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Image
              src={PHOTOS.doctorFemaleStethoscope}
              alt="Dottoressa con stetoscopio - immagine illustrativa"
              fill
              unoptimized
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(27,46,75,0.6) 0%, transparent 50%)',
              }}
            />
          </div>
        </div>

        <div className="text-center md:text-left order-1">
          {isAmbassador ? (
            <p
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-3 px-3 py-1 rounded-full"
              style={{ color: '#f0d27a', background: 'rgba(240,210,122,0.12)' }}
            >
              <Award className="w-3.5 h-3.5" />
              Candidatura Ambassador
            </p>
          ) : (
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: '#f0d27a' }}
            >
              Inizia adesso
            </p>
          )}

          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white mb-4">
            {isAmbassador ? 'Diventa Ambassador Fibonacci' : 'Prenota la tua demo gratuita'}
          </h2>

          <p className="text-base mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {isAmbassador
              ? "Verifichiamo l'iscrizione albo + assenza conflitti deontologici entro 5 giorni lavorativi."
              : '30 minuti, nessun vincolo. Ti mostriamo Fibonacci nella tua specialità.'}
          </p>

          {refCode && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs mb-6"
              style={{ background: 'rgba(168,91,83,0.15)', border: '1px solid rgba(168,91,83,0.35)' }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#f0d27a' }} />
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                Sei stato segnalato da Ambassador <strong style={{ color: '#f0d27a' }}>{refCode}</strong>
              </span>
            </div>
          )}

          {sent ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <CheckCircle2 className="w-14 h-14" style={{ color: 'var(--accent)' }} />
              <h3 className="text-xl font-semibold text-white">Email pronta!</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }} className="max-w-md">
                Si è aperto il tuo client di posta con i dati precompilati. Conferma
                l&apos;invio e ti contatteremo entro {isAmbassador ? '5 giorni lavorativi' : '24 ore'}.
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
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

              {isAmbassador && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      placeholder="Ordine medici (provincia)"
                      value={form.ordineProvincia}
                      onChange={(e) => update('ordineProvincia', e.target.value)}
                      className="px-4 py-3.5 rounded-xl text-sm outline-none w-full"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                      }}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Numero iscrizione albo"
                      value={form.numeroAlbo}
                      onChange={(e) => update('numeroAlbo', e.target.value)}
                      className="px-4 py-3.5 rounded-xl text-sm outline-none w-full"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                      }}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="P.IVA (per fatturazione commissioni)"
                      value={form.partitaIva}
                      onChange={(e) => update('partitaIva', e.target.value)}
                      className="px-4 py-3.5 rounded-xl text-sm outline-none w-full"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                      }}
                    />
                    <select
                      value={form.networkSize}
                      onChange={(e) => update('networkSize', e.target.value)}
                      aria-label="Dimensione network professionale"
                      className="px-4 py-3.5 rounded-xl text-sm outline-none w-full"
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: form.networkSize ? 'white' : 'rgba(255,255,255,0.85)',
                      }}
                    >
                      <option value="">Network professionale</option>
                      <option value="1-10" style={{ color: 'var(--fg)', background: 'white' }}>
                        1-10 colleghi vicini
                      </option>
                      <option value="11-50" style={{ color: 'var(--fg)', background: 'white' }}>
                        11-50 colleghi
                      </option>
                      <option value="51-200" style={{ color: 'var(--fg)', background: 'white' }}>
                        51-200 (associazione locale)
                      </option>
                      <option value="200+" style={{ color: 'var(--fg)', background: 'white' }}>
                        200+ (network nazionale / gruppo)
                      </option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Perché vuoi diventare Ambassador? (opzionale)"
                    value={form.motivazione}
                    onChange={(e) => update('motivazione', e.target.value)}
                    rows={3}
                    className="px-4 py-3.5 rounded-xl text-sm outline-none w-full resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'white',
                    }}
                  />
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--accent)' }}
              >
                {loading
                  ? 'Apertura email…'
                  : isAmbassador
                    ? 'Invia candidatura Ambassador'
                    : 'Prenota demo gratuita'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Si aprirà il tuo client di posta con i dati precompilati verso{' '}
                <span style={{ color: 'rgba(255,255,255,0.95)' }}>
                  {isAmbassador ? 'partners@fibonacci.it' : 'info@fibonacci.it'}
                </span>
                . I tuoi dati non vengono ceduti a terzi. GDPR compliant.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
