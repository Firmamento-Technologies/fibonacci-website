'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { LEAD_API_URL, CONTACT_EMAIL } from '@/lib/site-config'

/* Quattro campi.
 *
 * NN/g raccomanda 3-5 campi per un modulo di contatto; un test citato da CXL
 * riporta +160% di invii passando da 11 campi a 4, senza perdita di qualità
 * dei contatti. Ogni campo in più qui è una vendita in meno, e nessuno di
 * questi quattro può essere tolto senza rendere inutile la chiamata.
 *
 * Il consenso al trattamento è una casella NON preselezionata: il GDPR non
 * ammette il consenso per silenzio, e una casella già spuntata su un modulo
 * sanitario è il genere di dettaglio che un medico prudente nota. */

type Stato = 'fermo' | 'invio' | 'inviato' | 'errore'

const PROCEDURE = [
  'Tossina botulinica e filler',
  'Laser ed energie',
  'Biorivitalizzazione e peeling',
  'Medicina estetica del corpo',
  'Un misto di queste',
] as const

export function ModuloDemo({ compatto = false }: { compatto?: boolean }) {
  const [stato, setStato] = useState<Stato>('fermo')
  const [viaPosta, setViaPosta] = useState(false)
  const [dati, setDati] = useState({ nome: '', studio: '', email: '', procedure: '' })
  const [consenso, setConsenso] = useState(false)

  const aggiorna = (campo: keyof typeof dati) => (e: { target: { value: string } }) =>
    setDati((d) => ({ ...d, [campo]: e.target.value }))

  async function invia(e: FormEvent) {
    e.preventDefault()
    if (!consenso) return
    setStato('invio')

    const corpo = {
      intent: 'demo-estetica',
      nome: dati.nome,
      studio: dati.studio,
      email: dati.email,
      procedure: dati.procedure,
      pagina: typeof window !== 'undefined' ? window.location.pathname : '',
    }

    try {
      const risposta = await fetch(LEAD_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      })
      if (!risposta.ok) throw new Error(String(risposta.status))
      setStato('inviato')
    } catch {
      /* Se l'endpoint non risponde, il contatto non si perde: si apre il
         client di posta col messaggio già scritto. Un modulo che fallisce in
         silenzio è peggio di un modulo che non c'è.
         Senza una casella configurata questo ripiego non esiste, e allora la
         cosa onesta è dirlo invece di far credere che sia partito. */
      if (CONTACT_EMAIL) {
        const oggetto = encodeURIComponent('Richiesta di demo guidata')
        const testo = encodeURIComponent(
          [
            `Nome: ${dati.nome}`,
            `Studio: ${dati.studio}`,
            `Email: ${dati.email}`,
            `Procedure: ${dati.procedure}`,
          ].join('\n'),
        )
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${oggetto}&body=${testo}`
        setViaPosta(true)
        setStato('inviato')
      } else {
        setStato('errore')
      }
    }
  }

  if (stato === 'inviato') {
    return (
      <div role="status">
        <p className="occhiello">Ricevuto</p>
        <h3 className="mt-[var(--s-13)] text-[1.35rem]">
          {viaPosta ? 'Si apre il tuo programma di posta' : 'Ti scriviamo entro un giorno lavorativo'}
        </h3>
        <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          {viaPosta
            ? 'Il modulo non è riuscito a raggiungerci, quindi il messaggio è già pronto nel tuo programma di posta: manca solo che tu lo invii.'
            : 'Proponiamo due o tre fasce orarie. Se nessuna va bene, rispondi con le tue.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={invia} noValidate={false}>
      {!compatto && (
        <>
          <p className="occhiello">Richiedi una demo guidata</p>
          <h3 className="mt-[var(--s-13)] text-[1.35rem]">Quattro campi, poi ti scriviamo noi</h3>
        </>
      )}

      <div className={`${compatto ? '' : 'mt-[var(--s-21)]'} space-y-[var(--s-13)]`}>
        <Campo id="nome" etichetta="Nome e cognome" valore={dati.nome} onChange={aggiorna('nome')} autoComplete="name" />
        <Campo id="studio" etichetta="Nome dello studio" valore={dati.studio} onChange={aggiorna('studio')} autoComplete="organization" />
        <Campo id="email" etichetta="Email" tipo="email" valore={dati.email} onChange={aggiorna('email')} autoComplete="email" />

        <div>
          <label htmlFor="procedure" className="numero">Che procedure fai</label>
          <select
            id="procedure"
            required
            value={dati.procedure}
            onChange={aggiorna('procedure')}
            className="mt-[var(--s-5)] w-full"
            style={campoStile}
          >
            <option value="" disabled>Scegli</option>
            {PROCEDURE.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <label className="mt-[var(--s-21)] flex cursor-pointer items-start gap-[var(--s-13)]">
        <input
          type="checkbox"
          checked={consenso}
          onChange={(e) => setConsenso(e.target.checked)}
          required
          style={{ marginTop: 4, width: 17, height: 17, accentColor: 'var(--accent)', flexShrink: 0 }}
        />
        <span className="text-[13px]" style={{ color: 'var(--fg-muted)' }}>
          Ho letto l&apos;{' '}
          <Link href="/privacy" style={{ color: 'var(--accent-deep)', borderBottom: '1px solid var(--rule-strong)' }}>
            informativa privacy
          </Link>{' '}
          e acconsento a essere ricontattato per questa richiesta. Non ti iscriviamo a nessuna
          newsletter e non cediamo il tuo indirizzo a nessuno.
        </span>
      </label>

      <button
        type="submit"
        className="btn btn-primario mt-[var(--s-21)] w-full"
        disabled={stato === 'invio' || !consenso}
        style={{ opacity: !consenso ? 0.55 : 1 }}
      >
        {stato === 'invio' ? 'Invio…' : 'Richiedi la demo'}
      </button>

      {stato === 'errore' && (
        <p role="alert" className="mt-[var(--s-13)] text-[14px]" style={{ color: '#9c2626' }}>
          La richiesta non è partita.{' '}
          <button
            type="button"
            onClick={() => setStato('fermo')}
            style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}
          >
            Riprova
          </button>
          {CONTACT_EMAIL ? (
            <>
              , oppure scrivi a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}>
                {CONTACT_EMAIL}
              </a>
              .
            </>
          ) : (
            ' fra qualche minuto.'
          )}
        </p>
      )}
    </form>
  )
}

const campoStile: React.CSSProperties = {
  padding: '11px 13px',
  border: '1px solid var(--rule-strong)',
  borderRadius: 'var(--r)',
  background: 'var(--paper)',
  fontSize: 15,
  fontFamily: 'var(--font-sans)',
  color: 'var(--fg)',
  width: '100%',
  minHeight: 46,
}

function Campo({
  id,
  etichetta,
  valore,
  onChange,
  tipo = 'text',
  autoComplete,
}: {
  id: string
  etichetta: string
  valore: string
  onChange: (e: { target: { value: string } }) => void
  tipo?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="numero">{etichetta}</label>
      <input
        id={id}
        name={id}
        type={tipo}
        required
        value={valore}
        onChange={onChange}
        autoComplete={autoComplete}
        className="mt-[var(--s-5)]"
        style={campoStile}
      />
    </div>
  )
}
