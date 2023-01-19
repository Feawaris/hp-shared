# hp-shared

基础库

## 引用

### 引用方式

- npm 方式：使用包管理器安装即可。 `npm`,`cnpm`,`yarn`,`pnpm`,...
- cdn 方式：`unpkg`,`jsdelivr`,...

### 引用路径

- 简洁路径：通过 `hp-shared/模块名` 引用路径。已在 package.json 的 exports 字段配置

- 完整路径：可自行选用 src 或 dist 目录。无法使用简洁路径的环境可使用完整路径

### 示例

#### vue

```js
// 简洁路径
import { xx } from 'hp-shared/模块名';

// 完整路径
import { xx } from 'hp-shared/src/模块名';
```

#### node、electron

```js
// 简洁路径
const { xx } = require('hp-shared/模块名');

// 完整路径
const { xx } = require('hp-shared/dist/node/模块名');
```

#### deno、\<script type="module"\>

```js
// 使用 npm 包
import { xx } from './node_modules/hp-shared/dist/browser/模块名.js';

// 使用 cdn
import { xx } from 'https://unpkg.com/hp-shared/dist/browser/模块名.js';
```

#### html

```html
<!-- 普通 script：直接导入全局变量 shared -->
<!-- 简洁路径 -->
<script src="https://unpkg.com/hp-shared"></script>
<!-- 完整路径 -->
<script src="https://unpkg.com/hp-shared/dist/browser/index.umd.js"></script>

<!-- script type="module"：见上文 -->
```

## 各模块示例

### base 基础通用

### dev 开发

#### eslint

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

#### vite

### network 网络

### storage 存储

#### clipboard 剪贴板

同浏览器 [剪贴板api](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) 使用即可

```js
// vue
import { clipboard } from 'hp-shared/storage'; 

// node
const { clipboard } = require('hp-shared/storage');

// deno：可直接使用已有的库，目前无需额外定制
import * as clipboard from 'https://deno.land/x/copy_paste/mod.ts';
```

#### cookie

#### storage

#### indexedDB

## 开发

1. 开始

  ```shell
# 刷新：安装+打包，同时可用于初始化
pnpm run refresh
  ```

2. 开发中

  ```shell
  # 跑 __tests__ 下多个项目测试用
  pnpm run dev
  # 打包生成各个 dist
  pnpm run build
  # 监听打包生成各个 dist，测试引 dist 目录的项目时用
  pnpm run build:watch
  ```

3. 推送或发布

  ```shell
  # 推送，已部署 pre-push，push前会打包dist并提交
  git push
  
  # 打包dist + 发布
  pnpm run build
  npm publish
  ```
