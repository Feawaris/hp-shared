/*!
 * hp-shared v0.2.1
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"cjs","sourcemap":"inline"}
 */
  
'use strict';

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

// 简单类型
const SIMPLE_TYPES = [null, undefined, Number, String, Boolean, BigInt, Symbol];
/**
 * 获取值的具体类型
 * @param value {*} 值
 * @returns {ObjectConstructor|*|Function} 返回对应构造函数。null、undefined 原样返回
 */
function getExactType(value) {
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
 * @param value {*} 值
 * @returns {*[]} 统一返回数组。null、undefined 对应为 [null],[undefined]
 */
function getExactTypes(value) {
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
 * @param source {*}
 * @returns {Map<any, any>|Set<any>|{}|*|*[]}
 */
function deepClone(source) {
  // 数组
  if (source instanceof Array) {
    let result = [];
    for (const value of source.values()) {
      result.push(deepClone(value));
    }
    return result;
  }
  // Set
  if (source instanceof Set) {
    let result = new Set();
    for (let value of source.values()) {
      result.add(deepClone(value));
    }
    return result;
  }
  // Map
  if (source instanceof Map) {
    let result = new Map();
    for (let [key, value] of source.entries()) {
      result.set(key, deepClone(value));
    }
    return result;
  }
  // 对象
  if (getExactType(source) === Object) {
    let result = {};
    for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
      if ('value' in desc) {
        // value方式：递归处理
        Object.defineProperty(result, key, {
          ...desc,
          value: deepClone(desc.value),
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
 * @param data {*} 值
 * @param isWrap {function} 包装数据判断函数，如vue3的isRef函数
 * @param unwrap {function} 解包方式函数，如vue3的unref函数
 * @returns {(*|{[p: string]: any})[]|*|{[p: string]: any}|{[p: string]: *|{[p: string]: any}}}
 */
function deepUnwrap(data, { isWrap = FALSE, unwrap = RAW } = {}) {
  // 选项收集
  const options = { isWrap, unwrap };
  // 包装类型（如vue3响应式对象）数据解包
  if (isWrap(data)) {
    return deepUnwrap(unwrap(data), options);
  }
  // 递归处理的类型
  if (data instanceof Array) {
    return data.map(val => deepUnwrap(val, options));
  }
  if (getExactType(data) === Object) {
    return Object.fromEntries(Object.entries(data).map(([key, val]) => {
      return [key, deepUnwrap(val, options)];
    }));
  }
  // 其他原样返回
  return data;
}

var Data = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SIMPLE_TYPES: SIMPLE_TYPES,
  deepClone: deepClone,
  deepUnwrap: deepUnwrap,
  getExactType: getExactType,
  getExactTypes: getExactTypes
});

/**
 * 创建Date对象
 * @param args {*[]} 多个值
 * @returns {Date|*}
 */
function create(...args) {
  if (arguments.length === 1) {
    // safari 浏览器字符串格式兼容
    const value = arguments[0];
    const valueResult = getExactType(value) === String ? value.replaceAll('-', '/') : value;
    return new Date(valueResult);
  } else {
    // 传参行为先和Date一致，后续再收集需求加强定制(注意无参和显式undefined的区别)
    return arguments.length === 0 ? new Date() : new Date(...arguments);
  }
}

var _Date = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create
});

// 增加部分命名以接近数学写法
const arcsin = Math.asin.bind(Math);
const arccos = Math.acos.bind(Math);
const arctan = Math.atan.bind(Math);
const arsinh = Math.asinh.bind(Math);
const arcosh = Math.acosh.bind(Math);
const artanh = Math.atanh.bind(Math);
const loge = Math.log.bind(Math);
const ln = loge;
const lg = Math.log10.bind(Math);
function log(a, x) {
  return Math.log(x) / Math.log(a);
}

var _Math = /*#__PURE__*/Object.freeze({
  __proto__: null,
  arccos: arccos,
  arcosh: arcosh,
  arcsin: arcsin,
  arctan: arctan,
  arsinh: arsinh,
  artanh: artanh,
  lg: lg,
  ln: ln,
  log: log,
  loge: loge
});

/**
 * 加强add方法。跟数组push方法一样可添加多个值
 * @param set {Set} 目标set
 * @param args {*[]} 多个值
 */
function add(set, ...args) {
  for (const arg of args) {
    set.add(arg);
  }
}

var _Set = /*#__PURE__*/Object.freeze({
  __proto__: null,
  add: add
});

// 对 ownKeys 配套 ownValues 和 ownEntries
function ownValues(target) {
  return Reflect.ownKeys(target).map(key => target[key]);
}
function ownEntries(target) {
  return Reflect.ownKeys(target).map(key => [key, target[key]]);
}

var _Reflect = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ownEntries: ownEntries,
  ownValues: ownValues
});

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
  const exactType = getExactType(names);
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

/**
 * 浅合并对象。写法同 Object.assign
 * 通过重定义方式合并，解决 Object.assign 合并两边同名属性混有 value写法 和 get/set写法 时报 TypeError: Cannot set property b of #<Object> which has only a getter 的问题
 * @param target {object} 目标对象
 * @param sources {any[]} 数据源。一个或多个对象
 * @returns {*}
 */
function assign(target = {}, ...sources) {
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
 * @param target {object} 目标对象。默认值 {} 防止递归时报 TypeError: Object.defineProperty called on non-object
 * @param sources {any[]} 数据源。一个或多个对象
 */
function deepAssign(target = {}, ...sources) {
  for (const source of sources) {
    for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
      if ('value' in desc) {
        // value写法：对象递归处理，其他直接定义
        if (getExactType(desc.value) === Object) {
          Object.defineProperty(target, key, {
            ...desc,
            value: deepAssign(target[key], desc.value),
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
 * @param object {object} 对象
 * @param key {string|Symbol} 属性名
 * @returns {*|null}
 */
function owner(object, key) {
  if (Object.prototype.hasOwnProperty.call(object, key)) {
    return object;
  }
  let __proto__ = Object.getPrototypeOf(object);
  if (__proto__ === null) {
    return null;
  }
  return owner(__proto__, key);
}
/**
 * 获取属性描述对象，相比 Object.getOwnPropertyDescriptor，能拿到继承属性的描述对象
 * @param object {object}
 * @param key {string|Symbol}
 * @returns {PropertyDescriptor}
 */
function descriptor(object, key) {
  const findObject = owner(object, key);
  if (!findObject) {
    return undefined;
  }
  return Object.getOwnPropertyDescriptor(findObject, key);
}
/**
 * 获取属性名。默认参数配置成同 Object.keys 行为
 * @param object {object} 对象
 * @param symbol {boolean} 是否包含 symbol 属性
 * @param notEnumerable {boolean} 是否包含不可列举属性
 * @param extend {boolean} 是否包含承继属性
 * @returns {any[]}
 */
function keys(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
  // 选项收集
  const options = { symbol, notEnumerable, extend };
  // set用于key去重
  let set = new Set();
  // 自身属性筛选
  const descs = Object.getOwnPropertyDescriptors(object);
  for (const [key, desc] of ownEntries(descs)) {
    // 忽略symbol属性的情况
    if (!symbol && getExactType(key) === Symbol) {
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
      const parentKeys = keys(__proto__, options);
      add(set, ...parentKeys);
    }
  }
  // 返回数组
  return Array.from(set);
}
/**
 * 对应 keys 获取 descriptors，传参同 keys 方法。可用于重定义属性
 * @param object {object} 对象
 * @param symbol {boolean} 是否包含 symbol 属性
 * @param notEnumerable {boolean} 是否包含不可列举属性
 * @param extend {boolean} 是否包含承继属性
 * @returns {PropertyDescriptor[]}
 */
function descriptors(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
  // 选项收集
  const options = { symbol, notEnumerable, extend };
  const _keys = keys(object, options);
  return _keys.map(key => descriptor(object, key));
}
/**
 * 对应 keys 获取 descriptorEntries，传参同 keys 方法。可用于重定义属性
 * @param object {object} 对象
 * @param symbol {boolean} 是否包含 symbol 属性
 * @param notEnumerable {boolean} 是否包含不可列举属性
 * @param extend {boolean} 是否包含承继属性
 * @returns {[string|Symbol,PropertyDescriptor][]}
 */
function descriptorEntries(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
  // 选项收集
  const options = { symbol, notEnumerable, extend };
  const _keys = keys(object, options);
  return _keys.map(key => [key, descriptor(object, key)]);
}
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
function filter(object, { pick = [], omit = [], emptyPick = 'all', separator = ',', symbol = true, notEnumerable = false, extend = true } = {}) {
  let result = {};
  // pick、omit 统一成数组格式
  pick = namesToArray(pick, { separator });
  omit = namesToArray(omit, { separator });
  let _keys = [];
  // pick有值直接拿，为空时根据 emptyPick 默认拿空或全部key
  _keys = pick.length > 0 || emptyPick === 'empty' ? pick : keys(object, { symbol, notEnumerable, extend });
  // omit筛选
  _keys = _keys.filter(key => !omit.includes(key));
  for (const key of _keys) {
    const desc = descriptor(object, key);
    // 属性不存在导致desc得到undefined时不设置值
    if (desc) {
      Object.defineProperty(result, key, desc);
    }
  }
  return result;
}
/**
 * 通过挑选方式选取对象。filter的简写方式
 * @param object {object} 对象
 * @param keys {string|array} 属性名集合
 * @param options {object} 选项，同 filter 的各选项值
 * @returns {{}}
 */
function pick(object, keys = [], options = {}) {
  return filter(object, { pick: keys, emptyPick: 'empty', ...options });
}
/**
 * 通过排除方式选取对象。filter的简写方式
 * @param object {object} 对象
 * @param keys {string|array} 属性名集合
 * @param options {object} 选项，同 filter 的各选项值
 * @returns {{}}
 */
function omit(object, keys = [], options = {}) {
  return filter(object, { omit: keys, ...options });
}

var _Object = /*#__PURE__*/Object.freeze({
  __proto__: null,
  assign: assign,
  deepAssign: deepAssign,
  descriptor: descriptor,
  descriptorEntries: descriptorEntries,
  descriptors: descriptors,
  filter: filter,
  keys: keys,
  omit: omit,
  owner: owner,
  pick: pick
});

/**
 * 绑定this。常用于解构函数时绑定this避免报错
 * @param target {object} 目标对象
 * @param options {object} 选项。扩展用
 * @returns {*}
 */
function bindThis(target, options = {}) {
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

var _Proxy = /*#__PURE__*/Object.freeze({
  __proto__: null,
  bindThis: bindThis
});

/**
 * 首字母大写
 * @param name {string}
 * @returns {string}
 */
function toFirstUpperCase(name = '') {
  return `${(name[0] ?? '').toUpperCase()}${name.slice(1)}`;
}
/**
 * 首字母小写
 * @param name {string} 名称
 * @returns {string}
 */
function toFirstLowerCase(name = '') {
  return `${(name[0] ?? '').toLowerCase()}${name.slice(1)}`;
}
/**
 * 转驼峰命名。常用于连接符命名转驼峰命名，如 xx-name -> xxName
 * @param name {string} 名称
 * @param separator {string} 连接符。用于生成正则 默认为中划线 - 对应regexp得到 /-(\w)/g
 * @param first {string,boolean} 首字母处理方式。true 或 'uppercase'：转换成大写;
 *                                            false 或 'lowercase'：转换成小写;
 *                                            'raw' 或 其他无效值：默认原样返回，不进行处理;
 * @returns {MagicString|string|string}
 */
function toCamelCase(name, { separator = '-', first = 'raw' } = {}) {
  // 生成正则
  const regexp = new RegExp(`${separator}(\\w)`, 'g');
  // 拼接成驼峰
  const camelName = name.replaceAll(regexp, (substr, $1) => {
    return $1.toUpperCase();
  });
  // 首字母大小写根据传参判断
  if ([true, 'uppercase'].includes(first)) {
    return toFirstUpperCase(camelName);
  }
  if ([false, 'lowercase'].includes(first)) {
    return toFirstLowerCase(camelName);
  }
  return camelName;
}
/**
 * 转连接符命名。常用于驼峰命名转连接符命名，如 xxName -> xx-name
 * @param name {string} 名称
 * @param separator {string} 连接符
 * @returns {string}
 */
function toLineCase(name = '', { separator = '-' } = {}) {
  return name
    // 按连接符拼接
    .replaceAll(/([a-z])([A-Z])/g, `$1${separator}$2`)
    // 转小写
    .toLowerCase();
}

var _String = /*#__PURE__*/Object.freeze({
  __proto__: null,
  toCamelCase: toCamelCase,
  toFirstLowerCase: toFirstLowerCase,
  toFirstUpperCase: toFirstUpperCase,
  toLineCase: toLineCase
});

// 处理vue数据用

/**
 * 深解包vue3响应式对象数据
 * @param data {*}
 * @returns {(*|{[p: string]: *})[]|*|{[p: string]: *}|{[p: string]: *|{[p: string]: *}}}
 */
function deepUnwrapVue3(data) {
  return deepUnwrap(data, {
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
function getPropsFromAttrs(attrs, propDefinitions) {
  // props 定义统一成对象格式，type 统一成数组格式以便后续判断
  if (propDefinitions instanceof Array) {
    propDefinitions = Object.fromEntries(propDefinitions.map(name => [toCamelCase(name), { type: [] }]));
  } else if (getExactType(propDefinitions) === Object) {
    propDefinitions = Object.fromEntries(Object.entries(propDefinitions).map(([name, definition]) => {
      definition = getExactType(definition) === Object
        ? { ...definition, type: [definition.type].flat() }
        : { type: [definition].flat() };
      return [toCamelCase(name), definition];
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
        const camelName = toCamelCase(name);
        // 只包含Boolean类型的''转换为true，其他原样赋值
        result[camelName] = definition.type.length === 1 && definition.type.includes(Boolean) && attrValue === '' ? true : attrValue;
        return;
      }
      // prop-name 格式进递归
      if (end) { return; }
      setResult({ name: toLineCase(name), definition, end: true });
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
function getEmitsFromAttrs(attrs, emitDefinitions) {
  // emits 定义统一成数组格式
  if (getExactType(emitDefinitions) === Object) {
    emitDefinitions = Object.keys(emitDefinitions);
  } else if (!(emitDefinitions instanceof Array)) {
    emitDefinitions = [];
  }
  // 统一处理成 onEmitName、onUpdate:emitName(v-model系列) 格式
  const emitNames = emitDefinitions.map(name => toCamelCase(`on-${name}`));
  // 设置值
  let result = {};
  for (const name of emitNames) {
    (function setResult({ name, end = false }) {
      if (name.startsWith('onUpdate:')) {
        // onUpdate:emitName 或 onUpdate:emit-name 格式递归进来
        if (name in attrs) {
          const camelName = toCamelCase(name);
          result[camelName] = attrs[name];
          return;
        }
        // onUpdate:emit-name 格式进递归
        if (end) { return; }
        setResult({ name: `onUpdate:${toLineCase(name.slice(name.indexOf(':') + 1))}`, end: true });
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
 * 从 attrs 中提取剩余属性。常用于组件inheritAttrs设置false时使用作为新的attrs
 * @param attrs vue attrs
 * @param {} 配置项
 *          @param props props 定义 或 vue props，如 ElButton.props 等
 *          @param emits emits 定义 或 vue emits，如 ElButton.emits 等
 *          @param list 额外的普通属性
 * @returns {{}}
 */
function getRestFromAttrs(attrs, { props, emits, list = [] } = {}) {
  // 统一成数组格式
  props = (() => {
    const arr = (() => {
      if (props instanceof Array) {
        return props;
      }
      if (getExactType(props) === Object) {
        return Object.keys(props);
      }
      return [];
    })();
    return arr.map(name => [toCamelCase(name), toLineCase(name)]).flat();
  })();
  emits = (() => {
    const arr = (() => {
      if (emits instanceof Array) {
        return emits;
      }
      if (getExactType(emits) === Object) {
        return Object.keys(emits);
      }
      return [];
    })();
    return arr.map((name) => {
      // update:emitName 或 update:emit-name 格式
      if (name.startsWith('update:')) {
        const partName = name.slice(name.indexOf(':') + 1);
        return [`onUpdate:${toCamelCase(partName)}`, `onUpdate:${toLineCase(partName)}`];
      }
      // onEmitName格式，中划线格式已被vue转换不用重复处理
      return [toCamelCase(`on-${name}`)];
    }).flat();
  })();
  list = (() => {
    const arr = getExactType(list) === String
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

var VueData = /*#__PURE__*/Object.freeze({
  __proto__: null,
  deepUnwrapVue3: deepUnwrapVue3,
  getEmitsFromAttrs: getEmitsFromAttrs,
  getPropsFromAttrs: getPropsFromAttrs,
  getRestFromAttrs: getRestFromAttrs
});

// 处理样式用
/**
 * 带单位字符串。对数字或数字格式的字符串自动拼单位，其他字符串原样返回
 * @param value {number|string} 值
 * @param unit 单位。value没带单位时自动拼接，可传 px/em/% 等
 * @returns {string|string}
 */
function
getUnitString(value = '', { unit = 'px' } = {}) {
  if (value === '') { return ''; }
  // 注意：这里使用 == 判断，不使用 ===
  return Number(value) == value ? `${value}${unit}` : String(value);
}

var Style = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getUnitString: getUnitString
});

exports.Data = Data;
exports.FALSE = FALSE;
exports.JS_ENV = JS_ENV;
exports.NOOP = NOOP;
exports.RAW = RAW;
exports.Style = Style;
exports.THROW = THROW;
exports.TRUE = TRUE;
exports.VueData = VueData;
exports._Date = _Date;
exports._Math = _Math;
exports._Object = _Object;
exports._Proxy = _Proxy;
exports._Reflect = _Reflect;
exports._Set = _Set;
exports._String = _String;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvY29uc3RhbnRzLmpzIiwiLi4vLi4vc3JjL2Jhc2UvRGF0YS5qcyIsIi4uLy4uL3NyYy9iYXNlL19EYXRlLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX01hdGguanMiLCIuLi8uLi9zcmMvYmFzZS9fU2V0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1JlZmxlY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9fT2JqZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1Byb3h5LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1N0cmluZy5qcyIsIi4uLy4uL3NyYy9iYXNlL1Z1ZURhdGEuanMiLCIuLi8uLi9zcmMvYmFzZS9TdHlsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDluLjph4/jgILluLjnlKjkuo7pu5jorqTkvKDlj4LnrYnlnLrmma9cbi8vIGpz6L+Q6KGM546v5aKDXG5leHBvcnQgY29uc3QgSlNfRU5WID0gKGZ1bmN0aW9uIGdldEpzRW52KCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcyA9PT0gd2luZG93KSB7XG4gICAgcmV0dXJuICdicm93c2VyJztcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcyA9PT0gZ2xvYmFsKSB7XG4gICAgcmV0dXJuICdub2RlJztcbiAgfVxuICByZXR1cm4gJyc7XG59KSgpO1xuLy8g56m65Ye95pWwXG5leHBvcnQgZnVuY3Rpb24gTk9PUCgpIHt9XG4vLyDov5Tlm54gZmFsc2VcbmV4cG9ydCBmdW5jdGlvbiBGQUxTRSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuLy8g6L+U5ZueIHRydWVcbmV4cG9ydCBmdW5jdGlvbiBUUlVFKCkge1xuICByZXR1cm4gdHJ1ZTtcbn1cbi8vIOWOn+agt+i/lOWbnlxuZXhwb3J0IGZ1bmN0aW9uIFJBVyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG4vLyBjYXRjaCDlhoXnmoTplJnor6/ljp/moLfmipvlh7rljrtcbmV4cG9ydCBmdW5jdGlvbiBUSFJPVyhlKSB7XG4gIHRocm93IGU7XG59XG4iLCIvLyDlpITnkIblpJrmoLzlvI/mlbDmja7nlKhcbmltcG9ydCB7IEZBTFNFLCBSQVcgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8vIOeugOWNleexu+Wei1xuZXhwb3J0IGNvbnN0IFNJTVBMRV9UWVBFUyA9IFtudWxsLCB1bmRlZmluZWQsIE51bWJlciwgU3RyaW5nLCBCb29sZWFuLCBCaWdJbnQsIFN5bWJvbF07XG4vKipcbiAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei1xuICogQHBhcmFtIHZhbHVlIHsqfSDlgLxcbiAqIEByZXR1cm5zIHtPYmplY3RDb25zdHJ1Y3RvcnwqfEZ1bmN0aW9ufSDov5Tlm57lr7nlupTmnoTpgKDlh73mlbDjgIJudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXhhY3RUeXBlKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgLy8gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGh5pe2IF9fcHJvdG9fXyDkuLogbnVsbFxuICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDlr7nlupTnu6fmib/nmoTlr7nosaEgX19wcm90b19fIOayoeaciSBjb25zdHJ1Y3RvciDlsZ7mgKdcbiAgY29uc3QgaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gISgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXyk7XG4gIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDov5Tlm57lr7nlupTmnoTpgKDlh73mlbBcbiAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3Rvcjtcbn1cbi8qKlxuICog6I635Y+W5YC855qE5YW35L2T57G75Z6L5YiX6KGoXG4gKiBAcGFyYW0gdmFsdWUgeyp9IOWAvFxuICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeGFjdFR5cGVzKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Yik5pat5aSE55CGXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gW3ZhbHVlXTtcbiAgfVxuICAvLyDmiavljp/lnovpk77lvpfliLDlr7nlupTmnoTpgKDlh73mlbBcbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBsZXQgbG9vcCA9IDA7XG4gIGxldCBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gZmFsc2U7XG4gIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIGNvbnNvbGUud2Fybignd2hpbGUnLCBsb29wLCBfX3Byb3RvX18pO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIC8vIOS4gOi/m+adpSBfX3Byb3RvX18g5bCx5pivIG51bGwg6K+05piOIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoVxuICAgICAgaWYgKGxvb3AgPD0gMCkge1xuICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKSB7XG4gICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgfVxuICAgIF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihfX3Byb3RvX18pO1xuICAgIGxvb3ArKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDmt7Hmi7fotJ3mlbDmja5cbiAqIEBwYXJhbSBzb3VyY2Ugeyp9XG4gKiBAcmV0dXJucyB7TWFwPGFueSwgYW55PnxTZXQ8YW55Pnx7fXwqfCpbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDbG9uZShzb3VyY2UpIHtcbiAgLy8g5pWw57uEXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHNvdXJjZS52YWx1ZXMoKSkge1xuICAgICAgcmVzdWx0LnB1c2goZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gU2V0XG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHNvdXJjZS52YWx1ZXMoKSkge1xuICAgICAgcmVzdWx0LmFkZChkZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBNYXBcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHNvdXJjZS5lbnRyaWVzKCkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCBkZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlr7nosaFcbiAgaWYgKGdldEV4YWN0VHlwZShzb3VyY2UpID09PSBPYmplY3QpIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAvLyB2YWx1ZeaWueW8j++8mumAkuW9kuWkhOeQhlxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIHtcbiAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgIHZhbHVlOiBkZWVwQ2xvbmUoZGVzYy52YWx1ZSksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0L3NldCDmlrnlvI/vvJrnm7TmjqXlrprkuYlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlhbbku5bvvJrljp/moLfov5Tlm55cbiAgcmV0dXJuIHNvdXJjZTtcbn1cbi8qKlxuICog5rex6Kej5YyF5pWw5o2uXG4gKiBAcGFyYW0gZGF0YSB7Kn0g5YC8XG4gKiBAcGFyYW0gaXNXcmFwIHtmdW5jdGlvbn0g5YyF6KOF5pWw5o2u5Yik5pat5Ye95pWw77yM5aaCdnVlM+eahGlzUmVm5Ye95pWwXG4gKiBAcGFyYW0gdW53cmFwIHtmdW5jdGlvbn0g6Kej5YyF5pa55byP5Ye95pWw77yM5aaCdnVlM+eahHVucmVm5Ye95pWwXG4gKiBAcmV0dXJucyB7KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfCp8e1twOiBzdHJpbmddOiBhbnl9fHtbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcFVud3JhcChkYXRhLCB7IGlzV3JhcCA9IEZBTFNFLCB1bndyYXAgPSBSQVcgfSA9IHt9KSB7XG4gIC8vIOmAiemhueaUtumbhlxuICBjb25zdCBvcHRpb25zID0geyBpc1dyYXAsIHVud3JhcCB9O1xuICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gIGlmIChpc1dyYXAoZGF0YSkpIHtcbiAgICByZXR1cm4gZGVlcFVud3JhcCh1bndyYXAoZGF0YSksIG9wdGlvbnMpO1xuICB9XG4gIC8vIOmAkuW9kuWkhOeQhueahOexu+Wei1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIGRhdGEubWFwKHZhbCA9PiBkZWVwVW53cmFwKHZhbCwgb3B0aW9ucykpO1xuICB9XG4gIGlmIChnZXRFeGFjdFR5cGUoZGF0YSkgPT09IE9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICByZXR1cm4gW2tleSwgZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpXTtcbiAgICB9KSk7XG4gIH1cbiAgLy8g5YW25LuW5Y6f5qC36L+U5ZueXG4gIHJldHVybiBkYXRhO1xufVxuIiwiaW1wb3J0IHsgZ2V0RXhhY3RUeXBlIH0gZnJvbSAnLi9EYXRhJztcblxuLyoqXG4gKiDliJvlu7pEYXRl5a+56LGhXG4gKiBAcGFyYW0gYXJncyB7KltdfSDlpJrkuKrlgLxcbiAqIEByZXR1cm5zIHtEYXRlfCp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoLi4uYXJncykge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICBjb25zdCB2YWx1ZSA9IGFyZ3VtZW50c1swXTtcbiAgICBjb25zdCB2YWx1ZVJlc3VsdCA9IGdldEV4YWN0VHlwZSh2YWx1ZSkgPT09IFN0cmluZyA/IHZhbHVlLnJlcGxhY2VBbGwoJy0nLCAnLycpIDogdmFsdWU7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlUmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICAvLyDkvKDlj4LooYzkuLrlhYjlkoxEYXRl5LiA6Ie077yM5ZCO57ut5YaN5pS26ZuG6ZyA5rGC5Yqg5by65a6a5Yi2KOazqOaEj+aXoOWPguWSjOaYvuW8j3VuZGVmaW5lZOeahOWMuuWIqylcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMCA/IG5ldyBEYXRlKCkgOiBuZXcgRGF0ZSguLi5hcmd1bWVudHMpO1xuICB9XG59XG4iLCIvLyDlop7liqDpg6jliIblkb3lkI3ku6XmjqXov5HmlbDlrablhpnms5VcbmV4cG9ydCBjb25zdCBhcmNzaW4gPSBNYXRoLmFzaW4uYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBhcmNjb3MgPSBNYXRoLmFjb3MuYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBhcmN0YW4gPSBNYXRoLmF0YW4uYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBhcnNpbmggPSBNYXRoLmFzaW5oLmJpbmQoTWF0aCk7XG5leHBvcnQgY29uc3QgYXJjb3NoID0gTWF0aC5hY29zaC5iaW5kKE1hdGgpO1xuZXhwb3J0IGNvbnN0IGFydGFuaCA9IE1hdGguYXRhbmguYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBsb2dlID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBsbiA9IGxvZ2U7XG5leHBvcnQgY29uc3QgbGcgPSBNYXRoLmxvZzEwLmJpbmQoTWF0aCk7XG5leHBvcnQgZnVuY3Rpb24gbG9nKGEsIHgpIHtcbiAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coYSk7XG59XG4iLCIvKipcbiAqIOWKoOW8umFkZOaWueazleOAgui3n+aVsOe7hHB1c2jmlrnms5XkuIDmoLflj6/mt7vliqDlpJrkuKrlgLxcbiAqIEBwYXJhbSBzZXQge1NldH0g55uu5qCHc2V0XG4gKiBAcGFyYW0gYXJncyB7KltdfSDlpJrkuKrlgLxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZChzZXQsIC4uLmFyZ3MpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIHNldC5hZGQoYXJnKTtcbiAgfVxufVxuIiwiLy8g5a+5IG93bktleXMg6YWN5aWXIG93blZhbHVlcyDlkowgb3duRW50cmllc1xuZXhwb3J0IGZ1bmN0aW9uIG93blZhbHVlcyh0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG93bkVudHJpZXModGFyZ2V0KSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IFtrZXksIHRhcmdldFtrZXldXSk7XG59XG4iLCJpbXBvcnQgeyBhZGQgfSBmcm9tICcuL19TZXQnO1xuaW1wb3J0IHsgb3duRW50cmllcyB9IGZyb20gJy4vX1JlZmxlY3QnO1xuaW1wb3J0IHsgZ2V0RXhhY3RUeXBlIH0gZnJvbSAnLi9EYXRhJztcblxuLyoqXG4gKiDlsZ7mgKflkI3nu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAqIEBwYXJhbSBuYW1lcyB7c3RyaW5nfFN5bWJvbHxhcnJheX0g5bGe5oCn5ZCN44CC5qC85byPICdhLGIsYycg5oiWIFsnYScsJ2InLCdjJ11cbiAqIEBwYXJhbSBzZXBhcmF0b3Ige3N0cmluZ3xSZWdFeHB9IG5hbWVzIOS4uuWtl+espuS4suaXtueahOaLhuWIhuinhOWImeOAguWQjCBzcGxpdCDmlrnms5XnmoQgc2VwYXJhdG9y77yM5a2X56ym5Liy5peg6ZyA5ouG5YiG55qE5Y+v5Lul5LygIG51bGwg5oiWIHVuZGVmaW5lZFxuICogQHJldHVybnMgeypbXVtdfChNYWdpY1N0cmluZyB8IEJ1bmRsZSB8IHN0cmluZylbXXxGbGF0QXJyYXk8KEZsYXRBcnJheTwoKnxbKltdXXxbXSlbXSwgMT5bXXwqfFsqW11dfFtdKVtdLCAxPltdfCpbXX1cbiAqL1xuZnVuY3Rpb24gbmFtZXNUb0FycmF5KG5hbWVzID0gW10sIHsgc2VwYXJhdG9yID0gJywnIH0gPSB7fSkge1xuICBpZiAobmFtZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBuYW1lcy5tYXAodmFsID0+IG5hbWVzVG9BcnJheSh2YWwpKS5mbGF0KCk7XG4gIH1cbiAgY29uc3QgZXhhY3RUeXBlID0gZ2V0RXhhY3RUeXBlKG5hbWVzKTtcbiAgaWYgKGV4YWN0VHlwZSA9PT0gU3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVzLnNwbGl0KHNlcGFyYXRvcikubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH1cbiAgaWYgKGV4YWN0VHlwZSA9PT0gU3ltYm9sKSB7XG4gICAgcmV0dXJuIFtuYW1lc107XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KFN5bWJvbCgpKSk7XG4vLyBjb25zb2xlLmxvZyhuYW1lc1RvQXJyYXkoWydhJywgJ2InLCAnYycsIFN5bWJvbCgpXSkpO1xuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KCdhLGIsYycpKTtcbi8vIGNvbnNvbGUubG9nKG5hbWVzVG9BcnJheShbJ2EsYixjJywgU3ltYm9sKCldKSk7XG5cbi8qKlxuICog5rWF5ZCI5bm25a+56LGh44CC5YaZ5rOV5ZCMIE9iamVjdC5hc3NpZ25cbiAqIOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICogQHBhcmFtIHRhcmdldCB7b2JqZWN0fSDnm67moIflr7nosaFcbiAqIEBwYXJhbSBzb3VyY2VzIHthbnlbXX0g5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgLy8g5LiN5L2/55SoIHRhcmdldFtrZXldPXZhbHVlIOWGmeazle+8jOebtOaOpeS9v+eUqGRlc2Pph43lrprkuYlcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuLyoqXG4gKiDmt7HlkIjlubblr7nosaHjgILlkIwgYXNzaWduIOS4gOagt+S5n+S8muWvueWxnuaAp+i/m+ihjOmHjeWumuS5iVxuICogQHBhcmFtIHRhcmdldCB7b2JqZWN0fSDnm67moIflr7nosaHjgILpu5jorqTlgLwge30g6Ziy5q2i6YCS5b2S5pe25oqlIFR5cGVFcnJvcjogT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0XG4gKiBAcGFyYW0gc291cmNlcyB7YW55W119IOaVsOaNrua6kOOAguS4gOS4quaIluWkmuS4quWvueixoVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAvLyB2YWx1ZeWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICBpZiAoZ2V0RXhhY3RUeXBlKGRlc2MudmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgICB2YWx1ZTogZGVlcEFzc2lnbih0YXJnZXRba2V5XSwgZGVzYy52YWx1ZSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0L3NldOWGmeazle+8muebtOaOpeWumuS5iVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuLyoqXG4gKiBrZXnoh6rouqvmiYDlsZ7nmoTlr7nosaFcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0ga2V5IHtzdHJpbmd8U3ltYm9sfSDlsZ7mgKflkI1cbiAqIEByZXR1cm5zIHsqfG51bGx9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvd25lcihvYmplY3QsIGtleSkge1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgbGV0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIG93bmVyKF9fcHJvdG9fXywga2V5KTtcbn1cbi8qKlxuICog6I635Y+W5bGe5oCn5o+P6L+w5a+56LGh77yM55u45q+UIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3LvvIzog73mi7/liLDnu6fmib/lsZ7mgKfnmoTmj4/ov7Dlr7nosaFcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH1cbiAqIEBwYXJhbSBrZXkge3N0cmluZ3xTeW1ib2x9XG4gKiBAcmV0dXJucyB7UHJvcGVydHlEZXNjcmlwdG9yfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzY3JpcHRvcihvYmplY3QsIGtleSkge1xuICBjb25zdCBmaW5kT2JqZWN0ID0gb3duZXIob2JqZWN0LCBrZXkpO1xuICBpZiAoIWZpbmRPYmplY3QpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZpbmRPYmplY3QsIGtleSk7XG59XG4vKipcbiAqIOiOt+WPluWxnuaAp+WQjeOAgum7mOiupOWPguaVsOmFjee9ruaIkOWQjCBPYmplY3Qua2V5cyDooYzkuLpcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0gc3ltYm9sIHtib29sZWFufSDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gKiBAcmV0dXJucyB7YW55W119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrZXlzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgLy8g6YCJ6aG55pS26ZuGXG4gIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gIC8vIHNldOeUqOS6jmtleeWOu+mHjVxuICBsZXQgc2V0ID0gbmV3IFNldCgpO1xuICAvLyDoh6rouqvlsZ7mgKfnrZvpgIlcbiAgY29uc3QgZGVzY3MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3QpO1xuICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIG93bkVudHJpZXMoZGVzY3MpKSB7XG4gICAgLy8g5b+955Wlc3ltYm9s5bGe5oCn55qE5oOF5Ya1XG4gICAgaWYgKCFzeW1ib2wgJiYgZ2V0RXhhY3RUeXBlKGtleSkgPT09IFN5bWJvbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vIOW/veeVpeS4jeWPr+WIl+S4vuWxnuaAp+eahOaDheWGtVxuICAgIGlmICghbm90RW51bWVyYWJsZSAmJiAhZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8g5YW25LuW5bGe5oCn5Yqg5YWlXG4gICAgc2V0LmFkZChrZXkpO1xuICB9XG4gIC8vIOe7p+aJv+WxnuaAp1xuICBpZiAoZXh0ZW5kKSB7XG4gICAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgaWYgKF9fcHJvdG9fXyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgcGFyZW50S2V5cyA9IGtleXMoX19wcm90b19fLCBvcHRpb25zKTtcbiAgICAgIGFkZChzZXQsIC4uLnBhcmVudEtleXMpO1xuICAgIH1cbiAgfVxuICAvLyDov5Tlm57mlbDnu4RcbiAgcmV0dXJuIEFycmF5LmZyb20oc2V0KTtcbn1cbi8qKlxuICog5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3Jz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAqIEBwYXJhbSBleHRlbmQge2Jvb2xlYW59IOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICogQHJldHVybnMge1Byb3BlcnR5RGVzY3JpcHRvcltdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzY3JpcHRvcnMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAvLyDpgInpobnmlLbpm4ZcbiAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgY29uc3QgX2tleXMgPSBrZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpKTtcbn1cbi8qKlxuICog5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3JFbnRyaWVz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAqIEBwYXJhbSBleHRlbmQge2Jvb2xlYW59IOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICogQHJldHVybnMge1tzdHJpbmd8U3ltYm9sLFByb3BlcnR5RGVzY3JpcHRvcl1bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaXB0b3JFbnRyaWVzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgLy8g6YCJ6aG55pS26ZuGXG4gIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gIGNvbnN0IF9rZXlzID0ga2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICByZXR1cm4gX2tleXMubWFwKGtleSA9PiBba2V5LCBkZXNjcmlwdG9yKG9iamVjdCwga2V5KV0pO1xufVxuLyoqXG4gKiDpgInlj5blr7nosaFcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0gcGljayB7c3RyaW5nfGFycmF5fSDmjJHpgInlsZ7mgKdcbiAqIEBwYXJhbSBvbWl0IHtzdHJpbmd8YXJyYXl9IOW/veeVpeWxnuaAp1xuICogQHBhcmFtIGVtcHR5UGljayB7c3RyaW5nfSBwaWNrIOS4uuepuuaXtueahOWPluWAvOOAgmFsbCDlhajpg6hrZXnvvIxlbXB0eSDnqbpcbiAqIEBwYXJhbSBzZXBhcmF0b3Ige3N0cmluZ3xSZWdFeHB9IOWQjCBuYW1lc1RvQXJyYXkg55qEIHNlcGFyYXRvciDlj4LmlbBcbiAqIEBwYXJhbSBzeW1ib2wge2Jvb2xlYW59IOWQjCBrZXlzIOeahCBzeW1ib2wg5Y+C5pWwXG4gKiBAcGFyYW0gbm90RW51bWVyYWJsZSB7Ym9vbGVhbn0g5ZCMIGtleXMg55qEIG5vdEVudW1lcmFibGUg5Y+C5pWwXG4gKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDlkIwga2V5cyDnmoQgZXh0ZW5kIOWPguaVsFxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyKG9iamVjdCwgeyBwaWNrID0gW10sIG9taXQgPSBbXSwgZW1wdHlQaWNrID0gJ2FsbCcsIHNlcGFyYXRvciA9ICcsJywgc3ltYm9sID0gdHJ1ZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSB0cnVlIH0gPSB7fSkge1xuICBsZXQgcmVzdWx0ID0ge307XG4gIC8vIHBpY2vjgIFvbWl0IOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICBwaWNrID0gbmFtZXNUb0FycmF5KHBpY2ssIHsgc2VwYXJhdG9yIH0pO1xuICBvbWl0ID0gbmFtZXNUb0FycmF5KG9taXQsIHsgc2VwYXJhdG9yIH0pO1xuICBsZXQgX2tleXMgPSBbXTtcbiAgLy8gcGlja+acieWAvOebtOaOpeaLv++8jOS4uuepuuaXtuagueaNriBlbXB0eVBpY2sg6buY6K6k5ou/56m65oiW5YWo6YOoa2V5XG4gIF9rZXlzID0gcGljay5sZW5ndGggPiAwIHx8IGVtcHR5UGljayA9PT0gJ2VtcHR5JyA/IHBpY2sgOiBrZXlzKG9iamVjdCwgeyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9KTtcbiAgLy8gb21pdOetm+mAiVxuICBfa2V5cyA9IF9rZXlzLmZpbHRlcihrZXkgPT4gIW9taXQuaW5jbHVkZXMoa2V5KSk7XG4gIGZvciAoY29uc3Qga2V5IG9mIF9rZXlzKSB7XG4gICAgY29uc3QgZGVzYyA9IGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuICAgIC8vIOWxnuaAp+S4jeWtmOWcqOWvvOiHtGRlc2PlvpfliLB1bmRlZmluZWTml7bkuI3orr7nva7lgLxcbiAgICBpZiAoZGVzYykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICog6YCa6L+H5oyR6YCJ5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVy55qE566A5YaZ5pa55byPXG4gKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICogQHBhcmFtIGtleXMge3N0cmluZ3xhcnJheX0g5bGe5oCn5ZCN6ZuG5ZCIXG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fSDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGljayhvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBmaWx0ZXIob2JqZWN0LCB7IHBpY2s6IGtleXMsIGVtcHR5UGljazogJ2VtcHR5JywgLi4ub3B0aW9ucyB9KTtcbn1cbi8qKlxuICog6YCa6L+H5o6S6Zmk5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVy55qE566A5YaZ5pa55byPXG4gKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICogQHBhcmFtIGtleXMge3N0cmluZ3xhcnJheX0g5bGe5oCn5ZCN6ZuG5ZCIXG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fSDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gb21pdChvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBmaWx0ZXIob2JqZWN0LCB7IG9taXQ6IGtleXMsIC4uLm9wdGlvbnMgfSk7XG59XG4iLCIvKipcbiAqIOe7keWumnRoaXPjgILluLjnlKjkuo7op6PmnoTlh73mlbDml7bnu5Hlrpp0aGlz6YG/5YWN5oql6ZSZXG4gKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoVxuICogQHBhcmFtIG9wdGlvbnMge29iamVjdH0g6YCJ6aG544CC5omp5bGV55SoXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRUaGlzKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBuZXcgUHJveHkodGFyZ2V0LCB7XG4gICAgZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQoLi4uYXJndW1lbnRzKTtcbiAgICAgIC8vIOWHveaVsOexu+Wei+e7keWumnRoaXNcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blsZ7mgKfljp/moLfov5Tlm55cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICB9KTtcbn1cbiIsIi8qKlxuICog6aaW5a2X5q+N5aSn5YaZXG4gKiBAcGFyYW0gbmFtZSB7c3RyaW5nfVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvRmlyc3RVcHBlckNhc2UobmFtZSA9ICcnKSB7XG4gIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9VcHBlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbn1cbi8qKlxuICog6aaW5a2X5q+N5bCP5YaZXG4gKiBAcGFyYW0gbmFtZSB7c3RyaW5nfSDlkI3np7BcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0ZpcnN0TG93ZXJDYXNlKG5hbWUgPSAnJykge1xuICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvTG93ZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG59XG4vKipcbiAqIOi9rOmpvOWzsOWRveWQjeOAguW4uOeUqOS6jui/nuaOpeespuWRveWQjei9rOmpvOWzsOWRveWQje+8jOWmgiB4eC1uYW1lIC0+IHh4TmFtZVxuICogQHBhcmFtIG5hbWUge3N0cmluZ30g5ZCN56ewXG4gKiBAcGFyYW0gc2VwYXJhdG9yIHtzdHJpbmd9IOi/nuaOpeespuOAgueUqOS6jueUn+aIkOato+WImSDpu5jorqTkuLrkuK3liJLnur8gLSDlr7nlupRyZWdleHDlvpfliLAgLy0oXFx3KS9nXG4gKiBAcGFyYW0gZmlyc3Qge3N0cmluZyxib29sZWFufSDpppblrZfmr43lpITnkIbmlrnlvI/jgIJ0cnVlIOaIliAndXBwZXJjYXNlJ++8mui9rOaNouaIkOWkp+WGmTtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSDmiJYgJ2xvd2VyY2FzZSfvvJrovazmjaLmiJDlsI/lhpk7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Jhdycg5oiWIOWFtuS7luaXoOaViOWAvO+8mum7mOiupOWOn+agt+i/lOWbnu+8jOS4jei/m+ihjOWkhOeQhjtcbiAqIEByZXR1cm5zIHtNYWdpY1N0cmluZ3xzdHJpbmd8c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9DYW1lbENhc2UobmFtZSwgeyBzZXBhcmF0b3IgPSAnLScsIGZpcnN0ID0gJ3JhdycgfSA9IHt9KSB7XG4gIC8vIOeUn+aIkOato+WImVxuICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke3NlcGFyYXRvcn0oXFxcXHcpYCwgJ2cnKTtcbiAgLy8g5ou85o6l5oiQ6am85bOwXG4gIGNvbnN0IGNhbWVsTmFtZSA9IG5hbWUucmVwbGFjZUFsbChyZWdleHAsIChzdWJzdHIsICQxKSA9PiB7XG4gICAgcmV0dXJuICQxLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xuICAvLyDpppblrZfmr43lpKflsI/lhpnmoLnmja7kvKDlj4LliKTmlq1cbiAgaWYgKFt0cnVlLCAndXBwZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgcmV0dXJuIHRvRmlyc3RVcHBlckNhc2UoY2FtZWxOYW1lKTtcbiAgfVxuICBpZiAoW2ZhbHNlLCAnbG93ZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgcmV0dXJuIHRvRmlyc3RMb3dlckNhc2UoY2FtZWxOYW1lKTtcbiAgfVxuICByZXR1cm4gY2FtZWxOYW1lO1xufVxuLyoqXG4gKiDovazov57mjqXnrKblkb3lkI3jgILluLjnlKjkuo7pqbzls7Dlkb3lkI3ovazov57mjqXnrKblkb3lkI3vvIzlpoIgeHhOYW1lIC0+IHh4LW5hbWVcbiAqIEBwYXJhbSBuYW1lIHtzdHJpbmd9IOWQjeensFxuICogQHBhcmFtIHNlcGFyYXRvciB7c3RyaW5nfSDov57mjqXnrKZcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0xpbmVDYXNlKG5hbWUgPSAnJywgeyBzZXBhcmF0b3IgPSAnLScgfSA9IHt9KSB7XG4gIHJldHVybiBuYW1lXG4gICAgLy8g5oyJ6L+e5o6l56ym5ou85o6lXG4gICAgLnJlcGxhY2VBbGwoLyhbYS16XSkoW0EtWl0pL2csIGAkMSR7c2VwYXJhdG9yfSQyYClcbiAgICAvLyDovazlsI/lhplcbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cbiIsIi8vIOWkhOeQhnZ1ZeaVsOaNrueUqFxuaW1wb3J0IHsgdG9DYW1lbENhc2UsIHRvTGluZUNhc2UgfSBmcm9tICcuL19TdHJpbmcnO1xuaW1wb3J0IHsgZGVlcFVud3JhcCwgZ2V0RXhhY3RUeXBlIH0gZnJvbSAnLi9EYXRhJztcblxuLyoqXG4gKiDmt7Hop6PljIV2dWUz5ZON5bqU5byP5a+56LGh5pWw5o2uXG4gKiBAcGFyYW0gZGF0YSB7Kn1cbiAqIEByZXR1cm5zIHsoKnx7W3A6IHN0cmluZ106ICp9KVtdfCp8e1twOiBzdHJpbmddOiAqfXx7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiAqfX19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwVW53cmFwVnVlMyhkYXRhKSB7XG4gIHJldHVybiBkZWVwVW53cmFwKGRhdGEsIHtcbiAgICBpc1dyYXA6IGRhdGEgPT4gZGF0YT8uX192X2lzUmVmLFxuICAgIHVud3JhcDogZGF0YSA9PiBkYXRhLnZhbHVlLFxuICB9KTtcbn1cbi8qKlxuICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAqIEBwYXJhbSBwcm9wRGVmaW5pdGlvbnMgcHJvcHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvcHNGcm9tQXR0cnMoYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAvLyBwcm9wcyDlrprkuYnnu5/kuIDmiJDlr7nosaHmoLzlvI/vvIx0eXBlIOe7n+S4gOaIkOaVsOe7hOagvOW8j+S7peS+v+WQjue7reWIpOaWrVxuICBpZiAocHJvcERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFt0b0NhbWVsQ2FzZShuYW1lKSwgeyB0eXBlOiBbXSB9XSkpO1xuICB9IGVsc2UgaWYgKGdldEV4YWN0VHlwZShwcm9wRGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKS5tYXAoKFtuYW1lLCBkZWZpbml0aW9uXSkgPT4ge1xuICAgICAgZGVmaW5pdGlvbiA9IGdldEV4YWN0VHlwZShkZWZpbml0aW9uKSA9PT0gT2JqZWN0XG4gICAgICAgID8geyAuLi5kZWZpbml0aW9uLCB0eXBlOiBbZGVmaW5pdGlvbi50eXBlXS5mbGF0KCkgfVxuICAgICAgICA6IHsgdHlwZTogW2RlZmluaXRpb25dLmZsYXQoKSB9O1xuICAgICAgcmV0dXJuIFt0b0NhbWVsQ2FzZShuYW1lKSwgZGVmaW5pdGlvbl07XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IHt9O1xuICB9XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgLy8gcHJvcE5hbWUg5oiWIHByb3AtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSB0b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgLy8g5Y+q5YyF5ZCrQm9vbGVhbuexu+Wei+eahCcn6L2s5o2i5Li6dHJ1Ze+8jOWFtuS7luWOn+agt+i1i+WAvFxuICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGRlZmluaXRpb24udHlwZS5sZW5ndGggPT09IDEgJiYgZGVmaW5pdGlvbi50eXBlLmluY2x1ZGVzKEJvb2xlYW4pICYmIGF0dHJWYWx1ZSA9PT0gJycgPyB0cnVlIDogYXR0clZhbHVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBwcm9wLW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICBpZiAoZW5kKSB7IHJldHVybjsgfVxuICAgICAgc2V0UmVzdWx0KHsgbmFtZTogdG9MaW5lQ2FzZShuYW1lKSwgZGVmaW5pdGlvbiwgZW5kOiB0cnVlIH0pO1xuICAgIH0pKHtcbiAgICAgIG5hbWUsIGRlZmluaXRpb24sXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICog5LuOIGF0dHJzIOS4reaPkOWPliBlbWl0cyDlrprkuYnnmoTlsZ7mgKdcbiAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAqIEBwYXJhbSBlbWl0RGVmaW5pdGlvbnMgZW1pdHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1pdHNGcm9tQXR0cnMoYXR0cnMsIGVtaXREZWZpbml0aW9ucykge1xuICAvLyBlbWl0cyDlrprkuYnnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgaWYgKGdldEV4YWN0VHlwZShlbWl0RGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICB9IGVsc2UgaWYgKCEoZW1pdERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgZW1pdERlZmluaXRpb25zID0gW107XG4gIH1cbiAgLy8g57uf5LiA5aSE55CG5oiQIG9uRW1pdE5hbWXjgIFvblVwZGF0ZTplbWl0TmFtZSh2LW1vZGVs57O75YiXKSDmoLzlvI9cbiAgY29uc3QgZW1pdE5hbWVzID0gZW1pdERlZmluaXRpb25zLm1hcChuYW1lID0+IHRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgKGZ1bmN0aW9uIHNldFJlc3VsdCh7IG5hbWUsIGVuZCA9IGZhbHNlIH0pIHtcbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uVXBkYXRlOicpKSB7XG4gICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gdG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBhdHRyc1tuYW1lXTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25VcGRhdGU6ZW1pdC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgICBpZiAoZW5kKSB7IHJldHVybjsgfVxuICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHt0b0xpbmVDYXNlKG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKSl9YCwgZW5kOiB0cnVlIH0pO1xuICAgICAgfVxuICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgcmVzdWx0W25hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICB9XG4gICAgfSkoeyBuYW1lIH0pO1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDku44gYXR0cnMg5Lit5o+Q5Y+W5Ymp5L2Z5bGe5oCn44CC5bi455So5LqO57uE5Lu2aW5oZXJpdEF0dHJz6K6+572uZmFsc2Xml7bkvb/nlKjkvZzkuLrmlrDnmoRhdHRyc1xuICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICogQHBhcmFtIHt9IOmFjee9rumhuVxuICogICAgICAgICAgQHBhcmFtIHByb3BzIHByb3BzIOWumuS5iSDmiJYgdnVlIHByb3Bz77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICogICAgICAgICAgQHBhcmFtIGVtaXRzIGVtaXRzIOWumuS5iSDmiJYgdnVlIGVtaXRz77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICogICAgICAgICAgQHBhcmFtIGxpc3Qg6aKd5aSW55qE5pmu6YCa5bGe5oCnXG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXN0RnJvbUF0dHJzKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAvLyDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgcHJvcHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAocHJvcHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICB9XG4gICAgICBpZiAoZ2V0RXhhY3RUeXBlKHByb3BzKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcChuYW1lID0+IFt0b0NhbWVsQ2FzZShuYW1lKSwgdG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgfSkoKTtcbiAgZW1pdHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAoZW1pdHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gZW1pdHM7XG4gICAgICB9XG4gICAgICBpZiAoZ2V0RXhhY3RUeXBlKGVtaXRzKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcCgobmFtZSkgPT4ge1xuICAgICAgLy8gdXBkYXRlOmVtaXROYW1lIOaIliB1cGRhdGU6ZW1pdC1uYW1lIOagvOW8j1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgIGNvbnN0IHBhcnROYW1lID0gbmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpO1xuICAgICAgICByZXR1cm4gW2BvblVwZGF0ZToke3RvQ2FtZWxDYXNlKHBhcnROYW1lKX1gLCBgb25VcGRhdGU6JHt0b0xpbmVDYXNlKHBhcnROYW1lKX1gXTtcbiAgICAgIH1cbiAgICAgIC8vIG9uRW1pdE5hbWXmoLzlvI/vvIzkuK3liJLnur/moLzlvI/lt7Looqt2dWXovazmjaLkuI3nlKjph43lpI3lpITnkIZcbiAgICAgIHJldHVybiBbdG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKV07XG4gICAgfSkuZmxhdCgpO1xuICB9KSgpO1xuICBsaXN0ID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSBnZXRFeGFjdFR5cGUobGlzdCkgPT09IFN0cmluZ1xuICAgICAgPyBsaXN0LnNwbGl0KCcsJylcbiAgICAgIDogbGlzdCBpbnN0YW5jZW9mIEFycmF5ID8gbGlzdCA6IFtdO1xuICAgIHJldHVybiBhcnIubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH0pKCk7XG4gIGNvbnN0IGxpc3RBbGwgPSBBcnJheS5mcm9tKG5ldyBTZXQoW3Byb3BzLCBlbWl0cywgbGlzdF0uZmxhdCgpKSk7XG4gIC8vIGNvbnNvbGUubG9nKCdsaXN0QWxsJywgbGlzdEFsbCk7XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKGF0dHJzKSkpIHtcbiAgICBpZiAoIWxpc3RBbGwuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIG5hbWUsIGRlc2MpO1xuICAgIH1cbiAgfVxuICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8vIOWkhOeQhuagt+W8j+eUqFxuLyoqXG4gKiDluKbljZXkvY3lrZfnrKbkuLLjgILlr7nmlbDlrZfmiJbmlbDlrZfmoLzlvI/nmoTlrZfnrKbkuLLoh6rliqjmi7zljZXkvY3vvIzlhbbku5blrZfnrKbkuLLljp/moLfov5Tlm55cbiAqIEBwYXJhbSB2YWx1ZSB7bnVtYmVyfHN0cmluZ30g5YC8XG4gKiBAcGFyYW0gdW5pdCDljZXkvY3jgIJ2YWx1ZeayoeW4puWNleS9jeaXtuiHquWKqOaLvOaOpe+8jOWPr+S8oCBweC9lbS8lIOetiVxuICogQHJldHVybnMge3N0cmluZ3xzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvblxuZ2V0VW5pdFN0cmluZyh2YWx1ZSA9ICcnLCB7IHVuaXQgPSAncHgnIH0gPSB7fSkge1xuICBpZiAodmFsdWUgPT09ICcnKSB7IHJldHVybiAnJzsgfVxuICAvLyDms6jmhI/vvJrov5nph4zkvb/nlKggPT0g5Yik5pat77yM5LiN5L2/55SoID09PVxuICByZXR1cm4gTnVtYmVyKHZhbHVlKSA9PSB2YWx1ZSA/IGAke3ZhbHVlfSR7dW5pdH1gIDogU3RyaW5nKHZhbHVlKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ1ksTUFBQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLFFBQVEsR0FBRztBQUMzQyxFQUFFLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7QUFDOUQsSUFBSSxPQUFPLFNBQVMsQ0FBQztBQUNyQixHQUFHO0FBQ0gsRUFBRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxVQUFVLEtBQUssTUFBTSxFQUFFO0FBQzlELElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNILEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDLElBQUk7QUFDTDtBQUNPLFNBQVMsSUFBSSxHQUFHLEVBQUU7QUFDekI7QUFDTyxTQUFTLEtBQUssR0FBRztBQUN4QixFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUNEO0FBQ08sU0FBUyxJQUFJLEdBQUc7QUFDdkIsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFDRDtBQUNPLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRTtBQUMzQixFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUNEO0FBQ08sU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3pCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFD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
