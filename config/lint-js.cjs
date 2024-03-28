const { EsLint, dev } = require('hp-shared/dev');
const path = require('path');

const eslint9 = new EsLint({ eslintVersion: 9, process, require });
module.exports = [
  {
    ignores: dev.getIgnoresFromFiles([path.resolve(process.cwd(), '.gitignore')]),
  },
  eslint9.merge(eslint9.baseConfig, {
    files: ['**/*.{js,cjs}'],
    rules: {},
  }),
  eslint9.merge(eslint9.baseConfig, eslint9.vue3Config, {
    files: ['**/*.vue'],
    rules: {},
  }),
];

if (eslint9.argv.create) {
  // 在根目录创建 eslint.config.cjs
  const res = dev.createSameFile({
    inputFile: __filename,
    outputFile: path.resolve(__dirname, `../eslint.config.cjs`),
  });
  // 可选择将生成的文件添加到 .gitignore，配置专注于当前 configs 目录
  res.success &&
    dev.appendIgnoreFile({
      inputData: [res.outputFileRelative],
      outputFile: path.resolve(__dirname, '../.gitignore'),
    });
}
