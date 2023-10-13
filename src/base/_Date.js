// 日期时间
export class _Date {
  // 转换成字符串
  static stringify(value, options = {}) {
    if (!this.isValidValue(value)) {
      return '';
    }
    const date = new this(value);
    const { year, month, day, hour, minute, second } = {
      year: date.year,
      ...Object.fromEntries(['month', 'day', 'hour', 'minute', 'second'].map((name) => {
        return [name, date[name].toString().padStart(2, '0')];
      })),
    };
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  // 是否有效参数。常用于处理操作得到 Invalid Date 的情况
  static isValidValue(value, options = {}) {
    const date = new this(value);
    return !isNaN(date.value.getTime());
  }
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
    this.value = new Date(...args);
    Object.defineProperty(this, 'year', {
      get() {
        return this.value.getFullYear();
      },
    });
    Object.defineProperty(this, 'month', {
      get() {
        return this.value.getMonth() + 1;
      },
    });
    Object.defineProperty(this, 'day', {
      get() {
        return this.value.getDate();
      },
    });
    Object.defineProperty(this, 'hour', {
      get() {
        return this.value.getHours();
      },
    });
    Object.defineProperty(this, 'minute', {
      get() {
        return this.value.getMinutes();
      },
    });
    Object.defineProperty(this, 'second', {
      get() {
        return this.value.getSeconds();
      },
    });
    Object.defineProperty(this, 'week', {
      get() {
        return this.value.getDay();
      },
    });
  }
  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  // 原始值
  [Symbol.toPrimitive](hint) {
    // console.log('_Date [Symbol.toPrimitive]', { hint });
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
  toNumber(options = {}) {
    return this.value.getTime();
  }
  toString(options = {}) {
    return this.constructor.stringify(this.value, options);
  }
  // 转换成布尔值。if 等判断常用
  toBoolean(options = {}) {
    return this.constructor.isValidValue(this, options);
  }
  // 转换成 JSON。用于 JSON 对象转换，传参到后端接口常用
  toJSON(options = {}) {
    // console.log('toJSON', options);
    return this.toString();
  }
}
_Date.prototype[Symbol.toStringTag] = _Date.name;
