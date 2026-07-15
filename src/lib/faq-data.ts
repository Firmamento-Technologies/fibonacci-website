export interface FaqItem {
  category: 'pricing' | 'gdpr' | 'tecnico' | 'utilizzo' | 'supporto'
  question: string
  answer: string
}

export const FAQ_CATEGORIES: Record<FaqItem['category'], string> = {
  pricing: 'Prezzi e abbonamento',
  gdpr: 'Privacy e compliance',
  tecnico: 'Aspetti tecnici',
  utilizzo: 'Utilizzo del software',
  supporto: 'Supporto e formazione',
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'pricing',
    question: 'Quanto costa Fibonacci?',
    answer:
      'Due piani: Solo a 99 euro al mese (un medico: cartella clinica, body map, consensi informati, firma elettronica del paziente, conservazione a norma) e Studio a 189 euro al mese (fino a 5 operatori: tutto di Solo più dettatura durante la visita, agenda condivisa, reminder appuntamenti e supporto chat). Tutti i prezzi sono IVA esclusa, fattura elettronica italiana inclusa. Il trial di 14 giorni è gratuito e non richiede carta di credito.',
  },
  {
    category: 'pricing',
    question: 'Posso disdire quando voglio?',
    answer:
      'Sì. La disdetta avviene direttamente dal pannello "Abbonamento" dell\'applicazione. Ha effetto al termine del mese in corso, senza penali. Su richiesta scritta entro 30 giorni dalla cessazione, riceverai un export completo dei tuoi dati in formato ZIP FHIR R4.',
  },
  {
    category: 'pricing',
    question: 'L\'abbonamento è deducibile fiscalmente?',
    answer:
      'Sì. Trattandosi di software professionale per l\'attività sanitaria, il canone è interamente deducibile come spesa di esercizio per il libero professionista o la struttura sanitaria. Riceverai fattura elettronica con P.IVA italiana via SDI ogni mese.',
  },
  {
    category: 'gdpr',
    question: 'Come gestite la conformità GDPR?',
    answer:
      'Fibonacci tratta i dati dei pazienti in qualità di Responsabile del trattamento ai sensi dell\'articolo 28 GDPR. Il medico è Titolare del trattamento. La sottoscrizione del DPA (pubblicato su /dpa/) è parte del contratto. Dati cifrati AES-256 a riposo, TLS 1.3 in transito, audit log immutabile FHIR, MFA TOTP, infrastruttura in Unione Europea.',
  },
  {
    category: 'gdpr',
    question: 'Fibonacci è un dispositivo medico ai sensi del MDR?',
    answer:
      'No. Fibonacci è uno strumento di supporto alla gestione clinica e alla documentazione, non un dispositivo medico ai sensi del Regolamento UE 2017/745 (MDR). Non esegue diagnosi né terapie automatizzate. Le funzioni di intelligenza artificiale (dettatura, estrazione strutturata) producono output che devono essere validati dal medico prima dell\'uso clinico. La responsabilità diagnostica resta sempre del professionista.',
  },
  {
    category: 'gdpr',
    question: 'I dati dei pazienti dove sono fisicamente memorizzati?',
    answer:
      'I dati sanitari sono memorizzati su server Hetzner in Germania (Unione Europea). Non effettuiamo trasferimenti di dati sanitari fuori UE/SEE. L\'unico servizio statunitense utilizzato è Cloudflare come DNS e CDN, sotto Standard Contractual Clauses 2021/914, e non riceve dati clinici in chiaro grazie alla cifratura TLS end-to-end al backend tedesco.',
  },
  {
    category: 'tecnico',
    question: 'Cosa significa "FHIR R4 nativo" e perché è importante?',
    answer:
      'FHIR R4 è lo standard internazionale HL7 per l\'interscambio di dati sanitari. Fibonacci memorizza i dati nativamente in questo formato. Significa interoperabilità reale con altri sistemi sanitari, con il Fascicolo Sanitario Elettronico 2.0 quando saranno definiti i tracciati, e portabilità garantita dei dati al di fuori della piattaforma in qualsiasi momento.',
  },
  {
    category: 'tecnico',
    question: 'Posso integrare Fibonacci con il mio strumento diagnostico o gestionale?',
    answer:
      'L\'export ZIP in formato FHIR R4 è sempre disponibile su tutti i piani, così i tuoi dati restano portabili. L\'accesso API REST FHIR documentato e le integrazioni native con i principali sistemi di refertazione e fatturazione elettronica sanitaria sono in fase di definizione. Se hai un\'esigenza specifica, scrivici a info@firmamentotechnologies.com.',
  },
  {
    category: 'utilizzo',
    question: 'Quanto è accurata la dettatura AI?',
    answer:
      'La trascrizione utilizza Voxtral di Mistral AI con accuratezza del 95-98% sull\'italiano medico clinico nelle nostre prove interne. L\'estrazione strutturata dei campi è accompagnata da un confidence score per ogni campo, e il medico può sempre validare o correggere prima di confermare. Non viene mai persistito alcun output AI sulla cartella senza approvazione esplicita del medico.',
  },
  {
    category: 'utilizzo',
    question: 'Posso usare Fibonacci se sono uno studio associato con più operatori?',
    answer:
      'Sì. Il piano Studio supporta fino a 5 operatori con agenda condivisa, ciascuno con proprie credenziali e MFA e con compartimentazione FHIR (un medico vede solo i pazienti del suo perimetro, definito da AccessPolicy). Ogni utente ha il proprio audit log e profilo di accesso. Per esigenze oltre i 5 operatori, contattaci.',
  },
  {
    category: 'supporto',
    question: 'C\'è formazione inclusa? Come funziona l\'onboarding?',
    answer:
      'Il piano Solo include onboarding via email con guide step-by-step. Il piano Studio include una sessione di onboarding guidato di un\'ora via videoconferenza. Per studi con esigenze di formazione più strutturate possiamo concordare un percorso dedicato: scrivici.',
  },
  {
    category: 'supporto',
    question: 'Come funziona il supporto tecnico?',
    answer:
      'Supporto via email a supporto@firmamentotechnologies.com con risposta entro 24 ore lavorative sul piano Solo ed entro 12 ore sul piano Studio (che include anche il supporto via chat). Lo SLA di uptime è 99.5% calcolato su base mensile.',
  },
]
