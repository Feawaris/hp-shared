const { _console } = require('hp-shared/base');
const { StyleLint } = require('hp-shared/dev');

const lint = new StyleLint({
  rootDir: '../',
  __filename,
  configFile: 'stylelint.config.cjs',
});
const config = lint.merge(lint.baseConfig, lint.htmlConfig, lint.vueConfig, {
  rules: {
    // ...
  },
});
lint
  .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
    return `node ${filenameRelative} && stylelint '**/*.{css,vue}' --fix || true`;
  })
  .insertGitIgnoreFile()
  .createIgnoreFile()
  .createConfigFile(config);
