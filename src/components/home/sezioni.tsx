import { t } from '@/lib/testo'
import Link from 'next/link'
import { Reveal, RevealGruppo, RevealFiglio } from '@/components/ui/Reveal'
import { Occhiello, Foto, TestaSezione, Freccia } from '@/components/ui/elementi'
import { ProvaCatalogoConsensi } from '@/components/home/ProvaCatalogoConsensi'
import { ProvaComplicanze } from '@/components/home/ProvaComplicanze'
import { Bollini } from '@/components/Bollini'
import { BOLLINI_HOME } from '@/lib/bollini'

/* ══════════════════════════════════════════════════════════════════════════
   IL PROBLEMA, DETTO COME LO VIVE LUI
   Frasi corte. Se una potrebbe stare sul sito di un concorrente, è sbagliata.
   ══════════════════════════════════════════════════════════════════════════ */

const SERE = [
  {
    titolo: t('home.sezioni.le_schede_si_ricopiano_la_sera'),
    testo: t('home.sezioni.alle_otto_ribatti_gli_appunti_del'),
  },
  {
    titolo: t('home.sezioni.il_consenso_e_sempre_lo_stesso'),
    testo: t('home.sezioni.un_modulo_buono_per_tutto_firmato'),
  },
  {
    titolo: t('home.sezioni.le_foto_stanno_nel_telefono'),
    testo: t('home.sezioni.prima_e_dopo_nel_rullino_sincronizzate'),
  },
  {
    titolo: t('home.sezioni.poi_arriva_la_lettera'),
    testo: t('home.sezioni.otto_mesi_dopo_devi_dimostrare_cosa'),
  },
]

export function Problema() {
  return (
    <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
      <div className="gabbia">
        <div className="aurea">
          <Reveal className="passo">
            <Foto
              nome="cartella-a-mano"
              alt={t('home.sezioni.le_mani_di_un_medico_che')}
              proporzione="4 / 5"
              didascalia="La documentazione che dipende dalla memoria di stasera."
            />
          </Reveal>

          <div>
            <Reveal className="passo">
              <Occhiello>{t('home.sezioni.perche_esistiamo')}</Occhiello>
              <h2 className="mt-[var(--s-21)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                Nessuno apre uno studio per fare l&apos;<span className="accento-corsivo">archivista</span>
              </h2>
            </Reveal>

            <RevealGruppo className="passo mt-[var(--s-34)]">
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
    didascalia: t('home.sezioni.iniettivi'),
  },
  {
    nome: 'laser-mento',
    alt: 'Trattamento laser sul mento: operatrice e paziente indossano occhiali protettivi, il manipolo appoggia sul gel.',
    didascalia: t('home.sezioni.laser_ed_energie'),
  },
  {
    nome: 'trattamento-viso-pennello',
    alt: 'Applicazione di un prodotto sul viso con pennello durante un trattamento in ambulatorio.',
    didascalia: t('home.sezioni.peeling_e_biorivitalizzazione'),
  },
] as const

