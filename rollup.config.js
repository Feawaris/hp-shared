import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const pkg = require('./package.json');
const license = `
/*!
 * ${pkg.name} v${pkg.version}
 * (c) 2022 hp
 * Released under the MIT License.
 */ 
`.trimStart();
// 生成输出选项
function getOutputItem(options = {}) {
  const banner = `${license}
/*
 * rollup 打包配置：${JSON.stringify(options, ['name', 'format', 'noConflict', 'sourcemap', 'plugins'])}
 */
  `.trimStart();
  return { ...options, banner };
}
// 共用插件
const browserCommonPlugins = [
  nodeResolve({ browser: true }),
  commonjs(),
];
const nodeCommonPlugins = [
  nodeResolve(),
];

export default [
  /**
   * 打包浏览器端用
   */
  {
    input: 'src/index.js',
    output: [
      getOutputItem({ file: 'dist/browser/index.umd.js', format: 'umd', name: 'shared', noConflict: true }),
      getOutputItem({ file: 'dist/browser/index.js', format: 'esm', sourcemap: 'inline' }),
    ],
    plugins: browserCommonPlugins,
  },
  {
    input: 'src/base/index.js',
    output: [
      getOutputItem({ file: 'dist/browser/base.js', format: 'esm', sourcemap: 'inline' }),
    ],
    plugins: browserCommonPlugins,
  },
  {
    input: 'src/dev/index.js',
    output: [
      getOutputItem({ file: 'dist/browser/dev.js', format: 'esm', sourcemap: 'inline' }),
    ],
    plugins: browserCommonPlugins,
  },
  {
    input: 'src/network/index.js',
    output: [
      getOutputItem({ file: 'dist/browser/network.js', format: 'esm', sourcemap: 'inline' }),
    ],
    plugins: browserCommonPlugins,
  },
  {
    input: 'src/storage/index.js',
    output: [
      getOutputItem({ file: 'dist/browser/storage.js', format: 'esm', sourcemap: 'inline' }),
    ],
    plugins: browserCommonPlugins,
  },
  /**
   * 打包node端用
   */
  {
    input: 'src/index-node.js',
    output: [
      getOutputItem({ file: 'dist/node/index.js', format: 'cjs', sourcemap: 'inline' }),
    ],
    plugins: nodeCommonPlugins,
  },
  {
    input: 'src/base/index.js',
    output: [
      getOutputItem({ file: 'dist/node/base.js', format: 'cjs', sourcemap: 'inline' }),
    ],
    plugins: nodeCommonPlugins,
  },
  {
    input: 'src/dev/index.js',
    output: [
      getOutputItem({ file: 'dist/node/dev.js', format: 'cjs', sourcemap: 'inline' }),
    ],
    plugins: nodeCommonPlugins,
  },
  {
    input: 'src/network/node/index.js',
    output: [
      getOutputItem({ file: 'dist/node/network.js', format: 'cjs', sourcemap: 'inline' }),
    ],
    plugins: nodeCommonPlugins,
  },
  {
    input: 'src/storage/node/index.js',
    output: [
      getOutputItem({ file: 'dist/node/storage.js', format: 'cjs', sourcemap: 'inline' }),
    ],
    plugins: nodeCommonPlugins,
  },
];
