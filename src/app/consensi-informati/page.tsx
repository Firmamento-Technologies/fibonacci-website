import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto, Schermata } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: 'Il consenso informato in medicina estetica',
  description:
    'Che cosa deve contenere un consenso informato per un trattamento estetico, chi lo firma, quanto si conserva, e perché il modulo unico scaricato da internet è il punto più debole di uno studio.',
  alternates: { canonical: '/consensi-informati' },
}

/* Pagina pilastro.
 *
 * L'intento di ricerca del medico estetico non è «software cartella
 * clinica»: sono gli adempimenti e la paura. Questa pagina risponde alla
 * domanda vera, e il prodotto compare alla fine come risposta, non come
 * premessa. È anche la pagina su cui si appoggeranno gli articoli di
 * dettaglio (tossina, filler, laser, conservazione, foto).
 *
 * ⚠️ Nessuna riga di questa pagina è un parere legale, e il testo lo dice.
 * Su un sito che vende a dei medici, spacciare una sintesi per consulenza è
 * il modo più veloce di perdere il lettore competente. */

const CONTENUTI = [
  {
    voce: 'Chi esegue, e con quale qualifica',
    perche: 'Il paziente ha diritto di sapere chi gli mette le mani addosso, non solo il nome dello studio.',
  },
  {
    voce: 'In che cosa consiste la procedura',
    perche: 'Descritta in modo comprensibile, non con la sigla commerciale del prodotto.',
  },
  {
    voce: 'Rischi e complicanze di quella procedura',
    perche: 'Specifici. «Possibili effetti indesiderati» non è un rischio, è una formula.',
  },
  {
    voce: 'Alternative, compresa quella di non fare niente',
    perche: 'In estetica pesa più che altrove: l’alternativa di astenersi è quasi sempre praticabile.',
  },
  {
    voce: 'Il risultato che ci si può attendere, e i suoi limiti',
    perche:
      'È il punto che la giurisprudenza sull’estetica guarda per primo, e quello che i moduli generici saltano.',
  },
  {
    voce: 'Che cosa succede se il risultato non soddisfa',
    perche: 'Ritocchi, tempi, costi. Detto prima, non contrattato dopo.',
  },
] as const

export default function ConsensiInformati() {
  return (
    <Pagina
      occhiello="Guida"
      titolo={
        <>
          Il consenso informato in medicina estetica: che cosa deve{' '}
          <span className="accento-corsivo">contenere</span>
        </>
      }
      sommario={
        <>
          Una guida pratica per chi firma consensi ogni giorno. Non è un parere legale: è una
          sintesi ragionata, e prima di adottare un modulo va rivista dal tuo legale.
        </>
      }
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia gabbia-stretta">
          <div className="prosa">
            <p>
              In medicina estetica il consenso non è un adempimento fra gli altri: è il documento su
              cui si decide una contestazione. La prestazione è elettiva, il paziente sceglie di
              sottoporsi a un trattamento di cui potrebbe fare a meno, e quando il risultato non
              corrisponde all&apos;attesa la domanda che arriva è sempre la stessa: che cosa gli era
              stato detto, e chi può dimostrarlo.
            </p>
            <p>
              Il modulo unico buono per tutto, scaricato una volta e firmato in sala d&apos;attesa,
              è il punto più debole di uno studio. Non perché sia illegale, ma perché non contiene
              nulla di specifico su quella procedura, e quindi non prova nulla.
            </p>
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Occhiello>La sostanza</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
            Sei cose che un consenso estetico deve dire
          </h2>
          <div className="mt-[var(--s-34)]">
            {CONTENUTI.map((c, i) => (
              <Reveal key={c.voce}>
                <div className="grid gap-[var(--s-21)] py-[var(--s-21)] sm:grid-cols-[2.5rem_1fr]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <span className="numero" style={{ paddingTop: 5 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-[1.0625rem]">{c.voce}</h3>
                    <p className="mt-[var(--s-5)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                      {c.perche}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <Foto
                nome="iniezione-mento"
                alt="Trattamento iniettivo al mento eseguito con guanti, la paziente distesa con gli occhi chiusi."
                proporzione="4 / 5"
              />
            </Reveal>
            <Reveal da="destra">
              <div>
                <Occhiello>Gli errori ricorrenti</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                  Quattro modi di avere un consenso che non regge
                </h2>
                <ol className="mt-[var(--s-34)]">
                  {[
                    ['Il modulo unico', 'Uguale per la tossina e per il laser. Se vale per tutto, non descrive niente.'],
                    ['La firma in sala d’attesa', 'Firmato mentre aspetta, senza che nessuno abbia parlato con lei.'],
                    ['Il risultato dato per certo', 'Elencare i benefici come fatti compiuti è la postura più esposta che esista in estetica.'],
                    ['La data mancante', 'Un consenso senza data e senza tracciabilità è una dichiarazione che non si può collocare nel tempo.'],
                  ].map(([t, d], i) => (
                    <li key={t} className="grid gap-[var(--s-13)] py-[var(--s-13)] sm:grid-cols-[2rem_1fr]" style={{ borderTop: '1px solid var(--rule)' }}>
                      <span className="numero" style={{ paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>{t}</p>
                        <p className="mt-[2px] text-[15px]" style={{ color: 'var(--fg-muted)' }}>{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <div className="aurea aurea-inversa">
            <Reveal>
              <div className="lg:order-2">
                <Occhiello>Come lo risolve Fibonacci</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                  Un modulo per procedura, firmato in studio
                </h2>
                <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                  Scegli la procedura e il modulo esce con i rischi, le alternative e l&apos;esito
                  atteso di quella. La paziente firma sul tablet dopo aver letto, tu controfirmi, e
                  il documento entra nel registro con data e ora certe.
                </p>
                <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg)', borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}>
                  I modelli sono una struttura, non un parere. Il contenuto clinico va rivisto dal
                  tuo specialista e dal tuo legale: l&apos;applicazione te lo ricorda ogni volta,
                  non solo su questa pagina.
                </p>
                <p className="mt-[var(--s-34)]">
                  <Link href="/come-funziona" className="link-avanti">
                    Guarda il flusso completo
                    <Freccia />
                  </Link>
                </p>
              </div>
            </Reveal>
            <Reveal>
              <Schermata
                file="/schermate/catalogo-consensi.png"
                alt="Il catalogo dei consensi di Fibonacci con i modelli raggruppati per categoria e l'avviso che i modelli vanno validati prima dell'uso."
                className="lg:order-1"
                didascalia="L'avviso in alto è nel prodotto, non solo nella documentazione."
              />
            </Reveal>
          </div>
        </div>
      </section>
    </Pagina>
  )
}
