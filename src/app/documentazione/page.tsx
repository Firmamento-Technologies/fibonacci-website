import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioManuale } from '@/components/docs/GuscioManuale'
import { Freccia } from '@/components/ui/elementi'
import { CAPITOLI, DOCS_IN_ORDINE } from '@/lib/docs-data'

export const metadata: Metadata = {
  title: 'Documentazione',
  description: 'Guide pratiche a Fibonacci: primo accesso, anagrafica, dettatura, consensi, mappa del corpo, registro accessi.',
  alternates: { canonical: '/documentazione' },
}

/* La copertina del manuale.
 *
 * ⚠️ Non usa più `Pagina`: quel guscio rende ogni sezione una schermata a sé,
 * e qui produceva una prima schermata con il solo titolo — l'elenco delle
 * guide cominciava **sotto il bordo**, e per vederlo bisognava sapere che
 * c'era. Su una pagina il cui unico contenuto È l'elenco, mettere l'elenco
 * fuori campo è il difetto peggiore possibile.
 *
 * L'indice a sinistra ripete i titoli; qui ogni voce porta anche la riga che
 * dice **cosa ci trovi dentro**, che nella colonna stretta non ci sta.
 */
export default function Documentazione() {
  return (
    <GuscioManuale>
      <header className="manuale__testata">
        <h1>Il manuale</h1>
        <p>
          {DOCS_IN_ORDINE.length} capitoli, uno per compito, con le schermate del prodotto.
          Niente manuale da 200 pagine: si apre al punto che serve.
        </p>
      </header>

      {CAPITOLI.map((parte) => (
        <section key={parte.chiave} className="manuale__sezione">
          <h2>{parte.titolo}</h2>
          <ul className="manuale__elenco">
            {parte.guide.map((g) => (
              <li key={g.slug}>
                <Link href={`/documentazione/${g.slug}`}>
                  <span className="manuale__elenco-numero" aria-hidden="true">
                    {DOCS_IN_ORDINE.indexOf(g) + 1}
                  </span>
                  <span className="manuale__elenco-testo">
                    <span className="manuale__elenco-titolo">
                      {g.title}
                      <span className="manuale__elenco-freccia" aria-hidden="true"><Freccia /></span>
                    </span>
                    <span className="manuale__elenco-riga">{g.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="manuale__coda">
        <Link href="/domande" className="link-avanti">
          Non trovi quello che cerchi? Chiedilo all’assistente<Freccia />
        </Link>
      </p>
    </GuscioManuale>
  )
}
