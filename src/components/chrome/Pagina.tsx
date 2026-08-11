import type { ReactNode } from 'react'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { Occhiello } from '@/components/ui/elementi'

/* Guscio comune a tutte le pagine interne.
 *
 * Un solo H1 per pagina, ed è questo: le linee guida di digital.gov lo
 * mettono fra i requisiti di base per l'indicizzazione, e le sezioni sotto
 * usano H2. Il sommario è facoltativo ma quasi sempre giusto averlo: è la
 * riga che dice al lettore se è nel posto sbagliato, prima che scorra. */
export function Pagina({
  occhiello,
  titolo,
  sommario,
  children,
  larga = false,
}: {
  occhiello: string
  titolo: ReactNode
  sommario?: ReactNode
  children: ReactNode
  larga?: boolean
}) {
  return (
    <>
      <Header />
      <main id="contenuto" className="flex-1">
        {/* ⚠️ Padding ridotto il 2026-08-11 (era 55/34), e vale per TUTTE le
            pagine: questa intestazione è condivisa, quindi i suoi 327px erano
            la ragione sistematica per cui «diverse pagine non stanno in una
            schermata». Misurato su /prezzi: 327px di sola intestazione prima
            del primo contenuto utile.
            34/21 tiene il respiro senza mangiare mezza schermata. ⛔ Non
            rialzarli senza rimisurare `node scripts/altezza-pagine.mjs`. */}
        <section style={{ paddingTop: 'var(--s-34)', paddingBottom: 'var(--s-21)' }}>
          <div className={`gabbia ${larga ? '' : 'gabbia-stretta'}`}>
            <Occhiello>{occhiello}</Occhiello>
            <h1 className="mt-[var(--s-21)] text-[length:var(--display-1)]" style={{ maxWidth: '20ch' }}>
              {titolo}
            </h1>
            {sommario && (
              <div
                className="mt-[var(--s-21)] text-[1.0625rem]"
                style={{ color: 'var(--fg-muted)', maxWidth: 'var(--measure)' }}
              >
                {sommario}
              </div>
            )}
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </>
  )
}
