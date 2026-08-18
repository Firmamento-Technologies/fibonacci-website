'use client'

/* Segnare le aree trattate — il gesto vero, non una figura di esso.
 *
 * ── COSA SI PROVA QUI, e perché è questo ────────────────────────────────────
 * Il medico **clicca dove ha trattato**, a mano libera, dove capita. Il sistema
 * aggancia quel punto all'**area del vocabolario** più vicina: `face.glabella`,
 * non «più o meno fra le sopracciglia». Da lì esce un `BodySite` FHIR
 * codificato — ed è quello, non il disegno, che rende una cartella
 * interrogabile («chi ho trattato alla glabella?») e difendibile in giudizio.
 *
 * ⚠️ **La prima versione di questo componente mostrava la mappa in SOLA
 * LETTURA** — pallini con il conteggio dei trattamenti passati, click per
 * vedere lo storico. Sbagliata: era il prodotto *raccontato*, non *provato*.
 * Chi guarda non deve vedere che la cartella sa le cose, deve sentire che
 * registrarle è veloce. (Correzione dell'utente, 2026-08-11.)
 *
 * 🔑 PERCHÉ PROPRIO QUESTA FUNZIONE. È l'unica parte del prodotto su cui un
 * medico si è espresso — «meglio del 3D per uso quotidiano», call del
 * 2026-05-17, registrata nel commento di `face-aggregate-map.tsx` nell'EMR — ed
 * è l'unica portabile qui senza backend: nell'applicazione è CSS puro, niente
 * Three.js, niente Medplum.
 *
 * ⛔ NON È LA DEMO. La demo vera vuole Medplum acceso, ed è la strada che ha già
 * prodotto «Entra nella demo → 502». Questo non promette niente: è in pagina.
 *
 * ⚖️ Parità coi DATI dell'applicazione — aree, coordinate, raggio d'aggancio —
 * non con la sua grafica: vedi `src/lib/aree-viso.ts` e il controllo in
 * `scripts/parita-viso.mjs`.
 */

import { t } from '@/lib/testo'
import { Frase } from '@/components/ui/Frase'
import { useRef, useState } from 'react'
import {
  ETICHETTA_AREA,
  areaPiuVicina,
  coordPerSesso,
  xDalRitaglio,
  xNelRitaglio,
  type SessoRitratto,
} from '@/lib/aree-viso'
import { assetPath } from '@/lib/asset-path'

const RITRATTI: { chiave: SessoRitratto; etichetta: string; file: string }[] = [
  { chiave: 'donna', etichetta: t('home.provamappaviso.donna'), file: 'volto-donna' },
  { chiave: 'uomo', etichetta: t('home.provamappaviso.uomo'), file: 'volto-uomo' },
]

/** Le larghezze generate da `scripts/volti.mjs`. */
const LARGHEZZE = [480, 720, 960]

/** Quello che il medico ha appena segnato, in ordine di click. */
type Segnata = { code: string; x: number; y: number }

