# hp-shared

基础库

## 1.引用

### 1.1 引用方式

- npm 方式：使用包管理器安装即可。 `npm`,`cnpm`,`yarn`,`pnpm`,...
- cdn 方式：`unpkg`,`jsdelivr`,...

### 1.2 引用路径

- 简洁路径：通过 `hp-shared/模块名` 引用路径。已在 package.json 的 `exports` 字段配置，常用于 vue 或 node 环境

- 完整路径：可自行选用 src 或 dist 目录。无法使用简洁路径的环境可使用完整路径

### 1.3 示例

#### vue: esm

```js
// 简洁路径
import { xx } from 'hp-shared/模块名';

// 完整路径
import { xx } from 'hp-shared/src/模块名';
import { xx } from 'hp-shared/dist/browser/模块名';
```

#### node: cjs

```js
// 简洁路径
const { xx } = require('hp-shared/模块名');

// 完整路径
const { xx } = require('hp-shared/dist/node/模块名');
```

#### html: umd

```html
<!-- 普通 script：直接导入全局变量 shared -->
<!-- 简洁路径 -->
<script src="https://unpkg.com/hp-shared"></script>
<!-- 完整路径 -->
<script src="https://unpkg.com/hp-shared/dist/browser/index.umd.js"></script>

<!-- script type="module" -->
<sctipt type="module">
  // 使用 npm 包
  import { xx } from './node_modules/hp-shared/dist/browser/模块名.js';

  // 使用 cdn
  import { xx } from 'https://unpkg.com/hp-shared/dist/browser/模块名.js';
</sctipt>
```



## 2.各模块示例

### 2.1 base 基础通用

#### 2.1.1 base/base

##### BaseEnv 环境判断

```js
// browser
import { BaseEnv } from 'hp-shared/base';

// node
const { BaseEnv } = require('hp-shared/base');
```

| 属性     | 说明                               |
| ------------- | ---------------------------------- |
| env           | 代码运行环境: browser, node, ...   |
| **isBrowser** | 根据 env 得到                      |
| **isNode**    | 根据 env 得到                      |
| os            | 操作系统: windows, mac, linux, ... |
| **isWindows** | 根据 os 得到                       |
| **isMac**     | 根据 os 得到                       |
| **isLinux**   | 根据 os 得到                       |

#### 2.1.2 _console 控制台

