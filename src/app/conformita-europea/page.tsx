import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Bollini } from '@/components/Bollini'
import { Occhiello, Freccia } from '@/components/ui/elementi'
import { BOLLINI } from '@/lib/bollini'

export const metadata: Metadata = {
  title: t('conformitaeuropea.meta_titolo_conformita_europea'),
  description:
    t('conformitaeuropea.meta_descrizione_dove_stanno_i_dati_chi_ne'),
  alternates: { canonical: '/conformita-europea' },
}

/* La pagina del valore legale europeo.
 *
 * ⚠️ REGOLA DI SCRITTURA, ereditata da `/sicurezza-e-dati` e qui più stretta:
 * ogni riga deve essere **verificabile o contestabile da un terzo**. Su una
 * pagina che parla di conformità la tentazione è la formula vuota («pienamente
 * conforme al GDPR», «massimi standard europei»): sono affermazioni che non si
 * possono né provare né smentire, e un consulente le legge come rumore.
 *
 * 🔑 E la parte che rende credibile il resto sono le **due garanzie che non
 * abbiamo**, dichiarate qui con lo stesso rilievo delle altre sette. Un
 * elenco di sole vittorie si legge come pubblicità; un elenco che contiene i
 * propri buchi si legge come un documento.
 *
 * ⛔ Nessun marchio, sigillo o logo di ente terzo è disegnato in questa
 * pagina. La marcatura CE prevista dal regolamento EHDS **non è oggi
 * apponibile da nessuno**, e disegnarne una somiglianza sarebbe l'esatto
 * illecito che la pagina rimprovera ai concorrenti.
 */

/* Il regolamento EHDS: le date e gli articoli, presi dal testo pubblicato in
 * Gazzetta e non da una sintesi.
 * Reg. (UE) 2025/327 — artt. 37, 38, 39, 40, 41, 49 e art. 105 per le date. */
const PASSAGGI_EHDS = [
  {
    a: t('conformitaeuropea.art_37'),
    t: t('conformitaeuropea.documentazione_tecnica'),
    d: t('conformitaeuropea.il_fabbricante_la_redige_prima_di'),
  },
  {
    a: t('conformitaeuropea.art_39'),
    t: t('conformitaeuropea.dichiarazione_di_conformit_ue'),
    d: t('conformitaeuropea.attesta_il_rispetto_delle_prescrizioni_essenziali'),
  },
  {
    a: t('conformitaeuropea.art_40'),
    t: t('conformitaeuropea.ambiente_digitale_europeo_di_prova'),
    d: t('conformitaeuropea.i_componenti_software_armonizzati_vanno_valutati'),
  },
  {
    a: t('conformitaeuropea.art_41'),
    t: t('conformitaeuropea.marcatura_ce_di_conformit'),
    d: t('conformitaeuropea.apposta_in_modo_visibile_leggibile_e'),
  },
] as const

/* Le prescrizioni dell'Allegato II che NON dipendono dagli atti di esecuzione:
 * su queste una risposta oggi è possibile, e quindi dovuta. */
const ALLEGATO_II = [
  {
    n: '2.6',
    t: t('conformitaeuropea.uscire_non_deve_essere_gravoso'),
    d: t('conformitaeuropea.niente_caratteristiche_che_rendano_gravosa_l'),
    stato: 'Soddisfatta',
    come: t('conformitaeuropea.l_export_integrale_in_fhir_r4'),
  },
  {
    n: '3.1',
    t: t('conformitaeuropea.identificare_chi_entra'),
    d: t('conformitaeuropea.meccanismi_affidabili_di_identificazione_e_autenticazione'),
    stato: 'Soddisfatta',
    come: t('conformitaeuropea.secondo_fattore_sessione_irrigidita_ruoli_separa'),
  },
  {
    n: '3.2 e 3.3',
    t: t('conformitaeuropea.registrare_gli_accessi_e_poterli_esamina'),
    d: t('conformitaeuropea.registrazione_di_ogni_evento_di_accesso'),
    stato: 'Soddisfatta',
    come: t('conformitaeuropea.registro_fhir_auditevent_legato_da_una'),
  },
  {
    n: '3.4',
    t: t('conformitaeuropea.conservazioni_e_accessi_differenziati'),
    d: t('conformitaeuropea.periodi_di_conservazione_e_diritti_di'),
    stato: 'Parziale',
    come: t('conformitaeuropea.la_conservazione_differenziata_e_attiva_la'),
  },
] as const

