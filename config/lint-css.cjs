const { _console, StyleLint } = require('hp-shared');

const lint = new StyleLint({
  rootDir: '../',
  __filename,
});
const config = lint.merge(
  lint.baseConfig,
  lint.scssConfig,
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
