import { t } from '@/lib/testo'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { IndiceCapitoli } from '@/components/docs/IndiceCapitoli'
import { InQuestaPagina } from '@/components/docs/InQuestaPagina'
import type { VoceIndice } from '@/lib/ancore'

/* Il guscio del manuale: indice a sinistra, testo al centro, i titoli della
 * pagina a destra.
 *
 * ── PERCHÉ NON `Pagina` ─────────────────────────────────────────────────────
 * `Pagina` è il guscio delle pagine di VENDITA, e dall'11 agosto porta con sé
 * il percorso a tappe: una schermata per sezione, la V per proseguire. Quel
 * dispositivo serve a far leggere per intero chi sta valutando un acquisto.
 * La documentazione è il caso opposto — chi la apre ha già comprato, sa cosa
 * cerca e vuole arrivarci: l'unità di misura non è la schermata, è il capitolo.
 * È la stessa ragione per cui il lato paziente ha spento le tappe (TD-95), e
 * `src/lib/percorso.ts` lo scriveva già: «⛔ le pagine legali e le guide NON
 * stanno nel percorso».
 *
 * ── I TRE LANDMARK ──────────────────────────────────────────────────────────
 * L'indice e «in questa pagina» sono `<nav>` FUORI da `<main>`, non dentro.
 * Non è formalismo: «Salta al contenuto» punta a `#contenuto`, e con l'indice
 * dentro `main` quel salto atterrerebbe prima di diciannove link — cioè non
 * salterebbe niente. Fuori, chi naviga per landmark ha tre destinazioni
 * distinte e il salto arriva davvero al testo.
 */
export function GuscioManuale({
  slugCorrente,
  indice,
  briciola,
  children,
}: {
  /** La guida aperta, se siamo dentro una guida: si evidenzia nell'indice. */
  slugCorrente?: string
  /** I titoli della guida aperta. Assente sulla pagina indice. */
  indice?: VoceIndice[]
  /** L'ultima briciola, dopo «Manuale». Assente sulla pagina indice. */
  briciola?: string
  children: ReactNode
}) {
  const conContesto = Boolean(indice && indice.length > 0)

  return (
    <>
      <Header />
      <div className={`manuale gabbia ${conContesto ? 'manuale--con-contesto' : ''}`}>
        <IndiceCapitoli slugCorrente={slugCorrente} />

        <main id="contenuto" className="manuale__colonna">
          <nav className="manuale__briciole" aria-label={t('docs.gusciomanuale.percorso')}>
            <Link href="/documentazione">{t('docs.gusciomanuale.manuale')}</Link>
            {briciola && (
              <>
                <span aria-hidden="true">›</span>
                <span aria-current="page">{briciola}</span>
              </>
            )}
          </nav>
          {children}
        </main>

        {conContesto && <InQuestaPagina voci={indice!} />}
      </div>
      <Footer />
    </>
  )
}
