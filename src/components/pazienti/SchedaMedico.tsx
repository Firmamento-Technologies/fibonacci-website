import { t } from '@/lib/testo'
import Link from 'next/link'
import type { SchedaMedicoPubblica } from '@/lib/medici-pubblici'
import { giornoInItaliano, oraInItaliano, mappaStudio } from '@/lib/medici-pubblici'
import { Ritratto } from '@/components/pazienti/VoceElenco'
import { IconaAlbo, IconaCalendario, IconaLuogo, IconaTelefono } from '@/components/pazienti/Icone'
import { ModuloPrenotazione } from '@/components/pazienti/ModuloPrenotazione'
import { MappaStudio } from '@/components/pazienti/MappaStudio'
import { PRENOTA_API_URL } from '@/lib/site-config'

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
  /* ⚠️ Possono mancare: sullo studio vero il sidecar torna stringhe vuote
     (misurato il 2026-08-13). Vedi la nota in `mappaStudio()`. */
  const mappa = mappaStudio(m.studio)
  const indirizzoScritto = [m.studio.indirizzo, m.studio.comune]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ')
  /* ⚠️ La URL della mappa **era costruita qui**, e la voce di elenco non ne
     aveva nessuna: due viste, un dato, una copia sola — che è il modo in cui
     nasce la seconda. Ora sta in `mappaStudio()`, accanto ai dati. */

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
          {/* ⚠️ Sans anche qui: nell'elenco era gia' cosi', e due caratteri
              diversi per lo stesso nome nelle due viste si notano. */}
          <h1
            className="titolo-servizio mt-[var(--s-8)] text-[length:var(--display-3)]"
          >
            {m.medico.nome}
          </h1>
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
      <div className="scheda-medico-corpo">
      <div>
      {/* ⚠️ **Fondo `--accent-wash`, non `--bg-sunk`**: è lo stesso azzurro
          della pastiglia dell'albo nell'elenco. Le due viste parlavano dello
          stesso fatto con due colori diversi — grigio qui, azzurro là — e il
          grigio è la tavolozza delle cose spente. */}
      <section
        aria-labelledby="albo"
        style={{
          marginTop: 'var(--s-34)',
          padding: 'var(--s-21)',
          background: 'var(--accent-wash)',
          borderRadius: 'var(--r-lg)',
          maxWidth: 'var(--measure)',
        }}
      >
        {/* ⚠️ Sans anche nei titoli di sezione: erano nel serif del sito, cioè
            **il carattere degli articoli**, mentre l'elenco da cui si arriva è
            già tutto in sans. Due caratteri per la stessa gerarchia nelle due
            viste è la stessa incoerenza già corretta sul nome del medico. */}
        <h2
          id="albo"
          className="titolo-servizio text-[length:var(--display-3)]"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-8)' }}
        >
          <IconaAlbo lato={20} />
          {t('pazienti.schedamedico.iscrizione_all_ordine_dei_medici')}
        </h2>
        <p className="mt-[var(--s-13)]">{t('pazienti.schedamedico.ordine_di')} <strong>{m.medico.ordineProvinciale}</strong>, numero{' '}
          <strong>{m.medico.numeroIscrizione}</strong>.
        </p>
        {/* 🔴 **Qui c'era scritto «Puoi verificarlo tu, senza passare da noi»,
            più un collegamento «Come si controlla, in un minuto».** Suonava
            trasparente ed era **il difetto centrale del canale**, scritto per
            esteso: scaricava sul paziente un controllo che tocca a noi, e nel
            farlo lasciava intendere che noi non l'avessimo fatto — su una
            pagina che è, letteralmente, la vetrina di quel medico.
            🔑 Il soggetto si ribalta: l'iscrizione è **la condizione per stare
            qui**; il numero resta scritto perché la nostra parola sia
            **controllabile**, non perché il controllo lo faccia il lettore.
            ⚠️ La verifica vera è **TD-115** e ⛔ non esiste ancora: finché non
            esiste, qui ⛔ non compare nessuna spunta, nessun «verificato», e
            nessuna data. [[decisione-verifica-albo]] */}
        <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          {t('pazienti.schedamedico.l_iscrizione_all_albo_e_la')}
        </p>
      </section>

      <section aria-labelledby="dove" style={{ marginTop: 'var(--s-34)' }}>
        <h2 id="dove" className="titolo-servizio text-[length:var(--display-3)]">
          {t('pazienti.schedamedico.dove')}
        </h2>
        {/* 🔑 **L'indirizzo È il collegamento** (richiesta dell'utente,
            2026-08-13). Prima era testo morto con sotto una riga separata
            «Apri l'indirizzo in una mappa»: due elementi per una cosa sola, e
            quello che si legge per primo — l'indirizzo — era l'unico non
            premibile. ⛔ Non una mappa incorporata: vedi `mappaStudio()`. */}
        <p
          className="mt-[var(--s-13)]"
          style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s-8)' }}
        >
          <IconaLuogo className="icona-riga" />
          {mappa ? (
            <a href={mappa} target="_blank" rel="noopener noreferrer" style={COLLEGAMENTO}>
              {indirizzoScritto}
            </a>
          ) : (
            <span>{t('pazienti.schedamedico.indirizzo_non_pubblicato')}</span>
          )}
        </p>
        <p
          className="mt-[var(--s-8)]"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-8)' }}
        >
          <IconaTelefono />
          <a href={`tel:${telefonoComponibile}`} style={COLLEGAMENTO}>
            {m.studio.telefono}
          </a>
        </p>

        {/* La mappa, **su richiesta**: a pagina ferma non parte niente. Il
            perché per esteso sta in `MappaStudio.tsx`, e non è un dettaglio —
            è la ragione per cui questo sito non ha il banner dei cookie. */}
        <div className="mt-[var(--s-21)]" style={{ maxWidth: 'var(--measure)' }}>
          {mappa && (
            <MappaStudio
              indirizzo={m.studio.indirizzo}
              comune={m.studio.comune}
              coordinate={m.studio.coordinate}
              mappaEsterna={mappa}
            />
          )}
        </div>
      </section>

      {/* ⚠️ Solo se ci sono: gli studi veri arrivano dall'elenco del sidecar
          con `prestazioni: []` (non ancora modellate sull'Organization), e un
          titolo sopra il niente sembrerebbe un guasto della pagina. */}
      {m.prestazioni.length > 0 && (
      <section aria-labelledby="prestazioni" style={{ marginTop: 'var(--s-34)' }}>
        <h2 id="prestazioni" className="titolo-servizio text-[length:var(--display-3)]">
          {t('pazienti.schedamedico.prestazioni')}
        </h2>
        {/* Chip, come nell'elenco: erano un elenco puntato di righe, cioè la
            forma di una lista della spesa. ⛔ Non premibili — sono etichette. */}
        <ul className="fila-chip mt-[var(--s-13)]" style={{ maxWidth: 'var(--measure)' }}>
          {m.prestazioni.map((p) => (
            <li key={p} className="chip-prestazione">
              {p}
            </li>
          ))}
        </ul>
        {/* ⚖️ La riga che tiene la pagina dentro il c. 525: si dice che i
            prezzi esistono e dove chiederli, ⛔ non si espone un listino. */}
        <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          {t('pazienti.schedamedico.gli_onorari_te_li_indica_lo')}
        </p>
      </section>
      )}

      </div>
      {/* 🔑 **Il pannello di prenotazione sta a DESTRA, e non e' vezzo.** E' la
          forma della pagina-profilo di MioDottore e Doctolib: a sinistra chi e'
          e dove, a destra **quando**, che e' l'unica cosa su cui si agisce. Su
          una colonna sola gli orari finivano dopo 1.200px di lettura, con un
          vuoto sotto — cioe' l'azione fuori dallo schermo di chi arriva.
          ⚠️ Su telefono torna sotto, in colonna, che li' e' l'ordine giusto. */}
      <section
        aria-labelledby="quando"
        className="pannello-prenota"
        style={{ marginTop: 'var(--s-34)' }}
      >
        <h2
          id="quando"
          className="titolo-servizio text-[length:var(--display-3)]"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-8)' }}
        >
          <IconaCalendario lato={20} />
          {/* ⚠️ Era «Quando è libero» (decisione dell'utente, 2026-08-13).
              Una domanda in forma di titolo si legge come una conversazione;
              qui sopra un calendario serve **l'etichetta della cosa**. */}
          {t('pazienti.schedamedico.disponibilita')}
        </h2>

        {/* 🔴 **Corretto il 2026-08-12 cablando il percorso vero**: qui c'era
            `m.slot.length > 0 && PRENOTA_API_URL`, cioè si decideva **in
            costruzione** se lo studio ha orari — un fatto che cambia ogni
            giorno. Con il canale acceso gli orari li chiede il modulo al
            sidecar, e sa dire da sé «sto cercando» e «non ne risultano»; la
            lista statica resta solo per quando il canale è spento. ⚠️ Il
            sintomo era muto: lo studio d'esempio senza slot mostrava «non ha
            pubblicato i suoi orari» **anche con il sidecar acceso e pieno**. */}
        {PRENOTA_API_URL ? (
          /* Canale aperto: **il modulo possiede gli orari**, che diventano
             selezionabili. ⛔ Non si mostrano due volte — una lista in sola
             lettura sopra un selettore identico è rumore, e la seconda invita a
             cliccare la prima. */
          <ModuloPrenotazione m={m} />
        ) : m.slot.length > 0 ? (
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
                orari **non sono selezionabili**: il modulo di prenotazione non
                è ancora scritto. ✅ **AGGIORNATO il 2026-08-12**: non è più
                *bloccato* — **TD-104 è chiusa**, il gate d'emergenza sta nel
                sidecar — è semplicemente **da fare**, ed è l'ultimo pezzo di
                TD-95.
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
              {t('pazienti.schedamedico.la_prenotazione_online_da_questa_pagina')}
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
              {t('pazienti.schedamedico.questo_studio_non_ha_ancora_pubblicato')}
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
      </div>
    </article>
  )
}
