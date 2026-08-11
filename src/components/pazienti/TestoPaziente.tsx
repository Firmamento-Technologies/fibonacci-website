import type { ReactNode } from 'react'

/* Il guscio delle pagine di testo del lato paziente.
 *
 * Stessa misura di riga e stessa scala del resto del sito — ⛔ ma senza
 * `chrome/Pagina`, che avvolge tutto nel percorso a tappe: qui si legge, non
 * si valuta un acquisto.
 *
 * 🔑 **Perché queste pagine esistono, ed è l'unica asimmetria che abbiamo.**
 * La L. 145/2018 art. 1 c. 525 e il codice FNOMCeO (artt. 55-57) legano **gli
 * iscritti all'albo e le strutture sanitarie private di cura**: un medico non
 * può scrivere liberamente sui trattamenti senza rischiare il richiamo
 * dell'Ordine. **Noi non siamo né l'uno né l'altro** ⇒ possiamo spiegare al
 * paziente cose che il nostro stesso cliente non può spiegargli.
 *
 * ⚠️ Il paletto che rende vera questa asimmetria: **queste pagine non
 * promuovono nessun medico**. Nel momento in cui nominassero uno studio o ne
 * vantassero i risultati diventerebbero strumento della sua pubblicità, e il
 * vincolo rientrerebbe dalla finestra.
 */
export function TestoPaziente({
  occhiello,
  titolo,
  sommario,
  children,
}: {
  occhiello: string
  titolo: string
  sommario: ReactNode
  children: ReactNode
}) {
  return (
    <article
      className="gabbia"
      style={{ paddingTop: 'var(--s-34)', paddingBottom: 'var(--s-55)' }}
    >
      <header style={{ maxWidth: 'var(--measure)' }}>
        <p className="text-[13px] uppercase tracking-[.08em]" style={{ color: 'var(--fg-faint)' }}>
          {occhiello}
        </p>
        {/* Un solo H1 per pagina, come nel resto del sito. */}
        <h1 className="mt-[var(--s-8)] text-[length:var(--display-2)]">{titolo}</h1>
        <div className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
          {sommario}
        </div>
      </header>
      <div style={{ maxWidth: 'var(--measure)' }}>{children}</div>
    </article>
  )
}

/** Una sezione con titolo. Esiste per non ripetere gli stessi margini in
 *  quattro pagine e finire con quattro spaziature leggermente diverse. */
export function Sezione({
  id,
  titolo,
  children,
}: {
  id: string
  titolo: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} style={{ marginTop: 'var(--s-34)' }}>
      <h2 id={id} className="text-[length:var(--display-3)]">
        {titolo}
      </h2>
      <div className="mt-[var(--s-13)]">{children}</div>
    </section>
  )
}

/* ⚠️ `globals.css:242` azzera i collegamenti (`a:where(:not(.btn))`): un `<a>`
 * nudo esce identico al testo. È il difetto che la verifica a video ha preso
 * sulla scheda del medico — qui si usa questo stile e non si scrive `<a>` a
 * mano. */
export const COLLEGAMENTO = {
  color: 'var(--accent)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
} as const
