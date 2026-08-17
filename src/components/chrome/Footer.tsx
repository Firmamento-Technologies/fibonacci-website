import { t } from '@/lib/testo'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { BolliniPiede } from '@/components/Bollini'
import { SceltaLingua } from '@/components/chrome/SceltaLingua'
import { SOCIETA, CONTACT_EMAIL, SUPPORT_EMAIL, PRIVACY_EMAIL, APP_URL, SIGNUP_URL } from '@/lib/site-config'

/* 🔴 **COLONNE RIBILANCIATE** (utente, 2026-08-16: *«le scritte sembrano non
 * allineate nel footer»*). Misurato: erano **9 · 5 · 5**. Una colonna lunga
 * quasi il doppio delle altre lascia sotto le corte un vuoto verticale di
 * mezzo schermo, ed è quel vuoto che si legge come «storto», non i caratteri.
 * Ora sono **6 · 6 · 7**, e le tre colonne finiscono quasi insieme.
 *
 * 🔑 Lo spostamento non è meccanico, è per **significato**: «Che software
 * serve», «La tua documentazione regge?» e «Integrazioni» non sono il
 * prodotto, sono **materiale per decidere**. Stanno insieme a «Domande
 * frequenti», che fa lo stesso mestiere.
 *
 * ⚠️ NN/g sui piè di pagina: il rimedio a un elenco lungo non è accorciarlo a
 * caso ma **dichiarare la gerarchia con il raggruppamento**. Tre gruppi che
 * rispondono a tre domande diverse (*che cos'è* · *mi serve?* · *chi siete e
 * cosa firmo*) si scorrono; ventinove voci in tre mucchi disuguali no. */
