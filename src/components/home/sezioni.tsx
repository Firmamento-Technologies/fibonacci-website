import Link from 'next/link'
import { Reveal, RevealGruppo, RevealFiglio } from '@/components/ui/Reveal'
import { Occhiello, Foto, Schermata, TestaSezione, Freccia } from '@/components/ui/elementi'

/* ══════════════════════════════════════════════════════════════════════════
   IL PROBLEMA, DETTO COME LO VIVE LUI
   Frasi corte. Se una potrebbe stare sul sito di un concorrente, è sbagliata.
   ══════════════════════════════════════════════════════════════════════════ */

const SERE = [
  {
    titolo: 'Le schede si ricopiano la sera',
    testo: 'Alle otto ribatti gli appunti del giorno, e di due pazienti non ricordi la diluizione.',
  },
  {
    titolo: 'Il consenso è sempre lo stesso',
    testo: 'Un modulo buono per tutto, firmato in sala d’attesa. Non nomina i rischi di quel trattamento.',
  },
  {
    titolo: 'Le foto stanno nel telefono',
    testo: 'Prima e dopo, nel rullino, sincronizzate su un servizio americano insieme a quelle di famiglia.',
  },
  {
    titolo: 'Poi arriva la lettera',
    testo: 'Otto mesi dopo devi dimostrare cosa avevi spiegato. Hai un modulo generico e la tua memoria.',
  },
]

