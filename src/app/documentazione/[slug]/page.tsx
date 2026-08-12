import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GuscioManuale } from '@/components/docs/GuscioManuale'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { ProvaFarmaciAifa } from '@/components/home/ProvaFarmaciAifa'
import { Freccia } from '@/components/ui/elementi'
import { indiceDaMarkdown } from '@/lib/ancore'
import { DOCS, getDocMeta, guideVicine, numeroCapitolo } from '@/lib/docs-data'
import { loadDoc } from '@/lib/docs-file'

export async function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocMeta(slug)
  if (!doc) return {}
  return { title: doc.title, description: doc.description, alternates: { canonical: `/documentazione/${doc.slug}` } }
}

export default async function Guida({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getDocMeta(slug)
  if (!doc) notFound()

  const contenuto = await loadDoc(slug)
  /* L'indice si ricava dal SORGENTE, non dal DOM: la pagina è esportata
     statica e un indice costruito a runtime non ci sarebbe finito dentro —
     né per un motore di ricerca né per chi ha gli script spenti. Le ancore le
     calcola `src/lib/ancore.ts`, lo stesso modulo che le mette sui titoli. */
  const indice = indiceDaMarkdown(contenuto)
  const { precedente, successiva } = guideVicine(slug)

  return (
    <GuscioManuale slugCorrente={slug} indice={indice} briciola={doc.title}>
      <p className="manuale__capitolo">Capitolo {numeroCapitolo(slug)}</p>

      <article className="prosa prosa-manuale">
        <MarkdownRenderer content={contenuto} ancore />
      </article>

      {/* La guida che PARLA del catalogo farmaci lo fa anche provare.
          ⚖️ Sta qui e non nella home: è il posto dove chi legge si sta già
          chiedendo come funziona quel catalogo, e dove il campione ridotto
          (46 confezioni) non rischia di essere letto come un vanto. */}
      {slug === 'catalogo-farmaci-aifa' && (
        <div className="mt-[var(--s-55)]">
          <ProvaFarmaciAifa />
        </div>
      )}

      {/* ⚠️ «Precedente/successiva» seguono l'ordine dell'INDICE
          (`DOCS_IN_ORDINE`), non quello grezzo dell'array: prima proponevano
          salti che l'indice non mostrava — da una guida d'uso quotidiano a un
          adempimento, scavalcando metà della propria sezione. */}
      <nav className="manuale__vicine" aria-label="Capitoli vicini">
        {precedente ? (
          <Link href={`/documentazione/${precedente.slug}`}>
            <span className="numero">Capitolo precedente</span>
            <span className="manuale__vicine-titolo">{precedente.title}</span>
          </Link>
        ) : <span />}
        {successiva && (
          <Link href={`/documentazione/${successiva.slug}`} className="manuale__vicine--avanti">
            <span className="numero">Capitolo successivo</span>
            <span className="manuale__vicine-titolo">{successiva.title}</span>
          </Link>
        )}
      </nav>

      {/* ⚠️ Fino al 2026-08-12 questo collegamento portava a
        * `/richiedi-una-demo`: un **modulo commerciale** proposto a chi sta
        * leggendo il manuale, cioe' a chi ha gia' comprato. Chi cerca come
        * si fa una cosa non vuole essere venduto — vuole la risposta.
        * Ora porta all'assistente, che legge queste stesse pagine e dice
        * quali ha usato; l'indirizzo per scriverci sta nel testo delle
        * guide, risolto da `{EMAIL_SUPPORTO}`. */}
      <p className="manuale__coda">
        <Link href="/domande" className="link-avanti">Non trovi quello che cerchi? Chiedilo all’assistente<Freccia /></Link>
      </p>
    </GuscioManuale>
  )
}
