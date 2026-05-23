import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowRight, Clock, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { DEMO_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Prova la demo live',
  description:
    'Esplora Fibonacci in 30 secondi: account isolato, nessuna registrazione, accesso istantaneo a body-map, dettatura AI, consensi informati e tutte le funzionalità della piattaforma.',
  alternates: { canonical: '/prova-demo' },
}

const HIGHLIGHTS = [
  { icon: Clock, title: '30 secondi', body: 'Click, attendi il login automatico, sei dentro.' },
  { icon: ShieldCheck, title: 'Account isolato', body: 'Nessun dato di altri studi. Non serve registrarsi.' },
  { icon: RefreshCw, title: 'Reset settimanale', body: 'I dati demo vengono ripristinati al baseline ogni settimana.' },
] as const

const CAN_DO = [
  'Creare un paziente con anagrafica completa',
  'Aprire la body-map 2D e marcare aree trattate',
  'Compilare anamnesi con dettatura AI Voxtral',
  'Generare un consenso informato in PDF',
  'Esplorare l\'agenda appuntamenti condivisa',
  'Vedere l\'audit log immutabile in tempo reale',
  'Chattare con l\'assistente AI sul paziente',
  'Sfogliare il catalogo farmaci AIFA aggiornato',
] as const

export default function ProvaDemoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'var(--bg)' }}>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 0%, var(--accent-light) 0%, transparent 60%)',
            }}
          />
          <div className="relative max-w-4xl mx-auto px-6 py-20 lg:py-24 text-center">
            <div
              className="flex items-center gap-2 text-xs font-medium mb-3 justify-center"
              style={{ color: 'var(--muted)' }}
            >
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>Prova demo</span>
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              Demo Live
            </div>
            <h1
              className="font-[var(--font-playfair)] text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-5 break-words"
              style={{ color: 'var(--fg)' }}
            >
              Esplora Fibonacci in 30 secondi
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
              style={{ color: 'var(--muted)' }}
            >
              Account demo isolato, accesso istantaneo, nessuna registrazione.
              Clicca il pulsante qui sotto e atterri direttamente sulla dashboard
              con pazienti dimostrativi pre-caricati. Puoi cliccare ovunque,
              testare tutto. I dati che inserisci vengono ripristinati a fine settimana.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--fg)' }}
              >
                <Sparkles className="w-5 h-5" />
                Avvia demo live
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href="/#demo"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-semibold transition-colors"
                style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
              >
                Preferisco una demo guidata
              </Link>
            </div>
          </div>
        </section>

        {/* 3 highlights */}
        <section className="py-16" style={{ background: 'var(--card)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.title}
                  className="p-6 rounded-2xl text-center"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <h.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3
                    className="font-[var(--font-playfair)] text-lg font-bold mb-2"
                    style={{ color: 'var(--fg)' }}
                  >
                    {h.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {h.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cosa puoi fare */}
        <section className="py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3 text-center"
              style={{ color: 'var(--accent)' }}
            >
              Cosa puoi fare
            </p>
            <h2
              className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-10 text-center break-words"
              style={{ color: 'var(--fg)' }}
            >
              8 cose che puoi provare subito nella demo
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {CAN_DO.map((item, i) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--fg)' }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer importante */}
        <section className="py-12" style={{ background: 'var(--card)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div
              className="flex items-start gap-3 p-5 rounded-2xl"
              style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              <div className="text-sm leading-relaxed">
                <p className="font-semibold mb-1">Importante prima di iniziare</p>
                <p>
                  L&apos;account demo è condiviso con altri visitatori del sito. I dati che
                  inserisci sono visibili a chiunque acceda alla demo finché non viene
                  ripristinato il baseline (fine settimana). <strong>Non inserire dati
                  reali</strong> di pazienti veri, nomi reali, codici fiscali reali.
                  Usa dati fittizi tipo &quot;Mario Rossi&quot;.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA finale */}
        <section className="py-20" style={{ background: 'var(--fg)' }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto a vedere Fibonacci in azione?
            </h2>
            <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Click qui sotto: si apre una nuova scheda, login automatico,
              sei sulla dashboard reale in meno di 30 secondi.
            </p>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#f0d27a', color: 'var(--fg)' }}
            >
              <Sparkles className="w-5 h-5" />
              Avvia demo live
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
