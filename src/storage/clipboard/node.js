import { BaseEnv } from '../../base';
import { exec, execSync } from 'child_process';

export const clipboard = Object.create(null);

const commandMap = {
  windows: {
    copy: 'chcp 65001>nul && clip', // Windows 系统先设置编码
    paste: 'powershell get-clipboard',
  },
  mac: {
    copy: 'pbcopy',
    paste: 'pbpaste',
  },
  linux: {
    copy: 'xclip -selection clipboard',
    paste: 'xclip -selection clipboard -o',
  },
};

/**
 * 写入文本(复制)：异步
 * @param text
 * @returns {Promise<unknown>}
 */
clipboard.writeText = async function(text = '') {
  text = String(text);
  const command = commandMap[BaseEnv.osPlatform].copy;
  return new Promise((resolve, reject) => {
    const child = exec(command, (err, stdout) => {
      // 返回
      !err ? resolve(text) : reject(err);
    });
    child.stdin.write(text, 'utf8');
    child.stdin.end();
  });
};
/**
 * 读取文本(粘贴)：异步
 * @returns {Promise<string>}
 */
clipboard.readText = async function() {
  const command = commandMap[BaseEnv.osPlatform].paste;
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      // 移除末尾的换行符
      stdout = stdout.replace(/\r?\n$/, '');
      // 返回
      !err ? resolve(stdout) : reject(err);
    });
  });
};

/**
 * 写入文本(复制)：同步
 * @param text
 * @returns {string}
 */
clipboard.writeTextSync = function(text = '') {
  text = String(text);
  const command = commandMap[BaseEnv.osPlatform].copy;
  execSync(command, { input: text, encoding: 'utf8' });
  // 返回
  return text;
};
/**
 * 读取文本(粘贴)：同步
 * @returns {string}
 */
clipboard.readTextSync = function() {
  const command = commandMap[BaseEnv.osPlatform].paste;
  let stdout = execSync(command, { encoding: 'utf8' });
  // 移除末尾的换行符
  stdout = stdout.replace(/\r?\n$/, '');
  // 返回
  return stdout;
};

/**
 * 简写方式
 */
clipboard.copy = clipboard.writeText.bind(clipboard);
clipboard.paste = clipboard.readText.bind(clipboard);
clipboard.copySync = clipboard.writeTextSync.bind(clipboard);
clipboard.pasteSync = clipboard.readTextSync.bind(clipboard);
