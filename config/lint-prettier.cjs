const { _console } = require('hp-shared/base');
const { Prettier } = require('hp-shared/dev');

const lint = new Prettier({
  rootDir: '../',
  __filename,
});
const config = lint.merge(lint.baseConfig, {
  // ...
});

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts()
    .insertGitIgnoreFile()
    .createIgnoreFile(['pnpm-lock.yaml'])
    .createConfigFile(config);
}
