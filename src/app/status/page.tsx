import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { StatusGrid } from './StatusGrid'
import { FIRMAMENTO } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Stato dei servizi · Fibonacci',
  description:
    'Stato in tempo reale dei servizi Fibonacci: app, API, demo, PDF signing, dettatura AI. Trasparenza operativa.',
  alternates: { canonical: '/status' },
}

export default function StatusPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <section className="pt-32 pb-12" style={{ background: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Trasparenza operativa
          </p>
          <h1
            className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--fg)' }}
          >
            Stato dei servizi Fibonacci
          </h1>
          <p className="text-base max-w-2xl" style={{ color: 'var(--muted)' }}>
            Monitoraggio in tempo reale degli endpoint pubblici. Ogni servizio è verificato dal tuo
            browser. Se vedi tutto verde, la piattaforma è operativa al 100%.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <StatusGrid />
        </div>
      </section>

      <section className="py-12" style={{ background: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="font-[var(--font-playfair)] text-2xl font-bold mb-6"
            style={{ color: 'var(--fg)' }}
          >
            Architettura tecnica
          </h2>
          <div className="grid md:grid-cols-2 gap-5 text-sm" style={{ color: 'var(--muted)' }}>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                Stack di produzione
              </h3>
              <ul className="space-y-1 leading-relaxed">
                <li>· Hosting: VPS Hetzner CPX31 (8 vCPU · 16 GB RAM · 240 GB NVMe)</li>
                <li>· Reverse proxy: Caddy 2.x con HTTPS automatico Let&apos;s Encrypt</li>
                <li>· Backend FHIR: Medplum R4 self-hosted</li>
                <li>· Database: PostgreSQL 17 + Valkey 8 (Redis-compat)</li>
                <li>· Frontend: React 19 + Vite + Mantine</li>
                <li>· Dettatura AI: WhisperLive + Voxtral 24B</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                Pratiche operative
              </h3>
              <ul className="space-y-1 leading-relaxed">
                <li>· Backup giornaliero postgres + storage Medplum (retention 30 gg)</li>
                <li>· Container health monitor ogni 5 minuti (alert webhook)</li>
                <li>· Disk usage watcher ogni 15 minuti</li>
                <li>· Audit log immutabile hash-chain (FHIR AuditEvent)</li>
                <li>· Cifratura AES-256 a riposo per allegati Medplum</li>
                <li>· TLS 1.3 obbligatorio su tutti gli endpoint pubblici</li>
              </ul>
            </div>
          </div>

          <div
            className="mt-8 p-5 rounded-xl text-xs"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            <p className="mb-2" style={{ color: 'var(--fg)', fontWeight: 600 }}>
              Stiamo lavorando per ottenere
            </p>
            <p className="leading-relaxed">
              SLA 99.9% formale con copertura contrattuale (oggi best-effort) · Off-site backup geograficamente
              redondante (oggi solo on-site) · Certificazione ISO 27001 (in valutazione 2026 Q4) · Penetration test
              annuale da fornitore esterno.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Per segnalare incidenti o richiedere informazioni operative: <strong>supporto@fibonacci.it</strong>
            <br />
            Operatore: {FIRMAMENTO.legalName} · C.F./P.IVA {FIRMAMENTO.vatNumber} · Genova
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
