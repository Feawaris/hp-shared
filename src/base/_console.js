import { BaseEnv } from './base';
import { _Object } from './_Object';
import { _Date } from './_Date';

// 简易 chalk
const _chalk = {
  blue(message) {
    return `\x1b[34m${message}\x1b[0m`;
  },
  yellow(message) {
    return `\x1b[33m${message}\x1b[0m`;
  },
  red(message) {
    return `\x1b[31m${message}\x1b[0m`;
  },
  green(message) {
    return `\x1b[32m${message}\x1b[0m`;
  },
  grey(message) {
    return `\x1b[90m${message}\x1b[0m`;
  },
  bold(message) {
    return `\x1b[1m${message}\x1b[0m`;
  },
};
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
_console.getStackInfo = function() {
  try {
    throw new Error();
  } catch (e) {
    const stackArr = e.stack.split('\n');
    // chrome 的 stack 以 Error:xx\n 开头，safari 和 firefox 不同
    const stackIndex = e.stack.startsWith('Error') ? 3 : 2;
    const currentStr = (stackArr[stackIndex] || '').trim();
    let { method, filePath } = (() => {
      // chrome: at method (filePath) 格式
      const atMethodPathMatch = /at\s*([^(\s]*)\s\(([^)]+)\)/[Symbol.match](currentStr);
      if (atMethodPathMatch) {
        const [input, method, filePath] = atMethodPathMatch;
        return { method, filePath };
      }
      // chrome: at filePath 格式
      const atPathMatch = /at\s*(\S*)/[Symbol.match](currentStr);
      if (atPathMatch) {
        const [input, filePath] = atPathMatch;
        return { method: '', filePath };
      }
      // 非 chrome: method@filePath 格式
      const notChromeMatch = /(.*)@(.*)/[Symbol.match](currentStr);
      if (notChromeMatch) {
        const [input, method, filePath] = notChromeMatch;
        return { method, filePath };
      }
      return { method: '', filePath: '' };
    })();
    // windows node console 显示调整
    if (BaseEnv.isNode && BaseEnv.isWindows) {
      filePath = filePath.replaceAll('\\', '/');
    }
    // console.log({ stackArr, method, filePath });
    const filePrefix = (() => {
      if (BaseEnv.isNode) {
        // windows 兼容 webstorm console 用 file:/// ，vscode 或普通命令行 file:// 可以正常跳转
        return BaseEnv.isWindows ? String.raw`file:///` : String.raw`file://`;
      }
      return '';
    })();
    return {
      method,
      // node import 方式带前缀，require 方式拼 filePrefix；browser 端 filePrefix 设置 '' 即可
      filePath: filePath.startsWith(filePrefix) ? filePath : `${filePrefix}${filePath}`,
    };
  }
};
_console.show = function({ type = '', typeText = type, stackInfo = {}, values = [] } = {}) {
  const date = new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS');
  // stackInfo 需要从具体方法传进来
  const { method, filePath } = stackInfo;
  // 前缀内容
  let prefix = `[${date}] [${typeText}] ${filePath} ${method} :`;
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
