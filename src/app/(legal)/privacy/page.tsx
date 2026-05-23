import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('privacy')!

export const metadata: Metadata = {
  title: `${meta.title} — Fibonacci`,
  description: meta.description,
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

export default async function PrivacyPage() {
  const content = await loadLegalDoc('privacy')
  return <MarkdownRenderer content={content} />
}
