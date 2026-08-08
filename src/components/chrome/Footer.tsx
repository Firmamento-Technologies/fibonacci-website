import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { SOCIETA, CONTACT_EMAIL, SUPPORT_EMAIL, PRIVACY_EMAIL, APP_URL } from '@/lib/site-config'

const COLONNE = [
  {
    titolo: 'Prodotto',
    voci: [
      { href: '/come-funziona', testo: 'Come funziona' },
      { href: '/consensi-informati', testo: 'Consenso informato' },
      { href: '/che-software-serve', testo: 'Che software serve' },
      { href: '/autovalutazione', testo: 'La tua documentazione regge?' },
      { href: '/sicurezza-e-dati', testo: 'Sicurezza e dati' },
      { href: '/verifica', testo: 'Verifica un documento' },
      { href: '/integrazioni', testo: 'Integrazioni' },
      { href: '/prezzi', testo: 'Prezzi' },
      { href: '/documentazione', testo: 'Documentazione' },
    ],
  },
  {
    titolo: 'Società',
    voci: [
      { href: '/chi-siamo', testo: 'Chi siamo' },
      { href: '/per-le-societa-scientifiche', testo: 'Per le società scientifiche' },
      { href: '/intelligenza-artificiale', testo: "Come usiamo l'intelligenza artificiale" },
      { href: '/domande', testo: 'Domande frequenti' },
      { href: '/richiedi-una-demo', testo: 'Richiedi una demo' },
    ],
  },
  {
    titolo: 'Documenti',
    voci: [
      { href: '/privacy', testo: 'Informativa privacy' },
      { href: '/cookie', testo: 'Cookie' },
      { href: '/termini', testo: 'Termini di servizio' },
      { href: '/dpa', testo: 'Trattamento dei dati' },
      { href: '/sub-responsabili', testo: 'Sub-responsabili' },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="scuro" style={{ paddingTop: 'var(--s-89)', paddingBottom: 'var(--s-55)' }}>
      <div className="gabbia">
        <div className="grid gap-[var(--s-55)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
          <div style={{ minWidth: 0 }}>
            <Logo chiaro />
            <p className="mt-[var(--s-21)] text-[15px]" style={{ color: 'var(--on-ink-muted)', maxWidth: '22ch' }}>
              La cartella clinica della medicina estetica.
            </p>
            <a
              href={APP_URL}
              rel="noopener"
              className="link-avanti mt-[var(--s-21)] inline-flex"
              style={{ color: 'var(--accent-onink)' }}
            >
              Accedi
            </a>
          </div>

          {COLONNE.map((col) => (
            <nav key={col.titolo} aria-label={col.titolo}>
              <h2 className="occhiello occhiello-chiaro" style={{ fontWeight: 500 }}>
                {col.titolo}
              </h2>
              <ul className="mt-[var(--s-21)] space-y-[var(--s-13)]">
                {col.voci.map((v) => (
                  <li key={v.href}>
                    <Link href={v.href} className="text-[15px]" style={{ color: 'var(--on-ink-muted)' }}>
                      {v.testo}
                    </Link>
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
   casella inesistente è peggio di uno che manda al modulo. */
function Recapiti() {
  const caselle = [
    ['Scrivici', CONTACT_EMAIL],
    ['Assistenza', SUPPORT_EMAIL],
    ['Dati personali', PRIVACY_EMAIL],
  ].filter(([, indirizzo]) => indirizzo)

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
