import Link from 'next/link'
import { Mic, Sparkles, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react'

const AI_FEATURES = [
  {
    icon: Mic,
    title: 'Dettatura clinica in tempo reale',
    body:
      'Voxtral 24B di Mistral AI trascrive la tua voce mentre visiti il paziente. Le parole appaiono in tempo reale, partial in grigio e finali in nero. Accuratezza 95-98% sull\'italiano medico clinico.',
    detail: 'Mistral Voxtral 24B',
  },
  {
    icon: Sparkles,
    title: 'Estrazione strutturata con confidence',
    body:
      'L\'AI legge la tua dettatura e propone i campi anamnesi (allergie, farmaci, patologie, familiarità) con punteggio di confidenza per ogni campo. Tu approvi, modifichi o ignori prima del salvataggio.',
    detail: 'Apply-to-form ML',
  },
  {
    icon: MessageCircle,
    title: 'Chatbot clinico in-app',
    body:
      'Il widget "Chiedi all\'AI" risponde a domande sul paziente corrente o sui workflow Fibonacci: cerca per sintomo, confronta visite, suggerisce template anamnesi della tua specialità.',
    detail: 'Context-aware assistant',
  },
  {
    icon: ShieldCheck,
    title: 'AI responsabile, mai automatica',
    body:
      'L\'AI propone, il medico decide. Nessun output AI viene salvato in cartella senza approvazione esplicita. Audit log traccia ogni interazione AI. Conformità RF-5.4: strumento di supporto, non dispositivo medico MDR.',
    detail: 'Compliance RF-5.4',
  },
] as const

export function AIFeatures() {
  return (
    <section className="py-24" style={{ background: 'var(--card)' }} id="ai">
      <div className="max-w-6xl mx-auto px-6">
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
            { num: '0', label: 'output AI salvati senza approvazione' },
            { num: '100%', label: 'tracciato in audit log FHIR' },
            { num: 'EU', label: 'modelli ospitati in UE (Mistral Francia)' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p
                className="font-[var(--font-playfair)] text-3xl font-bold mb-1"
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
