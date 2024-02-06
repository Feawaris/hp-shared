// 集合
import { _Array } from './_Array';

export class _Set extends Set {
  constructor(value = []) {
    try {
      value = new Set(value);
    } catch (e) {
      console.warn('传参报错，将生成空集合', e);
      value = new Set([]);
    }
    super(value);
  }

  // 方法定制：同名方法+新增，部分定制成返回 this 便于链式操作
  add(...values) {
    for (const value of values) {
      Set.prototype.add.apply(this, arguments);
    }
    return this;
  }
  delete(...values) {
    for (const value of values) {
      Set.prototype.delete.apply(this, arguments);
    }
    return new this.constructor(values);
  }

  // 转换系列方法：转换成原始值或其他类型
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  toNumber() {
    return NaN;
  }
  toString() {
    try {
      return `{${this.toArray().join(',')}}`;
    } catch (e) {
      return '{}';
    }
  }
  toBoolean(options = {}) {
    return this.size > 0;
  }
  toJSON() {
    return Array.from(this);
  }
  toArray() {
    return Array.from(this);
  }
  toCustomArray() {
    return new _Array(this);
  }
  toSet() {
    return new Set(this);
  }
  toCustomSet() {
    return new _Set(this);
  }
}

/**
 * 交集
 * @param sets
 * @returns {*}
 */
_Set.cap = function(...sets) {
  // 传参数量
  if (sets.length < 2) {
    sets[0] = sets[0] || [];
    sets[1] = sets[1] || [];
  }
  // 统一类型处理
  sets = new _Array(sets).map(set => new _Array(set));

  const [first, ...others] = sets;
  return first.filter((value) => {
    return others.every(set => set.includes(value));
  }).toCustomSet();
};
/**
 * 并集
 * @param sets
 * @returns {*}
 */
_Set.cup = function(...sets) {
  // 传参数量
  if (sets.length < 2) {
    sets[0] = sets[0] || [];
    sets[1] = sets[1] || [];
  }
  // 统一类型处理
  sets = new _Array(sets).map(set => new _Array(set));

  return sets.flat().toCustomSet();
};
/**
 * 补集
 * @param mainSet
 * @param otherSets
 * @returns {*}
 */
_Set.setminus = function(mainSet = [], ...otherSets) {
  // 传参数量
  if (otherSets.length < 1) {
    otherSets[0] = otherSets[0] || [];
  }
  // 统一类型处理
  mainSet = new _Array(mainSet);
  otherSets = new _Array(otherSets).map(arg => new _Array(arg));
  return mainSet.filter((value) => {
    return otherSets.every(set => !set.includes(value));
  }).toCustomSet();
};
