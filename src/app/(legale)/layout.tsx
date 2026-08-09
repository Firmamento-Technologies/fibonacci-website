import Link from 'next/link'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { Occhiello } from '@/components/ui/elementi'
import { LEGAL_DOCS } from '@/lib/legal-docs'
import { PRIVACY_EMAIL } from '@/lib/site-config'

/* Guscio dei documenti legali.
 *
 * Sono documenti da leggere, non da scorrere: colonna stretta, indice
 * laterale appiccicato, nessuna animazione. La misura della riga resta
 * quella del resto del sito (circa 66 caratteri), perché un contratto letto
 * su righe da 140 caratteri non viene letto. */
export default function LayoutLegale({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="contenuto" className="flex-1">
        <div className="gabbia" style={{ paddingTop: 'var(--s-55)', paddingBottom: 'var(--s-89)' }}>
          <Occhiello>Documenti</Occhiello>

          <div className="mt-[var(--s-34)] grid gap-[var(--s-55)] lg:grid-cols-[15rem_1fr]">
            <aside className="lg:sticky lg:self-start" style={{ top: 'var(--s-144)' }}>
              <nav aria-label="Indice dei documenti">
                <ul>
                  {LEGAL_DOCS.map((d) => (
                    <li key={d.slug} style={{ borderTop: '1px solid var(--rule)' }}>
                      <Link
                        href={`/${d.slug}`}
                        className="block py-[var(--s-13)] text-[15px]"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {d.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <p className="mt-[var(--s-34)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
                Domande sulla conformità?{' '}
                {PRIVACY_EMAIL ? (
                  <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}>
                    {PRIVACY_EMAIL}
                  </a>
                ) : (
                  <Link href="/richiedi-una-demo" style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}>
                    scrivici dal modulo
                  </Link>
                )}
              </p>
            </aside>

            <article className="prosa min-w-0">{children}</article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
