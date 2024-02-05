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

#### vue

```js
// 简洁路径
import { xx } from 'hp-shared/模块名';

// 完整路径
import { xx } from 'hp-shared/src/模块名';
import { xx } from 'hp-shared/dist/browser/模块名';
```

#### node

```js
// 简洁路径
const { xx } = require('hp-shared/模块名');

// 完整路径
const { xx } = require('hp-shared/dist/node/模块名');
```

#### \<script type="module"\>

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



## 2.各模块示例

### 2.1 base 基础通用

#### 2.1.1 BaseEnv 环境判断

用于判断代码运行平台：browser,node，操作系统：windows,mac 等

```js
// vue
import { BaseEnv } from 'hp-shared/base';

// node
const { BaseEnv } = require('hp-shared/base');
```

#### 2.1.2 _console 控制台

写法对应 [browser console](https://developer.mozilla.org/zh-CN/docs/Web/API/console)、[node console](https://nodejs.cn/api/console.html)，增加了颜色和行数显示，和扩展方法

```js
// vue
import { _console } from 'hp-shared/base';

// node
const { _console } = require('hp-shared/base');
```

### 2.2 dev 开发

#### 2.2.1 eslint

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

### 2.3 storage 存储

#### 2.3.1 clipboard 剪贴板

同浏览器 [剪贴板api](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) 使用即可

```js
// vue
import { clipboard } from 'hp-shared/storage';

// node
const { clipboard } = require('hp-shared/storage');
```



## 3.开发

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
