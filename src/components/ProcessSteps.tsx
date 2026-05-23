import Image from 'next/image'
import { UserPlus, Mic, FileSignature, BarChart3 } from 'lucide-react'
import { APP_SCREENSHOTS } from '@/lib/asset-path'

const STEPS = [
  {
    icon: UserPlus,
    title: 'Registra il paziente',
    body:
      'Anagrafica completa in meno di un minuto. Codice fiscale, contatti, foto profilo. La pratica è creata e indicizzata FHIR R4 dal primo dato inserito.',
    detail: 'tempo medio 45 secondi',
    photo: APP_SCREENSHOTS.pazientiList,
    photoAlt: 'Schermata Pazienti di Fibonacci con elenco anagrafiche e ricerca per cognome',
  },
  {
    icon: Mic,
    title: 'Compila l\'anamnesi con la voce',
    body:
      'Parli durante la visita, la cartella si compila in tempo reale. Voxtral trascrive ed estrae i campi strutturati. Apply-to-form con confidence score per ogni campo.',
    detail: 'parli, lui scrive',
    photo: APP_SCREENSHOTS.pazienteDetail,
    photoAlt: 'Schermata dettaglio paziente di Fibonacci con anamnesi e dettatura AI',
  },
  {
    icon: FileSignature,
    title: 'Documenta visita e genera consenso',
    body:
      'Body map 2D per le aree trattate, catalogo farmaci AIFA per i prodotti, foto cliniche cifrate AES-256. Consenso informato generato in PDF e firmato digitalmente.',
    detail: '115 modelli consenso pronti',
    photo: APP_SCREENSHOTS.consensiCatalog,
    photoAlt: 'Catalogo Consensi Fibonacci con 115 modelli pronti suddivisi per categoria',
  },
  {
    icon: BarChart3,
    title: 'Storico e follow-up',
    body:
      'Timeline paziente, audit log immutabile FHIR, agenda per i richiami. Export ZIP FHIR R4 in qualsiasi momento, portabilità garantita ex art. 20 GDPR.',
    detail: 'audit log immutabile',
    photo: APP_SCREENSHOTS.auditLog,
    photoAlt: 'Audit log FHIR Fibonacci con cronologia immutabile delle azioni',
  },
] as const

export function ProcessSteps() {
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }} id="come-funziona">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Come funziona
          </p>
          <h2
            className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--fg)' }}
          >
            Dalla prima visita alla cartella completata in 4 passi
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Un flusso pensato per il lavoro reale del medico, non per i database di chi l&apos;ha costruito.
          </p>
        </div>

        <div className="relative">
          {/* Linea connettiva verticale solo su desktop */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'var(--border)' }}
          />

          <div className="flex flex-col gap-12 md:gap-16">
            {STEPS.map((step, idx) => {
              const isEven = idx % 2 === 1
              return (
                <div
                  key={step.title}
                  className="relative grid md:grid-cols-2 gap-6 md:gap-12 items-center"
                >
                  {/* Numero a cerchio sulla linea */}
                  <div
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center text-sm font-bold z-10"
                    style={{
                      background: 'var(--fg)',
                      color: 'white',
                      border: '4px solid var(--bg)',
                    }}
                  >
                    {idx + 1}
                  </div>

                  {/* Card contenuto */}
                  <div
                    className={`p-6 rounded-2xl ${isEven ? 'md:col-start-2' : 'md:col-start-1'}`}
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'var(--fg)', color: 'white' }}
                      >
                        {idx + 1}
                      </div>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--accent-light)' }}
                      >
                        <step.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                      </div>
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--muted)' }}
                      >
                        {step.detail}
                      </span>
                    </div>
                    <h3
                      className="font-[var(--font-playfair)] text-xl font-bold mb-2"
                      style={{ color: 'var(--fg)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {step.body}
                    </p>
                  </div>

                  {/* Foto contestuale dal lato opposto su desktop */}
                  <div
                    className={`hidden md:block relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] ${isEven ? 'md:col-start-1 md:row-start-1' : 'md:col-start-2'}`}
                    style={{ border: '1px solid var(--border)' }}
                  >
                    <Image
                      src={step.photo}
                      alt={step.photoAlt}
                      fill
                      unoptimized
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
