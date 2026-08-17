'use client'

import { t } from '@/lib/testo'
import { useEffect, useState, type FormEvent } from 'react'
import { useOrariLiberi } from '@/lib/orari-liberi'
import { PRENOTA_API_URL } from '@/lib/site-config'
import type { SchedaMedicoPubblica, SlotPubblico } from '@/lib/medici-pubblici'
import { giornoInItaliano, oraInItaliano, calendario } from '@/lib/medici-pubblici'
import {
  PreAnamnesi,
  PRE_ANAMNESI_VUOTA,
  preAnamnesiDaInviare,
  type DatiPreAnamnesi,
} from '@/components/pazienti/PreAnamnesi'

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

/** Risolve la prova di lavoro: cerca il primo `n` per cui
 *  `sha256(seme + n)` ha almeno `difficolta` bit iniziali a zero.
 *
 * ⛔ **Nessuna dipendenza e nessuna chiamata a terzi**: `crypto.subtle` è nel
 * browser. È la ragione per cui questo sito non ha il banner dei cookie, e
 * vale anche qui — anzi soprattutto qui, dove il paziente sta per scrivere il
 * motivo della visita.
 *
 * ⚠️ **`crypto.subtle.digest` è asincrono**, quindi il costo per tentativo è
 * dominato dalla promessa, non dall'hash: è il motivo per cui la difficoltà
 * lato server è **14** e non 18. Il commento in `sfida_pow.py` dice cosa
 * servirebbe per alzarla, e ⛔ non è «provare un numero più grande». */
async function risolviSfida(seme: string, difficolta: number): Promise<string> {
  const codifica = new TextEncoder()
  for (let n = 0; n < 5_000_000; n++) {
    const digest = new Uint8Array(
      await crypto.subtle.digest('SHA-256', codifica.encode(`${seme}${n}`)),
    )
    let zeri = 0
    for (const byte of digest) {
      if (byte === 0) {
        zeri += 8
        continue
      }
      zeri += 8 - (32 - Math.clz32(byte))
      break
    }
    if (zeri >= difficolta) return String(n)
  }
  /* Non dovrebbe succedere con le difficoltà che usiamo. Se succede, ⛔ non si
     spedisce una soluzione finta: si lascia fallire il server, che risponde
     403 e dice al paziente di ricaricare. */
  throw new Error('sfida non risolta')
}

