// @ts-nocheck
import { BaseEnv } from './base';
import { _Object } from './_Object';
import { _Date } from './_Date';

// 简易 chalk
export const _chalk = Object.create(null);
_chalk.styleMap = {
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
for (const [method, [start, end]] of Object.entries(_chalk.styleMap)) {
  _chalk[method] = function (message) {
    return `\x1b[${start}m${message}\x1b[${end}m`;
  };
}

export const _console = Object.create(console);

// 根据堆栈跟踪格式提取详细信息
_console.getStackInfo = function () {
  try {
    throw new Error();
  } catch (e) {
    const stackArr = e.stack.split('\n');

    // 定义正则表达式以匹配不同的堆栈格式
    const chromeNodeRegex = /\s*at\s+(?:(.*?)\s+\()?(.*?):(\d+):(\d+)(?:\))?/;
    const firefoxSafariRegex = /(.*?)@(.*?):(\d+):(\d+)/;

    // 匹配，选择正确的对应正则和堆栈行：Chrome 和 Node 使用第 4 行，Firefox 和 Safari 使用第 3 行
    const match = e.stack.startsWith('Error')
      ? chromeNodeRegex[Symbol.match](stackArr[3])
      : firefoxSafariRegex[Symbol.match](stackArr[2]);

    // 提取信息
    if (match) {
      const method = match[1] || '';
      const filePath = BaseEnv.isWindows ? match[2].replaceAll('\\', '/') : match[2];
      const line = Number.parseInt(match[3]);
      const column = Number.parseInt(match[4]);

      // 完整路径和显示用处理
      const fullPath = `${filePath}:${line}:${column}`;
      const fullPathShow = (() => {
        if (!/^[a-zA-Z0-9-_]+:\/\//.test(fullPath)) {
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
    return {};
  }
};
// 处理成要传入 console.log 显示的值，在 show 显示和 jest 测试用
_console.getValues = function ({ style = '', type = '', stackInfo = {}, values = [] } = {}) {
  // 时间
  const date = new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS');
  // stackInfo 需要从具体方法传进来
  // console.log(stackInfo);
  // 前缀内容
  let prefix = `${[`[${date}]`, `[${type}]`, stackInfo.fullPathShow, stackInfo.method].join(' ')}:`;
  // 样式映射
  const styleMap = {
    blue: { node: 'blue', browser: 'color:blue;' },
    yellow: { node: 'yellow', browser: 'color:orange;' },
    red: { node: 'red', browser: 'color:red;' },
    green: { node: 'green', browser: 'color:green;' },
    grey: { node: 'grey', browser: 'color:grey;' },
    bold: { node: 'bold', browser: 'font-weight:bold;' },
  };
  // browser 和 node 显示，注意判断顺序(uniapp 环境 isWx 和 isNode 都为 true)
  if (BaseEnv.isBrowser || BaseEnv.isChromeExtension || BaseEnv.isWebWorker || BaseEnv.isWx) {
    // 使用浏览器控制台 API 提供的样式化输出
    // values 在浏览器端有对象类型时后面的颜色不生效，此时不定制颜色辅助
    if (values.some((val) => val !== null && ['object', 'function'].includes(typeof val))) {
      return [`%c${prefix}`, `${styleMap[style].browser}`, ...values];
    }

    // 第一层简单类型配默认颜色
    const text = [
      `%c${prefix}`,
      values
        .map((value) => {
          if (typeof value === 'bigint') {
            return `%c${value}n`;
          }
          if (typeof value === 'symbol') {
            return `%c${value.toString()}`;
          }
          return `%c${value}`;
        })
        .join(' '),
    ].join(' ');
    const styleArr = [
      `${styleMap[style].browser}`,
      ...values.map((value) => {
        if ([null, undefined].includes(value)) {
          return 'color:grey;';
        }
        if (typeof value === 'number') {
          return 'color:blue;';
        }
        if (typeof value === 'string') {
          // 特殊 style 显示：只输出一个字符串，不同其他类型组合时同 style 风格
          if (values.length === 1 && ['yellow', 'red', 'green', 'grey'].includes(style)) {
            return styleMap[style].browser;
          }
          return 'color:orange;';
        }
        if (typeof value === 'boolean') {
          return value ? 'color:green;' : 'color:red;';
        }
        if (typeof value === 'bigint') {
          return 'color:#00acc1;';
        }
        if (typeof value === 'symbol') {
          return 'color:magenta;';
        }
        return '';
      }),
    ];
    return [text, ...styleArr];
  }
  if (BaseEnv.isNode) {
    return [
      _chalk[styleMap[style].node](prefix),
      // 第一层简单类型配默认颜色
      ...values.map((value) => {
        if ([null, undefined].includes(value)) {
          return _chalk.grey(value);
        }
        if (typeof value === 'number') {
          return _chalk.blueBright(value);
        }
        if (typeof value === 'string') {
          // 特殊 style 显示：只输出一个字符串，不同其他类型组合时同 style 风格
          if (values.length === 1 && ['yellow', 'red', 'green', 'grey'].includes(style)) {
            return _chalk[styleMap[style].node](value);
          }
          return _chalk.yellowBright(value);
        }
        if (typeof value === 'boolean') {
          return value ? _chalk.greenBright(value) : _chalk.redBright(value);
        }
        if (typeof value === 'bigint') {
          return _chalk.cyanBright(`${value}n`);
        }
        if (typeof value === 'symbol') {
          return _chalk.magentaBright(value.toString());
        }
        return value;
      }),
    ];
  }
  return values;
};
_console.show = function (...args) {
  const values = _console.getValues(...args);
  return console.log(...values);
};
_console.log = function (...args) {
  return _console.show({
    style: 'blue',
    type: 'log',
    stackInfo: _console.getStackInfo(),
    values: args,
  });
};
_console.warn = function (...args) {
  return _console.show({
    style: 'yellow',
    type: 'warn',
    stackInfo: _console.getStackInfo(),
    values: args,
  });
};
_console.error = function (...args) {
  return _console.show({
    style: 'red',
    type: 'error',
    stackInfo: _console.getStackInfo(),
    values: args,
  });
};
_console.success = function (...args) {
  return _console.show({
    style: 'green',
    type: 'success',
    stackInfo: _console.getStackInfo(),
    values: args,
  });
};
_console.end = function (...args) {
  return _console.show({
    style: 'grey',
    type: 'end',
    stackInfo: _console.getStackInfo(),
    values: args,
  });
};
_console.dir = function (value, options = {}) {
  _console.show({ style: 'blue', type: 'dir', stackInfo: _console.getStackInfo() });
  if (BaseEnv.isBrowser || BaseEnv.isChromeExtension || BaseEnv.isWebWorker || BaseEnv.isWx) {
    return console.dir(value);
  }
  if (BaseEnv.isNode) {
    options = _Object.assign({ depth: 0, showHidden: true, colors: true }, options);
    return console.dir(value, options);
  }
};
_console.table = function (...args) {
  _console.show({ style: 'blue', type: 'table', stackInfo: _console.getStackInfo() });

  console.table(...args);
};
_console.group = function (label) {
  _console.show({ style: 'bold', type: 'group', stackInfo: _console.getStackInfo() });

  label = label ?? `console.group [${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  console.group(label);
};
_console.groupCollapsed = function (label) {
  _console.show({ style: 'bold', type: 'group', stackInfo: _console.getStackInfo() });

  label = label ?? `console.group [${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  console.groupCollapsed(label);
};

_console.groupAction = function (action = () => {}, label = null, collapse = false) {
  _console.show({ style: 'bold', type: 'groupAction', stackInfo: _console.getStackInfo() });

  label = label ?? `console.group [${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  console[collapse ? 'groupCollapsed' : 'group'](label);
  action();
  console.groupEnd();
};
