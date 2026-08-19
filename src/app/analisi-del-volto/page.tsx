import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: t('analisidelvolto.meta_titolo_analisi_del_volto_e'),
  description: t('analisidelvolto.meta_descrizione_il_prima_e_il'),
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
 * ── ✅ RISCRITTA IL 2026-08-19, E IL PRODOTTO È CAMBIATO SOTTO ──────────────
 * ⚠️ Questa pagina prometteva **misure**: inclinazione dei tre piani, rapporto
 * fra i terzi, differenze destra/sinistra, millimetri da calibrazione. Il
 * 2026-08-19 quelle funzioni sono state **tolte dal prodotto** (decisione
 * dell'utente, motivata sotto), e con loro sono sparite dal manuale e da qui.
 *
 * 🔑 La ragione non è regolatoria per prudenza, è **la Regola 11 dell'allegato
 * VIII MDR letta per quello che dice**: un software che fornisce informazioni
 * usate per prendere decisioni a fini diagnostici o terapeutici è classe IIa.
 * Il §4.2 di MDCG 2019-11 rev.1 la motiva con le *«conseguenze del danno
 * indiretto derivante dal non fornire l'informazione corretta»*. ⇒ un numero
 * clinico sbagliato **è** il danno, e chi lo fornisce ne risponde. Un righello
 * si vende tarato, e a tararlo ci vuole qualcuno che ne risponda: finché quel
 * qualcuno non c'è, ⛔ non si vendono numeri.
 *
 * ⇒ Il perimetro **non è più** «un goniometro e un righello» del §1.7 di
 * `EMR/docs/legal/valutazione-mdr-destinazione-uso.md`: è **più stretto**.
 * Oggi il modulo è *un raccoglitore ordinato per data, un visore di forma e il
 * posto dove il medico scrive il proprio giudizio*. Nessuna misura, nessun
 * numero, nessuna soglia.
 *
 * ⛔ PAROLE VIETATE, in ogni lingua e in ogni posizione:
 *   «punteggio», «indice di armonia», «voto», «valore ideale», «anomalo»,
 *   «rileva», «diagnostica», «simula il risultato», «anteprima del risultato»,
 *   «indica le zone da trattare», «consigliato», «raccomandato»,
 *   e ora anche **«misura», «calcola», «millimetri», «angolo», «rapporto»**
 *   riferiti al volto della paziente.
 * Sono il vocabolario dei concorrenti (Crisalix, Vectra, Arbrea, Visia:
 * simulazione pre-operatoria, outcome scoring, predictive analytics). Ognuna,
 * da sola, rimette il prodotto dentro la Regola 11.
 *
 * ⚠️ E una cosa da sapere prima di modificare: la verifica MDR del 2026-08-15
 * contava fra le prove a nostro favore che *«il modulo non è promosso in
 * nessuna pagina pubblica del sito»*. Questa pagina toglie quella riga di
 * proposito, su richiesta dell'utente del 2026-08-17, ed è il motivo per cui
 * ogni frase qui descrive un **gesto del medico** e mai un giudizio del
 * software. Contesto: [[sintesi-review-sito-2026-08-17]] §2 e §3, e
 * [[decisione-via-le-misure-dal-volto]].
 */

/* Le quattro funzioni, ognuna col suo confine. L'ordine è quello in cui le
 * incontra chi visita: prima il confronto, che è il gesto centrale; poi
 * l'avviso che dice quando quel confronto non regge; poi il giudizio che ne
 * esce; e infine il 3D, che è la cosa che si guarda e non la cosa che decide. */
const COSA = [
  {
    titolo: t('analisidelvolto.due_fotografie_una_accanto_all_altra'),
    cosaFa: t('analisidelvolto.il_primo_clic_sceglie_lo_scatto'),
    cosaNonFa: t('analisidelvolto.non_allinea_non_ritocca_non_sovrappone'),
    chiControlla: t('analisidelvolto.scegli_tu_le_due_fotografie_e'),
  },
  {
    titolo: t('analisidelvolto.quando_due_scatti_non_si_possono'),
    cosaFa: t('analisidelvolto.se_la_posa_e_diversa_mento'),
    cosaNonFa: t('analisidelvolto.non_blocca_niente_e_non_scarta'),
    chiControlla: t('analisidelvolto.decidi_tu_se_rifare_lo_scatto_o'),
  },
  {
    titolo: t('analisidelvolto.il_giudizio_con_gli_scatti_a'),
    cosaFa: t('analisidelvolto.dal_confronto_registri_la_scala_di'),
    cosaNonFa: t('analisidelvolto.non_lo_calcola_e_non_lo'),
    chiControlla: t('analisidelvolto.lo_scrivi_tu_ed_e_l'),
  },
  {
    titolo: t('analisidelvolto.la_forma_del_viso_in_tre'),
    cosaFa: t('analisidelvolto.dalla_stessa_fotografia_ricostruisce_la_forma'),
    cosaNonFa: t('analisidelvolto.non_e_una_scansione_la_profondita'),
    chiControlla: t('analisidelvolto.serve_a_guardare_e_a_mostrare'),
  },
] as const

export default function AnalisiDelVolto() {
  return (
    <Pagina
      href="/analisi-del-volto"
      occhiello={t('analisidelvolto.analisi_del_volto')}
      titolo={<Enfasi chiave="analisidelvolto.titolo_il_prima_e_il_dopo_uno" />}
      sommario={t('analisidelvolto.le_fotografie_che_hai_scattato_tu')}
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
          può copiare senza rinunciare al proprio prodotto. Dal 2026-08-19 dice
          anche che **i numeri non ci sono più**, ed è una posizione, non una
          mancanza: è il capoverso «Perché non ci sono misure del viso» della
          guida, ed è la cosa che i concorrenti a punteggio non possono dire. */}
      <section className="scuro fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello chiaro>{t('analisidelvolto.quello_che_non_c_e')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '17ch' }}>
                  {t('analisidelvolto.non_c_e_un_punteggio_e')}
                </h2>
                <div className="prosa mt-[var(--s-21)]">
                  <p style={{ color: 'var(--on-ink-muted)' }}>
                    {t('analisidelvolto.i_canoni_neoclassici_non_descrivono_le')}
                  </p>
                  <p style={{ color: 'var(--on-ink-muted)' }}>
                    {t('analisidelvolto.e_non_ci_sono_numeri_ne')}
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

      {/* Lo scatto. ⚠️ Sta DOPO il confronto e non prima, benché in ambulatorio
          venga prima: chi arriva qui cerca il prima/dopo, e la ripetibilità
          dell'inquadratura si capisce solo dopo aver visto a cosa serve.
          È anche la parte più difficile da copiare senza rifare la camera. */}
      <section className="fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello>{t('analisidelvolto.lo_scatto')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
                  {t('analisidelvolto.due_foto_si_confrontano_se_sono')}
                </h2>
                <div className="prosa mt-[var(--s-21)]">
                  <p>{t('analisidelvolto.il_protocollo_fotografico_e_una_serie')}</p>
                  <p>{t('analisidelvolto.scattando_dalla_camera_con_una_vista')}</p>
                  <p>{t('analisidelvolto.e_c_e_lo_specchio_dal')}</p>
                </div>
                <p
                  className="mt-[var(--s-21)] text-[15px]"
                  style={{ color: 'var(--fg)', borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}
                >
                  {t('analisidelvolto.la_lista_delle_viste_informa_e')}
                </p>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="consulto-studio"
                alt={t('analisidelvolto.medico_e_paziente_seduti_guardano_insieme')}
                proporzione="4 / 3"
                didascalia={t('analisidelvolto.la_stessa_inquadratura_a_ogni_visita')}
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
