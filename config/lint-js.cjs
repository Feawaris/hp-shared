const { _console } = require('hp-shared/base');
const { EsLint } = require('hp-shared/dev');

const lint = new EsLint({
  eslintVersion: 9,
  requireResolve: 'string',
  require,

  rootDir: '../',
  __filename,
  configFile: 'eslint.config.cjs',
});
const config = [
  {
    ignores: [
      ...lint.getIgnores(lint.gitIgnoreFile),
      // ...
    ],
  },
  lint.merge(lint.baseConfig, {
    files: ['**/*.{js,cjs}'],
    rules: {},
  }),
  lint.merge(lint.baseConfig, lint.vue3Config, {
    files: ['**/*.vue'],
    rules: {},
  }),
];

lint
  .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
    return `node ${filenameRelative} && eslint --fix || true`;
  })
  .insertGitIgnoreFile()
  .createIgnoreFile()
  .createConfigFile(config);
