/*!
 * hp-shared v0.2.1
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"cjs","sourcemap":"inline"}
 */
  
'use strict';

// 集合

class _Set extends Set {
  /**
   * [新增] 交集
   * @param sets
   * @returns {*}
   */
  static intersection(...sets) {
    // 传参数量
    if (sets.length < 2) {
      sets[0] = sets[0] || [];
      sets[1] = sets[1] || [];
    }
    // 统一类型处理
    sets = new _Array(sets).map(set => new _Array(set));

    const [first, ...others] = sets;
    return first.filter((value) => {
      return others.every(set => set.includes(value));
    }).to_Set();
  }
  /**
   * [新增] 并集
   * @param sets
   * @returns {*}
   */
  static union(...sets) {
    // 传参数量
    if (sets.length < 2) {
      sets[0] = sets[0] || [];
      sets[1] = sets[1] || [];
    }
    // 统一类型处理
    sets = new _Array(sets).map(set => new _Array(set));

    return sets.flat().to_Set();
  }
  /**
   * [新增] 补集
   * @param mainSet
   * @param otherSets
   * @returns {*}
   */
  static complement(mainSet = [], ...otherSets) {
    // 传参数量
    if (otherSets.length < 1) {
      otherSets[0] = otherSets[0] || [];
    }
    // 统一类型处理
    mainSet = new _Array(mainSet);
    otherSets = new _Array(otherSets).map(arg => new _Array(arg));
    return mainSet.filter((value) => {
      return otherSets.every(set => !set.includes(value));
    }).to_Set();
  }

  /**
   * constructor
   */
  constructor(value = []) {
    // console.log('_Set constructor', value);
    try {
      value = new Set(value);
    } catch (e) {
      console.warn('传参报错，将生成空集合', e);
      value = new Set([]);
    }
    super(value);

    // size [继承]
  }

  // 方法定制：原型同名方法+新增方法。部分定制成返回 this 便于链式操作
  /**
   * 修改
   */
  // [定制]
  add(...values) {
    for (const value of values) {
      Set.prototype.add.apply(this, arguments);
    }
    return this;
  }
  // [定制]
  delete(...values) {
    for (const value of values) {
      Set.prototype.delete.apply(this, arguments);
    }
    return this;
  }
  // [定制]
  clear() {
    Set.prototype.clear.apply(this, arguments);
    return this;
  }

  /**
   * 遍历
   */
  // Symbol.iterator [继承]
  // keys [继承]
  // values [继承]
  // entries [继承]
  // [定制]
  forEach() {
    Set.prototype.forEach.apply(this, arguments);
    return this;
  }

  /**
   * 查找
   */
  // has [继承]

  /**
   * 生成
   */
  // 直接通过 to_Array 和 to_Set 转换操作即可，无需重复定制

  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // [新增]
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  // [新增]
  toNumber() {
    return NaN;
  }
  // [新增]
  toString() {
    try {
      return `{${this.toArray().join(',')}}`;
    } catch (e) {
      return '{}';
    }
  }
  // [新增]
  toBoolean(options = {}) {
    return this.size > 0;
  }
  // [新增]
  toJSON() {
    return this.toArray();
  }
  // [新增]
  toArray() {
    return Array.from(this);
  }
  // [新增]
  to_Array() {
    return new _Array(this);
  }
  // [新增]
  toSet() {
    return new Set(this);
  }
}

// 数组

class _Array extends Array {
  /**
   * static
   */
  // static isArray [继承]
  // static from [继承]
  // static of [继承]

  /**
   * constructor
   */
  constructor(value = []) {
    try {
      value = Array.from(value);
    } catch (e) {
      console.warn('传参报错，将生成空数组', e);
      value = [];
    }
    if (value.length === 1 && typeof value[0] === 'number') {
      // 稀疏数组问题，先调 super 生成 this 后再修改 this 内容
      const temp = value[0];
      value[0] = undefined;
      super(...value);
      this[0] = temp;
    } else {
      super(...value);
    }

    // length [继承]
  }

  // 方法定制：原型同名方法+新增。部分定制成返回 this 便于链式操作
  /**
   * 修改
   */
  // [定制]
  push() {
    Array.prototype.push.apply(this, arguments);
    return this;
  }
  // [定制]
  pop(length = 1) {
    for (let i = 0; i < length; i++) {
      Array.prototype.pop.apply(this, arguments);
    }
    return this;
  }
  // [定制]
  unshift() {
    Array.prototype.unshift.apply(this, arguments);
    return this;
  }
  // [定制]
  shift(length = 1) {
    for (let i = 0; i < length; i++) {
      Array.prototype.shift.apply(this, arguments);
    }
    return this;
  }
  // [定制]
  splice() {
    Array.prototype.splice.apply(this, arguments);
    return this;
  }
  // [新增] 删除
  delete(value) {
    const index = this.findIndex(val => val === value);
    this.splice(index, 1);
    return this;
  }
  // [新增] 清空
  clear() {
    this.splice(0);
    return this;
  }
  // [新增] 去重
  unique(options = {}) {
    const value = this.to_Set().to_Array();
    this.clear().push(...value);
    return this;
  }
  // sort [继承]
  // [新增] 随机排序数组
  randomSort() {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }

    return this;
  }
  // reverse [继承]
  // fill [继承]
  // copyWithin [继承]

  /**
   * 遍历
   */
  // Symbol.iterator [继承]
  // keys [继承]
  // values [继承]
  // entries [继承]
  // [定制]
  forEach() {
    Array.prototype.forEach.apply(this, arguments);
    return this;
  }

  /**
   * 查找
   */
  // at [继承]
  // find [继承]
  // findIndex [继承]
  // findLast [继承]
  // findLastIndex [继承]
  // includes [继承]
  // indexOf [继承]
  // lastIndexOf [继承]
  // some [继承]
  // every [继承]

  /**
   * 生成
   */
  // map [继承]
  // filter [继承]
  // reduce [继承]
  // reduceRight [继承]
  // concat [继承]
  // slice [继承]
  // join [继承]
  // flat [继承]
  // flatMap [继承]
  // [定制]
  with() {
    const value = Array.prototype.with.apply(this, arguments);
    return new this.constructor(value);
  }
  // [定制]
  toSpliced() {
    const value = Array.prototype.toSpliced.apply(this, arguments);
    return new this.constructor(value);
  }
  // [定制]
  toSorted() {
    const value = Array.prototype.toSorted.apply(this, arguments);
    return new this.constructor(value);
  }
  // [定制]
  toReversed() {
    const value = Array.prototype.toReversed.apply(this, arguments);
    return new this.constructor(value);
  }

  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // [新增]
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  // [新增]
  toNumber() {
    return NaN;
  }
  // [定制]
  toString() {
    try {
      return JSON.stringify(this);
    } catch (e) {
      console.warn(`toString 转换报错，将生成 '[]'`, e);
      return JSON.stringify([]);
    }
  }
  // toLocaleString [继承]
  // [新增]
  toBoolean() {
    return this.length > 0;
  }
  // [新增]
  toJSON() {
    return Array.from(this);
  }
  // [新增]
  toArray() {
    return Array.from(this);
  }
  // [新增]
  toSet() {
    return new Set(this);
  }
  // [新增]
  to_Set() {
    return new _Set(this);
  }
}

// 日期时间
class _Date extends Date {
  /**
   * static
   */
  // [新增]
  static REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
  static REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
  // static now [继承]
  // static parse [继承]
  // static UTC [继承]

  /**
   * constructor
   */
  constructor(...args) {
    // console.log('_Date constructor', args);
    if (args.length === 1) {
      // null 和显式 undefined 都视为无效值
      if (args[0] === null) {
        args[0] = undefined;
      }
      // safari 浏览器字符串格式兼容
      if (typeof args[0] === 'string') {
        args[0] = args[0].replaceAll('-', '/');
      }
    }
    super(...args);

    // [新增]
    Object.defineProperty(this, 'year', {
      get() {
        return this.getFullYear();
      },
    });
    Object.defineProperty(this, 'month', {
      get() {
        return this.getMonth() + 1;
      },
    });
    Object.defineProperty(this, 'day', {
      get() {
        return this.getDate();
      },
    });
    Object.defineProperty(this, 'week', {
      get() {
        return this.getDay();
      },
    });
    Object.defineProperty(this, 'hour', {
      get() {
        return this.getHours();
      },
    });
    Object.defineProperty(this, 'shortHour', {
      get() {
        const hour = this.hour;
        return hour % 12 === 0 ? hour : hour % 12;
      },
    });
    Object.defineProperty(this, 'minute', {
      get() {
        return this.getMinutes();
      },
    });
    Object.defineProperty(this, 'second', {
      get() {
        return this.getSeconds();
      },
    });
    Object.defineProperty(this, 'millisecond', {
      get() {
        return this.getMilliseconds();
      },
    });
    Object.defineProperty(this, 'timeZoneOffsetHour', {
      get() {
        return this.getTimezoneOffset() / 60;
      },
    });

    // 格式化字符串用。总体同 element 用的 day.js 格式(https://day.js.org/docs/zh-CN/display/format)，风格定制成中文
    this.format = Object.create(null);
    const $this = this;
    Object.defineProperty(this.format, 'YY', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.year.toString().slice(-2);
      },
    });
    Object.defineProperty(this.format, 'YYYY', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.year.toString().slice(-4);
      },
    });
    Object.defineProperty(this.format, 'M', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.month.toString();
      },
    });
    Object.defineProperty(this.format, 'MM', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.month.toString().padStart(2, '0');
      },
    });
    Object.defineProperty(this.format, 'D', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.day.toString();
      },
    });
    Object.defineProperty(this.format, 'DD', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.day.toString().padStart(2, '0');
      },
    });
    Object.defineProperty(this.format, 'd', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][$this.week];
      },
    });
    Object.defineProperty(this.format, 'dd', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][$this.week];
      },
    });
    Object.defineProperty(this.format, 'H', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.hour.toString();
      },
    });
    Object.defineProperty(this.format, 'HH', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.hour.toString().padStart(2, '0');
      },
    });
    Object.defineProperty(this.format, 'h', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.shortHour.toString();
      },
    });
    Object.defineProperty(this.format, 'hh', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.shortHour.toString().padStart(2, '0');
      },
    });
    Object.defineProperty(this.format, 'm', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.minute.toString();
      },
    });
    Object.defineProperty(this.format, 'mm', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.minute.toString().padStart(2, '0');
      },
    });
    Object.defineProperty(this.format, 's', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.second.toString();
      },
    });
    Object.defineProperty(this.format, 'ss', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.second.toString().padStart(2, '0');
      },
    });
    Object.defineProperty(this.format, 'SSS', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.millisecond.toString().padStart(3, '0');
      },
    });
    Object.defineProperty(this.format, 'a', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        return $this.hour < 12 ? '上午' : '下午';
      },
    });
    Object.defineProperty(this.format, 'A', {
      get() {
        return this.a;
      },
    });
    Object.defineProperty(this.format, 'Z', {
      get() {
        if (!$this.toBoolean()) {
          return '';
        }
        const sign = $this.timeZoneOffsetHour < 0 ? '+' : '-';
        return `${sign}${(-$this.timeZoneOffsetHour).toString().padStart(2, '0')}:00`;
      },
    });
    Object.defineProperty(this.format, 'ZZ', {
      get() {
        return this.Z.replace(':', '');
      },
    });
  }

  /**
   * [继承] get 系列方法。使用 year、month 等通过新增属性获取即可，简化写法，无需额外定制
   */
  // getTime [继承]
  // getTimezoneOffset [继承]

  // getYear [继承]
  // getFullYear [继承]
  // getMonth [继承]
  // getDate [继承]
  // getDay [继承]
  // getHours [继承]
  // getMinutes [继承]
  // getSeconds [继承]
  // getMilliseconds [继承]

  // getUTCFullYear [继承]
  // getUTCMonth [继承]
  // getUTCDate [继承]
  // getUTCDay [继承]
  // getUTCHours [继承]
  // getUTCMinutes [继承]
  // getUTCSeconds [继承]
  // getUTCMilliseconds [继承]

  /**
   * [定制] set 系列方法。定制成返回 this 便于链式操作
   */
  setTime() {
    Date.prototype.setTime.apply(this, arguments);
    return this;
  }

  setYear() {
    Date.prototype.setYear.apply(this, arguments);
    return this;
  }
  setFullYear() {
    Date.prototype.setFullYear.apply(this, arguments);
    return this;
  }
  setMonth() {
    Date.prototype.setMonth.apply(this, arguments);
    return this;
  }
  setDate() {
    Date.prototype.setDate.apply(this, arguments);
    return this;
  }
  setHours() {
    Date.prototype.setHours.apply(this, arguments);
    return this;
  }
  setMinutes() {
    Date.prototype.setMinutes.apply(this, arguments);
    return this;
  }
  setSeconds() {
    Date.prototype.setSeconds.apply(this, arguments);
    return this;
  }
  setMilliseconds() {
    Date.prototype.setMilliseconds.apply(this, arguments);
    return this;
  }

  setUTCFullYear() {
    Date.prototype.setUTCFullYear.apply(this, arguments);
    return this;
  }
  setUTCMonth() {
    Date.prototype.setUTCMonth.apply(this, arguments);
    return this;
  }
  setUTCDate() {
    Date.prototype.setUTCDate.apply(this, arguments);
    return this;
  }
  setUTCHours() {
    Date.prototype.setUTCHours.apply(this, arguments);
    return this;
  }
  setUTCMinutes() {
    Date.prototype.setUTCMinutes.apply(this, arguments);
    return this;
  }
  setUTCSeconds() {
    Date.prototype.setUTCSeconds.apply(this, arguments);
    return this;
  }
  setUTCMilliseconds() {
    Date.prototype.setUTCMilliseconds.apply(this, arguments);
    return this;
  }

  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // [新增]
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  // [新增]
  toNumber() {
    return this.getTime();
  }
  // [定制]
  toString(format = 'YYYY-MM-DD hh:mm:ss') {
    if (!this.toBoolean()) {
      return '';
    }
    return format.replaceAll(this.constructor.REGEX_FORMAT, (match, $1) => {
      // [] 里面的内容原样输出
      if ($1) {
        return $1;
      }
      // 格式
      if (match in this.format) {
        return this.format[match];
      }
    });
  }
  // [定制]
  toDateString(format = 'YYYY-MM-DD') {
    return this.toString(format);
  }
  // [定制]
  toTimeString(format = 'HH:mm:ss') {
    return this.toString(format);
  }
  // toLocaleString [继承]
  // toLocaleDateString [继承]
  // toLocaleTimeString [继承]
  // toISOString [继承]
  // toUTCString [继承]
  // toGMTString [继承]
  // [新增]
  toBoolean() {
    return !Number.isNaN(this.getTime());
  }
  // [新增]
  toJSON(options = {}) {
    return this.toString();
  }
  // valueOf [继承]
}

// 数学运算。对 Math 对象扩展，提供更直观和符合数学约定的名称
const _Math = Object.create(Math);

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

// 数字
class _Number extends Number {
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

const _Reflect = Object.create(Reflect);

// apply 继承
// construct 继承
// defineProperty 继承
// deleteProperty 继承
// get 继承
// getOwnPropertyDescriptor 继承
// getPrototypeOf 继承
// ownKeys 继承
// set 继承
// setPrototypeOf 继承
// preventExtensions 继承
// has 继承
// isExtensible 继承

// 对 ownKeys 配套 ownValues 和 ownEntries
_Reflect.ownValues = function(target) {
  return Reflect.ownKeys(target).map(key => target[key]);
};
_Reflect.ownEntries = function(target) {
  return Reflect.ownKeys(target).map(key => [key, target[key]]);
};

// 数据处理，处理多格式数据用
const Data = Object.create(null);
/**
 * 优化 typeof
 * @param value
 * @returns {'undefined'|'object'|'boolean'|'number'|'string'|'function'|'symbol'|'bigint'|string}
 */
Data.typeof = function(value) {
  if (value === null) {
    return 'null';
  }
  return typeof value;
};
/**
 * 判断简单类型
 * @param value
 * @returns {boolean}
 */
Data.isSimpleType = function(value) {
  return ['null', 'undefined', 'number', 'string', 'boolean', 'bigint', 'symbol'].includes(this.typeof(value));
};
/**
 * 是否普通对象
 * @param value
 * @returns {boolean}
 */
Data.isPlainObject = function(value) {
  return Object.prototype.toString.apply(value) === '[object Object]';
};
/**
 * 获取值的具体类型
 * @param value 值
 * @returns {ObjectConstructor|*|Function} 返回对应构造函数。null、undefined 原样返回
 */
Data.getExactType = function(value) {
  // null、undefined 原样返回
  if ([null, undefined].includes(value)) {
    return value;
  }
  const __proto__ = Object.getPrototypeOf(value);
  // value 为 Object.prototype 或 Object.create(null) 方式声明的对象时 __proto__ 为 null
  const isObjectByCreateNull = __proto__ === null;
  if (isObjectByCreateNull) {
    // console.warn('isObjectByCreateNull', __proto__);
    return Object;
  }
  // 对应继承的对象 __proto__ 没有 constructor 属性
  const isObjectExtendsObjectByCreateNull = !('constructor' in __proto__);
  if (isObjectExtendsObjectByCreateNull) {
    // console.warn('isObjectExtendsObjectByCreateNull', __proto__);
    return Object;
  }
  // 返回对应构造函数
  return __proto__.constructor;
};
/**
 * 获取值的具体类型列表
 * @param value 值
 * @returns {*[]} 统一返回数组。null、undefined 对应为 [null],[undefined]
 */
Data.getExactTypes = function(value) {
  // null、undefined 判断处理
  if ([null, undefined].includes(value)) {
    return [value];
  }
  // 扫原型链得到对应构造函数
  let result = [];
  let loop = 0;
  let hasObjectExtendsObjectByCreateNull = false;
  let __proto__ = Object.getPrototypeOf(value);
  while (true) {
    // console.warn('while', loop, __proto__);
    if (__proto__ === null) {
      // 一进来 __proto__ 就是 null 说明 value 为 Object.prototype 或 Object.create(null) 方式声明的对象
      if (loop <= 0) {
        result.push(Object);
      } else {
        if (hasObjectExtendsObjectByCreateNull) {
          result.push(Object);
        }
      }
      break;
    }
    if ('constructor' in __proto__) {
      result.push(__proto__.constructor);
    } else {
      result.push(Object);
      hasObjectExtendsObjectByCreateNull = true;
    }
    __proto__ = Object.getPrototypeOf(__proto__);
    loop++;
  }
  return result;
};

/**
 * 深拷贝数据
 * @param source
 * @returns {Map<any, any>|Set<any>|{}|*|*[]}
 */
Data.deepClone = function(source) {
  // 数组
  if (source instanceof Array) {
    let result = [];
    for (const value of source.values()) {
      result.push(this.deepClone(value));
    }
    return result;
  }
  // Set
  if (source instanceof Set) {
    let result = new Set();
    for (let value of source.values()) {
      result.add(this.deepClone(value));
    }
    return result;
  }
  // Map
  if (source instanceof Map) {
    let result = new Map();
    for (let [key, value] of source.entries()) {
      result.set(key, this.deepClone(value));
    }
    return result;
  }
  // 对象
  if (this.getExactType(source) === Object) {
    let result = {};
    for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
      if ('value' in desc) {
        // value方式：递归处理
        Object.defineProperty(result, key, {
          ...desc,
          value: this.deepClone(desc.value),
        });
      } else {
        // get/set 方式：直接定义
        Object.defineProperty(result, key, desc);
      }
    }
    return result;
  }
  // 其他：原样返回
  return source;
};
/**
 * 深解包数据
 * @param data 值
 * @param isWrap 包装数据判断函数，如 vue3 的 isRef 函数
 * @param unwrap 解包方式函数，如 vue3 的 unref 函数
 * @returns {{[p: string]: *|{[p: string]: any}}|*|(*|{[p: string]: any})[]|{[p: string]: any}}
 */
Data.deepUnwrap = function(data, { isWrap = () => false, unwrap = val => val } = {}) {
  // 选项收集
  const options = { isWrap, unwrap };
  // 包装类型（如vue3响应式对象）数据解包
  if (isWrap(data)) {
    return this.deepUnwrap(unwrap(data), options);
  }
  // 递归处理的类型
  if (data instanceof Array) {
    return data.map(val => this.deepUnwrap(val, options));
  }
  if (this.getExactType(data) === Object) {
    return Object.fromEntries(Object.entries(data).map(([key, val]) => {
      return [key, this.deepUnwrap(val, options)];
    }));
  }
  // 其他原样返回
  return data;
};

// 辅助
const Support = Object.create(null);

/**
 * 属性名统一成数组格式
 * @param names 属性名。格式 'a,b,c' 或 ['a','b','c']
 * @param separator names 为字符串时的拆分规则。同 split 方法的 separator，字符串无需拆分的可以传 null 或 undefined
 * @returns {*[][]|(MagicString | Bundle | string)[]|FlatArray<(FlatArray<(*|[*[]]|[])[], 1>[]|*|[*[]]|[])[], 1>[]|*[]}
 */
Support.namesToArray = function(names = [], { separator = ',' } = {}) {
  if (names instanceof Array) {
    return names.map(val => this.namesToArray(val)).flat();
  }
  if (typeof names === 'string') {
    return names.split(separator).map(val => val.trim()).filter(val => val);
  }
  if (typeof names === 'symbol') {
    return [names];
  }
  return [];
};

/**
 * 绑定this。常用于解构函数时绑定 this 避免报错
 * @param target 目标对象
 * @param options 选项
 * @returns {*}
 */
Support.bindThis = function(target, options = {}) {
  return new Proxy(target, {
    get(target, p, receiver) {
      const value = Reflect.get(...arguments);
      // 函数类型绑定this
      if (value instanceof Function) {
        return value.bind(target);
      }
      // 其他属性原样返回
      return value;
    },
  });
};

// 对象

// extends Object 方式调用 super 将生成空对象，不会像普通构造函数那样创建一个新的对象，改实现
class _Object {
  /**
   * static
   */
  // static create [继承]
  // static fromEntries [继承]
  // static getPrototypeOf [继承]
  // static setPrototypeOf [继承]
  // static defineProperty [继承]
  // static defineProperties [继承]
  // static hasOwn [继承]
  // static getOwnPropertyDescriptor [继承]
  // static getOwnPropertyDescriptors [继承]
  // static getOwnPropertyNames [继承]
  // static getOwnPropertySymbols [继承]
  // static is [继承]
  // static preventExtensions [继承]
  // static isExtensible [继承]
  // static seal [继承]
  // static isSealed [继承]
  // static freeze [继承]
  // static isFrozen [继承]

