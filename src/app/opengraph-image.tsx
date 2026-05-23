import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const alt = 'Fibonacci - La cartella clinica per ogni specialità medica'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '700px',
            height: '700px',
            background:
              'radial-gradient(circle at 70% 30%, rgba(196, 115, 107, 0.18) 0%, transparent 60%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '60px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#1b2e4b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: 'white',
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ fontSize: '40px', fontWeight: 600, color: '#1b2e4b' }}>
            Fibonacci
          </div>
        </div>
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            lineHeight: 1.1,
            color: '#1b2e4b',
            maxWidth: '900px',
            marginBottom: '30px',
            display: 'flex',
          }}
        >
          La cartella clinica per ogni specialità medica
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#6b7a8d',
            maxWidth: '900px',
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          Dettatura AI, consensi inclusi, GDPR by design, FHIR R4.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '80px',
            display: 'flex',
            gap: '16px',
          }}
        >
          {['Estetica', 'Dermatologia', 'Ortopedia', 'Psicologia', 'Nutrizione', 'Oculistica'].map((s) => (
            <div
              key={s}
              style={{
                fontSize: '18px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: 'white',
                border: '1px solid #e8e4dd',
                color: '#6b7a8d',
                display: 'flex',
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
