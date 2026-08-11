import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'
import { OSPITALITA, PRIVACY_EMAIL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Sicurezza e dati',
  description:
    'Dove stanno i dati dei tuoi pazienti, chi può leggerli, come sono cifrati, cosa succede se smetti. La pagina che il medico prudente cerca e quasi mai trova.',
  alternates: { canonical: '/sicurezza-e-dati' },
}

/* La pagina che il medico prudente cerca e non trova mai.
 *
 * Regola di scrittura per questa pagina: ogni riga deve essere una cosa che
 * un consulente esterno può verificare o contestare. Le frasi rassicuranti
 * senza contenuto ("prendiamo la sicurezza sul serio") vanno tolte: lo
 * studio di Stanford ripreso da CXL dice che gridare «fidati di me» fa
 * nascere il sospetto invece di scioglierlo. */

const DOMANDE = [
  {
    d: 'Dove stanno fisicamente i dati?',
    r: `Su server di ${OSPITALITA.fornitore}, a ${OSPITALITA.luogo}, quindi dentro lo ${OSPITALITA.area}. Non su cloud statunitensi, e senza repliche fuori dall’Unione. Se ti aspettavi «in Italia»: non è così, ed è meglio dirlo che scriverlo a caratteri piccoli.`,
  },
  {
    d: 'Chi è il titolare del trattamento?',
    r: 'Tu. I pazienti sono i tuoi, la cartella è la tua, le decisioni sul trattamento dei dati le prendi tu. Noi siamo responsabili del trattamento e agiamo su tua istruzione, con un accordo scritto ai sensi dell’art. 28 del GDPR che firmi prima di iniziare.',
  },
  {
    d: 'Come sono cifrati?',
    r: 'Il traffico viaggia in TLS. I dischi sono cifrati a livello di volume. Le fotografie cliniche e alcuni identificativi hanno una cifratura applicativa aggiuntiva, con chiavi che restano lato server e non passano mai dal browser.',
  },
  {
    d: 'Chi, dentro Fibonacci, può leggere una cartella?',
    r: 'Il personale tecnico che gestisce i server ha accesso all’infrastruttura, come in qualsiasi servizio ospitato. Gli accessi ai dati sono tracciati nello stesso registro che vedi tu. Non consultiamo cartelle per iniziativa nostra, e se ci chiedi assistenza su un caso concreto lo facciamo con te e resta scritto.',
  },
  {
    d: 'I dati dei pazienti addestrano modelli di intelligenza artificiale?',
    r: 'No. I fornitori dei modelli che usiamo si sono impegnati per contratto a non addestrare sui dati che passano dalle nostre chiamate. I contratti sono elencati nella pagina dei sub-responsabili.',
  },
  {
    d: 'E i backup?',
    r: 'Backup cifrati e quotidiani, con prova di ripristino periodica: un backup che nessuno ha mai provato a ripristinare non è un backup, è una speranza. Il registro storico consente di riportare il sistema a un istante preciso, non solo all’ultima notte.',
  },
  {
    d: 'Se smetto, cosa succede ai dati?',
    r: 'Esporti tutto in un formato standard leggibile senza di noi, in qualsiasi momento e senza chiedere il permesso. Alla chiusura del rapporto i dati vengono restituiti e poi cancellati nei termini che trovi nel contratto.',
  },
  {
    d: 'E se chiudete voi?',
    r: 'Vale lo stesso: l’esportazione è una funzione del prodotto, non un favore. Il formato è FHIR, uno standard sanitario internazionale, quindi un altro fornitore può leggerlo senza doverlo reinventare.',
  },
] as const

const DOCUMENTI = [
  { titolo: 'Accordo sul trattamento dei dati', descr: 'L’art. 28 fra te, titolare, e noi, responsabili.', href: '/dpa' },
  { titolo: 'Sub-responsabili', descr: 'Chi tocca i dati oltre a noi, e per fare cosa.', href: '/sub-responsabili' },
  { titolo: 'Misure di sicurezza', descr: 'La scheda tecnica ex art. 32, in dettaglio.', href: '/sicurezza' },
  { titolo: 'Informativa privacy', descr: 'Come trattiamo i dati di chi visita il sito e usa il servizio.', href: '/privacy' },
] as const

