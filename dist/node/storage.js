/*!
 * hp-shared v0.1.0
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"cjs"}
 */
  
'use strict';

const nodeClipboardy = require('node-clipboardy');

const clipboard = {
// 对应浏览器端同名方法，减少代码修改
  /**
   * 写入文本(复制)
   * @param text
   * @returns {Promise<void>}
   */
  async writeText(text) {
    // 转换成字符串防止 clipboardy 报类型错误
    const textResult = String(text);
    return await nodeClipboardy.write(textResult);
  },
  /**
   * 读取文本(粘贴)
   * @returns {Promise<string>}
   */
  async readText() {
    return await nodeClipboardy.read();
  },
};

exports.clipboard = clipboard;
exports.nodeClipboardy = nodeClipboardy;
