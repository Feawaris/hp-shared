const { markdownlint } = require('hp-shared/dev');

markdownlint.createFile({
  filepath: '.markdownlint.json',
  keyName: 'key',
  config: markdownlint.merge(
    markdownlint.createBaseConfig(),
  ),
});
