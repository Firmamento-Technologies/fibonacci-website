import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FileSignature,
  ShieldCheck,
  BookOpen,
  Activity,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Scale,
  FileCheck2,
  ListChecks,
  Cpu,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FibonacciPattern } from '@/components/FibonacciPattern'
import { DEMO_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Consensi informati AI · Fibonacci',
  description:
    "Generazione automatica di consensi informati conformi L. 219/2017. Library 72 clausole PA italiane, confidence scoring per sezione, firma eIDAS PDF/A-3b, audit FHIR forense.",
  keywords: [
    'consenso informato',
    'consenso informato digitale',
    'consenso informato AI',
    'L. 219/2017',
    'eIDAS firma elettronica',
    'PDF/A-3b sanità',
    'FHIR Consent',
    'medicina estetica',
  ],
}

const PIPELINE_STEPS = [
  {
    icon: ListChecks,
    title: 'Scegli la procedura',
    body:
      "Catalogo di 30 procedure (5 modelli Fibonacci pronti + 25 generabili via AI) coprenti medicina estetica, chirurgia plastica, dermatologia, follow-up. Puoi anche partire da bianco con descrizione libera.",
  },
  {
    icon: Cpu,
    title: "L'AI compone le 8 sezioni",
    body:
      "Mistral Medium 3.1 (UE) genera identificazione paziente, descrizione clinica, benefici attesi, rischi documentati, alternative terapeutiche, conseguenze rifiuto, dichiarazione comprensione, firma. Citazioni norme inline.",
  },
  {
    icon: ShieldCheck,
    title: 'Validators anti-allucinazione',
    body:
      "Tre strati: blacklist termini vietati (copyright + claim ingannevoli), citation-check normativo, confidence scoring per sezione. Se overall < 0.7 il sistema marca review_obbligatoria=true.",
  },
  {
    icon: FileCheck2,
    title: 'Review medica + firma paziente',
    body:
      "Wizard a 4 step: il medico deve spuntare ciascuna delle 8 sezioni prima di poter salvare. Firma OTP del paziente, PDF/A-3b conservazione decennale, AuditEvent FHIR immutabile.",
  },
] as const

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Library 72 clausole PA italiane',
    body:
      "Estratte da 5 fonti pubbliche: Regione Lazio 2022 (autorevolezza alta), Regione Lombardia, ASL Alessandria, AO Cosenza, Emilia-Romagna anestesia. Atti PA = pubblico dominio per L. 633/1941 art. 5. Categorizzate per principio-fondamentale, informazione, sottoscrizione, revoca, rifiuto, minori, emergenza, GDPR, responsabilità, DAT.",
    badge: 'RAG-anchored',
  },
  {
    icon: ShieldCheck,
    title: 'Triplo strato anti-allucinazione',
    body:
      "Validator #1: blacklist termini protetti da copyright (es. SICPRE, Consavio, ConsensoSicuro) + claim ingannevoli (risultato garantito, 100% sicuro, nessuna complicanza). Validator #2: ricerca pattern citazione norme (L. 219, Cassazione, GDPR). Validator #3: confidence per sezione 0-1 + soglia review.",
    badge: '3 validators',
  },
  {
    icon: Scale,
    title: 'Confidence scoring trasparente',
    body:
      "Ogni sezione ottiene punteggio basato su lunghezza, presenza citazioni, clausole PA referenziate. Sotto 0.7 → review_obbligatoria=true bloccando il salvataggio. La sezione 5 (sottoscrizione) richiede sempre review manuale a prescindere dal punteggio.",
    badge: 'Per-section',
  },
  {
    icon: Activity,
    title: 'Audit FHIR + AuditEvent immutabile',
    body:
      "Ogni generazione AI e firma producono AuditEvent FHIR R4 con purposeOfEvent, agent, source e outcome. Conservazione separata dai dati clinici, ricerca forense con SearchControl Medplum. Tracciabilità ai sensi del GDPR art. 30.",
    badge: 'FHIR R4',
  },
  {
    icon: FileSignature,
    title: 'Firma eIDAS + PDF/A-3b',
    body:
      "Firma elettronica avanzata via OTP paziente con valore legale equiparato all'autografa per Reg. UE 910/2014. Output PDF/A-3b (ISO 19005-3) con file XML embedded per validazione long-term archive: conservazione decennale per CAD art. 44.",
    badge: 'eIDAS',
  },
  {
    icon: Sparkles,
    title: 'Integrato in EMR completo',
    body:
      "Il consenso non vive in silos: è collegato al Patient FHIR, alla Practitioner che lo ha firmato, all'Encounter del trattamento, alla DocumentReference Binary del PDF firmato. AccessPolicy multi-tenant Medplum, isolamento per studio.",
    badge: 'EMR-native',
  },
] as const

