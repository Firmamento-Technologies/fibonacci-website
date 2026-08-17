import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia } from '@/components/ui/elementi'

export const metadata: Metadata = {
  /* 48 caratteri + « · Fibonacci» = 59, sotto la soglia dei 60 (vedi la nota in
   * `che-software-serve/page.tsx`). Era 66 + 11 = 77, e conteneva «Fibonacci»
   * due volte: una nel titolo e una aggiunta dal modello. */
  title: t('integrazioni.meta_titolo_integrazioni_con_cosa_si_colle'),
  description:
    t('integrazioni.meta_descrizione_oggi_fibonacci_non_si_integra_'),
  alternates: { canonical: '/integrazioni' },
}

/* La pagina che entrambi i concorrenti hanno e che qui dice il contrario.
 *
 * Un elenco di loghi di gestionali è la forma standard di questa pagina, e
 * serve a dire «non devi cambiare niente». Noi non abbiamo quell'elenco.
 * La scelta è fra non avere la pagina — e lasciare che il compratore prudente
 * cerchi e non trovi — o averla e dire come stanno le cose.
 *
 * ⚠️ Regola del sito: nessuna riga promette un'integrazione futura con una
 * data. Le integrazioni dipendono da fornitori terzi che non controlliamo, e
 * una data annunciata qui diventa un impegno che non possiamo mantenere. */

const ENTRA = [
  {
    voce: t('integrazioni.l_anagrafica_e_lo_storico_dal'),
    come: t('integrazioni.partiamo_da_un_file_esportato_dal'),
  },
  {
    voce: t('integrazioni.i_tuoi_moduli_di_consenso_se'),
    come: t('integrazioni.li_carichi_e_li_usi_al'),
  },
  {
    voce: t('integrazioni.il_catalogo_dei_farmaci'),
    come: t('integrazioni.i_medicinali_autorizzati_arrivano_dai_dati'),
  },
] as const

const ESCE = [
  {
    voce: t('integrazioni.la_cartella_completa_in_fhir_r4'),
    come: t('integrazioni.fhir_e_lo_standard_internazionale_per'),
  },
  {
    voce: t('integrazioni.i_documenti_firmati_in_pdf'),
    come: t('integrazioni.consensi_e_referti_escono_come_file'),
  },
  {
    voce: t('integrazioni.tutto_insieme_quando_smetti'),
    come: t('integrazioni.l_esportazione_completa_e_una_funzione'),
  },
] as const

export default function Integrazioni() {
  return (
    <Pagina
      href="/integrazioni"
      occhiello={t('integrazioni.integrazioni')}
      titolo={<Enfasi chiave="integrazioni.titolo_con_che_cosa_si_integra_fibonacci" />}
      sommario={
        <>
          {t('integrazioni.e_la_risposta_breve_ed_e')}
        </>
      }
    >
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>{t('integrazioni.perche_non_c_e_un_elenco')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '22ch' }}>
              {t('integrazioni.un_integrazione_e_una_promessa_che')}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('integrazioni.collegare_due_software_richiede_che_l')}
            </p>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('integrazioni.quindi_niente_elenco_e_niente_date')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>{t('integrazioni.che_cosa_entra')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {t('integrazioni.portare_i_dati_dentro_e_un')}
            </h2>
          </Reveal>
          <div className="mt-[var(--s-34)]">
            {ENTRA.map((e) => (
              <Reveal key={e.voce}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{e.voce}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {e.come}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              Il limite, detto prima: se il tuo fornitore attuale non esporta niente di
              utilizzabile, te lo diciamo <em>prima</em> di firmare. È un problema che va
              conosciuto, non scoperto.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>{t('integrazioni.che_cosa_esce')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {t('integrazioni.uno_standard_non_un_formato_nostro')}
            </h2>
          </Reveal>
          <div className="mt-[var(--s-34)]">
            {ESCE.map((e) => (
              <Reveal key={e.voce}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{e.voce}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {e.come}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello chiaro>{t('integrazioni.e_il_portale_che_usi_gia')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {t('integrazioni.convivono_e_il_costo_lo_diciamo')}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
              {t('integrazioni.se_usi_un_portale_di_prenotazione')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">{t('integrazioni.vuoi_vedere_come_esce_un_documento')}</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            {t('integrazioni.il_verificatore_gira_nel_tuo_browser')}
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/verifica" className="btn btn-primario">
              {t('integrazioni.apri_il_verificatore')}
            </Link>
            <Link href="/richiedi-una-demo" className="btn btn-secondario">
              {t('integrazioni.richiedi_una_demo')}
            </Link>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/che-software-serve" className="link-avanti">
              {t('integrazioni.portale_gestionale_o_cartella_verticale_che')}
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
