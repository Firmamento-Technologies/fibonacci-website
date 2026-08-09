import type { ReactNode } from 'react'
import { assetPath } from '@/lib/asset-path'
import MANIFESTO from '../../../public/schermate/manifesto.json'

/* Elementi tipografici e figurativi ricorrenti. Server component: nessuno di
 * questi ha bisogno di stato, e tenerli fuori dal bundle client conta. */

export function Occhiello({ children, chiaro = false }: { children: ReactNode; chiaro?: boolean }) {
  return <p className={chiaro ? 'occhiello occhiello-chiaro' : 'occhiello'}>{children}</p>
}

/** Freccia dei link testuali. Inline per non caricare un'icona da libreria. */
export function Freccia() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface FotoProps {
  /** Nome del file dentro /public/photos, senza estensione. */
  nome: string
  alt: string
  /** Proporzione CSS, es. '4 / 3'. Serve a riservare lo spazio ed evitare CLS. */
  proporzione?: string
  didascalia?: string
  piena?: boolean
  className?: string
  priorita?: boolean
}

/**
 * Fotografia d'ambiente.
 *
 * `alt` è obbligatorio e va scritto: queste foto raccontano una scena e chi
 * usa uno screen reader ha diritto alla scena, non a «immagine1.jpg».
 *
 * Niente next/image: il sito è esportato statico su GitHub Pages, dove
 * l'ottimizzatore non gira. Le foto sono già ridimensionate a 1600px in fase
 * di download, e `loading=lazy` + `aspect-ratio` fanno il resto.
 */
export function Foto({
  nome,
  alt,
  proporzione = '4 / 3',
  didascalia,
  piena = false,
  className = '',
  priorita = false,
}: FotoProps) {
  return (
    <figure className={className}>
      <div className={piena ? 'foto foto-piena' : 'foto'} style={{ aspectRatio: proporzione }}>
        {/* next/image non serve: l'export statico non ha ottimizzatore a runtime,
            e le immagini sono già ridimensionate in fase di preparazione. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath(`/photos/${nome}.jpg`)}
          alt={alt}
          loading={priorita ? 'eager' : 'lazy'}
          decoding={priorita ? 'sync' : 'async'}
          fetchPriority={priorita ? 'high' : undefined}
        />
      </div>
      {didascalia && <figcaption className="didascalia">{didascalia}</figcaption>}
    </figure>
  )
}

/**
 * Schermata vera dell'applicazione.
 *
 * Baymard, su test di siti SaaS B2B: le rappresentazioni grafiche
 * dell'interfaccia rendono peggio degli screenshot, perché l'utente vuole
 * vedere com'è fatto davvero e non l'interpretazione di un designer. Per
 * questo qui non c'è nessuna cornice di browser disegnata attorno.
 */
export function Schermata({
  file,
  alt,
  didascalia,
  className = '',
  priorita = false,
  sizes = '(min-width: 1024px) 664px, calc(100vw - 44px)',
}: {
  /** Percorso storico (`/schermate/nome.png`) oppure il solo nome. */
  file: string
  alt: string
  didascalia?: string
  className?: string
  /** Vero solo per la schermata del primo schermo: è quella che decide l'LCP. */
  priorita?: boolean
  /** Quanto sarà larga a schermo, per far scegliere al browser la variante. */
  sizes?: string
}) {
  const nome = file.replace(/^.*\//, '').replace(/\.png$/, '')
  const varianti = MANIFESTO.schermate[nome as keyof typeof MANIFESTO.schermate]
  const larghezze = MANIFESTO.larghezze
  const srcset = (est: string) =>
    larghezze.map((w) => `${assetPath(`/schermate/${nome}-${w}.${est}`)} ${w}w`).join(', ')

  return (
    <figure className={className}>
      <div className="schermata">
        {/* ⚠️ `next/image` qui non serve e non servirebbe: l'export statico non
            ha un ottimizzatore a runtime (`images.unoptimized: true` in
            `next.config.ts`, obbligato da GitHub Pages). Le varianti si
            generano in anticipo con `scripts/schermate.mjs` e si servono qui.
            Perché: il 2026-08-09 queste schermate erano PNG da **2880 px
            serviti per 544** sul desktop (5,3×) e **per 346 su telefono**
            (8,3×) — 351 KB in `fetchpriority=high` per dipingere una miniatura
            illeggibile, ed erano l'elemento LCP della home. La variante AVIF a
            1120 px pesa **23 KB**: quindici volte meno.
            ([[sintesi-analisi-ui-ux-2026-08-09]] §S4)
            L'ordine dei `<source>` conta: il browser prende il primo che sa
            leggere. Se una schermata non è ancora nel manifesto si ricade sul
            PNG storico, così una pagina nuova non si rompe. */}
        {varianti ? (
          <picture>
            <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
            <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath(`/schermate/${nome}.png`)}
              sizes={sizes}
              alt={alt}
              width={larghezze[larghezze.length - 1]}
              height={Math.round(larghezze[larghezze.length - 1] * (875 / 1400))}
              loading={priorita ? 'eager' : 'lazy'}
              decoding={priorita ? 'sync' : 'async'}
              fetchPriority={priorita ? 'high' : 'auto'}
            />
          </picture>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={assetPath(file)}
            alt={alt}
            loading={priorita ? 'eager' : 'lazy'}
            decoding={priorita ? 'sync' : 'async'}
          />
        )}
      </div>
      {didascalia && <figcaption className="didascalia">{didascalia}</figcaption>}
    </figure>
  )
}

/** Intestazione di sezione: occhiello, titolo, sommario. Sempre nello stesso ordine. */
export function TestaSezione({
  occhiello,
  titolo,
  sommario,
  chiaro = false,
  centrata = false,
}: {
  occhiello: string
  titolo: ReactNode
  sommario?: ReactNode
  chiaro?: boolean
  centrata?: boolean
}) {
  return (
    <div className={centrata ? 'text-center mx-auto' : ''} style={centrata ? { maxWidth: '44rem' } : undefined}>
      <Occhiello chiaro={chiaro}>{occhiello}</Occhiello>
      <h2
        className="mt-[var(--s-21)] text-[clamp(1.85rem,4.2vw,2.9rem)]"
        style={{ maxWidth: centrata ? undefined : '22ch' }}
      >
        {titolo}
      </h2>
      {sommario && (
        <div
          className={`mt-[var(--s-21)] text-[1.0625rem] ${centrata ? 'mx-auto' : ''}`}
          style={{ color: chiaro ? 'var(--on-ink-muted)' : 'var(--fg-muted)', maxWidth: 'var(--measure)' }}
        >
          {sommario}
        </div>
      )}
    </div>
  )
}
