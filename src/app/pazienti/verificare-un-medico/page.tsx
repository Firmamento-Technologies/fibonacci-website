import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { TestoPaziente, Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'

export const metadata: Metadata = {
  title: 'Come verificare che un medico è iscritto all’Ordine',
  description:
    'La Federazione degli Ordini dei Medici pubblica l’albo nazionale: cerchi nome, cognome e città e vedi se è iscritto. Si fa in un minuto, gratis, senza passare da nessun portale.',
  alternates: { canonical: '/pazienti/verificare-un-medico' },
}

/* Fonti: il servizio di ricerca della FNOMCeO (`portale.fnomceo.it/cerca-prof/`)
 * e la posizione pubblica della Federazione stessa, che ai cittadini dice di
 * «verificare che i professionisti siano iscritti all'Albo **e i loro titoli**».
 *
 * 🔑 Questa pagina è il complemento naturale della scheda del medico, dove
 * pubblichiamo ordine e numero d'iscrizione: pubblicare un numero senza dire
 * come si controlla è mezzo servizio.
 *
 * ⚠️ Il collegamento esce verso un sito **terzo**, ma è un `<a>` normale: ⛔
 * niente widget, niente incorporazione, nessuna chiamata da questa pagina —
 * altrimenti si perde la ragione per cui il sito non ha il banner dei cookie. */
export default function Page() {
  return (
    <GuscioPaziente>
      <TestoPaziente
        occhiello="Prima di decidere"
        titolo="Come verificare che un medico è iscritto all’Ordine"
        sommario={
          <>
            Si fa in un minuto, è gratis, e non serve fidarsi di noi: il registro è pubblico
            e lo tiene la Federazione degli Ordini dei Medici.
          </>
        }
      >
        <Sezione id="come" titolo="Come si fa">
          <ol>
            <li style={{ padding: 'var(--s-5) 0' }}>
              Apri il servizio di ricerca della FNOMCeO:{' '}
              <a
                href="https://portale.fnomceo.it/cerca-prof/"
                rel="noopener noreferrer"
                target="_blank"
                style={COLLEGAMENTO}
              >
                portale.fnomceo.it/cerca-prof
              </a>
            </li>
            <li style={{ padding: 'var(--s-5) 0' }}>
              Cerca <strong>nome, cognome</strong> e la <strong>città</strong> in cui
              esercita.
            </li>
            <li style={{ padding: 'var(--s-5) 0' }}>
              Se compare, è iscritto a un Ordine provinciale. Se non compare, chiedi
              spiegazioni prima di prenotare.
            </li>
          </ol>
          <p className="mt-[var(--s-13)]" style={{ color: 'var(--fg-muted)' }}>
            I dati arrivano dagli Ordini provinciali, che sono responsabili di tenerli
            aggiornati.
          </p>
        </Sezione>

        <Sezione id="perche" titolo="Perché conta, e lo dice la Federazione stessa">
          <p>
            Non è un consiglio nostro. La FNOMCeO ha invitato pubblicamente i cittadini a
            verificare che i professionisti che incontrano (anche quelli che vedono sui
            social) siano <strong>iscritti all’Albo</strong> e a controllarne{' '}
            <strong>i titoli</strong>.
          </p>
        </Sezione>

        <Sezione id="cosa-dice" titolo="Che cosa ti dice l’iscrizione, e che cosa no">
          <p>
            <strong>Ti dice</strong> che è un medico abilitato, e che un Ordine risponde
            della sua condotta: se sbaglia, c’è un procedimento disciplinare che lo
            riguarda.
          </p>
          <p className="mt-[var(--s-13)]">
            <strong>Non ti dice</strong> quale formazione abbia in medicina estetica. In
            Italia i percorsi in questo campo sono post-laurea (scuole, corsi, società
            scientifiche) e non compaiono come una specializzazione nell’albo. È
            esattamente per questo che la Federazione dice di verificare l’iscrizione{' '}
            <em>e i titoli</em>: sono due controlli diversi, e il secondo lo chiedi al
            medico.
          </p>
        </Sezione>

        <Sezione id="noi" titolo="Che cosa facciamo noi">
          <p>
            Sulle schede pubblicate qui, ordine di appartenenza e numero d’iscrizione sono{' '}
            <strong>in pagina</strong>, non nascosti in fondo. Ma resta un dato che il
            medico dichiara: il controllo che vale è quello che fai tu, sul registro
            pubblico.
          </p>
        </Sezione>

        <Sezione id="poi" titolo="Da qui">
          <p>
            <Link href="/pazienti/prima-di-un-trattamento" style={COLLEGAMENTO}>
              Le domande da fare prima di un trattamento
            </Link>{' '}
            ·{' '}
            <Link href="/pazienti/consenso-informato" style={COLLEGAMENTO}>
              Che cos’è il consenso informato
            </Link>
          </p>
        </Sezione>
      </TestoPaziente>
    </GuscioPaziente>
  )
}
