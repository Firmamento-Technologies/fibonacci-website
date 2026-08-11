import { Children, isValidElement, type ReactNode } from 'react'
import Link from 'next/link'
import { prossima } from '@/lib/percorso'

/* Trasforma le sezioni di una pagina in TAPPE: una schermata ciascuna, con la
 * freccia a V in fondo che porta alla successiva.
 *
 * ── PERCHÉ QUI E NON PAGINA PER PAGINA ──────────────────────────────────────
 * Le pagine lunghe sono dieci. Marcare le tappe a mano in dieci file vuol dire
 * dieci occasioni di dimenticarsene una, e la prossima pagina nuova nascerebbe
 * fuori dal percorso senza che nessuno se ne accorga. Qui il guscio prende i
 * figli di primo livello e li tratta come tappe: una pagina nuova entra nel
 * percorso per costruzione.
 *
 * ── PERCHÉ ANCORE E NON JAVASCRIPT ──────────────────────────────────────────
 * La freccia dentro la pagina è `<a href="#tappa-3">`: funziona a JavaScript
 * spento, ogni tappa ha un indirizzo proprio (si può linkare «la parte sui
 * prezzi»), e lo scorrimento morbido lo fa già il CSS del sito. Un gestore
 * `onClick` avrebbe l'aria di funzionare uguale e perderebbe tutte e tre le
 * cose.
 *
 * ⚠️ L'ULTIMA tappa non punta a un'ancora: punta alla PAGINA successiva del
 * percorso. È la cucitura fra le due scale — dentro la pagina e fra le pagine —
 * e deve essere invisibile a chi scorre.
 *
 * ⛔ Nessun `overflow: hidden`. Se una tappa contiene più di una schermata si
 * allunga e si scorre: tagliarla nasconderebbe testo senza dirlo, ed è il
 * difetto peggiore possibile su una pagina che deve convincere.
 */

/** Tag che non rendono niente di visibile: non possono essere una tappa. */
const INVISIBILI = new Set(['script', 'style', 'link', 'meta', 'noscript', 'template'])

export function Tappe({ children, href }: { children: ReactNode; href: string }) {
  /* ⚠️ I figli si AVVOLGONO, non si clonano. Nel guscio `Pagina` i figli sono
     `<section>` e clonarli per aggiungere una classe funzionava; nella home
     sono COMPONENTI (`<Hero />`, `<Sigillo />`…), e `cloneElement` avrebbe
     passato loro una prop `className` che nessuno legge — la tappa sarebbe
     rimasta senza altezza, in silenzio, solo sulla pagina più importante del
     sito. Avvolgere funziona in entrambi i casi; lo stile va al figlio via
     `.tappa > :not(.freccia-avanti)`. */
  const figli = Children.toArray(children)
    .filter(isValidElement)
    /* ⛔ Fuori i figli che non si vedono. Su `/domande` il JSON-LD dello
       schema FAQ — un `<script>` — era diventato **tappa 2**: una schermata
       bianca con in fondo la freccia, in mezzo al percorso. Il difetto non
       dava errore da nessuna parte: il componente era valido, la tappa era
       alta il giusto, semplicemente non c'era niente dentro.
       ⚠️ Questo filtro vede solo i tag scritti direttamente qui. Un
       `<script>` avvolto in un componente (era proprio il caso) resta
       invisibile a questo controllo: lo prende `scripts/altezza-pagine.mjs`,
       che boccia le tappe senza contenuto visibile. Servono entrambi. */
    .filter((f) => !INVISIBILI.has(f.type as string))
  const dopo = prossima(href)

  return (
    <>
      {figli.map((figlio, i) => {
        const ultima = i === figli.length - 1
        const id = `tappa-${i + 1}`
        const bersaglio = ultima ? dopo?.href : `#tappa-${i + 2}`
        const etichetta = ultima ? dopo?.titolo : 'Continua'

        return (
          <div key={id} className="tappa" id={id}>
            {figlio}

            {bersaglio && (
              <div className={`freccia-avanti ${ultima ? '' : 'freccia-avanti--interna'}`}>
                {ultima ? (
                  <Link href={bersaglio} aria-label={`Avanti: ${etichetta}`}>
                    <span aria-hidden="true">{etichetta}</span>
                    <ViaV />
                  </Link>
                ) : (
                  /* Dentro la pagina resta un'ancora vera: niente `<Link>`, che
                     qui intercetterebbe il click per fare routing su un
                     frammento della stessa pagina. */
                  <a href={bersaglio} aria-label={`Continua: sezione ${i + 2} di ${figli.length}`}>
                    <span aria-hidden="true">{etichetta}</span>
                    <ViaV />
                  </a>
                )}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

/** La V: due segmenti. Nessuna icona importata per quattordici pixel di tratto. */
function ViaV() {
  return (
    <svg viewBox="0 0 24 14" width="24" height="14" aria-hidden="true" focusable="false">
      <path
        d="M2 2 L12 11 L22 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
