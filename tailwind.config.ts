import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#050f05',
          light: '#091509',
          dark: '#030903',
          deeper: '#020602',
        },
        ink: {
          DEFAULT: '#d4ffd4',
          light: '#7FFF00',
          muted: '#3a6b3a',
        },
        terra: {
          DEFAULT: '#32CD32',
          light: '#5de05d',
          dark: '#1a8a1a',
          pale: '#0a2a0a',
        },
        sage: {
          DEFAULT: '#00FA9A',
          light: '#33fbb0',
          pale: '#00150e',
        },
        slate: {
          DEFAULT: '#ADFF2F',
          light: '#c4ff6b',
          pale: '#141f00',
          dark: '#7ab800',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'Menlo', 'monospace'],
        sans: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.9' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
