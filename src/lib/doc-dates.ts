// Data di ultima revisione dei documenti legali e delle guide (E2.2).
//
// PRIMA i loader usavano `new Date()` → il documento mostrava la data di BUILD e
// "ringiovaniva" a ogni deploy: inaccettabile per un'informativa privacy o un DPA,
// che devono riportare quando il CONTENUTO è stato realmente rivisto.
//
// Ora è una data PINNATA (per-slug, con default esplicito), formattata in modo
// deterministico. Aggiornare SOLO quando il testo del documento cambia davvero.

/** Override per singolo documento: aggiornare quando quel doc viene revisionato. */
const REVISIONE_PER_SLUG: Record<string, string> = {
  // 'privacy': '2026-07-15',
  // 'dpa': '2026-07-15',
}

/** Revisione complessiva di default (ultimo allineamento dei documenti).
 *
 *  2026-08-07: i sei documenti legali sono stati revisionati davvero — via
 *  l'intestazione della vecchia società e i suoi recapiti, via i segnaposto mai
 *  risolti. Lasciare «15 luglio» avrebbe dichiarato in pagina una data di
 *  revisione anteriore alla revisione, che è esattamente il difetto che questo
 *  file esiste per impedire. */
const REVISIONE_DEFAULT = '2026-08-07'

/** Data di revisione (it-IT, es. "15 luglio 2026") stabile fra i build. */
export function docRevisionDate(slug: string): string {
  const iso = REVISIONE_PER_SLUG[slug] ?? REVISIONE_DEFAULT
  // Ancorata a UTC così l'output non dipende dal fuso della macchina di build.
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
