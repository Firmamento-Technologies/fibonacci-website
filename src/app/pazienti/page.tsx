import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { RicercaMedici } from '@/components/pazienti/RicercaMedici'
import { IconaFreccia } from '@/components/pazienti/Icone'
import { mediciPubblicati, mostraEsempi } from '@/lib/medici-pubblici'

export const metadata: Metadata = {
  title: 'Trova il tuo medico estetico e prenota',
  description:
    'Trova un medico estetico e controlla che sia iscritto all’Ordine: in ogni scheda l’albo e il numero d’iscrizione, in chiaro. Poi prenoti sugli orari che lo studio ha davvero liberi. Nessuna classifica, nessuna recensione, nessun listino.',
  alternates: { canonical: '/pazienti' },
}

/* La pagina iniziale del lato paziente.
 *
 * ⚠️ **Onestà prima della conversione, e non è una posa.** Qui ci sono «i
 * medici che usano Fibonacci», ⛔ **mai «i migliori medici»**: sarebbe una
 * comparazione senza indicatori misurabili, cioè esattamente ciò che il codice
 * FNOMCeO vieta — e la responsabilità ricadrebbe sul medico, non su di noi.
 *
 * ── 🔴 IL SAGGIO È STATO TOLTO, 2026-08-13 ──────────────────────────────────
 * L'utente: *«non ho ancora capito il senso di sta roba e perché mio dottore
 * non ne ha bisogno»*, riferito ai tre blocchi «Che cosa non troverai qui» /
 * «Tre controlli» / «I tuoi dati» — **~450 parole sotto due schede**.
 *
 * 🔑 **La risposta, e vale la pena scriverla perché è la diagnosi del difetto.**
 * MioDottore non ne ha bisogno perché ha **l'inventario**: apri la pagina e ci
 * sono trenta medici: il prodotto *è* il contenuto, e si spiega da solo. Noi
 * abbiamo due studi d'esempio, e il vuoto l'ho riempito **spiegando i nostri
 * principi**. Cioè: un saggio al posto di un catalogo. Non era una sezione in
 * più, era **un pezzo di prodotto mancante travestito da testo** — e il
 * visitatore non arriva qui per leggere la nostra linea editoriale, arriva per
 * trovare un medico.
 *
 * E c'è un secondo motivo, di tempi: «nessuna classifica / nessuna recensione /
 * nessun prezzo» risponde a una domanda che il paziente **non si è ancora
 * posto**. Un'assenza si nota solo dove la si cercava. Perciò quei tre fatti
 * ora vivono dove servono davvero:
 *   · «nessuna classifica» → **la didascalia del conteggio dei risultati**,
 *     accanto all'ordinamento, dove uno si chiede perché quel medico è primo;
 *   · gli altri due → **le tre pastiglie sotto la ricerca** (`RicercaMedici`);
 *   · «nessun prezzo» → **la scheda del medico**, dove c'era da sempre.
 *
 * ⛔ Restano i **tre controlli**, che sono il nostro pezzo distintivo e sono
 * tre pagine vere — ma come **fila di schede**, non come articolo: 60 parole al
 * posto di 260, e sotto l'elenco, perché §5.1 del piano dice «l'elenco è la
 * home».
 *
 * ⚠️ **E oggi l'elenco è quasi vuoto.** Si dichiara, come il sito dichiara che
 * la società non è ancora costituita. ⛔ Non si scrive «presto disponibile»,
 * che è una promessa con una data implicita. */
/* ⚠️ **Come si guarda l'elenco quando l'elenco è vuoto.**
 * Gli esempi non contano come studi pubblicati — contarli vorrebbe dire dire al
 * visitatore un numero falso — ma senza di loro **il ramo «ci sono medici» non
 * lo guarderebbe mai nessuno**, che è esattamente l'errore già evitato per il
 * ramo «nessun orario». Perciò: interruttore, **default spento**, come
 * `semina-dati-vetrina.mjs` che si rifiuta di girare fuori da localhost.
 *
 *     NEXT_PUBLIC_PAZIENTI_ESEMPI=true npm run build   ⇒ l'elenco mostra quelli scritti a mano
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

/* I tre controlli, in forma di dati: la fila di schede li rende, e ⛔ non si
 * riscrivono a mano tre volte in tre `<li>` con lo stesso markup copiato. */
