const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.vue', './src/**/*.ts'],
  },
  theme: {
    extend: {
      colors: {
        'light-blue': colors.lightBlue,
        cyan: colors.teal,
      },
    },
  },
  plugins: [
    // require('@tailwindcss/ui')({
    //   layout: 'sidebar',
    // }),
    require('@tailwindcss/typography'),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
