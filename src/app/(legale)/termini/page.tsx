import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('termini')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/termini' },
}

export default async function Documento() {
  return <MarkdownRenderer content={await loadLegalDoc('termini')} />
}
