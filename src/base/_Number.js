// 数字
export class _Number extends Number {
  /**
   * static
   */
  // static MAX_VALUE 无需定制
  // static MIN_VALUE 无需定制
  // static NaN 无需定制
  // static NEGATIVE_INFINITY 无需定制
  // static POSITIVE_INFINITY 无需定制
  // static MAX_SAFE_INTEGER 无需定制
  // static MIN_SAFE_INTEGER 无需定制
  // static EPSILON 无需定制

  // static isNaN 无需定制
  // static isFinite 无需定制
  // static isInteger 无需定制
  // static isSafeInteger 无需定制
  // static parseInt 无需定制
  // static parseFloat 无需定制

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
  // (定制方法) 返回新值，方便赋值如 num = num.new(value) 写法
  new(value) {
    return new this.constructor(value);
  }

  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // (定制方法)
  [Symbol.toPrimitive](hint) {
    console.log('_Number Symbol.toPrimitive', { hint });
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  // (新增方法)
  toNumber() {
    return this.valueOf();
  }
  // valueOf 无需定制
  // toString 无需定制
  // toLocaleString 无需定制
  // (新增方法)
  toBoolean() {
    return !Number.isNaN(this);
  }
  // (定制方法)
  toJSON() {
    return this.valueOf();
  }
  // toPrecision 无需定制
  // toFixed 无需定制
  // (新增方法) 区别于 toFixed，会移除多余的 0 以精简显示
  toMaxFixed() {
    const str = Number.prototype.toFixed.apply(this, arguments);
    return Number.parseFloat(str).toString();
  }
  // toExponential 无需定制
}
