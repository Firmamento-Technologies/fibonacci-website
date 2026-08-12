/* Le ancore dei titoli: un solo posto che le calcola.
 *
 * ⚠️ SERVE PERCHÉ I CONSUMATORI SONO DUE, e non si vedono fra loro:
 *   · `indiceDaMarkdown()` legge il sorgente `.md` e costruisce l'elenco
 *     «In questa pagina» (sul server, in fase di build);
 *   · `MarkdownRenderer` mette l'`id` sul titolo reso.
 * Se ognuno calcolasse la propria regola, il giorno in cui una delle due cambia
 * l'indice punterebbe a frammenti inesistenti: link che **non danno errore**,
 * semplicemente non portano da nessuna parte. È il difetto tipico degli indici
 * generati, ed è invisibile a chi guarda la pagina ferma.
 * Il presidio che lo prende dal vivo sta in `scripts/collaudo.mjs`: apre ogni
 * guida e verifica che ogni voce dell'indice trovi il suo titolo.
 */

/** Da un testo a un'ancora: minuscole, senza accenti, parole unite da `-`. */
export function ancora(testo: string): string {
  const pulito = testo
    .normalize('NFD')
    // Via i segni diacritici: «Però» e «Pero» danno la stessa ancora, ed è
    // quello che si vuole — un'ancora con `%C3%B2` dentro non si copia a mano.
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return pulito || 'sezione'
}

/* Due titoli identici nella stessa pagina darebbero due `id` uguali: il
 * secondo link non arriverebbe mai al secondo titolo. Oggi non succede in
 * nessuna delle 19 guide (verificato), ma è esattamente la cosa che una guida
 * nuova introduce senza accorgersene. Il contatore va CONDIVISO fra h2 e h3 e
 * consumato nello stesso ordine dai due consumatori: il markdown si legge
 * dall'alto, e react-markdown rende i titoli nell'ordine del documento. */
export function contatoreAncore(): (testo: string) => string {
  const visti = new Map<string, number>()
  return (testo: string) => {
    const base = ancora(testo)
    const n = (visti.get(base) ?? 0) + 1
    visti.set(base, n)
    return n === 1 ? base : `${base}-${n}`
  }
}

export interface VoceIndice {
  id: string
  testo: string
  livello: 2 | 3
}

/** Toglie la formattazione in linea: quello che resta è il testo che si vede. */
function testoSemplice(riga: string): string {
  return riga
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/_([^_]*)_/g, '$1')
    .trim()
}

/**
 * L'indice di una guida: i suoi `##` e `###`, nell'ordine del documento.
 *
 * ⛔ Fuori l'`# ` di primo livello: è il titolo della pagina, non una sezione,
 * e ripeterlo in cima all'indice è la prima riga che nessuno clicca mai.
 */
export function indiceDaMarkdown(md: string): VoceIndice[] {
  const prossima = contatoreAncore()
  const voci: VoceIndice[] = []
  let dentroBlocco = false

  for (const riga of md.split('\n')) {
    // Un `## qualcosa` dentro un blocco di codice è codice, non un titolo.
    if (/^\s*(```|~~~)/.test(riga)) {
      dentroBlocco = !dentroBlocco
      continue
    }
    if (dentroBlocco) continue

    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(riga)
    if (!m) continue

    const testo = testoSemplice(m[2])
    voci.push({ id: prossima(testo), testo, livello: m[1].length as 2 | 3 })
  }

  return voci
}
