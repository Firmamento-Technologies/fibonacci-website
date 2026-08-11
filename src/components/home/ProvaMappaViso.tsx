'use client'

/* La mappa del viso, da provare qui — non una schermata di essa.
 *
 * ── PERCHÉ ESISTE ──────────────────────────────────────────────────────────
 * Il primo schermo mostrava una cattura della cartella **intera**: barra
 * laterale, seconda colonna, elenco sedute. A quella dimensione non si legge
 * un carattere, e NN/G (tier 1) divide le immagini in *informative* e
 * *decorative* — le seconde non vengono guardate poco, vengono **ignorate**.
 * Una schermata illeggibile è decorativa e si tiene solo la freddezza.
 * ([[sintesi-hero-schermata-vs-foto-2026-08-07]])
 *
 * La raccomandazione di quella ricerca era «immagine di prodotto ritagliata su
 * **una cosa sola e leggibile**». Questo va un passo oltre: la cosa sola non è
 * una figura, è il componente vero, e si tocca.
 *
 * 🔑 PERCHÉ PROPRIO QUESTO PEZZO, e non un altro. La mappa del viso è l'unica
 * parte del prodotto su cui un medico si è espresso: il commento in testa a
 * `face-aggregate-map.tsx` nell'EMR registra «call Pietro (2026-05-17 §5.2)
 * *meglio del 3D per uso quotidiano*». È anche l'unica che si può portare qui
 * senza backend: nell'applicazione è **CSS puro**, niente Three.js, niente
 * Medplum — riceve i dati come proprietà.
 *
 * ⛔ NON È LA DEMO. La demo vera (`/demo` nell'EMR) vuole Medplum acceso, ed è
 * la strada che ha già prodotto «Entra nella demo → 502» quando la macchina è
 * sparita. Questo non promette niente che non sia già in pagina: è in pagina.
 *
 * ⚖️ Parità coi dati dell'applicazione, non con la sua grafica: vedi
 * `src/lib/aree-viso.ts` e il controllo in `scripts/collaudo.mjs`.
 */

import { useState } from 'react'
import {
  AREE_VISO,
  CONTEGGI_FINTI,
  ETICHETTA_AREA,
  STORICO_FINTO,
  coordPerSesso,
  xNelRitaglio,
  type CategoriaProdotto,
  type SessoRitratto,
} from '@/lib/aree-viso'
import { assetPath } from '@/lib/asset-path'

/* Colore per CATEGORIA di prodotto: è un colore di **dominio**, non di stato —
 * serve a distinguere a colpo d'occhio una tossina da un filler, come la
 * palette di un grafico. Per questo sta qui e non fra i token del tema, che
 * sono ruoli (accento, filetto, inchiostro) e non saprebbero dire «biostim».
 * Stessa logica dell'applicazione; i valori sono ritarati sull'accento del
 * sito, che è più profondo di quello del prodotto. */
const COLORE_CATEGORIA: Record<CategoriaProdotto, string> = {
  tossina: '#b45309',
  filler: '#0b699f',
  biostim: '#0f766e',
  peeling: '#9d174d',
}

const NOME_CATEGORIA: Record<CategoriaProdotto, string> = {
  tossina: 'Tossina',
  filler: 'Filler',
  biostim: 'Biostimolazione',
  peeling: 'Peeling',
}

const RITRATTI: { chiave: SessoRitratto; etichetta: string; file: string }[] = [
  { chiave: 'donna', etichetta: 'Donna', file: 'volto-donna' },
  { chiave: 'uomo', etichetta: 'Uomo', file: 'volto-uomo' },
]

/** Le larghezze generate da `scripts/volti.mjs`, come per le schermate. */
const LARGHEZZE = [480, 720, 960]

