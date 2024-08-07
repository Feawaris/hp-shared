---
name: hp-shared
category: 文档
tag: 1.12.0
---

基础库

## 1. 快速上手

### 1.1. 安装

- **npm**

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
npm i hp-shared
```

:::

- **cdn**

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

- **tampermonkey**

[hp-shared (greasyfork.org)](https://greasyfork.org/zh-CN/scripts/497270-hp-shared)

- **pip**

```shell
pip install hp-shared
```

### 1.2.使用

- 简洁路径：已在 package.json 的 `exports` 和 `miniprogram` 字段配置，或根据环境配置 [paths](https://www.typescriptlang.org/tsconfig/#paths)、[alias](https://cn.vitejs.dev/config/shared-options.html#resolve-alias)、[Import maps](https://cn.vuejs.org/guide/quick-start.html#enabling-import-maps) 等使用简洁路径，常用于 vue、node、小程序环境。
- 完整路径：可自行选用 src 或 dist 目录，无法使用简洁路径的环境可使用完整路径，或根据上面配置简洁路径。

::: code-tabs#path

@tab 简洁路径

```js
import { _console } from 'hp-shared/base';
```

@tab 完整路径 dist

```js
import { _console } from 'hp-shared/dist/browser/base.js';
```

@tab 完整路径 src

```ts
import { _console } from 'hp-shared/src/base/index.ts';
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

@tab uniapp/小程序

```js
// import { xx } from 'hp-shared/模块名';
import { _console } from 'hp-shared/base';
```

@tab tampermonkey

```js
// 常用对象已全局挂载，直接使用即可
_console.log('test');
```

@tab shell

```shell
# 已配置同名 cli，按指引操作即可
hp-shared
```

@tab python

```python
# from hp_shared.模块名 import xx
from hp_shared.base import _console
```

:::

## 2.各模块示例

### 2.1 base 基础通用

#### 2.1.1 base/base

##### 总览

