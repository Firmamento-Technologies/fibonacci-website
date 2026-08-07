import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { Freccia } from '@/components/ui/elementi'
import { DOCS, getDocMeta, loadDoc } from '@/lib/docs-data'

export async function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocMeta(slug)
  if (!doc) return {}
  return { title: doc.title, description: doc.description, alternates: { canonical: `/documentazione/${doc.slug}` } }
}

export default async function Guida({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getDocMeta(slug)
  if (!doc) notFound()

  const contenuto = await loadDoc(slug)
  const i = DOCS.findIndex((d) => d.slug === slug)
  const precedente = i > 0 ? DOCS[i - 1] : null
  const successiva = i < DOCS.length - 1 ? DOCS[i + 1] : null

  return (
    <>
      <Header />
      <main id="contenuto" className="flex-1">
        <div className="gabbia gabbia-stretta" style={{ paddingTop: 'var(--s-55)', paddingBottom: 'var(--s-89)' }}>
          <Link href="/documentazione" className="occhiello">Documentazione</Link>
          <article className="prosa mt-[var(--s-34)]">
            <MarkdownRenderer content={contenuto} />
          </article>

          <nav className="mt-[var(--s-89)] grid gap-[var(--s-21)] sm:grid-cols-2" style={{ borderTop: '1px solid var(--rule)', paddingTop: 'var(--s-21)' }} aria-label="Guide vicine">
            {precedente ? (
              <Link href={`/documentazione/${precedente.slug}`}>
                <span className="numero">Precedente</span>
                <span className="mt-[var(--s-5)] block text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>{precedente.title}</span>
              </Link>
            ) : <span />}
            {successiva && (
              <Link href={`/documentazione/${successiva.slug}`} className="sm:text-right">
                <span className="numero">Successiva</span>
                <span className="mt-[var(--s-5)] block text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>{successiva.title}</span>
              </Link>
            )}
          </nav>

          <p className="mt-[var(--s-34)]">
            <Link href="/richiedi-una-demo" className="link-avanti">Non trovi quello che cerchi? Chiedilo a noi<Freccia /></Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
