import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Clock, Film, ArrowRight, Info } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { TUTORIALS } from '@/lib/tutorial-data'

export const metadata: Metadata = {
  title: 'Video tutorial',
  description:
    'Tre video walkthrough di Fibonacci: panoramica in 90 secondi, prima visita completa, body-map e consenso SICPRE in azione.',
  alternates: { canonical: '/tutorial' },
}

export default function TutorialIndex() {
  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <section
          className="border-b"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
            <div
              className="flex items-center gap-2 text-xs font-medium mb-3"
              style={{ color: 'var(--muted)' }}
            >
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>Video tutorial</span>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-light)' }}
              >
                <Film className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h1
                  className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-3 leading-tight"
                  style={{ color: 'var(--fg)' }}
                >
                  Video tutorial
                </h1>
                <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
                  Tre walkthrough del software. Anteprima visuale del flusso reale,
                  senza voiceover. La versione doppiata in italiano è in produzione.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer banner */}
        <section className="py-4" style={{ background: 'var(--bg)' }}>
          <div
            className="max-w-5xl mx-auto px-6 py-3 rounded-xl flex items-start gap-3 text-sm leading-relaxed"
            style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
          >
            <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
            <span>
              I video doppiati in italiano sono in lavorazione: qui trovi gli storyboard
              completi con script voiceover, scene-by-scene. Per una demo live dell&apos;applicazione,{' '}
              <Link href="/#demo" className="font-semibold underline">richiedila gratuitamente</Link>.
            </span>
          </div>
        </section>

        {/* Tutorial list */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col gap-12">
            {TUTORIALS.map((tut, idx) => (
              <article
                key={tut.slug}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="grid md:grid-cols-[1.4fr_1fr] gap-0">
                  {/* Video player */}
                  <div className="relative bg-black aspect-video md:aspect-auto">
                    {/* Video doppiato italiano in lavorazione. Per ora poster + storyboard testuale. */}
                    <Image
                      src={tut.posterSrc}
                      alt={tut.title}
                      width={1440}
                      height={900}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                        Video doppiato italiano in arrivo
                      </div>
                    </div>
                  </div>

                  {/* Info side */}
                  <div className="p-6 lg:p-8 flex flex-col gap-4">
                    <div
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span>Tutorial {idx + 1} di {TUTORIALS.length}</span>
                    </div>
                    <h2
                      className="font-[var(--font-playfair)] text-2xl md:text-[1.7rem] font-bold leading-tight"
                      style={{ color: 'var(--fg)' }}
                    >
                      {tut.title}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {tut.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{tut.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5" />
                        <span>{tut.scenes} scene</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4">
                      <Link
                        href={`/tutorial/${tut.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: 'var(--fg)' }}
                      >
                        Vedi storyboard
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/#demo"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                        style={{ color: 'var(--fg)', border: '1px solid var(--border)' }}
                      >
                        Richiedi demo
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA finale */}
        <section className="py-20" style={{ background: 'var(--fg)' }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white mb-4">
              Vuoi una demo personale?
            </h2>
            <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Trenta minuti, con i tuoi workflow reali. Più concreto di qualunque video.
            </p>
            <Link
              href="/#demo"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Richiedi demo gratuita
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
