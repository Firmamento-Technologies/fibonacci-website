import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'
import { SOCIETA, CONTACT_EMAIL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: t('chisiamo.meta_titolo_chi_siamo'),
  description:
    t('chisiamo.meta_descrizione_chi_c_e_dietro_fibonacci_come'),
  alternates: { canonical: '/chi-siamo' },
}

/* Chi siamo.
 *
 * Fra i fattori di credibilità misurati da Stanford e ripresi da CXL, i più
 * forti sono banali: un indirizzo vero, persone con un nome, un aspetto
 * professionale, testi senza errori. E l'avvertenza opposta: se urli
 * «fidati di me» fai nascere il sospetto.
 *
 * Per questo la pagina dice a che punto siamo per davvero. Un fornitore in
 * avvio che lo ammette è più credibile di uno che finge una scala che non
 * ha, e il medico che compra un gestionale clinico questa cosa la verifica.
 */

const PRINCIPI = [
  {
    titolo: t('chisiamo.non_promettiamo_quello_che_non_gira'),
    testo:
      t('chisiamo.firma_qualificata_e_conservazione_a_norma'),
  },
  {
    titolo: t('chisiamo.i_dati_sono_del_medico'),
    testo:
      t('chisiamo.titolare_del_trattamento_sei_tu_l'),
  },
  {
    titolo: t('chisiamo.il_software_non_fa_il_medico'),
    testo:
      t('chisiamo.nessuna_schermata_propone_diagnosi_o_terapie'),
  },
  {
    titolo: t('chisiamo.le_prove_prima_delle_parole'),
    testo:
      t('chisiamo.il_verificatore_dei_documenti_e_pubblico'),
  },
] as const

export default function ChiSiamo() {
  return (
    <Pagina
      href="/chi-siamo"
      occhiello="Chi siamo"
      titolo={
        <>
          Un prodotto in <span className="accento-corsivo">avvio</span>, detto senza giri di parole
        </>
      }
      sommario="Fibonacci nasce dal lavoro con studi di medicina estetica veri, sulle cose che a fine giornata restano indietro: le schede da ricopiare, i consensi generici, le foto nel telefono."
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <Foto
                nome="cura-pelle-viso"
                alt={t('chisiamo.trattamento_del_viso_in_ambulatorio_mani')}
                proporzione="4 / 3"
              />
            </Reveal>
            <Reveal da="destra">
              <div className="prosa">
                <p>
                  {t('chisiamo.il_prodotto_e_nato_guardando_lavorare')}
                </p>
                <p>
                  {t('chisiamo.da_li_la_scelta_di_costruire')}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <div className="passo">
            <Occhiello>{t('chisiamo.come_lavoriamo')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {t('chisiamo.quattro_regole_che_ci_siamo_dati')}
            </h2>
          </div>
          <div className="mt-[var(--s-34)] grid gap-[var(--s-21)] md:grid-cols-2">
            {PRINCIPI.map((p) => (
              <Reveal key={p.titolo} className="passo">
                <div className="foglio h-full" style={{ padding: 'var(--pad-foglio, var(--s-34))' }}>
                  <h3 className="text-[1.3rem]">{p.titolo}</h3>
                  <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {p.testo}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <div className="passo">
            <Occhiello>{t('chisiamo.a_che_punto_siamo')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {t('chisiamo.in_pilota_non_in_scala')}
            </h2>
          </div>
          <div className="passo prosa mt-[var(--s-21)]">
            <p>
              {t('chisiamo.il_software_gira_in_produzione_presso')}
            </p>
            <p>
              {t('chisiamo.che_cosa_vuol_dire_per_te')}
            </p>
            {!SOCIETA.costituita && (
              <p>
                <strong>{t('chisiamo.una_nota_societaria')}</strong> Fibonacci sta passando a una società propria,
                oggi in costituzione. Finché l&apos;iscrizione al registro delle imprese non è
                perfezionata, ragione sociale, sede e partita IVA non compaiono nel piè di pagina:
                preferiamo un dato mancante a un dato provvisorio.
              </p>
            )}
          </div>

          <p className="mt-[var(--s-34)]">
            <Link href="/richiedi-una-demo" className="link-avanti">
              Parliamone di persona
              <Freccia />
            </Link>
          </p>
          {CONTACT_EMAIL && (
            <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              Oppure scrivi a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent-deep)', borderBottom: '1px solid var(--rule-strong)' }}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          )}
        </div>
      </section>
    </Pagina>
  )
}