const COMPARISON = [
  {
    feature: 'Generazione AI procedure-specifica',
    fib: { ok: true, note: '30 procedure, Mistral Medium 3.1' },
    cs: { ok: false, note: 'Solo 150+ template fissi' },
    co: { ok: 'partial', note: 'Promessa "AI integrata" non dimostrata' },
  },
  {
    feature: 'Library legale verificabile (RAG)',
    fib: { ok: true, note: '72 clausole PA con citazione fonte' },
    cs: { ok: false, note: 'Modelli proprietari opachi' },
    co: { ok: false, note: 'Template chiusi' },
  },
  {
    feature: 'Anti-allucinazione (validators)',
    fib: { ok: true, note: '3 strati: blacklist + citation + confidence' },
    cs: { ok: false, note: 'Non applicabile (no AI)' },
    co: { ok: false, note: 'Nessun controllo dichiarato' },
  },
  {
    feature: 'Confidence score per sezione',
    fib: { ok: true, note: 'Punteggio 0-1 + review_obbligatoria' },
    cs: { ok: false, note: 'No' },
    co: { ok: false, note: 'No' },
  },
  {
    feature: 'Firma elettronica eIDAS',
    fib: { ok: true, note: 'OTP paziente, FEA con valore legale' },
    cs: { ok: true, note: 'OTP paziente' },
    co: { ok: true, note: 'Firma elettronica generica' },
  },
  {
    feature: 'Output PDF/A-3b conservazione',
    fib: { ok: true, note: 'PDF/A-3b ISO 19005-3, XML embedded' },
    cs: { ok: 'partial', note: 'Archivio cifrato, formato non specificato' },
    co: { ok: 'partial', note: 'Conservazione illimitata, formato N/D' },
  },
  {
    feature: 'Audit FHIR R4 (forense)',
    fib: { ok: true, note: 'AuditEvent immutabile per ogni azione' },
    cs: { ok: false, note: 'Non FHIR' },
    co: { ok: false, note: 'Non FHIR' },
  },
  {
    feature: 'Integrazione EMR completo',
    fib: { ok: true, note: 'Patient + Encounter + Consent collegati' },
    cs: { ok: false, note: 'Standalone, no EMR' },
    co: { ok: false, note: 'Standalone, no EMR' },
  },
  {
    feature: 'Invio paziente WhatsApp/SMS',
    fib: { ok: 'partial', note: 'SMS reminder già attivo, link consenso roadmap' },
    cs: { ok: true, note: 'Invio WhatsApp/SMS' },
    co: { ok: false, note: 'Non dichiarato' },
  },
  {
    feature: 'Quiz comprensione paziente',
    fib: { ok: 'partial', note: 'Roadmap Sprint successivo' },
    cs: { ok: false, note: 'No' },
    co: { ok: 'partial', note: '"Validazione comprensione" in sviluppo' },
  },
] as const

