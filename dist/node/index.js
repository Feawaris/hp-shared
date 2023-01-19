/*!
 * hp-shared v0.2.0
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"cjs","sourcemap":"inline"}
 */
  
'use strict';

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

var index$3 = /*#__PURE__*/Object.freeze({
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

const nodeClipboardy = require('node-clipboardy');

const clipboard = {
// 对应浏览器端同名方法，减少代码修改
  /**
   * 写入文本(复制)
   * @param text
   * @returns {Promise<void>}
   */
  async writeText(text) {
    // 转换成字符串防止 clipboardy 报类型错误
    const textResult = String(text);
    return await nodeClipboardy.write(textResult);
  },
  /**
   * 读取文本(粘贴)
   * @returns {Promise<string>}
   */
  async readText() {
    return await nodeClipboardy.read();
  },
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  clipboard: clipboard,
  nodeClipboardy: nodeClipboardy
});

exports.base = index$3;
exports.dev = index$2;
exports.network = index$1;
exports.storage = index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL19TdHJpbmcuanMiLCIuLi8uLi9zcmMvYmFzZS9jb25zdGFudHMuanMiLCIuLi8uLi9zcmMvYmFzZS9EYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX0RhdGUuanMiLCIuLi8uLi9zcmMvYmFzZS9fTWF0aC5qcyIsIi4uLy4uL3NyYy9iYXNlL19SZWZsZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1NldC5qcyIsIi4uLy4uL3NyYy9iYXNlL19PYmplY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9fUHJveHkuanMiLCIuLi8uLi9zcmMvYmFzZS9TdHlsZS5qcyIsIi4uLy4uL3NyYy9kZXYvZXNsaW50LmpzIiwiLi4vLi4vc3JjL2Rldi92aXRlLmpzIiwiLi4vLi4vc3JjL25ldHdvcmsvY29tbW9uLmpzIiwiLi4vLi4vc3JjL3N0b3JhZ2Uvbm9kZS9jbGlwYm9hcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IF9TdHJpbmcgPSB7XG4gIC8qKlxuICAgKiDpppblrZfmr43lpKflhplcbiAgICogQHBhcmFtIG5hbWUge3N0cmluZ31cbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHRvRmlyc3RVcHBlckNhc2UobmFtZSA9ICcnKSB7XG4gICAgcmV0dXJuIGAkeyhuYW1lWzBdID8/ICcnKS50b1VwcGVyQ2FzZSgpfSR7bmFtZS5zbGljZSgxKX1gO1xuICB9LFxuICAvKipcbiAgICog6aaW5a2X5q+N5bCP5YaZXG4gICAqIEBwYXJhbSBuYW1lIHtzdHJpbmd9IOWQjeensFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgdG9GaXJzdExvd2VyQ2FzZShuYW1lID0gJycpIHtcbiAgICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvTG93ZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG4gIH0sXG4gIC8qKlxuICAgKiDovazpqbzls7Dlkb3lkI3jgILluLjnlKjkuo7ov57mjqXnrKblkb3lkI3ovazpqbzls7Dlkb3lkI3vvIzlpoIgeHgtbmFtZSAtPiB4eE5hbWVcbiAgICogQHBhcmFtIG5hbWUge3N0cmluZ30g5ZCN56ewXG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ige3N0cmluZ30g6L+e5o6l56ym44CC55So5LqO55Sf5oiQ5q2j5YiZIOm7mOiupOS4uuS4reWIkue6vyAtIOWvueW6lHJlZ2V4cOW+l+WIsCAvLShcXHcpL2dcbiAgICogQHBhcmFtIGZpcnN0IHtzdHJpbmcsYm9vbGVhbn0g6aaW5a2X5q+N5aSE55CG5pa55byP44CCdHJ1ZSDmiJYgJ3VwcGVyY2FzZSfvvJrovazmjaLmiJDlpKflhpk7XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSDmiJYgJ2xvd2VyY2FzZSfvvJrovazmjaLmiJDlsI/lhpk7XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmF3JyDmiJYg5YW25LuW5peg5pWI5YC877ya6buY6K6k5Y6f5qC36L+U5Zue77yM5LiN6L+b6KGM5aSE55CGO1xuICAgKiBAcmV0dXJucyB7TWFnaWNTdHJpbmd8c3RyaW5nfHN0cmluZ31cbiAgICovXG4gIHRvQ2FtZWxDYXNlKG5hbWUsIHsgc2VwYXJhdG9yID0gJy0nLCBmaXJzdCA9ICdyYXcnIH0gPSB7fSkge1xuICAgIC8vIOeUn+aIkOato+WImVxuICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoYCR7c2VwYXJhdG9yfShcXFxcdylgLCAnZycpO1xuICAgIC8vIOaLvOaOpeaIkOmpvOWzsFxuICAgIGNvbnN0IGNhbWVsTmFtZSA9IG5hbWUucmVwbGFjZUFsbChyZWdleHAsIChzdWJzdHIsICQxKSA9PiB7XG4gICAgICByZXR1cm4gJDEudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgICAvLyDpppblrZfmr43lpKflsI/lhpnmoLnmja7kvKDlj4LliKTmlq1cbiAgICBpZiAoW3RydWUsICd1cHBlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiBfU3RyaW5nLnRvRmlyc3RVcHBlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgaWYgKFtmYWxzZSwgJ2xvd2VyY2FzZSddLmluY2x1ZGVzKGZpcnN0KSkge1xuICAgICAgcmV0dXJuIF9TdHJpbmcudG9GaXJzdExvd2VyQ2FzZShjYW1lbE5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FtZWxOYW1lO1xuICB9LFxuICAvKipcbiAgICog6L2s6L+e5o6l56ym5ZG95ZCN44CC5bi455So5LqO6am85bOw5ZG95ZCN6L2s6L+e5o6l56ym5ZG95ZCN77yM5aaCIHh4TmFtZSAtPiB4eC1uYW1lXG4gICAqIEBwYXJhbSBuYW1lIHtzdHJpbmd9IOWQjeensFxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIHtzdHJpbmd9IOi/nuaOpeesplxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgdG9MaW5lQ2FzZShuYW1lID0gJycsIHsgc2VwYXJhdG9yID0gJy0nIH0gPSB7fSkge1xuICAgIHJldHVybiBuYW1lXG4gICAgICAvLyDmjInov57mjqXnrKbmi7zmjqVcbiAgICAgIC5yZXBsYWNlQWxsKC8oW2Etel0pKFtBLVpdKS9nLCBgJDEke3NlcGFyYXRvcn0kMmApXG4gICAgICAvLyDovazlsI/lhplcbiAgICAgIC50b0xvd2VyQ2FzZSgpO1xuICB9LFxufTtcbiIsIi8vIOW4uOmHj+OAguW4uOeUqOS6jum7mOiupOS8oOWPguetieWcuuaZr1xuLy8ganPov5DooYznjq/looNcbmV4cG9ydCBjb25zdCBKU19FTlYgPSAoZnVuY3Rpb24gZ2V0SnNFbnYoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWxUaGlzID09PSB3aW5kb3cpIHtcbiAgICByZXR1cm4gJ2Jyb3dzZXInO1xuICB9XG4gIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWxUaGlzID09PSBnbG9iYWwpIHtcbiAgICByZXR1cm4gJ25vZGUnO1xuICB9XG4gIHJldHVybiAnJztcbn0pKCk7XG4vLyDnqbrlh73mlbBcbmV4cG9ydCBmdW5jdGlvbiBOT09QKCkge31cbi8vIOi/lOWbniBmYWxzZVxuZXhwb3J0IGZ1bmN0aW9uIEZBTFNFKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG4vLyDov5Tlm54gdHJ1ZVxuZXhwb3J0IGZ1bmN0aW9uIFRSVUUoKSB7XG4gIHJldHVybiB0cnVlO1xufVxuLy8g5Y6f5qC36L+U5ZueXG5leHBvcnQgZnVuY3Rpb24gUkFXKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cbi8vIGNhdGNoIOWGheeahOmUmeivr+WOn+agt+aKm+WHuuWOu1xuZXhwb3J0IGZ1bmN0aW9uIFRIUk9XKGUpIHtcbiAgdGhyb3cgZTtcbn1cbiIsImltcG9ydCB7IF9TdHJpbmcgfSBmcm9tICcuL19TdHJpbmcnO1xuaW1wb3J0IHsgRkFMU0UsIFJBVyB9IGZyb20gJy4vY29uc3RhbnRzJztcbi8vIOWkhOeQhuWkmuagvOW8j+aVsOaNrueUqFxuZXhwb3J0IGNvbnN0IERhdGEgPSB7XG4gIC8vIOeugOWNleexu+Wei1xuICBTSU1QTEVfVFlQRVM6IFtudWxsLCB1bmRlZmluZWQsIE51bWJlciwgU3RyaW5nLCBCb29sZWFuLCBCaWdJbnQsIFN5bWJvbF0sXG4gIC8qKlxuICAgKiDojrflj5blgLznmoTlhbfkvZPnsbvlnotcbiAgICogQHBhcmFtIHZhbHVlIHsqfSDlgLxcbiAgICogQHJldHVybnMge09iamVjdENvbnN0cnVjdG9yfCp8RnVuY3Rpb259IOi/lOWbnuWvueW6lOaehOmAoOWHveaVsOOAgm51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gICAqL1xuICBnZXRFeGFjdFR5cGUodmFsdWUpIHtcbiAgICAvLyBudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICAgIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgICAvLyB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaHml7YgX19wcm90b19fIOS4uiBudWxsXG4gICAgY29uc3QgaXNPYmplY3RCeUNyZWF0ZU51bGwgPSBfX3Byb3RvX18gPT09IG51bGw7XG4gICAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0QnlDcmVhdGVOdWxsJywgX19wcm90b19fKTtcbiAgICAgIHJldHVybiBPYmplY3Q7XG4gICAgfVxuICAgIC8vIOWvueW6lOe7p+aJv+eahOWvueixoSBfX3Byb3RvX18g5rKh5pyJIGNvbnN0cnVjdG9yIOWxnuaAp1xuICAgIGNvbnN0IGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9ICEoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pO1xuICAgIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsJywgX19wcm90b19fKTtcbiAgICAgIHJldHVybiBPYmplY3Q7XG4gICAgfVxuICAgIC8vIOi/lOWbnuWvueW6lOaehOmAoOWHveaVsFxuICAgIHJldHVybiBfX3Byb3RvX18uY29uc3RydWN0b3I7XG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5blgLznmoTlhbfkvZPnsbvlnovliJfooahcbiAgICogQHBhcmFtIHZhbHVlIHsqfSDlgLxcbiAgICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gICAqL1xuICBnZXRFeGFjdFR5cGVzKHZhbHVlKSB7XG4gICAgLy8gbnVsbOOAgXVuZGVmaW5lZCDliKTmlq3lpITnkIZcbiAgICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICByZXR1cm4gW3ZhbHVlXTtcbiAgICB9XG4gICAgLy8g5omr5Y6f5Z6L6ZO+5b6X5Yiw5a+55bqU5p6E6YCg5Ye95pWwXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBsb29wID0gMDtcbiAgICBsZXQgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IGZhbHNlO1xuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ3doaWxlJywgbG9vcCwgX19wcm90b19fKTtcbiAgICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgICAgLy8g5LiA6L+b5p2lIF9fcHJvdG9fXyDlsLHmmK8gbnVsbCDor7TmmI4gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGhXG4gICAgICAgIGlmIChsb29wIDw9IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXykge1xuICAgICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgICB9XG4gICAgICBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX19wcm90b19fKTtcbiAgICAgIGxvb3ArKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLyoqXG4gICAqIOa3seaLt+i0neaVsOaNrlxuICAgKiBAcGFyYW0gc291cmNlIHsqfVxuICAgKiBAcmV0dXJucyB7TWFwPGFueSwgYW55PnxTZXQ8YW55Pnx7fXwqfCpbXX1cbiAgICovXG4gIGRlZXBDbG9uZShzb3VyY2UpIHtcbiAgICAvLyDmlbDnu4RcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZGVlcENsb25lKHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyBTZXRcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICBsZXQgcmVzdWx0ID0gbmV3IFNldCgpO1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICAgIHJlc3VsdC5hZGQodGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIE1hcFxuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2Ygc291cmNlLmVudHJpZXMoKSkge1xuICAgICAgICByZXN1bHQuc2V0KGtleSwgdGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIOWvueixoVxuICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShzb3VyY2UpID09PSBPYmplY3QpIHtcbiAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgIC8vIHZhbHVl5pa55byP77ya6YCS5b2S5aSE55CGXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcENsb25lKGRlc2MudmFsdWUpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGdldC9zZXQg5pa55byP77ya55u05o6l5a6a5LmJXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8g5YW25LuW77ya5Y6f5qC36L+U5ZueXG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfSxcbiAgLyoqXG4gICAqIOa3seino+WMheaVsOaNrlxuICAgKiBAcGFyYW0gZGF0YSB7Kn0g5YC8XG4gICAqIEBwYXJhbSBpc1dyYXAge2Z1bmN0aW9ufSDljIXoo4XmlbDmja7liKTmlq3lh73mlbDvvIzlpoJ2dWUz55qEaXNSZWblh73mlbBcbiAgICogQHBhcmFtIHVud3JhcCB7ZnVuY3Rpb259IOino+WMheaWueW8j+WHveaVsO+8jOWmgnZ1ZTPnmoR1bnJlZuWHveaVsFxuICAgKiBAcmV0dXJucyB7KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfCp8e1twOiBzdHJpbmddOiBhbnl9fHtbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fVxuICAgKi9cbiAgZGVlcFVud3JhcChkYXRhLCB7IGlzV3JhcCA9IEZBTFNFLCB1bndyYXAgPSBSQVcgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgaXNXcmFwLCB1bndyYXAgfTtcbiAgICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gICAgaWYgKGlzV3JhcChkYXRhKSkge1xuICAgICAgcmV0dXJuIERhdGEuZGVlcFVud3JhcCh1bndyYXAoZGF0YSksIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gZGF0YS5tYXAodmFsID0+IERhdGEuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpKTtcbiAgICB9XG4gICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKGRhdGEpID09PSBPYmplY3QpIHtcbiAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICAgIHJldHVybiBba2V5LCBEYXRhLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgICB9KSk7XG4gICAgfVxuICAgIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICAgIHJldHVybiBkYXRhO1xuICB9LFxufTtcbi8vIOWkhOeQhnZ1ZeaVsOaNrueUqFxuZXhwb3J0IGNvbnN0IFZ1ZURhdGEgPSB7XG4gIC8qKlxuICAgKiDmt7Hop6PljIV2dWUz5ZON5bqU5byP5a+56LGh5pWw5o2uXG4gICAqIEBwYXJhbSBkYXRhIHsqfVxuICAgKiBAcmV0dXJucyB7KCp8e1twOiBzdHJpbmddOiAqfSlbXXwqfHtbcDogc3RyaW5nXTogKn18e1twOiBzdHJpbmddOiAqfHtbcDogc3RyaW5nXTogKn19fVxuICAgKi9cbiAgZGVlcFVud3JhcFZ1ZTMoZGF0YSkge1xuICAgIHJldHVybiBEYXRhLmRlZXBVbndyYXAoZGF0YSwge1xuICAgICAgaXNXcmFwOiBkYXRhID0+IGRhdGE/Ll9fdl9pc1JlZixcbiAgICAgIHVud3JhcDogZGF0YSA9PiBkYXRhLnZhbHVlLFxuICAgIH0pO1xuICB9LFxuICAvKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcERlZmluaXRpb25zIHByb3BzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgZ2V0UHJvcHNGcm9tQXR0cnMoYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAgIC8vIHByb3BzIOWumuS5iee7n+S4gOaIkOWvueixoeagvOW8j++8jHR5cGUg57uf5LiA5oiQ5pWw57uE5qC85byP5Lul5L6/5ZCO57ut5Yik5patXG4gICAgaWYgKHByb3BEZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCB7IHR5cGU6IFtdIH1dKSk7XG4gICAgfSBlbHNlIGlmIChEYXRhLmdldEV4YWN0VHlwZShwcm9wRGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpLm1hcCgoW25hbWUsIGRlZmluaXRpb25dKSA9PiB7XG4gICAgICAgIGRlZmluaXRpb24gPSBEYXRhLmdldEV4YWN0VHlwZShkZWZpbml0aW9uKSA9PT0gT2JqZWN0XG4gICAgICAgICAgPyB7IC4uLmRlZmluaXRpb24sIHR5cGU6IFtkZWZpbml0aW9uLnR5cGVdLmZsYXQoKSB9XG4gICAgICAgICAgOiB7IHR5cGU6IFtkZWZpbml0aW9uXS5mbGF0KCkgfTtcbiAgICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBkZWZpbml0aW9uXTtcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcERlZmluaXRpb25zID0ge307XG4gICAgfVxuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBkZWZpbml0aW9uXSBvZiBPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpKSB7XG4gICAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgICAvLyBwcm9wTmFtZSDmiJYgcHJvcC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgLy8g5Y+q5YyF5ZCrQm9vbGVhbuexu+Wei+eahCcn6L2s5o2i5Li6dHJ1Ze+8jOWFtuS7luWOn+agt+i1i+WAvFxuICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gZGVmaW5pdGlvbi50eXBlLmxlbmd0aCA9PT0gMSAmJiBkZWZpbml0aW9uLnR5cGUuaW5jbHVkZXMoQm9vbGVhbikgJiYgYXR0clZhbHVlID09PSAnJyA/IHRydWUgOiBhdHRyVmFsdWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHByb3AtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgaWYgKGVuZCkgeyByZXR1cm47IH1cbiAgICAgICAgc2V0UmVzdWx0KHsgbmFtZTogX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpLCBkZWZpbml0aW9uLCBlbmQ6IHRydWUgfSk7XG4gICAgICB9KSh7XG4gICAgICAgIG5hbWUsIGRlZmluaXRpb24sXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgZW1pdHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIGVtaXREZWZpbml0aW9ucyBlbWl0cyDlrprkuYnvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIGdldEVtaXRzRnJvbUF0dHJzKGF0dHJzLCBlbWl0RGVmaW5pdGlvbnMpIHtcbiAgICAvLyBlbWl0cyDlrprkuYnnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUoZW1pdERlZmluaXRpb25zKSA9PT0gT2JqZWN0KSB7XG4gICAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoIShlbWl0RGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIGVtaXREZWZpbml0aW9ucyA9IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDlpITnkIbmiJAgb25FbWl0TmFtZeOAgW9uVXBkYXRlOmVtaXROYW1lKHYtbW9kZWzns7vliJcpIOagvOW8j1xuICAgIGNvbnN0IGVtaXROYW1lcyA9IGVtaXREZWZpbml0aW9ucy5tYXAobmFtZSA9PiBfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdvblVwZGF0ZTonKSkge1xuICAgICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICAgICAgaWYgKGVuZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UobmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpKX1gLCBlbmQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9KSh7IG5hbWUgfSk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIC8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+W5Ymp5L2Z5bGe5oCn44CC5bi455So5LqO57uE5Lu2aW5oZXJpdEF0dHJz6K6+572uZmFsc2Xml7bkvb/nlKjkvZzkuLrmlrDnmoRhdHRyc1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSB7fSDphY3nva7poblcbiAgICogICAgICAgICAgQHBhcmFtIHByb3BzIHByb3BzIOWumuS5iSDmiJYgdnVlIHByb3Bz77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICAgKiAgICAgICAgICBAcGFyYW0gZW1pdHMgZW1pdHMg5a6a5LmJIOaIliB2dWUgZW1pdHPvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqICAgICAgICAgIEBwYXJhbSBsaXN0IOmineWklueahOaZrumAmuWxnuaAp1xuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBnZXRSZXN0RnJvbUF0dHJzKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAgIC8vIOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIHByb3BzID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChwcm9wcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShwcm9wcykgPT09IE9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiBhcnIubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgICB9KSgpO1xuICAgIGVtaXRzID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChlbWl0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIGVtaXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShlbWl0cykgPT09IE9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiBhcnIubWFwKChuYW1lKSA9PiB7XG4gICAgICAgIC8vIHVwZGF0ZTplbWl0TmFtZSDmiJYgdXBkYXRlOmVtaXQtbmFtZSDmoLzlvI9cbiAgICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgICAgY29uc3QgcGFydE5hbWUgPSBuYW1lLnNsaWNlKG5hbWUuaW5kZXhPZignOicpICsgMSk7XG4gICAgICAgICAgcmV0dXJuIFtgb25VcGRhdGU6JHtfU3RyaW5nLnRvQ2FtZWxDYXNlKHBhcnROYW1lKX1gLCBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UocGFydE5hbWUpfWBdO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9uRW1pdE5hbWXmoLzlvI/vvIzkuK3liJLnur/moLzlvI/lt7Looqt2dWXovazmjaLkuI3nlKjph43lpI3lpITnkIZcbiAgICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCldO1xuICAgICAgfSkuZmxhdCgpO1xuICAgIH0pKCk7XG4gICAgbGlzdCA9ICgoKSA9PiB7XG4gICAgICBjb25zdCBhcnIgPSBEYXRhLmdldEV4YWN0VHlwZShsaXN0KSA9PT0gU3RyaW5nXG4gICAgICAgID8gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgIDogbGlzdCBpbnN0YW5jZW9mIEFycmF5ID8gbGlzdCA6IFtdO1xuICAgICAgcmV0dXJuIGFyci5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgICB9KSgpO1xuICAgIGNvbnN0IGxpc3RBbGwgPSBBcnJheS5mcm9tKG5ldyBTZXQoW3Byb3BzLCBlbWl0cywgbGlzdF0uZmxhdCgpKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ2xpc3RBbGwnLCBsaXN0QWxsKTtcbiAgICAvLyDorr7nva7lgLxcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBbbmFtZSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoYXR0cnMpKSkge1xuICAgICAgaWYgKCFsaXN0QWxsLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIG5hbWUsIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufTtcbiIsImltcG9ydCB7IERhdGEgfSBmcm9tICcuL0RhdGEnO1xuXG5leHBvcnQgY29uc3QgX0RhdGUgPSB7XG4gIC8qKlxuICAgKiDliJvlu7pEYXRl5a+56LGhXG4gICAqIEBwYXJhbSBhcmdzIHsqW119IOWkmuS4quWAvFxuICAgKiBAcmV0dXJucyB7RGF0ZX1cbiAgICovXG4gIGNyZWF0ZSguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICAgIGNvbnN0IHZhbHVlID0gYXJndW1lbnRzWzBdO1xuICAgICAgY29uc3QgdmFsdWVSZXN1bHQgPSBEYXRhLmdldEV4YWN0VHlwZSh2YWx1ZSkgPT09IFN0cmluZyA/IHZhbHVlLnJlcGxhY2VBbGwoJy0nLCAnLycpIDogdmFsdWU7XG4gICAgICByZXR1cm4gbmV3IERhdGUodmFsdWVSZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDkvKDlj4LooYzkuLrlhYjlkoxEYXRl5LiA6Ie077yM5ZCO57ut5YaN5pS26ZuG6ZyA5rGC5Yqg5by65a6a5Yi2KOazqOaEj+aXoOWPguWSjOaYvuW8j3VuZGVmaW5lZOeahOWMuuWIqylcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAwID8gbmV3IERhdGUoKSA6IG5ldyBEYXRlKC4uLmFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxufTtcbiIsImV4cG9ydCBjb25zdCBfTWF0aCA9IHtcbi8vIOWinuWKoOmDqOWIhuWRveWQjeS7peaOpei/keaVsOWtpuihqOi+vuaWueW8j1xuICBhcmNzaW46IE1hdGguYXNpbixcbiAgYXJjY29zOiBNYXRoLmFjb3MsXG4gIGFyY3RhbjogTWF0aC5hdGFuLFxuICBhcnNpbmg6IE1hdGguYXNpbmgsXG4gIGFyY29zaDogTWF0aC5hY29zaCxcbiAgYXJ0YW5oOiBNYXRoLmF0YW5oLFxuICBsb2dlOiBNYXRoLmxvZyxcbiAgbG46IE1hdGgubG9nLFxuICBsZzogTWF0aC5sb2cxMCxcbiAgbG9nKGEsIHgpIHtcbiAgICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZyhhKTtcbiAgfSxcbn07XG4iLCJleHBvcnQgY29uc3QgX1JlZmxlY3QgPSB7XG4gIC8vIOWvuSBvd25LZXlzIOmFjeWllyBvd25WYWx1ZXMg5ZKMIG93bkVudHJpZXNcbiAgb3duVmFsdWVzKHRhcmdldCkge1xuICAgIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IHRhcmdldFtrZXldKTtcbiAgfSxcbiAgb3duRW50cmllcyh0YXJnZXQpIHtcbiAgICByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCkubWFwKGtleSA9PiBba2V5LCB0YXJnZXRba2V5XV0pO1xuICB9LFxufTtcbiIsImV4cG9ydCBjb25zdCBfU2V0ID0ge1xuICAvKipcbiAgICog5Yqg5by6YWRk5pa55rOV44CC6Lef5pWw57uEcHVzaOaWueazleS4gOagt+WPr+a3u+WKoOWkmuS4quWAvFxuICAgKiBAcGFyYW0gc2V0IHtTZXR9IOebruagh3NldFxuICAgKiBAcGFyYW0gYXJncyB7KltdfSDlpJrkuKrlgLxcbiAgICovXG4gIGFkZChzZXQsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgICBzZXQuYWRkKGFyZyk7XG4gICAgfVxuICB9LFxufTtcbiIsImltcG9ydCB7IF9SZWZsZWN0IH0gZnJvbSAnLi9fUmVmbGVjdCc7XG5pbXBvcnQgeyBfU2V0IH0gZnJvbSAnLi9fU2V0JztcbmltcG9ydCB7IERhdGEgfSBmcm9tICcuL0RhdGEnO1xuXG4vKipcbiAqIOWxnuaAp+WQjee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICogQHBhcmFtIG5hbWVzIHtzdHJpbmd8U3ltYm9sfGFycmF5fSDlsZ7mgKflkI3jgILmoLzlvI8gJ2EsYixjJyDmiJYgWydhJywnYicsJ2MnXVxuICogQHBhcmFtIHNlcGFyYXRvciB7c3RyaW5nfFJlZ0V4cH0gbmFtZXMg5Li65a2X56ym5Liy5pe255qE5ouG5YiG6KeE5YiZ44CC5ZCMIHNwbGl0IOaWueazleeahCBzZXBhcmF0b3LvvIzlrZfnrKbkuLLml6DpnIDmi4bliIbnmoTlj6/ku6XkvKAgbnVsbCDmiJYgdW5kZWZpbmVkXG4gKiBAcmV0dXJucyB7KltdW118KE1hZ2ljU3RyaW5nIHwgQnVuZGxlIHwgc3RyaW5nKVtdfEZsYXRBcnJheTwoRmxhdEFycmF5PCgqfFsqW11dfFtdKVtdLCAxPltdfCp8WypbXV18W10pW10sIDE+W118KltdfVxuICovXG5mdW5jdGlvbiBuYW1lc1RvQXJyYXkobmFtZXMgPSBbXSwgeyBzZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSB7XG4gIGlmIChuYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIG5hbWVzLm1hcCh2YWwgPT4gbmFtZXNUb0FycmF5KHZhbCkpLmZsYXQoKTtcbiAgfVxuICBjb25zdCBleGFjdFR5cGUgPSBEYXRhLmdldEV4YWN0VHlwZShuYW1lcyk7XG4gIGlmIChleGFjdFR5cGUgPT09IFN0cmluZykge1xuICAgIHJldHVybiBuYW1lcy5zcGxpdChzZXBhcmF0b3IpLm1hcCh2YWwgPT4gdmFsLnRyaW0oKSkuZmlsdGVyKHZhbCA9PiB2YWwpO1xuICB9XG4gIGlmIChleGFjdFR5cGUgPT09IFN5bWJvbCkge1xuICAgIHJldHVybiBbbmFtZXNdO1xuICB9XG4gIHJldHVybiBbXTtcbn1cbi8vIGNvbnNvbGUubG9nKG5hbWVzVG9BcnJheShTeW1ib2woKSkpO1xuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KFsnYScsICdiJywgJ2MnLCBTeW1ib2woKV0pKTtcbi8vIGNvbnNvbGUubG9nKG5hbWVzVG9BcnJheSgnYSxiLGMnKSk7XG4vLyBjb25zb2xlLmxvZyhuYW1lc1RvQXJyYXkoWydhLGIsYycsIFN5bWJvbCgpXSkpO1xuZXhwb3J0IGNvbnN0IF9PYmplY3QgPSB7XG4gIC8qKlxuICAgKiDmtYXlkIjlubblr7nosaHjgILlhpnms5XlkIwgT2JqZWN0LmFzc2lnblxuICAgKiDpgJrov4fph43lrprkuYnmlrnlvI/lkIjlubbvvIzop6PlhrMgT2JqZWN0LmFzc2lnbiDlkIjlubbkuKTovrnlkIzlkI3lsZ7mgKfmt7fmnIkgdmFsdWXlhpnms5Ug5ZKMIGdldC9zZXTlhpnms5Ug5pe25oqlIFR5cGVFcnJvcjogQ2Fubm90IHNldCBwcm9wZXJ0eSBiIG9mICM8T2JqZWN0PiB3aGljaCBoYXMgb25seSBhIGdldHRlciDnmoTpl67pophcbiAgICogQHBhcmFtIHRhcmdldCB7b2JqZWN0fSDnm67moIflr7nosaFcbiAgICogQHBhcmFtIHNvdXJjZXMge2FueVtdfSDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBhc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICAvLyDkuI3kvb/nlKggdGFyZ2V0W2tleV09dmFsdWUg5YaZ5rOV77yM55u05o6l5L2/55SoZGVzY+mHjeWumuS5iVxuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9LFxuICAvKipcbiAgICog5rex5ZCI5bm25a+56LGh44CC5ZCMIGFzc2lnbiDkuIDmoLfkuZ/kvJrlr7nlsZ7mgKfov5vooYzph43lrprkuYlcbiAgICogQHBhcmFtIHRhcmdldCB7b2JqZWN0fSDnm67moIflr7nosaHjgILpu5jorqTlgLwge30g6Ziy5q2i6YCS5b2S5pe25oqlIFR5cGVFcnJvcjogT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0XG4gICAqIEBwYXJhbSBzb3VyY2VzIHthbnlbXX0g5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gICAqL1xuICBkZWVwQXNzaWduKHRhcmdldCA9IHt9LCAuLi5zb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgICAgLy8gdmFsdWXlhpnms5XvvJrlr7nosaHpgJLlvZLlpITnkIbvvIzlhbbku5bnm7TmjqXlrprkuYlcbiAgICAgICAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUoZGVzYy52YWx1ZSkgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCB7XG4gICAgICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmRlZXBBc3NpZ24odGFyZ2V0W2tleV0sIGRlc2MudmFsdWUpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGdldC9zZXTlhpnms5XvvJrnm7TmjqXlrprkuYlcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH0sXG4gIC8qKlxuICAgKiBrZXnoh6rouqvmiYDlsZ7nmoTlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAgICogQHBhcmFtIGtleSB7c3RyaW5nfFN5bWJvbH0g5bGe5oCn5ZCNXG4gICAqIEByZXR1cm5zIHsqfG51bGx9XG4gICAqL1xuICBvd25lcihvYmplY3QsIGtleSkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgaWYgKF9fcHJvdG9fXyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm93bmVyKF9fcHJvdG9fXywga2V5KTtcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPluWxnuaAp+aPj+i/sOWvueixoe+8jOebuOavlCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9y77yM6IO95ou/5Yiw57un5om/5bGe5oCn55qE5o+P6L+w5a+56LGhXG4gICAqIEBwYXJhbSBvYmplY3Qge29iamVjdH1cbiAgICogQHBhcmFtIGtleSB7c3RyaW5nfFN5bWJvbH1cbiAgICogQHJldHVybnMge1Byb3BlcnR5RGVzY3JpcHRvcn1cbiAgICovXG4gIGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpIHtcbiAgICBjb25zdCBmaW5kT2JqZWN0ID0gdGhpcy5vd25lcihvYmplY3QsIGtleSk7XG4gICAgaWYgKCFmaW5kT2JqZWN0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmaW5kT2JqZWN0LCBrZXkpO1xuICB9LFxuICAvKipcbiAgICog6I635Y+W5bGe5oCn5ZCN44CC6buY6K6k5Y+C5pWw6YWN572u5oiQ5ZCMIE9iamVjdC5rZXlzIOihjOS4ulxuICAgKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICAgKiBAcGFyYW0gc3ltYm9sIHtib29sZWFufSDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICAgKiBAcGFyYW0gbm90RW51bWVyYWJsZSB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gICAqIEBwYXJhbSBleHRlbmQge2Jvb2xlYW59IOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICAgKiBAcmV0dXJucyB7YW55W119XG4gICAqL1xuICBrZXlzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIC8vIHNldOeUqOS6jmtleeWOu+mHjVxuICAgIGxldCBzZXQgPSBuZXcgU2V0KCk7XG4gICAgLy8g6Ieq6Lqr5bGe5oCn562b6YCJXG4gICAgY29uc3QgZGVzY3MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3QpO1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgX1JlZmxlY3Qub3duRW50cmllcyhkZXNjcykpIHtcbiAgICAgIC8vIOW/veeVpXN5bWJvbOWxnuaAp+eahOaDheWGtVxuICAgICAgaWYgKCFzeW1ib2wgJiYgRGF0YS5nZXRFeGFjdFR5cGUoa2V5KSA9PT0gU3ltYm9sKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5b+955Wl5LiN5Y+v5YiX5Li+5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIW5vdEVudW1lcmFibGUgJiYgIWRlc2MuZW51bWVyYWJsZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWxnuaAp+WKoOWFpVxuICAgICAgc2V0LmFkZChrZXkpO1xuICAgIH1cbiAgICAvLyDnu6fmib/lsZ7mgKdcbiAgICBpZiAoZXh0ZW5kKSB7XG4gICAgICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICAgIGlmIChfX3Byb3RvX18gIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgcGFyZW50S2V5cyA9IHRoaXMua2V5cyhfX3Byb3RvX18sIG9wdGlvbnMpO1xuICAgICAgICBfU2V0LmFkZChzZXQsIC4uLnBhcmVudEtleXMpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyDov5Tlm57mlbDnu4RcbiAgICByZXR1cm4gQXJyYXkuZnJvbShzZXQpO1xuICB9LFxuICAvKipcbiAgICog5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3Jz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gICAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wge2Jvb2xlYW59IOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHtQcm9wZXJ0eURlc2NyaXB0b3JbXX1cbiAgICovXG4gIGRlc2NyaXB0b3JzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4ga2V5cy5tYXAoa2V5ID0+IHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSkpO1xuICB9LFxuICAvKipcbiAgICog5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3JFbnRyaWVz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gICAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wge2Jvb2xlYW59IOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHtbc3RyaW5nfFN5bWJvbCxQcm9wZXJ0eURlc2NyaXB0b3JdW119XG4gICAqL1xuICBkZXNjcmlwdG9yRW50cmllcyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgICBjb25zdCBrZXlzID0gdGhpcy5rZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGtleXMubWFwKGtleSA9PiBba2V5LCB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpXSk7XG4gIH0sXG4gIC8qKlxuICAgKiDpgInlj5blr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAgICogQHBhcmFtIHBpY2sge3N0cmluZ3xhcnJheX0g5oyR6YCJ5bGe5oCnXG4gICAqIEBwYXJhbSBvbWl0IHtzdHJpbmd8YXJyYXl9IOW/veeVpeWxnuaAp1xuICAgKiBAcGFyYW0gZW1wdHlQaWNrIHtzdHJpbmd9IHBpY2sg5Li656m65pe255qE5Y+W5YC844CCYWxsIOWFqOmDqGtlee+8jGVtcHR5IOepulxuICAgKiBAcGFyYW0gc2VwYXJhdG9yIHtzdHJpbmd8UmVnRXhwfSDlkIwgbmFtZXNUb0FycmF5IOeahCBzZXBhcmF0b3Ig5Y+C5pWwXG4gICAqIEBwYXJhbSBzeW1ib2wge2Jvb2xlYW59IOWQjCBrZXlzIOeahCBzeW1ib2wg5Y+C5pWwXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDlkIwga2V5cyDnmoQgbm90RW51bWVyYWJsZSDlj4LmlbBcbiAgICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5ZCMIGtleXMg55qEIGV4dGVuZCDlj4LmlbBcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgZmlsdGVyKG9iamVjdCwgeyBwaWNrID0gW10sIG9taXQgPSBbXSwgZW1wdHlQaWNrID0gJ2FsbCcsIHNlcGFyYXRvciA9ICcsJywgc3ltYm9sID0gdHJ1ZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSB0cnVlIH0gPSB7fSkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAvLyBwaWNr44CBb21pdCDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgICBwaWNrID0gbmFtZXNUb0FycmF5KHBpY2ssIHsgc2VwYXJhdG9yIH0pO1xuICAgIG9taXQgPSBuYW1lc1RvQXJyYXkob21pdCwgeyBzZXBhcmF0b3IgfSk7XG4gICAgbGV0IGtleXMgPSBbXTtcbiAgICAvLyBwaWNr5pyJ5YC855u05o6l5ou/77yM5Li656m65pe25qC55o2uIGVtcHR5UGljayDpu5jorqTmi7/nqbrmiJblhajpg6hrZXlcbiAgICBrZXlzID0gcGljay5sZW5ndGggPiAwIHx8IGVtcHR5UGljayA9PT0gJ2VtcHR5JyA/IHBpY2sgOiB0aGlzLmtleXMob2JqZWN0LCB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH0pO1xuICAgIC8vIG9taXTnrZvpgIlcbiAgICBrZXlzID0ga2V5cy5maWx0ZXIoa2V5ID0+ICFvbWl0LmluY2x1ZGVzKGtleSkpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIGNvbnN0IGRlc2MgPSB0aGlzLmRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuICAgICAgLy8g5bGe5oCn5LiN5a2Y5Zyo5a+86Ie0ZGVzY+W+l+WIsHVuZGVmaW5lZOaXtuS4jeiuvue9ruWAvFxuICAgICAgaWYgKGRlc2MpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLyoqXG4gICAqIOmAmui/h+aMkemAieaWueW8j+mAieWPluWvueixoeOAgmZpbHRlcueahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyB7c3RyaW5nfGFycmF5fSDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMge29iamVjdH0g6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgcGljayhvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBwaWNrOiBrZXlzLCBlbXB0eVBpY2s6ICdlbXB0eScsIC4uLm9wdGlvbnMgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiDpgJrov4fmjpLpmaTmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXLnmoTnroDlhpnmlrnlvI9cbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAgICogQHBhcmFtIGtleXMge3N0cmluZ3xhcnJheX0g5bGe5oCn5ZCN6ZuG5ZCIXG4gICAqIEBwYXJhbSBvcHRpb25zIHtvYmplY3R9IOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIG9taXQob2JqZWN0LCBrZXlzID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihvYmplY3QsIHsgb21pdDoga2V5cywgLi4ub3B0aW9ucyB9KTtcbiAgfSxcbn07XG4iLCJleHBvcnQgY29uc3QgX1Byb3h5ID0ge1xuICAvKipcbiAgICog57uR5a6adGhpc+OAguW4uOeUqOS6juino+aehOWHveaVsOaXtue7keWumnRoaXPpgb/lhY3miqXplJlcbiAgICogQHBhcmFtIHRhcmdldCB7b2JqZWN0fSDnm67moIflr7nosaFcbiAgICogQHBhcmFtIG9wdGlvbnMge29iamVjdH0g6YCJ6aG544CC5omp5bGV55SoXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgYmluZFRoaXModGFyZ2V0LCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFByb3h5KHRhcmdldCwge1xuICAgICAgZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBSZWZsZWN0LmdldCguLi5hcmd1bWVudHMpO1xuICAgICAgICAvLyDlh73mlbDnsbvlnovnu5Hlrpp0aGlzXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLmJpbmQodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyDlhbbku5blsZ7mgKfljp/moLfov5Tlm55cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfSxcbn07XG4iLCIvLyDlpITnkIbmoLflvI/nlKhcbmV4cG9ydCBjb25zdCBTdHlsZSA9IHtcbiAgLyoqXG4gICAqIOW4puWNleS9jeWtl+espuS4suOAguWvueaVsOWtl+aIluaVsOWtl+agvOW8j+eahOWtl+espuS4suiHquWKqOaLvOWNleS9je+8jOWFtuS7luWtl+espuS4suWOn+agt+i/lOWbnlxuICAgKiBAcGFyYW0gdmFsdWUge251bWJlcnxzdHJpbmd9IOWAvFxuICAgKiBAcGFyYW0gdW5pdCDljZXkvY3jgIJ2YWx1ZeayoeW4puWNleS9jeaXtuiHquWKqOaLvOaOpe+8jOWPr+S8oCBweC9lbS8lIOetiVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfHN0cmluZ31cbiAgICovXG4gIGdldFVuaXRTdHJpbmcodmFsdWUgPSAnJywgeyB1bml0ID0gJ3B4JyB9ID0ge30pIHtcbiAgICBpZiAodmFsdWUgPT09ICcnKSB7IHJldHVybiAnJzsgfVxuICAgIC8vIOazqOaEj++8mui/memHjOS9v+eUqCA9PSDliKTmlq3vvIzkuI3kvb/nlKggPT09XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPT0gdmFsdWUgPyBgJHt2YWx1ZX0ke3VuaXR9YCA6IFN0cmluZyh2YWx1ZSk7XG4gIH0sXG59O1xuIiwiLyoqXG4gKiBlc2xpbnQg6YWN572u77yaaHR0cDovL2VzbGludC5jbi9kb2NzL3J1bGVzL1xuICogZXNsaW50LXBsdWdpbi12dWUg6YWN572u77yaaHR0cHM6Ly9lc2xpbnQudnVlanMub3JnL3J1bGVzL1xuICovXG5pbXBvcnQgeyBfT2JqZWN0LCBEYXRhIH0gZnJvbSAnLi4vYmFzZSc7XG5cbi8qKlxuICog5a+85Ye65bi46YeP5L6/5o235L2/55SoXG4gKi9cbmV4cG9ydCBjb25zdCBPRkYgPSAnb2ZmJztcbmV4cG9ydCBjb25zdCBXQVJOID0gJ3dhcm4nO1xuZXhwb3J0IGNvbnN0IEVSUk9SID0gJ2Vycm9yJztcbi8qKlxuICog5a6a5Yi255qE6YWN572uXG4gKi9cbi8vIOWfuuehgOWumuWItlxuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSB7XG4gIC8vIOeOr+Wig1xuICBlbnY6IHtcbiAgICBicm93c2VyOiB0cnVlLFxuICAgIG5vZGU6IHRydWUsXG4gICAgY29tbW9uanM6IHRydWUsXG4gICAgZXMyMDIyOiB0cnVlLFxuICB9LFxuICAvLyDop6PmnpDlmahcbiAgcGFyc2VyT3B0aW9uczoge1xuICAgIGVjbWFWZXJzaW9uOiAnbGF0ZXN0JyxcbiAgICBzb3VyY2VUeXBlOiAnbW9kdWxlJyxcbiAgICBlY21hRmVhdHVyZXM6IHtcbiAgICAgIGpzeDogdHJ1ZSxcbiAgICAgIGV4cGVyaW1lbnRhbE9iamVjdFJlc3RTcHJlYWQ6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgLyoqXG4gICAqIOe7p+aJv1xuICAgKiDkvb/nlKhlc2xpbnTnmoTop4TliJnvvJplc2xpbnQ66YWN572u5ZCN56ewXG4gICAqIOS9v+eUqOaPkuS7tueahOmFjee9ru+8mnBsdWdpbjrljIXlkI3nroDlhpkv6YWN572u5ZCN56ewXG4gICAqL1xuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIGVzbGludCDmjqjojZDnmoTop4TliJlcbiAgICAnZXNsaW50OnJlY29tbWVuZGVkJyxcbiAgXSxcbiAgLy9cbiAgLyoqXG4gICAqIOinhOWImVxuICAgKiDmnaXoh6ogZXNsaW50IOeahOinhOWIme+8muinhOWImUlEIDogdmFsdWVcbiAgICog5p2l6Ieq5o+S5Lu255qE6KeE5YiZ77ya5YyF5ZCN566A5YaZL+inhOWImUlEIDogdmFsdWVcbiAgICovXG4gIHJ1bGVzOiB7XG4gICAgLyoqXG4gICAgICogUG9zc2libGUgRXJyb3JzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5LiOIEphdmFTY3JpcHQg5Luj56CB5Lit5Y+v6IO955qE6ZSZ6K+v5oiW6YC76L6R6ZSZ6K+v5pyJ5YWz77yaXG4gICAgICovXG4gICAgJ2dldHRlci1yZXR1cm4nOiBPRkYsIC8vIOW8uuWItiBnZXR0ZXIg5Ye95pWw5Lit5Ye6546wIHJldHVybiDor63lj6VcbiAgICAnbm8tY29uc3RhbnQtY29uZGl0aW9uJzogT0ZGLCAvLyDnpoHmraLlnKjmnaHku7bkuK3kvb/nlKjluLjph4/ooajovr7lvI9cbiAgICAnbm8tZW1wdHknOiBPRkYsIC8vIOemgeatouWHuueOsOepuuivreWPpeWdl1xuICAgICduby1leHRyYS1zZW1pJzogV0FSTiwgLy8g56aB5q2i5LiN5b+F6KaB55qE5YiG5Y+3XG4gICAgJ25vLWZ1bmMtYXNzaWduJzogT0ZGLCAvLyDnpoHmraLlr7kgZnVuY3Rpb24g5aOw5piO6YeN5paw6LWL5YC8XG4gICAgJ25vLXByb3RvdHlwZS1idWlsdGlucyc6IE9GRiwgLy8g56aB5q2i55u05o6l6LCD55SoIE9iamVjdC5wcm90b3R5cGVzIOeahOWGhee9ruWxnuaAp1xuICAgIC8qKlxuICAgICAqIEJlc3QgUHJhY3RpY2VzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5piv5YWz5LqO5pyA5L2z5a6e6Le155qE77yM5biu5Yqp5L2g6YG/5YWN5LiA5Lqb6Zeu6aKY77yaXG4gICAgICovXG4gICAgJ2FjY2Vzc29yLXBhaXJzJzogRVJST1IsIC8vIOW8uuWItiBnZXR0ZXIg5ZKMIHNldHRlciDlnKjlr7nosaHkuK3miJDlr7nlh7rnjrBcbiAgICAnYXJyYXktY2FsbGJhY2stcmV0dXJuJzogV0FSTiwgLy8g5by65Yi25pWw57uE5pa55rOV55qE5Zue6LCD5Ye95pWw5Lit5pyJIHJldHVybiDor63lj6VcbiAgICAnYmxvY2stc2NvcGVkLXZhcic6IEVSUk9SLCAvLyDlvLrliLbmiorlj5jph4/nmoTkvb/nlKjpmZDliLblnKjlhbblrprkuYnnmoTkvZznlKjln5/ojIPlm7TlhoVcbiAgICAnY3VybHknOiBXQVJOLCAvLyDlvLrliLbmiYDmnInmjqfliLbor63lj6Xkvb/nlKjkuIDoh7TnmoTmi6zlj7fpo47moLxcbiAgICAnbm8tZmFsbHRocm91Z2gnOiBXQVJOLCAvLyDnpoHmraIgY2FzZSDor63lj6XokL3nqbpcbiAgICAnbm8tZmxvYXRpbmctZGVjaW1hbCc6IEVSUk9SLCAvLyDnpoHmraLmlbDlrZflrZfpnaLph4/kuK3kvb/nlKjliY3lr7zlkozmnKvlsL7lsI/mlbDngrlcbiAgICAnbm8tbXVsdGktc3BhY2VzJzogV0FSTiwgLy8g56aB5q2i5L2/55So5aSa5Liq56m65qC8XG4gICAgJ25vLW5ldy13cmFwcGVycyc6IEVSUk9SLCAvLyDnpoHmraLlr7kgU3RyaW5n77yMTnVtYmVyIOWSjCBCb29sZWFuIOS9v+eUqCBuZXcg5pON5L2c56ymXG4gICAgJ25vLXByb3RvJzogRVJST1IsIC8vIOemgeeUqCBfX3Byb3RvX18g5bGe5oCnXG4gICAgJ25vLXJldHVybi1hc3NpZ24nOiBXQVJOLCAvLyDnpoHmraLlnKggcmV0dXJuIOivreWPpeS4reS9v+eUqOi1i+WAvOivreWPpVxuICAgICduby11c2VsZXNzLWVzY2FwZSc6IFdBUk4sIC8vIOemgeeUqOS4jeW/heimgeeahOi9rOS5ieWtl+esplxuICAgIC8qKlxuICAgICAqIFZhcmlhYmxlc1xuICAgICAqIOi/meS6m+inhOWImeS4juWPmOmHj+WjsOaYjuacieWFs++8mlxuICAgICAqL1xuICAgICduby11bmRlZi1pbml0JzogV0FSTiwgLy8g56aB5q2i5bCG5Y+Y6YeP5Yid5aeL5YyW5Li6IHVuZGVmaW5lZFxuICAgICduby11bnVzZWQtdmFycyc6IE9GRiwgLy8g56aB5q2i5Ye6546w5pyq5L2/55So6L+H55qE5Y+Y6YePXG4gICAgJ25vLXVzZS1iZWZvcmUtZGVmaW5lJzogW0VSUk9SLCB7ICdmdW5jdGlvbnMnOiBmYWxzZSwgJ2NsYXNzZXMnOiBmYWxzZSwgJ3ZhcmlhYmxlcyc6IGZhbHNlIH1dLCAvLyDnpoHmraLlnKjlj5jph4/lrprkuYnkuYvliY3kvb/nlKjlroPku6xcbiAgICAvKipcbiAgICAgKiBTdHlsaXN0aWMgSXNzdWVzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5piv5YWz5LqO6aOO5qC85oyH5Y2X55qE77yM6ICM5LiU5piv6Z2e5bi45Li76KeC55qE77yaXG4gICAgICovXG4gICAgJ2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdibG9jay1zcGFjaW5nJzogV0FSTiwgLy8g56aB5q2i5oiW5by65Yi25Zyo5Luj56CB5Z2X5Lit5byA5ous5Y+35YmN5ZKM6Zet5ous5Y+35ZCO5pyJ56m65qC8XG4gICAgJ2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSwgLy8g5by65Yi25Zyo5Luj56CB5Z2X5Lit5L2/55So5LiA6Ie055qE5aSn5ous5Y+36aOO5qC8XG4gICAgJ2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLCAvLyDopoHmsYLmiJbnpoHmraLmnKvlsL7pgJflj7dcbiAgICAnY29tbWEtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOmAl+WPt+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdjb21tYS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOmAl+WPt+mjjuagvFxuICAgICdjb21wdXRlZC1wcm9wZXJ0eS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6K6h566X55qE5bGe5oCn55qE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Z1bmMtY2FsbC1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5Ye95pWw5qCH6K+G56ym5ZKM5YW26LCD55So5LmL6Ze05pyJ56m65qC8XG4gICAgJ2Z1bmN0aW9uLXBhcmVuLW5ld2xpbmUnOiBXQVJOLCAvLyDlvLrliLblnKjlh73mlbDmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTmjaLooYxcbiAgICAnaW1wbGljaXQtYXJyb3ctbGluZWJyZWFrJzogV0FSTiwgLy8g5by65Yi26ZqQ5byP6L+U5Zue55qE566t5aS05Ye95pWw5L2T55qE5L2N572uXG4gICAgJ2luZGVudCc6IFtXQVJOLCAyLCB7ICdTd2l0Y2hDYXNlJzogMSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE57yp6L+bXG4gICAgJ2pzeC1xdW90ZXMnOiBXQVJOLCAvLyDlvLrliLblnKggSlNYIOWxnuaAp+S4reS4gOiHtOWcsOS9v+eUqOWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdrZXktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWvueixoeWtl+mdoumHj+eahOWxnuaAp+S4remUruWSjOWAvOS5i+mXtOS9v+eUqOS4gOiHtOeahOmXtOi3nVxuICAgICdrZXl3b3JkLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlhbPplK7lrZfliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbmV3LXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuaIluemgeatouiwg+eUqOaXoOWPguaehOmAoOWHveaVsOaXtuacieWchuaLrOWPt1xuICAgICduby1tdWx0aXBsZS1lbXB0eS1saW5lcyc6IFtXQVJOLCB7ICdtYXgnOiAxLCAnbWF4RU9GJzogMCwgJ21heEJPRic6IDAgfV0sIC8vIOemgeatouWHuueOsOWkmuihjOepuuihjFxuICAgICduby10cmFpbGluZy1zcGFjZXMnOiBXQVJOLCAvLyDnpoHnlKjooYzlsL7nqbrmoLxcbiAgICAnbm8td2hpdGVzcGFjZS1iZWZvcmUtcHJvcGVydHknOiBXQVJOLCAvLyDnpoHmraLlsZ7mgKfliY3mnInnqbrnmb1cbiAgICAnbm9uYmxvY2stc3RhdGVtZW50LWJvZHktcG9zaXRpb24nOiBXQVJOLCAvLyDlvLrliLbljZXkuKror63lj6XnmoTkvY3nva5cbiAgICAnb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLCAvLyDlvLrliLblpKfmi6zlj7flhoXmjaLooYznrKbnmoTkuIDoh7TmgKdcbiAgICAnb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLCAvLyDlvLrliLblnKjlpKfmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAncGFkZGVkLWJsb2Nrcyc6IFtXQVJOLCAnbmV2ZXInXSwgLy8g6KaB5rGC5oiW56aB5q2i5Z2X5YaF5aGr5YWFXG4gICAgJ3F1b3Rlcyc6IFtXQVJOLCAnc2luZ2xlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlLCAnYWxsb3dUZW1wbGF0ZUxpdGVyYWxzJzogdHJ1ZSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE5Y+N5Yu+5Y+344CB5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ3NlbWknOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLkvb/nlKjliIblj7fku6Pmm78gQVNJXG4gICAgJ3NlbWktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+S5i+WJjeWSjOS5i+WQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzZW1pLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25YiG5Y+355qE5L2N572uXG4gICAgJ3NwYWNlLWJlZm9yZS1ibG9ja3MnOiBXQVJOLCAvLyDlvLrliLblnKjlnZfkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtYmVmb3JlLWZ1bmN0aW9uLXBhcmVuJzogW1dBUk4sIHsgJ2Fub255bW91cyc6ICduZXZlcicsICduYW1lZCc6ICduZXZlcicsICdhc3luY0Fycm93JzogJ2Fsd2F5cycgfV0sIC8vIOW8uuWItuWcqCBmdW5jdGlvbueahOW3puaLrOWPt+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbi1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLblnKjlnIbmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW5maXgtb3BzJzogV0FSTiwgLy8g6KaB5rGC5pON5L2c56ym5ZGo5Zu05pyJ56m65qC8XG4gICAgJ3NwYWNlLXVuYXJ5LW9wcyc6IFdBUk4sIC8vIOW8uuWItuWcqOS4gOWFg+aTjeS9nOespuWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZWQtY29tbWVudCc6IFdBUk4sIC8vIOW8uuWItuWcqOazqOmHiuS4rSAvLyDmiJYgLyog5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3N3aXRjaC1jb2xvbi1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHN3aXRjaCDnmoTlhpLlj7flt6blj7PmnInnqbrmoLxcbiAgICAndGVtcGxhdGUtdGFnLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjmqKHmnb/moIforrDlkozlroPku6znmoTlrZfpnaLph4/kuYvpl7TnmoTnqbrmoLxcbiAgICAvKipcbiAgICAgKiBFQ01BU2NyaXB0IDZcbiAgICAgKiDov5nkupvop4TliJnlj6rkuI4gRVM2IOacieWFsywg5Y2z6YCa5bi45omA6K+055qEIEVTMjAxNe+8mlxuICAgICAqL1xuICAgICdhcnJvdy1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi2566t5aS05Ye95pWw55qE566t5aS05YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2dlbmVyYXRvci1zdGFyLXNwYWNpbmcnOiBbV0FSTiwgeyAnYmVmb3JlJzogZmFsc2UsICdhZnRlcic6IHRydWUsICdtZXRob2QnOiB7ICdiZWZvcmUnOiB0cnVlLCAnYWZ0ZXInOiBmYWxzZSB9IH1dLCAvLyDlvLrliLYgZ2VuZXJhdG9yIOWHveaVsOS4rSAqIOWPt+WRqOWbtOS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICduby11c2VsZXNzLXJlbmFtZSc6IFdBUk4sIC8vIOemgeatouWcqCBpbXBvcnQg5ZKMIGV4cG9ydCDlkozop6PmnoTotYvlgLzml7blsIblvJXnlKjph43lkb3lkI3kuLrnm7jlkIznmoTlkI3lrZdcbiAgICAncHJlZmVyLXRlbXBsYXRlJzogV0FSTiwgLy8g6KaB5rGC5L2/55So5qih5p2/5a2X6Z2i6YeP6ICM6Z2e5a2X56ym5Liy6L+e5o6lXG4gICAgJ3Jlc3Qtc3ByZWFkLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbliankvZnlkozmianlsZXov5DnrpfnrKblj4rlhbbooajovr7lvI/kuYvpl7TmnInnqbrmoLxcbiAgICAndGVtcGxhdGUtY3VybHktc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouaooeadv+Wtl+espuS4suS4reeahOW1jOWFpeihqOi+vuW8j+WRqOWbtOepuuagvOeahOS9v+eUqFxuICAgICd5aWVsZC1zdGFyLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKggeWllbGQqIOihqOi+vuW8j+S4rSAqIOWRqOWbtOS9v+eUqOepuuagvFxuICB9LFxuICAvLyDopobnm5ZcbiAgb3ZlcnJpZGVzOiBbXSxcbn07XG4vLyB2dWUyL3Z1ZTMg5YWx55SoXG5leHBvcnQgY29uc3QgdnVlQ29tbW9uQ29uZmlnID0ge1xuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbXVsdGktd29yZC1jb21wb25lbnQtbmFtZXMnOiBPRkYsIC8vIOimgeaxgue7hOS7tuWQjeensOWni+e7iOS4uuWkmuWtl1xuICAgICd2dWUvbm8tdW51c2VkLWNvbXBvbmVudHMnOiBXQVJOLCAvLyDmnKrkvb/nlKjnmoTnu4Tku7ZcbiAgICAndnVlL25vLXVudXNlZC12YXJzJzogT0ZGLCAvLyDmnKrkvb/nlKjnmoTlj5jph49cbiAgICAndnVlL3JlcXVpcmUtcmVuZGVyLXJldHVybic6IFdBUk4sIC8vIOW8uuWItua4suafk+WHveaVsOaAu+aYr+i/lOWbnuWAvFxuICAgICd2dWUvcmVxdWlyZS12LWZvci1rZXknOiBPRkYsIC8vIHYtZm9y5Lit5b+F6aG75L2/55Soa2V5XG4gICAgJ3Z1ZS9yZXR1cm4taW4tY29tcHV0ZWQtcHJvcGVydHknOiBXQVJOLCAvLyDlvLrliLbov5Tlm57or63lj6XlrZjlnKjkuo7orqHnrpflsZ7mgKfkuK1cbiAgICAndnVlL3ZhbGlkLXRlbXBsYXRlLXJvb3QnOiBPRkYsIC8vIOW8uuWItuacieaViOeahOaooeadv+aguVxuICAgICd2dWUvdmFsaWQtdi1mb3InOiBPRkYsIC8vIOW8uuWItuacieaViOeahHYtZm9y5oyH5LukXG4gICAgLy8gUHJpb3JpdHkgQjogU3Ryb25nbHkgUmVjb21tZW5kZWRcbiAgICAndnVlL2F0dHJpYnV0ZS1oeXBoZW5hdGlvbic6IE9GRiwgLy8g5by65Yi25bGe5oCn5ZCN5qC85byPXG4gICAgJ3Z1ZS9jb21wb25lbnQtZGVmaW5pdGlvbi1uYW1lLWNhc2luZyc6IE9GRiwgLy8g5by65Yi257uE5Lu2bmFtZeagvOW8j1xuICAgICd2dWUvaHRtbC1xdW90ZXMnOiBbV0FSTiwgJ2RvdWJsZScsIHsgJ2F2b2lkRXNjYXBlJzogdHJ1ZSB9XSwgLy8g5by65Yi2IEhUTUwg5bGe5oCn55qE5byV5Y+35qC35byPXG4gICAgJ3Z1ZS9odG1sLXNlbGYtY2xvc2luZyc6IE9GRiwgLy8g5L2/55So6Ieq6Zet5ZCI5qCH562+XG4gICAgJ3Z1ZS9tYXgtYXR0cmlidXRlcy1wZXItbGluZSc6IFtXQVJOLCB7ICdzaW5nbGVsaW5lJzogSW5maW5pdHksICdtdWx0aWxpbmUnOiAxIH1dLCAvLyDlvLrliLbmr4/ooYzljIXlkKvnmoTmnIDlpKflsZ7mgKfmlbBcbiAgICAndnVlL211bHRpbGluZS1odG1sLWVsZW1lbnQtY29udGVudC1uZXdsaW5lJzogT0ZGLCAvLyDpnIDopoHlnKjlpJrooYzlhYPntKDnmoTlhoXlrrnliY3lkI7mjaLooYxcbiAgICAndnVlL3Byb3AtbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOS4uiBWdWUg57uE5Lu25Lit55qEIFByb3Ag5ZCN56ew5by65Yi25omn6KGM54m55a6a5aSn5bCP5YaZXG4gICAgJ3Z1ZS9yZXF1aXJlLWRlZmF1bHQtcHJvcCc6IE9GRiwgLy8gcHJvcHPpnIDopoHpu5jorqTlgLxcbiAgICAndnVlL3NpbmdsZWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5Y2V6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS92LWJpbmQtc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtYmluZOaMh+S7pOmjjuagvFxuICAgICd2dWUvdi1vbi1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1vbuaMh+S7pOmjjuagvFxuICAgICd2dWUvdi1zbG90LXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LXNsb3TmjIfku6Tpo47moLxcbiAgICAvLyBQcmlvcml0eSBDOiBSZWNvbW1lbmRlZFxuICAgICd2dWUvbm8tdi1odG1sJzogT0ZGLCAvLyDnpoHmraLkvb/nlKh2LWh0bWxcbiAgICAvLyBVbmNhdGVnb3JpemVkXG4gICAgJ3Z1ZS9ibG9jay10YWctbmV3bGluZSc6IFdBUk4sIC8vICDlnKjmiZPlvIDlnZfnuqfmoIforrDkuYvlkI7lkozlhbPpl63lnZfnuqfmoIforrDkuYvliY3lvLrliLbmjaLooYxcbiAgICAndnVlL2h0bWwtY29tbWVudC1jb250ZW50LXNwYWNpbmcnOiBXQVJOLCAvLyDlnKhIVE1M5rOo6YeK5Lit5by65Yi257uf5LiA55qE56m65qC8XG4gICAgJ3Z1ZS9zY3JpcHQtaW5kZW50JzogW1dBUk4sIDIsIHsgJ2Jhc2VJbmRlbnQnOiAxLCAnc3dpdGNoQ2FzZSc6IDEgfV0sIC8vIOWcqDxzY3JpcHQ+5Lit5by65Yi25LiA6Ie055qE57yp6L+bXG4gICAgLy8gRXh0ZW5zaW9uIFJ1bGVz44CC5a+55bqUZXNsaW5055qE5ZCM5ZCN6KeE5YiZ77yM6YCC55So5LqOPHRlbXBsYXRlPuS4reeahOihqOi+vuW8j1xuICAgICd2dWUvYXJyYXktYnJhY2tldC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2Jsb2NrLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvYnJhY2Utc3R5bGUnOiBbV0FSTiwgJzF0YnMnLCB7ICdhbGxvd1NpbmdsZUxpbmUnOiB0cnVlIH1dLFxuICAgICd2dWUvY29tbWEtZGFuZ2xlJzogW1dBUk4sICdhbHdheXMtbXVsdGlsaW5lJ10sXG4gICAgJ3Z1ZS9jb21tYS1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2NvbW1hLXN0eWxlJzogV0FSTixcbiAgICAndnVlL2Z1bmMtY2FsbC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2tleS1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2tleXdvcmQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9vYmplY3QtY3VybHktbmV3bGluZSc6IFtXQVJOLCB7ICdtdWx0aWxpbmUnOiB0cnVlLCAnY29uc2lzdGVudCc6IHRydWUgfV0sXG4gICAgJ3Z1ZS9vYmplY3QtY3VybHktc3BhY2luZyc6IFtXQVJOLCAnYWx3YXlzJ10sXG4gICAgJ3Z1ZS9zcGFjZS1pbi1wYXJlbnMnOiBXQVJOLFxuICAgICd2dWUvc3BhY2UtaW5maXgtb3BzJzogV0FSTixcbiAgICAndnVlL3NwYWNlLXVuYXJ5LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9hcnJvdy1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sXG4gIH0sXG4gIG92ZXJyaWRlczogW1xuICAgIHtcbiAgICAgICdmaWxlcyc6IFsnKi52dWUnXSxcbiAgICAgICdydWxlcyc6IHtcbiAgICAgICAgJ2luZGVudCc6IE9GRixcbiAgICAgIH0sXG4gICAgfSxcbiAgXSxcbn07XG4vLyB2dWUy55SoXG5leHBvcnQgY29uc3QgdnVlMkNvbmZpZyA9IG1lcmdlKHZ1ZUNvbW1vbkNvbmZpZywge1xuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIHZ1ZTIg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ3BsdWdpbjp2dWUvcmVjb21tZW5kZWQnLFxuICBdLFxufSk7XG4vLyB2dWUz55SoXG5leHBvcnQgY29uc3QgdnVlM0NvbmZpZyA9IG1lcmdlKHZ1ZUNvbW1vbkNvbmZpZywge1xuICBlbnY6IHtcbiAgICAndnVlL3NldHVwLWNvbXBpbGVyLW1hY3Jvcyc6IHRydWUsIC8vIOWkhOeQhnNldHVw5qih5p2/5Lit5YOPIGRlZmluZVByb3BzIOWSjCBkZWZpbmVFbWl0cyDov5nmoLfnmoTnvJbor5Hlmajlro/miqUgbm8tdW5kZWYg55qE6Zeu6aKY77yaaHR0cHM6Ly9lc2xpbnQudnVlanMub3JnL3VzZXItZ3VpZGUvI2NvbXBpbGVyLW1hY3Jvcy1zdWNoLWFzLWRlZmluZXByb3BzLWFuZC1kZWZpbmVlbWl0cy1nZW5lcmF0ZS1uby11bmRlZi13YXJuaW5nc1xuICB9LFxuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIHZ1ZTMg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ3BsdWdpbjp2dWUvdnVlMy1yZWNvbW1lbmRlZCcsXG4gIF0sXG4gIHJ1bGVzOiB7XG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsXG4gICAgJ3Z1ZS9uby10ZW1wbGF0ZS1rZXknOiBPRkYsIC8vIOemgeatojx0ZW1wbGF0ZT7kuK3kvb/nlKhrZXnlsZ7mgKdcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWwgZm9yIFZ1ZS5qcyAzLnhcbiAgICAndnVlL3JldHVybi1pbi1lbWl0cy12YWxpZGF0b3InOiBXQVJOLCAvLyDlvLrliLblnKhlbWl0c+mqjOivgeWZqOS4reWtmOWcqOi/lOWbnuivreWPpVxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXF1aXJlLWV4cGxpY2l0LWVtaXRzJzogT0ZGLCAvLyDpnIDopoFlbWl0c+S4reWumuS5iemAiemhueeUqOS6jiRlbWl0KClcbiAgICAndnVlL3Ytb24tZXZlbnQtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOWcqOaooeadv+S4reeahOiHquWumuS5iee7hOS7tuS4iuW8uuWItuaJp+ihjCB2LW9uIOS6i+S7tuWRveWQjeagt+W8j1xuICB9LFxufSk7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UoLi4ub2JqZWN0cykge1xuICBjb25zdCBbdGFyZ2V0LCAuLi5zb3VyY2VzXSA9IG9iamVjdHM7XG4gIGNvbnN0IHJlc3VsdCA9IERhdGEuZGVlcENsb25lKHRhcmdldCk7XG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhzb3VyY2UpKSB7XG4gICAgICAvLyDnibnmrorlrZfmrrXlpITnkIZcbiAgICAgIGlmIChrZXkgPT09ICdydWxlcycpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coeyBrZXksIHZhbHVlLCAncmVzdWx0W2tleV0nOiByZXN1bHRba2V5XSB9KTtcbiAgICAgICAgLy8g5Yid5aeL5LiN5a2Y5Zyo5pe26LWL6buY6K6k5YC855So5LqO5ZCI5bm2XG4gICAgICAgIHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8ge307XG4gICAgICAgIC8vIOWvueWQhOadoeinhOWImeWkhOeQhlxuICAgICAgICBmb3IgKGxldCBbcnVsZUtleSwgcnVsZVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh2YWx1ZSkpIHtcbiAgICAgICAgICAvLyDlt7LmnInlgLznu5/kuIDmiJDmlbDnu4TlpITnkIZcbiAgICAgICAgICBsZXQgc291cmNlUnVsZVZhbHVlID0gcmVzdWx0W2tleV1bcnVsZUtleV0gPz8gW107XG4gICAgICAgICAgaWYgKCEoc291cmNlUnVsZVZhbHVlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWUgPSBbc291cmNlUnVsZVZhbHVlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g6KaB5ZCI5bm255qE5YC857uf5LiA5oiQ5pWw57uE5aSE55CGXG4gICAgICAgICAgaWYgKCEocnVsZVZhbHVlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICBydWxlVmFsdWUgPSBbcnVsZVZhbHVlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g57uf5LiA5qC85byP5ZCO6L+b6KGM5pWw57uE5b6q546v5pON5L2cXG4gICAgICAgICAgZm9yIChjb25zdCBbdmFsSW5kZXgsIHZhbF0gb2YgT2JqZWN0LmVudHJpZXMocnVsZVZhbHVlKSkge1xuICAgICAgICAgICAgLy8g5a+56LGh5rex5ZCI5bm277yM5YW25LuW55u05o6l6LWL5YC8XG4gICAgICAgICAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUodmFsKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPSBfT2JqZWN0LmRlZXBBc3NpZ24oc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA/PyB7fSwgdmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOi1i+WAvOinhOWImee7k+aenFxuICAgICAgICAgIHJlc3VsdFtrZXldW3J1bGVLZXldID0gc291cmNlUnVsZVZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5a2X5q615qC55o2u57G75Z6L5Yik5pat5aSE55CGXG4gICAgICAvLyDmlbDnu4TvvJrmi7zmjqVcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIChyZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IFtdKS5wdXNoKC4uLnZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blr7nosaHvvJrmt7HlkIjlubZcbiAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZSh2YWx1ZSkgPT09IE9iamVjdCkge1xuICAgICAgICBfT2JqZWN0LmRlZXBBc3NpZ24ocmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyB7fSwgdmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICog5L2/55So5a6a5Yi255qE6YWN572uXG4gKiBAcGFyYW0ge33vvJrphY3nva7poblcbiAqICAgICAgICAgIGJhc2XvvJrkvb/nlKjln7rnoYBlc2xpbnTlrprliLbvvIzpu5jorqQgdHJ1ZVxuICogICAgICAgICAgdnVlVmVyc2lvbu+8mnZ1ZeeJiOacrO+8jOW8gOWQr+WQjumcgOimgeWuieijhSBlc2xpbnQtcGx1Z2luLXZ1ZVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlKHsgYmFzZSA9IHRydWUsIHZ1ZVZlcnNpb24gfSA9IHt9KSB7XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgaWYgKGJhc2UpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIGJhc2VDb25maWcpO1xuICB9XG4gIGlmICh2dWVWZXJzaW9uID09IDIpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTJDb25maWcpO1xuICB9IGVsc2UgaWYgKHZ1ZVZlcnNpb24gPT0gMykge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgdnVlM0NvbmZpZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8vIOWfuuehgOWumuWItlxuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSB7XG4gIGJhc2U6ICcuLycsXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBmczoge1xuICAgICAgc3RyaWN0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgLy8g5Yir5ZCNXG4gICAgYWxpYXM6IHtcbiAgICAgIC8vICdAcm9vdCc6IHJlc29sdmUoX19kaXJuYW1lKSxcbiAgICAgIC8vICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIOinhOWumuinpuWPkeitpuWRiueahCBjaHVuayDlpKflsI/jgILvvIjku6Uga2JzIOS4uuWNleS9je+8iVxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMiAqKiAxMCxcbiAgICAvLyDoh6rlrprkuYnlupXlsYLnmoQgUm9sbHVwIOaJk+WMhemFjee9ruOAglxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyDlhaXlj6Pmlofku7blkI1cbiAgICAgICAgZW50cnlGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvZW50cnktJHtjaHVua0luZm8udHlwZX0tW25hbWVdLmpzYDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5Z2X5paH5Lu25ZCNXG4gICAgICAgIGNodW5rRmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOi1hOa6kOaWh+S7tuWQje+8jGNzc+OAgeWbvueJh+etiVxuICAgICAgICBhc3NldEZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uW2V4dF1gO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcbiIsIi8vIOivt+axguaWueazlVxuZXhwb3J0IGNvbnN0IE1FVEhPRFMgPSBbJ0dFVCcsICdIRUFEJywgJ1BPU1QnLCAnUFVUJywgJ0RFTEVURScsICdDT05ORUNUJywgJ09QVElPTlMnLCAnVFJBQ0UnLCAnUEFUQ0gnXTtcbi8vIGh0dHAg54q25oCB56CBXG5leHBvcnQgY29uc3QgU1RBVFVTRVMgPSBbXG4gIHsgJ3N0YXR1cyc6IDEwMCwgJ3N0YXR1c1RleHQnOiAnQ29udGludWUnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMSwgJ3N0YXR1c1RleHQnOiAnU3dpdGNoaW5nIFByb3RvY29scycgfSxcbiAgeyAnc3RhdHVzJzogMTAyLCAnc3RhdHVzVGV4dCc6ICdQcm9jZXNzaW5nJyB9LFxuICB7ICdzdGF0dXMnOiAxMDMsICdzdGF0dXNUZXh0JzogJ0Vhcmx5IEhpbnRzJyB9LFxuICB7ICdzdGF0dXMnOiAyMDAsICdzdGF0dXNUZXh0JzogJ09LJyB9LFxuICB7ICdzdGF0dXMnOiAyMDEsICdzdGF0dXNUZXh0JzogJ0NyZWF0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMiwgJ3N0YXR1c1RleHQnOiAnQWNjZXB0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMywgJ3N0YXR1c1RleHQnOiAnTm9uLUF1dGhvcml0YXRpdmUgSW5mb3JtYXRpb24nIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNCwgJ3N0YXR1c1RleHQnOiAnTm8gQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA1LCAnc3RhdHVzVGV4dCc6ICdSZXNldCBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDYsICdzdGF0dXNUZXh0JzogJ1BhcnRpYWwgQ29udGVudCcgfSxcbiAgeyAnc3RhdHVzJzogMjA3LCAnc3RhdHVzVGV4dCc6ICdNdWx0aS1TdGF0dXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwOCwgJ3N0YXR1c1RleHQnOiAnQWxyZWFkeSBSZXBvcnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjI2LCAnc3RhdHVzVGV4dCc6ICdJTSBVc2VkJyB9LFxuICB7ICdzdGF0dXMnOiAzMDAsICdzdGF0dXNUZXh0JzogJ011bHRpcGxlIENob2ljZXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMSwgJ3N0YXR1c1RleHQnOiAnTW92ZWQgUGVybWFuZW50bHknIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMiwgJ3N0YXR1c1RleHQnOiAnRm91bmQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMywgJ3N0YXR1c1RleHQnOiAnU2VlIE90aGVyJyB9LFxuICB7ICdzdGF0dXMnOiAzMDQsICdzdGF0dXNUZXh0JzogJ05vdCBNb2RpZmllZCcgfSxcbiAgeyAnc3RhdHVzJzogMzA1LCAnc3RhdHVzVGV4dCc6ICdVc2UgUHJveHknIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNywgJ3N0YXR1c1RleHQnOiAnVGVtcG9yYXJ5IFJlZGlyZWN0JyB9LFxuICB7ICdzdGF0dXMnOiAzMDgsICdzdGF0dXNUZXh0JzogJ1Blcm1hbmVudCBSZWRpcmVjdCcgfSxcbiAgeyAnc3RhdHVzJzogNDAwLCAnc3RhdHVzVGV4dCc6ICdCYWQgUmVxdWVzdCcgfSxcbiAgeyAnc3RhdHVzJzogNDAxLCAnc3RhdHVzVGV4dCc6ICdVbmF1dGhvcml6ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwMiwgJ3N0YXR1c1RleHQnOiAnUGF5bWVudCBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDAzLCAnc3RhdHVzVGV4dCc6ICdGb3JiaWRkZW4nIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNCwgJ3N0YXR1c1RleHQnOiAnTm90IEZvdW5kJyB9LFxuICB7ICdzdGF0dXMnOiA0MDUsICdzdGF0dXNUZXh0JzogJ01ldGhvZCBOb3QgQWxsb3dlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA2LCAnc3RhdHVzVGV4dCc6ICdOb3QgQWNjZXB0YWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNDA3LCAnc3RhdHVzVGV4dCc6ICdQcm94eSBBdXRoZW50aWNhdGlvbiBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDA4LCAnc3RhdHVzVGV4dCc6ICdSZXF1ZXN0IFRpbWVvdXQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwOSwgJ3N0YXR1c1RleHQnOiAnQ29uZmxpY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMCwgJ3N0YXR1c1RleHQnOiAnR29uZScgfSxcbiAgeyAnc3RhdHVzJzogNDExLCAnc3RhdHVzVGV4dCc6ICdMZW5ndGggUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxMiwgJ3N0YXR1c1RleHQnOiAnUHJlY29uZGl0aW9uIEZhaWxlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDEzLCAnc3RhdHVzVGV4dCc6ICdQYXlsb2FkIFRvbyBMYXJnZScgfSxcbiAgeyAnc3RhdHVzJzogNDE0LCAnc3RhdHVzVGV4dCc6ICdVUkkgVG9vIExvbmcnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNSwgJ3N0YXR1c1RleHQnOiAnVW5zdXBwb3J0ZWQgTWVkaWEgVHlwZScgfSxcbiAgeyAnc3RhdHVzJzogNDE2LCAnc3RhdHVzVGV4dCc6ICdSYW5nZSBOb3QgU2F0aXNmaWFibGUnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxNywgJ3N0YXR1c1RleHQnOiAnRXhwZWN0YXRpb24gRmFpbGVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTgsICdzdGF0dXNUZXh0JzogJ0lcXCdtIGEgVGVhcG90JyB9LFxuICB7ICdzdGF0dXMnOiA0MjEsICdzdGF0dXNUZXh0JzogJ01pc2RpcmVjdGVkIFJlcXVlc3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMiwgJ3N0YXR1c1RleHQnOiAnVW5wcm9jZXNzYWJsZSBFbnRpdHknIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMywgJ3N0YXR1c1RleHQnOiAnTG9ja2VkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjQsICdzdGF0dXNUZXh0JzogJ0ZhaWxlZCBEZXBlbmRlbmN5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjUsICdzdGF0dXNUZXh0JzogJ1RvbyBFYXJseScgfSxcbiAgeyAnc3RhdHVzJzogNDI2LCAnc3RhdHVzVGV4dCc6ICdVcGdyYWRlIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjgsICdzdGF0dXNUZXh0JzogJ1ByZWNvbmRpdGlvbiBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDI5LCAnc3RhdHVzVGV4dCc6ICdUb28gTWFueSBSZXF1ZXN0cycgfSxcbiAgeyAnc3RhdHVzJzogNDMxLCAnc3RhdHVzVGV4dCc6ICdSZXF1ZXN0IEhlYWRlciBGaWVsZHMgVG9vIExhcmdlJyB9LFxuICB7ICdzdGF0dXMnOiA0NTEsICdzdGF0dXNUZXh0JzogJ1VuYXZhaWxhYmxlIEZvciBMZWdhbCBSZWFzb25zJyB9LFxuICB7ICdzdGF0dXMnOiA1MDAsICdzdGF0dXNUZXh0JzogJ0ludGVybmFsIFNlcnZlciBFcnJvcicgfSxcbiAgeyAnc3RhdHVzJzogNTAxLCAnc3RhdHVzVGV4dCc6ICdOb3QgSW1wbGVtZW50ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMiwgJ3N0YXR1c1RleHQnOiAnQmFkIEdhdGV3YXknIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMywgJ3N0YXR1c1RleHQnOiAnU2VydmljZSBVbmF2YWlsYWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNTA0LCAnc3RhdHVzVGV4dCc6ICdHYXRld2F5IFRpbWVvdXQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNSwgJ3N0YXR1c1RleHQnOiAnSFRUUCBWZXJzaW9uIE5vdCBTdXBwb3J0ZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNiwgJ3N0YXR1c1RleHQnOiAnVmFyaWFudCBBbHNvIE5lZ290aWF0ZXMnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwNywgJ3N0YXR1c1RleHQnOiAnSW5zdWZmaWNpZW50IFN0b3JhZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwOCwgJ3N0YXR1c1RleHQnOiAnTG9vcCBEZXRlY3RlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTA5LCAnc3RhdHVzVGV4dCc6ICdCYW5kd2lkdGggTGltaXQgRXhjZWVkZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUxMCwgJ3N0YXR1c1RleHQnOiAnTm90IEV4dGVuZGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MTEsICdzdGF0dXNUZXh0JzogJ05ldHdvcmsgQXV0aGVudGljYXRpb24gUmVxdWlyZWQnIH0sXG5dO1xuIiwiY29uc3Qgbm9kZUNsaXBib2FyZHkgPSByZXF1aXJlKCdub2RlLWNsaXBib2FyZHknKTtcbi8vIOeUqOWIsOeahOW6k+S5n+WvvOWHuuS+v+S6juiHquihjOmAieeUqFxuZXhwb3J0IHsgbm9kZUNsaXBib2FyZHkgfTtcblxuZXhwb3J0IGNvbnN0IGNsaXBib2FyZCA9IHtcbi8vIOWvueW6lOa1j+iniOWZqOerr+WQjOWQjeaWueazle+8jOWHj+WwkeS7o+eggeS/ruaUuVxuICAvKipcbiAgICog5YaZ5YWl5paH5pysKOWkjeWItilcbiAgICogQHBhcmFtIHRleHRcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBhc3luYyB3cml0ZVRleHQodGV4dCkge1xuICAgIC8vIOi9rOaNouaIkOWtl+espuS4sumYsuatoiBjbGlwYm9hcmR5IOaKpeexu+Wei+mUmeivr1xuICAgIGNvbnN0IHRleHRSZXN1bHQgPSBTdHJpbmcodGV4dCk7XG4gICAgcmV0dXJuIGF3YWl0IG5vZGVDbGlwYm9hcmR5LndyaXRlKHRleHRSZXN1bHQpO1xuICB9LFxuICAvKipcbiAgICog6K+75Y+W5paH5pysKOeymOi0tClcbiAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHJlYWRUZXh0KCkge1xuICAgIHJldHVybiBhd2FpdCBub2RlQ2xpcGJvYXJkeS5yZWFkKCk7XG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbImJhc2VDb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFPLE1BQU0sT0FBTyxHQUFHO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLGdCQUFnQixDQUFDLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDOUIsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUM5QixJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEdBQUcsR0FBRyxFQUFFLEtBQUssR0FB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
