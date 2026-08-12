'use client'

import Link from 'next/link'
import type { SchedaMedicoPubblica } from '@/lib/medici-pubblici'
import { useOrariLiberi } from '@/lib/orari-liberi'
import { percorsoMedico, giornoInItaliano, oraInItaliano, mappaStudio } from '@/lib/medici-pubblici'
import { IconaAlbo, IconaCalendario, IconaLuogo, IconaTelefono } from '@/components/pazienti/Icone'

/* La voce di elenco: l'unità che risponde alla domanda del paziente.
 *
 * 🔑 **Non è un'anteprima della scheda, è la risposta.** NN/g, sulle pagine
 * elenco: *«increased amount of product information on product listing pages
 * […] allows users to make informed decisions **without visiting each detail
 * page**. Especially on mobile, where every click counts»*. E le linee guida
 * dei rater di Google, per l'intento «X vicino a me», chiamano soddisfacente
 * *«a very satisfying **list**»* proprio perché *«clicking will give options to
 * **call** the business, get directions»*.
 * ⇒ qui dentro deve esserci abbastanza per decidere: chi è, che garanzia ha,
 * dove, cosa fa, quando è libero — e le due azioni.
 *
 * ── 🔴 RIFATTA IL 2026-08-13, SU RILIEVO DELL'UTENTE ────────────────────────
 * *«è tutto piatto e uniforme, manca una chiara gerarchia delle informazioni»*.
 * Vero, e misurabile: la scheda era **una pila di righe alla stessa x, alla
 * stessa dimensione (15px), dello stesso grigio**. Una card con un bordo
 * attorno resta un paragrafo se dentro non succede niente.
 *
 * Le tre leve, prese dove il corpus le mette:
 *  1. **Scala.** NN/g, *5 Principles of Visual Design*: «no more than 3
 *     different sizes […] emphasize the most important by making them
 *     biggest». Qui: nome 20px/600 → corpo 15px → meta 13px. Prima: 17 e 15.
 *  2. **Due zone, non una colonna.** NN/g, *Layer-Cake Pattern*: i blocchi si
 *     distinguono «with a grid […] borders or colored backgrounds […] a
 *     suitable amount of space». **CHI** a sinistra, **QUANDO** a destra
 *     dietro un filetto: sono le due domande, e ora si vedono separate.
 *  3. **Colore e icone come segnale di tipo**, non come decorazione: il
 *     riquadro dell'albo è l'unico elemento tinto della scheda, perché è
 *     l'unica cosa che qui vale davvero.
 *
 * 🔎 Prova della matita di Garry Tan (startup-archive, *tre principi di visual
 * design*): «squint test […] you kind of know — oh, there's something your eye
 * is immediately drawn to». Strizzando gli occhi ora emergono **il volto, il
 * nome e i pulsanti degli orari**. Prima non emergeva niente.
 *
 * ⚠️ **Una cosa che il corpus dice e che a noi costa**: fra le informazioni
 * minime NN/g elenca il **prezzo**, e annota che *«lack of prices is a huge
 * usability problem»*. Noi non possiamo mostrarlo (L. 145/2018 c. 525) e non
 * ha senso far finta che la sostituzione sia gratis: dire *«gli onorari te li
 * indica lo studio»* **spiega l'assenza, non la colma**. È un costo reale che
 * accettiamo, non un vantaggio.
 *
 * ⛔ Cosa NON c'è, e non per dimenticanza: stelle, voti, recensioni, prezzi,
 * badge «in evidenza» (nemmeno gratuiti: appena esiste la casella esiste il
 * prezzo per averla). Vedi [[piano-ui-canale-paziente]] §4.
 */
