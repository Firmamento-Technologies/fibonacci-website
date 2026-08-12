'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Assistente } from '@/components/Assistente'

/**
 * L'assistente, raggiungibile da OGNI pagina.
 *
 * Prima stava in due punti soli — in fondo a `/domande` e dentro `/prezzi` —
 * e chi non scorreva fin laggiù non sapeva che esistesse. Qui c'è un pulsante
 * fisso che apre lo stesso identico componente: ⛔ nessuna seconda
 * implementazione, nessun secondo prompt, nessuna seconda garanzia da tenere
 * allineata. Se cambia `Assistente.tsx`, cambia anche questo.
 *
 * ── TRE COSE DECISE, E IL PERCHÉ ──────────────────────────────────────────
 *
 * 1. ⚠️ **NON in basso a destra su telefono.** Sotto i 768px il sito ha già
 *    un elemento agganciato al fondo: `.freccia-avanti`, la barra che porta
 *    alla tappa successiva (`position: sticky; bottom: 0; z-index: 2`, in
 *    `globals.css`). Un pulsante flottante lì sopra coprirebbe **il comando
 *    principale di navigazione del sito**. Perciò su schermo stretto il
 *    pulsante sale sopra quella barra, e sta comunque a `z-index` maggiore.
 *    (È lo stesso difetto che nell'applicazione copre un contenuto — lì è un
 *    badge, qui sarebbe la freccia: peggio.)
 *
 * 2. **Le due collocazioni nel testo RESTANO.** In `/domande` il campo è
 *    dentro «Manca la tua?» e in `/prezzi` risponde alle domande sul listino:
 *    sono contenuto della pagina, con un titolo che le introduce. Toglierle
 *    per «non duplicare» lascerebbe due sezioni vuote. Il pulsante è una
 *    porta sempre aperta, non una copia di quel contenuto.
 *
 * 3. **Non si apre da solo.** Nessun invito automatico dopo N secondi:
 *    è un pannello che si apre quando qualcuno lo chiede, e si chiude con
 *    Esc o cliccando fuori. Chi sta leggendo non viene interrotto.
 *
 * Accessibilità: il pulsante dichiara `aria-expanded`; il pannello è un
 * `role="dialog"` con `aria-modal`, riceve il fuoco all'apertura e lo
 * restituisce al pulsante alla chiusura — altrimenti chi naviga da tastiera
 * si ritrova all'inizio della pagina.
 */
export function AssistenteFisso() {
  const [aperto, setAperto] = useState(false)
  const idPannello = useId()
  const pulsante = useRef<HTMLButtonElement>(null)
  const pannello = useRef<HTMLDivElement>(null)

  const chiudi = useCallback(() => {
    setAperto(false)
    // Il fuoco torna da dove è partito: senza, si riparte dal <body>.
    pulsante.current?.focus()
  }, [])

  useEffect(() => {
    if (!aperto) return
    // Il fuoco entra nel pannello: il campo è il primo elemento utile.
    const campo = pannello.current?.querySelector<HTMLElement>('textarea, input, button')
    campo?.focus()

    const daTastiera = (e: KeyboardEvent) => {
      if (e.key === 'Escape') chiudi()
    }
    const fuori = (e: MouseEvent) => {
      const bersaglio = e.target as Node
      if (
        pannello.current &&
        !pannello.current.contains(bersaglio) &&
        !pulsante.current?.contains(bersaglio)
      ) {
        setAperto(false)
      }
    }
    document.addEventListener('keydown', daTastiera)
    document.addEventListener('mousedown', fuori)
    return () => {
      document.removeEventListener('keydown', daTastiera)
      document.removeEventListener('mousedown', fuori)
    }
  }, [aperto, chiudi])

  return (
    <div className="assistente-fisso">
      {aperto && (
        <div
          ref={pannello}
          id={idPannello}
          role="dialog"
          aria-modal="true"
          aria-label="Chiedi all’assistente"
          className="assistente-fisso__pannello"
        >
          <div className="assistente-fisso__testa">
            <strong>Chiedi all’assistente</strong>
            <button
              type="button"
              onClick={chiudi}
              className="assistente-fisso__chiudi"
              aria-label="Chiudi l’assistente"
            >
              ✕
            </button>
          </div>
          <Assistente />
        </div>
      )}

      <button
        ref={pulsante}
        type="button"
        onClick={() => (aperto ? chiudi() : setAperto(true))}
        aria-expanded={aperto}
        aria-controls={aperto ? idPannello : undefined}
        className="assistente-fisso__pulsante"
      >
        {aperto ? 'Chiudi' : 'Chiedi all’assistente'}
      </button>
    </div>
  )
}