|             | 说明     | browser                                                                                                                                                               | wx                                                                                                          | node                                                                            | python                                                                               | js                                      | python                                  |
|-------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|-----------------------------------------|-----------------------------------------|
| **BaseEnv** | 环境判断   | 见下文                                                                                                                                                                   | 见下文                                                                                                         | 见下文                                                                             | 见下文                                                                                  | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **pass**    | 占位     |                                                                                                                                                                       |                                                                                                             |                                                                                 | [pass 语句](https://docs.python.org/zh-cn/3/tutorial/controlflow.html#pass-statements) | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| exit        | 退出     | [window.close](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/close)                                                                                         | [wx.exitMiniProgram](https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.exitMiniProgram.html) | [process.exit](https://nodejs.org/docs/latest/api/process.html#processexitcode) | [exit](https://docs.python.org/zh-cn/3/library/constants.html#exit)                  | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| quit        | 同 exit |                                                                                                                                                                       |                                                                                                             |                                                                                 |                                                                                      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| restart     | 重启     | [locatinon.reload](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/reload), [location.href](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/href) | [wx.reLaunch](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html)                  | [child_process](https://nodejs.org/docs/latest/api/child_process.html)          | [os.execl](https://docs.python.org/zh-cn/3/library/os.html#os.execl)                 | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |

##### BaseEnv 环境判断

|                   | 说明                                                 | browser                                                                                     | wx                                                                                                                    | node                                                                   | python                                                                                     | js                                                                                                                                                     | python                                  |
|-------------------|----------------------------------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| envs              | 代码运行环境，如 ['browser', 'chrome-extension'], ['node'] | [Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)                           | [wx](https://developers.weixin.qq.com/miniprogram/dev/api/)                                                           | [global](https://nodejs.cn/api/globals.html#global)                    |                                                                                            | <strong style="color:green;">✓</strong><br />[globalThis](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis) | <strong style="color:red;">✕</strong>   |
| **isBrowser**     | 根据 envs 得到                                         |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |
| isWebWorker       | 根据 envs 得到                                         |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |
| isChromeExtension | 根据 envs 得到                                         |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |
| isServiceWorker   | 根据 envs 得到                                         |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |
| **isWx**          | 根据 envs 得到                                         |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |
| **isNode**        | 根据 envs 得到                                         |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |
| **isMobile**      | 判断移动端                                              |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |
| os                | 操作系统: windows, mac, linux, ...                     | [navigator.userAgent](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/userAgent) | [wx.getDeviceInfo().platform](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getDeviceInfo.html) | [process.platform](https://nodejs.cn/api/process.html#processplatform) | [platform.system()](https://docs.python.org/zh-cn/3/library/platform.html#platform.system) | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:green;">✓</strong> |
| **isWindows**     | 根据 os 得到                                           |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:green;">✓</strong> |
| **isMac**         | 根据 os 得到                                           |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:green;">✓</strong> |
| **isLinux**       | 根据 os 得到                                           |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:green;">✓</strong> |
| isAndroid         | 根据 os 得到                                           |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |
| isIOS             | 根据 os 得到                                           |                                                                                             |                                                                                                                       |                                                                        |                                                                                            | <strong style="color:green;">✓</strong>                                                                                                                | <strong style="color:red;">✕</strong>   |

::: code-tabs#import

@tab browser

```js
import { BaseEnv } from 'hp-shared/base';
```

@tab node

```js
const { BaseEnv } = require('hp-shared/base');
```

@tab python

```python
from hp_shared.base import BaseEnv
```

:::

#### 2.1.2 _console 控制台

|          | 说明             | **browser**                                                                 | **wx**                                                                                  | **node**                                        | **python**                                                            | js                                      | python                                  |
|----------|----------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|-------------------------------------------------|-----------------------------------------------------------------------|-----------------------------------------|-----------------------------------------|
| _console | 输出             | [Console API](https://developer.mozilla.org/zh-CN/docs/Web/API/Console_API) | [console](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/console.html) | [console](https://nodejs.cn/api/console.html)   | [print](https://docs.python.org/zh-cn/3/library/functions.html#print) | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| _print   | 同 _console.log |                                                                             |                                                                                         |                                                 |                                                                       | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| _input   | 输入             | [prompt](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/prompt)    |                                                                                         | [readline](https://nodejs.cn/api/readline.html) | [input](https://docs.python.org/zh-cn/3/library/functions.html#input) | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |

::: code-tabs#import

@tab browser

```js
import { _console, _input } from 'hp-shared/base';

const text = _input('输入内容：');
_console.log(text);
```

@tab node

```js
const { _console, _input } = require('hp-shared/base');

(async function () {
  const text = await _input('输入内容：');
  _console.log(text);
})();
```

@tab python

```python
from hp_shared.base import _console, _input

text = _input('输入内容：')
_console.log(text)
```

:::

##### _console

| 属性                                         | 说明                                        | js                                      | python                                  |
|--------------------------------------------|-------------------------------------------|-----------------------------------------|-----------------------------------------|
| getStackInfo                               | 基础方法                                      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| getValues                                  | 基础方法                                      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| show                                       | 基础方法                                      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **log**                                    | <strong style="color:blue">常规</strong>    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **warn**                                   | <strong style="color:orange;">警告</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **error**                                  | <strong style="color:red">报错</strong>     | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **success**                                | <strong style="color:green">成功</strong>   | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **end**                                    | <strong style="color:grey">结束</strong>    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| dir                                        |                                           | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| table                                      |                                           | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   |
| group                                      |                                           | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   |
| groupCollapsed                             |                                           | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   |
| groupAction                                |                                           | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   |
| <span style="color:pink;">...其他同名属性</span> | <span style="color:pink;">继承</span>       | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   |

##### _print

同 _console.log，倾向于使用 python 风格时选用

##### _input

| 说明 | browser                                 | node                                    | wx                                    | python                                  |
|----|-----------------------------------------|-----------------------------------------|---------------------------------------|-----------------------------------------|
| 支持 | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong> | <strong style="color:green;">✓</strong> |
| 方式 | 同步                                      | 异步                                      | <strong style="color:red;">✕</strong> | 同步                                      |

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

@tab python

```python
from hp_shared.base import _Object
```

:::

##### _Object

| 属性                                 | 说明                                                    |
|------------------------------------|-------------------------------------------------------|
| <i style="color:pink;">static:</i> |                                                       |
| keys                               | 相对于 Object.keys 扩展，增加了选项处理需要不同属性的情况                   |
| values                             | 对应 keys 配套                                            |
| entries                            | 对应 keys 配套                                            |
| getOwner                           | 属性定义所在的最近对象(来自自身或继承)，便于后续方法获取 descriptor 等操作          |
| getPropertyDescriptor              | 相对于 Object.getOwnPropertyDescriptor 扩展                |
| getPropertyDescriptors             | 相对于 Object.getPropertyDescriptors 扩展                  |
| **assign**                         | 浅合并对象，通过重定义方式合并以对 get/set 惰性求值的属性的处理                  |
| **deepAssign**                     | 深合并对象，同 assign 使用重定义方式                                |
| **filter**                         | 过滤对象取部分值                                              |
| **bindThis**                       | 对象的函数属性绑定 this，方便 vue 中如 @click="formInfo.click" 简便写法 |

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

| 属性                                 | 说明                            |
|------------------------------------|-------------------------------|
| <i style="color:pink;">static:</i> |                               |
| **pipe**                           | 管道操作， x \|> f1 \|> f2 \|> ... |
| **NOOP**                           | 空函数                           |
| **RAW**                            | 原样返回                          |
| FALSE                              | 返回 false                      |
| TRUE                               | 返回 true                       |

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

| 属性                                 | 说明                                               |
|------------------------------------|--------------------------------------------------|
| <i style="color:pink;">static:</i> |                                                  |
| **toMaxFixed**                     | 相对于 Number.prototype.toFixed 会移除尾部多余的零和小数点，以精简显示 |
| convertBase                        | 进制转换                                             |
| isPrime                            | 素数判断                                             |

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

| 属性                                 | 说明                                        |
|------------------------------------|-------------------------------------------|
| <i style="color:pink;">static:</i> |                                           |
| PHI                                | 黄金分割比 ${\Phi}$=$\frac{\sqrt{5} - 1}{2}$   |
| PHI_BIG                            | $\frac{1}{\Phi}$=$\frac{\sqrt{5} + 1}{2}$ |
| arcsin                             | $\arcsin{x}$                              |
| arccos                             | $\arccos{x}$                              |
| arctan                             | $\arctan{x}$                              |
| arsinh                             | ${arsinh} {x}$                            |
| arcosh                             | ${arcosh} {x}$                            |
| artanh                             | ${artanh} {x}$                            |
| **log**                            | $\log_a{x}$                               |
| loge                               | $\log_e{x}$                               |
| ln                                 | $\ln{x}$                                  |
| lg                                 | $\lg{x}$                                  |
| factorial                          | $n!$                                      |
| **A**                              | $A_n^k=P(n,k)=\frac{n!}{(n-k)!}$          |
| **C**                              | $C_n^k=\binom{k}{n}=\frac{n!}{k!(n-k)!}$  |
| Sequence                           | 数列，基础方法用于继承                               |
| ArithmeticSequence                 | 等差数列：$a_1, a_1+d, a_1+2d, \ldots$         |
| GeometricSequence                  | 等比数列：$a_1, a_1q, a_1q^2, \ldots$          |
| FibonacciSequence                  | 斐波那契数列：$1, 1, 2, 3, 5, 8, 13, \ldots$     |
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

| 属性                                    | 说明   |
|---------------------------------------|------|
| <i style="color:pink;">static:</i>    |      |
| **sleep**                             | 延迟操作 |
| <i style="color:pink;">prototype:</i> |      |
| **constructor**                       |      |
| **year**                              |      |
| isLeapYear                            |      |
| **month**                             |      |
| **day**                               |      |
| week                                  |      |
| **hour**                              |      |
| shortHour                             |      |
| **minute**                            |      |
| **second**                            |      |
| millisecond                           |      |
| microsecond                           |      |
| timeZoneOffsetHour                    |      |
| setTime                               |      |
| setYear                               |      |
| setFullYear                           |      |
| setMonth                              |      |
| setDate                               |      |
| setHours                              |      |
| setMinutes                            |      |
| setSeconds                            |      |
| setMilliseconds                       |      |
| setUTCFullYear                        |      |
| setUTCMonth                           |      |
| setUTCDate                            |      |
| setUTCHours                           |      |
| setUTCMinutes                         |      |
| setUTCSeconds                         |      |
| setUTCMilliseconds                    |      |
| **Symbol.toPrimitive**                |      |
| toNumber                              |      |
| toString                              |      |
| toBoolean                             |      |
| toJSON                                |      |
| toDateString                          |      |
| toTimeString                          |      |

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

| 属性                                 | 说明     |
|------------------------------------|--------|
| <i style="color:pink;">static:</i> |        |
| toFirstUpperCase                   | 首字母大写  |
| toFirstLowerCase                   | 首字母小写  |
| **toCamelCase**                    | 转驼峰命名  |
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

| 属性                                         | 说明                                  |
|--------------------------------------------|-------------------------------------|
| <i style="color:pink;">static:</i>         |                                     |
| **namesToArray**                           | 属性名统一成数组格式，手动传参用                    |
| <i style="color:pink;">prototype:</i>      |                                     |
| **constructor**                            |                                     |
| push                                       |                                     |
| pop                                        |                                     |
| remove                                     |                                     |
| unshift                                    |                                     |
| shfit                                      |                                     |
| clear                                      |                                     |
| with                                       |                                     |
| toSpliced                                  |                                     |
| toSorted                                   |                                     |
| toReserved                                 |                                     |
| **Symbol.toPrimitive**                     |                                     |
| toNumber                                   |                                     |
| toString                                   |                                     |
| toBoolean                                  |                                     |
| toJSON                                     |                                     |
| toArray                                    |                                     |
| to_Array                                   |                                     |
| toSet                                      |                                     |
| to_Set                                     |                                     |
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

| 属性                                         | 说明                                  |
|--------------------------------------------|-------------------------------------|
| <i style="color:pink;">static:</i>         |                                     |
| **cup**                                    | $A \cup B \cup \ldots$              |
| **cap**                                    | $A \cap B \cap \ldots$              |
| **setminus**                               | $A \setminus B  \setminus \ldots$   |
| <i style="color:pink;">prototype:</i>      |                                     |
| **constructor**                            |                                     |
| add                                        |                                     |
| delete                                     |                                     |
| **Symbol.toPrimitive**                     |                                     |
| toNumber                                   |                                     |
| toString                                   |                                     |
| toBoolean                                  |                                     |
| toJSON                                     |                                     |
| toArray                                    |                                     |
| to_Array                                   |                                     |
| toSet                                      |                                     |
| to_Set                                     |                                     |
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

| 属性                                 | 说明                  |
|------------------------------------|---------------------|
| <i style="color:pink;">static:</i> |                     |
| **typeof**                         | 判断类型                |
| **DataModel**                      | 数据模型                |
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

| 属性                                 | 说明                     |
|------------------------------------|------------------------|
| <i style="color:pink;">static:</i> |                        |
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

| 属性                                 | 说明 |
|------------------------------------|----|
| <i style="color:pink;">static:</i> |    |

### 2.2 storage 存储

#### 2.2.1 clipboard 剪贴板

同浏览器 **Clipboard API** 使用

|             | 链接                                                                                                               |
|-------------|------------------------------------------------------------------------------------------------------------------|
| **browser** | [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API)                                  |
| **node**    | [child_process](https://nodejs.org/docs/latest/api/child_process.html#child_processexeccommand-options-callback) |
| **wx**      | [剪贴板](https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html)            |
| **python**  | [subprocess](https://docs.python.org/zh-cn/3/library/subprocess.html)                                            |
| 统一定制        | **clipboard**                                                                                                    |

::: code-tabs#import

@tab browser

```js
import { clipboard } from 'hp-shared/storage';

(async function () {
  // copy
  await clipboard.copy('test');
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
  await clipboard.copy('test');
  // paste
  const text = await clipboard.paste();
  console.log(text);
})();
```

@tab wx

```js
import { clipboard } from 'hp-shared/storage';

(async function () {
  // copy
  await clipboard.copy('test');
  // paste
  const text = await clipboard.paste();
  console.log(text);
})();
```

@tab python

```python
from hp_shared.storage import clipboard
import asyncio

async def test():
  # copy
  await clipboard.copy('test')
  # paste
  text = await clipboard.paste()
  print(text)
asyncio.run(test())
```

##### clipboard

:::

| 属性            | 说明          | browser                                 | node                                    | wx                                      | python                                  |
|---------------|-------------|-----------------------------------------|-----------------------------------------|-----------------------------------------|-----------------------------------------|
| **copy**      | 复制          | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **paste**     | 粘贴          | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| *copySync*    | 复制（同步方式）    | <strong style="color:red;">✕</strong>   | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   | <strong style="color:green;">✓</strong> |
| *pasteSync*   | 粘贴（同步方式）    | <strong style="color:red;">✕</strong>   | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   | <strong style="color:green;">✓</strong> |
|               |             |                                         |                                         |                                         |                                         |
| writeText     | 同 copy      | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| readText      | 同 paste     | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| writeTextSync | 同 copySync  | <strong style="color:red;">✕</strong>   | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   | <strong style="color:green;">✓</strong> |
| readTextSync  | 同 pasteSync | <strong style="color:red;">✕</strong>   | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   | <strong style="color:green;">✓</strong> |

#### 2.2.2 Web Storage

同浏览器 **Web Storage API** 使用，同样专注于前后端交互的 JSON， 存取方法默认做了 JSON 转换

|             | 链接                                                                                          |
|-------------|---------------------------------------------------------------------------------------------|
| **browser** | [Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)         |
| **node**    |                                                                                             |
| **wx**      | [数据缓存](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html) |

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
const { _sessionStorage, _localStorage } = require('hp-shared/storage');

// setItem
_sessionStorage.setItem('a', 1);
// getItem
const a = _sessionStorage.getItem('a');
console.log(a);
```

@tab wx

```js
import { _sessionStorage, _localStorage } from 'hp-shared/storage';

// setItem
_sessionStorage.setItem('a', 1);
// getItem
const a = _sessionStorage.getItem('a');
console.log(a);
```

:::

| 对象                   | 说明                | browser                                 | node                                    | wx                                      |
|----------------------|-------------------|-----------------------------------------|-----------------------------------------|-----------------------------------------|
| **\_sessionStorage** | 对应 sessionStorage | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **\_localStorage**   | 对应 localStorage   | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |

| 属性                                         | 说明                                  | browser                                 | node                                    | wx                                      |
|--------------------------------------------|-------------------------------------|-----------------------------------------|-----------------------------------------|-----------------------------------------|
| **setItem**                                | 存值                                  | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **getItem**                                | 取值                                  | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| toObject                                   | 转换成对象                               | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| <span style="color:pink;">...其他同名属性</span> | <span style="color:pink;">继承</span> |                                         |                                         |                                         |

#### 2.2.3 Web Cookie

操作 Web Cookie

|             | 链接                                                                                           |
|-------------|----------------------------------------------------------------------------------------------|
| **browser** | [HTTP Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)                     |
| **node**    | [request.setHeader](https://nodejs.org/docs/latest/api/http.html#requestsetheadername-value) |
| **wx**      |                                                                                              |

::: code-tabs#import

@tab browser

```js
import { cookie } from 'hp-shared/storage';
```

@tab node

```js
const { BaseCookie } = require('hp-shared/storage');

http.createServer((req, res) => {
  const cookie = new NodeCookie(req, res);
});
```

@tab koa

```js
const { BaseCookie } = require('hp-shared/storage');

router.get('/test', (ctx) => {
  const cookie = new NodeCookie(ctx.req, ctx.res);
});
```

@tab wx

```js

```

:::

| 对象             | 说明        | browser                                 | node                                    | wx                                      |
|----------------|-----------|-----------------------------------------|-----------------------------------------|-----------------------------------------|
| **BaseCookie** | 基础 class  | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **cookie**     | browser 用 | <strong style="color:green;">✓</strong> | <strong style="color:red;">✕</strong>   | <strong style="color:red;">✕</strong>   |

##### BaseCookie

| 属性                                    | 说明 | browser                                 | node                                    |
|---------------------------------------|----|-----------------------------------------|-----------------------------------------|
| <i style="color:pink;">prototype:</i> |    |                                         |                                         |
| **constructor**                       |    |                                         |                                         |
| **get**                               | 存值 | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| **set**                               | 取值 | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| value                                 |    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| length                                |    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| toArray                               |    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| toObject                              |    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| has                                   |    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| remove                                |    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |
| clear                                 |    | <strong style="color:green;">✓</strong> | <strong style="color:green;">✓</strong> |

### 2.3 dev 开发

#### 2.3.1 markdownlint

| 链接                                                                                                                                          |
|---------------------------------------------------------------------------------------------------------------------------------------------|
| [markdownlint](https://github.com/DavidAnson/markdownlint/blob/b2305efafb034b1f328845aec9928b5363ffd646/doc/Rules.md)                       |
| [markdownlint schema](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/schema/markdownlint-config-schema.json)                |
| [markdownlint-cli2 schema](https://raw.githubusercontent.com/DavidAnson/markdownlint-cli2/main/schema/markdownlint-cli2-config-schema.json) |

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D markdownlint-cli2
```

@tab yarn

```shell
yarn add -D markdownlint-cli2
```

@tab npm

```shell
npm i -D markdownlint-cli2
```

:::

::: code-tabs#lint

@tab 直接使用

```js
const { MarkdownLint } = require('hp-shared/dev');

const lint = new MarkdownLint();
const config = lint.merge(
  lint.createBaseConfig(),
  {
    ignores: [
      ...lint.getIgnores(lint.gitIgnoreFile),
      // ...
    ],
    config: {
      // ...
    },
  },
);

module.exports = config;
```

@tab 生成 .cjs

```js
// config/lint-md.cjs 通过 cli 初始化
```

:::

#### 2.3.2 stylelint

| 链接                                                 |
|----------------------------------------------------|
| [stylelint](https://stylelint.io/user-guide/rules) |

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

@tab 直接使用

```js
const { StyleLint } = require('hp-shared/dev');

const lint = new StyleLint();
const config = lint.merge(
  lint.baseConfig,
  lint.htmlConfig,
  lint.vueConfig,
  {
    rules: {
      // ...
    },
  },
);

module.exports = config;
```

@tab 生成 .cjs

```js
// config/lint-css.cjs 通过 cli 初始化
```

:::

#### 2.3.3 eslint

| 包             | 链接                                                                |
|---------------|-------------------------------------------------------------------|
| eslint        | [eslint](https://eslint.org/docs/latest/rules/)                   |
| eslint 样式规则抽离 | [@stylistic/eslint-plugin](https://eslint.style/packages/default) |
| vue 用         | [eslint-plugin-vue](https://eslint.vuejs.org/rules/)              |
| ts 用          | [typescript-eslint](https://typescript-eslint.io/rules/)          |

##### eslint 9.x

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D eslint @stylistic/eslint-plugin eslint-plugin-vue vue-eslint-parser typescript typescript-eslint
```

@tab yarn

```shell
yarn add -D eslint @stylistic/eslint-plugin eslint-plugin-vue vue-eslint-parser typescript typescript-eslint
```

@tab npm

```shell
npm i -D eslint @stylistic/eslint-plugin eslint-plugin-vue vue-eslint-parser typescript typescript-eslint
```

:::

::: code-tabs#lint

@tab 直接使用

```js
const { EsLint } = require('hp-shared/dev');

const lint = new EsLint({ eslintVersion: 9 });
const config = [
  {
    ignores: [
      // ...
    ],
  },
  lint.merge(lint.baseConfig, lint.stylisticConfig, {
    files: ['**/*.{js,cjs,mjs}'],
    rules: {},
  }),
  lint.merge(lint.baseConfig, lint.stylisticConfig, lint.tsConfig, {
    files: ['**/*.{ts,cts,mts}'],
    rules: {},
  }),
  lint.merge(lint.baseConfig, lint.stylisticConfig, lint.vue3Config, lint.tsInVueConfig, {
    files: ['**/*.vue'],
    rules: {},
  }),
];

module.exports = config;
```

@tab 生成 .cjs

```js
// config/lint-js.cjs 通过 cli 初始化
```

:::

##### eslint 8.x

::: code-tabs#install

@tab pnpm

```shell
pnpm i -D eslint@8 @stylistic/eslint-plugin eslint-plugin-vue vue-eslint-parser typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

@tab yarn

```shell
yarn add -D eslint@8 @stylistic/eslint-plugin eslint-plugin-vue vue-eslint-parser typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

@tab npm

```shell
npm i -D eslint@8 @stylistic/eslint-plugin eslint-plugin-vue vue-eslint-parser typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

:::

::: code-tabs#lint

@tab 直接使用

```js
const { EsLint } = require('hp-shared/dev')

const lint = new EsLint({ eslintVersion: 8 });
const config = lint.merge(
  lint.baseConfig,
  lint.stylisticConfig,
  lint.vue3Config,
  lint.tsInVueConfig,
  {
    rules: {
      // ...
    },
  }
);

module.exports = config;
```

@tab 生成 .cjs

```js
// config/lint-js.cjs 通过 cli 初始化
```

:::

#### 2.3.4 prettier

| 链接                                              |
|-------------------------------------------------|
| [prettier](https://prettier.io/docs/en/options) |

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

@tab 直接使用

```js
const { Prettier } = require('hp-shared/dev');

const lint = new Prettier();
const config = lint.merge(
  lint.baseConfig,
  {
    // ...
  },
);

module.exports = config;
```

@tab 生成 .cjs

```js
// config/lint-prettier.cjs 通过 cli 初始化
```

:::

#### 2.3.5 commitlint

| 链接                                                           |
|--------------------------------------------------------------|
| [commitlint](https://commitlint.js.org/reference/rules.html) |
| [husky](https://typicode.github.io/husky/get-started.html)   |

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

@tab 直接使用

```js
const { CommitLint } = require('hp-shared/dev');

const lint = new CommitLint();
const config = lint.merge(
  lint.baseConfig,
  {
    // ...
  },
);

module.exports = config;
```

@tab 生成 .cjs

```js
// config/lint-git.js 通过 cli 初始化
```

:::

#### 2.3.6 vite

| 链接                                                       |
|----------------------------------------------------------|
| [vite](https://cn.vitejs.dev/config/)                    |
| [rollup](https://cn.rollupjs.org/configuration-options/) |

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

### 2.4 performance 性能

#### 2.4.1 monitor 稳定性监控

::: code-tabs#import

@tab vue

```js
// main.js
import { Monitor } from 'hp-shared/performance';
import { _sessionStorage } from 'hp-shared/storage';
import pkg from '../package.json';
window.appMonitor = new Monitor({
  reportUrl: ``,
  uid() {
    return _sessionStorage.getItem('userInfo')._id;
  },
  appInfo: {
    name: pkg.name,
    version: pkg.version,
  },
})
  .watchResourceError()
  .watchCodeError()
  .watchPromiseError()
  .watchRequestError()
  .watchRouteChange()
  .watchVueError(app)
```

@tab wx

```js
// app.js
import { Monitor } from 'hp-shared/performance';
import { _localStorage } from 'hp-shared/storage';
wx.appMonitor = new Monitor({
  reportUrl: ``,
  uid() {
    return _localStorage.getItem('userInfo')._id;
  },
  appInfo: {
    name: '',
    version: '',
  },
})
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange()
```

:::

## 3.当前项目开发

### 3.1 开始

```shell
# 刷新状态
pnpm run refresh
# 自引用，确保引 dist 的文件也能导航到源代码
pnpm link ./
```

### 3.2 开发中

```shell
pnpm run build:watch
pnpm run docs:dev
```

### 3.3 发布

```shell
# 已配置 prepublishOnly，直接运行 npm publish 或 pnpm run publish:js
pnpm run publish:js
```

```shell
pnpm run publish:python
```
