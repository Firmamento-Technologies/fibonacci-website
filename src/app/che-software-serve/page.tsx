import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia } from '@/components/ui/elementi'

export const metadata: Metadata = {
  /* ⚠️ 39 caratteri, e il conto è il punto. Il modello di `layout.tsx` aggiunge
   * « · Fibonacci» (11), quindi il titolo di pagina deve stare sotto i ~49 per
   * rientrare nei 60 sotto i quali Moz misura che **~90% dei titoli si vede
   * intero** in SERP. Prima erano 93 + 11 = **104**: il pezzo che distingueva
   * (portale/gestionale/cartella) veniva troncato via, cioè si perdeva proprio
   * l'unica parte che faceva cliccare. La distinzione resta nell'H1 e nel testo,
   * dove c'è spazio. ⛔ Titolo e descrizione **non sono un fattore di ranking**
   * (CXL, tier 2): servono al clic. Non riempirli di parole chiave. */
  title: 'Che software serve in medicina estetica',
  description:
    'Un portale di prenotazione, un gestionale medico generalista e una cartella clinica verticale risolvono tre problemi diversi. Che cosa fa ciascuno, quando basta, quando non basta, e perché molti studi ne usano due.',
  alternates: { canonical: '/che-software-serve' },
}

/* La pagina che il sito non aveva.
 *
 * Un medico estetico che cerca «gestionale medicina estetica» non trovava
 * niente di nostro: la home parla di «cartella clinica», che è la parola
 * giusta per noi e quella sbagliata per la ricerca. Qui le parole che si
 * cercano stanno dove è naturale che stiano, perché la pagina risponde
 * davvero alla domanda che le contiene.
 *
 * ⚠️ NESSUN CONCORRENTE È NOMINATO, ed è una scelta. La pubblicità
 * comparativa fra imprese è lecita (D.Lgs. 145/2007) se il confronto è su
 * caratteristiche oggettive e verificabili, e le prove le avremmo: sono
 * pubblicate sui loro siti. Ma è un rischio nostro in cambio di poco, e il
 * lettore sa già di chi si parla. Si confrontano CATEGORIE.
 *
 * ⚠️ E nessuna delle tre categorie è descritta come sbagliata. CXL, sulle
 * pagine di confronto: vanno trattate come landing per chi sta confrontando,
 * non come arringhe. Chi arriva qui ha già speso soldi su una di queste
 * caselle; dirgli che ha buttato via i soldi lo fa uscire. */

interface Categoria {
  nome: string
  cosaE: string
  fa: readonly string[]
  bastaSe: string
  nonBastaSe: string
  noi: boolean
}

const CATEGORIE: readonly Categoria[] = [
  {
    nome: 'Il portale di prenotazione',
    cosaE:
      'Una vetrina pubblica con dentro un’agenda. Il paziente ti trova cercando una prestazione nella sua città, vede le tue disponibilità e prenota da solo.',
    fa: [
      'Ti fa trovare da chi non ti conosce',
      'Prenotazioni a qualsiasi ora, anche a segreteria chiusa',
      'Promemoria automatici, e quindi meno visite perse',
      'Recensioni pubbliche e profilo',
    ],
    bastaSe:
      'Stai aprendo, l’agenda non è piena, e il problema numero uno è che i pazienti nuovi non sanno che esisti.',
    nonBastaSe:
      'La cartella è un allegato: un campo di testo e i file caricati a mano. Quello che serve dopo la visita (che cosa hai iniettato, dove, con che lotto, che cosa avevi spiegato prima) lì non c’è, o c’è in una forma che non si ritrova.',
    noi: false,
  },
  {
    nome: 'Il gestionale medico generalista',
    cosaE:
      'Il software di studio che fa tutto per tutte le specialità: agenda, anagrafica, fatturazione, invio al Sistema Tessera Sanitaria, e una cartella clinica a campi personalizzabili.',
    fa: [
      'Agenda e anagrafica dei pazienti',
      'Fatturazione e ciclo attivo',
      'Invio al Sistema Tessera Sanitaria',
      'Una cartella che configuri tu, campo per campo',
    ],
    bastaSe:
      'Lo studio è polispecialistico, la parte amministrativa pesa più di quella clinica, e hai qualcuno che il gestionale se lo configura e lo tiene configurato.',
    nonBastaSe:
      '«Campi personalizzabili» vuol dire che il modello clinico lo disegni tu, ogni volta, e che due colleghi nello stesso studio lo disegnano diverso. Il giorno in cui serve cercare (tutte le pazienti che hanno ricevuto un certo lotto, per esempio) si cerca dentro campi liberi, cioè non si cerca.',
    noi: false,
  },
  {
    nome: 'La cartella verticale',
    cosaE:
      'Un software che conosce una specialità sola e ne dà per scontato il lavoro: le procedure, i prodotti, le aree del corpo, i consensi che servono per quelle procedure.',
    fa: [
      'Il modulo di consenso giusto per quel trattamento, non uno per tutti',
      'Prodotto, lotto, unità e sede legati alla seduta',
      'Foto cliniche separate dal telefono e cifrate',
      'Registro di chi ha aperto quale cartella, e quando',
    ],
    bastaSe:
      'Il rischio che ti tiene sveglio non è l’agenda vuota: è dover dimostrare, fra due anni, che cosa avevi spiegato a una paziente e che cosa le avevi iniettato.',
    nonBastaSe:
      'Non ti porta pazienti nuovi e non fa marketing. Se il problema è farsi trovare, questa casella non lo risolve: lo risolve la prima.',
    noi: true,
  },
] as const

