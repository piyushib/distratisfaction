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
        // Background: dark purple-black
        parchment: {
          DEFAULT: '#0e0b1a',  // bg
          light: '#1c1630',    // card / input bg
          dark: '#09060f',     // deeper bg
          deeper: '#050309',
        },
        // Text: high-contrast on dark bg
        ink: {
          DEFAULT: '#f0ecff',  // 16:1 on parchment ✓
          light: '#cdc0ff',    // 9:1 ✓
          muted: '#a899cc',    // 4.8:1 ✓ (passes WCAG AA)
        },
        // Primary accent — violet, bright enough for dark bg
        terra: {
          DEFAULT: '#b89eff',  // 7.2:1 on parchment ✓
          light: '#d4c5ff',    // 10:1 ✓
          dark: '#8b5cf6',     // 4.6:1 ✓ (large text / UI)
          pale: '#1e1640',     // tinted bg
        },
        // Secondary accent — soft pink
        sage: {
          DEFAULT: '#f0a8f8',  // 7.1:1 on parchment ✓
          light: '#f8d4fc',    // 12:1 ✓
          pale: '#22082a',
        },
        // Tertiary accent — periwinkle blue
        slate: {
          DEFAULT: '#a5b4fc',  // 6.2:1 on parchment ✓
          light: '#c7d2fe',    // 9.5:1 ✓
          pale: '#0d1040',
          dark: '#6366f1',     // 4.5:1 ✓ (large text / UI)
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
