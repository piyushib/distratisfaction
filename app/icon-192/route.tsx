import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: '#0e0b1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
        }}
      >
        <div style={{ fontSize: 120, lineHeight: 1 }}>🧠</div>
      </div>
    ),
    { width: 192, height: 192 }
  )
}
