import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { VerificaDocumento } from '@/components/VerificaDocumento'
import { Occhiello, Freccia } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: t('verifica.meta_titolo_verifica_un_documento'),
  description:
    t('verifica.meta_descrizione_carica_un_pdf_uscito_da_fibona'),
  alternates: { canonical: '/verifica' },
  robots: { index: true, follow: true },
}

/* Il verificatore pubblico.
 *
 * È la prova più forte che il sito possa offrire, e vale proprio perché
 * funziona anche contro di noi. Per la stessa ragione il testo qui sotto
 * distingue con precisione due cose che il vecchio sito confondeva:
 *
 *   · la CATENA DI IMPRONTE del registro accessi esiste, gira in produzione
 *     e rileva le manomissioni a posteriori;
 *   · la FIRMA ELETTRONICA QUALIFICATA eIDAS NON è attiva.
 *
 * Scrivere «firma eIDAS art. 26» come faceva la pagina precedente è un
 * claim che oggi non regge, e su un sito sanitario un claim che non regge
 * è il primo che il consulente del cliente va a controllare. */

export default function Verifica() {
  return (
    <Pagina
      href="/verifica"
      occhiello={t('verifica.verifica')}
      titolo={<Enfasi chiave="verifica.titolo_controlla_un_documento_senzachiederlo_a_noi" />}
      sommario={t('verifica.carica_un_pdf_uscito_da_fibonacci')}
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia gabbia-stretta">
          <VerificaDocumento />
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <div className="passo">
            <Occhiello>{t('verifica.che_cosa_dimostra_e_che_cosa')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {t('verifica.due_cose_diverse_che_spesso_vengono')}
            </h2>
          </div>

          <div className="mt-[var(--s-34)] grid gap-[var(--s-21)] md:grid-cols-2">
            <div className="passo foglio" style={{ padding: 'var(--pad-foglio, var(--s-34))' }}>
              <p className="numero" style={{ color: 'var(--accent)' }}>{t('verifica.attivo_oggi')}</p>
              <h3 className="mt-[var(--s-13)] text-[1.3rem]">{t('verifica.la_catena_di_impronte')}</h3>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                {t('verifica.ogni_scrittura_nel_registro_porta_l')}
              </p>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg)' }}>
                {t('verifica.serve_a_dimostrare_che_un_documento')}
              </p>
            </div>

            <div className="passo foglio" style={{ padding: 'var(--pad-foglio, var(--s-34))' }}>
              <p className="numero">{t('verifica.non_ancora')}</p>
              <h3 className="mt-[var(--s-13)] text-[1.3rem]">{t('verifica.la_firma_qualificata')}</h3>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                {t('verifica.la_firma_della_paziente_oggi_e')}
              </p>
              <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg)' }}>
                {t('verifica.finche_non_c_e_non_la')}
              </p>
            </div>
          </div>

          <p className="mt-[var(--s-34)]">
            <Link href="/sicurezza-e-dati" className="link-avanti">
              {t('verifica.come_sono_protetti_i_dati_per')}
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
