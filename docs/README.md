---
name: hp-shared
category: 文档
tag: 1.4.4
---

基础库

## 1.快速上手

### 1.安装

NPM 方式

::: code-tabs#install

@tab pnpm

```shell
pnpm i hp-shared
```

@tab yarn

```shell
yarn add hp-shared
```

@tab npm

```shell
npm install hp-shared
```

:::

CDN 方式

::: code-tabs#install

@tab unpkg

```html
<script src="https://unpkg.com/hp-shared"></script>
```

@tab jsdelivr

```html
<script src="https://cdn.jsdelivr.net/npm/hp-shared"></script>
```

:::

### 2.使用

- 简洁路径：已在 package.json 的 `exports` 字段配置，常用于 vue 或 node 环境。
- 完整路径：可自行选用 src 或 dist 目录，无法使用简洁路径的环境可使用完整路径。

::: code-tabs#path

@tab 简洁路径

```js
import { _console } from 'hp-shared/base';
```

@tab 完整路径 src

```js
import { _console } from 'hp-shared/src/base/index.js';
```

@tab 完整路径 dist

```js
import { _console } from 'hp-shared/dist/browser/base.js';
```

:::

::: code-tabs#import

@tab browser

```js
// import { xx } from 'hp-shared/模块名';
import { _console } from 'hp-shared/base';
```

@tab node

```js
// const { xx } = require('hp-shared/模块名');
const { _console } = require('hp-shared/base');
```

:::

## 2.各模块示例

### 2.1 base 基础通用

#### 2.1.1 base/base

##### BaseEnv 环境判断

::: code-tabs#import

@tab browser

```js
import { BaseEnv } from 'hp-shared/base';
```

@tab node

```js
const { BaseEnv } = require('hp-shared/base');
```

:::

| 属性          | 说明                                                       |
| ------------- | ---------------------------------------------------------- |
| envs          | 代码运行环境，如 ['browser', 'chrome-extension'], ['node'] |
| **isBrowser** | 根据 envs 得到                                             |
| **isNode**    | 根据 envs 得到                                             |
| os            | 操作系统: windows, mac, linux, ...                         |
| **isWindows** | 根据 os 得到                                               |
| **isMac**     | 根据 os 得到                                               |
| **isLinux**   | 根据 os 得到                                               |

#### 2.1.2 \_console 控制台

