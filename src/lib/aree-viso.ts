/* Le aree del volto e la loro posizione sul ritratto — COPIA dall'applicazione.
 *
 * ⚠️ QUESTO FILE È UNA COPIA, ed è una scelta, non una dimenticanza.
 * La sorgente è `EMR/apps/web/src/lib/body-areas.ts` (`FACE_AREAS`,
 * `FACE_AREA_COORDS_FEMALE`, `FACE_AREA_COORDS_MALE`). Il sito è un repo
 * separato e statico: non può importare da un altro repo senza un pacchetto
 * condiviso, e un pacchetto condiviso per 23 righe di coordinate costerebbe più
 * di quello che risolve.
 *
 * 🔒 IL PRESIDIO CHE RENDE LA COPIA ACCETTABILE sta in `scripts/collaudo.mjs`
 * (sezione «mappa del viso»): legge `body-areas.ts` dall'EMR e confronta codici,
 * etichette e coordinate con quelle qui sotto. Se divergono, il collaudo diventa
 * ROSSO e dice quale area. Se il sottomodulo EMR non è in questo clone, lo dice
 * in giallo e non finge di aver verificato.
 * ⛔ Senza quel presidio questa copia sarebbe esattamente il difetto che il
 * progetto insegue da giorni — *due copie di una regola che divergono in
 * silenzio* — ed è la stessa ragione per cui esiste `scripts/ancora-emr.mjs`.
 *
 * ⚖️ COSA è in parità e cosa no: **i dati sì, l'aspetto no.** Colori, spaziature
 * e tipografia qui seguono i token del sito (`--accent`, `--fg-muted`, la scala
 * `--s-*`), non quelli dell'applicazione: è la decisione TD-15 — marchio,
 * accento e ritmo attraversano il confine, carattere e tono no.
 *
 * Per aggiornare: rigenerare a mano da `body-areas.ts` e rilanciare
 * `node scripts/collaudo.mjs`. Non è un file generato da uno script perché il
 * generatore andrebbe tenuto in vita per 23 righe che cambiano due volte l'anno;
 * il controllo automatico invece serve sempre, e c'è.
 */

export interface AreaViso {
  /** Codice nel CodeSystem custom «AestheticBodyArea» — identico all'EMR. */
  code: string
  label: string
}

/** Le 23 aree del volto, nell'ordine dell'applicazione. */
export const AREE_VISO: AreaViso[] = [
  { code: 'face.frontale', label: 'Fronte' },
  { code: 'face.glabella', label: 'Glabella' },
  { code: 'face.tempie.dx', label: 'Tempia dx' },
  { code: 'face.tempie.sx', label: 'Tempia sx' },
  { code: 'face.sopracciglia', label: 'Sopracciglia' },
  { code: 'face.palpebre.sup', label: 'Palpebre superiori' },
  { code: 'face.palpebre.inf', label: 'Borse palpebrali' },
  { code: 'face.zigomi.dx', label: 'Zigomo dx' },
  { code: 'face.zigomi.sx', label: 'Zigomo sx' },
  { code: 'face.guance.dx', label: 'Guancia dx' },
  { code: 'face.guance.sx', label: 'Guancia sx' },
  { code: 'face.naso', label: 'Naso' },
  { code: 'face.solco-naso-genieno.dx', label: 'Solco naso-genieno dx' },
  { code: 'face.solco-naso-genieno.sx', label: 'Solco naso-genieno sx' },
  { code: 'face.labbra.sup', label: 'Labbro superiore' },
  { code: 'face.labbra.inf', label: 'Labbro inferiore' },
  { code: 'face.filtro', label: 'Filtro' },
  { code: 'face.codici-marionetta.dx', label: 'Codice marionetta dx' },
  { code: 'face.codici-marionetta.sx', label: 'Codice marionetta sx' },
  { code: 'face.mento', label: 'Mento' },
  { code: 'face.mandibola.dx', label: 'Mandibola dx' },
  { code: 'face.mandibola.sx', label: 'Mandibola sx' },
  { code: 'face.collo', label: 'Collo' },
]

export const ETICHETTA_AREA: Record<string, string> = Object.fromEntries(
  AREE_VISO.map((a) => [a.code, a.label]),
)

export type SessoRitratto = 'donna' | 'uomo'

/* ⚠️ Due tabelle e non una: il volto dell'uomo sta più in basso e più largo nel
 * fotogramma (occhi ~0.47 contro ~0.44), quindi una tabella sola sbaglierebbe
 * tutte le aree su un sesso. Ricalibrate sull'applicazione il 2026-07-16. */

