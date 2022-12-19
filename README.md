# hp-shared

基础库

## 使用

```js
// import 方式，浏览器端常用
import { xx } from 'hp-shared/模块名';
// require 方式，node端常用
const { xx } = require('hp-shared/模块名');
```



## 各模块示例

### base 基础通用



### dev 开发

#### eslint

```shell
pnpm i eslint eslint-plugin-vue -D -w
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

#### rollup

#### vite



### network 网络



### storage 存储

#### clipboard

#### cookie

#### storage

#### indexedDB



## 开发

```shell
# 初始化
pnpm i && husky install
```

