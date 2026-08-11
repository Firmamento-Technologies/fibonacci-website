import type { SchedaMedicoPubblica } from '@/lib/medici-pubblici'
import { quandoInItaliano } from '@/lib/medici-pubblici'

/* La scheda di un medico, lato paziente.
 *
 * 🔑 **Il principio organizzatore di questa pagina è la verificabilità**, non
 * la persuasione. Di là — il sito che vende il gestionale — è *un consenso che
 * si compone scorrendo*. Qui la domanda del lettore è un'altra e più semplice:
 * «questa persona esiste davvero, ed è libera quando mi serve?». Perciò
 * l'ordine è: chi è → **il numero d'iscrizione all'albo** → dove → cosa fa →
 * quando è libero.
 *
 * ⚠️ **Niente tappe.** `chrome/Pagina` avvolge tutto in `Tappe` (una schermata
 * per sezione, la V per avanzare): è un dispositivo di lettura per un acquisto
 * ponderato, e chi vuole prenotare dal telefono ⛔ non deve attraversare
 * dodici schermate per arrivare al pulsante.
 *
 * ⛔ Cosa NON compare, per legge e per scelta:
 *   · nessun prezzo, sconto, «prima visita gratuita» (L. 145/2018 c. 525:
 *     escluso «qualsiasi elemento di carattere attrattivo e suggestivo»);
 *   · nessuna foto prima/dopo, nessun superlativo, nessuna comparazione;
 *   · nessuna recensione e nessun voto;
 *   · nessuna mappa incorporata — l'indirizzo è testo e il collegamento si
 *     apre altrove: una mappa di terzi butterebbe via da sola la ragione per
 *     cui questo sito non ha il banner dei cookie.
 */
export function SchedaMedico({ m }: { m: SchedaMedicoPubblica }) {
  const mappa = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    `${m.studio.indirizzo}, ${m.studio.comune}`,
  )}`

  return (
    <article className="gabbia" style={{ paddingTop: 'var(--s-34)', paddingBottom: 'var(--s-55)' }}>
      <header style={{ maxWidth: 'var(--measure)' }}>
        <p className="text-[13px] uppercase tracking-[.08em]" style={{ color: 'var(--fg-faint)' }}>
          {m.medico.titolo}
        </p>
        <h1 className="mt-[var(--s-8)] text-[length:var(--display-2)]">{m.medico.nome}</h1>
        <p className="mt-[var(--s-13)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
          {m.studio.nome} · {m.studio.comune}
        </p>
      </header>

      {/* ── L'iscrizione all'albo ───────────────────────────────────────────
          🔑 È il pezzo che vale di più e che nessuno degli altri portali mette
          in evidenza. In medicina estetica esercita anche chi non dovrebbe:
          un numero d'iscrizione, che il paziente può controllare da solo sul
          sito dell'Ordine, è l'unica informazione di fiducia che non si può
          millantare — e ce l'abbiamo già nel dato. */}
      <section
        aria-labelledby="albo"
        style={{
          marginTop: 'var(--s-34)',
          padding: 'var(--s-21)',
          background: 'var(--bg-sunk)',
          borderRadius: 'var(--r-lg)',
          maxWidth: 'var(--measure)',
        }}
      >
        <h2 id="albo" className="text-[length:var(--display-3)]">
          Iscrizione all’Ordine dei Medici
        </h2>
        <p className="mt-[var(--s-13)]">
          Ordine di <strong>{m.medico.ordineProvinciale}</strong>, numero{' '}
          <strong>{m.medico.numeroIscrizione}</strong>.
        </p>
        <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          Puoi verificarlo tu, senza passare da noi: gli Ordini provinciali pubblicano l’albo
          degli iscritti.
        </p>
      </section>

      <section aria-labelledby="dove" style={{ marginTop: 'var(--s-34)' }}>
        <h2 id="dove" className="text-[length:var(--display-3)]">
          Dove
        </h2>
        <p className="mt-[var(--s-13)]">
          {m.studio.indirizzo}, {m.studio.comune}
        </p>
        <p className="mt-[var(--s-8)]">
          <a href={`tel:${m.studio.telefono.replace(/\s/g, '')}`}>{m.studio.telefono}</a>
        </p>
        {/* ⛔ Un collegamento, non una mappa incorporata: vedi la nota in cima. */}
        <p className="mt-[var(--s-8)] text-[15px]">
          <a href={mappa} rel="noopener noreferrer" target="_blank">
            Apri l’indirizzo in una mappa
          </a>
        </p>
      </section>

      <section aria-labelledby="prestazioni" style={{ marginTop: 'var(--s-34)' }}>
        <h2 id="prestazioni" className="text-[length:var(--display-3)]">
          Prestazioni
        </h2>
        <ul className="mt-[var(--s-13)]" style={{ maxWidth: 'var(--measure)' }}>
          {m.prestazioni.map((p) => (
            <li key={p} style={{ padding: 'var(--s-5) 0' }}>
              {p}
            </li>
          ))}
        </ul>
        {/* ⚖️ La riga che tiene la pagina dentro il c. 525: si dice che i
            prezzi esistono e dove chiederli, ⛔ non si espone un listino. */}
        <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          Gli onorari te li indica lo studio: chiedili in fase di appuntamento.
        </p>
      </section>

      <section aria-labelledby="quando" style={{ marginTop: 'var(--s-34)' }}>
        <h2 id="quando" className="text-[length:var(--display-3)]">
          Quando è libero
        </h2>

        {m.slot.length > 0 ? (
          <>
            <ul className="mt-[var(--s-13)]">
              {m.slot.map((s) => (
                <li key={s.id} style={{ padding: 'var(--s-5) 0' }}>
                  {quandoInItaliano(s.inizio)}
                </li>
              ))}
            </ul>
            {/* ⚖️ «Richiesta», mai «prenotato»: il paziente ha accettato, lo
                studio no — ed è lo stesso motivo per cui il sidecar crea
                l'appuntamento in stato `pending`. */}
            <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              Scegliere un orario invia una <strong>richiesta</strong>: è lo studio a
              confermarla.
            </p>
          </>
        ) : (
          /* ⚠️ Il caso normale finché lo studio non configura l'agenda, e per
             questo l'esempio nasce **senza** orari: se avesse orari finti,
             questo ramo non l'avrebbe guardato nessuno. ⛔ Non si mostra un
             calendario vuoto e non si finge un «al momento non disponibile»
             temporaneo — si dice cosa fare adesso. */
          <p className="mt-[var(--s-13)]" style={{ maxWidth: 'var(--measure)' }}>
            Questo studio non ha ancora pubblicato i suoi orari liberi. Per un appuntamento
            chiama il{' '}
            <a href={`tel:${m.studio.telefono.replace(/\s/g, '')}`}>{m.studio.telefono}</a>.
          </p>
        )}
      </section>
    </article>
  )
}
