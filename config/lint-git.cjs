const { _console } = require('hp-shared/base');
const { CommitLint } = require('hp-shared/dev');

const lint = new CommitLint({
  rootDir: '../',
  __filename,
  configFile: 'commitlint.config.cjs',
});
const config = lint.merge(lint.baseConfig, {
  // ...
});
lint
  .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
    return `node ${filenameRelative} && echo 'feat: test' | commitlint || true`;
  })
  .insertGitIgnoreFile()
  .createIgnoreFile()
  .createConfigFile(config);
