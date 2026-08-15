'use client'

/* Cerca il trattamento, vedi se il consenso c'è già — il catalogo vero.
 *
 * ── PERCHÉ NON UNA SCHERMATA ────────────────────────────────────────────────
 * `catalogo-consensi.png` era l'immagine più usata del sito (tre pagine), e
 * mostrava una lista. Una lista in figura si guarda; una lista che risponde si
 * prova — e qui la domanda che il medico si fa è **una sola**: «il modulo per
 * quello che faccio io, c'è?». Una figura non può rispondere. Questo sì.
 *
 * 🔑 E la risposta non è una promessa: sono i **115 procedimenti veri**, presi
 * da `EMR/data/consensi/procedure-catalog.json` con `scripts/catalogo.mjs` e
 * tenuti in parità da `scripts/parita-catalogo.mjs` — che diventa rosso se il
 * catalogo clinico cambia e la vetrina no. Il numero che il sito dichiara è un
 * claim commerciale: deve seguire il prodotto, non l'ultima volta che qualcuno
 * ha aggiornato una figura.
 *
 * ⚠️ Ricerca **senza accenti e senza maiuscole**: un medico scrive «tossina
 * botulinica» come gli viene, e «Ginecoplastica» sta in catalogo tutto
 * maiuscolo. Una ricerca che fallisce per un accento fa concludere che il
 * modulo non c'è — cioè dice il falso proprio sulla domanda che conta.
 *
 * ⛔ NON dichiara che i modelli siano validati da un legale: non lo sono
 * (`data/consensi/fibonacci-templates/` è marcato «bozza, validazione PENDING»),
 * e 65 punti clinici sono ancora da completare. La didascalia lo dice.
 */

import { useMemo, useState } from 'react'
import catalogo from '@/lib/catalogo-consensi.json'

type Procedura = { slug: string; titolo: string; categoria: string }
const PROCEDURE = catalogo.procedure as Procedura[]

/** Minuscole, senza accenti: «Ginecoplastica» e «gineco» devono incontrarsi. */
function normalizza(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const INDICE = PROCEDURE.map((p) => ({ ...p, cerca: normalizza(`${p.titolo} ${p.categoria}`) }))

/* Gli esempi non sono decorativi: sono i tre modi in cui un medico può
 * cercare — per principio attivo, per zona, per famiglia di procedura. */
const ESEMPI = ['tossina', 'labbra', 'laser']

export function ProvaCatalogoConsensi() {
  const [q, setQ] = useState('')

  const trovate = useMemo(() => {
    const n = normalizza(q)
    if (!n) return []
    return INDICE.filter((p) => p.cerca.includes(n)).slice(0, 8)
  }, [q])

  const nessuna = q.trim() !== '' && trovate.length === 0

  return (
    <div className="prova-catalogo" data-testid="prova-catalogo-consensi">
      <p className="prova-viso__invito">
        <strong>Provalo qui.</strong> Scrivi un trattamento che fai: se il modulo esiste,
        compare con la sua categoria.
      </p>

      <label className="prova-catalogo__campo">
        <span className="sr-only">Cerca un trattamento nel catalogo dei consensi</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="tossina, filler, blefaroplastica…"
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
            <strong>{PROCEDURE.length} procedure</strong> hanno già il loro modulo, dalla
            tossina alla chirurgia.
            <br />
            Cercane una.
          </p>
        )}

        {nessuna && (
          <p className="prova-catalogo__nulla">
            Nessun modulo per «{q.trim()}». ⛔ E non ne inventiamo uno: se il trattamento
            non è in catalogo, si scrive, non si adatta quello di un’altra procedura.
          </p>
        )}

        {trovate.length > 0 && (
          <ul className="prova-catalogo__lista">
            {trovate.map((p) => (
              <li key={p.slug}>
                <span className="prova-catalogo__titolo">{p.titolo}</span>
                <span className="prova-catalogo__categoria">{p.categoria}</span>
                <span className="prova-catalogo__pronto">modulo pronto</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ⚠️ Detto qui, non sottinteso: i modelli sono bozze non ancora validate
          da un legale, e 65 punti clinici aspettano un medico. Dichiararli
          «pronti all'uso» sarebbe il tipo di promessa che questo sito ha già
          pagato altrove. */}
      <p className="prova-viso__didascalia">
        È il catalogo dell’applicazione, non un elenco scritto per il sito. I moduli sono
        bozze: vanno validati dal tuo legale e completati nei punti clinici prima dell’uso.
      </p>
    </div>
  )
}
