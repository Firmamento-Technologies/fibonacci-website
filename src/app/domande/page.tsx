import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Occhiello, Freccia } from '@/components/ui/elementi'
import { Assistente } from '@/components/Assistente'
import { DOMANDE, CATEGORIE, type Domanda } from '@/lib/domande'
import { CONTACT_EMAIL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Domande frequenti',
  description:
    'Prezzi, dati dei pazienti, migrazione, e soprattutto quello che Fibonacci non fa. Risposte senza giri di parole.',
  alternates: { canonical: '/domande' },
}

const ORDINE: Domanda['categoria'][] = ['prodotto', 'prezzi', 'dati', 'avvio', 'limiti']

/* Dati strutturati FAQ: fanno comparire le risposte direttamente nei
 * risultati di ricerca. Vale la pena solo se le domande sono quelle vere,
 * altrimenti si guadagna visibilità su una promessa che poi delude. */
function SchemaDomande() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: DOMANDE.map((q) => ({
            '@type': 'Question',
            name: q.d,
            acceptedAnswer: { '@type': 'Answer', text: q.r },
          })),
        }),
      }}
    />
  )
}

export default function DomandeFrequenti() {
  return (
    <Pagina
      href="/domande"
      occhiello="Domande"
      titolo={
        <>
          Comprese quelle a cui la risposta è <span className="accento-corsivo">no</span>
        </>
      }
      sommario="Se cerchi un limite e non lo trovi qui, chiedicelo: lo aggiungiamo alla pagina."
    >
      {/* ⚠️ UNA SEZIONE PER CATEGORIA. Tutte le domande stavano in una sezione
          sola: **2.268px, il 280% di una schermata**. Le categorie esistevano
          già nei dati (`ORDINE`) e servivano solo a mettere un occhiello in
          mezzo all'elenco; ora ognuna è la sua schermata, che è quello che una
          categoria dovrebbe essere.
          ⚠️ Lo `<SchemaDomande />` è finito QUI DENTRO e non più fra i figli:
          è un `<script>` di dati strutturati, non rende niente, e da figlio di
          primo livello diventava una **tappa bianca** — schermata vuota con la
          freccia in fondo, fra l'intestazione e le domande. */}
      {ORDINE.map((cat, iCat) => {
        const gruppo = DOMANDE.filter((q) => q.categoria === cat)
        if (!gruppo.length) return null
        return (
          <section key={cat} style={{ paddingBlock: 'var(--s-34)' }}>
            {iCat === 0 && <SchemaDomande />}
            <div className="gabbia gabbia-stretta">
              <div>
                <Occhiello>{CATEGORIE[cat]}</Occhiello>
                <div className="mt-[var(--s-21)]">
                  {gruppo.map((q) => (
                    <details
                      key={q.d}
                      id={q.id}
                      className="group"
                      style={{ borderTop: '1px solid var(--rule)', padding: 'var(--s-21) 0', scrollMarginTop: 'var(--s-144)' }}
                    >
                      <summary
                        className="flex cursor-pointer items-start justify-between gap-[var(--s-21)] text-[1.0625rem]"
                        style={{ fontFamily: 'var(--font-display)', listStyle: 'none' }}
                      >
                        {q.d}
                        <span
                          aria-hidden="true"
                          className="shrink-0 transition-transform group-open:rotate-45"
                          style={{ color: 'var(--accent)', fontSize: 21, lineHeight: 1 }}
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-[var(--s-13)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                        {q.r}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">Manca la tua?</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            Chiedila qui. Se la risposta non c&apos;è in queste pagine, te lo dice.
          </p>
          <div className="mt-[var(--s-34)]">
            <Assistente />
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">Preferisci una persona?</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            {CONTACT_EMAIL ? (
              <>
                Scrivi a{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent-deep)', borderBottom: '1px solid var(--rule-strong)' }}>
                  {CONTACT_EMAIL}
                </a>
                .{' '}
              </>
            ) : (
              'Chiedicela dal modulo di contatto. '
            )}
            Se la domanda è buona finisce in questa pagina, con la risposta vera.
          </p>
          <p className="mt-[var(--s-34)]">
            <Link href="/richiedi-una-demo" className="link-avanti">
              Oppure chiedila in mezz&apos;ora di demo
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
