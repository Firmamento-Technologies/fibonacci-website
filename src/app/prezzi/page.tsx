import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { SchedePiani } from '@/components/Listino'
import { Reveal } from '@/components/ui/Reveal'
import { Assistente } from '@/components/Assistente'
import { SoftwareApplicationSchema } from '@/components/StructuredData'
import { Occhiello, Freccia, Foto } from '@/components/ui/elementi'
import { ATTIVAZIONE, ANCORA, CONVIVENZA, RESIDUO } from '@/lib/listino'

export const metadata: Metadata = {
  title: t('prezzi.meta_titolo_prezzi'),
  description:
    t('prezzi.meta_descrizione_tre_piani_solo_a_129_euro'),
  alternates: { canonical: '/prezzi' },
}

/* Il listino.
 *
 * CXL, sulle pagine prezzi: semplice batte astuto, e la prima domanda da
 * farsi è «come lo rendo più facile da capire». Tre piani, tre colonne, e
 * l'elenco di cosa NON è compreso subito sotto, perché è la parte che il
 * compratore prudente cerca e non trova mai. */

const NON_COMPRESO = [
  {
    voce: t('prezzi.firma_elettronica_qualificata'),
    perche:
      t('prezzi.la_firma_della_paziente_oggi_e'),
  },
  {
    voce: t('prezzi.conservazione_a_norma'),
    perche:
      t('prezzi.la_conservazione_sostitutiva_richiede_un_conservatore'),
  },
  {
    voce: t('prezzi.invio_al_sistema_tessera_sanitaria_e'),
    perche:
      t('prezzi.non_li_facciamo_se_ti_serve'),
  },
]

