// @ts-nocheck
import { _Set, _Date, _Object, _console, _Array } from '../base';
import path from 'node:path';
import fs from 'node:fs';
import serialize from 'serialize-javascript';

export class Dev {
  static REG_EXPS = {
    json: /^\.(json|json5|jsonc)$/,
    js: /^\.(js|cjs|mjs)$/,
    yaml: /^\.(yaml|yml)$/,
    ignore: /ignore$/,
  };
  // 当前时间转成文件名，替换无法使用的符号
  static getDateNameForFile() {
    return new _Date().toString().replaceAll(':', '_').replaceAll(' ', '__');
  }
  /**
   * 原样创建文件
   * @param inputFile 输入文件，常用 __filename
   * @param outputFile 输出文件
   * @returns {{success: boolean}|{}|{outputData: string, inputFile: *, outputFile: *, outputDir: string, inputData: string, success: boolean, outputFileRelative: string}}
   */
  static createSameFile({ inputFile, outputFile } = {}) {
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
  }
  // 添加内容到 ignore 文件
  static appendIgnoreFile({ inputData = [], outputFile } = {}) {
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
  }
  // 从 ignore 文件如 .gitignore 拿内容，用于传 ignores 数组
  static getIgnoresFromFiles(files = []) {
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
  }
  // 创建文件
  static createFile({ inputData, outputFile } = {}) {
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
  }
}

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
   * @param gitIgnoreFile
   * @param packageFile
   */
  constructor({ rootDir, __filename: _filename, process: _process, requireResolve = null, require: _require, configFile, ignoreFile, gitIgnoreFile = '.gitignore', packageFile = 'package.json' } = {}) {
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

  createConfigFile(data) {
    const outputFile = path.resolve(this.rootDir, this.configFile);
    const oldText = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf-8') : '';
    const newText = `module.exports = ${typeof data === 'string' ? data : serialize(data, { space: 2, unsafe: true })}`;
    if (newText === oldText) {
      _console.end(`${this.configFile} 无需更新`);
    } else {
      fs.writeFileSync(outputFile, newText);
      _console.success(`已生成: ${this.configFile}`);
    }
    return this;
  }
  insertGitIgnoreFile(moreData = []) {
    const inputData = [this.configFile, this.ignoreFile, ...moreData].filter((val) => val && String(val).trim() !== '');
    const res = Dev.appendIgnoreFile({
      inputData,
      outputFile: path.resolve(this.rootDir, this.gitIgnoreFile),
    });
    res.success && res.needChange ? _console.success(`ignores: ${new _Array(res.appendData)} 已加入到: ${res.outputFileRelative}`) : _console.end(`${res.outputFileRelative} 无需更新`);
    return this;
  }
  getIgnores(ignoreFile) {
    return Dev.getIgnoresFromFiles(path.resolve(this.rootDir, ignoreFile));
  }
  createIgnoreFile(data = [], { includeGitignore = true } = {}) {
    if (!this.ignoreFile) {
      _console.end(`ignore 文件无需创建`);
      return this;
    }
    const outputFile = path.resolve(this.rootDir, this.ignoreFile);
    const oldText = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf-8') : '';

    const gitIgnoreData = includeGitignore ? [
      '# ---[auto] from:.gitignore start---',
      this.getIgnores(this.gitIgnoreFile).join('\n'),
      '# ---[auto] from:.gitignore end---',
    ] : [];
    data = [
      ...gitIgnoreData,
      ...(typeof data === 'string' ? data.split('\n') : data),
    ];
    const newText = data.join('\n');

    if (newText === oldText) {
      _console.end(`${this.ignoreFile} 无需更新`);
    } else {
      fs.writeFileSync(outputFile, newText);
      _console.success(`已生成: ${this.ignoreFile}`);
    }
    return this;
  }
  insertPackageJsonScripts(name, value) {
    value = value.replaceAll('\\', '/');
    let pkg = require(path.resolve(this.rootDir, this.packageFile));
    pkg.scripts = pkg.scripts || {};
    const oldValue = pkg.scripts[name] || '';
    if (value !== oldValue) {
      pkg.scripts[name] = value;
      fs.writeFileSync(path.resolve(this.rootDir, this.packageFile), `${JSON.stringify(pkg, null, 2)}\n`);
      _console.success(`${name} 命令已更新到: ${this.packageFile}`);
    } else {
      _console.end(`${this.packageFile} ${name} 无需更新`);
    }
    return this;
  }
}

