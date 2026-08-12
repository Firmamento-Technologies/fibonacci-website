import { NextResponse } from 'next/server'
import { DOCS_IN_ORDINE } from '@/lib/docs-data'
import { loadDoc } from '@/lib/docs-file'
import { indiceDaMarkdown } from '@/lib/ancore'

/* IL MANUALE, IN UN FILE SOLO — e ⛔ **NON pubblicato**.
 *
 * ── PERCHÉ ESISTE ───────────────────────────────────────────────────────────
 * Il 2026-08-12 l'utente ha chiesto di togliere il manuale dal sito: *«diciamo
 * alla concorrenza tutto quello che abbiamo e ci possono copiare»*. Le guide
 * restano, ma si leggono **solo dalla dashboard**, cioè da dentro l'app, a
 * sessione autenticata.
 *
 * Il manuale però serve ancora a due consumatori che stanno **sulla macchina**:
 * l'assistente in-app (`pdf-signer/guide.py`, TD-100) e la pagina del manuale
 * nell'app. Fino a oggi lo prendevano da `assistente-corpus.json`, cioè **dal
 * file che il sito pubblica** — ed era esattamente il buco: chiunque poteva
 * scaricare `https://fibonaccimedica.it/assistente-corpus.json` e leggersi le
 * 19 guide per intero, senza nemmeno passare dalle pagine.
 *
 * ── PERCHÉ UNA ROTTA DI NEXT E NON UNO SCRIPT ───────────────────────────────
 * Perché il testo va **risolto**: `{URL_APP}`, `{EMAIL_SUPPORTO}`,
 * `{ULTIMA_REVISIONE}`… Quella regola vive in `lib/segnaposto.ts` e ha già
 * fatto danni quando ne è esistita una seconda copia parziale (una guida
 * pubblicata con `{URL_APP}` dentro, vedi il commento in quel file). Uno script
 * `.mjs` non può importare quel modulo TypeScript ⇒ ne riscriverebbe una
 * seconda copia. Qui invece gira **dentro la build**, e la copia resta una.
 *
 * ⛔ L'esito NON deve restare sotto `out/`: `scripts/manuale-privato.mjs`
 * (postbuild) lo **sposta** in `manuale/`, fuori dalla cartella pubblicata, e
 * fallisce se non ce la fa. Il presidio che verifica che nel pubblicato non sia
 * rimasta una riga del manuale sta in `scripts/collaudo.mjs`.
 */
export const dynamic = 'force-static'

export async function GET() {
  const pagine = await Promise.all(
    DOCS_IN_ORDINE.map(async (d, i) => {
      const markdown = await loadDoc(d.slug)
      return {
        /* ⚠️ Il percorso resta `/documentazione/<slug>/` anche se quella rotta
           pubblica non esiste più: è la chiave con cui `pdf-signer/guide.py`
           riconosce le guide (`p.startswith("/documentazione/")`). Cambiarlo
           qui spegnerebbe il manuale dell'assistente in-app **in silenzio** —
           `carica_guide()` tornerebbe un dizionario vuoto e il prompt direbbe
           solo «non posso consultare le guide adesso». */
        percorso: `/documentazione/${d.slug}/`,
        titolo: d.title,
        descrizione: d.description,
        categoria: d.category,
        capitolo: i + 1,
        /* Due forme dello stesso testo, ognuna con un consumatore preciso:
           · `testo` — prosa piatta, è quello che `pdf-signer/guide.py` già
             legge per darlo al modello;
           · `markdown` — la sorgente, che l'app rende con la SUA tipografia.
           ⛔ Qui NON si rende l'HTML: Next vieta `react-dom/server` nel codice
           dell'applicazione (provato: la build si ferma), e comunque l'HTML del
           sito porta le classi del sito — dentro l'app avrebbe l'aria di un
           corpo estraneo. L'app ha il suo design system e rende lei. */
        testo: soloTesto(markdown),
        markdown,
        indice: indiceDaMarkdown(markdown),
      }
    }),
  )

  return NextResponse.json({
    generato_da: 'website/src/app/manuale-privato/route.ts',
    pubblico: false,
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
