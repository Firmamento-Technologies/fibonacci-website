import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  // GitHub Pages serve sotto /fibonacci-website/ in produzione
  basePath: isProd ? '/fibonacci-website' : '',
  assetPrefix: isProd ? '/fibonacci-website/' : '',
  images: { unoptimized: true },
}

export default nextConfig
