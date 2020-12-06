const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const forms = require('@tailwindcss/forms');

module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        orange: colors.orange,
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['disabled'],
      borderColor: ['disabled'],
      opacity: ['disabled'],
      backgroundColor: ['disabled', 'active'],
      backgroundOpacity: ['active'],
      textColor: ['disabled', 'active'],
      boxShadow: ['disabled', 'active'],
      cursor: ['disabled'],
      ringWidth: ['focus-visible'],
      ringOffsetWidth: ['focus-visible'],
      ringOffsetColor: ['focus-visible'],
      ringColor: ['focus-visible'],
      ringOpacity: ['focus-visible'],
    },
  },
  plugins: [forms],
};
