'use client'

import { t } from '@/lib/testo'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { APP_URL, SIGNUP_URL, DEMO_URL } from '@/lib/site-config'
import { Logo } from '@/components/Logo'

/* Quattro voci, non undici.
 *
 * L'ordine non è alfabetico né casuale: è la sequenza delle domande che il
 * medico fa in trattativa. Cosa fa · il pezzo che gli costa di più · dove
 * finiscono i dati dei pazienti · quanto costa.
 * Butterick mette i bordi di pagina infarciti di link fra i vizi storici del
 * web; una barra che elenca tutto non aiuta a scegliere, impedisce di farlo. */
/* 🔴 **DA 11 ELEMENTI A 6** (utente, 2026-08-16: *«ci sono troppe voci e non
 * c'è un ordine di priorità»*). Misurato prima di tagliare: la barra portava
 * **11 collegamenti** — sei voci di contenuto, «Registrati», «Accedi», il
 * logo e l'invito — **tutti con lo stesso peso visivo**. Baymard, su test di
 * navigazione, registra che si comincia a essere sopraffatti oltre la
 * decina; e qui il difetto peggiore non era il numero ma la **piattezza**:
 * «Accedi» è un'azione di account e pesava quanto «Consensi», che è
 * contenuto.
 *
 * 🔑 **Quattro voci, e sono il ragionamento di chi compra** — lo stesso
 * ordine di `lib/percorso.ts`:
 *     cos'è → perché è diverso → è al sicuro → quanto costa
 *
 * ⛔ **Non è una perdita per «Conformità» e «Domande»**, e questo è il punto
 * che rende il taglio possibile: **il sito è un percorso**. Ogni pagina ha la
 * V che porta alla successiva, quindi chi entra da «Sicurezza e dati» arriva
 * alla conformità **camminando**, senza doverla cercare in una barra. In più
 * i cinque sigilli nel piè di pagina stanno su **ogni** pagina: la conformità
 * è più visibile ora di quando era la sesta voce di un menu piatto.
 *
 * ⚠️ Chi vuole aggiungere la quinta: prima misuri quale delle quattro toglie. */
const VOCI = [
  { href: '/come-funziona', testo: t('chrome.header.come_funziona') },
  { href: '/consensi-informati', testo: t('chrome.header.consensi') },
  { href: '/sicurezza-e-dati', testo: t('chrome.header.sicurezza_e_dati') },
  { href: '/prezzi', testo: t('chrome.header.prezzi') },
] as const

