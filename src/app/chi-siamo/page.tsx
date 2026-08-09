import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'
import { SOCIETA, CONTACT_EMAIL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Chi siamo',
  description:
    'Chi c’è dietro Fibonacci, come lavoriamo, e a che punto siamo davvero: in pilota presso uno studio, prime attivazioni nel 2026.',
  alternates: { canonical: '/chi-siamo' },
}

/* Chi siamo.
 *
 * Fra i fattori di credibilità misurati da Stanford e ripresi da CXL, i più
 * forti sono banali: un indirizzo vero, persone con un nome, un aspetto
 * professionale, testi senza errori. E l'avvertenza opposta: se urli
 * «fidati di me» fai nascere il sospetto.
 *
 * Per questo la pagina dice a che punto siamo per davvero. Un fornitore in
 * avvio che lo ammette è più credibile di uno che finge una scala che non
 * ha, e il medico che compra un gestionale clinico questa cosa la verifica.
 */

const PRINCIPI = [
  {
    titolo: 'Non promettiamo quello che non gira',
    testo:
      'Firma qualificata e conservazione a norma non sono nel listino perché non sono attive. Quando lo saranno, lo scriveremo il giorno stesso.',
  },
  {
    titolo: 'I dati sono del medico',
    testo:
      'Titolare del trattamento sei tu. L’esportazione completa è una funzione del prodotto, non una concessione da negoziare alla disdetta.',
  },
  {
    titolo: 'Il software non fa il medico',
    testo:
      'Nessuna schermata propone diagnosi o terapie. Segnaliamo incongruenze, come un’allergia in cartella, e ci fermiamo lì.',
  },
  {
    titolo: 'Le prove prima delle parole',
    testo:
      'Il verificatore dei documenti è pubblico e funziona anche contro di noi. I contratti si leggono senza compilare moduli.',
  },
] as const

export default function ChiSiamo() {
  return (
    <Pagina
      occhiello="Chi siamo"
      titolo={
        <>
          Un prodotto in <span className="accento-corsivo">avvio</span>, detto senza giri di parole
        </>
      }
      sommario="Fibonacci nasce dal lavoro con studi di medicina estetica veri, sulle cose che a fine giornata restano indietro: le schede da ricopiare, i consensi generici, le foto nel telefono."
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <Foto
                nome="cura-pelle-viso"
                alt="Trattamento del viso in ambulatorio: mani con guanti reggono uno strumento appoggiato allo zigomo della paziente, che tiene gli occhi chiusi."
                proporzione="4 / 3"
              />
            </Reveal>
            <Reveal da="destra">
              <div className="prosa">
                <p>
                  Il prodotto è nato guardando lavorare chi la medicina estetica la fa, e chiedendo
                  che cosa rifacesse a fine giornata. La risposta era quasi sempre la stessa: la
                  documentazione. Non perché sia difficile, ma perché è la cosa che si rimanda
                  finché non serve, e quando serve è tardi.
                </p>
                <p>
                  Da lì la scelta di costruire una cartella clinica per una specialità sola. Un
                  gestionale che va bene per sei discipline non conosce nessuna delle sei: non sa
                  che cosa sia un lotto di tossina, non ha una mappa del viso, e il suo modulo di
                  consenso vale per tutto perché non descrive niente.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Occhiello>Come lavoriamo</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[clamp(1.5rem,3vw,2.1rem)]" style={{ maxWidth: '18ch' }}>
            Quattro regole che ci siamo dati
          </h2>
          <div className="mt-[var(--s-34)] grid gap-[var(--s-21)] md:grid-cols-2">
            {PRINCIPI.map((p) => (
              <Reveal key={p.titolo}>
                <div className="foglio h-full" style={{ padding: 'var(--s-34)' }}>
                  <h3 className="text-[1.3rem]">{p.titolo}</h3>
                  <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {p.testo}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Occhiello>A che punto siamo</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[clamp(1.5rem,3vw,2.1rem)]" style={{ maxWidth: '18ch' }}>
            In pilota, non in scala
          </h2>
          <div className="prosa mt-[var(--s-21)]">
            <p>
              Il software gira in produzione presso uno studio pilota. Le prime attivazioni sono
              del 2026. Non abbiamo una piazza di loghi da mostrare, e non ne inventiamo: nella
              pubblicità sanitaria italiana le testimonianze dei pazienti non si possono usare, e
              quelle dei colleghi, a questo punto, sarebbero poche e poco significative.
            </p>
            <p>
              Che cosa vuol dire per te, in concreto: parli con chi il prodotto lo ha costruito,
              le tue richieste pesano sulle priorità, e in cambio accetti di lavorare con un
              fornitore giovane. È uno scambio, non un vantaggio unilaterale, e va valutato per
              quello che è.
            </p>
            {!SOCIETA.costituita && (
              <p>
                <strong>Una nota societaria.</strong> Fibonacci sta passando a una società propria,
                oggi in costituzione. Finché l&apos;iscrizione al registro delle imprese non è
                perfezionata, ragione sociale, sede e partita IVA non compaiono nel piè di pagina:
                preferiamo un dato mancante a un dato provvisorio.
              </p>
            )}
          </div>

          <p className="mt-[var(--s-34)]">
            <Link href="/richiedi-una-demo" className="link-avanti">
              Parliamone di persona
              <Freccia />
            </Link>
          </p>
          {CONTACT_EMAIL && (
            <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              Oppure scrivi a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent-deep)', borderBottom: '1px solid var(--rule-strong)' }}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          )}
        </div>
      </section>
    </Pagina>
  )
}
