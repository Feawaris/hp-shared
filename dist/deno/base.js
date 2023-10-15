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

export { Data, Style, Support, VueData, _Array, _Boolean, _Date, _Math, _Number, _Object, _Reflect, _Set, _String };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvX1NldC5qcyIsIi4uLy4uL3NyYy9iYXNlL19BcnJheS5qcyIsIi4uLy4uL3NyYy9iYXNlL19Cb29sZWFuLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX0RhdGUuanMiLCIuLi8uLi9zcmMvYmFzZS9fTWF0aC5qcyIsIi4uLy4uL3NyYy9iYXNlL19OdW1iZXIuanMiLCIuLi8uLi9zcmMvYmFzZS9fUmVmbGVjdC5qcyIsIi4uLy4uL3NyYy9iYXNlL0RhdGEuanMiLCIuLi8uLi9zcmMvYmFzZS9TdXBwb3J0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX09iamVjdC5qcyIsIi4uLy4uL3NyYy9iYXNlL19TdHJpbmcuanMiLCIuLi8uLi9zcmMvYmFzZS9TdHlsZS5qcyIsIi4uLy4uL3NyYy9iYXNlL1Z1ZURhdGEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8g6ZuG5ZCIXG5pbXBvcnQgeyBfQXJyYXkgfSBmcm9tICcuL19BcnJheSc7XG5cbmV4cG9ydCBjbGFzcyBfU2V0IGV4dGVuZHMgU2V0IHtcbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOS6pOmbhlxuICAgKiBAcGFyYW0gc2V0c1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyBpbnRlcnNlY3Rpb24oLi4uc2V0cykge1xuICAgIC8vIOS8oOWPguaVsOmHj1xuICAgIGlmIChzZXRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHNldHNbMF0gPSBzZXRzWzBdIHx8IFtdO1xuICAgICAgc2V0c1sxXSA9IHNldHNbMV0gfHwgW107XG4gICAgfVxuICAgIC8vIOe7n+S4gOexu+Wei+WkhOeQhlxuICAgIHNldHMgPSBuZXcgX0FycmF5KHNldHMpLm1hcChzZXQgPT4gbmV3IF9BcnJheShzZXQpKTtcblxuICAgIGNvbnN0IFtmaXJzdCwgLi4ub3RoZXJzXSA9IHNldHM7XG4gICAgcmV0dXJuIGZpcnN0LmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgIHJldHVybiBvdGhlcnMuZXZlcnkoc2V0ID0+IHNldC5pbmNsdWRlcyh2YWx1ZSkpO1xuICAgIH0pLnRvX1NldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOW5tumbhlxuICAgKiBAcGFyYW0gc2V0c1xuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyB1bmlvbiguLi5zZXRzKSB7XG4gICAgLy8g5Lyg5Y+C5pWw6YePXG4gICAgaWYgKHNldHMubGVuZ3RoIDwgMikge1xuICAgICAgc2V0c1swXSA9IHNldHNbMF0gfHwgW107XG4gICAgICBzZXRzWzFdID0gc2V0c1sxXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgc2V0cyA9IG5ldyBfQXJyYXkoc2V0cykubWFwKHNldCA9PiBuZXcgX0FycmF5KHNldCkpO1xuXG4gICAgcmV0dXJuIHNldHMuZmxhdCgpLnRvX1NldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOihpembhlxuICAgKiBAcGFyYW0gbWFpblNldFxuICAgKiBAcGFyYW0gb3RoZXJTZXRzXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIGNvbXBsZW1lbnQobWFpblNldCA9IFtdLCAuLi5vdGhlclNldHMpIHtcbiAgICAvLyDkvKDlj4LmlbDph49cbiAgICBpZiAob3RoZXJTZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIG90aGVyU2V0c1swXSA9IG90aGVyU2V0c1swXSB8fCBbXTtcbiAgICB9XG4gICAgLy8g57uf5LiA57G75Z6L5aSE55CGXG4gICAgbWFpblNldCA9IG5ldyBfQXJyYXkobWFpblNldCk7XG4gICAgb3RoZXJTZXRzID0gbmV3IF9BcnJheShvdGhlclNldHMpLm1hcChhcmcgPT4gbmV3IF9BcnJheShhcmcpKTtcbiAgICByZXR1cm4gbWFpblNldC5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gb3RoZXJTZXRzLmV2ZXJ5KHNldCA9PiAhc2V0LmluY2x1ZGVzKHZhbHVlKSk7XG4gICAgfSkudG9fU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IFtdKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ19TZXQgY29uc3RydWN0b3InLCB2YWx1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gbmV3IFNldCh2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCfkvKDlj4LmiqXplJnvvIzlsIbnlJ/miJDnqbrpm4blkIgnLCBlKTtcbiAgICAgIHZhbHVlID0gbmV3IFNldChbXSk7XG4gICAgfVxuICAgIHN1cGVyKHZhbHVlKTtcblxuICAgIC8vIHNpemUg5peg6ZyA5a6a5Yi2XG4gIH1cblxuICAvLyDmlrnms5XlrprliLbvvJrljp/lnovlkIzlkI3mlrnms5Ur5paw5aKe5pa55rOV44CC5aSn6YOo5YiG6L+U5ZueIHRoaXMg5L6/5LqO6ZO+5byP5pON5L2cXG4gIC8qKlxuICAgKiDkv67mlLlcbiAgICovXG4gIC8vICjlrprliLbmlrnms5UpXG4gIGFkZCguLi52YWx1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgU2V0LnByb3RvdHlwZS5hZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBkZWxldGUoLi4udmFsdWVzKSB7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgIFNldC5wcm90b3R5cGUuZGVsZXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgY2xlYXIoKSB7XG4gICAgU2V0LnByb3RvdHlwZS5jbGVhci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOmBjeWOhlxuICAgKi9cbiAgLy8gU3ltYm9sLml0ZXJhdG9yIOaXoOmcgOWumuWItlxuICAvLyBrZXlzIOaXoOmcgOWumuWItlxuICAvLyB2YWx1ZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGVudHJpZXMg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgZm9yRWFjaCgpIHtcbiAgICBTZXQucHJvdG90eXBlLmZvckVhY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xmib5cbiAgICovXG4gIC8vIGhhcyDml6DpnIDlrprliLZcblxuICAvKipcbiAgICog55Sf5oiQXG4gICAqL1xuICAvLyDnm7TmjqUgdG9fQXJyYXkg6LCD5pWw57uE5pa55rOV5YaNIHRvX1NldCDovazmjaLlm57mnaXljbPlj6/vvIzml6DpnIDph43lpI3lrprliLZcblxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyAo5a6a5Yi25pa55rOVKVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvTnVtYmVyKCkge1xuICAgIHJldHVybiBOYU47XG4gIH1cblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1N0cmluZygpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGB7JHt0aGlzLnRvQXJyYXkoKS5qb2luKCcsJyl9fWA7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuICd7fSc7XG4gICAgfVxuICB9XG5cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9Cb29sZWFuKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnNpemUgPiAwO1xuICB9XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKTtcbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG4gIH1cblxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b19BcnJheSgpIHtcbiAgICByZXR1cm4gbmV3IF9BcnJheSh0aGlzKTtcbiAgfVxufVxuIiwiLy8g5pWw57uEXG5pbXBvcnQgeyBfU2V0IH0gZnJvbSAnLi9fU2V0JztcblxuZXhwb3J0IGNsYXNzIF9BcnJheSBleHRlbmRzIEFycmF5IHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gc3RhdGljIGlzQXJyYXkg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBmcm9tIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgb2Yg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IFtdKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gQXJyYXkuZnJvbSh2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKCfkvKDlj4LmiqXplJnvvIzlsIbnlJ/miJDnqbrmlbDnu4QnLCBlKTtcbiAgICAgIHZhbHVlID0gW107XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDEgJiYgdHlwZW9mIHZhbHVlWzBdID09PSAnbnVtYmVyJykge1xuICAgICAgLy8g56iA55aP5pWw57uE6Zeu6aKY77yM5YWI6LCDIHN1cGVyIOeUn+aIkCB0aGlzIOWQjuWGjeS/ruaUuSB0aGlzIOWGheWuuVxuICAgICAgY29uc3QgdGVtcCA9IHZhbHVlWzBdO1xuICAgICAgdmFsdWVbMF0gPSB1bmRlZmluZWQ7XG4gICAgICBzdXBlciguLi52YWx1ZSk7XG4gICAgICB0aGlzWzBdID0gdGVtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIoLi4udmFsdWUpO1xuICAgIH1cblxuICAgIC8vIGxlbmd0aCDml6DpnIDlrprliLZcbiAgfVxuXG4gIC8vIOaWueazleWumuWItu+8muWOn+Wei+WQjOWQjeaWueazlSvmlrDlop7mlrnms5XjgILlpKfpg6jliIbov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgLyoqXG4gICAqIOS/ruaUuVxuICAgKi9cbiAgLy8gc29ydCDml6DpnIDlrprliLZcbiAgLy8gcmV2ZXJzZSDml6DpnIDlrprliLZcbiAgLy8gZmlsbCDml6DpnIDlrprliLZcbiAgLy8gY29weVdpdGhpbiDml6DpnIDlrprliLZcblxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBwdXNoKCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgcG9wKGxlbmd0aCA9IDEpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHVuc2hpZnQoKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICBzaGlmdChsZW5ndGggPSAxKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgQXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHNwbGljZShzdGFydCwgZGVsZXRlQ291bnQsIC4uLml0ZW1zKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIC8vICjmlrDlop7mlrnms5UpIOWIoOmZpFxuICBkZWxldGUodmFsdWUpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZEluZGV4KHZhbCA9PiB2YWwgPT09IHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG4gIC8vICjmlrDlop7mlrnms5UpIOa4heepulxuICBjbGVhcigpIHtcbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoMCk7XG4gIH1cbiAgLy8gKOaWsOWinuaWueazlSkg5Y676YeNXG4gIHVuaXF1ZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudG9fU2V0KCkudG9fQXJyYXkoKTtcbiAgICByZXR1cm4gdGhpcy5jbGVhcigpLnB1c2goLi4udmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOmBjeWOhlxuICAgKi9cbiAgLy8gU3ltYm9sLml0ZXJhdG9yIOaXoOmcgOWumuWItlxuICAvLyBrZXlzIOaXoOmcgOWumuWItlxuICAvLyB2YWx1ZXMg5peg6ZyA5a6a5Yi2XG4gIC8vIGVudHJpZXMg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgZm9yRWFjaCgpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeaJvlxuICAgKi9cbiAgLy8gYXQg5peg6ZyA5a6a5Yi2XG4gIC8vIGZpbmQg5peg6ZyA5a6a5Yi2XG4gIC8vIGZpbmRJbmRleCDml6DpnIDlrprliLZcbiAgLy8gZmluZExhc3Qg5peg6ZyA5a6a5Yi2XG4gIC8vIGZpbmRMYXN0SW5kZXgg5peg6ZyA5a6a5Yi2XG4gIC8vIGluY2x1ZGVzIOaXoOmcgOWumuWItlxuICAvLyBpbmRleE9mIOaXoOmcgOWumuWItlxuICAvLyBsYXN0SW5kZXhPZiDml6DpnIDlrprliLZcbiAgLy8gc29tZSDml6DpnIDlrprliLZcbiAgLy8gZXZlcnkg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqIOeUn+aIkFxuICAgKi9cbiAgLy8gbWFwIOaXoOmcgOWumuWItlxuICAvLyBmaWx0ZXIg5peg6ZyA5a6a5Yi2XG4gIC8vIHJlZHVjZSDml6DpnIDlrprliLZcbiAgLy8gcmVkdWNlUmlnaHQg5peg6ZyA5a6a5Yi2XG4gIC8vIGNvbmNhdCDml6DpnIDlrprliLZcbiAgLy8gc2xpY2Ug5peg6ZyA5a6a5Yi2XG4gIC8vIGpvaW4g5peg6ZyA5a6a5Yi2XG4gIC8vIGZsYXQg5peg6ZyA5a6a5Yi2XG4gIC8vIGZsYXRNYXAg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgd2l0aCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS53aXRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1NwbGljZWQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBBcnJheS5wcm90b3R5cGUudG9TcGxpY2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1NvcnRlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1NvcnRlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih2YWx1ZSk7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9SZXZlcnNlZCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZS50b1JldmVyc2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHZhbHVlKTtcbiAgfVxuICAvKipcbiAgICog6L2s5o2i57O75YiX5pa55rOV77ya6L2s5o2i5oiQ5Y6f5aeL5YC85ZKM5YW25LuW57G75Z6LXG4gICAqL1xuICAvLyAo5a6a5Yi25pa55rOVKVxuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgICBpZiAoaGludCA9PT0gJ3N0cmluZycgfHwgaGludCA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU3RyaW5nKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKGB0b1N0cmluZyDovazmjaLmiqXplJnvvIzlsIbnlJ/miJAgJ1tdJ2AsIGUpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtdKTtcbiAgICB9XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPiAwO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b1NldCgpIHtcbiAgICByZXR1cm4gbmV3IFNldCh0aGlzKTtcbiAgfVxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b19TZXQoKSB7XG4gICAgcmV0dXJuIG5ldyBfU2V0KHRoaXMpO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgX0Jvb2xlYW4gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5fQm9vbGVhbi5GQUxTWSA9IFswLCAnJywgbnVsbCwgdW5kZWZpbmVkLCBOYU5dO1xuIiwiLy8g5pel5pyf5pe26Ze0XG5leHBvcnQgY2xhc3MgX0RhdGUgZXh0ZW5kcyBEYXRlIHtcbiAgLyoqXG4gICAqIHN0YXRpY1xuICAgKi9cbiAgLy8gKOaWsOWinuWxnuaApylcbiAgc3RhdGljIFJFR0VYX1BBUlNFID0gL14oXFxkezR9KVstL10/KFxcZHsxLDJ9KT9bLS9dPyhcXGR7MCwyfSlbVHRcXHNdKihcXGR7MSwyfSk/Oj8oXFxkezEsMn0pPzo/KFxcZHsxLDJ9KT9bLjpdPyhcXGQrKT8kLztcbiAgc3RhdGljIFJFR0VYX0ZPUk1BVCA9IC9cXFsoW15cXF1dKyldfFl7MSw0fXxNezEsNH18RHsxLDJ9fGR7MSw0fXxIezEsMn18aHsxLDJ9fGF8QXxtezEsMn18c3sxLDJ9fFp7MSwyfXxTU1MvZztcblxuICAvLyBzdGF0aWMgbm93IOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgcGFyc2Ug5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBVVEMg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOi9rOaNouaIkOWtl+espuS4slxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzdHJpbmdpZnkodmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgdGhpcyh2YWx1ZSkudG9TdHJpbmcoKTtcbiAgfVxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5piv5ZCm5pyJ5pWI5Y+C5pWw44CC5bi455So5LqO5aSE55CG5pON5L2c5b6X5YiwIEludmFsaWQgRGF0ZSDnmoTmg4XlhrVcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIGlzVmFsaWRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHZhbHVlKS50b0Jvb2xlYW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIC8vIGNvbnNvbGUubG9nKCdfRGF0ZSBjb25zdHJ1Y3RvcicsIGFyZ3MpO1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gbnVsbCDlkozmmL7lvI8gdW5kZWZpbmVkIOmDveinhuS4uuaXoOaViOWAvFxuICAgICAgaWYgKGFyZ3NbMF0gPT09IG51bGwpIHtcbiAgICAgICAgYXJnc1swXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZUFsbCgnLScsICcvJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgLy8g5paw5aKe5bGe5oCnXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd5ZWFyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGdWxsWWVhcigpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21vbnRoJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNb250aCgpICsgMTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERhdGUoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd3ZWVrJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXkoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdob3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRIb3VycygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Nob3J0SG91cicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgY29uc3QgaG91ciA9IHRoaXMuaG91cjtcbiAgICAgICAgcmV0dXJuIGhvdXIgJSAxMiA9PT0gMCA/IGhvdXIgOiBob3VyICUgMTI7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWludXRlJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRNaW51dGVzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2Vjb25kJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTZWNvbmRzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWlsbGlzZWNvbmQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE1pbGxpc2Vjb25kcygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3RpbWVab25lT2Zmc2V0SG91cicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIOagvOW8j+WMluWtl+espuS4sueUqOOAguaAu+S9k+WQjCBlbGVtZW50IOeUqOeahCBkYXkuanMg5qC85byPKGh0dHBzOi8vZGF5LmpzLm9yZy9kb2NzL3poLUNOL2Rpc3BsYXkvZm9ybWF0Ke+8jOmjjuagvOWumuWItuaIkOS4reaWh1xuICAgIHRoaXMuZm9ybWF0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWVknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnllYXIudG9TdHJpbmcoKS5zbGljZSgtMik7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1lZWVknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnllYXIudG9TdHJpbmcoKS5zbGljZSgtNCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ00nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1vbnRoLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ01NJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5tb250aC50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0QnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmRheS50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdERCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuZGF5LnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWyflkajml6UnLCAn5ZGo5LiAJywgJ+WRqOS6jCcsICflkajkuIknLCAn5ZGo5ZubJywgJ+WRqOS6lCcsICflkajlha0nXVskdGhpcy53ZWVrXTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnZGQnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsn5pif5pyf5pelJywgJ+aYn+acn+S4gCcsICfmmJ/mnJ/kuownLCAn5pif5pyf5LiJJywgJ+aYn+acn+WbmycsICfmmJ/mnJ/kupQnLCAn5pif5pyf5YWtJ11bJHRoaXMud2Vla107XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ0gnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmhvdXIudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnSEgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLmhvdXIudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdoJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zaG9ydEhvdXIudG9TdHJpbmcoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnaGgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLnNob3J0SG91ci50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ20nLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1pbnV0ZS50b1N0cmluZygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdtbScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMubWludXRlLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAncycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuc2Vjb25kLnRvU3RyaW5nKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ3NzJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoISR0aGlzLnRvQm9vbGVhbigpKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkdGhpcy5zZWNvbmQudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5mb3JtYXQsICdTU1MnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghJHRoaXMudG9Cb29sZWFuKCkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICR0aGlzLm1pbGxpc2Vjb25kLnRvU3RyaW5nKCkucGFkU3RhcnQoMywgJzAnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnYScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHRoaXMuaG91ciA8IDEyID8gJ+S4iuWNiCcgOiAn5LiL5Y2IJztcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnQScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuZm9ybWF0LCAnWicsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCEkdGhpcy50b0Jvb2xlYW4oKSkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzaWduID0gJHRoaXMudGltZVpvbmVPZmZzZXRIb3VyIDwgMCA/ICcrJyA6ICctJztcbiAgICAgICAgcmV0dXJuIGAke3NpZ259JHsoLSR0aGlzLnRpbWVab25lT2Zmc2V0SG91cikudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfTowMGA7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmZvcm1hdCwgJ1paJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5aLnJlcGxhY2UoJzonLCAnJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCDns7vliJfmlrnms5XjgILkvb/nlKggeWVhcuOAgW1vbnRoIOetieaWsOWinuWxnuaAp+iOt+WPluWNs+WPr++8jOeugOWMluWGmeazle+8jOaXoOmcgOmineWkluWumuWItlxuICAgKi9cbiAgLy8gZ2V0VGltZSDml6DpnIDlrprliLZcbiAgLy8gZ2V0VGltZXpvbmVPZmZzZXQg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gZ2V0WWVhciDml6DpnIDlrprliLZcbiAgLy8gZ2V0RnVsbFllYXIg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldE1vbnRoIOaXoOmcgOWumuWItlxuICAvLyBnZXREYXRlIOaXoOmcgOWumuWItlxuICAvLyBnZXREYXkg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldEhvdXJzIOaXoOmcgOWumuWItlxuICAvLyBnZXRNaW51dGVzIOaXoOmcgOWumuWItlxuICAvLyBnZXRTZWNvbmRzIOaXoOmcgOWumuWItlxuICAvLyBnZXRNaWxsaXNlY29uZHMg5peg6ZyA5a6a5Yi2XG5cbiAgLy8gZ2V0VVRDRnVsbFllYXIg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ01vbnRoIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENEYXRlIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENEYXkg5peg6ZyA5a6a5Yi2XG4gIC8vIGdldFVUQ0hvdXJzIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENNaW51dGVzIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENTZWNvbmRzIOaXoOmcgOWumuWItlxuICAvLyBnZXRVVENNaWxsaXNlY29uZHMg5peg6ZyA5a6a5Yi2XG5cbiAgLyoqXG4gICAqIHNldCDns7vliJfmlrnms5XjgILlrprliLbmiJDov5Tlm54gdGhpcyDkvr/kuo7pk77lvI/mk43kvZxcbiAgICovXG4gIHNldFRpbWUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VGltZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0WWVhcigpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRZZWFyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0RnVsbFllYXIoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0RnVsbFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRNb250aCgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRNb250aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldERhdGUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0RGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldEhvdXJzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldEhvdXJzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0TWludXRlcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRNaW51dGVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0U2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRTZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0TWlsbGlzZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldE1pbGxpc2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0VVRDRnVsbFllYXIoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDRnVsbFllYXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBzZXRVVENNb250aCgpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENNb250aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ0RhdGUoKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUuc2V0VVRDRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHNldFVUQ0hvdXJzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ0hvdXJzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDTWludXRlcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENNaW51dGVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDU2Vjb25kcygpIHtcbiAgICBEYXRlLnByb3RvdHlwZS5zZXRVVENTZWNvbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgc2V0VVRDTWlsbGlzZWNvbmRzKCkge1xuICAgIERhdGUucHJvdG90eXBlLnNldFVUQ01pbGxpc2Vjb25kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gKOWumuWItuaWueazlSlcbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cbiAgLy8gKOaWsOWinuaWueazlSlcbiAgdG9OdW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGltZSgpO1xuICB9XG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvU3RyaW5nKGZvcm1hdCA9ICdZWVlZLU1NLUREIGhoOm1tOnNzJykge1xuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZUFsbCh0aGlzLmNvbnN0cnVjdG9yLlJFR0VYX0ZPUk1BVCwgKG1hdGNoLCAkMSkgPT4ge1xuICAgICAgLy8gW10g6YeM6Z2i55qE5YaF5a655Y6f5qC36L6T5Ye6XG4gICAgICBpZiAoJDEpIHtcbiAgICAgICAgcmV0dXJuICQxO1xuICAgICAgfVxuICAgICAgLy8g5qC85byPXG4gICAgICBpZiAobWF0Y2ggaW4gdGhpcy5mb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0W21hdGNoXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b0RhdGVTdHJpbmcoZm9ybWF0ID0gJ1lZWVktTU0tREQnKSB7XG4gICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoZm9ybWF0KTtcbiAgfVxuICAvLyAo5a6a5Yi25pa55rOVKVxuICB0b1RpbWVTdHJpbmcoZm9ybWF0ID0gJ0hIOm1tOnNzJykge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKGZvcm1hdCk7XG4gIH1cbiAgLy8gdG9Mb2NhbGVTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vIHRvTG9jYWxlRGF0ZVN0cmluZyDml6DpnIDlrprliLZcbiAgLy8gdG9Mb2NhbGVUaW1lU3RyaW5nIOaXoOmcgOWumuWItlxuICAvLyB0b0lTT1N0cmluZyDml6DpnIDlrprliLZcbiAgLy8gdG9VVENTdHJpbmcg5peg6ZyA5a6a5Yi2XG4gIC8vIHRvR01UU3RyaW5nIOaXoOmcgOWumuWItlxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b0Jvb2xlYW4oKSB7XG4gICAgcmV0dXJuICFpc05hTih0aGlzLmdldFRpbWUoKSk7XG4gIH1cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9KU09OKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cbiAgLy8gdmFsdWVPZiDml6DpnIDlrprliLZcbn1cbiIsIi8vIOaVsOWtpui/kOeul+OAguWvuSBNYXRoIOWvueixoeaJqeWxle+8jOaPkOS+m+abtOebtOinguWSjOespuWQiOaVsOWtpue6puWumueahOWQjeensFxuZXhwb3J0IGNvbnN0IF9NYXRoID0gT2JqZWN0LmNyZWF0ZShNYXRoKTtcblxuX01hdGguYXJjc2luID0gTWF0aC5hc2luLmJpbmQoTWF0aCk7XG5fTWF0aC5hcmNjb3MgPSBNYXRoLmFjb3MuYmluZChNYXRoKTtcbl9NYXRoLmFyY3RhbiA9IE1hdGguYXRhbi5iaW5kKE1hdGgpO1xuX01hdGguYXJzaW5oID0gTWF0aC5hc2luaC5iaW5kKE1hdGgpO1xuX01hdGguYXJjb3NoID0gTWF0aC5hY29zaC5iaW5kKE1hdGgpO1xuX01hdGguYXJ0YW5oID0gTWF0aC5hdGFuaC5iaW5kKE1hdGgpO1xuX01hdGgubG9nZSA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG5fTWF0aC5sbiA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG5fTWF0aC5sZyA9IE1hdGgubG9nMTAuYmluZChNYXRoKTtcbl9NYXRoLmxvZyA9IGZ1bmN0aW9uKGEsIHgpIHtcbiAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coYSk7XG59O1xuIiwiZXhwb3J0IGNsYXNzIF9OdW1iZXIgZXh0ZW5kcyBOdW1iZXIge1xufVxuIiwiZXhwb3J0IGNvbnN0IF9SZWZsZWN0ID0gT2JqZWN0LmNyZWF0ZShSZWZsZWN0KTtcblxuLy8g5a+5IG93bktleXMg6YWN5aWXIG93blZhbHVlcyDlkowgb3duRW50cmllc1xuX1JlZmxlY3Qub3duVmFsdWVzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IHRhcmdldFtrZXldKTtcbn07XG5fUmVmbGVjdC5vd25FbnRyaWVzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IFtrZXksIHRhcmdldFtrZXldXSk7XG59O1xuIiwiLy8g5pWw5o2u5aSE55CG77yM5aSE55CG5aSa5qC85byP5pWw5o2u55SoXG5leHBvcnQgY29uc3QgRGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4vKipcbiAqIOS8mOWMliB0eXBlb2ZcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMgeyd1bmRlZmluZWQnfCdvYmplY3QnfCdib29sZWFuJ3wnbnVtYmVyJ3wnc3RyaW5nJ3wnZnVuY3Rpb24nfCdzeW1ib2wnfCdiaWdpbnQnfHN0cmluZ31cbiAqL1xuRGF0YS50eXBlb2YgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIHJldHVybiB0eXBlb2YgdmFsdWU7XG59O1xuLyoqXG4gKiDliKTmlq3nroDljZXnsbvlnotcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbkRhdGEuaXNTaW1wbGVUeXBlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIFsnbnVsbCcsICd1bmRlZmluZWQnLCAnbnVtYmVyJywgJ3N0cmluZycsICdib29sZWFuJywgJ2JpZ2ludCcsICdzeW1ib2wnXS5pbmNsdWRlcyh0aGlzLnR5cGVvZih2YWx1ZSkpO1xufTtcbi8qKlxuICog5piv5ZCm5pmu6YCa5a+56LGhXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5EYXRhLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufTtcbi8qKlxuICog6I635Y+W5YC855qE5YW35L2T57G75Z6LXG4gKiBAcGFyYW0gdmFsdWUg5YC8XG4gKiBAcmV0dXJucyB7T2JqZWN0Q29uc3RydWN0b3J8KnxGdW5jdGlvbn0g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWw44CCbnVsbOOAgXVuZGVmaW5lZCDljp/moLfov5Tlm55cbiAqL1xuRGF0YS5nZXRFeGFjdFR5cGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gIC8vIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoeaXtiBfX3Byb3RvX18g5Li6IG51bGxcbiAgY29uc3QgaXNPYmplY3RCeUNyZWF0ZU51bGwgPSBfX3Byb3RvX18gPT09IG51bGw7XG4gIGlmIChpc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgIHJldHVybiBPYmplY3Q7XG4gIH1cbiAgLy8g5a+55bqU57un5om/55qE5a+56LGhIF9fcHJvdG9fXyDmsqHmnIkgY29uc3RydWN0b3Ig5bGe5oCnXG4gIGNvbnN0IGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9ICEoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pO1xuICBpZiAoaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgIHJldHVybiBPYmplY3Q7XG4gIH1cbiAgLy8g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWwXG4gIHJldHVybiBfX3Byb3RvX18uY29uc3RydWN0b3I7XG59O1xuLyoqXG4gKiDojrflj5blgLznmoTlhbfkvZPnsbvlnovliJfooahcbiAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAqIEByZXR1cm5zIHsqW119IOe7n+S4gOi/lOWbnuaVsOe7hOOAgm51bGzjgIF1bmRlZmluZWQg5a+55bqU5Li6IFtudWxsXSxbdW5kZWZpbmVkXVxuICovXG5EYXRhLmdldEV4YWN0VHlwZXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWIpOaWreWkhOeQhlxuICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgcmV0dXJuIFt2YWx1ZV07XG4gIH1cbiAgLy8g5omr5Y6f5Z6L6ZO+5b6X5Yiw5a+55bqU5p6E6YCg5Ye95pWwXG4gIGxldCByZXN1bHQgPSBbXTtcbiAgbGV0IGxvb3AgPSAwO1xuICBsZXQgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IGZhbHNlO1xuICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ3doaWxlJywgbG9vcCwgX19wcm90b19fKTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICAvLyDkuIDov5vmnaUgX19wcm90b19fIOWwseaYryBudWxsIOivtOaYjiB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaFcbiAgICAgIGlmIChsb29wIDw9IDApIHtcbiAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXykge1xuICAgICAgcmVzdWx0LnB1c2goX19wcm90b19fLmNvbnN0cnVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgIGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSB0cnVlO1xuICAgIH1cbiAgICBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX19wcm90b19fKTtcbiAgICBsb29wKys7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICog5rex5ou36LSd5pWw5o2uXG4gKiBAcGFyYW0gc291cmNlXG4gKiBAcmV0dXJucyB7TWFwPGFueSwgYW55PnxTZXQ8YW55Pnx7fXwqfCpbXX1cbiAqL1xuRGF0YS5kZWVwQ2xvbmUgPSBmdW5jdGlvbihzb3VyY2UpIHtcbiAgLy8g5pWw57uEXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHNvdXJjZS52YWx1ZXMoKSkge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBTZXRcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIFNldCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICByZXN1bHQuYWRkKHRoaXMuZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gTWFwXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBNYXApIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IE1hcCgpO1xuICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBzb3VyY2UuZW50cmllcygpKSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgdGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlr7nosaFcbiAgaWYgKHRoaXMuZ2V0RXhhY3RUeXBlKHNvdXJjZSkgPT09IE9iamVjdCkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgIC8vIHZhbHVl5pa55byP77ya6YCS5b2S5aSE55CGXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwge1xuICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcENsb25lKGRlc2MudmFsdWUpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGdldC9zZXQg5pa55byP77ya55u05o6l5a6a5LmJXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g5YW25LuW77ya5Y6f5qC36L+U5ZueXG4gIHJldHVybiBzb3VyY2U7XG59O1xuLyoqXG4gKiDmt7Hop6PljIXmlbDmja5cbiAqIEBwYXJhbSBkYXRhIOWAvFxuICogQHBhcmFtIGlzV3JhcCDljIXoo4XmlbDmja7liKTmlq3lh73mlbDvvIzlpoIgdnVlMyDnmoQgaXNSZWYg5Ye95pWwXG4gKiBAcGFyYW0gdW53cmFwIOino+WMheaWueW8j+WHveaVsO+8jOWmgiB2dWUzIOeahCB1bnJlZiDlh73mlbBcbiAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiBhbnl9fXwqfCgqfHtbcDogc3RyaW5nXTogYW55fSlbXXx7W3A6IHN0cmluZ106IGFueX19XG4gKi9cbkRhdGEuZGVlcFVud3JhcCA9IGZ1bmN0aW9uKGRhdGEsIHsgaXNXcmFwID0gKCkgPT4gZmFsc2UsIHVud3JhcCA9IHZhbCA9PiB2YWwgfSA9IHt9KSB7XG4gIC8vIOmAiemhueaUtumbhlxuICBjb25zdCBvcHRpb25zID0geyBpc1dyYXAsIHVud3JhcCB9O1xuICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gIGlmIChpc1dyYXAoZGF0YSkpIHtcbiAgICByZXR1cm4gdGhpcy5kZWVwVW53cmFwKHVud3JhcChkYXRhKSwgb3B0aW9ucyk7XG4gIH1cbiAgLy8g6YCS5b2S5aSE55CG55qE57G75Z6LXG4gIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAodmFsID0+IHRoaXMuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpKTtcbiAgfVxuICBpZiAodGhpcy5nZXRFeGFjdFR5cGUoZGF0YSkgPT09IE9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICByZXR1cm4gW2tleSwgdGhpcy5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucyldO1xuICAgIH0pKTtcbiAgfVxuICAvLyDlhbbku5bljp/moLfov5Tlm55cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiLy8g6L6F5YqpXG5leHBvcnQgY29uc3QgU3VwcG9ydCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICog5bGe5oCn5ZCN57uf5LiA5oiQ5pWw57uE5qC85byPXG4gKiBAcGFyYW0gbmFtZXMg5bGe5oCn5ZCN44CC5qC85byPICdhLGIsYycg5oiWIFsnYScsJ2InLCdjJ11cbiAqIEBwYXJhbSBzZXBhcmF0b3IgbmFtZXMg5Li65a2X56ym5Liy5pe255qE5ouG5YiG6KeE5YiZ44CC5ZCMIHNwbGl0IOaWueazleeahCBzZXBhcmF0b3LvvIzlrZfnrKbkuLLml6DpnIDmi4bliIbnmoTlj6/ku6XkvKAgbnVsbCDmiJYgdW5kZWZpbmVkXG4gKiBAcmV0dXJucyB7KltdW118KE1hZ2ljU3RyaW5nIHwgQnVuZGxlIHwgc3RyaW5nKVtdfEZsYXRBcnJheTwoRmxhdEFycmF5PCgqfFsqW11dfFtdKVtdLCAxPltdfCp8WypbXV18W10pW10sIDE+W118KltdfVxuICovXG5TdXBwb3J0Lm5hbWVzVG9BcnJheSA9IGZ1bmN0aW9uKG5hbWVzID0gW10sIHsgc2VwYXJhdG9yID0gJywnIH0gPSB7fSkge1xuICBpZiAobmFtZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBuYW1lcy5tYXAodmFsID0+IHRoaXMubmFtZXNUb0FycmF5KHZhbCkpLmZsYXQoKTtcbiAgfVxuICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBuYW1lcy5zcGxpdChzZXBhcmF0b3IpLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICB9XG4gIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzeW1ib2wnKSB7XG4gICAgcmV0dXJuIFtuYW1lc107XG4gIH1cbiAgcmV0dXJuIFtdO1xufTtcblxuLyoqXG4gKiDnu5Hlrpp0aGlz44CC5bi455So5LqO6Kej5p6E5Ye95pWw5pe257uR5a6aIHRoaXMg6YG/5YWN5oql6ZSZXG4gKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuU3VwcG9ydC5iaW5kVGhpcyA9IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBuZXcgUHJveHkodGFyZ2V0LCB7XG4gICAgZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQoLi4uYXJndW1lbnRzKTtcbiAgICAgIC8vIOWHveaVsOexu+Wei+e7keWumnRoaXNcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blsZ7mgKfljp/moLfov5Tlm55cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICB9KTtcbn07XG4iLCIvLyDlr7nosaFcbmltcG9ydCB7IF9SZWZsZWN0IH0gZnJvbSAnLi9fUmVmbGVjdCc7XG5pbXBvcnQgeyBEYXRhIH0gZnJvbSAnLi9EYXRhJztcbmltcG9ydCB7IFN1cHBvcnQgfSBmcm9tICcuL1N1cHBvcnQnO1xuXG4vLyBleHRlbmRzIE9iamVjdCDmlrnlvI/osIPnlKggc3VwZXIg5bCG55Sf5oiQ56m65a+56LGh77yM5LiN5Lya5YOP5pmu6YCa5p6E6YCg5Ye95pWw6YKj5qC35Yib5bu65LiA5Liq5paw55qE5a+56LGh77yM5pS55a6e546wXG5leHBvcnQgY2xhc3MgX09iamVjdCB7XG4gIC8qKlxuICAgKiBzdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBjcmVhdGUg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBmcm9tRW50cmllcyDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGlzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZ2V0UHJvdG90eXBlT2Yg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBzZXRQcm90b3R5cGVPZiDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGhhc093biDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGRlZmluZVByb3BlcnR5IOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZGVmaW5lUHJvcGVydGllcyDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5RGVzY3JpcHRvciDml6DpnIDlrprliLZcbiAgLy8gc3RhdGljIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBnZXRPd25Qcm9wZXJ0eU5hbWVzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZ2V0T3duUHJvcGVydHlTeW1ib2xzIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgcHJldmVudEV4dGVuc2lvbnMg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBzZWFsIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgZnJlZXplIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgaXNFeHRlbnNpYmxlIOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgaXNTZWFsZWQg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBpc0Zyb3plbiDml6DpnIDlrprliLZcblxuICAvKipcbiAgICogKOWumuWItuaWueazlSkg5rWF5ZCI5bm25a+56LGh44CC5YaZ5rOV5ZCMIE9iamVjdC5hc3NpZ27vvIzpgJrov4fph43lrprkuYnmlrnlvI/lkIjlubbvvIzop6PlhrMgT2JqZWN0LmFzc2lnbiDlkIjlubbkuKTovrnlkIzlkI3lsZ7mgKfmt7fmnIkgdmFsdWXlhpnms5Ug5ZKMIGdldC9zZXTlhpnms5Ug5pe25oqlIFR5cGVFcnJvcjogQ2Fubm90IHNldCBwcm9wZXJ0eSBiIG9mICM8T2JqZWN0PiB3aGljaCBoYXMgb25seSBhIGdldHRlciDnmoTpl67pophcbiAgICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaFcbiAgICogQHBhcmFtIHNvdXJjZXMg5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBhc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICAvLyDkuI3kvb/nlKggdGFyZ2V0W2tleV0gPSB2YWx1ZSDlhpnms5XvvIznm7TmjqXkvb/nlKggT2JqZWN0LmRlZmluZVByb3BlcnR5IOmHjeWumuS5iVxuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOa3seWQiOW5tuWvueixoeOAguWQjCBhc3NpZ24g5LiA5qC35Lmf5Lya5a+55bGe5oCn6L+b6KGM6YeN5a6a5LmJXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGh44CC6buY6K6k5YC8IHt9IOmYsuatoumAkuW9kuaXtuaKpSBUeXBlRXJyb3I6IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdFxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGRlZXBBc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAvLyB2YWx1ZSDlhpnms5XvvJrlr7nosaHpgJLlvZLlpITnkIbvvIzlhbbku5bnm7TmjqXlrprkuYlcbiAgICAgICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGRlc2MudmFsdWUpKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcEFzc2lnbih0YXJnZXRba2V5XSwgZGVzYy52YWx1ZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0L3NldCDlhpnms5XvvJrnm7TmjqXlrprkuYlcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6I635Y+W5bGe5oCn5ZCN44CC6buY6K6k5Y+C5pWw6YWN572u5oiQ5ZCMIE9iamVjdC5rZXlzIOihjOS4ulxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7YW55W119XG4gICAqL1xuICBzdGF0aWMga2V5cyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICAvLyBzZXTnlKjkuo5rZXnljrvph41cbiAgICBsZXQgc2V0ID0gbmV3IFNldCgpO1xuICAgIC8vIOiHqui6q+WxnuaAp+etm+mAiVxuICAgIGNvbnN0IGRlc2NzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqZWN0KTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIF9SZWZsZWN0Lm93bkVudHJpZXMoZGVzY3MpKSB7XG4gICAgICAvLyDlv73nlaVzeW1ib2zlsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghc3ltYm9sICYmIHR5cGVvZiBrZXkgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5b+955Wl5LiN5Y+v5YiX5Li+5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIW5vdEVudW1lcmFibGUgJiYgIWRlc2MuZW51bWVyYWJsZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWxnuaAp+WKoOWFpVxuICAgICAgc2V0LmFkZChrZXkpO1xuICAgIH1cbiAgICAvLyDnu6fmib/lsZ7mgKdcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICAgIGlmIChfX3Byb3RvX18gIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgcGFyZW50S2V5cyA9IHRoaXMua2V5cyhfX3Byb3RvX18sIG9wdGlvbnMpO1xuICAgICAgICBmb3IgKGNvbnN0IHBhcmVudEtleSBvZiBwYXJlbnRLZXlzKSB7XG4gICAgICAgICAgc2V0LmFkZChwYXJlbnRLZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIOi/lOWbnuaVsOe7hFxuICAgIHJldHVybiBBcnJheS5mcm9tKHNldCk7XG4gIH1cblxuICAvKipcbiAgICogKOWumuWItuaWueazlSlcbiAgICovXG4gIHN0YXRpYyB2YWx1ZXMoKSB7XG4gIH1cblxuICAvKipcbiAgICogKOWumuWItuaWueazlSlcbiAgICovXG4gIHN0YXRpYyBlbnRyaWVzKCkge1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIGtleeiHqui6q+aJgOWxnueahOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5IOWxnuaAp+WQjVxuICAgKiBAcmV0dXJucyB7KnxudWxsfVxuICAgKi9cbiAgc3RhdGljIG93bmVyKG9iamVjdCwga2V5KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3duZXIoX19wcm90b19fLCBrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqICjmlrDlop7mlrnms5UpIOiOt+WPluWxnuaAp+aPj+i/sOWvueixoe+8jOebuOavlCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9y77yM6IO95ou/5Yiw57un5om/5bGe5oCn55qE5o+P6L+w5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3RcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfFByb3BlcnR5RGVzY3JpcHRvcn1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9yKG9iamVjdCwga2V5KSB7XG4gICAgY29uc3QgZmluZE9iamVjdCA9IHRoaXMub3duZXIob2JqZWN0LCBrZXkpO1xuICAgIGlmICghZmluZE9iamVjdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZmluZE9iamVjdCwga2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvcnPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMgeyhQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkKVtdfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3JzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IF9rZXlzID0gdGhpcy5rZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9rZXlzLm1hcChrZXkgPT4gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KSk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3JFbnRyaWVz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHtbKiwoUHJvcGVydHlEZXNjcmlwdG9yfHVuZGVmaW5lZCldW119XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvckVudHJpZXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3QgX2tleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gX2tleXMubWFwKGtleSA9PiBba2V5LCB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpXSk7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6L+H5ruk5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBwaWNrIOaMkemAieWxnuaAp1xuICAgKiBAcGFyYW0gb21pdCDlv73nlaXlsZ7mgKdcbiAgICogQHBhcmFtIGVtcHR5UGljayBwaWNrIOS4uuepuuaXtueahOWPluWAvOOAgmFsbCDlhajpg6hrZXnvvIxlbXB0eSDnqbpcbiAgICogQHBhcmFtIHNlcGFyYXRvciDlkIwgbmFtZXNUb0FycmF5IOeahCBzZXBhcmF0b3Ig5Y+C5pWwXG4gICAqIEBwYXJhbSBzeW1ib2wg5ZCMIGtleXMg55qEIHN5bWJvbCDlj4LmlbBcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5ZCMIGtleXMg55qEIG5vdEVudW1lcmFibGUg5Y+C5pWwXG4gICAqIEBwYXJhbSBleHRlbmQg5ZCMIGtleXMg55qEIGV4dGVuZCDlj4LmlbBcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGZpbHRlcihvYmplY3QsIHsgcGljayA9IFtdLCBvbWl0ID0gW10sIGVtcHR5UGljayA9ICdhbGwnLCBzZXBhcmF0b3IgPSAnLCcsIHN5bWJvbCA9IHRydWUsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgLy8gcGlja+OAgW9taXQg57uf5LiA5oiQ5pWw57uE5qC85byPXG4gICAgcGljayA9IFN1cHBvcnQubmFtZXNUb0FycmF5KHBpY2ssIHsgc2VwYXJhdG9yIH0pO1xuICAgIG9taXQgPSBTdXBwb3J0Lm5hbWVzVG9BcnJheShvbWl0LCB7IHNlcGFyYXRvciB9KTtcbiAgICBsZXQgX2tleXMgPSBbXTtcbiAgICAvLyBwaWNr5pyJ5YC855u05o6l5ou/77yM5Li656m65pe25qC55o2uIGVtcHR5UGljayDpu5jorqTmi7/nqbrmiJblhajpg6hrZXlcbiAgICBfa2V5cyA9IHBpY2subGVuZ3RoID4gMCB8fCBlbXB0eVBpY2sgPT09ICdlbXB0eScgPyBwaWNrIDogdGhpcy5rZXlzKG9iamVjdCwgeyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9KTtcbiAgICAvLyBvbWl0562b6YCJXG4gICAgX2tleXMgPSBfa2V5cy5maWx0ZXIoa2V5ID0+ICFvbWl0LmluY2x1ZGVzKGtleSkpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIF9rZXlzKSB7XG4gICAgICBjb25zdCBkZXNjID0gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KTtcbiAgICAgIC8vIOWxnuaAp+S4jeWtmOWcqOWvvOiHtGRlc2PlvpfliLB1bmRlZmluZWTml7bkuI3orr7nva7lgLxcbiAgICAgIGlmIChkZXNjKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6YCa6L+H5oyR6YCJ5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVyIOeahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIHBpY2sob2JqZWN0LCBrZXlzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihvYmplY3QsIHsgcGljazoga2V5cywgZW1wdHlQaWNrOiAnZW1wdHknLCAuLi5vcHRpb25zIH0pO1xuICB9XG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDpgJrov4fmjpLpmaTmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXIg55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgb21pdChvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBvbWl0OiBrZXlzLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSA9IHt9KSB7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5hc3NpZ24odGhpcywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOi9rOaNouezu+WIl+aWueazle+8mui9rOaNouaIkOWOn+Wni+WAvOWSjOWFtuS7luexu+Wei1xuICAgKi9cbiAgLy8gKOWumuWItuaWueazlSlcbiAgW1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICAvLyAo5paw5aKe5pa55rOVKVxuICB0b051bWJlcigpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG5cbiAgLy8gKOWumuWItuaWueazlSlcbiAgdG9TdHJpbmcoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe30pO1xuICAgIH1cbiAgfVxuXG4gIC8vICjmlrDlop7mlrnms5UpXG4gIHRvQm9vbGVhbigpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcykubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8vICjlrprliLbmlrnms5UpXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuT2JqZWN0LnNldFByb3RvdHlwZU9mKF9PYmplY3QsIE9iamVjdCk7XG4iLCJleHBvcnQgY2xhc3MgX1N0cmluZyBleHRlbmRzIFN0cmluZyB7XG4gIC8qKlxuICAgKiBTdGF0aWNcbiAgICovXG4gIC8vIHN0YXRpYyBmcm9tQ2hhckNvZGUg5peg6ZyA5a6a5Yi2XG4gIC8vIHN0YXRpYyBmcm9tQ29kZVBvaW50IOaXoOmcgOWumuWItlxuICAvLyBzdGF0aWMgcmF3IOaXoOmcgOWumuWItlxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDpppblrZfmr43lpKflhplcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0ZpcnN0VXBwZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9VcHBlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiAo5paw5aKe5pa55rOVKSDpppblrZfmr43lsI/lhplcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9GaXJzdExvd2VyQ2FzZShuYW1lID0gJycpIHtcbiAgICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvTG93ZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6L2s6am85bOw5ZG95ZCN44CC5bi455So5LqO6L+e5o6l56ym5ZG95ZCN6L2s6am85bOw5ZG95ZCN77yM5aaCIHh4LW5hbWUgLT4geHhOYW1lXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOi/nuaOpeespuOAgueUqOS6jueUn+aIkOato+WImSDpu5jorqTkuLrkuK3liJLnur8gLSDlr7nlupRyZWdleHDlvpfliLAgLy0oXFx3KS9nXG4gICAqIEBwYXJhbSBmaXJzdCDpppblrZfmr43lpITnkIbmlrnlvI/jgIJ0cnVlIOaIliAndXBwZXJjYXNlJ++8mui9rOaNouaIkOWkp+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSDmiJYgJ2xvd2VyY2FzZSfvvJrovazmjaLmiJDlsI/lhpk7XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Jhdycg5oiWIOWFtuS7luaXoOaViOWAvO+8mum7mOiupOWOn+agt+i/lOWbnu+8jOS4jei/m+ihjOWkhOeQhjtcbiAgICogQHJldHVybnMge01hZ2ljU3RyaW5nfHN0cmluZ3xzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9DYW1lbENhc2UobmFtZSwgeyBzZXBhcmF0b3IgPSAnLScsIGZpcnN0ID0gJ3JhdycgfSA9IHt9KSB7XG4gICAgLy8g55Sf5oiQ5q2j5YiZXG4gICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cChgJHtzZXBhcmF0b3J9KFxcXFx3KWAsICdnJyk7XG4gICAgLy8g5ou85o6l5oiQ6am85bOwXG4gICAgY29uc3QgY2FtZWxOYW1lID0gbmFtZS5yZXBsYWNlQWxsKHJlZ2V4cCwgKHN1YnN0ciwgJDEpID0+IHtcbiAgICAgIHJldHVybiAkMS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICAgIC8vIOmmluWtl+avjeWkp+Wwj+WGmeagueaNruS8oOWPguWIpOaWrVxuICAgIGlmIChbdHJ1ZSwgJ3VwcGVyY2FzZSddLmluY2x1ZGVzKGZpcnN0KSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9GaXJzdFVwcGVyQ2FzZShjYW1lbE5hbWUpO1xuICAgIH1cbiAgICBpZiAoW2ZhbHNlLCAnbG93ZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0ZpcnN0TG93ZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBjYW1lbE5hbWU7XG4gIH1cblxuICAvKipcbiAgICogKOaWsOWinuaWueazlSkg6L2s6L+e5o6l56ym5ZG95ZCN44CC5bi455So5LqO6am85bOw5ZG95ZCN6L2s6L+e5o6l56ym5ZG95ZCN77yM5aaCIHh4TmFtZSAtPiB4eC1uYW1lXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOi/nuaOpeesplxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvTGluZUNhc2UobmFtZSA9ICcnLCB7IHNlcGFyYXRvciA9ICctJyB9ID0ge30pIHtcbiAgICByZXR1cm4gbmFtZVxuICAgIC8vIOaMiei/nuaOpeespuaLvOaOpVxuICAgICAgLnJlcGxhY2VBbGwoLyhbYS16XSkoW0EtWl0pL2csIGAkMSR7c2VwYXJhdG9yfSQyYClcbiAgICAvLyDovazlsI/lhplcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICB9XG59XG4iLCIvLyDmoLflvI/lpITnkIZcbmV4cG9ydCBjb25zdCBTdHlsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICog5Y2V5L2N5a2X56ym5Liy44CC5a+55pWw5a2X5oiW5pWw5a2X5qC85byP55qE5a2X56ym5Liy6Ieq5Yqo5ou85Y2V5L2N77yM5YW25LuW5a2X56ym5Liy5Y6f5qC36L+U5ZueXG4gKiBAcGFyYW0gdmFsdWUg5YC8XG4gKiBAcGFyYW0gdW5pdCDljZXkvY3jgIJ2YWx1ZeayoeW4puWNleS9jeaXtuiHquWKqOaLvOaOpe+8jOWPr+S8oCBweC9lbS8lIOetiVxuICogQHJldHVybnMge3N0cmluZ3xzdHJpbmd9XG4gKi9cblN0eWxlLmdldFVuaXRTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSA9ICcnLCB7IHVuaXQgPSAncHgnIH0gPSB7fSkge1xuICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIC8vIOazqOaEj++8mui/memHjOS9v+eUqCA9PSDliKTmlq3vvIzkuI3kvb/nlKggPT09XG4gIHJldHVybiBOdW1iZXIodmFsdWUpID09IHZhbHVlID8gYCR7dmFsdWV9JHt1bml0fWAgOiBTdHJpbmcodmFsdWUpO1xufTtcbiIsIi8vIHZ1ZSDmlbDmja7lpITnkIZcbmltcG9ydCB7IF9TdHJpbmcgfSBmcm9tICcuL19TdHJpbmcnO1xuaW1wb3J0IHsgRGF0YSB9IGZyb20gJy4vRGF0YSc7XG5cbmV4cG9ydCBjb25zdCBWdWVEYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuLyoqXG4gICAqIOa3seino+WMhSB2dWUzIOWTjeW6lOW8j+WvueixoeaVsOaNrlxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcmV0dXJucyB7e1twOiBzdHJpbmddOiAqfHtbcDogc3RyaW5nXTogKn19fCp8KCp8e1twOiBzdHJpbmddOiAqfSlbXXx7W3A6IHN0cmluZ106ICp9fVxuICAgKi9cblZ1ZURhdGEuZGVlcFVud3JhcFZ1ZTMgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHJldHVybiBEYXRhLmRlZXBVbndyYXAoZGF0YSwge1xuICAgIGlzV3JhcDogZGF0YSA9PiBkYXRhPy5fX3ZfaXNSZWYsXG4gICAgdW53cmFwOiBkYXRhID0+IGRhdGEudmFsdWUsXG4gIH0pO1xufTtcblxuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgcHJvcHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIHByb3BEZWZpbml0aW9ucyBwcm9wcyDlrprkuYnvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldFByb3BzRnJvbUF0dHJzID0gZnVuY3Rpb24oYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAvLyBwcm9wcyDlrprkuYnnu5/kuIDmiJDlr7nosaHmoLzlvI/vvIx0eXBlIOe7n+S4gOaIkOaVsOe7hOagvOW8j+S7peS+v+WQjue7reWIpOaWrVxuICBpZiAocHJvcERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCB7IHR5cGU6IFtdIH1dKSk7XG4gIH0gZWxzZSBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KHByb3BEZWZpbml0aW9ucykpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKS5tYXAoKFtuYW1lLCBkZWZpbml0aW9uXSkgPT4ge1xuICAgICAgZGVmaW5pdGlvbiA9IERhdGEuaXNQbGFpbk9iamVjdChkZWZpbml0aW9uKVxuICAgICAgICA/IHsgLi4uZGVmaW5pdGlvbiwgdHlwZTogW2RlZmluaXRpb24udHlwZV0uZmxhdCgpIH1cbiAgICAgICAgOiB7IHR5cGU6IFtkZWZpbml0aW9uXS5mbGF0KCkgfTtcbiAgICAgIHJldHVybiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgZGVmaW5pdGlvbl07XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IHt9O1xuICB9XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgLy8gcHJvcE5hbWUg5oiWIHByb3AtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSBfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpO1xuICAgICAgICAvLyDlj6rljIXlkKtCb29sZWFu57G75Z6L55qEJyfovazmjaLkuLp0cnVl77yM5YW25LuW5Y6f5qC36LWL5YC8XG4gICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gZGVmaW5pdGlvbi50eXBlLmxlbmd0aCA9PT0gMSAmJiBkZWZpbml0aW9uLnR5cGUuaW5jbHVkZXMoQm9vbGVhbikgJiYgYXR0clZhbHVlID09PSAnJyA/IHRydWUgOiBhdHRyVmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIHByb3AtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2V0UmVzdWx0KHsgbmFtZTogX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpLCBkZWZpbml0aW9uLCBlbmQ6IHRydWUgfSk7XG4gICAgfSkoe1xuICAgICAgbmFtZSwgZGVmaW5pdGlvbixcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgZW1pdHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIGVtaXREZWZpbml0aW9ucyBlbWl0cyDlrprkuYnvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldEVtaXRzRnJvbUF0dHJzID0gZnVuY3Rpb24oYXR0cnMsIGVtaXREZWZpbml0aW9ucykge1xuICAvLyBlbWl0cyDlrprkuYnnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChlbWl0RGVmaW5pdGlvbnMpKSB7XG4gICAgZW1pdERlZmluaXRpb25zID0gT2JqZWN0LmtleXMoZW1pdERlZmluaXRpb25zKTtcbiAgfSBlbHNlIGlmICghKGVtaXREZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIGVtaXREZWZpbml0aW9ucyA9IFtdO1xuICB9XG4gIC8vIOe7n+S4gOWkhOeQhuaIkCBvbkVtaXROYW1l44CBb25VcGRhdGU6ZW1pdE5hbWUodi1tb2RlbOezu+WIlykg5qC85byPXG4gIGNvbnN0IGVtaXROYW1lcyA9IGVtaXREZWZpbml0aW9ucy5tYXAobmFtZSA9PiBfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgKGZ1bmN0aW9uIHNldFJlc3VsdCh7IG5hbWUsIGVuZCA9IGZhbHNlIH0pIHtcbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uVXBkYXRlOicpKSB7XG4gICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2V0UmVzdWx0KHsgbmFtZTogYG9uVXBkYXRlOiR7X1N0cmluZy50b0xpbmVDYXNlKG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKSl9YCwgZW5kOiB0cnVlIH0pO1xuICAgICAgfVxuICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgcmVzdWx0W25hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICB9XG4gICAgfSkoeyBuYW1lIH0pO1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5bliankvZnlsZ7mgKfjgILluLjnlKjkuo7nu4Tku7YgaW5oZXJpdEF0dHJzIOiuvue9riBmYWxzZSDml7bkvb/nlKjkvZzkuLrmlrDnmoQgYXR0cnNcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcHMgcHJvcHMg5a6a5LmJIOaIliB2dWUgcHJvcHPvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqIEBwYXJhbSBlbWl0cyBlbWl0cyDlrprkuYkg5oiWIHZ1ZSBlbWl0c++8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogQHBhcmFtIGxpc3Qg6aKd5aSW55qE5pmu6YCa5bGe5oCnXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG5WdWVEYXRhLmdldFJlc3RGcm9tQXR0cnMgPSBmdW5jdGlvbihhdHRycywgeyBwcm9wcywgZW1pdHMsIGxpc3QgPSBbXSB9ID0ge30pIHtcbiAgLy8g57uf5LiA5oiQ5pWw57uE5qC85byPXG4gIHByb3BzID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSAoKCkgPT4ge1xuICAgICAgaWYgKHByb3BzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgfVxuICAgICAgaWYgKERhdGEuaXNQbGFpbk9iamVjdChwcm9wcykpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9KSgpO1xuICAgIHJldHVybiBhcnIubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgfSkoKTtcbiAgZW1pdHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAoZW1pdHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gZW1pdHM7XG4gICAgICB9XG4gICAgICBpZiAoRGF0YS5pc1BsYWluT2JqZWN0KGVtaXRzKSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZW1pdHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pKCk7XG4gICAgcmV0dXJuIGFyci5tYXAoKG5hbWUpID0+IHtcbiAgICAgIC8vIHVwZGF0ZTplbWl0TmFtZSDmiJYgdXBkYXRlOmVtaXQtbmFtZSDmoLzlvI9cbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ3VwZGF0ZTonKSkge1xuICAgICAgICBjb25zdCBwYXJ0TmFtZSA9IG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKTtcbiAgICAgICAgcmV0dXJuIFtgb25VcGRhdGU6JHtfU3RyaW5nLnRvQ2FtZWxDYXNlKHBhcnROYW1lKX1gLCBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UocGFydE5hbWUpfWBdO1xuICAgICAgfVxuICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCldO1xuICAgIH0pLmZsYXQoKTtcbiAgfSkoKTtcbiAgbGlzdCA9ICgoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gdHlwZW9mIGxpc3QgPT09ICdzdHJpbmcnXG4gICAgICA/IGxpc3Quc3BsaXQoJywnKVxuICAgICAgOiBsaXN0IGluc3RhbmNlb2YgQXJyYXkgPyBsaXN0IDogW107XG4gICAgcmV0dXJuIGFyci5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgfSkoKTtcbiAgY29uc3QgbGlzdEFsbCA9IEFycmF5LmZyb20obmV3IFNldChbcHJvcHMsIGVtaXRzLCBsaXN0XS5mbGF0KCkpKTtcbiAgLy8gY29uc29sZS5sb2coJ2xpc3RBbGwnLCBsaXN0QWxsKTtcbiAgLy8g6K6+572u5YC8XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBbbmFtZSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoYXR0cnMpKSkge1xuICAgIGlmICghbGlzdEFsbC5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgbmFtZSwgZGVzYyk7XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFFQTtBQUNPLE1BQU0sSUFBSSxTQUFTLEdBQUcsQ0FBQztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtB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VCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDaEQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDakQsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEdBQUc7QUFDWixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3BCLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyQyxNQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLEtBQUssRUFBRTtBQUN2QyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbEQsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNo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N0Y7QUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUN0RCxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFELEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8saUJBQWlCLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxhQUFhLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDbkc7QUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUN0RCxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsU0FBUyxHQUFHLEtBQUssRUFBRSxTQUFTLEdBQUcsR0FBRyxFQUFFLE1BQU0sR0FBRyxJQUFJLEVBQUUsYUFBYSxHQUFHLEtBQUssRUFB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
