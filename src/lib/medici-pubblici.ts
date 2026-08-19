/* I medici che hanno acceso la pagina pubblica — TD-95, primo pezzo.
 *
 * ── DA DOVE ARRIVANO I DATI (TD-94, cablato il 2026-08-19) ─────────────────
 * Dal sidecar: `GET /pubblico/elenco` restituisce gli studi che stanno
 * nell'allowlist del deployment E hanno acceso il consenso (TD-93), già nella
 * forma di `SchedaMedicoPubblica` (la proiezione a lista bianca è la STESSA
 * della scheda singola: `EMR/services/pdf-signer/scheda_pubblica.py`,
 * `voce_elenco`). Gli esempi scritti a mano restano: servono al collaudo
 * delle pagine e a esercitare i rami che i dati veri non esercitano.
 *
 * ⛔ La lettura avviene **in costruzione**, mai dal browser del visitatore: il
 * sito è `output: 'export'` e il contenuto dev'essere dentro l'HTML servito,
 * altrimenti la pagina non si posiziona — che è l'unica ragione per cui
 * esiste. Vedi [[piano-canale-paziente-implementazione]] §P4.2.
 *
 * 🔴 **Se `NEXT_PUBLIC_PRENOTA_API_URL` è impostata e l'elenco non risponde,
 * la BUILD FALLISCE** — di proposito: una ricostruzione che pubblicasse il
 * sito senza i medici veri farebbe sparire le loro pagine in silenzio, che è
 * la forma peggiore del guasto. Senza la variabile (build locali, CI) non si
 * chiama niente e restano gli esempi.
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

import { t } from '@/lib/testo'

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
  /** Il dominio del sito dello studio: è la **chiave dell'elenco** e quella con
   *  cui il canale di contatto trova il recapito (TD-166).
   *
   *  🔑 **Perché il dominio e non l'email.** L'indirizzo del medico ⛔ non passa
   *  mai dal browser: il modulo manda **questa chiave**, e il recapito lo
   *  risolve il server. Pubblicare l'email in pagina la consegnerebbe a
   *  chiunque scarichi il sito, che è precisamente il modo in cui quegli
   *  indirizzi sono finiti nel nostro elenco.
   *
   *  ⚠️ È anche la chiave con cui la scheda **dichiarata dallo studio** si
   *  fonde con quella letta da fonti pubbliche (TD-167): a righe coincidenti
   *  vince la sua, perché è l'unica che mantiene lui. */
  dominio: string
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
    /** Dove sta lo studio, per la mappa in pagina.
     *
     * 🔴 **Prerequisito scoperto provando a incorporare la mappa** (richiesta
     * dell'utente, 2026-08-13: *«voglio vedere la mappa dentro la UI non come
     * link»*): un riquadro di OpenStreetMap si centra su un **riquadro di
     * coordinate**, ⛔ non su una stringa d'indirizzo. Un collegamento accetta
     * il testo, una mappa incorporata no — e la differenza non si vede finché
     * non si prova.
     *
     * ⚠️ **`esatta` non è un dettaglio burocratico.** Un puntino disegnato
     * dove lo studio **non è** è peggio di nessun puntino: manda una persona
     * all'indirizzo sbagliato. Quando le coordinate vengono dal **comune** e
     * non dal civico, la pagina **lo dice** invece di fingere precisione.
     * ⛔ Vale la regola di [[piano-ui-canale-paziente]] §7: i centroidi di
     * provincia ⛔ non si pubblicano come `geo` — direbbero che lo studio sta
     * al centro della provincia.
     *
     * 🔑 Per gli studi **veri** questo campo va riempito **in costruzione**,
     * geocodificando l'indirizzo una volta sola (⛔ mai dal browser del
     * visitatore: sarebbe una chiamata a terzi per ogni visita). È il pezzo
     * che serve anche a **TD-113** (il più vicino) e a **TD-114** (`geo` nei
     * dati strutturati). */
    coordinate?: { lat: number; lon: number; esatta: boolean }
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
    dominio: 'studio-dimostrativo.example',
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
      nome: t('lib.medicipubblici.studio_dimostrativo'),
      indirizzo: t('lib.medicipubblici.via_di_esempio_1'),
      comune: t('lib.medicipubblici.carrara_ms'),
      telefono: '+39 000 0000000',
      email: 'esempio@fibonaccimedica.it',
      /* ⚠️ **Il comune, non il civico, e la pagina lo dichiara.** «Via di
         Esempio 1» ⛔ non esiste: geocodificarla darebbe un punto inventato, e
         un puntino dove lo studio non è manda una persona nel posto sbagliato.
         `esatta: false` accende in pagina la riga che lo dice. */
      coordinate: { lat: 44.0793, lon: 10.0977, esatta: false },
    },
    medico: {
      nome: t('lib.medicipubblici.nome_cognome'),
      titolo: t('lib.medicipubblici.medico_chirurgo'),
      ordineProvinciale: 'Massa-Carrara',
      numeroIscrizione: '00000',
    },
    prestazioni: [
      t('lib.medicipubblici.prima_visita_di_medicina_estetica'),
      t('lib.medicipubblici.tossina_botulinica'),
      t('lib.medicipubblici.filler_con_acido_ialuronico'),
      t('lib.medicipubblici.biostimolazione'),
      t('lib.medicipubblici.controllo_post_trattamento'),
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
    dominio: 'studio-dimostrativo-due.example',
    organizationId: 'esempio-org-2',
    esempio: true,
    studio: {
      nome: t('lib.medicipubblici.secondo_studio_dimostrativo'),
      indirizzo: t('lib.medicipubblici.piazza_di_esempio_2'),
      comune: t('lib.medicipubblici.milano_mi'),
      telefono: '+39 000 0000001',
      email: 'esempio2@fibonaccimedica.it',
      /* Comune, come l'altro esempio: l'indirizzo non esiste. */
      coordinate: { lat: 45.4642, lon: 9.19, esatta: false },
    },
    medico: {
      nome: t('lib.medicipubblici.altro_nome_cognome'),
      titolo: t('lib.medicipubblici.medico_chirurgo'),
      ordineProvinciale: 'Milano',
      numeroIscrizione: '00001',
    },
    prestazioni: [t('lib.medicipubblici.prima_visita_di_medicina_estetica'), t('lib.medicipubblici.tossina_botulinica'), t('lib.medicipubblici.peeling')],
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
  t('lib.medicipubblici.milano_mi'), t('lib.medicipubblici.roma_rm'), t('lib.medicipubblici.torino_to'), t('lib.medicipubblici.padova_pd'), t('lib.medicipubblici.lecce_le'),
  t('lib.medicipubblici.bergamo_bg'), t('lib.medicipubblici.pescara_pe'), t('lib.medicipubblici.carrara_ms'), t('lib.medicipubblici.bologna_bo'), t('lib.medicipubblici.firenze_fi'),
  t('lib.medicipubblici.napoli_na'), t('lib.medicipubblici.verona_vr'), t('lib.medicipubblici.bari_ba'), t('lib.medicipubblici.genova_ge'), t('lib.medicipubblici.cagliari_ca'),
  t('lib.medicipubblici.trieste_ts'),
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
      // ⚠️ `.example` è riservato dalla RFC 2606: ⛔ non può essere di nessuno,
      //    quindi un esempio ⛔ non può puntare a uno studio vero nemmeno per
      //    sbaglio.
      dominio: `studio-dimostrativo-${n}.example`,
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
        titolo: t('lib.medicipubblici.medico_chirurgo'),
        ordineProvinciale: comune.replace(/\s*\(.*\)$/, ''),
        numeroIscrizione: String(10000 + n),
      },
      prestazioni: [t('lib.medicipubblici.prima_visita_di_medicina_estetica'), t('lib.medicipubblici.tossina_botulinica'), t('lib.medicipubblici.biostimolazione')],
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

