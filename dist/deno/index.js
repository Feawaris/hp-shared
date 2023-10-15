/*!
 * hp-shared v0.2.1
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"esm","sourcemap":"inline"}
 */
  
import * as mod_ts from 'https://deno.land/x/copy_paste/mod.ts';

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

var index$3 = /*#__PURE__*/Object.freeze({
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

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  clipboard: mod_ts
});

export { index$3 as base, index$2 as dev, index$1 as network, index as storage };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL19TZXQuanMiLCIuLi8uLi9zcmMvYmFzZS9fQXJyYXkuanMiLCIuLi8uLi9zcmMvYmFzZS9fQm9vbGVhbi5qcyIsIi4uLy4uL3NyYy9iYXNlL19EYXRlLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX01hdGguanMiLCIuLi8uLi9zcmMvYmFzZS9fTnVtYmVyLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1JlZmxlY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9EYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3VwcG9ydC5qcyIsIi4uLy4uL3NyYy9iYXNlL19PYmplY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9fU3RyaW5nLmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3R5bGUuanMiLCIuLi8uLi9zcmMvYmFzZS9WdWVEYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvaW5kZXguanMiLCIuLi8uLi9zcmMvZGV2L2VzbGludC5qcyIsIi4uLy4uL3NyYy9kZXYvdml0ZS5qcyIsIi4uLy4uL3NyYy9uZXR3b3JrL3NoYXJlZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDpm4blkIhcbmltcG9ydCB7IF9BcnJheSB9IGZyb20gJy4vX0FycmF5JztcblxuZXhwb3J0IGNsYXNzIF9TZXQgZXh0ZW5kcyBTZXQge1xuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5Lqk6ZuGXG4gICAqIEBwYXJhbSBzZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIGludGVyc2VjdGlvbiguLi5zZXRzKSB7XG4gICAgLy8g5Lyg5Y+C5pWw6YePXG4gICAgaWYgKHNldHMubGVuZ3RoIDwgMikge1xuICAgICAgc2V0c1swXSA9IHNldHNbMF0gfHwgW107XG4gICAgICBzZXRzWzFdID0gc2V0c1sxXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgc2V0cyA9IG5ldyBfQXJyYXkoc2V0cykubWFwKHNldCA9PiBuZXcgX0FycmF5KHNldCkpO1xuXG4gICAgY29uc3QgW2ZpcnN0LCAuLi5vdGhlcnNdID0gc2V0cztcbiAgICByZXR1cm4gZmlyc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIG90aGVycy5ldmVyeShzZXQgPT4gc2V0LmluY2x1ZGVzKHZhbHVlKSk7XG4gICAgfSkudG9fU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5bm26ZuGXG4gICAqIEBwYXJhbSBzZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIHVuaW9uKC4uLnNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAoc2V0cy5sZW5ndGggPCAyKSB7XG4gICAgICBzZXRzWzBdID0gc2V0c1swXSB8fCBbXTtcbiAgICAgIHNldHNbMV0gPSBzZXRzWzFdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBzZXRzID0gbmV3IF9BcnJheShzZXRzKS5tYXAoc2V0ID0+IG5ldyBfQXJyYXkoc2V0KSk7XG5cbiAgICByZXR1cm4gc2V0cy5mbGF0KCkudG9fU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6KGl6ZuGXG4gICAqIEBwYXJhbSBtYWluU2V0XG4gICAqIEBwYXJhbSBvdGhlclNldHNcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBzdGF0aWMgY29tcGxlbWVudChtYWluU2V0ID0gW10sIC4uLm90aGVyU2V0cykge1xuICAgIC8vIOS8oOWPguaVsOmHj1xuICAgIGlmIChvdGhlclNldHMubGVuZ3RoIDwgMSkge1xuICAgICAgb3RoZXJTZXRzWzBdID0gb3RoZXJTZXRzWzBdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBtYWluU2V0ID0gbmV3IF9BcnJheShtYWluU2V0KTtcbiAgICBvdGhlclNldHMgPSBuZXcgX0FycmF5KG90aGVyU2V0cykubWFwKGFyZyA9PiBuZXcgX0FycmF5KGFyZykpO1xuICAgIHJldHVybiBtYWluU2V0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgIHJldHVybiBvdGhlclNldHMuZXZlcnkoc2V0ID0+ICFzZXQuaW5jbHVkZXModmFsdWUpKTtcbiAgICB9KS50b19TZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcbiAgICAvLyBjb25zb2xlLmxvZygnX1NldCBjb25zdHJ1Y3RvcicsIHZhbHVlKTtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBuZXcgU2V0KHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+S8oOWPguaKpemUme+8jOWwhueUn+aIkOepuumbhuWQiCcsIGUpO1xuICAgICAgdmFsdWUgPSBuZXcgU2V0KFtdKTtcbiAgICB9XG4gICAgc3VwZXIodmFsdWUpO1xuXG4gICAgLy8gc2l6ZSDml6DpnIDlrprliLZcbiAgfVxuXG4gIC8vIOaWueazleWumuWItu+8muWOn+Wei+WQjOWQjeaWueazlSvmlrDlop7mlrnms5XjgILlpKfpg6jliIbov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgLyoqXG4gICAqIOS/ruaUuVxuICAgKi9cbiAgLy8gKOWumuWItuaWueazlSlcbiAgYWRkKC4uLnZhbHVlcykge1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBTZXQucHJvdG90eXBlLmFkZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vICjlrprliLbmlrnms5UpXG4gIGRlbGV0ZSguLi52YWx1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgU2V0LnByb3RvdHlwZS5kZWxldGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBjbGVhcigpIHtcbiAgICBTZXQucHJvdG90eXBlLmNsZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog6YGN5Y6GXG4gICAqL1xuICAvLyBTeW1ib2wuaXRlcmF0b3Ig5peg6ZyA5a6a5Yi2XG4gIC8vIGtleXMg5peg6ZyA5a6a5Yi2XG4gIC8vIHZhbHVlcyDml6DpnIDlrprliLZcbiAgLy8gZW50cmllcyDml6DpnIDlrprliLZcblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBmb3JFYWNoKCkge1xuICAgIFNldC5wcm90b3R5cGUuZm9yRWFjaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeaJvlxuICAgKi9cbiAgLy8gaGFzIOaXoOmcgOWumuWItlxuXG4gIC8qKlxuICAgKiDnlJ/miJBcbiAgICovXG4gIC8vIOebtOaOpSB0b19BcnJheSDosIPmlbDnu4Tmlrnms5Xlho0gdG9fU2V0IOi9rOaNouWbnuadpeWNs+WPr++8jOaXoOmcgOmHjeWkjeWumuWItlxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vICjlrprliLbmlrnms5UpXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIE5hTjtcbiAgfVxuXG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYHske3RoaXMudG9BcnJheSgpLmpvaW4oJywnKX19YDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gJ3t9JztcbiAgICB9XG4gIH1cblxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b0Jvb2xlYW4ob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZSA+IDA7XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9BcnJheSgpO1xuICB9XG5cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvX0FycmF5KCkge1xuICAgIHJldHVybiBuZXcgX0FycmF5KHRoaXMpO1xuICB9XG59XG4iLCIvLyDmlbDnu4RcbmltcG9ydCB7IF9TZXQgfSBmcm9tICcuL19TZXQnO1xuXG5leHBvcnQgY2xhc3MgX0FycmF5IGV4dGVuZHMgQXJyYXkge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyBzdGF0aWMgaXNBcnJheSDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGZyb20g5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBvZiDml6DpnIDlrprliLZcblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBBcnJheS5mcm9tKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+S8oOWPguaKpemUme+8jOWwhueUn+aIkOepuuaVsOe7hCcsIGUpO1xuICAgICAgdmFsdWUgPSBbXTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgdmFsdWVbMF0gPT09ICdudW1iZXInKSB7XG4gICAgICAvLyDnqIDnlo/mlbDnu4Tpl67popjvvIzlhYjosIMgc3VwZXIg55Sf5oiQIHRoaXMg5ZCO5YaN5L+u5pS5IHRoaXMg5YaF5a65XG4gICAgICBjb25zdCB0ZW1wID0gdmFsdWVbMF07XG4gICAgICB2YWx1ZVswXSA9IHVuZGVmaW5lZDtcbiAgICAgIHN1cGVyKC4uLnZhbHVlKTtcbiAgICAgIHRoaXNbMF0gPSB0ZW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlciguLi52YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gbGVuZ3RoIOaXoOmcgOWumuWItlxuICB9XG5cbiAgLy8g5pa55rOV5a6a5Yi277ya5Y6f5Z6L5ZCM5ZCN5pa55rOVK+aWsOWinuaWueazleOAguWkp+mDqOWIhui/lOWbniB0aGlzIOS+v+S6jumTvuW8j+aTjeS9nFxuICAvKipcbiAgICog5L+u5pS5XG4gICAqL1xuICAvLyBzb3J0IOaXoOmcgOWumuWItlxuICAvLyByZXZlcnNlIOaXoOmcgOWumuWItlxuICAvLyBmaWxsIOaXoOmcgOWumuWItlxuICAvLyBjb3B5V2l0aGluIOaXoOmcgOWumuWItlxuXG4gIC8vICjlrprliLbmlrnms5UpXG4gIHB1c2goKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBwb3AobGVuZ3RoID0gMSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wb3AuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdW5zaGlmdCgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHNoaWZ0KGxlbmd0aCA9IDEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gKOaWsOWinuaWueazlSkg5Yig6ZmkXG4gIGRlbGV0ZSh2YWx1ZSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maW5kSW5kZXgodmFsID0+IHZhbCA9PT0gdmFsdWUpO1xuICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbiAgLy8gKOaWsOWinuaWueazlSkg5riF56m6XG4gIGNsZWFyKCkge1xuICAgIHJldHVybiB0aGlzLnNwbGljZSgwKTtcbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKSDljrvph41cbiAgdW5pcXVlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy50b19TZXQoKS50b19BcnJheSgpO1xuICAgIHJldHVybiB0aGlzLmNsZWFyKCkucHVzaCguLi52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICog6YGN5Y6GXG4gICAqL1xuICAvLyBTeW1ib2wuaXRlcmF0b3Ig5peg6ZyA5a6a5Yi2XG4gIC8vIGtleXMg5peg6ZyA5a6a5Yi2XG4gIC8vIHZhbHVlcyDml6DpnIDlrprliLZcbiAgLy8gZW50cmllcyDml6DpnIDlrprliLZcblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBmb3JFYWNoKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog5p+l5om+XG4gICAqL1xuICAvLyBhdCDml6DpnIDlrprliLZcbiAgLy8gZmluZCDml6DpnIDlrprliLZcbiAgLy8gZmluZEluZGV4IOaXoOmcgOWumuWItlxuICAvLyBmaW5kTGFzdCDml6DpnIDlrprliLZcbiAgLy8gZmluZExhc3RJbmRleCDml6DpnIDlrprliLZcbiAgLy8gaW5jbHVkZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGluZGV4T2Yg5peg6ZyA5a6a5Yi2XG4gIC8vIGxhc3RJbmRleE9mIOaXoOmcgOWumuWItlxuICAvLyBzb21lIOaXoOmcgOWumuWItlxuICAvLyBldmVyeSDml6DpnIDlrprliLZcblxuICAvKipcbiAgICog55Sf5oiQXG4gICAqL1xuICAvLyBtYXAg5peg6ZyA5a6a5Yi2XG4gIC8vIGZpbHRlciDml6DpnIDlrprliLZcbiAgLy8gcmVkdWNlIOaXoOmcgOWumuWItlxuICAvLyByZWR1Y2VSaWdodCDml6DpnIDlrprliLZcbiAgLy8gY29uY2F0IOaXoOmcgOWumuWItlxuICAvLyBzbGljZSDml6DpnIDlrprliLZcbiAgLy8gam9pbiDml6DpnIDlrprliLZcbiAgLy8gZmxhdCDml6DpnIDlrprliLZcbiAgLy8gZmxhdE1hcCDml6DpnIDlrprliLZcblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB3aXRoKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLndpdGguYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU3BsaWNlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1NwbGljZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU29ydGVkKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLnRvU29ydGVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1JldmVyc2VkKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLnRvUmV2ZXJzZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vICjlrprliLbmlrnms5UpXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9TdHJpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYHRvU3RyaW5nIOi9rOaNouaKpemUme+8jOWwhueUn+aIkCAnW10nYCwgZSk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoW10pO1xuICAgIH1cbiAgfVxuICAvLyB0b0xvY2FsZVN0cmluZyDml6DpnIDlrprliLZcbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA+IDA7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xuICB9XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvU2V0KCkge1xuICAgIHJldHVybiBuZXcgU2V0KHRoaXMpO1xuICB9XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvX1NldCgpIHtcbiAgICByZXR1cm4gbmV3IF9TZXQodGhpcyk7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBfQm9vbGVhbiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbl9Cb29sZWFuLkZBTFNZID0gWzAsICcnLCBudWxsLCB1bmRlZmluZWQsIE5hTl07XG4iLCIvLyDml6XmnJ/ml7bpl7RcbmV4cG9ydCBjbGFzcyBfRGF0ZSBleHRlbmRzIERhdGUge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyAo5paw5aKe5bGe5oCnKVxuICBzdGF0aWMgUkVHRVhfUEFSU0UgPSAvXihcXGR7NH0pWy0vXT8oXFxkezEsMn0pP1stL10/KFxcZHswLDJ9KVtUdFxcc10qKFxcZHsxLDJ9KT86PyhcXGR7MSwyfSk/Oj8oXFxkezEsMn0pP1suOl0/KFxcZCspPyQvO1xuICBzdGF0aWMgUkVHRVhfRk9STUFUID0gL1xcWyhbXlxcXV0rKV18WXsxLDR9fE17MSw0fXxEezEsMn18ZHsxLDR9fEh7MSwyfXxoezEsMn18YXxBfG17MSwyfXxzezEsMn18WnsxLDJ9fFNTUy9nO1xuXG4gIC8vIHN0YXRpYyBub3cg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBwYXJzZSDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIFVUQyDml6DpnIDlrprliLZcblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6L2s5o2i5oiQ5a2X56ym5LiyXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHN0cmluZ2lmeSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHZhbHVlKS50b1N0cmluZygpO1xuICB9XG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDmmK/lkKbmnInmlYjlj4LmlbDjgILluLjnlKjkuo7lpITnkIbmk43kvZzlvpfliLAgSW52YWxpZCBEYXRlIOeahOaDheWGtVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgaXNWYWxpZFZhbHVlKHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IHRoaXModmFsdWUpLnRvQm9vbGVhbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ19EYXRlIGNvbnN0cnVjdG9yJywgYXJncyk7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBudWxsIOWSjOaYvuW8jyB1bmRlZmluZWQg6YO96KeG5Li65peg5pWI5YC8XG4gICAgICBpZiAoYXJnc1swXSA9PT0gbnVsbCkge1xuICAgICAgICBhcmdzWzBdID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgLy8gc2FmYXJpIOa1j+iniOWZqOWtl+espuS4suagvOW8j+WFvOWuuVxuICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlQWxsKCctJywgJy8nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAvLyDmlrDlop7lsZ7mgKdcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3llYXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZ1bGxZZWFyKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbW9udGgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1vbnRoKCkgKyAxO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RheScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0ZSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3dlZWsnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERheSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2hvdXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhvdXJzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2hvcnRIb3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBjb25zdCBob3VyID0gdGhpcy5ob3VyO1xuICAgICAgICByZXR1cm4gaG91ciAlIDEyID09PSAwID8gaG91ciA6IGhvdXIgJSAxMjtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtaW51dGUnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1pbnV0ZXMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzZWNvbmQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNlY29uZHMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtaWxsaXNlY29uZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGltZVpvbmVPZmZzZXRIb3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g5qC85byP5YyW5a2X56ym5Liy55So44CC5oC75L2T5ZCMIGVsZW1lbnQg55So55qEIGRheS5qcyDmoLzlvI8oaHR0cHM6Ly9kYXkuanMub3JnL2RvY3MvemgtQ04vZGlzcGxheS9mb3JtYXQp77yM6aOO5qC85a6a5Yi25oiQ5Lit5paHXG4gICAgdGhpcy5mb3JtYXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdZWScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMueWVhci50b1N0cmluZygpLnNsaWNlKC0yKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWVlZWScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMueWVhci50b1N0cmluZygpLnNsaWNlKC00KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnTScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubW9udGgudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnTU0nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1vbnRoLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnRCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuZGF5LnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0REJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5kYXkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdkJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbJ+WRqOaXpScsICflkajkuIAnLCAn5ZGo5LqMJywgJ+WRqOS4iScsICflkajlm5snLCAn5ZGo5LqUJywgJ+WRqOWFrSddWyR0aGlzLndlZWtdO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdkZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWyfmmJ/mnJ/ml6UnLCAn5pif5pyf5LiAJywgJ+aYn+acn+S6jCcsICfmmJ/mnJ/kuIknLCAn5pif5pyf5ZubJywgJ+aYn+acn+S6lCcsICfmmJ/mnJ/lha0nXVskdGhpcy53ZWVrXTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnSCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ci50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdISCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ci50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ2gnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNob3J0SG91ci50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdoaCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2hvcnRIb3VyLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnbScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWludXRlLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ21tJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5taW51dGUudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdzJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zZWNvbmQudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnc3MnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNlY29uZC50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1NTUycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWlsbGlzZWNvbmQudG9TdHJpbmcoKS5wYWRTdGFydCgzLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdhJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5ob3VyIDwgMTIgPyAn5LiK5Y2IJyA6ICfkuIvljYgnO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdBJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdaJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNpZ24gPSAkdGhpcy50aW1lWm9uZU9mZnNldEhvdXIgPCAwID8gJysnIDogJy0nO1xuICAgICAgICByZXR1cm4gYCR7c2lnbn0keygtJHRoaXMudGltZVpvbmVPZmZzZXRIb3VyKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OjAwYDtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWlonLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLloucmVwbGFjZSgnOicsICcnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IOezu+WIl+aWueazleOAguS9v+eUqCB5ZWFy44CBbW9udGgg562J5paw5aKe5bGe5oCn6I635Y+W5Y2z5Y+v77yM566A5YyW5YaZ5rOV77yM5peg6ZyA6aKd5aSW5a6a5Yi2XG4gICAqL1xuICAvLyBnZXRUaW1lIOaXoOmcgOWumuWItlxuICAvLyBnZXRUaW1lem9uZU9mZnNldCDml6DpnIDlrprliLZcblxuICAvLyBnZXRZZWFyIOaXoOmcgOWumuWItlxuICAvLyBnZXRGdWxsWWVhciDml6DpnIDlrprliLZcbiAgLy8gZ2V0TW9udGgg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldERhdGUg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldERheSDml6DpnIDlrprliLZcbiAgLy8gZ2V0SG91cnMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldE1pbnV0ZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFNlY29uZHMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldE1pbGxpc2Vjb25kcyDml6DpnIDlrprliLZcblxuICAvLyBnZXRVVENGdWxsWWVhciDml6DpnIDlrprliLZcbiAgLy8gZ2V0VVRDTW9udGgg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ0RhdGUg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ0RheSDml6DpnIDlrprliLZcbiAgLy8gZ2V0VVRDSG91cnMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ01pbnV0ZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ1NlY29uZHMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ01pbGxpc2Vjb25kcyDml6DpnIDlrprliLZcblxuICAvKipcbiAgICogc2V0IOezu+WIl+aWueazleOAguWumuWItuaIkOi/lOWbniB0aGlzIOS+v+S6jumTvuW8j+aTjeS9nFxuICAgKi9cbiAgc2V0VGltZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRUaW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRZZWFyKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRGdWxsWWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRGdWxsWWVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldE1vbnRoKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1vbnRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0RGF0ZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXREYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0SG91cnMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0SG91cnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNaW51dGVzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1pbnV0ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRTZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFNlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNaWxsaXNlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0TWlsbGlzZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRVVENGdWxsWWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENGdWxsWWVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ01vbnRoKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01vbnRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDRGF0ZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENEYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDSG91cnMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDSG91cnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNaW51dGVzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01pbnV0ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENTZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ1NlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNaWxsaXNlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDTWlsbGlzZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyAo5a6a5Yi25pa55rOVKVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lKCk7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9TdHJpbmcoZm9ybWF0ID0gJ1lZWVktTU0tREQgaGg6bW06c3MnKSB7XG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlQWxsKHRoaXMuY29uc3RydWN0b3IuUkVHRVhfRk9STUFULCAobWF0Y2gsICQxKSA9PiB7XG4gICAgICAvLyBbXSDph4zpnaLnmoTlhoXlrrnljp/moLfovpPlh7pcbiAgICAgIGlmICgkMSkge1xuICAgICAgICByZXR1cm4gJDE7XG4gICAgICB9XG4gICAgICAvLyDmoLzlvI9cbiAgICAgIGlmIChtYXRjaCBpbiB0aGlzLmZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRbbWF0Y2hdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvRGF0ZVN0cmluZyhmb3JtYXQgPSAnWVlZWS1NTS1ERCcpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZyhmb3JtYXQpO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvVGltZVN0cmluZyhmb3JtYXQgPSAnSEg6bW06c3MnKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoZm9ybWF0KTtcbiAgfVxuICAvLyB0b0xvY2FsZVN0cmluZyDml6DpnIDlrprliLZcbiAgLy8gdG9Mb2NhbGVEYXRlU3RyaW5nIOaXoOmcgOWumuWItlxuICAvLyB0b0xvY2FsZVRpbWVTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vIHRvSVNPU3RyaW5nIOaXoOmcgOWumuWItlxuICAvLyB0b1VUQ1N0cmluZyDml6DpnIDlrprliLZcbiAgLy8gdG9HTVRTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gIWlzTmFOKHRoaXMuZ2V0VGltZSgpKTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b0pTT04ob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgfVxuICAvLyB2YWx1ZU9mIOaXoOmcgOWumuWItlxufVxuIiwiLy8g5pWw5a2m6L+Q566X44CC5a+5IE1hdGgg5a+56LGh5omp5bGV77yM5o+Q5L6b5pu055u06KeC5ZKM56ym5ZCI5pWw5a2m57qm5a6a55qE5ZCN56ewXG5leHBvcnQgY29uc3QgX01hdGggPSBPYmplY3QuY3JlYXRlKE1hdGgpO1xuXG5fTWF0aC5hcmNzaW4gPSBNYXRoLmFzaW4uYmluZChNYXRoKTtcbl9NYXRoLmFyY2NvcyA9IE1hdGguYWNvcy5iaW5kKE1hdGgpO1xuX01hdGguYXJjdGFuID0gTWF0aC5hdGFuLmJpbmQoTWF0aCk7XG5fTWF0aC5hcnNpbmggPSBNYXRoLmFzaW5oLmJpbmQoTWF0aCk7XG5fTWF0aC5hcmNvc2ggPSBNYXRoLmFjb3NoLmJpbmQoTWF0aCk7XG5fTWF0aC5hcnRhbmggPSBNYXRoLmF0YW5oLmJpbmQoTWF0aCk7XG5fTWF0aC5sb2dlID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbl9NYXRoLmxuID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbl9NYXRoLmxnID0gTWF0aC5sb2cxMC5iaW5kKE1hdGgpO1xuX01hdGgubG9nID0gZnVuY3Rpb24oYSwgeCkge1xuICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZyhhKTtcbn07XG4iLCJleHBvcnQgY2xhc3MgX051bWJlciBleHRlbmRzIE51bWJlciB7XG59XG4iLCJleHBvcnQgY29uc3QgX1JlZmxlY3QgPSBPYmplY3QuY3JlYXRlKFJlZmxlY3QpO1xuXG4vLyDlr7kgb3duS2V5cyDphY3lpZcgb3duVmFsdWVzIOWSjCBvd25FbnRyaWVzXG5fUmVmbGVjdC5vd25WYWx1ZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xufTtcbl9SZWZsZWN0Lm93bkVudHJpZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gW2tleSwgdGFyZ2V0W2tleV1dKTtcbn07XG4iLCIvLyDmlbDmja7lpITnkIbvvIzlpITnkIblpJrmoLzlvI/mlbDmja7nlKhcbmV4cG9ydCBjb25zdCBEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbi8qKlxuICog5LyY5YyWIHR5cGVvZlxuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7J3VuZGVmaW5lZCd8J29iamVjdCd8J2Jvb2xlYW4nfCdudW1iZXInfCdzdHJpbmcnfCdmdW5jdGlvbid8J3N5bWJvbCd8J2JpZ2ludCd8c3RyaW5nfVxuICovXG5EYXRhLnR5cGVvZiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbn07XG4vKipcbiAqIOWIpOaWreeugOWNleexu+Wei1xuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGF0YS5pc1NpbXBsZVR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gWydudWxsJywgJ3VuZGVmaW5lZCcsICdudW1iZXInLCAnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnYmlnaW50JywgJ3N5bWJvbCddLmluY2x1ZGVzKHRoaXMudHlwZW9mKHZhbHVlKSk7XG59O1xuLyoqXG4gKiDmmK/lkKbmma7pgJrlr7nosaFcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkRhdGEuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59O1xuLyoqXG4gKiDojrflj5blgLznmoTlhbfkvZPnsbvlnotcbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEByZXR1cm5zIHtPYmplY3RDb25zdHJ1Y3RvcnwqfEZ1bmN0aW9ufSDov5Tlm57lr7nlupTmnoTpgKDlh73mlbDjgIJudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICovXG5EYXRhLmdldEV4YWN0VHlwZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgLy8gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGh5pe2IF9fcHJvdG9fXyDkuLogbnVsbFxuICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDlr7nlupTnu6fmib/nmoTlr7nosaEgX19wcm90b19fIOayoeaciSBjb25zdHJ1Y3RvciDlsZ7mgKdcbiAgY29uc3QgaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gISgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXyk7XG4gIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDov5Tlm57lr7nlupTmnoTpgKDlh73mlbBcbiAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3Rvcjtcbn07XG4vKipcbiAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei+WIl+ihqFxuICogQHBhcmFtIHZhbHVlIOWAvFxuICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gKi9cbkRhdGEuZ2V0RXhhY3RUeXBlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Yik5pat5aSE55CGXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gW3ZhbHVlXTtcbiAgfVxuICAvLyDmiavljp/lnovpk77lvpfliLDlr7nlupTmnoTpgKDlh73mlbBcbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBsZXQgbG9vcCA9IDA7XG4gIGxldCBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gZmFsc2U7XG4gIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIGNvbnNvbGUud2Fybignd2hpbGUnLCBsb29wLCBfX3Byb3RvX18pO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIC8vIOS4gOi/m+adpSBfX3Byb3RvX18g5bCx5pivIG51bGwg6K+05piOIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoVxuICAgICAgaWYgKGxvb3AgPD0gMCkge1xuICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKSB7XG4gICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgfVxuICAgIF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihfX3Byb3RvX18pO1xuICAgIGxvb3ArKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiDmt7Hmi7fotJ3mlbDmja5cbiAqIEBwYXJhbSBzb3VyY2VcbiAqIEByZXR1cm5zIHtNYXA8YW55LCBhbnk+fFNldDxhbnk+fHt9fCp8KltdfVxuICovXG5EYXRhLmRlZXBDbG9uZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAvLyDmlbDnu4RcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIFNldFxuICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgIHJlc3VsdC5hZGQodGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBNYXBcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHNvdXJjZS5lbnRyaWVzKCkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCB0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOWvueixoVxuICBpZiAodGhpcy5nZXRFeGFjdFR5cGUoc291cmNlKSA9PT0gT2JqZWN0KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgLy8gdmFsdWXmlrnlvI/vvJrpgJLlvZLlpITnkIZcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQ2xvbmUoZGVzYy52YWx1ZSksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0L3NldCDmlrnlvI/vvJrnm7TmjqXlrprkuYlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlhbbku5bvvJrljp/moLfov5Tlm55cbiAgcmV0dXJuIHNvdXJjZTtcbn07XG4vKipcbiAqIOa3seino+WMheaVsOaNrlxuICogQHBhcmFtIGRhdGEg5YC8XG4gKiBAcGFyYW0gaXNXcmFwIOWMheijheaVsOaNruWIpOaWreWHveaVsO+8jOWmgiB2dWUzIOeahCBpc1JlZiDlh73mlbBcbiAqIEBwYXJhbSB1bndyYXAg6Kej5YyF5pa55byP5Ye95pWw77yM5aaCIHZ1ZTMg55qEIHVucmVmIOWHveaVsFxuICogQHJldHVybnMge3tbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fCp8KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfHtbcDogc3RyaW5nXTogYW55fX1cbiAqL1xuRGF0YS5kZWVwVW53cmFwID0gZnVuY3Rpb24oZGF0YSwgeyBpc1dyYXAgPSAoKSA9PiBmYWxzZSwgdW53cmFwID0gdmFsID0+IHZhbCB9ID0ge30pIHtcbiAgLy8g6YCJ6aG55pS26ZuGXG4gIGNvbnN0IG9wdGlvbnMgPSB7IGlzV3JhcCwgdW53cmFwIH07XG4gIC8vIOWMheijheexu+Wei++8iOWmgnZ1ZTPlk43lupTlvI/lr7nosaHvvInmlbDmja7op6PljIVcbiAgaWYgKGlzV3JhcChkYXRhKSkge1xuICAgIHJldHVybiB0aGlzLmRlZXBVbndyYXAodW53cmFwKGRhdGEpLCBvcHRpb25zKTtcbiAgfVxuICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBkYXRhLm1hcCh2YWwgPT4gdGhpcy5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucykpO1xuICB9XG4gIGlmICh0aGlzLmdldEV4YWN0VHlwZShkYXRhKSA9PT0gT2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhkYXRhKS5tYXAoKFtrZXksIHZhbF0pID0+IHtcbiAgICAgIHJldHVybiBba2V5LCB0aGlzLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgfSkpO1xuICB9XG4gIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIvLyDovoXliqlcbmV4cG9ydCBjb25zdCBTdXBwb3J0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiDlsZ7mgKflkI3nu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAqIEBwYXJhbSBuYW1lcyDlsZ7mgKflkI3jgILmoLzlvI8gJ2EsYixjJyDmiJYgWydhJywnYicsJ2MnXVxuICogQHBhcmFtIHNlcGFyYXRvciBuYW1lcyDkuLrlrZfnrKbkuLLml7bnmoTmi4bliIbop4TliJnjgILlkIwgc3BsaXQg5pa55rOV55qEIHNlcGFyYXRvcu+8jOWtl+espuS4suaXoOmcgOaLhuWIhueahOWPr+S7peS8oCBudWxsIOaIliB1bmRlZmluZWRcbiAqIEByZXR1cm5zIHsqW11bXXwoTWFnaWNTdHJpbmcgfCBCdW5kbGUgfCBzdHJpbmcpW118RmxhdEFycmF5PChGbGF0QXJyYXk8KCp8WypbXV18W10pW10sIDE+W118KnxbKltdXXxbXSlbXSwgMT5bXXwqW119XG4gKi9cblN1cHBvcnQubmFtZXNUb0FycmF5ID0gZnVuY3Rpb24obmFtZXMgPSBbXSwgeyBzZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSB7XG4gIGlmIChuYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIG5hbWVzLm1hcCh2YWwgPT4gdGhpcy5uYW1lc1RvQXJyYXkodmFsKSkuZmxhdCgpO1xuICB9XG4gIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5hbWVzLnNwbGl0KHNlcGFyYXRvcikubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N5bWJvbCcpIHtcbiAgICByZXR1cm4gW25hbWVzXTtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG4vKipcbiAqIOe7keWumnRoaXPjgILluLjnlKjkuo7op6PmnoTlh73mlbDml7bnu5HlrpogdGhpcyDpgb/lhY3miqXplJlcbiAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAqIEByZXR1cm5zIHsqfVxuICovXG5TdXBwb3J0LmJpbmRUaGlzID0gZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIHtcbiAgICBnZXQodGFyZ2V0LCBwLCByZWNlaXZlcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBSZWZsZWN0LmdldCguLi5hcmd1bWVudHMpO1xuICAgICAgLy8g5Ye95pWw57G75Z6L57uR5a6adGhpc1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmJpbmQodGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWxnuaAp+WOn+agt+i/lOWbnlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gIH0pO1xufTtcbiIsIi8vIOWvueixoVxuaW1wb3J0IHsgX1JlZmxlY3QgfSBmcm9tICcuL19SZWZsZWN0JztcbmltcG9ydCB7IERhdGEgfSBmcm9tICcuL0RhdGEnO1xuaW1wb3J0IHsgU3VwcG9ydCB9IGZyb20gJy4vU3VwcG9ydCc7XG5cbi8vIGV4dGVuZHMgT2JqZWN0IOaWueW8j+iwg+eUqCBzdXBlciDlsIbnlJ/miJDnqbrlr7nosaHvvIzkuI3kvJrlg4/mma7pgJrmnoTpgKDlh73mlbDpgqPmoLfliJvlu7rkuIDkuKrmlrDnmoTlr7nosaHvvIzmlLnlrp7njrBcbmV4cG9ydCBjbGFzcyBfT2JqZWN0IHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGNyZWF0ZSDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGZyb21FbnRyaWVzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgaXMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBnZXRQcm90b3R5cGVPZiDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIHNldFByb3RvdHlwZU9mIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgaGFzT3duIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZGVmaW5lUHJvcGVydHkg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBkZWZpbmVQcm9wZXJ0aWVzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5TmFtZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBwcmV2ZW50RXh0ZW5zaW9ucyDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIHNlYWwg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBmcmVlemUg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBpc0V4dGVuc2libGUg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBpc1NlYWxlZCDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGlzRnJvemVuIOaXoOmcgOWumuWItlxuXG4gIC8qKlxuICAgKiAo5a6a5Yi25pa55rOVKSDmtYXlkIjlubblr7nosaHjgILlhpnms5XlkIwgT2JqZWN0LmFzc2lnbu+8jOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICAgKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIC8vIOS4jeS9v+eUqCB0YXJnZXRba2V5XSA9IHZhbHVlIOWGmeazle+8jOebtOaOpeS9v+eUqCBPYmplY3QuZGVmaW5lUHJvcGVydHkg6YeN5a6a5LmJXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5rex5ZCI5bm25a+56LGh44CC5ZCMIGFzc2lnbiDkuIDmoLfkuZ/kvJrlr7nlsZ7mgKfov5vooYzph43lrprkuYlcbiAgICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaHjgILpu5jorqTlgLwge30g6Ziy5q2i6YCS5b2S5pe25oqlIFR5cGVFcnJvcjogT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0XG4gICAqIEBwYXJhbSBzb3VyY2VzIOaVsOaNrua6kOOAguS4gOS4quaIluWkmuS4quWvueixoVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZGVlcEFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgIC8vIHZhbHVlIOWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICAgIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZGVzYy52YWx1ZSkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuICAgICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQXNzaWduKHRhcmdldFtrZXldLCBkZXNjLnZhbHVlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBnZXQvc2V0IOWGmeazle+8muebtOaOpeWumuS5iVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDojrflj5blsZ7mgKflkI3jgILpu5jorqTlj4LmlbDphY3nva7miJDlkIwgT2JqZWN0LmtleXMg6KGM5Li6XG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHthbnlbXX1cbiAgICovXG4gIHN0YXRpYyBrZXlzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIC8vIHNldOeUqOS6jmtleeWOu+mHjVxuICAgIGxldCBzZXQgPSBuZXcgU2V0KCk7XG4gICAgLy8g6Ieq6Lqr5bGe5oCn562b6YCJXG4gICAgY29uc3QgZGVzY3MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3QpO1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgX1JlZmxlY3Qub3duRW50cmllcyhkZXNjcykpIHtcbiAgICAgIC8vIOW/veeVpXN5bWJvbOWxnuaAp+eahOaDheWGtVxuICAgICAgaWYgKCFzeW1ib2wgJiYgdHlwZW9mIGtleSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlv73nlaXkuI3lj6/liJfkuL7lsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghbm90RW51bWVyYWJsZSAmJiAhZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5bGe5oCn5Yqg5YWlXG4gICAgICBzZXQuYWRkKGtleSk7XG4gICAgfVxuICAgIC8vIOe7p+aJv+WxnuaAp1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgaWYgKF9fcHJvdG9fXyAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXJlbnRLZXlzID0gdGhpcy5rZXlzKF9fcHJvdG9fXywgb3B0aW9ucyk7XG4gICAgICAgIGZvciAoY29uc3QgcGFyZW50S2V5IG9mIHBhcmVudEtleXMpIHtcbiAgICAgICAgICBzZXQuYWRkKHBhcmVudEtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8g6L+U5Zue5pWw57uEXG4gICAgcmV0dXJuIEFycmF5LmZyb20oc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5a6a5Yi25pa55rOVKVxuICAgKi9cbiAgc3RhdGljIHZhbHVlcygpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5a6a5Yi25pa55rOVKVxuICAgKi9cbiAgc3RhdGljIGVudHJpZXMoKSB7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkga2V56Ieq6Lqr5omA5bGe55qE5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXkg5bGe5oCn5ZCNXG4gICAqIEByZXR1cm5zIHsqfG51bGx9XG4gICAqL1xuICBzdGF0aWMgb3duZXIob2JqZWN0LCBrZXkpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gICAgbGV0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vd25lcihfX3Byb3RvX18sIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6I635Y+W5bGe5oCn5o+P6L+w5a+56LGh77yM55u45q+UIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3LvvIzog73mi7/liLDnu6fmib/lsZ7mgKfnmoTmj4/ov7Dlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR8UHJvcGVydHlEZXNjcmlwdG9yfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpIHtcbiAgICBjb25zdCBmaW5kT2JqZWN0ID0gdGhpcy5vd25lcihvYmplY3QsIGtleSk7XG4gICAgaWYgKCFmaW5kT2JqZWN0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmaW5kT2JqZWN0LCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOWvueW6lCBrZXlzIOiOt+WPliBkZXNjcmlwdG9yc++8jOS8oOWPguWQjCBrZXlzIOaWueazleOAguWPr+eUqOS6jumHjeWumuS5ieWxnuaAp1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7KFByb3BlcnR5RGVzY3JpcHRvcnx1bmRlZmluZWQpW119XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvcnMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3QgX2tleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2tleXMubWFwKGtleSA9PiB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvckVudHJpZXPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge1sqLChQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkKV1bXX1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9yRW50cmllcyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICBjb25zdCBfa2V5cyA9IHRoaXMua2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICAgIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IFtrZXksIHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSldKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDov4fmu6Tlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHBpY2sg5oyR6YCJ5bGe5oCnXG4gICAqIEBwYXJhbSBvbWl0IOW/veeVpeWxnuaAp1xuICAgKiBAcGFyYW0gZW1wdHlQaWNrIHBpY2sg5Li656m65pe255qE5Y+W5YC844CCYWxsIOWFqOmDqGtlee+8jGVtcHR5IOepulxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOWQjCBuYW1lc1RvQXJyYXkg55qEIHNlcGFyYXRvciDlj4LmlbBcbiAgICogQHBhcmFtIHN5bWJvbCDlkIwga2V5cyDnmoQgc3ltYm9sIOWPguaVsFxuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDlkIwga2V5cyDnmoQgbm90RW51bWVyYWJsZSDlj4LmlbBcbiAgICogQHBhcmFtIGV4dGVuZCDlkIwga2V5cyDnmoQgZXh0ZW5kIOWPguaVsFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZmlsdGVyKG9iamVjdCwgeyBwaWNrID0gW10sIG9taXQgPSBbXSwgZW1wdHlQaWNrID0gJ2FsbCcsIHNlcGFyYXRvciA9ICcsJywgc3ltYm9sID0gdHJ1ZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSB0cnVlIH0gPSB7fSkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAvLyBwaWNr44CBb21pdCDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgICBwaWNrID0gU3VwcG9ydC5uYW1lc1RvQXJyYXkocGljaywgeyBzZXBhcmF0b3IgfSk7XG4gICAgb21pdCA9IFN1cHBvcnQubmFtZXNUb0FycmF5KG9taXQsIHsgc2VwYXJhdG9yIH0pO1xuICAgIGxldCBfa2V5cyA9IFtdO1xuICAgIC8vIHBpY2vmnInlgLznm7TmjqXmi7/vvIzkuLrnqbrml7bmoLnmja4gZW1wdHlQaWNrIOm7mOiupOaLv+epuuaIluWFqOmDqGtleVxuICAgIF9rZXlzID0gcGljay5sZW5ndGggPiAwIHx8IGVtcHR5UGljayA9PT0gJ2VtcHR5JyA/IHBpY2sgOiB0aGlzLmtleXMob2JqZWN0LCB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH0pO1xuICAgIC8vIG9taXTnrZvpgIlcbiAgICBfa2V5cyA9IF9rZXlzLmZpbHRlcihrZXkgPT4gIW9taXQuaW5jbHVkZXMoa2V5KSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgX2tleXMpIHtcbiAgICAgIGNvbnN0IGRlc2MgPSB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuICAgICAgLy8g5bGe5oCn5LiN5a2Y5Zyo5a+86Ie0ZGVzY+W+l+WIsHVuZGVmaW5lZOaXtuS4jeiuvue9ruWAvFxuICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDpgJrov4fmjJHpgInmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXIg55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgcGljayhvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBwaWNrOiBrZXlzLCBlbXB0eVBpY2s6ICdlbXB0eScsIC4uLm9wdGlvbnMgfSk7XG4gIH1cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOmAmui/h+aOkumZpOaWueW8j+mAieWPluWvueixoeOAgmZpbHRlciDnmoTnroDlhpnmlrnlvI9cbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIGtleXMg5bGe5oCn5ZCN6ZuG5ZCIXG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBvbWl0KG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIob2JqZWN0LCB7IG9taXQ6IGtleXMsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0ge30pIHtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmFzc2lnbih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyAo5a6a5Yi25pa55rOVKVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1N0cmluZygpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7fSk7XG4gICAgfVxuICB9XG5cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzKS5sZW5ndGggPiAwO1xuICB9XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5PYmplY3Quc2V0UHJvdG90eXBlT2YoX09iamVjdCwgT2JqZWN0KTtcbiIsImV4cG9ydCBjbGFzcyBfU3RyaW5nIGV4dGVuZHMgU3RyaW5nIHtcbiAgLyoqXG4gICAqIFN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGZyb21DaGFyQ29kZSDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGZyb21Db2RlUG9pbnQg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyByYXcg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOmmluWtl+avjeWkp+WGmVxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvRmlyc3RVcHBlckNhc2UobmFtZSA9ICcnKSB7XG4gICAgcmV0dXJuIGAkeyhuYW1lWzBdID8/ICcnKS50b1VwcGVyQ2FzZSgpfSR7bmFtZS5zbGljZSgxKX1gO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOmmluWtl+avjeWwj+WGmVxuICAgKiBAcGFyYW0gbmFtZSDlkI3np7BcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0ZpcnN0TG93ZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9Mb3dlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDovazpqbzls7Dlkb3lkI3jgILluLjnlKjkuo7ov57mjqXnrKblkb3lkI3ovazpqbzls7Dlkb3lkI3vvIzlpoIgeHgtbmFtZSAtPiB4eE5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ym44CC55So5LqO55Sf5oiQ5q2j5YiZIOm7mOiupOS4uuS4reWIkue6vyAtIOWvueW6lHJlZ2V4cOW+l+WIsCAvLShcXHcpL2dcbiAgICogQHBhcmFtIGZpcnN0IOmmluWtl+avjeWkhOeQhuaWueW8j+OAgnRydWUg5oiWICd1cHBlcmNhc2Un77ya6L2s5o2i5oiQ5aSn5YaZO1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIOaIliAnbG93ZXJjYXNlJ++8mui9rOaNouaIkOWwj+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAncmF3JyDmiJYg5YW25LuW5peg5pWI5YC877ya6buY6K6k5Y6f5qC36L+U5Zue77yM5LiN6L+b6KGM5aSE55CGO1xuICAgKiBAcmV0dXJucyB7TWFnaWNTdHJpbmd8c3RyaW5nfHN0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0NhbWVsQ2FzZShuYW1lLCB7IHNlcGFyYXRvciA9ICctJywgZmlyc3QgPSAncmF3JyB9ID0ge30pIHtcbiAgICAvLyDnlJ/miJDmraPliJlcbiAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke3NlcGFyYXRvcn0oXFxcXHcpYCwgJ2cnKTtcbiAgICAvLyDmi7zmjqXmiJDpqbzls7BcbiAgICBjb25zdCBjYW1lbE5hbWUgPSBuYW1lLnJlcGxhY2VBbGwocmVnZXhwLCAoc3Vic3RyLCAkMSkgPT4ge1xuICAgICAgcmV0dXJuICQxLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG4gICAgLy8g6aaW5a2X5q+N5aSn5bCP5YaZ5qC55o2u5Lyg5Y+C5Yik5patXG4gICAgaWYgKFt0cnVlLCAndXBwZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0ZpcnN0VXBwZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIGlmIChbZmFsc2UsICdsb3dlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvRmlyc3RMb3dlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbWVsTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDovazov57mjqXnrKblkb3lkI3jgILluLjnlKjkuo7pqbzls7Dlkb3lkI3ovazov57mjqXnrKblkb3lkI3vvIzlpoIgeHhOYW1lIC0+IHh4LW5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ymXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9MaW5lQ2FzZShuYW1lID0gJycsIHsgc2VwYXJhdG9yID0gJy0nIH0gPSB7fSkge1xuICAgIHJldHVybiBuYW1lXG4gICAgLy8g5oyJ6L+e5o6l56ym5ou85o6lXG4gICAgICAucmVwbGFjZUFsbCgvKFthLXpdKShbQS1aXSkvZywgYCQxJHtzZXBhcmF0b3J9JDJgKVxuICAgIC8vIOi9rOWwj+WGmVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gIH1cbn1cbiIsIi8vIOagt+W8j+WkhOeQhlxuZXhwb3J0IGNvbnN0IFN0eWxlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiDljZXkvY3lrZfnrKbkuLLjgILlr7nmlbDlrZfmiJbmlbDlrZfmoLzlvI/nmoTlrZfnrKbkuLLoh6rliqjmi7zljZXkvY3vvIzlhbbku5blrZfnrKbkuLLljp/moLfov5Tlm55cbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEBwYXJhbSB1bml0IOWNleS9jeOAgnZhbHVl5rKh5bim5Y2V5L2N5pe26Ieq5Yqo5ou85o6l77yM5Y+v5LygIHB4L2VtLyUg562JXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN0cmluZ31cbiAqL1xuU3R5bGUuZ2V0VW5pdFN0cmluZyA9IGZ1bmN0aW9uKHZhbHVlID0gJycsIHsgdW5pdCA9ICdweCcgfSA9IHt9KSB7XG4gIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgLy8g5rOo5oSP77ya6L+Z6YeM5L2/55SoID09IOWIpOaWre+8jOS4jeS9v+eUqCA9PT1cbiAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPT0gdmFsdWUgPyBgJHt2YWx1ZX0ke3VuaXR9YCA6IFN0cmluZyh2YWx1ZSk7XG59O1xuIiwiLy8gdnVlIOaVsOaNruWkhOeQhlxuaW1wb3J0IHsgX1N0cmluZyB9IGZyb20gJy4vX1N0cmluZyc7XG5pbXBvcnQgeyBEYXRhIH0gZnJvbSAnLi9EYXRhJztcblxuZXhwb3J0IGNvbnN0IFZ1ZURhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vKipcbiAgICog5rex6Kej5YyFIHZ1ZTMg5ZON5bqU5byP5a+56LGh5pWw5o2uXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiAqfX18KnwoKnx7W3A6IHN0cmluZ106ICp9KVtdfHtbcDogc3RyaW5nXTogKn19XG4gICAqL1xuVnVlRGF0YS5kZWVwVW53cmFwVnVlMyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgcmV0dXJuIERhdGEuZGVlcFVud3JhcChkYXRhLCB7XG4gICAgaXNXcmFwOiBkYXRhID0+IGRhdGE/Ll9fdl9pc1JlZixcbiAgICB1bndyYXA6IGRhdGEgPT4gZGF0YS52YWx1ZSxcbiAgfSk7XG59O1xuXG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcERlZmluaXRpb25zIHByb3BzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0UHJvcHNGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgcHJvcERlZmluaXRpb25zKSB7XG4gIC8vIHByb3BzIOWumuS5iee7n+S4gOaIkOWvueixoeagvOW8j++8jHR5cGUg57uf5LiA5oiQ5pWw57uE5qC85byP5Lul5L6/5ZCO57ut5Yik5patXG4gIGlmIChwcm9wRGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhwcm9wRGVmaW5pdGlvbnMubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIHsgdHlwZTogW10gfV0pKTtcbiAgfSBlbHNlIGlmIChEYXRhLmlzUGxhaW5PYmplY3QocHJvcERlZmluaXRpb25zKSkge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpLm1hcCgoW25hbWUsIGRlZmluaXRpb25dKSA9PiB7XG4gICAgICBkZWZpbml0aW9uID0gRGF0YS5pc1BsYWluT2JqZWN0KGRlZmluaXRpb24pXG4gICAgICAgID8geyAuLi5kZWZpbml0aW9uLCB0eXBlOiBbZGVmaW5pdGlvbi50eXBlXS5mbGF0KCkgfVxuICAgICAgICA6IHsgdHlwZTogW2RlZmluaXRpb25dLmZsYXQoKSB9O1xuICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBkZWZpbml0aW9uXTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgcHJvcERlZmluaXRpb25zID0ge307XG4gIH1cbiAgLy8g6K6+572u5YC8XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBbbmFtZSwgZGVmaW5pdGlvbl0gb2YgT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKSkge1xuICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBkZWZpbml0aW9uLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICAvLyBwcm9wTmFtZSDmiJYgcHJvcC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgY29uc3QgYXR0clZhbHVlID0gYXR0cnNbbmFtZV07XG4gICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgIC8vIOWPquWMheWQq0Jvb2xlYW7nsbvlnovnmoQnJ+i9rOaNouS4unRydWXvvIzlhbbku5bljp/moLfotYvlgLxcbiAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBkZWZpbml0aW9uLnR5cGUubGVuZ3RoID09PSAxICYmIGRlZmluaXRpb24udHlwZS5pbmNsdWRlcyhCb29sZWFuKSAmJiBhdHRyVmFsdWUgPT09ICcnID8gdHJ1ZSA6IGF0dHJWYWx1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gcHJvcC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgaWYgKGVuZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZXRSZXN1bHQoeyBuYW1lOiBfU3RyaW5nLnRvTGluZUNhc2UobmFtZSksIGRlZmluaXRpb24sIGVuZDogdHJ1ZSB9KTtcbiAgICB9KSh7XG4gICAgICBuYW1lLCBkZWZpbml0aW9uLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBlbWl0cyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gZW1pdERlZmluaXRpb25zIGVtaXRzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0RW1pdHNGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgZW1pdERlZmluaXRpb25zKSB7XG4gIC8vIGVtaXRzIOWumuS5iee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGVtaXREZWZpbml0aW9ucykpIHtcbiAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICB9IGVsc2UgaWYgKCEoZW1pdERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgZW1pdERlZmluaXRpb25zID0gW107XG4gIH1cbiAgLy8g57uf5LiA5aSE55CG5oiQIG9uRW1pdE5hbWXjgIFvblVwZGF0ZTplbWl0TmFtZSh2LW1vZGVs57O75YiXKSDmoLzlvI9cbiAgY29uc3QgZW1pdE5hbWVzID0gZW1pdERlZmluaXRpb25zLm1hcChuYW1lID0+IF9TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKSk7XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBlbWl0TmFtZXMpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgnb25VcGRhdGU6JykpIHtcbiAgICAgICAgLy8gb25VcGRhdGU6ZW1pdE5hbWUg5oiWIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSBfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgaWYgKGVuZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UobmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpKX1gLCBlbmQ6IHRydWUgfSk7XG4gICAgICB9XG4gICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICByZXN1bHRbbmFtZV0gPSBhdHRyc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9KSh7IG5hbWUgfSk7XG4gIH1cbiAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPluWJqeS9meWxnuaAp+OAguW4uOeUqOS6jue7hOS7tiBpbmhlcml0QXR0cnMg6K6+572uIGZhbHNlIOaXtuS9v+eUqOS9nOS4uuaWsOeahCBhdHRyc1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wcyDlrprkuYkg5oiWIHZ1ZSBwcm9wc++8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHBhcmFtIGVtaXRzIGVtaXRzIOWumuS5iSDmiJYgdnVlIGVtaXRz77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICAgKiBAcGFyYW0gbGlzdCDpop3lpJbnmoTmma7pgJrlsZ7mgKdcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0UmVzdEZyb21BdHRycyA9IGZ1bmN0aW9uKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAvLyDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgcHJvcHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAocHJvcHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICB9XG4gICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KHByb3BzKSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGFyci5tYXAobmFtZSA9PiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpXSkuZmxhdCgpO1xuICB9KSgpO1xuICBlbWl0cyA9ICgoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gKCgpID0+IHtcbiAgICAgIGlmIChlbWl0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJldHVybiBlbWl0cztcbiAgICAgIH1cbiAgICAgIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZW1pdHMpKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcCgobmFtZSkgPT4ge1xuICAgICAgLy8gdXBkYXRlOmVtaXROYW1lIOaIliB1cGRhdGU6ZW1pdC1uYW1lIOagvOW8j1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgIGNvbnN0IHBhcnROYW1lID0gbmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpO1xuICAgICAgICByZXR1cm4gW2BvblVwZGF0ZToke19TdHJpbmcudG9DYW1lbENhc2UocGFydE5hbWUpfWAsIGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShwYXJ0TmFtZSl9YF07XG4gICAgICB9XG4gICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKV07XG4gICAgfSkuZmxhdCgpO1xuICB9KSgpO1xuICBsaXN0ID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSB0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZydcbiAgICAgID8gbGlzdC5zcGxpdCgnLCcpXG4gICAgICA6IGxpc3QgaW5zdGFuY2VvZiBBcnJheSA/IGxpc3QgOiBbXTtcbiAgICByZXR1cm4gYXJyLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICB9KSgpO1xuICBjb25zdCBsaXN0QWxsID0gQXJyYXkuZnJvbShuZXcgU2V0KFtwcm9wcywgZW1pdHMsIGxpc3RdLmZsYXQoKSkpO1xuICAvLyBjb25zb2xlLmxvZygnbGlzdEFsbCcsIGxpc3RBbGwpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IFtuYW1lLCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhhdHRycykpKSB7XG4gICAgaWYgKCFsaXN0QWxsLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBuYW1lLCBkZXNjKTtcbiAgICB9XG4gIH1cbiAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8g5Z+656GA5qih5Z2X44CC5pyJ5ZCM5ZCN5Y6f55Sf5a+56LGh55qE5YqgIF8g5Yy65YiGXG5leHBvcnQgKiBmcm9tICcuL19BcnJheSc7XG5leHBvcnQgKiBmcm9tICcuL19Cb29sZWFuJztcbmV4cG9ydCAqIGZyb20gJy4vX0RhdGUnO1xuZXhwb3J0ICogZnJvbSAnLi9fTWF0aCc7XG5leHBvcnQgKiBmcm9tICcuL19OdW1iZXInO1xuZXhwb3J0ICogZnJvbSAnLi9fT2JqZWN0JztcbmV4cG9ydCAqIGZyb20gJy4vX1JlZmxlY3QnO1xuZXhwb3J0ICogZnJvbSAnLi9fU2V0JztcbmV4cG9ydCAqIGZyb20gJy4vX1N0cmluZyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vRGF0YSc7XG5leHBvcnQgKiBmcm9tICcuL1N0eWxlJztcbmV4cG9ydCAqIGZyb20gJy4vU3VwcG9ydCc7XG5leHBvcnQgKiBmcm9tICcuL1Z1ZURhdGEnO1xuIiwiLyoqXG4gKiBlc2xpbnQg6YWN572u77yaaHR0cDovL2VzbGludC5jbi9kb2NzL3J1bGVzL1xuICogZXNsaW50LXBsdWdpbi12dWUg6YWN572u77yaaHR0cHM6Ly9lc2xpbnQudnVlanMub3JnL3J1bGVzL1xuICovXG5pbXBvcnQgeyBfT2JqZWN0LCBEYXRhIH0gZnJvbSAnLi4vYmFzZSc7XG5cbi8qKlxuICog5a+85Ye65bi46YeP5L6/5o235L2/55SoXG4gKi9cbmV4cG9ydCBjb25zdCBPRkYgPSAnb2ZmJztcbmV4cG9ydCBjb25zdCBXQVJOID0gJ3dhcm4nO1xuZXhwb3J0IGNvbnN0IEVSUk9SID0gJ2Vycm9yJztcbi8qKlxuICog5a6a5Yi255qE6YWN572uXG4gKi9cbi8vIOWfuuehgOWumuWItlxuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSB7XG4gIC8vIOeOr+Wig+OAguS4gOS4queOr+Wig+WumuS5ieS6huS4gOe7hOmihOWumuS5ieeahOWFqOWxgOWPmOmHj1xuICBlbnY6IHtcbiAgICBicm93c2VyOiB0cnVlLFxuICAgIG5vZGU6IHRydWUsXG4gIH0sXG4gIC8vIOWFqOWxgOWPmOmHj1xuICBnbG9iYWxzOiB7XG4gICAgZ2xvYmFsVGhpczogJ3JlYWRvbmx5JyxcbiAgICBCaWdJbnQ6ICdyZWFkb25seScsXG4gIH0sXG4gIC8vIOino+aekOWZqFxuICBwYXJzZXJPcHRpb25zOiB7XG4gICAgZWNtYVZlcnNpb246ICdsYXRlc3QnLFxuICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnLFxuICAgIGVjbWFGZWF0dXJlczoge1xuICAgICAganN4OiB0cnVlLFxuICAgICAgZXhwZXJpbWVudGFsT2JqZWN0UmVzdFNwcmVhZDogdHJ1ZSxcbiAgICB9LFxuICB9LFxuICAvKipcbiAgICog57un5om/XG4gICAqIOS9v+eUqGVzbGludOeahOinhOWIme+8mmVzbGludDrphY3nva7lkI3np7BcbiAgICog5L2/55So5o+S5Lu255qE6YWN572u77yacGx1Z2luOuWMheWQjeeugOWGmS/phY3nva7lkI3np7BcbiAgICovXG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggZXNsaW50IOaOqOiNkOeahOinhOWImVxuICAgICdlc2xpbnQ6cmVjb21tZW5kZWQnLFxuICBdLFxuICAvKipcbiAgICog6KeE5YiZXG4gICAqIOadpeiHqiBlc2xpbnQg55qE6KeE5YiZ77ya6KeE5YiZSUQgOiB2YWx1ZVxuICAgKiDmnaXoh6rmj5Lku7bnmoTop4TliJnvvJrljIXlkI3nroDlhpkv6KeE5YiZSUQgOiB2YWx1ZVxuICAgKi9cbiAgcnVsZXM6IHtcbiAgICAvKipcbiAgICAgKiBQb3NzaWJsZSBFcnJvcnNcbiAgICAgKiDov5nkupvop4TliJnkuI4gSmF2YVNjcmlwdCDku6PnoIHkuK3lj6/og73nmoTplJnor6/miJbpgLvovpHplJnor6/mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnZ2V0dGVyLXJldHVybic6IE9GRiwgLy8g5by65Yi2IGdldHRlciDlh73mlbDkuK3lh7rnjrAgcmV0dXJuIOivreWPpVxuICAgICduby1jb25zdGFudC1jb25kaXRpb24nOiBPRkYsIC8vIOemgeatouWcqOadoeS7tuS4reS9v+eUqOW4uOmHj+ihqOi+vuW8j1xuICAgICduby1lbXB0eSc6IE9GRiwgLy8g56aB5q2i5Ye6546w56m66K+t5Y+l5Z2XXG4gICAgJ25vLWV4dHJhLXNlbWknOiBXQVJOLCAvLyDnpoHmraLkuI3lv4XopoHnmoTliIblj7dcbiAgICAnbm8tZnVuYy1hc3NpZ24nOiBPRkYsIC8vIOemgeatouWvuSBmdW5jdGlvbiDlo7DmmI7ph43mlrDotYvlgLxcbiAgICAnbm8tcHJvdG90eXBlLWJ1aWx0aW5zJzogT0ZGLCAvLyDnpoHmraLnm7TmjqXosIPnlKggT2JqZWN0LnByb3RvdHlwZXMg55qE5YaF572u5bGe5oCnXG5cbiAgICAvKipcbiAgICAgKiBCZXN0IFByYWN0aWNlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6juacgOS9s+Wunui3teeahO+8jOW4ruWKqeS9oOmBv+WFjeS4gOS6m+mXrumimO+8mlxuICAgICAqL1xuICAgICdhY2Nlc3Nvci1wYWlycyc6IEVSUk9SLCAvLyDlvLrliLYgZ2V0dGVyIOWSjCBzZXR0ZXIg5Zyo5a+56LGh5Lit5oiQ5a+55Ye6546wXG4gICAgJ2FycmF5LWNhbGxiYWNrLXJldHVybic6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueazleeahOWbnuiwg+WHveaVsOS4reaciSByZXR1cm4g6K+t5Y+lXG4gICAgJ2Jsb2NrLXNjb3BlZC12YXInOiBFUlJPUiwgLy8g5by65Yi25oqK5Y+Y6YeP55qE5L2/55So6ZmQ5Yi25Zyo5YW25a6a5LmJ55qE5L2c55So5Z+f6IyD5Zu05YaFXG4gICAgJ2N1cmx5JzogV0FSTiwgLy8g5by65Yi25omA5pyJ5o6n5Yi26K+t5Y+l5L2/55So5LiA6Ie055qE5ous5Y+36aOO5qC8XG4gICAgJ25vLWZhbGx0aHJvdWdoJzogV0FSTiwgLy8g56aB5q2iIGNhc2Ug6K+t5Y+l6JC956m6XG4gICAgJ25vLWZsb2F0aW5nLWRlY2ltYWwnOiBFUlJPUiwgLy8g56aB5q2i5pWw5a2X5a2X6Z2i6YeP5Lit5L2/55So5YmN5a+85ZKM5pyr5bC+5bCP5pWw54K5XG4gICAgJ25vLW11bHRpLXNwYWNlcyc6IFdBUk4sIC8vIOemgeatouS9v+eUqOWkmuS4quepuuagvFxuICAgICduby1uZXctd3JhcHBlcnMnOiBFUlJPUiwgLy8g56aB5q2i5a+5IFN0cmluZ++8jE51bWJlciDlkowgQm9vbGVhbiDkvb/nlKggbmV3IOaTjeS9nOesplxuICAgICduby1wcm90byc6IEVSUk9SLCAvLyDnpoHnlKggX19wcm90b19fIOWxnuaAp1xuICAgICduby1yZXR1cm4tYXNzaWduJzogV0FSTiwgLy8g56aB5q2i5ZyoIHJldHVybiDor63lj6XkuK3kvb/nlKjotYvlgLzor63lj6VcbiAgICAnbm8tdXNlbGVzcy1lc2NhcGUnOiBXQVJOLCAvLyDnpoHnlKjkuI3lv4XopoHnmoTovazkuYnlrZfnrKZcblxuICAgIC8qKlxuICAgICAqIFZhcmlhYmxlc1xuICAgICAqIOi/meS6m+inhOWImeS4juWPmOmHj+WjsOaYjuacieWFs++8mlxuICAgICAqL1xuICAgICduby11bmRlZi1pbml0JzogV0FSTiwgLy8g56aB5q2i5bCG5Y+Y6YeP5Yid5aeL5YyW5Li6IHVuZGVmaW5lZFxuICAgICduby11bnVzZWQtdmFycyc6IE9GRiwgLy8g56aB5q2i5Ye6546w5pyq5L2/55So6L+H55qE5Y+Y6YePXG4gICAgJ25vLXVzZS1iZWZvcmUtZGVmaW5lJzogW0VSUk9SLCB7ICdmdW5jdGlvbnMnOiBmYWxzZSwgJ2NsYXNzZXMnOiBmYWxzZSwgJ3ZhcmlhYmxlcyc6IGZhbHNlIH1dLCAvLyDnpoHmraLlnKjlj5jph4/lrprkuYnkuYvliY3kvb/nlKjlroPku6xcblxuICAgIC8qKlxuICAgICAqIFN0eWxpc3RpYyBJc3N1ZXNcbiAgICAgKiDov5nkupvop4TliJnmmK/lhbPkuo7po47moLzmjIfljZfnmoTvvIzogIzkuJTmmK/pnZ7luLjkuLvop4LnmoTvvJpcbiAgICAgKi9cbiAgICAnYXJyYXktYnJhY2tldC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25pWw57uE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Jsb2NrLXNwYWNpbmcnOiBXQVJOLCAvLyDnpoHmraLmiJblvLrliLblnKjku6PnoIHlnZfkuK3lvIDmi6zlj7fliY3lkozpl63mi6zlj7flkI7mnInnqbrmoLxcbiAgICAnYnJhY2Utc3R5bGUnOiBbV0FSTiwgJzF0YnMnLCB7ICdhbGxvd1NpbmdsZUxpbmUnOiB0cnVlIH1dLCAvLyDlvLrliLblnKjku6PnoIHlnZfkuK3kvb/nlKjkuIDoh7TnmoTlpKfmi6zlj7fpo47moLxcbiAgICAnY29tbWEtZGFuZ2xlJzogW1dBUk4sICdhbHdheXMtbXVsdGlsaW5lJ10sIC8vIOimgeaxguaIluemgeatouacq+WwvumAl+WPt1xuICAgICdjb21tYS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6YCX5Y+35YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2NvbW1hLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25L2/55So5LiA6Ie055qE6YCX5Y+36aOO5qC8XG4gICAgJ2NvbXB1dGVkLXByb3BlcnR5LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjorqHnrpfnmoTlsZ7mgKfnmoTmlrnmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnZnVuYy1jYWxsLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjlh73mlbDmoIfor4bnrKblkozlhbbosIPnlKjkuYvpl7TmnInnqbrmoLxcbiAgICAnZnVuY3Rpb24tcGFyZW4tbmV3bGluZSc6IFdBUk4sIC8vIOW8uuWItuWcqOWHveaVsOaLrOWPt+WGheS9v+eUqOS4gOiHtOeahOaNouihjFxuICAgICdpbXBsaWNpdC1hcnJvdy1saW5lYnJlYWsnOiBXQVJOLCAvLyDlvLrliLbpmpDlvI/ov5Tlm57nmoTnrq3lpLTlh73mlbDkvZPnmoTkvY3nva5cbiAgICAnaW5kZW50JzogW1dBUk4sIDIsIHsgJ1N3aXRjaENhc2UnOiAxIH1dLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTnvKnov5tcbiAgICAnanN4LXF1b3Rlcyc6IFdBUk4sIC8vIOW8uuWItuWcqCBKU1gg5bGe5oCn5Lit5LiA6Ie05Zyw5L2/55So5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ2tleS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo5a+56LGh5a2X6Z2i6YeP55qE5bGe5oCn5Lit6ZSu5ZKM5YC85LmL6Ze05L2/55So5LiA6Ie055qE6Ze06LedXG4gICAgJ2tleXdvcmQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWFs+mUruWtl+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICduZXctcGFyZW5zJzogV0FSTiwgLy8g5by65Yi25oiW56aB5q2i6LCD55So5peg5Y+C5p6E6YCg5Ye95pWw5pe25pyJ5ZyG5ous5Y+3XG4gICAgJ25vLW1peGVkLXNwYWNlcy1hbmQtdGFicyc6IFdBUk4sXG4gICAgJ25vLW11bHRpcGxlLWVtcHR5LWxpbmVzJzogW1dBUk4sIHsgJ21heCc6IDEsICdtYXhFT0YnOiAwLCAnbWF4Qk9GJzogMCB9XSwgLy8g56aB5q2i5Ye6546w5aSa6KGM56m66KGMXG4gICAgJ25vLXRyYWlsaW5nLXNwYWNlcyc6IFdBUk4sIC8vIOemgeeUqOihjOWwvuepuuagvFxuICAgICduby13aGl0ZXNwYWNlLWJlZm9yZS1wcm9wZXJ0eSc6IFdBUk4sIC8vIOemgeatouWxnuaAp+WJjeacieepuueZvVxuICAgICdub25ibG9jay1zdGF0ZW1lbnQtYm9keS1wb3NpdGlvbic6IFdBUk4sIC8vIOW8uuWItuWNleS4quivreWPpeeahOS9jee9rlxuICAgICdvYmplY3QtY3VybHktbmV3bGluZSc6IFtXQVJOLCB7ICdtdWx0aWxpbmUnOiB0cnVlLCAnY29uc2lzdGVudCc6IHRydWUgfV0sIC8vIOW8uuWItuWkp+aLrOWPt+WGheaNouihjOespueahOS4gOiHtOaAp1xuICAgICdvYmplY3QtY3VybHktc3BhY2luZyc6IFtXQVJOLCAnYWx3YXlzJ10sIC8vIOW8uuWItuWcqOWkp+aLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdwYWRkZWQtYmxvY2tzJzogW1dBUk4sICduZXZlciddLCAvLyDopoHmsYLmiJbnpoHmraLlnZflhoXloavlhYVcbiAgICAncXVvdGVzJzogW1dBUk4sICdzaW5nbGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUsICdhbGxvd1RlbXBsYXRlTGl0ZXJhbHMnOiB0cnVlIH1dLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTlj43li77lj7fjgIHlj4zlvJXlj7fmiJbljZXlvJXlj7dcbiAgICAnc2VtaSc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouS9v+eUqOWIhuWPt+S7o+abvyBBU0lcbiAgICAnc2VtaS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25YiG5Y+35LmL5YmN5ZKM5LmL5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NlbWktc3R5bGUnOiBXQVJOLCAvLyDlvLrliLbliIblj7fnmoTkvY3nva5cbiAgICAnc3BhY2UtYmVmb3JlLWJsb2Nrcyc6IFdBUk4sIC8vIOW8uuWItuWcqOWdl+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1iZWZvcmUtZnVuY3Rpb24tcGFyZW4nOiBbV0FSTiwgeyAnYW5vbnltb3VzJzogJ25ldmVyJywgJ25hbWVkJzogJ25ldmVyJywgJ2FzeW5jQXJyb3cnOiAnYWx3YXlzJyB9XSwgLy8g5by65Yi25ZyoIGZ1bmN0aW9u55qE5bem5ous5Y+35LmL5YmN5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWluLXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuWcqOWchuaLrOWPt+WGheS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbmZpeC1vcHMnOiBXQVJOLCAvLyDopoHmsYLmk43kvZznrKblkajlm7TmnInnqbrmoLxcbiAgICAnc3BhY2UtdW5hcnktb3BzJzogV0FSTiwgLy8g5by65Yi25Zyo5LiA5YWD5pON5L2c56ym5YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlZC1jb21tZW50JzogV0FSTiwgLy8g5by65Yi25Zyo5rOo6YeK5LitIC8vIOaIliAvKiDkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3dpdGNoLWNvbG9uLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKggc3dpdGNoIOeahOWGkuWPt+W3puWPs+acieepuuagvFxuICAgICd0ZW1wbGF0ZS10YWctc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouWcqOaooeadv+agh+iusOWSjOWug+S7rOeahOWtl+mdoumHj+S5i+mXtOeahOepuuagvFxuXG4gICAgLyoqXG4gICAgICogRUNNQVNjcmlwdCA2XG4gICAgICog6L+Z5Lqb6KeE5YiZ5Y+q5LiOIEVTNiDmnInlhbMsIOWNs+mAmuW4uOaJgOivtOeahCBFUzIwMTXvvJpcbiAgICAgKi9cbiAgICAnYXJyb3ctc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItueureWktOWHveaVsOeahOeureWktOWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdnZW5lcmF0b3Itc3Rhci1zcGFjaW5nJzogW1dBUk4sIHsgJ2JlZm9yZSc6IGZhbHNlLCAnYWZ0ZXInOiB0cnVlLCAnbWV0aG9kJzogeyAnYmVmb3JlJzogdHJ1ZSwgJ2FmdGVyJzogZmFsc2UgfSB9XSwgLy8g5by65Yi2IGdlbmVyYXRvciDlh73mlbDkuK0gKiDlj7flkajlm7Tkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbm8tdXNlbGVzcy1yZW5hbWUnOiBXQVJOLCAvLyDnpoHmraLlnKggaW1wb3J0IOWSjCBleHBvcnQg5ZKM6Kej5p6E6LWL5YC85pe25bCG5byV55So6YeN5ZG95ZCN5Li655u45ZCM55qE5ZCN5a2XXG4gICAgJ3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sIC8vIOimgeaxguS9v+eUqOaooeadv+Wtl+mdoumHj+iAjOmdnuWtl+espuS4sui/nuaOpVxuICAgICdyZXN0LXNwcmVhZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Ymp5L2Z5ZKM5omp5bGV6L+Q566X56ym5Y+K5YW26KGo6L6+5byP5LmL6Ze05pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLWN1cmx5LXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLmqKHmnb/lrZfnrKbkuLLkuK3nmoTltYzlhaXooajovr7lvI/lkajlm7TnqbrmoLznmoTkvb/nlKhcbiAgICAneWllbGQtc3Rhci1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHlpZWxkKiDooajovr7lvI/kuK0gKiDlkajlm7Tkvb/nlKjnqbrmoLxcbiAgfSxcbiAgLy8g6KaG55uWXG4gIG92ZXJyaWRlczogW10sXG59O1xuLy8gdnVlMi92dWUzIOWFseeUqFxuZXhwb3J0IGNvbnN0IHZ1ZUNvbW1vbkNvbmZpZyA9IHtcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL211bHRpLXdvcmQtY29tcG9uZW50LW5hbWVzJzogT0ZGLCAvLyDopoHmsYLnu4Tku7blkI3np7Dlp4vnu4jkuLrlpJrlrZdcbiAgICAndnVlL25vLXVudXNlZC1jb21wb25lbnRzJzogV0FSTiwgLy8g5pyq5L2/55So55qE57uE5Lu2XG4gICAgJ3Z1ZS9uby11bnVzZWQtdmFycyc6IE9GRiwgLy8g5pyq5L2/55So55qE5Y+Y6YePXG4gICAgJ3Z1ZS9yZXF1aXJlLXJlbmRlci1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmuLLmn5Plh73mlbDmgLvmmK/ov5Tlm57lgLxcbiAgICAndnVlL3JlcXVpcmUtdi1mb3Ita2V5JzogT0ZGLCAvLyB2LWZvcuS4reW/hemhu+S9v+eUqGtleVxuICAgICd2dWUvcmV0dXJuLWluLWNvbXB1dGVkLXByb3BlcnR5JzogV0FSTiwgLy8g5by65Yi26L+U5Zue6K+t5Y+l5a2Y5Zyo5LqO6K6h566X5bGe5oCn5LitXG4gICAgJ3Z1ZS92YWxpZC10ZW1wbGF0ZS1yb290JzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoTmqKHmnb/moLlcbiAgICAndnVlL3ZhbGlkLXYtZm9yJzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoR2LWZvcuaMh+S7pFxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9hdHRyaWJ1dGUtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOW8uuWItuWxnuaAp+WQjeagvOW8j1xuICAgICd2dWUvY29tcG9uZW50LWRlZmluaXRpb24tbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOW8uuWItue7hOS7tm5hbWXmoLzlvI9cbiAgICAndnVlL2h0bWwtcXVvdGVzJzogW1dBUk4sICdkb3VibGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUgfV0sIC8vIOW8uuWItiBIVE1MIOWxnuaAp+eahOW8leWPt+agt+W8j1xuICAgICd2dWUvaHRtbC1zZWxmLWNsb3NpbmcnOiBPRkYsIC8vIOS9v+eUqOiHqumXreWQiOagh+etvlxuICAgICd2dWUvbWF4LWF0dHJpYnV0ZXMtcGVyLWxpbmUnOiBbV0FSTiwgeyAnc2luZ2xlbGluZSc6IEluZmluaXR5LCAnbXVsdGlsaW5lJzogMSB9XSwgLy8g5by65Yi25q+P6KGM5YyF5ZCr55qE5pyA5aSn5bGe5oCn5pWwXG4gICAgJ3Z1ZS9tdWx0aWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5aSa6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS9wcm9wLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDkuLogVnVlIOe7hOS7tuS4reeahCBQcm9wIOWQjeensOW8uuWItuaJp+ihjOeJueWumuWkp+Wwj+WGmVxuICAgICd2dWUvcmVxdWlyZS1kZWZhdWx0LXByb3AnOiBPRkYsIC8vIHByb3Bz6ZyA6KaB6buY6K6k5YC8XG4gICAgJ3Z1ZS9zaW5nbGVsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWNleihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvdi1iaW5kLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LWJpbmTmjIfku6Tpo47moLxcbiAgICAndnVlL3Ytb24tc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtb27mjIfku6Tpo47moLxcbiAgICAndnVlL3Ytc2xvdC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1zbG905oyH5Luk6aOO5qC8XG4gICAgLy8gUHJpb3JpdHkgQzogUmVjb21tZW5kZWRcbiAgICAndnVlL25vLXYtaHRtbCc6IE9GRiwgLy8g56aB5q2i5L2/55Sodi1odG1sXG4gICAgLy8gVW5jYXRlZ29yaXplZFxuICAgICd2dWUvYmxvY2stdGFnLW5ld2xpbmUnOiBXQVJOLCAvLyAg5Zyo5omT5byA5Z2X57qn5qCH6K6w5LmL5ZCO5ZKM5YWz6Zet5Z2X57qn5qCH6K6w5LmL5YmN5by65Yi25o2i6KGMXG4gICAgJ3Z1ZS9odG1sLWNvbW1lbnQtY29udGVudC1zcGFjaW5nJzogV0FSTiwgLy8g5ZyoSFRNTOazqOmHiuS4reW8uuWItue7n+S4gOeahOepuuagvFxuICAgICd2dWUvc2NyaXB0LWluZGVudCc6IFtXQVJOLCAyLCB7ICdiYXNlSW5kZW50JzogMSwgJ3N3aXRjaENhc2UnOiAxIH1dLCAvLyDlnKg8c2NyaXB0PuS4reW8uuWItuS4gOiHtOeahOe8qei/m1xuICAgIC8vIEV4dGVuc2lvbiBSdWxlc+OAguWvueW6lGVzbGludOeahOWQjOWQjeinhOWIme+8jOmAgueUqOS6jjx0ZW1wbGF0ZT7kuK3nmoTooajovr7lvI9cbiAgICAndnVlL2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9ibG9jay1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSxcbiAgICAndnVlL2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLFxuICAgICd2dWUvY29tbWEtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9jb21tYS1zdHlsZSc6IFdBUk4sXG4gICAgJ3Z1ZS9mdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXktc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXl3b3JkLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLFxuICAgICd2dWUvc3BhY2UtaW4tcGFyZW5zJzogV0FSTixcbiAgICAndnVlL3NwYWNlLWluZml4LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS11bmFyeS1vcHMnOiBXQVJOLFxuICAgICd2dWUvYXJyb3ctc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9wcmVmZXItdGVtcGxhdGUnOiBXQVJOLFxuICB9LFxuICBvdmVycmlkZXM6IFtcbiAgICB7XG4gICAgICAnZmlsZXMnOiBbJyoudnVlJ10sXG4gICAgICAncnVsZXMnOiB7XG4gICAgICAgICdpbmRlbnQnOiBPRkYsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuLy8gdnVlMueUqFxuZXhwb3J0IGNvbnN0IHZ1ZTJDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUyIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3JlY29tbWVuZGVkJyxcbiAgXSxcbn0pO1xuLy8gdnVlM+eUqFxuZXhwb3J0IGNvbnN0IHZ1ZTNDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZW52OiB7XG4gICAgJ3Z1ZS9zZXR1cC1jb21waWxlci1tYWNyb3MnOiB0cnVlLCAvLyDlpITnkIZzZXR1cOaooeadv+S4reWDjyBkZWZpbmVQcm9wcyDlkowgZGVmaW5lRW1pdHMg6L+Z5qC355qE57yW6K+R5Zmo5a6P5oqlIG5vLXVuZGVmIOeahOmXrumimO+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy91c2VyLWd1aWRlLyNjb21waWxlci1tYWNyb3Mtc3VjaC1hcy1kZWZpbmVwcm9wcy1hbmQtZGVmaW5lZW1pdHMtZ2VuZXJhdGUtbm8tdW5kZWYtd2FybmluZ3NcbiAgfSxcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUzIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3Z1ZTMtcmVjb21tZW5kZWQnLFxuICBdLFxuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbm8tdGVtcGxhdGUta2V5JzogT0ZGLCAvLyDnpoHmraI8dGVtcGxhdGU+5Lit5L2/55Soa2V55bGe5oCnXG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXR1cm4taW4tZW1pdHMtdmFsaWRhdG9yJzogV0FSTiwgLy8g5by65Yi25ZyoZW1pdHPpqozor4HlmajkuK3lrZjlnKjov5Tlm57or63lj6VcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmVxdWlyZS1leHBsaWNpdC1lbWl0cyc6IE9GRiwgLy8g6ZyA6KaBZW1pdHPkuK3lrprkuYnpgInpobnnlKjkuo4kZW1pdCgpXG4gICAgJ3Z1ZS92LW9uLWV2ZW50LWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlnKjmqKHmnb/kuK3nmoToh6rlrprkuYnnu4Tku7bkuIrlvLrliLbmiafooYwgdi1vbiDkuovku7blkb3lkI3moLflvI9cbiAgfSxcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKC4uLm9iamVjdHMpIHtcbiAgY29uc3QgW3RhcmdldCwgLi4uc291cmNlc10gPSBvYmplY3RzO1xuICBjb25zdCByZXN1bHQgPSBEYXRhLmRlZXBDbG9uZSh0YXJnZXQpO1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc291cmNlKSkge1xuICAgICAgLy8g54m55q6K5a2X5q615aSE55CGXG4gICAgICBpZiAoa2V5ID09PSAncnVsZXMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsga2V5LCB2YWx1ZSwgJ3Jlc3VsdFtrZXldJzogcmVzdWx0W2tleV0gfSk7XG4gICAgICAgIC8vIOWIneWni+S4jeWtmOWcqOaXtui1i+m7mOiupOWAvOeUqOS6juWQiOW5tlxuICAgICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9O1xuICAgICAgICAvLyDlr7nlkITmnaHop4TliJnlpITnkIZcbiAgICAgICAgZm9yIChsZXQgW3J1bGVLZXksIHJ1bGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG4gICAgICAgICAgLy8g5bey5pyJ5YC857uf5LiA5oiQ5pWw57uE5aSE55CGXG4gICAgICAgICAgbGV0IHNvdXJjZVJ1bGVWYWx1ZSA9IHJlc3VsdFtrZXldW3J1bGVLZXldID8/IFtdO1xuICAgICAgICAgIGlmICghKHNvdXJjZVJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlID0gW3NvdXJjZVJ1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOimgeWQiOW5tueahOWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGlmICghKHJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgcnVsZVZhbHVlID0gW3J1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOe7n+S4gOagvOW8j+WQjui/m+ihjOaVsOe7hOW+queOr+aTjeS9nFxuICAgICAgICAgIGZvciAoY29uc3QgW3ZhbEluZGV4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHJ1bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIOWvueixoea3seWQiOW5tu+8jOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbCkgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gX09iamVjdC5kZWVwQXNzaWduKHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPz8ge30sIHZhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDotYvlgLzop4TliJnnu5PmnpxcbiAgICAgICAgICByZXN1bHRba2V5XVtydWxlS2V5XSA9IHNvdXJjZVJ1bGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWtl+auteagueaNruexu+Wei+WIpOaWreWkhOeQhlxuICAgICAgLy8g5pWw57uE77ya5ou85o6lXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAocmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyBbXSkucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5a+56LGh77ya5rex5ZCI5bm2XG4gICAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUodmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgX09iamVjdC5kZWVwQXNzaWduKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8ge30sIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIOS9v+eUqOWumuWItueahOmFjee9rlxuICogQHBhcmFtIHt977ya6YWN572u6aG5XG4gKiAgICAgICAgICBiYXNl77ya5L2/55So5Z+656GAZXNsaW505a6a5Yi277yM6buY6K6kIHRydWVcbiAqICAgICAgICAgIHZ1ZVZlcnNpb27vvJp2dWXniYjmnKzvvIzlvIDlkK/lkI7pnIDopoHlronoo4UgZXNsaW50LXBsdWdpbi12dWVcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZSh7IGJhc2UgPSB0cnVlLCB2dWVWZXJzaW9uIH0gPSB7fSkge1xuICBsZXQgcmVzdWx0ID0ge307XG4gIGlmIChiYXNlKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCBiYXNlQ29uZmlnKTtcbiAgfVxuICBpZiAodnVlVmVyc2lvbiA9PSAyKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUyQ29uZmlnKTtcbiAgfSBlbHNlIGlmICh2dWVWZXJzaW9uID09IDMpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTNDb25maWcpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICBiYXNlOiAnLi8nLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIC8vIOWIq+WQjVxuICAgIGFsaWFzOiB7XG4gICAgICAvLyAnQHJvb3QnOiByZXNvbHZlKF9fZGlybmFtZSksXG4gICAgICAvLyAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyDop4Tlrprop6blj5HorablkYrnmoQgY2h1bmsg5aSn5bCP44CC77yI5LulIGticyDkuLrljZXkvY3vvIlcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIgKiogMTAsXG4gICAgLy8g6Ieq5a6a5LmJ5bqV5bGC55qEIFJvbGx1cCDmiZPljIXphY3nva7jgIJcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8g5YWl5Y+j5paH5Lu25ZCNXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzL2VudHJ5LSR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOWdl+aWh+S7tuWQjVxuICAgICAgICBjaHVua0ZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDotYTmupDmlofku7blkI3vvIxjc3PjgIHlm77niYfnrYlcbiAgICAgICAgYXNzZXRGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLltleHRdYDtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iLCIvLyDor7fmsYLmlrnms5VcbmV4cG9ydCBjb25zdCBNRVRIT0RTID0gWydHRVQnLCAnSEVBRCcsICdQT1NUJywgJ1BVVCcsICdERUxFVEUnLCAnQ09OTkVDVCcsICdPUFRJT05TJywgJ1RSQUNFJywgJ1BBVENIJ107XG4vLyBodHRwIOeKtuaAgeeggVxuZXhwb3J0IGNvbnN0IFNUQVRVU0VTID0gW1xuICB7ICdzdGF0dXMnOiAxMDAsICdzdGF0dXNUZXh0JzogJ0NvbnRpbnVlJyB9LFxuICB7ICdzdGF0dXMnOiAxMDEsICdzdGF0dXNUZXh0JzogJ1N3aXRjaGluZyBQcm90b2NvbHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMiwgJ3N0YXR1c1RleHQnOiAnUHJvY2Vzc2luZycgfSxcbiAgeyAnc3RhdHVzJzogMTAzLCAnc3RhdHVzVGV4dCc6ICdFYXJseSBIaW50cycgfSxcbiAgeyAnc3RhdHVzJzogMjAwLCAnc3RhdHVzVGV4dCc6ICdPSycgfSxcbiAgeyAnc3RhdHVzJzogMjAxLCAnc3RhdHVzVGV4dCc6ICdDcmVhdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDIsICdzdGF0dXNUZXh0JzogJ0FjY2VwdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDMsICdzdGF0dXNUZXh0JzogJ05vbi1BdXRob3JpdGF0aXZlIEluZm9ybWF0aW9uJyB9LFxuICB7ICdzdGF0dXMnOiAyMDQsICdzdGF0dXNUZXh0JzogJ05vIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNSwgJ3N0YXR1c1RleHQnOiAnUmVzZXQgQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA2LCAnc3RhdHVzVGV4dCc6ICdQYXJ0aWFsIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNywgJ3N0YXR1c1RleHQnOiAnTXVsdGktU3RhdHVzJyB9LFxuICB7ICdzdGF0dXMnOiAyMDgsICdzdGF0dXNUZXh0JzogJ0FscmVhZHkgUmVwb3J0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIyNiwgJ3N0YXR1c1RleHQnOiAnSU0gVXNlZCcgfSxcbiAgeyAnc3RhdHVzJzogMzAwLCAnc3RhdHVzVGV4dCc6ICdNdWx0aXBsZSBDaG9pY2VzJyB9LFxuICB7ICdzdGF0dXMnOiAzMDEsICdzdGF0dXNUZXh0JzogJ01vdmVkIFBlcm1hbmVudGx5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDIsICdzdGF0dXNUZXh0JzogJ0ZvdW5kJyB9LFxuICB7ICdzdGF0dXMnOiAzMDMsICdzdGF0dXNUZXh0JzogJ1NlZSBPdGhlcicgfSxcbiAgeyAnc3RhdHVzJzogMzA0LCAnc3RhdHVzVGV4dCc6ICdOb3QgTW9kaWZpZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNSwgJ3N0YXR1c1RleHQnOiAnVXNlIFByb3h5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDcsICdzdGF0dXNUZXh0JzogJ1RlbXBvcmFyeSBSZWRpcmVjdCcgfSxcbiAgeyAnc3RhdHVzJzogMzA4LCAnc3RhdHVzVGV4dCc6ICdQZXJtYW5lbnQgUmVkaXJlY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMCwgJ3N0YXR1c1RleHQnOiAnQmFkIFJlcXVlc3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMSwgJ3N0YXR1c1RleHQnOiAnVW5hdXRob3JpemVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDIsICdzdGF0dXNUZXh0JzogJ1BheW1lbnQgUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMywgJ3N0YXR1c1RleHQnOiAnRm9yYmlkZGVuJyB9LFxuICB7ICdzdGF0dXMnOiA0MDQsICdzdGF0dXNUZXh0JzogJ05vdCBGb3VuZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA1LCAnc3RhdHVzVGV4dCc6ICdNZXRob2QgTm90IEFsbG93ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNiwgJ3N0YXR1c1RleHQnOiAnTm90IEFjY2VwdGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNywgJ3N0YXR1c1RleHQnOiAnUHJveHkgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwOCwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDksICdzdGF0dXNUZXh0JzogJ0NvbmZsaWN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MTAsICdzdGF0dXNUZXh0JzogJ0dvbmUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMSwgJ3N0YXR1c1RleHQnOiAnTGVuZ3RoIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTIsICdzdGF0dXNUZXh0JzogJ1ByZWNvbmRpdGlvbiBGYWlsZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMywgJ3N0YXR1c1RleHQnOiAnUGF5bG9hZCBUb28gTGFyZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNCwgJ3N0YXR1c1RleHQnOiAnVVJJIFRvbyBMb25nJyB9LFxuICB7ICdzdGF0dXMnOiA0MTUsICdzdGF0dXNUZXh0JzogJ1Vuc3VwcG9ydGVkIE1lZGlhIFR5cGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNiwgJ3N0YXR1c1RleHQnOiAnUmFuZ2UgTm90IFNhdGlzZmlhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTcsICdzdGF0dXNUZXh0JzogJ0V4cGVjdGF0aW9uIEZhaWxlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDE4LCAnc3RhdHVzVGV4dCc6ICdJXFwnbSBhIFRlYXBvdCcgfSxcbiAgeyAnc3RhdHVzJzogNDIxLCAnc3RhdHVzVGV4dCc6ICdNaXNkaXJlY3RlZCBSZXF1ZXN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MjIsICdzdGF0dXNUZXh0JzogJ1VucHJvY2Vzc2FibGUgRW50aXR5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjMsICdzdGF0dXNUZXh0JzogJ0xvY2tlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI0LCAnc3RhdHVzVGV4dCc6ICdGYWlsZWQgRGVwZW5kZW5jeScgfSxcbiAgeyAnc3RhdHVzJzogNDI1LCAnc3RhdHVzVGV4dCc6ICdUb28gRWFybHknIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNiwgJ3N0YXR1c1RleHQnOiAnVXBncmFkZSBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI4LCAnc3RhdHVzVGV4dCc6ICdQcmVjb25kaXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyOSwgJ3N0YXR1c1RleHQnOiAnVG9vIE1hbnkgUmVxdWVzdHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDQzMSwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBIZWFkZXIgRmllbGRzIFRvbyBMYXJnZScgfSxcbiAgeyAnc3RhdHVzJzogNDUxLCAnc3RhdHVzVGV4dCc6ICdVbmF2YWlsYWJsZSBGb3IgTGVnYWwgUmVhc29ucycgfSxcbiAgeyAnc3RhdHVzJzogNTAwLCAnc3RhdHVzVGV4dCc6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMSwgJ3N0YXR1c1RleHQnOiAnTm90IEltcGxlbWVudGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDIsICdzdGF0dXNUZXh0JzogJ0JhZCBHYXRld2F5JyB9LFxuICB7ICdzdGF0dXMnOiA1MDMsICdzdGF0dXNUZXh0JzogJ1NlcnZpY2UgVW5hdmFpbGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNCwgJ3N0YXR1c1RleHQnOiAnR2F0ZXdheSBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA1MDUsICdzdGF0dXNUZXh0JzogJ0hUVFAgVmVyc2lvbiBOb3QgU3VwcG9ydGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDYsICdzdGF0dXNUZXh0JzogJ1ZhcmlhbnQgQWxzbyBOZWdvdGlhdGVzJyB9LFxuICB7ICdzdGF0dXMnOiA1MDcsICdzdGF0dXNUZXh0JzogJ0luc3VmZmljaWVudCBTdG9yYWdlJyB9LFxuICB7ICdzdGF0dXMnOiA1MDgsICdzdGF0dXNUZXh0JzogJ0xvb3AgRGV0ZWN0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwOSwgJ3N0YXR1c1RleHQnOiAnQmFuZHdpZHRoIExpbWl0IEV4Y2VlZGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MTAsICdzdGF0dXNUZXh0JzogJ05vdCBFeHRlbmRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTExLCAnc3RhdHVzVGV4dCc6ICdOZXR3b3JrIEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyB9LFxuXTtcbiJdLCJuYW1lcyI6WyJiYXNlQ29uZmlnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBQ08sTUFBTSxJQUFJLFNBQVMsR0FBRyxDQUFDO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sWUFBWSxDQUFDLEdBQUcsSUFBSSxFQUFFO0FBQy9CO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7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
