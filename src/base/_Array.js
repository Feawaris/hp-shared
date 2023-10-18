// 数组
import { _Set } from './_Set';

export class _Array extends Array {
  /**
   * static
   */
  // static isArray 无需定制
  // static from 无需定制
  // static of 无需定制

  /**
   * constructor
   */
  constructor(value = []) {
    try {
      value = Array.from(value);
    } catch (e) {
      console.warn('传参报错，将生成空数组', e);
      value = [];
    }
    if (value.length === 1 && typeof value[0] === 'number') {
      // 稀疏数组问题，先调 super 生成 this 后再修改 this 内容
      const temp = value[0];
      value[0] = undefined;
      super(...value);
      this[0] = temp;
    } else {
      super(...value);
    }

    // length 无需定制
  }

  // 方法定制：原型同名方法+新增方法。大部分返回 this 便于链式操作
  /**
   * 修改
   */
  // sort 无需定制
  // (新增方法) 随机排序数组
  randomSort() {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }

    return this;
  }
  // reverse 无需定制
  // fill 无需定制
  // copyWithin 无需定制
  // (定制方法)
  push() {
    Array.prototype.push.apply(this, arguments);
    return this;
  }
  // (定制方法)
  pop(length = 1) {
    for (let i = 0; i < length; i++) {
      Array.prototype.pop.apply(this, arguments);
    }
    return this;
  }
  // (定制方法)
  unshift() {
    Array.prototype.unshift.apply(this, arguments);
    return this;
  }
  // (定制方法)
  shift(length = 1) {
    for (let i = 0; i < length; i++) {
      Array.prototype.shift.apply(this, arguments);
    }
    return this;
  }
  // (定制方法)
  splice(start, deleteCount, ...items) {
    Array.prototype.splice.apply(this, arguments);
    return this;
  }
  // (新增方法) 删除
  delete(value) {
    const index = this.findIndex(val => val === value);
    return this.splice(index, 1);
  }
  // (新增方法) 清空
  clear() {
    return this.splice(0);
  }
  // (新增方法) 去重
  unique(options = {}) {
    const value = this.to_Set().to_Array();
    return this.clear().push(...value);
  }

  /**
   * 遍历
   */
  // Symbol.iterator 无需定制
  // keys 无需定制
  // values 无需定制
  // entries 无需定制
  // (定制方法)
  forEach() {
    Array.prototype.forEach.apply(this, arguments);
    return this;
  }

  /**
   * 查找
   */
  // at 无需定制
  // find 无需定制
  // findIndex 无需定制
  // findLast 无需定制
  // findLastIndex 无需定制
  // includes 无需定制
  // indexOf 无需定制
  // lastIndexOf 无需定制
  // some 无需定制
  // every 无需定制

  /**
   * 生成
   */
  // map 无需定制
  // filter 无需定制
  // reduce 无需定制
  // reduceRight 无需定制
  // concat 无需定制
  // slice 无需定制
  // join 无需定制
  // flat 无需定制
  // flatMap 无需定制

  // (定制方法)
  with() {
    const value = Array.prototype.with.apply(this, arguments);
    return new this.constructor(value);
  }
  // (定制方法)
  toSpliced() {
    const value = Array.prototype.toSpliced.apply(this, arguments);
    return new this.constructor(value);
  }
  // (定制方法)
  toSorted() {
    const value = Array.prototype.toSorted.apply(this, arguments);
    return new this.constructor(value);
  }
  // (定制方法)
  toReversed() {
    const value = Array.prototype.toReversed.apply(this, arguments);
    return new this.constructor(value);
  }
  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // (定制方法)
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  // (新增方法)
  toNumber() {
    return NaN;
  }
  // (定制方法)
  toString() {
    try {
      return JSON.stringify(this);
    } catch (e) {
      console.warn(`toString 转换报错，将生成 '[]'`, e);
      return JSON.stringify([]);
    }
  }
  // toLocaleString 无需定制
  // (新增方法)
  toBoolean() {
    return this.length > 0;
  }
  // (定制方法)
  toJSON() {
    return Array.from(this);
  }
  // (新增方法)
  toArray() {
    return Array.from(this);
  }
  // (新增方法)
  toSet() {
    return new Set(this);
  }
  // (新增方法)
  to_Set() {
    return new _Set(this);
  }
}
