/**
 * [prettier 配置](https://prettier.io/docs/en/options)
 */
import { _Object, _console } from '../base';
import { Lint } from './base';
import path from 'path';

export class Prettier extends Lint {
  constructor({ configFile = 'prettier.config.cjs', ignoreFile = '.prettierignore', scriptName = 'fix:prettier', ...restOptions } = {}) {
    super({ configFile, ignoreFile, scriptName, ...restOptions });

    this.baseConfig = {
      experimentalTernaries: false,
      printWidth: Infinity,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      quoteProps: 'as-needed',
      jsxSingleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'always',
      rangeStart: 0,
      rangeEnd: Infinity,
      // parser,
      // filepath,
      requirePragma: false,
      insertPragma: false,
      proseWrap: 'preserve',
      htmlWhitespaceSensitivity: 'css',
      vueIndentScriptAndStyle: true,
      endOfLine: 'lf',
      embeddedLanguageFormatting: 'auto',
      singleAttributePerLine: false,
    };
  }
  merge(...sources) {
    return _Object.assign({}, ...sources);
  }

  insertPackageJsonScripts(key = this.scriptName, getValue = () => '') {
    key = key ?? this.scriptName;
    const filenameRelative = path.relative(this.rootDir, this.__filename);
    const defaultValue = `node ${filenameRelative} && prettier --check . --write || true`;
    const value = getValue({ filenameRelative, defaultValue }) || defaultValue;
    super.insertPackageJsonScripts(key, value);
    return this;
  }
}

export class PrettierEslint extends Lint {
  constructor({ eslintVersion, process: _process, require: _require } = {}) {
    super({ require: _require, process: _process });

    this.eslintVersion = Number(eslintVersion);
    if (!this.eslintVersion) {
      _console.error('缺少参数: eslintVersion');
    }

    const $this = this;
    this.eslintConfig = {
      ...(() => {
        if (this.eslintVersion === 8) {
          return {
            plugins: ['prettier'],
          };
        }
        if (this.eslintVersion === 9) {
          return {
            plugins: {
              get prettier() {
                return $this.require('eslint-plugin-prettier');
              },
            },
          };
        }
        return {};
      })(),
      rules: {
        curly: ['off'],
        'no-unexpected-multiline': ['off'],
        '@typescript-eslint/lines-around-comment': ['off'],
        '@typescript-eslint/quotes': ['off'],
        'babel/quotes': ['off'],
        'unicorn/template-indent': ['off'],
        'vue/html-self-closing': ['off'],
        'vue/max-len': ['off'],

        '@babel/object-curly-spacing': ['off'],
        '@babel/semi': ['off'],
        '@typescript-eslint/block-spacing': ['off'],
        '@typescript-eslint/brace-style': ['off'],
        '@typescript-eslint/comma-dangle': ['off'],
        '@typescript-eslint/comma-spacing': ['off'],
        '@typescript-eslint/func-call-spacing': ['off'],
        '@typescript-eslint/indent': ['off'],
        '@typescript-eslint/key-spacing': ['off'],
        '@typescript-eslint/keyword-spacing': ['off'],
        '@typescript-eslint/member-delimiter-style': ['off'],
        '@typescript-eslint/no-extra-parens': ['off'],
        '@typescript-eslint/no-extra-semi': ['off'],
        '@typescript-eslint/object-curly-spacing': ['off'],
        '@typescript-eslint/semi': ['off'],
        '@typescript-eslint/space-before-blocks': ['off'],
        '@typescript-eslint/space-before-function-paren': ['off'],
        '@typescript-eslint/space-infix-ops': ['off'],
        '@typescript-eslint/type-annotation-spacing': ['off'],
        'babel/object-curly-spacing': ['off'],
        'babel/semi': ['off'],
        'flowtype/boolean-style': ['off'],
        'flowtype/delimiter-dangle': ['off'],
        'flowtype/generic-spacing': ['off'],
        'flowtype/object-type-curly-spacing': ['off'],
        'flowtype/object-type-delimiter': ['off'],
        'flowtype/quotes': ['off'],
        'flowtype/semi': ['off'],
        'flowtype/space-after-type-colon': ['off'],
        'flowtype/space-before-generic-bracket': ['off'],
        'flowtype/space-before-type-colon': ['off'],
        'flowtype/union-intersection-spacing': ['off'],
        'react/jsx-child-element-spacing': ['off'],
        'react/jsx-closing-bracket-location': ['off'],
        'react/jsx-closing-tag-location': ['off'],
        'react/jsx-curly-newline': ['off'],
        'react/jsx-curly-spacing': ['off'],
        'react/jsx-equals-spacing': ['off'],
        'react/jsx-first-prop-new-line': ['off'],
        'react/jsx-indent': ['off'],
        'react/jsx-indent-props': ['off'],
        'react/jsx-max-props-per-line': ['off'],
        'react/jsx-newline': ['off'],
        'react/jsx-one-expression-per-line': ['off'],
        'react/jsx-props-no-multi-spaces': ['off'],
        'react/jsx-tag-spacing': ['off'],
        'react/jsx-wrap-multilines': ['off'],
        'standard/array-bracket-even-spacing': ['off'],
        'standard/computed-property-even-spacing': ['off'],
        'standard/object-curly-even-spacing': ['off'],
        'unicorn/empty-brace-spaces': ['off'],
        'unicorn/no-nested-ternary': ['off'],
        'unicorn/number-literal-case': ['off'],
        'vue/array-bracket-newline': ['off'],
        'vue/array-bracket-spacing': ['off'],
        'vue/array-element-newline': ['off'],
        'vue/arrow-spacing': ['off'],
        'vue/block-spacing': ['off'],
        'vue/block-tag-newline': ['off'],
        'vue/brace-style': ['off'],
        'vue/comma-dangle': ['off'],
        'vue/comma-spacing': ['off'],
        'vue/comma-style': ['off'],
        'vue/dot-location': ['off'],
        'vue/func-call-spacing': ['off'],
        'vue/html-closing-bracket-newline': ['off'],
        'vue/html-closing-bracket-spacing': ['off'],
        'vue/html-end-tags': ['off'],
        'vue/html-indent': ['off'],
        'vue/html-quotes': ['off'],
        'vue/key-spacing': ['off'],
        'vue/keyword-spacing': ['off'],
        'vue/max-attributes-per-line': ['off'],
        'vue/multiline-html-element-content-newline': ['off'],
        'vue/multiline-ternary': ['off'],
        'vue/mustache-interpolation-spacing': ['off'],
        'vue/no-extra-parens': ['off'],
        'vue/no-multi-spaces': ['off'],
        'vue/no-spaces-around-equal-signs-in-attribute': ['off'],
        'vue/object-curly-newline': ['off'],
        'vue/object-curly-spacing': ['off'],
        'vue/object-property-newline': ['off'],
        'vue/operator-linebreak': ['off'],
        'vue/quote-props': ['off'],
        'vue/script-indent': ['off'],
        'vue/singleline-html-element-content-newline': ['off'],
        'vue/space-in-parens': ['off'],
        'vue/space-infix-ops': ['off'],
        'vue/space-unary-ops': ['off'],
        'vue/template-curly-spacing': ['off'],

        'prettier/prettier': ['warn'],
      },
    };
  }
}
