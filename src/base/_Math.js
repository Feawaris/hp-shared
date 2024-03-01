// 数学运算。相对于 Math 对象提供更直观和符合数学约定的名称，方便解构后顺手使用
import { _Array } from './_Array';
import { _Set } from './_Set';
import { _Number } from './_Number';

export const _Math = Object.create(null);
// 黄金分割比 Φ
_Math.PHI = (Math.sqrt(5) - 1) / 2;
_Math.PHI_BIG = (Math.sqrt(5) + 1) / 2;

// 三角函数
_Math.arcsin = Math.asin;
_Math.arccos = Math.acos;
_Math.arctan = Math.atan;
_Math.arsinh = Math.asinh;
_Math.arcosh = Math.acosh;
_Math.artanh = Math.atanh;

// 对数
_Math.log = function (a, x) {
  return Math.log(x) / Math.log(a);
};
_Math.loge = Math.log;
_Math.ln = Math.log;
_Math.lg = Math.log10;

// 阶乘
_Math.factorial = function (n) {
  let result = 1n;
  for (let i = n; i >= 1; i--) {
    result *= BigInt(i);
  }
  return result;
};
// P/() 写法：命名同 latex
// 排列
_Math.permutation = function (n, k) {
  return _Math.factorial(n) / _Math.factorial(n - k);
};
// 组合
_Math.combination = function (n, k) {
  return _Math.A(n, k) / _Math.factorial(k);
};
// A/C 写法
_Math.A = _Math.permutation;
_Math.C = _Math.combination;

// 数列
_Math.Sequence = class {
  constructor(n = 0) {
    this.n = n; // 默认项数，可用于方法的传参简化
  }

  // 生成数据方法，适合 an 有公式的，特殊类型需要单独定制 toArray
  toArray(length = this.n) {
    let result = [];
    for (let i = 0; i < length; i++) {
      const n = i + 1;
      result.push(this.an(n));
    }
    return result;
  }
  toCustomArray() {
    return new _Array(this.toArray(...arguments));
  }
  toSet() {
    return new Set(this.toArray(...arguments));
  }
  toCustomSet() {
    return new _Set(this.toArray(...arguments));
  }
};
// 等差数列
_Math.ArithmeticSequence = class extends _Math.Sequence {
  constructor(a1, d, n = 0) {
    super(n);
    this.a1 = a1; // 首项
    this.d = d; // 公差
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
    super(n);
    this.a1 = a1; // 首项
    this.q = q; // 公比
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
    super(n);
  }
  // 第n项
  an(n = this.n) {
    return Math.round(((_Math.PHI_BIG ** n) - (-_Math.PHI_BIG) ** (-n)) / Math.sqrt(5));
  }
  // 前n项求和
  Sn(n = this.n) {
    return this.an(n + 2) - 1;
  }
};
// 素数数列
_Math.PrimeSequence = class extends _Math.Sequence {
  // 选择传 n 或 max 进行处理
  constructor({ max = Infinity, n = 0 } = {}) {
    super(n);
    this.max = max;
  }
  toArray({ max = this.max, n = this.n } = {}) {
    if (max > 0 && max < Infinity) {
      n = Infinity;
    } else if (n > 0) {
      max = Infinity;
    }

    let result = [];
    let value = 2;
    while (value < max && result.length < n) {
      if (_Number.isPrime(value)) {
        result.push(value);
      }
      value += 1;
    }
    return result;
  }
  an(n = this.n) {
    return this.toArray({ n })[n - 1];
  }
  Sn(n = this.n) {
    return this.toArray({ n }).reduce((total, val) => total + val, 0);
  }
};
