/**
 * La lingua del sito, e il dizionario da cui prende il testo.
 *
 * ── PERCHE' LA LINGUA E' UNA VARIABILE DI COSTRUZIONE E NON UNA ROTTA ───────
 * Il sito è `output: 'export'`: file statici, nessun runtime. Le due strade
 * erano ristrutturare le **29 pagine** sotto un segmento `[lingua]`, oppure
 * **costruire il sito cinque volte**, una per lingua, con `basePath`.
 *
 * 🔑 Vince la seconda, e non per pigrizia: le pagine restano dove sono (nessun
 *    indirizzo italiano cambia, e sono quelli già indicizzati), ogni lingua
 *    diventa un sito statico completo e indipendente sotto il suo prefisso, e
 *    `basePath` riscrive da sé i 70 link assoluti. La prima strada avrebbe
 *    voluto 29 pagine riscritte **prima** di sapere se la lingua automatica
 *    funziona.
 *
 * ⚠️ L'italiano resta alla RADICE, ⛔ non sotto `/it/`. Spostarlo romperebbe
 *    ogni indirizzo già pubblicato e ogni link in giro, per un guadagno nullo:
 *    è la lingua sorgente, e `hreflang` dichiara `x-default` su di essa.
 */

/** Le cinque lingue del sito. L'ordine è quello del selettore. */
export const LINGUE_SITO = ['it', 'en', 'es', 'fr', 'de'] as const
export type LinguaSito = (typeof LINGUE_SITO)[number]

/** Il nome di ogni lingua **nella lingua stessa**: chi cerca il tedesco cerca
 *  «Deutsch», ⛔ non «Tedesco» dentro un'interfaccia che non sa leggere. */
export const NOME_LINGUA: Record<LinguaSito, string> = {
  it: 'Italiano',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
}

/**
 * Il codice completo, per `<html lang>` e per `hreflang`.
 * ⚠️ `hreflang` vuole un tag BCP 47: `it` da solo è valido, ma dichiarare la
 * regione aiuta Google a distinguere un `es` di Spagna da uno d'America.
 * Qui il mercato è europeo, quindi le regioni sono quelle.
 */
export const TAG_LINGUA: Record<LinguaSito, string> = {
  it: 'it-IT',
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
}

function leggiLingua(): LinguaSito {
  // ⚠️ `NEXT_PUBLIC_` non è cosmetico: la stessa variabile serve al client, e
  //    Next inlinea solo quelle. È la stessa ragione per cui
  //    `NEXT_PUBLIC_DOMINIO_SITO` si chiama così.
  const grezza = (process.env.NEXT_PUBLIC_LINGUA ?? 'it').trim()
  return (LINGUE_SITO as readonly string[]).includes(grezza) ? (grezza as LinguaSito) : 'it'
}

/** La lingua di QUESTA costruzione. Fissa: un sito costruito è monolingue. */
export const LINGUA: LinguaSito = leggiLingua()

/** Il prefisso degli indirizzi di questa lingua: `''` per l'italiano. */
export const PREFISSO: string = LINGUA === 'it' ? '' : `/${LINGUA}`

/** Il prefisso di una lingua qualunque, per il selettore e per `hreflang`. */
export function prefissoDi(lingua: LinguaSito): string {
  return lingua === 'it' ? '' : `/${lingua}`
}

/**
 * Lo stesso indirizzo in un'altra lingua.
 *
 * ⚠️ Riceve il percorso **senza prefisso** (`/prezzi`), perché è quello che le
 * pagine conoscono: `basePath` lo aggiunge ai `<Link>` da sé, ma qui serve
 * l'indirizzo assoluto e completo, che `basePath` **non** tocca perché sta
 * dentro `<link rel="alternate">`.
 */
export function indirizzoIn(lingua: LinguaSito, percorso: string, origine: string): string {
  const pulito = percorso === '/' ? '' : percorso.replace(/\/$/, '')
  return `${origine}${prefissoDi(lingua)}${pulito || '/'}`
}
