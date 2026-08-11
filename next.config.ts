import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const isProd = process.env.NODE_ENV === 'production'
/* Il dominio proprio, es. `fibonaccimedica.it`. Vuoto = si resta su github.io.
 * ⚠️ Il prefisso `NEXT_PUBLIC_` non è cosmetico: la stessa variabile serve al
 * client (`SITE_URL` in `site-config.ts`), e Next inlinea solo quelle. Un
 * secondo nome per il client avrebbe creato due sorgenti della stessa verità. */
const dominioProprio = (process.env.NEXT_PUBLIC_DOMINIO_SITO ?? '').trim()

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
  /* Il prefisso di percorso esiste SOLO perché GitHub Pages serve il repo sotto
   * `/fibonacci-website/`. Con un dominio proprio il sito sta alla radice, e
   * quel prefisso va tolto — altrimenti ogni link e ogni asset puntano a un
   * percorso che sul dominio non esiste (404 su tutto, non solo sulle pagine).
   *
   * ⚠️ È pilotato da `NEXT_PUBLIC_DOMINIO_SITO` e NON da `NODE_ENV`, di proposito: il
   * passaggio al dominio è un'operazione in due tempi — prima il DNS, poi il
   * rilascio. Legarlo a `NODE_ENV` avrebbe significato che il primo `build` di
   * produzione dopo la modifica spegneva il sito su github.io mentre il dominio
   * non risolveva ancora. Finché la variabile è vuota, non cambia niente. */
  basePath: dominioProprio ? '' : isProd ? '/fibonacci-website' : '',
  assetPrefix: dominioProprio ? '' : isProd ? '/fibonacci-website/' : '',
  images: { unoptimized: true },
}

export default nextConfig
