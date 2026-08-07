import type { MetadataRoute } from 'next'

// `output: export` esige che queste rotte siano statiche in modo esplicito.
export const dynamic = 'force-static'
import { SITE_URL } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