export default function SicurezzaEDati() {
  return (
    <Pagina
      href="/sicurezza-e-dati"
      occhiello="Sicurezza e dati"
      titolo={
        <>
          Le domande che il tuo consulente farà, <span className="accento-corsivo">prima</span> che
          le faccia
        </>
      }
      sommario="Otto risposte senza rassicurazioni generiche. Se una ti sembra evasiva, scrivicelo: le riscriviamo o ammettiamo il limite."
    >
      {/* ⚠️ DUE PER SCHERMATA, non otto in colonna.
          Le otto risposte stavano in una sezione sola: **1.368px, il 169% di
          una schermata** su desktop e **1.346px su 721 utili** al telefono.
          Prima divise in due da quattro (desktop a posto), poi in quattro da
          due: quattro risposte impilate su uno schermo da 375px fanno ancora
          il doppio dell'altezza utile, e lì il rimedio è solo dividere.
          Su desktop due risposte per schermata sono più ariose, non più
          vuote: la tappa riempie comunque lo schermo e il testo è centrato.
          La numerazione prosegue (`i + 1` sull'indice globale), quindi «otto
          risposte» resta vero e chi arriva alla quinta la vede numerata 05. */}
      {[0, 2, 4, 6].map((da) => (
        <section key={da} style={{ paddingBlock: 'var(--s-21)' }}>
        <div className="gabbia gabbia-stretta">
          {DOMANDE.slice(da, da + 2).map((q, iRel) => {
            const i = da + iRel
            return (
            <Reveal key={q.d}>
              <div className="grid gap-[var(--s-21)] py-[var(--s-21)] sm:grid-cols-[2.5rem_1fr]" style={{ borderTop: '1px solid var(--rule)' }}>
                <span className="numero" style={{ paddingTop: 5 }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="text-[1.3rem]">{q.d}</h2>
                  <p className="mt-[var(--s-8)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                    {q.r}
                  </p>
                </div>
              </div>
            </Reveal>
            )
          })}
        </div>
        </section>
      ))}

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello>I documenti</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
                  Girali al tuo consulente prima di parlare con noi
                </h2>
                <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                  Sono pubblici. Non c&apos;è un modulo da compilare per leggerli, perché un
                  fornitore che nasconde il contratto dietro un modulo ti sta già dicendo qualcosa.
                </p>
                <ul className="mt-[var(--s-34)]">
                  {DOCUMENTI.map((d) => (
                    <li key={d.href} style={{ borderTop: '1px solid var(--rule)' }}>
                      <Link href={d.href} className="block py-[var(--s-13)] group">
                        <span className="flex items-baseline justify-between gap-[var(--s-13)]">
                          <span className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>
                            {d.titolo}
                          </span>
                          <span style={{ color: 'var(--accent)' }}><Freccia /></span>
                        </span>
                        <span className="mt-[2px] block text-[13px]" style={{ color: 'var(--fg-muted)' }}>
                          {d.descr}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="operatrice-guanti"
                alt="Operatrice sanitaria in camice bianco e guanti viola che si abbassa la mascherina, con le attestazioni incorniciate alle pareti dello studio."
                proporzione="3 / 4"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Occhiello chiaro>Se trovi un problema</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
            Segnalazioni di sicurezza
          </h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
            {PRIVACY_EMAIL ? (
              <>
                Se individui una vulnerabilità, scrivi a{' '}
                <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: 'var(--accent-onink)', textDecoration: 'underline' }}>
                  {PRIVACY_EMAIL}
                </a>
                .{' '}
              </>
            ) : (
              <>
                Se individui una vulnerabilità, segnalacela dal{' '}
                <Link href="/richiedi-una-demo" style={{ color: 'var(--accent-onink)', textDecoration: 'underline' }}>
                  modulo di contatto
                </Link>
                .{' '}
              </>
            )}
            Rispondiamo, non minacciamo, e diciamo cosa abbiamo corretto. Ti chiediamo solo di non
            toccare dati di pazienti reali mentre indaghi.
          </p>
        </div>
      </section>
    </Pagina>
  )
}
