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
 * ── ⛔ DA QUI NON SI LEGGE MAI IL CRM ───────────────────────────────────────
 * Esiste un secondo registro di medici — il **CRM** (Atomic CRM self-hosted,
 * [[decisione-crm-atomic-selfhosted]]), dove stanno i contatti, le trattative
 * e le note commerciali. ⛔ **Non è questa la sua strada**, e la tentazione di
 * collegarlo è forte proprio perché «i medici ci sono già».
 *
 * Sono **due popolazioni con due status giuridici diversi**:
 *   · nel CRM ci sono i **prospect** — medici contattati e mai diventati
 *     clienti. Pubblicarne uno significa trattare i suoi dati senza base
 *     giuridica, e farlo scoprire a lui (o al suo fornitore attuale);
 *   · qui devono arrivare **solo** gli studi che sono clienti **e** hanno
 *     acceso il consenso (TD-93).
 *
 * E c'è un secondo motivo, più silenzioso: **l'ordine e il numero
 * d'iscrizione**. Sono il pezzo di valore della scheda, l'unico che nessuno
 * degli altri portali mette in evidenza. Se venissero dal CRM sarebbero un
 * dato che abbiamo trascritto noi, e divergerebbero da quello che il medico
 * mantiene nel suo gestionale ⇒ la pagina pubblicherebbe un numero vecchio,
 * ⚠️ e davanti all'Ordine risponde **lui**, non noi.
 *
 * 🔑 **Il collegamento fra i due mondi è un campo solo, e sta dall'altra
 * parte**: quando un prospect diventa cliente, nel CRM si scrive l'id
 * dell'`Organization`. Il CRM sa **chi è cliente**; ⛔ non sa **com'è fatto lo
 * studio**, e non deve saperlo.
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
  /** L'id dell'`Organization` su Medplum. ⚠️ **Serve al server, non alla
   *  pagina**: è il `studioId` del `POST /pubblico/prenota`, e senza di lui il
   *  modulo non può spedire. Non è un dato riservato — gli endpoint pubblici lo
   *  prendono già dall'URL (`/pubblico/studio/{id}`) e dalla query degli slot —
   *  ⛔ ma non si mostra in pagina: non dice niente al paziente. */
  organizationId: string
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

  /** La foto del medico. **Facoltativa** (decisione dell'utente, 2026-08-12).
   *
   * 🔑 Il suo mestiere è il **riconoscimento**, non la decorazione: NN/g chiede
   * foto *«large enough to identify a known item»* — qui «a known item» è la
   * persona che il paziente ha già visto in studio o su Instagram.
   * ⛔ **Mai una foto di repertorio**: una faccia finta su una scheda sanitaria
   * è peggio di nessuna faccia. Se manca, si mostrano le iniziali — che non
   * fingono niente e tengono il ritmo dell'elenco. */
  foto?: { src: string; alt: string }

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
/* ⚠️ Gli orari dell'esempio si calcolano dal momento della **costruzione**.
 *
 * Su una pagina indicizzata sarebbe l'errore che `sitemap.ts` documenta (una
 * data di build spacciata per un fatto), ⛔ ma qui la pagina è **`noindex` e
 * fuori dal sitemap**, e serve a esercitare il ramo «ci sono orari» — che
 * altrimenti nessuno guarderebbe mai, come è già successo per il ramo opposto. */
function slotDiEsempio(): SlotPubblico[] {
  const base = new Date()
  base.setDate(base.getDate() + 2)
  return [10, 11, 15].map((ora, i) => {
    const inizio = new Date(base)
    inizio.setHours(ora, 30, 0, 0)
    const fine = new Date(inizio)
    fine.setMinutes(fine.getMinutes() + 30)
    return { id: `esempio-${i}`, inizio: inizio.toISOString(), fine: fine.toISOString() }
  })
}

