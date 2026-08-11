import Link from 'next/link'
import { prossima } from '@/lib/percorso'

/* La freccia a V in fondo alla pagina: porta alla tappa successiva.
 *
 * ⚠️ PERCHÉ È UN LINK E NON UNO SCORRIMENTO. Il sito è un percorso di pagine,
 * non una pagina sola divisa in schermate: la freccia cambia URL, quindi ogni
 * tappa resta indirizzabile, condivisibile e indicizzabile. Una freccia che
 * «scorre» avrebbe l'aria di funzionare uguale e perderebbe tutte e tre le cose.
 *
 * ⛔ Sull'ultima tappa non compare. Una freccia che non porta da nessuna parte è
 * peggio di nessuna freccia: promette e non mantiene, ed è il difetto che questo
 * sito ha già pagato col pulsante della demo.
 *
 * ♿ Ha un testo per chi non vede la V — «Avanti: <titolo>» — perché una
 * freccia sola non dice dove va, e il piè di pagina non è un menu.
 */
export function FrecciaAvanti({ da }: { da: string }) {
  const p = prossima(da)
  if (!p) return null

  return (
    <div className="freccia-avanti">
      <Link href={p.href} aria-label={`Avanti: ${p.titolo}`}>
        <span aria-hidden="true">{p.titolo}</span>
        {/* Una V, disegnata: due segmenti e basta. Nessuna icona importata per
            quattordici pixel di tratto. */}
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
      </Link>
    </div>
  )
}
