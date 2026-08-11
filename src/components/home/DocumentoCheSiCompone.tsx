'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { Occhiello } from '@/components/ui/elementi'

/* ════════════════════════════════════════════════════════════════════════
   Il principio organizzatore del sito.

   Scorrendo, un consenso informato si compone davanti agli occhi, riga per
   riga, fino al sigillo. Non è un vezzo: è la dimostrazione del valore
   numero uno invece della sua affermazione. Chiunque può scrivere
   «documentazione a prova di contestazione»; qui la si costruisce sotto gli
   occhi di chi legge, e ogni pezzo corrisponde a una cosa che il prodotto fa.

   IMPLEMENTAZIONE — perché non ci sono quindici MotionValue.
   La prima versione legava l'opacità di ogni riga a un `useTransform` sul
   progresso. Misurata dal vivo, produceva valori sbagliati: framer-motion
   girava quelle opacità alla Web Animations API, e il valore calcolato
   divergeva da quello inline (righe a 0,57 dove dovevano stare a 1, e tutte
   a zero oltre il 90% della sezione). Qui invece c'è UN solo abbonamento al
   progresso, che aggiorna due numeri in stato React; il resto è opacità in
   CSS con una transizione. Meno pezzi mobili, e il comportamento si verifica
   guardando due numeri invece di quindici animazioni.
   ════════════════════════════════════════════════════════════════════════ */

interface Tappa {
  chiave: string
  etichetta: string
  titolo: string
  testo: string
  righe: { campo: string; valore: string; forte?: boolean }[]
}

const TAPPE: Tappa[] = [
  {
    chiave: 'anamnesi',
    etichetta: 'Anamnesi',
    titolo: 'Parli, e la scheda si riempie',
    testo: 'La dettatura compila i campi mentre visiti. Resta tutto modificabile: non firma niente al posto tuo.',
    righe: [
      { campo: 'Paziente', valore: 'Bertini Laura, 34 anni' },
      { campo: 'Allergie', valore: 'Lidocaina', forte: true },
      { campo: 'Gravidanza', valore: 'Esclusa' },
    ],
  },
  {
    chiave: 'aree',
    etichetta: 'Aree',
    titolo: 'Dove hai iniettato, e quanto',
    testo: 'I punti si segnano sulla mappa del viso. Prodotto, lotto e unità restano legati alla seduta.',
    righe: [
      { campo: 'Trattamento', valore: 'Tossina botulinica tipo A' },
      { campo: 'Sedi', valore: 'Glabella, fronte', forte: true },
      { campo: 'Dose e lotto', valore: '20 U · lotto C4821B' },
    ],
  },
  {
    chiave: 'rischi',
    etichetta: 'Rischi',
    titolo: 'La parte che poi serve',
    testo: 'Rischi, alternative, e cosa succede a non fare niente. È quello che un modulo scaricato non ha.',
    righe: [
      { campo: 'Rischi', valore: 'Ecchimosi, ptosi transitoria, asimmetria' },
      { campo: 'Alternative', valore: 'Nessun trattamento, filler, laser' },
      { campo: 'Esito atteso', valore: 'Attenuazione, non scomparsa. 4-6 mesi', forte: true },
    ],
  },
  {
    chiave: 'firma',
    etichetta: 'Firma',
    titolo: 'Firma lei, firmi tu, in studio',
    testo: 'Nessuno esce con un modulo da riportare la prossima volta, che poi non tornerà mai.',
    righe: [
      { campo: 'Paziente', valore: 'Firmato alle 09:47' },
      { campo: 'Medico', valore: 'Controfirmato alle 09:48' },
      { campo: 'Documento', valore: 'PDF/A archiviato, 4 pagine' },
    ],
  },
  {
    chiave: 'sigillo',
    etichetta: 'Sigillo',
    titolo: 'Da qui, ogni ritocco si vede',
    testo: 'Ogni riga porta l’impronta della precedente. Cambiarne una spezza la catena, e chiunque può accorgersene.',
    righe: [
      { campo: 'Impronta', valore: '9f2c1a4e…08d7b3', forte: true },
      { campo: 'Anello prima', valore: 'e71b04c9…ba2f10' },
      { campo: 'Registrato', valore: '30/01/2026, 09:48:11' },
    ],
  },
]

const RIGHE_TOTALI = TAPPE.reduce((n, t) => n + t.righe.length, 0)

