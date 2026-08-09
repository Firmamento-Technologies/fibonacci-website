'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Occhiello, Foto } from '@/components/ui/elementi'
import { ModuloDemo } from '@/components/ModuloDemo'

/* Il culmine della pagina.
 *
 * È la sezione che nessun concorrente può copiare a parole, perché o la
 * catena c'è o non c'è. Sta su fondo scuro perché è l'unico momento in cui
 * la pagina alza la voce, e perché dopo di essa arriva solo il prezzo.
 *
 * Ogni numero qui dentro descrive un meccanismo che gira in produzione. Il
 * verificatore pubblico esiste e la catena di impronte è installata; la
 * firma elettronica QUALIFICATA no, e infatti non è nominata.
 */

const ANELLI = [
  { et: 'Apertura cartella', ora: '09:31:04', hash: 'a41f…9c2e' },
  { et: 'Anamnesi salvata', ora: '09:38:52', hash: 'e71b…ba2f' },
  { et: 'Consenso firmato', ora: '09:47:19', hash: '9f2c…08d7' },
  { et: 'Seduta registrata', ora: '10:15:33', hash: '3d80…41aa' },
]

export function Sigillo() {
  const menoMovimento = useReducedMotion()

  return (
    <section className="scuro fascia-lg" id="il-sigillo">
      <div className="gabbia">
        <div className="aurea">
          <div>
            <Occhiello chiaro>Il sigillo</Occhiello>
            <h2 className="mt-[var(--s-21)] text-[clamp(1.85rem,4.2vw,2.9rem)]" style={{ maxWidth: '16ch' }}>
              Una cartella si contesta dicendo che è stata{' '}
              <span className="accento-corsivo">riscritta</span>
            </h2>

            <div className="mt-[var(--s-34)] space-y-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)', maxWidth: '48ch' }}>
              <p>
                È l&apos;argomento più semplice che un avvocato possa usare, e con una cartella di
                carta o con un file Word funziona: nessuno può dimostrare quando quella riga è stata
                scritta davvero.
              </p>
              <p>
                In Fibonacci ogni scrittura porta l&apos;impronta digitale di quella precedente. Le
                impronte formano una catena, e il database rifiuta di modificare o cancellare gli
                anelli già chiusi. Toccare una virgola di sei mesi fa vuol dire spezzare tutti gli
                anelli successivi, e la rottura si vede.
              </p>
              <p style={{ color: 'var(--on-ink)' }}>
                La parte che conta: il controllo lo può fare chiunque, non noi. Il verificatore è
                una pagina pubblica, senza registrazione. Vale come prova proprio perché funziona
                anche contro di noi.
              </p>
            </div>

            <div className="mt-[var(--s-34)] flex flex-wrap gap-[var(--s-13)]">
              <Link href="/verifica" className="btn btn-primario">
                Verifica un documento
              </Link>
              <Link href="/sicurezza-e-dati" className="btn btn-su-scuro">
                Come funziona nel dettaglio
              </Link>
            </div>

            <p className="mt-[var(--s-21)] text-[13px]" style={{ color: 'var(--on-ink-muted)' }}>
              La catena dimostra che un documento non è stato ritoccato dopo essere stato scritto.
              Non è una firma elettronica qualificata: quella arriverà, e finché non c&apos;è non la
              scriviamo da nessuna parte.
            </p>
          </div>

          {/* La catena. Gli anelli si collegano uno dopo l'altro quando la
              sezione entra in vista: il movimento qui ha un mestiere preciso,
              far vedere che ogni anello DIPENDE dal precedente. */}
          <motion.div
            className="foglio"
            style={{ padding: 'var(--s-34)' }}
            initial={menoMovimento ? undefined : 'nascosto'}
            whileInView={menoMovimento ? undefined : 'visibile'}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            variants={{ visibile: { transition: { staggerChildren: 0.16 } } }}
          >
            <p className="numero">CATENA DI IMPRONTE · CARTELLA 4471</p>

            <ol className="mt-[var(--s-21)]">
              {ANELLI.map((a, i) => (
                <motion.li
                  key={a.hash}
                  className="relative grid gap-[var(--s-13)] sm:grid-cols-[1.6rem_1fr]"
                  style={{ paddingBottom: i === ANELLI.length - 1 ? 0 : 'var(--s-21)' }}
                  variants={{
                    nascosto: { opacity: 0, y: 13 },
                    visibile: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  {/* filo verticale che unisce l'anello al successivo */}
                  {i < ANELLI.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute"
                      style={{
                        left: 7,
                        top: 18,
                        bottom: 4,
                        width: 1,
                        background: 'var(--rule-ink)',
                      }}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="relative mt-[5px] block shrink-0"
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: '50%',
                      border: '1px solid var(--accent-onink)',
                      background: 'var(--ink)',
                    }}
                  >
                    <span
                      className="absolute"
                      style={{
                        inset: 4,
                        borderRadius: '50%',
                        background: 'var(--accent-onink)',
                      }}
                    />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-8)]">
                      <span className="text-[15px]" style={{ color: 'var(--on-ink)' }}>
                        {a.et}
                      </span>
                      <span className="numero">{a.ora}</span>
                    </div>
                    <p
                      className="mt-[3px] text-[13px]"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-onink)' }}
                    >
                      {a.hash}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <motion.div
              className="mt-[var(--s-21)]"
              style={{ borderTop: '1px solid var(--rule-ink)', paddingTop: 'var(--s-13)' }}
              variants={{
                nascosto: { opacity: 0 },
                visibile: { opacity: 1, transition: { duration: 0.6 } },
              }}
            >
              <p className="text-[13px]" style={{ color: 'var(--on-ink-muted)' }}>
                Modificando l&apos;anello delle 09:38 si spezzano i tre successivi. Il controllo lo
                rileva, e dice quale.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── Chiusura: il modulo ────────────────────────────────────────────────
   NN/g: i moduli di contatto vanno tenuti a 3-5 campi; un test riporta
   +160% di invii passando da 11 campi a 4. Qui sono quattro, e nessuno è
   facoltativo travestito da obbligatorio. */

export function Chiusura() {
  return (
    <section className="fascia" id="parliamone">
      <div className="gabbia">
        <div className="aurea">
          <div>
            <Occhiello>Il passo dopo</Occhiello>
            <h2 className="mt-[var(--s-21)] text-[clamp(1.85rem,4.2vw,2.9rem)]" style={{ maxWidth: '15ch' }}>
              Mezz&apos;ora, e capisci se fa per te
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)', maxWidth: '44ch' }}>
              Non è una telefonata commerciale. Ti facciamo vedere il prodotto sulle procedure che
              fai tu, e ti diciamo anche dove non ti conviene.
            </p>

            <Foto
              nome="consulto-studio"
              alt="Due professioniste sedute con una cliente in una stanza di trattamento, accanto alla poltrona e al carrello degli strumenti."
              proporzione="16 / 10"
              className="mt-[var(--s-34)]"
            />

            <dl className="mt-[var(--s-34)]" style={{ color: 'var(--fg-muted)' }}>
              {[
                ['Chi chiama', 'Una persona che il prodotto lo ha costruito, non un venditore.'],
                ['Cosa serve', 'Sapere che procedure fai e con che gestionale lavori oggi.'],
                ['Cosa non facciamo', 'Nessun richiamo insistente. Se non rispondi, non ti cerchiamo più.'],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-[var(--s-8)] py-[var(--s-13)] sm:grid-cols-[9rem_1fr]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <dt className="numero" style={{ paddingTop: 3 }}>{k}</dt>
                  <dd className="text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="foglio" style={{ padding: 'var(--s-34)' }}>
            <ModuloDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
