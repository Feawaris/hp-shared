// @ts-nocheck
export const BaseEnv: {
  envs: string[],
  isBrowser: boolean,
  isWebWorker: boolean,
  isChromeExtension: boolean,
  isServiceWorker: boolean,
  isNode: boolean,
  os: string,
  isWindows: boolean,
  isMac: boolean,
  isLinux: boolean,
  isWx: boolean,
  isAndroid: boolean,
  isIOS: boolean,
} = Object.create(null);
// 代码运行环境: browser, node, wx, ...
BaseEnv.envs = ((): string[] => {
  let result: string[] = [];
  if (typeof window !== 'undefined' && globalThis === window) {
    result.push('browser');
  }
  if (typeof Worker !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && globalThis instanceof WorkerGlobalScope) {
    result.push('web-worker');
  }
  if (typeof chrome !== 'undefined' && chrome.extension) {
    result.push('chrome-extension');
  }
  if (typeof ServiceWorkerGlobalScope !== 'undefined' && globalThis instanceof ServiceWorkerGlobalScope) {
    result.push('service-worker');
  }
  if (typeof global !== 'undefined' && globalThis === global) {
    result.push('node');
  }
  if (typeof wx !== 'undefined') {
    result.push('wx');
  }
  return result;
})();
BaseEnv.isBrowser = BaseEnv.envs.includes('browser');
BaseEnv.isWebWorker = BaseEnv.envs.includes('web-worker');
BaseEnv.isChromeExtension = BaseEnv.envs.includes('chrome-extension');
BaseEnv.isServiceWorker = BaseEnv.envs.includes('service-worker');
BaseEnv.isNode = BaseEnv.envs.includes('node');
BaseEnv.isWx = BaseEnv.envs.includes('wx');
// 操作系统: windows, mac, linux, android, ios, ...
BaseEnv.os = ((): string => {
  if (BaseEnv.isBrowser || BaseEnv.isChromeExtension || BaseEnv.isWx) {
    // 小程序真机环境通过 wx.getSystemInfoSync 得到，开发者工具可使用 navigator 方法，继续走下面浏览器逻辑
    if (BaseEnv.isWx && !globalThis.navigator) {
      const si = wx.getSystemInfoSync();
      return si.platform;
    }
    const { navigator } = globalThis;
    const text = (() => {
      try {
        return navigator.userAgentData.platform.toLowerCase() || '';
      } catch (e) {
        return navigator.platform.toLowerCase();
      }
    })();
    if (text.startsWith('win')) {
      return 'windows';
    }
    if (text.startsWith('mac')) {
      return 'mac';
    }
    if (text.startsWith('linux')) {
      return 'linux';
    }
  }
  if (BaseEnv.isNode) {
    const text = process.platform.toLowerCase();
    if (text.startsWith('win')) {
      return 'windows';
    }
    if (text.startsWith('darwin')) {
      return 'mac';
    }
    if (text.startsWith('linux')) {
      return 'linux';
    }
  }
  return '';
})();
BaseEnv.isWindows = BaseEnv.os === 'windows';
BaseEnv.isMac = BaseEnv.os === 'mac';
BaseEnv.isLinux = BaseEnv.os === 'linux';
BaseEnv.isAndroid = BaseEnv.os === 'android';
BaseEnv.isIOS = BaseEnv.os === 'ios';
