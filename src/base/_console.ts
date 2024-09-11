import { BaseEnv } from './base';
import { _Object } from './_Object';
import { _Date } from './_Date';

// 简易 chalk
export const _chalk: {
  styleMap: Record<string, [number, number]>,
  [key: string]: any
} = Object.create(console);
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
  _chalk[method] = function (message: any) {
    return `\x1b[${start}m${message}\x1b[${end}m`;
  };
}

export const _console: {
  getStackInfo: Function;
  getValues: Function;
  show: Function;
  log: Function;
  warn: Function;
  error: Function;
  success: Function;
  end: Function;
  dir: Function;
  table: Function;
  group: Function;
  groupCollapsed: Function;
  groupEnd: Function;
  groupAction: Function;
} = Object.create(console);
// 根据堆栈跟踪格式提取详细信息
interface StackInfo {
  fileShow?: string,

  file?: string
  method?: string
  line?: number
  column?: number
}
_console.getStackInfo = function (): StackInfo {
  try {
    throw new Error();
  } catch (e) {
    const stack = e.stack.split('\n');

    // 定义正则表达式以匹配不同的堆栈格式
    const chromeNodeRegex = /\s*at\s+(?:(.*?)\s+\()?(.*?):(\d+):(\d+)\)?/;
    const firefoxSafariRegex = /(.*?)@(.*?):(\d+):(\d+)/;
    const harmonyRegex = /\s*at\s+(?:(.*?)\s+\()?\s*(?:[^|]+ *\| *)*(.*?):(\d+):(\d+)/;

    // 匹配，选择正确的对应正则和堆栈行：Chrome 和 Node 使用第 4 行，Firefox 和 Safari 使用第 3 行，HarmonyOS 使用第 3 行
    const match = (() => {
      if (BaseEnv.isHarmony) {
        return harmonyRegex.exec(stack[2]);
      }
      return e.stack.startsWith('Error')
        ? chromeNodeRegex.exec(stack[3])
        : firefoxSafariRegex.exec(stack[2]);
    })();

    // 提取信息
    if (match) {
      const method = match[1] || '';
      const file = BaseEnv.isWindows ? match[2].replaceAll('\\', '/') : match[2];
      const line = Number.parseInt(match[3]);
      const column = Number.parseInt(match[4]);

      // 完整路径显示处理
      const fileShow = (() => {
        let result = `${file}:${line}:${column}`;
        if (BaseEnv.isHarmony) {
          return result;
        }

        const windowsPathReg = /^[A-Za-z]:\/.*$/;
        const macPathReg = /^\/.*$/;
        if (windowsPathReg.test(file) || macPathReg.test(file)) {
          // windows 兼容 webstorm console 显示用 file:/// ，vscode 或普通命令行 file:// 可以正常跳转
          const prefix = BaseEnv.isWindows ? 'file:///' : 'file://';
          result = `${prefix}${result}`;
        }

        return result;
      })();

      return {
        fileShow,

        file,
        method,
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
  // 前缀内容
  // @ts-ignore
  let prefix = `${[`[${date}]`, `[${type}]`, stackInfo.fileShow, stackInfo.method].filter(val => val).join(' ')} :`;
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
  if (BaseEnv.isBrowser || BaseEnv.isWx || BaseEnv.isChromeExtension || BaseEnv.isWebWorker) {
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
      ...values.map(function getValue(value) {
        // 第一层简单类型配默认颜色
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
        // 其他原样返回
        return value;
      }),
    ];
  }
  if (BaseEnv.isHarmony) {
    return [
      prefix,
      ...values.map(function getValue(value) {
        // 字符串、bi 增加区分显示
        if (typeof value === 'string') {
          return `'${value}'`;
        }
        if (typeof value === 'bigint') {
          return `${value}n`;
        }
        if (value instanceof Set) {
          // 原生 Set
          if (value.constructor === Set) {
            return `{${Array.from(value)}}`;
          }
          // 定制的 Set 对象已配置 Symbol.toPrimitive 或 toString 转换方法
          return `${value}`;
        }
        // 数组、对象：序列化显示
        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
          return JSON.stringify(value);
        }
        // 其他原样输出
        return value;
      }),
    ];
  }
  return values;
};
interface ShowOptions {
  style?: string,
  type?: string,
  stackInfo?: StackInfo,
  values?: any[]
}
// 同时 show 方法也返回用于需要反馈的场景
_console.show = function (options: ShowOptions = {}) {
  const values = _console.getValues(options);
  if (BaseEnv.isHarmony && ['log', 'warn', 'error'].includes(options.type)) {
    console[options.type](...values);
  } else {
    console.log(...values);
  }
  return {
    input: options,
    output: values,
  };
};
_console.log = function (...args) {
  return _console.show({ style: 'blue', type: 'log', stackInfo: _console.getStackInfo(), values: args });
};
_console.warn = function (...args) {
  return _console.show({ style: 'yellow', type: 'warn', stackInfo: _console.getStackInfo(), values: args });
};
_console.error = function (...args) {
  return _console.show({ style: 'red', type: 'error', stackInfo: _console.getStackInfo(), values: args });
};
_console.success = function (...args) {
  return _console.show({ style: 'green', type: 'success', stackInfo: _console.getStackInfo(), values: args });
};
_console.end = function (...args) {
  return _console.show({ style: 'grey', type: 'end', stackInfo: _console.getStackInfo(), values: args });
};
_console.dir = function (value, options = {}) {
  _console.show({ style: 'blue', type: 'dir', stackInfo: _console.getStackInfo() });
  if (BaseEnv.isBrowser || BaseEnv.isChromeExtension || BaseEnv.isWebWorker || BaseEnv.isWx || BaseEnv.isHarmony) {
    return console.dir(value);
  }
  if (BaseEnv.isNode) {
    options = _Object.deepAssign({ depth: 0, showHidden: true, colors: true }, options);
    return console.dir(value, options);
  }
};
_console.table = function (...args) {
  _console.show({ style: 'blue', type: 'table', stackInfo: _console.getStackInfo() });

  console.table(...args);
};
_console.group = function (label, { type = 'group', stackInfo = null } = {}) {
  stackInfo = stackInfo || _console.getStackInfo();
  const date = new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS');
  label = `${[`${label ? `${label} :` : ''}`, `[${date}]`, `[${type}]`, stackInfo.fileShow, stackInfo.method].filter(val => val).join(' ')} :`;
  console.group(label);
};
_console.groupCollapsed = function (label, { type = 'groupCollapsed', stackInfo = null } = {}) {
  stackInfo = stackInfo || _console.getStackInfo();
  const date = new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS');
  label = `${[`${label ? `${label} :` : ''}`, `[${date}]`, `[${type}]`, stackInfo.fileShow, stackInfo.method].filter(val => val).join(' ')} :`;
  console.groupCollapsed(label);
};
_console.groupEnd = function () {
  console.groupEnd();
};
_console.groupAction = function (action = () => {}, label = null, collapse = false) {
  const stackInfo = _console.getStackInfo();
  (collapse ? _console.groupCollapsed : _console.group)(label, { type: 'groupAction', stackInfo });
  action();
  _console.groupEnd();
};

export const _print = _console.log;
export function _input(title = '', _default = ''): string | Promise<string> {
  if (BaseEnv.isBrowser) {
    return prompt(title, _default) || '';
  }
  if (BaseEnv.isNode) {
    const readline = require('node:readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(title, (text) => {
        resolve(text || '');
        rl.close();
      });
    });
  }
  return '';
}
