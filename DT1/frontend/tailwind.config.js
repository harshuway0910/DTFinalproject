/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-color)',
        foreground: 'var(--text-main)',
        primary: 'var(--primary-accent)',
        secondary: 'var(--secondary-accent)',
        muted: 'var(--text-muted)',
        panel: 'var(--panel-bg)',
        panelBorder: 'var(--panel-border)',
        hoverBg: 'var(--hover-bg)',
        borderColor: 'var(--border-color)',
        earth: {
          50: 'hsla(151, 52%, 88%, 1.00)',
          100: 'rgba(182, 252, 227, 1)',
          200: '#cbdac9',
          300: '#a6c0a3',
          400: '#7ea179',
          500: '#5e8459',
          600: '#486844',
          700: '#3a5337',
          800: '#30432f',
          900: '#283827',
        },
        leaf: {
          400: '#0daf48ff',
          500: '#07803df4',
          600: '#073619ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
