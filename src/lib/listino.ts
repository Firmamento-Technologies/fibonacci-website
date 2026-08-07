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

/** L'ancora del prezzo. Non è il risparmio: è il costo di una contestazione. */
export const ANCORA = {
  titolo: 'Con che cosa si confronta',
  testo:
    'Il conto non si fa con quanto costa il software. Si fa con quanto costa la prima volta che devi dimostrare cosa avevi spiegato a una paziente due anni fa, e non hai niente di scritto oltre a un modulo generico. La parcella di un legale per aprire quella pratica supera l’abbonamento di un anno.',
  cautela:
    'Non promettiamo che un buon consenso vinca una causa: non funziona così, e chi te lo dice ti sta vendendo qualcosa. Promettiamo che la documentazione esista, sia completa e si dimostri non ritoccata.',
} as const
