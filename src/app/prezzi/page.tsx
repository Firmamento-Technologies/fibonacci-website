import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { SchedePiani } from '@/components/Listino'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'
import { ATTIVAZIONE, ANCORA, CONVIVENZA, RESIDUO } from '@/lib/listino'

export const metadata: Metadata = {
  title: 'Prezzi',
  description:
    'Due piani: Solo a 99 euro al mese, Studio a 189. IVA esclusa. Migrazione dei dati e formazione comprese, nessun costo di attivazione, nessun vincolo di durata.',
  alternates: { canonical: '/prezzi' },
}

/* Il listino.
 *
 * CXL, sulle pagine prezzi: semplice batte astuto, e la prima domanda da
 * farsi è «come lo rendo più facile da capire». Due piani, due colonne, e
 * l'elenco di cosa NON è compreso subito sotto, perché è la parte che il
 * compratore prudente cerca e non trova mai. */

const NON_COMPRESO = [
  {
    voce: 'Firma elettronica qualificata',
    perche:
      'La firma della paziente oggi è una firma elettronica avanzata: vale, ma non ha la stessa presunzione della qualificata. I certificati non ci sono ancora. Quando arriveranno lo diremo, e non cambierà il prezzo di chi è già cliente.',
  },
  {
    voce: 'Conservazione a norma',
    perche:
      'La conservazione sostitutiva richiede un conservatore accreditato, e non ne abbiamo ancora contrattualizzato uno. I documenti si archiviano e si esportano, ma non chiamarla conservazione a norma.',
  },
  {
    voce: 'Invio al Sistema Tessera Sanitaria e fatturazione',
    perche:
      'Non li facciamo. Se ti serve il ciclo attivo, tienilo dove è oggi: non ha senso pagarci per una cosa che non abbiamo collaudato.',
  },
]

export default function Prezzi() {
  return (
    <Pagina
      occhiello="Prezzi"
      titolo={
        <>
          Due piani, e l&apos;elenco di quello che <span className="accento-corsivo">non</span>{' '}
          comprendono
        </>
      }
      sommario="Prezzi per studio, IVA esclusa. Nessun costo di attivazione, nessun vincolo di durata, nessun aumento a sorpresa al secondo anno."
      larga
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia" style={{ maxWidth: '52rem' }}>
          <SchedePiani />
        </div>
      </section>

      {/* Cosa comprende l'attivazione */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello>Attivazione</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[var(--display-2)]" style={{ maxWidth: '16ch' }}>
                  Compreso nel prezzo, non a preventivo
                </h2>
                <ul className="mt-[var(--s-34)]">
                  {ATTIVAZIONE.map((v) => (
                    <li
                      key={v}
                      className="py-[var(--s-13)] text-[1.0625rem]"
                      style={{ borderTop: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="consulto-studio"
                alt="Due professioniste sedute con una cliente in una stanza di trattamento, accanto alla poltrona e al carrello degli strumenti."
                proporzione="4 / 3"
                didascalia="La configurazione dello studio la facciamo noi, con te."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cosa NON è compreso — la sezione che vale la pagina */}
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Quello che non c&apos;è</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[var(--display-2)]" style={{ maxWidth: '18ch' }}>
              Tre cose che altri mettono nel listino e noi no
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Rientrano il giorno in cui saranno vere. Scriverle adesso vorrebbe dire spiegartele
              dopo la firma del contratto.
            </p>
          </Reveal>

          <div className="mt-[var(--s-34)]">
            {NON_COMPRESO.map((n) => (
              <Reveal key={n.voce}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{n.voce}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {n.perche}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* La convivenza col portale: è un'obiezione di spesa, quindi sta qui e
          non in una pagina di prodotto. Precede l'ancora perché prima si
          sgombera il campo dal doppione, poi si dice con che cosa si confronta. */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Se paghi già un portale</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {CONVIVENZA.titolo}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {CONVIVENZA.testo}
            </p>
          </Reveal>

          {/* Un solo Reveal FUORI dalla lista: avvolgendo ogni <li> si infila un
              <div> dentro la <ul>, e il collaudo lo segna come violazione WCAG
              serious (due regole, «list» e «listitem»). Stessa forma della
              lista Attivazione qui sopra. */}
          <Reveal>
            <ul className="mt-[var(--s-34)]">
              {CONVIVENZA.righe.map((r) => (
                <li
                  key={r}
                  className="py-[var(--s-13)] text-[1.0625rem]"
                  style={{ borderTop: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <p
              className="mt-[var(--s-21)] text-[15px]"
              style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}
            >
              {CONVIVENZA.cautela}
            </p>
            <p className="mt-[var(--s-21)]">
              <Link href="/che-software-serve" className="link-avanti">
                Portale, gestionale o cartella verticale: le tre categorie a confronto
                <Freccia />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Il residuo del contratto altrove. Sta fra la convivenza e l'ancora
          perché è l'ultima obiezione di spesa rimasta in piedi: la convivenza
          toglie il sospetto del doppione, questa toglie il costo di uscita, e
          solo dopo ha senso dire con che cosa si confronta il prezzo. */}
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Se sei sotto contratto</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {RESIDUO.titolo}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {RESIDUO.testo}
            </p>
          </Reveal>
        </div>
      </section>

      {/* L'ancora del prezzo */}
      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello chiaro>Con che cosa si confronta</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {ANCORA.titolo}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
              {ANCORA.testo}
            </p>
            <p
              className="mt-[var(--s-21)] text-[15px]"
              style={{ color: 'var(--on-ink)', borderLeft: '2px solid var(--accent-onink)', paddingLeft: 'var(--s-13)' }}
            >
              {ANCORA.cautela}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[var(--display-2)]">Vuoi vederlo prima di decidere?</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            Mezz&apos;ora, sulle procedure che fai tu.
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/richiedi-una-demo" className="btn btn-primario">
              Richiedi una demo
            </Link>
            <Link href="/domande" className="btn btn-secondario">
              Leggi le domande frequenti
            </Link>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/sicurezza-e-dati" className="link-avanti">
              Dove stanno i dati, e cosa succede se smetti
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
