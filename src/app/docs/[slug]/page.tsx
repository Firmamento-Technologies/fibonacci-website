import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { DOCS, getDocMeta, loadDoc } from '@/lib/docs-data'

export async function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocMeta(slug)
  if (!doc) return {}
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/docs/${doc.slug}` },
  }
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getDocMeta(slug)
  if (!doc) notFound()

  const content = await loadDoc(slug)
  const currentIndex = DOCS.findIndex((d) => d.slug === slug)
  const prev = currentIndex > 0 ? DOCS[currentIndex - 1] : null
  const next = currentIndex < DOCS.length - 1 ? DOCS[currentIndex + 1] : null

  return (
    <>
      <MarkdownRenderer content={content} />

      {/* Prev / Next nav */}
      <nav className="mt-16 pt-8 border-t grid sm:grid-cols-2 gap-4" style={{ borderColor: 'var(--border)' }}>
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="flex items-start gap-3 p-4 rounded-xl transition-colors hover:bg-[var(--card)]"
            style={{ border: '1px solid var(--border)' }}
          >
            <ArrowLeft className="w-4 h-4 mt-1 shrink-0" style={{ color: 'var(--muted)' }} />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Precedente</p>
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--fg)' }}>{prev.title}</p>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="flex items-start gap-3 p-4 rounded-xl transition-colors hover:bg-[var(--card)] sm:text-right sm:flex-row-reverse"
            style={{ border: '1px solid var(--border)' }}
          >
            <ArrowRight className="w-4 h-4 mt-1 shrink-0" style={{ color: 'var(--muted)' }} />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Successiva</p>
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--fg)' }}>{next.title}</p>
            </div>
          </Link>
        ) : <div />}
      </nav>
    </>
  )
}
