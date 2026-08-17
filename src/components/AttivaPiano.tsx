'use client'

// Il pulsante d'acquisto del listino — D5 (utente, 2026-08-10): self-service.
//
// ── COME PARLA CON IL SERVIZIO, E PERCHE' COSI' ─────────────────────────────
// Il sito e' `output: 'export'`, cioe' **statico**: niente Server Actions,
// niente route API. La chiamata parte dal **browser** verso il servizio dei
// pagamenti, che dovra' quindi essere raggiungibile da internet e avere la
// nostra origine in `ALLOWED_ORIGINS`. La chiave segreta di Stripe non passa
// mai di qui: la tiene il servizio, e noi riceviamo solo l'URL della sessione.
//
// ── LA REGOLA DEL VUOTO DICHIARATO ─────────────────────────────────────────
// ⛔ Se `BILLING_URL` e' vuoto **il pulsante non si disegna**, e la scheda resta
// con l'invito alla demo. E' la stessa regola gia' pagata con `DEMO_URL`: un
// invito che porta a una pagina d'errore non consegna il prodotto, consegna
// l'opposto. Qui vale doppio, perche' l'errore arriverebbe **a chi sta per
// pagare**.
//
// ── PERCHE' UN FORM E NON UN PULSANTE SOLO ──────────────────────────────────
// `create_checkout_session` vuole email e nome dello studio: l'email perche' e'
// il campo con cui Stripe crea il cliente (e non finisce nei metadata), il nome
// dello studio perche' il provisioning ci battezza il tenant. Chiederli qui e'
// piu' onesto che chiederli a Stripe: chi li scrive sa ancora cosa sta
// comprando.
//
// ⚠️ Nome e cognome del medico, partita IVA e Codice Destinatario **non** si
// chiedono qui: li raccoglie Stripe nella sua pagina (`custom_fields` e
// `tax_id_collection`), che e' gia' un modulo e ha gia' la validazione.
// Duplicarli qui vorrebbe dire farli scrivere due volte.

import { t } from '@/lib/testo'
import { useState } from 'react'
import { BILLING_URL } from '@/lib/site-config'
import type { Piano } from '@/lib/listino'

type Ricorrenza = 'monthly' | 'yearly'

interface Props {
  piano: Piano
  ricorrenza: Ricorrenza
  /** Le schede scure invertono i colori del pulsante. */
  suScuro?: boolean
}

export function AttivaPiano({ piano, ricorrenza, suScuro = false }: Props) {
  const [aperto, setAperto] = useState(false)
  const [email, setEmail] = useState('')
  const [studio, setStudio] = useState('')
  const [inCorso, setInCorso] = useState(false)
  const [errore, setErrore] = useState<string | null>(null)

  // ⛔ Nessun pulsante se non c'è dove mandare la richiesta, e nessuno se il
  // piano è su richiesta (Clinica): lì si parla, non si paga da soli.
  if (!BILLING_URL || piano.prezzo === null) return null

  async function attiva(e: React.FormEvent) {
    e.preventDefault()
    setErrore(null)
    setInCorso(true)
    try {
      const r = await fetch(`${BILLING_URL.replace(/\/$/, '')}/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: piano.chiave,
          billing: ricorrenza,
          email,
          studio_name: studio,
        }),
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const dati = (await r.json()) as { checkout_url?: string }
      // ⛔ Mai un indirizzo indovinato: se il servizio non ci dà l'URL, si dice
      // che non ha funzionato invece di mandare qualcuno su una pagina a caso
      // col marchio Stripe davanti.
      if (!dati.checkout_url) throw new Error('risposta senza checkout_url')
      window.location.assign(dati.checkout_url)
    } catch {
      setInCorso(false)
      setErrore(
        'Non riusciamo ad aprire il pagamento in questo momento. Riprova fra poco, oppure richiedi una demo e lo attiviamo insieme.',
      )
    }
  }

  const classePulsante = `btn ${suScuro ? 'btn-su-scuro' : 'btn-primario'}`

  if (!aperto) {
    return (
      <button
        type="button"
        className={`${classePulsante} mt-[var(--s-13)]`}
        onClick={() => setAperto(true)}
      >
        Attiva {piano.nome}
      </button>
    )
  }

  return (
    <form onSubmit={attiva} className="mt-[var(--s-13)] space-y-[var(--s-8)]">
      <label className="block text-[13px]" htmlFor={`email-${piano.chiave}`}>
        {t('attivapiano.la_tua_email')}
      </label>
      <input
        id={`email-${piano.chiave}`}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full"
        style={{
          border: '1px solid var(--rule)',
          borderRadius: 'var(--r-md)',
          padding: 'var(--s-8) var(--s-13)',
          background: 'var(--paper)',
          color: 'var(--fg)',
        }}
      />

      <label className="block text-[13px]" htmlFor={`studio-${piano.chiave}`}>
        {t('attivapiano.nome_dello_studio')}
      </label>
      <input
        id={`studio-${piano.chiave}`}
        type="text"
        required
        maxLength={80}
        value={studio}
        onChange={(e) => setStudio(e.target.value)}
        className="w-full"
        style={{
          border: '1px solid var(--rule)',
          borderRadius: 'var(--r-md)',
          padding: 'var(--s-8) var(--s-13)',
          background: 'var(--paper)',
          color: 'var(--fg)',
        }}
      />

      {/* ⚠️ Detto PRIMA di pagare, non dopo: migrazione e formazione sono
          comprese nel prezzo ma non sono istantanee — le fa una persona, e
          quella persona ti scrive. Prometterle «subito» sarebbe la promessa
          che il self-service non può mantenere. */}
      <p className="text-[13px]" style={{ color: suScuro ? 'var(--on-ink-muted)' : 'var(--fg-muted)' }}>
        {t('attivapiano.dopo_il_pagamento_ti_scriviamo_per')}
      </p>

      {errore && (
        <p className="text-[13px]" role="alert" style={{ color: 'var(--errore, #b3261e)' }}>
          {errore}
        </p>
      )}

      <button type="submit" className={classePulsante} disabled={inCorso}>
        {inCorso ? t('attivapiano.apertura_del_pagamento') : t('attivapiano.vai_al_pagamento')}
      </button>
    </form>
  )
}
