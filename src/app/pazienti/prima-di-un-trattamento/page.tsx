import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GuscioPaziente } from '@/components/pazienti/GuscioPaziente'
import { TestoPaziente, Sezione, COLLEGAMENTO } from '@/components/pazienti/TestoPaziente'

export const metadata: Metadata = {
  title: t('pazienti.primadiuntrattamento.meta_titolo_nove_domande_da_fare_prima_di'),
  description:
    t('pazienti.primadiuntrattamento.meta_descrizione_che_prodotto_mi_mettete_quanto'),
  alternates: { canonical: '/pazienti/prima-di-un-trattamento' },
}

/* Le domande non sono inventate: sono l'articolo 1 comma 3 della L. 219/2017
 * girato in seconda persona. Dove la legge dice «ha il diritto di essere
 * informata riguardo a X», qui c'è la domanda che ottiene X.
 *
 * ⛔ Nessun consiglio clinico, nessuna soglia, nessun «se ti dicono così
 * scappa»: sarebbe informazione sanitaria che non ci compete e che non
 * potremmo sostenere. Qui si dice **cosa chiedere**, non cosa sia giusto
 * sentirsi rispondere. */
const DOMANDE = [
  {
    d: t('pazienti.primadiuntrattamento.che_cosa_mi_mettete_esattamente'),
    p: t('pazienti.primadiuntrattamento.p_nome_del_prodotto_non_solo_la_catego'),
  },
  {
    d: t('pazienti.primadiuntrattamento.quanto_dura_e_poi_che_succede'),
    p: t('pazienti.primadiuntrattamento.p_un_trattamento_che_si_riassorbe_ha_b'),
  },
  {
    d: t('pazienti.primadiuntrattamento.quali_sono_le_alternative'),
    p: t('pazienti.primadiuntrattamento.p_la_legge_dice_che_le_alternative_van'),
  },
  {
    d: t('pazienti.primadiuntrattamento.e_se_non_lo_faccio'),
    p: t('pazienti.primadiuntrattamento.p_la_domanda_che_quasi_nessuno_pone_ed'),
  },
  {
    d: t('pazienti.primadiuntrattamento.quali_rischi_ha_non_in_generale'),
    p: t('pazienti.primadiuntrattamento.p_con_la_tua_storia_clinica_i_tuoi_far'),
  },
  {
    d: t('pazienti.primadiuntrattamento.chi_lo_esegue_materialmente'),
    p: t('pazienti.primadiuntrattamento.p_non_scontato_che_sia_la_persona_con_'),
  },
  {
    d: t('pazienti.primadiuntrattamento.che_cosa_si_fa_se_qualcosa'),
    p: t('pazienti.primadiuntrattamento.p_chiedi_il_percorso_concreto_chi_chia'),
  },
  {
    d: t('pazienti.primadiuntrattamento.mi_fate_firmare_un_consenso_posso'),
    p: t('pazienti.primadiuntrattamento.p_il_consenso_va_raccolto_per_iscritto'),
  },
  {
    d: t('pazienti.primadiuntrattamento.quanto_costa_tutto_compreso'),
    p: t('pazienti.primadiuntrattamento.p_compresi_i_controlli_e_le_sedute_suc'),
  },
] as const

export default function Page() {
  return (
    <GuscioPaziente>
      <TestoPaziente
        occhiello={t('pazienti.primadiuntrattamento.prima_di_decidere')}
        titolo={t('pazienti.primadiuntrattamento.nove_domande_da_fare_prima_di')}
        sommario={
          <>
            {t('pazienti.primadiuntrattamento.non_sono_domande_scomode_sono_quelle')}
          </>
        }
      >
        <ol style={{ marginTop: 'var(--s-21)' }}>
          {DOMANDE.map((q, i) => (
            <li
              key={q.d}
              style={{
                marginTop: i === 0 ? 0 : 'var(--s-21)',
                paddingTop: i === 0 ? 0 : 'var(--s-21)',
                borderTop: i === 0 ? 'none' : '1px solid var(--rule)',
              }}
            >
              <p style={{ fontWeight: 500 }}>
                {i + 1}. {q.d}
              </p>
              <p className="mt-[var(--s-8)]" style={{ color: 'var(--fg-muted)' }}>
                {q.p}
              </p>
            </li>
          ))}
        </ol>

        <Sezione id="portale" titolo={t('pazienti.primadiuntrattamento.una_cosa_da_sapere_su_questo')}>
          <p>Qui non trovi<strong>prezzi, sconti né classifiche</strong>, e non è una
            dimenticanza: la legge italiana vieta ai medici e alle strutture sanitarie le
            comunicazioni con «elementi di carattere attrattivo e suggestivo», comprese
            offerte e promozioni. Un portale che mette i medici in fila per prezzo mette
            **loro** nei guai, non noi.
          </p>
          <p className="mt-[var(--s-13)]">Non trovi nemmeno<strong>recensioni</strong>. Per verificarle davvero
            dovremmo collegare chi scrive alla sua cartella clinica, cioè dichiarare che
            quella persona è stata paziente di quel medico. Non lo facciamo.
          </p>
        </Sezione>

        <Sezione id="poi" titolo={t('pazienti.primadiuntrattamento.da_qui')}>
          <p>
            <Link href="/pazienti/consenso-informato" style={COLLEGAMENTO}>
              {t('pazienti.primadiuntrattamento.che_cos_e_il_consenso_informato')}
            </Link>{' '}
            ·{' '}
            <Link href="/pazienti/verificare-un-medico" style={COLLEGAMENTO}>
              {t('pazienti.primadiuntrattamento.come_verificare_che_un_medico_e')}
            </Link>
          </p>
        </Sezione>
      </TestoPaziente>
    </GuscioPaziente>
  )
}
