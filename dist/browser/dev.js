/*!
 * hp-shared v0.1.0
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"esm","sourcemap":"inline"}
 */
  
// 常量。常用于默认传参等场景
// 返回 false
function FALSE() {
  return false;
}
// 原样返回
function RAW(value) {
  return value;
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

export { eslint, vite };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9jb25zdGFudHMuanMiLCIuLi8uLi9zcmMvYmFzZS9EYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX1JlZmxlY3QuanMiLCIuLi8uLi9zcmMvYmFzZS9fU2V0LmpzIiwiLi4vLi4vc3JjL2Jhc2UvX09iamVjdC5qcyIsIi4uLy4uL3NyYy9kZXYvZXNsaW50LmpzIiwiLi4vLi4vc3JjL2Rldi92aXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIOW4uOmHj+OAguW4uOeUqOS6jum7mOiupOS8oOWPguetieWcuuaZr1xuLy8ganPov5DooYznjq/looNcbmV4cG9ydCBjb25zdCBKU19FTlYgPSAoZnVuY3Rpb24gZ2V0SnNFbnYoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWxUaGlzID09PSB3aW5kb3cpIHtcbiAgICByZXR1cm4gJ2Jyb3dzZXInO1xuICB9XG4gIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWxUaGlzID09PSBnbG9iYWwpIHtcbiAgICByZXR1cm4gJ25vZGUnO1xuICB9XG4gIHJldHVybiAnJztcbn0pKCk7XG4vLyDnqbrlh73mlbBcbmV4cG9ydCBmdW5jdGlvbiBOT09QKCkge31cbi8vIOi/lOWbniBmYWxzZVxuZXhwb3J0IGZ1bmN0aW9uIEZBTFNFKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG4vLyDov5Tlm54gdHJ1ZVxuZXhwb3J0IGZ1bmN0aW9uIFRSVUUoKSB7XG4gIHJldHVybiB0cnVlO1xufVxuLy8g5Y6f5qC36L+U5ZueXG5leHBvcnQgZnVuY3Rpb24gUkFXKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cbi8vIGNhdGNoIOWGheeahOmUmeivr+WOn+agt+aKm+WHuuWOu1xuZXhwb3J0IGZ1bmN0aW9uIFRIUk9XKGUpIHtcbiAgdGhyb3cgZTtcbn1cbiIsImltcG9ydCB7IF9TdHJpbmcgfSBmcm9tICcuL19TdHJpbmcnO1xuaW1wb3J0IHsgRkFMU0UsIFJBVyB9IGZyb20gJy4vY29uc3RhbnRzJztcbi8vIOWkhOeQhuWkmuagvOW8j+aVsOaNrueUqFxuZXhwb3J0IGNvbnN0IERhdGEgPSB7XG4gIC8vIOeugOWNleexu+Wei1xuICBTSU1QTEVfVFlQRVM6IFtudWxsLCB1bmRlZmluZWQsIE51bWJlciwgU3RyaW5nLCBCb29sZWFuLCBCaWdJbnQsIFN5bWJvbF0sXG4gIC8qKlxuICAgKiDojrflj5blgLznmoTlhbfkvZPnsbvlnotcbiAgICogQHBhcmFtIHZhbHVlIHsqfSDlgLxcbiAgICogQHJldHVybnMge09iamVjdENvbnN0cnVjdG9yfCp8RnVuY3Rpb259IOi/lOWbnuWvueW6lOaehOmAoOWHveaVsOOAgm51bGzjgIF1bmRlZmluZWQg5Y6f5qC36L+U5ZueXG4gICAqL1xuICBnZXRFeGFjdFR5cGUodmFsdWUpIHtcbiAgICAvLyBudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICAgIGlmIChbbnVsbCwgdW5kZWZpbmVkXS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgICAvLyB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaHml7YgX19wcm90b19fIOS4uiBudWxsXG4gICAgY29uc3QgaXNPYmplY3RCeUNyZWF0ZU51bGwgPSBfX3Byb3RvX18gPT09IG51bGw7XG4gICAgaWYgKGlzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ2lzT2JqZWN0QnlDcmVhdGVOdWxsJywgX19wcm90b19fKTtcbiAgICAgIHJldHVybiBPYmplY3Q7XG4gICAgfVxuICAgIC8vIOWvueW6lOe7p+aJv+eahOWvueixoSBfX3Byb3RvX18g5rKh5pyJIGNvbnN0cnVjdG9yIOWxnuaAp1xuICAgIGNvbnN0IGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9ICEoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pO1xuICAgIGlmIChpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwpIHtcbiAgICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsJywgX19wcm90b19fKTtcbiAgICAgIHJldHVybiBPYmplY3Q7XG4gICAgfVxuICAgIC8vIOi/lOWbnuWvueW6lOaehOmAoOWHveaVsFxuICAgIHJldHVybiBfX3Byb3RvX18uY29uc3RydWN0b3I7XG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5blgLznmoTlhbfkvZPnsbvlnovliJfooahcbiAgICogQHBhcmFtIHZhbHVlIHsqfSDlgLxcbiAgICogQHJldHVybnMgeypbXX0g57uf5LiA6L+U5Zue5pWw57uE44CCbnVsbOOAgXVuZGVmaW5lZCDlr7nlupTkuLogW251bGxdLFt1bmRlZmluZWRdXG4gICAqL1xuICBnZXRFeGFjdFR5cGVzKHZhbHVlKSB7XG4gICAgLy8gbnVsbOOAgXVuZGVmaW5lZCDliKTmlq3lpITnkIZcbiAgICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICByZXR1cm4gW3ZhbHVlXTtcbiAgICB9XG4gICAgLy8g5omr5Y6f5Z6L6ZO+5b6X5Yiw5a+55bqU5p6E6YCg5Ye95pWwXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBsb29wID0gMDtcbiAgICBsZXQgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IGZhbHNlO1xuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAvLyBjb25zb2xlLndhcm4oJ3doaWxlJywgbG9vcCwgX19wcm90b19fKTtcbiAgICAgIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICAgICAgLy8g5LiA6L+b5p2lIF9fcHJvdG9fXyDlsLHmmK8gbnVsbCDor7TmmI4gdmFsdWUg5Li6IE9iamVjdC5wcm90b3R5cGUg5oiWIE9iamVjdC5jcmVhdGUobnVsbCkg5pa55byP5aOw5piO55qE5a+56LGhXG4gICAgICAgIGlmIChsb29wIDw9IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChPYmplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXykge1xuICAgICAgICByZXN1bHQucHVzaChfX3Byb3RvX18uY29uc3RydWN0b3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IHRydWU7XG4gICAgICB9XG4gICAgICBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX19wcm90b19fKTtcbiAgICAgIGxvb3ArKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLyoqXG4gICAqIOa3seaLt+i0neaVsOaNrlxuICAgKiBAcGFyYW0gc291cmNlIHsqfVxuICAgKiBAcmV0dXJucyB7TWFwPGFueSwgYW55PnxTZXQ8YW55Pnx7fXwqfCpbXX1cbiAgICovXG4gIGRlZXBDbG9uZShzb3VyY2UpIHtcbiAgICAvLyDmlbDnu4RcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZGVlcENsb25lKHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyBTZXRcbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICBsZXQgcmVzdWx0ID0gbmV3IFNldCgpO1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2Ygc291cmNlLnZhbHVlcygpKSB7XG4gICAgICAgIHJlc3VsdC5hZGQodGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIE1hcFxuICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgIGxldCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2Ygc291cmNlLmVudHJpZXMoKSkge1xuICAgICAgICByZXN1bHQuc2V0KGtleSwgdGhpcy5kZWVwQ2xvbmUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIOWvueixoVxuICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShzb3VyY2UpID09PSBPYmplY3QpIHtcbiAgICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgIC8vIHZhbHVl5pa55byP77ya6YCS5b2S5aSE55CGXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcENsb25lKGRlc2MudmFsdWUpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGdldC9zZXQg5pa55byP77ya55u05o6l5a6a5LmJXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8g5YW25LuW77ya5Y6f5qC36L+U5ZueXG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfSxcbiAgLyoqXG4gICAqIOa3seino+WMheaVsOaNrlxuICAgKiBAcGFyYW0gZGF0YSB7Kn0g5YC8XG4gICAqIEBwYXJhbSBpc1dyYXAge2Z1bmN0aW9ufSDljIXoo4XmlbDmja7liKTmlq3lh73mlbDvvIzlpoJ2dWUz55qEaXNSZWblh73mlbBcbiAgICogQHBhcmFtIHVud3JhcCB7ZnVuY3Rpb259IOino+WMheaWueW8j+WHveaVsO+8jOWmgnZ1ZTPnmoR1bnJlZuWHveaVsFxuICAgKiBAcmV0dXJucyB7KCp8e1twOiBzdHJpbmddOiBhbnl9KVtdfCp8e1twOiBzdHJpbmddOiBhbnl9fHtbcDogc3RyaW5nXTogKnx7W3A6IHN0cmluZ106IGFueX19fVxuICAgKi9cbiAgZGVlcFVud3JhcChkYXRhLCB7IGlzV3JhcCA9IEZBTFNFLCB1bndyYXAgPSBSQVcgfSA9IHt9KSB7XG4gICAgLy8g6YCJ6aG55pS26ZuGXG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgaXNXcmFwLCB1bndyYXAgfTtcbiAgICAvLyDljIXoo4XnsbvlnovvvIjlpoJ2dWUz5ZON5bqU5byP5a+56LGh77yJ5pWw5o2u6Kej5YyFXG4gICAgaWYgKGlzV3JhcChkYXRhKSkge1xuICAgICAgcmV0dXJuIERhdGEuZGVlcFVud3JhcCh1bndyYXAoZGF0YSksIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gZGF0YS5tYXAodmFsID0+IERhdGEuZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpKTtcbiAgICB9XG4gICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKGRhdGEpID09PSBPYmplY3QpIHtcbiAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoZGF0YSkubWFwKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICAgIHJldHVybiBba2V5LCBEYXRhLmRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgICB9KSk7XG4gICAgfVxuICAgIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICAgIHJldHVybiBkYXRhO1xuICB9LFxufTtcbi8vIOWkhOeQhnZ1ZeaVsOaNrueUqFxuZXhwb3J0IGNvbnN0IFZ1ZURhdGEgPSB7XG4gIC8qKlxuICAgKiDmt7Hop6PljIV2dWUz5ZON5bqU5byP5a+56LGh5pWw5o2uXG4gICAqIEBwYXJhbSBkYXRhIHsqfVxuICAgKiBAcmV0dXJucyB7KCp8e1twOiBzdHJpbmddOiAqfSlbXXwqfHtbcDogc3RyaW5nXTogKn18e1twOiBzdHJpbmddOiAqfHtbcDogc3RyaW5nXTogKn19fVxuICAgKi9cbiAgZGVlcFVud3JhcFZ1ZTMoZGF0YSkge1xuICAgIHJldHVybiBEYXRhLmRlZXBVbndyYXAoZGF0YSwge1xuICAgICAgaXNXcmFwOiBkYXRhID0+IGRhdGE/Ll9fdl9pc1JlZixcbiAgICAgIHVud3JhcDogZGF0YSA9PiBkYXRhLnZhbHVlLFxuICAgIH0pO1xuICB9LFxuICAvKipcbiAgICog5LuOIGF0dHJzIOS4reaPkOWPliBwcm9wcyDlrprkuYnnmoTlsZ7mgKdcbiAgICogQHBhcmFtIGF0dHJzIHZ1ZSBhdHRyc1xuICAgKiBAcGFyYW0gcHJvcERlZmluaXRpb25zIHByb3BzIOWumuS5ie+8jOWmgiBFbEJ1dHRvbi5wcm9wcyDnrYlcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgZ2V0UHJvcHNGcm9tQXR0cnMoYXR0cnMsIHByb3BEZWZpbml0aW9ucykge1xuICAgIC8vIHByb3BzIOWumuS5iee7n+S4gOaIkOWvueixoeagvOW8j++8jHR5cGUg57uf5LiA5oiQ5pWw57uE5qC85byP5Lul5L6/5ZCO57ut5Yik5patXG4gICAgaWYgKHByb3BEZWZpbml0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBwcm9wRGVmaW5pdGlvbnMgPSBPYmplY3QuZnJvbUVudHJpZXMocHJvcERlZmluaXRpb25zLm1hcChuYW1lID0+IFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCB7IHR5cGU6IFtdIH1dKSk7XG4gICAgfSBlbHNlIGlmIChEYXRhLmdldEV4YWN0VHlwZShwcm9wRGVmaW5pdGlvbnMpID09PSBPYmplY3QpIHtcbiAgICAgIHByb3BEZWZpbml0aW9ucyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpLm1hcCgoW25hbWUsIGRlZmluaXRpb25dKSA9PiB7XG4gICAgICAgIGRlZmluaXRpb24gPSBEYXRhLmdldEV4YWN0VHlwZShkZWZpbml0aW9uKSA9PT0gT2JqZWN0XG4gICAgICAgICAgPyB7IC4uLmRlZmluaXRpb24sIHR5cGU6IFtkZWZpbml0aW9uLnR5cGVdLmZsYXQoKSB9XG4gICAgICAgICAgOiB7IHR5cGU6IFtkZWZpbml0aW9uXS5mbGF0KCkgfTtcbiAgICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKG5hbWUpLCBkZWZpbml0aW9uXTtcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvcERlZmluaXRpb25zID0ge307XG4gICAgfVxuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBkZWZpbml0aW9uXSBvZiBPYmplY3QuZW50cmllcyhwcm9wRGVmaW5pdGlvbnMpKSB7XG4gICAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZGVmaW5pdGlvbiwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgICAvLyBwcm9wTmFtZSDmiJYgcHJvcC1uYW1lIOagvOW8j+mAkuW9kui/m+adpVxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgLy8g5Y+q5YyF5ZCrQm9vbGVhbuexu+Wei+eahCcn6L2s5o2i5Li6dHJ1Ze+8jOWFtuS7luWOn+agt+i1i+WAvFxuICAgICAgICAgIHJlc3VsdFtjYW1lbE5hbWVdID0gZGVmaW5pdGlvbi50eXBlLmxlbmd0aCA9PT0gMSAmJiBkZWZpbml0aW9uLnR5cGUuaW5jbHVkZXMoQm9vbGVhbikgJiYgYXR0clZhbHVlID09PSAnJyA/IHRydWUgOiBhdHRyVmFsdWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHByb3AtbmFtZSDmoLzlvI/ov5vpgJLlvZJcbiAgICAgICAgaWYgKGVuZCkgeyByZXR1cm47IH1cbiAgICAgICAgc2V0UmVzdWx0KHsgbmFtZTogX1N0cmluZy50b0xpbmVDYXNlKG5hbWUpLCBkZWZpbml0aW9uLCBlbmQ6IHRydWUgfSk7XG4gICAgICB9KSh7XG4gICAgICAgIG5hbWUsIGRlZmluaXRpb24sXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgLyoqXG4gICAqIOS7jiBhdHRycyDkuK3mj5Dlj5YgZW1pdHMg5a6a5LmJ55qE5bGe5oCnXG4gICAqIEBwYXJhbSBhdHRycyB2dWUgYXR0cnNcbiAgICogQHBhcmFtIGVtaXREZWZpbml0aW9ucyBlbWl0cyDlrprkuYnvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICovXG4gIGdldEVtaXRzRnJvbUF0dHJzKGF0dHJzLCBlbWl0RGVmaW5pdGlvbnMpIHtcbiAgICAvLyBlbWl0cyDlrprkuYnnu5/kuIDmiJDmlbDnu4TmoLzlvI9cbiAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUoZW1pdERlZmluaXRpb25zKSA9PT0gT2JqZWN0KSB7XG4gICAgICBlbWl0RGVmaW5pdGlvbnMgPSBPYmplY3Qua2V5cyhlbWl0RGVmaW5pdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoIShlbWl0RGVmaW5pdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIGVtaXREZWZpbml0aW9ucyA9IFtdO1xuICAgIH1cbiAgICAvLyDnu5/kuIDlpITnkIbmiJAgb25FbWl0TmFtZeOAgW9uVXBkYXRlOmVtaXROYW1lKHYtbW9kZWzns7vliJcpIOagvOW8j1xuICAgIGNvbnN0IGVtaXROYW1lcyA9IGVtaXREZWZpbml0aW9ucy5tYXAobmFtZSA9PiBfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCkpO1xuICAgIC8vIOiuvue9ruWAvFxuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgZW1pdE5hbWVzKSB7XG4gICAgICAoZnVuY3Rpb24gc2V0UmVzdWx0KHsgbmFtZSwgZW5kID0gZmFsc2UgfSkge1xuICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCdvblVwZGF0ZTonKSkge1xuICAgICAgICAgIC8vIG9uVXBkYXRlOmVtaXROYW1lIOaIliBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6YCS5b2S6L+b5p2lXG4gICAgICAgICAgaWYgKG5hbWUgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbWVsTmFtZSA9IF9TdHJpbmcudG9DYW1lbENhc2UobmFtZSk7XG4gICAgICAgICAgICByZXN1bHRbY2FtZWxOYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBvblVwZGF0ZTplbWl0LW5hbWUg5qC85byP6L+b6YCS5b2SXG4gICAgICAgICAgaWYgKGVuZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZXRSZXN1bHQoeyBuYW1lOiBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UobmFtZS5zbGljZShuYW1lLmluZGV4T2YoJzonKSArIDEpKX1gLCBlbmQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb25FbWl0TmFtZeagvOW8j++8jOS4reWIkue6v+agvOW8j+W3suiiq3Z1Zei9rOaNouS4jeeUqOmHjeWkjeWkhOeQhlxuICAgICAgICBpZiAobmFtZSBpbiBhdHRycykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGF0dHJzW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9KSh7IG5hbWUgfSk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIC8qKlxuICAgKiDku44gYXR0cnMg5Lit5o+Q5Y+W5Ymp5L2Z5bGe5oCn44CC5bi455So5LqO57uE5Lu2aW5oZXJpdEF0dHJz6K6+572uZmFsc2Xml7bkvb/nlKjkvZzkuLrmlrDnmoRhdHRyc1xuICAgKiBAcGFyYW0gYXR0cnMgdnVlIGF0dHJzXG4gICAqIEBwYXJhbSB7fSDphY3nva7poblcbiAgICogICAgICAgICAgQHBhcmFtIHByb3BzIHByb3BzIOWumuS5iSDmiJYgdnVlIHByb3Bz77yM5aaCIEVsQnV0dG9uLnByb3BzIOetiVxuICAgKiAgICAgICAgICBAcGFyYW0gZW1pdHMgZW1pdHMg5a6a5LmJIOaIliB2dWUgZW1pdHPvvIzlpoIgRWxCdXR0b24uZW1pdHMg562JXG4gICAqICAgICAgICAgIEBwYXJhbSBsaXN0IOmineWklueahOaZrumAmuWxnuaAp1xuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBnZXRSZXN0RnJvbUF0dHJzKGF0dHJzLCB7IHByb3BzLCBlbWl0cywgbGlzdCA9IFtdIH0gPSB7fSkge1xuICAgIC8vIOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIHByb3BzID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChwcm9wcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShwcm9wcykgPT09IE9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiBhcnIubWFwKG5hbWUgPT4gW19TdHJpbmcudG9DYW1lbENhc2UobmFtZSksIF9TdHJpbmcudG9MaW5lQ2FzZShuYW1lKV0pLmZsYXQoKTtcbiAgICB9KSgpO1xuICAgIGVtaXRzID0gKCgpID0+IHtcbiAgICAgIGNvbnN0IGFyciA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChlbWl0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIGVtaXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShlbWl0cykgPT09IE9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhlbWl0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiBhcnIubWFwKChuYW1lKSA9PiB7XG4gICAgICAgIC8vIHVwZGF0ZTplbWl0TmFtZSDmiJYgdXBkYXRlOmVtaXQtbmFtZSDmoLzlvI9cbiAgICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aCgndXBkYXRlOicpKSB7XG4gICAgICAgICAgY29uc3QgcGFydE5hbWUgPSBuYW1lLnNsaWNlKG5hbWUuaW5kZXhPZignOicpICsgMSk7XG4gICAgICAgICAgcmV0dXJuIFtgb25VcGRhdGU6JHtfU3RyaW5nLnRvQ2FtZWxDYXNlKHBhcnROYW1lKX1gLCBgb25VcGRhdGU6JHtfU3RyaW5nLnRvTGluZUNhc2UocGFydE5hbWUpfWBdO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9uRW1pdE5hbWXmoLzlvI/vvIzkuK3liJLnur/moLzlvI/lt7Looqt2dWXovazmjaLkuI3nlKjph43lpI3lpITnkIZcbiAgICAgICAgcmV0dXJuIFtfU3RyaW5nLnRvQ2FtZWxDYXNlKGBvbi0ke25hbWV9YCldO1xuICAgICAgfSkuZmxhdCgpO1xuICAgIH0pKCk7XG4gICAgbGlzdCA9ICgoKSA9PiB7XG4gICAgICBjb25zdCBhcnIgPSBEYXRhLmdldEV4YWN0VHlwZShsaXN0KSA9PT0gU3RyaW5nXG4gICAgICAgID8gbGlzdC5zcGxpdCgnLCcpXG4gICAgICAgIDogbGlzdCBpbnN0YW5jZW9mIEFycmF5ID8gbGlzdCA6IFtdO1xuICAgICAgcmV0dXJuIGFyci5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgICB9KSgpO1xuICAgIGNvbnN0IGxpc3RBbGwgPSBBcnJheS5mcm9tKG5ldyBTZXQoW3Byb3BzLCBlbWl0cywgbGlzdF0uZmxhdCgpKSk7XG4gICAgLy8gY29uc29sZS5sb2coJ2xpc3RBbGwnLCBsaXN0QWxsKTtcbiAgICAvLyDorr7nva7lgLxcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBbbmFtZSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoYXR0cnMpKSkge1xuICAgICAgaWYgKCFsaXN0QWxsLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIG5hbWUsIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygncmVzdWx0JywgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufTtcbiIsImV4cG9ydCBjb25zdCBfUmVmbGVjdCA9IHtcbiAgLy8g5a+5IG93bktleXMg6YWN5aWXIG93blZhbHVlcyDlkowgb3duRW50cmllc1xuICBvd25WYWx1ZXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLm1hcChrZXkgPT4gdGFyZ2V0W2tleV0pO1xuICB9LFxuICBvd25FbnRyaWVzKHRhcmdldCkge1xuICAgIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KS5tYXAoa2V5ID0+IFtrZXksIHRhcmdldFtrZXldXSk7XG4gIH0sXG59O1xuIiwiZXhwb3J0IGNvbnN0IF9TZXQgPSB7XG4gIC8qKlxuICAgKiDliqDlvLphZGTmlrnms5XjgILot5/mlbDnu4RwdXNo5pa55rOV5LiA5qC35Y+v5re75Yqg5aSa5Liq5YC8XG4gICAqIEBwYXJhbSBzZXQge1NldH0g55uu5qCHc2V0XG4gICAqIEBwYXJhbSBhcmdzIHsqW119IOWkmuS4quWAvFxuICAgKi9cbiAgYWRkKHNldCwgLi4uYXJncykge1xuICAgIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICAgIHNldC5hZGQoYXJnKTtcbiAgICB9XG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgX1JlZmxlY3QgfSBmcm9tICcuL19SZWZsZWN0JztcbmltcG9ydCB7IF9TZXQgfSBmcm9tICcuL19TZXQnO1xuaW1wb3J0IHsgRGF0YSB9IGZyb20gJy4vRGF0YSc7XG5cbi8qKlxuICog5bGe5oCn5ZCN57uf5LiA5oiQ5pWw57uE5qC85byPXG4gKiBAcGFyYW0gbmFtZXMge3N0cmluZ3xTeW1ib2x8YXJyYXl9IOWxnuaAp+WQjeOAguagvOW8jyAnYSxiLGMnIOaIliBbJ2EnLCdiJywnYyddXG4gKiBAcGFyYW0gc2VwYXJhdG9yIHtzdHJpbmd8UmVnRXhwfSBuYW1lcyDkuLrlrZfnrKbkuLLml7bnmoTmi4bliIbop4TliJnjgILlkIwgc3BsaXQg5pa55rOV55qEIHNlcGFyYXRvcu+8jOWtl+espuS4suaXoOmcgOaLhuWIhueahOWPr+S7peS8oCBudWxsIOaIliB1bmRlZmluZWRcbiAqIEByZXR1cm5zIHsqW11bXXwoTWFnaWNTdHJpbmcgfCBCdW5kbGUgfCBzdHJpbmcpW118RmxhdEFycmF5PChGbGF0QXJyYXk8KCp8WypbXV18W10pW10sIDE+W118KnxbKltdXXxbXSlbXSwgMT5bXXwqW119XG4gKi9cbmZ1bmN0aW9uIG5hbWVzVG9BcnJheShuYW1lcyA9IFtdLCB7IHNlcGFyYXRvciA9ICcsJyB9ID0ge30pIHtcbiAgaWYgKG5hbWVzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gbmFtZXMubWFwKHZhbCA9PiBuYW1lc1RvQXJyYXkodmFsKSkuZmxhdCgpO1xuICB9XG4gIGNvbnN0IGV4YWN0VHlwZSA9IERhdGEuZ2V0RXhhY3RUeXBlKG5hbWVzKTtcbiAgaWYgKGV4YWN0VHlwZSA9PT0gU3RyaW5nKSB7XG4gICAgcmV0dXJuIG5hbWVzLnNwbGl0KHNlcGFyYXRvcikubWFwKHZhbCA9PiB2YWwudHJpbSgpKS5maWx0ZXIodmFsID0+IHZhbCk7XG4gIH1cbiAgaWYgKGV4YWN0VHlwZSA9PT0gU3ltYm9sKSB7XG4gICAgcmV0dXJuIFtuYW1lc107XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KFN5bWJvbCgpKSk7XG4vLyBjb25zb2xlLmxvZyhuYW1lc1RvQXJyYXkoWydhJywgJ2InLCAnYycsIFN5bWJvbCgpXSkpO1xuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KCdhLGIsYycpKTtcbi8vIGNvbnNvbGUubG9nKG5hbWVzVG9BcnJheShbJ2EsYixjJywgU3ltYm9sKCldKSk7XG5leHBvcnQgY29uc3QgX09iamVjdCA9IHtcbiAgLyoqXG4gICAqIOa1heWQiOW5tuWvueixoeOAguWGmeazleWQjCBPYmplY3QuYXNzaWduXG4gICAqIOmAmui/h+mHjeWumuS5ieaWueW8j+WQiOW5tu+8jOino+WGsyBPYmplY3QuYXNzaWduIOWQiOW5tuS4pOi+ueWQjOWQjeWxnuaAp+a3t+aciSB2YWx1ZeWGmeazlSDlkowgZ2V0L3NldOWGmeazlSDml7bmiqUgVHlwZUVycm9yOiBDYW5ub3Qgc2V0IHByb3BlcnR5IGIgb2YgIzxPYmplY3Q+IHdoaWNoIGhhcyBvbmx5IGEgZ2V0dGVyIOeahOmXrumimFxuICAgKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoVxuICAgKiBAcGFyYW0gc291cmNlcyB7YW55W119IOaVsOaNrua6kOOAguS4gOS4quaIluWkmuS4quWvueixoVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGFzc2lnbih0YXJnZXQgPSB7fSwgLi4uc291cmNlcykge1xuICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAgIC8vIOS4jeS9v+eUqCB0YXJnZXRba2V5XT12YWx1ZSDlhpnms5XvvIznm7TmjqXkvb/nlKhkZXNj6YeN5a6a5LmJXG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH0sXG4gIC8qKlxuICAgKiDmt7HlkIjlubblr7nosaHjgILlkIwgYXNzaWduIOS4gOagt+S5n+S8muWvueWxnuaAp+i/m+ihjOmHjeWumuS5iVxuICAgKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoeOAgum7mOiupOWAvCB7fSDpmLLmraLpgJLlvZLml7bmiqUgVHlwZUVycm9yOiBPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3RcbiAgICogQHBhcmFtIHNvdXJjZXMge2FueVtdfSDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAgICovXG4gIGRlZXBBc3NpZ24odGFyZ2V0ID0ge30sIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAvLyB2YWx1ZeWGmeazle+8muWvueixoemAkuW9kuWkhOeQhu+8jOWFtuS7luebtOaOpeWumuS5iVxuICAgICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZShkZXNjLnZhbHVlKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGVlcEFzc2lnbih0YXJnZXRba2V5XSwgZGVzYy52YWx1ZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0L3NldOWGmeazle+8muebtOaOpeWumuS5iVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSxcbiAgLyoqXG4gICAqIGtleeiHqui6q+aJgOWxnueahOWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd8U3ltYm9sfSDlsZ7mgKflkI1cbiAgICogQHJldHVybnMgeyp8bnVsbH1cbiAgICovXG4gIG93bmVyKG9iamVjdCwga2V5KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGxldCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3duZXIoX19wcm90b19fLCBrZXkpO1xuICB9LFxuICAvKipcbiAgICog6I635Y+W5bGe5oCn5o+P6L+w5a+56LGh77yM55u45q+UIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3LvvIzog73mi7/liLDnu6fmib/lsZ7mgKfnmoTmj4/ov7Dlr7nosaFcbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fVxuICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd8U3ltYm9sfVxuICAgKiBAcmV0dXJucyB7UHJvcGVydHlEZXNjcmlwdG9yfVxuICAgKi9cbiAgZGVzY3JpcHRvcihvYmplY3QsIGtleSkge1xuICAgIGNvbnN0IGZpbmRPYmplY3QgPSB0aGlzLm93bmVyKG9iamVjdCwga2V5KTtcbiAgICBpZiAoIWZpbmRPYmplY3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZpbmRPYmplY3QsIGtleSk7XG4gIH0sXG4gIC8qKlxuICAgKiDojrflj5blsZ7mgKflkI3jgILpu5jorqTlj4LmlbDphY3nva7miJDlkIwgT2JqZWN0LmtleXMg6KGM5Li6XG4gICAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gICAqIEBwYXJhbSBzeW1ib2wge2Jvb2xlYW59IOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gICAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDmmK/lkKbljIXlkKvkuI3lj6/liJfkuL7lsZ7mgKdcbiAgICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gICAqIEByZXR1cm5zIHthbnlbXX1cbiAgICovXG4gIGtleXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgLy8gc2V055So5LqOa2V55Y676YeNXG4gICAgbGV0IHNldCA9IG5ldyBTZXQoKTtcbiAgICAvLyDoh6rouqvlsZ7mgKfnrZvpgIlcbiAgICBjb25zdCBkZXNjcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCk7XG4gICAgZm9yIChjb25zdCBba2V5LCBkZXNjXSBvZiBfUmVmbGVjdC5vd25FbnRyaWVzKGRlc2NzKSkge1xuICAgICAgLy8g5b+955Wlc3ltYm9s5bGe5oCn55qE5oOF5Ya1XG4gICAgICBpZiAoIXN5bWJvbCAmJiBEYXRhLmdldEV4YWN0VHlwZShrZXkpID09PSBTeW1ib2wpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlv73nlaXkuI3lj6/liJfkuL7lsZ7mgKfnmoTmg4XlhrVcbiAgICAgIGlmICghbm90RW51bWVyYWJsZSAmJiAhZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5bGe5oCn5Yqg5YWlXG4gICAgICBzZXQuYWRkKGtleSk7XG4gICAgfVxuICAgIC8vIOe7p+aJv+WxnuaAp1xuICAgIGlmIChleHRlbmQpIHtcbiAgICAgIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgaWYgKF9fcHJvdG9fXyAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBwYXJlbnRLZXlzID0gdGhpcy5rZXlzKF9fcHJvdG9fXywgb3B0aW9ucyk7XG4gICAgICAgIF9TZXQuYWRkKHNldCwgLi4ucGFyZW50S2V5cyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIOi/lOWbnuaVsOe7hFxuICAgIHJldHVybiBBcnJheS5mcm9tKHNldCk7XG4gIH0sXG4gIC8qKlxuICAgKiDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvcnPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge1Byb3BlcnR5RGVzY3JpcHRvcltdfVxuICAgKi9cbiAgZGVzY3JpcHRvcnMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIC8vIOmAiemhueaUtumbhlxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH07XG4gICAgY29uc3Qga2V5cyA9IHRoaXMua2V5cyhvYmplY3QsIG9wdGlvbnMpO1xuICAgIHJldHVybiBrZXlzLm1hcChrZXkgPT4gdGhpcy5kZXNjcmlwdG9yKG9iamVjdCwga2V5KSk7XG4gIH0sXG4gIC8qKlxuICAgKiDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvckVudHJpZXPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAgICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAgICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCrIHN5bWJvbCDlsZ7mgKdcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICAgKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAgICogQHJldHVybnMge1tzdHJpbmd8U3ltYm9sLFByb3BlcnR5RGVzY3JpcHRvcl1bXX1cbiAgICovXG4gIGRlc2NyaXB0b3JFbnRyaWVzKG9iamVjdCwgeyBzeW1ib2wgPSBmYWxzZSwgbm90RW51bWVyYWJsZSA9IGZhbHNlLCBleHRlbmQgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAvLyDpgInpobnmlLbpm4ZcbiAgICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICAgIGNvbnN0IGtleXMgPSB0aGlzLmtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4ga2V5cy5tYXAoa2V5ID0+IFtrZXksIHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSldKTtcbiAgfSxcbiAgLyoqXG4gICAqIOmAieWPluWvueixoVxuICAgKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICAgKiBAcGFyYW0gcGljayB7c3RyaW5nfGFycmF5fSDmjJHpgInlsZ7mgKdcbiAgICogQHBhcmFtIG9taXQge3N0cmluZ3xhcnJheX0g5b+955Wl5bGe5oCnXG4gICAqIEBwYXJhbSBlbXB0eVBpY2sge3N0cmluZ30gcGljayDkuLrnqbrml7bnmoTlj5blgLzjgIJhbGwg5YWo6YOoa2V577yMZW1wdHkg56m6XG4gICAqIEBwYXJhbSBzZXBhcmF0b3Ige3N0cmluZ3xSZWdFeHB9IOWQjCBuYW1lc1RvQXJyYXkg55qEIHNlcGFyYXRvciDlj4LmlbBcbiAgICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5ZCMIGtleXMg55qEIHN5bWJvbCDlj4LmlbBcbiAgICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOWQjCBrZXlzIOeahCBub3RFbnVtZXJhYmxlIOWPguaVsFxuICAgKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDlkIwga2V5cyDnmoQgZXh0ZW5kIOWPguaVsFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBmaWx0ZXIob2JqZWN0LCB7IHBpY2sgPSBbXSwgb21pdCA9IFtdLCBlbXB0eVBpY2sgPSAnYWxsJywgc2VwYXJhdG9yID0gJywnLCBzeW1ib2wgPSB0cnVlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IHRydWUgfSA9IHt9KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIC8vIHBpY2vjgIFvbWl0IOe7n+S4gOaIkOaVsOe7hOagvOW8j1xuICAgIHBpY2sgPSBuYW1lc1RvQXJyYXkocGljaywgeyBzZXBhcmF0b3IgfSk7XG4gICAgb21pdCA9IG5hbWVzVG9BcnJheShvbWl0LCB7IHNlcGFyYXRvciB9KTtcbiAgICBsZXQga2V5cyA9IFtdO1xuICAgIC8vIHBpY2vmnInlgLznm7TmjqXmi7/vvIzkuLrnqbrml7bmoLnmja4gZW1wdHlQaWNrIOm7mOiupOaLv+epuuaIluWFqOmDqGtleVxuICAgIGtleXMgPSBwaWNrLmxlbmd0aCA+IDAgfHwgZW1wdHlQaWNrID09PSAnZW1wdHknID8gcGljayA6IHRoaXMua2V5cyhvYmplY3QsIHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfSk7XG4gICAgLy8gb21pdOetm+mAiVxuICAgIGtleXMgPSBrZXlzLmZpbHRlcihrZXkgPT4gIW9taXQuaW5jbHVkZXMoa2V5KSk7XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgY29uc3QgZGVzYyA9IHRoaXMuZGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG4gICAgICAvLyDlsZ7mgKfkuI3lrZjlnKjlr7zoh7RkZXNj5b6X5YiwdW5kZWZpbmVk5pe25LiN6K6+572u5YC8XG4gICAgICBpZiAoZGVzYykge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICAvKipcbiAgICog6YCa6L+H5oyR6YCJ5pa55byP6YCJ5Y+W5a+56LGh44CCZmlsdGVy55qE566A5YaZ5pa55byPXG4gICAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gICAqIEBwYXJhbSBrZXlzIHtzdHJpbmd8YXJyYXl9IOWxnuaAp+WQjembhuWQiFxuICAgKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fSDpgInpobnvvIzlkIwgZmlsdGVyIOeahOWQhOmAiemhueWAvFxuICAgKiBAcmV0dXJucyB7e319XG4gICAqL1xuICBwaWNrKG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXIob2JqZWN0LCB7IHBpY2s6IGtleXMsIGVtcHR5UGljazogJ2VtcHR5JywgLi4ub3B0aW9ucyB9KTtcbiAgfSxcbiAgLyoqXG4gICAqIOmAmui/h+aOkumZpOaWueW8j+mAieWPluWvueixoeOAgmZpbHRlcueahOeugOWGmeaWueW8j1xuICAgKiBAcGFyYW0gb2JqZWN0IHtvYmplY3R9IOWvueixoVxuICAgKiBAcGFyYW0ga2V5cyB7c3RyaW5nfGFycmF5fSDlsZ7mgKflkI3pm4blkIhcbiAgICogQHBhcmFtIG9wdGlvbnMge29iamVjdH0g6YCJ6aG577yM5ZCMIGZpbHRlciDnmoTlkITpgInpobnlgLxcbiAgICogQHJldHVybnMge3t9fVxuICAgKi9cbiAgb21pdChvYmplY3QsIGtleXMgPSBbXSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iamVjdCwgeyBvbWl0OiBrZXlzLCAuLi5vcHRpb25zIH0pO1xuICB9LFxufTtcbiIsIi8qKlxuICogZXNsaW50IOmFjee9ru+8mmh0dHA6Ly9lc2xpbnQuY24vZG9jcy9ydWxlcy9cbiAqIGVzbGludC1wbHVnaW4tdnVlIOmFjee9ru+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy9ydWxlcy9cbiAqL1xuaW1wb3J0IHsgX09iamVjdCwgRGF0YSB9IGZyb20gJy4uL2Jhc2UnO1xuXG4vKipcbiAqIOWvvOWHuuW4uOmHj+S+v+aNt+S9v+eUqFxuICovXG5leHBvcnQgY29uc3QgT0ZGID0gJ29mZic7XG5leHBvcnQgY29uc3QgV0FSTiA9ICd3YXJuJztcbmV4cG9ydCBjb25zdCBFUlJPUiA9ICdlcnJvcic7XG4vKipcbiAqIOWumuWItueahOmFjee9rlxuICovXG4vLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICAvLyDnjq/looNcbiAgZW52OiB7XG4gICAgYnJvd3NlcjogdHJ1ZSxcbiAgICBub2RlOiB0cnVlLFxuICAgIGNvbW1vbmpzOiB0cnVlLFxuICAgIGVzMjAyMjogdHJ1ZSxcbiAgfSxcbiAgLy8g6Kej5p6Q5ZmoXG4gIHBhcnNlck9wdGlvbnM6IHtcbiAgICBlY21hVmVyc2lvbjogJ2xhdGVzdCcsXG4gICAgc291cmNlVHlwZTogJ21vZHVsZScsXG4gICAgZWNtYUZlYXR1cmVzOiB7XG4gICAgICBqc3g6IHRydWUsXG4gICAgICBleHBlcmltZW50YWxPYmplY3RSZXN0U3ByZWFkOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIC8qKlxuICAgKiDnu6fmib9cbiAgICog5L2/55SoZXNsaW5055qE6KeE5YiZ77yaZXNsaW50OumFjee9ruWQjeensFxuICAgKiDkvb/nlKjmj5Lku7bnmoTphY3nva7vvJpwbHVnaW465YyF5ZCN566A5YaZL+mFjee9ruWQjeensFxuICAgKi9cbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCBlc2xpbnQg5o6o6I2Q55qE6KeE5YiZXG4gICAgJ2VzbGludDpyZWNvbW1lbmRlZCcsXG4gIF0sXG4gIC8vXG4gIC8qKlxuICAgKiDop4TliJlcbiAgICog5p2l6IeqIGVzbGludCDnmoTop4TliJnvvJrop4TliJlJRCA6IHZhbHVlXG4gICAqIOadpeiHquaPkuS7tueahOinhOWIme+8muWMheWQjeeugOWGmS/op4TliJlJRCA6IHZhbHVlXG4gICAqL1xuICBydWxlczoge1xuICAgIC8qKlxuICAgICAqIFBvc3NpYmxlIEVycm9yc1xuICAgICAqIOi/meS6m+inhOWImeS4jiBKYXZhU2NyaXB0IOS7o+eggeS4reWPr+iDveeahOmUmeivr+aIlumAu+i+kemUmeivr+acieWFs++8mlxuICAgICAqL1xuICAgICdnZXR0ZXItcmV0dXJuJzogT0ZGLCAvLyDlvLrliLYgZ2V0dGVyIOWHveaVsOS4reWHuueOsCByZXR1cm4g6K+t5Y+lXG4gICAgJ25vLWNvbnN0YW50LWNvbmRpdGlvbic6IE9GRiwgLy8g56aB5q2i5Zyo5p2h5Lu25Lit5L2/55So5bi46YeP6KGo6L6+5byPXG4gICAgJ25vLWVtcHR5JzogT0ZGLCAvLyDnpoHmraLlh7rnjrDnqbror63lj6XlnZdcbiAgICAnbm8tZXh0cmEtc2VtaSc6IFdBUk4sIC8vIOemgeatouS4jeW/heimgeeahOWIhuWPt1xuICAgICduby1mdW5jLWFzc2lnbic6IE9GRiwgLy8g56aB5q2i5a+5IGZ1bmN0aW9uIOWjsOaYjumHjeaWsOi1i+WAvFxuICAgICduby1wcm90b3R5cGUtYnVpbHRpbnMnOiBPRkYsIC8vIOemgeatouebtOaOpeiwg+eUqCBPYmplY3QucHJvdG90eXBlcyDnmoTlhoXnva7lsZ7mgKdcbiAgICAvKipcbiAgICAgKiBCZXN0IFByYWN0aWNlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6juacgOS9s+Wunui3teeahO+8jOW4ruWKqeS9oOmBv+WFjeS4gOS6m+mXrumimO+8mlxuICAgICAqL1xuICAgICdhY2Nlc3Nvci1wYWlycyc6IEVSUk9SLCAvLyDlvLrliLYgZ2V0dGVyIOWSjCBzZXR0ZXIg5Zyo5a+56LGh5Lit5oiQ5a+55Ye6546wXG4gICAgJ2FycmF5LWNhbGxiYWNrLXJldHVybic6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueazleeahOWbnuiwg+WHveaVsOS4reaciSByZXR1cm4g6K+t5Y+lXG4gICAgJ2Jsb2NrLXNjb3BlZC12YXInOiBFUlJPUiwgLy8g5by65Yi25oqK5Y+Y6YeP55qE5L2/55So6ZmQ5Yi25Zyo5YW25a6a5LmJ55qE5L2c55So5Z+f6IyD5Zu05YaFXG4gICAgJ2N1cmx5JzogV0FSTiwgLy8g5by65Yi25omA5pyJ5o6n5Yi26K+t5Y+l5L2/55So5LiA6Ie055qE5ous5Y+36aOO5qC8XG4gICAgJ25vLWZhbGx0aHJvdWdoJzogV0FSTiwgLy8g56aB5q2iIGNhc2Ug6K+t5Y+l6JC956m6XG4gICAgJ25vLWZsb2F0aW5nLWRlY2ltYWwnOiBFUlJPUiwgLy8g56aB5q2i5pWw5a2X5a2X6Z2i6YeP5Lit5L2/55So5YmN5a+85ZKM5pyr5bC+5bCP5pWw54K5XG4gICAgJ25vLW11bHRpLXNwYWNlcyc6IFdBUk4sIC8vIOemgeatouS9v+eUqOWkmuS4quepuuagvFxuICAgICduby1uZXctd3JhcHBlcnMnOiBFUlJPUiwgLy8g56aB5q2i5a+5IFN0cmluZ++8jE51bWJlciDlkowgQm9vbGVhbiDkvb/nlKggbmV3IOaTjeS9nOesplxuICAgICduby1wcm90byc6IEVSUk9SLCAvLyDnpoHnlKggX19wcm90b19fIOWxnuaAp1xuICAgICduby1yZXR1cm4tYXNzaWduJzogV0FSTiwgLy8g56aB5q2i5ZyoIHJldHVybiDor63lj6XkuK3kvb/nlKjotYvlgLzor63lj6VcbiAgICAnbm8tdXNlbGVzcy1lc2NhcGUnOiBXQVJOLCAvLyDnpoHnlKjkuI3lv4XopoHnmoTovazkuYnlrZfnrKZcbiAgICAvKipcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKiDov5nkupvop4TliJnkuI7lj5jph4/lo7DmmI7mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnbm8tdW5kZWYtaW5pdCc6IFdBUk4sIC8vIOemgeatouWwhuWPmOmHj+WIneWni+WMluS4uiB1bmRlZmluZWRcbiAgICAnbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOemgeatouWHuueOsOacquS9v+eUqOi/h+eahOWPmOmHj1xuICAgICduby11c2UtYmVmb3JlLWRlZmluZSc6IFtFUlJPUiwgeyAnZnVuY3Rpb25zJzogZmFsc2UsICdjbGFzc2VzJzogZmFsc2UsICd2YXJpYWJsZXMnOiBmYWxzZSB9XSwgLy8g56aB5q2i5Zyo5Y+Y6YeP5a6a5LmJ5LmL5YmN5L2/55So5a6D5LusXG4gICAgLyoqXG4gICAgICogU3R5bGlzdGljIElzc3Vlc1xuICAgICAqIOi/meS6m+inhOWImeaYr+WFs+S6jumjjuagvOaMh+WNl+eahO+8jOiAjOS4lOaYr+mdnuW4uOS4u+ingueahO+8mlxuICAgICAqL1xuICAgICdhcnJheS1icmFja2V0LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbmlbDnu4Tmlrnmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnYmxvY2stc3BhY2luZyc6IFdBUk4sIC8vIOemgeatouaIluW8uuWItuWcqOS7o+eggeWdl+S4reW8gOaLrOWPt+WJjeWSjOmXreaLrOWPt+WQjuacieepuuagvFxuICAgICdicmFjZS1zdHlsZSc6IFtXQVJOLCAnMXRicycsIHsgJ2FsbG93U2luZ2xlTGluZSc6IHRydWUgfV0sIC8vIOW8uuWItuWcqOS7o+eggeWdl+S4reS9v+eUqOS4gOiHtOeahOWkp+aLrOWPt+mjjuagvFxuICAgICdjb21tYS1kYW5nbGUnOiBbV0FSTiwgJ2Fsd2F5cy1tdWx0aWxpbmUnXSwgLy8g6KaB5rGC5oiW56aB5q2i5pyr5bC+6YCX5Y+3XG4gICAgJ2NvbW1hLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjpgJflj7fliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnY29tbWEtc3R5bGUnOiBXQVJOLCAvLyDlvLrliLbkvb/nlKjkuIDoh7TnmoTpgJflj7fpo47moLxcbiAgICAnY29tcHV0ZWQtcHJvcGVydHktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOiuoeeul+eahOWxnuaAp+eahOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdmdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sIC8vIOimgeaxguaIluemgeatouWcqOWHveaVsOagh+ivhuespuWSjOWFtuiwg+eUqOS5i+mXtOacieepuuagvFxuICAgICdmdW5jdGlvbi1wYXJlbi1uZXdsaW5lJzogV0FSTiwgLy8g5by65Yi25Zyo5Ye95pWw5ous5Y+35YaF5L2/55So5LiA6Ie055qE5o2i6KGMXG4gICAgJ2ltcGxpY2l0LWFycm93LWxpbmVicmVhayc6IFdBUk4sIC8vIOW8uuWItumakOW8j+i/lOWbnueahOeureWktOWHveaVsOS9k+eahOS9jee9rlxuICAgICdpbmRlbnQnOiBbV0FSTiwgMiwgeyAnU3dpdGNoQ2FzZSc6IDEgfV0sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOe8qei/m1xuICAgICdqc3gtcXVvdGVzJzogV0FSTiwgLy8g5by65Yi25ZyoIEpTWCDlsZ7mgKfkuK3kuIDoh7TlnLDkvb/nlKjlj4zlvJXlj7fmiJbljZXlvJXlj7dcbiAgICAna2V5LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlr7nosaHlrZfpnaLph4/nmoTlsZ7mgKfkuK3plK7lkozlgLzkuYvpl7Tkvb/nlKjkuIDoh7TnmoTpl7Tot51cbiAgICAna2V5d29yZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo5YWz6ZSu5a2X5YmN5ZCO5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ25ldy1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLbmiJbnpoHmraLosIPnlKjml6Dlj4LmnoTpgKDlh73mlbDml7bmnInlnIbmi6zlj7dcbiAgICAnbm8tbXVsdGlwbGUtZW1wdHktbGluZXMnOiBbV0FSTiwgeyAnbWF4JzogMSwgJ21heEVPRic6IDAsICdtYXhCT0YnOiAwIH1dLCAvLyDnpoHmraLlh7rnjrDlpJrooYznqbrooYxcbiAgICAnbm8tdHJhaWxpbmctc3BhY2VzJzogV0FSTiwgLy8g56aB55So6KGM5bC+56m65qC8XG4gICAgJ25vLXdoaXRlc3BhY2UtYmVmb3JlLXByb3BlcnR5JzogV0FSTiwgLy8g56aB5q2i5bGe5oCn5YmN5pyJ56m655m9XG4gICAgJ25vbmJsb2NrLXN0YXRlbWVudC1ib2R5LXBvc2l0aW9uJzogV0FSTiwgLy8g5by65Yi25Y2V5Liq6K+t5Y+l55qE5L2N572uXG4gICAgJ29iamVjdC1jdXJseS1uZXdsaW5lJzogW1dBUk4sIHsgJ211bHRpbGluZSc6IHRydWUsICdjb25zaXN0ZW50JzogdHJ1ZSB9XSwgLy8g5by65Yi25aSn5ous5Y+35YaF5o2i6KGM56ym55qE5LiA6Ie05oCnXG4gICAgJ29iamVjdC1jdXJseS1zcGFjaW5nJzogW1dBUk4sICdhbHdheXMnXSwgLy8g5by65Yi25Zyo5aSn5ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3BhZGRlZC1ibG9ja3MnOiBbV0FSTiwgJ25ldmVyJ10sIC8vIOimgeaxguaIluemgeatouWdl+WGheWhq+WFhVxuICAgICdxdW90ZXMnOiBbV0FSTiwgJ3NpbmdsZScsIHsgJ2F2b2lkRXNjYXBlJzogdHJ1ZSwgJ2FsbG93VGVtcGxhdGVMaXRlcmFscyc6IHRydWUgfV0sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOWPjeWLvuWPt+OAgeWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdzZW1pJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5L2/55So5YiG5Y+35Luj5pu/IEFTSVxuICAgICdzZW1pLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbliIblj7fkuYvliY3lkozkuYvlkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc2VtaS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+eahOS9jee9rlxuICAgICdzcGFjZS1iZWZvcmUtYmxvY2tzJzogV0FSTiwgLy8g5by65Yi25Zyo5Z2X5LmL5YmN5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWJlZm9yZS1mdW5jdGlvbi1wYXJlbic6IFtXQVJOLCB7ICdhbm9ueW1vdXMnOiAnbmV2ZXInLCAnbmFtZWQnOiAnbmV2ZXInLCAnYXN5bmNBcnJvdyc6ICdhbHdheXMnIH1dLCAvLyDlvLrliLblnKggZnVuY3Rpb27nmoTlt6bmi6zlj7fkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW4tcGFyZW5zJzogV0FSTiwgLy8g5by65Yi25Zyo5ZyG5ous5Y+35YaF5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3NwYWNlLWluZml4LW9wcyc6IFdBUk4sIC8vIOimgeaxguaTjeS9nOespuWRqOWbtOacieepuuagvFxuICAgICdzcGFjZS11bmFyeS1vcHMnOiBXQVJOLCAvLyDlvLrliLblnKjkuIDlhYPmk43kvZznrKbliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2VkLWNvbW1lbnQnOiBXQVJOLCAvLyDlvLrliLblnKjms6jph4rkuK0gLy8g5oiWIC8qIOS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzd2l0Y2gtY29sb24tc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqCBzd2l0Y2gg55qE5YaS5Y+35bem5Y+z5pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLXRhZy1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5qih5p2/5qCH6K6w5ZKM5a6D5Lus55qE5a2X6Z2i6YeP5LmL6Ze055qE56m65qC8XG4gICAgLyoqXG4gICAgICogRUNNQVNjcmlwdCA2XG4gICAgICog6L+Z5Lqb6KeE5YiZ5Y+q5LiOIEVTNiDmnInlhbMsIOWNs+mAmuW4uOaJgOivtOeahCBFUzIwMTXvvJpcbiAgICAgKi9cbiAgICAnYXJyb3ctc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItueureWktOWHveaVsOeahOeureWktOWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdnZW5lcmF0b3Itc3Rhci1zcGFjaW5nJzogW1dBUk4sIHsgJ2JlZm9yZSc6IGZhbHNlLCAnYWZ0ZXInOiB0cnVlLCAnbWV0aG9kJzogeyAnYmVmb3JlJzogdHJ1ZSwgJ2FmdGVyJzogZmFsc2UgfSB9XSwgLy8g5by65Yi2IGdlbmVyYXRvciDlh73mlbDkuK0gKiDlj7flkajlm7Tkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbm8tdXNlbGVzcy1yZW5hbWUnOiBXQVJOLCAvLyDnpoHmraLlnKggaW1wb3J0IOWSjCBleHBvcnQg5ZKM6Kej5p6E6LWL5YC85pe25bCG5byV55So6YeN5ZG95ZCN5Li655u45ZCM55qE5ZCN5a2XXG4gICAgJ3ByZWZlci10ZW1wbGF0ZSc6IFdBUk4sIC8vIOimgeaxguS9v+eUqOaooeadv+Wtl+mdoumHj+iAjOmdnuWtl+espuS4sui/nuaOpVxuICAgICdyZXN0LXNwcmVhZC1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Ymp5L2Z5ZKM5omp5bGV6L+Q566X56ym5Y+K5YW26KGo6L6+5byP5LmL6Ze05pyJ56m65qC8XG4gICAgJ3RlbXBsYXRlLWN1cmx5LXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLmqKHmnb/lrZfnrKbkuLLkuK3nmoTltYzlhaXooajovr7lvI/lkajlm7TnqbrmoLznmoTkvb/nlKhcbiAgICAneWllbGQtc3Rhci1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHlpZWxkKiDooajovr7lvI/kuK0gKiDlkajlm7Tkvb/nlKjnqbrmoLxcbiAgfSxcbiAgLy8g6KaG55uWXG4gIG92ZXJyaWRlczogW10sXG59O1xuLy8gdnVlMi92dWUzIOWFseeUqFxuZXhwb3J0IGNvbnN0IHZ1ZUNvbW1vbkNvbmZpZyA9IHtcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL211bHRpLXdvcmQtY29tcG9uZW50LW5hbWVzJzogT0ZGLCAvLyDopoHmsYLnu4Tku7blkI3np7Dlp4vnu4jkuLrlpJrlrZdcbiAgICAndnVlL25vLXVudXNlZC1jb21wb25lbnRzJzogV0FSTiwgLy8g5pyq5L2/55So55qE57uE5Lu2XG4gICAgJ3Z1ZS9uby11bnVzZWQtdmFycyc6IE9GRiwgLy8g5pyq5L2/55So55qE5Y+Y6YePXG4gICAgJ3Z1ZS9yZXF1aXJlLXJlbmRlci1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmuLLmn5Plh73mlbDmgLvmmK/ov5Tlm57lgLxcbiAgICAndnVlL3JlcXVpcmUtdi1mb3Ita2V5JzogT0ZGLCAvLyB2LWZvcuS4reW/hemhu+S9v+eUqGtleVxuICAgICd2dWUvcmV0dXJuLWluLWNvbXB1dGVkLXByb3BlcnR5JzogV0FSTiwgLy8g5by65Yi26L+U5Zue6K+t5Y+l5a2Y5Zyo5LqO6K6h566X5bGe5oCn5LitXG4gICAgJ3Z1ZS92YWxpZC10ZW1wbGF0ZS1yb290JzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoTmqKHmnb/moLlcbiAgICAndnVlL3ZhbGlkLXYtZm9yJzogT0ZGLCAvLyDlvLrliLbmnInmlYjnmoR2LWZvcuaMh+S7pFxuICAgIC8vIFByaW9yaXR5IEI6IFN0cm9uZ2x5IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9hdHRyaWJ1dGUtaHlwaGVuYXRpb24nOiBPRkYsIC8vIOW8uuWItuWxnuaAp+WQjeagvOW8j1xuICAgICd2dWUvY29tcG9uZW50LWRlZmluaXRpb24tbmFtZS1jYXNpbmcnOiBPRkYsIC8vIOW8uuWItue7hOS7tm5hbWXmoLzlvI9cbiAgICAndnVlL2h0bWwtcXVvdGVzJzogW1dBUk4sICdkb3VibGUnLCB7ICdhdm9pZEVzY2FwZSc6IHRydWUgfV0sIC8vIOW8uuWItiBIVE1MIOWxnuaAp+eahOW8leWPt+agt+W8j1xuICAgICd2dWUvaHRtbC1zZWxmLWNsb3NpbmcnOiBPRkYsIC8vIOS9v+eUqOiHqumXreWQiOagh+etvlxuICAgICd2dWUvbWF4LWF0dHJpYnV0ZXMtcGVyLWxpbmUnOiBbV0FSTiwgeyAnc2luZ2xlbGluZSc6IEluZmluaXR5LCAnbXVsdGlsaW5lJzogMSB9XSwgLy8g5by65Yi25q+P6KGM5YyF5ZCr55qE5pyA5aSn5bGe5oCn5pWwXG4gICAgJ3Z1ZS9tdWx0aWxpbmUtaHRtbC1lbGVtZW50LWNvbnRlbnQtbmV3bGluZSc6IE9GRiwgLy8g6ZyA6KaB5Zyo5aSa6KGM5YWD57Sg55qE5YaF5a655YmN5ZCO5o2i6KGMXG4gICAgJ3Z1ZS9wcm9wLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDkuLogVnVlIOe7hOS7tuS4reeahCBQcm9wIOWQjeensOW8uuWItuaJp+ihjOeJueWumuWkp+Wwj+WGmVxuICAgICd2dWUvcmVxdWlyZS1kZWZhdWx0LXByb3AnOiBPRkYsIC8vIHByb3Bz6ZyA6KaB6buY6K6k5YC8XG4gICAgJ3Z1ZS9zaW5nbGVsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWNleihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvdi1iaW5kLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LWJpbmTmjIfku6Tpo47moLxcbiAgICAndnVlL3Ytb24tc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtb27mjIfku6Tpo47moLxcbiAgICAndnVlL3Ytc2xvdC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1zbG905oyH5Luk6aOO5qC8XG4gICAgLy8gUHJpb3JpdHkgQzogUmVjb21tZW5kZWRcbiAgICAndnVlL25vLXYtaHRtbCc6IE9GRiwgLy8g56aB5q2i5L2/55Sodi1odG1sXG4gICAgLy8gVW5jYXRlZ29yaXplZFxuICAgICd2dWUvYmxvY2stdGFnLW5ld2xpbmUnOiBXQVJOLCAvLyAg5Zyo5omT5byA5Z2X57qn5qCH6K6w5LmL5ZCO5ZKM5YWz6Zet5Z2X57qn5qCH6K6w5LmL5YmN5by65Yi25o2i6KGMXG4gICAgJ3Z1ZS9odG1sLWNvbW1lbnQtY29udGVudC1zcGFjaW5nJzogV0FSTiwgLy8g5ZyoSFRNTOazqOmHiuS4reW8uuWItue7n+S4gOeahOepuuagvFxuICAgICd2dWUvc2NyaXB0LWluZGVudCc6IFtXQVJOLCAyLCB7ICdiYXNlSW5kZW50JzogMSwgJ3N3aXRjaENhc2UnOiAxIH1dLCAvLyDlnKg8c2NyaXB0PuS4reW8uuWItuS4gOiHtOeahOe8qei/m1xuICAgIC8vIEV4dGVuc2lvbiBSdWxlc+OAguWvueW6lGVzbGludOeahOWQjOWQjeinhOWIme+8jOmAgueUqOS6jjx0ZW1wbGF0ZT7kuK3nmoTooajovr7lvI9cbiAgICAndnVlL2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9ibG9jay1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSxcbiAgICAndnVlL2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLFxuICAgICd2dWUvY29tbWEtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9jb21tYS1zdHlsZSc6IFdBUk4sXG4gICAgJ3Z1ZS9mdW5jLWNhbGwtc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXktc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9rZXl3b3JkLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLFxuICAgICd2dWUvb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLFxuICAgICd2dWUvc3BhY2UtaW4tcGFyZW5zJzogV0FSTixcbiAgICAndnVlL3NwYWNlLWluZml4LW9wcyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS11bmFyeS1vcHMnOiBXQVJOLFxuICAgICd2dWUvYXJyb3ctc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9wcmVmZXItdGVtcGxhdGUnOiBXQVJOLFxuICB9LFxuICBvdmVycmlkZXM6IFtcbiAgICB7XG4gICAgICAnZmlsZXMnOiBbJyoudnVlJ10sXG4gICAgICAncnVsZXMnOiB7XG4gICAgICAgICdpbmRlbnQnOiBPRkYsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuLy8gdnVlMueUqFxuZXhwb3J0IGNvbnN0IHZ1ZTJDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUyIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3JlY29tbWVuZGVkJyxcbiAgXSxcbn0pO1xuLy8gdnVlM+eUqFxuZXhwb3J0IGNvbnN0IHZ1ZTNDb25maWcgPSBtZXJnZSh2dWVDb21tb25Db25maWcsIHtcbiAgZW52OiB7XG4gICAgJ3Z1ZS9zZXR1cC1jb21waWxlci1tYWNyb3MnOiB0cnVlLCAvLyDlpITnkIZzZXR1cOaooeadv+S4reWDjyBkZWZpbmVQcm9wcyDlkowgZGVmaW5lRW1pdHMg6L+Z5qC355qE57yW6K+R5Zmo5a6P5oqlIG5vLXVuZGVmIOeahOmXrumimO+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy91c2VyLWd1aWRlLyNjb21waWxlci1tYWNyb3Mtc3VjaC1hcy1kZWZpbmVwcm9wcy1hbmQtZGVmaW5lZW1pdHMtZ2VuZXJhdGUtbm8tdW5kZWYtd2FybmluZ3NcbiAgfSxcbiAgZXh0ZW5kczogW1xuICAgIC8vIOS9v+eUqCB2dWUzIOaOqOiNkOeahOinhOWImVxuICAgICdwbHVnaW46dnVlL3Z1ZTMtcmVjb21tZW5kZWQnLFxuICBdLFxuICBydWxlczoge1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbFxuICAgICd2dWUvbm8tdGVtcGxhdGUta2V5JzogT0ZGLCAvLyDnpoHmraI8dGVtcGxhdGU+5Lit5L2/55Soa2V55bGe5oCnXG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsIGZvciBWdWUuanMgMy54XG4gICAgJ3Z1ZS9yZXR1cm4taW4tZW1pdHMtdmFsaWRhdG9yJzogV0FSTiwgLy8g5by65Yi25ZyoZW1pdHPpqozor4HlmajkuK3lrZjlnKjov5Tlm57or63lj6VcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmVxdWlyZS1leHBsaWNpdC1lbWl0cyc6IE9GRiwgLy8g6ZyA6KaBZW1pdHPkuK3lrprkuYnpgInpobnnlKjkuo4kZW1pdCgpXG4gICAgJ3Z1ZS92LW9uLWV2ZW50LWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlnKjmqKHmnb/kuK3nmoToh6rlrprkuYnnu4Tku7bkuIrlvLrliLbmiafooYwgdi1vbiDkuovku7blkb3lkI3moLflvI9cbiAgfSxcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKC4uLm9iamVjdHMpIHtcbiAgY29uc3QgW3RhcmdldCwgLi4uc291cmNlc10gPSBvYmplY3RzO1xuICBjb25zdCByZXN1bHQgPSBEYXRhLmRlZXBDbG9uZSh0YXJnZXQpO1xuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc291cmNlKSkge1xuICAgICAgLy8g54m55q6K5a2X5q615aSE55CGXG4gICAgICBpZiAoa2V5ID09PSAncnVsZXMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsga2V5LCB2YWx1ZSwgJ3Jlc3VsdFtrZXldJzogcmVzdWx0W2tleV0gfSk7XG4gICAgICAgIC8vIOWIneWni+S4jeWtmOWcqOaXtui1i+m7mOiupOWAvOeUqOS6juWQiOW5tlxuICAgICAgICByZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9O1xuICAgICAgICAvLyDlr7nlkITmnaHop4TliJnlpITnkIZcbiAgICAgICAgZm9yIChsZXQgW3J1bGVLZXksIHJ1bGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFsdWUpKSB7XG4gICAgICAgICAgLy8g5bey5pyJ5YC857uf5LiA5oiQ5pWw57uE5aSE55CGXG4gICAgICAgICAgbGV0IHNvdXJjZVJ1bGVWYWx1ZSA9IHJlc3VsdFtrZXldW3J1bGVLZXldID8/IFtdO1xuICAgICAgICAgIGlmICghKHNvdXJjZVJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlID0gW3NvdXJjZVJ1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOimgeWQiOW5tueahOWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGlmICghKHJ1bGVWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgICAgcnVsZVZhbHVlID0gW3J1bGVWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIOe7n+S4gOagvOW8j+WQjui/m+ihjOaVsOe7hOW+queOr+aTjeS9nFxuICAgICAgICAgIGZvciAoY29uc3QgW3ZhbEluZGV4LCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHJ1bGVWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIOWvueixoea3seWQiOW5tu+8jOWFtuS7luebtOaOpei1i+WAvFxuICAgICAgICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbCkgPT09IE9iamVjdCkge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gX09iamVjdC5kZWVwQXNzaWduKHNvdXJjZVJ1bGVWYWx1ZVt2YWxJbmRleF0gPz8ge30sIHZhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDotYvlgLzop4TliJnnu5PmnpxcbiAgICAgICAgICByZXN1bHRba2V5XVtydWxlS2V5XSA9IHNvdXJjZVJ1bGVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWtl+auteagueaNruexu+Wei+WIpOaWreWkhOeQhlxuICAgICAgLy8g5pWw57uE77ya5ou85o6lXG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAocmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyBbXSkucHVzaCguLi52YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW5a+56LGh77ya5rex5ZCI5bm2XG4gICAgICBpZiAoRGF0YS5nZXRFeGFjdFR5cGUodmFsdWUpID09PSBPYmplY3QpIHtcbiAgICAgICAgX09iamVjdC5kZWVwQXNzaWduKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8ge30sIHZhbHVlKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIOS9v+eUqOWumuWItueahOmFjee9rlxuICogQHBhcmFtIHt977ya6YWN572u6aG5XG4gKiAgICAgICAgICBiYXNl77ya5L2/55So5Z+656GAZXNsaW505a6a5Yi277yM6buY6K6kIHRydWVcbiAqICAgICAgICAgIHZ1ZVZlcnNpb27vvJp2dWXniYjmnKzvvIzlvIDlkK/lkI7pnIDopoHlronoo4UgZXNsaW50LXBsdWdpbi12dWVcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZSh7IGJhc2UgPSB0cnVlLCB2dWVWZXJzaW9uIH0gPSB7fSkge1xuICBsZXQgcmVzdWx0ID0ge307XG4gIGlmIChiYXNlKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCBiYXNlQ29uZmlnKTtcbiAgfVxuICBpZiAodnVlVmVyc2lvbiA9PSAyKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUyQ29uZmlnKTtcbiAgfSBlbHNlIGlmICh2dWVWZXJzaW9uID09IDMpIHtcbiAgICByZXN1bHQgPSBtZXJnZShyZXN1bHQsIHZ1ZTNDb25maWcpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIvLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICBiYXNlOiAnLi8nLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIC8vIOWIq+WQjVxuICAgIGFsaWFzOiB7XG4gICAgICAvLyAnQHJvb3QnOiByZXNvbHZlKF9fZGlybmFtZSksXG4gICAgICAvLyAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyDop4Tlrprop6blj5HorablkYrnmoQgY2h1bmsg5aSn5bCP44CC77yI5LulIGticyDkuLrljZXkvY3vvIlcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIgKiogMTAsXG4gICAgLy8g6Ieq5a6a5LmJ5bqV5bGC55qEIFJvbGx1cCDmiZPljIXphY3nva7jgIJcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8g5YWl5Y+j5paH5Lu25ZCNXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzL2VudHJ5LSR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5qc2A7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOWdl+aWh+S7tuWQjVxuICAgICAgICBjaHVua0ZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy8ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDotYTmupDmlofku7blkI3vvIxjc3PjgIHlm77niYfnrYlcbiAgICAgICAgYXNzZXRGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLltleHRdYDtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG4iXSwibmFtZXMiOlsiYmFzZUNvbmZpZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBYUE7QUFDTyxTQUFTLEtBQUssR0FBRztBQUN4QixFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUtEO0FBQ08sU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFO0FBQzNCLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDZjs7QUN0QkE7QUFDTyxNQUFNLElBQUksR0FBRztBQUNwQjtBQUNBLEVBQUUsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFlBQVksQ0FBQyxLQUFLLEVBQUU7QUFDdEI7QUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzNDLE1BQU0sT0FBTyxLQUFLLENBQUM7QUFDbkIsS0FBSztBQUNMLElBQUksTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRDtBQUNBLElBQUksTUFBTSxvQkFBb0IsR0FBRyxTQUFTLEtBQUssSUFBSSxDQUFDO0FBQ3BELElBQUksSUFBSSxvQkFBb0IsRUFBRTtBQUM5QjtBQUNBLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLGlDQUFpQyxHQUFHLEVBQUUsYUFBYSxJQUFJLFNBQVMsQ0FBQyxDQUFDO0FBQzVFLElBQUksSUFBSSxpQ0FBaUMsRUFBRTtBQUMzQztBQUNBLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLFNBQVMsQ0FBQyxXQUFXLENBQUM7QUFDakMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLGFBQWEsQ0FBQyxLQUFLLEVBQUU7QUFDdkI7QUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzNDLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksSUFBSSxrQ0FBa0MsR0FBRyxLQUFLLENBQUM7QUFDbkQsSUFBSSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELElBQUksT0FBTyxJQUFJLEVBQUU7QUFDakI7QUFDQSxNQUFNLElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtBQUM5QjtBQUNBLFFBQVEsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLFVBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixTQUFTLE1BQU07QUFDZixVQUFVLElBQUksa0NBQWtDLEVBQUU7QUFDbEQsWUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLFdBQVc7QUFDWCxTQUFTO0FBQ1QsUUFBUSxNQUFNO0FBQ2QsT0FBTztBQUNQLE1BQU0sSUFBSSxhQUFhLElBQUksU0FBUyxFQUFFO0FBQ3RDLFFBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDM0MsT0FBTyxNQUFNO0FBQ2IsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLFFBQVEsa0NBQWtDLEdBQUcsSUFBSSxDQUFDO0FBQ2xELE9BQU87QUFDUCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDYixLQUFLO0FBQ0wsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUNwQjtBQUNBLElBQUksSUFBSSxNQUFNLFlBQVksS0FBSyxFQUFFO0FBQ2pDLE1BQU0sSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDM0MsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMzQyxPQUFPO0FBQ1AsTUFBTSxPQUFPLE1BQU0sQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksTUFBTSxZQUFZLEdBQUcsRUFBRTtBQUMvQixNQUFNLElBQUksTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDN0IsTUFBTSxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUN6QyxRQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFDLE9BQU87QUFDUCxNQUFNLE9BQU8sTUFBTSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxNQUFNLFlBQVksR0FBRyxFQUFFO0FBQy9CLE1BQU0sSUFBSSxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDakQsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDL0MsT0FBTztBQUNQLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxFQUFFO0FBQzlDLE1BQU0sSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7QUFDMUYsUUFBUSxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7QUFDN0I7QUFDQSxVQUFVLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtBQUM3QyxZQUFZLEdBQUcsSUFBSTtBQUNuQixZQUFZLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDN0MsV0FBVyxDQUFDLENBQUM7QUFDYixTQUFTLE1BQU07QUFDZjtBQUNBLFVBQVUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25ELFNBQVM7QUFDVCxPQUFPO0FBQ1AsTUFBTSxPQUFPLE1BQU0sQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUMxRDtBQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDdkM7QUFDQSxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3RCLE1BQU0sT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNwRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksSUFBSSxZQUFZLEtBQUssRUFBRTtBQUMvQixNQUFNLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1RCxLQUFLO0FBQ0wsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssTUFBTSxFQUFFO0FBQzVDLE1BQU0sT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUs7QUFDekUsUUFBUSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDcEQsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNWLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsR0FBRztBQUNILENBQUM7O0FDbkpNLE1BQU0sUUFBUSxHQUFHO0FBQ3hCO0FBQ0EsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3BCLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0QsR0FBRztBQUNILEVBQUUsVUFBVSxDQUFDLE1BQU0sRUFBRTtBQUNyQixJQUFJLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEUsR0FBRztBQUNILENBQUM7O0FDUk0sTUFBTSxJQUFJLEdBQUc7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRTtBQUNwQixJQUFJLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO0FBQzVCLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7O0FDUEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxZQUFZLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLFNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDNUQsRUFBRSxJQUFJLEtBQUssWUFBWSxLQUFLLEVBQUU7QUFDOUIsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3RELEdBQUc7QUFDSCxFQUFFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsRUFBRSxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7QUFDNUIsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQzVFLEdBQUc7QUFDSCxFQUFFLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtBQUM1QixJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixHQUFHO0FBQ0gsRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0sT0FBTyxHQUFHO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRSxHQUFHLE9BQU8sRUFBRTtBQUNsQyxJQUFJLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ2xDO0FBQ0EsTUFBTSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUMxRixRQUFRLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRCxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxFQUFFO0FBQ3RDLElBQUksS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7QUFDbEMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUMxRixRQUFRLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUM3QjtBQUNBLFVBQVUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxNQUFNLEVBQUU7QUFDeEQsWUFBWSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7QUFDL0MsY0FBYyxHQUFHLElBQUk7QUFDckIsY0FBYyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUM3RCxhQUFhLENBQUMsQ0FBQztBQUNmLFdBQVcsTUFBTTtBQUNqQixZQUFZLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCxXQUFXO0FBQ1gsU0FBUyxNQUFNO0FBQ2Y7QUFDQSxVQUFVLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRCxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ3JCLElBQUksSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQzNELE1BQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsS0FBSztBQUNMLElBQUksSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsRCxJQUFJLElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtBQUM1QixNQUFNLE9BQU8sSUFBSSxDQUFDO0FBQ2xCLEtBQUs7QUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7QUFDMUIsSUFBSSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDckIsTUFBTSxPQUFPLFNBQVMsQ0FBQztBQUN2QixLQUFLO0FBQ0wsSUFBSSxPQUFPLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDNUQsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLGFBQWEsR0FBRyxLQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUMvRTtBQUNBLElBQUksTUFBTSxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3REO0FBQ0EsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3hCO0FBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0QsSUFBSSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMxRDtBQUNBLE1BQU0sSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUN4RCxRQUFRLFNBQVM7QUFDakIsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUM5QyxRQUFRLFNBQVM7QUFDakIsT0FBTztBQUNQO0FBQ0EsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxNQUFNLEVBQUU7QUFDaEIsTUFBTSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELE1BQU0sSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO0FBQzlCLFFBQVEsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekQsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsYUFBYSxHQUFHLEtBQUssRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ3RGO0FBQ0EsSUFBSSxNQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDdEQsSUFBSSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1QyxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN6RCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxhQUFhLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDNUY7QUFDQSxJQUFJLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUN0RCxJQUFJLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEUsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxTQUFTLEdBQUcsS0FBSyxFQUFFLFNBQVMsR0FBRyxHQUFHLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBRSxhQUFhLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDekksSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDcEI7QUFDQSxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUM3QyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUM3QyxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNsQjtBQUNBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsS0FBSyxPQUFPLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ2xIO0FBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkQsSUFBSSxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtBQUM1QixNQUFNLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2hEO0FBQ0EsTUFBTSxJQUFJLElBQUksRUFBRTtBQUNoQixRQUFRLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRCxPQUFPO0FBQ1AsS0FBSztBQUNMLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUN4QyxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQy9FLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUU7QUFDeEMsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDM0QsR0FBRztBQUNILENBQUM7O0FDeE5EO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ3BCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1BLFlBQVUsR0FBRztBQUMxQjtBQUNBLEVBQUUsR0FBRyxFQUFFO0FBQ1AsSUFBSSxPQUFPLEVBQUUsSUFBSTtBQUNqQixJQUFJLElBQUksRUFBRSxJQUFJO0FBQ2QsSUFBSSxRQUFRLEVBQUUsSUFBSTtBQUNsQixJQUFJLE1BQU0sRUFBRSxJQUFJO0FBQ2hCLEdBQUc7QUFDSDtBQUNBLEVBQUUsYUFBYSxFQUFFO0FBQ2pCLElBQUksV0FBVyxFQUFFLFFBQVE7QUFDekIsSUFBSSxVQUFVLEVBQUUsUUFBUTtBQUN4QixJQUFJLFlBQVksRUFBRTtBQUNsQixNQUFNLEdBQUcsRUFBRSxJQUFJO0FBQ2YsTUFBTSw0QkFBNEIsRUFBRSxJQUFJO0FBQ3hDLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTyxFQUFFO0FBQ1g7QUFDQSxJQUFJLG9CQUFvQjtBQUN4QixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxLQUFLLEVBQUU7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZUFBZSxFQUFFLEdBQUc7QUFDeEIsSUFBSSx1QkFBdUIsRUFBRSxHQUFHO0FBQ2hDLElBQUksVUFBVSxFQUFFLEdBQUc7QUFDbkIsSUFBSSxlQUFlLEVBQUUsSUFBSTtBQUN6QixJQUFJLGdCQUFnQixFQUFFLEdBQUc7QUFDekIsSUFBSSx1QkFBdUIsRUFBRSxHQUFHO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxnQkFBZ0IsRUFBRSxLQUFLO0FBQzNCLElBQUksdUJBQXVCLEVBQUUsSUFBSTtBQUNqQyxJQUFJLGtCQUFrQixFQUFFLEtBQUs7QUFDN0IsSUFBSSxPQUFPLEVBQUUsSUFBSTtBQUNqQixJQUFJLGdCQUFnQixFQUFFLElBQUk7QUFDMUIsSUFBSSxxQkFBcUIsRUFBRSxLQUFLO0FBQ2hDLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLGlCQUFpQixFQUFFLEtBQUs7QUFDNUIsSUFBSSxVQUFVLEVBQUUsS0FBSztBQUNyQixJQUFJLGtCQUFrQixFQUFFLElBQUk7QUFDNUIsSUFBSSxtQkFBbUIsRUFBRSxJQUFJO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxlQUFlLEVBQUUsSUFBSTtBQUN6QixJQUFJLGdCQUFnQixFQUFFLEdBQUc7QUFDekIsSUFBSSxzQkFBc0IsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLHVCQUF1QixFQUFFLElBQUk7QUFDakMsSUFBSSxlQUFlLEVBQUUsSUFBSTtBQUN6QixJQUFJLGFBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUM5RCxJQUFJLGNBQWMsRUFBRSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQztBQUM5QyxJQUFJLGVBQWUsRUFBRSxJQUFJO0FBQ3pCLElBQUksYUFBYSxFQUFFLElBQUk7QUFDdkIsSUFBSSwyQkFBMkIsRUFBRSxJQUFJO0FBQ3JDLElBQUksbUJBQW1CLEVBQUUsSUFBSTtBQUM3QixJQUFJLHdCQUF3QixFQUFFLElBQUk7QUFDbEMsSUFBSSwwQkFBMEIsRUFBRSxJQUFJO0FBQ3BDLElBQUksUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUM1QyxJQUFJLFlBQVksRUFBRSxJQUFJO0FBQ3RCLElBQUksYUFBYSxFQUFFLElBQUk7QUFDdkIsSUFBSSxpQkFBaUIsRUFBRSxJQUFJO0FBQzNCLElBQUksWUFBWSxFQUFFLElBQUk7QUFDdEIsSUFBSSx5QkFBeUIsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDN0UsSUFBSSxvQkFBb0IsRUFBRSxJQUFJO0FBQzlCLElBQUksK0JBQStCLEVBQUUsSUFBSTtBQUN6QyxJQUFJLGtDQUFrQyxFQUFFLElBQUk7QUFDNUMsSUFBSSxzQkFBc0IsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO0FBQzdFLElBQUksc0JBQXNCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO0FBQzVDLElBQUksZUFBZSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztBQUNwQyxJQUFJLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRSxDQUFDO0FBQ3RGLElBQUksTUFBTSxFQUFFLElBQUk7QUFDaEIsSUFBSSxjQUFjLEVBQUUsSUFBSTtBQUN4QixJQUFJLFlBQVksRUFBRSxJQUFJO0FBQ3RCLElBQUkscUJBQXFCLEVBQUUsSUFBSTtBQUMvQixJQUFJLDZCQUE2QixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsQ0FBQztBQUM3RyxJQUFJLGlCQUFpQixFQUFFLElBQUk7QUFDM0IsSUFBSSxpQkFBaUIsRUFBRSxJQUFJO0FBQzNCLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLGdCQUFnQixFQUFFLElBQUk7QUFDMUIsSUFBSSxzQkFBc0IsRUFBRSxJQUFJO0FBQ2hDLElBQUksc0JBQXNCLEVBQUUsSUFBSTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksZUFBZSxFQUFFLElBQUk7QUFDekIsSUFBSSx3QkFBd0IsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO0FBQ3RILElBQUksbUJBQW1CLEVBQUUsSUFBSTtBQUM3QixJQUFJLGlCQUFpQixFQUFFLElBQUk7QUFDM0IsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLElBQUksd0JBQXdCLEVBQUUsSUFBSTtBQUNsQyxJQUFJLG9CQUFvQixFQUFFLElBQUk7QUFDOUIsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLEVBQUUsRUFBRTtBQUNmLENBQUMsQ0FBQztBQUNGO0FBQ08sTUFBTSxlQUFlLEdBQUc7QUFDL0IsRUFBRSxLQUFLLEVBQUU7QUFDVDtBQUNBLElBQUksZ0NBQWdDLEVBQUUsR0FBRztBQUN6QyxJQUFJLDBCQUEwQixFQUFFLElBQUk7QUFDcEMsSUFBSSxvQkFBb0IsRUFBRSxHQUFHO0FBQzdCLElBQUksMkJBQTJCLEVBQUUsSUFBSTtBQUNyQyxJQUFJLHVCQUF1QixFQUFFLEdBQUc7QUFDaEMsSUFBSSxpQ0FBaUMsRUFBRSxJQUFJO0FBQzNDLElBQUkseUJBQXlCLEVBQUUsR0FBRztBQUNsQyxJQUFJLGlCQUFpQixFQUFFLEdBQUc7QUFDMUI7QUFDQSxJQUFJLDJCQUEyQixFQUFFLEdBQUc7QUFDcEMsSUFBSSxzQ0FBc0MsRUFBRSxHQUFHO0FBQy9DLElBQUksaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ2hFLElBQUksdUJBQXVCLEVBQUUsR0FBRztBQUNoQyxJQUFJLDZCQUE2QixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDckYsSUFBSSw0Q0FBNEMsRUFBRSxHQUFHO0FBQ3JELElBQUksc0JBQXNCLEVBQUUsR0FBRztBQUMvQixJQUFJLDBCQUEwQixFQUFFLEdBQUc7QUFDbkMsSUFBSSw2Q0FBNkMsRUFBRSxHQUFHO0FBQ3RELElBQUksa0JBQWtCLEVBQUUsR0FBRztBQUMzQixJQUFJLGdCQUFnQixFQUFFLEdBQUc7QUFDekIsSUFBSSxrQkFBa0IsRUFBRSxHQUFHO0FBQzNCO0FBQ0EsSUFBSSxlQUFlLEVBQUUsR0FBRztBQUN4QjtBQUNBLElBQUksdUJBQXVCLEVBQUUsSUFBSTtBQUNqQyxJQUFJLGtDQUFrQyxFQUFFLElBQUk7QUFDNUMsSUFBSSxtQkFBbUIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUN4RTtBQUNBLElBQUksMkJBQTJCLEVBQUUsSUFBSTtBQUNyQyxJQUFJLG1CQUFtQixFQUFFLElBQUk7QUFDN0IsSUFBSSxpQkFBaUIsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNsRSxJQUFJLGtCQUFrQixFQUFFLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDO0FBQ2xELElBQUksbUJBQW1CLEVBQUUsSUFBSTtBQUM3QixJQUFJLGlCQUFpQixFQUFFLElBQUk7QUFDM0IsSUFBSSx1QkFBdUIsRUFBRSxJQUFJO0FBQ2pDLElBQUksaUJBQWlCLEVBQUUsSUFBSTtBQUMzQixJQUFJLHFCQUFxQixFQUFFLElBQUk7QUFDL0IsSUFBSSwwQkFBMEIsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ2pGLElBQUksMEJBQTBCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO0FBQ2hELElBQUkscUJBQXFCLEVBQUUsSUFBSTtBQUMvQixJQUFJLHFCQUFxQixFQUFFLElBQUk7QUFDL0IsSUFBSSxxQkFBcUIsRUFBRSxJQUFJO0FBQy9CLElBQUksbUJBQW1CLEVBQUUsSUFBSTtBQUM3QixJQUFJLHFCQUFxQixFQUFFLElBQUk7QUFDL0IsR0FBRztBQUNILEVBQUUsU0FBUyxFQUFFO0FBQ2IsSUFBSTtBQUNKLE1BQU0sT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ3hCLE1BQU0sT0FBTyxFQUFFO0FBQ2YsUUFBUSxRQUFRLEVBQUUsR0FBRztBQUNyQixPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDLENBQUM7QUFDRjtBQUNPLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxlQUFlLEVBQUU7QUFDakQsRUFBRSxPQUFPLEVBQUU7QUFDWDtBQUNBLElBQUksd0JBQXdCO0FBQzVCLEdBQUc7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUNIO0FBQ08sTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGVBQWUsRUFBRTtBQUNqRCxFQUFFLEdBQUcsRUFBRTtBQUNQLElBQUksMkJBQTJCLEVBQUUsSUFBSTtBQUNyQyxHQUFHO0FBQ0gsRUFBRSxPQUFPLEVBQUU7QUFDWDtBQUNBLElBQUksNkJBQTZCO0FBQ2pDLEdBQUc7QUFDSCxFQUFFLEtBQUssRUFBRTtBQUNUO0FBQ0EsSUFBSSxxQkFBcUIsRUFBRSxHQUFHO0FBQzlCO0FBQ0EsSUFBSSwrQkFBK0IsRUFBRSxJQUFJO0FBQ3pDO0FBQ0EsSUFBSSw0QkFBNEIsRUFBRSxHQUFHO0FBQ3JDLElBQUksNEJBQTRCLEVBQUUsR0FBRztBQUNyQyxHQUFHO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDSSxTQUFTLEtBQUssQ0FBQyxHQUFHLE9BQU8sRUFBRTtBQUNsQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDdkMsRUFBRSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLEVBQUUsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7QUFDaEMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN2RDtBQUNBLE1BQU0sSUFBSSxHQUFHLEtBQUssT0FBTyxFQUFFO0FBQzNCO0FBQ0E7QUFDQSxRQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hDO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNoRTtBQUNBLFVBQVUsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMzRCxVQUFVLElBQUksRUFBRSxlQUFlLFlBQVksS0FBSyxDQUFDLEVBQUU7QUFDbkQsWUFBWSxlQUFlLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRCxXQUFXO0FBQ1g7QUFDQSxVQUFVLElBQUksRUFBRSxTQUFTLFlBQVksS0FBSyxDQUFDLEVBQUU7QUFDN0MsWUFBWSxTQUFTLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwQyxXQUFXO0FBQ1g7QUFDQSxVQUFVLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ25FO0FBQ0EsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssTUFBTSxFQUFFO0FBQ25ELGNBQWMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuRyxhQUFhLE1BQU07QUFDbkIsY0FBYyxlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzlDLGFBQWE7QUFDYixXQUFXO0FBQ1g7QUFDQSxVQUFVLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxlQUFlLENBQUM7QUFDakQsU0FBUztBQUNULFFBQVEsU0FBUztBQUNqQixPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO0FBQ2xDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUN6RCxRQUFRLFNBQVM7QUFDakIsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssTUFBTSxFQUFFO0FBQy9DLFFBQVEsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRSxRQUFRLFNBQVM7QUFDakIsT0FBTztBQUNQO0FBQ0EsTUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzFCLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ3RELEVBQUUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLEVBQUUsSUFBSSxJQUFJLEVBQUU7QUFDWixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFQSxZQUFVLENBQUMsQ0FBQztBQUN2QyxHQUFHO0FBQ0gsRUFBRSxJQUFJLFVBQVUsSUFBSSxDQUFDLEVBQUU7QUFDdkIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2QyxHQUFHLE1BQU0sSUFBSSxVQUFVLElBQUksQ0FBQyxFQUFFO0FBQzlCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7QUFDaEI7Ozs7Ozs7Ozs7Ozs7OztBQ2hTQTtBQUNPLE1BQU0sVUFBVSxHQUFHO0FBQzFCLEVBQUUsSUFBSSxFQUFFLElBQUk7QUFDWixFQUFFLE1BQU0sRUFBRTtBQUNWLElBQUksSUFBSSxFQUFFLFNBQVM7QUFDbkIsSUFBSSxFQUFFLEVBQUU7QUFDUixNQUFNLE1BQU0sRUFBRSxLQUFLO0FBQ25CLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxPQUFPLEVBQUU7QUFDWDtBQUNBLElBQUksS0FBSyxFQUFFO0FBQ1g7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxLQUFLLEVBQUU7QUFDVDtBQUNBLElBQUkscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLEVBQUU7QUFDbEM7QUFDQSxJQUFJLGFBQWEsRUFBRTtBQUNuQixNQUFNLE1BQU0sRUFBRTtBQUNkO0FBQ0EsUUFBUSxjQUFjLENBQUMsU0FBUyxFQUFFO0FBQ2xDLFVBQVUsT0FBTyxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVELFNBQVM7QUFDVDtBQUNBLFFBQVEsY0FBYyxDQUFDLFNBQVMsRUFBRTtBQUNsQyxVQUFVLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN0RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLGNBQWMsQ0FBQyxTQUFTLEVBQUU7QUFDbEMsVUFBVSxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDekQsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7Ozs7Ozs7OzsifQ==
