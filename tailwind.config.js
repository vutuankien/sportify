/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./build/**/*{html,js}"],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    height:{
      almostFull:"90vh",
      screen:"100vh"
    },
    fontFamily: {
      sans: ['Arial', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [],
}

