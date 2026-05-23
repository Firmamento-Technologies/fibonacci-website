import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

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
    slug: 'consensi-sicpre',
    title: 'Consensi SICPRE',
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
  const raw = await readFile(filePath, 'utf-8')
  const today = new Date().toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return raw.replaceAll('{ULTIMA_REVISIONE}', today)
}
