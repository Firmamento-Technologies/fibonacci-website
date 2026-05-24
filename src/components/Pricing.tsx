import { Check, ArrowRight, Sparkles } from 'lucide-react'

interface Plan {
  name: string
  priceAnnual: number    // €/mese se pagato annualmente
  priceMonthly: number   // €/mese se pagato mensilmente
  description: string
  providers: string
  features: readonly string[]
  cta: string
  highlighted: boolean
  enterprise?: boolean
}

const PLANS: readonly Plan[] = [
  {
    name: 'Solo Pro',
    priceAnnual: 149,
    priceMonthly: 179,
    description: 'Medico singolo, studio mono-operatore',
    providers: '1 medico + 1 segretaria',
    features: [
      'Cartella clinica FHIR R4 completa',
      'Body map 2D + foto cliniche AES-256',
      '115 modelli consenso PubMed-verified',
      'Wizard AI consensi (10 generazioni/mese)',
      'Catalogo farmaci AIFA + off-label',
      'Firma OTP paziente + medico eIDAS',
      'PDF/A-3b conservazione decennale',
      'Esportazione GDPR art. 20',
      'MFA TOTP + AccessPolicy',
      'Storage 50 GB · Support email 48h',
    ],
    cta: 'Inizia 14 giorni gratis',
    highlighted: false,
  },
  {
    name: 'Studio',
    priceAnnual: 349,
    priceMonthly: 419,
    description: 'Studio multi-operatore, 2-5 medici',
    providers: '3 provider inclusi (+69 €/mese extra, max 5)',
    features: [
      'Tutto di Solo Pro, più:',
      '✨ AI dettatura Voxtral 24B illimitata',
      '✨ Apply-to-form con confidence score',
      '✨ Chatbot in-app context-aware',
      'Wizard AI consensi illimitato',
      'Anatomia 3D Z-Anatomy multi-sistema',
      'Agenda multi-operatore drag&drop',
      'Reminder SMS (richiede MessageBird)',
      'Audit log immutabile hash-chain',
      'Onboarding white-glove guidato',
      'Storage 200 GB · Support chat 24h',
    ],
    cta: 'Inizia 14 giorni gratis',
    highlighted: true,
  },
  {
    name: 'Clinica',
    priceAnnual: 749,
    priceMonthly: 899,
    description: 'Clinica strutturata, 5-10 operatori, multi-sede',
    providers: '6 provider inclusi (+59 €/mese extra, max 15)',
    features: [
      'Tutto di Studio, più:',
      'Multi-sede fino a 3 location isolate',
      '🛡️ DPO virtuale incluso (review GDPR + audit annuale)',
      'Template consenso custom per clinica',
      'Branding clinica su PDF + portale paziente',
      'Analytics avanzate (KPI, churn, redditività)',
      'Account manager dedicato',
      'SLA support 8h business + escalation phone',
      'Storage 1 TB',
      'Training operatori in sede (1 gg/anno)',
    ],
    cta: 'Richiedi preventivo',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    priceAnnual: 1999,
    priceMonthly: 1999,
    description: 'Network, chains, gruppi medici (10+ sedi)',
    providers: 'Provider e sedi illimitati',
    features: [
      'Tutto di Clinica, più:',
      'Tenant dedicato isolato (no shared infra)',
      'Customer Success Manager dedicato',
      'SLA 99.95% uptime + 4h emergency',
      'Integrazioni custom (contabilità, payments)',
      'API white-label per portale paziente',
      'Audit clinico personalizzato semestrale',
      'Training in sede illimitato',
      'Provider 39-49 €/mese (volume discount)',
      'Da preventivo, partendo da 1.999 €/mese',
    ],
    cta: 'Parliamone',
    highlighted: false,
    enterprise: true,
  },
] as const

