import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

// The share card is the same system as the site: one void, one violet ring,
// one saffron mark. Hierarchy comes from scale, never from weight.
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0C',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 150,
            right: -150,
            width: 520,
            height: 520,
            borderRadius: '50%',
            border: '2px solid rgba(128, 82, 255, 0.42)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 300,
            right: 0,
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '2px solid rgba(255, 184, 41, 0.28)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFB829', display: 'flex' }} />
          <div style={{ color: '#FFB829', fontSize: 24, letterSpacing: 3, textTransform: 'uppercase' }}>
            Applied AI Scientist · Inception, a G42 company
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ color: '#FFFFFF', fontSize: 86, letterSpacing: -3, lineHeight: 1.05, display: 'flex' }}>
            Pranav Arora
          </div>
          <div style={{ color: '#BDBDBD', fontSize: 38, letterSpacing: -1, lineHeight: 1.25, maxWidth: 780, display: 'flex' }}>
            Applied AI, held to a production standard.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, color: '#9A9A9A', fontSize: 22, letterSpacing: 1 }}>
          <div style={{ display: 'flex' }}>Singapore → Abu Dhabi</div>
          <div style={{ display: 'flex' }}>Models · evaluation · production</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
