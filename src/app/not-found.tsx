import { t } from '@/lib/testo'
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
          <Occhiello>{t('notfound.errore_404')}</Occhiello>
          <h1 className="mt-[var(--s-21)] text-[length:var(--display-1)]" style={{ maxWidth: '16ch' }}>
            {t('notfound.questa_pagina_non_c_e')}
          </h1>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)', maxWidth: '44ch' }}>
            {t('notfound.l_indirizzo_e_sbagliato_oppure_la')}
          </p>

          <ul className="mt-[var(--s-34)] space-y-[var(--s-13)]">
            {[
              { href: '/', testo: t('notfound.torna_alla_pagina_iniziale') },
              { href: '/come-funziona', testo: t('notfound.guarda_come_funziona') },
              { href: '/prezzi', testo: t('notfound.vedi_i_prezzi') },
              { href: '/richiedi-una-demo', testo: t('notfound.richiedi_una_demo') },
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
