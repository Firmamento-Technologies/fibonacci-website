'use client'

import { useState, type FormEvent } from 'react'
import { PRENOTA_API_URL } from '@/lib/site-config'
import type { SchedaMedicoPubblica, SlotPubblico } from '@/lib/medici-pubblici'
import { giornoInItaliano, oraInItaliano } from '@/lib/medici-pubblici'

/* Il modulo di prenotazione, lato paziente — l'ultimo pezzo di TD-95.
 *
 * 🔑 **È una pelle sottile, e deve restarlo.** Tutto ciò che decide sta nel
 * sidecar: il gate d'emergenza (TD-104, uscito dal browser il 2026-08-12), il
 * tetto per numero di telefono in Valkey, la verifica che lo Slot sia davvero
 * offerto. ⛔ Qui non si giudica niente: si spedisce e **si mostra la risposta
 * del server**.
 *
 * ── PERCHE' NON SI RI-IMPLEMENTA NIENTE ────────────────────────────────────
 * La tentazione sarebbe rilevare l'emergenza anche qui, per dare una risposta
 * più rapida. ⛔ **No**: sarebbe la **quarta** copia della REGOLA-118 — e la
 * chiusura di TD-104 le ha appena portate **da tre a una**, cancellando pure
 * il test di parità che le teneva insieme. Una copia nel browser tornerebbe a
 * divergere, e stavolta in silenzio, perché non ci sarebbe più nessun presidio
 * a confrontarle.
 *
 * ── LE TRE RISPOSTE CHE CONTANO ────────────────────────────────────────────
 * · **409** → `{ urgenza, destinazione, messaggio }`. ⚠️ **Non è un errore di
 *   validazione e non va mostrato come tale**: chi ha appena scritto che gli si
 *   sta gonfiando la gola non deve vedere un campo rosso. Il commento nel
 *   sidecar lo dice: *«400 dice "i dati sono sbagliati, correggili"; 409 dice
 *   "la richiesta è comprensibile ma non è di questo canale"»*. Si mostra il
 *   **messaggio del server**, in evidenza, e il modulo sparisce.
 * · **400** → una stringa **già scritta per il paziente** dal sidecar: si
 *   mostra quella, ⛔ mai un codice HTTP.
 * · **ok** → lo stato è **`richiesta-inviata`**, ⛔ mai «prenotato»: il
 *   paziente ha accettato, lo studio no.
 */

type Stato = 'fermo' | 'invio' | 'inviata' | 'urgenza' | 'errore'