写法对应：浏览器 [Console API](https://developer.mozilla.org/zh-CN/docs/Web/API/Console_API), node [console](https://nodejs.cn/api/console.html)

::: code-tabs#import

@tab browser

```js
import { _console } from 'hp-shared/base';
```

@tab node

```js
const { _console } = require('hp-shared/base');
```

:::

| 属性                                             | 说明                                        |
| ------------------------------------------------ | ------------------------------------------- |
| **log**                                          | <strong style="color:blue">常规</strong>    |
| **warn**                                         | <strong style="color:orange;">警告</strong> |
| **error**                                        | <strong style="color:red">报错</strong>     |
| **success**                                      | <strong style="color:green">成功</strong>   |
| **end**                                          | <strong style="color:grey">结束</strong>    |
| dir                                              |                                             |
| table                                            |                                             |
| group                                            |                                             |
| groupCollapsed                                   |                                             |
| groupAction                                      |                                             |
| getStackInfo                                     | 基础方法                                    |
| show                                             | 基础方法                                    |
| <span style="color:pink;">...其他同名属性</span> | <span style="color:pink;">继承</span>       |

#### 2.1.3 \_Object

::: code-tabs#import

@tab browser

```js
import { _Object } from 'hp-shared/base';
```

@tab node

```js
const { _Object } = require('hp-shared/base');
```

:::

| 属性                               | 说明                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------- |
| <i style="color:pink;">static:</i> |                                                                            |
| keys                               | 相对于 Object.keys 扩展，增加了选项处理需要不同属性的情况                  |
| values                             | 对应 keys 配套                                                             |
| entries                            | 对应 keys 配套                                                             |
| getOwner                           | 属性定义所在的最近对象(来自自身或继承)，便于后续方法获取 descriptor 等操作 |
| getPropertyDescriptor              | 相对于 Object.getOwnPropertyDescriptor 扩展                                |
| getPropertyDescriptors             | 相对于 Object.getPropertyDescriptors 扩展                                  |
| **assign**                         | 浅合并对象，通过重定义方式合并以对 get/set 惰性求值的属性的处理            |
| **deepAssign**                     | 深合并对象，同 assign 使用重定义方式                                       |
| **filter**                         | 过滤对象取部分值                                                           |
| pick                               | 根据 filter 得到，挑选方式                                                 |
| omit                               | 根据 filter 得到，排除方式                                                 |

#### 2.1.4 \_Function

::: code-tabs#import

@tab browser

```js
import { _Function } from 'hp-shared/base';
```

@tab node

```js
const { _Function } = require('hp-shared/base');
```

:::

| 属性                               | 说明                               |
| ---------------------------------- | ---------------------------------- |
| <i style="color:pink;">static:</i> |                                    |
| **pipe**                           | 管道操作， x \|> f1 \|> f2 \|> ... |
| **NOOP**                           | 空函数                             |
| **RAW**                            | 原样返回                           |
| FALSE                              | 返回 false                         |
| TRUE                               | 返回 true                          |

#### 2.1.5 \_Number

::: code-tabs#import

@tab browser

```js
import { _Number } from 'hp-shared/base';
```

@tab node

```js
const { _Number } = require('hp-shared/base');
```

:::

| 属性                               | 说明                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------- |
| <i style="color:pink;">static:</i> |                                                                        |
| **toMaxFixed**                     | 相对于 Number.prototype.toFixed 会移除尾部多余的零和小数点，以精简显示 |
| convertBase                        | 进制转换                                                               |
| isPrime                            | 素数判断                                                               |

#### 2.1.6 \_Math

::: code-tabs#import

@tab browser

```js
import { _Math } from 'hp-shared/base';

const { sin, PI: π } = Math;
console.log(sin(π / 6));

const { C } = _Math;
console.log(C(4, 2));
```

@tab node

```js
const { _Math } = require('hp-shared/base');

const { sin, PI: π } = Math;
console.log(sin(π / 6));

const { C } = _Math;
console.log(C(4, 2));
```

:::

相对于 Math 对象提供更直观和符合数学约定的名称，方便解构后顺手使用

| 属性                               | 说明                                           |
| ---------------------------------- | ---------------------------------------------- |
| <i style="color:pink;">static:</i> |                                                |
| PHI                                | 黄金分割比 ${\Phi}$=$\frac{\sqrt{5} - 1}{2}$   |
| PHI_BIG                            | $\frac{1}{\Phi}$=$\frac{\sqrt{5} + 1}{2}$      |
| arcsin                             | $\arcsin{x}$                                   |
| arccos                             | $\arccos{x}$                                   |
| arctan                             | $\arctan{x}$                                   |
| arsinh                             | ${arsinh} {x}$                                 |
| arcosh                             | ${arcosh} {x}$                                 |
| artanh                             | ${artanh} {x}$                                 |
| **log**                            | $\log_a{x}$                                    |
| loge                               | $\log_e{x}$                                    |
| ln                                 | $\ln{x}$                                       |
| lg                                 | $\lg{x}$                                       |
| factorial                          | $n!$                                           |
| permutation                        | $A_n^k=P(n,k)=\frac{n!}{(n-k)!}$               |
| combination                        | $C_n^k=\binom{k}{n}=\frac{n!}{k!(n-k)!}$       |
| **A**                              | $A_n^k$ 简写方式                               |
| **C**                              | $C_n^k$ 简写方式                               |
| Sequence                           | 数列，基础方法用于继承                         |
| ArithmeticSequence                 | 等差数列：$a_1, a_1+d, a_1+2d, \ldots$         |
| GeometricSequence                  | 等比数列：$a_1, a_1q, a_1q^2, \ldots$          |
| FibonacciSequence                  | 斐波那契数列：$1, 1, 2, 3, 5, 8, 13, \ldots$   |
| PrimeSequence                      | 素数数列：$2, 3, 5, 7, 11, 13, 17, 19, \ldots$ |

#### 2.1.7 \_Date

::: code-tabs#import

@tab browser

```js
import { _Date } from 'hp-shared/base';
```

@tab node

```js
const { _Date } = require('hp-shared/base');
```

:::

| 属性                                  | 说明     |
| ------------------------------------- | -------- |
| <i style="color:pink;">static:</i>    |          |
| **sleep**                             | 延迟操作 |
| <i style="color:pink;">prototype:</i> |          |
| **constructor**                       |          |
| **year**                              |          |
| isLeapYear                            |          |
| **month**                             |          |
| **day**                               |          |
| week                                  |          |
| **hour**                              |          |
| shortHour                             |          |
| **minute**                            |          |
| **second**                            |          |
| millisecond                           |          |
| microsecond                           |          |
| timeZoneOffsetHour                    |          |
| setTime                               |          |
| setYear                               |          |
| setFullYear                           |          |
| setMonth                              |          |
| setDate                               |          |
| setHours                              |          |
| setMinutes                            |          |
| setSeconds                            |          |
| setMilliseconds                       |          |
| setUTCFullYear                        |          |
| setUTCMonth                           |          |
| setUTCDate                            |          |
| setUTCHours                           |          |
| setUTCMinutes                         |          |
| setUTCSeconds                         |          |
| setUTCMilliseconds                    |          |
| **Symbol.toPrimitive**                |          |
| toNumber                              |          |
| toString                              |          |
| toBoolean                             |          |
| toJSON                                |          |
| toDateString                          |          |
| toTimeString                          |          |

#### 2.1.8 \_String

::: code-tabs#import

@tab browser

```js
import { _String } from 'hp-shared/base';
```

@tab node

```js
const { _String } = require('hp-shared/base');
```

:::

| 属性                               | 说明         |
| ---------------------------------- | ------------ |
| <i style="color:pink;">static:</i> |              |
| toFirstUpperCase                   | 首字母大写   |
| toFirstLowerCase                   | 首字母小写   |
| **toCamelCase**                    | 转驼峰命名   |
| **toLineCase**                     | 转连接符命名 |
| **getUnitString**                  | 带单位字符串 |

#### 2.1.9 \_Array

::: code-tabs#import

@tab browser

```js
import { _Array } from 'hp-shared/base';
```

@tab node

```js
const { _Array } = require('hp-shared/base');
```

:::

| 属性                                             | 说明                                  |
| ------------------------------------------------ | ------------------------------------- |
| <i style="color:pink;">static:</i>               |                                       |
| **namesToArray**                                 | 属性名统一成数组格式，手动传参用      |
| <i style="color:pink;">prototype:</i>            |                                       |
| **constructor**                                  |                                       |
| push                                             |                                       |
| pop                                              |                                       |
| remove                                           |                                       |
| unshift                                          |                                       |
| shfit                                            |                                       |
| clear                                            |                                       |
| with                                             |                                       |
| toSpliced                                        |                                       |
| toSorted                                         |                                       |
| toReserved                                       |                                       |
| **Symbol.toPrimitive**                           |                                       |
| toNumber                                         |                                       |
| toString                                         |                                       |
| toBoolean                                        |                                       |
| toJSON                                           |                                       |
| toArray                                          |                                       |
| toCustomArray                                    |                                       |
| toSet                                            |                                       |
| toCustomSet                                      |                                       |
| <span style="color:pink;">...其他同名属性</span> | <span style="color:pink;">继承</span> |

#### 2.1.10 \_Set

::: code-tabs#import

@tab browser

```js
import { _Set } from 'hp-shared/base';
```

@tab node

```js
const { _Set } = require('hp-shared/base');
```

:::

| 属性                                             | 说明                                  |
| ------------------------------------------------ | ------------------------------------- |
| <i style="color:pink;">static:</i>               |                                       |
| **cup**                                          | $A \cup B \cup \ldots$                |
| **cap**                                          | $A \cap B \cap \ldots$                |
| **setminus**                                     | $A \setminus B  \setminus \ldots$     |
| <i style="color:pink;">prototype:</i>            |                                       |
| **constructor**                                  |                                       |
| add                                              |                                       |
| delete                                           |                                       |
| **Symbol.toPrimitive**                           |                                       |
| toNumber                                         |                                       |
| toString                                         |                                       |
| toBoolean                                        |                                       |
| toJSON                                           |                                       |
| toArray                                          |                                       |
| toCustomArray                                    |                                       |
| toSet                                            |                                       |
| toCustomSet                                      |                                       |
| <span style="color:pink;">...其他同名属性</span> | <span style="color:pink;">继承</span> |

#### 2.1.11 \_JSON

::: code-tabs#import

@tab browser

```js
import { _JSON } from 'hp-shared/base';
```

@tab node

```js
const { _JSON } = require('hp-shared/base');
```

:::

专注于 JSON 支持的类型：`null`,`number`,`string`,`boolean`,`array`,`object`，前后端数据交互用

| 属性                               | 说明                        |
| ---------------------------------- | --------------------------- |
| <i style="color:pink;">static:</i> |                             |
| **typeof**                         | 判断类型                    |
| **DataModel**                      | 数据模型                    |
| model                              | 创建 DataModel 实例简写方式 |
| number                             | 创建 DataModel 实例简写方式 |
| string                             | 创建 DataModel 实例简写方式 |
| boolean                            | 创建 DataModel 实例简写方式 |
| array                              | 创建 DataModel 实例简写方式 |
| object                             | 创建 DataModel 实例简写方式 |

#### 2.1.12 \_Reflect

::: code-tabs#import

@tab browser

```js
import { _Reflect } from 'hp-shared/base';
```

@tab node

```js
const { _Reflect } = require('hp-shared/base');
```

:::

| 属性                               | 说明                        |
| ---------------------------------- | --------------------------- |
| <i style="color:pink;">static:</i> |                             |
| ownValues                          | 对应 Reflect.ownKeys 的配套 |
| ownEntries                         | 对应 Reflect.ownKeys 的配套 |

#### 2.1.13 \_Proxy

::: code-tabs#import

@tab browser

```js
import { _Proxy } from 'hp-shared/base';
```

@tab node

```js
const { _Proxy } = require('hp-shared/base');
```

:::

| 属性                               | 说明                        |
| ---------------------------------- | --------------------------- |
| <i style="color:pink;">static:</i> |                             |
| bindThis                           | 用于解构对象方法时绑定 this |

### 2.2 storage 存储

#### 2.2.1 clipboard 剪贴板

同浏览器 [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) 使用

::: code-tabs#import

@tab browser

```js
import { clipboard } from 'hp-shared/storage';

(async function () {
  // copy
  await clipboard.copy(Date.now());
  // paste
  const text = await clipboard.paste();
  console.log(text);
})();
```

@tab node

```js
const { clipboard } = require('hp-shared/storage');

(async function () {
  // copy
  await clipboard.copy(Date.now());
  // paste
  const text = await clipboard.paste();
  console.log(text);
})();
```

:::

| 属性          | 说明             | browser                                 | node                                    |
| ------------- | ---------------- | --------------------------------------- | --------------------------------------- |
| **copy**      | 复制             | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **paste**     | 粘贴             | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| copySync      | 复制（同步方式） | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |
| pasteSync     | 粘贴（同步方式） | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |
| writeText     | 同 copy          | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| readText      | 同 paste         | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| writeTextSync | 同 copySync      | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |
| readTextSync  | 同 pasteSync     | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |

#### 2.2.2 Web Storage

同浏览器 [Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API) 使用，同样专注于前后端交互的 JSON， 存取方法默认做了 JSON 转换

::: code-tabs#import

@tab browser

```js
import { _sessionStorage, _localStorage } from 'hp-shared/storage';

// setItem
_sessionStorage.setItem('a', 1);
// getItem
const a = _sessionStorage.getItem('a');
console.log(a);
```

@tab node

```js

```

:::

| 对象                 | 说明                | browser                                 | node                                   |
| -------------------- | ------------------- | --------------------------------------- | -------------------------------------- |
| **\_sessionStorage** | 对应 sessionStorage | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |
| **\_localStorage**   | 对应 localStorage   | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |

| 属性                                             | 说明                                  | browser                                 | node                                   |
| ------------------------------------------------ | ------------------------------------- | --------------------------------------- | -------------------------------------- |
| **setItem**                                      | 存值                                  | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |
| **getItem**                                      | 取值                                  | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |
| toObject                                         | 转换成对象                            | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |
| <span style="color:pink;">...其他同名属性</span> | <span style="color:pink;">继承</span> | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |

#### 2.2.3 Web Cookie

操作 [Web Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)

::: code-tabs#import

@tab browser

```js
import { cookie } from 'hp-shared/storage';
```

@tab node

```js
const { NodeCookie } = require('hp-shared/storage');

http.createServer((req, res) => {
  const cookie = new NodeCookie(req, res);
});
```

@tab koa

```js
const { NodeCookie } = require('hp-shared/storage');

router.get('/test', (ctx) => {
  const cookie = new NodeCookie(ctx.req, ctx.res);
});
```

:::

| 对象           | 说明                          | browser                                 | node                                    |
| -------------- | ----------------------------- | --------------------------------------- | --------------------------------------- |
| **cookie**     | browser 用                    | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong>  |
| **NodeCookie** | node 用，通过 new 创建 cookie | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |
| BaseCookie     | 基础 class                    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |

##### BaseCookie

| 属性                                  | 说明 | browser                                 | node                                    |
| ------------------------------------- | ---- | --------------------------------------- | --------------------------------------- |
| <i style="color:pink;">prototype:</i> |      |                                         |                                         |
| **constructor**                       |      |                                         |                                         |
| **get**                               | 存值 | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **set**                               | 取值 | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| value                                 |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| length                                |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| toArray                               |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| toObject                              |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| has                                   |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| remove                                |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| clear                                 |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |

##### NodeCookie

| 属性                                  | 说明 | browser                                | node                                    |
| ------------------------------------- | ---- | -------------------------------------- | --------------------------------------- |
| <i style="color:pink;">prototype:</i> |      |                                        |                                         |
| **constructor**                       |      | <strong style="color:#999;">✕</strong> | <strong style="color:green;">✓</strong> |

### 2.3 dev 开发

#### 2.3.1 markdownlint

[markdownlint 配置](https://github.com/DavidAnson/markdownlint/blob/b2305efafb034b1f328845aec9928b5363ffd646/doc/Rules.md)

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D markdownlint-cli
```

@tab yarn

```shell
yarn add -D markdownlint-cli
```

@tab npm

```shell
npm i -D markdownlint-cli2
```

:::

::: code-tabs#lint
@tab 生成 .cjs

```js
// config/lint-md.cjs
const { MarkdownLint } = require('hp-shared/dev');

const lint = new MarkdownLint({
  rootDir: '../',
  __filename,
  configFile: '.markdownlint-cli2.cjs',
});
const config = lint.merge(lint.createBaseConfig(), {
  ignores: [
    ...lint.getIgnores(lint.gitIgnoreFile),
    // ...
  ],
  config: {
    // ...
  },
});

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && markdownlint-cli2 '**/*.md' --fix || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
```

@tab 直接引用

```js

```

:::

#### 2.3.2 stylelint

[stylelint 配置](https://stylelint.io/user-guide/rules)

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D stylelint postcss-html
```

@tab yarn

```shell
yarn add -D stylelint postcss-html
```

@tab npm

```shell
npm i -D stylelint postcss-html
```

:::

::: code-tabs#lint

@tab 生成 .cjs

```js
// config/lint-css.cjs
const { StyleLint } = require('hp-shared/dev');

const lint = new StyleLint({
  rootDir: '../',
  __filename,
  configFile: 'stylelint.config.cjs',
});
const config = lint.merge(lint.baseConfig, lint.htmlConfig, lint.vueConfig, {
  rules: {
    // ...
  },
});
module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && stylelint '**/*.{css,vue}' --fix || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
```

@tab 直接引用

```js

```

:::

#### 2.3.3 eslint

[eslint 配置](https://eslint.org/docs/latest/rules/)，[eslint-plugin-vue 配置](https://eslint.vuejs.org/rules/)，[typescript-eslint 配置](https://typescript-eslint.io/rules/)

##### eslint 9.x

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D eslint@next eslint-plugin-vue vue-eslint-parser typescript typescript-eslint prettier eslint-plugin-prettier
```

@tab yarn

```shell
yarn add -D eslint@next eslint-plugin-vue vue-eslint-parser typescript typescript-eslint prettier eslint-plugin-prettier
```

@tab npm

```shell
npm i -D eslint@next eslint-plugin-vue vue-eslint-parser typescript typescript-eslint prettier eslint-plugin-prettier
```

:::

::: code-tabs#lint

@tab 生成 .cjs

```js
// config/lint-js.cjs
const { EsLint } = require('hp-shared/dev');

const lint = new EsLint({
  eslintVersion: 9,
  requireResolve: 'string',
  require,

  rootDir: '../',
  __filename,
  configFile: 'eslint.config.cjs',
});
const config = [
  {
    ignores: [
      ...lint.getIgnores(lint.gitIgnoreFile),
      // ...
    ],
  },
  lint.merge(lint.baseConfig, {
    files: ['**/*.{js,cjs}'],
    rules: {},
  }),
  lint.merge(lint.baseConfig, lint.vue3Config, {
    files: ['**/*.vue'],
    rules: {},
  }),
];

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && eslint --fix || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
```

@tab 直接引用

```js

```

:::

##### eslint 8.x

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D eslint eslint-plugin-vue vue-eslint-parser typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier
```

@tab yarn

```shell
yarn add -D eslint eslint-plugin-vue vue-eslint-parser typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier
```

@tab npm

```shell
npm i -D eslint eslint-plugin-vue vue-eslint-parser typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier
```

:::

::: code-tabs#lint

@tab 生成 .cjs

```js
// config/lint-js.cjs
const { EsLint } = require('hp-shared/dev');

const lint = new EsLint({
  eslintVersion: 8,
  requireResolve: 'string',
  require,

  rootDir: '../',
  __filename,
  configFile: '.eslintrc.cjs',
});
const config = lint.merge(lint.baseConfig, lint.vue3Config, lint.tsInVueConfig, {
  ignorePatterns: lint.getIgnores(lint.gitIgnoreFile),
  rules: {},
});

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && eslint '**/*.{js,cjs,ts,cts,vue}' --fix || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
```

@tab 直接引用

```js

```

:::

#### 2.3.4 prettier

[prettier 配置](https://prettier.io/docs/en/options)

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D prettier
```

@tab yarn

```shell
yarn add -D prettier
```

@tab npm

```shell
npm i -D prettier
```

:::

::: code-tabs#lint

@tab 生成 .cjs

```js
// config/lint-prettier.cjs
const { Prettier } = require('hp-shared/dev');

const lint = new Prettier({
  rootDir: '../',
  __filename,
  configFile: 'prettier.config.cjs',
});
const config = lint.merge(lint.baseConfig, {
  // ...
});

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && prettier --check --write '**/*.*' || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile(['pnpm-lock.yaml'])
    .createConfigFile(config);
}
```

@tab 直接引用

```js

```

:::

#### 2.3.5 commitlint

[commitlint 配置](https://commitlint.js.org/reference/rules.html)，[husky](https://typicode.github.io/husky/get-started.html)

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D @commitlint/cli husky
```

@tab yarn

```shell
yarn add -D @commitlint/cli husky
```

@tab npm

```shell
npm i -D @commitlint/cli husky
```

:::

::: code-tabs#lint

@tab 生成 .cjs

```js
// config/lint-git.js
const { CommitLint } = require('hp-shared/dev');

const lint = new CommitLint({
  rootDir: '../',
  __filename,
  configFile: 'commitlint.config.cjs',
});
const config = lint.merge(lint.baseConfig, {
  // ...
});

module.exports = {
  lint,
  config,
};
if (require.main === module) {
  lint
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && echo 'feat: test' | commitlint || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
```

@tab 直接引用

```js

```

:::

#### 2.3.6 vite

[vite 配置](https://cn.vitejs.dev/config/)

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D vite @vitejs/plugin-vue @vitejs/plugin-vue-jsx
```

@tab yarn

```shell
yarn add -D vite @vitejs/plugin-vue @vitejs/plugin-vue-jsx
```

@tab npm

```shell
npm i -D vite @vitejs/plugin-vue @vitejs/plugin-vue-jsx
```

:::

::: code-tabs#import

@tab browser

```js

```

@tab node

```js
// vite.config.js
import { vite } from 'hp-shared/dev';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig((env) => {
  return vite.merge(vite.createBaseConfig(env), {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
    },
  });
});
```

:::

## 3.当前项目开发

### 3.1 开始

```shell
# 刷新：用于初始化和更新依赖
pnpm run refresh
```

### 3.2 开发中

```shell
pnpm run build:watch
pnpm run docs:dev
```

### 3.3 发布

```shell
# prepublishOnly 已配置
npm publish
```
