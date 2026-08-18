import { Fragment } from 'react'
import Link from 'next/link'
import type { ChiaveSito } from '@/lib/testo'
import { t } from '@/lib/testo'

/**
 * Una frase di prosa con dentro un pezzo in risalto, un collegamento o un
 * termine tecnico, presa **intera** dal dizionario.
 *
 * ── PERCHE' ESISTE ──────────────────────────────────────────────────────────
 * È `Enfasi` applicata al corpo del testo invece che ai titoli, e nasce dallo
 * stesso difetto misurato due volte:
 *
 *     <p>Il listino è <Link href="/prezzi">pubblico</Link>, e qui c'è come…</p>
 *
 * Quella frase è **tre pezzi** per il codice, e nessuno dei tre è una frase.
 * ⛔ Estrarli separatamente rompe le lingue con un altro ordine delle parole, e
 * siccome il testo c'è tutto **nessun controllo se ne accorge**. Lasciarli fuori
 * dal dizionario invece li tiene in **italiano in tutte e cinque le lingue**:
 * misurato il 2026-08-17, erano 83 righe su `/en/`, e da sole erano tutto il
 * residuo rimasto dopo l'estrazione.
 * 🔴 E c'è una terza via di rottura, pagata lo stesso giorno: riscrivere quelle
 * righe a mano fa **sparire lo spazio** che veniva dall'a capo del sorgente
 * («Il listino è**pubblico**»), perché in JSX quello spazio è l'a capo. Con la
 * frase intera nel dizionario il problema non può più esistere: non c'è più un
 * a capo da cui dipenda uno spazio.
 *
 * ── I MARCATORI ─────────────────────────────────────────────────────────────
 *     *testo*     → <strong>            «Un *elenco pubblico* di medici»
 *     [testo]     → <Link>, in ordine   «Il listino è [pubblico], e [qui] c'è…»
 *     `testo`     → <code>              «Diventa un `AdverseEvent` FHIR»
 *     _testo_     → <em>                «scegliere il contrario: _non_ ricevere»
 *
 * 🔑 Il traduttore **sposta i marcatori dove la sua lingua vuole**, che è
 * precisamente la libertà che serve: in tedesco il verbo va in fondo e il pezzo
 * in risalto non sta dove sta in italiano.
 * ⚠️ I `[…]` si riempiono **in ordine** dall'elenco `link`: se una traduzione ne
 * inverte due, inverte anche le destinazioni. È il prezzo di non mettere gli
 * indirizzi nel dizionario, e si paga volentieri: un indirizzo dentro una
 * stringa tradotta è un collegamento rotto che nessuno vede.
 *
 * ⛔ Niente `dangerouslySetInnerHTML`: qui si costruiscono **nodi**, non HTML da
 * una stringa. Il dizionario non può iniettare markup.
 */
const MARCATORI = /(\*[^*]+\*|\[[^\]]+\]|`[^`]+`|_[^_]+_)/

export function Frase({
  chiave,
  link = [],
}: {
  chiave: ChiaveSito
  /** Le destinazioni dei `[…]`, nell'ordine in cui compaiono in italiano. */
  link?: readonly string[]
}) {
  let usati = 0
  return (
    <>
      {t(chiave)
        .split(MARCATORI)
        .map((pezzo, i) => {
          const dentro = pezzo.slice(1, -1)
          if (pezzo.startsWith('*') && pezzo.endsWith('*')) return <strong key={i}>{dentro}</strong>
          if (pezzo.startsWith('`') && pezzo.endsWith('`')) return <code key={i}>{dentro}</code>
          if (pezzo.startsWith('_') && pezzo.endsWith('_')) return <em key={i}>{dentro}</em>
          if (pezzo.startsWith('[') && pezzo.endsWith(']')) {
            const href = link[usati++]
            /* ⛔ Un `[…]` senza destinazione NON diventa un collegamento muto:
               resta testo. Un `<a>` senza href è un difetto di accessibilità, e
               qui nascerebbe da una traduzione che aggiunge un marcatore. */
            if (!href) return <Fragment key={i}>{dentro}</Fragment>
            return href.startsWith('mailto:') || href.startsWith('http') ? (
              <a key={i} href={href}>
                {dentro}
              </a>
            ) : (
              <Link key={i} href={href}>
                {dentro}
              </Link>
            )
          }
          return <Fragment key={i}>{pezzo}</Fragment>
        })}
    </>
  )
}
