// @ts-nocheck
import { _Array } from './_Array';

export class _Set<T> extends Set<T> {
  /**
   * 交集
   * @param sets
   * @returns {*}
   */
  static cap(...sets):_Set<any> {
    // 传参数量
    if (sets.length < 2) {
      sets[0] = sets[0] || [];
      sets[1] = sets[1] || [];
    }
    // 统一类型处理
    sets = new _Array(sets).map((set) => new _Array(set));

    const [first, ...others] = sets;
    return first
      .filter((value) => {
        return others.every((set) => set.includes(value));
      })
      .to_Set();
  }
  /**
   * 并集
   * @param sets
   * @returns {*}
   */
  static cup(...sets) {
    // 传参数量
    if (sets.length < 2) {
      sets[0] = sets[0] || [];
      sets[1] = sets[1] || [];
    }
    // 统一类型处理
    sets = new _Array(sets).map((set) => new _Array(set));

    return sets.flat().to_Set();
  }
  /**
   * 补集
   * @param mainSet
   * @param otherSets
   * @returns {*}
   */
  static setminus(mainSet = [], ...otherSets) {
    // 传参数量
    if (otherSets.length < 1) {
      otherSets[0] = otherSets[0] || [];
    }
    // 统一类型处理
    mainSet = new _Array(mainSet);
    otherSets = new _Array(otherSets).map((arg) => new _Array(arg));
    return mainSet
      .filter((value) => {
        return otherSets.every((set) => !set.includes(value));
      })
      .to_Set();
  }

  // 选用数组 length 习惯
  get length(): number {
    return this.size
  }
  constructor(value: any[] | Iterable<T> = []) {
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
  [Symbol.toPrimitive](hint: string): number | string {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  toNumber(): number {
    return this.size;
  }
  toString(): string {
    try {
      return `{${this.toArray().join(',')}}`;
    } catch (e) {
      return '{}';
    }
  }
  toBoolean(): boolean {
    return this.size > 0;
  }
  toJSON(): any[] {
    return this.toArray();
  }
  toArray(): any[] {
    return Array.from(this);
  }
  to_Array(): _Array<any> {
    // @ts-ignore
    return _Array.from(this);
  }
  toSet(): Set<any> {
    return new Set(this);
  }
  to_Set(): _Set<any> {
    return new _Set(this);
  }
}
