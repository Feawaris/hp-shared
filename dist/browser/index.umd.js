/*!
 * hp-shared v0.2.0
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

  const _String = {
    /**
     * 首字母大写
     * @param name {string}
     * @returns {string}
     */
    toFirstUpperCase(name = '') {
      return `${(name[0] ?? '').toUpperCase()}${name.slice(1)}`;
    },
    /**
     * 首字母小写
     * @param name {string} 名称
     * @returns {string}
     */
    toFirstLowerCase(name = '') {
      return `${(name[0] ?? '').toLowerCase()}${name.slice(1)}`;
    },
    /**
     * 转驼峰命名。常用于连接符命名转驼峰命名，如 xx-name -> xxName
     * @param name {string} 名称
     * @param separator {string} 连接符。用于生成正则 默认为中划线 - 对应regexp得到 /-(\w)/g
     * @param first {string,boolean} 首字母处理方式。true 或 'uppercase'：转换成大写;
     *                                            false 或 'lowercase'：转换成小写;
     *                                            'raw' 或 其他无效值：默认原样返回，不进行处理;
     * @returns {MagicString|string|string}
     */
    toCamelCase(name, { separator = '-', first = 'raw' } = {}) {
      // 生成正则
      const regexp = new RegExp(`${separator}(\\w)`, 'g');
      // 拼接成驼峰
      const camelName = name.replaceAll(regexp, (substr, $1) => {
        return $1.toUpperCase();
      });
      // 首字母大小写根据传参判断
      if ([true, 'uppercase'].includes(first)) {
        return _String.toFirstUpperCase(camelName);
      }
      if ([false, 'lowercase'].includes(first)) {
        return _String.toFirstLowerCase(camelName);
      }
      return camelName;
    },
    /**
     * 转连接符命名。常用于驼峰命名转连接符命名，如 xxName -> xx-name
     * @param name {string} 名称
     * @param separator {string} 连接符
     * @returns {string}
     */
    toLineCase(name = '', { separator = '-' } = {}) {
      return name
        // 按连接符拼接
        .replaceAll(/([a-z])([A-Z])/g, `$1${separator}$2`)
        // 转小写
        .toLowerCase();
    },
  };

  // 常量。常用于默认传参等场景
  // js运行环境
  const JS_ENV = (function getJsEnv() {
    if (typeof window !== 'undefined' && globalThis === window) {
      return 'browser';
    }
    if (typeof global !== 'undefined' && globalThis === global) {
      return 'node';
    }
    return '';
  })();
  // 空函数
  function NOOP() {}
  // 返回 false
  function FALSE() {
    return false;
  }
  // 返回 true
  function TRUE() {
    return true;
  }
  // 原样返回
  function RAW(value) {
    return value;
  }
  // catch 内的错误原样抛出去
  function THROW(e) {
    throw e;
  }

  // 处理多格式数据用
  const Data = {
    // 简单类型
    SIMPLE_TYPES: [null, undefined, Number, String, Boolean, BigInt, Symbol],
    /**
     * 获取值的具体类型
     * @param value {*} 值
     * @returns {ObjectConstructor|*|Function} 返回对应构造函数。null、undefined 原样返回
     */
    getExactType(value) {
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
    },
    /**
     * 获取值的具体类型列表
     * @param value {*} 值
     * @returns {*[]} 统一返回数组。null、undefined 对应为 [null],[undefined]
     */
    getExactTypes(value) {
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
    },
    /**
     * 深拷贝数据
     * @param source {*}
     * @returns {Map<any, any>|Set<any>|{}|*|*[]}
     */
    deepClone(source) {
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
      if (Data.getExactType(source) === Object) {
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
    },
    /**
     * 深解包数据
     * @param data {*} 值
     * @param isWrap {function} 包装数据判断函数，如vue3的isRef函数
     * @param unwrap {function} 解包方式函数，如vue3的unref函数
     * @returns {(*|{[p: string]: any})[]|*|{[p: string]: any}|{[p: string]: *|{[p: string]: any}}}
     */
    deepUnwrap(data, { isWrap = FALSE, unwrap = RAW } = {}) {
      // 选项收集
      const options = { isWrap, unwrap };
      // 包装类型（如vue3响应式对象）数据解包
      if (isWrap(data)) {
        return Data.deepUnwrap(unwrap(data), options);
      }
      // 递归处理的类型
      if (data instanceof Array) {
        return data.map(val => Data.deepUnwrap(val, options));
      }
      if (Data.getExactType(data) === Object) {
        return Object.fromEntries(Object.entries(data).map(([key, val]) => {
          return [key, Data.deepUnwrap(val, options)];
        }));
      }
      // 其他原样返回
      return data;
    },
  };
  // 处理vue数据用
  const VueData = {
    /**
     * 深解包vue3响应式对象数据
     * @param data {*}
     * @returns {(*|{[p: string]: *})[]|*|{[p: string]: *}|{[p: string]: *|{[p: string]: *}}}
     */
    deepUnwrapVue3(data) {
      return Data.deepUnwrap(data, {
        isWrap: data => data?.__v_isRef,
        unwrap: data => data.value,
      });
    },
    /**
     * 从 attrs 中提取 props 定义的属性
     * @param attrs vue attrs
     * @param propDefinitions props 定义，如 ElButton.props 等
     * @returns {{}}
     */
    getPropsFromAttrs(attrs, propDefinitions) {
      // props 定义统一成对象格式，type 统一成数组格式以便后续判断
      if (propDefinitions instanceof Array) {
        propDefinitions = Object.fromEntries(propDefinitions.map(name => [_String.toCamelCase(name), { type: [] }]));
      } else if (Data.getExactType(propDefinitions) === Object) {
        propDefinitions = Object.fromEntries(Object.entries(propDefinitions).map(([name, definition]) => {
          definition = Data.getExactType(definition) === Object
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
          if (end) { return; }
          setResult({ name: _String.toLineCase(name), definition, end: true });
        })({
          name, definition,
        });
      }
      return result;
    },
    /**
     * 从 attrs 中提取 emits 定义的属性
     * @param attrs vue attrs
     * @param emitDefinitions emits 定义，如 ElButton.emits 等
     * @returns {{}}
     */
    getEmitsFromAttrs(attrs, emitDefinitions) {
      // emits 定义统一成数组格式
      if (Data.getExactType(emitDefinitions) === Object) {
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
            if (end) { return; }
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
    },
    /**
     * 从 attrs 中提取剩余属性。常用于组件inheritAttrs设置false时使用作为新的attrs
     * @param attrs vue attrs
     * @param {} 配置项
     *          @param props props 定义 或 vue props，如 ElButton.props 等
     *          @param emits emits 定义 或 vue emits，如 ElButton.emits 等
     *          @param list 额外的普通属性
     * @returns {{}}
     */
    getRestFromAttrs(attrs, { props, emits, list = [] } = {}) {
      // 统一成数组格式
      props = (() => {
        const arr = (() => {
          if (props instanceof Array) {
            return props;
          }
          if (Data.getExactType(props) === Object) {
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
          if (Data.getExactType(emits) === Object) {
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
        const arr = Data.getExactType(list) === String
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
    },
  };

  const _Date = {
    /**
     * 创建Date对象
     * @param args {*[]} 多个值
     * @returns {Date}
     */
    create(...args) {
      if (arguments.length === 1) {
        // safari 浏览器字符串格式兼容
        const value = arguments[0];
        const valueResult = Data.getExactType(value) === String ? value.replaceAll('-', '/') : value;
        return new Date(valueResult);
      } else {
        // 传参行为先和Date一致，后续再收集需求加强定制(注意无参和显式undefined的区别)
        return arguments.length === 0 ? new Date() : new Date(...arguments);
      }
    },
  };

  const _Math = {
  // 增加部分命名以接近数学表达方式
    arcsin: Math.asin,
    arccos: Math.acos,
    arctan: Math.atan,
    arsinh: Math.asinh,
    arcosh: Math.acosh,
    artanh: Math.atanh,
    loge: Math.log,
    ln: Math.log,
    lg: Math.log10,
    log(a, x) {
      return Math.log(x) / Math.log(a);
    },
  };

  const _Reflect = {
    // 对 ownKeys 配套 ownValues 和 ownEntries
    ownValues(target) {
      return Reflect.ownKeys(target).map(key => target[key]);
    },
    ownEntries(target) {
      return Reflect.ownKeys(target).map(key => [key, target[key]]);
    },
  };

  const _Set = {
    /**
     * 加强add方法。跟数组push方法一样可添加多个值
     * @param set {Set} 目标set
     * @param args {*[]} 多个值
     */
    add(set, ...args) {
      for (const arg of args) {
        set.add(arg);
      }
    },
  };

  /**
   * 属性名统一成数组格式
   * @param names {string|Symbol|array} 属性名。格式 'a,b,c' 或 ['a','b','c']
   * @param separator {string|RegExp} names 为字符串时的拆分规则。同 split 方法的 separator，字符串无需拆分的可以传 null 或 undefined
   * @returns {*[][]|(MagicString | Bundle | string)[]|FlatArray<(FlatArray<(*|[*[]]|[])[], 1>[]|*|[*[]]|[])[], 1>[]|*[]}
   */
  function namesToArray(names = [], { separator = ',' } = {}) {
    if (names instanceof Array) {
      return names.map(val => namesToArray(val)).flat();
    }
    const exactType = Data.getExactType(names);
    if (exactType === String) {
      return names.split(separator).map(val => val.trim()).filter(val => val);
    }
    if (exactType === Symbol) {
      return [names];
    }
    return [];
  }
  // console.log(namesToArray(Symbol()));
  // console.log(namesToArray(['a', 'b', 'c', Symbol()]));
  // console.log(namesToArray('a,b,c'));
  // console.log(namesToArray(['a,b,c', Symbol()]));
  const _Object = {
    /**
     * 浅合并对象。写法同 Object.assign
     * 通过重定义方式合并，解决 Object.assign 合并两边同名属性混有 value写法 和 get/set写法 时报 TypeError: Cannot set property b of #<Object> which has only a getter 的问题
     * @param target {object} 目标对象
     * @param sources {any[]} 数据源。一个或多个对象
     * @returns {*}
     */
    assign(target = {}, ...sources) {
      for (const source of sources) {
        // 不使用 target[key]=value 写法，直接使用desc重定义
        for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
          Object.defineProperty(target, key, desc);
        }
      }
      return target;
    },
    /**
     * 深合并对象。同 assign 一样也会对属性进行重定义
     * @param target {object} 目标对象。默认值 {} 防止递归时报 TypeError: Object.defineProperty called on non-object
     * @param sources {any[]} 数据源。一个或多个对象
     */
    deepAssign(target = {}, ...sources) {
      for (const source of sources) {
        for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
          if ('value' in desc) {
            // value写法：对象递归处理，其他直接定义
            if (Data.getExactType(desc.value) === Object) {
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
    },
    /**
     * key自身所属的对象
     * @param object {object} 对象
     * @param key {string|Symbol} 属性名
     * @returns {*|null}
     */
    owner(object, key) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        return object;
      }
      let __proto__ = Object.getPrototypeOf(object);
      if (__proto__ === null) {
        return null;
      }
      return this.owner(__proto__, key);
    },
    /**
     * 获取属性描述对象，相比 Object.getOwnPropertyDescriptor，能拿到继承属性的描述对象
     * @param object {object}
     * @param key {string|Symbol}
     * @returns {PropertyDescriptor}
     */
    descriptor(object, key) {
      const findObject = this.owner(object, key);
      if (!findObject) {
        return undefined;
      }
      return Object.getOwnPropertyDescriptor(findObject, key);
    },
    /**
     * 获取属性名。默认参数配置成同 Object.keys 行为
     * @param object {object} 对象
     * @param symbol {boolean} 是否包含 symbol 属性
     * @param notEnumerable {boolean} 是否包含不可列举属性
     * @param extend {boolean} 是否包含承继属性
     * @returns {any[]}
     */
    keys(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
      // 选项收集
      const options = { symbol, notEnumerable, extend };
      // set用于key去重
      let set = new Set();
      // 自身属性筛选
      const descs = Object.getOwnPropertyDescriptors(object);
      for (const [key, desc] of _Reflect.ownEntries(descs)) {
        // 忽略symbol属性的情况
        if (!symbol && Data.getExactType(key) === Symbol) {
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
          _Set.add(set, ...parentKeys);
        }
      }
      // 返回数组
      return Array.from(set);
    },
    /**
     * 对应 keys 获取 descriptors，传参同 keys 方法。可用于重定义属性
     * @param object {object} 对象
     * @param symbol {boolean} 是否包含 symbol 属性
     * @param notEnumerable {boolean} 是否包含不可列举属性
     * @param extend {boolean} 是否包含承继属性
     * @returns {PropertyDescriptor[]}
     */
    descriptors(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
      // 选项收集
      const options = { symbol, notEnumerable, extend };
      const keys = this.keys(object, options);
      return keys.map(key => this.descriptor(object, key));
    },
    /**
     * 对应 keys 获取 descriptorEntries，传参同 keys 方法。可用于重定义属性
     * @param object {object} 对象
     * @param symbol {boolean} 是否包含 symbol 属性
     * @param notEnumerable {boolean} 是否包含不可列举属性
     * @param extend {boolean} 是否包含承继属性
     * @returns {[string|Symbol,PropertyDescriptor][]}
     */
    descriptorEntries(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
      // 选项收集
      const options = { symbol, notEnumerable, extend };
      const keys = this.keys(object, options);
      return keys.map(key => [key, this.descriptor(object, key)]);
    },
    /**
     * 选取对象
     * @param object {object} 对象
     * @param pick {string|array} 挑选属性
     * @param omit {string|array} 忽略属性
     * @param emptyPick {string} pick 为空时的取值。all 全部key，empty 空
     * @param separator {string|RegExp} 同 namesToArray 的 separator 参数
     * @param symbol {boolean} 同 keys 的 symbol 参数
     * @param notEnumerable {boolean} 同 keys 的 notEnumerable 参数
     * @param extend {boolean} 同 keys 的 extend 参数
     * @returns {{}}
     */
    filter(object, { pick = [], omit = [], emptyPick = 'all', separator = ',', symbol = true, notEnumerable = false, extend = true } = {}) {
      let result = {};
      // pick、omit 统一成数组格式
      pick = namesToArray(pick, { separator });
      omit = namesToArray(omit, { separator });
      let keys = [];
      // pick有值直接拿，为空时根据 emptyPick 默认拿空或全部key
      keys = pick.length > 0 || emptyPick === 'empty' ? pick : this.keys(object, { symbol, notEnumerable, extend });
      // omit筛选
      keys = keys.filter(key => !omit.includes(key));
      for (const key of keys) {
        const desc = this.descriptor(object, key);
        // 属性不存在导致desc得到undefined时不设置值
        if (desc) {
          Object.defineProperty(result, key, desc);
        }
      }
      return result;
    },
    /**
     * 通过挑选方式选取对象。filter的简写方式
     * @param object {object} 对象
     * @param keys {string|array} 属性名集合
     * @param options {object} 选项，同 filter 的各选项值
     * @returns {{}}
     */
    pick(object, keys = [], options = {}) {
      return this.filter(object, { pick: keys, emptyPick: 'empty', ...options });
    },
    /**
     * 通过排除方式选取对象。filter的简写方式
     * @param object {object} 对象
     * @param keys {string|array} 属性名集合
     * @param options {object} 选项，同 filter 的各选项值
     * @returns {{}}
     */
    omit(object, keys = [], options = {}) {
      return this.filter(object, { omit: keys, ...options });
    },
  };

  const _Proxy = {
    /**
     * 绑定this。常用于解构函数时绑定this避免报错
     * @param target {object} 目标对象
     * @param options {object} 选项。扩展用
     * @returns {*}
     */
    bindThis(target, options = {}) {
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
    },
  };

  // 处理样式用
  const Style = {
    /**
     * 带单位字符串。对数字或数字格式的字符串自动拼单位，其他字符串原样返回
     * @param value {number|string} 值
     * @param unit 单位。value没带单位时自动拼接，可传 px/em/% 等
     * @returns {string|string}
     */
    getUnitString(value = '', { unit = 'px' } = {}) {
      if (value === '') { return ''; }
      // 注意：这里使用 == 判断，不使用 ===
      return Number(value) == value ? `${value}${unit}` : String(value);
    },
  };

  var index$4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Data: Data,
    FALSE: FALSE,
    JS_ENV: JS_ENV,
    NOOP: NOOP,
    RAW: RAW,
    Style: Style,
    THROW: THROW,
    TRUE: TRUE,
    VueData: VueData,
    _Date: _Date,
    _Math: _Math,
    _Object: _Object,
    _Proxy: _Proxy,
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
    //
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

  /*! js-cookie v3.0.1 | MIT */
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
    function set (key, value, attributes) {
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

      key = encodeURIComponent(key)
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
        key + '=' + converter.write(value, key) + stringifiedAttributes)
    }

    function get (key) {
      if (typeof document === 'undefined' || (arguments.length && !key)) {
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
          var foundKey = decodeURIComponent(parts[0]);
          jar[foundKey] = converter.read(value, foundKey);

          if (key === foundKey) {
            break
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar
    }

    return Object.create(
      {
        set: set,
        get: get,
        remove: function (key, attributes) {
          set(
            key,
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
          console.warn(e);
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
          console.warn(e);
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
  const cookie = new Cookie({
    json: true,
  });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudW1kLmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9fU3RyaW5nLmpzIiwiLi4vLi4vc3JjL2Jhc2UvY29uc3RhbnRzLmpzIiwiLi4vLi4vc3JjL2Jhc2UvRGF0YS5qcyIsIi4uLy4uL3NyYy9iYXNlL19EYXRlLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX01hdGguanMiLCIuLi8uLi9zcmMvYmFzZS9fUmVmbGVjdC5qcyIsIi4uLy4uL3NyYy9iYXNlL19TZXQuanMiLCIuLi8uLi9zcmMvYmFzZS9fT2JqZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1Byb3h5LmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3R5bGUuanMiLCIuLi8uLi9zcmMvZGV2L2VzbGludC5qcyIsIi4uLy4uL3NyYy9kZXYvdml0ZS5qcyIsIi4uLy4uL3NyYy9uZXR3b3JrL2NvbW1vbi5qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvY2xpcGJvYXJkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2pzLWNvb2tpZUAzLjAuMS9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLm1qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvY29va2llLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2lkYi1rZXl2YWxANi4yLjAvbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pbmRleC5qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvc3RvcmFnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgX1N0cmluZyA9IHtcbiAgLyoqXG4gICAqIOmmluWtl+avjeWkp+WGmVxuICAgKiBAcGFyYW0gbmFtZSB7c3RyaW5nfVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgdG9GaXJzdFVwcGVyQ2FzZShuYW1lID0gJycpIHtcbiAgICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvVXBwZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG4gIH0sXG4gIC8qKlxuICAgKiDpppblrZfmr43lsI/lhplcbiAgICogQHBhcmFtIG5hbWUge3N0cmluZ30g5ZCN56ewXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICB0b0ZpcnN0TG93ZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9Mb3dlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfSxcbiAgLyoqXG4gICAqIOi9rOmpvOWzsOWRveWQjeOAguW4uOeUqOS6jui/nuaOpeespuWRveWQjei9rOmpvOWzsOWRveWQje+8jOWmgiB4eC1uYW1lIC0+IHh4TmFtZVxuICAgKiBAcGFyYW0gbmFtZSB7c3RyaW5nfSDlkI3np7BcbiAgICogQHBhcmFtIHNlcGFyYXRvciB7c3RyaW5nfSDov57mjqXnrKbjgILnlKjkuo7nlJ/miJDmraPliJkg6buY6K6k5Li65Lit5YiS57q/IC0g5a+55bqUcmVnZXhw5b6X5YiwIC8tKFxcdykvZ1xuICAgKiBAcGFyYW0gZmlyc3Qge3N0cmluZyxib29sZWFufSDpppblrZfmr43lpITnkIbmlrnlvI/jgIJ0cnVlIOaIliAndXBwZXJjYXNlJ++8mui9rOaNouaIkOWkp+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlIOaIliAnbG93ZXJjYXNlJ++8mui9rOaNouaIkOWwj+WGmTtcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyYXcnIOaIliDlhbbku5bml6DmlYjlgLzvvJrpu5jorqTljp/moLfov5Tlm57vvIzkuI3ov5vooYzlpITnkIY7XG4gICAqIEByZXR1cm5zIHtNYWdpY1N0cmluZ3xzdHJpbmd8c3RyaW5nfVxuICAgKi9cbiAgdG9DYW1lbENhc2UobmFtZSwgeyBzZXBhcmF0b3IgPSAnLScsIGZpcnN0ID0gJ3JhdycgfSA9IHt9KSB7XG4gICAgLy8g55Sf5oiQ5q2j5YiZXG4gICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cChgJHtzZXBhcmF0b3J9KFxcXFx3KWAsICdnJyk7XG4gICAgLy8g5ou85o6l5oiQ6am85bOwXG4gICAgY29uc3QgY2FtZWxOYW1lID0gbmFtZS5yZXBsYWNlQWxsKHJlZ2V4cCwgKHN1YnN0ciwgJDEpID0+IHtcbiAgICAgIHJldHVybiAkMS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICAgIC8vIOmmluWtl+avjeWkp+Wwj+WGmeagueaNruS8oOWPguWIpOaWrVxuICAgIGlmIChbdHJ1ZSwgJ3VwcGVyY2FzZSddLmluY2x1ZGVzKGZpcnN0KSkge1xuICAgICAgcmV0dXJuIF9TdHJpbmcudG9GaXJzdFVwcGVyQ2FzZShjYW1lbE5hbWUpO1xuICAgIH1cbiAgICBpZiAoW2ZhbHNlLCAnbG93ZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gX1N0cmluZy50b0ZpcnN0TG93ZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBjYW1lbE5hbWU7XG4gIH0sXG4gIC8qKlxuICAgKiDovazov57mjqXnrKblkb3lkI3jgILluLjnlKjkuo7pqbzls7Dlkb3lkI3ovazov57mjqXnrKblkb3lkI3vvIzlpoIgeHhOYW1lIC0+IHh4LW5hbWVcbiAgICogQHBhcmFtIG5hbWUge3N0cmluZ30g5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ige3N0cmluZ30g6L+e5o6l56ymXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICB0b0xpbmVDYXNlKG5hbWUgPSAnJywgeyBzZXBhcmF0b3IgPSAnLScgfSA9IHt9KSB7XG4gICAgcmV0dXJuIG5hbWVcbiAgICAgIC8vIOaMiei/nuaOpeespuaLvOaOpVxuICAgICAgLnJlcGxhY2VBbGwoLyhbYS16XSkoW0EtWl0pL2csIGAkMSR7c2VwYXJhdG9yfSQyYClcbiAgICAgIC8vIOi9rOWwj+WGmVxuICAgICAgLnRvTG93ZXJDYXNlKCk7XG4gIH0sXG59O1xuIiwiLy8g5bi46YeP44CC5bi455So5LqO6buY6K6k5Lyg5Y+C562J5Zy65pmvXG4vLyBqc+i/kOihjOeOr+Wig1xuZXhwb3J0IGNvbnN0IEpTX0VOViA9IChmdW5jdGlvbiBnZXRKc0VudigpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbFRoaXMgPT09IHdpbmRvdykge1xuICAgIHJldHVybiAnYnJvd3Nlcic7XG4gIH1cbiAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbFRoaXMgPT09IGdsb2JhbCkge1xuICAgIHJldHVybiAnbm9kZSc7XG4gIH1cbiAgcmV0dXJuICcnO1xufSkoKTtcbi8vIOepuuWHveaVsFxuZXhwb3J0IGZ1bmN0aW9uIE5PT1AoKSB7fVxuLy8g6L+U5ZueIGZhbHNlXG5leHBvcnQgZnVuY3Rpb24gRkFMU0UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cbi8vIOi/lOWbniB0cnVlXG5leHBvcnQgZnVuY3Rpb24gVFJVRSgpIHtcbiAgcmV0dXJuIHRydWU7XG59XG4vLyDljp/moLfov5Tlm55cbmV4cG9ydCBmdW5jdGlvbiBSQVcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuLy8gY2F0Y2gg5YaF55qE6ZSZ6K+v5Y6f5qC35oqb5Ye65Y67XG5leHBvcnQgZnVuY3Rpb24gVEhST1coZSkge1xuICB0aHJvdyBlO1xufVxuIiwiaW1wb3J0IHsgX1N0cmluZyB9IGZyb20gJy4vX1N0cmluZyc7XG5pbXBvcnQgeyBGQUxTRSwgUkFXIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuLy8g5aSE55CG5aSa5qC85byP5pWw5o2u55SoXG5leHBvcnQgY29uc3QgRGF0YSA9IHtcbiAgLy8g566A5Y2V57G75Z6LXG4gIFNJTVBMRV9UWVBFUzogW251bGwsIHVuZGVmaW5lZCwgTnVtYmVyLCBTdHJpbmcsIEJvb2xlYW4sIEJpZ0ludCwgU3ltYm9sXSxcbiAgLyoqXG4gICAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei1xuICAgKiBAcGFyYW0gdmFsdWUgeyp9IOWAvFxuICAgKiBAcmV0dXJucyB7T2JqZWN0Q29uc3RydWN0b3J8KnxGdW5jdGlvbn0g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWw44CCbnVsbOOAgXVuZGVmaW5lZCDljp/moLfov5Tlm55cbiAgICovXG4gIGdldEV4YWN0VHlwZSh2YWx1ZSkge1xuICAgIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gICAgaWYgKFtudWxsLCB1bmRlZmluZWRdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICAgIC8vIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoeaXtiBfX3Byb3RvX18g5Li6IG51bGxcbiAgICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgICBpZiAoaXNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgICAgcmV0dXJuIE9iamVjdDtcbiAgICB9XG4gICAgLy8g5a+55bqU57un5om/55qE5a+56LGhIF9fcHJvdG9fXyDmsqHmnIkgY29uc3RydWN0b3Ig5bGe5oCnXG4gICAgY29uc3QgaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gISgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXyk7XG4gICAgaWYgKGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgICAgcmV0dXJuIE9iamVjdDtcbiAgICB9XG4gICAgLy8g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWwXG4gICAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3RvcjtcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei+WIl+ihqFxuICAgKiBAcGFyYW0gdmFsdWUgeyp9IOWAvFxuICAgKiBAcmV0dXJucyB7KltdfSDnu5/kuIDov5Tlm57mlbDnu4TjgIJudWxs44CBdW5kZWZpbmVkIOWvueW6lOS4uiBbbnVsbF0sW3VuZGVmaW5lZF1cbiAgICovXG4gIGdldEV4YWN0VHlwZXModmFsdWUpIHtcbiAgICAvLyBudWxs44CBdW5kZWZpbmVkIOWIpOaWreWkhOeQhlxuICAgIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBbdmFsdWVdO1xuICAgIH1cbiAgICAvLyDmiavljp/lnovpk77lvpfliLDlr7nlupTmnoTpgKDlh73mlbBcbiAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgbGV0IGxvb3AgPSAwO1xuICAgIGxldCBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gZmFsc2U7XG4gICAgbGV0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIC8vIGNvbnNvbGUud2Fybignd2hpbGUnLCBsb29wLCBfX3Byb3RvX18pO1xuICAgICAgaWYgKF9fcHJvdG9fXyA9PT0gbnVsbCkge1xuICAgICAgICAvLyDkuIDov5vmnaUgX19wcm90b19fIOWwseaYryBudWxsIOivtOaYjiB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaFcbiAgICAgICAgaWYgKGxvb3AgPD0gMCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKE9iamVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKE9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKF9fcHJvdG9fXy5jb25zdHJ1Y3Rvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihfX3Byb3RvX18pO1xuICAgICAgbG9vcCsrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICAvKipcbiAgICog5rex5ou36LSd5pWw5o2uXG4gICAqIEBwYXJhbSBzb3VyY2Ugeyp9XG4gICAqIEByZXR1cm5zIHtNYXA8YW55LCBhbnk+fFNldDxhbnk+fHt9fCp8KltdfVxuICAgKi9cbiAgZGVlcENsb25lKHNvdXJjZSkge1xuICAgIC8vIOaVsOe7hFxuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIFNldFxuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgIGxldCByZXN1bHQgPSBuZXcgU2V0KCk7XG4gICAgICBmb3IgKGxldCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgICAgcmVzdWx0LmFkZCh0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8gTWFwXG4gICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXAoKTtcbiAgICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBzb3VyY2UuZW50cmllcygpKSB7XG4gICAgICAgIHJlc3VsdC5zZXQoa2V5LCB0aGlzLmRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8g5a+56LGhXG4gICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHNvdXJjZSkgPT09IE9iamVjdCkge1xuICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgICAgLy8gdmFsdWXmlrnlvI/vvJrpgJLlvZLlpITnkIZcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIHtcbiAgICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5kZWVwQ2xvbmUoZGVzYy52YWx1ZSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0L3NldCDmlrnlvI/vvJrnm7TmjqXlrprkuYlcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyDlhbbku5bvvJrljp/moLfov5Tlm55cbiAgICByZXR1cm4gc291cmNlO1xuICB9LFxuICAvKipcbiAgICog5rex6Kej5YyF5pWw5o2uXG4gICAqIEBwYXJhbSBkYXRhIHsqfSDlgLxcbiAgICogQHBhcmFtIGlzV3JhcCB7ZnVuY3Rpb259IOWMheijheaVsOaNruWIpOaWreWHveaVsO+8jOWmgnZ1ZTPnmoRpc1JlZuWHveaVsFxuICAgKiBAcGFyYW0gdW53cmFwIHtmdW5jdGlvbn0g6Kej5YyF5pa55byP5Ye95pWw77yM5aaCdnVlM+eahHVucmVm5Ye95pWwXG4gICAqIEByZXR1cm5zIHsoKnx7W3A6IHN0cmluZ106IGFueX0pW118Knx7W3A6IHN0cmluZ106IGFueX18e1twOiBzdHJpbmddOiAqfHtbcDogc3RyaW5nXTogYW55fX19XG4gICAqL1xuICBkZWVwVW53cmFwKGRhdGEsIHsgaXNXcmFwID0gRkFMU0UsIHVud3JhcCA9IFJBVyB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBpc1dyYXAsIHVud3JhcCB9O1xuICAgIC8vIOWMheijheexu+Wei++8iOWmgnZ1ZTPlk43lupTlvI/lr7nosaHvvInmlbDmja7op6PljIVcbiAgICBpZiAoaXNXcmFwKGRhdGEpKSB7XG4gICAgICByZXR1cm4gRGF0YS5kZWVwVW53cmFwKHVud3JhcChkYXRhKSwgb3B0aW9ucyk7XG4gICAgfVxuICAgIC8vIOmAkuW9kuWkhOeQhueahOexu+Wei1xuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiBkYXRhLm1hcCh2YWwgPT4gRGF0YS5kZWVwVW53cmFwKHZhbCwgb3B0aW9ucykpO1xuICAgIH1cbiAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUoZGF0YSkgPT09IE9iamVjdCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhkYXRhKS5tYXAoKFtrZXksIHZhbF0pID0+IHtcbiAgICAgICAgcmV0dXJuIFtrZXksIERhdGEuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpXTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgLy8g5YW25LuW5Y6f5qC36L+U5ZueXG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sXG59O1xuLy8g5aSE55CGdnVl5pWw5o2u55SoXG5leHBvcnQgY29uc3QgVnVlRGF0YSA9IHtcbiAgLyoqXG4gICAqIOa3seino+WMhXZ1ZTPlk43lupTlvI/lr7nosaHmlbDmja5cbiAgICogQHBhcmFtIGRhdGEgeyp9XG4gICAqIEByZXR1cm5zIHsoKnx7W3A6IHN0cmluZ106ICp9KVtdfCp8e1twOiBzdHJpbmddOiAqfXx7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiAqfX19XG4gICAqL1xuICBkZWVwVW53cmFwVnVlMyhkYXRhKSB7XG4gICAgcmV0dXJuIERhdGEuZGVlcFVud3JhcChkYXRhLCB7XG4gICAgICBpc1dyYXA6IGRhdGEgPT4gZGF0YT8uX192X2lzUmVmLFxuICAgICAgdW53cmFwOiBkYXRhID0+IGRhdGEudmFsdWUsXG4gICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+WIHByb3BzIOWumuS5ieeahOWxnuaAp1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSBwcm9wRGVmaW5pdGlvbnMgcHJvcHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBnZXRQcm9wc0Zyb21BdHRycyhhdHRycywgcHJvcERlZmluaXRpb25zKSB7XG4gICAgLy8gcHJvcHMg5a6a5LmJ57uf5LiA5oiQ5a+56LGh5qC85byP77yMdHlwZSDnu5/kuIDmiJDmlbDnu4TmoLzlvI/ku6Xkvr/lkI7nu63liKTmlq1cbiAgICBpZiAocHJvcERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhwcm9wRGVmaW5pdGlvbnMubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIHsgdHlwZTogW10gfV0pKTtcbiAgICB9IGVsc2UgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHByb3BEZWZpbml0aW9ucykgPT09IE9iamVjdCkge1xuICAgICAgcHJvcERlZmluaXRpb25zID0gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykubWFwKChbbmFtZSwgZGVmaW5pdGlvbl0pID0+IHtcbiAgICAgICAgZGVmaW5pdGlvbiA9IERhdGEuZ2V0RXhhY3RUeXBlKGRlZmluaXRpb24pID09PSBPYmplY3RcbiAgICAgICAgICA/IHsgLi4uZGVmaW5pdGlvbiwgdHlwZTogW2RlZmluaXRpb24udHlwZV0uZmxhdCgpIH1cbiAgICAgICAgICA6IHsgdHlwZTogW2RlZmluaXRpb25dLmZsYXQoKSB9O1xuICAgICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIGRlZmluaXRpb25dO1xuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wRGVmaW5pdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgLy8g6K6+572u5YC8XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykpIHtcbiAgICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBkZWZpbml0aW9uLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICAgIC8vIHByb3BOYW1lIOaIliBwcm9wLW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgY29uc3QgYXR0clZhbHVlID0gYXR0cnNbbmFtZV07XG4gICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgICAvLyDlj6rljIXlkKtCb29sZWFu57G75Z6L55qEJyfovazmjaLkuLp0cnVl77yM5YW25LuW5Y6f5qC36LWL5YC8XG4gICAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBkZWZpbml0aW9uLnR5cGUubGVuZ3RoID09PSAxICYmIGRlZmluaXRpb24udHlwZS5pbmNsdWRlcyhCb29sZWFuKSAmJiBhdHRyVmFsdWUgPT09ICcnID8gdHJ1ZSA6IGF0dHJWYWx1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcHJvcC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgICBpZiAoZW5kKSB7IHJldHVybjsgfVxuICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBfU3RyaW5nLnRvTGluZUNhc2UobmFtZSksIGRlZmluaXRpb24sIGVuZDogdHJ1ZSB9KTtcbiAgICAgIH0pKHtcbiAgICAgICAgbmFtZSwgZGVmaW5pdGlvbixcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICAvKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBlbWl0cyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gZW1pdERlZmluaXRpb25zIGVtaXRzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgZ2V0RW1pdHNGcm9tQXR0cnMoYXR0cnMsIGVtaXREZWZpbml0aW9ucykge1xuICAgIC8vIGVtaXRzIOWumuS5iee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShlbWl0RGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICAgIGVtaXREZWZpbml0aW9ucyA9IE9iamVjdC5rZXlzKGVtaXREZWZpbml0aW9ucyk7XG4gICAgfSBlbHNlIGlmICghKGVtaXREZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgZW1pdERlZmluaXRpb25zID0gW107XG4gICAgfVxuICAgIC8vIOe7n+S4gOWkhOeQhuaIkCBvbkVtaXROYW1l44CBb25VcGRhdGU6ZW1pdE5hbWUodi1tb2RlbOezu+WIlykg5qC85byPXG4gICAgY29uc3QgZW1pdE5hbWVzID0gZW1pdERlZmluaXRpb25zLm1hcChuYW1lID0+IF9TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKSk7XG4gICAgLy8g6K6+572u5YC8XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgbmFtZSBvZiBlbWl0TmFtZXMpIHtcbiAgICAgIChmdW5jdGlvbiBzZXRSZXN1bHQoeyBuYW1lLCBlbmQgPSBmYWxzZSB9KSB7XG4gICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uVXBkYXRlOicpKSB7XG4gICAgICAgICAgLy8gb25VcGRhdGU6ZW1pdE5hbWUg5oiWIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG9uVXBkYXRlOmVtaXQtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgICBpZiAoZW5kKSB7IHJldHVybjsgfVxuICAgICAgICAgIHNldFJlc3VsdCh7IG5hbWU6IGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShuYW1lLnNsaWNlKG5hbWUuaW5kZXhPZignOicpICsgMSkpfWAsIGVuZDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvbkVtaXROYW1l5qC85byP77yM5Lit5YiS57q/5qC85byP5bey6KKrdnVl6L2s5o2i5LiN55So6YeN5aSN5aSE55CGXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH0pKHsgbmFtZSB9KTtcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5bliankvZnlsZ7mgKfjgILluLjnlKjkuo7nu4Tku7Zpbmhlcml0QXR0cnPorr7nva5mYWxzZeaXtuS9v+eUqOS9nOS4uuaWsOeahGF0dHJzXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIHt9IOmFjee9rumhuVxuICAgKiAgICAgICAgICBAcGFyYW0gcHJvcHMgcHJvcHMg5a6a5LmJIOaIliB2dWUgcHJvcHPvvIzlpoIgRWxCdXR0b24ucHJvcHMg562JXG4gICAqICAgICAgICAgIEBwYXJhbSBlbWl0cyBlbWl0cyDlrprkuYkg5oiWIHZ1ZSBlbWl0c++8jOWmgiBFbEJ1dHRvbi5lbWl0cyDnrYlcbiAgICogICAgICAgICAgQHBhcmFtIGxpc3Qg6aKd5aSW55qE5pmu6YCa5bGe5oCnXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIGdldFJlc3RGcm9tQXR0cnMoYXR0cnMsIHsgcHJvcHMsIGVtaXRzLCBsaXN0ID0gW10gfSA9IHt9KSB7XG4gICAgLy8g57uf5LiA5oiQ5pWw57uE5qC85byPXG4gICAgcHJvcHMgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgYXJyID0gKCgpID0+IHtcbiAgICAgICAgaWYgKHByb3BzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHByb3BzKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgICB9KSgpO1xuICAgICAgcmV0dXJuIGFyci5tYXAobmFtZSA9PiBbX1N0cmluZy50b0NhbWVsQ2FzZShuYW1lKSwgX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpXSkuZmxhdCgpO1xuICAgIH0pKCk7XG4gICAgZW1pdHMgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgYXJyID0gKCgpID0+IHtcbiAgICAgICAgaWYgKGVtaXRzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICByZXR1cm4gZW1pdHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKGVtaXRzKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGVtaXRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgICB9KSgpO1xuICAgICAgcmV0dXJuIGFyci5tYXAoKG5hbWUpID0+IHtcbiAgICAgICAgLy8gdXBkYXRlOmVtaXROYW1lIOaIliB1cGRhdGU6ZW1pdC1uYW1lIOagvOW8j1xuICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCd1cGRhdGU6JykpIHtcbiAgICAgICAgICBjb25zdCBwYXJ0TmFtZSA9IG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKTtcbiAgICAgICAgICByZXR1cm4gW2BvblVwZGF0ZToke19TdHJpbmcudG9DYW1lbENhc2UocGFydE5hbWUpfWAsIGBvblVwZGF0ZToke19TdHJpbmcudG9MaW5lQ2FzZShwYXJ0TmFtZSl9YF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgICByZXR1cm4gW19TdHJpbmcudG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKV07XG4gICAgICB9KS5mbGF0KCk7XG4gICAgfSkoKTtcbiAgICBsaXN0ID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9IERhdGEuZ2V0RXhhY3RUeXBlKGxpc3QpID09PSBTdHJpbmdcbiAgICAgICAgPyBsaXN0LnNwbGl0KCcsJylcbiAgICAgICAgOiBsaXN0IGluc3RhbmNlb2YgQXJyYXkgPyBsaXN0IDogW107XG4gICAgICByZXR1cm4gYXJyLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICAgIH0pKCk7XG4gICAgY29uc3QgbGlzdEFsbCA9IEFycmF5LmZyb20obmV3IFNldChbcHJvcHMsIGVtaXRzLCBsaXN0XS5mbGF0KCkpKTtcbiAgICAvLyBjb25zb2xlLmxvZygnbGlzdEFsbCcsIGxpc3RBbGwpO1xuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhhdHRycykpKSB7XG4gICAgICBpZiAoIWxpc3RBbGwuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgbmFtZSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgRGF0YSB9IGZyb20gJy4vRGF0YSc7XG5cbmV4cG9ydCBjb25zdCBfRGF0ZSA9IHtcbiAgLyoqXG4gICAqIOWIm+W7ukRhdGXlr7nosaFcbiAgICogQHBhcmFtIGFyZ3MgeypbXX0g5aSa5Liq5YC8XG4gICAqIEByZXR1cm5zIHtEYXRlfVxuICAgKi9cbiAgY3JlYXRlKC4uLmFyZ3MpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gc2FmYXJpIOa1j+iniOWZqOWtl+espuS4suagvOW8j+WFvOWuuVxuICAgICAgY29uc3QgdmFsdWUgPSBhcmd1bWVudHNbMF07XG4gICAgICBjb25zdCB2YWx1ZVJlc3VsdCA9IERhdGEuZ2V0RXhhY3RUeXBlKHZhbHVlKSA9PT0gU3RyaW5nID8gdmFsdWUucmVwbGFjZUFsbCgnLScsICcvJykgOiB2YWx1ZTtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZVJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOS8oOWPguihjOS4uuWFiOWSjERhdGXkuIDoh7TvvIzlkI7nu63lho3mlLbpm4bpnIDmsYLliqDlvLrlrprliLYo5rOo5oSP5peg5Y+C5ZKM5pi+5byPdW5kZWZpbmVk55qE5Yy65YirKVxuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDAgPyBuZXcgRGF0ZSgpIDogbmV3IERhdGUoLi4uYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sXG59O1xuIiwiZXhwb3J0IGNvbnN0IF9NYXRoID0ge1xuLy8g5aKe5Yqg6YOo5YiG5ZG95ZCN5Lul5o6l6L+R5pWw5a2m6KGo6L6+5pa55byPXG4gIGFyY3NpbjogTWF0aC5hc2luLFxuICBhcmNjb3M6IE1hdGguYWNvcyxcbiAgYXJjdGFuOiBNYXRoLmF0YW4sXG4gIGFyc2luaDogTWF0aC5hc2luaCxcbiAgYXJjb3NoOiBNYXRoLmFjb3NoLFxuICBhcnRhbmg6IE1hdGguYXRhbmgsXG4gIGxvZ2U6IE1hdGgubG9nLFxuICBsbjogTWF0aC5sb2csXG4gIGxnOiBNYXRoLmxvZzEwLFxuICBsb2coYSwgeCkge1xuICAgIHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKGEpO1xuICB9LFxufTtcbiIsImV4cG9ydCBjb25zdCBfUmVmbGVjdCA9IHtcbiAgLy8g5a+5IG93bktleXMg6YWN5aWXIG93blZhbHVlcyDlkowgb3duRW50cmllc1xuICBvd25WYWx1ZXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xuICB9LFxuICBvd25FbnRyaWVzKHRhcmdldCkge1xuICAgIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IFtrZXksIHRhcmdldFtrZXldXSk7XG4gIH0sXG59O1xuIiwiZXhwb3J0IGNvbnN0IF9TZXQgPSB7XG4gIC8qKlxuICAgKiDliqDlvLphZGTmlrnms5XjgILot5/mlbDnu4RwdXNo5pa55rOV5LiA5qC35Y+v5re75Yqg5aSa5Liq5YC8XG4gICAqIEBwYXJhbSBzZXQge1NldH0g55uu5qCHc2V0XG4gICAqIEBwYXJhbSBhcmdzIHsqW119IOWkmuS4quWAvFxuICAgKi9cbiAgYWRkKHNldCwgLi4uYXJncykge1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIHNldC5hZGQoYXJnKTtcbiAgICB9XG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgX1JlZmxlY3QgfSBmcm9tICcuL19SZWZsZWN0JztcbmltcG9ydCB7IF9TZXQgfSBmcm9tICcuL19TZXQnO1xuaW1wb3J0IHsgRGF0YSB9IGZyb20gJy4vRGF0YSc7XG5cbi8qKlxuICog5bGe5oCn5ZCN57uf5LiA5oiQ5pWw57uE5qC85byPXG4gKiBAcGFyYW0gbmFtZXMge3N0cmluZ3xTeW1ib2x8YXJyYXl9IOWxnuaAp+WQjeOAguagvOW8jyAnYSxiLGMnIOaIliBbJ2EnLCdiJywnYyddXG4gKiBAcGFyYW0gc2VwYXJhdG9yIHtzdHJpbmd8UmVnRXhwfSBuYW1lcyDkuLrlrZfnrKbkuLLml7bnmoTmi4bliIbop4TliJnjgILlkIwgc3BsaXQg5pa55rOV55qEIHNlcGFyYXRvcu+8jOWtl+espuS4suaXoOmcgOaLhuWIhueahOWPr+S7peS8oCBudWxsIOaIliB1bmRlZmluZWRcbiAqIEByZXR1cm5zIHsqW11bXXwoTWFnaWNTdHJpbmcgfCBCdW5kbGUgfCBzdHJpbmcpW118RmxhdEFycmF5PChGbGF0QXJyYXk8KCp8WypbXV18W10pW10sIDE+W118KnxbKltdXXxbXSlbXSwgMT5bXXwqW119XG4gKi9cbmZ1bmN0aW9uIG5hbWVzVG9BcnJheShuYW1lcyA9IFtdLCB7IHNlcGFyYXRvciA9ICcsJyB9ID0ge30pIHtcbiAgaWYgKG5hbWVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gbmFtZXMubWFwKHZhbCA9PiBuYW1lc1RvQXJyYXkodmFsKSkuZmxhdCgpO1xuICB9XG4gIGNvbnN0IGV4YWN0VHlwZSA9IERhdGEuZ2V0RXhhY3RUeXBlKG5hbWVzKTtcbiAgaWYgKGV4YWN0VHlwZSA9PT0gU3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVzLnNwbGl0KHNlcGFyYXRvcikubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH1cbiAgaWYgKGV4YWN0VHlwZSA9PT0gU3ltYm9sKSB7XG4gICAgcmV0dXJuIFtuYW1lc107XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KFN5bWJvbCgpKSk7XG4vLyBjb25zb2xlLmxvZyhuYW1lc1RvQXJyYXkoWydhJywgJ2InLCAnYycsIFN5bWJvbCgpXSkpO1xuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KCdhLGIsYycpKTtcbi8vIGNvbnNvbGUubG9nKG5hbWVzVG9BcnJheShbJ2EsYixjJywgU3ltYm9sKCldKSk7XG5leHBvcnQgY29uc3QgX09iamVjdCA9IHtcbiAgLyoqXG4gICAqIOa1heWQiOW5tuWvueixoeOAguWGmeazleWQjCBPYmplY3QuYXNzaWduXG4gICAqIOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICAgKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gc291cmNlcyB7YW55W119IOaVsOaNrua6kOOAguS4gOS4quaIluWkmuS4quWvueixoVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIC8vIOS4jeS9v+eUqCB0YXJnZXRba2V5XT12YWx1ZSDlhpnms5XvvIznm7TmjqXkvb/nlKhkZXNj6YeN5a6a5LmJXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH0sXG4gIC8qKlxuICAgKiDmt7HlkIjlubblr7nosaHjgILlkIwgYXNzaWduIOS4gOagt+S5n+S8muWvueWxnuaAp+i/m+ihjOmHjeWumuS5iVxuICAgKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoeOAgum7mOiupOWAvCB7fSDpmLLmraLpgJLlvZLml7bmiqUgVHlwZUVycm9yOiBPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3RcbiAgICogQHBhcmFtIHNvdXJjZXMge2FueVtdfSDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICovXG4gIGRlZXBBc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAvLyB2YWx1ZeWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShkZXNjLnZhbHVlKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcEFzc2lnbih0YXJnZXRba2V5XSwgZGVzYy52YWx1ZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0L3NldOWGmeazle+8muebtOaOpeWumuS5iVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSxcbiAgLyoqXG4gICAqIGtleeiHqui6q+aJgOWxnueahOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd8U3ltYm9sfSDlsZ7mgKflkI1cbiAgICogQHJldHVybnMgeyp8bnVsbH1cbiAgICovXG4gIG93bmVyKG9iamVjdCwga2V5KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3duZXIoX19wcm90b19fLCBrZXkpO1xuICB9LFxuICAvKipcbiAgICog6I635Y+W5bGe5oCn5o+P6L+w5a+56LGh77yM55u45q+UIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3LvvIzog73mi7/liLDnu6fmib/lsZ7mgKfnmoTmj4/ov7Dlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fVxuICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd8U3ltYm9sfVxuICAgKiBAcmV0dXJucyB7UHJvcGVydHlEZXNjcmlwdG9yfVxuICAgKi9cbiAgZGVzY3JpcHRvcihvYmplY3QsIGtleSkge1xuICAgIGNvbnN0IGZpbmRPYmplY3QgPSB0aGlzLm93bmVyKG9iamVjdCwga2V5KTtcbiAgICBpZiAoIWZpbmRPYmplY3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZpbmRPYmplY3QsIGtleSk7XG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5blsZ7mgKflkI3jgILpu5jorqTlj4LmlbDphY3nva7miJDlkIwgT2JqZWN0LmtleXMg6KGM5Li6XG4gICAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wge2Jvb2xlYW59IOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHthbnlbXX1cbiAgICovXG4gIGtleXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgLy8gc2V055So5LqOa2V55Y676YeNXG4gICAgbGV0IHNldCA9IG5ldyBTZXQoKTtcbiAgICAvLyDoh6rouqvlsZ7mgKfnrZvpgIlcbiAgICBjb25zdCBkZXNjcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCk7XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBfUmVmbGVjdC5vd25FbnRyaWVzKGRlc2NzKSkge1xuICAgICAgLy8g5b+955Wlc3ltYm9s5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIXN5bWJvbCAmJiBEYXRhLmdldEV4YWN0VHlwZShrZXkpID09PSBTeW1ib2wpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlv73nlaXkuI3lj6/liJfkuL7lsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghbm90RW51bWVyYWJsZSAmJiAhZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5bGe5oCn5Yqg5YWlXG4gICAgICBzZXQuYWRkKGtleSk7XG4gICAgfVxuICAgIC8vIOe7p+aJv+WxnuaAp1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgaWYgKF9fcHJvdG9fXyAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXJlbnRLZXlzID0gdGhpcy5rZXlzKF9fcHJvdG9fXywgb3B0aW9ucyk7XG4gICAgICAgIF9TZXQuYWRkKHNldCwgLi4ucGFyZW50S2V5cyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIOi/lOWbnuaVsOe7hFxuICAgIHJldHVybiBBcnJheS5mcm9tKHNldCk7XG4gIH0sXG4gIC8qKlxuICAgKiDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvcnPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge1Byb3BlcnR5RGVzY3JpcHRvcltdfVxuICAgKi9cbiAgZGVzY3JpcHRvcnMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3Qga2V5cyA9IHRoaXMua2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICAgIHJldHVybiBrZXlzLm1hcChrZXkgPT4gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KSk7XG4gIH0sXG4gIC8qKlxuICAgKiDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvckVudHJpZXPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge1tzdHJpbmd8U3ltYm9sLFByb3BlcnR5RGVzY3JpcHRvcl1bXX1cbiAgICovXG4gIGRlc2NyaXB0b3JFbnRyaWVzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4ga2V5cy5tYXAoa2V5ID0+IFtrZXksIHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSldKTtcbiAgfSxcbiAgLyoqXG4gICAqIOmAieWPluWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICAgKiBAcGFyYW0gcGljayB7c3RyaW5nfGFycmF5fSDmjJHpgInlsZ7mgKdcbiAgICogQHBhcmFtIG9taXQge3N0cmluZ3xhcnJheX0g5b+955Wl5bGe5oCnXG4gICAqIEBwYXJhbSBlbXB0eVBpY2sge3N0cmluZ30gcGljayDkuLrnqbrml7bnmoTlj5blgLzjgIJhbGwg5YWo6YOoa2V577yMZW1wdHkg56m6XG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ige3N0cmluZ3xSZWdFeHB9IOWQjCBuYW1lc1RvQXJyYXkg55qEIHNlcGFyYXRvciDlj4LmlbBcbiAgICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5ZCMIGtleXMg55qEIHN5bWJvbCDlj4LmlbBcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOWQjCBrZXlzIOeahCBub3RFbnVtZXJhYmxlIOWPguaVsFxuICAgKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDlkIwga2V5cyDnmoQgZXh0ZW5kIOWPguaVsFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBmaWx0ZXIob2JqZWN0LCB7IHBpY2sgPSBbXSwgb21pdCA9IFtdLCBlbXB0eVBpY2sgPSAnYWxsJywgc2VwYXJhdG9yID0gJywnLCBzeW1ib2wgPSB0cnVlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IHRydWUgfSA9IHt9KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIC8vIHBpY2vjgIFvbWl0IOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIHBpY2sgPSBuYW1lc1RvQXJyYXkocGljaywgeyBzZXBhcmF0b3IgfSk7XG4gICAgb21pdCA9IG5hbWVzVG9BcnJheShvbWl0LCB7IHNlcGFyYXRvciB9KTtcbiAgICBsZXQga2V5cyA9IFtdO1xuICAgIC8vIHBpY2vmnInlgLznm7TmjqXmi7/vvIzkuLrnqbrml7bmoLnmja4gZW1wdHlQaWNrIOm7mOiupOaLv+epuuaIluWFqOmDqGtleVxuICAgIGtleXMgPSBwaWNrLmxlbmd0aCA+IDAgfHwgZW1wdHlQaWNrID09PSAnZW1wdHknID8gcGljayA6IHRoaXMua2V5cyhvYmplY3QsIHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfSk7XG4gICAgLy8gb21pdOetm+mAiVxuICAgIGtleXMgPSBrZXlzLmZpbHRlcihrZXkgPT4gIW9taXQuaW5jbHVkZXMoa2V5KSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgY29uc3QgZGVzYyA9IHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG4gICAgICAvLyDlsZ7mgKfkuI3lrZjlnKjlr7zoh7RkZXNj5b6X5YiwdW5kZWZpbmVk5pe25LiN6K6+572u5YC8XG4gICAgICBpZiAoZGVzYykge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICAvKipcbiAgICog6YCa6L+H5oyR6YCJ5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVy55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIHtzdHJpbmd8YXJyYXl9IOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fSDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBwaWNrKG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIob2JqZWN0LCB7IHBpY2s6IGtleXMsIGVtcHR5UGljazogJ2VtcHR5JywgLi4ub3B0aW9ucyB9KTtcbiAgfSxcbiAgLyoqXG4gICAqIOmAmui/h+aOkumZpOaWueW8j+mAieWPluWvueixoeOAgmZpbHRlcueahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyB7c3RyaW5nfGFycmF5fSDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMge29iamVjdH0g6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgb21pdChvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBvbWl0OiBrZXlzLCAuLi5vcHRpb25zIH0pO1xuICB9LFxufTtcbiIsImV4cG9ydCBjb25zdCBfUHJveHkgPSB7XG4gIC8qKlxuICAgKiDnu5Hlrpp0aGlz44CC5bi455So5LqO6Kej5p6E5Ye95pWw5pe257uR5a6adGhpc+mBv+WFjeaKpemUmVxuICAgKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fSDpgInpobnjgILmianlsZXnlKhcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBiaW5kVGhpcyh0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0LCB7XG4gICAgICBnZXQodGFyZ2V0LCBwLCByZWNlaXZlcikge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IFJlZmxlY3QuZ2V0KC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8vIOWHveaVsOexu+Wei+e7keWumnRoaXNcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIOWFtuS7luWxnuaAp+WOn+agt+i/lOWbnlxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuICAgIH0pO1xuICB9LFxufTtcbiIsIi8vIOWkhOeQhuagt+W8j+eUqFxuZXhwb3J0IGNvbnN0IFN0eWxlID0ge1xuICAvKipcbiAgICog5bim5Y2V5L2N5a2X56ym5Liy44CC5a+55pWw5a2X5oiW5pWw5a2X5qC85byP55qE5a2X56ym5Liy6Ieq5Yqo5ou85Y2V5L2N77yM5YW25LuW5a2X56ym5Liy5Y6f5qC36L+U5ZueXG4gICAqIEBwYXJhbSB2YWx1ZSB7bnVtYmVyfHN0cmluZ30g5YC8XG4gICAqIEBwYXJhbSB1bml0IOWNleS9jeOAgnZhbHVl5rKh5bim5Y2V5L2N5pe26Ieq5Yqo5ou85o6l77yM5Y+v5LygIHB4L2VtLyUg562JXG4gICAqIEByZXR1cm5zIHtzdHJpbmd8c3RyaW5nfVxuICAgKi9cbiAgZ2V0VW5pdFN0cmluZyh2YWx1ZSA9ICcnLCB7IHVuaXQgPSAncHgnIH0gPSB7fSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJycpIHsgcmV0dXJuICcnOyB9XG4gICAgLy8g5rOo5oSP77ya6L+Z6YeM5L2/55SoID09IOWIpOaWre+8jOS4jeS9v+eUqCA9PT1cbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlKSA9PSB2YWx1ZSA/IGAke3ZhbHVlfSR7dW5pdH1gIDogU3RyaW5nKHZhbHVlKTtcbiAgfSxcbn07XG4iLCIvKipcbiAqIGVzbGludCDphY3nva7vvJpodHRwOi8vZXNsaW50LmNuL2RvY3MvcnVsZXMvXG4gKiBlc2xpbnQtcGx1Z2luLXZ1ZSDphY3nva7vvJpodHRwczovL2VzbGludC52dWVqcy5vcmcvcnVsZXMvXG4gKi9cbmltcG9ydCB7IF9PYmplY3QsIERhdGEgfSBmcm9tICcuLi9iYXNlJztcblxuLyoqXG4gKiDlr7zlh7rluLjph4/kvr/mjbfkvb/nlKhcbiAqL1xuZXhwb3J0IGNvbnN0IE9GRiA9ICdvZmYnO1xuZXhwb3J0IGNvbnN0IFdBUk4gPSAnd2Fybic7XG5leHBvcnQgY29uc3QgRVJST1IgPSAnZXJyb3InO1xuLyoqXG4gKiDlrprliLbnmoTphY3nva5cbiAqL1xuLy8g5Z+656GA5a6a5Yi2XG5leHBvcnQgY29uc3QgYmFzZUNvbmZpZyA9IHtcbiAgLy8g546v5aKD44CC5LiA5Liq546v5aKD5a6a5LmJ5LqG5LiA57uE6aKE5a6a5LmJ55qE5YWo5bGA5Y+Y6YePXG4gIGVudjoge1xuICAgIGJyb3dzZXI6IHRydWUsXG4gICAgbm9kZTogdHJ1ZSxcbiAgfSxcbiAgLy8g6Kej5p6Q5ZmoXG4gIHBhcnNlck9wdGlvbnM6IHtcbiAgICBlY21hVmVyc2lvbjogJ2xhdGVzdCcsXG4gICAgc291cmNlVHlwZTogJ21vZHVsZScsXG4gICAgZWNtYUZlYXR1cmVzOiB7XG4gICAgICBqc3g6IHRydWUsXG4gICAgICBleHBlcmltZW50YWxPYmplY3RSZXN0U3ByZWFkOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIC8qKlxuICAgKiDnu6fmib9cbiAgICog5L2/55SoZXNsaW5055qE6KeE5YiZ77yaZXNsaW50OumFjee9ruWQjeensFxuICAgKiDkvb/nlKjmj5Lku7bnmoTphY3nva7vvJpwbHVnaW465YyF5ZCN566A5YaZL+mFjee9ruWQjeensFxuICAgKi9cbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCBlc2xpbnQg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ2VzbGludDpyZWNvbW1lbmRlZCcsXG4gIF0sXG4gIC8vXG4gIC8qKlxuICAgKiDop4TliJlcbiAgICog5p2l6IeqIGVzbGludCDnmoTop4TliJnvvJrop4TliJlJRCA6IHZhbHVlXG4gICAqIOadpeiHquaPkuS7tueahOinhOWIme+8muWMheWQjeeugOWGmS/op4TliJlJRCA6IHZhbHVlXG4gICAqL1xuICBydWxlczoge1xuICAgIC8qKlxuICAgICAqIFBvc3NpYmxlIEVycm9yc1xuICAgICAqIOi/meS6m+inhOWImeS4jiBKYXZhU2NyaXB0IOS7o+eggeS4reWPr+iDveeahOmUmeivr+aIlumAu+i+kemUmeivr+acieWFs++8mlxuICAgICAqL1xuICAgICdnZXR0ZXItcmV0dXJuJzogT0ZGLCAvLyDlvLrliLYgZ2V0dGVyIOWHveaVsOS4reWHuueOsCByZXR1cm4g6K+t5Y+lXG4gICAgJ25vLWNvbnN0YW50LWNvbmRpdGlvbic6IE9GRiwgLy8g56aB5q2i5Zyo5p2h5Lu25Lit5L2/55So5bi46YeP6KGo6L6+5byPXG4gICAgJ25vLWVtcHR5JzogT0ZGLCAvLyDnpoHmraLlh7rnjrDnqbror63lj6XlnZdcbiAgICAnbm8tZXh0cmEtc2VtaSc6IFdBUk4sIC8vIOemgeatouS4jeW/heimgeeahOWIhuWPt1xuICAgICduby1mdW5jLWFzc2lnbic6IE9GRiwgLy8g56aB5q2i5a+5IGZ1bmN0aW9uIOWjsOaYjumHjeaWsOi1i+WAvFxuICAgICduby1wcm90b3R5cGUtYnVpbHRpbnMnOiBPRkYsIC8vIOemgeatouebtOaOpeiwg+eUqCBPYmplY3QucHJvdG90eXBlcyDnmoTlhoXnva7lsZ7mgKdcbiAgICAvKipcbiAgICAgKiBCZXN0IFByYWN0aWNlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6juacgOS9s+Wunui3teeahO+8jOW4ruWKqeS9oOmBv+WFjeS4gOS6m+mXrumimO+8mlxuICAgICAqL1xuICAgICdhY2Nlc3Nvci1wYWlycyc6IEVSUk9SLCAvLyDlvLrliLYgZ2V0dGVyIOWSjCBzZXR0ZXIg5Zyo5a+56LGh5Lit5oiQ5a+55Ye6546wXG4gICAgJ2FycmF5LWNhbGxiYWNrLXJldHVybic6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueazleeahOWbnuiwg+WHveaVsOS4reaciSByZXR1cm4g6K+t5Y+lXG4gICAgJ2Jsb2NrLXNjb3BlZC12YXInOiBFUlJPUiwgLy8g5by65Yi25oqK5Y+Y6YeP55qE5L2/55So6ZmQ5Yi25Zyo5YW25a6a5LmJ55qE5L2c55So5Z+f6IyD5Zu05YaFXG4gICAgJ2N1cmx5JzogV0FSTiwgLy8g5by65Yi25omA5pyJ5o6n5Yi26K+t5Y+l5L2/55So5LiA6Ie055qE5ous5Y+36aOO5qC8XG4gICAgJ25vLWZhbGx0aHJvdWdoJzogV0FSTiwgLy8g56aB5q2iIGNhc2Ug6K+t5Y+l6JC956m6XG4gICAgJ25vLWZsb2F0aW5nLWRlY2ltYWwnOiBFUlJPUiwgLy8g56aB5q2i5pWw5a2X5a2X6Z2i6YeP5Lit5L2/55So5YmN5a+85ZKM5pyr5bC+5bCP5pWw54K5XG4gICAgJ25vLW11bHRpLXNwYWNlcyc6IFdBUk4sIC8vIOemgeatouS9v+eUqOWkmuS4quepuuagvFxuICAgICduby1uZXctd3JhcHBlcnMnOiBFUlJPUiwgLy8g56aB5q2i5a+5IFN0cmluZ++8jE51bWJlciDlkowgQm9vbGVhbiDkvb/nlKggbmV3IOaTjeS9nOesplxuICAgICduby1wcm90byc6IEVSUk9SLCAvLyDnpoHnlKggX19wcm90b19fIOWxnuaAp1xuICAgICduby1yZXR1cm4tYXNzaWduJzogV0FSTiwgLy8g56aB5q2i5ZyoIHJldHVybiDor63lj6XkuK3kvb/nlKjotYvlgLzor63lj6VcbiAgICAnbm8tdXNlbGVzcy1lc2NhcGUnOiBXQVJOLCAvLyDnpoHnlKjkuI3lv4XopoHnmoTovazkuYnlrZfnrKZcbiAgICAvKipcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKiDov5nkupvop4TliJnkuI7lj5jph4/lo7DmmI7mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnbm8tdW5kZWYtaW5pdCc6IFdBUk4sIC8vIOemgeatouWwhuWPmOmHj+WIneWni+WMluS4uiB1bmRlZmluZWRcbiAgICAnbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOemgeatouWHuueOsOacquS9v+eUqOi/h+eahOWPmOmHj1xuICAgICduby11c2UtYmVmb3JlLWRlZmluZSc6IFtFUlJPUiwgeyAnZnVuY3Rpb25zJzogZmFsc2UsICdjbGFzc2VzJzogZmFsc2UsICd2YXJpYWJsZXMnOiBmYWxzZSB9XSwgLy8g56aB5q2i5Zyo5Y+Y6YeP5a6a5LmJ5LmL5YmN5L2/55So5a6D5LusXG4gICAgLyoqXG4gICAgICogU3R5bGlzdGljIElzc3Vlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6jumjjuagvOaMh+WNl+eahO+8jOiAjOS4lOaYr+mdnuW4uOS4u+ingueahO+8mlxuICAgICAqL1xuICAgICdhcnJheS1icmFja2V0LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbmlbDnu4Tmlrnmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnYmxvY2stc3BhY2luZyc6IFdBUk4sIC8vIOemgeatouaIluW8uuWItuWcqOS7o+eggeWdl+S4reW8gOaLrOWPt+WJjeWSjOmXreaLrOWPt+WQjuacieepuuagvFxuICAgICdicmFjZS1zdHlsZSc6IFtXQVJOLCAnMXRicycsIHsgJ2FsbG93U2luZ2xlTGluZSc6IHRydWUgfV0sIC8vIOW8uuWItuWcqOS7o+eggeWdl+S4reS9v+eUqOS4gOiHtOeahOWkp+aLrOWPt+mjjuagvFxuICAgICdjb21tYS1kYW5nbGUnOiBbV0FSTiwgJ2Fsd2F5cy1tdWx0aWxpbmUnXSwgLy8g6KaB5rGC5oiW56aB5q2i5pyr5bC+6YCX5Y+3XG4gICAgJ2NvbW1hLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjpgJflj7fliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnY29tbWEtc3R5bGUnOiBXQVJOLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTpgJflj7fpo47moLxcbiAgICAnY29tcHV0ZWQtcHJvcGVydHktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOiuoeeul+eahOWxnuaAp+eahOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdmdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouWcqOWHveaVsOagh+ivhuespuWSjOWFtuiwg+eUqOS5i+mXtOacieepuuagvFxuICAgICdmdW5jdGlvbi1wYXJlbi1uZXdsaW5lJzogV0FSTiwgLy8g5by65Yi25Zyo5Ye95pWw5ous5Y+35YaF5L2/55So5LiA6Ie055qE5o2i6KGMXG4gICAgJ2ltcGxpY2l0LWFycm93LWxpbmVicmVhayc6IFdBUk4sIC8vIOW8uuWItumakOW8j+i/lOWbnueahOeureWktOWHveaVsOS9k+eahOS9jee9rlxuICAgICdpbmRlbnQnOiBbV0FSTiwgMiwgeyAnU3dpdGNoQ2FzZSc6IDEgfV0sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOe8qei/m1xuICAgICdqc3gtcXVvdGVzJzogV0FSTiwgLy8g5by65Yi25ZyoIEpTWCDlsZ7mgKfkuK3kuIDoh7TlnLDkvb/nlKjlj4zlvJXlj7fmiJbljZXlvJXlj7dcbiAgICAna2V5LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlr7nosaHlrZfpnaLph4/nmoTlsZ7mgKfkuK3plK7lkozlgLzkuYvpl7Tkvb/nlKjkuIDoh7TnmoTpl7Tot51cbiAgICAna2V5d29yZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo5YWz6ZSu5a2X5YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ25ldy1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLbmiJbnpoHmraLosIPnlKjml6Dlj4LmnoTpgKDlh73mlbDml7bmnInlnIbmi6zlj7dcbiAgICAnbm8tbXVsdGlwbGUtZW1wdHktbGluZXMnOiBbV0FSTiwgeyAnbWF4JzogMSwgJ21heEVPRic6IDAsICdtYXhCT0YnOiAwIH1dLCAvLyDnpoHmraLlh7rnjrDlpJrooYznqbrooYxcbiAgICAnbm8tdHJhaWxpbmctc3BhY2VzJzogV0FSTiwgLy8g56aB55So6KGM5bC+56m65qC8XG4gICAgJ25vLXdoaXRlc3BhY2UtYmVmb3JlLXByb3BlcnR5JzogV0FSTiwgLy8g56aB5q2i5bGe5oCn5YmN5pyJ56m655m9XG4gICAgJ25vbmJsb2NrLXN0YXRlbWVudC1ib2R5LXBvc2l0aW9uJzogV0FSTiwgLy8g5by65Yi25Y2V5Liq6K+t5Y+l55qE5L2N572uXG4gICAgJ29iamVjdC1jdXJseS1uZXdsaW5lJzogW1dBUk4sIHsgJ211bHRpbGluZSc6IHRydWUsICdjb25zaXN0ZW50JzogdHJ1ZSB9XSwgLy8g5by65Yi25aSn5ous5Y+35YaF5o2i6KGM56ym55qE5LiA6Ie05oCnXG4gICAgJ29iamVjdC1jdXJseS1zcGFjaW5nJzogW1dBUk4sICdhbHdheXMnXSwgLy8g5by65Yi25Zyo5aSn5ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3BhZGRlZC1ibG9ja3MnOiBbV0FSTiwgJ25ldmVyJ10sIC8vIOimgeaxguaIluemgeatouWdl+WGheWhq+WFhVxuICAgICdxdW90ZXMnOiBbV0FSTiwgJ3NpbmdsZScsIHsgJ2F2b2lkRXNjYXBlJzogdHJ1ZSwgJ2FsbG93VGVtcGxhdGVMaXRlcmFscyc6IHRydWUgfV0sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOWPjeWLvuWPt+OAgeWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdzZW1pJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5L2/55So5YiG5Y+35Luj5pu/IEFTSVxuICAgICdzZW1pLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbliIblj7fkuYvliY3lkozkuYvlkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc2VtaS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+eahOS9jee9rlxuICAgICdzcGFjZS1iZWZvcmUtYmxvY2tzJzogV0FSTiwgLy8g5by65Yi25Zyo5Z2X5LmL5YmN5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWJlZm9yZS1mdW5jdGlvbi1wYXJlbic6IFtXQVJOLCB7ICdhbm9ueW1vdXMnOiAnbmV2ZXInLCAnbmFtZWQnOiAnbmV2ZXInLCAnYXN5bmNBcnJvdyc6ICdhbHdheXMnIH1dLCAvLyDlvLrliLblnKggZnVuY3Rpb27nmoTlt6bmi6zlj7fkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW4tcGFyZW5zJzogV0FSTiwgLy8g5by65Yi25Zyo5ZyG5ous5Y+35YaF5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWluZml4LW9wcyc6IFdBUk4sIC8vIOimgeaxguaTjeS9nOespuWRqOWbtOacieepuuagvFxuICAgICdzcGFjZS11bmFyeS1vcHMnOiBXQVJOLCAvLyDlvLrliLblnKjkuIDlhYPmk43kvZznrKbliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2VkLWNvbW1lbnQnOiBXQVJOLCAvLyDlvLrliLblnKjms6jph4rkuK0gLy8g5oiWIC8qIOS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzd2l0Y2gtY29sb24tc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqCBzd2l0Y2gg55qE5YaS5Y+35bem5Y+z5pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLXRhZy1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5qih5p2/5qCH6K6w5ZKM5a6D5Lus55qE5a2X6Z2i6YeP5LmL6Ze055qE56m65qC8XG4gICAgLyoqXG4gICAgICogRUNNQVNjcmlwdCA2XG4gICAgICog6L+Z5Lqb6KeE5YiZ5Y+q5LiOIEVTNiDmnInlhbMsIOWNs+mAmuW4uOaJgOivtOeahCBFUzIwMTXvvJpcbiAgICAgKi9cbiAgICAnYXJyb3ctc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItueureWktOWHveaVsOeahOeureWktOWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdnZW5lcmF0b3Itc3Rhci1zcGFjaW5nJzogW1dBUk4sIHsgJ2JlZm9yZSc6IGZhbHNlLCAnYWZ0ZXInOiB0cnVlLCAnbWV0aG9kJzogeyAnYmVmb3JlJzogdHJ1ZSwgJ2FmdGVyJzogZmFsc2UgfSB9XSwgLy8g5by65Yi2IGdlbmVyYXRvciDlh73mlbDkuK0gKiDlj7flkajlm7Tkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbm8tdXNlbGVzcy1yZW5hbWUnOiBXQVJOLCAvLyDnpoHmraLlnKggaW1wb3J0IOWSjCBleHBvcnQg5ZKM6Kej5p6E6LWL5YC85pe25bCG5byV55So6YeN5ZG95ZCN5Li655u45ZCM55qE5ZCN5a2XXG4gICAgJ3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sIC8vIOimgeaxguS9v+eUqOaooeadv+Wtl+mdoumHj+iAjOmdnuWtl+espuS4sui/nuaOpVxuICAgICdyZXN0LXNwcmVhZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Ymp5L2Z5ZKM5omp5bGV6L+Q566X56ym5Y+K5YW26KGo6L6+5byP5LmL6Ze05pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLWN1cmx5LXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLmqKHmnb/lrZfnrKbkuLLkuK3nmoTltYzlhaXooajovr7lvI/lkajlm7TnqbrmoLznmoTkvb/nlKhcbiAgICAneWllbGQtc3Rhci1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHlpZWxkKiDooajovr7lvI/kuK0gKiDlkajlm7Tkvb/nlKjnqbrmoLxcbiAgfSxcbiAgLy8g6KaG55uWXG4gIG92ZXJyaWRlczogW10sXG59O1xuLy8gdnVlMi92dWUzIOWFseeUqFxuZXhwb3J0IGNvbnN0IHZ1ZUNvbW1vbkNvbmZpZyA9IHtcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL211bHRpLXdvcmQtY29tcG9uZW50LW5hbWVzJzogT0ZGLCAvLyDopoHmsYLnu4Tku7blkI3np7Dlp4vnu4jkuLrlpJrlrZdcbiAgICAndnVlL25vLXVudXNlZC1jb21wb25lbnRzJzogV0FSTiwgLy8g5pyq5L2/55So55qE57uE5Lu2XG4gICAgJ3Z1ZS9uby11bnVzZWQtdmFycyc6IE9GRiwgLy8g5pyq5L2/55So55qE5Y+Y6YePXG4gICAgJ3Z1ZS9yZXF1aXJlLXJlbmRlci1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmuLLmn5Plh73mlbDmgLvmmK/ov5Tlm57lgLxcbiAgICAndnVlL3JlcXVpcmUtdi1mb3Ita2V5JzogT0ZGLCAvLyB2LWZvcuS4reW/hemhu+S9v+eUqGtleVxuICAgICd2dWUvcmV0dXJuLWluLWNvbXB1dGVkLXByb3BlcnR5JzogV0FSTiwgLy8g5by65Yi26L+U5Zue6K+t5Y+l5a2Y5Zyo5LqO6K6h566X5bGe5oCn5LitXG4gICAgJ3Z1ZS92YWxpZC10ZW1wbGF0ZS1yb290JzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoTmqKHmnb/moLlcbiAgICAndnVlL3ZhbGlkLXYtZm9yJzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoR2LWZvcuaMh+S7pFxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9hdHRyaWJ1dGUtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOW8uuWItuWxnuaAp+WQjeagvOW8j1xuICAgICd2dWUvY29tcG9uZW50LWRlZmluaXRpb24tbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOW8uuWItue7hOS7tm5hbWXmoLzlvI9cbiAgICAndnVlL2h0bWwtcXVvdGVzJzogW1dBUk4sICdkb3VibGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUgfV0sIC8vIOW8uuWItiBIVE1MIOWxnuaAp+eahOW8leWPt+agt+W8j1xuICAgICd2dWUvaHRtbC1zZWxmLWNsb3NpbmcnOiBPRkYsIC8vIOS9v+eUqOiHqumXreWQiOagh+etvlxuICAgICd2dWUvbWF4LWF0dHJpYnV0ZXMtcGVyLWxpbmUnOiBbV0FSTiwgeyAnc2luZ2xlbGluZSc6IEluZmluaXR5LCAnbXVsdGlsaW5lJzogMSB9XSwgLy8g5by65Yi25q+P6KGM5YyF5ZCr55qE5pyA5aSn5bGe5oCn5pWwXG4gICAgJ3Z1ZS9tdWx0aWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5aSa6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS9wcm9wLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDkuLogVnVlIOe7hOS7tuS4reeahCBQcm9wIOWQjeensOW8uuWItuaJp+ihjOeJueWumuWkp+Wwj+WGmVxuICAgICd2dWUvcmVxdWlyZS1kZWZhdWx0LXByb3AnOiBPRkYsIC8vIHByb3Bz6ZyA6KaB6buY6K6k5YC8XG4gICAgJ3Z1ZS9zaW5nbGVsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWNleihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvdi1iaW5kLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LWJpbmTmjIfku6Tpo47moLxcbiAgICAndnVlL3Ytb24tc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtb27mjIfku6Tpo47moLxcbiAgICAndnVlL3Ytc2xvdC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1zbG905oyH5Luk6aOO5qC8XG4gICAgLy8gUHJpb3JpdHkgQzogUmVjb21tZW5kZWRcbiAgICAndnVlL25vLXYtaHRtbCc6IE9GRiwgLy8g56aB5q2i5L2/55Sodi1odG1sXG4gICAgLy8gVW5jYXRlZ29yaXplZFxuICAgICd2dWUvYmxvY2stdGFnLW5ld2xpbmUnOiBXQVJOLCAvLyAg5Zyo5omT5byA5Z2X57qn5qCH6K6w5LmL5ZCO5ZKM5YWz6Zet5Z2X57qn5qCH6K6w5LmL5YmN5by65Yi25o2i6KGMXG4gICAgJ3Z1ZS9odG1sLWNvbW1lbnQtY29udGVudC1zcGFjaW5nJzogV0FSTiwgLy8g5ZyoSFRNTOazqOmHiuS4reW8uuWItue7n+S4gOeahOepuuagvFxuICAgICd2dWUvc2NyaXB0LWluZGVudCc6IFtXQVJOLCAyLCB7ICdiYXNlSW5kZW50JzogMSwgJ3N3aXRjaENhc2UnOiAxIH1dLCAvLyDlnKg8c2NyaXB0PuS4reW8uuWItuS4gOiHtOeahOe8qei/m1xuICAgIC8vIEV4dGVuc2lvbiBSdWxlc+OAguWvueW6lGVzbGludOeahOWQjOWQjeinhOWIme+8jOmAgueUqOS6jjx0ZW1wbGF0ZT7kuK3nmoTooajovr7lvI9cbiAgICAndnVlL2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9ibG9jay1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSxcbiAgICAndnVlL2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLFxuICAgICd2dWUvY29tbWEtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9jb21tYS1zdHlsZSc6IFdBUk4sXG4gICAgJ3Z1ZS9mdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXktc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXl3b3JkLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLFxuICAgICd2dWUvc3BhY2UtaW4tcGFyZW5zJzogV0FSTixcbiAgICAndnVlL3NwYWNlLWluZml4LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS11bmFyeS1vcHMnOiBXQVJOLFxuICAgICd2dWUvYXJyb3ctc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9wcmVmZXItdGVtcGxhdGUnOiBXQVJOLFxuICB9LFxuICBvdmVycmlkZXM6IFtcbiAgICB7XG4gICAgICAnZmlsZXMnOiBbJyoudnVlJ10sXG4gICAgICAncnVsZXMnOiB7XG4gICAgICAgICdpbmRlbnQnOiBPRkYsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuLy8gdnVlMueUqFxuZXhwb3J0IGNvbnN0IHZ1ZTJDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUyIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3JlY29tbWVuZGVkJyxcbiAgXSxcbn0pO1xuLy8gdnVlM+eUqFxuZXhwb3J0IGNvbnN0IHZ1ZTNDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZW52OiB7XG4gICAgJ3Z1ZS9zZXR1cC1jb21waWxlci1tYWNyb3MnOiB0cnVlLCAvLyDlpITnkIZzZXR1cOaooeadv+S4reWDjyBkZWZpbmVQcm9wcyDlkowgZGVmaW5lRW1pdHMg6L+Z5qC355qE57yW6K+R5Zmo5a6P5oqlIG5vLXVuZGVmIOeahOmXrumimO+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy91c2VyLWd1aWRlLyNjb21waWxlci1tYWNyb3Mtc3VjaC1hcy1kZWZpbmVwcm9wcy1hbmQtZGVmaW5lZW1pdHMtZ2VuZXJhdGUtbm8tdW5kZWYtd2FybmluZ3NcbiAgfSxcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUzIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3Z1ZTMtcmVjb21tZW5kZWQnLFxuICBdLFxuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbm8tdGVtcGxhdGUta2V5JzogT0ZGLCAvLyDnpoHmraI8dGVtcGxhdGU+5Lit5L2/55Soa2V55bGe5oCnXG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXR1cm4taW4tZW1pdHMtdmFsaWRhdG9yJzogV0FSTiwgLy8g5by65Yi25ZyoZW1pdHPpqozor4HlmajkuK3lrZjlnKjov5Tlm57or63lj6VcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmVxdWlyZS1leHBsaWNpdC1lbWl0cyc6IE9GRiwgLy8g6ZyA6KaBZW1pdHPkuK3lrprkuYnpgInpobnnlKjkuo4kZW1pdCgpXG4gICAgJ3Z1ZS92LW9uLWV2ZW50LWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlnKjmqKHmnb/kuK3nmoToh6rlrprkuYnnu4Tku7bkuIrlvLrliLbmiafooYwgdi1vbiDkuovku7blkb3lkI3moLflvI9cbiAgfSxcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKC4uLm9iamVjdHMpIHtcbiAgY29uc3QgW3RhcmdldCwgLi4uc291cmNlc10gPSBvYmplY3RzO1xuICBjb25zdCByZXN1bHQgPSBEYXRhLmRlZXBDbG9uZSh0YXJnZXQpO1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc291cmNlKSkge1xuICAgICAgLy8g54m55q6K5a2X5q615aSE55CGXG4gICAgICBpZiAoa2V5ID09PSAncnVsZXMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsga2V5LCB2YWx1ZSwgJ3Jlc3VsdFtrZXldJzogcmVzdWx0W2tleV0gfSk7XG4gICAgICAgIC8vIOWIneWni+S4jeWtmOWcqOaXtui1i+m7mOiupOWAvOeUqOS6juWQiOW5tlxuICAgICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9O1xuICAgICAgICAvLyDlr7nlkITmnaHop4TliJnlpITnkIZcbiAgICAgICAgZm9yIChsZXQgW3J1bGVLZXksIHJ1bGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG4gICAgICAgICAgLy8g5bey5pyJ5YC857uf5LiA5oiQ5pWw57uE5aSE55CGXG4gICAgICAgICAgbGV0IHNvdXJjZVJ1bGVWYWx1ZSA9IHJlc3VsdFtrZXldW3J1bGVLZXldID8/IFtdO1xuICAgICAgICAgIGlmICghKHNvdXJjZVJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlID0gW3NvdXJjZVJ1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOimgeWQiOW5tueahOWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGlmICghKHJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgcnVsZVZhbHVlID0gW3J1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOe7n+S4gOagvOW8j+WQjui/m+ihjOaVsOe7hOW+queOr+aTjeS9nFxuICAgICAgICAgIGZvciAoY29uc3QgW3ZhbEluZGV4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHJ1bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIOWvueixoea3seWQiOW5tu+8jOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbCkgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gX09iamVjdC5kZWVwQXNzaWduKHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPz8ge30sIHZhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDotYvlgLzop4TliJnnu5PmnpxcbiAgICAgICAgICByZXN1bHRba2V5XVtydWxlS2V5XSA9IHNvdXJjZVJ1bGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWtl+auteagueaNruexu+Wei+WIpOaWreWkhOeQhlxuICAgICAgLy8g5pWw57uE77ya5ou85o6lXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAocmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyBbXSkucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5a+56LGh77ya5rex5ZCI5bm2XG4gICAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUodmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgX09iamVjdC5kZWVwQXNzaWduKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8ge30sIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIOS9v+eUqOWumuWItueahOmFjee9rlxuICogQHBhcmFtIHt977ya6YWN572u6aG5XG4gKiAgICAgICAgICBiYXNl77ya5L2/55So5Z+656GAZXNsaW505a6a5Yi277yM6buY6K6kIHRydWVcbiAqICAgICAgICAgIHZ1ZVZlcnNpb27vvJp2dWXniYjmnKzvvIzlvIDlkK/lkI7pnIDopoHlronoo4UgZXNsaW50LXBsdWdpbi12dWVcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZSh7IGJhc2UgPSB0cnVlLCB2dWVWZXJzaW9uIH0gPSB7fSkge1xuICBsZXQgcmVzdWx0ID0ge307XG4gIGlmIChiYXNlKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCBiYXNlQ29uZmlnKTtcbiAgfVxuICBpZiAodnVlVmVyc2lvbiA9PSAyKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUyQ29uZmlnKTtcbiAgfSBlbHNlIGlmICh2dWVWZXJzaW9uID09IDMpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTNDb25maWcpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICBiYXNlOiAnLi8nLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIC8vIOWIq+WQjVxuICAgIGFsaWFzOiB7XG4gICAgICAvLyAnQHJvb3QnOiByZXNvbHZlKF9fZGlybmFtZSksXG4gICAgICAvLyAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyDop4Tlrprop6blj5HorablkYrnmoQgY2h1bmsg5aSn5bCP44CC77yI5LulIGticyDkuLrljZXkvY3vvIlcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIgKiogMTAsXG4gICAgLy8g6Ieq5a6a5LmJ5bqV5bGC55qEIFJvbGx1cCDmiZPljIXphY3nva7jgIJcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8g5YWl5Y+j5paH5Lu25ZCNXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzL2VudHJ5LSR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOWdl+aWh+S7tuWQjVxuICAgICAgICBjaHVua0ZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDotYTmupDmlofku7blkI3vvIxjc3PjgIHlm77niYfnrYlcbiAgICAgICAgYXNzZXRGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLltleHRdYDtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iLCIvLyDor7fmsYLmlrnms5VcbmV4cG9ydCBjb25zdCBNRVRIT0RTID0gWydHRVQnLCAnSEVBRCcsICdQT1NUJywgJ1BVVCcsICdERUxFVEUnLCAnQ09OTkVDVCcsICdPUFRJT05TJywgJ1RSQUNFJywgJ1BBVENIJ107XG4vLyBodHRwIOeKtuaAgeeggVxuZXhwb3J0IGNvbnN0IFNUQVRVU0VTID0gW1xuICB7ICdzdGF0dXMnOiAxMDAsICdzdGF0dXNUZXh0JzogJ0NvbnRpbnVlJyB9LFxuICB7ICdzdGF0dXMnOiAxMDEsICdzdGF0dXNUZXh0JzogJ1N3aXRjaGluZyBQcm90b2NvbHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMiwgJ3N0YXR1c1RleHQnOiAnUHJvY2Vzc2luZycgfSxcbiAgeyAnc3RhdHVzJzogMTAzLCAnc3RhdHVzVGV4dCc6ICdFYXJseSBIaW50cycgfSxcbiAgeyAnc3RhdHVzJzogMjAwLCAnc3RhdHVzVGV4dCc6ICdPSycgfSxcbiAgeyAnc3RhdHVzJzogMjAxLCAnc3RhdHVzVGV4dCc6ICdDcmVhdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDIsICdzdGF0dXNUZXh0JzogJ0FjY2VwdGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMDMsICdzdGF0dXNUZXh0JzogJ05vbi1BdXRob3JpdGF0aXZlIEluZm9ybWF0aW9uJyB9LFxuICB7ICdzdGF0dXMnOiAyMDQsICdzdGF0dXNUZXh0JzogJ05vIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNSwgJ3N0YXR1c1RleHQnOiAnUmVzZXQgQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA2LCAnc3RhdHVzVGV4dCc6ICdQYXJ0aWFsIENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNywgJ3N0YXR1c1RleHQnOiAnTXVsdGktU3RhdHVzJyB9LFxuICB7ICdzdGF0dXMnOiAyMDgsICdzdGF0dXNUZXh0JzogJ0FscmVhZHkgUmVwb3J0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIyNiwgJ3N0YXR1c1RleHQnOiAnSU0gVXNlZCcgfSxcbiAgeyAnc3RhdHVzJzogMzAwLCAnc3RhdHVzVGV4dCc6ICdNdWx0aXBsZSBDaG9pY2VzJyB9LFxuICB7ICdzdGF0dXMnOiAzMDEsICdzdGF0dXNUZXh0JzogJ01vdmVkIFBlcm1hbmVudGx5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDIsICdzdGF0dXNUZXh0JzogJ0ZvdW5kJyB9LFxuICB7ICdzdGF0dXMnOiAzMDMsICdzdGF0dXNUZXh0JzogJ1NlZSBPdGhlcicgfSxcbiAgeyAnc3RhdHVzJzogMzA0LCAnc3RhdHVzVGV4dCc6ICdOb3QgTW9kaWZpZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNSwgJ3N0YXR1c1RleHQnOiAnVXNlIFByb3h5JyB9LFxuICB7ICdzdGF0dXMnOiAzMDcsICdzdGF0dXNUZXh0JzogJ1RlbXBvcmFyeSBSZWRpcmVjdCcgfSxcbiAgeyAnc3RhdHVzJzogMzA4LCAnc3RhdHVzVGV4dCc6ICdQZXJtYW5lbnQgUmVkaXJlY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMCwgJ3N0YXR1c1RleHQnOiAnQmFkIFJlcXVlc3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMSwgJ3N0YXR1c1RleHQnOiAnVW5hdXRob3JpemVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDIsICdzdGF0dXNUZXh0JzogJ1BheW1lbnQgUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMywgJ3N0YXR1c1RleHQnOiAnRm9yYmlkZGVuJyB9LFxuICB7ICdzdGF0dXMnOiA0MDQsICdzdGF0dXNUZXh0JzogJ05vdCBGb3VuZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA1LCAnc3RhdHVzVGV4dCc6ICdNZXRob2QgTm90IEFsbG93ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNiwgJ3N0YXR1c1RleHQnOiAnTm90IEFjY2VwdGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNywgJ3N0YXR1c1RleHQnOiAnUHJveHkgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwOCwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDksICdzdGF0dXNUZXh0JzogJ0NvbmZsaWN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MTAsICdzdGF0dXNUZXh0JzogJ0dvbmUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMSwgJ3N0YXR1c1RleHQnOiAnTGVuZ3RoIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTIsICdzdGF0dXNUZXh0JzogJ1ByZWNvbmRpdGlvbiBGYWlsZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMywgJ3N0YXR1c1RleHQnOiAnUGF5bG9hZCBUb28gTGFyZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNCwgJ3N0YXR1c1RleHQnOiAnVVJJIFRvbyBMb25nJyB9LFxuICB7ICdzdGF0dXMnOiA0MTUsICdzdGF0dXNUZXh0JzogJ1Vuc3VwcG9ydGVkIE1lZGlhIFR5cGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNiwgJ3N0YXR1c1RleHQnOiAnUmFuZ2UgTm90IFNhdGlzZmlhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTcsICdzdGF0dXNUZXh0JzogJ0V4cGVjdGF0aW9uIEZhaWxlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDE4LCAnc3RhdHVzVGV4dCc6ICdJXFwnbSBhIFRlYXBvdCcgfSxcbiAgeyAnc3RhdHVzJzogNDIxLCAnc3RhdHVzVGV4dCc6ICdNaXNkaXJlY3RlZCBSZXF1ZXN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MjIsICdzdGF0dXNUZXh0JzogJ1VucHJvY2Vzc2FibGUgRW50aXR5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjMsICdzdGF0dXNUZXh0JzogJ0xvY2tlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI0LCAnc3RhdHVzVGV4dCc6ICdGYWlsZWQgRGVwZW5kZW5jeScgfSxcbiAgeyAnc3RhdHVzJzogNDI1LCAnc3RhdHVzVGV4dCc6ICdUb28gRWFybHknIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNiwgJ3N0YXR1c1RleHQnOiAnVXBncmFkZSBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI4LCAnc3RhdHVzVGV4dCc6ICdQcmVjb25kaXRpb24gUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyOSwgJ3N0YXR1c1RleHQnOiAnVG9vIE1hbnkgUmVxdWVzdHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDQzMSwgJ3N0YXR1c1RleHQnOiAnUmVxdWVzdCBIZWFkZXIgRmllbGRzIFRvbyBMYXJnZScgfSxcbiAgeyAnc3RhdHVzJzogNDUxLCAnc3RhdHVzVGV4dCc6ICdVbmF2YWlsYWJsZSBGb3IgTGVnYWwgUmVhc29ucycgfSxcbiAgeyAnc3RhdHVzJzogNTAwLCAnc3RhdHVzVGV4dCc6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMSwgJ3N0YXR1c1RleHQnOiAnTm90IEltcGxlbWVudGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDIsICdzdGF0dXNUZXh0JzogJ0JhZCBHYXRld2F5JyB9LFxuICB7ICdzdGF0dXMnOiA1MDMsICdzdGF0dXNUZXh0JzogJ1NlcnZpY2UgVW5hdmFpbGFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNCwgJ3N0YXR1c1RleHQnOiAnR2F0ZXdheSBUaW1lb3V0JyB9LFxuICB7ICdzdGF0dXMnOiA1MDUsICdzdGF0dXNUZXh0JzogJ0hUVFAgVmVyc2lvbiBOb3QgU3VwcG9ydGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDYsICdzdGF0dXNUZXh0JzogJ1ZhcmlhbnQgQWxzbyBOZWdvdGlhdGVzJyB9LFxuICB7ICdzdGF0dXMnOiA1MDcsICdzdGF0dXNUZXh0JzogJ0luc3VmZmljaWVudCBTdG9yYWdlJyB9LFxuICB7ICdzdGF0dXMnOiA1MDgsICdzdGF0dXNUZXh0JzogJ0xvb3AgRGV0ZWN0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwOSwgJ3N0YXR1c1RleHQnOiAnQmFuZHdpZHRoIExpbWl0IEV4Y2VlZGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MTAsICdzdGF0dXNUZXh0JzogJ05vdCBFeHRlbmRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTExLCAnc3RhdHVzVGV4dCc6ICdOZXR3b3JrIEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyB9LFxuXTtcbiIsIi8vIOWJqui0tOadv1xuLyoqXG4gKiDlpI3liLbmlofmnKzml6flhpnms5XjgILlnKggY2xpcGJvYXJkIGFwaSDkuI3lj6/nlKjml7bku6Pmm79cbiAqIEBwYXJhbSB0ZXh0XG4gKiBAcmV0dXJucyB7UHJvbWlzZTxQcm9taXNlPHZvaWQ+fFByb21pc2U8bmV2ZXI+Pn1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gb2xkQ29weVRleHQodGV4dCkge1xuICAvLyDmlrDlu7rovpPlhaXmoYZcbiAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAvLyDotYvlgLxcbiAgdGV4dGFyZWEudmFsdWUgPSB0ZXh0O1xuICAvLyDmoLflvI/orr7nva5cbiAgT2JqZWN0LmFzc2lnbih0ZXh0YXJlYS5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgIHRvcDogMCxcbiAgICBjbGlwUGF0aDogJ2NpcmNsZSgwKScsXG4gIH0pO1xuICAvLyDliqDlhaXliLDpobXpnaJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGV4dGFyZWEpO1xuICAvLyDpgInkuK1cbiAgdGV4dGFyZWEuc2VsZWN0KCk7XG4gIC8vIOWkjeWItlxuICBjb25zdCBzdWNjZXNzID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgLy8g5LuO6aG16Z2i56e76ZmkXG4gIHRleHRhcmVhLnJlbW92ZSgpO1xuICByZXR1cm4gc3VjY2VzcyA/IFByb21pc2UucmVzb2x2ZSgpIDogUHJvbWlzZS5yZWplY3QoKTtcbn1cbmV4cG9ydCBjb25zdCBjbGlwYm9hcmQgPSB7XG4gIC8qKlxuICAgKiDlhpnlhaXmlofmnKwo5aSN5Yi2KVxuICAgKiBAcGFyYW0gdGV4dFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIGFzeW5jIHdyaXRlVGV4dCh0ZXh0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gYXdhaXQgb2xkQ29weVRleHQodGV4dCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICog6K+75Y+W5paH5pysKOeymOi0tClcbiAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHJlYWRUZXh0KCkge1xuICAgIHJldHVybiBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG4gIH0sXG59O1xuIiwiLyohIGpzLWNvb2tpZSB2My4wLjEgfCBNSVQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xuZnVuY3Rpb24gYXNzaWduICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXRcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXZhciAqL1xudmFyIGRlZmF1bHRDb252ZXJ0ZXIgPSB7XG4gIHJlYWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZVswXSA9PT0gJ1wiJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oJVtcXGRBLUZdezJ9KSsvZ2ksIGRlY29kZVVSSUNvbXBvbmVudClcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpLnJlcGxhY2UoXG4gICAgICAvJSgyWzM0NkJGXXwzW0FDLUZdfDQwfDVbQkRFXXw2MHw3W0JDRF0pL2csXG4gICAgICBkZWNvZGVVUklDb21wb25lbnRcbiAgICApXG4gIH1cbn07XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cblxuZnVuY3Rpb24gaW5pdCAoY29udmVydGVyLCBkZWZhdWx0QXR0cmlidXRlcykge1xuICBmdW5jdGlvbiBzZXQgKGtleSwgdmFsdWUsIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgYXR0cmlidXRlcyA9IGFzc2lnbih7fSwgZGVmYXVsdEF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuXG4gICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzLmV4cGlyZXMgPT09ICdudW1iZXInKSB7XG4gICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZTUpO1xuICAgIH1cbiAgICBpZiAoYXR0cmlidXRlcy5leHBpcmVzKSB7XG4gICAgICBhdHRyaWJ1dGVzLmV4cGlyZXMgPSBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKTtcbiAgICB9XG5cbiAgICBrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoa2V5KVxuICAgICAgLnJlcGxhY2UoLyUoMlszNDZCXXw1RXw2MHw3QykvZywgZGVjb2RlVVJJQ29tcG9uZW50KVxuICAgICAgLnJlcGxhY2UoL1soKV0vZywgZXNjYXBlKTtcblxuICAgIHZhciBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgPSAnJztcbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBzdHJpbmdpZmllZEF0dHJpYnV0ZXMgKz0gJzsgJyArIGF0dHJpYnV0ZU5hbWU7XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIENvbnNpZGVycyBSRkMgNjI2NSBzZWN0aW9uIDUuMjpcbiAgICAgIC8vIC4uLlxuICAgICAgLy8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuICAgICAgLy8gICAgIGNoYXJhY3RlcjpcbiAgICAgIC8vIENvbnN1bWUgdGhlIGNoYXJhY3RlcnMgb2YgdGhlIHVucGFyc2VkLWF0dHJpYnV0ZXMgdXAgdG8sXG4gICAgICAvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cbiAgICAgIC8vIC4uLlxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc9JyArIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0uc3BsaXQoJzsnKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGRvY3VtZW50LmNvb2tpZSA9XG4gICAgICBrZXkgKyAnPScgKyBjb252ZXJ0ZXIud3JpdGUodmFsdWUsIGtleSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gIH1cblxuICBmdW5jdGlvbiBnZXQgKGtleSkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IChhcmd1bWVudHMubGVuZ3RoICYmICFrZXkpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG4gICAgLy8gaW4gY2FzZSB0aGVyZSBhcmUgbm8gY29va2llcyBhdCBhbGwuXG4gICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcbiAgICB2YXIgamFyID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBmb3VuZEtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSk7XG4gICAgICAgIGphcltmb3VuZEtleV0gPSBjb252ZXJ0ZXIucmVhZCh2YWx1ZSwgZm91bmRLZXkpO1xuXG4gICAgICAgIGlmIChrZXkgPT09IGZvdW5kS2V5KSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICByZXR1cm4ga2V5ID8gamFyW2tleV0gOiBqYXJcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgIHtcbiAgICAgIHNldDogc2V0LFxuICAgICAgZ2V0OiBnZXQsXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIChrZXksIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgc2V0KFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBhc3NpZ24oe30sIGF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgIGV4cGlyZXM6IC0xXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmV0dXJuIGluaXQodGhpcy5jb252ZXJ0ZXIsIGFzc2lnbih7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSlcbiAgICAgIH0sXG4gICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgIHJldHVybiBpbml0KGFzc2lnbih7fSwgdGhpcy5jb252ZXJ0ZXIsIGNvbnZlcnRlciksIHRoaXMuYXR0cmlidXRlcylcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoZGVmYXVsdEF0dHJpYnV0ZXMpIH0sXG4gICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgfVxuICApXG59XG5cbnZhciBhcGkgPSBpbml0KGRlZmF1bHRDb252ZXJ0ZXIsIHsgcGF0aDogJy8nIH0pO1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuZXhwb3J0IGRlZmF1bHQgYXBpO1xuIiwiLy8gY29va2ll5pON5L2cXG5pbXBvcnQganNDb29raWUgZnJvbSAnanMtY29va2llJztcbi8vIOeUqOWIsOeahOW6k+S5n+WvvOWHuuS+v+S6juiHquihjOmAieeUqFxuZXhwb3J0IHsganNDb29raWUgfTtcblxuLy8g5ZCMIGpzLWNvb2tpZSDnmoTpgInpobnlkIjlubbmlrnlvI9cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNvdXJjZSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cbi8vIGNvb2tpZeWvueixoVxuZXhwb3J0IGNsYXNzIENvb2tpZSB7XG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhuVxuICAgKiAgICAgICAgICBjb252ZXJ0ZXIgIOWQjCBqcy1jb29raWVzIOeahCBjb252ZXJ0ZXJcbiAgICogICAgICAgICAgYXR0cmlidXRlcyDlkIwganMtY29va2llcyDnmoQgYXR0cmlidXRlc1xuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaLjgIJqcy1jb29raWUg5ZyoMy4w54mI5pysKGNvbW1pdDogNGI3OTI5MGI5OGQ3ZmJmMWFiNDkzYTdmOWUxNjE5NDE4YWMwMWU0NSkg56e76Zmk5LqG5a+5IGpzb24g55qE6Ieq5Yqo6L2s5o2i77yM6L+Z6YeM6buY6K6kIHRydWUg5Yqg5LiKXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAvLyDpgInpobnnu5PmnpxcbiAgICBjb25zdCB7IGNvbnZlcnRlciA9IHt9LCBhdHRyaWJ1dGVzID0ge30sIGpzb24gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAganNvbixcbiAgICAgIGF0dHJpYnV0ZXM6IGFzc2lnbih7fSwganNDb29raWUuYXR0cmlidXRlcywgYXR0cmlidXRlcyksXG4gICAgICBjb252ZXJ0ZXI6IGFzc2lnbih7fSwganNDb29raWUuY29udmVydGVyLCBjb252ZXJ0ZXIpLFxuICAgIH07XG4gICAgLy8g5aOw5piO5ZCE5bGe5oCn44CC55u05o6l5oiW5ZyoY29uc3RydWN0b3LkuK3ph43mlrDotYvlgLxcbiAgICAvLyDpu5jorqTpgInpobnnu5PmnpxcbiAgICB0aGlzLiRkZWZhdWx0cyA9IG9wdGlvbnNSZXN1bHQ7XG4gIH1cbiAgJGRlZmF1bHRzO1xuICAvLyDlhpnlhaVcbiAgLyoqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcGFyYW0gYXR0cmlidXRlc1xuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2iXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgc2V0KG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpO1xuICAgIGlmIChqc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ganNDb29raWUuc2V0KG5hbWUsIHZhbHVlLCBhdHRyaWJ1dGVzKTtcbiAgfVxuICAvLyDor7vlj5ZcbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSBvcHRpb25zIOmFjee9rumhuVxuICAgKiAgICAgICAgICBqc29uIOaYr+WQpui/m+ihjGpzb27ovazmjaJcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXQobmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBsZXQgcmVzdWx0ID0ganNDb29raWUuZ2V0KG5hbWUpO1xuICAgIGlmIChqc29uKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDnp7vpmaRcbiAgcmVtb3ZlKG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4ganNDb29raWUucmVtb3ZlKG5hbWUsIGF0dHJpYnV0ZXMpO1xuICB9XG4gIC8vIOWIm+W7uuOAgumAmui/h+mFjee9rum7mOiupOWPguaVsOWIm+W7uuaWsOWvueixoe+8jOeugOWMluS8oOWPglxuICBjcmVhdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9uc1Jlc3VsdCA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBhdHRyaWJ1dGVzOiBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIG9wdGlvbnMuYXR0cmlidXRlcyksXG4gICAgICBjb252ZXJ0ZXI6IGFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMuYXR0cmlidXRlcywgb3B0aW9ucy5jb252ZXJ0ZXIpLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBDb29raWUob3B0aW9uc1Jlc3VsdCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBjb29raWUgPSBuZXcgQ29va2llKHtcbiAganNvbjogdHJ1ZSxcbn0pO1xuIiwiZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZSAtIGZpbGUgc2l6ZSBoYWNrc1xuICAgICAgICByZXF1ZXN0Lm9uY29tcGxldGUgPSByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUocmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gZmlsZSBzaXplIGhhY2tzXG4gICAgICAgIHJlcXVlc3Qub25hYm9ydCA9IHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlKGRiTmFtZSwgc3RvcmVOYW1lKSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSk7XG4gICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiByZXF1ZXN0LnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICAgIGNvbnN0IGRicCA9IHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCk7XG4gICAgcmV0dXJuICh0eE1vZGUsIGNhbGxiYWNrKSA9PiBkYnAudGhlbigoZGIpID0+IGNhbGxiYWNrKGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgdHhNb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpKSk7XG59XG5sZXQgZGVmYXVsdEdldFN0b3JlRnVuYztcbmZ1bmN0aW9uIGRlZmF1bHRHZXRTdG9yZSgpIHtcbiAgICBpZiAoIWRlZmF1bHRHZXRTdG9yZUZ1bmMpIHtcbiAgICAgICAgZGVmYXVsdEdldFN0b3JlRnVuYyA9IGNyZWF0ZVN0b3JlKCdrZXl2YWwtc3RvcmUnLCAna2V5dmFsJyk7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0R2V0U3RvcmVGdW5jO1xufVxuLyoqXG4gKiBHZXQgYSB2YWx1ZSBieSBpdHMga2V5LlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBnZXQoa2V5LCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXQoa2V5KSkpO1xufVxuLyoqXG4gKiBTZXQgYSB2YWx1ZSB3aXRoIGEga2V5LlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgc3RvcmUucHV0KHZhbHVlLCBrZXkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIFNldCBtdWx0aXBsZSB2YWx1ZXMgYXQgb25jZS4gVGhpcyBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIHNldCgpIG11bHRpcGxlIHRpbWVzLlxuICogSXQncyBhbHNvIGF0b21pYyDigJMgaWYgb25lIG9mIHRoZSBwYWlycyBjYW4ndCBiZSBhZGRlZCwgbm9uZSB3aWxsIGJlIGFkZGVkLlxuICpcbiAqIEBwYXJhbSBlbnRyaWVzIEFycmF5IG9mIGVudHJpZXMsIHdoZXJlIGVhY2ggZW50cnkgaXMgYW4gYXJyYXkgb2YgYFtrZXksIHZhbHVlXWAuXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gc2V0TWFueShlbnRyaWVzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4gc3RvcmUucHV0KGVudHJ5WzFdLCBlbnRyeVswXSkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIEdldCBtdWx0aXBsZSB2YWx1ZXMgYnkgdGhlaXIga2V5c1xuICpcbiAqIEBwYXJhbSBrZXlzXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFueShrZXlzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gUHJvbWlzZS5hbGwoa2V5cy5tYXAoKGtleSkgPT4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXQoa2V5KSkpKSk7XG59XG4vKipcbiAqIFVwZGF0ZSBhIHZhbHVlLiBUaGlzIGxldHMgeW91IHNlZSB0aGUgb2xkIHZhbHVlIGFuZCB1cGRhdGUgaXQgYXMgYW4gYXRvbWljIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gdXBkYXRlciBBIGNhbGxiYWNrIHRoYXQgdGFrZXMgdGhlIG9sZCB2YWx1ZSBhbmQgcmV0dXJucyBhIG5ldyB2YWx1ZS5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiB1cGRhdGUoa2V5LCB1cGRhdGVyLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IFxuICAgIC8vIE5lZWQgdG8gY3JlYXRlIHRoZSBwcm9taXNlIG1hbnVhbGx5LlxuICAgIC8vIElmIEkgdHJ5IHRvIGNoYWluIHByb21pc2VzLCB0aGUgdHJhbnNhY3Rpb24gY2xvc2VzIGluIGJyb3dzZXJzXG4gICAgLy8gdGhhdCB1c2UgYSBwcm9taXNlIHBvbHlmaWxsIChJRTEwLzExKS5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHN0b3JlLmdldChrZXkpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3RvcmUucHV0KHVwZGF0ZXIodGhpcy5yZXN1bHQpLCBrZXkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKTtcbn1cbi8qKlxuICogRGVsZXRlIGEgcGFydGljdWxhciBrZXkgZnJvbSB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGRlbChrZXksIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBzdG9yZS5kZWxldGUoa2V5KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBEZWxldGUgbXVsdGlwbGUga2V5cyBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSBrZXlzIExpc3Qgb2Yga2V5cyB0byBkZWxldGUuXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZGVsTWFueShrZXlzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHN0b3JlLmRlbGV0ZShrZXkpKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDbGVhciBhbGwgdmFsdWVzIGluIHRoZSBzdG9yZS5cbiAqXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gY2xlYXIoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZHdyaXRlJywgKHN0b3JlKSA9PiB7XG4gICAgICAgIHN0b3JlLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGVhY2hDdXJzb3Ioc3RvcmUsIGNhbGxiYWNrKSB7XG4gICAgc3RvcmUub3BlbkN1cnNvcigpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlc3VsdClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5yZXN1bHQpO1xuICAgICAgICB0aGlzLnJlc3VsdC5jb250aW51ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xufVxuLyoqXG4gKiBHZXQgYWxsIGtleXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBrZXlzKGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiB7XG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGlmIChzdG9yZS5nZXRBbGxLZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGxLZXlzKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgIHJldHVybiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKGN1cnNvci5rZXkpKS50aGVuKCgpID0+IGl0ZW1zKTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IGFsbCB2YWx1ZXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiB2YWx1ZXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgIHJldHVybiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSkpLnRoZW4oKCkgPT4gaXRlbXMpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBHZXQgYWxsIGVudHJpZXMgaW4gdGhlIHN0b3JlLiBFYWNoIGVudHJ5IGlzIGFuIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBlbnRyaWVzKGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiB7XG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIC8vIChhbHRob3VnaCwgaG9wZWZ1bGx5IHdlJ2xsIGdldCBhIHNpbXBsZXIgcGF0aCBzb21lIGRheSlcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbCAmJiBzdG9yZS5nZXRBbGxLZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsS2V5cygpKSxcbiAgICAgICAgICAgICAgICBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldEFsbCgpKSxcbiAgICAgICAgICAgIF0pLnRoZW4oKFtrZXlzLCB2YWx1ZXNdKSA9PiBrZXlzLm1hcCgoa2V5LCBpKSA9PiBba2V5LCB2YWx1ZXNbaV1dKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gZWFjaEN1cnNvcihzdG9yZSwgKGN1cnNvcikgPT4gaXRlbXMucHVzaChbY3Vyc29yLmtleSwgY3Vyc29yLnZhbHVlXSkpLnRoZW4oKCkgPT4gaXRlbXMpKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgY2xlYXIsIGNyZWF0ZVN0b3JlLCBkZWwsIGRlbE1hbnksIGVudHJpZXMsIGdldCwgZ2V0TWFueSwga2V5cywgcHJvbWlzaWZ5UmVxdWVzdCwgc2V0LCBzZXRNYW55LCB1cGRhdGUsIHZhbHVlcyB9O1xuIiwiZXhwb3J0IGNsYXNzIF9TdG9yYWdlIHtcbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqICAgICAgICAgIHN0b3JhZ2Ug5a+55bqU55qEc3RvcmFnZeWvueixoeOAgmxvY2FsU3RvcmFnZSDmiJYgc2Vzc2lvblN0b3JhZ2VcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2i44CCXG4gICAqIEByZXR1cm5zIHt2b2lkfCp9XG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGZyb20sIGpzb24gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZnJvbSxcbiAgICAgIGpzb24sXG4gICAgfTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgIC8vIOm7mOiupOmAiemhuee7k+aenFxuICAgICAgJGRlZmF1bHRzOiBvcHRpb25zUmVzdWx0LFxuICAgICAgLy8g5a+55bqU55qEc3RvcmFnZeWvueixoeOAglxuICAgICAgc3RvcmFnZTogZnJvbSxcbiAgICAgIC8vIOWOn+acieaWueazleOAgueUseS6jiBPYmplY3QuY3JlYXRlKGZyb20pIOaWueW8j+e7p+aJv+aXtuiwg+eUqOS8muaKpSBVbmNhdWdodCBUeXBlRXJyb3I6IElsbGVnYWwgaW52b2NhdGlvbu+8jOaUueaIkOWNleeLrOWKoOWFpeaWueW8j1xuICAgICAgc2V0SXRlbTogZnJvbS5zZXRJdGVtLmJpbmQoZnJvbSksXG4gICAgICBnZXRJdGVtOiBmcm9tLmdldEl0ZW0uYmluZChmcm9tKSxcbiAgICAgIHJlbW92ZUl0ZW06IGZyb20ucmVtb3ZlSXRlbS5iaW5kKGZyb20pLFxuICAgICAga2V5OiBmcm9tLmtleS5iaW5kKGZyb20pLFxuICAgICAgY2xlYXI6IGZyb20uY2xlYXIuYmluZChmcm9tKSxcbiAgICB9KTtcbiAgfVxuICAvLyDlo7DmmI7lkITlsZ7mgKfjgILnm7TmjqXmiJblnKhjb25zdHJ1Y3RvcuS4remHjeaWsOi1i+WAvFxuICAkZGVmYXVsdHM7XG4gIHN0b3JhZ2U7XG4gIHNldEl0ZW07XG4gIGdldEl0ZW07XG4gIHJlbW92ZUl0ZW07XG4gIGtleTtcbiAgY2xlYXI7XG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5sZW5ndGg7XG4gIH1cbiAgLy8g5Yik5pat5bGe5oCn5piv5ZCm5a2Y5Zyo44CC5ZCM5pe255So5LqO5ZyoIGdldCDkuK3lr7nkuI3lrZjlnKjnmoTlsZ7mgKfov5Tlm54gdW5kZWZpbmVkXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zdG9yYWdlKS5pbmNsdWRlcyhrZXkpO1xuICB9XG4gIC8vIOWGmeWFpVxuICBzZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBpZiAoanNvbikge1xuICAgICAgLy8g5aSE55CG5a2YIHVuZGVmaW5lZCDnmoTmg4XlhrXvvIzms6jmhI/lr7nosaHkuK3nmoTmmL7lvI8gdW5kZWZpbmVkIOeahOWxnuaAp+S8muiiqyBqc29uIOW6j+WIl+WMluenu+mZpFxuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICB9XG4gIC8vIOivu+WPllxuICBnZXQoa2V5LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIC8vIOWkhOeQhuaXoOWxnuaAp+eahOeahOaDheWGtei/lOWbniB1bmRlZmluZWRcbiAgICBpZiAoanNvbiAmJiAhdGhpcy5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8g5YW25LuW5YC85Yik5pat6L+U5ZueXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgaWYgKGpzb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOenu+mZpFxuICByZW1vdmUoa2V5KSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gIH1cbiAgLy8g5Yib5bu644CC6YCa6L+H6YWN572u6buY6K6k5Y+C5pWw5Yib5bu65paw5a+56LGh77yM566A5YyW5Lyg5Y+CXG4gIGNyZWF0ZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zUmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgX1N0b3JhZ2Uob3B0aW9uc1Jlc3VsdCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBfbG9jYWxTdG9yYWdlID0gbmV3IF9TdG9yYWdlKHsgZnJvbTogbG9jYWxTdG9yYWdlIH0pO1xuZXhwb3J0IGNvbnN0IF9zZXNzaW9uU3RvcmFnZSA9IG5ldyBfU3RvcmFnZSh7IGZyb206IHNlc3Npb25TdG9yYWdlIH0pO1xuIl0sIm5hbWVzIjpbImJhc2VDb25maWciLCJhc3NpZ24iLCJqc0Nvb2tpZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQU8sTUFBTSxPQUFPLEdBQUc7RUFDdkI7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRTtFQUM5QixJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzlELEdBQUc7RUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VB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QUMsRUFBRTtFQUMxQztFQUNBLFVBQVUsSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFO0VBQzdCLFlBQVksTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUN4RCxZQUFZLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDNUMsWUFBWSxPQUFPO0VBQ25CLFdBQVc7RUFDWDtFQUNBLFVBQVUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUU7RUFDOUIsVUFBVSxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7RUFDOUcsU0FBUztFQUNUO0VBQ0EsUUFBUSxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUU7RUFDM0IsVUFBVSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3JDLFNBQVM7RUFDVCxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0VBQ25CLEtBQUs7RUFDTDtFQUNBLElBQUksT0FBTyxNQUFNLENBQUM7RUFDbEIsR0FBRztFQUNIO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO0VBQzVEO0VBQ0EsSUFBSSxLQUFLLEdBQUcsQ0FBQyxNQUFNO0VBQ25CLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNO0VBQ3pCLFFBQVEsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO0VBQ3BDLFVBQVUs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