export function ProvaMappaViso() {
  const [sesso, setSesso] = useState<SessoRitratto>('donna')
  const [areaScelta, setAreaScelta] = useState<string | null>(null)

  const coord = coordPerSesso(sesso)
  const ritratto = RITRATTI.find((r) => r.chiave === sesso)!
  const attive = AREE_VISO.filter((a) => (CONTEGGI_FINTI[a.code] ?? 0) > 0 && a.code in coord)
  const sedute = areaScelta ? (STORICO_FINTO[areaScelta] ?? []) : []

  return (
    <div className="prova-viso" data-testid="prova-mappa-viso">
      {/* Chi guarda deve capire in una riga che questa cosa si tocca. */}
      <p className="prova-viso__invito">
        <strong>Provala qui.</strong> Scegli un’area del viso: sotto compare cosa è stato
        fatto, quando e con che prodotto.
      </p>

      <div className="prova-viso__pillole" role="group" aria-label="Ritratto di riferimento">
        {RITRATTI.map((r) => (
          <button
            key={r.chiave}
            type="button"
            onClick={() => {
              setSesso(r.chiave)
              setAreaScelta(null)
            }}
            aria-pressed={sesso === r.chiave}
            className={`prova-viso__pillola${sesso === r.chiave ? ' e-scelta' : ''}`}
          >
            {r.etichetta}
          </button>
        ))}
      </div>

      <div className="prova-viso__scena">
        <div className="prova-viso__volto">
          {/* Stesso motivo delle schermate: l'export statico non ha un
              ottimizzatore a runtime, quindi le varianti si generano in
              anticipo (`scripts/volti.mjs`) e si servono con srcset. I PNG
              d'origine pesavano 1,9 e 2,2 MB — sul primo schermo, cioè
              esattamente dove costano di più. */}
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
                ritaglio pesa 1,4 MB contro 65 KB. Misure reali di `volti.mjs`. */}
            <img
              src={assetPath(`/img/${ritratto.file}.jpg`)}
              alt={`Ritratto di riferimento (${ritratto.etichetta.toLowerCase()}) con le aree del viso trattate`}
              className="prova-viso__ritratto"
              draggable={false}
              width={960}
              height={1190}
            />
          </picture>

          {attive.map((area) => {
            const punto = coord[area.code]
            const conteggio = CONTEGGI_FINTI[area.code] ?? 0
            const scelta = areaScelta === area.code
            const categoria = STORICO_FINTO[area.code]?.[0]?.categoria ?? 'filler'
            return (
              <button
                key={area.code}
                type="button"
                onClick={() => setAreaScelta(scelta ? null : area.code)}
                aria-pressed={scelta}
                aria-label={`${area.label}: ${conteggio} trattament${conteggio === 1 ? 'o' : 'i'}`}
                title={`${area.label} — ${conteggio} trattament${conteggio === 1 ? 'o' : 'i'}`}
                className={`prova-viso__punto${scelta ? ' e-scelto' : ''}`}
                style={{
                  // ✂️ La x passa dal ritaglio, la y no: vedi `RITAGLIO`.
                  left: `${xNelRitaglio(punto.x) * 100}%`,
                  top: `${punto.y * 100}%`,
                  background: scelta ? 'var(--accent-deep)' : COLORE_CATEGORIA[categoria],
                }}
              >
                {conteggio}
              </button>
            )
          })}
        </div>

        <div className="prova-viso__storico" aria-live="polite">
          {areaScelta ? (
            <>
              <p className="prova-viso__area">{ETICHETTA_AREA[areaScelta]}</p>
              <ul className="prova-viso__sedute">
                {sedute.map((s, i) => (
                  <li key={i}>
                    <span
                      className="prova-viso__categoria"
                      style={{ background: COLORE_CATEGORIA[s.categoria] }}
                      aria-hidden
                    />
                    <span className="prova-viso__quando">{s.quando}</span>
                    <span className="prova-viso__prodotto">
                      {s.prodotto} <span className="prova-viso__dettaglio">· {s.dettaglio}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="prova-viso__nota">
                {NOME_CATEGORIA[sedute[0]!.categoria]} · {sedute.length} sedut
                {sedute.length === 1 ? 'a' : 'e'} registrate su quest’area
              </p>
            </>
          ) : (
            <p className="prova-viso__vuoto">
              Ogni pallino è un’area già trattata, e il numero dice quante volte.
              <br />
              Toccane uno.
            </p>
          )}
        </div>
      </div>

      {/* ⚠️ Detto, non sottinteso: chi guarda deve sapere che non sta vedendo
          una persona vera. Fibonacci non è in produzione e non ha pazienti. */}
      {/* ⚠️ «una persona inventata», non «una paziente»: il ritratto cambia
          con la pillola Donna/Uomo, e la didascalia deve reggere entrambi. */}
      <p className="prova-viso__didascalia">
        È il componente dell’applicazione, non un disegno. I dati sono di una persona
        inventata: Fibonacci non ha pazienti reali.
      </p>
    </div>
  )
}
