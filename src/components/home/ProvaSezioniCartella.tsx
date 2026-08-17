'use client'

/* Cosa c'è dentro una cartella, sezione per sezione.
 *
 * ── PERCHÉ SOSTITUISCE `cartella-paziente.png` ──────────────────────────────
 * Quella schermata era la cartella INTERA, ed è la stessa immagine che stava
 * nel primo schermo: rimpicciolita non si legge un carattere, e la ricerca del
 * 7 agosto l'aveva già bocciata per quello. Ma la domanda vera davanti a una
 * cartella clinica non è «com'è fatta»: è **«dove finisce quello che scrivo?»**.
 * Sei sezioni, tredici posti. Si tocca una sezione e si vede cosa contiene.
 *
 * ⚖️ È la mappa vera: `sezioni-cartella.ts` non elenca sezioni a mano, le
 * costruisce dal **registro dei moduli** — quindi ciò che si vede qui è ciò che
 * il medico trova in barra, non una brochure. `parita-prodotto.mjs` diventa
 * rosso se un tab cambia sezione.
 *
 * ⚠️ «Dati e persone» sta fuori dalla barra anche nel prodotto (si raggiunge
 * dall'intestazione): qui è nell'elenco perché è comunque parte della cartella,
 * e nasconderlo darebbe l'idea che l'anagrafica non ci sia.
 */

import { t } from '@/lib/testo'
import { useState } from 'react'
import dati from '@/lib/prodotto.json'

type Sezione = { id: string; titolo: string; dentro: string[] }
const SEZIONI = dati.sezioni as Sezione[]

/* I nomi dei tab come li legge il medico. ⚠️ Sono etichette di VETRINA: nel
 * prodotto stanno in `i18n`, e replicarne il file qui sarebbe una terza copia
 * da tenere allineata. Qui basta che siano comprensibili e veri — il presidio
 * confronta gli **identificativi**, che sono il dato, non queste parole. */
const NOME: Record<string, string> = {
  timeline: t('home.provasezionicartella.cronologia'),
  anamnesi: t('home.documentochesicompone.anamnesi'),
  prom: t('home.provasezionicartella.questionari_alla_paziente'),
  visite: t('home.provasezionicartella.visite'),
  trattamenti: t('home.provasezionicartella.trattamenti'),
  piani: t('home.provasezionicartella.piani_di_cura'),
  prescrizioni: t('home.provasezionicartella.prescrizioni'),
  esami: t('home.provasezionicartella.esami'),
  foto: t('home.provasezionicartella.foto'),
  documenti: t('legale.layout.documenti'),
  consensi: t('home.sezioni.consensi'),
  anagrafica: t('home.provasezionicartella.anagrafica'),
  equipe: t('home.provasezionicartella.quipe'),
}

export function ProvaSezioniCartella() {
  const [aperta, setAperta] = useState<string | null>(null)
  const s = SEZIONI.find((x) => x.id === aperta) ?? null
  const totale = SEZIONI.reduce((n, x) => n + x.dentro.length, 0)

  return (
    <div className="prova-catalogo" data-testid="prova-sezioni-cartella">
      <p className="prova-viso__invito">
        <strong>{t('home.provasezionicartella.provalo_qui')}</strong> {SEZIONI.length} sezioni, {totale} posti dove finisce
        quello che scrivi. Toccane una.
      </p>

      <div className="prova-viso__pillole prova-sezioni__pillole" role="group" aria-label={t('home.provasezionicartella.sezioni_della_cartella')}>
        {SEZIONI.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setAperta(aperta === x.id ? null : x.id)}
            aria-pressed={aperta === x.id}
            className={`prova-viso__pillola${aperta === x.id ? ' e-scelta' : ''}`}
          >
            {x.titolo}
          </button>
        ))}
      </div>

      <div className="prova-catalogo__esito" aria-live="polite">
        {!s && (
          <p className="prova-viso__vuoto">
            {t('home.provasezionicartella.nessuna_cartella_a_campo_libero_ogni')}
          </p>
        )}
        {s && (
          <>
            <p className="prova-catalogo__titolo" style={{ fontWeight: 600 }}>
              {s.titolo}
            </p>
            <ul className="prova-catalogo__lista">
              {s.dentro.map((t) => (
                <li key={t}>
                  <span className="prova-catalogo__titolo">{NOME[t] ?? t}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <p className="prova-viso__didascalia">
        {t('home.provasezionicartella.e_la_mappa_vera_dell_applicazione')}
      </p>
    </div>
  )
}
