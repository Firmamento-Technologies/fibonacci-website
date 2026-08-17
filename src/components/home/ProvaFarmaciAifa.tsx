'use client'

/* Il catalogo farmaci, per principio attivo — e senza un solo marchio.
 *
 * ⛔ IL VINCOLO CHE DECIDE COSA SI VEDE QUI.
 * La sorgente AIFA contiene marchi e ditte, e **tutte** le confezioni del
 * sottoinsieme estetico sono soggette a prescrizione (39 `RR`, 7 ospedaliere).
 * La Dir. 2001/83/CE artt. 86-100 — richiamata dalla Comunicazione della
 * Commissione sulle pratiche commerciali sleali, tier 1 — dice:
 *
 *     «Advertisement of prescription-only medicines … is prohibited.»
 *
 * Un sito che vende un gestionale non è un prontuario: elencare marchi di
 * medicinali con obbligo di ricetta lì è pubblicità al pubblico, ed è vietata.
 * ⇒ Qui compaiono **principio attivo, ATC e regime di fornitura**. Nessun
 * marchio, nessuna ditta, nessun AIC — e `scripts/parita-farmaci.mjs` diventa
 * rosso se ne rientra uno.
 *
 * 🔑 E non è una rinuncia: il differenziante del prodotto **è** prescrivere per
 * principio attivo. Ciò che resta è esattamente ciò che conta.
 *
 * ⚠️ Ed è un CAMPIONE, detto in pagina: 46 confezioni del sottoinsieme
 * estetico, non le ~159.000 righe che `import_aifa.py` scarica ogni giorno da
 * AIFA. Dichiarare «tutto l'AIFA» partendo da 46 righe sarebbe il tipo di
 * promessa che questo sito ha già pagato.
 */

import { t } from '@/lib/testo'
import { useMemo, useState } from 'react'
import dati from '@/lib/farmaci-aifa.json'

type Principio = { principio: string; atc: string; fornitura: string; confezioni: number }
const PRINCIPI = dati.principi as Principio[]

function normalizza(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

const INDICE = PRINCIPI.map((p) => ({ ...p, cerca: normalizza(`${p.principio} ${p.atc}`) }))

/** Cosa vuol dire la sigla, per chi non la usa ogni giorno. */
const FORNITURA: Record<string, string> = {
  RR: 'ricetta ripetibile',
  RNR: 'ricetta non ripetibile',
  OSP: 'uso ospedaliero',
  SOP: 'senza ricetta',
  OTC: 'da banco',
}

const ESEMPI = ['ialuronico', 'botulinica', 'D11AX']

export function ProvaFarmaciAifa() {
  const [q, setQ] = useState('')

  const trovati = useMemo(() => {
    const n = normalizza(q)
    if (!n) return []
    return INDICE.filter((p) => p.cerca.includes(n)).slice(0, 6)
  }, [q])

  const nessuno = q.trim() !== '' && trovati.length === 0

  return (
    <div className="prova-catalogo" data-testid="prova-farmaci-aifa">
      <p className="prova-viso__invito">
        <strong>{t('home.provafarmaciaifa.provalo_qui')}</strong> Cerca un principio attivo, o un codice ATC: il
        catalogo è quello di AIFA, sincronizzato ogni giorno.
      </p>

      <label className="prova-catalogo__campo">
        <span className="sr-only">{t('home.provafarmaciaifa.cerca_un_principio_attivo_nel_catalogo')}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="acido ialuronico, tossina botulinica…"
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      <p className="prova-catalogo__esempi">
        Prova con{' '}
        {ESEMPI.map((e, i) => (
          <span key={e}>
            {i > 0 && ' · '}
            <button type="button" onClick={() => setQ(e)}>
              {e}
            </button>
          </span>
        ))}
      </p>

      <div className="prova-catalogo__esito" aria-live="polite">
        {!q.trim() && (
          <p className="prova-viso__vuoto">
            Si prescrive per <strong>principio attivo</strong>, non per marca. Il foglietto
            illustrativo e la scheda tecnica sono quelli ufficiali AIFA, a un clic dalla
            prescrizione.
            <br />
            Cerca una molecola.
          </p>
        )}

        {nessuno && (
          <p className="prova-catalogo__nulla">
            Niente per «{q.trim()}» in questo campione. ⚠️ Non vuol dire che manchi dal
            catalogo vero: qui sotto ci sono {dati.confezioniNelCampione} confezioni del
            sottoinsieme estetico, non l’intero elenco AIFA.
          </p>
        )}

        {trovati.length > 0 && (
          <ul className="prova-catalogo__lista">
            {trovati.map((p) => (
              <li key={`${p.principio}-${p.atc}`}>
                <span className="prova-catalogo__titolo">{p.principio}</span>
                <span className="prova-catalogo__categoria">
                  ATC {p.atc} · {FORNITURA[p.fornitura] ?? p.fornitura} ·{' '}
                  {p.confezioni} confezion{p.confezioni === 1 ? 'e' : 'i'}
                </span>
                <span className="prova-catalogo__pronto">foglietto AIFA</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ⚠️ Due cose dette, non sottintese: che è un campione, e PERCHÉ non ci
          sono marchi. La seconda è più importante della prima — un medico che
          non vede il suo prodotto potrebbe concludere che manchi. */}
      <p className="prova-viso__didascalia">
        Campione di {dati.confezioniNelCampione} confezioni, {PRINCIPI.length} principi
        attivi. ⛔ Niente nomi commerciali: la pubblicità al pubblico dei medicinali con
        obbligo di ricetta è vietata, e questo è un sito, non un prontuario. Nel prodotto i
        marchi ci sono tutti.
      </p>
    </div>
  )
}
