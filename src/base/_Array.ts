// @ts-nocheck
import { _Set } from './_Set';

export class _Array extends Array {
  /**
   * 属性名统一成数组格式
   * @param names 属性名。格式 'a,b,c' 或 ['a','b','c']
   * @param separator names 为字符串时的拆分规则。同 split 方法的 separator，字符串无需拆分的可以传 null
   * @returns {FlatArray<(FlatArray<*[], 1>[]|*|[*[]]|[])[], 1>[]|*[][]|*[]}
   */
  static namesToArray(names = [], { separator = ',' } = {}) {
    if (Array.isArray(names)) {
      return names.map((val) => _Array.namesToArray(val)).flat();
    }
    if (typeof names === 'string') {
      return names
        .split(separator)
        .map((val) => val.trim())
        .filter((val) => val);
    }
    if (typeof names === 'symbol') {
      return [names];
    }
    return [];
  }

  constructor(value = []) {
    try {
      value = Array.from(value);
    } catch (e) {
      console.warn('传参报错，将生成 []', e);
      value = [];
    }
    if (value.length === 1 && typeof value[0] === 'number') {
      // 避免稀疏数组问题：先调 super 生成 this 后再修改 this 内容
      const temp = value[0];
      value[0] = null;
      super(...value);
      this[0] = temp;
    } else {
      super(...value);
    }
  }

  // 方法定制：同名方法+新增，部分定制成返回 this 便于链式操作
  // 改动系列方法
  push() {
    Array.prototype.push.apply(this, arguments);
    return this;
  }
  pop(index = -1) {
    return this.splice(index, 1);
  }
  remove(value: any) {
    const index = this.findIndex((val) => Object.is(val, value));
    return this.splice(index, 1);
  }
  unshift() {
    Array.prototype.unshift.apply(this, arguments);
    return this;
  }
  shift(index = 0) {
    return this.splice(index, 1);
  }
  clear() {
    this.splice(0);
  }

  // 生成系列方法
  with() {
    const value = Array.prototype.with.apply(this, arguments);
    return new this.constructor(value);
  }
  toSpliced() {
    const value = Array.prototype.toSpliced.apply(this, arguments);
    return new this.constructor(value);
  }
  toSorted() {
    const value = Array.prototype.toSorted.apply(this, arguments);
    return new this.constructor(value);
  }
  toReversed() {
    const value = Array.prototype.toReversed.apply(this, arguments);
    return new this.constructor(value);
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
      console.warn(`toString 转换报错，将生成 []`, e);
      return JSON.stringify([]);
    }
  }
  toBoolean() {
    return this.length > 0;
  }
  toJSON() {
    return this.toArray();
  }
  toArray() {
    return Array.from(this);
  }
  to_Array() {
    return _Array.from(this);
  }
  toSet() {
    return new Set(this);
  }
  to_Set() {
    return new _Set(this);
  }
}
