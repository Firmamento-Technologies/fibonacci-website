import { t } from '@/lib/testo'
import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const alt = 'Fibonacci - La cartella clinica per la medicina estetica'
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
          background: '#ffffff',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
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
          {t('opengraphimage.la_cartella_clinica_per_la_medicina')}
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
          {t('opengraphimage.dettatura_ai_consensi_inclusi_gdpr_by')}
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
          {[t('opengraphimage.estetica'), t('opengraphimage.dermatologia'), t('opengraphimage.ortopedia'), t('opengraphimage.psicologia'), t('opengraphimage.nutrizione'), t('opengraphimage.oculistica')].map((s) => (
            <div
              key={s}
              style={{
                fontSize: '18px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: '#f6f9fc',
                border: '1px solid #e2e8ee',
                color: '#51616f',
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