/* ── L'elenco vero, dal sidecar (TD-94) ─────────────────────────────────────
 *
 * ⚠️ Gira SOLO in costruzione (le pagine che lo chiamano sono server
 * components di un sito `output: 'export'`): nel bundle del browser questa
 * funzione non viene mai invocata — di qui importano solo i formattatori.
 * La promessa è condivisa a livello di modulo perché la chiamano più pagine
 * (elenco, schede, parametri statici): una fetch sola per build worker. */
let elencoDalSidecar: Promise<SchedaMedicoPubblica[]> | undefined

async function mediciDalSidecar(): Promise<SchedaMedicoPubblica[]> {
  const base = (process.env.NEXT_PUBLIC_PRENOTA_API_URL ?? '').trim().replace(/\/$/, '')
  if (!base) return []
  /* ⚠️ Niente `cache: 'no-store'`: renderebbe la rotta DINAMICA e il sito è
   * `output: 'export'` — la build fallisce (misurato al primo rilascio). La
   * cache di build va benissimo: l'elenco è la fotografia del momento della
   * costruzione, che è esattamente il contratto di un sito statico. */
  const r = await fetch(`${base}/pubblico/elenco`)
  if (!r.ok) {
    /* 🔴 Build rossa, non elenco vuoto: vedi la testata del file. */
    throw new Error(
      `L'elenco dei medici non risponde (${r.status} da ${base}/pubblico/elenco): ` +
        'non pubblico un sito senza le loro pagine.',
    )
  }
  const dati = (await r.json()) as { medici?: Omit<SchedaMedicoPubblica, 'slot'>[] }
  /* `slot: []` è deliberato: gli orari veri arrivano dal sidecar a runtime
   * (`useOrariLiberi`), e quelli cotti in build sarebbero già vecchi. */
  return (dati.medici ?? []).map((m) => ({ ...m, slot: [] as SlotPubblico[] }))
}

