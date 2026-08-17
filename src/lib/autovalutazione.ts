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
    aiuto: 'Per esempio: lo stesso foglio per un filler, una tossina e un laser.',
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_uno_solo_per_tutto'), scoperto: true },
      { etichetta: t('lib.autovalutazione.no_uno_per_procedura'), scoperto: false },
      { etichetta: t('lib.autovalutazione.dipende_alcuni_si'), scoperto: true },
    ],
    punto: 'Un modulo unico per procedure diverse',
    perche:
      t('lib.autovalutazione.il_consenso_deve_descrivere_quella_procedura'),
    fonte: 'L. 219/2017 art. 1 · Cass. civ. 29827/2019',
    noi: 'Un catalogo di moduli per procedura, e il modulo si sceglie dal trattamento.',
  },
  {
    id: 'rischi-specifici',
    domanda: t('lib.autovalutazione.il_consenso_nomina_il_prodotto_usato'),
    aiuto: 'Oppure si ferma a formule generiche come «possibili effetti indesiderati».',
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_prodotto_e_rischi_specifici'), scoperto: false },
      { etichetta: t('lib.autovalutazione.solo_formule_generiche'), scoperto: true },
      { etichetta: t('lib.autovalutazione.non_lo_so'), scoperto: true },
    ],
    punto: 'Rischi descritti in modo generico',
    perche:
      '«Possibili effetti indesiderati» non è un rischio: è una formula. Il contenuto informativo si misura su quello che la paziente poteva capire di quella procedura, non sulla presenza di una firma in fondo al foglio.',
    fonte: 'L. 219/2017 art. 1 c. 3 · Codice di deontologia medica art. 33',
    noi: 'I modelli sono scritti per procedura, con i rischi di quella procedura.',
  },
  {
    id: 'firma-prima',
    domanda: t('lib.autovalutazione.la_firma_della_paziente_resta_legata'),
    aiuto:
      'Cioè: se domani il modulo cambia, si riesce ancora a dimostrare quale versione aveva firmato lei.',
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_la_versione_firmata_e_conservata'), scoperto: false },
      { etichetta: t('lib.autovalutazione.firma_su_carta_e_il_modulo'), scoperto: true },
      { etichetta: t('lib.autovalutazione.non_saprei_dimostrarlo'), scoperto: true },
    ],
    punto: 'La firma non è legata a una versione del testo',
    perche:
      t('lib.autovalutazione.un_consenso_vale_per_quello_che'),
    fonte: 'L. 219/2017 art. 1 c. 4 (documentazione e conservazione in cartella)',
    noi: 'Il documento firmato è sigillato con un’impronta digitale che ne dimostra la non alterazione.',
  },
  {
    id: 'foto',
    domanda: t('lib.autovalutazione.le_fotografie_pre_e_post_trattamento'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.dentro_la_cartella_clinica_cifrate'), scoperto: false },
      { etichetta: t('lib.autovalutazione.nel_rullino_del_telefono'), scoperto: true },
      { etichetta: t('lib.autovalutazione.in_una_cartella_condivisa_o_in'), scoperto: true },
    ],
    punto: 'Le foto cliniche stanno fuori dalla cartella',
    perche:
      t('lib.autovalutazione.sono_dati_sulla_salute_chiedono_misure'),
    fonte: 'GDPR art. 9 e art. 32',
    noi: 'Le foto entrano cifrate nella scheda della seduta, separate dalla galleria del telefono.',
  },
  {
    id: 'lotto',
    domanda: t('lib.autovalutazione.per_una_seduta_di_sei_mesi'),
    aiuto: 'Senza cercare in un quaderno o nella scatola in frigo.',
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_sta_in_cartella'), scoperto: false },
      { etichetta: t('lib.autovalutazione.e_scritto_da_qualche_parte_ma'), scoperto: true },
      { etichetta: 'No', scoperto: true },
    ],
    punto: 'Prodotto e lotto non sono nella cartella',
    perche:
      t('lib.autovalutazione.e_l_informazione_che_serve_quando'),
    fonte: 'Obbligo di tenuta della documentazione sanitaria · D.Lgs. 46/1997 sulla vigilanza dei dispositivi',
    noi: 'Prodotto, lotto, unità e area restano legati alla seduta, insieme ai punti segnati sulla mappa.',
  },
  {
    id: 'accessi',
    domanda: t('lib.autovalutazione.sapresti_dimostrare_chi_ha_aperto_una'),
    aiuto: 'Vale anche per la segretaria e per i collaboratori.',
    opzioni: [
      { etichetta: t('lib.autovalutazione.si_c_e_un_registro_consultabile'), scoperto: false },
      { etichetta: 'No', scoperto: true },
      { etichetta: t('lib.autovalutazione.solo_chiedendolo_al_fornitore'), scoperto: true },
    ],
    punto: 'Nessun registro degli accessi consultabile',
    perche:
      t('lib.autovalutazione.il_titolare_del_trattamento_deve_poter'),
    fonte: 'GDPR art. 5 c. 2 (responsabilizzazione) e art. 32',
    noi: 'Il registro accessi è una pagina dell’applicazione, e le voci sono concatenate da impronte che rendono evidente una manomissione.',
  },
  {
    id: 'richiesta-paziente',
    domanda: t('lib.autovalutazione.se_una_paziente_ti_chiedesse_oggi'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.subito_si_esporta'), scoperto: false },
      { etichetta: t('lib.autovalutazione.in_qualche_giorno_mettendo_insieme_i'), scoperto: true },
      { etichetta: t('lib.autovalutazione.non_saprei_da_dove_cominciare'), scoperto: true },
    ],
    punto: 'La documentazione non è consegnabile in un pezzo solo',
    perche:
      t('lib.autovalutazione.la_richiesta_di_accesso_va_evasa'),
    fonte: 'GDPR art. 15 e art. 12 c. 3',
    noi: 'L’esportazione della cartella completa è una funzione dell’applicazione, non una richiesta all’assistenza.',
  },
  {
    id: 'uscita',
    domanda: t('lib.autovalutazione.se_il_software_che_usi_chiudesse'),
    opzioni: [
      { etichetta: t('lib.autovalutazione.in_uno_standard_leggibile_da_altri'), scoperto: false },
      { etichetta: t('lib.autovalutazione.in_un_formato_del_fornitore'), scoperto: true },
      { etichetta: t('lib.autovalutazione.non_l_ho_mai_verificato'), scoperto: true },
    ],
    punto: 'L’uscita dai dati non è verificata',
    perche:
      t('lib.autovalutazione.la_portabilita_e_un_diritto_ma'),
    fonte: 'GDPR art. 20',
    noi: 'L’esportazione usa FHIR R4, lo standard sanitario internazionale.',
  },
] as const