export function Procedure() {
  return (
    <section className="fascia">
      <div className="gabbia">
        <Reveal className="passo">
          <div className="flex flex-wrap items-end justify-between gap-[var(--s-21)]">
            <div>
              <Occhiello>{t('home.sezioni.per_chi_e')}</Occhiello>
              <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
                {t('home.sezioni.uno_studio_di_medicina_estetica_non')}
              </h2>
            </div>
            <p className="text-[15px]" style={{ color: 'var(--fg-muted)', maxWidth: '30ch' }}>
              {t('home.sezioni.un_medico_solo_o_un_equipe')}
            </p>
          </div>
        </Reveal>

        <RevealGruppo className="mt-[var(--s-34)] grid gap-[var(--s-21)] md:grid-cols-3" passo={0.1}>
          {PROCEDURE.map((p) => (
            <RevealFiglio key={p.nome} className="passo">
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
    occhiello: t('home.sezioni.consensi'),
    titolo: t('home.sezioni.il_modulo_giusto_per_quel_trattamento'),
    testo:
      t('home.sezioni.un_modello_per_ogni_procedura_tossina'),
    aCosaServe: 'Alla domanda «me lo aveva detto?» risponde un documento che nomina quel rischio.',
    /* 🔄 Era `/schermate/catalogo-consensi.png`, l'immagine più usata del sito.
       Una lista in figura si guarda; qui la domanda del medico è UNA — «il
       modulo per quello che faccio io c'è?» — e una figura non può rispondere.
       Ora risponde il catalogo vero, 115 procedure prese dall'EMR. */
    immagine: { tipo: 'prova', file: 'catalogo' },
    alt: '',
  },
  {
    occhiello: t('home.sezioni.sedute'),
    titolo: t('home.sezioni.prodotto_lotto_sede_unita'),
    testo:
      t('home.sezioni.le_aree_si_segnano_sulla_mappa'),
    aCosaServe: 'Al controllo dopo due mesi sai cosa avevi fatto, e il richiamo parte da lì.',
    immagine: { tipo: 'foto', file: 'iniezione-mento', didascalia: t('home.sezioni.quello_che_entra_in_cartella_mentre') },
    alt: 'Trattamento iniettivo al mento eseguito con guanti, la paziente distesa con gli occhi chiusi.',
  },
  {
    /* 🔄 Qui c'era «Registro accessi · Chi ha aperto quella cartella», con la
       schermata del registro. Tolta il 2026-08-11 su rilievo dell'utente, e il
       rilievo è giusto: il registro accessi è il primo motivo di sanzione nei
       provvedimenti del Garante — cioè è valore per CHI VENDE. Nessun medico
       sceglie un gestionale perché registra chi apre le cartelle.
       Al suo posto la metà mancante della promessa del sito: il consenso
       elenca i rischi, e quando uno si avvera **c'è dove scriverlo**. È anche
       la frase con cui si apre `complicanze.ts` nell'applicazione.
       ⚠️ Il registro accessi non sparisce dal prodotto né dal sito: resta
       raccontato in /sicurezza-e-dati, dove chi lo cerca lo cerca davvero. */
    occhiello: t('home.sezioni.esiti_e_complicanze'),
    titolo: t('home.sezioni.se_succede_c_e_dove_scriverlo'),
    testo:
      t('home.sezioni.ecchimosi_nodulo_occlusione_vascolare_dodici_voci'),
    aCosaServe:
      'Un consenso elenca i rischi; se poi si avvera e non è scritto da nessuna parte, in una contestazione manca proprio la seconda metà.',
    immagine: { tipo: 'prova', file: 'complicanze' },
    alt: '',
  },
  {
    occhiello: t('home.sezioni.studio'),
    titolo: t('home.sezioni.agenda_pazienti_richiami'),
    testo:
      t('home.sezioni.le_cose_ordinarie_fatte_bene_calendario'),
    aCosaServe: 'Un posto solo. L’agenda e la cartella smettono di essere due programmi separati.',
    immagine: { tipo: 'foto', file: 'trattamento-corpo', didascalia: t('home.sezioni.la_giornata_dello_studio_in_un') },
    alt: 'Trattamento corpo con manipolo a ultrasuoni sull’addome, eseguito in ambulatorio.',
  },
] as const

/* ⚠️ RESTITUISCE UN ELENCO DI SEZIONI, NON UNA SEZIONE.
 *
 * Era una sezione sola con dentro le quattro capacità in colonna: **2.643px,
 * il 327% di una schermata** (misurato con `scripts/altezza-pagine.mjs`). In un
 * sito che scorre di continuo andava bene; in un percorso a tappe voleva dire
 * che chi arrivava qui perdeva di vista la freccia per proseguire e non sapeva
 * più che ci fosse un seguito.
 *
 * Ora sono cinque schermate: l'insegna, e una per capacità — con la sua prova
 * da toccare accanto. Nessuna parola tolta, e la cosa singola torna a
 * occupare uno schermo intero invece di un quarto.
 *
 * ⛔ NON è un componente: `Children.toArray` **non attraversa un Fragment**,
 * quindi `<Capacita />` sarebbe rimasta una tappa sola qualunque cosa
 * restituisse. Un array invece viene appiattito, e ogni elemento diventa una
 * tappa vera. Perciò si chiama in JSX come `{tappeCapacita()}`. */
export function tappeCapacita() {
  return [
    <section key="insegna" id="cosa-fa" className="fascia" style={{ background: 'var(--bg-sunk)' }}>
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
      </div>
    </section>,

    ...CAPACITA.map((c, i) => (
      <section
        key={c.titolo}
        className="fascia"
        style={{ background: 'var(--bg-sunk)' }}
      >
        <div className="gabbia">
          <Reveal>
            <div className={`aurea ${i % 2 === 1 ? 'aurea-inversa' : ''}`}>
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <Occhiello>{c.occhiello}</Occhiello>
                <h3 className="mt-[var(--s-13)] text-[length:var(--display-3)]" style={{ maxWidth: '15ch' }}>
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
              {c.immagine.tipo === 'prova' ? (
                /* Un pezzo di prodotto in pagina, non una sua fotografia.
                   Vedi `ProvaCatalogoConsensi.tsx` per il perché. */
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  {c.immagine.file === 'complicanze' ? <ProvaComplicanze /> : <ProvaCatalogoConsensi />}
                </div>
              ) : (
                /* ⚠️ Il ramo `schermata` è stato tolto il 2026-08-11 e NON è
                   una svista: in questa sezione non resta nessuna figura
                   dell'applicazione, e il compilatore l'ha detto da sé
                   («'foto' e 'schermata' non hanno sovrapposizione»). Se un
                   domani ne torna una, il tipo si riapre e il ramo va
                   rimesso — non aggiungere una schermata lasciando questo
                   codice a indovinare. */
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
        </div>
      </section>
    )),
  ]
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
              <Occhiello>{t('home.sezioni.foto_cliniche')}</Occhiello>
              <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                {t('home.sezioni.il_prima_e_dopo_esce_dal')}
              </h2>
              <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                {t('home.sezioni.le_fotografie_si_scattano_dall_applicazione')}
              </p>
              <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg)', borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}>
                {t('home.sezioni.una_foto_del_viso_di_una')}
              </p>
            </div>
          </Reveal>
          <Reveal da="destra">
            <Foto
              nome="specchio-risultato"
              alt={t('home.sezioni.una_donna_seduta_in_ambulatorio_guarda')}
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
    titolo: t('home.sezioni.il_verificatore_e_pubblico'),
    testo: t('home.sezioni.chiunque_carica_un_documento_e_controlla'),
    azione: { testo: t('home.sezioni.verifica_un_documento'), href: '/verifica' },
  },
  {
    titolo: t('home.sezioni.i_contratti_si_leggono_prima'),
    testo: t('home.sezioni.trattamento_dei_dati_sub_responsabili_misure'),
    azione: { testo: t('home.sezioni.leggi_i_documenti'), href: '/sicurezza-e-dati' },
  },
  {
    titolo: t('home.sezioni.diciamo_cosa_non_c_e'),
    testo: t('home.sezioni.firma_qualificata_e_conservazione_a_norma'),
    azione: { testo: t('home.sezioni.che_cosa_manca'), href: '/domande#cosa-manca' },
  },
] as const

export function Prove() {
  return (
    <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
      <div className="gabbia">
        <Reveal className="passo">
          <TestaSezione
            occhiello="Come si controlla"
            titolo="Non chiediamo di fidarsi"
            sommario="Un fornitore sanitario che dice «siamo sicuri» sta chiedendo un atto di fede. Queste tre cose si controllano senza parlare con noi."
          />
        </Reveal>

        <RevealGruppo className="mt-[var(--s-55)] grid gap-[var(--s-21)] md:grid-cols-3">
          {PROVE.map((p) => (
            <RevealFiglio className="passo" key={p.titolo}>
              <div className="foglio flex h-full flex-col" style={{ padding: 'var(--pad-foglio, var(--s-34))' }}>
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
   GARANZIE — i bollini, e accanto a ognuno come si controlla
   ══════════════════════════════════════════════════════════════════════════

   Sta dopo «Come si controlla» e non prima, perché è il gradino successivo:
   là si dice che non chiediamo un atto di fede, qui si mostrano le garanzie
   una per una con la fonte accanto.

   ⛔ I quattro bollini scelti in `BOLLINI_HOME` NON ripetono le tre prove
   della sezione precedente: là il verificatore, i contratti e i limiti; qui
   la giurisdizione, la filiera, il codice di condotta e l'obbligo del 2029.
   Se un giorno le due sezioni cominciassero a dire la stessa cosa, se ne
   toglie una: due sezioni che si ripetono valgono meno di una sola. */

export function Garanzie() {
  return (
    <section className="fascia" id="garanzie">
      <div className="gabbia">
        <Reveal className="passo">
          <TestaSezione
            occhiello="Il valore legale"
            titolo={
              <>
                Il dato resta in Italia, e la <span className="accento-corsivo">prova</span> è
                accanto a ogni riga
              </>
            }
            sommario="Si controllano dall’esterno, senza chiedere il permesso a noi. Compresa la terza, che non abbiamo perché oggi non ce l’ha nessuno."
          />
        </Reveal>

        <div className="passo mt-[var(--s-34)]">
          <Bollini ids={BOLLINI_HOME} />

          <Reveal>
            <Link href="/conformita-europea" className="link-avanti mt-[var(--s-21)]">
              Tutte e nove, con gli articoli citati
              <Freccia />
            </Link>
          </Reveal>
        </div>
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
              <Occhiello>{t('home.sezioni.le_domande_scomode')}</Occhiello>
              <h2 className="mt-[var(--s-21)] text-[length:var(--display-2)]" style={{ maxWidth: '14ch' }}>
                {t('home.sezioni.quelle_che_faresti_tu')}
              </h2>
              <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                {t('home.sezioni.se_una_risposta_ti_sembra_evasiva')}
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