export function Problema() {
  return (
    <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
      <div className="gabbia">
        <div className="aurea">
          <Reveal>
            <Foto
              nome="cartella-a-mano"
              alt="Le mani di un medico che compila a penna un modulo su una cartellina, con le mani della paziente appoggiate al tavolo dall'altra parte."
              proporzione="4 / 5"
              didascalia="La documentazione che dipende dalla memoria di stasera."
            />
          </Reveal>

          <div>
            <Reveal>
              <Occhiello>Perché esistiamo</Occhiello>
              <h2 className="mt-[var(--s-21)] text-[clamp(1.85rem,4.2vw,2.9rem)]" style={{ maxWidth: '16ch' }}>
                Nessuno apre uno studio per fare l&apos;<span className="accento-corsivo">archivista</span>
              </h2>
            </Reveal>

            <RevealGruppo className="mt-[var(--s-34)]">
              {SERE.map((s, i) => (
                <RevealFiglio key={s.titolo}>
                  <div
                    className="grid gap-[var(--s-21)] py-[var(--s-21)] sm:grid-cols-[2.5rem_1fr]"
                    style={{ borderTop: '1px solid var(--rule)' }}
                  >
                    <span className="numero" style={{ paddingTop: 5 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem]">{s.titolo}</h3>
                      <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                        {s.testo}
                      </p>
                    </div>
                  </div>
                </RevealFiglio>
              ))}
            </RevealGruppo>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   LA FASCIA DELLE PROCEDURE
   Tre fotografie a tutta larghezza. Servono a una cosa sola: far riconoscere
   al medico estetico il proprio mestiere prima ancora di leggere. Un software
   sanitario generico non può metterle, ed è esattamente il punto.
   ══════════════════════════════════════════════════════════════════════════ */

const PROCEDURE = [
  {
    nome: 'iniezione-viso',
    alt: 'Primo piano di un trattamento iniettivo alla glabella: mani con guanti azzurri reggono la siringa mentre la paziente tiene gli occhi chiusi.',
    didascalia: 'Iniettivi',
  },
  {
    nome: 'laser-mento',
    alt: 'Trattamento laser sul mento: operatrice e paziente indossano occhiali protettivi, il manipolo appoggia sul gel.',
    didascalia: 'Laser ed energie',
  },
  {
    nome: 'trattamento-viso-pennello',
    alt: 'Applicazione di un prodotto sul viso con pennello durante un trattamento in ambulatorio.',
    didascalia: 'Peeling e biorivitalizzazione',
  },
] as const

export function Procedure() {
  return (
    <section className="fascia">
      <div className="gabbia">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-[var(--s-21)]">
            <div>
              <Occhiello>Per chi è</Occhiello>
              <h2 className="mt-[var(--s-13)] text-[clamp(1.6rem,3.4vw,2.3rem)]" style={{ maxWidth: '20ch' }}>
                Uno studio di medicina estetica, non un ambulatorio qualsiasi
              </h2>
            </div>
            <p className="text-[15px]" style={{ color: 'var(--fg-muted)', maxWidth: '30ch' }}>
              Un medico solo o un&apos;équipe fino a cinque. Se cerchi soprattutto cassa e
              magazzino, non siamo noi: te lo diciamo qui invece che alla terza chiamata.
            </p>
          </div>
        </Reveal>

        <RevealGruppo className="mt-[var(--s-34)] grid gap-[var(--s-21)] md:grid-cols-3" passo={0.1}>
          {PROCEDURE.map((p) => (
            <RevealFiglio key={p.nome}>
              <Foto nome={p.nome} alt={p.alt} proporzione="3 / 4" didascalia={p.didascalia} />
            </RevealFiglio>
          ))}
        </RevealGruppo>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   LE QUATTRO COSE CHE FA
   Una per riquadro, ognuna con una schermata VERA. Baymard: le immagini
   dell'interfaccia servono abbondanti e in alto, non relegate in fondo.
   ══════════════════════════════════════════════════════════════════════════ */

/* Due schermate e due fotografie, alternate.
 *
 * Baymard chiede immagini vere dell'interfaccia, in alto e in quantità, e la
 * home ne ha comunque tre contando quella del primo schermo. Ma quattro
 * schermate di fila, tutte bianche e azzurre, si somigliano fra loro e la
 * pagina diventa un catalogo di finestre. Le schermate restano dove mostrano
 * qualcosa che una foto non può mostrare (il catalogo dei consensi, gli
 * accessi anomali in rosso); dove il punto è il gesto, va il gesto.
 * La sequenza completa dell'interfaccia sta in /come-funziona, che di
 * schermate ne ha cinque. */
const CAPACITA = [
  {
    occhiello: 'Consensi',
    titolo: 'Il modulo giusto per quel trattamento',
    testo:
      'Un modello per ogni procedura: tossina, filler, laser, peeling. Ognuno con i rischi e le alternative di quella procedura, non di «un trattamento».',
    aCosaServe: 'Alla domanda «me lo aveva detto?» risponde un documento che nomina quel rischio.',
    immagine: { tipo: 'schermata', file: '/schermate/catalogo-consensi.png' },
    alt: 'Il catalogo dei consensi in Fibonacci, con i modelli raggruppati per categoria e il pulsante di anteprima accanto a ciascuno.',
  },
  {
    occhiello: 'Sedute',
    titolo: 'Prodotto, lotto, sede, unità',
    testo:
      'Le aree si segnano sulla mappa del viso e del corpo. Prodotto e lotto restano legati alla seduta, non a un foglio da ritrovare.',
    aCosaServe: 'Al controllo dopo due mesi sai cosa avevi fatto, e il richiamo parte da lì.',
    immagine: { tipo: 'foto', file: 'iniezione-mento', didascalia: 'Quello che entra in cartella mentre lo fai.' },
    alt: 'Trattamento iniettivo al mento eseguito con guanti, la paziente distesa con gli occhi chiusi.',
  },
  {
    occhiello: 'Registro accessi',
    titolo: 'Chi ha aperto quella cartella',
    testo:
      'Ogni lettura finisce in un registro, e un controllo automatico segnala gli accessi anomali: fuori orario, da utenze disattivate, senza una cura in corso.',
    aCosaServe:
      'I provvedimenti del Garante sanzionano quasi sempre questo: accessi non giustificati, e nessuno che se ne accorga.',
    immagine: { tipo: 'schermata', file: '/schermate/registro-accessi.png' },
    alt: 'Il registro accessi di Fibonacci con i filtri per data, azione ed esito, e tre righe evidenziate in rosso che segnalano accessi anomali.',
  },
  {
    occhiello: 'Studio',
    titolo: 'Agenda, pazienti, richiami',
    testo:
      'Le cose ordinarie fatte bene: calendario, ricerca per codice fiscale, promemoria di richiamo. Senza uscire dalla cartella.',
    aCosaServe: 'Un posto solo. L’agenda e la cartella smettono di essere due programmi separati.',
    immagine: { tipo: 'foto', file: 'trattamento-corpo', didascalia: 'La giornata dello studio, in un calendario solo.' },
    alt: 'Trattamento corpo con manipolo a ultrasuoni sull’addome, eseguito in ambulatorio.',
  },
] as const

export function Capacita() {
  return (
    <section id="cosa-fa" className="fascia" style={{ background: 'var(--bg-sunk)' }}>
      <div className="gabbia">
        <Reveal>
          <TestaSezione
            occhiello="Cosa fa"
            titolo={
              <>
                Quattro cose, per come lavora davvero uno studio di{' '}
                <span className="accento-corsivo">estetica</span>
              </>
            }
            sommario="Non è un gestionale con sopra un modulo sanitario. È una cartella costruita attorno alle procedure che fai."
          />
        </Reveal>

        <div className="mt-[var(--s-89)] space-y-[var(--s-89)]">
          {CAPACITA.map((c, i) => (
            <Reveal key={c.titolo}>
              <div className={`aurea ${i % 2 === 1 ? 'aurea-inversa' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <Occhiello>{c.occhiello}</Occhiello>
                  <h3 className="mt-[var(--s-13)] text-[clamp(1.4rem,2.8vw,1.9rem)]" style={{ maxWidth: '15ch' }}>
                    {c.titolo}
                  </h3>
                  <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                    {c.testo}
                  </p>
                  <p
                    className="mt-[var(--s-21)] text-[15px]"
                    style={{ color: 'var(--fg)', borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}
                  >
                    {c.aCosaServe}
                  </p>
                </div>
                {c.immagine.tipo === 'schermata' ? (
                  <Schermata
                    file={c.immagine.file}
                    alt={c.alt}
                    className={i % 2 === 1 ? 'lg:order-1' : ''}
                  />
                ) : (
                  <Foto
                    nome={c.immagine.file}
                    alt={c.alt}
                    proporzione="4 / 3"
                    didascalia={'didascalia' in c.immagine ? c.immagine.didascalia : undefined}
                    className={i % 2 === 1 ? 'lg:order-1' : ''}
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   LE FOTO CLINICHE
   Sezione breve con una fotografia grande. Il tema è delicato e merita spazio
   proprio: sono dati sanitari che oggi vivono nel rullino di un telefono.
   ══════════════════════════════════════════════════════════════════════════ */

export function FotoCliniche() {
  return (
    <section className="fascia">
      <div className="gabbia">
        <div className="aurea aurea-inversa">
          <Reveal>
            <div className="lg:order-2">
              <Occhiello>Foto cliniche</Occhiello>
              <h2 className="mt-[var(--s-13)] text-[clamp(1.6rem,3.4vw,2.3rem)]" style={{ maxWidth: '16ch' }}>
                Il prima e dopo esce dal telefono
              </h2>
              <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                Le fotografie si scattano dall&apos;applicazione e restano cifrate, legate alla
                seduta e alla paziente. Non passano dal rullino, non finiscono in un backup
                automatico, non si condividono per sbaglio.
              </p>
              <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg)', borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}>
                Una foto del viso di una paziente è un dato sanitario. Perderla è una violazione da
                notificare, non un dispiacere.
              </p>
            </div>
          </Reveal>
          <Reveal da="destra">
            <Foto
              nome="specchio-risultato"
              alt="Una donna seduta in ambulatorio guarda il proprio riflesso in uno specchio a mano dopo un trattamento estetico."
              proporzione="4 / 3"
              className="lg:order-1"
              didascalia="Il risultato si valuta sul confronto, e il confronto va conservato bene."
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   PROVE — senza testimonial (L. 145/2018), senza contatori, senza loghi finti
   ══════════════════════════════════════════════════════════════════════════ */

const PROVE = [
  {
    titolo: 'Il verificatore è pubblico',
    testo: 'Chiunque carica un documento e controlla l’impronta. Senza account, e anche contro di noi.',
    azione: { testo: 'Verifica un documento', href: '/verifica' },
  },
  {
    titolo: 'I contratti si leggono prima',
    testo: 'Trattamento dei dati, sub-responsabili, misure di sicurezza. Online, non dietro un modulo.',
    azione: { testo: 'Leggi i documenti', href: '/sicurezza-e-dati' },
  },
  {
    titolo: 'Diciamo cosa non c’è',
    testo: 'Firma qualificata e conservazione a norma non sono attive, e infatti non sono nel listino.',
    azione: { testo: 'Che cosa manca', href: '/domande#cosa-manca' },
  },
] as const

export function Prove() {
  return (
    <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
      <div className="gabbia">
        <Reveal>
          <TestaSezione
            occhiello="Come si controlla"
            titolo="Non chiediamo di fidarsi"
            sommario="Un fornitore sanitario che dice «siamo sicuri» sta chiedendo un atto di fede. Queste tre cose si controllano senza parlare con noi."
          />
        </Reveal>

        <RevealGruppo className="mt-[var(--s-55)] grid gap-[var(--s-21)] md:grid-cols-3">
          {PROVE.map((p) => (
            <RevealFiglio key={p.titolo}>
              <div className="foglio flex h-full flex-col" style={{ padding: 'var(--s-34)' }}>
                <h3 className="text-[1.3rem]">{p.titolo}</h3>
                <p className="mt-[var(--s-13)] flex-1 text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                  {p.testo}
                </p>
                <Link href={p.azione.href} className="link-avanti mt-[var(--s-21)]">
                  {p.azione.testo}
                  <Freccia />
                </Link>
              </div>
            </RevealFiglio>
          ))}
        </RevealGruppo>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   OBIEZIONI — le domande dure, con la risposta vera e corta
   ══════════════════════════════════════════════════════════════════════════ */

const OBIEZIONI = [
  {
    d: 'Ho dieci anni di pazienti altrove. Li perdo?',
    r: 'No. Importiamo anagrafiche e storico da un file esportato dal tuo gestionale, e la migrazione è compresa. Se il tuo fornitore non esporta niente, te lo diciamo prima di firmare.',
  },
  {
    d: 'Se domani chiudete, i dati dove finiscono?',
    r: 'Sono tuoi: il titolare sei tu, noi trattiamo per conto tuo. Esporti tutto quando vuoi, in un formato leggibile senza di noi. È scritto nel contratto, non è una promessa a voce.',
  },
  {
    d: 'Quanto ci metto a impararlo?',
    r: 'Una prima visita completa la fai il primo giorno. Configurazione dello studio e formazione iniziale sono comprese nell’attivazione.',
  },
  {
    d: 'Serve internet? E se salta la linea?',
    r: 'Sì, serve, e se cade non apri una cartella nuova. È il limite di un servizio che tiene i dati su server nostri. In cambio: backup, cifratura, e un portatile rotto non ti costa niente.',
  },
  {
    d: 'I dati dei pazienti addestrano l’intelligenza artificiale?',
    r: 'No, ed è scritto nei contratti con i fornitori dei modelli, che trovi nella pagina dei sub-responsabili.',
  },
] as const

export function Obiezioni() {
  return (
    <section id="obiezioni" className="fascia">
      <div className="gabbia">
        <div className="aurea">
          <Reveal>
            <div>
              <Occhiello>Le domande scomode</Occhiello>
              <h2 className="mt-[var(--s-21)] text-[clamp(1.85rem,4.2vw,2.9rem)]" style={{ maxWidth: '14ch' }}>
                Quelle che faresti tu
              </h2>
              <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                Se una risposta ti sembra evasiva, scrivicelo. La riscriviamo.
              </p>
              <Link href="/domande" className="link-avanti mt-[var(--s-21)]">
                Tutte le domande
                <Freccia />
              </Link>
            </div>
          </Reveal>

          <RevealGruppo>
            {OBIEZIONI.map((o) => (
              <RevealFiglio key={o.d}>
                <details className="group" style={{ borderTop: '1px solid var(--rule)', padding: 'var(--s-21) 0' }}>
                  <summary
                    className="flex cursor-pointer items-start justify-between gap-[var(--s-21)] text-[1.0625rem]"
                    style={{ fontFamily: 'var(--font-display)', listStyle: 'none' }}
                  >
                    {o.d}
                    <span
                      aria-hidden="true"
                      className="shrink-0 transition-transform group-open:rotate-45"
                      style={{ color: 'var(--accent)', fontSize: 21, lineHeight: 1 }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)', maxWidth: '52ch' }}>
                    {o.r}
                  </p>
                </details>
              </RevealFiglio>
            ))}
          </RevealGruppo>
        </div>
      </div>
    </section>
  )
}
