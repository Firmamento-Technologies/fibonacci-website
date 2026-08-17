import { NextResponse } from 'next/server'
import { DOCS_IN_ORDINE } from '@/lib/docs-data'
import { LINGUE_MANUALE, loadDocLingua, loadIndiceLingua, type LinguaManuale } from '@/lib/docs-file'
import { indiceDaMarkdown } from '@/lib/ancore'

/* IL MANUALE NELLE ALTRE QUATTRO LINGUE — e ⛔ **NON pubblicato**, come l'italiano.
 *
 * ── PERCHÉ UNA ROTTA PER LINGUA E NON UN FILE SOLO CON DENTRO TUTTO ─────────
 * Perché `pdf-signer/guide.py` legge `dati["pagine"]` al livello più alto, ed è
 * il caricamento da cui dipendono **l'assistente in-app e la pagina del
 * manuale**. Cambiare quella forma per far posto alle lingue avrebbe voluto
 * dire toccare il contratto di due consumatori in una volta sola, e un
 * `carica_guide()` che torna vuoto **non dà errore**: l'assistente dice
 * soltanto «non posso consultare le guide adesso».
 * ⇒ un file per lingua, **stessa forma esatta** dell'italiano. Il servizio
 *   cambia solo il nome del file che apre.
 *
 * ── IL RIPIEGO, e perché non è silenzioso ───────────────────────────────────
 * `loadDocLingua` ripiega sull'italiano quando un capitolo non è ancora
 * tradotto: un capitolo nuovo esiste in italiano il giorno stesso e nelle altre
 * lingue solo dopo `scripts/traduci-manuale.mjs`, e nel mezzo un capitolo in
 * italiano vale più di un buco nell'indice. ⛔ Ma il conto di quanti ripiegano
 * finisce **dentro il file** (`ripiegati`), e `scripts/manuale-privato.mjs`
 * fallisce se una lingua è tradotta **a metà** — cioè nell'unico caso in cui
 * sembra fatta e non lo è.
 */
export const dynamic = 'force-static'

export function generateStaticParams() {
  return LINGUE_MANUALE.map((lingua) => ({ lingua }))
}

export async function GET(_req: Request, ctx: { params: Promise<{ lingua: string }> }) {
  const { lingua } = await ctx.params
  if (!(LINGUE_MANUALE as readonly string[]).includes(lingua)) {
    return NextResponse.json({ errore: 'lingua non prevista' }, { status: 404 })
  }
  const l = lingua as LinguaManuale
  const indice = await loadIndiceLingua(l)
  let ripiegati = 0

  const pagine = await Promise.all(
    DOCS_IN_ORDINE.map(async (d, i) => {
      const markdown = await loadDocLingua(d.slug, l)
      const voce = indice[d.slug]
      if (!voce) ripiegati++
      return {
        /* ⚠️ Il percorso resta `/documentazione/<slug>/` **identico
           all'italiano**: è la chiave con cui `pdf-signer/guide.py` riconosce
           le guide (`p.startswith("/documentazione/")`). Metterci dentro la
           lingua spegnerebbe il manuale **in silenzio**: `carica_guide()`
           tornerebbe un dizionario vuoto e l'assistente direbbe solo «non
           posso consultare le guide adesso». La lingua è nel NOME DEL FILE. */
        percorso: `/documentazione/${d.slug}/`,
        titolo: voce?.title ?? d.title,
        descrizione: voce?.description ?? d.description,
        categoria: d.category,
        capitolo: i + 1,
        testo: soloTesto(markdown),
        markdown,
        indice: indiceDaMarkdown(markdown),
      }
    }),
  )

  return NextResponse.json({
    generato_da: 'website/src/app/manuale-privato/[lingua]/route.ts',
    pubblico: false,
    lingua: l,
    /* Quante voci dell'indice non hanno traduzione e ripiegano sull'italiano.
       Serve al collaudo: un numero > 0 è legittimo (capitolo nuovo), un numero
       uguale al totale vuol dire che quella lingua non è mai stata generata. */
    ripiegati,
    pagine,
  })
}

/** Il markdown ridotto a prosa: via i segni che al modello non dicono niente. */
function soloTesto(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*[>#-]+\s*/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}
