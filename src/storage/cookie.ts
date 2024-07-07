import { _Date, _Object, BaseEnv } from '../base';

export class BaseCookie {
  req: any;
  res: any;
  get value(): string {
    if (BaseEnv.isBrowser) {
      return document.cookie;
    }
    if (BaseEnv.isWx) {
      return '';
    }
    if (BaseEnv.isNode) {
      return this.req.headers.cookie;
    }
    return '';
  }
  set value(text: string) {
    if (BaseEnv.isBrowser) {
      document.cookie = text;
      return;
    }
    if (BaseEnv.isWx) {
      return;
    }
    if (BaseEnv.isNode) {
      const arr = this.res.getHeader('Set-Cookie') || [];
      this.res.setHeader('Set-Cookie', [...arr, text]);
      return;
    }
  }
  get length(): number {
    return this.toArray().length;
  }
  constructor(req?: any, res?: any) {
    this.req = req;
    this.res = res;
  }
  get(key: string, { default: defaultValue = '' } = {}): string {
    const item = this.toArray().find((entry) => entry[0] === key);
    return item[1] ?? defaultValue;
  }
  set(key: string, value: any, options = {}): void {
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
    this.value = [`${key}=${value}`, ...optionsArr].join(';');
  }
  remove(key, options = {}): void {
    options = _Object.assign({ path: '/' }, options, { maxAge: 0 });
    this.set(key, '', options);
  }
  clear({ paths = ['/', ''] } = {}): void {
    for (const path of paths) {
      this.toArray().map(([key]) => this.remove(key, { path }));
    }
  }
  has(key): boolean {
    const keys = this.toArray().map(([name]) => name);
    return keys.includes(key);
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
  toArray(): string[][] {
    const arr = this.value.split(/\s*;\s*/).filter((str) => str !== '');
    return arr.map((str) => {
      const [key, value] = str.includes('=') ? str.split('=') : ['', str];
      return [key, value];
    });
  }
  toJSON(): object {
    return this.toObject();
  }
}
export const cookie = new BaseCookie();
