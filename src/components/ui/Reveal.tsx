'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode, ElementType } from 'react'

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

const SPOSTAMENTO: Record<Direzione, { x: number; y: number }> = {
  su: { x: 0, y: 21 },
  sinistra: { x: -21, y: 0 },
  destra: { x: 21, y: 0 },
  nessuna: { x: 0, y: 0 },
}

/**
 * Comparsa allo scorrimento.
 *
 * Il mestiere di questo movimento è uno solo: far capire che il contenuto sta
 * arrivando adesso, così l'occhio sa dove guardare. Non decora. Per questo
 * l'ampiezza è piccola (21px, un gradino della scala) e la durata breve.
 *
 * Con `prefers-reduced-motion` il contenuto compare e basta: nessuna
 * traslazione, nessuna dissolvenza scaglionata. Per chi ha disturbi
 * vestibolari il movimento legato allo scorrimento provoca nausea e vertigini,
 * non fastidio, quindi qui non è una raffinatezza opzionale.
 *
 * `once: true` è deliberato: un elemento che si rianima ogni volta che
 * riattraversa la finestra sembra rotto.
 */
export function Reveal({ children, ritardo = 0, da = 'su', className, as = 'div' }: RevealProps) {
  const menoMovimento = useReducedMotion()
  const Componente = motion[as as keyof typeof motion] as typeof motion.div

  if (menoMovimento) {
    const Statico = as as ElementType
    return <Statico className={className}>{children}</Statico>
  }

  const { x, y } = SPOSTAMENTO[da]
  const varianti: Variants = {
    nascosto: { opacity: 0, x, y },
    visibile: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.62, delay: ritardo, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <Componente
      className={className}
      variants={varianti}
      initial="nascosto"
      whileInView="visibile"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      {children}
    </Componente>
  )
}

/**
 * Contenitore che scagliona i figli diretti avvolti in <RevealFiglio>.
 * Evita di dover calcolare a mano il ritardo di ogni elemento di una griglia.
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
  const menoMovimento = useReducedMotion()
  if (menoMovimento) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="nascosto"
      whileInView="visibile"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ visibile: { transition: { staggerChildren: passo } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealFiglio({ children, className }: { children: ReactNode; className?: string }) {
  const menoMovimento = useReducedMotion()
  if (menoMovimento) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        nascosto: { opacity: 0, y: 21 },
        visibile: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
