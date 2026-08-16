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
    titolo: 'Dati in Italia',
    corpo:
      'La cartella, le fotografie e i backup stanno su infrastruttura italiana, dentro l’Unione europea. Non su cloud statunitensi, e senza repliche fuori dall’Unione.',
    prova:
      'Interroga tu il registro: «whois» sull’indirizzo del sito dà ARUBA-NET, Aruba S.p.A., paese IT. La filiera per esteso è nell’elenco dei sub-responsabili.',
    stato: 'fatto',
    href: '/sub-responsabili',
  },
  {
    id: 'nessun-intermediario',
    titolo: 'Nessun intermediario',
    corpo:
      'Fra il tuo browser e il nostro server non c’è nessuno: né rete di distribuzione, né proxy di terzi, né firewall applicativo gestito da altri. Nessun soggetto extra-europeo sul percorso del dato.',
    prova:
      'Il dominio risolve direttamente sull’indirizzo dell’infrastruttura: lo dice una interrogazione DNS, che chiunque può fare anche contro di noi.',
    stato: 'fatto',
    href: '/sicurezza',
  },
  {
    id: 'titolare-sei-tu',
    titolo: 'Il titolare sei tu',
    corpo:
      'I pazienti sono i tuoi, la cartella è la tua, le decisioni sul trattamento le prendi tu. Noi siamo responsabili e agiamo su tua istruzione scritta.',
    prova:
      'Accordo ex art. 28 GDPR, pubblicato per intero e senza modulo da compilare. Lo firmi prima di cominciare, e lo può leggere il tuo consulente adesso.',
    stato: 'fatto',
    href: '/dpa',
  },
  {
    id: 'codice-di-condotta',
    titolo: 'Codice di condotta europeo',
    corpo:
      'Il fornitore che ospita i dati aderisce al codice di condotta CISPE per i servizi cloud, approvato dalla CNIL nel 2021 ai sensi dell’art. 40 del GDPR.',
    prova:
      'L’iscrizione sta nel registro pubblico CISPE, che non è gestito da noi né dal fornitore.',
    stato: 'fatto',
    href: 'https://cispe.cloud/publicregister/',
    esterno: true,
  },
  {
    id: 'registro-accessi',
    titolo: 'Ogni accesso è scritto',
    corpo:
      'Chi apre una cartella lascia una riga: chi, quando, quale risorsa, con che esito. Le righe sono legate da una catena di impronte, quindi non si possono riscrivere a posteriori senza che si veda.',
    prova:
      'Il registro lo consulti tu, non solo noi, ed è la misura che l’art. 32 GDPR chiama per nome. La catena la verifica una pagina pubblica, senza registrazione.',
    stato: 'fatto',
    href: '/verifica',
  },
  {
    id: 'uscita-garantita',
    titolo: 'Uscire è una funzione',
    corpo:
      'Esporti tutto in FHIR R4, uno standard sanitario internazionale, in qualsiasi momento e senza chiederci il permesso. Se cambi fornitore, i dati partono con te.',
    prova:
      'Art. 20 GDPR sulla portabilità, prescrizione 2.6 dell’Allegato II del regolamento EHDS, e gli indirizzi applicativi dell’art. 78 del codice di deontologia medica, che chiedono al medico di privilegiare i servizi con un formato indipendente dalla piattaforma.',
    stato: 'fatto',
    href: '/conformita-europea',
  },
  {
    id: 'niente-addestramento',
    titolo: 'Nessun addestramento sui tuoi dati',
    corpo:
      'I fornitori dei modelli che usiamo sono esclusi per contratto dall’addestrare sui dati che passano dalle nostre chiamate. La dettatura è trascritta da un fornitore europeo, e l’audio non viene conservato.',
    prova:
      'Ogni fornitore è nominato nell’elenco dei sub-responsabili, con sede, servizio, categoria di dati e base giuridica.',
    stato: 'fatto',
    href: '/sub-responsabili',
  },
  {
    id: 'iso-27001',
    titolo: 'ISO 27001: il data center sì, noi no',
    corpo:
      'La certificazione appartiene a chi ospita l’infrastruttura e riguarda la sala macchine. Non dice niente sul nostro codice, sul controllo degli accessi o sulla gestione delle chiavi, e noi non la esibiamo come se lo dicesse.',
    prova:
      'Adottiamo i controlli dell’Annex A come riferimento, senza certificazione di terza parte. Sta scritto al paragrafo 12 della scheda delle misure di sicurezza.',
    stato: 'assente',
    href: '/sicurezza',
  },
  {
    id: 'marcatura-ce',
    titolo: 'Marcatura CE: dal 2029, e non l’ha nessuno',
    corpo:
      'Il regolamento sullo spazio europeo dei dati sanitari renderà obbligatoria la marcatura CE per le cartelle cliniche elettroniche. Oggi non è apponibile: mancano gli atti di esecuzione della Commissione.',
    prova:
      'Reg. (UE) 2025/327, artt. 39 e 41, applicabile dal 26 marzo 2027 e dal 26 marzo 2029 per le categorie prioritarie. Diffida di chi la dichiara già oggi.',
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
    sigla: 'Art. 28 GDPR',
    nota: 'Il titolare sei tu. Accordo di trattamento pubblico, senza modulo da compilare.',
    stato: 'fatto',
    href: '/dpa',
  },
  {
    /* ⛔ Senza spazi: il sigillo va a capo sugli spazi, e «IT · UE» usciva su
       TRE righe dentro un cerchio da 58px. */
    marchio: 'IT/UE',
    sigla: 'Dati in Italia',
    nota: 'Infrastruttura italiana, nessun intermediario, nessun trasferimento fuori dall’Unione.',
    stato: 'fatto',
    href: '/conformita-europea',
  },
  {
    marchio: 'ART. 32',
    sigla: 'Misure di sicurezza',
    nota: 'Scheda tecnica pubblicata per intero, limiti dichiarati compresi.',
    stato: 'fatto',
    href: '/sicurezza',
  },
  {
    /* ⚠️ Applicabile **da oggi**: il regolamento si applica dal 2 agosto 2026
       (art. 113), quindi qui ⛔ non si può scrivere «ci prepareremo». */
    marchio: 'AI ACT',
    sigla: 'Art. 50 · trasparenza',
    nota: 'Diciamo quando stai parlando con un’IA. La marcatura leggibile a macchina non c’è ancora.',
    stato: 'previsto',
    href: '/intelligenza-artificiale',
  },
  {
    marchio: 'EHDS',
    sigla: 'Marcatura CE dal 2029',
    nota: 'Oggi non è apponibile da nessuno. Tre requisiti su quattro li rispettiamo già.',
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
