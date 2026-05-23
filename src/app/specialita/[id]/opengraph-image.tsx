import { ImageResponse } from 'next/og'
import { SPECIALTIES } from '@/lib/specialties'

export const dynamic = 'force-static'
export const alt = 'Fibonacci specialty preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return SPECIALTIES.map((s) => ({ id: s.id }))
}

export default async function Image({ params }: { params: { id: string } }) {
  const specialty = SPECIALTIES.find((s) => s.id === params.id)
  if (!specialty) {
    return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%' }}>Specialty non trovata</div>, size)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#fafaf8',
          padding: '80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Background gradient specialty-tinted */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '900px',
            height: '900px',
            background: `radial-gradient(circle at 75% 25%, ${specialty.color}28 0%, transparent 60%)`,
          }}
        />

        {/* Brand row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '50px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              background: '#1b2e4b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              color: 'white',
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ fontSize: '34px', fontWeight: 600, color: '#1b2e4b' }}>
            Fibonacci
          </div>
        </div>

        {/* Specialty pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            borderRadius: '999px',
            background: specialty.accent,
            color: specialty.color,
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '30px',
            alignSelf: 'flex-start',
            border: `2px solid ${specialty.color}33`,
          }}
        >
          <div style={{ width: '12px', height: '12px', borderRadius: '999px', background: specialty.color, display: 'flex' }} />
          {specialty.label}
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '76px',
            fontWeight: 700,
            lineHeight: 1.05,
            color: '#1b2e4b',
            maxWidth: '900px',
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          La cartella clinica
        </div>
        <div
          style={{
            fontSize: '76px',
            fontWeight: 700,
            lineHeight: 1.05,
            color: specialty.color,
            maxWidth: '900px',
            marginBottom: '40px',
            display: 'flex',
          }}
        >
          di {specialty.label.toLowerCase()}
        </div>

        {/* Stat */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '16px 28px',
            borderRadius: '14px',
            background: specialty.accent,
            border: `1px solid ${specialty.color}33`,
            alignSelf: 'flex-start',
          }}
        >
          <div style={{ fontSize: '44px', fontWeight: 700, color: specialty.color, display: 'flex' }}>
            {specialty.heroStat.value}
          </div>
          <div style={{ fontSize: '18px', color: specialty.color, display: 'flex', maxWidth: '300px' }}>
            {specialty.heroStat.label}
          </div>
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            display: 'flex',
            fontSize: '20px',
            color: '#6b7a8d',
          }}
        >
          fibonacci.it/specialita/{specialty.id}
        </div>
      </div>
    ),
    { ...size },
  )
}