  /**
   * [定制] 浅合并对象。写法同 Object.assign，通过重定义方式合并，解决 Object.assign 合并两边同名属性混有 value写法 和 get/set写法 时报 TypeError: Cannot set property b of #<Object> which has only a getter 的问题
   * @param target 目标对象
   * @param sources 数据源。一个或多个对象
   * @returns {{}}
   */
  static assign(target = {}, ...sources) {
    for (const source of sources) {
      // 不使用 target[key] = value 写法，直接使用 Object.defineProperty 重定义
      for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
        Object.defineProperty(target, key, desc);
      }
    }
    return target;
  }
  /**
   * [新增] 深合并对象。同 assign 一样也会对属性进行重定义
   * @param target 目标对象
   * @param sources 数据源
   * @returns {{}}
   */
  static deepAssign(target, ...sources) {
    if (!target) {
      return this.assign({}, ...sources);
    }
    for (const source of sources) {
      for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
        if ('value' in desc) {
          // value 写法：对象递归处理，其他直接定义
          if (Data.isPlainObject(desc.value)) {
            Object.defineProperty(target, key, {
              ...desc,
              value: this.deepAssign(target[key], desc.value),
            });
          } else {
            Object.defineProperty(target, key, desc);
          }
        } else {
          // get/set 写法：直接定义
          Object.defineProperty(target, key, desc);
        }
      }
    }
    return target;
  }

  /**
   * [定制] 获取属性名。默认参数配置成同 Object.keys 行为
   * @param object 对象
   * @param symbol 是否包含 symbol 属性
   * @param notEnumerable 是否包含不可列举属性
   * @param extend 是否包含承继属性
   * @returns {any[]}
   */
  static keys(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
    // 选项收集
    const options = { symbol, notEnumerable, extend };
    // set用于key去重
    let set = new Set();
    // 自身属性筛选
    const descs = Object.getOwnPropertyDescriptors(object);
    for (const [key, desc] of _Reflect.ownEntries(descs)) {
      // 忽略symbol属性的情况
      if (!symbol && typeof key === 'symbol') {
        continue;
      }
      // 忽略不可列举属性的情况
      if (!notEnumerable && !desc.enumerable) {
        continue;
      }
      // 其他属性加入
      set.add(key);
    }
    // 继承属性
    if (extend) {
      const __proto__ = Object.getPrototypeOf(object);
      if (__proto__ !== null) {
        const parentKeys = this.keys(__proto__, options);
        for (const parentKey of parentKeys) {
          set.add(parentKey);
        }
      }
    }
    // 返回数组
    return Array.from(set);
  }
  /**
   * [定制]
   */
  static values() {
  }
  /**
   * [定制]
   */
  static entries() {
  }

  /**
   * [新增] key自身所属的对象
   * @param object 对象
   * @param key 属性名
   * @returns {*|null}
   */
  static owner(object, key) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      return object;
    }
    let __proto__ = Object.getPrototypeOf(object);
    if (__proto__ === null) {
      return null;
    }
    return this.owner(__proto__, key);
  }
  /**
   * [新增] 获取属性描述对象，相比 Object.getOwnPropertyDescriptor，能拿到继承属性的描述对象
   * @param object
   * @param key
   * @returns {undefined|PropertyDescriptor}
   */
  static descriptor(object, key) {
    const findObject = this.owner(object, key);
    if (!findObject) {
      return undefined;
    }
    return Object.getOwnPropertyDescriptor(findObject, key);
  }
  /**
   * [新增] 对应 keys 获取 descriptors，传参同 keys 方法。可用于重定义属性
   * @param object 对象
   * @param symbol 是否包含 symbol 属性
   * @param notEnumerable 是否包含不可列举属性
   * @param extend 是否包含承继属性
   * @returns {(PropertyDescriptor|undefined)[]}
   */
  static descriptors(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
    // 选项收集
    const options = { symbol, notEnumerable, extend };
    const _keys = this.keys(object, options);
    return _keys.map(key => this.descriptor(object, key));
  }
  /**
   * [新增] 对应 keys 获取 descriptorEntries，传参同 keys 方法。可用于重定义属性
   * @param object 对象
   * @param symbol 是否包含 symbol 属性
   * @param notEnumerable 是否包含不可列举属性
   * @param extend 是否包含承继属性
   * @returns {[*,(PropertyDescriptor|undefined)][]}
   */
  static descriptorEntries(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
    // 选项收集
    const options = { symbol, notEnumerable, extend };
    const _keys = this.keys(object, options);
    return _keys.map(key => [key, this.descriptor(object, key)]);
  }

  /**
   * [新增] 过滤对象
   * @param object 对象
   * @param pick 挑选属性
   * @param omit 忽略属性
   * @param emptyPick pick 为空时的取值。all 全部key，empty 空
   * @param separator 同 namesToArray 的 separator 参数
   * @param symbol 同 keys 的 symbol 参数
   * @param notEnumerable 同 keys 的 notEnumerable 参数
   * @param extend 同 keys 的 extend 参数
   * @returns {{}}
   */
  static filter(object, { pick = [], omit = [], emptyPick = 'all', separator = ',', symbol = true, notEnumerable = false, extend = true } = {}) {
    let result = {};
    // pick、omit 统一成数组格式
    pick = Support.namesToArray(pick, { separator });
    omit = Support.namesToArray(omit, { separator });
    let _keys = [];
    // pick有值直接拿，为空时根据 emptyPick 默认拿空或全部key
    _keys = pick.length > 0 || emptyPick === 'empty' ? pick : this.keys(object, { symbol, notEnumerable, extend });
    // omit筛选
    _keys = _keys.filter(key => !omit.includes(key));
    for (const key of _keys) {
      const desc = this.descriptor(object, key);
      // 属性不存在导致desc得到undefined时不设置值
      if (desc) {
        Object.defineProperty(result, key, desc);
      }
    }
    return result;
  }
  /**
   * [新增] 通过挑选方式选取对象。filter 的简写方式
   * @param object 对象
   * @param keys 属性名集合
   * @param options 选项，同 filter 的各选项值
   * @returns {{}}
   */
  static pick(object, keys = [], options = {}) {
    return this.filter(object, { pick: keys, emptyPick: 'empty', ...options });
  }
  /**
   * [新增] 通过排除方式选取对象。filter 的简写方式
   * @param object 对象
   * @param keys 属性名集合
   * @param options 选项，同 filter 的各选项值
   * @returns {{}}
   */
  static omit(object, keys = [], options = {}) {
    return this.filter(object, { omit: keys, ...options });
  }

  /**
   * constructor
   */
  constructor(value = {}) {
    this.constructor.assign(this, value);
  }

  // __proto__ [继承]
  // __defineGetter__ [继承]
  // __defineSetter__ [继承]
  // __lookupGetter__ [继承]
  // __lookupSetter__ [继承]
  // isPrototypeOf [继承]
  // hasOwnProperty [继承]
  // propertyIsEnumerable [继承]

  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // [新增]
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  // [新增]
  toNumber() {
    return NaN;
  }
  // [定制]
  toString() {
    try {
      return JSON.stringify(this);
    } catch (e) {
      return JSON.stringify({});
    }
  }
  // toLocaleString [继承]
  // [新增]
  toBoolean() {
    return Object.keys(this).length > 0;
  }
  // [新增]
  toJSON() {
    return this;
  }
  // valueOf [继承]
}
Object.setPrototypeOf(_Object, Object);

class _String extends String {
  /**
   * Static
   */
  // static fromCharCode [继承]
  // static fromCodePoint [继承]
  // static raw [继承]

  /**
   * [新增] 首字母大写
   * @param name
   * @returns {string}
   */
  static toFirstUpperCase(name = '') {
    return `${(name[0] ?? '').toUpperCase()}${name.slice(1)}`;
  }
  /**
   * [新增] 首字母小写
   * @param name 名称
   * @returns {string}
   */
  static toFirstLowerCase(name = '') {
    return `${(name[0] ?? '').toLowerCase()}${name.slice(1)}`;
  }
  /**
   * [新增] 转驼峰命名。常用于连接符命名转驼峰命名，如 xx-name -> xxName
   * @param name 名称
   * @param separator 连接符。用于生成正则 默认为中划线 - 对应regexp得到 /-(\w)/g
   * @param first 首字母处理方式。true 或 'uppercase'：转换成大写;
   *                           false 或 'lowercase'：转换成小写;
   *                           'raw' 或 其他无效值：默认原样返回，不进行处理;
   * @returns {MagicString|string|string}
   */
  static toCamelCase(name, { separator = '-', first = 'raw' } = {}) {
    // 生成正则
    const regexp = new RegExp(`${separator}(\\w)`, 'g');
    // 拼接成驼峰
    const camelName = name.replaceAll(regexp, (substr, $1) => {
      return $1.toUpperCase();
    });
    // 首字母大小写根据传参判断
    if ([true, 'uppercase'].includes(first)) {
      return this.toFirstUpperCase(camelName);
    }
    if ([false, 'lowercase'].includes(first)) {
      return this.toFirstLowerCase(camelName);
    }
    return camelName;
  }
  /**
   * [新增] 转连接符命名。常用于驼峰命名转连接符命名，如 xxName -> xx-name
   * @param name 名称
   * @param separator 连接符
   * @returns {string}
   */
  static toLineCase(name = '', { separator = '-' } = {}) {
    return name
    // 按连接符拼接
      .replaceAll(/([a-z])([A-Z])/g, `$1${separator}$2`)
    // 转小写
      .toLowerCase();
  }

  /**
   * constructor
   */
  constructor(value) {
    super(value);
  }

  // anchor 继承
  // big 继承
  // blink 继承
  // bold 继承
  // fixed 继承
  // fontcolor 继承
  // fontsize 继承
  // italics 继承
  // link 继承
  // small 继承
  // strike 继承
  // sub 继承
  // sup 继承

  // [Symbol.iterator] 继承
  // length 继承
  // split 继承
  // match 继承
  // matchAll 继承

  // at 继承
  // charAt 继承
  // charCodeAt 继承
  // codePointAt 继承
  // indexOf 继承
  // lastIndexOf 继承
  // search 继承
  // includes 继承
  // startsWith 继承
  // endsWith 继承

  // slice 继承
  // substring 继承
  // substr 继承
  // concat 继承
  // trim 继承
  // trimStart 继承
  // trimEnd 继承
  // trimLeft 继承
  // trimRight 继承
  // padStart 继承
  // padEnd 继承
  // repeat 继承
  // replace 继承
  // replaceAll 继承
  // toLowerCase 继承
  // toUpperCase 继承
  // toLocaleLowerCase 继承
  // toLocaleUpperCase 继承
  // localeCompare 继承
  // normalize 继承
  // isWellFormed 继承
  // toWellFormed 继承

  // toString 继承
  // valueOf 继承
}

// 样式处理
const Style = Object.create(null);

/**
 * 单位字符串。对数字或数字格式的字符串自动拼单位，其他字符串原样返回
 * @param value 值
 * @param unit 单位。value没带单位时自动拼接，可传 px/em/% 等
 * @returns {string|string}
 */
Style.getUnitString = function(value = '', { unit = 'px' } = {}) {
  if (value === '') {
    return '';
  }
  // 注意：这里使用 == 判断，不使用 ===
  return Number(value) == value ? `${value}${unit}` : String(value);
};

// vue 数据处理

const VueData = Object.create(null);

/**
   * 深解包 vue3 响应式对象数据
   * @param data
   * @returns {{[p: string]: *|{[p: string]: *}}|*|(*|{[p: string]: *})[]|{[p: string]: *}}
   */
VueData.deepUnwrapVue3 = function(data) {
  return Data.deepUnwrap(data, {
    isWrap: data => data?.__v_isRef,
    unwrap: data => data.value,
  });
};

/**
   * 从 attrs 中提取 props 定义的属性
   * @param attrs vue attrs
   * @param propDefinitions props 定义，如 ElButton.props 等
   * @returns {{}}
   */
VueData.getPropsFromAttrs = function(attrs, propDefinitions) {
  // props 定义统一成对象格式，type 统一成数组格式以便后续判断
  if (propDefinitions instanceof Array) {
    propDefinitions = Object.fromEntries(propDefinitions.map(name => [_String.toCamelCase(name), { type: [] }]));
  } else if (Data.isPlainObject(propDefinitions)) {
    propDefinitions = Object.fromEntries(Object.entries(propDefinitions).map(([name, definition]) => {
      definition = Data.isPlainObject(definition)
        ? { ...definition, type: [definition.type].flat() }
        : { type: [definition].flat() };
      return [_String.toCamelCase(name), definition];
    }));
  } else {
    propDefinitions = {};
  }
  // 设置值
  let result = {};
  for (const [name, definition] of Object.entries(propDefinitions)) {
    (function setResult({ name, definition, end = false }) {
      // propName 或 prop-name 格式递归进来
      if (name in attrs) {
        const attrValue = attrs[name];
        const camelName = _String.toCamelCase(name);
        // 只包含Boolean类型的''转换为true，其他原样赋值
        result[camelName] = definition.type.length === 1 && definition.type.includes(Boolean) && attrValue === '' ? true : attrValue;
        return;
      }
      // prop-name 格式进递归
      if (end) {
        return;
      }
      setResult({ name: _String.toLineCase(name), definition, end: true });
    })({
      name, definition,
    });
  }
  return result;
};
/**
   * 从 attrs 中提取 emits 定义的属性
   * @param attrs vue attrs
   * @param emitDefinitions emits 定义，如 ElButton.emits 等
   * @returns {{}}
   */
VueData.getEmitsFromAttrs = function(attrs, emitDefinitions) {
  // emits 定义统一成数组格式
  if (Data.isPlainObject(emitDefinitions)) {
    emitDefinitions = Object.keys(emitDefinitions);
  } else if (!(emitDefinitions instanceof Array)) {
    emitDefinitions = [];
  }
  // 统一处理成 onEmitName、onUpdate:emitName(v-model系列) 格式
  const emitNames = emitDefinitions.map(name => _String.toCamelCase(`on-${name}`));
  // 设置值
  let result = {};
  for (const name of emitNames) {
    (function setResult({ name, end = false }) {
      if (name.startsWith('onUpdate:')) {
        // onUpdate:emitName 或 onUpdate:emit-name 格式递归进来
        if (name in attrs) {
          const camelName = _String.toCamelCase(name);
          result[camelName] = attrs[name];
          return;
        }
        // onUpdate:emit-name 格式进递归
        if (end) {
          return;
        }
        setResult({ name: `onUpdate:${_String.toLineCase(name.slice(name.indexOf(':') + 1))}`, end: true });
      }
      // onEmitName格式，中划线格式已被vue转换不用重复处理
      if (name in attrs) {
        result[name] = attrs[name];
      }
    })({ name });
  }
  // console.log('result', result);
  return result;
};
/**
   * 从 attrs 中提取剩余属性。常用于组件 inheritAttrs 设置 false 时使用作为新的 attrs
   * @param attrs vue attrs
   * @param props props 定义 或 vue props，如 ElButton.props 等
   * @param emits emits 定义 或 vue emits，如 ElButton.emits 等
   * @param list 额外的普通属性
   * @returns {{}}
   */
VueData.getRestFromAttrs = function(attrs, { props, emits, list = [] } = {}) {
  // 统一成数组格式
  props = (() => {
    const arr = (() => {
      if (props instanceof Array) {
        return props;
      }
      if (Data.isPlainObject(props)) {
        return Object.keys(props);
      }
      return [];
    })();
    return arr.map(name => [_String.toCamelCase(name), _String.toLineCase(name)]).flat();
  })();
  emits = (() => {
    const arr = (() => {
      if (emits instanceof Array) {
        return emits;
      }
      if (Data.isPlainObject(emits)) {
        return Object.keys(emits);
      }
      return [];
    })();
    return arr.map((name) => {
      // update:emitName 或 update:emit-name 格式
      if (name.startsWith('update:')) {
        const partName = name.slice(name.indexOf(':') + 1);
        return [`onUpdate:${_String.toCamelCase(partName)}`, `onUpdate:${_String.toLineCase(partName)}`];
      }
      // onEmitName格式，中划线格式已被vue转换不用重复处理
      return [_String.toCamelCase(`on-${name}`)];
    }).flat();
  })();
  list = (() => {
    const arr = typeof list === 'string'
      ? list.split(',')
      : list instanceof Array ? list : [];
    return arr.map(val => val.trim()).filter(val => val);
  })();
  const listAll = Array.from(new Set([props, emits, list].flat()));
  // console.log('listAll', listAll);
  // 设置值
  let result = {};
  for (const [name, desc] of Object.entries(Object.getOwnPropertyDescriptors(attrs))) {
    if (!listAll.includes(name)) {
      Object.defineProperty(result, name, desc);
    }
  }
  // console.log('result', result);
  return result;
};

// 基础模块。有同名原生对象的加 _ 区分

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Data: Data,
  Style: Style,
  Support: Support,
  VueData: VueData,
  _Array: _Array,
  _Date: _Date,
  _Math: _Math,
  _Number: _Number,
  _Object: _Object,
  _Reflect: _Reflect,
  _Set: _Set,
  _String: _String
});

/**
 * eslint 配置：http://eslint.cn/docs/rules/
 * eslint-plugin-vue 配置：https://eslint.vuejs.org/rules/
 */

/**
 * 导出常量便捷使用
 */
const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';
/**
 * 定制的配置
 */
// 基础定制
const baseConfig$1 = {
  // 环境。一个环境定义了一组预定义的全局变量
  env: {
    browser: true,
    node: true,
  },
  // 全局变量
  globals: {
    globalThis: 'readonly',
    BigInt: 'readonly',
  },
  // 解析器
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  /**
   * 继承
   * 使用eslint的规则：eslint:配置名称
   * 使用插件的配置：plugin:包名简写/配置名称
   */
  extends: [
    // 使用 eslint 推荐的规则
    'eslint:recommended',
  ],
  /**
   * 规则
   * 来自 eslint 的规则：规则ID : value
   * 来自插件的规则：包名简写/规则ID : value
   */
  rules: {
    /**
     * Possible Errors
     * 这些规则与 JavaScript 代码中可能的错误或逻辑错误有关：
     */
    'getter-return': OFF, // 强制 getter 函数中出现 return 语句
    'no-constant-condition': OFF, // 禁止在条件中使用常量表达式
    'no-empty': OFF, // 禁止出现空语句块
    'no-extra-semi': WARN, // 禁止不必要的分号
    'no-func-assign': OFF, // 禁止对 function 声明重新赋值
    'no-prototype-builtins': OFF, // 禁止直接调用 Object.prototypes 的内置属性

    /**
     * Best Practices
     * 这些规则是关于最佳实践的，帮助你避免一些问题：
     */
    'accessor-pairs': ERROR, // 强制 getter 和 setter 在对象中成对出现
    'array-callback-return': WARN, // 强制数组方法的回调函数中有 return 语句
    'block-scoped-var': ERROR, // 强制把变量的使用限制在其定义的作用域范围内
    'curly': WARN, // 强制所有控制语句使用一致的括号风格
    'no-fallthrough': WARN, // 禁止 case 语句落空
    'no-floating-decimal': ERROR, // 禁止数字字面量中使用前导和末尾小数点
    'no-multi-spaces': WARN, // 禁止使用多个空格
    'no-new-wrappers': ERROR, // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-proto': ERROR, // 禁用 __proto__ 属性
    'no-return-assign': WARN, // 禁止在 return 语句中使用赋值语句
    'no-useless-escape': WARN, // 禁用不必要的转义字符

    /**
     * Variables
     * 这些规则与变量声明有关：
     */
    'no-undef-init': WARN, // 禁止将变量初始化为 undefined
    'no-unused-vars': OFF, // 禁止出现未使用过的变量
    'no-use-before-define': [ERROR, { 'functions': false, 'classes': false, 'variables': false }], // 禁止在变量定义之前使用它们

    /**
     * Stylistic Issues
     * 这些规则是关于风格指南的，而且是非常主观的：
     */
    'array-bracket-spacing': WARN, // 强制数组方括号中使用一致的空格
    'block-spacing': WARN, // 禁止或强制在代码块中开括号前和闭括号后有空格
    'brace-style': [WARN, '1tbs', { 'allowSingleLine': true }], // 强制在代码块中使用一致的大括号风格
    'comma-dangle': [WARN, 'always-multiline'], // 要求或禁止末尾逗号
    'comma-spacing': WARN, // 强制在逗号前后使用一致的空格
    'comma-style': WARN, // 强制使用一致的逗号风格
    'computed-property-spacing': WARN, // 强制在计算的属性的方括号中使用一致的空格
    'func-call-spacing': WARN, // 要求或禁止在函数标识符和其调用之间有空格
    'function-paren-newline': WARN, // 强制在函数括号内使用一致的换行
    'implicit-arrow-linebreak': WARN, // 强制隐式返回的箭头函数体的位置
    'indent': [WARN, 2, { 'SwitchCase': 1 }], // 强制使用一致的缩进
    'jsx-quotes': WARN, // 强制在 JSX 属性中一致地使用双引号或单引号
    'key-spacing': WARN, // 强制在对象字面量的属性中键和值之间使用一致的间距
    'keyword-spacing': WARN, // 强制在关键字前后使用一致的空格
    'new-parens': WARN, // 强制或禁止调用无参构造函数时有圆括号
    'no-mixed-spaces-and-tabs': WARN,
    'no-multiple-empty-lines': [WARN, { 'max': 1, 'maxEOF': 0, 'maxBOF': 0 }], // 禁止出现多行空行
    'no-trailing-spaces': WARN, // 禁用行尾空格
    'no-whitespace-before-property': WARN, // 禁止属性前有空白
    'nonblock-statement-body-position': WARN, // 强制单个语句的位置
    'object-curly-newline': [WARN, { 'multiline': true, 'consistent': true }], // 强制大括号内换行符的一致性
    'object-curly-spacing': [WARN, 'always'], // 强制在大括号中使用一致的空格
    'padded-blocks': [WARN, 'never'], // 要求或禁止块内填充
    'quotes': [WARN, 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }], // 强制使用一致的反勾号、双引号或单引号
    'semi': WARN, // 要求或禁止使用分号代替 ASI
    'semi-spacing': WARN, // 强制分号之前和之后使用一致的空格
    'semi-style': WARN, // 强制分号的位置
    'space-before-blocks': WARN, // 强制在块之前使用一致的空格
    'space-before-function-paren': [WARN, { 'anonymous': 'never', 'named': 'never', 'asyncArrow': 'always' }], // 强制在 function的左括号之前使用一致的空格
    'space-in-parens': WARN, // 强制在圆括号内使用一致的空格
    'space-infix-ops': WARN, // 要求操作符周围有空格
    'space-unary-ops': WARN, // 强制在一元操作符前后使用一致的空格
    'spaced-comment': WARN, // 强制在注释中 // 或 /* 使用一致的空格
    'switch-colon-spacing': WARN, // 强制在 switch 的冒号左右有空格
    'template-tag-spacing': WARN, // 要求或禁止在模板标记和它们的字面量之间的空格

    /**
     * ECMAScript 6
     * 这些规则只与 ES6 有关, 即通常所说的 ES2015：
     */
    'arrow-spacing': WARN, // 强制箭头函数的箭头前后使用一致的空格
    'generator-star-spacing': [WARN, { 'before': false, 'after': true, 'method': { 'before': true, 'after': false } }], // 强制 generator 函数中 * 号周围使用一致的空格
    'no-useless-rename': WARN, // 禁止在 import 和 export 和解构赋值时将引用重命名为相同的名字
    'prefer-template': WARN, // 要求使用模板字面量而非字符串连接
    'rest-spread-spacing': WARN, // 强制剩余和扩展运算符及其表达式之间有空格
    'template-curly-spacing': WARN, // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
    'yield-star-spacing': WARN, // 强制在 yield* 表达式中 * 周围使用空格
  },
  // 覆盖
  overrides: [],
};
// vue2/vue3 共用
const vueCommonConfig = {
  rules: {
    // Priority A: Essential
    'vue/multi-word-component-names': OFF, // 要求组件名称始终为多字
    'vue/no-unused-components': WARN, // 未使用的组件
    'vue/no-unused-vars': OFF, // 未使用的变量
    'vue/require-render-return': WARN, // 强制渲染函数总是返回值
    'vue/require-v-for-key': OFF, // v-for中必须使用key
    'vue/return-in-computed-property': WARN, // 强制返回语句存在于计算属性中
    'vue/valid-template-root': OFF, // 强制有效的模板根
    'vue/valid-v-for': OFF, // 强制有效的v-for指令
    // Priority B: Strongly Recommended
    'vue/attribute-hyphenation': OFF, // 强制属性名格式
    'vue/component-definition-name-casing': OFF, // 强制组件name格式
    'vue/html-quotes': [WARN, 'double', { 'avoidEscape': true }], // 强制 HTML 属性的引号样式
    'vue/html-self-closing': OFF, // 使用自闭合标签
    'vue/max-attributes-per-line': [WARN, { 'singleline': Infinity, 'multiline': 1 }], // 强制每行包含的最大属性数
    'vue/multiline-html-element-content-newline': OFF, // 需要在多行元素的内容前后换行
    'vue/prop-name-casing': OFF, // 为 Vue 组件中的 Prop 名称强制执行特定大小写
    'vue/require-default-prop': OFF, // props需要默认值
    'vue/singleline-html-element-content-newline': OFF, // 需要在单行元素的内容前后换行
    'vue/v-bind-style': OFF, // 强制v-bind指令风格
    'vue/v-on-style': OFF, // 强制v-on指令风格
    'vue/v-slot-style': OFF, // 强制v-slot指令风格
    // Priority C: Recommended
    'vue/no-v-html': OFF, // 禁止使用v-html
    // Uncategorized
    'vue/block-tag-newline': WARN, //  在打开块级标记之后和关闭块级标记之前强制换行
    'vue/html-comment-content-spacing': WARN, // 在HTML注释中强制统一的空格
    'vue/script-indent': [WARN, 2, { 'baseIndent': 1, 'switchCase': 1 }], // 在<script>中强制一致的缩进
    // Extension Rules。对应eslint的同名规则，适用于<template>中的表达式
    'vue/array-bracket-spacing': WARN,
    'vue/block-spacing': WARN,
    'vue/brace-style': [WARN, '1tbs', { 'allowSingleLine': true }],
    'vue/comma-dangle': [WARN, 'always-multiline'],
    'vue/comma-spacing': WARN,
    'vue/comma-style': WARN,
    'vue/func-call-spacing': WARN,
    'vue/key-spacing': WARN,
    'vue/keyword-spacing': WARN,
    'vue/object-curly-newline': [WARN, { 'multiline': true, 'consistent': true }],
    'vue/object-curly-spacing': [WARN, 'always'],
    'vue/space-in-parens': WARN,
    'vue/space-infix-ops': WARN,
    'vue/space-unary-ops': WARN,
    'vue/arrow-spacing': WARN,
    'vue/prefer-template': WARN,
  },
  overrides: [
    {
      'files': ['*.vue'],
      'rules': {
        'indent': OFF,
      },
    },
  ],
};
// vue2用
const vue2Config = merge(vueCommonConfig, {
  extends: [
    // 使用 vue2 推荐的规则
    'plugin:vue/recommended',
  ],
});
// vue3用
const vue3Config = merge(vueCommonConfig, {
  env: {
    'vue/setup-compiler-macros': true, // 处理setup模板中像 defineProps 和 defineEmits 这样的编译器宏报 no-undef 的问题：https://eslint.vuejs.org/user-guide/#compiler-macros-such-as-defineprops-and-defineemits-generate-no-undef-warnings
  },
  extends: [
    // 使用 vue3 推荐的规则
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    // Priority A: Essential
    'vue/no-template-key': OFF, // 禁止<template>中使用key属性
    // Priority A: Essential for Vue.js 3.x
    'vue/return-in-emits-validator': WARN, // 强制在emits验证器中存在返回语句
    // Priority B: Strongly Recommended for Vue.js 3.x
    'vue/require-explicit-emits': OFF, // 需要emits中定义选项用于$emit()
    'vue/v-on-event-hyphenation': OFF, // 在模板中的自定义组件上强制执行 v-on 事件命名样式
  },
});
function merge(...objects) {
  const [target, ...sources] = objects;
  const result = Data.deepClone(target);
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      // 特殊字段处理
      if (key === 'rules') {
        // console.log({ key, value, 'result[key]': result[key] });
        // 初始不存在时赋默认值用于合并
        result[key] = result[key] ?? {};
        // 对各条规则处理
        for (let [ruleKey, ruleValue] of Object.entries(value)) {
          // 已有值统一成数组处理
          let sourceRuleValue = result[key][ruleKey] ?? [];
          if (!(sourceRuleValue instanceof Array)) {
            sourceRuleValue = [sourceRuleValue];
          }
          // 要合并的值统一成数组处理
          if (!(ruleValue instanceof Array)) {
            ruleValue = [ruleValue];
          }
          // 统一格式后进行数组循环操作
          for (const [valIndex, val] of Object.entries(ruleValue)) {
            // 对象深合并，其他直接赋值
            if (Data.getExactType(val) === Object) {
              sourceRuleValue[valIndex] = _Object.deepAssign(sourceRuleValue[valIndex] ?? {}, val);
            } else {
              sourceRuleValue[valIndex] = val;
            }
          }
          // 赋值规则结果
          result[key][ruleKey] = sourceRuleValue;
        }
        continue;
      }
      // 其他字段根据类型判断处理
      // 数组：拼接
      if (value instanceof Array) {
        (result[key] = result[key] ?? []).push(...value);
        continue;
      }
      // 其他对象：深合并
      if (Data.getExactType(value) === Object) {
        _Object.deepAssign(result[key] = result[key] ?? {}, value);
        continue;
      }
      // 其他直接赋值
      result[key] = value;
    }
  }
  return result;
}
/**
 * 使用定制的配置
 * @param {}：配置项
 *          base：使用基础eslint定制，默认 true
 *          vueVersion：vue版本，开启后需要安装 eslint-plugin-vue
 * @returns {{}}
 */
