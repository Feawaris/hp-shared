const { stylelint } = require('hp-shared/dev');

module.exports = stylelint.merge(stylelint.baseConfig, stylelint.htmlConfig, stylelint.vueConfig, {
  rules: {},
});
