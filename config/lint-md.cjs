const { _console } = require('hp-shared/base');
const { MarkdownLint } = require('hp-shared/dev');

const lint = new MarkdownLint({
  rootDir: '../',
  __filename,
});
const config = lint.merge(lint.createBaseConfig(), {
  ignores: [
    ...lint.getIgnores(lint.gitIgnoreFile),
    // ...
  ],
  config: {
    // ...
  },
});

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts()
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
