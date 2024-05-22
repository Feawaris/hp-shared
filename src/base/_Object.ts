// @ts-nocheck
import { _Array } from './_Array';

export class _Object {
  // 是否纯对象
  static isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  /**
   * 获取属性名。默认参数配置成同 Object.keys 行为
   * @param target 目标对象
   * @param includeSymbol 是否包含 symbol 属性
   * @param includeNotEnumerable 是否包含不可枚举属性
   * @param includeExtend 是否包含承继属性
   * @param includeExtendFromObjectPrototype 继承场景下是否包含继承自 Object.prototype 的属性，默认 false 以便普通方式 {} 和 Object.create(null) 方式统一关注点
   * @returns {any[]}
   */
  static keys(target, { includeSymbol = false, includeNotEnumerable = false, includeExtend = false, includeExtendFromObjectPrototype = false } = {}) {
    // 选项收集
    const options = {
      includeSymbol,
      includeNotEnumerable,
      includeExtend,
      includeExtendFromObjectPrototype,
    };
    // set用于key去重
    let set = new Set();
    // 自身属性筛选
    const ownKeys = Reflect.ownKeys(target);
    for (const key of ownKeys) {
      const desc = Object.getOwnPropertyDescriptor(target, key);
      // 忽略 symbol 属性的情况
      if (typeof key === 'symbol' && !includeSymbol) {
        continue;
      }
      // 忽略不可列举属性的情况
      if (!desc.enumerable && !includeNotEnumerable) {
        continue;
      }
      // 加入
      set.add(key);
    }
    // 继承属性
    if (includeExtend) {
      const __proto__ = Object.getPrototypeOf(target);
      if (__proto__ !== null) {
        if (__proto__ !== Object.prototype || (__proto__ === Object.prototype && includeExtendFromObjectPrototype)) {
          const parentKeys = this.keys(__proto__, options);
          for (const parentKey of parentKeys) {
            set.add(parentKey);
          }
        }
      }
    }
    // 返回
    return Array.from(set);
  }
  // 对应 keys 配套 values 和 entries
  static values(target, options = {}) {
    const keys = this.keys(target, options);
    return keys.map((key) => target[key]);
  }
  static entries(target, options = {}) {
    const keys = this.keys(target, options);
    return keys.map((key) => [key, target[key]]);
  }

  // 属性定义所在的最近对象(来自自身或继承)，便于后续方法获取 descriptor 等操作
  static getOwner(target, key) {
    if (Object.hasOwn(target, key)) {
      return target;
    }
    let __proto__ = Object.getPrototypeOf(target);
    if (__proto__ === null) {
      return null;
    }
    return this.getOwner(__proto__, key);
  }
  // 获取属性描述对象，相比 Object.getOwnPropertyDescriptor 能拿到继承属性的描述对象
  static getPropertyDescriptor(target, key) {
    const owner = this.getOwner(target, key);
    if (owner) {
      return Object.getOwnPropertyDescriptor(owner, key);
    }
    return undefined;
  }
  static getPropertyDescriptors(target, options = {}) {
    options = Object.assign({ includeSymbol: true, includeNotEnumerable: true, includeExtend: true }, options);
    const keys = this.keys(target, options);
    const entries = keys.map((key) => [key, this.getPropertyDescriptor(target, key)]);
    return Object.fromEntries(entries);
  }

