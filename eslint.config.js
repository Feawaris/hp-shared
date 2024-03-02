const { eslint9 } = require('hp-shared/dev');

module.exports = [
  eslint9.merge(
    eslint9.baseConfig,
    {
      files: ['src/**/*.js', '*.config.js'],
      rules: {},
    },
  ),
];
