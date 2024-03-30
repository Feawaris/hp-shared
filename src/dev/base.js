import { _Set, _Date, _Object, _console, _chalk, _Array } from '../base';
import path from 'path';
import fs from 'fs';
const serialize = require('serialize-javascript');

export const Dev = Object.create(null);
Dev.REG_EXPS = {
  json: /^\.(json|json5|jsonc)$/,
  js: /^\.(js|cjs|mjs)$/,
  yaml: /^\.(yaml|yml)$/,
  ignore: /ignore$/,
};
// 当前时间转成文件名，替换无法使用的符号
Dev.getDateNameForFile = function () {
  return new _Date().toString().replaceAll(':', '_').replaceAll(' ', '__');
};
/**
 * 原样创建文件
 * @param inputFile 输入文件，常用 __filename
 * @param outputFile 输出文件
 * @returns {{success: boolean}|{}|{outputData: string, inputFile: *, outputFile: *, outputDir: string, inputData: string, success: boolean, outputFileRelative: string}}
 */
Dev.createSameFile = function ({ inputFile, outputFile } = {}) {
  // 参数验证
  let need = { inputFile, outputFile };
  for (const [key, value] of Object.entries(need)) {
    if (![null, undefined].includes(value)) {
      delete need[key];
    }
  }
  if (Object.keys(need).length > 0) {
    _console.error(`缺少参数: ${Object.keys(need)}`);
    return {
      success: false,
    };
  }

  // 创建文件
  const outputDir = path.dirname(outputFile);
  const outputFileRelative = path.relative(outputDir, outputFile);
  // 写入文件
  const inputData = fs.readFileSync(inputFile, 'utf-8');
  const outputData = inputData;
  fs.writeFileSync(outputFile, outputData);
  // 返回用于输出反馈的信息
  return {
    success: true,
    inputFile,
    inputData,
    outputFile,
    outputData,
    outputDir,
    outputFileRelative,
  };
};
// 添加内容到 ignore 文件
Dev.appendIgnoreFile = function ({ inputData = [], outputFile } = {}) {
  // 参数验证
  let need = { inputData, outputFile };
  for (const [key, value] of Object.entries(need)) {
    if (![null, undefined].includes(value)) {
      delete need[key];
    }
  }
  if (Object.keys(need).length > 0) {
    _console.error(`缺少参数: ${Object.keys(need)}`);
    return {
      success: false,
    };
  }

  // 传参统一处理
  if (!Array.isArray(inputData)) {
    inputData = [inputData];
  }

  const outputDir = path.dirname(outputFile);
  const outputFileRelative = path.relative(outputDir, outputFile);
  const ignoreText = fs.readFileSync(outputFile, 'utf-8');
  const ignoreArr = ignoreText.split('\n').filter((str) => str.trim() !== '' && !str.startsWith('#'));
  // 添加内容
  const appendData = new _Set(inputData.filter((str) => !ignoreArr.includes(str))).toArray();
  const appendText = `\n${appendData.join('\n')}\n`;
  const needChange = appendData.length > 0;
  if (needChange) {
    fs.appendFileSync(outputFile, appendText);
  }
  // 返回用于输出反馈的信息
  return {
    success: true,
    needChange,
    inputData,
    appendData,
    outputFile,
    outputDir,
    outputFileRelative,
  };
};
// 从 ignore 文件如 .gitignore 拿内容，用于传 ignores 数组
Dev.getIgnoresFromFiles = function (files = []) {
  // 统一成数组处理
  if (typeof files === 'string') {
    files = [files];
  }

  const arr = files
    .map((file) => {
      const text = fs.readFileSync(file, 'utf-8');
      const arr = text.split('\n').filter((str) => str.trim() !== '' && !str.startsWith('#'));
      return arr;
    })
    .flat();
  return new _Set(arr).toArray();
};
// 创建文件
Dev.createFile = function ({ inputData, outputFile } = {}) {
  // 参数验证
  let need = { inputData, outputFile };
  for (const [key, value] of Object.entries(need)) {
    if (![null, undefined].includes(value)) {
      delete need[key];
    }
  }
  if (Object.keys(need).length > 0) {
    _console.error(`缺少参数: ${Object.keys(need)}`);
    return {
      success: false,
    };
  }

  const ext = path.extname(outputFile);
  const outputData = (() => {
    // 不同文件类型的处理
    if (Dev.REG_EXPS.json.test(ext)) {
      return JSON.stringify(inputData, null, 2);
    }
    // 注意这里 .xxignore 得到的 ext 值为 ''，用 outputFile 判断
    if (Dev.REG_EXPS.ignore.test(outputFile)) {
      if (Array.isArray(inputData)) {
        return inputData.join('\n');
      }
    }
    const serializedInput = serialize(inputData, { space: 2, unsafe: true });
    if (Dev.REG_EXPS.js.test(ext)) {
      return `module.exports = ${serializedInput}`;
    }
    // 其他原样返回
    return inputData;
  })();
  // 写入文件
  fs.writeFileSync(outputFile, outputData);

  // 返回用于输出反馈的信息
  const outputDir = path.dirname(outputFile);
  const outputFileRelative = path.relative(outputDir, outputFile);
  return {
    success: true,
    inputData,
    outputFile,
    outputData,
    outputDir,
    outputFileRelative,
  };
};

