import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia } from '@/components/ui/elementi'
import { Autovalutazione } from '@/components/Autovalutazione'

export const metadata: Metadata = {
  title: t('autovalutazione.meta_titolo_la_tua_documentazione_regge_ot'),
  description:
    t('autovalutazione.meta_descrizione_otto_domande_su_consensi_foto_'),
  alternates: { canonical: '/autovalutazione' },
}

export default function AutovalutazionePagina() {
  return (
    <Pagina
      href="/autovalutazione"
      occhiello={t('autovalutazione.autovalutazione')}
      titolo={<Enfasi chiave="autovalutazione.titolo_otto_domande_e_sai_dove_la" />}
      sommario={
        <>
          {t('autovalutazione.sono_le_domande_che_tornano_quando')}
        </>
      }
    >
      {/* La coda da 55px cadeva fuori da ogni passo: dentro una tappa lo
          spazio lo dà già l'altezza dei passi. */}
      <section style={{ paddingBottom: 'var(--s-8)' }}>
        <div className="gabbia gabbia-stretta">
          <Autovalutazione />
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>{t('autovalutazione.come_e_fatta')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {t('autovalutazione.nessun_punteggio_e_nessuna_email_da')}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('autovalutazione.un_numero_da_0_a_100')}
            </p>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('autovalutazione.le_risposte_non_escono_da_questa')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">{t('autovalutazione.se_qualche_punto_e_scoperto')}</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            {t('autovalutazione.non_serve_per_forza_cambiare_software')}
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/richiedi-una-demo" className="btn btn-primario">
              {t('autovalutazione.richiedi_una_demo')}
            </Link>
            <Link href="/consensi-informati" className="btn btn-secondario">
              {t('autovalutazione.che_cosa_deve_contenere_un_consenso')}
            </Link>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/che-software-serve" className="link-avanti">
              Portale, gestionale o cartella verticale: che cosa serve davvero
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