function use({ base = true, vueVersion } = {}) {
  let result = {};
  if (base) {
    result = merge(result, baseConfig$1);
  }
  if (vueVersion == 2) {
    result = merge(result, vue2Config);
  } else if (vueVersion == 3) {
    result = merge(result, vue3Config);
  }
  return result;
}

var eslint = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ERROR: ERROR,
  OFF: OFF,
  WARN: WARN,
  baseConfig: baseConfig$1,
  merge: merge,
  use: use,
  vue2Config: vue2Config,
  vue3Config: vue3Config,
  vueCommonConfig: vueCommonConfig
});

// 基础定制
const baseConfig = {
  base: './',
  server: {
    host: '0.0.0.0',
    fs: {
      strict: false,
    },
  },
  resolve: {
    // 别名
    alias: {
      // '@root': resolve(__dirname),
      // '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // 规定触发警告的 chunk 大小。（以 kbs 为单位）
    chunkSizeWarningLimit: 2 ** 10,
    // 自定义底层的 Rollup 打包配置。
    rollupOptions: {
      output: {
        // 入口文件名
        entryFileNames(chunkInfo) {
          return `assets/entry-${chunkInfo.type}-[name].js`;
        },
        // 块文件名
        chunkFileNames(chunkInfo) {
          return `assets/${chunkInfo.type}-[name].js`;
        },
        // 资源文件名，css、图片等
        assetFileNames(chunkInfo) {
          return `assets/${chunkInfo.type}-[name].[ext]`;
        },
      },
    },
  },
};

var vite = /*#__PURE__*/Object.freeze({
  __proto__: null,
  baseConfig: baseConfig
});

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  eslint: eslint,
  vite: vite
});

// 请求方法
const METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];
// http 状态码
const STATUSES = [
  { 'status': 100, 'statusText': 'Continue' },
  { 'status': 101, 'statusText': 'Switching Protocols' },
  { 'status': 102, 'statusText': 'Processing' },
  { 'status': 103, 'statusText': 'Early Hints' },
  { 'status': 200, 'statusText': 'OK' },
  { 'status': 201, 'statusText': 'Created' },
  { 'status': 202, 'statusText': 'Accepted' },
  { 'status': 203, 'statusText': 'Non-Authoritative Information' },
  { 'status': 204, 'statusText': 'No Content' },
  { 'status': 205, 'statusText': 'Reset Content' },
  { 'status': 206, 'statusText': 'Partial Content' },
  { 'status': 207, 'statusText': 'Multi-Status' },
  { 'status': 208, 'statusText': 'Already Reported' },
  { 'status': 226, 'statusText': 'IM Used' },
  { 'status': 300, 'statusText': 'Multiple Choices' },
  { 'status': 301, 'statusText': 'Moved Permanently' },
  { 'status': 302, 'statusText': 'Found' },
  { 'status': 303, 'statusText': 'See Other' },
  { 'status': 304, 'statusText': 'Not Modified' },
  { 'status': 305, 'statusText': 'Use Proxy' },
  { 'status': 307, 'statusText': 'Temporary Redirect' },
  { 'status': 308, 'statusText': 'Permanent Redirect' },
  { 'status': 400, 'statusText': 'Bad Request' },
  { 'status': 401, 'statusText': 'Unauthorized' },
  { 'status': 402, 'statusText': 'Payment Required' },
  { 'status': 403, 'statusText': 'Forbidden' },
  { 'status': 404, 'statusText': 'Not Found' },
  { 'status': 405, 'statusText': 'Method Not Allowed' },
  { 'status': 406, 'statusText': 'Not Acceptable' },
  { 'status': 407, 'statusText': 'Proxy Authentication Required' },
  { 'status': 408, 'statusText': 'Request Timeout' },
  { 'status': 409, 'statusText': 'Conflict' },
  { 'status': 410, 'statusText': 'Gone' },
  { 'status': 411, 'statusText': 'Length Required' },
  { 'status': 412, 'statusText': 'Precondition Failed' },
  { 'status': 413, 'statusText': 'Payload Too Large' },
  { 'status': 414, 'statusText': 'URI Too Long' },
  { 'status': 415, 'statusText': 'Unsupported Media Type' },
  { 'status': 416, 'statusText': 'Range Not Satisfiable' },
  { 'status': 417, 'statusText': 'Expectation Failed' },
  { 'status': 418, 'statusText': 'I\'m a Teapot' },
  { 'status': 421, 'statusText': 'Misdirected Request' },
  { 'status': 422, 'statusText': 'Unprocessable Entity' },
  { 'status': 423, 'statusText': 'Locked' },
  { 'status': 424, 'statusText': 'Failed Dependency' },
  { 'status': 425, 'statusText': 'Too Early' },
  { 'status': 426, 'statusText': 'Upgrade Required' },
  { 'status': 428, 'statusText': 'Precondition Required' },
  { 'status': 429, 'statusText': 'Too Many Requests' },
  { 'status': 431, 'statusText': 'Request Header Fields Too Large' },
  { 'status': 451, 'statusText': 'Unavailable For Legal Reasons' },
  { 'status': 500, 'statusText': 'Internal Server Error' },
  { 'status': 501, 'statusText': 'Not Implemented' },
  { 'status': 502, 'statusText': 'Bad Gateway' },
  { 'status': 503, 'statusText': 'Service Unavailable' },
  { 'status': 504, 'statusText': 'Gateway Timeout' },
  { 'status': 505, 'statusText': 'HTTP Version Not Supported' },
  { 'status': 506, 'statusText': 'Variant Also Negotiates' },
  { 'status': 507, 'statusText': 'Insufficient Storage' },
  { 'status': 508, 'statusText': 'Loop Detected' },
  { 'status': 509, 'statusText': 'Bandwidth Limit Exceeded' },
  { 'status': 510, 'statusText': 'Not Extended' },
  { 'status': 511, 'statusText': 'Network Authentication Required' },
];

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  METHODS: METHODS,
  STATUSES: STATUSES
});

const nodeClipboardy = require('node-clipboardy');

const clipboard = {
// 对应浏览器端同名方法，减少代码修改
  /**
   * 写入文本(复制)
   * @param text
   * @returns {Promise<void>}
   */
  async writeText(text) {
    // 转换成字符串防止 clipboardy 报类型错误
    const textResult = String(text);
    return await nodeClipboardy.write(textResult);
  },
  /**
   * 读取文本(粘贴)
   * @returns {Promise<string>}
   */
  async readText() {
    return await nodeClipboardy.read();
  },
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  clipboard: clipboard,
  nodeClipboardy: nodeClipboardy
});

