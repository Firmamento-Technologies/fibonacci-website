import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('cookie')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/cookie' },
}

export default async function Documento() {
  return <MarkdownRenderer content={await loadLegalDoc('cookie')} />
}