/** Gli studi da pubblicare: quelli VERI dal sidecar, più gli esempi.
 *
 * ⚠️ Torna gli esempi **anche a interruttore spento**, ed è voluto: le loro
 * schede devono continuare a essere costruite, perché `scripts/collaudo.mjs`
 * ne esercita una (`/pazienti/medico/studio-dimostrativo`) a ogni `pre-push`,
 * su una build senza flag. A nasconderli è **l'elenco**, che è l'unico posto
 * dove un visitatore li conterebbe come medici veri; le schede portano già
 * `noindex`, il riquadro «questo studio non esiste» e nessun dato strutturato,
 * e non stanno nella sitemap. Vale anche per gli studi veri marcati «di
 * prova» dal sidecar (`esempio: true`): stessa regola, stessa ragione. */
export async function mediciPubblicati(): Promise<readonly SchedaMedicoPubblica[]> {
  elencoDalSidecar ??= mediciDalSidecar()
  const reali = await elencoDalSidecar
  const richiesti = esempiRichiesti()
  const esempi =
    richiesti > MEDICI_ESEMPIO.length
      ? [...MEDICI_ESEMPIO, ...esempiGenerati(richiesti)]
      : [...MEDICI_ESEMPIO]
  /* I veri prima: l'elenco li mostra in testa, e uno slug che collidesse con
   * un esempio vincerebbe — non può succedere (gli slug veri finiscono con la
   * coda dell'id), ma l'ordine lo garantisce comunque. */
  return [...reali, ...esempi]
}

export async function medicoPerSlug(slug: string): Promise<SchedaMedicoPubblica | undefined> {
  return (await mediciPubblicati()).find((m) => m.slug === slug)
}

/** L'indirizzo pubblico di una scheda. Un solo posto che lo costruisce, così
 *  pagina, sitemap e dati strutturati non possono divergere. */
