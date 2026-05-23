import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('cookie')!

export const metadata: Metadata = {
  title: `${meta.title} — Fibonacci`,
  description: meta.description,
  alternates: { canonical: '/cookie' },
  robots: { index: true, follow: true },
}

export default async function CookiePage() {
  const content = await loadLegalDoc('cookie')
  return <MarkdownRenderer content={content} />
}
