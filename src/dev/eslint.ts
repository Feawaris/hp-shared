// @ts-nocheck
import { _Object, _console } from '../base';
import { Lint } from './base';
import path from 'node:path';
import serialize from 'serialize-javascript';

export class EsLint extends Lint {
  /**
   *
   * @param eslintVersion
   * @param configFile
   * @param ignoreFile
   * @param restOptions
   */
  constructor({
    eslintVersion,
    configFile = eslintVersion === 9 ? 'eslint.config.cjs' : '.eslintrc.cjs',
    ignoreFile = '',
    ...restOptions
  } = {}) {
    super({ configFile, ignoreFile, ...restOptions });

    this.eslintVersion = Number(eslintVersion);
    if (!this.eslintVersion) {
      _console.error('缺少参数: eslintVersion');
    }

    const $this = this;
    this.baseConfig = {
      ...(() => {
        if (this.eslintVersion === 8) {
          return {
            parser: 'espree',
            parserOptions: {
              ecmaVersion: 'latest',
              sourceType: 'module',
              ecmaFeatures: {
                jsx: true,
                globalReturn: false,
                impliedStrict: false,
              },
            },
          };
        }
        if (this.eslintVersion === 9) {
          return {
            languageOptions: {
              ecmaVersion: 'latest',
              sourceType: 'module',
              globals: {},
              // parser: espree,
              parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                  jsx: true,
                  globalReturn: false,
                  impliedStrict: false,
                },
              },
            },
            linterOptions: {
              noInlineConfig: false,
              reportUnusedDisableDirectives: true,
            },
          };
        }
        return {};
      })(),
      rules: {
        /**
         * Possible Problems
         * 可能出现的问题
         */
        'array-callback-return': [
          'warn',
          {
            allowImplicit: false,
            checkForEach: true,
            allowVoid: true,
          },
        ],
        'constructor-super': ['error'],
        'for-direction': ['error'],
        'getter-return': [
          'warn',
          {
            allowImplicit: false,
          },
        ],
        'no-async-promise-executor': ['error'],
        'no-await-in-loop': ['off'],
        'no-class-assign': ['error'],
        'no-compare-neg-zero': ['error'],
        'no-cond-assign': ['error', 'except-parens'],
        'no-const-assign': ['error'],
        'no-constant-binary-expression': ['error'],
        'no-constant-condition': [
          'error',
          {
            checkLoops: false,
          },
        ],
        'no-constructor-return': ['error'],
        'no-control-regex': ['off'],
        'no-debugger': ['off'],
        'no-dupe-args': ['error'],
        'no-dupe-class-members': ['error'],
        'no-dupe-else-if': ['error'],
        'no-dupe-keys': ['error'],
        'no-duplicate-case': ['error'],
        'no-duplicate-imports': [
          'off',
          {
            includeExports: false,
          },
        ],
        'no-empty-character-class': ['off'],
        'no-empty-pattern': [
          'off',
          {
            allowObjectPatternsAsParameters: true,
          },
        ],
        'no-ex-assign': ['error'],
        'no-fallthrough': [
          'off',
          {
            commentPattern: 'falls?\\s*through',
            allowEmptyCase: true,
            reportUnusedFallthroughComment: true,
          },
        ],
        'no-func-assign': ['error'],
        'no-import-assign': ['error'],
        'no-inner-declarations': ['error', 'both'],
        'no-invalid-regexp': [
          'off',
          {
            allowConstructorFlags: [],
          },
        ],
        'no-irregular-whitespace': [
          'error',
          {
            skipStrings: true,
            skipComments: true,
            skipRegExps: true,
            skipTemplates: true,
            skipJSXText: true,
          },
        ],
        'no-loss-of-precision': ['error'],
        'no-misleading-character-class': [
          'error',
          {
            allowEscape: true,
          },
        ],
        'no-new-native-nonconstructor': ['error'],
        'no-new-symbol': ['error'],
        'no-obj-calls': ['error'],
        'no-promise-executor-return': [
          'error',
          {
            allowVoid: true,
          },
        ],
        'no-prototype-builtins': ['error'],
        'no-self-assign': [
          'error',
          {
            props: true,
          },
        ],
        'no-self-compare': ['error'],
        'no-setter-return': ['error'],
        'no-sparse-arrays': ['error'],
        'no-template-curly-in-string': ['off'],
        'no-this-before-super': ['error'],
        'no-undef': [
          'off',
          {
            typeof: false,
          },
        ],
        'no-unexpected-multiline': ['error'],
        'no-unmodified-loop-condition': ['off'],
        'no-unreachable': ['error'],
        'no-unreachable-loop': [
          'error',
          {
            ignore: [],
          },
        ],
        'no-unsafe-finally': ['error'],
        'no-unsafe-negation': [
          'error',
          {
            enforceForOrderingRelations: true,
          },
        ],
        'no-unsafe-optional-chaining': [
          'off',
          {
            disallowArithmeticOperators: false,
          },
        ],
        'no-unused-private-class-members': ['off'],
        'no-unused-vars': [
          'off',
          {
            vars: 'all',
            varsIgnorePattern: '',
            args: 'none',
            argsIgnorePattern: '',
            caughtErrors: 'none',
            caughtErrorsIgnorePattern: '',
            destructuredArrayIgnorePattern: '',
            ignoreRestSiblings: false,
            ignoreClassWithStaticInitBlock: false,
            reportUsedIgnorePattern: false,
          },
        ],
        'no-use-before-define': [
          'error',
          {
            functions: false,
            classes: false,
            variables: false,
            allowNamedExports: false,
          },
        ],
        'no-useless-assignment': ['warn'],
        'no-useless-backreference': ['off'],
        'require-atomic-updates': [
          'off',
          {
            allowProperties: false,
          },
        ],
        'use-isnan': [
          'error',
          {
            enforceForSwitchCase: true,
            enforceForIndexOf: true,
          },
        ],
        'valid-typeof': [
          'error',
          {
            requireStringLiterals: false,
          },
        ],

        /**
         * Suggestions
         * 建议
         */
        'accessor-pairs': [
          'error',
          {
            setWithoutGet: true,
            getWithoutSet: false,
            enforceForClassMembers: true,
          },
        ],
        'arrow-body-style': [
          'off',
          'as-needed',
          {
            requireReturnForObjectLiteral: false,
          },
        ],
        'block-scoped-var': ['error'],
        camelcase: [
          'off',
          {
            properties: 'never',
            ignoreDestructuring: true,
            ignoreImports: true,
            ignoreGlobals: true,
            allow: [],
          },
        ],
        'capitalized-comments': [
          'off',
          'never',
          {
            ignorePattern: '',
            ignoreInlineComments: true,
            ignoreConsecutiveComments: true,
          },
        ],
        'class-methods-use-this': [
          'off',
          {
            exceptMethods: [],
            enforceForClassFields: true,
          },
        ],
        complexity: [
          'off',
          {
            max: Infinity,
          },
        ],
        'consistent-return': [
          'error',
          {
            treatUndefinedAsUnspecified: false,
          },
        ],
        'consistent-this': ['off', 'that'],
        curly: ['warn', 'all'],
        'default-case': [
          'off',
          {
            commentPattern: /^no default$/i,
          },
        ],
        'default-case-last': ['error'],
        'default-param-last': ['off'],
        'dot-notation': [
          'off',
          {
            allowKeywords: true,
            allowPattern: '',
          },
        ],
        eqeqeq: [
          'warn',
          'always',
          {
            null: 'always',
          },
        ],
        'func-name-matching': [
          'off',
          'always',
          {
            considerPropertyDescriptor: true,
            includeCommonJSModuleExports: true,
          },
        ],
        'func-names': [
          'off',
          'as-needed',
          {
            generators: 'as-needed',
          },
        ],
        'func-style': [
          'off',
          'expression',
          {
            allowArrowFunctions: true,
            overrides: {},
          },
        ],
        'grouped-accessor-pairs': ['error', 'getBeforeSet'],
        'guard-for-in': ['error'],
        'id-denylist': ['off', ...[]],
        'id-length': [
          'off',
          {
            min: 1,
            max: Infinity,
            properties: 'never',
            exceptions: [],
            exceptionPatterns: [],
          },
        ],
        'id-match': [
          'off',
          '^[a-z]+([A-Z][a-z]+)*$',
          {
            properties: false,
            classFields: false,
            onlyDeclarations: false,
            ignoreDestructuring: false,
          },
        ],
        'init-declarations': [
          'off',
          'always',
          {
            ignoreForLoopInit: true,
          },
        ],
        'logical-assignment-operators': [
          'off',
          'never',
          {
            enforceForIfStatements: true,
          },
        ],
        'max-classes-per-file': [
          'off',
          {
            max: Infinity,
            ignoreExpressions: true,
          },
        ],
        'max-depth': [
          'off',
          {
            max: Infinity,
          },
        ],
        'max-lines': [
          'off',
          {
            max: Infinity,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
        'max-lines-per-function': [
          'off',
          {
            max: Infinity,
            skipBlankLines: true,
            skipComments: true,
            IIFEs: true,
          },
        ],
        'max-nested-callbacks': [
          'off',
          {
            max: Infinity,
          },
        ],
        'max-params': [
          'off',
          {
            max: Infinity,
          },
        ],
        'max-statements': [
          'off',
          {
            max: Infinity,
            ignoreTopLevelFunctions: true,
          },
        ],
        'new-cap': [
          'off',
          {
            newIsCap: true,
            capIsNew: true,
            newIsCapExceptions: [],
            newIsCapExceptionPattern: '',
            capIsNewExceptions: [],
            capIsNewExceptionPattern: '',
            properties: true,
          },
        ],
        'no-alert': ['error'],
        'no-array-constructor': ['error'],
        'no-bitwise': [
          'off',
          {
            allow: [],
            int32Hint: true,
          },
        ],
        'no-caller': ['error'],
        'no-case-declarations': ['error'],
        'no-console': [
          'off',
          {
            allow: [],
          },
        ],
        'no-continue': ['off'],
        'no-delete-var': ['error'],
        'no-div-regex': ['off'],
        'no-else-return': [
          'off',
          {
            allowElseIf: false,
          },
        ],
        'no-empty': [
          'off',
          {
            allowEmptyCatch: true,
          },
        ],
        'no-empty-function': [
          'off',
          {
            allow: [],
          },
        ],
        'no-empty-static-block': ['off'],
        'no-eq-null': ['warn'],
        'no-eval': [
          'off',
          {
            allowIndirect: true,
          },
        ],
        'no-extend-native': [
          'error',
          {
            exceptions: [],
          },
        ],
        'no-extra-bind': ['warn'],
        'no-extra-boolean-cast': [
          'warn',
          {
            enforceForLogicalOperands: true,
          },
        ],
        'no-extra-label': ['off'],
        'no-global-assign': [
          'error',
          {
            exceptions: [],
          },
        ],
        'no-implicit-coercion': [
          'off',
          {
            boolean: true,
            number: true,
            string: true,
            disallowTemplateShorthand: false,
            allow: [],
          },
        ],
        'no-implicit-globals': [
          'off',
          {
            lexicalBindings: false,
          },
        ],
        'no-implied-eval': ['error'],
        'no-inline-comments': [
          'off',
          {
            ignorePattern: '',
          },
        ],
        'no-invalid-this': [
          'off',
          {
            capIsConstructor: true,
          },
        ],
        'no-iterator': ['error'],
        'no-label-var': ['off'],
        'no-labels': [
          'off',
          {
            allowLoop: false,
            allowSwitch: false,
          },
        ],
        'no-lone-blocks': ['off'],
        'no-lonely-if': ['off'],
        'no-loop-func': ['error'],
        'no-magic-numbers': [
          'off',
          {
            ignore: [],
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
            ignoreClassFieldInitialValues: true,
            enforceConst: false,
            detectObjects: false,
          },
        ],
        'no-multi-assign': [
          'off',
          {
            ignoreNonDeclaration: false,
          },
        ],
        'no-multi-str': ['warn'],
        'no-negated-condition': ['off'],
        'no-nested-ternary': ['off'],
        'no-new': ['off'],
        'no-new-func': ['off'],
        'no-new-wrappers': ['error'],
        'no-nonoctal-decimal-escape': ['error'],
        'no-object-constructor': ['error'],
        'no-octal': ['error'],
        'no-octal-escape': ['error'],
        'no-param-reassign': [
          'off',
          {
            props: true,
            ignorePropertyModificationsFor: [],
            ignorePropertyModificationsForRegex: [],
          },
        ],
        'no-plusplus': [
          'off',
          {
            allowForLoopAfterthoughts: true,
          },
        ],
        'no-proto': ['error'],
        'no-redeclare': [
          'error',
          {
            builtinGlobals: true,
          },
        ],
        'no-regex-spaces': ['off'],
        'no-restricted-exports': [
          'off',
          {
            restrictedNamedExports: [],
            restrictDefaultExports: {
              direct: true,
              named: true,
              defaultFrom: true,
              namedFrom: true,
              namespaceFrom: true,
            },
          },
        ],
        'no-restricted-globals': ['off', ...[]],
        'no-restricted-imports': [
          'off',
          {
            paths: [],
            patterns: [],
          },
        ],
        'no-restricted-properties': ['off', ...[]],
        'no-restricted-syntax': ['off', ...[]],
        'no-return-assign': ['warn', 'except-parens'],
        'no-script-url': ['off'],
        'no-sequences': [
          'off',
          {
            allowInParentheses: true,
          },
        ],
        'no-shadow': [
          'off',
          {
            builtinGlobals: true,
            hoist: 'all',
            allow: [],
            ignoreOnInitialization: false,
          },
        ],
        'no-shadow-restricted-names': ['error'],
        'no-ternary': ['off'],
        'no-throw-literal': ['off'],
        'no-undef-init': ['off'],
        'no-undefined': ['off'],
        'no-underscore-dangle': [
          'off',
          {
            allow: [],
            allowAfterThis: false,
            allowAfterSuper: false,
            allowAfterThisConstructor: false,
            enforceInMethodNames: false,
            enforceInClassFields: false,
            allowInArrayDestructuring: true,
            allowInObjectDestructuring: true,
            allowFunctionParams: true,
          },
        ],
        'no-unneeded-ternary': [
          'warn',
          {
            defaultAssignment: false,
          },
        ],
        'no-unused-expressions': [
          'off',
          {
            allowShortCircuit: true,
            allowTernary: true,
            allowTaggedTemplates: true,
            enforceForJSX: false,
          },
        ],
        'no-unused-labels': ['off'],
        'no-useless-call': ['off'],
        'no-useless-catch': ['off'],
        'no-useless-computed-key': [
          'off',
          {
            enforceForClassMembers: true,
          },
        ],
        'no-useless-concat': ['off'],
        'no-useless-constructor': ['off'],
        'no-useless-escape': ['warn'],
        'no-useless-rename': [
          'off',
          {
            ignoreDestructuring: false,
            ignoreImport: false,
            ignoreExport: false,
          },
        ],
        'no-useless-return': ['off'],
        'no-var': ['warn'],
        'no-void': [
          'off',
          {
            allowAsStatement: false,
          },
        ],
        'no-warning-comments': [
          'off',
          {
            terms: ['todo', 'fixme', 'xxx'],
            location: 'start',
            decoration: [],
          },
        ],
        'no-with': ['off'],
        'object-shorthand': [
          'warn',
          'always',
          {
            avoidQuotes: false,
            ignoreConstructors: false,
            methodsIgnorePattern: '',
            avoidExplicitReturnArrows: true,
          },
        ],
        'one-var': [
          'off',
          {
            var: 'never',
            let: 'never',
            const: 'never',
            separateRequires: true,
          },
        ],
        'operator-assignment': ['off', 'never'],
        'prefer-arrow-callback': [
          'off',
          {
            allowNamedFunctions: false,
            allowUnboundThis: true,
          },
        ],
        'prefer-const': [
          'off',
          {
            destructuring: 'any',
            ignoreReadBeforeAssign: false,
          },
        ],
        'prefer-destructuring': [
          'off',
          {
            VariableDeclarator: {
              array: true,
              object: true,
            },
            AssignmentExpression: {
              array: true,
              object: true,
            },
          },
          {
            enforceForRenamedProperties: true,
          },
        ],
        'prefer-exponentiation-operator': ['off'],
        'prefer-named-capture-group': ['off'],
        'prefer-numeric-literals': ['off'],
        'prefer-object-has-own': ['off'],
        'prefer-object-spread': ['off'],
        'prefer-promise-reject-errors': [
          'off',
          {
            allowEmptyReject: false,
          },
        ],
        'prefer-regex-literals': [
          'off',
          {
            disallowRedundantWrapping: true,
          },
        ],
        'prefer-rest-params': ['off'],
        'prefer-spread': ['off'],
        'prefer-template': ['warn'],
        radix: ['off', 'always'],
        'require-await': ['off'],
        'require-unicode-regexp': ['off'],
        'require-yield': ['off'],
        'sort-imports': [
          'off',
          {
            ignoreCase: true,
            ignoreDeclarationSort: false,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            allowSeparatedGroups: false,
          },
        ],
        'sort-keys': [
          'off',
          'asc',
          {
            caseSensitive: false,
            minKeys: 2,
            natural: true,
            allowLineSeparatedGroups: true,
          },
        ],
        'sort-vars': [
          'off',
          {
            ignoreCase: true,
          },
        ],
        strict: ['off', 'safe'],
        'symbol-description': ['off'],
        'vars-on-top': ['off'],
        yoda: [
          'warn',
          'never',
          {
            exceptRange: true,
            onlyEquality: true,
          },
        ],

        /**
         * Layout & Formatting
         * 布局和格式
         */
        'unicode-bom': ['warn', 'never'],
      },
    };
    this.stylisticConfig = {
      ...(() => {
        if (this.eslintVersion === 8) {
          return {
            plugins: ['@stylistic'],
          };
        }
        if (this.eslintVersion === 9) {
          return {
            plugins: {
              ...(this.requireResolve === 'string' ? {
                '@stylistic': `require('@stylistic/eslint-plugin')`,
              } : {}),
              ...(this.requireResolve === 'getter' ? {
                get '@stylistic'() {
                  return $this.require('@stylistic/eslint-plugin');
                },
              } : {}),
            },
          };
        }
        return {};
      })(),
      rules: {
        '@stylistic/array-bracket-newline': ['warn', 'consistent'],
        '@stylistic/array-bracket-spacing': [
          'warn',
          'never',
          {
            singleValue: false,
            objectsInArrays: false,
            arraysInArrays: false,
          },
        ],
        '@stylistic/array-element-newline': [
          'off',
          {
            ArrayExpression: 'consistent',
            ArrayPattern: 'consistent',
          },
        ],
        '@stylistic/arrow-parens': [
          'off',
          'as-needed',
          {
            requireForBlockBody: true,
          },
        ],
        '@stylistic/arrow-spacing': [
          'warn',
          {
            before: true,
            after: true,
          },
        ],
        '@stylistic/block-spacing': ['warn', 'always'],
        '@stylistic/brace-style': [
          'warn',
          '1tbs',
          {
            allowSingleLine: true,
          },
        ],
        '@stylistic/comma-dangle': [
          'warn',
          {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
          },
        ],
        '@stylistic/comma-spacing': [
          'warn',
          {
            before: false,
            after: true,
          },
        ],
        '@stylistic/comma-style': [
          'warn',
          'last',
          {
            exceptions: {},
          },
        ],
        '@stylistic/computed-property-spacing': [
          'warn',
          'never',
          {
            enforceForClassMembers: true,
          },
        ],
        '@stylistic/dot-location': ['warn', 'property'],
        '@stylistic/eol-last': ['warn', 'always'],
        get '@stylistic/func-call-spacing'() {
          return this['@stylistic/function-call-spacing'];
        },
        '@stylistic/function-call-argument-newline': ['warn', 'consistent'],
        '@stylistic/function-call-spacing': ['warn', 'never'],
        '@stylistic/function-paren-newline': ['warn', 'consistent'],
        '@stylistic/generator-star-spacing': [
          'warn',
          {
            before: false,
            after: true,
            anonymous: { before: false, after: true },
            method: { before: false, after: true },
          },
        ],
        '@stylistic/implicit-arrow-linebreak': ['warn', 'beside'],
        '@stylistic/indent': [
          'warn',
          2,
          {
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
          },
        ],
        '@stylistic/indent-binary-ops': ['warn', 2],
        '@stylistic/jsx-child-element-spacing': ['off'],
        '@stylistic/jsx-closing-bracket-location': ['off'],
        '@stylistic/jsx-closing-tag-location': ['off'],
        '@stylistic/jsx-curly-brace-presence': ['off'],
        '@stylistic/jsx-curly-newline': ['off'],
        '@stylistic/jsx-curly-spacing': ['off'],
        '@stylistic/jsx-equals-spacing': ['off'],
        '@stylistic/jsx-first-prop-new-line': ['off'],
        '@stylistic/jsx-function-call-newline': ['off'],
        '@stylistic/jsx-indent': ['off'],
        '@stylistic/jsx-indent-props': ['off'],
        '@stylistic/jsx-max-props-per-line': ['off'],
        '@stylistic/jsx-newline': ['off'],
        '@stylistic/jsx-one-expression-per-line': ['off'],
        '@stylistic/jsx-pascal-case': ['off'],
        '@stylistic/jsx-props-no-multi-spaces': ['off'],
        '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
        '@stylistic/jsx-self-closing-comp': ['off'],
        '@stylistic/jsx-sort-props': ['off'],
        '@stylistic/jsx-tag-spacing': ['off'],
        '@stylistic/jsx-wrap-multilines': ['off'],
        '@stylistic/key-spacing': [
          'warn',
          {
            beforeColon: false,
            afterColon: true,
            mode: 'strict',
          },
        ],
        '@stylistic/keyword-spacing': [
          'warn',
          {
            before: true,
            after: true,
            overrides: {},
          },
        ],
        '@stylistic/line-comment-position': [
          'off',
          {
            position: 'above',
            ignorePattern: '',
            applyDefaultIgnorePatterns: true,
          },
        ],
        '@stylistic/linebreak-style': ['off', 'unix'],
        '@stylistic/lines-around-comment': [
          'off',
          {
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
          },
        ],
        '@stylistic/lines-between-class-members': [
          'off',
          'always',
          {
            exceptAfterSingleLine: false,
          },
        ],
        '@stylistic/max-len': [
          'off',
          {
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
          },
        ],
        '@stylistic/max-statements-per-line': [
          'off',
          {
            max: 1,
          },
        ],
        '@stylistic/member-delimiter-style': [
          'off',
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
            multilineDetection: 'brackets',
          },
        ],
        '@stylistic/multiline-comment-style': ['off', 'starred-block'],
        '@stylistic/multiline-ternary': ['off', 'always-multiline'],
        '@stylistic/new-parens': ['warn', 'always'],
        '@stylistic/newline-per-chained-call': [
          'off',
          {
            ignoreChainWithDepth: 1,
          },
        ],
        '@stylistic/no-confusing-arrow': [
          'off',
          {
            allowParens: true,
            onlyOneSimpleParam: false,
          },
        ],
        '@stylistic/no-extra-parens': [
          'off',
          'all',
          {
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
          },
        ],
        '@stylistic/no-extra-semi': ['warn'],
        '@stylistic/no-floating-decimal': ['warn'],
        '@stylistic/no-mixed-operators': [
          'off',
          {
            groups: [...[]],
            allowSamePrecedence: true,
          },
        ],
        '@stylistic/no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
        '@stylistic/no-multi-spaces': [
          'warn',
          {
            ignoreEOLComments: false,
            exceptions: {},
          },
        ],
        '@stylistic/no-multiple-empty-lines': [
          'warn',
          {
            max: 1,
            maxBOF: 0,
            maxEOF: 0,
          },
        ],
        '@stylistic/no-tabs': [
          'off',
          {
            allowIndentationTabs: false,
          },
        ],
        '@stylistic/no-trailing-spaces': [
          'warn',
          {
            skipBlankLines: false,
            ignoreComments: false,
          },
        ],
        '@stylistic/no-whitespace-before-property': ['warn'],
        '@stylistic/nonblock-statement-body-position': [
          'off',
          'beside',
          {
            overrides: {},
          },
        ],
        '@stylistic/object-curly-newline': [
          'off',
          {
            ObjectExpression: { multiline: true },
            ObjectPattern: { multiline: true },
            ImportDeclaration: { multiline: true },
            ExportDeclaration: { multiline: true },
          },
        ],
        '@stylistic/object-curly-spacing': [
          'warn',
          'always',
          {
            arraysInObjects: true,
            objectsInObjects: true,
          },
        ],
        '@stylistic/object-property-newline': [
          'off',
          {
            allowAllPropertiesOnSameLine: true,
          },
        ],
        '@stylistic/one-var-declaration-per-line': ['off', 'always'],
        '@stylistic/operator-linebreak': [
          'off',
          'before',
          {
            overrides: {},
          },
        ],
        '@stylistic/padded-blocks': [
          'warn',
          {
            blocks: 'never',
            classes: 'never',
            switches: 'never',
          },
          {
            allowSingleLineBlocks: true,
          },
        ],
        '@stylistic/padding-line-between-statements': ['off', ...[]],
        '@stylistic/quote-props': [
          'warn',
          'as-needed',
          {
            keywords: false,
            unnecessary: true,
            numbers: false,
          },
        ],
        '@stylistic/quotes': [
          'warn',
          'single',
          {
            avoidEscape: true,
            allowTemplateLiterals: true,
          },
        ],
        '@stylistic/rest-spread-spacing': ['warn', 'never'],
        '@stylistic/semi': [
          'warn',
          'always',
          {
            omitLastInOneLineBlock: false,
          },
        ],
        '@stylistic/semi-spacing': [
          'warn',
          {
            before: false,
            after: true,
          },
        ],
        '@stylistic/semi-style': ['warn', 'last'],
        '@stylistic/space-before-blocks': [
          'warn',
          {
            functions: 'always',
            keywords: 'always',
            classes: 'always',
          },
        ],
        '@stylistic/space-before-function-paren': [
          'off',
          {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always',
          },
        ],
        '@stylistic/space-in-parens': [
          'warn',
          'never',
          {
            exceptions: [],
          },
        ],
        '@stylistic/space-infix-ops': [
          'warn',
          {
            int32Hint: false,
          },
        ],
        '@stylistic/space-unary-ops': [
          'warn',
          {
            words: true,
            nonwords: false,
            overrides: {},
          },
        ],
        '@stylistic/spaced-comment': [
          'warn',
          'always',
          {
            line: {
              markers: ['/'],
              exceptions: ['-', '+'],
            },
            block: {
              markers: ['!'],
              exceptions: ['*'],
              balanced: true,
            },
          },
        ],
        '@stylistic/switch-colon-spacing': [
          'warn',
          {
            before: false,
            after: true,
          },
        ],
        '@stylistic/template-curly-spacing': ['warn', 'never'],
        '@stylistic/template-tag-spacing': ['warn', 'never'],
        '@stylistic/type-annotation-spacing': [
          'warn',
          {
            before: false,
            after: true,
            overrides: {
              arrow: {
                before: true,
                after: true,
              },
            },
          },
        ],
        '@stylistic/type-generic-spacing': ['warn'],
        '@stylistic/type-named-tuple-spacing': ['warn'],
        '@stylistic/wrap-iife': [
          'warn',
          'inside',
          {
            functionPrototypeMethods: true,
          },
        ],
        '@stylistic/wrap-regex': ['off'],
        '@stylistic/yield-star-spacing': [
          'warn',
          {
            before: false,
            after: true,
          },
        ],
      },
    };
    this.vueBaseConfig = {
      ...(() => {
        if (this.eslintVersion === 8) {
          return {
            parser: 'vue-eslint-parser',
            plugins: ['vue'],
          };
        }
        if (this.eslintVersion === 9) {
          return {
            languageOptions: {
              ...(this.requireResolve === 'string' ? {
                parser: `require('vue-eslint-parser')`,
              } : {}),
              ...(this.requireResolve === 'getter' ? {
                get parser() {
                  return $this.require('vue-eslint-parser');
                },
              } : {}),
            },
            plugins: {
              ...(this.requireResolve === 'string' ? {
                vue: `require('eslint-plugin-vue')`,
              } : {}),
              ...(this.requireResolve === 'getter' ? {
                get vue() {
                  return $this.require('eslint-plugin-vue');
                },
              } : {}),
            },
          };
        }
        return {};
      })(),
      rules: {
        // Base Rules (Enabling Correct ESLint Parsing)
        'vue/comment-directive': [
          'off',
          {
            reportUnusedDisableDirectives: true,
          },
        ],
        'vue/jsx-uses-vars': ['off'],

        // Priority A: Essential (Error Prevention)
        'vue/multi-word-component-names': [
          'off',
          {
            ignores: [],
          },
        ],
        'vue/no-arrow-functions-in-watch': ['error'],
        'vue/no-async-in-computed-properties': ['error'],
        'vue/no-child-content': [
          'error',
          // {
          //   additionalDirectives: [], // Key "vue/no-child-content": Value [] should NOT have fewer than 1 items.
          // },
        ],
        'vue/no-computed-properties-in-data': ['error'],
        'vue/no-dupe-keys': [
          'error',
          {
            groups: [],
          },
        ],
        'vue/no-dupe-v-else-if': ['error'],
        'vue/no-duplicate-attributes': [
          'error',
          {
            allowCoexistClass: true,
            allowCoexistStyle: true,
          },
        ],
        'vue/no-export-in-script-setup': ['error'],
        'vue/no-mutating-props': [
          'error',
          {
            shallowOnly: false,
          },
        ],
        'vue/no-parsing-error': [
          'error',
          {
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
          },
        ],
        'vue/no-ref-as-operand': ['error'],
        'vue/no-reserved-component-names': [
          'error',
          {
            disallowVueBuiltInComponents: true,
            disallowVue3BuiltInComponents: true,
          },
        ],
        'vue/no-reserved-keys': [
          'error',
          {
            reserved: [],
            groups: [],
          },
        ],
        // 'vue/no-reserved-props' 选项在 vue3Config 和 vue2Config 分别设置
        'vue/no-reserved-props': ['error', ...[]],
        'vue/no-shared-component-data': ['error'],
        'vue/no-side-effects-in-computed-properties': ['error'],
        'vue/no-template-key': ['error'],
        'vue/no-textarea-mustache': ['error'],
        'vue/no-unused-components': [
          'warn',
          {
            ignoreWhenBindingPresent: true,
          },
        ],
        'vue/no-unused-vars': [
          'off',
          {
            ignorePattern: '^_',
          },
        ],
        'vue/no-use-computed-property-like-method': ['error'],
        'vue/no-use-v-if-with-v-for': [
          'error',
          {
            allowUsingIterationVar: false,
          },
        ],
        'vue/no-useless-template-attributes': ['error'],
        'vue/no-v-text-v-html-on-component': [
          'off',
          {
            allow: ['router-link', 'nuxt-link'],
          },
        ],
        'vue/require-component-is': ['error'],
        'vue/require-prop-type-constructor': ['error'],
        'vue/require-render-return': ['error'],
        'vue/require-v-for-key': ['warn'],
        'vue/require-valid-default-prop': ['error'],
        'vue/return-in-computed-property': [
          'error',
          {
            treatUndefinedAsUnspecified: true,
          },
        ],
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
        'vue/valid-v-on': [
          'error',
          {
            modifiers: [],
          },
        ],
        'vue/valid-v-once': ['error'],
        'vue/valid-v-pre': ['error'],
        'vue/valid-v-show': ['error'],
        'vue/valid-v-slot': [
          'error',
          {
            allowModifiers: false,
          },
        ],
        'vue/valid-v-text': ['error'],

        // Priority B: Strongly Recommended (Improving Readability)
        'vue/attribute-hyphenation': [
          'warn',
          'always',
          {
            ignore: [],
          },
        ],
        'vue/component-definition-name-casing': ['warn', 'PascalCase'],
        'vue/first-attribute-linebreak': [
          'warn',
          {
            singleline: 'beside',
            multiline: 'below',
          },
        ],
        'vue/html-closing-bracket-newline': [
          'warn',
          {
            singleline: 'never',
            multiline: 'always',
            selfClosingTag: {
              singleline: 'never',
              multiline: 'always',
            },
          },
        ],
        'vue/html-closing-bracket-spacing': [
          'warn',
          {
            startTag: 'never',
            endTag: 'never',
            selfClosingTag: 'always',
          },
        ],
        'vue/html-end-tags': ['warn'],
        'vue/html-indent': [
          'warn',
          2,
          {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: [],
          },
        ],
        'vue/html-quotes': [
          'warn',
          'double',
          {
            avoidEscape: true,
          },
        ],
        'vue/html-self-closing': [
          'off',
          {
            html: {
              void: 'never',
              normal: 'always',
              component: 'always',
            },
            svg: 'always',
            math: 'always',
          },
        ],
        'vue/max-attributes-per-line': [
          'warn',
          {
            singleline: {
              max: Infinity,
            },
            multiline: {
              max: 1,
            },
          },
        ],
        'vue/multiline-html-element-content-newline': [
          'warn',
          {
            ignoreWhenEmpty: true,
            ignores: ['pre', 'textarea'],
            allowEmptyLines: false,
          },
        ],
        'vue/mustache-interpolation-spacing': ['warn', 'always'],
        'vue/no-multi-spaces': [
          'warn',
          {
            ignoreProperties: false,
          },
        ],
        'vue/no-spaces-around-equal-signs-in-attribute': ['warn'],
        'vue/no-template-shadow': [
          'warn',
          {
            allow: [],
          },
        ],
        'vue/one-component-per-file': ['warn'],
        'vue/prop-name-casing': ['warn', 'camelCase'],
        'vue/require-default-prop': ['off'],
        'vue/require-prop-types': ['off'],
        'vue/singleline-html-element-content-newline': [
          'off',
          {
            ignoreWhenNoAttributes: true,
            ignoreWhenEmpty: true,
            ignores: ['pre', 'textarea'],
            externalIgnores: [],
          },
        ],
        'vue/v-bind-style': [
          'warn',
          'shorthand',
          {
            sameNameShorthand: 'ignore',
          },
        ],
        'vue/v-on-style': ['warn', 'shorthand'],
        'vue/v-slot-style': [
          'warn',
          {
            atComponent: 'v-slot',
            default: 'shorthand',
            named: 'shorthand',
          },
        ],

        // Priority C: Recommended (Potentially Dangerous Patterns)
        'vue/attributes-order': [
          'warn',
          {
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
          },
        ],
        'vue/no-lone-template': [
          'off',
          {
            ignoreAccessible: false,
          },
        ],
        'vue/no-multiple-slot-args': ['off'],
        'vue/no-v-html': ['off'],
        'vue/order-in-components': [
          'warn',
          {
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
          },
        ],
        'vue/this-in-template': ['off', 'never'],

        // Uncategorized
        'vue/block-lang': ['off', ...[]],
        'vue/block-order': [
          'warn',
          {
            order: [
              'template',
              'script:not([setup])',
              'script[setup]',
              'style:not([scoped])',
              'style[scoped]',
            ],
          },
        ],
        'vue/block-tag-newline': [
          'warn',
          {
            singleline: 'consistent',
            multiline: 'always',
            maxEmptyLines: 0,
            blocks: {},
          },
        ],
        'vue/component-api-style': [
          'off',
          ['script-setup', 'composition', 'composition-vue2', 'options'],
        ],
        'vue/component-name-in-template-casing': [
          'off',
          'PascalCase',
          {
            registeredComponentsOnly: true,
            ignores: [],
          },
        ],
        'vue/component-options-name-casing': ['off', 'PascalCase'],
        'vue/custom-event-name-casing': [
          'off',
          'camelCase',
          {
            ignores: [],
          },
        ],
        'vue/define-emits-declaration': ['off', 'type-based'],
        'vue/define-macros-order': [
          'warn',
          {
            order: [
              'defineOptions',
              'defineModel',
              'defineProps',
              'defineEmits',
              'defineSlots',
            ],
            defineExposeLast: true,
          },
        ],
        'vue/define-props-declaration': ['off', 'type-based'],
        'vue/enforce-style-attribute': [
          'off',
          {
            allow: ['scoped', 'module', 'plain'],
          },
        ],
        'vue/html-button-has-type': [
          'off',
          {
            button: true,
            submit: true,
            reset: true,
          },
        ],
        'vue/html-comment-content-newline': [
          'warn',
          {
            singleline: 'never',
            multiline: 'always',
          },
          {
            exceptions: [],
          },
        ],
        'vue/html-comment-content-spacing': [
          'warn',
          'always',
          {
            exceptions: [],
          },
        ],
        'vue/html-comment-indent': ['warn', 2],
        'vue/match-component-file-name': [
          'off',
          {
            extensions: ['jsx'],
            shouldMatchCase: false,
          },
        ],
        'vue/match-component-import-name': ['warn'],
        'vue/max-lines-per-block': [
          'off',
          {
            template: Infinity,
            style: Infinity,
            script: Infinity,
            skipBlankLines: true,
          },
        ],
        'vue/new-line-between-multi-line-property': [
          'off',
          {
            minLineOfMultilineProperty: 2,
          },
        ],
        'vue/next-tick-style': ['off', 'promise'],
        'vue/no-bare-strings-in-template': [
          'off',
          {
            allowlist: [
              '(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}', '<', '>', '\u00b7', '\u2022', '\u2010', '\u2013', '\u2014', '\u2212', '|',
            ],
            attributes: {
              '/.+/': ['title', 'aria-label', 'aria-placeholder', 'aria-roledescription', 'aria-valuetext'],
              input: ['placeholder'],
              img: ['alt'],
            },
            directives: ['v-text'],
          },
        ],
        'vue/no-boolean-default': ['off', 'no-default'],
        'vue/no-deprecated-model-definition': [
          'off',
          {
            allowVue3Compat: true,
          },
        ],
        'vue/no-duplicate-attr-inheritance': ['off'],
        'vue/no-empty-component-block': ['off'],
        'vue/no-multiple-objects-in-class': ['off'],
        'vue/no-potential-component-option-typo': [
          'off',
          {
            presets: ['vue', 'vue-router', 'nuxt'],
            custom: [],
            threshold: 1,
          },
        ],
        'vue/no-ref-object-reactivity-loss': ['off'],
        'vue/no-required-prop-with-default': [
          'off',
          {
            autofix: false,
          },
        ],
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
        'vue/no-setup-props-reactivity-loss': ['warn'],
        'vue/no-static-inline-styles': [
          'off',
          {
            allowBinding: true,
          },
        ],
        'vue/no-template-target-blank': [
          'warn',
          {
            allowReferrer: true,
            enforceDynamicLinks: 'always',
          },
        ],
        'vue/no-this-in-before-route-enter': ['error'],
        'vue/no-undef-components': [
          'off',
          {
            ignorePatterns: [],
          },
        ],
        'vue/no-undef-properties': [
          'off',
          {
            ignores: [],
          },
        ],
        'vue/no-unsupported-features': ['off', ...[]],
        'vue/no-unused-emit-declarations': ['off'],
        'vue/no-unused-properties': [
          'off',
          {
            groups: ['props'],
            deepData: false,
            ignorePublicMembers: false,
            unreferencedOptions: [],
          },
        ],
        'vue/no-unused-refs': ['off'],
        'vue/no-use-v-else-with-v-for': ['warn'],
        'vue/no-useless-mustaches': [
          'off',
          {
            ignoreIncludesComment: false,
            ignoreStringEscape: false,
          },
        ],
        'vue/no-useless-v-bind': [
          'off',
          {
            ignoreIncludesComment: false,
            ignoreStringEscape: false,
          },
        ],
        'vue/no-v-text': ['off'],
        'vue/padding-line-between-blocks': ['off', 'always'],
        'vue/padding-line-between-tags': [
          'off',
          [
            { blankLine: 'always', prev: '*', next: '*' },
          ],
        ],
        'vue/padding-lines-in-component-definition': ['off', ...[]],
        'vue/prefer-define-options': ['warn'],
        'vue/prefer-prop-type-boolean-first': ['off'],
        'vue/prefer-separate-static-class': ['off'],
        'vue/prefer-true-attribute-shorthand': ['off', 'always'],
        'vue/require-direct-export': [
          'off',
          {
            disallowFunctionalComponentFunction: false,
          },
        ],
        'vue/require-emit-validator': ['off'],
        'vue/require-explicit-slots': ['off'],
        'vue/require-expose': ['off'],
        'vue/require-macro-variable-name': [
          'warn',
          {
            defineProps: 'props',
            defineEmits: 'emit',
            defineSlots: 'slots',
            useSlots: 'slots',
            useAttrs: 'attrs',
          },
        ],
        'vue/require-name-property': ['warn'],
        'vue/require-prop-comment': [
          'off',
          {
            type: 'any',
          },
        ],
        'vue/require-typed-object-prop': ['off'],
        'vue/require-typed-ref': ['off'],
        '@stylistic/indent': ['off'],
        'vue/script-indent': [
          'warn',
          2,
          {
            baseIndent: 1,
            switchCase: 1,
            ignores: [],
          },
        ],
        'vue/sort-keys': [
          'off',
          'asc',
          {
            caseSensitive: true,
            ignoreChildrenOf: ['model'],
            ignoreGrandchildrenOf: ['computed', 'directives', 'inject', 'props', 'watch'],
            minKeys: 2,
            natural: false,
          },
        ],
        'vue/static-class-names-order': ['off'],
        'vue/v-for-delimiter-style': ['off', 'in'],
        'vue/v-if-else-key': ['off'],
        'vue/v-on-handler-style': [
          'off',
          ['method', 'inline-function'],
          {
            ignoreIncludesComment: false,
          },
        ],
        'vue/valid-define-options': ['warn'],

        // Extension Rules
        'vue/array-bracket-newline': this.stylisticConfig.rules['@stylistic/array-bracket-newline'],
        'vue/array-bracket-spacing': this.stylisticConfig.rules['@stylistic/array-bracket-spacing'],
        'vue/array-element-newline': this.stylisticConfig.rules['@stylistic/array-element-newline'],
        'vue/arrow-spacing': this.stylisticConfig.rules['@stylistic/arrow-spacing'],
        'vue/block-spacing': this.stylisticConfig.rules['@stylistic/block-spacing'],
        'vue/brace-style': this.stylisticConfig.rules['@stylistic/brace-style'],
        'vue/camelcase': this.baseConfig.rules['camelcase'],
        'vue/comma-dangle': this.stylisticConfig.rules['@stylistic/comma-dangle'],
        'vue/comma-spacing': this.stylisticConfig.rules['@stylistic/comma-spacing'],
        'vue/comma-style': this.stylisticConfig.rules['@stylistic/comma-style'],
        'vue/dot-location': this.stylisticConfig.rules['@stylistic/dot-location'],
        'vue/dot-notation': this.baseConfig.rules['dot-notation'],
        'vue/eqeqeq': this.baseConfig.rules['eqeqeq'],
        'vue/func-call-spacing': this.stylisticConfig.rules['@stylistic/function-call-spacing'],
        'vue/key-spacing': this.stylisticConfig.rules['@stylistic/key-spacing'],
        'vue/keyword-spacing': this.stylisticConfig.rules['@stylistic/keyword-spacing'],
        'vue/max-len': [
          this.stylisticConfig.rules['@stylistic/max-len'][0],
          {
            ...this.stylisticConfig.rules['@stylistic/max-len'][1],
            template: 80,
            ignoreHTMLAttributeValues: false,
            ignoreHTMLTextContents: false,
          },
        ],
        'vue/multiline-ternary': this.stylisticConfig.rules['@stylistic/multiline-ternary'],
        'vue/no-console': this.baseConfig.rules['no-console'],
        'vue/no-constant-condition': this.baseConfig.rules['no-constant-condition'],
        'vue/no-empty-pattern': this.baseConfig.rules['no-empty-pattern'],
        'vue/no-extra-parens': this.stylisticConfig.rules['@stylistic/no-extra-parens'],
        'vue/no-irregular-whitespace': [
          this.baseConfig.rules['no-irregular-whitespace'][0],
          {
            // ...this.baseConfig.rules['no-irregular-whitespace'][1], // Unexpected property "skipJSXText".
            ..._Object.filter(this.baseConfig.rules['no-irregular-whitespace'][1], {
              pick: [
                'skipStrings',
                'skipComments',
                'skipRegExps',
                'skipTemplates',
              ],
            }),
            skipHTMLAttributeValues: false,
            skipHTMLTextContents: false,
          },
        ],
        'vue/no-loss-of-precision': this.baseConfig.rules['no-loss-of-precision'],
        'vue/no-restricted-syntax': this.baseConfig.rules['no-restricted-syntax'],
        'vue/no-sparse-arrays': this.baseConfig.rules['no-sparse-arrays'],
        'vue/no-useless-concat': this.baseConfig.rules['no-useless-concat'],
        'vue/object-curly-newline': this.stylisticConfig.rules['@stylistic/object-curly-newline'],
        'vue/object-curly-spacing': this.stylisticConfig.rules['@stylistic/object-curly-spacing'],
        'vue/object-property-newline': this.stylisticConfig.rules['@stylistic/object-property-newline'],
        'vue/object-shorthand': this.baseConfig.rules['object-shorthand'],
        'vue/operator-linebreak': this.stylisticConfig.rules['@stylistic/operator-linebreak'],
        'vue/prefer-template': this.baseConfig.rules['prefer-template'],
        'vue/quote-props': this.stylisticConfig.rules['@stylistic/quote-props'],
        'vue/space-in-parens': this.stylisticConfig.rules['@stylistic/space-in-parens'],
        'vue/space-infix-ops': this.stylisticConfig.rules['@stylistic/space-infix-ops'],
        'vue/space-unary-ops': this.stylisticConfig.rules['@stylistic/space-unary-ops'],
        'vue/template-curly-spacing': this.stylisticConfig.rules['@stylistic/template-curly-spacing'],
      },
    };
    this.vue2Config = this.merge(this.vueBaseConfig, {
      rules: {
        // Priority A: Essential (Error Prevention)
        'vue/no-reserved-props': [
          'error',
          {
            vueVersion: 2,
          },
        ],
        'vue/no-custom-modifiers-on-v-model': ['error'],
        'vue/no-multiple-template-root': ['error'],
        'vue/no-v-for-template-key': ['error'],
        'vue/no-v-model-argument': ['error'],
        'vue/valid-model-definition': ['error'],
        'vue/valid-v-bind-sync': ['error'],
      },
    });
    this.vue3Config = this.merge(this.vueBaseConfig, {
      rules: {
        // Priority A: Essential (Error Prevention)
        'vue/no-reserved-props': [
          'error',
          {
            vueVersion: 3,
          },
        ],
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
        'vue/no-deprecated-router-link-tag-prop': [
          'error',
          {
            components: ['RouterLink', 'NuxtLink'],
          },
        ],
        'vue/no-deprecated-scope-attribute': ['error'],
        'vue/no-deprecated-slot-attribute': [
          'error',
          {
            ignore: [],
          },
        ],
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

        // Priority B: Strongly Recommended (Improving Readability)
        'vue/require-explicit-emits': [
          'warn',
          {
            allowProps: false,
          },
        ],
        'vue/v-on-event-hyphenation': [
          'warn',
          'always',
          {
            autofix: false,
            ignore: [],
          },
        ],
      },
    });
    this.tsBaseConfig = {
      rules: {
        '@typescript-eslint/adjacent-overload-signatures': ['warn'],
        '@typescript-eslint/array-type': [
          'warn',
          {
            default: 'array',
            readonly: 'array',
          },
        ],
        '@typescript-eslint/await-thenable': ['warn'],
        '@typescript-eslint/ban-ts-comment': [
          'warn',
          {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': false,
            'ts-nocheck': false,
            'ts-check': false,
            minimumDescriptionLength: 0,
          },
        ],
        '@typescript-eslint/ban-tslint-comment': ['warn'],
        '@typescript-eslint/class-literal-property-style': ['off', 'fields'],
        'class-methods-use-this': ['off'],
        '@typescript-eslint/class-methods-use-this': [
          this.baseConfig.rules['class-methods-use-this'][0],
          {
            ...this.baseConfig.rules['class-methods-use-this'][1],
            ignoreOverrideMethods: false,
            ignoreClassesThatImplementAnInterface: false,
          },
        ],
        '@typescript-eslint/consistent-generic-constructors': ['warn', 'constructor'],
        '@typescript-eslint/consistent-indexed-object-style': ['warn', 'record'],
        'consistent-return': ['off'],
        '@typescript-eslint/consistent-return': this.baseConfig.rules['consistent-return'],
        '@typescript-eslint/consistent-type-assertions': [
          'warn',
          {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow',
          },
        ],
        '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
        '@typescript-eslint/consistent-type-exports': [
          'off',
          {
            fixMixedExportsWithInlineTypeSpecifier: false,
          },
        ],
        '@typescript-eslint/consistent-type-imports': [
          'off',
          {
            prefer: 'type-imports',
            disallowTypeAnnotations: true,
            fixStyle: 'separate-type-imports',
          },
        ],
        'default-param-last': ['off'],
        '@typescript-eslint/default-param-last': ['off'],
        'dot-notation': ['off'],
        '@typescript-eslint/dot-notation': [
          this.baseConfig.rules['dot-notation'][0],
          {
            ...this.baseConfig.rules['dot-notation'][1],
            allowPrivateClassPropertyAccess: false,
            allowProtectedClassPropertyAccess: false,
            allowIndexSignaturePropertyAccess: false,
          },
        ],
        '@typescript-eslint/explicit-function-return-type': [
          'off',
          {
            allowExpressions: false,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
            allowDirectConstAssertionInArrowFunctions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: false,
            allowFunctionsWithoutTypeParameters: false,
            allowedNames: [],
            allowIIFEs: false,
          },
        ],
        '@typescript-eslint/explicit-member-accessibility': [
          'off',
          {
            accessibility: 'explicit',
            ignoredMethodNames: [],
            overrides: {},
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': [
          'warn',
          {
            allowArgumentsExplicitlyTypedAsAny: false,
            allowDirectConstAssertionInArrowFunctions: true,
            allowedNames: [],
            allowHigherOrderFunctions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        'init-declarations': ['off'],
        '@typescript-eslint/init-declarations': this.baseConfig.rules['init-declarations'],
        'max-params': ['off'],
        '@typescript-eslint/max-params': this.baseConfig.rules['max-params'],
        '@typescript-eslint/member-ordering': ['off', ...[]],
        '@typescript-eslint/method-signature-style': ['off', 'property'],
        '@typescript-eslint/naming-convention': ['off', ...[]],
        'no-array-constructor': ['off'],
        '@typescript-eslint/no-array-constructor': this.baseConfig.rules['no-array-constructor'],
        '@typescript-eslint/no-array-delete': ['error'],
        '@typescript-eslint/no-base-to-string': [
          'off',
          {
            ignoredTypeNames: ['Error', 'RegExp', 'URL', 'URLSearchParams'],
          },
        ],
        '@typescript-eslint/no-confusing-non-null-assertion': ['warn'],
        '@typescript-eslint/no-confusing-void-expression': [
          'off',
          {
            ignoreArrowShorthand: false,
            ignoreVoidOperator: false,
          },
        ],
        'no-dupe-class-members': ['off'],
        '@typescript-eslint/no-dupe-class-members': this.baseConfig.rules['no-dupe-class-members'],
        '@typescript-eslint/no-duplicate-enum-values': ['error'],
        '@typescript-eslint/no-duplicate-type-constituents': [
          'error',
          {
            ignoreIntersections: false,
            ignoreUnions: false,
          },
        ],
        '@typescript-eslint/no-dynamic-delete': ['off'],
        'no-empty-function': ['off'],
        '@typescript-eslint/no-empty-function': this.baseConfig.rules['no-empty-function'],
        '@typescript-eslint/no-empty-interface': [
          'off',
          {
            allowSingleExtends: false,
          },
        ],
        '@typescript-eslint/no-explicit-any': [
          'warn',
          {
            fixToUnknown: false,
            ignoreRestArgs: false,
          },
        ],
        '@typescript-eslint/no-extra-non-null-assertion': ['warn'],
        '@typescript-eslint/no-extraneous-class': [
          'off',
          {
            allowConstructorOnly: false,
            allowEmpty: false,
            allowStaticOnly: false,
            allowWithDecorator: false,
          },
        ],
        '@typescript-eslint/no-floating-promises': [
          'warn',
          {
            ignoreVoid: true,
            ignoreIIFE: false,
            allowForKnownSafePromises: [],
          },
        ],
        '@typescript-eslint/no-for-in-array': ['error'],
        'no-implied-eval': ['off'],
        '@typescript-eslint/no-implied-eval': this.baseConfig.rules['no-implied-eval'],
        '@typescript-eslint/no-import-type-side-effects': ['off'],
        '@typescript-eslint/no-inferrable-types': [
          'off',
          {
            ignoreParameters: false,
            ignoreProperties: false,
          },
        ],
        'no-invalid-this': ['off'],
        '@typescript-eslint/no-invalid-this': this.baseConfig.rules['no-invalid-this'],
        '@typescript-eslint/no-invalid-void-type': [
          'off',
          {
            allowInGenericTypeArguments: true,
            allowAsThisParameter: false,
          },
        ],
        'no-loop-func': ['off'],
        '@typescript-eslint/no-loop-func': this.baseConfig.rules['no-loop-func'],
        'no-loss-of-precision': ['off'],
        '@typescript-eslint/no-loss-of-precision': this.baseConfig.rules['no-loss-of-precision'],
        'no-magic-numbers': ['off'],
        '@typescript-eslint/no-magic-numbers': [
          this.baseConfig.rules['no-magic-numbers'][0],
          {
            ...this.baseConfig.rules['no-magic-numbers'][1],
            ignoreEnums: false,
            ignoreNumericLiteralTypes: false,
            ignoreReadonlyClassProperties: false,
            ignoreTypeIndexes: false,
          },
        ],
        '@typescript-eslint/no-meaningless-void-operator': [
          'off',
          {
            checkNever: false,
          },
        ],
        '@typescript-eslint/no-misused-new': ['off'],
        '@typescript-eslint/no-misused-promises': [
          'off',
          {
            checksConditionals: true,
            checksVoidReturn: true,
            checksSpreads: true,
          },
        ],
        '@typescript-eslint/no-mixed-enums': ['error'],
        '@typescript-eslint/no-namespace': [
          'error',
          {
            allowDeclarations: false,
            allowDefinitionFiles: true,
          },
        ],
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': ['off'],
        '@typescript-eslint/no-non-null-asserted-optional-chain': ['off'],
        '@typescript-eslint/no-non-null-assertion': ['off'],
        'no-redeclare': ['off'],
        '@typescript-eslint/no-redeclare': [
          this.baseConfig.rules['no-redeclare'][0],
          {
            ...this.baseConfig.rules['no-redeclare'][1],
            ignoreDeclarationMerge: true,
          },
        ],
        '@typescript-eslint/no-redundant-type-constituents': ['off'],
        '@typescript-eslint/no-require-imports': [
          'off',
          {
            allow: [],
          },
        ],
        'no-restricted-imports': ['off'],
        '@typescript-eslint/no-restricted-imports': this.baseConfig.rules['no-restricted-imports'],
        '@typescript-eslint/no-restricted-types': ['off', ...[]],
        'no-shadow': ['off'],
        '@typescript-eslint/no-shadow': [
          this.baseConfig.rules['no-shadow'][0],
          {
            ...this.baseConfig.rules['no-shadow'][1],
            ignoreTypeValueShadow: true,
            ignoreFunctionTypeParameterNameValueShadow: true,
          },
        ],
        '@typescript-eslint/no-this-alias': [
          'off',
          {
            allowDestructuring: true,
            allowedNames: [],
          },
        ],
        'no-throw-literal': ['off'],
        '@typescript-eslint/no-throw-literal': this.baseConfig.rules['no-throw-literal'],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
          'warn',
          {
            allowComparingNullableBooleansToTrue: true,
            allowComparingNullableBooleansToFalse: true,
          },
        ],
        '@typescript-eslint/no-unnecessary-condition': [
          'warn',
          {
            allowConstantLoopConditions: false,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
          },
        ],
        '@typescript-eslint/no-unnecessary-qualifier': ['warn'],
        '@typescript-eslint/no-unnecessary-template-expression': ['off'],
        '@typescript-eslint/no-unnecessary-type-arguments': ['off'],
        '@typescript-eslint/no-unnecessary-type-assertion': [
          'off',
          {
            typesToIgnore: [],
          },
        ],
        '@typescript-eslint/no-unnecessary-type-constraint': ['warn'],
        '@typescript-eslint/no-unsafe-argument': ['off'],
        '@typescript-eslint/no-unsafe-assignment': ['off'],
        '@typescript-eslint/no-unsafe-call': ['off'],
        '@typescript-eslint/no-unsafe-declaration-merging': ['error'],
        '@typescript-eslint/no-unsafe-enum-comparison': ['off'],
        '@typescript-eslint/no-unsafe-member-access': ['off'],
        '@typescript-eslint/no-unsafe-return': ['off'],
        '@typescript-eslint/no-unsafe-unary-minus': ['off'],
        'no-unused-expressions': ['off'],
        '@typescript-eslint/no-unused-expressions': this.baseConfig.rules['no-unused-expressions'],
        'no-unused-vars': ['off'],
        '@typescript-eslint/no-unused-vars': this.baseConfig.rules['no-unused-vars'],
        'no-use-before-define': ['off'],
        '@typescript-eslint/no-use-before-define': [
          this.baseConfig.rules['no-use-before-define'][0],
          {
            ...this.baseConfig.rules['no-use-before-define'][1],
            enums: true,
            typedefs: true,
            ignoreTypeReferences: true,
          },
        ],
        'no-useless-constructor': ['off'],
        '@typescript-eslint/no-useless-constructor': this.baseConfig.rules['no-useless-constructor'],
        '@typescript-eslint/no-useless-empty-export': ['off'],
        '@typescript-eslint/no-useless-template-literals': ['off'],
        '@typescript-eslint/no-var-requires': [
          'off',
          {
            allow: [],
          },
        ],
        '@typescript-eslint/non-nullable-type-assertion-style': ['warn'],
        '@typescript-eslint/only-throw-error': ['off'],
        '@typescript-eslint/parameter-properties': [
          'off',
          {
            allow: [],
            prefer: 'class-property',
          },
        ],
        '@typescript-eslint/prefer-as-const': ['off'],
        'prefer-destructuring': ['off'],
        '@typescript-eslint/prefer-destructuring': [
          this.baseConfig.rules['prefer-destructuring'][0],
          {
            ...this.baseConfig.rules['prefer-destructuring'][1],
          },
          {
            ...this.baseConfig.rules['prefer-destructuring'][2],
            enforceForDeclarationWithTypeAnnotation: false,
          },
        ],
        '@typescript-eslint/prefer-enum-initializers': ['warn'],
        '@typescript-eslint/prefer-find': ['warn'],
        '@typescript-eslint/prefer-for-of': ['warn'],
        '@typescript-eslint/prefer-function-type': ['warn'],
        '@typescript-eslint/prefer-includes': ['warn'],
        '@typescript-eslint/prefer-literal-enum-member': [
          'warn',
          {
            allowBitwiseExpressions: false,
          },
        ],
        '@typescript-eslint/prefer-namespace-keyword': ['warn'],
        '@typescript-eslint/prefer-nullish-coalescing': [
          'off',
          {
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
            ignoreConditionalTests: false,
            ignoreTernaryTests: false,
            ignoreMixedLogicalExpressions: false,
            ignorePrimitives: {
              bigint: false,
              boolean: false,
              number: false,
              string: false,
            },
          },
        ],
        '@typescript-eslint/prefer-optional-chain': [
          'off',
          {
            checkAny: true,
            checkUnknown: true,
            checkString: true,
            checkNumber: true,
            checkBoolean: true,
            checkBigInt: true,
            requireNullish: false,
            allowPotentiallyUnsafeFixesThatModifyTheReturnTypeIKnowWhatImDoing: false,
          },
        ],
        'prefer-promise-reject-errors': ['off'],
        '@typescript-eslint/prefer-promise-reject-errors': this.baseConfig.rules['prefer-promise-reject-errors'],
        '@typescript-eslint/prefer-readonly': [
          'off',
          {
            onlyInlineLambdas: false,
          },
        ],
        '@typescript-eslint/prefer-readonly-parameter-types': [
          'off',
          {
            allow: [],
            checkParameterProperties: true,
            ignoreInferredTypes: false,
            treatMethodsAsReadonly: false,
          },
        ],
        '@typescript-eslint/prefer-reduce-type-parameter': ['warn'],
        '@typescript-eslint/prefer-regexp-exec': ['off'],
        '@typescript-eslint/prefer-return-this-type': ['off'],
        '@typescript-eslint/prefer-string-starts-ends-with': [
          'off',
          {
            allowSingleElementEquality: 'never',
          },
        ],
        '@typescript-eslint/promise-function-async': [
          'warn',
          {
            allowAny: true,
            allowedPromiseNames: [],
            checkArrowFunctions: true,
            checkFunctionDeclarations: true,
            checkFunctionExpressions: true,
            checkMethodDeclarations: true,
          },
        ],
        '@typescript-eslint/require-array-sort-compare': [
          'off',
          {
            ignoreStringArrays: true,
          },
        ],
        'require-await': ['off'],
        '@typescript-eslint/require-await': this.baseConfig.rules['require-await'],
        '@typescript-eslint/restrict-plus-operands': [
          'off',
          {
            allowAny: true,
            allowBoolean: true,
            allowNullish: true,
            allowNumberAndString: true,
            allowRegExp: true,
            skipCompoundAssignments: false,
          },
        ],
        '@typescript-eslint/restrict-template-expressions': [
          'off',
          {
            allowAny: true,
            allowArray: true,
            allowBoolean: true,
            allowNever: true,
            allowNullish: true,
            allowNumber: true,
            allowRegExp: true,
          },
        ],
        '@typescript-eslint/return-await': ['off', 'in-try-catch'],
        '@typescript-eslint/strict-boolean-expressions': [
          'off',
          {
            allowString: true,
            allowNumber: true,
            allowNullableObject: true,
            allowNullableBoolean: false,
            allowNullableString: false,
            allowNullableNumber: false,
            allowNullableEnum: false,
            allowAny: false,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
          },
        ],
        '@typescript-eslint/switch-exhaustiveness-check': [
          'off',
          {
            allowDefaultCaseForExhaustiveSwitch: true,
            requireDefaultForNonUnion: false,
          },
        ],
        '@typescript-eslint/triple-slash-reference': [
          'error',
          {
            lib: 'always',
            path: 'never',
            types: 'prefer-import',
          },
        ],
        '@typescript-eslint/typedef': [
          'off',
          {
            arrayDestructuring: false,
            arrowParameter: false,
            memberVariableDeclaration: false,
            objectDestructuring: false,
            parameter: false,
            propertyDeclaration: false,
            variableDeclaration: false,
            variableDeclarationIgnoreFunction: false,
          },
        ],
        '@typescript-eslint/unbound-method': [
          'warn',
          {
            ignoreStatic: false,
          },
        ],
        '@typescript-eslint/unified-signatures': [
          'off',
          {
            ignoreDifferentlyNamedParameters: false,
          },
        ],
        '@typescript-eslint/use-unknown-in-catch-callback-variable': ['off'],
      },
    };
    this.tsConfig = this.merge(this.tsBaseConfig, {
      ...(() => {
        if (this.eslintVersion === 8) {
          return {
            parser: '@typescript-eslint/parser',
            parserOptions: {
              project: './tsconfig.json',
            },
            plugins: ['@typescript-eslint'],
          };
        }
        if (this.eslintVersion === 9) {
          return {
            languageOptions: {
              ...(this.requireResolve === 'string' ? {
                parser: `require('typescript-eslint').parser`,
              } : {}),
              ...(this.requireResolve === 'getter' ? {
                get parser() {
                  return $this.require('typescript-eslint').parser;
                },
              } : {}),
              parserOptions: {
                project: './tsconfig.json',
              },
            },
            plugins: {
              ...(this.requireResolve === 'string' ? {
                '@typescript-eslint': `require('typescript-eslint').plugin`,
              } : {}),
              ...(this.requireResolve === 'getter' ? {
                get '@typescript-eslint'() {
                  return $this.require('typescript-eslint').plugin;
                },
              } : {}),
            },
          };
        }
        return {};
      })(),
    });
    this.tsInVueConfig = this.merge(this.tsBaseConfig, {
      ...(() => {
        if (this.eslintVersion === 8) {
          return {
            parserOptions: {
              parser: '@typescript-eslint/parser',
              project: './tsconfig.json',
              extraFileExtensions: ['.vue'],
            },
            plugins: ['@typescript-eslint'],
          };
        }
        if (this.eslintVersion === 9) {
          return {
            languageOptions: {
              parserOptions: {
                ...(this.requireResolve === 'string' ? {
                  parser: `require('typescript-eslint').parser`,
                } : {}),
                ...(this.requireResolve === 'getter' ? {
                  get parser() {
                    return $this.require('typescript-eslint').parser;
                  },
                } : {}),
                project: './tsconfig.json',
                extraFileExtensions: ['.vue'],
              },
            },
            plugins: {
              ...(this.requireResolve === 'string' ? {
                '@typescript-eslint': `require('typescript-eslint').plugin`,
              } : {}),
              ...(this.requireResolve === 'getter' ? {
                get '@typescript-eslint'() {
                  return $this.require('typescript-eslint').plugin;
                },
              } : {}),
            },
          };
        }
        return {};
      })(),
    });
  }
  merge(...sources) {
    const { simpleKeys, objectKeys, arrayKeys } = (() => {
      if (this.eslintVersion === 8) {
        return {
          simpleKeys: ['root', 'parser'],
          objectKeys: ['env', 'globals', 'parserOptions', 'rules', 'settings'],
          arrayKeys: ['overrides', 'ignorePatterns', 'extends', 'plugins'],
        };
      }
      if (this.eslintVersion === 9) {
        return {
          simpleKeys: ['processor'],
          objectKeys: ['parserOptions', 'languageOptions', 'linterOptions', 'plugins', 'rules', 'settings'],
          arrayKeys: ['files', 'ignores'],
        };
      }
      return {
        simpleKeys: [],
        objectKeys: [],
        arrayKeys: [],
      };
    })();

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
  }
  createConfigFile(data) {
    let newText = serialize(data, { space: 2, unsafe: true });
    if (this.requireResolve === 'string') {
      // 正则表达式匹配 "require('xx')" 或 "require('xx').prop" 形式的字符串，并去除外部双引号
      const regex = /"require\('([^']+)'\)(\.\w+)?"/g;
      // 替换时去除双引号，只保留require调用部分
      newText = newText.replace(regex, 'require(\'$1\')$2');
    }
    return super.createConfigFile(newText);
  }
  insertPackageJsonScripts({ name = '', fix = false, getValue = () => '' } = {}) {
    const filenameRelative = path.relative(this.rootDir, this.__filename);
    const defaultValue = (() => {
      if (this.eslintVersion === 9) {
        return `node ${filenameRelative} && eslint${fix ? ' --fix' : ''}`;
      }
      if (this.eslintVersion === 8) {
        return `node ${filenameRelative} && eslint '**/*.{js,cjs,mjs,ts,cts,mts,vue}'${fix ? ' --fix' : ''}`;
      }
      return '';
    })();
    const value = getValue({ filenameRelative, defaultValue }) || defaultValue;
    super.insertPackageJsonScripts(name, value);
    return this;
  }
}
