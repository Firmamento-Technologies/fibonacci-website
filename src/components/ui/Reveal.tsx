'use client'

import { useEffect, useRef, type ReactNode, type ElementType } from 'react'

type Direzione = 'su' | 'sinistra' | 'destra' | 'nessuna'

interface RevealProps {
  children: ReactNode
  /** Ritardo in secondi. Usalo per scaglionare elementi fratelli. */
  ritardo?: number
  /** Da dove entra. 'nessuna' fa solo dissolvenza. */
  da?: Direzione
  className?: string
  as?: ElementType
}

/**
 * Comparsa allo scorrimento.
 *
 * Il mestiere di questo movimento è uno solo: far capire che il contenuto sta
 * arrivando adesso, così l'occhio sa dove guardare. Non decora. Per questo
 * l'ampiezza è piccola (21px, un gradino della scala) e la durata breve.
 *
 * ⚠️ PERCHÉ NON USA PIÙ framer-motion (riscritto il 2026-08-09).
 * La versione precedente dichiarava lo stato `nascosto` come `initial`, e
 * framer-motion lo scriveva **in linea nell'HTML generato**:
 * `style="opacity:0;transform:translateY(21px)"`. Su un export statico —
 * costruito apposta per servire HTML che funziona da solo — il risultato era
 * che **il 78 % del testo della home, il 91 % di `/prezzi` e l'86 % di
 * `/sicurezza-e-dati` stava nel documento ed era invisibile** finché React non
 * idratava. E `/domande`, nello stesso codice, era a **0 %**: la prova che non
 * era un vincolo tecnico ma una disomogeneità.
 * ([[sintesi-analisi-ui-ux-2026-08-09]] §S3)
 *
 * Ora lo stato di partenza è **visibile** e il nascondimento vive in CSS sotto
 * `@media (scripting: enabled)` — cioè si applica **solo se il JavaScript è
 * vivo**, perché è il JavaScript a doverlo poi togliere. Senza JavaScript la
 * pagina si legge tutta; con il JavaScript l'effetto è identico a prima.
 * ⛔ Il primo tentativo usava uno `<script>` in testa che accendeva una classe
 * `html.anim`: produceva un errore di idratazione, perché le estensioni del
 * browser iniettano i propri script in `<head>` e spostano il nostro.
 *
 * Tre conseguenze, tutte volute:
 * · `prefers-reduced-motion` è gestito **in CSS** (`globals.css`), quindi vale
 *   anche a JavaScript spento. Prima dipendeva da un hook di React, cioè dalla
 *   stessa cosa che poteva non arrivare.
 * · Niente più `motion` su queste pagine ⇒ meno codice da scaricare.
 * · L'elemento resta un candidato LCP dal primo fotogramma: web.dev esclude
 *   dai candidati gli elementi a opacità zero, ed era il motivo dei 5,8 s.
 *
 * `once`: un elemento che si rianima ogni volta che riattraversa la finestra
 * sembra rotto, quindi l'osservatore smette di guardarlo appena è entrato.
 */
export function Reveal({ children, ritardo = 0, da = 'su', className, as = 'div' }: RevealProps) {
  const rif = useRivelaAllEntrata(ritardo)
  const Componente = as as ElementType

  return (
    <Componente
      ref={rif}
      className={[className, 'rivela', da !== 'nessuna' && `rivela-${da}`].filter(Boolean).join(' ')}
    >
      {children}
    </Componente>
  )
}

/**
 * Contenitore che scagliona gli elementi `.rivela` che contiene.
 * Evita di dover calcolare a mano il ritardo di ogni elemento di una griglia.
 * Funziona sia con `<RevealFiglio>` sia con elementi che portano da sé le
 * classi `rivela rivela-su` — è il caso degli anelli della catena nel Sigillo,
 * che devono restare `<li>` dentro un `<ol>` per ragioni semantiche.
 */
export function RevealGruppo({
  children,
  className,
  passo = 0.08,
}: {
  children: ReactNode
  className?: string
  passo?: number
}) {
  const rif = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rif.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const osservatore = new IntersectionObserver(
      ([voce]) => {
        if (!voce.isIntersecting) return
        // Lo scaglionamento è un ritardo per ciascun figlio, applicato al
        // momento dell'entrata: non serve una macchina a stati.
        // ⚠️ `:scope > .rivela` (figli DIRETTI) è stato un difetto: nel
        // `Sigillo` gli anelli della catena stanno dentro un `<ol>`, quindi
        // sono nipoti e non venivano mai trovati — la catena restava a
        // opacità zero per sempre. Trovato eseguendo: 0 anelli su 4 entrati.
        // Si cercano i discendenti, escludendo quelli di un eventuale gruppo
        // annidato, che ha un suo osservatore.
        const figli = [...el.querySelectorAll<HTMLElement>('.rivela')].filter(
          (f) => f.closest('[data-rivela-gruppo]') === el,
        )
        figli.forEach((f, i) => {
          f.style.transitionDelay = `${i * passo}s`
          f.classList.add('dentro')
        })
        el.classList.add('dentro')
        osservatore.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    osservatore.observe(el)
    return () => osservatore.disconnect()
  }, [passo])

  return (
    <div ref={rif} data-rivela-gruppo="" className={className}>
      {children}
    </div>
  )
}

export function RevealFiglio({ children, className }: { children: ReactNode; className?: string }) {
  // Nessun osservatore proprio: è il gruppo che decide quando entrano, così lo
  // scaglionamento resta un fatto solo.
  return <div className={[className, 'rivela', 'rivela-su'].filter(Boolean).join(' ')}>{children}</div>
}

/** Aggiunge `.dentro` quando l'elemento entra nella finestra, una volta sola. */
function useRivelaAllEntrata(ritardo: number) {
  const rif = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = rif.current
    if (!el) return
    // Senza IntersectionObserver (o con JavaScript a metà) il contenuto deve
    // restare visibile, non nascosto per sempre: si entra e basta.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('dentro')
      return
    }
    if (ritardo) el.style.transitionDelay = `${ritardo}s`
    const osservatore = new IntersectionObserver(
      ([voce]) => {
        if (!voce.isIntersecting) return
        el.classList.add('dentro')
        osservatore.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    osservatore.observe(el)
    return () => osservatore.disconnect()
  }, [ritardo])

  return rif
}
