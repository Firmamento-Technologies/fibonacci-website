'use client'

import { t } from '@/lib/testo'
import { useState, useRef, useId } from 'react'
import Link from 'next/link'
import { DOMANDE_AUTO, type DomandaAuto } from '@/lib/autovalutazione'

/**
 * Autovalutazione della documentazione.
 *
 * TRE SCELTE CHE VALE LA PENA CONOSCERE PRIMA DI TOCCARE QUESTO FILE
 *
 * 1. NIENTE ESCE DAL BROWSER. Nessuna chiamata, nessun salvataggio, nessuna
 *    misura. È lo stesso patto del verificatore di documenti, ed è coerente
 *    con un sito il cui argomento è che i documenti si leggono senza
 *    compilare niente. Se un giorno servisse una statistica, va chiesta
 *    esplicitamente e non dedotta di nascosto.
 *
 * 2. L'ESITO NON STA DIETRO UN MODULO. La forma standard di questo strumento
 *    (il calcolatore che raccoglie l'email prima di mostrare il risultato)
 *    qui contraddirebbe in una pagina tutto il resto del sito. L'invito a
 *    parlarci viene dopo l'esito ed è facoltativo.
 *
 * 3. NESSUN PUNTEGGIO. Vedi la nota in `lib/autovalutazione.ts`.
 *
 * Accessibilità (WebAIM «Creating Accessible Forms», MDN, W3C WAI):
 *  · ogni domanda è un <fieldset> con <legend>, che è il modo in cui uno
 *    screen reader annuncia il gruppo prima di ogni opzione;
 *  · il testo di aiuto è collegato con aria-describedby, perché il testo che
 *    sta fra i controlli altrimenti viene saltato;
 *  · la convalida non disabilita il pulsante: dice che cosa manca in un
 *    role="alert" e porta il fuoco sulla prima domanda senza risposta;
 *  · l'esito compare in un role="status" con aria-live="polite" e riceve il
 *    fuoco, perché altrimenti chi non vede la pagina non sa che è successo
 *    qualcosa.
 */

type Risposte = Record<string, number | undefined>

function scoperti(risposte: Risposte): DomandaAuto[] {
  return DOMANDE_AUTO.filter((d) => {
    const scelta = risposte[d.id]
    return scelta !== undefined && d.opzioni[scelta]?.scoperto === true
  })
}

