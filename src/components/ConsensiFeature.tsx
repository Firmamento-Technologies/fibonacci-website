import Link from 'next/link'
import { FileSignature, ShieldCheck, BookOpen, Activity, ArrowRight, Sparkles } from 'lucide-react'
import { FibonacciPattern } from '@/components/FibonacciPattern'

const CONSENSI_HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: 'Generati dall’AI, conformi alla norma',
    body:
      "Selezioni il trattamento e l'AI compone in pochi secondi un consenso conforme alla L. 219/2017, con tutte le sezioni obbligatorie: descrizione, benefici, rischi, alternative, conseguenze del rifiuto, conferma di comprensione e firma.",
    detail: 'Conforme L. 219/2017',
  },
  {
    icon: BookOpen,
    title: 'Ancorati a fonti pubbliche italiane',
    body:
      "Ogni paragrafo è ancorato a clausole tratte da documenti pubblici della sanità italiana (Regione Lazio, Lombardia, Emilia-Romagna, ASL e aziende ospedaliere): testi reali e verificati, non inventati dall'AI.",
    detail: 'Testi reali, non inventati',
  },
  {
    icon: ShieldCheck,
    title: 'Validati sezione per sezione',
    body:
      "Ogni sezione riceve un controllo di qualità su completezza, riferimenti normativi e ancoraggio alle fonti. Quando il controllo non è pieno, il sistema chiede la revisione del medico prima di procedere.",
    detail: 'Il medico rivede sempre',
  },
  {
    icon: Activity,
    title: 'Firma con valore legale, conservazione a norma',
    body:
      "Il consenso si firma elettronicamente con valore legale e viene conservato in un formato a norma per l'archiviazione a lungo termine. Ogni generazione e ogni firma restano tracciate.",
    detail: 'Firma + conservazione',
  },
] as const

export function ConsensiFeature() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
      id="consensi"
    >
      <FibonacciPattern size={620} opacity={0.04} align="top-right" color="#0b699f" />
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
            italiane, validato sezione per sezione e sempre tracciato.
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
            { num: '72', label: 'clausole da documenti pubblici italiani' },
            { num: '8', label: 'sezioni obbligatorie in ogni consenso' },
            { num: 'L. 219/2017', label: 'la norma di riferimento sul consenso' },
            { num: 'Sempre', label: 'revisione del medico prima di salvare' },
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
            href="/consensi-informati"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
          >
            Vedi come funziona e le fonti normative
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
