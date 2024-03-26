import { _Date } from './src/base/index.js';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { name, version } from './package.json';

const license = `
/*!
 * ${name} v${version}
 * (c) 2022 hp
 * Released under the MIT License.
 */ 
`.trimStart();
// 生成输出选项
function getOutputItem(options = {}) {
  return {
    get banner() {
      return `${license}
/*
 * 打包时间：${new _Date()}
 * rollup 打包配置：${JSON.stringify(this, ['name', 'format', 'noConflict', 'sourcemap', 'plugins'])}
 */
      `.trimStart();
    },
    sourcemap: 'inline',
    ...options,
  };
}
// 共用插件
const browserPlugins = [
  nodeResolve({
    browser: true,
  }),
  commonjs(),
  json(),
];
const nodePlugins = [
  nodeResolve({
    exportConditions: ['node'],
  }),
  commonjs(),
  json(),
];

export default [
  /**
   * browser
   */
  {
    input: 'src/index-browser.js',
    output: [getOutputItem({ file: 'dist/browser/index.umd.js', format: 'umd', name: 'hpShared', noConflict: true }), getOutputItem({ file: 'dist/browser/index.js', format: 'es' })],
    plugins: browserPlugins,
  },
  {
    input: 'src/base/index.js',
    output: [getOutputItem({ file: 'dist/browser/base.js', format: 'es' })],
    plugins: browserPlugins,
  },
  {
    input: 'src/dev/index.js',
    output: [getOutputItem({ file: 'dist/browser/dev.js', format: 'es' })],
    plugins: browserPlugins,
  },
  {
    input: 'src/storage/index-browser.js',
    output: [getOutputItem({ file: 'dist/browser/storage.js', format: 'es' })],
    plugins: browserPlugins,
  },

  /**
   * node
   */
  {
    input: 'src/index-node.js',
    output: [getOutputItem({ file: 'dist/node/index.js', format: 'cjs' })],
    plugins: nodePlugins,
  },
  {
    input: 'src/base/index.js',
    output: [getOutputItem({ file: 'dist/node/base.js', format: 'cjs' })],
    plugins: nodePlugins,
  },
  {
    input: 'src/dev/index.js',
    output: [getOutputItem({ file: 'dist/node/dev.js', format: 'cjs' })],
    plugins: nodePlugins,
  },
  {
    input: 'src/storage/index-node.js',
    output: [getOutputItem({ file: 'dist/node/storage.js', format: 'cjs' })],
    plugins: nodePlugins,
  },
];
