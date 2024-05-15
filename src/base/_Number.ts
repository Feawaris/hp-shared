export class _Number extends Number {
  // 进制转换
  static convertBase(x, { from = 10, to = 10 } = {}): string {
    return Number.parseInt(x, from).toString(to);
  }
  // 判断素数
  static isPrime(x): boolean {
    if (x < 2) {
      return false;
    }
    for (let i = 2; i <= Math.sqrt(x); i++) {
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
}
