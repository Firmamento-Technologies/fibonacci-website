'use client'

/* La ricerca e i risultati: la superficie di prodotto del lato paziente. — TD-95
 *
 * ── DA DOVE VIENE LA FORMA ──────────────────────────────────────────────────
 * Anatomia misurata di MioDottore e Doctolib in [[piano-ui-canale-paziente]]
 * §2-§3. 🔑 **La cosa da prendere non è un componente, è la gerarchia**: *una
 * sola azione, sopra la piega, due campi e un pulsante* — poi le scorciatoie
 * per la coda lunga, poi i risultati.
 *
 * ── 🔴 IL TERZO GIRO, 2026-08-13: «MANCANO IMMAGINI, È TUTTO PIATTO» ────────
 * L'eroe era **un rettangolo grigio con dentro del testo nero**. Tre correzioni,
 * ognuna con la sua ragione misurata:
 *
 *  1. **Una fotografia.** Unbounce, *Elements of a high-converting landing
 *     page*: «what does your hero image say about you? Are you merely showing
 *     your product […] or the **experience** someone will get from it?». Qui
 *     l'esperienza è **un consulto uno-a-uno**, non un ago: `consulto-studio`
 *     è esattamente la scena, ed è già nel set curato di `public/photos`
 *     (criteri di scelta in `CREDITS.md` — ⛔ niente camici e stetoscopi, che
 *     sono il repertorio del medico di base).
 *  2. **Un titolo che dice al paziente perché è qui.** CXL: la proposta di
 *     valore deve rendere evidenti *rilevanza*, *beneficio* e *differenza*.
 *     «Trova un medico estetico e prenota» diceva solo cosa fa la pagina —
 *     lo stesso di chiunque altro. La differenza vera ce l'abbiamo nel dato e
 *     non la stavamo dicendo: **il numero d'iscrizione all'albo, in chiaro**.
 *     In una specialità dove esercita anche chi non dovrebbe, è la paura del
 *     paziente, ed è l'unica cosa che nessun concorrente mette in prima
 *     pagina. ⚖️ È una frase sul **nostro** servizio e sull'azione del
 *     paziente: ⛔ non un superlativo su un medico, non un confronto con
 *     nessuno — il c. 525 resta fuori dalla porta.
 *  3. **Tre pastiglie al posto di un saggio.** ⇒ vedi la nota in `page.tsx`.
 *
 * ── COSA NON C'È, E RESTA FUORI ─────────────────────────────────────────────
 * ⛔ Nessuna classifica, nessun voto, nessuna «In evidenza» a pagamento —
 * l'inventario pubblicitario è il primo elemento della loro scheda, ed è
 * esattamente ciò che la L. 145/2018 c. 525 rende un rischio **per il medico**.
 * ⛔ Nessun prezzo: gli onorari li dice lo studio.
 */

import { useMemo, useState } from 'react'
import { VoceElenco } from '@/components/pazienti/VoceElenco'
import { IconaCerca, IconaSpunta, IconaLuogo } from '@/components/pazienti/Icone'
import { useVicinoAMe, distanzaKm } from '@/lib/vicinanza'
import { assetPath } from '@/lib/asset-path'
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

/* 🔑 **Il saggio, compresso in tre fatti.**
 * L'utente: *«non ho ancora capito il senso di sta roba e perché mio dottore
 * non ne ha bisogno»*. La risposta sta in `page.tsx`; qui sta la conseguenza:
 * ciò che restava di vero in quei tre paragrafi sono **tre affermazioni sul
 * nostro servizio**, e stanno sotto la ricerca dove chiunque le vede, non in
 * fondo dove nessuno arriva.
 * ⚖️ Sono formulate **su di noi**, mai sugli altri: «nessuna classifica a
 * pagamento» è un fatto nostro; «a differenza degli altri portali» sarebbe una
 * comparazione, cioè il terreno del c. 525. */
