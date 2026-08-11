import Link from 'next/link'
import type { SchedaMedicoPubblica } from '@/lib/medici-pubblici'
import { giornoInItaliano, oraInItaliano } from '@/lib/medici-pubblici'
import { Ritratto } from '@/components/pazienti/VoceElenco'

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
/* ⚠️ `globals.css:242` azzera i collegamenti di proposito —
 * `a:where(:not(.btn)) { color: inherit; text-decoration: none; }` — perché
 * sulla vetrina ogni collegamento è stilato dove compare. Un `<a>` nudo qui
 * esce **identico al testo**: stesso colore, nessuna sottolineatura.
 *
 * 🔎 **È esattamente il difetto che la verifica a video ha preso e che build,
 * lint e collaudo non vedevano**: su questa pagina, quando lo studio non ha
 * ancora orari, il telefono è **l'unica azione disponibile** — e non si
 * distingueva da una riga di prosa. */
const COLLEGAMENTO = {
  color: 'var(--accent)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
} as const

export function SchedaMedico({ m }: { m: SchedaMedicoPubblica }) {
  const telefonoComponibile = m.studio.telefono.replace(/\s/g, '')
  const mappa = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    `${m.studio.indirizzo}, ${m.studio.comune}`,
  )}`

  return (
    <article className="gabbia" style={{ paddingTop: 'var(--s-34)', paddingBottom: 'var(--s-55)' }}>
      {/* ⚠️ Il ritorno all'elenco mancava, e su una pagina di dettaglio è la via
          d'uscita più usata dopo il tasto indietro del telefono. */}
      <p className="text-[15px]">
        <Link href="/pazienti" style={COLLEGAMENTO}>
          ← Tutti gli studi
        </Link>
      </p>

      <header
        style={{
          maxWidth: 'var(--measure)',
          marginTop: 'var(--s-21)',
          display: 'flex',
          gap: 'var(--s-21)',
          alignItems: 'flex-start',
        }}
      >
        {/* Foto se il medico l'ha data, iniziali se no. ⛔ Mai di repertorio. */}
        <Ritratto m={m} grande />
        <div style={{ minWidth: 0 }}>
          <p className="text-[13px] uppercase tracking-[.08em]" style={{ color: 'var(--fg-faint)' }}>
            {m.medico.titolo}
          </p>
          <h1 className="mt-[var(--s-8)] text-[length:var(--display-2)]">{m.medico.nome}</h1>
          <p className="mt-[var(--s-13)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            {m.studio.nome} · {m.studio.comune}
          </p>
        </div>
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
          <a href={`tel:${telefonoComponibile}`} style={COLLEGAMENTO}>
            {m.studio.telefono}
          </a>
        </p>
        {/* ⛔ Un collegamento, non una mappa incorporata: vedi la nota in cima. */}
        <p className="mt-[var(--s-8)] text-[15px]">
          <a href={mappa} rel="noopener noreferrer" target="_blank" style={COLLEGAMENTO}>
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
            {/* Il giorno **una volta**, poi gli orari in fila. Stessa correzione
                fatta nella voce di elenco: la data ripetuta a ogni riga si
                legge tre volte per un'informazione sola. */}
            <p className="mt-[var(--s-13)]" style={{ color: 'var(--fg-muted)' }}>
              {giornoInItaliano(m.slot[0].inizio)}
            </p>
            <ul
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--s-8)',
                marginTop: 'var(--s-8)',
              }}
            >
              {m.slot.map((s) => (
                <li
                  key={s.id}
                  style={{
                    listStyle: 'none',
                    padding: 'var(--s-5) var(--s-13)',
                    background: 'var(--bg-sunk)',
                    borderRadius: 'var(--r-sm)',
                  }}
                >
                  {oraInItaliano(s.inizio)}
                </li>
              ))}
            </ul>
            {/* 🔴 **Corretto il 2026-08-12 guardando la pagina.** Qui c'era
                scritto *«Scegliere un orario invia una richiesta»* — ma gli
                orari **non sono selezionabili**: il modulo di prenotazione è
                fermo finché il gate d'emergenza non sta lato server (TD-104).
                Era una promessa scritta di un'interazione inesistente, cioè lo
                stesso difetto del pulsante finto, in forma di prosa.
                ⚖️ Quando il modulo esisterà, la riga torna — e resterà
                «richiesta», mai «prenotato»: il paziente ha accettato, lo
                studio no, ed è la ragione per cui il sidecar crea
                l'appuntamento in stato `pending`. */}
            <p className="mt-[var(--s-21)]">
              <a href={`tel:${telefonoComponibile}`} className="btn btn-primario">
                Chiama per prenotare · {m.studio.telefono}
              </a>
            </p>
            <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              La prenotazione online da questa pagina non è ancora attiva.
            </p>
          </>
        ) : (
          /* ⚠️ Il caso normale finché lo studio non configura l'agenda, e per
             questo l'esempio nasce **senza** orari: se avesse orari finti,
             questo ramo non l'avrebbe guardato nessuno. ⛔ Non si mostra un
             calendario vuoto e non si finge un «al momento non disponibile»
             temporaneo — si dice cosa fare adesso. */
          <>
            <p className="mt-[var(--s-13)]" style={{ maxWidth: 'var(--measure)' }}>
              Questo studio non ha ancora pubblicato i suoi orari liberi.
            </p>
            {/* 🔑 L'unica azione disponibile diventa un **pulsante**, non una
                riga di prosa: `.btn` porta `min-height: 48px`, sopra i 44 px
                che [[decisione-bersagli-tattili]] fissa per il puntatore
                grossolano. Prima era un collegamento invisibile alto 22 px —
                metà del bersaglio, e senza alcun segnale di essere premibile. */}
            <p className="mt-[var(--s-21)]">
              <a href={`tel:${telefonoComponibile}`} className="btn btn-primario">
                Chiama lo studio · {m.studio.telefono}
              </a>
            </p>
          </>
        )}
      </section>
    </article>
  )
}
