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
  /* ⚠️ Nato dopo gli altri sei: senza questa riga prenderebbe il default del
     2026-08-07 e dichiarerebbe una revisione **anteriore alla sua stesura**. */
  'elenco-medici': '2026-08-13',
  /* 🔴 2026-08-16: questi quattro sono stati revisionati DAVVERO, e senza queste
     righe avrebbero continuato a dichiarare «7 agosto» con dentro un testo
     nuovo — cioè esattamente il difetto che questo file esiste per impedire, e
     ci sono cascato lo stesso perché il default risponde in silenzio.
     Che cosa è cambiato: l'ospitante (Hetzner/Germania → **Aruba/Italia**, con
     `whois` a prova), la **cancellazione di Cloudflare** dalla filiera, e nella
     scheda sicurezza il limite dichiarato sulla copia fuori sede (§5.1) più la
     tabella di continuità operativa riscritta su ciò che è davvero attivo.
     ⇒ [[correzione-ospitante-aruba-2026-08-16]]. */
  'sub-responsabili': '2026-08-16',
  'sicurezza': '2026-08-16',
  'dpa': '2026-08-16',
  'privacy': '2026-08-16',
  /* 🔴 2026-08-17: due guide riscritte **contro la schermata**, non ritoccate.
     `body-map` descriveva una tabella riordinabile, scorciatoie da tastiera e un
     «Importa da visita precedente» che non è mai esistito; `anamnesi-dettatura`
     un pannello con punteggio per campo e Accetta/Modifica/Scarta, anch'esso
     inesistente. Senza queste due righe continuerebbero a dichiarare «7 agosto»
     con dentro un testo nuovo, ed è precisamente il difetto che questo file
     esiste per impedire (ci si è già cascati il 16). */
  'body-map': '2026-08-17',
  'anamnesi-dettatura': '2026-08-17',
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
