import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  themeColor: '#0e0b1a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-parchment">
        <div className="mx-auto min-h-screen max-w-[440px] relative">
          <AuthProvider>
            {children}
            <Nav />
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
