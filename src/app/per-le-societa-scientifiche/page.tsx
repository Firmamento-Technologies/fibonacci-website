import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { ModuloDemo } from '@/components/ModuloDemo'
import { Reveal } from '@/components/ui/Reveal'
import { raggruppa } from '@/lib/raggruppa'
import { Occhiello, Freccia } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: t('perlesocietascientifiche.meta_titolo_per_le_societa_scientifiche_di'),
  description:
    t('perlesocietascientifiche.meta_descrizione_che_cosa_proponiamo_a_una_soci'),
  alternates: { canonical: '/per-le-societa-scientifiche' },
}

/* Una pagina-offerta, non una pagina-partner.
 *
 * ⚠️ NESSUNA SOCIETÀ È NOMINATA, ed è deliberato. Su una pagina che parla di
 * convenzioni, il nome di una società con cui non c'è un accordo firmato
 * suggerisce un rapporto che non esiste. I nomi dei possibili interlocutori
 * stanno nel piano interno, non qui.
 *
 * ⚠️ E NESSUN LOGO, per la stessa ragione. Il giorno che ci sarà una
 * convenzione vera avrà la sua pagina, con il nome e con la data.
 *
 * Le tre regole della sezione «Le regole che ci diamo» non sono una posa:
 * vengono dall'analisi interna su comparaggio e conflitto di interessi
 * (`EMR/docs/legal/memo-questioni-residue.md` §2), che si appoggia agli artt.
 * 30 e 31 del Codice di deontologia medica. La distinzione che regge il
 * ragionamento è che un software gestionale non è un atto professionale verso
 * il paziente; il confine si sposterebbe se il prodotto diventasse un
 * dispositivo medico. Se quel giorno arriva, questa pagina va riscritta, non
 * ritoccata. */

const OFFRIAMO = [
  {
    titolo: t('perlesocietascientifiche.i_modelli_di_consenso_rivisti_da'),
    testo:
      t('perlesocietascientifiche.abbiamo_un_catalogo_di_moduli_scritti'),
    perNoi: 'Per noi è la cosa che vale di più: chiude una debolezza che oggi dichiariamo.',
  },
  {
    titolo: t('perlesocietascientifiche.condizioni_riservate_agli_iscritti'),
    testo:
      t('perlesocietascientifiche.il_listino_e_pubblico_e_resta'),
    perNoi: 'Nessuna cifra qui: sarebbe un numero inventato prima di conoscere l’interlocutore.',
  },
  {
    titolo: t('perlesocietascientifiche.formazione_ai_soci_sulle_cose_noiose'),
    testo:
      t('perlesocietascientifiche.non_un_webinar_di_prodotto_mezz'),
    perNoi: 'Non siamo un provider ECM e non lo promettiamo.',
  },
  {
    titolo: t('perlesocietascientifiche.un_canale_per_dirci_che_cosa'),
    testo:
      t('perlesocietascientifiche.chi_vede_cento_studi_sa_quello'),
    perNoi: 'Senza promesse di priorità che poi non manteniamo.',
  },
] as const

const REGOLE = [
  {
    titolo: t('perlesocietascientifiche.niente_che_dipenda_da_quanti_pazienti'),
    testo:
      t('perlesocietascientifiche.se_un_giorno_ci_fosse_un'),
  },
  {
    titolo: t('perlesocietascientifiche.trasparenza_e_possibilita_di_dichiararla'),
    testo:
      t('perlesocietascientifiche.il_codice_deontologico_chiede_al_medico'),
  },
  {
    titolo: t('perlesocietascientifiche.nessun_avallo_clinico_in_cambio_di'),
    testo:
      t('perlesocietascientifiche.una_societa_puo_rivedere_un_testo'),
  },
] as const

export default function PerLeSocietaScientifiche() {
  return (
    <Pagina
      href="/per-le-societa-scientifiche"
      occhiello="Società scientifiche"
      titolo={
        <>
          Quello che possiamo fare <span className="accento-corsivo">insieme</span>, e a quali
          condizioni
        </>
      }
      sommario={
        <>
          {t('perlesocietascientifiche.questa_pagina_e_un_offerta_non')}
        </>
      }
    >
      {/* Prima cosa, la più scomoda. */}
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>{t('perlesocietascientifiche.dove_siamo')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '22ch' }}>
              {t('perlesocietascientifiche.oggi_non_c_e_nessuna_convenzione')}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('perlesocietascientifiche.nessuna_e_nessun_logo_da_mostrare')}
            </p>
            <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
              {t('perlesocietascientifiche.se_stai_leggendo_per_conto_di')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>{t('perlesocietascientifiche.che_cosa_offriamo')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {t('perlesocietascientifiche.quattro_cose_in_ordine_di_quanto')}
            </h2>
          </Reveal>
          {/* 2 voci per schermata sul telefono; su desktop il gruppo è un
              `<div>` trasparente e l'elenco resta identico. */}
          <div className="mt-[var(--s-34)]">
            {raggruppa(OFFRIAMO, 2).map((gruppo, g) => (
            <div key={g} className="passo">
            {gruppo.map((o) => (
              <Reveal key={o.titolo}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{o.titolo}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {o.testo}
                  </p>
                  <p className="mt-[var(--s-8)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
                    {o.perNoi}
                  </p>
                </div>
              </Reveal>
            ))}
            </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>{t('perlesocietascientifiche.che_cosa_chiediamo')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {t('perlesocietascientifiche.una_persona_che_risponda_e_tempo')}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('perlesocietascientifiche.un_referente_con_cui_parlare_e')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello chiaro>{t('perlesocietascientifiche.le_regole_che_ci_diamo')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '22ch' }}>
              {t('perlesocietascientifiche.perche_una_convenzione_non_diventi_un')}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
              {t('perlesocietascientifiche.il_codice_di_deontologia_medica_vieta')}
            </p>
          </Reveal>
          <div className="mt-[var(--s-34)]">
            {REGOLE.map((r) => (
              <Reveal className="passo" key={r.titolo}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule-ink)' }}>
                  <h3 className="text-[1.0625rem]" style={{ color: 'var(--on-ink)' }}>{r.titolo}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--on-ink-muted)' }}>
                    {r.testo}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>{t('perlesocietascientifiche.quello_che_non_facciamo')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {t('perlesocietascientifiche.tre_richieste_a_cui_diciamo_di')}
            </h2>
            <ul className="mt-[var(--s-34)]">
              {[
                'Pagare per essere raccomandati agli iscritti.',
                'Mettere un logo su questo sito senza un accordo scritto e in corso.',
                'Legare qualunque riconoscimento al numero di prestazioni o di pazienti.',
              ].map((v) => (
                <li
                  key={v}
                  className="py-[var(--s-13)] text-[1.0625rem]"
                  style={{ borderTop: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                >
                  {v}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia" style={{ maxWidth: '38rem' }}>
          <Reveal className="passo">
            <ModuloDemo variante="societa" />
          </Reveal>
          <p className="mt-[var(--s-34)] text-center">
            <Link href="/consensi-informati" className="link-avanti">
              Che cosa deve contenere un consenso, secondo noi
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
