import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'
import { mediciPubblicati, percorsoMedico } from '@/lib/medici-pubblici'

export const metadata: Metadata = {
  title: 'Trova il tuo medico estetico e prenota',
  description:
    'Le pagine pubbliche dei medici che usano Fibonacci: chi sono, il numero d’iscrizione all’Ordine, dove ricevono e quando sono liberi. Nessuna classifica, nessuna recensione, nessun listino.',
  alternates: { canonical: '/pazienti' },
}

/* La pagina iniziale del lato paziente.
 *
 * ⚠️ **Onestà prima della conversione, e non è una posa.** Qui ci sono «i
 * medici che usano Fibonacci», ⛔ **mai «i migliori medici»**: sarebbe una
 * comparazione senza indicatori misurabili, cioè esattamente ciò che il codice
 * FNOMCeO vieta — e la responsabilità ricadrebbe sul medico, non su di noi.
 *
 * ⚠️ **E oggi l'elenco è vuoto.** Si dichiara, come il sito dichiara che la
 * società non è ancora costituita: è lo stesso principio applicato due volte.
 * ⛔ Non si scrive «presto disponibile», che è una promessa con una data
 * implicita. */
export default function Page() {
  /* Gli esempi non contano come studi pubblicati: sono materiale di collaudo.
   * ⛔ Contarli qui vorrebbe dire dire al visitatore un numero falso. */
  const pubblicati = mediciPubblicati().filter((m) => !m.esempio)

  return (
    <GuscioPaziente>
      <article
        className="gabbia"
        style={{ paddingTop: 'var(--s-34)', paddingBottom: 'var(--s-55)' }}
      >
        <header style={{ maxWidth: 'var(--measure)' }}>
          <h1 className="text-[length:var(--display-2)]">
            I medici che usano Fibonacci, e i loro orari veri
          </h1>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            Fibonacci è la cartella clinica che alcuni medici estetici usano nel loro studio.
            Da qui puoi vedere chi sono, controllare che siano iscritti all’Ordine e chiedere
            un appuntamento sugli orari che hanno davvero liberi.
          </p>
        </header>

        <div style={{ maxWidth: 'var(--measure)' }}>
          <Sezione id="elenco" titolo="Gli studi che hanno pubblicato la loro pagina">
            {pubblicati.length === 0 ? (
              <p>
                <strong>Per ora nessuno.</strong> Le pagine si accendono una a una, quando è
                lo studio a volerlo: appena ce ne sarà una, comparirà qui. Se il tuo medico
                usa Fibonacci, l’indirizzo della sua pagina te lo può dare lui.
              </p>
            ) : (
              <ul>
                {pubblicati.map((m) => (
                  <li key={m.slug} style={{ padding: 'var(--s-8) 0' }}>
                    <Link href={percorsoMedico(m.slug)} style={COLLEGAMENTO}>
                      {m.medico.nome}
                    </Link>{' '}
                    <span style={{ color: 'var(--fg-muted)' }}>— {m.studio.comune}</span>
                  </li>
                ))}
              </ul>
            )}
          </Sezione>

          <Sezione id="cosa-non" titolo="Che cosa non troverai qui, e perché">
            <p>
              <strong>Nessuna classifica.</strong> Nessuno può pagare per comparire più in
              alto: quando gli studi saranno abbastanza da fare un elenco, l’ordine sarà
              dichiarato in pagina e non sarà in vendita a nessuno.
            </p>
            <p className="mt-[var(--s-13)]">
              <strong>Nessuna recensione.</strong> Per garantire che vengano da pazienti veri
              dovremmo collegare chi scrive alla sua cartella clinica, cioè rivelare che
              quella persona è stata paziente di quel medico. Non lo facciamo.
            </p>
            <p className="mt-[var(--s-13)]">
              <strong>Nessun prezzo e nessuna promozione.</strong> La legge italiana vieta ai
              medici le comunicazioni con elementi «attrattivi e suggestivi», offerte e sconti
              compresi. Gli onorari te li dice lo studio.
            </p>
          </Sezione>

          <Sezione id="fiducia" titolo="Tre cose utili prima di prenotare">
            <ul>
              <li style={{ padding: 'var(--s-8) 0' }}>
                <Link href="/pazienti/verificare-un-medico" style={COLLEGAMENTO}>
                  Come verificare che un medico è iscritto all’Ordine
                </Link>:
                 si fa in un minuto, sul registro pubblico.
              </li>
              <li style={{ padding: 'var(--s-8) 0' }}>
                <Link href="/pazienti/prima-di-un-trattamento" style={COLLEGAMENTO}>
                  Nove domande da fare prima di un trattamento
                </Link>:
                 quelle a cui il medico è tenuto a rispondere.
              </li>
              <li style={{ padding: 'var(--s-8) 0' }}>
                <Link href="/pazienti/consenso-informato" style={COLLEGAMENTO}>
                  Che cos’è il consenso informato
                </Link>:
                 e perché non è una liberatoria.
              </li>
            </ul>
          </Sezione>

          <Sezione id="dati" titolo="I tuoi dati">
            <p>
              Questo sito non usa cookie di tracciamento, non ha account e non ti profila.
              Quando chiedi un appuntamento, i dati vanno allo studio che hai scelto.{' '}
              <Link href="/pazienti/privacy" style={COLLEGAMENTO}>
                Come funziona, per esteso
              </Link>
              .
            </p>
          </Sezione>
        </div>
      </article>
    </GuscioPaziente>
  )
}
