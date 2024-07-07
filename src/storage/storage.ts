import { BaseEnv } from '../base';

export class BaseStorage {
  // 存储仓库
  value: object;
  get keys(): string[] {
    if (BaseEnv.isWx) {
      return wx.getStorageInfoSync().keys;
    }
    if (BaseEnv.isBrowser || BaseEnv.isNode) {
      return Object.keys(this.value);
    }
    return [];
  }
  get length(): number {
    return this.keys.length;
  }
  constructor(webStorage: string) {
    this.value = BaseEnv.isBrowser ? window[webStorage] : {};
  }
  // 取值
  getItem(key: string, { default: defaultValue = null, json = true } = {}): any {
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
      return wx.getStorageSync(key);
    }
    if (BaseEnv.isNode) {
      return this.value[key];
    }
  }
  // 存值
  setItem(key: string, value: any, { json = true } = {}): void {
    if (BaseEnv.isBrowser) {
      // undefined 转为 null 存储
      if (value === undefined) {
        value = null;
      }
      value = json ? JSON.stringify(value) : value;
      this.value.setItem(key, value);
      return;
    }
    if (BaseEnv.isWx) {
      // undefined 转为 null 存储
      if (value === undefined) {
        value = null;
      }
      wx.setStorageSync(key, value);
      return;
    }
    if (BaseEnv.isNode) {
      this.value[key] = value;
    }
  }
  // 移除
  removeItem(key: string): void {
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
  // 清空
  clear(): void {
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

  // 转换系列方法：转换成原始值或其他类型
  [Symbol.toPrimitive](hint: string): number | string {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  toNumber(): number {
    return this.length;
  }
  toString(): string {
    return JSON.stringify(this.toObject());
  }
  toBoolean(): boolean {
    return this.length > 0;
  }
  toObject({ default: defaultValues = {}, ...restOptions } = {}): object {
    if (BaseEnv.isBrowser || BaseEnv.isWx) {
      const entries = this.keys.map((key) => {
        return [
          key,
          this.getItem(key, { default: defaultValues[key], ...restOptions }),
        ];
      });
      return Object.fromEntries(entries);
    }
    if (BaseEnv.isNode) {
      return JSON.parse(JSON.stringify(this.value));
    }
  }
  toJSON(): object {
    return this.toObject();
  }
}
export const _localStorage = new BaseStorage('localStorage');
export const _sessionStorage = new BaseStorage('sessionStorage');
