import { t } from '@/lib/testo'
import { IconaLuogo } from '@/components/pazienti/Icone'

/* La mappa dello studio, **dentro la pagina**. — TD-95
 *
 * ⚖️ **Decisione dell'utente, 2026-08-13, ribadita**: *«voglio vedere la mappa
 * dentro la UI non come link»*. Prima c'era un caricamento su richiesta (un
 * riquadro con l'indirizzo e un pulsante «Mostra la mappa»); l'utente l'ha
 * guardato e ha chiesto la mappa vera. Fatto.
 *
 * ── ⚠️ COSA CAMBIA, DETTO UNA VOLTA E NON RIPETUTO ─────────────────────────
 * Da adesso **questa pagina contatta un terzo al caricamento**. È un fatto, non
 * un'obiezione: cambia due cose che vanno tenute allineate, ⛔ non ignorate.
 *  1. La **pagina privacy** dice che il sito non chiama nessuno. Ora la scheda
 *     del medico lo fa, e la pagina va aggiornata — **TD-122**.
 *  2. La proprietà «niente banner dei cookie» dipende da cosa il riquadro
 *     deposita nel browser. 🔎 **Misurato**, non supposto: vedi la nota in
 *     `log.md` del 2026-08-13.
 *
 * 🔑 **OpenStreetMap e non Google**, e qui la scelta pesa più di prima: la
 * differenza fra i due non è la mappa, è cosa si portano dietro. Il riquadro di
 * Google Maps appartiene a un impianto pubblicitario; quello di OSM no.
 * ⛔ Il **collegamento** dell'indirizzo resta su Google Maps, perché su Android
 * apre l'app: uscire dal sito è una navigazione del visitatore, incorporare è
 * una nostra decisione — e su quella si sceglie il meno invasivo.
 *
 * ⚠️ `referrerPolicy="no-referrer"`: senza, il terzo riceverebbe **l'indirizzo
 * della pagina**, cioè *quale medico* sta guardando quella persona. È il dato
 * che questo canale esiste per non far uscire, e costa un attributo.
 *
 * ── 🔴 IL PREREQUISITO CHE NON AVEVO ───────────────────────────────────────
 * Un riquadro OSM si centra su un **bbox di coordinate**, ⛔ non su una stringa
 * d'indirizzo (un collegamento accetta il testo, una mappa no). Da qui il campo
 * `studio.coordinate`, e la regola: se il punto viene dal **comune** e non dal
 * civico, la pagina **lo dichiara** invece di fingere precisione.
 */
export function MappaStudio({
  indirizzo,
  comune,
  coordinate,
  mappaEsterna,
}: {
  indirizzo: string
  comune: string
  coordinate?: { lat: number; lon: number; esatta: boolean }
  /** L'indirizzo aperto nell'app di mappe: viene da `mappaStudio()`. */
  mappaEsterna: string
}) {
  /* ⛔ Senza coordinate ⛔ non si disegna una mappa a caso: si mostra ciò che si
     ha. Un riquadro centrato sul nulla è peggio di nessun riquadro. */
  if (!coordinate) {
    return (
      <div className="mappa-segnaposto">
        <IconaLuogo lato={24} />
        <p style={{ fontWeight: 500 }}>
          {indirizzo}, {comune}
        </p>
        <a href={mappaEsterna} target="_blank" rel="noopener noreferrer" className="btn btn-secondario">
          {t('pazienti.mappastudio.apri_in_google_maps')}
        </a>
      </div>
    )
  }

  /* Il riquadro attorno al punto: ~600 m di lato, che su una via mostra
     l'isolato e i riferimenti attorno senza perdere il contesto del quartiere. */
  const d = 0.004
  const bbox = [coordinate.lon - d, coordinate.lat - d, coordinate.lon + d, coordinate.lat + d]
    .map((n) => n.toFixed(5))
    .join('%2C')

  return (
    <figure style={{ margin: 0 }}>
      <iframe
        title={`Mappa di ${indirizzo}, ${comune}`}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coordinate.lat}%2C${coordinate.lon}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="mappa-riquadro"
      />
      <figcaption className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
        {/* 🔑 **La riga dell'approssimazione, quando serve.** Una mappa dichiara
            precisione per come è fatta: se il punto è il comune, il puntino
            mente in silenzio a meno che la pagina non lo dica. */}
        {!coordinate.esatta && (
          <>
            Posizione approssimata al comune: questo studio d’esempio non ha un indirizzo reale.{' '}
          </>
        )}
        <a href={mappaEsterna} target="_blank" rel="noopener noreferrer" className="collegamento-testo">
          {t('pazienti.mappastudio.apri_in_google_maps_per_le')}
        </a>
      </figcaption>
    </figure>
  )
}
