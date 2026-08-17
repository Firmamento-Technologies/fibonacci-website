'use client'

/**
 * Il selettore di lingua.
 *
 * ── PERCHE' E' UN COMPONENTE CLIENT, in un sito che non ne ha quasi ─────────
 * Deve sapere **su quale pagina si trova** per offrire la stessa pagina
 * nell'altra lingua, e in un export statico il percorso lo conosce solo il
 * browser. ⛔ L'alternativa era mandare tutti alla home dell'altra lingua:
 * chi sta leggendo i prezzi in italiano e vuole leggerli in tedesco si
 * ritroverebbe altrove, cioe' il selettore lo punirebbe per averlo usato.
 *
 * ── IL BISCOTTO NON E' TRACCIAMENTO, ed e' importante che resti cosi' ───────
 * Scrive **un solo valore**, la lingua scelta (`lingua=de`), e serve a dire a
 * Caddy «ha scelto, smetti di reindirizzare». Senza, chi passa all'italiano da
 * un browser tedesco verrebbe rispedito al tedesco al primo clic: il selettore
 * sembrerebbe rotto.
 * ⇒ e' un cookie **tecnico** ai sensi dell'art. 122 del Codice privacy (serve a
 *   erogare il servizio richiesto dall'utente) ⇒ nessun consenso, nessun
 *   banner. ⛔ Non aggiungere altro qui dentro: e' quella riga a tenerlo tale.
 */
import { useEffect, useState } from 'react'

import { LINGUA, LINGUE_SITO, NOME_LINGUA, type LinguaSito } from '@/lib/lingua'

const PREFISSI = LINGUE_SITO.filter((l) => l !== 'it')

/** Il percorso senza il prefisso di lingua: `/de/prezzi/` → `/prezzi/`. */
function percorsoNeutro(percorso: string): string {
  const parti = percorso.split('/').filter(Boolean)
  if (parti.length && (PREFISSI as readonly string[]).includes(parti[0])) parti.shift()
  return parti.length ? `/${parti.join('/')}/` : '/'
}

export function SceltaLingua() {
  // ⚠️ Parte da `/`: al primo disegno sul server il percorso non esiste, e
  //    indovinarlo produrrebbe un link che cambia sotto le dita (idratazione).
  const [neutro, setNeutro] = useState('/')
  useEffect(() => setNeutro(percorsoNeutro(window.location.pathname)), [])

  function scegli(lingua: LinguaSito) {
    // 400 giorni e' il massimo che i browser onorano da Chrome 104 in poi.
    // `SameSite=Lax` perche' deve sopravvivere all'arrivo da un motore di
    // ricerca, che e' esattamente il caso in cui serve.
    document.cookie = `lingua=${lingua}; path=/; max-age=34560000; SameSite=Lax`
  }

  return (
    <nav aria-label={NOME_LINGUA[LINGUA]} className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {LINGUE_SITO.map((l) => {
        const attiva = l === LINGUA
        const href = `${l === 'it' ? '' : `/${l}`}${neutro}`
        /* ⚠️ I COLORI VENGONO DAI TOKEN «SU INCHIOSTRO», e non è un dettaglio di
           stile: questo selettore vive nel piè di pagina, che ha fondo
           `--ink` (#101f2e). `text-foreground` è il colore per fondo CHIARO
           (#142434), quindi la lingua corrente risultava scura su scuro:
           contrasto misurato **1,05:1** contro i 4,5 richiesti, cioè la voce
           attiva era praticamente invisibile — ed era proprio quella che deve
           dire all'utente in che lingua sta leggendo.
           I token portano il rapporto scritto accanto in `globals.css`:
           `--on-ink` 15,1:1 · `--on-ink-muted` 7,2:1. Il resto del piè di
           pagina già li usa: qui si allinea, non si inventa un colore. */
        return attiva ? (
          <span
            key={l}
            aria-current="true"
            className="text-sm font-medium"
            style={{ color: 'var(--on-ink)' }}
          >
            {NOME_LINGUA[l]}
          </span>
        ) : (
          // ⛔ `<a>` e non `<Link>`: `basePath` aggiungerebbe il prefisso della
          //    lingua CORRENTE a un indirizzo che ne porta gia' un altro, e si
          //    otterrebbe `/de/en/prezzi/`. Qui l'indirizzo e' gia' completo.
          <a
            key={l}
            href={href}
            hrefLang={l}
            onClick={() => scegli(l)}
            className="text-sm underline-offset-4 hover:underline"
            style={{ color: 'var(--on-ink-muted)' }}
          >
            {NOME_LINGUA[l]}
          </a>
        )
      })}
    </nav>
  )
}
