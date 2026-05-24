'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react'

interface ServiceStatus {
  key: string
  name: string
  description: string
  url: string
  publicUrl: string
  state: 'checking' | 'up' | 'down'
}

const SERVICES: Omit<ServiceStatus, 'state'>[] = [
  {
    key: 'app',
    name: 'App Fibonacci',
    description: 'Frontend principale React/Vite (apps/web)',
    url: 'https://82.25.101.118.nip.io/',
    publicUrl: 'https://82.25.101.118.nip.io',
  },
  {
    key: 'api',
    name: 'API Medplum FHIR R4',
    description: 'Backend dati clinici FHIR + AuthN/AuthZ',
    url: 'https://api.82.25.101.118.nip.io/healthcheck',
    publicUrl: 'https://api.82.25.101.118.nip.io/healthcheck',
  },
  {
    key: 'demo',
    name: 'Demo live',
    description: 'Account medico fittizio per visitor del sito',
    url: 'https://82.25.101.118.nip.io/demo',
    publicUrl: 'https://82.25.101.118.nip.io/demo',
  },
  {
    key: 'pdf',
    name: 'PDF signing service',
    description: 'Generazione PDF/A-3b firmati eIDAS per consensi',
    url: 'https://pdf.82.25.101.118.nip.io/',
    publicUrl: 'https://pdf.82.25.101.118.nip.io',
  },
  {
    key: 'transcriber',
    name: 'Dettatura AI',
    description: 'Streaming STT WhisperLive + Voxtral 24B',
    url: 'https://transcriber.82.25.101.118.nip.io/',
    publicUrl: 'https://transcriber.82.25.101.118.nip.io',
  },
]

async function probe(url: string): Promise<'up' | 'down'> {
  // mode:'no-cors' ci permette di sapere se la chiamata e' arrivata
  // anche se non possiamo leggere la response (CORS). Il fetch va in errore
  // solo per fail di rete o timeout. Sufficiente come liveness check pubblico.
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    await fetch(url, { mode: 'no-cors', signal: controller.signal })
    clearTimeout(timer)
    return 'up'
  } catch {
    return 'down'
  }
}

export function StatusGrid() {
  const [services, setServices] = useState<ServiceStatus[]>(
    SERVICES.map((s) => ({ ...s, state: 'checking' })),
  )
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  useEffect(() => {
    let cancelled = false

    async function checkAll() {
      const results = await Promise.all(
        SERVICES.map(async (s) => ({ ...s, state: await probe(s.url) })),
      )
      if (!cancelled) {
        setServices(results)
        setLastCheck(new Date())
      }
    }

    checkAll()
    const interval = setInterval(checkAll, 30_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const allUp = services.every((s) => s.state === 'up')
  const someDown = services.some((s) => s.state === 'down')

  return (
    <>
      <div
        className="rounded-2xl p-6 mb-8"
        style={{
          background: allUp ? '#e8f5e9' : someDown ? '#ffebee' : 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          {allUp ? (
            <>
              <CheckCircle2 className="w-7 h-7" style={{ color: '#16a34a' }} />
              <div>
                <p className="font-semibold" style={{ color: '#15803d' }}>
                  Tutti i servizi operativi
                </p>
                <p className="text-xs" style={{ color: '#15803d', opacity: 0.8 }}>
                  Sistema in piena funzione
                </p>
              </div>
            </>
          ) : someDown ? (
            <>
              <XCircle className="w-7 h-7" style={{ color: '#dc2626' }} />
              <div>
                <p className="font-semibold" style={{ color: '#b91c1c' }}>
                  Anomalia rilevata
                </p>
                <p className="text-xs" style={{ color: '#b91c1c', opacity: 0.8 }}>
                  Stiamo indagando. Per emergenze: supporto@fibonacci.it
                </p>
              </div>
            </>
          ) : (
            <>
              <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--accent)' }} />
              <div>
                <p className="font-semibold" style={{ color: 'var(--fg)' }}>
                  Verifica in corso…
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {services.map((s) => (
          <div
            key={s.key}
            className="rounded-xl p-5 flex items-center justify-between gap-4"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    s.state === 'up'
                      ? '#dcfce7'
                      : s.state === 'down'
                        ? '#fee2e2'
                        : 'var(--accent-light)',
                }}
              >
                {s.state === 'up' ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                ) : s.state === 'down' ? (
                  <XCircle className="w-5 h-5" style={{ color: '#dc2626' }} />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--accent)' }} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--fg)' }}>
                  {s.name}
                </h3>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {s.description}
                </p>
              </div>
            </div>
            <a
              href={s.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Apri
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>

      {lastCheck && (
        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
          Ultimo controllo:{' '}
          {lastCheck.toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}{' '}
          · Auto-refresh ogni 30s · Verifica eseguita dal tuo browser
        </p>
      )}
    </>
  )
}
