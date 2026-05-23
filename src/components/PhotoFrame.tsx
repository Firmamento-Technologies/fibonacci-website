import Image from 'next/image'

interface PhotoFrameProps {
  src: string
  alt: string
  caption?: string
  className?: string
  priority?: boolean
}

// Componente riusabile per foto stock con cornice elegante:
// rounded-2xl + border sottile + ombra + caption opzionale + lazy load.
export function PhotoFrame({ src, alt, caption, className = '', priority = false }: PhotoFrameProps) {
  return (
    <figure className={`relative ${className}`}>
      <div
        className="relative overflow-hidden rounded-2xl shadow-xl"
        style={{ border: '1px solid var(--border)' }}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          unoptimized
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption
          className="text-xs mt-3 leading-snug italic"
          style={{ color: 'var(--muted)' }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
