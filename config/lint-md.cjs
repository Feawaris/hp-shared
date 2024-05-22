const { _console } = require('hp-shared/base');
const { MarkdownLint } = require('hp-shared/dev');

const lint = new MarkdownLint({
  rootDir: '../',
  __filename,
});
const config = lint.merge(
  lint.createBaseConfig(),
  {
    ignores: [
      ...lint.getIgnores(lint.gitIgnoreFile),
      // ...
    ],
    config: {
      // ...
    },
  },
);

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts({ name: 'lint:md' })
    .insertPackageJsonScripts({ name: 'lint:md:fix', fix: true })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
