import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { risolviSegnaposto } from './segnaposto'

/* Il testo di una guida, letto da disco. SOLO SERVER.
 *
 * ⚠️ Sta in un file suo e non in `docs-data.ts` per una ragione misurata: da
 * quando l'indice del manuale è un componente client, `docs-data.ts` viene
 * importato anche dal browser. Con il lettore lì dentro, Turbopack provava a
 * mettere `node:fs/promises` nel pacchetto del client e la build si fermava.
 * ⛔ Non importare questo modulo da un file con `'use client'`. */
export async function loadDoc(slug: string): Promise<string> {
  const filePath = join(process.cwd(), 'src', 'content', 'docs', `${slug}.md`)
  // Stessa risoluzione dei legali: una copia parziale qui aveva gia' lasciato
  // un {URL_APP} non risolto in una guida (vedi segnaposto.ts).
  return risolviSegnaposto(await readFile(filePath, 'utf-8'), slug)
}
