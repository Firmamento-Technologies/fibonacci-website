/* I medici che hanno acceso la pagina pubblica — TD-95, primo pezzo.
 *
 * ── DA DOVE ARRIVERANNO I DATI ─────────────────────────────────────────────
 * ⚠️ **Oggi qui c'è un solo studio di esempio, e non è una scorciatoia: è lo
 * stato vero del progetto.** Nessuno studio ha ancora acconsentito, perché
 * l'interruttore di consenso non esiste (TD-93) e non ci sono clienti.
 *
 * Quando ci saranno, questo modulo **non cambia forma**: `SchedaMedicoPubblica`
 * ricalca **campo per campo** ciò che il sidecar già restituisce da
 * `GET /pubblico/studio/{organization_id}` (`EMR/services/pdf-signer/
 * scheda_pubblica.py`, proiezione a lista bianca scritta a mano). Cablarlo
 * sarà **sostituire una funzione**, non riscrivere le pagine:
 *
 *     export async function mediciPubblicati() {
 *       const r = await fetch(`${SIDECAR}/pubblico/elenco`)   // TD-94
 *       return (await r.json()) as SchedaMedicoPubblica[]
 *     }
 *
 * ⛔ La lettura avviene **in costruzione**, mai dal browser del visitatore: il
 * sito è `output: 'export'` e il contenuto dev'essere dentro l'HTML servito,
 * altrimenti la pagina non si posiziona — che è l'unica ragione per cui
 * esiste. Vedi [[piano-canale-paziente-implementazione]] §P4.2.
 *
 * ── COSA NON ENTRA MAI QUI ─────────────────────────────────────────────────
 * ⛔ Nessun listino, sconto, «prima visita gratuita», foto prima/dopo,
 *    superlativo o classifica: L. 145/2018 art. 1 c. 525 esclude «qualsiasi
 *    elemento di carattere attrattivo e suggestivo», e il c. 536 dà il potere
 *    disciplinare all'Ordine **verso il medico**. La superficie la
 *    costruiremmo noi, il richiamo lo prenderebbe lui.
 * ⛔ Nessuna recensione e nessun `aggregateRating`.
 * ⛔ Nessun dato clinico, nessun paziente: da qui passano solo i dati che lo
 *    studio è **tenuto** a pubblicare (art. 7 D.Lgs. 70/2003) e gli orari in
 *    cui è libero.
 */

/** Uno slot libero. Stessa forma di `GET /pubblico/prenota/slot`. */
export interface SlotPubblico {
  /** L'id dello `Slot` FHIR: torna indietro nella richiesta di prenotazione. */
  id: string
  /** ISO 8601. */
  inizio: string
  fine: string
}

export interface SchedaMedicoPubblica {
  /** Chiave d'indirizzo, stabile: entra nell'URL e ⛔ non si cambia dopo la
   *  pubblicazione — cambiarla rompe i collegamenti che il medico ha dato ai
   *  suoi pazienti, ed è il tipo di rottura che non si vede da qui. */
  slug: string
  /** ⛔ `true` solo per gli esempi: la pagina esce con `noindex` e resta fuori
   *  dal sitemap. Un profilo inventato che si posiziona come se fosse un
   *  medico vero sarebbe un danno, non un segnaposto. */
  esempio?: boolean

  studio: {
    nome: string
    indirizzo: string
    comune: string
    telefono: string
    email: string
  }

  /** 🔑 Il pezzo che nessuno degli otto portali mette in evidenza, e che noi
   *  abbiamo già nel dato (`urn:firmamento:ordine-medici`): **l'iscrizione
   *  all'albo, col numero**. È verificabile da chiunque sul sito dell'Ordine,
   *  e in una specialità dove esercita anche chi non dovrebbe è l'unica
   *  informazione di fiducia che non si può millantare. */
  medico: {
    nome: string
    titolo: string
    ordineProvinciale: string
    numeroIscrizione: string
  }

  /** Cosa fa davvero. ⛔ Nomi delle prestazioni, mai prezzi né promesse di
   *  risultato. */
  prestazioni: readonly string[]

  /** ⚠️ Può essere **vuoto**, ed è il caso normale finché lo studio non
   *  configura le disponibilità: si prenota **solo su Slot seminati** e la
   *  pagina deve dirlo invece di mostrare un calendario muto (TD-93). */
  slot: readonly SlotPubblico[]
}

/* Lo studio di esempio.
 *
 * ⚠️ Serve a costruire e collaudare la pagina **prima** che esista un cliente,
 * non a far numero. Perciò: nome che dichiara sé stesso, `esempio: true`,
 * `noindex`, fuori dal sitemap, e un avviso **in pagina**. */
export const MEDICI_ESEMPIO: readonly SchedaMedicoPubblica[] = [
  {
    slug: 'studio-dimostrativo',
    esempio: true,
    studio: {
      nome: 'Studio Dimostrativo',
      indirizzo: 'Via di Esempio 1',
      comune: 'Carrara (MS)',
      telefono: '+39 000 0000000',
      email: 'esempio@fibonaccimedica.it',
    },
    medico: {
      nome: 'Nome Cognome',
      titolo: 'Medico chirurgo',
      ordineProvinciale: 'Massa-Carrara',
      numeroIscrizione: '00000',
    },
    prestazioni: [
      'Prima visita di medicina estetica',
      'Tossina botulinica',
      'Filler con acido ialuronico',
      'Biostimolazione',
      'Controllo post-trattamento',
    ],
    /* ⛔ Volutamente **vuoto**: è lo stato in cui nasce ogni studio prima di
     * configurare l'agenda, ed è il caso che la pagina deve gestire bene. Se
     * l'esempio avesse orari finti, il ramo «nessuna disponibilità» non
     * sarebbe mai stato guardato da nessuno. */
    slot: [],
  },
]

/** Gli studi da pubblicare. Oggi: solo gli esempi. */
export function mediciPubblicati(): readonly SchedaMedicoPubblica[] {
  return MEDICI_ESEMPIO
}

export function medicoPerSlug(slug: string): SchedaMedicoPubblica | undefined {
  return mediciPubblicati().find((m) => m.slug === slug)
}

/** L'indirizzo pubblico di una scheda. Un solo posto che lo costruisce, così
 *  pagina, sitemap e dati strutturati non possono divergere. */
export function percorsoMedico(slug: string): string {
  return `/pazienti/medico/${slug}`
}

/** Giorno e ora in italiano, per gli orari liberi.
 *
 * ⚠️ `Intl` con fuso **esplicito**: senza, la costruzione userebbe il fuso
 * della macchina che costruisce, e la stessa pagina direbbe orari diversi a
 * seconda di dove gira il rilascio. */
export function quandoInItaliano(iso: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Rome',
  }).format(new Date(iso))
}
