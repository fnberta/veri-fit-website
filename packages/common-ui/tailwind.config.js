const defaultTheme = require('tailwindcss/defaultTheme');
const tailwindUiPlugin = require('@tailwindcss/ui');

module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [tailwindUiPlugin],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  experimental: {
    applyComplexClasses: true,
  },
};
