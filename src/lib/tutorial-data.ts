import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface TutorialMeta {
  slug: string
  title: string
  description: string
  duration: string
  scenes: number
  videoSrc: string
  posterSrc: string
}

export const TUTORIALS: TutorialMeta[] = [
  {
    slug: 'panoramica',
    title: 'Fibonacci in 90 secondi',
    description:
      'Una panoramica veloce del software. Per chi vuole capire in 90 secondi cosa fa Fibonacci e perché potrebbe servirgli.',
    duration: '90 sec',
    scenes: 9,
    videoSrc: '/videos/home-walkthrough.mp4',
    posterSrc: '/screenshots/home-hero.png',
  },
  {
    slug: 'prima-visita',
    title: 'La prima visita su Fibonacci',
    description:
      'Walkthrough completo: dalla creazione paziente al consenso firmato. Pensato per il primo onboarding pratico.',
    duration: '3-4 min',
    scenes: 11,
    videoSrc: '/videos/specialty-tour.mp4',
    posterSrc: '/screenshots/specialty-estetica-hero.png',
  },
  {
    slug: 'body-map-consenso',
    title: 'Body map e consenso SICPRE',
    description:
      'Focus sulla feature distintiva per medicina estetica: body-map 2D con pallini numerati e generazione consenso SICPRE pre-compilato.',
    duration: '2 min',
    scenes: 9,
    videoSrc: '/videos/specialty-tour-2.mp4',
    posterSrc: '/screenshots/mockup-estetica.png',
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
