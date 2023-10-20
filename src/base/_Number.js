// 数字
export class _Number extends Number {
  /**
   * static
   */
  // static NaN [继承]
  // static POSITIVE_INFINITY [继承]
  // static NEGATIVE_INFINITY [继承]
  // static MAX_VALUE [继承]
  // static MIN_VALUE [继承]
  // static MAX_SAFE_INTEGER [继承]
  // static MIN_SAFE_INTEGER [继承]
  // static EPSILON [继承]

  // static isNaN [继承]
  // static isFinite [继承]
  // static isInteger [继承]
  // static isSafeInteger [继承]
  // static parseInt [继承]
  // static parseFloat [继承]

  /**
   * constructor
   */
  constructor(value) {
    value = Number.parseFloat(value);
    super(value);
  }

  /**
   * 生成
   */
  // [新增] 返回新值，方便赋值如 num = num.new(value) 写法
  new(value) {
    return new this.constructor(value);
  }
  // toPrecision [继承]
  // toFixed [继承]
  // [新增] 区别于 toFixed，会移除多余的 0 以精简显示
  toMaxFixed(fractionDigits = 0) {
    const str = Number.prototype.toFixed.apply(this, arguments);
    return Number.parseFloat(str).toString();
  }
  // toExponential [继承]

  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // [新增]
  [Symbol.toPrimitive](hint) {
    console.log('_Number Symbol.toPrimitive', { hint });
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  // [新增]
  toNumber() {
    return this.valueOf();
  }
  // valueOf [继承]
  // toString [继承]
  // toLocaleString [继承]
  // [新增]
  toBoolean() {
    return !Number.isNaN(this);
  }
  // [新增]
  toJSON() {
    return this.valueOf();
  }
}
