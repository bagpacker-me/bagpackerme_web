import { ImageResponse } from 'next/og';

// Shared spec + renderer for every route's opengraph-image.tsx. We render a
// branded typographic card rather than compositing the package/hero photo:
// satori (the ImageResponse engine) cannot decode WebP or AVIF, and our image
// URLs are Unsplash `?auto=format` and Firebase Storage uploads — compositing
// them risks a blank OG image in production. A typographic card is deterministic.
//
// No custom font is loaded, so satori uses its built-in fallback. To go fully
// on-brand later, vendor a .ttf and pass it via the `fonts` option below.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const VOID = '#221E2A';
const LIME = '#C1EA00';

export function renderOgCard(options: {
  eyebrow?: string;
  title: string;
  meta?: string;
}) {
  const { eyebrow, title, meta } = options;
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: VOID,
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '6px', background: LIME }} />
          <div
            style={{
              color: '#FFFFFF',
              fontSize: '30px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            BagPackerMe
          </div>
        </div>

        {/* Middle: title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {eyebrow ? (
            <div
              style={{
                color: LIME,
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              color: '#FFFFFF',
              fontSize: title.length > 48 ? '64px' : '80px',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: meta */}
        <div
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '28px',
            fontWeight: 400,
          }}
        >
          {meta ?? 'Private, tailor-made journeys'}
        </div>
      </div>
    ),
    OG_SIZE
  );
}
