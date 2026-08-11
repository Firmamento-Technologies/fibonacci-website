'use client'

/* Se succede, c'è dove scriverlo — e come.
 *
 * ── PERCHÉ QUESTA SEZIONE HA SOSTITUITO «CHI HA APERTO QUELLA CARTELLA» ──────
 * Il registro accessi è il rilievo n. 1 dei provvedimenti del Garante, ed è
 * vero — ma è valore per **noi che vendiamo**, non per il medico che compra:
 * nessuno sceglie un gestionale perché registra chi apre le cartelle. Rilievo
 * dell'utente, 2026-08-11, e ha ragione.
 *
 * Al suo posto la cosa che al medico serve davvero, detta dal modulo stesso
 * dell'applicazione (`complicanze.ts`):
 *
 *     «Un consenso che elenca i rischi e una cartella che non registra gli
 *      esiti sono due metà che non si parlano, e in una contestazione è la
 *      seconda metà quella che manca.»
 *
 * 🔑 È anche il pezzo che chiude il posizionamento: il sito promette «la
 * cartella che ti difende», e questa è la metà della promessa che di solito
 * manca.
 *
 * ⛔ E ripete i tre limiti che il modulo dichiara, perché sono ciò che lo rende
 * difendibile e tacerli lo trasformerebbe in una promessa:
 *   · l'elenco è CHIUSO — si sceglie, non si scrive, così nessuno lo inferisce;
 *   · la gravità la decide il medico, non il software;
 *   · la farmacovigilanza NON si trasmette da qui: si prepara il contenuto.
 */

import { useState } from 'react'
import dati from '@/lib/prodotto.json'

type Voce = { codice: string; etichetta: string }
const COMPLICANZE = dati.complicanze as Voce[]
const GRAVITA = dati.gravita as Voce[]
const ESITI = dati.esiti as Voce[]

export function ProvaComplicanze() {
  const [quale, setQuale] = useState<string | null>(null)
  const [grav, setGrav] = useState<string>(GRAVITA[0].codice)
  const [esito, setEsito] = useState<string>(ESITI[0].codice)

  const c = COMPLICANZE.find((x) => x.codice === quale) ?? null

  return (
    <div className="prova-catalogo" data-testid="prova-complicanze">
      <p className="prova-viso__invito">
        <strong>Provalo qui.</strong> Scegli cosa è successo: sotto compare la riga che
        finisce in cartella, con il suo codice.
      </p>

      <div className="prova-viso__pillole prova-sezioni__pillole" role="group" aria-label="Complicanza">
        {COMPLICANZE.map((x) => (
          <button
            key={x.codice}
            type="button"
            onClick={() => setQuale(quale === x.codice ? null : x.codice)}
            aria-pressed={quale === x.codice}
            className={`prova-viso__pillola${quale === x.codice ? ' e-scelta' : ''}`}
          >
            {x.etichetta}
          </button>
        ))}
      </div>

      <div className="prova-catalogo__esito" aria-live="polite">
        {!c && (
          <p className="prova-viso__vuoto">
            L’elenco è <strong>chiuso</strong>: si sceglie, non si scrive. È il motivo per
            cui poi si può cercare «quante occlusioni vascolari ho avuto», e per cui nessuno
            può dedurre una complicanza al posto tuo.
          </p>
        )}

        {c && (
          <>
            {/* I due assi che restano: chi decide è il medico, e si vede. */}
            <div className="prova-compl__scelte">
              <label>
                <span>Gravità</span>
                <select value={grav} onChange={(e) => setGrav(e.target.value)}>
                  {GRAVITA.map((g) => (
                    <option key={g.codice} value={g.codice}>{g.etichetta}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Esito</span>
                <select value={esito} onChange={(e) => setEsito(e.target.value)}>
                  {ESITI.map((x) => (
                    <option key={x.codice} value={x.codice}>{x.etichetta}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* La riga come entra in cartella: codificata, non in prosa. */}
            <div className="prova-compl__riga">
              <span className="prova-compl__nome">{c.etichetta}</span>
              <span className="prova-compl__meta">
                {GRAVITA.find((g) => g.codice === grav)?.etichetta} ·{' '}
                {ESITI.find((x) => x.codice === esito)?.etichetta}
              </span>
              <code className="prova-compl__codice">
                AdverseEvent · {c.codice} · {grav} · {esito}
              </code>
            </div>
          </>
        )}
      </div>

      <p className="prova-viso__didascalia">
        Diventa un <code>AdverseEvent</code> FHIR legato alla seduta che l’ha originata.
        ⛔ La gravità la scegli tu: il software non la deduce. E la segnalazione di
        farmacovigilanza resta un tuo atto — qui si prepara il contenuto, non si trasmette
        niente.
      </p>
    </div>
  )
}
