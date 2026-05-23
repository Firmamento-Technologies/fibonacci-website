import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('sicurezza')!

export const metadata: Metadata = {
  title: `${meta.title} — Fibonacci`,
  description: meta.description,
  alternates: { canonical: '/sicurezza' },
  robots: { index: true, follow: true },
}

export default async function SicurezzaPage() {
  const content = await loadLegalDoc('sicurezza')
  return <MarkdownRenderer content={content} />
}
