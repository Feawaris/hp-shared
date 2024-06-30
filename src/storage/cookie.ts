import { BaseEnv, _Object, _Date } from '../base';

export class BaseCookie {
  value: string;
  constructor(req, res) {
    _Object.assign(this, {
      get value() {
        if (BaseEnv.isBrowser) {
          return document.cookie;
        }
        if (BaseEnv.isWx) {
          return '';
        }
        if (BaseEnv.isNode) {
          return req.headers.cookie;
        }
        return '';
      },
      set value(text) {
        if (BaseEnv.isBrowser) {
          document.cookie = text;
          return;
        }
        if (BaseEnv.isWx) {
          return;
        }
        if (BaseEnv.isNode) {
          const arr = res.getHeader('Set-Cookie') || [];
          res.setHeader('Set-Cookie', [...arr, text]);
          return;
        }
      },

      get length() {
        return this.toArray().length;
      },
    });
  }

  toArray() {
    const arr = this.value.split(/\s*;\s*/).filter((str) => str !== '');
    return arr.map((str) => {
      const [key, value] = str.includes('=') ? str.split('=') : ['', str];
      return [key, value];
    });
  }
  toObject({ default: defaultValues = {}, ...restOptions } = {}) {
    let set = new Set();
    let result = {};
    for (const [key] of this.toArray()) {
      if (set.has(key)) {
        continue;
      }
      result[key] = this.get(key, {
        default: defaultValues[key],
        ...restOptions,
      });
      set.add(key);
    }
    return result;
  }
  has(key) {
    const keys = this.toArray().map(([name]) => name);
    return keys.includes(key);
  }
  get(key, { default: defaultValue = '' } = {}) {
    const findItem = this.toArray().find((entry) => entry[0] === key);
    return findItem[1] ?? defaultValue;
  }
  set(key, value, options = {}) {
    options = _Object.assign(
      {
        path: '/',
        // 受影响属性处理
        ...('expires' in options ? {} : { maxAge: 86400 * 3 }),
        ...(BaseEnv.isNode ? { httponly: true, secure: true } : {}),
      },
      options,
    );
    const optionsArr = Object.entries(options)
      .map(([name, val]) => {
        // 特殊选项处理
        if (name === 'expires') {
          return `${name}=${new _Date(val).toUTCString()}`;
        } else if (name === 'maxAge') {
          return `max-age=${val}`;
        }
        // boolean 类型的选项处理
        if (typeof val === 'boolean') {
          return val ? `${name}` : '';
        }
        // 其他选项
        return `${name}=${val}`;
      })
      .filter((str) => str !== '');
    const text = [`${key}=${value}`, ...optionsArr].join(';');
    this.value = text;
    return text;
  }
  remove(key, options = {}) {
    options = _Object.assign({ path: '/' }, options, { maxAge: 0 });
    return this.set(key, '', options);
  }
  clear({ paths = ['/', ''] } = {}) {
    return paths
      .map((path) => {
        return this.toArray().map(([key]) => {
          return this.remove(key, { path });
        });
      })
      .flat();
  }
}
// @ts-ignore
export const cookie = new BaseCookie();
