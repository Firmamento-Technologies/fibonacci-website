import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { BolliniPiede } from '@/components/Bollini'
import { SOCIETA, CONTACT_EMAIL, SUPPORT_EMAIL, PRIVACY_EMAIL, APP_URL, SIGNUP_URL } from '@/lib/site-config'

/* 🔴 **COLONNE RIBILANCIATE** (utente, 2026-08-16: *«le scritte sembrano non
 * allineate nel footer»*). Misurato: erano **9 · 5 · 5**. Una colonna lunga
 * quasi il doppio delle altre lascia sotto le corte un vuoto verticale di
 * mezzo schermo, ed è quel vuoto che si legge come «storto», non i caratteri.
 * Ora sono **6 · 6 · 5**, e le tre colonne finiscono quasi insieme.
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
    titolo: 'Il prodotto',
    voci: [
      { href: '/come-funziona', testo: 'Come funziona' },
      { href: '/consensi-informati', testo: 'Consenso informato' },
      { href: '/sicurezza-e-dati', testo: 'Sicurezza e dati' },
      { href: '/conformita-europea', testo: 'Conformità europea' },
      { href: '/verifica', testo: 'Verifica un documento' },
      { href: '/prezzi', testo: 'Prezzi' },
    ],
  },
  {
    titolo: 'Per decidere',
    voci: [
      { href: '/che-software-serve', testo: 'Che software serve' },
      { href: '/autovalutazione', testo: 'La tua documentazione regge?' },
      { href: '/integrazioni', testo: 'Integrazioni' },
      { href: '/domande', testo: 'Domande frequenti' },
      { href: '/intelligenza-artificiale', testo: "Come usiamo l'intelligenza artificiale" },
      { href: '/richiedi-una-demo', testo: 'Richiedi una demo' },
    ],
  },
  {
    titolo: 'Chi siamo e cosa firmi',
    voci: [
      { href: '/chi-siamo', testo: 'Chi siamo' },
      { href: '/per-le-societa-scientifiche', testo: 'Per le società scientifiche' },
      { href: '/privacy', testo: 'Informativa privacy' },
      { href: '/termini', testo: 'Termini di servizio' },
      { href: '/dpa', testo: 'Trattamento dei dati' },
      { href: '/sub-responsabili', testo: 'Sub-responsabili' },
      { href: '/cookie', testo: 'Cookie' },
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

        <div className="grid gap-[var(--s-55)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
          <div style={{ minWidth: 0 }}>
            <Logo chiaro />
            <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--on-ink-muted)', maxWidth: '22ch' }}>
              La cartella clinica della medicina estetica.
            </p>
            {/* 🔴 **«AccediRegistrati» attaccati**, su ogni pagina del sito.
                I due erano `inline-flex` adiacenti, e JSX toglie lo spazio fra
                due elementi separati da un a-capo ⇒ a video usciva **una parola
                sola inventata**. I margini `mt-` c'erano già: erano pensati per
                stare su due righe, e `inline-flex` glielo impediva.
                ⇒ contenitore `flex-col`, che è ciò che le due voci volevano
                essere fin dall'inizio. */}
            <div className="mt-[var(--s-21)] flex flex-col items-start gap-[var(--s-13)]">
              {APP_URL && (
                <a
                  href={APP_URL}
                  rel="noopener"
                  className="link-avanti inline-flex"
                  style={{ color: 'var(--accent-onink)' }}
                >
                  Accedi
                </a>
              )}
              {SIGNUP_URL && (
                <a
                  href={SIGNUP_URL}
                  rel="noopener"
                  className="link-avanti inline-flex"
                  style={{ color: 'var(--accent-onink)' }}
                >
                  Registrati
                </a>
              )}
            </div>
          </div>

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
              <ul className="mt-[var(--s-21)] grid grid-cols-2 gap-x-[var(--s-13)] gap-y-[var(--s-13)] sm:grid-cols-1 sm:space-y-[var(--s-13)]">
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
            Le fotografie d&apos;ambiente sono immagini d&apos;archivio: non ritraggono pazienti
            reali né clienti del servizio.
          </p>
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
          È una casella sola: assistenza, questioni commerciali e richieste sui dati personali
          arrivano tutte lì, e rispondiamo noi.
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
          Gli indirizzi di posta compaiono qui insieme all&apos;anagrafica societaria.
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
          La società titolare del servizio è in costituzione. Ragione sociale, sede, partita IVA e
          numero REA compaiono qui appena iscritta al registro delle imprese.
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