export const MEDICI_ESEMPIO: readonly SchedaMedicoPubblica[] = [
  {
    slug: 'studio-dimostrativo',
    /* ⚠️ **Manopola di PROVA, spenta di default.** Il modulo di prenotazione
     * manda `studioId: organizationId` al sidecar: con un valore inventato la
     * richiesta viene rifiutata, quindi il percorso completo non si può provare.
     * Con `NEXT_PUBLIC_PAZIENTI_ORG_DEMO=<id di una Organization vera>` questa scheda punta
     * a uno studio che esiste davvero, e la catena elenco → scheda → orari →
     * prenotazione si prova fino in fondo.
     * ⛔ Confronto stretto e valore letto una volta sola: è la lezione di
     * `PAZIENTI_ESEMPI`, dove `=0` finiva per accendere. Qui basta che sia
     * non vuoto, e se non c'è resta il segnaposto — che il sidecar rifiuta. */
    /* ⚠️ `NEXT_PUBLIC_`: questo modulo finisce **anche nel bundle client**
     * (`ModuloPrenotazione` ne importa le funzioni di formato), e senza il
     * prefisso il valore sarebbe `undefined` di là ⇒ server e browser
     * userebbero due `organizationId` diversi, e la prenotazione partirebbe
     * verso uno studio che non esiste. */
    organizationId: (process.env.NEXT_PUBLIC_PAZIENTI_ORG_DEMO ?? '').trim() || 'esempio-org-1',
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
  {
    /* Il secondo esempio esiste per una ragione sola: **l'elenco con più di una
     * voce**, e il ramo «questo studio ha orari liberi». Con un esempio solo,
     * metà della UI non sarebbe mai stata guardata. */
    slug: 'studio-dimostrativo-due',
    organizationId: 'esempio-org-2',
    esempio: true,
    studio: {
      nome: 'Secondo Studio Dimostrativo',
      indirizzo: 'Piazza di Esempio 2',
      comune: 'Milano (MI)',
      telefono: '+39 000 0000001',
      email: 'esempio2@fibonaccimedica.it',
    },
    medico: {
      nome: 'Altro Nome Cognome',
      titolo: 'Medico chirurgo',
      ordineProvinciale: 'Milano',
      numeroIscrizione: '00001',
    },
    prestazioni: ['Prima visita di medicina estetica', 'Tossina botulinica', 'Peeling'],
    slot: slotDiEsempio(),
  },
]

/* La soglia sotto cui l'elenco resta nudo: niente ricerca, niente filtri.
 *
 * **15** (decisione dell'utente, 2026-08-12). ⚠️ Non è un numero di
 * ottimizzazione, è un numero di **dignità**: filtrare tre risultati è teatro,
 * e una ricerca che restituisce due nomi dice al paziente che il posto è vuoto
 * meglio di quanto lo direbbe l'elenco stesso.
 * Stessa logica per cui l'indice non si pubblica con tre schede
 * ([[piano-canale-paziente-implementazione]] §P6). */
export const SOGLIA_ELENCO = 15

/* Esempi in quantità, **solo per guardare l'elenco pieno**.
 *
 * ⚠️ Serve a esercitare un ramo che altrimenti non guarderebbe mai nessuno:
 * quello **sopra `SOGLIA_ELENCO`**, dove compaiono il conteggio e (in futuro)
 * ricerca e filtri. Senza, quella parte di UI nascerebbe non vista — lo stesso
 * errore già evitato per «nessun orario» e per «l'elenco ha voci».
 *
 *     NEXT_PUBLIC_PAZIENTI_ESEMPI=true npm run build    ⇒ i 2 esempi scritti a mano
 *     NEXT_PUBLIC_PAZIENTI_ESEMPI=18   npm run build    ⇒ 18, per superare la soglia
 *
 * ⛔ **Mai in un rilascio**: la variabile è assente per difetto e questi studi
 * sono dichiaratamente finti — nome numerato, `esempio: true`, quindi `noindex`
 * e fuori dal sitemap. */
const COMUNI_ESEMPIO = [
  'Milano (MI)', 'Roma (RM)', 'Torino (TO)', 'Padova (PD)', 'Lecce (LE)',
  'Bergamo (BG)', 'Pescara (PE)', 'Carrara (MS)', 'Bologna (BO)', 'Firenze (FI)',
  'Napoli (NA)', 'Verona (VR)', 'Bari (BA)', 'Genova (GE)', 'Cagliari (CA)',
  'Trieste (TS)',
] as const

/* Lettere greche: danno nomi **evidentemente finti** e **iniziali diverse**,
 * così in anteprima i ritratti non sono tutti uguali. */
const LETTERE_ESEMPIO = [
  'Alfa', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
  'Iota', 'Kappa', 'Lambda', 'Mi', 'Ni', 'Xi', 'Omicron', 'Pi',
] as const

function esempiGenerati(quanti: number): SchedaMedicoPubblica[] {
  return Array.from({ length: Math.max(0, quanti - MEDICI_ESEMPIO.length) }, (_, i) => {
    const n = i + 3
    const comune = COMUNI_ESEMPIO[i % COMUNI_ESEMPIO.length]
    return {
      slug: `studio-dimostrativo-${n}`,
      organizationId: `esempio-org-${n}`,
      esempio: true,
      studio: {
        nome: `Studio Dimostrativo ${n}`,
        indirizzo: `Via di Esempio ${n}`,
        comune,
        telefono: `+39 000 000000${n % 10}`,
        email: `esempio${n}@fibonaccimedica.it`,
      },
      medico: {
        /* 🔎 **Corretto il 2026-08-12**: qui c'era il **nome dello studio** al
         * posto di quello del medico, e in elenco si leggeva «Studio
         * Dimostrativo 10» come se fosse una persona — con le iniziali tutte
         * uguali («SD»), che appiattivano i ritratti e rendevano l'anteprima
         * meno leggibile proprio dove serviva guardarla.
         * ⛔ I nomi restano **dichiaratamente finti**: mai un nome plausibile
         * su una scheda sanitaria, nemmeno in anteprima. */
        nome: `Esempio ${LETTERE_ESEMPIO[i % LETTERE_ESEMPIO.length]}`,
        titolo: 'Medico chirurgo',
        ordineProvinciale: comune.replace(/\s*\(.*\)$/, ''),
        numeroIscrizione: String(10000 + n),
      },
      prestazioni: ['Prima visita di medicina estetica', 'Tossina botulinica', 'Biostimolazione'],
      /* Metà con orari e metà senza: **entrambi i rami** devono comparire
       * nello stesso elenco, altrimenti si guarda solo quello fortunato. */
      slot: i % 2 === 0 ? slotDiEsempio() : [],
    }
  })
}

/* ── L'interruttore degli esempi: UN SOLO POSTO CHE LO LEGGE ────────────────
 *
 * 🔴 **Perché sta qui e non anche nella pagina.** `PAZIENTI_ESEMPI` è stato
 * letto per un po' in **due punti con due significati**: qui come *quanti*
 * (`Number(...)`), e in `app/pazienti/page.tsx` come *sì/no*. Due letture della
 * stessa variabile possono solo divergere, e infatti divergevano in **entrambe**
 * le direzioni:
 *   · `PAZIENTI_ESEMPI=20` → la pagina non mostrava niente (non era la stringa
 *     `'true'`) mentre questa funzione era pronta a generarne venti;
 *   · e correggendo quello con `Boolean(v) && v !== 'false'`, **`=0` accendeva
 *     gli esempi** — perché `Boolean('0')` è vero: la stringa non è vuota.
 * Su una pagina pubblica il cui scopo dichiarato è che *«non compaia un medico
 * che non esiste»*, `=0` che vuol dire «accendi» è un innesco silenzioso.
 *
 * ⛔ **Fail-closed per costruzione**: si accende **solo** con un valore che
 * questa funzione capisce. Tutto il resto — `0`, `false`, `no`, `off`, `-1`,
 * `2.5`, vuoto, non impostata — vale **spento**. Non c'è nessun ramo che dica
 * «non ho capito, quindi sì».
 *
 * ⚠️ È un flag di **build**: il sito è `output: 'export'`, quindi il valore
 * viene cotto dentro le pagine al momento del `next build`, non deciso a
 * runtime. Cambiarlo richiede ricostruire. */
export function esempiRichiesti(): number {
  /* ⚠️ `NEXT_PUBLIC_`, come per l'id dello studio: da quando `VoceElenco` e
   * `RicercaMedici` sono componenti **client**, questo modulo finisce anche nel
   * bundle del browser, e senza prefisso il valore sarebbe `undefined` di là ⇒
   * server e browser conterebbero due elenchi diversi. Misurato il 2026-08-13:
   * l'elenco usciva **vuoto** pur avendo passato la variabile alla build. */
  const grezzo = (process.env.NEXT_PUBLIC_PAZIENTI_ESEMPI ?? '').trim().toLowerCase()
  // `true` resta l'uso documentato: «accendi quelli scritti a mano», senza
  // dover sapere quanti sono.
  if (grezzo === 'true') return MEDICI_ESEMPIO.length
  const quanti = Number(grezzo)
  return grezzo !== '' && Number.isInteger(quanti) && quanti > 0 ? quanti : 0
}

/** Se l'elenco pubblico deve mostrare gli studi di esempio. */
export function mostraEsempi(): boolean {
  return esempiRichiesti() > 0
}

/** Gli studi da pubblicare. Oggi: solo gli esempi.
 *
 * ⚠️ Torna gli esempi **anche a interruttore spento**, ed è voluto: le loro
 * schede devono continuare a essere costruite, perché `scripts/collaudo.mjs`
 * ne esercita una (`/pazienti/medico/studio-dimostrativo`) a ogni `pre-push`,
 * su una build senza flag. A nasconderli è **l'elenco**, che è l'unico posto
 * dove un visitatore li conterebbe come medici veri; le schede portano già
 * `noindex`, il riquadro «questo studio non esiste» e nessun dato strutturato,
 * e non stanno nella sitemap. */
export function mediciPubblicati(): readonly SchedaMedicoPubblica[] {
  const richiesti = esempiRichiesti()
  if (richiesti > MEDICI_ESEMPIO.length) {
    return [...MEDICI_ESEMPIO, ...esempiGenerati(richiesti)]
  }
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

/** Solo il giorno («venerdì 14 agosto»). Serve a scriverlo **una volta sola**
 *  sopra una fila di orari, invece di ripeterlo per ogni orario: tre righe che
 *  dicono lo stesso giorno sono tre righe da leggere per un'informazione sola.
 *  ⚠️ Difetto visto a video il 2026-08-12 e corretto lì. */
export function giornoInItaliano(iso: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Rome',
  }).format(new Date(iso))
}

/** Solo l'ora («10:30»). */
export function oraInItaliano(iso: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome',
  }).format(new Date(iso))
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