写法对应：浏览器 [Console API](https://developer.mozilla.org/zh-CN/docs/Web/API/Console_API)、node [console](https://nodejs.cn/api/console.html)

```js
// browser
import { _console } from 'hp-shared/base';

// node
const { _console } = require('hp-shared/base');
```

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

#### 2.1.3 _Object

| 属性                          | 说明                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| <i style="color:pink;">static:</i> |                                                              |
| keys                               | 相对于 Object.keys 扩展，增加了选项处理需要不同属性的情况    |
| values                             | 对应 keys 配套                                               |
| entries                            | 对应 keys 配套                                               |
| getOwner                           | 属性定义所在的最近对象(来自自身或继承)，便于后续方法获取 descriptor 等操作 |
| getPropertyDescriptor              | 相对于 Object.getOwnPropertyDescriptor 扩展                  |
| getPropertyDescriptors             | 相对于 Object.getPropertyDescriptors 扩展                    |
| **assign**                         | 浅合并对象，通过重定义方式合并以对 get/set 惰性求值的属性的处理 |
| **deepAssign**                     | 深合并对象，同 assign 使用重定义方式                         |
| **filter**                         | 过滤对象取部分值                                             |
| pick                               | 根据 filter 得到，挑选方式                                   |
| omit                               | 根据 filter 得到，排除方式                                   |

#### 2.1.4 _Function

| 属性                          | 说明                               |
| ---------------------------------- | ---------------------------------- |
| <i style="color:pink;">static:</i> |                                    |
| **pipe**                           | 管道操作， x \|> f1 \|> f2 \|> ... |
| **NOOP**                           | 空函数                             |
| **RAW**                            | 原样返回                           |
| FALSE                              | 返回 false                         |
| TRUE                               | 返回 true                          |

#### 2.1.5 _Number

| 属性                          | 说明                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| <i style="color:pink;">static:</i> |                                                              |
| **toMaxFixed**                     | 相对于 Number.prototype.toFixed 会移除尾部多余的零和小数点，以精简显示 |
| convertBase                        | 进制转换                                                     |
| isPrime                            | 素数判断                                                     |

#### 2.1.6 _Math

相对于 Math 对象提供更直观和符合数学约定的名称，方便解构后顺手使用

```js
// browser
import { _Math } from 'hp-shared/base';
// node
const { _Math } = require('hp-shard/base')

const { sin, PI: π } = Math;
console.log(sin(π/6));

const { C } = _Math;
console.log(C(4,2));
```



| 属性                          | 说明                                           |
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
| **A**                              | permutation 简写方式                           |
| **C**                              | combination 简写方式                           |
| Sequence                           | 数列，基础方法用于继承                         |
| ArithmeticSequence                 | 等差数列：$a_1, a_1+d, a_1+2d, \ldots$         |
| GeometricSequence                  | 等比数列：$a_1, a_1q, a_1q^2, \ldots$          |
| FibonacciSequence                  | 斐波那契数列：$1, 1, 2, 3, 5, 8, 13, \ldots$   |
| PrimeSequence                      | 素数数列：$2, 3, 5, 7, 11, 13, 17, 19, \ldots$ |

#### 2.1.7 _Date

| 属性                             | 说明     |
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

#### 2.1.8 _String

| 属性                          | 说明         |
| ---------------------------------- | ------------ |
| <i style="color:pink;">static:</i> |              |
| toFirstUpperCase                   | 首字母大写   |
| toFirstLowerCase                   | 首字母小写   |
| **toCamelCase**                    | 转驼峰命名   |
| **toLineCase**                     | 转连接符命名 |
| **getUnitString**                  | 带单位字符串 |

#### 2.1.9 _Array

| 属性                                        | 说明                                  |
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

#### 2.1.10 _Set

| 属性                                        | 说明                                  |
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

#### 2.1.11 _JSON

专注于 JSON 支持的类型：`null`,`number`,`string`,`boolean`,`array`,`object`，前后端数据交互用

| 属性                          | 说明                        |
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

#### 2.1.12 _Reflect

| 属性                          | 说明                        |
| ---------------------------------- | --------------------------- |
| <i style="color:pink;">static:</i> |                             |
| ownValues                          | 对应 Reflect.ownKeys 的配套 |
| ownEntries                         | 对应 Reflect.ownKeys 的配套 |

#### 2.1.13 _Proxy

| 属性                          | 说明                        |
| ---------------------------------- | --------------------------- |
| <i style="color:pink;">static:</i> |                             |
| bindThis                           | 用于解构对象方法时绑定 this |

### 2.2 storage 存储

#### 2.2.1 clipboard 剪贴板

同浏览器 [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) 使用

```js
// browser
import { clipboard } from 'hp-shared/storage';
// node
const { clipboard } = require('hp-shared/storage');

(async function() {
  // copy
  await clipboard.copy(Date.now());
  // paste
  const text = await clipboard.paste();
  console.log(text);
})();
```

| 属性     | 说明             | browser                                 | node                                    |
| ------------- | ---------------- | --------------------------------------- | --------------------------------------- |
| **copy**      | 复制             | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **paste**     | 粘贴             | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| copySync      | 复制（同步方式） | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |
| pasteSync     | 粘贴（同步方式） | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |
| writeText     | 同 copy          | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| readText      | 同 paste         | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| writeTextSync | 同 copySync      | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |
| readTextSync  | 同 pasteSync     | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |

#### 2.2.2 web storage

同浏览器 [Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API) 使用，同样专注于前后端交互的 JSON， 存取方法默认做了 JSON 转换

```js
// browser
import { _sessionStorage, _localStorage } from 'hp-shared/storage';

// setItem
_sessionStorage.setItem('a', 1);
// getItem
const a = _sessionStorage.getItem('a');
console.log(a);

```

| 对象                | 说明                | browser                                 | node                                   |
| ------------------- | ------------------- | --------------------------------------- | -------------------------------------- |
| **_sessionStorage** | 对应 sessionStorage | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |
| **_localStorage**   | 对应 localStorage   | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |



| 属性                                             | 说明                                  | browser                                 | node                                   |
| ------------------------------------------------ | ------------------------------------- | --------------------------------------- | -------------------------------------- |
| **setItem**                                      | 存值                                  | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |
| **getItem**                                      | 取值                                  | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |
| toObject                                         | 转换成对象                            | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |
| <span style="color:pink;">...其他同名属性</span> | <span style="color:pink;">继承</span> | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong> |

#### 2.2.3 cookie

操作 [cookie](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie)

```js
// browser
import { cookie } from 'hp-shared/storage';

// node
const { NodeCookie } = require('hp-shared/storage');
http.createServer((req, res) => {
  const cookie = new NodeCookie(req, res);
});

// koa
const { NodeCookie } = require('hp-shared/storage');
router.get('/test', (ctx) => {
  const cookie = new NodeCookie(ctx.req, ctx.res);
});
```

| 对象           | 说明                          | browser                                 | node                                    |
| -------------- | ----------------------------- | --------------------------------------- | --------------------------------------- |
| **cookie**     | browser 用                    | <strong style="color:green;">✓</strong> | <strong style="color:#999;">✕</strong>  |
| **NodeCookie** | node 用，通过 new 创建 cookie | <strong style="color:#999;">✕</strong>  | <strong style="color:green;">✓</strong> |
| BaseCookie     | 基础 class                    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |

##### BaseCookie

| 属性    | 说明 | browser                                 | node                                    |
| ------------ | ---- | --------------------------------------- | --------------------------------------- |
| <i style="color:pink;">prototype:</i> |      |                                         |                                         |
| **constructor** | | | |
| **get**      | 存值 | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **set**      | 取值 | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| value        |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| length       |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| toArray      |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| toObject     |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| has          |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| remove       |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| clear        |      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |

##### NodeCookie

| 属性                                  | 说明 | browser                                | node                                    |
| ------------------------------------- | ---- | -------------------------------------- | --------------------------------------- |
| <i style="color:pink;">prototype:</i> |      |                                        |                                         |
| **constructor**                       |      | <strong style="color:#999;">✕</strong> | <strong style="color:green;">✓</strong> |

### 2.3 dev 开发

#### 2.3.1 eslint

```shell
pnpm i eslint eslint-plugin-vue -D
```

```js
// .eslintrc.js
const { eslint: { merge, use, ERROR, WARN, OFF } } = require('hp-shared/dev');
module.exports = merge(
  // 定制的配置
  use({ vueVersion: 3 }),
  // 更多配置，同eslint整体导出格式
  {
    rules: {},
  },
);
```

### 

## 3.当前项目开发

### 3.1 开始

  ```shell
# 刷新：安装/更新依赖+打包。可在拉取成员代码时用，防止更新了依赖忘记安装，同时可用于项目初始化
pnpm run refresh:build
  ```

### 3.2 开发中

  ```shell
  # 监听打包生成各个 dist，测试引 dist 目录的项目时用
  pnpm run build:watch
  # 打包生成各个 dist
  pnpm run build
  ```

### 3.3 发布

  ```shell
  # 1.检查版本号的修改情况
  # 2.运行 refresh:build 命令以确保 dist 也打包
  pnpm run refresh:build
  # 3.可能产生的 git 提交
  # 4.发布
  npm publish
  # 5.加 tag，推送到仓库
  ```
