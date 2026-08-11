// Aggiunge il basePath GitHub Pages a path assoluti per asset binari
// (img, video, source, poster) che non passano da next/Link.
// Necessario perche' i tag HTML standard non ereditano il basePath di Next.config.
//
// ⚠️ 2026-08-11 — QUESTO FILE AVEVA UNA COPIA PROPRIA DELLA REGOLA, e la copia
// stava per costare cara. Diceva `isProd ? '/fibonacci-website' : ''`, cioè
// ripeteva la stessa verità di `next.config.ts` con una condizione diversa.
// Passando al dominio proprio, `next.config.ts` toglieva il prefisso dai link e
// questo file continuava a metterlo sulle immagini: **43 pagine su 43** avrebbero
// servito le schermate da un percorso inesistente — 404 su ogni figura, e nessun
// errore di build a segnalarlo.
//
// Ora entrambi leggono la STESSA variabile. ⛔ Se un giorno serve di nuovo un
// prefisso, si cambia in un posto solo: due copie della stessa condizione sono
// divergite alla prima occasione utile, che è esattamente come si sono
// manifestati gli altri difetti di questo progetto.

/* Il dominio proprio: se c'è, il sito sta alla radice e non serve nessun
 * prefisso. Stessa variabile di `next.config.ts` e di `SITE_URL`. */
const dominioProprio = (process.env.NEXT_PUBLIC_DOMINIO_SITO ?? '').trim()
const isProd = process.env.NODE_ENV === 'production'

export const BASE_PATH = dominioProprio ? '' : isProd ? '/fibonacci-website' : ''

export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path
  return `${BASE_PATH}${path}`
}
