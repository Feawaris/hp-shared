// 集合
import { _Array } from './_Array';

export class _Set extends Set {
  // 交集
  static intersection(...args) {
    // 传参数量
    if (args.length < 2) {
      args[0] = args[0] || [];
      args[1] = args[1] || [];
    }
    // 统一类型处理
    args = args.map(arg => new _Array(arg));
    const [first, ...others] = args;
    return first.filter(value => {
      return others.every(set => set.includes(value));
    });
  }
  // 并集
  static union(...args) {
    // 传参数量
    if (args.length < 2) {
      args[0] = args[0] || [];
      args[1] = args[1] || [];
    }
    // 统一类型处理
    args = args.map(arg => new this(arg));
    return args.flat();
  }
  // 补集
  complement() {
  }
  constructor(value = []) {
    // console.log('_Set constructor', value);
    try {
      value = new Set(value);
    } catch (e) {
      console.warn('传参报错，将生成空集合', e);
      value = new Set([]);
    }
    super(value);
    // size 无需定制
  }

  // 方法定制：原型同名方法+新增方法。大部分返回 this 便于链式操作
  /**
   * 修改
   */
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
    return this;
  }
  clear() {
    Set.prototype.clear.apply(this, arguments);
    return this;
  }

  /**
   * 遍历
   */
  // Symbol.iterator 无需定制
  // keys 无需定制
  // values 无需定制
  // entries 无需定制
  forEach() {
    Set.prototype.forEach.apply(this, arguments);
    return this;
  }

  /**
   * 查找
   */
  // has 无需定制

  /**
   * 生成
   */
  // 直接 to_Array 调数组方法再 to_Set 转换回来即可，不用重复定制

  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  [Symbol.toPrimitive](hint) {
    // console.log('_Set [Symbol.toPrimitive]', { hint });
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
    return this.toArray();
  }
  toNativeValue() {
    return new Set(this);
  }
  toArray() {
    return Array.from(this);
  }
  to_Array() {
    return new _Array(this);
  }
}
// _Set.prototype[Symbol.toStringTag] 无需定制
