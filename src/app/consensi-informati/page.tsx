import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { raggruppa } from '@/lib/raggruppa'
import { Occhiello, Freccia, Foto, Schermata } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: t('consensiinformati.meta_titolo_il_consenso_informato_in_medic'),
  description:
    t('consensiinformati.meta_descrizione_che_cosa_deve_contenere_un_con'),
  alternates: { canonical: '/consensi-informati' },
}

/* Pagina pilastro.
 *
 * L'intento di ricerca del medico estetico non è «software cartella
 * clinica»: sono gli adempimenti e la paura. Questa pagina risponde alla
 * domanda vera, e il prodotto compare alla fine come risposta, non come
 * premessa. È anche la pagina su cui si appoggeranno gli articoli di
 * dettaglio (tossina, filler, laser, conservazione, foto).
 *
 * ⚠️ Nessuna riga di questa pagina è un parere legale, e il testo lo dice.
 * Su un sito che vende a dei medici, spacciare una sintesi per consulenza è
 * il modo più veloce di perdere il lettore competente. */

const CONTENUTI = [
  {
    voce: t('consensiinformati.chi_esegue_e_con_quale_qualifica'),
    perche: t('consensiinformati.il_paziente_ha_diritto_di_sapere'),
  },
  {
    voce: t('consensiinformati.in_che_cosa_consiste_la_procedura'),
    perche: t('consensiinformati.descritta_in_modo_comprensibile_non_con'),
  },
  {
    voce: t('consensiinformati.rischi_e_complicanze_di_quella_procedura'),
    perche: t('consensiinformati.specifici_possibili_effetti_indesiderati_non_e'),
  },
  {
    voce: t('consensiinformati.alternative_compresa_quella_di_non_fare'),
    perche: t('consensiinformati.in_estetica_pesa_piu_che_altrove'),
  },
  {
    voce: t('consensiinformati.il_risultato_che_ci_si_puo'),
    perche:
      t('consensiinformati.e_il_punto_che_la_giurisprudenza'),
  },
  {
    voce: t('consensiinformati.che_cosa_succede_se_il_risultato'),
    perche: t('consensiinformati.ritocchi_tempi_costi_detto_prima_non'),
  },
] as const

export default function ConsensiInformati() {
  return (
    <Pagina
      href="/consensi-informati"
      occhiello="Guida"
      titolo={
        <>
          Il consenso informato in medicina estetica: che cosa deve{' '}
          <span className="accento-corsivo">contenere</span>
        </>
      }
      sommario={
        <>
          {t('consensiinformati.una_guida_pratica_per_chi_firma')}
        </>
      }
    >
      <section style={{ paddingBottom: 'var(--s-55)' }}>
        <div className="gabbia gabbia-stretta">
          <div className="prosa">
            <p>
              {t('consensiinformati.in_medicina_estetica_il_consenso_non')}
            </p>
            <p>
              {t('consensiinformati.il_modulo_unico_buono_per_tutto')}
            </p>
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <div className="passo">
            <Occhiello>{t('consensiinformati.la_sostanza')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {t('consensiinformati.sei_cose_che_un_consenso_estetico')}
            </h2>
          </div>
          {/* Tre voci per schermata sul telefono (1.149px su 721 utili se
              stanno tutte insieme). Su desktop i gruppi sono `<div>`
              trasparenti e l'elenco resta identico. */}
          <div className="mt-[var(--s-34)]">
            {raggruppa(CONTENUTI, 3).map((gruppo, g) => (
            <div key={g} className="passo">
            {gruppo.map((c, k) => { const i = g * 3 + k; return (
              <Reveal key={c.voce}>
                <div className="grid gap-[var(--s-21)] py-[var(--s-21)] sm:grid-cols-[2.5rem_1fr]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <span className="numero" style={{ paddingTop: 5 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-[1.0625rem]">{c.voce}</h3>
                    <p className="mt-[var(--s-5)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                      {c.perche}
                    </p>
                  </div>
                </div>
              </Reveal>
            )})}
            </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <Foto
                nome="iniezione-mento"
                alt={t('consensiinformati.trattamento_iniettivo_al_mento_eseguito_con')}
                proporzione="4 / 5"
              />
            </Reveal>
            <Reveal da="destra">
              <div>
                <Occhiello>{t('consensiinformati.gli_errori_ricorrenti')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                  {t('consensiinformati.quattro_modi_di_avere_un_consenso')}
                </h2>
                <ol className="mt-[var(--s-34)]">
                  {[
                    ['Il modulo unico', 'Uguale per la tossina e per il laser. Se vale per tutto, non descrive niente.'],
                    ['La firma in sala d’attesa', 'Firmato mentre aspetta, senza che nessuno abbia parlato con lei.'],
                    ['Il risultato dato per certo', 'Elencare i benefici come fatti compiuti è la postura più esposta che esista in estetica.'],
                    ['La data mancante', 'Un consenso senza data e senza tracciabilità è una dichiarazione che non si può collocare nel tempo.'],
                  ].map(([t, d], i) => (
                    <li key={t} className="grid gap-[var(--s-13)] py-[var(--s-13)] sm:grid-cols-[2rem_1fr]" style={{ borderTop: '1px solid var(--rule)' }}>
                      <span className="numero" style={{ paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>{t}</p>
                        <p className="mt-[2px] text-[15px]" style={{ color: 'var(--fg-muted)' }}>{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <div className="aurea aurea-inversa">
            <Reveal>
              <div className="lg:order-2">
                <Occhiello>{t('consensiinformati.come_lo_risolve_fibonacci')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                  {t('consensiinformati.un_modulo_per_procedura_firmato_in')}
                </h2>
                <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                  {t('consensiinformati.scegli_la_procedura_e_il_modulo')}
                </p>
                <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg)', borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}>
                  {t('consensiinformati.i_modelli_sono_una_struttura_non')}
                </p>
                <p className="mt-[var(--s-34)]">
                  <Link href="/come-funziona" className="link-avanti">
                    Guarda il flusso completo
                    <Freccia />
                  </Link>
                </p>
              </div>
            </Reveal>
            <Reveal>
              <Schermata
                file="/schermate/catalogo-consensi.png"
                alt={t('consensiinformati.il_catalogo_dei_consensi_di_fibonacci')}
                className="lg:order-1"
                didascalia="L'avviso in alto è nel prodotto, non solo nella documentazione."
              />
            </Reveal>
          </div>
        </div>
      </section>
    </Pagina>
  )
}
