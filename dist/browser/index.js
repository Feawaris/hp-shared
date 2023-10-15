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

export { index$4 as base, index$3 as dev, index$2 as network, index as storage };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL19TZXQuanMiLCIuLi8uLi9zcmMvYmFzZS9fQXJyYXkuanMiLCIuLi8uLi9zcmMvYmFzZS9fQm9vbGVhbi5qcyIsIi4uLy4uL3NyYy9iYXNlL19EYXRlLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX01hdGguanMiLCIuLi8uLi9zcmMvYmFzZS9fTnVtYmVyLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1JlZmxlY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9EYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3VwcG9ydC5qcyIsIi4uLy4uL3NyYy9iYXNlL19PYmplY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9fU3RyaW5nLmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3R5bGUuanMiLCIuLi8uLi9zcmMvYmFzZS9WdWVEYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvaW5kZXguanMiLCIuLi8uLi9zcmMvZGV2L2VzbGludC5qcyIsIi4uLy4uL3NyYy9kZXYvdml0ZS5qcyIsIi4uLy4uL3NyYy9uZXR3b3JrL3NoYXJlZC5qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvY2xpcGJvYXJkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2pzLWNvb2tpZUAzLjAuNS9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLm1qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvY29va2llLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2lkYi1rZXl2YWxANi4yLjEvbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pbmRleC5qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvc3RvcmFnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDpm4blkIhcbmltcG9ydCB7IF9BcnJheSB9IGZyb20gJy4vX0FycmF5JztcblxuZXhwb3J0IGNsYXNzIF9TZXQgZXh0ZW5kcyBTZXQge1xuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5Lqk6ZuGXG4gICAqIEBwYXJhbSBzZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIGludGVyc2VjdGlvbiguLi5zZXRzKSB7XG4gICAgLy8g5Lyg5Y+C5pWw6YePXG4gICAgaWYgKHNldHMubGVuZ3RoIDwgMikge1xuICAgICAgc2V0c1swXSA9IHNldHNbMF0gfHwgW107XG4gICAgICBzZXRzWzFdID0gc2V0c1sxXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgc2V0cyA9IG5ldyBfQXJyYXkoc2V0cykubWFwKHNldCA9PiBuZXcgX0FycmF5KHNldCkpO1xuXG4gICAgY29uc3QgW2ZpcnN0LCAuLi5vdGhlcnNdID0gc2V0cztcbiAgICByZXR1cm4gZmlyc3QuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIG90aGVycy5ldmVyeShzZXQgPT4gc2V0LmluY2x1ZGVzKHZhbHVlKSk7XG4gICAgfSkudG9fU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5bm26ZuGXG4gICAqIEBwYXJhbSBzZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIHVuaW9uKC4uLnNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAoc2V0cy5sZW5ndGggPCAyKSB7XG4gICAgICBzZXRzWzBdID0gc2V0c1swXSB8fCBbXTtcbiAgICAgIHNldHNbMV0gPSBzZXRzWzFdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBzZXRzID0gbmV3IF9BcnJheShzZXRzKS5tYXAoc2V0ID0+IG5ldyBfQXJyYXkoc2V0KSk7XG5cbiAgICByZXR1cm4gc2V0cy5mbGF0KCkudG9fU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6KGl6ZuGXG4gICAqIEBwYXJhbSBtYWluU2V0XG4gICAqIEBwYXJhbSBvdGhlclNldHNcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBzdGF0aWMgY29tcGxlbWVudChtYWluU2V0ID0gW10sIC4uLm90aGVyU2V0cykge1xuICAgIC8vIOS8oOWPguaVsOmHj1xuICAgIGlmIChvdGhlclNldHMubGVuZ3RoIDwgMSkge1xuICAgICAgb3RoZXJTZXRzWzBdID0gb3RoZXJTZXRzWzBdIHx8IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDnsbvlnovlpITnkIZcbiAgICBtYWluU2V0ID0gbmV3IF9BcnJheShtYWluU2V0KTtcbiAgICBvdGhlclNldHMgPSBuZXcgX0FycmF5KG90aGVyU2V0cykubWFwKGFyZyA9PiBuZXcgX0FycmF5KGFyZykpO1xuICAgIHJldHVybiBtYWluU2V0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgIHJldHVybiBvdGhlclNldHMuZXZlcnkoc2V0ID0+ICFzZXQuaW5jbHVkZXModmFsdWUpKTtcbiAgICB9KS50b19TZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcbiAgICAvLyBjb25zb2xlLmxvZygnX1NldCBjb25zdHJ1Y3RvcicsIHZhbHVlKTtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBuZXcgU2V0KHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+S8oOWPguaKpemUme+8jOWwhueUn+aIkOepuumbhuWQiCcsIGUpO1xuICAgICAgdmFsdWUgPSBuZXcgU2V0KFtdKTtcbiAgICB9XG4gICAgc3VwZXIodmFsdWUpO1xuXG4gICAgLy8gc2l6ZSDml6DpnIDlrprliLZcbiAgfVxuXG4gIC8vIOaWueazleWumuWItu+8muWOn+Wei+WQjOWQjeaWueazlSvmlrDlop7mlrnms5XjgILlpKfpg6jliIbov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgLyoqXG4gICAqIOS/ruaUuVxuICAgKi9cbiAgLy8gKOWumuWItuaWueazlSlcbiAgYWRkKC4uLnZhbHVlcykge1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICBTZXQucHJvdG90eXBlLmFkZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vICjlrprliLbmlrnms5UpXG4gIGRlbGV0ZSguLi52YWx1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgU2V0LnByb3RvdHlwZS5kZWxldGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBjbGVhcigpIHtcbiAgICBTZXQucHJvdG90eXBlLmNsZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog6YGN5Y6GXG4gICAqL1xuICAvLyBTeW1ib2wuaXRlcmF0b3Ig5peg6ZyA5a6a5Yi2XG4gIC8vIGtleXMg5peg6ZyA5a6a5Yi2XG4gIC8vIHZhbHVlcyDml6DpnIDlrprliLZcbiAgLy8gZW50cmllcyDml6DpnIDlrprliLZcblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBmb3JFYWNoKCkge1xuICAgIFNldC5wcm90b3R5cGUuZm9yRWFjaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeaJvlxuICAgKi9cbiAgLy8gaGFzIOaXoOmcgOWumuWItlxuXG4gIC8qKlxuICAgKiDnlJ/miJBcbiAgICovXG4gIC8vIOebtOaOpSB0b19BcnJheSDosIPmlbDnu4Tmlrnms5Xlho0gdG9fU2V0IOi9rOaNouWbnuadpeWNs+WPr++8jOaXoOmcgOmHjeWkjeWumuWItlxuXG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vICjlrprliLbmlrnms5UpXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIE5hTjtcbiAgfVxuXG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYHske3RoaXMudG9BcnJheSgpLmpvaW4oJywnKX19YDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gJ3t9JztcbiAgICB9XG4gIH1cblxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b0Jvb2xlYW4ob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZSA+IDA7XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9BcnJheSgpO1xuICB9XG5cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9BcnJheSgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvX0FycmF5KCkge1xuICAgIHJldHVybiBuZXcgX0FycmF5KHRoaXMpO1xuICB9XG59XG4iLCIvLyDmlbDnu4RcbmltcG9ydCB7IF9TZXQgfSBmcm9tICcuL19TZXQnO1xuXG5leHBvcnQgY2xhc3MgX0FycmF5IGV4dGVuZHMgQXJyYXkge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyBzdGF0aWMgaXNBcnJheSDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGZyb20g5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBvZiDml6DpnIDlrprliLZcblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0gW10pIHtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBBcnJheS5mcm9tKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+S8oOWPguaKpemUme+8jOWwhueUn+aIkOepuuaVsOe7hCcsIGUpO1xuICAgICAgdmFsdWUgPSBbXTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgdmFsdWVbMF0gPT09ICdudW1iZXInKSB7XG4gICAgICAvLyDnqIDnlo/mlbDnu4Tpl67popjvvIzlhYjosIMgc3VwZXIg55Sf5oiQIHRoaXMg5ZCO5YaN5L+u5pS5IHRoaXMg5YaF5a65XG4gICAgICBjb25zdCB0ZW1wID0gdmFsdWVbMF07XG4gICAgICB2YWx1ZVswXSA9IHVuZGVmaW5lZDtcbiAgICAgIHN1cGVyKC4uLnZhbHVlKTtcbiAgICAgIHRoaXNbMF0gPSB0ZW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlciguLi52YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gbGVuZ3RoIOaXoOmcgOWumuWItlxuICB9XG5cbiAgLy8g5pa55rOV5a6a5Yi277ya5Y6f5Z6L5ZCM5ZCN5pa55rOVK+aWsOWinuaWueazleOAguWkp+mDqOWIhui/lOWbniB0aGlzIOS+v+S6jumTvuW8j+aTjeS9nFxuICAvKipcbiAgICog5L+u5pS5XG4gICAqL1xuICAvLyBzb3J0IOaXoOmcgOWumuWItlxuICAvLyByZXZlcnNlIOaXoOmcgOWumuWItlxuICAvLyBmaWxsIOaXoOmcgOWumuWItlxuICAvLyBjb3B5V2l0aGluIOaXoOmcgOWumuWItlxuXG4gIC8vICjlrprliLbmlrnms5UpXG4gIHB1c2goKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBwb3AobGVuZ3RoID0gMSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wb3AuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdW5zaGlmdCgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHNoaWZ0KGxlbmd0aCA9IDEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gKOaWsOWinuaWueazlSkg5Yig6ZmkXG4gIGRlbGV0ZSh2YWx1ZSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maW5kSW5kZXgodmFsID0+IHZhbCA9PT0gdmFsdWUpO1xuICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbiAgLy8gKOaWsOWinuaWueazlSkg5riF56m6XG4gIGNsZWFyKCkge1xuICAgIHJldHVybiB0aGlzLnNwbGljZSgwKTtcbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKSDljrvph41cbiAgdW5pcXVlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy50b19TZXQoKS50b19BcnJheSgpO1xuICAgIHJldHVybiB0aGlzLmNsZWFyKCkucHVzaCguLi52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICog6YGN5Y6GXG4gICAqL1xuICAvLyBTeW1ib2wuaXRlcmF0b3Ig5peg6ZyA5a6a5Yi2XG4gIC8vIGtleXMg5peg6ZyA5a6a5Yi2XG4gIC8vIHZhbHVlcyDml6DpnIDlrprliLZcbiAgLy8gZW50cmllcyDml6DpnIDlrprliLZcblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBmb3JFYWNoKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog5p+l5om+XG4gICAqL1xuICAvLyBhdCDml6DpnIDlrprliLZcbiAgLy8gZmluZCDml6DpnIDlrprliLZcbiAgLy8gZmluZEluZGV4IOaXoOmcgOWumuWItlxuICAvLyBmaW5kTGFzdCDml6DpnIDlrprliLZcbiAgLy8gZmluZExhc3RJbmRleCDml6DpnIDlrprliLZcbiAgLy8gaW5jbHVkZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGluZGV4T2Yg5peg6ZyA5a6a5Yi2XG4gIC8vIGxhc3RJbmRleE9mIOaXoOmcgOWumuWItlxuICAvLyBzb21lIOaXoOmcgOWumuWItlxuICAvLyBldmVyeSDml6DpnIDlrprliLZcblxuICAvKipcbiAgICog55Sf5oiQXG4gICAqL1xuICAvLyBtYXAg5peg6ZyA5a6a5Yi2XG4gIC8vIGZpbHRlciDml6DpnIDlrprliLZcbiAgLy8gcmVkdWNlIOaXoOmcgOWumuWItlxuICAvLyByZWR1Y2VSaWdodCDml6DpnIDlrprliLZcbiAgLy8gY29uY2F0IOaXoOmcgOWumuWItlxuICAvLyBzbGljZSDml6DpnIDlrprliLZcbiAgLy8gam9pbiDml6DpnIDlrprliLZcbiAgLy8gZmxhdCDml6DpnIDlrprliLZcbiAgLy8gZmxhdE1hcCDml6DpnIDlrprliLZcblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB3aXRoKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLndpdGguYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU3BsaWNlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1NwbGljZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU29ydGVkKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLnRvU29ydGVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1JldmVyc2VkKCkge1xuICAgIGNvbnN0IHZhbHVlID0gQXJyYXkucHJvdG90eXBlLnRvUmV2ZXJzZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodmFsdWUpO1xuICB9XG4gIC8qKlxuICAgKiDovazmjaLns7vliJfmlrnms5XvvJrovazmjaLmiJDljp/lp4vlgLzlkozlhbbku5bnsbvlnotcbiAgICovXG4gIC8vICjlrprliLbmlrnms5UpXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICBpZiAoaGludCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvTnVtYmVyKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9TdHJpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYHRvU3RyaW5nIOi9rOaNouaKpemUme+8jOWwhueUn+aIkCAnW10nYCwgZSk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoW10pO1xuICAgIH1cbiAgfVxuICAvLyB0b0xvY2FsZVN0cmluZyDml6DpnIDlrprliLZcbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA+IDA7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xuICB9XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvU2V0KCkge1xuICAgIHJldHVybiBuZXcgU2V0KHRoaXMpO1xuICB9XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvX1NldCgpIHtcbiAgICByZXR1cm4gbmV3IF9TZXQodGhpcyk7XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBfQm9vbGVhbiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbl9Cb29sZWFuLkZBTFNZID0gWzAsICcnLCBudWxsLCB1bmRlZmluZWQsIE5hTl07XG4iLCIvLyDml6XmnJ/ml7bpl7RcbmV4cG9ydCBjbGFzcyBfRGF0ZSBleHRlbmRzIERhdGUge1xuICAvKipcbiAgICogc3RhdGljXG4gICAqL1xuICAvLyAo5paw5aKe5bGe5oCnKVxuICBzdGF0aWMgUkVHRVhfUEFSU0UgPSAvXihcXGR7NH0pWy0vXT8oXFxkezEsMn0pP1stL10/KFxcZHswLDJ9KVtUdFxcc10qKFxcZHsxLDJ9KT86PyhcXGR7MSwyfSk/Oj8oXFxkezEsMn0pP1suOl0/KFxcZCspPyQvO1xuICBzdGF0aWMgUkVHRVhfRk9STUFUID0gL1xcWyhbXlxcXV0rKV18WXsxLDR9fE17MSw0fXxEezEsMn18ZHsxLDR9fEh7MSwyfXxoezEsMn18YXxBfG17MSwyfXxzezEsMn18WnsxLDJ9fFNTUy9nO1xuXG4gIC8vIHN0YXRpYyBub3cg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBwYXJzZSDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIFVUQyDml6DpnIDlrprliLZcblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6L2s5o2i5oiQ5a2X56ym5LiyXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHN0cmluZ2lmeSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHZhbHVlKS50b1N0cmluZygpO1xuICB9XG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDmmK/lkKbmnInmlYjlj4LmlbDjgILluLjnlKjkuo7lpITnkIbmk43kvZzlvpfliLAgSW52YWxpZCBEYXRlIOeahOaDheWGtVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgaXNWYWxpZFZhbHVlKHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IHRoaXModmFsdWUpLnRvQm9vbGVhbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ19EYXRlIGNvbnN0cnVjdG9yJywgYXJncyk7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBudWxsIOWSjOaYvuW8jyB1bmRlZmluZWQg6YO96KeG5Li65peg5pWI5YC8XG4gICAgICBpZiAoYXJnc1swXSA9PT0gbnVsbCkge1xuICAgICAgICBhcmdzWzBdID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgLy8gc2FmYXJpIOa1j+iniOWZqOWtl+espuS4suagvOW8j+WFvOWuuVxuICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlQWxsKCctJywgJy8nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAvLyDmlrDlop7lsZ7mgKdcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3llYXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZ1bGxZZWFyKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbW9udGgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1vbnRoKCkgKyAxO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RheScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGF0ZSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3dlZWsnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERheSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2hvdXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhvdXJzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2hvcnRIb3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBjb25zdCBob3VyID0gdGhpcy5ob3VyO1xuICAgICAgICByZXR1cm4gaG91ciAlIDEyID09PSAwID8gaG91ciA6IGhvdXIgJSAxMjtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtaW51dGUnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1pbnV0ZXMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzZWNvbmQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNlY29uZHMoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtaWxsaXNlY29uZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGltZVpvbmVPZmZzZXRIb3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjA7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g5qC85byP5YyW5a2X56ym5Liy55So44CC5oC75L2T5ZCMIGVsZW1lbnQg55So55qEIGRheS5qcyDmoLzlvI8oaHR0cHM6Ly9kYXkuanMub3JnL2RvY3MvemgtQ04vZGlzcGxheS9mb3JtYXQp77yM6aOO5qC85a6a5Yi25oiQ5Lit5paHXG4gICAgdGhpcy5mb3JtYXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdZWScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMueWVhci50b1N0cmluZygpLnNsaWNlKC0yKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWVlZWScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMueWVhci50b1N0cmluZygpLnNsaWNlKC00KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnTScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubW9udGgudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnTU0nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1vbnRoLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnRCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuZGF5LnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0REJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5kYXkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdkJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbJ+WRqOaXpScsICflkajkuIAnLCAn5ZGo5LqMJywgJ+WRqOS4iScsICflkajlm5snLCAn5ZGo5LqUJywgJ+WRqOWFrSddWyR0aGlzLndlZWtdO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdkZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWyfmmJ/mnJ/ml6UnLCAn5pif5pyf5LiAJywgJ+aYn+acn+S6jCcsICfmmJ/mnJ/kuIknLCAn5pif5pyf5ZubJywgJ+aYn+acn+S6lCcsICfmmJ/mnJ/lha0nXVskdGhpcy53ZWVrXTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnSCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ci50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdISCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ci50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ2gnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNob3J0SG91ci50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdoaCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2hvcnRIb3VyLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnbScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWludXRlLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ21tJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5taW51dGUudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdzJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zZWNvbmQudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnc3MnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNlY29uZC50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1NTUycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWlsbGlzZWNvbmQudG9TdHJpbmcoKS5wYWRTdGFydCgzLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdhJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5ob3VyIDwgMTIgPyAn5LiK5Y2IJyA6ICfkuIvljYgnO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdBJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdaJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNpZ24gPSAkdGhpcy50aW1lWm9uZU9mZnNldEhvdXIgPCAwID8gJysnIDogJy0nO1xuICAgICAgICByZXR1cm4gYCR7c2lnbn0keygtJHRoaXMudGltZVpvbmVPZmZzZXRIb3VyKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9OjAwYDtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWlonLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLloucmVwbGFjZSgnOicsICcnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IOezu+WIl+aWueazleOAguS9v+eUqCB5ZWFy44CBbW9udGgg562J5paw5aKe5bGe5oCn6I635Y+W5Y2z5Y+v77yM566A5YyW5YaZ5rOV77yM5peg6ZyA6aKd5aSW5a6a5Yi2XG4gICAqL1xuICAvLyBnZXRUaW1lIOaXoOmcgOWumuWItlxuICAvLyBnZXRUaW1lem9uZU9mZnNldCDml6DpnIDlrprliLZcblxuICAvLyBnZXRZZWFyIOaXoOmcgOWumuWItlxuICAvLyBnZXRGdWxsWWVhciDml6DpnIDlrprliLZcbiAgLy8gZ2V0TW9udGgg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldERhdGUg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldERheSDml6DpnIDlrprliLZcbiAgLy8gZ2V0SG91cnMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldE1pbnV0ZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFNlY29uZHMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldE1pbGxpc2Vjb25kcyDml6DpnIDlrprliLZcblxuICAvLyBnZXRVVENGdWxsWWVhciDml6DpnIDlrprliLZcbiAgLy8gZ2V0VVRDTW9udGgg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ0RhdGUg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ0RheSDml6DpnIDlrprliLZcbiAgLy8gZ2V0VVRDSG91cnMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ01pbnV0ZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ1NlY29uZHMg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ01pbGxpc2Vjb25kcyDml6DpnIDlrprliLZcblxuICAvKipcbiAgICogc2V0IOezu+WIl+aWueazleOAguWumuWItuaIkOi/lOWbniB0aGlzIOS+v+S6jumTvuW8j+aTjeS9nFxuICAgKi9cbiAgc2V0VGltZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRUaW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRZZWFyKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRGdWxsWWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRGdWxsWWVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldE1vbnRoKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1vbnRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0RGF0ZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXREYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0SG91cnMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0SG91cnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNaW51dGVzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1pbnV0ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRTZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFNlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNaWxsaXNlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0TWlsbGlzZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRVVENGdWxsWWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENGdWxsWWVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ01vbnRoKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01vbnRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDRGF0ZSgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENEYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDSG91cnMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDSG91cnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNaW51dGVzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01pbnV0ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENTZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ1NlY29uZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNaWxsaXNlY29uZHMoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDTWlsbGlzZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyAo5a6a5Yi25pa55rOVKVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaW1lKCk7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9TdHJpbmcoZm9ybWF0ID0gJ1lZWVktTU0tREQgaGg6bW06c3MnKSB7XG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlQWxsKHRoaXMuY29uc3RydWN0b3IuUkVHRVhfRk9STUFULCAobWF0Y2gsICQxKSA9PiB7XG4gICAgICAvLyBbXSDph4zpnaLnmoTlhoXlrrnljp/moLfovpPlh7pcbiAgICAgIGlmICgkMSkge1xuICAgICAgICByZXR1cm4gJDE7XG4gICAgICB9XG4gICAgICAvLyDmoLzlvI9cbiAgICAgIGlmIChtYXRjaCBpbiB0aGlzLmZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRbbWF0Y2hdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvRGF0ZVN0cmluZyhmb3JtYXQgPSAnWVlZWS1NTS1ERCcpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZyhmb3JtYXQpO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvVGltZVN0cmluZyhmb3JtYXQgPSAnSEg6bW06c3MnKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoZm9ybWF0KTtcbiAgfVxuICAvLyB0b0xvY2FsZVN0cmluZyDml6DpnIDlrprliLZcbiAgLy8gdG9Mb2NhbGVEYXRlU3RyaW5nIOaXoOmcgOWumuWItlxuICAvLyB0b0xvY2FsZVRpbWVTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vIHRvSVNPU3RyaW5nIOaXoOmcgOWumuWItlxuICAvLyB0b1VUQ1N0cmluZyDml6DpnIDlrprliLZcbiAgLy8gdG9HTVRTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gIWlzTmFOKHRoaXMuZ2V0VGltZSgpKTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b0pTT04ob3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgfVxuICAvLyB2YWx1ZU9mIOaXoOmcgOWumuWItlxufVxuIiwiLy8g5pWw5a2m6L+Q566X44CC5a+5IE1hdGgg5a+56LGh5omp5bGV77yM5o+Q5L6b5pu055u06KeC5ZKM56ym5ZCI5pWw5a2m57qm5a6a55qE5ZCN56ewXG5leHBvcnQgY29uc3QgX01hdGggPSBPYmplY3QuY3JlYXRlKE1hdGgpO1xuXG5fTWF0aC5hcmNzaW4gPSBNYXRoLmFzaW4uYmluZChNYXRoKTtcbl9NYXRoLmFyY2NvcyA9IE1hdGguYWNvcy5iaW5kKE1hdGgpO1xuX01hdGguYXJjdGFuID0gTWF0aC5hdGFuLmJpbmQoTWF0aCk7XG5fTWF0aC5hcnNpbmggPSBNYXRoLmFzaW5oLmJpbmQoTWF0aCk7XG5fTWF0aC5hcmNvc2ggPSBNYXRoLmFjb3NoLmJpbmQoTWF0aCk7XG5fTWF0aC5hcnRhbmggPSBNYXRoLmF0YW5oLmJpbmQoTWF0aCk7XG5fTWF0aC5sb2dlID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbl9NYXRoLmxuID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbl9NYXRoLmxnID0gTWF0aC5sb2cxMC5iaW5kKE1hdGgpO1xuX01hdGgubG9nID0gZnVuY3Rpb24oYSwgeCkge1xuICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZyhhKTtcbn07XG4iLCJleHBvcnQgY2xhc3MgX051bWJlciBleHRlbmRzIE51bWJlciB7XG59XG4iLCJleHBvcnQgY29uc3QgX1JlZmxlY3QgPSBPYmplY3QuY3JlYXRlKFJlZmxlY3QpO1xuXG4vLyDlr7kgb3duS2V5cyDphY3lpZcgb3duVmFsdWVzIOWSjCBvd25FbnRyaWVzXG5fUmVmbGVjdC5vd25WYWx1ZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xufTtcbl9SZWZsZWN0Lm93bkVudHJpZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gW2tleSwgdGFyZ2V0W2tleV1dKTtcbn07XG4iLCIvLyDmlbDmja7lpITnkIbvvIzlpITnkIblpJrmoLzlvI/mlbDmja7nlKhcbmV4cG9ydCBjb25zdCBEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbi8qKlxuICog5LyY5YyWIHR5cGVvZlxuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7J3VuZGVmaW5lZCd8J29iamVjdCd8J2Jvb2xlYW4nfCdudW1iZXInfCdzdHJpbmcnfCdmdW5jdGlvbid8J3N5bWJvbCd8J2JpZ2ludCd8c3RyaW5nfVxuICovXG5EYXRhLnR5cGVvZiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbn07XG4vKipcbiAqIOWIpOaWreeugOWNleexu+Wei1xuICogQHBhcmFtIHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuRGF0YS5pc1NpbXBsZVR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gWydudWxsJywgJ3VuZGVmaW5lZCcsICdudW1iZXInLCAnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnYmlnaW50JywgJ3N5bWJvbCddLmluY2x1ZGVzKHRoaXMudHlwZW9mKHZhbHVlKSk7XG59O1xuLyoqXG4gKiDmmK/lkKbmma7pgJrlr7nosaFcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkRhdGEuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59O1xuLyoqXG4gKiDojrflj5blgLznmoTlhbfkvZPnsbvlnotcbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEByZXR1cm5zIHtPYmplY3RDb25zdHJ1Y3RvcnwqfEZ1bmN0aW9ufSDov5Tlm57lr7nlupTmnoTpgKDlh73mlbDjgIJudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICovXG5EYXRhLmdldEV4YWN0VHlwZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgLy8gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGh5pe2IF9fcHJvdG9fXyDkuLogbnVsbFxuICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDlr7nlupTnu6fmib/nmoTlr7nosaEgX19wcm90b19fIOayoeaciSBjb25zdHJ1Y3RvciDlsZ7mgKdcbiAgY29uc3QgaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gISgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXyk7XG4gIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDov5Tlm57lr7nlupTmnoTpgKDlh73mlbBcbiAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3Rvcjtcbn07XG4vKipcbiAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei+WIl+ihqFxuICogQHBhcmFtIHZhbHVlIOWAvFxuICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gKi9cbkRhdGEuZ2V0RXhhY3RUeXBlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Yik5pat5aSE55CGXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gW3ZhbHVlXTtcbiAgfVxuICAvLyDmiavljp/lnovpk77lvpfliLDlr7nlupTmnoTpgKDlh73mlbBcbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBsZXQgbG9vcCA9IDA7XG4gIGxldCBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gZmFsc2U7XG4gIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIGNvbnNvbGUud2Fybignd2hpbGUnLCBsb29wLCBfX3Byb3RvX18pO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIC8vIOS4gOi/m+adpSBfX3Byb3RvX18g5bCx5pivIG51bGwg6K+05piOIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoVxuICAgICAgaWYgKGxvb3AgPD0gMCkge1xuICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKSB7XG4gICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgfVxuICAgIF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihfX3Byb3RvX18pO1xuICAgIGxvb3ArKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiDmt7Hmi7fotJ3mlbDmja5cbiAqIEBwYXJhbSBzb3VyY2VcbiAqIEByZXR1cm5zIHtNYXA8YW55LCBhbnk+fFNldDxhbnk+fHt9fCp8KltdfVxuICovXG5EYXRhLmRlZXBDbG9uZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAvLyDmlbDnu4RcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGZvciAoY29uc3QgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIFNldFxuICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgIHJlc3VsdC5hZGQodGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBNYXBcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHNvdXJjZS5lbnRyaWVzKCkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCB0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOWvueixoVxuICBpZiAodGhpcy5nZXRFeGFjdFR5cGUoc291cmNlKSA9PT0gT2JqZWN0KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgLy8gdmFsdWXmlrnlvI/vvJrpgJLlvZLlpITnkIZcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQ2xvbmUoZGVzYy52YWx1ZSksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0L3NldCDmlrnlvI/vvJrnm7TmjqXlrprkuYlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlhbbku5bvvJrljp/moLfov5Tlm55cbiAgcmV0dXJuIHNvdXJjZTtcbn07XG4vKipcbiAqIOa3seino+WMheaVsOaNrlxuICogQHBhcmFtIGRhdGEg5YC8XG4gKiBAcGFyYW0gaXNXcmFwIOWMheijheaVsOaNruWIpOaWreWHveaVsO+8jOWmgiB2dWUzIOeahCBpc1JlZiDlh73mlbBcbiAqIEBwYXJhbSB1bndyYXAg6Kej5YyF5pa55byP5Ye95pWw77yM5aaCIHZ1ZTMg55qEIHVucmVmIOWHveaVsFxuICogQHJldHVybnMge3tbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fCp8KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfHtbcDogc3RyaW5nXTogYW55fX1cbiAqL1xuRGF0YS5kZWVwVW53cmFwID0gZnVuY3Rpb24oZGF0YSwgeyBpc1dyYXAgPSAoKSA9PiBmYWxzZSwgdW53cmFwID0gdmFsID0+IHZhbCB9ID0ge30pIHtcbiAgLy8g6YCJ6aG55pS26ZuGXG4gIGNvbnN0IG9wdGlvbnMgPSB7IGlzV3JhcCwgdW53cmFwIH07XG4gIC8vIOWMheijheexu+Wei++8iOWmgnZ1ZTPlk43lupTlvI/lr7nosaHvvInmlbDmja7op6PljIVcbiAgaWYgKGlzV3JhcChkYXRhKSkge1xuICAgIHJldHVybiB0aGlzLmRlZXBVbndyYXAodW53cmFwKGRhdGEpLCBvcHRpb25zKTtcbiAgfVxuICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBkYXRhLm1hcCh2YWwgPT4gdGhpcy5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucykpO1xuICB9XG4gIGlmICh0aGlzLmdldEV4YWN0VHlwZShkYXRhKSA9PT0gT2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhkYXRhKS5tYXAoKFtrZXksIHZhbF0pID0+IHtcbiAgICAgIHJldHVybiBba2V5LCB0aGlzLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgfSkpO1xuICB9XG4gIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIvLyDovoXliqlcbmV4cG9ydCBjb25zdCBTdXBwb3J0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiDlsZ7mgKflkI3nu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAqIEBwYXJhbSBuYW1lcyDlsZ7mgKflkI3jgILmoLzlvI8gJ2EsYixjJyDmiJYgWydhJywnYicsJ2MnXVxuICogQHBhcmFtIHNlcGFyYXRvciBuYW1lcyDkuLrlrZfnrKbkuLLml7bnmoTmi4bliIbop4TliJnjgILlkIwgc3BsaXQg5pa55rOV55qEIHNlcGFyYXRvcu+8jOWtl+espuS4suaXoOmcgOaLhuWIhueahOWPr+S7peS8oCBudWxsIOaIliB1bmRlZmluZWRcbiAqIEByZXR1cm5zIHsqW11bXXwoTWFnaWNTdHJpbmcgfCBCdW5kbGUgfCBzdHJpbmcpW118RmxhdEFycmF5PChGbGF0QXJyYXk8KCp8WypbXV18W10pW10sIDE+W118KnxbKltdXXxbXSlbXSwgMT5bXXwqW119XG4gKi9cblN1cHBvcnQubmFtZXNUb0FycmF5ID0gZnVuY3Rpb24obmFtZXMgPSBbXSwgeyBzZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSB7XG4gIGlmIChuYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIG5hbWVzLm1hcCh2YWwgPT4gdGhpcy5uYW1lc1RvQXJyYXkodmFsKSkuZmxhdCgpO1xuICB9XG4gIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5hbWVzLnNwbGl0KHNlcGFyYXRvcikubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N5bWJvbCcpIHtcbiAgICByZXR1cm4gW25hbWVzXTtcbiAgfVxuICByZXR1cm4gW107XG59O1xuXG4vKipcbiAqIOe7keWumnRoaXPjgILluLjnlKjkuo7op6PmnoTlh73mlbDml7bnu5HlrpogdGhpcyDpgb/lhY3miqXplJlcbiAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAqIEByZXR1cm5zIHsqfVxuICovXG5TdXBwb3J0LmJpbmRUaGlzID0gZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIHtcbiAgICBnZXQodGFyZ2V0LCBwLCByZWNlaXZlcikge1xuICAgICAgY29uc3QgdmFsdWUgPSBSZWZsZWN0LmdldCguLi5hcmd1bWVudHMpO1xuICAgICAgLy8g5Ye95pWw57G75Z6L57uR5a6adGhpc1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmJpbmQodGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWxnuaAp+WOn+agt+i/lOWbnlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gIH0pO1xufTtcbiIsIi8vIOWvueixoVxuaW1wb3J0IHsgX1JlZmxlY3QgfSBmcm9tICcuL19SZWZsZWN0JztcbmltcG9ydCB7IERhdGEgfSBmcm9tICcuL0RhdGEnO1xuaW1wb3J0IHsgU3VwcG9ydCB9IGZyb20gJy4vU3VwcG9ydCc7XG5cbi8vIGV4dGVuZHMgT2JqZWN0IOaWueW8j+iwg+eUqCBzdXBlciDlsIbnlJ/miJDnqbrlr7nosaHvvIzkuI3kvJrlg4/mma7pgJrmnoTpgKDlh73mlbDpgqPmoLfliJvlu7rkuIDkuKrmlrDnmoTlr7nosaHvvIzmlLnlrp7njrBcbmV4cG9ydCBjbGFzcyBfT2JqZWN0IHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGNyZWF0ZSDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGZyb21FbnRyaWVzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgaXMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBnZXRQcm90b3R5cGVPZiDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIHNldFByb3RvdHlwZU9mIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgaGFzT3duIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZGVmaW5lUHJvcGVydHkg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBkZWZpbmVQcm9wZXJ0aWVzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5TmFtZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBwcmV2ZW50RXh0ZW5zaW9ucyDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIHNlYWwg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBmcmVlemUg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBpc0V4dGVuc2libGUg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBpc1NlYWxlZCDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGlzRnJvemVuIOaXoOmcgOWumuWItlxuXG4gIC8qKlxuICAgKiAo5a6a5Yi25pa55rOVKSDmtYXlkIjlubblr7nosaHjgILlhpnms5XlkIwgT2JqZWN0LmFzc2lnbu+8jOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICAgKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIC8vIOS4jeS9v+eUqCB0YXJnZXRba2V5XSA9IHZhbHVlIOWGmeazle+8jOebtOaOpeS9v+eUqCBPYmplY3QuZGVmaW5lUHJvcGVydHkg6YeN5a6a5LmJXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5rex5ZCI5bm25a+56LGh44CC5ZCMIGFzc2lnbiDkuIDmoLfkuZ/kvJrlr7nlsZ7mgKfov5vooYzph43lrprkuYlcbiAgICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaHjgILpu5jorqTlgLwge30g6Ziy5q2i6YCS5b2S5pe25oqlIFR5cGVFcnJvcjogT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0XG4gICAqIEBwYXJhbSBzb3VyY2VzIOaVsOaNrua6kOOAguS4gOS4quaIluWkmuS4quWvueixoVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZGVlcEFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgIC8vIHZhbHVlIOWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICAgIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZGVzYy52YWx1ZSkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuICAgICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQXNzaWduKHRhcmdldFtrZXldLCBkZXNjLnZhbHVlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBnZXQvc2V0IOWGmeazle+8muebtOaOpeWumuS5iVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDojrflj5blsZ7mgKflkI3jgILpu5jorqTlj4LmlbDphY3nva7miJDlkIwgT2JqZWN0LmtleXMg6KGM5Li6XG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHthbnlbXX1cbiAgICovXG4gIHN0YXRpYyBrZXlzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIC8vIHNldOeUqOS6jmtleeWOu+mHjVxuICAgIGxldCBzZXQgPSBuZXcgU2V0KCk7XG4gICAgLy8g6Ieq6Lqr5bGe5oCn562b6YCJXG4gICAgY29uc3QgZGVzY3MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3QpO1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgX1JlZmxlY3Qub3duRW50cmllcyhkZXNjcykpIHtcbiAgICAgIC8vIOW/veeVpXN5bWJvbOWxnuaAp+eahOaDheWGtVxuICAgICAgaWYgKCFzeW1ib2wgJiYgdHlwZW9mIGtleSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlv73nlaXkuI3lj6/liJfkuL7lsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghbm90RW51bWVyYWJsZSAmJiAhZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5bGe5oCn5Yqg5YWlXG4gICAgICBzZXQuYWRkKGtleSk7XG4gICAgfVxuICAgIC8vIOe7p+aJv+WxnuaAp1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgaWYgKF9fcHJvdG9fXyAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXJlbnRLZXlzID0gdGhpcy5rZXlzKF9fcHJvdG9fXywgb3B0aW9ucyk7XG4gICAgICAgIGZvciAoY29uc3QgcGFyZW50S2V5IG9mIHBhcmVudEtleXMpIHtcbiAgICAgICAgICBzZXQuYWRkKHBhcmVudEtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8g6L+U5Zue5pWw57uEXG4gICAgcmV0dXJuIEFycmF5LmZyb20oc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5a6a5Yi25pa55rOVKVxuICAgKi9cbiAgc3RhdGljIHZhbHVlcygpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5a6a5Yi25pa55rOVKVxuICAgKi9cbiAgc3RhdGljIGVudHJpZXMoKSB7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkga2V56Ieq6Lqr5omA5bGe55qE5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXkg5bGe5oCn5ZCNXG4gICAqIEByZXR1cm5zIHsqfG51bGx9XG4gICAqL1xuICBzdGF0aWMgb3duZXIob2JqZWN0LCBrZXkpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG4gICAgbGV0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vd25lcihfX3Byb3RvX18sIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6I635Y+W5bGe5oCn5o+P6L+w5a+56LGh77yM55u45q+UIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3LvvIzog73mi7/liLDnu6fmib/lsZ7mgKfnmoTmj4/ov7Dlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR8UHJvcGVydHlEZXNjcmlwdG9yfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpIHtcbiAgICBjb25zdCBmaW5kT2JqZWN0ID0gdGhpcy5vd25lcihvYmplY3QsIGtleSk7XG4gICAgaWYgKCFmaW5kT2JqZWN0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmaW5kT2JqZWN0LCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOWvueW6lCBrZXlzIOiOt+WPliBkZXNjcmlwdG9yc++8jOS8oOWPguWQjCBrZXlzIOaWueazleOAguWPr+eUqOS6jumHjeWumuS5ieWxnuaAp1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7KFByb3BlcnR5RGVzY3JpcHRvcnx1bmRlZmluZWQpW119XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvcnMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3QgX2tleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2tleXMubWFwKGtleSA9PiB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvckVudHJpZXPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge1sqLChQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkKV1bXX1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9yRW50cmllcyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICBjb25zdCBfa2V5cyA9IHRoaXMua2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICAgIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IFtrZXksIHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSldKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDov4fmu6Tlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHBpY2sg5oyR6YCJ5bGe5oCnXG4gICAqIEBwYXJhbSBvbWl0IOW/veeVpeWxnuaAp1xuICAgKiBAcGFyYW0gZW1wdHlQaWNrIHBpY2sg5Li656m65pe255qE5Y+W5YC844CCYWxsIOWFqOmDqGtlee+8jGVtcHR5IOepulxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOWQjCBuYW1lc1RvQXJyYXkg55qEIHNlcGFyYXRvciDlj4LmlbBcbiAgICogQHBhcmFtIHN5bWJvbCDlkIwga2V5cyDnmoQgc3ltYm9sIOWPguaVsFxuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDlkIwga2V5cyDnmoQgbm90RW51bWVyYWJsZSDlj4LmlbBcbiAgICogQHBhcmFtIGV4dGVuZCDlkIwga2V5cyDnmoQgZXh0ZW5kIOWPguaVsFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZmlsdGVyKG9iamVjdCwgeyBwaWNrID0gW10sIG9taXQgPSBbXSwgZW1wdHlQaWNrID0gJ2FsbCcsIHNlcGFyYXRvciA9ICcsJywgc3ltYm9sID0gdHJ1ZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSB0cnVlIH0gPSB7fSkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAvLyBwaWNr44CBb21pdCDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgICBwaWNrID0gU3VwcG9ydC5uYW1lc1RvQXJyYXkocGljaywgeyBzZXBhcmF0b3IgfSk7XG4gICAgb21pdCA9IFN1cHBvcnQubmFtZXNUb0FycmF5KG9taXQsIHsgc2VwYXJhdG9yIH0pO1xuICAgIGxldCBfa2V5cyA9IFtdO1xuICAgIC8vIHBpY2vmnInlgLznm7TmjqXmi7/vvIzkuLrnqbrml7bmoLnmja4gZW1wdHlQaWNrIOm7mOiupOaLv+epuuaIluWFqOmDqGtleVxuICAgIF9rZXlzID0gcGljay5sZW5ndGggPiAwIHx8IGVtcHR5UGljayA9PT0gJ2VtcHR5JyA/IHBpY2sgOiB0aGlzLmtleXMob2JqZWN0LCB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH0pO1xuICAgIC8vIG9taXTnrZvpgIlcbiAgICBfa2V5cyA9IF9rZXlzLmZpbHRlcihrZXkgPT4gIW9taXQuaW5jbHVkZXMoa2V5KSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgX2tleXMpIHtcbiAgICAgIGNvbnN0IGRlc2MgPSB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuICAgICAgLy8g5bGe5oCn5LiN5a2Y5Zyo5a+86Ie0ZGVzY+W+l+WIsHVuZGVmaW5lZOaXtuS4jeiuvue9ruWAvFxuICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDpgJrov4fmjJHpgInmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXIg55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgcGljayhvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBwaWNrOiBrZXlzLCBlbXB0eVBpY2s6ICdlbXB0eScsIC4uLm9wdGlvbnMgfSk7XG4gIH1cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOmAmui/h+aOkumZpOaWueW8j+mAieWPluWvueixoeOAgmZpbHRlciDnmoTnroDlhpnmlrnlvI9cbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIGtleXMg5bGe5oCn5ZCN6ZuG5ZCIXG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBvbWl0KG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIob2JqZWN0LCB7IG9taXQ6IGtleXMsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHZhbHVlID0ge30pIHtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmFzc2lnbih0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyAo5a6a5Yi25pa55rOVKVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1N0cmluZygpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7fSk7XG4gICAgfVxuICB9XG5cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9Cb29sZWFuKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzKS5sZW5ndGggPiAwO1xuICB9XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5PYmplY3Quc2V0UHJvdG90eXBlT2YoX09iamVjdCwgT2JqZWN0KTtcbiIsImV4cG9ydCBjbGFzcyBfU3RyaW5nIGV4dGVuZHMgU3RyaW5nIHtcbiAgLyoqXG4gICAqIFN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGZyb21DaGFyQ29kZSDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGZyb21Db2RlUG9pbnQg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyByYXcg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOmmluWtl+avjeWkp+WGmVxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvRmlyc3RVcHBlckNhc2UobmFtZSA9ICcnKSB7XG4gICAgcmV0dXJuIGAkeyhuYW1lWzBdID8/ICcnKS50b1VwcGVyQ2FzZSgpfSR7bmFtZS5zbGljZSgxKX1gO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOmmluWtl+avjeWwj+WGmVxuICAgKiBAcGFyYW0gbmFtZSDlkI3np7BcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0ZpcnN0TG93ZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9Mb3dlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDovazpqbzls7Dlkb3lkI3jgILluLjnlKjkuo7ov57mjqXnrKblkb3lkI3ovazpqbzls7Dlkb3lkI3vvIzlpoIgeHgtbmFtZSAtPiB4eE5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ym44CC55So5LqO55Sf5oiQ5q2j5YiZIOm7mOiupOS4uuS4reWIkue6vyAtIOWvueW6lHJlZ2V4cOW+l+WIsCAvLShcXHcpL2dcbiAgICogQHBhcmFtIGZpcnN0IOmmluWtl+avjeWkhOeQhuaWueW8j+OAgnRydWUg5oiWICd1cHBlcmNhc2Un77ya6L2s5o2i5oiQ5aSn5YaZO1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIOaIliAnbG93ZXJjYXNlJ++8mui9rOaNouaIkOWwj+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAncmF3JyDmiJYg5YW25LuW5peg5pWI5YC877ya6buY6K6k5Y6f5qC36L+U5Zue77yM5LiN6L+b6KGM5aSE55CGO1xuICAgKiBAcmV0dXJucyB7TWFnaWNTdHJpbmd8c3RyaW5nfHN0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0NhbWVsQ2FzZShuYW1lLCB7IHNlcGFyYXRvciA9ICctJywgZmlyc3QgPSAncmF3JyB9ID0ge30pIHtcbiAgICAvLyDnlJ/miJDmraPliJlcbiAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke3NlcGFyYXRvcn0oXFxcXHcpYCwgJ2cnKTtcbiAgICAvLyDmi7zmjqXmiJDpqbzls7BcbiAgICBjb25zdCBjYW1lbE5hbWUgPSBuYW1lLnJlcGxhY2VBbGwocmVnZXhwLCAoc3Vic3RyLCAkMSkgPT4ge1xuICAgICAgcmV0dXJuICQxLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG4gICAgLy8g6aaW5a2X5q+N5aSn5bCP5YaZ5qC55o2u5Lyg5Y+C5Yik5patXG4gICAgaWYgKFt0cnVlLCAndXBwZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0ZpcnN0VXBwZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIGlmIChbZmFsc2UsICdsb3dlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvRmlyc3RMb3dlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbWVsTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDovazov57mjqXnrKblkb3lkI3jgILluLjnlKjkuo7pqbzls7Dlkb3lkI3ovazov57mjqXnrKblkb3lkI3vvIzlpoIgeHhOYW1lIC0+IHh4LW5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ymXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9MaW5lQ2FzZShuYW1lID0gJycsIHsgc2VwYXJhdG9yID0gJy0nIH0gPSB7fSkge1xuICAgIHJldHVybiBuYW1lXG4gICAgLy8g5oyJ6L+e5o6l56ym5ou85o6lXG4gICAgICAucmVwbGFjZUFsbCgvKFthLXpdKShbQS1aXSkvZywgYCQxJHtzZXBhcmF0b3J9JDJgKVxuICAgIC8vIOi9rOWwj+WGmVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gIH1cbn1cbiIsIi8vIOagt+W8j+WkhOeQhlxuZXhwb3J0IGNvbnN0IFN0eWxlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gKiDljZXkvY3lrZfnrKbkuLLjgILlr7nmlbDlrZfmiJbmlbDlrZfmoLzlvI/nmoTlrZfnrKbkuLLoh6rliqjmi7zljZXkvY3vvIzlhbbku5blrZfnrKbkuLLljp/moLfov5Tlm55cbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEBwYXJhbSB1bml0IOWNleS9jeOAgnZhbHVl5rKh5bim5Y2V5L2N5pe26Ieq5Yqo5ou85o6l77yM5Y+v5LygIHB4L2VtLyUg562JXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN0cmluZ31cbiAqL1xuU3R5bGUuZ2V0VW5pdFN0cmluZyA9IGZ1bmN0aW9uKHZhbHVlID0gJycsIHsgdW5pdCA9ICdweCcgfSA9IHt9KSB7XG4gIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgLy8g5rOo5oSP77ya6L+Z6YeM5L2/55SoID09IOWIpOaWre+8jOS4jeS9v+eUqCA9PT1cbiAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPT0gdmFsdWUgPyBgJHt2YWx1ZX0ke3VuaXR9YCA6IFN0cmluZyh2YWx1ZSk7XG59O1xuIiwiLy8gdnVlIOaVsOaNruWkhOeQhlxuaW1wb3J0IHsgX1N0cmluZyB9IGZyb20gJy4vX1N0cmluZyc7XG5pbXBvcnQgeyBEYXRhIH0gZnJvbSAnLi9EYXRhJztcblxuZXhwb3J0IGNvbnN0IFZ1ZURhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vKipcbiAgICog5rex6Kej5YyFIHZ1ZTMg5ZON5bqU5byP5a+56LGh5pWw5o2uXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiAqfX18KnwoKnx7W3A6IHN0cmluZ106ICp9KVtdfHtbcDogc3RyaW5nXTogKn19XG4gICAqL1xuVnVlRGF0YS5kZWVwVW53cmFwVnVlMyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgcmV0dXJuIERhdGEuZGVlcFVud3JhcChkYXRhLCB7XG4gICAgaXNXcmFwOiBkYXRhID0+IGRhdGE/Ll9fdl9pc1JlZixcbiAgICB1bndyYXA6IGRhdGEgPT4gZGF0YS52YWx1ZSxcbiAgfSk7XG59O1xuXG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcERlZmluaXRpb25zIHByb3BzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0UHJvcHNGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgcHJvcERlZmluaXRpb25zKSB7XG4gIC8vIHByb3BzIOWumuS5iee7n+S4gOaIkOWvueixoeagvOW8j++8jHR5cGUg57uf5LiA5oiQ5pWw57uE5qC85byP5Lul5L6/5ZCO57ut5Yik5patXG4gIGlmIChwcm9wRGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhwcm9wRGVmaW5pdGlvbnMubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIHsgdHlwZTogW10gfV0pKTtcbiAgfSBlbHNlIGlmIChEYXRhLmlzUGxhaW5PYmplY3QocHJvcERlZmluaXRpb25zKSkge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpLm1hcCgoW25hbWUsIGRlZmluaXRpb25dKSA9PiB7XG4gICAgICBkZWZpbml0aW9uID0gRGF0YS5pc1BsYWluT2JqZWN0KGRlZmluaXRpb24pXG4gICAgICAgID8geyAuLi5kZWZpbml0aW9uLCB0eXBlOiBbZGVmaW5pdGlvbi50eXBlXS5mbGF0KCkgfVxuICAgICAgICA6IHsgdHlwZTogW2RlZmluaXRpb25dLmZsYXQoKSB9O1xuICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBkZWZpbml0aW9uXTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgcHJvcERlZmluaXRpb25zID0ge307XG4gIH1cbiAgLy8g6K6+572u5YC8XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBbbmFtZSwgZGVmaW5pdGlvbl0gb2YgT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKSkge1xuICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBkZWZpbml0aW9uLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICAvLyBwcm9wTmFtZSDmiJYgcHJvcC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgY29uc3QgYXR0clZhbHVlID0gYXR0cnNbbmFtZV07XG4gICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgIC8vIOWPquWMheWQq0Jvb2xlYW7nsbvlnovnmoQnJ+i9rOaNouS4unRydWXvvIzlhbbku5bljp/moLfotYvlgLxcbiAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBkZWZpbml0aW9uLnR5cGUubGVuZ3RoID09PSAxICYmIGRlZmluaXRpb24udHlwZS5pbmNsdWRlcyhCb29sZWFuKSAmJiBhdHRyVmFsdWUgPT09ICcnID8gdHJ1ZSA6IGF0dHJWYWx1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gcHJvcC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgaWYgKGVuZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZXRSZXN1bHQoeyBuYW1lOiBfU3RyaW5nLnRvTGluZUNhc2UobmFtZSksIGRlZmluaXRpb24sIGVuZDogdHJ1ZSB9KTtcbiAgICB9KSh7XG4gICAgICBuYW1lLCBkZWZpbml0aW9uLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBlbWl0cyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gZW1pdERlZmluaXRpb25zIGVtaXRzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0RW1pdHNGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgZW1pdERlZmluaXRpb25zKSB7XG4gIC8vIGVtaXRzIOWumuS5iee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGVtaXREZWZpbml0aW9ucykpIHtcbiAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICB9IGVsc2UgaWYgKCEoZW1pdERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgZW1pdERlZmluaXRpb25zID0gW107XG4gIH1cbiAgLy8g57uf5LiA5aSE55CG5oiQIG9uRW1pdE5hbWXjgIFvblVwZGF0ZTplbWl0TmFtZSh2LW1vZGVs57O75YiXKSDmoLzlvI9cbiAgY29uc3QgZW1pdE5hbWVzID0gZW1pdERlZmluaXRpb25zLm1hcChuYW1lID0+IF9TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKSk7XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBlbWl0TmFtZXMpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgnb25VcGRhdGU6JykpIHtcbiAgICAgICAgLy8gb25VcGRhdGU6ZW1pdE5hbWUg5oiWIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSBfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgaWYgKGVuZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UobmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpKX1gLCBlbmQ6IHRydWUgfSk7XG4gICAgICB9XG4gICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICByZXN1bHRbbmFtZV0gPSBhdHRyc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9KSh7IG5hbWUgfSk7XG4gIH1cbiAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPluWJqeS9meWxnuaAp+OAguW4uOeUqOS6jue7hOS7tiBpbmhlcml0QXR0cnMg6K6+572uIGZhbHNlIOaXtuS9v+eUqOS9nOS4uuaWsOeahCBhdHRyc1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wcyDlrprkuYkg5oiWIHZ1ZSBwcm9wc++8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHBhcmFtIGVtaXRzIGVtaXRzIOWumuS5iSDmiJYgdnVlIGVtaXRz77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICAgKiBAcGFyYW0gbGlzdCDpop3lpJbnmoTmma7pgJrlsZ7mgKdcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cblZ1ZURhdGEuZ2V0UmVzdEZyb21BdHRycyA9IGZ1bmN0aW9uKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAvLyDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgcHJvcHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAocHJvcHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICB9XG4gICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KHByb3BzKSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGFyci5tYXAobmFtZSA9PiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpXSkuZmxhdCgpO1xuICB9KSgpO1xuICBlbWl0cyA9ICgoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gKCgpID0+IHtcbiAgICAgIGlmIChlbWl0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJldHVybiBlbWl0cztcbiAgICAgIH1cbiAgICAgIGlmIChEYXRhLmlzUGxhaW5PYmplY3QoZW1pdHMpKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcCgobmFtZSkgPT4ge1xuICAgICAgLy8gdXBkYXRlOmVtaXROYW1lIOaIliB1cGRhdGU6ZW1pdC1uYW1lIOagvOW8j1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgIGNvbnN0IHBhcnROYW1lID0gbmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpO1xuICAgICAgICByZXR1cm4gW2BvblVwZGF0ZToke19TdHJpbmcudG9DYW1lbENhc2UocGFydE5hbWUpfWAsIGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShwYXJ0TmFtZSl9YF07XG4gICAgICB9XG4gICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKV07XG4gICAgfSkuZmxhdCgpO1xuICB9KSgpO1xuICBsaXN0ID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSB0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZydcbiAgICAgID8gbGlzdC5zcGxpdCgnLCcpXG4gICAgICA6IGxpc3QgaW5zdGFuY2VvZiBBcnJheSA/IGxpc3QgOiBbXTtcbiAgICByZXR1cm4gYXJyLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICB9KSgpO1xuICBjb25zdCBsaXN0QWxsID0gQXJyYXkuZnJvbShuZXcgU2V0KFtwcm9wcywgZW1pdHMsIGxpc3RdLmZsYXQoKSkpO1xuICAvLyBjb25zb2xlLmxvZygnbGlzdEFsbCcsIGxpc3RBbGwpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IFtuYW1lLCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhhdHRycykpKSB7XG4gICAgaWYgKCFsaXN0QWxsLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBuYW1lLCBkZXNjKTtcbiAgICB9XG4gIH1cbiAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8g5Z+656GA5qih5Z2X44CC5pyJ5ZCM5ZCN5Y6f55Sf5a+56LGh55qE5YqgIF8g5Yy65YiGXG5leHBvcnQgKiBmcm9tICcuL19BcnJheSc7XG5leHBvcnQgKiBmcm9tICcuL19Cb29sZWFuJztcbmV4cG9ydCAqIGZyb20gJy4vX0RhdGUnO1xuZXhwb3J0ICogZnJvbSAnLi9fTWF0aCc7XG5leHBvcnQgKiBmcm9tICcuL19OdW1iZXInO1xuZXhwb3J0ICogZnJvbSAnLi9fT2JqZWN0JztcbmV4cG9ydCAqIGZyb20gJy4vX1JlZmxlY3QnO1xuZXhwb3J0ICogZnJvbSAnLi9fU2V0JztcbmV4cG9ydCAqIGZyb20gJy4vX1N0cmluZyc7XG5cbmV4cG9ydCAqIGZyb20gJy4vRGF0YSc7XG5leHBvcnQgKiBmcm9tICcuL1N0eWxlJztcbmV4cG9ydCAqIGZyb20gJy4vU3VwcG9ydCc7XG5leHBvcnQgKiBmcm9tICcuL1Z1ZURhdGEnO1xuIiwiLyoqXG4gKiBlc2xpbnQg6YWN572u77yaaHR0cDovL2VzbGludC5jbi9kb2NzL3J1bGVzL1xuICogZXNsaW50LXBsdWdpbi12dWUg6YWN572u77yaaHR0cHM6Ly9lc2xpbnQudnVlanMub3JnL3J1bGVzL1xuICovXG5pbXBvcnQgeyBfT2JqZWN0LCBEYXRhIH0gZnJvbSAnLi4vYmFzZSc7XG5cbi8qKlxuICog5a+85Ye65bi46YeP5L6/5o235L2/55SoXG4gKi9cbmV4cG9ydCBjb25zdCBPRkYgPSAnb2ZmJztcbmV4cG9ydCBjb25zdCBXQVJOID0gJ3dhcm4nO1xuZXhwb3J0IGNvbnN0IEVSUk9SID0gJ2Vycm9yJztcbi8qKlxuICog5a6a5Yi255qE6YWN572uXG4gKi9cbi8vIOWfuuehgOWumuWItlxuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSB7XG4gIC8vIOeOr+Wig+OAguS4gOS4queOr+Wig+WumuS5ieS6huS4gOe7hOmihOWumuS5ieeahOWFqOWxgOWPmOmHj1xuICBlbnY6IHtcbiAgICBicm93c2VyOiB0cnVlLFxuICAgIG5vZGU6IHRydWUsXG4gIH0sXG4gIC8vIOWFqOWxgOWPmOmHj1xuICBnbG9iYWxzOiB7XG4gICAgZ2xvYmFsVGhpczogJ3JlYWRvbmx5JyxcbiAgICBCaWdJbnQ6ICdyZWFkb25seScsXG4gIH0sXG4gIC8vIOino+aekOWZqFxuICBwYXJzZXJPcHRpb25zOiB7XG4gICAgZWNtYVZlcnNpb246ICdsYXRlc3QnLFxuICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnLFxuICAgIGVjbWFGZWF0dXJlczoge1xuICAgICAganN4OiB0cnVlLFxuICAgICAgZXhwZXJpbWVudGFsT2JqZWN0UmVzdFNwcmVhZDogdHJ1ZSxcbiAgICB9LFxuICB9LFxuICAvKipcbiAgICog57un5om/XG4gICAqIOS9v+eUqGVzbGludOeahOinhOWIme+8mmVzbGludDrphY3nva7lkI3np7BcbiAgICog5L2/55So5o+S5Lu255qE6YWN572u77yacGx1Z2luOuWMheWQjeeugOWGmS/phY3nva7lkI3np7BcbiAgICovXG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggZXNsaW50IOaOqOiNkOeahOinhOWImVxuICAgICdlc2xpbnQ6cmVjb21tZW5kZWQnLFxuICBdLFxuICAvKipcbiAgICog6KeE5YiZXG4gICAqIOadpeiHqiBlc2xpbnQg55qE6KeE5YiZ77ya6KeE5YiZSUQgOiB2YWx1ZVxuICAgKiDmnaXoh6rmj5Lku7bnmoTop4TliJnvvJrljIXlkI3nroDlhpkv6KeE5YiZSUQgOiB2YWx1ZVxuICAgKi9cbiAgcnVsZXM6IHtcbiAgICAvKipcbiAgICAgKiBQb3NzaWJsZSBFcnJvcnNcbiAgICAgKiDov5nkupvop4TliJnkuI4gSmF2YVNjcmlwdCDku6PnoIHkuK3lj6/og73nmoTplJnor6/miJbpgLvovpHplJnor6/mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnZ2V0dGVyLXJldHVybic6IE9GRiwgLy8g5by65Yi2IGdldHRlciDlh73mlbDkuK3lh7rnjrAgcmV0dXJuIOivreWPpVxuICAgICduby1jb25zdGFudC1jb25kaXRpb24nOiBPRkYsIC8vIOemgeatouWcqOadoeS7tuS4reS9v+eUqOW4uOmHj+ihqOi+vuW8j1xuICAgICduby1lbXB0eSc6IE9GRiwgLy8g56aB5q2i5Ye6546w56m66K+t5Y+l5Z2XXG4gICAgJ25vLWV4dHJhLXNlbWknOiBXQVJOLCAvLyDnpoHmraLkuI3lv4XopoHnmoTliIblj7dcbiAgICAnbm8tZnVuYy1hc3NpZ24nOiBPRkYsIC8vIOemgeatouWvuSBmdW5jdGlvbiDlo7DmmI7ph43mlrDotYvlgLxcbiAgICAnbm8tcHJvdG90eXBlLWJ1aWx0aW5zJzogT0ZGLCAvLyDnpoHmraLnm7TmjqXosIPnlKggT2JqZWN0LnByb3RvdHlwZXMg55qE5YaF572u5bGe5oCnXG5cbiAgICAvKipcbiAgICAgKiBCZXN0IFByYWN0aWNlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6juacgOS9s+Wunui3teeahO+8jOW4ruWKqeS9oOmBv+WFjeS4gOS6m+mXrumimO+8mlxuICAgICAqL1xuICAgICdhY2Nlc3Nvci1wYWlycyc6IEVSUk9SLCAvLyDlvLrliLYgZ2V0dGVyIOWSjCBzZXR0ZXIg5Zyo5a+56LGh5Lit5oiQ5a+55Ye6546wXG4gICAgJ2FycmF5LWNhbGxiYWNrLXJldHVybic6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueazleeahOWbnuiwg+WHveaVsOS4reaciSByZXR1cm4g6K+t5Y+lXG4gICAgJ2Jsb2NrLXNjb3BlZC12YXInOiBFUlJPUiwgLy8g5by65Yi25oqK5Y+Y6YeP55qE5L2/55So6ZmQ5Yi25Zyo5YW25a6a5LmJ55qE5L2c55So5Z+f6IyD5Zu05YaFXG4gICAgJ2N1cmx5JzogV0FSTiwgLy8g5by65Yi25omA5pyJ5o6n5Yi26K+t5Y+l5L2/55So5LiA6Ie055qE5ous5Y+36aOO5qC8XG4gICAgJ25vLWZhbGx0aHJvdWdoJzogV0FSTiwgLy8g56aB5q2iIGNhc2Ug6K+t5Y+l6JC956m6XG4gICAgJ25vLWZsb2F0aW5nLWRlY2ltYWwnOiBFUlJPUiwgLy8g56aB5q2i5pWw5a2X5a2X6Z2i6YeP5Lit5L2/55So5YmN5a+85ZKM5pyr5bC+5bCP5pWw54K5XG4gICAgJ25vLW11bHRpLXNwYWNlcyc6IFdBUk4sIC8vIOemgeatouS9v+eUqOWkmuS4quepuuagvFxuICAgICduby1uZXctd3JhcHBlcnMnOiBFUlJPUiwgLy8g56aB5q2i5a+5IFN0cmluZ++8jE51bWJlciDlkowgQm9vbGVhbiDkvb/nlKggbmV3IOaTjeS9nOesplxuICAgICduby1wcm90byc6IEVSUk9SLCAvLyDnpoHnlKggX19wcm90b19fIOWxnuaAp1xuICAgICduby1yZXR1cm4tYXNzaWduJzogV0FSTiwgLy8g56aB5q2i5ZyoIHJldHVybiDor63lj6XkuK3kvb/nlKjotYvlgLzor63lj6VcbiAgICAnbm8tdXNlbGVzcy1lc2NhcGUnOiBXQVJOLCAvLyDnpoHnlKjkuI3lv4XopoHnmoTovazkuYnlrZfnrKZcblxuICAgIC8qKlxuICAgICAqIFZhcmlhYmxlc1xuICAgICAqIOi/meS6m+inhOWImeS4juWPmOmHj+WjsOaYjuacieWFs++8mlxuICAgICAqL1xuICAgICduby11bmRlZi1pbml0JzogV0FSTiwgLy8g56aB5q2i5bCG5Y+Y6YeP5Yid5aeL5YyW5Li6IHVuZGVmaW5lZFxuICAgICduby11bnVzZWQtdmFycyc6IE9GRiwgLy8g56aB5q2i5Ye6546w5pyq5L2/55So6L+H55qE5Y+Y6YePXG4gICAgJ25vLXVzZS1iZWZvcmUtZGVmaW5lJzogW0VSUk9SLCB7ICdmdW5jdGlvbnMnOiBmYWxzZSwgJ2NsYXNzZXMnOiBmYWxzZSwgJ3ZhcmlhYmxlcyc6IGZhbHNlIH1dLCAvLyDnpoHmraLlnKjlj5jph4/lrprkuYnkuYvliY3kvb/nlKjlroPku6xcblxuICAgIC8qKlxuICAgICAqIFN0eWxpc3RpYyBJc3N1ZXNcbiAgICAgKiDov5nkupvop4TliJnmmK/lhbPkuo7po47moLzmjIfljZfnmoTvvIzogIzkuJTmmK/pnZ7luLjkuLvop4LnmoTvvJpcbiAgICAgKi9cbiAgICAnYXJyYXktYnJhY2tldC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25pWw57uE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Jsb2NrLXNwYWNpbmcnOiBXQVJOLCAvLyDnpoHmraLmiJblvLrliLblnKjku6PnoIHlnZfkuK3lvIDmi6zlj7fliY3lkozpl63mi6zlj7flkI7mnInnqbrmoLxcbiAgICAnYnJhY2Utc3R5bGUnOiBbV0FSTiwgJzF0YnMnLCB7ICdhbGxvd1NpbmdsZUxpbmUnOiB0cnVlIH1dLCAvLyDlvLrliLblnKjku6PnoIHlnZfkuK3kvb/nlKjkuIDoh7TnmoTlpKfmi6zlj7fpo47moLxcbiAgICAnY29tbWEtZGFuZ2xlJzogW1dBUk4sICdhbHdheXMtbXVsdGlsaW5lJ10sIC8vIOimgeaxguaIluemgeatouacq+WwvumAl+WPt1xuICAgICdjb21tYS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6YCX5Y+35YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2NvbW1hLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25L2/55So5LiA6Ie055qE6YCX5Y+36aOO5qC8XG4gICAgJ2NvbXB1dGVkLXByb3BlcnR5LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjorqHnrpfnmoTlsZ7mgKfnmoTmlrnmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnZnVuYy1jYWxsLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjlh73mlbDmoIfor4bnrKblkozlhbbosIPnlKjkuYvpl7TmnInnqbrmoLxcbiAgICAnZnVuY3Rpb24tcGFyZW4tbmV3bGluZSc6IFdBUk4sIC8vIOW8uuWItuWcqOWHveaVsOaLrOWPt+WGheS9v+eUqOS4gOiHtOeahOaNouihjFxuICAgICdpbXBsaWNpdC1hcnJvdy1saW5lYnJlYWsnOiBXQVJOLCAvLyDlvLrliLbpmpDlvI/ov5Tlm57nmoTnrq3lpLTlh73mlbDkvZPnmoTkvY3nva5cbiAgICAnaW5kZW50JzogW1dBUk4sIDIsIHsgJ1N3aXRjaENhc2UnOiAxIH1dLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTnvKnov5tcbiAgICAnanN4LXF1b3Rlcyc6IFdBUk4sIC8vIOW8uuWItuWcqCBKU1gg5bGe5oCn5Lit5LiA6Ie05Zyw5L2/55So5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ2tleS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo5a+56LGh5a2X6Z2i6YeP55qE5bGe5oCn5Lit6ZSu5ZKM5YC85LmL6Ze05L2/55So5LiA6Ie055qE6Ze06LedXG4gICAgJ2tleXdvcmQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWFs+mUruWtl+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICduZXctcGFyZW5zJzogV0FSTiwgLy8g5by65Yi25oiW56aB5q2i6LCD55So5peg5Y+C5p6E6YCg5Ye95pWw5pe25pyJ5ZyG5ous5Y+3XG4gICAgJ25vLW1peGVkLXNwYWNlcy1hbmQtdGFicyc6IFdBUk4sXG4gICAgJ25vLW11bHRpcGxlLWVtcHR5LWxpbmVzJzogW1dBUk4sIHsgJ21heCc6IDEsICdtYXhFT0YnOiAwLCAnbWF4Qk9GJzogMCB9XSwgLy8g56aB5q2i5Ye6546w5aSa6KGM56m66KGMXG4gICAgJ25vLXRyYWlsaW5nLXNwYWNlcyc6IFdBUk4sIC8vIOemgeeUqOihjOWwvuepuuagvFxuICAgICduby13aGl0ZXNwYWNlLWJlZm9yZS1wcm9wZXJ0eSc6IFdBUk4sIC8vIOemgeatouWxnuaAp+WJjeacieepuueZvVxuICAgICdub25ibG9jay1zdGF0ZW1lbnQtYm9keS1wb3NpdGlvbic6IFdBUk4sIC8vIOW8uuWItuWNleS4quivreWPpeeahOS9jee9rlxuICAgICdvYmplY3QtY3VybHktbmV3bGluZSc6IFtXQVJOLCB7ICdtdWx0aWxpbmUnOiB0cnVlLCAnY29uc2lzdGVudCc6IHRydWUgfV0sIC8vIOW8uuWItuWkp+aLrOWPt+WGheaNouihjOespueahOS4gOiHtOaAp1xuICAgICdvYmplY3QtY3VybHktc3BhY2luZyc6IFtXQVJOLCAnYWx3YXlzJ10sIC8vIOW8uuWItuWcqOWkp+aLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdwYWRkZWQtYmxvY2tzJzogW1dBUk4sICduZXZlciddLCAvLyDopoHmsYLmiJbnpoHmraLlnZflhoXloavlhYVcbiAgICAncXVvdGVzJzogW1dBUk4sICdzaW5nbGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUsICdhbGxvd1RlbXBsYXRlTGl0ZXJhbHMnOiB0cnVlIH1dLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTlj43li77lj7fjgIHlj4zlvJXlj7fmiJbljZXlvJXlj7dcbiAgICAnc2VtaSc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouS9v+eUqOWIhuWPt+S7o+abvyBBU0lcbiAgICAnc2VtaS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25YiG5Y+35LmL5YmN5ZKM5LmL5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NlbWktc3R5bGUnOiBXQVJOLCAvLyDlvLrliLbliIblj7fnmoTkvY3nva5cbiAgICAnc3BhY2UtYmVmb3JlLWJsb2Nrcyc6IFdBUk4sIC8vIOW8uuWItuWcqOWdl+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1iZWZvcmUtZnVuY3Rpb24tcGFyZW4nOiBbV0FSTiwgeyAnYW5vbnltb3VzJzogJ25ldmVyJywgJ25hbWVkJzogJ25ldmVyJywgJ2FzeW5jQXJyb3cnOiAnYWx3YXlzJyB9XSwgLy8g5by65Yi25ZyoIGZ1bmN0aW9u55qE5bem5ous5Y+35LmL5YmN5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWluLXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuWcqOWchuaLrOWPt+WGheS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbmZpeC1vcHMnOiBXQVJOLCAvLyDopoHmsYLmk43kvZznrKblkajlm7TmnInnqbrmoLxcbiAgICAnc3BhY2UtdW5hcnktb3BzJzogV0FSTiwgLy8g5by65Yi25Zyo5LiA5YWD5pON5L2c56ym5YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlZC1jb21tZW50JzogV0FSTiwgLy8g5by65Yi25Zyo5rOo6YeK5LitIC8vIOaIliAvKiDkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3dpdGNoLWNvbG9uLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKggc3dpdGNoIOeahOWGkuWPt+W3puWPs+acieepuuagvFxuICAgICd0ZW1wbGF0ZS10YWctc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouWcqOaooeadv+agh+iusOWSjOWug+S7rOeahOWtl+mdoumHj+S5i+mXtOeahOepuuagvFxuXG4gICAgLyoqXG4gICAgICogRUNNQVNjcmlwdCA2XG4gICAgICog6L+Z5Lqb6KeE5YiZ5Y+q5LiOIEVTNiDmnInlhbMsIOWNs+mAmuW4uOaJgOivtOeahCBFUzIwMTXvvJpcbiAgICAgKi9cbiAgICAnYXJyb3ctc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItueureWktOWHveaVsOeahOeureWktOWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdnZW5lcmF0b3Itc3Rhci1zcGFjaW5nJzogW1dBUk4sIHsgJ2JlZm9yZSc6IGZhbHNlLCAnYWZ0ZXInOiB0cnVlLCAnbWV0aG9kJzogeyAnYmVmb3JlJzogdHJ1ZSwgJ2FmdGVyJzogZmFsc2UgfSB9XSwgLy8g5by65Yi2IGdlbmVyYXRvciDlh73mlbDkuK0gKiDlj7flkajlm7Tkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbm8tdXNlbGVzcy1yZW5hbWUnOiBXQVJOLCAvLyDnpoHmraLlnKggaW1wb3J0IOWSjCBleHBvcnQg5ZKM6Kej5p6E6LWL5YC85pe25bCG5byV55So6YeN5ZG95ZCN5Li655u45ZCM55qE5ZCN5a2XXG4gICAgJ3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sIC8vIOimgeaxguS9v+eUqOaooeadv+Wtl+mdoumHj+iAjOmdnuWtl+espuS4sui/nuaOpVxuICAgICdyZXN0LXNwcmVhZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Ymp5L2Z5ZKM5omp5bGV6L+Q566X56ym5Y+K5YW26KGo6L6+5byP5LmL6Ze05pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLWN1cmx5LXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLmqKHmnb/lrZfnrKbkuLLkuK3nmoTltYzlhaXooajovr7lvI/lkajlm7TnqbrmoLznmoTkvb/nlKhcbiAgICAneWllbGQtc3Rhci1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHlpZWxkKiDooajovr7lvI/kuK0gKiDlkajlm7Tkvb/nlKjnqbrmoLxcbiAgfSxcbiAgLy8g6KaG55uWXG4gIG92ZXJyaWRlczogW10sXG59O1xuLy8gdnVlMi92dWUzIOWFseeUqFxuZXhwb3J0IGNvbnN0IHZ1ZUNvbW1vbkNvbmZpZyA9IHtcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL211bHRpLXdvcmQtY29tcG9uZW50LW5hbWVzJzogT0ZGLCAvLyDopoHmsYLnu4Tku7blkI3np7Dlp4vnu4jkuLrlpJrlrZdcbiAgICAndnVlL25vLXVudXNlZC1jb21wb25lbnRzJzogV0FSTiwgLy8g5pyq5L2/55So55qE57uE5Lu2XG4gICAgJ3Z1ZS9uby11bnVzZWQtdmFycyc6IE9GRiwgLy8g5pyq5L2/55So55qE5Y+Y6YePXG4gICAgJ3Z1ZS9yZXF1aXJlLXJlbmRlci1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmuLLmn5Plh73mlbDmgLvmmK/ov5Tlm57lgLxcbiAgICAndnVlL3JlcXVpcmUtdi1mb3Ita2V5JzogT0ZGLCAvLyB2LWZvcuS4reW/hemhu+S9v+eUqGtleVxuICAgICd2dWUvcmV0dXJuLWluLWNvbXB1dGVkLXByb3BlcnR5JzogV0FSTiwgLy8g5by65Yi26L+U5Zue6K+t5Y+l5a2Y5Zyo5LqO6K6h566X5bGe5oCn5LitXG4gICAgJ3Z1ZS92YWxpZC10ZW1wbGF0ZS1yb290JzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoTmqKHmnb/moLlcbiAgICAndnVlL3ZhbGlkLXYtZm9yJzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoR2LWZvcuaMh+S7pFxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9hdHRyaWJ1dGUtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOW8uuWItuWxnuaAp+WQjeagvOW8j1xuICAgICd2dWUvY29tcG9uZW50LWRlZmluaXRpb24tbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOW8uuWItue7hOS7tm5hbWXmoLzlvI9cbiAgICAndnVlL2h0bWwtcXVvdGVzJzogW1dBUk4sICdkb3VibGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUgfV0sIC8vIOW8uuWItiBIVE1MIOWxnuaAp+eahOW8leWPt+agt+W8j1xuICAgICd2dWUvaHRtbC1zZWxmLWNsb3NpbmcnOiBPRkYsIC8vIOS9v+eUqOiHqumXreWQiOagh+etvlxuICAgICd2dWUvbWF4LWF0dHJpYnV0ZXMtcGVyLWxpbmUnOiBbV0FSTiwgeyAnc2luZ2xlbGluZSc6IEluZmluaXR5LCAnbXVsdGlsaW5lJzogMSB9XSwgLy8g5by65Yi25q+P6KGM5YyF5ZCr55qE5pyA5aSn5bGe5oCn5pWwXG4gICAgJ3Z1ZS9tdWx0aWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5aSa6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS9wcm9wLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDkuLogVnVlIOe7hOS7tuS4reeahCBQcm9wIOWQjeensOW8uuWItuaJp+ihjOeJueWumuWkp+Wwj+WGmVxuICAgICd2dWUvcmVxdWlyZS1kZWZhdWx0LXByb3AnOiBPRkYsIC8vIHByb3Bz6ZyA6KaB6buY6K6k5YC8XG4gICAgJ3Z1ZS9zaW5nbGVsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWNleihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvdi1iaW5kLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LWJpbmTmjIfku6Tpo47moLxcbiAgICAndnVlL3Ytb24tc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtb27mjIfku6Tpo47moLxcbiAgICAndnVlL3Ytc2xvdC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1zbG905oyH5Luk6aOO5qC8XG4gICAgLy8gUHJpb3JpdHkgQzogUmVjb21tZW5kZWRcbiAgICAndnVlL25vLXYtaHRtbCc6IE9GRiwgLy8g56aB5q2i5L2/55Sodi1odG1sXG4gICAgLy8gVW5jYXRlZ29yaXplZFxuICAgICd2dWUvYmxvY2stdGFnLW5ld2xpbmUnOiBXQVJOLCAvLyAg5Zyo5omT5byA5Z2X57qn5qCH6K6w5LmL5ZCO5ZKM5YWz6Zet5Z2X57qn5qCH6K6w5LmL5YmN5by65Yi25o2i6KGMXG4gICAgJ3Z1ZS9odG1sLWNvbW1lbnQtY29udGVudC1zcGFjaW5nJzogV0FSTiwgLy8g5ZyoSFRNTOazqOmHiuS4reW8uuWItue7n+S4gOeahOepuuagvFxuICAgICd2dWUvc2NyaXB0LWluZGVudCc6IFtXQVJOLCAyLCB7ICdiYXNlSW5kZW50JzogMSwgJ3N3aXRjaENhc2UnOiAxIH1dLCAvLyDlnKg8c2NyaXB0PuS4reW8uuWItuS4gOiHtOeahOe8qei/m1xuICAgIC8vIEV4dGVuc2lvbiBSdWxlc+OAguWvueW6lGVzbGludOeahOWQjOWQjeinhOWIme+8jOmAgueUqOS6jjx0ZW1wbGF0ZT7kuK3nmoTooajovr7lvI9cbiAgICAndnVlL2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9ibG9jay1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSxcbiAgICAndnVlL2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLFxuICAgICd2dWUvY29tbWEtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9jb21tYS1zdHlsZSc6IFdBUk4sXG4gICAgJ3Z1ZS9mdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXktc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXl3b3JkLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLFxuICAgICd2dWUvc3BhY2UtaW4tcGFyZW5zJzogV0FSTixcbiAgICAndnVlL3NwYWNlLWluZml4LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS11bmFyeS1vcHMnOiBXQVJOLFxuICAgICd2dWUvYXJyb3ctc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9wcmVmZXItdGVtcGxhdGUnOiBXQVJOLFxuICB9LFxuICBvdmVycmlkZXM6IFtcbiAgICB7XG4gICAgICAnZmlsZXMnOiBbJyoudnVlJ10sXG4gICAgICAncnVsZXMnOiB7XG4gICAgICAgICdpbmRlbnQnOiBPRkYsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuLy8gdnVlMueUqFxuZXhwb3J0IGNvbnN0IHZ1ZTJDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUyIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3JlY29tbWVuZGVkJyxcbiAgXSxcbn0pO1xuLy8gdnVlM+eUqFxuZXhwb3J0IGNvbnN0IHZ1ZTNDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZW52OiB7XG4gICAgJ3Z1ZS9zZXR1cC1jb21waWxlci1tYWNyb3MnOiB0cnVlLCAvLyDlpITnkIZzZXR1cOaooeadv+S4reWDjyBkZWZpbmVQcm9wcyDlkowgZGVmaW5lRW1pdHMg6L+Z5qC355qE57yW6K+R5Zmo5a6P5oqlIG5vLXVuZGVmIOeahOmXrumimO+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy91c2VyLWd1aWRlLyNjb21waWxlci1tYWNyb3Mtc3VjaC1hcy1kZWZpbmVwcm9wcy1hbmQtZGVmaW5lZW1pdHMtZ2VuZXJhdGUtbm8tdW5kZWYtd2FybmluZ3NcbiAgfSxcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUzIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3Z1ZTMtcmVjb21tZW5kZWQnLFxuICBdLFxuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbm8tdGVtcGxhdGUta2V5JzogT0ZGLCAvLyDnpoHmraI8dGVtcGxhdGU+5Lit5L2/55Soa2V55bGe5oCnXG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXR1cm4taW4tZW1pdHMtdmFsaWRhdG9yJzogV0FSTiwgLy8g5by65Yi25ZyoZW1pdHPpqozor4HlmajkuK3lrZjlnKjov5Tlm57or63lj6VcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmVxdWlyZS1leHBsaWNpdC1lbWl0cyc6IE9GRiwgLy8g6ZyA6KaBZW1pdHPkuK3lrprkuYnpgInpobnnlKjkuo4kZW1pdCgpXG4gICAgJ3Z1ZS92LW9uLWV2ZW50LWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlnKjmqKHmnb/kuK3nmoToh6rlrprkuYnnu4Tku7bkuIrlvLrliLbmiafooYwgdi1vbiDkuovku7blkb3lkI3moLflvI9cbiAgfSxcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKC4uLm9iamVjdHMpIHtcbiAgY29uc3QgW3RhcmdldCwgLi4uc291cmNlc10gPSBvYmplY3RzO1xuICBjb25zdCByZXN1bHQgPSBEYXRhLmRlZXBDbG9uZSh0YXJnZXQpO1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc291cmNlKSkge1xuICAgICAgLy8g54m55q6K5a2X5q615aSE55CGXG4gICAgICBpZiAoa2V5ID09PSAncnVsZXMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsga2V5LCB2YWx1ZSwgJ3Jlc3VsdFtrZXldJzogcmVzdWx0W2tleV0gfSk7XG4gICAgICAgIC8vIOWIneWni+S4jeWtmOWcqOaXtui1i+m7mOiupOWAvOeUqOS6juWQiOW5tlxuICAgICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9O1xuICAgICAgICAvLyDlr7nlkITmnaHop4TliJnlpITnkIZcbiAgICAgICAgZm9yIChsZXQgW3J1bGVLZXksIHJ1bGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG4gICAgICAgICAgLy8g5bey5pyJ5YC857uf5LiA5oiQ5pWw57uE5aSE55CGXG4gICAgICAgICAgbGV0IHNvdXJjZVJ1bGVWYWx1ZSA9IHJlc3VsdFtrZXldW3J1bGVLZXldID8/IFtdO1xuICAgICAgICAgIGlmICghKHNvdXJjZVJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlID0gW3NvdXJjZVJ1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOimgeWQiOW5tueahOWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGlmICghKHJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgcnVsZVZhbHVlID0gW3J1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOe7n+S4gOagvOW8j+WQjui/m+ihjOaVsOe7hOW+queOr+aTjeS9nFxuICAgICAgICAgIGZvciAoY29uc3QgW3ZhbEluZGV4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHJ1bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIOWvueixoea3seWQiOW5tu+8jOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbCkgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gX09iamVjdC5kZWVwQXNzaWduKHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPz8ge30sIHZhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDotYvlgLzop4TliJnnu5PmnpxcbiAgICAgICAgICByZXN1bHRba2V5XVtydWxlS2V5XSA9IHNvdXJjZVJ1bGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWtl+auteagueaNruexu+Wei+WIpOaWreWkhOeQhlxuICAgICAgLy8g5pWw57uE77ya5ou85o6lXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAocmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyBbXSkucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5a+56LGh77ya5rex5ZCI5bm2XG4gICAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUodmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgX09iamVjdC5kZWVwQXNzaWduKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8ge30sIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIOS9v+eUqOWumuWItueahOmFjee9rlxuICogQHBhcmFtIHt977ya6YWN572u6aG5XG4gKiAgICAgICAgICBiYXNl77ya5L2/55So5Z+656GAZXNsaW505a6a5Yi277yM6buY6K6kIHRydWVcbiAqICAgICAgICAgIHZ1ZVZlcnNpb27vvJp2dWXniYjmnKzvvIzlvIDlkK/lkI7pnIDopoHlronoo4UgZXNsaW50LXBsdWdpbi12dWVcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZSh7IGJhc2UgPSB0cnVlLCB2dWVWZXJzaW9uIH0gPSB7fSkge1xuICBsZXQgcmVzdWx0ID0ge307XG4gIGlmIChiYXNlKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCBiYXNlQ29uZmlnKTtcbiAgfVxuICBpZiAodnVlVmVyc2lvbiA9PSAyKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUyQ29uZmlnKTtcbiAgfSBlbHNlIGlmICh2dWVWZXJzaW9uID09IDMpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTNDb25maWcpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICBiYXNlOiAnLi8nLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIC8vIOWIq+WQjVxuICAgIGFsaWFzOiB7XG4gICAgICAvLyAnQHJvb3QnOiByZXNvbHZlKF9fZGlybmFtZSksXG4gICAgICAvLyAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyDop4Tlrprop6blj5HorablkYrnmoQgY2h1bmsg5aSn5bCP44CC77yI5LulIGticyDkuLrljZXkvY3vvIlcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIgKiogMTAsXG4gICAgLy8g6Ieq5a6a5LmJ5bqV5bGC55qEIFJvbGx1cCDmiZPljIXphY3nva7jgIJcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8g5YWl5Y+j5paH5Lu25ZCNXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzL2VudHJ5LSR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOWdl+aWh+S7tuWQjVxuICAgICAgICBjaHVua0ZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDotYTmupDmlofku7blkI3vvIxjc3PjgIHlm77niYfnrYlcbiAgICAgICAgYXNzZXRGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLltleHRdYDtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iLCIvLyDor7fmsYLmlrnms5VcbmV4cG9ydCBjb25zdCBNRVRIT0RTID0gWydHRVQnLCAnSEVBRCcsICdQT1NUJywgJ1BVVCcsICdERUxFVEUnLCAnQ09OTkVDVCcsICdPUFRJT05TJywgJ1RSQUNFJywgJ1BBVENIJ107XG4vLyBodHRwIOeKtuaAgeeggVxuZXhwb3J0IGNvbnN0IFNUQVRVU0VTID0gW1xuICB7ICdzdGF0dXMnOiAxMDAsICdzdGF0dXNUZXh0JzogJ0NvbnRpbnVlJyB9LFxuICB7ICdzdGF0dXMnOiAxMDEsICdzdGF0dXNUZXh0JzogJ1N3aXRjaGluZyBQcm90b2NvbHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMiwgJ3N0YXR1c1RleHQnOiAnUHJvY2Vzc2luZycgfSxcbiAgeyAnc3RhdHVzJzogMTAzLCAnc3RhdHVzVGV4dCc6ICdFYXJseSBIaW50cycgfSxcbiAgeyAnc3RhdHVzJzogMjAwLCAnc3RhdHVzVGV4dCc6ICdPSycgfSxcbiAgeyAnc3RhdHVzJzogMjAxLCAnc3RhdHVzVGV4dCc6ICdDcmVhdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDIsICdzdGF0dXNUZXh0JzogJ0FjY2VwdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDMsICdzdGF0dXNUZXh0JzogJ05vbi1BdXRob3JpdGF0aXZlIEluZm9ybWF0aW9uJyB9LFxuICB7ICdzdGF0dXMnOiAyMDQsICdzdGF0dXNUZXh0JzogJ05vIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNSwgJ3N0YXR1c1RleHQnOiAnUmVzZXQgQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA2LCAnc3RhdHVzVGV4dCc6ICdQYXJ0aWFsIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNywgJ3N0YXR1c1RleHQnOiAnTXVsdGktU3RhdHVzJyB9LFxuICB7ICdzdGF0dXMnOiAyMDgsICdzdGF0dXNUZXh0JzogJ0FscmVhZHkgUmVwb3J0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIyNiwgJ3N0YXR1c1RleHQnOiAnSU0gVXNlZCcgfSxcbiAgeyAnc3RhdHVzJzogMzAwLCAnc3RhdHVzVGV4dCc6ICdNdWx0aXBsZSBDaG9pY2VzJyB9LFxuICB7ICdzdGF0dXMnOiAzMDEsICdzdGF0dXNUZXh0JzogJ01vdmVkIFBlcm1hbmVudGx5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDIsICdzdGF0dXNUZXh0JzogJ0ZvdW5kJyB9LFxuICB7ICdzdGF0dXMnOiAzMDMsICdzdGF0dXNUZXh0JzogJ1NlZSBPdGhlcicgfSxcbiAgeyAnc3RhdHVzJzogMzA0LCAnc3RhdHVzVGV4dCc6ICdOb3QgTW9kaWZpZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNSwgJ3N0YXR1c1RleHQnOiAnVXNlIFByb3h5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDcsICdzdGF0dXNUZXh0JzogJ1RlbXBvcmFyeSBSZWRpcmVjdCcgfSxcbiAgeyAnc3RhdHVzJzogMzA4LCAnc3RhdHVzVGV4dCc6ICdQZXJtYW5lbnQgUmVkaXJlY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMCwgJ3N0YXR1c1RleHQnOiAnQmFkIFJlcXVlc3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMSwgJ3N0YXR1c1RleHQnOiAnVW5hdXRob3JpemVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDIsICdzdGF0dXNUZXh0JzogJ1BheW1lbnQgUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMywgJ3N0YXR1c1RleHQnOiAnRm9yYmlkZGVuJyB9LFxuICB7ICdzdGF0dXMnOiA0MDQsICdzdGF0dXNUZXh0JzogJ05vdCBGb3VuZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA1LCAnc3RhdHVzVGV4dCc6ICdNZXRob2QgTm90IEFsbG93ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNiwgJ3N0YXR1c1RleHQnOiAnTm90IEFjY2VwdGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNywgJ3N0YXR1c1RleHQnOiAnUHJveHkgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwOCwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDksICdzdGF0dXNUZXh0JzogJ0NvbmZsaWN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MTAsICdzdGF0dXNUZXh0JzogJ0dvbmUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMSwgJ3N0YXR1c1RleHQnOiAnTGVuZ3RoIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTIsICdzdGF0dXNUZXh0JzogJ1ByZWNvbmRpdGlvbiBGYWlsZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMywgJ3N0YXR1c1RleHQnOiAnUGF5bG9hZCBUb28gTGFyZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNCwgJ3N0YXR1c1RleHQnOiAnVVJJIFRvbyBMb25nJyB9LFxuICB7ICdzdGF0dXMnOiA0MTUsICdzdGF0dXNUZXh0JzogJ1Vuc3VwcG9ydGVkIE1lZGlhIFR5cGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNiwgJ3N0YXR1c1RleHQnOiAnUmFuZ2UgTm90IFNhdGlzZmlhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTcsICdzdGF0dXNUZXh0JzogJ0V4cGVjdGF0aW9uIEZhaWxlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDE4LCAnc3RhdHVzVGV4dCc6ICdJXFwnbSBhIFRlYXBvdCcgfSxcbiAgeyAnc3RhdHVzJzogNDIxLCAnc3RhdHVzVGV4dCc6ICdNaXNkaXJlY3RlZCBSZXF1ZXN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MjIsICdzdGF0dXNUZXh0JzogJ1VucHJvY2Vzc2FibGUgRW50aXR5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjMsICdzdGF0dXNUZXh0JzogJ0xvY2tlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI0LCAnc3RhdHVzVGV4dCc6ICdGYWlsZWQgRGVwZW5kZW5jeScgfSxcbiAgeyAnc3RhdHVzJzogNDI1LCAnc3RhdHVzVGV4dCc6ICdUb28gRWFybHknIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNiwgJ3N0YXR1c1RleHQnOiAnVXBncmFkZSBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI4LCAnc3RhdHVzVGV4dCc6ICdQcmVjb25kaXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyOSwgJ3N0YXR1c1RleHQnOiAnVG9vIE1hbnkgUmVxdWVzdHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDQzMSwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBIZWFkZXIgRmllbGRzIFRvbyBMYXJnZScgfSxcbiAgeyAnc3RhdHVzJzogNDUxLCAnc3RhdHVzVGV4dCc6ICdVbmF2YWlsYWJsZSBGb3IgTGVnYWwgUmVhc29ucycgfSxcbiAgeyAnc3RhdHVzJzogNTAwLCAnc3RhdHVzVGV4dCc6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMSwgJ3N0YXR1c1RleHQnOiAnTm90IEltcGxlbWVudGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDIsICdzdGF0dXNUZXh0JzogJ0JhZCBHYXRld2F5JyB9LFxuICB7ICdzdGF0dXMnOiA1MDMsICdzdGF0dXNUZXh0JzogJ1NlcnZpY2UgVW5hdmFpbGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNCwgJ3N0YXR1c1RleHQnOiAnR2F0ZXdheSBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA1MDUsICdzdGF0dXNUZXh0JzogJ0hUVFAgVmVyc2lvbiBOb3QgU3VwcG9ydGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDYsICdzdGF0dXNUZXh0JzogJ1ZhcmlhbnQgQWxzbyBOZWdvdGlhdGVzJyB9LFxuICB7ICdzdGF0dXMnOiA1MDcsICdzdGF0dXNUZXh0JzogJ0luc3VmZmljaWVudCBTdG9yYWdlJyB9LFxuICB7ICdzdGF0dXMnOiA1MDgsICdzdGF0dXNUZXh0JzogJ0xvb3AgRGV0ZWN0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwOSwgJ3N0YXR1c1RleHQnOiAnQmFuZHdpZHRoIExpbWl0IEV4Y2VlZGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MTAsICdzdGF0dXNUZXh0JzogJ05vdCBFeHRlbmRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTExLCAnc3RhdHVzVGV4dCc6ICdOZXR3b3JrIEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyB9LFxuXTtcbiIsIi8vIOWJqui0tOadv1xuLyoqXG4gKiDlpI3liLbmlofmnKzml6flhpnms5XjgILlnKggY2xpcGJvYXJkIGFwaSDkuI3lj6/nlKjml7bku6Pmm79cbiAqIEBwYXJhbSB0ZXh0XG4gKiBAcmV0dXJucyB7UHJvbWlzZTxQcm9taXNlPHZvaWQ+fFByb21pc2U8bmV2ZXI+Pn1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gb2xkQ29weVRleHQodGV4dCkge1xuICAvLyDmlrDlu7rovpPlhaXmoYZcbiAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAvLyDotYvlgLxcbiAgdGV4dGFyZWEudmFsdWUgPSB0ZXh0O1xuICAvLyDmoLflvI/orr7nva5cbiAgT2JqZWN0LmFzc2lnbih0ZXh0YXJlYS5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgIHRvcDogMCxcbiAgICBjbGlwUGF0aDogJ2NpcmNsZSgwKScsXG4gIH0pO1xuICAvLyDliqDlhaXliLDpobXpnaJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGV4dGFyZWEpO1xuICAvLyDpgInkuK1cbiAgdGV4dGFyZWEuc2VsZWN0KCk7XG4gIC8vIOWkjeWItlxuICBjb25zdCBzdWNjZXNzID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgLy8g5LuO6aG16Z2i56e76ZmkXG4gIHRleHRhcmVhLnJlbW92ZSgpO1xuICByZXR1cm4gc3VjY2VzcyA/IFByb21pc2UucmVzb2x2ZSgpIDogUHJvbWlzZS5yZWplY3QoKTtcbn1cbmV4cG9ydCBjb25zdCBjbGlwYm9hcmQgPSB7XG4gIC8qKlxuICAgKiDlhpnlhaXmlofmnKwo5aSN5Yi2KVxuICAgKiBAcGFyYW0gdGV4dFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIGFzeW5jIHdyaXRlVGV4dCh0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gYXdhaXQgb2xkQ29weVRleHQodGV4dCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICog6K+75Y+W5paH5pysKOeymOi0tClcbiAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHJlYWRUZXh0KCkge1xuICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG4gIH0sXG59O1xuIiwiLyohIGpzLWNvb2tpZSB2My4wLjUgfCBNSVQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuZnVuY3Rpb24gYXNzaWduICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXRcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xudmFyIGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gIHJlYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXG4gICAgICAvJSgyWzM0NkJGXXwzW0FDLUZdfDQwfDVbQkRFXXw2MHw3W0JDRF0pL2csXG4gICAgICBkZWNvZGVVUklDb21wb25lbnRcbiAgICApXG4gIH1cbn07XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuZnVuY3Rpb24gaW5pdCAoY29udmVydGVyLCBkZWZhdWx0QXR0cmlidXRlcykge1xuICBmdW5jdGlvbiBzZXQgKG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGU1KTtcbiAgICB9XG4gICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKVxuICAgICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcblxuICAgIHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcbiAgICAgIC8vIC4uLlxuICAgICAgLy8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuICAgICAgLy8gICAgIGNoYXJhY3RlcjpcbiAgICAgIC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG4gICAgICAvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cbiAgICAgIC8vIC4uLlxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9XG4gICAgICBuYW1lICsgJz0nICsgY29udmVydGVyLndyaXRlKHZhbHVlLCBuYW1lKSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcylcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldCAobmFtZSkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IChhcmd1bWVudHMubGVuZ3RoICYmICFuYW1lKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuICAgIC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgdmFyIGphciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZm91bmQgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICBqYXJbZm91bmRdID0gY29udmVydGVyLnJlYWQodmFsdWUsIGZvdW5kKTtcblxuICAgICAgICBpZiAobmFtZSA9PT0gZm91bmQpIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHJldHVybiBuYW1lID8gamFyW25hbWVdIDogamFyXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICB7XG4gICAgICBzZXQsXG4gICAgICBnZXQsXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIChuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHNldChcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgICcnLFxuICAgICAgICAgIGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xuICAgICAgICAgICAgZXhwaXJlczogLTFcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIHdpdGhBdHRyaWJ1dGVzOiBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgICAgICByZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxuICAgICAgfSxcbiAgICAgIHdpdGhDb252ZXJ0ZXI6IGZ1bmN0aW9uIChjb252ZXJ0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgYXR0cmlidXRlczogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShkZWZhdWx0QXR0cmlidXRlcykgfSxcbiAgICAgIGNvbnZlcnRlcjogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShjb252ZXJ0ZXIpIH1cbiAgICB9XG4gIClcbn1cblxudmFyIGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG5leHBvcnQgeyBhcGkgYXMgZGVmYXVsdCB9O1xuIiwiLy8gY29va2ll5pON5L2cXG5pbXBvcnQganNDb29raWUgZnJvbSAnanMtY29va2llJztcbi8vIOeUqOWIsOeahOW6k+S5n+WvvOWHuuS+v+S6juiHquihjOmAieeUqFxuZXhwb3J0IHsganNDb29raWUgfTtcblxuLy8g5ZCMIGpzLWNvb2tpZSDnmoTpgInpobnlkIjlubbmlrnlvI9cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNvdXJjZSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cbi8vIGNvb2tpZeWvueixoVxuZXhwb3J0IGNsYXNzIENvb2tpZSB7XG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhuVxuICAgKiAgICAgICAgICBjb252ZXJ0ZXIgIOWQjCBqcy1jb29raWVzIOeahCBjb252ZXJ0ZXJcbiAgICogICAgICAgICAgYXR0cmlidXRlcyDlkIwganMtY29va2llcyDnmoQgYXR0cmlidXRlc1xuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaLjgIJqcy1jb29raWUg5ZyoMy4w54mI5pysKGNvbW1pdDogNGI3OTI5MGI5OGQ3ZmJmMWFiNDkzYTdmOWUxNjE5NDE4YWMwMWU0NSkg56e76Zmk5LqG5a+5IGpzb24g55qE6Ieq5Yqo6L2s5o2i77yM6L+Z6YeM6buY6K6kIHRydWUg5Yqg5LiKXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAvLyDpgInpobnnu5PmnpxcbiAgICBjb25zdCB7IGNvbnZlcnRlciA9IHt9LCBhdHRyaWJ1dGVzID0ge30sIGpzb24gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAganNvbixcbiAgICAgIGF0dHJpYnV0ZXM6IGFzc2lnbih7fSwganNDb29raWUuYXR0cmlidXRlcywgYXR0cmlidXRlcyksXG4gICAgICBjb252ZXJ0ZXI6IGFzc2lnbih7fSwganNDb29raWUuY29udmVydGVyLCBjb252ZXJ0ZXIpLFxuICAgIH07XG4gICAgLy8g5aOw5piO5ZCE5bGe5oCn44CC55u05o6l5oiW5ZyoY29uc3RydWN0b3LkuK3ph43mlrDotYvlgLxcbiAgICAvLyDpu5jorqTpgInpobnnu5PmnpxcbiAgICB0aGlzLiRkZWZhdWx0cyA9IG9wdGlvbnNSZXN1bHQ7XG4gIH1cbiAgJGRlZmF1bHRzO1xuICAvLyDlhpnlhaVcbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcGFyYW0gYXR0cmlidXRlc1xuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2iXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc2V0KG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuICAgIGlmIChqc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ganNDb29raWUuc2V0KG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzKTtcbiAgfVxuICAvLyDor7vlj5ZcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSBvcHRpb25zIOmFjee9rumhuVxuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaJcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXQobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBsZXQgcmVzdWx0ID0ganNDb29raWUuZ2V0KG5hbWUpO1xuICAgIGlmIChqc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDnp7vpmaRcbiAgcmVtb3ZlKG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4ganNDb29raWUucmVtb3ZlKG5hbWUsIGF0dHJpYnV0ZXMpO1xuICB9XG4gIC8vIOWIm+W7uuOAgumAmui/h+mFjee9rum7mOiupOWPguaVsOWIm+W7uuaWsOWvueixoe+8jOeugOWMluS8oOWPglxuICBjcmVhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9uc1Jlc3VsdCA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBhdHRyaWJ1dGVzOiBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlcyksXG4gICAgICBjb252ZXJ0ZXI6IGFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMuYXR0cmlidXRlcywgb3B0aW9ucy5jb252ZXJ0ZXIpLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBDb29raWUob3B0aW9uc1Jlc3VsdCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBjb29raWUgPSBuZXcgQ29va2llKCk7XG4iLCJmdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gZmlsZSBzaXplIGhhY2tzXG4gICAgICAgIHJlcXVlc3Qub25jb21wbGV0ZSA9IHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgLSBmaWxlIHNpemUgaGFja3NcbiAgICAgICAgcmVxdWVzdC5vbmFib3J0ID0gcmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlU3RvcmUoZGJOYW1lLCBzdG9yZU5hbWUpIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lKTtcbiAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHJlcXVlc3QucmVzdWx0LmNyZWF0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgY29uc3QgZGJwID0gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KTtcbiAgICByZXR1cm4gKHR4TW9kZSwgY2FsbGJhY2spID0+IGRicC50aGVuKChkYikgPT4gY2FsbGJhY2soZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCB0eE1vZGUpLm9iamVjdFN0b3JlKHN0b3JlTmFtZSkpKTtcbn1cbmxldCBkZWZhdWx0R2V0U3RvcmVGdW5jO1xuZnVuY3Rpb24gZGVmYXVsdEdldFN0b3JlKCkge1xuICAgIGlmICghZGVmYXVsdEdldFN0b3JlRnVuYykge1xuICAgICAgICBkZWZhdWx0R2V0U3RvcmVGdW5jID0gY3JlYXRlU3RvcmUoJ2tleXZhbC1zdG9yZScsICdrZXl2YWwnKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRHZXRTdG9yZUZ1bmM7XG59XG4vKipcbiAqIEdldCBhIHZhbHVlIGJ5IGl0cyBrZXkuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGdldChrZXksIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldChrZXkpKSk7XG59XG4vKipcbiAqIFNldCBhIHZhbHVlIHdpdGggYSBrZXkuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIHZhbHVlXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBzdG9yZS5wdXQodmFsdWUsIGtleSk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbi8qKlxuICogU2V0IG11bHRpcGxlIHZhbHVlcyBhdCBvbmNlLiBUaGlzIGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgc2V0KCkgbXVsdGlwbGUgdGltZXMuXG4gKiBJdCdzIGFsc28gYXRvbWljIOKAkyBpZiBvbmUgb2YgdGhlIHBhaXJzIGNhbid0IGJlIGFkZGVkLCBub25lIHdpbGwgYmUgYWRkZWQuXG4gKlxuICogQHBhcmFtIGVudHJpZXMgQXJyYXkgb2YgZW50cmllcywgd2hlcmUgZWFjaCBlbnRyeSBpcyBhbiBhcnJheSBvZiBgW2tleSwgdmFsdWVdYC5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBzZXRNYW55KGVudHJpZXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiBzdG9yZS5wdXQoZW50cnlbMV0sIGVudHJ5WzBdKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IG11bHRpcGxlIHZhbHVlcyBieSB0aGVpciBrZXlzXG4gKlxuICogQHBhcmFtIGtleXNcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBnZXRNYW55KGtleXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBQcm9taXNlLmFsbChrZXlzLm1hcCgoa2V5KSA9PiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldChrZXkpKSkpKTtcbn1cbi8qKlxuICogVXBkYXRlIGEgdmFsdWUuIFRoaXMgbGV0cyB5b3Ugc2VlIHRoZSBvbGQgdmFsdWUgYW5kIHVwZGF0ZSBpdCBhcyBhbiBhdG9taWMgb3BlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSB1cGRhdGVyIEEgY2FsbGJhY2sgdGhhdCB0YWtlcyB0aGUgb2xkIHZhbHVlIGFuZCByZXR1cm5zIGEgbmV3IHZhbHVlLlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZShrZXksIHVwZGF0ZXIsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4gXG4gICAgLy8gTmVlZCB0byBjcmVhdGUgdGhlIHByb21pc2UgbWFudWFsbHkuXG4gICAgLy8gSWYgSSB0cnkgdG8gY2hhaW4gcHJvbWlzZXMsIHRoZSB0cmFuc2FjdGlvbiBjbG9zZXMgaW4gYnJvd3NlcnNcbiAgICAvLyB0aGF0IHVzZSBhIHByb21pc2UgcG9seWZpbGwgKElFMTAvMTEpLlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgc3RvcmUuZ2V0KGtleSkub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzdG9yZS5wdXQodXBkYXRlcih0aGlzLnJlc3VsdCksIGtleSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSkpO1xufVxuLyoqXG4gKiBEZWxldGUgYSBwYXJ0aWN1bGFyIGtleSBmcm9tIHRoZSBzdG9yZS5cbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZGVsKGtleSwgY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZHdyaXRlJywgKHN0b3JlKSA9PiB7XG4gICAgICAgIHN0b3JlLmRlbGV0ZShrZXkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIERlbGV0ZSBtdWx0aXBsZSBrZXlzIGF0IG9uY2UuXG4gKlxuICogQHBhcmFtIGtleXMgTGlzdCBvZiBrZXlzIHRvIGRlbGV0ZS5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBkZWxNYW55KGtleXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4gc3RvcmUuZGVsZXRlKGtleSkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIENsZWFyIGFsbCB2YWx1ZXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBjbGVhcihjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgc3RvcmUuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZWFjaEN1cnNvcihzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBzdG9yZS5vcGVuQ3Vyc29yKCkub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVzdWx0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjYWxsYmFjayh0aGlzLnJlc3VsdCk7XG4gICAgICAgIHRoaXMucmVzdWx0LmNvbnRpbnVlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG59XG4vKipcbiAqIEdldCBhbGwga2V5cyBpbiB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGtleXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbEtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldEFsbEtleXMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGVhY2hDdXJzb3Ioc3RvcmUsIChjdXJzb3IpID0+IGl0ZW1zLnB1c2goY3Vyc29yLmtleSkpLnRoZW4oKCkgPT4gaXRlbXMpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBHZXQgYWxsIHZhbHVlcyBpbiB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHZhbHVlcyhjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4ge1xuICAgICAgICAvLyBGYXN0IHBhdGggZm9yIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpZiAoc3RvcmUuZ2V0QWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGwoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGVhY2hDdXJzb3Ioc3RvcmUsIChjdXJzb3IpID0+IGl0ZW1zLnB1c2goY3Vyc29yLnZhbHVlKSkudGhlbigoKSA9PiBpdGVtcyk7XG4gICAgfSk7XG59XG4vKipcbiAqIEdldCBhbGwgZW50cmllcyBpbiB0aGUgc3RvcmUuIEVhY2ggZW50cnkgaXMgYW4gYXJyYXkgb2YgYFtrZXksIHZhbHVlXWAuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGVudHJpZXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgLy8gKGFsdGhvdWdoLCBob3BlZnVsbHkgd2UnbGwgZ2V0IGEgc2ltcGxlciBwYXRoIHNvbWUgZGF5KVxuICAgICAgICBpZiAoc3RvcmUuZ2V0QWxsICYmIHN0b3JlLmdldEFsbEtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGxLZXlzKCkpLFxuICAgICAgICAgICAgICAgIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsKCkpLFxuICAgICAgICAgICAgXSkudGhlbigoW2tleXMsIHZhbHVlc10pID0+IGtleXMubWFwKChrZXksIGkpID0+IFtrZXksIHZhbHVlc1tpXV0pKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgICAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKFtjdXJzb3Iua2V5LCBjdXJzb3IudmFsdWVdKSkudGhlbigoKSA9PiBpdGVtcykpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgeyBjbGVhciwgY3JlYXRlU3RvcmUsIGRlbCwgZGVsTWFueSwgZW50cmllcywgZ2V0LCBnZXRNYW55LCBrZXlzLCBwcm9taXNpZnlSZXF1ZXN0LCBzZXQsIHNldE1hbnksIHVwZGF0ZSwgdmFsdWVzIH07XG4iLCJleHBvcnQgY2xhc3MgX1N0b3JhZ2Uge1xuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAgc3RvcmFnZSDlr7nlupTnmoRzdG9yYWdl5a+56LGh44CCbG9jYWxTdG9yYWdlIOaIliBzZXNzaW9uU3RvcmFnZVxuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaLjgIJcbiAgICogQHJldHVybnMge3ZvaWR8Kn1cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgZnJvbSwganNvbiA9IHRydWUgfSA9IG9wdGlvbnM7XG4gICAgY29uc3Qgb3B0aW9uc1Jlc3VsdCA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBmcm9tLFxuICAgICAganNvbixcbiAgICB9O1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgLy8g6buY6K6k6YCJ6aG557uT5p6cXG4gICAgICAkZGVmYXVsdHM6IG9wdGlvbnNSZXN1bHQsXG4gICAgICAvLyDlr7nlupTnmoRzdG9yYWdl5a+56LGh44CCXG4gICAgICBzdG9yYWdlOiBmcm9tLFxuICAgICAgLy8g5Y6f5pyJ5pa55rOV44CC55Sx5LqOIE9iamVjdC5jcmVhdGUoZnJvbSkg5pa55byP57un5om/5pe26LCD55So5Lya5oqlIFVuY2F1Z2h0IFR5cGVFcnJvcjogSWxsZWdhbCBpbnZvY2F0aW9u77yM5pS55oiQ5Y2V54us5Yqg5YWl5pa55byPXG4gICAgICBzZXRJdGVtOiBmcm9tLnNldEl0ZW0uYmluZChmcm9tKSxcbiAgICAgIGdldEl0ZW06IGZyb20uZ2V0SXRlbS5iaW5kKGZyb20pLFxuICAgICAgcmVtb3ZlSXRlbTogZnJvbS5yZW1vdmVJdGVtLmJpbmQoZnJvbSksXG4gICAgICBrZXk6IGZyb20ua2V5LmJpbmQoZnJvbSksXG4gICAgICBjbGVhcjogZnJvbS5jbGVhci5iaW5kKGZyb20pLFxuICAgIH0pO1xuICB9XG4gIC8vIOWjsOaYjuWQhOWxnuaAp+OAguebtOaOpeaIluWcqGNvbnN0cnVjdG9y5Lit6YeN5paw6LWL5YC8XG4gICRkZWZhdWx0cztcbiAgc3RvcmFnZTtcbiAgc2V0SXRlbTtcbiAgZ2V0SXRlbTtcbiAgcmVtb3ZlSXRlbTtcbiAga2V5O1xuICBjbGVhcjtcbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgfVxuICAvLyDliKTmlq3lsZ7mgKfmmK/lkKblrZjlnKjjgILlkIzml7bnlKjkuo7lnKggZ2V0IOS4reWvueS4jeWtmOWcqOeahOWxnuaAp+i/lOWbniB1bmRlZmluZWRcbiAgaGFzKGtleSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0b3JhZ2UpLmluY2x1ZGVzKGtleSk7XG4gIH1cbiAgLy8g5YaZ5YWlXG4gIHNldChrZXksIHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIGlmIChqc29uKSB7XG4gICAgICAvLyDlpITnkIblrZggdW5kZWZpbmVkIOeahOaDheWGte+8jOazqOaEj+WvueixoeS4reeahOaYvuW8jyB1bmRlZmluZWQg55qE5bGe5oCn5Lya6KKrIGpzb24g5bqP5YiX5YyW56e76ZmkXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gIH1cbiAgLy8g6K+75Y+WXG4gIGdldChrZXksIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGpzb24gPSAnanNvbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuanNvbiA6IHRoaXMuJGRlZmF1bHRzLmpzb247XG4gICAgLy8g5aSE55CG5peg5bGe5oCn55qE55qE5oOF5Ya16L+U5ZueIHVuZGVmaW5lZFxuICAgIGlmIChqc29uICYmICF0aGlzLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyDlhbbku5blgLzliKTmlq3ov5Tlm55cbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g56e76ZmkXG4gIHJlbW92ZShrZXkpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgfVxuICAvLyDliJvlu7rjgILpgJrov4fphY3nva7pu5jorqTlj4LmlbDliJvlu7rmlrDlr7nosaHvvIznroDljJbkvKDlj4JcbiAgY3JlYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG5ldyBfU3RvcmFnZShvcHRpb25zUmVzdWx0KTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IF9sb2NhbFN0b3JhZ2UgPSBuZXcgX1N0b3JhZ2UoeyBmcm9tOiBsb2NhbFN0b3JhZ2UgfSk7XG5leHBvcnQgY29uc3QgX3Nlc3Npb25TdG9yYWdlID0gbmV3IF9TdG9yYWdlKHsgZnJvbTogc2Vzc2lvblN0b3JhZ2UgfSk7XG4iXSwibmFtZXMiOlsiYmFzZUNvbmZpZyIsImFzc2lnbiIsImpzQ29va2llIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFFQTtBQUNPLE1BQU0sSUFBSSxTQUFTLEdBQUcsQ0FBQztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRTtBQUMvQjtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hEO0FBQ0EsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxLQUFLO0FBQ25DLE1BQU0sT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEQsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDeEI7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RDtBQUNBLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENB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TUFBTSxTQUFTLEtBQUssQ0FBQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUU7QUFDMUIsSUFBSSxJQUFJO0FBQ1IsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDaEIsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyQyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDakIsS0FBSztBQUNMLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7QUFDNUQ7QUFDQSxNQUFNLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDM0IsTUFBTSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUN0QixNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDckIsS0FBSyxNQUFNO0FBQ1gsTUFBTSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUN0QixLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLEdBQUc7QUFDVCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDaEQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDakQsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEdBQUc7QUFDWixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3BCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLEtBQUssRUFBRTtBQUN2QyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbEQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDaEIsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDdkQsSUFBSSxPQUFPLElBQUksQ0FBQyxN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
