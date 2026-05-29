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
          DEFAULT: '#0c0714',
          light: '#130d20',
          dark: '#080410',
          deeper: '#050210',
        },
        ink: {
          DEFAULT: '#ede9fe',
          light: '#c4b5fd',
          muted: '#5b4a7a',
        },
        terra: {
          DEFAULT: '#a78bfa',
          light: '#c4b5fd',
          dark: '#7c3aed',
          pale: '#1e1040',
        },
        sage: {
          DEFAULT: '#e879f9',
          light: '#f0abfc',
          pale: '#1a0a20',
        },
        slate: {
          DEFAULT: '#818cf8',
          light: '#a5b4fc',
          pale: '#0e0e28',
          dark: '#4f46e5',
        },
      },
      fontFamily: {
        serif: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
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
