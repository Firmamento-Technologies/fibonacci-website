/* I bollini: le garanzie del prodotto, una per riga, ognuna con la prova.
 *
 * ⛔ REGOLA DI QUESTO FILE, e non è negoziabile: **un bollino dichiara un
 * fatto che un terzo può verificare senza il nostro permesso.** Niente loghi
 * di certificazione che non abbiamo, niente sigilli disegnati da noi che
 * sembrano rilasciati da qualcun altro, niente formule («conforme al GDPR»,
 * «sicurezza di livello bancario») che non si possono né provare né smentire.
 *
 * 🔑 Il motivo per cui i bollini `assente` esistono, e sono la metà del
 * valore: il settore è pieno di vetrine che esibiscono la certificazione del
 * **proprio ospitante** come se fosse la propria. Dichiarare per primi che
 * cosa NON abbiamo è l'unica mossa che rende credibile l'elenco di ciò che
 * abbiamo, e costa nulla a chi non ha niente da nascondere. Lo studio di
 * Stanford ripreso da CXL, già citato in `/sicurezza-e-dati`, dice la stessa
 * cosa al contrario: gridare «fidati di me» fa nascere il sospetto.
 *
 * ⚠️ Ogni volta che si aggiunge un bollino, si aggiunge **anche la prova**.
 * Un bollino senza `prova` non è un bollino: è uno slogan dentro un cerchio.
 */

import { t } from '@/lib/testo'

export type StatoBollino =
  /** Vero oggi, e verificabile oggi. */
  | 'fatto'
  /** Non ce l'abbiamo, e lo diciamo noi per primi. */
  | 'assente'
  /** Obbligo o obiettivo con una data, non ancora esigibile. */
  | 'previsto'

export interface Bollino {
  /** Chiave stabile: serve a React e a chi cita un bollino da un'altra pagina. */
  id: string
  /** L'affermazione. Corta: è quello che si legge dentro il bollo. */
  titolo: string
  /** Che cosa vuol dire, e perché a un medico interessa. Una frase. */
  corpo: string
  /** ⛔ Obbligatoria. La norma, o il documento pubblico, o il comando da lanciare. */
  prova: string
  stato: StatoBollino
  /** Dove si va a controllare. Interno al sito, salvo `esterno`. */
  href?: string
  esterno?: boolean
}

/* ── L'elenco ─────────────────────────────────────────────────────────────
 * L'ordine non è casuale: prima dove stanno i dati (la prima domanda di ogni
 * medico prudente), poi chi comanda su di essi, poi come si esce. I due
 * bollini `assente` stanno in fondo perché si leggono dopo, non perché
 * contino meno. */
export const BOLLINI: Bollino[] = [
  {
    id: 'dati-in-italia',
    titolo: t('lib.bollini.dati_in_italia'),
    corpo:
      t('lib.bollini.la_cartella_le_fotografie_e_i'),
    prova:
      t('lib.bollini.interroga_tu_il_registro_whois_sull'),
    stato: 'fatto',
    href: '/sub-responsabili',
  },
  {
    id: 'nessun-intermediario',
    titolo: t('lib.bollini.nessun_intermediario'),
    corpo:
      t('lib.bollini.fra_il_tuo_browser_e_il'),
    prova:
      t('lib.bollini.il_dominio_risolve_direttamente_sull_indirizzo'),
    stato: 'fatto',
    href: '/sicurezza',
  },
  {
    id: 'titolare-sei-tu',
    titolo: t('lib.bollini.il_titolare_sei_tu'),
    corpo:
      t('lib.bollini.i_pazienti_sono_i_tuoi_la'),
    prova:
      t('lib.bollini.accordo_ex_art_28_gdpr_pubblicato'),
    stato: 'fatto',
    href: '/dpa',
  },
  {
    id: 'codice-di-condotta',
    titolo: t('lib.bollini.codice_di_condotta_europeo'),
    corpo:
      t('lib.bollini.il_fornitore_che_ospita_i_dati'),
    prova:
      t('lib.bollini.l_iscrizione_sta_nel_registro_pubblico'),
    stato: 'fatto',
    href: 'https://cispe.cloud/publicregister/',
    esterno: true,
  },
  {
    id: 'registro-accessi',
    titolo: t('lib.bollini.ogni_accesso_e_scritto'),
    corpo:
      t('lib.bollini.chi_apre_una_cartella_lascia_una'),
    prova:
      t('lib.bollini.il_registro_lo_consulti_tu_non'),
    stato: 'fatto',
    href: '/verifica',
  },
  {
    id: 'uscita-garantita',
    titolo: t('lib.bollini.uscire_e_una_funzione'),
    corpo:
      t('lib.bollini.esporti_tutto_in_fhir_r4_uno'),
    prova:
      t('lib.bollini.art_20_gdpr_sulla_portabilita_prescrizione'),
    stato: 'fatto',
    href: '/conformita-europea',
  },
  {
    id: 'niente-addestramento',
    titolo: t('lib.bollini.nessun_addestramento_sui_tuoi_dati'),
    corpo:
      t('lib.bollini.i_fornitori_dei_modelli_che_usiamo'),
    prova:
      t('lib.bollini.ogni_fornitore_e_nominato_nell_elenco'),
    stato: 'fatto',
    href: '/sub-responsabili',
  },
  {
    id: 'iso-27001',
    titolo: t('lib.bollini.iso_27001_il_data_center_si'),
    corpo:
      t('lib.bollini.la_certificazione_appartiene_a_chi_ospita'),
    prova:
      t('lib.bollini.adottiamo_i_controlli_dell_annex_a'),
    stato: 'assente',
    href: '/sicurezza',
  },
  {
    id: 'marcatura-ce',
    titolo: t('lib.bollini.marcatura_ce_dal_2029_e_non'),
    corpo:
      t('lib.bollini.il_regolamento_sullo_spazio_europeo_dei'),
    prova:
      t('lib.bollini.reg_ue_2025_327_artt_39'),
    stato: 'previsto',
    href: '/conformita-europea',
  },
]

