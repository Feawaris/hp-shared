const { _console } = require('hp-shared/base');
const { EsLint } = require('hp-shared/dev');

const lint = new EsLint({
  eslintVersion: 9,
  requireResolve: 'string',
  require,

  rootDir: '../',
  __filename,
});
const config = [
  {
    ignores: [
      ...lint.getIgnores(lint.gitIgnoreFile),
      // ...
    ],
  },
  lint.merge(lint.baseConfig, lint.stylisticConfig, {
    files: ['**/*.{js,cjs}'],
    rules: {},
  }),
  lint.merge(lint.baseConfig, lint.stylisticConfig, lint.tsConfig, {
    files: ['**/*.{ts,cts}'],
    rules: {},
  }),
  lint.merge(lint.baseConfig, lint.stylisticConfig, lint.vue3Config, {
    files: ['**/*.vue'],
    rules: {},
  }),
];

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts({ name: 'lint:js' })
    .insertPackageJsonScripts({ name: 'lint:js:fix', fix: true })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
