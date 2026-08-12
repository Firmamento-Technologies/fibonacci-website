'use client'

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/site-config'

/**
 * L'assistente del sito: risponde su Fibonacci, e su nient'altro.
 *
 * ── QUATTRO SCELTE DA CONOSCERE PRIMA DI TOCCARE QUESTO FILE ───────────────
 *
 * 1. NON È UNA CHAT, ED È VOLUTO. Niente cronologia, niente «conversazione»:
 *    una domanda, una risposta, le pagine da cui viene. Una chat invita a
 *    trattarlo come un interlocutore generico — «e allora dimmi anche…» — che
 *    è esattamente l'uso che non deve avere. Senza memoria del giro
 *    precedente, ogni domanda viene giudicata da sola.
 *
 * 2. LE FONTI SONO SEMPRE MOSTRATE, E SONO LINK. Chi legge deve poter andare
 *    a controllare sulla pagina vera. È la stessa idea del verificatore di
 *    documenti: la risposta non chiede di essere creduta.
 *
 * 3. IL RIFIUTO NON È UN ERRORE. Quando la domanda è fuori tema il servizio
 *    risponde 200 con una spiegazione: qui si mostra come una risposta
 *    normale, senza allarmi rossi. Chi ha chiesto una cosa fuori tema non ha
 *    sbagliato a usare il sito.
 *
 * 4. NIENTE ESCE DA QUI SE NON LA DOMANDA. Nessuna misura, nessun
 *    identificativo, nessun salvataggio nel browser — coerente con
 *    l'autovalutazione e col verificatore, che non mandano niente.
 *
 * ⚠️ Le due garanzie chieste non stanno in questo file e non potrebbero: chi
 * scrive nel campo può mandare quello che vuole. Stanno **a valle**, nel
 * servizio (`EMR/services/assistente/`): la conoscenza è il solo corpus
 * estratto dal sito già pubblicato, e una guardia deterministica decide
 * *prima* di chiamare il modello. Qui c'è solo il campo di testo.
 *
 * Accessibilità: il campo ha una <label> vera; la risposta arriva in un
 * role="status" con aria-live="polite" e riceve il fuoco, perché altrimenti
 * chi non vede la pagina non ha modo di sapere che sotto è comparso qualcosa;
 * il pulsante non viene disabilitato per la convalida — dice cosa manca.
 */

const ESEMPI = [
  'Quanto costa?',
  'Dove sono conservati i dati dei pazienti?',
  'Le fotografie sono cifrate?',
  'Quanto ci vuole a migrare dal gestionale che uso adesso?',
] as const

type Esito = { risposta: string; fonti: string[] }

/**
 * Il grassetto del modello, reso davvero grassetto.
 *
 * 🔴 **Visto in una schermata del sito in rete, il 2026-08-12**: la risposta
 * sul listino compariva come *«Il piano \*\*Studio\*\* (279 €/mese)»* — gli
 * asterischi a video. Il modello risponde in markdown e qui si stampava il
 * testo grezzo.
 *
 * ⛔ **Non si usa un interprete markdown e non si tocca `innerHTML`.** Questo è
 * testo generato da un modello su una pagina pubblica: farlo diventare HTML
 * aprirebbe una via che non ha nessun motivo di esistere per ottenere due
 * parole in neretto. Qui si spezza sulle coppie di `**` e si emettono elementi
 * React — che il browser non può interpretare come marcatura, per costruzione.
 *
 * Le forme non gestite (elenchi, corsivo, titoli) restano testo: il prompt
 * chiede prosa, e se il modello disobbedisce si legge comunque.
 */
export function conGrassetto(testo: string) {
  return testo.split(/\*\*(.+?)\*\*/g).map((pezzo, i) =>
    i % 2 === 1 ? <strong key={i}>{pezzo}</strong> : pezzo,
  )
}

