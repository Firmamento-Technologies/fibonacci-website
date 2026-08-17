import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { TestoPaziente, Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'

export const metadata: Metadata = {
  title: t('pazienti.consensoinformato.meta_titolo_il_consenso_informato_che_cos_'),
  description:
    t('pazienti.consensoinformato.meta_descrizione_nessun_trattamento_sanitario_p'),
  alternates: { canonical: '/pazienti/consenso-informato' },
}

/* Fonte primaria: L. 219/2017 art. 1, letta nel testo
 * (`UniversalCorpus 20_diritto-impresa-italia/13-sanita-e-professioni-sanitarie/
 * legge-219-2017-consenso-informato.md`). ⛔ Nessuna riga qui è scritta a
 * memoria: dove la pagina afferma un diritto, quel diritto sta in un comma.
 *
 * ⚠️ Attribuzione giurisprudenziale: in medicina estetica l'obbligo
 * informativo rafforzato è **Cass. 29827/2019**, non 26104/2022 — il progetto
 * ha già corretto questa citazione in 232 file il 2026-08-07, e ⛔ non va
 * reintrodotta sbagliata qui. */
export default function Page() {
  return (
    <GuscioPaziente>
      <TestoPaziente
        occhiello={t('pazienti.consensoinformato.prima_di_decidere')}
        titolo={t('pazienti.consensoinformato.il_consenso_informato_che_cos_e')}
        sommario={
          <>
            {t('pazienti.consensoinformato.non_e_un_modulo_da_firmare')}
          </>
        }
      >
        <Sezione id="regola" titolo={t('pazienti.consensoinformato.la_regola_in_una_riga')}>
          <p>
            <strong>
              {t('pazienti.consensoinformato.nessun_trattamento_sanitario_puo_essere_iniziato')}
            </strong>{' '}
            {t('pazienti.consensoinformato.lo_dice_la_legge_219_del')}
          </p>
        </Sezione>

        <Sezione id="diritto" titolo={t('pazienti.consensoinformato.che_cosa_hai_il_diritto_di')}>
          <p>
            La stessa legge elenca le informazioni che ti spettano, e le vuole{' '}
            <strong>complete, aggiornate e comprensibili per te</strong>, non corrette in
            astratto:
          </p>
          <ul className="mt-[var(--s-13)]">
            {[
              'la diagnosi e la prognosi;',
              'i benefici e i rischi del trattamento proposto;',
              'le possibili alternative;',
              'che cosa succede se rifiuti, o se ci rinunci dopo.',
            ].map((v) => (
              <li key={v} style={{ padding: 'var(--s-5) 0' }}>
                {v}
              </li>
            ))}
          </ul>
          <p className="mt-[var(--s-13)]">
            Le ultime due righe sono quelle che quasi nessuno chiede, e sono le più utili:{' '}
            <strong>l’alternativa</strong> e <strong>il non farlo</strong> sono due opzioni
            vere, e devono esserti presentate come tali.
          </p>
          <p className="mt-[var(--s-13)]" style={{ color: 'var(--fg-muted)' }}>
            Puoi anche scegliere il contrario: <em>non</em> ricevere le informazioni, o
            indicare una persona di fiducia che le riceva al posto tuo. Anche questo è un
            tuo diritto, e va messo per iscritto in cartella.
          </p>
        </Sezione>

        <Sezione id="forma" titolo={t('pazienti.consensoinformato.come_deve_essere_raccolto')}>
          <p>
            <strong>{t('pazienti.consensoinformato.in_forma_scritta')}</strong> (o con una videoregistrazione, o con
            strumenti adatti a chi ha una disabilità), e <strong>finisce in cartella</strong>{' '}
            clinica. Se ti viene chiesto un consenso solo a voce, e nient’altro resta scritto
            da nessuna parte, manca un pezzo.
          </p>
        </Sezione>

        <Sezione id="revoca" titolo={t('pazienti.consensoinformato.puoi_cambiare_idea_sempre')}>
          <p>
            Hai il diritto di <strong>rifiutare</strong> in tutto o in parte, e di{' '}
            <strong>revocare il consenso in qualsiasi momento</strong>: anche dopo averlo
            dato, anche quando revocarlo interrompe il trattamento. Non devi giustificarti.
          </p>
        </Sezione>

        <Sezione id="estetica" titolo={t('pazienti.consensoinformato.perche_in_medicina_estetica_e_piu')}>
          <p>
            Un trattamento estetico si fa su una persona <strong>sana</strong>, e{' '}
            <strong>non è necessario</strong>: nessuno sta curando una malattia. Per questo
            i giudici chiedono al medico estetico un’informazione{' '}
            <strong>più rigorosa</strong> che altrove: deve mettere in conto anche il
            risultato che non ti piacerà, non solo la complicanza clinica.
          </p>
        </Sezione>

        <Sezione id="non-e" titolo={t('pazienti.consensoinformato.e_che_cosa_non_e')}>
          <p>
            <strong>{t('pazienti.consensoinformato.non_e_una_liberatoria')}</strong> {t('pazienti.consensoinformato.firmare_non_toglie_responsabilita_al_medico')}
          </p>
          <p className="mt-[var(--s-13)]">
            <strong>{t('pazienti.consensoinformato.non_e_un_foglio_uguale_per')}</strong> {t('pazienti.consensoinformato.un_modulo_che_potrebbe_essere_firmato')}
          </p>
        </Sezione>

        <Sezione id="poi" titolo={t('pazienti.consensoinformato.da_qui')}>
          <p>
            <Link href="/pazienti/prima-di-un-trattamento" style={COLLEGAMENTO}>
              {t('pazienti.consensoinformato.le_domande_da_fare_prima_di')}
            </Link>:
             le stesse cose, girate in domande che puoi porre in visita.
          </p>
          {/* ⚠️ **L'unica maglia che mancava fra le tre guide** (misurato il
              2026-08-13): le altre due si citavano già a vicenda, questa ⛔ no.
              È anche l'ordine giusto per chi legge: prima *chi* firma il
              consenso deve essere un medico, poi *cosa* firmi. */}
          <p className="mt-[var(--s-13)]">
            <Link href="/pazienti/verificare-un-medico" style={COLLEGAMENTO}>
              {t('pazienti.consensoinformato.l_albo_dei_medici_e_come')}
            </Link>
            : il consenso vale se chi te lo chiede è il medico che eseguirà il trattamento.
          </p>
        </Sezione>
      </TestoPaziente>
    </GuscioPaziente>
  )
}
