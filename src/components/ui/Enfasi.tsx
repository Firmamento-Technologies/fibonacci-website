/**
 * Un titolo con **una parola in corsivo**, preso dal dizionario.
 *
 * ── PERCHE' ESISTE ──────────────────────────────────────────────────────────
 * I titoloni del sito sono scritti come frammenti JSX con il corsivo dentro:
 *
 *     titolo={<>Tre piani, e l'elenco di quello che <span className="accento-corsivo">non</span> comprendono</>}
 *
 * 🔴 Misurato sul costruito il 2026-08-17: quei 14 titoli **restavano in
 * italiano** in tutte e quattro le lingue, nel punto piu' visibile della
 * pagina. Un visitatore tedesco trovava navigazione e scheda del browser in
 * tedesco e **il titolone in italiano**.
 *
 * ⛔ Le due strade sbagliate, e perche':
 *  · **spezzare** in tre pezzi («Tre piani, e l'elenco di quello che» +
 *    «non» + «comprendono») ⇒ in tedesco il verbo va in fondo e i pezzi si
 *    rimontano sbagliati. E il testo c'e' tutto, quindi nessun controllo se ne
 *    accorge;
 *  · **buttare il corsivo** e usare `t()` liscio ⇒ si perde in tutte le lingue
 *    un elemento del disegno che c'e' in tutte le pagine.
 *
 * 🔑 La frase resta **intera e una sola** nel dizionario, con la parola da
 *    enfatizzare fra asterischi:
 *
 *     "prezzi.titolo": "Tre piani, e l'elenco di quello che *non* comprendono"
 *     "prezzi.titolo" (de): "Drei Tarife, und die Liste dessen, was sie *nicht* enthalten"
 *
 *    Il traduttore sposta gli asterischi dove la sua lingua vuole l'enfasi, che
 *    e' precisamente la libertà che serve.
 */
import type { ChiaveSito } from '@/lib/testo'
import { t } from '@/lib/testo'

export function Enfasi({ chiave }: { chiave: ChiaveSito }) {
  const testo = t(chiave)
  // ⛔ `split` e non una regex con `replace`: qui non si costruisce HTML da una
  //    stringa, si costruiscono NODI. Niente `dangerouslySetInnerHTML`, quindi
  //    niente modo di iniettare markup dal dizionario.
  const pezzi = testo.split('*')
  return (
    <>
      {pezzi.map((p, i) =>
        // I pezzi in posizione dispari sono quelli fra asterischi.
        i % 2 === 1 ? (
          <span key={i} className="accento-corsivo">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  )
}
