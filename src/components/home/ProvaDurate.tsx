'use client'

/* Quanto dura, e da dove viene quel numero.
 *
 * ── PERCHÉ SOSTITUISCE `trattamenti.png` ────────────────────────────────────
 * Quella schermata mostrava un elenco di sedute con prodotto e lotto. Ma la
 * cosa che il prodotto fa e che una figura non può mostrare è **da dove viene
 * la data del richiamo**: non da una tabella scritta a mano, dalla frase del
 * consenso che il paziente ha firmato.
 *
 * 🔑 È il pezzo di prodotto in cui si vede meglio il metodo di casa: il numero
 * arriva **con la sua fonte accanto**. `durata-trattamento.ts` porta `fonte`
 * proprio per questo, e il sito la mostra per lo stesso motivo.
 *
 * ⛔ E dice cosa NON copre. Le categorie con una durata sono TRE: le altre non
 * hanno una frase da cui ricavarla, e il prodotto **non inventa** un intervallo
 * — non propone un richiamo. Tacere questo limite sarebbe l'unica cosa
 * disonesta che si può fare con questi dati.
 */

import { t } from '@/lib/testo'
import { useState } from 'react'
import dati from '@/lib/prodotto.json'

type Durata = { codice: string; nome: string; meseMin: number; meseMax: number; fonte: string }
const DURATE = dati.durate as Durata[]

export function ProvaDurate() {
  const [scelto, setScelto] = useState<string | null>(null)
  const d = DURATE.find((x) => x.codice === scelto) ?? null

  /* Una data d'esempio: «fra 4-6 mesi» detto in mesi è astratto, detto in mesi
     dell'anno si capisce. ⚠️ Calcolata al render e non memorizzata: deve
     seguire il giorno in cui la pagina viene aperta, non quello della build. */
  const fra = (mesi: number) => {
    const dt = new Date()
    dt.setMonth(dt.getMonth() + mesi)
    return dt.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="prova-catalogo" data-testid="prova-durate">
      <p className="prova-viso__invito">
        <strong>{t('home.provadurate.provalo_qui')}</strong> {t('home.provadurate.scegli_cosa_hai_fatto_oggi_il')}
      </p>

      <div className="prova-viso__pillole" role="group" aria-label={t('home.provadurate.categoria_di_trattamento')}>
        {DURATE.map((x) => (
          <button
            key={x.codice}
            type="button"
            onClick={() => setScelto(scelto === x.codice ? null : x.codice)}
            aria-pressed={scelto === x.codice}
            className={`prova-viso__pillola${scelto === x.codice ? ' e-scelta' : ''}`}
          >
            {x.nome.split(' (')[0]}
          </button>
        ))}
      </div>

      <div className="prova-catalogo__esito" aria-live="polite">
        {!d && (
          <p className="prova-viso__vuoto">
            {t('home.provadurate.il_richiamo_non_lo_decide_una')}
            <br />
            {t('home.provadurate.scegli_una_categoria')}
          </p>
        )}

        {d && (
          <div>
            <p className="prova-durate__quando">{t('home.provadurate.richiamo_fra')} <strong>{d.meseMin}-{d.meseMax} mesi</strong>
              <span>, cioè fra {fra(d.meseMin)} e {fra(d.meseMax)}</span>
            </p>
            {/* La fonte, testuale. È il punto di tutto: un numero senza fonte
                è un'opinione, e su una cartella clinica le opinioni non
                reggono a una contestazione. */}
            <blockquote className="prova-durate__fonte">
              «{d.fonte}»
              {/* ⚠️ Solo la PRIMA lettera in minuscolo, non tutto il nome: un
                  `toLowerCase()` secco produceva «tossina botulinica di tipo a»,
                  e su un sierotipo la maiuscola è parte del nome. Stesso difetto
                  già corretto nel generatore dei farmaci, ripetuto qui. */}
              <cite>dal consenso di {d.nome.charAt(0).toLowerCase() + d.nome.slice(1)}</cite>
            </blockquote>
          </div>
        )}
      </div>

      <p className="prova-viso__didascalia">
        ⛔ Le categorie con una durata sono {DURATE.length}. Per le altre il consenso non dà
        un intervallo, e il prodotto <strong>non se lo inventa</strong>: non propone nessun
        richiamo. Preferiamo una funzione che tace a una che indovina.
      </p>
    </div>
  )
}
