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

/**
 * ── E IL SECONDO MARCATORE: `|`, l'a capo su schermo largo ──────────────────
 * Alcuni titoli hanno un `<br className="a-capo-largo" />` in mezzo: manda a
 * capo **solo** oltre una certa larghezza, perche' su un telefono forzerebbe
 * una riga in piu' e il titolo si prenderebbe mezzo primo schermo.
 *
 * 🔑 Dove cade quell'a capo **dipende dalla lingua**: il tedesco ha parole
 * lunghe e la spezzatura buona non e' nello stesso punto dell'italiano. ⇒ il
 * marcatore sta nel dizionario, e lo sposta il traduttore. ⛔ Tenerlo nel codice
 * avrebbe imposto a cinque lingue la metrica di una.
 *
 *     "pazienti.titolo": "Trova il tuo medico estetico| e prenota."
 */
export function Enfasi({ chiave }: { chiave: ChiaveSito }) {
  const testo = t(chiave)
  // ⛔ `split` e non una regex con `replace`: qui non si costruisce HTML da una
  //    stringa, si costruiscono NODI. Niente `dangerouslySetInnerHTML`, quindi
  //    niente modo di iniettare markup dal dizionario.
  return (
    <>
      {testo.split('*').map((pezzo, i) => {
        // I pezzi in posizione dispari sono quelli fra asterischi.
        //
        // ⚠️ Lo spazio attorno al `|` viene ASSORBITO. Tre traduzioni su quattro
        // hanno scritto «doctor | and book» invece di «doctor| and book»: senza
        // questa riga resterebbe uno spazio orfano a fine riga, e prima
        // dell'a capo si vedrebbe. ⛔ Correggere le quattro voci e sperare che
        // la prossima traduzione sia precisa non e' un presidio: il componente
        // deve reggere la variazione, che e' inevitabile con cinque lingue.
        const contenuto = pezzo.split('|').map((p, j, tutti) => (
          <span key={j}>
            {/* 🔴 LO SPAZIO PRIMA DEL `<br>` E' OBBLIGATORIO, e togliendolo ho
                rotto la pagina. `a-capo-largo` manda a capo **solo** su schermo
                largo: su un telefono il `<br>` non c'e', e senza spazio le due
                parole si attaccano — visto a video, «Arztund buche». Lo spazio
                messo PRIMA dell'a capo invece funziona in tutti e due i casi:
                su schermo largo finisce a fine riga e non si vede, su telefono
                separa. ⛔ Non toglierlo per «pulire». */}
            {j > 0 && (
              <>
                {' '}
                <br className="a-capo-largo" />
              </>
            )}
            {tutti.length > 1 ? p.trim() : p}
          </span>
        ))
        return i % 2 === 1 ? (
          <span key={i} className="accento-corsivo">
            {contenuto}
          </span>
        ) : (
          <span key={i}>{contenuto}</span>
        )
      })}
    </>
  )
}
