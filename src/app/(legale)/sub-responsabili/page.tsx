import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('sub-responsabili')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/sub-responsabili' },
}

export default async function Documento() {
  return <MarkdownRenderer content={await loadLegalDoc('sub-responsabili')} />
}
