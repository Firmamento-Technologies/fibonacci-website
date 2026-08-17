import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: t('analisidelvolto.meta_titolo_analisi_del_volto_e'),
  description: t('analisidelvolto.meta_descrizione_misure_geometriche_sulle_fotografie'),
  alternates: { canonical: '/analisi-del-volto' },
}

/* ANALISI DEL VOLTO E ATLANTE 3D — la pagina più vincolata del sito.
 *
 * ── 🔴 PERCHE' LE PAROLE QUI SONO UN VINCOLO E NON DEL COPY ─────────────────
 * L'art. 2, punto 12 del Reg. (UE) 2017/745 (MDR) definisce la destinazione
 * d'uso come *«l'utilizzo al quale è destinato un dispositivo secondo le
 * indicazioni fornite dal fabbricante sull'etichetta, nelle istruzioni per
 * l'uso o nel **materiale o nelle dichiarazioni di promozione o vendita**»*.
 * ⇒ **questa pagina può qualificare il prodotto come dispositivo medico a
 * codice invariato.** Non è un rischio teorico: è il canale per cui si diventa
 * fabbricante di dispositivi medici senza scrivere una riga di codice.
 *
 * Il perimetro non è stato inventato qui: è il **§1.7** di
 * `EMR/docs/legal/valutazione-mdr-destinazione-uso.md`, che dichiara questo
 * modulo *«un goniometro, un righello e un raccoglitore ordinato per data»*.
 * Ogni riga di questa pagina sta dentro quella dichiarazione, e le tre colonne
 * (cosa fa · cosa non fa · chi controlla) sono la forma che il sito aveva già
 * inventato per `/intelligenza-artificiale`: nata per l'art. 50 dell'AI Act, si
 * è rivelata **la forma giusta anche per l'MDR**, perché dice la funzione e ne
 * dichiara il confine nello stesso respiro.
 *
 * ⛔ PAROLE VIETATE, in ogni lingua e in ogni posizione:
 *   «punteggio», «indice di armonia», «voto», «valore ideale», «anomalo»,
 *   «rileva», «diagnostica», «simula il risultato», «anteprima del risultato»,
 *   «indica le zone da trattare», «consigliato», «raccomandato».
 * Sono il vocabolario dei concorrenti (Crisalix, Vectra, Arbrea, Visia:
 * simulazione pre-operatoria, outcome scoring, predictive analytics). Ognuna,
 * da sola, rende **falsa** la dichiarazione del §1.7.
 *
 * ⚠️ E una cosa da sapere prima di modificare: la verifica MDR del 2026-08-15
 * contava fra le prove a nostro favore che *«il modulo non è promosso in
 * nessuna pagina pubblica del sito»*. Questa pagina toglie quella riga di
 * proposito, su richiesta dell'utente del 2026-08-17, ed è il motivo per cui
 * ogni frase qui è la frase del §1.7 e non una sua parafrasi più larga.
 * Contesto completo: [[sintesi-review-sito-2026-08-17]] §2 e §3.
 */

/* Le quattro funzioni, ognuna col suo confine. L'ordine è quello in cui le
 * incontra chi visita: prima la misura, poi il tempo, poi i millimetri, e
 * infine la qualità dello scatto, che viene prima dei numeri ma si capisce
 * dopo averli visti. */
const COSA = [
  {
    titolo: t('analisidelvolto.le_misure_sulla_fotografia'),
    cosaFa: t('analisidelvolto.calcola_l_inclinazione_dei_tre_piani'),
    cosaNonFa: t('analisidelvolto.non_rileva_niente_e_non_qualifica'),
    chiControlla: t('analisidelvolto.scegli_tu_la_fotografia_e_i'),
  },
  {
    titolo: t('analisidelvolto.lo_stesso_volto_in_ordine_di'),
    cosaFa: t('analisidelvolto.le_stesse_misure_ripetute_e_messe'),
    cosaNonFa: t('analisidelvolto.nessuna_soglia_e_nessun_avviso_su'),
    chiControlla: t('analisidelvolto.la_lettura_della_variazione_e_tua'),
  },
  {
    titolo: t('analisidelvolto.i_millimetri_quando_li_vuoi'),
    cosaFa: t('analisidelvolto.se_segni_con_due_clic_un'),
    cosaNonFa: t('analisidelvolto.non_si_calibra_da_sola_e'),
    chiControlla: t('analisidelvolto.la_calibrazione_e_un_tuo_gesto'),
  },
  {
    titolo: t('analisidelvolto.la_qualita_dello_scatto_viene_prima'),
    cosaFa: t('analisidelvolto.se_la_testa_e_girata_oltre'),
    cosaNonFa: t('analisidelvolto.non_li_nasconde_nascondere_un_numero'),
    chiControlla: t('analisidelvolto.decidi_tu_se_rifare_lo_scatto'),
  },
] as const

