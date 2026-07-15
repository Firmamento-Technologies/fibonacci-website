'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { type FaqItem } from '@/lib/faq-data'

// Accordion interattivo estratto in un Client Component (E2.2): così la page
// FAQ resta un Server Component e può esportare `metadata` (canonical /faq).
export function FaqAccordionItem({ item, idx }: { item: FaqItem; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--bg)]"
        aria-expanded={open}
        aria-controls={`faq-${idx}`}
      >
        <span className="text-base font-semibold" style={{ color: 'var(--fg)' }}>
          {item.question}
        </span>
        <ChevronDown
          className="w-5 h-5 shrink-0 transition-transform"
          style={{
            color: 'var(--muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${idx}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 -mt-1">
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