  /**
   * 浅合并对象。写法同 Object.assign，通过重定义方式合并以对 get/set 惰性求值的属性的处理
   * @param target 目标对象
   * @param sources 数据源
   * @returns {{}}
   */
  static assign(target, ...sources) {
    for (const source of sources) {
      const keys = this.keys(source, {
        includeSymbol: true,
        includeNotEnumerable: true,
      });
      for (const key of keys) {
        const desc = Object.getOwnPropertyDescriptor(source, key);
        Object.defineProperty(target, key, desc);
      }
    }
    return target;
  }
  /**
   * 深合并对象。写法同 assign 方法
   * @param target 目标对象
   * @param sources 数据源
   * @returns {{}}
   */
  static deepAssign(target, ...sources) {
    // console.log('deepAssign', { target, sources });
    for (const source of sources) {
      const keys = this.keys(source, {
        includeSymbol: true,
        includeNotEnumerable: true,
      });
      for (const key of keys) {
        const desc = Object.getOwnPropertyDescriptor(source, key);
        if ('value' in desc) {
          // value 写法：对象递归处理，其他直接定义
          if (Object.prototype.toString.apply(desc.value) === '[object Object]') {
            // console.log('if', target, key, desc);
            Object.defineProperty(target, key, {
              ...desc,
              value: this.deepAssign(target[key] || {}, desc.value),
            });
          } else {
            // console.warn('else', target, key, desc);
            Object.defineProperty(target, key, desc);
          }
        } else {
          // get/set 写法：直接定义
          Object.defineProperty(target, key, desc);
        }
      }
    }
    return target;
  }

  /**
   * 过滤对象
   * @param target 目标对象
   * @param pick 挑选属性
   * @param omit 忽略属性
   * @param emptyPick pick 为空时的取值。all: 全部 key, empty: 空
   * @param separator 同 namesToArray 的 separator 参数
   * @param includeSymbol 同 keys 的 symbol 参数
   * @param includeNotEnumerable 同 keys 的同名参数
   * @param includeExtend 同 keys 的同名参数
   * @param includeExtendFromObjectPrototype 同 keys 的同名参数
   * @returns {{}}
   */
  static filter(target, { pick = [], omit = [], emptyPick = 'all', separator = ',', includeSymbol = true, includeNotEnumerable = true, includeExtend = false, includeExtendFromObjectPrototype = false } = {}) {
    // pick、omit 统一成数组格式
    pick = _Array.namesToArray(pick, { separator });
    omit = _Array.namesToArray(omit, { separator });

    let keys = [];
    // pick 和 emptyPick 筛选：pick 有值直接拿，为空时根据 emptyPick 默认拿空或全部 key
    keys =
      pick.length > 0 || emptyPick === 'empty'
        ? pick
        : this.keys(target, {
          includeSymbol,
          includeNotEnumerable,
          includeExtend,
          includeExtendFromObjectPrototype,
        });
    // omit 筛选
    keys = keys.filter((key) => !omit.includes(key));

    let result = {};
    for (const key of keys) {
      const desc = this.getPropertyDescriptor(target, key);
      // 属性不存在导致desc得到undefined时不设置值
      if (desc) {
        Object.defineProperty(result, key, desc);
      }
    }
    return result;
  }
  // 对象的函数属性绑定 this，方便 vue 中如 @click="formInfo.click" 简便写法
  static bindThis(target) {
    for (const [key, value] of Object.entries(target)) {
      if (typeof value === 'function') {
        target[key] = value.bind(target);
      }
    }
    return target;
  }

  constructor(obj = {}) {
    _Object.assign(this, obj);

    Object.defineProperty(this, 'length', {
      get() {
        return Object.keys(this).length;
      },
    });
  }
  * keys() {
    for (const key of Object.keys(this)) {
      yield key;
    }
  }
  * values() {
    for (const value of Object.values(this)) {
      yield value;
    }
  }
  * entries() {
    for (const entries of Object.entries(this)) {
      yield entries;
    }
  }
  * [Symbol.iterator]() {
    yield* this.entries();
  }

  // 转换系列方法：转换成原始值或其他类型
  [Symbol.toPrimitive](hint: string) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
    return null;
  }
  toNumber() {
    return this.length;
  }
  toString() {
    try {
      return JSON.stringify(this);
    } catch (e) {
      console.warn(`toString 转换报错，将生成 {}`, e);
      return JSON.stringify([]);
    }
  }
  toBoolean() {
    return this.length > 0;
  }
  toJSON() {
    return this;
  }
  toArray() {
    return Array.from(this);
  }
  toSet() {
    return new Set(this.values());
  }
}
