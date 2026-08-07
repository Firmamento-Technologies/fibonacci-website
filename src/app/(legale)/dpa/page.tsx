import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('dpa')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/dpa' },
}

export default async function Documento() {
  return <MarkdownRenderer content={await loadLegalDoc('dpa')} />
}
