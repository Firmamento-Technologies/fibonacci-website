import Link from 'next/link'
import { RevealGruppo } from '@/components/ui/Reveal'
import { Freccia } from '@/components/ui/elementi'
import {
  bollini as prendi,
  BOLLINI,
  BOLLINI_PIEDE,
  type Bollino,
  type StatoBollino,
} from '@/lib/bollini'

/* I bollini, resi.
 *
 * ⛔ **Non sono loghi.** Un bollino qui è un riquadro tipografico: un segno,
 * un'affermazione, una riga di sostanza e la prova. Nessun sigillo disegnato
 * che imiti il marchio di un ente, perché un sigillo finto è indistinguibile
 * da uno vero per chi guarda e ci espone a una contestazione che non
 * potremmo vincere. Il contenuto sta in `src/lib/bollini.ts`, che è la sola
 * fonte: home e pagine interne pescano dallo stesso elenco, così una
 * correzione non deve essere fatta in tre posti (è la regola anti-copia del
 * progetto, e qui vale doppio perché sono affermazioni legali).
 *
 * ⚠️ **Vincolo di altezza**: queste griglie stanno dentro le tappe, e una
 * tappa è **una schermata**. Su telefono più di tre riquadri per sezione
 * sforano: chi ne aggiunge uno rilancia `node scripts/altezza-pagine.mjs`
 * prima di dire che è fatto. */

const ETICHETTA: Record<StatoBollino, string> = {
  fatto: 'Verificabile adesso',
  assente: 'Non ce l’abbiamo',
  previsto: 'Non ancora esigibile',
}