export default function CheSoftwareServe() {
  return (
    <Pagina
      href="/che-software-serve"
      occhiello="Confronto"
      titolo={
        <>
          Portale, gestionale, cartella verticale: che cosa{' '}
          <span className="accento-corsivo">serve</span> davvero
        </>
      }
      sommario={
        <>
          Tre categorie di software che risolvono tre problemi diversi, e che spesso vengono
          confuse perché si vendono allo stesso medico. Qui cosa fa ciascuna, quando basta e
          quando no. Fibonacci è la terza: lo diciamo subito, così sai da che parte stiamo.
        </>
      }
      larga
    >
      <section style={{ paddingBottom: 'var(--s-34)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <p className="text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Nessuna delle tre è sbagliata, e nessuna sostituisce le altre. La domanda utile non
              è «qual è il migliore», è «quale problema ho adesso».
            </p>
          </Reveal>
        </div>
      </section>

      {CATEGORIE.map((c) => (
        <section
          key={c.nome}
          className="fascia"
          style={c.noi ? { background: 'var(--accent-wash)' } : undefined}
        >
          <div className="gabbia gabbia-stretta">
            <Reveal className="passo">
              {c.noi && <Occhiello>Qui stiamo noi</Occhiello>}
              <h2
                className="text-[length:var(--display-2)]"
                style={{ maxWidth: '20ch', marginTop: c.noi ? 'var(--s-13)' : 0 }}
              >
                {c.nome}
              </h2>
              <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                {c.cosaE}
              </p>
            </Reveal>

            {/* Due passi: «che cos'è e cosa fa», poi «quando basta e quando
                no». Sul telefono la categoria intera faceva 785-878px su 721
                utili, e sono due domande diverse — separarle è anche più
                chiaro che tenerle insieme. */}
            <Reveal className="passo">
              <ul className="mt-[var(--s-34)]">
                {c.fa.map((f) => (
                  <li
                    key={f}
                    className="py-[var(--s-13)] text-[1.0625rem]"
                    style={{ borderTop: '1px solid var(--rule)' }}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="passo">
              <div className="mt-[var(--s-34)] grid gap-[var(--s-21)] md:grid-cols-2">
                <div>
                  <h3 className="text-[1.0625rem]">Basta, se</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {c.bastaSe}
                  </p>
                </div>
                <div>
                  <h3 className="text-[1.0625rem]">Non basta, se</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {c.nonBastaSe}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* La riga onesta: due caselle su tre, ed è normale. */}
      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello chiaro>La risposta che non trovi nei listini</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              Quasi sempre servono due caselle, non una
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
              Uno studio che deve riempire l’agenda e insieme tenere una documentazione che regga
              usa un portale per farsi trovare e una cartella per lavorare. Non è uno spreco: sono
              due mestieri. Chi ti dice che il suo prodotto fa entrambe le cose, di solito ne fa
              una bene e l’altra per finta.
            </p>
            <p
              className="mt-[var(--s-21)] text-[15px]"
              style={{
                color: 'var(--on-ink)',
                borderLeft: '2px solid var(--accent-onink)',
                paddingLeft: 'var(--s-13)',
              }}
            >
              Vale anche per noi, al contrario: Fibonacci non ti porta pazienti nuovi. Se usi un
              portale per farti trovare, tienilo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">Non sei sicuro di quale ti manchi?</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            Otto domande sulla tua documentazione. Le risposte restano nel tuo browser e l’esito
            si legge subito, senza lasciare l’email.
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/autovalutazione" className="btn btn-primario">
              Fai l&apos;autovalutazione
            </Link>
            <Link href="/prezzi" className="btn btn-secondario">
              Vedi i prezzi
            </Link>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/integrazioni" className="link-avanti">
              Con che cosa si integra Fibonacci, e con che cosa no
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
