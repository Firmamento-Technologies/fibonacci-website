'use client'

import { useState } from 'react'
import { IconaLuogo } from '@/components/pazienti/Icone'

/* La mappa dello studio, nella scheda del medico. — TD-95
 *
 * ⚖️ **Richiesta dell'utente (2026-08-13)**: *«bisogna aggiungere la mappa che
 * sia maps o altro in allegato all'interno della pagina del dottore mostrando
 * dove si trova»*. Legittima e ovvia: dopo aver scelto uno studio, «dov'è» è
 * la domanda successiva, e un indirizzo scritto non la risponde a colpo
 * d'occhio.
 *
 * ── 🔴 PERCHE' NON E' UN `<iframe>` E BASTA, E PERCHE' NON E' UN CAPRICCIO ───
 * Questo sito **non ha il banner dei cookie**, e non è una scelta di gusto: è
 * una **proprietà tecnica** — non chiama nessun terzo, quindi non c'è nulla da
 * far consentire. È scritto nella pagina privacy **già pubblicata**, ed è il
 * primo argomento di fiducia del canale paziente («non ti profiliamo»).
 *
 * Una mappa incorporata la butta via **da sola**: l'`iframe` parte al
 * caricamento, manda a un terzo **l'IP del visitatore** e — cosa peggiore —
 * **l'indirizzo della pagina**, cioè *quale medico* sta guardando quella
 * persona. È un dato sanitario per inferenza, su un canale nato per non farlo
 * uscire. ⇒ la pagina privacy diventerebbe **falsa** e servirebbe il banner.
 * Vedi [[piano-ui-canale-paziente]] §7, dove la mappa interattiva era stata
 * scartata per queste ragioni.
 *
 * ── 🔑 LA FORMA CHE TIENE INSIEME LE DUE COSE: SI CARICA SU RICHIESTA ───────
 * A pagina ferma **non parte niente**: c'è un riquadro con l'indirizzo e un
 * pulsante. La mappa arriva **solo se il paziente la chiede**, e quel gesto
 * *è* il consenso — esplicito, informato (il riquadro dice cosa succede) e
 * revocabile non facendolo. È il modello «click-to-load», lo stesso che i
 * garanti europei indicano per i contenuti di terzi.
 *
 * ⚠️ **OpenStreetMap e non Google**, qui: l'embed di OSM non porta l'impianto
 * pubblicitario, e ⛔ la scelta è diversa da quella del **collegamento**
 * dell'indirizzo (che va su Google Maps, perché su Android apre l'app). Sono
 * due gesti diversi: uscire dal sito è una navigazione del visitatore;
 * incorporare è una nostra decisione, e su quella si sceglie il meno invasivo.
 *
 * ⛔ **Non aggiungere `geo`/coordinate finte**: gli studi d'esempio non
 * esistono e i centroidi di provincia direbbero che lo studio sta al centro
 * della provincia. La mappa cerca l'**indirizzo**, che è il dato che abbiamo.
 */
export function MappaStudio({
  indirizzo,
  comune,
  mappaEsterna,
}: {
  indirizzo: string
  comune: string
  /** L'indirizzo aperto nell'app di mappe: viene da `mappaStudio()`. */
  mappaEsterna: string
}) {
  const [accesa, setAccesa] = useState(false)
  const query = encodeURIComponent(`${indirizzo}, ${comune}`)

  if (!accesa) {
    return (
      <div className="mappa-segnaposto">
        <IconaLuogo lato={24} />
        <p style={{ fontWeight: 500 }}>
          {indirizzo}, {comune}
        </p>
        <button type="button" className="btn btn-secondario" onClick={() => setAccesa(true)}>
          Mostra la mappa
        </button>
        {/* 🔑 **Si dice cosa succede premendo, prima di premere.** Un
            «click-to-load» che non spiega cosa carica è un consenso raccolto
            al buio: la forma sarebbe rispettata e la sostanza no. */}
        <p className="text-[13px]" style={{ color: 'var(--fg-muted)', maxWidth: '30rem' }}>
          La mappa arriva da OpenStreetMap: premendo, il tuo browser si collega a un sito
          esterno. Finché non lo fai, questa pagina non contatta nessuno.
        </p>
      </div>
    )
  }

  return (
    <figure style={{ margin: 0 }}>
      <iframe
        title={`Mappa di ${indirizzo}, ${comune}`}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&query=${query}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="mappa-riquadro"
      />
      <figcaption className="mt-[var(--s-8)] text-[15px]">
        <a href={mappaEsterna} target="_blank" rel="noopener noreferrer" className="collegamento-testo">
          Apri in Google Maps e ottieni le indicazioni
        </a>
      </figcaption>
    </figure>
  )
}
