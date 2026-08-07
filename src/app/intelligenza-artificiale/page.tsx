import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: 'Come usiamo l’intelligenza artificiale',
  description:
    'Dove c’è un modello linguistico dentro Fibonacci, cosa fa, cosa non fa mai, chi controlla il risultato e dove girano i dati. Senza entusiasmi.',
  alternates: { canonical: '/intelligenza-artificiale' },
}

/* Pagina di trasparenza sull'IA.
 *
 * Serve a due cose insieme, ed è raro che coincidano così bene:
 *   · al posizionamento — «l'IA non decide niente» è esattamente ciò che un
 *     medico prudente vuole sentirsi dire;
 *   · alla conformità — l'art. 50 dell'AI Act impone di rendere riconoscibile
 *     l'interazione con un sistema di IA, e il cons. 58 ricorda che restare
 *     fuori dall'alto rischio dipende da cosa il sistema decide davvero.
 *
 * Regola per questa pagina: niente futuro. Solo quello che gira adesso. */

const DOVE = [
  {
    titolo: 'La dettatura dell’anamnesi',
    cosaFa: 'Trascrive quello che dici durante la visita e propone i campi compilati.',
    cosaNonFa: 'Non salva niente da sola. Ogni campo resta modificabile e il salvataggio è un tuo gesto.',
    chiControlla: 'Tu, prima di salvare.',
  },
  {
    titolo: 'La bozza di un consenso fuori catalogo',
    cosaFa: 'Costruisce la struttura di un modulo per una procedura che non è fra i modelli pronti.',
    cosaNonFa:
      'Non inventa contenuto clinico spacciandolo per verificato. Il testo esce marcato come bozza e va rivisto prima dell’uso con pazienti reali.',
    chiControlla: 'Il medico, e per il testo clinico il suo legale.',
  },
  {
    titolo: 'Il controllo sulle allergie',
    cosaFa:
      'Confronta quello che stai per prescrivere con le allergie registrate in cartella e segnala l’incongruenza.',
    cosaNonFa:
      'Non è intelligenza artificiale: è un confronto deterministico fra due elenchi. Lo scriviamo qui perché venga contato per quello che è, e non per qualcosa di più.',
    chiControlla: 'Il segnale è un avviso, non un blocco. Decidi tu.',
  },
] as const

const MAI = [
  'Non formula diagnosi, e nessuna schermata ne propone una.',
  'Non consiglia terapie, dosaggi o prodotti.',
  'Non decide niente al posto tuo: non esiste un’azione che parte senza che tu la confermi.',
  'Non parla con i pazienti al posto tuo dentro la cartella clinica.',
  'Non addestra modelli sui dati dei tuoi pazienti.',
] as const

export default function IntelligenzaArtificiale() {
  return (
    <Pagina
      occhiello="Trasparenza"
      titolo={
        <>
          C&apos;è dell&apos;intelligenza artificiale, e <span className="accento-corsivo">non</span>{' '}
          decide niente
        </>
      }
      sommario="Tre punti del prodotto usano un modello linguistico. Qui c’è cosa fa ciascuno, cosa non fa mai, e chi controlla il risultato."
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia gabbia-stretta">
          {DOVE.map((d, i) => (
            <Reveal key={d.titolo}>
              <div className="py-[var(--s-34)]" style={{ borderTop: '1px solid var(--rule)' }}>
                <div className="flex items-baseline gap-[var(--s-13)]">
                  <span className="numero">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-[1.35rem]">{d.titolo}</h2>
                </div>
                <dl className="mt-[var(--s-21)] grid gap-[var(--s-21)] md:grid-cols-3">
                  {[
                    ['Cosa fa', d.cosaFa],
                    ['Cosa non fa', d.cosaNonFa],
                    ['Chi controlla', d.chiControlla],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="numero">{k}</dt>
                      <dd className="mt-[var(--s-5)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="scuro fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello chiaro>I confini</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[clamp(1.5rem,3vw,2.1rem)]" style={{ maxWidth: '16ch' }}>
                  Cinque cose che non succedono mai
                </h2>
                <ul className="mt-[var(--s-34)]">
                  {MAI.map((m) => (
                    <li
                      key={m}
                      className="py-[var(--s-13)] text-[1.0625rem]"
                      style={{ borderTop: '1px solid var(--rule-ink)', color: 'var(--on-ink-muted)' }}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="viso-detersione"
                alt="Detersione del viso durante un trattamento estetico, con la paziente distesa e gli occhi chiusi."
                proporzione="4 / 3"
                piena
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Occhiello>Dove girano i dati</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[clamp(1.5rem,3vw,2.1rem)]" style={{ maxWidth: '20ch' }}>
            La domanda che conta davvero
          </h2>
          <div className="prosa mt-[var(--s-21)]">
            <p>
              Un modello linguistico gira su server di qualcun altro, e questo è il punto in cui la
              conformità di un prodotto sanitario si gioca sul serio. I fornitori che usiamo sono
              elencati nella pagina dei sub-responsabili, con l&apos;indicazione di dove trattano i
              dati e dell&apos;impegno contrattuale a non addestrare sui nostri.
            </p>
            <p>
              Nessuno di questi passaggi è indispensabile per tenere la cartella: la dettatura e la
              generazione dei moduli si possono spegnere, e il prodotto continua a funzionare come
              una cartella clinica normale. Se il tuo consulente preferisce così, si fa così.
            </p>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/sub-responsabili" className="link-avanti">
              Chi tratta i dati oltre a noi
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
