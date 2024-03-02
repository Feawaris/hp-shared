/**
 * [eslint 配置](https://zh-hans.eslint.org/docs/latest/rules/)
 * [eslint-plugin-vue 配置](https://eslint.vuejs.org/rules/)
 */
import { _Object } from '../base';

const eslint = Object.create(null);
eslint.baseConfig = {
  rules: {
    /**
     * Possible Problems
     * 可能出现的问题
     */
    'array-callback-return': ['error', {
      allowImplicit: false,
      checkForEach: true,
    }],
    'constructor-super': ['error'],
    'for-direction': ['error'],
    'getter-return': ['error', {
      allowImplicit: false,
    }],
    'no-async-promise-executor': ['error'],
    'no-await-in-loop': ['off'],
    'no-class-assign': ['error'],
    'no-compare-neg-zero': ['error'],
    'no-cond-assign': ['error', 'except-parens'],
    'no-const-assign': ['error'],
    'no-constant-binary-expression': ['error'],
    'no-constant-condition': ['error', {
      checkLoops: false,
    }],
    'no-constructor-return': ['error'],
    'no-control-regex': ['off'],
    'no-debugger': ['off'],
    'no-dupe-args': ['error'],
    'no-dupe-class-members': ['error'],
    'no-dupe-else-if': ['error'],
    'no-dupe-keys': ['error'],
    'no-duplicate-case': ['error'],
    'no-duplicate-imports': ['off', {
      includeExports: false,
    }],
    'no-empty-character-class': ['off'],
    'no-empty-pattern': ['off', {
      allowObjectPatternsAsParameters: true,
    }],
    'no-ex-assign': ['error'],
    'no-fallthrough': ['off', {
      commentPattern: 'falls?\\s*through',
      allowEmptyCase: true,
    }],
    'no-func-assign': ['error'],
    'no-import-assign': ['error'],
    'no-inner-declarations': ['error', 'both'],
    'no-invalid-regexp': ['off', {
      allowConstructorFlags: [],
    }],
    'no-irregular-whitespace': ['error', {
      skipStrings: true,
      skipComments: true,
      skipRegExps: true,
      skipTemplates: true,
    }],
    'no-loss-of-precision': ['error'],
    'no-misleading-character-class': ['error'],
    'no-new-native-nonconstructor': ['error'],
    'no-new-symbol': ['error'],
    'no-obj-calls': ['error'],
    'no-promise-executor-return': ['error'],
    'no-prototype-builtins': ['error'],
    'no-self-assign': ['error', {
      props: true,
    }],
    'no-self-compare': ['error'],
    'no-setter-return': ['error'],
    'no-sparse-arrays': ['error'],
    'no-template-curly-in-string': ['off'],
    'no-this-before-super': ['error'],
    'no-undef': ['off', {
      typeof: false,
    }],
    'no-unexpected-multiline': ['error'],
    'no-unmodified-loop-condition': ['off'],
    'no-unreachable': ['error'],
    'no-unreachable-loop': ['error', {
      ignore: [],
    }],
    'no-unsafe-finally': ['error'],
    'no-unsafe-negation': ['error', {
      enforceForOrderingRelations: true,
    }],
    'no-unsafe-optional-chaining': ['off', {
      disallowArithmeticOperators: false,
    }],
    'no-unused-private-class-members': ['off'],
    'no-unused-vars': ['off', {
      vars: 'all',
      varsIgnorePattern: '',
      args: 'none',
      argsIgnorePattern: '',
      caughtErrors: 'none',
      caughtErrorsIgnorePattern: '',
      destructuredArrayIgnorePattern: '',
      ignoreRestSiblings: false,
    }],
    'no-use-before-define': ['error', {
      functions: false,
      classes: false,
      variables: false,
      allowNamedExports: false,
    }],
    'no-useless-backreference': ['off'],
    'require-atomic-updates': ['off', {
      allowProperties: false,
    }],
    'use-isnan': ['error', {
      enforceForSwitchCase: true,
      enforceForIndexOf: true,
    }],
    'valid-typeof': ['error', {
      requireStringLiterals: false,
    }],

    /**
     * Suggestions
     * 建议
     */
    'accessor-pairs': ['error', {
      setWithoutGet: true,
      getWithoutSet: false,
      enforceForClassMembers: true,
    }],
    'arrow-body-style': ['off', 'as-needed', {
      requireReturnForObjectLiteral: false,
    }],
    'block-scoped-var': ['error'],
    camelcase: ['off', {
      properties: 'never',
      ignoreDestructuring: true,
      ignoreImports: true,
      ignoreGlobals: true,
      allow: [],
    }],
    'capitalized-comments': ['off', 'never', {
      ignorePattern: '',
      ignoreInlineComments: true,
      ignoreConsecutiveComments: true,
    }],
    'class-methods-use-this': ['off', {
      exceptMethods: [],
      enforceForClassFields: true,
    }],
    complexity: ['off', {
      max: Infinity,
    }],
    'consistent-return': ['error', {
      treatUndefinedAsUnspecified: false,
    }],
    'consistent-this': ['off', 'that'],
    curly: ['warn', 'all'],
    'default-case': ['off', {
      commentPattern: '^no\\sdefault',
    }],
    'default-case-last': ['error'],
    'default-param-last': ['off'],
    'dot-notation': ['off', {
      allowKeywords: true,
      allowPattern: '',
    }],
    eqeqeq: ['warn', 'always', {
      null: 'always',
    }],
    'func-name-matching': ['off', 'always', {
      considerPropertyDescriptor: true,
      includeCommonJSModuleExports: true,
    }],
    'func-names': ['off', 'as-needed', {
      generators: 'as-needed',
    }],
    'func-style': ['off', 'expression', {
      allowArrowFunctions: true,
    }],
    'grouped-accessor-pairs': ['error', 'getBeforeSet'],
    'guard-for-in': ['error'],
    'id-denylist': ['off', ...[]],
    'id-length': ['off', {
      min: 1,
      max: Infinity,
      properties: 'never',
      exceptions: [],
      exceptionPatterns: [],
    }],
    'id-match': ['off', '^[a-z]+([A-Z][a-z]+)*$', {
      properties: false,
      classFields: false,
      onlyDeclarations: false,
      ignoreDestructuring: false,
    }],
    'init-declarations': ['off', 'always'],
    'logical-assignment-operators': ['off', 'never'],
    'max-classes-per-file': ['off', {
      max: Infinity,
      ignoreExpressions: true,
    }],
    'max-depth': ['off', {
      max: Infinity,
    }],
    'max-lines': ['off', {
      max: Infinity,
      skipBlankLines: true,
      skipComments: true,
    }],
    'max-lines-per-function': ['off', {
      max: Infinity,
      skipBlankLines: true,
      skipComments: true,
      IIFEs: true,
    }],
    'max-nested-callbacks': ['off', {
      max: Infinity,
    }],
    'max-params': ['off', {
      max: Infinity,
    }],
    'max-statements': ['off', {
      max: Infinity,
      ignoreTopLevelFunctions: true,
    }],
    'multiline-comment-style': ['off', 'starred-block'],
    'new-cap': ['off', {
      newIsCap: true,
      capIsNew: true,
      newIsCapExceptions: [],
      newIsCapExceptionPattern: '',
      capIsNewExceptions: [],
      capIsNewExceptionPattern: '',
      properties: true,
    }],
    'no-alert': ['error'],
    'no-array-constructor': ['error'],
    'no-bitwise': ['off', {
      allow: [],
      int32Hint: true,
    }],
    'no-caller': ['error'],
    'no-case-declarations': ['error'],
    'no-confusing-arrow': ['off', {
      allowParens: true,
      onlyOneSimpleParam: true,
    }],
    'no-console': ['off', {
      allow: [],
    }],
    'no-continue': ['off'],
    'no-delete-var': ['error'],
    'no-div-regex': ['off'],
    'no-else-return': ['off', {
      allowElseIf: false,
    }],
    'no-empty': ['off', {
      allowEmptyCatch: true,
    }],
    'no-empty-function': ['off', {
      allow: [],
    }],
    'no-empty-static-block': ['off'],
    'no-eq-null': ['warn'],
    'no-eval': ['off', {
      allowIndirect: true,
    }],
    'no-extend-native': ['error', {
      exceptions: [],
    }],
    'no-extra-bind': ['warn'],
    'no-extra-boolean-cast': ['warn', {
      enforceForLogicalOperands: true,
    }],
    'no-extra-label': ['off'],
    'no-extra-semi': ['warn'],
    'no-floating-decimal': ['warn'],
    'no-global-assign': ['error', {
      exceptions: [],
    }],
    'no-implicit-coercion': ['off', {
      boolean: true,
      number: true,
      string: true,
      disallowTemplateShorthand: false,
      allow: [],
    }],
    'no-implicit-globals': ['off', {
      lexicalBindings: false,
    }],
    'no-implied-eval': ['error'],
    'no-inline-comments': ['off', {
      ignorePattern: '',
    }],
    'no-invalid-this': ['off', {
      capIsConstructor: true,
    }],
    'no-iterator': ['error'],
    'no-label-var': ['off'],
    'no-labels': ['off', {
      allowLoop: false,
      allowSwitch: false,
    }],
    'no-lone-blocks': ['off'],
    'no-lonely-if': ['off'],
    'no-loop-func': ['error'],
    'no-magic-numbers': ['off', {
      ignore: [],
      ignoreArrayIndexes: true,
      ignoreDefaultValues: true,
      ignoreClassFieldInitialValues: true,
      enforceConst: false,
      detectObjects: false,
    }],
    'no-mixed-operators': ['off', {
      groups: [...[]],
      allowSamePrecedence: true,
    }],
    'no-multi-assign': ['off', {
      ignoreNonDeclaration: false,
    }],
    'no-multi-str': ['warn'],
    'no-negated-condition': ['off'],
    'no-nested-ternary': ['off'],
    'no-new': ['off'],
    'no-new-func': ['off'],
    'no-new-object': ['error'],
    'no-new-wrappers': ['error'],
    'no-nonoctal-decimal-escape': ['error'],
    'no-octal': ['error'],
    'no-octal-escape': ['error'],
    'no-param-reassign': ['off', {
      props: true,
      ignorePropertyModificationsFor: [],
      ignorePropertyModificationsForRegex: [],
    }],
    'no-plusplus': ['off', {
      allowForLoopAfterthoughts: true,
    }],
    'no-proto': ['error'],
    'no-redeclare': ['error', {
      builtinGlobals: true,
    }],
    'no-regex-spaces': ['off'],
    'no-restricted-exports': ['off', {
      restrictedNamedExports: [],
      restrictDefaultExports: {
        direct: true,
        named: true,
        defaultFrom: true,
        namedFrom: true,
        namespaceFrom: true,
      },
    }],
    'no-restricted-globals': ['off', ...[]],
    'no-restricted-imports': ['off', {
      paths: [],
      patterns: [],
    }],
    'no-restricted-properties': ['off', ...[]],
    'no-restricted-syntax': ['off', ...[]],
    'no-return-assign': ['warn', 'except-parens'],
    'no-script-url': ['off'],
    'no-sequences': ['off', {
      allowInParentheses: true,
    }],
    'no-shadow': ['off', {
      builtinGlobals: true,
      hoist: 'all',
      allow: [],
      ignoreOnInitialization: false,
    }],
    'no-shadow-restricted-names': ['error'],
    'no-ternary': ['off'],
    'no-throw-literal': ['off'],
    'no-undef-init': ['off'],
    'no-undefined': ['off'],
    'no-underscore-dangle': ['off', {
      allow: [],
      allowAfterThis: false,
      allowAfterSuper: false,
      allowAfterThisConstructor: false,
      enforceInMethodNames: false,
      enforceInClassFields: false,
      allowInArrayDestructuring: true,
      allowInObjectDestructuring: true,
      allowFunctionParams: true,
    }],
    'no-unneeded-ternary': ['warn', {
      defaultAssignment: false,
    }],
    'no-unused-expressions': ['off', {
      allowShortCircuit: true,
      allowTernary: true,
      allowTaggedTemplates: true,
      enforceForJSX: false,
    }],
    'no-unused-labels': ['off'],
    'no-useless-call': ['off'],
    'no-useless-catch': ['off'],
    'no-useless-computed-key': ['off', {
      enforceForClassMembers: true,
    }],
    'no-useless-concat': ['off'],
    'no-useless-constructor': ['off'],
    'no-useless-escape': ['warn'],
    'no-useless-rename': ['off', {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    }],
    'no-useless-return': ['off'],
    'no-var': ['warn'],
    'no-void': ['off', {
      allowAsStatement: false,
    }],
    'no-warning-comments': ['off', {
      terms: ['todo', 'fixme', 'xxx'],
      location: 'start',
      decoration: [],
    }],
    'no-with': ['off'],
    'object-shorthand': ['warn', 'always', {
      avoidQuotes: false,
      ignoreConstructors: false,
      methodsIgnorePattern: '',
      avoidExplicitReturnArrows: true,
    }],
    'one-var': ['off', {
      var: 'never',
      let: 'never',
      const: 'never',
      separateRequires: true,
    }],
    'one-var-declaration-per-line': ['off', 'always'],
    'operator-assignment': ['off', 'never'],
    'prefer-arrow-callback': ['off', {
      allowNamedFunctions: false,
      allowUnboundThis: true,
    }],
    'prefer-const': ['off', {
      destructuring: 'any',
      ignoreReadBeforeAssign: false,
    }],
    'prefer-destructuring': ['off', {
      VariableDeclarator: {
        array: true,
        object: true,
      },
      AssignmentExpression: {
        array: true,
        object: true,
      },
    }, {
      enforceForRenamedProperties: true,
    }],
    'prefer-exponentiation-operator': ['off'],
    'prefer-named-capture-group': ['off'],
    'prefer-numeric-literals': ['off'],
    'prefer-object-has-own': ['off'],
    'prefer-object-spread': ['off'],
    'prefer-promise-reject-errors': ['off', {
      allowEmptyReject: false,
    }],
    'prefer-regex-literals': ['off', {
      disallowRedundantWrapping: true,
    }],
    'prefer-rest-params': ['off'],
    'prefer-spread': ['off'],
    'prefer-template': ['warn'],
    'quote-props': ['warn', 'as-needed', {
      keywords: false,
      unnecessary: true,
      numbers: false,
    }],
    radix: ['off', 'always'],
    'require-await': ['off'],
    'require-unicode-regexp': ['off'],
    'require-yield': ['off'],
    'sort-imports': ['off', {
      ignoreCase: true,
      ignoreDeclarationSort: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      allowSeparatedGroups: false,
    }],
    'sort-keys': ['off', 'asc', {
      caseSensitive: false,
      minKeys: 2,
      natural: true,
      allowLineSeparatedGroups: true,
    }],
    'sort-vars': ['off', {
      ignoreCase: true,
    }],
    'spaced-comment': ['warn', 'always', {
      line: {
        markers: ['/'],
        exceptions: ['-', '+'],
      },
      block: {
        markers: ['!'],
        exceptions: ['*'],
        balanced: true,
      },
    }],
    strict: ['off', 'safe'],
    'symbol-description': ['off'],
    'vars-on-top': ['off'],
    yoda: ['warn', 'never', {
      exceptRange: true,
      onlyEquality: true,
    }],

    /**
     * Layout & Formatting
     * 布局和格式
     */
    'array-bracket-newline': ['warn', 'consistent'],
    'array-bracket-spacing': ['warn', 'never', {
      singleValue: false,
      objectsInArrays: false,
      arraysInArrays: false,
    }],
    'array-element-newline': ['off', {
      ArrayExpression: 'consistent',
      ArrayPattern: 'consistent',
    }],
    'arrow-parens': ['off', 'as-needed', {
      requireForBlockBody: true,
    }],
    'arrow-spacing': ['warn', {
      before: true,
      after: true,
    }],
    'block-spacing': ['warn', 'always'],
    'brace-style': ['warn', '1tbs', {
      allowSingleLine: true,
    }],
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'comma-spacing': ['warn', {
      before: false,
      after: true,
    }],
    'comma-style': ['warn', 'last', {
      exceptions: {},
    }],
    'computed-property-spacing': ['warn', 'never', {
      enforceForClassMembers: true,
    }],
    'dot-location': ['warn', 'property'],
    'eol-last': ['warn', 'always'],
    'func-call-spacing': ['warn', 'never'],
    'function-call-argument-newline': ['warn', 'consistent'],
    'function-paren-newline': ['warn', 'consistent'],
    'generator-star-spacing': ['warn', {
      before: false,
      after: true,
      anonymous: { before: false, after: true },
      method: { before: false, after: true },
    }],
    'implicit-arrow-linebreak': ['warn', 'beside'],
    indent: ['warn', 2, {
      ignoredNodes: [],
      SwitchCase: 1,
      VariableDeclarator: { var: 1, let: 1, const: 1 },
      outerIIFEBody: 1,
      MemberExpression: 1,
      FunctionDeclaration: { parameters: 1, body: 1 },
      FunctionExpression: { parameters: 1, body: 1 },
      StaticBlock: { body: 1 },
      CallExpression: { arguments: 1 },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      offsetTernaryExpressions: false,
      ignoreComments: false,
    }],
    'jsx-quotes': ['warn', 'prefer-double'],
    'key-spacing': ['warn', {
      beforeColon: false,
      afterColon: true,
      mode: 'strict',
    }],
    'keyword-spacing': ['warn', {
      before: true,
      after: true,
      overrides: {},
    }],
    'line-comment-position': ['off', {
      position: 'above',
      ignorePattern: '',
      applyDefaultIgnorePatterns: true,
    }],
    'linebreak-style': ['off', 'unix'],
    'lines-around-comment': ['off', {
      beforeBlockComment: false,
      afterBlockComment: false,
      beforeLineComment: false,
      afterLineComment: false,
      allowBlockStart: true,
      allowBlockEnd: true,
      allowObjectStart: true,
      allowObjectEnd: true,
      allowArrayStart: true,
      allowArrayEnd: true,
      allowClassStart: true,
      allowClassEnd: true,
      applyDefaultIgnorePatterns: true,
      ignorePattern: '',
      afterHashbangComment: false,
    }],
    'lines-between-class-members': ['off', 'always', {
      exceptAfterSingleLine: false,
    }],
    'max-len': ['off', {
      code: 80,
      tabWidth: 2,
      comments: 80,
      ignorePattern: '',
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    'max-statements-per-line': ['off', {
      max: 1,
    }],
    'multiline-ternary': ['off', 'always-multiline'],
    'new-parens': ['warn', 'always'],
    'newline-per-chained-call': ['off', {
      ignoreChainWithDepth: 1,
    }],
    'no-extra-parens': ['off', 'all', {
      conditionalAssign: false,
      returnAssign: false,
      nestedBinaryExpressions: false,
      ternaryOperandBinaryExpressions: false,
      ignoreJSX: 'none',
      enforceForArrowConditionals: false,
      enforceForSequenceExpressions: false,
      enforceForNewInMemberExpressions: false,
      enforceForFunctionPrototypeMethods: false,
      allowParensAfterCommentPattern: '',
    }],
    'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
    'no-multi-spaces': ['warn', {
      ignoreEOLComments: false,
      exceptions: {},
    }],
    'no-multiple-empty-lines': ['warn', {
      max: 1,
      maxBOF: 0,
      maxEOF: 0,
    }],
    'no-tabs': ['off', {
      allowIndentationTabs: false,
    }],
    'no-trailing-spaces': ['warn', {
      skipBlankLines: false,
      ignoreComments: false,
    }],
    'no-whitespace-before-property': ['warn'],
    'nonblock-statement-body-position': ['off', 'beside', {
      overrides: {},
    }],
    'object-curly-newline': ['off', {
      ObjectExpression: { multiline: true },
      ObjectPattern: { multiline: true },
      ImportDeclaration: { multiline: true },
      ExportDeclaration: { multiline: true },
    }],
    'object-curly-spacing': ['warn', 'always', {
      arraysInObjects: true,
      objectsInObjects: true,
    }],
    'object-property-newline': ['off', {
      allowAllPropertiesOnSameLine: true,
    }],
    'operator-linebreak': ['warn', 'before', {
      overrides: {},
    }],
    'padded-blocks': ['warn', {
      blocks: 'never',
      classes: 'never',
      switches: 'never',
    }, {
      allowSingleLineBlocks: true,
    }],
    'padding-line-between-statements': ['off', ...[]],
    quotes: ['warn', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true,
    }],
    'rest-spread-spacing': ['warn', 'never'],
    semi: ['warn', 'always', {
      omitLastInOneLineBlock: false,
    }],
    'semi-spacing': ['warn', {
      before: false,
      after: true,
    }],
    'semi-style': ['warn', 'last'],
    'space-before-blocks': ['warn', {
      functions: 'always',
      keywords: 'always',
      classes: 'always',
    }],
    'space-before-function-paren': ['warn', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'space-in-parens': ['warn', 'never', {
      exceptions: [],
    }],
    'space-infix-ops': ['warn', {
      int32Hint: false,
    }],
    'space-unary-ops': ['warn', {
      words: true,
      nonwords: false,
      overrides: {},
    }],
    'switch-colon-spacing': ['warn', {
      before: false,
      after: true,
    }],
    'template-curly-spacing': ['warn', 'never'],
    'template-tag-spacing': ['warn', 'never'],
    'unicode-bom': ['warn', 'never'],
    'wrap-iife': ['warn', 'inside', {
      functionPrototypeMethods: true,
    }],
    'wrap-regex': ['off'],
    'yield-star-spacing': ['warn', {
      before: false,
      after: true,
    }],
  },
};

export const eslint9 = Object.create(null);
eslint9.merge = function (...sources) {
  let result = {};
  for (const source of sources) {
    _Object.deepAssign(result, source);
  }
  return result;
};
eslint9.baseConfig = _Object.deepAssign({}, eslint.baseConfig, {
  languageOptions: {
    ecmaVersion: 'latest',
  },
  linterOptions: {
    noInlineConfig: false,
    reportUnusedDisableDirectives: true,
  },
});

export const eslint8 = Object.create(null);
eslint8.merge = function (...sources) {
  const result = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      // 特殊字段处理
      if (key === 'rules') {
        // console.log({ key, value, 'result[key]': result[key] });
        // 初始不存在时赋默认值用于合并
        result[key] = result[key] ?? {};
        // 对各条规则处理
        for (let [ruleKey, ruleValue] of Object.entries(value)) {
          // 已有值统一成数组处理
          let sourceRuleValue = result[key][ruleKey] ?? [];
          if (!Array.isArray(sourceRuleValue)) {
            sourceRuleValue = [sourceRuleValue];
          }
          // 要合并的值统一成数组处理
          if (!Array.isArray(ruleValue)) {
            ruleValue = [ruleValue];
          }
          // 统一格式后进行数组循环操作
          for (const [valIndex, val] of Object.entries(ruleValue)) {
            // 对象深合并，其他直接赋值
            if (_Object.isPlainObject(val)) {
              sourceRuleValue[valIndex] = _Object.deepAssign(sourceRuleValue[valIndex] ?? {}, val);
            } else {
              sourceRuleValue[valIndex] = val;
            }
          }
          // 赋值规则结果
          result[key][ruleKey] = sourceRuleValue;
        }
        continue;
      }
      // 其他字段根据类型判断处理
      // 数组：拼接
      if (Array.isArray(value)) {
        (result[key] = result[key] ?? []).push(...value);
        continue;
      }
      // 其他对象：深合并
      if (_Object.isPlainObject(value)) {
        _Object.deepAssign(result[key] = result[key] ?? {}, value);
        continue;
      }
      // 其他直接赋值
      result[key] = value;
    }
  }
  return result;
};
// 基础配置
eslint8.baseConfig = _Object.deepAssign({}, eslint.baseConfig, {
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
      jsx: true,
    },
  },
});
// vue2/vue3 共用
eslint8.vueBaseConfig = {
  rules: {
    // Priority A: Essential
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'off',
    'vue/require-render-return': 'warn',
    'vue/require-v-for-key': 'off',
    'vue/return-in-computed-property': 'warn',
    'vue/valid-template-root': 'off',
    'vue/valid-v-for': 'off',

    // Priority B: Strongly Recommended
    'vue/attribute-hyphenation': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/html-quotes': ['warn', 'double', { avoidEscape: true }],
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': ['warn', { singleline: Infinity, multiline: 1 }],
    'vue/multiline-html-element-content-newline': 'off',
    'vue/prop-name-casing': 'off',
    'vue/require-default-prop': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/v-bind-style': 'off',
    'vue/v-on-style': 'off',
    'vue/v-slot-style': 'off',

    // Priority C: Recommended
    'vue/no-v-html': 'off',

    // Uncategorized
    'vue/block-tag-newline': 'warn',
    'vue/html-comment-content-spacing': 'warn',
    'vue/script-indent': ['warn', 2, { baseIndent: 1, switchCase: 1 }],

    // Extension Rules。对应eslint的同名规则，适用于<template>中的表达式
    'vue/array-bracket-spacing': 'warn',
    'vue/block-spacing': 'warn',
    'vue/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    'vue/comma-dangle': ['warn', 'always-multiline'],
    'vue/comma-spacing': 'warn',
    'vue/comma-style': 'warn',
    'vue/func-call-spacing': 'warn',
    'vue/key-spacing': 'warn',
    'vue/keyword-spacing': 'warn',
    'vue/object-curly-newline': ['warn', { multiline: true, consistent: true }],
    'vue/object-curly-spacing': ['warn', 'always'],
    'vue/space-in-parens': 'warn',
    'vue/space-infix-ops': 'warn',
    'vue/space-unary-ops': 'warn',
    'vue/arrow-spacing': 'warn',
    'vue/prefer-template': 'warn',
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
  ],
};
// vue2 用
eslint8.vue2Config = eslint8.merge(eslint8.vueBaseConfig, {
  extends: [
    // 使用 vue2 推荐的规则
    'plugin:vue/recommended',
  ],
});
// vue3 用
eslint8.vue3Config = eslint8.merge(eslint8.vueBaseConfig, {
  env: {
    'vue/setup-compiler-macros': true,
  },
  extends: [
    // 使用 vue3 推荐的规则
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    // Priority A: Essential
    'vue/no-template-key': 'off',

    // Priority A: Essential for Vue.js 3.x
    'vue/return-in-emits-validator': 'warn',

    // Priority B: Strongly Recommended for Vue.js 3.x
    'vue/require-explicit-emits': 'off',
    'vue/v-on-event-hyphenation': 'off',
  },
});