const NORMATIVE_REFS = [
  {
    label: 'L. 219/2017 art. 1',
    body:
      "Norme in materia di consenso informato e disposizioni anticipate di trattamento. Stabilisce diritto all'autodeterminazione del paziente, forma scritta o videoregistrazione obbligatoria, revocabilità in qualsiasi momento.",
  },
  {
    label: 'Cassazione 26104/2022',
    body:
      "Onere della prova del consenso informato a carico del medico. Generico riferimento all'aver informato il paziente non basta: la prova deve essere documentale, sezione per sezione, secondo i 5 elementi (diagnosi, benefici, rischi, alternative, conseguenze rifiuto).",
  },
  {
    label: 'GDPR art. 9 + art. 30',
    body:
      "Trattamento dati sanitari richiede consenso esplicito o altra base giuridica. Registro delle attività di trattamento obbligatorio. Fibonacci traccia ogni accesso al consenso in AuditEvent FHIR conforme art. 30 GDPR.",
  },
  {
    label: 'Reg. UE 910/2014 (eIDAS)',
    body:
      "Firma elettronica avanzata (FEA) basata su OTP riconosciuta in tutta UE con valore legale equiparato all'autografa secondo art. 26. Fibonacci usa FEA OTP del paziente per la firma del consenso.",
  },
  {
    label: 'L. 633/1941 art. 5',
    body:
      "Le opere della Pubblica Amministrazione (delibere regionali, atti ASL, linee guida Ministeriali) sono nel pubblico dominio. Fibonacci attinge a 5 fonti PA italiane per la library di clausole, evitando il copyright privato di template come SICPRE/Consavio/ConsensoSicuro.",
  },
  {
    label: 'CAD art. 44 + ISO 19005-3',
    body:
      "Conservazione documenti informatici a norma per 10 anni minimo. PDF/A-3b è lo standard ISO 19005-3 con file XML embedded per long-term archive. Fibonacci genera ogni consenso firmato in questo formato.",
  },
] as const

function StatusCell({ value }: { value: { ok: true | false | 'partial'; note: string } }) {
  if (value.ok === true)
    return (
      <div className="flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#16a34a' }} />
        <span style={{ color: 'var(--fg)' }}>{value.note}</span>
      </div>
    )
  if (value.ok === 'partial')
    return (
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#d97706' }} />
        <span style={{ color: 'var(--muted)' }}>{value.note}</span>
      </div>
    )
  return (
    <div className="flex items-start gap-2">
      <XCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#dc2626' }} />
      <span style={{ color: 'var(--muted)' }}>{value.note}</span>
    </div>
  )
}

