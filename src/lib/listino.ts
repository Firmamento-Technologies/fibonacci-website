/**
 * Il listino, in un posto solo.
 *
 * Regola che vale per ogni riga di questo file: se una voce dipende da un
 * fornitore non ancora contrattualizzato o da una funzione dietro
 * interruttore spento, NON compare. Al 6 agosto 2026 restano fuori per
 * questo motivo:
 *   · «conservazione a norma» — il conservatore accreditato non è
 *     contrattualizzato;
 *   · «firma elettronica qualificata» — i certificati non sono stati
 *     rilasciati; quella che c'è oggi è una firma elettronica avanzata.
 * Rientrano il giorno in cui diventano vere, non prima.
 */

import { t } from '@/lib/testo'

/**
 * I numeri del listino — decisione dell'utente del 2026-08-11: **129 · 279 · 549**.
 *
 *   0. ✅ **Il livello: 129 / 279 / 549**, deciso il 2026-08-11 (prima erano
 *      99 / 189 / 349). Chiude una domanda rimasta aperta dal **14 luglio**:
 *      `decisione-posizionamento-gtm` elencava *«pricing (premium
 *      "assicurazione" vs €99)»* fra le cinque decisioni non-codice «da
 *      prendere ORA», scartava *«competere a €99 sulla parità di feature»* e
 *      rinviava la calibratura «dopo le prime 5-10 demo» — demo che non ci sono
 *      state, quindi i 99 € stavano qui **per inerzia, non per scelta**.
 *      Il mercato misurato l'11 agosto sulle pagine prezzi vere:
 *      **BeebeeDoc** (verticale estetica) 45 € per 1 account, 99 € per **4-6**;
 *      **ArzaMed** (generalista) 99 € fino a 2 utenti, **249** fino a 5, **499**
 *      fino a 15. ⇒ a 99 € eravamo **il posto singolo più caro del mercato
 *      italiano pubblicato** e insieme **sotto mercato in alto**, dove
 *      battevamo sul prezzo un generalista che offre meno.
 *      129 allinea l'ACV (1.548 €/anno) all'**ARPU di ~1.350 €/anno che il GTM
 *      già assumeva** e che 99 € (1.188 €) mancava.
 *      ⚠️ È una **decisione**, non un calcolo: nessuno ha ancora quotato un
 *      prezzo a un medico vero, la disponibilità a pagare resta **non
 *      misurata**, e la regola 10-5-20 vuole *deal persi* per calibrare.
 *      Dettaglio e fonti in `wiki/sintesi-pricing-mercato-2026-08-11.md`.
 *   1. ✅ **L'esistenza di un prezzo per Clinica** (non «su richiesta»), decisa
 *      il 2026-08-10. Fino a quel momento era `null` ed era il valore corretto:
 *      ⛔ un prezzo non si inventa (stessa regola per cui il buy-out del residuo
 *      va sul sito come principio e senza cifra, e per cui
 *      `/per-le-societa-scientifiche` non pubblica importi).
 *   2. ✅ **Lo sconto annuale: due mensilità in regalo (×10)**, confermato
 *      dall'utente il 2026-08-10. Era nato come assunzione mia — la convenzione
 *      più diffusa, e l'unica che si spiega da sé al cliente senza dover fare
 *      una percentuale a mente. Si cambia in UNA riga
 *      (`MESI_PAGATI_SULL_ANNUALE`) e prezzi, totali e risparmi seguono.
 *
 * ⚠️ `prezzo: null` resta supportato di proposito: è ciò che deve comparire se
 * un domani nasce un piano senza prezzo deciso. La scheda dice «Su richiesta»,
 * porta alla demo e **non** al pagamento.
 */
export const MESI_PAGATI_SULL_ANNUALE = 10

export interface Piano {
  /** La chiave del checkout. ⚠️ Deve combaciare con il `Literal` di `plan` in
   *  `EMR/services/billing/main.py` e con le chiavi di `PRICE_IDS`. */
  chiave: 'solo-pro' | 'studio' | 'clinica'
  nome: string
  /** Canone mensile, pagamento mensile. `null` = prezzo su richiesta. */
  prezzo: number | null
  perChi: string
  incluso: readonly string[]
  consigliato?: boolean
}

