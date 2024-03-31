const { _console } = require('hp-shared/base');
const { Prettier } = require('hp-shared/dev');

const lint = new Prettier({
  rootDir: '../',
  __filename,
  configFile: 'prettier.config.cjs',
});
const config = lint.merge(lint.baseConfig, {
  // ...
});

module.exports = {
  lint, config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && prettier --check --write '**/*.*' || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile(['pnpm-lock.yaml'])
    .createConfigFile(config);
}
