'use client'

/* «Vicino a me»: la distanza fra il paziente e gli studi. — TD-113
 *
 * ── 🔑 LA COSA IMPORTANTE STA QUI, NON NELLA FORMULA ───────────────────────
 * **La posizione non esce mai dal browser.** Non c'è nessuna chiamata a
 * nessuno: il browser dà le coordinate, quelle degli studi sono **dentro il
 * pacchetto** (incorporate in costruzione), e il confronto avviene in memoria.
 * È l'unica delle tre strade possibili che ⛔ non rompe niente:
 *  · **geolocalizzazione via IP** — l'unica davvero *automatica*, come l'utente
 *    l'aveva chiesta — chiama un terzo a **ogni visita** e gli manda l'IP del
 *    paziente ⇒ renderebbe falsa la pagina privacy e richiederebbe il banner
 *    dei cookie. ⛔ Scartata.
 *  · **ordinamento lato server** — il sito è `output: 'export'`: ⛔ non c'è un
 *    server. Scartata perché non esiste.
 *  · **API del browser** — richiede un **permesso esplicito**, quindi ⛔ non è
 *    «automatico»: è un pulsante. ✅ Ma è l'unica che non spedisce niente.
 *
 * ⚠️ **E il permesso non si chiede all'apertura della pagina.** Un pannello di
 * sistema in faccia a chi arriva, prima di aver capito dove si trova, è la
 * ragione per cui la gente preme «Blocca» — e una volta bloccato ⛔ non si può
 * più chiedere. Si chiede **quando il paziente preme**, che è anche l'unico
 * momento in cui la richiesta si spiega da sé.
 */

import { useCallback, useState } from 'react'

export type StatoPosizione = 'ferma' | 'chiedo' | 'trovata' | 'negata' | 'assente'

export interface Posizione {
  lat: number
  lon: number
}

/** Distanza in chilometri fra due punti (formula dell'emisenoverso).
 *
 * ⚠️ È la distanza **in linea d'aria**, ⛔ non quella stradale: per «quale
 * studio mi è più comodo» va benissimo, e la pagina ⛔ non deve promettere
 * altro. Dire «12 km» quando l'auto ne fa 20 sarebbe una precisione finta.
 * ⛔ Nessuna libreria: sono sei righe di trigonometria, e una dipendenza qui
 * peserebbe più del problema. */
export function distanzaKm(a: Posizione, b: Posizione): number {
  const R = 6371
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Come si scrive una distanza a un essere umano.
 *
 * 🔑 **Le cifre decimali sono una bugia di precisione**: la posizione del
 * browser ha un margine di decine o centinaia di metri, e le coordinate dello
 * studio arrivano da una geocodifica. «3,7 km» dichiara una precisione che ⛔
 * non abbiamo; «meno di 1 km» e «4 km» dicono la verità. */
export function distanzaInItaliano(km: number): string {
  if (km < 1) return 'meno di 1 km'
  if (km < 10) return `${Math.round(km)} km`
  return `${Math.round(km / 5) * 5} km circa`
}

export function useVicinoAMe(): {
  posizione: Posizione | null
  stato: StatoPosizione
  chiedi: () => void
  dimentica: () => void
} {
  const [posizione, setPosizione] = useState<Posizione | null>(null)
  const [stato, setStato] = useState<StatoPosizione>('ferma')

  const chiedi = useCallback(() => {
    /* ⚠️ `navigator.geolocation` **non esiste** in contesti non sicuri e su
       alcuni browser irrigiditi: si dichiara, ⛔ non si lascia un pulsante che
       non fa niente. */
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStato('assente')
      return
    }
    setStato('chiedo')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPosizione({ lat: p.coords.latitude, lon: p.coords.longitude })
        setStato('trovata')
      },
      /* ⛔ Un rifiuto **non è un errore da nascondere**: si dice che l'ordine
         resta alfabetico, così il paziente capisce cosa sta guardando. E ⛔ non
         si richiede: chiedere due volte è il modo per farsi bloccare. */
      () => setStato('negata'),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    )
  }, [])

  /* 🔑 **Si può tornare indietro.** La posizione resta solo in memoria — ⛔ non
     in `localStorage`, che sarebbe uno stato persistente su un sito che si
     vanta di non averne — ma finché la pagina è aperta l'ordine è cambiato, e
     chi vuole rivedere l'elenco alfabetico deve poterlo fare senza ricaricare. */
  const dimentica = useCallback(() => {
    setPosizione(null)
    setStato('ferma')
  }, [])

  return { posizione, stato, chiedi, dimentica }
}
