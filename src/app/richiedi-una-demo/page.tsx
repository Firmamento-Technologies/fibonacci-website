import type { Metadata } from 'next'
import { Pagina } from '@/components/chrome/Pagina'
import { ModuloDemo } from '@/components/ModuloDemo'
import { Foto, Occhiello } from '@/components/ui/elementi'
import { Reveal } from '@/components/ui/Reveal'
import { DEMO_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Richiedi una demo',
  description:
    'Mezz’ora con chi ha costruito il prodotto, sulle procedure che fai tu. Quattro campi, nessun impegno, nessuna carta di credito.',
  alternates: { canonical: '/richiedi-una-demo' },
}

export default function RichiediUnaDemo() {
  return (
    <Pagina
      href="/richiedi-una-demo"
      occhiello="Parliamone"
      titolo={
        <>
          Mezz&apos;ora, e capisci se <span className="accento-corsivo">fa per te</span>
        </>
      }
      sommario="Non è una telefonata commerciale. Ti mostriamo il prodotto sulle procedure che fai, e ti diciamo anche dove non ti conviene."
      larga
    >
      {/* ⚠️ La coda era di px: dentro una tappa lo spazio lo dà già la
          centratura verticale, e quella coda mandava la V sotto il bordo
          (misurato: 1% oltre la schermata, `scripts/altezza-pagine.mjs`). */}
      <section style={{ paddingBottom: 'var(--s-8)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Foto
                  nome="consulto-studio"
                  alt="Due professioniste sedute con una cliente in una stanza di trattamento, accanto alla poltrona e al carrello degli strumenti."
                  proporzione="4 / 3"
                />

                <dl className="mt-[var(--s-34)]">
                  {[
                    ['Chi chiama', 'Una persona che il prodotto lo ha costruito, non un venditore.'],
                    ['Cosa serve', 'Sapere che procedure fai e con che gestionale lavori oggi.'],
                    ['Quanto dura', 'Trenta minuti. Se bastano venti, finiamo in venti.'],
                    ['Dopo', 'Nessun richiamo insistente. Se non rispondi, non ti cerchiamo più.'],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="grid gap-[var(--s-8)] py-[var(--s-13)] sm:grid-cols-[8rem_1fr]"
                      style={{ borderTop: '1px solid var(--rule)' }}
                    >
                      <dt className="numero" style={{ paddingTop: 3 }}>{k}</dt>
                      <dd className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>{v}</dd>
                    </div>
                  ))}
                </dl>

                {DEMO_URL && (
                <div className="mt-[var(--s-34)] foglio" style={{ padding: 'var(--s-21)' }}>
                  <Occhiello>Preferisci provarlo da solo</Occhiello>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    La demo pubblica è aperta e non chiede registrazione. Contiene dati finti: non
                    inserirci pazienti reali.
                  </p>
                  <a href={DEMO_URL} className="btn btn-secondario mt-[var(--s-13)]" rel="noopener">
                    Entra nella demo
                  </a>
                </div>
                )}
              </div>
            </Reveal>

            <Reveal da="destra">
              <div className="foglio lg:sticky" style={{ padding: 'var(--pad-foglio, var(--s-34))', top: 'var(--s-144)' }}>
                <ModuloDemo />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Pagina>
  )
}
