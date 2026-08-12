'use client'

import { useEffect, useState } from 'react'
import type { VoceIndice } from '@/lib/ancore'

/* «In questa pagina»: i titoli della guida aperta, con quello in lettura
 * evidenziato.
 *
 * ⚠️ I link sono ancore vere, rese nell'HTML: funzionano a script spenti. Il
 * JavaScript aggiunge SOLO l'evidenziazione. Se domani si rompe, l'indice
 * resta un indice — non diventa una lista di link morti.
 *
 * ⛔ Niente IntersectionObserver: qui la domanda non è «quali titoli si
 * vedono» ma «qual è l'ultimo titolo superato», che è un'altra cosa. Con
 * l'osservatore, una sezione lunga più della finestra non ha nessun titolo in
 * vista e l'evidenziazione se ne andava a metà lettura — proprio nelle guide
 * lunghe, cioè quelle in cui serve. Qui si misura la posizione: l'ultimo
 * titolo che sta sopra la soglia.
 */
export function InQuestaPagina({ voci }: { voci: VoceIndice[] }) {
  const [attivo, setAttivo] = useState<string>('')

  useEffect(() => {
    if (voci.length === 0) return

    /* La soglia è appena sotto l'intestazione fissa (91px): un titolo che le
       è passato sotto è un titolo che sto leggendo. */
    const SOGLIA = 120
    let programmato = false

    const misura = () => {
      programmato = false
      let corrente = ''
      for (const v of voci) {
        const el = document.getElementById(v.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= SOGLIA) corrente = v.id
        else break
      }
      /* In fondo alla pagina l'ultima sezione può non superare mai la soglia
         (è corta e la pagina non scorre più): senza questo, l'ultima voce non
         si accende mai. */
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
        corrente = voci[voci.length - 1].id
      }
      setAttivo(corrente)
    }

    const suScorrimento = () => {
      if (programmato) return
      programmato = true
      requestAnimationFrame(misura)
    }

    misura()
    window.addEventListener('scroll', suScorrimento, { passive: true })
    window.addEventListener('resize', suScorrimento, { passive: true })
    return () => {
      window.removeEventListener('scroll', suScorrimento)
      window.removeEventListener('resize', suScorrimento)
    }
  }, [voci])

  if (voci.length === 0) return null

  return (
    <nav className="manuale__contesto" aria-label="In questa pagina">
      <p className="manuale__contesto-titolo">In questa pagina</p>
      <ul>
        {voci.map((v) => (
          <li key={v.id} data-livello={v.livello}>
            <a
              href={`#${v.id}`}
              data-corrente={v.id === attivo ? 'si' : undefined}
              aria-current={v.id === attivo ? 'true' : undefined}
            >
              {v.testo}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
