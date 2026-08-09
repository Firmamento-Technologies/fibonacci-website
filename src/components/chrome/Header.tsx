'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { APP_URL, DEMO_URL } from '@/lib/site-config'
import { Logo } from '@/components/Logo'

/* Cinque voci, non undici.
 *
 * L'ordine non è alfabetico né casuale: è la sequenza delle domande che il
 * medico fa in trattativa. Cosa fa · il pezzo che gli costa di più · dove
 * finiscono i dati dei pazienti · quanto costa · e le obiezioni.
 * Butterick mette i bordi di pagina infarciti di link fra i vizi storici del
 * web; una barra che elenca tutto non aiuta a scegliere, impedisce di farlo. */
const VOCI = [
  { href: '/come-funziona', testo: 'Come funziona' },
  { href: '/consensi-informati', testo: 'Consensi' },
  { href: '/sicurezza-e-dati', testo: 'Sicurezza e dati' },
  { href: '/prezzi', testo: 'Prezzi' },
  { href: '/domande', testo: 'Domande' },
] as const

export function Header() {
  const [staccato, setStaccato] = useState(false)
  const [menuAperto, setMenuAperto] = useState(false)
  const menoMovimento = useReducedMotion()

  const { scrollYProgress } = useScroll()
  const avanzamento = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })

  useEffect(() => {
    const suScorrimento = () => setStaccato(window.scrollY > 13)
    suScorrimento()
    window.addEventListener('scroll', suScorrimento, { passive: true })
    return () => window.removeEventListener('scroll', suScorrimento)
  }, [])

  // Il menu mobile è a tutto schermo: senza questo la pagina sotto scorre.
  useEffect(() => {
    document.body.style.overflow = menuAperto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuAperto])

  useEffect(() => {
    const suEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuAperto(false) }
    window.addEventListener('keydown', suEsc)
    return () => window.removeEventListener('keydown', suEsc)
  }, [])

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: staccato ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: staccato ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: staccato ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${staccato ? 'var(--rule)' : 'transparent'}`,
        transition: 'background var(--t) var(--ease), border-color var(--t) var(--ease)',
      }}
    >
      <div className="gabbia">
        <div className="flex items-center justify-between" style={{ height: 'var(--s-89)' }}>
          <Link href="/" className="flex items-center gap-[var(--s-13)]" aria-label="Fibonacci, home">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-[var(--s-34)]" aria-label="Principale">
            {VOCI.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                className="text-[15px] transition-colors"
                style={{ color: 'var(--fg-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--fg-muted)')}
              >
                {v.testo}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-[var(--s-21)]">
            <a
              href={APP_URL}
              className="text-[15px]"
              style={{ color: 'var(--fg-faint)' }}
              rel="noopener"
            >
              Accedi
            </a>
            <Link href="/richiedi-una-demo" className="btn btn-primario">
              Richiedi una demo
            </Link>
          </div>

          {/* ⚠️ L'INVITO ALL'AZIONE RESTA IN VISTA ANCHE SU TELEFONO.
              Misurato il 2026-08-09: sotto `lg` questa intestazione conteneva
              **solo il marchio e l'hamburger** — nessun invito — su una home
              alta **21.693 px**. Passato il primo schermo, per convertire
              bisognava aprire un menu. Sul desktop, dove l'intestazione è
              `sticky`, il pulsante segue il lettore per tutta la pagina: su
              telefono, dove la pagina è più lunga, spariva.
              CXL (tier 2), sulle cose che funzionano più spesso che no negli
              A/B test: *«On small-screen mobile websites, having a sticky
              header or footer containing a call to action has consistently
              increased conversion rates»* — e nota che sui piè di pagina c'è
              **più cecità** che sulle intestazioni. Per questo il rimedio è
              qui e non è una barra nuova in fondo: l'intestazione è già
              `sticky`, e una barra flottante in più sarebbe l'errore che
              abbiamo appena corretto nell'applicazione.
              «Entra» e non «Richiedi una demo»: è più corto, ci sta accanto
              all'hamburger senza comprimere il marchio, e porta alla demo
              aperta, che è la cosa che un medico può verificare da solo.
              ([[sintesi-analisi-ui-ux-2026-08-09]] §S5) */}
          <a
            href={DEMO_URL}
            className="btn btn-primario lg:hidden"
            style={{ marginRight: 'var(--s-8)', paddingInline: 'var(--s-13)', fontSize: 13 }}
            rel="noopener"
          >
            Entra nella demo
          </a>

          <button
            type="button"
            className="lg:hidden flex items-center justify-center"
            style={{ width: 48, height: 48, marginRight: 'calc(var(--s-13) * -1)' }}
            aria-expanded={menuAperto}
            aria-controls="menu-mobile"
            aria-label={menuAperto ? 'Chiudi il menu' : 'Apri il menu'}
            onClick={() => setMenuAperto((v) => !v)}
          >
            <span className="relative block" style={{ width: 21, height: 13 }}>
              <span
                className="absolute left-0 block"
                style={{
                  top: menuAperto ? 6 : 0, width: 21, height: 1.5, background: 'var(--fg)',
                  transform: menuAperto ? 'rotate(45deg)' : 'none',
                  transition: 'transform var(--t-fast) var(--ease), top var(--t-fast) var(--ease)',
                }}
              />
              <span
                className="absolute left-0 block"
                style={{
                  top: menuAperto ? 6 : 11.5, width: 21, height: 1.5, background: 'var(--fg)',
                  transform: menuAperto ? 'rotate(-45deg)' : 'none',
                  transition: 'transform var(--t-fast) var(--ease), top var(--t-fast) var(--ease)',
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Filo di avanzamento della lettura. Un pixel, colore d'accento: dice a
          che punto della pagina si è senza occupare spazio né chiedere
          attenzione. Con reduced-motion sparisce: è puro ornamento. */}
      {!menoMovimento && (
        <motion.div
          aria-hidden="true"
          style={{
            scaleX: avanzamento,
            transformOrigin: '0%',
            height: 1,
            background: 'var(--accent)',
            opacity: staccato ? 1 : 0,
            transition: 'opacity var(--t) var(--ease)',
          }}
        />
      )}

      {menuAperto && (
        <div
          id="menu-mobile"
          className="lg:hidden fixed inset-x-0 overflow-y-auto"
          style={{
            top: 'var(--s-89)',
            bottom: 0,
            background: 'var(--paper)',
            borderTop: '1px solid var(--rule)',
          }}
        >
          <nav className="gabbia" style={{ paddingBlock: 'var(--s-34)' }} aria-label="Principale, mobile">
            {VOCI.map((v, i) => (
              <Link
                key={v.href}
                href={v.href}
                onClick={() => setMenuAperto(false)}
                className="flex items-baseline gap-[var(--s-21)]"
                style={{
                  paddingBlock: 'var(--s-21)',
                  borderBottom: '1px solid var(--rule)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                }}
              >
                <span className="numero">{String(i + 1).padStart(2, '0')}</span>
                {v.testo}
              </Link>
            ))}
            <div className="flex flex-col gap-[var(--s-13)]" style={{ marginTop: 'var(--s-34)' }}>
              <Link href="/richiedi-una-demo" className="btn btn-primario" onClick={() => setMenuAperto(false)}>
                Richiedi una demo
              </Link>
              <a href={APP_URL} className="btn btn-secondario" rel="noopener">
                Accedi
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
