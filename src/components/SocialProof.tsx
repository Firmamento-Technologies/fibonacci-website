import { Shield, Lock, FileCheck, Award } from 'lucide-react'

// Solo una striscia di conformità onesta (redesign 2026-07-16).
// Rimossi i testimonial placeholder ("Studio pilota"): la L. 145/2018 vieta i
// testimonial nella comunicazione sanitaria e non abbiamo clienti citabili in
// pilot. Niente sigle da ingegnere (via "HL7 FHIR R4") — solo garanzie chiare.
const BADGES = [
  { icon: Shield, text: 'Conforme GDPR' },
  { icon: Lock, text: 'Dati e backup in UE' },
  { icon: Award, text: 'Consensi informati inclusi' },
  { icon: FileCheck, text: 'Conservazione a norma' },
]

export function SocialProof() {
  return (
    <div
      className="py-6 border-y"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-14">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          Conformità
        </span>
        {BADGES.map((b) => (
          <div key={b.text} className="flex items-center gap-2">
            <b.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
              {b.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
