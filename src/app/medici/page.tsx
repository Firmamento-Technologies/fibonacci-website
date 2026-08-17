import { t } from '@/lib/testo'
import { Fragment } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'

export const metadata: Metadata = {
  title: t('medici.meta_titolo_hai_ricevuto_una_richiesta_tra'),
  description:
    t('medici.meta_descrizione_perche_ti_e_arrivata_che_cosa'),
  alternates: { canonical: '/medici' },
}

/* La pagina che il medico raggiunge CLICCANDO, e per questo può parlare.
 *
 * 🔑 È il perno di una decisione legale, non una scelta di stile. Il D.Lgs.
 * 70/2003 art. 2 c. 1 lett. f) esclude dalle comunicazioni commerciali «le
 * informazioni che consentono un accesso diretto all'attività dell'impresa,
 * come un nome di dominio»: nell'email possiamo mettere l'indirizzo del sito.
 * Ma la stessa lettera cattura ciò che promuove «in modo diretto o indiretto»,
 * quindi la frase «con Fibonacci la prenotazione è automatica» dentro l'email
 * sarebbe promozione a un indirizzo preso dal web, cioè il caso che il Garante
 * descrive al §6.2 delle linee guida contro lo spam.
 *
 * ⇒ L'email è la porta, questa pagina è il discorso. L'art. 130 del Codice
 * privacy governa l'INVIO, non il nostro sito: chi arriva qui ci è arrivato da
 * solo, e a quel punto possiamo dire tutto.
 *
 * ⛔ COSA NON VA MESSO QUI, e vale anche quando sarà tentante:
 *  · nessun nome di medico e nessun numero di iscritti all'elenco usato come
 *    prova sociale: sarebbero persone che non hanno acconsentito a comparire
 *    in una pagina promozionale;
 *  · nessuna promessa su quanti pazienti arriveranno. Non lo sappiamo, e
 *    prometterlo a un iscritto all'albo è il tipo di richiamo che l'Ordine
 *    guarda male anche quando a farlo è un fornitore;
 *  · nessuna chiamata a terzi (font remoti, mappe, analitica). Chi apre questa
 *    pagina viene da un'email che non aveva chiesto: caricargli qualcosa da
 *    fuori sarebbe un secondo trattamento sopra il primo.
 *
 * ⚠️ E la pagina deve funzionare per DUE lettori: chi ha appena ricevuto una
 * richiesta, e chi capita qui senza sapere chi siamo. La prima sezione parla
 * al primo senza dare per scontato che sia lui.
 *
 * 🔎 Difetti trovati GUARDANDOLA, con tipi, lint e collaudo tutti verdi:
 *  1. le sezioni scritte con stili a mano andavano a filo del bordo sul
 *     telefono e avevano gli h2 più piccoli del corpo. La cura non era
 *     aggiustare i margini: era usare `gabbia` + `prosa`, che esistono;
 *  2. avvolgere ogni coppia titolo-paragrafo in un `<div>` rompeva la
 *     spaziatura di `.prosa`, che sta in `> * + *`, cioè sui figli DIRETTI.
 *     Da qui i `<Fragment>`. */

const COSA_CAMBIA = [
  {
    titolo: t('medici.la_richiesta_arriva_in_agenda_non'),
    testo:
      t('medici.oggi_ti_scriviamo_un_email_e'),
  },
  {
    titolo: t('medici.i_dati_della_persona_sono_gia'),
    testo:
      t('medici.nome_contatto_e_se_ha_voluto'),
  },
  {
    titolo: t('medici.se_rifiuti_i_dati_sanitari_si'),
    testo:
      t('medici.chi_ha_scritto_non_e_ancora'),
  },
]

const RIGHE_ELENCO = [
  {
    d: 'Perché sono nell’elenco se non vi ho mai contattato?',
    r: 'L’elenco è compilato leggendo i siti pubblici degli studi. I dati che riportiamo sono quelli che il tuo sito già pubblica, e che la legge sul commercio elettronico ti obbliga a pubblicare: nome, indirizzo, contatti, prestazioni dichiarate. Nessun dato clinico, nessun prezzo, nessuna foto, nessuna recensione, nessun punteggio.',
  },
  {
    d: 'Chi decide in che ordine compaiono gli studi?',
    r: 'Un criterio scritto e pubblico, che non si può comprare. Non esiste una posizione «in evidenza», nemmeno gratuita: appena esiste la casella, esiste il prezzo per averla.',
  },
  {
    d: 'Un dato è sbagliato.',
    r: 'Si corregge, senza ritardo. Scrivici e indica quale: la scheda riporta sempre la data dell’ultima lettura del tuo sito.',
  },
  {
    d: 'Non voglio comparire.',
    r: 'Il collegamento in fondo a ogni messaggio toglie la scheda e mette il tuo sito in un elenco di esclusione permanente: non verrà più letto neanche negli aggiornamenti successivi. Non serve motivare la richiesta e non c’è nessuna eccezione.',
  },
]

export default function MediciPage() {
  return (
    <Pagina
      href="/medici"
      tappe={false}
      occhiello={t('medici.per_il_medico')}
      titolo={t('medici.hai_ricevuto_una_richiesta_tramite_fibonacci')}
      sommario={
        <>
          {t('medici.una_persona_ti_ha_scritto_passando')}
        </>
      }
    >
      <section className="gabbia">
        <div className="prosa">
          <h2>{t('medici.che_cosa_siamo')}</h2>
          <p>
            Fibonacci è due cose. Un <strong>elenco pubblico</strong> di medici e studi di
            medicina estetica in Italia, compilato leggendo i siti degli studi, che serve a
            chi cerca uno specialista. E un <strong>gestionale</strong> per lo studio:
            cartella clinica, consensi, agenda, magazzino.
          </p>
          <p>
            {t('medici.le_due_cose_sono_collegate_da')}
          </p>
        </div>
      </section>

      <section className="gabbia">
        <div className="prosa">
          <h2>{t('medici.che_cosa_cambia_se_le_richieste')}</h2>
          {COSA_CAMBIA.map((x) => (
            <Fragment key={x.titolo}>
              <h3>{x.titolo}</h3>
              <p>{x.testo}</p>
            </Fragment>
          ))}
          <p>
            Il listino è <Link href="/prezzi">pubblico</Link>, e{' '}
            <Link href="/come-funziona">qui</Link> c’è come funziona senza dover parlare
            con nessuno.
          </p>
        </div>
      </section>

      <section className="gabbia">
        <div className="prosa">
          <h2>{t('medici.sull_elenco')}</h2>
          {RIGHE_ELENCO.map((x) => (
            <Fragment key={x.d}>
              <h3>{x.d}</h3>
              <p>{x.r}</p>
            </Fragment>
          ))}
          <p>
            L’informativa completa, con la base giuridica e tutti i tuoi diritti, è{' '}
            <Link href="/elenco-medici">qui</Link>.
          </p>
        </div>
      </section>

      {/* ⚠️ Questa sezione sta in fondo di proposito. Chi è arrivato perché ha
          ricevuto una richiesta ha una cosa sola da fare, ed è rispondere alla
          persona: metterle davanti un invito a comprare qualcosa sarebbe
          esattamente il gesto che ci siamo vietati nell'email. */}
      <section className="gabbia">
        <div className="prosa">
          <h2>{t('medici.se_vuoi_parlarne')}</h2>
          <p>
            Scrivici a <a href="mailto:info@fibonaccimedica.it">info@fibonaccimedica.it</a>
            . Non richiamiamo nessuno che non ce l’abbia chiesto.
          </p>
        </div>
      </section>
    </Pagina>
  )
}
