import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { assetPath } from './asset-path'

export interface TutorialMeta {
  slug: string
  title: string
  description: string
  duration: string
  scenes: number
  hasVideo: boolean
  videoSrc?: string
  videoSrcWebm?: string
  posterSrc: string
}

export const TUTORIALS: TutorialMeta[] = [
  {
    slug: 'panoramica',
    title: 'Fibonacci in 90 secondi',
    description:
      'Tour live dell\'applicazione: pazienti, paziente dettaglio, consensi, agenda, audit log, impostazioni e catalogo farmaci AIFA. Registrato dal vivo sull\'app medicina estetica.',
    duration: '90 sec',
    scenes: 9,
    hasVideo: true,
    videoSrc: assetPath('/videos/panoramica-app.mp4'),
    videoSrcWebm: assetPath('/videos/panoramica-app.webm'),
    posterSrc: assetPath('/screenshots/estetica/01-pazienti-list.png'),
  },
  {
    slug: 'prima-visita',
    title: 'La prima visita su Fibonacci',
    description:
      'Walkthrough completo dalla creazione paziente al consenso firmato. Storyboard pronto per il doppiaggio italiano, video in arrivo.',
    duration: '3-4 min',
    scenes: 11,
    hasVideo: false,
    posterSrc: assetPath('/screenshots/estetica/02-paziente-detail.png'),
  },
  {
    slug: 'body-map-consenso',
    title: 'Body map e consenso informato',
    description:
      'Focus sulla feature distintiva per medicina estetica: body-map 2D con pallini numerati e generazione consenso informato pre-compilato.',
    duration: '2 min',
    scenes: 9,
    hasVideo: false,
    posterSrc: assetPath('/screenshots/estetica/05-consensi.png'),
  },
]

export function getTutorialMeta(slug: string): TutorialMeta | undefined {
  return TUTORIALS.find((t) => t.slug === slug)
}

export async function loadTutorialStoryboard(slug: string): Promise<string> {
  const filePath = join(process.cwd(), 'src', 'content', 'video-storyboard', `${slug}.md`)
  const raw = await readFile(filePath, 'utf-8')
  return raw
}
