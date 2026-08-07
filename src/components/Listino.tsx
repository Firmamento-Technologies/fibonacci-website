import Link from 'next/link'
import { PIANI } from '@/lib/listino'
import { Reveal, RevealGruppo, RevealFiglio } from '@/components/ui/Reveal'
import { Freccia } from '@/components/ui/elementi'

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

/** Le due schede del listino. Riusate identiche in home e in /prezzi: un
 *  prezzo che compare in due forme diverse è il modo più rapido di far
 *  sospettare che ce ne sia un terzo. */
export function SchedePiani() {
  return (
    <RevealGruppo className="grid gap-[var(--s-21)] md:grid-cols-2" passo={0.1}>
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
                style={{
                  top: 'var(--s-21)',
                  right: 'var(--s-34)',
                  color: 'var(--accent-onink)',
                }}
              >
                PIÙ SCELTO
              </span>
            )}

            <p className="numero" style={{ color: p.consigliato ? 'var(--on-ink-muted)' : undefined }}>
              {p.nome.toUpperCase()}
            </p>

            <div className="mt-[var(--s-13)] flex items-baseline gap-[var(--s-8)]">
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  letterSpacing: '-0.02em',
                  fontVariationSettings: '"opsz" 40',
                }}
              >
                {p.prezzo}&thinsp;€
              </span>
              <span className="text-[15px]" style={{ color: p.consigliato ? 'var(--on-ink-muted)' : 'var(--fg-muted)' }}>
                al mese
              </span>
            </div>

            <p className="mt-[var(--s-5)] text-[15px]" style={{ color: p.consigliato ? 'var(--on-ink-muted)' : 'var(--fg-muted)' }}>
              {p.perChi}
            </p>

            <ul
              className="mt-[var(--s-21)] flex-1 space-y-[var(--s-13)]"
              style={{ borderTop: `1px solid ${p.consigliato ? 'var(--rule-ink)' : 'var(--rule)'}`, paddingTop: 'var(--s-21)' }}
            >
              {p.incluso.map((voce) => (
                <li key={voce} className="flex gap-[var(--s-13)] text-[15px]">
                  <Spunta chiaro={p.consigliato} />
                  <span style={{ color: p.consigliato ? 'var(--on-ink)' : 'var(--fg-muted)' }}>{voce}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/richiedi-una-demo"
              className={`btn mt-[var(--s-34)] ${p.consigliato ? 'btn-su-scuro' : 'btn-primario'}`}
            >
              Richiedi una demo
            </Link>
          </div>
        </RevealFiglio>
      ))}
    </RevealGruppo>
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
            <h2 className="mt-[var(--s-21)] text-[clamp(1.85rem,4.2vw,2.9rem)]">
              Due piani, nessuna sorpresa
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Prezzi per studio, IVA esclusa. Migrazione dei dati e formazione comprese. Si disdice
              quando vuoi, e i tuoi dati escono con te.
            </p>
          </div>
        </Reveal>

        <div className="mt-[var(--s-55)]" style={{ maxWidth: '52rem', marginInline: 'auto' }}>
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
