import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('termini')!

export const metadata: Metadata = {
  title: `${meta.title} — Fibonacci`,
  description: meta.description,
  alternates: { canonical: '/termini' },
  robots: { index: true, follow: true },
}

export default async function TerminiPage() {
  const content = await loadLegalDoc('termini')
  return <MarkdownRenderer content={content} />
}
