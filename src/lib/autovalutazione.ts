/**
 * Le otto domande dell'autovalutazione, e cosa dire quando la risposta scopre
 * un punto.
 *
 * REGOLE CHE VALGONO PER OGNI RIGA DI QUESTO FILE
 *
 * 1. Nessun punteggio. Un numero da 0 a 100 è inventato (chi decide che una
 *    lacuna sul consenso vale 12 punti e una sulle foto 8?) e sposta
 *    l'attenzione sull'ottimizzare la cifra invece che sul punto scoperto.
 *    L'esito è un ELENCO.
 * 2. Ogni punto scoperto porta la sua FONTE, e la fonte è vera e verificabile.
 *    Una pagina che spaventa un medico citando una norma inesistente è peggio
 *    di una pagina che non c'è.
 * 3. `noi` è una riga sola e dice cosa fa il prodotto OGGI. Niente funzioni
 *    progettate e non costruite: il collaudo ha tre presidi apposta.
 * 4. Non è un parere legale, e la pagina lo scrive.
 * 5. INVARIANTE: l'ULTIMA opzione di ogni domanda scopre il punto
 *    (`scoperto: true`). Non è un vezzo: `collaudo.mjs` risponde a tutte le
 *    domande scegliendo l'ultima e pretende «8 punti su otto». Se riordini le
 *    opzioni e rompi l'invariante, il collaudo diventa rosso e te lo dice,
 *    invece di lasciarti credere che lo strumento funzioni.
 *
 * ⚠️ Sulla citazione dell'obbligo informativo rafforzato in medicina estetica:
 * la sentenza corretta è Cass. 29827/2019, NON 26104/2022. L'attribuzione
 * sbagliata era finita in 116 modelli di consenso su 117 ed è stata corretta il
 * 2026-08-07. Non reintrodurla qui.
 */

import { t } from '@/lib/testo'

export interface Opzione {
  etichetta: string
  /** true = questa risposta scopre il punto. */
  scoperto: boolean
}

export interface DomandaAuto {
  id: string
  domanda: string
  /** Contesto breve, letto dagli screen reader via aria-describedby. */
  aiuto?: string
  opzioni: readonly Opzione[]
  /** Che cosa risulta scoperto, se la risposta lo è. */
  punto: string
  perche: string
  fonte: string
  noi: string
}

