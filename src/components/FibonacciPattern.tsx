// Pattern decorativo Fibonacci: spirale aurea sottile come motivo di sfondo
// ricorrente nelle sezioni. Opacity bassa (4-6%), purely decorative (aria-hidden).
// Posizionabile via prop align (top-right, bottom-left, etc).

interface FibonacciPatternProps {
  size?: number
  opacity?: number
  align?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  color?: string
}

export function FibonacciPattern({
  size = 600,
  opacity = 0.05,
  align = 'top-right',
  color = 'currentColor',
}: FibonacciPatternProps) {
  const positions = {
    'top-right': 'top-0 right-0 -translate-y-1/4 translate-x-1/4',
    'top-left': 'top-0 left-0 -translate-y-1/4 -translate-x-1/4',
    'bottom-right': 'bottom-0 right-0 translate-y-1/4 translate-x-1/4',
    'bottom-left': 'bottom-0 left-0 translate-y-1/4 -translate-x-1/4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }
  return (
    <div
      className={`absolute pointer-events-none ${positions[align]}`}
      style={{ width: size, height: size, opacity, color }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Sequenza Fibonacci come quadrati con archi (spirale aurea geometricamente corretta) */}
        <g stroke="currentColor" strokeWidth="1.2" fill="none">
          {/* Quadrato 1 (lato 1) */}
          <rect x="300" y="299" width="1" height="1" />
          {/* Quadrato 1 (lato 1) */}
          <rect x="301" y="299" width="1" height="1" />
          {/* Quadrato 2 (lato 2) */}
          <rect x="300" y="300" width="2" height="2" />
          {/* Quadrato 3 (lato 3) */}
          <rect x="298" y="298" width="3" height="3" />
          {/* Quadrato 5 (lato 5) */}
          <rect x="298" y="296" width="5" height="5" />
          {/* Quadrato 8 (lato 8) */}
          <rect x="293" y="296" width="8" height="8" />
          {/* Quadrato 13 (lato 13) */}
          <rect x="293" y="291" width="13" height="13" />
          {/* Quadrato 21 (lato 21) */}
          <rect x="285" y="291" width="21" height="21" />
          {/* Quadrato 34 (lato 34) */}
          <rect x="285" y="278" width="34" height="34" />
          {/* Quadrato 55 (lato 55) */}
          <rect x="264" y="278" width="55" height="55" />
          {/* Quadrato 89 (lato 89) */}
          <rect x="264" y="244" width="89" height="89" />
          {/* Quadrato 144 (lato 144) */}
          <rect x="209" y="244" width="144" height="144" />
          {/* Quadrato 233 (lato 233) */}
          <rect x="209" y="155" width="233" height="233" />
        </g>
        {/* Spirale aurea che attraversa */}
        <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M 300 300 Q 301 299 302 300 Q 302 301 301 302 Q 299 302 298 300 Q 298 298 301 298 Q 304 298 304 301 Q 304 305 300 305 Q 295 305 295 300 Q 295 293 302 293 Q 311 293 311 302 Q 311 314 300 314 Q 285 314 285 300 Q 285 282 303 282 Q 326 282 326 301 Q 326 327 300 327 Q 268 327 268 297 Q 268 254 308 254 Q 360 254 360 300 Q 360 360 300 360 Q 209 360 209 296 Q 209 200 313 200 Q 442 200 442 300 Q 442 442 300 442" />
        </g>
      </svg>
    </div>
  )
}
