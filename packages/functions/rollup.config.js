import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default {
  input: 'build/index.js',
  output: {
    format: 'cjs',
    file: pkg.main,
  },
  plugins: [resolve({ resolveOnly: [/^@veri-fit\/.*$/] })],
};
