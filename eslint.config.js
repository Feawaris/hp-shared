const { eslint9 } = require('hp-shared/dev');
module.exports = [
  {
    ...eslint9.baseConfig,
    files: ['src/**/*.js', '*.config.js'],
  },
];
