'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { conGrassetto } from '@/components/Assistente'
import { CONTACT_EMAIL } from '@/lib/site-config'

/**
 * Il pallino in basso a destra che apre l'assistente in un pannello laterale.
 *
 * Chiede allo stesso servizio del widget nel testo (`/assistente/domanda`) e
 * mantiene le stesse garanzie: le fonti sono sempre mostrate e sono link,
 * niente esce di qui se non la domanda, niente viene salvato nel browser.
 *
 * ⚠️ **Le risposte non si costruiscono l'una sull'altra.** In pannello i turni
 * si vedono impilati, ma ogni domanda parte pulita: il servizio non riceve i
 * turni precedenti, per scelta (`Assistente.tsx`, punto 1). Chi scrive «e per
 * i prezzi?» dopo un'altra domanda deve nominare l'argomento.
 *
 * ⚠️ Sotto i 768px il pannello va a tutto schermo: a lato non ci sta, e il
 * fondo dello schermo e' gia' occupato da `.freccia-avanti` (la barra che
 * porta alla tappa successiva). Il pallino sale sopra quella barra.
 */

interface Turno {
  domanda: string
  risposta?: string
  fonti?: string[]
  errore?: string
}

export function AssistenteFisso() {
  const [aperto, setAperto] = useState(false)
  const [testo, setTesto] = useState('')
  const [inCorso, setInCorso] = useState(false)
  const [turni, setTurni] = useState<Turno[]>([])
  const pallino = useRef<HTMLButtonElement>(null)
  const campo = useRef<HTMLTextAreaElement>(null)
  const fondo = useRef<HTMLDivElement>(null)

  const chiudi = useCallback(() => {
    setAperto(false)
    pallino.current?.focus()
  }, [])

  useEffect(() => {
    if (!aperto) return
    campo.current?.focus()
    const daTastiera = (e: KeyboardEvent) => {
      if (e.key === 'Escape') chiudi()
    }
    document.addEventListener('keydown', daTastiera)
    return () => document.removeEventListener('keydown', daTastiera)
  }, [aperto, chiudi])

  useEffect(() => {
    fondo.current?.scrollIntoView({ block: 'end' })
  }, [turni, inCorso])

  async function invia(e: React.FormEvent) {
    e.preventDefault()
    const domanda = testo.trim()
    if (!domanda || inCorso) return
    setTesto('')
    setTurni((t) => [...t, { domanda }])
    setInCorso(true)
    try {
      const r = await fetch('/assistente/domanda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // `pagina`: l'indirizzo pubblico che chi chiede ha sotto gli occhi.
        // Non e' un identificativo — il server lo accetta solo se combacia
        // con una pagina del corpus. Stesso contratto del widget nel testo.
        body: JSON.stringify({ domanda, pagina: window.location.pathname }),
      })
      const dati = (await r.json()) as { risposta?: string; fonti?: string[] }
      setTurni((t) =>
        t.map((turno, i) =>
          i === t.length - 1
            ? {
                ...turno,
                risposta: dati.risposta ?? 'Non ho una risposta da darti.',
                fonti: dati.fonti ?? [],
              }
            : turno,
        ),
      )
    } catch {
      setTurni((t) =>
        t.map((turno, i) =>
          i === t.length - 1
            ? {
                ...turno,
                errore: CONTACT_EMAIL
                  ? `Non riesco a raggiungere l’assistente. Scrivi a ${CONTACT_EMAIL} e ti risponde una persona.`
                  : 'Non riesco a raggiungere l’assistente. Riprova fra poco.',
              }
            : turno,
        ),
      )
    } finally {
      setInCorso(false)
    }
  }

  return (
    /* ⛔ `data-fuori-corpus`: questo blocco NON entra nella conoscenza
       dell'assistente — altrimenti le sue etichette si leggerebbero da sole.
       Vedi `scripts/corpus-assistente.mjs`. */
    <div data-fuori-corpus>
      {aperto && (
        <aside
          role="dialog"
          aria-modal="false"
          aria-label="Assistente di Fibonacci"
          className="chat-assistente"
        >
          <header className="chat-assistente__testa">
            <span className="chat-assistente__titolo">
              <Faccina piccola /> Assistente
            </span>
            <button
              type="button"
              onClick={chiudi}
              aria-label="Chiudi l’assistente"
              className="chat-assistente__chiudi"
            >
              ✕
            </button>
          </header>

          <div className="chat-assistente__corpo">
            {turni.length === 0 && (
              <p className="chat-assistente__benvenuto">
                Chiedimi di Fibonacci: prezzi, funzioni, dove stanno i dati.
                <br />
                Rispondo solo da queste pagine, e ti dico da quali.
              </p>
            )}

            {turni.map((t, i) => (
              <div key={i}>
                <p className="chat-assistente__domanda">{t.domanda}</p>
                {t.risposta && (
                  <div className="chat-assistente__risposta">
                    {/* Il modello risponde in markdown: senza questo a
                        schermo si leggono gli asterischi. ⛔ Non riscrivo il
                        formattatore — e' gia' in `Assistente.tsx`. */}
                    <p>{conGrassetto(t.risposta)}</p>
                    {!!t.fonti?.length && (
                      <p className="chat-assistente__fonti">
                        Da:{' '}
                        {t.fonti.map((f, k) => (
                          <span key={f}>
                            {k > 0 && ' · '}
                            <Link href={f} onClick={chiudi}>
                              {f}
                            </Link>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                )}
                {t.errore && <p className="chat-assistente__errore">{t.errore}</p>}
              </div>
            ))}

            {inCorso && (
              <p className="chat-assistente__risposta chat-assistente__attesa" role="status">
                sto leggendo le pagine…
              </p>
            )}
            <div ref={fondo} />
          </div>

          <form onSubmit={invia} className="chat-assistente__piede">
            <label htmlFor="chat-assistente-campo" className="sr-only">
              Scrivi la tua domanda
            </label>
            <textarea
              id="chat-assistente-campo"
              ref={campo}
              rows={1}
              value={testo}
              onChange={(e) => setTesto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) invia(e)
              }}
              placeholder="Scrivi una domanda…"
            />
            <button type="submit" disabled={inCorso} aria-label="Invia la domanda">
              ↑
            </button>
          </form>
        </aside>
      )}

      <button
        ref={pallino}
        type="button"
        onClick={() => (aperto ? chiudi() : setAperto(true))}
        aria-expanded={aperto}
        aria-label={aperto ? 'Chiudi l’assistente' : 'Apri l’assistente'}
        className="pallino-assistente"
      >
        {aperto ? <span aria-hidden="true">✕</span> : <Faccina />}
      </button>
    </div>
  )
}

/**
 * La faccina. Gli occhi sbattono ogni pochi secondi — ⚠️ l'animazione e'
 * spenta da `prefers-reduced-motion` (vedi `globals.css`), non e' decorazione
 * che si impone.
 */
function Faccina({ piccola = false }: { piccola?: boolean }) {
  const lato = piccola ? 18 : 28
  return (
    <svg
      width={lato}
      height={lato}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="faccina"
    >
      <circle cx="16" cy="16" r="15" className="faccina__testa" />
      <g className="faccina__occhi">
        <circle cx="11" cy="13" r="2.2" />
        <circle cx="21" cy="13" r="2.2" />
      </g>
      <path
        d="M10.5 20c1.6 2 3.4 3 5.5 3s3.9-1 5.5-3"
        className="faccina__bocca"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