// 几个 lint 工具共用基础类
export class Lint {
  /**
   *
   * @param rootDir
   * @param _filename
   * @param _process
   * @param requireResolve 需要调 require 的地方加懒人模式处理，主要对 eslint 9.x 版本，8.x 版本直接传字符串无需过多处理
   *          null: 在配置文件中自行 require
   *          string: 生成方式，先用字符串占位再去掉生成的引号达到同手动输入的效果
   *          getter: 引用方式，传 require 进来，用 getter 处理
   * @param _require
   * @param configFile
   * @param ignoreFile
   * @param scriptName
   * @param gitIgnoreFile
   * @param packageFile
   */
  constructor({ rootDir, __filename: _filename, process: _process, requireResolve = null, require: _require, configFile, ignoreFile, scriptName, gitIgnoreFile = '.gitignore', packageFile = 'package.json' } = {}) {
    this.__filename = _filename;
    this.__dirname = this.__filename ? path.dirname(this.__filename) : '';
    this.rootDir = this.__filename ? path.dirname(this.__dirname, rootDir) : '';
    this.process = _process;
    this.argv = (() => {
      const arr = this.process?.argv?.slice(2) || [];
      return {
        create: arr.includes('--create'),
      };
    })();
    this.requireResolve = requireResolve;
    this.require = _require;
    this.configFile = configFile;
    this.ignoreFile = ignoreFile;
    this.scriptName = scriptName;
    this.gitIgnoreFile = gitIgnoreFile;
    this.packageFile = packageFile;
  }

  // 合并选项，这里简单处理，具体的 lint 中详细定制
  merge(...sources) {
    return _Object.deepAssign({}, ...sources);
  }
  mergeWithOptions(options = {}, ...sources) {
    // sources = fn(sources);
    return this.merge(...sources);
  }

  createConfigFile(config) {
    const inputData = config;
    const outputFile = path.resolve(this.rootDir, this.configFile);
    const res = Dev.createFile({ inputData, outputFile });
    res.success && _console.success(_chalk.green(`已创建 ${res.outputFileRelative}`));
    return this;
  }
  insertGitIgnoreFile(moreData = []) {
    const inputData = [this.configFile, this.ignoreFile, ...moreData].filter((val) => val && String(val).trim() !== '');
    const res = Dev.appendIgnoreFile({
      inputData,
      outputFile: path.resolve(this.rootDir, this.gitIgnoreFile),
    });
    // _console.log(res);
    res.success && res.needChange ? _console.success(_chalk.green(`ignores: ${new _Array(res.appendData)} 已加入到: ${res.outputFileRelative}`)) : _console.end(_chalk.grey(`${res.outputFileRelative} 内容无需重复添加`));
    return this;
  }
  getIgnores(ignoreFile) {
    return Dev.getIgnoresFromFiles(path.resolve(this.rootDir, ignoreFile));
  }
  createIgnoreFile(data = [], { includeGitignore = true } = {}) {
    if (this.ignoreFile) {
      const res = Dev.createFile({
        inputData: [...(includeGitignore ? ['# --- from .gitignore start ---', this.getIgnores(this.gitIgnoreFile).join('\n'), '# --- from .gitignore end ---'] : []), ...(typeof data === 'string' ? data.split('\n') : data)],
        outputFile: path.resolve(this.rootDir, this.ignoreFile),
      });
      res.success && _console.success(_chalk.green(`已创建 ${res.outputFileRelative}`));
    } else {
      _console.end(_chalk.grey(`当前 ignores 可能统一写在了配置文件中，无额外的 ignore 文件，未创建`));
    }
    return this;
  }
  insertPackageJsonScripts(key, value) {
    const text = fs.readFileSync(path.resolve(this.rootDir, this.packageFile), 'utf-8');
    const pkg = JSON.parse(text);
    pkg.scripts = pkg.scripts || {};
    const existValue = pkg.scripts[key] || '';
    // _console.decideBoolean(value === existValue, { value, existValue });
    if (value !== existValue) {
      pkg.scripts[key] = value;
      fs.writeFileSync(path.resolve(this.rootDir, this.packageFile), `${JSON.stringify(pkg, null, 2)}\n`);
      _console.success(_chalk.green(`${key} 命令已加入 ${this.packageFile}`));
    } else {
      _console.end(_chalk.grey(`${this.packageFile} 内容无需重复添加`));
    }
    return this;
  }
}
