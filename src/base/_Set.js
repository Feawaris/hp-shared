// 集合
import { _Array } from './_Array';

export class _Set extends Set {
  /**
   * [新增] 交集
   * @param sets
   * @returns {*}
   */
  static intersection(...sets) {
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
    }).to_Set();
  }
  /**
   * [新增] 并集
   * @param sets
   * @returns {*}
   */
  static union(...sets) {
    // 传参数量
    if (sets.length < 2) {
      sets[0] = sets[0] || [];
      sets[1] = sets[1] || [];
    }
    // 统一类型处理
    sets = new _Array(sets).map(set => new _Array(set));

    return sets.flat().to_Set();
  }
  /**
   * [新增] 补集
   * @param mainSet
   * @param otherSets
   * @returns {*}
   */
  static complement(mainSet = [], ...otherSets) {
    // 传参数量
    if (otherSets.length < 1) {
      otherSets[0] = otherSets[0] || [];
    }
    // 统一类型处理
    mainSet = new _Array(mainSet);
    otherSets = new _Array(otherSets).map(arg => new _Array(arg));
    return mainSet.filter((value) => {
      return otherSets.every(set => !set.includes(value));
    }).to_Set();
  }
  /**
   * 简写方式，对应 python 运算符 &,|,-
   */
  static '&'() {
    return this.intersection(...arguments);
  }
  static '|'() {
    return this.union(...arguments);
  }
  static '-'() {
    return this.complement(...arguments);
  }

  /**
   * constructor
   */
  constructor(value = []) {
    // console.log('_Set constructor', value);
    try {
      value = new Set(value);
    } catch (e) {
      console.warn('传参报错，将生成空集合', e);
      value = new Set([]);
    }
    super(value);

    // size [继承]
  }

  // 方法定制：原型同名方法+新增方法。部分定制成返回 this 便于链式操作
  /**
   * 修改
   */
  // [定制]
  add(...values) {
    for (const value of values) {
      Set.prototype.add.apply(this, arguments);
    }
    return this;
  }
  // [定制]
  delete(...values) {
    for (const value of values) {
      Set.prototype.delete.apply(this, arguments);
    }
    return this;
  }
  // [定制]
  clear() {
    Set.prototype.clear.apply(this, arguments);
    return this;
  }

  /**
   * 遍历
   */
  // Symbol.iterator [继承]
  // keys [继承]
  // values [继承]
  // entries [继承]
  // [定制]
  forEach() {
    Set.prototype.forEach.apply(this, arguments);
    return this;
  }

  /**
   * 查找
   */
  // has [继承]

  /**
   * 生成
   */
  // 直接通过 to_Array 和 to_Set 转换操作即可，无需重复定制

  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // [新增]
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  // [新增]
  toNumber() {
    return NaN;
  }
  // [新增]
  toString() {
    try {
      return `{${this.toArray().join(',')}}`;
    } catch (e) {
      return '{}';
    }
  }
  // [新增]
  toBoolean(options = {}) {
    return this.size > 0;
  }
  // [新增]
  toJSON() {
    return this.toArray();
  }
  // [新增]
  toArray() {
    return Array.from(this);
  }
  // [新增]
  to_Array() {
    return new _Array(this);
  }
  // [新增]
  toSet() {
    return new Set(this);
  }
}
