import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Occhiello, Freccia } from '@/components/ui/elementi'
import { DOCS } from '@/lib/docs-data'

export const metadata: Metadata = {
  title: 'Documentazione',
  description: 'Guide pratiche a Fibonacci: primo accesso, anagrafica, dettatura, consensi, mappa del corpo, registro accessi.',
  alternates: { canonical: '/documentazione' },
}

const GRUPPI = {
  inizio: 'Per cominciare',
  utilizzo: 'Nel lavoro di tutti i giorni',
  compliance: 'Adempimenti',
} as const

export default function Documentazione() {
  return (
    <Pagina
      occhiello="Documentazione"
      titolo={<>Le guide, scritte per chi <span className="accento-corsivo">lavora</span></>}
      sommario="Niente manuale da 200 pagine. Una guida per compito, con le schermate del prodotto."
    >
      <section style={{ paddingBottom: 'var(--s-89)' }}>
        <div className="gabbia gabbia-stretta">
          {(Object.keys(GRUPPI) as (keyof typeof GRUPPI)[]).map((cat) => {
            const gruppo = DOCS.filter((d) => d.category === cat)
            if (!gruppo.length) return null
            return (
              <div key={cat} style={{ marginTop: 'var(--s-55)' }}>
                <Occhiello>{GRUPPI[cat]}</Occhiello>
                <ul className="mt-[var(--s-21)]">
                  {gruppo.map((d) => (
                    <li key={d.slug} style={{ borderTop: '1px solid var(--rule)' }}>
                      <Link href={`/documentazione/${d.slug}`} className="block py-[var(--s-21)]">
                        <span className="flex items-baseline justify-between gap-[var(--s-13)]">
                          <span className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>
                            {d.title}
                          </span>
                          <span style={{ color: 'var(--accent)' }}><Freccia /></span>
                        </span>
                        <span className="mt-[var(--s-5)] block text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                          {d.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </Pagina>
  )
}
