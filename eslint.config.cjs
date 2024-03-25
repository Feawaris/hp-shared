const { ESLint, PrettierEslint } = require('hp-shared/dev');

const eslint9 = new ESLint({ version: 9, require });
const prettierEslint9 = new PrettierEslint({ eslintVersion: 9, require });

module.exports = [
  eslint9.merge(eslint9.baseConfig, {
    files: ['**/*.js'],
    rules: {},
  }),
  eslint9.merge(prettierEslint9.eslintConfig, {
    ignores: ['dist/**'],
  }),
];
