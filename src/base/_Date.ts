// @ts-nocheck
import { BaseEnv } from './base';

export class _Date extends Date {
  constructor(...args) {
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

    // 小程序环境实例原型修正
    if (BaseEnv.isWx && Object.getPrototypeOf(this) !== _Date.prototype) {
      Object.setPrototypeOf(this, _Date.prototype);
    }

    // 这里惰性求值，不使用如 this.year=xx 的静态方式
    Object.defineProperty(this, 'year', {
      get() {
        return this.getFullYear();
      },
    });
    Object.defineProperty(this, 'isLeapYear', {
      get() {
        return (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0;
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
    Object.defineProperty(this, 'microsecond', {
      get() {
        return this.getMilliseconds() * 1000;
      },
    });
    Object.defineProperty(this, 'timeZoneOffsetHour', {
      get() {
        return this.getTimezoneOffset() / 60;
      },
    });
  }

  // set 系列方法：定制成返回 this 便于链式操作
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

  // 转换系列方法：转换成原始值或其他类型
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
    return null;
  }
  toNumber() {
    return this.getTime();
  }
  toString(format = 'YYYY-MM-DD HH:mm:ss') {
    if (!this.toBoolean()) {
      return '';
    }
    // 格式化字符串用。总体同 element 用的 day.js 格式(https://day.js.org/docs/zh-CN/display/format)，风格定制成中文
    const $this = this;
    const formatMap = {
      get YY() {
        return `${$this.year}`.slice(-2);
      },
      get YYYY() {
        return `${$this.year}`;
      },
      get M() {
        return `${$this.month}`;
      },
      get MM() {
        return `${$this.month}`.padStart(2, '0');
      },
      get D() {
        return `${$this.day}`;
      },
      get DD() {
        return `${$this.day}`.padStart(2, '0');
      },
      get d() {
        return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][$this.week];
      },
      get dd() {
        return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][$this.week];
      },
      get H() {
        return `${$this.hour}`;
      },
      get HH() {
        return `${$this.hour}`.padStart(2, '0');
      },
      get h() {
        return `${$this.shortHour}`;
      },
      get hh() {
        return `${$this.shortHour}`.padStart(2, '0');
      },
      get m() {
        return `${$this.minute}`;
      },
      get mm() {
        return `${$this.minute}`.padStart(2, '0');
      },
      get s() {
        return `${$this.second}`;
      },
      get ss() {
        return `${$this.second}`.padStart(2, '0');
      },
      get SSS() {
        return `${$this.millisecond}`.padStart(3, '0');
      },
      get a() {
        return $this.hour < 12 ? '上午' : '下午';
      },
      get A() {
        return this.a;
      },
      get Z() {
        const sign = $this.timeZoneOffsetHour < 0 ? '+' : '-';
        return `${sign}${(-$this.timeZoneOffsetHour).toString().padStart(2, '0')}:00`;
      },
      get ZZ() {
        return this.Z.replace(':', '');
      },
    };
    const rule = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
    return format.replaceAll(rule, (match, $1) => {
      // [] 里面的内容原样输出
      if ($1) {
        return $1;
      }
      // 格式
      if (match in formatMap) {
        return formatMap[match];
      }
      return '';
    });
  }
  toBoolean() {
    return !Number.isNaN(this.getTime());
  }
  toJSON(options = {}) {
    return this.toString();
  }
  toDateString(format = 'YYYY-MM-DD') {
    return this.toString(format);
  }
  toTimeString(format = 'HH:mm:ss') {
    return this.toString(format);
  }
  toDate() {
    return new Date(this.getTime());
  }
  toCustomDate() {
    return new _Date(this);
  }
}

_Date.sleep = async function (seconds = 0.3) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};
