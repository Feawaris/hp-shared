const { Prettier, dev } = require('hp-shared/dev');
const path = require('path');

const prettier = new Prettier({ process, require, __filename });
module.exports = prettier.merge(prettier.baseConfig, {});
if (prettier.argv.create) {
  // 在根目录创建 prettier.config.cjs
  const res = dev.createSameFile({
    inputFile: __filename,
    outputFile: path.resolve(__dirname, '../prettier.config.cjs'),
  });
  // 可选择将生成的文件添加到 .gitignore，配置专注于当前 configs 目录
  res.success &&
  dev.appendIgnoreFile({
    inputData: [res.outputFileRelative],
    outputFile: path.resolve(__dirname, '../.gitignore'),
  });
}