export function percorsoMedico(slug: string): string {
  return `/pazienti/medico/${slug}`
}

/** L'indirizzo dello studio, aperto in una mappa.
 *
 * ── PERCHE' UN COLLEGAMENTO E NON UNA MAPPA ────────────────────────────────
 * ⛔ **Nessuna mappa incorporata**, mai: un `iframe` di terzi butterebbe via da
 * sola la ragione per cui questo sito **non ha il banner dei cookie** (non
 * chiama nessuno). Un collegamento invece non chiama niente finché non lo
 * premi, ed è una navigazione **decisa dal visitatore**.
 *
 * 🔴 **Google e non più OpenStreetMap** (richiesta dell'utente, 2026-08-13:
 * *«servirebbe che fosse cliccabile e mandasse alla mappa tipo google maps»*).
 * Il motivo pratico batte la preferenza: su Android questo indirizzo **apre
 * l'app Maps**, che è il gesto che il paziente si aspetta dopo aver scelto uno
 * studio; il collegamento OSM apriva una pagina web da cui bisogna ripartire.
 * ⚠️ **`rel="noreferrer"` non è cosmesi**: senza, il browser manderebbe a
 * Google l'indirizzo **della pagina di partenza** — cioè *quale medico* stava
 * guardando quella persona. È esattamente il dato che questo canale esiste per
 * non far uscire. Chi usa questa funzione deve mettere
 * `rel="noopener noreferrer"`.
 *
 * 🔑 Sta qui, accanto ai dati, perché la usano **due** viste (la voce di elenco
 * e la scheda) e due copie di una URL costruita a mano divergono alla prima
 * occasione — in questo progetto è la regola, non l'eccezione. */