export default function AnalisiDelVolto() {
  return (
    <Pagina
      href="/analisi-del-volto"
      occhiello={t('analisidelvolto.analisi_del_volto')}
      titolo={<Enfasi chiave="analisidelvolto.titolo_le_misure_che_finora_facevi_a" />}
      sommario={t('analisidelvolto.sulla_fotografia_che_hai_scattato_e')}
    >
      <section style={{ paddingBottom: 'var(--s-8)' }}>
        <div className="gabbia gabbia-stretta">
          {COSA.map((c, i) => (
            <Reveal key={c.titolo} className="passo">
              <div className="py-[var(--s-34)]" style={{ borderTop: '1px solid var(--rule)' }}>
                <div className="flex items-baseline gap-[var(--s-13)]">
                  <span className="numero">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-[1.3rem]">{c.titolo}</h2>
                </div>
                <dl className="mt-[var(--s-21)] grid gap-[var(--s-21)] md:grid-cols-3">
                  {[
                    [t('analisidelvolto.cosa_fa'), c.cosaFa],
                    [t('analisidelvolto.cosa_non_fa'), c.cosaNonFa],
                    [t('analisidelvolto.chi_controlla'), c.chiControlla],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="numero">{k}</dt>
                      <dd className="mt-[var(--s-5)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ⚠️ La sezione che vale più di tutte, e la sola che un concorrente non
          può copiare senza rinunciare al proprio prodotto. Il contenuto non è
          una posizione commerciale: è scritto in testa a `analisi-volto.tsx`
          nell'applicazione, e la letteratura è quella citata lì. */}
      <section className="scuro fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello chiaro>{t('analisidelvolto.quello_che_non_c_e')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '17ch' }}>
                  {t('analisidelvolto.non_c_e_un_punteggio_di')}
                </h2>
                <div className="prosa mt-[var(--s-21)]">
                  <p style={{ color: 'var(--on-ink-muted)' }}>
                    {t('analisidelvolto.i_canoni_neoclassici_non_descrivono_le')}
                  </p>
                  <p style={{ color: 'var(--on-ink-muted)' }}>
                    {t('analisidelvolto.l_unico_confronto_che_non_presuppone')}
                  </p>
                  <p style={{ color: 'var(--on-ink-muted)' }}>
                    {t('analisidelvolto.e_per_la_stessa_ragione_non')}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="specchio-risultato"
                alt={t('analisidelvolto.una_donna_seduta_in_ambulatorio_si')}
                proporzione="4 / 3"
                piena
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* L'atlante. ⚠️ È un atlante di riferimento: ⛔ non osserva la paziente,
          non misura un tessuto, non propone niente. Nessuna delle cautele qui
          sopra lo tocca, e per questo è anche la parte che si può raccontare
          con più libertà. */}
      <section className="fascia">
        <div className="gabbia">
          <div className="aurea aurea-inversa">
            <Reveal>
              <div className="lg:order-2">
                <Occhiello>{t('analisidelvolto.anatomia')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                  {t('analisidelvolto.l_atlante_non_sta_sull_altro')}
                </h2>
                <div className="prosa mt-[var(--s-21)]">
                  <p>{t('analisidelvolto.i_sistemi_si_accendono_e_si')}</p>
                  <p>{t('analisidelvolto.sono_gli_stessi_modelli_su_cui')}</p>
                </div>
                <p
                  className="mt-[var(--s-21)] text-[15px]"
                  style={{ color: 'var(--fg)', borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}
                >
                  {t('analisidelvolto.quando_spieghi_dove_passa_l_arteria')}
                </p>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="mano-guanto-siringa"
                alt={t('analisidelvolto.mano_con_guanto_che_impugna_una')}
                proporzione="4 / 3"
                className="lg:order-1"
                didascalia={t('analisidelvolto.la_zona_a_rischio_si_guarda')}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Occhiello>{t('analisidelvolto.dove_sta_nel_prodotto')}</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
            {t('analisidelvolto.e_compreso_in_tutti_i_piani')}
          </h2>
          <div className="prosa mt-[var(--s-21)]">
            <p>{t('analisidelvolto.non_e_un_modulo_a_parte_ne')}</p>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/come-funziona" className="link-avanti">
              {t('analisidelvolto.come_si_usa_dentro_la_visita')}
              <Freccia />
            </Link>
          </p>
          <p className="mt-[var(--s-13)]">
            <Link href="/richiedi-una-demo" className="link-avanti">
              {t('analisidelvolto.vederlo_sulle_tue_procedure')}
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
