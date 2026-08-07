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
        <section style={{ paddingTop: 'var(--s-55)', paddingBottom: 'var(--s-34)' }}>
          <div className={`gabbia ${larga ? '' : 'gabbia-stretta'}`}>
            <Occhiello>{occhiello}</Occhiello>
            <h1 className="mt-[var(--s-21)] text-[clamp(2rem,5vw,3.2rem)]" style={{ maxWidth: '20ch' }}>
              {titolo}
            </h1>
            {sommario && (
              <div
                className="mt-[var(--s-21)] text-[1.125rem]"
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
