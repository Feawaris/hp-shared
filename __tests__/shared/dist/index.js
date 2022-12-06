/*
 * rollup 打包配置：{"name":"testsShared","format":"umd","noConflict":true}
 */
  
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('hp-shared/base')) :
  typeof define === 'function' && define.amd ? define(['exports', 'hp-shared/base'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global.testsShared;
    var exports = global.testsShared = {};
    factory(exports, global.base);
    exports.noConflict = function () { global.testsShared = current; return exports; };
  })());
})(this, (function (exports, base) { 'use strict';

  /*!
   * @jsmini/type 0.9.2 (https://github.com/jsmini/type)
   * API https://github.com/jsmini/type/blob/master/doc/api.md
   * Copyright 2017-2019 jsmini. All Rights Reserved
   * Licensed under MIT (https://github.com/jsmini/type/blob/master/LICENSE)
   */

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var toString = Object.prototype.toString;
  function type(x) {
    var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    strict = !!strict; // fix typeof null = object

    if (x === null) {
      return 'null';
    }

    var t = _typeof(x); // 严格模式 区分NaN和number


    if (strict && t === 'number' && isNaN(x)) {
      return 'nan';
    } // number string boolean undefined symbol


    if (t !== 'object') {
      return t;
    }

    var cls;
    var clsLow;

    try {
      cls = toString.call(x).slice(8, -1);
      clsLow = cls.toLowerCase();
    } catch (e) {
      // ie下的 activex对象
      return 'object';
    }

    if (clsLow !== 'object') {
      if (strict) {
        // 区分NaN和new Number
        if (clsLow === 'number' && isNaN(x)) {
          return 'NaN';
        } // 区分 String() 和 new String()


        if (clsLow === 'number' || clsLow === 'boolean' || clsLow === 'string') {
          return cls;
        }
      }

      return clsLow;
    }

    if (x.constructor == Object) {
      return clsLow;
    } // Object.create(null)


    try {
      // __proto__ 部分早期firefox浏览器
      if (Object.getPrototypeOf(x) === null || x.__proto__ === null) {
        return 'object';
      }
    } catch (e) {} // ie下无Object.getPrototypeOf会报错
    // function A() {}; new A


    try {
      var cname = x.constructor.name;

      if (typeof cname === 'string') {
        return cname;
      }
    } catch (e) {} // 无constructor
    // function A() {}; A.prototype.constructor = null; new A


    return 'unknown';
  }

  /**
   * 简单类型，对应 SIMPLE_TYPES
   */
  const _null = null;
  const _undefined = undefined;
  const number = 0;
  const string = '';
  const boolean = false;
  const bigint = 0n;
  const symbol = Symbol();
  // 包装对象。https://wangdoc.com/javascript/stdlib/wrapper
  const numberByNew = new Number();
  const stringByNew = new String();
  const booleanByNew = new Boolean();
  // 简单类型集合
  const simpleData = {
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
  const object = {};
  const object_object = Object.create(object);
  const object_object_object = Object.create(object_object);
  const objectByCreateNull = Object.create(null);
  const object_objectByCreateNull = Object.create(objectByCreateNull);
  const object_object_objectByCreateNull = Object.create(object_objectByCreateNull);
  const objectProxy = new Proxy(object, {});
  // es5 function 写法
  function Es5Function() {}
  const objectEs5 = new Es5Function();
  // es6 class写法
  class Es6Class {}
  const objectEs6 = new Es6Class();
  class Es6ClassExtend extends Es6Class {}
  const object_objectEs6 = new Es6ClassExtend();
  // 继承原生对象
  class CustomObject extends Object {}
  const objectByCustom = new CustomObject();
  // 纯对象类型集合
  const pureObjectData = {
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
  const array = [];
  const set = new Set();
  const weakSet = new WeakSet();
  const map = new Map();
  const weakMap = new WeakMap();
  const iterableData = {
    array,
    set,
    weakSet,
    map,
    weakMap,
  };
  /**
   * others
   */
  function _function() {}
  async function _async_function() {}
  const date = new Date();
  const regexp = /\d/;
  const promise = new Promise((resolve, reject) => {});
  const error = new Error();
  const syntaxError = new SyntaxError();
  const _arguments = (function() {
    return arguments;
  })();
  const otherData = {
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
  const multiData = {
    ...simpleData,
    ...pureObjectData,
    ...iterableData,
    ...otherData,
  };
  // 获取值和类型信息，用于列表显示
  function getValues(obj, fn = base.RAW) {
    return Object.entries(obj).map(([name, value]) => {
      const item = {
        name,
        rawValue: value,
        value,
        'typeof': typeof value,
        'Object.prototype.toString': Object.prototype.toString.call(value),
        'jsminiType.type':type(value),
        'Data.getExactType': base.Data.getExactType(value),
        'Data.getExactTypes': base.Data.getExactTypes(value),
      };
      return fn(item);
    });
  }
  // 字符串方法用
  const names = [
    '',
    'xxName',
    'xx-name',
    'el-button-group',
    'elButtonGroup',
    'ElButtonGroup',
    'onUpdate:modelValue',
    'on-update:model-value',
  ];

  // 测试共用模块
  // 创建代理tests增加辅助显示
  function createTestsProxy(tests) {
    return new Proxy(tests, {
      get(target, p, receiver) {
        if (Object.keys(target).includes(p)) {
          const fn = Reflect.get(...arguments);
          return function() {
            console.group(p);
            fn(...arguments);
            console.groupEnd();
          };
        }
      },
    });
  }

  exports._arguments = _arguments;
  exports._async_function = _async_function;
  exports._function = _function;
  exports._null = _null;
  exports._undefined = _undefined;
  exports.array = array;
  exports.bigint = bigint;
  exports.boolean = boolean;
  exports.booleanByNew = booleanByNew;
  exports.createTestsProxy = createTestsProxy;
  exports.date = date;
  exports.error = error;
  exports.getValues = getValues;
  exports.iterableData = iterableData;
  exports.map = map;
  exports.multiData = multiData;
  exports.names = names;
  exports.number = number;
  exports.numberByNew = numberByNew;
  exports.object = object;
  exports.objectByCreateNull = objectByCreateNull;
  exports.objectByCustom = objectByCustom;
  exports.objectEs5 = objectEs5;
  exports.objectEs6 = objectEs6;
  exports.objectProxy = objectProxy;
  exports.object_object = object_object;
  exports.object_objectByCreateNull = object_objectByCreateNull;
  exports.object_objectEs6 = object_objectEs6;
  exports.object_object_object = object_object_object;
  exports.object_object_objectByCreateNull = object_object_objectByCreateNull;
  exports.otherData = otherData;
  exports.promise = promise;
  exports.pureObjectData = pureObjectData;
  exports.regexp = regexp;
  exports.set = set;
  exports.simpleData = simpleData;
  exports.string = string;
  exports.stringByNew = stringByNew;
  exports.symbol = symbol;
  exports.syntaxError = syntaxError;
  exports.weakMap = weakMap;
  exports.weakSet = weakSet;

}));
