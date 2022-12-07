/*!
 * hp-shared v0.0.0
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"esm","sourcemap":"inline"}
 */
  
const _String = Object.create(String);
Object.assign(_String, {
  /**
     * 首字母大写
     * @param name
     * @returns {string}
     */
  toFirstUpperCase(name = '') {
    return `${(name[0] ?? '').toUpperCase()}${name.slice(1)}`;
  },
  /**
     * 首字母小写
     * @param name
     * @returns {string}
     */
  toFirstLowerCase(name = '') {
    return `${(name[0] ?? '').toLowerCase()}${name.slice(1)}`;
  },
  /**
     * 转驼峰命名。常用于连接符命名转驼峰命名，如 xx-name -> xxName
     * @param name 名称
     * @param {} 选项
     *          separator 连接符。用于生成正则 默认为中划线 - 对应regexp得到 /-(\w)/g
     *          first 首字母处理方式。true 或 'uppercase'：转换成大写
     *                              false 或 'lowercase'：转换成小写
     *                              'raw' 或 其他无效值：默认原样返回，不进行处理
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
     * @param name 名称
     * @param {} 选项
     *          separator 连接符
     * @returns {string}
     */
  toLineCase(name = '', { separator = '-' } = {}) {
    return name
    // 按连接符拼接
      .replaceAll(/([a-z])([A-Z])/g, `$1${separator}$2`)
    // 转小写
      .toLowerCase();
  },
});

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