/* ⚠️ Le voci sono CORTE di proposito, e la misura è il motivo.
 * Con i testi lunghi ogni riga andava a capo: la lista faceva **551px per 7
 * voci** (~79px l'una) e la scheda 885px, cioè la decisione sul prezzo non
 * stava in una schermata. Una scheda di listino si **scorre** per confrontare,
 * non si legge: il dettaglio sta nella sezione «Compreso nel prezzo» sotto, e
 * lì ha lo spazio per essere completo.
 * ⛔ Prima di allungarne una, rimisurare l'altezza della scheda. */
export const PIANI: readonly Piano[] = [
  {
    chiave: 'solo-pro',
    nome: t('lib.listino.solo'),
    prezzo: 129,
    perChi: 'Un medico, uno studio',
    incluso: [
      t('lib.listino.cartella_completa_pazienti_illimitati'),
      t('lib.listino.catalogo_dei_consensi_estetici'),
      t('lib.listino.firma_della_paziente_in_studio'),
      t('lib.listino.mappa_del_viso_e_del_corpo'),
      t('lib.listino.foto_cliniche_cifrate'),
      t('lib.listino.catena_di_impronte_sugli_accessi'),
      t('lib.listino.agenda_e_richiami'),
    ],
  },
  {
    chiave: 'studio',
    nome: t('lib.listino.studio'),
    prezzo: 279,
    perChi: 'Fino a cinque operatori',
    consigliato: true,
    incluso: [
      t('lib.listino.tutto_quello_che_c_e_in'),
      t('lib.listino.anamnesi_dettata_mentre_visiti'),
      t('lib.listino.agenda_condivisa'),
      t('lib.listino.permessi_per_ruolo'),
      t('lib.listino.allerta_sugli_accessi_anomali'),
      t('lib.listino.assistenza_in_giornata'),
    ],
  },
  {
    chiave: 'clinica',
    nome: t('lib.listino.clinica'),
    // ✅ 549 — deciso dall'utente il 2026-08-11 (era 349 dal 2026-08-10, e
    // `null` — «su richiesta» — prima ancora, che è il valore giusto finché un
    // prezzo non c'è: ⛔ non si inventa, e la scheda porta alla demo invece che
    // al pagamento). 549 sta sopra i 499 che ArzaMed chiede per 15 utenti, in
    // una fascia dove nessun concorrente italiano pubblica.
    prezzo: 549,
    perChi: 'Più sedi, o oltre cinque operatori',
    incluso: [
      t('lib.listino.tutto_quello_che_c_e_in_2'),
      t('lib.listino.piu_sedi_agenda_unica'),
      t('lib.listino.permessi_sede_per_sede'),
      t('lib.listino.esportazioni_programmate'),
      t('lib.listino.referente_per_avvio_e_migrazione'),
    ],
  },
] as const

/** Il prezzo mensile equivalente pagando un anno in anticipo. `null` se il
 *  piano è su richiesta. Arrotondato ai 50 centesimi: `279 × 10 / 12` fa
 *  232,50, e mostrare 232,4999 sarebbe il modo più veloce di far sospettare
 *  che il conto non torni. */
export function prezzoMensileSuAnnuale(piano: Piano): number | null {
  if (piano.prezzo === null) return null
  return Math.round((piano.prezzo * MESI_PAGATI_SULL_ANNUALE) / 12 / 0.5) * 0.5
}

/** Quanto si paga in una volta sola, per un anno. `null` se su richiesta. */
export function totaleAnnuale(piano: Piano): number | null {
  if (piano.prezzo === null) return null
  return piano.prezzo * MESI_PAGATI_SULL_ANNUALE
}

