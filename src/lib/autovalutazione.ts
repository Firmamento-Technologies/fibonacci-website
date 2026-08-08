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
    domanda: 'Il modulo di consenso che fai firmare è lo stesso per trattamenti diversi?',
    aiuto: 'Per esempio: lo stesso foglio per un filler, una tossina e un laser.',
    opzioni: [
      { etichetta: 'Sì, uno solo per tutto', scoperto: true },
      { etichetta: 'No, uno per procedura', scoperto: false },
      { etichetta: 'Dipende, alcuni sì', scoperto: true },
    ],
    punto: 'Un modulo unico per procedure diverse',
    perche:
      'Il consenso deve descrivere quella procedura e i suoi rischi. Un foglio che vale per tutto non dimostra che quella paziente sia stata informata di quel rischio, e in medicina estetica l’obbligo informativo è più severo che altrove perché la procedura è elettiva su una persona sana.',
    fonte: 'L. 219/2017 art. 1 · Cass. civ. 29827/2019',
    noi: 'Un catalogo di moduli per procedura, e il modulo si sceglie dal trattamento.',
  },
  {
    id: 'rischi-specifici',
    domanda: 'Il consenso nomina il prodotto usato e i rischi specifici di quella procedura?',
    aiuto: 'Oppure si ferma a formule generiche come «possibili effetti indesiderati».',
    opzioni: [
      { etichetta: 'Sì, prodotto e rischi specifici', scoperto: false },
      { etichetta: 'Solo formule generiche', scoperto: true },
      { etichetta: 'Non lo so', scoperto: true },
    ],
    punto: 'Rischi descritti in modo generico',
    perche:
      '«Possibili effetti indesiderati» non è un rischio: è una formula. Il contenuto informativo si misura su quello che la paziente poteva capire di quella procedura, non sulla presenza di una firma in fondo al foglio.',
    fonte: 'L. 219/2017 art. 1 c. 3 · Codice di deontologia medica art. 33',
    noi: 'I modelli sono scritti per procedura, con i rischi di quella procedura.',
  },
  {
    id: 'firma-prima',
    domanda: 'La firma della paziente resta legata al testo che ha letto?',
    aiuto:
      'Cioè: se domani il modulo cambia, si riesce ancora a dimostrare quale versione aveva firmato lei.',
    opzioni: [
      { etichetta: 'Sì, la versione firmata è conservata', scoperto: false },
      { etichetta: 'Firma su carta, e il modulo lo aggiorno quando serve', scoperto: true },
      { etichetta: 'Non saprei dimostrarlo', scoperto: true },
    ],
    punto: 'La firma non è legata a una versione del testo',
    perche:
      'Un consenso vale per quello che diceva quel giorno. Se il modulo è un file che si aggiorna e la firma sta su un foglio a parte, non c’è modo di dimostrare quale testo la paziente avesse davanti.',
    fonte: 'L. 219/2017 art. 1 c. 4 (documentazione e conservazione in cartella)',
    noi: 'Il documento firmato è sigillato con un’impronta digitale che ne dimostra la non alterazione.',
  },
  {
    id: 'foto',
    domanda: 'Le fotografie pre e post trattamento dove stanno?',
    opzioni: [
      { etichetta: 'Dentro la cartella clinica, cifrate', scoperto: false },
      { etichetta: 'Nel rullino del telefono', scoperto: true },
      { etichetta: 'In una cartella condivisa o in chat', scoperto: true },
    ],
    punto: 'Le foto cliniche stanno fuori dalla cartella',
    perche:
      'Sono dati sulla salute: chiedono misure adeguate al rischio, e un rullino sincronizzato con un cloud personale non è una misura. Sono anche la prova più forte che hai sul risultato: fuori dalla cartella valgono meno di quello che potrebbero valere.',
    fonte: 'GDPR art. 9 e art. 32',
    noi: 'Le foto entrano cifrate nella scheda della seduta, separate dalla galleria del telefono.',
  },
  {
    id: 'lotto',
    domanda: 'Per una seduta di sei mesi fa, sapresti dire prodotto, lotto e quantità?',
    aiuto: 'Senza cercare in un quaderno o nella scatola in frigo.',
    opzioni: [
      { etichetta: 'Sì, sta in cartella', scoperto: false },
      { etichetta: 'È scritto da qualche parte, ma dovrei cercarlo', scoperto: true },
      { etichetta: 'No', scoperto: true },
    ],
    punto: 'Prodotto e lotto non sono nella cartella',
    perche:
      'È l’informazione che serve quando qualcosa va storto: una reazione, un richiamo del produttore, una contestazione. Se sta su un quaderno, esiste finché esiste il quaderno.',
    fonte: 'Obbligo di tenuta della documentazione sanitaria · D.Lgs. 46/1997 sulla vigilanza dei dispositivi',
    noi: 'Prodotto, lotto, unità e area restano legati alla seduta, insieme ai punti segnati sulla mappa.',
  },
  {
    id: 'accessi',
    domanda: 'Sapresti dimostrare chi ha aperto una certa cartella, e quando?',
    aiuto: 'Vale anche per la segretaria e per i collaboratori.',
    opzioni: [
      { etichetta: 'Sì, c’è un registro consultabile', scoperto: false },
      { etichetta: 'No', scoperto: true },
      { etichetta: 'Solo chiedendolo al fornitore', scoperto: true },
    ],
    punto: 'Nessun registro degli accessi consultabile',
    perche:
      'Il titolare del trattamento deve poter dimostrare chi ha avuto accesso ai dati sanitari. Se la risposta richiede di aprire un ticket al fornitore, la dimostrazione non è nelle tue mani.',
    fonte: 'GDPR art. 5 c. 2 (responsabilizzazione) e art. 32',
    noi: 'Il registro accessi è una pagina dell’applicazione, e le voci sono concatenate da impronte che rendono evidente una manomissione.',
  },
  {
    id: 'richiesta-paziente',
    domanda: 'Se una paziente ti chiedesse oggi tutta la sua documentazione, in quanto gliela daresti?',
    opzioni: [
      { etichetta: 'Subito, si esporta', scoperto: false },
      { etichetta: 'In qualche giorno, mettendo insieme i pezzi', scoperto: true },
      { etichetta: 'Non saprei da dove cominciare', scoperto: true },
    ],
    punto: 'La documentazione non è consegnabile in un pezzo solo',
    perche:
      'La richiesta di accesso va evasa senza ingiustificato ritardo e comunque entro un mese. Se cartella, consensi e foto stanno in tre posti diversi, il termine si consuma nel raccoglierli.',
    fonte: 'GDPR art. 15 e art. 12 c. 3',
    noi: 'L’esportazione della cartella completa è una funzione dell’applicazione, non una richiesta all’assistenza.',
  },
  {
    id: 'uscita',
    domanda: 'Se il software che usi chiudesse domani, in che formato ti porteresti via i dati?',
    opzioni: [
      { etichetta: 'In uno standard leggibile da altri', scoperto: false },
      { etichetta: 'In un formato del fornitore', scoperto: true },
      { etichetta: 'Non l’ho mai verificato', scoperto: true },
    ],
    punto: 'L’uscita dai dati non è verificata',
    perche:
      'La portabilità è un diritto, ma diventa reale solo se il formato è leggibile da qualcun altro. Un archivio proprietario che nessun altro importa è, in pratica, un archivio che non puoi spostare.',
    fonte: 'GDPR art. 20',
    noi: 'L’esportazione usa FHIR R4, lo standard sanitario internazionale.',
  },
] as const
