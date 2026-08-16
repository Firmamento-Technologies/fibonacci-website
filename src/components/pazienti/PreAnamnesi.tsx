'use client'

import { PREANAMNESI_ATTIVA } from '@/lib/site-config'

/* La pre-anamnesi che il paziente compila prenotando. — TD-123
 *
 * ⚖️ Idea dell'utente: *«il paziente mette già i suoi dati e un'altra serie di
 * dati che velocizza l'anamnesi; se il dottore accetta gli compare in
 * automatico il nuovo paziente con i dati già compilati»*.
 * ⚖️ E il vincolo, dell'utente, dello stesso giorno: **«fai tutto ma non
 * collegarlo all'EMR per ora»**.
 *
 * ── 🔑 IL VINCOLO HA MIGLIORATO IL DISEGNO, E VA CAPITO PERCHE' ────────────
 * «Costruire senza collegare» qui ⛔ **non può** voler dire *«il modulo c'è, le
 * risposte non partono»*: sarebbe la cosa peggiore delle due — un paziente che
 * scrive allergie e farmaci **credendo** che arrivino a qualcuno, e non
 * arrivano. È il difetto di `LEAD_API_URL` («il modulo diceva di aver preso il
 * contatto e non l'aveva preso») applicato a dati sanitari.
 *
 * ⇒ **Interruttore, spento di default, e da spento la sezione ⛔ non esiste.**
 * Nessuna casella, nessuna domanda, niente da compilare. Il codice è pronto e
 * revisionabile; l'unica cosa che manca è la parte che lo consuma, ed è
 * **dichiarata** invece che simulata.
 *
 *     NEXT_PUBLIC_PREANAMNESI=true npm run build   ⇒ la sezione compare
 *
 * ⛔ **Non si accende prima che il sidecar accetti e conservi le risposte** e
 * che il rifiuto del medico le **cancelli**. Vedi [[piano-pre-anamnesi-prenotazione]].
 *
 * ── LE TRE REGOLE CHE QUESTO COMPONENTE FA RISPETTARE ──────────────────────
 * 1. ⚠️ **Facoltativa, e la prenotazione funziona senza.** Sono dati dell'art. 9
 *    raccolti da un modulo anonimo: se l'appuntamento dipendesse dal
 *    compilarli, il consenso ⛔ non sarebbe libero (EDPB) e cadrebbe tutto.
 *    Perciò ⛔ nessun campo è obbligatorio e ⛔ non c'è nessuna validazione che
 *    blocchi l'invio.
 * 2. 🔑 **Il consenso è una casella a parte, spenta**, ⛔ non una riga nelle
 *    condizioni: un consenso preselezionato o incorporato in un altro non è
 *    consenso. E dice **dove vanno i dati** (allo studio) e **cosa succede se
 *    il medico rifiuta** (si cancellano).
 * 3. ⚠️ **Poche domande, e nessuna diagnostica.** ⛔ Non è un questionario
 *    clinico e ⛔ non deve sembrarlo: chiedere «che patologie hai» a un
 *    anonimo, prima che esista un rapporto di cura, raccoglie molto più di
 *    quanto serva a far arrivare il medico preparato. Le tre qui sotto sono le
 *    uniche che cambiano davvero la prima visita in medicina estetica.
 */

export interface DatiPreAnamnesi {
  consenso: boolean
  farmaci: string
  allergie: string
  trattamentiPrecedenti: string
  /* 🔬 Aggiunto il 2026-08-16 su una FONTE, non a intuito. Il consenso europeo
   * sul percorso del paziente (PMC10847668) elenca fra le «Optimal Assessment
   * Strategies» proprio «allergies, illnesses, previous surgeries,
   * immunizations, and if the patient is currently pregnant or breastfeeding»:
   * delle quattro voci che toccano questo modulo era l'unica che mancava.
   *
   * ⚠️ E resta un CAMPO LIBERO, non una casella si/no, per una ragione che
   * conta: una casella ha un valore anche quando nessuno la tocca, e il medico
   * leggerebbe «non incinta» dove la persona semplicemente non ha risposto.
   * Un campo vuoto dice «non risposto», che e' la verita'. */
  gravidanza: string
}

export const PRE_ANAMNESI_VUOTA: DatiPreAnamnesi = {
  consenso: false,
  farmaci: '',
  allergie: '',
  trattamentiPrecedenti: '',
  gravidanza: '',
}

/** Se la sezione è spenta, ⛔ **non c'è niente da spedire**: chi invia il
 *  modulo usa questa funzione invece di leggere il flag per conto suo — una
 *  seconda lettura è un secondo posto dove divergere. */