/** I tre che stanno in home.
 *
 * ⚠️ La scelta evita di ripetere la sezione «Come si controlla», che sulla
 * stessa pagina dice già *il verificatore è pubblico*, *i contratti si
 * leggono prima* e *diciamo cosa non c'è*. Restano i tre propriamente
 * **europei**: dove sta il dato, chi c'è in mezzo, e l'obbligo del 2029 che
 * nessuno può ancora soddisfare. L'ultimo è anche il bollino onesto della
 * terna, così la home non mostra tre vittorie di fila.
 *
 * ⛔ **Tre e non quattro, ed è una misura non un gusto**: con quattro la
 * griglia va a due righe e la sezione misurava **986px su 809 utili**, cioè
 * la V finiva sotto il bordo. Il quarto (`codice-di-condotta`) resta sulla
 * pagina `/conformita-europea`, dove lo spazio c'è. Chi ne aggiunge un altro
 * rilanci `node scripts/altezza-pagine.mjs` prima di dire che è fatto. */
export const BOLLINI_HOME = ['dati-in-italia', 'nessun-intermediario', 'marcatura-ce']

/* ── La striscia del piè di pagina ────────────────────────────────────────
 * Su ogni pagina del sito, quindi è il posto dove la sigla conta più della
 * spiegazione: chi la legge sta cercando la risposta a «e la conformità?»,
 * non un ragionamento.
 *
 * ⚠️ **`nota` è obbligatoria e serve a non mentire con una sigla.** Scrivere
 * «AI Act» dentro un bollo, da solo, si legge come *siamo a norma di AI Act*:
 * un'affermazione che nessun fornitore può fare in blocco, perché il
 * regolamento impone obblighi diversi a seconda di che cosa il sistema fa. La
 * nota dice **quale obbligo** e **a che punto siamo**, e in due casi su cinque
 * dice che non ci siamo ancora.
 *
 * ⛔ Nessuna di queste sigle è un marchio che qualcuno ci ha rilasciato: sono
 * i nomi delle norme che ci si applicano. Il giorno in cui una certificazione
 * vera arriva, si aggiunge dicendo **chi** l'ha rilasciata e **quando**. */
