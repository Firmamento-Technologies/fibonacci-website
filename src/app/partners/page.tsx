import type { Metadata } from 'next'
import Link from 'next/link'
import { HandshakeIcon, Share2, Banknote, ArrowRight, Award } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FibonacciPattern } from '@/components/FibonacciPattern'
import { PartnersCalculator } from './PartnersCalculator'

export const metadata: Metadata = {
  title: 'Programma Ambassador · Fibonacci',
  description:
    "Hai un collega a cui Fibonacci potrebbe servire? Ti riconosciamo il 20% del primo anno e il 10% finché resta cliente. Senza tier, senza limiti, senza complicazioni.",
  keywords: ['ambassador fibonacci', 'programma referral medici', 'partnership EMR'],
}

const EXAMPLES = [
  { plan: 'Solo', price: 89, firstYear: 213, recurring: 107 },
  { plan: 'Studio', price: 199, firstYear: 478, recurring: 239 },
  { plan: 'Clinica', price: 449, firstYear: 1078, recurring: 539 },
] as const

const STEPS = [
  {
    icon: HandshakeIcon,
    title: 'Candidati',
    body: 'Compila il form. Verifichiamo che sei cliente Fibonacci da almeno 60 giorni e ti mandiamo l\'accordo. Ti rispondiamo entro 5 giorni.',
  },
  {
    icon: Share2,
    title: 'Condividi il link',
    body: 'Ricevi un link personale tracciato. Puoi inviarlo via email, WhatsApp, durante un congresso, in una call con un collega. Il riconoscimento dura 90 giorni.',
  },
  {
    icon: Banknote,
    title: 'Ti paghiamo',
    body: 'Quando il tuo collega attiva il piano pagante, ti fatturiamo il 20% del primo anno + il 10% ogni mese finché resta cliente. Bonifico entro il 15 del mese successivo.',
  },
] as const

const FAQ = [
  {
    q: 'Devo essere già cliente Fibonacci?',
    a: 'Sì. Vogliamo che chi consiglia Fibonacci lo usi davvero. Bastano 60 giorni di sottoscrizione attiva per candidarti.',
  },
  {
    q: 'Devo aprire P.IVA?',
    a: 'Sì, anche regime forfettario va bene. Se sei medico libero professionista ce l\'hai già. Se sei dipendente ospedaliero, controlla con il tuo ordine se serve autorizzazione.',
  },
  {
    q: 'E se il collega disdice dopo 3 mesi?',
    a: 'La commissione one-time viene rimborsata. Se disdice tra 3 e 6 mesi, viene rimborsata a metà. Dopo 6 mesi, è tua per sempre.',
  },
  {
    q: 'È legale?',
    a: 'Sì. Il programma è B2B: tu vieni pagato per la vendita del software, non per pazienti. Abbiamo strutturato l\'accordo con un avvocato sanitario per stare dentro al codice deontologico medico. Quando promuovi Fibonacci dichiari sempre il rapporto economico (ti forniamo i template).',
  },
] as const

export default function PartnersPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20" style={{ background: 'var(--card)' }}>
        <FibonacciPattern opacity={0.05} align="top-right" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <Award className="w-3.5 h-3.5" />
            Programma Ambassador
          </div>

          <h1
            className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ color: 'var(--fg)' }}
          >
            Porti un collega su Fibonacci?
            <br />
            <span style={{ color: 'var(--accent)' }}>Ti riconosciamo una parte.</span>
          </h1>

          <p className="text-lg leading-relaxed mb-8 max-w-2xl" style={{ color: 'var(--muted)' }}>
            Il <strong style={{ color: 'var(--fg)' }}>20% del primo anno</strong> e il{' '}
            <strong style={{ color: 'var(--fg)' }}>10% ogni mese</strong> finché resta cliente.
            <br />
            Senza tier, senza limiti, senza calcoli strani.
          </p>

          <a
            href="#candidatura"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Candidati come Ambassador
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Esempi statici */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              Quanto guadagni
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Esempi concreti, per un collega
            </h2>
            <p className="text-base" style={{ color: 'var(--muted)' }}>
              Se ne porti più di uno, moltiplica.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {EXAMPLES.map((ex) => (
              <div
                key={ex.plan}
                className="rounded-2xl p-6"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--muted)' }}>
                  Collega su piano {ex.plan}
                </p>
                <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
                  {ex.price} €/mese
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                      Primo anno
                    </p>
                    <p
                      className="font-[var(--font-playfair)] text-2xl font-bold"
                      style={{ color: 'var(--fg)' }}
                    >
                      {ex.firstYear} €
                    </p>
                  </div>

                  <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                      Dal secondo anno in poi
                    </p>
                    <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                      {ex.recurring} €/anno
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>
                      Finché resta cliente
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <p className="text-center text-sm mb-6" style={{ color: 'var(--muted)' }}>
              Oppure simula con i tuoi numeri
            </p>
            <PartnersCalculator />
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-20" style={{ background: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              Come funziona
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold" style={{ color: 'var(--fg)' }}>
              Tre step
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl p-6"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--accent-light)' }}
                >
                  <step.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                  Step {idx + 1}
                </p>
                <h3 className="font-[var(--font-playfair)] text-xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold" style={{ color: 'var(--fg)' }}>
              Domande frequenti
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="rounded-xl p-5 group"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <summary
                  className="font-semibold cursor-pointer flex items-center justify-between gap-3"
                  style={{ color: 'var(--fg)' }}
                >
                  <span>{item.q}</span>
                  <ArrowRight
                    className="w-4 h-4 shrink-0 group-open:rotate-90 transition-transform"
                    style={{ color: 'var(--accent)' }}
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA candidatura */}
      <section id="candidatura" className="py-20" style={{ background: 'var(--fg)', color: 'white' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-6">
            Candidati Ambassador
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Rispondiamo entro 5 giorni lavorativi. Onboarding in una call da 30 minuti.
          </p>

          <Link
            href="/?intent=ambassador#demo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Candidati
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
