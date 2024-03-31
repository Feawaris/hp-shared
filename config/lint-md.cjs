const { _console } = require('hp-shared/base');
const { MarkdownLint } = require('hp-shared/dev');

const lint = new MarkdownLint({
  rootDir: '../',
  __filename,
  configFile: '.markdownlint-cli2.cjs',
});
const config = lint.merge(lint.createBaseConfig(), {
  ignores: [
    ...lint.getIgnores(lint.gitIgnoreFile),
    // ...
    'docs/**/*.md',
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
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && markdownlint-cli2 '**/*.md' --fix || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
