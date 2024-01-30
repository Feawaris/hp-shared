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
// 代码运行环境: browser,node,...
BaseEnv.env = (() => {
  if (typeof window !== 'undefined' && globalThis === window) {
    return 'browser';
  }
  if (typeof global !== 'undefined' && globalThis === global) {
    return 'node';
  }
  return '';
})();
BaseEnv.isBrowser = BaseEnv.env === 'browser';
BaseEnv.isNode = BaseEnv.env === 'node';
// 操作系统: windows,mac,...
BaseEnv.os = (() => {
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
BaseEnv.isWindows = BaseEnv.os === 'windows';
BaseEnv.isMac = BaseEnv.os === 'mac';
BaseEnv.isLinux = BaseEnv.os === 'linux';