export function ModuloPrenotazione({ m }: { m: SchedaMedicoPubblica }) {
  /* ⚠️ **Gli orari veri arrivano dal sidecar, non dalla pagina.**
   *
   * Il sito è statico (`output: 'export'`): gli orari cotti nel bundle sarebbero
   * quelli del momento della build, e su una pagina che promette *«quando è
   * libero davvero»* sarebbe la bugia più facile da fare. Peggio: il modulo
   * spedisce `slotId`, e uno slot inventato al momento della build **non
   * esiste** per chi lo riceve ⇒ la prenotazione fallirebbe dopo che il
   * paziente ha compilato tutto.
   *
   * ⛔ Quelli di `m.slot` restano solo come **indizio di build** («questo studio
   * ha disponibilità»): non si prenota mai su quelli. */
  const { orari, stato: statoOrari } = useOrariLiberi(m.organizationId)
  const [slot, setSlot] = useState<SlotPubblico | null>(null)

  /* 🔑 **Lo slot scelto dall'elenco arriva nell'indirizzo** (`?slot=<id>`), e si
   * seleziona da solo. È il punto di §5.4 del piano: *«il chip orario nella voce
   * di elenco porta direttamente al modulo con lo slot già scelto — non apri la
   * scheda, poi trova gli orari, poi prenota: tre passi dove ne bastano due»*.
   * ⚠️ Si applica **quando gli orari arrivano**, non al montaggio: prima non
   * esistono ancora, e cercarlo darebbe sempre niente. */
  useEffect(() => {
    if (slot || orari.length === 0) return
    const cercato = new URLSearchParams(window.location.search).get('slot')
    if (cercato) setSlot(orari.find((s) => s.id === cercato) ?? null)
  }, [orari, slot])
  const [dati, setDati] = useState({ nome: '', telefono: '', motivo: '' })
  /* TD-123: facoltativa e spenta di default. `preAnamnesiDaInviare` decide se
     c'è qualcosa da spedire — ⛔ qui non si rilegge il flag. */
  const [preAnamnesi, setPreAnamnesi] = useState<DatiPreAnamnesi>(PRE_ANAMNESI_VUOTA)
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
        {t('pazienti.moduloprenotazione.la_prenotazione_online_da_questa_pagina')}
      </p>
    )
  }

  async function invia(e: FormEvent) {
    e.preventDefault()
    if (!slot) return
    setStato('invio')
    try {
      /* ⚠️ **La sfida si chiede al momento dell'invio, non al caricamento**:
         vive dieci minuti e vale **una volta sola**, quindi prenderla mentre
         la pagina si apre significherebbe consegnarne una già scaduta a chi
         compila con calma — che è il caso normale su un modulo sanitario. */
      const base = PRENOTA_API_URL.replace(/\/$/, '')
      const sfida = (await (await fetch(`${base}/pubblico/sfida`)).json()) as {
        id: string
        seme: string
        difficolta: number
      }
      const soluzione = await risolviSfida(sfida.seme, sfida.difficolta)

      const r = await fetch(`${base}/pubblico/prenota`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioId: m.organizationId,
          slotId: slot.id,
          nome: dati.nome,
          telefono: dati.telefono,
          motivo: dati.motivo,
          /* ⚠️ Si spedisce **solo se c'è consenso e qualcosa dentro**: un campo
             `preAnamnesi: {}` vuoto nel corpo insegnerebbe al server ad
             aspettarselo sempre. */
          preAnamnesi: preAnamnesiDaInviare(preAnamnesi),
          sfidaId: sfida.id,
          soluzione,
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
        <p style={{ fontWeight: 500 }}>{t('pazienti.moduloprenotazione.richiesta_inviata')}</p>
        <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          È lo studio a confermarla: ti richiamano al numero che hai lasciato. Finché non ti
          confermano, l’appuntamento <strong>non è preso</strong>.
        </p>
      </div>
    )
  }

  /* ⚠️ Prima di disegnare il selettore: gli orari **veri** possono non esserci,
     e `orari[0]` su una lista vuota è un errore in faccia al paziente. */
  if (statoOrari === 'cerco') {
    return (
      <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg-muted)' }} role="status">
        {t('pazienti.moduloprenotazione.cerco_gli_orari_liberi')}
      </p>
    )
  }

  if (statoOrari === 'nessuno') {
    /* ⛔ Non si scrive «non ci sono orari»: non lo sappiamo. Sappiamo che **non
       ne abbiamo ricevuti**, e le due cose si distinguono per il paziente. */
    return (
      <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
        {t('pazienti.moduloprenotazione.al_momento_non_risultano_orari_prenotabili')}
      </p>
    )
  }

  return (
    <form onSubmit={invia} style={{ marginTop: 'var(--s-21)' }}>
      {/* ── IL CALENDARIO ───────────────────────────────────────────────────
          🔴 **Qui c'era un difetto vero, non solo una forma povera.** La
          legenda diceva *«Scegli un orario · {giorno di `orari[0]`}»* e sotto
          elencava **tutti** gli orari, di qualunque giornata: con gli slot di
          un giorno solo — i dati d'esempio — la bugia non si vede; al secondo
          giorno la pagina scrive **venerdì** sopra un orario di **sabato**, e
          un paziente si presenta il giorno sbagliato.
          🔑 Raggruppare per giornata **è** la correzione: ogni data porta i
          suoi orari e non può più riferirsi a quelli di un'altra. Non è
          disciplina di chi scrive, è la struttura che non lo consente.
          ⚖️ Richiesta dell'utente (2026-08-13): *«nella pagina dedicata al
          medico deve esserci il calendario completo con le disponibilità in
          cui il paziente si può prenotare»*. ⚠️ È il calendario **degli slot
          liberi**, ⛔ non l'agenda dello studio: quella non esce, e non deve. */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          {t('pazienti.moduloprenotazione.scegli_un_orario')}
        </legend>
        {/* 🔑 **Sette colonne, comprese quelle vuote.** Richiesta dell'utente:
            *«il calendario delle disponibilità e delle date e orari non
            disponibili»*. `perGiornata()` mostrava **solo i giorni con slot**,
            e un calendario che salta i giorni pieni non è un calendario: è un
            elenco che *sembra* dire «lunedì non riceve» mentre sta dicendo
            «di lunedì non so niente». */}
        <div className="calendario-settimana">
          {calendario(orari, 7).map((g) => (
            <div key={g.chiave} className="calendario-colonna">
              <p className="calendario-colonna-testata">
                <span className="calendario-colonna-giorno">{g.giornoSettimana}</span>
                <span className="calendario-colonna-data">{g.etichetta}</span>
              </p>
              {g.orari.length > 0 ? (
                <ul style={{ display: 'grid', gap: 'var(--s-5)', padding: 0 }}>
                  {g.orari.map((s) => {
                    const scelto = slot?.id === s.id
                    return (
                      <li key={s.id} style={{ listStyle: 'none' }}>
                        <button
                          type="button"
                          onClick={() => setSlot(s)}
                          aria-pressed={scelto}
                          className={scelto ? 'orario-vivo' : 'orario-scelta'}
                        >
                          {oraInItaliano(s.inizio)}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                /* 🔎 **Una barra, non un carattere**, e la ragione è doppia.
                   (1) Il collaudo del sito rifiuta la lineetta lunga spaziata
                   e me l'ha presa qui — il presidio ha fatto il suo lavoro.
                   (2) Ed è meglio così: una barra grigia si legge come «niente
                   qui» senza chiedere di interpretare un segno tipografico, e
                   uno screen reader riceve la frase intera invece di un
                   trattino. ⛔ Non dice «chiuso»: la riga sotto la griglia
                   spiega una volta cosa vuol dire davvero. */
                <p className="calendario-vuoto">
                  <span aria-hidden="true" className="calendario-vuoto-barra" />
                  <span className="sr-only">{t('pazienti.moduloprenotazione.nessun_orario_prenotabile')}</span>
                </p>
              )}
            </div>
          ))}
        </div>
        {/* ⚠️ **La riga che impedisce alla griglia di mentire.** Una colonna
            vuota si legge naturalmente come «chiuso»: qui si dice cosa vuol
            dire davvero. Gli orari di apertura ⛔ non li abbiamo (TD-116), e il
            sidecar restituisce **solo gli Slot liberi** — di proposito, perché
            leggere gli `Appointment` da un canale anonimo farebbe scaricare a
            chiunque nomi e telefoni dei pazienti. */}
        <p className="mt-[var(--s-13)] text-[13px]" style={{ color: 'var(--fg-muted)' }}>
          {t('pazienti.moduloprenotazione.una_barra_grigia_vuol_dire_che')}
        </p>
      </fieldset>

      {slot && (
        <div style={{ marginTop: 'var(--s-21)', maxWidth: 'var(--measure)' }}>
          <Campo
            id="p-nome"
            etichetta={t('pazienti.moduloprenotazione.nome')}
            valore={dati.nome}
            onChange={aggiorna('nome')}
            completamento="name"
            richiesto
          />
          <Campo
            id="p-tel"
            etichetta={t('pazienti.moduloprenotazione.telefono')}
            tipo="tel"
            valore={dati.telefono}
            onChange={aggiorna('telefono')}
            completamento="tel"
            richiesto
          />
          <Campo
            id="p-motivo"
            etichetta={t('pazienti.moduloprenotazione.motivo_facoltativo')}
            valore={dati.motivo}
            onChange={aggiorna('motivo')}
            completamento="off"
          />

          {/* ── TD-123: la pre-anamnesi facoltativa ──────────────────────
              🔑 **Sta DOPO nome e telefono, e prima dell'invio.** Prima
              sarebbe un muro fra il paziente e l'appuntamento; dopo l'invio non
              esisterebbe. Qui è quello che è: un'aggiunta che si può saltare.
              ⚠️ **Spenta di default** (`NEXT_PUBLIC_PREANAMNESI`): da spenta la
              sezione ⛔ non esiste — ⛔ non «c'è ma non spedisce», che
              raccoglierebbe dati sanitari in un vuoto. */}
          <PreAnamnesi dati={preAnamnesi} onChange={setPreAnamnesi} />

          {/* ⚖️ Chi tratta i dati si dice **prima** di raccoglierli, non dopo. */}
          <p className="mt-[var(--s-13)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
            {t('pazienti.moduloprenotazione.quello_che_scrivi_va_allo_studio')}
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
