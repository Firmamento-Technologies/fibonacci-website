import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Award,
  TrendingUp,
  Scale,
  ShieldCheck,
  Banknote,
  HandshakeIcon,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Users,
  Receipt,
  FileText,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FibonacciPattern } from '@/components/FibonacciPattern'
import { PartnersCalculator } from './PartnersCalculator'

export const metadata: Metadata = {
  title: 'Programma Ambassador · Fibonacci',
  description:
    'Diventa Ambassador Fibonacci: guadagna fino al 40% del primo anno + 12% recurring per ogni studio medico che porti. Programma B2B compliant con codice deontologico FNOMCeO art. 56.',
  keywords: [
    'programma referral medici',
    'ambassador fibonacci',
    'affiliate program software medico',
    'guadagno passivo medici',
    'partnership EMR',
  ],
}

const TIERS = [
  {
    name: 'Cinco',
    level: 'Bronze',
    color: '#cd7f32',
    referrals: '1-3 studi attivi',
    oneTime: '25% MRR × 12',
    recurring: '5% MRR',
    example: '3 studi piano Studio → 3.143 € one-time + 628 €/anno passivo',
    bonus: '— ',
  },
  {
    name: 'Argento',
    level: 'Silver',
    color: '#c0c0c0',
    referrals: '4-9 studi attivi',
    oneTime: '30% MRR × 12',
    recurring: '8% MRR',
    example: '6 studi piano Studio → 7.535 € one-time + 2.010 €/anno passivo',
    bonus: 'Badge profilo + early access feature',
  },
  {
    name: 'Oro',
    level: 'Gold',
    color: '#d4a017',
    referrals: '10-24 studi attivi',
    oneTime: '35% MRR × 12',
    recurring: '10% MRR',
    example: '15 studi piano Studio → 21.987 € one-time + 6.282 €/anno passivo',
    bonus: 'Account manager dedicato + co-marketing case study',
  },
  {
    name: 'Platino',
    level: 'Platinum',
    color: '#a85b53',
    referrals: '25+ studi attivi',
    oneTime: '40% MRR × 12 + 1.000 € cash bonus',
    recurring: '12% MRR',
    example: '30 studi piano Studio → 50.256 € one-time + 15.077 €/anno passivo',
    bonus: 'Comitato consultivo prodotto + roadmap input + ticket evento',
  },
] as const

const HOW_IT_WORKS = [
  {
    icon: HandshakeIcon,
    title: 'Candidati al programma',
    body:
      "Compila il form di candidatura sotto. Verifichiamo iscrizione albo + ordine professionale + assenza conflitti deontologici. Approvazione entro 5 giorni lavorativi.",
  },
  {
    icon: FileText,
    title: 'Firma accordo Ambassador',
    body:
      "Contratto di intermediazione B2B (D.Lgs. 287/2007 art. 7) con clausole anti-frode, regole fiscali, riservatezza. P.IVA obbligatoria (o regime forfettario equivalente).",
  },
  {
    icon: Users,
    title: 'Condividi link tracciato',
    body:
      "Dashboard ambassador con link unico tracciato (UTM + cookie 90 gg). Funziona via email, LinkedIn, presentazioni a colleghi, articoli professionali, congressi.",
  },
  {
    icon: Receipt,
    title: 'Fattura mensile a Fibonacci',
    body:
      "Quando un referito sottoscrive piano pagante: dashboard ti mostra commissione attiva. Fattura elettronica a Fibonacci entro 60 gg dall'attivazione del referito (window anti-churn).",
  },
] as const

const COMPLIANCE_POINTS = [
  {
    icon: Scale,
    title: 'Conforme codice deontologico FNOMCeO art. 56',
    body:
      "Il programma è strettamente B2B: la commissione è legata alla vendita del software, NON a pazienti del medico Ambassador. Non rientra nel divieto di divisione onorari per procacciamento pazienti (art. 30). Equivalente a referral di un qualsiasi gestionale professionale.",
  },
  {
    icon: ShieldCheck,
    title: 'Trasparenza pubblicitaria L. 248/2006 (Bersani)',
    body:
      "Disclosure obbligatoria: l'Ambassador deve dichiarare la natura del rapporto economico quando promuove Fibonacci a colleghi. Forniamo template di disclosure per email, social, presentazioni.",
  },
  {
    icon: AlertTriangle,
    title: 'Anti-MLM strutturale',
    body:
      "Solo un livello di commissione (no commissioni su referral di referral). Massimo 50 referral attivi per Ambassador. Nessun investimento iniziale o quota di iscrizione. Niente piramide.",
  },
  {
    icon: Banknote,
    title: 'Fatturazione e ritenute fiscali',
    body:
      "Le commissioni sono reddito professionale ordinario, soggette ad IRPEF + IRAP regionale. Per professionisti in regime forfettario applichiamo ritenuta 26% sulla parte ricorrente. Mensilmente forniamo report pre-compilato per studio commercialista.",
  },
] as const

