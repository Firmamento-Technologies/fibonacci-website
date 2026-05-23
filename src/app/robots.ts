import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://firmamento-technologies.github.io/fibonacci-website'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