export function VoceElenco({ m }: { m: SchedaMedicoPubblica }) {
  /* 🔑 **Gli orari veri, e premibili.** §5.4 del piano: *«si prenota dalla
   * lista, non dal profilo»* — è il meccanismo che regge le pagine risultati di
   * MioDottore e Doctolib, misurato prima di copiarlo. */
  const { orari, stato: statoOrari } = useOrariLiberi(m.organizationId)
  const daMostrare = statoOrari === 'spento' ? m.slot : orari
  const telefono = m.studio.telefono.replace(/\s/g, '')
  const prime = m.prestazioni.slice(0, 3)
  const altre = m.prestazioni.length - prime.length

  return (
    <li style={{ listStyle: 'none', marginBottom: 'var(--s-13)' }}>
      <div className="scheda-risultato">
        {/* ══ ZONA 1 — CHI È ══════════════════════════════════════════════ */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 'var(--s-13)', alignItems: 'flex-start' }}>
            <Ritratto m={m} />
            <div style={{ minWidth: 0, flex: 1 }}>
              {/* ⚠️ **Sans, non il serif del sito**: in una scheda di risultati
                  il nome si scansiona, non si legge. E **20px**: era 17, cioè
                  a due punti dal corpo — troppo poco per fare da titolo. */}
              <h3
                className="text-[1.25rem]"
                style={{ fontWeight: 600, fontFamily: 'var(--font-sans)', lineHeight: 1.25 }}
              >
                <Link href={percorsoMedico(m.slug)} className="collegamento-scheda">
                  {m.medico.nome}
                </Link>
              </h3>
              <p className="mt-[var(--s-3)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                {m.medico.titolo} · {m.studio.nome}
              </p>
              {/* 🔑 **L'indirizzo è un collegamento alla mappa** (richiesta
                  dell'utente, 2026-08-13). Era testo morto: su un telefono
                  l'indirizzo di uno studio è **una cosa che si preme**, e
                  lasciarlo inerte costringeva a selezionarlo e incollarlo
                  altrove. ⛔ Non una mappa incorporata — vedi `mappaStudio()`. */}
              <p
                className="mt-[var(--s-5)] text-[15px]"
                style={{
                  color: 'var(--fg-muted)',
                  display: 'flex',
                  /* ⚠️ `flex-start`, non `center`: su un telefono l'indirizzo va
                     a capo e un'icona centrata su due righe finisce **in mezzo
                     al nulla**, fra le due. Si àncora alla prima riga. */
                  alignItems: 'flex-start',
                  gap: 'var(--s-5)',
                }}
              >
                <IconaLuogo className="icona-riga" />
                <a
                  href={mappaStudio(m.studio)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="collegamento-mappa"
                >
                  {m.studio.indirizzo}, {m.studio.comune}
                </a>
              </p>
            </div>
          </div>

          {/* 🔑 **Il riquadro dell'albo: l'unico elemento tinto della scheda.**
              Era la terza riga grigia di tre righe grigie — cioè scritta come
              se fosse un dettaglio, mentre è *il* pezzo distintivo: gli altri
              portali qui mettono le stelle, noi mettiamo un numero che il
              paziente può controllare da solo. Un fatto verificabile messo
              graficamente allo stesso livello dell'indirizzo è un fatto
              sprecato. */}
          <p className="pillola-albo mt-[var(--s-13)]">
            <IconaAlbo />
            <span>
              Ordine di {m.medico.ordineProvinciale} · n. {m.medico.numeroIscrizione}
            </span>
          </p>

          {/* Le prestazioni: chip, non una frase con i puntini. Una fila di
              etichette si scansiona, una frase va letta — e qui nessuno legge. */}
          <ul className="fila-chip mt-[var(--s-13)]">
            {prime.map((p) => (
              <li key={p} className="chip-prestazione">
                {p}
              </li>
            ))}
            {altre > 0 && (
              <li className="text-[15px]" style={{ color: 'var(--fg-muted)', alignSelf: 'center' }}>
                e altre {altre}
              </li>
            )}
          </ul>
        </div>

        {/* ══ ZONA 2 — QUANDO ═════════════════════════════════════════════
            🔑 Dietro un filetto, su fondo proprio: è la seconda domanda del
            paziente e ora ha un posto suo. È anche la forma della pagina
            risultati di Doctolib, dove le disponibilità stanno in un pannello
            separato a destra. */}
        <div className="scheda-risultato-quando">
          <p
            className="text-[13px] uppercase tracking-[.06em]"
            style={{
              color: 'var(--fg-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--s-5)',
            }}
          >
            <IconaCalendario lato={14} />
            {daMostrare.length > 0 ? giornoInItaliano(daMostrare[0].inizio) : 'Orari liberi'}
          </p>

          {daMostrare.length > 0 ? (
            <ul className="griglia-orari mt-[var(--s-8)]">
              {daMostrare.slice(0, 6).map((s) => (
                <li key={s.id} style={{ listStyle: 'none' }}>
                  {statoOrari === 'spento' ? (
                    /* Canale spento: restano etichette. ⛔ Un orario che
                       *sembra* premibile e non lo è è il difetto dei
                       collegamenti invisibili, girato al contrario. */
                    <span className="orario-morto">{oraInItaliano(s.inizio)}</span>
                  ) : (
                    /* ⚠️ Altezza 44px e non meno: è un bersaglio da pollice, e
                       questi chip sono l'azione principale della pagina. */
                    <Link
                      href={`${percorsoMedico(m.slug)}?slot=${encodeURIComponent(s.id)}`}
                      className="orario-vivo"
                    >
                      {oraInItaliano(s.inizio)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            /* ⚠️ Chi non ha orari **non sparisce dall'elenco**: nasconderlo
               punirebbe il medico per una configurazione mancante e mentirebbe
               al paziente sulla disponibilità reale. Si dice cosa fare adesso. */
            <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              {statoOrari === 'cerco' ? 'Cerco gli orari liberi…' : 'Nessun orario pubblicato.'}
            </p>
          )}

          {/* 🔑 **«Chiama» è SECONDARIO**: il pieno ce l'hanno gli orari, cioè
              l'azione che questa pagina esiste per rendere possibile. ⛔ Non
              sparisce, perché per chi non ha orari pubblicati è **l'unica**
              strada. */}
          <p className="mt-[var(--s-13)]">
            <a href={`tel:${telefono}`} className="bottone-telefono">
              <IconaTelefono />
              {m.studio.telefono}
            </a>
          </p>
        </div>
      </div>
    </li>
  )
}

/* Il ritratto: la foto se c'è, le iniziali se non c'è.
 *
 * 🔑 **Le iniziali non sono un ripiego estetico, sono una scelta di onestà**:
 * l'alternativa comune — una sagoma grigia o una foto di repertorio — o non
 * dice niente o dice il falso. Le iniziali tengono il ritmo dell'elenco (le
 * righe restano allineate) senza fingere un volto che non abbiamo.
 *
 * ⛔ La foto, quando c'è, è **fornita dal medico** e serve al riconoscimento —
 * il paziente che l'ha già visto in studio o sui social.
 *
 * ⚠️ **Il grigio è diventato azzurro, e non è vezzo.** Un cerchio `--bg-sunk`
 * con testo `--fg-muted` è la tavolozza che tutto il resto del sito usa per le
 * cose **disattivate**: il segnaposto di una persona sembrava una casella
 * spenta. Su `--accent-wash` legge come un'identità mancante, non come un
 * errore. Ed è cresciuto da 55 a 64px (96 sulla scheda): NN/g chiede immagini
 * *«large enough to identify a known item»*, e a 55px un volto non si
 * riconosce.
 */
export function Ritratto({ m, grande = false }: { m: SchedaMedicoPubblica; grande?: boolean }) {
  const lato = grande ? 96 : 64
  const iniziali = m.medico.nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')

  const comune = {
    width: `${lato}px`,
    height: `${lato}px`,
    borderRadius: '50%',
    flexShrink: 0,
  } as const

  if (m.foto) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- `output: export`
         senza ottimizzatore: `next/image` qui richiederebbe un loader, e la
         foto arriva dallo studio, non dal repo. */
      <img
        src={m.foto.src}
        alt={m.foto.alt}
        width={lato}
        height={lato}
        style={{ ...comune, objectFit: 'cover', border: '1px solid var(--rule)' }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      style={{
        ...comune,
        background: 'var(--accent-wash)',
        color: 'var(--accent-ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: grande ? '1.75rem' : '1.125rem',
        letterSpacing: '.02em',
      }}
    >
      {iniziali}
    </div>
  )
}
