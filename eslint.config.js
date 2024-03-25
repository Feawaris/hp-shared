const { ESLint } = require('hp-shared/dev');

const eslint9 = new ESLint({ version: 9, require });
module.exports = [
  eslint9.merge(
    eslint9.baseConfig,
    {
      files: ['src/**/*.js'],
      rules: {}
    },
  ),
];
