import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SpecialtyPage } from '@/components/SpecialtyPage'
import { SPECIALTIES } from '@/lib/specialties'

export async function generateStaticParams() {
  return SPECIALTIES.map((s) => ({ id: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const specialty = SPECIALTIES.find((s) => s.id === id)
  if (!specialty) return {}
  return {
    title: specialty.name,
    description: specialty.tagline,
    alternates: { canonical: `/specialita/${specialty.id}` },
    openGraph: {
      title: `${specialty.name} — Fibonacci`,
      description: specialty.tagline,
      url: `/specialita/${specialty.id}`,
      type: 'website',
      locale: 'it_IT',
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const specialty = SPECIALTIES.find((s) => s.id === id)
  if (!specialty) notFound()
  return (
    <>
      <Navbar />
      <SpecialtyPage specialty={specialty} />
      <Footer />
    </>
  )
}
