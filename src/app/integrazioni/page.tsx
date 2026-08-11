import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia } from '@/components/ui/elementi'

export const metadata: Metadata = {
  /* 48 caratteri + « · Fibonacci» = 59, sotto la soglia dei 60 (vedi la nota in
   * `che-software-serve/page.tsx`). Era 66 + 11 = 77, e conteneva «Fibonacci»
   * due volte: una nel titolo e una aggiunta dal modello. */
  title: 'Integrazioni: con cosa si collega, e con cosa no',
  description:
    'Oggi Fibonacci non si integra con nessun altro software, e lo diciamo. Al suo posto ci sono l’importazione dei tuoi dati fatta da noi e l’esportazione in FHIR R4, uno standard che un altro fornitore legge senza reinventare il formato.',
  alternates: { canonical: '/integrazioni' },
}

/* La pagina che entrambi i concorrenti hanno e che qui dice il contrario.
 *
 * Un elenco di loghi di gestionali è la forma standard di questa pagina, e
 * serve a dire «non devi cambiare niente». Noi non abbiamo quell'elenco.
 * La scelta è fra non avere la pagina — e lasciare che il compratore prudente
 * cerchi e non trovi — o averla e dire come stanno le cose.
 *
 * ⚠️ Regola del sito: nessuna riga promette un'integrazione futura con una
 * data. Le integrazioni dipendono da fornitori terzi che non controlliamo, e
 * una data annunciata qui diventa un impegno che non possiamo mantenere. */

const ENTRA = [
  {
    voce: 'L’anagrafica e lo storico dal gestionale che usi oggi',
    come:
      'Partiamo da un file esportato dal tuo fornitore attuale e lo carichiamo noi. È compreso nel prezzo, non è un servizio a preventivo.',
  },
  {
    voce: 'I tuoi moduli di consenso, se ne hai già di rivisti',
    come:
      'Li carichi e li usi al posto dei nostri. La struttura resta la nostra, il testo clinico è tuo.',
  },
  {
    voce: 'Il catalogo dei farmaci',
    come:
      'I medicinali autorizzati arrivano dai dati pubblici dell’AIFA e si aggiornano da soli. Non devi digitare un prontuario.',
  },
] as const

const ESCE = [
  {
    voce: 'La cartella completa, in FHIR R4',
    come:
      'FHIR è lo standard internazionale per i dati sanitari. Non è un nostro formato: un altro fornitore lo legge senza doverlo interpretare, ed è la ragione per cui puoi andartene senza chiedercelo.',
  },
  {
    voce: 'I documenti firmati, in PDF',
    come:
      'Consensi e referti escono come file autonomi, verificabili anche fuori da Fibonacci. La pagina Verifica lo dimostra su un file qualsiasi, nel tuo browser.',
  },
  {
    voce: 'Tutto insieme, quando smetti',
    come: 'L’esportazione completa è una funzione dell’applicazione, non una cortesia da chiedere all’assistenza.',
  },
] as const

export default function Integrazioni() {
  return (
    <Pagina
      occhiello="Integrazioni"
      titolo={
        <>
          Con che cosa si integra Fibonacci: oggi, con{' '}
          <span className="accento-corsivo">niente</span>
        </>
      }
      sommario={
        <>
          È la risposta breve, ed è quella vera. La risposta lunga è che al posto delle
          integrazioni ci sono due cose che contano di più: i tuoi dati li portiamo dentro noi, e
          quando vuoi portarli fuori escono in uno standard, non in un formato nostro.
        </>
      }
    >
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Perché non c’è un elenco di loghi</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '22ch' }}>
              Un’integrazione è una promessa che dipende da un altro
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Collegare due software richiede che l’altro apra qualcosa: un’interfaccia, un
              tracciato, un accesso. Quasi nessun gestionale medico italiano lo fa senza un
              accordo commerciale, e un accordo commerciale non è una funzione che possiamo
              scrivere noi. Finché non ce n’è uno firmato, elencare nomi qui sarebbe annunciare
              lavoro altrui.
            </p>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Quindi niente elenco, e niente date. Quando ce ne sarà una vera comparirà qui, il
              giorno in cui funziona.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Che cosa entra</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              Portare i dati dentro è un lavoro nostro
            </h2>
          </Reveal>
          <div className="mt-[var(--s-34)]">
            {ENTRA.map((e) => (
              <Reveal key={e.voce}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{e.voce}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {e.come}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              Il limite, detto prima: se il tuo fornitore attuale non esporta niente di
              utilizzabile, te lo diciamo <em>prima</em> di firmare. È un problema che va
              conosciuto, non scoperto.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Che cosa esce</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              Uno standard, non un formato nostro
            </h2>
          </Reveal>
          <div className="mt-[var(--s-34)]">
            {ESCE.map((e) => (
              <Reveal key={e.voce}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{e.voce}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {e.come}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello chiaro>E il portale che usi già</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              Convivono, e il costo lo diciamo
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
              Se usi un portale di prenotazione per farti trovare, tienilo: non ti chiediamo di
              rinunciarci per cominciare. Ma non c’è un collegamento fra i due, quindi l’agenda
              pubblica resta dove è adesso e le prenotazioni le riporti tu. È il prezzo della
              convivenza, ed è meglio saperlo prima.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">Vuoi vedere come esce un documento?</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            Il verificatore gira nel tuo browser e funziona anche su un file che non è nostro.
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/verifica" className="btn btn-primario">
              Apri il verificatore
            </Link>
            <Link href="/richiedi-una-demo" className="btn btn-secondario">
              Richiedi una demo
            </Link>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/che-software-serve" className="link-avanti">
              Portale, gestionale o cartella verticale: che cosa serve davvero
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
