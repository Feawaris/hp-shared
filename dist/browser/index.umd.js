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
     * (新增方法) 交集
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
     * (新增方法) 并集
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
     * (新增方法) 补集
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
     * @param value
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

      // size 无需定制
    }

    // 方法定制：原型同名方法+新增方法。大部分返回 this 便于链式操作
    /**
     * 修改
     */
    // (定制方法)
    add(...values) {
      for (const value of values) {
        Set.prototype.add.apply(this, arguments);
      }
      return this;
    }

    // (定制方法)
    delete(...values) {
      for (const value of values) {
        Set.prototype.delete.apply(this, arguments);
      }
      return this;
    }

    // (定制方法)
    clear() {
      Set.prototype.clear.apply(this, arguments);
      return this;
    }

    /**
     * 遍历
     */
    // Symbol.iterator 无需定制
    // keys 无需定制
    // values 无需定制
    // entries 无需定制

    // (定制方法)
    forEach() {
      Set.prototype.forEach.apply(this, arguments);
      return this;
    }

    /**
     * 查找
     */
    // has 无需定制

    /**
     * 生成
     */
    // 直接 to_Array 调数组方法再 to_Set 转换回来即可，无需重复定制

    /**
     * 转换系列方法：转换成原始值和其他类型
     */
    // (定制方法)
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') {
        return this.toNumber();
      }
      if (hint === 'string' || hint === 'default') {
        return this.toString();
      }
    }

    // (新增方法)
    toNumber() {
      return NaN;
    }

    // (定制方法)
    toString() {
      try {
        return `{${this.toArray().join(',')}}`;
      } catch (e) {
        return '{}';
      }
    }

    // (新增方法)
    toBoolean(options = {}) {
      return this.size > 0;
    }

    // (定制方法)
    toJSON() {
      return this.toArray();
    }

    // (新增方法)
    toArray() {
      return Array.from(this);
    }

    // (新增方法)
    to_Array() {
      return new _Array(this);
    }
  }

  // 数组

  class _Array extends Array {
    /**
     * static
     */
    // static isArray 无需定制
    // static from 无需定制
    // static of 无需定制

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

      // length 无需定制
    }

    // 方法定制：原型同名方法+新增方法。大部分返回 this 便于链式操作
    /**
     * 修改
     */
    // sort 无需定制
    // reverse 无需定制
    // fill 无需定制
    // copyWithin 无需定制

    // (定制方法)
    push() {
      Array.prototype.push.apply(this, arguments);
      return this;
    }
    // (定制方法)
    pop(length = 1) {
      for (let i = 0; i < length; i++) {
        Array.prototype.pop.apply(this, arguments);
      }
      return this;
    }
    // (定制方法)
    unshift() {
      Array.prototype.unshift.apply(this, arguments);
      return this;
    }
    // (定制方法)
    shift(length = 1) {
      for (let i = 0; i < length; i++) {
        Array.prototype.shift.apply(this, arguments);
      }
      return this;
    }
    // (定制方法)
    splice(start, deleteCount, ...items) {
      Array.prototype.splice.apply(this, arguments);
      return this;
    }
    // (新增方法) 删除
    delete(value) {
      const index = this.findIndex(val => val === value);
      return this.splice(index, 1);
    }
    // (新增方法) 清空
    clear() {
      return this.splice(0);
    }
    // (新增方法) 去重
    unique(options = {}) {
      const value = this.to_Set().to_Array();
      return this.clear().push(...value);
    }

    /**
     * 遍历
     */
    // Symbol.iterator 无需定制
    // keys 无需定制
    // values 无需定制
    // entries 无需定制

    // (定制方法)
    forEach() {
      Array.prototype.forEach.apply(this, arguments);
      return this;
    }

    /**
     * 查找
     */
    // at 无需定制
    // find 无需定制
    // findIndex 无需定制
    // findLast 无需定制
    // findLastIndex 无需定制
    // includes 无需定制
    // indexOf 无需定制
    // lastIndexOf 无需定制
    // some 无需定制
    // every 无需定制

    /**
     * 生成
     */
    // map 无需定制
    // filter 无需定制
    // reduce 无需定制
    // reduceRight 无需定制
    // concat 无需定制
    // slice 无需定制
    // join 无需定制
    // flat 无需定制
    // flatMap 无需定制

    // (定制方法)
    with() {
      const value = Array.prototype.with.apply(this, arguments);
      return new this.constructor(value);
    }
    // (定制方法)
    toSpliced() {
      const value = Array.prototype.toSpliced.apply(this, arguments);
      return new this.constructor(value);
    }
    // (定制方法)
    toSorted() {
      const value = Array.prototype.toSorted.apply(this, arguments);
      return new this.constructor(value);
    }
    // (定制方法)
    toReversed() {
      const value = Array.prototype.toReversed.apply(this, arguments);
      return new this.constructor(value);
    }
    /**
     * 转换系列方法：转换成原始值和其他类型
     */
    // (定制方法)
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') {
        return this.toNumber();
      }
      if (hint === 'string' || hint === 'default') {
        return this.toString();
      }
    }
    // (新增方法)
    toNumber() {
      return NaN;
    }
    // (定制方法)
    toString() {
      try {
        return JSON.stringify(this);
      } catch (e) {
        console.warn(`toString 转换报错，将生成 '[]'`, e);
        return JSON.stringify([]);
      }
    }
    // toLocaleString 无需定制
    // (新增方法)
    toBoolean() {
      return this.length > 0;
    }
    // (定制方法)
    toJSON() {
      return Array.from(this);
    }
    // (新增方法)
    toSet() {
      return new Set(this);
    }
    // (新增方法)
    to_Set() {
      return new _Set(this);
    }
  }

  const _Boolean = Object.create(null);

  _Boolean.FALSY = [0, '', null, undefined, NaN];

  // 日期时间
  class _Date extends Date {
    /**
     * static
     */
    // (新增属性)
    static REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
    static REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

    // static now 无需定制
    // static parse 无需定制
    // static UTC 无需定制

    /**
     * (新增方法) 转换成字符串
     * @param value
     * @param options
     * @returns {string}
     */
    static stringify(value, options = {}) {
      return new this(value).toString();
    }
    /**
     * (新增方法) 是否有效参数。常用于处理操作得到 Invalid Date 的情况
     * @param value
     * @param options
     * @returns {boolean}
     */
    static isValidValue(value, options = {}) {
      return new this(value).toBoolean();
    }

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

      // 新增属性
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
     * get 系列方法。使用 year、month 等新增属性获取即可，简化写法，无需额外定制
     */
    // getTime 无需定制
    // getTimezoneOffset 无需定制

    // getYear 无需定制
    // getFullYear 无需定制
    // getMonth 无需定制
    // getDate 无需定制
    // getDay 无需定制
    // getHours 无需定制
    // getMinutes 无需定制
    // getSeconds 无需定制
    // getMilliseconds 无需定制

    // getUTCFullYear 无需定制
    // getUTCMonth 无需定制
    // getUTCDate 无需定制
    // getUTCDay 无需定制
    // getUTCHours 无需定制
    // getUTCMinutes 无需定制
    // getUTCSeconds 无需定制
    // getUTCMilliseconds 无需定制

    /**
     * set 系列方法。定制成返回 this 便于链式操作
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
    // (定制方法)
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') {
        return this.toNumber();
      }
      if (hint === 'string' || hint === 'default') {
        return this.toString();
      }
    }
    // (新增方法)
    toNumber() {
      return this.getTime();
    }
    // (定制方法)
    toString(format = 'YYYY-MM-DD hh:mm:ss') {
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
    // (定制方法)
    toDateString(format = 'YYYY-MM-DD') {
      return this.toString(format);
    }
    // (定制方法)
    toTimeString(format = 'HH:mm:ss') {
      return this.toString(format);
    }
    // toLocaleString 无需定制
    // toLocaleDateString 无需定制
    // toLocaleTimeString 无需定制
    // toISOString 无需定制
    // toUTCString 无需定制
    // toGMTString 无需定制
    // (新增方法)
    toBoolean() {
      return !isNaN(this.getTime());
    }
    // (定制方法)
    toJSON(options = {}) {
      return this.toString();
    }
    // valueOf 无需定制
  }

  // 数学运算。对 Math 对象扩展，提供更直观和符合数学约定的名称
  const _Math = Object.create(Math);

  _Math.arcsin = Math.asin.bind(Math);
  _Math.arccos = Math.acos.bind(Math);
  _Math.arctan = Math.atan.bind(Math);
  _Math.arsinh = Math.asinh.bind(Math);
  _Math.arcosh = Math.acosh.bind(Math);
  _Math.artanh = Math.atanh.bind(Math);
  _Math.loge = Math.log.bind(Math);
  _Math.ln = Math.log.bind(Math);
  _Math.lg = Math.log10.bind(Math);
  _Math.log = function(a, x) {
    return Math.log(x) / Math.log(a);
  };

  class _Number extends Number {
  }

  const _Reflect = Object.create(Reflect);

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
    // static create 无需定制
    // static fromEntries 无需定制
    // static is 无需定制
    // static getPrototypeOf 无需定制
    // static setPrototypeOf 无需定制
    // static hasOwn 无需定制
    // static defineProperty 无需定制
    // static defineProperties 无需定制
    // static getOwnPropertyDescriptor 无需定制
    // static getOwnPropertyDescriptors 无需定制
    // static getOwnPropertyNames 无需定制
    // static getOwnPropertySymbols 无需定制
    // static preventExtensions 无需定制
    // static seal 无需定制
    // static freeze 无需定制
    // static isExtensible 无需定制
    // static isSealed 无需定制
    // static isFrozen 无需定制

    /**
     * (定制方法) 浅合并对象。写法同 Object.assign，通过重定义方式合并，解决 Object.assign 合并两边同名属性混有 value写法 和 get/set写法 时报 TypeError: Cannot set property b of #<Object> which has only a getter 的问题
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
     * (新增方法) 深合并对象。同 assign 一样也会对属性进行重定义
     * @param target 目标对象。默认值 {} 防止递归时报 TypeError: Object.defineProperty called on non-object
     * @param sources 数据源。一个或多个对象
     * @returns {{}}
     */
    static deepAssign(target = {}, ...sources) {
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
     * (新增方法) 获取属性名。默认参数配置成同 Object.keys 行为
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
     * (定制方法)
     */
    static values() {
    }

    /**
     * (定制方法)
     */
    static entries() {
    }

    /**
     * (新增方法) key自身所属的对象
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
     * (新增方法) 获取属性描述对象，相比 Object.getOwnPropertyDescriptor，能拿到继承属性的描述对象
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
     * (新增方法) 对应 keys 获取 descriptors，传参同 keys 方法。可用于重定义属性
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
     * (新增方法) 对应 keys 获取 descriptorEntries，传参同 keys 方法。可用于重定义属性
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
     * (新增方法) 过滤对象
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
     * (新增方法) 通过挑选方式选取对象。filter 的简写方式
     * @param object 对象
     * @param keys 属性名集合
     * @param options 选项，同 filter 的各选项值
     * @returns {{}}
     */
    static pick(object, keys = [], options = {}) {
      return this.filter(object, { pick: keys, emptyPick: 'empty', ...options });
    }
    /**
     * (新增方法) 通过排除方式选取对象。filter 的简写方式
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

    /**
     * 转换系列方法：转换成原始值和其他类型
     */
    // (定制方法)
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') {
        return this.toNumber();
      }
      if (hint === 'string' || hint === 'default') {
        return this.toString();
      }
    }

    // (新增方法)
    toNumber() {
      return NaN;
    }

    // (定制方法)
    toString() {
      try {
        return JSON.stringify(this);
      } catch (e) {
        return JSON.stringify({});
      }
    }

    // (新增方法)
    toBoolean() {
      return Object.keys(this).length > 0;
    }

    // (定制方法)
    toJSON() {
      return this;
    }
  }
  Object.setPrototypeOf(_Object, Object);

  class _String extends String {
    /**
     * Static
     */
    // static fromCharCode 无需定制
    // static fromCodePoint 无需定制
    // static raw 无需定制

    /**
     * (新增方法) 首字母大写
     * @param name
     * @returns {string}
     */
    static toFirstUpperCase(name = '') {
      return `${(name[0] ?? '').toUpperCase()}${name.slice(1)}`;
    }

    /**
     * (新增方法) 首字母小写
     * @param name 名称
     * @returns {string}
     */
    static toFirstLowerCase(name = '') {
      return `${(name[0] ?? '').toLowerCase()}${name.slice(1)}`;
    }

    /**
     * (新增方法) 转驼峰命名。常用于连接符命名转驼峰命名，如 xx-name -> xxName
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
     * (新增方法) 转连接符命名。常用于驼峰命名转连接符命名，如 xxName -> xx-name
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
    _Boolean: _Boolean,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudW1kLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9fU2V0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX0FycmF5LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX0Jvb2xlYW4uanMiLCIuLi8uLi9zcmMvYmFzZS9fRGF0ZS5qcyIsIi4uLy4uL3NyYy9iYXNlL19NYXRoLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX051bWJlci5qcyIsIi4uLy4uL3NyYy9iYXNlL19SZWZsZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvRGF0YS5qcyIsIi4uLy4uL3NyYy9iYXNlL1N1cHBvcnQuanMiLCIuLi8uLi9zcmMvYmFzZS9fT2JqZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1N0cmluZy5qcyIsIi4uLy4uL3NyYy9iYXNlL1N0eWxlLmpzIiwiLi4vLi4vc3JjL2Jhc2UvVnVlRGF0YS5qcyIsIi4uLy4uL3NyYy9iYXNlL2luZGV4LmpzIiwiLi4vLi4vc3JjL2Rldi9lc2xpbnQuanMiLCIuLi8uLi9zcmMvZGV2L3ZpdGUuanMiLCIuLi8uLi9zcmMvbmV0d29yay9zaGFyZWQuanMiLCIuLi8uLi9zcmMvc3RvcmFnZS9icm93c2VyL2NsaXBib2FyZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9qcy1jb29raWVAMy4wLjUvbm9kZV9tb2R1bGVzL2pzLWNvb2tpZS9kaXN0L2pzLmNvb2tpZS5tanMiLCIuLi8uLi9zcmMvc3RvcmFnZS9icm93c2VyL2Nvb2tpZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9pZGIta2V5dmFsQDYuMi4xL25vZGVfbW9kdWxlcy9pZGIta2V5dmFsL2Rpc3QvaW5kZXguanMiLCIuLi8uLi9zcmMvc3RvcmFnZS9icm93c2VyL3N0b3JhZ2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8g6ZuG5ZCIXG5pbXBvcnQgeyBfQXJyYXkgfSBmcm9tICcuL19BcnJheSc7XG5cbmV4cG9ydCBjbGFzcyBfU2V0IGV4dGVuZHMgU2V0IHtcbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOS6pOmbhlxuICAgKiBAcGFyYW0gc2V0c1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyBpbnRlcnNlY3Rpb24oLi4uc2V0cykge1xuICAgIC8vIOS8oOWPguaVsOmHj1xuICAgIGlmIChzZXRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHNldHNbMF0gPSBzZXRzWzBdIHx8IFtdO1xuICAgICAgc2V0c1sxXSA9IHNldHNbMV0gfHwgW107XG4gICAgfVxuICAgIC8vIOe7n+S4gOexu+Wei+WkhOeQhlxuICAgIHNldHMgPSBuZXcgX0FycmF5KHNldHMpLm1hcChzZXQgPT4gbmV3IF9BcnJheShzZXQpKTtcblxuICAgIGNvbnN0IFtmaXJzdCwgLi4ub3RoZXJzXSA9IHNldHM7XG4gICAgcmV0dXJuIGZpcnN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgIHJldHVybiBvdGhlcnMuZXZlcnkoc2V0ID0+IHNldC5pbmNsdWRlcyh2YWx1ZSkpO1xuICAgIH0pLnRvX1NldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOW5tumbhlxuICAgKiBAcGFyYW0gc2V0c1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyB1bmlvbiguLi5zZXRzKSB7XG4gICAgLy8g5Lyg5Y+C5pWw6YePXG4gICAgaWYgKHNldHMubGVuZ3RoIDwgMikge1xuICAgICAgc2V0c1swXSA9IHNldHNbMF0gfHwgW107XG4gICAgICBzZXRzWzFdID0gc2V0c1sxXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgc2V0cyA9IG5ldyBfQXJyYXkoc2V0cykubWFwKHNldCA9PiBuZXcgX0FycmF5KHNldCkpO1xuXG4gICAgcmV0dXJuIHNldHMuZmxhdCgpLnRvX1NldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOihpembhlxuICAgKiBAcGFyYW0gbWFpblNldFxuICAgKiBAcGFyYW0gb3RoZXJTZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIGNvbXBsZW1lbnQobWFpblNldCA9IFtdLCAuLi5vdGhlclNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAob3RoZXJTZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIG90aGVyU2V0c1swXSA9IG90aGVyU2V0c1swXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgbWFpblNldCA9IG5ldyBfQXJyYXkobWFpblNldCk7XG4gICAgb3RoZXJTZXRzID0gbmV3IF9BcnJheShvdGhlclNldHMpLm1hcChhcmcgPT4gbmV3IF9BcnJheShhcmcpKTtcbiAgICByZXR1cm4gbWFpblNldC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gb3RoZXJTZXRzLmV2ZXJ5KHNldCA9PiAhc2V0LmluY2x1ZGVzKHZhbHVlKSk7XG4gICAgfSkudG9fU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IFtdKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ19TZXQgY29uc3RydWN0b3InLCB2YWx1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gbmV3IFNldCh2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCfkvKDlj4LmiqXplJnvvIzlsIbnlJ/miJDnqbrpm4blkIgnLCBlKTtcbiAgICAgIHZhbHVlID0gbmV3IFNldChbXSk7XG4gICAgfVxuICAgIHN1cGVyKHZhbHVlKTtcblxuICAgIC8vIHNpemUg5peg6ZyA5a6a5Yi2XG4gIH1cblxuICAvLyDmlrnms5XlrprliLbvvJrljp/lnovlkIzlkI3mlrnms5Ur5paw5aKe5pa55rOV44CC5aSn6YOo5YiG6L+U5ZueIHRoaXMg5L6/5LqO6ZO+5byP5pON5L2cXG4gIC8qKlxuICAgKiDkv67mlLlcbiAgICovXG4gIC8vICjlrprliLbmlrnms5UpXG4gIGFkZCguLi52YWx1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgU2V0LnByb3RvdHlwZS5hZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBkZWxldGUoLi4udmFsdWVzKSB7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIFNldC5wcm90b3R5cGUuZGVsZXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgY2xlYXIoKSB7XG4gICAgU2V0LnByb3RvdHlwZS5jbGVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOmBjeWOhlxuICAgKi9cbiAgLy8gU3ltYm9sLml0ZXJhdG9yIOaXoOmcgOWumuWItlxuICAvLyBrZXlzIOaXoOmcgOWumuWItlxuICAvLyB2YWx1ZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGVudHJpZXMg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgZm9yRWFjaCgpIHtcbiAgICBTZXQucHJvdG90eXBlLmZvckVhY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xmib5cbiAgICovXG4gIC8vIGhhcyDml6DpnIDlrprliLZcblxuICAvKipcbiAgICog55Sf5oiQXG4gICAqL1xuICAvLyDnm7TmjqUgdG9fQXJyYXkg6LCD5pWw57uE5pa55rOV5YaNIHRvX1NldCDovazmjaLlm57mnaXljbPlj6/vvIzml6DpnIDph43lpI3lrprliLZcblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyAo5a6a5Yi25pa55rOVKVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1N0cmluZygpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGB7JHt0aGlzLnRvQXJyYXkoKS5qb2luKCcsJyl9fWA7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuICd7fSc7XG4gICAgfVxuICB9XG5cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9Cb29sZWFuKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnNpemUgPiAwO1xuICB9XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKTtcbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG4gIH1cblxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b19BcnJheSgpIHtcbiAgICByZXR1cm4gbmV3IF9BcnJheSh0aGlzKTtcbiAgfVxufVxuIiwiLy8g5pWw57uEXG5pbXBvcnQgeyBfU2V0IH0gZnJvbSAnLi9fU2V0JztcblxuZXhwb3J0IGNsYXNzIF9BcnJheSBleHRlbmRzIEFycmF5IHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGlzQXJyYXkg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBmcm9tIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgb2Yg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IFtdKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gQXJyYXkuZnJvbSh2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCfkvKDlj4LmiqXplJnvvIzlsIbnlJ/miJDnqbrmlbDnu4QnLCBlKTtcbiAgICAgIHZhbHVlID0gW107XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDEgJiYgdHlwZW9mIHZhbHVlWzBdID09PSAnbnVtYmVyJykge1xuICAgICAgLy8g56iA55aP5pWw57uE6Zeu6aKY77yM5YWI6LCDIHN1cGVyIOeUn+aIkCB0aGlzIOWQjuWGjeS/ruaUuSB0aGlzIOWGheWuuVxuICAgICAgY29uc3QgdGVtcCA9IHZhbHVlWzBdO1xuICAgICAgdmFsdWVbMF0gPSB1bmRlZmluZWQ7XG4gICAgICBzdXBlciguLi52YWx1ZSk7XG4gICAgICB0aGlzWzBdID0gdGVtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIoLi4udmFsdWUpO1xuICAgIH1cblxuICAgIC8vIGxlbmd0aCDml6DpnIDlrprliLZcbiAgfVxuXG4gIC8vIOaWueazleWumuWItu+8muWOn+Wei+WQjOWQjeaWueazlSvmlrDlop7mlrnms5XjgILlpKfpg6jliIbov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgLyoqXG4gICAqIOS/ruaUuVxuICAgKi9cbiAgLy8gc29ydCDml6DpnIDlrprliLZcbiAgLy8gcmV2ZXJzZSDml6DpnIDlrprliLZcbiAgLy8gZmlsbCDml6DpnIDlrprliLZcbiAgLy8gY29weVdpdGhpbiDml6DpnIDlrprliLZcblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBwdXNoKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgcG9wKGxlbmd0aCA9IDEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHVuc2hpZnQoKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBzaGlmdChsZW5ndGggPSAxKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgQXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHNwbGljZShzdGFydCwgZGVsZXRlQ291bnQsIC4uLml0ZW1zKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vICjmlrDlop7mlrnms5UpIOWIoOmZpFxuICBkZWxldGUodmFsdWUpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZEluZGV4KHZhbCA9PiB2YWwgPT09IHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG4gIC8vICjmlrDlop7mlrnms5UpIOa4heepulxuICBjbGVhcigpIHtcbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoMCk7XG4gIH1cbiAgLy8gKOaWsOWinuaWueazlSkg5Y676YeNXG4gIHVuaXF1ZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudG9fU2V0KCkudG9fQXJyYXkoKTtcbiAgICByZXR1cm4gdGhpcy5jbGVhcigpLnB1c2goLi4udmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOmBjeWOhlxuICAgKi9cbiAgLy8gU3ltYm9sLml0ZXJhdG9yIOaXoOmcgOWumuWItlxuICAvLyBrZXlzIOaXoOmcgOWumuWItlxuICAvLyB2YWx1ZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGVudHJpZXMg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgZm9yRWFjaCgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeaJvlxuICAgKi9cbiAgLy8gYXQg5peg6ZyA5a6a5Yi2XG4gIC8vIGZpbmQg5peg6ZyA5a6a5Yi2XG4gIC8vIGZpbmRJbmRleCDml6DpnIDlrprliLZcbiAgLy8gZmluZExhc3Qg5peg6ZyA5a6a5Yi2XG4gIC8vIGZpbmRMYXN0SW5kZXgg5peg6ZyA5a6a5Yi2XG4gIC8vIGluY2x1ZGVzIOaXoOmcgOWumuWItlxuICAvLyBpbmRleE9mIOaXoOmcgOWumuWItlxuICAvLyBsYXN0SW5kZXhPZiDml6DpnIDlrprliLZcbiAgLy8gc29tZSDml6DpnIDlrprliLZcbiAgLy8gZXZlcnkg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqIOeUn+aIkFxuICAgKi9cbiAgLy8gbWFwIOaXoOmcgOWumuWItlxuICAvLyBmaWx0ZXIg5peg6ZyA5a6a5Yi2XG4gIC8vIHJlZHVjZSDml6DpnIDlrprliLZcbiAgLy8gcmVkdWNlUmlnaHQg5peg6ZyA5a6a5Yi2XG4gIC8vIGNvbmNhdCDml6DpnIDlrprliLZcbiAgLy8gc2xpY2Ug5peg6ZyA5a6a5Yi2XG4gIC8vIGpvaW4g5peg6ZyA5a6a5Yi2XG4gIC8vIGZsYXQg5peg6ZyA5a6a5Yi2XG4gIC8vIGZsYXRNYXAg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgd2l0aCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS53aXRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1NwbGljZWQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUudG9TcGxpY2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1NvcnRlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1NvcnRlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9SZXZlcnNlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1JldmVyc2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyAo5a6a5Yi25pa55rOVKVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKGB0b1N0cmluZyDovazmjaLmiqXplJnvvIzlsIbnlJ/miJAgJ1tdJ2AsIGUpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtdKTtcbiAgICB9XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPiAwO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b1NldCgpIHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzKTtcbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b19TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBfU2V0KHRoaXMpO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgX0Jvb2xlYW4gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5fQm9vbGVhbi5GQUxTWSA9IFswLCAnJywgbnVsbCwgdW5kZWZpbmVkLCBOYU5dO1xuIiwiLy8g5pel5pyf5pe26Ze0XG5leHBvcnQgY2xhc3MgX0RhdGUgZXh0ZW5kcyBEYXRlIHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gKOaWsOWinuWxnuaApylcbiAgc3RhdGljIFJFR0VYX1BBUlNFID0gL14oXFxkezR9KVstL10/KFxcZHsxLDJ9KT9bLS9dPyhcXGR7MCwyfSlbVHRcXHNdKihcXGR7MSwyfSk/Oj8oXFxkezEsMn0pPzo/KFxcZHsxLDJ9KT9bLjpdPyhcXGQrKT8kLztcbiAgc3RhdGljIFJFR0VYX0ZPUk1BVCA9IC9cXFsoW15cXF1dKyldfFl7MSw0fXxNezEsNH18RHsxLDJ9fGR7MSw0fXxIezEsMn18aHsxLDJ9fGF8QXxtezEsMn18c3sxLDJ9fFp7MSwyfXxTU1MvZztcblxuICAvLyBzdGF0aWMgbm93IOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgcGFyc2Ug5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBVVEMg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOi9rOaNouaIkOWtl+espuS4slxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzdHJpbmdpZnkodmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgdGhpcyh2YWx1ZSkudG9TdHJpbmcoKTtcbiAgfVxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5piv5ZCm5pyJ5pWI5Y+C5pWw44CC5bi455So5LqO5aSE55CG5pON5L2c5b6X5YiwIEludmFsaWQgRGF0ZSDnmoTmg4XlhrVcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIGlzVmFsaWRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHZhbHVlKS50b0Jvb2xlYW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIC8vIGNvbnNvbGUubG9nKCdfRGF0ZSBjb25zdHJ1Y3RvcicsIGFyZ3MpO1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gbnVsbCDlkozmmL7lvI8gdW5kZWZpbmVkIOmDveinhuS4uuaXoOaViOWAvFxuICAgICAgaWYgKGFyZ3NbMF0gPT09IG51bGwpIHtcbiAgICAgICAgYXJnc1swXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZUFsbCgnLScsICcvJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgLy8g5paw5aKe5bGe5oCnXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd5ZWFyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGdWxsWWVhcigpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21vbnRoJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNb250aCgpICsgMTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERhdGUoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd3ZWVrJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXkoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdob3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRIb3VycygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Nob3J0SG91cicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgY29uc3QgaG91ciA9IHRoaXMuaG91cjtcbiAgICAgICAgcmV0dXJuIGhvdXIgJSAxMiA9PT0gMCA/IGhvdXIgOiBob3VyICUgMTI7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWludXRlJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNaW51dGVzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2Vjb25kJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTZWNvbmRzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWlsbGlzZWNvbmQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1pbGxpc2Vjb25kcygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3RpbWVab25lT2Zmc2V0SG91cicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIOagvOW8j+WMluWtl+espuS4sueUqOOAguaAu+S9k+WQjCBlbGVtZW50IOeUqOeahCBkYXkuanMg5qC85byPKGh0dHBzOi8vZGF5LmpzLm9yZy9kb2NzL3poLUNOL2Rpc3BsYXkvZm9ybWF0Ke+8jOmjjuagvOWumuWItuaIkOS4reaWh1xuICAgIHRoaXMuZm9ybWF0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWVknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnllYXIudG9TdHJpbmcoKS5zbGljZSgtMik7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1lZWVknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnllYXIudG9TdHJpbmcoKS5zbGljZSgtNCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ00nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1vbnRoLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ01NJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5tb250aC50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0QnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmRheS50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdERCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuZGF5LnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWyflkajml6UnLCAn5ZGo5LiAJywgJ+WRqOS6jCcsICflkajkuIknLCAn5ZGo5ZubJywgJ+WRqOS6lCcsICflkajlha0nXVskdGhpcy53ZWVrXTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnZGQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsn5pif5pyf5pelJywgJ+aYn+acn+S4gCcsICfmmJ/mnJ/kuownLCAn5pif5pyf5LiJJywgJ+aYn+acn+WbmycsICfmmJ/mnJ/kupQnLCAn5pif5pyf5YWtJ11bJHRoaXMud2Vla107XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0gnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmhvdXIudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnSEgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmhvdXIudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdoJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zaG9ydEhvdXIudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnaGgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNob3J0SG91ci50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ20nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1pbnV0ZS50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdtbScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWludXRlLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAncycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2Vjb25kLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ3NzJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zZWNvbmQudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdTU1MnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1pbGxpc2Vjb25kLnRvU3RyaW5nKCkucGFkU3RhcnQoMywgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnYScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ciA8IDEyID8gJ+S4iuWNiCcgOiAn5LiL5Y2IJztcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnQScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzaWduID0gJHRoaXMudGltZVpvbmVPZmZzZXRIb3VyIDwgMCA/ICcrJyA6ICctJztcbiAgICAgICAgcmV0dXJuIGAke3NpZ259JHsoLSR0aGlzLnRpbWVab25lT2Zmc2V0SG91cikudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfTowMGA7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1paJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5aLnJlcGxhY2UoJzonLCAnJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCDns7vliJfmlrnms5XjgILkvb/nlKggeWVhcuOAgW1vbnRoIOetieaWsOWinuWxnuaAp+iOt+WPluWNs+WPr++8jOeugOWMluWGmeazle+8jOaXoOmcgOmineWkluWumuWItlxuICAgKi9cbiAgLy8gZ2V0VGltZSDml6DpnIDlrprliLZcbiAgLy8gZ2V0VGltZXpvbmVPZmZzZXQg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gZ2V0WWVhciDml6DpnIDlrprliLZcbiAgLy8gZ2V0RnVsbFllYXIg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldE1vbnRoIOaXoOmcgOWumuWItlxuICAvLyBnZXREYXRlIOaXoOmcgOWumuWItlxuICAvLyBnZXREYXkg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldEhvdXJzIOaXoOmcgOWumuWItlxuICAvLyBnZXRNaW51dGVzIOaXoOmcgOWumuWItlxuICAvLyBnZXRTZWNvbmRzIOaXoOmcgOWumuWItlxuICAvLyBnZXRNaWxsaXNlY29uZHMg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gZ2V0VVRDRnVsbFllYXIg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ01vbnRoIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENEYXRlIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENEYXkg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ0hvdXJzIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENNaW51dGVzIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENTZWNvbmRzIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENNaWxsaXNlY29uZHMg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqIHNldCDns7vliJfmlrnms5XjgILlrprliLbmiJDov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgICovXG4gIHNldFRpbWUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VGltZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0WWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRZZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0RnVsbFllYXIoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0RnVsbFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNb250aCgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRNb250aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldERhdGUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0RGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldEhvdXJzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldEhvdXJzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0TWludXRlcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRNaW51dGVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0U2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRTZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0TWlsbGlzZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1pbGxpc2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0VVRDRnVsbFllYXIoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDRnVsbFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNb250aCgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENNb250aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ0RhdGUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ0hvdXJzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ0hvdXJzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDTWludXRlcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENNaW51dGVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDU2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENTZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDTWlsbGlzZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01pbGxpc2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gKOWumuWItuaWueazlSlcbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGltZSgpO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU3RyaW5nKGZvcm1hdCA9ICdZWVlZLU1NLUREIGhoOm1tOnNzJykge1xuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZUFsbCh0aGlzLmNvbnN0cnVjdG9yLlJFR0VYX0ZPUk1BVCwgKG1hdGNoLCAkMSkgPT4ge1xuICAgICAgLy8gW10g6YeM6Z2i55qE5YaF5a655Y6f5qC36L6T5Ye6XG4gICAgICBpZiAoJDEpIHtcbiAgICAgICAgcmV0dXJuICQxO1xuICAgICAgfVxuICAgICAgLy8g5qC85byPXG4gICAgICBpZiAobWF0Y2ggaW4gdGhpcy5mb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0W21hdGNoXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b0RhdGVTdHJpbmcoZm9ybWF0ID0gJ1lZWVktTU0tREQnKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoZm9ybWF0KTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1RpbWVTdHJpbmcoZm9ybWF0ID0gJ0hIOm1tOnNzJykge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKGZvcm1hdCk7XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vIHRvTG9jYWxlRGF0ZVN0cmluZyDml6DpnIDlrprliLZcbiAgLy8gdG9Mb2NhbGVUaW1lU3RyaW5nIOaXoOmcgOWumuWItlxuICAvLyB0b0lTT1N0cmluZyDml6DpnIDlrprliLZcbiAgLy8gdG9VVENTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vIHRvR01UU3RyaW5nIOaXoOmcgOWumuWItlxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b0Jvb2xlYW4oKSB7XG4gICAgcmV0dXJuICFpc05hTih0aGlzLmdldFRpbWUoKSk7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9KU09OKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cbiAgLy8gdmFsdWVPZiDml6DpnIDlrprliLZcbn1cbiIsIi8vIOaVsOWtpui/kOeul+OAguWvuSBNYXRoIOWvueixoeaJqeWxle+8jOaPkOS+m+abtOebtOinguWSjOespuWQiOaVsOWtpue6puWumueahOWQjeensFxuZXhwb3J0IGNvbnN0IF9NYXRoID0gT2JqZWN0LmNyZWF0ZShNYXRoKTtcblxuX01hdGguYXJjc2luID0gTWF0aC5hc2luLmJpbmQoTWF0aCk7XG5fTWF0aC5hcmNjb3MgPSBNYXRoLmFjb3MuYmluZChNYXRoKTtcbl9NYXRoLmFyY3RhbiA9IE1hdGguYXRhbi5iaW5kKE1hdGgpO1xuX01hdGguYXJzaW5oID0gTWF0aC5hc2luaC5iaW5kKE1hdGgpO1xuX01hdGguYXJjb3NoID0gTWF0aC5hY29zaC5iaW5kKE1hdGgpO1xuX01hdGguYXJ0YW5oID0gTWF0aC5hdGFuaC5iaW5kKE1hdGgpO1xuX01hdGgubG9nZSA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG5fTWF0aC5sbiA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG5fTWF0aC5sZyA9IE1hdGgubG9nMTAuYmluZChNYXRoKTtcbl9NYXRoLmxvZyA9IGZ1bmN0aW9uKGEsIHgpIHtcbiAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coYSk7XG59O1xuIiwiZXhwb3J0IGNsYXNzIF9OdW1iZXIgZXh0ZW5kcyBOdW1iZXIge1xufVxuIiwiZXhwb3J0IGNvbnN0IF9SZWZsZWN0ID0gT2JqZWN0LmNyZWF0ZShSZWZsZWN0KTtcblxuLy8g5a+5IG93bktleXMg6YWN5aWXIG93blZhbHVlcyDlkowgb3duRW50cmllc1xuX1JlZmxlY3Qub3duVmFsdWVzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IHRhcmdldFtrZXldKTtcbn07XG5fUmVmbGVjdC5vd25FbnRyaWVzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IFtrZXksIHRhcmdldFtrZXldXSk7XG59O1xuIiwiLy8g5pWw5o2u5aSE55CG77yM5aSE55CG5aSa5qC85byP5pWw5o2u55SoXG5leHBvcnQgY29uc3QgRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4vKipcbiAqIOS8mOWMliB0eXBlb2ZcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMgeyd1bmRlZmluZWQnfCdvYmplY3QnfCdib29sZWFuJ3wnbnVtYmVyJ3wnc3RyaW5nJ3wnZnVuY3Rpb24nfCdzeW1ib2wnfCdiaWdpbnQnfHN0cmluZ31cbiAqL1xuRGF0YS50eXBlb2YgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIHJldHVybiB0eXBlb2YgdmFsdWU7XG59O1xuLyoqXG4gKiDliKTmlq3nroDljZXnsbvlnotcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkRhdGEuaXNTaW1wbGVUeXBlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIFsnbnVsbCcsICd1bmRlZmluZWQnLCAnbnVtYmVyJywgJ3N0cmluZycsICdib29sZWFuJywgJ2JpZ2ludCcsICdzeW1ib2wnXS5pbmNsdWRlcyh0aGlzLnR5cGVvZih2YWx1ZSkpO1xufTtcbi8qKlxuICog5piv5ZCm5pmu6YCa5a+56LGhXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5EYXRhLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufTtcbi8qKlxuICog6I635Y+W5YC855qE5YW35L2T57G75Z6LXG4gKiBAcGFyYW0gdmFsdWUg5YC8XG4gKiBAcmV0dXJucyB7T2JqZWN0Q29uc3RydWN0b3J8KnxGdW5jdGlvbn0g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWw44CCbnVsbOOAgXVuZGVmaW5lZCDljp/moLfov5Tlm55cbiAqL1xuRGF0YS5nZXRFeGFjdFR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gIC8vIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoeaXtiBfX3Byb3RvX18g5Li6IG51bGxcbiAgY29uc3QgaXNPYmplY3RCeUNyZWF0ZU51bGwgPSBfX3Byb3RvX18gPT09IG51bGw7XG4gIGlmIChpc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgIHJldHVybiBPYmplY3Q7XG4gIH1cbiAgLy8g5a+55bqU57un5om/55qE5a+56LGhIF9fcHJvdG9fXyDmsqHmnIkgY29uc3RydWN0b3Ig5bGe5oCnXG4gIGNvbnN0IGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9ICEoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pO1xuICBpZiAoaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgIHJldHVybiBPYmplY3Q7XG4gIH1cbiAgLy8g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWwXG4gIHJldHVybiBfX3Byb3RvX18uY29uc3RydWN0b3I7XG59O1xuLyoqXG4gKiDojrflj5blgLznmoTlhbfkvZPnsbvlnovliJfooahcbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEByZXR1cm5zIHsqW119IOe7n+S4gOi/lOWbnuaVsOe7hOOAgm51bGzjgIF1bmRlZmluZWQg5a+55bqU5Li6IFtudWxsXSxbdW5kZWZpbmVkXVxuICovXG5EYXRhLmdldEV4YWN0VHlwZXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWIpOaWreWkhOeQhlxuICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgcmV0dXJuIFt2YWx1ZV07XG4gIH1cbiAgLy8g5omr5Y6f5Z6L6ZO+5b6X5Yiw5a+55bqU5p6E6YCg5Ye95pWwXG4gIGxldCByZXN1bHQgPSBbXTtcbiAgbGV0IGxvb3AgPSAwO1xuICBsZXQgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IGZhbHNlO1xuICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ3doaWxlJywgbG9vcCwgX19wcm90b19fKTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICAvLyDkuIDov5vmnaUgX19wcm90b19fIOWwseaYryBudWxsIOivtOaYjiB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaFcbiAgICAgIGlmIChsb29wIDw9IDApIHtcbiAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXykge1xuICAgICAgcmVzdWx0LnB1c2goX19wcm90b19fLmNvbnN0cnVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgIGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSB0cnVlO1xuICAgIH1cbiAgICBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX19wcm90b19fKTtcbiAgICBsb29wKys7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICog5rex5ou36LSd5pWw5o2uXG4gKiBAcGFyYW0gc291cmNlXG4gKiBAcmV0dXJucyB7TWFwPGFueSwgYW55PnxTZXQ8YW55Pnx7fXwqfCpbXX1cbiAqL1xuRGF0YS5kZWVwQ2xvbmUgPSBmdW5jdGlvbihzb3VyY2UpIHtcbiAgLy8g5pWw57uEXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHNvdXJjZS52YWx1ZXMoKSkge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBTZXRcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIFNldCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICByZXN1bHQuYWRkKHRoaXMuZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gTWFwXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBNYXApIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IE1hcCgpO1xuICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBzb3VyY2UuZW50cmllcygpKSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgdGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlr7nosaFcbiAgaWYgKHRoaXMuZ2V0RXhhY3RUeXBlKHNvdXJjZSkgPT09IE9iamVjdCkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgIC8vIHZhbHVl5pa55byP77ya6YCS5b2S5aSE55CGXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwge1xuICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcENsb25lKGRlc2MudmFsdWUpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGdldC9zZXQg5pa55byP77ya55u05o6l5a6a5LmJXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g5YW25LuW77ya5Y6f5qC36L+U5ZueXG4gIHJldHVybiBzb3VyY2U7XG59O1xuLyoqXG4gKiDmt7Hop6PljIXmlbDmja5cbiAqIEBwYXJhbSBkYXRhIOWAvFxuICogQHBhcmFtIGlzV3JhcCDljIXoo4XmlbDmja7liKTmlq3lh73mlbDvvIzlpoIgdnVlMyDnmoQgaXNSZWYg5Ye95pWwXG4gKiBAcGFyYW0gdW53cmFwIOino+WMheaWueW8j+WHveaVsO+8jOWmgiB2dWUzIOeahCB1bnJlZiDlh73mlbBcbiAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiBhbnl9fXwqfCgqfHtbcDogc3RyaW5nXTogYW55fSlbXXx7W3A6IHN0cmluZ106IGFueX19XG4gKi9cbkRhdGEuZGVlcFVud3JhcCA9IGZ1bmN0aW9uKGRhdGEsIHsgaXNXcmFwID0gKCkgPT4gZmFsc2UsIHVud3JhcCA9IHZhbCA9PiB2YWwgfSA9IHt9KSB7XG4gIC8vIOmAiemhueaUtumbhlxuICBjb25zdCBvcHRpb25zID0geyBpc1dyYXAsIHVud3JhcCB9O1xuICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gIGlmIChpc1dyYXAoZGF0YSkpIHtcbiAgICByZXR1cm4gdGhpcy5kZWVwVW53cmFwKHVud3JhcChkYXRhKSwgb3B0aW9ucyk7XG4gIH1cbiAgLy8g6YCS5b2S5aSE55CG55qE57G75Z6LXG4gIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAodmFsID0+IHRoaXMuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpKTtcbiAgfVxuICBpZiAodGhpcy5nZXRFeGFjdFR5cGUoZGF0YSkgPT09IE9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICByZXR1cm4gW2tleSwgdGhpcy5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucyldO1xuICAgIH0pKTtcbiAgfVxuICAvLyDlhbbku5bljp/moLfov5Tlm55cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiLy8g6L6F5YqpXG5leHBvcnQgY29uc3QgU3VwcG9ydCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICog5bGe5oCn5ZCN57uf5LiA5oiQ5pWw57uE5qC85byPXG4gKiBAcGFyYW0gbmFtZXMg5bGe5oCn5ZCN44CC5qC85byPICdhLGIsYycg5oiWIFsnYScsJ2InLCdjJ11cbiAqIEBwYXJhbSBzZXBhcmF0b3IgbmFtZXMg5Li65a2X56ym5Liy5pe255qE5ouG5YiG6KeE5YiZ44CC5ZCMIHNwbGl0IOaWueazleeahCBzZXBhcmF0b3LvvIzlrZfnrKbkuLLml6DpnIDmi4bliIbnmoTlj6/ku6XkvKAgbnVsbCDmiJYgdW5kZWZpbmVkXG4gKiBAcmV0dXJucyB7KltdW118KE1hZ2ljU3RyaW5nIHwgQnVuZGxlIHwgc3RyaW5nKVtdfEZsYXRBcnJheTwoRmxhdEFycmF5PCgqfFsqW11dfFtdKVtdLCAxPltdfCp8WypbXV18W10pW10sIDE+W118KltdfVxuICovXG5TdXBwb3J0Lm5hbWVzVG9BcnJheSA9IGZ1bmN0aW9uKG5hbWVzID0gW10sIHsgc2VwYXJhdG9yID0gJywnIH0gPSB7fSkge1xuICBpZiAobmFtZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBuYW1lcy5tYXAodmFsID0+IHRoaXMubmFtZXNUb0FycmF5KHZhbCkpLmZsYXQoKTtcbiAgfVxuICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBuYW1lcy5zcGxpdChzZXBhcmF0b3IpLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICB9XG4gIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzeW1ib2wnKSB7XG4gICAgcmV0dXJuIFtuYW1lc107XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuLyoqXG4gKiDnu5Hlrpp0aGlz44CC5bi455So5LqO6Kej5p6E5Ye95pWw5pe257uR5a6aIHRoaXMg6YG/5YWN5oql6ZSZXG4gKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuU3VwcG9ydC5iaW5kVGhpcyA9IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBuZXcgUHJveHkodGFyZ2V0LCB7XG4gICAgZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQoLi4uYXJndW1lbnRzKTtcbiAgICAgIC8vIOWHveaVsOexu+Wei+e7keWumnRoaXNcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blsZ7mgKfljp/moLfov5Tlm55cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICB9KTtcbn07XG4iLCIvLyDlr7nosaFcbmltcG9ydCB7IF9SZWZsZWN0IH0gZnJvbSAnLi9fUmVmbGVjdCc7XG5pbXBvcnQgeyBEYXRhIH0gZnJvbSAnLi9EYXRhJztcbmltcG9ydCB7IFN1cHBvcnQgfSBmcm9tICcuL1N1cHBvcnQnO1xuXG4vLyBleHRlbmRzIE9iamVjdCDmlrnlvI/osIPnlKggc3VwZXIg5bCG55Sf5oiQ56m65a+56LGh77yM5LiN5Lya5YOP5pmu6YCa5p6E6YCg5Ye95pWw6YKj5qC35Yib5bu65LiA5Liq5paw55qE5a+56LGh77yM5pS55a6e546wXG5leHBvcnQgY2xhc3MgX09iamVjdCB7XG4gIC8qKlxuICAgKiBzdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBjcmVhdGUg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBmcm9tRW50cmllcyDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGlzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZ2V0UHJvdG90eXBlT2Yg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBzZXRQcm90b3R5cGVPZiDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGhhc093biDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGRlZmluZVByb3BlcnR5IOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZGVmaW5lUHJvcGVydGllcyDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5RGVzY3JpcHRvciDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eU5hbWVzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlTeW1ib2xzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgcHJldmVudEV4dGVuc2lvbnMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBzZWFsIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZnJlZXplIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgaXNFeHRlbnNpYmxlIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgaXNTZWFsZWQg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBpc0Zyb3plbiDml6DpnIDlrprliLZcblxuICAvKipcbiAgICogKOWumuWItuaWueazlSkg5rWF5ZCI5bm25a+56LGh44CC5YaZ5rOV5ZCMIE9iamVjdC5hc3NpZ27vvIzpgJrov4fph43lrprkuYnmlrnlvI/lkIjlubbvvIzop6PlhrMgT2JqZWN0LmFzc2lnbiDlkIjlubbkuKTovrnlkIzlkI3lsZ7mgKfmt7fmnIkgdmFsdWXlhpnms5Ug5ZKMIGdldC9zZXTlhpnms5Ug5pe25oqlIFR5cGVFcnJvcjogQ2Fubm90IHNldCBwcm9wZXJ0eSBiIG9mICM8T2JqZWN0PiB3aGljaCBoYXMgb25seSBhIGdldHRlciDnmoTpl67pophcbiAgICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaFcbiAgICogQHBhcmFtIHNvdXJjZXMg5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBhc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICAvLyDkuI3kvb/nlKggdGFyZ2V0W2tleV0gPSB2YWx1ZSDlhpnms5XvvIznm7TmjqXkvb/nlKggT2JqZWN0LmRlZmluZVByb3BlcnR5IOmHjeWumuS5iVxuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOa3seWQiOW5tuWvueixoeOAguWQjCBhc3NpZ24g5LiA5qC35Lmf5Lya5a+55bGe5oCn6L+b6KGM6YeN5a6a5LmJXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGh44CC6buY6K6k5YC8IHt9IOmYsuatoumAkuW9kuaXtuaKpSBUeXBlRXJyb3I6IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdFxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGRlZXBBc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAvLyB2YWx1ZSDlhpnms5XvvJrlr7nosaHpgJLlvZLlpITnkIbvvIzlhbbku5bnm7TmjqXlrprkuYlcbiAgICAgICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGRlc2MudmFsdWUpKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcEFzc2lnbih0YXJnZXRba2V5XSwgZGVzYy52YWx1ZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0L3NldCDlhpnms5XvvJrnm7TmjqXlrprkuYlcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6I635Y+W5bGe5oCn5ZCN44CC6buY6K6k5Y+C5pWw6YWN572u5oiQ5ZCMIE9iamVjdC5rZXlzIOihjOS4ulxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7YW55W119XG4gICAqL1xuICBzdGF0aWMga2V5cyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICAvLyBzZXTnlKjkuo5rZXnljrvph41cbiAgICBsZXQgc2V0ID0gbmV3IFNldCgpO1xuICAgIC8vIOiHqui6q+WxnuaAp+etm+mAiVxuICAgIGNvbnN0IGRlc2NzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqZWN0KTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIF9SZWZsZWN0Lm93bkVudHJpZXMoZGVzY3MpKSB7XG4gICAgICAvLyDlv73nlaVzeW1ib2zlsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghc3ltYm9sICYmIHR5cGVvZiBrZXkgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5b+955Wl5LiN5Y+v5YiX5Li+5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIW5vdEVudW1lcmFibGUgJiYgIWRlc2MuZW51bWVyYWJsZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWxnuaAp+WKoOWFpVxuICAgICAgc2V0LmFkZChrZXkpO1xuICAgIH1cbiAgICAvLyDnu6fmib/lsZ7mgKdcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICAgIGlmIChfX3Byb3RvX18gIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgcGFyZW50S2V5cyA9IHRoaXMua2V5cyhfX3Byb3RvX18sIG9wdGlvbnMpO1xuICAgICAgICBmb3IgKGNvbnN0IHBhcmVudEtleSBvZiBwYXJlbnRLZXlzKSB7XG4gICAgICAgICAgc2V0LmFkZChwYXJlbnRLZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIOi/lOWbnuaVsOe7hFxuICAgIHJldHVybiBBcnJheS5mcm9tKHNldCk7XG4gIH1cblxuICAvKipcbiAgICogKOWumuWItuaWueazlSlcbiAgICovXG4gIHN0YXRpYyB2YWx1ZXMoKSB7XG4gIH1cblxuICAvKipcbiAgICogKOWumuWItuaWueazlSlcbiAgICovXG4gIHN0YXRpYyBlbnRyaWVzKCkge1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIGtleeiHqui6q+aJgOWxnueahOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5IOWxnuaAp+WQjVxuICAgKiBAcmV0dXJucyB7KnxudWxsfVxuICAgKi9cbiAgc3RhdGljIG93bmVyKG9iamVjdCwga2V5KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3duZXIoX19wcm90b19fLCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOiOt+WPluWxnuaAp+aPj+i/sOWvueixoe+8jOebuOavlCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9y77yM6IO95ou/5Yiw57un5om/5bGe5oCn55qE5o+P6L+w5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3RcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfFByb3BlcnR5RGVzY3JpcHRvcn1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9yKG9iamVjdCwga2V5KSB7XG4gICAgY29uc3QgZmluZE9iamVjdCA9IHRoaXMub3duZXIob2JqZWN0LCBrZXkpO1xuICAgIGlmICghZmluZE9iamVjdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZmluZE9iamVjdCwga2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvcnPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMgeyhQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkKVtdfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3JzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IF9rZXlzID0gdGhpcy5rZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9rZXlzLm1hcChrZXkgPT4gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KSk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3JFbnRyaWVz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHtbKiwoUHJvcGVydHlEZXNjcmlwdG9yfHVuZGVmaW5lZCldW119XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvckVudHJpZXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3QgX2tleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2tleXMubWFwKGtleSA9PiBba2V5LCB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpXSk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6L+H5ruk5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBwaWNrIOaMkemAieWxnuaAp1xuICAgKiBAcGFyYW0gb21pdCDlv73nlaXlsZ7mgKdcbiAgICogQHBhcmFtIGVtcHR5UGljayBwaWNrIOS4uuepuuaXtueahOWPluWAvOOAgmFsbCDlhajpg6hrZXnvvIxlbXB0eSDnqbpcbiAgICogQHBhcmFtIHNlcGFyYXRvciDlkIwgbmFtZXNUb0FycmF5IOeahCBzZXBhcmF0b3Ig5Y+C5pWwXG4gICAqIEBwYXJhbSBzeW1ib2wg5ZCMIGtleXMg55qEIHN5bWJvbCDlj4LmlbBcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5ZCMIGtleXMg55qEIG5vdEVudW1lcmFibGUg5Y+C5pWwXG4gICAqIEBwYXJhbSBleHRlbmQg5ZCMIGtleXMg55qEIGV4dGVuZCDlj4LmlbBcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGZpbHRlcihvYmplY3QsIHsgcGljayA9IFtdLCBvbWl0ID0gW10sIGVtcHR5UGljayA9ICdhbGwnLCBzZXBhcmF0b3IgPSAnLCcsIHN5bWJvbCA9IHRydWUsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgLy8gcGlja+OAgW9taXQg57uf5LiA5oiQ5pWw57uE5qC85byPXG4gICAgcGljayA9IFN1cHBvcnQubmFtZXNUb0FycmF5KHBpY2ssIHsgc2VwYXJhdG9yIH0pO1xuICAgIG9taXQgPSBTdXBwb3J0Lm5hbWVzVG9BcnJheShvbWl0LCB7IHNlcGFyYXRvciB9KTtcbiAgICBsZXQgX2tleXMgPSBbXTtcbiAgICAvLyBwaWNr5pyJ5YC855u05o6l5ou/77yM5Li656m65pe25qC55o2uIGVtcHR5UGljayDpu5jorqTmi7/nqbrmiJblhajpg6hrZXlcbiAgICBfa2V5cyA9IHBpY2subGVuZ3RoID4gMCB8fCBlbXB0eVBpY2sgPT09ICdlbXB0eScgPyBwaWNrIDogdGhpcy5rZXlzKG9iamVjdCwgeyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9KTtcbiAgICAvLyBvbWl0562b6YCJXG4gICAgX2tleXMgPSBfa2V5cy5maWx0ZXIoa2V5ID0+ICFvbWl0LmluY2x1ZGVzKGtleSkpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIF9rZXlzKSB7XG4gICAgICBjb25zdCBkZXNjID0gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KTtcbiAgICAgIC8vIOWxnuaAp+S4jeWtmOWcqOWvvOiHtGRlc2PlvpfliLB1bmRlZmluZWTml7bkuI3orr7nva7lgLxcbiAgICAgIGlmIChkZXNjKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6YCa6L+H5oyR6YCJ5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVyIOeahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIHBpY2sob2JqZWN0LCBrZXlzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihvYmplY3QsIHsgcGljazoga2V5cywgZW1wdHlQaWNrOiAnZW1wdHknLCAuLi5vcHRpb25zIH0pO1xuICB9XG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDpgJrov4fmjpLpmaTmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXIg55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgb21pdChvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBvbWl0OiBrZXlzLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IHt9KSB7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5hc3NpZ24odGhpcywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gKOWumuWItuaWueazlSlcbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9TdHJpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe30pO1xuICAgIH1cbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcykubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuT2JqZWN0LnNldFByb3RvdHlwZU9mKF9PYmplY3QsIE9iamVjdCk7XG4iLCJleHBvcnQgY2xhc3MgX1N0cmluZyBleHRlbmRzIFN0cmluZyB7XG4gIC8qKlxuICAgKiBTdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBmcm9tQ2hhckNvZGUg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBmcm9tQ29kZVBvaW50IOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgcmF3IOaXoOmcgOWumuWItlxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDpppblrZfmr43lpKflhplcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0ZpcnN0VXBwZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9VcHBlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDpppblrZfmr43lsI/lhplcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9GaXJzdExvd2VyQ2FzZShuYW1lID0gJycpIHtcbiAgICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvTG93ZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6L2s6am85bOw5ZG95ZCN44CC5bi455So5LqO6L+e5o6l56ym5ZG95ZCN6L2s6am85bOw5ZG95ZCN77yM5aaCIHh4LW5hbWUgLT4geHhOYW1lXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOi/nuaOpeespuOAgueUqOS6jueUn+aIkOato+WImSDpu5jorqTkuLrkuK3liJLnur8gLSDlr7nlupRyZWdleHDlvpfliLAgLy0oXFx3KS9nXG4gICAqIEBwYXJhbSBmaXJzdCDpppblrZfmr43lpITnkIbmlrnlvI/jgIJ0cnVlIOaIliAndXBwZXJjYXNlJ++8mui9rOaNouaIkOWkp+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSDmiJYgJ2xvd2VyY2FzZSfvvJrovazmjaLmiJDlsI/lhpk7XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Jhdycg5oiWIOWFtuS7luaXoOaViOWAvO+8mum7mOiupOWOn+agt+i/lOWbnu+8jOS4jei/m+ihjOWkhOeQhjtcbiAgICogQHJldHVybnMge01hZ2ljU3RyaW5nfHN0cmluZ3xzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9DYW1lbENhc2UobmFtZSwgeyBzZXBhcmF0b3IgPSAnLScsIGZpcnN0ID0gJ3JhdycgfSA9IHt9KSB7XG4gICAgLy8g55Sf5oiQ5q2j5YiZXG4gICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cChgJHtzZXBhcmF0b3J9KFxcXFx3KWAsICdnJyk7XG4gICAgLy8g5ou85o6l5oiQ6am85bOwXG4gICAgY29uc3QgY2FtZWxOYW1lID0gbmFtZS5yZXBsYWNlQWxsKHJlZ2V4cCwgKHN1YnN0ciwgJDEpID0+IHtcbiAgICAgIHJldHVybiAkMS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICAgIC8vIOmmluWtl+avjeWkp+Wwj+WGmeagueaNruS8oOWPguWIpOaWrVxuICAgIGlmIChbdHJ1ZSwgJ3VwcGVyY2FzZSddLmluY2x1ZGVzKGZpcnN0KSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9GaXJzdFVwcGVyQ2FzZShjYW1lbE5hbWUpO1xuICAgIH1cbiAgICBpZiAoW2ZhbHNlLCAnbG93ZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0ZpcnN0TG93ZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBjYW1lbE5hbWU7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6L2s6L+e5o6l56ym5ZG95ZCN44CC5bi455So5LqO6am85bOw5ZG95ZCN6L2s6L+e5o6l56ym5ZG95ZCN77yM5aaCIHh4TmFtZSAtPiB4eC1uYW1lXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOi/nuaOpeesplxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvTGluZUNhc2UobmFtZSA9ICcnLCB7IHNlcGFyYXRvciA9ICctJyB9ID0ge30pIHtcbiAgICByZXR1cm4gbmFtZVxuICAgIC8vIOaMiei/nuaOpeespuaLvOaOpVxuICAgICAgLnJlcGxhY2VBbGwoLyhbYS16XSkoW0EtWl0pL2csIGAkMSR7c2VwYXJhdG9yfSQyYClcbiAgICAvLyDovazlsI/lhplcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICB9XG59XG4iLCIvLyDmoLflvI/lpITnkIZcbmV4cG9ydCBjb25zdCBTdHlsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICog5Y2V5L2N5a2X56ym5Liy44CC5a+55pWw5a2X5oiW5pWw5a2X5qC85byP55qE5a2X56ym5Liy6Ieq5Yqo5ou85Y2V5L2N77yM5YW25LuW5a2X56ym5Liy5Y6f5qC36L+U5ZueXG4gKiBAcGFyYW0gdmFsdWUg5YC8XG4gKiBAcGFyYW0gdW5pdCDljZXkvY3jgIJ2YWx1ZeayoeW4puWNleS9jeaXtuiHquWKqOaLvOaOpe+8jOWPr+S8oCBweC9lbS8lIOetiVxuICogQHJldHVybnMge3N0cmluZ3xzdHJpbmd9XG4gKi9cblN0eWxlLmdldFVuaXRTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSA9ICcnLCB7IHVuaXQgPSAncHgnIH0gPSB7fSkge1xuICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIC8vIOazqOaEj++8mui/memHjOS9v+eUqCA9PSDliKTmlq3vvIzkuI3kvb/nlKggPT09XG4gIHJldHVybiBOdW1iZXIodmFsdWUpID09IHZhbHVlID8gYCR7dmFsdWV9JHt1bml0fWAgOiBTdHJpbmcodmFsdWUpO1xufTtcbiIsIi8vIHZ1ZSDmlbDmja7lpITnkIZcbmltcG9ydCB7IF9TdHJpbmcgfSBmcm9tICcuL19TdHJpbmcnO1xuaW1wb3J0IHsgRGF0YSB9IGZyb20gJy4vRGF0YSc7XG5cbmV4cG9ydCBjb25zdCBWdWVEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gICAqIOa3seino+WMhSB2dWUzIOWTjeW6lOW8j+WvueixoeaVsOaNrlxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcmV0dXJucyB7e1twOiBzdHJpbmddOiAqfHtbcDogc3RyaW5nXTogKn19fCp8KCp8e1twOiBzdHJpbmddOiAqfSlbXXx7W3A6IHN0cmluZ106ICp9fVxuICAgKi9cblZ1ZURhdGEuZGVlcFVud3JhcFZ1ZTMgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHJldHVybiBEYXRhLmRlZXBVbndyYXAoZGF0YSwge1xuICAgIGlzV3JhcDogZGF0YSA9PiBkYXRhPy5fX3ZfaXNSZWYsXG4gICAgdW53cmFwOiBkYXRhID0+IGRhdGEudmFsdWUsXG4gIH0pO1xufTtcblxuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgcHJvcHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIHByb3BEZWZpbml0aW9ucyBwcm9wcyDlrprkuYnvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldFByb3BzRnJvbUF0dHJzID0gZnVuY3Rpb24oYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAvLyBwcm9wcyDlrprkuYnnu5/kuIDmiJDlr7nosaHmoLzlvI/vvIx0eXBlIOe7n+S4gOaIkOaVsOe7hOagvOW8j+S7peS+v+WQjue7reWIpOaWrVxuICBpZiAocHJvcERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCB7IHR5cGU6IFtdIH1dKSk7XG4gIH0gZWxzZSBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KHByb3BEZWZpbml0aW9ucykpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKS5tYXAoKFtuYW1lLCBkZWZpbml0aW9uXSkgPT4ge1xuICAgICAgZGVmaW5pdGlvbiA9IERhdGEuaXNQbGFpbk9iamVjdChkZWZpbml0aW9uKVxuICAgICAgICA/IHsgLi4uZGVmaW5pdGlvbiwgdHlwZTogW2RlZmluaXRpb24udHlwZV0uZmxhdCgpIH1cbiAgICAgICAgOiB7IHR5cGU6IFtkZWZpbml0aW9uXS5mbGF0KCkgfTtcbiAgICAgIHJldHVybiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgZGVmaW5pdGlvbl07XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IHt9O1xuICB9XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgLy8gcHJvcE5hbWUg5oiWIHByb3AtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSBfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICAvLyDlj6rljIXlkKtCb29sZWFu57G75Z6L55qEJyfovazmjaLkuLp0cnVl77yM5YW25LuW5Y6f5qC36LWL5YC8XG4gICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gZGVmaW5pdGlvbi50eXBlLmxlbmd0aCA9PT0gMSAmJiBkZWZpbml0aW9uLnR5cGUuaW5jbHVkZXMoQm9vbGVhbikgJiYgYXR0clZhbHVlID09PSAnJyA/IHRydWUgOiBhdHRyVmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIHByb3AtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2V0UmVzdWx0KHsgbmFtZTogX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpLCBkZWZpbml0aW9uLCBlbmQ6IHRydWUgfSk7XG4gICAgfSkoe1xuICAgICAgbmFtZSwgZGVmaW5pdGlvbixcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgZW1pdHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIGVtaXREZWZpbml0aW9ucyBlbWl0cyDlrprkuYnvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldEVtaXRzRnJvbUF0dHJzID0gZnVuY3Rpb24oYXR0cnMsIGVtaXREZWZpbml0aW9ucykge1xuICAvLyBlbWl0cyDlrprkuYnnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChlbWl0RGVmaW5pdGlvbnMpKSB7XG4gICAgZW1pdERlZmluaXRpb25zID0gT2JqZWN0LmtleXMoZW1pdERlZmluaXRpb25zKTtcbiAgfSBlbHNlIGlmICghKGVtaXREZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGVtaXREZWZpbml0aW9ucyA9IFtdO1xuICB9XG4gIC8vIOe7n+S4gOWkhOeQhuaIkCBvbkVtaXROYW1l44CBb25VcGRhdGU6ZW1pdE5hbWUodi1tb2RlbOezu+WIlykg5qC85byPXG4gIGNvbnN0IGVtaXROYW1lcyA9IGVtaXREZWZpbml0aW9ucy5tYXAobmFtZSA9PiBfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgKGZ1bmN0aW9uIHNldFJlc3VsdCh7IG5hbWUsIGVuZCA9IGZhbHNlIH0pIHtcbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uVXBkYXRlOicpKSB7XG4gICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2V0UmVzdWx0KHsgbmFtZTogYG9uVXBkYXRlOiR7X1N0cmluZy50b0xpbmVDYXNlKG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKSl9YCwgZW5kOiB0cnVlIH0pO1xuICAgICAgfVxuICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgcmVzdWx0W25hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICB9XG4gICAgfSkoeyBuYW1lIH0pO1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5bliankvZnlsZ7mgKfjgILluLjnlKjkuo7nu4Tku7YgaW5oZXJpdEF0dHJzIOiuvue9riBmYWxzZSDml7bkvb/nlKjkvZzkuLrmlrDnmoQgYXR0cnNcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcHMgcHJvcHMg5a6a5LmJIOaIliB2dWUgcHJvcHPvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqIEBwYXJhbSBlbWl0cyBlbWl0cyDlrprkuYkg5oiWIHZ1ZSBlbWl0c++8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogQHBhcmFtIGxpc3Qg6aKd5aSW55qE5pmu6YCa5bGe5oCnXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldFJlc3RGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgeyBwcm9wcywgZW1pdHMsIGxpc3QgPSBbXSB9ID0ge30pIHtcbiAgLy8g57uf5LiA5oiQ5pWw57uE5qC85byPXG4gIHByb3BzID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSAoKCkgPT4ge1xuICAgICAgaWYgKHByb3BzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgfVxuICAgICAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChwcm9wcykpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9KSgpO1xuICAgIHJldHVybiBhcnIubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgfSkoKTtcbiAgZW1pdHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAoZW1pdHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gZW1pdHM7XG4gICAgICB9XG4gICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGVtaXRzKSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZW1pdHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGFyci5tYXAoKG5hbWUpID0+IHtcbiAgICAgIC8vIHVwZGF0ZTplbWl0TmFtZSDmiJYgdXBkYXRlOmVtaXQtbmFtZSDmoLzlvI9cbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ3VwZGF0ZTonKSkge1xuICAgICAgICBjb25zdCBwYXJ0TmFtZSA9IG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKTtcbiAgICAgICAgcmV0dXJuIFtgb25VcGRhdGU6JHtfU3RyaW5nLnRvQ2FtZWxDYXNlKHBhcnROYW1lKX1gLCBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UocGFydE5hbWUpfWBdO1xuICAgICAgfVxuICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCldO1xuICAgIH0pLmZsYXQoKTtcbiAgfSkoKTtcbiAgbGlzdCA9ICgoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gdHlwZW9mIGxpc3QgPT09ICdzdHJpbmcnXG4gICAgICA/IGxpc3Quc3BsaXQoJywnKVxuICAgICAgOiBsaXN0IGluc3RhbmNlb2YgQXJyYXkgPyBsaXN0IDogW107XG4gICAgcmV0dXJuIGFyci5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgfSkoKTtcbiAgY29uc3QgbGlzdEFsbCA9IEFycmF5LmZyb20obmV3IFNldChbcHJvcHMsIGVtaXRzLCBsaXN0XS5mbGF0KCkpKTtcbiAgLy8gY29uc29sZS5sb2coJ2xpc3RBbGwnLCBsaXN0QWxsKTtcbiAgLy8g6K6+572u5YC8XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBbbmFtZSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoYXR0cnMpKSkge1xuICAgIGlmICghbGlzdEFsbC5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgbmFtZSwgZGVzYyk7XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIOWfuuehgOaooeWdl+OAguacieWQjOWQjeWOn+eUn+WvueixoeeahOWKoCBfIOWMuuWIhlxuZXhwb3J0ICogZnJvbSAnLi9fQXJyYXknO1xuZXhwb3J0ICogZnJvbSAnLi9fQm9vbGVhbic7XG5leHBvcnQgKiBmcm9tICcuL19EYXRlJztcbmV4cG9ydCAqIGZyb20gJy4vX01hdGgnO1xuZXhwb3J0ICogZnJvbSAnLi9fTnVtYmVyJztcbmV4cG9ydCAqIGZyb20gJy4vX09iamVjdCc7XG5leHBvcnQgKiBmcm9tICcuL19SZWZsZWN0JztcbmV4cG9ydCAqIGZyb20gJy4vX1NldCc7XG5leHBvcnQgKiBmcm9tICcuL19TdHJpbmcnO1xuXG5leHBvcnQgKiBmcm9tICcuL0RhdGEnO1xuZXhwb3J0ICogZnJvbSAnLi9TdHlsZSc7XG5leHBvcnQgKiBmcm9tICcuL1N1cHBvcnQnO1xuZXhwb3J0ICogZnJvbSAnLi9WdWVEYXRhJztcbiIsIi8qKlxuICogZXNsaW50IOmFjee9ru+8mmh0dHA6Ly9lc2xpbnQuY24vZG9jcy9ydWxlcy9cbiAqIGVzbGludC1wbHVnaW4tdnVlIOmFjee9ru+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy9ydWxlcy9cbiAqL1xuaW1wb3J0IHsgX09iamVjdCwgRGF0YSB9IGZyb20gJy4uL2Jhc2UnO1xuXG4vKipcbiAqIOWvvOWHuuW4uOmHj+S+v+aNt+S9v+eUqFxuICovXG5leHBvcnQgY29uc3QgT0ZGID0gJ29mZic7XG5leHBvcnQgY29uc3QgV0FSTiA9ICd3YXJuJztcbmV4cG9ydCBjb25zdCBFUlJPUiA9ICdlcnJvcic7XG4vKipcbiAqIOWumuWItueahOmFjee9rlxuICovXG4vLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICAvLyDnjq/looPjgILkuIDkuKrnjq/looPlrprkuYnkuobkuIDnu4TpooTlrprkuYnnmoTlhajlsYDlj5jph49cbiAgZW52OiB7XG4gICAgYnJvd3NlcjogdHJ1ZSxcbiAgICBub2RlOiB0cnVlLFxuICB9LFxuICAvLyDlhajlsYDlj5jph49cbiAgZ2xvYmFsczoge1xuICAgIGdsb2JhbFRoaXM6ICdyZWFkb25seScsXG4gICAgQmlnSW50OiAncmVhZG9ubHknLFxuICB9LFxuICAvLyDop6PmnpDlmahcbiAgcGFyc2VyT3B0aW9uczoge1xuICAgIGVjbWFWZXJzaW9uOiAnbGF0ZXN0JyxcbiAgICBzb3VyY2VUeXBlOiAnbW9kdWxlJyxcbiAgICBlY21hRmVhdHVyZXM6IHtcbiAgICAgIGpzeDogdHJ1ZSxcbiAgICAgIGV4cGVyaW1lbnRhbE9iamVjdFJlc3RTcHJlYWQ6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgLyoqXG4gICAqIOe7p+aJv1xuICAgKiDkvb/nlKhlc2xpbnTnmoTop4TliJnvvJplc2xpbnQ66YWN572u5ZCN56ewXG4gICAqIOS9v+eUqOaPkuS7tueahOmFjee9ru+8mnBsdWdpbjrljIXlkI3nroDlhpkv6YWN572u5ZCN56ewXG4gICAqL1xuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIGVzbGludCDmjqjojZDnmoTop4TliJlcbiAgICAnZXNsaW50OnJlY29tbWVuZGVkJyxcbiAgXSxcbiAgLyoqXG4gICAqIOinhOWImVxuICAgKiDmnaXoh6ogZXNsaW50IOeahOinhOWIme+8muinhOWImUlEIDogdmFsdWVcbiAgICog5p2l6Ieq5o+S5Lu255qE6KeE5YiZ77ya5YyF5ZCN566A5YaZL+inhOWImUlEIDogdmFsdWVcbiAgICovXG4gIHJ1bGVzOiB7XG4gICAgLyoqXG4gICAgICogUG9zc2libGUgRXJyb3JzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5LiOIEphdmFTY3JpcHQg5Luj56CB5Lit5Y+v6IO955qE6ZSZ6K+v5oiW6YC76L6R6ZSZ6K+v5pyJ5YWz77yaXG4gICAgICovXG4gICAgJ2dldHRlci1yZXR1cm4nOiBPRkYsIC8vIOW8uuWItiBnZXR0ZXIg5Ye95pWw5Lit5Ye6546wIHJldHVybiDor63lj6VcbiAgICAnbm8tY29uc3RhbnQtY29uZGl0aW9uJzogT0ZGLCAvLyDnpoHmraLlnKjmnaHku7bkuK3kvb/nlKjluLjph4/ooajovr7lvI9cbiAgICAnbm8tZW1wdHknOiBPRkYsIC8vIOemgeatouWHuueOsOepuuivreWPpeWdl1xuICAgICduby1leHRyYS1zZW1pJzogV0FSTiwgLy8g56aB5q2i5LiN5b+F6KaB55qE5YiG5Y+3XG4gICAgJ25vLWZ1bmMtYXNzaWduJzogT0ZGLCAvLyDnpoHmraLlr7kgZnVuY3Rpb24g5aOw5piO6YeN5paw6LWL5YC8XG4gICAgJ25vLXByb3RvdHlwZS1idWlsdGlucyc6IE9GRiwgLy8g56aB5q2i55u05o6l6LCD55SoIE9iamVjdC5wcm90b3R5cGVzIOeahOWGhee9ruWxnuaAp1xuXG4gICAgLyoqXG4gICAgICogQmVzdCBQcmFjdGljZXNcbiAgICAgKiDov5nkupvop4TliJnmmK/lhbPkuo7mnIDkvbPlrp7ot7XnmoTvvIzluK7liqnkvaDpgb/lhY3kuIDkupvpl67popjvvJpcbiAgICAgKi9cbiAgICAnYWNjZXNzb3ItcGFpcnMnOiBFUlJPUiwgLy8g5by65Yi2IGdldHRlciDlkowgc2V0dGVyIOWcqOWvueixoeS4reaIkOWvueWHuueOsFxuICAgICdhcnJheS1jYWxsYmFjay1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmlbDnu4Tmlrnms5XnmoTlm57osIPlh73mlbDkuK3mnIkgcmV0dXJuIOivreWPpVxuICAgICdibG9jay1zY29wZWQtdmFyJzogRVJST1IsIC8vIOW8uuWItuaKiuWPmOmHj+eahOS9v+eUqOmZkOWItuWcqOWFtuWumuS5ieeahOS9nOeUqOWfn+iMg+WbtOWGhVxuICAgICdjdXJseSc6IFdBUk4sIC8vIOW8uuWItuaJgOacieaOp+WItuivreWPpeS9v+eUqOS4gOiHtOeahOaLrOWPt+mjjuagvFxuICAgICduby1mYWxsdGhyb3VnaCc6IFdBUk4sIC8vIOemgeatoiBjYXNlIOivreWPpeiQveepulxuICAgICduby1mbG9hdGluZy1kZWNpbWFsJzogRVJST1IsIC8vIOemgeatouaVsOWtl+Wtl+mdoumHj+S4reS9v+eUqOWJjeWvvOWSjOacq+WwvuWwj+aVsOeCuVxuICAgICduby1tdWx0aS1zcGFjZXMnOiBXQVJOLCAvLyDnpoHmraLkvb/nlKjlpJrkuKrnqbrmoLxcbiAgICAnbm8tbmV3LXdyYXBwZXJzJzogRVJST1IsIC8vIOemgeatouWvuSBTdHJpbmfvvIxOdW1iZXIg5ZKMIEJvb2xlYW4g5L2/55SoIG5ldyDmk43kvZznrKZcbiAgICAnbm8tcHJvdG8nOiBFUlJPUiwgLy8g56aB55SoIF9fcHJvdG9fXyDlsZ7mgKdcbiAgICAnbm8tcmV0dXJuLWFzc2lnbic6IFdBUk4sIC8vIOemgeatouWcqCByZXR1cm4g6K+t5Y+l5Lit5L2/55So6LWL5YC86K+t5Y+lXG4gICAgJ25vLXVzZWxlc3MtZXNjYXBlJzogV0FSTiwgLy8g56aB55So5LiN5b+F6KaB55qE6L2s5LmJ5a2X56ymXG5cbiAgICAvKipcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKiDov5nkupvop4TliJnkuI7lj5jph4/lo7DmmI7mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnbm8tdW5kZWYtaW5pdCc6IFdBUk4sIC8vIOemgeatouWwhuWPmOmHj+WIneWni+WMluS4uiB1bmRlZmluZWRcbiAgICAnbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOemgeatouWHuueOsOacquS9v+eUqOi/h+eahOWPmOmHj1xuICAgICduby11c2UtYmVmb3JlLWRlZmluZSc6IFtFUlJPUiwgeyAnZnVuY3Rpb25zJzogZmFsc2UsICdjbGFzc2VzJzogZmFsc2UsICd2YXJpYWJsZXMnOiBmYWxzZSB9XSwgLy8g56aB5q2i5Zyo5Y+Y6YeP5a6a5LmJ5LmL5YmN5L2/55So5a6D5LusXG5cbiAgICAvKipcbiAgICAgKiBTdHlsaXN0aWMgSXNzdWVzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5piv5YWz5LqO6aOO5qC85oyH5Y2X55qE77yM6ICM5LiU5piv6Z2e5bi45Li76KeC55qE77yaXG4gICAgICovXG4gICAgJ2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdibG9jay1zcGFjaW5nJzogV0FSTiwgLy8g56aB5q2i5oiW5by65Yi25Zyo5Luj56CB5Z2X5Lit5byA5ous5Y+35YmN5ZKM6Zet5ous5Y+35ZCO5pyJ56m65qC8XG4gICAgJ2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSwgLy8g5by65Yi25Zyo5Luj56CB5Z2X5Lit5L2/55So5LiA6Ie055qE5aSn5ous5Y+36aOO5qC8XG4gICAgJ2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLCAvLyDopoHmsYLmiJbnpoHmraLmnKvlsL7pgJflj7dcbiAgICAnY29tbWEtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOmAl+WPt+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdjb21tYS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOmAl+WPt+mjjuagvFxuICAgICdjb21wdXRlZC1wcm9wZXJ0eS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6K6h566X55qE5bGe5oCn55qE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Z1bmMtY2FsbC1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5Ye95pWw5qCH6K+G56ym5ZKM5YW26LCD55So5LmL6Ze05pyJ56m65qC8XG4gICAgJ2Z1bmN0aW9uLXBhcmVuLW5ld2xpbmUnOiBXQVJOLCAvLyDlvLrliLblnKjlh73mlbDmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTmjaLooYxcbiAgICAnaW1wbGljaXQtYXJyb3ctbGluZWJyZWFrJzogV0FSTiwgLy8g5by65Yi26ZqQ5byP6L+U5Zue55qE566t5aS05Ye95pWw5L2T55qE5L2N572uXG4gICAgJ2luZGVudCc6IFtXQVJOLCAyLCB7ICdTd2l0Y2hDYXNlJzogMSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE57yp6L+bXG4gICAgJ2pzeC1xdW90ZXMnOiBXQVJOLCAvLyDlvLrliLblnKggSlNYIOWxnuaAp+S4reS4gOiHtOWcsOS9v+eUqOWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdrZXktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWvueixoeWtl+mdoumHj+eahOWxnuaAp+S4remUruWSjOWAvOS5i+mXtOS9v+eUqOS4gOiHtOeahOmXtOi3nVxuICAgICdrZXl3b3JkLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlhbPplK7lrZfliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbmV3LXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuaIluemgeatouiwg+eUqOaXoOWPguaehOmAoOWHveaVsOaXtuacieWchuaLrOWPt1xuICAgICduby1taXhlZC1zcGFjZXMtYW5kLXRhYnMnOiBXQVJOLFxuICAgICduby1tdWx0aXBsZS1lbXB0eS1saW5lcyc6IFtXQVJOLCB7ICdtYXgnOiAxLCAnbWF4RU9GJzogMCwgJ21heEJPRic6IDAgfV0sIC8vIOemgeatouWHuueOsOWkmuihjOepuuihjFxuICAgICduby10cmFpbGluZy1zcGFjZXMnOiBXQVJOLCAvLyDnpoHnlKjooYzlsL7nqbrmoLxcbiAgICAnbm8td2hpdGVzcGFjZS1iZWZvcmUtcHJvcGVydHknOiBXQVJOLCAvLyDnpoHmraLlsZ7mgKfliY3mnInnqbrnmb1cbiAgICAnbm9uYmxvY2stc3RhdGVtZW50LWJvZHktcG9zaXRpb24nOiBXQVJOLCAvLyDlvLrliLbljZXkuKror63lj6XnmoTkvY3nva5cbiAgICAnb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLCAvLyDlvLrliLblpKfmi6zlj7flhoXmjaLooYznrKbnmoTkuIDoh7TmgKdcbiAgICAnb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLCAvLyDlvLrliLblnKjlpKfmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAncGFkZGVkLWJsb2Nrcyc6IFtXQVJOLCAnbmV2ZXInXSwgLy8g6KaB5rGC5oiW56aB5q2i5Z2X5YaF5aGr5YWFXG4gICAgJ3F1b3Rlcyc6IFtXQVJOLCAnc2luZ2xlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlLCAnYWxsb3dUZW1wbGF0ZUxpdGVyYWxzJzogdHJ1ZSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE5Y+N5Yu+5Y+344CB5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ3NlbWknOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLkvb/nlKjliIblj7fku6Pmm78gQVNJXG4gICAgJ3NlbWktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+S5i+WJjeWSjOS5i+WQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzZW1pLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25YiG5Y+355qE5L2N572uXG4gICAgJ3NwYWNlLWJlZm9yZS1ibG9ja3MnOiBXQVJOLCAvLyDlvLrliLblnKjlnZfkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtYmVmb3JlLWZ1bmN0aW9uLXBhcmVuJzogW1dBUk4sIHsgJ2Fub255bW91cyc6ICduZXZlcicsICduYW1lZCc6ICduZXZlcicsICdhc3luY0Fycm93JzogJ2Fsd2F5cycgfV0sIC8vIOW8uuWItuWcqCBmdW5jdGlvbueahOW3puaLrOWPt+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbi1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLblnKjlnIbmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW5maXgtb3BzJzogV0FSTiwgLy8g6KaB5rGC5pON5L2c56ym5ZGo5Zu05pyJ56m65qC8XG4gICAgJ3NwYWNlLXVuYXJ5LW9wcyc6IFdBUk4sIC8vIOW8uuWItuWcqOS4gOWFg+aTjeS9nOespuWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZWQtY29tbWVudCc6IFdBUk4sIC8vIOW8uuWItuWcqOazqOmHiuS4rSAvLyDmiJYgLyog5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3N3aXRjaC1jb2xvbi1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHN3aXRjaCDnmoTlhpLlj7flt6blj7PmnInnqbrmoLxcbiAgICAndGVtcGxhdGUtdGFnLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjmqKHmnb/moIforrDlkozlroPku6znmoTlrZfpnaLph4/kuYvpl7TnmoTnqbrmoLxcblxuICAgIC8qKlxuICAgICAqIEVDTUFTY3JpcHQgNlxuICAgICAqIOi/meS6m+inhOWImeWPquS4jiBFUzYg5pyJ5YWzLCDljbPpgJrluLjmiYDor7TnmoQgRVMyMDE177yaXG4gICAgICovXG4gICAgJ2Fycm93LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbnrq3lpLTlh73mlbDnmoTnrq3lpLTliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnZ2VuZXJhdG9yLXN0YXItc3BhY2luZyc6IFtXQVJOLCB7ICdiZWZvcmUnOiBmYWxzZSwgJ2FmdGVyJzogdHJ1ZSwgJ21ldGhvZCc6IHsgJ2JlZm9yZSc6IHRydWUsICdhZnRlcic6IGZhbHNlIH0gfV0sIC8vIOW8uuWItiBnZW5lcmF0b3Ig5Ye95pWw5LitICog5Y+35ZGo5Zu05L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ25vLXVzZWxlc3MtcmVuYW1lJzogV0FSTiwgLy8g56aB5q2i5ZyoIGltcG9ydCDlkowgZXhwb3J0IOWSjOino+aehOi1i+WAvOaXtuWwhuW8leeUqOmHjeWRveWQjeS4uuebuOWQjOeahOWQjeWtl1xuICAgICdwcmVmZXItdGVtcGxhdGUnOiBXQVJOLCAvLyDopoHmsYLkvb/nlKjmqKHmnb/lrZfpnaLph4/ogIzpnZ7lrZfnrKbkuLLov57mjqVcbiAgICAncmVzdC1zcHJlYWQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWJqeS9meWSjOaJqeWxlei/kOeul+espuWPiuWFtuihqOi+vuW8j+S5i+mXtOacieepuuagvFxuICAgICd0ZW1wbGF0ZS1jdXJseS1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5qih5p2/5a2X56ym5Liy5Lit55qE5bWM5YWl6KGo6L6+5byP5ZGo5Zu056m65qC855qE5L2/55SoXG4gICAgJ3lpZWxkLXN0YXItc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqCB5aWVsZCog6KGo6L6+5byP5LitICog5ZGo5Zu05L2/55So56m65qC8XG4gIH0sXG4gIC8vIOimhuebllxuICBvdmVycmlkZXM6IFtdLFxufTtcbi8vIHZ1ZTIvdnVlMyDlhbHnlKhcbmV4cG9ydCBjb25zdCB2dWVDb21tb25Db25maWcgPSB7XG4gIHJ1bGVzOiB7XG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsXG4gICAgJ3Z1ZS9tdWx0aS13b3JkLWNvbXBvbmVudC1uYW1lcyc6IE9GRiwgLy8g6KaB5rGC57uE5Lu25ZCN56ew5aeL57uI5Li65aSa5a2XXG4gICAgJ3Z1ZS9uby11bnVzZWQtY29tcG9uZW50cyc6IFdBUk4sIC8vIOacquS9v+eUqOeahOe7hOS7tlxuICAgICd2dWUvbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOacquS9v+eUqOeahOWPmOmHj1xuICAgICd2dWUvcmVxdWlyZS1yZW5kZXItcmV0dXJuJzogV0FSTiwgLy8g5by65Yi25riy5p+T5Ye95pWw5oC75piv6L+U5Zue5YC8XG4gICAgJ3Z1ZS9yZXF1aXJlLXYtZm9yLWtleSc6IE9GRiwgLy8gdi1mb3LkuK3lv4Xpobvkvb/nlKhrZXlcbiAgICAndnVlL3JldHVybi1pbi1jb21wdXRlZC1wcm9wZXJ0eSc6IFdBUk4sIC8vIOW8uuWItui/lOWbnuivreWPpeWtmOWcqOS6juiuoeeul+WxnuaAp+S4rVxuICAgICd2dWUvdmFsaWQtdGVtcGxhdGUtcm9vdCc6IE9GRiwgLy8g5by65Yi25pyJ5pWI55qE5qih5p2/5qC5XG4gICAgJ3Z1ZS92YWxpZC12LWZvcic6IE9GRiwgLy8g5by65Yi25pyJ5pWI55qEdi1mb3LmjIfku6RcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZFxuICAgICd2dWUvYXR0cmlidXRlLWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlvLrliLblsZ7mgKflkI3moLzlvI9cbiAgICAndnVlL2NvbXBvbmVudC1kZWZpbml0aW9uLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDlvLrliLbnu4Tku7ZuYW1l5qC85byPXG4gICAgJ3Z1ZS9odG1sLXF1b3Rlcyc6IFtXQVJOLCAnZG91YmxlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlIH1dLCAvLyDlvLrliLYgSFRNTCDlsZ7mgKfnmoTlvJXlj7fmoLflvI9cbiAgICAndnVlL2h0bWwtc2VsZi1jbG9zaW5nJzogT0ZGLCAvLyDkvb/nlKjoh6rpl63lkIjmoIfnrb5cbiAgICAndnVlL21heC1hdHRyaWJ1dGVzLXBlci1saW5lJzogW1dBUk4sIHsgJ3NpbmdsZWxpbmUnOiBJbmZpbml0eSwgJ211bHRpbGluZSc6IDEgfV0sIC8vIOW8uuWItuavj+ihjOWMheWQq+eahOacgOWkp+WxnuaAp+aVsFxuICAgICd2dWUvbXVsdGlsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWkmuihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvcHJvcC1uYW1lLWNhc2luZyc6IE9GRiwgLy8g5Li6IFZ1ZSDnu4Tku7bkuK3nmoQgUHJvcCDlkI3np7DlvLrliLbmiafooYznibnlrprlpKflsI/lhplcbiAgICAndnVlL3JlcXVpcmUtZGVmYXVsdC1wcm9wJzogT0ZGLCAvLyBwcm9wc+mcgOimgem7mOiupOWAvFxuICAgICd2dWUvc2luZ2xlbGluZS1odG1sLWVsZW1lbnQtY29udGVudC1uZXdsaW5lJzogT0ZGLCAvLyDpnIDopoHlnKjljZXooYzlhYPntKDnmoTlhoXlrrnliY3lkI7mjaLooYxcbiAgICAndnVlL3YtYmluZC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1iaW5k5oyH5Luk6aOO5qC8XG4gICAgJ3Z1ZS92LW9uLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LW9u5oyH5Luk6aOO5qC8XG4gICAgJ3Z1ZS92LXNsb3Qtc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtc2xvdOaMh+S7pOmjjuagvFxuICAgIC8vIFByaW9yaXR5IEM6IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9uby12LWh0bWwnOiBPRkYsIC8vIOemgeatouS9v+eUqHYtaHRtbFxuICAgIC8vIFVuY2F0ZWdvcml6ZWRcbiAgICAndnVlL2Jsb2NrLXRhZy1uZXdsaW5lJzogV0FSTiwgLy8gIOWcqOaJk+W8gOWdl+e6p+agh+iusOS5i+WQjuWSjOWFs+mXreWdl+e6p+agh+iusOS5i+WJjeW8uuWItuaNouihjFxuICAgICd2dWUvaHRtbC1jb21tZW50LWNvbnRlbnQtc3BhY2luZyc6IFdBUk4sIC8vIOWcqEhUTUzms6jph4rkuK3lvLrliLbnu5/kuIDnmoTnqbrmoLxcbiAgICAndnVlL3NjcmlwdC1pbmRlbnQnOiBbV0FSTiwgMiwgeyAnYmFzZUluZGVudCc6IDEsICdzd2l0Y2hDYXNlJzogMSB9XSwgLy8g5ZyoPHNjcmlwdD7kuK3lvLrliLbkuIDoh7TnmoTnvKnov5tcbiAgICAvLyBFeHRlbnNpb24gUnVsZXPjgILlr7nlupRlc2xpbnTnmoTlkIzlkI3op4TliJnvvIzpgILnlKjkuo48dGVtcGxhdGU+5Lit55qE6KGo6L6+5byPXG4gICAgJ3Z1ZS9hcnJheS1icmFja2V0LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvYmxvY2stc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9icmFjZS1zdHlsZSc6IFtXQVJOLCAnMXRicycsIHsgJ2FsbG93U2luZ2xlTGluZSc6IHRydWUgfV0sXG4gICAgJ3Z1ZS9jb21tYS1kYW5nbGUnOiBbV0FSTiwgJ2Fsd2F5cy1tdWx0aWxpbmUnXSxcbiAgICAndnVlL2NvbW1hLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvY29tbWEtc3R5bGUnOiBXQVJOLFxuICAgICd2dWUvZnVuYy1jYWxsLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUva2V5LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUva2V5d29yZC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL29iamVjdC1jdXJseS1uZXdsaW5lJzogW1dBUk4sIHsgJ211bHRpbGluZSc6IHRydWUsICdjb25zaXN0ZW50JzogdHJ1ZSB9XSxcbiAgICAndnVlL29iamVjdC1jdXJseS1zcGFjaW5nJzogW1dBUk4sICdhbHdheXMnXSxcbiAgICAndnVlL3NwYWNlLWluLXBhcmVucyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS1pbmZpeC1vcHMnOiBXQVJOLFxuICAgICd2dWUvc3BhY2UtdW5hcnktb3BzJzogV0FSTixcbiAgICAndnVlL2Fycm93LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvcHJlZmVyLXRlbXBsYXRlJzogV0FSTixcbiAgfSxcbiAgb3ZlcnJpZGVzOiBbXG4gICAge1xuICAgICAgJ2ZpbGVzJzogWycqLnZ1ZSddLFxuICAgICAgJ3J1bGVzJzoge1xuICAgICAgICAnaW5kZW50JzogT0ZGLFxuICAgICAgfSxcbiAgICB9LFxuICBdLFxufTtcbi8vIHZ1ZTLnlKhcbmV4cG9ydCBjb25zdCB2dWUyQ29uZmlnID0gbWVyZ2UodnVlQ29tbW9uQ29uZmlnLCB7XG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggdnVlMiDmjqjojZDnmoTop4TliJlcbiAgICAncGx1Z2luOnZ1ZS9yZWNvbW1lbmRlZCcsXG4gIF0sXG59KTtcbi8vIHZ1ZTPnlKhcbmV4cG9ydCBjb25zdCB2dWUzQ29uZmlnID0gbWVyZ2UodnVlQ29tbW9uQ29uZmlnLCB7XG4gIGVudjoge1xuICAgICd2dWUvc2V0dXAtY29tcGlsZXItbWFjcm9zJzogdHJ1ZSwgLy8g5aSE55CGc2V0dXDmqKHmnb/kuK3lg48gZGVmaW5lUHJvcHMg5ZKMIGRlZmluZUVtaXRzIOi/meagt+eahOe8luivkeWZqOWuj+aKpSBuby11bmRlZiDnmoTpl67popjvvJpodHRwczovL2VzbGludC52dWVqcy5vcmcvdXNlci1ndWlkZS8jY29tcGlsZXItbWFjcm9zLXN1Y2gtYXMtZGVmaW5lcHJvcHMtYW5kLWRlZmluZWVtaXRzLWdlbmVyYXRlLW5vLXVuZGVmLXdhcm5pbmdzXG4gIH0sXG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggdnVlMyDmjqjojZDnmoTop4TliJlcbiAgICAncGx1Z2luOnZ1ZS92dWUzLXJlY29tbWVuZGVkJyxcbiAgXSxcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL25vLXRlbXBsYXRlLWtleSc6IE9GRiwgLy8g56aB5q2iPHRlbXBsYXRlPuS4reS9v+eUqGtleeWxnuaAp1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmV0dXJuLWluLWVtaXRzLXZhbGlkYXRvcic6IFdBUk4sIC8vIOW8uuWItuWcqGVtaXRz6aqM6K+B5Zmo5Lit5a2Y5Zyo6L+U5Zue6K+t5Y+lXG4gICAgLy8gUHJpb3JpdHkgQjogU3Ryb25nbHkgUmVjb21tZW5kZWQgZm9yIFZ1ZS5qcyAzLnhcbiAgICAndnVlL3JlcXVpcmUtZXhwbGljaXQtZW1pdHMnOiBPRkYsIC8vIOmcgOimgWVtaXRz5Lit5a6a5LmJ6YCJ6aG555So5LqOJGVtaXQoKVxuICAgICd2dWUvdi1vbi1ldmVudC1oeXBoZW5hdGlvbic6IE9GRiwgLy8g5Zyo5qih5p2/5Lit55qE6Ieq5a6a5LmJ57uE5Lu25LiK5by65Yi25omn6KGMIHYtb24g5LqL5Lu25ZG95ZCN5qC35byPXG4gIH0sXG59KTtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZSguLi5vYmplY3RzKSB7XG4gIGNvbnN0IFt0YXJnZXQsIC4uLnNvdXJjZXNdID0gb2JqZWN0cztcbiAgY29uc3QgcmVzdWx0ID0gRGF0YS5kZWVwQ2xvbmUodGFyZ2V0KTtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpIHtcbiAgICAgIC8vIOeJueauiuWtl+auteWkhOeQhlxuICAgICAgaWYgKGtleSA9PT0gJ3J1bGVzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IGtleSwgdmFsdWUsICdyZXN1bHRba2V5XSc6IHJlc3VsdFtrZXldIH0pO1xuICAgICAgICAvLyDliJ3lp4vkuI3lrZjlnKjml7botYvpu5jorqTlgLznlKjkuo7lkIjlubZcbiAgICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyB7fTtcbiAgICAgICAgLy8g5a+55ZCE5p2h6KeE5YiZ5aSE55CGXG4gICAgICAgIGZvciAobGV0IFtydWxlS2V5LCBydWxlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICAgIC8vIOW3suacieWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGxldCBzb3VyY2VSdWxlVmFsdWUgPSByZXN1bHRba2V5XVtydWxlS2V5XSA/PyBbXTtcbiAgICAgICAgICBpZiAoIShzb3VyY2VSdWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZSA9IFtzb3VyY2VSdWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDopoHlkIjlubbnmoTlgLznu5/kuIDmiJDmlbDnu4TlpITnkIZcbiAgICAgICAgICBpZiAoIShydWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHJ1bGVWYWx1ZSA9IFtydWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDnu5/kuIDmoLzlvI/lkI7ov5vooYzmlbDnu4Tlvqrnjq/mk43kvZxcbiAgICAgICAgICBmb3IgKGNvbnN0IFt2YWxJbmRleCwgdmFsXSBvZiBPYmplY3QuZW50cmllcyhydWxlVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyDlr7nosaHmt7HlkIjlubbvvIzlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZSh2YWwpID09PSBPYmplY3QpIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IF9PYmplY3QuZGVlcEFzc2lnbihzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID8/IHt9LCB2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g6LWL5YC86KeE5YiZ57uT5p6cXG4gICAgICAgICAgcmVzdWx0W2tleV1bcnVsZUtleV0gPSBzb3VyY2VSdWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blrZfmrrXmoLnmja7nsbvlnovliKTmlq3lpITnkIZcbiAgICAgIC8vIOaVsOe7hO+8muaLvOaOpVxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8gW10pLnB1c2goLi4udmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWvueixoe+8mua3seWQiOW5tlxuICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbHVlKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIF9PYmplY3QuZGVlcEFzc2lnbihyZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9LCB2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW55u05o6l6LWL5YC8XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDkvb/nlKjlrprliLbnmoTphY3nva5cbiAqIEBwYXJhbSB7fe+8mumFjee9rumhuVxuICogICAgICAgICAgYmFzZe+8muS9v+eUqOWfuuehgGVzbGludOWumuWItu+8jOm7mOiupCB0cnVlXG4gKiAgICAgICAgICB2dWVWZXJzaW9u77yadnVl54mI5pys77yM5byA5ZCv5ZCO6ZyA6KaB5a6J6KOFIGVzbGludC1wbHVnaW4tdnVlXG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2UoeyBiYXNlID0gdHJ1ZSwgdnVlVmVyc2lvbiB9ID0ge30pIHtcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBpZiAoYmFzZSkge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgYmFzZUNvbmZpZyk7XG4gIH1cbiAgaWYgKHZ1ZVZlcnNpb24gPT0gMikge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgdnVlMkNvbmZpZyk7XG4gIH0gZWxzZSBpZiAodnVlVmVyc2lvbiA9PSAzKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUzQ29uZmlnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiLy8g5Z+656GA5a6a5Yi2XG5leHBvcnQgY29uc3QgYmFzZUNvbmZpZyA9IHtcbiAgYmFzZTogJy4vJyxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICAvLyDliKvlkI1cbiAgICBhbGlhczoge1xuICAgICAgLy8gJ0Byb290JzogcmVzb2x2ZShfX2Rpcm5hbWUpLFxuICAgICAgLy8gJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8g6KeE5a6a6Kem5Y+R6K2m5ZGK55qEIGNodW5rIOWkp+Wwj+OAgu+8iOS7pSBrYnMg5Li65Y2V5L2N77yJXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyICoqIDEwLFxuICAgIC8vIOiHquWumuS5ieW6leWxgueahCBSb2xsdXAg5omT5YyF6YWN572u44CCXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIOWFpeWPo+aWh+S7tuWQjVxuICAgICAgICBlbnRyeUZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9lbnRyeS0ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDlnZfmlofku7blkI1cbiAgICAgICAgY2h1bmtGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLmpzYDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g6LWE5rqQ5paH5Lu25ZCN77yMY3Nz44CB5Zu+54mH562JXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5bZXh0XWA7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59O1xuIiwiLy8g6K+35rGC5pa55rOVXG5leHBvcnQgY29uc3QgTUVUSE9EUyA9IFsnR0VUJywgJ0hFQUQnLCAnUE9TVCcsICdQVVQnLCAnREVMRVRFJywgJ0NPTk5FQ1QnLCAnT1BUSU9OUycsICdUUkFDRScsICdQQVRDSCddO1xuLy8gaHR0cCDnirbmgIHnoIFcbmV4cG9ydCBjb25zdCBTVEFUVVNFUyA9IFtcbiAgeyAnc3RhdHVzJzogMTAwLCAnc3RhdHVzVGV4dCc6ICdDb250aW51ZScgfSxcbiAgeyAnc3RhdHVzJzogMTAxLCAnc3RhdHVzVGV4dCc6ICdTd2l0Y2hpbmcgUHJvdG9jb2xzJyB9LFxuICB7ICdzdGF0dXMnOiAxMDIsICdzdGF0dXNUZXh0JzogJ1Byb2Nlc3NpbmcnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMywgJ3N0YXR1c1RleHQnOiAnRWFybHkgSGludHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMCwgJ3N0YXR1c1RleHQnOiAnT0snIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMSwgJ3N0YXR1c1RleHQnOiAnQ3JlYXRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjAyLCAnc3RhdHVzVGV4dCc6ICdBY2NlcHRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjAzLCAnc3RhdHVzVGV4dCc6ICdOb24tQXV0aG9yaXRhdGl2ZSBJbmZvcm1hdGlvbicgfSxcbiAgeyAnc3RhdHVzJzogMjA0LCAnc3RhdHVzVGV4dCc6ICdObyBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDUsICdzdGF0dXNUZXh0JzogJ1Jlc2V0IENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNiwgJ3N0YXR1c1RleHQnOiAnUGFydGlhbCBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDcsICdzdGF0dXNUZXh0JzogJ011bHRpLVN0YXR1cycgfSxcbiAgeyAnc3RhdHVzJzogMjA4LCAnc3RhdHVzVGV4dCc6ICdBbHJlYWR5IFJlcG9ydGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMjYsICdzdGF0dXNUZXh0JzogJ0lNIFVzZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMCwgJ3N0YXR1c1RleHQnOiAnTXVsdGlwbGUgQ2hvaWNlcycgfSxcbiAgeyAnc3RhdHVzJzogMzAxLCAnc3RhdHVzVGV4dCc6ICdNb3ZlZCBQZXJtYW5lbnRseScgfSxcbiAgeyAnc3RhdHVzJzogMzAyLCAnc3RhdHVzVGV4dCc6ICdGb3VuZCcgfSxcbiAgeyAnc3RhdHVzJzogMzAzLCAnc3RhdHVzVGV4dCc6ICdTZWUgT3RoZXInIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNCwgJ3N0YXR1c1RleHQnOiAnTm90IE1vZGlmaWVkJyB9LFxuICB7ICdzdGF0dXMnOiAzMDUsICdzdGF0dXNUZXh0JzogJ1VzZSBQcm94eScgfSxcbiAgeyAnc3RhdHVzJzogMzA3LCAnc3RhdHVzVGV4dCc6ICdUZW1wb3JhcnkgUmVkaXJlY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwOCwgJ3N0YXR1c1RleHQnOiAnUGVybWFuZW50IFJlZGlyZWN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDAsICdzdGF0dXNUZXh0JzogJ0JhZCBSZXF1ZXN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDEsICdzdGF0dXNUZXh0JzogJ1VuYXV0aG9yaXplZCcgfSxcbiAgeyAnc3RhdHVzJzogNDAyLCAnc3RhdHVzVGV4dCc6ICdQYXltZW50IFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDMsICdzdGF0dXNUZXh0JzogJ0ZvcmJpZGRlbicgfSxcbiAgeyAnc3RhdHVzJzogNDA0LCAnc3RhdHVzVGV4dCc6ICdOb3QgRm91bmQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNSwgJ3N0YXR1c1RleHQnOiAnTWV0aG9kIE5vdCBBbGxvd2VkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDYsICdzdGF0dXNUZXh0JzogJ05vdCBBY2NlcHRhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA0MDcsICdzdGF0dXNUZXh0JzogJ1Byb3h5IEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDgsICdzdGF0dXNUZXh0JzogJ1JlcXVlc3QgVGltZW91dCcgfSxcbiAgeyAnc3RhdHVzJzogNDA5LCAnc3RhdHVzVGV4dCc6ICdDb25mbGljdCcgfSxcbiAgeyAnc3RhdHVzJzogNDEwLCAnc3RhdHVzVGV4dCc6ICdHb25lJyB9LFxuICB7ICdzdGF0dXMnOiA0MTEsICdzdGF0dXNUZXh0JzogJ0xlbmd0aCBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDEyLCAnc3RhdHVzVGV4dCc6ICdQcmVjb25kaXRpb24gRmFpbGVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTMsICdzdGF0dXNUZXh0JzogJ1BheWxvYWQgVG9vIExhcmdlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTQsICdzdGF0dXNUZXh0JzogJ1VSSSBUb28gTG9uZycgfSxcbiAgeyAnc3RhdHVzJzogNDE1LCAnc3RhdHVzVGV4dCc6ICdVbnN1cHBvcnRlZCBNZWRpYSBUeXBlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTYsICdzdGF0dXNUZXh0JzogJ1JhbmdlIE5vdCBTYXRpc2ZpYWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNDE3LCAnc3RhdHVzVGV4dCc6ICdFeHBlY3RhdGlvbiBGYWlsZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxOCwgJ3N0YXR1c1RleHQnOiAnSVxcJ20gYSBUZWFwb3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMSwgJ3N0YXR1c1RleHQnOiAnTWlzZGlyZWN0ZWQgUmVxdWVzdCcgfSxcbiAgeyAnc3RhdHVzJzogNDIyLCAnc3RhdHVzVGV4dCc6ICdVbnByb2Nlc3NhYmxlIEVudGl0eScgfSxcbiAgeyAnc3RhdHVzJzogNDIzLCAnc3RhdHVzVGV4dCc6ICdMb2NrZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNCwgJ3N0YXR1c1RleHQnOiAnRmFpbGVkIERlcGVuZGVuY3knIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNSwgJ3N0YXR1c1RleHQnOiAnVG9vIEVhcmx5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjYsICdzdGF0dXNUZXh0JzogJ1VwZ3JhZGUgUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyOCwgJ3N0YXR1c1RleHQnOiAnUHJlY29uZGl0aW9uIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjksICdzdGF0dXNUZXh0JzogJ1RvbyBNYW55IFJlcXVlc3RzJyB9LFxuICB7ICdzdGF0dXMnOiA0MzEsICdzdGF0dXNUZXh0JzogJ1JlcXVlc3QgSGVhZGVyIEZpZWxkcyBUb28gTGFyZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDQ1MSwgJ3N0YXR1c1RleHQnOiAnVW5hdmFpbGFibGUgRm9yIExlZ2FsIFJlYXNvbnMnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMCwgJ3N0YXR1c1RleHQnOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9LFxuICB7ICdzdGF0dXMnOiA1MDEsICdzdGF0dXNUZXh0JzogJ05vdCBJbXBsZW1lbnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTAyLCAnc3RhdHVzVGV4dCc6ICdCYWQgR2F0ZXdheScgfSxcbiAgeyAnc3RhdHVzJzogNTAzLCAnc3RhdHVzVGV4dCc6ICdTZXJ2aWNlIFVuYXZhaWxhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA1MDQsICdzdGF0dXNUZXh0JzogJ0dhdGV3YXkgVGltZW91dCcgfSxcbiAgeyAnc3RhdHVzJzogNTA1LCAnc3RhdHVzVGV4dCc6ICdIVFRQIFZlcnNpb24gTm90IFN1cHBvcnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTA2LCAnc3RhdHVzVGV4dCc6ICdWYXJpYW50IEFsc28gTmVnb3RpYXRlcycgfSxcbiAgeyAnc3RhdHVzJzogNTA3LCAnc3RhdHVzVGV4dCc6ICdJbnN1ZmZpY2llbnQgU3RvcmFnZScgfSxcbiAgeyAnc3RhdHVzJzogNTA4LCAnc3RhdHVzVGV4dCc6ICdMb29wIERldGVjdGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDksICdzdGF0dXNUZXh0JzogJ0JhbmR3aWR0aCBMaW1pdCBFeGNlZWRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTEwLCAnc3RhdHVzVGV4dCc6ICdOb3QgRXh0ZW5kZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUxMSwgJ3N0YXR1c1RleHQnOiAnTmV0d29yayBBdXRoZW50aWNhdGlvbiBSZXF1aXJlZCcgfSxcbl07XG4iLCIvLyDliarotLTmnb9cbi8qKlxuICog5aSN5Yi25paH5pys5pen5YaZ5rOV44CC5ZyoIGNsaXBib2FyZCBhcGkg5LiN5Y+v55So5pe25Luj5pu/XG4gKiBAcGFyYW0gdGV4dFxuICogQHJldHVybnMge1Byb21pc2U8UHJvbWlzZTx2b2lkPnxQcm9taXNlPG5ldmVyPj59XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG9sZENvcHlUZXh0KHRleHQpIHtcbiAgLy8g5paw5bu66L6T5YWl5qGGXG4gIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgLy8g6LWL5YC8XG4gIHRleHRhcmVhLnZhbHVlID0gdGV4dDtcbiAgLy8g5qC35byP6K6+572uXG4gIE9iamVjdC5hc3NpZ24odGV4dGFyZWEuc3R5bGUsIHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICB0b3A6IDAsXG4gICAgY2xpcFBhdGg6ICdjaXJjbGUoMCknLFxuICB9KTtcbiAgLy8g5Yqg5YWl5Yiw6aG16Z2iXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRleHRhcmVhKTtcbiAgLy8g6YCJ5LitXG4gIHRleHRhcmVhLnNlbGVjdCgpO1xuICAvLyDlpI3liLZcbiAgY29uc3Qgc3VjY2VzcyA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gIC8vIOS7jumhtemdouenu+mZpFxuICB0ZXh0YXJlYS5yZW1vdmUoKTtcbiAgcmV0dXJuIHN1Y2Nlc3MgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVqZWN0KCk7XG59XG5leHBvcnQgY29uc3QgY2xpcGJvYXJkID0ge1xuICAvKipcbiAgICog5YaZ5YWl5paH5pysKOWkjeWItilcbiAgICogQHBhcmFtIHRleHRcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBhc3luYyB3cml0ZVRleHQodGV4dCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGF3YWl0IG9sZENvcHlUZXh0KHRleHQpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIOivu+WPluaWh+acrCjnspjotLQpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59XG4gICAqL1xuICBhc3luYyByZWFkVGV4dCgpIHtcbiAgICByZXR1cm4gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xuICB9LFxufTtcbiIsIi8qISBqcy1jb29raWUgdjMuMC41IHwgTUlUICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbmZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbnZhciBkZWZhdWx0Q29udmVydGVyID0ge1xuICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgLyUoMlszNDZCRl18M1tBQy1GXXw0MHw1W0JERV18NjB8N1tCQ0RdKS9nLFxuICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgKVxuICB9XG59O1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbmZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgZnVuY3Rpb24gc2V0IChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcykge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcbiAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlNSk7XG4gICAgfVxuICAgIGlmIChhdHRyaWJ1dGVzLmV4cGlyZXMpIHtcbiAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgIH1cblxuICAgIG5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQobmFtZSlcbiAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgIC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XG5cbiAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXG4gICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAvLyAuLi5cbiAgICAgIC8vIDMuICBJZiB0aGUgcmVtYWluaW5nIHVucGFyc2VkLWF0dHJpYnV0ZXMgY29udGFpbnMgYSAleDNCIChcIjtcIilcbiAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgLy8gbm90IGluY2x1ZGluZywgdGhlIGZpcnN0ICV4M0IgKFwiO1wiKSBjaGFyYWN0ZXIuXG4gICAgICAvLyAuLi5cbiAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAgbmFtZSArICc9JyArIGNvbnZlcnRlci53cml0ZSh2YWx1ZSwgbmFtZSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gIH1cblxuICBmdW5jdGlvbiBnZXQgKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAhbmFtZSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcbiAgICAvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cbiAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuICAgIHZhciBqYXIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGZvdW5kID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKTtcbiAgICAgICAgamFyW2ZvdW5kXSA9IGNvbnZlcnRlci5yZWFkKHZhbHVlLCBmb3VuZCk7XG5cbiAgICAgICAgaWYgKG5hbWUgPT09IGZvdW5kKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZSA/IGphcltuYW1lXSA6IGphclxuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAge1xuICAgICAgc2V0LFxuICAgICAgZ2V0LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICBzZXQoXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBhc3NpZ24oe30sIGF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgIGV4cGlyZXM6IC0xXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmV0dXJuIGluaXQodGhpcy5jb252ZXJ0ZXIsIGFzc2lnbih7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSlcbiAgICAgIH0sXG4gICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgIHJldHVybiBpbml0KGFzc2lnbih7fSwgdGhpcy5jb252ZXJ0ZXIsIGNvbnZlcnRlciksIHRoaXMuYXR0cmlidXRlcylcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoZGVmYXVsdEF0dHJpYnV0ZXMpIH0sXG4gICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgfVxuICApXG59XG5cbnZhciBhcGkgPSBpbml0KGRlZmF1bHRDb252ZXJ0ZXIsIHsgcGF0aDogJy8nIH0pO1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuZXhwb3J0IHsgYXBpIGFzIGRlZmF1bHQgfTtcbiIsIi8vIGNvb2tpZeaTjeS9nFxuaW1wb3J0IGpzQ29va2llIGZyb20gJ2pzLWNvb2tpZSc7XG4vLyDnlKjliLDnmoTlupPkuZ/lr7zlh7rkvr/kuo7oh6rooYzpgInnlKhcbmV4cG9ydCB7IGpzQ29va2llIH07XG5cbi8vIOWQjCBqcy1jb29raWUg55qE6YCJ6aG55ZCI5bm25pa55byPXG5mdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCAuLi5zb3VyY2VzKSB7XG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG4vLyBjb29raWXlr7nosaFcbmV4cG9ydCBjbGFzcyBDb29raWUge1xuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAgY29udmVydGVyICDlkIwganMtY29va2llcyDnmoQgY29udmVydGVyXG4gICAqICAgICAgICAgIGF0dHJpYnV0ZXMg5ZCMIGpzLWNvb2tpZXMg55qEIGF0dHJpYnV0ZXNcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2i44CCanMtY29va2llIOWcqDMuMOeJiOacrChjb21taXQ6IDRiNzkyOTBiOThkN2ZiZjFhYjQ5M2E3ZjllMTYxOTQxOGFjMDFlNDUpIOenu+mZpOS6huWvuSBqc29uIOeahOiHquWKqOi9rOaNou+8jOi/memHjOm7mOiupCB0cnVlIOWKoOS4ilxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8g6YCJ6aG557uT5p6cXG4gICAgY29uc3QgeyBjb252ZXJ0ZXIgPSB7fSwgYXR0cmlidXRlcyA9IHt9LCBqc29uID0gdHJ1ZSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBvcHRpb25zUmVzdWx0ID0ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGpzb24sXG4gICAgICBhdHRyaWJ1dGVzOiBhc3NpZ24oe30sIGpzQ29va2llLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpLFxuICAgICAgY29udmVydGVyOiBhc3NpZ24oe30sIGpzQ29va2llLmNvbnZlcnRlciwgY29udmVydGVyKSxcbiAgICB9O1xuICAgIC8vIOWjsOaYjuWQhOWxnuaAp+OAguebtOaOpeaIluWcqGNvbnN0cnVjdG9y5Lit6YeN5paw6LWL5YC8XG4gICAgLy8g6buY6K6k6YCJ6aG557uT5p6cXG4gICAgdGhpcy4kZGVmYXVsdHMgPSBvcHRpb25zUmVzdWx0O1xuICB9XG4gICRkZWZhdWx0cztcbiAgLy8g5YaZ5YWlXG4gIC8qKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIGF0dHJpYnV0ZXNcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqICAgICAgICAgIGpzb24g5piv5ZCm6L+b6KGManNvbui9rOaNolxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHNldChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzQ29va2llLnNldChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcyk7XG4gIH1cbiAgLy8g6K+75Y+WXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcGFyYW0gb3B0aW9ucyDphY3nva7poblcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2iXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0KG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGpzb24gPSAnanNvbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuanNvbiA6IHRoaXMuJGRlZmF1bHRzLmpzb247XG4gICAgbGV0IHJlc3VsdCA9IGpzQ29va2llLmdldChuYW1lKTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g56e76ZmkXG4gIHJlbW92ZShuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgYXR0cmlidXRlcyA9IGFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG4gICAgcmV0dXJuIGpzQ29va2llLnJlbW92ZShuYW1lLCBhdHRyaWJ1dGVzKTtcbiAgfVxuICAvLyDliJvlu7rjgILpgJrov4fphY3nva7pu5jorqTlj4LmlbDliJvlu7rmlrDlr7nosaHvvIznroDljJbkvKDlj4JcbiAgY3JlYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgYXR0cmlidXRlczogYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBvcHRpb25zLmF0dHJpYnV0ZXMpLFxuICAgICAgY29udmVydGVyOiBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIG9wdGlvbnMuY29udmVydGVyKSxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgQ29va2llKG9wdGlvbnNSZXN1bHQpO1xuICB9XG59XG5leHBvcnQgY29uc3QgY29va2llID0gbmV3IENvb2tpZSgpO1xuIiwiZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZSAtIGZpbGUgc2l6ZSBoYWNrc1xuICAgICAgICByZXF1ZXN0Lm9uY29tcGxldGUgPSByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUocmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gZmlsZSBzaXplIGhhY2tzXG4gICAgICAgIHJlcXVlc3Qub25hYm9ydCA9IHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlKGRiTmFtZSwgc3RvcmVOYW1lKSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSk7XG4gICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiByZXF1ZXN0LnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICAgIGNvbnN0IGRicCA9IHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCk7XG4gICAgcmV0dXJuICh0eE1vZGUsIGNhbGxiYWNrKSA9PiBkYnAudGhlbigoZGIpID0+IGNhbGxiYWNrKGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgdHhNb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpKSk7XG59XG5sZXQgZGVmYXVsdEdldFN0b3JlRnVuYztcbmZ1bmN0aW9uIGRlZmF1bHRHZXRTdG9yZSgpIHtcbiAgICBpZiAoIWRlZmF1bHRHZXRTdG9yZUZ1bmMpIHtcbiAgICAgICAgZGVmYXVsdEdldFN0b3JlRnVuYyA9IGNyZWF0ZVN0b3JlKCdrZXl2YWwtc3RvcmUnLCAna2V5dmFsJyk7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0R2V0U3RvcmVGdW5jO1xufVxuLyoqXG4gKiBHZXQgYSB2YWx1ZSBieSBpdHMga2V5LlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBnZXQoa2V5LCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXQoa2V5KSkpO1xufVxuLyoqXG4gKiBTZXQgYSB2YWx1ZSB3aXRoIGEga2V5LlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgc3RvcmUucHV0KHZhbHVlLCBrZXkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIFNldCBtdWx0aXBsZSB2YWx1ZXMgYXQgb25jZS4gVGhpcyBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIHNldCgpIG11bHRpcGxlIHRpbWVzLlxuICogSXQncyBhbHNvIGF0b21pYyDigJMgaWYgb25lIG9mIHRoZSBwYWlycyBjYW4ndCBiZSBhZGRlZCwgbm9uZSB3aWxsIGJlIGFkZGVkLlxuICpcbiAqIEBwYXJhbSBlbnRyaWVzIEFycmF5IG9mIGVudHJpZXMsIHdoZXJlIGVhY2ggZW50cnkgaXMgYW4gYXJyYXkgb2YgYFtrZXksIHZhbHVlXWAuXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gc2V0TWFueShlbnRyaWVzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4gc3RvcmUucHV0KGVudHJ5WzFdLCBlbnRyeVswXSkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIEdldCBtdWx0aXBsZSB2YWx1ZXMgYnkgdGhlaXIga2V5c1xuICpcbiAqIEBwYXJhbSBrZXlzXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFueShrZXlzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gUHJvbWlzZS5hbGwoa2V5cy5tYXAoKGtleSkgPT4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXQoa2V5KSkpKSk7XG59XG4vKipcbiAqIFVwZGF0ZSBhIHZhbHVlLiBUaGlzIGxldHMgeW91IHNlZSB0aGUgb2xkIHZhbHVlIGFuZCB1cGRhdGUgaXQgYXMgYW4gYXRvbWljIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gdXBkYXRlciBBIGNhbGxiYWNrIHRoYXQgdGFrZXMgdGhlIG9sZCB2YWx1ZSBhbmQgcmV0dXJucyBhIG5ldyB2YWx1ZS5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiB1cGRhdGUoa2V5LCB1cGRhdGVyLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IFxuICAgIC8vIE5lZWQgdG8gY3JlYXRlIHRoZSBwcm9taXNlIG1hbnVhbGx5LlxuICAgIC8vIElmIEkgdHJ5IHRvIGNoYWluIHByb21pc2VzLCB0aGUgdHJhbnNhY3Rpb24gY2xvc2VzIGluIGJyb3dzZXJzXG4gICAgLy8gdGhhdCB1c2UgYSBwcm9taXNlIHBvbHlmaWxsIChJRTEwLzExKS5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHN0b3JlLmdldChrZXkpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3RvcmUucHV0KHVwZGF0ZXIodGhpcy5yZXN1bHQpLCBrZXkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKTtcbn1cbi8qKlxuICogRGVsZXRlIGEgcGFydGljdWxhciBrZXkgZnJvbSB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGRlbChrZXksIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBzdG9yZS5kZWxldGUoa2V5KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBEZWxldGUgbXVsdGlwbGUga2V5cyBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSBrZXlzIExpc3Qgb2Yga2V5cyB0byBkZWxldGUuXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZGVsTWFueShrZXlzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHN0b3JlLmRlbGV0ZShrZXkpKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDbGVhciBhbGwgdmFsdWVzIGluIHRoZSBzdG9yZS5cbiAqXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gY2xlYXIoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZHdyaXRlJywgKHN0b3JlKSA9PiB7XG4gICAgICAgIHN0b3JlLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGVhY2hDdXJzb3Ioc3RvcmUsIGNhbGxiYWNrKSB7XG4gICAgc3RvcmUub3BlbkN1cnNvcigpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlc3VsdClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5yZXN1bHQpO1xuICAgICAgICB0aGlzLnJlc3VsdC5jb250aW51ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xufVxuLyoqXG4gKiBHZXQgYWxsIGtleXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBrZXlzKGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiB7XG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGlmIChzdG9yZS5nZXRBbGxLZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGxLZXlzKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgIHJldHVybiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKGN1cnNvci5rZXkpKS50aGVuKCgpID0+IGl0ZW1zKTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IGFsbCB2YWx1ZXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiB2YWx1ZXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgIHJldHVybiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSkpLnRoZW4oKCkgPT4gaXRlbXMpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBHZXQgYWxsIGVudHJpZXMgaW4gdGhlIHN0b3JlLiBFYWNoIGVudHJ5IGlzIGFuIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBlbnRyaWVzKGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiB7XG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIC8vIChhbHRob3VnaCwgaG9wZWZ1bGx5IHdlJ2xsIGdldCBhIHNpbXBsZXIgcGF0aCBzb21lIGRheSlcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbCAmJiBzdG9yZS5nZXRBbGxLZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsS2V5cygpKSxcbiAgICAgICAgICAgICAgICBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldEFsbCgpKSxcbiAgICAgICAgICAgIF0pLnRoZW4oKFtrZXlzLCB2YWx1ZXNdKSA9PiBrZXlzLm1hcCgoa2V5LCBpKSA9PiBba2V5LCB2YWx1ZXNbaV1dKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gZWFjaEN1cnNvcihzdG9yZSwgKGN1cnNvcikgPT4gaXRlbXMucHVzaChbY3Vyc29yLmtleSwgY3Vyc29yLnZhbHVlXSkpLnRoZW4oKCkgPT4gaXRlbXMpKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgY2xlYXIsIGNyZWF0ZVN0b3JlLCBkZWwsIGRlbE1hbnksIGVudHJpZXMsIGdldCwgZ2V0TWFueSwga2V5cywgcHJvbWlzaWZ5UmVxdWVzdCwgc2V0LCBzZXRNYW55LCB1cGRhdGUsIHZhbHVlcyB9O1xuIiwiZXhwb3J0IGNsYXNzIF9TdG9yYWdlIHtcbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqICAgICAgICAgIHN0b3JhZ2Ug5a+55bqU55qEc3RvcmFnZeWvueixoeOAgmxvY2FsU3RvcmFnZSDmiJYgc2Vzc2lvblN0b3JhZ2VcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2i44CCXG4gICAqIEByZXR1cm5zIHt2b2lkfCp9XG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGZyb20sIGpzb24gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZnJvbSxcbiAgICAgIGpzb24sXG4gICAgfTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgIC8vIOm7mOiupOmAiemhuee7k+aenFxuICAgICAgJGRlZmF1bHRzOiBvcHRpb25zUmVzdWx0LFxuICAgICAgLy8g5a+55bqU55qEc3RvcmFnZeWvueixoeOAglxuICAgICAgc3RvcmFnZTogZnJvbSxcbiAgICAgIC8vIOWOn+acieaWueazleOAgueUseS6jiBPYmplY3QuY3JlYXRlKGZyb20pIOaWueW8j+e7p+aJv+aXtuiwg+eUqOS8muaKpSBVbmNhdWdodCBUeXBlRXJyb3I6IElsbGVnYWwgaW52b2NhdGlvbu+8jOaUueaIkOWNleeLrOWKoOWFpeaWueW8j1xuICAgICAgc2V0SXRlbTogZnJvbS5zZXRJdGVtLmJpbmQoZnJvbSksXG4gICAgICBnZXRJdGVtOiBmcm9tLmdldEl0ZW0uYmluZChmcm9tKSxcbiAgICAgIHJlbW92ZUl0ZW06IGZyb20ucmVtb3ZlSXRlbS5iaW5kKGZyb20pLFxuICAgICAga2V5OiBmcm9tLmtleS5iaW5kKGZyb20pLFxuICAgICAgY2xlYXI6IGZyb20uY2xlYXIuYmluZChmcm9tKSxcbiAgICB9KTtcbiAgfVxuICAvLyDlo7DmmI7lkITlsZ7mgKfjgILnm7TmjqXmiJblnKhjb25zdHJ1Y3RvcuS4remHjeaWsOi1i+WAvFxuICAkZGVmYXVsdHM7XG4gIHN0b3JhZ2U7XG4gIHNldEl0ZW07XG4gIGdldEl0ZW07XG4gIHJlbW92ZUl0ZW07XG4gIGtleTtcbiAgY2xlYXI7XG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5sZW5ndGg7XG4gIH1cbiAgLy8g5Yik5pat5bGe5oCn5piv5ZCm5a2Y5Zyo44CC5ZCM5pe255So5LqO5ZyoIGdldCDkuK3lr7nkuI3lrZjlnKjnmoTlsZ7mgKfov5Tlm54gdW5kZWZpbmVkXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zdG9yYWdlKS5pbmNsdWRlcyhrZXkpO1xuICB9XG4gIC8vIOWGmeWFpVxuICBzZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBpZiAoanNvbikge1xuICAgICAgLy8g5aSE55CG5a2YIHVuZGVmaW5lZCDnmoTmg4XlhrXvvIzms6jmhI/lr7nosaHkuK3nmoTmmL7lvI8gdW5kZWZpbmVkIOeahOWxnuaAp+S8muiiqyBqc29uIOW6j+WIl+WMluenu+mZpFxuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICB9XG4gIC8vIOivu+WPllxuICBnZXQoa2V5LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIC8vIOWkhOeQhuaXoOWxnuaAp+eahOeahOaDheWGtei/lOWbniB1bmRlZmluZWRcbiAgICBpZiAoanNvbiAmJiAhdGhpcy5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8g5YW25LuW5YC85Yik5pat6L+U5ZueXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgaWYgKGpzb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOenu+mZpFxuICByZW1vdmUoa2V5KSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gIH1cbiAgLy8g5Yib5bu644CC6YCa6L+H6YWN572u6buY6K6k5Y+C5pWw5Yib5bu65paw5a+56LGh77yM566A5YyW5Lyg5Y+CXG4gIGNyZWF0ZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zUmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgX1N0b3JhZ2Uob3B0aW9uc1Jlc3VsdCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBfbG9jYWxTdG9yYWdlID0gbmV3IF9TdG9yYWdlKHsgZnJvbTogbG9jYWxTdG9yYWdlIH0pO1xuZXhwb3J0IGNvbnN0IF9zZXNzaW9uU3RvcmFnZSA9IG5ldyBfU3RvcmFnZSh7IGZyb206IHNlc3Npb25TdG9yYWdlIH0pO1xuIl0sIm5hbWVzIjpbImJhc2VDb25maWciLCJhc3NpZ24iLCJqc0Nvb2tpZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUE7QUFFQTtFQUNPLE1BQU0sSUFBSSxTQUFTLEdBQUcsQ0FBQztFQUM5QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsRUFBRSxPQUFPLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRTtFQUMvQjtFQUNBLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtFQUN6QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQzlCLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDOUIsS0FBSztFQUNMO0VBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hEO0VBQ0EsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0VBQ3BDLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxLQUFLO0VBQ25DLE1BQU0sT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDdEQsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDaEIsR0FBRztBQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUU7RUFDeEI7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7RUFDekIsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUM5QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQzlCLEtBQUs7RUFDTDtFQUNBLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RDtFQUNBLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENB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QUFFQTtFQUNPLE1BQU0sTUFBTSxTQUFTLEtBQUssQ0FBQztFQUNsQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7QUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUU7RUFDMUIsSUFBSSxJQUFJO0VBQ1IsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNoQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7RUFDaEIsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNyQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7RUFDakIsS0FBSztFQUNMLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7RUFDNUQ7RUFDQSxNQUFNLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QixNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7RUFDM0IsTUFBTSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztFQUN0QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7RUFDckIsS0FBSyxNQUFNO0VBQ1gsTUFBTSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztFQUN0QixLQUFLO0FBQ0w7RUFDQTtFQUNBLEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7QUFDQTtFQUNBO0VBQ0EsRUFBRSxJQUFJLEdBQUc7RUFDVCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDaEQsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0VBQ0g7RUFDQSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0VBQ2xCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUNyQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDakQsS0FBSztFQUNMLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztFQUNIO0VBQ0EsRUFBRSxPQUFPLEdBQUc7RUFDWixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDbkQsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0VBQ0g7RUFDQSxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0VBQ3BCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUNyQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDbkQsS0FBSztFQUNMLElBQUksT0FBTyxJQUFJLENBQUM7RUFDaEIsR0FBRztFQUNIO0VBQ0EsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLEtBQUssRUFBRTtFQUN2QyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7RUFDbEQsSUFBSSxPQUFPLElBQUksQ0FBQztFQUNoQixHQUFHO0VBQ0g7RUFDQSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUU7RUFDaEIsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUM7RUFDdkQsSUFBSSxP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
