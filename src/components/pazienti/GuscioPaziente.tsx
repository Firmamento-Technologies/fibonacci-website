import { t } from '@/lib/testo'
import { LINGUA } from '@/lib/lingua'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { SOCIETA } from '@/lib/site-config'

/* Il guscio del lato paziente.
 *
 * ── PERCHE' NON RIUSA `chrome/Header` E `chrome/Footer` ────────────────────
 * 🔑 **Il guscio del sito si riusa, la navigazione no** — ed è una distinzione
 * che è costata una correzione al piano. Si riusano davvero: `globals.css`
 * (scala di Fibonacci, colori, **contrasti già verificati**), `lib/`, i
 * primitivi, la costruzione, il collaudo. ⛔ Non si riusa il **menu**:
 * `chrome/Header` porta «Prezzi», «Come funziona», «Richiedi una demo» e il
 * pulsante di accesso all'applicazione, e `chrome/Footer` ha quattro colonne
 * che vendono un gestionale.
 *
 * Un paziente arrivato qui dal nome del suo medico non deve trovare
 * un'offerta software: sarebbe la prova, in cima alla pagina, che il posto in
 * cui è finito non è per lui.
 *
 * ⛔ **Nessuna chiamata a terzi da questa pagina**, e non è un dettaglio di
 * stile: i font sono auto-ospitati in costruzione, e **è la ragione tecnica
 * per cui questo sito non ha il banner dei cookie**. Una mappa incorporata, un
 * carattere remoto o un contatore di visite la butterebbero via da soli — e
 * con essa la posizione, non solo la comodità. Vedi
 * [[piano-canale-paziente-implementazione]] §P4.1.
 */
