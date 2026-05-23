import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-legal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-6 leading-tight"
              style={{ color: 'var(--fg)' }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="font-[var(--font-playfair)] text-2xl md:text-[1.7rem] font-bold mt-12 mb-4 leading-snug scroll-mt-24"
              style={{ color: 'var(--fg)' }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="text-lg font-semibold mt-8 mb-3"
              style={{ color: 'var(--fg)' }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: 'var(--fg)' }}
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-base leading-relaxed" style={{ color: 'var(--fg)' }}>
              {children}
            </li>
          ),
          a: ({ href, children }) => {
            const linkClass = 'underline underline-offset-2 transition-opacity hover:opacity-75'
            const linkStyle = { color: 'var(--accent)' }
            // Link interni (path assoluti tipo /docs/x/ o /privacy/) usano next/Link
            // per ereditare il basePath GitHub Pages automaticamente.
            if (href?.startsWith('/')) {
              return (
                <Link href={href} className={linkClass} style={linkStyle}>
                  {children}
                </Link>
              )
            }
            // Esterni (http) + mailto + anchor restano <a>
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                className={linkClass}
                style={linkStyle}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            )
          },
          strong: ({ children }) => (
            <strong className="font-semibold" style={{ color: 'var(--fg)' }}>
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-4 pl-4 py-3 my-6 rounded-r-lg italic text-sm"
              style={{
                borderColor: 'var(--accent)',
                background: 'var(--accent-light)',
                color: 'var(--fg)',
              }}
            >
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code
              className="px-1.5 py-0.5 rounded text-[0.85em] font-mono"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre
              className="p-4 rounded-xl overflow-x-auto text-sm mb-4"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6">
              <table
                className="w-full border-collapse text-sm"
                style={{ border: '1px solid var(--border)' }}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ background: 'var(--card)' }}>{children}</thead>
          ),
          th: ({ children }) => (
            <th
              className="text-left px-3 py-2.5 font-semibold text-xs uppercase tracking-wider"
              style={{ color: 'var(--fg)', borderBottom: '1px solid var(--border)' }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className="px-3 py-2.5 align-top text-sm"
              style={{ color: 'var(--fg)', borderBottom: '1px solid var(--border)' }}
            >
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-10" style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
