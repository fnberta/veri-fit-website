const commonConfig = require('@veri-fit/common-ui/tailwind.config.js');

module.exports = {
  presets: [commonConfig],
  purge: ['./src/**/*.tsx', '../../node_modules/@veri-fit/common-ui/src/**/*.tsx'],
  theme: {
    extend: {
      flexGrow: {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        full: 9999,
      },
    },
  },
};