/** Donna — riferite a `/img/volto-donna.*`. */
export const COORD_DONNA: Record<string, { x: number; y: number }> = {
  'face.frontale': { x: 0.49, y: 0.2 },
  'face.glabella': { x: 0.49, y: 0.35 },
  'face.tempie.dx': { x: 0.42, y: 0.35 },
  'face.tempie.sx': { x: 0.57, y: 0.35 },
  'face.sopracciglia': { x: 0.49, y: 0.37 },
  'face.palpebre.sup': { x: 0.49, y: 0.4 },
  'face.palpebre.inf': { x: 0.49, y: 0.44 },
  'face.zigomi.dx': { x: 0.43, y: 0.47 },
  'face.zigomi.sx': { x: 0.56, y: 0.47 },
  'face.guance.dx': { x: 0.44, y: 0.56 },
  'face.guance.sx': { x: 0.56, y: 0.56 },
  'face.naso': { x: 0.49, y: 0.53 },
  'face.solco-naso-genieno.dx': { x: 0.47, y: 0.58 },
  'face.solco-naso-genieno.sx': { x: 0.52, y: 0.58 },
  'face.labbra.sup': { x: 0.49, y: 0.61 },
  'face.labbra.inf': { x: 0.49, y: 0.64 },
  'face.filtro': { x: 0.49, y: 0.58 },
  'face.codici-marionetta.dx': { x: 0.47, y: 0.66 },
  'face.codici-marionetta.sx': { x: 0.52, y: 0.66 },
  'face.mento': { x: 0.49, y: 0.73 },
  'face.mandibola.dx': { x: 0.44, y: 0.69 },
  'face.mandibola.sx': { x: 0.55, y: 0.69 },
  'face.collo': { x: 0.49, y: 0.85 },
}

/** Uomo — riferite a `/img/volto-uomo.*`. */
export const COORD_UOMO: Record<string, { x: number; y: number }> = {
  'face.frontale': { x: 0.5, y: 0.26 },
  'face.glabella': { x: 0.5, y: 0.37 },
  'face.tempie.dx': { x: 0.41, y: 0.37 },
  'face.tempie.sx': { x: 0.6, y: 0.37 },
  'face.sopracciglia': { x: 0.5, y: 0.38 },
  'face.palpebre.sup': { x: 0.5, y: 0.42 },
  'face.palpebre.inf': { x: 0.5, y: 0.46 },
  'face.zigomi.dx': { x: 0.43, y: 0.5 },
  'face.zigomi.sx': { x: 0.57, y: 0.5 },
  'face.guance.dx': { x: 0.44, y: 0.59 },
  'face.guance.sx': { x: 0.56, y: 0.59 },
  'face.naso': { x: 0.5, y: 0.55 },
  'face.solco-naso-genieno.dx': { x: 0.47, y: 0.6 },
  'face.solco-naso-genieno.sx': { x: 0.53, y: 0.6 },
  'face.labbra.sup': { x: 0.5, y: 0.63 },
  'face.labbra.inf': { x: 0.5, y: 0.67 },
  'face.filtro': { x: 0.5, y: 0.61 },
  'face.codici-marionetta.dx': { x: 0.47, y: 0.7 },
  'face.codici-marionetta.sx': { x: 0.53, y: 0.7 },
  'face.mento': { x: 0.5, y: 0.76 },
  'face.mandibola.dx': { x: 0.43, y: 0.72 },
  'face.mandibola.sx': { x: 0.57, y: 0.72 },
  'face.collo': { x: 0.5, y: 0.87 },
}

export function coordPerSesso(sesso: SessoRitratto) {
  return sesso === 'uomo' ? COORD_UOMO : COORD_DONNA
}

/* ✂️ Il ritaglio, e perché le coordinate qui sopra NON lo tengono già dentro.
 *
 * Gli originali sono lastre **2816×1536**: viso stretto al centro, due terzi di
 * bianco ai lati. Serviti interi, a 544 px di larghezza il viso ne occuperebbe
 * ~174 e dieci pallini da 30 px si sovrapporrebbero — cioè la cosa che deve
 * essere leggibile diventa illeggibile, lo stesso difetto per cui la schermata
 * dell'hero è stata sostituita. `scripts/volti.mjs` ritaglia la banda centrale.
 *
 * 🔑 **Perché la trasformazione sta qui e non nelle tabelle.** Se avessi
 * riscritto le 46 coordinate già ritagliate, il confronto col codice
 * dell'applicazione non sarebbe più stato un'uguaglianza: sarebbe diventato
 * «uguale a meno di una trasformazione che qualcuno ha applicato a mano», cioè
 * il tipo di presidio che smette di funzionare al primo arrotondamento. Così
 * invece le tabelle sono **byte per byte quelle dell'EMR**, il collaudo fa un
 * confronto secco, e il ritaglio è un numero solo — verificato anch'esso,
 * perché il collaudo controlla che coincida con quello dello script.
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
 * 🔑 **È QUESTA la funzione che fa il prodotto**, non il ritratto. Il medico
 * clicca dove ha trattato — a mano libera, dove capita — e il sistema aggancia
 * quel punto a un'**area del vocabolario**: `face.glabella`, non «più o meno
 * fra le sopracciglia». Da lì esce un `BodySite` FHIR codificato, che è ciò che
 * rende la cartella interrogabile e difendibile.
 *
 * ⚠️ Copiata da `findNearestFaceArea` in `EMR/apps/web/src/lib/body-areas.ts`,
 * **stessa formula e stesso raggio di default (0,08)**: se qui il raggio fosse
 * più generoso, il sito mostrerebbe una precisione che il prodotto non ha.
 * Il presidio in `scripts/parita-viso.mjs` confronta anche questo numero.
 */
export const RAGGIO_AGGANCIO = 0.08

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
