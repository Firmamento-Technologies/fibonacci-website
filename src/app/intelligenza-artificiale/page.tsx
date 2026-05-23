import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Mic,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Check,
  AlertCircle,
  Lock,
  FileSignature,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Intelligenza Artificiale',
  description:
    'Come Fibonacci usa l\'AI per la cartella clinica: Voxtral dettatura real-time, apply-to-form con confidence score, chatbot clinico. AI responsabile, mai automatica, sempre validata dal medico.',
  alternates: { canonical: '/intelligenza-artificiale' },
}

const CAPABILITIES = [
  {
    icon: Mic,
    title: 'Dettatura clinica con Voxtral 24B',
    paragraphs: [
      'Voxtral è il modello speech-to-text di Mistral AI, ottimizzato per il dominio clinico. Trascrive l\'italiano medico con accuratezza 95-98% nelle nostre prove interne, gestendo termini tecnici, posologie, sigle diagnostiche.',
      'Il flusso è real-time: mentre parli, le parole appaiono nello schermo. Le partial appaiono in grigio (riconoscimento in corso), le final in nero (consolidate). Lo stop è automatico dopo 8 secondi di silenzio, oppure manuale.',
      'L\'audio non viene mai persistito: solo testo trascritto, e solo se confermi il salvataggio. Mistral non utilizza i tuoi input per addestrare i modelli (verificato a contratto).',
    ],
    detail: 'Provider: Mistral AI SAS, Parigi (UE) - Sub-responsabile DPA art. 28',
  },
  {
    icon: Sparkles,
    title: 'Apply-to-form con confidence score',
    paragraphs: [
      'Dopo la trascrizione, un secondo passaggio AI estrae i campi strutturati: allergie, farmaci in uso, patologie pregresse, familiarità, stile di vita. Per ogni campo viene mostrato un punteggio di confidenza.',
      'Verde (>80%): l\'AI è fiduciosa. Giallo (50-80%): rivedi prima di accettare. Rosso (<50%): probabilmente serve correzione manuale. Il colore guida il tuo occhio sui campi che richiedono attenzione.',
      'Niente viene salvato in cartella senza un click esplicito di approvazione del medico. Il pattern è "AI propone, medico dispone": riduci il tempo di compilazione del 60-70% senza cedere la responsabilità clinica.',
    ],
    detail: 'Endpoint: /api/clinical-extract - Funzione interna LLM',
  },
  {
    icon: MessageCircle,
    title: 'Chatbot clinico in-app',
    paragraphs: [
      'Il widget "Chiedi all\'AI" in basso a destra di ogni pagina risponde a domande in linguaggio naturale, con context sul paziente correntemente aperto: "ha allergie note?", "quali trattamenti negli ultimi 6 mesi?", "ultimo PHQ-9 era a quanto?".',
      'Per le query sui workflow Fibonacci: "come inserisco un consenso SICPRE?", "dove vedo l\'audit log?". Il chatbot conosce la documentazione, accelera l\'onboarding senza chiamare il supporto.',
      'Per la dettatura: chiamando il chatbot via microfono, parla a voce e ricevi una risposta testuale. Utile durante la visita per query veloci che richiederebbero di staccarti dal paziente.',
    ],
    detail: 'Context-aware LLM su FHIR + docs index',
  },
  {
    icon: ShieldCheck,
    title: 'AI responsabile - clausola RF-5.4',
    paragraphs: [
      'La conformità RF-5.4 del nostro spec interno garantisce tre livelli di responsabilità AI:',
      'Livello 1 - UI: ogni output AI è visualizzato come "proposta" rivedibile, mai come "fatto compiuto". Il medico vede sempre il source: trascrizione audio, confidence, alternativa.',
      'Livello 2 - Backend: ogni call AI è loggata come AuditEvent FHIR con timestamp, modello, confidence, decisione del medico (accettato / modificato / rifiutato). Retention 10 anni.',
      'Livello 3 - Contrattuale: bozza clausola nei Termini di Servizio chiarisce che Fibonacci è uno strumento di supporto, non dispositivo medico MDR (Reg. UE 2017/745). La responsabilità clinica e diagnostica resta del medico.',
    ],
    detail: 'Doc tecnica: docs/RF_5_4_VALIDAZIONE_OUTPUT_AI.md',
  },
] as const

const COMMITMENTS = [
  {
    icon: Lock,
    title: 'Audio mai persistito',
    body: 'Il tuo audio passa solo nella finestra di trascrizione live. Non viene salvato né da Fibonacci né da Mistral.',
  },
  {
    icon: ShieldCheck,
    title: 'Modelli in UE',
    body: 'Mistral è francese, server in UE. Nessun dato sanitario lascia l\'Unione Europea via AI.',
  },
  {
    icon: Check,
    title: 'Opt-out training',
    body: 'Verifichiamo contrattualmente che gli input clinici non vengano usati per addestrare i modelli.',
  },
  {
    icon: AlertCircle,
    title: 'Trasparenza errori',
    body: 'Confidence score sempre visibile. Quando l\'AI sbaglia, il medico lo vede prima di approvare.',
  },
  {
    icon: FileSignature,
    title: 'Audit log immutabile',
    body: 'Ogni decisione AI (accetta/modifica/rifiuta) è tracciata in hash-chain FHIR per 10 anni.',
  },
  {
    icon: Sparkles,
    title: 'Modelli aggiornati',
    body: 'Quando esce un modello migliore (es. Voxtral v2) lo aggiorniamo dopo validazione interna.',
  },
] as const

