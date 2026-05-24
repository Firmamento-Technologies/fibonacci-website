import type { Metadata } from 'next'
import {
  ShieldCheck,
  FileCheck2,
  Search,
  KeyRound,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { VerifierUpload } from './VerifierUpload'

export const metadata: Metadata = {
  title: 'Verifica firma consenso · Fibonacci',
  description:
    'Verifica la validità di un consenso informato firmato con Fibonacci EMR: firma elettronica eIDAS art. 26, timestamp PDF/A-3b, hash chain immutabile. Tool pubblico gratuito.',
  alternates: { canonical: '/verify' },
}

const VERIFY_STEPS = [
  {
    icon: FileCheck2,
    title: 'Carica il PDF del consenso',
    body:
      "Il tool legge i metadati embedded del PDF/A-3b (ISO 19005-3) e mostra le informazioni di firma. Nessun dato del paziente viene inviato a server esterni: l'analisi avviene nel tuo browser.",
  },
  {
    icon: Search,
    title: 'Analisi struttura PDF/A-3b',
    body:
      "Verifica che il documento sia conforme allo standard PDF/A-3b di conservazione decennale ai sensi del CAD art. 44. Estrazione dei metadati XMP embedded.",
  },
  {
    icon: KeyRound,
    title: 'Verifica firma elettronica',
    body:
      "Controllo della presenza di firma OTP eIDAS art. 26 (Reg. UE 910/2014). Visualizzazione degli estremi: studio firmatario, data e ora, paziente firmatario (iniziali), hash documento.",
  },
  {
    icon: ShieldCheck,
    title: 'Hash chain audit',
    body:
      "Per verifica forense più approfondita, l'hash del documento può essere confrontato con il registro AuditEvent FHIR conservato da Fibonacci (richiesta a supporto@fibonacci.it con motivazione legittima).",
  },
] as const

export default function VerifyPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <section className="pt-32 pb-12" style={{ background: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Tool pubblico gratuito · Nessuna registrazione
          </div>
          <h1
            className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--fg)' }}
          >
            Verifica la validità di un consenso firmato
          </h1>
          <p className="text-base max-w-2xl" style={{ color: 'var(--muted)' }}>
            Carica un PDF di consenso firmato con Fibonacci EMR. Il browser legge i metadati embedded
            (XMP + signature info) senza inviare nulla a server esterni.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <VerifierUpload />
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ color: 'var(--fg)' }}
          >
            Come funziona la verifica in 4 step
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {VERIFY_STEPS.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl p-6 flex flex-col gap-3"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                      Step {idx + 1}
                    </p>
                    <h3 className="font-[var(--font-playfair)] text-lg font-bold mb-2" style={{ color: 'var(--fg)' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--fg)' }}
          >
            Approfondimenti normativi
          </h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
            <p>
              <strong>eIDAS art. 26 (Reg. UE 910/2014):</strong> la firma elettronica avanzata via
              OTP del paziente è equiparata alla firma autografa per gli effetti di legge, purché
              soddisfi i quattro requisiti previsti: connessione univoca al firmatario, identificazione
              univoca, creazione con mezzi controllati esclusivamente dal firmatario, collegamento ai
              dati firmati che permetta di rilevare modifiche successive.
            </p>
            <p>
              <strong>L. 219/2017 (consenso informato e DAT):</strong> il consenso informato è
              obbligo autonomo del medico ai sensi degli artt. 1-5 della legge. La forma scritta è
              richiesta per trattamenti ad alto rischio o invasivi. Cassazione 26104/2022 conferma
              che la lesione del consenso configura danno autonomo all&apos;autodeterminazione
              (artt. 2, 13, 32 Cost.) indipendente dal danno alla salute.
            </p>
            <p>
              <strong>CAD art. 44 (Codice Amministrazione Digitale):</strong> la conservazione dei
              documenti digitali deve garantire integrità, leggibilità nel tempo, autenticità e
              riferimento temporale. PDF/A-3b (ISO 19005-3) è formato approvato per conservazione
              decennale di cartelle cliniche.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--card)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <h2
            className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold mb-3"
            style={{ color: 'var(--fg)' }}
          >
            Hai dubbi su un consenso ricevuto?
          </h2>
          <p className="text-base mb-6" style={{ color: 'var(--muted)' }}>
            Per richieste di verifica forense con accesso all&apos;hash chain dell&apos;AuditEvent
            FHIR (es. cause legali, contestazioni), scrivici a supporto@fibonacci.it con motivazione
            legittima. Rispondiamo entro 5 giorni lavorativi.
          </p>
          <a
            href="mailto:supporto@fibonacci.it?subject=Richiesta%20verifica%20forense%20consenso"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Richiedi verifica forense
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
