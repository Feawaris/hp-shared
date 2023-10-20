// 数学运算。对 Math 对象扩展，提供更直观和符合数学约定的名称
import { _Array } from './_Array';
import { _Set } from './_Set';
export const _Math = Object.create(Math);

// 常量
// E [继承]
// LN2 [继承]
// LN10 [继承]
// LOG2E [继承]
// LOG10E [继承]
// PI [继承]
// SQRT1_2 [继承]
// SQRT2 [继承]
// 黄金分割比 PHI
_Math.PHI = (Math.sqrt(5) - 1) / 2;
_Math.PHI_BIG = (Math.sqrt(5) + 1) / 2;

// 常规
// abs [继承]
// min [继承]
// max [继承]
// random [继承]
// sign [继承]
// hypot [继承]
// clz32 [继承]
// imul [继承]
// fround [继承]

// 取整
// ceil [继承]
// floor [继承]
// round [继承]
// trunc [继承]

// 三角函数
// sin [继承]
// cos [继承]
// tan [继承]
// asin [继承]
// acos [继承]
// atan [继承]
// sinh [继承]
// cosh [继承]
// tanh [继承]
// asinh [继承]
// acosh [继承]
// atanh [继承]
// atan2 [继承]
// [新增]
_Math.arcsin = Math.asin.bind(Math);
_Math.arccos = Math.acos.bind(Math);
_Math.arctan = Math.atan.bind(Math);
_Math.arsinh = Math.asinh.bind(Math);
_Math.arcosh = Math.acosh.bind(Math);
_Math.artanh = Math.atanh.bind(Math);

// 对数
// log2 [继承]
// log10 [继承]
// log1p [继承]
// [定制]
_Math.log = function(a, x) {
  return Math.log(x) / Math.log(a);
};
_Math.loge = Math.log.bind(Math);
_Math.ln = Math.log.bind(Math);
_Math.lg = Math.log10.bind(Math);

// 指数
// pow [继承]
// sqrt [继承]
// cbrt [继承]
// exp [继承]
// expm1 [继承]

// 阶乘
_Math.factorial = function(n) {
  let result = 1n;
  for (let i = n; i >= 1; i--) {
    result *= BigInt(i);
  }
  return result;
};
// 排列 Arrangement
_Math.A = function(n, m) {
  return _Math.factorial(n) / _Math.factorial(n - m);
};
_Math.Arrangement = _Math.A;
// 组合 Combination
_Math.C = function(n, m) {
  return _Math.A(n, m) / _Math.factorial(m);
};
_Math.Combination = _Math.C;

// 数列
_Math.Sequence = class {
  // 生成数据方法
  toArray(length = this.n) {
    let arr = [];
    for (let i = 0; i < length; i++) {
      const n = i + 1;
      arr[i] = this.an(n);
    }
    return arr;
  }
  to_Array() {
    return new _Array(this.toArray(...arguments));
  }
  toSet() {
    return new Set(this.toArray(...arguments));
  }
  to_Set() {
    return new _Set(this.toArray(...arguments));
  }
};
// 等差数列
_Math.ArithmeticSequence = class extends _Math.Sequence {
  constructor(a1, d, n = 0) {
    super();
    this.a1 = a1; // 首项
    this.d = d; // 公差
    this.n = n; // 默认项数，可用于方法的传参简化
  }
  // 第n项
  an(n = this.n) {
    return this.a1 + (n - 1) * this.d;
  }
  // 前n项求和
  Sn(n = this.n) {
    return n / 2 * (this.a1 + this.an(n));
  }
};
// 等比数列
_Math.GeometricSequence = class extends _Math.Sequence {
  constructor(a1, q, n = 0) {
    super();
    this.a1 = a1; // 首项
    this.q = q; // 公比
    this.n = n; // 默认项数，可用于方法的传参简化
  }
  // 第n项
  an(n = this.n) {
    return this.a1 * this.q ** (n - 1);
  }
  // 前n项求和
  Sn(n = this.n) {
    if (this.q === 1) {
      return n * this.a1;
    }
    return this.a1 * (1 - this.q ** n) / (1 - this.q);
  }
};
// 斐波那契数列
_Math.FibonacciSequence = class extends _Math.Sequence {
  constructor(n = 0) {
    super();
    Object.defineProperty(this, 'a1', {
      get() {
        return this.an(1);
      },
    });
    this.n = n; // 默认项数，可用于方法的传参简化
  }
  // 第n项
  an(n = this.n) {
    return Math.round((_Math.PHI_BIG ** n - (1 - _Math.PHI_BIG) ** n) / Math.sqrt(5));
  }
  // 前n项求和
  Sn(n = this.n) {
    return this.an(n + 2) - 1;
  }
};
// 素数数列
_Math.PrimeSequence = class extends _Math.Sequence {
  // 是否素数
  static isPrime(x) {
    if (x <= 1) {
      return false;
    }
    for (let i = 2; i <= Math.sqrt(x); i++) {
      if (x % i === 0) {
        return false;
      }
    }
    return true;
  }
  // 创建素数列表
  static createList(a1, n) {
    let result = [];
    let value = a1;
    while (result.length < n) {
      if (this.isPrime(value)) {
        result.push(value);
      }
      value++;
    }
    return result;
  }

  constructor(a1 = 2, n = 0) {
    super();
    this.value = this.constructor.createList(a1, n);
    this.a1 = a1;
    this.n = n; // 默认项数，可用于方法的传参简化
  }

  an(n = this.n) {
    if (n <= this.n) {
      return this.value[n - 1];
    }
    return this.constructor.createList(this.a1, n)[n - 1];
  }
  Sn(n = this.n) {
    return this.toArray(n).reduce((total, val) => total + val, 0);
  }
};
