'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Occhiello } from '@/components/ui/elementi'
import { assetPath } from '@/lib/asset-path'

/* Il primo schermo.
 *
 * CXL: la proposta di valore deve rispondere entro ~8 secondi a «cos'è ·
 * cosa posso farci · a cosa mi serve · perché voi». E l'opinione sul sito si
 * forma in 50 millisecondi, quindi questo schermo dev'essere FINITO: niente
 * che sembri in costruzione.
 *
 * REGISTRO DEL TITOLO — deciso dopo due tentativi sbagliati.
 * Le versioni a effetto («La visita è finita. Il documento anche.», «La
 * paziente si rialza. Il consenso è già firmato.») sono state scartate
 * dall'utente per la stessa ragione: su chi compra un gestionale clinico la
 * battuta pubblicitaria suona come fuffa, non come competenza. Il manuale
 * dice che il titolo deve promettere invece di etichettare; qui vince il
 * lettore, che è un medico e legge un fornitore, non una campagna.
 *
 * Quindi: descrittivo e preciso. Il titolo elenca CHE COSA si gestisce, il
 * sottotitolo scende nel concreto (prodotto, lotto, firma, cifratura). Zero
 * giochi di parole, zero contrasti a effetto. L'unica libertà è il corsivo su
 * «medicina estetica», che è il segmento, non uno slogan. */

export function Hero() {
  const menoMovimento = useReducedMotion()

  const entra = (ritardo: number) =>
    menoMovimento
      ? {}
      : {
          initial: { opacity: 0, y: 21 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: ritardo, ease: [0.16, 1, 0.3, 1] as const },
        }

  return (
    <section style={{ paddingTop: 'var(--s-55)', paddingBottom: 'var(--s-89)' }}>
      <div className="gabbia">
        <div className="grid gap-[var(--s-55)] lg:grid-cols-[1fr_1.1fr] lg:gap-[var(--s-89)] lg:items-center">
          {/* ── Parola ─────────────────────────────────────────────────── */}
          <div>
            <motion.div {...entra(0)}>
              <Occhiello>Medicina estetica · Cartella clinica</Occhiello>
            </motion.div>

            <motion.h1
              {...entra(0.08)}
              className="mt-[var(--s-21)] text-[clamp(2.1rem,5.2vw,3.4rem)]"
            >
              Cartella clinica, consensi e immagini per la{' '}
              <span className="accento-corsivo">medicina estetica</span>
            </motion.h1>

            <motion.p
              {...entra(0.16)}
              className="mt-[var(--s-34)] text-[1.125rem]"
              style={{ color: 'var(--fg-muted)', maxWidth: '40ch' }}
            >
              Anamnesi, sedute con prodotto e lotto, consensi firmati in studio, fotografie
              cifrate. In un posto solo, e con ogni scrittura tracciata.
            </motion.p>

            <motion.div {...entra(0.24)} className="mt-[var(--s-34)] flex flex-wrap gap-[var(--s-13)]">
              <Link href="/richiedi-una-demo" className="btn btn-primario">
                Richiedi una demo guidata
              </Link>
              <Link href="/come-funziona" className="btn btn-secondario">
                Guarda il prodotto
              </Link>
            </motion.div>

            <motion.p
              {...entra(0.32)}
              className="mt-[var(--s-21)] text-[14px]"
              style={{ color: 'var(--fg-faint)' }}
            >
              Trenta minuti, con un medico che il prodotto lo ha costruito. Nessun impegno,
              nessuna carta di credito.
            </motion.p>
          </div>

          {/* ── Prova ───────────────────────────────────────────────────
              Baymard: sulla home servono immagini VERE dell'interfaccia, in
              alto e in quantità. Il mockup disegnato rende peggio, perché chi
              valuta vuole vedere com'è fatto e non l'interpretazione che un
              designer ne dà. Qui la schermata è la prima cosa a destra del
              titolo, non a quattromila pixel di distanza. */}
          <motion.div
            initial={menoMovimento ? undefined : { opacity: 0, y: 34, scale: 0.985 }}
            animate={menoMovimento ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <figure>
              <div className="schermata">
                {/* next/image non serve: l'export statico non ha ottimizzatore
                    a runtime, e la schermata è già ridimensionata a monte. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetPath('/schermate/cartella-paziente.png')}
                  alt="La cartella di una paziente in Fibonacci: intestazione con nome, data di nascita e codice fiscale, banner delle allergie in evidenza, ed elenco delle sedute con le aree trattate."
                  width={2560}
                  height={1600}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                />
              </div>
              <figcaption className="didascalia">
                Schermata dall&apos;applicazione, non un disegno.
              </figcaption>
            </figure>
          </motion.div>
        </div>

        {/* ── Fascia di verità ───────────────────────────────────────────
            Tre fatti verificabili, non tre numeri gonfiati. CXL/Stanford: se
            urli «fidati di me» fai nascere il sospetto; contano invece i
            fatti controllabili. Il terzo dichiara lo stadio del prodotto,
            che è più credibile di una piazza di loghi finti. */}
        <motion.div
          {...(menoMovimento
            ? {}
            : {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.7, delay: 0.5 },
              })}
          className="mt-[var(--s-89)] grid gap-[var(--s-21)] md:grid-cols-3"
          style={{ borderTop: '1px solid var(--rule)', paddingTop: 'var(--s-34)' }}
        >
          {[
            {
              t: 'I dati restano in Europa',
              d: 'Server in Germania. Niente cartelle cliniche oltreoceano.',
            },
            {
              t: 'Il registro non si riscrive',
              d: 'Ogni modifica entra in una catena di impronte. Ritoccarla la spezza, e si vede.',
            },
            {
              t: 'Siamo in avvio',
              d: 'In pilota presso uno studio. Meglio dirlo che esibire loghi di clienti che non abbiamo.',
            },
          ].map((f) => (
            <div key={f.t}>
              <p className="text-[15px] font-medium" style={{ color: 'var(--fg)' }}>
                {f.t}
              </p>
              <p className="mt-[var(--s-8)] text-[14px]" style={{ color: 'var(--fg-muted)' }}>
                {f.d}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
