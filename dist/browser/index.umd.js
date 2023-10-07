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

  var index$4 = /*#__PURE__*/Object.freeze({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudW1kLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9pbmRleC5qcyIsIi4uLy4uL3NyYy9kZXYvZXNsaW50LmpzIiwiLi4vLi4vc3JjL2Rldi92aXRlLmpzIiwiLi4vLi4vc3JjL25ldHdvcmsvc2hhcmVkLmpzIiwiLi4vLi4vc3JjL3N0b3JhZ2UvYnJvd3Nlci9jbGlwYm9hcmQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vanMtY29va2llQDMuMC41L25vZGVfbW9kdWxlcy9qcy1jb29raWUvZGlzdC9qcy5jb29raWUubWpzIiwiLi4vLi4vc3JjL3N0b3JhZ2UvYnJvd3Nlci9jb29raWUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vaWRiLWtleXZhbEA2LjIuMS9ub2RlX21vZHVsZXMvaWRiLWtleXZhbC9kaXN0L2luZGV4LmpzIiwiLi4vLi4vc3JjL3N0b3JhZ2UvYnJvd3Nlci9zdG9yYWdlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIOWfuuehgOaooeWdl1xuLy8g6L6F5YqpXG5leHBvcnQgY2xhc3MgX1N1cHBvcnQge1xuICAvLyBqc+i/kOihjOeOr+Wig1xuICBzdGF0aWMgSlNfRU5WID0gKGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWxUaGlzID09PSB3aW5kb3cpIHtcbiAgICAgIHJldHVybiAnYnJvd3Nlcic7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWxUaGlzID09PSBnbG9iYWwpIHtcbiAgICAgIHJldHVybiAnbm9kZSc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfSkoKTtcbiAgLy8g56m65Ye95pWwXG4gIHN0YXRpYyBOT09QKCkge31cbiAgLy8g6L+U5ZueIGZhbHNlXG4gIHN0YXRpYyBGQUxTRSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8g6L+U5ZueIHRydWVcbiAgc3RhdGljIFRSVUUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgLy8g5Y6f5qC36L+U5ZueXG4gIHN0YXRpYyBSQVcodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgLy8gY2F0Y2gg5YaF55qE6ZSZ6K+v5Y6f5qC35oqb5Ye65Y67XG4gIHN0YXRpYyBUSFJPVyhlKSB7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBzdGF0aWMgbmFtZXNUb0FycmF5KG5hbWVzID0gW10sIHsgc2VwYXJhdG9yID0gJywnIH0gPSB7fSkge1xuICAgIGlmIChuYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gbmFtZXMubWFwKHZhbCA9PiB0aGlzLm5hbWVzVG9BcnJheSh2YWwpKS5mbGF0KCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmFtZXMuc3BsaXQoc2VwYXJhdG9yKS5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lcyA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiBbbmFtZXNdO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cbn1cbi8qKlxuICog5a6a5Yi25a+56LGh44CC5YqgIF8g6Lef5ZCM5ZCN5Y6f55Sf5a+56LGh5Yy65YiGXG4gKi9cbi8vIOaXpeacn+aXtumXtFxuZXhwb3J0IGNsYXNzIF9EYXRlIHtcbiAgLy8g6L2s5o2i5oiQ5a2X56ym5LiyXG4gIHN0YXRpYyBzdHJpbmdpZnkodmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkVmFsdWUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNvbnN0IGRhdGUgPSBuZXcgdGhpcyh2YWx1ZSk7XG4gICAgY29uc3QgeyB5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCB9ID0ge1xuICAgICAgeWVhcjogZGF0ZS55ZWFyLFxuICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKFsnbW9udGgnLCAnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCddLm1hcCgobmFtZSkgPT4ge1xuICAgICAgICByZXR1cm4gW25hbWUsIGRhdGVbbmFtZV0udG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpXTtcbiAgICAgIH0pKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlfToke3NlY29uZH1gO1xuICB9XG4gIC8vIOaYr+WQpuacieaViOWPguaVsOOAguW4uOeUqOS6juWkhOeQhuaTjeS9nOW+l+WIsCBJbnZhbGlkIERhdGUg55qE5oOF5Ya1XG4gIHN0YXRpYyBpc1ZhbGlkVmFsdWUodmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgdGhpcyh2YWx1ZSk7XG4gICAgcmV0dXJuICFpc05hTihkYXRlLnZhbHVlLmdldFRpbWUoKSk7XG4gIH1cbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8g5bey57uP5pivIF9EYXRlIOWvueixoe+8jOebtOaOpeS8oCBEYXRlIOWvueixoSB2YWx1ZSDov5vlkI7pnaLnmoQgbmV3IERhdGVcbiAgICAgIGlmIChhcmdzWzBdIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcikge1xuICAgICAgICBhcmdzWzBdID0gYXJnc1swXS52YWx1ZTtcbiAgICAgIH1cbiAgICAgIC8vIG51bGwg5ZKM5pi+5byPIHVuZGVmaW5lZCDpg73op4bkuLrml6DmlYjlgLxcbiAgICAgIGlmIChhcmdzWzBdID09PSBudWxsKSB7XG4gICAgICAgIGFyZ3NbMF0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICAvLyBzYWZhcmkg5rWP6KeI5Zmo5a2X56ym5Liy5qC85byP5YW85a65XG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2VBbGwoJy0nLCAnLycpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnZhbHVlID0gbmV3IERhdGUoLi4uYXJncyk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd5ZWFyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21vbnRoJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5nZXRNb250aCgpICsgMTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXknLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmdldERhdGUoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdob3VyJywge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5nZXRIb3VycygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21pbnV0ZScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUuZ2V0TWludXRlcygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3NlY29uZCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUuZ2V0U2Vjb25kcygpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3dlZWsnLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmdldERheSgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuICAvLyBbU3ltYm9sLnRvUHJpbWl0aXZlXSDlkowgdG9TdHJpbmfjgIF2YWx1ZU9mIOe7n+S4gOmFjee9ruWkhOeQhumakOW8j+WSjOaYvuekuuiwg+eUqOWcuuaZr1xuICBbU3ltYm9sLnRvUHJpbWl0aXZlXShoaW50KSB7XG4gICAgLy8gY29uc29sZS5sb2coJ1tTeW1ib2wudG9QcmltaXRpdmVdJywgeyBoaW50IH0pO1xuICAgIGlmIChoaW50ID09PSAnc3RyaW5nJyB8fCBoaW50ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChoaW50ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRoaXMudG9OdW1iZXIoKTtcbiAgICB9XG4gIH1cbiAgLy8g6L2s5o2i5oiQ5a2X56ym5LiyXG4gIHRvU3RyaW5nKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCd0b1N0cmluZycsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnN0cmluZ2lmeSh0aGlzLnZhbHVlLCBvcHRpb25zKTtcbiAgfVxuICAvLyB2YWx1ZU9mIOi/memHjOWkhOeQhuaIkOWQjCBEYXRlIOWvueixoeeahOmAu+i+ke+8jOi9rOaNouaIkOaVsOWtl1xuICB2YWx1ZU9mKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCd2YWx1ZU9mJywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMudG9OdW1iZXIob3B0aW9ucyk7XG4gIH1cbiAgLy8g6L2s5o2i5oiQ5pWw5a2XXG4gIHRvTnVtYmVyKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCd0b051bWJlcicsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLnZhbHVlLmdldFRpbWUoKTtcbiAgfVxuICAvLyDovazmjaLmiJDluIPlsJTlgLzjgILnlKjkuo4gaWYg562J5Zy65pmvXG4gIHRvQm9vbGVhbihvcHRpb25zID0ge30pIHtcbiAgICAvLyBjb25zb2xlLmxvZygndG9Cb29sZWFuJywgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3IuaXNWYWxpZFZhbHVlKHRoaXMpKSB7XG5cbiAgICB9XG4gIH1cbiAgLy8g6L2s5o2i5oiQIEpTT07jgILnlKjkuo4gSlNPTiDlr7nosaHovazmjaLvvIzkvKDlj4LliLDlkI7nq6/mjqXlj6PluLjnlKhcbiAgdG9KU09OKG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCd0b0pTT04nLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICB9XG59XG4vLyDmlbDlrabov5DnrpdcbmV4cG9ydCBjbGFzcyBfTWF0aCB7XG4gIC8vIOWinuWKoOmDqOWIhuWRveWQjeS7peaOpei/keaVsOWtpuWGmeazlVxuICBzdGF0aWMgYXJjc2luID0gTWF0aC5hc2luLmJpbmQoTWF0aCk7XG4gIHN0YXRpYyBhcmNjb3MgPSBNYXRoLmFjb3MuYmluZChNYXRoKTtcbiAgc3RhdGljIGFyY3RhbiA9IE1hdGguYXRhbi5iaW5kKE1hdGgpO1xuICBzdGF0aWMgYXJzaW5oID0gTWF0aC5hc2luaC5iaW5kKE1hdGgpO1xuICBzdGF0aWMgYXJjb3NoID0gTWF0aC5hY29zaC5iaW5kKE1hdGgpO1xuICBzdGF0aWMgYXJ0YW5oID0gTWF0aC5hdGFuaC5iaW5kKE1hdGgpO1xuICBzdGF0aWMgbG9nZSA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG4gIHN0YXRpYyBsbiA9IE1hdGgubG9nLmJpbmQoTWF0aCk7XG4gIHN0YXRpYyBsZyA9IE1hdGgubG9nMTAuYmluZChNYXRoKTtcbiAgc3RhdGljIGxvZyhhLCB4KSB7XG4gICAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coYSk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBfUmVmbGVjdCB7XG4gIC8vIOWvuSBvd25LZXlzIOmFjeWllyBvd25WYWx1ZXMg5ZKMIG93bkVudHJpZXNcbiAgc3RhdGljIG93blZhbHVlcyh0YXJnZXQpIHtcbiAgICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCkubWFwKGtleSA9PiB0YXJnZXRba2V5XSk7XG4gIH1cbiAgc3RhdGljIG93bkVudHJpZXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gW2tleSwgdGFyZ2V0W2tleV1dKTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIF9Qcm94eSB7XG4gIC8qKlxuICAgKiDnu5Hlrpp0aGlz44CC5bi455So5LqO6Kej5p6E5Ye95pWw5pe257uR5a6aIHRoaXMg6YG/5YWN5oql6ZSZXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhuVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHN0YXRpYyBiaW5kVGhpcyh0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0LCB7XG4gICAgICBnZXQodGFyZ2V0LCBwLCByZWNlaXZlcikge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IFJlZmxlY3QuZ2V0KC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8vIOWHveaVsOexu+Wei+e7keWumnRoaXNcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIOWFtuS7luWxnuaAp+WOn+agt+i/lOWbnlxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5leHBvcnQgY2xhc3MgX1N0cmluZyB7XG4gIC8qKlxuICAgKiDpppblrZfmr43lpKflhplcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0ZpcnN0VXBwZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9VcHBlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfVxuICAvKipcbiAgICog6aaW5a2X5q+N5bCP5YaZXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvRmlyc3RMb3dlckNhc2UobmFtZSA9ICcnKSB7XG4gICAgcmV0dXJuIGAkeyhuYW1lWzBdID8/ICcnKS50b0xvd2VyQ2FzZSgpfSR7bmFtZS5zbGljZSgxKX1gO1xuICB9XG4gIC8qKlxuICAgKiDovazpqbzls7Dlkb3lkI3jgILluLjnlKjkuo7ov57mjqXnrKblkb3lkI3ovazpqbzls7Dlkb3lkI3vvIzlpoIgeHgtbmFtZSAtPiB4eE5hbWVcbiAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ig6L+e5o6l56ym44CC55So5LqO55Sf5oiQ5q2j5YiZIOm7mOiupOS4uuS4reWIkue6vyAtIOWvueW6lHJlZ2V4cOW+l+WIsCAvLShcXHcpL2dcbiAgICogQHBhcmFtIGZpcnN0IOmmluWtl+avjeWkhOeQhuaWueW8j+OAgnRydWUg5oiWICd1cHBlcmNhc2Un77ya6L2s5o2i5oiQ5aSn5YaZO1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIOaIliAnbG93ZXJjYXNlJ++8mui9rOaNouaIkOWwj+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAncmF3JyDmiJYg5YW25LuW5peg5pWI5YC877ya6buY6K6k5Y6f5qC36L+U5Zue77yM5LiN6L+b6KGM5aSE55CGO1xuICAgKiBAcmV0dXJucyB7TWFnaWNTdHJpbmd8c3RyaW5nfHN0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b0NhbWVsQ2FzZShuYW1lLCB7IHNlcGFyYXRvciA9ICctJywgZmlyc3QgPSAncmF3JyB9ID0ge30pIHtcbiAgICAvLyDnlJ/miJDmraPliJlcbiAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke3NlcGFyYXRvcn0oXFxcXHcpYCwgJ2cnKTtcbiAgICAvLyDmi7zmjqXmiJDpqbzls7BcbiAgICBjb25zdCBjYW1lbE5hbWUgPSBuYW1lLnJlcGxhY2VBbGwocmVnZXhwLCAoc3Vic3RyLCAkMSkgPT4ge1xuICAgICAgcmV0dXJuICQxLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG4gICAgLy8g6aaW5a2X5q+N5aSn5bCP5YaZ5qC55o2u5Lyg5Y+C5Yik5patXG4gICAgaWYgKFt0cnVlLCAndXBwZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0ZpcnN0VXBwZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIGlmIChbZmFsc2UsICdsb3dlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvRmlyc3RMb3dlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbWVsTmFtZTtcbiAgfVxuICAvKipcbiAgICog6L2s6L+e5o6l56ym5ZG95ZCN44CC5bi455So5LqO6am85bOw5ZG95ZCN6L2s6L+e5o6l56ym5ZG95ZCN77yM5aaCIHh4TmFtZSAtPiB4eC1uYW1lXG4gICAqIEBwYXJhbSBuYW1lIOWQjeensFxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIOi/nuaOpeesplxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHRvTGluZUNhc2UobmFtZSA9ICcnLCB7IHNlcGFyYXRvciA9ICctJyB9ID0ge30pIHtcbiAgICByZXR1cm4gbmFtZVxuICAgICAgLy8g5oyJ6L+e5o6l56ym5ou85o6lXG4gICAgICAucmVwbGFjZUFsbCgvKFthLXpdKShbQS1aXSkvZywgYCQxJHtzZXBhcmF0b3J9JDJgKVxuICAgICAgLy8g6L2s5bCP5YaZXG4gICAgICAudG9Mb3dlckNhc2UoKTtcbiAgfVxufVxuLy8g5qC35byP5aSE55CGXG5leHBvcnQgY2xhc3MgX1N0eWxlIHtcbiAgLyoqXG4gICAqIOWNleS9jeWtl+espuS4suOAguWvueaVsOWtl+aIluaVsOWtl+agvOW8j+eahOWtl+espuS4suiHquWKqOaLvOWNleS9je+8jOWFtuS7luWtl+espuS4suWOn+agt+i/lOWbnlxuICAgKiBAcGFyYW0gdmFsdWUg5YC8XG4gICAqIEBwYXJhbSB1bml0IOWNleS9jeOAgnZhbHVl5rKh5bim5Y2V5L2N5pe26Ieq5Yqo5ou85o6l77yM5Y+v5LygIHB4L2VtLyUg562JXG4gICAqIEByZXR1cm5zIHtzdHJpbmd8c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldFVuaXRTdHJpbmcodmFsdWUgPSAnJywgeyB1bml0ID0gJ3B4JyB9ID0ge30pIHtcbiAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIC8vIOazqOaEj++8mui/memHjOS9v+eUqCA9PSDliKTmlq3vvIzkuI3kvb/nlKggPT09XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPT0gdmFsdWUgPyBgJHt2YWx1ZX0ke3VuaXR9YCA6IFN0cmluZyh2YWx1ZSk7XG4gIH1cbn1cbi8vIOaVsOaNruWkhOeQhu+8jOWkhOeQhuWkmuagvOW8j+aVsOaNrueUqFxuZXhwb3J0IGNsYXNzIF9EYXRhIHtcbiAgLy8g566A5Y2V57G75Z6LXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICBzdGF0aWMgU0lNUExFX1RZUEVTID0gW251bGwsIHVuZGVmaW5lZCwgTnVtYmVyLCBTdHJpbmcsIEJvb2xlYW4sIEJpZ0ludCwgU3ltYm9sXTtcbiAgLyoqXG4gICAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei1xuICAgKiBAcGFyYW0gdmFsdWUg5YC8XG4gICAqIEByZXR1cm5zIHtPYmplY3RDb25zdHJ1Y3RvcnwqfEZ1bmN0aW9ufSDov5Tlm57lr7nlupTmnoTpgKDlh73mlbDjgIJudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICAgKi9cbiAgc3RhdGljIGdldEV4YWN0VHlwZSh2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICAgIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgICAvLyB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaHml7YgX19wcm90b19fIOS4uiBudWxsXG4gICAgY29uc3QgaXNPYmplY3RCeUNyZWF0ZU51bGwgPSBfX3Byb3RvX18gPT09IG51bGw7XG4gICAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgICByZXR1cm4gT2JqZWN0O1xuICAgIH1cbiAgICAvLyDlr7nlupTnu6fmib/nmoTlr7nosaEgX19wcm90b19fIOayoeaciSBjb25zdHJ1Y3RvciDlsZ7mgKdcbiAgICBjb25zdCBpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSAhKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKTtcbiAgICBpZiAoaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgICAgcmV0dXJuIE9iamVjdDtcbiAgICB9XG4gICAgLy8g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWwXG4gICAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3RvcjtcbiAgfVxuICAvKipcbiAgICog6I635Y+W5YC855qE5YW35L2T57G75Z6L5YiX6KGoXG4gICAqIEBwYXJhbSB2YWx1ZSDlgLxcbiAgICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gICAqL1xuICBzdGF0aWMgZ2V0RXhhY3RUeXBlcyh2YWx1ZSkge1xuICAgIC8vIG51bGzjgIF1bmRlZmluZWQg5Yik5pat5aSE55CGXG4gICAgaWYgKFtudWxsLCB1bmRlZmluZWRdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIFt2YWx1ZV07XG4gICAgfVxuICAgIC8vIOaJq+WOn+Wei+mTvuW+l+WIsOWvueW6lOaehOmAoOWHveaVsFxuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBsZXQgbG9vcCA9IDA7XG4gICAgbGV0IGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSBmYWxzZTtcbiAgICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgLy8gY29uc29sZS53YXJuKCd3aGlsZScsIGxvb3AsIF9fcHJvdG9fXyk7XG4gICAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICAgIC8vIOS4gOi/m+adpSBfX3Byb3RvX18g5bCx5pivIG51bGwg6K+05piOIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoVxuICAgICAgICBpZiAobG9vcCA8PSAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pIHtcbiAgICAgICAgcmVzdWx0LnB1c2goX19wcm90b19fLmNvbnN0cnVjdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKE9iamVjdCk7XG4gICAgICAgIGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSB0cnVlO1xuICAgICAgfVxuICAgICAgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKF9fcHJvdG9fXyk7XG4gICAgICBsb29wKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIOa3seaLt+i0neaVsOaNrlxuICAgKiBAcGFyYW0gc291cmNlXG4gICAqIEByZXR1cm5zIHtNYXA8YW55LCBhbnk+fFNldDxhbnk+fHt9fCp8KltdfVxuICAgKi9cbiAgc3RhdGljIGRlZXBDbG9uZShzb3VyY2UpIHtcbiAgICAvLyDmlbDnu4RcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZGVlcENsb25lKHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyBTZXRcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICBsZXQgcmVzdWx0ID0gbmV3IFNldCgpO1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICAgIHJlc3VsdC5hZGQodGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIE1hcFxuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2Ygc291cmNlLmVudHJpZXMoKSkge1xuICAgICAgICByZXN1bHQuc2V0KGtleSwgdGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIOWvueixoVxuICAgIGlmICh0aGlzLmdldEV4YWN0VHlwZShzb3VyY2UpID09PSBPYmplY3QpIHtcbiAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgIC8vIHZhbHVl5pa55byP77ya6YCS5b2S5aSE55CGXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcENsb25lKGRlc2MudmFsdWUpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGdldC9zZXQg5pa55byP77ya55u05o6l5a6a5LmJXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8g5YW25LuW77ya5Y6f5qC36L+U5ZueXG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuICAvKipcbiAgICog5rex6Kej5YyF5pWw5o2uXG4gICAqIEBwYXJhbSBkYXRhIOWAvFxuICAgKiBAcGFyYW0gaXNXcmFwIOWMheijheaVsOaNruWIpOaWreWHveaVsO+8jOWmgiB2dWUzIOeahCBpc1JlZiDlh73mlbBcbiAgICogQHBhcmFtIHVud3JhcCDop6PljIXmlrnlvI/lh73mlbDvvIzlpoIgdnVlMyDnmoQgdW5yZWYg5Ye95pWwXG4gICAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiBhbnl9fXwqfCgqfHtbcDogc3RyaW5nXTogYW55fSlbXXx7W3A6IHN0cmluZ106IGFueX19XG4gICAqL1xuICBkZWVwVW53cmFwKGRhdGEsIHsgaXNXcmFwID0gKCkgPT4gZmFsc2UsIHVud3JhcCA9IHZhbCA9PiB2YWwgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgaXNXcmFwLCB1bndyYXAgfTtcbiAgICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gICAgaWYgKGlzV3JhcChkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVlcFVud3JhcCh1bndyYXAoZGF0YSksIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gZGF0YS5tYXAodmFsID0+IHRoaXMuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0RXhhY3RUeXBlKGRhdGEpID09PSBPYmplY3QpIHtcbiAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICAgIHJldHVybiBba2V5LCB0aGlzLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgICB9KSk7XG4gICAgfVxuICAgIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG4vLyB2dWUg5pWw5o2u5aSE55CGXG5leHBvcnQgY2xhc3MgX1Z1ZURhdGEge1xuICAvKipcbiAgICog5rex6Kej5YyFIHZ1ZTMg5ZON5bqU5byP5a+56LGh5pWw5o2uXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEByZXR1cm5zIHt7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiAqfX18KnwoKnx7W3A6IHN0cmluZ106ICp9KVtdfHtbcDogc3RyaW5nXTogKn19XG4gICAqL1xuICBzdGF0aWMgZGVlcFVud3JhcFZ1ZTMoZGF0YSkge1xuICAgIHJldHVybiBfRGF0YS5kZWVwVW53cmFwKGRhdGEsIHtcbiAgICAgIGlzV3JhcDogZGF0YSA9PiBkYXRhPy5fX3ZfaXNSZWYsXG4gICAgICB1bndyYXA6IGRhdGEgPT4gZGF0YS52YWx1ZSxcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcERlZmluaXRpb25zIHByb3BzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGdldFByb3BzRnJvbUF0dHJzKGF0dHJzLCBwcm9wRGVmaW5pdGlvbnMpIHtcbiAgICAvLyBwcm9wcyDlrprkuYnnu5/kuIDmiJDlr7nosaHmoLzlvI/vvIx0eXBlIOe7n+S4gOaIkOaVsOe7hOagvOW8j+S7peS+v+WQjue7reWIpOaWrVxuICAgIGlmIChwcm9wRGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcHJvcERlZmluaXRpb25zID0gT2JqZWN0LmZyb21FbnRyaWVzKHByb3BEZWZpbml0aW9ucy5tYXAobmFtZSA9PiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgeyB0eXBlOiBbXSB9XSkpO1xuICAgIH0gZWxzZSBpZiAoX0RhdGEuZ2V0RXhhY3RUeXBlKHByb3BEZWZpbml0aW9ucykgPT09IE9iamVjdCkge1xuICAgICAgcHJvcERlZmluaXRpb25zID0gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykubWFwKChbbmFtZSwgZGVmaW5pdGlvbl0pID0+IHtcbiAgICAgICAgZGVmaW5pdGlvbiA9IF9EYXRhLmdldEV4YWN0VHlwZShkZWZpbml0aW9uKSA9PT0gT2JqZWN0XG4gICAgICAgICAgPyB7IC4uLmRlZmluaXRpb24sIHR5cGU6IFtkZWZpbml0aW9uLnR5cGVdLmZsYXQoKSB9XG4gICAgICAgICAgOiB7IHR5cGU6IFtkZWZpbml0aW9uXS5mbGF0KCkgfTtcbiAgICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBkZWZpbml0aW9uXTtcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcERlZmluaXRpb25zID0ge307XG4gICAgfVxuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBkZWZpbml0aW9uXSBvZiBPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpKSB7XG4gICAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgICAvLyBwcm9wTmFtZSDmiJYgcHJvcC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgLy8g5Y+q5YyF5ZCrQm9vbGVhbuexu+Wei+eahCcn6L2s5o2i5Li6dHJ1Ze+8jOWFtuS7luWOn+agt+i1i+WAvFxuICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gZGVmaW5pdGlvbi50eXBlLmxlbmd0aCA9PT0gMSAmJiBkZWZpbml0aW9uLnR5cGUuaW5jbHVkZXMoQm9vbGVhbikgJiYgYXR0clZhbHVlID09PSAnJyA/IHRydWUgOiBhdHRyVmFsdWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHByb3AtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgaWYgKGVuZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBfU3RyaW5nLnRvTGluZUNhc2UobmFtZSksIGRlZmluaXRpb24sIGVuZDogdHJ1ZSB9KTtcbiAgICAgIH0pKHtcbiAgICAgICAgbmFtZSwgZGVmaW5pdGlvbixcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+WIGVtaXRzIOWumuS5ieeahOWxnuaAp1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBlbWl0RGVmaW5pdGlvbnMgZW1pdHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgZ2V0RW1pdHNGcm9tQXR0cnMoYXR0cnMsIGVtaXREZWZpbml0aW9ucykge1xuICAgIC8vIGVtaXRzIOWumuS5iee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIGlmIChfRGF0YS5nZXRFeGFjdFR5cGUoZW1pdERlZmluaXRpb25zKSA9PT0gT2JqZWN0KSB7XG4gICAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoIShlbWl0RGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIGVtaXREZWZpbml0aW9ucyA9IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDlpITnkIbmiJAgb25FbWl0TmFtZeOAgW9uVXBkYXRlOmVtaXROYW1lKHYtbW9kZWzns7vliJcpIOagvOW8j1xuICAgIGNvbnN0IGVtaXROYW1lcyA9IGVtaXREZWZpbml0aW9ucy5tYXAobmFtZSA9PiBfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdvblVwZGF0ZTonKSkge1xuICAgICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICAgICAgaWYgKGVuZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UobmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpKX1gLCBlbmQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9KSh7IG5hbWUgfSk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5bliankvZnlsZ7mgKfjgILluLjnlKjkuo7nu4Tku7YgaW5oZXJpdEF0dHJzIOiuvue9riBmYWxzZSDml7bkvb/nlKjkvZzkuLrmlrDnmoQgYXR0cnNcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcHMgcHJvcHMg5a6a5LmJIOaIliB2dWUgcHJvcHPvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqIEBwYXJhbSBlbWl0cyBlbWl0cyDlrprkuYkg5oiWIHZ1ZSBlbWl0c++8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogQHBhcmFtIGxpc3Qg6aKd5aSW55qE5pmu6YCa5bGe5oCnXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBnZXRSZXN0RnJvbUF0dHJzKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAgIC8vIOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIHByb3BzID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChwcm9wcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfRGF0YS5nZXRFeGFjdFR5cGUocHJvcHMpID09PSBPYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH0pKCk7XG4gICAgICByZXR1cm4gYXJyLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBfU3RyaW5nLnRvTGluZUNhc2UobmFtZSldKS5mbGF0KCk7XG4gICAgfSkoKTtcbiAgICBlbWl0cyA9ICgoKSA9PiB7XG4gICAgICBjb25zdCBhcnIgPSAoKCkgPT4ge1xuICAgICAgICBpZiAoZW1pdHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIHJldHVybiBlbWl0cztcbiAgICAgICAgfVxuICAgICAgICBpZiAoX0RhdGEuZ2V0RXhhY3RUeXBlKGVtaXRzKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGVtaXRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgICB9KSgpO1xuICAgICAgcmV0dXJuIGFyci5tYXAoKG5hbWUpID0+IHtcbiAgICAgICAgLy8gdXBkYXRlOmVtaXROYW1lIOaIliB1cGRhdGU6ZW1pdC1uYW1lIOagvOW8j1xuICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCd1cGRhdGU6JykpIHtcbiAgICAgICAgICBjb25zdCBwYXJ0TmFtZSA9IG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKTtcbiAgICAgICAgICByZXR1cm4gW2BvblVwZGF0ZToke19TdHJpbmcudG9DYW1lbENhc2UocGFydE5hbWUpfWAsIGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShwYXJ0TmFtZSl9YF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKV07XG4gICAgICB9KS5mbGF0KCk7XG4gICAgfSkoKTtcbiAgICBsaXN0ID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9IF9EYXRhLmdldEV4YWN0VHlwZShsaXN0KSA9PT0gU3RyaW5nXG4gICAgICAgID8gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgIDogbGlzdCBpbnN0YW5jZW9mIEFycmF5ID8gbGlzdCA6IFtdO1xuICAgICAgcmV0dXJuIGFyci5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgICB9KSgpO1xuICAgIGNvbnN0IGxpc3RBbGwgPSBBcnJheS5mcm9tKG5ldyBTZXQoW3Byb3BzLCBlbWl0cywgbGlzdF0uZmxhdCgpKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ2xpc3RBbGwnLCBsaXN0QWxsKTtcbiAgICAvLyDorr7nva7lgLxcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBbbmFtZSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoYXR0cnMpKSkge1xuICAgICAgaWYgKCFsaXN0QWxsLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIG5hbWUsIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4vKipcbiAqIOWxnuaAp+WQjee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICogQHBhcmFtIG5hbWVzIOWxnuaAp+WQjeOAguagvOW8jyAnYSxiLGMnIOaIliBbJ2EnLCdiJywnYyddXG4gKiBAcGFyYW0gc2VwYXJhdG9yIG5hbWVzIOS4uuWtl+espuS4suaXtueahOaLhuWIhuinhOWImeOAguWQjCBzcGxpdCDmlrnms5XnmoQgc2VwYXJhdG9y77yM5a2X56ym5Liy5peg6ZyA5ouG5YiG55qE5Y+v5Lul5LygIG51bGwg5oiWIHVuZGVmaW5lZFxuICogQHJldHVybnMgeypbXVtdfChNYWdpY1N0cmluZyB8IEJ1bmRsZSB8IHN0cmluZylbXXxGbGF0QXJyYXk8KEZsYXRBcnJheTwoKnxbKltdXXxbXSlbXSwgMT5bXXwqfFsqW11dfFtdKVtdLCAxPltdfCpbXX1cbiAqL1xuZXhwb3J0IGNsYXNzIF9PYmplY3Qge1xuICAvKipcbiAgICog5rWF5ZCI5bm25a+56LGh44CC5YaZ5rOV5ZCMIE9iamVjdC5hc3NpZ27vvIzpgJrov4fph43lrprkuYnmlrnlvI/lkIjlubbvvIzop6PlhrMgT2JqZWN0LmFzc2lnbiDlkIjlubbkuKTovrnlkIzlkI3lsZ7mgKfmt7fmnIkgdmFsdWXlhpnms5Ug5ZKMIGdldC9zZXTlhpnms5Ug5pe25oqlIFR5cGVFcnJvcjogQ2Fubm90IHNldCBwcm9wZXJ0eSBiIG9mICM8T2JqZWN0PiB3aGljaCBoYXMgb25seSBhIGdldHRlciDnmoTpl67pophcbiAgICogQHBhcmFtIHRhcmdldCDnm67moIflr7nosaFcbiAgICogQHBhcmFtIHNvdXJjZXMg5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBhc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICAvLyDkuI3kvb/nlKggdGFyZ2V0W2tleV09dmFsdWUg5YaZ5rOV77yM55u05o6l5L2/55SoZGVzY+mHjeWumuS5iVxuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIC8qKlxuICAgKiDmt7HlkIjlubblr7nosaHjgILlkIwgYXNzaWduIOS4gOagt+S5n+S8muWvueWxnuaAp+i/m+ihjOmHjeWumuS5iVxuICAgKiBAcGFyYW0gdGFyZ2V0IOebruagh+WvueixoeOAgum7mOiupOWAvCB7fSDpmLLmraLpgJLlvZLml7bmiqUgVHlwZUVycm9yOiBPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3RcbiAgICogQHBhcmFtIHNvdXJjZXMg5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIHN0YXRpYyBkZWVwQXNzaWduKHRhcmdldCA9IHt9LCAuLi5zb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgICAgLy8gdmFsdWXlhpnms5XvvJrlr7nosaHpgJLlvZLlpITnkIbvvIzlhbbku5bnm7TmjqXlrprkuYlcbiAgICAgICAgICBpZiAoX0RhdGEuZ2V0RXhhY3RUeXBlKGRlc2MudmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuICAgICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQXNzaWduKHRhcmdldFtrZXldLCBkZXNjLnZhbHVlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBnZXQvc2V05YaZ5rOV77ya55u05o6l5a6a5LmJXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIC8qKlxuICAgKiBrZXnoh6rouqvmiYDlsZ7nmoTlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIGtleSDlsZ7mgKflkI1cbiAgICogQHJldHVybnMgeyp8bnVsbH1cbiAgICovXG4gIHN0YXRpYyBvd25lcihvYmplY3QsIGtleSkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgaWYgKF9fcHJvdG9fXyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm93bmVyKF9fcHJvdG9fXywga2V5KTtcbiAgfVxuICAvKipcbiAgICog6I635Y+W5bGe5oCn5o+P6L+w5a+56LGh77yM55u45q+UIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3LvvIzog73mi7/liLDnu6fmib/lsZ7mgKfnmoTmj4/ov7Dlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR8UHJvcGVydHlEZXNjcmlwdG9yfVxuICAgKi9cbiAgc3RhdGljIGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpIHtcbiAgICBjb25zdCBmaW5kT2JqZWN0ID0gdGhpcy5vd25lcihvYmplY3QsIGtleSk7XG4gICAgaWYgKCFmaW5kT2JqZWN0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmaW5kT2JqZWN0LCBrZXkpO1xuICB9XG4gIC8qKlxuICAgKiDojrflj5blsZ7mgKflkI3jgILpu5jorqTlj4LmlbDphY3nva7miJDlkIwgT2JqZWN0LmtleXMg6KGM5Li6XG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHthbnlbXX1cbiAgICovXG4gIHN0YXRpYyBrZXlzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIC8vIHNldOeUqOS6jmtleeWOu+mHjVxuICAgIGxldCBzZXQgPSBuZXcgU2V0KCk7XG4gICAgLy8g6Ieq6Lqr5bGe5oCn562b6YCJXG4gICAgY29uc3QgZGVzY3MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3QpO1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgX1JlZmxlY3Qub3duRW50cmllcyhkZXNjcykpIHtcbiAgICAgIC8vIOW/veeVpXN5bWJvbOWxnuaAp+eahOaDheWGtVxuICAgICAgaWYgKCFzeW1ib2wgJiYgdHlwZW9mIGtleSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlv73nlaXkuI3lj6/liJfkuL7lsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghbm90RW51bWVyYWJsZSAmJiAhZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5bGe5oCn5Yqg5YWlXG4gICAgICBzZXQuYWRkKGtleSk7XG4gICAgfVxuICAgIC8vIOe7p+aJv+WxnuaAp1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgaWYgKF9fcHJvdG9fXyAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXJlbnRLZXlzID0gdGhpcy5rZXlzKF9fcHJvdG9fXywgb3B0aW9ucyk7XG4gICAgICAgIGZvciAoY29uc3QgcGFyZW50S2V5IG9mIHBhcmVudEtleXMpIHtcbiAgICAgICAgICBzZXQuYWRkKHBhcmVudEtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8g6L+U5Zue5pWw57uEXG4gICAgcmV0dXJuIEFycmF5LmZyb20oc2V0KTtcbiAgfVxuICAvKipcbiAgICog5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3Jz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wg5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQg5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHsoUHJvcGVydHlEZXNjcmlwdG9yfHVuZGVmaW5lZClbXX1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9ycyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICBjb25zdCBfa2V5cyA9IHRoaXMua2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICAgIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSkpO1xuICB9XG4gIC8qKlxuICAgKiDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvckVudHJpZXPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge1sqLChQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkKV1bXX1cbiAgICovXG4gIHN0YXRpYyBkZXNjcmlwdG9yRW50cmllcyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICBjb25zdCBfa2V5cyA9IHRoaXMua2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICAgIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IFtrZXksIHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSldKTtcbiAgfVxuICAvKipcbiAgICog6L+H5ruk5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBwaWNrIOaMkemAieWxnuaAp1xuICAgKiBAcGFyYW0gb21pdCDlv73nlaXlsZ7mgKdcbiAgICogQHBhcmFtIGVtcHR5UGljayBwaWNrIOS4uuepuuaXtueahOWPluWAvOOAgmFsbCDlhajpg6hrZXnvvIxlbXB0eSDnqbpcbiAgICogQHBhcmFtIHNlcGFyYXRvciDlkIwgbmFtZXNUb0FycmF5IOeahCBzZXBhcmF0b3Ig5Y+C5pWwXG4gICAqIEBwYXJhbSBzeW1ib2wg5ZCMIGtleXMg55qEIHN5bWJvbCDlj4LmlbBcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUg5ZCMIGtleXMg55qEIG5vdEVudW1lcmFibGUg5Y+C5pWwXG4gICAqIEBwYXJhbSBleHRlbmQg5ZCMIGtleXMg55qEIGV4dGVuZCDlj4LmlbBcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIGZpbHRlcihvYmplY3QsIHsgcGljayA9IFtdLCBvbWl0ID0gW10sIGVtcHR5UGljayA9ICdhbGwnLCBzZXBhcmF0b3IgPSAnLCcsIHN5bWJvbCA9IHRydWUsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgLy8gcGlja+OAgW9taXQg57uf5LiA5oiQ5pWw57uE5qC85byPXG4gICAgcGljayA9IF9TdXBwb3J0Lm5hbWVzVG9BcnJheShwaWNrLCB7IHNlcGFyYXRvciB9KTtcbiAgICBvbWl0ID0gX1N1cHBvcnQubmFtZXNUb0FycmF5KG9taXQsIHsgc2VwYXJhdG9yIH0pO1xuICAgIGxldCBfa2V5cyA9IFtdO1xuICAgIC8vIHBpY2vmnInlgLznm7TmjqXmi7/vvIzkuLrnqbrml7bmoLnmja4gZW1wdHlQaWNrIOm7mOiupOaLv+epuuaIluWFqOmDqGtleVxuICAgIF9rZXlzID0gcGljay5sZW5ndGggPiAwIHx8IGVtcHR5UGljayA9PT0gJ2VtcHR5JyA/IHBpY2sgOiB0aGlzLmtleXMob2JqZWN0LCB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH0pO1xuICAgIC8vIG9taXTnrZvpgIlcbiAgICBfa2V5cyA9IF9rZXlzLmZpbHRlcihrZXkgPT4gIW9taXQuaW5jbHVkZXMoa2V5KSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgX2tleXMpIHtcbiAgICAgIGNvbnN0IGRlc2MgPSB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuICAgICAgLy8g5bGe5oCn5LiN5a2Y5Zyo5a+86Ie0ZGVzY+W+l+WIsHVuZGVmaW5lZOaXtuS4jeiuvue9ruWAvFxuICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvKipcbiAgICog6YCa6L+H5oyR6YCJ5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVyIOeahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgc3RhdGljIHBpY2sob2JqZWN0LCBrZXlzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihvYmplY3QsIHsgcGljazoga2V5cywgZW1wdHlQaWNrOiAnZW1wdHknLCAuLi5vcHRpb25zIH0pO1xuICB9XG4gIC8qKlxuICAgKiDpgJrov4fmjpLpmaTmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXIg55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qg5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBzdGF0aWMgb21pdChvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBvbWl0OiBrZXlzLCAuLi5vcHRpb25zIH0pO1xuICB9XG59XG4iLCIvKipcbiAqIGVzbGludCDphY3nva7vvJpodHRwOi8vZXNsaW50LmNuL2RvY3MvcnVsZXMvXG4gKiBlc2xpbnQtcGx1Z2luLXZ1ZSDphY3nva7vvJpodHRwczovL2VzbGludC52dWVqcy5vcmcvcnVsZXMvXG4gKi9cbmltcG9ydCB7IF9PYmplY3QsIF9EYXRhIH0gZnJvbSAnLi4vYmFzZSc7XG5cbi8qKlxuICog5a+85Ye65bi46YeP5L6/5o235L2/55SoXG4gKi9cbmV4cG9ydCBjb25zdCBPRkYgPSAnb2ZmJztcbmV4cG9ydCBjb25zdCBXQVJOID0gJ3dhcm4nO1xuZXhwb3J0IGNvbnN0IEVSUk9SID0gJ2Vycm9yJztcbi8qKlxuICog5a6a5Yi255qE6YWN572uXG4gKi9cbi8vIOWfuuehgOWumuWItlxuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSB7XG4gIC8vIOeOr+Wig+OAguS4gOS4queOr+Wig+WumuS5ieS6huS4gOe7hOmihOWumuS5ieeahOWFqOWxgOWPmOmHj1xuICBlbnY6IHtcbiAgICBicm93c2VyOiB0cnVlLFxuICAgIG5vZGU6IHRydWUsXG4gIH0sXG4gIC8vIOWFqOWxgOWPmOmHj1xuICBnbG9iYWxzOiB7XG4gICAgZ2xvYmFsVGhpczogJ3JlYWRvbmx5JyxcbiAgICBCaWdJbnQ6ICdyZWFkb25seScsXG4gIH0sXG4gIC8vIOino+aekOWZqFxuICBwYXJzZXJPcHRpb25zOiB7XG4gICAgZWNtYVZlcnNpb246ICdsYXRlc3QnLFxuICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnLFxuICAgIGVjbWFGZWF0dXJlczoge1xuICAgICAganN4OiB0cnVlLFxuICAgICAgZXhwZXJpbWVudGFsT2JqZWN0UmVzdFNwcmVhZDogdHJ1ZSxcbiAgICB9LFxuICB9LFxuICAvKipcbiAgICog57un5om/XG4gICAqIOS9v+eUqGVzbGludOeahOinhOWIme+8mmVzbGludDrphY3nva7lkI3np7BcbiAgICog5L2/55So5o+S5Lu255qE6YWN572u77yacGx1Z2luOuWMheWQjeeugOWGmS/phY3nva7lkI3np7BcbiAgICovXG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggZXNsaW50IOaOqOiNkOeahOinhOWImVxuICAgICdlc2xpbnQ6cmVjb21tZW5kZWQnLFxuICBdLFxuICAvKipcbiAgICog6KeE5YiZXG4gICAqIOadpeiHqiBlc2xpbnQg55qE6KeE5YiZ77ya6KeE5YiZSUQgOiB2YWx1ZVxuICAgKiDmnaXoh6rmj5Lku7bnmoTop4TliJnvvJrljIXlkI3nroDlhpkv6KeE5YiZSUQgOiB2YWx1ZVxuICAgKi9cbiAgcnVsZXM6IHtcbiAgICAvKipcbiAgICAgKiBQb3NzaWJsZSBFcnJvcnNcbiAgICAgKiDov5nkupvop4TliJnkuI4gSmF2YVNjcmlwdCDku6PnoIHkuK3lj6/og73nmoTplJnor6/miJbpgLvovpHplJnor6/mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnZ2V0dGVyLXJldHVybic6IE9GRiwgLy8g5by65Yi2IGdldHRlciDlh73mlbDkuK3lh7rnjrAgcmV0dXJuIOivreWPpVxuICAgICduby1jb25zdGFudC1jb25kaXRpb24nOiBPRkYsIC8vIOemgeatouWcqOadoeS7tuS4reS9v+eUqOW4uOmHj+ihqOi+vuW8j1xuICAgICduby1lbXB0eSc6IE9GRiwgLy8g56aB5q2i5Ye6546w56m66K+t5Y+l5Z2XXG4gICAgJ25vLWV4dHJhLXNlbWknOiBXQVJOLCAvLyDnpoHmraLkuI3lv4XopoHnmoTliIblj7dcbiAgICAnbm8tZnVuYy1hc3NpZ24nOiBPRkYsIC8vIOemgeatouWvuSBmdW5jdGlvbiDlo7DmmI7ph43mlrDotYvlgLxcbiAgICAnbm8tcHJvdG90eXBlLWJ1aWx0aW5zJzogT0ZGLCAvLyDnpoHmraLnm7TmjqXosIPnlKggT2JqZWN0LnByb3RvdHlwZXMg55qE5YaF572u5bGe5oCnXG5cbiAgICAvKipcbiAgICAgKiBCZXN0IFByYWN0aWNlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6juacgOS9s+Wunui3teeahO+8jOW4ruWKqeS9oOmBv+WFjeS4gOS6m+mXrumimO+8mlxuICAgICAqL1xuICAgICdhY2Nlc3Nvci1wYWlycyc6IEVSUk9SLCAvLyDlvLrliLYgZ2V0dGVyIOWSjCBzZXR0ZXIg5Zyo5a+56LGh5Lit5oiQ5a+55Ye6546wXG4gICAgJ2FycmF5LWNhbGxiYWNrLXJldHVybic6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueazleeahOWbnuiwg+WHveaVsOS4reaciSByZXR1cm4g6K+t5Y+lXG4gICAgJ2Jsb2NrLXNjb3BlZC12YXInOiBFUlJPUiwgLy8g5by65Yi25oqK5Y+Y6YeP55qE5L2/55So6ZmQ5Yi25Zyo5YW25a6a5LmJ55qE5L2c55So5Z+f6IyD5Zu05YaFXG4gICAgJ2N1cmx5JzogV0FSTiwgLy8g5by65Yi25omA5pyJ5o6n5Yi26K+t5Y+l5L2/55So5LiA6Ie055qE5ous5Y+36aOO5qC8XG4gICAgJ25vLWZhbGx0aHJvdWdoJzogV0FSTiwgLy8g56aB5q2iIGNhc2Ug6K+t5Y+l6JC956m6XG4gICAgJ25vLWZsb2F0aW5nLWRlY2ltYWwnOiBFUlJPUiwgLy8g56aB5q2i5pWw5a2X5a2X6Z2i6YeP5Lit5L2/55So5YmN5a+85ZKM5pyr5bC+5bCP5pWw54K5XG4gICAgJ25vLW11bHRpLXNwYWNlcyc6IFdBUk4sIC8vIOemgeatouS9v+eUqOWkmuS4quepuuagvFxuICAgICduby1uZXctd3JhcHBlcnMnOiBFUlJPUiwgLy8g56aB5q2i5a+5IFN0cmluZ++8jE51bWJlciDlkowgQm9vbGVhbiDkvb/nlKggbmV3IOaTjeS9nOesplxuICAgICduby1wcm90byc6IEVSUk9SLCAvLyDnpoHnlKggX19wcm90b19fIOWxnuaAp1xuICAgICduby1yZXR1cm4tYXNzaWduJzogV0FSTiwgLy8g56aB5q2i5ZyoIHJldHVybiDor63lj6XkuK3kvb/nlKjotYvlgLzor63lj6VcbiAgICAnbm8tdXNlbGVzcy1lc2NhcGUnOiBXQVJOLCAvLyDnpoHnlKjkuI3lv4XopoHnmoTovazkuYnlrZfnrKZcblxuICAgIC8qKlxuICAgICAqIFZhcmlhYmxlc1xuICAgICAqIOi/meS6m+inhOWImeS4juWPmOmHj+WjsOaYjuacieWFs++8mlxuICAgICAqL1xuICAgICduby11bmRlZi1pbml0JzogV0FSTiwgLy8g56aB5q2i5bCG5Y+Y6YeP5Yid5aeL5YyW5Li6IHVuZGVmaW5lZFxuICAgICduby11bnVzZWQtdmFycyc6IE9GRiwgLy8g56aB5q2i5Ye6546w5pyq5L2/55So6L+H55qE5Y+Y6YePXG4gICAgJ25vLXVzZS1iZWZvcmUtZGVmaW5lJzogW0VSUk9SLCB7ICdmdW5jdGlvbnMnOiBmYWxzZSwgJ2NsYXNzZXMnOiBmYWxzZSwgJ3ZhcmlhYmxlcyc6IGZhbHNlIH1dLCAvLyDnpoHmraLlnKjlj5jph4/lrprkuYnkuYvliY3kvb/nlKjlroPku6xcblxuICAgIC8qKlxuICAgICAqIFN0eWxpc3RpYyBJc3N1ZXNcbiAgICAgKiDov5nkupvop4TliJnmmK/lhbPkuo7po47moLzmjIfljZfnmoTvvIzogIzkuJTmmK/pnZ7luLjkuLvop4LnmoTvvJpcbiAgICAgKi9cbiAgICAnYXJyYXktYnJhY2tldC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25pWw57uE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Jsb2NrLXNwYWNpbmcnOiBXQVJOLCAvLyDnpoHmraLmiJblvLrliLblnKjku6PnoIHlnZfkuK3lvIDmi6zlj7fliY3lkozpl63mi6zlj7flkI7mnInnqbrmoLxcbiAgICAnYnJhY2Utc3R5bGUnOiBbV0FSTiwgJzF0YnMnLCB7ICdhbGxvd1NpbmdsZUxpbmUnOiB0cnVlIH1dLCAvLyDlvLrliLblnKjku6PnoIHlnZfkuK3kvb/nlKjkuIDoh7TnmoTlpKfmi6zlj7fpo47moLxcbiAgICAnY29tbWEtZGFuZ2xlJzogW1dBUk4sICdhbHdheXMtbXVsdGlsaW5lJ10sIC8vIOimgeaxguaIluemgeatouacq+WwvumAl+WPt1xuICAgICdjb21tYS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6YCX5Y+35YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2NvbW1hLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25L2/55So5LiA6Ie055qE6YCX5Y+36aOO5qC8XG4gICAgJ2NvbXB1dGVkLXByb3BlcnR5LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjorqHnrpfnmoTlsZ7mgKfnmoTmlrnmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnZnVuYy1jYWxsLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjlh73mlbDmoIfor4bnrKblkozlhbbosIPnlKjkuYvpl7TmnInnqbrmoLxcbiAgICAnZnVuY3Rpb24tcGFyZW4tbmV3bGluZSc6IFdBUk4sIC8vIOW8uuWItuWcqOWHveaVsOaLrOWPt+WGheS9v+eUqOS4gOiHtOeahOaNouihjFxuICAgICdpbXBsaWNpdC1hcnJvdy1saW5lYnJlYWsnOiBXQVJOLCAvLyDlvLrliLbpmpDlvI/ov5Tlm57nmoTnrq3lpLTlh73mlbDkvZPnmoTkvY3nva5cbiAgICAnaW5kZW50JzogW1dBUk4sIDIsIHsgJ1N3aXRjaENhc2UnOiAxIH1dLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTnvKnov5tcbiAgICAnanN4LXF1b3Rlcyc6IFdBUk4sIC8vIOW8uuWItuWcqCBKU1gg5bGe5oCn5Lit5LiA6Ie05Zyw5L2/55So5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ2tleS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo5a+56LGh5a2X6Z2i6YeP55qE5bGe5oCn5Lit6ZSu5ZKM5YC85LmL6Ze05L2/55So5LiA6Ie055qE6Ze06LedXG4gICAgJ2tleXdvcmQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWFs+mUruWtl+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICduZXctcGFyZW5zJzogV0FSTiwgLy8g5by65Yi25oiW56aB5q2i6LCD55So5peg5Y+C5p6E6YCg5Ye95pWw5pe25pyJ5ZyG5ous5Y+3XG4gICAgJ25vLW1peGVkLXNwYWNlcy1hbmQtdGFicyc6IFdBUk4sXG4gICAgJ25vLW11bHRpcGxlLWVtcHR5LWxpbmVzJzogW1dBUk4sIHsgJ21heCc6IDEsICdtYXhFT0YnOiAwLCAnbWF4Qk9GJzogMCB9XSwgLy8g56aB5q2i5Ye6546w5aSa6KGM56m66KGMXG4gICAgJ25vLXRyYWlsaW5nLXNwYWNlcyc6IFdBUk4sIC8vIOemgeeUqOihjOWwvuepuuagvFxuICAgICduby13aGl0ZXNwYWNlLWJlZm9yZS1wcm9wZXJ0eSc6IFdBUk4sIC8vIOemgeatouWxnuaAp+WJjeacieepuueZvVxuICAgICdub25ibG9jay1zdGF0ZW1lbnQtYm9keS1wb3NpdGlvbic6IFdBUk4sIC8vIOW8uuWItuWNleS4quivreWPpeeahOS9jee9rlxuICAgICdvYmplY3QtY3VybHktbmV3bGluZSc6IFtXQVJOLCB7ICdtdWx0aWxpbmUnOiB0cnVlLCAnY29uc2lzdGVudCc6IHRydWUgfV0sIC8vIOW8uuWItuWkp+aLrOWPt+WGheaNouihjOespueahOS4gOiHtOaAp1xuICAgICdvYmplY3QtY3VybHktc3BhY2luZyc6IFtXQVJOLCAnYWx3YXlzJ10sIC8vIOW8uuWItuWcqOWkp+aLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdwYWRkZWQtYmxvY2tzJzogW1dBUk4sICduZXZlciddLCAvLyDopoHmsYLmiJbnpoHmraLlnZflhoXloavlhYVcbiAgICAncXVvdGVzJzogW1dBUk4sICdzaW5nbGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUsICdhbGxvd1RlbXBsYXRlTGl0ZXJhbHMnOiB0cnVlIH1dLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTlj43li77lj7fjgIHlj4zlvJXlj7fmiJbljZXlvJXlj7dcbiAgICAnc2VtaSc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouS9v+eUqOWIhuWPt+S7o+abvyBBU0lcbiAgICAnc2VtaS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25YiG5Y+35LmL5YmN5ZKM5LmL5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NlbWktc3R5bGUnOiBXQVJOLCAvLyDlvLrliLbliIblj7fnmoTkvY3nva5cbiAgICAnc3BhY2UtYmVmb3JlLWJsb2Nrcyc6IFdBUk4sIC8vIOW8uuWItuWcqOWdl+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1iZWZvcmUtZnVuY3Rpb24tcGFyZW4nOiBbV0FSTiwgeyAnYW5vbnltb3VzJzogJ25ldmVyJywgJ25hbWVkJzogJ25ldmVyJywgJ2FzeW5jQXJyb3cnOiAnYWx3YXlzJyB9XSwgLy8g5by65Yi25ZyoIGZ1bmN0aW9u55qE5bem5ous5Y+35LmL5YmN5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWluLXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuWcqOWchuaLrOWPt+WGheS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbmZpeC1vcHMnOiBXQVJOLCAvLyDopoHmsYLmk43kvZznrKblkajlm7TmnInnqbrmoLxcbiAgICAnc3BhY2UtdW5hcnktb3BzJzogV0FSTiwgLy8g5by65Yi25Zyo5LiA5YWD5pON5L2c56ym5YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlZC1jb21tZW50JzogV0FSTiwgLy8g5by65Yi25Zyo5rOo6YeK5LitIC8vIOaIliAvKiDkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3dpdGNoLWNvbG9uLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKggc3dpdGNoIOeahOWGkuWPt+W3puWPs+acieepuuagvFxuICAgICd0ZW1wbGF0ZS10YWctc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouWcqOaooeadv+agh+iusOWSjOWug+S7rOeahOWtl+mdoumHj+S5i+mXtOeahOepuuagvFxuXG4gICAgLyoqXG4gICAgICogRUNNQVNjcmlwdCA2XG4gICAgICog6L+Z5Lqb6KeE5YiZ5Y+q5LiOIEVTNiDmnInlhbMsIOWNs+mAmuW4uOaJgOivtOeahCBFUzIwMTXvvJpcbiAgICAgKi9cbiAgICAnYXJyb3ctc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItueureWktOWHveaVsOeahOeureWktOWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdnZW5lcmF0b3Itc3Rhci1zcGFjaW5nJzogW1dBUk4sIHsgJ2JlZm9yZSc6IGZhbHNlLCAnYWZ0ZXInOiB0cnVlLCAnbWV0aG9kJzogeyAnYmVmb3JlJzogdHJ1ZSwgJ2FmdGVyJzogZmFsc2UgfSB9XSwgLy8g5by65Yi2IGdlbmVyYXRvciDlh73mlbDkuK0gKiDlj7flkajlm7Tkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbm8tdXNlbGVzcy1yZW5hbWUnOiBXQVJOLCAvLyDnpoHmraLlnKggaW1wb3J0IOWSjCBleHBvcnQg5ZKM6Kej5p6E6LWL5YC85pe25bCG5byV55So6YeN5ZG95ZCN5Li655u45ZCM55qE5ZCN5a2XXG4gICAgJ3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sIC8vIOimgeaxguS9v+eUqOaooeadv+Wtl+mdoumHj+iAjOmdnuWtl+espuS4sui/nuaOpVxuICAgICdyZXN0LXNwcmVhZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Ymp5L2Z5ZKM5omp5bGV6L+Q566X56ym5Y+K5YW26KGo6L6+5byP5LmL6Ze05pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLWN1cmx5LXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLmqKHmnb/lrZfnrKbkuLLkuK3nmoTltYzlhaXooajovr7lvI/lkajlm7TnqbrmoLznmoTkvb/nlKhcbiAgICAneWllbGQtc3Rhci1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHlpZWxkKiDooajovr7lvI/kuK0gKiDlkajlm7Tkvb/nlKjnqbrmoLxcbiAgfSxcbiAgLy8g6KaG55uWXG4gIG92ZXJyaWRlczogW10sXG59O1xuLy8gdnVlMi92dWUzIOWFseeUqFxuZXhwb3J0IGNvbnN0IHZ1ZUNvbW1vbkNvbmZpZyA9IHtcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL211bHRpLXdvcmQtY29tcG9uZW50LW5hbWVzJzogT0ZGLCAvLyDopoHmsYLnu4Tku7blkI3np7Dlp4vnu4jkuLrlpJrlrZdcbiAgICAndnVlL25vLXVudXNlZC1jb21wb25lbnRzJzogV0FSTiwgLy8g5pyq5L2/55So55qE57uE5Lu2XG4gICAgJ3Z1ZS9uby11bnVzZWQtdmFycyc6IE9GRiwgLy8g5pyq5L2/55So55qE5Y+Y6YePXG4gICAgJ3Z1ZS9yZXF1aXJlLXJlbmRlci1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmuLLmn5Plh73mlbDmgLvmmK/ov5Tlm57lgLxcbiAgICAndnVlL3JlcXVpcmUtdi1mb3Ita2V5JzogT0ZGLCAvLyB2LWZvcuS4reW/hemhu+S9v+eUqGtleVxuICAgICd2dWUvcmV0dXJuLWluLWNvbXB1dGVkLXByb3BlcnR5JzogV0FSTiwgLy8g5by65Yi26L+U5Zue6K+t5Y+l5a2Y5Zyo5LqO6K6h566X5bGe5oCn5LitXG4gICAgJ3Z1ZS92YWxpZC10ZW1wbGF0ZS1yb290JzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoTmqKHmnb/moLlcbiAgICAndnVlL3ZhbGlkLXYtZm9yJzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoR2LWZvcuaMh+S7pFxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9hdHRyaWJ1dGUtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOW8uuWItuWxnuaAp+WQjeagvOW8j1xuICAgICd2dWUvY29tcG9uZW50LWRlZmluaXRpb24tbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOW8uuWItue7hOS7tm5hbWXmoLzlvI9cbiAgICAndnVlL2h0bWwtcXVvdGVzJzogW1dBUk4sICdkb3VibGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUgfV0sIC8vIOW8uuWItiBIVE1MIOWxnuaAp+eahOW8leWPt+agt+W8j1xuICAgICd2dWUvaHRtbC1zZWxmLWNsb3NpbmcnOiBPRkYsIC8vIOS9v+eUqOiHqumXreWQiOagh+etvlxuICAgICd2dWUvbWF4LWF0dHJpYnV0ZXMtcGVyLWxpbmUnOiBbV0FSTiwgeyAnc2luZ2xlbGluZSc6IEluZmluaXR5LCAnbXVsdGlsaW5lJzogMSB9XSwgLy8g5by65Yi25q+P6KGM5YyF5ZCr55qE5pyA5aSn5bGe5oCn5pWwXG4gICAgJ3Z1ZS9tdWx0aWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5aSa6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS9wcm9wLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDkuLogVnVlIOe7hOS7tuS4reeahCBQcm9wIOWQjeensOW8uuWItuaJp+ihjOeJueWumuWkp+Wwj+WGmVxuICAgICd2dWUvcmVxdWlyZS1kZWZhdWx0LXByb3AnOiBPRkYsIC8vIHByb3Bz6ZyA6KaB6buY6K6k5YC8XG4gICAgJ3Z1ZS9zaW5nbGVsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWNleihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvdi1iaW5kLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LWJpbmTmjIfku6Tpo47moLxcbiAgICAndnVlL3Ytb24tc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtb27mjIfku6Tpo47moLxcbiAgICAndnVlL3Ytc2xvdC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1zbG905oyH5Luk6aOO5qC8XG4gICAgLy8gUHJpb3JpdHkgQzogUmVjb21tZW5kZWRcbiAgICAndnVlL25vLXYtaHRtbCc6IE9GRiwgLy8g56aB5q2i5L2/55Sodi1odG1sXG4gICAgLy8gVW5jYXRlZ29yaXplZFxuICAgICd2dWUvYmxvY2stdGFnLW5ld2xpbmUnOiBXQVJOLCAvLyAg5Zyo5omT5byA5Z2X57qn5qCH6K6w5LmL5ZCO5ZKM5YWz6Zet5Z2X57qn5qCH6K6w5LmL5YmN5by65Yi25o2i6KGMXG4gICAgJ3Z1ZS9odG1sLWNvbW1lbnQtY29udGVudC1zcGFjaW5nJzogV0FSTiwgLy8g5ZyoSFRNTOazqOmHiuS4reW8uuWItue7n+S4gOeahOepuuagvFxuICAgICd2dWUvc2NyaXB0LWluZGVudCc6IFtXQVJOLCAyLCB7ICdiYXNlSW5kZW50JzogMSwgJ3N3aXRjaENhc2UnOiAxIH1dLCAvLyDlnKg8c2NyaXB0PuS4reW8uuWItuS4gOiHtOeahOe8qei/m1xuICAgIC8vIEV4dGVuc2lvbiBSdWxlc+OAguWvueW6lGVzbGludOeahOWQjOWQjeinhOWIme+8jOmAgueUqOS6jjx0ZW1wbGF0ZT7kuK3nmoTooajovr7lvI9cbiAgICAndnVlL2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9ibG9jay1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSxcbiAgICAndnVlL2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLFxuICAgICd2dWUvY29tbWEtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9jb21tYS1zdHlsZSc6IFdBUk4sXG4gICAgJ3Z1ZS9mdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXktc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXl3b3JkLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLFxuICAgICd2dWUvc3BhY2UtaW4tcGFyZW5zJzogV0FSTixcbiAgICAndnVlL3NwYWNlLWluZml4LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS11bmFyeS1vcHMnOiBXQVJOLFxuICAgICd2dWUvYXJyb3ctc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9wcmVmZXItdGVtcGxhdGUnOiBXQVJOLFxuICB9LFxuICBvdmVycmlkZXM6IFtcbiAgICB7XG4gICAgICAnZmlsZXMnOiBbJyoudnVlJ10sXG4gICAgICAncnVsZXMnOiB7XG4gICAgICAgICdpbmRlbnQnOiBPRkYsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuLy8gdnVlMueUqFxuZXhwb3J0IGNvbnN0IHZ1ZTJDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUyIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3JlY29tbWVuZGVkJyxcbiAgXSxcbn0pO1xuLy8gdnVlM+eUqFxuZXhwb3J0IGNvbnN0IHZ1ZTNDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZW52OiB7XG4gICAgJ3Z1ZS9zZXR1cC1jb21waWxlci1tYWNyb3MnOiB0cnVlLCAvLyDlpITnkIZzZXR1cOaooeadv+S4reWDjyBkZWZpbmVQcm9wcyDlkowgZGVmaW5lRW1pdHMg6L+Z5qC355qE57yW6K+R5Zmo5a6P5oqlIG5vLXVuZGVmIOeahOmXrumimO+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy91c2VyLWd1aWRlLyNjb21waWxlci1tYWNyb3Mtc3VjaC1hcy1kZWZpbmVwcm9wcy1hbmQtZGVmaW5lZW1pdHMtZ2VuZXJhdGUtbm8tdW5kZWYtd2FybmluZ3NcbiAgfSxcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUzIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3Z1ZTMtcmVjb21tZW5kZWQnLFxuICBdLFxuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbm8tdGVtcGxhdGUta2V5JzogT0ZGLCAvLyDnpoHmraI8dGVtcGxhdGU+5Lit5L2/55Soa2V55bGe5oCnXG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXR1cm4taW4tZW1pdHMtdmFsaWRhdG9yJzogV0FSTiwgLy8g5by65Yi25ZyoZW1pdHPpqozor4HlmajkuK3lrZjlnKjov5Tlm57or63lj6VcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmVxdWlyZS1leHBsaWNpdC1lbWl0cyc6IE9GRiwgLy8g6ZyA6KaBZW1pdHPkuK3lrprkuYnpgInpobnnlKjkuo4kZW1pdCgpXG4gICAgJ3Z1ZS92LW9uLWV2ZW50LWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlnKjmqKHmnb/kuK3nmoToh6rlrprkuYnnu4Tku7bkuIrlvLrliLbmiafooYwgdi1vbiDkuovku7blkb3lkI3moLflvI9cbiAgfSxcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKC4uLm9iamVjdHMpIHtcbiAgY29uc3QgW3RhcmdldCwgLi4uc291cmNlc10gPSBvYmplY3RzO1xuICBjb25zdCByZXN1bHQgPSBfRGF0YS5kZWVwQ2xvbmUodGFyZ2V0KTtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpIHtcbiAgICAgIC8vIOeJueauiuWtl+auteWkhOeQhlxuICAgICAgaWYgKGtleSA9PT0gJ3J1bGVzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IGtleSwgdmFsdWUsICdyZXN1bHRba2V5XSc6IHJlc3VsdFtrZXldIH0pO1xuICAgICAgICAvLyDliJ3lp4vkuI3lrZjlnKjml7botYvpu5jorqTlgLznlKjkuo7lkIjlubZcbiAgICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyB7fTtcbiAgICAgICAgLy8g5a+55ZCE5p2h6KeE5YiZ5aSE55CGXG4gICAgICAgIGZvciAobGV0IFtydWxlS2V5LCBydWxlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICAgIC8vIOW3suacieWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGxldCBzb3VyY2VSdWxlVmFsdWUgPSByZXN1bHRba2V5XVtydWxlS2V5XSA/PyBbXTtcbiAgICAgICAgICBpZiAoIShzb3VyY2VSdWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZSA9IFtzb3VyY2VSdWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDopoHlkIjlubbnmoTlgLznu5/kuIDmiJDmlbDnu4TlpITnkIZcbiAgICAgICAgICBpZiAoIShydWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHJ1bGVWYWx1ZSA9IFtydWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDnu5/kuIDmoLzlvI/lkI7ov5vooYzmlbDnu4Tlvqrnjq/mk43kvZxcbiAgICAgICAgICBmb3IgKGNvbnN0IFt2YWxJbmRleCwgdmFsXSBvZiBPYmplY3QuZW50cmllcyhydWxlVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyDlr7nosaHmt7HlkIjlubbvvIzlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgICAgICAgIGlmIChfRGF0YS5nZXRFeGFjdFR5cGUodmFsKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPSBfT2JqZWN0LmRlZXBBc3NpZ24oc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA/PyB7fSwgdmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOi1i+WAvOinhOWImee7k+aenFxuICAgICAgICAgIHJlc3VsdFtrZXldW3J1bGVLZXldID0gc291cmNlUnVsZVZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5a2X5q615qC55o2u57G75Z6L5Yik5pat5aSE55CGXG4gICAgICAvLyDmlbDnu4TvvJrmi7zmjqVcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIChyZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IFtdKS5wdXNoKC4uLnZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blr7nosaHvvJrmt7HlkIjlubZcbiAgICAgIGlmIChfRGF0YS5nZXRFeGFjdFR5cGUodmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgX09iamVjdC5kZWVwQXNzaWduKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8ge30sIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIOS9v+eUqOWumuWItueahOmFjee9rlxuICogQHBhcmFtIHt977ya6YWN572u6aG5XG4gKiAgICAgICAgICBiYXNl77ya5L2/55So5Z+656GAZXNsaW505a6a5Yi277yM6buY6K6kIHRydWVcbiAqICAgICAgICAgIHZ1ZVZlcnNpb27vvJp2dWXniYjmnKzvvIzlvIDlkK/lkI7pnIDopoHlronoo4UgZXNsaW50LXBsdWdpbi12dWVcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZSh7IGJhc2UgPSB0cnVlLCB2dWVWZXJzaW9uIH0gPSB7fSkge1xuICBsZXQgcmVzdWx0ID0ge307XG4gIGlmIChiYXNlKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCBiYXNlQ29uZmlnKTtcbiAgfVxuICBpZiAodnVlVmVyc2lvbiA9PSAyKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUyQ29uZmlnKTtcbiAgfSBlbHNlIGlmICh2dWVWZXJzaW9uID09IDMpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTNDb25maWcpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICBiYXNlOiAnLi8nLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIC8vIOWIq+WQjVxuICAgIGFsaWFzOiB7XG4gICAgICAvLyAnQHJvb3QnOiByZXNvbHZlKF9fZGlybmFtZSksXG4gICAgICAvLyAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyDop4Tlrprop6blj5HorablkYrnmoQgY2h1bmsg5aSn5bCP44CC77yI5LulIGticyDkuLrljZXkvY3vvIlcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIgKiogMTAsXG4gICAgLy8g6Ieq5a6a5LmJ5bqV5bGC55qEIFJvbGx1cCDmiZPljIXphY3nva7jgIJcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8g5YWl5Y+j5paH5Lu25ZCNXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzL2VudHJ5LSR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOWdl+aWh+S7tuWQjVxuICAgICAgICBjaHVua0ZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDotYTmupDmlofku7blkI3vvIxjc3PjgIHlm77niYfnrYlcbiAgICAgICAgYXNzZXRGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLltleHRdYDtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iLCIvLyDor7fmsYLmlrnms5VcbmV4cG9ydCBjb25zdCBNRVRIT0RTID0gWydHRVQnLCAnSEVBRCcsICdQT1NUJywgJ1BVVCcsICdERUxFVEUnLCAnQ09OTkVDVCcsICdPUFRJT05TJywgJ1RSQUNFJywgJ1BBVENIJ107XG4vLyBodHRwIOeKtuaAgeeggVxuZXhwb3J0IGNvbnN0IFNUQVRVU0VTID0gW1xuICB7ICdzdGF0dXMnOiAxMDAsICdzdGF0dXNUZXh0JzogJ0NvbnRpbnVlJyB9LFxuICB7ICdzdGF0dXMnOiAxMDEsICdzdGF0dXNUZXh0JzogJ1N3aXRjaGluZyBQcm90b2NvbHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMiwgJ3N0YXR1c1RleHQnOiAnUHJvY2Vzc2luZycgfSxcbiAgeyAnc3RhdHVzJzogMTAzLCAnc3RhdHVzVGV4dCc6ICdFYXJseSBIaW50cycgfSxcbiAgeyAnc3RhdHVzJzogMjAwLCAnc3RhdHVzVGV4dCc6ICdPSycgfSxcbiAgeyAnc3RhdHVzJzogMjAxLCAnc3RhdHVzVGV4dCc6ICdDcmVhdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDIsICdzdGF0dXNUZXh0JzogJ0FjY2VwdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDMsICdzdGF0dXNUZXh0JzogJ05vbi1BdXRob3JpdGF0aXZlIEluZm9ybWF0aW9uJyB9LFxuICB7ICdzdGF0dXMnOiAyMDQsICdzdGF0dXNUZXh0JzogJ05vIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNSwgJ3N0YXR1c1RleHQnOiAnUmVzZXQgQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA2LCAnc3RhdHVzVGV4dCc6ICdQYXJ0aWFsIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNywgJ3N0YXR1c1RleHQnOiAnTXVsdGktU3RhdHVzJyB9LFxuICB7ICdzdGF0dXMnOiAyMDgsICdzdGF0dXNUZXh0JzogJ0FscmVhZHkgUmVwb3J0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIyNiwgJ3N0YXR1c1RleHQnOiAnSU0gVXNlZCcgfSxcbiAgeyAnc3RhdHVzJzogMzAwLCAnc3RhdHVzVGV4dCc6ICdNdWx0aXBsZSBDaG9pY2VzJyB9LFxuICB7ICdzdGF0dXMnOiAzMDEsICdzdGF0dXNUZXh0JzogJ01vdmVkIFBlcm1hbmVudGx5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDIsICdzdGF0dXNUZXh0JzogJ0ZvdW5kJyB9LFxuICB7ICdzdGF0dXMnOiAzMDMsICdzdGF0dXNUZXh0JzogJ1NlZSBPdGhlcicgfSxcbiAgeyAnc3RhdHVzJzogMzA0LCAnc3RhdHVzVGV4dCc6ICdOb3QgTW9kaWZpZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNSwgJ3N0YXR1c1RleHQnOiAnVXNlIFByb3h5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDcsICdzdGF0dXNUZXh0JzogJ1RlbXBvcmFyeSBSZWRpcmVjdCcgfSxcbiAgeyAnc3RhdHVzJzogMzA4LCAnc3RhdHVzVGV4dCc6ICdQZXJtYW5lbnQgUmVkaXJlY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMCwgJ3N0YXR1c1RleHQnOiAnQmFkIFJlcXVlc3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMSwgJ3N0YXR1c1RleHQnOiAnVW5hdXRob3JpemVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDIsICdzdGF0dXNUZXh0JzogJ1BheW1lbnQgUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMywgJ3N0YXR1c1RleHQnOiAnRm9yYmlkZGVuJyB9LFxuICB7ICdzdGF0dXMnOiA0MDQsICdzdGF0dXNUZXh0JzogJ05vdCBGb3VuZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA1LCAnc3RhdHVzVGV4dCc6ICdNZXRob2QgTm90IEFsbG93ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNiwgJ3N0YXR1c1RleHQnOiAnTm90IEFjY2VwdGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNywgJ3N0YXR1c1RleHQnOiAnUHJveHkgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwOCwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDksICdzdGF0dXNUZXh0JzogJ0NvbmZsaWN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MTAsICdzdGF0dXNUZXh0JzogJ0dvbmUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMSwgJ3N0YXR1c1RleHQnOiAnTGVuZ3RoIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTIsICdzdGF0dXNUZXh0JzogJ1ByZWNvbmRpdGlvbiBGYWlsZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMywgJ3N0YXR1c1RleHQnOiAnUGF5bG9hZCBUb28gTGFyZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNCwgJ3N0YXR1c1RleHQnOiAnVVJJIFRvbyBMb25nJyB9LFxuICB7ICdzdGF0dXMnOiA0MTUsICdzdGF0dXNUZXh0JzogJ1Vuc3VwcG9ydGVkIE1lZGlhIFR5cGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNiwgJ3N0YXR1c1RleHQnOiAnUmFuZ2UgTm90IFNhdGlzZmlhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTcsICdzdGF0dXNUZXh0JzogJ0V4cGVjdGF0aW9uIEZhaWxlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDE4LCAnc3RhdHVzVGV4dCc6ICdJXFwnbSBhIFRlYXBvdCcgfSxcbiAgeyAnc3RhdHVzJzogNDIxLCAnc3RhdHVzVGV4dCc6ICdNaXNkaXJlY3RlZCBSZXF1ZXN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MjIsICdzdGF0dXNUZXh0JzogJ1VucHJvY2Vzc2FibGUgRW50aXR5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjMsICdzdGF0dXNUZXh0JzogJ0xvY2tlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI0LCAnc3RhdHVzVGV4dCc6ICdGYWlsZWQgRGVwZW5kZW5jeScgfSxcbiAgeyAnc3RhdHVzJzogNDI1LCAnc3RhdHVzVGV4dCc6ICdUb28gRWFybHknIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNiwgJ3N0YXR1c1RleHQnOiAnVXBncmFkZSBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI4LCAnc3RhdHVzVGV4dCc6ICdQcmVjb25kaXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyOSwgJ3N0YXR1c1RleHQnOiAnVG9vIE1hbnkgUmVxdWVzdHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDQzMSwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBIZWFkZXIgRmllbGRzIFRvbyBMYXJnZScgfSxcbiAgeyAnc3RhdHVzJzogNDUxLCAnc3RhdHVzVGV4dCc6ICdVbmF2YWlsYWJsZSBGb3IgTGVnYWwgUmVhc29ucycgfSxcbiAgeyAnc3RhdHVzJzogNTAwLCAnc3RhdHVzVGV4dCc6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMSwgJ3N0YXR1c1RleHQnOiAnTm90IEltcGxlbWVudGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDIsICdzdGF0dXNUZXh0JzogJ0JhZCBHYXRld2F5JyB9LFxuICB7ICdzdGF0dXMnOiA1MDMsICdzdGF0dXNUZXh0JzogJ1NlcnZpY2UgVW5hdmFpbGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNCwgJ3N0YXR1c1RleHQnOiAnR2F0ZXdheSBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA1MDUsICdzdGF0dXNUZXh0JzogJ0hUVFAgVmVyc2lvbiBOb3QgU3VwcG9ydGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDYsICdzdGF0dXNUZXh0JzogJ1ZhcmlhbnQgQWxzbyBOZWdvdGlhdGVzJyB9LFxuICB7ICdzdGF0dXMnOiA1MDcsICdzdGF0dXNUZXh0JzogJ0luc3VmZmljaWVudCBTdG9yYWdlJyB9LFxuICB7ICdzdGF0dXMnOiA1MDgsICdzdGF0dXNUZXh0JzogJ0xvb3AgRGV0ZWN0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwOSwgJ3N0YXR1c1RleHQnOiAnQmFuZHdpZHRoIExpbWl0IEV4Y2VlZGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MTAsICdzdGF0dXNUZXh0JzogJ05vdCBFeHRlbmRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTExLCAnc3RhdHVzVGV4dCc6ICdOZXR3b3JrIEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyB9LFxuXTtcbiIsIi8vIOWJqui0tOadv1xuLyoqXG4gKiDlpI3liLbmlofmnKzml6flhpnms5XjgILlnKggY2xpcGJvYXJkIGFwaSDkuI3lj6/nlKjml7bku6Pmm79cbiAqIEBwYXJhbSB0ZXh0XG4gKiBAcmV0dXJucyB7UHJvbWlzZTxQcm9taXNlPHZvaWQ+fFByb21pc2U8bmV2ZXI+Pn1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gb2xkQ29weVRleHQodGV4dCkge1xuICAvLyDmlrDlu7rovpPlhaXmoYZcbiAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAvLyDotYvlgLxcbiAgdGV4dGFyZWEudmFsdWUgPSB0ZXh0O1xuICAvLyDmoLflvI/orr7nva5cbiAgT2JqZWN0LmFzc2lnbih0ZXh0YXJlYS5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgIHRvcDogMCxcbiAgICBjbGlwUGF0aDogJ2NpcmNsZSgwKScsXG4gIH0pO1xuICAvLyDliqDlhaXliLDpobXpnaJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGV4dGFyZWEpO1xuICAvLyDpgInkuK1cbiAgdGV4dGFyZWEuc2VsZWN0KCk7XG4gIC8vIOWkjeWItlxuICBjb25zdCBzdWNjZXNzID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgLy8g5LuO6aG16Z2i56e76ZmkXG4gIHRleHRhcmVhLnJlbW92ZSgpO1xuICByZXR1cm4gc3VjY2VzcyA/IFByb21pc2UucmVzb2x2ZSgpIDogUHJvbWlzZS5yZWplY3QoKTtcbn1cbmV4cG9ydCBjb25zdCBjbGlwYm9hcmQgPSB7XG4gIC8qKlxuICAgKiDlhpnlhaXmlofmnKwo5aSN5Yi2KVxuICAgKiBAcGFyYW0gdGV4dFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIGFzeW5jIHdyaXRlVGV4dCh0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gYXdhaXQgb2xkQ29weVRleHQodGV4dCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICog6K+75Y+W5paH5pysKOeymOi0tClcbiAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHJlYWRUZXh0KCkge1xuICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG4gIH0sXG59O1xuIiwiLyohIGpzLWNvb2tpZSB2My4wLjUgfCBNSVQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuZnVuY3Rpb24gYXNzaWduICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXRcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xudmFyIGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gIHJlYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXG4gICAgICAvJSgyWzM0NkJGXXwzW0FDLUZdfDQwfDVbQkRFXXw2MHw3W0JDRF0pL2csXG4gICAgICBkZWNvZGVVUklDb21wb25lbnRcbiAgICApXG4gIH1cbn07XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuZnVuY3Rpb24gaW5pdCAoY29udmVydGVyLCBkZWZhdWx0QXR0cmlidXRlcykge1xuICBmdW5jdGlvbiBzZXQgKG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGU1KTtcbiAgICB9XG4gICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgbmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKVxuICAgICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcblxuICAgIHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcbiAgICAgIC8vIC4uLlxuICAgICAgLy8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuICAgICAgLy8gICAgIGNoYXJhY3RlcjpcbiAgICAgIC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG4gICAgICAvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cbiAgICAgIC8vIC4uLlxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9XG4gICAgICBuYW1lICsgJz0nICsgY29udmVydGVyLndyaXRlKHZhbHVlLCBuYW1lKSArIHN0cmluZ2lmaWVkQXR0cmlidXRlcylcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldCAobmFtZSkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IChhcmd1bWVudHMubGVuZ3RoICYmICFuYW1lKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuICAgIC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgdmFyIGphciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZm91bmQgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICBqYXJbZm91bmRdID0gY29udmVydGVyLnJlYWQodmFsdWUsIGZvdW5kKTtcblxuICAgICAgICBpZiAobmFtZSA9PT0gZm91bmQpIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHJldHVybiBuYW1lID8gamFyW25hbWVdIDogamFyXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICB7XG4gICAgICBzZXQsXG4gICAgICBnZXQsXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIChuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHNldChcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgICcnLFxuICAgICAgICAgIGFzc2lnbih7fSwgYXR0cmlidXRlcywge1xuICAgICAgICAgICAgZXhwaXJlczogLTFcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIHdpdGhBdHRyaWJ1dGVzOiBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgICAgICByZXR1cm4gaW5pdCh0aGlzLmNvbnZlcnRlciwgYXNzaWduKHt9LCB0aGlzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpKVxuICAgICAgfSxcbiAgICAgIHdpdGhDb252ZXJ0ZXI6IGZ1bmN0aW9uIChjb252ZXJ0ZXIpIHtcbiAgICAgICAgcmV0dXJuIGluaXQoYXNzaWduKHt9LCB0aGlzLmNvbnZlcnRlciwgY29udmVydGVyKSwgdGhpcy5hdHRyaWJ1dGVzKVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgYXR0cmlidXRlczogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShkZWZhdWx0QXR0cmlidXRlcykgfSxcbiAgICAgIGNvbnZlcnRlcjogeyB2YWx1ZTogT2JqZWN0LmZyZWV6ZShjb252ZXJ0ZXIpIH1cbiAgICB9XG4gIClcbn1cblxudmFyIGFwaSA9IGluaXQoZGVmYXVsdENvbnZlcnRlciwgeyBwYXRoOiAnLycgfSk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG5leHBvcnQgeyBhcGkgYXMgZGVmYXVsdCB9O1xuIiwiLy8gY29va2ll5pON5L2cXG5pbXBvcnQganNDb29raWUgZnJvbSAnanMtY29va2llJztcbi8vIOeUqOWIsOeahOW6k+S5n+WvvOWHuuS+v+S6juiHquihjOmAieeUqFxuZXhwb3J0IHsganNDb29raWUgfTtcblxuLy8g5ZCMIGpzLWNvb2tpZSDnmoTpgInpobnlkIjlubbmlrnlvI9cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNvdXJjZSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cbi8vIGNvb2tpZeWvueixoVxuZXhwb3J0IGNsYXNzIENvb2tpZSB7XG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhuVxuICAgKiAgICAgICAgICBjb252ZXJ0ZXIgIOWQjCBqcy1jb29raWVzIOeahCBjb252ZXJ0ZXJcbiAgICogICAgICAgICAgYXR0cmlidXRlcyDlkIwganMtY29va2llcyDnmoQgYXR0cmlidXRlc1xuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaLjgIJqcy1jb29raWUg5ZyoMy4w54mI5pysKGNvbW1pdDogNGI3OTI5MGI5OGQ3ZmJmMWFiNDkzYTdmOWUxNjE5NDE4YWMwMWU0NSkg56e76Zmk5LqG5a+5IGpzb24g55qE6Ieq5Yqo6L2s5o2i77yM6L+Z6YeM6buY6K6kIHRydWUg5Yqg5LiKXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAvLyDpgInpobnnu5PmnpxcbiAgICBjb25zdCB7IGNvbnZlcnRlciA9IHt9LCBhdHRyaWJ1dGVzID0ge30sIGpzb24gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAganNvbixcbiAgICAgIGF0dHJpYnV0ZXM6IGFzc2lnbih7fSwganNDb29raWUuYXR0cmlidXRlcywgYXR0cmlidXRlcyksXG4gICAgICBjb252ZXJ0ZXI6IGFzc2lnbih7fSwganNDb29raWUuY29udmVydGVyLCBjb252ZXJ0ZXIpLFxuICAgIH07XG4gICAgLy8g5aOw5piO5ZCE5bGe5oCn44CC55u05o6l5oiW5ZyoY29uc3RydWN0b3LkuK3ph43mlrDotYvlgLxcbiAgICAvLyDpu5jorqTpgInpobnnu5PmnpxcbiAgICB0aGlzLiRkZWZhdWx0cyA9IG9wdGlvbnNSZXN1bHQ7XG4gIH1cbiAgJGRlZmF1bHRzO1xuICAvLyDlhpnlhaVcbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcGFyYW0gYXR0cmlidXRlc1xuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2iXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc2V0KG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuICAgIGlmIChqc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ganNDb29raWUuc2V0KG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzKTtcbiAgfVxuICAvLyDor7vlj5ZcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSBvcHRpb25zIOmFjee9rumhuVxuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaJcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXQobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBsZXQgcmVzdWx0ID0ganNDb29raWUuZ2V0KG5hbWUpO1xuICAgIGlmIChqc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDnp7vpmaRcbiAgcmVtb3ZlKG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4ganNDb29raWUucmVtb3ZlKG5hbWUsIGF0dHJpYnV0ZXMpO1xuICB9XG4gIC8vIOWIm+W7uuOAgumAmui/h+mFjee9rum7mOiupOWPguaVsOWIm+W7uuaWsOWvueixoe+8jOeugOWMluS8oOWPglxuICBjcmVhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9uc1Jlc3VsdCA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBhdHRyaWJ1dGVzOiBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlcyksXG4gICAgICBjb252ZXJ0ZXI6IGFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMuYXR0cmlidXRlcywgb3B0aW9ucy5jb252ZXJ0ZXIpLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBDb29raWUob3B0aW9uc1Jlc3VsdCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBjb29raWUgPSBuZXcgQ29va2llKCk7XG4iLCJmdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gZmlsZSBzaXplIGhhY2tzXG4gICAgICAgIHJlcXVlc3Qub25jb21wbGV0ZSA9IHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgLSBmaWxlIHNpemUgaGFja3NcbiAgICAgICAgcmVxdWVzdC5vbmFib3J0ID0gcmVxdWVzdC5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlU3RvcmUoZGJOYW1lLCBzdG9yZU5hbWUpIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oZGJOYW1lKTtcbiAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHJlcXVlc3QucmVzdWx0LmNyZWF0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgY29uc3QgZGJwID0gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KTtcbiAgICByZXR1cm4gKHR4TW9kZSwgY2FsbGJhY2spID0+IGRicC50aGVuKChkYikgPT4gY2FsbGJhY2soZGIudHJhbnNhY3Rpb24oc3RvcmVOYW1lLCB0eE1vZGUpLm9iamVjdFN0b3JlKHN0b3JlTmFtZSkpKTtcbn1cbmxldCBkZWZhdWx0R2V0U3RvcmVGdW5jO1xuZnVuY3Rpb24gZGVmYXVsdEdldFN0b3JlKCkge1xuICAgIGlmICghZGVmYXVsdEdldFN0b3JlRnVuYykge1xuICAgICAgICBkZWZhdWx0R2V0U3RvcmVGdW5jID0gY3JlYXRlU3RvcmUoJ2tleXZhbC1zdG9yZScsICdrZXl2YWwnKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRHZXRTdG9yZUZ1bmM7XG59XG4vKipcbiAqIEdldCBhIHZhbHVlIGJ5IGl0cyBrZXkuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGdldChrZXksIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldChrZXkpKSk7XG59XG4vKipcbiAqIFNldCBhIHZhbHVlIHdpdGggYSBrZXkuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIHZhbHVlXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBzdG9yZS5wdXQodmFsdWUsIGtleSk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbi8qKlxuICogU2V0IG11bHRpcGxlIHZhbHVlcyBhdCBvbmNlLiBUaGlzIGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgc2V0KCkgbXVsdGlwbGUgdGltZXMuXG4gKiBJdCdzIGFsc28gYXRvbWljIOKAkyBpZiBvbmUgb2YgdGhlIHBhaXJzIGNhbid0IGJlIGFkZGVkLCBub25lIHdpbGwgYmUgYWRkZWQuXG4gKlxuICogQHBhcmFtIGVudHJpZXMgQXJyYXkgb2YgZW50cmllcywgd2hlcmUgZWFjaCBlbnRyeSBpcyBhbiBhcnJheSBvZiBgW2tleSwgdmFsdWVdYC5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBzZXRNYW55KGVudHJpZXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiBzdG9yZS5wdXQoZW50cnlbMV0sIGVudHJ5WzBdKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IG11bHRpcGxlIHZhbHVlcyBieSB0aGVpciBrZXlzXG4gKlxuICogQHBhcmFtIGtleXNcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBnZXRNYW55KGtleXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBQcm9taXNlLmFsbChrZXlzLm1hcCgoa2V5KSA9PiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldChrZXkpKSkpKTtcbn1cbi8qKlxuICogVXBkYXRlIGEgdmFsdWUuIFRoaXMgbGV0cyB5b3Ugc2VlIHRoZSBvbGQgdmFsdWUgYW5kIHVwZGF0ZSBpdCBhcyBhbiBhdG9taWMgb3BlcmF0aW9uLlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSB1cGRhdGVyIEEgY2FsbGJhY2sgdGhhdCB0YWtlcyB0aGUgb2xkIHZhbHVlIGFuZCByZXR1cm5zIGEgbmV3IHZhbHVlLlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZShrZXksIHVwZGF0ZXIsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4gXG4gICAgLy8gTmVlZCB0byBjcmVhdGUgdGhlIHByb21pc2UgbWFudWFsbHkuXG4gICAgLy8gSWYgSSB0cnkgdG8gY2hhaW4gcHJvbWlzZXMsIHRoZSB0cmFuc2FjdGlvbiBjbG9zZXMgaW4gYnJvd3NlcnNcbiAgICAvLyB0aGF0IHVzZSBhIHByb21pc2UgcG9seWZpbGwgKElFMTAvMTEpLlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgc3RvcmUuZ2V0KGtleSkub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzdG9yZS5wdXQodXBkYXRlcih0aGlzLnJlc3VsdCksIGtleSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSkpO1xufVxuLyoqXG4gKiBEZWxldGUgYSBwYXJ0aWN1bGFyIGtleSBmcm9tIHRoZSBzdG9yZS5cbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZGVsKGtleSwgY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZHdyaXRlJywgKHN0b3JlKSA9PiB7XG4gICAgICAgIHN0b3JlLmRlbGV0ZShrZXkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIERlbGV0ZSBtdWx0aXBsZSBrZXlzIGF0IG9uY2UuXG4gKlxuICogQHBhcmFtIGtleXMgTGlzdCBvZiBrZXlzIHRvIGRlbGV0ZS5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBkZWxNYW55KGtleXMsIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBrZXlzLmZvckVhY2goKGtleSkgPT4gc3RvcmUuZGVsZXRlKGtleSkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIENsZWFyIGFsbCB2YWx1ZXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBjbGVhcihjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgc3RvcmUuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZWFjaEN1cnNvcihzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBzdG9yZS5vcGVuQ3Vyc29yKCkub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVzdWx0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjYWxsYmFjayh0aGlzLnJlc3VsdCk7XG4gICAgICAgIHRoaXMucmVzdWx0LmNvbnRpbnVlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG59XG4vKipcbiAqIEdldCBhbGwga2V5cyBpbiB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGtleXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbEtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldEFsbEtleXMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGVhY2hDdXJzb3Ioc3RvcmUsIChjdXJzb3IpID0+IGl0ZW1zLnB1c2goY3Vyc29yLmtleSkpLnRoZW4oKCkgPT4gaXRlbXMpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBHZXQgYWxsIHZhbHVlcyBpbiB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHZhbHVlcyhjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4ge1xuICAgICAgICAvLyBGYXN0IHBhdGggZm9yIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpZiAoc3RvcmUuZ2V0QWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGwoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGVhY2hDdXJzb3Ioc3RvcmUsIChjdXJzb3IpID0+IGl0ZW1zLnB1c2goY3Vyc29yLnZhbHVlKSkudGhlbigoKSA9PiBpdGVtcyk7XG4gICAgfSk7XG59XG4vKipcbiAqIEdldCBhbGwgZW50cmllcyBpbiB0aGUgc3RvcmUuIEVhY2ggZW50cnkgaXMgYW4gYXJyYXkgb2YgYFtrZXksIHZhbHVlXWAuXG4gKlxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGVudHJpZXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgLy8gKGFsdGhvdWdoLCBob3BlZnVsbHkgd2UnbGwgZ2V0IGEgc2ltcGxlciBwYXRoIHNvbWUgZGF5KVxuICAgICAgICBpZiAoc3RvcmUuZ2V0QWxsICYmIHN0b3JlLmdldEFsbEtleXMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGxLZXlzKCkpLFxuICAgICAgICAgICAgICAgIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsKCkpLFxuICAgICAgICAgICAgXSkudGhlbigoW2tleXMsIHZhbHVlc10pID0+IGtleXMubWFwKChrZXksIGkpID0+IFtrZXksIHZhbHVlc1tpXV0pKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgICAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKFtjdXJzb3Iua2V5LCBjdXJzb3IudmFsdWVdKSkudGhlbigoKSA9PiBpdGVtcykpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgeyBjbGVhciwgY3JlYXRlU3RvcmUsIGRlbCwgZGVsTWFueSwgZW50cmllcywgZ2V0LCBnZXRNYW55LCBrZXlzLCBwcm9taXNpZnlSZXF1ZXN0LCBzZXQsIHNldE1hbnksIHVwZGF0ZSwgdmFsdWVzIH07XG4iLCJleHBvcnQgY2xhc3MgX1N0b3JhZ2Uge1xuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAgc3RvcmFnZSDlr7nlupTnmoRzdG9yYWdl5a+56LGh44CCbG9jYWxTdG9yYWdlIOaIliBzZXNzaW9uU3RvcmFnZVxuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaLjgIJcbiAgICogQHJldHVybnMge3ZvaWR8Kn1cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgZnJvbSwganNvbiA9IHRydWUgfSA9IG9wdGlvbnM7XG4gICAgY29uc3Qgb3B0aW9uc1Jlc3VsdCA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBmcm9tLFxuICAgICAganNvbixcbiAgICB9O1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xuICAgICAgLy8g6buY6K6k6YCJ6aG557uT5p6cXG4gICAgICAkZGVmYXVsdHM6IG9wdGlvbnNSZXN1bHQsXG4gICAgICAvLyDlr7nlupTnmoRzdG9yYWdl5a+56LGh44CCXG4gICAgICBzdG9yYWdlOiBmcm9tLFxuICAgICAgLy8g5Y6f5pyJ5pa55rOV44CC55Sx5LqOIE9iamVjdC5jcmVhdGUoZnJvbSkg5pa55byP57un5om/5pe26LCD55So5Lya5oqlIFVuY2F1Z2h0IFR5cGVFcnJvcjogSWxsZWdhbCBpbnZvY2F0aW9u77yM5pS55oiQ5Y2V54us5Yqg5YWl5pa55byPXG4gICAgICBzZXRJdGVtOiBmcm9tLnNldEl0ZW0uYmluZChmcm9tKSxcbiAgICAgIGdldEl0ZW06IGZyb20uZ2V0SXRlbS5iaW5kKGZyb20pLFxuICAgICAgcmVtb3ZlSXRlbTogZnJvbS5yZW1vdmVJdGVtLmJpbmQoZnJvbSksXG4gICAgICBrZXk6IGZyb20ua2V5LmJpbmQoZnJvbSksXG4gICAgICBjbGVhcjogZnJvbS5jbGVhci5iaW5kKGZyb20pLFxuICAgIH0pO1xuICB9XG4gIC8vIOWjsOaYjuWQhOWxnuaAp+OAguebtOaOpeaIluWcqGNvbnN0cnVjdG9y5Lit6YeN5paw6LWL5YC8XG4gICRkZWZhdWx0cztcbiAgc3RvcmFnZTtcbiAgc2V0SXRlbTtcbiAgZ2V0SXRlbTtcbiAgcmVtb3ZlSXRlbTtcbiAga2V5O1xuICBjbGVhcjtcbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLmxlbmd0aDtcbiAgfVxuICAvLyDliKTmlq3lsZ7mgKfmmK/lkKblrZjlnKjjgILlkIzml7bnlKjkuo7lnKggZ2V0IOS4reWvueS4jeWtmOWcqOeahOWxnuaAp+i/lOWbniB1bmRlZmluZWRcbiAgaGFzKGtleSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0b3JhZ2UpLmluY2x1ZGVzKGtleSk7XG4gIH1cbiAgLy8g5YaZ5YWlXG4gIHNldChrZXksIHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIGlmIChqc29uKSB7XG4gICAgICAvLyDlpITnkIblrZggdW5kZWZpbmVkIOeahOaDheWGte+8jOazqOaEj+WvueixoeS4reeahOaYvuW8jyB1bmRlZmluZWQg55qE5bGe5oCn5Lya6KKrIGpzb24g5bqP5YiX5YyW56e76ZmkXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gIH1cbiAgLy8g6K+75Y+WXG4gIGdldChrZXksIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGpzb24gPSAnanNvbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuanNvbiA6IHRoaXMuJGRlZmF1bHRzLmpzb247XG4gICAgLy8g5aSE55CG5peg5bGe5oCn55qE55qE5oOF5Ya16L+U5ZueIHVuZGVmaW5lZFxuICAgIGlmIChqc29uICYmICF0aGlzLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyDlhbbku5blgLzliKTmlq3ov5Tlm55cbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g56e76ZmkXG4gIHJlbW92ZShrZXkpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgfVxuICAvLyDliJvlu7rjgILpgJrov4fphY3nva7pu5jorqTlj4LmlbDliJvlu7rmlrDlr7nosaHvvIznroDljJbkvKDlj4JcbiAgY3JlYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG5ldyBfU3RvcmFnZShvcHRpb25zUmVzdWx0KTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IF9sb2NhbFN0b3JhZ2UgPSBuZXcgX1N0b3JhZ2UoeyBmcm9tOiBsb2NhbFN0b3JhZ2UgfSk7XG5leHBvcnQgY29uc3QgX3Nlc3Npb25TdG9yYWdlID0gbmV3IF9TdG9yYWdlKHsgZnJvbTogc2Vzc2lvblN0b3JhZ2UgfSk7XG4iXSwibmFtZXMiOlsiYmFzZUNvbmZpZyIsImFzc2lnbiIsImpzQ29va2llIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQTtFQUNBO0VBQ08sTUFBTSxRQUFRLENBQUM7RUFDdEI7RUFDQSxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsV0FBVztFQUM5QixJQUFJLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7RUFDaEUsTUFBTSxPQUFPLFNBQVMsQ0FBQztFQUN2QixLQUFLO0VBQ0wsSUFBSSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxVQUFVLEtBQUss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
