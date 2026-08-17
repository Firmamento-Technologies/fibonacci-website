import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'

export const metadata: Metadata = {
  title: t('intelligenzaartificiale.meta_titolo_come_usiamo_l_intelligenza_art'),
  description:
    t('intelligenzaartificiale.meta_descrizione_dove_c_e_un_modello_linguistic'),
  alternates: { canonical: '/intelligenza-artificiale' },
}

/* Pagina di trasparenza sull'IA.
 *
 * Serve a due cose insieme, ed è raro che coincidano così bene:
 *   · al posizionamento — «l'IA non decide niente» è esattamente ciò che un
 *     medico prudente vuole sentirsi dire;
 *   · alla conformità — l'art. 50 dell'AI Act impone di rendere riconoscibile
 *     l'interazione con un sistema di IA, e il cons. 58 ricorda che restare
 *     fuori dall'alto rischio dipende da cosa il sistema decide davvero.
 *
 * Regola per questa pagina: niente futuro. Solo quello che gira adesso. */

const DOVE = [
  {
    titolo: t('intelligenzaartificiale.la_dettatura_dell_anamnesi'),
    cosaFa: 'Trascrive quello che dici durante la visita e propone i campi compilati.',
    cosaNonFa: 'Non salva niente da sola. Ogni campo resta modificabile e il salvataggio è un tuo gesto.',
    chiControlla: 'Tu, prima di salvare.',
  },
  {
    titolo: t('intelligenzaartificiale.la_bozza_di_un_consenso_fuori'),
    cosaFa: 'Costruisce la struttura di un modulo per una procedura che non è fra i modelli pronti.',
    cosaNonFa:
      'Non inventa contenuto clinico spacciandolo per verificato. Il testo esce marcato come bozza e va rivisto prima dell’uso con pazienti reali.',
    chiControlla: 'Il medico, e per il testo clinico il suo legale.',
  },
  {
    titolo: t('intelligenzaartificiale.il_controllo_sulle_allergie'),
    cosaFa:
      'Confronta quello che stai per prescrivere con le allergie registrate in cartella e segnala l’incongruenza.',
    cosaNonFa:
      'Non è intelligenza artificiale: è un confronto deterministico fra due elenchi. Lo scriviamo qui perché venga contato per quello che è, e non per qualcosa di più.',
    chiControlla: 'Il segnale è un avviso, non un blocco. Decidi tu.',
  },
] as const

const MAI = [
  t('intelligenzaartificiale.non_formula_diagnosi_e_nessuna_schermata'),
  t('intelligenzaartificiale.non_consiglia_terapie_dosaggi_o_prodotti'),
  t('intelligenzaartificiale.non_decide_niente_al_posto_tuo'),
  t('intelligenzaartificiale.non_parla_con_i_pazienti_al'),
  t('intelligenzaartificiale.non_addestra_modelli_sui_dati_dei'),
] as const

export default function IntelligenzaArtificiale() {
  return (
    <Pagina
      href="/intelligenza-artificiale"
      occhiello={t('intelligenzaartificiale.trasparenza')}
      titolo={<Enfasi chiave="intelligenzaartificiale.titolo_c_e_dell_intelligenza_artificiale_e" />}
      sommario={t('intelligenzaartificiale.tre_punti_del_prodotto_usano_un')}
    >
      {/* ⚠️ La coda era di px: dentro una tappa lo spazio lo dà già la
          centratura verticale, e quella coda mandava la V sotto il bordo
          (misurato: 1% oltre la schermata, `scripts/altezza-pagine.mjs`). */}
      <section style={{ paddingBottom: 'var(--s-8)' }}>
        <div className="gabbia gabbia-stretta">
          {DOVE.map((d, i) => (
            <Reveal key={d.titolo} className="passo">
              <div className="py-[var(--s-34)]" style={{ borderTop: '1px solid var(--rule)' }}>
                <div className="flex items-baseline gap-[var(--s-13)]">
                  <span className="numero">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-[1.3rem]">{d.titolo}</h2>
                </div>
                <dl className="mt-[var(--s-21)] grid gap-[var(--s-21)] md:grid-cols-3">
                  {[
                    ['Cosa fa', d.cosaFa],
                    ['Cosa non fa', d.cosaNonFa],
                    ['Chi controlla', d.chiControlla],
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

      <section className="scuro fascia">
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello chiaro>{t('intelligenzaartificiale.i_confini')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                  {t('intelligenzaartificiale.cinque_cose_che_non_succedono_mai')}
                </h2>
                <ul className="mt-[var(--s-34)]">
                  {MAI.map((m) => (
                    <li
                      key={m}
                      className="py-[var(--s-13)] text-[1.0625rem]"
                      style={{ borderTop: '1px solid var(--rule-ink)', color: 'var(--on-ink-muted)' }}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="viso-detersione"
                alt={t('intelligenzaartificiale.detersione_del_viso_durante_un_trattamento')}
                proporzione="4 / 3"
                piena
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Occhiello>{t('intelligenzaartificiale.dove_girano_i_dati')}</Occhiello>
          <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
            {t('intelligenzaartificiale.la_domanda_che_conta_davvero')}
          </h2>
          <div className="prosa mt-[var(--s-21)]">
            <p>
              {t('intelligenzaartificiale.un_modello_linguistico_gira_su_server')}
            </p>
            <p>
              {t('intelligenzaartificiale.nessuno_di_questi_passaggi_e_indispensabile')}
            </p>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/sub-responsabili" className="link-avanti">
              {t('intelligenzaartificiale.chi_tratta_i_dati_oltre_a')}
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
