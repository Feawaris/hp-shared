/**
 * [rollup](https://www.npmjs.com/package/rollup)
 * [@rollup/plugin-typescript](https://www.npmjs.com/package/@rollup/plugin-typescript)
 * [rollup-plugin-dts](https://www.npmjs.com/package/rollup-plugin-dts)
 * [@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve)
 * [@rollup/plugin-commonjs](https://www.npmjs.com/package/@rollup/plugin-commonjs)
 * [@rollup/plugin-json](https://www.npmjs.com/package/@rollup/plugin-json)
 * [@rollup/plugin-terser](https://www.npmjs.com/package/@rollup/plugin-terser)
 */
import { _Date } from './src/base/index.ts';
import type { OutputOptions, RollupOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

// 生成输出选项
interface Options extends OutputOptions {
  extraBanner?: string | string[];
}
function getOutputItem(options: Options = {}): OutputOptions {
  const { extraBanner = [], ...restOptions } = options;
  return {
    get banner() {
      return [
        // license
        `/*!`,
        ` * ${pkg.name} v${pkg.version}`,
        ` * (c) 2022 ${pkg.author}`,
        ` * Released under the ${pkg.license} License.`,
        ` */`,
        // 打包配置
        `/*`,
        ` * 打包时间：${new _Date()}`,
        ` * rollup 打包配置：${JSON.stringify(this, ['name', 'format', 'noConflict', 'sourcemap', 'plugins'])}`,
        ` */`,
        // 合并选项
        ...(Array.isArray(extraBanner) ? extraBanner : [extraBanner]),
      ].join('\n');
    },
    sourcemap: 'inline',
    ...restOptions,
  };
}
// 共用插件
const browserPlugins = [
  typescript(),
  nodeResolve({
    browser: true,
  }),
  commonjs(),
  json(),
];
const nodePlugins = [
  typescript(),
  nodeResolve({
    exportConditions: ['node'],
  }),
  commonjs(),
  json(),
];
const dtsPlugins = [
  dts(),
];

const config: RollupOptions[] = [
  // 在 getOutputItem 中传 plugins 无效，拆分处理：在 Rollup 中，plugins 应该定义在配置对象的顶层，并且对整个构建过程起作用，而不是针对特定的输出。因此，不能直接在 output 对象中指定 plugins。
  {
    input: 'src/index-browser.ts',
    output: [
      getOutputItem({ file: 'dist/browser/index.umd.js', format: 'umd', name: 'hpShared', noConflict: true }),
      getOutputItem({ file: 'dist/browser/index.js', format: 'es' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/index-browser-tampermonkey.ts',
    output: [
      getOutputItem({
        file: 'dist/browser-tampermonkey/index.js',
        format: 'iife',
        extraBanner: [
          `// ==UserScript==`,
          `// @name         ${pkg.name}`,
          `// @version      ${pkg.version}`,
          `// @description  ${pkg.description}`,
          `// @license      ${pkg.license}`,
          `// @author       ${pkg.author}`,
          `// @namespace    ${pkg.homepage}`,
          `// @match        *://*/*`,
          `// @require      ${new URL(`https://unpkg.com/${pkg.name}/${pkg.unpkg}`)}`,
          `// @grant        none`,
          `// ==/UserScript==`,
        ],
      }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/index-browser.ts',
    output: [
      getOutputItem({ file: 'dist/browser/index.d.ts' }),
    ],
    plugins: dtsPlugins,
  },
  {
    input: 'src/index-node.ts',
    output: [
      getOutputItem({ file: 'dist/node/index.mjs', format: 'es' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/index-node.ts',
    output: [
      getOutputItem({ file: 'dist/node/index.js', format: 'cjs' }),
    ],
    plugins: nodePlugins,
  },
  {
    input: 'src/index-node.ts',
    output: [
      getOutputItem({ file: 'dist/node/index.d.ts' }),
    ],
    plugins: dtsPlugins,
  },
  {
    input: 'src/index-wx.ts',
    output: [
      getOutputItem({ file: 'dist/wx/index.js', format: 'es' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/index-wx.ts',
    output: [
      getOutputItem({ file: 'dist/wx/index.cjs', format: 'cjs' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/index-wx.ts',
    output: [
      getOutputItem({ file: 'dist/wx/index.d.ts' }),
    ],
    plugins: dtsPlugins,
  },

  {
    input: 'src/base/index.ts',
    output: [
      getOutputItem({ file: 'dist/browser/base.js', format: 'es' }),
      getOutputItem({ file: 'dist/node/base.mjs', format: 'es' }),
      getOutputItem({ file: 'dist/wx/base.js', format: 'es' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/base/index-target-es2015.ts',
    output: [
      getOutputItem({ file: 'dist/browser/base-target-es2015.js', format: 'es' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/base/index.ts',
    output: [
      getOutputItem({ file: 'dist/node/base.js', format: 'cjs' }),
      getOutputItem({ file: 'dist/wx/base.cjs', format: 'cjs' }),
    ],
    plugins: nodePlugins,
  },
  {
    input: 'src/base/index.ts',
    output: [
      getOutputItem({ file: 'dist/browser/base.d.ts' }),
      getOutputItem({ file: 'dist/node/base.d.ts' }),
      getOutputItem({ file: 'dist/wx/base.d.ts' }),
    ],
    plugins: dtsPlugins,
  },

  {
    input: 'src/storage/index.ts',
    output: [
      getOutputItem({ file: 'dist/browser/storage.js', format: 'es' }),
      getOutputItem({ file: 'dist/wx/storage.js', format: 'es' }),
      getOutputItem({ file: 'dist/wx/storage.cjs', format: 'cjs' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/storage/index.ts',
    output: [
      getOutputItem({ file: 'dist/node/storage.js', format: 'cjs' }),
      getOutputItem({ file: 'dist/node/storage.mjs', format: 'es' }),
    ],
    plugins: nodePlugins,
  },
  {
    input: 'src/storage/index.ts',
    output: [
      getOutputItem({ file: 'dist/browser/dev.d.ts' }),
      getOutputItem({ file: 'dist/node/dev.d.ts' }),
      getOutputItem({ file: 'dist/wx/dev.d.ts' }),
    ],
    plugins: dtsPlugins,
  },

  {
    input: 'src/dev/index.ts',
    output: [
      getOutputItem({ file: 'dist/browser/dev.js', format: 'es' }),
      getOutputItem({ file: 'dist/wx/dev.js', format: 'es' }),
      getOutputItem({ file: 'dist/wx/dev.cjs', format: 'cjs' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/dev/index.ts',
    output: [
      getOutputItem({ file: 'dist/node/dev.js', format: 'cjs' }),
      getOutputItem({ file: 'dist/node/dev.mjs', format: 'es' }),
    ],
    plugins: nodePlugins,
  },
  {
    input: 'src/dev/index.ts',
    output: [
      getOutputItem({ file: 'dist/browser/dev.d.ts' }),
      getOutputItem({ file: 'dist/node/dev.d.ts' }),
      getOutputItem({ file: 'dist/wx/dev.d.ts' }),
    ],
    plugins: dtsPlugins,
  },

  {
    input: 'src/performance/index.ts',
    output: [
      getOutputItem({ file: 'dist/browser/performance.js', format: 'es' }),
      getOutputItem({ file: 'dist/wx/performance.js', format: 'es' }),
      getOutputItem({ file: 'dist/wx/performance.cjs', format: 'cjs' }),
    ],
    plugins: browserPlugins,
  },
  {
    input: 'src/performance/index.ts',
    output: [
      getOutputItem({ file: 'dist/node/performance.js', format: 'cjs' }),
      getOutputItem({ file: 'dist/node/performance.mjs', format: 'es' }),
    ],
    plugins: nodePlugins,
  },
  {
    input: 'src/performance/index.ts',
    output: [
      getOutputItem({ file: 'dist/browser/performance.d.ts' }),
      getOutputItem({ file: 'dist/node/performance.d.ts' }),
      getOutputItem({ file: 'dist/wx/performance.d.ts' }),
    ],
    plugins: dtsPlugins,
  },
];
export default config;
