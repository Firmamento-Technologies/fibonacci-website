import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { RicercaMedici } from '@/components/pazienti/RicercaMedici'
import { mediciPubblicati, mostraEsempi } from '@/lib/medici-pubblici'

export const metadata: Metadata = {
  title: t('pazienti.meta_titolo_trova_il_tuo_medico_estetico_e'),
  description:
    t('pazienti.meta_descrizione_trova_un_medico_estetico_e_pre'),
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
 * sono trenta medici, il prodotto *è* il contenuto e si spiega da solo. Noi
 * abbiamo due studi d'esempio, e il vuoto l'ho riempito **spiegando i nostri
 * principi**. Cioè: un saggio al posto di un catalogo. Non era una sezione in
 * più, era **un pezzo di prodotto mancante travestito da testo**.
 *
 * ── 🔴 E POI SONO SPARITI ANCHE I TRE CONTROLLI, LO STESSO GIORNO ───────────
 * Li avevo tenuti, «perché sono il nostro pezzo distintivo», e li avevo resi
 * più belli: tre schede numerate. L'utente ha guardato le schede e ha chiesto
 * la cosa giusta:
 *
 *   *«non creano sfiducia nei medici e nel portale stesso? perché dovrebbero
 *   controllare che il medico sia iscritto all'ordine quando possiamo farlo
 *   noi?»*
 *
 * Sì, e sono **due difetti diversi in un blocco solo**:
 *  1. **Scaricano su di lui un lavoro nostro.** «Controlla che sia iscritto
 *     all'Ordine» è una **regola di ammissione**, non un compito del paziente:
 *     l'albo è pubblico e consultabile — se è verificabile da chiunque, è
 *     verificabile da noi, **una volta**, invece che da ogni visitatore, ogni
 *     volta.
 *  2. **Insinuano il dubbio su ciò che stiamo mostrando.** Un elenco di medici
 *     che si apre con «verifica che siano medici» dice al lettore che noi non
 *     l'abbiamo fatto — e lo dice **anche al medico** che dovrebbe pubblicare
 *     qui la sua pagina. Nessun portale danneggia così la propria offerta.
 *
 * ⇒ La verifica diventa **nostra** ([[decisione-verifica-albo]], TD-115), il
 * numero resta in pagina come **prova** e non come istruzione, e le tre guide
 * — che restano contenuti veri e utili — vivono nel **piè di pagina**, dove si
 * cercano, ⛔ non come pilastro della pagina dei risultati.
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

export default async function Page() {
  /* ⚠️ L'ordinamento è **davvero** alfabetico perché la pagina lo dichiara in
   * fondo: una riga che promette un criterio e un elenco che ne segue un altro
   * è una bugia piccola e gratuita. `localeCompare('it')` per le accentate. */
  const pubblicati = (await mediciPubblicati())
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

      {/* ⛔ **Sotto l'elenco non c'è più niente, ed è deliberato.** Qui sono
          passati, e sono stati tolti, prima ~450 parole di principi e poi tre
          schede «controlla tu». Una pagina dove i pazienti cercano medici
          finisce **con i medici**: quello che resta è una riga sui dati, che è
          un fatto operativo e non un manifesto. Le guide sono nel piè di
          pagina (`GuscioPaziente`). */}
      <section className="gabbia" style={{ paddingTop: 'var(--s-34)' }}>
        <p
          className="text-[15px]"
          style={{ color: 'var(--fg-muted)', maxWidth: 'var(--measure)' }}
        >
          {t('pazienti.questo_sito_non_usa_cookie_di')}{' '}
          <Link href="/pazienti/privacy" className="collegamento-testo">
            {t('pazienti.come_funziona_per_esteso')}
          </Link>
          .
        </p>
      </section>
    </GuscioPaziente>
  )
}
