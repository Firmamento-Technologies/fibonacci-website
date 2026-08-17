'use client'

import { t } from '@/lib/testo'
import { useState } from 'react'
import { CONTATTO_API_URL } from '@/lib/site-config'

/* Il modulo da cui una persona scrive a un medico dell'elenco. — TD-166, F5
 *
 * 🔑 IL GIRO, per intero, perché la metà che si vede qui è la meno importante:
 *
 *   1. si compila e si invia  →  arriva un'email **a chi ha scritto**
 *   2. si clicca il link      →  **solo allora** il medico riceve
 *
 * ⚠️ Il passo 1 sembra un attrito gratuito e non lo è: senza, l'endpoint è un
 * relay aperto verso migliaia di persone reali, e chiunque potrebbe far
 * arrivare qualunque testo a qualunque studio col nostro dominio come
 * mittente. E l'indirizzo **serve comunque**, perché è lì che il medico
 * risponde: confermarlo non aggiunge un campo, aggiunge un clic.
 *
 * ── LE QUATTRO REGOLE DI QUESTO FILE ───────────────────────────────────────
 *
 * 1. ⛔ **Senza indirizzo dell'endpoint, la sezione NON esiste.**
 *    ⚠️ È la lezione di TD-108, pagata con un contatto vero perso: là
 *    `LEAD_API_URL` era la stringa vuota, `fetch('')` **non fallisce** (manda
 *    la POST alla pagina corrente, che su un sito statico risponde **200**), e
 *    il modulo scriveva «Ti scriviamo entro un giorno lavorativo» mentre il
 *    messaggio non era andato da nessuna parte. ⇒ qui si controlla **prima di
 *    partire**, e da spento non si mostra niente: nessuna casella, nessun
 *    pulsante, nessuna promessa.
 *
 * 2. 🔴 **La risposta d'emergenza NON è un errore, e non deve sembrarlo.**
 *    Se il testo fa scattare il gate del 118, il messaggio ⛔ non parte e a
 *    schermo compare l'indicazione di chiamare il 112 o il 118. Trattarla come
 *    «invio fallito, riprova» sarebbe il difetto peggiore che questo modulo
 *    possa avere: qualcuno che sta male riproverebbe invece di chiamare.
 *
 * 3. ⛔ **Non si promette una risposta, né un tempo.** È un messaggio, non un
 *    consulto: il medico risponde se e quando può. Scrivere «ti risponderà
 *    entro X» sarebbe una promessa che facciamo noi e che mantiene un altro.
 *
 * 4. ⛔ **Non si conserva niente qui.** Nessuna bozza in `localStorage`,
 *    nessuna cronologia: quello che una persona scrive cercando un medico
 *    estetico è dato dell'art. 9 **per inferenza** (CGUE C-184/20), e il posto
 *    dove vive è la casella del medico, non il nostro sito.
 */

type Stato =
  | { fase: 'compila' }
  | { fase: 'invio' }
  | { fase: 'fatto'; messaggio: string }
  | { fase: 'emergenza'; messaggio: string }
  | { fase: 'errore'; messaggio: string }

