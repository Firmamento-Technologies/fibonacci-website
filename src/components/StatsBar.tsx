// Sezione numeri — social proof quantitativo.
// I numeri specifici battono le dichiarazioni generiche nel B2B medico.
'use client'
import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 1, suffix: '', label: 'modulo live (Medicina Estetica)', prefix: '' },
  { value: 5, suffix: '', label: 'specialità in co-design con cliniche partner', prefix: '' },
  { value: 3, suffix: ' min', label: 'per documentare una visita', prefix: '' },
  { value: 100, suffix: '%', label: 'dati su server EU', prefix: '' },
]

function Counter({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1200
          const steps = 40
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  )
}

export function StatsBar() {
  return (
    <section className="py-16" style={{ background: 'var(--fg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x divide-white/10">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center px-6 py-2">
              <div
                className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold mb-2"
                style={{ color: '#f0d27a' }}
              >
                <Counter target={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <p className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
