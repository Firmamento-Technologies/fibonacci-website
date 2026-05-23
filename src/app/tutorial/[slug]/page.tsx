import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Film } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { TUTORIALS, getTutorialMeta, loadTutorialStoryboard } from '@/lib/tutorial-data'

export async function generateStaticParams() {
  return TUTORIALS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tut = getTutorialMeta(slug)
  if (!tut) return {}
  return {
    title: tut.title,
    description: tut.description,
    alternates: { canonical: `/tutorial/${tut.slug}` },
  }
}

export default async function TutorialDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tut = getTutorialMeta(slug)
  if (!tut) notFound()

  const storyboard = await loadTutorialStoryboard(slug)

  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <section
          className="border-b"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex items-center gap-2 text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/tutorial" className="hover:underline">Tutorial</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>{tut.title}</span>
            </div>
            <Link
              href="/tutorial"
              className="inline-flex items-center gap-2 text-sm font-medium mb-4 transition-opacity hover:opacity-75"
              style={{ color: 'var(--accent)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Tutti i tutorial
            </Link>
            <h1
              className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{ color: 'var(--fg)' }}
            >
              {tut.title}
            </h1>
            <p className="text-base leading-relaxed max-w-2xl mb-4" style={{ color: 'var(--muted)' }}>
              {tut.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{tut.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                <span>{tut.scenes} scene</span>
              </div>
            </div>
          </div>
        </section>

        {/* Video player */}
        <section className="py-10" style={{ background: 'var(--bg)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
              <video
                className="w-full h-full object-contain"
                controls
                preload="metadata"
                poster={tut.posterSrc}
                muted
                playsInline
              >
                <source src={tut.videoSrc} type="video/mp4" />
                Il tuo browser non supporta la riproduzione di video HTML5.
              </video>
            </div>
          </div>
        </section>

        {/* Storyboard */}
        <section className="py-16" style={{ background: 'var(--card)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--accent)' }}
            >
              Storyboard e script voiceover
            </p>
            <h2
              className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-6 leading-tight"
              style={{ color: 'var(--fg)' }}
            >
              Cosa vedi e cosa sentirai
            </h2>
            <MarkdownRenderer content={storyboard} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