export default function ConformitaEuropea() {
  return (
    <Pagina
      href="/conformita-europea"
      occhiello={t('conformitaeuropea.conformita_europea')}
      titolo={<Enfasi chiave="conformitaeuropea.titolo_nove_garanzie_e_accanto_a_ognuna" />}
      sommario={t('conformitaeuropea.due_riguardano_cose_che_non_abbiamo')}
    >
      {/* ── I bollini, tre per schermata ─────────────────────────────────
          ⚠️ Tre e non nove: nove riquadri impilati su un telefono fanno
          quattro schermate, e il cancello `scripts/altezza-pagine.mjs`
          boccia le tappe fuori misura. Il taglio è per argomento, non per
          conteggio: dove sta il dato · che cosa puoi farci · che cosa ci
          manca. */}
      <section style={{ paddingBlock: 'var(--s-21)' }}>
        <div className="gabbia">
          <Reveal>
            <Occhiello>{t('conformitaeuropea.dove_sta_il_dato_e_chi')}</Occhiello>
          </Reveal>
          <div className="mt-[var(--s-21)]">
            <Bollini ids={BOLLINI.slice(0, 3).map((b) => b.id)} />
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <Reveal>
            <Occhiello>{t('conformitaeuropea.che_cosa_puoi_farci')}</Occhiello>
          </Reveal>
          <div className="mt-[var(--s-21)]">
            <Bollini ids={BOLLINI.slice(3, 6).map((b) => b.id)} />
          </div>
        </div>
      </section>

      <section style={{ paddingBlock: 'var(--s-21)' }}>
        <div className="gabbia">
          {/* `passo` sull'intestazione, come in «Come si controlla»: senza,
              il cancello misurava 154px fuori dai passi e su telefono il
              ritmo slittava di un quinto di schermata. Questa intestazione
              regge da sola, che è la condizione per marcarla. */}
          <Reveal className="passo">
            <Occhiello>{t('conformitaeuropea.quello_che_non_facciamo_e_quello')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-3)]" style={{ maxWidth: '40ch' }}>
              {t('conformitaeuropea.un_elenco_di_sole_vittorie_non')}
            </h2>
          </Reveal>
          <div className="mt-[var(--s-21)]">
            <Bollini ids={BOLLINI.slice(6).map((b) => b.id)} />
          </div>
        </div>
      </section>

      {/* ── EHDS: l'obbligo che arriva ──────────────────────────────────── */}
      <section className="scuro fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal className="passo">
              <div>
                <Occhiello chiaro>{t('conformitaeuropea.il_regolamento_che_cambia_le_carte')}</Occhiello>
                <h2
                  className="mt-[var(--s-13)] text-[length:var(--display-2)]"
                  style={{ maxWidth: '18ch' }}
                >
                  Dal 2029 una cartella clinica dovrà essere{' '}
                  <span className="accento-corsivo">marcata CE</span>
                </h2>
                <div
                  className="mt-[var(--s-21)] space-y-[var(--s-13)] text-[1.0625rem]"
                  style={{ color: 'var(--on-ink-muted)', maxWidth: '46ch' }}
                >
                  <p>
                    Il Regolamento (UE) 2025/327 istituisce lo spazio europeo dei dati sanitari e
                    detta un quadro armonizzato per i sistemi di cartelle cliniche elettroniche. Si
                    applica dal <strong style={{ color: 'var(--on-ink)' }}>26 marzo 2027</strong>, e
                    dal <strong style={{ color: 'var(--on-ink)' }}>26 marzo 2029</strong> per i
                    sistemi destinati alle categorie prioritarie di dati sanitari.
                  </p>
                  <p>
                    {t('conformitaeuropea.non_e_una_formalita_da_ufficio')}
                  </p>
                  <p style={{ color: 'var(--on-ink)' }}>Oggi la marcatura<strong>non è apponibile da nessuno</strong>: mancano gli atti
                    di esecuzione della Commissione sull’ambiente di prova e sul formato europeo di
                    scambio. Se un fornitore te la dichiara adesso, ti sta dicendo qualcosa su di sé.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal da="destra" className="passo">
              <div className="foglio">
                <p className="numero">{t('conformitaeuropea.reg_ue_2025_327_capo_iii')}</p>
                <dl className="mt-[var(--s-21)]">
                  {PASSAGGI_EHDS.map((p) => (
                    <div
                      key={p.a}
                      className="grid gap-[var(--s-8)] py-[var(--s-13)] sm:grid-cols-[5.5rem_1fr]"
                      style={{ borderTop: '1px solid var(--rule-ink)' }}
                    >
                      <dt className="numero" style={{ paddingTop: 3, color: 'var(--accent-onink)' }}>
                        {p.a}
                      </dt>
                      <dd>
                        <span className="text-[15px]" style={{ color: 'var(--on-ink)' }}>
                          {p.t}
                        </span>
                        <span
                          className="mt-[3px] block text-[13px]"
                          style={{ color: 'var(--on-ink-muted)' }}
                        >
                          {p.d}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Allegato II: dove siamo già, voce per voce ──────────────────── */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>{t('conformitaeuropea.misurato_non_promesso')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '22ch' }}>
              {t('conformitaeuropea.le_prescrizioni_su_cui_una_risposta')}
            </h2>
            <p className="mt-[var(--s-13)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)', maxWidth: 'var(--measure)' }}>
              {t('conformitaeuropea.quattro_requisiti_dell_allegato_ii_non')}
            </p>
          </Reveal>

          <dl className="mt-[var(--s-21)]">
            {/* ⚠️ `Reveal` È la cella della lista, ⛔ non un involucro attorno
                a un altro `<div>`: con due div annidati i `<dt>`/`<dd>`
                diventano nipoti del `<dl>`, e la specifica ne ammette **uno**
                solo. Il collaudo l'ha preso come difetto «serious» su 8 nodi
                (4 righe × dt+dd), e non si vedeva a video: una lista di
                definizioni malformata è rotta per chi la legge con uno
                screen reader e identica per tutti gli altri. */}
            {ALLEGATO_II.map((r) => (
              <Reveal
                key={r.n}
                className="passo grid gap-[var(--s-8)] py-[var(--s-13)] sm:grid-cols-[4.5rem_1fr] border-t border-[var(--rule)]"
              >
                  <dt className="numero" style={{ paddingTop: 4 }}>
                    {r.n}
                  </dt>
                  <dd>
                    <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-8)]">
                      <span className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>
                        {r.t}
                      </span>
                      <span
                        className="numero"
                        style={{ color: r.stato === 'Soddisfatta' ? 'var(--accent)' : 'var(--fg-muted)' }}
                      >
                        {r.stato}
                      </span>
                    </div>
                    <p className="mt-[var(--s-5)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                      {r.d}{' '}
                      <span style={{ color: 'var(--accent)' }}>{t('conformitaeuropea.come')}</span> {r.come}
                    </p>
                  </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── L'uscita come dovere deontologico ───────────────────────────── */}
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>{t('conformitaeuropea.non_e_una_nostra_gentilezza')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '24ch' }}>Poter portare via i dati è un tuo<span className="accento-corsivo">dovere</span>, non
              una nostra concessione
            </h2>
            <div
              className="mt-[var(--s-21)] space-y-[var(--s-13)] text-[1.0625rem]"
              style={{ color: 'var(--fg-muted)', maxWidth: 'var(--measure)' }}
            >
              <p>
                Gli indirizzi applicativi allegati all’art. 78 del codice di deontologia medica
                chiedono al medico di usare sistemi affidabili e di{' '}
                <strong style={{ color: 'var(--fg)' }}>
                  privilegiare i servizi che consentano la creazione di un formato indipendente
                  rispetto alla piattaforma
                </strong>
                , senza che sia impedito il riuso dell’informazione, assicurandone disponibilità,
                riservatezza e modalità di conservazione.
              </p>
              <p>
                {t('conformitaeuropea.detto_altrimenti_scegliere_un_gestionale_da')}
              </p>
              <p>
                {t('conformitaeuropea.per_questo_l_esportazione_qui_e')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── I documenti ─────────────────────────────────────────────────── */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>{t('conformitaeuropea.da_girare_al_consulente')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {t('conformitaeuropea.tutto_pubblico_senza_un_modulo_da')}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)', maxWidth: 'var(--measure)' }}>
              {t('conformitaeuropea.un_fornitore_che_nasconde_il_contratto')}
            </p>
            <ul className="mt-[var(--s-34)]">
              {[
                {
                  href: '/dpa',
                  t: t('sicurezzaedati.accordo_sul_trattamento_dei_dati'),
                  d: t('conformitaeuropea.l_art_28_fra_te_titolare'),
                },
                {
                  href: '/sub-responsabili',
                  t: t('chrome.footer.sub_responsabili'),
                  d: t('conformitaeuropea.chi_tocca_i_dati_oltre_a'),
                },
                {
                  href: '/sicurezza',
                  t: t('sicurezzaedati.misure_di_sicurezza'),
                  d: t('conformitaeuropea.la_scheda_ex_art_32_compresi'),
                },
                {
                  href: '/sicurezza-e-dati',
                  t: t('conformitaeuropea.le_otto_domande'),
                  d: t('conformitaeuropea.le_risposte_brevi_senza_rassicurazioni_generiche'),
                },
              ].map((d) => (
                <li key={d.href} style={{ borderTop: '1px solid var(--rule)' }}>
                  <Link href={d.href} className="block py-[var(--s-13)] group">
                    <span className="flex items-baseline justify-between gap-[var(--s-13)]">
                      <span className="text-[1.0625rem]" style={{ fontFamily: 'var(--font-display)' }}>
                        {d.t}
                      </span>
                      <span style={{ color: 'var(--accent)' }}>
                        <Freccia />
                      </span>
                    </span>
                    <span className="mt-[2px] block text-[13px]" style={{ color: 'var(--fg-muted)' }}>
                      {d.d}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </Pagina>
  )
}
