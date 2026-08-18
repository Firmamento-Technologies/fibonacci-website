/* L'ANAGRAFE delle guide: solo dati, nessuna lettura da disco.
 *
 * ⚠️ `loadDoc()` stava qui e ha smesso di poterci stare il 2026-08-12, quando
 * l'indice del manuale è diventato un componente client: importare `DOCS` da
 * lì tirava dentro `node:fs/promises` e la build si fermava
 * («the chunking context does not support external modules»). Il lettore dei
 * file sta ora in `docs-file.ts`, che è di solo server.
 * ⛔ Non rimettere qui un `import` da `node:*`: romperebbe di nuovo l'indice,
 * e l'errore arriva in fase di build, lontano dal file che l'ha causato. */

export interface DocMeta {
  slug: string
  title: string
  description: string
  category: 'inizio' | 'utilizzo' | 'compliance'
  icon: string
}

/* ⚠️ L'ORDINE DI QUESTO ARRAY È L'ORDINE DI LETTURA DEL MANUALE, e da qui
 * escono tre cose insieme: l'indice a sinistra, la numerazione dei capitoli e
 * il «precedente/successiva» in fondo a ogni guida. Prima ne usciva solo
 * l'ultimo, e infatti «Primo accesso e configurazione iniziale» era il sesto
 * elemento: chi apriva il manuale dall'inizio arrivava alla configurazione
 * dello studio dopo aver letto la dashboard, l'atlante e la ricerca in
 * letteratura. Dentro ogni categoria l'ordine è quello in cui le cose si
 * fanno; le categorie si susseguono come in `CAPITOLI`. */
