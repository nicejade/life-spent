import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Helvetica Neue',
          'Helvetica',
          'PingFang SC',
          'Noto Sans CJK SC',
          'Source Han Sans SC',
          'sans-serif'
        ]
      },
      colors: {
        ink: {
          950: '#0b0b0b',
          900: '#111111',
          800: '#1a1a1a',
          700: '#262626'
        },
        paper: {
          50: '#f7f7f2',
          100: '#f1f0ea',
          200: '#e6e4dd',
          300: '#d8d5cb',
          400: '#c7c3b5'
        },
        ceremonial: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },
      backdropBlur: {
        glass: '12px'
      }
    }
  },
  plugins: [
    function ({ addVariant }: { addVariant: (name: string, selector: string) => void }) {
      addVariant('light', '.light &');
    }
  ]
} satisfies Config;
