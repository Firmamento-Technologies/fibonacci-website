/**
 * Le domande frequenti.
 *
 * Riscritte sulle obiezioni vere, non sulle domande comode. Due regole:
 *   1. nessuna risposta promette qualcosa che il prodotto non fa oggi;
 *   2. dove la risposta è «no» o «non ancora», la risposta comincia con no.
 *
 * Il vecchio elenco prometteva «conservazione a norma» dentro il piano Solo e
 * un «trial di 14 giorni gratuito»: nessuna delle due è vera, ed erano
 * esattamente le due righe che un cliente avrebbe citato dopo la firma.
 */

export interface Domanda {
  categoria: 'prezzi' | 'dati' | 'prodotto' | 'avvio' | 'limiti'
  d: string
  r: string
  /** Ancora per collegarci da altre pagine. */
  id?: string
}

export const CATEGORIE: Record<Domanda['categoria'], string> = {
  prodotto: 'Il prodotto',
  prezzi: 'Prezzi e contratto',
  dati: 'Dati dei pazienti',
  avvio: 'Partire',
  limiti: 'Quello che non fa',
}

export const DOMANDE: Domanda[] = [
  // ── Prodotto ─────────────────────────────────────────────────────────
  {
    categoria: 'prodotto',
    d: 'Per che tipo di studio è pensato?',
    r: 'Medicina estetica: un medico da solo o un’équipe fino a cinque operatori, con procedure iniettive, laser, peeling e biorivitalizzazione. Non serve altre specialità, e non fingiamo di farlo.',
  },
  {
    categoria: 'prodotto',
    d: 'La dettatura funziona davvero durante la visita?',
    r: 'Sì: detti mentre visiti e i campi dell’anamnesi si compilano. Quello che il sistema ha capito resta sempre modificabile, e niente viene salvato senza che tu lo confermi.',
  },
  {
    categoria: 'prodotto',
    d: 'Posso usare i miei moduli di consenso invece dei vostri?',
    r: 'Sì. I nostri modelli sono un punto di partenza per la struttura; il contenuto clinico è tuo e lo modifichi. Se hai già moduli rivisti dal tuo legale, li carichi e li usi.',
  },
  {
    categoria: 'prodotto',
    d: 'I vostri modelli di consenso sono validati da un legale?',
    r: 'No, e questo è importante. La struttura segue la L. 219/2017 e le indicazioni della giurisprudenza sul contenuto del consenso, ma il testo clinico va rivisto dal tuo specialista e dal tuo legale prima dell’uso con pazienti reali. Il software lo scrive anche dentro l’applicazione, non solo qui.',
  },
  {
    categoria: 'prodotto',
    d: 'Funziona su tablet?',
    r: 'Sì, ed è così che la paziente firma. Il resto del lavoro si fa meglio da un computer, perché una cartella clinica si compila con una tastiera.',
  },

  // ── Prezzi ───────────────────────────────────────────────────────────
  {
    categoria: 'prezzi',
    d: 'Quanto costa?',
    r: 'Solo 99 euro al mese per un medico; Studio 189 euro al mese fino a cinque operatori. Prezzi per studio, IVA esclusa. Migrazione dei dati e formazione iniziale sono comprese, non a preventivo.',
  },
  {
    categoria: 'prezzi',
    d: 'C’è una prova gratuita?',
    r: 'No, non nella forma «iscriviti e provalo trenta giorni»: quel percorso non esiste ancora. C’è una demo pubblica con dati finti, aperta e senza registrazione, e una demo guidata di mezz’ora con noi.',
  },
  {
    categoria: 'prezzi',
    d: 'Ci sono vincoli di durata o penali di uscita?',
    r: 'No. Si paga mensilmente e si disdice quando si vuole. Alla disdetta esporti i dati e il rapporto finisce.',
  },
  {
    categoria: 'prezzi',
    d: 'Il prezzo aumenta dopo il primo anno?',
    r: 'Non c’è nessun rincaro programmato. Se un giorno il listino cambierà, chi è già cliente lo saprà con preavviso e non si troverà l’aumento in fattura.',
  },

  // ── Dati ─────────────────────────────────────────────────────────────
  {
    categoria: 'dati',
    d: 'Dove stanno i dati dei miei pazienti?',
    r: 'Su server in Germania, dentro lo Spazio economico europeo. Non su cloud statunitensi. La pagina «Sicurezza e dati» lo spiega per esteso, insieme a chi altro tocca i dati.',
  },
  {
    categoria: 'dati',
    d: 'Chi è il titolare del trattamento?',
    r: 'Tu. Noi siamo responsabili e agiamo su tua istruzione, con l’accordo ex art. 28 GDPR che firmi prima di iniziare e che puoi leggere adesso, senza compilare moduli.',
  },
  {
    categoria: 'dati',
    d: 'Posso portare via tutto se cambio idea?',
    r: 'Sì, quando vuoi e senza chiedercelo. L’esportazione usa FHIR, uno standard sanitario internazionale: un altro fornitore lo legge senza dover reinventare il formato.',
  },
  {
    categoria: 'dati',
    d: 'I dati dei pazienti servono ad addestrare modelli di IA?',
    r: 'No. I fornitori dei modelli si sono impegnati per contratto a non addestrare sui dati che passano dalle nostre chiamate. I contratti sono elencati nella pagina dei sub-responsabili.',
  },

  // ── Avvio ────────────────────────────────────────────────────────────
  {
    categoria: 'avvio',
    d: 'Quanto ci metto a partire?',
    r: 'La configurazione dello studio la facciamo noi. Una prima visita completa la fai il primo giorno; per usare tutto con scioltezza serve una settimana di pratica.',
  },
  {
    categoria: 'avvio',
    d: 'Migrate voi i dati dal gestionale che uso adesso?',
    r: 'Sì, partendo da un file esportato dal tuo fornitore attuale. Se il tuo fornitore non esporta niente di utilizzabile, te lo diciamo prima di firmare: è un problema che va conosciuto prima, non scoperto dopo.',
  },
  {
    categoria: 'avvio',
    d: 'Serve internet?',
    r: 'Sì. Se la linea cade non apri una cartella nuova. È il limite di un servizio che tiene i dati su server nostri; in cambio hai backup, cifratura, e il fatto che un computer rotto in studio non ti costa nulla.',
  },

  // ── Limiti ───────────────────────────────────────────────────────────
  {
    categoria: 'limiti',
    id: 'cosa-manca',
    d: 'Che cosa Fibonacci non fa, oggi?',
    r: 'Non c’è la firma elettronica qualificata: quella della paziente è una firma elettronica avanzata. Non c’è la conservazione a norma, perché non abbiamo ancora contrattualizzato un conservatore accreditato. Non c’è l’invio al Sistema Tessera Sanitaria né la fatturazione. E non c’è un percorso di iscrizione self-service: si parte parlando con noi.',
  },
  {
    categoria: 'limiti',
    d: 'Il software mi dice cosa prescrivere o come trattare?',
    r: 'No, e non è una limitazione tecnica: è una scelta. Il software organizza informazioni e segnala incongruenze, ad esempio un’allergia registrata. La decisione clinica resta interamente tua, e nessuna schermata suggerisce diagnosi o terapie.',
  },
  {
    categoria: 'limiti',
    d: 'Avete clienti che possono darmi un parere?',
    r: 'Non ancora: siamo in pilota presso uno studio e le prime attivazioni sono del 2026. Preferiamo dirlo piuttosto che riempire il sito di testimonianze, che fra l’altro nella pubblicità sanitaria italiana non si possono usare.',
  },
]
