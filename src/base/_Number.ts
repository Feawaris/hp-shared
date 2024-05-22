export class _Number extends Number {
  // 进制转换
  static convertBase(x, { from = 10, to = 10 } = {}): string {
    return Number.parseInt(x, from).toString(to);
  }
  // 判断素数
  static isPrime(x): boolean {
    if (x <= 1) {
      return false;
    }
    if (x === 2) {
      return true;
    }
    if (x % 2 === 0) {
      return false;
    }
    for (let i = 3; i <= Math.sqrt(x); i += 2) {
      if (x % i === 0) {
        return false;
      }
    }
    return true;
  }

  constructor(value) {
    value = Number.parseFloat(value);
    super(value);
  }

  // 相对于 Number.prototype.toFixed，移除尾部多余的零和小数点，以精简显示
  toMaxFixed(fractionDigits = 0): string {
    const str = Number.prototype.toFixed.call(this, fractionDigits);
    // 移除尾部多余的零和小数点
    return str.replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1');
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
    // @ts-ignore
    return Number.parseFloat(this);
  }
  toString() {
    return String(this);
  }
  toBoolean() {
    // @ts-ignore
    return ![0, NaN].includes(this);
  }
  toJSON() {
    return this.toNumber();
  }
  toBigInt() {
    return BigInt(this.toNumber());
  }
}
