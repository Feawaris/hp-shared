/*!
 * hp-shared v0.2.1
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"esm","sourcemap":"inline"}
 */
  
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
function assign$2(target = {}, ...sources) {
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
function keys$1(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
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
      const parentKeys = keys$1(__proto__, options);
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
  const _keys = keys$1(object, options);
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
  const _keys = keys$1(object, options);
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
  _keys = pick.length > 0 || emptyPick === 'empty' ? pick : keys$1(object, { symbol, notEnumerable, extend });
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
  assign: assign$2,
  deepAssign: deepAssign,
  descriptor: descriptor,
  descriptorEntries: descriptorEntries,
  descriptors: descriptors,
  filter: filter,
  keys: keys$1,
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
  const result = deepClone(target);
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
            if (getExactType(val) === Object) {
              sourceRuleValue[valIndex] = deepAssign(sourceRuleValue[valIndex] ?? {}, val);
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
      if (getExactType(value) === Object) {
        deepAssign(result[key] = result[key] ?? {}, value);
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

export { index$4 as base, index$3 as dev, index$2 as network, index as storage };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL2NvbnN0YW50cy5qcyIsIi4uLy4uL3NyYy9iYXNlL0RhdGEuanMiLCIuLi8uLi9zcmMvYmFzZS9fRGF0ZS5qcyIsIi4uLy4uL3NyYy9iYXNlL19NYXRoLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1NldC5qcyIsIi4uLy4uL3NyYy9iYXNlL19SZWZsZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX09iamVjdC5qcyIsIi4uLy4uL3NyYy9iYXNlL19Qcm94eS5qcyIsIi4uLy4uL3NyYy9iYXNlL19TdHJpbmcuanMiLCIuLi8uLi9zcmMvYmFzZS9WdWVEYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3R5bGUuanMiLCIuLi8uLi9zcmMvZGV2L2VzbGludC5qcyIsIi4uLy4uL3NyYy9kZXYvdml0ZS5qcyIsIi4uLy4uL3NyYy9uZXR3b3JrL2NvbW1vbi5qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvY2xpcGJvYXJkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2pzLWNvb2tpZUAzLjAuNS9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLm1qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvY29va2llLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2lkYi1rZXl2YWxANi4yLjEvbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pbmRleC5qcyIsIi4uLy4uL3NyYy9zdG9yYWdlL2Jyb3dzZXIvc3RvcmFnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDluLjph4/jgILluLjnlKjkuo7pu5jorqTkvKDlj4LnrYnlnLrmma9cbi8vIGpz6L+Q6KGM546v5aKDXG5leHBvcnQgY29uc3QgSlNfRU5WID0gKGZ1bmN0aW9uIGdldEpzRW52KCkge1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcyA9PT0gd2luZG93KSB7XG4gICAgcmV0dXJuICdicm93c2VyJztcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcyA9PT0gZ2xvYmFsKSB7XG4gICAgcmV0dXJuICdub2RlJztcbiAgfVxuICByZXR1cm4gJyc7XG59KSgpO1xuLy8g56m65Ye95pWwXG5leHBvcnQgZnVuY3Rpb24gTk9PUCgpIHt9XG4vLyDov5Tlm54gZmFsc2VcbmV4cG9ydCBmdW5jdGlvbiBGQUxTRSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuLy8g6L+U5ZueIHRydWVcbmV4cG9ydCBmdW5jdGlvbiBUUlVFKCkge1xuICByZXR1cm4gdHJ1ZTtcbn1cbi8vIOWOn+agt+i/lOWbnlxuZXhwb3J0IGZ1bmN0aW9uIFJBVyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG4vLyBjYXRjaCDlhoXnmoTplJnor6/ljp/moLfmipvlh7rljrtcbmV4cG9ydCBmdW5jdGlvbiBUSFJPVyhlKSB7XG4gIHRocm93IGU7XG59XG4iLCIvLyDlpITnkIblpJrmoLzlvI/mlbDmja7nlKhcbmltcG9ydCB7IEZBTFNFLCBSQVcgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8vIOeugOWNleexu+Wei1xuZXhwb3J0IGNvbnN0IFNJTVBMRV9UWVBFUyA9IFtudWxsLCB1bmRlZmluZWQsIE51bWJlciwgU3RyaW5nLCBCb29sZWFuLCBCaWdJbnQsIFN5bWJvbF07XG4vKipcbiAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei1xuICogQHBhcmFtIHZhbHVlIHsqfSDlgLxcbiAqIEByZXR1cm5zIHtPYmplY3RDb25zdHJ1Y3RvcnwqfEZ1bmN0aW9ufSDov5Tlm57lr7nlupTmnoTpgKDlh73mlbDjgIJudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXhhY3RUeXBlKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgLy8gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGh5pe2IF9fcHJvdG9fXyDkuLogbnVsbFxuICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDlr7nlupTnu6fmib/nmoTlr7nosaEgX19wcm90b19fIOayoeaciSBjb25zdHJ1Y3RvciDlsZ7mgKdcbiAgY29uc3QgaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gISgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXyk7XG4gIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCcsIF9fcHJvdG9fXyk7XG4gICAgcmV0dXJuIE9iamVjdDtcbiAgfVxuICAvLyDov5Tlm57lr7nlupTmnoTpgKDlh73mlbBcbiAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3Rvcjtcbn1cbi8qKlxuICog6I635Y+W5YC855qE5YW35L2T57G75Z6L5YiX6KGoXG4gKiBAcGFyYW0gdmFsdWUgeyp9IOWAvFxuICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeGFjdFR5cGVzKHZhbHVlKSB7XG4gIC8vIG51bGzjgIF1bmRlZmluZWQg5Yik5pat5aSE55CGXG4gIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gW3ZhbHVlXTtcbiAgfVxuICAvLyDmiavljp/lnovpk77lvpfliLDlr7nlupTmnoTpgKDlh73mlbBcbiAgbGV0IHJlc3VsdCA9IFtdO1xuICBsZXQgbG9vcCA9IDA7XG4gIGxldCBoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gZmFsc2U7XG4gIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIC8vIGNvbnNvbGUud2Fybignd2hpbGUnLCBsb29wLCBfX3Byb3RvX18pO1xuICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgIC8vIOS4gOi/m+adpSBfX3Byb3RvX18g5bCx5pivIG51bGwg6K+05piOIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoVxuICAgICAgaWYgKGxvb3AgPD0gMCkge1xuICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKCdjb25zdHJ1Y3RvcicgaW4gX19wcm90b19fKSB7XG4gICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgfVxuICAgIF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihfX3Byb3RvX18pO1xuICAgIGxvb3ArKztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDmt7Hmi7fotJ3mlbDmja5cbiAqIEBwYXJhbSBzb3VyY2Ugeyp9XG4gKiBAcmV0dXJucyB7TWFwPGFueSwgYW55PnxTZXQ8YW55Pnx7fXwqfCpbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDbG9uZShzb3VyY2UpIHtcbiAgLy8g5pWw57uEXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHNvdXJjZS52YWx1ZXMoKSkge1xuICAgICAgcmVzdWx0LnB1c2goZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gU2V0XG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IHZhbHVlIG9mIHNvdXJjZS52YWx1ZXMoKSkge1xuICAgICAgcmVzdWx0LmFkZChkZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyBNYXBcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHNvdXJjZS5lbnRyaWVzKCkpIHtcbiAgICAgIHJlc3VsdC5zZXQoa2V5LCBkZWVwQ2xvbmUodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlr7nosaFcbiAgaWYgKGdldEV4YWN0VHlwZShzb3VyY2UpID09PSBPYmplY3QpIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAvLyB2YWx1ZeaWueW8j++8mumAkuW9kuWkhOeQhlxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIHtcbiAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgIHZhbHVlOiBkZWVwQ2xvbmUoZGVzYy52YWx1ZSksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0L3NldCDmlrnlvI/vvJrnm7TmjqXlrprkuYlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICAvLyDlhbbku5bvvJrljp/moLfov5Tlm55cbiAgcmV0dXJuIHNvdXJjZTtcbn1cbi8qKlxuICog5rex6Kej5YyF5pWw5o2uXG4gKiBAcGFyYW0gZGF0YSB7Kn0g5YC8XG4gKiBAcGFyYW0gaXNXcmFwIHtmdW5jdGlvbn0g5YyF6KOF5pWw5o2u5Yik5pat5Ye95pWw77yM5aaCdnVlM+eahGlzUmVm5Ye95pWwXG4gKiBAcGFyYW0gdW53cmFwIHtmdW5jdGlvbn0g6Kej5YyF5pa55byP5Ye95pWw77yM5aaCdnVlM+eahHVucmVm5Ye95pWwXG4gKiBAcmV0dXJucyB7KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfCp8e1twOiBzdHJpbmddOiBhbnl9fHtbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcFVud3JhcChkYXRhLCB7IGlzV3JhcCA9IEZBTFNFLCB1bndyYXAgPSBSQVcgfSA9IHt9KSB7XG4gIC8vIOmAiemhueaUtumbhlxuICBjb25zdCBvcHRpb25zID0geyBpc1dyYXAsIHVud3JhcCB9O1xuICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gIGlmIChpc1dyYXAoZGF0YSkpIHtcbiAgICByZXR1cm4gZGVlcFVud3JhcCh1bndyYXAoZGF0YSksIG9wdGlvbnMpO1xuICB9XG4gIC8vIOmAkuW9kuWkhOeQhueahOexu+Wei1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIGRhdGEubWFwKHZhbCA9PiBkZWVwVW53cmFwKHZhbCwgb3B0aW9ucykpO1xuICB9XG4gIGlmIChnZXRFeGFjdFR5cGUoZGF0YSkgPT09IE9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICByZXR1cm4gW2tleSwgZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpXTtcbiAgICB9KSk7XG4gIH1cbiAgLy8g5YW25LuW5Y6f5qC36L+U5ZueXG4gIHJldHVybiBkYXRhO1xufVxuIiwiaW1wb3J0IHsgZ2V0RXhhY3RUeXBlIH0gZnJvbSAnLi9EYXRhJztcblxuLyoqXG4gKiDliJvlu7pEYXRl5a+56LGhXG4gKiBAcGFyYW0gYXJncyB7KltdfSDlpJrkuKrlgLxcbiAqIEByZXR1cm5zIHtEYXRlfCp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoLi4uYXJncykge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICBjb25zdCB2YWx1ZSA9IGFyZ3VtZW50c1swXTtcbiAgICBjb25zdCB2YWx1ZVJlc3VsdCA9IGdldEV4YWN0VHlwZSh2YWx1ZSkgPT09IFN0cmluZyA/IHZhbHVlLnJlcGxhY2VBbGwoJy0nLCAnLycpIDogdmFsdWU7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlUmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICAvLyDkvKDlj4LooYzkuLrlhYjlkoxEYXRl5LiA6Ie077yM5ZCO57ut5YaN5pS26ZuG6ZyA5rGC5Yqg5by65a6a5Yi2KOazqOaEj+aXoOWPguWSjOaYvuW8j3VuZGVmaW5lZOeahOWMuuWIqylcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMCA/IG5ldyBEYXRlKCkgOiBuZXcgRGF0ZSguLi5hcmd1bWVudHMpO1xuICB9XG59XG4iLCIvLyDlop7liqDpg6jliIblkb3lkI3ku6XmjqXov5HmlbDlrablhpnms5VcbmV4cG9ydCBjb25zdCBhcmNzaW4gPSBNYXRoLmFzaW4uYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBhcmNjb3MgPSBNYXRoLmFjb3MuYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBhcmN0YW4gPSBNYXRoLmF0YW4uYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBhcnNpbmggPSBNYXRoLmFzaW5oLmJpbmQoTWF0aCk7XG5leHBvcnQgY29uc3QgYXJjb3NoID0gTWF0aC5hY29zaC5iaW5kKE1hdGgpO1xuZXhwb3J0IGNvbnN0IGFydGFuaCA9IE1hdGguYXRhbmguYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBsb2dlID0gTWF0aC5sb2cuYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBsbiA9IGxvZ2U7XG5leHBvcnQgY29uc3QgbGcgPSBNYXRoLmxvZzEwLmJpbmQoTWF0aCk7XG5leHBvcnQgZnVuY3Rpb24gbG9nKGEsIHgpIHtcbiAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5sb2coYSk7XG59XG4iLCIvKipcbiAqIOWKoOW8umFkZOaWueazleOAgui3n+aVsOe7hHB1c2jmlrnms5XkuIDmoLflj6/mt7vliqDlpJrkuKrlgLxcbiAqIEBwYXJhbSBzZXQge1NldH0g55uu5qCHc2V0XG4gKiBAcGFyYW0gYXJncyB7KltdfSDlpJrkuKrlgLxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZChzZXQsIC4uLmFyZ3MpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIHNldC5hZGQoYXJnKTtcbiAgfVxufVxuIiwiLy8g5a+5IG93bktleXMg6YWN5aWXIG93blZhbHVlcyDlkowgb3duRW50cmllc1xuZXhwb3J0IGZ1bmN0aW9uIG93blZhbHVlcyh0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG93bkVudHJpZXModGFyZ2V0KSB7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IFtrZXksIHRhcmdldFtrZXldXSk7XG59XG4iLCJpbXBvcnQgeyBhZGQgfSBmcm9tICcuL19TZXQnO1xuaW1wb3J0IHsgb3duRW50cmllcyB9IGZyb20gJy4vX1JlZmxlY3QnO1xuaW1wb3J0IHsgZ2V0RXhhY3RUeXBlIH0gZnJvbSAnLi9EYXRhJztcblxuLyoqXG4gKiDlsZ7mgKflkI3nu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAqIEBwYXJhbSBuYW1lcyB7c3RyaW5nfFN5bWJvbHxhcnJheX0g5bGe5oCn5ZCN44CC5qC85byPICdhLGIsYycg5oiWIFsnYScsJ2InLCdjJ11cbiAqIEBwYXJhbSBzZXBhcmF0b3Ige3N0cmluZ3xSZWdFeHB9IG5hbWVzIOS4uuWtl+espuS4suaXtueahOaLhuWIhuinhOWImeOAguWQjCBzcGxpdCDmlrnms5XnmoQgc2VwYXJhdG9y77yM5a2X56ym5Liy5peg6ZyA5ouG5YiG55qE5Y+v5Lul5LygIG51bGwg5oiWIHVuZGVmaW5lZFxuICogQHJldHVybnMgeypbXVtdfChNYWdpY1N0cmluZyB8IEJ1bmRsZSB8IHN0cmluZylbXXxGbGF0QXJyYXk8KEZsYXRBcnJheTwoKnxbKltdXXxbXSlbXSwgMT5bXXwqfFsqW11dfFtdKVtdLCAxPltdfCpbXX1cbiAqL1xuZnVuY3Rpb24gbmFtZXNUb0FycmF5KG5hbWVzID0gW10sIHsgc2VwYXJhdG9yID0gJywnIH0gPSB7fSkge1xuICBpZiAobmFtZXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBuYW1lcy5tYXAodmFsID0+IG5hbWVzVG9BcnJheSh2YWwpKS5mbGF0KCk7XG4gIH1cbiAgY29uc3QgZXhhY3RUeXBlID0gZ2V0RXhhY3RUeXBlKG5hbWVzKTtcbiAgaWYgKGV4YWN0VHlwZSA9PT0gU3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVzLnNwbGl0KHNlcGFyYXRvcikubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH1cbiAgaWYgKGV4YWN0VHlwZSA9PT0gU3ltYm9sKSB7XG4gICAgcmV0dXJuIFtuYW1lc107XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KFN5bWJvbCgpKSk7XG4vLyBjb25zb2xlLmxvZyhuYW1lc1RvQXJyYXkoWydhJywgJ2InLCAnYycsIFN5bWJvbCgpXSkpO1xuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KCdhLGIsYycpKTtcbi8vIGNvbnNvbGUubG9nKG5hbWVzVG9BcnJheShbJ2EsYixjJywgU3ltYm9sKCldKSk7XG5cbi8qKlxuICog5rWF5ZCI5bm25a+56LGh44CC5YaZ5rOV5ZCMIE9iamVjdC5hc3NpZ25cbiAqIOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICogQHBhcmFtIHRhcmdldCB7b2JqZWN0fSDnm67moIflr7nosaFcbiAqIEBwYXJhbSBzb3VyY2VzIHthbnlbXX0g5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgLy8g5LiN5L2/55SoIHRhcmdldFtrZXldPXZhbHVlIOWGmeazle+8jOebtOaOpeS9v+eUqGRlc2Pph43lrprkuYlcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuLyoqXG4gKiDmt7HlkIjlubblr7nosaHjgILlkIwgYXNzaWduIOS4gOagt+S5n+S8muWvueWxnuaAp+i/m+ihjOmHjeWumuS5iVxuICogQHBhcmFtIHRhcmdldCB7b2JqZWN0fSDnm67moIflr7nosaHjgILpu5jorqTlgLwge30g6Ziy5q2i6YCS5b2S5pe25oqlIFR5cGVFcnJvcjogT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0XG4gKiBAcGFyYW0gc291cmNlcyB7YW55W119IOaVsOaNrua6kOOAguS4gOS4quaIluWkmuS4quWvueixoVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVlcEFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSkge1xuICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAvLyB2YWx1ZeWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICBpZiAoZ2V0RXhhY3RUeXBlKGRlc2MudmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgIC4uLmRlc2MsXG4gICAgICAgICAgICB2YWx1ZTogZGVlcEFzc2lnbih0YXJnZXRba2V5XSwgZGVzYy52YWx1ZSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ2V0L3NldOWGmeazle+8muebtOaOpeWumuS5iVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuLyoqXG4gKiBrZXnoh6rouqvmiYDlsZ7nmoTlr7nosaFcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0ga2V5IHtzdHJpbmd8U3ltYm9sfSDlsZ7mgKflkI1cbiAqIEByZXR1cm5zIHsqfG51bGx9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvd25lcihvYmplY3QsIGtleSkge1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgbGV0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIG93bmVyKF9fcHJvdG9fXywga2V5KTtcbn1cbi8qKlxuICog6I635Y+W5bGe5oCn5o+P6L+w5a+56LGh77yM55u45q+UIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3LvvIzog73mi7/liLDnu6fmib/lsZ7mgKfnmoTmj4/ov7Dlr7nosaFcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH1cbiAqIEBwYXJhbSBrZXkge3N0cmluZ3xTeW1ib2x9XG4gKiBAcmV0dXJucyB7UHJvcGVydHlEZXNjcmlwdG9yfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzY3JpcHRvcihvYmplY3QsIGtleSkge1xuICBjb25zdCBmaW5kT2JqZWN0ID0gb3duZXIob2JqZWN0LCBrZXkpO1xuICBpZiAoIWZpbmRPYmplY3QpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZpbmRPYmplY3QsIGtleSk7XG59XG4vKipcbiAqIOiOt+WPluWxnuaAp+WQjeOAgum7mOiupOWPguaVsOmFjee9ruaIkOWQjCBPYmplY3Qua2V5cyDooYzkuLpcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0gc3ltYm9sIHtib29sZWFufSDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gKiBAcmV0dXJucyB7YW55W119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrZXlzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgLy8g6YCJ6aG55pS26ZuGXG4gIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gIC8vIHNldOeUqOS6jmtleeWOu+mHjVxuICBsZXQgc2V0ID0gbmV3IFNldCgpO1xuICAvLyDoh6rouqvlsZ7mgKfnrZvpgIlcbiAgY29uc3QgZGVzY3MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3QpO1xuICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIG93bkVudHJpZXMoZGVzY3MpKSB7XG4gICAgLy8g5b+955Wlc3ltYm9s5bGe5oCn55qE5oOF5Ya1XG4gICAgaWYgKCFzeW1ib2wgJiYgZ2V0RXhhY3RUeXBlKGtleSkgPT09IFN5bWJvbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vIOW/veeVpeS4jeWPr+WIl+S4vuWxnuaAp+eahOaDheWGtVxuICAgIGlmICghbm90RW51bWVyYWJsZSAmJiAhZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8g5YW25LuW5bGe5oCn5Yqg5YWlXG4gICAgc2V0LmFkZChrZXkpO1xuICB9XG4gIC8vIOe7p+aJv+WxnuaAp1xuICBpZiAoZXh0ZW5kKSB7XG4gICAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgaWYgKF9fcHJvdG9fXyAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgcGFyZW50S2V5cyA9IGtleXMoX19wcm90b19fLCBvcHRpb25zKTtcbiAgICAgIGFkZChzZXQsIC4uLnBhcmVudEtleXMpO1xuICAgIH1cbiAgfVxuICAvLyDov5Tlm57mlbDnu4RcbiAgcmV0dXJuIEFycmF5LmZyb20oc2V0KTtcbn1cbi8qKlxuICog5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3Jz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAqIEBwYXJhbSBleHRlbmQge2Jvb2xlYW59IOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICogQHJldHVybnMge1Byb3BlcnR5RGVzY3JpcHRvcltdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzY3JpcHRvcnMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAvLyDpgInpobnmlLbpm4ZcbiAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgY29uc3QgX2tleXMgPSBrZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpKTtcbn1cbi8qKlxuICog5a+55bqUIGtleXMg6I635Y+WIGRlc2NyaXB0b3JFbnRyaWVz77yM5Lyg5Y+C5ZCMIGtleXMg5pa55rOV44CC5Y+v55So5LqO6YeN5a6a5LmJ5bGe5oCnXG4gKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAqIEBwYXJhbSBleHRlbmQge2Jvb2xlYW59IOaYr+WQpuWMheWQq+aJv+e7p+WxnuaAp1xuICogQHJldHVybnMge1tzdHJpbmd8U3ltYm9sLFByb3BlcnR5RGVzY3JpcHRvcl1bXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaXB0b3JFbnRyaWVzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgLy8g6YCJ6aG55pS26ZuGXG4gIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gIGNvbnN0IF9rZXlzID0ga2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICByZXR1cm4gX2tleXMubWFwKGtleSA9PiBba2V5LCBkZXNjcmlwdG9yKG9iamVjdCwga2V5KV0pO1xufVxuLyoqXG4gKiDpgInlj5blr7nosaFcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0gcGljayB7c3RyaW5nfGFycmF5fSDmjJHpgInlsZ7mgKdcbiAqIEBwYXJhbSBvbWl0IHtzdHJpbmd8YXJyYXl9IOW/veeVpeWxnuaAp1xuICogQHBhcmFtIGVtcHR5UGljayB7c3RyaW5nfSBwaWNrIOS4uuepuuaXtueahOWPluWAvOOAgmFsbCDlhajpg6hrZXnvvIxlbXB0eSDnqbpcbiAqIEBwYXJhbSBzZXBhcmF0b3Ige3N0cmluZ3xSZWdFeHB9IOWQjCBuYW1lc1RvQXJyYXkg55qEIHNlcGFyYXRvciDlj4LmlbBcbiAqIEBwYXJhbSBzeW1ib2wge2Jvb2xlYW59IOWQjCBrZXlzIOeahCBzeW1ib2wg5Y+C5pWwXG4gKiBAcGFyYW0gbm90RW51bWVyYWJsZSB7Ym9vbGVhbn0g5ZCMIGtleXMg55qEIG5vdEVudW1lcmFibGUg5Y+C5pWwXG4gKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDlkIwga2V5cyDnmoQgZXh0ZW5kIOWPguaVsFxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyKG9iamVjdCwgeyBwaWNrID0gW10sIG9taXQgPSBbXSwgZW1wdHlQaWNrID0gJ2FsbCcsIHNlcGFyYXRvciA9ICcsJywgc3ltYm9sID0gdHJ1ZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSB0cnVlIH0gPSB7fSkge1xuICBsZXQgcmVzdWx0ID0ge307XG4gIC8vIHBpY2vjgIFvbWl0IOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICBwaWNrID0gbmFtZXNUb0FycmF5KHBpY2ssIHsgc2VwYXJhdG9yIH0pO1xuICBvbWl0ID0gbmFtZXNUb0FycmF5KG9taXQsIHsgc2VwYXJhdG9yIH0pO1xuICBsZXQgX2tleXMgPSBbXTtcbiAgLy8gcGlja+acieWAvOebtOaOpeaLv++8jOS4uuepuuaXtuagueaNriBlbXB0eVBpY2sg6buY6K6k5ou/56m65oiW5YWo6YOoa2V5XG4gIF9rZXlzID0gcGljay5sZW5ndGggPiAwIHx8IGVtcHR5UGljayA9PT0gJ2VtcHR5JyA/IHBpY2sgOiBrZXlzKG9iamVjdCwgeyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9KTtcbiAgLy8gb21pdOetm+mAiVxuICBfa2V5cyA9IF9rZXlzLmZpbHRlcihrZXkgPT4gIW9taXQuaW5jbHVkZXMoa2V5KSk7XG4gIGZvciAoY29uc3Qga2V5IG9mIF9rZXlzKSB7XG4gICAgY29uc3QgZGVzYyA9IGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpO1xuICAgIC8vIOWxnuaAp+S4jeWtmOWcqOWvvOiHtGRlc2PlvpfliLB1bmRlZmluZWTml7bkuI3orr7nva7lgLxcbiAgICBpZiAoZGVzYykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICog6YCa6L+H5oyR6YCJ5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVy55qE566A5YaZ5pa55byPXG4gKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICogQHBhcmFtIGtleXMge3N0cmluZ3xhcnJheX0g5bGe5oCn5ZCN6ZuG5ZCIXG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fSDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGljayhvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBmaWx0ZXIob2JqZWN0LCB7IHBpY2s6IGtleXMsIGVtcHR5UGljazogJ2VtcHR5JywgLi4ub3B0aW9ucyB9KTtcbn1cbi8qKlxuICog6YCa6L+H5o6S6Zmk5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVy55qE566A5YaZ5pa55byPXG4gKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICogQHBhcmFtIGtleXMge3N0cmluZ3xhcnJheX0g5bGe5oCn5ZCN6ZuG5ZCIXG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fSDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gb21pdChvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBmaWx0ZXIob2JqZWN0LCB7IG9taXQ6IGtleXMsIC4uLm9wdGlvbnMgfSk7XG59XG4iLCIvKipcbiAqIOe7keWumnRoaXPjgILluLjnlKjkuo7op6PmnoTlh73mlbDml7bnu5Hlrpp0aGlz6YG/5YWN5oql6ZSZXG4gKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoVxuICogQHBhcmFtIG9wdGlvbnMge29iamVjdH0g6YCJ6aG544CC5omp5bGV55SoXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRUaGlzKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiBuZXcgUHJveHkodGFyZ2V0LCB7XG4gICAgZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQoLi4uYXJndW1lbnRzKTtcbiAgICAgIC8vIOWHveaVsOexu+Wei+e7keWumnRoaXNcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blsZ7mgKfljp/moLfov5Tlm55cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICB9KTtcbn1cbiIsIi8qKlxuICog6aaW5a2X5q+N5aSn5YaZXG4gKiBAcGFyYW0gbmFtZSB7c3RyaW5nfVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvRmlyc3RVcHBlckNhc2UobmFtZSA9ICcnKSB7XG4gIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9VcHBlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbn1cbi8qKlxuICog6aaW5a2X5q+N5bCP5YaZXG4gKiBAcGFyYW0gbmFtZSB7c3RyaW5nfSDlkI3np7BcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0ZpcnN0TG93ZXJDYXNlKG5hbWUgPSAnJykge1xuICByZXR1cm4gYCR7KG5hbWVbMF0gPz8gJycpLnRvTG93ZXJDYXNlKCl9JHtuYW1lLnNsaWNlKDEpfWA7XG59XG4vKipcbiAqIOi9rOmpvOWzsOWRveWQjeOAguW4uOeUqOS6jui/nuaOpeespuWRveWQjei9rOmpvOWzsOWRveWQje+8jOWmgiB4eC1uYW1lIC0+IHh4TmFtZVxuICogQHBhcmFtIG5hbWUge3N0cmluZ30g5ZCN56ewXG4gKiBAcGFyYW0gc2VwYXJhdG9yIHtzdHJpbmd9IOi/nuaOpeespuOAgueUqOS6jueUn+aIkOato+WImSDpu5jorqTkuLrkuK3liJLnur8gLSDlr7nlupRyZWdleHDlvpfliLAgLy0oXFx3KS9nXG4gKiBAcGFyYW0gZmlyc3Qge3N0cmluZyxib29sZWFufSDpppblrZfmr43lpITnkIbmlrnlvI/jgIJ0cnVlIOaIliAndXBwZXJjYXNlJ++8mui9rOaNouaIkOWkp+WGmTtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSDmiJYgJ2xvd2VyY2FzZSfvvJrovazmjaLmiJDlsI/lhpk7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Jhdycg5oiWIOWFtuS7luaXoOaViOWAvO+8mum7mOiupOWOn+agt+i/lOWbnu+8jOS4jei/m+ihjOWkhOeQhjtcbiAqIEByZXR1cm5zIHtNYWdpY1N0cmluZ3xzdHJpbmd8c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9DYW1lbENhc2UobmFtZSwgeyBzZXBhcmF0b3IgPSAnLScsIGZpcnN0ID0gJ3JhdycgfSA9IHt9KSB7XG4gIC8vIOeUn+aIkOato+WImVxuICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGAke3NlcGFyYXRvcn0oXFxcXHcpYCwgJ2cnKTtcbiAgLy8g5ou85o6l5oiQ6am85bOwXG4gIGNvbnN0IGNhbWVsTmFtZSA9IG5hbWUucmVwbGFjZUFsbChyZWdleHAsIChzdWJzdHIsICQxKSA9PiB7XG4gICAgcmV0dXJuICQxLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xuICAvLyDpppblrZfmr43lpKflsI/lhpnmoLnmja7kvKDlj4LliKTmlq1cbiAgaWYgKFt0cnVlLCAndXBwZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgcmV0dXJuIHRvRmlyc3RVcHBlckNhc2UoY2FtZWxOYW1lKTtcbiAgfVxuICBpZiAoW2ZhbHNlLCAnbG93ZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgcmV0dXJuIHRvRmlyc3RMb3dlckNhc2UoY2FtZWxOYW1lKTtcbiAgfVxuICByZXR1cm4gY2FtZWxOYW1lO1xufVxuLyoqXG4gKiDovazov57mjqXnrKblkb3lkI3jgILluLjnlKjkuo7pqbzls7Dlkb3lkI3ovazov57mjqXnrKblkb3lkI3vvIzlpoIgeHhOYW1lIC0+IHh4LW5hbWVcbiAqIEBwYXJhbSBuYW1lIHtzdHJpbmd9IOWQjeensFxuICogQHBhcmFtIHNlcGFyYXRvciB7c3RyaW5nfSDov57mjqXnrKZcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0xpbmVDYXNlKG5hbWUgPSAnJywgeyBzZXBhcmF0b3IgPSAnLScgfSA9IHt9KSB7XG4gIHJldHVybiBuYW1lXG4gICAgLy8g5oyJ6L+e5o6l56ym5ou85o6lXG4gICAgLnJlcGxhY2VBbGwoLyhbYS16XSkoW0EtWl0pL2csIGAkMSR7c2VwYXJhdG9yfSQyYClcbiAgICAvLyDovazlsI/lhplcbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cbiIsIi8vIOWkhOeQhnZ1ZeaVsOaNrueUqFxuaW1wb3J0IHsgdG9DYW1lbENhc2UsIHRvTGluZUNhc2UgfSBmcm9tICcuL19TdHJpbmcnO1xuaW1wb3J0IHsgZGVlcFVud3JhcCwgZ2V0RXhhY3RUeXBlIH0gZnJvbSAnLi9EYXRhJztcblxuLyoqXG4gKiDmt7Hop6PljIV2dWUz5ZON5bqU5byP5a+56LGh5pWw5o2uXG4gKiBAcGFyYW0gZGF0YSB7Kn1cbiAqIEByZXR1cm5zIHsoKnx7W3A6IHN0cmluZ106ICp9KVtdfCp8e1twOiBzdHJpbmddOiAqfXx7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiAqfX19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwVW53cmFwVnVlMyhkYXRhKSB7XG4gIHJldHVybiBkZWVwVW53cmFwKGRhdGEsIHtcbiAgICBpc1dyYXA6IGRhdGEgPT4gZGF0YT8uX192X2lzUmVmLFxuICAgIHVud3JhcDogZGF0YSA9PiBkYXRhLnZhbHVlLFxuICB9KTtcbn1cbi8qKlxuICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAqIEBwYXJhbSBwcm9wRGVmaW5pdGlvbnMgcHJvcHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvcHNGcm9tQXR0cnMoYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAvLyBwcm9wcyDlrprkuYnnu5/kuIDmiJDlr7nosaHmoLzlvI/vvIx0eXBlIOe7n+S4gOaIkOaVsOe7hOagvOW8j+S7peS+v+WQjue7reWIpOaWrVxuICBpZiAocHJvcERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFt0b0NhbWVsQ2FzZShuYW1lKSwgeyB0eXBlOiBbXSB9XSkpO1xuICB9IGVsc2UgaWYgKGdldEV4YWN0VHlwZShwcm9wRGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMocHJvcERlZmluaXRpb25zKS5tYXAoKFtuYW1lLCBkZWZpbml0aW9uXSkgPT4ge1xuICAgICAgZGVmaW5pdGlvbiA9IGdldEV4YWN0VHlwZShkZWZpbml0aW9uKSA9PT0gT2JqZWN0XG4gICAgICAgID8geyAuLi5kZWZpbml0aW9uLCB0eXBlOiBbZGVmaW5pdGlvbi50eXBlXS5mbGF0KCkgfVxuICAgICAgICA6IHsgdHlwZTogW2RlZmluaXRpb25dLmZsYXQoKSB9O1xuICAgICAgcmV0dXJuIFt0b0NhbWVsQ2FzZShuYW1lKSwgZGVmaW5pdGlvbl07XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIHByb3BEZWZpbml0aW9ucyA9IHt9O1xuICB9XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlZmluaXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKHByb3BEZWZpbml0aW9ucykpIHtcbiAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgLy8gcHJvcE5hbWUg5oiWIHByb3AtbmFtZSDmoLzlvI/pgJLlvZLov5vmnaVcbiAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICBjb25zdCBjYW1lbE5hbWUgPSB0b0NhbWVsQ2FzZShuYW1lKTtcbiAgICAgICAgLy8g5Y+q5YyF5ZCrQm9vbGVhbuexu+Wei+eahCcn6L2s5o2i5Li6dHJ1Ze+8jOWFtuS7luWOn+agt+i1i+WAvFxuICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGRlZmluaXRpb24udHlwZS5sZW5ndGggPT09IDEgJiYgZGVmaW5pdGlvbi50eXBlLmluY2x1ZGVzKEJvb2xlYW4pICYmIGF0dHJWYWx1ZSA9PT0gJycgPyB0cnVlIDogYXR0clZhbHVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBwcm9wLW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICBpZiAoZW5kKSB7IHJldHVybjsgfVxuICAgICAgc2V0UmVzdWx0KHsgbmFtZTogdG9MaW5lQ2FzZShuYW1lKSwgZGVmaW5pdGlvbiwgZW5kOiB0cnVlIH0pO1xuICAgIH0pKHtcbiAgICAgIG5hbWUsIGRlZmluaXRpb24sXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICog5LuOIGF0dHJzIOS4reaPkOWPliBlbWl0cyDlrprkuYnnmoTlsZ7mgKdcbiAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAqIEBwYXJhbSBlbWl0RGVmaW5pdGlvbnMgZW1pdHMg5a6a5LmJ77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW1pdHNGcm9tQXR0cnMoYXR0cnMsIGVtaXREZWZpbml0aW9ucykge1xuICAvLyBlbWl0cyDlrprkuYnnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgaWYgKGdldEV4YWN0VHlwZShlbWl0RGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICB9IGVsc2UgaWYgKCEoZW1pdERlZmluaXRpb25zIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgZW1pdERlZmluaXRpb25zID0gW107XG4gIH1cbiAgLy8g57uf5LiA5aSE55CG5oiQIG9uRW1pdE5hbWXjgIFvblVwZGF0ZTplbWl0TmFtZSh2LW1vZGVs57O75YiXKSDmoLzlvI9cbiAgY29uc3QgZW1pdE5hbWVzID0gZW1pdERlZmluaXRpb25zLm1hcChuYW1lID0+IHRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAvLyDorr7nva7lgLxcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgKGZ1bmN0aW9uIHNldFJlc3VsdCh7IG5hbWUsIGVuZCA9IGZhbHNlIH0pIHtcbiAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uVXBkYXRlOicpKSB7XG4gICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgIGlmIChuYW1lIGluIGF0dHJzKSB7XG4gICAgICAgICAgY29uc3QgY2FtZWxOYW1lID0gdG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgcmVzdWx0W2NhbWVsTmFtZV0gPSBhdHRyc1tuYW1lXTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25VcGRhdGU6ZW1pdC1uYW1lIOagvOW8j+i/m+mAkuW9klxuICAgICAgICBpZiAoZW5kKSB7IHJldHVybjsgfVxuICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHt0b0xpbmVDYXNlKG5hbWUuc2xpY2UobmFtZS5pbmRleE9mKCc6JykgKyAxKSl9YCwgZW5kOiB0cnVlIH0pO1xuICAgICAgfVxuICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgcmVzdWx0W25hbWVdID0gYXR0cnNbbmFtZV07XG4gICAgICB9XG4gICAgfSkoeyBuYW1lIH0pO1xuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDku44gYXR0cnMg5Lit5o+Q5Y+W5Ymp5L2Z5bGe5oCn44CC5bi455So5LqO57uE5Lu2aW5oZXJpdEF0dHJz6K6+572uZmFsc2Xml7bkvb/nlKjkvZzkuLrmlrDnmoRhdHRyc1xuICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICogQHBhcmFtIHt9IOmFjee9rumhuVxuICogICAgICAgICAgQHBhcmFtIHByb3BzIHByb3BzIOWumuS5iSDmiJYgdnVlIHByb3Bz77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICogICAgICAgICAgQHBhcmFtIGVtaXRzIGVtaXRzIOWumuS5iSDmiJYgdnVlIGVtaXRz77yM5aaCIEVsQnV0dG9uLmVtaXRzIOetiVxuICogICAgICAgICAgQHBhcmFtIGxpc3Qg6aKd5aSW55qE5pmu6YCa5bGe5oCnXG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXN0RnJvbUF0dHJzKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAvLyDnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgcHJvcHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAocHJvcHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICB9XG4gICAgICBpZiAoZ2V0RXhhY3RUeXBlKHByb3BzKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcChuYW1lID0+IFt0b0NhbWVsQ2FzZShuYW1lKSwgdG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgfSkoKTtcbiAgZW1pdHMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICBpZiAoZW1pdHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByZXR1cm4gZW1pdHM7XG4gICAgICB9XG4gICAgICBpZiAoZ2V0RXhhY3RUeXBlKGVtaXRzKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW107XG4gICAgfSkoKTtcbiAgICByZXR1cm4gYXJyLm1hcCgobmFtZSkgPT4ge1xuICAgICAgLy8gdXBkYXRlOmVtaXROYW1lIOaIliB1cGRhdGU6ZW1pdC1uYW1lIOagvOW8j1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgIGNvbnN0IHBhcnROYW1lID0gbmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpO1xuICAgICAgICByZXR1cm4gW2BvblVwZGF0ZToke3RvQ2FtZWxDYXNlKHBhcnROYW1lKX1gLCBgb25VcGRhdGU6JHt0b0xpbmVDYXNlKHBhcnROYW1lKX1gXTtcbiAgICAgIH1cbiAgICAgIC8vIG9uRW1pdE5hbWXmoLzlvI/vvIzkuK3liJLnur/moLzlvI/lt7Looqt2dWXovazmjaLkuI3nlKjph43lpI3lpITnkIZcbiAgICAgIHJldHVybiBbdG9DYW1lbENhc2UoYG9uLSR7bmFtZX1gKV07XG4gICAgfSkuZmxhdCgpO1xuICB9KSgpO1xuICBsaXN0ID0gKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSBnZXRFeGFjdFR5cGUobGlzdCkgPT09IFN0cmluZ1xuICAgICAgPyBsaXN0LnNwbGl0KCcsJylcbiAgICAgIDogbGlzdCBpbnN0YW5jZW9mIEFycmF5ID8gbGlzdCA6IFtdO1xuICAgIHJldHVybiBhcnIubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH0pKCk7XG4gIGNvbnN0IGxpc3RBbGwgPSBBcnJheS5mcm9tKG5ldyBTZXQoW3Byb3BzLCBlbWl0cywgbGlzdF0uZmxhdCgpKSk7XG4gIC8vIGNvbnNvbGUubG9nKCdsaXN0QWxsJywgbGlzdEFsbCk7XG4gIC8vIOiuvue9ruWAvFxuICBsZXQgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKGF0dHJzKSkpIHtcbiAgICBpZiAoIWxpc3RBbGwuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIG5hbWUsIGRlc2MpO1xuICAgIH1cbiAgfVxuICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8vIOWkhOeQhuagt+W8j+eUqFxuLyoqXG4gKiDluKbljZXkvY3lrZfnrKbkuLLjgILlr7nmlbDlrZfmiJbmlbDlrZfmoLzlvI/nmoTlrZfnrKbkuLLoh6rliqjmi7zljZXkvY3vvIzlhbbku5blrZfnrKbkuLLljp/moLfov5Tlm55cbiAqIEBwYXJhbSB2YWx1ZSB7bnVtYmVyfHN0cmluZ30g5YC8XG4gKiBAcGFyYW0gdW5pdCDljZXkvY3jgIJ2YWx1ZeayoeW4puWNleS9jeaXtuiHquWKqOaLvOaOpe+8jOWPr+S8oCBweC9lbS8lIOetiVxuICogQHJldHVybnMge3N0cmluZ3xzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvblxuZ2V0VW5pdFN0cmluZyh2YWx1ZSA9ICcnLCB7IHVuaXQgPSAncHgnIH0gPSB7fSkge1xuICBpZiAodmFsdWUgPT09ICcnKSB7IHJldHVybiAnJzsgfVxuICAvLyDms6jmhI/vvJrov5nph4zkvb/nlKggPT0g5Yik5pat77yM5LiN5L2/55SoID09PVxuICByZXR1cm4gTnVtYmVyKHZhbHVlKSA9PSB2YWx1ZSA/IGAke3ZhbHVlfSR7dW5pdH1gIDogU3RyaW5nKHZhbHVlKTtcbn1cbiIsIi8qKlxuICogZXNsaW50IOmFjee9ru+8mmh0dHA6Ly9lc2xpbnQuY24vZG9jcy9ydWxlcy9cbiAqIGVzbGludC1wbHVnaW4tdnVlIOmFjee9ru+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy9ydWxlcy9cbiAqL1xuaW1wb3J0IHsgX09iamVjdCwgRGF0YSB9IGZyb20gJy4uL2Jhc2UnO1xuXG4vKipcbiAqIOWvvOWHuuW4uOmHj+S+v+aNt+S9v+eUqFxuICovXG5leHBvcnQgY29uc3QgT0ZGID0gJ29mZic7XG5leHBvcnQgY29uc3QgV0FSTiA9ICd3YXJuJztcbmV4cG9ydCBjb25zdCBFUlJPUiA9ICdlcnJvcic7XG4vKipcbiAqIOWumuWItueahOmFjee9rlxuICovXG4vLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICAvLyDnjq/looPjgILkuIDkuKrnjq/looPlrprkuYnkuobkuIDnu4TpooTlrprkuYnnmoTlhajlsYDlj5jph49cbiAgZW52OiB7XG4gICAgYnJvd3NlcjogdHJ1ZSxcbiAgICBub2RlOiB0cnVlLFxuICB9LFxuICAvLyDop6PmnpDlmahcbiAgcGFyc2VyT3B0aW9uczoge1xuICAgIGVjbWFWZXJzaW9uOiAnbGF0ZXN0JyxcbiAgICBzb3VyY2VUeXBlOiAnbW9kdWxlJyxcbiAgICBlY21hRmVhdHVyZXM6IHtcbiAgICAgIGpzeDogdHJ1ZSxcbiAgICAgIGV4cGVyaW1lbnRhbE9iamVjdFJlc3RTcHJlYWQ6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgLyoqXG4gICAqIOe7p+aJv1xuICAgKiDkvb/nlKhlc2xpbnTnmoTop4TliJnvvJplc2xpbnQ66YWN572u5ZCN56ewXG4gICAqIOS9v+eUqOaPkuS7tueahOmFjee9ru+8mnBsdWdpbjrljIXlkI3nroDlhpkv6YWN572u5ZCN56ewXG4gICAqL1xuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIGVzbGludCDmjqjojZDnmoTop4TliJlcbiAgICAnZXNsaW50OnJlY29tbWVuZGVkJyxcbiAgXSxcbiAgLyoqXG4gICAqIOinhOWImVxuICAgKiDmnaXoh6ogZXNsaW50IOeahOinhOWIme+8muinhOWImUlEIDogdmFsdWVcbiAgICog5p2l6Ieq5o+S5Lu255qE6KeE5YiZ77ya5YyF5ZCN566A5YaZL+inhOWImUlEIDogdmFsdWVcbiAgICovXG4gIHJ1bGVzOiB7XG4gICAgLyoqXG4gICAgICogUG9zc2libGUgRXJyb3JzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5LiOIEphdmFTY3JpcHQg5Luj56CB5Lit5Y+v6IO955qE6ZSZ6K+v5oiW6YC76L6R6ZSZ6K+v5pyJ5YWz77yaXG4gICAgICovXG4gICAgJ2dldHRlci1yZXR1cm4nOiBPRkYsIC8vIOW8uuWItiBnZXR0ZXIg5Ye95pWw5Lit5Ye6546wIHJldHVybiDor63lj6VcbiAgICAnbm8tY29uc3RhbnQtY29uZGl0aW9uJzogT0ZGLCAvLyDnpoHmraLlnKjmnaHku7bkuK3kvb/nlKjluLjph4/ooajovr7lvI9cbiAgICAnbm8tZW1wdHknOiBPRkYsIC8vIOemgeatouWHuueOsOepuuivreWPpeWdl1xuICAgICduby1leHRyYS1zZW1pJzogV0FSTiwgLy8g56aB5q2i5LiN5b+F6KaB55qE5YiG5Y+3XG4gICAgJ25vLWZ1bmMtYXNzaWduJzogT0ZGLCAvLyDnpoHmraLlr7kgZnVuY3Rpb24g5aOw5piO6YeN5paw6LWL5YC8XG4gICAgJ25vLXByb3RvdHlwZS1idWlsdGlucyc6IE9GRiwgLy8g56aB5q2i55u05o6l6LCD55SoIE9iamVjdC5wcm90b3R5cGVzIOeahOWGhee9ruWxnuaAp1xuXG4gICAgLyoqXG4gICAgICogQmVzdCBQcmFjdGljZXNcbiAgICAgKiDov5nkupvop4TliJnmmK/lhbPkuo7mnIDkvbPlrp7ot7XnmoTvvIzluK7liqnkvaDpgb/lhY3kuIDkupvpl67popjvvJpcbiAgICAgKi9cbiAgICAnYWNjZXNzb3ItcGFpcnMnOiBFUlJPUiwgLy8g5by65Yi2IGdldHRlciDlkowgc2V0dGVyIOWcqOWvueixoeS4reaIkOWvueWHuueOsFxuICAgICdhcnJheS1jYWxsYmFjay1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmlbDnu4Tmlrnms5XnmoTlm57osIPlh73mlbDkuK3mnIkgcmV0dXJuIOivreWPpVxuICAgICdibG9jay1zY29wZWQtdmFyJzogRVJST1IsIC8vIOW8uuWItuaKiuWPmOmHj+eahOS9v+eUqOmZkOWItuWcqOWFtuWumuS5ieeahOS9nOeUqOWfn+iMg+WbtOWGhVxuICAgICdjdXJseSc6IFdBUk4sIC8vIOW8uuWItuaJgOacieaOp+WItuivreWPpeS9v+eUqOS4gOiHtOeahOaLrOWPt+mjjuagvFxuICAgICduby1mYWxsdGhyb3VnaCc6IFdBUk4sIC8vIOemgeatoiBjYXNlIOivreWPpeiQveepulxuICAgICduby1mbG9hdGluZy1kZWNpbWFsJzogRVJST1IsIC8vIOemgeatouaVsOWtl+Wtl+mdoumHj+S4reS9v+eUqOWJjeWvvOWSjOacq+WwvuWwj+aVsOeCuVxuICAgICduby1tdWx0aS1zcGFjZXMnOiBXQVJOLCAvLyDnpoHmraLkvb/nlKjlpJrkuKrnqbrmoLxcbiAgICAnbm8tbmV3LXdyYXBwZXJzJzogRVJST1IsIC8vIOemgeatouWvuSBTdHJpbmfvvIxOdW1iZXIg5ZKMIEJvb2xlYW4g5L2/55SoIG5ldyDmk43kvZznrKZcbiAgICAnbm8tcHJvdG8nOiBFUlJPUiwgLy8g56aB55SoIF9fcHJvdG9fXyDlsZ7mgKdcbiAgICAnbm8tcmV0dXJuLWFzc2lnbic6IFdBUk4sIC8vIOemgeatouWcqCByZXR1cm4g6K+t5Y+l5Lit5L2/55So6LWL5YC86K+t5Y+lXG4gICAgJ25vLXVzZWxlc3MtZXNjYXBlJzogV0FSTiwgLy8g56aB55So5LiN5b+F6KaB55qE6L2s5LmJ5a2X56ymXG5cbiAgICAvKipcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKiDov5nkupvop4TliJnkuI7lj5jph4/lo7DmmI7mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnbm8tdW5kZWYtaW5pdCc6IFdBUk4sIC8vIOemgeatouWwhuWPmOmHj+WIneWni+WMluS4uiB1bmRlZmluZWRcbiAgICAnbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOemgeatouWHuueOsOacquS9v+eUqOi/h+eahOWPmOmHj1xuICAgICduby11c2UtYmVmb3JlLWRlZmluZSc6IFtFUlJPUiwgeyAnZnVuY3Rpb25zJzogZmFsc2UsICdjbGFzc2VzJzogZmFsc2UsICd2YXJpYWJsZXMnOiBmYWxzZSB9XSwgLy8g56aB5q2i5Zyo5Y+Y6YeP5a6a5LmJ5LmL5YmN5L2/55So5a6D5LusXG5cbiAgICAvKipcbiAgICAgKiBTdHlsaXN0aWMgSXNzdWVzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5piv5YWz5LqO6aOO5qC85oyH5Y2X55qE77yM6ICM5LiU5piv6Z2e5bi45Li76KeC55qE77yaXG4gICAgICovXG4gICAgJ2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdibG9jay1zcGFjaW5nJzogV0FSTiwgLy8g56aB5q2i5oiW5by65Yi25Zyo5Luj56CB5Z2X5Lit5byA5ous5Y+35YmN5ZKM6Zet5ous5Y+35ZCO5pyJ56m65qC8XG4gICAgJ2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSwgLy8g5by65Yi25Zyo5Luj56CB5Z2X5Lit5L2/55So5LiA6Ie055qE5aSn5ous5Y+36aOO5qC8XG4gICAgJ2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLCAvLyDopoHmsYLmiJbnpoHmraLmnKvlsL7pgJflj7dcbiAgICAnY29tbWEtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOmAl+WPt+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdjb21tYS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOmAl+WPt+mjjuagvFxuICAgICdjb21wdXRlZC1wcm9wZXJ0eS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6K6h566X55qE5bGe5oCn55qE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Z1bmMtY2FsbC1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5Ye95pWw5qCH6K+G56ym5ZKM5YW26LCD55So5LmL6Ze05pyJ56m65qC8XG4gICAgJ2Z1bmN0aW9uLXBhcmVuLW5ld2xpbmUnOiBXQVJOLCAvLyDlvLrliLblnKjlh73mlbDmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTmjaLooYxcbiAgICAnaW1wbGljaXQtYXJyb3ctbGluZWJyZWFrJzogV0FSTiwgLy8g5by65Yi26ZqQ5byP6L+U5Zue55qE566t5aS05Ye95pWw5L2T55qE5L2N572uXG4gICAgJ2luZGVudCc6IFtXQVJOLCAyLCB7ICdTd2l0Y2hDYXNlJzogMSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE57yp6L+bXG4gICAgJ2pzeC1xdW90ZXMnOiBXQVJOLCAvLyDlvLrliLblnKggSlNYIOWxnuaAp+S4reS4gOiHtOWcsOS9v+eUqOWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdrZXktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWvueixoeWtl+mdoumHj+eahOWxnuaAp+S4remUruWSjOWAvOS5i+mXtOS9v+eUqOS4gOiHtOeahOmXtOi3nVxuICAgICdrZXl3b3JkLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlhbPplK7lrZfliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbmV3LXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuaIluemgeatouiwg+eUqOaXoOWPguaehOmAoOWHveaVsOaXtuacieWchuaLrOWPt1xuICAgICduby1taXhlZC1zcGFjZXMtYW5kLXRhYnMnOiBXQVJOLFxuICAgICduby1tdWx0aXBsZS1lbXB0eS1saW5lcyc6IFtXQVJOLCB7ICdtYXgnOiAxLCAnbWF4RU9GJzogMCwgJ21heEJPRic6IDAgfV0sIC8vIOemgeatouWHuueOsOWkmuihjOepuuihjFxuICAgICduby10cmFpbGluZy1zcGFjZXMnOiBXQVJOLCAvLyDnpoHnlKjooYzlsL7nqbrmoLxcbiAgICAnbm8td2hpdGVzcGFjZS1iZWZvcmUtcHJvcGVydHknOiBXQVJOLCAvLyDnpoHmraLlsZ7mgKfliY3mnInnqbrnmb1cbiAgICAnbm9uYmxvY2stc3RhdGVtZW50LWJvZHktcG9zaXRpb24nOiBXQVJOLCAvLyDlvLrliLbljZXkuKror63lj6XnmoTkvY3nva5cbiAgICAnb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLCAvLyDlvLrliLblpKfmi6zlj7flhoXmjaLooYznrKbnmoTkuIDoh7TmgKdcbiAgICAnb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLCAvLyDlvLrliLblnKjlpKfmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAncGFkZGVkLWJsb2Nrcyc6IFtXQVJOLCAnbmV2ZXInXSwgLy8g6KaB5rGC5oiW56aB5q2i5Z2X5YaF5aGr5YWFXG4gICAgJ3F1b3Rlcyc6IFtXQVJOLCAnc2luZ2xlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlLCAnYWxsb3dUZW1wbGF0ZUxpdGVyYWxzJzogdHJ1ZSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE5Y+N5Yu+5Y+344CB5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ3NlbWknOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLkvb/nlKjliIblj7fku6Pmm78gQVNJXG4gICAgJ3NlbWktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+S5i+WJjeWSjOS5i+WQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzZW1pLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25YiG5Y+355qE5L2N572uXG4gICAgJ3NwYWNlLWJlZm9yZS1ibG9ja3MnOiBXQVJOLCAvLyDlvLrliLblnKjlnZfkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtYmVmb3JlLWZ1bmN0aW9uLXBhcmVuJzogW1dBUk4sIHsgJ2Fub255bW91cyc6ICduZXZlcicsICduYW1lZCc6ICduZXZlcicsICdhc3luY0Fycm93JzogJ2Fsd2F5cycgfV0sIC8vIOW8uuWItuWcqCBmdW5jdGlvbueahOW3puaLrOWPt+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbi1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLblnKjlnIbmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW5maXgtb3BzJzogV0FSTiwgLy8g6KaB5rGC5pON5L2c56ym5ZGo5Zu05pyJ56m65qC8XG4gICAgJ3NwYWNlLXVuYXJ5LW9wcyc6IFdBUk4sIC8vIOW8uuWItuWcqOS4gOWFg+aTjeS9nOespuWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZWQtY29tbWVudCc6IFdBUk4sIC8vIOW8uuWItuWcqOazqOmHiuS4rSAvLyDmiJYgLyog5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3N3aXRjaC1jb2xvbi1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHN3aXRjaCDnmoTlhpLlj7flt6blj7PmnInnqbrmoLxcbiAgICAndGVtcGxhdGUtdGFnLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjmqKHmnb/moIforrDlkozlroPku6znmoTlrZfpnaLph4/kuYvpl7TnmoTnqbrmoLxcblxuICAgIC8qKlxuICAgICAqIEVDTUFTY3JpcHQgNlxuICAgICAqIOi/meS6m+inhOWImeWPquS4jiBFUzYg5pyJ5YWzLCDljbPpgJrluLjmiYDor7TnmoQgRVMyMDE177yaXG4gICAgICovXG4gICAgJ2Fycm93LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbnrq3lpLTlh73mlbDnmoTnrq3lpLTliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnZ2VuZXJhdG9yLXN0YXItc3BhY2luZyc6IFtXQVJOLCB7ICdiZWZvcmUnOiBmYWxzZSwgJ2FmdGVyJzogdHJ1ZSwgJ21ldGhvZCc6IHsgJ2JlZm9yZSc6IHRydWUsICdhZnRlcic6IGZhbHNlIH0gfV0sIC8vIOW8uuWItiBnZW5lcmF0b3Ig5Ye95pWw5LitICog5Y+35ZGo5Zu05L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ25vLXVzZWxlc3MtcmVuYW1lJzogV0FSTiwgLy8g56aB5q2i5ZyoIGltcG9ydCDlkowgZXhwb3J0IOWSjOino+aehOi1i+WAvOaXtuWwhuW8leeUqOmHjeWRveWQjeS4uuebuOWQjOeahOWQjeWtl1xuICAgICdwcmVmZXItdGVtcGxhdGUnOiBXQVJOLCAvLyDopoHmsYLkvb/nlKjmqKHmnb/lrZfpnaLph4/ogIzpnZ7lrZfnrKbkuLLov57mjqVcbiAgICAncmVzdC1zcHJlYWQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWJqeS9meWSjOaJqeWxlei/kOeul+espuWPiuWFtuihqOi+vuW8j+S5i+mXtOacieepuuagvFxuICAgICd0ZW1wbGF0ZS1jdXJseS1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5qih5p2/5a2X56ym5Liy5Lit55qE5bWM5YWl6KGo6L6+5byP5ZGo5Zu056m65qC855qE5L2/55SoXG4gICAgJ3lpZWxkLXN0YXItc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqCB5aWVsZCog6KGo6L6+5byP5LitICog5ZGo5Zu05L2/55So56m65qC8XG4gIH0sXG4gIC8vIOimhuebllxuICBvdmVycmlkZXM6IFtdLFxufTtcbi8vIHZ1ZTIvdnVlMyDlhbHnlKhcbmV4cG9ydCBjb25zdCB2dWVDb21tb25Db25maWcgPSB7XG4gIHJ1bGVzOiB7XG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsXG4gICAgJ3Z1ZS9tdWx0aS13b3JkLWNvbXBvbmVudC1uYW1lcyc6IE9GRiwgLy8g6KaB5rGC57uE5Lu25ZCN56ew5aeL57uI5Li65aSa5a2XXG4gICAgJ3Z1ZS9uby11bnVzZWQtY29tcG9uZW50cyc6IFdBUk4sIC8vIOacquS9v+eUqOeahOe7hOS7tlxuICAgICd2dWUvbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOacquS9v+eUqOeahOWPmOmHj1xuICAgICd2dWUvcmVxdWlyZS1yZW5kZXItcmV0dXJuJzogV0FSTiwgLy8g5by65Yi25riy5p+T5Ye95pWw5oC75piv6L+U5Zue5YC8XG4gICAgJ3Z1ZS9yZXF1aXJlLXYtZm9yLWtleSc6IE9GRiwgLy8gdi1mb3LkuK3lv4Xpobvkvb/nlKhrZXlcbiAgICAndnVlL3JldHVybi1pbi1jb21wdXRlZC1wcm9wZXJ0eSc6IFdBUk4sIC8vIOW8uuWItui/lOWbnuivreWPpeWtmOWcqOS6juiuoeeul+WxnuaAp+S4rVxuICAgICd2dWUvdmFsaWQtdGVtcGxhdGUtcm9vdCc6IE9GRiwgLy8g5by65Yi25pyJ5pWI55qE5qih5p2/5qC5XG4gICAgJ3Z1ZS92YWxpZC12LWZvcic6IE9GRiwgLy8g5by65Yi25pyJ5pWI55qEdi1mb3LmjIfku6RcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZFxuICAgICd2dWUvYXR0cmlidXRlLWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlvLrliLblsZ7mgKflkI3moLzlvI9cbiAgICAndnVlL2NvbXBvbmVudC1kZWZpbml0aW9uLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDlvLrliLbnu4Tku7ZuYW1l5qC85byPXG4gICAgJ3Z1ZS9odG1sLXF1b3Rlcyc6IFtXQVJOLCAnZG91YmxlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlIH1dLCAvLyDlvLrliLYgSFRNTCDlsZ7mgKfnmoTlvJXlj7fmoLflvI9cbiAgICAndnVlL2h0bWwtc2VsZi1jbG9zaW5nJzogT0ZGLCAvLyDkvb/nlKjoh6rpl63lkIjmoIfnrb5cbiAgICAndnVlL21heC1hdHRyaWJ1dGVzLXBlci1saW5lJzogW1dBUk4sIHsgJ3NpbmdsZWxpbmUnOiBJbmZpbml0eSwgJ211bHRpbGluZSc6IDEgfV0sIC8vIOW8uuWItuavj+ihjOWMheWQq+eahOacgOWkp+WxnuaAp+aVsFxuICAgICd2dWUvbXVsdGlsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWkmuihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvcHJvcC1uYW1lLWNhc2luZyc6IE9GRiwgLy8g5Li6IFZ1ZSDnu4Tku7bkuK3nmoQgUHJvcCDlkI3np7DlvLrliLbmiafooYznibnlrprlpKflsI/lhplcbiAgICAndnVlL3JlcXVpcmUtZGVmYXVsdC1wcm9wJzogT0ZGLCAvLyBwcm9wc+mcgOimgem7mOiupOWAvFxuICAgICd2dWUvc2luZ2xlbGluZS1odG1sLWVsZW1lbnQtY29udGVudC1uZXdsaW5lJzogT0ZGLCAvLyDpnIDopoHlnKjljZXooYzlhYPntKDnmoTlhoXlrrnliY3lkI7mjaLooYxcbiAgICAndnVlL3YtYmluZC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1iaW5k5oyH5Luk6aOO5qC8XG4gICAgJ3Z1ZS92LW9uLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LW9u5oyH5Luk6aOO5qC8XG4gICAgJ3Z1ZS92LXNsb3Qtc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtc2xvdOaMh+S7pOmjjuagvFxuICAgIC8vIFByaW9yaXR5IEM6IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9uby12LWh0bWwnOiBPRkYsIC8vIOemgeatouS9v+eUqHYtaHRtbFxuICAgIC8vIFVuY2F0ZWdvcml6ZWRcbiAgICAndnVlL2Jsb2NrLXRhZy1uZXdsaW5lJzogV0FSTiwgLy8gIOWcqOaJk+W8gOWdl+e6p+agh+iusOS5i+WQjuWSjOWFs+mXreWdl+e6p+agh+iusOS5i+WJjeW8uuWItuaNouihjFxuICAgICd2dWUvaHRtbC1jb21tZW50LWNvbnRlbnQtc3BhY2luZyc6IFdBUk4sIC8vIOWcqEhUTUzms6jph4rkuK3lvLrliLbnu5/kuIDnmoTnqbrmoLxcbiAgICAndnVlL3NjcmlwdC1pbmRlbnQnOiBbV0FSTiwgMiwgeyAnYmFzZUluZGVudCc6IDEsICdzd2l0Y2hDYXNlJzogMSB9XSwgLy8g5ZyoPHNjcmlwdD7kuK3lvLrliLbkuIDoh7TnmoTnvKnov5tcbiAgICAvLyBFeHRlbnNpb24gUnVsZXPjgILlr7nlupRlc2xpbnTnmoTlkIzlkI3op4TliJnvvIzpgILnlKjkuo48dGVtcGxhdGU+5Lit55qE6KGo6L6+5byPXG4gICAgJ3Z1ZS9hcnJheS1icmFja2V0LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvYmxvY2stc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9icmFjZS1zdHlsZSc6IFtXQVJOLCAnMXRicycsIHsgJ2FsbG93U2luZ2xlTGluZSc6IHRydWUgfV0sXG4gICAgJ3Z1ZS9jb21tYS1kYW5nbGUnOiBbV0FSTiwgJ2Fsd2F5cy1tdWx0aWxpbmUnXSxcbiAgICAndnVlL2NvbW1hLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvY29tbWEtc3R5bGUnOiBXQVJOLFxuICAgICd2dWUvZnVuYy1jYWxsLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUva2V5LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUva2V5d29yZC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL29iamVjdC1jdXJseS1uZXdsaW5lJzogW1dBUk4sIHsgJ211bHRpbGluZSc6IHRydWUsICdjb25zaXN0ZW50JzogdHJ1ZSB9XSxcbiAgICAndnVlL29iamVjdC1jdXJseS1zcGFjaW5nJzogW1dBUk4sICdhbHdheXMnXSxcbiAgICAndnVlL3NwYWNlLWluLXBhcmVucyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS1pbmZpeC1vcHMnOiBXQVJOLFxuICAgICd2dWUvc3BhY2UtdW5hcnktb3BzJzogV0FSTixcbiAgICAndnVlL2Fycm93LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvcHJlZmVyLXRlbXBsYXRlJzogV0FSTixcbiAgfSxcbiAgb3ZlcnJpZGVzOiBbXG4gICAge1xuICAgICAgJ2ZpbGVzJzogWycqLnZ1ZSddLFxuICAgICAgJ3J1bGVzJzoge1xuICAgICAgICAnaW5kZW50JzogT0ZGLFxuICAgICAgfSxcbiAgICB9LFxuICBdLFxufTtcbi8vIHZ1ZTLnlKhcbmV4cG9ydCBjb25zdCB2dWUyQ29uZmlnID0gbWVyZ2UodnVlQ29tbW9uQ29uZmlnLCB7XG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggdnVlMiDmjqjojZDnmoTop4TliJlcbiAgICAncGx1Z2luOnZ1ZS9yZWNvbW1lbmRlZCcsXG4gIF0sXG59KTtcbi8vIHZ1ZTPnlKhcbmV4cG9ydCBjb25zdCB2dWUzQ29uZmlnID0gbWVyZ2UodnVlQ29tbW9uQ29uZmlnLCB7XG4gIGVudjoge1xuICAgICd2dWUvc2V0dXAtY29tcGlsZXItbWFjcm9zJzogdHJ1ZSwgLy8g5aSE55CGc2V0dXDmqKHmnb/kuK3lg48gZGVmaW5lUHJvcHMg5ZKMIGRlZmluZUVtaXRzIOi/meagt+eahOe8luivkeWZqOWuj+aKpSBuby11bmRlZiDnmoTpl67popjvvJpodHRwczovL2VzbGludC52dWVqcy5vcmcvdXNlci1ndWlkZS8jY29tcGlsZXItbWFjcm9zLXN1Y2gtYXMtZGVmaW5lcHJvcHMtYW5kLWRlZmluZWVtaXRzLWdlbmVyYXRlLW5vLXVuZGVmLXdhcm5pbmdzXG4gIH0sXG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggdnVlMyDmjqjojZDnmoTop4TliJlcbiAgICAncGx1Z2luOnZ1ZS92dWUzLXJlY29tbWVuZGVkJyxcbiAgXSxcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL25vLXRlbXBsYXRlLWtleSc6IE9GRiwgLy8g56aB5q2iPHRlbXBsYXRlPuS4reS9v+eUqGtleeWxnuaAp1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmV0dXJuLWluLWVtaXRzLXZhbGlkYXRvcic6IFdBUk4sIC8vIOW8uuWItuWcqGVtaXRz6aqM6K+B5Zmo5Lit5a2Y5Zyo6L+U5Zue6K+t5Y+lXG4gICAgLy8gUHJpb3JpdHkgQjogU3Ryb25nbHkgUmVjb21tZW5kZWQgZm9yIFZ1ZS5qcyAzLnhcbiAgICAndnVlL3JlcXVpcmUtZXhwbGljaXQtZW1pdHMnOiBPRkYsIC8vIOmcgOimgWVtaXRz5Lit5a6a5LmJ6YCJ6aG555So5LqOJGVtaXQoKVxuICAgICd2dWUvdi1vbi1ldmVudC1oeXBoZW5hdGlvbic6IE9GRiwgLy8g5Zyo5qih5p2/5Lit55qE6Ieq5a6a5LmJ57uE5Lu25LiK5by65Yi25omn6KGMIHYtb24g5LqL5Lu25ZG95ZCN5qC35byPXG4gIH0sXG59KTtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZSguLi5vYmplY3RzKSB7XG4gIGNvbnN0IFt0YXJnZXQsIC4uLnNvdXJjZXNdID0gb2JqZWN0cztcbiAgY29uc3QgcmVzdWx0ID0gRGF0YS5kZWVwQ2xvbmUodGFyZ2V0KTtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpIHtcbiAgICAgIC8vIOeJueauiuWtl+auteWkhOeQhlxuICAgICAgaWYgKGtleSA9PT0gJ3J1bGVzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IGtleSwgdmFsdWUsICdyZXN1bHRba2V5XSc6IHJlc3VsdFtrZXldIH0pO1xuICAgICAgICAvLyDliJ3lp4vkuI3lrZjlnKjml7botYvpu5jorqTlgLznlKjkuo7lkIjlubZcbiAgICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyB7fTtcbiAgICAgICAgLy8g5a+55ZCE5p2h6KeE5YiZ5aSE55CGXG4gICAgICAgIGZvciAobGV0IFtydWxlS2V5LCBydWxlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICAgIC8vIOW3suacieWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGxldCBzb3VyY2VSdWxlVmFsdWUgPSByZXN1bHRba2V5XVtydWxlS2V5XSA/PyBbXTtcbiAgICAgICAgICBpZiAoIShzb3VyY2VSdWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZSA9IFtzb3VyY2VSdWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDopoHlkIjlubbnmoTlgLznu5/kuIDmiJDmlbDnu4TlpITnkIZcbiAgICAgICAgICBpZiAoIShydWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHJ1bGVWYWx1ZSA9IFtydWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDnu5/kuIDmoLzlvI/lkI7ov5vooYzmlbDnu4Tlvqrnjq/mk43kvZxcbiAgICAgICAgICBmb3IgKGNvbnN0IFt2YWxJbmRleCwgdmFsXSBvZiBPYmplY3QuZW50cmllcyhydWxlVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyDlr7nosaHmt7HlkIjlubbvvIzlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZSh2YWwpID09PSBPYmplY3QpIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IF9PYmplY3QuZGVlcEFzc2lnbihzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID8/IHt9LCB2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g6LWL5YC86KeE5YiZ57uT5p6cXG4gICAgICAgICAgcmVzdWx0W2tleV1bcnVsZUtleV0gPSBzb3VyY2VSdWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blrZfmrrXmoLnmja7nsbvlnovliKTmlq3lpITnkIZcbiAgICAgIC8vIOaVsOe7hO+8muaLvOaOpVxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8gW10pLnB1c2goLi4udmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWvueixoe+8mua3seWQiOW5tlxuICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbHVlKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIF9PYmplY3QuZGVlcEFzc2lnbihyZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9LCB2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW55u05o6l6LWL5YC8XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDkvb/nlKjlrprliLbnmoTphY3nva5cbiAqIEBwYXJhbSB7fe+8mumFjee9rumhuVxuICogICAgICAgICAgYmFzZe+8muS9v+eUqOWfuuehgGVzbGludOWumuWItu+8jOm7mOiupCB0cnVlXG4gKiAgICAgICAgICB2dWVWZXJzaW9u77yadnVl54mI5pys77yM5byA5ZCv5ZCO6ZyA6KaB5a6J6KOFIGVzbGludC1wbHVnaW4tdnVlXG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2UoeyBiYXNlID0gdHJ1ZSwgdnVlVmVyc2lvbiB9ID0ge30pIHtcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBpZiAoYmFzZSkge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgYmFzZUNvbmZpZyk7XG4gIH1cbiAgaWYgKHZ1ZVZlcnNpb24gPT0gMikge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgdnVlMkNvbmZpZyk7XG4gIH0gZWxzZSBpZiAodnVlVmVyc2lvbiA9PSAzKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUzQ29uZmlnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiLy8g5Z+656GA5a6a5Yi2XG5leHBvcnQgY29uc3QgYmFzZUNvbmZpZyA9IHtcbiAgYmFzZTogJy4vJyxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICAvLyDliKvlkI1cbiAgICBhbGlhczoge1xuICAgICAgLy8gJ0Byb290JzogcmVzb2x2ZShfX2Rpcm5hbWUpLFxuICAgICAgLy8gJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8g6KeE5a6a6Kem5Y+R6K2m5ZGK55qEIGNodW5rIOWkp+Wwj+OAgu+8iOS7pSBrYnMg5Li65Y2V5L2N77yJXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyICoqIDEwLFxuICAgIC8vIOiHquWumuS5ieW6leWxgueahCBSb2xsdXAg5omT5YyF6YWN572u44CCXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIOWFpeWPo+aWh+S7tuWQjVxuICAgICAgICBlbnRyeUZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9lbnRyeS0ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDlnZfmlofku7blkI1cbiAgICAgICAgY2h1bmtGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLmpzYDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g6LWE5rqQ5paH5Lu25ZCN77yMY3Nz44CB5Zu+54mH562JXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5bZXh0XWA7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59O1xuIiwiLy8g6K+35rGC5pa55rOVXG5leHBvcnQgY29uc3QgTUVUSE9EUyA9IFsnR0VUJywgJ0hFQUQnLCAnUE9TVCcsICdQVVQnLCAnREVMRVRFJywgJ0NPTk5FQ1QnLCAnT1BUSU9OUycsICdUUkFDRScsICdQQVRDSCddO1xuLy8gaHR0cCDnirbmgIHnoIFcbmV4cG9ydCBjb25zdCBTVEFUVVNFUyA9IFtcbiAgeyAnc3RhdHVzJzogMTAwLCAnc3RhdHVzVGV4dCc6ICdDb250aW51ZScgfSxcbiAgeyAnc3RhdHVzJzogMTAxLCAnc3RhdHVzVGV4dCc6ICdTd2l0Y2hpbmcgUHJvdG9jb2xzJyB9LFxuICB7ICdzdGF0dXMnOiAxMDIsICdzdGF0dXNUZXh0JzogJ1Byb2Nlc3NpbmcnIH0sXG4gIHsgJ3N0YXR1cyc6IDEwMywgJ3N0YXR1c1RleHQnOiAnRWFybHkgSGludHMnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMCwgJ3N0YXR1c1RleHQnOiAnT0snIH0sXG4gIHsgJ3N0YXR1cyc6IDIwMSwgJ3N0YXR1c1RleHQnOiAnQ3JlYXRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjAyLCAnc3RhdHVzVGV4dCc6ICdBY2NlcHRlZCcgfSxcbiAgeyAnc3RhdHVzJzogMjAzLCAnc3RhdHVzVGV4dCc6ICdOb24tQXV0aG9yaXRhdGl2ZSBJbmZvcm1hdGlvbicgfSxcbiAgeyAnc3RhdHVzJzogMjA0LCAnc3RhdHVzVGV4dCc6ICdObyBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDUsICdzdGF0dXNUZXh0JzogJ1Jlc2V0IENvbnRlbnQnIH0sXG4gIHsgJ3N0YXR1cyc6IDIwNiwgJ3N0YXR1c1RleHQnOiAnUGFydGlhbCBDb250ZW50JyB9LFxuICB7ICdzdGF0dXMnOiAyMDcsICdzdGF0dXNUZXh0JzogJ011bHRpLVN0YXR1cycgfSxcbiAgeyAnc3RhdHVzJzogMjA4LCAnc3RhdHVzVGV4dCc6ICdBbHJlYWR5IFJlcG9ydGVkJyB9LFxuICB7ICdzdGF0dXMnOiAyMjYsICdzdGF0dXNUZXh0JzogJ0lNIFVzZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwMCwgJ3N0YXR1c1RleHQnOiAnTXVsdGlwbGUgQ2hvaWNlcycgfSxcbiAgeyAnc3RhdHVzJzogMzAxLCAnc3RhdHVzVGV4dCc6ICdNb3ZlZCBQZXJtYW5lbnRseScgfSxcbiAgeyAnc3RhdHVzJzogMzAyLCAnc3RhdHVzVGV4dCc6ICdGb3VuZCcgfSxcbiAgeyAnc3RhdHVzJzogMzAzLCAnc3RhdHVzVGV4dCc6ICdTZWUgT3RoZXInIH0sXG4gIHsgJ3N0YXR1cyc6IDMwNCwgJ3N0YXR1c1RleHQnOiAnTm90IE1vZGlmaWVkJyB9LFxuICB7ICdzdGF0dXMnOiAzMDUsICdzdGF0dXNUZXh0JzogJ1VzZSBQcm94eScgfSxcbiAgeyAnc3RhdHVzJzogMzA3LCAnc3RhdHVzVGV4dCc6ICdUZW1wb3JhcnkgUmVkaXJlY3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDMwOCwgJ3N0YXR1c1RleHQnOiAnUGVybWFuZW50IFJlZGlyZWN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDAsICdzdGF0dXNUZXh0JzogJ0JhZCBSZXF1ZXN0JyB9LFxuICB7ICdzdGF0dXMnOiA0MDEsICdzdGF0dXNUZXh0JzogJ1VuYXV0aG9yaXplZCcgfSxcbiAgeyAnc3RhdHVzJzogNDAyLCAnc3RhdHVzVGV4dCc6ICdQYXltZW50IFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDMsICdzdGF0dXNUZXh0JzogJ0ZvcmJpZGRlbicgfSxcbiAgeyAnc3RhdHVzJzogNDA0LCAnc3RhdHVzVGV4dCc6ICdOb3QgRm91bmQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQwNSwgJ3N0YXR1c1RleHQnOiAnTWV0aG9kIE5vdCBBbGxvd2VkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDYsICdzdGF0dXNUZXh0JzogJ05vdCBBY2NlcHRhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA0MDcsICdzdGF0dXNUZXh0JzogJ1Byb3h5IEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MDgsICdzdGF0dXNUZXh0JzogJ1JlcXVlc3QgVGltZW91dCcgfSxcbiAgeyAnc3RhdHVzJzogNDA5LCAnc3RhdHVzVGV4dCc6ICdDb25mbGljdCcgfSxcbiAgeyAnc3RhdHVzJzogNDEwLCAnc3RhdHVzVGV4dCc6ICdHb25lJyB9LFxuICB7ICdzdGF0dXMnOiA0MTEsICdzdGF0dXNUZXh0JzogJ0xlbmd0aCBSZXF1aXJlZCcgfSxcbiAgeyAnc3RhdHVzJzogNDEyLCAnc3RhdHVzVGV4dCc6ICdQcmVjb25kaXRpb24gRmFpbGVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MTMsICdzdGF0dXNUZXh0JzogJ1BheWxvYWQgVG9vIExhcmdlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTQsICdzdGF0dXNUZXh0JzogJ1VSSSBUb28gTG9uZycgfSxcbiAgeyAnc3RhdHVzJzogNDE1LCAnc3RhdHVzVGV4dCc6ICdVbnN1cHBvcnRlZCBNZWRpYSBUeXBlJyB9LFxuICB7ICdzdGF0dXMnOiA0MTYsICdzdGF0dXNUZXh0JzogJ1JhbmdlIE5vdCBTYXRpc2ZpYWJsZScgfSxcbiAgeyAnc3RhdHVzJzogNDE3LCAnc3RhdHVzVGV4dCc6ICdFeHBlY3RhdGlvbiBGYWlsZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQxOCwgJ3N0YXR1c1RleHQnOiAnSVxcJ20gYSBUZWFwb3QnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyMSwgJ3N0YXR1c1RleHQnOiAnTWlzZGlyZWN0ZWQgUmVxdWVzdCcgfSxcbiAgeyAnc3RhdHVzJzogNDIyLCAnc3RhdHVzVGV4dCc6ICdVbnByb2Nlc3NhYmxlIEVudGl0eScgfSxcbiAgeyAnc3RhdHVzJzogNDIzLCAnc3RhdHVzVGV4dCc6ICdMb2NrZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNCwgJ3N0YXR1c1RleHQnOiAnRmFpbGVkIERlcGVuZGVuY3knIH0sXG4gIHsgJ3N0YXR1cyc6IDQyNSwgJ3N0YXR1c1RleHQnOiAnVG9vIEVhcmx5JyB9LFxuICB7ICdzdGF0dXMnOiA0MjYsICdzdGF0dXNUZXh0JzogJ1VwZ3JhZGUgUmVxdWlyZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDQyOCwgJ3N0YXR1c1RleHQnOiAnUHJlY29uZGl0aW9uIFJlcXVpcmVkJyB9LFxuICB7ICdzdGF0dXMnOiA0MjksICdzdGF0dXNUZXh0JzogJ1RvbyBNYW55IFJlcXVlc3RzJyB9LFxuICB7ICdzdGF0dXMnOiA0MzEsICdzdGF0dXNUZXh0JzogJ1JlcXVlc3QgSGVhZGVyIEZpZWxkcyBUb28gTGFyZ2UnIH0sXG4gIHsgJ3N0YXR1cyc6IDQ1MSwgJ3N0YXR1c1RleHQnOiAnVW5hdmFpbGFibGUgRm9yIExlZ2FsIFJlYXNvbnMnIH0sXG4gIHsgJ3N0YXR1cyc6IDUwMCwgJ3N0YXR1c1RleHQnOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyB9LFxuICB7ICdzdGF0dXMnOiA1MDEsICdzdGF0dXNUZXh0JzogJ05vdCBJbXBsZW1lbnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTAyLCAnc3RhdHVzVGV4dCc6ICdCYWQgR2F0ZXdheScgfSxcbiAgeyAnc3RhdHVzJzogNTAzLCAnc3RhdHVzVGV4dCc6ICdTZXJ2aWNlIFVuYXZhaWxhYmxlJyB9LFxuICB7ICdzdGF0dXMnOiA1MDQsICdzdGF0dXNUZXh0JzogJ0dhdGV3YXkgVGltZW91dCcgfSxcbiAgeyAnc3RhdHVzJzogNTA1LCAnc3RhdHVzVGV4dCc6ICdIVFRQIFZlcnNpb24gTm90IFN1cHBvcnRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTA2LCAnc3RhdHVzVGV4dCc6ICdWYXJpYW50IEFsc28gTmVnb3RpYXRlcycgfSxcbiAgeyAnc3RhdHVzJzogNTA3LCAnc3RhdHVzVGV4dCc6ICdJbnN1ZmZpY2llbnQgU3RvcmFnZScgfSxcbiAgeyAnc3RhdHVzJzogNTA4LCAnc3RhdHVzVGV4dCc6ICdMb29wIERldGVjdGVkJyB9LFxuICB7ICdzdGF0dXMnOiA1MDksICdzdGF0dXNUZXh0JzogJ0JhbmR3aWR0aCBMaW1pdCBFeGNlZWRlZCcgfSxcbiAgeyAnc3RhdHVzJzogNTEwLCAnc3RhdHVzVGV4dCc6ICdOb3QgRXh0ZW5kZWQnIH0sXG4gIHsgJ3N0YXR1cyc6IDUxMSwgJ3N0YXR1c1RleHQnOiAnTmV0d29yayBBdXRoZW50aWNhdGlvbiBSZXF1aXJlZCcgfSxcbl07XG4iLCIvLyDliarotLTmnb9cbi8qKlxuICog5aSN5Yi25paH5pys5pen5YaZ5rOV44CC5ZyoIGNsaXBib2FyZCBhcGkg5LiN5Y+v55So5pe25Luj5pu/XG4gKiBAcGFyYW0gdGV4dFxuICogQHJldHVybnMge1Byb21pc2U8UHJvbWlzZTx2b2lkPnxQcm9taXNlPG5ldmVyPj59XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIG9sZENvcHlUZXh0KHRleHQpIHtcbiAgLy8g5paw5bu66L6T5YWl5qGGXG4gIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgLy8g6LWL5YC8XG4gIHRleHRhcmVhLnZhbHVlID0gdGV4dDtcbiAgLy8g5qC35byP6K6+572uXG4gIE9iamVjdC5hc3NpZ24odGV4dGFyZWEuc3R5bGUsIHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICB0b3A6IDAsXG4gICAgY2xpcFBhdGg6ICdjaXJjbGUoMCknLFxuICB9KTtcbiAgLy8g5Yqg5YWl5Yiw6aG16Z2iXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKHRleHRhcmVhKTtcbiAgLy8g6YCJ5LitXG4gIHRleHRhcmVhLnNlbGVjdCgpO1xuICAvLyDlpI3liLZcbiAgY29uc3Qgc3VjY2VzcyA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gIC8vIOS7jumhtemdouenu+mZpFxuICB0ZXh0YXJlYS5yZW1vdmUoKTtcbiAgcmV0dXJuIHN1Y2Nlc3MgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVqZWN0KCk7XG59XG5leHBvcnQgY29uc3QgY2xpcGJvYXJkID0ge1xuICAvKipcbiAgICog5YaZ5YWl5paH5pysKOWkjeWItilcbiAgICogQHBhcmFtIHRleHRcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBhc3luYyB3cml0ZVRleHQodGV4dCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGF3YWl0IG9sZENvcHlUZXh0KHRleHQpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIOivu+WPluaWh+acrCjnspjotLQpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZz59XG4gICAqL1xuICBhc3luYyByZWFkVGV4dCgpIHtcbiAgICByZXR1cm4gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xuICB9LFxufTtcbiIsIi8qISBqcy1jb29raWUgdjMuMC41IHwgTUlUICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbmZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbnZhciBkZWZhdWx0Q29udmVydGVyID0ge1xuICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgLyUoMlszNDZCRl18M1tBQy1GXXw0MHw1W0JERV18NjB8N1tCQ0RdKS9nLFxuICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgKVxuICB9XG59O1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbmZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgZnVuY3Rpb24gc2V0IChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcykge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCBkZWZhdWx0QXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMuZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcbiAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IG5ldyBEYXRlKERhdGUubm93KCkgKyBhdHRyaWJ1dGVzLmV4cGlyZXMgKiA4NjRlNSk7XG4gICAgfVxuICAgIGlmIChhdHRyaWJ1dGVzLmV4cGlyZXMpIHtcbiAgICAgIGF0dHJpYnV0ZXMuZXhwaXJlcyA9IGF0dHJpYnV0ZXMuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICAgIH1cblxuICAgIG5hbWUgPSBlbmNvZGVVUklDb21wb25lbnQobmFtZSlcbiAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgIC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XG5cbiAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXG4gICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAvLyAuLi5cbiAgICAgIC8vIDMuICBJZiB0aGUgcmVtYWluaW5nIHVucGFyc2VkLWF0dHJpYnV0ZXMgY29udGFpbnMgYSAleDNCIChcIjtcIilcbiAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgLy8gbm90IGluY2x1ZGluZywgdGhlIGZpcnN0ICV4M0IgKFwiO1wiKSBjaGFyYWN0ZXIuXG4gICAgICAvLyAuLi5cbiAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAgbmFtZSArICc9JyArIGNvbnZlcnRlci53cml0ZSh2YWx1ZSwgbmFtZSkgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpXG4gIH1cblxuICBmdW5jdGlvbiBnZXQgKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAhbmFtZSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcbiAgICAvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC5cbiAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuICAgIHZhciBqYXIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGZvdW5kID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKTtcbiAgICAgICAgamFyW2ZvdW5kXSA9IGNvbnZlcnRlci5yZWFkKHZhbHVlLCBmb3VuZCk7XG5cbiAgICAgICAgaWYgKG5hbWUgPT09IGZvdW5kKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICByZXR1cm4gbmFtZSA/IGphcltuYW1lXSA6IGphclxuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoXG4gICAge1xuICAgICAgc2V0LFxuICAgICAgZ2V0LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAobmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICBzZXQoXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBhc3NpZ24oe30sIGF0dHJpYnV0ZXMsIHtcbiAgICAgICAgICAgIGV4cGlyZXM6IC0xXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB3aXRoQXR0cmlidXRlczogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmV0dXJuIGluaXQodGhpcy5jb252ZXJ0ZXIsIGFzc2lnbih7fSwgdGhpcy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKSlcbiAgICAgIH0sXG4gICAgICB3aXRoQ29udmVydGVyOiBmdW5jdGlvbiAoY29udmVydGVyKSB7XG4gICAgICAgIHJldHVybiBpbml0KGFzc2lnbih7fSwgdGhpcy5jb252ZXJ0ZXIsIGNvbnZlcnRlciksIHRoaXMuYXR0cmlidXRlcylcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoZGVmYXVsdEF0dHJpYnV0ZXMpIH0sXG4gICAgICBjb252ZXJ0ZXI6IHsgdmFsdWU6IE9iamVjdC5mcmVlemUoY29udmVydGVyKSB9XG4gICAgfVxuICApXG59XG5cbnZhciBhcGkgPSBpbml0KGRlZmF1bHRDb252ZXJ0ZXIsIHsgcGF0aDogJy8nIH0pO1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuZXhwb3J0IHsgYXBpIGFzIGRlZmF1bHQgfTtcbiIsIi8vIGNvb2tpZeaTjeS9nFxuaW1wb3J0IGpzQ29va2llIGZyb20gJ2pzLWNvb2tpZSc7XG4vLyDnlKjliLDnmoTlupPkuZ/lr7zlh7rkvr/kuo7oh6rooYzpgInnlKhcbmV4cG9ydCB7IGpzQ29va2llIH07XG5cbi8vIOWQjCBqcy1jb29raWUg55qE6YCJ6aG55ZCI5bm25pa55byPXG5mdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCAuLi5zb3VyY2VzKSB7XG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG4vLyBjb29raWXlr7nosaFcbmV4cG9ydCBjbGFzcyBDb29raWUge1xuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gb3B0aW9ucyDpgInpoblcbiAgICogICAgICAgICAgY29udmVydGVyICDlkIwganMtY29va2llcyDnmoQgY29udmVydGVyXG4gICAqICAgICAgICAgIGF0dHJpYnV0ZXMg5ZCMIGpzLWNvb2tpZXMg55qEIGF0dHJpYnV0ZXNcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2i44CCanMtY29va2llIOWcqDMuMOeJiOacrChjb21taXQ6IDRiNzkyOTBiOThkN2ZiZjFhYjQ5M2E3ZjllMTYxOTQxOGFjMDFlNDUpIOenu+mZpOS6huWvuSBqc29uIOeahOiHquWKqOi9rOaNou+8jOi/memHjOm7mOiupCB0cnVlIOWKoOS4ilxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgLy8g6YCJ6aG557uT5p6cXG4gICAgY29uc3QgeyBjb252ZXJ0ZXIgPSB7fSwgYXR0cmlidXRlcyA9IHt9LCBqc29uID0gdHJ1ZSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBvcHRpb25zUmVzdWx0ID0ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGpzb24sXG4gICAgICBhdHRyaWJ1dGVzOiBhc3NpZ24oe30sIGpzQ29va2llLmF0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMpLFxuICAgICAgY29udmVydGVyOiBhc3NpZ24oe30sIGpzQ29va2llLmNvbnZlcnRlciwgY29udmVydGVyKSxcbiAgICB9O1xuICAgIC8vIOWjsOaYjuWQhOWxnuaAp+OAguebtOaOpeaIluWcqGNvbnN0cnVjdG9y5Lit6YeN5paw6LWL5YC8XG4gICAgLy8g6buY6K6k6YCJ6aG557uT5p6cXG4gICAgdGhpcy4kZGVmYXVsdHMgPSBvcHRpb25zUmVzdWx0O1xuICB9XG4gICRkZWZhdWx0cztcbiAgLy8g5YaZ5YWlXG4gIC8qKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIGF0dHJpYnV0ZXNcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqICAgICAgICAgIGpzb24g5piv5ZCm6L+b6KGManNvbui9rOaNolxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIHNldChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBhdHRyaWJ1dGVzID0gYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzQ29va2llLnNldChuYW1lLCB2YWx1ZSwgYXR0cmlidXRlcyk7XG4gIH1cbiAgLy8g6K+75Y+WXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcGFyYW0gb3B0aW9ucyDphY3nva7poblcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2iXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0KG5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGpzb24gPSAnanNvbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuanNvbiA6IHRoaXMuJGRlZmF1bHRzLmpzb247XG4gICAgbGV0IHJlc3VsdCA9IGpzQ29va2llLmdldChuYW1lKTtcbiAgICBpZiAoanNvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g56e76ZmkXG4gIHJlbW92ZShuYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgYXR0cmlidXRlcyA9IGFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG4gICAgcmV0dXJuIGpzQ29va2llLnJlbW92ZShuYW1lLCBhdHRyaWJ1dGVzKTtcbiAgfVxuICAvLyDliJvlu7rjgILpgJrov4fphY3nva7pu5jorqTlj4LmlbDliJvlu7rmlrDlr7nosaHvvIznroDljJbkvKDlj4JcbiAgY3JlYXRlKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgYXR0cmlidXRlczogYXNzaWduKHt9LCB0aGlzLiRkZWZhdWx0cy5hdHRyaWJ1dGVzLCBvcHRpb25zLmF0dHJpYnV0ZXMpLFxuICAgICAgY29udmVydGVyOiBhc3NpZ24oe30sIHRoaXMuJGRlZmF1bHRzLmF0dHJpYnV0ZXMsIG9wdGlvbnMuY29udmVydGVyKSxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgQ29va2llKG9wdGlvbnNSZXN1bHQpO1xuICB9XG59XG5leHBvcnQgY29uc3QgY29va2llID0gbmV3IENvb2tpZSgpO1xuIiwiZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZSAtIGZpbGUgc2l6ZSBoYWNrc1xuICAgICAgICByZXF1ZXN0Lm9uY29tcGxldGUgPSByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHJlc29sdmUocmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICAvLyBAdHMtaWdub3JlIC0gZmlsZSBzaXplIGhhY2tzXG4gICAgICAgIHJlcXVlc3Qub25hYm9ydCA9IHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlKGRiTmFtZSwgc3RvcmVOYW1lKSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSk7XG4gICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiByZXF1ZXN0LnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xuICAgIGNvbnN0IGRicCA9IHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCk7XG4gICAgcmV0dXJuICh0eE1vZGUsIGNhbGxiYWNrKSA9PiBkYnAudGhlbigoZGIpID0+IGNhbGxiYWNrKGRiLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgdHhNb2RlKS5vYmplY3RTdG9yZShzdG9yZU5hbWUpKSk7XG59XG5sZXQgZGVmYXVsdEdldFN0b3JlRnVuYztcbmZ1bmN0aW9uIGRlZmF1bHRHZXRTdG9yZSgpIHtcbiAgICBpZiAoIWRlZmF1bHRHZXRTdG9yZUZ1bmMpIHtcbiAgICAgICAgZGVmYXVsdEdldFN0b3JlRnVuYyA9IGNyZWF0ZVN0b3JlKCdrZXl2YWwtc3RvcmUnLCAna2V5dmFsJyk7XG4gICAgfVxuICAgIHJldHVybiBkZWZhdWx0R2V0U3RvcmVGdW5jO1xufVxuLyoqXG4gKiBHZXQgYSB2YWx1ZSBieSBpdHMga2V5LlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBnZXQoa2V5LCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXQoa2V5KSkpO1xufVxuLyoqXG4gKiBTZXQgYSB2YWx1ZSB3aXRoIGEga2V5LlxuICpcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgc3RvcmUucHV0KHZhbHVlLCBrZXkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIFNldCBtdWx0aXBsZSB2YWx1ZXMgYXQgb25jZS4gVGhpcyBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIHNldCgpIG11bHRpcGxlIHRpbWVzLlxuICogSXQncyBhbHNvIGF0b21pYyDigJMgaWYgb25lIG9mIHRoZSBwYWlycyBjYW4ndCBiZSBhZGRlZCwgbm9uZSB3aWxsIGJlIGFkZGVkLlxuICpcbiAqIEBwYXJhbSBlbnRyaWVzIEFycmF5IG9mIGVudHJpZXMsIHdoZXJlIGVhY2ggZW50cnkgaXMgYW4gYXJyYXkgb2YgYFtrZXksIHZhbHVlXWAuXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gc2V0TWFueShlbnRyaWVzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4gc3RvcmUucHV0KGVudHJ5WzFdLCBlbnRyeVswXSkpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbik7XG4gICAgfSk7XG59XG4vKipcbiAqIEdldCBtdWx0aXBsZSB2YWx1ZXMgYnkgdGhlaXIga2V5c1xuICpcbiAqIEBwYXJhbSBrZXlzXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFueShrZXlzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gUHJvbWlzZS5hbGwoa2V5cy5tYXAoKGtleSkgPT4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXQoa2V5KSkpKSk7XG59XG4vKipcbiAqIFVwZGF0ZSBhIHZhbHVlLiBUaGlzIGxldHMgeW91IHNlZSB0aGUgb2xkIHZhbHVlIGFuZCB1cGRhdGUgaXQgYXMgYW4gYXRvbWljIG9wZXJhdGlvbi5cbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gdXBkYXRlciBBIGNhbGxiYWNrIHRoYXQgdGFrZXMgdGhlIG9sZCB2YWx1ZSBhbmQgcmV0dXJucyBhIG5ldyB2YWx1ZS5cbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiB1cGRhdGUoa2V5LCB1cGRhdGVyLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IFxuICAgIC8vIE5lZWQgdG8gY3JlYXRlIHRoZSBwcm9taXNlIG1hbnVhbGx5LlxuICAgIC8vIElmIEkgdHJ5IHRvIGNoYWluIHByb21pc2VzLCB0aGUgdHJhbnNhY3Rpb24gY2xvc2VzIGluIGJyb3dzZXJzXG4gICAgLy8gdGhhdCB1c2UgYSBwcm9taXNlIHBvbHlmaWxsIChJRTEwLzExKS5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHN0b3JlLmdldChrZXkpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3RvcmUucHV0KHVwZGF0ZXIodGhpcy5yZXN1bHQpLCBrZXkpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocHJvbWlzaWZ5UmVxdWVzdChzdG9yZS50cmFuc2FjdGlvbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKTtcbn1cbi8qKlxuICogRGVsZXRlIGEgcGFydGljdWxhciBrZXkgZnJvbSB0aGUgc3RvcmUuXG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIGN1c3RvbVN0b3JlIE1ldGhvZCB0byBnZXQgYSBjdXN0b20gc3RvcmUuIFVzZSB3aXRoIGNhdXRpb24gKHNlZSB0aGUgZG9jcykuXG4gKi9cbmZ1bmN0aW9uIGRlbChrZXksIGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWR3cml0ZScsIChzdG9yZSkgPT4ge1xuICAgICAgICBzdG9yZS5kZWxldGUoa2V5KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBEZWxldGUgbXVsdGlwbGUga2V5cyBhdCBvbmNlLlxuICpcbiAqIEBwYXJhbSBrZXlzIExpc3Qgb2Yga2V5cyB0byBkZWxldGUuXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gZGVsTWFueShrZXlzLCBjdXN0b21TdG9yZSA9IGRlZmF1bHRHZXRTdG9yZSgpKSB7XG4gICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkd3JpdGUnLCAoc3RvcmUpID0+IHtcbiAgICAgICAga2V5cy5mb3JFYWNoKChrZXkpID0+IHN0b3JlLmRlbGV0ZShrZXkpKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDbGVhciBhbGwgdmFsdWVzIGluIHRoZSBzdG9yZS5cbiAqXG4gKiBAcGFyYW0gY3VzdG9tU3RvcmUgTWV0aG9kIHRvIGdldCBhIGN1c3RvbSBzdG9yZS4gVXNlIHdpdGggY2F1dGlvbiAoc2VlIHRoZSBkb2NzKS5cbiAqL1xuZnVuY3Rpb24gY2xlYXIoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZHdyaXRlJywgKHN0b3JlKSA9PiB7XG4gICAgICAgIHN0b3JlLmNsZWFyKCk7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLnRyYW5zYWN0aW9uKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGVhY2hDdXJzb3Ioc3RvcmUsIGNhbGxiYWNrKSB7XG4gICAgc3RvcmUub3BlbkN1cnNvcigpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlc3VsdClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5yZXN1bHQpO1xuICAgICAgICB0aGlzLnJlc3VsdC5jb250aW51ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUudHJhbnNhY3Rpb24pO1xufVxuLyoqXG4gKiBHZXQgYWxsIGtleXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBrZXlzKGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiB7XG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGlmIChzdG9yZS5nZXRBbGxLZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChzdG9yZS5nZXRBbGxLZXlzKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgIHJldHVybiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKGN1cnNvci5rZXkpKS50aGVuKCgpID0+IGl0ZW1zKTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IGFsbCB2YWx1ZXMgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiB2YWx1ZXMoY3VzdG9tU3RvcmUgPSBkZWZhdWx0R2V0U3RvcmUoKSkge1xuICAgIHJldHVybiBjdXN0b21TdG9yZSgncmVhZG9ubHknLCAoc3RvcmUpID0+IHtcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICAgIHJldHVybiBlYWNoQ3Vyc29yKHN0b3JlLCAoY3Vyc29yKSA9PiBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSkpLnRoZW4oKCkgPT4gaXRlbXMpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBHZXQgYWxsIGVudHJpZXMgaW4gdGhlIHN0b3JlLiBFYWNoIGVudHJ5IGlzIGFuIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gLlxuICpcbiAqIEBwYXJhbSBjdXN0b21TdG9yZSBNZXRob2QgdG8gZ2V0IGEgY3VzdG9tIHN0b3JlLiBVc2Ugd2l0aCBjYXV0aW9uIChzZWUgdGhlIGRvY3MpLlxuICovXG5mdW5jdGlvbiBlbnRyaWVzKGN1c3RvbVN0b3JlID0gZGVmYXVsdEdldFN0b3JlKCkpIHtcbiAgICByZXR1cm4gY3VzdG9tU3RvcmUoJ3JlYWRvbmx5JywgKHN0b3JlKSA9PiB7XG4gICAgICAgIC8vIEZhc3QgcGF0aCBmb3IgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIC8vIChhbHRob3VnaCwgaG9wZWZ1bGx5IHdlJ2xsIGdldCBhIHNpbXBsZXIgcGF0aCBzb21lIGRheSlcbiAgICAgICAgaWYgKHN0b3JlLmdldEFsbCAmJiBzdG9yZS5nZXRBbGxLZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIHByb21pc2lmeVJlcXVlc3Qoc3RvcmUuZ2V0QWxsS2V5cygpKSxcbiAgICAgICAgICAgICAgICBwcm9taXNpZnlSZXF1ZXN0KHN0b3JlLmdldEFsbCgpKSxcbiAgICAgICAgICAgIF0pLnRoZW4oKFtrZXlzLCB2YWx1ZXNdKSA9PiBrZXlzLm1hcCgoa2V5LCBpKSA9PiBba2V5LCB2YWx1ZXNbaV1dKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgcmV0dXJuIGN1c3RvbVN0b3JlKCdyZWFkb25seScsIChzdG9yZSkgPT4gZWFjaEN1cnNvcihzdG9yZSwgKGN1cnNvcikgPT4gaXRlbXMucHVzaChbY3Vyc29yLmtleSwgY3Vyc29yLnZhbHVlXSkpLnRoZW4oKCkgPT4gaXRlbXMpKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgY2xlYXIsIGNyZWF0ZVN0b3JlLCBkZWwsIGRlbE1hbnksIGVudHJpZXMsIGdldCwgZ2V0TWFueSwga2V5cywgcHJvbWlzaWZ5UmVxdWVzdCwgc2V0LCBzZXRNYW55LCB1cGRhdGUsIHZhbHVlcyB9O1xuIiwiZXhwb3J0IGNsYXNzIF9TdG9yYWdlIHtcbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqICAgICAgICAgIHN0b3JhZ2Ug5a+55bqU55qEc3RvcmFnZeWvueixoeOAgmxvY2FsU3RvcmFnZSDmiJYgc2Vzc2lvblN0b3JhZ2VcbiAgICogICAgICAgICAganNvbiDmmK/lkKbov5vooYxqc29u6L2s5o2i44CCXG4gICAqIEByZXR1cm5zIHt2b2lkfCp9XG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGZyb20sIGpzb24gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9wdGlvbnNSZXN1bHQgPSB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZnJvbSxcbiAgICAgIGpzb24sXG4gICAgfTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcbiAgICAgIC8vIOm7mOiupOmAiemhuee7k+aenFxuICAgICAgJGRlZmF1bHRzOiBvcHRpb25zUmVzdWx0LFxuICAgICAgLy8g5a+55bqU55qEc3RvcmFnZeWvueixoeOAglxuICAgICAgc3RvcmFnZTogZnJvbSxcbiAgICAgIC8vIOWOn+acieaWueazleOAgueUseS6jiBPYmplY3QuY3JlYXRlKGZyb20pIOaWueW8j+e7p+aJv+aXtuiwg+eUqOS8muaKpSBVbmNhdWdodCBUeXBlRXJyb3I6IElsbGVnYWwgaW52b2NhdGlvbu+8jOaUueaIkOWNleeLrOWKoOWFpeaWueW8j1xuICAgICAgc2V0SXRlbTogZnJvbS5zZXRJdGVtLmJpbmQoZnJvbSksXG4gICAgICBnZXRJdGVtOiBmcm9tLmdldEl0ZW0uYmluZChmcm9tKSxcbiAgICAgIHJlbW92ZUl0ZW06IGZyb20ucmVtb3ZlSXRlbS5iaW5kKGZyb20pLFxuICAgICAga2V5OiBmcm9tLmtleS5iaW5kKGZyb20pLFxuICAgICAgY2xlYXI6IGZyb20uY2xlYXIuYmluZChmcm9tKSxcbiAgICB9KTtcbiAgfVxuICAvLyDlo7DmmI7lkITlsZ7mgKfjgILnm7TmjqXmiJblnKhjb25zdHJ1Y3RvcuS4remHjeaWsOi1i+WAvFxuICAkZGVmYXVsdHM7XG4gIHN0b3JhZ2U7XG4gIHNldEl0ZW07XG4gIGdldEl0ZW07XG4gIHJlbW92ZUl0ZW07XG4gIGtleTtcbiAgY2xlYXI7XG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5sZW5ndGg7XG4gIH1cbiAgLy8g5Yik5pat5bGe5oCn5piv5ZCm5a2Y5Zyo44CC5ZCM5pe255So5LqO5ZyoIGdldCDkuK3lr7nkuI3lrZjlnKjnmoTlsZ7mgKfov5Tlm54gdW5kZWZpbmVkXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zdG9yYWdlKS5pbmNsdWRlcyhrZXkpO1xuICB9XG4gIC8vIOWGmeWFpVxuICBzZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QganNvbiA9ICdqc29uJyBpbiBvcHRpb25zID8gb3B0aW9ucy5qc29uIDogdGhpcy4kZGVmYXVsdHMuanNvbjtcbiAgICBpZiAoanNvbikge1xuICAgICAgLy8g5aSE55CG5a2YIHVuZGVmaW5lZCDnmoTmg4XlhrXvvIzms6jmhI/lr7nosaHkuK3nmoTmmL7lvI8gdW5kZWZpbmVkIOeahOWxnuaAp+S8muiiqyBqc29uIOW6j+WIl+WMluenu+mZpFxuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICB9XG4gIC8vIOivu+WPllxuICBnZXQoa2V5LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBqc29uID0gJ2pzb24nIGluIG9wdGlvbnMgPyBvcHRpb25zLmpzb24gOiB0aGlzLiRkZWZhdWx0cy5qc29uO1xuICAgIC8vIOWkhOeQhuaXoOWxnuaAp+eahOeahOaDheWGtei/lOWbniB1bmRlZmluZWRcbiAgICBpZiAoanNvbiAmJiAhdGhpcy5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8g5YW25LuW5YC85Yik5pat6L+U5ZueXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgaWYgKGpzb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIOenu+mZpFxuICByZW1vdmUoa2V5KSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gIH1cbiAgLy8g5Yib5bu644CC6YCa6L+H6YWN572u6buY6K6k5Y+C5pWw5Yib5bu65paw5a+56LGh77yM566A5YyW5Lyg5Y+CXG4gIGNyZWF0ZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zUmVzdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy4kZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgX1N0b3JhZ2Uob3B0aW9uc1Jlc3VsdCk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBfbG9jYWxTdG9yYWdlID0gbmV3IF9TdG9yYWdlKHsgZnJvbTogbG9jYWxTdG9yYWdlIH0pO1xuZXhwb3J0IGNvbnN0IF9zZXNzaW9uU3RvcmFnZSA9IG5ldyBfU3RvcmFnZSh7IGZyb206IHNlc3Npb25TdG9yYWdlIH0pO1xuIl0sIm5hbWVzIjpbImFzc2lnbiIsImtleXMiLCJiYXNlQ29uZmlnIiwiRGF0YS5kZWVwQ2xvbmUiLCJEYXRhLmdldEV4YWN0VHlwZSIsIl9PYmplY3QuZGVlcEFzc2lnbiIsImpzQ29va2llIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNPLE1BQU0sTUFBTSxHQUFHLENBQUMsU0FBUyxRQUFRLEdBQUc7QUFDM0MsRUFBRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxVQUFVLEtBQUssTUFBTSxFQUFFO0FBQzlELElBQUksT0FBTyxTQUFTLENBQUM7QUFDckIsR0FBRztBQUNILEVBQUUsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtBQUM5RCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUc7QUFDSCxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxHQUFHLENBQUM7QUFD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QzdDLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO0FBQzdCLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDckQsR0FBRztBQUNILEVBQUUsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssTUFBTSxFQUFFO0FBQ3JDLElBQUksT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUs7QUFDdkUsTUFBTSxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM3QyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ1IsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkOzs7Ozs7Ozs7OztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxNQUFNLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDaEMsRUFBRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzlCO0FBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssTUFBTSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUM1RixJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDakMsR0FBRyxNQUFNO0FBQ1Q7QUFDQSxJQUFJLE9BQU8sU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLFNBQVMs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
