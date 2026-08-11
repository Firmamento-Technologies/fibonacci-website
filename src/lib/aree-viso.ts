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

/* ── I dati mostrati nel dimostratore ──────────────────────────────────────
 * 🛑 INVENTATI, e devono restarlo. Fibonacci non ha pazienti reali (non è in
 * produzione), e anche quando ne avrà **non finiranno mai in vetrina**. Questa
 * è una paziente che non esiste, con una storia clinica plausibile costruita
 * per mostrare come si legge la mappa: niente nome, niente data di nascita,
 * niente codice fiscale — solo l'informazione che il medico guarda davvero.
 *
 * ⚠️ I nomi dei prodotti sono generici di proposito (il principio attivo, non
 * la marca): un listino di marche in vetrina diventa pubblicità sanitaria, che
 * la L. 145/2018 art. 1 c. 525 vieta oltre le informazioni sui titoli.
 *
 * 📏 **SEI AREE, E SONO SEI PER MISURA.** La prima versione ne aveva dieci —
 * anche i solchi naso-genieni e le guance — e a video **i pallini si
 * sovrapponevano**: alla larghezza dell'hero (~370 px di volto) le coppie più
 * strette stavano a **22, 27 e 29 px** con pallini da 30. Cioè il difetto per
 * cui la schermata precedente è stata sostituita — una cosa illeggibile —
 * ricreato da capo, in un componente nato per essere leggibile.
 * Con queste sei la coppia più stretta è a **68 px**. ⛔ Prima di aggiungerne
 * un'altra, rifare il conto: due aree adiacenti sullo stesso viso si toccano.
 * (Nel prodotto vero il problema non si pone allo stesso modo: lì il medico
 * vede la mappa a schermo intero e può spostare i pallini.) */
export interface SedutaFinta {
  quando: string
  prodotto: string
  categoria: CategoriaProdotto
  dettaglio: string
}

export type CategoriaProdotto = 'tossina' | 'filler' | 'biostim' | 'peeling'

export const STORICO_FINTO: Record<string, SedutaFinta[]> = {
  'face.glabella': [
    { quando: 'marzo 2026', prodotto: 'Tossina botulinica', categoria: 'tossina', dettaglio: '12 U · 4 punti' },
    { quando: 'ottobre 2025', prodotto: 'Tossina botulinica', categoria: 'tossina', dettaglio: '10 U · 4 punti' },
    { quando: 'aprile 2025', prodotto: 'Tossina botulinica', categoria: 'tossina', dettaglio: '10 U · 3 punti' },
  ],
  'face.frontale': [
    { quando: 'marzo 2026', prodotto: 'Tossina botulinica', categoria: 'tossina', dettaglio: '8 U · 5 punti' },
    { quando: 'ottobre 2025', prodotto: 'Tossina botulinica', categoria: 'tossina', dettaglio: '8 U · 5 punti' },
  ],
  'face.zigomi.dx': [
    { quando: 'gennaio 2026', prodotto: 'Acido ialuronico', categoria: 'filler', dettaglio: '0,5 ml · cannula' },
  ],
  'face.zigomi.sx': [
    { quando: 'gennaio 2026', prodotto: 'Acido ialuronico', categoria: 'filler', dettaglio: '0,5 ml · cannula' },
  ],
  'face.labbra.sup': [
    { quando: 'novembre 2025', prodotto: 'Acido ialuronico', categoria: 'filler', dettaglio: '0,5 ml' },
  ],
  'face.collo': [
    { quando: 'giugno 2025', prodotto: 'Polinucleotidi', categoria: 'biostim', dettaglio: '2 ml · 3ª seduta' },
  ],
}

/** Quante volte è stata trattata ogni area — derivato, non scritto due volte. */
export const CONTEGGI_FINTI: Record<string, number> = Object.fromEntries(
  Object.entries(STORICO_FINTO).map(([code, sedute]) => [code, sedute.length]),
)
