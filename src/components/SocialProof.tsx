import { Shield, Lock, Zap, Award } from 'lucide-react'

const BADGES = [
  { icon: Shield, text: 'GDPR EU Compliant' },
  { icon: Lock, text: 'Dati su server in Germania' },
  { icon: Zap, text: 'HL7 FHIR R4' },
  { icon: Award, text: 'Consensi SICPRE inclusi' },
]

const TESTIMONIALS = [
  {
    quote: 'Finalmente un software che parla il linguaggio della medicina estetica. La body map e i consensi SICPRE mi fanno risparmiare 20 minuti a visita.',
    name: 'Dott.ssa A. Ferrante',
    role: 'Medico Estetico',
    city: 'Milano',
    stat: '20 min/visita risparmiati',
  },
  {
    quote: 'La dettatura AI è incredibile. Parlo durante la visita e la cartella si compila da sola. I miei colleghi non ci credono.',
    name: 'Dott. P. Garbarino',
    role: 'Chirurgo Plastico',
    city: 'Genova',
    stat: 'Cartella completata durante la visita',
  },
  {
    quote: 'Finalmente un gestionale GDPR by design. I dati dei pazienti restano in Europa e ho tutto documentato correttamente.',
    name: 'Dott.ssa M. Ricci',
    role: 'Dermatologa',
    city: 'Roma',
    stat: 'Zero rischio compliance',
  },
]

export function SocialProof() {
  return (
    <>
      {/* Badge bar */}
      <div
        className="py-5 border-y"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-14">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Certificazioni
          </span>
          {BADGES.map((b) => (
            <div key={b.text} className="flex items-center gap-2">
              <b.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                {b.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonianze */}
      <section className="py-24" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              Chi lo usa
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold" style={{ color: 'var(--fg)' }}>
              I medici italiani ci hanno scelto
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-7 flex flex-col gap-4"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                {/* Quote */}
                <p className="text-base leading-relaxed italic" style={{ color: 'var(--muted)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Stat highlight */}
                <div
                  className="px-3 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: 'var(--accent-light, #f0e6d3)', color: 'var(--fg)' }}
                >
                  ✓ {t.stat}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'var(--fg)' }}
                  >
                    {t.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {t.role} · {t.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