export function mappaStudio(studio: { indirizzo: string; comune: string }): string | undefined {
  /* 🔴 **Torna `undefined` se non c'è un indirizzo, e ⛔ non è pignoleria.**
   * 🔎 Misurato il 2026-08-13 chiamando il sidecar sullo studio vero
   * (`GET /pubblico/studio/<id>`): `indirizzo`, `telefono`, `email` e
   * `partitaIva` tornano **stringhe vuote** — l'`Organization` di Medplum ⛔ non
   * li ha compilati. Finora non se n'era accorto nessuno perché in pagina ci
   * sono **due studi d'esempio scritti a mano**, che ce li hanno tutti.
   * ⇒ al primo studio vero questa funzione avrebbe prodotto una ricerca su
   * `", "` — cioè un collegamento che porta **in mezzo al nulla**, con l'aria
   * di funzionare. Chi lo chiama deve poter **non disegnare il collegamento**. */
  const pezzi = [studio.indirizzo, studio.comune].map((s) => s.trim()).filter(Boolean)
  if (pezzi.length === 0) return undefined
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pezzi.join(', '))}`
}

/** Gli orari liberi, raggruppati per giornata e in ordine.
 *
 * 🔴 **Nasce da un difetto vero, non da un'esigenza estetica.** Sia la voce di
 * elenco sia il modulo di prenotazione scrivevano **un solo giorno** —
 * `giornoInItaliano(orari[0].inizio)` — e sotto ci mettevano **tutti** gli
 * orari. Finché il sidecar restituisce slot di una giornata sola la bugia non
 * si vede; il giorno in cui ne restituisce due, la pagina dichiara *«venerdì
 * 14 agosto»* sopra un orario che è di **sabato**. ⇒ un paziente si presenta
 * il giorno sbagliato. Il difetto era invisibile ai dati d'esempio, ed è
 * esattamente il tipo che questo progetto ha già pagato più volte.
 *
 * 🔑 Raggruppare **è** la correzione: se ogni giorno porta la sua intestazione,
 * la data non può più riferirsi all'orario sbagliato — non per disciplina di
 * chi scrive, ma perché la struttura non lo consente.
 *
 * ⚠️ Le giornate si tagliano sul fuso di **Roma**, non su UTC: uno slot delle
 * 00:30 italiane è `23:30Z` del giorno prima, e un raggruppamento fatto sulla
 * stringa ISO lo metterebbe **nel giorno sbagliato**. */
export function perGiornata(
  orari: readonly SlotPubblico[],
): { giorno: string; chiave: string; orari: SlotPubblico[] }[] {
  const chiaveDi = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Rome',
  })
  const gruppi = new Map<string, SlotPubblico[]>()
  for (const s of [...orari].sort((a, b) => a.inizio.localeCompare(b.inizio))) {
    const k = chiaveDi.format(new Date(s.inizio))
    const g = gruppi.get(k)
    if (g) g.push(s)
    else gruppi.set(k, [s])
  }
  return [...gruppi.entries()].map(([chiave, lista]) => ({
    chiave,
    giorno: giornoInItaliano(lista[0].inizio),
    orari: lista,
  }))
}

/** Il calendario: **N giornate consecutive da oggi**, ognuna con i suoi orari
 *  liberi — comprese quelle che non ne hanno.
 *
 * ⚖️ **Richiesta dell'utente (2026-08-13)**: *«voglio vedere il calendario
 * delle disponibilità e delle date e orari non disponibili»*. La differenza con
 * `perGiornata()` è tutta qui: quella mostra **solo i giorni che hanno slot**,
 * e un calendario che salta i giorni pieni ⛔ non è un calendario — è un elenco
 * che *sembra* dire «lunedì non riceve» mentre sta dicendo «di lunedì non so
 * niente».
 *
 * 🔑 **Le giornate vuote hanno un significato preciso e limitato**: *«da questa
 * pagina non risultano orari prenotabili»*. ⛔ **Non** «lo studio è chiuso» e
 * ⛔ **non** «il medico è occupato»: gli orari di apertura ⛔ non ce li ha
 * nessuno da questa parte (**TD-116**), e il sidecar restituisce **solo gli
 * Slot liberi** — di proposito, perché leggere gli `Appointment` da un canale
 * anonimo vorrebbe dire far scaricare a chiunque nomi e telefoni dei pazienti.
 * ⇒ chi rende questa struttura **deve** scrivere la distinzione in pagina.
 *
 * ⚠️ «Oggi» è **oggi a Roma**, e il primo giorno è quello: un calendario che
 * parte da domani nasconde gli orari di stasera. */
export function calendario(
  orari: readonly SlotPubblico[],
  giorni = 7,
): { chiave: string; etichetta: string; giornoSettimana: string; orari: SlotPubblico[] }[] {
  const perChiave = new Map(perGiornata(orari).map((g) => [g.chiave, g.orari]))
  const chiaveDi = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Rome',
  })
  const etichettaDi = new Intl.DateTimeFormat('it-IT', {
    day: 'numeric', month: 'short', timeZone: 'Europe/Rome',
  })
  const settimanaDi = new Intl.DateTimeFormat('it-IT', {
    weekday: 'short', timeZone: 'Europe/Rome',
  })

  /* ⚠️ Si avanza di **24 ore in millisecondi**, ⛔ non impostando il giorno del
     mese: attorno al cambio dell'ora legale una giornata dura 23 o 25 ore, e
     `setDate(+1)` sull'ora locale salta o ripete una data. Qui la chiave la
     calcola comunque `Intl` sul fuso di Roma, quindi il passo grezzo va bene e
     il raggruppamento resta corretto. */
  const oggi = new Date()
  return Array.from({ length: giorni }, (_, i) => {
    const d = new Date(oggi.getTime() + i * 86_400_000)
    const chiave = chiaveDi.format(d)
    return {
      chiave,
      etichetta: etichettaDi.format(d),
      giornoSettimana: settimanaDi.format(d).replace('.', ''),
      orari: perChiave.get(chiave) ?? [],
    }
  })
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
