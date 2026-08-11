import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { ModuloDemo } from '@/components/ModuloDemo'
import { Reveal } from '@/components/ui/Reveal'
import { raggruppa } from '@/lib/raggruppa'
import { Occhiello, Freccia } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: 'Per le società scientifiche di medicina estetica',
  description:
    'Che cosa proponiamo a una società scientifica: la revisione dei modelli di consenso da parte di chi ha l’autorità per farla, condizioni riservate agli iscritti, formazione. E le regole che ci diamo perché una convenzione non diventi un incentivo improprio.',
  alternates: { canonical: '/per-le-societa-scientifiche' },
}

/* Una pagina-offerta, non una pagina-partner.
 *
 * ⚠️ NESSUNA SOCIETÀ È NOMINATA, ed è deliberato. Su una pagina che parla di
 * convenzioni, il nome di una società con cui non c'è un accordo firmato
 * suggerisce un rapporto che non esiste. I nomi dei possibili interlocutori
 * stanno nel piano interno, non qui.
 *
 * ⚠️ E NESSUN LOGO, per la stessa ragione. Il giorno che ci sarà una
 * convenzione vera avrà la sua pagina, con il nome e con la data.
 *
 * Le tre regole della sezione «Le regole che ci diamo» non sono una posa:
 * vengono dall'analisi interna su comparaggio e conflitto di interessi
 * (`EMR/docs/legal/memo-questioni-residue.md` §2), che si appoggia agli artt.
 * 30 e 31 del Codice di deontologia medica. La distinzione che regge il
 * ragionamento è che un software gestionale non è un atto professionale verso
 * il paziente; il confine si sposterebbe se il prodotto diventasse un
 * dispositivo medico. Se quel giorno arriva, questa pagina va riscritta, non
 * ritoccata. */

const OFFRIAMO = [
  {
    titolo: 'I modelli di consenso, rivisti da chi ha l’autorità per farlo',
    testo:
      'Abbiamo un catalogo di moduli scritti per procedura. Diciamo apertamente, anche nelle domande frequenti, che non sono validati da uno specialista né da un legale: la struttura segue la legge, il contenuto clinico va rivisto. Una società scientifica è esattamente il soggetto che può rivederlo per le procedure di sua competenza. Il risultato resta pubblico e citabile, con l’attribuzione a chi lo ha fatto.',
    perNoi: 'Per noi è la cosa che vale di più: chiude una debolezza che oggi dichiariamo.',
  },
  {
    titolo: 'Condizioni riservate agli iscritti',
    testo:
      'Il listino è pubblico e resta pubblico. Le condizioni per una convenzione si definiscono insieme e si scrivono nella convenzione, non in una pagina di marketing.',
    perNoi: 'Nessuna cifra qui: sarebbe un numero inventato prima di conoscere l’interlocutore.',
  },
  {
    titolo: 'Formazione ai soci, sulle cose noiose',
    testo:
      'Non un webinar di prodotto: mezz’ora su che cosa deve contenere un consenso, come si conserva una fotografia clinica, che cosa chiede il GDPR a uno studio piccolo. Il prodotto compare alla fine, se compare.',
    perNoi: 'Non siamo un provider ECM e non lo promettiamo.',
  },
  {
    titolo: 'Un canale per dirci che cosa manca',
    testo:
      'Chi vede cento studi sa quello che noi non possiamo sapere. Le richieste che arrivano da una società entrano nella lista di lavoro come tutte le altre, e quando qualcosa viene costruito lo diciamo.',
    perNoi: 'Senza promesse di priorità che poi non manteniamo.',
  },
] as const

const REGOLE = [
  {
    titolo: 'Niente che dipenda da quanti pazienti trattate',
    testo:
      'Se un giorno ci fosse un riconoscimento economico legato a una convenzione, può dipendere soltanto dalle attivazioni di un abbonamento. Mai dal numero di prestazioni, di pazienti o di prodotti impiegati: quello sarebbe un incentivo sul comportamento clinico, che il codice deontologico vieta.',
  },
  {
    titolo: 'Trasparenza, e possibilità di dichiararla',
    testo:
      'Il codice deontologico chiede al medico di dichiarare le condizioni di conflitto di interessi. Una convenzione deve rendergli facile farlo, non complicarglielo: i termini restano scritti e mostrabili.',
  },
  {
    titolo: 'Nessun avallo clinico in cambio di condizioni',
    testo:
      'Una società può rivedere un testo e dire che lo ha rivisto. Non le chiediamo di raccomandare un software ai propri iscritti come atto scientifico, e non paghiamo per essere raccomandati.',
  },
] as const

