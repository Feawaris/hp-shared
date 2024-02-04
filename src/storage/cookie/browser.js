// cookie操作
import { _Object, _Date, _Function, _typeof } from '../../base';

export const cookie = Object.create(null);
// 选项，初始保存和 create 方法用
cookie.$options = {
  // 编码解码方法
  encode: encodeURIComponent,
  decode: decodeURIComponent,
  // set 和 get 共用选项
  json: true,
  // 对应方法用的选项
  setValueOptions: {
    path: '/',
    'max-age': 86400 * 3,
  },
};
cookie.create = function(options = {}) {
  let result = Object.create(this);
  result.$options = _Object.deepAssign({}, this.$options, options);
  return result;
};

cookie.getEntries = function({ raw = false } = {}) {
  const decodeFn = raw ? _Function.RAW : this.$options.decode;
  const arr = document.cookie.split(/\s*;\s*/).filter(str => str !== '');
  return arr.map((str) => {
    const [key, value] = str.split('=');
    return [decodeFn(key), decodeFn(value)];
  });
};
cookie.set = function(key, value, valueOptions = {}, { json = this.$options.json } = {}) {
  valueOptions = _Object.assign({}, this.$options.setValueOptions, valueOptions);
  let result = [];

  value = json ? JSON.stringify(value) : value;
  result.push(`${this.$options.encode(key)}=${this.$options.encode(value)}`);

  for (const [name, val] of Object.entries(valueOptions)) {
    // 特殊选项处理
    if (name === 'expires') {
      result.push(`${name}=${new _Date(val).toUTCString()}`);
      continue;
    }
    // boolean 类型的选项处理
    if (_typeof(val) === 'boolean') {
      if (val) {
        result.push(`${name}`);
      }
      continue;
    }
    // 其他选项
    result.push(`${name}=${val}`);
  }
  if (valueOptions.expires) {
    valueOptions.expires = new _Date(valueOptions.expires).toUTCString();
  }
  return (document.cookie = result.join(';'));
};
cookie.get = function(key, { raw = false, default: defaultValue = null, json = this.$options.json } = {}) {
  const findItem = this.getEntries({ raw }).find(entry => entry[0] === key);
  const text = findItem?.[1];
  if (raw) {
    return text ?? defaultValue;
  }
  return json ? (() => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return defaultValue;
    }
  })() : text ?? defaultValue;
};
cookie.remove = function(key, options = {}) {
  options = _Object.assign({ path: '/' }, options, { 'max-age': 0 });
  return this.set(key, '', options);
};
cookie.clear = function({ paths = ['/', ''] } = {}) {
  return paths.map((path) => {
    return this.getEntries().map(([key]) => {
      return this.remove(key, { path });
    });
  }).flat();
};
