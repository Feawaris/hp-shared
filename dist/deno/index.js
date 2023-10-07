/*!
 * hp-shared v0.2.1
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"esm","sourcemap":"inline"}
 */
  
import * as mod_ts from 'https://deno.land/x/copy_paste/mod.ts';

// 基础模块
// 辅助
class _Support {
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
class _Date {
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
  // [Symbol.toPrimitive] 和 toString、valueOf 统一配置处理隐式和显示调用场景
  [Symbol.toPrimitive](hint) {
    // console.log('[Symbol.toPrimitive]', { hint });
    if (hint === 'string' || hint === 'default') {
      return this.toString();
    }
    if (hint === 'number') {
      return this.toNumber();
    }
  }
  // 转换成字符串
  toString(options = {}) {
    // console.log('toString', options);
    return this.constructor.stringify(this.value, options);
  }
  // valueOf 这里处理成同 Date 对象的逻辑，转换成数字
  valueOf(options = {}) {
    // console.log('valueOf', options);
    return this.toNumber(options);
  }
  // 转换成数字
  toNumber(options = {}) {
    // console.log('toNumber', options);
    return this.value.getTime();
  }
  // 转换成布尔值。用于 if 等场景
  toBoolean(options = {}) {
    // console.log('toBoolean', options);
    if (this.constructor.isValidValue(this)) ;
  }
  // 转换成 JSON。用于 JSON 对象转换，传参到后端接口常用
  toJSON(options = {}) {
    // console.log('toJSON', options);
    return this.toString();
  }
}
// 数学运算
class _Math {
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
class _Reflect {
  // 对 ownKeys 配套 ownValues 和 ownEntries
  static ownValues(target) {
    return Reflect.ownKeys(target).map(key => target[key]);
  }
  static ownEntries(target) {
    return Reflect.ownKeys(target).map(key => [key, target[key]]);
  }
}
class _Proxy {
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
class _String {
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
class _Style {
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
class _Data {
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
class _VueData {
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
/**
 * 属性名统一成数组格式
 * @param names 属性名。格式 'a,b,c' 或 ['a','b','c']
 * @param separator names 为字符串时的拆分规则。同 split 方法的 separator，字符串无需拆分的可以传 null 或 undefined
 * @returns {*[][]|(MagicString | Bundle | string)[]|FlatArray<(FlatArray<(*|[*[]]|[])[], 1>[]|*|[*[]]|[])[], 1>[]|*[]}
 */
class _Object {
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

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  _Data: _Data,
  _Date: _Date,
  _Math: _Math,
  _Object: _Object,
  _Proxy: _Proxy,
  _Reflect: _Reflect,
  _String: _String,
  _Style: _Style,
  _Support: _Support,
  _VueData: _VueData
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
  const result = _Data.deepClone(target);
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
            if (_Data.getExactType(val) === Object) {
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
      if (_Data.getExactType(value) === Object) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL2luZGV4LmpzIiwiLi4vLi4vc3JjL2Rldi9lc2xpbnQuanMiLCIuLi8uLi9zcmMvZGV2L3ZpdGUuanMiLCIuLi8uLi9zcmMvbmV0d29yay9zaGFyZWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8g5Z+656GA5qih5Z2XXG4vLyDovoXliqlcbmV4cG9ydCBjbGFzcyBfU3VwcG9ydCB7XG4gIC8vIGpz6L+Q6KGM546v5aKDXG4gIHN0YXRpYyBKU19FTlYgPSAoZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbFRoaXMgPT09IHdpbmRvdykge1xuICAgICAgcmV0dXJuICdicm93c2VyJztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbFRoaXMgPT09IGdsb2JhbCkge1xuICAgICAgcmV0dXJuICdub2RlJztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9KSgpO1xuICAvLyDnqbrlh73mlbBcbiAgc3RhdGljIE5PT1AoKSB7fVxuICAvLyDov5Tlm54gZmFsc2VcbiAgc3RhdGljIEZBTFNFKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyDov5Tlm54gdHJ1ZVxuICBzdGF0aWMgVFJVRSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICAvLyDljp/moLfov5Tlm55cbiAgc3RhdGljIFJBVyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICAvLyBjYXRjaCDlhoXnmoTplJnor6/ljp/moLfmipvlh7rljrtcbiAgc3RhdGljIFRIUk9XKGUpIHtcbiAgICB0aHJvdyBlO1xuICB9XG4gIHN0YXRpYyBuYW1lc1RvQXJyYXkobmFtZXMgPSBbXSwgeyBzZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSB7XG4gICAgaWYgKG5hbWVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiBuYW1lcy5tYXAodmFsID0+IHRoaXMubmFtZXNUb0FycmF5KHZhbCkpLmZsYXQoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuYW1lcy5zcGxpdChzZXBhcmF0b3IpLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG5hbWVzID09PSAnc3ltYm9sJykge1xuICAgICAgcmV0dXJuIFtuYW1lc107XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufVxuLyoqXG4gKiDlrprliLblr7nosaHjgILliqAgXyDot5/lkIzlkI3ljp/nlJ/lr7nosaHljLrliIZcbiAqL1xuLy8g5pel5pyf5pe26Ze0XG5leHBvcnQgY2xhc3MgX0RhdGUge1xuICAvLyDovazmjaLmiJDlrZfnrKbkuLJcbiAgc3RhdGljIHN0cmluZ2lmeSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWRWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3QgZGF0ZSA9IG5ldyB0aGlzKHZhbHVlKTtcbiAgICBjb25zdCB7IHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kIH0gPSB7XG4gICAgICB5ZWFyOiBkYXRlLnllYXIsXG4gICAgICAuLi5PYmplY3QuZnJvbUVudHJpZXMoWydtb250aCcsICdkYXknLCAnaG91cicsICdtaW51dGUnLCAnc2Vjb25kJ10ubWFwKChuYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiBbbmFtZSwgZGF0ZVtuYW1lXS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyldO1xuICAgICAgfSkpLFxuICAgIH07XG5cbiAgICByZXR1cm4gYCR7eWVhcn0tJHttb250aH0tJHtkYXl9ICR7aG91cn06JHttaW51dGV9OiR7c2Vjb25kfWA7XG4gIH1cbiAgLy8g5piv5ZCm5pyJ5pWI5Y+C5pWw44CC5bi455So5LqO5aSE55CG5pON5L2c5b6X5YiwIEludmFsaWQgRGF0ZSDnmoTmg4XlhrVcbiAgc3RhdGljIGlzVmFsaWRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyB0aGlzKHZhbHVlKTtcbiAgICByZXR1cm4gIWlzTmFOKGRhdGUudmFsdWUuZ2V0VGltZSgpKTtcbiAgfVxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyDlt7Lnu4/mmK8gX0RhdGUg5a+56LGh77yM55u05o6l5LygIERhdGUg5a+56LGhIHZhbHVlIOi/m+WQjumdoueahCBuZXcgRGF0ZVxuICAgICAgaWYgKGFyZ3NbMF0gaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgIGFyZ3NbMF0gPSBhcmdzWzBdLnZhbHVlO1xuICAgICAgfVxuICAgICAgLy8gbnVsbCDlkozmmL7lvI8gdW5kZWZpbmVkIOmDveinhuS4uuaXoOaViOWAvFxuICAgICAgaWYgKGFyZ3NbMF0gPT09IG51bGwpIHtcbiAgICAgICAgYXJnc1swXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZUFsbCgnLScsICcvJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSBuZXcgRGF0ZSguLi5hcmdzKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3llYXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmdldEZ1bGxZZWFyKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbW9udGgnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmdldE1vbnRoKCkgKyAxO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RheScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUuZ2V0RGF0ZSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2hvdXInLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmdldEhvdXJzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWludXRlJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5nZXRNaW51dGVzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2Vjb25kJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5nZXRTZWNvbmRzKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnd2VlaycsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUuZ2V0RGF5KCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG4gIC8vIFtTeW1ib2wudG9QcmltaXRpdmVdIOWSjCB0b1N0cmluZ+OAgXZhbHVlT2Yg57uf5LiA6YWN572u5aSE55CG6ZqQ5byP5ZKM5pi+56S66LCD55So5Zy65pmvXG4gIFtTeW1ib2wudG9QcmltaXRpdmVdKGhpbnQpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnW1N5bWJvbC50b1ByaW1pdGl2ZV0nLCB7IGhpbnQgfSk7XG4gICAgaWYgKGhpbnQgPT09ICdzdHJpbmcnIHx8IGhpbnQgPT09ICdkZWZhdWx0Jykge1xuICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKGhpbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGhpcy50b051bWJlcigpO1xuICAgIH1cbiAgfVxuICAvLyDovazmjaLmiJDlrZfnrKbkuLJcbiAgdG9TdHJpbmcob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3RvU3RyaW5nJywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3Iuc3RyaW5naWZ5KHRoaXMudmFsdWUsIG9wdGlvbnMpO1xuICB9XG4gIC8vIHZhbHVlT2Yg6L+Z6YeM5aSE55CG5oiQ5ZCMIERhdGUg5a+56LGh55qE6YC76L6R77yM6L2s5o2i5oiQ5pWw5a2XXG4gIHZhbHVlT2Yob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3ZhbHVlT2YnLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy50b051bWJlcihvcHRpb25zKTtcbiAgfVxuICAvLyDovazmjaLmiJDmlbDlrZdcbiAgdG9OdW1iZXIob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3RvTnVtYmVyJywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUuZ2V0VGltZSgpO1xuICB9XG4gIC8vIOi9rOaNouaIkOW4g+WwlOWAvOOAgueUqOS6jiBpZiDnrYnlnLrmma9cbiAgdG9Cb29sZWFuKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCd0b0Jvb2xlYW4nLCBvcHRpb25zKTtcbiAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5pc1ZhbGlkVmFsdWUodGhpcykpIHtcblxuICAgIH1cbiAgfVxuICAvLyDovazmjaLmiJAgSlNPTuOAgueUqOS6jiBKU09OIOWvueixoei9rOaNou+8jOS8oOWPguWIsOWQjuerr+aOpeWPo+W4uOeUqFxuICB0b0pTT04ob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3RvSlNPTicsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cbn1cbi8vIOaVsOWtpui/kOeul1xuZXhwb3J0IGNsYXNzIF9NYXRoIHtcbiAgLy8g5aKe5Yqg6YOo5YiG5ZG95ZCN5Lul5o6l6L+R5pWw5a2m5YaZ5rOVXG4gIHN0YXRpYyBhcmNzaW4gPSBNYXRoLmFzaW4uYmluZChNYXRoKTtcbiAgc3RhdGljIGFyY2NvcyA9IE1hdGguYWNvcy5iaW5kKE1hdGgpO1xuICBzdGF0aWMgYXJjdGFuID0gTWF0aC5hdGFuLmJpbmQoTWF0aCk7XG4gIHN0YXRpYyBhcnNpbmggPSBNYXRoLmFzaW5oLmJpbmQoTWF0aCk7XG4gIHN0YXRpYyBhcmNvc2ggPSBNYXRoLmFjb3NoLmJpbmQoTWF0aCk7XG4gIHN0YXRpYyBhcnRhbmggPSBNYXRoLmF0YW5oLmJpbmQoTWF0aCk7XG4gIHN0YXRpYyBsb2dlID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbiAgc3RhdGljIGxuID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbiAgc3RhdGljIGxnID0gTWF0aC5sb2cxMC5iaW5kKE1hdGgpO1xuICBzdGF0aWMgbG9nKGEsIHgpIHtcbiAgICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZyhhKTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIF9SZWZsZWN0IHtcbiAgLy8g5a+5IG93bktleXMg6YWN5aWXIG93blZhbHVlcyDlkowgb3duRW50cmllc1xuICBzdGF0aWMgb3duVmFsdWVzKHRhcmdldCkge1xuICAgIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IHRhcmdldFtrZXldKTtcbiAgfVxuICBzdGF0aWMgb3duRW50cmllcyh0YXJnZXQpIHtcbiAgICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCkubWFwKGtleSA9PiBba2V5LCB0YXJnZXRba2V5XV0pO1xuICB9XG59XG5leHBvcnQgY2xhc3MgX1Byb3h5IHtcbiAgLyoqXG4gICAqIOe7keWumnRoaXPjgILluLjnlKjkuo7op6PmnoTlh73mlbDml7bnu5HlrpogdGhpcyDpgb/lhY3miqXplJlcbiAgICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaFcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc3RhdGljIGJpbmRUaGlzKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIHtcbiAgICAgIGdldCh0YXJnZXQsIHAsIHJlY2VpdmVyKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLy8g5Ye95pWw57G75Z6L57uR5a6adGhpc1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5YW25LuW5bGe5oCn5Y6f5qC36L+U5ZueXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBfU3RyaW5nIHtcbiAgLyoqXG4gICAqIOmmluWtl+avjeWkp+WGmVxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvRmlyc3RVcHBlckNhc2UobmFtZSA9ICcnKSB7XG4gICAgcmV0dXJuIGAkeyhuYW1lWzBdID8/ICcnKS50b1VwcGVyQ2FzZSgpfSR7bmFtZS5zbGljZSgxKX1gO1xuICB9XG4gIC8qKlxuICAgKiDpppblrZfmr43lsI/lhplcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9GaXJzdExvd2VyQ2FzZShuYW1lID0gJycpIHtcbiAgICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvTG93ZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG4gIH1cbiAgLyoqXG4gICAqIOi9rOmpvOWzsOWRveWQjeOAguW4uOeUqOS6jui/nuaOpeespuWRveWQjei9rOmpvOWzsOWRveWQje+8jOWmgiB4eC1uYW1lIC0+IHh4TmFtZVxuICAgKiBAcGFyYW0gbmFtZSDlkI3np7BcbiAgICogQHBhcmFtIHNlcGFyYXRvciDov57mjqXnrKbjgILnlKjkuo7nlJ/miJDmraPliJkg6buY6K6k5Li65Lit5YiS57q/IC0g5a+55bqUcmVnZXhw5b6X5YiwIC8tKFxcdykvZ1xuICAgKiBAcGFyYW0gZmlyc3Qg6aaW5a2X5q+N5aSE55CG5pa55byP44CCdHJ1ZSDmiJYgJ3VwcGVyY2FzZSfvvJrovazmjaLmiJDlpKflhpk7XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2Ug5oiWICdsb3dlcmNhc2Un77ya6L2s5o2i5oiQ5bCP5YaZO1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICdyYXcnIOaIliDlhbbku5bml6DmlYjlgLzvvJrpu5jorqTljp/moLfov5Tlm57vvIzkuI3ov5vooYzlpITnkIY7XG4gICAqIEByZXR1cm5zIHtNYWdpY1N0cmluZ3xzdHJpbmd8c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvQ2FtZWxDYXNlKG5hbWUsIHsgc2VwYXJhdG9yID0gJy0nLCBmaXJzdCA9ICdyYXcnIH0gPSB7fSkge1xuICAgIC8vIOeUn+aIkOato+WImVxuICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoYCR7c2VwYXJhdG9yfShcXFxcdylgLCAnZycpO1xuICAgIC8vIOaLvOaOpeaIkOmpvOWzsFxuICAgIGNvbnN0IGNhbWVsTmFtZSA9IG5hbWUucmVwbGFjZUFsbChyZWdleHAsIChzdWJzdHIsICQxKSA9PiB7XG4gICAgICByZXR1cm4gJDEudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgICAvLyDpppblrZfmr43lpKflsI/lhpnmoLnmja7kvKDlj4LliKTmlq1cbiAgICBpZiAoW3RydWUsICd1cHBlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvRmlyc3RVcHBlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgaWYgKFtmYWxzZSwgJ2xvd2VyY2FzZSddLmluY2x1ZGVzKGZpcnN0KSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9GaXJzdExvd2VyQ2FzZShjYW1lbE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FtZWxOYW1lO1xuICB9XG4gIC8qKlxuICAgKiDovazov57mjqXnrKblkb3lkI3jgILluLjnlKjkuo7pqbzls7Dlkb3lkI3ovazov57mjqXnrKblkb3lkI3vvIzlpoIgeHhOYW1lIC0+IHh4LW5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ymXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgdG9MaW5lQ2FzZShuYW1lID0gJycsIHsgc2VwYXJhdG9yID0gJy0nIH0gPSB7fSkge1xuICAgIHJldHVybiBuYW1lXG4gICAgICAvLyDmjInov57mjqXnrKbmi7zmjqVcbiAgICAgIC5yZXBsYWNlQWxsKC8oW2Etel0pKFtBLVpdKS9nLCBgJDEke3NlcGFyYXRvcn0kMmApXG4gICAgICAvLyDovazlsI/lhplcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICB9XG59XG4vLyDmoLflvI/lpITnkIZcbmV4cG9ydCBjbGFzcyBfU3R5bGUge1xuICAvKipcbiAgICog5Y2V5L2N5a2X56ym5Liy44CC5a+55pWw5a2X5oiW5pWw5a2X5qC85byP55qE5a2X56ym5Liy6Ieq5Yqo5ou85Y2V5L2N77yM5YW25LuW5a2X56ym5Liy5Y6f5qC36L+U5ZueXG4gICAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAgICogQHBhcmFtIHVuaXQg5Y2V5L2N44CCdmFsdWXmsqHluKbljZXkvY3ml7boh6rliqjmi7zmjqXvvIzlj6/kvKAgcHgvZW0vJSDnrYlcbiAgICogQHJldHVybnMge3N0cmluZ3xzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2V0VW5pdFN0cmluZyh2YWx1ZSA9ICcnLCB7IHVuaXQgPSAncHgnIH0gPSB7fSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgLy8g5rOo5oSP77ya6L+Z6YeM5L2/55SoID09IOWIpOaWre+8jOS4jeS9v+eUqCA9PT1cbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlKSA9PSB2YWx1ZSA/IGAke3ZhbHVlfSR7dW5pdH1gIDogU3RyaW5nKHZhbHVlKTtcbiAgfVxufVxuLy8g5pWw5o2u5aSE55CG77yM5aSE55CG5aSa5qC85byP5pWw5o2u55SoXG5leHBvcnQgY2xhc3MgX0RhdGEge1xuICAvLyDnroDljZXnsbvlnotcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHN0YXRpYyBTSU1QTEVfVFlQRVMgPSBbbnVsbCwgdW5kZWZpbmVkLCBOdW1iZXIsIFN0cmluZywgQm9vbGVhbiwgQmlnSW50LCBTeW1ib2xdO1xuICAvKipcbiAgICog6I635Y+W5YC855qE5YW35L2T57G75Z6LXG4gICAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAgICogQHJldHVybnMge09iamVjdENvbnN0cnVjdG9yfCp8RnVuY3Rpb259IOi/lOWbnuWvueW6lOaehOmAoOWHveaVsOOAgm51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gICAqL1xuICBzdGF0aWMgZ2V0RXhhY3RUeXBlKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gICAgaWYgKFtudWxsLCB1bmRlZmluZWRdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICAgIC8vIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoeaXtiBfX3Byb3RvX18g5Li6IG51bGxcbiAgICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgICBpZiAoaXNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0QnlDcmVhdGVOdWxsJywgX19wcm90b19fKTtcbiAgICAgIHJldHVybiBPYmplY3Q7XG4gICAgfVxuICAgIC8vIOWvueW6lOe7p+aJv+eahOWvueixoSBfX3Byb3RvX18g5rKh5pyJIGNvbnN0cnVjdG9yIOWxnuaAp1xuICAgIGNvbnN0IGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9ICEoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pO1xuICAgIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgICByZXR1cm4gT2JqZWN0O1xuICAgIH1cbiAgICAvLyDov5Tlm57lr7nlupTmnoTpgKDlh73mlbBcbiAgICByZXR1cm4gX19wcm90b19fLmNvbnN0cnVjdG9yO1xuICB9XG4gIC8qKlxuICAgKiDojrflj5blgLznmoTlhbfkvZPnsbvlnovliJfooahcbiAgICogQHBhcmFtIHZhbHVlIOWAvFxuICAgKiBAcmV0dXJucyB7KltdfSDnu5/kuIDov5Tlm57mlbDnu4TjgIJudWxs44CBdW5kZWZpbmVkIOWvueW6lOS4uiBbbnVsbF0sW3VuZGVmaW5lZF1cbiAgICovXG4gIHN0YXRpYyBnZXRFeGFjdFR5cGVzKHZhbHVlKSB7XG4gICAgLy8gbnVsbOOAgXVuZGVmaW5lZCDliKTmlq3lpITnkIZcbiAgICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICByZXR1cm4gW3ZhbHVlXTtcbiAgICB9XG4gICAgLy8g5omr5Y6f5Z6L6ZO+5b6X5Yiw5a+55bqU5p6E6YCg5Ye95pWwXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBsb29wID0gMDtcbiAgICBsZXQgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IGZhbHNlO1xuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ3doaWxlJywgbG9vcCwgX19wcm90b19fKTtcbiAgICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgICAgLy8g5LiA6L+b5p2lIF9fcHJvdG9fXyDlsLHmmK8gbnVsbCDor7TmmI4gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGhXG4gICAgICAgIGlmIChsb29wIDw9IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXykge1xuICAgICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgICB9XG4gICAgICBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX19wcm90b19fKTtcbiAgICAgIGxvb3ArKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICog5rex5ou36LSd5pWw5o2uXG4gICAqIEBwYXJhbSBzb3VyY2VcbiAgICogQHJldHVybnMge01hcDxhbnksIGFueT58U2V0PGFueT58e318KnwqW119XG4gICAqL1xuICBzdGF0aWMgZGVlcENsb25lKHNvdXJjZSkge1xuICAgIC8vIOaVsOe7hFxuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIFNldFxuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgIGxldCByZXN1bHQgPSBuZXcgU2V0KCk7XG4gICAgICBmb3IgKGxldCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgICAgcmVzdWx0LmFkZCh0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8gTWFwXG4gICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXAoKTtcbiAgICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBzb3VyY2UuZW50cmllcygpKSB7XG4gICAgICAgIHJlc3VsdC5zZXQoa2V5LCB0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8g5a+56LGhXG4gICAgaWYgKHRoaXMuZ2V0RXhhY3RUeXBlKHNvdXJjZSkgPT09IE9iamVjdCkge1xuICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgICAgLy8gdmFsdWXmlrnlvI/vvJrpgJLlvZLlpITnkIZcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIHtcbiAgICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQ2xvbmUoZGVzYy52YWx1ZSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0L3NldCDmlrnlvI/vvJrnm7TmjqXlrprkuYlcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyDlhbbku5bvvJrljp/moLfov5Tlm55cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG4gIC8qKlxuICAgKiDmt7Hop6PljIXmlbDmja5cbiAgICogQHBhcmFtIGRhdGEg5YC8XG4gICAqIEBwYXJhbSBpc1dyYXAg5YyF6KOF5pWw5o2u5Yik5pat5Ye95pWw77yM5aaCIHZ1ZTMg55qEIGlzUmVmIOWHveaVsFxuICAgKiBAcGFyYW0gdW53cmFwIOino+WMheaWueW8j+WHveaVsO+8jOWmgiB2dWUzIOeahCB1bnJlZiDlh73mlbBcbiAgICogQHJldHVybnMge3tbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fCp8KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfHtbcDogc3RyaW5nXTogYW55fX1cbiAgICovXG4gIGRlZXBVbndyYXAoZGF0YSwgeyBpc1dyYXAgPSAoKSA9PiBmYWxzZSwgdW53cmFwID0gdmFsID0+IHZhbCB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBpc1dyYXAsIHVud3JhcCB9O1xuICAgIC8vIOWMheijheexu+Wei++8iOWmgnZ1ZTPlk43lupTlvI/lr7nosaHvvInmlbDmja7op6PljIVcbiAgICBpZiAoaXNXcmFwKGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWVwVW53cmFwKHVud3JhcChkYXRhKSwgb3B0aW9ucyk7XG4gICAgfVxuICAgIC8vIOmAkuW9kuWkhOeQhueahOexu+Wei1xuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiBkYXRhLm1hcCh2YWwgPT4gdGhpcy5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucykpO1xuICAgIH1cbiAgICBpZiAodGhpcy5nZXRFeGFjdFR5cGUoZGF0YSkgPT09IE9iamVjdCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhkYXRhKS5tYXAoKFtrZXksIHZhbF0pID0+IHtcbiAgICAgICAgcmV0dXJuIFtrZXksIHRoaXMuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpXTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgLy8g5YW25LuW5Y6f5qC36L+U5ZueXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cbi8vIHZ1ZSDmlbDmja7lpITnkIZcbmV4cG9ydCBjbGFzcyBfVnVlRGF0YSB7XG4gIC8qKlxuICAgKiDmt7Hop6PljIUgdnVlMyDlk43lupTlvI/lr7nosaHmlbDmja5cbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHJldHVybnMge3tbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106ICp9fXwqfCgqfHtbcDogc3RyaW5nXTogKn0pW118e1twOiBzdHJpbmddOiAqfX1cbiAgICovXG4gIHN0YXRpYyBkZWVwVW53cmFwVnVlMyhkYXRhKSB7XG4gICAgcmV0dXJuIF9EYXRhLmRlZXBVbndyYXAoZGF0YSwge1xuICAgICAgaXNXcmFwOiBkYXRhID0+IGRhdGE/Ll9fdl9pc1JlZixcbiAgICAgIHVud3JhcDogZGF0YSA9PiBkYXRhLnZhbHVlLFxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+WIHByb3BzIOWumuS5ieeahOWxnuaAp1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBwcm9wRGVmaW5pdGlvbnMgcHJvcHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZ2V0UHJvcHNGcm9tQXR0cnMoYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAgIC8vIHByb3BzIOWumuS5iee7n+S4gOaIkOWvueixoeagvOW8j++8jHR5cGUg57uf5LiA5oiQ5pWw57uE5qC85byP5Lul5L6/5ZCO57ut5Yik5patXG4gICAgaWYgKHByb3BEZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCB7IHR5cGU6IFtdIH1dKSk7XG4gICAgfSBlbHNlIGlmIChfRGF0YS5nZXRFeGFjdFR5cGUocHJvcERlZmluaXRpb25zKSA9PT0gT2JqZWN0KSB7XG4gICAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKS5tYXAoKFtuYW1lLCBkZWZpbml0aW9uXSkgPT4ge1xuICAgICAgICBkZWZpbml0aW9uID0gX0RhdGEuZ2V0RXhhY3RUeXBlKGRlZmluaXRpb24pID09PSBPYmplY3RcbiAgICAgICAgICA/IHsgLi4uZGVmaW5pdGlvbiwgdHlwZTogW2RlZmluaXRpb24udHlwZV0uZmxhdCgpIH1cbiAgICAgICAgICA6IHsgdHlwZTogW2RlZmluaXRpb25dLmZsYXQoKSB9O1xuICAgICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIGRlZmluaXRpb25dO1xuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wRGVmaW5pdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgLy8g6K6+572u5YC8XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykpIHtcbiAgICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBkZWZpbml0aW9uLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICAgIC8vIHByb3BOYW1lIOaIliBwcm9wLW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgY29uc3QgYXR0clZhbHVlID0gYXR0cnNbbmFtZV07XG4gICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgICAvLyDlj6rljIXlkKtCb29sZWFu57G75Z6L55qEJyfovazmjaLkuLp0cnVl77yM5YW25LuW5Y6f5qC36LWL5YC8XG4gICAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBkZWZpbml0aW9uLnR5cGUubGVuZ3RoID09PSAxICYmIGRlZmluaXRpb24udHlwZS5pbmNsdWRlcyhCb29sZWFuKSAmJiBhdHRyVmFsdWUgPT09ICcnID8gdHJ1ZSA6IGF0dHJWYWx1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcHJvcC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgICBpZiAoZW5kKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNldFJlc3VsdCh7IG5hbWU6IF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKSwgZGVmaW5pdGlvbiwgZW5kOiB0cnVlIH0pO1xuICAgICAgfSkoe1xuICAgICAgICBuYW1lLCBkZWZpbml0aW9uLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgZW1pdHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIGVtaXREZWZpbml0aW9ucyBlbWl0cyDlrprkuYnvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBnZXRFbWl0c0Zyb21BdHRycyhhdHRycywgZW1pdERlZmluaXRpb25zKSB7XG4gICAgLy8gZW1pdHMg5a6a5LmJ57uf5LiA5oiQ5pWw57uE5qC85byPXG4gICAgaWYgKF9EYXRhLmdldEV4YWN0VHlwZShlbWl0RGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICAgIGVtaXREZWZpbml0aW9ucyA9IE9iamVjdC5rZXlzKGVtaXREZWZpbml0aW9ucyk7XG4gICAgfSBlbHNlIGlmICghKGVtaXREZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgZW1pdERlZmluaXRpb25zID0gW107XG4gICAgfVxuICAgIC8vIOe7n+S4gOWkhOeQhuaIkCBvbkVtaXROYW1l44CBb25VcGRhdGU6ZW1pdE5hbWUodi1tb2RlbOezu+WIlykg5qC85byPXG4gICAgY29uc3QgZW1pdE5hbWVzID0gZW1pdERlZmluaXRpb25zLm1hcChuYW1lID0+IF9TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKSk7XG4gICAgLy8g6K6+572u5YC8XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgbmFtZSBvZiBlbWl0TmFtZXMpIHtcbiAgICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uVXBkYXRlOicpKSB7XG4gICAgICAgICAgLy8gb25VcGRhdGU6ZW1pdE5hbWUg5oiWIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgICBpZiAoZW5kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldFJlc3VsdCh7IG5hbWU6IGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShuYW1lLnNsaWNlKG5hbWUuaW5kZXhPZignOicpICsgMSkpfWAsIGVuZDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH0pKHsgbmFtZSB9KTtcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPluWJqeS9meWxnuaAp+OAguW4uOeUqOS6jue7hOS7tiBpbmhlcml0QXR0cnMg6K6+572uIGZhbHNlIOaXtuS9v+eUqOS9nOS4uuaWsOeahCBhdHRyc1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wcyDlrprkuYkg5oiWIHZ1ZSBwcm9wc++8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHBhcmFtIGVtaXRzIGVtaXRzIOWumuS5iSDmiJYgdnVlIGVtaXRz77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICAgKiBAcGFyYW0gbGlzdCDpop3lpJbnmoTmma7pgJrlsZ7mgKdcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGdldFJlc3RGcm9tQXR0cnMoYXR0cnMsIHsgcHJvcHMsIGVtaXRzLCBsaXN0ID0gW10gfSA9IHt9KSB7XG4gICAgLy8g57uf5LiA5oiQ5pWw57uE5qC85byPXG4gICAgcHJvcHMgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgYXJyID0gKCgpID0+IHtcbiAgICAgICAgaWYgKHByb3BzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9EYXRhLmdldEV4YWN0VHlwZShwcm9wcykgPT09IE9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiBhcnIubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgICB9KSgpO1xuICAgIGVtaXRzID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChlbWl0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIGVtaXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfRGF0YS5nZXRFeGFjdFR5cGUoZW1pdHMpID09PSBPYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZW1pdHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0pKCk7XG4gICAgICByZXR1cm4gYXJyLm1hcCgobmFtZSkgPT4ge1xuICAgICAgICAvLyB1cGRhdGU6ZW1pdE5hbWUg5oiWIHVwZGF0ZTplbWl0LW5hbWUg5qC85byPXG4gICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ3VwZGF0ZTonKSkge1xuICAgICAgICAgIGNvbnN0IHBhcnROYW1lID0gbmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpO1xuICAgICAgICAgIHJldHVybiBbYG9uVXBkYXRlOiR7X1N0cmluZy50b0NhbWVsQ2FzZShwYXJ0TmFtZSl9YCwgYG9uVXBkYXRlOiR7X1N0cmluZy50b0xpbmVDYXNlKHBhcnROYW1lKX1gXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICAgIHJldHVybiBbX1N0cmluZy50b0NhbWVsQ2FzZShgb24tJHtuYW1lfWApXTtcbiAgICAgIH0pLmZsYXQoKTtcbiAgICB9KSgpO1xuICAgIGxpc3QgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgYXJyID0gX0RhdGEuZ2V0RXhhY3RUeXBlKGxpc3QpID09PSBTdHJpbmdcbiAgICAgICAgPyBsaXN0LnNwbGl0KCcsJylcbiAgICAgICAgOiBsaXN0IGluc3RhbmNlb2YgQXJyYXkgPyBsaXN0IDogW107XG4gICAgICByZXR1cm4gYXJyLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICAgIH0pKCk7XG4gICAgY29uc3QgbGlzdEFsbCA9IEFycmF5LmZyb20obmV3IFNldChbcHJvcHMsIGVtaXRzLCBsaXN0XS5mbGF0KCkpKTtcbiAgICAvLyBjb25zb2xlLmxvZygnbGlzdEFsbCcsIGxpc3RBbGwpO1xuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhhdHRycykpKSB7XG4gICAgICBpZiAoIWxpc3RBbGwuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgbmFtZSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbi8qKlxuICog5bGe5oCn5ZCN57uf5LiA5oiQ5pWw57uE5qC85byPXG4gKiBAcGFyYW0gbmFtZXMg5bGe5oCn5ZCN44CC5qC85byPICdhLGIsYycg5oiWIFsnYScsJ2InLCdjJ11cbiAqIEBwYXJhbSBzZXBhcmF0b3IgbmFtZXMg5Li65a2X56ym5Liy5pe255qE5ouG5YiG6KeE5YiZ44CC5ZCMIHNwbGl0IOaWueazleeahCBzZXBhcmF0b3LvvIzlrZfnrKbkuLLml6DpnIDmi4bliIbnmoTlj6/ku6XkvKAgbnVsbCDmiJYgdW5kZWZpbmVkXG4gKiBAcmV0dXJucyB7KltdW118KE1hZ2ljU3RyaW5nIHwgQnVuZGxlIHwgc3RyaW5nKVtdfEZsYXRBcnJheTwoRmxhdEFycmF5PCgqfFsqW11dfFtdKVtdLCAxPltdfCp8WypbXV18W10pW10sIDE+W118KltdfVxuICovXG5leHBvcnQgY2xhc3MgX09iamVjdCB7XG4gIC8qKlxuICAgKiDmtYXlkIjlubblr7nosaHjgILlhpnms5XlkIwgT2JqZWN0LmFzc2lnbu+8jOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICAgKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIC8vIOS4jeS9v+eUqCB0YXJnZXRba2V5XT12YWx1ZSDlhpnms5XvvIznm7TmjqXkvb/nlKhkZXNj6YeN5a6a5LmJXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgLyoqXG4gICAqIOa3seWQiOW5tuWvueixoeOAguWQjCBhc3NpZ24g5LiA5qC35Lmf5Lya5a+55bGe5oCn6L+b6KGM6YeN5a6a5LmJXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGh44CC6buY6K6k5YC8IHt9IOmYsuatoumAkuW9kuaXtuaKpSBUeXBlRXJyb3I6IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdFxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGRlZXBBc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAvLyB2YWx1ZeWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICAgIGlmIChfRGF0YS5nZXRFeGFjdFR5cGUoZGVzYy52YWx1ZSkgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCB7XG4gICAgICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmRlZXBBc3NpZ24odGFyZ2V0W2tleV0sIGRlc2MudmFsdWUpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGdldC9zZXTlhpnms5XvvJrnm7TmjqXlrprkuYlcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgLyoqXG4gICAqIGtleeiHqui6q+aJgOWxnueahOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5IOWxnuaAp+WQjVxuICAgKiBAcmV0dXJucyB7KnxudWxsfVxuICAgKi9cbiAgc3RhdGljIG93bmVyKG9iamVjdCwga2V5KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3duZXIoX19wcm90b19fLCBrZXkpO1xuICB9XG4gIC8qKlxuICAgKiDojrflj5blsZ7mgKfmj4/ov7Dlr7nosaHvvIznm7jmr5QgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcu+8jOiDveaLv+WIsOe7p+aJv+WxnuaAp+eahOaPj+i/sOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0XG4gICAqIEBwYXJhbSBrZXlcbiAgICogQHJldHVybnMge3VuZGVmaW5lZHxQcm9wZXJ0eURlc2NyaXB0b3J9XG4gICAqL1xuICBzdGF0aWMgZGVzY3JpcHRvcihvYmplY3QsIGtleSkge1xuICAgIGNvbnN0IGZpbmRPYmplY3QgPSB0aGlzLm93bmVyKG9iamVjdCwga2V5KTtcbiAgICBpZiAoIWZpbmRPYmplY3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZpbmRPYmplY3QsIGtleSk7XG4gIH1cbiAgLyoqXG4gICAqIOiOt+WPluWxnuaAp+WQjeOAgum7mOiupOWPguaVsOmFjee9ruaIkOWQjCBPYmplY3Qua2V5cyDooYzkuLpcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge2FueVtdfVxuICAgKi9cbiAgc3RhdGljIGtleXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgLy8gc2V055So5LqOa2V55Y676YeNXG4gICAgbGV0IHNldCA9IG5ldyBTZXQoKTtcbiAgICAvLyDoh6rouqvlsZ7mgKfnrZvpgIlcbiAgICBjb25zdCBkZXNjcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCk7XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBfUmVmbGVjdC5vd25FbnRyaWVzKGRlc2NzKSkge1xuICAgICAgLy8g5b+955Wlc3ltYm9s5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIXN5bWJvbCAmJiB0eXBlb2Yga2V5ID09PSAnc3ltYm9sJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOW/veeVpeS4jeWPr+WIl+S4vuWxnuaAp+eahOaDheWGtVxuICAgICAgaWYgKCFub3RFbnVtZXJhYmxlICYmICFkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blsZ7mgKfliqDlhaVcbiAgICAgIHNldC5hZGQoa2V5KTtcbiAgICB9XG4gICAgLy8g57un5om/5bGe5oCnXG4gICAgaWYgKGV4dGVuZCkge1xuICAgICAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgICBpZiAoX19wcm90b19fICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudEtleXMgPSB0aGlzLmtleXMoX19wcm90b19fLCBvcHRpb25zKTtcbiAgICAgICAgZm9yIChjb25zdCBwYXJlbnRLZXkgb2YgcGFyZW50S2V5cykge1xuICAgICAgICAgIHNldC5hZGQocGFyZW50S2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyDov5Tlm57mlbDnu4RcbiAgICByZXR1cm4gQXJyYXkuZnJvbShzZXQpO1xuICB9XG4gIC8qKlxuICAgKiDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvcnPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMgeyhQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkKVtdfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3JzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IF9rZXlzID0gdGhpcy5rZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9rZXlzLm1hcChrZXkgPT4gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KSk7XG4gIH1cbiAgLyoqXG4gICAqIOWvueW6lCBrZXlzIOiOt+WPliBkZXNjcmlwdG9yRW50cmllc++8jOS8oOWPguWQjCBrZXlzIOaWueazleOAguWPr+eUqOS6jumHjeWumuS5ieWxnuaAp1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7WyosKFByb3BlcnR5RGVzY3JpcHRvcnx1bmRlZmluZWQpXVtdfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3JFbnRyaWVzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IF9rZXlzID0gdGhpcy5rZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF9rZXlzLm1hcChrZXkgPT4gW2tleSwgdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KV0pO1xuICB9XG4gIC8qKlxuICAgKiDov4fmu6Tlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHBpY2sg5oyR6YCJ5bGe5oCnXG4gICAqIEBwYXJhbSBvbWl0IOW/veeVpeWxnuaAp1xuICAgKiBAcGFyYW0gZW1wdHlQaWNrIHBpY2sg5Li656m65pe255qE5Y+W5YC844CCYWxsIOWFqOmDqGtlee+8jGVtcHR5IOepulxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOWQjCBuYW1lc1RvQXJyYXkg55qEIHNlcGFyYXRvciDlj4LmlbBcbiAgICogQHBhcmFtIHN5bWJvbCDlkIwga2V5cyDnmoQgc3ltYm9sIOWPguaVsFxuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDlkIwga2V5cyDnmoQgbm90RW51bWVyYWJsZSDlj4LmlbBcbiAgICogQHBhcmFtIGV4dGVuZCDlkIwga2V5cyDnmoQgZXh0ZW5kIOWPguaVsFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZmlsdGVyKG9iamVjdCwgeyBwaWNrID0gW10sIG9taXQgPSBbXSwgZW1wdHlQaWNrID0gJ2FsbCcsIHNlcGFyYXRvciA9ICcsJywgc3ltYm9sID0gdHJ1ZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSB0cnVlIH0gPSB7fSkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAvLyBwaWNr44CBb21pdCDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgICBwaWNrID0gX1N1cHBvcnQubmFtZXNUb0FycmF5KHBpY2ssIHsgc2VwYXJhdG9yIH0pO1xuICAgIG9taXQgPSBfU3VwcG9ydC5uYW1lc1RvQXJyYXkob21pdCwgeyBzZXBhcmF0b3IgfSk7XG4gICAgbGV0IF9rZXlzID0gW107XG4gICAgLy8gcGlja+acieWAvOebtOaOpeaLv++8jOS4uuepuuaXtuagueaNriBlbXB0eVBpY2sg6buY6K6k5ou/56m65oiW5YWo6YOoa2V5XG4gICAgX2tleXMgPSBwaWNrLmxlbmd0aCA+IDAgfHwgZW1wdHlQaWNrID09PSAnZW1wdHknID8gcGljayA6IHRoaXMua2V5cyhvYmplY3QsIHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfSk7XG4gICAgLy8gb21pdOetm+mAiVxuICAgIF9rZXlzID0gX2tleXMuZmlsdGVyKGtleSA9PiAhb21pdC5pbmNsdWRlcyhrZXkpKTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBfa2V5cykge1xuICAgICAgY29uc3QgZGVzYyA9IHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG4gICAgICAvLyDlsZ7mgKfkuI3lrZjlnKjlr7zoh7RkZXNj5b6X5YiwdW5kZWZpbmVk5pe25LiN6K6+572u5YC8XG4gICAgICBpZiAoZGVzYykge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiDpgJrov4fmjJHpgInmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXIg55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgcGljayhvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBwaWNrOiBrZXlzLCBlbXB0eVBpY2s6ICdlbXB0eScsIC4uLm9wdGlvbnMgfSk7XG4gIH1cbiAgLyoqXG4gICAqIOmAmui/h+aOkumZpOaWueW8j+mAieWPluWvueixoeOAgmZpbHRlciDnmoTnroDlhpnmlrnlvI9cbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIGtleXMg5bGe5oCn5ZCN6ZuG5ZCIXG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBvbWl0KG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIob2JqZWN0LCB7IG9taXQ6IGtleXMsIC4uLm9wdGlvbnMgfSk7XG4gIH1cbn1cbiIsIi8qKlxuICogZXNsaW50IOmFjee9ru+8mmh0dHA6Ly9lc2xpbnQuY24vZG9jcy9ydWxlcy9cbiAqIGVzbGludC1wbHVnaW4tdnVlIOmFjee9ru+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy9ydWxlcy9cbiAqL1xuaW1wb3J0IHsgX09iamVjdCwgX0RhdGEgfSBmcm9tICcuLi9iYXNlJztcblxuLyoqXG4gKiDlr7zlh7rluLjph4/kvr/mjbfkvb/nlKhcbiAqL1xuZXhwb3J0IGNvbnN0IE9GRiA9ICdvZmYnO1xuZXhwb3J0IGNvbnN0IFdBUk4gPSAnd2Fybic7XG5leHBvcnQgY29uc3QgRVJST1IgPSAnZXJyb3InO1xuLyoqXG4gKiDlrprliLbnmoTphY3nva5cbiAqL1xuLy8g5Z+656GA5a6a5Yi2XG5leHBvcnQgY29uc3QgYmFzZUNvbmZpZyA9IHtcbiAgLy8g546v5aKD44CC5LiA5Liq546v5aKD5a6a5LmJ5LqG5LiA57uE6aKE5a6a5LmJ55qE5YWo5bGA5Y+Y6YePXG4gIGVudjoge1xuICAgIGJyb3dzZXI6IHRydWUsXG4gICAgbm9kZTogdHJ1ZSxcbiAgfSxcbiAgLy8g5YWo5bGA5Y+Y6YePXG4gIGdsb2JhbHM6IHtcbiAgICBnbG9iYWxUaGlzOiAncmVhZG9ubHknLFxuICAgIEJpZ0ludDogJ3JlYWRvbmx5JyxcbiAgfSxcbiAgLy8g6Kej5p6Q5ZmoXG4gIHBhcnNlck9wdGlvbnM6IHtcbiAgICBlY21hVmVyc2lvbjogJ2xhdGVzdCcsXG4gICAgc291cmNlVHlwZTogJ21vZHVsZScsXG4gICAgZWNtYUZlYXR1cmVzOiB7XG4gICAgICBqc3g6IHRydWUsXG4gICAgICBleHBlcmltZW50YWxPYmplY3RSZXN0U3ByZWFkOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIC8qKlxuICAgKiDnu6fmib9cbiAgICog5L2/55SoZXNsaW5055qE6KeE5YiZ77yaZXNsaW50OumFjee9ruWQjeensFxuICAgKiDkvb/nlKjmj5Lku7bnmoTphY3nva7vvJpwbHVnaW465YyF5ZCN566A5YaZL+mFjee9ruWQjeensFxuICAgKi9cbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCBlc2xpbnQg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ2VzbGludDpyZWNvbW1lbmRlZCcsXG4gIF0sXG4gIC8qKlxuICAgKiDop4TliJlcbiAgICog5p2l6IeqIGVzbGludCDnmoTop4TliJnvvJrop4TliJlJRCA6IHZhbHVlXG4gICAqIOadpeiHquaPkuS7tueahOinhOWIme+8muWMheWQjeeugOWGmS/op4TliJlJRCA6IHZhbHVlXG4gICAqL1xuICBydWxlczoge1xuICAgIC8qKlxuICAgICAqIFBvc3NpYmxlIEVycm9yc1xuICAgICAqIOi/meS6m+inhOWImeS4jiBKYXZhU2NyaXB0IOS7o+eggeS4reWPr+iDveeahOmUmeivr+aIlumAu+i+kemUmeivr+acieWFs++8mlxuICAgICAqL1xuICAgICdnZXR0ZXItcmV0dXJuJzogT0ZGLCAvLyDlvLrliLYgZ2V0dGVyIOWHveaVsOS4reWHuueOsCByZXR1cm4g6K+t5Y+lXG4gICAgJ25vLWNvbnN0YW50LWNvbmRpdGlvbic6IE9GRiwgLy8g56aB5q2i5Zyo5p2h5Lu25Lit5L2/55So5bi46YeP6KGo6L6+5byPXG4gICAgJ25vLWVtcHR5JzogT0ZGLCAvLyDnpoHmraLlh7rnjrDnqbror63lj6XlnZdcbiAgICAnbm8tZXh0cmEtc2VtaSc6IFdBUk4sIC8vIOemgeatouS4jeW/heimgeeahOWIhuWPt1xuICAgICduby1mdW5jLWFzc2lnbic6IE9GRiwgLy8g56aB5q2i5a+5IGZ1bmN0aW9uIOWjsOaYjumHjeaWsOi1i+WAvFxuICAgICduby1wcm90b3R5cGUtYnVpbHRpbnMnOiBPRkYsIC8vIOemgeatouebtOaOpeiwg+eUqCBPYmplY3QucHJvdG90eXBlcyDnmoTlhoXnva7lsZ7mgKdcblxuICAgIC8qKlxuICAgICAqIEJlc3QgUHJhY3RpY2VzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5piv5YWz5LqO5pyA5L2z5a6e6Le155qE77yM5biu5Yqp5L2g6YG/5YWN5LiA5Lqb6Zeu6aKY77yaXG4gICAgICovXG4gICAgJ2FjY2Vzc29yLXBhaXJzJzogRVJST1IsIC8vIOW8uuWItiBnZXR0ZXIg5ZKMIHNldHRlciDlnKjlr7nosaHkuK3miJDlr7nlh7rnjrBcbiAgICAnYXJyYXktY2FsbGJhY2stcmV0dXJuJzogV0FSTiwgLy8g5by65Yi25pWw57uE5pa55rOV55qE5Zue6LCD5Ye95pWw5Lit5pyJIHJldHVybiDor63lj6VcbiAgICAnYmxvY2stc2NvcGVkLXZhcic6IEVSUk9SLCAvLyDlvLrliLbmiorlj5jph4/nmoTkvb/nlKjpmZDliLblnKjlhbblrprkuYnnmoTkvZznlKjln5/ojIPlm7TlhoVcbiAgICAnY3VybHknOiBXQVJOLCAvLyDlvLrliLbmiYDmnInmjqfliLbor63lj6Xkvb/nlKjkuIDoh7TnmoTmi6zlj7fpo47moLxcbiAgICAnbm8tZmFsbHRocm91Z2gnOiBXQVJOLCAvLyDnpoHmraIgY2FzZSDor63lj6XokL3nqbpcbiAgICAnbm8tZmxvYXRpbmctZGVjaW1hbCc6IEVSUk9SLCAvLyDnpoHmraLmlbDlrZflrZfpnaLph4/kuK3kvb/nlKjliY3lr7zlkozmnKvlsL7lsI/mlbDngrlcbiAgICAnbm8tbXVsdGktc3BhY2VzJzogV0FSTiwgLy8g56aB5q2i5L2/55So5aSa5Liq56m65qC8XG4gICAgJ25vLW5ldy13cmFwcGVycyc6IEVSUk9SLCAvLyDnpoHmraLlr7kgU3RyaW5n77yMTnVtYmVyIOWSjCBCb29sZWFuIOS9v+eUqCBuZXcg5pON5L2c56ymXG4gICAgJ25vLXByb3RvJzogRVJST1IsIC8vIOemgeeUqCBfX3Byb3RvX18g5bGe5oCnXG4gICAgJ25vLXJldHVybi1hc3NpZ24nOiBXQVJOLCAvLyDnpoHmraLlnKggcmV0dXJuIOivreWPpeS4reS9v+eUqOi1i+WAvOivreWPpVxuICAgICduby11c2VsZXNzLWVzY2FwZSc6IFdBUk4sIC8vIOemgeeUqOS4jeW/heimgeeahOi9rOS5ieWtl+esplxuXG4gICAgLyoqXG4gICAgICogVmFyaWFibGVzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5LiO5Y+Y6YeP5aOw5piO5pyJ5YWz77yaXG4gICAgICovXG4gICAgJ25vLXVuZGVmLWluaXQnOiBXQVJOLCAvLyDnpoHmraLlsIblj5jph4/liJ3lp4vljJbkuLogdW5kZWZpbmVkXG4gICAgJ25vLXVudXNlZC12YXJzJzogT0ZGLCAvLyDnpoHmraLlh7rnjrDmnKrkvb/nlKjov4fnmoTlj5jph49cbiAgICAnbm8tdXNlLWJlZm9yZS1kZWZpbmUnOiBbRVJST1IsIHsgJ2Z1bmN0aW9ucyc6IGZhbHNlLCAnY2xhc3Nlcyc6IGZhbHNlLCAndmFyaWFibGVzJzogZmFsc2UgfV0sIC8vIOemgeatouWcqOWPmOmHj+WumuS5ieS5i+WJjeS9v+eUqOWug+S7rFxuXG4gICAgLyoqXG4gICAgICogU3R5bGlzdGljIElzc3Vlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6jumjjuagvOaMh+WNl+eahO+8jOiAjOS4lOaYr+mdnuW4uOS4u+ingueahO+8mlxuICAgICAqL1xuICAgICdhcnJheS1icmFja2V0LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbmlbDnu4Tmlrnmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnYmxvY2stc3BhY2luZyc6IFdBUk4sIC8vIOemgeatouaIluW8uuWItuWcqOS7o+eggeWdl+S4reW8gOaLrOWPt+WJjeWSjOmXreaLrOWPt+WQjuacieepuuagvFxuICAgICdicmFjZS1zdHlsZSc6IFtXQVJOLCAnMXRicycsIHsgJ2FsbG93U2luZ2xlTGluZSc6IHRydWUgfV0sIC8vIOW8uuWItuWcqOS7o+eggeWdl+S4reS9v+eUqOS4gOiHtOeahOWkp+aLrOWPt+mjjuagvFxuICAgICdjb21tYS1kYW5nbGUnOiBbV0FSTiwgJ2Fsd2F5cy1tdWx0aWxpbmUnXSwgLy8g6KaB5rGC5oiW56aB5q2i5pyr5bC+6YCX5Y+3XG4gICAgJ2NvbW1hLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjpgJflj7fliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnY29tbWEtc3R5bGUnOiBXQVJOLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTpgJflj7fpo47moLxcbiAgICAnY29tcHV0ZWQtcHJvcGVydHktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOiuoeeul+eahOWxnuaAp+eahOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdmdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouWcqOWHveaVsOagh+ivhuespuWSjOWFtuiwg+eUqOS5i+mXtOacieepuuagvFxuICAgICdmdW5jdGlvbi1wYXJlbi1uZXdsaW5lJzogV0FSTiwgLy8g5by65Yi25Zyo5Ye95pWw5ous5Y+35YaF5L2/55So5LiA6Ie055qE5o2i6KGMXG4gICAgJ2ltcGxpY2l0LWFycm93LWxpbmVicmVhayc6IFdBUk4sIC8vIOW8uuWItumakOW8j+i/lOWbnueahOeureWktOWHveaVsOS9k+eahOS9jee9rlxuICAgICdpbmRlbnQnOiBbV0FSTiwgMiwgeyAnU3dpdGNoQ2FzZSc6IDEgfV0sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOe8qei/m1xuICAgICdqc3gtcXVvdGVzJzogV0FSTiwgLy8g5by65Yi25ZyoIEpTWCDlsZ7mgKfkuK3kuIDoh7TlnLDkvb/nlKjlj4zlvJXlj7fmiJbljZXlvJXlj7dcbiAgICAna2V5LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlr7nosaHlrZfpnaLph4/nmoTlsZ7mgKfkuK3plK7lkozlgLzkuYvpl7Tkvb/nlKjkuIDoh7TnmoTpl7Tot51cbiAgICAna2V5d29yZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo5YWz6ZSu5a2X5YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ25ldy1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLbmiJbnpoHmraLosIPnlKjml6Dlj4LmnoTpgKDlh73mlbDml7bmnInlnIbmi6zlj7dcbiAgICAnbm8tbWl4ZWQtc3BhY2VzLWFuZC10YWJzJzogV0FSTixcbiAgICAnbm8tbXVsdGlwbGUtZW1wdHktbGluZXMnOiBbV0FSTiwgeyAnbWF4JzogMSwgJ21heEVPRic6IDAsICdtYXhCT0YnOiAwIH1dLCAvLyDnpoHmraLlh7rnjrDlpJrooYznqbrooYxcbiAgICAnbm8tdHJhaWxpbmctc3BhY2VzJzogV0FSTiwgLy8g56aB55So6KGM5bC+56m65qC8XG4gICAgJ25vLXdoaXRlc3BhY2UtYmVmb3JlLXByb3BlcnR5JzogV0FSTiwgLy8g56aB5q2i5bGe5oCn5YmN5pyJ56m655m9XG4gICAgJ25vbmJsb2NrLXN0YXRlbWVudC1ib2R5LXBvc2l0aW9uJzogV0FSTiwgLy8g5by65Yi25Y2V5Liq6K+t5Y+l55qE5L2N572uXG4gICAgJ29iamVjdC1jdXJseS1uZXdsaW5lJzogW1dBUk4sIHsgJ211bHRpbGluZSc6IHRydWUsICdjb25zaXN0ZW50JzogdHJ1ZSB9XSwgLy8g5by65Yi25aSn5ous5Y+35YaF5o2i6KGM56ym55qE5LiA6Ie05oCnXG4gICAgJ29iamVjdC1jdXJseS1zcGFjaW5nJzogW1dBUk4sICdhbHdheXMnXSwgLy8g5by65Yi25Zyo5aSn5ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3BhZGRlZC1ibG9ja3MnOiBbV0FSTiwgJ25ldmVyJ10sIC8vIOimgeaxguaIluemgeatouWdl+WGheWhq+WFhVxuICAgICdxdW90ZXMnOiBbV0FSTiwgJ3NpbmdsZScsIHsgJ2F2b2lkRXNjYXBlJzogdHJ1ZSwgJ2FsbG93VGVtcGxhdGVMaXRlcmFscyc6IHRydWUgfV0sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOWPjeWLvuWPt+OAgeWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdzZW1pJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5L2/55So5YiG5Y+35Luj5pu/IEFTSVxuICAgICdzZW1pLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbliIblj7fkuYvliY3lkozkuYvlkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc2VtaS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+eahOS9jee9rlxuICAgICdzcGFjZS1iZWZvcmUtYmxvY2tzJzogV0FSTiwgLy8g5by65Yi25Zyo5Z2X5LmL5YmN5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWJlZm9yZS1mdW5jdGlvbi1wYXJlbic6IFtXQVJOLCB7ICdhbm9ueW1vdXMnOiAnbmV2ZXInLCAnbmFtZWQnOiAnbmV2ZXInLCAnYXN5bmNBcnJvdyc6ICdhbHdheXMnIH1dLCAvLyDlvLrliLblnKggZnVuY3Rpb27nmoTlt6bmi6zlj7fkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW4tcGFyZW5zJzogV0FSTiwgLy8g5by65Yi25Zyo5ZyG5ous5Y+35YaF5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWluZml4LW9wcyc6IFdBUk4sIC8vIOimgeaxguaTjeS9nOespuWRqOWbtOacieepuuagvFxuICAgICdzcGFjZS11bmFyeS1vcHMnOiBXQVJOLCAvLyDlvLrliLblnKjkuIDlhYPmk43kvZznrKbliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2VkLWNvbW1lbnQnOiBXQVJOLCAvLyDlvLrliLblnKjms6jph4rkuK0gLy8g5oiWIC8qIOS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzd2l0Y2gtY29sb24tc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqCBzd2l0Y2gg55qE5YaS5Y+35bem5Y+z5pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLXRhZy1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5qih5p2/5qCH6K6w5ZKM5a6D5Lus55qE5a2X6Z2i6YeP5LmL6Ze055qE56m65qC8XG5cbiAgICAvKipcbiAgICAgKiBFQ01BU2NyaXB0IDZcbiAgICAgKiDov5nkupvop4TliJnlj6rkuI4gRVM2IOacieWFsywg5Y2z6YCa5bi45omA6K+055qEIEVTMjAxNe+8mlxuICAgICAqL1xuICAgICdhcnJvdy1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi2566t5aS05Ye95pWw55qE566t5aS05YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2dlbmVyYXRvci1zdGFyLXNwYWNpbmcnOiBbV0FSTiwgeyAnYmVmb3JlJzogZmFsc2UsICdhZnRlcic6IHRydWUsICdtZXRob2QnOiB7ICdiZWZvcmUnOiB0cnVlLCAnYWZ0ZXInOiBmYWxzZSB9IH1dLCAvLyDlvLrliLYgZ2VuZXJhdG9yIOWHveaVsOS4rSAqIOWPt+WRqOWbtOS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICduby11c2VsZXNzLXJlbmFtZSc6IFdBUk4sIC8vIOemgeatouWcqCBpbXBvcnQg5ZKMIGV4cG9ydCDlkozop6PmnoTotYvlgLzml7blsIblvJXnlKjph43lkb3lkI3kuLrnm7jlkIznmoTlkI3lrZdcbiAgICAncHJlZmVyLXRlbXBsYXRlJzogV0FSTiwgLy8g6KaB5rGC5L2/55So5qih5p2/5a2X6Z2i6YeP6ICM6Z2e5a2X56ym5Liy6L+e5o6lXG4gICAgJ3Jlc3Qtc3ByZWFkLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbliankvZnlkozmianlsZXov5DnrpfnrKblj4rlhbbooajovr7lvI/kuYvpl7TmnInnqbrmoLxcbiAgICAndGVtcGxhdGUtY3VybHktc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouaooeadv+Wtl+espuS4suS4reeahOW1jOWFpeihqOi+vuW8j+WRqOWbtOepuuagvOeahOS9v+eUqFxuICAgICd5aWVsZC1zdGFyLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKggeWllbGQqIOihqOi+vuW8j+S4rSAqIOWRqOWbtOS9v+eUqOepuuagvFxuICB9LFxuICAvLyDopobnm5ZcbiAgb3ZlcnJpZGVzOiBbXSxcbn07XG4vLyB2dWUyL3Z1ZTMg5YWx55SoXG5leHBvcnQgY29uc3QgdnVlQ29tbW9uQ29uZmlnID0ge1xuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbXVsdGktd29yZC1jb21wb25lbnQtbmFtZXMnOiBPRkYsIC8vIOimgeaxgue7hOS7tuWQjeensOWni+e7iOS4uuWkmuWtl1xuICAgICd2dWUvbm8tdW51c2VkLWNvbXBvbmVudHMnOiBXQVJOLCAvLyDmnKrkvb/nlKjnmoTnu4Tku7ZcbiAgICAndnVlL25vLXVudXNlZC12YXJzJzogT0ZGLCAvLyDmnKrkvb/nlKjnmoTlj5jph49cbiAgICAndnVlL3JlcXVpcmUtcmVuZGVyLXJldHVybic6IFdBUk4sIC8vIOW8uuWItua4suafk+WHveaVsOaAu+aYr+i/lOWbnuWAvFxuICAgICd2dWUvcmVxdWlyZS12LWZvci1rZXknOiBPRkYsIC8vIHYtZm9y5Lit5b+F6aG75L2/55Soa2V5XG4gICAgJ3Z1ZS9yZXR1cm4taW4tY29tcHV0ZWQtcHJvcGVydHknOiBXQVJOLCAvLyDlvLrliLbov5Tlm57or63lj6XlrZjlnKjkuo7orqHnrpflsZ7mgKfkuK1cbiAgICAndnVlL3ZhbGlkLXRlbXBsYXRlLXJvb3QnOiBPRkYsIC8vIOW8uuWItuacieaViOeahOaooeadv+aguVxuICAgICd2dWUvdmFsaWQtdi1mb3InOiBPRkYsIC8vIOW8uuWItuacieaViOeahHYtZm9y5oyH5LukXG4gICAgLy8gUHJpb3JpdHkgQjogU3Ryb25nbHkgUmVjb21tZW5kZWRcbiAgICAndnVlL2F0dHJpYnV0ZS1oeXBoZW5hdGlvbic6IE9GRiwgLy8g5by65Yi25bGe5oCn5ZCN5qC85byPXG4gICAgJ3Z1ZS9jb21wb25lbnQtZGVmaW5pdGlvbi1uYW1lLWNhc2luZyc6IE9GRiwgLy8g5by65Yi257uE5Lu2bmFtZeagvOW8j1xuICAgICd2dWUvaHRtbC1xdW90ZXMnOiBbV0FSTiwgJ2RvdWJsZScsIHsgJ2F2b2lkRXNjYXBlJzogdHJ1ZSB9XSwgLy8g5by65Yi2IEhUTUwg5bGe5oCn55qE5byV5Y+35qC35byPXG4gICAgJ3Z1ZS9odG1sLXNlbGYtY2xvc2luZyc6IE9GRiwgLy8g5L2/55So6Ieq6Zet5ZCI5qCH562+XG4gICAgJ3Z1ZS9tYXgtYXR0cmlidXRlcy1wZXItbGluZSc6IFtXQVJOLCB7ICdzaW5nbGVsaW5lJzogSW5maW5pdHksICdtdWx0aWxpbmUnOiAxIH1dLCAvLyDlvLrliLbmr4/ooYzljIXlkKvnmoTmnIDlpKflsZ7mgKfmlbBcbiAgICAndnVlL211bHRpbGluZS1odG1sLWVsZW1lbnQtY29udGVudC1uZXdsaW5lJzogT0ZGLCAvLyDpnIDopoHlnKjlpJrooYzlhYPntKDnmoTlhoXlrrnliY3lkI7mjaLooYxcbiAgICAndnVlL3Byb3AtbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOS4uiBWdWUg57uE5Lu25Lit55qEIFByb3Ag5ZCN56ew5by65Yi25omn6KGM54m55a6a5aSn5bCP5YaZXG4gICAgJ3Z1ZS9yZXF1aXJlLWRlZmF1bHQtcHJvcCc6IE9GRiwgLy8gcHJvcHPpnIDopoHpu5jorqTlgLxcbiAgICAndnVlL3NpbmdsZWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5Y2V6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS92LWJpbmQtc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtYmluZOaMh+S7pOmjjuagvFxuICAgICd2dWUvdi1vbi1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1vbuaMh+S7pOmjjuagvFxuICAgICd2dWUvdi1zbG90LXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LXNsb3TmjIfku6Tpo47moLxcbiAgICAvLyBQcmlvcml0eSBDOiBSZWNvbW1lbmRlZFxuICAgICd2dWUvbm8tdi1odG1sJzogT0ZGLCAvLyDnpoHmraLkvb/nlKh2LWh0bWxcbiAgICAvLyBVbmNhdGVnb3JpemVkXG4gICAgJ3Z1ZS9ibG9jay10YWctbmV3bGluZSc6IFdBUk4sIC8vICDlnKjmiZPlvIDlnZfnuqfmoIforrDkuYvlkI7lkozlhbPpl63lnZfnuqfmoIforrDkuYvliY3lvLrliLbmjaLooYxcbiAgICAndnVlL2h0bWwtY29tbWVudC1jb250ZW50LXNwYWNpbmcnOiBXQVJOLCAvLyDlnKhIVE1M5rOo6YeK5Lit5by65Yi257uf5LiA55qE56m65qC8XG4gICAgJ3Z1ZS9zY3JpcHQtaW5kZW50JzogW1dBUk4sIDIsIHsgJ2Jhc2VJbmRlbnQnOiAxLCAnc3dpdGNoQ2FzZSc6IDEgfV0sIC8vIOWcqDxzY3JpcHQ+5Lit5by65Yi25LiA6Ie055qE57yp6L+bXG4gICAgLy8gRXh0ZW5zaW9uIFJ1bGVz44CC5a+55bqUZXNsaW5055qE5ZCM5ZCN6KeE5YiZ77yM6YCC55So5LqOPHRlbXBsYXRlPuS4reeahOihqOi+vuW8j1xuICAgICd2dWUvYXJyYXktYnJhY2tldC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2Jsb2NrLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvYnJhY2Utc3R5bGUnOiBbV0FSTiwgJzF0YnMnLCB7ICdhbGxvd1NpbmdsZUxpbmUnOiB0cnVlIH1dLFxuICAgICd2dWUvY29tbWEtZGFuZ2xlJzogW1dBUk4sICdhbHdheXMtbXVsdGlsaW5lJ10sXG4gICAgJ3Z1ZS9jb21tYS1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2NvbW1hLXN0eWxlJzogV0FSTixcbiAgICAndnVlL2Z1bmMtY2FsbC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2tleS1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2tleXdvcmQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9vYmplY3QtY3VybHktbmV3bGluZSc6IFtXQVJOLCB7ICdtdWx0aWxpbmUnOiB0cnVlLCAnY29uc2lzdGVudCc6IHRydWUgfV0sXG4gICAgJ3Z1ZS9vYmplY3QtY3VybHktc3BhY2luZyc6IFtXQVJOLCAnYWx3YXlzJ10sXG4gICAgJ3Z1ZS9zcGFjZS1pbi1wYXJlbnMnOiBXQVJOLFxuICAgICd2dWUvc3BhY2UtaW5maXgtb3BzJzogV0FSTixcbiAgICAndnVlL3NwYWNlLXVuYXJ5LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9hcnJvdy1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sXG4gIH0sXG4gIG92ZXJyaWRlczogW1xuICAgIHtcbiAgICAgICdmaWxlcyc6IFsnKi52dWUnXSxcbiAgICAgICdydWxlcyc6IHtcbiAgICAgICAgJ2luZGVudCc6IE9GRixcbiAgICAgIH0sXG4gICAgfSxcbiAgXSxcbn07XG4vLyB2dWUy55SoXG5leHBvcnQgY29uc3QgdnVlMkNvbmZpZyA9IG1lcmdlKHZ1ZUNvbW1vbkNvbmZpZywge1xuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIHZ1ZTIg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ3BsdWdpbjp2dWUvcmVjb21tZW5kZWQnLFxuICBdLFxufSk7XG4vLyB2dWUz55SoXG5leHBvcnQgY29uc3QgdnVlM0NvbmZpZyA9IG1lcmdlKHZ1ZUNvbW1vbkNvbmZpZywge1xuICBlbnY6IHtcbiAgICAndnVlL3NldHVwLWNvbXBpbGVyLW1hY3Jvcyc6IHRydWUsIC8vIOWkhOeQhnNldHVw5qih5p2/5Lit5YOPIGRlZmluZVByb3BzIOWSjCBkZWZpbmVFbWl0cyDov5nmoLfnmoTnvJbor5Hlmajlro/miqUgbm8tdW5kZWYg55qE6Zeu6aKY77yaaHR0cHM6Ly9lc2xpbnQudnVlanMub3JnL3VzZXItZ3VpZGUvI2NvbXBpbGVyLW1hY3Jvcy1zdWNoLWFzLWRlZmluZXByb3BzLWFuZC1kZWZpbmVlbWl0cy1nZW5lcmF0ZS1uby11bmRlZi13YXJuaW5nc1xuICB9LFxuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIHZ1ZTMg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ3BsdWdpbjp2dWUvdnVlMy1yZWNvbW1lbmRlZCcsXG4gIF0sXG4gIHJ1bGVzOiB7XG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsXG4gICAgJ3Z1ZS9uby10ZW1wbGF0ZS1rZXknOiBPRkYsIC8vIOemgeatojx0ZW1wbGF0ZT7kuK3kvb/nlKhrZXnlsZ7mgKdcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWwgZm9yIFZ1ZS5qcyAzLnhcbiAgICAndnVlL3JldHVybi1pbi1lbWl0cy12YWxpZGF0b3InOiBXQVJOLCAvLyDlvLrliLblnKhlbWl0c+mqjOivgeWZqOS4reWtmOWcqOi/lOWbnuivreWPpVxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXF1aXJlLWV4cGxpY2l0LWVtaXRzJzogT0ZGLCAvLyDpnIDopoFlbWl0c+S4reWumuS5iemAiemhueeUqOS6jiRlbWl0KClcbiAgICAndnVlL3Ytb24tZXZlbnQtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOWcqOaooeadv+S4reeahOiHquWumuS5iee7hOS7tuS4iuW8uuWItuaJp+ihjCB2LW9uIOS6i+S7tuWRveWQjeagt+W8j1xuICB9LFxufSk7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UoLi4ub2JqZWN0cykge1xuICBjb25zdCBbdGFyZ2V0LCAuLi5zb3VyY2VzXSA9IG9iamVjdHM7XG4gIGNvbnN0IHJlc3VsdCA9IF9EYXRhLmRlZXBDbG9uZSh0YXJnZXQpO1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc291cmNlKSkge1xuICAgICAgLy8g54m55q6K5a2X5q615aSE55CGXG4gICAgICBpZiAoa2V5ID09PSAncnVsZXMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsga2V5LCB2YWx1ZSwgJ3Jlc3VsdFtrZXldJzogcmVzdWx0W2tleV0gfSk7XG4gICAgICAgIC8vIOWIneWni+S4jeWtmOWcqOaXtui1i+m7mOiupOWAvOeUqOS6juWQiOW5tlxuICAgICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9O1xuICAgICAgICAvLyDlr7nlkITmnaHop4TliJnlpITnkIZcbiAgICAgICAgZm9yIChsZXQgW3J1bGVLZXksIHJ1bGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG4gICAgICAgICAgLy8g5bey5pyJ5YC857uf5LiA5oiQ5pWw57uE5aSE55CGXG4gICAgICAgICAgbGV0IHNvdXJjZVJ1bGVWYWx1ZSA9IHJlc3VsdFtrZXldW3J1bGVLZXldID8/IFtdO1xuICAgICAgICAgIGlmICghKHNvdXJjZVJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlID0gW3NvdXJjZVJ1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOimgeWQiOW5tueahOWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGlmICghKHJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgcnVsZVZhbHVlID0gW3J1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOe7n+S4gOagvOW8j+WQjui/m+ihjOaVsOe7hOW+queOr+aTjeS9nFxuICAgICAgICAgIGZvciAoY29uc3QgW3ZhbEluZGV4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHJ1bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIOWvueixoea3seWQiOW5tu+8jOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgICAgICAgaWYgKF9EYXRhLmdldEV4YWN0VHlwZSh2YWwpID09PSBPYmplY3QpIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IF9PYmplY3QuZGVlcEFzc2lnbihzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID8/IHt9LCB2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g6LWL5YC86KeE5YiZ57uT5p6cXG4gICAgICAgICAgcmVzdWx0W2tleV1bcnVsZUtleV0gPSBzb3VyY2VSdWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blrZfmrrXmoLnmja7nsbvlnovliKTmlq3lpITnkIZcbiAgICAgIC8vIOaVsOe7hO+8muaLvOaOpVxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8gW10pLnB1c2goLi4udmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWvueixoe+8mua3seWQiOW5tlxuICAgICAgaWYgKF9EYXRhLmdldEV4YWN0VHlwZSh2YWx1ZSkgPT09IE9iamVjdCkge1xuICAgICAgICBfT2JqZWN0LmRlZXBBc3NpZ24ocmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyB7fSwgdmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICog5L2/55So5a6a5Yi255qE6YWN572uXG4gKiBAcGFyYW0ge33vvJrphY3nva7poblcbiAqICAgICAgICAgIGJhc2XvvJrkvb/nlKjln7rnoYBlc2xpbnTlrprliLbvvIzpu5jorqQgdHJ1ZVxuICogICAgICAgICAgdnVlVmVyc2lvbu+8mnZ1ZeeJiOacrO+8jOW8gOWQr+WQjumcgOimgeWuieijhSBlc2xpbnQtcGx1Z2luLXZ1ZVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlKHsgYmFzZSA9IHRydWUsIHZ1ZVZlcnNpb24gfSA9IHt9KSB7XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgaWYgKGJhc2UpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIGJhc2VDb25maWcpO1xuICB9XG4gIGlmICh2dWVWZXJzaW9uID09IDIpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTJDb25maWcpO1xuICB9IGVsc2UgaWYgKHZ1ZVZlcnNpb24gPT0gMykge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgdnVlM0NvbmZpZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8vIOWfuuehgOWumuWItlxuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSB7XG4gIGJhc2U6ICcuLycsXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBmczoge1xuICAgICAgc3RyaWN0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgLy8g5Yir5ZCNXG4gICAgYWxpYXM6IHtcbiAgICAgIC8vICdAcm9vdCc6IHJlc29sdmUoX19kaXJuYW1lKSxcbiAgICAgIC8vICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIOinhOWumuinpuWPkeitpuWRiueahCBjaHVuayDlpKflsI/jgILvvIjku6Uga2JzIOS4uuWNleS9je+8iVxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMiAqKiAxMCxcbiAgICAvLyDoh6rlrprkuYnlupXlsYLnmoQgUm9sbHVwIOaJk+WMhemFjee9ruOAglxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyDlhaXlj6Pmlofku7blkI1cbiAgICAgICAgZW50cnlGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvZW50cnktJHtjaHVua0luZm8udHlwZX0tW25hbWVdLmpzYDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5Z2X5paH5Lu25ZCNXG4gICAgICAgIGNodW5rRmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOi1hOa6kOaWh+S7tuWQje+8jGNzc+OAgeWbvueJh+etiVxuICAgICAgICBhc3NldEZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uW2V4dF1gO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcbiIsIi8vIOivt+axguaWueazlVxuZXhwb3J0IGNvbnN0IE1FVEhPRFMgPSBbJ0dFVCcsICdIRUFEJywgJ1BPU1QnLCAnUFVUJywgJ0RFTEVURScsICdDT05ORUNUJywgJ09QVElPTlMnLCAnVFJBQ0UnLCAnUEFUQ0gnXTtcbi8vIGh0dHAg54q25oCB56CBXG5leHBvcnQgY29uc3QgU1RBVFVTRVMgPSBbXG4gIHsgJ3N0YXR1cyc6IDEwMCwgJ3N0YXR1c1RleHQnOiAnQ29udGludWUnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMSwgJ3N0YXR1c1RleHQnOiAnU3dpdGNoaW5nIFByb3RvY29scycgfSxcbiAgeyAnc3RhdHVzJzogMTAyLCAnc3RhdHVzVGV4dCc6ICdQcm9jZXNzaW5nJyB9LFxuICB7ICdzdGF0dXMnOiAxMDMsICdzdGF0dXNUZXh0JzogJ0Vhcmx5IEhpbnRzJyB9LFxuICB7ICdzdGF0dXMnOiAyMDAsICdzdGF0dXNUZXh0JzogJ09LJyB9LFxuICB7ICdzdGF0dXMnOiAyMDEsICdzdGF0dXNUZXh0JzogJ0NyZWF0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMiwgJ3N0YXR1c1RleHQnOiAnQWNjZXB0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMywgJ3N0YXR1c1RleHQnOiAnTm9uLUF1dGhvcml0YXRpdmUgSW5mb3JtYXRpb24nIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNCwgJ3N0YXR1c1RleHQnOiAnTm8gQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA1LCAnc3RhdHVzVGV4dCc6ICdSZXNldCBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDYsICdzdGF0dXNUZXh0JzogJ1BhcnRpYWwgQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA3LCAnc3RhdHVzVGV4dCc6ICdNdWx0aS1TdGF0dXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwOCwgJ3N0YXR1c1RleHQnOiAnQWxyZWFkeSBSZXBvcnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjI2LCAnc3RhdHVzVGV4dCc6ICdJTSBVc2VkJyB9LFxuICB7ICdzdGF0dXMnOiAzMDAsICdzdGF0dXNUZXh0JzogJ011bHRpcGxlIENob2ljZXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMSwgJ3N0YXR1c1RleHQnOiAnTW92ZWQgUGVybWFuZW50bHknIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMiwgJ3N0YXR1c1RleHQnOiAnRm91bmQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMywgJ3N0YXR1c1RleHQnOiAnU2VlIE90aGVyJyB9LFxuICB7ICdzdGF0dXMnOiAzMDQsICdzdGF0dXNUZXh0JzogJ05vdCBNb2RpZmllZCcgfSxcbiAgeyAnc3RhdHVzJzogMzA1LCAnc3RhdHVzVGV4dCc6ICdVc2UgUHJveHknIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNywgJ3N0YXR1c1RleHQnOiAnVGVtcG9yYXJ5IFJlZGlyZWN0JyB9LFxuICB7ICdzdGF0dXMnOiAzMDgsICdzdGF0dXNUZXh0JzogJ1Blcm1hbmVudCBSZWRpcmVjdCcgfSxcbiAgeyAnc3RhdHVzJzogNDAwLCAnc3RhdHVzVGV4dCc6ICdCYWQgUmVxdWVzdCcgfSxcbiAgeyAnc3RhdHVzJzogNDAxLCAnc3RhdHVzVGV4dCc6ICdVbmF1dGhvcml6ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMiwgJ3N0YXR1c1RleHQnOiAnUGF5bWVudCBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDAzLCAnc3RhdHVzVGV4dCc6ICdGb3JiaWRkZW4nIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNCwgJ3N0YXR1c1RleHQnOiAnTm90IEZvdW5kJyB9LFxuICB7ICdzdGF0dXMnOiA0MDUsICdzdGF0dXNUZXh0JzogJ01ldGhvZCBOb3QgQWxsb3dlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA2LCAnc3RhdHVzVGV4dCc6ICdOb3QgQWNjZXB0YWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNDA3LCAnc3RhdHVzVGV4dCc6ICdQcm94eSBBdXRoZW50aWNhdGlvbiBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA4LCAnc3RhdHVzVGV4dCc6ICdSZXF1ZXN0IFRpbWVvdXQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwOSwgJ3N0YXR1c1RleHQnOiAnQ29uZmxpY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMCwgJ3N0YXR1c1RleHQnOiAnR29uZScgfSxcbiAgeyAnc3RhdHVzJzogNDExLCAnc3RhdHVzVGV4dCc6ICdMZW5ndGggUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMiwgJ3N0YXR1c1RleHQnOiAnUHJlY29uZGl0aW9uIEZhaWxlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDEzLCAnc3RhdHVzVGV4dCc6ICdQYXlsb2FkIFRvbyBMYXJnZScgfSxcbiAgeyAnc3RhdHVzJzogNDE0LCAnc3RhdHVzVGV4dCc6ICdVUkkgVG9vIExvbmcnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNSwgJ3N0YXR1c1RleHQnOiAnVW5zdXBwb3J0ZWQgTWVkaWEgVHlwZScgfSxcbiAgeyAnc3RhdHVzJzogNDE2LCAnc3RhdHVzVGV4dCc6ICdSYW5nZSBOb3QgU2F0aXNmaWFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNywgJ3N0YXR1c1RleHQnOiAnRXhwZWN0YXRpb24gRmFpbGVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTgsICdzdGF0dXNUZXh0JzogJ0lcXCdtIGEgVGVhcG90JyB9LFxuICB7ICdzdGF0dXMnOiA0MjEsICdzdGF0dXNUZXh0JzogJ01pc2RpcmVjdGVkIFJlcXVlc3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMiwgJ3N0YXR1c1RleHQnOiAnVW5wcm9jZXNzYWJsZSBFbnRpdHknIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMywgJ3N0YXR1c1RleHQnOiAnTG9ja2VkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjQsICdzdGF0dXNUZXh0JzogJ0ZhaWxlZCBEZXBlbmRlbmN5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjUsICdzdGF0dXNUZXh0JzogJ1RvbyBFYXJseScgfSxcbiAgeyAnc3RhdHVzJzogNDI2LCAnc3RhdHVzVGV4dCc6ICdVcGdyYWRlIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjgsICdzdGF0dXNUZXh0JzogJ1ByZWNvbmRpdGlvbiBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI5LCAnc3RhdHVzVGV4dCc6ICdUb28gTWFueSBSZXF1ZXN0cycgfSxcbiAgeyAnc3RhdHVzJzogNDMxLCAnc3RhdHVzVGV4dCc6ICdSZXF1ZXN0IEhlYWRlciBGaWVsZHMgVG9vIExhcmdlJyB9LFxuICB7ICdzdGF0dXMnOiA0NTEsICdzdGF0dXNUZXh0JzogJ1VuYXZhaWxhYmxlIEZvciBMZWdhbCBSZWFzb25zJyB9LFxuICB7ICdzdGF0dXMnOiA1MDAsICdzdGF0dXNUZXh0JzogJ0ludGVybmFsIFNlcnZlciBFcnJvcicgfSxcbiAgeyAnc3RhdHVzJzogNTAxLCAnc3RhdHVzVGV4dCc6ICdOb3QgSW1wbGVtZW50ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMiwgJ3N0YXR1c1RleHQnOiAnQmFkIEdhdGV3YXknIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMywgJ3N0YXR1c1RleHQnOiAnU2VydmljZSBVbmF2YWlsYWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNTA0LCAnc3RhdHVzVGV4dCc6ICdHYXRld2F5IFRpbWVvdXQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNSwgJ3N0YXR1c1RleHQnOiAnSFRUUCBWZXJzaW9uIE5vdCBTdXBwb3J0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNiwgJ3N0YXR1c1RleHQnOiAnVmFyaWFudCBBbHNvIE5lZ290aWF0ZXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNywgJ3N0YXR1c1RleHQnOiAnSW5zdWZmaWNpZW50IFN0b3JhZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwOCwgJ3N0YXR1c1RleHQnOiAnTG9vcCBEZXRlY3RlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTA5LCAnc3RhdHVzVGV4dCc6ICdCYW5kd2lkdGggTGltaXQgRXhjZWVkZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUxMCwgJ3N0YXR1c1RleHQnOiAnTm90IEV4dGVuZGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MTEsICdzdGF0dXNUZXh0JzogJ05ldHdvcmsgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnIH0sXG5dO1xuIl0sIm5hbWVzIjpbImJhc2VDb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDTyxNQUFNLFFBQVEsQ0FBQztBQUN0QjtBQUNBLEVBQUUsT0FBTyxNQUFNLEdBQUcsQ0FBQyxXQUFXO0FBQzlCLElBQUksSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtBQUNoRSxNQUFNLE9BQU8sU0FBUyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxJQUFJLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7QUFDaEUsTUFBTSxPQUFPLE1BQU0sQ0FBQztBQUNwQixLQUFLO0FBQ0wsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLEdBQUcsR0FBRyxDQUFDO0FBQ1A7QUFDQSxFQUFFLE9BQU8sSUFBSSxHQUFHLEVBQUU7QUFDbEI7QUFDQSxFQUFFLE9BQU8sS0FBSyxHQUFHO0FBQ2pCLElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLElBQUksR0FBRztBQUNoQixJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFO0FBQ3BCLElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDbEIsSUFBSSxNQUFNLENBQUMsQ0FBQztBQUNaLEdBQUc7QUFDSCxFQUFFLE9BQU8sWUFBWSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxTQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQzVELElBQUksSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO0FBQ2hDLE1BQU0sT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0QsS0FBSztBQUNMLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDbkMsTUFBTSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQzlFLEtBQUs7QUFDTCxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO0FBQ25DLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLEtBQUs7QUFDTCxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0sS0FBSyxDQUFDO0FBQ25CO0FBQ0EsRUFBRSxPQUFPLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUN4QyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ25DLE1BQU0sT0FBTyxFQUFFLENBQUM7QUFDaEIsS0FBSztBQUNMLElBQUksTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsSUFBSSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRztBQUN2RCxNQUFNLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNyQixNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUs7QUFDdkYsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDOUQsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLLENBQUM7QUFDTjtBQUNBLElBQUksT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDakUsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUMzQyxJQUFJLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDeEMsR0FBRztBQUNILEVBQUUsV0FBVyxDQUFDLEdBQUcsSUFBSSxFQUFFO0FBQ3ZCLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMzQjtBQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUMvQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ2hDLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQzVCLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztBQUM1QixPQUFPO0FBQ1A7QUFDQSxNQUFNLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO0FBQ3ZDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDbkMsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDeEMsTUFBTSxHQUFHLEdBQUc7QUFDWixRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN4QyxPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtBQUN6QyxNQUFNLEdBQUcsR0FBRztBQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN6QyxPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN2QyxNQUFNLEdBQUcsR0FBRztBQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BDLE9BQU87QUFDUCxLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ3hDLE1BQU0sR0FBRyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDckMsT0FBTztBQUNQLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDMUMsTUFBTSxHQUFHLEdBQUc7QUFDWixRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUN2QyxPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUMxQyxNQUFNLEdBQUcsR0FBRztBQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3ZDLE9BQU87QUFDUCxLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ3hDLE1BQU0sR0FBRyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkMsT0FBTztBQUNQLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRztBQUNIO0FBQ0EsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDN0I7QUFDQSxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ2pELE1BQU0sT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDN0IsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzNCLE1BQU0sT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDN0IsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUU7QUFDekI7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMzRCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFO0FBQ3hCO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEMsR0FBRztBQUNIO0FBQ0EsRUFBRSxRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUN6QjtBQUNBLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hDLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUU7QUFDMUI7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FFeEM7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFO0FBQ3ZCO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMzQixHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ08sTUFBTSxLQUFLLENBQUM7QUFDbkI7QUFDQSxFQUFFLE9BQU8sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLEVBQUUsT0FBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsRUFBRSxPQUFPLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxFQUFFLE9BQU8sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLEVBQUUsT0FBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsRUFBRSxPQUFPLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxFQUFFLE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkIsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxHQUFHO0FBQ0gsQ0FBQztBQUNNLE1BQU0sUUFBUSxDQUFDO0FBQ3RCO0FBQ0EsRUFBRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDM0IsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzRCxHQUFHO0FBQ0gsRUFBRSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDNUIsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLEdBQUc7QUFDSCxDQUFDO0FBQ00sTUFBTSxNQUFNLENBQUM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUN4QyxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzdCLE1BQU0sR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFO0FBQy9CLFFBQVEsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQ2hEO0FBQ0EsUUFBUSxJQUFJLEtBQUssWUFBWSxRQUFRLEVBQUU7QUFDdkMsVUFBVSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBUztBQUNUO0FBQ0EsUUFBUSxPQUFPLEtBQUssQ0FBQztBQUNyQixPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxHQUFHO0FBQ0gsQ0FBQztBQUNNLE1BQU0sT0FBTyxDQUFDO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUNyQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGdCQUFnQixDQUFDLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDckMsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEdBQUcsR0FBRyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDcEU7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEQ7QUFDQSxJQUFJLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSztBQUM5RCxNQUFNLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzlCLEtBQUssQ0FBQyxDQUFDO0FBQ1A7QUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzdDLE1BQU0sT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDOUMsTUFBTSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5QyxLQUFLO0FBQ0wsSUFBSSxPQUFPLFNBQVMsQ0FBQztBQUNyQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUN6RCxJQUFJLE9BQU8sSUFBSTtBQUNmO0FBQ0EsT0FBTyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hEO0FBQ0EsT0FBTyxXQUFXLEVBQUUsQ0FBQztBQUNyQixHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ08sTUFBTSxNQUFNLENBQUM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGFBQWEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUN6RCxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtBQUN0QixNQUFNLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RSxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ08sTUFBTSxLQUFLLENBQUM7QUFDbkI7QUFDQTtBQUNBLEVBQUUsT0FBTyxZQUFZLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLFlBQVksQ0FBQyxLQUFLLEVBQUU7QUFDN0I7QUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzNDLE1BQU0sT0FBTyxLQUFLLENBQUM7QUFDbkIsS0FBSztBQUNMLElBQUksTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRDtBQUNBLElBQUksTUFBTSxvQkFBb0IsR0FBRyxTQUFTLEtBQUssSUFBSSxDQUFDO0FBQ3BELElBQUksSUFBSSxvQkFBb0IsRUFBRTtBQUM5QjtBQUNBLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLGlDQUFpQyxHQUFHLEVBQUUsYUFBYSxJQUFJLFNBQVMsQ0FBQyxDQUFDO0FBQzVFLElBQUksSUFBSSxpQ0FBaUMsRUFBRTtBQUMzQztBQUNBLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLFNBQVMsQ0FBQyxXQUFXLENBQUM7QUFDakMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sYUFBYSxDQUFDLEtBQUssRUFBRTtBQUM5QjtBQUNBLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDM0MsTUFBTSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDakIsSUFBSSxJQUFJLGtDQUFrQyxHQUFHLEtBQUssQ0FBQztBQUNuRCxJQUFJLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakQsSUFBSSxPQUFPLElBQUksRUFBRTtBQUNqQjtBQUNBLE1BQU0sSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO0FBQzlCO0FBQ0EsUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7QUFDdkIsVUFBVSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLFNBQVMsTUFBTTtBQUNmLFVBQVUsSUFBSSxrQ0FBa0MsRUFBRTtBQUNsRCxZQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsV0FBVztBQUNYLFNBQVM7QUFDVCxRQUFRLE1BQU07QUFDZCxPQUFPO0FBQ1AsTUFBTSxJQUFJLGFBQWEsSUFBSSxTQUFTLEVBQUU7QUFDdEMsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzQyxPQUFPLE1BQU07QUFDYixRQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsUUFBUSxrQ0FBa0MsR0FBRyxJQUFJLENBQUM7QUFDbEQsT0FBTztBQUNQLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkQsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNiLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDM0I7QUFDQSxJQUFJLElBQUksTUFBTSxZQUFZLEtBQUssRUFBRTtBQUNqQyxNQUFNLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQzNDLFFBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDM0MsT0FBTztBQUNQLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLE1BQU0sWUFBWSxHQUFHLEVBQUU7QUFDL0IsTUFBTSxJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzdCLE1BQU0sS0FBSyxJQUFJLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDekMsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMxQyxPQUFPO0FBQ1AsTUFBTSxPQUFPLE1BQU0sQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksTUFBTSxZQUFZLEdBQUcsRUFBRTtBQUMvQixNQUFNLElBQUksTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDN0IsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ2pELFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQy9DLE9BQU87QUFDUCxNQUFNLE9BQU8sTUFBTSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUM5QyxNQUFNLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQzFGLFFBQVEsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0FBQzdCO0FBQ0EsVUFBVSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7QUFDN0MsWUFBWSxHQUFHLElBQUk7QUFDbkIsWUFBWSxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzdDLFdBQVcsQ0FBQyxDQUFDO0FBQ2IsU0FBUyxNQUFNO0FBQ2Y7QUFDQSxVQUFVLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRCxTQUFTO0FBQ1QsT0FBTztBQUNQLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLEdBQUcsTUFBTSxLQUFLLEVBQUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDdkU7QUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3ZDO0FBQ0EsSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN0QixNQUFNLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEQsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLElBQUksWUFBWSxLQUFLLEVBQUU7QUFDL0IsTUFBTSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUQsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUM1QyxNQUFNLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLO0FBQ3pFLFFBQVEsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3BELE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDVixLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDTyxNQUFNLFFBQVEsQ0FBQztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUU7QUFDOUIsSUFBSSxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQ2xDLE1BQU0sTUFBTSxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsU0FBUztBQUNyQyxNQUFNLE1BQU0sRUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUs7QUFDaEMsS0FBSyxDQUFDLENBQUM7QUFDUCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGlCQUFpQixDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7QUFDbkQ7QUFDQSxJQUFJLElBQUksZUFBZSxZQUFZLEtBQUssRUFBRTtBQUMxQyxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuSCxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUMvRCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUs7QUFDdkcsUUFBUSxVQUFVLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxNQUFNO0FBQzlELFlBQVksRUFBRSxHQUFHLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7QUFDN0QsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7QUFDMUMsUUFBUSxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RCxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ1YsS0FBSyxNQUFNO0FBQ1gsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQzNCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7QUFDdEUsTUFBTSxDQUFDLFNBQVMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsS0FBSyxFQUFFLEVBQUU7QUFDN0Q7QUFDQSxRQUFRLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUMzQixVQUFVLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxVQUFVLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEQ7QUFDQSxVQUFVLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksU0FBUyxLQUFLLEVBQUUsR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3ZJLFVBQVUsT0FBTztBQUNqQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQ2pCLFVBQVUsT0FBTztBQUNqQixTQUFTO0FBQ1QsUUFBUSxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDN0UsT0FBTyxFQUFFO0FBQ1QsUUFBUSxJQUFJLEVBQUUsVUFBVTtBQUN4QixPQUFPLENBQUMsQ0FBQztBQUNULEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8saUJBQWlCLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtBQUNuRDtBQUNBLElBQUksSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUN4RCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JELEtBQUssTUFBTSxJQUFJLEVBQUUsZUFBZSxZQUFZLEtBQUssQ0FBQyxFQUFFO0FBQ3BELE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztBQUMzQixLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckY7QUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQixJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksU0FBUyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxTQUFTLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsS0FBSyxFQUFFLEVBQUU7QUFDakQsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDMUM7QUFDQSxVQUFVLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtBQUM3QixZQUFZLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEQsWUFBWSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFlBQVksT0FBTztBQUNuQixXQUFXO0FBQ1g7QUFDQSxVQUFVLElBQUksR0FBRyxFQUFFO0FBQ25CLFlBQVksT0FBTztBQUNuQixXQUFXO0FBQ1gsVUFBVSxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUcsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDM0IsVUFBVSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLFNBQVM7QUFDVCxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ25FO0FBQ0EsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNO0FBQ25CLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNO0FBQ3pCLFFBQVEsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO0FBQ3BDLFVBQVUsT0FBTyxLQUFLLENBQUM7QUFDdkIsU0FBUztBQUNULFFBQVEsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUNsRCxVQUFVLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQyxTQUFTO0FBQ1QsUUFBUSxPQUFPLEVBQUUsQ0FBQztBQUNsQixPQUFPLEdBQUcsQ0FBQztBQUNYLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDM0YsS0FBSyxHQUFHLENBQUM7QUFDVCxJQUFJLEtBQUssR0FBRyxDQUFDLE1BQU07QUFDbkIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU07QUFDekIsUUFBUSxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7QUFDcEMsVUFBVSxPQUFPLEtBQUssQ0FBQztBQUN2QixTQUFTO0FBQ1QsUUFBUSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssTUFBTSxFQUFFO0FBQ2xELFVBQVUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BDLFNBQVM7QUFDVCxRQUFRLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLE9BQU8sR0FBRyxDQUFDO0FBQ1gsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUs7QUFDL0I7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUN4QyxVQUFVLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3RCxVQUFVLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNHLFNBQVM7QUFDVDtBQUNBLFFBQVEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsS0FBSyxHQUFHLENBQUM7QUFDVCxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU07QUFDbEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLE1BQU07QUFDckQsVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUN6QixVQUFVLElBQUksWUFBWSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM1QyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUMzRCxLQUFLLEdBQUcsQ0FBQztBQUNULElBQUksTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JFO0FBQ0E7QUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQixJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3hGLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbkMsUUFBUSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbEQsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNLE9BQU8sQ0FBQztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEVBQUU7QUFDekMsSUFBSSxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUNsQztBQUNBLE1BQU0sS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7QUFDMUYsUUFBUSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakQsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sVUFBVSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLEVBQUU7QUFDN0MsSUFBSSxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUNsQyxNQUFNLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQzFGLFFBQVEsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0FBQzdCO0FBQ0EsVUFBVSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUN6RCxZQUFZLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtBQUMvQyxjQUFjLEdBQUcsSUFBSTtBQUNyQixjQUFjLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzdELGFBQWEsQ0FBQyxDQUFDO0FBQ2YsV0FBVyxNQUFNO0FBQ2pCLFlBQVksTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JELFdBQVc7QUFDWCxTQUFTLE1BQU07QUFDZjtBQUNBLFVBQVUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25ELFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtBQUM1QixJQUFJLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtBQUMzRCxNQUFNLE9BQU8sTUFBTSxDQUFDO0FBQ3BCLEtBQUs7QUFDTCxJQUFJLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEQsSUFBSSxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7QUFDNUIsTUFBTSxPQUFPLElBQUksQ0FBQztBQUNsQixLQUFLO0FBQ0wsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7QUFDakMsSUFBSSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDckIsTUFBTSxPQUFPLFNBQVMsQ0FBQztBQUN2QixLQUFLO0FBQ0wsSUFBSSxPQUFPLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDNUQsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsYUFBYSxHQUFHLEtBQUssRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ3RGO0FBQ0EsSUFBSSxNQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDdEQ7QUFDQSxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDeEI7QUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzRCxJQUFJLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzFEO0FBQ0EsTUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtBQUM5QyxRQUFRLFNBQVM7QUFDakIsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUM5QyxRQUFRLFNBQVM7QUFDakIsT0FBTztBQUNQO0FBQ0EsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDaEIsTUFBTSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELE1BQU0sSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO0FBQzlCLFFBQVEsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekQsUUFBUSxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRTtBQUM1QyxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxhQUFhLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDN0Y7QUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUN0RCxJQUFJLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFELEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsYUFBYSxHQUFHLEtBQUssRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ25HO0FBQ0EsSUFBSSxNQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDdEQsSUFBSSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM3QyxJQUFJLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxTQUFTLEdBQUcsS0FBSyxFQUFFLFNBQVMsR0FBRyxHQUFHLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBRSxhQUFhLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDaEosSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDcEI7QUFDQSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDdEQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQ3RELElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ25CO0FBQ0EsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksU0FBUyxLQUFLLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDbkg7QUFDQSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRCxJQUFJLEtBQUssTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO0FBQzdCLE1BQU0sTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDaEQ7QUFDQSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ2hCLFFBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pELE9BQU87QUFDUCxLQUFLO0FBQ0wsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUU7QUFDL0MsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMvRSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUU7QUFDL0MsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDM0QsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7Ozs7O0FDM3dCQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNwQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNQSxZQUFVLEdBQUc7QUFDMUI7QUFDQSxFQUFFLEdBQUcsRUFBRTtBQUNQLElBQUksT0FBTyxFQUFFLElBQUk7QUFDakIsSUFBSSxJQUFJLEVBQUUsSUFBSTtBQUNkLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxFQUFFO0FBQ1gsSUFBSSxVQUFVLEVBQUUsVUFBVTtBQUMxQixJQUFJLE1BQU0sRUFBRSxVQUFVO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsYUFBYSxFQUFFO0FBQ2pCLElBQUksV0FBVyxFQUFFLFFBQVE7QUFDekIsSUFBSSxVQUFVLEVBQUUsUUFBUTtBQUN4QixJQUFJLFlBQVksRUFBRTtBQUNsQixNQUFNLEdBQUcsRUFBRSxJQUFJO0FBQ2YsTUFBTSw0QkFBNEIsRUFBRSxJQUFJO0FBQ3hDLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLG9CQUFvQjtBQUN4QixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsS0FBSyxFQUFFO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGVBQWUsRUFBRSxHQUFHO0FBQ3hCLElBQUksdUJBQXVCLEVBQUUsR0FBRztBQUNoQyxJQUFJLFVBQVUsRUFBRSxHQUFHO0FBQ25CLElBQUksZUFBZSxFQUFFLElBQUk7QUFDekIsSUFBSSxnQkFBZ0IsRUFBRSxHQUFHO0FBQ3pCLElBQUksdUJBQXVCLEVBQUUsR0FBRztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxnQkFBZ0IsRUFBRSxLQUFLO0FBQzNCLElBQUksdUJBQXVCLEVBQUUsSUFBSTtBQUNqQyxJQUFJLGtCQUFrQixFQUFFLEtBQUs7QUFDN0IsSUFBSSxPQUFPLEVBQUUsSUFBSTtBQUNqQixJQUFJLGdCQUFnQixFQUFFLElBQUk7QUFDMUIsSUFBSSxxQkFBcUIsRUFBRSxLQUFLO0FBQ2hDLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLGlCQUFpQixFQUFFLEtBQUs7QUFDNUIsSUFBSSxVQUFVLEVBQUUsS0FBSztBQUNyQixJQUFJLGtCQUFrQixFQUFFLElBQUk7QUFDNUIsSUFBSSxtQkFBbUIsRUFBRSxJQUFJO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGVBQWUsRUFBRSxJQUFJO0FBQ3pCLElBQUksZ0JBQWdCLEVBQUUsR0FBRztBQUN6QixJQUFJLHNCQUFzQixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx1QkFBdUIsRUFBRSxJQUFJO0FBQ2pDLElBQUksZUFBZSxFQUFFLElBQUk7QUFDekIsSUFBSSxhQUFhLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDOUQsSUFBSSxjQUFjLEVBQUUsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUM7QUFDOUMsSUFBSSxlQUFlLEVBQUUsSUFBSTtBQUN6QixJQUFJLGFBQWEsRUFBRSxJQUFJO0FBQ3ZCLElBQUksMkJBQTJCLEVBQUUsSUFBSTtBQUNyQyxJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSx3QkFBd0IsRUFBRSxJQUFJO0FBQ2xDLElBQUksMEJBQTBCLEVBQUUsSUFBSTtBQUNwQyxJQUFJLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDNUMsSUFBSSxZQUFZLEVBQUUsSUFBSTtBQUN0QixJQUFJLGFBQWEsRUFBRSxJQUFJO0FBQ3ZCLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLFlBQVksRUFBRSxJQUFJO0FBQ3RCLElBQUksMEJBQTBCLEVBQUUsSUFBSTtBQUNwQyxJQUFJLHlCQUF5QixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUM3RSxJQUFJLG9CQUFvQixFQUFFLElBQUk7QUFDOUIsSUFBSSwrQkFBK0IsRUFBRSxJQUFJO0FBQ3pDLElBQUksa0NBQWtDLEVBQUUsSUFBSTtBQUM1QyxJQUFJLHNCQUFzQixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDN0UsSUFBSSxzQkFBc0IsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7QUFDNUMsSUFBSSxlQUFlLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO0FBQ3BDLElBQUksUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDdEYsSUFBSSxNQUFNLEVBQUUsSUFBSTtBQUNoQixJQUFJLGNBQWMsRUFBRSxJQUFJO0FBQ3hCLElBQUksWUFBWSxFQUFFLElBQUk7QUFDdEIsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLElBQUksNkJBQTZCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxDQUFDO0FBQzdHLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLGlCQUFpQixFQUFFLElBQUk7QUFDM0IsSUFBSSxpQkFBaUIsRUFBRSxJQUFJO0FBQzNCLElBQUksZ0JBQWdCLEVBQUUsSUFBSTtBQUMxQixJQUFJLHNCQUFzQixFQUFFLElBQUk7QUFDaEMsSUFBSSxzQkFBc0IsRUFBRSxJQUFJO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGVBQWUsRUFBRSxJQUFJO0FBQ3pCLElBQUksd0JBQXdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztBQUN0SCxJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSxpQkFBaUIsRUFBRSxJQUFJO0FBQzNCLElBQUkscUJBQXFCLEVBQUUsSUFBSTtBQUMvQixJQUFJLHdCQUF3QixFQUFFLElBQUk7QUFDbEMsSUFBSSxvQkFBb0IsRUFBRSxJQUFJO0FBQzlCLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxFQUFFLEVBQUU7QUFDZixDQUFDLENBQUM7QUFDRjtBQUNPLE1BQU0sZUFBZSxHQUFHO0FBQy9CLEVBQUUsS0FBSyxFQUFFO0FBQ1Q7QUFDQSxJQUFJLGdDQUFnQyxFQUFFLEdBQUc7QUFDekMsSUFBSSwwQkFBMEIsRUFBRSxJQUFJO0FBQ3BDLElBQUksb0JBQW9CLEVBQUUsR0FBRztBQUM3QixJQUFJLDJCQUEyQixFQUFFLElBQUk7QUFDckMsSUFBSSx1QkFBdUIsRUFBRSxHQUFHO0FBQ2hDLElBQUksaUNBQWlDLEVBQUUsSUFBSTtBQUMzQyxJQUFJLHlCQUF5QixFQUFFLEdBQUc7QUFDbEMsSUFBSSxpQkFBaUIsRUFBRSxHQUFHO0FBQzFCO0FBQ0EsSUFBSSwyQkFBMkIsRUFBRSxHQUFHO0FBQ3BDLElBQUksc0NBQXNDLEVBQUUsR0FBRztBQUMvQyxJQUFJLGlCQUFpQixFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNoRSxJQUFJLHVCQUF1QixFQUFFLEdBQUc7QUFDaEMsSUFBSSw2QkFBNkIsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3JGLElBQUksNENBQTRDLEVBQUUsR0FBRztBQUNyRCxJQUFJLHNCQUFzQixFQUFFLEdBQUc7QUFDL0IsSUFBSSwwQkFBMEIsRUFBRSxHQUFHO0FBQ25DLElBQUksNkNBQTZDLEVBQUUsR0FBRztBQUN0RCxJQUFJLGtCQUFrQixFQUFFLEdBQUc7QUFDM0IsSUFBSSxnQkFBZ0IsRUFBRSxHQUFHO0FBQ3pCLElBQUksa0JBQWtCLEVBQUUsR0FBRztBQUMzQjtBQUNBLElBQUksZUFBZSxFQUFFLEdBQUc7QUFDeEI7QUFDQSxJQUFJLHVCQUF1QixFQUFFLElBQUk7QUFDakMsSUFBSSxrQ0FBa0MsRUFBRSxJQUFJO0FBQzVDLElBQUksbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDeEU7QUFDQSxJQUFJLDJCQUEyQixFQUFFLElBQUk7QUFDckMsSUFBSSxtQkFBbUIsRUFBRSxJQUFJO0FBQzdCLElBQUksaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDbEUsSUFBSSxrQkFBa0IsRUFBRSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQztBQUNsRCxJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSxpQkFBaUIsRUFBRSxJQUFJO0FBQzNCLElBQUksdUJBQXVCLEVBQUUsSUFBSTtBQUNqQyxJQUFJLGlCQUFpQixFQUFFLElBQUk7QUFDM0IsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLElBQUksMEJBQTBCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNqRixJQUFJLDBCQUEwQixFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztBQUNoRCxJQUFJLHFCQUFxQixFQUFFLElBQUk7QUFDL0IsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLElBQUkscUJBQXFCLEVBQUUsSUFBSTtBQUMvQixJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLEdBQUc7QUFDSCxFQUFFLFNBQVMsRUFBRTtBQUNiLElBQUk7QUFDSixNQUFNLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUN4QixNQUFNLE9BQU8sRUFBRTtBQUNmLFFBQVEsUUFBUSxFQUFFLEdBQUc7QUFDckIsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFO0FBQ2pELEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLHdCQUF3QjtBQUM1QixHQUFHO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDSDtBQUNPLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxlQUFlLEVBQUU7QUFDakQsRUFBRSxHQUFHLEVBQUU7QUFDUCxJQUFJLDJCQUEyQixFQUFFLElBQUk7QUFDckMsR0FBRztBQUNILEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLDZCQUE2QjtBQUNqQyxHQUFHO0FBQ0gsRUFBRSxLQUFLLEVBQUU7QUFDVDtBQUNBLElBQUkscUJBQXFCLEVBQUUsR0FBRztBQUM5QjtBQUNBLElBQUksK0JBQStCLEVBQUUsSUFBSTtBQUN6QztBQUNBLElBQUksNEJBQTRCLEVBQUUsR0FBRztBQUNyQyxJQUFJLDRCQUE0QixFQUFFLEdBQUc7QUFDckMsR0FBRztBQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0ksU0FBUyxLQUFLLENBQUMsR0FBRyxPQUFPLEVBQUU7QUFDbEMsRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3ZDLEVBQUUsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxFQUFFLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ2hDLElBQUksS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDdkQ7QUFDQSxNQUFNLElBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTtBQUMzQjtBQUNBO0FBQ0EsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN4QztBQUNBLFFBQVEsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDaEU7QUFDQSxVQUFVLElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDM0QsVUFBVSxJQUFJLEVBQUUsZUFBZSxZQUFZLEtBQUssQ0FBQyxFQUFFO0FBQ25ELFlBQVksZUFBZSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDaEQsV0FBVztBQUNYO0FBQ0EsVUFBVSxJQUFJLEVBQUUsU0FBUyxZQUFZLEtBQUssQ0FBQyxFQUFFO0FBQzdDLFlBQVksU0FBUyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsV0FBVztBQUNYO0FBQ0EsVUFBVSxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNuRTtBQUNBLFlBQVksSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUNwRCxjQUFjLGVBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkcsYUFBYSxNQUFNO0FBQ25CLGNBQWMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUM5QyxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0EsVUFBVSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsZUFBZSxDQUFDO0FBQ2pELFNBQVM7QUFDVCxRQUFRLFNBQVM7QUFDakIsT0FBTztBQUNQO0FBQ0E7QUFDQSxNQUFNLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtBQUNsQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDekQsUUFBUSxTQUFTO0FBQ2pCLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUNoRCxRQUFRLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkUsUUFBUSxTQUFTO0FBQ2pCLE9BQU87QUFDUDtBQUNBLE1BQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUMxQixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUN0RCxFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixFQUFFLElBQUksSUFBSSxFQUFFO0FBQ1osSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRUEsWUFBVSxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNILEVBQUUsSUFBSSxVQUFVLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkMsR0FBRyxNQUFNLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRTtBQUM5QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSCxFQUFFLE9BQU8sTUFBTSxDQUFDO0FBQ2hCOzs7Ozs7Ozs7Ozs7Ozs7QUN2U0E7QUFDTyxNQUFNLFVBQVUsR0FBRztBQUMxQixFQUFFLElBQUksRUFBRSxJQUFJO0FBQ1osRUFBRSxNQUFNLEVBQUU7QUFDVixJQUFJLElBQUksRUFBRSxTQUFTO0FBQ25CLElBQUksRUFBRSxFQUFFO0FBQ1IsTUFBTSxNQUFNLEVBQUUsS0FBSztBQUNuQixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLEtBQUssRUFBRTtBQUNYO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsS0FBSyxFQUFFO0FBQ1Q7QUFDQSxJQUFJLHFCQUFxQixFQUFFLENBQUMsSUFBSSxFQUFFO0FBQ2xDO0FBQ0EsSUFBSSxhQUFhLEVBQUU7QUFDbkIsTUFBTSxNQUFNLEVBQUU7QUFDZDtBQUNBLFFBQVEsY0FBYyxDQUFDLFNBQVMsRUFBRTtBQUNsQyxVQUFVLE9BQU8sQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLGNBQWMsQ0FBQyxTQUFTLEVBQUU7QUFDbEMsVUFBVSxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEQsU0FBUztBQUNUO0FBQ0EsUUFBUSxjQUFjLENBQUMsU0FBUyxFQUFFO0FBQ2xDLFVBQVUsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pELFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7O0FDckNEO0FBQ08sTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hHO0FBQ08sTUFBTSxRQUFRLEdBQUc7QUFDeEIsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRTtBQUM3QyxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUU7QUFDeEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRTtBQUMvQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ2hELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUU7QUFDdkMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRTtBQUM1QyxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFO0FBQzdDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSwrQkFBK0IsRUFBRTtBQUNsRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFO0FBQy9DLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUU7QUFDbEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFO0FBQ3BELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUU7QUFDakQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFO0FBQ3JELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUU7QUFDNUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFO0FBQ3JELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtBQUN0RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFO0FBQzFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUU7QUFDOUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRTtBQUNqRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFO0FBQzlDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRTtBQUN2RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUU7QUFDdkQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRTtBQUNoRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFO0FBQ2pELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRTtBQUNyRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFO0FBQzlDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUU7QUFDOUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFFO0FBQ3ZELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRTtBQUNuRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsK0JBQStCLEVBQUU7QUFDbEUsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFO0FBQ3BELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUU7QUFDN0MsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRTtBQUN6QyxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUU7QUFDcEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFO0FBQ3hELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtBQUN0RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFO0FBQ2pELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSx3QkFBd0IsRUFBRTtBQUMzRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLEVBQUU7QUFDMUQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFFO0FBQ3ZELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUU7QUFDbEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFO0FBQ3hELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxzQkFBc0IsRUFBRTtBQUN6RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFO0FBQzNDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRTtBQUN0RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFO0FBQzlDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRTtBQUNyRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLEVBQUU7QUFDMUQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFFO0FBQ3RELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxpQ0FBaUMsRUFBRTtBQUNwRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsK0JBQStCLEVBQUU7QUFDbEUsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFFO0FBQzFELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRTtBQUNwRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ2hELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRTtBQUN4RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUU7QUFDcEQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLDRCQUE0QixFQUFFO0FBQy9ELEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSx5QkFBeUIsRUFBRTtBQUM1RCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsc0JBQXNCLEVBQUU7QUFDekQsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRTtBQUNsRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsMEJBQTBCLEVBQUU7QUFDN0QsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRTtBQUNqRCxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsaUNBQWlDLEVBQUU7QUFDcEUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OyJ9