export default function PerLeSocietaScientifiche() {
  return (
    <Pagina
      href="/per-le-societa-scientifiche"
      occhiello="Società scientifiche"
      titolo={
        <>
          Quello che possiamo fare <span className="accento-corsivo">insieme</span>, e a quali
          condizioni
        </>
      }
      sommario={
        <>
          Questa pagina è un’offerta, non una vetrina di loghi. La cosa che ci interessa di più
          non è essere raccomandati: è che qualcuno con l’autorità per farlo guardi i nostri
          modelli di consenso e dica dove sbagliano.
        </>
      }
    >
      {/* Prima cosa, la più scomoda. */}
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Dove siamo</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '22ch' }}>
              Oggi non c’è nessuna convenzione attiva
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Nessuna, e nessun logo da mostrare. Fibonacci è in avvio: un prodotto maturo, un
              pilota, e le prime attivazioni nel 2026. Scriverlo qui costa qualcosa in credibilità
              apparente e la restituisce tutta il giorno in cui una convenzione ci sarà davvero,
              perché allora sarà vera.
            </p>
            <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              Se stai leggendo per conto di una società o di un’associazione, quello che segue è
              esattamente quello che proporremmo in una prima chiamata.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>Che cosa offriamo</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              Quattro cose, in ordine di quanto ci crediamo
            </h2>
          </Reveal>
          {/* 2 voci per schermata sul telefono; su desktop il gruppo è un
              `<div>` trasparente e l'elenco resta identico. */}
          <div className="mt-[var(--s-34)]">
            {raggruppa(OFFRIAMO, 2).map((gruppo, g) => (
            <div key={g} className="passo">
            {gruppo.map((o) => (
              <Reveal key={o.titolo}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{o.titolo}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {o.testo}
                  </p>
                  <p className="mt-[var(--s-8)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
                    {o.perNoi}
                  </p>
                </div>
              </Reveal>
            ))}
            </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Che cosa chiediamo</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              Una persona che risponda, e tempo di lettura
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Un referente con cui parlare, e qualcuno che legga i modelli di consenso delle
              procedure che vi riguardano dicendo dove sono sbagliati, generici o incompleti. È un
              lavoro vero e lo trattiamo come tale: se serve, si concorda un compenso per il tempo
              di revisione, che è la cosa più pulita e la meno equivocabile di tutte.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello chiaro>Le regole che ci diamo</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '22ch' }}>
              Perché una convenzione non diventi un incentivo improprio
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
              Il codice di deontologia medica vieta al medico di subordinare il comportamento
              professionale a vantaggi indebiti, e vieta gli accordi che condizionano la
              prescrizione. Un software gestionale non è un atto verso il paziente, quindi lo
              spazio c’è. Ma il confine è sottile e preferiamo scriverlo noi, prima che ce lo
              chieda qualcuno.
            </p>
          </Reveal>
          <div className="mt-[var(--s-34)]">
            {REGOLE.map((r) => (
              <Reveal className="passo" key={r.titolo}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule-ink)' }}>
                  <h3 className="text-[1.0625rem]" style={{ color: 'var(--on-ink)' }}>{r.titolo}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--on-ink-muted)' }}>
                    {r.testo}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Quello che non facciamo</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              Tre richieste a cui diciamo di no
            </h2>
            <ul className="mt-[var(--s-34)]">
              {[
                'Pagare per essere raccomandati agli iscritti.',
                'Mettere un logo su questo sito senza un accordo scritto e in corso.',
                'Legare qualunque riconoscimento al numero di prestazioni o di pazienti.',
              ].map((v) => (
                <li
                  key={v}
                  className="py-[var(--s-13)] text-[1.0625rem]"
                  style={{ borderTop: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                >
                  {v}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia" style={{ maxWidth: '38rem' }}>
          <Reveal className="passo">
            <ModuloDemo variante="societa" />
          </Reveal>
          <p className="mt-[var(--s-34)] text-center">
            <Link href="/consensi-informati" className="link-avanti">
              Che cosa deve contenere un consenso, secondo noi
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