export default function ConsensiInformatiPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
          <FibonacciPattern size={680} opacity={0.05} align="top-right" color="#7d6638" />
          <div className="max-w-5xl mx-auto px-6 relative">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
              style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
            >
              <FileSignature className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              Modulo Consensi Fibonacci
            </div>
            <h1
              className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold mb-6 break-words"
              style={{ color: 'var(--fg)' }}
            >
              Consensi informati generati dall&apos;AI,<br className="hidden md:block" />{' '}
              ancorati alla norma italiana.
            </h1>
            <p className="text-lg max-w-3xl mb-8" style={{ color: 'var(--muted)' }}>
              Fibonacci genera consensi conformi L. 219/2017 partendo da una
              library di 72 clausole estratte da fonti PA italiane. Tre strati di
              validators anti-allucinazione, confidence scoring per sezione, audit
              FHIR forense, firma eIDAS PDF/A-3b. Nessun template SICPRE, nessuna
              promessa AI vaporware, nessuna allucinazione passata in silenzio.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--fg)' }}
              >
                <Sparkles className="w-4 h-4" />
                Prova il Wizard Consensi in demo live
              </a>
              <Link
                href="#confronto"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
                style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
              >
                Confronto vs ConsensoSicuro / Consavio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="py-20" style={{ background: 'var(--card)' }} id="come-funziona">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2
                className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4"
                style={{ color: 'var(--fg)' }}
              >
                Come funziona la generazione
              </h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                Pipeline a 4 step. Il medico resta sempre al centro: l&apos;AI
                propone, il medico spunta sezione per sezione, il paziente firma.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PIPELINE_STEPS.map((step, idx) => (
                <div
                  key={step.title}
                  className="p-6 rounded-2xl relative"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--accent-light)' }}
                    >
                      <step.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    </div>
                    <span
                      className="font-[var(--font-playfair)] text-2xl font-bold"
                      style={{ color: 'var(--accent)' }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fg)' }}>
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

        {/* Features */}
        <section className="py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2
                className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4"
                style={{ color: 'var(--fg)' }}
              >
                6 capacità che nessun competitor dichiara
              </h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                Library legale verificabile, validators che impediscono di
                salvare consensi sotto la soglia di confidenza, audit FHIR
                immutabile. Tutto sopra l&apos;EMR Fibonacci esistente.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
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
                      className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--bg)', color: 'var(--muted)' }}
                    >
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Confronto */}
        <section className="py-20" style={{ background: 'var(--card)' }} id="confronto">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2
                className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4"
                style={{ color: 'var(--fg)' }}
              >
                Fibonacci vs ConsensoSicuro vs Consavio
              </h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                Confronto basato sulle informazioni pubbliche dichiarate sui siti
                ufficiali dei due competitor. Fonti analizzate: consensosicuro.it
                e consavio.com (maggio 2026).
              </p>
            </div>

            <div
              className="overflow-x-auto rounded-2xl"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--fg)' }}>
                      Capacità
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--accent)' }}>
                      Fibonacci
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--muted)' }}>
                      ConsensoSicuro
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--muted)' }}>
                      Consavio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="p-4 align-top font-medium" style={{ color: 'var(--fg)' }}>
                        {row.feature}
                      </td>
                      <td className="p-4 align-top text-xs">
                        <StatusCell value={row.fib} />
                      </td>
                      <td className="p-4 align-top text-xs">
                        <StatusCell value={row.cs} />
                      </td>
                      <td className="p-4 align-top text-xs">
                        <StatusCell value={row.co} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-4 text-center" style={{ color: 'var(--muted)' }}>
              ✅ Dichiarato e funzionante · ⚠️ Parziale o roadmap · ❌ Non
              dichiarato. Fonti competitor verificate il{' '}
              {new Intl.DateTimeFormat('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(new Date('2026-05-23'))}
              .
            </p>
          </div>
        </section>

        {/* Norme citate */}
        <section className="py-20" style={{ background: 'var(--bg)' }} id="norme">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2
                className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4"
                style={{ color: 'var(--fg)' }}
              >
                Le norme su cui poggia il modulo
              </h2>
              <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                Ogni consenso generato cita queste fonti inline, sezione per
                sezione. Il medico vede sempre da quale articolo deriva
                l&apos;obbligo informativo.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {NORMATIVE_REFS.map((ref) => (
                <div
                  key={ref.label}
                  className="p-5 rounded-2xl"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold mb-3"
                    style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
                  >
                    {ref.label}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {ref.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA finale */}
        <section className="py-24" style={{ background: 'var(--card)' }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--fg)' }}
            >
              Pronto a generare il primo consenso?
            </h2>
            <p className="text-base mb-8" style={{ color: 'var(--muted)' }}>
              Apri la demo live, scegli una procedura dal catalogo, lascia che
              l&apos;AI componga 8 sezioni e validi le sue stesse uscite. Il
              risultato è un PDF/A-3b pronto da firmare con OTP.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'var(--fg)' }}
              >
                <Sparkles className="w-4 h-4" />
                Apri demo live Fibonacci
              </a>
              <Link
                href="/#prezzi"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
                style={{ color: 'var(--fg)', border: '1.5px solid var(--border)' }}
              >
                Vedi piani e prezzi
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs mt-6" style={{ color: 'var(--muted)' }}>
              I modelli di consenso sono in versione 0.1 (bozza interna):
              richiedono validazione legale finale dello studio prima
              dell&apos;uso con pazienti reali. Fibonacci fornisce
              l&apos;infrastruttura tecnica, non sostituisce il parere legale.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
