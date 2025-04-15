/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          light: '#FFD8B5', // light orange
          DEFAULT: '#FFA94D', // orange
          dark: '#FF8921', // dark orange
        },
        'secondary': {
          light: '#B6E3FF', // light sky blue
          DEFAULT: '#63B3ED', // sky blue
          dark: '#3595EB', // dark sky blue
        },
      },
    },
  },
  plugins: [],
}