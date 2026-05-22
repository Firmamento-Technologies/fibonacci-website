// Logo Fibonacci: spirale aurea SVG derivata dalla sequenza di Fibonacci.
// La spirale cresce secondo il rapporto aureo φ ≈ 1.618 — evoca matematica,
// natura, perfezione proporzionale. Identità visiva unica nel mercato medico.
export function FibonacciLogo({
  size = 32,
  color = '#1b2e4b',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fibonacci logo"
    >
      {/* Quadrati della sequenza di Fibonacci stilizzati come spirale */}
      {/* Sfondo rounded */}
      <rect width="40" height="40" rx="10" fill={color} />
      {/* Spirale aurea in bianco */}
      {/* Arco grande (quadrante in basso a destra) */}
      <path
        d="M 22 8 Q 34 8 34 20 Q 34 32 22 32 Q 10 32 10 20 Q 10 13 16 10"
        stroke="white"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arco medio */}
      <path
        d="M 16 10 Q 22 10 22 16 Q 22 22 16 22"
        stroke="white"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arco piccolo */}
      <path
        d="M 16 22 Q 16 18 20 18"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Punto centrale */}
      <circle cx="20" cy="18" r="1.5" fill="white" opacity="0.8" />
    </svg>
  )
}

export function FibonacciWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-semibold tracking-tight ${className}`}
      style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '-0.01em' }}
    >
      Fibonacci
    </span>
  )
}
