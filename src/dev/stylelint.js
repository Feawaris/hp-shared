/**
 * [stylelint 配置](https://stylelint.io/user-guide/rules)
 */
export const stylelint = Object.create(null);
stylelint.baseConfig = {
  rules: {
    /**
     * Avoid errors
     */
    // Descending
    'no-descending-specificity': [true],
    // Duplicate
    'declaration-block-no-duplicate-custom-properties': [true],
    'declaration-block-no-duplicate-properties': [true],
    'font-family-no-duplicate-names': [true],
    'keyframe-block-no-duplicate-selectors': [true],
    'no-duplicate-at-import-rules': [true],
    'no-duplicate-selectors': [true],
    // Empty
    'block-no-empty': [null],
    'comment-no-empty': [null],
    'no-empty-source': [null],
    // Invalid
    'color-no-invalid-hex': [true],
    'function-calc-no-unspaced-operator': [true],
    'keyframe-declaration-no-important': [null],
    'media-query-no-invalid': [true],
    'named-grid-areas-no-invalid': [true],
    'no-invalid-double-slash-comments': [true],
    'no-invalid-position-at-import-rule': [true],
    'string-no-newline': [true],
    // Irregular
    'no-irregular-whitespace': [true],
    // Missing
    'custom-property-no-missing-var-function': [true],
    'font-family-no-missing-generic-family-keyword': [true],
    // Non-standard
    'function-linear-gradient-no-nonstandard-direction': [true],
    // Overrides
    'declaration-block-no-shorthand-property-overrides': [true],
    // Unmatchable
    'selector-anb-no-unmatchable': [true],
    // Unknown
    'annotation-no-unknown': [true],
    'at-rule-no-unknown': [true],
    'declaration-property-value-no-unknown': [null], // unit-no-unknown 加入 rpx 支持后这里依然会报错，关闭
    'function-no-unknown': [true],
    'media-feature-name-no-unknown': [true],
    'media-feature-name-value-no-unknown': [true],
    'no-unknown-animations': [true],
    'no-unknown-custom-properties': [true],
    'property-no-unknown': [true],
    'selector-pseudo-class-no-unknown': [true],
    'selector-pseudo-element-no-unknown': [true],
    'selector-type-no-unknown': [true],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],

    /**
     * Enforce conventions
     */
    // Allowed, disallowed & required
    //   At-rule
    'at-rule-allowed-list': [null],
    'at-rule-disallowed-list': [null],
    'at-rule-no-vendor-prefix': [true, { severity: 'warning' }],
    'at-rule-property-required-list': [null],
    //   Color
    'color-hex-alpha': [null],
    'color-named': [null],
    'color-no-hex': [null],
    //   Comment
    'comment-word-disallowed-list': [null],
    //   Declaration
    'declaration-no-important': [null],
    'declaration-property-unit-allowed-list': [null],
    'declaration-property-unit-disallowed-list': [null],
    'declaration-property-value-allowed-list': [null],
    'declaration-property-value-disallowed-list': [null],
    //   Function
    'function-allowed-list': [null],
    'function-disallowed-list': [null],
    'function-url-no-scheme-relative': [null],
    'function-url-scheme-allowed-list': [null],
    'function-url-scheme-disallowed-list': [null],
    //   Length
    'length-zero-no-unit': [true, { severity: 'warning' }],
    //   Media feature
    'media-feature-name-allowed-list': [null],
    'media-feature-name-disallowed-list': [null],
    'media-feature-name-no-vendor-prefix': [true, { severity: 'warning' }],
    'media-feature-name-unit-allowed-list': [null],
    'media-feature-name-value-allowed-list': [null],
    //   Property
    'property-allowed-list': [null],
    'property-disallowed-list': [null],
    'property-no-vendor-prefix': [true, { severity: 'warning' }],
    //   Rule
    'rule-selector-property-disallowed-list': [null],
    //   Selector
    'selector-attribute-name-disallowed-list': [null],
    'selector-attribute-operator-allowed-list': [null],
    'selector-attribute-operator-disallowed-list': [null],
    'selector-combinator-allowed-list': [null],
    'selector-combinator-disallowed-list': [null],
    'selector-disallowed-list': [null],
    'selector-no-qualifying-type': [null],
    'selector-no-vendor-prefix': [true, { severity: 'warning' }],
    'selector-pseudo-class-allowed-list': [null],
    'selector-pseudo-class-disallowed-list': [null],
    'selector-pseudo-element-allowed-list': [null],
    'selector-pseudo-element-disallowed-list': [null],
    //   Unit
    'unit-allowed-list': [null],
    'unit-disallowed-list': [null],
    //   Value
    'value-no-vendor-prefix': [true, { severity: 'warning' }],
    // Case
    'function-name-case': ['lower', { severity: 'warning' }],
    'selector-type-case': ['lower', { severity: 'warning' }],
    'value-keyword-case': ['lower', { severity: 'warning' }],
    // Empty lines
    'at-rule-empty-line-before': [null, { severity: 'warning' }],
    'comment-empty-line-before': [null, { severity: 'warning' }],
    'custom-property-empty-line-before': [null, { severity: 'warning' }],
    'declaration-empty-line-before': [null, { severity: 'warning' }],
    'rule-empty-line-before': [null, { severity: 'warning' }],
    // Max & min
    'declaration-block-single-line-max-declarations': [null],
    'declaration-property-max-values': [null],
    'max-nesting-depth': [null],
    'number-max-precision': [null],
    'selector-max-attribute': [null],
    'selector-max-class': [null],
    'selector-max-combinators': [null],
    'selector-max-compound-selectors': [null],
    'selector-max-id': [null],
    'selector-max-pseudo-class': [null],
    'selector-max-specificity': [null],
    'selector-max-type': [null],
    'selector-max-universal': [null],
    'time-min-milliseconds': [null],
    // Notation
    'alpha-value-notation': [null, { severity: 'warning' }],
    'color-function-notation': [null, { severity: 'warning' }],
    'color-hex-length': ['short', { severity: 'warning' }],
    'font-weight-notation': [null, { severity: 'warning' }],
    'hue-degree-notation': [null, { severity: 'warning' }],
    'import-notation': ['string', { severity: 'warning' }],
    'keyframe-selector-notation': [null, { severity: 'warning' }],
    'lightness-notation': [null, { severity: 'warning' }],
    'media-feature-range-notation': ['context', { severity: 'warning' }],
    'selector-not-notation': ['complex', { severity: 'warning' }],
    'selector-pseudo-element-colon-notation': ['double', { severity: 'warning' }],
    // Pattern
    'comment-pattern': [null],
    'custom-media-pattern': [null],
    'custom-property-pattern': [null],
    'keyframes-name-pattern': [null],
    'selector-class-pattern': [null],
    'selector-id-pattern': [null],
    'selector-nested-pattern': [null],
    // Quotes
    'font-family-name-quotes': ['always-where-recommended', { severity: 'warning' }],
    'function-url-quotes': ['always', { severity: 'warning' }],
    'selector-attribute-quotes': ['always', { severity: 'warning' }],
    // Redundant
    'declaration-block-no-redundant-longhand-properties': [true, { severity: 'warning' }],
    'shorthand-property-no-redundant-values': [true, { severity: 'warning' }],
    // Whitespace inside
    'comment-whitespace-inside': ['always', { severity: 'warning' }],
  },
  extends: [],
  plugins: [],
  // customSyntax: '',
  overrides: [],
  defaultSeverity: 'error',
  reportDescriptionlessDisables: [false],
  reportInvalidScopeDisables: [false],
  reportNeedlessDisables: [false],
  // configurationComment: '',
  ignoreDisables: false,
  ignoreFiles: [],
  allowEmptyInput: false,
  cache: true,
  fix: true,
};
stylelint.htmlConfig = {
  overrides: [
    {
      files: ['**/*.html'],
      customSyntax: 'postcss-html',
    },
  ],
};
stylelint.vueConfig = {
  rules: {
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['deep', 'global', 'slotted'],
    }],
    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
    }],
    'function-no-unknown': [true, { ignoreFunctions: ['v-bind'] }],
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
};
stylelint.merge = function (...sources) {
  const simpleKeys = ['customSyntax', 'defaultSeverity', 'reportDescriptionlessDisables', 'reportInvalidScopeDisables', 'reportNeedlessDisables', 'configurationComment', 'ignoreDisables', 'allowEmptyInput', 'cache', 'true'];
  const objectKeys = [];
  const arrayKeys = ['extends', 'plugins', 'overrides', 'ignoreFiles'];

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
      // 视为指定类型的属性
      if (simpleKeys.includes(key)) {
        result[key] = value;
        continue;
      }
      if (objectKeys.includes(key)) {
        result[key] = result[key] || {};
        _Object.deepAssign(result[key], value);
        continue;
      }
      if (arrayKeys.includes(key)) {
        result[key] = result[key] || [];
        if (!Array.isArray(value)) {
          value = [value];
        }
        result[key].push(...value);
        continue;
      }
      // 其他属性
      result[key] = value;
    }
  }
  return result;
};