export const DOCS: DocMeta[] = [
  {
    slug: 'installazione',
    title: 'Primo accesso e configurazione iniziale',
    description: 'Login, MFA, configurazione studio, inviti operatori.',
    category: 'inizio',
    icon: 'LogIn',
  },
  {
    slug: 'dashboard',
    title: 'La dashboard: cosa guardare la mattina',
    description: 'Indicatori, la giornata, i richiami aperti, e cosa governa il selettore di periodo.',
    category: 'inizio',
    icon: 'LayoutDashboard',
  },
  {
    slug: 'aiuto-e-assistenza',
    title: 'Dove chiedere aiuto',
    description:
      'Tour guidato, manuale, assistente in-app, «Chiedi assistenza» e installazione su tablet: quale serve quando.',
    category: 'inizio',
    icon: 'LifeBuoy',
  },
  {
    slug: 'anatomia',
    title: 'Atlante anatomico 3D',
    // ⚠️ «nove sistemi» e non «sistemi multipli»: il numero è la cosa che chi
    // scorre l'indice usa per capire se la pagina risponde alla sua domanda.
    description:
      'Mostrare al paziente dove si interviene: nove sistemi anatomici, drill-down, limiti dichiarati.',
    category: 'utilizzo',
    icon: 'Bone',
  },
  {
    slug: 'letteratura',
    title: 'Ricerca in letteratura',
    description: 'PubMed dentro la cartella: filtri per tipo di studio, abstract, full-text quando esiste.',
    category: 'utilizzo',
    icon: 'BookOpen',
  },
  {
    slug: 'questionari-prom',
    title: 'Questionari al paziente (PROM)',
    description: 'L\'esito raccontato dal paziente, e perché il tablet non va lasciato incustodito.',
    category: 'utilizzo',
    icon: 'ClipboardList',
  },
  {
    slug: 'catalogo-farmaci-aifa',
    title: 'Catalogo farmaci: com\'è aggiornato',
    description: 'Stato dell\'importazione AIFA, perché «forza sync» è disabilitato, cosa fare se fallisce.',
    category: 'compliance',
    icon: 'Database',
  },
  {
    slug: 'anagrafica-paziente',
    title: 'Anagrafica paziente',
    description: 'Creazione, ricerca, archiviazione, export GDPR.',
    category: 'utilizzo',
    icon: 'UserPlus',
  },
  {
    slug: 'anamnesi-dettatura',
    title: 'Compilare a voce: la dettatura',
    // ⚠️ Il titolo diceva «Anamnesi con dettatura AI», ma la dettatura sta in
    // tre punti (anamnesi, seduta, valutazione) e chi cercava «dettare la
    // seduta» non aveva modo di sapere che stava qui. La descrizione dichiara
    // anche il limite, perché è la domanda che arriva davvero.
    description:
      'Dettare in anamnesi, in seduta e in valutazione: che cosa la voce compila e che cosa no.',
    category: 'utilizzo',
    icon: 'Mic',
  },
  {
    slug: 'body-map',
    // ⚠️ Si chiamava «Body map 2D» quando il 2D era tutto quello che c'era. Dal
    // 16 agosto 2026 le aree si segnano anche sul modello tridimensionale, e un
    // titolo che dice «2D» manda a cercare altrove chi ha in mente il 3D.
    title: 'Le aree trattate: foto e modello 3D',
    // ⚠️ La descrizione precedente prometteva di spiegare come «importarle
    // dalla visita precedente»: quel pulsante **non esiste**, e la guida lo
    // descriveva lo stesso (corretto il 2026-08-17, riscrivendo la pagina
    // contro la schermata). Qui restano solo cose che a video ci sono.
    description:
      'Segnare le aree con pallini numerati sul ritratto o sul modello 3D, con strumento, piano e tecnica di ogni punto.',
    category: 'utilizzo',
    icon: 'MapPin',
  },
  {
    slug: 'consensi-informati',
    title: 'Consensi informati',
    // ⚠️ «revocare» non è aggiunto per compiacere un modello: la guida ha un
    // «Passo 6, revoca, modifica, ristampa» e la descrizione non lo diceva —
    // era **incompleta rispetto alla propria pagina**, e un medico che scorre
    // l'indice della documentazione cercando «revoca» non la trovava.
    description: 'Generare, firmare e revocare i consensi informati in PDF.',
    category: 'utilizzo',
    icon: 'FileSignature',
  },
  {
    slug: 'agenda-appuntamenti',
    title: 'Agenda appuntamenti',
    description: 'Pianificare visite, calendario condiviso, SMS reminder.',
    category: 'utilizzo',
    icon: 'Calendar',
  },
  {
    slug: 'foto-confronto',
    title: 'Foto cliniche e confronto prima/dopo',
    description: 'Acquisire, cifrare, confrontare e consegnare le fotografie.',
    category: 'utilizzo',
    icon: 'Camera',
  },
  {
    slug: 'analisi-del-volto',
    title: 'Analisi del volto',
    description:
      'Confronto diretto fra prima e dopo, vista 3D del volto, specchio dal vivo e giudizio PGAIS.',
    category: 'utilizzo',
    icon: 'ScanFace',
  },
  {
    slug: 'tracciabilita-lotto',
    title: 'Tracciabilità del lotto',
    description: 'Registrare il lotto e rispondere a un richiamo del produttore.',
    category: 'utilizzo',
    icon: 'PackageSearch',
  },
  {
    slug: 'utenti-e-accessi',
    title: 'Utenti dello studio e revoca degli accessi',
    description: 'Invitare un collaboratore, e togliergli l\'accesso quando se ne va.',
    category: 'compliance',
    icon: 'UserMinus',
  },
  {
    slug: 'trattamenti',
    title: 'Registrare un trattamento',
    description: 'Prodotto, lotto, aree, off-label, e il richiamo che ne deriva.',
    category: 'utilizzo',
    icon: 'Syringe',
  },
  {
    slug: 'esiti-e-complicanze',
    title: 'Esiti, complicanze ed emergenze',
    description:
      'La modalità Emergenza, registrare una complicanza sulla seduta, e la scheda di segnalazione al Ministero.',
    category: 'utilizzo',
    icon: 'HeartPulse',
  },
  {
    slug: 'prescrizioni',
    title: 'Prescrizioni e terapie',
    description: 'Catalogo AIFA, controllo allergie, stampa della ricetta.',
    category: 'utilizzo',
    icon: 'Pill',
  },
  {
    slug: 'promemoria-e-richiami',
    title: 'Promemoria e richiami',
    description: 'I tre tipi di promemoria, e perché nessuno parte da solo.',
    category: 'utilizzo',
    icon: 'BellRing',
  },
  {
    slug: 'esportazioni-e-diritti',
    title: 'Esportazioni e diritti del paziente',
    description: 'Accesso, portabilità, cancellazione: che cosa si fa e che cosa no.',
    category: 'compliance',
    icon: 'Download',
  },
  {
    slug: 'audit-log',
    title: 'Registro accessi: chi ha fatto cosa',
    description: 'Rispondere a chi chiede chi ha visto la sua cartella, e perché il registro non si corregge.',
    category: 'compliance',
    icon: 'Shield',
  },
]

