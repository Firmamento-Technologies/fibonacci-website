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

/** Le lingue in cui esiste il manuale, oltre all'italiano che e' la sorgente. */
export const LINGUE_MANUALE = ['en', 'es', 'fr', 'de'] as const
export type LinguaManuale = (typeof LINGUE_MANUALE)[number]

/**
 * Una guida nella lingua chiesta. SOLO SERVER.
 *
 * ⚠️ **Ripiego sull'italiano se la traduzione non c'e'**, ed e' deliberato: un
 * capitolo nuovo esiste in italiano il giorno in cui lo si scrive e nelle altre
 * lingue solo dopo `scripts/traduci-manuale.mjs`. Nel mezzo, meglio il capitolo
 * in italiano che un buco nell'indice.
 * ⛔ Ma il ripiego **non deve diventare invisibile**: `scripts/collaudo.mjs`
 *    conta quante guide ripiegano e lo dice, e la build fallisce se una lingua
 *    e' tradotta **a meta'** (che e' il caso in cui sembra fatta e non lo e').
 */
export async function loadDocLingua(slug: string, lingua: LinguaManuale): Promise<string> {
  const tradotto = join(process.cwd(), 'src', 'content', 'docs', lingua, `${slug}.md`)
  try {
    return risolviSegnaposto(await readFile(tradotto, 'utf-8'), slug)
  } catch {
    return loadDoc(slug)
  }
}

/**
 * Titolo e descrizione dei capitoli nella lingua chiesta.
 *
 * ⚠️ Non stanno nel markdown ma in `docs-data.ts`: tradurre i soli `.md`
 * darebbe i **capitoli tradotti e l'indice laterale in italiano**, cioe' la
 * meta' che si vede per prima.
 */
export async function loadIndiceLingua(
  lingua: LinguaManuale,
): Promise<Record<string, { title: string; description: string }>> {
  const p = join(process.cwd(), 'src', 'content', 'docs', lingua, '_indice.json')
  try {
    return JSON.parse(await readFile(p, 'utf-8')) as Record<
      string,
      { title: string; description: string }
    >
  } catch {
    return {}
  }
}
