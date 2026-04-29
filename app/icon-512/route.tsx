import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#050f05',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 112,
        }}
      >
        <div style={{ fontSize: 320, lineHeight: 1 }}>🧠</div>
      </div>
    ),
    { width: 512, height: 512 }
  )
}
