import { Enfasi } from '@/components/ui/Enfasi'
import { t } from '@/lib/testo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Pagina } from '@/components/chrome/Pagina'
import { Reveal } from '@/components/ui/Reveal'
import { Occhiello, Schermata, Foto, Freccia } from '@/components/ui/elementi'
import { ProvaSezioniCartella } from '@/components/home/ProvaSezioniCartella'
import { ProvaCatalogoConsensi } from '@/components/home/ProvaCatalogoConsensi'
import { ProvaDurate } from '@/components/home/ProvaDurate'
import { DEMO_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: t('comefunziona.meta_titolo_come_funziona'),
  description:
    t('comefunziona.meta_descrizione_una_giornata_di_studio_dentro_'),
  alternates: { canonical: '/come-funziona' },
}

/* La pagina prodotto.
 *
 * È organizzata come una giornata invece che come un elenco di funzioni,
 * perché è così che il medico decide se il software gli serve: non guarda
 * la lista delle voci di menu, guarda se il suo mercoledì funziona meglio.
 * Ogni passo ha una schermata vera: Baymard misura che le rappresentazioni
 * grafiche dell'interfaccia rendono peggio degli screenshot. */

const PASSI = [
  {
    ora: '08:40',
    occhiello: t('comefunziona.prima_che_arrivi'),
    titolo: t('comefunziona.la_giornata_e_gia_in_ordine'),
    testo:
      t('comefunziona.l_agenda_dello_studio_mostra_chi'),
    schermata: '/schermate/agenda.png',
    alt: "L'agenda settimanale di Fibonacci con gli appuntamenti distribuiti sui giorni.",
  },
  {
    ora: '09:05',
    occhiello: t('comefunziona.in_poltrona'),
    titolo: t('comefunziona.l_anamnesi_si_scrive_mentre_parli'),
    testo:
      t('comefunziona.detti_e_i_campi_si_riempiono'),
    /* 🔄 Era la cartella INTERA — la stessa immagine bocciata nel primo
       schermo perché a quella dimensione non si legge. La domanda vera non è
       «com'è fatta» ma «dove finisce quello che scrivo». */
    prova: 'sezioni',
    alt: t('comefunziona.la_cartella_di_una_paziente_in'),
  },
  {
    ora: '09:20',
    occhiello: t('comefunziona.il_consenso'),
    titolo: t('comefunziona.il_modulo_giusto_non_il_modulo'),
    testo:
      t('comefunziona.scegli_la_procedura_e_il_modulo'),
    prova: 'catalogo',
    alt: t('comefunziona.il_catalogo_dei_consensi_di_fibonacci'),
  },
  {
    ora: '09:35',
    occhiello: t('comefunziona.la_seduta'),
    titolo: t('comefunziona.dove_quanto_con_che_lotto'),
    testo:
      t('comefunziona.le_aree_si_segnano_sulla_mappa'),
    /* 🔄 La cosa che una figura non può mostrare: da DOVE viene la data del
       richiamo — dalla frase del consenso, non da una tabella nostra. */
    prova: 'durate',
    alt: "L'elenco dei trattamenti di una paziente: prodotto e unità nel titolo di ogni seduta, la data, e la nota tecnica del medico: diluizione, numero di punti, reazioni.",
  },
  {
    ora: '20:15',
    occhiello: t('comefunziona.a_studio_chiuso'),
    titolo: t('comefunziona.chi_ha_aperto_cosa_e_perche'),
    testo:
      t('comefunziona.il_registro_raccoglie_ogni_accesso_un'),
    schermata: '/schermate/registro-accessi.png',
    alt: t('comefunziona.il_registro_accessi_con_tre_righe'),
  },
] as const

