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

export { Data, Style, Support, VueData, _Array, _Date, _Math, _Number, _Object, _Reflect, _Set, _String };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvX1NldC5qcyIsIi4uLy4uL3NyYy9iYXNlL19BcnJheS5qcyIsIi4uLy4uL3NyYy9iYXNlL19EYXRlLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX01hdGguanMiLCIuLi8uLi9zcmMvYmFzZS9fTnVtYmVyLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1JlZmxlY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9EYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3VwcG9ydC5qcyIsIi4uLy4uL3NyYy9iYXNlL19PYmplY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9fU3RyaW5nLmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3R5bGUuanMiLCIuLi8uLi9zcmMvYmFzZS9WdWVEYXRhLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIOmbhuWQiFxuaW1wb3J0IHsgX0FycmF5IH0gZnJvbSAnLi9fQXJyYXknO1xuXG5leHBvcnQgY2xhc3MgX1NldCBleHRlbmRzIFNldCB7XG4gIC8qKlxuICAgKiBb5paw5aKeXSDkuqTpm4ZcbiAgICogQHBhcmFtIHNldHNcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBzdGF0aWMgaW50ZXJzZWN0aW9uKC4uLnNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAoc2V0cy5sZW5ndGggPCAyKSB7XG4gICAgICBzZXRzWzBdID0gc2V0c1swXSB8fCBbXTtcbiAgICAgIHNldHNbMV0gPSBzZXRzWzFdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBzZXRzID0gbmV3IF9BcnJheShzZXRzKS5tYXAoc2V0ID0+IG5ldyBfQXJyYXkoc2V0KSk7XG5cbiAgICBjb25zdCBbZmlyc3QsIC4uLm90aGVyc10gPSBzZXRzO1xuICAgIHJldHVybiBmaXJzdC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gb3RoZXJzLmV2ZXJ5KHNldCA9PiBzZXQuaW5jbHVkZXModmFsdWUpKTtcbiAgICB9KS50b19TZXQoKTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g5bm26ZuGXG4gICAqIEBwYXJhbSBzZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIHVuaW9uKC4uLnNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAoc2V0cy5sZW5ndGggPCAyKSB7XG4gICAgICBzZXRzWzBdID0gc2V0c1swXSB8fCBbXTtcbiAgICAgIHNldHNbMV0gPSBzZXRzWzFdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBzZXRzID0gbmV3IF9BcnJheShzZXRzKS5tYXAoc2V0ID0+IG5ldyBfQXJyYXkoc2V0KSk7XG5cbiAgICByZXR1cm4gc2V0cy5mbGF0KCkudG9fU2V0KCk7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOihpembhlxuICAgKiBAcGFyYW0gbWFpblNldFxuICAgKiBAcGFyYW0gb3RoZXJTZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIGNvbXBsZW1lbnQobWFpblNldCA9IFtdLCAuLi5vdGhlclNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAob3RoZXJTZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIG90aGVyU2V0c1swXSA9IG90aGVyU2V0c1swXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgbWFpblNldCA9IG5ldyBfQXJyYXkobWFpblNldCk7XG4gICAgb3RoZXJTZXRzID0gbmV3IF9BcnJheShvdGhlclNldHMpLm1hcChhcmcgPT4gbmV3IF9BcnJheShhcmcpKTtcbiAgICByZXR1cm4gbWFpblNldC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gb3RoZXJTZXRzLmV2ZXJ5KHNldCA9PiAhc2V0LmluY2x1ZGVzKHZhbHVlKSk7XG4gICAgfSkudG9fU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcbiAgICAvLyBjb25zb2xlLmxvZygnX1NldCBjb25zdHJ1Y3RvcicsIHZhbHVlKTtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBuZXcgU2V0KHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+S8oOWPguaKpemUme+8jOWwhueUn+aIkOepuumbhuWQiCcsIGUpO1xuICAgICAgdmFsdWUgPSBuZXcgU2V0KFtdKTtcbiAgICB9XG4gICAgc3VwZXIodmFsdWUpO1xuXG4gICAgLy8gc2l6ZSBb57un5om/XVxuICB9XG5cbiAgLy8g5pa55rOV5a6a5Yi277ya5Y6f5Z6L5ZCM5ZCN5pa55rOVK+aWsOWinuaWueazleOAgumDqOWIhuWumuWItuaIkOi/lOWbniB0aGlzIOS+v+S6jumTvuW8j+aTjeS9nFxuICAvKipcbiAgICog5L+u5pS5XG4gICAqL1xuICAvLyBb5a6a5Yi2XVxuICBhZGQoLi4udmFsdWVzKSB7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIFNldC5wcm90b3R5cGUuYWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIGRlbGV0ZSguLi52YWx1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgU2V0LnByb3RvdHlwZS5kZWxldGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgY2xlYXIoKSB7XG4gICAgU2V0LnByb3RvdHlwZS5jbGVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOmBjeWOhlxuICAgKi9cbiAgLy8gU3ltYm9sLml0ZXJhdG9yIFvnu6fmib9dXG4gIC8vIGtleXMgW+e7p+aJv11cbiAgLy8gdmFsdWVzIFvnu6fmib9dXG4gIC8vIGVudHJpZXMgW+e7p+aJv11cbiAgLy8gW+WumuWItl1cbiAgZm9yRWFjaCgpIHtcbiAgICBTZXQucHJvdG90eXBlLmZvckVhY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xmib5cbiAgICovXG4gIC8vIGhhcyBb57un5om/XVxuXG4gIC8qKlxuICAgKiDnlJ/miJBcbiAgICovXG4gIC8vIOebtOaOpemAmui/hyB0b19BcnJheSDlkowgdG9fU2V0IOi9rOaNouaTjeS9nOWNs+WPr++8jOaXoOmcgOmHjeWkjeWumuWItlxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vIFvmlrDlop5dXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9TdHJpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBgeyR7dGhpcy50b0FycmF5KCkuam9pbignLCcpfX1gO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiAne30nO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0Jvb2xlYW4ob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZSA+IDA7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvX0FycmF5KCkge1xuICAgIHJldHVybiBuZXcgX0FycmF5KHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvU2V0KCkge1xuICAgIHJldHVybiBuZXcgU2V0KHRoaXMpO1xuICB9XG59XG4iLCIvLyDmlbDnu4RcbmltcG9ydCB7IF9TZXQgfSBmcm9tICcuL19TZXQnO1xuXG5leHBvcnQgY2xhc3MgX0FycmF5IGV4dGVuZHMgQXJyYXkge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyBzdGF0aWMgaXNBcnJheSBb57un5om/XVxuICAvLyBzdGF0aWMgZnJvbSBb57un5om/XVxuICAvLyBzdGF0aWMgb2YgW+e7p+aJv11cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBBcnJheS5mcm9tKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+S8oOWPguaKpemUme+8jOWwhueUn+aIkOepuuaVsOe7hCcsIGUpO1xuICAgICAgdmFsdWUgPSBbXTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgdmFsdWVbMF0gPT09ICdudW1iZXInKSB7XG4gICAgICAvLyDnqIDnlo/mlbDnu4Tpl67popjvvIzlhYjosIMgc3VwZXIg55Sf5oiQIHRoaXMg5ZCO5YaN5L+u5pS5IHRoaXMg5YaF5a65XG4gICAgICBjb25zdCB0ZW1wID0gdmFsdWVbMF07XG4gICAgICB2YWx1ZVswXSA9IHVuZGVmaW5lZDtcbiAgICAgIHN1cGVyKC4uLnZhbHVlKTtcbiAgICAgIHRoaXNbMF0gPSB0ZW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlciguLi52YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gbGVuZ3RoIFvnu6fmib9dXG4gIH1cblxuICAvLyDmlrnms5XlrprliLbvvJrljp/lnovlkIzlkI3mlrnms5Ur5paw5aKe44CC6YOo5YiG5a6a5Yi25oiQ6L+U5ZueIHRoaXMg5L6/5LqO6ZO+5byP5pON5L2cXG4gIC8qKlxuICAgKiDkv67mlLlcbiAgICovXG4gIC8vIFvlrprliLZdXG4gIHB1c2goKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICBwb3AobGVuZ3RoID0gMSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wb3AuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdW5zaGlmdCgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHNoaWZ0KGxlbmd0aCA9IDEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgc3BsaWNlKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5paw5aKeXSDliKDpmaRcbiAgZGVsZXRlKHZhbHVlKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleCh2YWwgPT4gdmFsID09PSB2YWx1ZSk7XG4gICAgdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvmlrDlop5dIOa4heepulxuICBjbGVhcigpIHtcbiAgICB0aGlzLnNwbGljZSgwKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5paw5aKeXSDljrvph41cbiAgdW5pcXVlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy50b19TZXQoKS50b19BcnJheSgpO1xuICAgIHRoaXMuY2xlYXIoKS5wdXNoKC4uLnZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBzb3J0IFvnu6fmib9dXG4gIC8vIFvmlrDlop5dIOmaj+acuuaOkuW6j+aVsOe7hFxuICByYW5kb21Tb3J0KCkge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIFt0aGlzW2ldLCB0aGlzW2pdXSA9IFt0aGlzW2pdLCB0aGlzW2ldXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyByZXZlcnNlIFvnu6fmib9dXG4gIC8vIGZpbGwgW+e7p+aJv11cbiAgLy8gY29weVdpdGhpbiBb57un5om/XVxuXG4gIC8qKlxuICAgKiDpgY3ljoZcbiAgICovXG4gIC8vIFN5bWJvbC5pdGVyYXRvciBb57un5om/XVxuICAvLyBrZXlzIFvnu6fmib9dXG4gIC8vIHZhbHVlcyBb57un5om/XVxuICAvLyBlbnRyaWVzIFvnu6fmib9dXG4gIC8vIFvlrprliLZdXG4gIGZvckVhY2goKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xmib5cbiAgICovXG4gIC8vIGF0IFvnu6fmib9dXG4gIC8vIGZpbmQgW+e7p+aJv11cbiAgLy8gZmluZEluZGV4IFvnu6fmib9dXG4gIC8vIGZpbmRMYXN0IFvnu6fmib9dXG4gIC8vIGZpbmRMYXN0SW5kZXggW+e7p+aJv11cbiAgLy8gaW5jbHVkZXMgW+e7p+aJv11cbiAgLy8gaW5kZXhPZiBb57un5om/XVxuICAvLyBsYXN0SW5kZXhPZiBb57un5om/XVxuICAvLyBzb21lIFvnu6fmib9dXG4gIC8vIGV2ZXJ5IFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIOeUn+aIkFxuICAgKi9cbiAgLy8gbWFwIFvnu6fmib9dXG4gIC8vIGZpbHRlciBb57un5om/XVxuICAvLyByZWR1Y2UgW+e7p+aJv11cbiAgLy8gcmVkdWNlUmlnaHQgW+e7p+aJv11cbiAgLy8gY29uY2F0IFvnu6fmib9dXG4gIC8vIHNsaWNlIFvnu6fmib9dXG4gIC8vIGpvaW4gW+e7p+aJv11cbiAgLy8gZmxhdCBb57un5om/XVxuICAvLyBmbGF0TWFwIFvnu6fmib9dXG4gIC8vIFvlrprliLZdXG4gIHdpdGgoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUud2l0aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9TcGxpY2VkKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLnRvU3BsaWNlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9Tb3J0ZWQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUudG9Tb3J0ZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvUmV2ZXJzZWQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUudG9SZXZlcnNlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyBb5paw5aKeXVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKGB0b1N0cmluZyDovazmjaLmiqXplJnvvIzlsIbnlJ/miJAgJ1tdJ2AsIGUpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtdKTtcbiAgICB9XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcgW+e7p+aJv11cbiAgLy8gW+aWsOWinl1cbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA+IDA7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBTZXQodGhpcyk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9fU2V0KCkge1xuICAgIHJldHVybiBuZXcgX1NldCh0aGlzKTtcbiAgfVxufVxuIiwiLy8g5pel5pyf5pe26Ze0XG5leHBvcnQgY2xhc3MgX0RhdGUgZXh0ZW5kcyBEYXRlIHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gW+aWsOWinl1cbiAgc3RhdGljIFJFR0VYX1BBUlNFID0gL14oXFxkezR9KVstL10/KFxcZHsxLDJ9KT9bLS9dPyhcXGR7MCwyfSlbVHRcXHNdKihcXGR7MSwyfSk/Oj8oXFxkezEsMn0pPzo/KFxcZHsxLDJ9KT9bLjpdPyhcXGQrKT8kLztcbiAgc3RhdGljIFJFR0VYX0ZPUk1BVCA9IC9cXFsoW15cXF1dKyldfFl7MSw0fXxNezEsNH18RHsxLDJ9fGR7MSw0fXxIezEsMn18aHsxLDJ9fGF8QXxtezEsMn18c3sxLDJ9fFp7MSwyfXxTU1MvZztcbiAgLy8gc3RhdGljIG5vdyBb57un5om/XVxuICAvLyBzdGF0aWMgcGFyc2UgW+e7p+aJv11cbiAgLy8gc3RhdGljIFVUQyBb57un5om/XVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIC8vIGNvbnNvbGUubG9nKCdfRGF0ZSBjb25zdHJ1Y3RvcicsIGFyZ3MpO1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gbnVsbCDlkozmmL7lvI8gdW5kZWZpbmVkIOmDveinhuS4uuaXoOaViOWAvFxuICAgICAgaWYgKGFyZ3NbMF0gPT09IG51bGwpIHtcbiAgICAgICAgYXJnc1swXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZUFsbCgnLScsICcvJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgLy8gW+aWsOWinl1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3llYXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZ1bGxZZWFyKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbW9udGgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1vbnRoKCkgKyAxO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RheScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0ZSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3dlZWsnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERheSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2hvdXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhvdXJzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2hvcnRIb3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBjb25zdCBob3VyID0gdGhpcy5ob3VyO1xuICAgICAgICByZXR1cm4gaG91ciAlIDEyID09PSAwID8gaG91ciA6IGhvdXIgJSAxMjtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtaW51dGUnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1pbnV0ZXMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzZWNvbmQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNlY29uZHMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtaWxsaXNlY29uZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGltZVpvbmVPZmZzZXRIb3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g5qC85byP5YyW5a2X56ym5Liy55So44CC5oC75L2T5ZCMIGVsZW1lbnQg55So55qEIGRheS5qcyDmoLzlvI8oaHR0cHM6Ly9kYXkuanMub3JnL2RvY3MvemgtQ04vZGlzcGxheS9mb3JtYXQp77yM6aOO5qC85a6a5Yi25oiQ5Lit5paHXG4gICAgdGhpcy5mb3JtYXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdZWScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMueWVhci50b1N0cmluZygpLnNsaWNlKC0yKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWVlZWScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMueWVhci50b1N0cmluZygpLnNsaWNlKC00KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnTScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubW9udGgudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnTU0nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1vbnRoLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnRCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuZGF5LnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0REJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5kYXkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdkJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbJ+WRqOaXpScsICflkajkuIAnLCAn5ZGo5LqMJywgJ+WRqOS4iScsICflkajlm5snLCAn5ZGo5LqUJywgJ+WRqOWFrSddWyR0aGlzLndlZWtdO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdkZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWyfmmJ/mnJ/ml6UnLCAn5pif5pyf5LiAJywgJ+aYn+acn+S6jCcsICfmmJ/mnJ/kuIknLCAn5pif5pyf5ZubJywgJ+aYn+acn+S6lCcsICfmmJ/mnJ/lha0nXVskdGhpcy53ZWVrXTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnSCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ci50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdISCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ci50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ2gnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNob3J0SG91ci50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdoaCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2hvcnRIb3VyLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnbScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWludXRlLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ21tJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5taW51dGUudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdzJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zZWNvbmQudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnc3MnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNlY29uZC50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1NTUycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWlsbGlzZWNvbmQudG9TdHJpbmcoKS5wYWRTdGFydCgzLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdhJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5ob3VyIDwgMTIgPyAn5LiK5Y2IJyA6ICfkuIvljYgnO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdBJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdaJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNpZ24gPSAkdGhpcy50aW1lWm9uZU9mZnNldEhvdXIgPCAwID8gJysnIDogJy0nO1xuICAgICAgICByZXR1cm4gYCR7c2lnbn0keygtJHRoaXMudGltZVpvbmVPZmZzZXRIb3VyKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OjAwYDtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWlonLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLloucmVwbGFjZSgnOicsICcnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogW+e7p+aJv10gZ2V0IOezu+WIl+aWueazleOAguS9v+eUqCB5ZWFy44CBbW9udGgg562J6YCa6L+H5paw5aKe5bGe5oCn6I635Y+W5Y2z5Y+v77yM566A5YyW5YaZ5rOV77yM5peg6ZyA6aKd5aSW5a6a5Yi2XG4gICAqL1xuICAvLyBnZXRUaW1lIFvnu6fmib9dXG4gIC8vIGdldFRpbWV6b25lT2Zmc2V0IFvnu6fmib9dXG5cbiAgLy8gZ2V0WWVhciBb57un5om/XVxuICAvLyBnZXRGdWxsWWVhciBb57un5om/XVxuICAvLyBnZXRNb250aCBb57un5om/XVxuICAvLyBnZXREYXRlIFvnu6fmib9dXG4gIC8vIGdldERheSBb57un5om/XVxuICAvLyBnZXRIb3VycyBb57un5om/XVxuICAvLyBnZXRNaW51dGVzIFvnu6fmib9dXG4gIC8vIGdldFNlY29uZHMgW+e7p+aJv11cbiAgLy8gZ2V0TWlsbGlzZWNvbmRzIFvnu6fmib9dXG5cbiAgLy8gZ2V0VVRDRnVsbFllYXIgW+e7p+aJv11cbiAgLy8gZ2V0VVRDTW9udGggW+e7p+aJv11cbiAgLy8gZ2V0VVRDRGF0ZSBb57un5om/XVxuICAvLyBnZXRVVENEYXkgW+e7p+aJv11cbiAgLy8gZ2V0VVRDSG91cnMgW+e7p+aJv11cbiAgLy8gZ2V0VVRDTWludXRlcyBb57un5om/XVxuICAvLyBnZXRVVENTZWNvbmRzIFvnu6fmib9dXG4gIC8vIGdldFVUQ01pbGxpc2Vjb25kcyBb57un5om/XVxuXG4gIC8qKlxuICAgKiBb5a6a5Yi2XSBzZXQg57O75YiX5pa55rOV44CC5a6a5Yi25oiQ6L+U5ZueIHRoaXMg5L6/5LqO6ZO+5byP5pON5L2cXG4gICAqL1xuICBzZXRUaW1lKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFRpbWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFllYXIoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0WWVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldEZ1bGxZZWFyKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldEZ1bGxZZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0TW9udGgoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0TW9udGguYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXREYXRlKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldERhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRIb3VycygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRIb3Vycy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldE1pbnV0ZXMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0TWludXRlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFNlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0U2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldE1pbGxpc2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRNaWxsaXNlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFVUQ0Z1bGxZZWFyKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ0Z1bGxZZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDTW9udGgoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDTW9udGguYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENEYXRlKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ0RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENIb3VycygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENIb3Vycy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ01pbnV0ZXMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDTWludXRlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ1NlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDU2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ01pbGxpc2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENNaWxsaXNlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vIFvmlrDlop5dXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpbWUoKTtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b1N0cmluZyhmb3JtYXQgPSAnWVlZWS1NTS1ERCBoaDptbTpzcycpIHtcbiAgICBpZiAoIXRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlQWxsKHRoaXMuY29uc3RydWN0b3IuUkVHRVhfRk9STUFULCAobWF0Y2gsICQxKSA9PiB7XG4gICAgICAvLyBbXSDph4zpnaLnmoTlhoXlrrnljp/moLfovpPlh7pcbiAgICAgIGlmICgkMSkge1xuICAgICAgICByZXR1cm4gJDE7XG4gICAgICB9XG4gICAgICAvLyDmoLzlvI9cbiAgICAgIGlmIChtYXRjaCBpbiB0aGlzLmZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRbbWF0Y2hdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvRGF0ZVN0cmluZyhmb3JtYXQgPSAnWVlZWS1NTS1ERCcpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZyhmb3JtYXQpO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvVGltZVN0cmluZyhmb3JtYXQgPSAnSEg6bW06c3MnKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoZm9ybWF0KTtcbiAgfVxuICAvLyB0b0xvY2FsZVN0cmluZyBb57un5om/XVxuICAvLyB0b0xvY2FsZURhdGVTdHJpbmcgW+e7p+aJv11cbiAgLy8gdG9Mb2NhbGVUaW1lU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvSVNPU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvVVRDU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvR01UU3RyaW5nIFvnu6fmib9dXG4gIC8vIFvmlrDlop5dXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gIU51bWJlci5pc05hTih0aGlzLmdldFRpbWUoKSk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9KU09OKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cbiAgLy8gdmFsdWVPZiBb57un5om/XVxufVxuIiwiLy8g5pWw5a2m6L+Q566X44CC5a+5IE1hdGgg5a+56LGh5omp5bGV77yM5o+Q5L6b5pu055u06KeC5ZKM56ym5ZCI5pWw5a2m57qm5a6a55qE5ZCN56ewXG5pbXBvcnQgeyBfQXJyYXkgfSBmcm9tICcuL19BcnJheSc7XG5pbXBvcnQgeyBfU2V0IH0gZnJvbSAnLi9fU2V0JztcbmV4cG9ydCBjb25zdCBfTWF0aCA9IE9iamVjdC5jcmVhdGUoTWF0aCk7XG5cbi8vIOW4uOmHj1xuLy8gRSBb57un5om/XVxuLy8gTE4yIFvnu6fmib9dXG4vLyBMTjEwIFvnu6fmib9dXG4vLyBMT0cyRSBb57un5om/XVxuLy8gTE9HMTBFIFvnu6fmib9dXG4vLyBQSSBb57un5om/XVxuLy8gU1FSVDFfMiBb57un5om/XVxuLy8gU1FSVDIgW+e7p+aJv11cbi8vIOm7hOmHkeWIhuWJsuavlCBQSElcbl9NYXRoLlBISSA9IChNYXRoLnNxcnQoNSkgLSAxKSAvIDI7XG5fTWF0aC5QSElfQklHID0gKE1hdGguc3FydCg1KSArIDEpIC8gMjtcblxuLy8g5bi46KeEXG4vLyBhYnMgW+e7p+aJv11cbi8vIG1pbiBb57un5om/XVxuLy8gbWF4IFvnu6fmib9dXG4vLyByYW5kb20gW+e7p+aJv11cbi8vIHNpZ24gW+e7p+aJv11cbi8vIGh5cG90IFvnu6fmib9dXG4vLyBjbHozMiBb57un5om/XVxuLy8gaW11bCBb57un5om/XVxuLy8gZnJvdW5kIFvnu6fmib9dXG5cbi8vIOWPluaVtFxuLy8gY2VpbCBb57un5om/XVxuLy8gZmxvb3IgW+e7p+aJv11cbi8vIHJvdW5kIFvnu6fmib9dXG4vLyB0cnVuYyBb57un5om/XVxuXG4vLyDkuInop5Llh73mlbBcbi8vIHNpbiBb57un5om/XVxuLy8gY29zIFvnu6fmib9dXG4vLyB0YW4gW+e7p+aJv11cbi8vIGFzaW4gW+e7p+aJv11cbi8vIGFjb3MgW+e7p+aJv11cbi8vIGF0YW4gW+e7p+aJv11cbi8vIHNpbmggW+e7p+aJv11cbi8vIGNvc2ggW+e7p+aJv11cbi8vIHRhbmggW+e7p+aJv11cbi8vIGFzaW5oIFvnu6fmib9dXG4vLyBhY29zaCBb57un5om/XVxuLy8gYXRhbmggW+e7p+aJv11cbi8vIGF0YW4yIFvnu6fmib9dXG4vLyBb5paw5aKeXVxuX01hdGguYXJjc2luID0gTWF0aC5hc2luLmJpbmQoTWF0aCk7XG5fTWF0aC5hcmNjb3MgPSBNYXRoLmFjb3MuYmluZChNYXRoKTtcbl9NYXRoLmFyY3RhbiA9IE1hdGguYXRhbi5iaW5kKE1hdGgpO1xuX01hdGguYXJzaW5oID0gTWF0aC5hc2luaC5iaW5kKE1hdGgpO1xuX01hdGguYXJjb3NoID0gTWF0aC5hY29zaC5iaW5kKE1hdGgpO1xuX01hdGguYXJ0YW5oID0gTWF0aC5hdGFuaC5iaW5kKE1hdGgpO1xuXG4vLyDlr7nmlbBcbi8vIGxvZzIgW+e7p+aJv11cbi8vIGxvZzEwIFvnu6fmib9dXG4vLyBsb2cxcCBb57un5om/XVxuLy8gW+WumuWItl1cbl9NYXRoLmxvZyA9IGZ1bmN0aW9uKGEsIHgpIHtcbiAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coYSk7XG59O1xuX01hdGgubG9nZSA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG5fTWF0aC5sbiA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG5fTWF0aC5sZyA9IE1hdGgubG9nMTAuYmluZChNYXRoKTtcblxuLy8g5oyH5pWwXG4vLyBwb3cgW+e7p+aJv11cbi8vIHNxcnQgW+e7p+aJv11cbi8vIGNicnQgW+e7p+aJv11cbi8vIGV4cCBb57un5om/XVxuLy8gZXhwbTEgW+e7p+aJv11cblxuLy8g6Zi25LmYXG5fTWF0aC5mYWN0b3JpYWwgPSBmdW5jdGlvbihuKSB7XG4gIGxldCByZXN1bHQgPSAxbjtcbiAgZm9yIChsZXQgaSA9IG47IGkgPj0gMTsgaS0tKSB7XG4gICAgcmVzdWx0ICo9IEJpZ0ludChpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbi8vIOaOkuWIlyBBcnJhbmdlbWVudFxuX01hdGguQSA9IGZ1bmN0aW9uKG4sIG0pIHtcbiAgcmV0dXJuIF9NYXRoLmZhY3RvcmlhbChuKSAvIF9NYXRoLmZhY3RvcmlhbChuIC0gbSk7XG59O1xuX01hdGguQXJyYW5nZW1lbnQgPSBfTWF0aC5BO1xuLy8g57uE5ZCIIENvbWJpbmF0aW9uXG5fTWF0aC5DID0gZnVuY3Rpb24obiwgbSkge1xuICByZXR1cm4gX01hdGguQShuLCBtKSAvIF9NYXRoLmZhY3RvcmlhbChtKTtcbn07XG5fTWF0aC5Db21iaW5hdGlvbiA9IF9NYXRoLkM7XG5cbi8vIOaVsOWIl1xuX01hdGguU2VxdWVuY2UgPSBjbGFzcyB7XG4gIC8vIOeUn+aIkOaVsOaNruaWueazlVxuICB0b0FycmF5KGxlbmd0aCA9IHRoaXMubikge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuID0gaSArIDE7XG4gICAgICBhcnJbaV0gPSB0aGlzLmFuKG4pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIHRvX0FycmF5KCkge1xuICAgIHJldHVybiBuZXcgX0FycmF5KHRoaXMudG9BcnJheSguLi5hcmd1bWVudHMpKTtcbiAgfVxuICB0b1NldCgpIHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzLnRvQXJyYXkoLi4uYXJndW1lbnRzKSk7XG4gIH1cbiAgdG9fU2V0KCkge1xuICAgIHJldHVybiBuZXcgX1NldCh0aGlzLnRvQXJyYXkoLi4uYXJndW1lbnRzKSk7XG4gIH1cbn07XG4vLyDnrYnlt67mlbDliJdcbl9NYXRoLkFyaXRobWV0aWNTZXF1ZW5jZSA9IGNsYXNzIGV4dGVuZHMgX01hdGguU2VxdWVuY2Uge1xuICBjb25zdHJ1Y3RvcihhMSwgZCwgbiA9IDApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYTEgPSBhMTsgLy8g6aaW6aG5XG4gICAgdGhpcy5kID0gZDsgLy8g5YWs5beuXG4gICAgdGhpcy5uID0gbjsgLy8g6buY6K6k6aG55pWw77yM5Y+v55So5LqO5pa55rOV55qE5Lyg5Y+C566A5YyWXG4gIH1cbiAgLy8g56ysbumhuVxuICBhbihuID0gdGhpcy5uKSB7XG4gICAgcmV0dXJuIHRoaXMuYTEgKyAobiAtIDEpICogdGhpcy5kO1xuICB9XG4gIC8vIOWJjW7pobnmsYLlkoxcbiAgU24obiA9IHRoaXMubikge1xuICAgIHJldHVybiBuIC8gMiAqICh0aGlzLmExICsgdGhpcy5hbihuKSk7XG4gIH1cbn07XG4vLyDnrYnmr5TmlbDliJdcbl9NYXRoLkdlb21ldHJpY1NlcXVlbmNlID0gY2xhc3MgZXh0ZW5kcyBfTWF0aC5TZXF1ZW5jZSB7XG4gIGNvbnN0cnVjdG9yKGExLCBxLCBuID0gMCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hMSA9IGExOyAvLyDpppbpoblcbiAgICB0aGlzLnEgPSBxOyAvLyDlhazmr5RcbiAgICB0aGlzLm4gPSBuOyAvLyDpu5jorqTpobnmlbDvvIzlj6/nlKjkuo7mlrnms5XnmoTkvKDlj4LnroDljJZcbiAgfVxuICAvLyDnrKxu6aG5XG4gIGFuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gdGhpcy5hMSAqIHRoaXMucSAqKiAobiAtIDEpO1xuICB9XG4gIC8vIOWJjW7pobnmsYLlkoxcbiAgU24obiA9IHRoaXMubikge1xuICAgIGlmICh0aGlzLnEgPT09IDEpIHtcbiAgICAgIHJldHVybiBuICogdGhpcy5hMTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYTEgKiAoMSAtIHRoaXMucSAqKiBuKSAvICgxIC0gdGhpcy5xKTtcbiAgfVxufTtcbi8vIOaWkOazoumCo+WlkeaVsOWIl1xuX01hdGguRmlib25hY2NpU2VxdWVuY2UgPSBjbGFzcyBleHRlbmRzIF9NYXRoLlNlcXVlbmNlIHtcbiAgY29uc3RydWN0b3IobiA9IDApIHtcbiAgICBzdXBlcigpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnYTEnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuKDEpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLm4gPSBuOyAvLyDpu5jorqTpobnmlbDvvIzlj6/nlKjkuo7mlrnms5XnmoTkvKDlj4LnroDljJZcbiAgfVxuICAvLyDnrKxu6aG5XG4gIGFuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgoX01hdGguUEhJX0JJRyAqKiBuIC0gKDEgLSBfTWF0aC5QSElfQklHKSAqKiBuKSAvIE1hdGguc3FydCg1KSk7XG4gIH1cbiAgLy8g5YmNbumhueaxguWSjFxuICBTbihuID0gdGhpcy5uKSB7XG4gICAgcmV0dXJuIHRoaXMuYW4obiArIDIpIC0gMTtcbiAgfVxufTtcbi8vIOe0oOaVsOaVsOWIl1xuX01hdGguUHJpbWVTZXF1ZW5jZSA9IGNsYXNzIGV4dGVuZHMgX01hdGguU2VxdWVuY2Uge1xuICAvLyDmmK/lkKbntKDmlbBcbiAgc3RhdGljIGlzUHJpbWUoeCkge1xuICAgIGlmICh4IDw9IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDI7IGkgPD0gTWF0aC5zcXJ0KHgpOyBpKyspIHtcbiAgICAgIGlmICh4ICUgaSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8vIOWIm+W7uue0oOaVsOWIl+ihqFxuICBzdGF0aWMgY3JlYXRlTGlzdChhMSwgbikge1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBsZXQgdmFsdWUgPSBhMTtcbiAgICB3aGlsZSAocmVzdWx0Lmxlbmd0aCA8IG4pIHtcbiAgICAgIGlmICh0aGlzLmlzUHJpbWUodmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHZhbHVlKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhMSA9IDIsIG4gPSAwKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5jb25zdHJ1Y3Rvci5jcmVhdGVMaXN0KGExLCBuKTtcbiAgICB0aGlzLmExID0gYTE7XG4gICAgdGhpcy5uID0gbjsgLy8g6buY6K6k6aG55pWw77yM5Y+v55So5LqO5pa55rOV55qE5Lyg5Y+C566A5YyWXG4gIH1cblxuICBhbihuID0gdGhpcy5uKSB7XG4gICAgaWYgKG4gPD0gdGhpcy5uKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVtuIC0gMV07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmNyZWF0ZUxpc3QodGhpcy5hMSwgbilbbiAtIDFdO1xuICB9XG4gIFNuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gdGhpcy50b0FycmF5KG4pLnJlZHVjZSgodG90YWwsIHZhbCkgPT4gdG90YWwgKyB2YWwsIDApO1xuICB9XG59O1xuIiwiLy8g5pWw5a2XXG5leHBvcnQgY2xhc3MgX051bWJlciBleHRlbmRzIE51bWJlciB7XG4gIC8qKlxuICAgKiBzdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBOYU4gW+e7p+aJv11cbiAgLy8gc3RhdGljIFBPU0lUSVZFX0lORklOSVRZIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBORUdBVElWRV9JTkZJTklUWSBb57un5om/XVxuICAvLyBzdGF0aWMgTUFYX1ZBTFVFIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBNSU5fVkFMVUUgW+e7p+aJv11cbiAgLy8gc3RhdGljIE1BWF9TQUZFX0lOVEVHRVIgW+e7p+aJv11cbiAgLy8gc3RhdGljIE1JTl9TQUZFX0lOVEVHRVIgW+e7p+aJv11cbiAgLy8gc3RhdGljIEVQU0lMT04gW+e7p+aJv11cblxuICAvLyBzdGF0aWMgaXNOYU4gW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzRmluaXRlIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc0ludGVnZXIgW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzU2FmZUludGVnZXIgW+e7p+aJv11cbiAgLy8gc3RhdGljIHBhcnNlSW50IFvnu6fmib9dXG4gIC8vIHN0YXRpYyBwYXJzZUZsb2F0IFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHZhbHVlID0gTnVtYmVyLnBhcnNlRmxvYXQodmFsdWUpO1xuICAgIHN1cGVyKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlJ/miJBcbiAgICovXG4gIC8vIFvmlrDlop5dIOi/lOWbnuaWsOWAvO+8jOaWueS+v+i1i+WAvOWmgiBudW0gPSBudW0ubmV3KHZhbHVlKSDlhpnms5VcbiAgbmV3KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyB0b1ByZWNpc2lvbiBb57un5om/XVxuICAvLyB0b0ZpeGVkIFvnu6fmib9dXG4gIC8vIFvmlrDlop5dIOWMuuWIq+S6jiB0b0ZpeGVk77yM5Lya56e76Zmk5aSa5L2Z55qEIDAg5Lul57K+566A5pi+56S6XG4gIHRvTWF4Rml4ZWQoZnJhY3Rpb25EaWdpdHMgPSAwKSB7XG4gICAgY29uc3Qgc3RyID0gTnVtYmVyLnByb3RvdHlwZS50b0ZpeGVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIE51bWJlci5wYXJzZUZsb2F0KHN0cikudG9TdHJpbmcoKTtcbiAgfVxuICAvLyB0b0V4cG9uZW50aWFsIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gW+aWsOWinl1cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGNvbnNvbGUubG9nKCdfTnVtYmVyIFN5bWJvbC50b1ByaW1pdGl2ZScsIHsgaGludCB9KTtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgfVxuICAvLyB2YWx1ZU9mIFvnu6fmib9dXG4gIC8vIHRvU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvTG9jYWxlU3RyaW5nIFvnu6fmib9dXG4gIC8vIFvmlrDlop5dXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gIU51bWJlci5pc05hTih0aGlzKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgX1JlZmxlY3QgPSBPYmplY3QuY3JlYXRlKFJlZmxlY3QpO1xuXG4vLyBhcHBseSDnu6fmib9cbi8vIGNvbnN0cnVjdCDnu6fmib9cbi8vIGRlZmluZVByb3BlcnR5IOe7p+aJv1xuLy8gZGVsZXRlUHJvcGVydHkg57un5om/XG4vLyBnZXQg57un5om/XG4vLyBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ig57un5om/XG4vLyBnZXRQcm90b3R5cGVPZiDnu6fmib9cbi8vIG93bktleXMg57un5om/XG4vLyBzZXQg57un5om/XG4vLyBzZXRQcm90b3R5cGVPZiDnu6fmib9cbi8vIHByZXZlbnRFeHRlbnNpb25zIOe7p+aJv1xuLy8gaGFzIOe7p+aJv1xuLy8gaXNFeHRlbnNpYmxlIOe7p+aJv1xuXG4vLyDlr7kgb3duS2V5cyDphY3lpZcgb3duVmFsdWVzIOWSjCBvd25FbnRyaWVzXG5fUmVmbGVjdC5vd25WYWx1ZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xufTtcbl9SZWZsZWN0Lm93bkVudHJpZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gW2tleSwgdGFyZ2V0W2tleV1dKTtcbn07XG4iLCIvLyDmlbDmja7lpITnkIbvvIzlpITnkIblpJrmoLzlvI/mlbDmja7nlKhcbmV4cG9ydCBjb25zdCBEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbi8qKlxuICog5LyY5YyWIHR5cGVvZlxuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7J3VuZGVmaW5lZCd8J29iamVjdCd8J2Jvb2xlYW4nfCdudW1iZXInfCdzdHJpbmcnfCdmdW5jdGlvbid8J3N5bWJvbCd8J2JpZ2ludCd8c3RyaW5nfVxuICovXG5EYXRhLnR5cGVvZiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbn07XG4vKipcbiAqIOWIpOaWreeugOWNleexu+Wei1xuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGF0YS5pc1NpbXBsZVR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gWydudWxsJywgJ3VuZGVmaW5lZCcsICdudW1iZXInLCAnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnYmlnaW50JywgJ3N5bWJvbCddLmluY2x1ZGVzKHRoaXMudHlwZW9mKHZhbHVlKSk7XG59O1xuLyoqXG4gKiDmmK/lkKbmma7pgJrlr7nosaFcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkRhdGEuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59O1xuLyoqXG4gKiDojrflj5blgLznmoTlhbfkvZPnsbvlnotcbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEByZXR1cm5zIHtPYmplY3RDb25zdHJ1Y3RvcnwqfEZ1bmN0aW9ufSDov5Tlm57lr7nlupTmnoTpgKDlh73mlbDjgIJudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICovXG5EYXRhLmdldEV4YWN0VHlwZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgLy8gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGh5pe2IF9fcHJvdG9fXyDkuLogbnVsbFxuICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDlr7nlupTnu6fmib/nmoTlr7nosaEgX19wcm90b19fIOayoeaciSBjb25zdHJ1Y3RvciDlsZ7mgKdcbiAgY29uc3QgaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gISgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXyk7XG4gIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDov5Tlm57lr7nlupTmnoTpgKDlh73mlbBcbiAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3Rvcjtcbn07XG4vKipcbiAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei+WIl+ihqFxuICogQHBhcmFtIHZhbHVlIOWAvFxuICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gKi9cbkRhdGEuZ2V0RXhhY3RUeXBlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Yik5pat5aSE55CGXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gW3ZhbHVlXTtcbiAgfVxuICAvLyDmiavljp/lnovpk77lvpfliLDlr7nlupTmnoTpgKDlh73mlbBcbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBsZXQgbG9vcCA9IDA7XG4gIGxldCBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gZmFsc2U7XG4gIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIGNvbnNvbGUud2Fybignd2hpbGUnLCBsb29wLCBfX3Byb3RvX18pO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIC8vIOS4gOi/m+adpSBfX3Byb3RvX18g5bCx5pivIG51bGwg6K+05piOIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoVxuICAgICAgaWYgKGxvb3AgPD0gMCkge1xuICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKSB7XG4gICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgfVxuICAgIF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihfX3Byb3RvX18pO1xuICAgIGxvb3ArKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiDmt7Hmi7fotJ3mlbDmja5cbiAqIEBwYXJhbSBzb3VyY2VcbiAqIEByZXR1cm5zIHtNYXA8YW55LCBhbnk+fFNldDxhbnk+fHt9fCp8KltdfVxuICovXG5EYXRhLmRlZXBDbG9uZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAvLyDmlbDnu4RcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIFNldFxuICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgIHJlc3VsdC5hZGQodGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBNYXBcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHNvdXJjZS5lbnRyaWVzKCkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCB0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOWvueixoVxuICBpZiAodGhpcy5nZXRFeGFjdFR5cGUoc291cmNlKSA9PT0gT2JqZWN0KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgLy8gdmFsdWXmlrnlvI/vvJrpgJLlvZLlpITnkIZcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQ2xvbmUoZGVzYy52YWx1ZSksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0L3NldCDmlrnlvI/vvJrnm7TmjqXlrprkuYlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlhbbku5bvvJrljp/moLfov5Tlm55cbiAgcmV0dXJuIHNvdXJjZTtcbn07XG4vKipcbiAqIOa3seino+WMheaVsOaNrlxuICogQHBhcmFtIGRhdGEg5YC8XG4gKiBAcGFyYW0gaXNXcmFwIOWMheijheaVsOaNruWIpOaWreWHveaVsO+8jOWmgiB2dWUzIOeahCBpc1JlZiDlh73mlbBcbiAqIEBwYXJhbSB1bndyYXAg6Kej5YyF5pa55byP5Ye95pWw77yM5aaCIHZ1ZTMg55qEIHVucmVmIOWHveaVsFxuICogQHJldHVybnMge3tbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fCp8KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfHtbcDogc3RyaW5nXTogYW55fX1cbiAqL1xuRGF0YS5kZWVwVW53cmFwID0gZnVuY3Rpb24oZGF0YSwgeyBpc1dyYXAgPSAoKSA9PiBmYWxzZSwgdW53cmFwID0gdmFsID0+IHZhbCB9ID0ge30pIHtcbiAgLy8g6YCJ6aG55pS26ZuGXG4gIGNvbnN0IG9wdGlvbnMgPSB7IGlzV3JhcCwgdW53cmFwIH07XG4gIC8vIOWMheijheexu+Wei++8iOWmgnZ1ZTPlk43lupTlvI/lr7nosaHvvInmlbDmja7op6PljIVcbiAgaWYgKGlzV3JhcChkYXRhKSkge1xuICAgIHJldHVybiB0aGlzLmRlZXBVbndyYXAodW53cmFwKGRhdGEpLCBvcHRpb25zKTtcbiAgfVxuICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBkYXRhLm1hcCh2YWwgPT4gdGhpcy5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucykpO1xuICB9XG4gIGlmICh0aGlzLmdldEV4YWN0VHlwZShkYXRhKSA9PT0gT2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhkYXRhKS5tYXAoKFtrZXksIHZhbF0pID0+IHtcbiAgICAgIHJldHVybiBba2V5LCB0aGlzLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgfSkpO1xuICB9XG4gIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIvLyDovoXliqlcbmV4cG9ydCBjb25zdCBTdXBwb3J0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiDlsZ7mgKflkI3nu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAqIEBwYXJhbSBuYW1lcyDlsZ7mgKflkI3jgILmoLzlvI8gJ2EsYixjJyDmiJYgWydhJywnYicsJ2MnXVxuICogQHBhcmFtIHNlcGFyYXRvciBuYW1lcyDkuLrlrZfnrKbkuLLml7bnmoTmi4bliIbop4TliJnjgILlkIwgc3BsaXQg5pa55rOV55qEIHNlcGFyYXRvcu+8jOWtl+espuS4suaXoOmcgOaLhuWIhueahOWPr+S7peS8oCBudWxsIOaIliB1bmRlZmluZWRcbiAqIEByZXR1cm5zIHsqW11bXXwoTWFnaWNTdHJpbmcgfCBCdW5kbGUgfCBzdHJpbmcpW118RmxhdEFycmF5PChGbGF0QXJyYXk8KCp8WypbXV18W10pW10sIDE+W118KnxbKltdXXxbXSlbXSwgMT5bXXwqW119XG4gKi9cblN1cHBvcnQubmFtZXNUb0FycmF5ID0gZnVuY3Rpb24obmFtZXMgPSBbXSwgeyBzZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSB7XG4gIGlmIChuYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIG5hbWVzLm1hcCh2YWwgPT4gdGhpcy5uYW1lc1RvQXJyYXkodmFsKSkuZmxhdCgpO1xuICB9XG4gIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5hbWVzLnNwbGl0KHNlcGFyYXRvcikubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N5bWJvbCcpIHtcbiAgICByZXR1cm4gW25hbWVzXTtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG4vKipcbiAqIOe7keWumnRoaXPjgILluLjnlKjkuo7op6PmnoTlh73mlbDml7bnu5HlrpogdGhpcyDpgb/lhY3miqXplJlcbiAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAqIEByZXR1cm5zIHsqfVxuICovXG5TdXBwb3J0LmJpbmRUaGlzID0gZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIHtcbiAgICBnZXQodGFyZ2V0LCBwLCByZWNlaXZlcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBSZWZsZWN0LmdldCguLi5hcmd1bWVudHMpO1xuICAgICAgLy8g5Ye95pWw57G75Z6L57uR5a6adGhpc1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmJpbmQodGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWxnuaAp+WOn+agt+i/lOWbnlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gIH0pO1xufTtcbiIsIi8vIOWvueixoVxuaW1wb3J0IHsgX1JlZmxlY3QgfSBmcm9tICcuL19SZWZsZWN0JztcbmltcG9ydCB7IERhdGEgfSBmcm9tICcuL0RhdGEnO1xuaW1wb3J0IHsgU3VwcG9ydCB9IGZyb20gJy4vU3VwcG9ydCc7XG5cbi8vIGV4dGVuZHMgT2JqZWN0IOaWueW8j+iwg+eUqCBzdXBlciDlsIbnlJ/miJDnqbrlr7nosaHvvIzkuI3kvJrlg4/mma7pgJrmnoTpgKDlh73mlbDpgqPmoLfliJvlu7rkuIDkuKrmlrDnmoTlr7nosaHvvIzmlLnlrp7njrBcbmV4cG9ydCBjbGFzcyBfT2JqZWN0IHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGNyZWF0ZSBb57un5om/XVxuICAvLyBzdGF0aWMgZnJvbUVudHJpZXMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGdldFByb3RvdHlwZU9mIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBzZXRQcm90b3R5cGVPZiBb57un5om/XVxuICAvLyBzdGF0aWMgZGVmaW5lUHJvcGVydHkgW+e7p+aJv11cbiAgLy8gc3RhdGljIGRlZmluZVByb3BlcnRpZXMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGhhc093biBb57un5om/XVxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eU5hbWVzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBwcmV2ZW50RXh0ZW5zaW9ucyBb57un5om/XVxuICAvLyBzdGF0aWMgaXNFeHRlbnNpYmxlIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBzZWFsIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc1NlYWxlZCBb57un5om/XVxuICAvLyBzdGF0aWMgZnJlZXplIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc0Zyb3plbiBb57un5om/XVxuXG4gIC8qKlxuICAgKiBb5a6a5Yi2XSDmtYXlkIjlubblr7nosaHjgILlhpnms5XlkIwgT2JqZWN0LmFzc2lnbu+8jOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICAgKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIC8vIOS4jeS9v+eUqCB0YXJnZXRba2V5XSA9IHZhbHVlIOWGmeazle+8jOebtOaOpeS9v+eUqCBPYmplY3QuZGVmaW5lUHJvcGVydHkg6YeN5a6a5LmJXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOa3seWQiOW5tuWvueixoeOAguWQjCBhc3NpZ24g5LiA5qC35Lmf5Lya5a+55bGe5oCn6L+b6KGM6YeN5a6a5LmJXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gICAqIEBwYXJhbSBzb3VyY2VzIOaVsOaNrua6kFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZGVlcEFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXNzaWduKHt9LCAuLi5zb3VyY2VzKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgICAgLy8gdmFsdWUg5YaZ5rOV77ya5a+56LGh6YCS5b2S5aSE55CG77yM5YW25LuW55u05o6l5a6a5LmJXG4gICAgICAgICAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChkZXNjLnZhbHVlKSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCB7XG4gICAgICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmRlZXBBc3NpZ24odGFyZ2V0W2tleV0sIGRlc2MudmFsdWUpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGdldC9zZXQg5YaZ5rOV77ya55u05o6l5a6a5LmJXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFvlrprliLZdIOiOt+WPluWxnuaAp+WQjeOAgum7mOiupOWPguaVsOmFjee9ruaIkOWQjCBPYmplY3Qua2V5cyDooYzkuLpcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge2FueVtdfVxuICAgKi9cbiAgc3RhdGljIGtleXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgLy8gc2V055So5LqOa2V55Y676YeNXG4gICAgbGV0IHNldCA9IG5ldyBTZXQoKTtcbiAgICAvLyDoh6rouqvlsZ7mgKfnrZvpgIlcbiAgICBjb25zdCBkZXNjcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCk7XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBfUmVmbGVjdC5vd25FbnRyaWVzKGRlc2NzKSkge1xuICAgICAgLy8g5b+955Wlc3ltYm9s5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIXN5bWJvbCAmJiB0eXBlb2Yga2V5ID09PSAnc3ltYm9sJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOW/veeVpeS4jeWPr+WIl+S4vuWxnuaAp+eahOaDheWGtVxuICAgICAgaWYgKCFub3RFbnVtZXJhYmxlICYmICFkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blsZ7mgKfliqDlhaVcbiAgICAgIHNldC5hZGQoa2V5KTtcbiAgICB9XG4gICAgLy8g57un5om/5bGe5oCnXG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgICBpZiAoX19wcm90b19fICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudEtleXMgPSB0aGlzLmtleXMoX19wcm90b19fLCBvcHRpb25zKTtcbiAgICAgICAgZm9yIChjb25zdCBwYXJlbnRLZXkgb2YgcGFyZW50S2V5cykge1xuICAgICAgICAgIHNldC5hZGQocGFyZW50S2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyDov5Tlm57mlbDnu4RcbiAgICByZXR1cm4gQXJyYXkuZnJvbShzZXQpO1xuICB9XG4gIC8qKlxuICAgKiBb5a6a5Yi2XVxuICAgKi9cbiAgc3RhdGljIHZhbHVlcygpIHtcbiAgfVxuICAvKipcbiAgICogW+WumuWItl1cbiAgICovXG4gIHN0YXRpYyBlbnRyaWVzKCkge1xuICB9XG5cbiAgLyoqXG4gICAqIFvmlrDlop5dIGtleeiHqui6q+aJgOWxnueahOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5IOWxnuaAp+WQjVxuICAgKiBAcmV0dXJucyB7KnxudWxsfVxuICAgKi9cbiAgc3RhdGljIG93bmVyKG9iamVjdCwga2V5KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3duZXIoX19wcm90b19fLCBrZXkpO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDojrflj5blsZ7mgKfmj4/ov7Dlr7nosaHvvIznm7jmr5QgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcu+8jOiDveaLv+WIsOe7p+aJv+WxnuaAp+eahOaPj+i/sOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0XG4gICAqIEBwYXJhbSBrZXlcbiAgICogQHJldHVybnMge3VuZGVmaW5lZHxQcm9wZXJ0eURlc2NyaXB0b3J9XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvcihvYmplY3QsIGtleSkge1xuICAgIGNvbnN0IGZpbmRPYmplY3QgPSB0aGlzLm93bmVyKG9iamVjdCwga2V5KTtcbiAgICBpZiAoIWZpbmRPYmplY3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZpbmRPYmplY3QsIGtleSk7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOWvueW6lCBrZXlzIOiOt+WPliBkZXNjcmlwdG9yc++8jOS8oOWPguWQjCBrZXlzIOaWueazleOAguWPr+eUqOS6jumHjeWumuS5ieWxnuaAp1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7KFByb3BlcnR5RGVzY3JpcHRvcnx1bmRlZmluZWQpW119XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvcnMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3QgX2tleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2tleXMubWFwKGtleSA9PiB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpKTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3JFbnRyaWVz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHtbKiwoUHJvcGVydHlEZXNjcmlwdG9yfHVuZGVmaW5lZCldW119XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvckVudHJpZXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3QgX2tleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2tleXMubWFwKGtleSA9PiBba2V5LCB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpXSk7XG4gIH1cblxuICAvKipcbiAgICogW+aWsOWinl0g6L+H5ruk5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBwaWNrIOaMkemAieWxnuaAp1xuICAgKiBAcGFyYW0gb21pdCDlv73nlaXlsZ7mgKdcbiAgICogQHBhcmFtIGVtcHR5UGljayBwaWNrIOS4uuepuuaXtueahOWPluWAvOOAgmFsbCDlhajpg6hrZXnvvIxlbXB0eSDnqbpcbiAgICogQHBhcmFtIHNlcGFyYXRvciDlkIwgbmFtZXNUb0FycmF5IOeahCBzZXBhcmF0b3Ig5Y+C5pWwXG4gICAqIEBwYXJhbSBzeW1ib2wg5ZCMIGtleXMg55qEIHN5bWJvbCDlj4LmlbBcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5ZCMIGtleXMg55qEIG5vdEVudW1lcmFibGUg5Y+C5pWwXG4gICAqIEBwYXJhbSBleHRlbmQg5ZCMIGtleXMg55qEIGV4dGVuZCDlj4LmlbBcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGZpbHRlcihvYmplY3QsIHsgcGljayA9IFtdLCBvbWl0ID0gW10sIGVtcHR5UGljayA9ICdhbGwnLCBzZXBhcmF0b3IgPSAnLCcsIHN5bWJvbCA9IHRydWUsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgLy8gcGlja+OAgW9taXQg57uf5LiA5oiQ5pWw57uE5qC85byPXG4gICAgcGljayA9IFN1cHBvcnQubmFtZXNUb0FycmF5KHBpY2ssIHsgc2VwYXJhdG9yIH0pO1xuICAgIG9taXQgPSBTdXBwb3J0Lm5hbWVzVG9BcnJheShvbWl0LCB7IHNlcGFyYXRvciB9KTtcbiAgICBsZXQgX2tleXMgPSBbXTtcbiAgICAvLyBwaWNr5pyJ5YC855u05o6l5ou/77yM5Li656m65pe25qC55o2uIGVtcHR5UGljayDpu5jorqTmi7/nqbrmiJblhajpg6hrZXlcbiAgICBfa2V5cyA9IHBpY2subGVuZ3RoID4gMCB8fCBlbXB0eVBpY2sgPT09ICdlbXB0eScgPyBwaWNrIDogdGhpcy5rZXlzKG9iamVjdCwgeyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9KTtcbiAgICAvLyBvbWl0562b6YCJXG4gICAgX2tleXMgPSBfa2V5cy5maWx0ZXIoa2V5ID0+ICFvbWl0LmluY2x1ZGVzKGtleSkpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIF9rZXlzKSB7XG4gICAgICBjb25zdCBkZXNjID0gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KTtcbiAgICAgIC8vIOWxnuaAp+S4jeWtmOWcqOWvvOiHtGRlc2PlvpfliLB1bmRlZmluZWTml7bkuI3orr7nva7lgLxcbiAgICAgIGlmIChkZXNjKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOmAmui/h+aMkemAieaWueW8j+mAieWPluWvueixoeOAgmZpbHRlciDnmoTnroDlhpnmlrnlvI9cbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIGtleXMg5bGe5oCn5ZCN6ZuG5ZCIXG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBwaWNrKG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIob2JqZWN0LCB7IHBpY2s6IGtleXMsIGVtcHR5UGljazogJ2VtcHR5JywgLi4ub3B0aW9ucyB9KTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g6YCa6L+H5o6S6Zmk5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVyIOeahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIG9taXQob2JqZWN0LCBrZXlzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihvYmplY3QsIHsgb21pdDoga2V5cywgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IodmFsdWUgPSB7fSkge1xuICAgIHRoaXMuY29uc3RydWN0b3IuYXNzaWduKHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIF9fcHJvdG9fXyBb57un5om/XVxuICAvLyBfX2RlZmluZUdldHRlcl9fIFvnu6fmib9dXG4gIC8vIF9fZGVmaW5lU2V0dGVyX18gW+e7p+aJv11cbiAgLy8gX19sb29rdXBHZXR0ZXJfXyBb57un5om/XVxuICAvLyBfX2xvb2t1cFNldHRlcl9fIFvnu6fmib9dXG4gIC8vIGlzUHJvdG90eXBlT2YgW+e7p+aJv11cbiAgLy8gaGFzT3duUHJvcGVydHkgW+e7p+aJv11cbiAgLy8gcHJvcGVydHlJc0VudW1lcmFibGUgW+e7p+aJv11cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyBb5paw5aKeXVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHt9KTtcbiAgICB9XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcgW+e7p+aJv11cbiAgLy8gW+aWsOWinl1cbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzKS5sZW5ndGggPiAwO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyB2YWx1ZU9mIFvnu6fmib9dXG59XG5PYmplY3Quc2V0UHJvdG90eXBlT2YoX09iamVjdCwgT2JqZWN0KTtcbiIsImV4cG9ydCBjbGFzcyBfU3RyaW5nIGV4dGVuZHMgU3RyaW5nIHtcbiAgLyoqXG4gICAqIFN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGZyb21DaGFyQ29kZSBb57un5om/XVxuICAvLyBzdGF0aWMgZnJvbUNvZGVQb2ludCBb57un5om/XVxuICAvLyBzdGF0aWMgcmF3IFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIFvmlrDlop5dIOmmluWtl+avjeWkp+WGmVxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvRmlyc3RVcHBlckNhc2UobmFtZSA9ICcnKSB7XG4gICAgcmV0dXJuIGAkeyhuYW1lWzBdID8/ICcnKS50b1VwcGVyQ2FzZSgpfSR7bmFtZS5zbGljZSgxKX1gO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDpppblrZfmr43lsI/lhplcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9GaXJzdExvd2VyQ2FzZShuYW1lID0gJycpIHtcbiAgICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvTG93ZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOi9rOmpvOWzsOWRveWQjeOAguW4uOeUqOS6jui/nuaOpeespuWRveWQjei9rOmpvOWzsOWRveWQje+8jOWmgiB4eC1uYW1lIC0+IHh4TmFtZVxuICAgKiBAcGFyYW0gbmFtZSDlkI3np7BcbiAgICogQHBhcmFtIHNlcGFyYXRvciDov57mjqXnrKbjgILnlKjkuo7nlJ/miJDmraPliJkg6buY6K6k5Li65Lit5YiS57q/IC0g5a+55bqUcmVnZXhw5b6X5YiwIC8tKFxcdykvZ1xuICAgKiBAcGFyYW0gZmlyc3Qg6aaW5a2X5q+N5aSE55CG5pa55byP44CCdHJ1ZSDmiJYgJ3VwcGVyY2FzZSfvvJrovazmjaLmiJDlpKflhpk7XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2Ug5oiWICdsb3dlcmNhc2Un77ya6L2s5o2i5oiQ5bCP5YaZO1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICdyYXcnIOaIliDlhbbku5bml6DmlYjlgLzvvJrpu5jorqTljp/moLfov5Tlm57vvIzkuI3ov5vooYzlpITnkIY7XG4gICAqIEByZXR1cm5zIHtNYWdpY1N0cmluZ3xzdHJpbmd8c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvQ2FtZWxDYXNlKG5hbWUsIHsgc2VwYXJhdG9yID0gJy0nLCBmaXJzdCA9ICdyYXcnIH0gPSB7fSkge1xuICAgIC8vIOeUn+aIkOato+WImVxuICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoYCR7c2VwYXJhdG9yfShcXFxcdylgLCAnZycpO1xuICAgIC8vIOaLvOaOpeaIkOmpvOWzsFxuICAgIGNvbnN0IGNhbWVsTmFtZSA9IG5hbWUucmVwbGFjZUFsbChyZWdleHAsIChzdWJzdHIsICQxKSA9PiB7XG4gICAgICByZXR1cm4gJDEudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgICAvLyDpppblrZfmr43lpKflsI/lhpnmoLnmja7kvKDlj4LliKTmlq1cbiAgICBpZiAoW3RydWUsICd1cHBlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvRmlyc3RVcHBlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgaWYgKFtmYWxzZSwgJ2xvd2VyY2FzZSddLmluY2x1ZGVzKGZpcnN0KSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9GaXJzdExvd2VyQ2FzZShjYW1lbE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FtZWxOYW1lO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDovazov57mjqXnrKblkb3lkI3jgILluLjnlKjkuo7pqbzls7Dlkb3lkI3ovazov57mjqXnrKblkb3lkI3vvIzlpoIgeHhOYW1lIC0+IHh4LW5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ymXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9MaW5lQ2FzZShuYW1lID0gJycsIHsgc2VwYXJhdG9yID0gJy0nIH0gPSB7fSkge1xuICAgIHJldHVybiBuYW1lXG4gICAgLy8g5oyJ6L+e5o6l56ym5ou85o6lXG4gICAgICAucmVwbGFjZUFsbCgvKFthLXpdKShbQS1aXSkvZywgYCQxJHtzZXBhcmF0b3J9JDJgKVxuICAgIC8vIOi9rOWwj+WGmVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgc3VwZXIodmFsdWUpO1xuICB9XG5cbiAgLy8gYW5jaG9yIOe7p+aJv1xuICAvLyBiaWcg57un5om/XG4gIC8vIGJsaW5rIOe7p+aJv1xuICAvLyBib2xkIOe7p+aJv1xuICAvLyBmaXhlZCDnu6fmib9cbiAgLy8gZm9udGNvbG9yIOe7p+aJv1xuICAvLyBmb250c2l6ZSDnu6fmib9cbiAgLy8gaXRhbGljcyDnu6fmib9cbiAgLy8gbGluayDnu6fmib9cbiAgLy8gc21hbGwg57un5om/XG4gIC8vIHN0cmlrZSDnu6fmib9cbiAgLy8gc3ViIOe7p+aJv1xuICAvLyBzdXAg57un5om/XG5cbiAgLy8gW1N5bWJvbC5pdGVyYXRvcl0g57un5om/XG4gIC8vIGxlbmd0aCDnu6fmib9cbiAgLy8gc3BsaXQg57un5om/XG4gIC8vIG1hdGNoIOe7p+aJv1xuICAvLyBtYXRjaEFsbCDnu6fmib9cblxuICAvLyBhdCDnu6fmib9cbiAgLy8gY2hhckF0IOe7p+aJv1xuICAvLyBjaGFyQ29kZUF0IOe7p+aJv1xuICAvLyBjb2RlUG9pbnRBdCDnu6fmib9cbiAgLy8gaW5kZXhPZiDnu6fmib9cbiAgLy8gbGFzdEluZGV4T2Yg57un5om/XG4gIC8vIHNlYXJjaCDnu6fmib9cbiAgLy8gaW5jbHVkZXMg57un5om/XG4gIC8vIHN0YXJ0c1dpdGgg57un5om/XG4gIC8vIGVuZHNXaXRoIOe7p+aJv1xuXG4gIC8vIHNsaWNlIOe7p+aJv1xuICAvLyBzdWJzdHJpbmcg57un5om/XG4gIC8vIHN1YnN0ciDnu6fmib9cbiAgLy8gY29uY2F0IOe7p+aJv1xuICAvLyB0cmltIOe7p+aJv1xuICAvLyB0cmltU3RhcnQg57un5om/XG4gIC8vIHRyaW1FbmQg57un5om/XG4gIC8vIHRyaW1MZWZ0IOe7p+aJv1xuICAvLyB0cmltUmlnaHQg57un5om/XG4gIC8vIHBhZFN0YXJ0IOe7p+aJv1xuICAvLyBwYWRFbmQg57un5om/XG4gIC8vIHJlcGVhdCDnu6fmib9cbiAgLy8gcmVwbGFjZSDnu6fmib9cbiAgLy8gcmVwbGFjZUFsbCDnu6fmib9cbiAgLy8gdG9Mb3dlckNhc2Ug57un5om/XG4gIC8vIHRvVXBwZXJDYXNlIOe7p+aJv1xuICAvLyB0b0xvY2FsZUxvd2VyQ2FzZSDnu6fmib9cbiAgLy8gdG9Mb2NhbGVVcHBlckNhc2Ug57un5om/XG4gIC8vIGxvY2FsZUNvbXBhcmUg57un5om/XG4gIC8vIG5vcm1hbGl6ZSDnu6fmib9cbiAgLy8gaXNXZWxsRm9ybWVkIOe7p+aJv1xuICAvLyB0b1dlbGxGb3JtZWQg57un5om/XG5cbiAgLy8gdG9TdHJpbmcg57un5om/XG4gIC8vIHZhbHVlT2Yg57un5om/XG59XG4iLCIvLyDmoLflvI/lpITnkIZcbmV4cG9ydCBjb25zdCBTdHlsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICog5Y2V5L2N5a2X56ym5Liy44CC5a+55pWw5a2X5oiW5pWw5a2X5qC85byP55qE5a2X56ym5Liy6Ieq5Yqo5ou85Y2V5L2N77yM5YW25LuW5a2X56ym5Liy5Y6f5qC36L+U5ZueXG4gKiBAcGFyYW0gdmFsdWUg5YC8XG4gKiBAcGFyYW0gdW5pdCDljZXkvY3jgIJ2YWx1ZeayoeW4puWNleS9jeaXtuiHquWKqOaLvOaOpe+8jOWPr+S8oCBweC9lbS8lIOetiVxuICogQHJldHVybnMge3N0cmluZ3xzdHJpbmd9XG4gKi9cblN0eWxlLmdldFVuaXRTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSA9ICcnLCB7IHVuaXQgPSAncHgnIH0gPSB7fSkge1xuICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIC8vIOazqOaEj++8mui/memHjOS9v+eUqCA9PSDliKTmlq3vvIzkuI3kvb/nlKggPT09XG4gIHJldHVybiBOdW1iZXIodmFsdWUpID09IHZhbHVlID8gYCR7dmFsdWV9JHt1bml0fWAgOiBTdHJpbmcodmFsdWUpO1xufTtcbiIsIi8vIHZ1ZSDmlbDmja7lpITnkIZcbmltcG9ydCB7IF9TdHJpbmcgfSBmcm9tICcuL19TdHJpbmcnO1xuaW1wb3J0IHsgRGF0YSB9IGZyb20gJy4vRGF0YSc7XG5cbmV4cG9ydCBjb25zdCBWdWVEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gICAqIOa3seino+WMhSB2dWUzIOWTjeW6lOW8j+WvueixoeaVsOaNrlxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcmV0dXJucyB7e1twOiBzdHJpbmddOiAqfHtbcDogc3RyaW5nXTogKn19fCp8KCp8e1twOiBzdHJpbmddOiAqfSlbXXx7W3A6IHN0cmluZ106ICp9fVxuICAgKi9cblZ1ZURhdGEuZGVlcFVud3JhcFZ1ZTMgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHJldHVybiBEYXRhLmRlZXBVbndyYXAoZGF0YSwge1xuICAgIGlzV3JhcDogZGF0YSA9PiBkYXRhPy5fX3ZfaXNSZWYsXG4gICAgdW53cmFwOiBkYXRhID0+IGRhdGEudmFsdWUsXG4gIH0pO1xufTtcblxuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgcHJvcHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIHByb3BEZWZpbml0aW9ucyBwcm9wcyDlrprkuYnvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldFByb3BzRnJvbUF0dHJzID0gZnVuY3Rpb24oYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAvLyBwcm9wcyDlrprkuYnnu5/kuIDmiJDlr7nosaHmoLzlvI/vvIx0eXBlIOe7n+S4gOaIkOaVsOe7hOagvOW8j+S7peS+v+WQjue7reWIpOaWrVxuICBpZiAocHJvcERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCB7IHR5cGU6IFtdIH1dKSk7XG4gIH0gZWxzZSBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KHByb3BEZWZpbml0aW9ucykpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKS5tYXAoKFtuYW1lLCBkZWZpbml0aW9uXSkgPT4ge1xuICAgICAgZGVmaW5pdGlvbiA9IERhdGEuaXNQbGFpbk9iamVjdChkZWZpbml0aW9uKVxuICAgICAgICA/IHsgLi4uZGVmaW5pdGlvbiwgdHlwZTogW2RlZmluaXRpb24udHlwZV0uZmxhdCgpIH1cbiAgICAgICAgOiB7IHR5cGU6IFtkZWZpbml0aW9uXS5mbGF0KCkgfTtcbiAgICAgIHJldHVybiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgZGVmaW5pdGlvbl07XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IHt9O1xuICB9XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgLy8gcHJvcE5hbWUg5oiWIHByb3AtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSBfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICAvLyDlj6rljIXlkKtCb29sZWFu57G75Z6L55qEJyfovazmjaLkuLp0cnVl77yM5YW25LuW5Y6f5qC36LWL5YC8XG4gICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gZGVmaW5pdGlvbi50eXBlLmxlbmd0aCA9PT0gMSAmJiBkZWZpbml0aW9uLnR5cGUuaW5jbHVkZXMoQm9vbGVhbikgJiYgYXR0clZhbHVlID09PSAnJyA/IHRydWUgOiBhdHRyVmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIHByb3AtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2V0UmVzdWx0KHsgbmFtZTogX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpLCBkZWZpbml0aW9uLCBlbmQ6IHRydWUgfSk7XG4gICAgfSkoe1xuICAgICAgbmFtZSwgZGVmaW5pdGlvbixcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbi8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+WIGVtaXRzIOWumuS5ieeahOWxnuaAp1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBlbWl0RGVmaW5pdGlvbnMgZW1pdHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuVnVlRGF0YS5nZXRFbWl0c0Zyb21BdHRycyA9IGZ1bmN0aW9uKGF0dHJzLCBlbWl0RGVmaW5pdGlvbnMpIHtcbiAgLy8gZW1pdHMg5a6a5LmJ57uf5LiA5oiQ5pWw57uE5qC85byPXG4gIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZW1pdERlZmluaXRpb25zKSkge1xuICAgIGVtaXREZWZpbml0aW9ucyA9IE9iamVjdC5rZXlzKGVtaXREZWZpbml0aW9ucyk7XG4gIH0gZWxzZSBpZiAoIShlbWl0RGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBlbWl0RGVmaW5pdGlvbnMgPSBbXTtcbiAgfVxuICAvLyDnu5/kuIDlpITnkIbmiJAgb25FbWl0TmFtZeOAgW9uVXBkYXRlOmVtaXROYW1lKHYtbW9kZWzns7vliJcpIOagvOW8j1xuICBjb25zdCBlbWl0TmFtZXMgPSBlbWl0RGVmaW5pdGlvbnMubWFwKG5hbWUgPT4gX1N0cmluZy50b0NhbWVsQ2FzZShgb24tJHtuYW1lfWApKTtcbiAgLy8g6K6+572u5YC8XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIGVtaXROYW1lcykge1xuICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdvblVwZGF0ZTonKSkge1xuICAgICAgICAvLyBvblVwZGF0ZTplbWl0TmFtZSDmiJYgb25VcGRhdGU6ZW1pdC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBhdHRyc1tuYW1lXTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25VcGRhdGU6ZW1pdC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgICBpZiAoZW5kKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNldFJlc3VsdCh7IG5hbWU6IGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShuYW1lLnNsaWNlKG5hbWUuaW5kZXhPZignOicpICsgMSkpfWAsIGVuZDogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICAgIC8vIG9uRW1pdE5hbWXmoLzlvI/vvIzkuK3liJLnur/moLzlvI/lt7Looqt2dWXovazmjaLkuI3nlKjph43lpI3lpITnkIZcbiAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgfVxuICAgIH0pKHsgbmFtZSB9KTtcbiAgfVxuICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPluWJqeS9meWxnuaAp+OAguW4uOeUqOS6jue7hOS7tiBpbmhlcml0QXR0cnMg6K6+572uIGZhbHNlIOaXtuS9v+eUqOS9nOS4uuaWsOeahCBhdHRyc1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wcyDlrprkuYkg5oiWIHZ1ZSBwcm9wc++8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHBhcmFtIGVtaXRzIGVtaXRzIOWumuS5iSDmiJYgdnVlIGVtaXRz77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICAgKiBAcGFyYW0gbGlzdCDpop3lpJbnmoTmma7pgJrlsZ7mgKdcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0UmVzdEZyb21BdHRycyA9IGZ1bmN0aW9uKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAvLyDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgcHJvcHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAocHJvcHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICB9XG4gICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KHByb3BzKSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGFyci5tYXAobmFtZSA9PiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpXSkuZmxhdCgpO1xuICB9KSgpO1xuICBlbWl0cyA9ICgoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gKCgpID0+IHtcbiAgICAgIGlmIChlbWl0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJldHVybiBlbWl0cztcbiAgICAgIH1cbiAgICAgIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZW1pdHMpKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcCgobmFtZSkgPT4ge1xuICAgICAgLy8gdXBkYXRlOmVtaXROYW1lIOaIliB1cGRhdGU6ZW1pdC1uYW1lIOagvOW8j1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgIGNvbnN0IHBhcnROYW1lID0gbmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpO1xuICAgICAgICByZXR1cm4gW2BvblVwZGF0ZToke19TdHJpbmcudG9DYW1lbENhc2UocGFydE5hbWUpfWAsIGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShwYXJ0TmFtZSl9YF07XG4gICAgICB9XG4gICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKV07XG4gICAgfSkuZmxhdCgpO1xuICB9KSgpO1xuICBsaXN0ID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSB0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZydcbiAgICAgID8gbGlzdC5zcGxpdCgnLCcpXG4gICAgICA6IGxpc3QgaW5zdGFuY2VvZiBBcnJheSA/IGxpc3QgOiBbXTtcbiAgICByZXR1cm4gYXJyLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICB9KSgpO1xuICBjb25zdCBsaXN0QWxsID0gQXJyYXkuZnJvbShuZXcgU2V0KFtwcm9wcywgZW1pdHMsIGxpc3RdLmZsYXQoKSkpO1xuICAvLyBjb25zb2xlLmxvZygnbGlzdEFsbCcsIGxpc3RBbGwpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IFtuYW1lLCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhhdHRycykpKSB7XG4gICAgaWYgKCFsaXN0QWxsLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBuYW1lLCBkZXNjKTtcbiAgICB9XG4gIH1cbiAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBQ08sTUFBTSxJQUFJLFNBQVMsR0FBRyxDQUFDO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sWUFBWSxDQUFDLEdBQUcsSUFBSSxFQUFFO0FBQy9CO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUIsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QixLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQ7QUFDQSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBSSxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEtBQUs7QUFDbkMsTUFBTSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0RCxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDeEI7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RDtBQUNBLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxVQUFVLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxHQUFHLFNBQVMsRUFBRTtBQUNoRDtBQUNBLElBQUksSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM5QixNQUFNLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLElB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMzQixFQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUNGLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRCxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFO0FBQy9DLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDL0UsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFO0FBQy9DLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzNELEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUU7QUFDMUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUM3QixJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUMzQixNQUFNLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzdCLEtBQUs7QUFD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
