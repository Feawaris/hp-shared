const { StyleLint, dev } = require('hp-shared/dev');
const path = require('path');

const stylelint = new StyleLint({ process, require });
module.exports = stylelint.merge(stylelint.baseConfig, stylelint.htmlConfig, stylelint.vueConfig, {
  rules: {},
});
if (stylelint.argv.create) {
  // 在根目录创建 .stylelintrc.cjs
  const res = dev.createSameFile({
    inputFile: __filename,
    outputFile: path.resolve(__dirname, `../.stylelintrc.cjs`),
  });
  // 可选择将生成的文件添加到 .gitignore，配置专注于当前 configs 目录
  res.success &&
    dev.appendIgnoreFile({
      inputData: [res.outputFileRelative],
      outputFile: path.resolve(__dirname, '../.gitignore'),
    });
}
