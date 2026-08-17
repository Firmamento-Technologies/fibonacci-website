import type { Metadata } from 'next'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { getLegalDocMeta, loadLegalDoc } from '@/lib/legal-docs'

const meta = getLegalDocMeta('elenco-medici')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/elenco-medici' },
}

export default async function Documento() {
  return <MarkdownRenderer content={await loadLegalDoc('elenco-medici')} />
}
