import type { Metadata, Viewport } from 'next'
import { Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dopa',
  description: 'Turn scroll urges into 2-minute wins.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dopa',
  },
  icons: {
    apple: '/icon-192',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050f05',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-parchment">
        {/* Constrain to mobile-first max width, centered */}
        <div className="mx-auto min-h-screen max-w-[440px] relative">
          {children}
          <Nav />
        </div>
      </body>
    </html>
  )
}
