// 环境判断
export const BaseEnv: {
  envs: string[],
  isBrowser: boolean,
  isWebWorker: boolean,
  isDedicatedWebWorker: boolean,
  isSharedWebWorker: boolean,
  isChromeExtension: boolean,
  isServiceWorker: boolean,
  isNode: boolean,
  isMobile: boolean,
  os: string,
  isWindows: boolean,
  isMac: boolean,
  isLinux: boolean,
  isWx: boolean,
  isAndroid: boolean,
  isIOS: boolean,
  isHarmony: boolean,
  browsers: string[],
  isChrome: boolean,
  isEdge: boolean,
  isFirefox: boolean,
  isSafari: boolean,
} = Object.create(null);
// 代码运行环境: browser, node, wx, ...
BaseEnv.envs = ((): string[] => {
  let result: string[] = [];
  if (typeof window !== 'undefined' && globalThis === window) {
    result.push('browser');
  }
  if (typeof DedicatedWorkerGlobalScope !== 'undefined' && globalThis instanceof DedicatedWorkerGlobalScope) {
    result.push('web-worker', 'delicated-web-worker');
  }
  if (typeof SharedWorkerGlobalScope !== 'undefined' && globalThis instanceof SharedWorkerGlobalScope) {
    result.push('web-worker', 'shared-web-worker');
  }
  if (typeof ServiceWorkerGlobalScope !== 'undefined' && globalThis instanceof ServiceWorkerGlobalScope) {
    result.push('service-worker');
  }
  if (typeof chrome !== 'undefined' && chrome.extension) {
    result.push('chrome-extension');
  }
  // harmony ets 环境也有 global，加 process 判断以区分 node
  if (typeof global !== 'undefined' && globalThis === global && typeof process !== 'undefined') {
    result.push('node');
  }
  if (typeof wx !== 'undefined') {
    result.push('wx');
  }
  return result;
})();
BaseEnv.isBrowser = BaseEnv.envs.includes('browser');
BaseEnv.isWebWorker = BaseEnv.envs.includes('web-worker');
BaseEnv.isDedicatedWebWorker = BaseEnv.envs.includes('dedicated-web-worker');
BaseEnv.isSharedWebWorker = BaseEnv.envs.includes('shared-web-worker');
BaseEnv.isChromeExtension = BaseEnv.envs.includes('chrome-extension');
BaseEnv.isServiceWorker = BaseEnv.envs.includes('service-worker');
BaseEnv.isNode = BaseEnv.envs.includes('node');
BaseEnv.isWx = BaseEnv.envs.includes('wx');
// 操作系统: windows, mac, linux, android, ios, ...
BaseEnv.os = ((): string => {
  if (BaseEnv.isBrowser || BaseEnv.isChromeExtension || BaseEnv.isWx) {
    // 小程序真机：通过 wx.getSystemInfoSync 得到，开发者工具可使用 navigator 方法，继续走下面浏览器逻辑
    if (BaseEnv.isWx && !globalThis.navigator) {
      // @ts-ignore
      return wx.getDeviceInfo().platform;
    }

    const { navigator } = globalThis;
    // 移动端
    if (BaseEnv.isMobile) {
      if (/android/i.test(navigator.userAgent)) {
        return 'android';
      }
      if (/iPad|iPhone|iPod/i.test(navigator.userAgent)) {
        return 'ios';
      }
    }

    const os = navigator.platform.toLowerCase();
    if (os.startsWith('win')) {
      return 'windows';
    }
    if (os.startsWith('mac')) {
      return 'mac';
    }
    if (os.startsWith('linux')) {
      return 'linux';
    }
  }
  if (BaseEnv.isNode) {
    const os = process.platform.toLowerCase();
    if (os.startsWith('win')) {
      return 'windows';
    }
    if (os.startsWith('darwin')) {
      return 'mac';
    }
    if (os.startsWith('linux')) {
      return 'linux';
    }
  }
  if (globalThis.Row && globalThis.Column) {
    return 'harmony';
  }
  return '';
})();
BaseEnv.isWindows = BaseEnv.os === 'windows';
BaseEnv.isMac = BaseEnv.os === 'mac';
BaseEnv.isLinux = BaseEnv.os === 'linux';
BaseEnv.isAndroid = BaseEnv.os === 'android';
BaseEnv.isIOS = BaseEnv.os === 'ios';
BaseEnv.isHarmony = BaseEnv.os === 'harmony';
// 设备
BaseEnv.isMobile = ((): boolean => {
  if (BaseEnv.isBrowser || BaseEnv.isChromeExtension) {
    try {
      // @ts-ignore
      return navigator.userAgentData.mobile;
    } catch (e) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
  if (BaseEnv.isWx) {
    // @ts-ignore
    return wx.getDeviceInfo().platform !== 'devtools';
  }
  if (BaseEnv.isHarmony) {
    return true;
  }
  return false;
})();
// 浏览器
BaseEnv.browsers = ((): string[] => {
  let result: string[] = [];
  const ua = globalThis.navigator?.userAgent;
  if (ua) {
    if (ua.includes('Chrome')) {
      result.push('chrome');
      if (ua.includes('Edg')) {
        result.push('edge');
      }
    } else if (ua.includes('Firefox')) {
      result.push('firefox');
    } else if (ua.includes('Safari')) {
      result.push('safari');
    }
  }
  return result;
})();
BaseEnv.isEdge = BaseEnv.browsers.includes('edge');
BaseEnv.isChrome = BaseEnv.browsers.includes('chrome');
BaseEnv.isFirefox = BaseEnv.browsers.includes('firefox');
BaseEnv.isSafari = BaseEnv.browsers.includes('safari');

// 参考 py 添加 pass 写法以显式在以后可能会添加代码的地方占位替代注释占位
export function pass(): void {}

// 退出和重启
export function exit(): void {
  if (BaseEnv.isBrowser) {
    window.close();
    return;
  }
  if (BaseEnv.isWx) {
    wx.exitMiniProgram();
    return;
  }
  if (BaseEnv.isNode) {
    process.exit();
    return;
  }
}
export const quit = exit;
export function restart() {
  if (BaseEnv.isBrowser) {
    location.href = location.href;
    return;
  }
  if (BaseEnv.isWx) {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    const route = page.route.startsWith('/') ? page.route : `/${page.route}`; // 处理成绝对路径防止嵌套拼接
    const search = (() => {
      const str = Object.entries(page.options).map(([key, value]) => `${key}=${value}`).join('&');
      return str ? `?${str}` : str;
    })();
    wx.reLaunch({
      url: `${route}${search}`,
    });
    return;
  }
  if (BaseEnv.isNode) {
    const child_process = require('node:child_process');
    child_process.spawn(process.argv[0], process.argv.slice(1), {
      stdio: 'inherit',
    });
    return;
  }
}