const Data = {
  // 简单类型
  SIMPLE_TYPES: [null, undefined, Number, String, Boolean, BigInt, Symbol],
  /**
   * 获取值的具体类型
   * @param value 值
   * @returns {ObjectConstructor|Function|*} 返回对应构造函数。null、undefined 原样返回
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
   * @param value 值
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
  // 深拷贝数据
  deepClone(source, options = {}) {
    // 数组
    if (source instanceof Array) {
      let result = [];
      for (const value of source.values()) {
        result.push(Data.deepClone(value, options));
      }
      return result;
    }
    // Set
    if (source instanceof Set) {
      let result = new Set();
      for (let value of source.values()) {
        result.add(Data.deepClone(value, options));
      }
      return result;
    }
    // Map
    if (source instanceof Map) {
      let result = new Map();
      for (let [key, value] of source.entries()) {
        result.set(key, Data.deepClone(value, options));
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
            value: Data.deepClone(desc.value),
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
   * @param data 值
   * @param options 选项
   *          isWrap 包装数据判断函数，如vue3的isRef函数
   *          unwrap 解包方式函数，如vue3的unref函数
   * @returns {{[p: string]: *}|*}
   */
  deepUnwrap(data, options = {}) {
    const {
      isWrap = FALSE,
      unwrap = RAW,
    } = options;
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
const VueData = {
  /**
   * 深解包vue3响应式对象数据
   * @param data
   * @returns {{[p: string]: *}|*}
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

const _Date = Object.create(Date);
Object.assign(_Date, {
  create() {
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
});

const _Math = Object.create(Math);
// 增加部分命名以接近数学表达方式
Object.assign(_Math, {
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
});

const _Object = Object.create(Object);
Object.assign(_Object, {
  /**
   * 浅合并对象。写法同 Object.assign
   * 通过重定义方式合并，解决 Object.assign 合并两边同名属性混有 value写法 和 get/set写法 时报 TypeError: Cannot set property b of #<Object> which has only a getter 的问题
   * @param target 目标
   * @param sources 数据源，一个或多个对象
   * @returns {*}
   */
  assign(target, ...sources) {
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
   * @param target 目标，默认值 {} 防止递归时报 TypeError: Object.defineProperty called on non-object
   * @param sources 数据源，一个或多个对象
   */
  deepAssign(target = {}, ...sources) {
    for (const source of sources) {
      for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(source))) {
        if ('value' in desc) {
          // value写法：对象递归处理，其他直接定义
          if (Data.getExactType(desc.value) === Object) {
            Object.defineProperty(target, key, {
              ...desc,
              value: _Object.deepAssign(target[key], desc.value),
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
});

const _Proxy = Object.create(Proxy);
Object.assign(_Proxy, {
  /**
   * 绑定this。常用于解构函数时绑定this避免报错
   * @param target 目标对象
   * @param options 选项。扩展用
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
});

const _Reflect = Object.create(Reflect);
// 对 ownKeys 配套 ownValues 和 ownEntries
_Reflect.ownValues = function(target) {
  return Reflect.ownKeys(target).map(key => target[key]);
};
_Reflect.ownEntries = function(target) {
  return Reflect.ownKeys(target).map(key => [key, target[key]]);
};

const Style = {
  /**
   * 带单位字符串。对数字或数字格式的字符串自动拼单位，其他字符串原样返回
   * @param value 值
   * @param {} 选项
   *          unit：单位，value没带单位时自动拼接，可传 px/em/% 等
   * @returns {string|string}
   */
  getUnitString(value = '', { unit = 'px' } = {}) {
    if (value === '') { return ''; }
    // 注意：这里使用 == 判断，不使用 ===
    return Number(value) == value ? `${value}${unit}` : String(value);
  },
};

export { Data, FALSE, JS_ENV, NOOP, RAW, Style, TRUE, VueData, _Date, _Math, _Object, _Proxy, _Reflect, _String };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvX1N0cmluZy5qcyIsIi4uLy4uL3NyYy9iYXNlL2NvbnN0YW50cy5qcyIsIi4uLy4uL3NyYy9iYXNlL0RhdGEuanMiLCIuLi8uLi9zcmMvYmFzZS9fRGF0ZS5qcyIsIi4uLy4uL3NyYy9iYXNlL19NYXRoLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX09iamVjdC5qcyIsIi4uLy4uL3NyYy9iYXNlL19Qcm94eS5qcyIsIi4uLy4uL3NyYy9iYXNlL19SZWZsZWN0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvU3R5bGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IF9TdHJpbmcgPSBPYmplY3QuY3JlYXRlKFN0cmluZyk7XG5PYmplY3QuYXNzaWduKF9TdHJpbmcsIHtcbiAgLyoqXG4gICAgICog6aaW5a2X5q+N5aSn5YaZXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICB0b0ZpcnN0VXBwZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9VcHBlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfSxcbiAgLyoqXG4gICAgICog6aaW5a2X5q+N5bCP5YaZXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICB0b0ZpcnN0TG93ZXJDYXNlKG5hbWUgPSAnJykge1xuICAgIHJldHVybiBgJHsobmFtZVswXSA/PyAnJykudG9Mb3dlckNhc2UoKX0ke25hbWUuc2xpY2UoMSl9YDtcbiAgfSxcbiAgLyoqXG4gICAgICog6L2s6am85bOw5ZG95ZCN44CC5bi455So5LqO6L+e5o6l56ym5ZG95ZCN6L2s6am85bOw5ZG95ZCN77yM5aaCIHh4LW5hbWUgLT4geHhOYW1lXG4gICAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAgICogQHBhcmFtIHt9IOmAiemhuVxuICAgICAqICAgICAgICAgIHNlcGFyYXRvciDov57mjqXnrKbjgILnlKjkuo7nlJ/miJDmraPliJkg6buY6K6k5Li65Lit5YiS57q/IC0g5a+55bqUcmVnZXhw5b6X5YiwIC8tKFxcdykvZ1xuICAgICAqICAgICAgICAgIGZpcnN0IOmmluWtl+avjeWkhOeQhuaWueW8j+OAgnRydWUg5oiWICd1cHBlcmNhc2Un77ya6L2s5o2i5oiQ5aSn5YaZXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSDmiJYgJ2xvd2VyY2FzZSfvvJrovazmjaLmiJDlsI/lhplcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyYXcnIOaIliDlhbbku5bml6DmlYjlgLzvvJrpu5jorqTljp/moLfov5Tlm57vvIzkuI3ov5vooYzlpITnkIZcbiAgICAgKiBAcmV0dXJucyB7TWFnaWNTdHJpbmd8c3RyaW5nfHN0cmluZ31cbiAgICAgKi9cbiAgdG9DYW1lbENhc2UobmFtZSwgeyBzZXBhcmF0b3IgPSAnLScsIGZpcnN0ID0gJ3JhdycgfSA9IHt9KSB7XG4gICAgLy8g55Sf5oiQ5q2j5YiZXG4gICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cChgJHtzZXBhcmF0b3J9KFxcXFx3KWAsICdnJyk7XG4gICAgLy8g5ou85o6l5oiQ6am85bOwXG4gICAgY29uc3QgY2FtZWxOYW1lID0gbmFtZS5yZXBsYWNlQWxsKHJlZ2V4cCwgKHN1YnN0ciwgJDEpID0+IHtcbiAgICAgIHJldHVybiAkMS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xuICAgICAgLy8g6aaW5a2X5q+N5aSn5bCP5YaZ5qC55o2u5Lyg5Y+C5Yik5patXG4gICAgaWYgKFt0cnVlLCAndXBwZXJjYXNlJ10uaW5jbHVkZXMoZmlyc3QpKSB7XG4gICAgICByZXR1cm4gX1N0cmluZy50b0ZpcnN0VXBwZXJDYXNlKGNhbWVsTmFtZSk7XG4gICAgfVxuICAgIGlmIChbZmFsc2UsICdsb3dlcmNhc2UnXS5pbmNsdWRlcyhmaXJzdCkpIHtcbiAgICAgIHJldHVybiBfU3RyaW5nLnRvRmlyc3RMb3dlckNhc2UoY2FtZWxOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbWVsTmFtZTtcbiAgfSxcbiAgLyoqXG4gICAgICog6L2s6L+e5o6l56ym5ZG95ZCN44CC5bi455So5LqO6am85bOw5ZG95ZCN6L2s6L+e5o6l56ym5ZG95ZCN77yM5aaCIHh4TmFtZSAtPiB4eC1uYW1lXG4gICAgICogQHBhcmFtIG5hbWUg5ZCN56ewXG4gICAgICogQHBhcmFtIHt9IOmAiemhuVxuICAgICAqICAgICAgICAgIHNlcGFyYXRvciDov57mjqXnrKZcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICB0b0xpbmVDYXNlKG5hbWUgPSAnJywgeyBzZXBhcmF0b3IgPSAnLScgfSA9IHt9KSB7XG4gICAgcmV0dXJuIG5hbWVcbiAgICAvLyDmjInov57mjqXnrKbmi7zmjqVcbiAgICAgIC5yZXBsYWNlQWxsKC8oW2Etel0pKFtBLVpdKS9nLCBgJDEke3NlcGFyYXRvcn0kMmApXG4gICAgLy8g6L2s5bCP5YaZXG4gICAgICAudG9Mb3dlckNhc2UoKTtcbiAgfSxcbn0pO1xuIiwiLy8g5bi46YeP44CC5bi455So5LqO6buY6K6k5Lyg5Y+C562J5Zy65pmvXG4vLyBqc+i/kOihjOeOr+Wig1xuZXhwb3J0IGNvbnN0IEpTX0VOViA9IChmdW5jdGlvbiBnZXRKc0VudigpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbFRoaXMgPT09IHdpbmRvdykge1xuICAgIHJldHVybiAnYnJvd3Nlcic7XG4gIH1cbiAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbFRoaXMgPT09IGdsb2JhbCkge1xuICAgIHJldHVybiAnbm9kZSc7XG4gIH1cbiAgcmV0dXJuICcnO1xufSkoKTtcbi8vIOepuuWHveaVsFxuZXhwb3J0IGZ1bmN0aW9uIE5PT1AoKSB7fVxuLy8g6L+U5ZueIGZhbHNlXG5leHBvcnQgZnVuY3Rpb24gRkFMU0UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cbi8vIOi/lOWbniB0cnVlXG5leHBvcnQgZnVuY3Rpb24gVFJVRSgpIHtcbiAgcmV0dXJuIHRydWU7XG59XG4vLyDljp/moLfov5Tlm55cbmV4cG9ydCBmdW5jdGlvbiBSQVcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuIiwiaW1wb3J0IHsgX1N0cmluZyB9IGZyb20gJy4vX1N0cmluZyc7XG5pbXBvcnQgeyBGQUxTRSwgUkFXIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuZXhwb3J0IGNvbnN0IERhdGEgPSB7XG4gIC8vIOeugOWNleexu+Wei1xuICBTSU1QTEVfVFlQRVM6IFtudWxsLCB1bmRlZmluZWQsIE51bWJlciwgU3RyaW5nLCBCb29sZWFuLCBCaWdJbnQsIFN5bWJvbF0sXG4gIC8qKlxuICAgKiDojrflj5blgLznmoTlhbfkvZPnsbvlnotcbiAgICogQHBhcmFtIHZhbHVlIOWAvFxuICAgKiBAcmV0dXJucyB7T2JqZWN0Q29uc3RydWN0b3J8RnVuY3Rpb258Kn0g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWw44CCbnVsbOOAgXVuZGVmaW5lZCDljp/moLfov5Tlm55cbiAgICovXG4gIGdldEV4YWN0VHlwZSh2YWx1ZSkge1xuICAgIC8vIG51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gICAgaWYgKFtudWxsLCB1bmRlZmluZWRdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICAgIC8vIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoeaXtiBfX3Byb3RvX18g5Li6IG51bGxcbiAgICBjb25zdCBpc09iamVjdEJ5Q3JlYXRlTnVsbCA9IF9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgICBpZiAoaXNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgICAgcmV0dXJuIE9iamVjdDtcbiAgICB9XG4gICAgLy8g5a+55bqU57un5om/55qE5a+56LGhIF9fcHJvdG9fXyDmsqHmnIkgY29uc3RydWN0b3Ig5bGe5oCnXG4gICAgY29uc3QgaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsID0gISgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXyk7XG4gICAgaWYgKGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgICAgcmV0dXJuIE9iamVjdDtcbiAgICB9XG4gICAgLy8g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWwXG4gICAgcmV0dXJuIF9fcHJvdG9fXy5jb25zdHJ1Y3RvcjtcbiAgfSxcbiAgLyoqXG4gICAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei+WIl+ihqFxuICAgKiBAcGFyYW0gdmFsdWUg5YC8XG4gICAqIEByZXR1cm5zIHsqW119IOe7n+S4gOi/lOWbnuaVsOe7hOOAgm51bGzjgIF1bmRlZmluZWQg5a+55bqU5Li6IFtudWxsXSxbdW5kZWZpbmVkXVxuICAgKi9cbiAgZ2V0RXhhY3RUeXBlcyh2YWx1ZSkge1xuICAgIC8vIG51bGzjgIF1bmRlZmluZWQg5Yik5pat5aSE55CGXG4gICAgaWYgKFtudWxsLCB1bmRlZmluZWRdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIFt2YWx1ZV07XG4gICAgfVxuICAgIC8vIOaJq+WOn+Wei+mTvuW+l+WIsOWvueW6lOaehOmAoOWHveaVsFxuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBsZXQgbG9vcCA9IDA7XG4gICAgbGV0IGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSBmYWxzZTtcbiAgICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgLy8gY29uc29sZS53YXJuKCd3aGlsZScsIGxvb3AsIF9fcHJvdG9fXyk7XG4gICAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICAgIC8vIOS4gOi/m+adpSBfX3Byb3RvX18g5bCx5pivIG51bGwg6K+05piOIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoVxuICAgICAgICBpZiAobG9vcCA8PSAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pIHtcbiAgICAgICAgcmVzdWx0LnB1c2goX19wcm90b19fLmNvbnN0cnVjdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKE9iamVjdCk7XG4gICAgICAgIGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSB0cnVlO1xuICAgICAgfVxuICAgICAgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKF9fcHJvdG9fXyk7XG4gICAgICBsb29wKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIC8vIOa3seaLt+i0neaVsOaNrlxuICBkZWVwQ2xvbmUoc291cmNlLCBvcHRpb25zID0ge30pIHtcbiAgICAvLyDmlbDnu4RcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKERhdGEuZGVlcENsb25lKHZhbHVlLCBvcHRpb25zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyBTZXRcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICBsZXQgcmVzdWx0ID0gbmV3IFNldCgpO1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICAgIHJlc3VsdC5hZGQoRGF0YS5kZWVwQ2xvbmUodmFsdWUsIG9wdGlvbnMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIE1hcFxuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2Ygc291cmNlLmVudHJpZXMoKSkge1xuICAgICAgICByZXN1bHQuc2V0KGtleSwgRGF0YS5kZWVwQ2xvbmUodmFsdWUsIG9wdGlvbnMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIOWvueixoVxuICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShzb3VyY2UpID09PSBPYmplY3QpIHtcbiAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgIC8vIHZhbHVl5pa55byP77ya6YCS5b2S5aSE55CGXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgdmFsdWU6IERhdGEuZGVlcENsb25lKGRlc2MudmFsdWUpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGdldC9zZXQg5pa55byP77ya55u05o6l5a6a5LmJXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8g5YW25LuW77ya5Y6f5qC36L+U5ZueXG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfSxcbiAgLyoqXG4gICAqIOa3seino+WMheaVsOaNrlxuICAgKiBAcGFyYW0gZGF0YSDlgLxcbiAgICogQHBhcmFtIG9wdGlvbnMg6YCJ6aG5XG4gICAqICAgICAgICAgIGlzV3JhcCDljIXoo4XmlbDmja7liKTmlq3lh73mlbDvvIzlpoJ2dWUz55qEaXNSZWblh73mlbBcbiAgICogICAgICAgICAgdW53cmFwIOino+WMheaWueW8j+WHveaVsO+8jOWmgnZ1ZTPnmoR1bnJlZuWHveaVsFxuICAgKiBAcmV0dXJucyB7e1twOiBzdHJpbmddOiAqfXwqfVxuICAgKi9cbiAgZGVlcFVud3JhcChkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBpc1dyYXAgPSBGQUxTRSxcbiAgICAgIHVud3JhcCA9IFJBVyxcbiAgICB9ID0gb3B0aW9ucztcbiAgICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gICAgaWYgKGlzV3JhcChkYXRhKSkge1xuICAgICAgcmV0dXJuIERhdGEuZGVlcFVud3JhcCh1bndyYXAoZGF0YSksIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gZGF0YS5tYXAodmFsID0+IERhdGEuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpKTtcbiAgICB9XG4gICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKGRhdGEpID09PSBPYmplY3QpIHtcbiAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICAgIHJldHVybiBba2V5LCBEYXRhLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgICB9KSk7XG4gICAgfVxuICAgIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICAgIHJldHVybiBkYXRhO1xuICB9LFxufTtcbmV4cG9ydCBjb25zdCBWdWVEYXRhID0ge1xuICAvKipcbiAgICog5rex6Kej5YyFdnVlM+WTjeW6lOW8j+WvueixoeaVsOaNrlxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcmV0dXJucyB7e1twOiBzdHJpbmddOiAqfXwqfVxuICAgKi9cbiAgZGVlcFVud3JhcFZ1ZTMoZGF0YSkge1xuICAgIHJldHVybiBEYXRhLmRlZXBVbndyYXAoZGF0YSwge1xuICAgICAgaXNXcmFwOiBkYXRhID0+IGRhdGE/Ll9fdl9pc1JlZixcbiAgICAgIHVud3JhcDogZGF0YSA9PiBkYXRhLnZhbHVlLFxuICAgIH0pO1xuICB9LFxuICAvKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcERlZmluaXRpb25zIHByb3BzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgZ2V0UHJvcHNGcm9tQXR0cnMoYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAgIC8vIHByb3BzIOWumuS5iee7n+S4gOaIkOWvueixoeagvOW8j++8jHR5cGUg57uf5LiA5oiQ5pWw57uE5qC85byP5Lul5L6/5ZCO57ut5Yik5patXG4gICAgaWYgKHByb3BEZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCB7IHR5cGU6IFtdIH1dKSk7XG4gICAgfSBlbHNlIGlmIChEYXRhLmdldEV4YWN0VHlwZShwcm9wRGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpLm1hcCgoW25hbWUsIGRlZmluaXRpb25dKSA9PiB7XG4gICAgICAgIGRlZmluaXRpb24gPSBEYXRhLmdldEV4YWN0VHlwZShkZWZpbml0aW9uKSA9PT0gT2JqZWN0XG4gICAgICAgICAgPyB7IC4uLmRlZmluaXRpb24sIHR5cGU6IFtkZWZpbml0aW9uLnR5cGVdLmZsYXQoKSB9XG4gICAgICAgICAgOiB7IHR5cGU6IFtkZWZpbml0aW9uXS5mbGF0KCkgfTtcbiAgICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBkZWZpbml0aW9uXTtcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcERlZmluaXRpb25zID0ge307XG4gICAgfVxuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBkZWZpbml0aW9uXSBvZiBPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpKSB7XG4gICAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgICAvLyBwcm9wTmFtZSDmiJYgcHJvcC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgLy8g5Y+q5YyF5ZCrQm9vbGVhbuexu+Wei+eahCcn6L2s5o2i5Li6dHJ1Ze+8jOWFtuS7luWOn+agt+i1i+WAvFxuICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gZGVmaW5pdGlvbi50eXBlLmxlbmd0aCA9PT0gMSAmJiBkZWZpbml0aW9uLnR5cGUuaW5jbHVkZXMoQm9vbGVhbikgJiYgYXR0clZhbHVlID09PSAnJyA/IHRydWUgOiBhdHRyVmFsdWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHByb3AtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgaWYgKGVuZCkgeyByZXR1cm47IH1cbiAgICAgICAgc2V0UmVzdWx0KHsgbmFtZTogX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpLCBkZWZpbml0aW9uLCBlbmQ6IHRydWUgfSk7XG4gICAgICB9KSh7XG4gICAgICAgIG5hbWUsIGRlZmluaXRpb24sXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgZW1pdHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIGVtaXREZWZpbml0aW9ucyBlbWl0cyDlrprkuYnvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIGdldEVtaXRzRnJvbUF0dHJzKGF0dHJzLCBlbWl0RGVmaW5pdGlvbnMpIHtcbiAgICAvLyBlbWl0cyDlrprkuYnnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUoZW1pdERlZmluaXRpb25zKSA9PT0gT2JqZWN0KSB7XG4gICAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoIShlbWl0RGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIGVtaXREZWZpbml0aW9ucyA9IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDlpITnkIbmiJAgb25FbWl0TmFtZeOAgW9uVXBkYXRlOmVtaXROYW1lKHYtbW9kZWzns7vliJcpIOagvOW8j1xuICAgIGNvbnN0IGVtaXROYW1lcyA9IGVtaXREZWZpbml0aW9ucy5tYXAobmFtZSA9PiBfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdvblVwZGF0ZTonKSkge1xuICAgICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICAgICAgaWYgKGVuZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UobmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpKX1gLCBlbmQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9KSh7IG5hbWUgfSk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIC8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+W5Ymp5L2Z5bGe5oCn44CC5bi455So5LqO57uE5Lu2aW5oZXJpdEF0dHJz6K6+572uZmFsc2Xml7bkvb/nlKjkvZzkuLrmlrDnmoRhdHRyc1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSB7fSDphY3nva7poblcbiAgICogICAgICAgICAgQHBhcmFtIHByb3BzIHByb3BzIOWumuS5iSDmiJYgdnVlIHByb3Bz77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICAgKiAgICAgICAgICBAcGFyYW0gZW1pdHMgZW1pdHMg5a6a5LmJIOaIliB2dWUgZW1pdHPvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqICAgICAgICAgIEBwYXJhbSBsaXN0IOmineWklueahOaZrumAmuWxnuaAp1xuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBnZXRSZXN0RnJvbUF0dHJzKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAgIC8vIOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIHByb3BzID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChwcm9wcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShwcm9wcykgPT09IE9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiBhcnIubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgICB9KSgpO1xuICAgIGVtaXRzID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChlbWl0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIGVtaXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShlbWl0cykgPT09IE9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiBhcnIubWFwKChuYW1lKSA9PiB7XG4gICAgICAgIC8vIHVwZGF0ZTplbWl0TmFtZSDmiJYgdXBkYXRlOmVtaXQtbmFtZSDmoLzlvI9cbiAgICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgICAgY29uc3QgcGFydE5hbWUgPSBuYW1lLnNsaWNlKG5hbWUuaW5kZXhPZignOicpICsgMSk7XG4gICAgICAgICAgcmV0dXJuIFtgb25VcGRhdGU6JHtfU3RyaW5nLnRvQ2FtZWxDYXNlKHBhcnROYW1lKX1gLCBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UocGFydE5hbWUpfWBdO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9uRW1pdE5hbWXmoLzlvI/vvIzkuK3liJLnur/moLzlvI/lt7Looqt2dWXovazmjaLkuI3nlKjph43lpI3lpITnkIZcbiAgICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCldO1xuICAgICAgfSkuZmxhdCgpO1xuICAgIH0pKCk7XG4gICAgbGlzdCA9ICgoKSA9PiB7XG4gICAgICBjb25zdCBhcnIgPSBEYXRhLmdldEV4YWN0VHlwZShsaXN0KSA9PT0gU3RyaW5nXG4gICAgICAgID8gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgIDogbGlzdCBpbnN0YW5jZW9mIEFycmF5ID8gbGlzdCA6IFtdO1xuICAgICAgcmV0dXJuIGFyci5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgICB9KSgpO1xuICAgIGNvbnN0IGxpc3RBbGwgPSBBcnJheS5mcm9tKG5ldyBTZXQoW3Byb3BzLCBlbWl0cywgbGlzdF0uZmxhdCgpKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ2xpc3RBbGwnLCBsaXN0QWxsKTtcbiAgICAvLyDorr7nva7lgLxcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBbbmFtZSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoYXR0cnMpKSkge1xuICAgICAgaWYgKCFsaXN0QWxsLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIG5hbWUsIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufTtcbiIsImltcG9ydCB7IERhdGEgfSBmcm9tICcuL0RhdGEnO1xuXG5leHBvcnQgY29uc3QgX0RhdGUgPSBPYmplY3QuY3JlYXRlKERhdGUpO1xuT2JqZWN0LmFzc2lnbihfRGF0ZSwge1xuICBjcmVhdGUoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIHNhZmFyaSDmtY/op4jlmajlrZfnrKbkuLLmoLzlvI/lhbzlrrlcbiAgICAgIGNvbnN0IHZhbHVlID0gYXJndW1lbnRzWzBdO1xuICAgICAgY29uc3QgdmFsdWVSZXN1bHQgPSBEYXRhLmdldEV4YWN0VHlwZSh2YWx1ZSkgPT09IFN0cmluZyA/IHZhbHVlLnJlcGxhY2VBbGwoJy0nLCAnLycpIDogdmFsdWU7XG4gICAgICByZXR1cm4gbmV3IERhdGUodmFsdWVSZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDkvKDlj4LooYzkuLrlhYjlkoxEYXRl5LiA6Ie077yM5ZCO57ut5YaN5pS26ZuG6ZyA5rGC5Yqg5by65a6a5Yi2KOazqOaEj+aXoOWPguWSjOaYvuW8j3VuZGVmaW5lZOeahOWMuuWIqylcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAwID8gbmV3IERhdGUoKSA6IG5ldyBEYXRlKC4uLmFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxufSk7XG4iLCJleHBvcnQgY29uc3QgX01hdGggPSBPYmplY3QuY3JlYXRlKE1hdGgpO1xuLy8g5aKe5Yqg6YOo5YiG5ZG95ZCN5Lul5o6l6L+R5pWw5a2m6KGo6L6+5pa55byPXG5PYmplY3QuYXNzaWduKF9NYXRoLCB7XG4gIGFyY3NpbjogTWF0aC5hc2luLFxuICBhcmNjb3M6IE1hdGguYWNvcyxcbiAgYXJjdGFuOiBNYXRoLmF0YW4sXG4gIGFyc2luaDogTWF0aC5hc2luaCxcbiAgYXJjb3NoOiBNYXRoLmFjb3NoLFxuICBhcnRhbmg6IE1hdGguYXRhbmgsXG4gIGxvZ2U6IE1hdGgubG9nLFxuICBsbjogTWF0aC5sb2csXG4gIGxnOiBNYXRoLmxvZzEwLFxuICBsb2coYSwgeCkge1xuICAgIHJldHVybiBNYXRoLmxvZyh4KSAvIE1hdGgubG9nKGEpO1xuICB9LFxufSk7XG4iLCJpbXBvcnQgeyBEYXRhIH0gZnJvbSAnLi9EYXRhJztcblxuZXhwb3J0IGNvbnN0IF9PYmplY3QgPSBPYmplY3QuY3JlYXRlKE9iamVjdCk7XG5PYmplY3QuYXNzaWduKF9PYmplY3QsIHtcbiAgLyoqXG4gICAqIOa1heWQiOW5tuWvueixoeOAguWGmeazleWQjCBPYmplY3QuYXNzaWduXG4gICAqIOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICAgKiBAcGFyYW0gdGFyZ2V0IOebruagh1xuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDvvIzkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBhc3NpZ24odGFyZ2V0LCAuLi5zb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgICAgLy8g5LiN5L2/55SoIHRhcmdldFtrZXldPXZhbHVlIOWGmeazle+8jOebtOaOpeS9v+eUqGRlc2Pph43lrprkuYlcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSxcbiAgLyoqXG4gICAqIOa3seWQiOW5tuWvueixoeOAguWQjCBhc3NpZ24g5LiA5qC35Lmf5Lya5a+55bGe5oCn6L+b6KGM6YeN5a6a5LmJXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH77yM6buY6K6k5YC8IHt9IOmYsuatoumAkuW9kuaXtuaKpSBUeXBlRXJyb3I6IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdFxuICAgKiBAcGFyYW0gc291cmNlcyDmlbDmja7mupDvvIzkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICovXG4gIGRlZXBBc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAvLyB2YWx1ZeWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShkZXNjLnZhbHVlKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICAgICAgdmFsdWU6IF9PYmplY3QuZGVlcEFzc2lnbih0YXJnZXRba2V5XSwgZGVzYy52YWx1ZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0L3NldOWGmeazle+8muebtOaOpeWumuS5iVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSxcbn0pO1xuIiwiZXhwb3J0IGNvbnN0IF9Qcm94eSA9IE9iamVjdC5jcmVhdGUoUHJveHkpO1xuT2JqZWN0LmFzc2lnbihfUHJveHksIHtcbiAgLyoqXG4gICAqIOe7keWumnRoaXPjgILluLjnlKjkuo7op6PmnoTlh73mlbDml7bnu5Hlrpp0aGlz6YG/5YWN5oql6ZSZXG4gICAqIEBwYXJhbSB0YXJnZXQg55uu5qCH5a+56LGhXG4gICAqIEBwYXJhbSBvcHRpb25zIOmAiemhueOAguaJqeWxleeUqFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGJpbmRUaGlzKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIHtcbiAgICAgIGdldCh0YXJnZXQsIHAsIHJlY2VpdmVyKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLy8g5Ye95pWw57G75Z6L57uR5a6adGhpc1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgIHJldHVybiB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5YW25LuW5bGe5oCn5Y6f5qC36L+U5ZueXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0sXG59KTtcbiIsImV4cG9ydCBjb25zdCBfUmVmbGVjdCA9IE9iamVjdC5jcmVhdGUoUmVmbGVjdCk7XG4vLyDlr7kgb3duS2V5cyDphY3lpZcgb3duVmFsdWVzIOWSjCBvd25FbnRyaWVzXG5fUmVmbGVjdC5vd25WYWx1ZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xufTtcbl9SZWZsZWN0Lm93bkVudHJpZXMgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gW2tleSwgdGFyZ2V0W2tleV1dKTtcbn07XG4iLCJleHBvcnQgY29uc3QgU3R5bGUgPSB7XG4gIC8qKlxuICAgKiDluKbljZXkvY3lrZfnrKbkuLLjgILlr7nmlbDlrZfmiJbmlbDlrZfmoLzlvI/nmoTlrZfnrKbkuLLoh6rliqjmi7zljZXkvY3vvIzlhbbku5blrZfnrKbkuLLljp/moLfov5Tlm55cbiAgICogQHBhcmFtIHZhbHVlIOWAvFxuICAgKiBAcGFyYW0ge30g6YCJ6aG5XG4gICAqICAgICAgICAgIHVuaXTvvJrljZXkvY3vvIx2YWx1ZeayoeW4puWNleS9jeaXtuiHquWKqOaLvOaOpe+8jOWPr+S8oCBweC9lbS8lIOetiVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfHN0cmluZ31cbiAgICovXG4gIGdldFVuaXRTdHJpbmcodmFsdWUgPSAnJywgeyB1bml0ID0gJ3B4JyB9ID0ge30pIHtcbiAgICBpZiAodmFsdWUgPT09ICcnKSB7IHJldHVybiAnJzsgfVxuICAgIC8vIOazqOaEj++8mui/memHjOS9v+eUqCA9PSDliKTmlq3vvIzkuI3kvb/nlKggPT09XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPT0gdmFsdWUgPyBgJHt2YWx1ZX0ke3VuaXR9YCA6IFN0cmluZyh2YWx1ZSk7XG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBWSxNQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUM3QyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQzlCLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLGdCQUFnQixDQUFDLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDOUIsSUFBSSxPQUFPLENBQUMsRUFB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