exports.base = index$3;
exports.dev = index$2;
exports.network = index$1;
exports.storage = index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL19TZXQuanMiLCIuLi8uLi9zcmMvYmFzZS9fQXJyYXkuanMiLCIuLi8uLi9zcmMvYmFzZS9fRGF0ZS5qcyIsIi4uLy4uL3NyYy9iYXNlL19NYXRoLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX051bWJlci5qcyIsIi4uLy4uL3NyYy9iYXNlL19SZWZsZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvRGF0YS5qcyIsIi4uLy4uL3NyYy9iYXNlL1N1cHBvcnQuanMiLCIuLi8uLi9zcmMvYmFzZS9fT2JqZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1N0cmluZy5qcyIsIi4uLy4uL3NyYy9iYXNlL1N0eWxlLmpzIiwiLi4vLi4vc3JjL2Jhc2UvVnVlRGF0YS5qcyIsIi4uLy4uL3NyYy9iYXNlL2luZGV4LmpzIiwiLi4vLi4vc3JjL2Rldi9lc2xpbnQuanMiLCIuLi8uLi9zcmMvZGV2L3ZpdGUuanMiLCIuLi8uLi9zcmMvbmV0d29yay9zaGFyZWQuanMiLCIuLi8uLi9zcmMvc3RvcmFnZS9ub2RlL2NsaXBib2FyZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDpm4blkIhcbmltcG9ydCB7IF9BcnJheSB9IGZyb20gJy4vX0FycmF5JztcblxuZXhwb3J0IGNsYXNzIF9TZXQgZXh0ZW5kcyBTZXQge1xuICAvKipcbiAgICogW+aWsOWinl0g5Lqk6ZuGXG4gICAqIEBwYXJhbSBzZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIGludGVyc2VjdGlvbiguLi5zZXRzKSB7XG4gICAgLy8g5Lyg5Y+C5pWw6YePXG4gICAgaWYgKHNldHMubGVuZ3RoIDwgMikge1xuICAgICAgc2V0c1swXSA9IHNldHNbMF0gfHwgW107XG4gICAgICBzZXRzWzFdID0gc2V0c1sxXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgc2V0cyA9IG5ldyBfQXJyYXkoc2V0cykubWFwKHNldCA9PiBuZXcgX0FycmF5KHNldCkpO1xuXG4gICAgY29uc3QgW2ZpcnN0LCAuLi5vdGhlcnNdID0gc2V0cztcbiAgICByZXR1cm4gZmlyc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIG90aGVycy5ldmVyeShzZXQgPT4gc2V0LmluY2x1ZGVzKHZhbHVlKSk7XG4gICAgfSkudG9fU2V0KCk7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOW5tumbhlxuICAgKiBAcGFyYW0gc2V0c1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyB1bmlvbiguLi5zZXRzKSB7XG4gICAgLy8g5Lyg5Y+C5pWw6YePXG4gICAgaWYgKHNldHMubGVuZ3RoIDwgMikge1xuICAgICAgc2V0c1swXSA9IHNldHNbMF0gfHwgW107XG4gICAgICBzZXRzWzFdID0gc2V0c1sxXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgc2V0cyA9IG5ldyBfQXJyYXkoc2V0cykubWFwKHNldCA9PiBuZXcgX0FycmF5KHNldCkpO1xuXG4gICAgcmV0dXJuIHNldHMuZmxhdCgpLnRvX1NldCgpO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDooaXpm4ZcbiAgICogQHBhcmFtIG1haW5TZXRcbiAgICogQHBhcmFtIG90aGVyU2V0c1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyBjb21wbGVtZW50KG1haW5TZXQgPSBbXSwgLi4ub3RoZXJTZXRzKSB7XG4gICAgLy8g5Lyg5Y+C5pWw6YePXG4gICAgaWYgKG90aGVyU2V0cy5sZW5ndGggPCAxKSB7XG4gICAgICBvdGhlclNldHNbMF0gPSBvdGhlclNldHNbMF0gfHwgW107XG4gICAgfVxuICAgIC8vIOe7n+S4gOexu+Wei+WkhOeQhlxuICAgIG1haW5TZXQgPSBuZXcgX0FycmF5KG1haW5TZXQpO1xuICAgIG90aGVyU2V0cyA9IG5ldyBfQXJyYXkob3RoZXJTZXRzKS5tYXAoYXJnID0+IG5ldyBfQXJyYXkoYXJnKSk7XG4gICAgcmV0dXJuIG1haW5TZXQuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIG90aGVyU2V0cy5ldmVyeShzZXQgPT4gIXNldC5pbmNsdWRlcyh2YWx1ZSkpO1xuICAgIH0pLnRvX1NldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IFtdKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ19TZXQgY29uc3RydWN0b3InLCB2YWx1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gbmV3IFNldCh2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCfkvKDlj4LmiqXplJnvvIzlsIbnlJ/miJDnqbrpm4blkIgnLCBlKTtcbiAgICAgIHZhbHVlID0gbmV3IFNldChbXSk7XG4gICAgfVxuICAgIHN1cGVyKHZhbHVlKTtcblxuICAgIC8vIHNpemUgW+e7p+aJv11cbiAgfVxuXG4gIC8vIOaWueazleWumuWItu+8muWOn+Wei+WQjOWQjeaWueazlSvmlrDlop7mlrnms5XjgILpg6jliIblrprliLbmiJDov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgLyoqXG4gICAqIOS/ruaUuVxuICAgKi9cbiAgLy8gW+WumuWItl1cbiAgYWRkKC4uLnZhbHVlcykge1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBTZXQucHJvdG90eXBlLmFkZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICBkZWxldGUoLi4udmFsdWVzKSB7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIFNldC5wcm90b3R5cGUuZGVsZXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIGNsZWFyKCkge1xuICAgIFNldC5wcm90b3R5cGUuY2xlYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDpgY3ljoZcbiAgICovXG4gIC8vIFN5bWJvbC5pdGVyYXRvciBb57un5om/XVxuICAvLyBrZXlzIFvnu6fmib9dXG4gIC8vIHZhbHVlcyBb57un5om/XVxuICAvLyBlbnRyaWVzIFvnu6fmib9dXG4gIC8vIFvlrprliLZdXG4gIGZvckVhY2goKSB7XG4gICAgU2V0LnByb3RvdHlwZS5mb3JFYWNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog5p+l5om+XG4gICAqL1xuICAvLyBoYXMgW+e7p+aJv11cblxuICAvKipcbiAgICog55Sf5oiQXG4gICAqL1xuICAvLyDnm7TmjqXpgJrov4cgdG9fQXJyYXkg5ZKMIHRvX1NldCDovazmjaLmk43kvZzljbPlj6/vvIzml6DpnIDph43lpI3lrprliLZcblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyBb5paw5aKeXVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYHske3RoaXMudG9BcnJheSgpLmpvaW4oJywnKX19YDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gJ3t9JztcbiAgICB9XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9Cb29sZWFuKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnNpemUgPiAwO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy50b0FycmF5KCk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b19BcnJheSgpIHtcbiAgICByZXR1cm4gbmV3IF9BcnJheSh0aGlzKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b1NldCgpIHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzKTtcbiAgfVxufVxuIiwiLy8g5pWw57uEXG5pbXBvcnQgeyBfU2V0IH0gZnJvbSAnLi9fU2V0JztcblxuZXhwb3J0IGNsYXNzIF9BcnJheSBleHRlbmRzIEFycmF5IHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGlzQXJyYXkgW+e7p+aJv11cbiAgLy8gc3RhdGljIGZyb20gW+e7p+aJv11cbiAgLy8gc3RhdGljIG9mIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IFtdKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gQXJyYXkuZnJvbSh2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCfkvKDlj4LmiqXplJnvvIzlsIbnlJ/miJDnqbrmlbDnu4QnLCBlKTtcbiAgICAgIHZhbHVlID0gW107XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDEgJiYgdHlwZW9mIHZhbHVlWzBdID09PSAnbnVtYmVyJykge1xuICAgICAgLy8g56iA55aP5pWw57uE6Zeu6aKY77yM5YWI6LCDIHN1cGVyIOeUn+aIkCB0aGlzIOWQjuWGjeS/ruaUuSB0aGlzIOWGheWuuVxuICAgICAgY29uc3QgdGVtcCA9IHZhbHVlWzBdO1xuICAgICAgdmFsdWVbMF0gPSB1bmRlZmluZWQ7XG4gICAgICBzdXBlciguLi52YWx1ZSk7XG4gICAgICB0aGlzWzBdID0gdGVtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIoLi4udmFsdWUpO1xuICAgIH1cblxuICAgIC8vIGxlbmd0aCBb57un5om/XVxuICB9XG5cbiAgLy8g5pa55rOV5a6a5Yi277ya5Y6f5Z6L5ZCM5ZCN5pa55rOVK+aWsOWinuOAgumDqOWIhuWumuWItuaIkOi/lOWbniB0aGlzIOS+v+S6jumTvuW8j+aTjeS9nFxuICAvKipcbiAgICog5L+u5pS5XG4gICAqL1xuICAvLyBb5a6a5Yi2XVxuICBwdXNoKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgcG9wKGxlbmd0aCA9IDEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHVuc2hpZnQoKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICBzaGlmdChsZW5ndGggPSAxKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgQXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHNwbGljZSgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+aWsOWinl0g5Yig6ZmkXG4gIGRlbGV0ZSh2YWx1ZSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maW5kSW5kZXgodmFsID0+IHZhbCA9PT0gdmFsdWUpO1xuICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5paw5aKeXSDmuIXnqbpcbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5zcGxpY2UoMCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+aWsOWinl0g5Y676YeNXG4gIHVuaXF1ZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudG9fU2V0KCkudG9fQXJyYXkoKTtcbiAgICB0aGlzLmNsZWFyKCkucHVzaCguLi52YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gc29ydCBb57un5om/XVxuICAvLyBb5paw5aKeXSDpmo/mnLrmjpLluo/mlbDnu4RcbiAgcmFuZG9tU29ydCgpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICBbdGhpc1tpXSwgdGhpc1tqXV0gPSBbdGhpc1tqXSwgdGhpc1tpXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gcmV2ZXJzZSBb57un5om/XVxuICAvLyBmaWxsIFvnu6fmib9dXG4gIC8vIGNvcHlXaXRoaW4gW+e7p+aJv11cblxuICAvKipcbiAgICog6YGN5Y6GXG4gICAqL1xuICAvLyBTeW1ib2wuaXRlcmF0b3IgW+e7p+aJv11cbiAgLy8ga2V5cyBb57un5om/XVxuICAvLyB2YWx1ZXMgW+e7p+aJv11cbiAgLy8gZW50cmllcyBb57un5om/XVxuICAvLyBb5a6a5Yi2XVxuICBmb3JFYWNoKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog5p+l5om+XG4gICAqL1xuICAvLyBhdCBb57un5om/XVxuICAvLyBmaW5kIFvnu6fmib9dXG4gIC8vIGZpbmRJbmRleCBb57un5om/XVxuICAvLyBmaW5kTGFzdCBb57un5om/XVxuICAvLyBmaW5kTGFzdEluZGV4IFvnu6fmib9dXG4gIC8vIGluY2x1ZGVzIFvnu6fmib9dXG4gIC8vIGluZGV4T2YgW+e7p+aJv11cbiAgLy8gbGFzdEluZGV4T2YgW+e7p+aJv11cbiAgLy8gc29tZSBb57un5om/XVxuICAvLyBldmVyeSBb57un5om/XVxuXG4gIC8qKlxuICAgKiDnlJ/miJBcbiAgICovXG4gIC8vIG1hcCBb57un5om/XVxuICAvLyBmaWx0ZXIgW+e7p+aJv11cbiAgLy8gcmVkdWNlIFvnu6fmib9dXG4gIC8vIHJlZHVjZVJpZ2h0IFvnu6fmib9dXG4gIC8vIGNvbmNhdCBb57un5om/XVxuICAvLyBzbGljZSBb57un5om/XVxuICAvLyBqb2luIFvnu6fmib9dXG4gIC8vIGZsYXQgW+e7p+aJv11cbiAgLy8gZmxhdE1hcCBb57un5om/XVxuICAvLyBb5a6a5Yi2XVxuICB3aXRoKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLndpdGguYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvU3BsaWNlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1NwbGljZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvU29ydGVkKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLnRvU29ydGVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b1JldmVyc2VkKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLnRvUmV2ZXJzZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gW+aWsOWinl1cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIE5hTjtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b1N0cmluZygpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgdG9TdHJpbmcg6L2s5o2i5oql6ZSZ77yM5bCG55Sf5oiQICdbXSdgLCBlKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbXSk7XG4gICAgfVxuICB9XG4gIC8vIHRvTG9jYWxlU3RyaW5nIFvnu6fmib9dXG4gIC8vIFvmlrDlop5dXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPiAwO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvU2V0KCkge1xuICAgIHJldHVybiBuZXcgU2V0KHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvX1NldCgpIHtcbiAgICByZXR1cm4gbmV3IF9TZXQodGhpcyk7XG4gIH1cbn1cbiIsIi8vIOaXpeacn+aXtumXtFxuZXhwb3J0IGNsYXNzIF9EYXRlIGV4dGVuZHMgRGF0ZSB7XG4gIC8qKlxuICAgKiBzdGF0aWNcbiAgICovXG4gIC8vIFvmlrDlop5dXG4gIHN0YXRpYyBSRUdFWF9QQVJTRSA9IC9eKFxcZHs0fSlbLS9dPyhcXGR7MSwyfSk/Wy0vXT8oXFxkezAsMn0pW1R0XFxzXSooXFxkezEsMn0pPzo/KFxcZHsxLDJ9KT86PyhcXGR7MSwyfSk/Wy46XT8oXFxkKyk/JC87XG4gIHN0YXRpYyBSRUdFWF9GT1JNQVQgPSAvXFxbKFteXFxdXSspXXxZezEsNH18TXsxLDR9fER7MSwyfXxkezEsNH18SHsxLDJ9fGh7MSwyfXxhfEF8bXsxLDJ9fHN7MSwyfXxaezEsMn18U1NTL2c7XG4gIC8vIHN0YXRpYyBub3cgW+e7p+aJv11cbiAgLy8gc3RhdGljIHBhcnNlIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBVVEMgW+e7p+aJv11cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnX0RhdGUgY29uc3RydWN0b3InLCBhcmdzKTtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIG51bGwg5ZKM5pi+5byPIHVuZGVmaW5lZCDpg73op4bkuLrml6DmlYjlgLxcbiAgICAgIGlmIChhcmdzWzBdID09PSBudWxsKSB7XG4gICAgICAgIGFyZ3NbMF0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICAvLyBzYWZhcmkg5rWP6KeI5Zmo5a2X56ym5Liy5qC85byP5YW85a65XG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2VBbGwoJy0nLCAnLycpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIC8vIFvmlrDlop5dXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd5ZWFyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGdWxsWWVhcigpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21vbnRoJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNb250aCgpICsgMTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERhdGUoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd3ZWVrJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXkoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdob3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRIb3VycygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Nob3J0SG91cicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgY29uc3QgaG91ciA9IHRoaXMuaG91cjtcbiAgICAgICAgcmV0dXJuIGhvdXIgJSAxMiA9PT0gMCA/IGhvdXIgOiBob3VyICUgMTI7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWludXRlJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNaW51dGVzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2Vjb25kJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTZWNvbmRzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWlsbGlzZWNvbmQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1pbGxpc2Vjb25kcygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3RpbWVab25lT2Zmc2V0SG91cicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIOagvOW8j+WMluWtl+espuS4sueUqOOAguaAu+S9k+WQjCBlbGVtZW50IOeUqOeahCBkYXkuanMg5qC85byPKGh0dHBzOi8vZGF5LmpzLm9yZy9kb2NzL3poLUNOL2Rpc3BsYXkvZm9ybWF0Ke+8jOmjjuagvOWumuWItuaIkOS4reaWh1xuICAgIHRoaXMuZm9ybWF0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWVknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnllYXIudG9TdHJpbmcoKS5zbGljZSgtMik7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1lZWVknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnllYXIudG9TdHJpbmcoKS5zbGljZSgtNCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ00nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1vbnRoLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ01NJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5tb250aC50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0QnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmRheS50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdERCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuZGF5LnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWyflkajml6UnLCAn5ZGo5LiAJywgJ+WRqOS6jCcsICflkajkuIknLCAn5ZGo5ZubJywgJ+WRqOS6lCcsICflkajlha0nXVskdGhpcy53ZWVrXTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnZGQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsn5pif5pyf5pelJywgJ+aYn+acn+S4gCcsICfmmJ/mnJ/kuownLCAn5pif5pyf5LiJJywgJ+aYn+acn+WbmycsICfmmJ/mnJ/kupQnLCAn5pif5pyf5YWtJ11bJHRoaXMud2Vla107XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0gnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmhvdXIudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnSEgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmhvdXIudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdoJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zaG9ydEhvdXIudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnaGgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNob3J0SG91ci50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ20nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1pbnV0ZS50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdtbScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWludXRlLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAncycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2Vjb25kLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ3NzJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zZWNvbmQudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdTU1MnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1pbGxpc2Vjb25kLnRvU3RyaW5nKCkucGFkU3RhcnQoMywgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnYScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ciA8IDEyID8gJ+S4iuWNiCcgOiAn5LiL5Y2IJztcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnQScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzaWduID0gJHRoaXMudGltZVpvbmVPZmZzZXRIb3VyIDwgMCA/ICcrJyA6ICctJztcbiAgICAgICAgcmV0dXJuIGAke3NpZ259JHsoLSR0aGlzLnRpbWVab25lT2Zmc2V0SG91cikudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfTowMGA7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1paJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5aLnJlcGxhY2UoJzonLCAnJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFvnu6fmib9dIGdldCDns7vliJfmlrnms5XjgILkvb/nlKggeWVhcuOAgW1vbnRoIOetiemAmui/h+aWsOWinuWxnuaAp+iOt+WPluWNs+WPr++8jOeugOWMluWGmeazle+8jOaXoOmcgOmineWkluWumuWItlxuICAgKi9cbiAgLy8gZ2V0VGltZSBb57un5om/XVxuICAvLyBnZXRUaW1lem9uZU9mZnNldCBb57un5om/XVxuXG4gIC8vIGdldFllYXIgW+e7p+aJv11cbiAgLy8gZ2V0RnVsbFllYXIgW+e7p+aJv11cbiAgLy8gZ2V0TW9udGggW+e7p+aJv11cbiAgLy8gZ2V0RGF0ZSBb57un5om/XVxuICAvLyBnZXREYXkgW+e7p+aJv11cbiAgLy8gZ2V0SG91cnMgW+e7p+aJv11cbiAgLy8gZ2V0TWludXRlcyBb57un5om/XVxuICAvLyBnZXRTZWNvbmRzIFvnu6fmib9dXG4gIC8vIGdldE1pbGxpc2Vjb25kcyBb57un5om/XVxuXG4gIC8vIGdldFVUQ0Z1bGxZZWFyIFvnu6fmib9dXG4gIC8vIGdldFVUQ01vbnRoIFvnu6fmib9dXG4gIC8vIGdldFVUQ0RhdGUgW+e7p+aJv11cbiAgLy8gZ2V0VVRDRGF5IFvnu6fmib9dXG4gIC8vIGdldFVUQ0hvdXJzIFvnu6fmib9dXG4gIC8vIGdldFVUQ01pbnV0ZXMgW+e7p+aJv11cbiAgLy8gZ2V0VVRDU2Vjb25kcyBb57un5om/XVxuICAvLyBnZXRVVENNaWxsaXNlY29uZHMgW+e7p+aJv11cblxuICAvKipcbiAgICogW+WumuWItl0gc2V0IOezu+WIl+aWueazleOAguWumuWItuaIkOi/lOWbniB0aGlzIOS+v+S6jumTvuW8j+aTjeS9nFxuICAgKi9cbiAgc2V0VGltZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRUaW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRZZWFyKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRGdWxsWWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRGdWxsWWVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldE1vbnRoKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1vbnRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0RGF0ZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXREYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0SG91cnMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0SG91cnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNaW51dGVzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1pbnV0ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRTZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFNlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNaWxsaXNlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0TWlsbGlzZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRVVENGdWxsWWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENGdWxsWWVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ01vbnRoKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01vbnRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDRGF0ZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENEYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDSG91cnMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDSG91cnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNaW51dGVzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01pbnV0ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENTZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ1NlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNaWxsaXNlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDTWlsbGlzZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyBb5paw5aKeXVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lKCk7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9TdHJpbmcoZm9ybWF0ID0gJ1lZWVktTU0tREQgaGg6bW06c3MnKSB7XG4gICAgaWYgKCF0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZUFsbCh0aGlzLmNvbnN0cnVjdG9yLlJFR0VYX0ZPUk1BVCwgKG1hdGNoLCAkMSkgPT4ge1xuICAgICAgLy8gW10g6YeM6Z2i55qE5YaF5a655Y6f5qC36L6T5Ye6XG4gICAgICBpZiAoJDEpIHtcbiAgICAgICAgcmV0dXJuICQxO1xuICAgICAgfVxuICAgICAgLy8g5qC85byPXG4gICAgICBpZiAobWF0Y2ggaW4gdGhpcy5mb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0W21hdGNoXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b0RhdGVTdHJpbmcoZm9ybWF0ID0gJ1lZWVktTU0tREQnKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoZm9ybWF0KTtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b1RpbWVTdHJpbmcoZm9ybWF0ID0gJ0hIOm1tOnNzJykge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKGZvcm1hdCk7XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcgW+e7p+aJv11cbiAgLy8gdG9Mb2NhbGVEYXRlU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvTG9jYWxlVGltZVN0cmluZyBb57un5om/XVxuICAvLyB0b0lTT1N0cmluZyBb57un5om/XVxuICAvLyB0b1VUQ1N0cmluZyBb57un5om/XVxuICAvLyB0b0dNVFN0cmluZyBb57un5om/XVxuICAvLyBb5paw5aKeXVxuICB0b0Jvb2xlYW4oKSB7XG4gICAgcmV0dXJuICFOdW1iZXIuaXNOYU4odGhpcy5nZXRUaW1lKCkpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvSlNPTihvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICB9XG4gIC8vIHZhbHVlT2YgW+e7p+aJv11cbn1cbiIsIi8vIOaVsOWtpui/kOeul+OAguWvuSBNYXRoIOWvueixoeaJqeWxle+8jOaPkOS+m+abtOebtOinguWSjOespuWQiOaVsOWtpue6puWumueahOWQjeensFxuaW1wb3J0IHsgX0FycmF5IH0gZnJvbSAnLi9fQXJyYXknO1xuaW1wb3J0IHsgX1NldCB9IGZyb20gJy4vX1NldCc7XG5leHBvcnQgY29uc3QgX01hdGggPSBPYmplY3QuY3JlYXRlKE1hdGgpO1xuXG4vLyDluLjph49cbi8vIEUgW+e7p+aJv11cbi8vIExOMiBb57un5om/XVxuLy8gTE4xMCBb57un5om/XVxuLy8gTE9HMkUgW+e7p+aJv11cbi8vIExPRzEwRSBb57un5om/XVxuLy8gUEkgW+e7p+aJv11cbi8vIFNRUlQxXzIgW+e7p+aJv11cbi8vIFNRUlQyIFvnu6fmib9dXG4vLyDpu4Tph5HliIblibLmr5QgUEhJXG5fTWF0aC5QSEkgPSAoTWF0aC5zcXJ0KDUpIC0gMSkgLyAyO1xuX01hdGguUEhJX0JJRyA9IChNYXRoLnNxcnQoNSkgKyAxKSAvIDI7XG5cbi8vIOW4uOinhFxuLy8gYWJzIFvnu6fmib9dXG4vLyBtaW4gW+e7p+aJv11cbi8vIG1heCBb57un5om/XVxuLy8gcmFuZG9tIFvnu6fmib9dXG4vLyBzaWduIFvnu6fmib9dXG4vLyBoeXBvdCBb57un5om/XVxuLy8gY2x6MzIgW+e7p+aJv11cbi8vIGltdWwgW+e7p+aJv11cbi8vIGZyb3VuZCBb57un5om/XVxuXG4vLyDlj5bmlbRcbi8vIGNlaWwgW+e7p+aJv11cbi8vIGZsb29yIFvnu6fmib9dXG4vLyByb3VuZCBb57un5om/XVxuLy8gdHJ1bmMgW+e7p+aJv11cblxuLy8g5LiJ6KeS5Ye95pWwXG4vLyBzaW4gW+e7p+aJv11cbi8vIGNvcyBb57un5om/XVxuLy8gdGFuIFvnu6fmib9dXG4vLyBhc2luIFvnu6fmib9dXG4vLyBhY29zIFvnu6fmib9dXG4vLyBhdGFuIFvnu6fmib9dXG4vLyBzaW5oIFvnu6fmib9dXG4vLyBjb3NoIFvnu6fmib9dXG4vLyB0YW5oIFvnu6fmib9dXG4vLyBhc2luaCBb57un5om/XVxuLy8gYWNvc2ggW+e7p+aJv11cbi8vIGF0YW5oIFvnu6fmib9dXG4vLyBhdGFuMiBb57un5om/XVxuLy8gW+aWsOWinl1cbl9NYXRoLmFyY3NpbiA9IE1hdGguYXNpbi5iaW5kKE1hdGgpO1xuX01hdGguYXJjY29zID0gTWF0aC5hY29zLmJpbmQoTWF0aCk7XG5fTWF0aC5hcmN0YW4gPSBNYXRoLmF0YW4uYmluZChNYXRoKTtcbl9NYXRoLmFyc2luaCA9IE1hdGguYXNpbmguYmluZChNYXRoKTtcbl9NYXRoLmFyY29zaCA9IE1hdGguYWNvc2guYmluZChNYXRoKTtcbl9NYXRoLmFydGFuaCA9IE1hdGguYXRhbmguYmluZChNYXRoKTtcblxuLy8g5a+55pWwXG4vLyBsb2cyIFvnu6fmib9dXG4vLyBsb2cxMCBb57un5om/XVxuLy8gbG9nMXAgW+e7p+aJv11cbi8vIFvlrprliLZdXG5fTWF0aC5sb2cgPSBmdW5jdGlvbihhLCB4KSB7XG4gIHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKGEpO1xufTtcbl9NYXRoLmxvZ2UgPSBNYXRoLmxvZy5iaW5kKE1hdGgpO1xuX01hdGgubG4gPSBNYXRoLmxvZy5iaW5kKE1hdGgpO1xuX01hdGgubGcgPSBNYXRoLmxvZzEwLmJpbmQoTWF0aCk7XG5cbi8vIOaMh+aVsFxuLy8gcG93IFvnu6fmib9dXG4vLyBzcXJ0IFvnu6fmib9dXG4vLyBjYnJ0IFvnu6fmib9dXG4vLyBleHAgW+e7p+aJv11cbi8vIGV4cG0xIFvnu6fmib9dXG5cbi8vIOmYtuS5mFxuX01hdGguZmFjdG9yaWFsID0gZnVuY3Rpb24obikge1xuICBsZXQgcmVzdWx0ID0gMW47XG4gIGZvciAobGV0IGkgPSBuOyBpID49IDE7IGktLSkge1xuICAgIHJlc3VsdCAqPSBCaWdJbnQoaSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4vLyDmjpLliJcgQXJyYW5nZW1lbnRcbl9NYXRoLkEgPSBmdW5jdGlvbihuLCBtKSB7XG4gIHJldHVybiBfTWF0aC5mYWN0b3JpYWwobikgLyBfTWF0aC5mYWN0b3JpYWwobiAtIG0pO1xufTtcbl9NYXRoLkFycmFuZ2VtZW50ID0gX01hdGguQTtcbi8vIOe7hOWQiCBDb21iaW5hdGlvblxuX01hdGguQyA9IGZ1bmN0aW9uKG4sIG0pIHtcbiAgcmV0dXJuIF9NYXRoLkEobiwgbSkgLyBfTWF0aC5mYWN0b3JpYWwobSk7XG59O1xuX01hdGguQ29tYmluYXRpb24gPSBfTWF0aC5DO1xuXG4vLyDmlbDliJdcbl9NYXRoLlNlcXVlbmNlID0gY2xhc3Mge1xuICAvLyDnlJ/miJDmlbDmja7mlrnms5VcbiAgdG9BcnJheShsZW5ndGggPSB0aGlzLm4pIHtcbiAgICBsZXQgYXJyID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbiA9IGkgKyAxO1xuICAgICAgYXJyW2ldID0gdGhpcy5hbihuKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICB0b19BcnJheSgpIHtcbiAgICByZXR1cm4gbmV3IF9BcnJheSh0aGlzLnRvQXJyYXkoLi4uYXJndW1lbnRzKSk7XG4gIH1cbiAgdG9TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBTZXQodGhpcy50b0FycmF5KC4uLmFyZ3VtZW50cykpO1xuICB9XG4gIHRvX1NldCgpIHtcbiAgICByZXR1cm4gbmV3IF9TZXQodGhpcy50b0FycmF5KC4uLmFyZ3VtZW50cykpO1xuICB9XG59O1xuLy8g562J5beu5pWw5YiXXG5fTWF0aC5Bcml0aG1ldGljU2VxdWVuY2UgPSBjbGFzcyBleHRlbmRzIF9NYXRoLlNlcXVlbmNlIHtcbiAgY29uc3RydWN0b3IoYTEsIGQsIG4gPSAwKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmExID0gYTE7IC8vIOmmlumhuVxuICAgIHRoaXMuZCA9IGQ7IC8vIOWFrOW3rlxuICAgIHRoaXMubiA9IG47IC8vIOm7mOiupOmhueaVsO+8jOWPr+eUqOS6juaWueazleeahOS8oOWPgueugOWMllxuICB9XG4gIC8vIOesrG7poblcbiAgYW4obiA9IHRoaXMubikge1xuICAgIHJldHVybiB0aGlzLmExICsgKG4gLSAxKSAqIHRoaXMuZDtcbiAgfVxuICAvLyDliY1u6aG55rGC5ZKMXG4gIFNuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gbiAvIDIgKiAodGhpcy5hMSArIHRoaXMuYW4obikpO1xuICB9XG59O1xuLy8g562J5q+U5pWw5YiXXG5fTWF0aC5HZW9tZXRyaWNTZXF1ZW5jZSA9IGNsYXNzIGV4dGVuZHMgX01hdGguU2VxdWVuY2Uge1xuICBjb25zdHJ1Y3RvcihhMSwgcSwgbiA9IDApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYTEgPSBhMTsgLy8g6aaW6aG5XG4gICAgdGhpcy5xID0gcTsgLy8g5YWs5q+UXG4gICAgdGhpcy5uID0gbjsgLy8g6buY6K6k6aG55pWw77yM5Y+v55So5LqO5pa55rOV55qE5Lyg5Y+C566A5YyWXG4gIH1cbiAgLy8g56ysbumhuVxuICBhbihuID0gdGhpcy5uKSB7XG4gICAgcmV0dXJuIHRoaXMuYTEgKiB0aGlzLnEgKiogKG4gLSAxKTtcbiAgfVxuICAvLyDliY1u6aG55rGC5ZKMXG4gIFNuKG4gPSB0aGlzLm4pIHtcbiAgICBpZiAodGhpcy5xID09PSAxKSB7XG4gICAgICByZXR1cm4gbiAqIHRoaXMuYTE7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmExICogKDEgLSB0aGlzLnEgKiogbikgLyAoMSAtIHRoaXMucSk7XG4gIH1cbn07XG4vLyDmlpDms6LpgqPlpZHmlbDliJdcbl9NYXRoLkZpYm9uYWNjaVNlcXVlbmNlID0gY2xhc3MgZXh0ZW5kcyBfTWF0aC5TZXF1ZW5jZSB7XG4gIGNvbnN0cnVjdG9yKG4gPSAwKSB7XG4gICAgc3VwZXIoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2ExJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbigxKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5uID0gbjsgLy8g6buY6K6k6aG55pWw77yM5Y+v55So5LqO5pa55rOV55qE5Lyg5Y+C566A5YyWXG4gIH1cbiAgLy8g56ysbumhuVxuICBhbihuID0gdGhpcy5uKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoKF9NYXRoLlBISV9CSUcgKiogbiAtICgxIC0gX01hdGguUEhJX0JJRykgKiogbikgLyBNYXRoLnNxcnQoNSkpO1xuICB9XG4gIC8vIOWJjW7pobnmsYLlkoxcbiAgU24obiA9IHRoaXMubikge1xuICAgIHJldHVybiB0aGlzLmFuKG4gKyAyKSAtIDE7XG4gIH1cbn07XG4vLyDntKDmlbDmlbDliJdcbl9NYXRoLlByaW1lU2VxdWVuY2UgPSBjbGFzcyBleHRlbmRzIF9NYXRoLlNlcXVlbmNlIHtcbiAgLy8g5piv5ZCm57Sg5pWwXG4gIHN0YXRpYyBpc1ByaW1lKHgpIHtcbiAgICBpZiAoeCA8PSAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAyOyBpIDw9IE1hdGguc3FydCh4KTsgaSsrKSB7XG4gICAgICBpZiAoeCAlIGkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICAvLyDliJvlu7rntKDmlbDliJfooahcbiAgc3RhdGljIGNyZWF0ZUxpc3QoYTEsIG4pIHtcbiAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgbGV0IHZhbHVlID0gYTE7XG4gICAgd2hpbGUgKHJlc3VsdC5sZW5ndGggPCBuKSB7XG4gICAgICBpZiAodGhpcy5pc1ByaW1lKHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICB2YWx1ZSsrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgY29uc3RydWN0b3IoYTEgPSAyLCBuID0gMCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuY29uc3RydWN0b3IuY3JlYXRlTGlzdChhMSwgbik7XG4gICAgdGhpcy5hMSA9IGExO1xuICAgIHRoaXMubiA9IG47IC8vIOm7mOiupOmhueaVsO+8jOWPr+eUqOS6juaWueazleeahOS8oOWPgueugOWMllxuICB9XG5cbiAgYW4obiA9IHRoaXMubikge1xuICAgIGlmIChuIDw9IHRoaXMubikge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVbbiAtIDFdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5jcmVhdGVMaXN0KHRoaXMuYTEsIG4pW24gLSAxXTtcbiAgfVxuICBTbihuID0gdGhpcy5uKSB7XG4gICAgcmV0dXJuIHRoaXMudG9BcnJheShuKS5yZWR1Y2UoKHRvdGFsLCB2YWwpID0+IHRvdGFsICsgdmFsLCAwKTtcbiAgfVxufTtcbiIsIi8vIOaVsOWtl1xuZXhwb3J0IGNsYXNzIF9OdW1iZXIgZXh0ZW5kcyBOdW1iZXIge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyBzdGF0aWMgTmFOIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBQT1NJVElWRV9JTkZJTklUWSBb57un5om/XVxuICAvLyBzdGF0aWMgTkVHQVRJVkVfSU5GSU5JVFkgW+e7p+aJv11cbiAgLy8gc3RhdGljIE1BWF9WQUxVRSBb57un5om/XVxuICAvLyBzdGF0aWMgTUlOX1ZBTFVFIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBNQVhfU0FGRV9JTlRFR0VSIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBNSU5fU0FGRV9JTlRFR0VSIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBFUFNJTE9OIFvnu6fmib9dXG5cbiAgLy8gc3RhdGljIGlzTmFOIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc0Zpbml0ZSBb57un5om/XVxuICAvLyBzdGF0aWMgaXNJbnRlZ2VyIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc1NhZmVJbnRlZ2VyIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBwYXJzZUludCBb57un5om/XVxuICAvLyBzdGF0aWMgcGFyc2VGbG9hdCBb57un5om/XVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICB2YWx1ZSA9IE51bWJlci5wYXJzZUZsb2F0KHZhbHVlKTtcbiAgICBzdXBlcih2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICog55Sf5oiQXG4gICAqL1xuICAvLyBb5paw5aKeXSDov5Tlm57mlrDlgLzvvIzmlrnkvr/otYvlgLzlpoIgbnVtID0gbnVtLm5ldyh2YWx1ZSkg5YaZ5rOVXG4gIG5ldyh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cbiAgLy8gdG9QcmVjaXNpb24gW+e7p+aJv11cbiAgLy8gdG9GaXhlZCBb57un5om/XVxuICAvLyBb5paw5aKeXSDljLrliKvkuo4gdG9GaXhlZO+8jOS8muenu+mZpOWkmuS9meeahCAwIOS7peeyvueugOaYvuekulxuICB0b01heEZpeGVkKGZyYWN0aW9uRGlnaXRzID0gMCkge1xuICAgIGNvbnN0IHN0ciA9IE51bWJlci5wcm90b3R5cGUudG9GaXhlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBOdW1iZXIucGFyc2VGbG9hdChzdHIpLnRvU3RyaW5nKCk7XG4gIH1cbiAgLy8gdG9FeHBvbmVudGlhbCBb57un5om/XVxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vIFvmlrDlop5dXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBjb25zb2xlLmxvZygnX051bWJlciBTeW1ib2wudG9QcmltaXRpdmUnLCB7IGhpbnQgfSk7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gIH1cbiAgLy8gdmFsdWVPZiBb57un5om/XVxuICAvLyB0b1N0cmluZyBb57un5om/XVxuICAvLyB0b0xvY2FsZVN0cmluZyBb57un5om/XVxuICAvLyBb5paw5aKeXVxuICB0b0Jvb2xlYW4oKSB7XG4gICAgcmV0dXJuICFOdW1iZXIuaXNOYU4odGhpcyk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IF9SZWZsZWN0ID0gT2JqZWN0LmNyZWF0ZShSZWZsZWN0KTtcblxuLy8gYXBwbHkg57un5om/XG4vLyBjb25zdHJ1Y3Qg57un5om/XG4vLyBkZWZpbmVQcm9wZXJ0eSDnu6fmib9cbi8vIGRlbGV0ZVByb3BlcnR5IOe7p+aJv1xuLy8gZ2V0IOe7p+aJv1xuLy8gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIOe7p+aJv1xuLy8gZ2V0UHJvdG90eXBlT2Yg57un5om/XG4vLyBvd25LZXlzIOe7p+aJv1xuLy8gc2V0IOe7p+aJv1xuLy8gc2V0UHJvdG90eXBlT2Yg57un5om/XG4vLyBwcmV2ZW50RXh0ZW5zaW9ucyDnu6fmib9cbi8vIGhhcyDnu6fmib9cbi8vIGlzRXh0ZW5zaWJsZSDnu6fmib9cblxuLy8g5a+5IG93bktleXMg6YWN5aWXIG93blZhbHVlcyDlkowgb3duRW50cmllc1xuX1JlZmxlY3Qub3duVmFsdWVzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IHRhcmdldFtrZXldKTtcbn07XG5fUmVmbGVjdC5vd25FbnRyaWVzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IFtrZXksIHRhcmdldFtrZXldXSk7XG59O1xuIiwiLy8g5pWw5o2u5aSE55CG77yM5aSE55CG5aSa5qC85byP5pWw5o2u55SoXG5leHBvcnQgY29uc3QgRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4vKipcbiAqIOS8mOWMliB0eXBlb2ZcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMgeyd1bmRlZmluZWQnfCdvYmplY3QnfCdib29sZWFuJ3wnbnVtYmVyJ3wnc3RyaW5nJ3wnZnVuY3Rpb24nfCdzeW1ib2wnfCdiaWdpbnQnfHN0cmluZ31cbiAqL1xuRGF0YS50eXBlb2YgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIHJldHVybiB0eXBlb2YgdmFsdWU7XG59O1xuLyoqXG4gKiDliKTmlq3nroDljZXnsbvlnotcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkRhdGEuaXNTaW1wbGVUeXBlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIFsnbnVsbCcsICd1bmRlZmluZWQnLCAnbnVtYmVyJywgJ3N0cmluZycsICdib29sZWFuJywgJ2JpZ2ludCcsICdzeW1ib2wnXS5pbmNsdWRlcyh0aGlzLnR5cGVvZih2YWx1ZSkpO1xufTtcbi8qKlxuICog5piv5ZCm5pmu6YCa5a+56LGhXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5EYXRhLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufTtcbi8qKlxuICog6I635Y+W5YC855qE5YW35L2T57G75Z6LXG4gKiBAcGFyYW0gdmFsdWUg5YC8XG4gKiBAcmV0dXJucyB7T2JqZWN0Q29uc3RydWN0b3J8KnxGdW5jdGlvbn0g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWw44CCbnVsbOOAgXVuZGVmaW5lZCDljp/moLfov5Tlm55cbiAqL1xuRGF0YS5nZXRFeGFjdFR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gIC8vIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoeaXtiBfX3Byb3RvX18g5Li6IG51bGxcbiAgY29uc3QgaXNPYmplY3RCeUNyZWF0ZU51bGwgPSBfX3Byb3RvX18gPT09IG51bGw7XG4gIGlmIChpc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgIHJldHVybiBPYmplY3Q7XG4gIH1cbiAgLy8g5a+55bqU57un5om/55qE5a+56LGhIF9fcHJvdG9fXyDmsqHmnIkgY29uc3RydWN0b3Ig5bGe5oCnXG4gIGNvbnN0IGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9ICEoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pO1xuICBpZiAoaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgIHJldHVybiBPYmplY3Q7XG4gIH1cbiAgLy8g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWwXG4gIHJldHVybiBfX3Byb3RvX18uY29uc3RydWN0b3I7XG59O1xuLyoqXG4gKiDojrflj5blgLznmoTlhbfkvZPnsbvlnovliJfooahcbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEByZXR1cm5zIHsqW119IOe7n+S4gOi/lOWbnuaVsOe7hOOAgm51bGzjgIF1bmRlZmluZWQg5a+55bqU5Li6IFtudWxsXSxbdW5kZWZpbmVkXVxuICovXG5EYXRhLmdldEV4YWN0VHlwZXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWIpOaWreWkhOeQhlxuICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgcmV0dXJuIFt2YWx1ZV07XG4gIH1cbiAgLy8g5omr5Y6f5Z6L6ZO+5b6X5Yiw5a+55bqU5p6E6YCg5Ye95pWwXG4gIGxldCByZXN1bHQgPSBbXTtcbiAgbGV0IGxvb3AgPSAwO1xuICBsZXQgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IGZhbHNlO1xuICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ3doaWxlJywgbG9vcCwgX19wcm90b19fKTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICAvLyDkuIDov5vmnaUgX19wcm90b19fIOWwseaYryBudWxsIOivtOaYjiB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaFcbiAgICAgIGlmIChsb29wIDw9IDApIHtcbiAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXykge1xuICAgICAgcmVzdWx0LnB1c2goX19wcm90b19fLmNvbnN0cnVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgIGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSB0cnVlO1xuICAgIH1cbiAgICBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX19wcm90b19fKTtcbiAgICBsb29wKys7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICog5rex5ou36LSd5pWw5o2uXG4gKiBAcGFyYW0gc291cmNlXG4gKiBAcmV0dXJucyB7TWFwPGFueSwgYW55PnxTZXQ8YW55Pnx7fXwqfCpbXX1cbiAqL1xuRGF0YS5kZWVwQ2xvbmUgPSBmdW5jdGlvbihzb3VyY2UpIHtcbiAgLy8g5pWw57uEXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHNvdXJjZS52YWx1ZXMoKSkge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBTZXRcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIFNldCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICByZXN1bHQuYWRkKHRoaXMuZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gTWFwXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBNYXApIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IE1hcCgpO1xuICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBzb3VyY2UuZW50cmllcygpKSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgdGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlr7nosaFcbiAgaWYgKHRoaXMuZ2V0RXhhY3RUeXBlKHNvdXJjZSkgPT09IE9iamVjdCkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgIC8vIHZhbHVl5pa55byP77ya6YCS5b2S5aSE55CGXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwge1xuICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcENsb25lKGRlc2MudmFsdWUpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGdldC9zZXQg5pa55byP77ya55u05o6l5a6a5LmJXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g5YW25LuW77ya5Y6f5qC36L+U5ZueXG4gIHJldHVybiBzb3VyY2U7XG59O1xuLyoqXG4gKiDmt7Hop6PljIXmlbDmja5cbiAqIEBwYXJhbSBkYXRhIOWAvFxuICogQHBhcmFtIGlzV3JhcCDljIXoo4XmlbDmja7liKTmlq3lh73mlbDvvIzlpoIgdnVlMyDnmoQgaXNSZWYg5Ye95pWwXG4gKiBAcGFyYW0gdW53cmFwIOino+WMheaWueW8j+WHveaVsO+8jOWmgiB2dWUzIOeahCB1bnJlZiDlh73mlbBcbiAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiBhbnl9fXwqfCgqfHtbcDogc3RyaW5nXTogYW55fSlbXXx7W3A6IHN0cmluZ106IGFueX19XG4gKi9cbkRhdGEuZGVlcFVud3JhcCA9IGZ1bmN0aW9uKGRhdGEsIHsgaXNXcmFwID0gKCkgPT4gZmFsc2UsIHVud3JhcCA9IHZhbCA9PiB2YWwgfSA9IHt9KSB7XG4gIC8vIOmAiemhueaUtumbhlxuICBjb25zdCBvcHRpb25zID0geyBpc1dyYXAsIHVud3JhcCB9O1xuICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gIGlmIChpc1dyYXAoZGF0YSkpIHtcbiAgICByZXR1cm4gdGhpcy5kZWVwVW53cmFwKHVud3JhcChkYXRhKSwgb3B0aW9ucyk7XG4gIH1cbiAgLy8g6YCS5b2S5aSE55CG55qE57G75Z6LXG4gIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAodmFsID0+IHRoaXMuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpKTtcbiAgfVxuICBpZiAodGhpcy5nZXRFeGFjdFR5cGUoZGF0YSkgPT09IE9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICByZXR1cm4gW2tleSwgdGhpcy5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucyldO1xuICAgIH0pKTtcbiAgfVxuICAvLyDlhbbku5bljp/moLfov5Tlm55cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiLy8g6L6F5YqpXG5leHBvcnQgY29uc3QgU3VwcG9ydCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICog5bGe5oCn5ZCN57uf5LiA5oiQ5pWw57uE5qC85byPXG4gKiBAcGFyYW0gbmFtZXMg5bGe5oCn5ZCN44CC5qC85byPICdhLGIsYycg5oiWIFsnYScsJ2InLCdjJ11cbiAqIEBwYXJhbSBzZXBhcmF0b3IgbmFtZXMg5Li65a2X56ym5Liy5pe255qE5ouG5YiG6KeE5YiZ44CC5ZCMIHNwbGl0IOaWueazleeahCBzZXBhcmF0b3LvvIzlrZfnrKbkuLLml6DpnIDmi4bliIbnmoTlj6/ku6XkvKAgbnVsbCDmiJYgdW5kZWZpbmVkXG4gKiBAcmV0dXJucyB7KltdW118KE1hZ2ljU3RyaW5nIHwgQnVuZGxlIHwgc3RyaW5nKVtdfEZsYXRBcnJheTwoRmxhdEFycmF5PCgqfFsqW11dfFtdKVtdLCAxPltdfCp8WypbXV18W10pW10sIDE+W118KltdfVxuICovXG5TdXBwb3J0Lm5hbWVzVG9BcnJheSA9IGZ1bmN0aW9uKG5hbWVzID0gW10sIHsgc2VwYXJhdG9yID0gJywnIH0gPSB7fSkge1xuICBpZiAobmFtZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBuYW1lcy5tYXAodmFsID0+IHRoaXMubmFtZXNUb0FycmF5KHZhbCkpLmZsYXQoKTtcbiAgfVxuICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBuYW1lcy5zcGxpdChzZXBhcmF0b3IpLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICB9XG4gIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzeW1ib2wnKSB7XG4gICAgcmV0dXJuIFtuYW1lc107XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuLyoqXG4gKiDnu5Hlrpp0aGlz44CC5bi455So5LqO6Kej5p6E5Ye95pWw5pe257uR5a6aIHRoaXMg6YG/5YWN5oql6ZSZXG4gKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuU3VwcG9ydC5iaW5kVGhpcyA9IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBuZXcgUHJveHkodGFyZ2V0LCB7XG4gICAgZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQoLi4uYXJndW1lbnRzKTtcbiAgICAgIC8vIOWHveaVsOexu+Wei+e7keWumnRoaXNcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blsZ7mgKfljp/moLfov5Tlm55cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICB9KTtcbn07XG4iLCIvLyDlr7nosaFcbmltcG9ydCB7IF9SZWZsZWN0IH0gZnJvbSAnLi9fUmVmbGVjdCc7XG5pbXBvcnQgeyBEYXRhIH0gZnJvbSAnLi9EYXRhJztcbmltcG9ydCB7IFN1cHBvcnQgfSBmcm9tICcuL1N1cHBvcnQnO1xuXG4vLyBleHRlbmRzIE9iamVjdCDmlrnlvI/osIPnlKggc3VwZXIg5bCG55Sf5oiQ56m65a+56LGh77yM5LiN5Lya5YOP5pmu6YCa5p6E6YCg5Ye95pWw6YKj5qC35Yib5bu65LiA5Liq5paw55qE5a+56LGh77yM5pS55a6e546wXG5leHBvcnQgY2xhc3MgX09iamVjdCB7XG4gIC8qKlxuICAgKiBzdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBjcmVhdGUgW+e7p+aJv11cbiAgLy8gc3RhdGljIGZyb21FbnRyaWVzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBnZXRQcm90b3R5cGVPZiBb57un5om/XVxuICAvLyBzdGF0aWMgc2V0UHJvdG90eXBlT2YgW+e7p+aJv11cbiAgLy8gc3RhdGljIGRlZmluZVByb3BlcnR5IFvnu6fmib9dXG4gIC8vIHN0YXRpYyBkZWZpbmVQcm9wZXJ0aWVzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBoYXNPd24gW+e7p+aJv11cbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5RGVzY3JpcHRvciBb57un5om/XVxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyBb57un5om/XVxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlOYW1lcyBb57un5om/XVxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlTeW1ib2xzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpcyBb57un5om/XVxuICAvLyBzdGF0aWMgcHJldmVudEV4dGVuc2lvbnMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzRXh0ZW5zaWJsZSBb57un5om/XVxuICAvLyBzdGF0aWMgc2VhbCBb57un5om/XVxuICAvLyBzdGF0aWMgaXNTZWFsZWQgW+e7p+aJv11cbiAgLy8gc3RhdGljIGZyZWV6ZSBb57un5om/XVxuICAvLyBzdGF0aWMgaXNGcm96ZW4gW+e7p+aJv11cblxuICAvKipcbiAgICogW+WumuWItl0g5rWF5ZCI5bm25a+56LGh44CC5YaZ5rOV5ZCMIE9iamVjdC5hc3NpZ27vvIzpgJrov4fph43lrprkuYnmlrnlvI/lkIjlubbvvIzop6PlhrMgT2JqZWN0LmFzc2lnbiDlkIjlubbkuKTovrnlkIzlkI3lsZ7mgKfmt7fmnIkgdmFsdWXlhpnms5Ug5ZKMIGdldC9zZXTlhpnms5Ug5pe25oqlIFR5cGVFcnJvcjogQ2Fubm90IHNldCBwcm9wZXJ0eSBiIG9mICM8T2JqZWN0PiB3aGljaCBoYXMgb25seSBhIGdldHRlciDnmoTpl67pophcbiAgICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaFcbiAgICogQHBhcmFtIHNvdXJjZXMg5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBhc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICAvLyDkuI3kvb/nlKggdGFyZ2V0W2tleV0gPSB2YWx1ZSDlhpnms5XvvIznm7TmjqXkvb/nlKggT2JqZWN0LmRlZmluZVByb3BlcnR5IOmHjeWumuS5iVxuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDmt7HlkIjlubblr7nosaHjgILlkIwgYXNzaWduIOS4gOagt+S5n+S8muWvueWxnuaAp+i/m+ihjOmHjeWumuS5iVxuICAgKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupBcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGRlZXBBc3NpZ24odGFyZ2V0LCAuLi5zb3VyY2VzKSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHJldHVybiB0aGlzLmFzc2lnbih7fSwgLi4uc291cmNlcyk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgIC8vIHZhbHVlIOWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICAgIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZGVzYy52YWx1ZSkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuICAgICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQXNzaWduKHRhcmdldFtrZXldLCBkZXNjLnZhbHVlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBnZXQvc2V0IOWGmeazle+8muebtOaOpeWumuS5iVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBb5a6a5Yi2XSDojrflj5blsZ7mgKflkI3jgILpu5jorqTlj4LmlbDphY3nva7miJDlkIwgT2JqZWN0LmtleXMg6KGM5Li6XG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHthbnlbXX1cbiAgICovXG4gIHN0YXRpYyBrZXlzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIC8vIHNldOeUqOS6jmtleeWOu+mHjVxuICAgIGxldCBzZXQgPSBuZXcgU2V0KCk7XG4gICAgLy8g6Ieq6Lqr5bGe5oCn562b6YCJXG4gICAgY29uc3QgZGVzY3MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3QpO1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgX1JlZmxlY3Qub3duRW50cmllcyhkZXNjcykpIHtcbiAgICAgIC8vIOW/veeVpXN5bWJvbOWxnuaAp+eahOaDheWGtVxuICAgICAgaWYgKCFzeW1ib2wgJiYgdHlwZW9mIGtleSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlv73nlaXkuI3lj6/liJfkuL7lsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghbm90RW51bWVyYWJsZSAmJiAhZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5bGe5oCn5Yqg5YWlXG4gICAgICBzZXQuYWRkKGtleSk7XG4gICAgfVxuICAgIC8vIOe7p+aJv+WxnuaAp1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgaWYgKF9fcHJvdG9fXyAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXJlbnRLZXlzID0gdGhpcy5rZXlzKF9fcHJvdG9fXywgb3B0aW9ucyk7XG4gICAgICAgIGZvciAoY29uc3QgcGFyZW50S2V5IG9mIHBhcmVudEtleXMpIHtcbiAgICAgICAgICBzZXQuYWRkKHBhcmVudEtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8g6L+U5Zue5pWw57uEXG4gICAgcmV0dXJuIEFycmF5LmZyb20oc2V0KTtcbiAgfVxuICAvKipcbiAgICogW+WumuWItl1cbiAgICovXG4gIHN0YXRpYyB2YWx1ZXMoKSB7XG4gIH1cbiAgLyoqXG4gICAqIFvlrprliLZdXG4gICAqL1xuICBzdGF0aWMgZW50cmllcygpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBb5paw5aKeXSBrZXnoh6rouqvmiYDlsZ7nmoTlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIGtleSDlsZ7mgKflkI1cbiAgICogQHJldHVybnMgeyp8bnVsbH1cbiAgICovXG4gIHN0YXRpYyBvd25lcihvYmplY3QsIGtleSkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgaWYgKF9fcHJvdG9fXyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm93bmVyKF9fcHJvdG9fXywga2V5KTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g6I635Y+W5bGe5oCn5o+P6L+w5a+56LGh77yM55u45q+UIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3LvvIzog73mi7/liLDnu6fmib/lsZ7mgKfnmoTmj4/ov7Dlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR8UHJvcGVydHlEZXNjcmlwdG9yfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpIHtcbiAgICBjb25zdCBmaW5kT2JqZWN0ID0gdGhpcy5vd25lcihvYmplY3QsIGtleSk7XG4gICAgaWYgKCFmaW5kT2JqZWN0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmaW5kT2JqZWN0LCBrZXkpO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvcnPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMgeyhQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkKVtdfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3JzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IF9rZXlzID0gdGhpcy5rZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9rZXlzLm1hcChrZXkgPT4gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KSk7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOWvueW6lCBrZXlzIOiOt+WPliBkZXNjcmlwdG9yRW50cmllc++8jOS8oOWPguWQjCBrZXlzIOaWueazleOAguWPr+eUqOS6jumHjeWumuS5ieWxnuaAp1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7WyosKFByb3BlcnR5RGVzY3JpcHRvcnx1bmRlZmluZWQpXVtdfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3JFbnRyaWVzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IF9rZXlzID0gdGhpcy5rZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9rZXlzLm1hcChrZXkgPT4gW2tleSwgdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFvmlrDlop5dIOi/h+a7pOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gcGljayDmjJHpgInlsZ7mgKdcbiAgICogQHBhcmFtIG9taXQg5b+955Wl5bGe5oCnXG4gICAqIEBwYXJhbSBlbXB0eVBpY2sgcGljayDkuLrnqbrml7bnmoTlj5blgLzjgIJhbGwg5YWo6YOoa2V577yMZW1wdHkg56m6XG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig5ZCMIG5hbWVzVG9BcnJheSDnmoQgc2VwYXJhdG9yIOWPguaVsFxuICAgKiBAcGFyYW0gc3ltYm9sIOWQjCBrZXlzIOeahCBzeW1ib2wg5Y+C5pWwXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOWQjCBrZXlzIOeahCBub3RFbnVtZXJhYmxlIOWPguaVsFxuICAgKiBAcGFyYW0gZXh0ZW5kIOWQjCBrZXlzIOeahCBleHRlbmQg5Y+C5pWwXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBmaWx0ZXIob2JqZWN0LCB7IHBpY2sgPSBbXSwgb21pdCA9IFtdLCBlbXB0eVBpY2sgPSAnYWxsJywgc2VwYXJhdG9yID0gJywnLCBzeW1ib2wgPSB0cnVlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IHRydWUgfSA9IHt9KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIC8vIHBpY2vjgIFvbWl0IOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIHBpY2sgPSBTdXBwb3J0Lm5hbWVzVG9BcnJheShwaWNrLCB7IHNlcGFyYXRvciB9KTtcbiAgICBvbWl0ID0gU3VwcG9ydC5uYW1lc1RvQXJyYXkob21pdCwgeyBzZXBhcmF0b3IgfSk7XG4gICAgbGV0IF9rZXlzID0gW107XG4gICAgLy8gcGlja+acieWAvOebtOaOpeaLv++8jOS4uuepuuaXtuagueaNriBlbXB0eVBpY2sg6buY6K6k5ou/56m65oiW5YWo6YOoa2V5XG4gICAgX2tleXMgPSBwaWNrLmxlbmd0aCA+IDAgfHwgZW1wdHlQaWNrID09PSAnZW1wdHknID8gcGljayA6IHRoaXMua2V5cyhvYmplY3QsIHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfSk7XG4gICAgLy8gb21pdOetm+mAiVxuICAgIF9rZXlzID0gX2tleXMuZmlsdGVyKGtleSA9PiAhb21pdC5pbmNsdWRlcyhrZXkpKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBfa2V5cykge1xuICAgICAgY29uc3QgZGVzYyA9IHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG4gICAgICAvLyDlsZ7mgKfkuI3lrZjlnKjlr7zoh7RkZXNj5b6X5YiwdW5kZWZpbmVk5pe25LiN6K6+572u5YC8XG4gICAgICBpZiAoZGVzYykge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDpgJrov4fmjJHpgInmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXIg55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgcGljayhvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBwaWNrOiBrZXlzLCBlbXB0eVBpY2s6ICdlbXB0eScsIC4uLm9wdGlvbnMgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOmAmui/h+aOkumZpOaWueW8j+mAieWPluWvueixoeOAgmZpbHRlciDnmoTnroDlhpnmlrnlvI9cbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIGtleXMg5bGe5oCn5ZCN6ZuG5ZCIXG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBvbWl0KG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIob2JqZWN0LCB7IG9taXQ6IGtleXMsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0ge30pIHtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmFzc2lnbih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICAvLyBfX3Byb3RvX18gW+e7p+aJv11cbiAgLy8gX19kZWZpbmVHZXR0ZXJfXyBb57un5om/XVxuICAvLyBfX2RlZmluZVNldHRlcl9fIFvnu6fmib9dXG4gIC8vIF9fbG9va3VwR2V0dGVyX18gW+e7p+aJv11cbiAgLy8gX19sb29rdXBTZXR0ZXJfXyBb57un5om/XVxuICAvLyBpc1Byb3RvdHlwZU9mIFvnu6fmib9dXG4gIC8vIGhhc093blByb3BlcnR5IFvnu6fmib9dXG4gIC8vIHByb3BlcnR5SXNFbnVtZXJhYmxlIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gW+aWsOWinl1cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIE5hTjtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b1N0cmluZygpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7fSk7XG4gICAgfVxuICB9XG4gIC8vIHRvTG9jYWxlU3RyaW5nIFvnu6fmib9dXG4gIC8vIFvmlrDlop5dXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcykubGVuZ3RoID4gMDtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gdmFsdWVPZiBb57un5om/XVxufVxuT2JqZWN0LnNldFByb3RvdHlwZU9mKF9PYmplY3QsIE9iamVjdCk7XG4iLCJleHBvcnQgY2xhc3MgX1N0cmluZyBleHRlbmRzIFN0cmluZyB7XG4gIC8qKlxuICAgKiBTdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBmcm9tQ2hhckNvZGUgW+e7p+aJv11cbiAgLy8gc3RhdGljIGZyb21Db2RlUG9pbnQgW+e7p+aJv11cbiAgLy8gc3RhdGljIHJhdyBb57un5om/XVxuXG4gIC8qKlxuICAgKiBb5paw5aKeXSDpppblrZfmr43lpKflhplcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0ZpcnN0VXBwZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9VcHBlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g6aaW5a2X5q+N5bCP5YaZXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvRmlyc3RMb3dlckNhc2UobmFtZSA9ICcnKSB7XG4gICAgcmV0dXJuIGAkeyhuYW1lWzBdID8/ICcnKS50b0xvd2VyQ2FzZSgpfSR7bmFtZS5zbGljZSgxKX1gO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDovazpqbzls7Dlkb3lkI3jgILluLjnlKjkuo7ov57mjqXnrKblkb3lkI3ovazpqbzls7Dlkb3lkI3vvIzlpoIgeHgtbmFtZSAtPiB4eE5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ym44CC55So5LqO55Sf5oiQ5q2j5YiZIOm7mOiupOS4uuS4reWIkue6vyAtIOWvueW6lHJlZ2V4cOW+l+WIsCAvLShcXHcpL2dcbiAgICogQHBhcmFtIGZpcnN0IOmmluWtl+avjeWkhOeQhuaWueW8j+OAgnRydWUg5oiWICd1cHBlcmNhc2Un77ya6L2s5o2i5oiQ5aSn5YaZO1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIOaIliAnbG93ZXJjYXNlJ++8mui9rOaNouaIkOWwj+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAncmF3JyDmiJYg5YW25LuW5peg5pWI5YC877ya6buY6K6k5Y6f5qC36L+U5Zue77yM5LiN6L+b6KGM5aSE55CGO1xuICAgKiBAcmV0dXJucyB7TWFnaWNTdHJpbmd8c3RyaW5nfHN0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0NhbWVsQ2FzZShuYW1lLCB7IHNlcGFyYXRvciA9ICctJywgZmlyc3QgPSAncmF3JyB9ID0ge30pIHtcbiAgICAvLyDnlJ/miJDmraPliJlcbiAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke3NlcGFyYXRvcn0oXFxcXHcpYCwgJ2cnKTtcbiAgICAvLyDmi7zmjqXmiJDpqbzls7BcbiAgICBjb25zdCBjYW1lbE5hbWUgPSBuYW1lLnJlcGxhY2VBbGwocmVnZXhwLCAoc3Vic3RyLCAkMSkgPT4ge1xuICAgICAgcmV0dXJuICQxLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG4gICAgLy8g6aaW5a2X5q+N5aSn5bCP5YaZ5qC55o2u5Lyg5Y+C5Yik5patXG4gICAgaWYgKFt0cnVlLCAndXBwZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0ZpcnN0VXBwZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIGlmIChbZmFsc2UsICdsb3dlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvRmlyc3RMb3dlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbWVsTmFtZTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g6L2s6L+e5o6l56ym5ZG95ZCN44CC5bi455So5LqO6am85bOw5ZG95ZCN6L2s6L+e5o6l56ym5ZG95ZCN77yM5aaCIHh4TmFtZSAtPiB4eC1uYW1lXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOi/nuaOpeesplxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvTGluZUNhc2UobmFtZSA9ICcnLCB7IHNlcGFyYXRvciA9ICctJyB9ID0ge30pIHtcbiAgICByZXR1cm4gbmFtZVxuICAgIC8vIOaMiei/nuaOpeespuaLvOaOpVxuICAgICAgLnJlcGxhY2VBbGwoLyhbYS16XSkoW0EtWl0pL2csIGAkMSR7c2VwYXJhdG9yfSQyYClcbiAgICAvLyDovazlsI/lhplcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHN1cGVyKHZhbHVlKTtcbiAgfVxuXG4gIC8vIGFuY2hvciDnu6fmib9cbiAgLy8gYmlnIOe7p+aJv1xuICAvLyBibGluayDnu6fmib9cbiAgLy8gYm9sZCDnu6fmib9cbiAgLy8gZml4ZWQg57un5om/XG4gIC8vIGZvbnRjb2xvciDnu6fmib9cbiAgLy8gZm9udHNpemUg57un5om/XG4gIC8vIGl0YWxpY3Mg57un5om/XG4gIC8vIGxpbmsg57un5om/XG4gIC8vIHNtYWxsIOe7p+aJv1xuICAvLyBzdHJpa2Ug57un5om/XG4gIC8vIHN1YiDnu6fmib9cbiAgLy8gc3VwIOe7p+aJv1xuXG4gIC8vIFtTeW1ib2wuaXRlcmF0b3JdIOe7p+aJv1xuICAvLyBsZW5ndGgg57un5om/XG4gIC8vIHNwbGl0IOe7p+aJv1xuICAvLyBtYXRjaCDnu6fmib9cbiAgLy8gbWF0Y2hBbGwg57un5om/XG5cbiAgLy8gYXQg57un5om/XG4gIC8vIGNoYXJBdCDnu6fmib9cbiAgLy8gY2hhckNvZGVBdCDnu6fmib9cbiAgLy8gY29kZVBvaW50QXQg57un5om/XG4gIC8vIGluZGV4T2Yg57un5om/XG4gIC8vIGxhc3RJbmRleE9mIOe7p+aJv1xuICAvLyBzZWFyY2gg57un5om/XG4gIC8vIGluY2x1ZGVzIOe7p+aJv1xuICAvLyBzdGFydHNXaXRoIOe7p+aJv1xuICAvLyBlbmRzV2l0aCDnu6fmib9cblxuICAvLyBzbGljZSDnu6fmib9cbiAgLy8gc3Vic3RyaW5nIOe7p+aJv1xuICAvLyBzdWJzdHIg57un5om/XG4gIC8vIGNvbmNhdCDnu6fmib9cbiAgLy8gdHJpbSDnu6fmib9cbiAgLy8gdHJpbVN0YXJ0IOe7p+aJv1xuICAvLyB0cmltRW5kIOe7p+aJv1xuICAvLyB0cmltTGVmdCDnu6fmib9cbiAgLy8gdHJpbVJpZ2h0IOe7p+aJv1xuICAvLyBwYWRTdGFydCDnu6fmib9cbiAgLy8gcGFkRW5kIOe7p+aJv1xuICAvLyByZXBlYXQg57un5om/XG4gIC8vIHJlcGxhY2Ug57un5om/XG4gIC8vIHJlcGxhY2VBbGwg57un5om/XG4gIC8vIHRvTG93ZXJDYXNlIOe7p+aJv1xuICAvLyB0b1VwcGVyQ2FzZSDnu6fmib9cbiAgLy8gdG9Mb2NhbGVMb3dlckNhc2Ug57un5om/XG4gIC8vIHRvTG9jYWxlVXBwZXJDYXNlIOe7p+aJv1xuICAvLyBsb2NhbGVDb21wYXJlIOe7p+aJv1xuICAvLyBub3JtYWxpemUg57un5om/XG4gIC8vIGlzV2VsbEZvcm1lZCDnu6fmib9cbiAgLy8gdG9XZWxsRm9ybWVkIOe7p+aJv1xuXG4gIC8vIHRvU3RyaW5nIOe7p+aJv1xuICAvLyB2YWx1ZU9mIOe7p+aJv1xufVxuIiwiLy8g5qC35byP5aSE55CGXG5leHBvcnQgY29uc3QgU3R5bGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vKipcbiAqIOWNleS9jeWtl+espuS4suOAguWvueaVsOWtl+aIluaVsOWtl+agvOW8j+eahOWtl+espuS4suiHquWKqOaLvOWNleS9je+8jOWFtuS7luWtl+espuS4suWOn+agt+i/lOWbnlxuICogQHBhcmFtIHZhbHVlIOWAvFxuICogQHBhcmFtIHVuaXQg5Y2V5L2N44CCdmFsdWXmsqHluKbljZXkvY3ml7boh6rliqjmi7zmjqXvvIzlj6/kvKAgcHgvZW0vJSDnrYlcbiAqIEByZXR1cm5zIHtzdHJpbmd8c3RyaW5nfVxuICovXG5TdHlsZS5nZXRVbml0U3RyaW5nID0gZnVuY3Rpb24odmFsdWUgPSAnJywgeyB1bml0ID0gJ3B4JyB9ID0ge30pIHtcbiAgaWYgKHZhbHVlID09PSAnJykge1xuICAgIHJldHVybiAnJztcbiAgfVxuICAvLyDms6jmhI/vvJrov5nph4zkvb/nlKggPT0g5Yik5pat77yM5LiN5L2/55SoID09PVxuICByZXR1cm4gTnVtYmVyKHZhbHVlKSA9PSB2YWx1ZSA/IGAke3ZhbHVlfSR7dW5pdH1gIDogU3RyaW5nKHZhbHVlKTtcbn07XG4iLCIvLyB2dWUg5pWw5o2u5aSE55CGXG5pbXBvcnQgeyBfU3RyaW5nIH0gZnJvbSAnLi9fU3RyaW5nJztcbmltcG9ydCB7IERhdGEgfSBmcm9tICcuL0RhdGEnO1xuXG5leHBvcnQgY29uc3QgVnVlRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICAgKiDmt7Hop6PljIUgdnVlMyDlk43lupTlvI/lr7nosaHmlbDmja5cbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHJldHVybnMge3tbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106ICp9fXwqfCgqfHtbcDogc3RyaW5nXTogKn0pW118e1twOiBzdHJpbmddOiAqfX1cbiAgICovXG5WdWVEYXRhLmRlZXBVbndyYXBWdWUzID0gZnVuY3Rpb24oZGF0YSkge1xuICByZXR1cm4gRGF0YS5kZWVwVW53cmFwKGRhdGEsIHtcbiAgICBpc1dyYXA6IGRhdGEgPT4gZGF0YT8uX192X2lzUmVmLFxuICAgIHVud3JhcDogZGF0YSA9PiBkYXRhLnZhbHVlLFxuICB9KTtcbn07XG5cbi8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+WIHByb3BzIOWumuS5ieeahOWxnuaAp1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBwcm9wRGVmaW5pdGlvbnMgcHJvcHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuVnVlRGF0YS5nZXRQcm9wc0Zyb21BdHRycyA9IGZ1bmN0aW9uKGF0dHJzLCBwcm9wRGVmaW5pdGlvbnMpIHtcbiAgLy8gcHJvcHMg5a6a5LmJ57uf5LiA5oiQ5a+56LGh5qC85byP77yMdHlwZSDnu5/kuIDmiJDmlbDnu4TmoLzlvI/ku6Xkvr/lkI7nu63liKTmlq1cbiAgaWYgKHByb3BEZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcHJvcERlZmluaXRpb25zID0gT2JqZWN0LmZyb21FbnRyaWVzKHByb3BEZWZpbml0aW9ucy5tYXAobmFtZSA9PiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgeyB0eXBlOiBbXSB9XSkpO1xuICB9IGVsc2UgaWYgKERhdGEuaXNQbGFpbk9iamVjdChwcm9wRGVmaW5pdGlvbnMpKSB7XG4gICAgcHJvcERlZmluaXRpb25zID0gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykubWFwKChbbmFtZSwgZGVmaW5pdGlvbl0pID0+IHtcbiAgICAgIGRlZmluaXRpb24gPSBEYXRhLmlzUGxhaW5PYmplY3QoZGVmaW5pdGlvbilcbiAgICAgICAgPyB7IC4uLmRlZmluaXRpb24sIHR5cGU6IFtkZWZpbml0aW9uLnR5cGVdLmZsYXQoKSB9XG4gICAgICAgIDogeyB0eXBlOiBbZGVmaW5pdGlvbl0uZmxhdCgpIH07XG4gICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIGRlZmluaXRpb25dO1xuICAgIH0pKTtcbiAgfSBlbHNlIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSB7fTtcbiAgfVxuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IFtuYW1lLCBkZWZpbml0aW9uXSBvZiBPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpKSB7XG4gICAgKGZ1bmN0aW9uIHNldFJlc3VsdCh7IG5hbWUsIGRlZmluaXRpb24sIGVuZCA9IGZhbHNlIH0pIHtcbiAgICAgIC8vIHByb3BOYW1lIOaIliBwcm9wLW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICBjb25zdCBhdHRyVmFsdWUgPSBhdHRyc1tuYW1lXTtcbiAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgLy8g5Y+q5YyF5ZCrQm9vbGVhbuexu+Wei+eahCcn6L2s5o2i5Li6dHJ1Ze+8jOWFtuS7luWOn+agt+i1i+WAvFxuICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGRlZmluaXRpb24udHlwZS5sZW5ndGggPT09IDEgJiYgZGVmaW5pdGlvbi50eXBlLmluY2x1ZGVzKEJvb2xlYW4pICYmIGF0dHJWYWx1ZSA9PT0gJycgPyB0cnVlIDogYXR0clZhbHVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBwcm9wLW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICBpZiAoZW5kKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNldFJlc3VsdCh7IG5hbWU6IF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKSwgZGVmaW5pdGlvbiwgZW5kOiB0cnVlIH0pO1xuICAgIH0pKHtcbiAgICAgIG5hbWUsIGRlZmluaXRpb24sXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBlbWl0cyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gZW1pdERlZmluaXRpb25zIGVtaXRzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0RW1pdHNGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgZW1pdERlZmluaXRpb25zKSB7XG4gIC8vIGVtaXRzIOWumuS5iee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGVtaXREZWZpbml0aW9ucykpIHtcbiAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICB9IGVsc2UgaWYgKCEoZW1pdERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgZW1pdERlZmluaXRpb25zID0gW107XG4gIH1cbiAgLy8g57uf5LiA5aSE55CG5oiQIG9uRW1pdE5hbWXjgIFvblVwZGF0ZTplbWl0TmFtZSh2LW1vZGVs57O75YiXKSDmoLzlvI9cbiAgY29uc3QgZW1pdE5hbWVzID0gZW1pdERlZmluaXRpb25zLm1hcChuYW1lID0+IF9TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKSk7XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBlbWl0TmFtZXMpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgnb25VcGRhdGU6JykpIHtcbiAgICAgICAgLy8gb25VcGRhdGU6ZW1pdE5hbWUg5oiWIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSBfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgaWYgKGVuZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UobmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpKX1gLCBlbmQ6IHRydWUgfSk7XG4gICAgICB9XG4gICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICByZXN1bHRbbmFtZV0gPSBhdHRyc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9KSh7IG5hbWUgfSk7XG4gIH1cbiAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5bliankvZnlsZ7mgKfjgILluLjnlKjkuo7nu4Tku7YgaW5oZXJpdEF0dHJzIOiuvue9riBmYWxzZSDml7bkvb/nlKjkvZzkuLrmlrDnmoQgYXR0cnNcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcHMgcHJvcHMg5a6a5LmJIOaIliB2dWUgcHJvcHPvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqIEBwYXJhbSBlbWl0cyBlbWl0cyDlrprkuYkg5oiWIHZ1ZSBlbWl0c++8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogQHBhcmFtIGxpc3Qg6aKd5aSW55qE5pmu6YCa5bGe5oCnXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldFJlc3RGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgeyBwcm9wcywgZW1pdHMsIGxpc3QgPSBbXSB9ID0ge30pIHtcbiAgLy8g57uf5LiA5oiQ5pWw57uE5qC85byPXG4gIHByb3BzID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSAoKCkgPT4ge1xuICAgICAgaWYgKHByb3BzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgfVxuICAgICAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChwcm9wcykpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9KSgpO1xuICAgIHJldHVybiBhcnIubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgfSkoKTtcbiAgZW1pdHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAoZW1pdHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gZW1pdHM7XG4gICAgICB9XG4gICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGVtaXRzKSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZW1pdHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGFyci5tYXAoKG5hbWUpID0+IHtcbiAgICAgIC8vIHVwZGF0ZTplbWl0TmFtZSDmiJYgdXBkYXRlOmVtaXQtbmFtZSDmoLzlvI9cbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ3VwZGF0ZTonKSkge1xuICAgICAgICBjb25zdCBwYXJ0TmFtZSA9IG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKTtcbiAgICAgICAgcmV0dXJuIFtgb25VcGRhdGU6JHtfU3RyaW5nLnRvQ2FtZWxDYXNlKHBhcnROYW1lKX1gLCBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UocGFydE5hbWUpfWBdO1xuICAgICAgfVxuICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCldO1xuICAgIH0pLmZsYXQoKTtcbiAgfSkoKTtcbiAgbGlzdCA9ICgoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gdHlwZW9mIGxpc3QgPT09ICdzdHJpbmcnXG4gICAgICA/IGxpc3Quc3BsaXQoJywnKVxuICAgICAgOiBsaXN0IGluc3RhbmNlb2YgQXJyYXkgPyBsaXN0IDogW107XG4gICAgcmV0dXJuIGFyci5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgfSkoKTtcbiAgY29uc3QgbGlzdEFsbCA9IEFycmF5LmZyb20obmV3IFNldChbcHJvcHMsIGVtaXRzLCBsaXN0XS5mbGF0KCkpKTtcbiAgLy8gY29uc29sZS5sb2coJ2xpc3RBbGwnLCBsaXN0QWxsKTtcbiAgLy8g6K6+572u5YC8XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBbbmFtZSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoYXR0cnMpKSkge1xuICAgIGlmICghbGlzdEFsbC5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgbmFtZSwgZGVzYyk7XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIOWfuuehgOaooeWdl+OAguacieWQjOWQjeWOn+eUn+WvueixoeeahOWKoCBfIOWMuuWIhlxuZXhwb3J0ICogZnJvbSAnLi9fQXJyYXknO1xuZXhwb3J0ICogZnJvbSAnLi9fRGF0ZSc7XG5leHBvcnQgKiBmcm9tICcuL19NYXRoJztcbmV4cG9ydCAqIGZyb20gJy4vX051bWJlcic7XG5leHBvcnQgKiBmcm9tICcuL19PYmplY3QnO1xuZXhwb3J0ICogZnJvbSAnLi9fUmVmbGVjdCc7XG5leHBvcnQgKiBmcm9tICcuL19TZXQnO1xuZXhwb3J0ICogZnJvbSAnLi9fU3RyaW5nJztcblxuZXhwb3J0ICogZnJvbSAnLi9EYXRhJztcbmV4cG9ydCAqIGZyb20gJy4vU3R5bGUnO1xuZXhwb3J0ICogZnJvbSAnLi9TdXBwb3J0JztcbmV4cG9ydCAqIGZyb20gJy4vVnVlRGF0YSc7XG4iLCIvKipcbiAqIGVzbGludCDphY3nva7vvJpodHRwOi8vZXNsaW50LmNuL2RvY3MvcnVsZXMvXG4gKiBlc2xpbnQtcGx1Z2luLXZ1ZSDphY3nva7vvJpodHRwczovL2VzbGludC52dWVqcy5vcmcvcnVsZXMvXG4gKi9cbmltcG9ydCB7IF9PYmplY3QsIERhdGEgfSBmcm9tICcuLi9iYXNlJztcblxuLyoqXG4gKiDlr7zlh7rluLjph4/kvr/mjbfkvb/nlKhcbiAqL1xuZXhwb3J0IGNvbnN0IE9GRiA9ICdvZmYnO1xuZXhwb3J0IGNvbnN0IFdBUk4gPSAnd2Fybic7XG5leHBvcnQgY29uc3QgRVJST1IgPSAnZXJyb3InO1xuLyoqXG4gKiDlrprliLbnmoTphY3nva5cbiAqL1xuLy8g5Z+656GA5a6a5Yi2XG5leHBvcnQgY29uc3QgYmFzZUNvbmZpZyA9IHtcbiAgLy8g546v5aKD44CC5LiA5Liq546v5aKD5a6a5LmJ5LqG5LiA57uE6aKE5a6a5LmJ55qE5YWo5bGA5Y+Y6YePXG4gIGVudjoge1xuICAgIGJyb3dzZXI6IHRydWUsXG4gICAgbm9kZTogdHJ1ZSxcbiAgfSxcbiAgLy8g5YWo5bGA5Y+Y6YePXG4gIGdsb2JhbHM6IHtcbiAgICBnbG9iYWxUaGlzOiAncmVhZG9ubHknLFxuICAgIEJpZ0ludDogJ3JlYWRvbmx5JyxcbiAgfSxcbiAgLy8g6Kej5p6Q5ZmoXG4gIHBhcnNlck9wdGlvbnM6IHtcbiAgICBlY21hVmVyc2lvbjogJ2xhdGVzdCcsXG4gICAgc291cmNlVHlwZTogJ21vZHVsZScsXG4gICAgZWNtYUZlYXR1cmVzOiB7XG4gICAgICBqc3g6IHRydWUsXG4gICAgICBleHBlcmltZW50YWxPYmplY3RSZXN0U3ByZWFkOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIC8qKlxuICAgKiDnu6fmib9cbiAgICog5L2/55SoZXNsaW5055qE6KeE5YiZ77yaZXNsaW50OumFjee9ruWQjeensFxuICAgKiDkvb/nlKjmj5Lku7bnmoTphY3nva7vvJpwbHVnaW465YyF5ZCN566A5YaZL+mFjee9ruWQjeensFxuICAgKi9cbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCBlc2xpbnQg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ2VzbGludDpyZWNvbW1lbmRlZCcsXG4gIF0sXG4gIC8qKlxuICAgKiDop4TliJlcbiAgICog5p2l6IeqIGVzbGludCDnmoTop4TliJnvvJrop4TliJlJRCA6IHZhbHVlXG4gICAqIOadpeiHquaPkuS7tueahOinhOWIme+8muWMheWQjeeugOWGmS/op4TliJlJRCA6IHZhbHVlXG4gICAqL1xuICBydWxlczoge1xuICAgIC8qKlxuICAgICAqIFBvc3NpYmxlIEVycm9yc1xuICAgICAqIOi/meS6m+inhOWImeS4jiBKYXZhU2NyaXB0IOS7o+eggeS4reWPr+iDveeahOmUmeivr+aIlumAu+i+kemUmeivr+acieWFs++8mlxuICAgICAqL1xuICAgICdnZXR0ZXItcmV0dXJuJzogT0ZGLCAvLyDlvLrliLYgZ2V0dGVyIOWHveaVsOS4reWHuueOsCByZXR1cm4g6K+t5Y+lXG4gICAgJ25vLWNvbnN0YW50LWNvbmRpdGlvbic6IE9GRiwgLy8g56aB5q2i5Zyo5p2h5Lu25Lit5L2/55So5bi46YeP6KGo6L6+5byPXG4gICAgJ25vLWVtcHR5JzogT0ZGLCAvLyDnpoHmraLlh7rnjrDnqbror63lj6XlnZdcbiAgICAnbm8tZXh0cmEtc2VtaSc6IFdBUk4sIC8vIOemgeatouS4jeW/heimgeeahOWIhuWPt1xuICAgICduby1mdW5jLWFzc2lnbic6IE9GRiwgLy8g56aB5q2i5a+5IGZ1bmN0aW9uIOWjsOaYjumHjeaWsOi1i+WAvFxuICAgICduby1wcm90b3R5cGUtYnVpbHRpbnMnOiBPRkYsIC8vIOemgeatouebtOaOpeiwg+eUqCBPYmplY3QucHJvdG90eXBlcyDnmoTlhoXnva7lsZ7mgKdcblxuICAgIC8qKlxuICAgICAqIEJlc3QgUHJhY3RpY2VzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5piv5YWz5LqO5pyA5L2z5a6e6Le155qE77yM5biu5Yqp5L2g6YG/5YWN5LiA5Lqb6Zeu6aKY77yaXG4gICAgICovXG4gICAgJ2FjY2Vzc29yLXBhaXJzJzogRVJST1IsIC8vIOW8uuWItiBnZXR0ZXIg5ZKMIHNldHRlciDlnKjlr7nosaHkuK3miJDlr7nlh7rnjrBcbiAgICAnYXJyYXktY2FsbGJhY2stcmV0dXJuJzogV0FSTiwgLy8g5by65Yi25pWw57uE5pa55rOV55qE5Zue6LCD5Ye95pWw5Lit5pyJIHJldHVybiDor63lj6VcbiAgICAnYmxvY2stc2NvcGVkLXZhcic6IEVSUk9SLCAvLyDlvLrliLbmiorlj5jph4/nmoTkvb/nlKjpmZDliLblnKjlhbblrprkuYnnmoTkvZznlKjln5/ojIPlm7TlhoVcbiAgICAnY3VybHknOiBXQVJOLCAvLyDlvLrliLbmiYDmnInmjqfliLbor63lj6Xkvb/nlKjkuIDoh7TnmoTmi6zlj7fpo47moLxcbiAgICAnbm8tZmFsbHRocm91Z2gnOiBXQVJOLCAvLyDnpoHmraIgY2FzZSDor63lj6XokL3nqbpcbiAgICAnbm8tZmxvYXRpbmctZGVjaW1hbCc6IEVSUk9SLCAvLyDnpoHmraLmlbDlrZflrZfpnaLph4/kuK3kvb/nlKjliY3lr7zlkozmnKvlsL7lsI/mlbDngrlcbiAgICAnbm8tbXVsdGktc3BhY2VzJzogV0FSTiwgLy8g56aB5q2i5L2/55So5aSa5Liq56m65qC8XG4gICAgJ25vLW5ldy13cmFwcGVycyc6IEVSUk9SLCAvLyDnpoHmraLlr7kgU3RyaW5n77yMTnVtYmVyIOWSjCBCb29sZWFuIOS9v+eUqCBuZXcg5pON5L2c56ymXG4gICAgJ25vLXByb3RvJzogRVJST1IsIC8vIOemgeeUqCBfX3Byb3RvX18g5bGe5oCnXG4gICAgJ25vLXJldHVybi1hc3NpZ24nOiBXQVJOLCAvLyDnpoHmraLlnKggcmV0dXJuIOivreWPpeS4reS9v+eUqOi1i+WAvOivreWPpVxuICAgICduby11c2VsZXNzLWVzY2FwZSc6IFdBUk4sIC8vIOemgeeUqOS4jeW/heimgeeahOi9rOS5ieWtl+esplxuXG4gICAgLyoqXG4gICAgICogVmFyaWFibGVzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5LiO5Y+Y6YeP5aOw5piO5pyJ5YWz77yaXG4gICAgICovXG4gICAgJ25vLXVuZGVmLWluaXQnOiBXQVJOLCAvLyDnpoHmraLlsIblj5jph4/liJ3lp4vljJbkuLogdW5kZWZpbmVkXG4gICAgJ25vLXVudXNlZC12YXJzJzogT0ZGLCAvLyDnpoHmraLlh7rnjrDmnKrkvb/nlKjov4fnmoTlj5jph49cbiAgICAnbm8tdXNlLWJlZm9yZS1kZWZpbmUnOiBbRVJST1IsIHsgJ2Z1bmN0aW9ucyc6IGZhbHNlLCAnY2xhc3Nlcyc6IGZhbHNlLCAndmFyaWFibGVzJzogZmFsc2UgfV0sIC8vIOemgeatouWcqOWPmOmHj+WumuS5ieS5i+WJjeS9v+eUqOWug+S7rFxuXG4gICAgLyoqXG4gICAgICogU3R5bGlzdGljIElzc3Vlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6jumjjuagvOaMh+WNl+eahO+8jOiAjOS4lOaYr+mdnuW4uOS4u+ingueahO+8mlxuICAgICAqL1xuICAgICdhcnJheS1icmFja2V0LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbmlbDnu4Tmlrnmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnYmxvY2stc3BhY2luZyc6IFdBUk4sIC8vIOemgeatouaIluW8uuWItuWcqOS7o+eggeWdl+S4reW8gOaLrOWPt+WJjeWSjOmXreaLrOWPt+WQjuacieepuuagvFxuICAgICdicmFjZS1zdHlsZSc6IFtXQVJOLCAnMXRicycsIHsgJ2FsbG93U2luZ2xlTGluZSc6IHRydWUgfV0sIC8vIOW8uuWItuWcqOS7o+eggeWdl+S4reS9v+eUqOS4gOiHtOeahOWkp+aLrOWPt+mjjuagvFxuICAgICdjb21tYS1kYW5nbGUnOiBbV0FSTiwgJ2Fsd2F5cy1tdWx0aWxpbmUnXSwgLy8g6KaB5rGC5oiW56aB5q2i5pyr5bC+6YCX5Y+3XG4gICAgJ2NvbW1hLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjpgJflj7fliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnY29tbWEtc3R5bGUnOiBXQVJOLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTpgJflj7fpo47moLxcbiAgICAnY29tcHV0ZWQtcHJvcGVydHktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOiuoeeul+eahOWxnuaAp+eahOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdmdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouWcqOWHveaVsOagh+ivhuespuWSjOWFtuiwg+eUqOS5i+mXtOacieepuuagvFxuICAgICdmdW5jdGlvbi1wYXJlbi1uZXdsaW5lJzogV0FSTiwgLy8g5by65Yi25Zyo5Ye95pWw5ous5Y+35YaF5L2/55So5LiA6Ie055qE5o2i6KGMXG4gICAgJ2ltcGxpY2l0LWFycm93LWxpbmVicmVhayc6IFdBUk4sIC8vIOW8uuWItumakOW8j+i/lOWbnueahOeureWktOWHveaVsOS9k+eahOS9jee9rlxuICAgICdpbmRlbnQnOiBbV0FSTiwgMiwgeyAnU3dpdGNoQ2FzZSc6IDEgfV0sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOe8qei/m1xuICAgICdqc3gtcXVvdGVzJzogV0FSTiwgLy8g5by65Yi25ZyoIEpTWCDlsZ7mgKfkuK3kuIDoh7TlnLDkvb/nlKjlj4zlvJXlj7fmiJbljZXlvJXlj7dcbiAgICAna2V5LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlr7nosaHlrZfpnaLph4/nmoTlsZ7mgKfkuK3plK7lkozlgLzkuYvpl7Tkvb/nlKjkuIDoh7TnmoTpl7Tot51cbiAgICAna2V5d29yZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo5YWz6ZSu5a2X5YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ25ldy1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLbmiJbnpoHmraLosIPnlKjml6Dlj4LmnoTpgKDlh73mlbDml7bmnInlnIbmi6zlj7dcbiAgICAnbm8tbWl4ZWQtc3BhY2VzLWFuZC10YWJzJzogV0FSTixcbiAgICAnbm8tbXVsdGlwbGUtZW1wdHktbGluZXMnOiBbV0FSTiwgeyAnbWF4JzogMSwgJ21heEVPRic6IDAsICdtYXhCT0YnOiAwIH1dLCAvLyDnpoHmraLlh7rnjrDlpJrooYznqbrooYxcbiAgICAnbm8tdHJhaWxpbmctc3BhY2VzJzogV0FSTiwgLy8g56aB55So6KGM5bC+56m65qC8XG4gICAgJ25vLXdoaXRlc3BhY2UtYmVmb3JlLXByb3BlcnR5JzogV0FSTiwgLy8g56aB5q2i5bGe5oCn5YmN5pyJ56m655m9XG4gICAgJ25vbmJsb2NrLXN0YXRlbWVudC1ib2R5LXBvc2l0aW9uJzogV0FSTiwgLy8g5by65Yi25Y2V5Liq6K+t5Y+l55qE5L2N572uXG4gICAgJ29iamVjdC1jdXJseS1uZXdsaW5lJzogW1dBUk4sIHsgJ211bHRpbGluZSc6IHRydWUsICdjb25zaXN0ZW50JzogdHJ1ZSB9XSwgLy8g5by65Yi25aSn5ous5Y+35YaF5o2i6KGM56ym55qE5LiA6Ie05oCnXG4gICAgJ29iamVjdC1jdXJseS1zcGFjaW5nJzogW1dBUk4sICdhbHdheXMnXSwgLy8g5by65Yi25Zyo5aSn5ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3BhZGRlZC1ibG9ja3MnOiBbV0FSTiwgJ25ldmVyJ10sIC8vIOimgeaxguaIluemgeatouWdl+WGheWhq+WFhVxuICAgICdxdW90ZXMnOiBbV0FSTiwgJ3NpbmdsZScsIHsgJ2F2b2lkRXNjYXBlJzogdHJ1ZSwgJ2FsbG93VGVtcGxhdGVMaXRlcmFscyc6IHRydWUgfV0sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOWPjeWLvuWPt+OAgeWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdzZW1pJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5L2/55So5YiG5Y+35Luj5pu/IEFTSVxuICAgICdzZW1pLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbliIblj7fkuYvliY3lkozkuYvlkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc2VtaS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+eahOS9jee9rlxuICAgICdzcGFjZS1iZWZvcmUtYmxvY2tzJzogV0FSTiwgLy8g5by65Yi25Zyo5Z2X5LmL5YmN5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWJlZm9yZS1mdW5jdGlvbi1wYXJlbic6IFtXQVJOLCB7ICdhbm9ueW1vdXMnOiAnbmV2ZXInLCAnbmFtZWQnOiAnbmV2ZXInLCAnYXN5bmNBcnJvdyc6ICdhbHdheXMnIH1dLCAvLyDlvLrliLblnKggZnVuY3Rpb27nmoTlt6bmi6zlj7fkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW4tcGFyZW5zJzogV0FSTiwgLy8g5by65Yi25Zyo5ZyG5ous5Y+35YaF5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWluZml4LW9wcyc6IFdBUk4sIC8vIOimgeaxguaTjeS9nOespuWRqOWbtOacieepuuagvFxuICAgICdzcGFjZS11bmFyeS1vcHMnOiBXQVJOLCAvLyDlvLrliLblnKjkuIDlhYPmk43kvZznrKbliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2VkLWNvbW1lbnQnOiBXQVJOLCAvLyDlvLrliLblnKjms6jph4rkuK0gLy8g5oiWIC8qIOS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzd2l0Y2gtY29sb24tc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqCBzd2l0Y2gg55qE5YaS5Y+35bem5Y+z5pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLXRhZy1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5qih5p2/5qCH6K6w5ZKM5a6D5Lus55qE5a2X6Z2i6YeP5LmL6Ze055qE56m65qC8XG5cbiAgICAvKipcbiAgICAgKiBFQ01BU2NyaXB0IDZcbiAgICAgKiDov5nkupvop4TliJnlj6rkuI4gRVM2IOacieWFsywg5Y2z6YCa5bi45omA6K+055qEIEVTMjAxNe+8mlxuICAgICAqL1xuICAgICdhcnJvdy1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi2566t5aS05Ye95pWw55qE566t5aS05YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2dlbmVyYXRvci1zdGFyLXNwYWNpbmcnOiBbV0FSTiwgeyAnYmVmb3JlJzogZmFsc2UsICdhZnRlcic6IHRydWUsICdtZXRob2QnOiB7ICdiZWZvcmUnOiB0cnVlLCAnYWZ0ZXInOiBmYWxzZSB9IH1dLCAvLyDlvLrliLYgZ2VuZXJhdG9yIOWHveaVsOS4rSAqIOWPt+WRqOWbtOS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICduby11c2VsZXNzLXJlbmFtZSc6IFdBUk4sIC8vIOemgeatouWcqCBpbXBvcnQg5ZKMIGV4cG9ydCDlkozop6PmnoTotYvlgLzml7blsIblvJXnlKjph43lkb3lkI3kuLrnm7jlkIznmoTlkI3lrZdcbiAgICAncHJlZmVyLXRlbXBsYXRlJzogV0FSTiwgLy8g6KaB5rGC5L2/55So5qih5p2/5a2X6Z2i6YeP6ICM6Z2e5a2X56ym5Liy6L+e5o6lXG4gICAgJ3Jlc3Qtc3ByZWFkLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbliankvZnlkozmianlsZXov5DnrpfnrKblj4rlhbbooajovr7lvI/kuYvpl7TmnInnqbrmoLxcbiAgICAndGVtcGxhdGUtY3VybHktc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouaooeadv+Wtl+espuS4suS4reeahOW1jOWFpeihqOi+vuW8j+WRqOWbtOepuuagvOeahOS9v+eUqFxuICAgICd5aWVsZC1zdGFyLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKggeWllbGQqIOihqOi+vuW8j+S4rSAqIOWRqOWbtOS9v+eUqOepuuagvFxuICB9LFxuICAvLyDopobnm5ZcbiAgb3ZlcnJpZGVzOiBbXSxcbn07XG4vLyB2dWUyL3Z1ZTMg5YWx55SoXG5leHBvcnQgY29uc3QgdnVlQ29tbW9uQ29uZmlnID0ge1xuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbXVsdGktd29yZC1jb21wb25lbnQtbmFtZXMnOiBPRkYsIC8vIOimgeaxgue7hOS7tuWQjeensOWni+e7iOS4uuWkmuWtl1xuICAgICd2dWUvbm8tdW51c2VkLWNvbXBvbmVudHMnOiBXQVJOLCAvLyDmnKrkvb/nlKjnmoTnu4Tku7ZcbiAgICAndnVlL25vLXVudXNlZC12YXJzJzogT0ZGLCAvLyDmnKrkvb/nlKjnmoTlj5jph49cbiAgICAndnVlL3JlcXVpcmUtcmVuZGVyLXJldHVybic6IFdBUk4sIC8vIOW8uuWItua4suafk+WHveaVsOaAu+aYr+i/lOWbnuWAvFxuICAgICd2dWUvcmVxdWlyZS12LWZvci1rZXknOiBPRkYsIC8vIHYtZm9y5Lit5b+F6aG75L2/55Soa2V5XG4gICAgJ3Z1ZS9yZXR1cm4taW4tY29tcHV0ZWQtcHJvcGVydHknOiBXQVJOLCAvLyDlvLrliLbov5Tlm57or63lj6XlrZjlnKjkuo7orqHnrpflsZ7mgKfkuK1cbiAgICAndnVlL3ZhbGlkLXRlbXBsYXRlLXJvb3QnOiBPRkYsIC8vIOW8uuWItuacieaViOeahOaooeadv+aguVxuICAgICd2dWUvdmFsaWQtdi1mb3InOiBPRkYsIC8vIOW8uuWItuacieaViOeahHYtZm9y5oyH5LukXG4gICAgLy8gUHJpb3JpdHkgQjogU3Ryb25nbHkgUmVjb21tZW5kZWRcbiAgICAndnVlL2F0dHJpYnV0ZS1oeXBoZW5hdGlvbic6IE9GRiwgLy8g5by65Yi25bGe5oCn5ZCN5qC85byPXG4gICAgJ3Z1ZS9jb21wb25lbnQtZGVmaW5pdGlvbi1uYW1lLWNhc2luZyc6IE9GRiwgLy8g5by65Yi257uE5Lu2bmFtZeagvOW8j1xuICAgICd2dWUvaHRtbC1xdW90ZXMnOiBbV0FSTiwgJ2RvdWJsZScsIHsgJ2F2b2lkRXNjYXBlJzogdHJ1ZSB9XSwgLy8g5by65Yi2IEhUTUwg5bGe5oCn55qE5byV5Y+35qC35byPXG4gICAgJ3Z1ZS9odG1sLXNlbGYtY2xvc2luZyc6IE9GRiwgLy8g5L2/55So6Ieq6Zet5ZCI5qCH562+XG4gICAgJ3Z1ZS9tYXgtYXR0cmlidXRlcy1wZXItbGluZSc6IFtXQVJOLCB7ICdzaW5nbGVsaW5lJzogSW5maW5pdHksICdtdWx0aWxpbmUnOiAxIH1dLCAvLyDlvLrliLbmr4/ooYzljIXlkKvnmoTmnIDlpKflsZ7mgKfmlbBcbiAgICAndnVlL211bHRpbGluZS1odG1sLWVsZW1lbnQtY29udGVudC1uZXdsaW5lJzogT0ZGLCAvLyDpnIDopoHlnKjlpJrooYzlhYPntKDnmoTlhoXlrrnliY3lkI7mjaLooYxcbiAgICAndnVlL3Byb3AtbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOS4uiBWdWUg57uE5Lu25Lit55qEIFByb3Ag5ZCN56ew5by65Yi25omn6KGM54m55a6a5aSn5bCP5YaZXG4gICAgJ3Z1ZS9yZXF1aXJlLWRlZmF1bHQtcHJvcCc6IE9GRiwgLy8gcHJvcHPpnIDopoHpu5jorqTlgLxcbiAgICAndnVlL3NpbmdsZWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5Y2V6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS92LWJpbmQtc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtYmluZOaMh+S7pOmjjuagvFxuICAgICd2dWUvdi1vbi1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1vbuaMh+S7pOmjjuagvFxuICAgICd2dWUvdi1zbG90LXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LXNsb3TmjIfku6Tpo47moLxcbiAgICAvLyBQcmlvcml0eSBDOiBSZWNvbW1lbmRlZFxuICAgICd2dWUvbm8tdi1odG1sJzogT0ZGLCAvLyDnpoHmraLkvb/nlKh2LWh0bWxcbiAgICAvLyBVbmNhdGVnb3JpemVkXG4gICAgJ3Z1ZS9ibG9jay10YWctbmV3bGluZSc6IFdBUk4sIC8vICDlnKjmiZPlvIDlnZfnuqfmoIforrDkuYvlkI7lkozlhbPpl63lnZfnuqfmoIforrDkuYvliY3lvLrliLbmjaLooYxcbiAgICAndnVlL2h0bWwtY29tbWVudC1jb250ZW50LXNwYWNpbmcnOiBXQVJOLCAvLyDlnKhIVE1M5rOo6YeK5Lit5by65Yi257uf5LiA55qE56m65qC8XG4gICAgJ3Z1ZS9zY3JpcHQtaW5kZW50JzogW1dBUk4sIDIsIHsgJ2Jhc2VJbmRlbnQnOiAxLCAnc3dpdGNoQ2FzZSc6IDEgfV0sIC8vIOWcqDxzY3JpcHQ+5Lit5by65Yi25LiA6Ie055qE57yp6L+bXG4gICAgLy8gRXh0ZW5zaW9uIFJ1bGVz44CC5a+55bqUZXNsaW5055qE5ZCM5ZCN6KeE5YiZ77yM6YCC55So5LqOPHRlbXBsYXRlPuS4reeahOihqOi+vuW8j1xuICAgICd2dWUvYXJyYXktYnJhY2tldC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2Jsb2NrLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvYnJhY2Utc3R5bGUnOiBbV0FSTiwgJzF0YnMnLCB7ICdhbGxvd1NpbmdsZUxpbmUnOiB0cnVlIH1dLFxuICAgICd2dWUvY29tbWEtZGFuZ2xlJzogW1dBUk4sICdhbHdheXMtbXVsdGlsaW5lJ10sXG4gICAgJ3Z1ZS9jb21tYS1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2NvbW1hLXN0eWxlJzogV0FSTixcbiAgICAndnVlL2Z1bmMtY2FsbC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2tleS1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2tleXdvcmQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9vYmplY3QtY3VybHktbmV3bGluZSc6IFtXQVJOLCB7ICdtdWx0aWxpbmUnOiB0cnVlLCAnY29uc2lzdGVudCc6IHRydWUgfV0sXG4gICAgJ3Z1ZS9vYmplY3QtY3VybHktc3BhY2luZyc6IFtXQVJOLCAnYWx3YXlzJ10sXG4gICAgJ3Z1ZS9zcGFjZS1pbi1wYXJlbnMnOiBXQVJOLFxuICAgICd2dWUvc3BhY2UtaW5maXgtb3BzJzogV0FSTixcbiAgICAndnVlL3NwYWNlLXVuYXJ5LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9hcnJvdy1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sXG4gIH0sXG4gIG92ZXJyaWRlczogW1xuICAgIHtcbiAgICAgICdmaWxlcyc6IFsnKi52dWUnXSxcbiAgICAgICdydWxlcyc6IHtcbiAgICAgICAgJ2luZGVudCc6IE9GRixcbiAgICAgIH0sXG4gICAgfSxcbiAgXSxcbn07XG4vLyB2dWUy55SoXG5leHBvcnQgY29uc3QgdnVlMkNvbmZpZyA9IG1lcmdlKHZ1ZUNvbW1vbkNvbmZpZywge1xuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIHZ1ZTIg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ3BsdWdpbjp2dWUvcmVjb21tZW5kZWQnLFxuICBdLFxufSk7XG4vLyB2dWUz55SoXG5leHBvcnQgY29uc3QgdnVlM0NvbmZpZyA9IG1lcmdlKHZ1ZUNvbW1vbkNvbmZpZywge1xuICBlbnY6IHtcbiAgICAndnVlL3NldHVwLWNvbXBpbGVyLW1hY3Jvcyc6IHRydWUsIC8vIOWkhOeQhnNldHVw5qih5p2/5Lit5YOPIGRlZmluZVByb3BzIOWSjCBkZWZpbmVFbWl0cyDov5nmoLfnmoTnvJbor5Hlmajlro/miqUgbm8tdW5kZWYg55qE6Zeu6aKY77yaaHR0cHM6Ly9lc2xpbnQudnVlanMub3JnL3VzZXItZ3VpZGUvI2NvbXBpbGVyLW1hY3Jvcy1zdWNoLWFzLWRlZmluZXByb3BzLWFuZC1kZWZpbmVlbWl0cy1nZW5lcmF0ZS1uby11bmRlZi13YXJuaW5nc1xuICB9LFxuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIHZ1ZTMg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ3BsdWdpbjp2dWUvdnVlMy1yZWNvbW1lbmRlZCcsXG4gIF0sXG4gIHJ1bGVzOiB7XG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsXG4gICAgJ3Z1ZS9uby10ZW1wbGF0ZS1rZXknOiBPRkYsIC8vIOemgeatojx0ZW1wbGF0ZT7kuK3kvb/nlKhrZXnlsZ7mgKdcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWwgZm9yIFZ1ZS5qcyAzLnhcbiAgICAndnVlL3JldHVybi1pbi1lbWl0cy12YWxpZGF0b3InOiBXQVJOLCAvLyDlvLrliLblnKhlbWl0c+mqjOivgeWZqOS4reWtmOWcqOi/lOWbnuivreWPpVxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXF1aXJlLWV4cGxpY2l0LWVtaXRzJzogT0ZGLCAvLyDpnIDopoFlbWl0c+S4reWumuS5iemAiemhueeUqOS6jiRlbWl0KClcbiAgICAndnVlL3Ytb24tZXZlbnQtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOWcqOaooeadv+S4reeahOiHquWumuS5iee7hOS7tuS4iuW8uuWItuaJp+ihjCB2LW9uIOS6i+S7tuWRveWQjeagt+W8j1xuICB9LFxufSk7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UoLi4ub2JqZWN0cykge1xuICBjb25zdCBbdGFyZ2V0LCAuLi5zb3VyY2VzXSA9IG9iamVjdHM7XG4gIGNvbnN0IHJlc3VsdCA9IERhdGEuZGVlcENsb25lKHRhcmdldCk7XG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhzb3VyY2UpKSB7XG4gICAgICAvLyDnibnmrorlrZfmrrXlpITnkIZcbiAgICAgIGlmIChrZXkgPT09ICdydWxlcycpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coeyBrZXksIHZhbHVlLCAncmVzdWx0W2tleV0nOiByZXN1bHRba2V5XSB9KTtcbiAgICAgICAgLy8g5Yid5aeL5LiN5a2Y5Zyo5pe26LWL6buY6K6k5YC855So5LqO5ZCI5bm2XG4gICAgICAgIHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8ge307XG4gICAgICAgIC8vIOWvueWQhOadoeinhOWImeWkhOeQhlxuICAgICAgICBmb3IgKGxldCBbcnVsZUtleSwgcnVsZVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZSkpIHtcbiAgICAgICAgICAvLyDlt7LmnInlgLznu5/kuIDmiJDmlbDnu4TlpITnkIZcbiAgICAgICAgICBsZXQgc291cmNlUnVsZVZhbHVlID0gcmVzdWx0W2tleV1bcnVsZUtleV0gPz8gW107XG4gICAgICAgICAgaWYgKCEoc291cmNlUnVsZVZhbHVlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWUgPSBbc291cmNlUnVsZVZhbHVlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g6KaB5ZCI5bm255qE5YC857uf5LiA5oiQ5pWw57uE5aSE55CGXG4gICAgICAgICAgaWYgKCEocnVsZVZhbHVlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBydWxlVmFsdWUgPSBbcnVsZVZhbHVlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g57uf5LiA5qC85byP5ZCO6L+b6KGM5pWw57uE5b6q546v5pON5L2cXG4gICAgICAgICAgZm9yIChjb25zdCBbdmFsSW5kZXgsIHZhbF0gb2YgT2JqZWN0LmVudHJpZXMocnVsZVZhbHVlKSkge1xuICAgICAgICAgICAgLy8g5a+56LGh5rex5ZCI5bm277yM5YW25LuW55u05o6l6LWL5YC8XG4gICAgICAgICAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUodmFsKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPSBfT2JqZWN0LmRlZXBBc3NpZ24oc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA/PyB7fSwgdmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOi1i+WAvOinhOWImee7k+aenFxuICAgICAgICAgIHJlc3VsdFtrZXldW3J1bGVLZXldID0gc291cmNlUnVsZVZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5a2X5q615qC55o2u57G75Z6L5Yik5pat5aSE55CGXG4gICAgICAvLyDmlbDnu4TvvJrmi7zmjqVcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIChyZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IFtdKS5wdXNoKC4uLnZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blr7nosaHvvJrmt7HlkIjlubZcbiAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZSh2YWx1ZSkgPT09IE9iamVjdCkge1xuICAgICAgICBfT2JqZWN0LmRlZXBBc3NpZ24ocmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyB7fSwgdmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICog5L2/55So5a6a5Yi255qE6YWN572uXG4gKiBAcGFyYW0ge33vvJrphY3nva7poblcbiAqICAgICAgICAgIGJhc2XvvJrkvb/nlKjln7rnoYBlc2xpbnTlrprliLbvvIzpu5jorqQgdHJ1ZVxuICogICAgICAgICAgdnVlVmVyc2lvbu+8mnZ1ZeeJiOacrO+8jOW8gOWQr+WQjumcgOimgeWuieijhSBlc2xpbnQtcGx1Z2luLXZ1ZVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlKHsgYmFzZSA9IHRydWUsIHZ1ZVZlcnNpb24gfSA9IHt9KSB7XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgaWYgKGJhc2UpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIGJhc2VDb25maWcpO1xuICB9XG4gIGlmICh2dWVWZXJzaW9uID09IDIpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTJDb25maWcpO1xuICB9IGVsc2UgaWYgKHZ1ZVZlcnNpb24gPT0gMykge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgdnVlM0NvbmZpZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8vIOWfuuehgOWumuWItlxuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSB7XG4gIGJhc2U6ICcuLycsXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBmczoge1xuICAgICAgc3RyaWN0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgLy8g5Yir5ZCNXG4gICAgYWxpYXM6IHtcbiAgICAgIC8vICdAcm9vdCc6IHJlc29sdmUoX19kaXJuYW1lKSxcbiAgICAgIC8vICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIOinhOWumuinpuWPkeitpuWRiueahCBjaHVuayDlpKflsI/jgILvvIjku6Uga2JzIOS4uuWNleS9je+8iVxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMiAqKiAxMCxcbiAgICAvLyDoh6rlrprkuYnlupXlsYLnmoQgUm9sbHVwIOaJk+WMhemFjee9ruOAglxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyDlhaXlj6Pmlofku7blkI1cbiAgICAgICAgZW50cnlGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvZW50cnktJHtjaHVua0luZm8udHlwZX0tW25hbWVdLmpzYDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5Z2X5paH5Lu25ZCNXG4gICAgICAgIGNodW5rRmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOi1hOa6kOaWh+S7tuWQje+8jGNzc+OAgeWbvueJh+etiVxuICAgICAgICBhc3NldEZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uW2V4dF1gO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcbiIsIi8vIOivt+axguaWueazlVxuZXhwb3J0IGNvbnN0IE1FVEhPRFMgPSBbJ0dFVCcsICdIRUFEJywgJ1BPU1QnLCAnUFVUJywgJ0RFTEVURScsICdDT05ORUNUJywgJ09QVElPTlMnLCAnVFJBQ0UnLCAnUEFUQ0gnXTtcbi8vIGh0dHAg54q25oCB56CBXG5leHBvcnQgY29uc3QgU1RBVFVTRVMgPSBbXG4gIHsgJ3N0YXR1cyc6IDEwMCwgJ3N0YXR1c1RleHQnOiAnQ29udGludWUnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMSwgJ3N0YXR1c1RleHQnOiAnU3dpdGNoaW5nIFByb3RvY29scycgfSxcbiAgeyAnc3RhdHVzJzogMTAyLCAnc3RhdHVzVGV4dCc6ICdQcm9jZXNzaW5nJyB9LFxuICB7ICdzdGF0dXMnOiAxMDMsICdzdGF0dXNUZXh0JzogJ0Vhcmx5IEhpbnRzJyB9LFxuICB7ICdzdGF0dXMnOiAyMDAsICdzdGF0dXNUZXh0JzogJ09LJyB9LFxuICB7ICdzdGF0dXMnOiAyMDEsICdzdGF0dXNUZXh0JzogJ0NyZWF0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMiwgJ3N0YXR1c1RleHQnOiAnQWNjZXB0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMywgJ3N0YXR1c1RleHQnOiAnTm9uLUF1dGhvcml0YXRpdmUgSW5mb3JtYXRpb24nIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNCwgJ3N0YXR1c1RleHQnOiAnTm8gQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA1LCAnc3RhdHVzVGV4dCc6ICdSZXNldCBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDYsICdzdGF0dXNUZXh0JzogJ1BhcnRpYWwgQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA3LCAnc3RhdHVzVGV4dCc6ICdNdWx0aS1TdGF0dXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwOCwgJ3N0YXR1c1RleHQnOiAnQWxyZWFkeSBSZXBvcnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjI2LCAnc3RhdHVzVGV4dCc6ICdJTSBVc2VkJyB9LFxuICB7ICdzdGF0dXMnOiAzMDAsICdzdGF0dXNUZXh0JzogJ011bHRpcGxlIENob2ljZXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMSwgJ3N0YXR1c1RleHQnOiAnTW92ZWQgUGVybWFuZW50bHknIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMiwgJ3N0YXR1c1RleHQnOiAnRm91bmQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMywgJ3N0YXR1c1RleHQnOiAnU2VlIE90aGVyJyB9LFxuICB7ICdzdGF0dXMnOiAzMDQsICdzdGF0dXNUZXh0JzogJ05vdCBNb2RpZmllZCcgfSxcbiAgeyAnc3RhdHVzJzogMzA1LCAnc3RhdHVzVGV4dCc6ICdVc2UgUHJveHknIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNywgJ3N0YXR1c1RleHQnOiAnVGVtcG9yYXJ5IFJlZGlyZWN0JyB9LFxuICB7ICdzdGF0dXMnOiAzMDgsICdzdGF0dXNUZXh0JzogJ1Blcm1hbmVudCBSZWRpcmVjdCcgfSxcbiAgeyAnc3RhdHVzJzogNDAwLCAnc3RhdHVzVGV4dCc6ICdCYWQgUmVxdWVzdCcgfSxcbiAgeyAnc3RhdHVzJzogNDAxLCAnc3RhdHVzVGV4dCc6ICdVbmF1dGhvcml6ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMiwgJ3N0YXR1c1RleHQnOiAnUGF5bWVudCBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDAzLCAnc3RhdHVzVGV4dCc6ICdGb3JiaWRkZW4nIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNCwgJ3N0YXR1c1RleHQnOiAnTm90IEZvdW5kJyB9LFxuICB7ICdzdGF0dXMnOiA0MDUsICdzdGF0dXNUZXh0JzogJ01ldGhvZCBOb3QgQWxsb3dlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA2LCAnc3RhdHVzVGV4dCc6ICdOb3QgQWNjZXB0YWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNDA3LCAnc3RhdHVzVGV4dCc6ICdQcm94eSBBdXRoZW50aWNhdGlvbiBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA4LCAnc3RhdHVzVGV4dCc6ICdSZXF1ZXN0IFRpbWVvdXQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwOSwgJ3N0YXR1c1RleHQnOiAnQ29uZmxpY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMCwgJ3N0YXR1c1RleHQnOiAnR29uZScgfSxcbiAgeyAnc3RhdHVzJzogNDExLCAnc3RhdHVzVGV4dCc6ICdMZW5ndGggUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMiwgJ3N0YXR1c1RleHQnOiAnUHJlY29uZGl0aW9uIEZhaWxlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDEzLCAnc3RhdHVzVGV4dCc6ICdQYXlsb2FkIFRvbyBMYXJnZScgfSxcbiAgeyAnc3RhdHVzJzogNDE0LCAnc3RhdHVzVGV4dCc6ICdVUkkgVG9vIExvbmcnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNSwgJ3N0YXR1c1RleHQnOiAnVW5zdXBwb3J0ZWQgTWVkaWEgVHlwZScgfSxcbiAgeyAnc3RhdHVzJzogNDE2LCAnc3RhdHVzVGV4dCc6ICdSYW5nZSBOb3QgU2F0aXNmaWFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNywgJ3N0YXR1c1RleHQnOiAnRXhwZWN0YXRpb24gRmFpbGVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTgsICdzdGF0dXNUZXh0JzogJ0lcXCdtIGEgVGVhcG90JyB9LFxuICB7ICdzdGF0dXMnOiA0MjEsICdzdGF0dXNUZXh0JzogJ01pc2RpcmVjdGVkIFJlcXVlc3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMiwgJ3N0YXR1c1RleHQnOiAnVW5wcm9jZXNzYWJsZSBFbnRpdHknIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMywgJ3N0YXR1c1RleHQnOiAnTG9ja2VkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjQsICdzdGF0dXNUZXh0JzogJ0ZhaWxlZCBEZXBlbmRlbmN5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjUsICdzdGF0dXNUZXh0JzogJ1RvbyBFYXJseScgfSxcbiAgeyAnc3RhdHVzJzogNDI2LCAnc3RhdHVzVGV4dCc6ICdVcGdyYWRlIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjgsICdzdGF0dXNUZXh0JzogJ1ByZWNvbmRpdGlvbiBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI5LCAnc3RhdHVzVGV4dCc6ICdUb28gTWFueSBSZXF1ZXN0cycgfSxcbiAgeyAnc3RhdHVzJzogNDMxLCAnc3RhdHVzVGV4dCc6ICdSZXF1ZXN0IEhlYWRlciBGaWVsZHMgVG9vIExhcmdlJyB9LFxuICB7ICdzdGF0dXMnOiA0NTEsICdzdGF0dXNUZXh0JzogJ1VuYXZhaWxhYmxlIEZvciBMZWdhbCBSZWFzb25zJyB9LFxuICB7ICdzdGF0dXMnOiA1MDAsICdzdGF0dXNUZXh0JzogJ0ludGVybmFsIFNlcnZlciBFcnJvcicgfSxcbiAgeyAnc3RhdHVzJzogNTAxLCAnc3RhdHVzVGV4dCc6ICdOb3QgSW1wbGVtZW50ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMiwgJ3N0YXR1c1RleHQnOiAnQmFkIEdhdGV3YXknIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMywgJ3N0YXR1c1RleHQnOiAnU2VydmljZSBVbmF2YWlsYWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNTA0LCAnc3RhdHVzVGV4dCc6ICdHYXRld2F5IFRpbWVvdXQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNSwgJ3N0YXR1c1RleHQnOiAnSFRUUCBWZXJzaW9uIE5vdCBTdXBwb3J0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNiwgJ3N0YXR1c1RleHQnOiAnVmFyaWFudCBBbHNvIE5lZ290aWF0ZXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNywgJ3N0YXR1c1RleHQnOiAnSW5zdWZmaWNpZW50IFN0b3JhZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwOCwgJ3N0YXR1c1RleHQnOiAnTG9vcCBEZXRlY3RlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTA5LCAnc3RhdHVzVGV4dCc6ICdCYW5kd2lkdGggTGltaXQgRXhjZWVkZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUxMCwgJ3N0YXR1c1RleHQnOiAnTm90IEV4dGVuZGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MTEsICdzdGF0dXNUZXh0JzogJ05ldHdvcmsgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnIH0sXG5dO1xuIiwiY29uc3Qgbm9kZUNsaXBib2FyZHkgPSByZXF1aXJlKCdub2RlLWNsaXBib2FyZHknKTtcbi8vIOeUqOWIsOeahOW6k+S5n+WvvOWHuuS+v+S6juiHquihjOmAieeUqFxuZXhwb3J0IHsgbm9kZUNsaXBib2FyZHkgfTtcblxuZXhwb3J0IGNvbnN0IGNsaXBib2FyZCA9IHtcbi8vIOWvueW6lOa1j+iniOWZqOerr+WQjOWQjeaWueazle+8jOWHj+WwkeS7o+eggeS/ruaUuVxuICAvKipcbiAgICog5YaZ5YWl5paH5pysKOWkjeWItilcbiAgICogQHBhcmFtIHRleHRcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBhc3luYyB3cml0ZVRleHQodGV4dCkge1xuICAgIC8vIOi9rOaNouaIkOWtl+espuS4sumYsuatoiBjbGlwYm9hcmR5IOaKpeexu+Wei+mUmeivr1xuICAgIGNvbnN0IHRleHRSZXN1bHQgPSBTdHJpbmcodGV4dCk7XG4gICAgcmV0dXJuIGF3YWl0IG5vZGVDbGlwYm9hcmR5LndyaXRlKHRleHRSZXN1bHQpO1xuICB9LFxuICAvKipcbiAgICog6K+75Y+W5paH5pysKOeymOi0tClcbiAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHJlYWRUZXh0KCkge1xuICAgIHJldHVybiBhd2FpdCBub2RlQ2xpcGJvYXJkeS5yZWFkKCk7XG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbImJhc2VDb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFDTyxNQUFNLElBQUksU0FBUyxHQUFHLENBQUM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxZQUFZLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDL0I7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RDtBQUNBLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNwQyxJQUFJLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssS0FBSztBQUNuQyxNQUFNLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RELEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2hCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLElBQUksRUFBRTtBQUN4QjtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hEO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQyxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLFVBQVUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFLEdBQUcsU0FBUyxFQUFFO0FBQ2hEO0FBQ0EsSUFBSSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzlCLE1BQU0sU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLElBQUksT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxLQUFLO0FBQ3JDLE1BQU0sT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMxRCxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFdBQVcsQ0FBQyxLQUFLLEdBQUcs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S0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDdEIsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLEdBQUc7QUFDVCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDaEQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDakQsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEdBQUc7QUFDWixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3BCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLEdBQUc7QUFDWCxJQUFJLEtBQUssQ0FBQyxTQUFTLENB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dkIsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMzQixHQUFHO0FBQ0g7QUFDQTs7QUNoWkE7QUFHTyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxD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R0FBRyxNQUFNLEtBQUssRUFBRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUNyRjtBQUNBLEVBQUUsTUFBTSxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDckM7QUFDQSxFQUFFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3BCLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsRCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksSUFBSSxZQUFZLEtBQUssRUFBRTtBQUM3QixJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMxRCxHQUFHO0FBQ0gsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssTUFBTSxFQUFFO0FBQzFDLElBQUksT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUs7QUFDdkUsTUFBTSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDbEQsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNSLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDOztBQzFLRDtBQUNPLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLENBQUMsWUFBWSxHQUFHLFNBQVMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDdEUsRUFBRSxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7QUFDOUIsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMzRCxHQUFHO0FBQ0gsRUFBRSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUNqQyxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7QUFDNUUsR0FBRztBQUNILEVBQUUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDakMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsR0FBRztBQUNILEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sQ0FBQyxRQUFRLEdBQUcsU0FBUyxNQUFNLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUNsRCxFQUFFLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzNCLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFO0FBQzdCLE1BQU0sTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQzlDO0FBQ0EsTUFBTSxJQUFJLEtBQUssWUFBWSxRQUFRLEVBQUU7QUFDckMsUUFBUSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsT0FBTztBQUNQO0FBQ0EsTUFBTSxPQUFPLEtBQUssQ0FBQztBQUNuQixLQUFLO0FBQ0wsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDOztBQ3hDRDtBQUlBO0FBQ0E7QUFDTyxNQUFNLE9BQU8sQ0FBQztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRSxHQUFHLE9BQU8sRUFBRTtBQUN6QyxJQUFJLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ2xDO0FBQ0EsTUFBTSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUMxRixRQUFRLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRCxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxFQUFFO0FBQ3hDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNqQixNQUFNLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0wsSUFBSSxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUNsQyxNQUFNLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQzFGLFFBQVEsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0FBQzdCO0FBQ0EsVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzlDLFlBQVksTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQy9DLGNBQWMsR0FBRyxJQUFJO0FBQ3JCLGNBQWMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDN0QsYUFBYSxDQUFDLENBQUM7QUFDZixXQUFXLE1BQU07QUFDakIsWUFBWSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsV0FBVztBQUNYLFNBQVMsTUFBTTtBQUNmO0FBQ0EsVUFBVSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkQsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLGFBQWEsR0FBRyxLQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUN0RjtBQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3REO0FBQ0EsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3hCO0FBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0QsSUFBSSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMxRDtBQUNBLE1BQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7QUFDOUMsUUFBUSxTQUFTO0FBQ2pCLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDOUMsUUFBUSxTQUFTO0FBQ2pCLE9BQU87QUFDUDtBQUNBLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksTUFBTSxFQUFFO0FBQ2hCLE1BQU0sTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0RCxNQUFNLElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtBQUM5QixRQUFRLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELFFBQVEsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUU7QUFDNUMsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxNQUFNLEdBQUc7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxPQUFPLEdBQUc7QUFDbkIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQzVCLElBQUksSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQzNELE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMLElBQUksSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsRCxJQUFJLElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtBQUM1QixNQUFNLE9BQU8sSUFBSSxDQUFDO0FBQ2xCLEtBQUs7QUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtBQUNqQyxJQUFJLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNyQixNQUFNLE9BQU8sU0FBUyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM1RCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxhQUFhLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDN0Y7QUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUN0RCxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFELEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsYUFBYSxHQUFHLEtBQUssRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ25HO0FBQ0EsSUFBSSxNQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDdEQsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3QyxJQUFJLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLFNBQVMsR0FBRyxLQUFLLEVBQUUsU0FBUyxHQUFHLEdBQUcsRUFBRSxNQUFNLEdBQUcsSUFBSSxFQUFFLGFBQWEsR0FBRyxLQUFLLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUNoSixJQUFJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQjtBQUNBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUNyRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDckQsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDbkI7QUFDQSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxTQUFTLEtBQUssT0FBTyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNuSDtBQUNBLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JELElBQUksS0FBSyxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDN0IsTUFBTSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoRDtBQUNBLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDaEIsUUFBUSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakQsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUMvQyxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQy9FLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUMvQyxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMzRCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFdBQVcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFO0FBQzFCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3pDLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsSUFBSSxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDM0IsTUFBTSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM3QixLQUFLO0FBQ0wsSUFBSSxJQUFJLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUNqRCxNQUFNLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzdCLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLFFBQVEsR0FBRztBQUNiLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixHQUFHO0FBQ0g7QUFDQSxFQUFFLFFBQVEsR0FBRztBQUNiLElBQUksSUFBSTtBQUNSLE1BQU0sT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNoQixNQUFNLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQyxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFLFNBQVMsR0FBRztBQUNkLElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDeEMsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLEdBQUc7QUFDWCxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLEdBQUc7QUFDSDtBQUNBLENBQUM7QUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7O0FDL1IvQixNQUFNLE9BQU8sU0FBUyxNQUFNLENBQUM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGdCQUFnQixDQUFDLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDckMsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQ3JDLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ3BFO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hEO0FBQ0EsSUFBSSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUs7QUFDOUQsTUFBTSxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM5QixLQUFLLENBQUMsQ0FBQztBQUNQO0FBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM3QyxNQUFNLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzlDLE1BQU0sT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMLElBQUksT0FBTyxTQUFTLENBQUM7QUFDckIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDekQsSUFBSSxPQUFPLElBQUk7QUFDZjtBQUNBLE9BQU8sVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4RDtBQUNBLE9BQU8sV0FBVyxFQUFFLENBQUM7QUFDckIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3JCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDTyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxDQUFDLGFBQWEsR0FBRyxTQUFTLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ2pFLEVBQUUsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO0FBQ3BCLElBQUksT0FBTyxFQUFFLENBQUM7QUFDZCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEUsQ0FBQzs7QUNmRDtBQUdBO0FBQ08sTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLENBQUMsY0FBYyxHQUFHLFNBQVMsSUFBSSxFQUFFO0FBQ3hDLEVBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUMvQixJQUFJLE1BQU0sRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLFNBQVM7QUFDbkMsSUFBSSxNQUFNLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLO0FBQzlCLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxLQUFLLEVBQUUsZUFBZSxFQUFFO0FBQzdEO0FBQ0EsRUFBRSxJQUFJLGVBQWUsWUFBWSxLQUFLLEVBQUU7QUFDeEMsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakgsR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsRUFBRTtBQUNsRCxJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUs7QUFDckcsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7QUFDakQsVUFBVSxFQUFFLEdBQUcsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtBQUMzRCxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztBQUN4QyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDUixHQUFHLE1BQU07QUFDVCxJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDekIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsRUFBRSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtBQUNwRSxJQUFJLENBQUMsU0FBUyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQUUsRUFBRTtBQUMzRDtBQUNBLE1BQU0sSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ3pCLFFBQVEsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRDtBQUNBLFFBQVEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxTQUFTLEtBQUssRUFBRSxHQUFHLElBQUksR0FBRyxTQUFTLENBQUM7QUFDckksUUFBUSxPQUFPO0FBQ2YsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNmLFFBQVEsT0FBTztBQUNmLE9BQU87QUFDUCxNQUFNLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMzRSxLQUFLLEVBQUU7QUFDUCxNQUFNLElBQUksRUFBRSxVQUFVO0FBQ3RCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRztBQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxDQUFDLGlCQUFpQixHQUFHLFNBQVMsS0FBSyxFQUFFLGVBQWUsRUFBRTtBQUM3RDtBQUNBLEVBQUUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxFQUFFO0FBQzNDLElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDbkQsR0FBRyxNQUFNLElBQUksRUFBRSxlQUFlLFlBQVksS0FBSyxDQUFDLEVBQUU7QUFDbEQsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLEdBQUc7QUFDSDtBQUNBLEVBQUUsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRjtBQUNBLEVBQUUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLEVBQUUsS0FBSyxNQUFNLElBQUksSUFBSSxTQUFTLEVBQUU7QUFDaEMsSUFBSSxDQUFDLFNBQVMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQUUsRUFBRTtBQUMvQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN4QztBQUNBLFFBQVEsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQzNCLFVBQVUsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RCxVQUFVLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUMsVUFBVSxPQUFPO0FBQ2pCLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDakIsVUFBVSxPQUFPO0FBQ2pCLFNBQVM7QUFDVCxRQUFRLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RyxPQUFPO0FBQ1A7QUFDQSxNQUFNLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN6QixRQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsT0FBTztBQUNQLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxDQUFDLGdCQUFnQixHQUFHLFNBQVMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQzdFO0FBQ0EsRUFBRSxLQUFLLEdBQUcsQ0FBQyxNQUFNO0FBQ2pCLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNO0FBQ3ZCLE1BQU0sSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO0FBQ2xDLFFBQVEsT0FBTyxLQUFLLENBQUM7QUFDckIsT0FBTztBQUNQLE1BQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3JDLFFBQVEsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLE9BQU87QUFDUCxNQUFNLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLEtBQUssR0FBRyxDQUFDO0FBQ1QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6RixHQUFHLEdBQUcsQ0FBQztBQUNQLEVBQUUsS0FBSyxHQUFHLENBQUMsTUFBTTtBQUNqQixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTTtBQUN2QixNQUFNLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtBQUNsQyxRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQ3JCLE9BQU87QUFDUCxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNyQyxRQUFRLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxPQUFPO0FBQ1AsTUFBTSxPQUFPLEVBQUUsQ0FBQztBQUNoQixLQUFLLEdBQUcsQ0FBQztBQUNULElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLO0FBQzdCO0FBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDdEMsUUFBUSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0QsUUFBUSxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RyxPQUFPO0FBQ1A7QUFDQSxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2QsR0FBRyxHQUFHLENBQUM7QUFDUCxFQUFFLElBQUksR0FBRyxDQUFDLE1BQU07QUFDaEIsSUFBSSxNQUFNLEdBQUcsR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDdkIsUUFBUSxJQUFJLFlBQVksS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDMUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7QUFDekQsR0FBRyxHQUFHLENBQUM7QUFDUCxFQUFFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuRTtBQUNBO0FBQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsRUFBRSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN0RixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ2pDLE1BQU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hELEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7O0FDaktEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNwQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNQSxZQUFVLEdBQUc7QUFDMUI7QUFDQSxFQUFFLEdBQUcsRUFBRTtBQUNQLElBQUksT0FBTyxFQUFFLElBQUk7QUFDakIsSUFBSSxJQUFJLEVBQUUsSUFBSTtBQUNkLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxFQUFFO0FBQ1gsSUFBSSxVQUFVLEVBQUUsVUFBVTtBQUMxQixJQUFJLE1BQU0sRUFBRSxVQUFVO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsYUFBYSxFQUFFO0FBQ2pCLElBQUksV0FBVyxFQUFFLFFBQVE7QUFDekIsSUFBSSxVQUFVLEVBQUUsUUFBUTtBQUN4QixJQUFJLFlBQVksRUFBRTtBQUNsQixNQUFNLEdBQUcsRUFBRSxJQUFJO0FBQ2YsTUFBTSw0QkFBNEIsRUFBRSxJQUFJO0FBQ3hDLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLG9CQUFvQjtBQUN4QixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsS0FBSyxFQUFFO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGVBQWUsRUFBRSxHQUFHO0FBQ3hCLElBQUksdUJBQXVCLEVBQUUsR0FBRztBQUNoQyxJQUFJLFVBQVUsRUFBRSxHQUFHO0FBQ25CLElBQUksZUFBZSxFQUFFLElBQUk7QUFDekIsSUFBSSxnQkFBZ0IsRUFBRSxHQUFHO0FBQ3pCLElBQUksdUJBQXVCLEVBQUUsR0FBRztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxnQkFBZ0IsRUFBRSxLQUFLO0FBQzNCLElBQUksdUJBQXVCLEVBQUUsSUFBSTtBQUNqQyxJQUFJLGtCQUFrQixFQUFFLEtBQUs7QUFDN0IsSUFBSSxPQUFPLEVBQUUsSUFBSTtBQUNqQixJQUFJLGdCQUFnQixFQUFFLElBQUk7QUFDMUIsSUFBSSxxQkFBcUIsRUFBRSxLQUFLO0FBQ2hDLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLGlCQUFpQixFQUFFLEtBQUs7QUFDNUIsSUFBSSxVQUFVLEVBQUUsS0FBSztBQUNyQixJQUFJLGtCQUFrQixFQUFFLElBQUk7QUFDNUIsSUFBSSxtQkFBbUIsRUFBRSxJQUFJO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGVBQWUsRUFBRSxJQUFJO0FBQ3pCLElBQUksZ0JBQWdCLEVBQUUsR0FBRztBQUN6QixJQUFJLHNCQUFzQixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx1QkFBdUIsRUFBRSxJQUFJO0FBQ2pDLElBQUksZUFBZSxFQUFFLElBQUk7QUFDekIsSUFBSSxhQUFhLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDOUQsSUFBSSxjQUFjLEVBQUUsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUM7QUFDOUMsSUFBSSxlQUFlLEVBQUUsSUFBSTtBQUN6QixJQUFJLGFBQWEsRUFBRSxJQUFJO0FBQ3ZCLElBQUksMkJBQTJCLEVBQUUsSUFBSTtBQUNyQyxJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSx3QkFBd0IsRUFBRSxJQUFJO0FBQ2xDLElBQUksMEJBQTBCLEVBQUUsSUFBSTtBQUNwQyxJQUFJLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDNUMsSUFBSSxZQUFZLEVBQUUsSUFBSTtBQUN0QixJQUFJLGFBQWEsRUFBRSxJQUFJO0FBQ3ZCLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLFlBQVksRUFBRSxJQUFJO0FBQ3RCLElBQUksMEJBQTBCLEVBQUUsSUFBSTtBQUNwQyxJQUFJLHlCQUF5QixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUM3RSxJQUFJLG9CQUFvQixFQUFFLElBQUk7QUFDOUIsSUFBSSwrQkFBK0IsRUFBRSxJQUFJO0FBQ3pDLElBQUksa0NBQWtDLEVBQUUsSUFBSTtBQUM1QyxJQUFJLHNCQUFzQixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDN0UsSUFBSSxzQkFBc0IsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7QUFDNUMsSUFBSSxlQUFlLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO0FBQ3BDLElBQUksUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDdEYsSUFBSSxNQUFNLEVBQUUsSUFBSTtBQUNoQixJQUFJLGNBQWMsRUFBRSxJQUFJO0FBQ3hCLElBQUksWUFBWSxFQUFFLElBQUk7QUFDdEIsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLElBQUksNkJBQTZCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxDQUFDO0FBQzdHLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLGlCQUFpQixFQUFFLElBQUk7QUFDM0IsSUFBSSxpQkFBaUIsRUFBRSxJQUFJO0FBQzNCLElBQUksZ0JBQWdCLEVBQUUsSUFBSTtBQUMxQixJQUFJLHNCQUFzQixFQUFFLElBQUk7QUFDaEMsSUFBSSxzQkFBc0IsRUFBRSxJQUFJO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGVBQWUsRUFBRSxJQUFJO0FBQ3pCLElBQUksd0JBQXdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztBQUN0SCxJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSxpQkFBaUIsRUFBRSxJQUFJO0FBQzNCLElBQUkscUJBQXFCLEVBQUUsSUFBSTtBQUMvQixJQUFJLHdCQUF3QixFQUFFLElBQUk7QUFDbEMsSUFBSSxvQkFBb0IsRUFBRSxJQUFJO0FBQzlCLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxFQUFFLEVBQUU7QUFDZixDQUFDLENBQUM7QUFDRjtBQUNPLE1BQU0sZUFBZSxHQUFHO0FBQy9CLEVBQUUsS0FBSyxFQUFFO0FBQ1Q7QUFDQSxJQUFJLGdDQUFnQyxFQUFFLEdBQUc7QUFDekMsSUFBSSwwQkFBMEIsRUFBRSxJQUFJO0FBQ3BDLElBQUksb0JBQW9CLEVBQUUsR0FBRztBQUM3QixJQUFJLDJCQUEyQixFQUFFLElBQUk7QUFDckMsSUFBSSx1QkFBdUIsRUFBRSxHQUFHO0FBQ2hDLElBQUksaUNBQWlDLEVBQUUsSUFBSTtBQUMzQyxJQUFJLHlCQUF5QixFQUFFLEdBQUc7QUFDbEMsSUFBSSxpQkFBaUIsRUFBRSxHQUFHO0FBQzFCO0FBQ0EsSUFBSSwyQkFBMkIsRUFBRSxHQUFHO0FBQ3BDLElBQUksc0NBQXNDLEVBQUUsR0FBRztBQUMvQyxJQUFJLGlCQUFpQixFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNoRSxJQUFJLHVCQUF1QixFQUFFLEdBQUc7QUFDaEMsSUFBSSw2QkFBNkIsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JGLElBQUksNENBQTRDLEVBQUUsR0FBRztBQUNyRCxJQUFJLHNCQUFzQixFQUFFLEdBQUc7QUFDL0IsSUFBSSwwQkFBMEIsRUFBRSxHQUFHO0FBQ25DLElBQUksNkNBQTZDLEVBQUUsR0FBRztBQUN0RCxJQUFJLGtCQUFrQixFQUFFLEdBQUc7QUFDM0IsSUFBSSxnQkFBZ0IsRUFBRSxHQUFHO0FBQ3pCLElBQUksa0JBQWtCLEVBQUUsR0FBRztBQUMzQjtBQUNBLElBQUksZUFBZSxFQUFFLEdBQUc7QUFDeEI7QUFDQSxJQUFJLHVCQUF1QixFQUFFLElBQUk7QUFDakMsSUFBSSxrQ0FBa0MsRUFBRSxJQUFJO0FBQzVDLElBQUksbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDeEU7QUFDQSxJQUFJLDJCQUEyQixFQUFFLElBQUk7QUFDckMsSUFBSSxtQkFBbUIsRUFBRSxJQUFJO0FBQzdCLElBQUksaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDbEUsSUFBSSxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQztBQUNsRCxJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSxpQkFBaUIsRUFBRSxJQUFJO0FBQzNCLElBQUksdUJBQXVCLEVBQUUsSUFBSTtBQUNqQyxJQUFJLGlCQUFpQixFQUFFLElBQUk7QUFDM0IsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLElBQUksMEJBQTBCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNqRixJQUFJLDBCQUEwQixFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxJQUFJLHFCQUFxQixFQUFFLElBQUk7QUFDL0IsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLElBQUkscUJBQXFCLEVBQUUsSUFBSTtBQUMvQixJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLEdBQUc7QUFDSCxFQUFFLFNBQVMsRUFBRTtBQUNiLElBQUk7QUFDSixNQUFNLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUN4QixNQUFNLE9BQU8sRUFBRTtBQUNmLFFBQVEsUUFBUSxFQUFFLEdBQUc7QUFDckIsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFO0FBQ2pELEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLHdCQUF3QjtBQUM1QixHQUFHO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDSDtBQUNPLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxlQUFlLEVBQUU7QUFDakQsRUFBRSxHQUFHLEVBQUU7QUFDUCxJQUFJLDJCQUEyQixFQUFFLElBQUk7QUFDckMsR0FBRztBQUNILEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLDZCQUE2QjtBQUNqQyxHQUFHO0FBQ0gsRUFBRSxLQUFLLEVBQUU7QUFDVDtBQUNBLElBQUkscUJBQXFCLEVBQUUsR0FBRztBQUM5QjtBQUNBLElBQUksK0JBQStCLEVBQUUsSUFBSTtBQUN6QztBQUNBLElBQUksNEJBQTRCLEVBQUUsR0FBRztBQUNyQyxJQUFJLDRCQUE0QixFQUFFLEdBQUc7QUFDckMsR0FBRztBQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0ksU0FBUyxLQUFLLENBQUMsR0FBRyxPQUFPLEVBQUU7QUFDbEMsRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3ZDLEVBQUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QyxFQUFFLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ2hDLElBQUksS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDdkQ7QUFDQSxNQUFNLElBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTtBQUMzQjtBQUNBO0FBQ0EsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN4QztBQUNBLFFBQVEsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDaEU7QUFDQSxVQUFVLElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDM0QsVUFBVSxJQUFJLEVBQUUsZUFBZSxZQUFZLEtBQUssQ0FBQyxFQUFFO0FBQ25ELFlBQVksZUFBZSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDaEQsV0FBVztBQUNYO0FBQ0EsVUFBVSxJQUFJLEVBQUUsU0FBUyxZQUFZLEtBQUssQ0FBQyxFQUFFO0FBQzdDLFlBQVksU0FBUyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsV0FBVztBQUNYO0FBQ0EsVUFBVSxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNuRTtBQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUNuRCxjQUFjLGVBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkcsYUFBYSxNQUFNO0FBQ25CLGNBQWMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUM5QyxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0EsVUFBVSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsZUFBZSxDQUFDO0FBQ2pELFNBQVM7QUFDVCxRQUFRLFNBQVM7QUFDakIsT0FBTztBQUNQO0FBQ0E7QUFDQSxNQUFNLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtBQUNsQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDekQsUUFBUSxTQUFTO0FBQ2pCLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUMvQyxRQUFRLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkUsUUFBUSxTQUFTO0FBQ2pCLE9BQU87QUFDUDtBQUNBLE1BQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUMxQixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUN0RCxFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixFQUFFLElBQUksSUFBSSxFQUFFO0FBQ1osSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRUEsWUFBVSxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNILEVBQUUsSUFBSSxVQUFVLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkMsR0FBRyxNQUFNLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRTtBQUM5QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSCxFQUFFLE9BQU8sTUFBTSxDQUFDO0FBQ2hCOzs7Ozs7Ozs7Ozs7Ozs7QUN2U0E7QUFDTyxNQUFNLFVBQVUsR0FBRztBQUMxQixFQUFFLElBQUksRUFBRSxJQUFJO0FBQ1osRUFBRSxNQUFNLEVBQUU7QUFDVixJQUFJLElBQUksRUFBRSxTQUFTO0FBQ25CLElBQUksRUFBRSxFQUFFO0FBQ1IsTUFBTSxNQUFNLEVBQUUsS0FBSztBQUNuQixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLEtBQUssRUFBRTtBQUNYO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsS0FBSyxFQUFFO0FBQ1Q7QUFDQSxJQUFJLHFCQUFxQixFQUFFLENBQUMsSUFBSSxFQUFFO0FBQ2xDO0FBQ0EsSUFBSSxhQUFhLEVBQUU7QUFDbkIsTUFBTSxNQUFNLEVBQUU7QUFDZDtBQUNBLFFBQVEsY0FBYyxDQUFDLFNBQVMsRUFBRTtBQUNsQyxVQUFVLE9BQU8sQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLGNBQWMsQ0FBQyxTQUFTLEVBQUU7QUFDbEMsVUFBVSxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEQsU0FBUztBQUNUO0FBQ0EsUUFBUSxjQUFjLENBQUMsU0FBUyxFQUFFO0FBQ2xDLFVBQVUsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pELFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7O0FDckNEO0FBQ08sTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hHO0FBQ08sTUFBTSxRQUFRLEdBQUc7QUFDeEIsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRTtBQUM3QyxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUU7QUFDeEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRTtBQUMvQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ2hELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUU7QUFDdkMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRTtBQUM1QyxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFO0FBQzdDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSwrQkFBK0IsRUFBRTtBQUNsRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFO0FBQy9DLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUU7QUFDbEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFO0FBQ3BELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUU7QUFDakQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFO0FBQ3JELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUU7QUFDNUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFO0FBQ3JELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtBQUN0RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFO0FBQzFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUU7QUFDOUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRTtBQUNqRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFO0FBQzlDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRTtBQUN2RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUU7QUFDdkQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRTtBQUNoRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFO0FBQ2pELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRTtBQUNyRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFO0FBQzlDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUU7QUFDOUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFFO0FBQ3ZELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRTtBQUNuRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsK0JBQStCLEVBQUU7QUFDbEUsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFO0FBQ3BELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUU7QUFDN0MsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRTtBQUN6QyxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUU7QUFDcEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFO0FBQ3hELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtBQUN0RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFO0FBQ2pELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSx3QkFBd0IsRUFBRTtBQUMzRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLEVBQUU7QUFDMUQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFFO0FBQ3ZELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUU7QUFDbEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFO0FBQ3hELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxzQkFBc0IsRUFBRTtBQUN6RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFO0FBQzNDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtBQUN0RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFO0FBQzlDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRTtBQUNyRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLEVBQUU7QUFDMUQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFFO0FBQ3RELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxpQ0FBaUMsRUFBRTtBQUNwRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsK0JBQStCLEVBQUU7QUFDbEUsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFFO0FBQzFELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRTtBQUNwRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ2hELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRTtBQUN4RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUU7QUFDcEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLDRCQUE0QixFQUFFO0FBQy9ELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSx5QkFBeUIsRUFBRTtBQUM1RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsc0JBQXNCLEVBQUU7QUFDekQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRTtBQUNsRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsMEJBQTBCLEVBQUU7QUFDN0QsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRTtBQUNqRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsaUNBQWlDLEVBQUU7QUFDcEUsQ0FBQzs7Ozs7Ozs7QUNuRUQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFHbEQ7QUFDTyxNQUFNLFNBQVMsR0FBRztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE1BQU0sU0FBUyxDQUFDLElBQUksRUFBRTtBQUN4QjtBQUNBLElBQUksTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLElBQUksT0FBTyxNQUFNLGNBQWMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEQsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxNQUFNLFFBQVEsR0FBRztBQUNuQixJQUFJLE9BQU8sTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkMsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7In0=