export function preAnamnesiDaInviare(d: DatiPreAnamnesi): DatiPreAnamnesi | undefined {
  if (!PREANAMNESI_ATTIVA || !d.consenso) return undefined
  if (
    !d.farmaci.trim() &&
    !d.allergie.trim() &&
    !d.trattamentiPrecedenti.trim() &&
    !d.gravidanza.trim()
  )
    return undefined
  return d
}

export function PreAnamnesi({
  dati,
  onChange,
}: {
  dati: DatiPreAnamnesi
  onChange: (d: DatiPreAnamnesi) => void
}) {
  if (!PREANAMNESI_ATTIVA) return null

  const campo = (k: keyof DatiPreAnamnesi) => (e: { target: { value: string } }) =>
    onChange({ ...dati, [k]: e.target.value })

  return (
    <fieldset className="pre-anamnesi">
      <legend className="pre-anamnesi-titolo">Vuoi far arrivare il medico preparato?</legend>
      {/* ⚠️ **«Facoltativo» sta nella prima riga, non in fondo in grigio.** Chi
          legge in fretta deve poterlo saltare **sapendo** di poterlo saltare. */}
      <p className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>
        È facoltativo: puoi chiedere l’appuntamento senza scrivere niente qui.
      </p>

      {/* 🔑 Il consenso **prima** delle domande: si acconsente a dare i dati,
          poi si danno. L'ordine inverso raccoglie e poi chiede il permesso. */}
      <label className="pre-anamnesi-consenso">
        <input
          type="checkbox"
          checked={dati.consenso}
          onChange={(e) => onChange({ ...dati, consenso: e.target.checked })}
        />
        <span className="text-[15px]">
          Acconsento a inviare allo studio queste informazioni sulla mia salute, perché il
          medico arrivi preparato alla visita. Restano allo studio;{' '}
          <strong>se non accetta l’appuntamento vengono cancellate</strong>.
        </span>
      </label>

      {/* ⛔ Le domande compaiono **dopo** il consenso: prima non c'è niente da
          compilare, quindi non c'è modo di scrivere dati che nessuno ha
          autorizzato a partire. */}
      {dati.consenso && (
        <div className="pre-anamnesi-campi">
          <Domanda
            id="pa-farmaci"
            etichetta="Prendi farmaci con regolarità?"
            aiuto="Anche integratori e anticoagulanti: cambiano cosa si può fare e quando."
            valore={dati.farmaci}
            onChange={campo('farmaci')}
          />
          <Domanda
            id="pa-allergie"
            etichetta="Hai allergie note?"
            aiuto="Farmaci, anestetici, lattice."
            valore={dati.allergie}
            onChange={campo('allergie')}
          />
          <Domanda
            id="pa-gravidanza"
            etichetta="Sei incinta o stai allattando?"
            aiuto="Solo se ti riguarda: molti trattamenti si rimandano, e il medico deve saperlo prima."
            valore={dati.gravidanza}
            onChange={campo('gravidanza')}
          />
          <Domanda
            id="pa-trattamenti"
            etichetta="Hai già fatto trattamenti di medicina estetica?"
            aiuto="Quali e all’incirca quando: serve a non sovrapporre."
            valore={dati.trattamentiPrecedenti}
            onChange={campo('trattamentiPrecedenti')}
          />
          {/* ⚠️ **La riga che protegge il paziente da noi.** Quello che scrive
              qui è **dichiarato, non accertato**: nell'EMR arriverà marcato
              così, e ⛔ non sostituisce l'anamnesi che il medico farà in visita.
              Scriverlo qui evita che qualcuno lo prenda per una cartella già
              fatta — e la stessa frase vale dall'altra parte. */}
          <p className="text-[13px]" style={{ color: 'var(--fg-muted)' }}>
            Quello che scrivi qui non sostituisce la visita: il medico ti richiederà queste
            cose di persona, e le verificherà.
          </p>
        </div>
      )}
    </fieldset>
  )
}

function Domanda({
  id,
  etichetta,
  aiuto,
  valore,
  onChange,
}: {
  id: string
  etichetta: string
  aiuto: string
  valore: string
  onChange: (e: { target: { value: string } }) => void
}) {
  return (
    <p style={{ marginTop: 'var(--s-13)' }}>
      <label htmlFor={id} className="block text-[15px]" style={{ fontWeight: 500 }}>
        {etichetta}
      </label>
      <span className="block text-[13px]" style={{ color: 'var(--fg-muted)' }}>
        {aiuto}
      </span>
      <textarea
        id={id}
        value={valore}
        onChange={onChange}
        rows={2}
        className="campo-ricerca"
        style={{ minHeight: '4rem', padding: 'var(--s-8) var(--s-13)', resize: 'vertical' }}
      />
    </p>
  )
}
