/*
 * rollup 打包配置：{"name":"testsShared","format":"umd","noConflict":true,"sourcemap":"inline"}
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
        'jsminiType.type': type(value),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AanNtaW5pK3R5cGVAMC45LjIvbm9kZV9tb2R1bGVzL0Bqc21pbmkvdHlwZS9kaXN0L2luZGV4LmVzbS5qcyIsIi4uL3NyYy9iYXNlLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGpzbWluaS90eXBlIDAuOS4yIChodHRwczovL2dpdGh1Yi5jb20vanNtaW5pL3R5cGUpXG4gKiBBUEkgaHR0cHM6Ly9naXRodWIuY29tL2pzbWluaS90eXBlL2Jsb2IvbWFzdGVyL2RvYy9hcGkubWRcbiAqIENvcHlyaWdodCAyMDE3LTIwMTkganNtaW5pLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9qc21pbmkvdHlwZS9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICovXG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn1cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmZ1bmN0aW9uIHR5cGUoeCkge1xuICB2YXIgc3RyaWN0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcbiAgc3RyaWN0ID0gISFzdHJpY3Q7IC8vIGZpeCB0eXBlb2YgbnVsbCA9IG9iamVjdFxuXG4gIGlmICh4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuXG4gIHZhciB0ID0gX3R5cGVvZih4KTsgLy8g5Lil5qC85qih5byPIOWMuuWIhk5hTuWSjG51bWJlclxuXG5cbiAgaWYgKHN0cmljdCAmJiB0ID09PSAnbnVtYmVyJyAmJiBpc05hTih4KSkge1xuICAgIHJldHVybiAnbmFuJztcbiAgfSAvLyBudW1iZXIgc3RyaW5nIGJvb2xlYW4gdW5kZWZpbmVkIHN5bWJvbFxuXG5cbiAgaWYgKHQgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHQ7XG4gIH1cblxuICB2YXIgY2xzO1xuICB2YXIgY2xzTG93O1xuXG4gIHRyeSB7XG4gICAgY2xzID0gdG9TdHJpbmcuY2FsbCh4KS5zbGljZSg4LCAtMSk7XG4gICAgY2xzTG93ID0gY2xzLnRvTG93ZXJDYXNlKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBpZeS4i+eahCBhY3RpdmV45a+56LGhXG4gICAgcmV0dXJuICdvYmplY3QnO1xuICB9XG5cbiAgaWYgKGNsc0xvdyAhPT0gJ29iamVjdCcpIHtcbiAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAvLyDljLrliIZOYU7lkoxuZXcgTnVtYmVyXG4gICAgICBpZiAoY2xzTG93ID09PSAnbnVtYmVyJyAmJiBpc05hTih4KSkge1xuICAgICAgICByZXR1cm4gJ05hTic7XG4gICAgICB9IC8vIOWMuuWIhiBTdHJpbmcoKSDlkowgbmV3IFN0cmluZygpXG5cblxuICAgICAgaWYgKGNsc0xvdyA9PT0gJ251bWJlcicgfHwgY2xzTG93ID09PSAnYm9vbGVhbicgfHwgY2xzTG93ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gY2xzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjbHNMb3c7XG4gIH1cblxuICBpZiAoeC5jb25zdHJ1Y3RvciA9PSBPYmplY3QpIHtcbiAgICByZXR1cm4gY2xzTG93O1xuICB9IC8vIE9iamVjdC5jcmVhdGUobnVsbClcblxuXG4gIHRyeSB7XG4gICAgLy8gX19wcm90b19fIOmDqOWIhuaXqeacn2ZpcmVmb3jmtY/op4jlmahcbiAgICBpZiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKHgpID09PSBudWxsIHx8IHguX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7fSAvLyBpZeS4i+aXoE9iamVjdC5nZXRQcm90b3R5cGVPZuS8muaKpemUmVxuICAvLyBmdW5jdGlvbiBBKCkge307IG5ldyBBXG5cblxuICB0cnkge1xuICAgIHZhciBjbmFtZSA9IHguY29uc3RydWN0b3IubmFtZTtcblxuICAgIGlmICh0eXBlb2YgY25hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gY25hbWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7fSAvLyDml6Bjb25zdHJ1Y3RvclxuICAvLyBmdW5jdGlvbiBBKCkge307IEEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnVsbDsgbmV3IEFcblxuXG4gIHJldHVybiAndW5rbm93bic7XG59XG5cbmV4cG9ydCB7IHR5cGUgfTtcbiIsImltcG9ydCB7IFJBVywgRGF0YSB9IGZyb20gJ2hwLXNoYXJlZC9iYXNlJztcbmltcG9ydCAqIGFzIGpzbWluaVR5cGUgZnJvbSAnQGpzbWluaS90eXBlJztcblxuLyoqXG4gKiDnroDljZXnsbvlnovvvIzlr7nlupQgU0lNUExFX1RZUEVTXG4gKi9cbmV4cG9ydCBjb25zdCBfbnVsbCA9IG51bGw7XG5leHBvcnQgY29uc3QgX3VuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbmV4cG9ydCBjb25zdCBudW1iZXIgPSAwO1xuZXhwb3J0IGNvbnN0IHN0cmluZyA9ICcnO1xuZXhwb3J0IGNvbnN0IGJvb2xlYW4gPSBmYWxzZTtcbmV4cG9ydCBjb25zdCBiaWdpbnQgPSAwbjtcbmV4cG9ydCBjb25zdCBzeW1ib2wgPSBTeW1ib2woKTtcbi8vIOWMheijheWvueixoeOAgmh0dHBzOi8vd2FuZ2RvYy5jb20vamF2YXNjcmlwdC9zdGRsaWIvd3JhcHBlclxuZXhwb3J0IGNvbnN0IG51bWJlckJ5TmV3ID0gbmV3IE51bWJlcigpO1xuZXhwb3J0IGNvbnN0IHN0cmluZ0J5TmV3ID0gbmV3IFN0cmluZygpO1xuZXhwb3J0IGNvbnN0IGJvb2xlYW5CeU5ldyA9IG5ldyBCb29sZWFuKCk7XG4vLyDnroDljZXnsbvlnovpm4blkIhcbmV4cG9ydCBjb25zdCBzaW1wbGVEYXRhID0ge1xuICBfbnVsbCxcbiAgX3VuZGVmaW5lZCxcbiAgbnVtYmVyLFxuICBzdHJpbmcsXG4gIGJvb2xlYW4sXG4gIGJpZ2ludCxcbiAgc3ltYm9sLFxuICBudW1iZXJCeU5ldyxcbiAgc3RyaW5nQnlOZXcsXG4gIGJvb2xlYW5CeU5ldyxcbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB7IF9udWxsLCBudW1iZXIsIHN0cmluZywgYm9vbGVhbiB9O1xuICB9LFxuICB0b0pTT05XaXRoVW5kZWZpbmVkKCkge1xuICAgIHJldHVybiB7IC4uLnRoaXMudG9KU09OKCksIF91bmRlZmluZWQgfTtcbiAgfSxcbn07XG4vKipcbiAqIOe6r+Wvueixoeexu+Wei1xuICovXG5leHBvcnQgY29uc3Qgb2JqZWN0ID0ge307XG5leHBvcnQgY29uc3Qgb2JqZWN0X29iamVjdCA9IE9iamVjdC5jcmVhdGUob2JqZWN0KTtcbmV4cG9ydCBjb25zdCBvYmplY3Rfb2JqZWN0X29iamVjdCA9IE9iamVjdC5jcmVhdGUob2JqZWN0X29iamVjdCk7XG5leHBvcnQgY29uc3Qgb2JqZWN0QnlDcmVhdGVOdWxsID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbmV4cG9ydCBjb25zdCBvYmplY3Rfb2JqZWN0QnlDcmVhdGVOdWxsID0gT2JqZWN0LmNyZWF0ZShvYmplY3RCeUNyZWF0ZU51bGwpO1xuZXhwb3J0IGNvbnN0IG9iamVjdF9vYmplY3Rfb2JqZWN0QnlDcmVhdGVOdWxsID0gT2JqZWN0LmNyZWF0ZShvYmplY3Rfb2JqZWN0QnlDcmVhdGVOdWxsKTtcbmV4cG9ydCBjb25zdCBvYmplY3RQcm94eSA9IG5ldyBQcm94eShvYmplY3QsIHt9KTtcbi8vIGVzNSBmdW5jdGlvbiDlhpnms5VcbmZ1bmN0aW9uIEVzNUZ1bmN0aW9uKCkge31cbmV4cG9ydCBjb25zdCBvYmplY3RFczUgPSBuZXcgRXM1RnVuY3Rpb24oKTtcbi8vIGVzNiBjbGFzc+WGmeazlVxuY2xhc3MgRXM2Q2xhc3Mge31cbmV4cG9ydCBjb25zdCBvYmplY3RFczYgPSBuZXcgRXM2Q2xhc3MoKTtcbmNsYXNzIEVzNkNsYXNzRXh0ZW5kIGV4dGVuZHMgRXM2Q2xhc3Mge31cbmV4cG9ydCBjb25zdCBvYmplY3Rfb2JqZWN0RXM2ID0gbmV3IEVzNkNsYXNzRXh0ZW5kKCk7XG4vLyDnu6fmib/ljp/nlJ/lr7nosaFcbmNsYXNzIEN1c3RvbU9iamVjdCBleHRlbmRzIE9iamVjdCB7fVxuZXhwb3J0IGNvbnN0IG9iamVjdEJ5Q3VzdG9tID0gbmV3IEN1c3RvbU9iamVjdCgpO1xuLy8g57qv5a+56LGh57G75Z6L6ZuG5ZCIXG5leHBvcnQgY29uc3QgcHVyZU9iamVjdERhdGEgPSB7XG4gIG9iamVjdCxcbiAgb2JqZWN0X29iamVjdCxcbiAgb2JqZWN0X29iamVjdF9vYmplY3QsXG4gIG9iamVjdEJ5Q3JlYXRlTnVsbCxcbiAgb2JqZWN0X29iamVjdEJ5Q3JlYXRlTnVsbCxcbiAgb2JqZWN0X29iamVjdF9vYmplY3RCeUNyZWF0ZU51bGwsXG4gIG9iamVjdFByb3h5LFxuICBvYmplY3RFczUsXG4gIG9iamVjdEVzNixcbiAgb2JqZWN0X29iamVjdEVzNixcbiAgb2JqZWN0QnlDdXN0b20sXG59O1xuLyoqXG4gKiBpdGVyYWJsZTphcnJheeOAgXNldOOAgW1hcFxuICovXG5leHBvcnQgY29uc3QgYXJyYXkgPSBbXTtcbmV4cG9ydCBjb25zdCBzZXQgPSBuZXcgU2V0KCk7XG5leHBvcnQgY29uc3Qgd2Vha1NldCA9IG5ldyBXZWFrU2V0KCk7XG5leHBvcnQgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xuZXhwb3J0IGNvbnN0IHdlYWtNYXAgPSBuZXcgV2Vha01hcCgpO1xuZXhwb3J0IGNvbnN0IGl0ZXJhYmxlRGF0YSA9IHtcbiAgYXJyYXksXG4gIHNldCxcbiAgd2Vha1NldCxcbiAgbWFwLFxuICB3ZWFrTWFwLFxufTtcbi8qKlxuICogb3RoZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZnVuY3Rpb24oKSB7fVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9hc3luY19mdW5jdGlvbigpIHt9XG5leHBvcnQgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG5leHBvcnQgY29uc3QgcmVnZXhwID0gL1xcZC87XG5leHBvcnQgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHt9KTtcbmV4cG9ydCBjb25zdCBlcnJvciA9IG5ldyBFcnJvcigpO1xuZXhwb3J0IGNvbnN0IHN5bnRheEVycm9yID0gbmV3IFN5bnRheEVycm9yKCk7XG5leHBvcnQgY29uc3QgX2FyZ3VtZW50cyA9IChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cztcbn0pKCk7XG5leHBvcnQgY29uc3Qgb3RoZXJEYXRhID0ge1xuICBfZnVuY3Rpb24sXG4gIF9hc3luY19mdW5jdGlvbixcbiAgZGF0ZSxcbiAgcmVnZXhwLFxuICBwcm9taXNlLFxuICBlcnJvcixcbiAgc3ludGF4RXJyb3IsXG4gIF9hcmd1bWVudHMsXG59O1xuLyoqXG4gKiDlkITnsbvlnovpm4blkIhcbiAqL1xuZXhwb3J0IGNvbnN0IG11bHRpRGF0YSA9IHtcbiAgLi4uc2ltcGxlRGF0YSxcbiAgLi4ucHVyZU9iamVjdERhdGEsXG4gIC4uLml0ZXJhYmxlRGF0YSxcbiAgLi4ub3RoZXJEYXRhLFxufTtcbi8vIOiOt+WPluWAvOWSjOexu+Wei+S/oeaBr++8jOeUqOS6juWIl+ihqOaYvuekulxuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlcyhvYmosIGZuID0gUkFXKSB7XG4gIHJldHVybiBPYmplY3QuZW50cmllcyhvYmopLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICBuYW1lLFxuICAgICAgcmF3VmFsdWU6IHZhbHVlLFxuICAgICAgdmFsdWUsXG4gICAgICAndHlwZW9mJzogdHlwZW9mIHZhbHVlLFxuICAgICAgJ09iamVjdC5wcm90b3R5cGUudG9TdHJpbmcnOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLFxuICAgICAgJ2pzbWluaVR5cGUudHlwZSc6IGpzbWluaVR5cGUudHlwZSh2YWx1ZSksXG4gICAgICAnRGF0YS5nZXRFeGFjdFR5cGUnOiBEYXRhLmdldEV4YWN0VHlwZSh2YWx1ZSksXG4gICAgICAnRGF0YS5nZXRFeGFjdFR5cGVzJzogRGF0YS5nZXRFeGFjdFR5cGVzKHZhbHVlKSxcbiAgICB9O1xuICAgIHJldHVybiBmbihpdGVtKTtcbiAgfSk7XG59XG4vLyDlrZfnrKbkuLLmlrnms5XnlKhcbmV4cG9ydCBjb25zdCBuYW1lcyA9IFtcbiAgJycsXG4gICd4eE5hbWUnLFxuICAneHgtbmFtZScsXG4gICdlbC1idXR0b24tZ3JvdXAnLFxuICAnZWxCdXR0b25Hcm91cCcsXG4gICdFbEJ1dHRvbkdyb3VwJyxcbiAgJ29uVXBkYXRlOm1vZGVsVmFsdWUnLFxuICAnb24tdXBkYXRlOm1vZGVsLXZhbHVlJyxcbl07XG4iLCIvLyDmtYvor5XlhbHnlKjmqKHlnZdcbmV4cG9ydCAqIGZyb20gJy4vYmFzZSc7XG4vLyDliJvlu7rku6PnkIZ0ZXN0c+WinuWKoOi+heWKqeaYvuekulxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRlc3RzUHJveHkodGVzdHMpIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh0ZXN0cywge1xuICAgIGdldCh0YXJnZXQsIHAsIHJlY2VpdmVyKSB7XG4gICAgICBpZiAoT2JqZWN0LmtleXModGFyZ2V0KS5pbmNsdWRlcyhwKSkge1xuICAgICAgICBjb25zdCBmbiA9IFJlZmxlY3QuZ2V0KC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmdyb3VwKHApO1xuICAgICAgICAgIGZuKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xufVxuIl0sIm5hbWVzIjpbIlJBVyIsImpzbWluaVR5cGUudHlwZSIsIkRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztFQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFO0VBQ3RCLEVBQUUsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksT0FBTyxNQUFNLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtFQUMzRSxJQUFJLE9BQU8sR0FBRyxVQUFVLEdBQUcsRUFBRTtFQUM3QixNQUFNLE9BQU8sT0FBTyxHQUFHLENBQUM7RUFDeEIsS0FBSyxDQUFDO0VBQ04sR0FBRyxNQUFNO0VBQ1QsSUFBSSxPQUFPLEdBQUcsVUFBVSxHQUFHLEVBQUU7RUFDN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksR0FBRyxLQUFLLE1BQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLE9BQU8sR0FBRyxDQUFDO0VBQ25JLEtBQUssQ0FBQztFQUNOLEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdEIsQ0FBQztBQUNEO0VBQ0EsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7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
