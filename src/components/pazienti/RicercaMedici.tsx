'use client'

/* La ricerca e i risultati: la superficie di prodotto del lato paziente. — TD-95
 *
 * ── DA DOVE VIENE LA FORMA ──────────────────────────────────────────────────
 * Anatomia misurata di MioDottore e Doctolib in [[piano-ui-canale-paziente]]
 * §2-§3. 🔑 **La cosa da prendere non è un componente, è la gerarchia**: *una
 * sola azione, sopra la piega, due campi e un pulsante* — poi le scorciatoie
 * per la coda lunga, poi i risultati.
 *
 * ⚠️ **Correzione su rilievo dell'utente (2026-08-12, due volte).** Il piano
 * diceva *«il riquadro di ricerca arriva con l'elenco, non prima»*, e io l'avevo
 * preso alla lettera: con due studi niente ricerca ⇒ la pagina restava un
 * documento di testo. L'utente ha ragione: **una pagina dove i pazienti cercano
 * i medici deve avere l'aspetto di quello**, anche mentre i medici sono pochi.
 * La ricerca c'è, e ⛔ non finge: dice quanti risultati mostra, e quando non
 * trova niente lo dice senza svuotare la pagina.
 *
 * ── COSA NON C'È, E RESTA FUORI ─────────────────────────────────────────────
 * ⛔ Nessuna classifica, nessun voto, nessuna «In evidenza» a pagamento —
 * l'inventario pubblicitario è il primo elemento della loro scheda, ed è
 * esattamente ciò che la L. 145/2018 c. 525 rende un rischio **per il medico**.
 * ⛔ Nessun prezzo: gli onorari li dice lo studio.
 */

import { useMemo, useState, type ReactNode } from 'react'
import { VoceElenco } from '@/components/pazienti/VoceElenco'
import type { SchedaMedicoPubblica } from '@/lib/medici-pubblici'

/** Le scorciatoie: sono le prestazioni vere del catalogo, non parole d'ordine.
 *  🔑 Da loro sono anche **maglie SEO interne**; qui per ora sono solo un modo
 *  di riempire il campo senza scrivere, che su un telefono è la differenza fra
 *  cercare e non cercare. */
const SCORCIATOIE = [
  'Tossina botulinica',
  'Filler',
  'Biostimolazione',
  'Peeling',
  'Prima visita',
] as const

