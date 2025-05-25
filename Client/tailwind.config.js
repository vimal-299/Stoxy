/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-bg': {
          '0%': { backgroundColor: '#6425FE' },
          '100%': { backgroundColor: '#A25BFF' },
        },
      },
      animation: {
        'pulse-bg': 'pulse-bg 1s infinite alternate',
      },
    },
  },
  plugins: [],
}

