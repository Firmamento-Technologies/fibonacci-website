import Link from 'next/link'
import { FileSignature, ShieldCheck, BookOpen, Activity, ArrowRight, Sparkles } from 'lucide-react'
import { FibonacciPattern } from '@/components/FibonacciPattern'

const CONSENSI_HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: 'AI generativa con catalogo 30 procedure',
    body:
      "Selezioni il trattamento e l'AI compone in 12 secondi un consenso conforme L. 219/2017 con 8 sezioni: identificazione paziente, descrizione clinica, benefici, rischi, alternative, conseguenze del rifiuto, conferma comprensione, firma.",
    detail: 'Mistral Medium 3.1',
  },
  {
    icon: BookOpen,
    title: 'Library clausole PA italiane (anti-allucinazione)',
    body:
      "72 clausole giuridiche estratte da 5 fonti della Pubblica Amministrazione (Lazio 2022, Lombardia, ASL Alessandria, AO Cosenza, Emilia-Romagna): testi nel pubblico dominio per L. 633/1941 art. 5. RAG-anchored, non inventati.",
    detail: 'RAG + 5 fonti PA',
  },
  {
    icon: ShieldCheck,
    title: 'Confidence scoring per sezione',
    body:
      "Ogni sezione del consenso ottiene un punteggio 0.0-1.0 calcolato su lunghezza, presenza di citazioni normative e ancoraggio alla library. Sotto 0.7 il sistema obbliga la review medica prima di salvare.",
    detail: 'Validators Python',
  },
  {
    icon: Activity,
    title: 'Audit FHIR + firma eIDAS PDF/A-3b',
    body:
      "Ogni generazione e firma producono AuditEvent FHIR R4 immutabili. Firma elettronica avanzata via OTP paziente, valore legale Reg. UE 910/2014. Output PDF/A-3b conservazione decennale (CAD art. 44).",
    detail: 'FHIR + eIDAS',
  },
] as const

export function ConsensiFeature() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
      id="consensi"
    >
      <FibonacciPattern size={620} opacity={0.04} align="top-right" color="#7d6638" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
          >
            <FileSignature className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            Consensi informati
          </div>
          <h2
            className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4 break-words"
            style={{ color: 'var(--fg)' }}
          >
            Consensi informati generati dall&apos;AI, ancorati alla norma
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Generazione automatica di consensi conformi L. 219/2017 partendo dal
            catalogo procedure. Ogni paragrafo è ancorato a fonti pubbliche
            italiane, validato sezione per sezione e tracciato in audit FHIR.
            Nessun template copiato, nessuna allucinazione passata in silenzio.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {CONSENSI_HIGHLIGHTS.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl transition-shadow hover:shadow-md"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
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
          className="grid sm:grid-cols-4 gap-3 p-5 rounded-2xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {[
            { num: '30', label: 'procedure nel catalogo (5 pronte + 25 AI)' },
            { num: '72', label: 'clausole PA italiane verificate' },
            { num: '8', label: 'sezioni obbligatorie validate' },
            { num: '0', label: 'consensi salvati senza review medica' },
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
            href="/consensi-informati"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
          >
            Vedi come funziona, fonti e confronto vs alternative
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
