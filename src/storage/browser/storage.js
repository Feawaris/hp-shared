export class _Storage {
  /**
   * init
   * @param options 选项
   *          storage 对应的storage对象。localStorage 或 sessionStorage
   *          json 是否进行json转换。
   * @returns {void|*}
   */
  constructor(options = {}) {
    const { from, json = true } = options;
    const optionsResult = {
      ...options,
      from,
      json,
    };
    Object.assign(this, {
      // 默认选项结果
      $defaults: optionsResult,
      // 对应的storage对象。
      storage: from,
      // 原有方法。由于 Object.create(from) 方式继承时调用会报 Uncaught TypeError: Illegal invocation，改成单独加入方式
      setItem: from.setItem.bind(from),
      getItem: from.getItem.bind(from),
      removeItem: from.removeItem.bind(from),
      key: from.key.bind(from),
      clear: from.clear.bind(from),
    });
  }
  // 声明各属性。直接或在constructor中重新赋值
  $defaults;
  storage;
  setItem;
  getItem;
  removeItem;
  key;
  clear;
  get length() {
    return this.storage.length;
  }
  // 判断属性是否存在。同时用于在 get 中对不存在的属性返回 undefined
  has(key) {
    return Object.keys(this.storage).includes(key);
  }
  // 写入
  set(key, value, options = {}) {
    const json = 'json' in options ? options.json : this.$defaults.json;
    if (json) {
      // 处理存 undefined 的情况，注意对象中的显式 undefined 的属性会被 json 序列化移除
      if (value === undefined) {
        return;
      }
      try {
        value = JSON.stringify(value);
      } catch (e) {
        console.warn(e);
      }
    }
    return this.storage.setItem(key, value);
  }
  // 读取
  get(key, options = {}) {
    const json = 'json' in options ? options.json : this.$defaults.json;
    // 处理无属性的的情况返回 undefined
    if (json && !this.has(key)) {
      return undefined;
    }
    // 其他值判断返回
    let result = this.storage.getItem(key);
    if (json) {
      try {
        result = JSON.parse(result);
      } catch (e) {
        console.warn(e);
      }
    }
    return result;
  }
  // 移除
  remove(key) {
    return localStorage.removeItem(key);
  }
  // 创建。通过配置默认参数创建新对象，简化传参
  create(options = {}) {
    const optionsResult = Object.assign({}, this.$defaults, options);
    return new _Storage(optionsResult);
  }
}
export const _localStorage = new _Storage({ from: localStorage });
export const _sessionStorage = new _Storage({ from: sessionStorage });