function normalizza(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function RicercaMedici({
  medici,
  intestazione,
}: {
  medici: readonly SchedaMedicoPubblica[]
  /** Il titolo della pagina, reso **dentro la fascia**: eroe e ricerca sono un
   *  blocco solo, e lo stato della ricerca vive qui. ⚠️ Separarli avrebbe
   *  significato o due componenti che si passano lo stato, o i risultati dentro
   *  la fascia — che è l'errore che avevo appena fatto. */
  intestazione: ReactNode
}) {
  const [cosa, setCosa] = useState('')
  const [dove, setDove] = useState('')

  const risultati = useMemo(() => {
    const c = normalizza(cosa)
    const d = normalizza(dove)
    if (!c && !d) return medici
    return medici.filter((m) => {
      /* ⚠️ Si cerca su **quello che il paziente vede**: nome, prestazioni,
       * titolo. ⛔ Non su campi nascosti — un risultato che compare per un
       * motivo che non si legge in pagina sembra un errore. */
      const testo = normalizza(
        [m.medico.nome, m.medico.titolo, ...m.prestazioni, m.studio.nome].join(' '),
      )
      const luogo = normalizza([m.studio.comune, m.studio.indirizzo].join(' '))
      return (!c || testo.includes(c)) && (!d || luogo.includes(d))
    })
  }, [medici, cosa, dove])

  const filtrata = cosa.trim() !== '' || dove.trim() !== ''

  return (
    <>
      <div className="eroe-pazienti">
        <div className="gabbia">
          {intestazione}
          <div style={{ maxWidth: '52rem', marginTop: 'var(--s-21)' }}>
      {/* ── L'azione, sopra tutto ──────────────────────────────────────── */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          document.getElementById('risultati')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        style={{
          background: '#fff',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--r-lg)',
          boxShadow: '0 2px 8px rgba(16, 31, 46, 0.06)',
          padding: 'var(--s-13)',
          /* ⚠️ La griglia sta **nel CSS**, non qui: uno stile inline batte la
             classe, quindi `gridTemplateColumns` scritto qui rendeva la media
             query muta e i due campi restavano impilati anche su schermo largo.
             Misurato a video il 2026-08-12. */
          gap: 'var(--s-8)',
        }}
        className="ricerca-pazienti"
      >
        <label style={{ display: 'block' }}>
          <span className="text-[13px]" style={{ color: 'var(--fg-muted)' }}>
            Che cosa cerchi
          </span>
          <input
            value={cosa}
            onChange={(e) => setCosa(e.target.value)}
            placeholder="es. tossina botulinica, o il nome del medico"
            autoComplete="off"
            style={CAMPO}
          />
        </label>
        <label style={{ display: 'block' }}>
          <span className="text-[13px]" style={{ color: 'var(--fg-muted)' }}>
            Dove
          </span>
          <input
            value={dove}
            onChange={(e) => setDove(e.target.value)}
            placeholder="es. Milano"
            autoComplete="address-level2"
            style={CAMPO}
          />
        </label>
        {/* 🔴 **Il pulsante serve anche se la ricerca è istantanea.** Senza, due
            campi affiancati non si leggono come una ricerca: sembrano un modulo
            a metà, e nessuno capisce che si può scrivere e basta. Qui non
            «invia» — mette a fuoco i risultati e chiude la tastiera sul
            telefono, che è la cosa che serve davvero lì. */}
        <button type="submit" className="btn btn-primario" style={{ minHeight: '48px' }}>
          Cerca
        </button>
      </form>

      {/* ── Le scorciatoie, come le loro nuvole di chip ────────────────── */}
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--s-8)',
          marginTop: 'var(--s-13)',
          padding: 0,
        }}
      >
        {SCORCIATOIE.map((s) => {
          const attiva = normalizza(cosa) === normalizza(s)
          return (
            <li key={s} style={{ listStyle: 'none' }}>
              <button
                type="button"
                onClick={() => setCosa(attiva ? '' : s)}
                aria-pressed={attiva}
                className="text-[15px]"
                style={{
                  minHeight: '44px',
                  padding: '0 var(--s-13)',
                  borderRadius: '999px',
                  border: `1px solid ${attiva ? 'var(--accent)' : 'var(--rule)'}`,
                  background: attiva ? 'var(--accent)' : '#fff',
                  color: attiva ? '#fff' : 'var(--fg)',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            </li>
          )
        })}
      </ul>

          </div>
        </div>
      </div>

      {/* ⚠️ `gabbia` **centra** il contenuto: annidarci dentro un `maxWidth`
          più stretto lo centrava di nuovo, e i risultati rientravano di ~230px
          rispetto alla fascia sopra. Due blocchi della stessa pagina allineati
          a due margini diversi si leggono come due pagine. */}
      <div className="gabbia" style={{ paddingTop: 'var(--s-21)' }}>
        <div style={{ maxWidth: '52rem' }}>
      {/* ── Il conteggio: dice sempre la verità, anche quando è zero ───── */}
      <p
        id="risultati"
        className="text-[15px]"
        style={{ color: 'var(--fg-muted)', marginTop: 'var(--s-21)', scrollMarginTop: 'var(--s-21)' }}
        role="status"
      >
        {risultati.length === 0
          ? 'Nessuno studio corrisponde.'
          : `${risultati.length} ${
              risultati.length === 1
                ? `studio${filtrata ? ' trovato' : ''}`
                : `studi${filtrata ? ' trovati' : ''}`
            }. In ordine alfabetico: nessuno può pagare per comparire più in alto.`}
      </p>

      {risultati.length === 0 ? (
        <p className="mt-[var(--s-13)]">
          {/* ⛔ Non si svuota la pagina: si dice **cosa fare adesso**. NN/g,
              information scent — un vicolo cieco senza uscita fa uscire dal
              sito, non riformulare. */}
          Prova con meno parole, o togli il luogo. Se il tuo medico usa Fibonacci
          e non compare qui, la sua pagina te la può dare lui.
        </p>
      ) : (
        <ul style={{ padding: 0, marginTop: 'var(--s-13)' }}>
          {risultati.map((m) => (
            <VoceElenco key={m.slug} m={m} />
          ))}
        </ul>
      )}
        </div>
      </div>
    </>
  )
}

const CAMPO = {
  display: 'block',
  width: '100%',
  minHeight: '48px',
  marginTop: '2px',
  padding: '0 var(--s-13)',
  border: '1px solid var(--rule)',
  borderRadius: 'var(--r-sm)',
  background: 'var(--bg)',
  font: 'inherit',
  color: 'var(--fg)',
} as const
