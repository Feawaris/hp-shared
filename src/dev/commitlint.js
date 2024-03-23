/**
 * [commitlint 配置](https://commitlint.js.org/reference/rules.html)
 */

export const commitlint = Object.create(null);
commitlint.baseConfig = {
  rules: {
    'body-full-stop': [0],
    'body-leading-blank': [1, 'always'],
    'body-empty': [0],
    'body-max-length': [0],
    'body-max-line-length': [2, 'always', 100],
    'body-min-length': [0],
    'body-case': [0],
    'footer-leading-blank': [1, 'always'],
    'footer-empty': [0],
    'footer-max-length': [0],
    'footer-max-line-length': [2, 'always', 100],
    'footer-min-length': [0],
    'header-case': [0],
    'header-full-stop': [0],
    'header-max-length': [2, 'always', 100],
    'header-min-length': [0],
    'header-trim': [2, 'always'],
    'references-empty': [0],
    'scope-enum': [0],
    'scope-case': [0],
    'scope-empty': [0],
    'scope-max-length': [0],
    'scope-min-length': [0],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [0],
    'subject-min-length': [0],
    'subject-exclamation-mark': [0],
    'type-enum': [2, 'always', [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'build',
      'ci',
      'chore',
      'revert',
    ]],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-max-length': [0],
    'type-min-length': [0],
    'signed-off-by': [0],
    'trailer-exists': [0],

  },
};
commitlint.merge = function (...sources) {
  let result = {};
  for (const source of sources) {
    for (let [key, value] of Object.entries(source)) {
      // 特殊属性
      if (key === 'rules') {
        result[key] = result[key] || {};
        // 对各条规则处理
        for (let [ruleKey, ruleValue] of Object.entries(value)) {
          // 统一成数组处理
          let ruleValueResult = result[key][ruleKey] || [];
          if (!Array.isArray(ruleValueResult)) {
            ruleValueResult = [ruleValueResult];
          }
          if (!Array.isArray(ruleValue)) {
            ruleValue = [ruleValue];
          }
          // 带选项的整个替换，不带选项的单独替换
          if (ruleValue.length > 1) {
            ruleValueResult = ruleValue;
          } else if (ruleValue.length === 1) {
            ruleValueResult[0] = ruleValue[0];
          }
          // 赋值
          result[key][ruleKey] = ruleValueResult;
        }
        continue;
      }
      // 其他属性
      result[key] = value;
    }
  }
  return result;
};
