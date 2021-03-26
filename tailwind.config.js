const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.vue', './src/**/*.ts'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'light-blue': colors.lightBlue,
        cyan: colors.teal,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
