import { BaseEnv } from '../../base';

export class WebStorage {
  private value: any;
  constructor(webStorage: string = '') {
    this.value = BaseEnv.isBrowser ? window[webStorage] : {};
  }
  getItem(key: string, { default: defaultValue = null, json = true } = {}) {
    if (BaseEnv.isBrowser) {
      const text = this.value.getItem(key);
      return json
        ? (() => {
          try {
            return JSON.parse(text);
          } catch (e) {
            return defaultValue;
          }
        })()
        : text;
    }
    if (BaseEnv.isWx) {
      const text = wx.getStorageSync(key);
      return json
        ? (() => {
          try {
            return JSON.parse(text);
          } catch (e) {
            return defaultValue;
          }
        })()
        : text;
    }
    if (BaseEnv.isNode) {
      return this.value[key];
    }
  }
  setItem(key: string, value, { json = true } = {}) {
    if (BaseEnv.isBrowser) {
      // undefined 转为 null 存储
      if (value === undefined) {
        value = null;
      }
      value = json ? JSON.stringify(value) : value;
      return this.value.setItem(key, value);
    }
    if (BaseEnv.isWx) {
      // undefined 转为 null 存储
      if (value === undefined) {
        value = null;
      }
      value = json ? JSON.stringify(value) : value;
      return wx.setStorageSync(key, value);
    }
    if (BaseEnv.isNode) {
      this.value[key] = value;
    }
  }
  removeItem(key: string) {
    if (BaseEnv.isBrowser) {
      return this.value.removeItem(key);
    }
    if (BaseEnv.isWx) {
      return wx.removeStorageSync(key);
    }
    if (BaseEnv.isNode) {
      delete this.value[key];
      return;
    }
  }
  clear() {
    if (BaseEnv.isBrowser) {
      return this.value.clear();
    }
    if (BaseEnv.isWx) {
      return wx.clearStorageSync();
    }
    if (BaseEnv.isNode) {
      for (const key of Object.keys(this.value)) {
        delete this.value[key];
      }
      return;
    }
  }
  toObject({ default: defaultValues = {}, ...restOptions } = {}) {
    if (BaseEnv.isBrowser) {
      return Object.fromEntries(
        Object.keys(this.value).map((key) => {
          return [
            key,
            this.getItem(key, {
              default: defaultValues[key],
              ...restOptions,
            }),
          ];
        }),
      );
    }
    if (BaseEnv.isWx) {
      return {};
    }
    if (BaseEnv.isNode) {
      return JSON.parse(JSON.stringify(this.value));
    }
  }
}
export const _localStorage = new WebStorage('localStorage');
export const _sessionStorage = new WebStorage('sessionStorage');
