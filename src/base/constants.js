// 常量。常用于默认传参等场景
// js运行环境
export const JS_ENV = (function getJsEnv() {
  if (typeof window !== 'undefined' && globalThis === window) {
    return 'browser';
  }
  if (typeof global !== 'undefined' && globalThis === global) {
    return 'node';
  }
  return '';
})();
// 空函数
export function NOOP() {}
// 返回 false
export function FALSE() {
  return false;
}
// 返回 true
export function TRUE() {
  return true;
}
// 原样返回
export function RAW(value) {
  return value;
}
