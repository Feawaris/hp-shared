// 对象
import { _Reflect } from './_Reflect';
import { _Array } from './_Array';

export const _Object = Object.create(null);
/**
 * 浅合并对象。写法同 Object.assign，通过重定义方式合并，解决 Object.assign 合并两边同名属性混有 value写法 和 get/set写法 时报 TypeError: Cannot set property b of #<Object> which has only a getter 的问题
 * @param target 目标对象
 * @param sources 数据源。一个或多个对象
 * @returns {{}}
 */
_Object.assign = function(target = {}, ...sources) {
  for (const source of sources) {
    // 不使用 target[key] = value 写法，直接使用 Object.defineProperty 重定义
    for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
      Object.defineProperty(target, key, desc);
    }
  }
  return target;
};
/**
 * 深合并对象。同 assign 一样也会对属性进行重定义
 * @param target 目标对象
 * @param sources 数据源
 * @returns {{}}
 */
_Object.deepAssign = function(target, ...sources) {
  if (!target) {
    return this.assign({}, ...sources);
  }
  for (const source of sources) {
    for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
      if ('value' in desc) {
        // value 写法：对象递归处理，其他直接定义
        if (Object.prototype.toString.apply(desc.value) === '[object Object]') {
          Object.defineProperty(target, key, {
            ...desc,
            value: this.deepAssign(target[key], desc.value),
          });
        } else {
          Object.defineProperty(target, key, desc);
        }
      } else {
        // get/set 写法：直接定义
        Object.defineProperty(target, key, desc);
      }
    }
  }
  return target;
};

/**
 * 获取属性名。默认参数配置成同 Object.keys 行为
 * @param object 对象
 * @param symbol 是否包含 symbol 属性
 * @param notEnumerable 是否包含不可列举属性
 * @param extend 是否包含承继属性
 * @returns {any[]}
 */
_Object.keys = function(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
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
};
_Object.values = function() {
};
_Object.entries = function() {
};

/**
 * key自身所属的对象
 * @param object 对象
 * @param key 属性名
 * @returns {*|null}
 */
_Object.owner = function(object, key) {
  if (Object.prototype.hasOwnProperty.call(object, key)) {
    return object;
  }
  let __proto__ = Object.getPrototypeOf(object);
  if (__proto__ === null) {
    return null;
  }
  return this.owner(__proto__, key);
};
/**
 * 获取属性描述对象，相比 Object.getOwnPropertyDescriptor，能拿到继承属性的描述对象
 * @param object
 * @param key
 * @returns {undefined|PropertyDescriptor}
 */
_Object.descriptor = function(object, key) {
  const findObject = this.owner(object, key);
  if (!findObject) {
    return undefined;
  }
  return Object.getOwnPropertyDescriptor(findObject, key);
};
/**
 * 对应 keys 获取 descriptors，传参同 keys 方法。可用于重定义属性
 * @param object 对象
 * @param symbol 是否包含 symbol 属性
 * @param notEnumerable 是否包含不可列举属性
 * @param extend 是否包含承继属性
 * @returns {(PropertyDescriptor|undefined)[]}
 */
_Object.descriptors = function(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
  // 选项收集
  const options = { symbol, notEnumerable, extend };
  const _keys = this.keys(object, options);
  return _keys.map(key => this.descriptor(object, key));
};
/**
 * 对应 keys 获取 descriptorEntries，传参同 keys 方法。可用于重定义属性
 * @param object 对象
 * @param symbol 是否包含 symbol 属性
 * @param notEnumerable 是否包含不可列举属性
 * @param extend 是否包含承继属性
 * @returns {[*,(PropertyDescriptor|undefined)][]}
 */
_Object.descriptorEntries = function(object, { symbol = false, notEnumerable = false, extend = false } = {}) {
  // 选项收集
  const options = { symbol, notEnumerable, extend };
  const _keys = this.keys(object, options);
  return _keys.map(key => [key, this.descriptor(object, key)]);
};

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
_Object.filter = function(object, { pick = [], omit = [], emptyPick = 'all', separator = ',', symbol = true, notEnumerable = false, extend = true } = {}) {
  let result = {};
  // pick、omit 统一成数组格式
  pick = _Array.namesToArray(pick, { separator });
  omit = _Array.namesToArray(omit, { separator });
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
};
/**
 * 通过挑选方式选取对象。filter 的简写方式
 * @param object 对象
 * @param keys 属性名集合
 * @param options 选项，同 filter 的各选项值
 * @returns {{}}
 */
_Object.pick = function(object, keys = [], options = {}) {
  return this.filter(object, { pick: keys, emptyPick: 'empty', ...options });
};
/**
 * 通过排除方式选取对象。filter 的简写方式
 * @param object 对象
 * @param keys 属性名集合
 * @param options 选项，同 filter 的各选项值
 * @returns {{}}
 */
_Object.omit = function(object, keys = [], options = {}) {
  return this.filter(object, { omit: keys, ...options });
};
