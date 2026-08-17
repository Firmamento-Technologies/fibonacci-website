/**
 * Le domande frequenti.
 *
 * Riscritte sulle obiezioni vere, non sulle domande comode. Due regole:
 *   1. nessuna risposta promette qualcosa che il prodotto non fa oggi;
 *   2. dove la risposta è «no» o «non ancora», la risposta comincia con no.
 *
 * Il vecchio elenco prometteva «conservazione a norma» dentro il piano Solo e
 * un «trial di 14 giorni gratuito»: nessuna delle due è vera, ed erano
 * esattamente le due righe che un cliente avrebbe citato dopo la firma.
 */

import { t } from '@/lib/testo'

export interface Domanda {
  categoria: 'prezzi' | 'dati' | 'prodotto' | 'avvio' | 'limiti'
  d: string
  r: string
  /** Ancora per collegarci da altre pagine. */
  id?: string
}

export const CATEGORIE: Record<Domanda['categoria'], string> = {
  prodotto: t('comefunziona.il_prodotto'),
  prezzi: t('lib.domande.cat_prezzi_e_contratto'),
  dati: t('lib.domande.cat_dati_dei_pazienti'),
  avvio: t('lib.domande.cat_partire'),
  limiti: t('lib.domande.cat_quello_che_non_fa'),
}

export const DOMANDE: Domanda[] = [
  // ── Prodotto ─────────────────────────────────────────────────────────
  {
    categoria: 'prodotto',
    d: t('lib.domande.per_che_tipo_di_studio_e'),
    r: t('lib.domande.medicina_estetica_un_medico_da_solo'),
  },
  {
    categoria: 'prodotto',
    d: t('lib.domande.la_dettatura_funziona_davvero_durante_la'),
    r: t('lib.domande.si_detti_mentre_visiti_e_i'),
  },
  {
    categoria: 'prodotto',
    d: t('lib.domande.posso_usare_i_miei_moduli_di'),
    r: t('lib.domande.si_i_nostri_modelli_sono_un'),
  },
  {
    categoria: 'prodotto',
    d: t('lib.domande.i_vostri_modelli_di_consenso_sono'),
    r: t('lib.domande.no_e_questo_e_importante_la'),
  },
  {
    categoria: 'prodotto',
    id: 'portale',
    d: t('lib.domande.uso_gia_un_portale_per_farmi'),
    r: t('lib.domande.no_e_non_te_lo_chiediamo'),
  },
  {
    categoria: 'prodotto',
    d: t('lib.domande.funziona_su_tablet'),
    r: t('lib.domande.si_ed_e_cosi_che_la'),
  },

  // ── Prezzi ───────────────────────────────────────────────────────────
  {
    categoria: 'prezzi',
    d: t('lib.domande.quanto_costa'),
    r: t('lib.domande.solo_129_euro_al_mese_per'),
  },
  {
    categoria: 'prezzi',
    d: t('lib.domande.c_e_una_prova_gratuita'),
    r: t('lib.domande.no_non_nella_forma_iscriviti_e'),
  },
  {
    categoria: 'prezzi',
    d: t('lib.domande.ci_sono_vincoli_di_durata_o'),
    r: t('lib.domande.no_si_paga_mensilmente_e_si'),
  },
  {
    categoria: 'prezzi',
    d: t('lib.domande.il_prezzo_aumenta_dopo_il_primo'),
    r: t('lib.domande.non_c_e_nessun_rincaro_programmato'),
  },

  // ── Dati ─────────────────────────────────────────────────────────────
  {
    categoria: 'dati',
    d: t('lib.domande.dove_stanno_i_dati_dei_miei'),
    r: t('lib.domande.su_server_in_germania_dentro_lo'),
  },
  {
    categoria: 'dati',
    d: t('lib.domande.chi_e_il_titolare_del_trattamento'),
    r: t('lib.domande.tu_noi_siamo_responsabili_e_agiamo'),
  },
  {
    categoria: 'dati',
    d: t('lib.domande.posso_portare_via_tutto_se_cambio'),
    r: t('lib.domande.si_quando_vuoi_e_senza_chiedercelo'),
  },
  {
    categoria: 'dati',
    d: t('lib.domande.i_dati_dei_pazienti_servono_ad'),
    r: t('lib.domande.no_i_fornitori_dei_modelli_si'),
  },

  // ── Avvio ────────────────────────────────────────────────────────────
  {
    categoria: 'avvio',
    d: t('lib.domande.quanto_ci_metto_a_partire'),
    r: t('lib.domande.la_configurazione_dello_studio_la_facciamo'),
  },
  {
    categoria: 'avvio',
    d: t('lib.domande.migrate_voi_i_dati_dal_gestionale'),
    r: t('lib.domande.si_partendo_da_un_file_esportato'),
  },
  {
    categoria: 'avvio',
    d: t('lib.domande.serve_internet'),
    r: t('lib.domande.si_se_la_linea_cade_non'),
  },

  // ── Limiti ───────────────────────────────────────────────────────────
  {
    categoria: 'limiti',
    id: 'cosa-manca',
    d: t('lib.domande.che_cosa_fibonacci_non_fa_oggi'),
    r: t('lib.domande.non_c_e_la_firma_elettronica'),
  },
  {
    categoria: 'limiti',
    d: t('lib.domande.mi_portate_pazienti_nuovi'),
    r: t('lib.domande.no_non_siamo_un_portale_di'),
  },
  {
    categoria: 'limiti',
    d: t('lib.domande.le_recensioni_dei_pazienti_finiscono_da'),
    r: t('lib.domande.no_non_raccogliamo_recensioni_non_le'),
  },
  {
    categoria: 'limiti',
    d: t('lib.domande.il_software_mi_dice_cosa_prescrivere'),
    r: t('lib.domande.no_e_non_e_una_limitazione'),
  },
  {
    categoria: 'limiti',
    d: t('lib.domande.avete_clienti_che_possono_darmi_un'),
    r: t('lib.domande.non_ancora_siamo_in_pilota_presso'),
  },
]
