import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { VerificaDocumento } from '@/components/VerificaDocumento'
import { Occhiello, Freccia } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: 'Verifica un documento',
  description:
    'Carica un PDF uscito da Fibonacci e controlla firme, metadati e integrità. Il controllo avviene nel tuo browser: il file non ci arriva.',
  alternates: { canonical: '/verifica' },
  robots: { index: true, follow: true },
}

/* Il verificatore pubblico.
 *
 * È la prova più forte che il sito possa offrire, e vale proprio perché
 * funziona anche contro di noi. Per la stessa ragione il testo qui sotto
 * distingue con precisione due cose che il vecchio sito confondeva:
 *
 *   · la CATENA DI IMPRONTE del registro accessi esiste, gira in produzione
 *     e rileva le manomissioni a posteriori;
 *   · la FIRMA ELETTRONICA QUALIFICATA eIDAS NON è attiva.
 *
 * Scrivere «firma eIDAS art. 26» come faceva la pagina precedente è un
 * claim che oggi non regge, e su un sito sanitario un claim che non regge
 * è il primo che il consulente del cliente va a controllare. */

export default function Verifica() {
  return (
    <Pagina
      occhiello="Verifica"
      titolo={
        <>
          Controlla un documento, <span className="accento-corsivo">senza</span> chiederlo a noi
        </>
      }
      sommario="Carica un PDF uscito da Fibonacci: il browser legge firme, metadati e struttura e ti dice cosa contiene. Il file resta sul tuo computer, non viene caricato da nessuna parte."
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia gabbia-stretta">
          <VerificaDocumento />
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Occhiello>Che cosa dimostra, e che cosa no</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[var(--display-2)]" style={{ maxWidth: '20ch' }}>
            Due cose diverse che spesso vengono confuse
          </h2>

          <div className="mt-[var(--s-34)] grid gap-[var(--s-21)] md:grid-cols-2">
            <div className="foglio" style={{ padding: 'var(--s-34)' }}>
              <p className="numero" style={{ color: 'var(--accent)' }}>ATTIVO OGGI</p>
              <h3 className="mt-[var(--s-13)] text-[1.3rem]">La catena di impronte</h3>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                Ogni scrittura nel registro porta l&apos;impronta di quella prima. Il database
                rifiuta modifiche e cancellazioni sulle righe già chiuse. Se qualcuno interviene
                sul database aggirando l&apos;applicazione, la catena si spezza e il controllo lo
                rileva.
              </p>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg)' }}>
                Serve a dimostrare che un documento non è stato ritoccato dopo essere stato scritto.
              </p>
            </div>

            <div className="foglio" style={{ padding: 'var(--s-34)' }}>
              <p className="numero">NON ANCORA</p>
              <h3 className="mt-[var(--s-13)] text-[1.3rem]">La firma qualificata</h3>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                La firma della paziente oggi è una firma elettronica avanzata. La firma
                qualificata, quella che il codice civile equipara alla firma autografa, richiede un
                certificato rilasciato da un prestatore accreditato: non lo abbiamo ancora.
              </p>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg)' }}>
                Finché non c&apos;è, non la scriviamo da nessuna parte. Nemmeno qui.
              </p>
            </div>
          </div>

          <p className="mt-[var(--s-34)]">
            <Link href="/sicurezza-e-dati" className="link-avanti">
              Come sono protetti i dati, per esteso
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