const CONTROLLI = [
  {
    href: '/pazienti/verificare-un-medico',
    titolo: 'Controlla che sia iscritto all’Ordine',
    testo:
      'La Federazione degli Ordini pubblica l’albo nazionale: cerchi nome, cognome e città. È gratis e si fa dal telefono.',
  },
  {
    href: '/pazienti/prima-di-un-trattamento',
    /* ⚠️ Titolo accorciato: «Fai le nove domande, prima di dire sì» andava a
       capo e disallineava le tre schede. In una fila, i titoli sono la riga che
       si scansiona per prima — se uno è alto il doppio, la fila si legge come
       tre blocchi scoordinati. */
    titolo: 'Fai le nove domande',
    testo:
      'Che prodotto mi mettete, quali sono le alternative, chi lo esegue materialmente, che cosa si fa se va storto.',
  },
  {
    href: '/pazienti/consenso-informato',
    titolo: 'Capisci che cosa firmi',
    testo:
      'Nessun trattamento può iniziare senza il tuo consenso. Non è una liberatoria, e puoi revocarlo quando vuoi.',
  },
] as const

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
      {/* ── L'EROE: l'azione, sopra la piega ─────────────────────────────
          ⚖️ Designers Italia, componente **Hero** (tier 1): sezione a tutta
          larghezza, una sola per pagina, con la call to action dentro. E NN/g,
          *Scrolling and Attention*: «keep major CTAs above the fold». */}
      <RicercaMedici medici={pubblicati} />

      {/* ── I tre controlli ──────────────────────────────────────────────
          🔑 **Sono il nostro pezzo distintivo, e per questo NON sono un
          articolo.** Erano un `<ol>` di tre paragrafi lunghi: la stessa
          informazione in tre schede si scansiona in tre secondi. NN/g,
          *Layer-Cake Pattern*: «determine like content and place it together
          […] visually distinguish content chunks».
          ⚠️ Stanno **sotto** l'elenco: una pagina dove i pazienti cercano
          medici apre con i medici. Ci sono già finite sopra una volta. */}
      <section
        aria-labelledby="fiducia"
        className="gabbia"
        style={{ paddingTop: 'var(--s-55)', paddingBottom: 'var(--s-55)' }}
      >
        <div className="colonna-risultati">
          <h2 id="fiducia" className="titolo-servizio text-[length:var(--display-3)]">
            Tre controlli che puoi fare da solo
          </h2>
          <p className="mt-[var(--s-5)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
            Non servono noi: sono pubblici, gratuiti e valgono per qualsiasi medico.
          </p>

          <ol className="guide-paziente mt-[var(--s-21)]">
            {CONTROLLI.map((c, i) => (
              <li key={c.href} style={{ listStyle: 'none' }}>
                <Link href={c.href} className="carta-guida">
                  <span className="carta-guida-numero" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="carta-guida-titolo">{c.titolo}</span>
                  <span className="carta-guida-testo">{c.testo}</span>
                  <span className="carta-guida-piede" aria-hidden="true">
                    Leggi <IconaFreccia lato={15} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {/* «I tuoi dati» era una sezione con titolo per **due righe**: un
              titolo che pesa quanto il testo che introduce è un titolo di
              troppo. Resta il fatto, resta il collegamento. */}
          <p className="mt-[var(--s-34)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
            Questo sito non usa cookie di tracciamento, non ha account e non ti profila.
            Quando chiedi un appuntamento, i dati vanno allo studio che hai scelto.{' '}
            <Link href="/pazienti/privacy" className="collegamento-testo">
              Come funziona, per esteso
            </Link>
            .
          </p>
        </div>
      </section>
    </GuscioPaziente>
  )
}
