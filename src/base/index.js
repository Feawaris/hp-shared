// 基础模块

// 辅助
export class _Support {
  // js运行环境
  static JS_ENV = (function() {
    if (typeof window !== 'undefined' && globalThis === window) {
      return 'browser';
    }
    if (typeof global !== 'undefined' && globalThis === global) {
      return 'node';
    }
    return '';
  })();
  // 空函数
  static NOOP() {}
  // 返回 false
  static FALSE() {
    return false;
  }
  // 返回 true
  static TRUE() {
    return true;
  }
  // 原样返回
  static RAW(value) {
    return value;
  }
  // catch 内的错误原样抛出去
  static THROW(e) {
    throw e;
  }
  /**
   * 属性名统一成数组格式
   * @param names 属性名。格式 'a,b,c' 或 ['a','b','c']
   * @param separator names 为字符串时的拆分规则。同 split 方法的 separator，字符串无需拆分的可以传 null 或 undefined
   * @returns {*[][]|(MagicString | Bundle | string)[]|FlatArray<(FlatArray<(*|[*[]]|[])[], 1>[]|*|[*[]]|[])[], 1>[]|*[]}
   */
  static namesToArray(names = [], { separator = ',' } = {}) {
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
  }
}

/**
 * 定制对象。加 _ 跟同名原生对象区分
 */
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
    if (args.length === 1) {
      // 已经是 _Date 对象，直接传 Date 对象 value 进后面的 new Date
      if (args[0] instanceof this.constructor) {
        args[0] = args[0].value;
      }
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
    // console.log('[Symbol.toPrimitive]', { hint });
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
export class _Array {
  constructor(value = []) {
    this.value = value;
    // length 属性在下面 prototype 中定义 getter
  }
  // 方法定制：原型同名方法+新增方法。大部分返回 this 便于链式操作
  /**
   * 修改
   */
  push() {
    this.value.push(...arguments);
    return this;
  }
  pop(length = 1) {
    for (let i = 0; i < length; i++) {
      this.value.pop();
    }
    return this;
  }
  unshift() {
    this.value.unshift(...arguments);
    return this;
  }
  shift(length = 1) {
    for (let i = 0; i < length; i++) {
      this.value.shift();
    }
    return this;
  }
  splice() {
    this.value.splice(...arguments);
    return this;
  }
  // 清空
  clear() {
    return this.splice(0);
  }
  sort() {
    this.value.sort(...arguments);
    return this;
  }
  reverse() {
    this.value.reverse(...arguments);
    return this;
  }
  fill() {
    this.value.fill(...arguments);
    return this;
  }
  copyWithin() {
    this.value.copyWithin(...arguments);
    return this;
  }
  // 去重
  unique(options = {}) {
    const value = Array.from(new Set(this.value));
    return this.clear().push(...value);
  }
  /**
   * 遍历
   */
  [Symbol.iterator]() {
    // return Array.prototype[Symbol.iterator].apply(this.value, arguments);
    return this.value[Symbol.iterator](...arguments);
  }
  keys() {
    return this.value.keys(...arguments);
  }
  values() {
    return this.value.values(...arguments);
  }
  entries() {
    return this.value.entries(...arguments);
  }
  forEach() {
    this.value.forEach(...arguments);
    return this;
  }
  /**
   * 查找
   */
  at() {
    return this.value.at(...arguments);
  }
  find() {
    return this.value.find(...arguments);
  }
  findIndex() {
    return this.value.findIndex(...arguments);
  }
  findLast() {
    return this.value.findLast(...arguments);
  }
  findLastIndex() {
    return this.value.findLastIndex(...arguments);
  }
  includes() {
    return this.value.includes(...arguments);
  }
  indexOf() {
    return this.value.indexOf(...arguments);
  }
  lastIndexOf() {
    return this.value.lastIndexOf(...arguments);
  }
  some() {
    return this.value.some(...arguments);
  }
  every() {
    return this.value.every(...arguments);
  }
  /**
   * 生成
   */
  map() {
    this.value.map(...arguments);
    return this;
  }
  filter() {
    this.value.filter(...arguments);
    return this;
  }
  reduce() {
    return this.value.reduce(...arguments);
  }
  reduceRight() {
    return this.value.reduce(...arguments);
  }
  concat() {
    const value = this.value.concat(...arguments);
    return new this.constructor(value);
  }
  slice() {
    const value = this.value.slice(...arguments);
    return new this.constructor(value);
  }
  join() {
    return this.value.join(...arguments);
  }
  flat() {
    const value = this.value.flat(...arguments);
    return new this.constructor(value);
  }
  flatMap() {
    const value = this.value.flat(...arguments);
    return new this.constructor(value);
  }
  with() {
    const value = this.value.with(...arguments);
    return new this.constructor(value);
  }
  toSpliced() {
    const value = this.value.toSpliced(...arguments);
    return new this.constructor(value);
  }
  toSorted() {
    const value = this.value.toSorted(...arguments);
    return new this.constructor(value);
  }
  toReversed() {
    const value = this.value.toReversed(...arguments);
    return new this.constructor(value);
  }
  /**
   * 转换系列方法：转换成原始值和其他类型
   */
  toNumber(options = {}) {
    return NaN;
  }
  toString(options = {}) {
    try {
      return this.toJSON();
    } catch (e) {
      return this.value.toString();
    }
  }
  toBoolean() {
    return this.length > 0;
  }
  toLocaleString() {
    return this.value.toLocaleString(...arguments);
  }
  toJSON(options = {}) {
    return JSON.stringify(this.value);
  }
  [Symbol.toPrimitive](hint) {
    console.log('[Symbol.toPrimitive]', { hint });
    if (hint === 'number') {
      return this.toNumber();
    }
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
  }
}
_Array.prototype[Symbol.unscopables] = Array.prototype[Symbol.unscopables];
Object.defineProperty(_Array.prototype, 'length', {
  get() {
    return this.value?.length || 0;
  },
});

// 数学运算
export class _Math {
  // 增加部分命名以接近数学写法
  static arcsin = Math.asin.bind(Math);
  static arccos = Math.acos.bind(Math);
  static arctan = Math.atan.bind(Math);
  static arsinh = Math.asinh.bind(Math);
  static arcosh = Math.acosh.bind(Math);
  static artanh = Math.atanh.bind(Math);
  static loge = Math.log.bind(Math);
  static ln = Math.log.bind(Math);
  static lg = Math.log10.bind(Math);
  static log(a, x) {
    return Math.log(x) / Math.log(a);
  }
}
export class _Reflect {
  // 对 ownKeys 配套 ownValues 和 ownEntries
  static ownValues(target) {
    return Reflect.ownKeys(target).map(key => target[key]);
  }
  static ownEntries(target) {
    return Reflect.ownKeys(target).map(key => [key, target[key]]);
  }
}
export class _Proxy {
  /**
   * 绑定this。常用于解构函数时绑定 this 避免报错
   * @param target 目标对象
   * @param options 选项
   * @returns {*}
   */
  static bindThis(target, options = {}) {
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
  }
}
export class _String {
  /**
   * 首字母大写
   * @param name
   * @returns {string}
   */
  static toFirstUpperCase(name = '') {
    return `${(name[0] ?? '').toUpperCase()}${name.slice(1)}`;
  }
  /**
   * 首字母小写
   * @param name 名称
   * @returns {string}
   */
  static toFirstLowerCase(name = '') {
    return `${(name[0] ?? '').toLowerCase()}${name.slice(1)}`;
  }
  /**
   * 转驼峰命名。常用于连接符命名转驼峰命名，如 xx-name -> xxName
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
   * 转连接符命名。常用于驼峰命名转连接符命名，如 xxName -> xx-name
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
export class _Style {
  /**
   * 单位字符串。对数字或数字格式的字符串自动拼单位，其他字符串原样返回
   * @param value 值
   * @param unit 单位。value没带单位时自动拼接，可传 px/em/% 等
   * @returns {string|string}
   */
  static getUnitString(value = '', { unit = 'px' } = {}) {
    if (value === '') {
      return '';
    }
    // 注意：这里使用 == 判断，不使用 ===
    return Number(value) == value ? `${value}${unit}` : String(value);
  }
}
// 数据处理，处理多格式数据用
export class _Data {
  // 简单类型
  // eslint-disable-next-line no-undef
  static SIMPLE_TYPES = [null, undefined, Number, String, Boolean, BigInt, Symbol];
  /**
   * 获取值的具体类型
   * @param value 值
   * @returns {ObjectConstructor|*|Function} 返回对应构造函数。null、undefined 原样返回
   */
  static getExactType(value) {
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
  }
  /**
   * 获取值的具体类型列表
   * @param value 值
   * @returns {*[]} 统一返回数组。null、undefined 对应为 [null],[undefined]
   */
  static getExactTypes(value) {
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
  }
  /**
   * 深拷贝数据
   * @param source
   * @returns {Map<any, any>|Set<any>|{}|*|*[]}
   */
  static deepClone(source) {
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
  }
  /**
   * 深解包数据
   * @param data 值
   * @param isWrap 包装数据判断函数，如 vue3 的 isRef 函数
   * @param unwrap 解包方式函数，如 vue3 的 unref 函数
   * @returns {{[p: string]: *|{[p: string]: any}}|*|(*|{[p: string]: any})[]|{[p: string]: any}}
   */
  deepUnwrap(data, { isWrap = () => false, unwrap = val => val } = {}) {
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
  }
}
// vue 数据处理
export class _VueData {
  /**
   * 深解包 vue3 响应式对象数据
   * @param data
   * @returns {{[p: string]: *|{[p: string]: *}}|*|(*|{[p: string]: *})[]|{[p: string]: *}}
   */
  static deepUnwrapVue3(data) {
    return _Data.deepUnwrap(data, {
      isWrap: data => data?.__v_isRef,
      unwrap: data => data.value,
    });
  }
  /**
   * 从 attrs 中提取 props 定义的属性
   * @param attrs vue attrs
   * @param propDefinitions props 定义，如 ElButton.props 等
   * @returns {{}}
   */
  static getPropsFromAttrs(attrs, propDefinitions) {
    // props 定义统一成对象格式，type 统一成数组格式以便后续判断
    if (propDefinitions instanceof Array) {
      propDefinitions = Object.fromEntries(propDefinitions.map(name => [_String.toCamelCase(name), { type: [] }]));
    } else if (_Data.getExactType(propDefinitions) === Object) {
      propDefinitions = Object.fromEntries(Object.entries(propDefinitions).map(([name, definition]) => {
        definition = _Data.getExactType(definition) === Object
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
  }
  /**
   * 从 attrs 中提取 emits 定义的属性
   * @param attrs vue attrs
   * @param emitDefinitions emits 定义，如 ElButton.emits 等
   * @returns {{}}
   */
  static getEmitsFromAttrs(attrs, emitDefinitions) {
    // emits 定义统一成数组格式
    if (_Data.getExactType(emitDefinitions) === Object) {
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
  }
  /**
   * 从 attrs 中提取剩余属性。常用于组件 inheritAttrs 设置 false 时使用作为新的 attrs
   * @param attrs vue attrs
   * @param props props 定义 或 vue props，如 ElButton.props 等
   * @param emits emits 定义 或 vue emits，如 ElButton.emits 等
   * @param list 额外的普通属性
   * @returns {{}}
   */
  static getRestFromAttrs(attrs, { props, emits, list = [] } = {}) {
    // 统一成数组格式
    props = (() => {
      const arr = (() => {
        if (props instanceof Array) {
          return props;
        }
        if (_Data.getExactType(props) === Object) {
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
        if (_Data.getExactType(emits) === Object) {
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
      const arr = _Data.getExactType(list) === String
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
  }
}
// 对象操作方法
export class _Object {
  /**
   * 浅合并对象。写法同 Object.assign，通过重定义方式合并，解决 Object.assign 合并两边同名属性混有 value写法 和 get/set写法 时报 TypeError: Cannot set property b of #<Object> which has only a getter 的问题
   * @param target 目标对象
   * @param sources 数据源。一个或多个对象
   * @returns {{}}
   */
  static assign(target = {}, ...sources) {
    for (const source of sources) {
      // 不使用 target[key]=value 写法，直接使用desc重定义
      for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
        Object.defineProperty(target, key, desc);
      }
    }
    return target;
  }
  /**
   * 深合并对象。同 assign 一样也会对属性进行重定义
   * @param target 目标对象。默认值 {} 防止递归时报 TypeError: Object.defineProperty called on non-object
   * @param sources 数据源。一个或多个对象
   * @returns {{}}
   */
  static deepAssign(target = {}, ...sources) {
    for (const source of sources) {
      for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
        if ('value' in desc) {
          // value写法：对象递归处理，其他直接定义
          if (_Data.getExactType(desc.value) === Object) {
            Object.defineProperty(target, key, {
              ...desc,
              value: this.deepAssign(target[key], desc.value),
            });
          } else {
            Object.defineProperty(target, key, desc);
          }
        } else {
          // get/set写法：直接定义
          Object.defineProperty(target, key, desc);
        }
      }
    }
    return target;
  }
  /**
   * key自身所属的对象
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
   * 获取属性描述对象，相比 Object.getOwnPropertyDescriptor，能拿到继承属性的描述对象
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
   * 获取属性名。默认参数配置成同 Object.keys 行为
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
   * 对应 keys 获取 descriptors，传参同 keys 方法。可用于重定义属性
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
   * 对应 keys 获取 descriptorEntries，传参同 keys 方法。可用于重定义属性
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
   * 过滤对象
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
    pick = _Support.namesToArray(pick, { separator });
    omit = _Support.namesToArray(omit, { separator });
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
   * 通过挑选方式选取对象。filter 的简写方式
   * @param object 对象
   * @param keys 属性名集合
   * @param options 选项，同 filter 的各选项值
   * @returns {{}}
   */
  static pick(object, keys = [], options = {}) {
    return this.filter(object, { pick: keys, emptyPick: 'empty', ...options });
  }
  /**
   * 通过排除方式选取对象。filter 的简写方式
   * @param object 对象
   * @param keys 属性名集合
   * @param options 选项，同 filter 的各选项值
   * @returns {{}}
   */
  static omit(object, keys = [], options = {}) {
    return this.filter(object, { omit: keys, ...options });
  }
}