export function ModuloContatto({
  dominio,
  nomeStudio,
}: {
  /** La chiave dello studio nell'elenco: è ciò che l'endpoint usa per trovarne
   *  il recapito. ⛔ L'indirizzo email non passa mai dal browser. */
  dominio: string
  nomeStudio: string
}) {
  const [stato, setStato] = useState<Stato>({ fase: 'compila' })
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [comune, setComune] = useState('')
  const [testo, setTesto] = useState('')

  // Regola 1: da spento la sezione non esiste.
  if (!CONTATTO_API_URL) return null

  async function invia(e: React.FormEvent) {
    e.preventDefault()
    setStato({ fase: 'invio' })
    try {
      const r = await fetch(`${CONTATTO_API_URL}/pubblico/contatto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dominio, nome, email, comune, testo }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok && d.esito === 'emergenza') {
        setStato({ fase: 'emergenza', messaggio: d.messaggio })
        return
      }
      if (r.ok) {
        setStato({ fase: 'fatto', messaggio: d.messaggio ?? '' })
        return
      }
      /* Il motivo arriva dal server ed è già scritto per essere letto da chi
       * ha compilato: ⛔ non si riscrive qui, o le due versioni divergono. */
      setStato({
        fase: 'errore',
        messaggio:
          typeof d.detail === 'string' ? d.detail : 'Non è stato possibile inviare. Riprova fra poco.',
      })
    } catch {
      setStato({ fase: 'errore', messaggio: 'Non è stato possibile inviare. Riprova fra poco.' })
    }
  }

  if (stato.fase === 'emergenza') {
    /* Regola 2: ⛔ non somiglia a un errore. Fondo pieno, nessun pulsante per
     * riprovare, e il testo è quello di `regola118`, passato da una revisione
     * clinica: ⛔ non se ne scrive una seconda versione qui. */
    return (
      <div
        role="alert"
        className="gabbia"
        style={{
          background: 'var(--rosso-tenue, #fdf0ee)',
          border: '2px solid var(--rosso, #b3261e)',
          borderRadius: '10px',
          padding: 'var(--s-21)',
          marginTop: 'var(--s-34)',
        }}
      >
        <p style={{ fontWeight: 600, color: 'var(--rosso, #b3261e)', marginBottom: 'var(--s-8)' }}>
          {t('pazienti.modulocontatto.non_abbiamo_inviato_il_messaggio_di')}
        </p>
        <p>{stato.messaggio}</p>
      </div>
    )
  }

  if (stato.fase === 'fatto') {
    return (
      <div className="prosa" style={{ marginTop: 'var(--s-34)' }}>
        <h2>{t('pazienti.modulocontatto.controlla_la_tua_email')}</h2>
        <p>{stato.messaggio}</p>
        {/* Regola 3: si dice cosa succede, ⛔ non quando arriva una risposta. */}
        <p style={{ fontSize: '15px', color: 'var(--fg-muted)' }}>
          Il messaggio parte solo dopo che hai confermato l’indirizzo. Da quel momento è{' '}
          {nomeStudio} a decidere se e quando risponderti: noi non lo sappiamo e non lo
          sollecitiamo.
        </p>
      </div>
    )
  }

  const inCorso = stato.fase === 'invio'

  return (
    <form onSubmit={invia} className="prosa" style={{ marginTop: 'var(--s-34)' }}>
      <h2>Scrivi a {nomeStudio}</h2>
      <p style={{ fontSize: '15px', color: 'var(--fg-muted)' }}>
        {t('pazienti.modulocontatto.il_messaggio_e_tuo_noi_lo')}
      </p>

      <Campo id="c-nome" etichetta={t('pazienti.modulocontatto.come_ti_chiami')} valore={nome} onChange={setNome} />
      <Campo
        id="c-email"
        etichetta={t('pazienti.modulocontatto.la_tua_email')}
        tipo="email"
        aiuto="Ci arriva prima un messaggio di conferma: senza il tuo clic non parte niente."
        valore={email}
        onChange={setEmail}
      />
      <Campo
        id="c-comune"
        etichetta={t('pazienti.modulocontatto.in_che_zona_sei')}
        aiuto="Facoltativo."
        obbligatorio={false}
        valore={comune}
        onChange={setComune}
      />

      <p style={{ marginTop: 'var(--s-21)' }}>
        <label htmlFor="c-testo" className="block text-[15px]" style={{ fontWeight: 500 }}>
          {t('pazienti.modulocontatto.che_cosa_ti_serve')}
        </label>
        <textarea
          id="c-testo"
          required
          maxLength={1500}
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          rows={5}
          className="campo-ricerca"
          style={{ minHeight: '8rem', padding: 'var(--s-8) var(--s-13)', resize: 'vertical' }}
        />
      </p>

      {stato.fase === 'errore' && (
        <p role="alert" style={{ color: 'var(--rosso, #b3261e)', fontWeight: 500 }}>
          {stato.messaggio}
        </p>
      )}

      <p>
        <button type="submit" className="btn" disabled={inCorso} style={{ minHeight: '48px' }}>
          {inCorso ? t('pazienti.modulocontatto.invio') : t('pazienti.modulocontatto.invia_il_messaggio')}
        </button>
      </p>

      {/* ⚠️ Sta qui, sotto il pulsante, e ⛔ non in fondo alla pagina in grigio:
          è la riga che impedisce di scambiare questo modulo per un canale di
          soccorso, ed è l'unica cosa che qualcuno deve leggere **prima** di
          scrivere se sta male. */}
      <p style={{ fontSize: '13px', color: 'var(--fg-muted)' }}>
        {t('pazienti.modulocontatto.non_e_un_canale_di_emergenza')}
      </p>
    </form>
  )
}

function Campo({
  id,
  etichetta,
  aiuto,
  valore,
  onChange,
  tipo = 'text',
  obbligatorio = true,
}: {
  id: string
  etichetta: string
  aiuto?: string
  valore: string
  onChange: (v: string) => void
  tipo?: string
  obbligatorio?: boolean
}) {
  return (
    <p style={{ marginTop: 'var(--s-21)' }}>
      <label htmlFor={id} className="block text-[15px]" style={{ fontWeight: 500 }}>
        {etichetta}
      </label>
      {aiuto && (
        <span className="block text-[13px]" style={{ color: 'var(--fg-muted)' }}>
          {aiuto}
        </span>
      )}
      <input
        id={id}
        type={tipo}
        required={obbligatorio}
        value={valore}
        onChange={(e) => onChange(e.target.value)}
        className="campo-ricerca"
        style={{ minHeight: '48px', padding: 'var(--s-8) var(--s-13)' }}
      />
    </p>
  )
}
