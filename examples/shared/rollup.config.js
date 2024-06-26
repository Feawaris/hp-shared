import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const browserPlugins = [
  nodeResolve({
    browser: true,
  }),
  commonjs(),
];
const nodePlugins = [
  nodeResolve({
    exportConditions: ['node'],
  }),
  commonjs(),
];

const config = [
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/index.js', format: 'es', sourcemap: 'inline' },
      { file: 'dist/index.umd.js', format: 'umd', sourcemap: 'inline', name: 'testsShared', noConflict: true },
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/index.cjs', format: 'cjs', sourcemap: 'inline' },
    ],
    plugins: nodePlugins,
  },
];
export default config;
