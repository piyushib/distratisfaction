import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#f4ede2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 80,
        }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            background: '#c97b5e',
            borderRadius: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f4ede2',
            fontSize: 260,
            fontWeight: 900,
            fontStyle: 'italic',
            fontFamily: 'serif',
          }}
        >
          D
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  )
}
