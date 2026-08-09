import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { risolviSegnaposto } from './segnaposto'

export interface DocMeta {
  slug: string
  title: string
  description: string
  category: 'inizio' | 'utilizzo' | 'compliance'
  icon: string
}

export const DOCS: DocMeta[] = [
  {
    slug: 'installazione',
    title: 'Primo accesso e configurazione iniziale',
    description: 'Login, MFA, configurazione studio, inviti operatori.',
    category: 'inizio',
    icon: 'LogIn',
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
    title: 'Anamnesi con dettatura AI',
    description: 'Compilare l\'anamnesi durante la visita con Voxtral.',
    category: 'utilizzo',
    icon: 'Mic',
  },
  {
    slug: 'body-map',
    title: 'Body map 2D',
    description: 'Documentare aree trattate con pallini numerati.',
    category: 'utilizzo',
    icon: 'MapPin',
  },
  {
    slug: 'consensi-informati',
    title: 'Consensi informati',
    description: 'Generare e firmare consensi informati in PDF.',
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
    title: 'Audit log',
    description: 'Tracciabilità accessi, hash-chain, verifica integrità.',
    category: 'compliance',
    icon: 'Shield',
  },
]

export const DOC_CATEGORIES: Record<DocMeta['category'], string> = {
  inizio: 'Per iniziare',
  utilizzo: 'Utilizzo quotidiano',
  compliance: 'Compliance e sicurezza',
}

export function getDocMeta(slug: string): DocMeta | undefined {
  return DOCS.find((d) => d.slug === slug)
}

export async function loadDoc(slug: string): Promise<string> {
  const filePath = join(process.cwd(), 'src', 'content', 'docs', `${slug}.md`)
  // Stessa risoluzione dei legali: una copia parziale qui aveva gia' lasciato
  // un {URL_APP} non risolto in una guida (vedi segnaposto.ts).
  return risolviSegnaposto(await readFile(filePath, 'utf-8'), slug)
}
