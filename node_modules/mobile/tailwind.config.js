/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1a1a2e',
        'bg-secondary': '#16213e',
        'bg-card': 'rgba(22,33,62,0.7)',
        'accent': '#4f46e5',
        'accent-hover': '#4338ca',
        'cyan': '#06b6d4',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
