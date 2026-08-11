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
}: {
  children: ReactNode
  /** Riga in cima, sopra tutto: oggi serve a dichiarare le pagine di esempio. */
  avviso?: ReactNode
}) {
  return (
    <>
      {avviso && (
        <div
          role="status"
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
          <Link href="/pazienti" aria-label="Trova un medico, pagina iniziale">
            <Logo />
          </Link>
        </div>
      </header>

      <main id="contenuto">{children}</main>

      <footer
        style={{
          marginTop: 'var(--s-89)',
          padding: 'var(--s-55) 0',
          borderTop: '1px solid var(--rule)',
        }}
      >
        <div className="gabbia" style={{ color: 'var(--fg-muted)', fontSize: '14px' }}>
          <p style={{ maxWidth: 'var(--measure)' }}>
            Questa pagina è pubblicata dallo studio che vi compare, attraverso Fibonacci.
            Le informazioni cliniche restano di sua responsabilità.{' '}
            {/* ⚖️ L'appuntamento è una **richiesta**, non una prenotazione
                confermata: il sidecar crea l'appuntamento in stato `pending`
                proprio per questo, e la pagina non deve dire al paziente una
                cosa che lo studio non ha ancora confermato. */}
            Le richieste di appuntamento vengono confermate dallo studio.
          </p>
          {/* ⚠️ L'anagrafica si accende da sola il giorno dell'iscrizione al
              registro delle imprese: `SOCIETA.costituita` è l'unico
              interruttore, e i suoi consumatori sono già quattro. Finché è
              spento **si dichiara il vuoto**, non si inventa un indirizzo. */}
          <p style={{ marginTop: 'var(--s-21)' }}>
            {SOCIETA.costituita
              ? `${SOCIETA.ragioneSociale} · P. IVA ${SOCIETA.partitaIva}`
              : 'La società titolare del servizio è in costituzione: i dati compariranno qui appena iscritta al registro delle imprese.'}
          </p>
        </div>
      </footer>
    </>
  )
}
