import { _Object, _Date } from '../base';
import chalk from 'chalk';

export const BaseConsole = Object.create(console);
BaseConsole.$options = {
  // js 运行环境，browser/node
  jsEnv: '',
  // dir 方法用选项
  dirOptions: {},
};
BaseConsole.create = function(options = {}) {
  const _console = Object.create(this);
  _console.$options = _Object.deepAssign({}, this.$options, options);
  return _console;
};
BaseConsole.getStackInfo = function() {
  try {
    throw new Error();
  } catch (e) {
    const stackArr = e.stack.split('\n');
    // chrome 的 stack 以 Error:xx\n 开头，safari 和 firefox 不同
    const stackIndex = e.stack.startsWith('Error') ? 3 : 2;
    const currentStr = (stackArr[stackIndex] || '').trim();
    const { method, filePath } = (() => {
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
    // console.log({ stackArr, method, filePath });
    const filePrefix = (() => {
      if (this.$options.jsEnv === 'node') {
        return process.platform.toLowerCase() === 'win32' ? String.raw`file:\\` : String.raw`file://`;
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
BaseConsole.log = function() {
  const { method, filePath } = this.getStackInfo();
  const date = `[${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  const type = '[log]';
  if (this.$options.jsEnv === 'node') {
    console.log(chalk.blue(date, type, filePath, method, ':'), ...arguments);
  } else {
    // chalk 只在 chrome 系列有效，在 safari 和 firefox 中无效，使用浏览器控制台 API 提供的样式化输出
    console.log(`%c ${date} ${type} ${filePath} ${method} :`, 'color:blue;', ...arguments);
  }
};
BaseConsole.warn = function() {
  const { method, filePath } = this.getStackInfo();
  const date = `[${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  const type = '[warn]';
  if (this.$options.jsEnv === 'node') {
    console.log(chalk.yellow(date, type, filePath, method, ':'), ...arguments);
  } else {
    console.log(`%c ${date} ${type} ${filePath} ${method} :`, 'color:orange;', ...arguments);
  }
};
BaseConsole.error = function() {
  const { method, filePath } = this.getStackInfo();
  const date = `[${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  const type = '[error]';
  if (this.$options.jsEnv === 'node') {
    console.log(chalk.red(date, type, filePath, method, ':'), ...arguments);
  } else {
    console.log(`%c ${date} ${type} ${filePath} ${method} :`, 'color:red;', ...arguments);
  }
};
BaseConsole.success = function() {
  const { method, filePath } = this.getStackInfo();
  const date = `[${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  const type = '[success]';
  if (this.$options.jsEnv === 'node') {
    console.log(chalk.green(date, type, filePath, method, ':'), ...arguments);
  } else {
    console.log(`%c ${date} ${type} ${filePath} ${method} :`, 'color:green;', ...arguments);
  }
};
BaseConsole.end = function() {
  const { method, filePath } = this.getStackInfo();
  const date = `[${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  const type = '[end]';
  if (this.$options.jsEnv === 'node') {
    console.log(chalk.grey(date, type, filePath, method, ':'), ...arguments);
  } else {
    console.log(`%c ${date} ${type} ${filePath} ${method} :`, 'color:grey;', ...arguments);
  }
};
BaseConsole.dir = function() {
  const { method, filePath } = this.getStackInfo();
  const date = `[${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}]`;
  const type = '[dir]';
  if (this.$options.jsEnv === 'node') {
    console.log(chalk.blue(date, type, filePath, method, ':'));
  } else {
    console.log(`%c ${date} ${type} ${filePath} ${method} :`, 'color:blue;');
  }

  for (const value of arguments) {
    if (this.$options.jsEnv === 'node') {
      console.dir(value, this.$options.dirOptions);
    } else {
      console.dir(value);
    }
  }
};