const PASTIGLIE = [
  /* 🔴 **Era «Ordine e numero d'iscrizione in chiaro», e diceva la cosa giusta
   * col soggetto sbagliato.** Rilievo dell'utente (2026-08-13): *«perché
   * dovrebbero controllare che il medico sia iscritto all'Ordine quando
   * possiamo farlo noi?»*. È **una regola di ammissione**, non un compito del
   * paziente: si scrive come promessa nostra. Il numero resta in pagina, ⛔ ma
   * come **prova**, non come istruzione. Vedi [[decisione-verifica-albo]]. */
  'Solo medici iscritti all’Ordine',
  'Nessuna classifica a pagamento',
  'Nessun cookie, nessun account',
] as const

function normalizza(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function RicercaMedici({ medici }: { medici: readonly SchedaMedicoPubblica[] }) {
  const [cosa, setCosa] = useState('')
  const [dove, setDove] = useState('')
  const { posizione, stato: statoPosizione, chiedi, dimentica } = useVicinoAMe()

  /* ⚠️ **Il pulsante compare solo se c'è qualcosa da ordinare.** Con un solo
     studio geolocalizzato «il più vicino» è una parola vuota, e un comando che
     non cambia niente insegna a non premerlo. ⛔ Non si mostra e basta. */
  const ordinabilePerDistanza =
    medici.filter((m) => m.studio.coordinate).length >= 2

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

  /* 🔑 **La distanza si calcola una volta e viaggia con il risultato**: la
     scheda la mostra, l'ordinamento la usa. Calcolarla due volte sarebbe due
     posti dove può divergere. ⚠️ Uno studio **senza coordinate ⛔ non sparisce**
     e ⛔ non finisce in fondo per punizione: resta dov'era, senza distanza. */
  const conDistanza = useMemo(() => {
    if (!posizione) return risultati.map((m) => ({ m, km: undefined as number | undefined }))
    const misurati = risultati.map((m) => ({
      m,
      km: m.studio.coordinate ? distanzaKm(posizione, m.studio.coordinate) : undefined,
    }))
    return [...misurati].sort((a, b) => {
      if (a.km === undefined) return 1
      if (b.km === undefined) return -1
      return a.km - b.km
    })
  }, [risultati, posizione])

  const filtrata = cosa.trim() !== '' || dove.trim() !== ''

  return (
    <>
      <div className="eroe-pazienti">
        <div className="gabbia eroe-pazienti-griglia">
          <div>
            <header>
              {/* 🔴 **«…e controlla che sia un medico» è durato mezza giornata,
                  e l'utente ha fatto bene a bocciarlo.** Era pensato come la
                  nostra differenza — il numero d'albo che nessun portale mette
                  in prima pagina — ma detto così **scarica il controllo sul
                  paziente e insinua il dubbio sui medici che elenchiamo**: se
                  devo controllare io, vuol dire che voi non l'avete fatto.
                  🔑 Il fatto non cambia, cambia **il soggetto**: la verifica è
                  un nostro dovere di ammissione, e il numero in pagina è la
                  **prova**, non il compito. [[decisione-verifica-albo]] */}
              <h1 className="titolo-servizio text-[length:var(--display-2)]">
                Trova il tuo medico estetico
                {/* ⚠️ L'a capo è **solo su schermo largo**: su un telefono
                    forzava una riga in più e il titolo si prendeva mezzo primo
                    schermo da solo. Misurato a 375px il 2026-08-13. */}
                <br className="a-capo-largo" /> e prenota.
              </h1>
              <p className="mt-[var(--s-13)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                Solo medici iscritti all’Ordine, con il numero d’iscrizione su ogni scheda.
                E gli orari che lo studio ha davvero liberi.
              </p>
            </header>

            {/* ── L'azione, sopra tutto ─────────────────────────────────── */}
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                document
                  .getElementById('risultati')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="ricerca-pazienti mt-[var(--s-21)]"
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
                  className="campo-ricerca"
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
                  className="campo-ricerca"
                />
              </label>
              {/* 🔴 **Il pulsante serve anche se la ricerca è istantanea.**
                  Senza, due campi affiancati non si leggono come una ricerca:
                  sembrano un modulo a metà. Qui non «invia» — mette a fuoco i
                  risultati e chiude la tastiera sul telefono, che è la cosa
                  che serve davvero lì. */}
              <button type="submit" className="btn btn-primario bottone-cerca">
                <IconaCerca lato={18} />
                Cerca
              </button>
            </form>

            {/* Le scorciatoie, come le loro nuvole di chip. */}
            <ul className="fila-chip mt-[var(--s-13)]">
              {SCORCIATOIE.map((s) => {
                const attiva = normalizza(cosa) === normalizza(s)
                return (
                  <li key={s} style={{ listStyle: 'none' }}>
                    <button
                      type="button"
                      onClick={() => setCosa(attiva ? '' : s)}
                      aria-pressed={attiva}
                      className={attiva ? 'chip-scorciatoia chip-scorciatoia-attiva' : 'chip-scorciatoia'}
                    >
                      {s}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* ── «Vicino a me» — TD-113 ─────────────────────────────────
                ⚠️ **È un pulsante, ⛔ non un automatismo**, e la differenza è
                tutta nel permesso: l'utente aveva chiesto *«in automatico in
                base alla posizione»*, ⛔ ma l'unico modo davvero automatico —
                la geolocalizzazione via IP — chiama un terzo a ogni visita e
                gli manda l'IP del paziente. Qui la posizione ⛔ **non esce dal
                browser**: le coordinate degli studi sono nel pacchetto e il
                confronto avviene in memoria. */}
            {ordinabilePerDistanza && (
              <div className="mt-[var(--s-13)]">
                {statoPosizione === 'trovata' ? (
                  <p className="text-[15px]" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-8)', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', gap: 'var(--s-5)' }}>
                      <IconaLuogo lato={15} />
                      Ordinati dal più vicino a te
                    </span>
                    <button type="button" onClick={dimentica} className="collegamento-testo" style={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit' }}>
                      Torna all’ordine alfabetico
                    </button>
                  </p>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={chiedi}
                      className="chip-scorciatoia"
                      disabled={statoPosizione === 'chiedo'}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-5)' }}
                    >
                      <IconaLuogo lato={15} />
                      {statoPosizione === 'chiedo' ? 'Cerco la tua posizione…' : 'Vicino a me'}
                    </button>
                    {/* ⛔ Un rifiuto non si nasconde e ⛔ non si richiede: si
                        dice cosa sta guardando adesso. */}
                    {statoPosizione === 'negata' && (
                      <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                        Non hai dato il permesso: l’elenco resta in ordine alfabetico.
                      </p>
                    )}
                    {statoPosizione === 'assente' && (
                      <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                        Il tuo browser non sa dire dove sei: l’elenco resta in ordine alfabetico.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            <ul className="fila-pastiglie mt-[var(--s-21)]">
              {PASTIGLIE.map((p) => (
                <li key={p}>
                  <IconaSpunta lato={15} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* 🖼️ **La fotografia.** ⚠️ Sotto i 62rem sparisce: su un telefono
              starebbe fra il titolo e il campo di ricerca, cioè spingerebbe
              l'azione sotto la piega — l'errore che NN/g (*Scrolling and
              Attention*) chiede di non fare, e che questa pagina ha già fatto
              una volta con tre blocchi di testo.
              ⛔ Non è un ritratto e non è un medico: è una **scena**, e non
              viene spacciata per nessuno degli studi in elenco.

              🔎 **Perché questa e non `consulto-studio`**, che era la prima
              scelta e va guardata prima di rimetterla: quella foto ritrae una
              paziente **visibilmente perplessa** in un cardigan blu elettrico
              che litiga con la tavolozza del sito, e l'operatrice è in casacca
              nera — cioè l'immagine non dice «medico», che è esattamente la
              parola del titolo. Qui il camice e i guanti dicono *atto medico*
              in mezzo secondo, ed è la stessa cosa che dice la pagina. */}
          <div className="eroe-pazienti-foto">
            {/* 🔴 **`alt=""` + `aria-hidden` è stato un errore, e l'ha preso il
                collaudo** (non la build, non `lint`): *«/pazienti: immagine
                senza alt»*. Avevo ragionato «è decorativa, quindi si nasconde»,
                ⛔ ma la regola di questo sito è l'opposto ed è scritta in
                `ui/elementi.tsx`: *«queste foto raccontano una scena e chi usa
                uno screen reader ha diritto alla scena»*. Una foto che porta il
                messaggio del titolo — *è un atto medico* — non è decorazione. */}
            {/* ⚠️ Il `disable` va **attaccato al tag**: infilarci in mezzo un
                commento lo stacca dalla riga che deve coprire, e `lint` lo
                segnala come direttiva inutile. Successo qui, subito. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- export
                statico: nessun ottimizzatore a runtime. */}
            <img
              src={assetPath('/photos/cura-pelle-viso.jpg')}
              alt="Una paziente distesa in ambulatorio: un medico con camice e guanti le tratta il viso con uno strumento."
              loading="eager"
              decoding="sync"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>

      {/* ⚠️ `gabbia` **centra** il contenuto: annidarci dentro un `maxWidth`
          più stretto lo centrava di nuovo, e i risultati rientravano di ~230px
          rispetto alla fascia sopra. Due blocchi della stessa pagina allineati
          a due margini diversi si leggono come due pagine. */}
      <div className="gabbia" style={{ paddingTop: 'var(--s-34)' }}>
        <div className="colonna-risultati">
          {/* ── Il conteggio: dice sempre la verità, anche quando è zero ──
              🔑 **La riga sull'ordinamento è tornata a essere una nota.** Era
              incollata al conteggio, in corpo pieno: la politica editoriale
              scritta con lo stesso peso del dato di prodotto. Ora il numero è
              un titolo e il criterio è la sua didascalia. */}
          <div id="risultati" style={{ scrollMarginTop: 'var(--s-21)' }} role="status">
            <h2 className="titolo-servizio text-[length:var(--display-3)]">
              {risultati.length === 0
                ? 'Nessuno studio corrisponde'
                : `${risultati.length} ${
                    risultati.length === 1
                      ? `studio${filtrata ? ' trovato' : ''}`
                      : `studi${filtrata ? ' trovati' : ''}`
                  }`}
            </h2>
            {/* ⚠️ **La riga deve dire l'ordine VERO.** Con la posizione attiva
                l'elenco ⛔ non è più alfabetico, e lasciare la vecchia frase
                sarebbe la bugia più facile: una pagina che dichiara un criterio
                e ne segue un altro. La seconda metà (nessuno paga) resta vera
                in entrambi i casi, ed è quella che conta. */}
            {risultati.length > 0 && (
              <p className="mt-[var(--s-5)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                {posizione ? 'Dal più vicino a te.' : 'In ordine alfabetico.'} Nessuno può
                pagare per comparire più in alto.
              </p>
            )}
          </div>

          {risultati.length === 0 ? (
            <p className="mt-[var(--s-13)]" style={{ maxWidth: 'var(--measure)' }}>
              {/* ⛔ Non si svuota la pagina: si dice **cosa fare adesso**. NN/g,
                  information scent — un vicolo cieco senza uscita fa uscire dal
                  sito, non riformulare. */}
              Prova con meno parole, o togli il luogo. Se il tuo medico usa Fibonacci
              e non compare qui, la sua pagina te la può dare lui.
            </p>
          ) : (
            <ul style={{ padding: 0, marginTop: 'var(--s-21)' }}>
              {conDistanza.map(({ m, km }) => (
                <VoceElenco key={m.slug} m={m} distanzaKm={km} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
