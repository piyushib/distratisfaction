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
          DEFAULT: '#f4ede2',
          light: '#faf7f2',
          dark: '#e8ddd0',
          deeper: '#d9cfc3',
        },
        ink: {
          DEFAULT: '#2a2620',
          light: '#5c5449',
          muted: '#8a7f74',
        },
        terra: {
          DEFAULT: '#c97b5e',
          light: '#dfa48e',
          dark: '#a85f43',
          pale: '#f0d4c8',
        },
        sage: {
          DEFAULT: '#6b8f71',
          light: '#a8c4ab',
          pale: '#d4e6d6',
        },
        slate: {
          DEFAULT: '#6b819e',
          light: '#a0b4cb',
          pale: '#d8e4ef',
          dark: '#4f6482',
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
