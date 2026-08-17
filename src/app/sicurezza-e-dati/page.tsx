import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'
import { OSPITALITA, PRIVACY_EMAIL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: t('sicurezzaedati.meta_titolo_sicurezza_e_dati'),
  description:
    t('sicurezzaedati.meta_descrizione_dove_stanno_i_dati_dei_tuoi'),
  alternates: { canonical: '/sicurezza-e-dati' },
}

/* La pagina che il medico prudente cerca e non trova mai.
 *
 * Regola di scrittura per questa pagina: ogni riga deve essere una cosa che
 * un consulente esterno può verificare o contestare. Le frasi rassicuranti
 * senza contenuto ("prendiamo la sicurezza sul serio") vanno tolte: lo
 * studio di Stanford ripreso da CXL dice che gridare «fidati di me» fa
 * nascere il sospetto invece di scioglierlo. */

const DOMANDE = [
  {
    d: t('sicurezzaedati.dove_stanno_fisicamente_i_dati'),
    /* ⚠️ Questa risposta diceva il contrario fino al 2026-08-16: nominava un
       fornitore tedesco e si scusava che «in Italia» sarebbe stato falso.
       Era vero fino al 10 agosto. Vedi il commento su `OSPITALITA`. */
    r: `Su server di ${OSPITALITA.fornitore}, in ${OSPITALITA.luogo}, quindi dentro ${OSPITALITA.area}. Non su cloud statunitensi, e senza repliche fuori dall’Unione: la filiera clinica non lascia il territorio europeo in nessun passaggio. Non devi crederci sulla parola: l’indirizzo del sito è pubblico e un «whois» te lo dice in trenta secondi, anche contro di noi.`,
  },
  {
    d: t('sicurezzaedati.chi_e_il_titolare_del_trattamento'),
    r: t('sicurezzaedati.tu_i_pazienti_sono_i_tuoi'),
  },
  {
    d: t('sicurezzaedati.come_sono_cifrati'),
    r: t('sicurezzaedati.il_traffico_viaggia_in_tls_i'),
  },
  {
    d: t('sicurezzaedati.chi_dentro_fibonacci_puo_leggere_una'),
    r: t('sicurezzaedati.il_personale_tecnico_che_gestisce_i'),
  },
  {
    d: t('sicurezzaedati.i_dati_dei_pazienti_addestrano_modelli'),
    r: t('sicurezzaedati.no_i_fornitori_dei_modelli_che'),
  },
  {
    d: t('sicurezzaedati.e_i_backup'),
    r: t('sicurezzaedati.backup_cifrati_e_quotidiani_con_prova'),
  },
  {
    d: t('sicurezzaedati.se_smetto_cosa_succede_ai_dati'),
    r: t('sicurezzaedati.esporti_tutto_in_un_formato_standard'),
  },
  {
    d: t('sicurezzaedati.e_se_chiudete_voi'),
    r: t('sicurezzaedati.vale_lo_stesso_l_esportazione_e'),
  },
] as const

const DOCUMENTI = [
  { titolo: t('sicurezzaedati.accordo_sul_trattamento_dei_dati'), descr: t('sicurezzaedati.l_art_28_fra_te_titolare'), href: '/dpa' },
  { titolo: t('sicurezzaedati.sub_responsabili'), descr: t('sicurezzaedati.chi_tocca_i_dati_oltre_a'), href: '/sub-responsabili' },
  { titolo: t('sicurezzaedati.misure_di_sicurezza'), descr: t('sicurezzaedati.la_scheda_tecnica_ex_art_32'), href: '/sicurezza' },
  { titolo: t('sicurezzaedati.informativa_privacy'), descr: t('sicurezzaedati.come_trattiamo_i_dati_di_chi'), href: '/privacy' },
] as const

export default function SicurezzaEDati() {
  return (
    <Pagina
      href="/sicurezza-e-dati"
      occhiello={t('sicurezzaedati.sicurezza_e_dati')}
      titolo={<Enfasi chiave="sicurezzaedati.titolo_le_domande_che_il_tuo_consulente" />}
      sommario={t('sicurezzaedati.otto_risposte_senza_rassicurazioni_generiche_se')}
    >
      {/* ⚠️ DUE PER SCHERMATA, non otto in colonna.
          Le otto risposte stavano in una sezione sola: **1.368px, il 169% di
          una schermata** su desktop e **1.346px su 721 utili** al telefono.
          Prima divise in due da quattro (desktop a posto), poi in quattro da
          due: quattro risposte impilate su uno schermo da 375px fanno ancora
          il doppio dell'altezza utile, e lì il rimedio è solo dividere.
          Su desktop due risposte per schermata sono più ariose, non più
          vuote: la tappa riempie comunque lo schermo e il testo è centrato.
          La numerazione prosegue (`i + 1` sull'indice globale), quindi «otto
          risposte» resta vero e chi arriva alla quinta la vede numerata 05. */}
      {[0, 2, 4, 6].map((da) => (
        <section key={da} style={{ paddingBlock: 'var(--s-21)' }}>
        <div className="gabbia gabbia-stretta">
          {DOMANDE.slice(da, da + 2).map((q, iRel) => {
            const i = da + iRel
            return (
            <Reveal key={q.d}>
              <div className="grid gap-[var(--s-21)] py-[var(--s-21)] sm:grid-cols-[2.5rem_1fr]" style={{ borderTop: '1px solid var(--rule)' }}>
                <span className="numero" style={{ paddingTop: 5 }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="text-[1.3rem]">{q.d}</h2>
                  <p className="mt-[var(--s-8)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                    {q.r}
                  </p>
                </div>
              </div>
            </Reveal>
            )
          })}
        </div>
        </section>
      ))}

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello>{t('sicurezzaedati.i_documenti')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
                  {t('sicurezzaedati.girali_al_tuo_consulente_prima_di')}
                </h2>
                <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                  {t('sicurezzaedati.sono_pubblici_non_c_e_un')}
                </p>
                <ul className="mt-[var(--s-34)]">
                  {DOCUMENTI.map((d) => (
                    <li key={d.href} style={{ borderTop: '1px solid var(--rule)' }}>
                      <Link href={d.href} className="block py-[var(--s-13)] group">
                        <span className="flex items-baseline justify-between gap-[var(--s-13)]">
                          <span className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>
                            {d.titolo}
                          </span>
                          <span style={{ color: 'var(--accent)' }}><Freccia /></span>
                        </span>
                        <span className="mt-[2px] block text-[13px]" style={{ color: 'var(--fg-muted)' }}>
                          {d.descr}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="operatrice-guanti"
                alt={t('sicurezzaedati.operatrice_sanitaria_in_camice_bianco_e')}
                proporzione="3 / 4"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Occhiello chiaro>{t('sicurezzaedati.se_trovi_un_problema')}</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
            {t('sicurezzaedati.segnalazioni_di_sicurezza')}
          </h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
            {PRIVACY_EMAIL ? (
              <>
                Se individui una vulnerabilità, scrivi a{' '}
                <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: 'var(--accent-onink)', textDecoration: 'underline' }}>
                  {PRIVACY_EMAIL}
                </a>
                .{' '}
              </>
            ) : (
              <>
                Se individui una vulnerabilità, segnalacela dal{' '}
                <Link href="/richiedi-una-demo" style={{ color: 'var(--accent-onink)', textDecoration: 'underline' }}>
                  modulo di contatto
                </Link>
                .{' '}
              </>
            )}
            {t('sicurezzaedati.rispondiamo_non_minacciamo_e_diciamo_cosa')}
          </p>
        </div>
      </section>
    </Pagina>
  )
}
