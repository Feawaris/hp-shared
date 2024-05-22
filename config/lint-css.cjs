const { _console } = require('hp-shared/base');
const { StyleLint } = require('hp-shared/dev');

const lint = new StyleLint({
  rootDir: '../',
  __filename,
});
const config = lint.merge(
  lint.baseConfig,
  lint.htmlConfig,
  lint.vueConfig,
  {
    rules: {
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
    .insertPackageJsonScripts({ name: 'lint:css' })
    .insertPackageJsonScripts({ name: 'lint:css:fix', fix: true })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
