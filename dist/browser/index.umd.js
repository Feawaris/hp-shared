/*!
 * hp-shared v0.2.1
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"name":"shared","format":"umd","noConflict":true,"sourcemap":"inline"}
 */
  
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global.shared;
    var exports = global.shared = {};
    factory(exports);
    exports.noConflict = function () { global.shared = current; return exports; };
  })());
})(this, (function (exports) { 'use strict';

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

  exports.base = index$4;
  exports.dev = index$3;
  exports.network = index$2;
  exports.storage = index;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudW1kLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9fU2V0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX0FycmF5LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX0RhdGUuanMiLCIuLi8uLi9zcmMvYmFzZS9fTWF0aC5qcyIsIi4uLy4uL3NyYy9iYXNlL19OdW1iZXIuanMiLCIuLi8uLi9zcmMvYmFzZS9fUmVmbGVjdC5qcyIsIi4uLy4uL3NyYy9iYXNlL0RhdGEuanMiLCIuLi8uLi9zcmMvYmFzZS9TdXBwb3J0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX09iamVjdC5qcyIsIi4uLy4uL3NyYy9iYXNlL19TdHJpbmcuanMiLCIuLi8uLi9zcmMvYmFzZS9TdHlsZS5qcyIsIi4uLy4uL3NyYy9iYXNlL1Z1ZURhdGEuanMiLCIuLi8uLi9zcmMvYmFzZS9pbmRleC5qcyIsIi4uLy4uL3NyYy9kZXYvZXNsaW50LmpzIiwiLi4vLi4vc3JjL2Rldi92aXRlLmpzIiwiLi4vLi4vc3JjL25ldHdvcmsvc2hhcmVkLmpzIiwiLi4vLi4vc3JjL3N0b3JhZ2UvYnJvd3Nlci9jbGlwYm9hcmQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vanMtY29va2llQDMuMC41L25vZGVfbW9kdWxlcy9qcy1jb29raWUvZGlzdC9qcy5jb29raWUubWpzIiwiLi4vLi4vc3JjL3N0b3JhZ2UvYnJvd3Nlci9jb29raWUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vaWRiLWtleXZhbEA2LjIuMS9ub2RlX21vZHVsZXMvaWRiLWtleXZhbC9kaXN0L2luZGV4LmpzIiwiLi4vLi4vc3JjL3N0b3JhZ2UvYnJvd3Nlci9zdG9yYWdlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIOmbhuWQiFxuaW1wb3J0IHsgX0FycmF5IH0gZnJvbSAnLi9fQXJyYXknO1xuXG5leHBvcnQgY2xhc3MgX1NldCBleHRlbmRzIFNldCB7XG4gIC8qKlxuICAgKiBb5paw5aKeXSDkuqTpm4ZcbiAgICogQHBhcmFtIHNldHNcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBzdGF0aWMgaW50ZXJzZWN0aW9uKC4uLnNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAoc2V0cy5sZW5ndGggPCAyKSB7XG4gICAgICBzZXRzWzBdID0gc2V0c1swXSB8fCBbXTtcbiAgICAgIHNldHNbMV0gPSBzZXRzWzFdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBzZXRzID0gbmV3IF9BcnJheShzZXRzKS5tYXAoc2V0ID0+IG5ldyBfQXJyYXkoc2V0KSk7XG5cbiAgICBjb25zdCBbZmlyc3QsIC4uLm90aGVyc10gPSBzZXRzO1xuICAgIHJldHVybiBmaXJzdC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gb3RoZXJzLmV2ZXJ5KHNldCA9PiBzZXQuaW5jbHVkZXModmFsdWUpKTtcbiAgICB9KS50b19TZXQoKTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g5bm26ZuGXG4gICAqIEBwYXJhbSBzZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIHVuaW9uKC4uLnNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAoc2V0cy5sZW5ndGggPCAyKSB7XG4gICAgICBzZXRzWzBdID0gc2V0c1swXSB8fCBbXTtcbiAgICAgIHNldHNbMV0gPSBzZXRzWzFdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBzZXRzID0gbmV3IF9BcnJheShzZXRzKS5tYXAoc2V0ID0+IG5ldyBfQXJyYXkoc2V0KSk7XG5cbiAgICByZXR1cm4gc2V0cy5mbGF0KCkudG9fU2V0KCk7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOihpembhlxuICAgKiBAcGFyYW0gbWFpblNldFxuICAgKiBAcGFyYW0gb3RoZXJTZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIGNvbXBsZW1lbnQobWFpblNldCA9IFtdLCAuLi5vdGhlclNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAob3RoZXJTZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIG90aGVyU2V0c1swXSA9IG90aGVyU2V0c1swXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgbWFpblNldCA9IG5ldyBfQXJyYXkobWFpblNldCk7XG4gICAgb3RoZXJTZXRzID0gbmV3IF9BcnJheShvdGhlclNldHMpLm1hcChhcmcgPT4gbmV3IF9BcnJheShhcmcpKTtcbiAgICByZXR1cm4gbWFpblNldC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gb3RoZXJTZXRzLmV2ZXJ5KHNldCA9PiAhc2V0LmluY2x1ZGVzKHZhbHVlKSk7XG4gICAgfSkudG9fU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcbiAgICAvLyBjb25zb2xlLmxvZygnX1NldCBjb25zdHJ1Y3RvcicsIHZhbHVlKTtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBuZXcgU2V0KHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+S8oOWPguaKpemUme+8jOWwhueUn+aIkOepuumbhuWQiCcsIGUpO1xuICAgICAgdmFsdWUgPSBuZXcgU2V0KFtdKTtcbiAgICB9XG4gICAgc3VwZXIodmFsdWUpO1xuXG4gICAgLy8gc2l6ZSBb57un5om/XVxuICB9XG5cbiAgLy8g5pa55rOV5a6a5Yi277ya5Y6f5Z6L5ZCM5ZCN5pa55rOVK+aWsOWinuaWueazleOAgumDqOWIhuWumuWItuaIkOi/lOWbniB0aGlzIOS+v+S6jumTvuW8j+aTjeS9nFxuICAvKipcbiAgICog5L+u5pS5XG4gICAqL1xuICAvLyBb5a6a5Yi2XVxuICBhZGQoLi4udmFsdWVzKSB7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIFNldC5wcm90b3R5cGUuYWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIGRlbGV0ZSguLi52YWx1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgU2V0LnByb3RvdHlwZS5kZWxldGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgY2xlYXIoKSB7XG4gICAgU2V0LnByb3RvdHlwZS5jbGVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOmBjeWOhlxuICAgKi9cbiAgLy8gU3ltYm9sLml0ZXJhdG9yIFvnu6fmib9dXG4gIC8vIGtleXMgW+e7p+aJv11cbiAgLy8gdmFsdWVzIFvnu6fmib9dXG4gIC8vIGVudHJpZXMgW+e7p+aJv11cbiAgLy8gW+WumuWItl1cbiAgZm9yRWFjaCgpIHtcbiAgICBTZXQucHJvdG90eXBlLmZvckVhY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xmib5cbiAgICovXG4gIC8vIGhhcyBb57un5om/XVxuXG4gIC8qKlxuICAgKiDnlJ/miJBcbiAgICovXG4gIC8vIOebtOaOpemAmui/hyB0b19BcnJheSDlkowgdG9fU2V0IOi9rOaNouaTjeS9nOWNs+WPr++8jOaXoOmcgOmHjeWkjeWumuWItlxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vIFvmlrDlop5dXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9TdHJpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBgeyR7dGhpcy50b0FycmF5KCkuam9pbignLCcpfX1gO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiAne30nO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0Jvb2xlYW4ob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZSA+IDA7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvX0FycmF5KCkge1xuICAgIHJldHVybiBuZXcgX0FycmF5KHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvU2V0KCkge1xuICAgIHJldHVybiBuZXcgU2V0KHRoaXMpO1xuICB9XG59XG4iLCIvLyDmlbDnu4RcbmltcG9ydCB7IF9TZXQgfSBmcm9tICcuL19TZXQnO1xuXG5leHBvcnQgY2xhc3MgX0FycmF5IGV4dGVuZHMgQXJyYXkge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyBzdGF0aWMgaXNBcnJheSBb57un5om/XVxuICAvLyBzdGF0aWMgZnJvbSBb57un5om/XVxuICAvLyBzdGF0aWMgb2YgW+e7p+aJv11cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBBcnJheS5mcm9tKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+S8oOWPguaKpemUme+8jOWwhueUn+aIkOepuuaVsOe7hCcsIGUpO1xuICAgICAgdmFsdWUgPSBbXTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgdmFsdWVbMF0gPT09ICdudW1iZXInKSB7XG4gICAgICAvLyDnqIDnlo/mlbDnu4Tpl67popjvvIzlhYjosIMgc3VwZXIg55Sf5oiQIHRoaXMg5ZCO5YaN5L+u5pS5IHRoaXMg5YaF5a65XG4gICAgICBjb25zdCB0ZW1wID0gdmFsdWVbMF07XG4gICAgICB2YWx1ZVswXSA9IHVuZGVmaW5lZDtcbiAgICAgIHN1cGVyKC4uLnZhbHVlKTtcbiAgICAgIHRoaXNbMF0gPSB0ZW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlciguLi52YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gbGVuZ3RoIFvnu6fmib9dXG4gIH1cblxuICAvLyDmlrnms5XlrprliLbvvJrljp/lnovlkIzlkI3mlrnms5Ur5paw5aKe44CC6YOo5YiG5a6a5Yi25oiQ6L+U5ZueIHRoaXMg5L6/5LqO6ZO+5byP5pON5L2cXG4gIC8qKlxuICAgKiDkv67mlLlcbiAgICovXG4gIC8vIFvlrprliLZdXG4gIHB1c2goKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICBwb3AobGVuZ3RoID0gMSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wb3AuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdW5zaGlmdCgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHNoaWZ0KGxlbmd0aCA9IDEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgc3BsaWNlKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5paw5aKeXSDliKDpmaRcbiAgZGVsZXRlKHZhbHVlKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleCh2YWwgPT4gdmFsID09PSB2YWx1ZSk7XG4gICAgdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vIFvmlrDlop5dIOa4heepulxuICBjbGVhcigpIHtcbiAgICB0aGlzLnNwbGljZSgwKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBb5paw5aKeXSDljrvph41cbiAgdW5pcXVlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy50b19TZXQoKS50b19BcnJheSgpO1xuICAgIHRoaXMuY2xlYXIoKS5wdXNoKC4uLnZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyBzb3J0IFvnu6fmib9dXG4gIC8vIFvmlrDlop5dIOmaj+acuuaOkuW6j+aVsOe7hFxuICByYW5kb21Tb3J0KCkge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIFt0aGlzW2ldLCB0aGlzW2pdXSA9IFt0aGlzW2pdLCB0aGlzW2ldXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyByZXZlcnNlIFvnu6fmib9dXG4gIC8vIGZpbGwgW+e7p+aJv11cbiAgLy8gY29weVdpdGhpbiBb57un5om/XVxuXG4gIC8qKlxuICAgKiDpgY3ljoZcbiAgICovXG4gIC8vIFN5bWJvbC5pdGVyYXRvciBb57un5om/XVxuICAvLyBrZXlzIFvnu6fmib9dXG4gIC8vIHZhbHVlcyBb57un5om/XVxuICAvLyBlbnRyaWVzIFvnu6fmib9dXG4gIC8vIFvlrprliLZdXG4gIGZvckVhY2goKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xmib5cbiAgICovXG4gIC8vIGF0IFvnu6fmib9dXG4gIC8vIGZpbmQgW+e7p+aJv11cbiAgLy8gZmluZEluZGV4IFvnu6fmib9dXG4gIC8vIGZpbmRMYXN0IFvnu6fmib9dXG4gIC8vIGZpbmRMYXN0SW5kZXggW+e7p+aJv11cbiAgLy8gaW5jbHVkZXMgW+e7p+aJv11cbiAgLy8gaW5kZXhPZiBb57un5om/XVxuICAvLyBsYXN0SW5kZXhPZiBb57un5om/XVxuICAvLyBzb21lIFvnu6fmib9dXG4gIC8vIGV2ZXJ5IFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIOeUn+aIkFxuICAgKi9cbiAgLy8gbWFwIFvnu6fmib9dXG4gIC8vIGZpbHRlciBb57un5om/XVxuICAvLyByZWR1Y2UgW+e7p+aJv11cbiAgLy8gcmVkdWNlUmlnaHQgW+e7p+aJv11cbiAgLy8gY29uY2F0IFvnu6fmib9dXG4gIC8vIHNsaWNlIFvnu6fmib9dXG4gIC8vIGpvaW4gW+e7p+aJv11cbiAgLy8gZmxhdCBb57un5om/XVxuICAvLyBmbGF0TWFwIFvnu6fmib9dXG4gIC8vIFvlrprliLZdXG4gIHdpdGgoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUud2l0aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9TcGxpY2VkKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLnRvU3BsaWNlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cbiAgLy8gW+WumuWItl1cbiAgdG9Tb3J0ZWQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUudG9Tb3J0ZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvUmV2ZXJzZWQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUudG9SZXZlcnNlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyBb5paw5aKeXVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKGB0b1N0cmluZyDovazmjaLmiqXplJnvvIzlsIbnlJ/miJAgJ1tdJ2AsIGUpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtdKTtcbiAgICB9XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcgW+e7p+aJv11cbiAgLy8gW+aWsOWinl1cbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA+IDA7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBTZXQodGhpcyk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9fU2V0KCkge1xuICAgIHJldHVybiBuZXcgX1NldCh0aGlzKTtcbiAgfVxufVxuIiwiLy8g5pel5pyf5pe26Ze0XG5leHBvcnQgY2xhc3MgX0RhdGUgZXh0ZW5kcyBEYXRlIHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gW+aWsOWinl1cbiAgc3RhdGljIFJFR0VYX1BBUlNFID0gL14oXFxkezR9KVstL10/KFxcZHsxLDJ9KT9bLS9dPyhcXGR7MCwyfSlbVHRcXHNdKihcXGR7MSwyfSk/Oj8oXFxkezEsMn0pPzo/KFxcZHsxLDJ9KT9bLjpdPyhcXGQrKT8kLztcbiAgc3RhdGljIFJFR0VYX0ZPUk1BVCA9IC9cXFsoW15cXF1dKyldfFl7MSw0fXxNezEsNH18RHsxLDJ9fGR7MSw0fXxIezEsMn18aHsxLDJ9fGF8QXxtezEsMn18c3sxLDJ9fFp7MSwyfXxTU1MvZztcbiAgLy8gc3RhdGljIG5vdyBb57un5om/XVxuICAvLyBzdGF0aWMgcGFyc2UgW+e7p+aJv11cbiAgLy8gc3RhdGljIFVUQyBb57un5om/XVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIC8vIGNvbnNvbGUubG9nKCdfRGF0ZSBjb25zdHJ1Y3RvcicsIGFyZ3MpO1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gbnVsbCDlkozmmL7lvI8gdW5kZWZpbmVkIOmDveinhuS4uuaXoOaViOWAvFxuICAgICAgaWYgKGFyZ3NbMF0gPT09IG51bGwpIHtcbiAgICAgICAgYXJnc1swXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZUFsbCgnLScsICcvJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgLy8gW+aWsOWinl1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3llYXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZ1bGxZZWFyKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbW9udGgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1vbnRoKCkgKyAxO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RheScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0ZSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3dlZWsnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERheSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2hvdXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhvdXJzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2hvcnRIb3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBjb25zdCBob3VyID0gdGhpcy5ob3VyO1xuICAgICAgICByZXR1cm4gaG91ciAlIDEyID09PSAwID8gaG91ciA6IGhvdXIgJSAxMjtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtaW51dGUnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1pbnV0ZXMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzZWNvbmQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNlY29uZHMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtaWxsaXNlY29uZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGltZVpvbmVPZmZzZXRIb3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g5qC85byP5YyW5a2X56ym5Liy55So44CC5oC75L2T5ZCMIGVsZW1lbnQg55So55qEIGRheS5qcyDmoLzlvI8oaHR0cHM6Ly9kYXkuanMub3JnL2RvY3MvemgtQ04vZGlzcGxheS9mb3JtYXQp77yM6aOO5qC85a6a5Yi25oiQ5Lit5paHXG4gICAgdGhpcy5mb3JtYXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdZWScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMueWVhci50b1N0cmluZygpLnNsaWNlKC0yKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWVlZWScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMueWVhci50b1N0cmluZygpLnNsaWNlKC00KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnTScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubW9udGgudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnTU0nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1vbnRoLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnRCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuZGF5LnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0REJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5kYXkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdkJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbJ+WRqOaXpScsICflkajkuIAnLCAn5ZGo5LqMJywgJ+WRqOS4iScsICflkajlm5snLCAn5ZGo5LqUJywgJ+WRqOWFrSddWyR0aGlzLndlZWtdO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdkZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWyfmmJ/mnJ/ml6UnLCAn5pif5pyf5LiAJywgJ+aYn+acn+S6jCcsICfmmJ/mnJ/kuIknLCAn5pif5pyf5ZubJywgJ+aYn+acn+S6lCcsICfmmJ/mnJ/lha0nXVskdGhpcy53ZWVrXTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnSCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ci50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdISCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ci50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ2gnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNob3J0SG91ci50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdoaCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2hvcnRIb3VyLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnbScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWludXRlLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ21tJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5taW51dGUudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdzJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zZWNvbmQudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnc3MnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNlY29uZC50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1NTUycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWlsbGlzZWNvbmQudG9TdHJpbmcoKS5wYWRTdGFydCgzLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdhJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5ob3VyIDwgMTIgPyAn5LiK5Y2IJyA6ICfkuIvljYgnO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdBJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdaJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNpZ24gPSAkdGhpcy50aW1lWm9uZU9mZnNldEhvdXIgPCAwID8gJysnIDogJy0nO1xuICAgICAgICByZXR1cm4gYCR7c2lnbn0keygtJHRoaXMudGltZVpvbmVPZmZzZXRIb3VyKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OjAwYDtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWlonLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLloucmVwbGFjZSgnOicsICcnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogW+e7p+aJv10gZ2V0IOezu+WIl+aWueazleOAguS9v+eUqCB5ZWFy44CBbW9udGgg562J6YCa6L+H5paw5aKe5bGe5oCn6I635Y+W5Y2z5Y+v77yM566A5YyW5YaZ5rOV77yM5peg6ZyA6aKd5aSW5a6a5Yi2XG4gICAqL1xuICAvLyBnZXRUaW1lIFvnu6fmib9dXG4gIC8vIGdldFRpbWV6b25lT2Zmc2V0IFvnu6fmib9dXG5cbiAgLy8gZ2V0WWVhciBb57un5om/XVxuICAvLyBnZXRGdWxsWWVhciBb57un5om/XVxuICAvLyBnZXRNb250aCBb57un5om/XVxuICAvLyBnZXREYXRlIFvnu6fmib9dXG4gIC8vIGdldERheSBb57un5om/XVxuICAvLyBnZXRIb3VycyBb57un5om/XVxuICAvLyBnZXRNaW51dGVzIFvnu6fmib9dXG4gIC8vIGdldFNlY29uZHMgW+e7p+aJv11cbiAgLy8gZ2V0TWlsbGlzZWNvbmRzIFvnu6fmib9dXG5cbiAgLy8gZ2V0VVRDRnVsbFllYXIgW+e7p+aJv11cbiAgLy8gZ2V0VVRDTW9udGggW+e7p+aJv11cbiAgLy8gZ2V0VVRDRGF0ZSBb57un5om/XVxuICAvLyBnZXRVVENEYXkgW+e7p+aJv11cbiAgLy8gZ2V0VVRDSG91cnMgW+e7p+aJv11cbiAgLy8gZ2V0VVRDTWludXRlcyBb57un5om/XVxuICAvLyBnZXRVVENTZWNvbmRzIFvnu6fmib9dXG4gIC8vIGdldFVUQ01pbGxpc2Vjb25kcyBb57un5om/XVxuXG4gIC8qKlxuICAgKiBb5a6a5Yi2XSBzZXQg57O75YiX5pa55rOV44CC5a6a5Yi25oiQ6L+U5ZueIHRoaXMg5L6/5LqO6ZO+5byP5pON5L2cXG4gICAqL1xuICBzZXRUaW1lKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFRpbWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFllYXIoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0WWVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldEZ1bGxZZWFyKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldEZ1bGxZZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0TW9udGgoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0TW9udGguYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXREYXRlKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldERhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRIb3VycygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRIb3Vycy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldE1pbnV0ZXMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0TWludXRlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFNlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0U2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldE1pbGxpc2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRNaWxsaXNlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFVUQ0Z1bGxZZWFyKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ0Z1bGxZZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDTW9udGgoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDTW9udGguYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENEYXRlKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ0RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENIb3VycygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENIb3Vycy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ01pbnV0ZXMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDTWludXRlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ1NlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDU2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ01pbGxpc2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENNaWxsaXNlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vIFvmlrDlop5dXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpbWUoKTtcbiAgfVxuICAvLyBb5a6a5Yi2XVxuICB0b1N0cmluZyhmb3JtYXQgPSAnWVlZWS1NTS1ERCBoaDptbTpzcycpIHtcbiAgICBpZiAoIXRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlQWxsKHRoaXMuY29uc3RydWN0b3IuUkVHRVhfRk9STUFULCAobWF0Y2gsICQxKSA9PiB7XG4gICAgICAvLyBbXSDph4zpnaLnmoTlhoXlrrnljp/moLfovpPlh7pcbiAgICAgIGlmICgkMSkge1xuICAgICAgICByZXR1cm4gJDE7XG4gICAgICB9XG4gICAgICAvLyDmoLzlvI9cbiAgICAgIGlmIChtYXRjaCBpbiB0aGlzLmZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRbbWF0Y2hdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvRGF0ZVN0cmluZyhmb3JtYXQgPSAnWVlZWS1NTS1ERCcpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZyhmb3JtYXQpO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvVGltZVN0cmluZyhmb3JtYXQgPSAnSEg6bW06c3MnKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoZm9ybWF0KTtcbiAgfVxuICAvLyB0b0xvY2FsZVN0cmluZyBb57un5om/XVxuICAvLyB0b0xvY2FsZURhdGVTdHJpbmcgW+e7p+aJv11cbiAgLy8gdG9Mb2NhbGVUaW1lU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvSVNPU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvVVRDU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvR01UU3RyaW5nIFvnu6fmib9dXG4gIC8vIFvmlrDlop5dXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gIU51bWJlci5pc05hTih0aGlzLmdldFRpbWUoKSk7XG4gIH1cbiAgLy8gW+aWsOWinl1cbiAgdG9KU09OKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cbiAgLy8gdmFsdWVPZiBb57un5om/XVxufVxuIiwiLy8g5pWw5a2m6L+Q566X44CC5a+5IE1hdGgg5a+56LGh5omp5bGV77yM5o+Q5L6b5pu055u06KeC5ZKM56ym5ZCI5pWw5a2m57qm5a6a55qE5ZCN56ewXG5pbXBvcnQgeyBfQXJyYXkgfSBmcm9tICcuL19BcnJheSc7XG5pbXBvcnQgeyBfU2V0IH0gZnJvbSAnLi9fU2V0JztcbmV4cG9ydCBjb25zdCBfTWF0aCA9IE9iamVjdC5jcmVhdGUoTWF0aCk7XG5cbi8vIOW4uOmHj1xuLy8gRSBb57un5om/XVxuLy8gTE4yIFvnu6fmib9dXG4vLyBMTjEwIFvnu6fmib9dXG4vLyBMT0cyRSBb57un5om/XVxuLy8gTE9HMTBFIFvnu6fmib9dXG4vLyBQSSBb57un5om/XVxuLy8gU1FSVDFfMiBb57un5om/XVxuLy8gU1FSVDIgW+e7p+aJv11cbi8vIOm7hOmHkeWIhuWJsuavlCBQSElcbl9NYXRoLlBISSA9IChNYXRoLnNxcnQoNSkgLSAxKSAvIDI7XG5fTWF0aC5QSElfQklHID0gKE1hdGguc3FydCg1KSArIDEpIC8gMjtcblxuLy8g5bi46KeEXG4vLyBhYnMgW+e7p+aJv11cbi8vIG1pbiBb57un5om/XVxuLy8gbWF4IFvnu6fmib9dXG4vLyByYW5kb20gW+e7p+aJv11cbi8vIHNpZ24gW+e7p+aJv11cbi8vIGh5cG90IFvnu6fmib9dXG4vLyBjbHozMiBb57un5om/XVxuLy8gaW11bCBb57un5om/XVxuLy8gZnJvdW5kIFvnu6fmib9dXG5cbi8vIOWPluaVtFxuLy8gY2VpbCBb57un5om/XVxuLy8gZmxvb3IgW+e7p+aJv11cbi8vIHJvdW5kIFvnu6fmib9dXG4vLyB0cnVuYyBb57un5om/XVxuXG4vLyDkuInop5Llh73mlbBcbi8vIHNpbiBb57un5om/XVxuLy8gY29zIFvnu6fmib9dXG4vLyB0YW4gW+e7p+aJv11cbi8vIGFzaW4gW+e7p+aJv11cbi8vIGFjb3MgW+e7p+aJv11cbi8vIGF0YW4gW+e7p+aJv11cbi8vIHNpbmggW+e7p+aJv11cbi8vIGNvc2ggW+e7p+aJv11cbi8vIHRhbmggW+e7p+aJv11cbi8vIGFzaW5oIFvnu6fmib9dXG4vLyBhY29zaCBb57un5om/XVxuLy8gYXRhbmggW+e7p+aJv11cbi8vIGF0YW4yIFvnu6fmib9dXG4vLyBb5paw5aKeXVxuX01hdGguYXJjc2luID0gTWF0aC5hc2luLmJpbmQoTWF0aCk7XG5fTWF0aC5hcmNjb3MgPSBNYXRoLmFjb3MuYmluZChNYXRoKTtcbl9NYXRoLmFyY3RhbiA9IE1hdGguYXRhbi5iaW5kKE1hdGgpO1xuX01hdGguYXJzaW5oID0gTWF0aC5hc2luaC5iaW5kKE1hdGgpO1xuX01hdGguYXJjb3NoID0gTWF0aC5hY29zaC5iaW5kKE1hdGgpO1xuX01hdGguYXJ0YW5oID0gTWF0aC5hdGFuaC5iaW5kKE1hdGgpO1xuXG4vLyDlr7nmlbBcbi8vIGxvZzIgW+e7p+aJv11cbi8vIGxvZzEwIFvnu6fmib9dXG4vLyBsb2cxcCBb57un5om/XVxuLy8gW+WumuWItl1cbl9NYXRoLmxvZyA9IGZ1bmN0aW9uKGEsIHgpIHtcbiAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coYSk7XG59O1xuX01hdGgubG9nZSA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG5fTWF0aC5sbiA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG5fTWF0aC5sZyA9IE1hdGgubG9nMTAuYmluZChNYXRoKTtcblxuLy8g5oyH5pWwXG4vLyBwb3cgW+e7p+aJv11cbi8vIHNxcnQgW+e7p+aJv11cbi8vIGNicnQgW+e7p+aJv11cbi8vIGV4cCBb57un5om/XVxuLy8gZXhwbTEgW+e7p+aJv11cblxuLy8g6Zi25LmYXG5fTWF0aC5mYWN0b3JpYWwgPSBmdW5jdGlvbihuKSB7XG4gIGxldCByZXN1bHQgPSAxbjtcbiAgZm9yIChsZXQgaSA9IG47IGkgPj0gMTsgaS0tKSB7XG4gICAgcmVzdWx0ICo9IEJpZ0ludChpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbi8vIOaOkuWIlyBBcnJhbmdlbWVudFxuX01hdGguQSA9IGZ1bmN0aW9uKG4sIG0pIHtcbiAgcmV0dXJuIF9NYXRoLmZhY3RvcmlhbChuKSAvIF9NYXRoLmZhY3RvcmlhbChuIC0gbSk7XG59O1xuX01hdGguQXJyYW5nZW1lbnQgPSBfTWF0aC5BO1xuLy8g57uE5ZCIIENvbWJpbmF0aW9uXG5fTWF0aC5DID0gZnVuY3Rpb24obiwgbSkge1xuICByZXR1cm4gX01hdGguQShuLCBtKSAvIF9NYXRoLmZhY3RvcmlhbChtKTtcbn07XG5fTWF0aC5Db21iaW5hdGlvbiA9IF9NYXRoLkM7XG5cbi8vIOaVsOWIl1xuX01hdGguU2VxdWVuY2UgPSBjbGFzcyB7XG4gIC8vIOeUn+aIkOaVsOaNruaWueazlVxuICB0b0FycmF5KGxlbmd0aCA9IHRoaXMubikge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuID0gaSArIDE7XG4gICAgICBhcnJbaV0gPSB0aGlzLmFuKG4pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIHRvX0FycmF5KCkge1xuICAgIHJldHVybiBuZXcgX0FycmF5KHRoaXMudG9BcnJheSguLi5hcmd1bWVudHMpKTtcbiAgfVxuICB0b1NldCgpIHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzLnRvQXJyYXkoLi4uYXJndW1lbnRzKSk7XG4gIH1cbiAgdG9fU2V0KCkge1xuICAgIHJldHVybiBuZXcgX1NldCh0aGlzLnRvQXJyYXkoLi4uYXJndW1lbnRzKSk7XG4gIH1cbn07XG4vLyDnrYnlt67mlbDliJdcbl9NYXRoLkFyaXRobWV0aWNTZXF1ZW5jZSA9IGNsYXNzIGV4dGVuZHMgX01hdGguU2VxdWVuY2Uge1xuICBjb25zdHJ1Y3RvcihhMSwgZCwgbiA9IDApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYTEgPSBhMTsgLy8g6aaW6aG5XG4gICAgdGhpcy5kID0gZDsgLy8g5YWs5beuXG4gICAgdGhpcy5uID0gbjsgLy8g6buY6K6k6aG55pWw77yM5Y+v55So5LqO5pa55rOV55qE5Lyg5Y+C566A5YyWXG4gIH1cbiAgLy8g56ysbumhuVxuICBhbihuID0gdGhpcy5uKSB7XG4gICAgcmV0dXJuIHRoaXMuYTEgKyAobiAtIDEpICogdGhpcy5kO1xuICB9XG4gIC8vIOWJjW7pobnmsYLlkoxcbiAgU24obiA9IHRoaXMubikge1xuICAgIHJldHVybiBuIC8gMiAqICh0aGlzLmExICsgdGhpcy5hbihuKSk7XG4gIH1cbn07XG4vLyDnrYnmr5TmlbDliJdcbl9NYXRoLkdlb21ldHJpY1NlcXVlbmNlID0gY2xhc3MgZXh0ZW5kcyBfTWF0aC5TZXF1ZW5jZSB7XG4gIGNvbnN0cnVjdG9yKGExLCBxLCBuID0gMCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hMSA9IGExOyAvLyDpppbpoblcbiAgICB0aGlzLnEgPSBxOyAvLyDlhazmr5RcbiAgICB0aGlzLm4gPSBuOyAvLyDpu5jorqTpobnmlbDvvIzlj6/nlKjkuo7mlrnms5XnmoTkvKDlj4LnroDljJZcbiAgfVxuICAvLyDnrKxu6aG5XG4gIGFuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gdGhpcy5hMSAqIHRoaXMucSAqKiAobiAtIDEpO1xuICB9XG4gIC8vIOWJjW7pobnmsYLlkoxcbiAgU24obiA9IHRoaXMubikge1xuICAgIGlmICh0aGlzLnEgPT09IDEpIHtcbiAgICAgIHJldHVybiBuICogdGhpcy5hMTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYTEgKiAoMSAtIHRoaXMucSAqKiBuKSAvICgxIC0gdGhpcy5xKTtcbiAgfVxufTtcbi8vIOaWkOazoumCo+WlkeaVsOWIl1xuX01hdGguRmlib25hY2NpU2VxdWVuY2UgPSBjbGFzcyBleHRlbmRzIF9NYXRoLlNlcXVlbmNlIHtcbiAgY29uc3RydWN0b3IobiA9IDApIHtcbiAgICBzdXBlcigpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnYTEnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuKDEpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLm4gPSBuOyAvLyDpu5jorqTpobnmlbDvvIzlj6/nlKjkuo7mlrnms5XnmoTkvKDlj4LnroDljJZcbiAgfVxuICAvLyDnrKxu6aG5XG4gIGFuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgoX01hdGguUEhJX0JJRyAqKiBuIC0gKDEgLSBfTWF0aC5QSElfQklHKSAqKiBuKSAvIE1hdGguc3FydCg1KSk7XG4gIH1cbiAgLy8g5YmNbumhueaxguWSjFxuICBTbihuID0gdGhpcy5uKSB7XG4gICAgcmV0dXJuIHRoaXMuYW4obiArIDIpIC0gMTtcbiAgfVxufTtcbi8vIOe0oOaVsOaVsOWIl1xuX01hdGguUHJpbWVTZXF1ZW5jZSA9IGNsYXNzIGV4dGVuZHMgX01hdGguU2VxdWVuY2Uge1xuICAvLyDmmK/lkKbntKDmlbBcbiAgc3RhdGljIGlzUHJpbWUoeCkge1xuICAgIGlmICh4IDw9IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDI7IGkgPD0gTWF0aC5zcXJ0KHgpOyBpKyspIHtcbiAgICAgIGlmICh4ICUgaSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8vIOWIm+W7uue0oOaVsOWIl+ihqFxuICBzdGF0aWMgY3JlYXRlTGlzdChhMSwgbikge1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBsZXQgdmFsdWUgPSBhMTtcbiAgICB3aGlsZSAocmVzdWx0Lmxlbmd0aCA8IG4pIHtcbiAgICAgIGlmICh0aGlzLmlzUHJpbWUodmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHZhbHVlKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhMSA9IDIsIG4gPSAwKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5jb25zdHJ1Y3Rvci5jcmVhdGVMaXN0KGExLCBuKTtcbiAgICB0aGlzLmExID0gYTE7XG4gICAgdGhpcy5uID0gbjsgLy8g6buY6K6k6aG55pWw77yM5Y+v55So5LqO5pa55rOV55qE5Lyg5Y+C566A5YyWXG4gIH1cblxuICBhbihuID0gdGhpcy5uKSB7XG4gICAgaWYgKG4gPD0gdGhpcy5uKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVtuIC0gMV07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmNyZWF0ZUxpc3QodGhpcy5hMSwgbilbbiAtIDFdO1xuICB9XG4gIFNuKG4gPSB0aGlzLm4pIHtcbiAgICByZXR1cm4gdGhpcy50b0FycmF5KG4pLnJlZHVjZSgodG90YWwsIHZhbCkgPT4gdG90YWwgKyB2YWwsIDApO1xuICB9XG59O1xuIiwiLy8g5pWw5a2XXG5leHBvcnQgY2xhc3MgX051bWJlciBleHRlbmRzIE51bWJlciB7XG4gIC8qKlxuICAgKiBzdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBOYU4gW+e7p+aJv11cbiAgLy8gc3RhdGljIFBPU0lUSVZFX0lORklOSVRZIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBORUdBVElWRV9JTkZJTklUWSBb57un5om/XVxuICAvLyBzdGF0aWMgTUFYX1ZBTFVFIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBNSU5fVkFMVUUgW+e7p+aJv11cbiAgLy8gc3RhdGljIE1BWF9TQUZFX0lOVEVHRVIgW+e7p+aJv11cbiAgLy8gc3RhdGljIE1JTl9TQUZFX0lOVEVHRVIgW+e7p+aJv11cbiAgLy8gc3RhdGljIEVQU0lMT04gW+e7p+aJv11cblxuICAvLyBzdGF0aWMgaXNOYU4gW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzRmluaXRlIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc0ludGVnZXIgW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzU2FmZUludGVnZXIgW+e7p+aJv11cbiAgLy8gc3RhdGljIHBhcnNlSW50IFvnu6fmib9dXG4gIC8vIHN0YXRpYyBwYXJzZUZsb2F0IFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHZhbHVlID0gTnVtYmVyLnBhcnNlRmxvYXQodmFsdWUpO1xuICAgIHN1cGVyKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlJ/miJBcbiAgICovXG4gIC8vIFvmlrDlop5dIOi/lOWbnuaWsOWAvO+8jOaWueS+v+i1i+WAvOWmgiBudW0gPSBudW0ubmV3KHZhbHVlKSDlhpnms5VcbiAgbmV3KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyB0b1ByZWNpc2lvbiBb57un5om/XVxuICAvLyB0b0ZpeGVkIFvnu6fmib9dXG4gIC8vIFvmlrDlop5dIOWMuuWIq+S6jiB0b0ZpeGVk77yM5Lya56e76Zmk5aSa5L2Z55qEIDAg5Lul57K+566A5pi+56S6XG4gIHRvTWF4Rml4ZWQoZnJhY3Rpb25EaWdpdHMgPSAwKSB7XG4gICAgY29uc3Qgc3RyID0gTnVtYmVyLnByb3RvdHlwZS50b0ZpeGVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIE51bWJlci5wYXJzZUZsb2F0KHN0cikudG9TdHJpbmcoKTtcbiAgfVxuICAvLyB0b0V4cG9uZW50aWFsIFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gW+aWsOWinl1cbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGNvbnNvbGUubG9nKCdfTnVtYmVyIFN5bWJvbC50b1ByaW1pdGl2ZScsIHsgaGludCB9KTtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgfVxuICAvLyB2YWx1ZU9mIFvnu6fmib9dXG4gIC8vIHRvU3RyaW5nIFvnu6fmib9dXG4gIC8vIHRvTG9jYWxlU3RyaW5nIFvnu6fmib9dXG4gIC8vIFvmlrDlop5dXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gIU51bWJlci5pc05hTih0aGlzKTtcbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgX1JlZmxlY3QgPSBPYmplY3QuY3JlYXRlKFJlZmxlY3QpO1xuXG4vLyBhcHBseSDnu6fmib9cbi8vIGNvbnN0cnVjdCDnu6fmib9cbi8vIGRlZmluZVByb3BlcnR5IOe7p+aJv1xuLy8gZGVsZXRlUHJvcGVydHkg57un5om/XG4vLyBnZXQg57un5om/XG4vLyBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ig57un5om/XG4vLyBnZXRQcm90b3R5cGVPZiDnu6fmib9cbi8vIG93bktleXMg57un5om/XG4vLyBzZXQg57un5om/XG4vLyBzZXRQcm90b3R5cGVPZiDnu6fmib9cbi8vIHByZXZlbnRFeHRlbnNpb25zIOe7p+aJv1xuLy8gaGFzIOe7p+aJv1xuLy8gaXNFeHRlbnNpYmxlIOe7p+aJv1xuXG4vLyDlr7kgb3duS2V5cyDphY3lpZcgb3duVmFsdWVzIOWSjCBvd25FbnRyaWVzXG5fUmVmbGVjdC5vd25WYWx1ZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xufTtcbl9SZWZsZWN0Lm93bkVudHJpZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gW2tleSwgdGFyZ2V0W2tleV1dKTtcbn07XG4iLCIvLyDmlbDmja7lpITnkIbvvIzlpITnkIblpJrmoLzlvI/mlbDmja7nlKhcbmV4cG9ydCBjb25zdCBEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbi8qKlxuICog5LyY5YyWIHR5cGVvZlxuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7J3VuZGVmaW5lZCd8J29iamVjdCd8J2Jvb2xlYW4nfCdudW1iZXInfCdzdHJpbmcnfCdmdW5jdGlvbid8J3N5bWJvbCd8J2JpZ2ludCd8c3RyaW5nfVxuICovXG5EYXRhLnR5cGVvZiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbn07XG4vKipcbiAqIOWIpOaWreeugOWNleexu+Wei1xuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGF0YS5pc1NpbXBsZVR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gWydudWxsJywgJ3VuZGVmaW5lZCcsICdudW1iZXInLCAnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnYmlnaW50JywgJ3N5bWJvbCddLmluY2x1ZGVzKHRoaXMudHlwZW9mKHZhbHVlKSk7XG59O1xuLyoqXG4gKiDmmK/lkKbmma7pgJrlr7nosaFcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkRhdGEuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59O1xuLyoqXG4gKiDojrflj5blgLznmoTlhbfkvZPnsbvlnotcbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEByZXR1cm5zIHtPYmplY3RDb25zdHJ1Y3RvcnwqfEZ1bmN0aW9ufSDov5Tlm57lr7nlupTmnoTpgKDlh73mlbDjgIJudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICovXG5EYXRhLmdldEV4YWN0VHlwZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgLy8gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGh5pe2IF9fcHJvdG9fXyDkuLogbnVsbFxuICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDlr7nlupTnu6fmib/nmoTlr7nosaEgX19wcm90b19fIOayoeaciSBjb25zdHJ1Y3RvciDlsZ7mgKdcbiAgY29uc3QgaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gISgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXyk7XG4gIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDov5Tlm57lr7nlupTmnoTpgKDlh73mlbBcbiAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3Rvcjtcbn07XG4vKipcbiAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei+WIl+ihqFxuICogQHBhcmFtIHZhbHVlIOWAvFxuICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gKi9cbkRhdGEuZ2V0RXhhY3RUeXBlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Yik5pat5aSE55CGXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gW3ZhbHVlXTtcbiAgfVxuICAvLyDmiavljp/lnovpk77lvpfliLDlr7nlupTmnoTpgKDlh73mlbBcbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBsZXQgbG9vcCA9IDA7XG4gIGxldCBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gZmFsc2U7XG4gIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIGNvbnNvbGUud2Fybignd2hpbGUnLCBsb29wLCBfX3Byb3RvX18pO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIC8vIOS4gOi/m+adpSBfX3Byb3RvX18g5bCx5pivIG51bGwg6K+05piOIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoVxuICAgICAgaWYgKGxvb3AgPD0gMCkge1xuICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKSB7XG4gICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgfVxuICAgIF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihfX3Byb3RvX18pO1xuICAgIGxvb3ArKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiDmt7Hmi7fotJ3mlbDmja5cbiAqIEBwYXJhbSBzb3VyY2VcbiAqIEByZXR1cm5zIHtNYXA8YW55LCBhbnk+fFNldDxhbnk+fHt9fCp8KltdfVxuICovXG5EYXRhLmRlZXBDbG9uZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAvLyDmlbDnu4RcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIFNldFxuICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgIHJlc3VsdC5hZGQodGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBNYXBcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHNvdXJjZS5lbnRyaWVzKCkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCB0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOWvueixoVxuICBpZiAodGhpcy5nZXRFeGFjdFR5cGUoc291cmNlKSA9PT0gT2JqZWN0KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgLy8gdmFsdWXmlrnlvI/vvJrpgJLlvZLlpITnkIZcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQ2xvbmUoZGVzYy52YWx1ZSksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0L3NldCDmlrnlvI/vvJrnm7TmjqXlrprkuYlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlhbbku5bvvJrljp/moLfov5Tlm55cbiAgcmV0dXJuIHNvdXJjZTtcbn07XG4vKipcbiAqIOa3seino+WMheaVsOaNrlxuICogQHBhcmFtIGRhdGEg5YC8XG4gKiBAcGFyYW0gaXNXcmFwIOWMheijheaVsOaNruWIpOaWreWHveaVsO+8jOWmgiB2dWUzIOeahCBpc1JlZiDlh73mlbBcbiAqIEBwYXJhbSB1bndyYXAg6Kej5YyF5pa55byP5Ye95pWw77yM5aaCIHZ1ZTMg55qEIHVucmVmIOWHveaVsFxuICogQHJldHVybnMge3tbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fCp8KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfHtbcDogc3RyaW5nXTogYW55fX1cbiAqL1xuRGF0YS5kZWVwVW53cmFwID0gZnVuY3Rpb24oZGF0YSwgeyBpc1dyYXAgPSAoKSA9PiBmYWxzZSwgdW53cmFwID0gdmFsID0+IHZhbCB9ID0ge30pIHtcbiAgLy8g6YCJ6aG55pS26ZuGXG4gIGNvbnN0IG9wdGlvbnMgPSB7IGlzV3JhcCwgdW53cmFwIH07XG4gIC8vIOWMheijheexu+Wei++8iOWmgnZ1ZTPlk43lupTlvI/lr7nosaHvvInmlbDmja7op6PljIVcbiAgaWYgKGlzV3JhcChkYXRhKSkge1xuICAgIHJldHVybiB0aGlzLmRlZXBVbndyYXAodW53cmFwKGRhdGEpLCBvcHRpb25zKTtcbiAgfVxuICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBkYXRhLm1hcCh2YWwgPT4gdGhpcy5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucykpO1xuICB9XG4gIGlmICh0aGlzLmdldEV4YWN0VHlwZShkYXRhKSA9PT0gT2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhkYXRhKS5tYXAoKFtrZXksIHZhbF0pID0+IHtcbiAgICAgIHJldHVybiBba2V5LCB0aGlzLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgfSkpO1xuICB9XG4gIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIvLyDovoXliqlcbmV4cG9ydCBjb25zdCBTdXBwb3J0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiDlsZ7mgKflkI3nu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAqIEBwYXJhbSBuYW1lcyDlsZ7mgKflkI3jgILmoLzlvI8gJ2EsYixjJyDmiJYgWydhJywnYicsJ2MnXVxuICogQHBhcmFtIHNlcGFyYXRvciBuYW1lcyDkuLrlrZfnrKbkuLLml7bnmoTmi4bliIbop4TliJnjgILlkIwgc3BsaXQg5pa55rOV55qEIHNlcGFyYXRvcu+8jOWtl+espuS4suaXoOmcgOaLhuWIhueahOWPr+S7peS8oCBudWxsIOaIliB1bmRlZmluZWRcbiAqIEByZXR1cm5zIHsqW11bXXwoTWFnaWNTdHJpbmcgfCBCdW5kbGUgfCBzdHJpbmcpW118RmxhdEFycmF5PChGbGF0QXJyYXk8KCp8WypbXV18W10pW10sIDE+W118KnxbKltdXXxbXSlbXSwgMT5bXXwqW119XG4gKi9cblN1cHBvcnQubmFtZXNUb0FycmF5ID0gZnVuY3Rpb24obmFtZXMgPSBbXSwgeyBzZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSB7XG4gIGlmIChuYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIG5hbWVzLm1hcCh2YWwgPT4gdGhpcy5uYW1lc1RvQXJyYXkodmFsKSkuZmxhdCgpO1xuICB9XG4gIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5hbWVzLnNwbGl0KHNlcGFyYXRvcikubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N5bWJvbCcpIHtcbiAgICByZXR1cm4gW25hbWVzXTtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG4vKipcbiAqIOe7keWumnRoaXPjgILluLjnlKjkuo7op6PmnoTlh73mlbDml7bnu5HlrpogdGhpcyDpgb/lhY3miqXplJlcbiAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAqIEByZXR1cm5zIHsqfVxuICovXG5TdXBwb3J0LmJpbmRUaGlzID0gZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIHtcbiAgICBnZXQodGFyZ2V0LCBwLCByZWNlaXZlcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBSZWZsZWN0LmdldCguLi5hcmd1bWVudHMpO1xuICAgICAgLy8g5Ye95pWw57G75Z6L57uR5a6adGhpc1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmJpbmQodGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWxnuaAp+WOn+agt+i/lOWbnlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gIH0pO1xufTtcbiIsIi8vIOWvueixoVxuaW1wb3J0IHsgX1JlZmxlY3QgfSBmcm9tICcuL19SZWZsZWN0JztcbmltcG9ydCB7IERhdGEgfSBmcm9tICcuL0RhdGEnO1xuaW1wb3J0IHsgU3VwcG9ydCB9IGZyb20gJy4vU3VwcG9ydCc7XG5cbi8vIGV4dGVuZHMgT2JqZWN0IOaWueW8j+iwg+eUqCBzdXBlciDlsIbnlJ/miJDnqbrlr7nosaHvvIzkuI3kvJrlg4/mma7pgJrmnoTpgKDlh73mlbDpgqPmoLfliJvlu7rkuIDkuKrmlrDnmoTlr7nosaHvvIzmlLnlrp7njrBcbmV4cG9ydCBjbGFzcyBfT2JqZWN0IHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGNyZWF0ZSBb57un5om/XVxuICAvLyBzdGF0aWMgZnJvbUVudHJpZXMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGdldFByb3RvdHlwZU9mIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBzZXRQcm90b3R5cGVPZiBb57un5om/XVxuICAvLyBzdGF0aWMgZGVmaW5lUHJvcGVydHkgW+e7p+aJv11cbiAgLy8gc3RhdGljIGRlZmluZVByb3BlcnRpZXMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGhhc093biBb57un5om/XVxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eU5hbWVzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgW+e7p+aJv11cbiAgLy8gc3RhdGljIGlzIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBwcmV2ZW50RXh0ZW5zaW9ucyBb57un5om/XVxuICAvLyBzdGF0aWMgaXNFeHRlbnNpYmxlIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBzZWFsIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc1NlYWxlZCBb57un5om/XVxuICAvLyBzdGF0aWMgZnJlZXplIFvnu6fmib9dXG4gIC8vIHN0YXRpYyBpc0Zyb3plbiBb57un5om/XVxuXG4gIC8qKlxuICAgKiBb5a6a5Yi2XSDmtYXlkIjlubblr7nosaHjgILlhpnms5XlkIwgT2JqZWN0LmFzc2lnbu+8jOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICAgKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIC8vIOS4jeS9v+eUqCB0YXJnZXRba2V5XSA9IHZhbHVlIOWGmeazle+8jOebtOaOpeS9v+eUqCBPYmplY3QuZGVmaW5lUHJvcGVydHkg6YeN5a6a5LmJXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOa3seWQiOW5tuWvueixoeOAguWQjCBhc3NpZ24g5LiA5qC35Lmf5Lya5a+55bGe5oCn6L+b6KGM6YeN5a6a5LmJXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gICAqIEBwYXJhbSBzb3VyY2VzIOaVsOaNrua6kFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZGVlcEFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXNzaWduKHt9LCAuLi5zb3VyY2VzKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgICAgLy8gdmFsdWUg5YaZ5rOV77ya5a+56LGh6YCS5b2S5aSE55CG77yM5YW25LuW55u05o6l5a6a5LmJXG4gICAgICAgICAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChkZXNjLnZhbHVlKSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCB7XG4gICAgICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmRlZXBBc3NpZ24odGFyZ2V0W2tleV0sIGRlc2MudmFsdWUpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGdldC9zZXQg5YaZ5rOV77ya55u05o6l5a6a5LmJXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFvlrprliLZdIOiOt+WPluWxnuaAp+WQjeOAgum7mOiupOWPguaVsOmFjee9ruaIkOWQjCBPYmplY3Qua2V5cyDooYzkuLpcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge2FueVtdfVxuICAgKi9cbiAgc3RhdGljIGtleXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgLy8gc2V055So5LqOa2V55Y676YeNXG4gICAgbGV0IHNldCA9IG5ldyBTZXQoKTtcbiAgICAvLyDoh6rouqvlsZ7mgKfnrZvpgIlcbiAgICBjb25zdCBkZXNjcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCk7XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBfUmVmbGVjdC5vd25FbnRyaWVzKGRlc2NzKSkge1xuICAgICAgLy8g5b+955Wlc3ltYm9s5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIXN5bWJvbCAmJiB0eXBlb2Yga2V5ID09PSAnc3ltYm9sJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOW/veeVpeS4jeWPr+WIl+S4vuWxnuaAp+eahOaDheWGtVxuICAgICAgaWYgKCFub3RFbnVtZXJhYmxlICYmICFkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blsZ7mgKfliqDlhaVcbiAgICAgIHNldC5hZGQoa2V5KTtcbiAgICB9XG4gICAgLy8g57un5om/5bGe5oCnXG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgICBpZiAoX19wcm90b19fICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudEtleXMgPSB0aGlzLmtleXMoX19wcm90b19fLCBvcHRpb25zKTtcbiAgICAgICAgZm9yIChjb25zdCBwYXJlbnRLZXkgb2YgcGFyZW50S2V5cykge1xuICAgICAgICAgIHNldC5hZGQocGFyZW50S2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyDov5Tlm57mlbDnu4RcbiAgICByZXR1cm4gQXJyYXkuZnJvbShzZXQpO1xuICB9XG4gIC8qKlxuICAgKiBb5a6a5Yi2XVxuICAgKi9cbiAgc3RhdGljIHZhbHVlcygpIHtcbiAgfVxuICAvKipcbiAgICogW+WumuWItl1cbiAgICovXG4gIHN0YXRpYyBlbnRyaWVzKCkge1xuICB9XG5cbiAgLyoqXG4gICAqIFvmlrDlop5dIGtleeiHqui6q+aJgOWxnueahOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5IOWxnuaAp+WQjVxuICAgKiBAcmV0dXJucyB7KnxudWxsfVxuICAgKi9cbiAgc3RhdGljIG93bmVyKG9iamVjdCwga2V5KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3duZXIoX19wcm90b19fLCBrZXkpO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDojrflj5blsZ7mgKfmj4/ov7Dlr7nosaHvvIznm7jmr5QgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcu+8jOiDveaLv+WIsOe7p+aJv+WxnuaAp+eahOaPj+i/sOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0XG4gICAqIEBwYXJhbSBrZXlcbiAgICogQHJldHVybnMge3VuZGVmaW5lZHxQcm9wZXJ0eURlc2NyaXB0b3J9XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvcihvYmplY3QsIGtleSkge1xuICAgIGNvbnN0IGZpbmRPYmplY3QgPSB0aGlzLm93bmVyKG9iamVjdCwga2V5KTtcbiAgICBpZiAoIWZpbmRPYmplY3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZpbmRPYmplY3QsIGtleSk7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOWvueW6lCBrZXlzIOiOt+WPliBkZXNjcmlwdG9yc++8jOS8oOWPguWQjCBrZXlzIOaWueazleOAguWPr+eUqOS6jumHjeWumuS5ieWxnuaAp1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7KFByb3BlcnR5RGVzY3JpcHRvcnx1bmRlZmluZWQpW119XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvcnMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3QgX2tleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2tleXMubWFwKGtleSA9PiB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpKTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3JFbnRyaWVz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHtbKiwoUHJvcGVydHlEZXNjcmlwdG9yfHVuZGVmaW5lZCldW119XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvckVudHJpZXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3QgX2tleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2tleXMubWFwKGtleSA9PiBba2V5LCB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpXSk7XG4gIH1cblxuICAvKipcbiAgICogW+aWsOWinl0g6L+H5ruk5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBwaWNrIOaMkemAieWxnuaAp1xuICAgKiBAcGFyYW0gb21pdCDlv73nlaXlsZ7mgKdcbiAgICogQHBhcmFtIGVtcHR5UGljayBwaWNrIOS4uuepuuaXtueahOWPluWAvOOAgmFsbCDlhajpg6hrZXnvvIxlbXB0eSDnqbpcbiAgICogQHBhcmFtIHNlcGFyYXRvciDlkIwgbmFtZXNUb0FycmF5IOeahCBzZXBhcmF0b3Ig5Y+C5pWwXG4gICAqIEBwYXJhbSBzeW1ib2wg5ZCMIGtleXMg55qEIHN5bWJvbCDlj4LmlbBcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5ZCMIGtleXMg55qEIG5vdEVudW1lcmFibGUg5Y+C5pWwXG4gICAqIEBwYXJhbSBleHRlbmQg5ZCMIGtleXMg55qEIGV4dGVuZCDlj4LmlbBcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGZpbHRlcihvYmplY3QsIHsgcGljayA9IFtdLCBvbWl0ID0gW10sIGVtcHR5UGljayA9ICdhbGwnLCBzZXBhcmF0b3IgPSAnLCcsIHN5bWJvbCA9IHRydWUsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgLy8gcGlja+OAgW9taXQg57uf5LiA5oiQ5pWw57uE5qC85byPXG4gICAgcGljayA9IFN1cHBvcnQubmFtZXNUb0FycmF5KHBpY2ssIHsgc2VwYXJhdG9yIH0pO1xuICAgIG9taXQgPSBTdXBwb3J0Lm5hbWVzVG9BcnJheShvbWl0LCB7IHNlcGFyYXRvciB9KTtcbiAgICBsZXQgX2tleXMgPSBbXTtcbiAgICAvLyBwaWNr5pyJ5YC855u05o6l5ou/77yM5Li656m65pe25qC55o2uIGVtcHR5UGljayDpu5jorqTmi7/nqbrmiJblhajpg6hrZXlcbiAgICBfa2V5cyA9IHBpY2subGVuZ3RoID4gMCB8fCBlbXB0eVBpY2sgPT09ICdlbXB0eScgPyBwaWNrIDogdGhpcy5rZXlzKG9iamVjdCwgeyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9KTtcbiAgICAvLyBvbWl0562b6YCJXG4gICAgX2tleXMgPSBfa2V5cy5maWx0ZXIoa2V5ID0+ICFvbWl0LmluY2x1ZGVzKGtleSkpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIF9rZXlzKSB7XG4gICAgICBjb25zdCBkZXNjID0gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KTtcbiAgICAgIC8vIOWxnuaAp+S4jeWtmOWcqOWvvOiHtGRlc2PlvpfliLB1bmRlZmluZWTml7bkuI3orr7nva7lgLxcbiAgICAgIGlmIChkZXNjKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOmAmui/h+aMkemAieaWueW8j+mAieWPluWvueixoeOAgmZpbHRlciDnmoTnroDlhpnmlrnlvI9cbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIGtleXMg5bGe5oCn5ZCN6ZuG5ZCIXG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBwaWNrKG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIob2JqZWN0LCB7IHBpY2s6IGtleXMsIGVtcHR5UGljazogJ2VtcHR5JywgLi4ub3B0aW9ucyB9KTtcbiAgfVxuICAvKipcbiAgICogW+aWsOWinl0g6YCa6L+H5o6S6Zmk5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVyIOeahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIG9taXQob2JqZWN0LCBrZXlzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihvYmplY3QsIHsgb21pdDoga2V5cywgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IodmFsdWUgPSB7fSkge1xuICAgIHRoaXMuY29uc3RydWN0b3IuYXNzaWduKHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIC8vIF9fcHJvdG9fXyBb57un5om/XVxuICAvLyBfX2RlZmluZUdldHRlcl9fIFvnu6fmib9dXG4gIC8vIF9fZGVmaW5lU2V0dGVyX18gW+e7p+aJv11cbiAgLy8gX19sb29rdXBHZXR0ZXJfXyBb57un5om/XVxuICAvLyBfX2xvb2t1cFNldHRlcl9fIFvnu6fmib9dXG4gIC8vIGlzUHJvdG90eXBlT2YgW+e7p+aJv11cbiAgLy8gaGFzT3duUHJvcGVydHkgW+e7p+aJv11cbiAgLy8gcHJvcGVydHlJc0VudW1lcmFibGUgW+e7p+aJv11cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyBb5paw5aKeXVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyBb5paw5aKeXVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIC8vIFvlrprliLZdXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHt9KTtcbiAgICB9XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcgW+e7p+aJv11cbiAgLy8gW+aWsOWinl1cbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzKS5sZW5ndGggPiAwO1xuICB9XG4gIC8vIFvmlrDlop5dXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyB2YWx1ZU9mIFvnu6fmib9dXG59XG5PYmplY3Quc2V0UHJvdG90eXBlT2YoX09iamVjdCwgT2JqZWN0KTtcbiIsImV4cG9ydCBjbGFzcyBfU3RyaW5nIGV4dGVuZHMgU3RyaW5nIHtcbiAgLyoqXG4gICAqIFN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGZyb21DaGFyQ29kZSBb57un5om/XVxuICAvLyBzdGF0aWMgZnJvbUNvZGVQb2ludCBb57un5om/XVxuICAvLyBzdGF0aWMgcmF3IFvnu6fmib9dXG5cbiAgLyoqXG4gICAqIFvmlrDlop5dIOmmluWtl+avjeWkp+WGmVxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvRmlyc3RVcHBlckNhc2UobmFtZSA9ICcnKSB7XG4gICAgcmV0dXJuIGAkeyhuYW1lWzBdID8/ICcnKS50b1VwcGVyQ2FzZSgpfSR7bmFtZS5zbGljZSgxKX1gO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDpppblrZfmr43lsI/lhplcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9GaXJzdExvd2VyQ2FzZShuYW1lID0gJycpIHtcbiAgICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvTG93ZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG4gIH1cbiAgLyoqXG4gICAqIFvmlrDlop5dIOi9rOmpvOWzsOWRveWQjeOAguW4uOeUqOS6jui/nuaOpeespuWRveWQjei9rOmpvOWzsOWRveWQje+8jOWmgiB4eC1uYW1lIC0+IHh4TmFtZVxuICAgKiBAcGFyYW0gbmFtZSDlkI3np7BcbiAgICogQHBhcmFtIHNlcGFyYXRvciDov57mjqXnrKbjgILnlKjkuo7nlJ/miJDmraPliJkg6buY6K6k5Li65Lit5YiS57q/IC0g5a+55bqUcmVnZXhw5b6X5YiwIC8tKFxcdykvZ1xuICAgKiBAcGFyYW0gZmlyc3Qg6aaW5a2X5q+N5aSE55CG5pa55byP44CCdHJ1ZSDmiJYgJ3VwcGVyY2FzZSfvvJrovazmjaLmiJDlpKflhpk7XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2Ug5oiWICdsb3dlcmNhc2Un77ya6L2s5o2i5oiQ5bCP5YaZO1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICdyYXcnIOaIliDlhbbku5bml6DmlYjlgLzvvJrpu5jorqTljp/moLfov5Tlm57vvIzkuI3ov5vooYzlpITnkIY7XG4gICAqIEByZXR1cm5zIHtNYWdpY1N0cmluZ3xzdHJpbmd8c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvQ2FtZWxDYXNlKG5hbWUsIHsgc2VwYXJhdG9yID0gJy0nLCBmaXJzdCA9ICdyYXcnIH0gPSB7fSkge1xuICAgIC8vIOeUn+aIkOato+WImVxuICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoYCR7c2VwYXJhdG9yfShcXFxcdylgLCAnZycpO1xuICAgIC8vIOaLvOaOpeaIkOmpvOWzsFxuICAgIGNvbnN0IGNhbWVsTmFtZSA9IG5hbWUucmVwbGFjZUFsbChyZWdleHAsIChzdWJzdHIsICQxKSA9PiB7XG4gICAgICByZXR1cm4gJDEudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgICAvLyDpppblrZfmr43lpKflsI/lhpnmoLnmja7kvKDlj4LliKTmlq1cbiAgICBpZiAoW3RydWUsICd1cHBlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvRmlyc3RVcHBlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgaWYgKFtmYWxzZSwgJ2xvd2VyY2FzZSddLmluY2x1ZGVzKGZpcnN0KSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9GaXJzdExvd2VyQ2FzZShjYW1lbE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FtZWxOYW1lO1xuICB9XG4gIC8qKlxuICAgKiBb5paw5aKeXSDovazov57mjqXnrKblkb3lkI3jgILluLjnlKjkuo7pqbzls7Dlkb3lkI3ovazov57mjqXnrKblkb3lkI3vvIzlpoIgeHhOYW1lIC0+IHh4LW5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ymXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9MaW5lQ2FzZShuYW1lID0gJycsIHsgc2VwYXJhdG9yID0gJy0nIH0gPSB7fSkge1xuICAgIHJldHVybiBuYW1lXG4gICAgLy8g5oyJ6L+e5o6l56ym5ou85o6lXG4gICAgICAucmVwbGFjZUFsbCgvKFthLXpdKShbQS1aXSkvZywgYCQxJHtzZXBhcmF0b3J9JDJgKVxuICAgIC8vIOi9rOWwj+WGmVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG4gICAgc3VwZXIodmFsdWUpO1xuICB9XG5cbiAgLy8gYW5jaG9yIOe7p+aJv1xuICAvLyBiaWcg57un5om/XG4gIC8vIGJsaW5rIOe7p+aJv1xuICAvLyBib2xkIOe7p+aJv1xuICAvLyBmaXhlZCDnu6fmib9cbiAgLy8gZm9udGNvbG9yIOe7p+aJv1xuICAvLyBmb250c2l6ZSDnu6fmib9cbiAgLy8gaXRhbGljcyDnu6fmib9cbiAgLy8gbGluayDnu6fmib9cbiAgLy8gc21hbGwg57un5om/XG4gIC8vIHN0cmlrZSDnu6fmib9cbiAgLy8gc3ViIOe7p+aJv1xuICAvLyBzdXAg57un5om/XG5cbiAgLy8gW1N5bWJvbC5pdGVyYXRvcl0g57un5om/XG4gIC8vIGxlbmd0aCDnu6fmib9cbiAgLy8gc3BsaXQg57un5om/XG4gIC8vIG1hdGNoIOe7p+aJv1xuICAvLyBtYXRjaEFsbCDnu6fmib9cblxuICAvLyBhdCDnu6fmib9cbiAgLy8gY2hhckF0IOe7p+aJv1xuICAvLyBjaGFyQ29kZUF0IOe7p+aJv1xuICAvLyBjb2RlUG9pbnRBdCDnu6fmib9cbiAgLy8gaW5kZXhPZiDnu6fmib9cbiAgLy8gbGFzdEluZGV4T2Yg57un5om/XG4gIC8vIHNlYXJjaCDnu6fmib9cbiAgLy8gaW5jbHVkZXMg57un5om/XG4gIC8vIHN0YXJ0c1dpdGgg57un5om/XG4gIC8vIGVuZHNXaXRoIOe7p+aJv1xuXG4gIC8vIHNsaWNlIOe7p+aJv1xuICAvLyBzdWJzdHJpbmcg57un5om/XG4gIC8vIHN1YnN0ciDnu6fmib9cbiAgLy8gY29uY2F0IOe7p+aJv1xuICAvLyB0cmltIOe7p+aJv1xuICAvLyB0cmltU3RhcnQg57un5om/XG4gIC8vIHRyaW1FbmQg57un5om/XG4gIC8vIHRyaW1MZWZ0IOe7p+aJv1xuICAvLyB0cmltUmlnaHQg57un5om/XG4gIC8vIHBhZFN0YXJ0IOe7p+aJv1xuICAvLyBwYWRFbmQg57un5om/XG4gIC8vIHJlcGVhdCDnu6fmib9cbiAgLy8gcmVwbGFjZSDnu6fmib9cbiAgLy8gcmVwbGFjZUFsbCDnu6fmib9cbiAgLy8gdG9Mb3dlckNhc2Ug57un5om/XG4gIC8vIHRvVXBwZXJDYXNlIOe7p+aJv1xuICAvLyB0b0xvY2FsZUxvd2VyQ2FzZSDnu6fmib9cbiAgLy8gdG9Mb2NhbGVVcHBlckNhc2Ug57un5om/XG4gIC8vIGxvY2FsZUNvbXBhcmUg57un5om/XG4gIC8vIG5vcm1hbGl6ZSDnu6fmib9cbiAgLy8gaXNXZWxsRm9ybWVkIOe7p+aJv1xuICAvLyB0b1dlbGxGb3JtZWQg57un5om/XG5cbiAgLy8gdG9TdHJpbmcg57un5om/XG4gIC8vIHZhbHVlT2Yg57un5om/XG59XG4iLCIvLyDmoLflvI/lpITnkIZcbmV4cG9ydCBjb25zdCBTdHlsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICog5Y2V5L2N5a2X56ym5Liy44CC5a+55pWw5a2X5oiW5pWw5a2X5qC85byP55qE5a2X56ym5Liy6Ieq5Yqo5ou85Y2V5L2N77yM5YW25LuW5a2X56ym5Liy5Y6f5qC36L+U5ZueXG4gKiBAcGFyYW0gdmFsdWUg5YC8XG4gKiBAcGFyYW0gdW5pdCDljZXkvY3jgIJ2YWx1ZeayoeW4puWNleS9jeaXtuiHquWKqOaLvOaOpe+8jOWPr+S8oCBweC9lbS8lIOetiVxuICogQHJldHVybnMge3N0cmluZ3xzdHJpbmd9XG4gKi9cblN0eWxlLmdldFVuaXRTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSA9ICcnLCB7IHVuaXQgPSAncHgnIH0gPSB7fSkge1xuICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIC8vIOazqOaEj++8mui/memHjOS9v+eUqCA9PSDliKTmlq3vvIzkuI3kvb/nlKggPT09XG4gIHJldHVybiBOdW1iZXIodmFsdWUpID09IHZhbHVlID8gYCR7dmFsdWV9JHt1bml0fWAgOiBTdHJpbmcodmFsdWUpO1xufTtcbiIsIi8vIHZ1ZSDmlbDmja7lpITnkIZcbmltcG9ydCB7IF9TdHJpbmcgfSBmcm9tICcuL19TdHJpbmcnO1xuaW1wb3J0IHsgRGF0YSB9IGZyb20gJy4vRGF0YSc7XG5cbmV4cG9ydCBjb25zdCBWdWVEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gICAqIOa3seino+WMhSB2dWUzIOWTjeW6lOW8j+WvueixoeaVsOaNrlxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcmV0dXJucyB7e1twOiBzdHJpbmddOiAqfHtbcDogc3RyaW5nXTogKn19fCp8KCp8e1twOiBzdHJpbmddOiAqfSlbXXx7W3A6IHN0cmluZ106ICp9fVxuICAgKi9cblZ1ZURhdGEuZGVlcFVud3JhcFZ1ZTMgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHJldHVybiBEYXRhLmRlZXBVbndyYXAoZGF0YSwge1xuICAgIGlzV3JhcDogZGF0YSA9PiBkYXRhPy5fX3ZfaXNSZWYsXG4gICAgdW53cmFwOiBkYXRhID0+IGRhdGEudmFsdWUsXG4gIH0pO1xufTtcblxuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgcHJvcHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIHByb3BEZWZpbml0aW9ucyBwcm9wcyDlrprkuYnvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldFByb3BzRnJvbUF0dHJzID0gZnVuY3Rpb24oYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAvLyBwcm9wcyDlrprkuYnnu5/kuIDmiJDlr7nosaHmoLzlvI/vvIx0eXBlIOe7n+S4gOaIkOaVsOe7hOagvOW8j+S7peS+v+WQjue7reWIpOaWrVxuICBpZiAocHJvcERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCB7IHR5cGU6IFtdIH1dKSk7XG4gIH0gZWxzZSBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KHByb3BEZWZpbml0aW9ucykpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKS5tYXAoKFtuYW1lLCBkZWZpbml0aW9uXSkgPT4ge1xuICAgICAgZGVmaW5pdGlvbiA9IERhdGEuaXNQbGFpbk9iamVjdChkZWZpbml0aW9uKVxuICAgICAgICA/IHsgLi4uZGVmaW5pdGlvbiwgdHlwZTogW2RlZmluaXRpb24udHlwZV0uZmxhdCgpIH1cbiAgICAgICAgOiB7IHR5cGU6IFtkZWZpbml0aW9uXS5mbGF0KCkgfTtcbiAgICAgIHJldHVybiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgZGVmaW5pdGlvbl07XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IHt9O1xuICB9XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgLy8gcHJvcE5hbWUg5oiWIHByb3AtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSBfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICAvLyDlj6rljIXlkKtCb29sZWFu57G75Z6L55qEJyfovazmjaLkuLp0cnVl77yM5YW25LuW5Y6f5qC36LWL5YC8XG4gICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gZGVmaW5pdGlvbi50eXBlLmxlbmd0aCA9PT0gMSAmJiBkZWZpbml0aW9uLnR5cGUuaW5jbHVkZXMoQm9vbGVhbikgJiYgYXR0clZhbHVlID09PSAnJyA/IHRydWUgOiBhdHRyVmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIHByb3AtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2V0UmVzdWx0KHsgbmFtZTogX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpLCBkZWZpbml0aW9uLCBlbmQ6IHRydWUgfSk7XG4gICAgfSkoe1xuICAgICAgbmFtZSwgZGVmaW5pdGlvbixcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbi8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+WIGVtaXRzIOWumuS5ieeahOWxnuaAp1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBlbWl0RGVmaW5pdGlvbnMgZW1pdHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuVnVlRGF0YS5nZXRFbWl0c0Zyb21BdHRycyA9IGZ1bmN0aW9uKGF0dHJzLCBlbWl0RGVmaW5pdGlvbnMpIHtcbiAgLy8gZW1pdHMg5a6a5LmJ57uf5LiA5oiQ5pWw57uE5qC85byPXG4gIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZW1pdERlZmluaXRpb25zKSkge1xuICAgIGVtaXREZWZpbml0aW9ucyA9IE9iamVjdC5rZXlzKGVtaXREZWZpbml0aW9ucyk7XG4gIH0gZWxzZSBpZiAoIShlbWl0RGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICBlbWl0RGVmaW5pdGlvbnMgPSBbXTtcbiAgfVxuICAvLyDnu5/kuIDlpITnkIbmiJAgb25FbWl0TmFtZeOAgW9uVXBkYXRlOmVtaXROYW1lKHYtbW9kZWzns7vliJcpIOagvOW8j1xuICBjb25zdCBlbWl0TmFtZXMgPSBlbWl0RGVmaW5pdGlvbnMubWFwKG5hbWUgPT4gX1N0cmluZy50b0NhbWVsQ2FzZShgb24tJHtuYW1lfWApKTtcbiAgLy8g6K6+572u5YC8XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIGVtaXROYW1lcykge1xuICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdvblVwZGF0ZTonKSkge1xuICAgICAgICAvLyBvblVwZGF0ZTplbWl0TmFtZSDmiJYgb25VcGRhdGU6ZW1pdC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBhdHRyc1tuYW1lXTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25VcGRhdGU6ZW1pdC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgICBpZiAoZW5kKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNldFJlc3VsdCh7IG5hbWU6IGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShuYW1lLnNsaWNlKG5hbWUuaW5kZXhPZignOicpICsgMSkpfWAsIGVuZDogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICAgIC8vIG9uRW1pdE5hbWXmoLzlvI/vvIzkuK3liJLnur/moLzlvI/lt7Looqt2dWXovazmjaLkuI3nlKjph43lpI3lpITnkIZcbiAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgIHJlc3VsdFtuYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgfVxuICAgIH0pKHsgbmFtZSB9KTtcbiAgfVxuICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPluWJqeS9meWxnuaAp+OAguW4uOeUqOS6jue7hOS7tiBpbmhlcml0QXR0cnMg6K6+572uIGZhbHNlIOaXtuS9v+eUqOS9nOS4uuaWsOeahCBhdHRyc1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wcyDlrprkuYkg5oiWIHZ1ZSBwcm9wc++8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHBhcmFtIGVtaXRzIGVtaXRzIOWumuS5iSDmiJYgdnVlIGVtaXRz77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICAgKiBAcGFyYW0gbGlzdCDpop3lpJbnmoTmma7pgJrlsZ7mgKdcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0UmVzdEZyb21BdHRycyA9IGZ1bmN0aW9uKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAvLyDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgcHJvcHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAocHJvcHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICB9XG4gICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KHByb3BzKSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGFyci5tYXAobmFtZSA9PiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpXSkuZmxhdCgpO1xuICB9KSgpO1xuICBlbWl0cyA9ICgoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gKCgpID0+IHtcbiAgICAgIGlmIChlbWl0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJldHVybiBlbWl0cztcbiAgICAgIH1cbiAgICAgIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZW1pdHMpKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcCgobmFtZSkgPT4ge1xuICAgICAgLy8gdXBkYXRlOmVtaXROYW1lIOaIliB1cGRhdGU6ZW1pdC1uYW1lIOagvOW8j1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgIGNvbnN0IHBhcnROYW1lID0gbmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpO1xuICAgICAgICByZXR1cm4gW2BvblVwZGF0ZToke19TdHJpbmcudG9DYW1lbENhc2UocGFydE5hbWUpfWAsIGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShwYXJ0TmFtZSl9YF07XG4gICAgICB9XG4gICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKV07XG4gICAgfSkuZmxhdCgpO1xuICB9KSgpO1xuICBsaXN0ID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSB0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZydcbiAgICAgID8gbGlzdC5zcGxpdCgnLCcpXG4gICAgICA6IGxpc3QgaW5zdGFuY2VvZiBBcnJheSA/IGxpc3QgOiBbXTtcbiAgICByZXR1cm4gYXJyLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICB9KSgpO1xuICBjb25zdCBsaXN0QWxsID0gQXJyYXkuZnJvbShuZXcgU2V0KFtwcm9wcywgZW1pdHMsIGxpc3RdLmZsYXQoKSkpO1xuICAvLyBjb25zb2xlLmxvZygnbGlzdEFsbCcsIGxpc3RBbGwpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IFtuYW1lLCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhhdHRycykpKSB7XG4gICAgaWYgKCFsaXN0QWxsLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBuYW1lLCBkZXNjKTtcbiAgICB9XG4gIH1cbiAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8g5Z+656GA5qih5Z2X44CC5pyJ5ZCM5ZCN5Y6f55Sf5a+56LGh55qE5YqgIF8g5Yy65YiGXG5leHBvcnQgKiBmcm9tICcuL19BcnJheSc7XG5leHBvcnQgKiBmcm9tICcuL19EYXRlJztcbmV4cG9ydCAqIGZyb20gJy4vX01hdGgnO1xuZXhwb3J0ICogZnJvbSAnLi9fTnVtYmVyJztcbmV4cG9ydCAqIGZyb20gJy4vX09iamVjdCc7XG5leHBvcnQgKiBmcm9tICcuL19SZWZsZWN0JztcbmV4cG9ydCAqIGZyb20gJy4vX1NldCc7XG5leHBvcnQgKiBmcm9tICcuL19TdHJpbmcnO1xuXG5leHBvcnQgKiBmcm9tICcuL0RhdGEnO1xuZXhwb3J0ICogZnJvbSAnLi9TdHlsZSc7XG5leHBvcnQgKiBmcm9tICcuL1N1cHBvcnQnO1xuZXhwb3J0ICogZnJvbSAnLi9WdWVEYXRhJztcbiIsIi8qKlxuICogZXNsaW50IOmFjee9ru+8mmh0dHA6Ly9lc2xpbnQuY24vZG9jcy9ydWxlcy9cbiAqIGVzbGludC1wbHVnaW4tdnVlIOmFjee9ru+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy9ydWxlcy9cbiAqL1xuaW1wb3J0IHsgX09iamVjdCwgRGF0YSB9IGZyb20gJy4uL2Jhc2UnO1xuXG4vKipcbiAqIOWvvOWHuuW4uOmHj+S+v+aNt+S9v+eUqFxuICovXG5leHBvcnQgY29uc3QgT0ZGID0gJ29mZic7XG5leHBvcnQgY29uc3QgV0FSTiA9ICd3YXJuJztcbmV4cG9ydCBjb25zdCBFUlJPUiA9ICdlcnJvcic7XG4vKipcbiAqIOWumuWItueahOmFjee9rlxuICovXG4vLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICAvLyDnjq/looPjgILkuIDkuKrnjq/looPlrprkuYnkuobkuIDnu4TpooTlrprkuYnnmoTlhajlsYDlj5jph49cbiAgZW52OiB7XG4gICAgYnJvd3NlcjogdHJ1ZSxcbiAgICBub2RlOiB0cnVlLFxuICB9LFxuICAvLyDlhajlsYDlj5jph49cbiAgZ2xvYmFsczoge1xuICAgIGdsb2JhbFRoaXM6ICdyZWFkb25seScsXG4gICAgQmlnSW50OiAncmVhZG9ubHknLFxuICB9LFxuICAvLyDop6PmnpDlmahcbiAgcGFyc2VyT3B0aW9uczoge1xuICAgIGVjbWFWZXJzaW9uOiAnbGF0ZXN0JyxcbiAgICBzb3VyY2VUeXBlOiAnbW9kdWxlJyxcbiAgICBlY21hRmVhdHVyZXM6IHtcbiAgICAgIGpzeDogdHJ1ZSxcbiAgICAgIGV4cGVyaW1lbnRhbE9iamVjdFJlc3RTcHJlYWQ6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgLyoqXG4gICAqIOe7p+aJv1xuICAgKiDkvb/nlKhlc2xpbnTnmoTop4TliJnvvJplc2xpbnQ66YWN572u5ZCN56ewXG4gICAqIOS9v+eUqOaPkuS7tueahOmFjee9ru+8mnBsdWdpbjrljIXlkI3nroDlhpkv6YWN572u5ZCN56ewXG4gICAqL1xuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIGVzbGludCDmjqjojZDnmoTop4TliJlcbiAgICAnZXNsaW50OnJlY29tbWVuZGVkJyxcbiAgXSxcbiAgLyoqXG4gICAqIOinhOWImVxuICAgKiDmnaXoh6ogZXNsaW50IOeahOinhOWIme+8muinhOWImUlEIDogdmFsdWVcbiAgICog5p2l6Ieq5o+S5Lu255qE6KeE5YiZ77ya5YyF5ZCN566A5YaZL+inhOWImUlEIDogdmFsdWVcbiAgICovXG4gIHJ1bGVzOiB7XG4gICAgLyoqXG4gICAgICogUG9zc2libGUgRXJyb3JzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5LiOIEphdmFTY3JpcHQg5Luj56CB5Lit5Y+v6IO955qE6ZSZ6K+v5oiW6YC76L6R6ZSZ6K+v5pyJ5YWz77yaXG4gICAgICovXG4gICAgJ2dldHRlci1yZXR1cm4nOiBPRkYsIC8vIOW8uuWItiBnZXR0ZXIg5Ye95pWw5Lit5Ye6546wIHJldHVybiDor63lj6VcbiAgICAnbm8tY29uc3RhbnQtY29uZGl0aW9uJzogT0ZGLCAvLyDnpoHmraLlnKjmnaHku7bkuK3kvb/nlKjluLjph4/ooajovr7lvI9cbiAgICAnbm8tZW1wdHknOiBPRkYsIC8vIOemgeatouWHuueOsOepuuivreWPpeWdl1xuICAgICduby1leHRyYS1zZW1pJzogV0FSTiwgLy8g56aB5q2i5LiN5b+F6KaB55qE5YiG5Y+3XG4gICAgJ25vLWZ1bmMtYXNzaWduJzogT0ZGLCAvLyDnpoHmraLlr7kgZnVuY3Rpb24g5aOw5piO6YeN5paw6LWL5YC8XG4gICAgJ25vLXByb3RvdHlwZS1idWlsdGlucyc6IE9GRiwgLy8g56aB5q2i55u05o6l6LCD55SoIE9iamVjdC5wcm90b3R5cGVzIOeahOWGhee9ruWxnuaAp1xuXG4gICAgLyoqXG4gICAgICogQmVzdCBQcmFjdGljZXNcbiAgICAgKiDov5nkupvop4TliJnmmK/lhbPkuo7mnIDkvbPlrp7ot7XnmoTvvIzluK7liqnkvaDpgb/lhY3kuIDkupvpl67popjvvJpcbiAgICAgKi9cbiAgICAnYWNjZXNzb3ItcGFpcnMnOiBFUlJPUiwgLy8g5by65Yi2IGdldHRlciDlkowgc2V0dGVyIOWcqOWvueixoeS4reaIkOWvueWHuueOsFxuICAgICdhcnJheS1jYWxsYmFjay1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmlbDnu4Tmlrnms5XnmoTlm57osIPlh73mlbDkuK3mnIkgcmV0dXJuIOivreWPpVxuICAgICdibG9jay1zY29wZWQtdmFyJzogRVJST1IsIC8vIOW8uuWItuaKiuWPmOmHj+eahOS9v+eUqOmZkOWItuWcqOWFtuWumuS5ieeahOS9nOeUqOWfn+iMg+WbtOWGhVxuICAgICdjdXJseSc6IFdBUk4sIC8vIOW8uuWItuaJgOacieaOp+WItuivreWPpeS9v+eUqOS4gOiHtOeahOaLrOWPt+mjjuagvFxuICAgICduby1mYWxsdGhyb3VnaCc6IFdBUk4sIC8vIOemgeatoiBjYXNlIOivreWPpeiQveepulxuICAgICduby1mbG9hdGluZy1kZWNpbWFsJzogRVJST1IsIC8vIOemgeatouaVsOWtl+Wtl+mdoumHj+S4reS9v+eUqOWJjeWvvOWSjOacq+WwvuWwj+aVsOeCuVxuICAgICduby1tdWx0aS1zcGFjZXMnOiBXQVJOLCAvLyDnpoHmraLkvb/nlKjlpJrkuKrnqbrmoLxcbiAgICAnbm8tbmV3LXdyYXBwZXJzJzogRVJST1IsIC8vIOemgeatouWvuSBTdHJpbmfvvIxOdW1iZXIg5ZKMIEJvb2xlYW4g5L2/55SoIG5ldyDmk43kvZznrKZcbiAgICAnbm8tcHJvdG8nOiBFUlJPUiwgLy8g56aB55SoIF9fcHJvdG9fXyDlsZ7mgKdcbiAgICAnbm8tcmV0dXJuLWFzc2lnbic6IFdBUk4sIC8vIOemgeatouWcqCByZXR1cm4g6K+t5Y+l5Lit5L2/55So6LWL5YC86K+t5Y+lXG4gICAgJ25vLXVzZWxlc3MtZXNjYXBlJzogV0FSTiwgLy8g56aB55So5LiN5b+F6KaB55qE6L2s5LmJ5a2X56ymXG5cbiAgICAvKipcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKiDov5nkupvop4TliJnkuI7lj5jph4/lo7DmmI7mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnbm8tdW5kZWYtaW5pdCc6IFdBUk4sIC8vIOemgeatouWwhuWPmOmHj+WIneWni+WMluS4uiB1bmRlZmluZWRcbiAgICAnbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOemgeatouWHuueOsOacquS9v+eUqOi/h+eahOWPmOmHj1xuICAgICduby11c2UtYmVmb3JlLWRlZmluZSc6IFtFUlJPUiwgeyAnZnVuY3Rpb25zJzogZmFsc2UsICdjbGFzc2VzJzogZmFsc2UsICd2YXJpYWJsZXMnOiBmYWxzZSB9XSwgLy8g56aB5q2i5Zyo5Y+Y6YeP5a6a5LmJ5LmL5YmN5L2/55So5a6D5LusXG5cbiAgICAvKipcbiAgICAgKiBTdHlsaXN0aWMgSXNzdWVzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5piv5YWz5LqO6aOO5qC85oyH5Y2X55qE77yM6ICM5LiU5piv6Z2e5bi45Li76KeC55qE77yaXG4gICAgICovXG4gICAgJ2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdibG9jay1zcGFjaW5nJzogV0FSTiwgLy8g56aB5q2i5oiW5by65Yi25Zyo5Luj56CB5Z2X5Lit5byA5ous5Y+35YmN5ZKM6Zet5ous5Y+35ZCO5pyJ56m65qC8XG4gICAgJ2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSwgLy8g5by65Yi25Zyo5Luj56CB5Z2X5Lit5L2/55So5LiA6Ie055qE5aSn5ous5Y+36aOO5qC8XG4gICAgJ2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLCAvLyDopoHmsYLmiJbnpoHmraLmnKvlsL7pgJflj7dcbiAgICAnY29tbWEtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOmAl+WPt+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdjb21tYS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOmAl+WPt+mjjuagvFxuICAgICdjb21wdXRlZC1wcm9wZXJ0eS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6K6h566X55qE5bGe5oCn55qE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Z1bmMtY2FsbC1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5Ye95pWw5qCH6K+G56ym5ZKM5YW26LCD55So5LmL6Ze05pyJ56m65qC8XG4gICAgJ2Z1bmN0aW9uLXBhcmVuLW5ld2xpbmUnOiBXQVJOLCAvLyDlvLrliLblnKjlh73mlbDmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTmjaLooYxcbiAgICAnaW1wbGljaXQtYXJyb3ctbGluZWJyZWFrJzogV0FSTiwgLy8g5by65Yi26ZqQ5byP6L+U5Zue55qE566t5aS05Ye95pWw5L2T55qE5L2N572uXG4gICAgJ2luZGVudCc6IFtXQVJOLCAyLCB7ICdTd2l0Y2hDYXNlJzogMSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE57yp6L+bXG4gICAgJ2pzeC1xdW90ZXMnOiBXQVJOLCAvLyDlvLrliLblnKggSlNYIOWxnuaAp+S4reS4gOiHtOWcsOS9v+eUqOWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdrZXktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWvueixoeWtl+mdoumHj+eahOWxnuaAp+S4remUruWSjOWAvOS5i+mXtOS9v+eUqOS4gOiHtOeahOmXtOi3nVxuICAgICdrZXl3b3JkLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlhbPplK7lrZfliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbmV3LXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuaIluemgeatouiwg+eUqOaXoOWPguaehOmAoOWHveaVsOaXtuacieWchuaLrOWPt1xuICAgICduby1taXhlZC1zcGFjZXMtYW5kLXRhYnMnOiBXQVJOLFxuICAgICduby1tdWx0aXBsZS1lbXB0eS1saW5lcyc6IFtXQVJOLCB7ICdtYXgnOiAxLCAnbWF4RU9GJzogMCwgJ21heEJPRic6IDAgfV0sIC8vIOemgeatouWHuueOsOWkmuihjOepuuihjFxuICAgICduby10cmFpbGluZy1zcGFjZXMnOiBXQVJOLCAvLyDnpoHnlKjooYzlsL7nqbrmoLxcbiAgICAnbm8td2hpdGVzcGFjZS1iZWZvcmUtcHJvcGVydHknOiBXQVJOLCAvLyDnpoHmraLlsZ7mgKfliY3mnInnqbrnmb1cbiAgICAnbm9uYmxvY2stc3RhdGVtZW50LWJvZHktcG9zaXRpb24nOiBXQVJOLCAvLyDlvLrliLbljZXkuKror63lj6XnmoTkvY3nva5cbiAgICAnb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLCAvLyDlvLrliLblpKfmi6zlj7flhoXmjaLooYznrKbnmoTkuIDoh7TmgKdcbiAgICAnb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLCAvLyDlvLrliLblnKjlpKfmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAncGFkZGVkLWJsb2Nrcyc6IFtXQVJOLCAnbmV2ZXInXSwgLy8g6KaB5rGC5oiW56aB5q2i5Z2X5YaF5aGr5YWFXG4gICAgJ3F1b3Rlcyc6IFtXQVJOLCAnc2luZ2xlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlLCAnYWxsb3dUZW1wbGF0ZUxpdGVyYWxzJzogdHJ1ZSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE5Y+N5Yu+5Y+344CB5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ3NlbWknOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLkvb/nlKjliIblj7fku6Pmm78gQVNJXG4gICAgJ3NlbWktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+S5i+WJjeWSjOS5i+WQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzZW1pLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25YiG5Y+355qE5L2N572uXG4gICAgJ3NwYWNlLWJlZm9yZS1ibG9ja3MnOiBXQVJOLCAvLyDlvLrliLblnKjlnZfkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtYmVmb3JlLWZ1bmN0aW9uLXBhcmVuJzogW1dBUk4sIHsgJ2Fub255bW91cyc6ICduZXZlcicsICduYW1lZCc6ICduZXZlcicsICdhc3luY0Fycm93JzogJ2Fsd2F5cycgfV0sIC8vIOW8uuWItuWcqCBmdW5jdGlvbueahOW3puaLrOWPt+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbi1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLblnKjlnIbmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW5maXgtb3BzJzogV0FSTiwgLy8g6KaB5rGC5pON5L2c56ym5ZGo5Zu05pyJ56m65qC8XG4gICAgJ3NwYWNlLXVuYXJ5LW9wcyc6IFdBUk4sIC8vIOW8uuWItuWcqOS4gOWFg+aTjeS9nOespuWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZWQtY29tbWVudCc6IFdBUk4sIC8vIOW8uuWItuWcqOazqOmHiuS4rSAvLyDmiJYgLyog5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3N3aXRjaC1jb2xvbi1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHN3aXRjaCDnmoTlhpLlj7flt6blj7PmnInnqbrmoLxcbiAgICAndGVtcGxhdGUtdGFnLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjmqKHmnb/moIforrDlkozlroPku6znmoTlrZfpnaLph4/kuYvpl7TnmoTnqbrmoLxcblxuICAgIC8qKlxuICAgICAqIEVDTUFTY3JpcHQgNlxuICAgICAqIOi/meS6m+inhOWImeWPquS4jiBFUzYg5pyJ5YWzLCDljbPpgJrluLjmiYDor7TnmoQgRVMyMDE177yaXG4gICAgICovXG4gICAgJ2Fycm93LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbnrq3lpLTlh73mlbDnmoTnrq3lpLTliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnZ2VuZXJhdG9yLXN0YXItc3BhY2luZyc6IFtXQVJOLCB7ICdiZWZvcmUnOiBmYWxzZSwgJ2FmdGVyJzogdHJ1ZSwgJ21ldGhvZCc6IHsgJ2JlZm9yZSc6IHRydWUsICdhZnRlcic6IGZhbHNlIH0gfV0sIC8vIOW8uuWItiBnZW5lcmF0b3Ig5Ye95pWw5LitICog5Y+35ZGo5Zu05L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ25vLXVzZWxlc3MtcmVuYW1lJzogV0FSTiwgLy8g56aB5q2i5ZyoIGltcG9ydCDlkowgZXhwb3J0IOWSjOino+aehOi1i+WAvOaXtuWwhuW8leeUqOmHjeWRveWQjeS4uuebuOWQjOeahOWQjeWtl1xuICAgICdwcmVmZXItdGVtcGxhdGUnOiBXQVJOLCAvLyDopoHmsYLkvb/nlKjmqKHmnb/lrZfpnaLph4/ogIzpnZ7lrZfnrKbkuLLov57mjqVcbiAgICAncmVzdC1zcHJlYWQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWJqeS9meWSjOaJqeWxlei/kOeul+espuWPiuWFtuihqOi+vuW8j+S5i+mXtOacieepuuagvFxuICAgICd0ZW1wbGF0ZS1jdXJseS1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5qih5p2/5a2X56ym5Liy5Lit55qE5bWM5YWl6KGo6L6+5byP5ZGo5Zu056m65qC855qE5L2/55SoXG4gICAgJ3lpZWxkLXN0YXItc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqCB5aWVsZCog6KGo6L6+5byP5LitICog5ZGo5Zu05L2/55So56m65qC8XG4gIH0sXG4gIC8vIOimhuebllxuICBvdmVycmlkZXM6IFtdLFxufTtcbi8vIHZ1ZTIvdnVlMyDlhbHnlKhcbmV4cG9ydCBjb25zdCB2dWVDb21tb25Db25maWcgPSB7XG4gIHJ1bGVzOiB7XG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsXG4gICAgJ3Z1ZS9tdWx0aS13b3JkLWNvbXBvbmVudC1uYW1lcyc6IE9GRiwgLy8g6KaB5rGC57uE5Lu25ZCN56ew5aeL57uI5Li65aSa5a2XXG4gICAgJ3Z1ZS9uby11bnVzZWQtY29tcG9uZW50cyc6IFdBUk4sIC8vIOacquS9v+eUqOeahOe7hOS7tlxuICAgICd2dWUvbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOacquS9v+eUqOeahOWPmOmHj1xuICAgICd2dWUvcmVxdWlyZS1yZW5kZXItcmV0dXJuJzogV0FSTiwgLy8g5by65Yi25riy5p+T5Ye95pWw5oC75piv6L+U5Zue5YC8XG4gICAgJ3Z1ZS9yZXF1aXJlLXYtZm9yLWtleSc6IE9GRiwgLy8gdi1mb3LkuK3lv4Xpobvkvb/nlKhrZXlcbiAgICAndnVlL3JldHVybi1pbi1jb21wdXRlZC1wcm9wZXJ0eSc6IFdBUk4sIC8vIOW8uuWItui/lOWbnuivreWPpeWtmOWcqOS6juiuoeeul+WxnuaAp+S4rVxuICAgICd2dWUvdmFsaWQtdGVtcGxhdGUtcm9vdCc6IE9GRiwgLy8g5by65Yi25pyJ5pWI55qE5qih5p2/5qC5XG4gICAgJ3Z1ZS92YWxpZC12LWZvcic6IE9GRiwgLy8g5by65Yi25pyJ5pWI55qEdi1mb3LmjIfku6RcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZFxuICAgICd2dWUvYXR0cmlidXRlLWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlvLrliLblsZ7mgKflkI3moLzlvI9cbiAgICAndnVlL2NvbXBvbmVudC1kZWZpbml0aW9uLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDlvLrliLbnu4Tku7ZuYW1l5qC85byPXG4gICAgJ3Z1ZS9odG1sLXF1b3Rlcyc6IFtXQVJOLCAnZG91YmxlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlIH1dLCAvLyDlvLrliLYgSFRNTCDlsZ7mgKfnmoTlvJXlj7fmoLflvI9cbiAgICAndnVlL2h0bWwtc2VsZi1jbG9zaW5nJzogT0ZGLCAvLyDkvb/nlKjoh6rpl63lkIjmoIfnrb5cbiAgICAndnVlL21heC1hdHRyaWJ1dGVzLXBlci1saW5lJzogW1dBUk4sIHsgJ3NpbmdsZWxpbmUnOiBJbmZpbml0eSwgJ211bHRpbGluZSc6IDEgfV0sIC8vIOW8uuWItuavj+ihjOWMheWQq+eahOacgOWkp+WxnuaAp+aVsFxuICAgICd2dWUvbXVsdGlsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWkmuihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvcHJvcC1uYW1lLWNhc2luZyc6IE9GRiwgLy8g5Li6IFZ1ZSDnu4Tku7bkuK3nmoQgUHJvcCDlkI3np7DlvLrliLbmiafooYznibnlrprlpKflsI/lhplcbiAgICAndnVlL3JlcXVpcmUtZGVmYXVsdC1wcm9wJzogT0ZGLCAvLyBwcm9wc+mcgOimgem7mOiupOWAvFxuICAgICd2dWUvc2luZ2xlbGluZS1odG1sLWVsZW1lbnQtY29udGVudC1uZXdsaW5lJzogT0ZGLCAvLyDpnIDopoHlnKjljZXooYzlhYPntKDnmoTlhoXlrrnliY3lkI7mjaLooYxcbiAgICAndnVlL3YtYmluZC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1iaW5k5oyH5Luk6aOO5qC8XG4gICAgJ3Z1ZS92LW9uLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LW9u5oyH5Luk6aOO5qC8XG4gICAgJ3Z1ZS92LXNsb3Qtc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtc2xvdOaMh+S7pOmjjuagvFxuICAgIC8vIFByaW9yaXR5IEM6IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9uby12LWh0bWwnOiBPRkYsIC8vIOemgeatouS9v+eUqHYtaHRtbFxuICAgIC8vIFVuY2F0ZWdvcml6ZWRcbiAgICAndnVlL2Jsb2NrLXRhZy1uZXdsaW5lJzogV0FSTiwgLy8gIOWcqOaJk+W8gOWdl+e6p+agh+iusOS5i+WQjuWSjOWFs+mXreWdl+e6p+agh+iusOS5i+WJjeW8uuWItuaNouihjFxuICAgICd2dWUvaHRtbC1jb21tZW50LWNvbnRlbnQtc3BhY2luZyc6IFdBUk4sIC8vIOWcqEhUTUzms6jph4rkuK3lvLrliLbnu5/kuIDnmoTnqbrmoLxcbiAgICAndnVlL3NjcmlwdC1pbmRlbnQnOiBbV0FSTiwgMiwgeyAnYmFzZUluZGVudCc6IDEsICdzd2l0Y2hDYXNlJzogMSB9XSwgLy8g5ZyoPHNjcmlwdD7kuK3lvLrliLbkuIDoh7TnmoTnvKnov5tcbiAgICAvLyBFeHRlbnNpb24gUnVsZXPjgILlr7nlupRlc2xpbnTnmoTlkIzlkI3op4TliJnvvIzpgILnlKjkuo48dGVtcGxhdGU+5Lit55qE6KGo6L6+5byPXG4gICAgJ3Z1ZS9hcnJheS1icmFja2V0LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvYmxvY2stc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9icmFjZS1zdHlsZSc6IFtXQVJOLCAnMXRicycsIHsgJ2FsbG93U2luZ2xlTGluZSc6IHRydWUgfV0sXG4gICAgJ3Z1ZS9jb21tYS1kYW5nbGUnOiBbV0FSTiwgJ2Fsd2F5cy1tdWx0aWxpbmUnXSxcbiAgICAndnVlL2NvbW1hLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvY29tbWEtc3R5bGUnOiBXQVJOLFxuICAgICd2dWUvZnVuYy1jYWxsLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUva2V5LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUva2V5d29yZC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL29iamVjdC1jdXJseS1uZXdsaW5lJzogW1dBUk4sIHsgJ211bHRpbGluZSc6IHRydWUsICdjb25zaXN0ZW50JzogdHJ1ZSB9XSxcbiAgICAndnVlL29iamVjdC1jdXJseS1zcGFjaW5nJzogW1dBUk4sICdhbHdheXMnXSxcbiAgICAndnVlL3NwYWNlLWluLXBhcmVucyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS1pbmZpeC1vcHMnOiBXQVJOLFxuICAgICd2dWUvc3BhY2UtdW5hcnktb3BzJzogV0FSTixcbiAgICAndnVlL2Fycm93LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvcHJlZmVyLXRlbXBsYXRlJzogV0FSTixcbiAgfSxcbiAgb3ZlcnJpZGVzOiBbXG4gICAge1xuICAgICAgJ2ZpbGVzJzogWycqLnZ1ZSddLFxuICAgICAgJ3J1bGVzJzoge1xuICAgICAgICAnaW5kZW50JzogT0ZGLFxuICAgICAgfSxcbiAgICB9LFxuICBdLFxufTtcbi8vIHZ1ZTLnlKhcbmV4cG9ydCBjb25zdCB2dWUyQ29uZmlnID0gbWVyZ2UodnVlQ29tbW9uQ29uZmlnLCB7XG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggdnVlMiDmjqjojZDnmoTop4TliJlcbiAgICAncGx1Z2luOnZ1ZS9yZWNvbW1lbmRlZCcsXG4gIF0sXG59KTtcbi8vIHZ1ZTPnlKhcbmV4cG9ydCBjb25zdCB2dWUzQ29uZmlnID0gbWVyZ2UodnVlQ29tbW9uQ29uZmlnLCB7XG4gIGVudjoge1xuICAgICd2dWUvc2V0dXAtY29tcGlsZXItbWFjcm9zJzogdHJ1ZSwgLy8g5aSE55CGc2V0dXDmqKHmnb/kuK3lg48gZGVmaW5lUHJvcHMg5ZKMIGRlZmluZUVtaXRzIOi/meagt+eahOe8luivkeWZqOWuj+aKpSBuby11bmRlZiDnmoTpl67popjvvJpodHRwczovL2VzbGludC52dWVqcy5vcmcvdXNlci1ndWlkZS8jY29tcGlsZXItbWFjcm9zLXN1Y2gtYXMtZGVmaW5lcHJvcHMtYW5kLWRlZmluZWVtaXRzLWdlbmVyYXRlLW5vLXVuZGVmLXdhcm5pbmdzXG4gIH0sXG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggdnVlMyDmjqjojZDnmoTop4TliJlcbiAgICAncGx1Z2luOnZ1ZS92dWUzLXJlY29tbWVuZGVkJyxcbiAgXSxcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL25vLXRlbXBsYXRlLWtleSc6IE9GRiwgLy8g56aB5q2iPHRlbXBsYXRlPuS4reS9v+eUqGtleeWxnuaAp1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmV0dXJuLWluLWVtaXRzLXZhbGlkYXRvcic6IFdBUk4sIC8vIOW8uuWItuWcqGVtaXRz6aqM6K+B5Zmo5Lit5a2Y5Zyo6L+U5Zue6K+t5Y+lXG4gICAgLy8gUHJpb3JpdHkgQjogU3Ryb25nbHkgUmVjb21tZW5kZWQgZm9yIFZ1ZS5qcyAzLnhcbiAgICAndnVlL3JlcXVpcmUtZXhwbGljaXQtZW1pdHMnOiBPRkYsIC8vIOmcgOimgWVtaXRz5Lit5a6a5LmJ6YCJ6aG555So5LqOJGVtaXQoKVxuICAgICd2dWUvdi1vbi1ldmVudC1oeXBoZW5hdGlvbic6IE9GRiwgLy8g5Zyo5qih5p2/5Lit55qE6Ieq5a6a5LmJ57uE5Lu25LiK5by65Yi25omn6KGMIHYtb24g5LqL5Lu25ZG95ZCN5qC35byPXG4gIH0sXG59KTtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZSguLi5vYmplY3RzKSB7XG4gIGNvbnN0IFt0YXJnZXQsIC4uLnNvdXJjZXNdID0gb2JqZWN0cztcbiAgY29uc3QgcmVzdWx0ID0gRGF0YS5kZWVwQ2xvbmUodGFyZ2V0KTtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpIHtcbiAgICAgIC8vIOeJueauiuWtl+auteWkhOeQhlxuICAgICAgaWYgKGtleSA9PT0gJ3J1bGVzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IGtleSwgdmFsdWUsICdyZXN1bHRba2V5XSc6IHJlc3VsdFtrZXldIH0pO1xuICAgICAgICAvLyDliJ3lp4vkuI3lrZjlnKjml7botYvpu5jorqTlgLznlKjkuo7lkIjlubZcbiAgICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyB7fTtcbiAgICAgICAgLy8g5a+55ZCE5p2h6KeE5YiZ5aSE55CGXG4gICAgICAgIGZvciAobGV0IFtydWxlS2V5LCBydWxlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICAgIC8vIOW3suacieWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGxldCBzb3VyY2VSdWxlVmFsdWUgPSByZXN1bHRba2V5XVtydWxlS2V5XSA/PyBbXTtcbiAgICAgICAgICBpZiAoIShzb3VyY2VSdWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZSA9IFtzb3VyY2VSdWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDopoHlkIjlubbnmoTlgLznu5/kuIDmiJDmlbDnu4TlpITnkIZcbiAgICAgICAgICBpZiAoIShydWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHJ1bGVWYWx1ZSA9IFtydWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDnu5/kuIDmoLzlvI/lkI7ov5vooYzmlbDnu4Tlvqrnjq/mk43kvZxcbiAgICAgICAgICBmb3IgKGNvbnN0IFt2YWxJbmRleCwgdmFsXSBvZiBPYmplY3QuZW50cmllcyhydWxlVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyDlr7nosaHmt7HlkIjlubbvvIzlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZSh2YWwpID09PSBPYmplY3QpIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IF9PYmplY3QuZGVlcEFzc2lnbihzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID8/IHt9LCB2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g6LWL5YC86KeE5YiZ57uT5p6cXG4gICAgICAgICAgcmVzdWx0W2tleV1bcnVsZUtleV0gPSBzb3VyY2VSdWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blrZfmrrXmoLnmja7nsbvlnovliKTmlq3lpITnkIZcbiAgICAgIC8vIOaVsOe7hO+8muaLvOaOpVxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8gW10pLnB1c2goLi4udmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWvueixoe+8mua3seWQiOW5tlxuICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbHVlKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIF9PYmplY3QuZGVlcEFzc2lnbihyZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9LCB2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW55u05o6l6LWL5YC8XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDkvb/nlKjlrprliLbnmoTphY3nva5cbiAqIEBwYXJhbSB7fe+8mumFjee9rumhuVxuICogICAgICAgICAgYmFzZe+8muS9v+eUqOWfuuehgGVzbGludOWumuWItu+8jOm7mOiupCB0cnVlXG4gKiAgICAgICAgICB2dWVWZXJzaW9u77yadnVl54mI5pys77yM5byA5ZCv5ZCO6ZyA6KaB5a6J6KOFIGVzbGludC1wbHVnaW4tdnVlXG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2UoeyBiYXNlID0gdHJ1ZSwgdnVlVmVyc2lvbiB9ID0ge30pIHtcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBpZiAoYmFzZSkge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgYmFzZUNvbmZpZyk7XG4gIH1cbiAgaWYgKHZ1ZVZlcnNpb24gPT0gMikge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgdnVlMkNvbmZpZyk7XG4gIH0gZWxzZSBpZiAodnVlVmVyc2lvbiA9PSAzKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUzQ29uZmlnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiLy8g5Z+656GA5a6a5Yi2XG5leHBvcnQgY29uc3QgYmFzZUNvbmZpZyA9IHtcbiAgYmFzZTogJy4vJyxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICAvLyDliKvlkI1cbiAgICBhbGlhczoge1xuICAgICAgLy8gJ0Byb290JzogcmVzb2x2ZShfX2Rpcm5hbWUpLFxuICAgICAgLy8gJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8g6KeE5a6a6Kem5Y+R6K2m5ZGK55qEIGNodW5rIOWkp+Wwj+OAgu+8iOS7pSBrYnMg5Li65Y2V5L2N77yJXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyICoqIDEwLFxuICAgIC8vIOiHquWumuS5ieW6leWxgueahCBSb2xsdXAg5omT5YyF6YWN572u44CCXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIOWFpeWPo+aWh+S7tuWQjVxuICAgICAgICBlbnRyeUZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9lbnRyeS0ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDlnZfmlofku7blkI1cbiAgICAgICAgY2h1bmtGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLmpzYDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g6LWE5rqQ5paH5Lu25ZCN77yMY3Nz44CB5Zu+54mH562JXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5bZXh0XWA7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59O1xuIiwiLy8g6K+35rGC5pa55rOVXG5leHBvcnQgY29uc3QgTUVUSE9EUyA9IFsnR0VUJywgJ0hFQUQnLCAnUE9TVCcsICdQVVQnLCAnREVMRVRFJywgJ0NPTk5FQ1QnLCAnT1BUSU9OUycsICdUUkFDRScsICdQQVRDSCddO1xuLy8gaHR0cCDnirbmgIHnoIFcbmV4cG9ydCBjb25zdCBTVEFUVVNFUyA9IFtcbiAgeyAnc3RhdHVzJzogMTAwLCAnc3RhdHVzVGV4dCc6ICdDb250aW51ZScgfSxcbiAgeyAnc3RhdHVzJzogMTAxLCAnc3RhdHVzVGV4dCc6ICdTd2l0Y2hpbmcgUHJvdG9jb2xzJyB9LFxuICB7ICdzdGF0dXMnOiAxMDIsICdzdGF0dXNUZXh0JzogJ1Byb2Nlc3NpbmcnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMywgJ3N0YXR1c1RleHQnOiAnRWFybHkgSGludHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMCwgJ3N0YXR1c1RleHQnOiAnT0snIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMSwgJ3N0YXR1c1RleHQnOiAnQ3JlYXRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjAyLCAnc3RhdHVzVGV4dCc6ICdBY2NlcHRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjAzLCAnc3RhdHVzVGV4dCc6ICdOb24tQXV0aG9yaXRhdGl2ZSBJbmZvcm1hdGlvbicgfSxcbiAgeyAnc3RhdHVzJzogMjA0LCAnc3RhdHVzVGV4dCc6ICdObyBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDUsICdzdGF0dXNUZXh0JzogJ1Jlc2V0IENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNiwgJ3N0YXR1c1RleHQnOiAnUGFydGlhbCBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDcsICdzdGF0dXNUZXh0JzogJ011bHRpLVN0YXR1cycgfSxcbiAgeyAnc3RhdHVzJzogMjA4LCAnc3RhdHVzVGV4dCc6ICdBbHJlYWR5IFJlcG9ydGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMjYsICdzdGF0dXNUZXh0JzogJ0lNIFVzZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMCwgJ3N0YXR1c1RleHQnOiAnTXVsdGlwbGUgQ2hvaWNlcycgfSxcbiAgeyAnc3RhdHVzJzogMzAxLCAnc3RhdHVzVGV4dCc6ICdNb3ZlZCBQZXJtYW5lbnRseScgfSxcbiAgeyAnc3RhdHVzJzogMzAyLCAnc3RhdHVzVGV4dCc6ICdGb3VuZCcgfSxcbiAgeyAnc3RhdHVzJzogMzAzLCAnc3RhdHVzVGV4dCc6ICdTZWUgT3RoZXInIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNCwgJ3N0YXR1c1RleHQnOiAnTm90IE1vZGlmaWVkJyB9LFxuICB7ICdzdGF0dXMnOiAzMDUsICdzdGF0dXNUZXh0JzogJ1VzZSBQcm94eScgfSxcbiAgeyAnc3RhdHVzJzogMzA3LCAnc3RhdHVzVGV4dCc6ICdUZW1wb3JhcnkgUmVkaXJlY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwOCwgJ3N0YXR1c1RleHQnOiAnUGVybWFuZW50IFJlZGlyZWN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDAsICdzdGF0dXNUZXh0JzogJ0JhZCBSZXF1ZXN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDEsICdzdGF0dXNUZXh0JzogJ1VuYXV0aG9yaXplZCcgfSxcbiAgeyAnc3RhdHVzJzogNDAyLCAnc3RhdHVzVGV4dCc6ICdQYXltZW50IFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDMsICdzdGF0dXNUZXh0JzogJ0ZvcmJpZGRlbicgfSxcbiAgeyAnc3RhdHVzJzogNDA0LCAnc3RhdHVzVGV4dCc6ICdOb3QgRm91bmQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNSwgJ3N0YXR1c1RleHQnOiAnTWV0aG9kIE5vdCBBbGxvd2VkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDYsICdzdGF0dXNUZXh0JzogJ05vdCBBY2NlcHRhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA0MDcsICdzdGF0dXNUZXh0JzogJ1Byb3h5IEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDgsICdzdGF0dXNUZXh0JzogJ1JlcXVlc3QgVGltZW91dCcgfSxcbiAgeyAnc3RhdHVzJzogNDA5LCAnc3RhdHVzVGV4dCc6ICdDb25mbGljdCcgfSxcbiAgeyAnc3RhdHVzJzogNDEwLCAnc3RhdHVzVGV4dCc6ICdHb25lJyB9LFxuICB7ICdzdGF0dXMnOiA0MTEsICdzdGF0dXNUZXh0JzogJ0xlbmd0aCBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDEyLCAnc3RhdHVzVGV4dCc6ICdQcmVjb25kaXRpb24gRmFpbGVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTMsICdzdGF0dXNUZXh0JzogJ1BheWxvYWQgVG9vIExhcmdlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTQsICdzdGF0dXNUZXh0JzogJ1VSSSBUb28gTG9uZycgfSxcbiAgeyAnc3RhdHVzJzogNDE1LCAnc3RhdHVzVGV4dCc6ICdVbnN1cHBvcnRlZCBNZWRpYSBUeXBlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTYsICdzdGF0dXNUZXh0JzogJ1JhbmdlIE5vdCBTYXRpc2ZpYWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNDE3LCAnc3RhdHVzVGV4dCc6ICdFeHBlY3RhdGlvbiBGYWlsZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxOCwgJ3N0YXR1c1RleHQnOiAnSVxcJ20gYSBUZWFwb3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMSwgJ3N0YXR1c1RleHQnOiAnTWlzZGlyZWN0ZWQgUmVxdWVzdCcgfSxcbiAgeyAnc3RhdHVzJzogNDIyLCAnc3RhdHVzVGV4dCc6ICdVbnByb2Nlc3NhYmxlIEVudGl0eScgfSxcbiAgeyAnc3RhdHVzJzogNDIzLCAnc3RhdHVzVGV4dCc6ICdMb2NrZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNCwgJ3N0YXR1c1RleHQnOiAnRmFpbGVkIERlcGVuZGVuY3knIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNSwgJ3N0YXR1c1RleHQnOiAnVG9vIEVhcmx5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjYsICdzdGF0dXNUZXh0JzogJ1VwZ3JhZGUgUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyOCwgJ3N0YXR1c1RleHQnOiAnUHJlY29uZGl0aW9uIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjksICdzdGF0dXNUZXh0JzogJ1RvbyBNYW55IFJlcXVlc3RzJyB9LFxuICB7ICdzdGF0dXMnOiA0MzEsICdzdGF0dXNUZXh0JzogJ1JlcXVlc3QgSGVhZGVyIEZpZWxkcyBUb28gTGFyZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDQ1MSwgJ3N0YXR1c1RleHQnOiAnVW5hdmFpbGFibGUgRm9yIExlZ2FsIFJlYXNvbnMnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMCwgJ3N0YXR1c1RleHQnOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9LFxuICB7ICdzdGF0dXMnOiA1MDEsICdzdGF0dXNUZXh0JzogJ05vdCBJbXBsZW1lbnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTAyLCAnc3RhdHVzVGV4dCc6ICdCYWQgR2F0ZXdheScgfSxcbiAgeyAnc3RhdHVzJzogNTAzLCAnc3RhdHVzVGV4dCc6ICdTZXJ2aWNlIFVuYXZhaWxhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA1MDQsICdzdGF0dXNUZXh0JzogJ0dhdGV3YXkgVGltZW91dCcgfSxcbiAgeyAnc3RhdHVzJzogNTA1LCAnc3RhdHVzVGV4dCc6ICdIVFRQIFZlcnNpb24gTm90IFN1cHBvcnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTA2LCAnc3RhdHVzVGV4dCc6ICdWYXJpYW50IEFsc28gTmVnb3RpYXRlcycgfSxcbiAgeyAnc3RhdHVzJzogNTA3LCAnc3RhdHVzVGV4dCc6ICdJbnN1ZmZpY2llbnQgU3RvcmFnZScgfSxcbiAgeyAnc3RhdHVzJzogNTA4LCAnc3RhdHVzVGV4dCc6ICdMb29wIERldGVjdGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDksICdzdGF0dXNUZXh0JzogJ0JhbmR3aWR0aCBMaW1pdCBFeGNlZWRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTEwLCAnc3RhdHVzVGV4dCc6ICdOb3QgRXh0ZW5kZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUxMSwgJ3N0YXR1c1RleHQnOiAnTmV0d29yayBBdXRoZW50aWNhdGlvbiBSZXF1aXJlZCcgfSxcbl07XG4iLCIvLyDliarotLTmnb9cbi8qKlxuICog5aSN5Yi25paH5pys5pen5YaZ5rOV44CC5ZyoIGNsaXBib2FyZCBhcGkg5LiN5Y+v55So5pe25Luj5pu/XG4gKiBAcGFyYW0gdGV4dFxuICogQHJldHVybnMge1Byb21pc2U8UHJvbWlzZTx2b2lkPnxQcm9taXNlPG5ldmVyPj59XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG9sZENvcHlUZXh0KHRleHQpIHtcbiAgLy8g5paw5bu66L6T5YWl5qGGXG4gIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgLy8g6LWL5YC8XG4gIHRleHRhcmVhLnZhbHVlID0gdGV4dDtcbiAgLy8g5qC35byP6K6+572uXG4gIE9iamVjdC5hc3NpZ24odGV4dGFyZWEuc3R5bGUsIHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICB0b3A6IDAsXG4gICAgY2xpcFBhdGg6ICdjaXJjbGUoMCknLFxuICB9KTtcbiAgLy8g5Yqg5YWl5Yiw6aG16Z2iXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRleHRhcmVhKTtcbiAgLy8g6YCJ5LitXG4gIHRleHRhcmVhLnNlbGVjdCgpO1xuICAvLyDlpI3liLZcbiAgY29uc3Qgc3VjY2VzcyA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gIC8vIOS7jumhtemdouenu+mZpFxuICB0ZXh0YXJlYS5yZW1vdmUoKTtcbiAgcmV0dXJuIHN1Y2Nlc3MgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVqZWN0KCk7XG59XG5leHBvcnQgY29uc3QgY2xpcGJvYXJkID0ge1xuICAvKipcbiAgICog5YaZ5YWl5paH5pysKOWkjeWItilcbiAgICogQHBhcmFtIHRleHRcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBhc3luYyB3cml0ZVRleHQodGV4dCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGF3YWl0IG9sZENvcHlUZXh0KHRleHQpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIOivu+WPluaWh+acrCjnspjotLQpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59XG4gICAqL1xuICBhc3luYyByZWFkVGV4dCgpIHtcbiAgICByZXR1cm4gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xuICB9LFxufTtcbiIsIi8qISBqcy1jb29raWUgdjMuMC41IHwgTUlUICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbmZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbnZhciBkZWZhdWx0Q29udmVydGVyID0ge1xuICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgLyUoMlszNDZCRl18M1tBQy1GXXw0MHw1W0JERV18NjB8N1tCQ0RdKS9nLFxuICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgKVxuICB9XG59O1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbmZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgZnVuY3Rpb24gc2V0IChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcykge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcbiAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlNSk7XG4gICAgfVxuICAgIGlmIChhdHRyaWJ1dGVzLmV4cGlyZXMpIHtcbiAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgIH1cblxuICAgIG5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQobmFtZSlcbiAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgIC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XG5cbiAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXG4gICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAvLyAuLi5cbiAgICAgIC8vIDMuICBJZiB0aGUgcmVtYWluaW5nIHVucGFyc2VkLWF0dHJpYnV0ZXMgY29udGFpbnMgYSAleDNCIChcIjtcIilcbiAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgLy8gbm90IGluY2x1ZGluZywgdGhlIGZpcnN0ICV4M0IgKFwiO1wiKSBjaGFyYWN0ZXIuXG4gICAgICAvLyAuLi5cbiAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAgbmFtZSArICc9JyArIGNvbnZlcnRlci53cml0ZSh2YWx1ZSwgbmFtZSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gIH1cblxuICBmdW5jdGlvbiBnZXQgKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAhbmFtZSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcbiAgICAvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cbiAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuICAgIHZhciBqYXIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGZvdW5kID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKTtcbiAgICAgICAgamFyW2ZvdW5kXSA9IGNvbnZlcnRlci5yZWFkKHZhbHVlLCBmb3VuZCk7XG5cbiAgICAgICAgaWYgKG5hbWUgPT09IGZvdW5kKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZSA/IGphcltuYW1lXSA6IGphclxuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAge1xuICAgICAgc2V0LFxuICAgICAgZ2V0LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICBzZXQoXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBhc3NpZ24oe30sIGF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgIGV4cGlyZXM6IC0xXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmV0dXJuIGluaXQodGhpcy5jb252ZXJ0ZXIsIGFzc2lnbih7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSlcbiAgICAgIH0sXG4gICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgIHJldHVybiBpbml0KGFzc2lnbih7fSwgdGhpcy5jb252ZXJ0ZXIsIGNvbnZlcnRlciksIHRoaXMuYXR0cmlidXRlcylcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoZGVmYXVsdEF0dHJpYnV0ZXMpIH0sXG4gICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgfVxuICApXG59XG5cbnZhciBhcGkgPSBpbml0KGRlZmF1bHRDb252ZXJ0ZXIsIHsgcGF0aDogJy8nIH0pO1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuZXhwb3J0IHsgYXBpIGFzIGRlZmF1bHQgfTtcbiIsIi8vIGNvb2tpZeaTjeS9nFxuaW1wb3J0IGpzQ29va2llIGZyb20gJ2pzLWNvb2tpZSc7XG4vLyDnlKjliLDnmoTlupPkuZ/lr7zlh7rkvr/kuo7oh6rooYzpgInnlKhcbmV4cG9ydCB7IGpzQ29va2llIH07XG5cbi8vIOWQjCBqcy1jb29raWUg55qE6YCJ6aG55ZCI5bm25pa55byPXG5mdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCAuLi5zb3VyY2VzKSB7XG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG4vLyBjb29raWXlr7nosaFcbmV4cG9ydCBjbGFzcyBDb29raWUge1xuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAgY29udmVydGVyICDlkIwganMtY29va2llcyDnmoQgY29udmVydGVyXG4gICAqICAgICAgICAgIGF0dHJpYnV0ZXMg5ZCMIGpzLWNvb2tpZXMg55qEIGF0dHJpYnV0ZXNcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2i44CCanMtY29va2llIOWcqDMuMOeJiOacrChjb21taXQ6IDRiNzkyOTBiOThkN2ZiZjFhYjQ5M2E3ZjllMTYxOTQxOGFjMDFlNDUpIOenu+mZpOS6huWvuSBqc29uIOeahOiHquWKqOi9rOaNou+8jOi/memHjOm7mOiupCB0cnVlIOWKoOS4ilxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8g6YCJ6aG557uT5p6cXG4gICAgY29uc3QgeyBjb252ZXJ0ZXIgPSB7fSwgYXR0cmlidXRlcyA9IHt9LCBqc29uID0gdHJ1ZSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBvcHRpb25zUmVzdWx0ID0ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGpzb24sXG4gICAgICBhdHRyaWJ1dGVzOiBhc3NpZ24oe30sIGpzQ29va2llLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpLFxuICAgICAgY29udmVydGVyOiBhc3NpZ24oe30sIGpzQ29va2llLmNvbnZlcnRlciwgY29udmVydGVyKSxcbiAgICB9O1xuICAgIC8vIOWjsOaYjuWQhOWxnuaAp+OAguebtOaOpeaIluWcqGNvbnN0cnVjdG9y5Lit6YeN5paw6LWL5YC8XG4gICAgLy8g6buY6K6k6YCJ6aG557uT5p6cXG4gICAgdGhpcy4kZGVmYXVsdHMgPSBvcHRpb25zUmVzdWx0O1xuICB9XG4gICRkZWZhdWx0cztcbiAgLy8g5YaZ5YWlXG4gIC8qKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIGF0dHJpYnV0ZXNcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqICAgICAgICAgIGpzb24g5piv5ZCm6L+b6KGManNvbui9rOaNolxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHNldChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzQ29va2llLnNldChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcyk7XG4gIH1cbiAgLy8g6K+75Y+WXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcGFyYW0gb3B0aW9ucyDphY3nva7poblcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2iXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0KG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGpzb24gPSAnanNvbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuanNvbiA6IHRoaXMuJGRlZmF1bHRzLmpzb247XG4gICAgbGV0IHJlc3VsdCA9IGpzQ29va2llLmdldChuYW1lKTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g56e76ZmkXG4gIHJlbW92ZShuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgYXR0cmlidXRlcyA9IGFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG4gICAgcmV0dXJuIGpzQ29va2llLnJlbW92ZShuYW1lLCBhdHRyaWJ1dGVzKTtcbiAgfVxuICAvLyDliJvlu7rjgILpgJrov4fphY3nva7pu5jorqTlj4LmlbDliJvlu7rmlrDlr7nosaHvvIznroDljJbkvKDlj4JcbiAgY3JlYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgYXR0cmlidXRlczogYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBvcHRpb25zLmF0dHJpYnV0ZXMpLFxuICAgICAgY29udmVydGVyOiBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIG9wdGlvbnMuY29udmVydGVyKSxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgQ29va2llKG9wdGlvbnNSZXN1bHQpO1xuICB9XG59XG5leHBvcnQgY29uc3QgY29va2llID0gbmV3IENvb2tpZSgpO1xuIiwiZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZSAtIGZpbGUgc2l6ZSBoYWNrc1xuICAgICAgICByZXF1ZXN0Lm9uY29tcGxldGUgPSByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUocmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gZmlsZSBzaXplIGhhY2tzXG4gICAgICAgIHJlcXVlc3Qub25hYm9ydCA9IHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlKGRiTmFtZSwgc3RvcmVOYW1lKSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSk7XG4gICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiByZXF1ZXN0LnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICAgIGNvbnN0IGRicCA9IHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCk7XG4gICAgcmV0dXJuICh0eE1vZGUsIGNhbGxiYWNrKSA9PiBkYnAudGhlbigoZGIpID0+IGNhbGxiYWNrKGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgdHhNb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpKSk7XG59XG5sZXQgZGVmYXVsdEdldFN0b3JlRnVuYztcbmZ1bmN0aW9uIGRlZmF1bHRHZXRTdG9yZSgpIHtcbiAgICBpZiAoIWRlZmF1bHRHZXRTdG9yZUZ1bmMpIHtcbiAgICAgICAgZGVmYXVsdEdldFN0b3JlRnVuYyA9IGNyZWF0ZVN0b3JlKCdrZXl2YWwtc3RvcmUnLCAna2V5dmFsJyk7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0R2V0U3RvcmVGdW5jO1xufVxuLyoqXG4gKiBHZXQgYSB2YWx1ZSBieSBpdHMga2V5LlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBnZXQoa2V5LCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXQoa2V5KSkpO1xufVxuLyoqXG4gKiBTZXQgYSB2YWx1ZSB3aXRoIGEga2V5LlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgc3RvcmUucHV0KHZhbHVlLCBrZXkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIFNldCBtdWx0aXBsZSB2YWx1ZXMgYXQgb25jZS4gVGhpcyBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIHNldCgpIG11bHRpcGxlIHRpbWVzLlxuICogSXQncyBhbHNvIGF0b21pYyDigJMgaWYgb25lIG9mIHRoZSBwYWlycyBjYW4ndCBiZSBhZGRlZCwgbm9uZSB3aWxsIGJlIGFkZGVkLlxuICpcbiAqIEBwYXJhbSBlbnRyaWVzIEFycmF5IG9mIGVudHJpZXMsIHdoZXJlIGVhY2ggZW50cnkgaXMgYW4gYXJyYXkgb2YgYFtrZXksIHZhbHVlXWAuXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gc2V0TWFueShlbnRyaWVzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4gc3RvcmUucHV0KGVudHJ5WzFdLCBlbnRyeVswXSkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIEdldCBtdWx0aXBsZSB2YWx1ZXMgYnkgdGhlaXIga2V5c1xuICpcbiAqIEBwYXJhbSBrZXlzXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFueShrZXlzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gUHJvbWlzZS5hbGwoa2V5cy5tYXAoKGtleSkgPT4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXQoa2V5KSkpKSk7XG59XG4vKipcbiAqIFVwZGF0ZSBhIHZhbHVlLiBUaGlzIGxldHMgeW91IHNlZSB0aGUgb2xkIHZhbHVlIGFuZCB1cGRhdGUgaXQgYXMgYW4gYXRvbWljIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gdXBkYXRlciBBIGNhbGxiYWNrIHRoYXQgdGFrZXMgdGhlIG9sZCB2YWx1ZSBhbmQgcmV0dXJucyBhIG5ldyB2YWx1ZS5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiB1cGRhdGUoa2V5LCB1cGRhdGVyLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IFxuICAgIC8vIE5lZWQgdG8gY3JlYXRlIHRoZSBwcm9taXNlIG1hbnVhbGx5LlxuICAgIC8vIElmIEkgdHJ5IHRvIGNoYWluIHByb21pc2VzLCB0aGUgdHJhbnNhY3Rpb24gY2xvc2VzIGluIGJyb3dzZXJzXG4gICAgLy8gdGhhdCB1c2UgYSBwcm9taXNlIHBvbHlmaWxsIChJRTEwLzExKS5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHN0b3JlLmdldChrZXkpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3RvcmUucHV0KHVwZGF0ZXIodGhpcy5yZXN1bHQpLCBrZXkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKTtcbn1cbi8qKlxuICogRGVsZXRlIGEgcGFydGljdWxhciBrZXkgZnJvbSB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGRlbChrZXksIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBzdG9yZS5kZWxldGUoa2V5KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBEZWxldGUgbXVsdGlwbGUga2V5cyBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSBrZXlzIExpc3Qgb2Yga2V5cyB0byBkZWxldGUuXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZGVsTWFueShrZXlzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHN0b3JlLmRlbGV0ZShrZXkpKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDbGVhciBhbGwgdmFsdWVzIGluIHRoZSBzdG9yZS5cbiAqXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gY2xlYXIoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZHdyaXRlJywgKHN0b3JlKSA9PiB7XG4gICAgICAgIHN0b3JlLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGVhY2hDdXJzb3Ioc3RvcmUsIGNhbGxiYWNrKSB7XG4gICAgc3RvcmUub3BlbkN1cnNvcigpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlc3VsdClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5yZXN1bHQpO1xuICAgICAgICB0aGlzLnJlc3VsdC5jb250aW51ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xufVxuLyoqXG4gKiBHZXQgYWxsIGtleXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBrZXlzKGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiB7XG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGlmIChzdG9yZS5nZXRBbGxLZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGxLZXlzKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgIHJldHVybiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKGN1cnNvci5rZXkpKS50aGVuKCgpID0+IGl0ZW1zKTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IGFsbCB2YWx1ZXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiB2YWx1ZXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgIHJldHVybiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSkpLnRoZW4oKCkgPT4gaXRlbXMpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBHZXQgYWxsIGVudHJpZXMgaW4gdGhlIHN0b3JlLiBFYWNoIGVudHJ5IGlzIGFuIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBlbnRyaWVzKGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiB7XG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIC8vIChhbHRob3VnaCwgaG9wZWZ1bGx5IHdlJ2xsIGdldCBhIHNpbXBsZXIgcGF0aCBzb21lIGRheSlcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbCAmJiBzdG9yZS5nZXRBbGxLZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsS2V5cygpKSxcbiAgICAgICAgICAgICAgICBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldEFsbCgpKSxcbiAgICAgICAgICAgIF0pLnRoZW4oKFtrZXlzLCB2YWx1ZXNdKSA9PiBrZXlzLm1hcCgoa2V5LCBpKSA9PiBba2V5LCB2YWx1ZXNbaV1dKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gZWFjaEN1cnNvcihzdG9yZSwgKGN1cnNvcikgPT4gaXRlbXMucHVzaChbY3Vyc29yLmtleSwgY3Vyc29yLnZhbHVlXSkpLnRoZW4oKCkgPT4gaXRlbXMpKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgY2xlYXIsIGNyZWF0ZVN0b3JlLCBkZWwsIGRlbE1hbnksIGVudHJpZXMsIGdldCwgZ2V0TWFueSwga2V5cywgcHJvbWlzaWZ5UmVxdWVzdCwgc2V0LCBzZXRNYW55LCB1cGRhdGUsIHZhbHVlcyB9O1xuIiwiZXhwb3J0IGNsYXNzIF9TdG9yYWdlIHtcbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqICAgICAgICAgIHN0b3JhZ2Ug5a+55bqU55qEc3RvcmFnZeWvueixoeOAgmxvY2FsU3RvcmFnZSDmiJYgc2Vzc2lvblN0b3JhZ2VcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2i44CCXG4gICAqIEByZXR1cm5zIHt2b2lkfCp9XG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGZyb20sIGpzb24gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZnJvbSxcbiAgICAgIGpzb24sXG4gICAgfTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgIC8vIOm7mOiupOmAiemhuee7k+aenFxuICAgICAgJGRlZmF1bHRzOiBvcHRpb25zUmVzdWx0LFxuICAgICAgLy8g5a+55bqU55qEc3RvcmFnZeWvueixoeOAglxuICAgICAgc3RvcmFnZTogZnJvbSxcbiAgICAgIC8vIOWOn+acieaWueazleOAgueUseS6jiBPYmplY3QuY3JlYXRlKGZyb20pIOaWueW8j+e7p+aJv+aXtuiwg+eUqOS8muaKpSBVbmNhdWdodCBUeXBlRXJyb3I6IElsbGVnYWwgaW52b2NhdGlvbu+8jOaUueaIkOWNleeLrOWKoOWFpeaWueW8j1xuICAgICAgc2V0SXRlbTogZnJvbS5zZXRJdGVtLmJpbmQoZnJvbSksXG4gICAgICBnZXRJdGVtOiBmcm9tLmdldEl0ZW0uYmluZChmcm9tKSxcbiAgICAgIHJlbW92ZUl0ZW06IGZyb20ucmVtb3ZlSXRlbS5iaW5kKGZyb20pLFxuICAgICAga2V5OiBmcm9tLmtleS5iaW5kKGZyb20pLFxuICAgICAgY2xlYXI6IGZyb20uY2xlYXIuYmluZChmcm9tKSxcbiAgICB9KTtcbiAgfVxuICAvLyDlo7DmmI7lkITlsZ7mgKfjgILnm7TmjqXmiJblnKhjb25zdHJ1Y3RvcuS4remHjeaWsOi1i+WAvFxuICAkZGVmYXVsdHM7XG4gIHN0b3JhZ2U7XG4gIHNldEl0ZW07XG4gIGdldEl0ZW07XG4gIHJlbW92ZUl0ZW07XG4gIGtleTtcbiAgY2xlYXI7XG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5sZW5ndGg7XG4gIH1cbiAgLy8g5Yik5pat5bGe5oCn5piv5ZCm5a2Y5Zyo44CC5ZCM5pe255So5LqO5ZyoIGdldCDkuK3lr7nkuI3lrZjlnKjnmoTlsZ7mgKfov5Tlm54gdW5kZWZpbmVkXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zdG9yYWdlKS5pbmNsdWRlcyhrZXkpO1xuICB9XG4gIC8vIOWGmeWFpVxuICBzZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBpZiAoanNvbikge1xuICAgICAgLy8g5aSE55CG5a2YIHVuZGVmaW5lZCDnmoTmg4XlhrXvvIzms6jmhI/lr7nosaHkuK3nmoTmmL7lvI8gdW5kZWZpbmVkIOeahOWxnuaAp+S8muiiqyBqc29uIOW6j+WIl+WMluenu+mZpFxuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICB9XG4gIC8vIOivu+WPllxuICBnZXQoa2V5LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIC8vIOWkhOeQhuaXoOWxnuaAp+eahOeahOaDheWGtei/lOWbniB1bmRlZmluZWRcbiAgICBpZiAoanNvbiAmJiAhdGhpcy5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8g5YW25LuW5YC85Yik5pat6L+U5ZueXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgaWYgKGpzb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOenu+mZpFxuICByZW1vdmUoa2V5KSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gIH1cbiAgLy8g5Yib5bu644CC6YCa6L+H6YWN572u6buY6K6k5Y+C5pWw5Yib5bu65paw5a+56LGh77yM566A5YyW5Lyg5Y+CXG4gIGNyZWF0ZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zUmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgX1N0b3JhZ2Uob3B0aW9uc1Jlc3VsdCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBfbG9jYWxTdG9yYWdlID0gbmV3IF9TdG9yYWdlKHsgZnJvbTogbG9jYWxTdG9yYWdlIH0pO1xuZXhwb3J0IGNvbnN0IF9zZXNzaW9uU3RvcmFnZSA9IG5ldyBfU3RvcmFnZSh7IGZyb206IHNlc3Npb25TdG9yYWdlIH0pO1xuIl0sIm5hbWVzIjpbImJhc2VDb25maWciLCJhc3NpZ24iLCJqc0Nvb2tpZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUE7QUFFQTtFQUNPLE1BQU0sSUFBSSxTQUFTLEdBQUcsQ0FBQztFQUM5QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxPQUFPLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRTtFQUMvQjtFQUNBLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtFQUN6QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQzlCLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDOUIsS0FBSztFQUNMO0VBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hEO0VBQ0EsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0VBQ3BDLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxLQUFLO0VBQ25DLE1BQU0sT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxH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QUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFO0VBQy9DLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7RUFDL0UsR0FBRztFQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFO0VBQy9DLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0VBQzNELEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUU7RUFDMUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7RUFDekMsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRTtFQUM3QixJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtFQUMzQixNQUFNLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0VBQzdCLEtBQUs7RUFDTCxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0VBQ2pELE1BQU0sT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7RUFDN0IsS0FBSztFQUNMLEdBQUc7RUFDSDtFQUNBLEVBQUUsUUFBUSxHQUFHO0VBQ2Is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