/* I nomi delle tre parti del manuale.
 *
 * ⚠️ Erano DUE elenchi e dicevano cose diverse: questo (`Per iniziare` ·
 * `Utilizzo quotidiano` · `Compliance e sicurezza`) non era importato da
 * nessuno, mentre la pagina indice ne teneva una copia propria con le parole
 * che si vedevano davvero. Chi cambiava questo file non cambiava il sito, e
 * viceversa — la solita seconda copia destinata a divergere, già divergente.
 * Restano le parole che erano a video; l'elenco morto è stato tolto. */
export const DOC_CATEGORIES: Record<DocMeta['category'], string> = {
  inizio: 'Per cominciare',
  utilizzo: 'Nel lavoro di tutti i giorni',
  compliance: 'Adempimenti',
}

export interface Capitolo {
  chiave: DocMeta['category']
  titolo: string
  guide: DocMeta[]
}

/** Le tre parti, nell'ordine in cui si leggono. */
export const CAPITOLI: Capitolo[] = (
  Object.keys(DOC_CATEGORIES) as DocMeta['category'][]
).map((chiave) => ({
  chiave,
  titolo: DOC_CATEGORIES[chiave],
  guide: DOCS.filter((d) => d.category === chiave),
}))

/**
 * Le guide nell'ordine dell'indice: prima le tre parti, dentro ognuna
 * l'ordine di `DOCS`.
 *
 * ⚠️ È QUESTO l'ordine di «precedente/successiva», non quello grezzo di
 * `DOCS`. Prima erano la stessa cosa, e la coda di ogni guida proponeva un
 * salto che l'indice non mostrava: da «Questionari al paziente» si andava a
 * «Catalogo farmaci», cioè da una guida d'uso quotidiano a un adempimento,
 * scavalcando metà della propria sezione.
 */
export const DOCS_IN_ORDINE: DocMeta[] = CAPITOLI.flatMap((c) => c.guide)

/** Il numero di capitolo (1-based) come compare nell'indice. */
export function numeroCapitolo(slug: string): number {
  return DOCS_IN_ORDINE.findIndex((d) => d.slug === slug) + 1
}

/** La guida prima e quella dopo, nell'ordine dell'indice. */
export function guideVicine(slug: string): { precedente: DocMeta | null; successiva: DocMeta | null } {
  const i = DOCS_IN_ORDINE.findIndex((d) => d.slug === slug)
  return {
    precedente: i > 0 ? DOCS_IN_ORDINE[i - 1] : null,
    successiva: i >= 0 && i < DOCS_IN_ORDINE.length - 1 ? DOCS_IN_ORDINE[i + 1] : null,
  }
}

export function getDocMeta(slug: string): DocMeta | undefined {
  return DOCS.find((d) => d.slug === slug)
}