export function ProvaMappaViso() {
  const [sesso, setSesso] = useState<SessoRitratto>('donna')
  const [segnate, setSegnate] = useState<Segnata[]>([])
  const [mancato, setMancato] = useState(false)
  const volto = useRef<HTMLDivElement>(null)

  const ritratto = RITRATTI.find((r) => r.chiave === sesso)!
  const coord = coordPerSesso(sesso)

  function segna(e: React.MouseEvent<HTMLDivElement>) {
    if (!volto.current) return
    const r = volto.current.getBoundingClientRect()
    // Il click arriva in coordinate del RITAGLIO; le aree vivono nello spazio
    // del fotogramma originale, quindi si riporta indietro prima di cercare.
    const x = xDalRitaglio((e.clientX - r.left) / r.width)
    const y = (e.clientY - r.top) / r.height

    const code = areaPiuVicina(x, y, sesso)
    if (!code) {
      // ⚠️ Detto, non ignorato: fuori raggio NON si inventa un'area. È la
      // differenza fra un dato codificato e un disegno, ed è il punto.
      //
      // ⛔ E resta finché non serve più, senza timer: la prima versione lo
      // spegneva dopo 2,2 s, cioè faceva sparire la spiegazione di un click
      // che non ha fatto niente — chi guardava altrove vedeva solo che non
      // era successo nulla. Un timer che nasconde un messaggio d'errore è un
      // messaggio d'errore in meno. (In più non lascia un timeout appeso
      // quando il componente sparisce.)
      setMancato(true)
      return
    }
    setMancato(false)
    setSegnate((prima) =>
      prima.some((s) => s.code === code)
        ? prima.filter((s) => s.code !== code) // ri-cliccata = tolta
        : [...prima, { code, x: coord[code].x, y: coord[code].y }],
    )
  }

  return (
    <div className="prova-viso" data-testid="prova-mappa-viso">
      <p className="prova-viso__invito">
        <strong>{t('home.provamappaviso.provalo_qui')}</strong> {t('home.provamappaviso.clicca_sul_viso_dove_avresti_trattato')}
      </p>

      <div className="prova-viso__pillole" role="group" aria-label={t('home.provamappaviso.ritratto_di_riferimento')}>
        {RITRATTI.map((r) => (
          <button
            key={r.chiave}
            type="button"
            onClick={() => {
              setSesso(r.chiave)
              setSegnate([])
              setMancato(false)
            }}
            aria-pressed={sesso === r.chiave}
            className={`prova-viso__pillola${sesso === r.chiave ? ' e-scelta' : ''}`}
          >
            {r.etichetta}
          </button>
        ))}
      </div>

      <div className="prova-viso__scena">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div className="prova-viso__volto" ref={volto} onClick={segna}>
          {/* Le varianti si generano in anticipo (`scripts/volti.mjs`): l'export
              statico non ha un ottimizzatore a runtime. Gli originali erano PNG
              da 1,9 e 2,2 MB, sul primo schermo. */}
          <picture>
            <source
              type="image/avif"
              sizes="(min-width: 1024px) 420px, calc(100vw - 44px)"
              srcSet={LARGHEZZE.map((w) => `${assetPath(`/img/${ritratto.file}-${w}.avif`)} ${w}w`).join(', ')}
            />
            <source
              type="image/webp"
              sizes="(min-width: 1024px) 420px, calc(100vw - 44px)"
              srcSet={LARGHEZZE.map((w) => `${assetPath(`/img/${ritratto.file}-${w}.webp`)} ${w}w`).join(', ')}
            />
            {/* Ripiego JPEG e non PNG: è una fotografia, e in PNG lo stesso
                ritaglio pesa 1,4 MB contro 65 KB. Misure di `volti.mjs`. */}
            {/* ⚠️ `eager` + `sync` + `fetchPriority=high` come faceva
                `<Schermata priorita>`, che stava qui prima: questo ritratto è
                l'elemento LCP del primo schermo. Sostituendo il componente
                avevo perso quei tre attributi — il browser tornava a scaricarlo
                con priorità bassa, cioè un peggioramento di Core Web Vitals
                introdotto da un cambio che non c'entrava niente.
                ⛔ Vale solo per il ritratto INIZIALE: quello dell'altro sesso
                si carica quando si preme la pillola, e lì `eager` sprecherebbe
                banda sul percorso che quasi nessuno fa. */}
            <img
              src={assetPath(`/img/${ritratto.file}.jpg`)}
              alt={`Ritratto di riferimento (${ritratto.etichetta.toLowerCase()}) su cui segnare le aree trattate`}
              className="prova-viso__ritratto"
              draggable={false}
              width={960}
              height={1190}
              loading={sesso === 'donna' ? 'eager' : 'lazy'}
              decoding={sesso === 'donna' ? 'sync' : 'async'}
              fetchPriority={sesso === 'donna' ? 'high' : undefined}
            />
          </picture>

          {segnate.map((s, i) => (
            <button
              key={s.code}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSegnate((prima) => prima.filter((p) => p.code !== s.code))
              }}
              aria-label={`${ETICHETTA_AREA[s.code]}: segnata. Clicca per togliere.`}
              title={`${ETICHETTA_AREA[s.code]}: clicca per togliere`}
              className="prova-viso__punto"
              style={{ left: `${xNelRitaglio(s.x) * 100}%`, top: `${s.y * 100}%` }}
            >
              {i + 1}
            </button>
          ))}

          {mancato && (
            /* ⚠️ Niente numeri interni nel messaggio: la prima versione diceva
               «nessuna area entro 0,08 da lì», e 0,08 è una frazione del
               fotogramma — per chi legge non vuol dire niente. Si dice la
               cosa, non la soglia. */
            <p className="prova-viso__mancato" role="status">
              {t('home.provamappaviso.li_non_c_e_nessuna_area')}
            </p>
          )}
        </div>

        <div className="prova-viso__elenco" aria-live="polite">
          <p className="prova-viso__titolo">{t('home.provamappaviso.aree_trattate')} <span>{segnate.length > 0 ? `· ${segnate.length}` : ''}</span>
          </p>

          {segnate.length === 0 ? (
            <p className="prova-viso__vuoto">
              {t('home.provamappaviso.qui_compaiono_le_aree_man_mano')}
              <br />
              {t('home.provamappaviso.clicca_sul_viso')}
            </p>
          ) : (
            <>
              <ul className="prova-viso__aree">
                {segnate.map((s) => (
                  <li key={s.code}>
                    <span className="prova-viso__nome">{ETICHETTA_AREA[s.code]}</span>
                    {/* Il codice è il punto di tutto: senza, è un disegno. */}
                    <code className="prova-viso__codice">{s.code}</code>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="prova-viso__azzera"
                onClick={() => setSegnate([])}
              >
                {t('home.provamappaviso.ricomincia')}
              </button>
            </>
          )}
        </div>
      </div>

      <p className="prova-viso__didascalia">
        <Frase chiave="home.provamappaviso.e_il_componente_dell_applicazione_non" />
      </p>
    </div>
  )
}
