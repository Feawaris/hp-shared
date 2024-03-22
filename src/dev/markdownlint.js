/**
 * [markdownlint 配置](https://github.com/DavidAnson/markdownlint/blob/b2305efafb034b1f328845aec9928b5363ffd646/doc/Rules.md)
 */
import { _Object, BaseEnv } from '../base';

export const markdownlint = Object.create(null);
markdownlint.baseConfigMap = [
  { key: '$schema', value: 'https://raw.githubusercontent.com/DavidAnson/markdownlint/main/schema/markdownlint-config-schema.json' },
  { key: 'default', value: false },
  { key: 'extends', value: null },
  {
    key: 'MD001', alias: 'heading-increment',
    value: true,
  },
  {
    key: 'MD003', alias: 'heading-style',
    value: { style: 'atx' },
  },
  {
    key: 'MD004', alias: 'ul-style',
    value: { style: 'dash' },
  },
  {
    key: 'MD005', alias: 'list-indent',
    value: true,
  },
  {
    key: 'MD007', alias: 'ul-indent',
    value: true,
  },
  {
    key: 'MD009', alias: 'no-trailing-spaces',
    value: true,
  },
  {
    key: 'MD010', alias: 'no-hard-tabs',
    value: true,
  },
  {
    key: 'MD011', alias: 'no-reversed-links',
    value: true,
  },
  {
    key: 'MD012', alias: 'no-multiple-blanks',
    value: true,
  },
  {
    key: 'MD013', alias: 'line-length',
    value: false,
  },
  {
    key: 'MD014', alias: 'commands-show-output',
    value: true,
  },
  {
    key: 'MD018', alias: 'no-missing-space-atx',
    value: true,
  },
  {
    key: 'MD019', alias: 'no-multiple-space-atx',
    value: true,
  },
  {
    key: 'MD020', alias: 'no-missing-space-closed-atx',
    value: true,
  },
  {
    key: 'MD021', alias: 'no-multiple-space-closed-atx',
    value: true,
  },
  {
    key: 'MD022', alias: 'blanks-around-headings',
    value: true,
  },
  {
    key: 'MD023', alias: 'heading-start-left',
    value: true,
  },
  {
    key: 'MD024', alias: 'no-duplicate-heading',
    value: { siblings_only: true },
  },
  {
    key: 'MD025', alias: 'single-h1',
    value: true,
  },
  {
    key: 'MD026', alias: 'no-trailing-punctuation',
    value: true,
  },
  {
    key: 'MD027', alias: 'no-multiple-space-blockquote',
    value: true,
  },
  {
    key: 'MD028', alias: 'no-blanks-blockquote',
    value: true,
  },
  {
    key: 'MD029', alias: 'ol-prefix',
    value: true,
  },
  {
    key: 'MD030', alias: 'list-marker-space',
    value: true,
  },
  {
    key: 'MD031', alias: 'blanks-around-fences',
    value: true,
  },
  {
    key: 'MD032', alias: 'blanks-around-lists',
    value: true,
  },
  {
    key: 'MD033', alias: 'no-inline-html',
    value: false,
  },
  {
    key: 'MD034', alias: 'no-bare-urls',
    value: false,
  },
  {
    key: 'MD035', alias: 'hr-style',
    value: { style: '---' },
  },
  {
    key: 'MD036', alias: 'no-emphasis-as-heading',
    value: true,
  },
  {
    key: 'MD037', alias: 'no-space-in-emphasis',
    value: true,
  },
  {
    key: 'MD038', alias: 'no-space-in-code',
    value: true,
  },
  {
    key: 'MD039', alias: 'no-space-in-links',
    value: true,
  },
  {
    key: 'MD040', alias: 'fenced-code-language',
    value: true,
  },
  {
    key: 'MD041', alias: 'first-line-h1',
    value: true,
  },
  {
    key: 'MD042', alias: 'no-empty-links',
    value: true,
  },
  {
    key: 'MD043', alias: 'required-headings',
    value: true,
  },
  {
    key: 'MD044', alias: 'proper-names',
    value: true,
  },
  {
    key: 'MD045', alias: 'no-alt-text',
    value: false,
  },
  {
    key: 'MD046', alias: 'code-block-style',
    value: { style: 'fenced' },
  },
  {
    key: 'MD047', alias: 'single-trailing-newline',
    value: true,
  },
  {
    key: 'MD048', alias: 'code-fence-style',
    value: { style: 'backtick' },
  },
  {
    key: 'MD049', alias: 'emphasis-style',
    value: { style: 'asterisk' },
  },
  {
    key: 'MD050', alias: 'strong-style',
    value: { style: 'asterisk' },
  },
  {
    key: 'MD051', alias: 'link-fragments',
    value: true,
  },
  {
    key: 'MD052', alias: 'reference-links-images',
    value: true,
  },
  {
    key: 'MD053', alias: 'link-image-reference-definitions',
    value: true,
  },
  {
    key: 'MD054', alias: 'link-image-style',
    value: true,
  },
  {
    key: 'MD055', alias: 'table-pipe-style',
    value: { style: 'leading_and_trailing' },
  },
  {
    key: 'MD056', alias: 'table-column-count',
    value: true,
  },
];
markdownlint.createBaseConfig = function ({ keyName = 'alias' } = {}) {
  return Object.fromEntries(markdownlint.baseConfigMap.map((item) => {
    const key = keyName === 'alias' ? item.alias || item.key : item.key;
    return [key, item.value];
  }));
};
markdownlint.merge = function (...sources) {
  return _Object.assign({}, ...sources);
};
markdownlint.mergeWithOptions = function ({ keyName = 'alias' } = {}, ...sources) {
  sources = sources.map((source) => {
    return Object.fromEntries(Object.entries(source).map(([key, value]) => {
      const findItem = markdownlint.baseConfigMap.find(item => [item.key, item.alias].includes(key));
      key = findItem ? findItem[keyName] : key;
      return [key, value];
    }));
  });
  return markdownlint.merge(...sources);
};
markdownlint.createFile = function ({ config = {}, filepath = '.markdownlint.json', keyName = 'alias' } = {}) {
  config = markdownlint.mergeWithOptions({ keyName }, config);
  if (BaseEnv.isNode) {
    const fs = require('fs');

    const json = JSON.stringify(config, null, 2);
    fs.writeFileSync(filepath, json);
  }
  return config;
};
