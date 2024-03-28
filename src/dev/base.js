import { BaseEnv, _Set, _Date, _Object, _console } from '../base';

export const dev = Object.create(null);
// 当前时间转成文件名，替换无法使用的符号
dev.getDateNameForFile = function () {
  return new _Date().toString().replaceAll(':', '_').replaceAll(' ', '__');
};
/**
 * 原样创建文件
 * @param inputFile 输入文件，常用 __filename
 * @param outputFile 输出文件
 * @returns {{success: boolean}|{}|{outputData: string, inputFile: *, outputFile: *, outputDir: string, inputData: string, success: boolean, outputFileRelative: string}}
 */
dev.createSameFile = function ({ inputFile, outputFile } = {}) {
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
  if (BaseEnv.isNode) {
    const fs = require('fs');
    const path = require('path');
    const outputDir = path.dirname(outputFile);
    const outputFileRelative = path.relative(outputDir, outputFile);

    // 写入文件
    const inputData = fs.readFileSync(inputFile, 'utf-8');
    const outputData = inputData;
    fs.writeFileSync(outputFile, outputData);

    // 返回用于输出反馈
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

  return {};
};
/**
 * 创建 JSON 文件
 * @param inputData 输入数据内容
 * @param outputFile 输出文件
 * @returns {{success: boolean}|{}|{outputData: string, inputFile: null, outputFile: *, outputDir: string, inputData: *, success: boolean, outputFileRelative: string}}
 */
dev.createJsonFile = function ({ inputData, outputFile } = {}) {
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

  if (BaseEnv.isNode) {
    const fs = require('fs');
    const path = require('path');
    const outputDir = path.dirname(outputFile);
    const outputFileRelative = path.relative(outputDir, outputFile);

    // 写入文件
    const outputData = JSON.stringify(inputData, null, 2);
    fs.writeFileSync(outputFile, outputData);

    return {
      success: true,
      inputFile: null,
      inputData,
      outputFile,
      outputData,
      outputDir,
      outputFileRelative,
    };
  }

  return {};
};
// 添加内容到 ignore 文件
dev.appendIgnoreFile = function ({ inputData = [], outputFile } = {}) {
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

  if (BaseEnv.isNode) {
    const fs = require('fs');
    const path = require('path');
    const outputDir = path.dirname(outputFile);
    const outputFileRelative = path.relative(outputDir, outputFile);

    const ignoreText = fs.readFileSync(outputFile, 'utf-8');
    const ignoreArr = ignoreText.split('\n').filter((str) => str.trim() !== '' && !str.startsWith('#'));

    // 添加内容
    const appendArr = new _Set(inputData.filter((str) => !ignoreArr.includes(str))).toArray();
    const appendData = `\n${appendArr.join('\n')}\n`;
    if (appendArr.length) {
      fs.appendFileSync(outputFile, appendData);
    }
    return {
      success: true,
      inputFile: null,
      inputData,
      appendData,
      outputFile,
      outputDir,
      outputFileRelative,
    };
  }

  return {};
};
// 从 ignore 文件如 .gitignore 拿内容，用于传 ignores 数组
dev.getIgnoresFromFiles = function (files = []) {
  // 统一成数组处理
  if (typeof files === 'string') {
    files = [files];
  }

  if (BaseEnv.isNode) {
    const fs = require('fs');

    const arr = files
      .map((file) => {
        const text = fs.readFileSync(file, 'utf-8');
        const arr = text.split('\n').filter((str) => str.trim() !== '' && !str.startsWith('#'));
        return arr;
      })
      .flat();
    return new _Set(arr).toArray();
  }

  return [];
};

// 几个 lint 工具共用基础类
export class Lint {
  constructor({ process: _process, require: _require } = {}) {
    this.process = _process;
    this.require = _require;
    this.argv = (() => {
      const arr = this.process?.argv?.slice(2) || [];
      return {
        create: arr.includes('--create'),
      };
    })();
  }

  // 合并选项，这里简单处理，具体的 lint 中详细定制
  merge(...sources) {
    return _Object.deepAssign({}, ...sources);
  }
  mergeWithOptions(options = {}, ...sources) {
    // sources = fn(sources);
    return this.merge(...sources);
  }
}
