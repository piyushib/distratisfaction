import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: '#f4ede2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 32,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            background: '#c97b5e',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f4ede2',
            fontSize: 96,
            fontWeight: 900,
            fontStyle: 'italic',
            fontFamily: 'serif',
          }}
        >
          D
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  )
}
