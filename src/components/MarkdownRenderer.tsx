import { t } from '@/lib/testo'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { contatoreAncore } from '@/lib/ancore'

/* Rende i markdown di src/content.
 *
 * Non stila quasi niente: la classe `.prosa` in globals.css porta tipografia,
 * misura della riga e filetti, così i documenti legali e le guide seguono la
 * stessa scala del resto del sito invece di avere stili propri che con il
 * tempo divergono.
 *
 * L'unica eccezione è la tabella: va avvolta in un contenitore che scorre in
 * orizzontale, e quel contenitore deve essere raggiungibile da tastiera.
 * Una regione che scorre e non prende il fuoco è una violazione WCAG seria
 * (axe: `scrollable-region-focusable`), e sulle pagine legali le tabelle sono
 * larghe: chi naviga da tastiera resterebbe fuori da metà del contratto. */
export function MarkdownRenderer({
  content,
  ancore = false,
}: {
  content: string
  /** Titoli con `id` e con il segno «#» per copiare il link alla sezione.
   *
   * ⚠️ Spento di suo. L'`id` di per sé non si vede e non fa danno, ma il
   * segno accanto al titolo sì: sulle pagine legali (che usano lo stesso
   * renderer) sarebbe una decorazione in più su un contratto. Lo accende il
   * manuale, dove serve a mandare a qualcuno «il passo 4», non «la guida». */
  ancore?: boolean
}) {
  /* Il contatore va creato QUI, a ogni resa: `contatoreAncore()` ricorda i
     titoli già visti per non dare due volte lo stesso `id`, e un contatore
     condiviso fra due documenti darebbe `-2` al primo titolo del secondo.
     react-markdown chiama questi componenti nell'ordine del documento, che è
     l'ordine in cui `indiceDaMarkdown()` legge il sorgente: le due ancore
     coincidono perché coincide l'ordine. */
  const prossimaAncora = contatoreAncore()

  const titolo = (livello: 2 | 3) =>
    function Titolo({ children }: { children?: ReactNode }) {
      const id = prossimaAncora(testoDaNodi(children))
      const Tag = livello === 2 ? 'h2' : 'h3'
      return (
        <Tag id={id}>
          {children}
          {ancore && (
            <a className="ancora" href={`#${id}`} aria-label={`Collegamento a questa sezione: ${testoDaNodi(children)}`}>
              <span aria-hidden="true">#</span>
            </a>
          )}
        </Tag>
      )
    }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: titolo(2),
        h3: titolo(3),
        table: ({ children }) => (
          <div
            tabIndex={0}
            role="group"
            aria-label={t('markdownrenderer.tabella_scorrevole_in_orizzontale')}
            style={{ overflowX: 'auto', marginBlock: 'var(--s-21)' }}
          >
            <table>{children}</table>
          </div>
        ),
        pre: ({ children }) => (
          <div
            tabIndex={0}
            role="group"
            aria-label={t('markdownrenderer.blocco_di_codice_scorrevole_in_orizzontale')}
            style={{ overflowX: 'auto' }}
          >
            <pre
              style={{
                background: 'var(--bg-sunk)',
                padding: 'var(--s-13)',
                borderRadius: 'var(--r)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {children}
            </pre>
          </div>
        ),
        a: ({ href, children }) => {
          const esterno = href?.startsWith('http')
          return (
            <a href={href} {...(esterno ? { rel: 'noopener', target: '_blank' } : {})}>
              {children}
              {esterno && <span className="sr-only"> {t('markdownrenderer.si_apre_in_una_nuova_scheda')}</span>}
            </a>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

/* Il testo di un titolo, quando il titolo è già un albero di nodi React.
 *
 * ⚠️ Ricorsiva perché un titolo può contenere `<code>` o un `<strong>`: presa
 * la sola stringa di primo livello, un titolo come «Il campo `lotto`» avrebbe
 * dato l'ancora `il-campo`, diversa da quella calcolata sul markdown — e il
 * link dell'indice sarebbe finito nel vuoto senza che niente segnalasse
 * l'errore. */
function testoDaNodi(nodo: ReactNode): string {
  if (nodo === null || nodo === undefined || typeof nodo === 'boolean') return ''
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo)
  if (Array.isArray(nodo)) return nodo.map(testoDaNodi).join('')
  if (typeof nodo === 'object' && 'props' in nodo) {
    return testoDaNodi((nodo.props as { children?: ReactNode }).children)
  }
  return ''
}
