'use client'

import { t } from '@/lib/testo'
import { useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { CAPITOLI, DOCS_IN_ORDINE } from '@/lib/docs-data'

/* L'indice dei capitoli: la colonna di sinistra del manuale.
 *
 * ── PERCHÉ ESISTE ───────────────────────────────────────────────────────────
 * La documentazione stava nel guscio delle pagine di vendita (`Pagina`), che
 * dal 2026-08-11 rende ogni sezione una **schermata a sé** con la V per
 * proseguire. È il dispositivo giusto per chi valuta un gestionale e sbagliato
 * per chi lo usa: aprire `/documentazione` dava una schermata intera con il
 * titolo, e l'elenco delle 19 guide cominciava sotto il bordo. Da dentro una
 * guida non c'era nessun modo di vedere le altre — solo «precedente» e
 * «successiva» in fondo a 40 schermate di testo.
 * `src/lib/percorso.ts` lo dice già a parole: «⛔ le pagine legali e le guide
 * NON stanno nel percorso». Il guscio, però, non lo sapeva.
 *
 * ── SENZA JAVASCRIPT ────────────────────────────────────────────────────────
 * L'indice è reso nell'HTML (è un componente client, ma Next lo pre-rende in
 * fase di esportazione): su schermo largo si vede e funziona anche a script
 * spenti. Sul telefono resta chiuso dietro il pulsante — e per quel caso la
 * briciola in cima porta a `/documentazione`, che è l'indice per intero.
 */

/** Confronto indifferente a maiuscole e accenti: «però» trova «Pero». */
function normalizza(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function IndiceCapitoli({ slugCorrente }: { slugCorrente?: string }) {
  const [aperto, setAperto] = useState(false)
  const [filtro, setFiltro] = useState('')
  const idIndice = useId()
  const idCampo = useId()

  const cercato = normalizza(filtro.trim())
  const capitoli = useMemo(() => {
    if (!cercato) return CAPITOLI
    return CAPITOLI.map((c) => ({
      ...c,
      // Si cerca anche nella descrizione: chi cerca «revoca» non ha in mente
      // il titolo «Consensi informati», ha in mente la cosa da fare.
      guide: c.guide.filter((g) =>
        normalizza(`${g.title} ${g.description}`).includes(cercato),
      ),
    })).filter((c) => c.guide.length > 0)
  }, [cercato])

  const trovate = capitoli.reduce((n, c) => n + c.guide.length, 0)

  return (
    <div className="manuale__lato">
      <button
        type="button"
        className="manuale__apri"
        aria-expanded={aperto}
        aria-controls={idIndice}
        onClick={() => setAperto((v) => !v)}
      >
        <span>{aperto ? 'Chiudi l’indice' : 'Indice dei capitoli'}</span>
        <span className="manuale__apri-segno" aria-hidden="true">{aperto ? '–' : '+'}</span>
      </button>

      <nav
        id={idIndice}
        className="manuale__indice"
        data-aperto={aperto ? 'si' : 'no'}
        aria-label={t('docs.indicecapitoli.capitoli_del_manuale')}
      >
        <div className="manuale__cerca">
          <label className="sr-only" htmlFor={idCampo}>{t('docs.indicecapitoli.cerca_fra_i_capitoli')}</label>
          <input
            id={idCampo}
            type="search"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder={t('docs.indicecapitoli.cerca_un_capitolo')}
            autoComplete="off"
          />
        </div>

        {/* Il conteggio è annunciato: chi filtra da tastiera con uno screen
            reader non vede la lista accorciarsi, e senza questo non saprebbe
            se ha trovato una cosa, venti o nessuna. */}
        <p className="sr-only" role="status">
          {cercato
            ? `${trovate} capitoli su ${DOCS_IN_ORDINE.length} corrispondono a «${filtro.trim()}».`
            : `${DOCS_IN_ORDINE.length} capitoli.`}
        </p>

        {capitoli.map((parte) => (
          <div key={parte.chiave} className="manuale__parte">
            <p className="manuale__parte-titolo">{parte.titolo}</p>
            <ul>
              {parte.guide.map((g) => {
                const corrente = g.slug === slugCorrente
                return (
                  <li key={g.slug}>
                    <Link
                      href={`/documentazione/${g.slug}`}
                      className="manuale__voce"
                      data-corrente={corrente ? 'si' : undefined}
                      aria-current={corrente ? 'page' : undefined}
                      onClick={() => setAperto(false)}
                    >
                      <span className="manuale__numero" aria-hidden="true">
                        {DOCS_IN_ORDINE.indexOf(g) + 1}
                      </span>
                      <span>{g.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {trovate === 0 && (
          <p className="manuale__nessuno">
            Nessun capitolo per «{filtro.trim()}».{' '}
            <Link href="/domande">{t('docs.indicecapitoli.chiedilo_all_assistente')}</Link>.
          </p>
        )}
      </nav>
    </div>
  )
}