const ANTI_FRAUD = [
  'Referral riconosciuto SOLO se il referito attiva piano pagante dopo trial 14 gg',
  'Commissione liberata dopo 60 gg dall\'attivazione (window di churn)',
  'Riduzione 50% se referito disdice entro 6 mesi · annullamento totale se entro 3 mesi',
  'Massimo 50 referral attivi per Ambassador (no MLM, no piramide)',
  'No self-deal: vietato segnalare studi con stesso CF/P.IVA o entità collegate',
  'No second-tier: zero commissioni per referral di referral',
  'Audit Fibonacci ha diritto di verificare ogni referral su segnalazione di anomalie',
  'Risoluzione contratto in caso di violazione GDPR del referito o uso improprio dati pazienti',
] as const

const FAQ = [
  {
    q: 'Posso essere Ambassador anche senza essere cliente Fibonacci?',
    a: 'No. Il programma è riservato a clienti attivi su qualsiasi piano (Solo Pro / Studio / Clinica / Enterprise). Vogliamo che chi promuove Fibonacci lo usi quotidianamente e ne conosca i limiti reali. Il trial gratuito di 14 gg non basta — serve sottoscrizione attiva da almeno 60 gg.',
  },
  {
    q: 'Devo aprire P.IVA se non ne ho una?',
    a: "Le commissioni Ambassador sono attività di intermediazione commerciale e richiedono P.IVA (anche regime forfettario). Se sei medico libero professionista hai già P.IVA. Se sei dipendente ospedaliero o convenzionato SSN, verifica con il tuo ordine se l'attività di intermediazione collide con il rapporto di dipendenza pubblica (in genere richiede autorizzazione preventiva).",
  },
  {
    q: 'Cosa succede se segnalo un collega e poi lui disdice dopo 8 mesi?',
    a: "Hai già incassato la commissione one-time (40-25% MRR × 12) e le mensilità di recurring fino al churn. Nulla viene revocato dopo 6 mesi. Se la disdetta è entro 6 mesi, la one-time è ridotta del 50% (rimborso parziale). Se è entro 3 mesi, viene annullata completamente (rimborso totale).",
  },
  {
    q: "Cosa NON posso fare come Ambassador?",
    a: "1. Non puoi promettere ai tuoi pazienti vantaggi se loro o i loro medici di fiducia passano a Fibonacci. 2. Non puoi usare loghi/immagini Fibonacci in pubblicità sanitaria del tuo studio senza disclaimer. 3. Non puoi inviare email massive a liste medici non opt-in (GDPR + CAN-SPAM equivalente italiano). 4. Non puoi self-referral o registrare studi collegati per accumulare commissioni.",
  },
  {
    q: "C'è un cap massimo di guadagno?",
    a: "Sì: massimo 50 referral attivi contemporaneamente per Ambassador, per evitare derive MLM. A regime quindi un Platino top può fare 50 × 4.188 €/anno × 12% = 25.128 €/anno di recurring + commissione one-time sui nuovi referral dell'anno. Per Ambassador che superano sistematicamente questa soglia esiste un percorso di transizione a partner di canale ufficiale con contratto distinto.",
  },
  {
    q: 'Quando vengo pagato?',
    a: "Mensile, entro il 15 del mese successivo. Esempio: referito attiva piano il 5 marzo, finestra anti-churn termina il 4 maggio (60 gg), commissione liberata e fatturata il 15 maggio. La recurring di marzo-aprile-maggio confluisce nella stessa fattura. Da giugno in poi: commissione recurring del mese N pagata il 15 del mese N+1.",
  },
  {
    q: 'Posso essere Ambassador di altri software medicali concorrenti?',
    a: "Sì, il programma non è esclusivo. Però devi dichiarare a Fibonacci la lista di programmi referral concorrenti a cui partecipi (clausola di trasparenza dell'accordo). Se l'80%+ dei tuoi referral va a un competitor possiamo terminare l'accordo (non saresti più un genuino Ambassador Fibonacci).",
  },
] as const

