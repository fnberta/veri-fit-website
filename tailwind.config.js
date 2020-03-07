module.exports = {
  theme: {
    extend: {
      flexGrow: {
        full: 9999,
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
  },
  plugins: [require('@tailwindcss/ui')],
};
