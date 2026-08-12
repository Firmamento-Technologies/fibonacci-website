import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'
import { VoceElenco } from '@/components/pazienti/VoceElenco'
import { mediciPubblicati, mostraEsempi, SOGLIA_ELENCO } from '@/lib/medici-pubblici'

export const metadata: Metadata = {
  title: 'Trova il tuo medico estetico e prenota',
  description:
    'Tre controlli gratuiti prima di un trattamento estetico: se il medico è iscritto all’Ordine, le nove domande da fargli, che cos’è il consenso informato. E le pagine pubbliche degli studi che usano Fibonacci: nessuna classifica, nessuna recensione, nessun listino.',
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
 *     PAZIENTI_ESEMPI=true npm run build   ⇒ l'elenco mostra quelli scritti a mano
 *     PAZIENTI_ESEMPI=20   npm run build   ⇒ venti, per guardare l'elenco pieno
 *
 * ⛔ In un rilascio normale resta spento e in pagina non compare un medico che
 * non esiste.
 *
 * 🔑 **Qui la variabile non si legge**: la risposta la dà `mostraEsempi()`, che
 * sta accanto ai dati. La pagina l'ha letta per conto suo per un po', con un
 * significato diverso da quello della libreria, e le due letture divergevano —
 * fra l'altro `PAZIENTI_ESEMPI=0` finiva per **accendere** gli esempi. Il
 * perché per esteso, e la regola del fail-closed, stanno in
 * `lib/medici-pubblici.ts`. */

export default function Page() {
  /* ⚠️ L'ordinamento è **davvero** alfabetico perché la pagina lo dichiara in
   * fondo: una riga che promette un criterio e un elenco che ne segue un altro
   * è una bugia piccola e gratuita. `localeCompare('it')` per le accentate. */
  const pubblicati = mediciPubblicati()
    .filter((m) => mostraEsempi() || !m.esempio)
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
            Prima di affidarti a un medico estetico
          </h1>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            Tre controlli che puoi fare da solo, gratis, in pochi minuti: se è davvero
            iscritto all’Ordine, che cosa hai diritto di chiedergli, e che cos’è il foglio
            che ti fanno firmare. Più in basso trovi gli studi che usano Fibonacci e hanno
            scelto di pubblicare qui i loro orari.
          </p>
        </header>

        <div style={{ maxWidth: 'var(--measure)' }}>
          {/* ⚠️ **Va PRIMA dell'elenco, ed è una correzione su rilievo dell'utente
              (2026-08-12): «non dice nulla».** Aveva ragione — la pagina apriva
              con un elenco vuoto, cioè col nostro problema invece che con
              qualcosa di utile. ⛔ Con zero medici pubblicati, l'unica cosa che
              questa pagina può davvero dare a chi arriva **oggi** sono i tre
              controlli: sono gratis, si fanno da soli, e valgono anche per un
              medico che Fibonacci non lo usa. L'elenco resta, sotto, onesto. */}
          <Sezione id="fiducia" titolo="Tre controlli che puoi fare da solo">
            <ol style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ paddingBottom: 'var(--s-21)' }}>
                <h3 className="text-[1.0625rem] font-medium">
                  <Link href="/pazienti/verificare-un-medico" style={COLLEGAMENTO}>
                    1. Controlla che sia iscritto all’Ordine
                  </Link>
                </h3>
                <p className="mt-[var(--s-5)]" style={{ color: 'var(--fg-muted)' }}>
                  La Federazione degli Ordini dei Medici pubblica l’albo nazionale: cerchi
                  nome, cognome e città, e vedi se risulta iscritto. È gratis, è pubblico,
                  e si fa in un minuto dal telefono.
                </p>
              </li>
              <li style={{ paddingBottom: 'var(--s-21)' }}>
                <h3 className="text-[1.0625rem] font-medium">
                  <Link href="/pazienti/prima-di-un-trattamento" style={COLLEGAMENTO}>
                    2. Fai le nove domande, prima di dire sì
                  </Link>
                </h3>
                <p className="mt-[var(--s-5)]" style={{ color: 'var(--fg-muted)' }}>
                  Che prodotto mi mettete e quanto dura, quali sono le alternative, che cosa
                  succede se non lo faccio, chi lo esegue materialmente, e che cosa si fa se
                  va storto. Sono domande a cui il medico è tenuto a rispondere.
                </p>
              </li>
              <li>
                <h3 className="text-[1.0625rem] font-medium">
                  <Link href="/pazienti/consenso-informato" style={COLLEGAMENTO}>
                    3. Capisci che cosa firmi
                  </Link>
                </h3>
                <p className="mt-[var(--s-5)]" style={{ color: 'var(--fg-muted)' }}>
                  Nessun trattamento può iniziare senza il tuo consenso libero e informato,
                  e non è una liberatoria che scarica il medico: puoi revocarlo in qualsiasi
                  momento, anche dopo averlo firmato.
                </p>
              </li>
            </ol>
          </Sezione>

          <Sezione id="elenco" titolo="Gli studi che hanno pubblicato la loro pagina">
            {pubblicati.length === 0 ? (
              <p>
                <strong>Per ora nessuno.</strong> Le pagine si accendono una a una, quando è
                lo studio a volerlo. Se il tuo medico usa Fibonacci, l’indirizzo della sua
                pagina te lo può dare lui: lì trovi il numero d’iscrizione all’Ordine, dove
                riceve, e gli orari che ha davvero liberi.
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
