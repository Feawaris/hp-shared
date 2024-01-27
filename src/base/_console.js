import { BaseEnv } from './base';
import { _Object } from './_Object';
import { _Date } from './_Date';

// 简易 chalk
const styleMap = {
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],

  blackBright: [90, 39],
  gray: [90, 39],
  grey: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  bgBlackBright: [100, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49],

  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  overline: [53, 55],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
};
const _chalk = Object.create(null);
for (const [method, [start, end]] of Object.entries(styleMap)) {
  _chalk[method] = function(message) {
    return `\x1b[${start}m${message}\x1b[${end}m`;
  };
}

export const _console = Object.create(console);
// 选项，初始保存和 create 方法用
_console.$options = {
  // 对应方法用的选项
  dirOptions: {
    depth: 0,
    showHidden: true,
    colors: true,
  },
};
_console.create = function(options = {}) {
  const _console = Object.create(this);
  _console.$options = _Object.deepAssign({}, this.$options, options);
  return _console;
};
// 根据堆栈跟踪格式提取详细信息
_console.getStackInfo = function() {
  try {
    throw new Error();
  } catch (e) {
    const stackArr = e.stack.split('\n');

    // 定义正则表达式以匹配不同的堆栈格式
    const chromeNodeRegex = /\s*at\s+(?:(.*?)\s+\()?(.*?):(\d+):(\d+)(?:\))?/;
    const firefoxSafariRegex = /(.*?)@(.*?):(\d+):(\d+)/;

    // 匹配，选择正确的对应正则和堆栈行：Chrome 和 Node 使用第 4 行，Firefox 和 Safari 使用第 3 行
    const match = e.stack.startsWith('Error') ? chromeNodeRegex[Symbol.match](stackArr[3])
      : firefoxSafariRegex[Symbol.match](stackArr[2]);

    // 提取信息
    if (match) {
      const method = match[1] || '';
      const filePath = match[2];
      const line = Number.parseInt(match[3]);
      const column = Number.parseInt(match[4]);

      // 完整路径和显示用处理
      const fullPath = `${filePath}:${line}:${column}`;
      const fullPathShow = (() => {
        if (BaseEnv.isNode) {
          // windows 兼容 webstorm console 显示用 file:/// ，vscode 或普通命令行 file:// 可以正常跳转
          const prefix = BaseEnv.isWindows ? String.raw`file:///` : String.raw`file://`;
          // node: import 方式带了前缀，require 方式拼前缀上去
          return fullPath.startsWith(prefix) ? fullPath : `${prefix}${fullPath}`;
        }
        return fullPath;
      })();

      return {
        method,
        fullPathShow,

        fullPath,
        filePath,
        line,
        column,
      };
    }
  }
};

_console.show = function({ type = '', typeText = type, stackInfo = {}, values = [] } = {}) {
  // 时间
  const date = new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS');
  // stackInfo 需要从具体方法传进来
  const { method, fullPathShow } = stackInfo;
  // 前缀内容
  let prefix = `[${date}] [${typeText}] ${fullPathShow} ${method} :`;
  // 样式映射
  const styleMap = {
    log: { node: 'blue', browser: 'color:blue;' },
    warn: { node: 'yellow', browser: 'color:orange;' },
    error: { node: 'red', browser: 'color:red;' },
    success: { node: 'green', browser: 'color:green;' },
    end: { node: 'grey', browser: 'color:grey;' },
    bold: { node: 'bold', browser: 'font-weight:bold;' },
  };
  // node 和 browser 显示
  if (BaseEnv.isNode) {
    // 使用 chalk
    console.log(_chalk[styleMap[type].node](prefix), ...values);
  } else {
    // 使用浏览器控制台 API 提供的样式化输出
    console.log(`%c${prefix}`, `${styleMap[type].browser}`, ...values);
  }
};

_console.log = function() {
  const stackInfo = this.getStackInfo();
  return this.show({ type: 'log', stackInfo, values: Array.from(arguments) });
};
_console.warn = function() {
  const stackInfo = this.getStackInfo();
  return this.show({ type: 'warn', stackInfo, values: Array.from(arguments) });
};
_console.error = function() {
  const stackInfo = this.getStackInfo();
  return this.show({ type: 'error', stackInfo, values: Array.from(arguments) });
};
_console.success = function() {
  const stackInfo = this.getStackInfo();
  return this.show({ type: 'success', stackInfo, values: Array.from(arguments) });
};
_console.end = function() {
  const stackInfo = this.getStackInfo();
  return this.show({ type: 'end', stackInfo, values: Array.from(arguments) });
};
_console.dir = function() {
  const stackInfo = this.getStackInfo();
  this.show({ type: 'log', typeText: 'dir', stackInfo });

  for (const value of arguments) {
    if (BaseEnv.isNode) {
      console.dir(value, this.$options.dirOptions);
    } else {
      console.dir(value);
    }
  }
};
_console.table = function() {
  const stackInfo = this.getStackInfo();
  this.show({ type: 'log', typeText: 'table', stackInfo });

  console.table(...arguments);
};
_console.group = function(label) {
  const stackInfo = this.getStackInfo();
  this.show({ type: 'bold', typeText: 'group', stackInfo });

  label = label ?? `console.group [${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  console.group(label);
};
_console.groupCollapsed = function(label) {
  const stackInfo = this.getStackInfo();
  this.show({ type: 'bold', typeText: 'group', stackInfo });

  label = label ?? `console.group [${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  console.groupCollapsed(label);
};

_console.groupAction = function(action = () => {
}, { label, collapse = false } = {}) {
  const stackInfo = this.getStackInfo();
  this.show({ type: 'bold', typeText: 'groupAction', stackInfo });

  label = label ?? `console.group [${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  console[collapse ? 'groupCollapsed' : 'group'](label);
  action();
  console.groupEnd();
};