/** Il segno dentro il bollo. Tre soli, e si distinguono anche in bianco e nero. */
function Segno({ stato, chiaro }: { stato: StatoBollino; chiaro: boolean }) {
  /* ⚠️ Il colore NON è l'unico portatore d'informazione (WCAG 1.4.1): la
     forma cambia, e l'etichetta testuale accanto dice lo stato a parole. Un
     bollino distinguibile solo per tinta sarebbe illeggibile a chi non
     distingue i colori, che fra i medici uomini è circa uno su dodici. */
  const tinta =
    stato === 'fatto'
      ? chiaro
        ? 'var(--accent-onink)'
        : 'var(--accent)'
      : chiaro
        ? 'var(--on-ink-muted)'
        : 'var(--fg-muted)'

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="13" cy="13" r="12" stroke={tinta} strokeWidth="1.25" />
      {stato === 'fatto' && (
        <path
          d="M8 13.4l3.2 3.2L18 9.8"
          stroke={tinta}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {stato === 'assente' && (
        <path d="M8.6 17.4L17.4 8.6" stroke={tinta} strokeWidth="1.75" strokeLinecap="round" />
      )}
      {stato === 'previsto' && (
        <path
          d="M13 7.4V13l3.6 2.4"
          stroke={tinta}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

/**
 * Il sigillo: un bollo inciso col nome della NORMA che ci si applica.
 *
 * ⛔ **Non imita nessun emittente.** Dentro c'è il nome di un regolamento, non
 * la sigla di un ente che ci avrebbe approvati, e sotto sta sempre la riga che
 * dice a che punto siamo (due su cinque dicono «non ancora»). L'autorevolezza
 * viene dalla forma e dal contenuto verificabile, non da un emblema preso in
 * prestito.
 *
 * ⛔ **Vietati per sempre**: il cerchio di dodici stelle dell'emblema europeo e
 * qualunque somiglianza con la marcatura CE. Il primo suggerirebbe un
 * patrocinio dell'Unione che non c'è; la seconda è un marchio di conformità che
 * su un sistema di cartelle cliniche ⛔ non è ancora apponibile da nessuno.
 * Il sigillo ufficiale del GDPR esiste e si chiama Europrivacy (EDPB, art.
 * 42(5)): quello si mostra il giorno in cui lo si ottiene, non prima.
 */
function Sigillo({ marchio, stato }: { marchio: string; stato: StatoBollino }) {
  const tinta = stato === 'fatto' ? 'var(--accent-onink)' : 'var(--on-ink-muted)'
  /* Due righe quando la scritta è lunga: «IT · UE» e «ART. 32» non stanno su
     una riga sola dentro 58px senza scendere sotto i 7px, che non si legge. */
  const righe = marchio.includes(' ') ? marchio.split(' ') : [marchio]
  const dimensione = marchio.length > 6 ? 9 : 10

  return (
    /* ⚠️ Misura data dalle CLASSI e non dagli attributi `width`/`height`: il
       `viewBox` resta 58 e il disegno scala da sé. Su telefono 44px, perché lì
       il sigillo è l'elemento più alto della scheda e quindi **è lui a
       decidere** l'altezza del blocco: 14px in meno per scheda, per cinque
       schede, senza togliere una parola. */
    <svg
      className="w-[44px] h-[44px] shrink-0 sm:w-[58px] sm:h-[58px]"
      viewBox="0 0 58 58"
      fill="none"
      aria-hidden="true"
    >
      {/* Doppio anello: è ciò che a colpo d'occhio dice «timbro» invece che
          «icona». Il secondo è più sottile e più chiaro, come un'incisione. */}
      <circle cx="29" cy="29" r="27.5" stroke={tinta} strokeWidth="1" opacity="0.85" />
      <circle cx="29" cy="29" r="24" stroke={tinta} strokeWidth="0.75" opacity="0.5" />

      {righe.map((r, i) => (
        <text
          key={r + i}
          x="29"
          /* Su due righe si sale: il segno di stato sta a cy=41 col raggio
             4,4, cioè comincia a 36,6 — con la seconda riga a 36 si toccavano. */
          y={righe.length === 1 ? 30 : 23 + i * 10.5}
          textAnchor="middle"
          fill={tinta}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: dimensione,
            letterSpacing: '0.06em',
          }}
        >
          {r}
        </text>
      ))}

      {/* Il micro-segno di stato in basso, dentro l'anello: distingue «vale
          adesso» da «non ancora» senza affidarsi al solo colore. */}
      {stato === 'fatto' ? (
        <path
          d="M25 41.5l2.6 2.6L34 37.7"
          stroke={tinta}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <g stroke={tinta} strokeWidth="1.2" strokeLinecap="round">
          <circle cx="29" cy="41" r="4.4" fill="none" />
          <path d="M29 38.4V41l1.8 1.2" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  )
}

function Riquadro({ b, chiaro }: { b: Bollino; chiaro: boolean }) {
  const corpoColore = chiaro ? 'var(--on-ink-muted)' : 'var(--fg-muted)'
  const titoloColore = chiaro ? 'var(--on-ink)' : undefined
  const filetto = chiaro ? 'var(--rule-ink)' : 'var(--rule)'
  const accento = chiaro ? 'var(--accent-onink)' : 'var(--accent)'

  const contenuto = (
    <>
      <div className="flex items-start gap-[var(--s-13)]">
        <Segno stato={b.stato} chiaro={chiaro} />
        <div>
          <p
            className="text-[1.0625rem]"
            style={{ fontFamily: 'var(--font-display)', color: titoloColore, lineHeight: 1.25 }}
          >
            {b.titolo}
          </p>
          <p className="numero mt-[var(--s-5)]" style={{ color: corpoColore }}>
            {ETICHETTA[b.stato]}
          </p>
        </div>
      </div>

      <p className="mt-[var(--s-13)] text-[15px]" style={{ color: corpoColore }}>
        {b.corpo}
      </p>

      <p
        className="mt-[var(--s-13)] text-[13px]"
        style={{ color: corpoColore, borderTop: `1px solid ${filetto}`, paddingTop: 'var(--s-8)' }}
      >
        <span className="numero" style={{ color: accento }}>
          La prova
        </span>{' '}
        {b.prova}
      </p>
    </>
  )

  const cornice: React.CSSProperties = {
    border: `1px solid ${filetto}`,
    padding: 'var(--s-21)',
    height: '100%',
  }

  if (!b.href) {
    return <div style={cornice}>{contenuto}</div>
  }

  /* Il collegamento avvolge tutto il riquadro: il bersaglio da toccare è
     l'intero rettangolo, non tre parole. */
  if (b.esterno) {
    return (
      <a href={b.href} target="_blank" rel="noopener noreferrer" className="block group" style={cornice}>
        {contenuto}
        <span
          className="mt-[var(--s-13)] inline-flex items-center gap-[var(--s-5)] text-[13px]"
          style={{ color: accento }}
        >
          Controlla alla fonte <Freccia />
        </span>
      </a>
    )
  }

  return (
    <Link href={b.href} className="block group" style={cornice}>
      {contenuto}
      <span
        className="mt-[var(--s-13)] inline-flex items-center gap-[var(--s-5)] text-[13px]"
        style={{ color: accento }}
      >
        Controlla <Freccia />
      </span>
    </Link>
  )
}

/**
 * La striscia del piè di pagina: le sigle delle norme, in evidenza.
 *
 * ⚠️ Sta **sopra** le colonne di link e non in fondo alla riga del copyright,
 * perché in fondo non la legge nessuno: è la prima cosa dentro il piè di
 * pagina, con un filetto che la separa dal resto.
 *
 * ⛔ **Nessuna sigla compare da sola.** «GDPR» dentro un riquadro, senza altro,
 * si legge come *siamo a norma di GDPR*: una formula che non si può né provare
 * né smentire, e che su due delle cinque voci sarebbe pure falsa. Ogni sigla
 * porta la sua riga, e due dicono che non ci siamo ancora arrivati.
 */
export function BolliniPiede() {
  return (
    <section aria-labelledby="bollini-piede" style={{ marginBottom: 'var(--s-55)' }}>
      <h2 id="bollini-piede" className="occhiello occhiello-chiaro" style={{ fontWeight: 500 }}>
        Norme che ci si applicano
      </h2>

      <ul
        className="mt-[var(--s-21)] grid gap-[var(--s-13)]"
        style={{
          listStyle: 'none',
          padding: 0,
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        }}
      >
        {BOLLINI_PIEDE.map((b) => (
          <li key={b.sigla}>
            <Link
              href={b.href}
              className="block h-full"
              style={{ border: '1px solid var(--rule-ink)', padding: 'var(--s-13)' }}
            >
              {/* ⚠️ `minHeight` sul titolo, ⛔ non sulla scheda: i cinque
                  titoli vanno a capo in modo diverso («Art. 28 GDPR» sta in
                  una riga, «Marcatura CE dal 2029» in due) e senza questa
                  altezza minima l'etichetta di stato finiva **a quote diverse
                  in ogni scheda** — cinque righe che avrebbero dovuto essere
                  allineate e non lo erano. È il difetto che l'utente ha
                  descritto come «le scritte sembrano non allineate».
                  2 righe × 1,25 di interlinea su 15px = 37,5px. */}
              <span className="flex items-start gap-[var(--s-13)]">
                <Sigillo marchio={b.marchio} stato={b.stato} />
                <span>
                  <span
                    /* ⚠️ `sm:min-h-[2.34rem]`, ⛔ non sempre: l'altezza minima
                       serve a **allineare fra loro** schede affiancate. Su
                       telefono sono impilate, quindi lì non allinea niente e
                       aggiunge soltanto una riga vuota per scheda. */
                    className="block text-[15px] sm:min-h-[2.34rem]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--on-ink)',
                      lineHeight: 1.25,
                    }}
                  >
                    {b.sigla}
                  </span>
                  <span className="numero mt-[2px] block" style={{ color: 'var(--on-ink-muted)' }}>
                    {ETICHETTA[b.stato]}
                  </span>
                </span>
              </span>
              <span
                className="mt-[var(--s-13)] block text-[13px]"
                style={{ color: 'var(--on-ink-muted)' }}
              >
                {b.nota}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-[var(--s-13)] text-[13px]" style={{ color: 'var(--on-ink-muted)' }}>
        Due di queste dicono che non ci siamo ancora arrivati, ed è voluto.{' '}
        <Link href="/conformita-europea" style={{ color: 'var(--accent-onink)', textDecoration: 'underline' }}>
          Tutte e nove le garanzie, con gli articoli citati
        </Link>
        .
      </p>
    </section>
  )
}

/**
 * Una griglia di bollini.
 *
 * @param ids  Quali bollini, per id. Omesso: tutti.
 * @param colonne  Quante colonne da `sm` in su. Su telefono è sempre una.
 * @param chiaro  Vero quando la sezione contenitore ha fondo scuro.
 */
export function Bollini({
  ids,
  colonne = 3,
  chiaro = false,
}: {
  ids?: readonly string[]
  colonne?: 2 | 3
  chiaro?: boolean
}) {
  const elenco = ids ? prendi(ids) : BOLLINI
  /* ⛔ Classi Tailwind scritte per intero e non composte a stringa: il
     compilatore le cerca nel sorgente, e `sm:grid-cols-${n}` non verrebbe
     mai generata. È un errore che non dà nessun avviso e si vede solo a
     video, su una griglia che resta a una colonna. */
  const griglia = colonne === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'

  /* ⚠️ `RevealGruppo` + classi sui `<li>`, ⛔ non un `<Reveal>` per riquadro:
     `Reveal` interpone un `<div>` fra la cella della griglia e il riquadro, e
     quel div non è stirato dalla griglia ⇒ i riquadri perdono l'altezza
     uniforme e la fila si sfrangia. È la stessa ragione per cui gli anelli
     del `Sigillo` portano le classi addosso invece di essere avvolti. */
  return (
    <RevealGruppo passo={0.06}>
      <ul className={`grid gap-[var(--s-13)] ${griglia}`} style={{ listStyle: 'none', padding: 0 }}>
        {/* ⚠️ `passo` su ogni `<li>`: su telefono le colonne si impilano e tre
            riquadri di fila fanno più di una schermata. Lì l'unità di lettura
            è il passo, quindi ogni riquadro è un passo per conto suo, come le
            tre schede di «Come si controlla». Senza questa classe il cancello
            `altezza-pagine.mjs` misura la tappa intera e la boccia.
            🔑 La regola CSS è `.tappa .passo:not(:has(.passo))`: chi contiene
            passi non è un passo. Quindi il contenitore che avvolge questa
            lista può portare `passo` senza rompere niente, e sono questi
            `<li>` a diventare le schermate. */}
        {elenco.map((b) => (
          <li key={b.id} className="passo rivela rivela-su">
            <Riquadro b={b} chiaro={chiaro} />
          </li>
        ))}
      </ul>
    </RevealGruppo>
  )
}
