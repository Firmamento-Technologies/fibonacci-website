import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div
            tabIndex={0}
            role="group"
            aria-label="Tabella, scorrevole in orizzontale"
            style={{ overflowX: 'auto', marginBlock: 'var(--s-21)' }}
          >
            <table>{children}</table>
          </div>
        ),
        pre: ({ children }) => (
          <div
            tabIndex={0}
            role="group"
            aria-label="Blocco di codice, scorrevole in orizzontale"
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
              {esterno && <span className="sr-only"> (si apre in una nuova scheda)</span>}
            </a>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