export function Header() {
  const [staccato, setStaccato] = useState(false)
  /* La pagina in cui siamo, senza la barra finale: `trailingSlash: true` fa
     arrivare qui `/prezzi/`, mentre in `VOCI` gli indirizzi sono senza. */
  const percorsoCorrente = (usePathname() ?? '/').replace(/\/$/, '') || '/'
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
        {/* ⚠️ L'altezza passa da una variabile perché su telefono è diversa:
            89px erano il 12% di una schermata da 812, tolti a OGNI passo del
            percorso. A 55 il logo (34px) e il pulsante ci stanno comodi.
            ⛔ `--h-barra` e `--h-intestazione` in `globals.css` sono una
            coppia: il secondo è il primo più il filetto. Se cambia uno,
            cambia l'altro — e il presidio legge `--h-intestazione`, quindi
            una modifica sbagliata si vede subito. */}
        <div className="flex items-center justify-between" style={{ height: 'var(--h-barra)' }}>
          <Link href="/" className="flex items-center gap-[var(--s-13)]" aria-label={t('chrome.header.fibonacci_home')}>
            <Logo />
          </Link>

          {/* ⚠️ **Dov'è l'utente adesso**: la voce della pagina corrente è
              marcata `aria-current` e sottolineata. Baymard lo registra come
              mancante sul **95% dei siti** provati, ed è la prima cosa che
              serve a chi arriva da una ricerca e non sa dove è atterrato. */}
          <nav className="hidden lg:flex items-center gap-[var(--s-34)]" aria-label={t('chrome.header.principale')}>
            {VOCI.map((v) => {
              const qui = percorsoCorrente === v.href
              return (
                <Link
                  key={v.href}
                  href={v.href}
                  aria-current={qui ? 'page' : undefined}
                  className="text-[15px] transition-colors"
                  style={{
                    color: qui ? 'var(--fg)' : 'var(--fg-muted)',
                    borderBottom: `1px solid ${qui ? 'var(--accent)' : 'transparent'}`,
                    paddingBottom: 2,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--fg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = qui ? 'var(--fg)' : 'var(--fg-muted)')}
                >
                  {v.testo}
                </Link>
              )
            })}
          </nav>

          {/* ── Le AZIONI, separate dal contenuto da un filetto ──────────
              🔴 Prima «Registrati» e «Accedi» erano due testi identici alle
              voci di contenuto: la barra non distingueva *leggere una pagina*
              da *entrare nel prodotto*, che sono due gesti diversi.
              Ora la gerarchia è dichiarata in tre gradini, e si vede a colpo
              d'occhio quale è quello principale:
                 testo semplice → contorno → pieno
              ⛔ **«Registrati» esce dalla barra, NON dal sito**: resta nel piè
              di pagina, su ogni pagina. La lezione del 2026-08-12 era che un
              prodotto in abbonamento **senza nessun** collegamento alla
              registrazione perde chi era già convinto; non che quel
              collegamento debba stare in cima. Qui in cima ci sono i due
              gesti che chi non è ancora cliente compie davvero: **entrare**
              se è già cliente, **chiedere una demo** se non lo è. */}
          <div className="hidden lg:flex items-center gap-[var(--s-13)]">
            {APP_URL && (
              <a
                href={APP_URL}
                className="btn btn-secondario"
                rel="noopener"
                style={{ borderLeft: '1px solid var(--rule)', paddingLeft: 'var(--s-21)', marginLeft: 'var(--s-8)' }}
              >
                {t('chrome.header.accedi')}
              </a>
            )}
            <Link href="/richiedi-una-demo" className="btn btn-primario">
              {t('chrome.header.richiedi_una_demo')}
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
          {/* S5 chiede un invito nell'intestazione su telefono: resta, e senza
              demo punta al modulo. La parola torna «Entra» quando c'è un host. */}
          {DEMO_URL ? (
            <a
              href={DEMO_URL}
              className="btn btn-primario lg:hidden"
              style={{ marginRight: 'var(--s-8)', paddingInline: 'var(--s-13)', fontSize: 13 }}
              rel="noopener"
            >
              {t('chrome.header.entra_nella_demo')}
            </a>
          ) : (
            <Link
              href="/richiedi-una-demo"
              className="btn btn-primario lg:hidden"
              style={{ marginRight: 'var(--s-8)', paddingInline: 'var(--s-13)', fontSize: 13 }}
            >
              {t('chrome.header.richiedi_una_demo')}
            </Link>
          )}

          <button
            type="button"
            className="lg:hidden flex items-center justify-center"
            style={{ width: 48, height: 48, marginRight: 'calc(var(--s-13) * -1)' }}
            aria-expanded={menuAperto}
            aria-controls="menu-mobile"
            aria-label={menuAperto ? t('chrome.header.chiudi_il_menu') : t('chrome.header.apri_il_menu')}
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
          <nav className="gabbia" style={{ paddingBlock: 'var(--s-34)' }} aria-label={t('chrome.header.principale_mobile')}>
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
                {t('chrome.header.richiedi_una_demo')}
              </Link>
              {SIGNUP_URL && (
                <a href={SIGNUP_URL} className="btn btn-secondario" rel="noopener">
                  {t('chrome.header.registrati')}
                </a>
              )}
              {APP_URL && (
                <a href={APP_URL} className="btn btn-secondario" rel="noopener">
                  {t('chrome.header.accedi')}
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
