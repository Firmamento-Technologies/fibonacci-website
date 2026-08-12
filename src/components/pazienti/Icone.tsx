/* Le icone del lato paziente. — TD-95
 *
 * ── PERCHE' ESISTONO ────────────────────────────────────────────────────────
 * 🔴 **Rilievo dell'utente (2026-08-13): «e' tutto piatto e uniforme».** Aveva
 * ragione, e questa e' meta' della causa: in una scheda di risultati ogni riga
 * era **testo grigio della stessa dimensione** — nome a parte. NN/g, *Visual
 * Hierarchy in UX*: «if everything is contrasted, then nothing stands out», e
 * la gerarchia si fa con *scala, peso, colore, spaziatura*. Un'icona in testa
 * a una riga e' il modo piu' economico di dire **che tipo di riga e'** prima
 * ancora che venga letta: luogo, telefono, albo, orario.
 *
 * ── PERCHE' SCRITTE A MANO ──────────────────────────────────────────────────
 * ⛔ Niente libreria di icone: il sito e' `output: 'export'` e ogni dipendenza
 * in piu' e' peso scaricato per sei glifi. Sono sei `<svg>` inline, con
 * `currentColor`, quindi ereditano il colore del testo che accompagnano —
 * cioe' non serve mai ricolorarle a mano.
 *
 * ⚠️ **Sono decorative, e lo dichiarano.** `aria-hidden` su tutte: il
 * significato sta nel testo accanto. Un'icona annunciata da uno screen reader
 * accanto alla parola che gia' la spiega e' rumore, non accessibilita'.
 */

type Props = {
  /** Lato in px. Default 16: sta sulla riga di testo a 15px senza spostarla. */
  lato?: number
  className?: string
}

/** Wrapper comune: stessa griglia 24×24, stesso tratto, stessa semantica. */
function Glifo({
  lato = 16,
  className,
  children,
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      width={lato}
      height={lato}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ flexShrink: 0 }}
    >
      {children}
    </svg>
  )
}

/** Dove riceve lo studio. */
export function IconaLuogo(p: Props) {
  return (
    <Glifo {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Glifo>
  )
}

/** Chiamare lo studio. */
export function IconaTelefono(p: Props) {
  return (
    <Glifo {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </Glifo>
  )
}

/* 🔑 **Lo scudo e' l'icona che vale piu' di tutte, ed e' scelta con cura.**
 * Accompagna il numero d'iscrizione all'albo — l'unico segnale di fiducia che
 * questa pagina puo' mostrare, visto che ⛔ non ci sono ne' stelle ne'
 * recensioni ne' classifiche. CXL, *9 CRO Principles*: la fiducia si costruisce
 * con «other people» — testimonianze, loghi, voti. Noi non possiamo usarne
 * nessuno: restano i **fatti verificabili**, e uno scudo dice «garanzia» dove
 * gli altri portali mettono cinque stelle.
 * ⚠️ **Ma senza spunta di conferma.** Una spunta direbbe *«verificato da noi»*,
 * e non lo verifichiamo noi: lo verifica il paziente sull'albo. L'icona
 * accompagna un dato, ⛔ non certifica un controllo che non abbiamo fatto. */
export function IconaAlbo(p: Props) {
  return (
    <Glifo {...p}>
      <path d="M12 22s8-3.6 8-10V5.4L12 2 4 5.4V12c0 6.4 8 10 8 10Z" />
    </Glifo>
  )
}

/** Gli orari liberi. */
export function IconaCalendario(p: Props) {
  return (
    <Glifo {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </Glifo>
  )
}

/** La ricerca. */
export function IconaCerca(p: Props) {
  return (
    <Glifo {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Glifo>
  )
}

/* ⚠️ **Serviva un secondo glifo, e la ragione è semantica.** Le tre pastiglie
 * sotto la ricerca portavano tutte e tre lo scudo — cioè lo stesso segno del
 * numero d'albo. Uno scudo accanto a «nessun cookie» non vuol dire niente, e
 * ripetuto tre volte spegne il segnale sull'unica riga dove conta. Lo scudo
 * resta **esclusivo dell'iscrizione all'Ordine**; le promesse sul servizio
 * portano una spunta. */
export function IconaSpunta(p: Props) {
  return (
    <Glifo {...p}>
      <path d="m4 12.5 5 5L20 6.5" />
    </Glifo>
  )
}

/** Avanti: apre una scheda, una guida. */
export function IconaFreccia(p: Props) {
  return (
    <Glifo {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Glifo>
  )
}
