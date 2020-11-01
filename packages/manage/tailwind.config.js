const commonConfig = require('@veri-fit/common-ui/tailwind.config.js');

module.exports = {
  presets: [commonConfig],
  purge: ['./src/**/*.tsx', '../../node_modules/@veri-fit/common-ui/src/**/*.tsx'],
};