export const DOMANDE_AUTO: readonly DomandaAuto[] = [
  {
    id: 'modulo-unico',
    domanda: t('lib.autovalutazione.il_modulo_di_consenso_che_fai'),
    aiuto: t('lib.autovalutazione.per_esempio_lo_stesso_foglio_per'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_uno_solo_per_tutto'), scoperto: true },
      { etichetta: t('lib.autovalutazione.no_uno_per_procedura'), scoperto: false },
      { etichetta: t('lib.autovalutazione.dipende_alcuni_si'), scoperto: true },
    ],
    punto: t('lib.autovalutazione.un_modulo_unico_per_procedure_diverse'),
    perche:
      t('lib.autovalutazione.il_consenso_deve_descrivere_quella_procedura'),
    fonte: t('lib.autovalutazione.l_219_2017_art_1_cass'),
    noi: t('lib.autovalutazione.un_catalogo_di_moduli_per_procedura'),
  },
  {
    id: 'rischi-specifici',
    domanda: t('lib.autovalutazione.il_consenso_nomina_il_prodotto_usato'),
    aiuto: t('lib.autovalutazione.oppure_si_ferma_a_formule_generiche'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_prodotto_e_rischi_specifici'), scoperto: false },
      { etichetta: t('lib.autovalutazione.solo_formule_generiche'), scoperto: true },
      { etichetta: t('lib.autovalutazione.non_lo_so'), scoperto: true },
    ],
    punto: t('lib.autovalutazione.rischi_descritti_in_modo_generico'),
    perche: t('lib.autovalutazione.possibili_effetti_indesiderati_non_e_un'),
    fonte: t('lib.autovalutazione.l_219_2017_art_1_c'),
    noi: t('lib.autovalutazione.i_modelli_sono_scritti_per_procedura'),
  },
  {
    id: 'firma-prima',
    domanda: t('lib.autovalutazione.la_firma_della_paziente_resta_legata'),
    aiuto: t('lib.autovalutazione.cioe_se_domani_il_modulo_cambia'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_la_versione_firmata_e_conservata'), scoperto: false },
      { etichetta: t('lib.autovalutazione.firma_su_carta_e_il_modulo'), scoperto: true },
      { etichetta: t('lib.autovalutazione.non_saprei_dimostrarlo'), scoperto: true },
    ],
    punto: t('lib.autovalutazione.la_firma_non_e_legata_a'),
    perche:
      t('lib.autovalutazione.un_consenso_vale_per_quello_che'),
    fonte: t('lib.autovalutazione.l_219_2017_art_1_c_2'),
    noi: t('lib.autovalutazione.il_documento_firmato_e_sigillato_con'),
  },
  {
    id: 'foto',
    domanda: t('lib.autovalutazione.le_fotografie_pre_e_post_trattamento'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.dentro_la_cartella_clinica_cifrate'), scoperto: false },
      { etichetta: t('lib.autovalutazione.nel_rullino_del_telefono'), scoperto: true },
      { etichetta: t('lib.autovalutazione.in_una_cartella_condivisa_o_in'), scoperto: true },
    ],
    punto: t('lib.autovalutazione.le_foto_cliniche_stanno_fuori_dalla'),
    perche:
      t('lib.autovalutazione.sono_dati_sulla_salute_chiedono_misure'),
    fonte: t('lib.autovalutazione.gdpr_art_9_e_art_32'),
    noi: t('lib.autovalutazione.le_foto_entrano_cifrate_nella_scheda'),
  },
  {
    id: 'lotto',
    domanda: t('lib.autovalutazione.per_una_seduta_di_sei_mesi'),
    aiuto: t('lib.autovalutazione.senza_cercare_in_un_quaderno_o'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_sta_in_cartella'), scoperto: false },
      { etichetta: t('lib.autovalutazione.e_scritto_da_qualche_parte_ma'), scoperto: true },
      { etichetta: 'No', scoperto: true },
    ],
    punto: t('lib.autovalutazione.prodotto_e_lotto_non_sono_nella'),
    perche:
      t('lib.autovalutazione.e_l_informazione_che_serve_quando'),
    fonte: t('lib.autovalutazione.obbligo_di_tenuta_della_documentazione_sanitaria'),
    noi: t('lib.autovalutazione.prodotto_lotto_unita_e_area_restano'),
  },
  {
    id: 'accessi',
    domanda: t('lib.autovalutazione.sapresti_dimostrare_chi_ha_aperto_una'),
    aiuto: t('lib.autovalutazione.vale_anche_per_la_segretaria_e'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_c_e_un_registro_consultabile'), scoperto: false },
      { etichetta: 'No', scoperto: true },
      { etichetta: t('lib.autovalutazione.solo_chiedendolo_al_fornitore'), scoperto: true },
    ],
    punto: t('lib.autovalutazione.nessun_registro_degli_accessi_consultabile'),
    perche:
      t('lib.autovalutazione.il_titolare_del_trattamento_deve_poter'),
    fonte: t('lib.autovalutazione.gdpr_art_5_c_2_responsabilizzazione'),
    noi: t('lib.autovalutazione.il_registro_accessi_e_una_pagina'),
  },
  {
    id: 'richiesta-paziente',
    domanda: t('lib.autovalutazione.se_una_paziente_ti_chiedesse_oggi'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.subito_si_esporta'), scoperto: false },
      { etichetta: t('lib.autovalutazione.in_qualche_giorno_mettendo_insieme_i'), scoperto: true },
      { etichetta: t('lib.autovalutazione.non_saprei_da_dove_cominciare'), scoperto: true },
    ],
    punto: t('lib.autovalutazione.la_documentazione_non_e_consegnabile_in'),
    perche:
      t('lib.autovalutazione.la_richiesta_di_accesso_va_evasa'),
    fonte: t('lib.autovalutazione.gdpr_art_15_e_art_12'),
    noi: t('lib.autovalutazione.l_esportazione_della_cartella_completa_e'),
  },
  {
    id: 'uscita',
    domanda: t('lib.autovalutazione.se_il_software_che_usi_chiudesse'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.in_uno_standard_leggibile_da_altri'), scoperto: false },
      { etichetta: t('lib.autovalutazione.in_un_formato_del_fornitore'), scoperto: true },
      { etichetta: t('lib.autovalutazione.non_l_ho_mai_verificato'), scoperto: true },
    ],
    punto: t('lib.autovalutazione.l_uscita_dai_dati_non_e'),
    perche:
      t('lib.autovalutazione.la_portabilita_e_un_diritto_ma'),
    fonte: t('lib.autovalutazione.gdpr_art_20'),
    noi: t('lib.autovalutazione.l_esportazione_usa_fhir_r4_lo'),
  },
] as const
