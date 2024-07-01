// @ts-nocheck
import { _Object } from '../base';
import { Lint } from './base';
import path from 'node:path';

export class MarkdownLint extends Lint {
  constructor({ configFile = '.markdownlint-cli2.cjs', ignoreFile = '', ...restOptions } = {}) {
    super({ configFile, ignoreFile, ...restOptions });

    this.aliasConfigMap = [
      {
        key: 'MD001',
        alias: 'heading-increment',
        value: true,
      },
      {
        key: 'MD003',
        alias: 'heading-style',
        value: { style: 'atx' },
      },
      {
        key: 'MD004',
        alias: 'ul-style',
        value: { style: 'dash' },
      },
      {
        key: 'MD005',
        alias: 'list-indent',
        value: true,
      },
      {
        key: 'MD007',
        alias: 'ul-indent',
        value: true,
      },
      {
        key: 'MD009',
        alias: 'no-trailing-spaces',
        value: true,
      },
      {
        key: 'MD010',
        alias: 'no-hard-tabs',
        value: true,
      },
      {
        key: 'MD011',
        alias: 'no-reversed-links',
        value: true,
      },
      {
        key: 'MD012',
        alias: 'no-multiple-blanks',
        value: true,
      },
      {
        key: 'MD013',
        alias: 'line-length',
        value: false,
      },
      {
        key: 'MD014',
        alias: 'commands-show-output',
        value: true,
      },
      {
        key: 'MD018',
        alias: 'no-missing-space-atx',
        value: true,
      },
      {
        key: 'MD019',
        alias: 'no-multiple-space-atx',
        value: true,
      },
      {
        key: 'MD020',
        alias: 'no-missing-space-closed-atx',
        value: true,
      },
      {
        key: 'MD021',
        alias: 'no-multiple-space-closed-atx',
        value: true,
      },
      {
        key: 'MD022',
        alias: 'blanks-around-headings',
        value: true,
      },
      {
        key: 'MD023',
        alias: 'heading-start-left',
        value: true,
      },
      {
        key: 'MD024',
        alias: 'no-duplicate-heading',
        value: { siblings_only: true },
      },
      {
        key: 'MD025',
        alias: 'single-h1',
        value: true,
      },
      {
        key: 'MD026',
        alias: 'no-trailing-punctuation',
        value: true,
      },
      {
        key: 'MD027',
        alias: 'no-multiple-space-blockquote',
        value: true,
      },
      {
        key: 'MD028',
        alias: 'no-blanks-blockquote',
        value: true,
      },
      {
        key: 'MD029',
        alias: 'ol-prefix',
        value: true,
      },
      {
        key: 'MD030',
        alias: 'list-marker-space',
        value: true,
      },
      {
        key: 'MD031',
        alias: 'blanks-around-fences',
        value: true,
      },
      {
        key: 'MD032',
        alias: 'blanks-around-lists',
        value: true,
      },
      {
        key: 'MD033',
        alias: 'no-inline-html',
        value: false,
      },
      {
        key: 'MD034',
        alias: 'no-bare-urls',
        value: false,
      },
      {
        key: 'MD035',
        alias: 'hr-style',
        value: { style: '---' },
      },
      {
        key: 'MD036',
        alias: 'no-emphasis-as-heading',
        value: true,
      },
      {
        key: 'MD037',
        alias: 'no-space-in-emphasis',
        value: true,
      },
      {
        key: 'MD038',
        alias: 'no-space-in-code',
        value: true,
      },
      {
        key: 'MD039',
        alias: 'no-space-in-links',
        value: true,
      },
      {
        key: 'MD040',
        alias: 'fenced-code-language',
        value: true,
      },
      {
        key: 'MD041',
        alias: 'first-line-h1',
        value: false,
      },
      {
        key: 'MD042',
        alias: 'no-empty-links',
        value: true,
      },
      {
        key: 'MD043',
        alias: 'required-headings',
        value: true,
      },
      {
        key: 'MD044',
        alias: 'proper-names',
        value: true,
      },
      {
        key: 'MD045',
        alias: 'no-alt-text',
        value: false,
      },
      {
        key: 'MD046',
        alias: 'code-block-style',
        value: { style: 'fenced' },
      },
      {
        key: 'MD047',
        alias: 'single-trailing-newline',
        value: true,
      },
      {
        key: 'MD048',
        alias: 'code-fence-style',
        value: { style: 'backtick' },
      },
      {
        key: 'MD049',
        alias: 'emphasis-style',
        value: { style: 'asterisk' },
      },
      {
        key: 'MD050',
        alias: 'strong-style',
        value: { style: 'asterisk' },
      },
      {
        key: 'MD051',
        alias: 'link-fragments',
        value: true,
      },
      {
        key: 'MD052',
        alias: 'reference-links-images',
        value: true,
      },
      {
        key: 'MD053',
        alias: 'link-image-reference-definitions',
        value: true,
      },
      {
        key: 'MD054',
        alias: 'link-image-style',
        value: true,
      },
      {
        key: 'MD055',
        alias: 'table-pipe-style',
        value: { style: 'leading_and_trailing' },
      },
      {
        key: 'MD056',
        alias: 'table-column-count',
        value: true,
      },
    ];
  }

  createBaseConfig({ keyName = 'key' } = {}) {
    return {
      $schema: 'https://raw.githubusercontent.com/DavidAnson/markdownlint-cli2/main/schema/markdownlint-cli2-config-schema.json',
      // markdownlint 原有选项
      config: {
        $schema: 'https://raw.githubusercontent.com/DavidAnson/markdownlint/main/schema/markdownlint-config-schema.json',
        default: false,
        extends: null,
        // 带别名选项
        ...(() => {
          return Object.fromEntries(
            this.aliasConfigMap.map((item) => {
              const key = keyName === 'alias' ? item.alias || item.key : item.key;
              return [key, item.value];
            }),
          );
        })(),
      },
      // markdownlint-cli2 扩展选项
      ignores: [],
    };
  }
  merge(...sources) {
    const simpleKeys = ['$schema'];
    const objectKeys = ['config'];
    const arrayKeys = ['ignores'];

    let result = {};
    for (const source of sources) {
      for (let [key, value] of Object.entries(source)) {
        // 特殊属性
        if (key === 'config') {
          result[key] = result[key] || {};
          for (let [ruleKey, ruleValue] of Object.entries(value)) {
            result[key][ruleKey] = ruleValue;
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
  mergeWithOptions({ keyName = 'key' } = {}, ...sources) {
    sources = sources.map((source) => {
      return Object.fromEntries(
        Object.entries(source).map(([key, value]) => {
          const findItem = this.aliasConfigMap.find((item) => [item.key, item.alias].includes(key));
          key = findItem ? findItem[keyName] : key;
          return [key, value];
        }),
      );
    });
    return this.merge(...sources);
  }
  insertPackageJsonScripts({ name = '', fix = false, getValue = () => '' } = {}) {
    const filenameRelative = path.relative(this.rootDir, this.__filename);
    const defaultValue = `node ${filenameRelative} && markdownlint-cli2 **/*.md${fix ? ' --fix' : ''}`;
    const value = getValue({ filenameRelative, defaultValue }) || defaultValue;
    super.insertPackageJsonScripts(name, value);
    return this;
  }
}
