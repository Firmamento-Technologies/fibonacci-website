'use client'

// Le schede del listino. Client component da quando c'è l'interruttore
// mensile/annuale (D2, utente 2026-08-10): è l'unico stato di questa pagina, e
// tenerlo qui evita di spezzare il componente in due per una casella.

import Link from 'next/link'
import { useState } from 'react'
import { PIANI, prezzoMensileSuAnnuale, totaleAnnuale, type Piano } from '@/lib/listino'
import { Reveal, RevealGruppo, RevealFiglio } from '@/components/ui/Reveal'
import { Freccia } from '@/components/ui/elementi'
import { AttivaPiano } from '@/components/AttivaPiano'
import { BILLING_URL } from '@/lib/site-config'

function Spunta({ chiaro = false }: { chiaro?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 5 }}>
      <path
        d="M3 8l3.2 3.2L12 4.5"
        stroke={chiaro ? 'var(--accent-onink)' : 'var(--accent)'}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** `157.5` → `157,50` · `99` → `99`. L'italiano vuole la virgola, e i centesimi
 *  si mostrano solo se ci sono: «99,00 €» su un prezzo tondo è rumore. */
function inEuro(n: number): string {
  return n.toLocaleString('it-IT', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

type Ricorrenza = 'monthly' | 'yearly'

function Prezzo({ piano, ricorrenza }: { piano: Piano; ricorrenza: Ricorrenza }) {
  const scuro = piano.consigliato === true
  const stileCifra: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    /* 2,9rem: lo stesso gradino dei titoli di sezione. */
    fontSize: '2.9rem',
    letterSpacing: '-0.02em',
    fontVariationSettings: '"opsz" 40',
  }
  const coloreNota = scuro ? 'var(--on-ink-muted)' : 'var(--fg-muted)'

  // ⛔ Su richiesta: nessuna cifra inventata. Vedi il riquadro in `listino.ts`.
  if (piano.prezzo === null) {
    return (
      <div className="mt-[var(--s-13)]">
        <span style={{ ...stileCifra, fontSize: '1.9rem' }}>Su richiesta</span>
        <p className="mt-[var(--s-5)] text-[15px]" style={{ color: coloreNota }}>
          Dipende da quante sedi e quanti operatori: si definisce insieme.
        </p>
      </div>
    )
  }

  const mensile = ricorrenza === 'monthly' ? piano.prezzo : prezzoMensileSuAnnuale(piano)!
  const totale = totaleAnnuale(piano)!

  return (
    <div className="mt-[var(--s-13)]">
      <div className="flex items-baseline gap-[var(--s-8)]">
        <span style={stileCifra}>{inEuro(mensile)}&thinsp;€</span>
        <span className="text-[15px]" style={{ color: coloreNota }}>
          al mese
        </span>
      </div>
      {/* ⚠️ Sull'annuale si scrive SEMPRE anche quanto si paga in una volta:
          mostrare solo il mensile equivalente e presentare 1.890 € alla cassa
          è la sorpresa che questo listino dice di non fare. */}
      <p className="mt-[var(--s-5)] text-[13px]" style={{ color: coloreNota, minHeight: '1.2em' }}>
        {ricorrenza === 'yearly' ? `${inEuro(totale)} € una volta l’anno, IVA esclusa` : ' '}
      </p>
    </div>
  )
}

function Interruttore({
  valore,
  onChange,
}: {
  valore: Ricorrenza
  onChange: (v: Ricorrenza) => void
}) {
  const opzioni: { v: Ricorrenza; etichetta: string }[] = [
    { v: 'monthly', etichetta: 'Mensile' },
    { v: 'yearly', etichetta: 'Annuale' },
  ]
  return (
    <div
      className="mx-auto inline-flex"
      role="radiogroup"
      aria-label="Come vuoi pagare"
      style={{ border: '1px solid var(--rule)', borderRadius: 'var(--r-lg)', padding: 3 }}
    >
      {opzioni.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={valore === o.v}
          onClick={() => onChange(o.v)}
          className="text-[15px]"
          style={{
            padding: 'var(--s-8) var(--s-21)',
            borderRadius: 'calc(var(--r-lg) - 3px)',
            background: valore === o.v ? 'var(--ink)' : 'transparent',
            color: valore === o.v ? 'var(--on-ink)' : 'var(--fg-muted)',
          }}
        >
          {o.etichetta}
          {o.v === 'yearly' && (
            <span className="ml-[var(--s-8)] numero" style={{ color: valore === o.v ? 'var(--accent-onink)' : 'var(--accent)' }}>
              −2 MESI
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

/** Le tre schede del listino. Riusate identiche in home e in /prezzi: un
 *  prezzo che compare in due forme diverse è il modo più rapido di far
 *  sospettare che ce ne sia un terzo. */
export function SchedePiani() {
  const [ricorrenza, setRicorrenza] = useState<Ricorrenza>('monthly')

  return (
    <div>
      <div className="mb-[var(--s-34)] text-center">
        <Interruttore valore={ricorrenza} onChange={setRicorrenza} />
      </div>

      <RevealGruppo className="grid gap-[var(--s-21)] md:grid-cols-3" passo={0.1}>
        {PIANI.map((p) => (
          <RevealFiglio key={p.nome}>
            <div
              className="relative flex h-full flex-col"
              style={{
                background: p.consigliato ? 'var(--ink)' : 'var(--paper)',
                color: p.consigliato ? 'var(--on-ink)' : 'var(--fg)',
                border: `1px solid ${p.consigliato ? 'var(--ink)' : 'var(--rule)'}`,
                borderRadius: 'var(--r-xl)',
                padding: 'var(--s-34)',
              }}
            >
              {p.consigliato && (
                <span
                  className="numero absolute"
                  style={{ top: 'var(--s-21)', right: 'var(--s-34)', color: 'var(--accent-onink)' }}
                >
                  PIÙ SCELTO
                </span>
              )}

              <p className="numero" style={{ color: p.consigliato ? 'var(--on-ink-muted)' : undefined }}>
                {p.nome.toUpperCase()}
              </p>

              <Prezzo piano={p} ricorrenza={ricorrenza} />

              <p className="mt-[var(--s-5)] text-[15px]" style={{ color: p.consigliato ? 'var(--on-ink-muted)' : 'var(--fg-muted)' }}>
                {p.perChi}
              </p>

              <ul
                className="mt-[var(--s-21)] flex-1 space-y-[var(--s-8)]"
                style={{ borderTop: `1px solid ${p.consigliato ? 'var(--rule-ink)' : 'var(--rule)'}`, paddingTop: 'var(--s-21)' }}
              >
                {p.incluso.map((voce) => (
                  <li key={voce} className="flex gap-[var(--s-13)] text-[15px]">
                    <Spunta chiaro={p.consigliato} />
                    <span style={{ color: p.consigliato ? 'var(--on-ink)' : 'var(--fg-muted)' }}>{voce}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-[var(--s-34)]">
                {/* ⛔ L'invito alla demo NON sparisce quando c'è il pagamento:
                    resta come secondo, perché metà dei medici vuole vedere
                    prima e comprare dopo — e toglierglielo per fare spazio al
                    checkout li perde entrambi. */}
                <Link
                  href="/richiedi-una-demo"
                  className={`btn ${p.consigliato ? 'btn-su-scuro' : 'btn-primario'}`}
                >
                  {p.prezzo === null ? 'Parliamone' : 'Richiedi una demo'}
                </Link>
                {BILLING_URL && p.prezzo !== null && (
                  <AttivaPiano piano={p} ricorrenza={ricorrenza} suScuro={p.consigliato} />
                )}
              </div>
            </div>
          </RevealFiglio>
        ))}
      </RevealGruppo>
    </div>
  )
}

/** Sintesi del listino per la home: le schede e un rimando alla pagina. */
export function ListinoSintesi() {
  return (
    <section className="fascia" id="prezzi" style={{ background: 'var(--bg-sunk)' }}>
      <div className="gabbia">
        <Reveal>
          <div className="text-center" style={{ maxWidth: '40rem', marginInline: 'auto' }}>
            <p className="occhiello" style={{ justifyContent: 'center' }}>Prezzi</p>
            <h2 className="mt-[var(--s-21)] text-[length:var(--display-2)]">
              Tre piani, nessuna sorpresa
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Prezzi per studio, IVA esclusa. Migrazione dei dati e formazione comprese. Si disdice
              quando vuoi, e i tuoi dati escono con te.
            </p>
          </div>
        </Reveal>

        <div className="mt-[var(--s-55)]" style={{ maxWidth: '64rem', marginInline: 'auto' }}>
          <SchedePiani />
        </div>

        <Reveal>
          <p className="mt-[var(--s-34)] text-center">
            <Link href="/prezzi" className="link-avanti">
              Che cosa comprende, e che cosa no
              <Freccia />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
