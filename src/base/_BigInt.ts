export class BaseBigInt {
  value: bigint;
  constructor(x) {
    if (typeof x !== 'bigint') {
      x = String(x);
    }
    this.value = BigInt(x);
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
    return Number.parseInt(String(this.value));
  }
  toString() {
    return String(this.value);
  }
  toBoolean() {
    return this.value !== BigInt(0);
  }
  toJSON() {
    return this.toString();
  }
}
export function _BigInt(x: number | bigint) {
  return new BaseBigInt(x);
}