export function Assistente() {
  const [domanda, setDomanda] = useState('')
  const [esito, setEsito] = useState<Esito | null>(null)
  const [inCorso, setInCorso] = useState(false)
  const [problema, setProblema] = useState<string | null>(null)
  const idCampo = useId()
  const campoRef = useRef<HTMLTextAreaElement>(null)
  const esitoRef = useRef<HTMLDivElement>(null)

  async function chiedi(testo: string) {
    const pulita = testo.trim()
    if (!pulita) {
      setProblema('Scrivi una domanda prima di inviare.')
      campoRef.current?.focus()
      return
    }
    setProblema(null)
    setInCorso(true)
    setEsito(null)
    try {
      const r = await fetch('/assistente/domanda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        /* `pagina`: il percorso che chi chiede ha sotto gli occhi. Quella
           pagina entra sempre fra gli estratti — misurato prima di mettere il
           widget sul listino: su dodici domande da prezzi `/prezzi/` ci
           finiva **7 volte su 12**, e le mancanti erano proprio quelle che si
           fanno guardando il listino. Con l'indizio, 12 su 12.
           ⚠️ Non è un identificativo e non traccia niente: è l'indirizzo della
           pagina pubblica su cui il widget è disegnato, che il server già
           conosce. Il server lo accetta solo se combacia **esattamente** con
           una pagina del corpus. */
        body: JSON.stringify({ domanda: pulita, pagina: window.location.pathname }),
      })
      const dati = (await r.json()) as Partial<Esito>
      /* ⚠️ Anche 429 e 503 portano un testo sensato dal servizio: si mostra
         quello. Sostituirlo con un «errore» generico butterebbe via l'unica
         informazione utile — per esempio che basta riprovare fra poco. */
      setEsito({ risposta: dati.risposta ?? 'Non ho una risposta da darti.', fonti: dati.fonti ?? [] })
    } catch {
      setProblema(
        CONTACT_EMAIL
          ? `Non riesco a raggiungere l'assistente. Scrivi a ${CONTACT_EMAIL} e ti risponde una persona.`
          : "Non riesco a raggiungere l'assistente. Riprova fra poco.",
      )
    } finally {
      setInCorso(false)
      window.setTimeout(() => esitoRef.current?.focus(), 60)
    }
  }

  return (
    /* ⛔ `data-fuori-corpus`: questo blocco NON entra nella conoscenza
       dell'assistente. Senza, il widget si legge da solo — le sue etichette e
       le sue domande di esempio finivano nel corpus (**520 caratteri** dentro
       `/domande/`, e la scritta del pulsante *«Quanto costa?»* contava come
       un'occorrenza di «costa» su una pagina che il prezzo non lo dice).
       Con il widget su due pagine il conto raddoppiava.
       ⇒ Stesso principio per cui si estrae solo `<main>`: ciò che serve a
       **usare** il sito non è ciò che il sito **dice**. Vedi
       `scripts/corpus-assistente.mjs`. */
    <div data-fuori-corpus className="mx-auto max-w-[46rem] text-left">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void chiedi(domanda)
        }}
      >
        <label
          htmlFor={idCampo}
          className="block text-[0.9375rem] font-medium"
          style={{ color: 'var(--fg)' }}
        >
          La tua domanda su Fibonacci
        </label>
        <p
          id={`${idCampo}-aiuto`}
          className="mt-[var(--s-5)] text-[0.9375rem]"
          style={{ color: 'var(--fg-muted)' }}
        >
          Risponde leggendo <strong>solo le pagine di questo sito</strong>, e cita quali ha usato.
          Non conosce nulla che non sia già pubblicato qui, e non dà indicazioni cliniche.
        </p>

        <textarea
          id={idCampo}
          ref={campoRef}
          rows={3}
          maxLength={500}
          value={domanda}
          onChange={(e) => setDomanda(e.target.value)}
          onKeyDown={(e) => {
            /* Invio manda, Maiusc+Invio va a capo: è la convenzione che chi
               scrive in un campo del genere si aspetta. */
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void chiedi(domanda)
            }
          }}
          aria-describedby={`${idCampo}-aiuto`}
          placeholder="Per esempio: i dati restano in Europa?"
          className="mt-[var(--s-13)] w-full rounded-[var(--s-8)] p-[var(--s-13)] text-[1.0625rem]"
          style={{
            background: 'var(--paper)',
            border: '1px solid var(--rule-strong)',
            color: 'var(--fg)',
            resize: 'vertical',
          }}
        />

        <div className="mt-[var(--s-13)] flex flex-wrap items-center gap-[var(--s-13)]">
          <button
            type="submit"
            className="rounded-[var(--s-8)] px-[var(--s-21)] py-[var(--s-13)] text-[1rem] font-medium"
            style={{ background: 'var(--accent)', color: 'var(--on-ink)' }}
          >
            {inCorso ? 'Sto leggendo il sito…' : 'Chiedi'}
          </button>
          {/* ⚠️ `--fg-muted` e non `--fg-faint`, e il motivo è scritto accanto al
              token in `globals.css`: **«terziario, solo ≥16px — 4.6:1 su --bg»**.
              Qui il testo è a **14px** e il fondo è `--bg-sunk`, più scuro di
              `--bg` ⇒ misurato dal collaudo: **4,41 contro 4,5 richiesti**,
              violazione WCAG *serious* su tutte e tre le pagine che montano il
              widget. Il vincolo del token era scritto e l'ho rotto in entrambe
              le metà. */}
          <span className="text-[0.875rem]" style={{ color: 'var(--fg-muted)' }}>
            {domanda.length}/500
          </span>
        </div>

        {problema && (
          <p role="alert" className="mt-[var(--s-13)] text-[0.9375rem]" style={{ color: 'var(--accent-ink)' }}>
            {problema}
          </p>
        )}
      </form>

      {/* Gli esempi non sono decorazione: dicono in un colpo d'occhio di che
          cosa si può parlare, che è più chiaro di una regola scritta. */}
      <div className="mt-[var(--s-21)] flex flex-wrap gap-[var(--s-8)]">
        {ESEMPI.map((e, i) => (
          <button
            key={e}
            type="button"
            onClick={() => {
              setDomanda(e)
              void chiedi(e)
            }}
            /* ⚠️ Il quarto esempio sparisce sotto i 640px, e non è un ritocco
               estetico: è il più lungo e su 375px occupa una riga da solo.
               Misurato dal collaudo — la sezione arrivava a **778px sulla home e
               802 sul listino** contro i **771** di una schermata utile, e
               `altezza-pagine.mjs` contava due passi alti in più (4 contro i 2
               della cricca). Una riga di pastiglie vale ~40px: bastava quella.
               ⛔ Non si comprime il contenitore, si toglie contenuto — è
               scritto nel presidio stesso. */
            className={`rounded-[var(--s-21)] px-[var(--s-13)] py-[var(--s-5)] text-[0.875rem]${
              i === ESEMPI.length - 1 ? ' hidden sm:inline-block' : ''
            }`}
            style={{
              background: 'var(--accent-wash)',
              color: 'var(--accent-ink)',
              border: '1px solid var(--rule)',
            }}
          >
            {e}
          </button>
        ))}
      </div>

      <div
        ref={esitoRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="mt-[var(--s-21)]"
        style={{ outline: 'none' }}
      >
        {esito && (
          <div
            className="rounded-[var(--s-8)] p-[var(--s-21)]"
            style={{ background: 'var(--paper)', border: '1px solid var(--rule)' }}
          >
            <p className="text-[1.0625rem] whitespace-pre-line" style={{ color: 'var(--fg)' }}>
              {conGrassetto(esito.risposta)}
            </p>
            {esito.fonti.length > 0 && (
              <p className="mt-[var(--s-13)] text-[0.875rem]" style={{ color: 'var(--fg-muted)' }}>
                Letto da:{' '}
                {esito.fonti.map((f, i) => (
                  <span key={f}>
                    {i > 0 && ', '}
                    <Link href={f} style={{ color: 'var(--accent-deep)' }}>
                      {f}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