const COLONNE = [
  {
    titolo: t('chrome.footer.il_prodotto'),
    voci: [
      { href: '/come-funziona', testo: t('chrome.footer.come_funziona') },
      { href: '/consensi-informati', testo: t('chrome.footer.consenso_informato') },
      { href: '/sicurezza-e-dati', testo: t('chrome.footer.sicurezza_e_dati') },
      { href: '/conformita-europea', testo: t('chrome.footer.conformita_europea') },
      { href: '/verifica', testo: t('chrome.footer.verifica_un_documento') },
      { href: '/prezzi', testo: t('chrome.footer.prezzi') },
    ],
  },
  {
    titolo: t('chrome.footer.per_decidere'),
    voci: [
      { href: '/che-software-serve', testo: t('chrome.footer.che_software_serve') },
      { href: '/autovalutazione', testo: t('chrome.footer.la_tua_documentazione_regge') },
      { href: '/integrazioni', testo: t('chrome.footer.integrazioni') },
      { href: '/domande', testo: t('chrome.footer.domande_frequenti') },
      { href: '/intelligenza-artificiale', testo: t('chrome.footer.come_usiamo_l_intelligenza_artificiale') },
      { href: '/richiedi-una-demo', testo: t('chrome.footer.richiedi_una_demo') },
    ],
  },
  {
    titolo: t('chrome.footer.chi_siamo_e_cosa_firmi'),
    voci: [
      { href: '/chi-siamo', testo: t('chrome.footer.chi_siamo') },
      { href: '/per-le-societa-scientifiche', testo: t('chrome.footer.per_le_societa_scientifiche') },
      { href: '/privacy', testo: t('chrome.footer.informativa_privacy') },
      { href: '/termini', testo: t('chrome.footer.termini_di_servizio') },
      { href: '/dpa', testo: t('chrome.footer.trattamento_dei_dati') },
      { href: '/sub-responsabili', testo: t('chrome.footer.sub_responsabili') },
      { href: '/cookie', testo: t('chrome.footer.cookie') },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="scuro" style={{ paddingTop: 'var(--s-89)', paddingBottom: 'var(--s-55)' }}>
      <div className="gabbia">
        {/* Le norme, in cima al piè di pagina e non in fondo: su ogni pagina
            del sito, e nel punto in cui chi cerca «e la conformità?» guarda
            per primo. Il contenuto sta in `src/lib/bollini.ts`. */}
        <BolliniPiede />

        <hr className="filetto" style={{ marginBottom: 'var(--s-55)' }} />

        {/* ── Il marchio, su una RIGA SUA e non in una quarta colonna ──────
            🔴 Prima il logo stava in una griglia di **quattro colonne uguali**
            insieme ai tre elenchi. Ma logo, una riga di testo e due
            collegamenti non riempiono una colonna alta quanto sette voci: sotto
            restava un **vuoto verticale di mezzo schermo**, e le tre colonne di
            link erano strette per far posto a quel vuoto.
            ⇒ Il marchio prende una riga propria, con i due collegamenti
            all'estremo opposto; gli elenchi si dividono **tutta** la larghezza
            in tre parti uguali. Sparisce il vuoto e le colonne respirano.
            ⚠️ Su telefono `flex-wrap` fa impilare da sé: nessuna regola in più. */}
        <div className="flex flex-wrap items-start justify-between gap-[var(--s-34)]">
          <div style={{ minWidth: 0 }}>
            <Logo chiaro />
            <p className="mt-[var(--s-13)] text-[15px]" style={{ color: 'var(--on-ink-muted)', maxWidth: '26ch' }}>
              {t('chrome.footer.la_cartella_clinica_della_medicina_estetica')}
            </p>
          </div>

          {/* 🔴 «AccediRegistrati» si stampavano attaccati su ogni pagina: erano
              due `inline-flex` adiacenti, e JSX toglie lo spazio fra elementi
              su righe diverse. Qui stanno affiancati **di proposito**, con uno
              spazio dichiarato dal `gap`. */}
          <div className="flex items-center gap-[var(--s-21)]">
            {SIGNUP_URL && (
              <a href={SIGNUP_URL} rel="noopener" className="btn btn-su-scuro">
                {t('chrome.footer.registrati')}
              </a>
            )}
            {APP_URL && (
              <a
                href={APP_URL}
                rel="noopener"
                className="link-avanti inline-flex"
                style={{ color: 'var(--accent-onink)' }}
              >
                {t('chrome.footer.accedi')}
              </a>
            )}
          </div>
        </div>

        <div className="mt-[var(--s-34)] grid gap-x-[var(--s-34)] gap-y-[var(--s-21)] sm:mt-[var(--s-55)] sm:gap-y-[var(--s-34)] sm:grid-cols-3">
          {COLONNE.map((col) => (
            <nav key={col.titolo} aria-label={col.titolo}>
              {/* `occhiello-piatto`: senza il filetto davanti, che qui
                  spingeva l'etichetta 29px a destra dei link che intesta.
                  Vedi la regola in `globals.css`. */}
              <h2 className="occhiello occhiello-chiaro occhiello-piatto" style={{ fontWeight: 500 }}>
                {col.titolo}
              </h2>
              {/* ⚠️ **Due colonne sotto i 640px, una sola da lì in su.**
                  Misurato sul sito vivo: il piè di pagina su 375px era alto
                  **2.724px, cioè 3,4 schermate** di solo piè di pagina, e
                  quasi mille di quei pixel erano le 19 voci impilate una per
                  riga. Le etichette sono corte e ci stanno in due colonne da
                  ~165px senza andare a capo; le poche lunghe («Come usiamo
                  l'intelligenza artificiale») vanno su due righe, che è
                  comunque meno di due voci separate.
                  ⛔ Non si rimpicciolisce il testo: 15px è già il minimo
                  leggibile per un collegamento, e il bersaglio da toccare non
                  deve scendere. Si cambia la disposizione, non la scala. */}
              <ul className="mt-[var(--s-13)] grid grid-cols-2 gap-x-[var(--s-13)] gap-y-[var(--s-8)] sm:mt-[var(--s-21)] sm:grid-cols-1 sm:gap-y-[var(--s-13)]">
                {col.voci.map((v) => (
                  <li key={v.href}>
                    {/* La demo sta su un altro dominio: `next/link` con un URL
                        assoluto funziona, ma un'ancora dice la verità e non
                        prova a fare il pre-caricamento di un'altra origine. */}
                    {'esterno' in v && v.esterno ? (
                      <a
                        href={v.href}
                        rel="noopener"
                        className="text-[15px]"
                        style={{ color: 'var(--on-ink-muted)' }}
                      >
                        {v.testo}
                      </a>
                    ) : (
                      <Link href={v.href} className="text-[15px]" style={{ color: 'var(--on-ink-muted)' }}>
                        {v.testo}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="filetto" style={{ marginBlock: 'var(--s-55)' }} />

        <div
          className="grid gap-[var(--s-34)] text-[13px]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', color: 'var(--on-ink-muted)' }}
        >
          {/* Anagrafica del prestatore, art. 7 c. 1 D.Lgs. 70/2003. Compare da
              sola quando la società è iscritta al registro imprese: fino ad
              allora questi dati non esistono, e metterne di finti sarebbe una
              dichiarazione falsa invece di un'omissione. */}
          <IdentitaSocietaria />

          <Recapiti />

          <p>
            {t('chrome.footer.le_fotografie_d_ambiente_sono_immagini')}
          </p>

          {/* La lingua sta in fondo di proposito: la scelta la fa il server al
              primo colpo leggendo il browser (vedi `infra/Caddyfile`), quindi
              questo selettore serve a chi vuole *un'altra* lingua da quella che
              gli e' arrivata. Metterlo in testa direbbe che c'e' una scelta da
              fare, e per quasi tutti non c'e'. */}
          <SceltaLingua />
        </div>
      </div>
    </footer>
  )
}

/* I recapiti compaiono solo se configurati. Un piè di pagina che mostra una
   casella inesistente è peggio di uno che manda al modulo.

   🔴 **E tre etichette sopra UN indirizzo solo sono peggio di una.** Fino al
   2026-08-16 qui uscivano tre righe — «Scrivici», «Assistenza», «Dati
   personali» — con accanto **lo stesso identico `info@fibonaccimedica.it`**
   ripetuto tre volte. A video sembra un errore di copia-incolla, e nella
   sostanza promette tre canali che non esistono: chi scrive per esercitare un
   diritto ex artt. 15-22 GDPR crede di scrivere a un ufficio dedicato.
   ⇒ Le etichette si **uniscono quando l'indirizzo coincide**, e la riga dice
   la verità: una casella sola, per tutto. Il giorno in cui `privacy@` e
   `supporto@` esisteranno davvero (vedi `site-config.ts`), le righe tornano
   separate **da sole**, senza toccare questo componente. */
function Recapiti() {
  const caselle = [
    ['Scrivici', CONTACT_EMAIL],
    ['Assistenza', SUPPORT_EMAIL],
    ['Dati personali', PRIVACY_EMAIL],
  ].filter(([, indirizzo]) => indirizzo)

  const indirizziUnici = new Set(caselle.map(([, ind]) => ind))
  if (caselle.length > 1 && indirizziUnici.size === 1) {
    const unico = caselle[0][1]
    return (
      <div>
        <p>
          Scrivici:{' '}
          <a href={`mailto:${unico}`} style={{ color: 'var(--accent-onink)', textDecoration: 'underline' }}>
            {unico}
          </a>
        </p>
        <p className="mt-[var(--s-8)]">
          {t('chrome.footer.e_una_casella_sola_assistenza_questioni')}
        </p>
      </div>
    )
  }

  if (!caselle.length) {
    return (
      <div>
        <p>
          Il canale di contatto è il modulo:{' '}
          <Link href="/richiedi-una-demo" style={{ color: 'var(--accent-onink)', textDecoration: 'underline' }}>
            richiedi una demo
          </Link>
          .
        </p>
        <p className="mt-[var(--s-8)]">
          {t('chrome.footer.gli_indirizzi_di_posta_compaiono_qui')}
        </p>
      </div>
    )
  }

  return (
    <div>
      {caselle.map(([etichetta, indirizzo], i) => (
        <p key={indirizzo} className={i ? 'mt-[var(--s-8)]' : ''}>
          {etichetta}:{' '}
          <a href={`mailto:${indirizzo}`} style={{ color: 'var(--accent-onink)', textDecoration: 'underline' }}>
            {indirizzo}
          </a>
        </p>
      ))}
    </div>
  )
}

function IdentitaSocietaria() {
  if (!SOCIETA.costituita) {
    return (
      <div>
        <p style={{ color: 'var(--on-ink)' }}>Fibonacci</p>
        <p className="mt-[var(--s-8)]">
          {t('chrome.footer.la_societa_titolare_del_servizio_e')}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ color: 'var(--on-ink)' }}>{SOCIETA.ragioneSociale}</p>
      <p className="mt-[var(--s-8)]">
        {SOCIETA.sede.via}
        <br />
        {SOCIETA.sede.cap} {SOCIETA.sede.comune} ({SOCIETA.sede.provincia}), Italia
      </p>
      <p className="mt-[var(--s-8)]">
        Partita IVA <span style={{ color: 'var(--on-ink)' }}>{SOCIETA.partitaIva}</span>
        {' · '}REA <span style={{ color: 'var(--on-ink)' }}>{SOCIETA.rea}</span>
      </p>
      {SOCIETA.pec && (
        <p className="mt-[var(--s-8)]">
          PEC:{' '}
          <a href={`mailto:${SOCIETA.pec}`} style={{ color: 'var(--accent-onink)' }}>
            {SOCIETA.pec}
          </a>
        </p>
      )}
    </div>
  )
}
