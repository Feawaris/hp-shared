export class _BigInt {
  value: bigint;
  constructor(x) {
    if (typeof x !== 'bigint') {
      x = String(x);
    }
    this.value = BigInt(x);
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
    return Number.parseFloat(this.value);
  }
  toString() {
    return String(this.value);
  }
  toBoolean() {
    return this.value !== 0n;
  }
  toJSON() {
    return this.toString();
  }
  toBigInt() {
    return this.value;
  }
}
