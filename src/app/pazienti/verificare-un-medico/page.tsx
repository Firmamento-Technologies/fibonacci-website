import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { TestoPaziente, Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'

export const metadata: Metadata = {
  title: t('pazienti.verificareunmedico.meta_titolo_l_albo_dei_medici_e_come'),
  description:
    t('pazienti.verificareunmedico.meta_descrizione_la_federazione_degli_ordini_de'),
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
        occhiello={t('pazienti.verificareunmedico.prima_di_decidere')}
        titolo={t('pazienti.verificareunmedico.l_albo_dei_medici_e_come')}
        sommario={
          <>
            {t('pazienti.verificareunmedico.il_registro_degli_iscritti_e_pubblico')}
          </>
        }
      >
        <Sezione id="come" titolo={t('pazienti.verificareunmedico.come_si_fa')}>
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
              {t('pazienti.verificareunmedico.se_compare_e_iscritto_a_un')}
            </li>
          </ol>
          <p className="mt-[var(--s-13)]" style={{ color: 'var(--fg-muted)' }}>
            {t('pazienti.verificareunmedico.i_dati_arrivano_dagli_ordini_provinciali')}
          </p>
        </Sezione>

        <Sezione id="perche" titolo={t('pazienti.verificareunmedico.perche_conta_e_lo_dice_la')}>
          <p>
            Non è un consiglio nostro. La FNOMCeO ha invitato pubblicamente i cittadini a
            verificare che i professionisti che incontrano (anche quelli che vedono sui
            social) siano <strong>iscritti all’Albo</strong> e a controllarne{' '}
            <strong>i titoli</strong>.
          </p>
        </Sezione>

        <Sezione id="cosa-dice" titolo={t('pazienti.verificareunmedico.che_cosa_ti_dice_l_iscrizione')}>
          <p>
            <strong>{t('pazienti.verificareunmedico.ti_dice')}</strong> che è un medico abilitato, e che un Ordine risponde
            della sua condotta: se sbaglia, c’è un procedimento disciplinare che lo
            riguarda.
          </p>
          <p className="mt-[var(--s-13)]">
            <strong>{t('pazienti.verificareunmedico.non_ti_dice')}</strong> quale formazione abbia in medicina estetica. In
            Italia i percorsi in questo campo sono post-laurea (scuole, corsi, società
            scientifiche) e non compaiono come una specializzazione nell’albo. È
            esattamente per questo che la Federazione dice di verificare l’iscrizione{' '}
            <em>e i titoli</em>: sono due controlli diversi, e il secondo lo chiedi al
            medico.
          </p>
        </Sezione>

        {/* 🔴 **RISCRITTA IL 2026-08-13 — TD-115.** Diceva: *«resta un dato che
            il medico dichiara: il controllo che vale è quello che fai tu»*.
            Era il difetto centrale del canale, scritto per esteso: scaricava
            sul paziente un lavoro nostro, e insinuava il dubbio su ciò che
            stavamo mostrando. Vedi [[decisione-verifica-albo]].
            ⚠️ **Ma la sostituzione ⛔ non può essere «lo verifichiamo noi»**,
            perché oggi **non lo verifichiamo**: il controllo esiste come regola
            di ammissione, non ancora come procedura eseguita. ⇒ si scrive la
            **regola**, e si dice **cosa non copre** — che è la parte che quasi
            nessun portale scrive. */}
        <Sezione id="noi" titolo={t('pazienti.verificareunmedico.il_nostro_impegno_e_il_suo')}>
          <p>
            <strong>{t('pazienti.verificareunmedico.l_iscrizione_all_ordine_e_la')}</strong>Ordine e numero stanno<strong>in pagina</strong>, non
            nascosti in fondo: non perché tocchi a te controllarli, ma perché quello che
            diciamo resti <strong>riscontrabile</strong> da chiunque, te compreso.
          </p>
          <p className="mt-[var(--s-13)]">
            Il limite, detto chiaro: l’albo è pubblico, quindi nome e numero di un medico
            vero <strong>sono alla portata di chiunque</strong>. Confrontarli con il registro
            dimostra che quel numero esiste, ⛔ non che chi lo ha scritto sia quella persona.
            Sono due controlli diversi, e li stiamo tenendo distinti invece di confonderli in
            un bollino.
          </p>
          <p className="mt-[var(--s-13)]" style={{ color: 'var(--fg-muted)' }}>
            {t('pazienti.verificareunmedico.per_questo_su_queste_pagine_non')}
          </p>
        </Sezione>

        <Sezione id="poi" titolo={t('pazienti.verificareunmedico.da_qui')}>
          <p>
            <Link href="/pazienti/prima-di-un-trattamento" style={COLLEGAMENTO}>
              {t('pazienti.verificareunmedico.le_domande_da_fare_prima_di')}
            </Link>{' '}
            ·{' '}
            <Link href="/pazienti/consenso-informato" style={COLLEGAMENTO}>
              {t('pazienti.verificareunmedico.che_cos_e_il_consenso_informato')}
            </Link>
          </p>
        </Sezione>
      </TestoPaziente>
    </GuscioPaziente>
  )
}