export default function Prezzi() {
  return (
    <Pagina
      href="/prezzi"
      occhiello={t('prezzi.prezzi')}
      titolo={<Enfasi chiave="prezzi.titolo_tre_piani_e_l_elenco_di" />}
      sommario={t('prezzi.prezzi_per_studio_iva_esclusa_nessun')}
      larga
    >
      {/* ⚠️ Tenuto QUI di proposito: i risultati arricchiti di /prezzi oggi
          funzionano, e la correzione di TD-96 non doveva toglierli — le offerte
          sono il contenuto di questa pagina, non una dichiarazione di sfondo. */}
      <SoftwareApplicationSchema />
      {/* ⚠️ Padding ridotto (era s-55): l'intro pesava 327px e insieme alle
          schede portava la decisione sul prezzo a 1350px, cioè fuori dalla
          prima schermata. Su una pagina di listino la cosa che deve stare
          sopra la piega sono i tre prezzi, non il titolo. */}
      <section style={{ paddingBottom: 'var(--s-13)' }}>
        {/* ⚠️ Larghezza piena, non 52rem, e la ragione è misurata.
            Con `maxWidth: 52rem` il contenitore stava in **832px per TRE
            schede** ⇒ ogni scheda 241px, e **5 voci su 7 andavano a capo**: la
            lista faceva 396px e la scheda 730. Il testo non era lungo — era la
            colonna a essere stretta. 52rem è una misura da PROSA (una colonna
            di testo si legge meglio corta); un confronto a tre colonne vuole
            l'opposto, e la `gabbia` normale del sito è 75rem.
            ⛔ Non rimetterla senza rimisurare l'altezza della scheda. */}
        <div className="gabbia">
          <SchedePiani />
        </div>
      </section>

      {/* Cosa comprende l'attivazione */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <div>
                <Occhiello>{t('prezzi.attivazione')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '16ch' }}>
                  {t('prezzi.compreso_nel_prezzo_non_a_preventivo')}
                </h2>
                <ul className="mt-[var(--s-34)]">
                  {ATTIVAZIONE.map((v) => (
                    <li
                      key={v}
                      className="py-[var(--s-13)] text-[1.0625rem]"
                      style={{ borderTop: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal da="destra">
              <Foto
                nome="consulto-studio"
                alt={t('prezzi.due_professioniste_sedute_con_una_cliente')}
                proporzione="4 / 3"
                didascalia="La configurazione dello studio la facciamo noi, con te."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cosa NON è compreso — la sezione che vale la pagina */}
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>{t('prezzi.quello_che_non_c_e')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {t('prezzi.tre_cose_che_altri_mettono_nel')}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {t('prezzi.rientrano_il_giorno_in_cui_saranno')}
            </p>
          </Reveal>

          <div className="passo mt-[var(--s-34)]">
            {NON_COMPRESO.map((n) => (
              <Reveal key={n.voce}>
                <div className="py-[var(--s-21)]" style={{ borderTop: '1px solid var(--rule)' }}>
                  <h3 className="text-[1.0625rem]">{n.voce}</h3>
                  <p className="mt-[var(--s-8)] text-[15px]" style={{ color: 'var(--fg-muted)' }}>
                    {n.perche}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* La convivenza col portale: è un'obiezione di spesa, quindi sta qui e
          non in una pagina di prodotto. Precede l'ancora perché prima si
          sgombera il campo dal doppione, poi si dice con che cosa si confronta. */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta">
          <Reveal className="passo">
            <Occhiello>{t('prezzi.se_paghi_gia_un_portale')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {CONVIVENZA.titolo}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {CONVIVENZA.testo}
            </p>
          </Reveal>

          {/* `passo`: sul telefono la lista prende una schermata sua, separata
              dal titolo che la introduce.
              Un solo Reveal FUORI dalla lista: avvolgendo ogni <li> si infila un
              <div> dentro la <ul>, e il collaudo lo segna come violazione WCAG
              serious (due regole, «list» e «listitem»). Stessa forma della
              lista Attivazione qui sopra. */}
          <Reveal className="passo">
            <ul className="mt-[var(--s-34)]">
              {CONVIVENZA.righe.map((r) => (
                <li
                  key={r}
                  className="py-[var(--s-13)] text-[1.0625rem]"
                  style={{ borderTop: '1px solid var(--rule)', color: 'var(--fg-muted)' }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Dentro il passo dell'elenco, non dopo: da sola questa nota è
              155px che restavano fuori da ogni passo, e sul telefono facevano
              cominciare la tappa dopo un quinto di schermata più in basso.
              È anche il posto giusto — commenta l'elenco che la precede. */}
          <Reveal className="passo">
            <p
              className="mt-[var(--s-21)] text-[15px]"
              style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--s-13)' }}
            >
              {CONVIVENZA.cautela}
            </p>
            <p className="mt-[var(--s-21)]">
              <Link href="/che-software-serve" className="link-avanti">
                Portale, gestionale o cartella verticale: le tre categorie a confronto
                <Freccia />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Il residuo del contratto altrove. Sta fra la convivenza e l'ancora
          perché è l'ultima obiezione di spesa rimasta in piedi: la convivenza
          toglie il sospetto del doppione, questa toglie il costo di uscita, e
          solo dopo ha senso dire con che cosa si confronta il prezzo. */}
      <section className="fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello>{t('prezzi.se_sei_sotto_contratto')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '18ch' }}>
              {RESIDUO.titolo}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
              {RESIDUO.testo}
            </p>
          </Reveal>
        </div>
      </section>

      {/* L'ancora del prezzo */}
      <section className="scuro fascia">
        <div className="gabbia gabbia-stretta">
          <Reveal>
            <Occhiello chiaro>{t('prezzi.con_che_cosa_si_confronta')}</Occhiello>
            <h2 className="mt-[var(--s-13)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch' }}>
              {ANCORA.titolo}
            </h2>
            <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--on-ink-muted)' }}>
              {ANCORA.testo}
            </p>
            <p
              className="mt-[var(--s-21)] text-[15px]"
              style={{ color: 'var(--on-ink)', borderLeft: '2px solid var(--accent-onink)', paddingLeft: 'var(--s-13)' }}
            >
              {ANCORA.cautela}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ⚠️ QUI e non altrove, ed e' una misura. Le domande che si fanno
          guardando un listino sono «che differenza c'e' fra Studio e Clinica?»,
          «cosa comprende il piano Solo?», «l'IVA e' inclusa?» — e prima
          dell'indizio della pagina l'assistente pescava `/prezzi/` solo **7
          volte su 12** proprio su quelle. Il widget manda il percorso su cui
          si trova, quindi questa pagina entra sempre fra gli estratti: 12/12.
          Vedi `estratti_pertinenti` in `EMR/services/assistente/main.py`.
          ⇒ Sta PRIMA della richiesta di demo: chi non ha capito quale piano fa
          per lui non prenota, chiude. */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia gabbia-stretta text-center">
          <Occhiello>{t('prezzi.prima_di_scegliere')}</Occhiello>
          <h2 className="mt-[var(--s-21)] text-[length:var(--display-2)]" style={{ maxWidth: '20ch', marginInline: 'auto' }}>
            {t('prezzi.se_la_tua_situazione_non_rientra')}
          </h2>
          <p
            className="mt-[var(--s-21)] text-[1.0625rem]"
            style={{ color: 'var(--fg-muted)', maxWidth: '52ch', marginInline: 'auto' }}
          >
            {/* ⚠️ Corta di una riga rispetto alla prima stesura, e non per gusto:
                su 375px la sezione arrivava a **783px contro i 770** di una
                schermata utile, e `altezza-pagine.mjs` la contava come passo
                alto. Due esempi su tre bastano, e il resto lo dice il widget. */}
            Due sedi ma un medico solo, una segretaria che non visita. Chiedi pure: se la
            risposta non c&apos;è, lo dice.
          </p>
          <div className="mt-[var(--s-34)]">
            <Assistente />
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">{t('prezzi.vuoi_vederlo_prima_di_decidere')}</h2>
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            {t('prezzi.mezz_ora_sulle_procedure_che_fai')}
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/richiedi-una-demo" className="btn btn-primario">
              {t('prezzi.richiedi_una_demo')}
            </Link>
            <Link href="/domande" className="btn btn-secondario">
              {t('prezzi.leggi_le_domande_frequenti')}
            </Link>
          </div>
          <p className="mt-[var(--s-34)]">
            <Link href="/sicurezza-e-dati" className="link-avanti">
              Dove stanno i dati, e cosa succede se smetti
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
