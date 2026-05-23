'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Users, FileSignature, Calendar, Shield, Pill } from 'lucide-react'
import { assetPath, PHOTOS } from '@/lib/asset-path'

interface Screen {
  src: string
  title: string
  body: string
  icon: typeof Users
}

const SCREENS: Screen[] = [
  {
    src: assetPath('/screenshots/estetica/01-pazienti-list.png'),
    title: 'Lista pazienti',
    body: 'Ricerca per cognome, nome o codice fiscale. Export bulk CSV in un click, conforme GDPR.',
    icon: Users,
  },
  {
    src: assetPath('/screenshots/estetica/02-paziente-detail.png'),
    title: 'Cartella paziente',
    body: 'Anagrafica, anamnesi, foto cliniche cifrate, trattamenti, consensi. Tutto FHIR R4 nativo.',
    icon: Users,
  },
  {
    src: assetPath('/screenshots/estetica/05-consensi.png'),
    title: 'Consensi informati',
    body: 'Modelli di consenso generati in PDF, firma grafometrica, invio automatico al paziente.',
    icon: FileSignature,
  },
  {
    src: assetPath('/screenshots/estetica/06-agenda.png'),
    title: 'Agenda condivisa',
    body: 'Vista settimanale, multi-operatore, reminder SMS automatici 24h prima della visita.',
    icon: Calendar,
  },
  {
    src: assetPath('/screenshots/estetica/07-audit-log.png'),
    title: 'Audit log immutabile',
    body: 'Ogni accesso e modifica tracciata in hash-chain FHIR. Esportabile per richieste Garante.',
    icon: Shield,
  },
  {
    src: assetPath('/screenshots/estetica/09-farmaci-aifa.png'),
    title: 'Catalogo AIFA',
    body: 'Tutti i farmaci AIFA aggiornati mensilmente. Off-label tracking automatico per estetica.',
    icon: Pill,
  },
]

export function AppPreview() {
  const [active, setActive] = useState(0)
  const screen = SCREENS[active]

  return (
    <section className="py-24" style={{ background: 'var(--bg)' }} id="app-in-azione">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_280px] gap-8 items-end mb-12">
          <div className="text-center md:text-left">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--accent)' }}
            >
              L&apos;app in 3 minuti
            </p>
            <h2
              className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4 break-words"
              style={{ color: 'var(--fg)' }}
            >
              Schermate vere dall&apos;applicazione live
            </h2>
            <p className="text-base max-w-2xl" style={{ color: 'var(--muted)' }}>
              Non sono mockup: queste sono le interfacce reali del modulo medicina estetica
              attualmente in uso. Le altre specialità arrivano nei prossimi mesi.
            </p>
          </div>

          {/* Foto inline desktop - rinforza identità "medico digitale" */}
          <div
            className="hidden md:block relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
            style={{ border: '1px solid var(--border)' }}
          >
            <Image
              src={PHOTOS.doctorTablet}
              alt="Mani che usano un tablet con stetoscopio - documentazione clinica digitale"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>

        {/* Video MP4 autoplay loop (panoramica registrata sull'app live) */}
        <div className="relative mb-10 rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ border: '1px solid var(--border)' }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={assetPath('/screenshots/estetica/10-dashboard.png')}
            className="w-full h-auto block"
          >
            <source src={assetPath('/videos/panoramica-app.mp4')} type="video/mp4" />
            <source src={assetPath('/videos/panoramica-app.webm')} type="video/webm" />
          </video>
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold">LIVE</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6 lg:gap-10 items-start">
          {/* Screenshot principale */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid var(--border)' }}
              >
                <Image
                  src={screen.src}
                  alt={`Schermata Fibonacci: ${screen.title}`}
                  width={1440}
                  height={900}
                  unoptimized
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>

            {/* Caption sotto */}
            <AnimatePresence mode="wait">
              <motion.div
                key={screen.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 p-4 rounded-xl"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <screen.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p className="text-base font-semibold mb-0.5" style={{ color: 'var(--fg)' }}>
                      {screen.title}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {screen.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Lista thumb laterale (desktop) / scroll orizzontale (mobile) */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SCREENS.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setActive(i)}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition-all shrink-0 min-w-[200px] lg:min-w-0 lg:w-full"
                style={{
                  background: active === i ? 'var(--card)' : 'transparent',
                  border: active === i ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                }}
                aria-label={`Vedi schermata ${s.title}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: active === i ? 'var(--accent-light)' : 'var(--bg)' }}
                >
                  <s.icon
                    className="w-4 h-4"
                    style={{ color: active === i ? 'var(--accent)' : 'var(--muted)' }}
                  />
                </div>
                <span
                  className="text-sm font-semibold leading-tight"
                  style={{ color: active === i ? 'var(--fg)' : 'var(--muted)' }}
                >
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA finale */}
        <div className="mt-10 text-center">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
          >
            Leggi la documentazione completa
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