export default function ComeFunziona() {
  return (
    <Pagina
      href="/come-funziona"
      occhiello={t('comefunziona.il_prodotto')}
      titolo={<Enfasi chiave="comefunziona.titolo_un_mercoledi_qualunque_dentrofibonacci" />}
      sommario={t('comefunziona.cinque_momenti_di_una_giornata_di')}
      larga
    >
      {/* ⚠️ UNA SEZIONE PER MOMENTO, non una sezione con dentro cinque momenti.
          I cinque erano in colonna dentro un'unica sezione: **2.420px, il 299%
          di una schermata**. La pagina si chiama «un mercoledì qualunque» e
          racconta una giornata per momenti — averli uno per schermata è anche
          più fedele di quanto fossero prima. Nessuna parola cambiata: è la
          stessa `PASSI.map`, con la sezione spostata dentro il ciclo. */}
      {PASSI.map((p, i) => (
        <section className="fascia" key={p.ora}>
          <div className="gabbia">
            <div>
              <Reveal>
                <div className={`aurea ${i % 2 === 1 ? 'aurea-inversa' : ''}`}>
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-baseline gap-[var(--s-13)]">
                      <span
                        className="numero"
                        style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: '0.06em' }}
                      >
                        {p.ora}
                      </span>
                      <Occhiello>{p.occhiello}</Occhiello>
                    </div>
                    <h2 className="mt-[var(--s-13)] text-[length:var(--display-3)]" style={{ maxWidth: '16ch' }}>
                      {p.titolo}
                    </h2>
                    <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                      {p.testo}
                    </p>
                  </div>
                  {'prova' in p ? (
                    <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                      {p.prova === 'sezioni' && <ProvaSezioniCartella />}
                      {p.prova === 'catalogo' && <ProvaCatalogoConsensi />}
                      {p.prova === 'durate' && <ProvaDurate />}
                    </div>
                  ) : (
                    <Schermata file={p.schermata} alt={p.alt} className={i % 2 === 1 ? 'lg:order-1' : ''} />
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* Le foto cliniche meritano una fermata a parte */}
      <section className="fascia" style={{ background: 'var(--bg-sunk)' }}>
        <div className="gabbia">
          <div className="aurea">
            <Reveal>
              <Foto
                nome="filler-labbra"
                alt={t('comefunziona.primo_piano_di_un_iniezione_di')}
                proporzione="4 / 3"
              />
            </Reveal>
            <Reveal da="destra">
              <div>
                <Occhiello>{t('comefunziona.foto_cliniche')}</Occhiello>
                <h2 className="mt-[var(--s-13)] text-[length:var(--display-3)]" style={{ maxWidth: '16ch' }}>
                  {t('comefunziona.il_prima_e_dopo_non_sta')}
                </h2>
                <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
                  {t('comefunziona.le_fotografie_si_scattano_dall_applicazione')}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="fascia">
        <div className="gabbia gabbia-stretta text-center">
          <h2 className="text-[length:var(--display-2)]">
            {DEMO_URL ? t('comefunziona.provalo_o_fattelo_mostrare') : t('comefunziona.fattelo_mostrare')}
          </h2>
          {/* ⚠️ Legata a DEMO_URL: senza demo, dire «la demo è aperta e non
              chiede registrazione» è falso — il solo percorso è un modulo che
              la registrazione la chiede. Vedi la nota in Hero.tsx. */}
          <p className="mt-[var(--s-21)] text-[1.0625rem]" style={{ color: 'var(--fg-muted)' }}>
            {DEMO_URL
              ? t('comefunziona.la_demo_e_aperta_e_non')
              : t('comefunziona.mezz_ora_sulle_tue_procedure_coi')}
          </p>
          <div className="mt-[var(--s-34)] flex flex-wrap justify-center gap-[var(--s-13)]">
            <Link href="/richiedi-una-demo" className="btn btn-primario">
              {t('comefunziona.richiedi_una_demo')}
            </Link>
            {DEMO_URL && (
              <a href={DEMO_URL} className="btn btn-secondario" rel="noopener">
                {t('comefunziona.entra_nella_demo')}
              </a>
            )}
          </div>
          <p className="mt-[var(--s-21)] text-[13px]" style={{ color: 'var(--fg-faint)' }}>
            {t('comefunziona.la_demo_contiene_dati_finti_non')}
          </p>
          <p className="mt-[var(--s-34)]">
            <Link href="/prezzi" className="link-avanti">
              {t('comefunziona.quanto_costa')}
              <Freccia />
            </Link>
          </p>
        </div>
      </section>
    </Pagina>
  )
}