/** Cosa è compreso nell'attivazione, senza costi a sorpresa. */
export const ATTIVAZIONE = [
  t('lib.listino.migrazione_dell_anagrafica_e_dello_storico'),
  t('lib.listino.configurazione_dello_studio_degli_operatori_e'),
  t('lib.listino.formazione_iniziale_in_videochiamata_o_di'),
  /* 🔴 **Diceva solo «nessun vincolo di durata», e non bastava.** Misurato il
   * 2026-08-12 con l'assistente del sito: *«Posso disdire quando voglio?»*
   * veniva **respinta** — la parola «disdire» sul sito non c'era da nessuna
   * parte, quindi la domanda non trovava appiglio e non arrivava nemmeno al
   * recupero. La risposta però esisteva già, in `domande.ts`: *«Si paga
   * mensilmente e si disdice quando si vuole. Alla disdetta esporti i dati»*.
   *
   * ⇒ Non è una condizione nuova: è **la stessa cosa scritta con la parola che
   * la gente usa**. Le due forme — `disdire` e `disdetta` — ci sono entrambe di
   * proposito, perché la domanda si fa in tutti e due i modi e il confronto è
   * lessicale (nessuno stemming: `disdire` ≠ `disdice`).
   *
   * ⛔ Il rimedio alternativo — far combaciare le parole per **prefisso** — è
   * stato provato e scartato con la misura: recuperava questa domanda ma
   * faceva passare **sei domande fuori tema su otto** («qual è la capitale
   * della Francia» entrava da `capitale`). Si scrive la parola sul sito, non
   * si allenta la guardia. */
  t('lib.listino.nessun_costo_di_attivazione_e_nessun'),
] as const

/**
 * La convivenza col portale di prenotazione.
 *
 * Sta nel listino e non altrove perché è un'obiezione di spesa, non di
 * funzionalità: chi paga già un portale crede di avere il software e legge il
 * nostro prezzo come un doppione. La risposta è che sono due lavori diversi.
 *
 * ⚠️ Le tre righe qui sotto sono affermazioni su di NOI, verificabili, e non
 * nominano nessun concorrente: la comparativa fra imprese è lecita (D.Lgs.
 * 145/2007) ma è un rischio nostro in cambio di poco, e il medico sa già di chi
 * si parla. La `cautela` dice il costo vero della convivenza — due agende —
 * perché è la cosa che si scopre dopo la firma se non la scrivi prima.
 */
export const CONVIVENZA = {
  titolo: t('lib.listino.un_portale_non_e_una_cartella'),
  testo:
    t('lib.listino.molti_studi_hanno_gia_l_abbonamento'),
  righe: [
    t('lib.listino.se_usi_un_portale_per_farti'),
    t('lib.listino.non_raccogliamo_recensioni_sul_tuo_conto'),
    t('lib.listino.non_vendiamo_visibilita_qui_non_c'),
  ],
  cautela:
    'Quello che ci rimetti, detto prima: oggi Fibonacci non parla con il portale che usi. Se lo tieni, l’agenda pubblica resta dove è adesso e le prenotazioni le riporti tu.',
} as const

/**
 * Il residuo del contratto che il medico ha altrove.
 *
 * È l'obiezione vera di chi vorrebbe cambiare e non può: non il prezzo nostro,
 * ma i mesi già pagati a qualcun altro. I contratti dei portali durano dodici
 * mesi e si rinnovano da soli, quindi in qualunque momento dell'anno c'è un
 * residuo che rende «ne riparliamo» la risposta più comoda.
 *
 * ⛔ **Senza cifra, per scelta** (decisione dell'utente, 2026-08-09). Un tetto
 * in euro scritto qui sarebbe un numero inventato prima di conoscere
 * l'interlocutore: è la stessa forma già usata per le condizioni alle società
 * scientifiche, dove pure si è deciso di non pubblicare importi.
 *
 * ⚠️ E dice «ne parliamo», non «lo copriamo»: la società non è ancora
 * costituita, quindi oggi non esiste il soggetto che possa impegnarsi a pagare
 * il residuo di un terzo. La riga promette una conversazione, che è una cosa
 * che possiamo mantenere.
 */
export const RESIDUO = {
  titolo: t('lib.listino.se_ti_restano_mesi_da_pagare'),
  testo:
    t('lib.listino.la_ragione_piu_comune_per_non'),
} as const

/** L'ancora del prezzo. Non è il risparmio: è il costo di una contestazione. */
export const ANCORA = {
  /* Era «Con che cosa si confronta», identico all'occhiello che gli sta sopra
   * in /prezzi: la stessa riga stampata due volte a due centimetri di distanza.
   * L'occhiello dice di che cosa si parla, il titolo deve dire la tesi. */
  titolo: t('lib.listino.il_conto_non_si_fa_col'),
  testo:
    t('lib.listino.il_conto_non_si_fa_con'),
  cautela:
    'Non promettiamo che un buon consenso vinca una causa: non funziona così, e chi te lo dice ti sta vendendo qualcosa. Promettiamo che la documentazione esista, sia completa e si dimostri non ritoccata.',
} as const
