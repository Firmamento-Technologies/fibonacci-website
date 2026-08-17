'use client'

import { t } from '@/lib/testo'
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

/* ⛔ Nessuno dei due canali è configurato ⇒ il modulo NON si disegna.
 *
 * Non è prudenza eccessiva: fino al 2026-08-11 `LEAD_API_URL` puntava a una
 * macchina sparita che rispondeva **HTTP 502** (misurato con `curl`), e il
 * ripiego `mailto:` era spento perché `CONTACT_EMAIL` è vuota. Il risultato era
 * il peggiore possibile — il medico compilava quattro campi, aspettava una
 * richiesta destinata a fallire, e vedeva un errore.
 *
 * ⚖️ È la stessa regola già pagata con `DEMO_URL`: *un invito che porta a una
 * pagina d'errore non consegna il differenziatore, consegna l'opposto*. Meglio
 * dire che il canale non è attivo che sprecare il tempo di chi voleva parlarci.
 *
 * ✅ Una riga sola lo riaccende — l'endpoint **oppure** la casella — e non c'è
 * niente da toccare qui dentro. */
const CANALE_ATTIVO = Boolean(LEAD_API_URL) || Boolean(CONTACT_EMAIL)

const PROCEDURE = [
  t('modulodemo.tossina_botulinica_e_filler'),
  t('modulodemo.laser_ed_energie'),
  t('modulodemo.biorivitalizzazione_e_peeling'),
  t('modulodemo.medicina_estetica_del_corpo'),
  t('modulodemo.un_misto_di_queste'),
] as const

/* `variante` esiste per una ragione sola: alla pagina delle società
 * scientifiche serviva un modulo, e riusare questo così com'era avrebbe
 * costretto il presidente di una società a scegliere «Tossina botulinica e
 * filler» da un elenco obbligatorio di procedure. Meglio una variante additiva
 * che un secondo canale: il canale è uno (`LEAD_API_URL`), il ripiego a
 * casella vuota è già gestito qui, e `pagina` nel corpo dice già da dove
 * arriva la richiesta. Il valore predefinito lascia le due pagine esistenti
 * identiche al byte. */
