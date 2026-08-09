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

export interface Piano {
  nome: string
  prezzo: number
  perChi: string
  incluso: readonly string[]
  consigliato?: boolean
}

export const PIANI: readonly Piano[] = [
  {
    nome: 'Solo',
    prezzo: 99,
    perChi: 'Un medico, uno studio',
    incluso: [
      'Cartella clinica completa, pazienti illimitati',
      'Catalogo dei consensi per la medicina estetica',
      'Firma del paziente su tablet, in studio',
      'Mappa del viso e del corpo per le sedute',
      'Foto cliniche cifrate, separate dal telefono',
      'Registro accessi con catena di impronte',
      'Agenda e promemoria di richiamo',
    ],
  },
  {
    nome: 'Studio',
    prezzo: 189,
    perChi: 'Fino a cinque operatori',
    consigliato: true,
    incluso: [
      'Tutto quello che c’è in Solo',
      'Dettatura dell’anamnesi durante la visita',
      'Agenda condivisa fra gli operatori',
      'Permessi differenziati per ruolo',
      'Sorveglianza automatica degli accessi anomali',
      'Assistenza via chat con risposta in giornata',
    ],
  },
] as const

/** Cosa è compreso nell'attivazione, senza costi a sorpresa. */
export const ATTIVAZIONE = [
  'Migrazione dell’anagrafica e dello storico dal gestionale che usi oggi',
  'Configurazione dello studio, degli operatori e dei permessi',
  'Formazione iniziale, in videochiamata o di persona',
  'Nessun costo di attivazione, nessun vincolo di durata',
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
  titolo: 'Un portale non è una cartella clinica',
  testo:
    'Molti studi hanno già l’abbonamento a un portale di prenotazione e danno per scontato di avere il software. Un portale riempie l’agenda: mostra il profilo, raccoglie le prenotazioni, manda i promemoria. Una cartella clinica risponde ad altre domande, che arrivano dopo e da un’altra parte: che cosa hai iniettato, dove, con quale lotto, che cosa avevi spiegato prima di farlo, chi ha aperto quel documento due anni dopo.',
  righe: [
    'Se usi un portale per farti trovare, tienilo. Non ti chiediamo di rinunciarci per cominciare.',
    'Non raccogliamo recensioni sul tuo conto e non pubblichiamo classifiche di medici.',
    'Non vendiamo visibilità. Qui non c’è una posizione da comprare, né per te né per un collega.',
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
  titolo: 'Se ti restano mesi da pagare altrove',
  testo:
    'La ragione più comune per non cambiare non è il prezzo: sono i mesi che restano sul contratto che hai già firmato con qualcun altro. Se sei in quella situazione dillo subito, prima di guardare il listino: entro un tetto che concordiamo insieme quei mesi li copriamo noi. Non è uno sconto e non è una promozione: è il costo di uscita che ti toglie di mezzo, e va discusso caso per caso perché dipende da quanto ti resta.',
} as const

/** L'ancora del prezzo. Non è il risparmio: è il costo di una contestazione. */
export const ANCORA = {
  /* Era «Con che cosa si confronta», identico all'occhiello che gli sta sopra
   * in /prezzi: la stessa riga stampata due volte a due centimetri di distanza.
   * L'occhiello dice di che cosa si parla, il titolo deve dire la tesi. */
  titolo: 'Il conto non si fa col prezzo del software',
  testo:
    'Il conto non si fa con quanto costa il software. Si fa con quanto costa la prima volta che devi dimostrare cosa avevi spiegato a una paziente due anni fa, e non hai niente di scritto oltre a un modulo generico. La parcella di un legale per aprire quella pratica supera l’abbonamento di un anno.',
  cautela:
    'Non promettiamo che un buon consenso vinca una causa: non funziona così, e chi te lo dice ti sta vendendo qualcosa. Promettiamo che la documentazione esista, sia completa e si dimostri non ritoccata.',
} as const
