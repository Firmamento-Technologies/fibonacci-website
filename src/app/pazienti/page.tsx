import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'
import { VoceElenco } from '@/components/pazienti/VoceElenco'
import { mediciPubblicati, SOGLIA_ELENCO } from '@/lib/medici-pubblici'

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
/* ⚠️ **Come si guarda l'elenco quando l'elenco è vuoto.**
 * Gli esempi non contano come studi pubblicati — contarli vorrebbe dire dire al
 * visitatore un numero falso — ma senza di loro **il ramo «ci sono medici» non
 * lo guarderebbe mai nessuno**, che è esattamente l'errore già evitato per il
 * ramo «nessun orario». Perciò: interruttore, **default spento**, come
 * `semina-dati-vetrina.mjs` che si rifiuta di girare fuori da localhost.
 *
 *     PAZIENTI_ESEMPI=true npm run build   ⇒ l'elenco mostra gli esempi
 *
 * ⛔ In un rilascio normale resta spento e in pagina non compare un medico che
 * non esiste. */
const MOSTRA_ESEMPI = process.env.PAZIENTI_ESEMPI === 'true'

export default function Page() {
  /* ⚠️ L'ordinamento è **davvero** alfabetico perché la pagina lo dichiara in
   * fondo: una riga che promette un criterio e un elenco che ne segue un altro
   * è una bugia piccola e gratuita. `localeCompare('it')` per le accentate. */
  const pubblicati = mediciPubblicati()
    .filter((m) => MOSTRA_ESEMPI || !m.esempio)
    .slice()
    .sort((a, b) => a.medico.nome.localeCompare(b.medico.nome, 'it'))

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
              <>
                {/* ⛔ **Niente ricerca né filtri sotto i 15 studi**
                    (`SOGLIA_ELENCO`, decisione dell'utente 2026-08-12): filtrare
                    tre risultati è teatro, e una ricerca che ne restituisce due
                    dice «qui non c'è nessuno» meglio dell'elenco stesso.
                    Sopra la soglia entrano — NN/g mette le sotto-categorie
                    **sopra** l'elenco, separate dai filtri. */}
                {pubblicati.length >= SOGLIA_ELENCO && (
                  <p className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {pubblicati.length} studi.
                  </p>
                )}
                <ul style={{ marginTop: 'var(--s-8)' }}>
                  {pubblicati.map((m) => (
                    <VoceElenco key={m.slug} m={m} />
                  ))}
                </ul>
                {/* ⚖️ L'ordine si dichiara **sempre**, anche quando è banale: è
                    il contrario esatto del badge «In evidenza», che è posizione
                    in vendita. Qui non lo è, e va detto in pagina. */}
                <p className="mt-[var(--s-13)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
                  In ordine alfabetico. Nessuno può pagare per comparire più in alto.
                </p>
              </>
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
