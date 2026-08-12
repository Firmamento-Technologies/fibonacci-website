'use client'

/* Gli orari liberi di uno studio, chiesti al sidecar. — TD-95
 *
 * ── PERCHE' UN GANCIO SOLO ──────────────────────────────────────────────────
 * Li chiedono **due** posti: la voce di elenco (i chip premibili) e il modulo di
 * prenotazione. Due copie della stessa chiamata sono due occasioni di divergere
 * — ed è già successo in questo progetto abbastanza volte da avere una regola
 * scritta. Qui la chiamata è **una**, e chi la usa non sa che forma abbia la
 * risposta.
 *
 * 🔴 **La conversione dei nomi sta qui, e non è cosmesi.** `SlotPubblico`
 * dichiara `inizio`/`fine`; l'endpoint risponde `start`/`end`. Il tipo diceva
 * *«stessa forma di GET /pubblico/prenota/slot»* e **non era vero**: senza
 * conversione la pagina mostrava «Invalid Date». Trovato cablandolo davvero il
 * 2026-08-12 ⇒ *«stessa forma» scritto in un commento non è un contratto*.
 */

import { useEffect, useState } from 'react'
import { PRENOTA_API_URL } from '@/lib/site-config'
import type { SlotPubblico } from '@/lib/medici-pubblici'

export type StatoOrari = 'spento' | 'cerco' | 'pronti' | 'nessuno'

export function useOrariLiberi(organizationId: string): {
  orari: readonly SlotPubblico[]
  stato: StatoOrari
} {
  const [orari, setOrari] = useState<readonly SlotPubblico[]>([])
  const [stato, setStato] = useState<StatoOrari>(PRENOTA_API_URL ? 'cerco' : 'spento')

  useEffect(() => {
    if (!PRENOTA_API_URL) return
    let vivo = true
    const base = PRENOTA_API_URL.replace(/\/$/, '')
    fetch(`${base}/pubblico/prenota/slot?organization_id=${encodeURIComponent(organizationId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { slot?: { id: string; start: string; end: string }[] }) => {
        if (!vivo) return
        const lista = (d.slot ?? []).map((s) => ({ id: s.id, inizio: s.start, fine: s.end }))
        setOrari(lista)
        setStato(lista.length > 0 ? 'pronti' : 'nessuno')
      })
      /* ⛔ Fail-closed: se non si sa quali orari sono liberi non se ne offre
       * nessuno. Offrirne uno a caso vorrebbe dire far prenotare nel vuoto. */
      .catch(() => {
        if (!vivo) return
        setOrari([])
        setStato('nessuno')
      })
    return () => {
      vivo = false
    }
  }, [organizationId])

  return { orari, stato }
}