export class IgnoreLint {
  constructor({ rootDir, __filename: _filename, ignoreFile } = {}) {
    this.__filename = _filename;
    this.__dirname = this.__filename ? path.dirname(this.__filename) : '';
    this.rootDir = this.__filename ? path.dirname(this.__dirname, rootDir) : '';
    this.ignoreFile = ignoreFile;
    this.basename = path.basename(this.ignoreFile);
  }
  static getReg(group = '', tag = 'auto') {
    const pattern = `# ---\\[${tag}\\] ${group} start---[\\s\\S]*?# ---\\[${tag}\\] ${group} end---`;
    return new RegExp(pattern, 'g');
  }
  static createText(group = '', data = [], tag = 'auto') {
    return [`# ---[${tag}] ${group} start---`, ...data, `# ---[${tag}] ${group} end---`].join('\n');
  }
  getText() {
    return fs.readFileSync(path.resolve(this.rootDir, this.ignoreFile), 'utf-8');
  }
  getData() {
    return this.getText().split('\n');
  }
  setText(text) {
    fs.writeFileSync(path.resolve(this.rootDir, this.ignoreFile), text);
    return this;
  }
  getFormatText(text = this.getText()) {
    const arr = text.split('\n');
    let resultArr = [];
    const reg = /^# ---\[/;
    for (const str of arr) {
      // 检查当前行和上一行是否为特殊注释行
      if (reg.test(str) && reg.test(resultArr[resultArr.length - 1] || '')) {
        resultArr.push(''); // 使用 \n 会在下面 join('\n') 时变成两行，添加一个空字符串代表一个空行，而不是直接的换行符
        resultArr.push(str);
        continue;
      }
      if (str.trim() === '') {
        // 多个空行转成单个
        if (str.trim() === '' && resultArr[resultArr.length - 1]?.trim() === '') {
          continue;
        }
      }
      // 其他直接加入
      resultArr.push(str);
    }
    const result = resultArr.join('\n');
    return result;
  }
  formatFile() {
    const text = this.getText();
    const result = this.getFormatText(text);
    if (result === text) {
      _console.end(`${this.basename} 无需格式化`);
    } else {
      this.setText(result);
      _console.success(`${this.basename} 已格式化`);
    }
    return this;
  }
  updateGroup({ group = '', data = [] } = {}) {
    const text = this.getText();
    const reg = IgnoreLint.getReg(group);
    const matches = text.match(reg);
    const result = (() => {
      if (matches) {
        const oldData = matches[0].split('\n').filter((str) => str.trim() !== '' && !/^#/.test(str) && !data.includes(str));
        data = [...(oldData.length ? [...oldData, ''] : []), ...data];
        return text.replace(reg, IgnoreLint.createText(group, data));
      } else {
        return `${text}\n${IgnoreLint.createText(group, data)}`;
      }
    })();
    if (result === text) {
      _console.end(`${this.basename} 无需更新`);
    } else {
      this.setText(result);
      _console.success(`${this.basename}: ${group} 组内容已更新`);
    }
    return this;
  }
  updateFile({ data = [], exclude = [] } = {}) {
    let result = Array.isArray(data) ? data.join('\n') : data;
    for (const item of exclude) {
      result = result.replace(IgnoreLint.getReg(item.group, item.tag), '');
    }
    result = this.getFormatText(result);

    const text = this.getText();
    if (result === text) {
      _console.end(`${this.basename}: 无需更新`);
    } else {
      this.setText(result);
      _console.success(`${this.basename}: 内容已更新`);
    }
    return this;
  }
}
