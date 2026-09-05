/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: '#081C15',
          forest: '#1B4D3E',
          primary: '#2D6A4F',
          medium: '#40916C',
          light: '#52B788',
          pale: '#74C69D',
          mint: '#D8F3DC',
          accent: '#D4A373',
          warmbg: '#F8F9FA',
          earth: '#BC6C25'
        }
      }
    },
  },
  plugins: [],
}
