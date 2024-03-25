const { markdownlint } = require('hp-shared/dev');

module.exports = {
  config: markdownlint.merge(
    markdownlint.createBaseConfig(),
    {},
  ),
};
