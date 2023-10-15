import { Data } from 'hp-shared/base';
import * as jsminiType from '@jsmini/type';

/**
 * 简单类型，对应 SIMPLE_TYPES
 */
export const _null = null;
export const _undefined = undefined;
export const number = 0;
export const string = '';
export const boolean = false;
export const bigint = 0n;
export const symbol = Symbol();
// 包装对象。https://wangdoc.com/javascript/stdlib/wrapper
// eslint-disable-next-line no-new-wrappers
export const numberByNew = new Number();
// eslint-disable-next-line no-new-wrappers
export const stringByNew = new String();
// eslint-disable-next-line no-new-wrappers
export const booleanByNew = new Boolean();
// 简单类型集合
export const simpleData = {
  _null,
  _undefined,
  number,
  string,
  boolean,
  bigint,
  symbol,
  numberByNew,
  stringByNew,
  booleanByNew,
  toJSON() {
    return { _null, number, string, boolean };
  },
  toJSONWithUndefined() {
    return { ...this.toJSON(), _undefined };
  },
};

/**
 * 纯对象类型
 */
export const object = {};
export const object_object = Object.create(object);
export const object_object_object = Object.create(object_object);
export const objectByCreateNull = Object.create(null);
export const object_objectByCreateNull = Object.create(objectByCreateNull);
export const object_object_objectByCreateNull = Object.create(object_objectByCreateNull);
export const objectProxy = new Proxy(object, {});
// es5 function 写法
function Es5Function() {}
export const objectEs5 = new Es5Function();
// es6 class写法
class Es6Class {}
export const objectEs6 = new Es6Class();
class Es6ClassExtend extends Es6Class {}
export const object_objectEs6 = new Es6ClassExtend();
// 继承原生对象
class CustomObject extends Object {}
export const objectByCustom = new CustomObject();
// 纯对象类型集合
export const pureObjectData = {
  object,
  object_object,
  object_object_object,
  objectByCreateNull,
  object_objectByCreateNull,
  object_object_objectByCreateNull,
  objectProxy,
  objectEs5,
  objectEs6,
  object_objectEs6,
  objectByCustom,
};

/**
 * iterable:array、set、map
 */
export const array = [];
export const set = new Set();
export const weakSet = new WeakSet();
export const map = new Map();
export const weakMap = new WeakMap();
export const iterableData = {
  array,
  set,
  weakSet,
  map,
  weakMap,
};

/**
 * others
 */
export function _function() {}
export async function _async_function() {}
export const date = new Date();
export const regexp = /\d/;
export const promise = new Promise((resolve, reject) => {});
export const error = new Error();
export const syntaxError = new SyntaxError();
export const _arguments = (function() {
  return arguments;
})();
export const otherData = {
  _function,
  _async_function,
  date,
  regexp,
  promise,
  error,
  syntaxError,
  _arguments,
};

/**
 * 各类型集合
 */
export const multiData = {
  ...simpleData,
  ...pureObjectData,
  ...iterableData,
  ...otherData,
};

// 获取值和类型信息，用于列表显示
export function getValuesTypes(obj, fn = val => val) {
  return Object.entries(obj).map(([name, value]) => {
    const item = {
      name,
      rawValue: value,
      value,
      'typeof': typeof value,
      'Object.prototype.toString': Object.prototype.toString.call(value),
      'jsminiType.type': jsminiType.type(value),
      'Data.getExactType': Data.getExactType(value),
      'Data.getExactTypes': Data.getExactTypes(value),
    };
    return fn(item);
  });
}
