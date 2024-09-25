// 数学运算。相对于 Math 对象提供更直观和符合数学约定的名称，方便解构后顺手使用
import { _Number } from './_Number';
import { _Object } from './_Object';

// 数列
class Sequence {
  n: number = 0;
  get value() {
    return this.toArray(this.n);
  }
  get setValue() {
    return this.toSet(this.n);
  }
  constructor(n: number = 0) {
    this.n = n; // 默认项数，可用于方法的传参简化
  }
  // 第n项：方法须在子类中具体实现
  an(n: number = this.n): number {
    return 0;
  }
  // 前n项求和：通用写法，有公式或者优化计算的在子类中具体实现
  Sn(n: number = this.n): number {
    let result: number = 0;
    for (let i = 0; i < n; i++) {
      result += this.an(i + 1);
    }
    return result;
  }
  // 生成数据方法，适合 an 有公式的，特殊类型需要在子类中单独定制 toArray
  toArray(length: number = this.n): Array<number> {
    let result: number[] = [];
    for (let i = 0; i < length; i++) {
      const n = i + 1;
      result.push(this.an(n));
    }
    return result;
  }
  toSet(length: number = this.n): Set<number> {
    return new Set(this.toArray(length));
  }
}
// 等差数列
class ArithmeticSequence extends Sequence {
  a1: number = 0;
  d: number = 0;
  constructor(a1: number = 0, d: number = 0, n: number = 0) {
    super(n);
    this.a1 = a1;
    this.d = d;
  }
  an(n = this.n) {
    return this.a1 + (n - 1) * this.d;
  }
  Sn(n = this.n) {
    return (n / 2) * (this.a1 + this.an(n));
  }
}
// 等比数列
class GeometricSequence extends Sequence {
  a1: number = 0;
  q: number = 1;
  constructor(a1: number = 0, q: number = 1, n: number = 0) {
    super(n);
    this.a1 = a1;
    this.q = q;
  }
  an(n: number = this.n) {
    return this.a1 * this.q ** (n - 1);
  }
  Sn(n: number = this.n) {
    if (this.q === 1) {
      return n * this.a1;
    }
    return (this.a1 * (1 - this.q ** n)) / (1 - this.q);
  }
}
// 斐波那契数列
class FibonacciSequence extends Sequence {
  constructor(n: number = 0) {
    super(n);
  }
  an(n: number = this.n) {
    return Math.round((_Math.PHI_BIG ** n - (-_Math.PHI_BIG) ** -n) / Math.sqrt(5));
  }
  Sn(n: number = this.n) {
    return this.an(n + 2) - 1;
  }
}
// 素数数列
class PrimeSequence extends Sequence {
  max: number = Infinity;
  constructor({ n = 0, max = Infinity } = {}) {
    // 选择传 n 或 max 进行处理
    super(n);
    this.max = max;
    // 传max时根据max计算n
    if (max > 0 && max < Infinity) {
      this.n = this.toArray({ max }).length;
    }
  }
  // @ts-ignore
  toArray({ n = this.n, max = this.max } = {}): Array<number> {
    if (max > 0 && max < Infinity) {
      n = Infinity; // 传max时n未知，下面计算后得到
    } else if (n > 0) {
      max = Infinity; // 传n时max不限制
    }

    let result: number[] = [];
    let value: number = 2;
    while (value < max && result.length < n) {
      if (_Number.isPrime(value)) {
        result.push(value);
      }
      value += 1;
    }
    return result;
  }
  an(n = this.n): number {
    return this.toArray({ n })[n - 1];
  }
  Sn(n = this.n): number {
    return this.toArray({ n }).reduce((total, val) => total + val, 0);
  }
}
interface BaseMathOptions {
  A?: {
    returnType?: 'auto' | 'bigint';
  };
  C?: {
    returnType?: 'auto' | 'bigint';
  };
}
export class BaseMath {
  options: BaseMathOptions = {
    A: {
      returnType: 'auto',
    },
    C: {
      returnType: 'auto',
    },
  };
  constructor(options: BaseMathOptions = {}) {
    _Object.deepAssign(this.options, options);
    this.methodBindThis();
  }
  methodBindThis() {
    // @ts-ignore
    const methods = Reflect.ownKeys(this.constructor.prototype).filter(key => typeof this[key] === 'function' && !['constructor', 'methodBindThis'].includes(key));
    for (const method of methods) {
      // @ts-ignore
      this[method] = this[method].bind(this);
    }
  }

  // 黄金分割比 Φ
  PHI: number = (Math.sqrt(5) - 1) / 2;
  PHI_BIG: number = (Math.sqrt(5) + 1) / 2;

  // 对数
  log(a: number, x: number) {
    return Math.log(x) / Math.log(a);
  }
  loge = Math.log;
  ln = Math.log;
  lg = Math.log10;

  // 三角函数
  arcsin = Math.asin;
  arccos = Math.acos;
  arctan = Math.atan;
  arsinh = Math.asinh;
  arcosh = Math.acosh;
  artanh = Math.atanh;

  // 阶乘
  factorial(n: number): bigint {
    let result: bigint = BigInt(1);
    for (let i = n; i >= 1; i--) {
      result *= BigInt(i);
    }
    return result;
  }
  // A/C 写法(对比 P/() 写法)
  // 排列
  A(n: number, k: number): number | bigint {
    let result: bigint = this.factorial(n) / this.factorial(n - k);
    switch (this.options.A.returnType) {
      case 'auto':
        return result <= Number.MAX_SAFE_INTEGER ? Number(result) : result;
      case 'bigint':
      default:
        return result;
    }
  }
  // 组合
  C(n: number, k: number): number | bigint {
    let result: bigint = BigInt(this.A(n, k)) / this.factorial(k);
    switch (this.options.C.returnType) {
      case 'auto':
        return result <= Number.MAX_SAFE_INTEGER ? Number(result) : result;
      case 'bigint':
      default:
        return result;
    }
  }

  Sequence = Sequence;
  ArithmeticSequence = ArithmeticSequence;
  GeometricSequence = GeometricSequence;
  FibonacciSequence = FibonacciSequence;
  PrimeSequence = PrimeSequence;
}
Object.setPrototypeOf(BaseMath.prototype, Math);
export const _Math = new BaseMath();