export function DocumentoCheSiCompone() {
  const menoMovimento = useReducedMotion()
  const contenitore = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: contenitore, offset: ['start start', 'end end'] })

  /** Quale tappa è a fuoco, e quante righe del documento sono già comparse. */
  const [tappaAttiva, setTappaAttiva] = useState(0)
  const [righeScritte, setRigheScritte] = useState(1)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = TAPPE.length
    // L'ultima tappa resta a fuoco fino in fondo: senza il min, a progresso 1
    // l'indice uscirebbe dall'array e la colonna resterebbe vuota.
    const indice = Math.min(n - 1, Math.floor(v * n))
    setTappaAttiva(indice)
    // Le righe non spariscono più: una volta scritte restano. Un documento
    // che si svuota mentre scorri racconta l'opposto della tesi.
    setRigheScritte(Math.max(1, Math.min(RIGHE_TOTALI, Math.ceil(v * RIGHE_TOTALI))))
  })

  /* ⚠️ LA VERSIONE STATICA È IL PUNTO DI PARTENZA, NON IL RIPIEGO.
   *
   * Prima questo componente rendeva SUBITO la versione a scorrimento, e i
   * cinque testi sovrapposti nascevano con `opacity: 0` scritta in linea
   * nell'HTML generato: quattro tappe su cinque, più le venti righe del
   * documento, esistevano nella pagina ed erano invisibili finché React non
   * idratava. Erano il **13 %** di testo della home ancora appeso al
   * JavaScript dopo il lavoro su `Reveal` e `Hero`
   * ([[sintesi-analisi-ui-ux-2026-08-09]] §S3).
   *
   * `VersioneStatica` esisteva già — la sceglieva `useReducedMotion()`, cioè
   * un hook di React: **la stessa cosa che poteva non arrivare**. Ora è ciò
   * che il server genera e ciò che il primo render del client produce (i due
   * coincidono, quindi nessuna disparità di idratazione), e la versione a
   * scorrimento subentra in un effetto, un fotogramma dopo.
   *
   * Il costo è invisibile: questa sezione sta a migliaia di pixel dalla piega.
   * Il guadagno è che senza JavaScript la storia si legge tutta, impaginata
   * come un documento — che è esattamente ciò che la sezione racconta. */
  /* ⚠️ La prima versione era `useState(false)` + `useEffect(() => setState(true))`.
   * Funziona, ma è il pattern che `react-hooks/set-state-in-effect` segnala
   * («Calling setState synchronously within an effect can trigger cascading
   * renders»), ed era l'unico errore di eslint del sito. `useSyncExternalStore`
   * è il meccanismo che React offre esattamente per questo: uno snapshot per il
   * server e uno per il client, senza render a cascata e senza disparità di
   * idratazione. Non si sottoscrive niente perché il valore, una volta sul
   * client, non cambia più. */
  const interattivo = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  /* 🔴 IL CANCELLO SULLA LARGHEZZA, e perché senza si rompeva la pagina.
   *
   * Il pannello qui sotto è `sticky top-0` alto **100vh** con `flex
   * items-center`. Sotto i 1024 px il contenuto **non sta in 100vh**: le due
   * colonne si impilano (`lg:grid-cols-[1fr_1.1fr]`) e diventano ~1400 px di
   * altezza. E `align-items: center` fa traboccare l'eccedenza **da entrambi i
   * lati** — quindi anche **verso l'alto**, sopra il primo schermo.
   *
   * Misurato sul sito pubblicato, a pagina ferma in cima:
   *     sezione #il-documento  1350 → 5410
   *     pannello bloccato      1350 → 2162   (corretto)
   *     testo della scheda      1049 → 1132   ← 301 px SOPRA il contenitore
   * Risultato a schermo: il testo di questa sezione disegnato sopra la fascia
   * di verità dell'hero, illeggibile. Solo su telefono, perché su desktop le
   * due colonne stanno affiancate e ci stanno.
   *
   * ⇒ Sotto `lg` si usa `VersioneStatica`, che esisteva già e racconta la
   * stessa storia impaginata come un documento. La soglia è **la stessa** del
   * layout a due colonne, non un numero nuovo: se cambia quella, cambia questa.
   * ⛔ Non «aggiustare» con `overflow:hidden` sul pannello — taglierebbe il
   * testo invece di spostarlo. E non con `items-start`: l'eccedenza andrebbe
   * tutta in basso, a coprire la sezione seguente. */
  const abbastanzaLargo = useSyncExternalStore(
    (avvisa) => {
      const mq = window.matchMedia('(min-width: 1024px)')
      mq.addEventListener('change', avvisa)
      return () => mq.removeEventListener('change', avvisa)
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  )

  if (menoMovimento || !interattivo || !abbastanzaLargo) return <VersioneStatica />

  return (
    <section
      ref={contenitore}
      id="il-documento"
      style={{ height: `${TAPPE.length * 100}vh`, position: 'relative' }}
      aria-label="Come si compone il documento"
    >
      <div className="sticky top-0 flex items-center" style={{ height: '100vh' }}>
        <div className="gabbia w-full">
          <div className="grid gap-[var(--s-55)] lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Occhiello>Il documento che regge</Occhiello>

              {/* Griglia a una cella sola: i cinque testi si sovrappongono in
                  `1 / 1`, così la colonna non cambia altezza a ogni tappa. */}
              <div className="mt-[var(--s-34)] grid" style={{ minHeight: 240 }}>
                {TAPPE.map((tappa, i) => (
                  <div
                    key={tappa.chiave}
                    aria-hidden={i !== tappaAttiva}
                    style={{
                      gridArea: '1 / 1',
                      opacity: i === tappaAttiva ? 1 : 0,
                      transform: i === tappaAttiva ? 'none' : 'translateY(13px)',
                      transition: 'opacity 420ms var(--ease-out), transform 420ms var(--ease-out)',
                      pointerEvents: i === tappaAttiva ? undefined : 'none',
                    }}
                  >
                    <h2 className="text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
                      {tappa.titolo}
                    </h2>
                    <p
                      className="mt-[var(--s-21)] text-[1.0625rem]"
                      style={{ color: 'var(--fg-muted)', maxWidth: '44ch' }}
                    >
                      {tappa.testo}
                    </p>
                  </div>
                ))}
              </div>

              <ol className="mt-[var(--s-34)] flex flex-wrap gap-[var(--s-13)]">
                {TAPPE.map((tappa, i) => {
                  const attiva = i === tappaAttiva
                  return (
                    <li key={tappa.chiave} className="flex items-center gap-[var(--s-8)]">
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'block',
                          height: 2,
                          borderRadius: 2,
                          width: attiva ? 34 : 8,
                          background: attiva ? 'var(--accent)' : 'var(--fg-faint)',
                          transition: 'width 420ms var(--ease-out), background 420ms var(--ease-out)',
                        }}
                      />
                      <span
                        className="numero"
                        style={{
                          color: attiva ? 'var(--accent)' : 'var(--fg-faint)',
                          transition: 'color 420ms var(--ease-out)',
                        }}
                      >
                        {tappa.etichetta}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>

            <Documento righeScritte={righeScritte} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* Il foglio. Le righe compaiono una a una, come se qualcuno le stesse
   scrivendo, e restano. È l'unico punto del sito in cui il movimento imita
   un gesto umano, e ci sta perché la tesi della pagina è proprio che il
   documento si scrive mentre lavori. */
function Documento({ righeScritte }: { righeScritte: number }) {
  /* L'indice progressivo delle righe si calcola PRIMA di rendere, non con un
   * contatore mutato dentro la map: React vieta di riassegnare durante il
   * render, e con il rendering concorrente un contatore così può contare due
   * volte la stessa riga. */
  const indiceDiPartenza: number[] = []
  TAPPE.reduce((acc, t) => {
    indiceDiPartenza.push(acc)
    return acc + t.righe.length
  }, 0)

  return (
    <div className="foglio" style={{ padding: 'var(--s-34)', minHeight: 420 }}>
      <div
        className="flex items-baseline justify-between"
        style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 'var(--s-13)' }}
      >
        <p className="numero">CONSENSO INFORMATO</p>
        <p className="numero">30/01/2026</p>
      </div>

      <div className="mt-[var(--s-13)]">
        {TAPPE.map((tappa, i) => (
          <div key={tappa.chiave} style={{ marginTop: i === 0 ? 0 : 'var(--s-13)' }}>
            {tappa.righe.map((riga, j) => {
              const scritta = indiceDiPartenza[i] + j < righeScritte
              return (
                <div
                  key={riga.campo}
                  className="grid gap-[var(--s-8)] py-[var(--s-8)] sm:grid-cols-[9rem_1fr]"
                  style={{
                    opacity: scritta ? 1 : 0,
                    transform: scritta ? 'none' : 'translateX(-8px)',
                    transition: 'opacity 380ms var(--ease-out), transform 380ms var(--ease-out)',
                  }}
                >
                  <span className="numero" style={{ paddingTop: 3 }}>
                    {riga.campo}
                  </span>
                  <span
                    className="text-[15px]"
                    style={{
                      color: riga.forte ? 'var(--accent-ink)' : 'var(--fg)',
                      fontWeight: riga.forte ? 500 : 400,
                    }}
                  >
                    {riga.valore}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Con reduced-motion la storia resta, il movimento no. Non è una versione
   povera: è la stessa informazione impaginata come un documento. */
function VersioneStatica() {
  return (
    <section id="il-documento" className="fascia-lg">
      <div className="gabbia">
        <Occhiello>Il documento che regge</Occhiello>
        <h2 className="mt-[var(--s-21)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
          Come si compone un consenso
        </h2>
        <div className="mt-[var(--s-55)] grid gap-[var(--s-21)] md:grid-cols-2 lg:grid-cols-3">
          {TAPPE.map((tappa, i) => (
            <div key={tappa.chiave} className="foglio" style={{ padding: 'var(--s-21)' }}>
              <p className="numero">
                {String(i + 1).padStart(2, '0')} · {tappa.etichetta}
              </p>
              <h3 className="mt-[var(--s-13)] text-[1.3rem]">{tappa.titolo}</h3>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                {tappa.testo}
              </p>
              <dl className="mt-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                {tappa.righe.map((r) => (
                  <div key={r.campo} className="py-[var(--s-8)]">
                    <dt className="numero">{r.campo}</dt>
                    <dd className="text-[13px]" style={{ color: 'var(--fg)' }}>
                      {r.valore}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
