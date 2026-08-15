/* Le aree del volto e la loro posizione sul ritratto — GENERATE dall'applicazione.
 *
 * ⚠️ QUESTO FILE NON PORTA PIÙ TABELLE A MANO (TD-155). Fino al 2026-08-15 era
 * una copia manuale di tabelle dell'EMR; il rifacimento della mappa
 * (2026-08-14) le ha rese CALCOLATE (`faceCoordsForGender` in
 * `volto-mappa.ts`) e la copia — 23 aree a pallini contro le 76 della
 * partizione vera — è rimasta indietro, col presidio che confrontava blocchi
 * ormai inesistenti e bloccava ogni push.
 *
 * Ora i dati stanno in `aree-viso-dati.json`, SCRITTO da
 * `scripts/rigenera-aree-viso.mjs`: impacchetta il modulo vero
 * dell'applicazione con esbuild, lo esegue, e salva aree + coordinate con
 * l'impronta dei file sorgente. Il presidio (`scripts/parita-viso.mjs`)
 * confronta quell'impronta con l'EMR attuale: se l'applicazione cambia e il
 * sito non è rigenerato, il collaudo è ROSSO col comando esatto.
 *
 * ⚖️ In parità: i DATI. Non in parità, di proposito:
 *   · l'aspetto (token del sito, decisione TD-15);
 *   · il MECCANISMO d'aggancio: l'app usa la partizione a bande
 *     (`areaAtPoint`), la demo del sito l'aggancio al centro-area più vicino —
 *     per una prova in vetrina è onesto e non richiede di eseguire la
 *     partizione nel browser del sito.
 */
import dati from './aree-viso-dati.json'

export interface AreaViso {
  /** Codice nel CodeSystem custom «AestheticBodyArea» — identico all'EMR. */
  code: string
  label: string
}

/** Le aree del volto (76 dalla partizione), nell'ordine dell'applicazione. */
export const AREE_VISO: AreaViso[] = dati.aree

export const ETICHETTA_AREA: Record<string, string> = Object.fromEntries(
  AREE_VISO.map((a) => [a.code, a.label]),
)

export type SessoRitratto = 'donna' | 'uomo'

/** Coordinate calcolate dall'applicazione, riferite ai due ritratti interi. */
export const COORD_DONNA: Record<string, { x: number; y: number }> = dati.coordDonna
export const COORD_UOMO: Record<string, { x: number; y: number }> = dati.coordUomo

export function coordPerSesso(sesso: SessoRitratto) {
  return sesso === 'uomo' ? COORD_UOMO : COORD_DONNA
}

/* ✂️ Il ritaglio, e perché le coordinate qui sopra NON lo tengono già dentro.
 *
 * Gli originali sono lastre **2816×1536**: viso stretto al centro, due terzi di
 * bianco ai lati. Serviti interi, a 544 px di larghezza il viso ne occuperebbe
 * ~174 e i pallini si sovrapporrebbero. `scripts/volti.mjs` ritaglia la banda
 * centrale; le coordinate restano nello spazio del fotogramma INTERO — sono
 * quelle dell'applicazione, senza trasformazioni a mano — e il ritaglio è un
 * numero solo, verificato dal presidio contro lo script che taglia.
 */
export const RITAGLIO = { x0: 0.28, larghezza: 0.44 }

/** La x di un'area dentro l'immagine ritagliata. La y non cambia: si tiene
 *  l'altezza intera proprio per non doverla trasformare. */
export function xNelRitaglio(x: number): number {
  return (x - RITAGLIO.x0) / RITAGLIO.larghezza
}

/** La x del ritaglio riportata al fotogramma originale — serve per capire su
 *  quale area è caduto un click, dato che le coordinate sono in quello spazio. */
export function xDalRitaglio(x: number): number {
  return x * RITAGLIO.larghezza + RITAGLIO.x0
}

/**
 * L'area codificata più vicina a un punto, entro `raggioMax`.
 *
 * 🔑 Nel prodotto il clic cade in una PARTIZIONE a bande (`areaAtPoint`);
 * qui la demo aggancia al centro-area più vicino. Con 76 aree i centri sono
 * fitti e il raggio può essere stretto: la vetrina non promette più
 * precisione di quanta ne mostri.
 */
export const RAGGIO_AGGANCIO = 0.06

export function areaPiuVicina(
  x: number,
  y: number,
  sesso: SessoRitratto,
  raggioMax = RAGGIO_AGGANCIO,
): string | null {
  let migliore: { code: string; dist: number } | null = null
  for (const [code, c] of Object.entries(coordPerSesso(sesso))) {
    const dist = Math.hypot(c.x - x, c.y - y)
    if (dist <= raggioMax && (migliore === null || dist < migliore.dist)) {
      migliore = { code, dist }
    }
  }
  return migliore?.code ?? null
}
