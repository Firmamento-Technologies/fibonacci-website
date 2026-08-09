/* Il marchio.
 *
 * La spirale non è un ornamento: è la costruzione esatta della sequenza.
 * Quadrati di lato 8, 5, 3, 2, 1 accostati in un rettangolo 13×8 (rapporto
 * 1,625, cioè φ approssimato dalla sequenza stessa), e in ognuno il quarto di
 * cerchio che li unisce. I raggi degli archi sono 8, 5, 3, 2, 1: gli stessi
 * numeri della scala di spaziatura del sito.
 *
 * Disegnata a filo, non dentro un quadrato colorato: un'icona da app store
 * direbbe «prodotto di consumo», e qui si vende una cartella clinica.
 */

const SPIRALE = 'M0 8 A8 8 0 0 1 8 0 A5 5 0 0 1 13 5 A3 3 0 0 1 10 8 A2 2 0 0 1 8 6 A1 1 0 0 1 9 5'

export function FibonacciLogo({
  size = 26,
  color = 'currentColor',
  spessore = 0.75,
}: {
  size?: number
  color?: string
  spessore?: number
}) {
  return (
    <svg
      width={(size * 14.4) / 9.4}
      height={size}
      viewBox="-0.7 -0.7 14.4 9.4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={SPIRALE}
        stroke={color}
        strokeWidth={spessore}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FibonacciWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        letterSpacing: '-0.018em',
        fontVariationSettings: '"opsz" 24',
      }}
    >
      Fibonacci
    </span>
  )
}

/** Marchio completo: spirale + parola. È l'unico posto in cui compaiono insieme. */
export function Logo({ chiaro = false }: { chiaro?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-[var(--s-13)]"
      style={{ color: chiaro ? 'var(--on-ink)' : 'var(--fg)' }}
    >
      <FibonacciLogo size={22} color={chiaro ? 'var(--accent-onink)' : 'var(--accent)'} />
      <FibonacciWordmark />
      <span className="sr-only">Fibonacci</span>
    </span>
  )
}
