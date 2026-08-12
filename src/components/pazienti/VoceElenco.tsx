import Link from 'next/link'
import type { SchedaMedicoPubblica } from '@/lib/medici-pubblici'
import { percorsoMedico, giornoInItaliano, oraInItaliano } from '@/lib/medici-pubblici'

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
  const telefono = m.studio.telefono.replace(/\s/g, '')
  const prime = m.prestazioni.slice(0, 3)
  const altre = m.prestazioni.length - prime.length

  return (
    <li
      style={{
        listStyle: 'none',
        padding: 'var(--s-21) 0',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--s-13)', alignItems: 'flex-start' }}>
        <Ritratto m={m} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 className="text-[1.0625rem]" style={{ fontWeight: 500 }}>
            <Link href={percorsoMedico(m.slug)} style={{ color: 'var(--accent)' }}>
              {m.medico.nome}
            </Link>
          </h3>
          <p className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>
            {m.medico.titolo} · {m.studio.comune}
          </p>
          {/* 🔑 La riga che sostituisce le stelle: una garanzia **verificabile**
              al posto di un aggregato. Sta qui, in alto, non in fondo. */}
          <p className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>
            Ordine di {m.medico.ordineProvinciale}, n. {m.medico.numeroIscrizione}
          </p>
        </div>
      </div>

      <p className="mt-[var(--s-13)] text-[15px]">
        {prime.join(' · ')}
        {altre > 0 && <span style={{ color: 'var(--fg-muted)' }}> e altre {altre}</span>}
      </p>

      {m.slot.length > 0 ? (
        <div className="mt-[var(--s-13)]">
          {/* Il giorno **una volta**, poi solo gli orari: era ripetuto per
              ogni riga e si leggevano tre volte le stesse parole. */}
          <p className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>
            Prossimi orari liberi · {giornoInItaliano(m.slot[0].inizio)}
          </p>
          {/* ⚠️ **Etichette, non pulsanti — e la differenza è deliberata.**
              Un orario che *sembra* premibile e non lo è è lo stesso difetto
              dei collegamenti invisibili, girato al contrario.
              ✅ **AGGIORNATO il 2026-08-12**: la ragione **non è più un
              blocco**. **TD-104 è chiusa** (EMR `7084078`): il gate
              d'emergenza è uscito dal browser, sta nel sidecar, risponde 409
              e le copie della REGOLA-118 sono passate **da tre a una**. ⇒ il
              modulo di prenotazione **si può fare**, e resta l'ultimo pezzo di
              **TD-95** — che la chiusura di TD-104 ha lasciato fuori di
              proposito. Diventano collegamenti quando quel modulo esiste. */}
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-8)', marginTop: 'var(--s-8)' }}>
            {m.slot.slice(0, 3).map((s) => (
              <li
                key={s.id}
                className="text-[15px]"
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
        </div>
      ) : (
        /* ⚠️ Chi non ha orari **non sparisce dall'elenco**: nasconderlo
           punirebbe il medico per una configurazione mancante e mentirebbe al
           paziente sulla disponibilità reale. Si dice cosa fare adesso. */
        <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
          Nessun orario pubblicato.
        </p>
      )}

      {/* 🔎 **Un pulsante solo, e la ragione si è vista solo a elenco pieno.**
          Con due voci due pulsanti sembravano giusti; con diciotto diventano
          **trentasei rettangoli pieni** che competono fra loro e appesantiscono
          la pagina. Il nome del medico, in cima, **è già il collegamento alla
          scheda**: «Vedi la scheda» era una seconda porta per la stessa stanza.
          Resta l'unica azione che oggi funziona davvero — chiamare. */}
      <p className="mt-[var(--s-21)]">
        <a href={`tel:${telefono}`} className="btn btn-primario">
          Chiama lo studio
        </a>
      </p>
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
 * il paziente che l'ha già visto in studio o sui social. */
export function Ritratto({ m, grande = false }: { m: SchedaMedicoPubblica; grande?: boolean }) {
  const lato = grande ? 'var(--s-89)' : 'var(--s-55)'
  const iniziali = m.medico.nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')

  if (m.foto) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- `output: export`
         senza ottimizzatore: `next/image` qui richiederebbe un loader, e la
         foto arriva dallo studio, non dal repo. */
      <img
        src={m.foto.src}
        alt={m.foto.alt}
        width={grande ? 89 : 55}
        height={grande ? 89 : 55}
        style={{ width: lato, height: lato, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: lato,
        height: lato,
        borderRadius: '50%',
        background: 'var(--bg-sunk)',
        color: 'var(--fg-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: grande ? '1.5rem' : '1rem',
        flexShrink: 0,
      }}
    >
      {iniziali}
    </div>
  )
}
