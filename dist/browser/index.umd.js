/*!
 * hp-shared v0.2.0
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"name":"shared","format":"umd","noConflict":true}
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
    // 环境
    env: {
      browser: true,
      node: true,
      commonjs: true,
      es2022: true,
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