export function ModuloDemo({
  compatto = false,
  variante = 'demo',
}: {
  compatto?: boolean
  variante?: 'demo' | 'societa'
}) {
  const perSocieta = variante === 'societa'
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
      intent: perSocieta ? 'societa-scientifica' : 'demo-estetica',
      nome: dati.nome,
      studio: dati.studio,
      email: dati.email,
      procedure: dati.procedure,
      pagina: typeof window !== 'undefined' ? window.location.pathname : '',
    }

    try {
      /* 🔴 **SENZA ENDPOINT NON SI CHIAMA `fetch`, e il motivo è costato un
         contatto vero.** `LEAD_API_URL` è `''`, e `fetch('')` **non fallisce**:
         manda la POST alla **pagina corrente**, che su un sito statico risponde
         **200** — misurato dal vivo il 2026-08-12 su `/richiedi-una-demo/` e
         sulla home. ⇒ `risposta.ok` era vero, il ripiego non scattava mai, e il
         modulo diceva *«Ti scriviamo entro un giorno lavorativo»* mentre il
         messaggio non era andato **da nessuna parte**.

         ⚠️ Il ripiego qui sotto era stato scritto proprio per non fallire in
         silenzio, ma copriva il caso «l'endpoint non risponde». Non copriva
         quello in cui **l'endpoint non c'è**: lì la richiesta *riesce*, contro
         sé stessa. ⇒ Un ripiego che si attiva solo sull'errore non protegge
         dalla configurazione mancante — quella va guardata **prima**. */
      if (!LEAD_API_URL) throw new Error('nessun endpoint configurato')
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
        const oggetto = encodeURIComponent(
          perSocieta ? 'Contatto da una società scientifica' : 'Richiesta di demo guidata',
        )
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

  if (!CANALE_ATTIVO) {
    return (
      <div role="status">
        <p className="occhiello">{t('modulodemo.contatti')}</p>
        <h3 className="mt-[var(--s-13)] text-[1.3rem]">{t('modulodemo.il_modulo_non_e_ancora_attivo')}</h3>
        <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          {t('modulodemo.stiamo_attivando_la_casella_con_cui')}
        </p>
      </div>
    )
  }

  if (stato === 'inviato') {
    return (
      <div role="status">
        <p className="occhiello">{t('modulodemo.ricevuto')}</p>
        <h3 className="mt-[var(--s-13)] text-[1.3rem]">
          {viaPosta ? t('modulodemo.si_apre_il_tuo_programma_di') : t('modulodemo.ti_scriviamo_entro_un_giorno_lavorativo')}
        </h3>
        <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          {viaPosta
            ? t('modulodemo.il_modulo_non_e_riuscito_a')
            : perSocieta
              ? t('modulodemo.risponde_una_persona_non_un_modulo')
              : t('modulodemo.proponiamo_due_o_tre_fasce_orarie')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={invia} noValidate={false}>
      {!compatto && (
        <>
          <p className="occhiello">{perSocieta ? t('modulodemo.scrivici') : t('modulodemo.richiedi_una_demo')}</p>
          <h3 className="mt-[var(--s-13)] text-[1.3rem]">
            {perSocieta ? t('modulodemo.quattro_campi_e_ti_risponde_una') : t('modulodemo.quattro_campi_poi_ti_scriviamo_noi')}
          </h3>
        </>
      )}

      <div className={`${compatto ? '' : 'mt-[var(--s-21)]'} space-y-[var(--s-13)]`}>
        <Campo id="nome" etichetta={t('modulodemo.nome_e_cognome')} valore={dati.nome} onChange={aggiorna('nome')} autoComplete="name" />
        <Campo
          id="studio"
          etichetta={perSocieta ? t('modulodemo.societa_o_associazione') : t('modulodemo.nome_dello_studio')}
          valore={dati.studio}
          onChange={aggiorna('studio')}
          autoComplete="organization"
        />
        <Campo id="email" etichetta={t('modulodemo.email')} tipo="email" valore={dati.email} onChange={aggiorna('email')} autoComplete="email" />

        {perSocieta ? (
          <Campo
            id="procedure"
            etichetta={t('modulodemo.che_ruolo_hai_nella_societa')}
            valore={dati.procedure}
            onChange={aggiorna('procedure')}
          />
        ) : (
          <div>
            <label htmlFor="procedure" className="numero">{t('modulodemo.che_procedure_fai')}</label>
            <select
              id="procedure"
              required
              value={dati.procedure}
              onChange={aggiorna('procedure')}
              className="mt-[var(--s-5)] w-full"
              style={campoStile}
            >
              <option value="" disabled>{t('modulodemo.scegli')}</option>
              {PROCEDURE.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* ⛔ MISURA ex art. 32, non una cortesia — decisione 2026-08-10: il supporto
          NON deve vedere i dati dei pazienti ([[decisione-supporto-clienti]]).
          L'EDPB distingue l'accesso «sistematico» (che ci renderebbe responsabili
          del trattamento) da quello «puramente accessorio ed estremamente
          limitato», e la differenza la fanno le misure che lo IMPEDISCONO.
          ⚠️ Sta QUI, accanto al campo, e non nelle condizioni d'uso: una regola
          scritta in un documento che nessuno apre non impedisce niente. */}
      <p
        className="mt-[var(--s-13)] text-[13px]"
        style={{ color: 'var(--fg-muted)' }}
        data-misura="niente-dati-pazienti"
      >
        ⛔ <strong>{t('modulodemo.non_scrivere_qui_dati_di_pazienti')}</strong>: né nomi, né date di nascita,
        né schermate della cartella. Per capire un problema ci basta il{' '}
        <strong>codice di riferimento</strong> che l&apos;applicazione mostra quando qualcosa
        va storto.
      </p>

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
        {stato === 'invio' ? t('modulodemo.invio') : perSocieta ? t('modulodemo.scrivici') : t('modulodemo.richiedi_una_demo')}
      </button>

      {stato === 'errore' && (
        <p role="alert" className="mt-[var(--s-13)] text-[13px]" style={{ color: '#9c2626' }}>
          {t('modulodemo.la_richiesta_non_e_partita')}{' '}
          <button
            type="button"
            onClick={() => setStato('fermo')}
            style={{ color: 'var(--accent-deep)', textDecoration: 'underline' }}
          >
            {t('modulodemo.riprova')}
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
  /* ⚠️ Il margine verticale passa da una variabile perché su telefono un
     modulo di quattro campi è arrivato a 797px su 755 utili: 3px per campo
     sopra e sotto, per quattro campi più il selettore, sono i ~40px che
     mancavano. Il bersaglio resta ben oltre i 24×24px di WCAG 2.2 SC 2.5.8 —
     il campo è alto 40px anche a 8. */
  padding: 'var(--pad-campo, 11px) 13px',
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
