const { MarkdownLint, dev } = require('hp-shared/dev');
const path = require('path');

const markdownlint = new MarkdownLint({ process, require });
if (markdownlint.argv.create) {
  // 在根目录创建 .markdownlint.json
  const res = dev.createJsonFile({
    inputData: markdownlint.merge(markdownlint.createBaseConfig(), {}),
    outputFile: path.resolve(__dirname, '../.markdownlint.json'),
  });
  // 可选择将生成的文件添加到 .gitignore，配置专注于当前 configs 目录
  res.success &&
    dev.appendIgnoreFile({
      inputData: [res.outputFileRelative],
      outputFile: path.resolve(__dirname, '../.gitignore'),
    });
}