export function Pricing() {
  return (
    <section className="py-24" style={{ background: 'var(--card)' }} id="prezzi">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
            Prezzi
          </p>
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
            Pricing pensato per chi fa medicina seria
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Quanto vale evitare <strong style={{ color: 'var(--fg)' }}>una</strong> causa per consenso informato?
            <br />Cassazione 26104/2022 documenta risarcimenti da 50.000 a 700.000 € per vizio del consenso.
            <br />Fibonacci Studio costa <strong style={{ color: 'var(--accent)' }}>4.188 €/anno</strong>. Il calcolo lo lasciamo a te.
          </p>
        </div>

        <div className="flex justify-center mb-12 mt-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{ background: 'var(--accent-light)', color: 'var(--fg)' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            Programma Fondatori: primi 50 studi → sconto 30% grandfathered perpetuo. Scrivici per candidarti.
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-7 flex flex-col gap-5 relative transition-transform duration-300 hover:-translate-y-1`}
              style={
                plan.highlighted
                  ? { background: 'var(--fg)', border: 'none' }
                  : {
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                    }
              }
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white whitespace-nowrap"
                  style={{ background: 'var(--accent)' }}
                >
                  PIÙ POPOLARE
                </div>
              )}
              {plan.enterprise && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
                  style={{ background: 'var(--accent-light)', color: 'var(--fg)', border: '1px solid var(--accent)' }}
                >
                  CUSTOM
                </div>
              )}

              <div>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5">
                  <span
                    className="font-[var(--font-playfair)] text-4xl font-bold"
                    style={{ color: plan.highlighted ? 'white' : 'var(--fg)' }}
                  >
                    €{plan.priceAnnual}
                  </span>
                  <span
                    className="text-xs mb-1.5"
                    style={{
                      color: plan.highlighted ? 'rgba(255,255,255,0.5)' : 'var(--muted)',
                    }}
                  >
                    /mese
                  </span>
                </div>
                {!plan.enterprise && (
                  <p
                    className="text-[11px] mt-0.5"
                    style={{
                      color: plan.highlighted ? 'rgba(255,255,255,0.5)' : 'var(--muted)',
                    }}
                  >
                    fatturato annualmente · <span style={{ color: plan.highlighted ? 'var(--accent)' : 'var(--accent)' }}>risparmio 17%</span>
                    <br />
                    €{plan.priceMonthly}/mese fatturato mensilmente
                  </p>
                )}
                {plan.enterprise && (
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: 'var(--muted)' }}
                  >
                    a partire da · preventivo personalizzato
                  </p>
                )}
                <p
                  className="text-xs mt-3 leading-snug font-medium"
                  style={{ color: plan.highlighted ? 'rgba(255,255,255,0.8)' : 'var(--fg)' }}
                >
                  {plan.description}
                </p>
                <p
                  className="text-[10px] mt-1 uppercase tracking-wider"
                  style={{ color: plan.highlighted ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}
                >
                  {plan.providers}
                </p>
              </div>

              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className="w-3.5 h-3.5 shrink-0 mt-0.5"
                      style={{ color: 'var(--accent)' }}
                    />
                    <span
                      className="text-xs leading-snug"
                      style={{
                        color: plan.highlighted ? 'rgba(255,255,255,0.85)' : 'var(--fg)',
                      }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/#demo"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: plan.highlighted ? 'var(--accent)' : 'var(--fg)',
                  color: 'white',
                }}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div
            className="p-5 rounded-xl text-center"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <p className="font-[var(--font-playfair)] text-2xl font-bold" style={{ color: 'var(--fg)' }}>14 giorni</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>di trial gratuito, senza carta di credito</p>
          </div>
          <div
            className="p-5 rounded-xl text-center"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <p className="font-[var(--font-playfair)] text-2xl font-bold" style={{ color: 'var(--fg)' }}>90 giorni</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>money-back guarantee sui piani annuali</p>
          </div>
          <div
            className="p-5 rounded-xl text-center"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <p className="font-[var(--font-playfair)] text-2xl font-bold" style={{ color: 'var(--fg)' }}>100%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>deducibile come spesa professionale</p>
          </div>
        </div>

        <p className="text-center text-xs mt-8" style={{ color: 'var(--muted)' }}>
          Tutti i prezzi IVA esclusa · Fattura elettronica italiana inclusa · Disdici quando vuoi
        </p>
      </div>
    </section>
  )
}
