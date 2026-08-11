import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia } from '@/components/ui/elementi'
import { Autovalutazione } from '@/components/Autovalutazione'

export const metadata: Metadata = {
  title: 'La tua documentazione regge? Otto domande',
  description:
    'Otto domande su consensi, foto, lotti, registro accessi e portabilità dei dati. L’esito si legge subito, con la fonte di ogni punto. Le risposte restano nel tuo browser: non le inviamo e non chiediamo l’email.',
  alternates: { canonical: '/autovalutazione' },
}

export default function AutovalutazionePagina() {
  return (
    <Pagina
      occhiello="Autovalutazione"
      titolo={
        <>
          Otto domande, e sai dove la tua documentazione{' '}
          <span className="accento-corsivo">non parla</span> da sola
        </>
      }
      sommario={
        <>
          Sono le domande che tornano quando una documentazione viene contestata: chi ha firmato
          cosa, dove stanno le foto, che prodotto era, chi ha aperto la cartella. Ci vogliono due
          minuti e l’esito si legge subito.
        </>
      }
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia gabbia-stretta">
          <Autovalutazione />
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>Come è fatta</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              Nessun punteggio, e nessuna email da lasciare
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Un numero da 0 a 100 sarebbe inventato: chi decide che una lacuna sul consenso vale
              dodici punti e una sulle foto otto? E servirebbe a farti ottimizzare la cifra invece
              che a mostrarti il punto. Per questo l’esito è un elenco, e ogni voce porta la norma
              o la sentenza da cui viene, così puoi verificarla senza fidarti di noi.
            </p>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              Le risposte non escono da questa pagina. È lo stesso patto del verificatore di
              documenti: quello controlla un PDF senza che il file ci arrivi, questa fa i conti
              senza che le risposte ci arrivino. Su un sito che chiede fiducia a un medico, la
              coerenza fra quello che si dice e quello che si fa vale più di un modulo compilato.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">Se qualche punto è scoperto</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            Non serve per forza cambiare software: alcuni si chiudono cambiando un’abitudine. Se
            invece vuoi vedere come li chiude Fibonacci, si fa in mezz’ora.
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/richiedi-una-demo" className="btn btn-primario">
              Richiedi una demo
            </Link>
            <Link href="/consensi-informati" className="btn btn-secondario">
              Che cosa deve contenere un consenso
            </Link>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/che-software-serve" className="link-avanti">
              Portale, gestionale o cartella verticale: che cosa serve davvero
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