/* ── I marchi che NON possiamo usare, e perché ────────────────────────────
 * Domanda dell'utente, 2026-08-16: *«non trovi sul web dei bollini che danno il
 * simbolo AI Act e GDPR? ne ho visti in giro nei siti web, danno un che di
 * ufficiale anche se non sono ufficiali»*. La risposta, misurata:
 *
 * · **GDPR — un sigillo ufficiale ESISTE**, ed è uno solo: **Europrivacy**,
 *   approvato dall'EDPB il 10 ottobre 2022 come *European Data Protection
 *   Seal* ai sensi dell'art. 42(5) GDPR (criteri aggiornati con le Opinioni
 *   14/2026 e 15/2026). ⛔ Non è grafica scaricabile: si ottiene facendosi
 *   certificare da un organismo accreditato. Non ce l'abbiamo ⇒ non si mostra.
 * · **AI Act — non esiste nessun marchio**. La marcatura CE dell'art. 48
 *   riguarda i sistemi ad **alto rischio**, e questo non lo è. Nessun fornitore
 *   al mondo può esibire oggi un bollo «AI Act».
 * · I bollini «GDPR compliant» visti in giro sono **grafica senza emittente**:
 *   se li disegna il sito stesso o glieli regala il fornitore di un servizio di
 *   cookie banner. Non attestano niente e nessuno li rilascia.
 *
 * ⇒ **La scelta**: l'autorevolezza si prende dalla FORMA (un sigillo inciso,
 * disegnato bene) e dal CONTENUTO verificabile, ⛔ non fingendo un emittente.
 * Il bollo qui sotto porta il nome della **norma che ci si applica**, non di un
 * ente che ci avrebbe approvati, e sotto ha sempre la riga che dice a che punto
 * siamo.
 *
 * ⛔ **Mai l'emblema europeo** (il cerchio di dodici stelle) né una sua
 * somiglianza: è protetto, e usarlo suggerirebbe un patrocinio dell'Unione che
 * non esiste. ⛔ Mai la somiglianza della marcatura CE. ⚠️ Su questo punto
 * l'UniversalCorpus non ha una fonte diretta sulle regole d'uso dell'emblema:
 * la regola qui è di prudenza, non una citazione. */

export interface BollinoPiede {
  /** Che cosa è **inciso dentro** il sigillo. Corto: sta in un cerchio. */
  marchio: string
  /** L'etichetta accanto al sigillo. */
  sigla: string
  /** Che cosa vuol dire davvero, in una riga. ⛔ Obbligatoria. */
  nota: string
  stato: StatoBollino
  href: string
}

export const BOLLINI_PIEDE: BollinoPiede[] = [
  {
    marchio: 'GDPR',
    sigla: t('lib.bollini.art_28_gdpr'),
    nota: t('lib.bollini.il_titolare_sei_tu_accordo_di'),
    stato: 'fatto',
    href: '/dpa',
  },
  {
    /* ⛔ Senza spazi: il sigillo va a capo sugli spazi, e «IT · UE» usciva su
       TRE righe dentro un cerchio da 58px. */
    marchio: 'IT/UE',
    sigla: t('lib.bollini.dati_in_italia'),
    nota: t('lib.bollini.infrastruttura_italiana_nessun_intermediario_nessun_trasferimento'),
    stato: 'fatto',
    href: '/conformita-europea',
  },
  {
    marchio: t('lib.bollini.art_32'),
    sigla: t('lib.bollini.misure_di_sicurezza'),
    nota: t('lib.bollini.scheda_tecnica_pubblicata_per_intero_limiti'),
    stato: 'fatto',
    href: '/sicurezza',
  },
  {
    /* ⚠️ Applicabile **da oggi**: il regolamento si applica dal 2 agosto 2026
       (art. 113), quindi qui ⛔ non si può scrivere «ci prepareremo». */
    marchio: t('lib.bollini.ai_act'),
    sigla: t('lib.bollini.art_50_trasparenza'),
    nota: t('lib.bollini.diciamo_quando_stai_parlando_con_un'),
    stato: 'previsto',
    href: '/intelligenza-artificiale',
  },
  {
    marchio: 'EHDS',
    sigla: t('lib.bollini.marcatura_ce_dal_2029'),
    nota: t('lib.bollini.oggi_non_e_apponibile_da_nessuno'),
    stato: 'previsto',
    href: '/conformita-europea',
  },
]

export function bollini(ids: readonly string[]): Bollino[] {
  return ids.map((id) => {
    const b = BOLLINI.find((x) => x.id === id)
    /* ⛔ Non un ritorno silenzioso: un id sbagliato deve fermare la
     * costruzione, non far sparire un bollino dalla pagina senza avvisare.
     * È la lezione di `LEAD_API_URL`, che con la stringa vuota spediva nel
     * nulla rispondendo 200. */
    if (!b) throw new Error(`Bollino inesistente: «${id}». Gli id validi sono in src/lib/bollini.ts.`)
    return b
  })
}
