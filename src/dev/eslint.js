/**
 * [eslint 配置](https://zh-hans.eslint.org/docs/latest/rules/)
 * [eslint-plugin-vue 配置](https://eslint.vuejs.org/rules/)
 */
import { _Object } from '../base';

const eslint = Object.create(null);
eslint.createMerge = function ({ simpleKeys = [], objectKeys = [], arrayKeys = [] } = {}) {
  return function merge(...sources) {
    const result = {};

    for (const source of sources) {
      for (let [key, value] of Object.entries(source)) {
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
            // 规则值格式统一成字符串
            for (const arr of [ruleValueResult, ruleValue]) {
              if (typeof arr[0] === 'number') {
                arr[0] = { 0: 'off', 1: 'warn', 2: 'error' }[arr[0]];
              }
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
        // 其他属性：直接赋值
        result[key] = value;
      }
    }

    return result;
  };
};
// 基础配置
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
// vue 通用
eslint.vueBaseConfig = {
  rules: {
    // 'Base Rules',
    'vue/comment-directive': ['off', {
      reportUnusedDisableDirectives: true,
    }],
    'vue/jsx-uses-vars': ['off'],

    // 'Priority A: Essential',
    'vue/multi-word-component-names': ['off', {
      ignores: [],
    }],
    'vue/no-arrow-functions-in-watch': ['error'],
    'vue/no-async-in-computed-properties': ['error'],
    'vue/no-child-content': ['error', ...[]],
    'vue/no-computed-properties-in-data': ['error'],
    'vue/no-dupe-keys': ['error', {
      groups: [],
    }],
    'vue/no-dupe-v-else-if': ['error'],
    'vue/no-duplicate-attributes': ['error', {
      allowCoexistClass: true,
      allowCoexistStyle: true,
    }],
    'vue/no-export-in-script-setup': ['error'],
    'vue/no-mutating-props': ['error'],
    'vue/no-parsing-error': ['error', {
      'abrupt-closing-of-empty-comment': true,
      'absence-of-digits-in-numeric-character-reference': true,
      'cdata-in-html-content': true,
      'character-reference-outside-unicode-range': true,
      'control-character-in-input-stream': true,
      'control-character-reference': true,
      'eof-before-tag-name': true,
      'eof-in-cdata': true,
      'eof-in-comment': true,
      'eof-in-tag': true,
      'incorrectly-closed-comment': true,
      'incorrectly-opened-comment': true,
      'invalid-first-character-of-tag-name': true,
      'missing-attribute-value': true,
      'missing-end-tag-name': true,
      'missing-semicolon-after-character-reference': true,
      'missing-whitespace-between-attributes': true,
      'nested-comment': true,
      'noncharacter-character-reference': true,
      'noncharacter-in-input-stream': true,
      'null-character-reference': true,
      'surrogate-character-reference': true,
      'surrogate-in-input-stream': true,
      'unexpected-character-in-attribute-name': true,
      'unexpected-character-in-unquoted-attribute-value': true,
      'unexpected-equals-sign-before-attribute-name': true,
      'unexpected-null-character': true,
      'unexpected-question-mark-instead-of-tag-name': true,
      'unexpected-solidus-in-tag': true,
      'unknown-named-character-reference': true,
      'end-tag-with-attributes': true,
      'duplicate-attribute': true,
      'end-tag-with-trailing-solidus': true,
      'non-void-html-element-start-tag-with-trailing-solidus': false,
      'x-invalid-end-tag': true,
      'x-invalid-namespace': true,
    }],
    'vue/no-ref-as-operand': ['error'],
    'vue/no-reserved-component-names': ['error', {
      disallowVueBuiltInComponents: true,
      disallowVue3BuiltInComponents: true,
    }],
    'vue/no-reserved-keys': ['error', {
      reserved: [],
      groups: [],
    }],
    'vue/no-reserved-props': ['error', {
      vueVersion: 3,
    }],
    'vue/no-shared-component-data': ['error'],
    'vue/no-side-effects-in-computed-properties': ['error'],
    'vue/no-template-key': ['error'],
    'vue/no-textarea-mustache': ['error'],
    'vue/no-unused-components': ['warn', {
      ignoreWhenBindingPresent: true,
    }],
    'vue/no-unused-vars': ['off', {
      ignorePattern: '^_',
    }],
    'vue/no-use-computed-property-like-method': ['error'],
    'vue/no-use-v-if-with-v-for': ['error', {
      allowUsingIterationVar: false,
    }],
    'vue/no-useless-template-attributes': ['error'],
    'vue/no-v-text-v-html-on-component': ['off', {
      allow: ['router-link', 'nuxt-link'],
    }],
    'vue/require-component-is': ['error'],
    'vue/require-prop-type-constructor': ['error'],
    'vue/require-render-return': ['error'],
    'vue/require-v-for-key': ['warn'],
    'vue/require-valid-default-prop': ['error'],
    'vue/return-in-computed-property': ['error', {
      treatUndefinedAsUnspecified: true,
    }],
    'vue/return-in-emits-validator': ['error'],
    'vue/use-v-on-exact': ['error'],
    'vue/valid-attribute-name': ['error'],
    'vue/valid-define-emits': ['error'],
    'vue/valid-define-props': ['error'],
    'vue/valid-next-tick': ['error'],
    'vue/valid-template-root': ['error'],
    'vue/valid-v-bind': ['error'],
    'vue/valid-v-cloak': ['error'],
    'vue/valid-v-else-if': ['error'],
    'vue/valid-v-else': ['error'],
    'vue/valid-v-for': ['error'],
    'vue/valid-v-html': ['error'],
    'vue/valid-v-if': ['error'],
    'vue/valid-v-model': ['error'],
    'vue/valid-v-on': ['error', {
      modifiers: [],
    }],
    'vue/valid-v-once': ['error'],
    'vue/valid-v-pre': ['error'],
    'vue/valid-v-show': ['error'],
    'vue/valid-v-slot': ['error', {
      allowModifiers: false,
    }],
    'vue/valid-v-text': ['error'],

    // 'Priority B: Strongly Recommended',
    'vue/attribute-hyphenation': ['warn', 'always', {
      ignore: [],
    }],
    'vue/component-definition-name-casing': ['warn', 'PascalCase'],
    'vue/first-attribute-linebreak': ['warn', {
      singleline: 'beside',
      multiline: 'below',
    }],
    'vue/html-closing-bracket-newline': ['warn', {
      singleline: 'never',
      multiline: 'always',
      selfClosingTag: {
        singleline: 'never',
        multiline: 'always',
      },
    }],
    'vue/html-closing-bracket-spacing': ['warn', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always',
    }],
    'vue/html-end-tags': ['warn'],
    'vue/html-indent': ['warn', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    }],
    'vue/html-quotes': ['warn', 'double', {
      avoidEscape: true,
    }],
    'vue/html-self-closing': ['off', {
      html: {
        void: 'never',
        normal: 'always',
        component: 'always',
      },
      svg: 'always',
      math: 'always',
    }],
    'vue/max-attributes-per-line': ['warn', {
      singleline: {
        max: Infinity,
      },
      multiline: {
        max: 1,
      },
    }],
    'vue/multiline-html-element-content-newline': ['warn', {
      ignoreWhenEmpty: true,
      ignores: ['pre', 'textarea'],
      allowEmptyLines: false,
    }],
    'vue/mustache-interpolation-spacing': ['warn', 'always'],
    'vue/no-multi-spaces': ['warn', {
      ignoreProperties: false,
    }],
    'vue/no-spaces-around-equal-signs-in-attribute': ['warn'],
    'vue/no-template-shadow': ['warn', {
      allow: [],
    }],
    'vue/one-component-per-file': ['warn'],
    'vue/prop-name-casing': ['warn', 'camelCase'],
    'vue/require-default-prop': ['off'],
    'vue/require-prop-types': ['off'],
    'vue/singleline-html-element-content-newline': ['off', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignores: ['pre', 'textarea'],
      externalIgnores: [],
    }],
    'vue/v-bind-style': ['warn', 'shorthand', {
      sameNameShorthand: 'ignore',
    }],
    'vue/v-on-style': ['warn', 'shorthand'],
    'vue/v-slot-style': ['warn', {
      atComponent: 'v-slot',
      default: 'shorthand',
      named: 'shorthand',
    }],

    // 'Priority C: Recommended',
    'vue/attributes-order': ['warn', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        ['UNIQUE', 'SLOT'],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT',
      ],
      alphabetical: false,
    }],
    'vue/no-lone-template': ['off', {
      ignoreAccessible: false,
    }],
    'vue/no-multiple-slot-args': ['off'],
    'vue/no-v-html': ['off'],
    'vue/order-in-components': ['warn', {
      order: [
        'el',
        'name',
        'key',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        ['provide', 'inject'],
        'ROUTER_GUARDS',
        'layout',
        'middleware',
        'validate',
        'scrollToTop',
        'transition',
        'loading',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'emits',
        'setup',
        'asyncData',
        'data',
        'fetch',
        'head',
        'computed',
        'watch',
        'watchQuery',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError',
      ],
    }],
    'vue/this-in-template': ['off', 'never'],

    // 'Uncategorized',
    'vue/block-lang': ['off', ...[]],
    'vue/block-order': ['off', {
      order: [
        'template',
        'script:not([setup])',
        'script[setup]',
        'style:not([scoped])',
        'style[scoped]',
      ],
    }],
    'vue/block-tag-newline': ['warn', {
      singleline: 'consistent',
      multiline: 'always',
      maxEmptyLines: 0,
      blocks: {},
    }],
    'vue/component-api-style': ['off', ['script-setup', 'composition']],
    'vue/component-name-in-template-casing': ['off', 'PascalCase', {
      registeredComponentsOnly: true,
      ignores: [],
    }],
    'vue/component-options-name-casing': ['off', 'PascalCase'],
    'vue/custom-event-name-casing': ['off', 'camelCase', {
      ignores: [],
    }],
    'vue/define-emits-declaration': ['off', 'type-based'],
    'vue/define-macros-order': ['warn', {
      order: [
        'defineOptions',
        'defineModel',
        'defineProps',
        'defineEmits',
        'defineSlots',
      ],
      defineExposeLast: true,
    }],
    'vue/define-props-declaration': ['off', 'type-based'],
    'vue/enforce-style-attribute': ['off', {
      allow: ['scoped', 'module', 'plain'],
    }],
    'vue/html-button-has-type': ['off', {
      button: true,
      submit: true,
      reset: true,
    }],
    'vue/html-comment-content-newline': ['warn', {
      singleline: 'never',
      multiline: 'always',
    }, {
      exceptions: [],
    }],
    'vue/html-comment-content-spacing': ['warn', 'always', {
      exceptions: [],
    }],
    'vue/html-comment-indent': ['warn', 2],
    'vue/match-component-file-name': ['off', {
      extensions: ['jsx'],
      shouldMatchCase: false,
    }],
    'vue/match-component-import-name': ['warn'],
    'vue/max-lines-per-block': ['off', {
      template: Infinity,
      style: Infinity,
      script: Infinity,
      skipBlankLines: true,
    }],
    'vue/new-line-between-multi-line-property': ['off', {
      minLineOfMultilineProperty: 2,
    }],
    'vue/next-tick-style': ['off', 'promise'],
    'vue/no-bare-strings-in-template': ['off', {
      allowlist: ['(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}', '<', '>', '\u00b7', '\u2022', '\u2010', '\u2013', '\u2014', '\u2212', '|'],
      attributes: {
        '/.+/': ['title', 'aria-label', 'aria-placeholder', 'aria-roledescription', 'aria-valuetext'],
        input: ['placeholder'],
        img: ['alt'],
      },
      directives: ['v-text'],
    }],
    'vue/no-boolean-default': ['off', 'no-default'],
    'vue/no-deprecated-model-definition': ['error', {
      allowVue3Compat: true,
    }],
    'vue/no-duplicate-attr-inheritance': ['warn'],
    'vue/no-empty-component-block': ['off'],
    'vue/no-multiple-objects-in-class': ['off'],
    'vue/no-potential-component-option-typo': ['off', {
      presets: ['all'],
      custom: [],
      threshold: 1,
    }],
    'vue/no-ref-object-reactivity-loss': ['off'],
    'vue/no-required-prop-with-default': ['off', {
      autofix: false,
    }],
    'vue/no-restricted-block': ['off', ...[]],
    'vue/no-restricted-call-after-await': ['off', ...[]],
    'vue/no-restricted-class': ['off', ...[]],
    'vue/no-restricted-component-names': ['off', ...[]],
    'vue/no-restricted-component-options': ['off', ...[]],
    'vue/no-restricted-custom-event': ['off', ...[]],
    'vue/no-restricted-html-elements': ['off', ...[]],
    'vue/no-restricted-props': ['off', ...[]],
    'vue/no-restricted-static-attribute': ['off', ...[]],
    'vue/no-restricted-v-bind': ['off', ...[]],
    'vue/no-restricted-v-on': ['off', ...[]],
    'vue/no-root-v-if': ['off'],
    'vue/no-setup-props-reactivity-loss': ['off'],
    'vue/no-static-inline-styles': ['off', {
      allowBinding: false,
    }],
    'vue/no-template-target-blank': ['warn', {
      allowReferrer: false,
      enforceDynamicLinks: 'always',
    }],
    'vue/no-this-in-before-route-enter': ['error'],
    'vue/no-undef-components': ['off', {
      ignorePatterns: [],
    }],
    'vue/no-undef-properties': ['off'],
    'vue/no-unsupported-features': ['off', ...[]],
    'vue/no-unused-emit-declarations': ['off'],
    'vue/no-unused-properties': ['off'],
    'vue/no-unused-refs': ['off'],
    'vue/no-use-v-else-with-v-for': ['warn'],
    'vue/no-useless-mustaches': ['off', {
      ignoreIncludesComment: false,
      ignoreStringEscape: false,
    }],
    'vue/no-useless-v-bind': ['off', {
      ignoreIncludesComment: false,
      ignoreStringEscape: false,
    }],
    'vue/no-v-text': ['off'],
    'vue/padding-line-between-blocks': ['off', 'always'],
    'vue/padding-line-between-tags': ['off', [
      { blankLine: 'always', prev: '*', next: '*' },
    ]],
    'vue/padding-lines-in-component-definition': ['off', ...[]],
    'vue/prefer-define-options': ['warn'],
    'vue/prefer-prop-type-boolean-first': ['off'],
    'vue/prefer-separate-static-class': ['off'],
    'vue/prefer-true-attribute-shorthand': ['off', 'always'],
    'vue/require-direct-export': ['off', {
      disallowFunctionalComponentFunction: false,
    }],
    'vue/require-emit-validator': ['off'],
    'vue/require-explicit-slots': ['off'],
    'vue/require-expose': ['off'],
    'vue/require-macro-variable-name': ['warn', {
      defineProps: 'props',
      defineEmits: 'emit',
      defineSlots: 'slots',
      useSlots: 'slots',
      useAttrs: 'attrs',
    }],
    'vue/require-name-property': ['warn'],
    'vue/require-prop-comment': ['off', {
      type: 'any',
    }],
    'vue/require-typed-object-prop': ['off'],
    'vue/require-typed-ref': ['off'],
    'vue/script-indent': ['warn', 2, {
      baseIndent: 1,
      switchCase: 1,
      ignores: [],
    }],
    'vue/sort-keys': ['off'],
    'vue/static-class-names-order': ['off'],
    'vue/v-for-delimiter-style': ['off', 'in'],
    'vue/v-if-else-key': ['off'],
    'vue/v-on-handler-style': ['off', ['method', 'inline-function'], {
      ignoreIncludesComment: false,
    }],
    'vue/valid-define-options': ['warn'],

    // 'Extension Rules',
    'vue/array-bracket-newline': eslint.baseConfig.rules['array-bracket-newline'],
    'vue/array-bracket-spacing': eslint.baseConfig.rules['array-bracket-spacing'],
    'vue/array-element-newline': eslint.baseConfig.rules['array-element-newline'],
    'vue/arrow-spacing': eslint.baseConfig.rules['arrow-spacing'],
    'vue/block-spacing': eslint.baseConfig.rules['block-spacing'],
    'vue/brace-style': eslint.baseConfig.rules['brace-style'],
    'vue/camelcase': eslint.baseConfig.rules['camelcase'],
    'vue/comma-dangle': eslint.baseConfig.rules['comma-dangle'],
    'vue/comma-spacing': eslint.baseConfig.rules['comma-spacing'],
    'vue/comma-style': eslint.baseConfig.rules['comma-style'],
    'vue/dot-location': eslint.baseConfig.rules['dot-location'],
    'vue/dot-notation': eslint.baseConfig.rules['dot-notation'],
    'vue/eqeqeq': eslint.baseConfig.rules['eqeqeq'],
    'vue/func-call-spacing': eslint.baseConfig.rules['func-call-spacing'],
    'vue/key-spacing': eslint.baseConfig.rules['key-spacing'],
    'vue/keyword-spacing': eslint.baseConfig.rules['keyword-spacing'],
    'vue/max-len': [
      eslint.baseConfig.rules['max-len'][0],
      {
        ...eslint.baseConfig.rules['max-len'][1],
        template: 80,
        ignoreHTMLAttributeValues: false,
        ignoreHTMLTextContents: false,
      },
      ...eslint.baseConfig.rules['max-len'].slice(2),
    ],
    'vue/multiline-ternary': eslint.baseConfig.rules['multiline-ternary'],
    'vue/no-console': eslint.baseConfig.rules['no-console'],
    'vue/no-constant-condition': eslint.baseConfig.rules['no-constant-condition'],
    'vue/no-empty-pattern': eslint.baseConfig.rules['no-empty-pattern'],
    'vue/no-extra-parens': eslint.baseConfig.rules['no-extra-parens'],
    'vue/no-irregular-whitespace': [
      eslint.baseConfig.rules['no-irregular-whitespace'][0],
      {
        ...eslint.baseConfig.rules['no-irregular-whitespace'][1],
        skipHTMLAttributeValues: false,
        skipHTMLTextContents: false,
      },
      ...eslint.baseConfig.rules['no-irregular-whitespace'].slice(2),
    ],
    'vue/no-loss-of-precision': eslint.baseConfig.rules['no-loss-of-precision'],
    'vue/no-restricted-syntax': eslint.baseConfig.rules['no-restricted-syntax'],
    'vue/no-sparse-arrays': eslint.baseConfig.rules['no-sparse-arrays'],
    'vue/no-useless-concat': eslint.baseConfig.rules['no-useless-concat'],
    'vue/object-curly-newline': eslint.baseConfig.rules['object-curly-newline'],
    'vue/object-curly-spacing': eslint.baseConfig.rules['object-curly-spacing'],
    'vue/object-property-newline': eslint.baseConfig.rules['object-property-newline'],
    'vue/object-shorthand': eslint.baseConfig.rules['object-shorthand'],
    'vue/operator-linebreak': eslint.baseConfig.rules['operator-linebreak'],
    'vue/prefer-template': eslint.baseConfig.rules['prefer-template'],
    'vue/quote-props': eslint.baseConfig.rules['quote-props'],
    'vue/space-in-parens': eslint.baseConfig.rules['space-in-parens'],
    'vue/space-infix-ops': eslint.baseConfig.rules['space-infix-ops'],
    'vue/space-unary-ops': eslint.baseConfig.rules['space-unary-ops'],
    'vue/template-curly-spacing': eslint.baseConfig.rules['template-curly-spacing'],

    // 冲突规则处理
    indent: ['off'], // 使用 vue/script-indent
  },
};
// vue3 用
eslint.vue3Config = _Object.deepAssign({}, eslint.vueBaseConfig, {
  rules: {
    // 'Priority A: Essential for Vue.js 3.x',
    'vue/no-deprecated-data-object-declaration': ['error'],
    'vue/no-deprecated-destroyed-lifecycle': ['error'],
    'vue/no-deprecated-dollar-listeners-api': ['error'],
    'vue/no-deprecated-dollar-scopedslots-api': ['error'],
    'vue/no-deprecated-events-api': ['error'],
    'vue/no-deprecated-filter': ['error'],
    'vue/no-deprecated-functional-template': ['error'],
    'vue/no-deprecated-html-element-is': ['error'],
    'vue/no-deprecated-inline-template': ['error'],
    'vue/no-deprecated-props-default-this': ['error'],
    'vue/no-deprecated-router-link-tag-prop': ['error', {
      components: ['RouterLink'],
    }],
    'vue/no-deprecated-scope-attribute': ['error'],
    'vue/no-deprecated-slot-attribute': ['error', {
      ignore: [],
    }],
    'vue/no-deprecated-slot-scope-attribute': ['error'],
    'vue/no-deprecated-v-bind-sync': ['error'],
    'vue/no-deprecated-v-is': ['error'],
    'vue/no-deprecated-v-on-native-modifier': ['error'],
    'vue/no-deprecated-v-on-number-modifiers': ['error'],
    'vue/no-deprecated-vue-config-keycodes': ['error'],
    'vue/no-expose-after-await': ['error'],
    'vue/no-lifecycle-after-await': ['error'],
    'vue/no-v-for-template-key-on-child': ['error'],
    'vue/no-watch-after-await': ['error'],
    'vue/prefer-import-from-vue': ['error'],
    'vue/require-slots-as-functions': ['error'],
    'vue/require-toggle-inside-transition': ['error'],
    'vue/valid-v-is': ['error'],
    'vue/valid-v-memo': ['error'],

    // 'Priority B: Strongly Recommended for Vue.js 3.x',
    'vue/require-explicit-emits': ['warn', {
      allowProps: false,
    }],
    'vue/v-on-event-hyphenation': ['warn', 'always', {
      autofix: false,
      ignore: [],
    }],
  },
});
// vue2 用
eslint.vue2Config = _Object.deepAssign({}, eslint.vueBaseConfig, {
  rules: {
    // 'Priority A: Essential for Vue.js 2.x',
    'vue/no-custom-modifiers-on-v-model': ['error'],
    'vue/no-multiple-template-root': ['error'],
    'vue/no-v-for-template-key': ['error'],
    'vue/no-v-model-argument': ['error'],
    'vue/valid-model-definition': ['error'],
    'vue/valid-v-bind-sync': ['error'],
  },
});

export const eslint9 = Object.create(eslint);
eslint9.merge = eslint.createMerge({
  simpleKeys: ['processor', 'parser', 'parserOptions'],
  objectKeys: ['languageOptions', 'linterOptions', 'plugins', 'settings'],
  arrayKeys: ['files', 'ignores'],
});
eslint9.baseConfig = _Object.deepAssign({}, eslint.baseConfig, {
  languageOptions: {
    ecmaVersion: 'latest',
  },
  linterOptions: {
    noInlineConfig: false,
    reportUnusedDisableDirectives: true,
  },
});

export const eslint8 = Object.create(eslint);
eslint8.merge = eslint.createMerge({
  simpleKeys: ['root', 'parser', 'parserOptions'],
  objectKeys: ['env', 'globals', 'settings'],
  arrayKeys: ['extends', 'plugins', 'ignorePatterns', 'overrides'],
});
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