export function Autovalutazione() {
  const [risposte, setRisposte] = useState<Risposte>({})
  const [esito, setEsito] = useState<DomandaAuto[] | null>(null)
  const [mancanti, setMancanti] = useState<string[]>([])
  const idBase = useId()
  const esitoRef = useRef<HTMLHeadingElement>(null)
  const gruppiRef = useRef<Record<string, HTMLFieldSetElement | null>>({})

  const risposteDate = DOMANDE_AUTO.filter((d) => risposte[d.id] !== undefined).length

  function calcola() {
    const senzaRisposta = DOMANDE_AUTO.filter((d) => risposte[d.id] === undefined)
    if (senzaRisposta.length > 0) {
      setMancanti(senzaRisposta.map((d) => d.id))
      setEsito(null)
      gruppiRef.current[senzaRisposta[0].id]?.scrollIntoView({ block: 'center' })
      gruppiRef.current[senzaRisposta[0].id]?.querySelector('input')?.focus()
      return
    }
    setMancanti([])
    setEsito(scoperti(risposte))
    /* Il fuoco va sull'esito: senza, chi naviga da tastiera resta sul pulsante
       e non ha modo di sapere che sotto è comparso qualcosa. */
    window.setTimeout(() => esitoRef.current?.focus(), 60)
  }

  function ricomincia() {
    setRisposte({})
    setEsito(null)
    setMancanti([])
    window.scrollTo({ top: 0 })
  }

  if (esito) {
    return (
      <div role="status" aria-live="polite">
        <h2
          ref={esitoRef}
          tabIndex={-1}
          className="text-[length:var(--display-2)]"
          style={{ maxWidth: '22ch', outline: 'none' }}
        >
          {esito.length === 0
            ? t('autovalutazione.non_risulta_scoperto_nessuno_degli_otto')
            : esito.length === 1
              ? t('autovalutazione.risulta_scoperto_un_punto')
              : `Risultano scoperti ${esito.length} punti su otto`}
        </h2>

        {esito.length === 0 ? (
          <>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('autovalutazione.allora_il_problema_che_ti_tiene')}
            </p>
            <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              {t('autovalutazione.una_cosa_sola_vale_la_pena')}
            </p>
          </>
        ) : (
          <>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('autovalutazione.non_e_un_punteggio_e_non')}
            </p>
            <div className="mt-[var(--s-34)]">
              {esito.map((d) => (
                <div key={d.id} className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{d.punto}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {d.perche}
                  </p>
                  <p className="mt-[var(--s-13)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
                    {d.fonte}
                  </p>
                  <p
                    className="mt-[var(--s-13)] text-[15px]"
                    style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}
                  >
                    In Fibonacci: {d.noi}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="mt-[var(--s-34)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
          {t('autovalutazione.questa_pagina_non_e_un_parere')}
        </p>

        <div className="mt-[var(--s-34)] flex flex-wrap gap-[var(--s-13)]">
          <Link href="/richiedi-una-demo" className="btn btn-primario">
            {t('autovalutazione.parlane_con_noi')}
          </Link>
          <button type="button" onClick={ricomincia} className="btn btn-secondario">
            {t('autovalutazione.rifai_le_domande')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="passo text-[15px]" style={{ color: 'var(--fg-faint)' }}>
        {t('autovalutazione.le_risposte_restano_in_questa_pagina')}
      </p>

      <div className="mt-[var(--s-34)]">
        {DOMANDE_AUTO.map((d, i) => {
          const idAiuto = `${idBase}-${d.id}-aiuto`
          const manca = mancanti.includes(d.id)
          return (
            <fieldset
              key={d.id}
              ref={(el) => {
                gruppiRef.current[d.id] = el
              }}
              /* `passo`: sul telefono una domanda per schermata. Le otto
                 insieme facevano 2.347px su 721 utili — si rispondeva
                 scorrendo alla cieca. Resta UN modulo solo, quindi `calcola()`
                 e il salto alla prima risposta mancante funzionano come
                 prima; su desktop la classe è inerte e l'elenco è quello. */
              className="passo py-[var(--s-21)]"
              style={{ borderTop: '1px solid var(--rule)' }}
              aria-describedby={d.aiuto ? idAiuto : undefined}
            >
              <legend className="text-[1.0625rem]" style={{ fontWeight: 500 }}>
                <span style={{ color: 'var(--fg-faint)' }}>{i + 1}.</span> {d.domanda}
              </legend>
              {d.aiuto && (
                <p id={idAiuto} className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                  {d.aiuto}
                </p>
              )}
              {manca && (
                <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--accent-ink)' }}>
                  {t('autovalutazione.questa_risposta_manca')}
                </p>
              )}
              <div className="mt-[var(--s-13)] flex flex-col gap-[var(--s-8)]">
                {d.opzioni.map((o, j) => {
                  const idOpz = `${idBase}-${d.id}-${j}`
                  return (
                    <label
                      key={idOpz}
                      htmlFor={idOpz}
                      className="flex items-start gap-[var(--s-8)] text-[1.0625rem]"
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        id={idOpz}
                        name={`${idBase}-${d.id}`}
                        checked={risposte[d.id] === j}
                        onChange={() => {
                          setRisposte((r) => ({ ...r, [d.id]: j }))
                          setMancanti((m) => m.filter((x) => x !== d.id))
                        }}
                        style={{ marginTop: 5, width: 17, height: 17, accentColor: 'var(--accent)', flexShrink: 0 }}
                      />
                      <span style={{ color: 'var(--fg-muted)' }}>{o.etichetta}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )
        })}
      </div>

      {mancanti.length > 0 && (
        <p role="alert" className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--accent-ink)' }}>
          {mancanti.length === 1
            ? t('autovalutazione.manca_una_risposta_e_segnata_qui')
            : `Mancano ${mancanti.length} risposte: sono segnate qui sopra.`}
        </p>
      )}

      {/* ⚠️ `passo`: sul telefono il pulsante è la schermata finale del
          questionario, non una coda sotto l'ottava domanda. Prima erano 145px
          fuori da ogni passo, cioè l'ultima domanda si leggeva insieme a un
          pezzo di pulsante e il ritmo si rompeva proprio dove si decide. */}
      <div className="passo mt-[var(--s-34)] flex flex-wrap items-center gap-[var(--s-13)]">
        <button type="button" onClick={calcola} className="btn btn-primario">
          {t('autovalutazione.vedi_l_esito')}
        </button>
        <span className="text-[15px]" style={{ color: 'var(--fg-faint)' }}>
          {risposteDate} di {DOMANDE_AUTO.length}
        </span>
      </div>
    </div>
  )
}
