'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react'
import { SPECIALTIES } from '@/lib/specialties'
import { APP_URL, DEMO_URL } from '@/lib/site-config'
import { FibonacciLogo, FibonacciWordmark } from '@/components/Logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [specialtyOpen, setSpecialtyOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'liquid-glass' : ''}`}
      style={
        scrolled
          ? {}
          : {
              background: 'transparent',
              backdropFilter: 'none',
              borderBottom: 'none',
              boxShadow: 'none',
            }
      }
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <FibonacciLogo size={34} />
          <FibonacciWordmark className="text-base" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Specialità dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setSpecialtyOpen(true)}
              onMouseLeave={() => setSpecialtyOpen(false)}
              className="flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              Specialità <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {specialtyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={() => setSpecialtyOpen(true)}
                  onMouseLeave={() => setSpecialtyOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl shadow-xl p-2"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  {SPECIALTIES.map((s) => (
                    <Link
                      key={s.id}
                      href={`/specialita/${s.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-[var(--bg)]"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: s.color }}
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                        {s.label}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/#come-funziona"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Come funziona
          </Link>
          <Link
            href="/#prezzi"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Prezzi
          </Link>
          <Link
            href="/intelligenza-artificiale"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            AI
          </Link>
          <Link
            href="/tutorial"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Tutorial
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Docs
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            FAQ
          </Link>
          <a
            href={APP_URL}
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--muted)' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Accedi
          </a>
        </nav>

        {/* CTA: Prova demo live (primario) - apre app live in nuova tab */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--fg)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Prova demo
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: 'var(--fg)' }}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="px-6 py-4 space-y-3">
              {SPECIALTIES.map((s) => (
                <Link
                  key={s.id}
                  href={`/specialita/${s.id}`}
                  className="flex items-center gap-3 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                    {s.label}
                  </span>
                </Link>
              ))}
              <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mb-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: 'var(--fg)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Prova demo live
                </a>
                <Link
                  href="/intelligenza-artificiale"
                  className="text-sm font-medium py-1"
                  style={{ color: 'var(--muted)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Intelligenza Artificiale
                </Link>
                <Link
                  href="/tutorial"
                  className="text-sm font-medium py-1"
                  style={{ color: 'var(--muted)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Tutorial
                </Link>
                <Link
                  href="/docs"
                  className="text-sm font-medium py-1"
                  style={{ color: 'var(--muted)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Documentazione
                </Link>
                <Link
                  href="/faq"
                  className="text-sm font-medium py-1"
                  style={{ color: 'var(--muted)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  href="/chi-siamo"
                  className="text-sm font-medium py-1"
                  style={{ color: 'var(--muted)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Chi siamo
                </Link>
                <Link
                  href="/#demo"
                  className="mt-2 block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: 'var(--fg)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Richiedi demo gratuita
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
