import Link from 'next/link'
import { Mic, Sparkles, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react'
import { FibonacciPattern } from '@/components/FibonacciPattern'

const AI_FEATURES = [
  {
    icon: Mic,
    title: 'Dettatura clinica in tempo reale',
    body:
      'Parli mentre visiti il paziente e le tue parole diventano testo all\'istante. La nota si scrive da sé, ottimizzata per il linguaggio medico italiano.',
    detail: 'Voce → testo',
  },
  {
    icon: Sparkles,
    title: 'Anamnesi assistita, campo per campo',
    body:
      'L\'AI rilegge la dettatura e propone i campi dell\'anamnesi — allergie, farmaci, patologie, familiarità. Tu approvi, correggi o ignori prima di salvare.',
    detail: 'Proposta, mai imposta',
  },
  {
    icon: MessageCircle,
    title: 'Assistente clinico in-app',
    body:
      'Un assistente sempre a portata di clic: cerca un paziente per sintomo, confronta visite, suggerisce i modelli di anamnesi della tua specialità.',
    detail: 'Sempre a portata',
  },
  {
    icon: ShieldCheck,
    title: 'AI responsabile, mai automatica',
    body:
      'L\'AI propone, il medico decide. Nessun contenuto entra in cartella senza la tua approvazione, e ogni intervento dell\'AI resta tracciato. È uno strumento di supporto, non un dispositivo medico.',
    detail: 'Il medico firma',
  },
] as const

export function AIFeatures() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'var(--card)' }} id="ai">
      <FibonacciPattern size={700} opacity={0.05} align="bottom-left" color="#0b699f" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            Intelligenza Artificiale
          </div>
          <h2
            className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4 break-words"
            style={{ color: 'var(--fg)' }}
          >
            L&apos;AI che scrive con te, non al posto tuo
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Fibonacci usa modelli AI per accelerare la documentazione clinica:
            il medico parla, l&apos;AI struttura, il medico valida. Nessuna decisione clinica
            automatica, nessuna persistenza senza approvazione.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {AI_FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl transition-shadow hover:shadow-md"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-light)' }}
                >
                  <f.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--muted)' }}
                >
                  {f.detail}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div
          className="grid sm:grid-cols-3 gap-3 p-5 rounded-2xl"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          {[
            { num: 'Sempre', label: 'il medico approva prima di salvare' },
            { num: 'Tracciata', label: 'ogni interazione con l’AI è registrata' },
            { num: 'UE', label: 'modelli AI ospitati in Europa' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p
                className="font-[family-name:var(--font-geist)] tracking-[-0.02em] text-3xl font-semibold mb-1"
                style={{ color: 'var(--fg)' }}
              >
                {item.num}
              </p>
              <p className="text-xs leading-snug" style={{ color: 'var(--muted)' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/intelligenza-artificiale"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
          >
            Approfondisci come usiamo l&apos;AI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
