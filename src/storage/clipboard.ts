import { _console, BaseEnv } from '../base';

interface BaseClipboard {
  copy: (text: string) => Promise<string>;
  copySync: (text: string) => string;
  paste: () => Promise<string>;
  pasteSync: () => string;
  writeText: (text: string) => Promise<string>;
  writeTextSync: (text: string) => string;
  readText: () => Promise<string>;
  readTextSync: () => string;
}
export const clipboard: BaseClipboard = Object.create(null);

const commandMap = {
  windows: {
    copy: 'chcp 65001>nul && clip', // Windows 系统防止复制中文乱码
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
// 复制
clipboard.copy = async function (text: string = ''): Promise<string> {
  text = String(text);
  if (BaseEnv.isBrowser) {
    try {
      await navigator.clipboard.writeText(text);
      return text;
    } catch (e) {
      // 复制文本旧写法，在 Clipboard API 不可用时代替
      // 新建
      const textarea = document.createElement('textarea');
      // 赋值
      textarea.value = text;
      // 样式
      Object.assign(textarea.style, {
        position: 'fixed',
        top: 0,
        clipPath: 'circle(0)',
      });
      // 加入
      document.body.append(textarea);
      // 选中
      textarea.select();
      // 复制
      const success = document.execCommand('copy');
      // 移除
      textarea.remove();

      return success ? text : Promise.reject();
    }
  }
  if (BaseEnv.isWx) {
    return new Promise((resolve, reject) => {
      wx.setClipboardData({
        data: text,
        success(res) {
          resolve(text);
        },
        fail(res) {
          reject();
        },
      });
    });
  }
  if (BaseEnv.isNode) {
    const child_process = require('node:child_process');
    const command = commandMap[BaseEnv.os].copy;
    return new Promise((resolve, reject) => {
      const child = child_process.exec(command, (err, stdout) => {
        !err ? resolve(text) : reject();
      });
      child.stdin.write(text, 'utf8');
      child.stdin.end();
    });
  }
  return text;
};
clipboard.copySync = function (text: string = ''): string {
  if (BaseEnv.isBrowser || BaseEnv.isWx) {
    throw new Error('clipboard 在当前环境无同步写法');
  }
  if (BaseEnv.isNode) {
    const child_process = require('node:child_process');
    const command = commandMap[BaseEnv.os].copy;
    child_process.execSync(command, { input: text, encoding: 'utf8' });
    return text;
  }
  return '';
};
// 粘贴
clipboard.paste = async function (): Promise<string> {
  if (BaseEnv.isBrowser) {
    return await navigator.clipboard.readText();
  }
  if (BaseEnv.isWx) {
    return new Promise((resolve, reject) => {
      wx.getClipboardData({
        success(res) {
          resolve(res.data);
        },
        fail(res) {
          reject();
        },
      });
    });
  }
  if (BaseEnv.isNode) {
    const child_process = require('node:child_process');
    const command = commandMap[BaseEnv.os].paste;
    return new Promise((resolve, reject) => {
      child_process.exec(command, (err, stdout) => {
        // 移除末尾的换行符
        stdout = stdout.replace(/\r?\n$/, '');
        !err ? resolve(stdout) : reject(err);
      });
    });
  }
  return '';
};
clipboard.pasteSync = function (): string {
  if (BaseEnv.isBrowser || BaseEnv.isWx) {
    throw new Error('clipboard 在当前环境无同步写法');
  }
  if (BaseEnv.isNode) {
    const { execSync } = require('node:child_process');

    const command = commandMap[BaseEnv.os].paste;
    let stdout = execSync(command, { encoding: 'utf8' });
    // 移除末尾的换行符
    stdout = stdout.replace(/\r?\n$/, '');

    return stdout;
  }
  return '';
};

// Clipboard API 同名定制
clipboard.writeText = clipboard.copy.bind(clipboard);
clipboard.writeTextSync = clipboard.copySync.bind(clipboard);
clipboard.readText = clipboard.paste.bind(clipboard);
clipboard.readTextSync = clipboard.pasteSync.bind(clipboard);
