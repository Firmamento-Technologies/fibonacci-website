'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Check, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import type { Specialty } from '@/lib/specialties'
import { SPECIALTIES } from '@/lib/specialties'
import { AppMockup } from '@/components/AppMockup'
import { assetPath } from '@/lib/asset-path'

function SpiralDecor({ color, opacity = 0.06 }: { color: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute pointer-events-none"
      style={{ opacity, color }}
    >
      <path
        d="M 300 300 Q 300 100 500 100 Q 700 100 700 300 Q 700 500 500 500 Q 300 500 300 300 Q 300 200 400 200 Q 500 200 500 300 Q 500 400 400 400 Q 300 400 300 300 Q 300 250 350 250 Q 400 250 400 300"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

export function SpecialtyPage({ specialty }: { specialty: Specialty }) {
  const otherSpecialties = SPECIALTIES.filter((s) => s.id !== specialty.id)

  return (
    <main className="pt-16">
      {/* Hero specialty */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 60% 10%, ${specialty.accent} 0%, transparent 70%)`,
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4">
          <SpiralDecor color={specialty.color} opacity={0.08} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-20">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium mb-4" style={{ color: 'var(--muted)' }}>
                <Link href="/" className="hover:underline">Home</Link>
                <span>/</span>
                <Link href="/#specialita" className="hover:underline">Specialità</Link>
                <span>/</span>
                <span style={{ color: 'var(--fg)' }}>{specialty.label}</span>
              </div>

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
                style={{
                  background: specialty.accent,
                  color: specialty.color,
                  border: `1.5px solid ${specialty.color}44`,
                }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: specialty.color }} />
                {specialty.label}
              </div>

              <h1
                className="font-[var(--font-playfair)] text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-5 break-words"
                style={{ color: 'var(--fg)' }}
              >
                {specialty.name.replace('Fibonacci ', '')}{' '}
                <span style={{ color: specialty.color }}>su Fibonacci</span>
              </h1>

              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
                {specialty.tagline}
              </p>

              <div
                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
                style={{ background: specialty.accent, border: `1px solid ${specialty.color}22` }}
              >
                <span
                  className="text-2xl font-bold font-[var(--font-playfair)]"
                  style={{ color: specialty.color }}
                >
                  {specialty.heroStat.value}
                </span>
                <span className="text-sm font-medium" style={{ color: specialty.color }}>
                  {specialty.heroStat.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/#demo"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ background: specialty.color }}
                >
                  Richiedi demo {specialty.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#prezzi"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
                >
                  Vedi i prezzi
                </Link>
              </div>
            </div>

            {/* Estetica usa screenshot reale dell'app live; altre specialty usano mockup
                React (modulo in arrivo). Mobile nascosto per concentrare CTA. */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="relative hidden md:block max-w-full"
            >
              {specialty.id === 'estetica' ? (
                <div
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{ border: `1px solid ${specialty.color}33` }}
                >
                  <Image
                    src={assetPath('/screenshots/estetica/01-pazienti-list.png')}
                    alt="Fibonacci Medicina Estetica: schermata lista pazienti dell'app live"
                    width={1440}
                    height={900}
                    unoptimized
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              ) : (
                <AppMockup specialty={specialty} />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features specialty */}
      <section className="py-20" style={{ background: 'var(--card)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: specialty.color }}
            >
              Funzionalità incluse
            </p>
            <h2
              className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold"
              style={{ color: 'var(--fg)' }}
            >
              Tutto quello che ti serve per {specialty.label.toLowerCase()}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {specialty.features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: specialty.accent }}
                >
                  <Check className="w-5 h-5" style={{ color: specialty.color }} />
                </div>
                <p className="text-base leading-relaxed pt-1" style={{ color: 'var(--fg)' }}>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars: GDPR / dettatura / consensi */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'GDPR by design',
                body: 'Dati cifrati AES-256, server in Germania, audit log immutabile FHIR, MFA TOTP. Compliance integrata, non incollata sopra.',
              },
              {
                icon: Zap,
                title: 'Dettatura AI',
                body: 'Parli durante la visita, la cartella si compila in tempo reale con Voxtral. Apply-to-form sui campi strutturati con confidence score.',
              },
              {
                icon: Sparkles,
                title: 'Una piattaforma, tutte le specialità',
                body: 'Cambi specialità senza cambiare software. Body map, anamnesi e workflow adattati al tuo lavoro reale.',
              },
            ].map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-2xl"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: specialty.accent }}
                >
                  <p.icon className="w-5 h-5" style={{ color: specialty.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA specialty */}
      <section className="py-24" style={{ background: specialty.color }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Pronto a provare Fibonacci {specialty.label}?
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            14 giorni gratis, nessuna carta di credito. Demo personalizzata in 30 minuti.
          </p>
          <Link
            href="/#demo"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'white', color: specialty.color }}
          >
            Richiedi demo gratuita
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Altre specialità */}
      <section className="py-20" style={{ background: 'var(--card)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--accent)' }}
            >
              Tutte le specialità
            </p>
            <h2
              className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold"
              style={{ color: 'var(--fg)' }}
            >
              Scopri Fibonacci per la tua disciplina
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherSpecialties.map((s) => (
              <Link
                key={s.id}
                href={`/specialita/${s.id}`}
                className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.accent }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                    {s.label}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                    {s.tagline}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" style={{ color: s.color }} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