export default function IntelligenzaArtificialePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16" style={{ background: 'var(--bg)' }}>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 50% 0%, var(--accent-light) 0%, transparent 65%)',
            }}
          />
          <div className="relative max-w-4xl mx-auto px-6 py-20 lg:py-28 text-center">
            <div
              className="flex items-center gap-2 text-xs font-medium mb-3 justify-center"
              style={{ color: 'var(--muted)' }}
            >
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--fg)' }}>Intelligenza Artificiale</span>
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              Intelligenza Artificiale
            </div>
            <h1
              className="font-[var(--font-playfair)] text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-6 break-words"
              style={{ color: 'var(--fg)' }}
            >
              L&apos;AI che scrive con te, non al posto tuo
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: 'var(--muted)' }}
            >
              Fibonacci integra modelli di intelligenza artificiale per accelerare la
              documentazione clinica. Il medico parla, l&apos;AI struttura, il medico valida.
              Nessuna decisione clinica automatica, nessuna persistenza senza approvazione,
              tutto tracciato in audit log.
            </p>
          </div>
        </section>

        {/* 4 capabilities */}
        <section className="py-16" style={{ background: 'var(--card)' }}>
          <div className="max-w-4xl mx-auto px-6 flex flex-col gap-16">
            {CAPABILITIES.map((cap, idx) => (
              <div key={cap.title} className="grid md:grid-cols-[80px_1fr] gap-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--accent-light)' }}
                >
                  <cap.icon className="w-7 h-7" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--accent)' }}
                  >
                    Capacità {idx + 1} di {CAPABILITIES.length}
                  </p>
                  <h2
                    className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-4 leading-tight"
                    style={{ color: 'var(--fg)' }}
                  >
                    {cap.title}
                  </h2>
                  <div className="flex flex-col gap-4 mb-4">
                    {cap.paragraphs.map((p, i) => (
                      <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--fg)' }}>
                        {p}
                      </p>
                    ))}
                  </div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                  >
                    {cap.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* I nostri impegni AI */}
        <section className="py-20" style={{ background: 'var(--bg)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--accent)' }}
              >
                I nostri impegni
              </p>
              <h2
                className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold"
                style={{ color: 'var(--fg)' }}
              >
                Sei cose a cui non transigiamo sull&apos;AI
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {COMMITMENTS.map((c) => (
                <div
                  key={c.title}
                  className="p-5 rounded-2xl"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <c.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                    {c.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cosa non fa l'AI */}
        <section className="py-20" style={{ background: 'var(--card)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--accent)' }}
            >
              Trasparenza
            </p>
            <h2
              className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-6 leading-tight"
              style={{ color: 'var(--fg)' }}
            >
              Cosa l&apos;AI di Fibonacci NON fa
            </h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: 'var(--fg)' }}>
              <p>
                <strong>Non emette diagnosi.</strong> Nessun output AI dice "questo paziente
                ha X". L&apos;AI trascrive, struttura, suggerisce template, ma la diagnosi
                è atto medico esclusivo del professionista.
              </p>
              <p>
                <strong>Non prescrive farmaci automaticamente.</strong> L&apos;AI può aiutarti
                a compilare il campo farmaco, ma la prescrizione richiede sempre firma del
                medico abilitato.
              </p>
              <p>
                <strong>Non comunica con il paziente in autonomia.</strong> Nessun messaggio
                viene inviato al paziente senza approvazione esplicita del medico. Il chatbot
                in-app è uno strumento per il medico, non per il paziente.
              </p>
              <p>
                <strong>Non sostituisce il giudizio clinico.</strong> Quando confidence è
                bassa, l&apos;AI lo dichiara visivamente. Quando un caso è atipico, l&apos;AI
                tace o segnala l&apos;incertezza. Il medico decide sempre.
              </p>
              <p>
                <strong>Non usa i tuoi dati per addestrare modelli.</strong> Verifichiamo
                contrattualmente con Mistral l&apos;opt-out training. Audio mai persistito,
                testo strutturato mai esfiltrato.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance RF-5.4 link */}
        <section className="py-16" style={{ background: 'var(--bg)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <div
              className="p-6 rounded-2xl flex items-start gap-4"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-light)' }}
              >
                <ShieldCheck className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                  Vuoi i dettagli tecnici della compliance AI?
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
                  La nostra spec interna RF-5.4 descrive nel dettaglio i 3 livelli di
                  enforcement (UI, backend, contrattuale), il pattern audit AuditEvent
                  FHIR ai-output-*, la procedura di incident clinico, e il posizionamento
                  rispetto a MDR (Reg. UE 2017/745) e AI Act.
                </p>
                <Link
                  href="/sicurezza"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75"
                  style={{ color: 'var(--accent)' }}
                >
                  Leggi la scheda Sicurezza
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{ background: 'var(--fg)' }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white mb-4">
              Provala in 30 minuti
            </h2>
            <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Una demo personalizzata con i tuoi workflow reali. Ti facciamo vedere
              la dettatura AI in azione, dalla voce alla cartella firmata.
            </p>
            <Link
              href="/#demo"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#f0d27a', color: 'var(--fg)' }}
            >
              Richiedi demo gratuita
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
