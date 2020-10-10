import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: {
    format: 'cjs',
    file: pkg.main,
  },
  plugins: [resolve({ resolveOnly: [/^@veri-fit\/.*$/] }), typescript()],
};