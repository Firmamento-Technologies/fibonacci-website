import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const isProd = process.env.NODE_ENV === 'production'

/* La radice del workspace, dichiarata invece che dedotta.
 *
 * ⚠️ Senza questa riga Turbopack la INDOVINA, e la indovinava male: c'è un
 * `pnpm-lock.yaml` orfano in `/Users/luca/Claude/` (1° luglio, di un altro
 * progetto), e a ogni avvio sceglieva QUELLA cartella come radice invece di
 * `website/`, avvisando in console.
 *
 * Non era un avviso cosmetico: la radice è anche dove Turbopack **guarda i
 * file**. Il 2026-08-09 il dev server ha servito due volte codice che sul disco
 * non esisteva più — la prima 404 su ogni rotta con `app/page.js` regolarmente
 * compilato, la seconda un `import` da `@/components/ui/Schermata` (modulo mai
 * esistito) mentre il file su disco importava da `elementi`. In entrambi i casi
 * il rimedio era riavviare, cioè un sintomo curato due volte.
 *
 * ⛔ L'alternativa era cancellare il lockfile orfano: sta fuori da questo
 * progetto e non è nostro da toccare. Qui la radice si dichiara, e vale anche
 * se domani ne compare un altro. */
const radice = dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  turbopack: { root: radice },
  output: 'export',
  trailingSlash: true,
  // GitHub Pages serve sotto /fibonacci-website/ in produzione
  basePath: isProd ? '/fibonacci-website' : '',
  assetPrefix: isProd ? '/fibonacci-website/' : '',
  images: { unoptimized: true },
}

export default nextConfig
