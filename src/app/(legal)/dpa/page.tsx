import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('dpa')!

export const metadata: Metadata = {
  title: `${meta.title} — Fibonacci`,
  description: meta.description,
  alternates: { canonical: '/dpa' },
  robots: { index: true, follow: true },
}

export default async function DpaPage() {
  const content = await loadLegalDoc('dpa')
  return <MarkdownRenderer content={content} />
}
