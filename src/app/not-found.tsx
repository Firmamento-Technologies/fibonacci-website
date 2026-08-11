import Link from 'next/link'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { Occhiello, Freccia } from '@/components/ui/elementi'

export const metadata = { title: 'Pagina non trovata' }

/* Una pagina 404 dice due cose: che l'indirizzo è sbagliato, e dove andare
 * adesso. Le altre sono decorazioni che allungano la strada. */
export default function NonTrovata() {
  return (
    <>
      <Header />
      <main id="contenuto" className="flex-1 fascia-lg">
        <div className="gabbia">
          <Occhiello>Errore 404</Occhiello>
          <h1 className="mt-[var(--s-21)] text-[length:var(--display-1)]" style={{ maxWidth: '16ch' }}>
            Questa pagina non c&apos;è
          </h1>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)', maxWidth: '44ch' }}>
            L&apos;indirizzo è sbagliato, oppure la pagina è stata spostata durante il rifacimento
            del sito.
          </p>

          <ul className="mt-[var(--s-34)] space-y-[var(--s-13)]">
            {[
              { href: '/', testo: 'Torna alla pagina iniziale' },
              { href: '/come-funziona', testo: 'Guarda come funziona' },
              { href: '/prezzi', testo: 'Vedi i prezzi' },
              { href: '/richiedi-una-demo', testo: 'Richiedi una demo' },
            ].map((v) => (
              <li key={v.href}>
                <Link href={v.href} className="link-avanti">
                  {v.testo}
                  <Freccia />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
