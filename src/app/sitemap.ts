import type { MetadataRoute } from 'next'
import { SPECIALTIES } from '@/lib/specialties'
import { LEGAL_DOCS } from '@/lib/legal-docs'

export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://firmamento-technologies.github.io/fibonacci-website'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...SPECIALTIES.map((s) => ({
      url: `${BASE_URL}/specialita/${s.id}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...LEGAL_DOCS.map((doc) => ({
      url: `${BASE_URL}/${doc.slug}/`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
  ]
}
