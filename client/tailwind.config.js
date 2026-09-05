/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        ui: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        data: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        page: '#FBFBFA',
        surface: {
          DEFAULT: '#FFFFFF',
          sunken: '#F7F8F6',
        },
        ink: {
          DEFAULT: '#14171A',
          secondary: '#6B7280',
          tertiary: '#8A8D91',
        },
        border: {
          DEFAULT: '#E9EAE7',
          light: '#F0F1EE',
          dark: '#D1D5DB',
        },
        recovered: {
          DEFAULT: '#12805C',
          bg: '#E3F1EA',
          border: 'rgba(18, 128, 92, 0.2)',
        },
        pending: {
          DEFAULT: '#B45309',
          bg: '#FBF1E4',
          border: 'rgba(180, 83, 9, 0.2)',
        },
        escalated: {
          DEFAULT: '#4338CA',
          bg: '#ECEBFA',
          border: 'rgba(67, 56, 202, 0.2)',
        },
        stopped: {
          DEFAULT: '#6B7280',
          bg: '#F3F4F6',
          border: 'rgba(107, 114, 128, 0.2)',
        },
        neutral: {
          DEFAULT: '#374151',
          bg: '#F3F4F6',
        }
      },
      borderRadius: {
        card: '20px',
        tile: '14px',
        pill: '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 23, 26, 0.04), 0 12px 32px rgba(20, 23, 26, 0.06)',
        'tile-hover': '0 2px 8px rgba(20, 23, 26, 0.08)',
        drawer: '-8px 0 32px rgba(20, 23, 26, 0.12)',
      }
    },
  },
  plugins: [],
}
