import { nodeResolve } from '@rollup/plugin-node-resolve';
// 共用插件
const nodeCommonPlugins = [
  nodeResolve(),
];
// 生成输出选项
function getOutputItem(options = {}) {
  const banner = `
/*
 * rollup 打包配置：${JSON.stringify(options, ['name', 'format', 'noConflict', 'sourcemap', 'plugins'])}
 */
  `.trimStart();
  return { ...options, banner };
}
export default [
  {
    input: 'src/index.js',
    output: [
      getOutputItem({ file: 'dist/index.js', format: 'umd', name: 'testsShared', noConflict: true }),
    ],
    plugins: nodeCommonPlugins,
  },
];
