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
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Brain outline — simple symmetric shape */}
          <path
            d="M50 20 C35 20 22 30 22 45 C22 52 25 58 30 62 C28 65 27 69 28 73 C30 80 37 84 44 82 C46 86 50 88 50 88 C50 88 54 86 56 82 C63 84 70 80 72 73 C73 69 72 65 70 62 C75 58 78 52 78 45 C78 30 65 20 50 20Z"
            stroke="#9ca3af"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Center line */}
          <line x1="50" y1="22" x2="50" y2="86" stroke="#9ca3af" strokeWidth="2" />
          {/* Left lobe details */}
          <path d="M36 38 C31 42 30 50 34 55" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M34 55 C36 60 40 63 44 62" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Right lobe details */}
          <path d="M64 38 C69 42 70 50 66 55" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M66 55 C64 60 60 63 56 62" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    ),
    { width: 192, height: 192 }
  )
}
