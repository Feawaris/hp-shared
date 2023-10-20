/*!
 * hp-shared v0.2.1
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"esm","sourcemap":"inline"}
 */
  
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

var index$4 = /*#__PURE__*/Object.freeze({
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

var index$3 = /*#__PURE__*/Object.freeze({
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

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  METHODS: METHODS,
  STATUSES: STATUSES
});

// 剪贴板
/**
 * 复制文本旧写法。在 clipboard api 不可用时代替
 * @param text
 * @returns {Promise<Promise<void>|Promise<never>>}
 */
async function oldCopyText(text) {
  // 新建输入框
  const textarea = document.createElement('textarea');
  // 赋值
  textarea.value = text;
  // 样式设置
  Object.assign(textarea.style, {
    position: 'fixed',
    top: 0,
    clipPath: 'circle(0)',
  });
  // 加入到页面
  document.body.append(textarea);
  // 选中
  textarea.select();
  // 复制
  const success = document.execCommand('copy');
  // 从页面移除
  textarea.remove();
  return success ? Promise.resolve() : Promise.reject();
}
const clipboard = {
  /**
   * 写入文本(复制)
   * @param text
   * @returns {Promise<void>}
   */
  async writeText(text) {
    try {
      return await navigator.clipboard.writeText(text);
    } catch (e) {
      return await oldCopyText(text);
    }
  },
  /**
   * 读取文本(粘贴)
   * @returns {Promise<string>}
   */
  async readText() {
    return await navigator.clipboard.readText();
  },
};

/*! js-cookie v3.0.5 | MIT */
/* eslint-disable no-var */
function assign$1 (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign$1({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign$1({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign$1({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign$1({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });

// cookie操作

// 同 js-cookie 的选项合并方式
function assign(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      target[key] = source[key];
    }
  }
  return target;
}
// cookie对象
class Cookie {
  /**
   * init
   * @param options 选项
   *          converter  同 js-cookies 的 converter
   *          attributes 同 js-cookies 的 attributes
   *          json 是否进行json转换。js-cookie 在3.0版本(commit: 4b79290b98d7fbf1ab493a7f9e1619418ac01e45) 移除了对 json 的自动转换，这里默认 true 加上
   */
  constructor(options = {}) {
    // 选项结果
    const { converter = {}, attributes = {}, json = true } = options;
    const optionsResult = {
      ...options,
      json,
      attributes: assign({}, api.attributes, attributes),
      converter: assign({}, api.converter, converter),
    };
    // 声明各属性。直接或在constructor中重新赋值
    // 默认选项结果
    this.$defaults = optionsResult;
  }
  $defaults;
  // 写入
  /**
   * @param name
   * @param value
   * @param attributes
   * @param options 选项
   *          json 是否进行json转换
   * @returns {*}
   */
  set(name, value, attributes, options = {}) {
    const json = 'json' in options ? options.json : this.$defaults.json;
    attributes = assign({}, this.$defaults.attributes, attributes);
    if (json) {
      try {
        value = JSON.stringify(value);
      } catch (e) {
        // console.warn(e);
      }
    }
    return api.set(name, value, attributes);
  }
  // 读取
  /**
   *
   * @param name
   * @param options 配置项
   *          json 是否进行json转换
   * @returns {*}
   */
  get(name, options = {}) {
    const json = 'json' in options ? options.json : this.$defaults.json;
    let result = api.get(name);
    if (json) {
      try {
        result = JSON.parse(result);
      } catch (e) {
        // console.warn(e);
      }
    }
    return result;
  }
  // 移除
  remove(name, attributes) {
    attributes = assign({}, this.$defaults.attributes, attributes);
    return api.remove(name, attributes);
  }
  // 创建。通过配置默认参数创建新对象，简化传参
  create(options = {}) {
    const optionsResult = {
      ...options,
      attributes: assign({}, this.$defaults.attributes, options.attributes),
      converter: assign({}, this.$defaults.attributes, options.converter),
    };
    return new Cookie(optionsResult);
  }
}
const cookie = new Cookie();

function promisifyRequest(request) {
    return new Promise((resolve, reject) => {
        // @ts-ignore - file size hacks
        request.oncomplete = request.onsuccess = () => resolve(request.result);
        // @ts-ignore - file size hacks
        request.onabort = request.onerror = () => reject(request.error);
    });
}
function createStore(dbName, storeName) {
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    const dbp = promisifyRequest(request);
    return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
    if (!defaultGetStoreFunc) {
        defaultGetStoreFunc = createStore('keyval-store', 'keyval');
    }
    return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function get(key, customStore = defaultGetStore()) {
    return customStore('readonly', (store) => promisifyRequest(store.get(key)));
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function set(key, value, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.put(value, key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Set multiple values at once. This is faster than calling set() multiple times.
 * It's also atomic – if one of the pairs can't be added, none will be added.
 *
 * @param entries Array of entries, where each entry is an array of `[key, value]`.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function setMany(entries, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        entries.forEach((entry) => store.put(entry[1], entry[0]));
        return promisifyRequest(store.transaction);
    });
}
/**
 * Get multiple values by their keys
 *
 * @param keys
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function getMany(keys, customStore = defaultGetStore()) {
    return customStore('readonly', (store) => Promise.all(keys.map((key) => promisifyRequest(store.get(key)))));
}
/**
 * Update a value. This lets you see the old value and update it as an atomic operation.
 *
 * @param key
 * @param updater A callback that takes the old value and returns a new value.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function update(key, updater, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => 
    // Need to create the promise manually.
    // If I try to chain promises, the transaction closes in browsers
    // that use a promise polyfill (IE10/11).
    new Promise((resolve, reject) => {
        store.get(key).onsuccess = function () {
            try {
                store.put(updater(this.result), key);
                resolve(promisifyRequest(store.transaction));
            }
            catch (err) {
                reject(err);
            }
        };
    }));
}
/**
 * Delete a particular key from the store.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function del(key, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.delete(key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Delete multiple keys at once.
 *
 * @param keys List of keys to delete.
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function delMany(keys, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        keys.forEach((key) => store.delete(key));
        return promisifyRequest(store.transaction);
    });
}
/**
 * Clear all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function clear(customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.clear();
        return promisifyRequest(store.transaction);
    });
}
function eachCursor(store, callback) {
    store.openCursor().onsuccess = function () {
        if (!this.result)
            return;
        callback(this.result);
        this.result.continue();
    };
    return promisifyRequest(store.transaction);
}
/**
 * Get all keys in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function keys(customStore = defaultGetStore()) {
    return customStore('readonly', (store) => {
        // Fast path for modern browsers
        if (store.getAllKeys) {
            return promisifyRequest(store.getAllKeys());
        }
        const items = [];
        return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
    });
}
/**
 * Get all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function values(customStore = defaultGetStore()) {
    return customStore('readonly', (store) => {
        // Fast path for modern browsers
        if (store.getAll) {
            return promisifyRequest(store.getAll());
        }
        const items = [];
        return eachCursor(store, (cursor) => items.push(cursor.value)).then(() => items);
    });
}
/**
 * Get all entries in the store. Each entry is an array of `[key, value]`.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function entries(customStore = defaultGetStore()) {
    return customStore('readonly', (store) => {
        // Fast path for modern browsers
        // (although, hopefully we'll get a simpler path some day)
        if (store.getAll && store.getAllKeys) {
            return Promise.all([
                promisifyRequest(store.getAllKeys()),
                promisifyRequest(store.getAll()),
            ]).then(([keys, values]) => keys.map((key, i) => [key, values[i]]));
        }
        const items = [];
        return customStore('readonly', (store) => eachCursor(store, (cursor) => items.push([cursor.key, cursor.value])).then(() => items));
    });
}

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  clear: clear,
  createStore: createStore,
  del: del,
  delMany: delMany,
  entries: entries,
  get: get,
  getMany: getMany,
  keys: keys,
  promisifyRequest: promisifyRequest,
  set: set,
  setMany: setMany,
  update: update,
  values: values
});

class _Storage {
  /**
   * init
   * @param options 选项
   *          storage 对应的storage对象。localStorage 或 sessionStorage
   *          json 是否进行json转换。
   * @returns {void|*}
   */
  constructor(options = {}) {
    const { from, json = true } = options;
    const optionsResult = {
      ...options,
      from,
      json,
    };
    Object.assign(this, {
      // 默认选项结果
      $defaults: optionsResult,
      // 对应的storage对象。
      storage: from,
      // 原有方法。由于 Object.create(from) 方式继承时调用会报 Uncaught TypeError: Illegal invocation，改成单独加入方式
      setItem: from.setItem.bind(from),
      getItem: from.getItem.bind(from),
      removeItem: from.removeItem.bind(from),
      key: from.key.bind(from),
      clear: from.clear.bind(from),
    });
  }
  // 声明各属性。直接或在constructor中重新赋值
  $defaults;
  storage;
  setItem;
  getItem;
  removeItem;
  key;
  clear;
  get length() {
    return this.storage.length;
  }
  // 判断属性是否存在。同时用于在 get 中对不存在的属性返回 undefined
  has(key) {
    return Object.keys(this.storage).includes(key);
  }
  // 写入
  set(key, value, options = {}) {
    const json = 'json' in options ? options.json : this.$defaults.json;
    if (json) {
      // 处理存 undefined 的情况，注意对象中的显式 undefined 的属性会被 json 序列化移除
      if (value === undefined) {
        return;
      }
      try {
        value = JSON.stringify(value);
      } catch (e) {
        console.warn(e);
      }
    }
    return this.storage.setItem(key, value);
  }
  // 读取
  get(key, options = {}) {
    const json = 'json' in options ? options.json : this.$defaults.json;
    // 处理无属性的的情况返回 undefined
    if (json && !this.has(key)) {
      return undefined;
    }
    // 其他值判断返回
    let result = this.storage.getItem(key);
    if (json) {
      try {
        result = JSON.parse(result);
      } catch (e) {
        console.warn(e);
      }
    }
    return result;
  }
  // 移除
  remove(key) {
    return localStorage.removeItem(key);
  }
  // 创建。通过配置默认参数创建新对象，简化传参
  create(options = {}) {
    const optionsResult = Object.assign({}, this.$defaults, options);
    return new _Storage(optionsResult);
  }
}
const _localStorage = new _Storage({ from: localStorage });
const _sessionStorage = new _Storage({ from: sessionStorage });

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Cookie: Cookie,
  _Storage: _Storage,
  _localStorage: _localStorage,
  _sessionStorage: _sessionStorage,
  clipboard: clipboard,
  cookie: cookie,
  idbKeyval: index$1,
  jsCookie: api
});

export { index$4 as base, index$3 as dev, index$2 as network, index as storage };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL19TZXQuanMiLCIuLi8uLi9zcmMvYmFzZS9fQXJyYXkuanMiLCIuLi8uLi9zcmMvYmFzZS9fRGF0ZS5qcyIsIi4uLy4uL3NyYy9iYXNlL19NYXRoLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX051bWJlci5qcyIsIi4uLy4uL3NyYy9iYXNlL19SZWZsZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvRGF0YS5qcyIsIi4uLy4uL3NyYy9iYXNlL1N1cHBvcnQuanMiLCIuLi8uLi9zcmMvYmFzZS9fT2JqZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1N0cmluZy5qcyIsIi4uLy4uL3NyYy9iYXNlL1N0eWxlLmpzIiwiLi4vLi4vc3JjL2Jhc2UvVnVlRGF0YS5qcyIsIi4uLy4uL3NyYy9iYXNlL2luZGV4LmpzIiwiLi4vLi4vc3JjL2Rldi9lc2xpbnQuanMiLCIuLi8uLi9zcmMvZGV2L3ZpdGUuanMiLCIuLi8uLi9zcmMvbmV0d29yay9zaGFyZWQuanMiLCIuLi8uLi9zcmMvc3RvcmFnZS9icm93c2VyL2NsaXBib2FyZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9qcy1jb29raWVAMy4wLjUvbm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9kaXN0L2pzLmNvb2tpZS5tanMiLCIuLi8uLi9zcmMvc3RvcmFnZS9icm93c2VyL2Nvb2tpZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9pZGIta2V5dmFsQDYuMi4xL25vZGVfbW9kdWxlcy9pZGIta2V5dmFsL2Rpc3QvaW5kZXguanMiLCIuLi8uLi9zcmMvc3RvcmFnZS9icm93c2VyL3N0b3JhZ2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8g6ZuG5ZCIXG5pbXBvcnQgeyBfQXJyYXkgfSBmcm9tICcuL19BcnJheSc7XG5cbmV4cG9ydCBjbGFzcyBfU2V0IGV4dGVuZHMgU2V0IHtcbiAgLyoqXG4gICAqIFvmlrDlop5dIOS6pOmbhlxuICAgKiBAcGFyYW0gc2V0c1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyBpbnRlcnNlY3Rpb24oLi4uc2V0cykge1xuICAgIC8vIOS8oOWPguaVsOmHj1xuICAgIGlmIChzZXRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHNldHNbMF0gPSBzZXRzWzBdIHx8IFtdO1xuICAgICAgc2V0c1sxXSA9IHNldHNbMV0gfHwgW107XG4gICAgfVxuICAgIC8vIOe7n+S4gOexu+Wei+WkhOeQhlxuICAgIHNldHMgPSBuZXcgX0FycmF5KHNldHMpLm1hcChzZXQgPT4gbmV3IF9BcnJheShzZXQpKTtcblxuICAgIGNvbnN0IFtmaXJzdCwgLi4ub3RoZXJzXSA9IHNldHM7XG4gICAgcmV0dXJuIGZpcnN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgIHJldHVybiBvdGhlcnMuZXZlcnkoc2V0ID0+IHNldC5pbmNsdWRlcyh2YWx1ZSkpO1xuICAgIH0pLnRvX1NldCgpO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDlubbpm4ZcbiAgICogQHBhcmFtIHNldHNcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBzdGF0aWMgdW5pb24oLi4uc2V0cykge1xuICAgIC8vIOS8oOWPguaVsOmHj1xuICAgIGlmIChzZXRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHNldHNbMF0gPSBzZXRzWzBdIHx8IFtdO1xuICAgICAgc2V0c1sxXSA9IHNldHNbMV0gfHwgW107XG4gICAgfVxuICAgIC8vIOe7n+S4gOexu+Wei+WkhOeQhlxuICAgIHNldHMgPSBuZXcgX0FycmF5KHNldHMpLm1hcChzZXQgPT4gbmV3IF9BcnJheShzZXQpKTtcblxuICAgIHJldHVybiBzZXRzLmZsYXQoKS50b19TZXQoKTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g6KGl6ZuGXG4gICAqIEBwYXJhbSBtYWluU2V0XG4gICAqIEBwYXJhbSBvdGhlclNldHNcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBzdGF0aWMgY29tcGxlbWVudChtYWluU2V0ID0gW10sIC4uLm90aGVyU2V0cykge1xuICAgIC8vIOS8oOWPguaVsOmHj1xuICAgIGlmIChvdGhlclNldHMubGVuZ3RoIDwgMSkge1xuICAgICAgb3RoZXJTZXRzWzBdID0gb3RoZXJTZXRzWzBdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBtYWluU2V0ID0gbmV3IF9BcnJheShtYWluU2V0KTtcbiAgICBvdGhlclNldHMgPSBuZXcgX0FycmF5KG90aGVyU2V0cykubWFwKGFyZyA9PiBuZXcgX0FycmF5KGFyZykpO1xuICAgIHJldHVybiBtYWluU2V0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgIHJldHVybiBvdGhlclNldHMuZXZlcnkoc2V0ID0+ICFzZXQuaW5jbHVkZXModmFsdWUpKTtcbiAgICB9KS50b19TZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IodmFsdWUgPSBbXSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdfU2V0IGNvbnN0cnVjdG9yJywgdmFsdWUpO1xuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IG5ldyBTZXQodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2Fybign5Lyg5Y+C5oql6ZSZ77yM5bCG55Sf5oiQ56m66ZuG5ZCIJywgZSk7XG4gICAgICB2YWx1ZSA9IG5ldyBTZXQoW10pO1xuICAgIH1cbiAgICBzdXBlcih2YWx1ZSk7XG5cbiAgICAvLyBzaXplIFvnu6fmib9dXG4gIH1cblxuICAvLyDmlrnms5XlrprliLbvvJrljp/lnovlkIzlkI3mlrnms5Ur5paw5aKe5pa55rOV44CC6YOo5YiG5a6a5Yi25oiQ6L+U5ZueIHRoaXMg5L6/5LqO6ZO+5byP5pON5L2cXG4gIC8qKlxuICAgKiDkv67mlLlcbiAgICovXG4gIC8vIFvlrprliLZdXG4gIGFkZCguLi52YWx1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgU2V0LnByb3RvdHlwZS5hZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgZGVsZXRlKC4uLnZhbHVlcykge1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBTZXQucHJvdG90eXBlLmRlbGV0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICBjbGVhcigpIHtcbiAgICBTZXQucHJvdG90eXBlLmNsZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog6YGN5Y6GXG4gICAqL1xuICAvLyBTeW1ib2wuaXRlcmF0b3IgW+e7p+aJv11cbiAgLy8ga2V5cyBb57un5om/XVxuICAvLyB2YWx1ZXMgW+e7p+aJv11cbiAgLy8gZW50cmllcyBb57un5om/XVxuICAvLyBb5a6a5Yi2XVxuICBmb3JFYWNoKCkge1xuICAgIFNldC5wcm90b3R5cGUuZm9yRWFjaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeaJvlxuICAgKi9cbiAgLy8gaGFzIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIOeUn+aIkFxuICAgKi9cbiAgLy8g55u05o6l6YCa6L+HIHRvX0FycmF5IOWSjCB0b19TZXQg6L2s5o2i5pON5L2c5Y2z5Y+v77yM5peg6ZyA6YeN5aSN5a6a5Yi2XG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gW+aWsOWinl1cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIE5hTjtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b1N0cmluZygpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGB7JHt0aGlzLnRvQXJyYXkoKS5qb2luKCcsJyl9fWA7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuICd7fSc7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvQm9vbGVhbihvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5zaXplID4gMDtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9BcnJheSgpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9fQXJyYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfQXJyYXkodGhpcyk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBTZXQodGhpcyk7XG4gIH1cbn1cbiIsIi8vIOaVsOe7hFxuaW1wb3J0IHsgX1NldCB9IGZyb20gJy4vX1NldCc7XG5cbmV4cG9ydCBjbGFzcyBfQXJyYXkgZXh0ZW5kcyBBcnJheSB7XG4gIC8qKlxuICAgKiBzdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBpc0FycmF5IFvnu6fmib9dXG4gIC8vIHN0YXRpYyBmcm9tIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBvZiBb57un5om/XVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IodmFsdWUgPSBbXSkge1xuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IEFycmF5LmZyb20odmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2Fybign5Lyg5Y+C5oql6ZSZ77yM5bCG55Sf5oiQ56m65pWw57uEJywgZSk7XG4gICAgICB2YWx1ZSA9IFtdO1xuICAgIH1cbiAgICBpZiAodmFsdWUubGVuZ3RoID09PSAxICYmIHR5cGVvZiB2YWx1ZVswXSA9PT0gJ251bWJlcicpIHtcbiAgICAgIC8vIOeogOeWj+aVsOe7hOmXrumimO+8jOWFiOiwgyBzdXBlciDnlJ/miJAgdGhpcyDlkI7lho3kv67mlLkgdGhpcyDlhoXlrrlcbiAgICAgIGNvbnN0IHRlbXAgPSB2YWx1ZVswXTtcbiAgICAgIHZhbHVlWzBdID0gdW5kZWZpbmVkO1xuICAgICAgc3VwZXIoLi4udmFsdWUpO1xuICAgICAgdGhpc1swXSA9IHRlbXA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyKC4uLnZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBsZW5ndGggW+e7p+aJv11cbiAgfVxuXG4gIC8vIOaWueazleWumuWItu+8muWOn+Wei+WQjOWQjeaWueazlSvmlrDlop7jgILpg6jliIblrprliLbmiJDov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgLyoqXG4gICAqIOS/ruaUuVxuICAgKi9cbiAgLy8gW+WumuWItl1cbiAgcHVzaCgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHBvcChsZW5ndGggPSAxKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgQXJyYXkucHJvdG90eXBlLnBvcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB1bnNoaWZ0KCkge1xuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgc2hpZnQobGVuZ3RoID0gMSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICBzcGxpY2UoKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvmlrDlop5dIOWIoOmZpFxuICBkZWxldGUodmFsdWUpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZEluZGV4KHZhbCA9PiB2YWwgPT09IHZhbHVlKTtcbiAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+aWsOWinl0g5riF56m6XG4gIGNsZWFyKCkge1xuICAgIHRoaXMuc3BsaWNlKDApO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvmlrDlop5dIOWOu+mHjVxuICB1bmlxdWUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnRvX1NldCgpLnRvX0FycmF5KCk7XG4gICAgdGhpcy5jbGVhcigpLnB1c2goLi4udmFsdWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIHNvcnQgW+e7p+aJv11cbiAgLy8gW+aWsOWinl0g6ZqP5py65o6S5bqP5pWw57uEXG4gIHJhbmRvbVNvcnQoKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgW3RoaXNbaV0sIHRoaXNbal1dID0gW3RoaXNbal0sIHRoaXNbaV1dO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIHJldmVyc2UgW+e7p+aJv11cbiAgLy8gZmlsbCBb57un5om/XVxuICAvLyBjb3B5V2l0aGluIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIOmBjeWOhlxuICAgKi9cbiAgLy8gU3ltYm9sLml0ZXJhdG9yIFvnu6fmib9dXG4gIC8vIGtleXMgW+e7p+aJv11cbiAgLy8gdmFsdWVzIFvnu6fmib9dXG4gIC8vIGVudHJpZXMgW+e7p+aJv11cbiAgLy8gW+WumuWItl1cbiAgZm9yRWFjaCgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeaJvlxuICAgKi9cbiAgLy8gYXQgW+e7p+aJv11cbiAgLy8gZmluZCBb57un5om/XVxuICAvLyBmaW5kSW5kZXggW+e7p+aJv11cbiAgLy8gZmluZExhc3QgW+e7p+aJv11cbiAgLy8gZmluZExhc3RJbmRleCBb57un5om/XVxuICAvLyBpbmNsdWRlcyBb57un5om/XVxuICAvLyBpbmRleE9mIFvnu6fmib9dXG4gIC8vIGxhc3RJbmRleE9mIFvnu6fmib9dXG4gIC8vIHNvbWUgW+e7p+aJv11cbiAgLy8gZXZlcnkgW+e7p+aJv11cblxuICAvKipcbiAgICog55Sf5oiQXG4gICAqL1xuICAvLyBtYXAgW+e7p+aJv11cbiAgLy8gZmlsdGVyIFvnu6fmib9dXG4gIC8vIHJlZHVjZSBb57un5om/XVxuICAvLyByZWR1Y2VSaWdodCBb57un5om/XVxuICAvLyBjb25jYXQgW+e7p+aJv11cbiAgLy8gc2xpY2UgW+e7p+aJv11cbiAgLy8gam9pbiBb57un5om/XVxuICAvLyBmbGF0IFvnu6fmib9dXG4gIC8vIGZsYXRNYXAgW+e7p+aJv11cbiAgLy8gW+WumuWItl1cbiAgd2l0aCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS53aXRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b1NwbGljZWQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUudG9TcGxpY2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b1NvcnRlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1NvcnRlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9SZXZlcnNlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1JldmVyc2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vIFvmlrDlop5dXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9TdHJpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYHRvU3RyaW5nIOi9rOaNouaKpemUme+8jOWwhueUn+aIkCAnW10nYCwgZSk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoW10pO1xuICAgIH1cbiAgfVxuICAvLyB0b0xvY2FsZVN0cmluZyBb57un5om/XVxuICAvLyBb5paw5aKeXVxuICB0b0Jvb2xlYW4oKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoID4gMDtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b1NldCgpIHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b19TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBfU2V0KHRoaXMpO1xuICB9XG59XG4iLCIvLyDml6XmnJ/ml7bpl7RcbmV4cG9ydCBjbGFzcyBfRGF0ZSBleHRlbmRzIERhdGUge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyBb5paw5aKeXVxuICBzdGF0aWMgUkVHRVhfUEFSU0UgPSAvXihcXGR7NH0pWy0vXT8oXFxkezEsMn0pP1stL10/KFxcZHswLDJ9KVtUdFxcc10qKFxcZHsxLDJ9KT86PyhcXGR7MSwyfSk/Oj8oXFxkezEsMn0pP1suOl0/KFxcZCspPyQvO1xuICBzdGF0aWMgUkVHRVhfRk9STUFUID0gL1xcWyhbXlxcXV0rKV18WXsxLDR9fE17MSw0fXxEezEsMn18ZHsxLDR9fEh7MSwyfXxoezEsMn18YXxBfG17MSwyfXxzezEsMn18WnsxLDJ9fFNTUy9nO1xuICAvLyBzdGF0aWMgbm93IFvnu6fmib9dXG4gIC8vIHN0YXRpYyBwYXJzZSBb57un5om/XVxuICAvLyBzdGF0aWMgVVRDIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ19EYXRlIGNvbnN0cnVjdG9yJywgYXJncyk7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBudWxsIOWSjOaYvuW8jyB1bmRlZmluZWQg6YO96KeG5Li65peg5pWI5YC8XG4gICAgICBpZiAoYXJnc1swXSA9PT0gbnVsbCkge1xuICAgICAgICBhcmdzWzBdID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgLy8gc2FmYXJpIOa1j+iniOWZqOWtl+espuS4suagvOW8j+WFvOWuuVxuICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlQWxsKCctJywgJy8nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAvLyBb5paw5aKeXVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAneWVhcicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnVsbFllYXIoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtb250aCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TW9udGgoKSArIDE7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZGF5Jywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXRlKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnd2VlaycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF5KCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaG91cicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SG91cnMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzaG9ydEhvdXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGNvbnN0IGhvdXIgPSB0aGlzLmhvdXI7XG4gICAgICAgIHJldHVybiBob3VyICUgMTIgPT09IDAgPyBob3VyIDogaG91ciAlIDEyO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21pbnV0ZScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWludXRlcygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3NlY29uZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2Vjb25kcygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21pbGxpc2Vjb25kJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNaWxsaXNlY29uZHMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0aW1lWm9uZU9mZnNldEhvdXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyDmoLzlvI/ljJblrZfnrKbkuLLnlKjjgILmgLvkvZPlkIwgZWxlbWVudCDnlKjnmoQgZGF5LmpzIOagvOW8jyhodHRwczovL2RheS5qcy5vcmcvZG9jcy96aC1DTi9kaXNwbGF5L2Zvcm1hdCnvvIzpo47moLzlrprliLbmiJDkuK3mlodcbiAgICB0aGlzLmZvcm1hdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1lZJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy55ZWFyLnRvU3RyaW5nKCkuc2xpY2UoLTIpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdZWVlZJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy55ZWFyLnRvU3RyaW5nKCkuc2xpY2UoLTQpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdNJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5tb250aC50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdNTScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubW9udGgudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdEJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5kYXkudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnREQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmRheS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ2QnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsn5ZGo5pelJywgJ+WRqOS4gCcsICflkajkuownLCAn5ZGo5LiJJywgJ+WRqOWbmycsICflkajkupQnLCAn5ZGo5YWtJ11bJHRoaXMud2Vla107XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ2RkJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbJ+aYn+acn+aXpScsICfmmJ/mnJ/kuIAnLCAn5pif5pyf5LqMJywgJ+aYn+acn+S4iScsICfmmJ/mnJ/lm5snLCAn5pif5pyf5LqUJywgJ+aYn+acn+WFrSddWyR0aGlzLndlZWtdO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdIJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5ob3VyLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0hIJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5ob3VyLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnaCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2hvcnRIb3VyLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ2hoJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zaG9ydEhvdXIudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdtJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5taW51dGUudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnbW0nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1pbnV0ZS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ3MnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNlY29uZC50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdzcycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2Vjb25kLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnU1NTJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5taWxsaXNlY29uZC50b1N0cmluZygpLnBhZFN0YXJ0KDMsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ2EnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmhvdXIgPCAxMiA/ICfkuIrljYgnIDogJ+S4i+WNiCc7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0EnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmE7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1onLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2lnbiA9ICR0aGlzLnRpbWVab25lT2Zmc2V0SG91ciA8IDAgPyAnKycgOiAnLSc7XG4gICAgICAgIHJldHVybiBgJHtzaWdufSR7KC0kdGhpcy50aW1lWm9uZU9mZnNldEhvdXIpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX06MDBgO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdaWicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuWi5yZXBsYWNlKCc6JywgJycpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBb57un5om/XSBnZXQg57O75YiX5pa55rOV44CC5L2/55SoIHllYXLjgIFtb250aCDnrYnpgJrov4fmlrDlop7lsZ7mgKfojrflj5bljbPlj6/vvIznroDljJblhpnms5XvvIzml6DpnIDpop3lpJblrprliLZcbiAgICovXG4gIC8vIGdldFRpbWUgW+e7p+aJv11cbiAgLy8gZ2V0VGltZXpvbmVPZmZzZXQgW+e7p+aJv11cblxuICAvLyBnZXRZZWFyIFvnu6fmib9dXG4gIC8vIGdldEZ1bGxZZWFyIFvnu6fmib9dXG4gIC8vIGdldE1vbnRoIFvnu6fmib9dXG4gIC8vIGdldERhdGUgW+e7p+aJv11cbiAgLy8gZ2V0RGF5IFvnu6fmib9dXG4gIC8vIGdldEhvdXJzIFvnu6fmib9dXG4gIC8vIGdldE1pbnV0ZXMgW+e7p+aJv11cbiAgLy8gZ2V0U2Vjb25kcyBb57un5om/XVxuICAvLyBnZXRNaWxsaXNlY29uZHMgW+e7p+aJv11cblxuICAvLyBnZXRVVENGdWxsWWVhciBb57un5om/XVxuICAvLyBnZXRVVENNb250aCBb57un5om/XVxuICAvLyBnZXRVVENEYXRlIFvnu6fmib9dXG4gIC8vIGdldFVUQ0RheSBb57un5om/XVxuICAvLyBnZXRVVENIb3VycyBb57un5om/XVxuICAvLyBnZXRVVENNaW51dGVzIFvnu6fmib9dXG4gIC8vIGdldFVUQ1NlY29uZHMgW+e7p+aJv11cbiAgLy8gZ2V0VVRDTWlsbGlzZWNvbmRzIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIFvlrprliLZdIHNldCDns7vliJfmlrnms5XjgILlrprliLbmiJDov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgICovXG4gIHNldFRpbWUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VGltZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0WWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRZZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0RnVsbFllYXIoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0RnVsbFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNb250aCgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRNb250aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldERhdGUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0RGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldEhvdXJzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldEhvdXJzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0TWludXRlcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRNaW51dGVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0U2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRTZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0TWlsbGlzZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1pbGxpc2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0VVRDRnVsbFllYXIoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDRnVsbFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNb250aCgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENNb250aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ0RhdGUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ0hvdXJzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ0hvdXJzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDTWludXRlcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENNaW51dGVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDU2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENTZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDTWlsbGlzZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01pbGxpc2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gW+aWsOWinl1cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGltZSgpO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvU3RyaW5nKGZvcm1hdCA9ICdZWVlZLU1NLUREIGhoOm1tOnNzJykge1xuICAgIGlmICghdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2VBbGwodGhpcy5jb25zdHJ1Y3Rvci5SRUdFWF9GT1JNQVQsIChtYXRjaCwgJDEpID0+IHtcbiAgICAgIC8vIFtdIOmHjOmdoueahOWGheWuueWOn+agt+i+k+WHulxuICAgICAgaWYgKCQxKSB7XG4gICAgICAgIHJldHVybiAkMTtcbiAgICAgIH1cbiAgICAgIC8vIOagvOW8j1xuICAgICAgaWYgKG1hdGNoIGluIHRoaXMuZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFttYXRjaF07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9EYXRlU3RyaW5nKGZvcm1hdCA9ICdZWVlZLU1NLUREJykge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKGZvcm1hdCk7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9UaW1lU3RyaW5nKGZvcm1hdCA9ICdISDptbTpzcycpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZyhmb3JtYXQpO1xuICB9XG4gIC8vIHRvTG9jYWxlU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvTG9jYWxlRGF0ZVN0cmluZyBb57un5om/XVxuICAvLyB0b0xvY2FsZVRpbWVTdHJpbmcgW+e7p+aJv11cbiAgLy8gdG9JU09TdHJpbmcgW+e7p+aJv11cbiAgLy8gdG9VVENTdHJpbmcgW+e7p+aJv11cbiAgLy8gdG9HTVRTdHJpbmcgW+e7p+aJv11cbiAgLy8gW+aWsOWinl1cbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiAhTnVtYmVyLmlzTmFOKHRoaXMuZ2V0VGltZSgpKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0pTT04ob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgfVxuICAvLyB2YWx1ZU9mIFvnu6fmib9dXG59XG4iLCIvLyDmlbDlrabov5DnrpfjgILlr7kgTWF0aCDlr7nosaHmianlsZXvvIzmj5Dkvpvmm7Tnm7Top4LlkoznrKblkIjmlbDlrabnuqblrprnmoTlkI3np7BcbmltcG9ydCB7IF9BcnJheSB9IGZyb20gJy4vX0FycmF5JztcbmltcG9ydCB7IF9TZXQgfSBmcm9tICcuL19TZXQnO1xuZXhwb3J0IGNvbnN0IF9NYXRoID0gT2JqZWN0LmNyZWF0ZShNYXRoKTtcblxuLy8g5bi46YePXG4vLyBFIFvnu6fmib9dXG4vLyBMTjIgW+e7p+aJv11cbi8vIExOMTAgW+e7p+aJv11cbi8vIExPRzJFIFvnu6fmib9dXG4vLyBMT0cxMEUgW+e7p+aJv11cbi8vIFBJIFvnu6fmib9dXG4vLyBTUVJUMV8yIFvnu6fmib9dXG4vLyBTUVJUMiBb57un5om/XVxuLy8g6buE6YeR5YiG5Ymy5q+UIFBISVxuX01hdGguUEhJID0gKE1hdGguc3FydCg1KSAtIDEpIC8gMjtcbl9NYXRoLlBISV9CSUcgPSAoTWF0aC5zcXJ0KDUpICsgMSkgLyAyO1xuXG4vLyDluLjop4Rcbi8vIGFicyBb57un5om/XVxuLy8gbWluIFvnu6fmib9dXG4vLyBtYXggW+e7p+aJv11cbi8vIHJhbmRvbSBb57un5om/XVxuLy8gc2lnbiBb57un5om/XVxuLy8gaHlwb3QgW+e7p+aJv11cbi8vIGNsejMyIFvnu6fmib9dXG4vLyBpbXVsIFvnu6fmib9dXG4vLyBmcm91bmQgW+e7p+aJv11cblxuLy8g5Y+W5pW0XG4vLyBjZWlsIFvnu6fmib9dXG4vLyBmbG9vciBb57un5om/XVxuLy8gcm91bmQgW+e7p+aJv11cbi8vIHRydW5jIFvnu6fmib9dXG5cbi8vIOS4ieinkuWHveaVsFxuLy8gc2luIFvnu6fmib9dXG4vLyBjb3MgW+e7p+aJv11cbi8vIHRhbiBb57un5om/XVxuLy8gYXNpbiBb57un5om/XVxuLy8gYWNvcyBb57un5om/XVxuLy8gYXRhbiBb57un5om/XVxuLy8gc2luaCBb57un5om/XVxuLy8gY29zaCBb57un5om/XVxuLy8gdGFuaCBb57un5om/XVxuLy8gYXNpbmggW+e7p+aJv11cbi8vIGFjb3NoIFvnu6fmib9dXG4vLyBhdGFuaCBb57un5om/XVxuLy8gYXRhbjIgW+e7p+aJv11cbi8vIFvmlrDlop5dXG5fTWF0aC5hcmNzaW4gPSBNYXRoLmFzaW4uYmluZChNYXRoKTtcbl9NYXRoLmFyY2NvcyA9IE1hdGguYWNvcy5iaW5kKE1hdGgpO1xuX01hdGguYXJjdGFuID0gTWF0aC5hdGFuLmJpbmQoTWF0aCk7XG5fTWF0aC5hcnNpbmggPSBNYXRoLmFzaW5oLmJpbmQoTWF0aCk7XG5fTWF0aC5hcmNvc2ggPSBNYXRoLmFjb3NoLmJpbmQoTWF0aCk7XG5fTWF0aC5hcnRhbmggPSBNYXRoLmF0YW5oLmJpbmQoTWF0aCk7XG5cbi8vIOWvueaVsFxuLy8gbG9nMiBb57un5om/XVxuLy8gbG9nMTAgW+e7p+aJv11cbi8vIGxvZzFwIFvnu6fmib9dXG4vLyBb5a6a5Yi2XVxuX01hdGgubG9nID0gZnVuY3Rpb24oYSwgeCkge1xuICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZyhhKTtcbn07XG5fTWF0aC5sb2dlID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbl9NYXRoLmxuID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbl9NYXRoLmxnID0gTWF0aC5sb2cxMC5iaW5kKE1hdGgpO1xuXG4vLyDmjIfmlbBcbi8vIHBvdyBb57un5om/XVxuLy8gc3FydCBb57un5om/XVxuLy8gY2JydCBb57un5om/XVxuLy8gZXhwIFvnu6fmib9dXG4vLyBleHBtMSBb57un5om/XVxuXG4vLyDpmLbkuZhcbl9NYXRoLmZhY3RvcmlhbCA9IGZ1bmN0aW9uKG4pIHtcbiAgbGV0IHJlc3VsdCA9IDFuO1xuICBmb3IgKGxldCBpID0gbjsgaSA+PSAxOyBpLS0pIHtcbiAgICByZXN1bHQgKj0gQmlnSW50KGkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuLy8g5o6S5YiXIEFycmFuZ2VtZW50XG5fTWF0aC5BID0gZnVuY3Rpb24obiwgbSkge1xuICByZXR1cm4gX01hdGguZmFjdG9yaWFsKG4pIC8gX01hdGguZmFjdG9yaWFsKG4gLSBtKTtcbn07XG5fTWF0aC5BcnJhbmdlbWVudCA9IF9NYXRoLkE7XG4vLyDnu4TlkIggQ29tYmluYXRpb25cbl9NYXRoLkMgPSBmdW5jdGlvbihuLCBtKSB7XG4gIHJldHVybiBfTWF0aC5BKG4sIG0pIC8gX01hdGguZmFjdG9yaWFsKG0pO1xufTtcbl9NYXRoLkNvbWJpbmF0aW9uID0gX01hdGguQztcblxuLy8g5pWw5YiXXG5fTWF0aC5TZXF1ZW5jZSA9IGNsYXNzIHtcbiAgLy8g55Sf5oiQ5pWw5o2u5pa55rOVXG4gIHRvQXJyYXkobGVuZ3RoID0gdGhpcy5uKSB7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG4gPSBpICsgMTtcbiAgICAgIGFycltpXSA9IHRoaXMuYW4obik7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgdG9fQXJyYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfQXJyYXkodGhpcy50b0FycmF5KC4uLmFyZ3VtZW50cykpO1xuICB9XG4gIHRvU2V0KCkge1xuICAgIHJldHVybiBuZXcgU2V0KHRoaXMudG9BcnJheSguLi5hcmd1bWVudHMpKTtcbiAgfVxuICB0b19TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBfU2V0KHRoaXMudG9BcnJheSguLi5hcmd1bWVudHMpKTtcbiAgfVxufTtcbi8vIOetieW3ruaVsOWIl1xuX01hdGguQXJpdGhtZXRpY1NlcXVlbmNlID0gY2xhc3MgZXh0ZW5kcyBfTWF0aC5TZXF1ZW5jZSB7XG4gIGNvbnN0cnVjdG9yKGExLCBkLCBuID0gMCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hMSA9IGExOyAvLyDpppbpoblcbiAgICB0aGlzLmQgPSBkOyAvLyDlhazlt65cbiAgICB0aGlzLm4gPSBuOyAvLyDpu5jorqTpobnmlbDvvIzlj6/nlKjkuo7mlrnms5XnmoTkvKDlj4LnroDljJZcbiAgfVxuICAvLyDnrKxu6aG5XG4gIGFuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gdGhpcy5hMSArIChuIC0gMSkgKiB0aGlzLmQ7XG4gIH1cbiAgLy8g5YmNbumhueaxguWSjFxuICBTbihuID0gdGhpcy5uKSB7XG4gICAgcmV0dXJuIG4gLyAyICogKHRoaXMuYTEgKyB0aGlzLmFuKG4pKTtcbiAgfVxufTtcbi8vIOetieavlOaVsOWIl1xuX01hdGguR2VvbWV0cmljU2VxdWVuY2UgPSBjbGFzcyBleHRlbmRzIF9NYXRoLlNlcXVlbmNlIHtcbiAgY29uc3RydWN0b3IoYTEsIHEsIG4gPSAwKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmExID0gYTE7IC8vIOmmlumhuVxuICAgIHRoaXMucSA9IHE7IC8vIOWFrOavlFxuICAgIHRoaXMubiA9IG47IC8vIOm7mOiupOmhueaVsO+8jOWPr+eUqOS6juaWueazleeahOS8oOWPgueugOWMllxuICB9XG4gIC8vIOesrG7poblcbiAgYW4obiA9IHRoaXMubikge1xuICAgIHJldHVybiB0aGlzLmExICogdGhpcy5xICoqIChuIC0gMSk7XG4gIH1cbiAgLy8g5YmNbumhueaxguWSjFxuICBTbihuID0gdGhpcy5uKSB7XG4gICAgaWYgKHRoaXMucSA9PT0gMSkge1xuICAgICAgcmV0dXJuIG4gKiB0aGlzLmExO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hMSAqICgxIC0gdGhpcy5xICoqIG4pIC8gKDEgLSB0aGlzLnEpO1xuICB9XG59O1xuLy8g5paQ5rOi6YKj5aWR5pWw5YiXXG5fTWF0aC5GaWJvbmFjY2lTZXF1ZW5jZSA9IGNsYXNzIGV4dGVuZHMgX01hdGguU2VxdWVuY2Uge1xuICBjb25zdHJ1Y3RvcihuID0gMCkge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdhMScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW4oMSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMubiA9IG47IC8vIOm7mOiupOmhueaVsO+8jOWPr+eUqOS6juaWueazleeahOS8oOWPgueugOWMllxuICB9XG4gIC8vIOesrG7poblcbiAgYW4obiA9IHRoaXMubikge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKChfTWF0aC5QSElfQklHICoqIG4gLSAoMSAtIF9NYXRoLlBISV9CSUcpICoqIG4pIC8gTWF0aC5zcXJ0KDUpKTtcbiAgfVxuICAvLyDliY1u6aG55rGC5ZKMXG4gIFNuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gdGhpcy5hbihuICsgMikgLSAxO1xuICB9XG59O1xuLy8g57Sg5pWw5pWw5YiXXG5fTWF0aC5QcmltZVNlcXVlbmNlID0gY2xhc3MgZXh0ZW5kcyBfTWF0aC5TZXF1ZW5jZSB7XG4gIC8vIOaYr+WQpue0oOaVsFxuICBzdGF0aWMgaXNQcmltZSh4KSB7XG4gICAgaWYgKHggPD0gMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMjsgaSA8PSBNYXRoLnNxcnQoeCk7IGkrKykge1xuICAgICAgaWYgKHggJSBpID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgLy8g5Yib5bu657Sg5pWw5YiX6KGoXG4gIHN0YXRpYyBjcmVhdGVMaXN0KGExLCBuKSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGxldCB2YWx1ZSA9IGExO1xuICAgIHdoaWxlIChyZXN1bHQubGVuZ3RoIDwgbikge1xuICAgICAgaWYgKHRoaXMuaXNQcmltZSh2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgICAgdmFsdWUrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGExID0gMiwgbiA9IDApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLmNvbnN0cnVjdG9yLmNyZWF0ZUxpc3QoYTEsIG4pO1xuICAgIHRoaXMuYTEgPSBhMTtcbiAgICB0aGlzLm4gPSBuOyAvLyDpu5jorqTpobnmlbDvvIzlj6/nlKjkuo7mlrnms5XnmoTkvKDlj4LnroDljJZcbiAgfVxuXG4gIGFuKG4gPSB0aGlzLm4pIHtcbiAgICBpZiAobiA8PSB0aGlzLm4pIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlW24gLSAxXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY3JlYXRlTGlzdCh0aGlzLmExLCBuKVtuIC0gMV07XG4gIH1cbiAgU24obiA9IHRoaXMubikge1xuICAgIHJldHVybiB0aGlzLnRvQXJyYXkobikucmVkdWNlKCh0b3RhbCwgdmFsKSA9PiB0b3RhbCArIHZhbCwgMCk7XG4gIH1cbn07XG4iLCIvLyDmlbDlrZdcbmV4cG9ydCBjbGFzcyBfTnVtYmVyIGV4dGVuZHMgTnVtYmVyIHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIE5hTiBb57un5om/XVxuICAvLyBzdGF0aWMgUE9TSVRJVkVfSU5GSU5JVFkgW+e7p+aJv11cbiAgLy8gc3RhdGljIE5FR0FUSVZFX0lORklOSVRZIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBNQVhfVkFMVUUgW+e7p+aJv11cbiAgLy8gc3RhdGljIE1JTl9WQUxVRSBb57un5om/XVxuICAvLyBzdGF0aWMgTUFYX1NBRkVfSU5URUdFUiBb57un5om/XVxuICAvLyBzdGF0aWMgTUlOX1NBRkVfSU5URUdFUiBb57un5om/XVxuICAvLyBzdGF0aWMgRVBTSUxPTiBb57un5om/XVxuXG4gIC8vIHN0YXRpYyBpc05hTiBb57un5om/XVxuICAvLyBzdGF0aWMgaXNGaW5pdGUgW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzSW50ZWdlciBb57un5om/XVxuICAvLyBzdGF0aWMgaXNTYWZlSW50ZWdlciBb57un5om/XVxuICAvLyBzdGF0aWMgcGFyc2VJbnQgW+e7p+aJv11cbiAgLy8gc3RhdGljIHBhcnNlRmxvYXQgW+e7p+aJv11cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgdmFsdWUgPSBOdW1iZXIucGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgc3VwZXIodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOeUn+aIkFxuICAgKi9cbiAgLy8gW+aWsOWinl0g6L+U5Zue5paw5YC877yM5pa55L6/6LWL5YC85aaCIG51bSA9IG51bS5uZXcodmFsdWUpIOWGmeazlVxuICBuZXcodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vIHRvUHJlY2lzaW9uIFvnu6fmib9dXG4gIC8vIHRvRml4ZWQgW+e7p+aJv11cbiAgLy8gW+aWsOWinl0g5Yy65Yir5LqOIHRvRml4ZWTvvIzkvJrnp7vpmaTlpJrkvZnnmoQgMCDku6Xnsr7nroDmmL7npLpcbiAgdG9NYXhGaXhlZChmcmFjdGlvbkRpZ2l0cyA9IDApIHtcbiAgICBjb25zdCBzdHIgPSBOdW1iZXIucHJvdG90eXBlLnRvRml4ZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gTnVtYmVyLnBhcnNlRmxvYXQoc3RyKS50b1N0cmluZygpO1xuICB9XG4gIC8vIHRvRXhwb25lbnRpYWwgW+e7p+aJv11cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyBb5paw5aKeXVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgY29uc29sZS5sb2coJ19OdW1iZXIgU3ltYm9sLnRvUHJpbWl0aXZlJywgeyBoaW50IH0pO1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xuICB9XG4gIC8vIHZhbHVlT2YgW+e7p+aJv11cbiAgLy8gdG9TdHJpbmcgW+e7p+aJv11cbiAgLy8gdG9Mb2NhbGVTdHJpbmcgW+e7p+aJv11cbiAgLy8gW+aWsOWinl1cbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiAhTnVtYmVyLmlzTmFOKHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBfUmVmbGVjdCA9IE9iamVjdC5jcmVhdGUoUmVmbGVjdCk7XG5cbi8vIGFwcGx5IOe7p+aJv1xuLy8gY29uc3RydWN0IOe7p+aJv1xuLy8gZGVmaW5lUHJvcGVydHkg57un5om/XG4vLyBkZWxldGVQcm9wZXJ0eSDnu6fmib9cbi8vIGdldCDnu6fmib9cbi8vIGdldE93blByb3BlcnR5RGVzY3JpcHRvciDnu6fmib9cbi8vIGdldFByb3RvdHlwZU9mIOe7p+aJv1xuLy8gb3duS2V5cyDnu6fmib9cbi8vIHNldCDnu6fmib9cbi8vIHNldFByb3RvdHlwZU9mIOe7p+aJv1xuLy8gcHJldmVudEV4dGVuc2lvbnMg57un5om/XG4vLyBoYXMg57un5om/XG4vLyBpc0V4dGVuc2libGUg57un5om/XG5cbi8vIOWvuSBvd25LZXlzIOmFjeWllyBvd25WYWx1ZXMg5ZKMIG93bkVudHJpZXNcbl9SZWZsZWN0Lm93blZhbHVlcyA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCkubWFwKGtleSA9PiB0YXJnZXRba2V5XSk7XG59O1xuX1JlZmxlY3Qub3duRW50cmllcyA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCkubWFwKGtleSA9PiBba2V5LCB0YXJnZXRba2V5XV0pO1xufTtcbiIsIi8vIOaVsOaNruWkhOeQhu+8jOWkhOeQhuWkmuagvOW8j+aVsOaNrueUqFxuZXhwb3J0IGNvbnN0IERhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuLyoqXG4gKiDkvJjljJYgdHlwZW9mXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEByZXR1cm5zIHsndW5kZWZpbmVkJ3wnb2JqZWN0J3wnYm9vbGVhbid8J251bWJlcid8J3N0cmluZyd8J2Z1bmN0aW9uJ3wnc3ltYm9sJ3wnYmlnaW50J3xzdHJpbmd9XG4gKi9cbkRhdGEudHlwZW9mID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuICByZXR1cm4gdHlwZW9mIHZhbHVlO1xufTtcbi8qKlxuICog5Yik5pat566A5Y2V57G75Z6LXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5EYXRhLmlzU2ltcGxlVHlwZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBbJ251bGwnLCAndW5kZWZpbmVkJywgJ251bWJlcicsICdzdHJpbmcnLCAnYm9vbGVhbicsICdiaWdpbnQnLCAnc3ltYm9sJ10uaW5jbHVkZXModGhpcy50eXBlb2YodmFsdWUpKTtcbn07XG4vKipcbiAqIOaYr+WQpuaZrumAmuWvueixoVxuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGF0YS5pc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJztcbn07XG4vKipcbiAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei1xuICogQHBhcmFtIHZhbHVlIOWAvFxuICogQHJldHVybnMge09iamVjdENvbnN0cnVjdG9yfCp8RnVuY3Rpb259IOi/lOWbnuWvueW6lOaehOmAoOWHveaVsOOAgm51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gKi9cbkRhdGEuZ2V0RXhhY3RUeXBlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gbnVsbOOAgXVuZGVmaW5lZCDljp/moLfov5Tlm55cbiAgaWYgKFtudWxsLCB1bmRlZmluZWRdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICAvLyB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaHml7YgX19wcm90b19fIOS4uiBudWxsXG4gIGNvbnN0IGlzT2JqZWN0QnlDcmVhdGVOdWxsID0gX19wcm90b19fID09PSBudWxsO1xuICBpZiAoaXNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0QnlDcmVhdGVOdWxsJywgX19wcm90b19fKTtcbiAgICByZXR1cm4gT2JqZWN0O1xuICB9XG4gIC8vIOWvueW6lOe7p+aJv+eahOWvueixoSBfX3Byb3RvX18g5rKh5pyJIGNvbnN0cnVjdG9yIOWxnuaAp1xuICBjb25zdCBpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSAhKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKTtcbiAgaWYgKGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsJywgX19wcm90b19fKTtcbiAgICByZXR1cm4gT2JqZWN0O1xuICB9XG4gIC8vIOi/lOWbnuWvueW6lOaehOmAoOWHveaVsFxuICByZXR1cm4gX19wcm90b19fLmNvbnN0cnVjdG9yO1xufTtcbi8qKlxuICog6I635Y+W5YC855qE5YW35L2T57G75Z6L5YiX6KGoXG4gKiBAcGFyYW0gdmFsdWUg5YC8XG4gKiBAcmV0dXJucyB7KltdfSDnu5/kuIDov5Tlm57mlbDnu4TjgIJudWxs44CBdW5kZWZpbmVkIOWvueW6lOS4uiBbbnVsbF0sW3VuZGVmaW5lZF1cbiAqL1xuRGF0YS5nZXRFeGFjdFR5cGVzID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gbnVsbOOAgXVuZGVmaW5lZCDliKTmlq3lpITnkIZcbiAgaWYgKFtudWxsLCB1bmRlZmluZWRdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgIHJldHVybiBbdmFsdWVdO1xuICB9XG4gIC8vIOaJq+WOn+Wei+mTvuW+l+WIsOWvueW6lOaehOmAoOWHveaVsFxuICBsZXQgcmVzdWx0ID0gW107XG4gIGxldCBsb29wID0gMDtcbiAgbGV0IGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSBmYWxzZTtcbiAgbGV0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCd3aGlsZScsIGxvb3AsIF9fcHJvdG9fXyk7XG4gICAgaWYgKF9fcHJvdG9fXyA9PT0gbnVsbCkge1xuICAgICAgLy8g5LiA6L+b5p2lIF9fcHJvdG9fXyDlsLHmmK8gbnVsbCDor7TmmI4gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGhXG4gICAgICBpZiAobG9vcCA8PSAwKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKE9iamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKE9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pIHtcbiAgICAgIHJlc3VsdC5wdXNoKF9fcHJvdG9fXy5jb25zdHJ1Y3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKE9iamVjdCk7XG4gICAgICBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gdHJ1ZTtcbiAgICB9XG4gICAgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKF9fcHJvdG9fXyk7XG4gICAgbG9vcCsrO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIOa3seaLt+i0neaVsOaNrlxuICogQHBhcmFtIHNvdXJjZVxuICogQHJldHVybnMge01hcDxhbnksIGFueT58U2V0PGFueT58e318KnwqW119XG4gKi9cbkRhdGEuZGVlcENsb25lID0gZnVuY3Rpb24oc291cmNlKSB7XG4gIC8vIOaVsOe7hFxuICBpZiAoc291cmNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gU2V0XG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHNvdXJjZS52YWx1ZXMoKSkge1xuICAgICAgcmVzdWx0LmFkZCh0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIE1hcFxuICBpZiAoc291cmNlIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2Ygc291cmNlLmVudHJpZXMoKSkge1xuICAgICAgcmVzdWx0LnNldChrZXksIHRoaXMuZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g5a+56LGhXG4gIGlmICh0aGlzLmdldEV4YWN0VHlwZShzb3VyY2UpID09PSBPYmplY3QpIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAvLyB2YWx1ZeaWueW8j++8mumAkuW9kuWkhOeQhlxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIHtcbiAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmRlZXBDbG9uZShkZXNjLnZhbHVlKSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBnZXQvc2V0IOaWueW8j++8muebtOaOpeWumuS5iVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOWFtuS7lu+8muWOn+agt+i/lOWbnlxuICByZXR1cm4gc291cmNlO1xufTtcbi8qKlxuICog5rex6Kej5YyF5pWw5o2uXG4gKiBAcGFyYW0gZGF0YSDlgLxcbiAqIEBwYXJhbSBpc1dyYXAg5YyF6KOF5pWw5o2u5Yik5pat5Ye95pWw77yM5aaCIHZ1ZTMg55qEIGlzUmVmIOWHveaVsFxuICogQHBhcmFtIHVud3JhcCDop6PljIXmlrnlvI/lh73mlbDvvIzlpoIgdnVlMyDnmoQgdW5yZWYg5Ye95pWwXG4gKiBAcmV0dXJucyB7e1twOiBzdHJpbmddOiAqfHtbcDogc3RyaW5nXTogYW55fX18KnwoKnx7W3A6IHN0cmluZ106IGFueX0pW118e1twOiBzdHJpbmddOiBhbnl9fVxuICovXG5EYXRhLmRlZXBVbndyYXAgPSBmdW5jdGlvbihkYXRhLCB7IGlzV3JhcCA9ICgpID0+IGZhbHNlLCB1bndyYXAgPSB2YWwgPT4gdmFsIH0gPSB7fSkge1xuICAvLyDpgInpobnmlLbpm4ZcbiAgY29uc3Qgb3B0aW9ucyA9IHsgaXNXcmFwLCB1bndyYXAgfTtcbiAgLy8g5YyF6KOF57G75Z6L77yI5aaCdnVlM+WTjeW6lOW8j+Wvueixoe+8ieaVsOaNruino+WMhVxuICBpZiAoaXNXcmFwKGRhdGEpKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVlcFVud3JhcCh1bndyYXAoZGF0YSksIG9wdGlvbnMpO1xuICB9XG4gIC8vIOmAkuW9kuWkhOeQhueahOexu+Wei1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIGRhdGEubWFwKHZhbCA9PiB0aGlzLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKSk7XG4gIH1cbiAgaWYgKHRoaXMuZ2V0RXhhY3RUeXBlKGRhdGEpID09PSBPYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGRhdGEpLm1hcCgoW2tleSwgdmFsXSkgPT4ge1xuICAgICAgcmV0dXJuIFtrZXksIHRoaXMuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpXTtcbiAgICB9KSk7XG4gIH1cbiAgLy8g5YW25LuW5Y6f5qC36L+U5ZueXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIi8vIOi+heWKqVxuZXhwb3J0IGNvbnN0IFN1cHBvcnQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vKipcbiAqIOWxnuaAp+WQjee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICogQHBhcmFtIG5hbWVzIOWxnuaAp+WQjeOAguagvOW8jyAnYSxiLGMnIOaIliBbJ2EnLCdiJywnYyddXG4gKiBAcGFyYW0gc2VwYXJhdG9yIG5hbWVzIOS4uuWtl+espuS4suaXtueahOaLhuWIhuinhOWImeOAguWQjCBzcGxpdCDmlrnms5XnmoQgc2VwYXJhdG9y77yM5a2X56ym5Liy5peg6ZyA5ouG5YiG55qE5Y+v5Lul5LygIG51bGwg5oiWIHVuZGVmaW5lZFxuICogQHJldHVybnMgeypbXVtdfChNYWdpY1N0cmluZyB8IEJ1bmRsZSB8IHN0cmluZylbXXxGbGF0QXJyYXk8KEZsYXRBcnJheTwoKnxbKltdXXxbXSlbXSwgMT5bXXwqfFsqW11dfFtdKVtdLCAxPltdfCpbXX1cbiAqL1xuU3VwcG9ydC5uYW1lc1RvQXJyYXkgPSBmdW5jdGlvbihuYW1lcyA9IFtdLCB7IHNlcGFyYXRvciA9ICcsJyB9ID0ge30pIHtcbiAgaWYgKG5hbWVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gbmFtZXMubWFwKHZhbCA9PiB0aGlzLm5hbWVzVG9BcnJheSh2YWwpKS5mbGF0KCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbmFtZXMuc3BsaXQoc2VwYXJhdG9yKS5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgfVxuICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3ltYm9sJykge1xuICAgIHJldHVybiBbbmFtZXNdO1xuICB9XG4gIHJldHVybiBbXTtcbn07XG5cbi8qKlxuICog57uR5a6adGhpc+OAguW4uOeUqOS6juino+aehOWHveaVsOaXtue7keWumiB0aGlzIOmBv+WFjeaKpemUmVxuICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaFcbiAqIEBwYXJhbSBvcHRpb25zIOmAiemhuVxuICogQHJldHVybnMgeyp9XG4gKi9cblN1cHBvcnQuYmluZFRoaXMgPSBmdW5jdGlvbih0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4gbmV3IFByb3h5KHRhcmdldCwge1xuICAgIGdldCh0YXJnZXQsIHAsIHJlY2VpdmVyKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IFJlZmxlY3QuZ2V0KC4uLmFyZ3VtZW50cyk7XG4gICAgICAvLyDlh73mlbDnsbvlnovnu5Hlrpp0aGlzXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5bGe5oCn5Y6f5qC36L+U5ZueXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcbiAgfSk7XG59O1xuIiwiLy8g5a+56LGhXG5pbXBvcnQgeyBfUmVmbGVjdCB9IGZyb20gJy4vX1JlZmxlY3QnO1xuaW1wb3J0IHsgRGF0YSB9IGZyb20gJy4vRGF0YSc7XG5pbXBvcnQgeyBTdXBwb3J0IH0gZnJvbSAnLi9TdXBwb3J0JztcblxuLy8gZXh0ZW5kcyBPYmplY3Qg5pa55byP6LCD55SoIHN1cGVyIOWwhueUn+aIkOepuuWvueixoe+8jOS4jeS8muWDj+aZrumAmuaehOmAoOWHveaVsOmCo+agt+WIm+W7uuS4gOS4quaWsOeahOWvueixoe+8jOaUueWunueOsFxuZXhwb3J0IGNsYXNzIF9PYmplY3Qge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyBzdGF0aWMgY3JlYXRlIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBmcm9tRW50cmllcyBb57un5om/XVxuICAvLyBzdGF0aWMgZ2V0UHJvdG90eXBlT2YgW+e7p+aJv11cbiAgLy8gc3RhdGljIHNldFByb3RvdHlwZU9mIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBkZWZpbmVQcm9wZXJ0eSBb57un5om/XVxuICAvLyBzdGF0aWMgZGVmaW5lUHJvcGVydGllcyBb57un5om/XVxuICAvLyBzdGF0aWMgaGFzT3duIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgW+e7p+aJv11cbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5TmFtZXMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5U3ltYm9scyBb57un5om/XVxuICAvLyBzdGF0aWMgaXMgW+e7p+aJv11cbiAgLy8gc3RhdGljIHByZXZlbnRFeHRlbnNpb25zIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc0V4dGVuc2libGUgW+e7p+aJv11cbiAgLy8gc3RhdGljIHNlYWwgW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzU2VhbGVkIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBmcmVlemUgW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzRnJvemVuIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIFvlrprliLZdIOa1heWQiOW5tuWvueixoeOAguWGmeazleWQjCBPYmplY3QuYXNzaWdu77yM6YCa6L+H6YeN5a6a5LmJ5pa55byP5ZCI5bm277yM6Kej5YazIE9iamVjdC5hc3NpZ24g5ZCI5bm25Lik6L655ZCM5ZCN5bGe5oCn5re35pyJIHZhbHVl5YaZ5rOVIOWSjCBnZXQvc2V05YaZ5rOVIOaXtuaKpSBUeXBlRXJyb3I6IENhbm5vdCBzZXQgcHJvcGVydHkgYiBvZiAjPE9iamVjdD4gd2hpY2ggaGFzIG9ubHkgYSBnZXR0ZXIg55qE6Zeu6aKYXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gICAqIEBwYXJhbSBzb3VyY2VzIOaVsOaNrua6kOOAguS4gOS4quaIluWkmuS4quWvueixoVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgYXNzaWduKHRhcmdldCA9IHt9LCAuLi5zb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgICAgLy8g5LiN5L2/55SoIHRhcmdldFtrZXldID0gdmFsdWUg5YaZ5rOV77yM55u05o6l5L2/55SoIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSDph43lrprkuYlcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g5rex5ZCI5bm25a+56LGh44CC5ZCMIGFzc2lnbiDkuIDmoLfkuZ/kvJrlr7nlsZ7mgKfov5vooYzph43lrprkuYlcbiAgICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaFcbiAgICogQHBhcmFtIHNvdXJjZXMg5pWw5o2u5rqQXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBkZWVwQXNzaWduKHRhcmdldCwgLi4uc291cmNlcykge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gdGhpcy5hc3NpZ24oe30sIC4uLnNvdXJjZXMpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAvLyB2YWx1ZSDlhpnms5XvvJrlr7nosaHpgJLlvZLlpITnkIbvvIzlhbbku5bnm7TmjqXlrprkuYlcbiAgICAgICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGRlc2MudmFsdWUpKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcEFzc2lnbih0YXJnZXRba2V5XSwgZGVzYy52YWx1ZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0L3NldCDlhpnms5XvvJrnm7TmjqXlrprkuYlcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogW+WumuWItl0g6I635Y+W5bGe5oCn5ZCN44CC6buY6K6k5Y+C5pWw6YWN572u5oiQ5ZCMIE9iamVjdC5rZXlzIOihjOS4ulxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7YW55W119XG4gICAqL1xuICBzdGF0aWMga2V5cyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICAvLyBzZXTnlKjkuo5rZXnljrvph41cbiAgICBsZXQgc2V0ID0gbmV3IFNldCgpO1xuICAgIC8vIOiHqui6q+WxnuaAp+etm+mAiVxuICAgIGNvbnN0IGRlc2NzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqZWN0KTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIF9SZWZsZWN0Lm93bkVudHJpZXMoZGVzY3MpKSB7XG4gICAgICAvLyDlv73nlaVzeW1ib2zlsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghc3ltYm9sICYmIHR5cGVvZiBrZXkgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5b+955Wl5LiN5Y+v5YiX5Li+5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIW5vdEVudW1lcmFibGUgJiYgIWRlc2MuZW51bWVyYWJsZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWxnuaAp+WKoOWFpVxuICAgICAgc2V0LmFkZChrZXkpO1xuICAgIH1cbiAgICAvLyDnu6fmib/lsZ7mgKdcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICAgIGlmIChfX3Byb3RvX18gIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgcGFyZW50S2V5cyA9IHRoaXMua2V5cyhfX3Byb3RvX18sIG9wdGlvbnMpO1xuICAgICAgICBmb3IgKGNvbnN0IHBhcmVudEtleSBvZiBwYXJlbnRLZXlzKSB7XG4gICAgICAgICAgc2V0LmFkZChwYXJlbnRLZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIOi/lOWbnuaVsOe7hFxuICAgIHJldHVybiBBcnJheS5mcm9tKHNldCk7XG4gIH1cbiAgLyoqXG4gICAqIFvlrprliLZdXG4gICAqL1xuICBzdGF0aWMgdmFsdWVzKCkge1xuICB9XG4gIC8qKlxuICAgKiBb5a6a5Yi2XVxuICAgKi9cbiAgc3RhdGljIGVudHJpZXMoKSB7XG4gIH1cblxuICAvKipcbiAgICogW+aWsOWinl0ga2V56Ieq6Lqr5omA5bGe55qE5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXkg5bGe5oCn5ZCNXG4gICAqIEByZXR1cm5zIHsqfG51bGx9XG4gICAqL1xuICBzdGF0aWMgb3duZXIob2JqZWN0LCBrZXkpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gICAgbGV0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vd25lcihfX3Byb3RvX18sIGtleSk7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOiOt+WPluWxnuaAp+aPj+i/sOWvueixoe+8jOebuOavlCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9y77yM6IO95ou/5Yiw57un5om/5bGe5oCn55qE5o+P6L+w5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3RcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfFByb3BlcnR5RGVzY3JpcHRvcn1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9yKG9iamVjdCwga2V5KSB7XG4gICAgY29uc3QgZmluZE9iamVjdCA9IHRoaXMub3duZXIob2JqZWN0LCBrZXkpO1xuICAgIGlmICghZmluZE9iamVjdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZmluZE9iamVjdCwga2V5KTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3Jz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHsoUHJvcGVydHlEZXNjcmlwdG9yfHVuZGVmaW5lZClbXX1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9ycyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICBjb25zdCBfa2V5cyA9IHRoaXMua2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICAgIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSkpO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvckVudHJpZXPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge1sqLChQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkKV1bXX1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9yRW50cmllcyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICBjb25zdCBfa2V5cyA9IHRoaXMua2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICAgIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IFtrZXksIHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSldKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBb5paw5aKeXSDov4fmu6Tlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHBpY2sg5oyR6YCJ5bGe5oCnXG4gICAqIEBwYXJhbSBvbWl0IOW/veeVpeWxnuaAp1xuICAgKiBAcGFyYW0gZW1wdHlQaWNrIHBpY2sg5Li656m65pe255qE5Y+W5YC844CCYWxsIOWFqOmDqGtlee+8jGVtcHR5IOepulxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOWQjCBuYW1lc1RvQXJyYXkg55qEIHNlcGFyYXRvciDlj4LmlbBcbiAgICogQHBhcmFtIHN5bWJvbCDlkIwga2V5cyDnmoQgc3ltYm9sIOWPguaVsFxuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDlkIwga2V5cyDnmoQgbm90RW51bWVyYWJsZSDlj4LmlbBcbiAgICogQHBhcmFtIGV4dGVuZCDlkIwga2V5cyDnmoQgZXh0ZW5kIOWPguaVsFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZmlsdGVyKG9iamVjdCwgeyBwaWNrID0gW10sIG9taXQgPSBbXSwgZW1wdHlQaWNrID0gJ2FsbCcsIHNlcGFyYXRvciA9ICcsJywgc3ltYm9sID0gdHJ1ZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSB0cnVlIH0gPSB7fSkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAvLyBwaWNr44CBb21pdCDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgICBwaWNrID0gU3VwcG9ydC5uYW1lc1RvQXJyYXkocGljaywgeyBzZXBhcmF0b3IgfSk7XG4gICAgb21pdCA9IFN1cHBvcnQubmFtZXNUb0FycmF5KG9taXQsIHsgc2VwYXJhdG9yIH0pO1xuICAgIGxldCBfa2V5cyA9IFtdO1xuICAgIC8vIHBpY2vmnInlgLznm7TmjqXmi7/vvIzkuLrnqbrml7bmoLnmja4gZW1wdHlQaWNrIOm7mOiupOaLv+epuuaIluWFqOmDqGtleVxuICAgIF9rZXlzID0gcGljay5sZW5ndGggPiAwIHx8IGVtcHR5UGljayA9PT0gJ2VtcHR5JyA/IHBpY2sgOiB0aGlzLmtleXMob2JqZWN0LCB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH0pO1xuICAgIC8vIG9taXTnrZvpgIlcbiAgICBfa2V5cyA9IF9rZXlzLmZpbHRlcihrZXkgPT4gIW9taXQuaW5jbHVkZXMoa2V5KSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgX2tleXMpIHtcbiAgICAgIGNvbnN0IGRlc2MgPSB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuICAgICAgLy8g5bGe5oCn5LiN5a2Y5Zyo5a+86Ie0ZGVzY+W+l+WIsHVuZGVmaW5lZOaXtuS4jeiuvue9ruWAvFxuICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g6YCa6L+H5oyR6YCJ5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVyIOeahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIHBpY2sob2JqZWN0LCBrZXlzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihvYmplY3QsIHsgcGljazoga2V5cywgZW1wdHlQaWNrOiAnZW1wdHknLCAuLi5vcHRpb25zIH0pO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDpgJrov4fmjpLpmaTmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXIg55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgb21pdChvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBvbWl0OiBrZXlzLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IHt9KSB7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5hc3NpZ24odGhpcywgdmFsdWUpO1xuICB9XG5cbiAgLy8gX19wcm90b19fIFvnu6fmib9dXG4gIC8vIF9fZGVmaW5lR2V0dGVyX18gW+e7p+aJv11cbiAgLy8gX19kZWZpbmVTZXR0ZXJfXyBb57un5om/XVxuICAvLyBfX2xvb2t1cEdldHRlcl9fIFvnu6fmib9dXG4gIC8vIF9fbG9va3VwU2V0dGVyX18gW+e7p+aJv11cbiAgLy8gaXNQcm90b3R5cGVPZiBb57un5om/XVxuICAvLyBoYXNPd25Qcm9wZXJ0eSBb57un5om/XVxuICAvLyBwcm9wZXJ0eUlzRW51bWVyYWJsZSBb57un5om/XVxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vIFvmlrDlop5dXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9TdHJpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe30pO1xuICAgIH1cbiAgfVxuICAvLyB0b0xvY2FsZVN0cmluZyBb57un5om/XVxuICAvLyBb5paw5aKeXVxuICB0b0Jvb2xlYW4oKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMpLmxlbmd0aCA+IDA7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIHZhbHVlT2YgW+e7p+aJv11cbn1cbk9iamVjdC5zZXRQcm90b3R5cGVPZihfT2JqZWN0LCBPYmplY3QpO1xuIiwiZXhwb3J0IGNsYXNzIF9TdHJpbmcgZXh0ZW5kcyBTdHJpbmcge1xuICAvKipcbiAgICogU3RhdGljXG4gICAqL1xuICAvLyBzdGF0aWMgZnJvbUNoYXJDb2RlIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBmcm9tQ29kZVBvaW50IFvnu6fmib9dXG4gIC8vIHN0YXRpYyByYXcgW+e7p+aJv11cblxuICAvKipcbiAgICogW+aWsOWinl0g6aaW5a2X5q+N5aSn5YaZXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9GaXJzdFVwcGVyQ2FzZShuYW1lID0gJycpIHtcbiAgICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvVXBwZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOmmluWtl+avjeWwj+WGmVxuICAgKiBAcGFyYW0gbmFtZSDlkI3np7BcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0ZpcnN0TG93ZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9Mb3dlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g6L2s6am85bOw5ZG95ZCN44CC5bi455So5LqO6L+e5o6l56ym5ZG95ZCN6L2s6am85bOw5ZG95ZCN77yM5aaCIHh4LW5hbWUgLT4geHhOYW1lXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOi/nuaOpeespuOAgueUqOS6jueUn+aIkOato+WImSDpu5jorqTkuLrkuK3liJLnur8gLSDlr7nlupRyZWdleHDlvpfliLAgLy0oXFx3KS9nXG4gICAqIEBwYXJhbSBmaXJzdCDpppblrZfmr43lpITnkIbmlrnlvI/jgIJ0cnVlIOaIliAndXBwZXJjYXNlJ++8mui9rOaNouaIkOWkp+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSDmiJYgJ2xvd2VyY2FzZSfvvJrovazmjaLmiJDlsI/lhpk7XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Jhdycg5oiWIOWFtuS7luaXoOaViOWAvO+8mum7mOiupOWOn+agt+i/lOWbnu+8jOS4jei/m+ihjOWkhOeQhjtcbiAgICogQHJldHVybnMge01hZ2ljU3RyaW5nfHN0cmluZ3xzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9DYW1lbENhc2UobmFtZSwgeyBzZXBhcmF0b3IgPSAnLScsIGZpcnN0ID0gJ3JhdycgfSA9IHt9KSB7XG4gICAgLy8g55Sf5oiQ5q2j5YiZXG4gICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cChgJHtzZXBhcmF0b3J9KFxcXFx3KWAsICdnJyk7XG4gICAgLy8g5ou85o6l5oiQ6am85bOwXG4gICAgY29uc3QgY2FtZWxOYW1lID0gbmFtZS5yZXBsYWNlQWxsKHJlZ2V4cCwgKHN1YnN0ciwgJDEpID0+IHtcbiAgICAgIHJldHVybiAkMS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICAgIC8vIOmmluWtl+avjeWkp+Wwj+WGmeagueaNruS8oOWPguWIpOaWrVxuICAgIGlmIChbdHJ1ZSwgJ3VwcGVyY2FzZSddLmluY2x1ZGVzKGZpcnN0KSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9GaXJzdFVwcGVyQ2FzZShjYW1lbE5hbWUpO1xuICAgIH1cbiAgICBpZiAoW2ZhbHNlLCAnbG93ZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0ZpcnN0TG93ZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBjYW1lbE5hbWU7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOi9rOi/nuaOpeespuWRveWQjeOAguW4uOeUqOS6jumpvOWzsOWRveWQjei9rOi/nuaOpeespuWRveWQje+8jOWmgiB4eE5hbWUgLT4geHgtbmFtZVxuICAgKiBAcGFyYW0gbmFtZSDlkI3np7BcbiAgICogQHBhcmFtIHNlcGFyYXRvciDov57mjqXnrKZcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0xpbmVDYXNlKG5hbWUgPSAnJywgeyBzZXBhcmF0b3IgPSAnLScgfSA9IHt9KSB7XG4gICAgcmV0dXJuIG5hbWVcbiAgICAvLyDmjInov57mjqXnrKbmi7zmjqVcbiAgICAgIC5yZXBsYWNlQWxsKC8oW2Etel0pKFtBLVpdKS9nLCBgJDEke3NlcGFyYXRvcn0kMmApXG4gICAgLy8g6L2s5bCP5YaZXG4gICAgICAudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICBzdXBlcih2YWx1ZSk7XG4gIH1cblxuICAvLyBhbmNob3Ig57un5om/XG4gIC8vIGJpZyDnu6fmib9cbiAgLy8gYmxpbmsg57un5om/XG4gIC8vIGJvbGQg57un5om/XG4gIC8vIGZpeGVkIOe7p+aJv1xuICAvLyBmb250Y29sb3Ig57un5om/XG4gIC8vIGZvbnRzaXplIOe7p+aJv1xuICAvLyBpdGFsaWNzIOe7p+aJv1xuICAvLyBsaW5rIOe7p+aJv1xuICAvLyBzbWFsbCDnu6fmib9cbiAgLy8gc3RyaWtlIOe7p+aJv1xuICAvLyBzdWIg57un5om/XG4gIC8vIHN1cCDnu6fmib9cblxuICAvLyBbU3ltYm9sLml0ZXJhdG9yXSDnu6fmib9cbiAgLy8gbGVuZ3RoIOe7p+aJv1xuICAvLyBzcGxpdCDnu6fmib9cbiAgLy8gbWF0Y2gg57un5om/XG4gIC8vIG1hdGNoQWxsIOe7p+aJv1xuXG4gIC8vIGF0IOe7p+aJv1xuICAvLyBjaGFyQXQg57un5om/XG4gIC8vIGNoYXJDb2RlQXQg57un5om/XG4gIC8vIGNvZGVQb2ludEF0IOe7p+aJv1xuICAvLyBpbmRleE9mIOe7p+aJv1xuICAvLyBsYXN0SW5kZXhPZiDnu6fmib9cbiAgLy8gc2VhcmNoIOe7p+aJv1xuICAvLyBpbmNsdWRlcyDnu6fmib9cbiAgLy8gc3RhcnRzV2l0aCDnu6fmib9cbiAgLy8gZW5kc1dpdGgg57un5om/XG5cbiAgLy8gc2xpY2Ug57un5om/XG4gIC8vIHN1YnN0cmluZyDnu6fmib9cbiAgLy8gc3Vic3RyIOe7p+aJv1xuICAvLyBjb25jYXQg57un5om/XG4gIC8vIHRyaW0g57un5om/XG4gIC8vIHRyaW1TdGFydCDnu6fmib9cbiAgLy8gdHJpbUVuZCDnu6fmib9cbiAgLy8gdHJpbUxlZnQg57un5om/XG4gIC8vIHRyaW1SaWdodCDnu6fmib9cbiAgLy8gcGFkU3RhcnQg57un5om/XG4gIC8vIHBhZEVuZCDnu6fmib9cbiAgLy8gcmVwZWF0IOe7p+aJv1xuICAvLyByZXBsYWNlIOe7p+aJv1xuICAvLyByZXBsYWNlQWxsIOe7p+aJv1xuICAvLyB0b0xvd2VyQ2FzZSDnu6fmib9cbiAgLy8gdG9VcHBlckNhc2Ug57un5om/XG4gIC8vIHRvTG9jYWxlTG93ZXJDYXNlIOe7p+aJv1xuICAvLyB0b0xvY2FsZVVwcGVyQ2FzZSDnu6fmib9cbiAgLy8gbG9jYWxlQ29tcGFyZSDnu6fmib9cbiAgLy8gbm9ybWFsaXplIOe7p+aJv1xuICAvLyBpc1dlbGxGb3JtZWQg57un5om/XG4gIC8vIHRvV2VsbEZvcm1lZCDnu6fmib9cblxuICAvLyB0b1N0cmluZyDnu6fmib9cbiAgLy8gdmFsdWVPZiDnu6fmib9cbn1cbiIsIi8vIOagt+W8j+WkhOeQhlxuZXhwb3J0IGNvbnN0IFN0eWxlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiDljZXkvY3lrZfnrKbkuLLjgILlr7nmlbDlrZfmiJbmlbDlrZfmoLzlvI/nmoTlrZfnrKbkuLLoh6rliqjmi7zljZXkvY3vvIzlhbbku5blrZfnrKbkuLLljp/moLfov5Tlm55cbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEBwYXJhbSB1bml0IOWNleS9jeOAgnZhbHVl5rKh5bim5Y2V5L2N5pe26Ieq5Yqo5ou85o6l77yM5Y+v5LygIHB4L2VtLyUg562JXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN0cmluZ31cbiAqL1xuU3R5bGUuZ2V0VW5pdFN0cmluZyA9IGZ1bmN0aW9uKHZhbHVlID0gJycsIHsgdW5pdCA9ICdweCcgfSA9IHt9KSB7XG4gIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgLy8g5rOo5oSP77ya6L+Z6YeM5L2/55SoID09IOWIpOaWre+8jOS4jeS9v+eUqCA9PT1cbiAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPT0gdmFsdWUgPyBgJHt2YWx1ZX0ke3VuaXR9YCA6IFN0cmluZyh2YWx1ZSk7XG59O1xuIiwiLy8gdnVlIOaVsOaNruWkhOeQhlxuaW1wb3J0IHsgX1N0cmluZyB9IGZyb20gJy4vX1N0cmluZyc7XG5pbXBvcnQgeyBEYXRhIH0gZnJvbSAnLi9EYXRhJztcblxuZXhwb3J0IGNvbnN0IFZ1ZURhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vKipcbiAgICog5rex6Kej5YyFIHZ1ZTMg5ZON5bqU5byP5a+56LGh5pWw5o2uXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiAqfX18KnwoKnx7W3A6IHN0cmluZ106ICp9KVtdfHtbcDogc3RyaW5nXTogKn19XG4gICAqL1xuVnVlRGF0YS5kZWVwVW53cmFwVnVlMyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgcmV0dXJuIERhdGEuZGVlcFVud3JhcChkYXRhLCB7XG4gICAgaXNXcmFwOiBkYXRhID0+IGRhdGE/Ll9fdl9pc1JlZixcbiAgICB1bndyYXA6IGRhdGEgPT4gZGF0YS52YWx1ZSxcbiAgfSk7XG59O1xuXG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcERlZmluaXRpb25zIHByb3BzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0UHJvcHNGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgcHJvcERlZmluaXRpb25zKSB7XG4gIC8vIHByb3BzIOWumuS5iee7n+S4gOaIkOWvueixoeagvOW8j++8jHR5cGUg57uf5LiA5oiQ5pWw57uE5qC85byP5Lul5L6/5ZCO57ut5Yik5patXG4gIGlmIChwcm9wRGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhwcm9wRGVmaW5pdGlvbnMubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIHsgdHlwZTogW10gfV0pKTtcbiAgfSBlbHNlIGlmIChEYXRhLmlzUGxhaW5PYmplY3QocHJvcERlZmluaXRpb25zKSkge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpLm1hcCgoW25hbWUsIGRlZmluaXRpb25dKSA9PiB7XG4gICAgICBkZWZpbml0aW9uID0gRGF0YS5pc1BsYWluT2JqZWN0KGRlZmluaXRpb24pXG4gICAgICAgID8geyAuLi5kZWZpbml0aW9uLCB0eXBlOiBbZGVmaW5pdGlvbi50eXBlXS5mbGF0KCkgfVxuICAgICAgICA6IHsgdHlwZTogW2RlZmluaXRpb25dLmZsYXQoKSB9O1xuICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBkZWZpbml0aW9uXTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgcHJvcERlZmluaXRpb25zID0ge307XG4gIH1cbiAgLy8g6K6+572u5YC8XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBbbmFtZSwgZGVmaW5pdGlvbl0gb2YgT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKSkge1xuICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBkZWZpbml0aW9uLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICAvLyBwcm9wTmFtZSDmiJYgcHJvcC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgY29uc3QgYXR0clZhbHVlID0gYXR0cnNbbmFtZV07XG4gICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgIC8vIOWPquWMheWQq0Jvb2xlYW7nsbvlnovnmoQnJ+i9rOaNouS4unRydWXvvIzlhbbku5bljp/moLfotYvlgLxcbiAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBkZWZpbml0aW9uLnR5cGUubGVuZ3RoID09PSAxICYmIGRlZmluaXRpb24udHlwZS5pbmNsdWRlcyhCb29sZWFuKSAmJiBhdHRyVmFsdWUgPT09ICcnID8gdHJ1ZSA6IGF0dHJWYWx1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gcHJvcC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgaWYgKGVuZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZXRSZXN1bHQoeyBuYW1lOiBfU3RyaW5nLnRvTGluZUNhc2UobmFtZSksIGRlZmluaXRpb24sIGVuZDogdHJ1ZSB9KTtcbiAgICB9KSh7XG4gICAgICBuYW1lLCBkZWZpbml0aW9uLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgZW1pdHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIGVtaXREZWZpbml0aW9ucyBlbWl0cyDlrprkuYnvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldEVtaXRzRnJvbUF0dHJzID0gZnVuY3Rpb24oYXR0cnMsIGVtaXREZWZpbml0aW9ucykge1xuICAvLyBlbWl0cyDlrprkuYnnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChlbWl0RGVmaW5pdGlvbnMpKSB7XG4gICAgZW1pdERlZmluaXRpb25zID0gT2JqZWN0LmtleXMoZW1pdERlZmluaXRpb25zKTtcbiAgfSBlbHNlIGlmICghKGVtaXREZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGVtaXREZWZpbml0aW9ucyA9IFtdO1xuICB9XG4gIC8vIOe7n+S4gOWkhOeQhuaIkCBvbkVtaXROYW1l44CBb25VcGRhdGU6ZW1pdE5hbWUodi1tb2RlbOezu+WIlykg5qC85byPXG4gIGNvbnN0IGVtaXROYW1lcyA9IGVtaXREZWZpbml0aW9ucy5tYXAobmFtZSA9PiBfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgKGZ1bmN0aW9uIHNldFJlc3VsdCh7IG5hbWUsIGVuZCA9IGZhbHNlIH0pIHtcbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uVXBkYXRlOicpKSB7XG4gICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2V0UmVzdWx0KHsgbmFtZTogYG9uVXBkYXRlOiR7X1N0cmluZy50b0xpbmVDYXNlKG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKSl9YCwgZW5kOiB0cnVlIH0pO1xuICAgICAgfVxuICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgcmVzdWx0W25hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICB9XG4gICAgfSkoeyBuYW1lIH0pO1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbi8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+W5Ymp5L2Z5bGe5oCn44CC5bi455So5LqO57uE5Lu2IGluaGVyaXRBdHRycyDorr7nva4gZmFsc2Ug5pe25L2/55So5L2c5Li65paw55qEIGF0dHJzXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIHByb3BzIHByb3BzIOWumuS5iSDmiJYgdnVlIHByb3Bz77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICAgKiBAcGFyYW0gZW1pdHMgZW1pdHMg5a6a5LmJIOaIliB2dWUgZW1pdHPvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqIEBwYXJhbSBsaXN0IOmineWklueahOaZrumAmuWxnuaAp1xuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuVnVlRGF0YS5nZXRSZXN0RnJvbUF0dHJzID0gZnVuY3Rpb24oYXR0cnMsIHsgcHJvcHMsIGVtaXRzLCBsaXN0ID0gW10gfSA9IHt9KSB7XG4gIC8vIOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICBwcm9wcyA9ICgoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gKCgpID0+IHtcbiAgICAgIGlmIChwcm9wcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgIH1cbiAgICAgIGlmIChEYXRhLmlzUGxhaW5PYmplY3QocHJvcHMpKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBfU3RyaW5nLnRvTGluZUNhc2UobmFtZSldKS5mbGF0KCk7XG4gIH0pKCk7XG4gIGVtaXRzID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSAoKCkgPT4ge1xuICAgICAgaWYgKGVtaXRzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIGVtaXRzO1xuICAgICAgfVxuICAgICAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChlbWl0cykpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGVtaXRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9KSgpO1xuICAgIHJldHVybiBhcnIubWFwKChuYW1lKSA9PiB7XG4gICAgICAvLyB1cGRhdGU6ZW1pdE5hbWUg5oiWIHVwZGF0ZTplbWl0LW5hbWUg5qC85byPXG4gICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCd1cGRhdGU6JykpIHtcbiAgICAgICAgY29uc3QgcGFydE5hbWUgPSBuYW1lLnNsaWNlKG5hbWUuaW5kZXhPZignOicpICsgMSk7XG4gICAgICAgIHJldHVybiBbYG9uVXBkYXRlOiR7X1N0cmluZy50b0NhbWVsQ2FzZShwYXJ0TmFtZSl9YCwgYG9uVXBkYXRlOiR7X1N0cmluZy50b0xpbmVDYXNlKHBhcnROYW1lKX1gXTtcbiAgICAgIH1cbiAgICAgIC8vIG9uRW1pdE5hbWXmoLzlvI/vvIzkuK3liJLnur/moLzlvI/lt7Looqt2dWXovazmjaLkuI3nlKjph43lpI3lpITnkIZcbiAgICAgIHJldHVybiBbX1N0cmluZy50b0NhbWVsQ2FzZShgb24tJHtuYW1lfWApXTtcbiAgICB9KS5mbGF0KCk7XG4gIH0pKCk7XG4gIGxpc3QgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9IHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJ1xuICAgICAgPyBsaXN0LnNwbGl0KCcsJylcbiAgICAgIDogbGlzdCBpbnN0YW5jZW9mIEFycmF5ID8gbGlzdCA6IFtdO1xuICAgIHJldHVybiBhcnIubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH0pKCk7XG4gIGNvbnN0IGxpc3RBbGwgPSBBcnJheS5mcm9tKG5ldyBTZXQoW3Byb3BzLCBlbWl0cywgbGlzdF0uZmxhdCgpKSk7XG4gIC8vIGNvbnNvbGUubG9nKCdsaXN0QWxsJywgbGlzdEFsbCk7XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKGF0dHJzKSkpIHtcbiAgICBpZiAoIWxpc3RBbGwuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIG5hbWUsIGRlc2MpO1xuICAgIH1cbiAgfVxuICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyDln7rnoYDmqKHlnZfjgILmnInlkIzlkI3ljp/nlJ/lr7nosaHnmoTliqAgXyDljLrliIZcbmV4cG9ydCAqIGZyb20gJy4vX0FycmF5JztcbmV4cG9ydCAqIGZyb20gJy4vX0RhdGUnO1xuZXhwb3J0ICogZnJvbSAnLi9fTWF0aCc7XG5leHBvcnQgKiBmcm9tICcuL19OdW1iZXInO1xuZXhwb3J0ICogZnJvbSAnLi9fT2JqZWN0JztcbmV4cG9ydCAqIGZyb20gJy4vX1JlZmxlY3QnO1xuZXhwb3J0ICogZnJvbSAnLi9fU2V0JztcbmV4cG9ydCAqIGZyb20gJy4vX1N0cmluZyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vRGF0YSc7XG5leHBvcnQgKiBmcm9tICcuL1N0eWxlJztcbmV4cG9ydCAqIGZyb20gJy4vU3VwcG9ydCc7XG5leHBvcnQgKiBmcm9tICcuL1Z1ZURhdGEnO1xuIiwiLyoqXG4gKiBlc2xpbnQg6YWN572u77yaaHR0cDovL2VzbGludC5jbi9kb2NzL3J1bGVzL1xuICogZXNsaW50LXBsdWdpbi12dWUg6YWN572u77yaaHR0cHM6Ly9lc2xpbnQudnVlanMub3JnL3J1bGVzL1xuICovXG5pbXBvcnQgeyBfT2JqZWN0LCBEYXRhIH0gZnJvbSAnLi4vYmFzZSc7XG5cbi8qKlxuICog5a+85Ye65bi46YeP5L6/5o235L2/55SoXG4gKi9cbmV4cG9ydCBjb25zdCBPRkYgPSAnb2ZmJztcbmV4cG9ydCBjb25zdCBXQVJOID0gJ3dhcm4nO1xuZXhwb3J0IGNvbnN0IEVSUk9SID0gJ2Vycm9yJztcbi8qKlxuICog5a6a5Yi255qE6YWN572uXG4gKi9cbi8vIOWfuuehgOWumuWItlxuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSB7XG4gIC8vIOeOr+Wig+OAguS4gOS4queOr+Wig+WumuS5ieS6huS4gOe7hOmihOWumuS5ieeahOWFqOWxgOWPmOmHj1xuICBlbnY6IHtcbiAgICBicm93c2VyOiB0cnVlLFxuICAgIG5vZGU6IHRydWUsXG4gIH0sXG4gIC8vIOWFqOWxgOWPmOmHj1xuICBnbG9iYWxzOiB7XG4gICAgZ2xvYmFsVGhpczogJ3JlYWRvbmx5JyxcbiAgICBCaWdJbnQ6ICdyZWFkb25seScsXG4gIH0sXG4gIC8vIOino+aekOWZqFxuICBwYXJzZXJPcHRpb25zOiB7XG4gICAgZWNtYVZlcnNpb246ICdsYXRlc3QnLFxuICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnLFxuICAgIGVjbWFGZWF0dXJlczoge1xuICAgICAganN4OiB0cnVlLFxuICAgICAgZXhwZXJpbWVudGFsT2JqZWN0UmVzdFNwcmVhZDogdHJ1ZSxcbiAgICB9LFxuICB9LFxuICAvKipcbiAgICog57un5om/XG4gICAqIOS9v+eUqGVzbGludOeahOinhOWIme+8mmVzbGludDrphY3nva7lkI3np7BcbiAgICog5L2/55So5o+S5Lu255qE6YWN572u77yacGx1Z2luOuWMheWQjeeugOWGmS/phY3nva7lkI3np7BcbiAgICovXG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggZXNsaW50IOaOqOiNkOeahOinhOWImVxuICAgICdlc2xpbnQ6cmVjb21tZW5kZWQnLFxuICBdLFxuICAvKipcbiAgICog6KeE5YiZXG4gICAqIOadpeiHqiBlc2xpbnQg55qE6KeE5YiZ77ya6KeE5YiZSUQgOiB2YWx1ZVxuICAgKiDmnaXoh6rmj5Lku7bnmoTop4TliJnvvJrljIXlkI3nroDlhpkv6KeE5YiZSUQgOiB2YWx1ZVxuICAgKi9cbiAgcnVsZXM6IHtcbiAgICAvKipcbiAgICAgKiBQb3NzaWJsZSBFcnJvcnNcbiAgICAgKiDov5nkupvop4TliJnkuI4gSmF2YVNjcmlwdCDku6PnoIHkuK3lj6/og73nmoTplJnor6/miJbpgLvovpHplJnor6/mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnZ2V0dGVyLXJldHVybic6IE9GRiwgLy8g5by65Yi2IGdldHRlciDlh73mlbDkuK3lh7rnjrAgcmV0dXJuIOivreWPpVxuICAgICduby1jb25zdGFudC1jb25kaXRpb24nOiBPRkYsIC8vIOemgeatouWcqOadoeS7tuS4reS9v+eUqOW4uOmHj+ihqOi+vuW8j1xuICAgICduby1lbXB0eSc6IE9GRiwgLy8g56aB5q2i5Ye6546w56m66K+t5Y+l5Z2XXG4gICAgJ25vLWV4dHJhLXNlbWknOiBXQVJOLCAvLyDnpoHmraLkuI3lv4XopoHnmoTliIblj7dcbiAgICAnbm8tZnVuYy1hc3NpZ24nOiBPRkYsIC8vIOemgeatouWvuSBmdW5jdGlvbiDlo7DmmI7ph43mlrDotYvlgLxcbiAgICAnbm8tcHJvdG90eXBlLWJ1aWx0aW5zJzogT0ZGLCAvLyDnpoHmraLnm7TmjqXosIPnlKggT2JqZWN0LnByb3RvdHlwZXMg55qE5YaF572u5bGe5oCnXG5cbiAgICAvKipcbiAgICAgKiBCZXN0IFByYWN0aWNlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6juacgOS9s+Wunui3teeahO+8jOW4ruWKqeS9oOmBv+WFjeS4gOS6m+mXrumimO+8mlxuICAgICAqL1xuICAgICdhY2Nlc3Nvci1wYWlycyc6IEVSUk9SLCAvLyDlvLrliLYgZ2V0dGVyIOWSjCBzZXR0ZXIg5Zyo5a+56LGh5Lit5oiQ5a+55Ye6546wXG4gICAgJ2FycmF5LWNhbGxiYWNrLXJldHVybic6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueazleeahOWbnuiwg+WHveaVsOS4reaciSByZXR1cm4g6K+t5Y+lXG4gICAgJ2Jsb2NrLXNjb3BlZC12YXInOiBFUlJPUiwgLy8g5by65Yi25oqK5Y+Y6YeP55qE5L2/55So6ZmQ5Yi25Zyo5YW25a6a5LmJ55qE5L2c55So5Z+f6IyD5Zu05YaFXG4gICAgJ2N1cmx5JzogV0FSTiwgLy8g5by65Yi25omA5pyJ5o6n5Yi26K+t5Y+l5L2/55So5LiA6Ie055qE5ous5Y+36aOO5qC8XG4gICAgJ25vLWZhbGx0aHJvdWdoJzogV0FSTiwgLy8g56aB5q2iIGNhc2Ug6K+t5Y+l6JC956m6XG4gICAgJ25vLWZsb2F0aW5nLWRlY2ltYWwnOiBFUlJPUiwgLy8g56aB5q2i5pWw5a2X5a2X6Z2i6YeP5Lit5L2/55So5YmN5a+85ZKM5pyr5bC+5bCP5pWw54K5XG4gICAgJ25vLW11bHRpLXNwYWNlcyc6IFdBUk4sIC8vIOemgeatouS9v+eUqOWkmuS4quepuuagvFxuICAgICduby1uZXctd3JhcHBlcnMnOiBFUlJPUiwgLy8g56aB5q2i5a+5IFN0cmluZ++8jE51bWJlciDlkowgQm9vbGVhbiDkvb/nlKggbmV3IOaTjeS9nOesplxuICAgICduby1wcm90byc6IEVSUk9SLCAvLyDnpoHnlKggX19wcm90b19fIOWxnuaAp1xuICAgICduby1yZXR1cm4tYXNzaWduJzogV0FSTiwgLy8g56aB5q2i5ZyoIHJldHVybiDor63lj6XkuK3kvb/nlKjotYvlgLzor63lj6VcbiAgICAnbm8tdXNlbGVzcy1lc2NhcGUnOiBXQVJOLCAvLyDnpoHnlKjkuI3lv4XopoHnmoTovazkuYnlrZfnrKZcblxuICAgIC8qKlxuICAgICAqIFZhcmlhYmxlc1xuICAgICAqIOi/meS6m+inhOWImeS4juWPmOmHj+WjsOaYjuacieWFs++8mlxuICAgICAqL1xuICAgICduby11bmRlZi1pbml0JzogV0FSTiwgLy8g56aB5q2i5bCG5Y+Y6YeP5Yid5aeL5YyW5Li6IHVuZGVmaW5lZFxuICAgICduby11bnVzZWQtdmFycyc6IE9GRiwgLy8g56aB5q2i5Ye6546w5pyq5L2/55So6L+H55qE5Y+Y6YePXG4gICAgJ25vLXVzZS1iZWZvcmUtZGVmaW5lJzogW0VSUk9SLCB7ICdmdW5jdGlvbnMnOiBmYWxzZSwgJ2NsYXNzZXMnOiBmYWxzZSwgJ3ZhcmlhYmxlcyc6IGZhbHNlIH1dLCAvLyDnpoHmraLlnKjlj5jph4/lrprkuYnkuYvliY3kvb/nlKjlroPku6xcblxuICAgIC8qKlxuICAgICAqIFN0eWxpc3RpYyBJc3N1ZXNcbiAgICAgKiDov5nkupvop4TliJnmmK/lhbPkuo7po47moLzmjIfljZfnmoTvvIzogIzkuJTmmK/pnZ7luLjkuLvop4LnmoTvvJpcbiAgICAgKi9cbiAgICAnYXJyYXktYnJhY2tldC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25pWw57uE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Jsb2NrLXNwYWNpbmcnOiBXQVJOLCAvLyDnpoHmraLmiJblvLrliLblnKjku6PnoIHlnZfkuK3lvIDmi6zlj7fliY3lkozpl63mi6zlj7flkI7mnInnqbrmoLxcbiAgICAnYnJhY2Utc3R5bGUnOiBbV0FSTiwgJzF0YnMnLCB7ICdhbGxvd1NpbmdsZUxpbmUnOiB0cnVlIH1dLCAvLyDlvLrliLblnKjku6PnoIHlnZfkuK3kvb/nlKjkuIDoh7TnmoTlpKfmi6zlj7fpo47moLxcbiAgICAnY29tbWEtZGFuZ2xlJzogW1dBUk4sICdhbHdheXMtbXVsdGlsaW5lJ10sIC8vIOimgeaxguaIluemgeatouacq+WwvumAl+WPt1xuICAgICdjb21tYS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6YCX5Y+35YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2NvbW1hLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25L2/55So5LiA6Ie055qE6YCX5Y+36aOO5qC8XG4gICAgJ2NvbXB1dGVkLXByb3BlcnR5LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjorqHnrpfnmoTlsZ7mgKfnmoTmlrnmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnZnVuYy1jYWxsLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjlh73mlbDmoIfor4bnrKblkozlhbbosIPnlKjkuYvpl7TmnInnqbrmoLxcbiAgICAnZnVuY3Rpb24tcGFyZW4tbmV3bGluZSc6IFdBUk4sIC8vIOW8uuWItuWcqOWHveaVsOaLrOWPt+WGheS9v+eUqOS4gOiHtOeahOaNouihjFxuICAgICdpbXBsaWNpdC1hcnJvdy1saW5lYnJlYWsnOiBXQVJOLCAvLyDlvLrliLbpmpDlvI/ov5Tlm57nmoTnrq3lpLTlh73mlbDkvZPnmoTkvY3nva5cbiAgICAnaW5kZW50JzogW1dBUk4sIDIsIHsgJ1N3aXRjaENhc2UnOiAxIH1dLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTnvKnov5tcbiAgICAnanN4LXF1b3Rlcyc6IFdBUk4sIC8vIOW8uuWItuWcqCBKU1gg5bGe5oCn5Lit5LiA6Ie05Zyw5L2/55So5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ2tleS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo5a+56LGh5a2X6Z2i6YeP55qE5bGe5oCn5Lit6ZSu5ZKM5YC85LmL6Ze05L2/55So5LiA6Ie055qE6Ze06LedXG4gICAgJ2tleXdvcmQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWFs+mUruWtl+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICduZXctcGFyZW5zJzogV0FSTiwgLy8g5by65Yi25oiW56aB5q2i6LCD55So5peg5Y+C5p6E6YCg5Ye95pWw5pe25pyJ5ZyG5ous5Y+3XG4gICAgJ25vLW1peGVkLXNwYWNlcy1hbmQtdGFicyc6IFdBUk4sXG4gICAgJ25vLW11bHRpcGxlLWVtcHR5LWxpbmVzJzogW1dBUk4sIHsgJ21heCc6IDEsICdtYXhFT0YnOiAwLCAnbWF4Qk9GJzogMCB9XSwgLy8g56aB5q2i5Ye6546w5aSa6KGM56m66KGMXG4gICAgJ25vLXRyYWlsaW5nLXNwYWNlcyc6IFdBUk4sIC8vIOemgeeUqOihjOWwvuepuuagvFxuICAgICduby13aGl0ZXNwYWNlLWJlZm9yZS1wcm9wZXJ0eSc6IFdBUk4sIC8vIOemgeatouWxnuaAp+WJjeacieepuueZvVxuICAgICdub25ibG9jay1zdGF0ZW1lbnQtYm9keS1wb3NpdGlvbic6IFdBUk4sIC8vIOW8uuWItuWNleS4quivreWPpeeahOS9jee9rlxuICAgICdvYmplY3QtY3VybHktbmV3bGluZSc6IFtXQVJOLCB7ICdtdWx0aWxpbmUnOiB0cnVlLCAnY29uc2lzdGVudCc6IHRydWUgfV0sIC8vIOW8uuWItuWkp+aLrOWPt+WGheaNouihjOespueahOS4gOiHtOaAp1xuICAgICdvYmplY3QtY3VybHktc3BhY2luZyc6IFtXQVJOLCAnYWx3YXlzJ10sIC8vIOW8uuWItuWcqOWkp+aLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdwYWRkZWQtYmxvY2tzJzogW1dBUk4sICduZXZlciddLCAvLyDopoHmsYLmiJbnpoHmraLlnZflhoXloavlhYVcbiAgICAncXVvdGVzJzogW1dBUk4sICdzaW5nbGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUsICdhbGxvd1RlbXBsYXRlTGl0ZXJhbHMnOiB0cnVlIH1dLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTlj43li77lj7fjgIHlj4zlvJXlj7fmiJbljZXlvJXlj7dcbiAgICAnc2VtaSc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouS9v+eUqOWIhuWPt+S7o+abvyBBU0lcbiAgICAnc2VtaS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25YiG5Y+35LmL5YmN5ZKM5LmL5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NlbWktc3R5bGUnOiBXQVJOLCAvLyDlvLrliLbliIblj7fnmoTkvY3nva5cbiAgICAnc3BhY2UtYmVmb3JlLWJsb2Nrcyc6IFdBUk4sIC8vIOW8uuWItuWcqOWdl+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1iZWZvcmUtZnVuY3Rpb24tcGFyZW4nOiBbV0FSTiwgeyAnYW5vbnltb3VzJzogJ25ldmVyJywgJ25hbWVkJzogJ25ldmVyJywgJ2FzeW5jQXJyb3cnOiAnYWx3YXlzJyB9XSwgLy8g5by65Yi25ZyoIGZ1bmN0aW9u55qE5bem5ous5Y+35LmL5YmN5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWluLXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuWcqOWchuaLrOWPt+WGheS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbmZpeC1vcHMnOiBXQVJOLCAvLyDopoHmsYLmk43kvZznrKblkajlm7TmnInnqbrmoLxcbiAgICAnc3BhY2UtdW5hcnktb3BzJzogV0FSTiwgLy8g5by65Yi25Zyo5LiA5YWD5pON5L2c56ym5YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlZC1jb21tZW50JzogV0FSTiwgLy8g5by65Yi25Zyo5rOo6YeK5LitIC8vIOaIliAvKiDkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3dpdGNoLWNvbG9uLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKggc3dpdGNoIOeahOWGkuWPt+W3puWPs+acieepuuagvFxuICAgICd0ZW1wbGF0ZS10YWctc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouWcqOaooeadv+agh+iusOWSjOWug+S7rOeahOWtl+mdoumHj+S5i+mXtOeahOepuuagvFxuXG4gICAgLyoqXG4gICAgICogRUNNQVNjcmlwdCA2XG4gICAgICog6L+Z5Lqb6KeE5YiZ5Y+q5LiOIEVTNiDmnInlhbMsIOWNs+mAmuW4uOaJgOivtOeahCBFUzIwMTXvvJpcbiAgICAgKi9cbiAgICAnYXJyb3ctc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItueureWktOWHveaVsOeahOeureWktOWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdnZW5lcmF0b3Itc3Rhci1zcGFjaW5nJzogW1dBUk4sIHsgJ2JlZm9yZSc6IGZhbHNlLCAnYWZ0ZXInOiB0cnVlLCAnbWV0aG9kJzogeyAnYmVmb3JlJzogdHJ1ZSwgJ2FmdGVyJzogZmFsc2UgfSB9XSwgLy8g5by65Yi2IGdlbmVyYXRvciDlh73mlbDkuK0gKiDlj7flkajlm7Tkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbm8tdXNlbGVzcy1yZW5hbWUnOiBXQVJOLCAvLyDnpoHmraLlnKggaW1wb3J0IOWSjCBleHBvcnQg5ZKM6Kej5p6E6LWL5YC85pe25bCG5byV55So6YeN5ZG95ZCN5Li655u45ZCM55qE5ZCN5a2XXG4gICAgJ3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sIC8vIOimgeaxguS9v+eUqOaooeadv+Wtl+mdoumHj+iAjOmdnuWtl+espuS4sui/nuaOpVxuICAgICdyZXN0LXNwcmVhZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Ymp5L2Z5ZKM5omp5bGV6L+Q566X56ym5Y+K5YW26KGo6L6+5byP5LmL6Ze05pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLWN1cmx5LXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLmqKHmnb/lrZfnrKbkuLLkuK3nmoTltYzlhaXooajovr7lvI/lkajlm7TnqbrmoLznmoTkvb/nlKhcbiAgICAneWllbGQtc3Rhci1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHlpZWxkKiDooajovr7lvI/kuK0gKiDlkajlm7Tkvb/nlKjnqbrmoLxcbiAgfSxcbiAgLy8g6KaG55uWXG4gIG92ZXJyaWRlczogW10sXG59O1xuLy8gdnVlMi92dWUzIOWFseeUqFxuZXhwb3J0IGNvbnN0IHZ1ZUNvbW1vbkNvbmZpZyA9IHtcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL211bHRpLXdvcmQtY29tcG9uZW50LW5hbWVzJzogT0ZGLCAvLyDopoHmsYLnu4Tku7blkI3np7Dlp4vnu4jkuLrlpJrlrZdcbiAgICAndnVlL25vLXVudXNlZC1jb21wb25lbnRzJzogV0FSTiwgLy8g5pyq5L2/55So55qE57uE5Lu2XG4gICAgJ3Z1ZS9uby11bnVzZWQtdmFycyc6IE9GRiwgLy8g5pyq5L2/55So55qE5Y+Y6YePXG4gICAgJ3Z1ZS9yZXF1aXJlLXJlbmRlci1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmuLLmn5Plh73mlbDmgLvmmK/ov5Tlm57lgLxcbiAgICAndnVlL3JlcXVpcmUtdi1mb3Ita2V5JzogT0ZGLCAvLyB2LWZvcuS4reW/hemhu+S9v+eUqGtleVxuICAgICd2dWUvcmV0dXJuLWluLWNvbXB1dGVkLXByb3BlcnR5JzogV0FSTiwgLy8g5by65Yi26L+U5Zue6K+t5Y+l5a2Y5Zyo5LqO6K6h566X5bGe5oCn5LitXG4gICAgJ3Z1ZS92YWxpZC10ZW1wbGF0ZS1yb290JzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoTmqKHmnb/moLlcbiAgICAndnVlL3ZhbGlkLXYtZm9yJzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoR2LWZvcuaMh+S7pFxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9hdHRyaWJ1dGUtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOW8uuWItuWxnuaAp+WQjeagvOW8j1xuICAgICd2dWUvY29tcG9uZW50LWRlZmluaXRpb24tbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOW8uuWItue7hOS7tm5hbWXmoLzlvI9cbiAgICAndnVlL2h0bWwtcXVvdGVzJzogW1dBUk4sICdkb3VibGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUgfV0sIC8vIOW8uuWItiBIVE1MIOWxnuaAp+eahOW8leWPt+agt+W8j1xuICAgICd2dWUvaHRtbC1zZWxmLWNsb3NpbmcnOiBPRkYsIC8vIOS9v+eUqOiHqumXreWQiOagh+etvlxuICAgICd2dWUvbWF4LWF0dHJpYnV0ZXMtcGVyLWxpbmUnOiBbV0FSTiwgeyAnc2luZ2xlbGluZSc6IEluZmluaXR5LCAnbXVsdGlsaW5lJzogMSB9XSwgLy8g5by65Yi25q+P6KGM5YyF5ZCr55qE5pyA5aSn5bGe5oCn5pWwXG4gICAgJ3Z1ZS9tdWx0aWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5aSa6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS9wcm9wLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDkuLogVnVlIOe7hOS7tuS4reeahCBQcm9wIOWQjeensOW8uuWItuaJp+ihjOeJueWumuWkp+Wwj+WGmVxuICAgICd2dWUvcmVxdWlyZS1kZWZhdWx0LXByb3AnOiBPRkYsIC8vIHByb3Bz6ZyA6KaB6buY6K6k5YC8XG4gICAgJ3Z1ZS9zaW5nbGVsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWNleihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvdi1iaW5kLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LWJpbmTmjIfku6Tpo47moLxcbiAgICAndnVlL3Ytb24tc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtb27mjIfku6Tpo47moLxcbiAgICAndnVlL3Ytc2xvdC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1zbG905oyH5Luk6aOO5qC8XG4gICAgLy8gUHJpb3JpdHkgQzogUmVjb21tZW5kZWRcbiAgICAndnVlL25vLXYtaHRtbCc6IE9GRiwgLy8g56aB5q2i5L2/55Sodi1odG1sXG4gICAgLy8gVW5jYXRlZ29yaXplZFxuICAgICd2dWUvYmxvY2stdGFnLW5ld2xpbmUnOiBXQVJOLCAvLyAg5Zyo5omT5byA5Z2X57qn5qCH6K6w5LmL5ZCO5ZKM5YWz6Zet5Z2X57qn5qCH6K6w5LmL5YmN5by65Yi25o2i6KGMXG4gICAgJ3Z1ZS9odG1sLWNvbW1lbnQtY29udGVudC1zcGFjaW5nJzogV0FSTiwgLy8g5ZyoSFRNTOazqOmHiuS4reW8uuWItue7n+S4gOeahOepuuagvFxuICAgICd2dWUvc2NyaXB0LWluZGVudCc6IFtXQVJOLCAyLCB7ICdiYXNlSW5kZW50JzogMSwgJ3N3aXRjaENhc2UnOiAxIH1dLCAvLyDlnKg8c2NyaXB0PuS4reW8uuWItuS4gOiHtOeahOe8qei/m1xuICAgIC8vIEV4dGVuc2lvbiBSdWxlc+OAguWvueW6lGVzbGludOeahOWQjOWQjeinhOWIme+8jOmAgueUqOS6jjx0ZW1wbGF0ZT7kuK3nmoTooajovr7lvI9cbiAgICAndnVlL2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9ibG9jay1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSxcbiAgICAndnVlL2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLFxuICAgICd2dWUvY29tbWEtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9jb21tYS1zdHlsZSc6IFdBUk4sXG4gICAgJ3Z1ZS9mdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXktc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXl3b3JkLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLFxuICAgICd2dWUvc3BhY2UtaW4tcGFyZW5zJzogV0FSTixcbiAgICAndnVlL3NwYWNlLWluZml4LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS11bmFyeS1vcHMnOiBXQVJOLFxuICAgICd2dWUvYXJyb3ctc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9wcmVmZXItdGVtcGxhdGUnOiBXQVJOLFxuICB9LFxuICBvdmVycmlkZXM6IFtcbiAgICB7XG4gICAgICAnZmlsZXMnOiBbJyoudnVlJ10sXG4gICAgICAncnVsZXMnOiB7XG4gICAgICAgICdpbmRlbnQnOiBPRkYsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuLy8gdnVlMueUqFxuZXhwb3J0IGNvbnN0IHZ1ZTJDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUyIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3JlY29tbWVuZGVkJyxcbiAgXSxcbn0pO1xuLy8gdnVlM+eUqFxuZXhwb3J0IGNvbnN0IHZ1ZTNDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZW52OiB7XG4gICAgJ3Z1ZS9zZXR1cC1jb21waWxlci1tYWNyb3MnOiB0cnVlLCAvLyDlpITnkIZzZXR1cOaooeadv+S4reWDjyBkZWZpbmVQcm9wcyDlkowgZGVmaW5lRW1pdHMg6L+Z5qC355qE57yW6K+R5Zmo5a6P5oqlIG5vLXVuZGVmIOeahOmXrumimO+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy91c2VyLWd1aWRlLyNjb21waWxlci1tYWNyb3Mtc3VjaC1hcy1kZWZpbmVwcm9wcy1hbmQtZGVmaW5lZW1pdHMtZ2VuZXJhdGUtbm8tdW5kZWYtd2FybmluZ3NcbiAgfSxcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUzIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3Z1ZTMtcmVjb21tZW5kZWQnLFxuICBdLFxuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbm8tdGVtcGxhdGUta2V5JzogT0ZGLCAvLyDnpoHmraI8dGVtcGxhdGU+5Lit5L2/55Soa2V55bGe5oCnXG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXR1cm4taW4tZW1pdHMtdmFsaWRhdG9yJzogV0FSTiwgLy8g5by65Yi25ZyoZW1pdHPpqozor4HlmajkuK3lrZjlnKjov5Tlm57or63lj6VcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmVxdWlyZS1leHBsaWNpdC1lbWl0cyc6IE9GRiwgLy8g6ZyA6KaBZW1pdHPkuK3lrprkuYnpgInpobnnlKjkuo4kZW1pdCgpXG4gICAgJ3Z1ZS92LW9uLWV2ZW50LWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlnKjmqKHmnb/kuK3nmoToh6rlrprkuYnnu4Tku7bkuIrlvLrliLbmiafooYwgdi1vbiDkuovku7blkb3lkI3moLflvI9cbiAgfSxcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKC4uLm9iamVjdHMpIHtcbiAgY29uc3QgW3RhcmdldCwgLi4uc291cmNlc10gPSBvYmplY3RzO1xuICBjb25zdCByZXN1bHQgPSBEYXRhLmRlZXBDbG9uZSh0YXJnZXQpO1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc291cmNlKSkge1xuICAgICAgLy8g54m55q6K5a2X5q615aSE55CGXG4gICAgICBpZiAoa2V5ID09PSAncnVsZXMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsga2V5LCB2YWx1ZSwgJ3Jlc3VsdFtrZXldJzogcmVzdWx0W2tleV0gfSk7XG4gICAgICAgIC8vIOWIneWni+S4jeWtmOWcqOaXtui1i+m7mOiupOWAvOeUqOS6juWQiOW5tlxuICAgICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9O1xuICAgICAgICAvLyDlr7nlkITmnaHop4TliJnlpITnkIZcbiAgICAgICAgZm9yIChsZXQgW3J1bGVLZXksIHJ1bGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG4gICAgICAgICAgLy8g5bey5pyJ5YC857uf5LiA5oiQ5pWw57uE5aSE55CGXG4gICAgICAgICAgbGV0IHNvdXJjZVJ1bGVWYWx1ZSA9IHJlc3VsdFtrZXldW3J1bGVLZXldID8/IFtdO1xuICAgICAgICAgIGlmICghKHNvdXJjZVJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlID0gW3NvdXJjZVJ1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOimgeWQiOW5tueahOWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGlmICghKHJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgcnVsZVZhbHVlID0gW3J1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOe7n+S4gOagvOW8j+WQjui/m+ihjOaVsOe7hOW+queOr+aTjeS9nFxuICAgICAgICAgIGZvciAoY29uc3QgW3ZhbEluZGV4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHJ1bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIOWvueixoea3seWQiOW5tu+8jOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbCkgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gX09iamVjdC5kZWVwQXNzaWduKHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPz8ge30sIHZhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDotYvlgLzop4TliJnnu5PmnpxcbiAgICAgICAgICByZXN1bHRba2V5XVtydWxlS2V5XSA9IHNvdXJjZVJ1bGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWtl+auteagueaNruexu+Wei+WIpOaWreWkhOeQhlxuICAgICAgLy8g5pWw57uE77ya5ou85o6lXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAocmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyBbXSkucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5a+56LGh77ya5rex5ZCI5bm2XG4gICAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUodmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgX09iamVjdC5kZWVwQXNzaWduKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8ge30sIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIOS9v+eUqOWumuWItueahOmFjee9rlxuICogQHBhcmFtIHt977ya6YWN572u6aG5XG4gKiAgICAgICAgICBiYXNl77ya5L2/55So5Z+656GAZXNsaW505a6a5Yi277yM6buY6K6kIHRydWVcbiAqICAgICAgICAgIHZ1ZVZlcnNpb27vvJp2dWXniYjmnKzvvIzlvIDlkK/lkI7pnIDopoHlronoo4UgZXNsaW50LXBsdWdpbi12dWVcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZSh7IGJhc2UgPSB0cnVlLCB2dWVWZXJzaW9uIH0gPSB7fSkge1xuICBsZXQgcmVzdWx0ID0ge307XG4gIGlmIChiYXNlKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCBiYXNlQ29uZmlnKTtcbiAgfVxuICBpZiAodnVlVmVyc2lvbiA9PSAyKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUyQ29uZmlnKTtcbiAgfSBlbHNlIGlmICh2dWVWZXJzaW9uID09IDMpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTNDb25maWcpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICBiYXNlOiAnLi8nLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIC8vIOWIq+WQjVxuICAgIGFsaWFzOiB7XG4gICAgICAvLyAnQHJvb3QnOiByZXNvbHZlKF9fZGlybmFtZSksXG4gICAgICAvLyAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyDop4Tlrprop6blj5HorablkYrnmoQgY2h1bmsg5aSn5bCP44CC77yI5LulIGticyDkuLrljZXkvY3vvIlcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIgKiogMTAsXG4gICAgLy8g6Ieq5a6a5LmJ5bqV5bGC55qEIFJvbGx1cCDmiZPljIXphY3nva7jgIJcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8g5YWl5Y+j5paH5Lu25ZCNXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzL2VudHJ5LSR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOWdl+aWh+S7tuWQjVxuICAgICAgICBjaHVua0ZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDotYTmupDmlofku7blkI3vvIxjc3PjgIHlm77niYfnrYlcbiAgICAgICAgYXNzZXRGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLltleHRdYDtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iLCIvLyDor7fmsYLmlrnms5VcbmV4cG9ydCBjb25zdCBNRVRIT0RTID0gWydHRVQnLCAnSEVBRCcsICdQT1NUJywgJ1BVVCcsICdERUxFVEUnLCAnQ09OTkVDVCcsICdPUFRJT05TJywgJ1RSQUNFJywgJ1BBVENIJ107XG4vLyBodHRwIOeKtuaAgeeggVxuZXhwb3J0IGNvbnN0IFNUQVRVU0VTID0gW1xuICB7ICdzdGF0dXMnOiAxMDAsICdzdGF0dXNUZXh0JzogJ0NvbnRpbnVlJyB9LFxuICB7ICdzdGF0dXMnOiAxMDEsICdzdGF0dXNUZXh0JzogJ1N3aXRjaGluZyBQcm90b2NvbHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMiwgJ3N0YXR1c1RleHQnOiAnUHJvY2Vzc2luZycgfSxcbiAgeyAnc3RhdHVzJzogMTAzLCAnc3RhdHVzVGV4dCc6ICdFYXJseSBIaW50cycgfSxcbiAgeyAnc3RhdHVzJzogMjAwLCAnc3RhdHVzVGV4dCc6ICdPSycgfSxcbiAgeyAnc3RhdHVzJzogMjAxLCAnc3RhdHVzVGV4dCc6ICdDcmVhdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDIsICdzdGF0dXNUZXh0JzogJ0FjY2VwdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDMsICdzdGF0dXNUZXh0JzogJ05vbi1BdXRob3JpdGF0aXZlIEluZm9ybWF0aW9uJyB9LFxuICB7ICdzdGF0dXMnOiAyMDQsICdzdGF0dXNUZXh0JzogJ05vIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNSwgJ3N0YXR1c1RleHQnOiAnUmVzZXQgQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA2LCAnc3RhdHVzVGV4dCc6ICdQYXJ0aWFsIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNywgJ3N0YXR1c1RleHQnOiAnTXVsdGktU3RhdHVzJyB9LFxuICB7ICdzdGF0dXMnOiAyMDgsICdzdGF0dXNUZXh0JzogJ0FscmVhZHkgUmVwb3J0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIyNiwgJ3N0YXR1c1RleHQnOiAnSU0gVXNlZCcgfSxcbiAgeyAnc3RhdHVzJzogMzAwLCAnc3RhdHVzVGV4dCc6ICdNdWx0aXBsZSBDaG9pY2VzJyB9LFxuICB7ICdzdGF0dXMnOiAzMDEsICdzdGF0dXNUZXh0JzogJ01vdmVkIFBlcm1hbmVudGx5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDIsICdzdGF0dXNUZXh0JzogJ0ZvdW5kJyB9LFxuICB7ICdzdGF0dXMnOiAzMDMsICdzdGF0dXNUZXh0JzogJ1NlZSBPdGhlcicgfSxcbiAgeyAnc3RhdHVzJzogMzA0LCAnc3RhdHVzVGV4dCc6ICdOb3QgTW9kaWZpZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNSwgJ3N0YXR1c1RleHQnOiAnVXNlIFByb3h5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDcsICdzdGF0dXNUZXh0JzogJ1RlbXBvcmFyeSBSZWRpcmVjdCcgfSxcbiAgeyAnc3RhdHVzJzogMzA4LCAnc3RhdHVzVGV4dCc6ICdQZXJtYW5lbnQgUmVkaXJlY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMCwgJ3N0YXR1c1RleHQnOiAnQmFkIFJlcXVlc3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMSwgJ3N0YXR1c1RleHQnOiAnVW5hdXRob3JpemVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDIsICdzdGF0dXNUZXh0JzogJ1BheW1lbnQgUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMywgJ3N0YXR1c1RleHQnOiAnRm9yYmlkZGVuJyB9LFxuICB7ICdzdGF0dXMnOiA0MDQsICdzdGF0dXNUZXh0JzogJ05vdCBGb3VuZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA1LCAnc3RhdHVzVGV4dCc6ICdNZXRob2QgTm90IEFsbG93ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNiwgJ3N0YXR1c1RleHQnOiAnTm90IEFjY2VwdGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNywgJ3N0YXR1c1RleHQnOiAnUHJveHkgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwOCwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDksICdzdGF0dXNUZXh0JzogJ0NvbmZsaWN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MTAsICdzdGF0dXNUZXh0JzogJ0dvbmUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMSwgJ3N0YXR1c1RleHQnOiAnTGVuZ3RoIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTIsICdzdGF0dXNUZXh0JzogJ1ByZWNvbmRpdGlvbiBGYWlsZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMywgJ3N0YXR1c1RleHQnOiAnUGF5bG9hZCBUb28gTGFyZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNCwgJ3N0YXR1c1RleHQnOiAnVVJJIFRvbyBMb25nJyB9LFxuICB7ICdzdGF0dXMnOiA0MTUsICdzdGF0dXNUZXh0JzogJ1Vuc3VwcG9ydGVkIE1lZGlhIFR5cGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNiwgJ3N0YXR1c1RleHQnOiAnUmFuZ2UgTm90IFNhdGlzZmlhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTcsICdzdGF0dXNUZXh0JzogJ0V4cGVjdGF0aW9uIEZhaWxlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDE4LCAnc3RhdHVzVGV4dCc6ICdJXFwnbSBhIFRlYXBvdCcgfSxcbiAgeyAnc3RhdHVzJzogNDIxLCAnc3RhdHVzVGV4dCc6ICdNaXNkaXJlY3RlZCBSZXF1ZXN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MjIsICdzdGF0dXNUZXh0JzogJ1VucHJvY2Vzc2FibGUgRW50aXR5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjMsICdzdGF0dXNUZXh0JzogJ0xvY2tlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI0LCAnc3RhdHVzVGV4dCc6ICdGYWlsZWQgRGVwZW5kZW5jeScgfSxcbiAgeyAnc3RhdHVzJzogNDI1LCAnc3RhdHVzVGV4dCc6ICdUb28gRWFybHknIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNiwgJ3N0YXR1c1RleHQnOiAnVXBncmFkZSBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI4LCAnc3RhdHVzVGV4dCc6ICdQcmVjb25kaXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyOSwgJ3N0YXR1c1RleHQnOiAnVG9vIE1hbnkgUmVxdWVzdHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDQzMSwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBIZWFkZXIgRmllbGRzIFRvbyBMYXJnZScgfSxcbiAgeyAnc3RhdHVzJzogNDUxLCAnc3RhdHVzVGV4dCc6ICdVbmF2YWlsYWJsZSBGb3IgTGVnYWwgUmVhc29ucycgfSxcbiAgeyAnc3RhdHVzJzogNTAwLCAnc3RhdHVzVGV4dCc6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMSwgJ3N0YXR1c1RleHQnOiAnTm90IEltcGxlbWVudGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDIsICdzdGF0dXNUZXh0JzogJ0JhZCBHYXRld2F5JyB9LFxuICB7ICdzdGF0dXMnOiA1MDMsICdzdGF0dXNUZXh0JzogJ1NlcnZpY2UgVW5hdmFpbGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNCwgJ3N0YXR1c1RleHQnOiAnR2F0ZXdheSBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA1MDUsICdzdGF0dXNUZXh0JzogJ0hUVFAgVmVyc2lvbiBOb3QgU3VwcG9ydGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDYsICdzdGF0dXNUZXh0JzogJ1ZhcmlhbnQgQWxzbyBOZWdvdGlhdGVzJyB9LFxuICB7ICdzdGF0dXMnOiA1MDcsICdzdGF0dXNUZXh0JzogJ0luc3VmZmljaWVudCBTdG9yYWdlJyB9LFxuICB7ICdzdGF0dXMnOiA1MDgsICdzdGF0dXNUZXh0JzogJ0xvb3AgRGV0ZWN0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwOSwgJ3N0YXR1c1RleHQnOiAnQmFuZHdpZHRoIExpbWl0IEV4Y2VlZGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MTAsICdzdGF0dXNUZXh0JzogJ05vdCBFeHRlbmRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTExLCAnc3RhdHVzVGV4dCc6ICdOZXR3b3JrIEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyB9LFxuXTtcbiIsIi8vIOWJqui0tOadv1xuLyoqXG4gKiDlpI3liLbmlofmnKzml6flhpnms5XjgILlnKggY2xpcGJvYXJkIGFwaSDkuI3lj6/nlKjml7bku6Pmm79cbiAqIEBwYXJhbSB0ZXh0XG4gKiBAcmV0dXJucyB7UHJvbWlzZTxQcm9taXNlPHZvaWQ+fFByb21pc2U8bmV2ZXI+Pn1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gb2xkQ29weVRleHQodGV4dCkge1xuICAvLyDmlrDlu7rovpPlhaXmoYZcbiAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAvLyDotYvlgLxcbiAgdGV4dGFyZWEudmFsdWUgPSB0ZXh0O1xuICAvLyDmoLflvI/orr7nva5cbiAgT2JqZWN0LmFzc2lnbih0ZXh0YXJlYS5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgIHRvcDogMCxcbiAgICBjbGlwUGF0aDogJ2NpcmNsZSgwKScsXG4gIH0pO1xuICAvLyDliqDlhaXliLDpobXpnaJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGV4dGFyZWEpO1xuICAvLyDpgInkuK1cbiAgdGV4dGFyZWEuc2VsZWN0KCk7XG4gIC8vIOWkjeWItlxuICBjb25zdCBzdWNjZXNzID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgLy8g5LuO6aG16Z2i56e76ZmkXG4gIHRleHRhcmVhLnJlbW92ZSgpO1xuICByZXR1cm4gc3VjY2VzcyA/IFByb21pc2UucmVzb2x2ZSgpIDogUHJvbWlzZS5yZWplY3QoKTtcbn1cbmV4cG9ydCBjb25zdCBjbGlwYm9hcmQgPSB7XG4gIC8qKlxuICAgKiDlhpnlhaXmlofmnKwo5aSN5Yi2KVxuICAgKiBAcGFyYW0gdGV4dFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIGFzeW5jIHdyaXRlVGV4dCh0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gYXdhaXQgb2xkQ29weVRleHQodGV4dCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICog6K+75Y+W5paH5pysKOeymOi0tClcbiAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHJlYWRUZXh0KCkge1xuICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG4gIH0sXG59O1xuIiwiLyohIGpzLWNvb2tpZSB2My4wLjUgfCBNSVQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuZnVuY3Rpb24gYXNzaWduICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXRcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xudmFyIGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gIHJlYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXG4gICAgICAvJSgyWzM0NkJGXXwzW0FDLUZdfDQwfDVbQkRFXXw2MHw3W0JDRF0pL2csXG4gICAgICBkZWNvZGVVUklDb21wb25lbnRcbiAgICApXG4gIH1cbn07XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuZnVuY3Rpb24gaW5pdCAoY29udmVydGVyLCBkZWZhdWx0QXR0cmlidXRlcykge1xuICBmdW5jdGlvbiBzZXQgKG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGU1KTtcbiAgICB9XG4gICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKVxuICAgICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcblxuICAgIHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcbiAgICAgIC8vIC4uLlxuICAgICAgLy8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuICAgICAgLy8gICAgIGNoYXJhY3RlcjpcbiAgICAgIC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG4gICAgICAvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cbiAgICAgIC8vIC4uLlxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9XG4gICAgICBuYW1lICsgJz0nICsgY29udmVydGVyLndyaXRlKHZhbHVlLCBuYW1lKSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcylcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldCAobmFtZSkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IChhcmd1bWVudHMubGVuZ3RoICYmICFuYW1lKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuICAgIC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgdmFyIGphciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZm91bmQgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICBqYXJbZm91bmRdID0gY29udmVydGVyLnJlYWQodmFsdWUsIGZvdW5kKTtcblxuICAgICAgICBpZiAobmFtZSA9PT0gZm91bmQpIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHJldHVybiBuYW1lID8gamFyW25hbWVdIDogamFyXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICB7XG4gICAgICBzZXQsXG4gICAgICBnZXQsXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIChuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHNldChcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgICcnLFxuICAgICAgICAgIGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xuICAgICAgICAgICAgZXhwaXJlczogLTFcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIHdpdGhBdHRyaWJ1dGVzOiBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgICAgICByZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxuICAgICAgfSxcbiAgICAgIHdpdGhDb252ZXJ0ZXI6IGZ1bmN0aW9uIChjb252ZXJ0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgYXR0cmlidXRlczogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShkZWZhdWx0QXR0cmlidXRlcykgfSxcbiAgICAgIGNvbnZlcnRlcjogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShjb252ZXJ0ZXIpIH1cbiAgICB9XG4gIClcbn1cblxudmFyIGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG5leHBvcnQgeyBhcGkgYXMgZGVmYXVsdCB9O1xuIiwiLy8gY29va2ll5pON5L2cXG5pbXBvcnQganNDb29raWUgZnJvbSAnanMtY29va2llJztcbi8vIOeUqOWIsOeahOW6k+S5n+WvvOWHuuS+v+S6juiHquihjOmAieeUqFxuZXhwb3J0IHsganNDb29raWUgfTtcblxuLy8g5ZCMIGpzLWNvb2tpZSDnmoTpgInpobnlkIjlubbmlrnlvI9cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNvdXJjZSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cbi8vIGNvb2tpZeWvueixoVxuZXhwb3J0IGNsYXNzIENvb2tpZSB7XG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhuVxuICAgKiAgICAgICAgICBjb252ZXJ0ZXIgIOWQjCBqcy1jb29raWVzIOeahCBjb252ZXJ0ZXJcbiAgICogICAgICAgICAgYXR0cmlidXRlcyDlkIwganMtY29va2llcyDnmoQgYXR0cmlidXRlc1xuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaLjgIJqcy1jb29raWUg5ZyoMy4w54mI5pysKGNvbW1pdDogNGI3OTI5MGI5OGQ3ZmJmMWFiNDkzYTdmOWUxNjE5NDE4YWMwMWU0NSkg56e76Zmk5LqG5a+5IGpzb24g55qE6Ieq5Yqo6L2s5o2i77yM6L+Z6YeM6buY6K6kIHRydWUg5Yqg5LiKXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAvLyDpgInpobnnu5PmnpxcbiAgICBjb25zdCB7IGNvbnZlcnRlciA9IHt9LCBhdHRyaWJ1dGVzID0ge30sIGpzb24gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAganNvbixcbiAgICAgIGF0dHJpYnV0ZXM6IGFzc2lnbih7fSwganNDb29raWUuYXR0cmlidXRlcywgYXR0cmlidXRlcyksXG4gICAgICBjb252ZXJ0ZXI6IGFzc2lnbih7fSwganNDb29raWUuY29udmVydGVyLCBjb252ZXJ0ZXIpLFxuICAgIH07XG4gICAgLy8g5aOw5piO5ZCE5bGe5oCn44CC55u05o6l5oiW5ZyoY29uc3RydWN0b3LkuK3ph43mlrDotYvlgLxcbiAgICAvLyDpu5jorqTpgInpobnnu5PmnpxcbiAgICB0aGlzLiRkZWZhdWx0cyA9IG9wdGlvbnNSZXN1bHQ7XG4gIH1cbiAgJGRlZmF1bHRzO1xuICAvLyDlhpnlhaVcbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcGFyYW0gYXR0cmlidXRlc1xuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2iXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc2V0KG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuICAgIGlmIChqc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ganNDb29raWUuc2V0KG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzKTtcbiAgfVxuICAvLyDor7vlj5ZcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSBvcHRpb25zIOmFjee9rumhuVxuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaJcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXQobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBsZXQgcmVzdWx0ID0ganNDb29raWUuZ2V0KG5hbWUpO1xuICAgIGlmIChqc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDnp7vpmaRcbiAgcmVtb3ZlKG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4ganNDb29raWUucmVtb3ZlKG5hbWUsIGF0dHJpYnV0ZXMpO1xuICB9XG4gIC8vIOWIm+W7uuOAgumAmui/h+mFjee9rum7mOiupOWPguaVsOWIm+W7uuaWsOWvueixoe+8jOeugOWMluS8oOWPglxuICBjcmVhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9uc1Jlc3VsdCA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBhdHRyaWJ1dGVzOiBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlcyksXG4gICAgICBjb252ZXJ0ZXI6IGFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMuYXR0cmlidXRlcywgb3B0aW9ucy5jb252ZXJ0ZXIpLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBDb29raWUob3B0aW9uc1Jlc3VsdCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBjb29raWUgPSBuZXcgQ29va2llKCk7XG4iLCJmdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gZmlsZSBzaXplIGhhY2tzXG4gICAgICAgIHJlcXVlc3Qub25jb21wbGV0ZSA9IHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgLSBmaWxlIHNpemUgaGFja3NcbiAgICAgICAgcmVxdWVzdC5vbmFib3J0ID0gcmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlU3RvcmUoZGJOYW1lLCBzdG9yZU5hbWUpIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lKTtcbiAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHJlcXVlc3QucmVzdWx0LmNyZWF0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgY29uc3QgZGJwID0gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KTtcbiAgICByZXR1cm4gKHR4TW9kZSwgY2FsbGJhY2spID0+IGRicC50aGVuKChkYikgPT4gY2FsbGJhY2soZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCB0eE1vZGUpLm9iamVjdFN0b3JlKHN0b3JlTmFtZSkpKTtcbn1cbmxldCBkZWZhdWx0R2V0U3RvcmVGdW5jO1xuZnVuY3Rpb24gZGVmYXVsdEdldFN0b3JlKCkge1xuICAgIGlmICghZGVmYXVsdEdldFN0b3JlRnVuYykge1xuICAgICAgICBkZWZhdWx0R2V0U3RvcmVGdW5jID0gY3JlYXRlU3RvcmUoJ2tleXZhbC1zdG9yZScsICdrZXl2YWwnKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRHZXRTdG9yZUZ1bmM7XG59XG4vKipcbiAqIEdldCBhIHZhbHVlIGJ5IGl0cyBrZXkuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGdldChrZXksIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldChrZXkpKSk7XG59XG4vKipcbiAqIFNldCBhIHZhbHVlIHdpdGggYSBrZXkuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIHZhbHVlXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBzdG9yZS5wdXQodmFsdWUsIGtleSk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbi8qKlxuICogU2V0IG11bHRpcGxlIHZhbHVlcyBhdCBvbmNlLiBUaGlzIGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgc2V0KCkgbXVsdGlwbGUgdGltZXMuXG4gKiBJdCdzIGFsc28gYXRvbWljIOKAkyBpZiBvbmUgb2YgdGhlIHBhaXJzIGNhbid0IGJlIGFkZGVkLCBub25lIHdpbGwgYmUgYWRkZWQuXG4gKlxuICogQHBhcmFtIGVudHJpZXMgQXJyYXkgb2YgZW50cmllcywgd2hlcmUgZWFjaCBlbnRyeSBpcyBhbiBhcnJheSBvZiBgW2tleSwgdmFsdWVdYC5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBzZXRNYW55KGVudHJpZXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiBzdG9yZS5wdXQoZW50cnlbMV0sIGVudHJ5WzBdKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IG11bHRpcGxlIHZhbHVlcyBieSB0aGVpciBrZXlzXG4gKlxuICogQHBhcmFtIGtleXNcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBnZXRNYW55KGtleXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBQcm9taXNlLmFsbChrZXlzLm1hcCgoa2V5KSA9PiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldChrZXkpKSkpKTtcbn1cbi8qKlxuICogVXBkYXRlIGEgdmFsdWUuIFRoaXMgbGV0cyB5b3Ugc2VlIHRoZSBvbGQgdmFsdWUgYW5kIHVwZGF0ZSBpdCBhcyBhbiBhdG9taWMgb3BlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSB1cGRhdGVyIEEgY2FsbGJhY2sgdGhhdCB0YWtlcyB0aGUgb2xkIHZhbHVlIGFuZCByZXR1cm5zIGEgbmV3IHZhbHVlLlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZShrZXksIHVwZGF0ZXIsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4gXG4gICAgLy8gTmVlZCB0byBjcmVhdGUgdGhlIHByb21pc2UgbWFudWFsbHkuXG4gICAgLy8gSWYgSSB0cnkgdG8gY2hhaW4gcHJvbWlzZXMsIHRoZSB0cmFuc2FjdGlvbiBjbG9zZXMgaW4gYnJvd3NlcnNcbiAgICAvLyB0aGF0IHVzZSBhIHByb21pc2UgcG9seWZpbGwgKElFMTAvMTEpLlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgc3RvcmUuZ2V0KGtleSkub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzdG9yZS5wdXQodXBkYXRlcih0aGlzLnJlc3VsdCksIGtleSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSkpO1xufVxuLyoqXG4gKiBEZWxldGUgYSBwYXJ0aWN1bGFyIGtleSBmcm9tIHRoZSBzdG9yZS5cbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZGVsKGtleSwgY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZHdyaXRlJywgKHN0b3JlKSA9PiB7XG4gICAgICAgIHN0b3JlLmRlbGV0ZShrZXkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIERlbGV0ZSBtdWx0aXBsZSBrZXlzIGF0IG9uY2UuXG4gKlxuICogQHBhcmFtIGtleXMgTGlzdCBvZiBrZXlzIHRvIGRlbGV0ZS5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBkZWxNYW55KGtleXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4gc3RvcmUuZGVsZXRlKGtleSkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIENsZWFyIGFsbCB2YWx1ZXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBjbGVhcihjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgc3RvcmUuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZWFjaEN1cnNvcihzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBzdG9yZS5vcGVuQ3Vyc29yKCkub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVzdWx0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjYWxsYmFjayh0aGlzLnJlc3VsdCk7XG4gICAgICAgIHRoaXMucmVzdWx0LmNvbnRpbnVlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG59XG4vKipcbiAqIEdldCBhbGwga2V5cyBpbiB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGtleXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbEtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldEFsbEtleXMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGVhY2hDdXJzb3Ioc3RvcmUsIChjdXJzb3IpID0+IGl0ZW1zLnB1c2goY3Vyc29yLmtleSkpLnRoZW4oKCkgPT4gaXRlbXMpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBHZXQgYWxsIHZhbHVlcyBpbiB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHZhbHVlcyhjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4ge1xuICAgICAgICAvLyBGYXN0IHBhdGggZm9yIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpZiAoc3RvcmUuZ2V0QWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGwoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGVhY2hDdXJzb3Ioc3RvcmUsIChjdXJzb3IpID0+IGl0ZW1zLnB1c2goY3Vyc29yLnZhbHVlKSkudGhlbigoKSA9PiBpdGVtcyk7XG4gICAgfSk7XG59XG4vKipcbiAqIEdldCBhbGwgZW50cmllcyBpbiB0aGUgc3RvcmUuIEVhY2ggZW50cnkgaXMgYW4gYXJyYXkgb2YgYFtrZXksIHZhbHVlXWAuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGVudHJpZXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgLy8gKGFsdGhvdWdoLCBob3BlZnVsbHkgd2UnbGwgZ2V0IGEgc2ltcGxlciBwYXRoIHNvbWUgZGF5KVxuICAgICAgICBpZiAoc3RvcmUuZ2V0QWxsICYmIHN0b3JlLmdldEFsbEtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGxLZXlzKCkpLFxuICAgICAgICAgICAgICAgIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsKCkpLFxuICAgICAgICAgICAgXSkudGhlbigoW2tleXMsIHZhbHVlc10pID0+IGtleXMubWFwKChrZXksIGkpID0+IFtrZXksIHZhbHVlc1tpXV0pKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgICAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKFtjdXJzb3Iua2V5LCBjdXJzb3IudmFsdWVdKSkudGhlbigoKSA9PiBpdGVtcykpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgeyBjbGVhciwgY3JlYXRlU3RvcmUsIGRlbCwgZGVsTWFueSwgZW50cmllcywgZ2V0LCBnZXRNYW55LCBrZXlzLCBwcm9taXNpZnlSZXF1ZXN0LCBzZXQsIHNldE1hbnksIHVwZGF0ZSwgdmFsdWVzIH07XG4iLCJleHBvcnQgY2xhc3MgX1N0b3JhZ2Uge1xuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAgc3RvcmFnZSDlr7nlupTnmoRzdG9yYWdl5a+56LGh44CCbG9jYWxTdG9yYWdlIOaIliBzZXNzaW9uU3RvcmFnZVxuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaLjgIJcbiAgICogQHJldHVybnMge3ZvaWR8Kn1cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgZnJvbSwganNvbiA9IHRydWUgfSA9IG9wdGlvbnM7XG4gICAgY29uc3Qgb3B0aW9uc1Jlc3VsdCA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBmcm9tLFxuICAgICAganNvbixcbiAgICB9O1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgLy8g6buY6K6k6YCJ6aG557uT5p6cXG4gICAgICAkZGVmYXVsdHM6IG9wdGlvbnNSZXN1bHQsXG4gICAgICAvLyDlr7nlupTnmoRzdG9yYWdl5a+56LGh44CCXG4gICAgICBzdG9yYWdlOiBmcm9tLFxuICAgICAgLy8g5Y6f5pyJ5pa55rOV44CC55Sx5LqOIE9iamVjdC5jcmVhdGUoZnJvbSkg5pa55byP57un5om/5pe26LCD55So5Lya5oqlIFVuY2F1Z2h0IFR5cGVFcnJvcjogSWxsZWdhbCBpbnZvY2F0aW9u77yM5pS55oiQ5Y2V54us5Yqg5YWl5pa55byPXG4gICAgICBzZXRJdGVtOiBmcm9tLnNldEl0ZW0uYmluZChmcm9tKSxcbiAgICAgIGdldEl0ZW06IGZyb20uZ2V0SXRlbS5iaW5kKGZyb20pLFxuICAgICAgcmVtb3ZlSXRlbTogZnJvbS5yZW1vdmVJdGVtLmJpbmQoZnJvbSksXG4gICAgICBrZXk6IGZyb20ua2V5LmJpbmQoZnJvbSksXG4gICAgICBjbGVhcjogZnJvbS5jbGVhci5iaW5kKGZyb20pLFxuICAgIH0pO1xuICB9XG4gIC8vIOWjsOaYjuWQhOWxnuaAp+OAguebtOaOpeaIluWcqGNvbnN0cnVjdG9y5Lit6YeN5paw6LWL5YC8XG4gICRkZWZhdWx0cztcbiAgc3RvcmFnZTtcbiAgc2V0SXRlbTtcbiAgZ2V0SXRlbTtcbiAgcmVtb3ZlSXRlbTtcbiAga2V5O1xuICBjbGVhcjtcbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgfVxuICAvLyDliKTmlq3lsZ7mgKfmmK/lkKblrZjlnKjjgILlkIzml7bnlKjkuo7lnKggZ2V0IOS4reWvueS4jeWtmOWcqOeahOWxnuaAp+i/lOWbniB1bmRlZmluZWRcbiAgaGFzKGtleSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0b3JhZ2UpLmluY2x1ZGVzKGtleSk7XG4gIH1cbiAgLy8g5YaZ5YWlXG4gIHNldChrZXksIHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIGlmIChqc29uKSB7XG4gICAgICAvLyDlpITnkIblrZggdW5kZWZpbmVkIOeahOaDheWGte+8jOazqOaEj+WvueixoeS4reeahOaYvuW8jyB1bmRlZmluZWQg55qE5bGe5oCn5Lya6KKrIGpzb24g5bqP5YiX5YyW56e76ZmkXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gIH1cbiAgLy8g6K+75Y+WXG4gIGdldChrZXksIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGpzb24gPSAnanNvbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuanNvbiA6IHRoaXMuJGRlZmF1bHRzLmpzb247XG4gICAgLy8g5aSE55CG5peg5bGe5oCn55qE55qE5oOF5Ya16L+U5ZueIHVuZGVmaW5lZFxuICAgIGlmIChqc29uICYmICF0aGlzLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyDlhbbku5blgLzliKTmlq3ov5Tlm55cbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g56e76ZmkXG4gIHJlbW92ZShrZXkpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgfVxuICAvLyDliJvlu7rjgILpgJrov4fphY3nva7pu5jorqTlj4LmlbDliJvlu7rmlrDlr7nosaHvvIznroDljJbkvKDlj4JcbiAgY3JlYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG5ldyBfU3RvcmFnZShvcHRpb25zUmVzdWx0KTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IF9sb2NhbFN0b3JhZ2UgPSBuZXcgX1N0b3JhZ2UoeyBmcm9tOiBsb2NhbFN0b3JhZ2UgfSk7XG5leHBvcnQgY29uc3QgX3Nlc3Npb25TdG9yYWdlID0gbmV3IF9TdG9yYWdlKHsgZnJvbTogc2Vzc2lvblN0b3JhZ2UgfSk7XG4iXSwibmFtZXMiOlsiYmFzZUNvbmZpZyIsImFzc2lnbiIsImpzQ29va2llIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFFQTtBQUNPLE1BQU0sSUFBSSxTQUFTLEdBQUcsQ0FBQztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRTtBQUMvQjtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hEO0FBQ0EsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxLQUFLO0FBQ25DLE1BQU0sT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxD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USxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakQsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsSUFBSSxFQUFFLEVBQUUsTUFBTSxHQUFHLE1BQU0sS0FBSyxFQUFFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ3JGO0FBQ0EsRUFBRSxNQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUNyQztBQUNBLEVBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDcEIsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO0FBQzdCLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzFELEdBQUc7QUFDSCxFQUFFLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxNQUFNLEVBQUU7QUFDMUMsSUFBSSxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSztBQUN2RSxNQUFNLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENB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QUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFO0FBQy9DLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDL0UsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFO0FBQy9DLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzNELEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUU7QUFDMUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUM3QixJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUMzQixNQUFNLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzdCLEtBQUs7QUFDTCxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ2pELE1BQU0sT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDN0IsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsUUFBUSxHQUFHO0FBQ2IsSUFBSSxPQUFPLEdBQUcs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
