import type { Config } from 'tailwindcss'

const config: Config = {
  // Tell Tailwind where to look for class usage
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Brand colour palette — loaded as Tailwind utilities like bg-brand-rose, text-brand-dark etc.
      colors: {
        brand: {
          white: '#FDFCFB',   // Page background — warm off-white
          cream: '#F5F0EA',   // Section backgrounds, product cards
          beige: '#E8DDD0',   // Borders, dividers, subtle separators
          muted: '#9C8B7A',   // Secondary text, labels, captions
          dark: '#2C2019',    // Primary text, headings — rich warm dark
          rose: '#C4796A',    // PRIMARY ACCENT — CTAs, highlights, active states
          'rose-light': '#D9948A', // Hover states for rose elements
          'rose-dark': '#A85E52',  // Active/pressed states for rose elements
          green: '#5C7A5E',   // Secondary accent — "natural/clean" badge, eco cues
        },
      },
      // Brand typography — loaded via next/font/google in layout.tsx
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'], // Headings — elegant, luxurious
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'], // Body — clean, readable
      },
      // Extended spacing for generous layout breathing room
      maxWidth: {
        site: '80rem', // 1280px — same as max-w-7xl but named for clarity
      },
      // Subtle box shadow for card lift effects
      boxShadow: {
        card: '0 1px 3px 0 rgb(44 32 25 / 0.08), 0 1px 2px -1px rgb(44 32 25 / 0.06)',
        'card-hover': '0 8px 24px -4px rgb(44 32 25 / 0.12), 0 4px 8px -2px rgb(44 32 25 / 0.08)',
        rose: '0 4px 16px -2px rgb(196 121 106 / 0.35)',
      },
      // Custom animation for marquee/scrolling brand strip
      animation: {
        marquee: 'marquee 30s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