export function ModuloPrenotazione({ m }: { m: SchedaMedicoPubblica }) {
  const [slot, setSlot] = useState<SlotPubblico | null>(null)
  const [dati, setDati] = useState({ nome: '', telefono: '', motivo: '' })
  const [stato, setStato] = useState<Stato>('fermo')
  const [messaggio, setMessaggio] = useState('')

  const aggiorna = (campo: keyof typeof dati) => (e: { target: { value: string } }) =>
    setDati((d) => ({ ...d, [campo]: e.target.value }))

  /* ⚠️ **Il canale è spento finché non c'è un indirizzo**, ed è la lezione già
     pagata con `DEMO_URL` e `LEAD_API_URL`: un modulo che spedisce nel vuoto è
     peggio di un modulo assente, perché il paziente crede di aver prenotato.
     ⛔ E l'indirizzo non si configura prima di **TD-92** (CAPTCHA all'edge). */
  if (!PRENOTA_API_URL) {
    return (
      <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
        La prenotazione online da questa pagina non è ancora attiva: per un appuntamento si
        chiama lo studio.
      </p>
    )
  }

  async function invia(e: FormEvent) {
    e.preventDefault()
    if (!slot) return
    setStato('invio')
    try {
      const r = await fetch(`${PRENOTA_API_URL.replace(/\/$/, '')}/pubblico/prenota`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioId: m.organizationId,
          slotId: slot.id,
          nome: dati.nome,
          telefono: dati.telefono,
          motivo: dati.motivo,
        }),
      })
      const corpo = (await r.json().catch(() => ({}))) as {
        detail?: string | { urgenza?: boolean; messaggio?: string }
      }

      if (r.status === 409) {
        const d = corpo.detail
        setMessaggio(
          typeof d === 'object' && d?.messaggio
            ? d.messaggio
            : 'Da quello che hai scritto potrebbe trattarsi di un’urgenza: non aspettare una risposta da qui.',
        )
        setStato('urgenza')
        return
      }
      if (!r.ok) {
        setMessaggio(
          typeof corpo.detail === 'string'
            ? corpo.detail
            : 'Non è stato possibile inviare la richiesta. Puoi chiamare lo studio.',
        )
        setStato('errore')
        return
      }
      setStato('inviata')
    } catch {
      /* Rete assente o sidecar giù: ⛔ non si dice «inviata». Si dice che non è
         partita e si offre il telefono, che funziona sempre. */
      setMessaggio('Non è stato possibile inviare la richiesta. Puoi chiamare lo studio.')
      setStato('errore')
    }
  }

  /* ── L'urgenza prende tutta la scena ──────────────────────────────────────
     ⚠️ Il modulo **sparisce**: lasciarlo sotto inviterebbe a riprovare, e
     riprovare è esattamente la cosa sbagliata da fare adesso. */
  if (stato === 'urgenza') {
    return (
      <div
        role="alert"
        style={{
          marginTop: 'var(--s-21)',
          padding: 'var(--s-21)',
          background: 'var(--bg-sunk)',
          borderRadius: 'var(--r-lg)',
        }}
      >
        <p style={{ fontWeight: 500 }}>{messaggio}</p>
        <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          Questa pagina non può darti assistenza medica: la tua richiesta di appuntamento{' '}
          <strong>non è stata inviata</strong>.
        </p>
      </div>
    )
  }

  if (stato === 'inviata') {
    return (
      <div role="status" style={{ marginTop: 'var(--s-21)' }}>
        {/* ⚖️ «Richiesta inviata», ⛔ mai «prenotato»: il paziente ha accettato,
            lo studio no — ed è la ragione per cui il sidecar crea
            l'appuntamento in stato `pending`. */}
        <p style={{ fontWeight: 500 }}>Richiesta inviata.</p>
        <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          È lo studio a confermarla: ti richiamano al numero che hai lasciato. Finché non ti
          confermano, l’appuntamento <strong>non è preso</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={invia} style={{ marginTop: 'var(--s-21)' }}>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          Scegli un orario · {giornoInItaliano(m.slot[0].inizio)}
        </legend>
        <ul
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-8)', marginTop: 'var(--s-8)' }}
        >
          {m.slot.map((s) => {
            const scelto = slot?.id === s.id
            return (
              <li key={s.id} style={{ listStyle: 'none' }}>
                <button
                  type="button"
                  onClick={() => setSlot(s)}
                  aria-pressed={scelto}
                  className={`btn ${scelto ? 'btn-primario' : 'btn-secondario'}`}
                >
                  {oraInItaliano(s.inizio)}
                </button>
              </li>
            )
          })}
        </ul>
      </fieldset>

      {slot && (
        <div style={{ marginTop: 'var(--s-21)', maxWidth: 'var(--measure)' }}>
          <Campo
            id="p-nome"
            etichetta="Nome"
            valore={dati.nome}
            onChange={aggiorna('nome')}
            completamento="name"
            richiesto
          />
          <Campo
            id="p-tel"
            etichetta="Telefono"
            tipo="tel"
            valore={dati.telefono}
            onChange={aggiorna('telefono')}
            completamento="tel"
            richiesto
          />
          <Campo
            id="p-motivo"
            etichetta="Motivo (facoltativo)"
            valore={dati.motivo}
            onChange={aggiorna('motivo')}
            completamento="off"
          />

          {/* ⚖️ Chi tratta i dati si dice **prima** di raccoglierli, non dopo. */}
          <p className="mt-[var(--s-13)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
            Quello che scrivi va allo studio, che è il titolare del trattamento. Non lo usiamo
            per altro.
          </p>

          {stato === 'errore' && (
            <p role="alert" className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg)' }}>
              {messaggio}
            </p>
          )}

          <p className="mt-[var(--s-21)]">
            <button type="submit" className="btn btn-primario" disabled={stato === 'invio'}>
              {stato === 'invio' ? 'Invio…' : 'Invia la richiesta'}
            </button>
          </p>
        </div>
      )}
    </form>
  )
}

function Campo({
  id,
  etichetta,
  valore,
  onChange,
  tipo = 'text',
  richiesto = false,
  completamento,
}: {
  id: string
  etichetta: string
  valore: string
  onChange: (e: { target: { value: string } }) => void
  tipo?: string
  richiesto?: boolean
  /** ⚠️ `autocomplete` va **dichiarato per campo**, non dedotto dal tipo: la
   *  prima versione faceva `tipo === 'tel' ? 'tel' : 'name'`, e il campo
   *  **motivo** finiva per dichiararsi «nome» — il browser avrebbe offerto di
   *  riempire il motivo della visita con il nome della persona. Visto a video
   *  il 2026-08-12. */
  completamento?: string
}) {
  return (
    <p style={{ marginTop: 'var(--s-13)' }}>
      {/* Etichetta **sempre visibile**: un segnaposto che sparisce quando scrivi
          lascia senza riferimento chi si distrae, ed è il caso normale su un
          telefono. */}
      <label htmlFor={id} className="block text-[15px]" style={{ color: 'var(--fg-muted)' }}>
        {etichetta}
      </label>
      <input
        id={id}
        type={tipo}
        value={valore}
        onChange={onChange}
        required={richiesto}
        autoComplete={completamento}
        className="mt-[var(--s-5)] w-full"
        style={{
          minHeight: '48px',
          padding: '0 var(--s-13)',
          border: '1px solid var(--rule-strong)',
          borderRadius: 'var(--r)',
          background: 'var(--paper, #fff)',
        }}
      />
    </p>
  )
}