export function GuscioPaziente({
  children,
  avviso,
  scheda,
}: {
  children: ReactNode
  /** Riga in cima, sopra tutto: oggi serve a dichiarare le pagine di esempio. */
  avviso?: ReactNode
  /** Che cosa È questa pagina, per chi la legge a macchina. Oggi un valore
   *  solo, `'esempio'`: lo scrive la scheda di uno studio di prova e lo
   *  controlla il rilascio. ⛔ Non è decorazione: senza, quella pagina viene
   *  trattata come la scheda di un medico vero e il rilascio si ferma. */
  scheda?: 'esempio'
}) {
  return (
    <>
      {avviso && (
        <div
          role="status"
          data-scheda={scheda}
          className="text-center"
          style={{
            background: 'var(--bg-sunk)',
            color: 'var(--fg)',
            padding: 'var(--s-13) var(--s-21)',
            fontSize: '15px',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          {avviso}
        </div>
      )}

      {/* ✅ Il marchio torna cliccabile: `/pazienti` **ora esiste**. La regola
          resta — ⛔ non si aggiunge qui una voce prima che la sua pagina esista,
          perché un marchio che porta a un 404 è peggio di un marchio fermo — e
          ⛔ non si collega alla vetrina, che manderebbe un paziente su
          un'offerta di software. */}
      <header style={{ padding: 'var(--s-21) 0' }}>
        <div className="gabbia flex items-center gap-[var(--s-13)]">
          <Link href="/pazienti" aria-label={t('pazienti.gusciopaziente.trova_un_medico_pagina_iniziale')}>
            <Logo />
          </Link>
        </div>
      </header>

      {/* ── LA NOTA DI GIURISDIZIONE (TD-207) ──────────────────────────
          🔴 **Il difetto che chiude, misurato in vetrina il 2026-08-18**: la
          versione francese di `/pazienti/prima-di-un-trattamento/` diceva
          **due volte** «la loi 219/2017 liste ce que tu as le droit de
          savoir». Una persona in Francia leggeva, in francese, che i suoi
          diritti di paziente stanno in una **legge italiana**.

          🔑 **Sta nel GUSCIO e non sulle singole pagine**, ed è la parte che
          conta: le pagine paziente sono quattro oggi, e la quinta la scriverà
          qualcun altro. Un elenco di pagine da annotare invecchia **in
          silenzio** — la pagina nuova esce senza avviso e nessuno se ne
          accorge. Qui la eredita chi entra.

          ⛔ **Non traduce l'obbligo italiano nel suo equivalente locale.**
          Scrivere che in Francia vale l'art. L1111-2 CSP vorrebbe dire dare
          una consulenza legale su un ordinamento che ⛔ nessuno qui ha
          verificato, e un riferimento normativo sbagliato **viaggia**: chi lo
          legge lo cita. Si dice l'unica cosa onesta: *questo pezzo è
          italiano, la regola applicabile è la tua*.

          ⚠️ In italiano ⛔ non compare: al lettore italiano direbbe che la
          legge italiana è italiana. */}
      {LINGUA !== 'it' && (
        <aside
          role="note"
          className="gabbia"
          style={{
            border: '1px solid var(--rule)',
            borderRadius: '4px',
            padding: 'var(--s-21)',
            marginBottom: 'var(--s-34)',
            fontSize: '15px',
            color: 'var(--fg-muted)',
          }}
        >
          <strong style={{ color: 'var(--fg)' }}>
            {t('pazienti.giurisdizione.titolo')}
          </strong>{' '}
          {t('pazienti.giurisdizione.testo')}
        </aside>
      )}

      <main id="contenuto">{children}</main>

      <footer
        style={{
          marginTop: 'var(--s-89)',
          padding: 'var(--s-55) 0',
          borderTop: '1px solid var(--rule)',
        }}
      >
        <div className="gabbia" style={{ color: 'var(--fg-muted)', fontSize: '14px' }}>
          {/* ── Le guide ────────────────────────────────────────────────────
              🔴 **Stavano sulla pagina dei risultati, come tre schede numerate
              intitolate «Tre controlli che puoi fare da solo». Sono state
              tolte da lì il 2026-08-13, su rilievo dell'utente**: *«non creano
              sfiducia nei medici e nel portale stesso?»*. Sì — un elenco di
              medici che si apre invitando a controllarli dice al lettore che
              noi non l'abbiamo fatto, e lo dice anche al medico che dovrebbe
              pubblicare qui la sua pagina.
              🔑 **I contenuti però sono buoni e restano**: consenso informato e
              domande da fare prima di un trattamento sono informazione di
              servizio, e su queste ricerche il terreno è vuoto. Cambia il
              posto: **il piè di pagina è dove le guide si cercano**, non dove
              si mettono in mano a chi non le ha chieste.
              ⚠️ `verificare-un-medico` è ancora scritta come *«controllalo
              tu»*: la riscrittura è dentro TD-115, non si può fare qui. */}
          <nav aria-label={t('pazienti.gusciopaziente.guide_per_il_paziente')} style={{ marginBottom: 'var(--s-34)' }}>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-8) var(--s-21)', padding: 0 }}>
              {[
                ['/pazienti/prima-di-un-trattamento', t('pazienti.consensoinformato.le_domande_da_fare_prima_di')],
                ['/pazienti/consenso-informato', t('pazienti.primadiuntrattamento.che_cos_e_il_consenso_informato')],
                ['/pazienti/verificare-un-medico', t('pazienti.gusciopaziente.l_albo_dei_medici_come_si_consulta')],
                ['/pazienti/privacy', t('pazienti.gusciopaziente.i_tuoi_dati')],
              ].map(([href, testo]) => (
                <li key={href} style={{ listStyle: 'none' }}>
                  <Link href={href} className="collegamento-testo">
                    {testo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p style={{ maxWidth: 'var(--measure)' }}>
            {t('pazienti.gusciopaziente.questa_pagina_e_pubblicata_dallo_studio')}{' '}
            {/* ⚖️ L'appuntamento è una **richiesta**, non una prenotazione
                confermata: il sidecar crea l'appuntamento in stato `pending`
                proprio per questo, e la pagina non deve dire al paziente una
                cosa che lo studio non ha ancora confermato. */}
            {t('pazienti.gusciopaziente.le_richieste_di_appuntamento_vengono_confermate')}
          </p>
          {/* ⚠️ L'anagrafica si accende da sola il giorno dell'iscrizione al
              registro delle imprese: `SOCIETA.costituita` è l'unico
              interruttore, e i suoi consumatori sono già quattro. Finché è
              spento **si dichiara il vuoto**, non si inventa un indirizzo. */}
          <p style={{ marginTop: 'var(--s-21)' }}>
            {SOCIETA.costituita
              ? `${SOCIETA.ragioneSociale} · P. IVA ${SOCIETA.partitaIva}`
              : t('pazienti.gusciopaziente.la_societa_titolare_del_servizio_e')}
          </p>
        </div>
      </footer>
    </>
  )
}