export default function PartnersPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20" style={{ background: 'var(--card)' }}>
        <FibonacciPattern opacity={0.05} align="top-right" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <Award className="w-3.5 h-3.5" />
            Programma Ambassador · Apertura 50 posti
          </div>

          <h1
            className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ color: 'var(--fg)' }}
          >
            Costruiamo Fibonacci insieme.
            <br />
            <span style={{ color: 'var(--accent)' }}>Anche economicamente.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-3xl" style={{ color: 'var(--muted)' }}>
            Se Fibonacci ti fa risparmiare tempo nello studio, è naturale parlarne con i colleghi.
            <br />
            Il programma Ambassador ti permette di guadagnare fino al{' '}
            <strong style={{ color: 'var(--fg)' }}>40% del primo anno + 12% ricorrente</strong>{' '}
            per ogni studio medico che porti su Fibonacci.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#candidatura"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Candidati come Ambassador
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#tiers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: 'var(--fg)', border: '1px solid var(--border)' }}
            >
              Vedi i 4 tier di commissione
            </a>
          </div>

          <p className="text-xs mt-6" style={{ color: 'var(--muted)' }}>
            Programma B2B compliant con codice deontologico FNOMCeO art. 56 · Solo per medici clienti attivi Fibonacci da 60+ giorni
          </p>
        </div>
      </section>

      {/* Calcolatore */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              Calcolatore
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Quanto guadagni se porti i tuoi colleghi?
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
              Sposta i cursori per simulare il tuo potenziale guadagno in base al numero e tipologia di studi che porti.
            </p>
          </div>

          <PartnersCalculator />
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="py-20" style={{ background: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              I 4 tier Ambassador
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Più studi porti, più cresce la tua quota
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
              Tier nominati come il programma Cinco di Firmamento. Il livello si riconferma ogni 12 mesi
              in base al numero di referral attivi paganti.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-6 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${tier.color}20` }}
                  >
                    <Award className="w-5 h-5" style={{ color: tier.color }} />
                  </div>
                  <div>
                    <p className="font-[var(--font-playfair)] text-xl font-bold" style={{ color: 'var(--fg)' }}>
                      {tier.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      Tier {tier.level}
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{ background: 'var(--card)', color: 'var(--fg)' }}
                >
                  {tier.referrals}
                </div>

                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                      Commissione one-time
                    </p>
                    <p className="text-base font-bold" style={{ color: tier.color }}>
                      {tier.oneTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                      Recurring ogni mese
                    </p>
                    <p className="text-base font-bold" style={{ color: 'var(--fg)' }}>
                      {tier.recurring}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-[11px] leading-snug" style={{ color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--fg)' }}>Esempio: </strong>
                    {tier.example}
                  </p>
                  {tier.bonus && tier.bonus !== '— ' && (
                    <p className="text-[10px] mt-2" style={{ color: 'var(--accent)' }}>
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {tier.bonus}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: 'var(--muted)' }}>
            MRR = Monthly Recurring Revenue del referito · Commissione calcolata su prezzo annuale del piano scelto
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              Come funziona
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              4 step, zero burocrazia
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {HOW_IT_WORKS.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl p-6"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-4">
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
                    <h3 className="font-[var(--font-playfair)] text-xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
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

      {/* Compliance */}
      <section className="py-20" style={{ background: 'var(--card)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              Conformità deontologica
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Perché è perfettamente legale
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
              Sappiamo che &laquo;medico che guadagna su un altro medico&raquo; suona delicato.
              Abbiamo strutturato il programma con un avvocato sanitario per stare dentro il perimetro deontologico
              dell&apos;ordine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {COMPLIANCE_POINTS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl p-6"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <h3 className="font-[var(--font-playfair)] text-lg font-bold mb-2" style={{ color: 'var(--fg)' }}>
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-8 rounded-2xl p-6"
            style={{ background: 'var(--bg)', border: '2px solid var(--accent-light)' }}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
              <div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--fg)' }}>
                  Anti-frode strutturali del programma
                </h3>
                <ul className="space-y-1.5">
                  {ANTI_FRAUD.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
              FAQ Ambassador
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
              Le domande che ci fanno tutti
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
      <section
        id="candidatura"
        className="py-20"
        style={{ background: 'var(--fg)', color: 'white' }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--accent)' }} />
          <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold mb-6">
            Apriamo il primo round Ambassador
          </h2>
          <p className="text-base leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Cerchiamo <strong>50 medici fondatori</strong> già clienti Fibonacci (qualsiasi piano)
            che credano abbastanza nel prodotto da raccomandarlo ai colleghi della loro rete professionale.
            <br />
            <br />
            I primi 10 Ambassador entrano in tier Argento di partenza (senza dover prima portare 4 studi)
            e ottengono un seat permanente nel comitato consultivo prodotto.
          </p>

          <Link
            href="/prova-demo?intent=ambassador"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Candidati Ambassador Fibonacci
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Ti contattiamo entro 5 giorni lavorativi · Verifica deontologica · Onboarding 30 min via call
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
