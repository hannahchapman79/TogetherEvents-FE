/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9e2a2b',
        secondary: '#f5e6d3',
        'accent-1': '#d2b48c',
        'accent-2': '#8b4513',
        'accent-3': '#a94442',
        'white': '#FFFFFF',
        'offwhite': '#E1E1E1'
      },
    },
  },
  plugins: [],
}