import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('sub-responsabili')!

export const metadata: Metadata = {
  title: `${meta.title} — Fibonacci`,
  description: meta.description,
  alternates: { canonical: '/sub-responsabili' },
  robots: { index: true, follow: true },
}

export default async function SubResponsabiliPage() {
  const content = await loadLegalDoc('sub-responsabili')
  return <MarkdownRenderer content={content} />
}
