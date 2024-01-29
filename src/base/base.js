/**
 * 优化 typeof
 * @param value
 * @returns {"undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"|string}
 */
export function _typeof(value) {
  if (value === null) {
    return 'null';
  }
  return typeof value;
}

/**
 * 运行环境
 */
export const BaseEnv = Object.create(null);
// 代码运行平台: browser,node,...
BaseEnv.codePlatform = (() => {
  if (typeof window !== 'undefined' && globalThis === window) {
    return 'browser';
  }
  if (typeof global !== 'undefined' && globalThis === global) {
    return 'node';
  }
  return '';
})();
BaseEnv.isBrowser = BaseEnv.codePlatform === 'browser';
BaseEnv.isNode = BaseEnv.codePlatform === 'node';
// 操作系统平台: windows,mac,...
BaseEnv.osPlatform = (() => {
  if (BaseEnv.isBrowser) {
    const text = navigator.userAgentData
      ? navigator.userAgentData.platform.toLowerCase()
      : navigator.platform.toLowerCase();
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
BaseEnv.isWindows = BaseEnv.osPlatform === 'windows';
BaseEnv.isMac = BaseEnv.osPlatform === 'mac';
BaseEnv.isLinux = BaseEnv.osPlatform === 'linux';
