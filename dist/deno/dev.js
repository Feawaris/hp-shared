/*!
 * hp-shared v0.2.1
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"esm","sourcemap":"inline"}
 */
  
// 处理多格式数据用
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

// 增加部分命名以接近数学写法
Math.asin.bind(Math);
Math.acos.bind(Math);
Math.atan.bind(Math);
Math.asinh.bind(Math);
Math.acosh.bind(Math);
Math.atanh.bind(Math);
Math.log.bind(Math);
Math.log10.bind(Math);

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

export { eslint, vite };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2LmpzIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9EYXRhLmpzIiwiLi4vLi4vc3JjL2Jhc2UvX01hdGguanMiLCIuLi8uLi9zcmMvYmFzZS9fT2JqZWN0LmpzIiwiLi4vLi4vc3JjL2Rldi9lc2xpbnQuanMiLCIuLi8uLi9zcmMvZGV2L3ZpdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8g5aSE55CG5aSa5qC85byP5pWw5o2u55SoXG5pbXBvcnQgeyBGQUxTRSwgUkFXIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vLyDnroDljZXnsbvlnotcbmV4cG9ydCBjb25zdCBTSU1QTEVfVFlQRVMgPSBbbnVsbCwgdW5kZWZpbmVkLCBOdW1iZXIsIFN0cmluZywgQm9vbGVhbiwgQmlnSW50LCBTeW1ib2xdO1xuLyoqXG4gKiDojrflj5blgLznmoTlhbfkvZPnsbvlnotcbiAqIEBwYXJhbSB2YWx1ZSB7Kn0g5YC8XG4gKiBAcmV0dXJucyB7T2JqZWN0Q29uc3RydWN0b3J8KnxGdW5jdGlvbn0g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWw44CCbnVsbOOAgXVuZGVmaW5lZCDljp/moLfov5Tlm55cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEV4YWN0VHlwZSh2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWOn+agt+i/lOWbnlxuICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGNvbnN0IF9fcHJvdG9fXyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gIC8vIHZhbHVlIOS4uiBPYmplY3QucHJvdG90eXBlIOaIliBPYmplY3QuY3JlYXRlKG51bGwpIOaWueW8j+WjsOaYjueahOWvueixoeaXtiBfX3Byb3RvX18g5Li6IG51bGxcbiAgY29uc3QgaXNPYmplY3RCeUNyZWF0ZU51bGwgPSBfX3Byb3RvX18gPT09IG51bGw7XG4gIGlmIChpc09iamVjdEJ5Q3JlYXRlTnVsbCkge1xuICAgIC8vIGNvbnNvbGUud2FybignaXNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgIHJldHVybiBPYmplY3Q7XG4gIH1cbiAgLy8g5a+55bqU57un5om/55qE5a+56LGhIF9fcHJvdG9fXyDmsqHmnIkgY29uc3RydWN0b3Ig5bGe5oCnXG4gIGNvbnN0IGlzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9ICEoJ2NvbnN0cnVjdG9yJyBpbiBfX3Byb3RvX18pO1xuICBpZiAoaXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgLy8gY29uc29sZS53YXJuKCdpc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwnLCBfX3Byb3RvX18pO1xuICAgIHJldHVybiBPYmplY3Q7XG4gIH1cbiAgLy8g6L+U5Zue5a+55bqU5p6E6YCg5Ye95pWwXG4gIHJldHVybiBfX3Byb3RvX18uY29uc3RydWN0b3I7XG59XG4vKipcbiAqIOiOt+WPluWAvOeahOWFt+S9k+exu+Wei+WIl+ihqFxuICogQHBhcmFtIHZhbHVlIHsqfSDlgLxcbiAqIEByZXR1cm5zIHsqW119IOe7n+S4gOi/lOWbnuaVsOe7hOOAgm51bGzjgIF1bmRlZmluZWQg5a+55bqU5Li6IFtudWxsXSxbdW5kZWZpbmVkXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXhhY3RUeXBlcyh2YWx1ZSkge1xuICAvLyBudWxs44CBdW5kZWZpbmVkIOWIpOaWreWkhOeQhlxuICBpZiAoW251bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgcmV0dXJuIFt2YWx1ZV07XG4gIH1cbiAgLy8g5omr5Y6f5Z6L6ZO+5b6X5Yiw5a+55bqU5p6E6YCg5Ye95pWwXG4gIGxldCByZXN1bHQgPSBbXTtcbiAgbGV0IGxvb3AgPSAwO1xuICBsZXQgaGFzT2JqZWN0RXh0ZW5kc09iamVjdEJ5Q3JlYXRlTnVsbCA9IGZhbHNlO1xuICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICAvLyBjb25zb2xlLndhcm4oJ3doaWxlJywgbG9vcCwgX19wcm90b19fKTtcbiAgICBpZiAoX19wcm90b19fID09PSBudWxsKSB7XG4gICAgICAvLyDkuIDov5vmnaUgX19wcm90b19fIOWwseaYryBudWxsIOivtOaYjiB2YWx1ZSDkuLogT2JqZWN0LnByb3RvdHlwZSDmiJYgT2JqZWN0LmNyZWF0ZShudWxsKSDmlrnlvI/lo7DmmI7nmoTlr7nosaFcbiAgICAgIGlmIChsb29wIDw9IDApIHtcbiAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChoYXNPYmplY3RFeHRlbmRzT2JqZWN0QnlDcmVhdGVOdWxsKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICgnY29uc3RydWN0b3InIGluIF9fcHJvdG9fXykge1xuICAgICAgcmVzdWx0LnB1c2goX19wcm90b19fLmNvbnN0cnVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goT2JqZWN0KTtcbiAgICAgIGhhc09iamVjdEV4dGVuZHNPYmplY3RCeUNyZWF0ZU51bGwgPSB0cnVlO1xuICAgIH1cbiAgICBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX19wcm90b19fKTtcbiAgICBsb29wKys7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICog5rex5ou36LSd5pWw5o2uXG4gKiBAcGFyYW0gc291cmNlIHsqfVxuICogQHJldHVybnMge01hcDxhbnksIGFueT58U2V0PGFueT58e318KnwqW119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ2xvbmUoc291cmNlKSB7XG4gIC8vIOaVsOe7hFxuICBpZiAoc291cmNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGRlZXBDbG9uZSh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8vIFNldFxuICBpZiAoc291cmNlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCB2YWx1ZSBvZiBzb3VyY2UudmFsdWVzKCkpIHtcbiAgICAgIHJlc3VsdC5hZGQoZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gTWFwXG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBNYXApIHtcbiAgICBsZXQgcmVzdWx0ID0gbmV3IE1hcCgpO1xuICAgIGZvciAobGV0IFtrZXksIHZhbHVlXSBvZiBzb3VyY2UuZW50cmllcygpKSB7XG4gICAgICByZXN1bHQuc2V0KGtleSwgZGVlcENsb25lKHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g5a+56LGhXG4gIGlmIChnZXRFeGFjdFR5cGUoc291cmNlKSA9PT0gT2JqZWN0KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgLy8gdmFsdWXmlrnlvI/vvJrpgJLlvZLlpITnkIZcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCB7XG4gICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICB2YWx1ZTogZGVlcENsb25lKGRlc2MudmFsdWUpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGdldC9zZXQg5pa55byP77ya55u05o6l5a6a5LmJXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXN1bHQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8g5YW25LuW77ya5Y6f5qC36L+U5ZueXG4gIHJldHVybiBzb3VyY2U7XG59XG4vKipcbiAqIOa3seino+WMheaVsOaNrlxuICogQHBhcmFtIGRhdGEgeyp9IOWAvFxuICogQHBhcmFtIGlzV3JhcCB7ZnVuY3Rpb259IOWMheijheaVsOaNruWIpOaWreWHveaVsO+8jOWmgnZ1ZTPnmoRpc1JlZuWHveaVsFxuICogQHBhcmFtIHVud3JhcCB7ZnVuY3Rpb259IOino+WMheaWueW8j+WHveaVsO+8jOWmgnZ1ZTPnmoR1bnJlZuWHveaVsFxuICogQHJldHVybnMgeygqfHtbcDogc3RyaW5nXTogYW55fSlbXXwqfHtbcDogc3RyaW5nXTogYW55fXx7W3A6IHN0cmluZ106ICp8e1twOiBzdHJpbmddOiBhbnl9fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBVbndyYXAoZGF0YSwgeyBpc1dyYXAgPSBGQUxTRSwgdW53cmFwID0gUkFXIH0gPSB7fSkge1xuICAvLyDpgInpobnmlLbpm4ZcbiAgY29uc3Qgb3B0aW9ucyA9IHsgaXNXcmFwLCB1bndyYXAgfTtcbiAgLy8g5YyF6KOF57G75Z6L77yI5aaCdnVlM+WTjeW6lOW8j+Wvueixoe+8ieaVsOaNruino+WMhVxuICBpZiAoaXNXcmFwKGRhdGEpKSB7XG4gICAgcmV0dXJuIGRlZXBVbndyYXAodW53cmFwKGRhdGEpLCBvcHRpb25zKTtcbiAgfVxuICAvLyDpgJLlvZLlpITnkIbnmoTnsbvlnotcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBkYXRhLm1hcCh2YWwgPT4gZGVlcFVud3JhcCh2YWwsIG9wdGlvbnMpKTtcbiAgfVxuICBpZiAoZ2V0RXhhY3RUeXBlKGRhdGEpID09PSBPYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGRhdGEpLm1hcCgoW2tleSwgdmFsXSkgPT4ge1xuICAgICAgcmV0dXJuIFtrZXksIGRlZXBVbndyYXAodmFsLCBvcHRpb25zKV07XG4gICAgfSkpO1xuICB9XG4gIC8vIOWFtuS7luWOn+agt+i/lOWbnlxuICByZXR1cm4gZGF0YTtcbn1cbiIsIi8vIOWinuWKoOmDqOWIhuWRveWQjeS7peaOpei/keaVsOWtpuWGmeazlVxuZXhwb3J0IGNvbnN0IGFyY3NpbiA9IE1hdGguYXNpbi5iaW5kKE1hdGgpO1xuZXhwb3J0IGNvbnN0IGFyY2NvcyA9IE1hdGguYWNvcy5iaW5kKE1hdGgpO1xuZXhwb3J0IGNvbnN0IGFyY3RhbiA9IE1hdGguYXRhbi5iaW5kKE1hdGgpO1xuZXhwb3J0IGNvbnN0IGFyc2luaCA9IE1hdGguYXNpbmguYmluZChNYXRoKTtcbmV4cG9ydCBjb25zdCBhcmNvc2ggPSBNYXRoLmFjb3NoLmJpbmQoTWF0aCk7XG5leHBvcnQgY29uc3QgYXJ0YW5oID0gTWF0aC5hdGFuaC5iaW5kKE1hdGgpO1xuZXhwb3J0IGNvbnN0IGxvZ2UgPSBNYXRoLmxvZy5iaW5kKE1hdGgpO1xuZXhwb3J0IGNvbnN0IGxuID0gbG9nZTtcbmV4cG9ydCBjb25zdCBsZyA9IE1hdGgubG9nMTAuYmluZChNYXRoKTtcbmV4cG9ydCBmdW5jdGlvbiBsb2coYSwgeCkge1xuICByZXR1cm4gTWF0aC5sb2coeCkgLyBNYXRoLmxvZyhhKTtcbn1cbiIsImltcG9ydCB7IGFkZCB9IGZyb20gJy4vX1NldCc7XG5pbXBvcnQgeyBvd25FbnRyaWVzIH0gZnJvbSAnLi9fUmVmbGVjdCc7XG5pbXBvcnQgeyBnZXRFeGFjdFR5cGUgfSBmcm9tICcuL0RhdGEnO1xuXG4vKipcbiAqIOWxnuaAp+WQjee7n+S4gOaIkOaVsOe7hOagvOW8j1xuICogQHBhcmFtIG5hbWVzIHtzdHJpbmd8U3ltYm9sfGFycmF5fSDlsZ7mgKflkI3jgILmoLzlvI8gJ2EsYixjJyDmiJYgWydhJywnYicsJ2MnXVxuICogQHBhcmFtIHNlcGFyYXRvciB7c3RyaW5nfFJlZ0V4cH0gbmFtZXMg5Li65a2X56ym5Liy5pe255qE5ouG5YiG6KeE5YiZ44CC5ZCMIHNwbGl0IOaWueazleeahCBzZXBhcmF0b3LvvIzlrZfnrKbkuLLml6DpnIDmi4bliIbnmoTlj6/ku6XkvKAgbnVsbCDmiJYgdW5kZWZpbmVkXG4gKiBAcmV0dXJucyB7KltdW118KE1hZ2ljU3RyaW5nIHwgQnVuZGxlIHwgc3RyaW5nKVtdfEZsYXRBcnJheTwoRmxhdEFycmF5PCgqfFsqW11dfFtdKVtdLCAxPltdfCp8WypbXV18W10pW10sIDE+W118KltdfVxuICovXG5mdW5jdGlvbiBuYW1lc1RvQXJyYXkobmFtZXMgPSBbXSwgeyBzZXBhcmF0b3IgPSAnLCcgfSA9IHt9KSB7XG4gIGlmIChuYW1lcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIG5hbWVzLm1hcCh2YWwgPT4gbmFtZXNUb0FycmF5KHZhbCkpLmZsYXQoKTtcbiAgfVxuICBjb25zdCBleGFjdFR5cGUgPSBnZXRFeGFjdFR5cGUobmFtZXMpO1xuICBpZiAoZXhhY3RUeXBlID09PSBTdHJpbmcpIHtcbiAgICByZXR1cm4gbmFtZXMuc3BsaXQoc2VwYXJhdG9yKS5tYXAodmFsID0+IHZhbC50cmltKCkpLmZpbHRlcih2YWwgPT4gdmFsKTtcbiAgfVxuICBpZiAoZXhhY3RUeXBlID09PSBTeW1ib2wpIHtcbiAgICByZXR1cm4gW25hbWVzXTtcbiAgfVxuICByZXR1cm4gW107XG59XG4vLyBjb25zb2xlLmxvZyhuYW1lc1RvQXJyYXkoU3ltYm9sKCkpKTtcbi8vIGNvbnNvbGUubG9nKG5hbWVzVG9BcnJheShbJ2EnLCAnYicsICdjJywgU3ltYm9sKCldKSk7XG4vLyBjb25zb2xlLmxvZyhuYW1lc1RvQXJyYXkoJ2EsYixjJykpO1xuLy8gY29uc29sZS5sb2cobmFtZXNUb0FycmF5KFsnYSxiLGMnLCBTeW1ib2woKV0pKTtcblxuLyoqXG4gKiDmtYXlkIjlubblr7nosaHjgILlhpnms5XlkIwgT2JqZWN0LmFzc2lnblxuICog6YCa6L+H6YeN5a6a5LmJ5pa55byP5ZCI5bm277yM6Kej5YazIE9iamVjdC5hc3NpZ24g5ZCI5bm25Lik6L655ZCM5ZCN5bGe5oCn5re35pyJIHZhbHVl5YaZ5rOVIOWSjCBnZXQvc2V05YaZ5rOVIOaXtuaKpSBUeXBlRXJyb3I6IENhbm5vdCBzZXQgcHJvcGVydHkgYiBvZiAjPE9iamVjdD4gd2hpY2ggaGFzIG9ubHkgYSBnZXR0ZXIg55qE6Zeu6aKYXG4gKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoVxuICogQHBhcmFtIHNvdXJjZXMge2FueVtdfSDmlbDmja7mupDjgILkuIDkuKrmiJblpJrkuKrlr7nosaFcbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzaWduKHRhcmdldCA9IHt9LCAuLi5zb3VyY2VzKSB7XG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICAvLyDkuI3kvb/nlKggdGFyZ2V0W2tleV09dmFsdWUg5YaZ5rOV77yM55u05o6l5L2/55SoZGVzY+mHjeWumuS5iVxuICAgIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2YgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG4vKipcbiAqIOa3seWQiOW5tuWvueixoeOAguWQjCBhc3NpZ24g5LiA5qC35Lmf5Lya5a+55bGe5oCn6L+b6KGM6YeN5a6a5LmJXG4gKiBAcGFyYW0gdGFyZ2V0IHtvYmplY3R9IOebruagh+WvueixoeOAgum7mOiupOWAvCB7fSDpmLLmraLpgJLlvZLml7bmiqUgVHlwZUVycm9yOiBPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3RcbiAqIEBwYXJhbSBzb3VyY2VzIHthbnlbXX0g5pWw5o2u5rqQ44CC5LiA5Liq5oiW5aSa5Liq5a+56LGhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQXNzaWduKHRhcmdldCA9IHt9LCAuLi5zb3VyY2VzKSB7XG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICBmb3IgKGNvbnN0IFtrZXksIGRlc2NdIG9mIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpKSB7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7XG4gICAgICAgIC8vIHZhbHVl5YaZ5rOV77ya5a+56LGh6YCS5b2S5aSE55CG77yM5YW25LuW55u05o6l5a6a5LmJXG4gICAgICAgIGlmIChnZXRFeGFjdFR5cGUoZGVzYy52YWx1ZSkgPT09IE9iamVjdCkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuICAgICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICAgIHZhbHVlOiBkZWVwQXNzaWduKHRhcmdldFtrZXldLCBkZXNjLnZhbHVlKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBnZXQvc2V05YaZ5rOV77ya55u05o6l5a6a5LmJXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG4vKipcbiAqIGtleeiHqui6q+aJgOWxnueahOWvueixoVxuICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAqIEBwYXJhbSBrZXkge3N0cmluZ3xTeW1ib2x9IOWxnuaAp+WQjVxuICogQHJldHVybnMgeyp8bnVsbH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG93bmVyKG9iamVjdCwga2V5KSB7XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBsZXQgX19wcm90b19fID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gIGlmIChfX3Byb3RvX18gPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gb3duZXIoX19wcm90b19fLCBrZXkpO1xufVxuLyoqXG4gKiDojrflj5blsZ7mgKfmj4/ov7Dlr7nosaHvvIznm7jmr5QgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcu+8jOiDveaLv+WIsOe7p+aJv+WxnuaAp+eahOaPj+i/sOWvueixoVxuICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fVxuICogQHBhcmFtIGtleSB7c3RyaW5nfFN5bWJvbH1cbiAqIEByZXR1cm5zIHtQcm9wZXJ0eURlc2NyaXB0b3J9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmlwdG9yKG9iamVjdCwga2V5KSB7XG4gIGNvbnN0IGZpbmRPYmplY3QgPSBvd25lcihvYmplY3QsIGtleSk7XG4gIGlmICghZmluZE9iamVjdCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZmluZE9iamVjdCwga2V5KTtcbn1cbi8qKlxuICog6I635Y+W5bGe5oCn5ZCN44CC6buY6K6k5Y+C5pWw6YWN572u5oiQ5ZCMIE9iamVjdC5rZXlzIOihjOS4ulxuICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAqIEBwYXJhbSBzeW1ib2wge2Jvb2xlYW59IOaYr+WQpuWMheWQqyBzeW1ib2wg5bGe5oCnXG4gKiBAcGFyYW0gbm90RW51bWVyYWJsZSB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5LiN5Y+v5YiX5Li+5bGe5oCnXG4gKiBAcGFyYW0gZXh0ZW5kIHtib29sZWFufSDmmK/lkKbljIXlkKvmib/nu6flsZ7mgKdcbiAqIEByZXR1cm5zIHthbnlbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGtleXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAvLyDpgInpobnmlLbpm4ZcbiAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgLy8gc2V055So5LqOa2V55Y676YeNXG4gIGxldCBzZXQgPSBuZXcgU2V0KCk7XG4gIC8vIOiHqui6q+WxnuaAp+etm+mAiVxuICBjb25zdCBkZXNjcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCk7XG4gIGZvciAoY29uc3QgW2tleSwgZGVzY10gb2Ygb3duRW50cmllcyhkZXNjcykpIHtcbiAgICAvLyDlv73nlaVzeW1ib2zlsZ7mgKfnmoTmg4XlhrVcbiAgICBpZiAoIXN5bWJvbCAmJiBnZXRFeGFjdFR5cGUoa2V5KSA9PT0gU3ltYm9sKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy8g5b+955Wl5LiN5Y+v5YiX5Li+5bGe5oCn55qE5oOF5Ya1XG4gICAgaWYgKCFub3RFbnVtZXJhYmxlICYmICFkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvLyDlhbbku5blsZ7mgKfliqDlhaVcbiAgICBzZXQuYWRkKGtleSk7XG4gIH1cbiAgLy8g57un5om/5bGe5oCnXG4gIGlmIChleHRlbmQpIHtcbiAgICBjb25zdCBfX3Byb3RvX18gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAoX19wcm90b19fICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBwYXJlbnRLZXlzID0ga2V5cyhfX3Byb3RvX18sIG9wdGlvbnMpO1xuICAgICAgYWRkKHNldCwgLi4ucGFyZW50S2V5cyk7XG4gICAgfVxuICB9XG4gIC8vIOi/lOWbnuaVsOe7hFxuICByZXR1cm4gQXJyYXkuZnJvbShzZXQpO1xufVxuLyoqXG4gKiDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvcnPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0gc3ltYm9sIHtib29sZWFufSDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gKiBAcmV0dXJucyB7UHJvcGVydHlEZXNjcmlwdG9yW119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmlwdG9ycyhvYmplY3QsIHsgc3ltYm9sID0gZmFsc2UsIG5vdEVudW1lcmFibGUgPSBmYWxzZSwgZXh0ZW5kID0gZmFsc2UgfSA9IHt9KSB7XG4gIC8vIOmAiemhueaUtumbhlxuICBjb25zdCBvcHRpb25zID0geyBzeW1ib2wsIG5vdEVudW1lcmFibGUsIGV4dGVuZCB9O1xuICBjb25zdCBfa2V5cyA9IGtleXMob2JqZWN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIF9rZXlzLm1hcChrZXkgPT4gZGVzY3JpcHRvcihvYmplY3QsIGtleSkpO1xufVxuLyoqXG4gKiDlr7nlupQga2V5cyDojrflj5YgZGVzY3JpcHRvckVudHJpZXPvvIzkvKDlj4LlkIwga2V5cyDmlrnms5XjgILlj6/nlKjkuo7ph43lrprkuYnlsZ7mgKdcbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0gc3ltYm9sIHtib29sZWFufSDmmK/lkKbljIXlkKsgc3ltYm9sIOWxnuaAp1xuICogQHBhcmFtIG5vdEVudW1lcmFibGUge2Jvb2xlYW59IOaYr+WQpuWMheWQq+S4jeWPr+WIl+S4vuWxnuaAp1xuICogQHBhcmFtIGV4dGVuZCB7Ym9vbGVhbn0g5piv5ZCm5YyF5ZCr5om/57un5bGe5oCnXG4gKiBAcmV0dXJucyB7W3N0cmluZ3xTeW1ib2wsUHJvcGVydHlEZXNjcmlwdG9yXVtdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzY3JpcHRvckVudHJpZXMob2JqZWN0LCB7IHN5bWJvbCA9IGZhbHNlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IGZhbHNlIH0gPSB7fSkge1xuICAvLyDpgInpobnmlLbpm4ZcbiAgY29uc3Qgb3B0aW9ucyA9IHsgc3ltYm9sLCBub3RFbnVtZXJhYmxlLCBleHRlbmQgfTtcbiAgY29uc3QgX2tleXMgPSBrZXlzKG9iamVjdCwgb3B0aW9ucyk7XG4gIHJldHVybiBfa2V5cy5tYXAoa2V5ID0+IFtrZXksIGRlc2NyaXB0b3Iob2JqZWN0LCBrZXkpXSk7XG59XG4vKipcbiAqIOmAieWPluWvueixoVxuICogQHBhcmFtIG9iamVjdCB7b2JqZWN0fSDlr7nosaFcbiAqIEBwYXJhbSBwaWNrIHtzdHJpbmd8YXJyYXl9IOaMkemAieWxnuaAp1xuICogQHBhcmFtIG9taXQge3N0cmluZ3xhcnJheX0g5b+955Wl5bGe5oCnXG4gKiBAcGFyYW0gZW1wdHlQaWNrIHtzdHJpbmd9IHBpY2sg5Li656m65pe255qE5Y+W5YC844CCYWxsIOWFqOmDqGtlee+8jGVtcHR5IOepulxuICogQHBhcmFtIHNlcGFyYXRvciB7c3RyaW5nfFJlZ0V4cH0g5ZCMIG5hbWVzVG9BcnJheSDnmoQgc2VwYXJhdG9yIOWPguaVsFxuICogQHBhcmFtIHN5bWJvbCB7Ym9vbGVhbn0g5ZCMIGtleXMg55qEIHN5bWJvbCDlj4LmlbBcbiAqIEBwYXJhbSBub3RFbnVtZXJhYmxlIHtib29sZWFufSDlkIwga2V5cyDnmoQgbm90RW51bWVyYWJsZSDlj4LmlbBcbiAqIEBwYXJhbSBleHRlbmQge2Jvb2xlYW59IOWQjCBrZXlzIOeahCBleHRlbmQg5Y+C5pWwXG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXIob2JqZWN0LCB7IHBpY2sgPSBbXSwgb21pdCA9IFtdLCBlbXB0eVBpY2sgPSAnYWxsJywgc2VwYXJhdG9yID0gJywnLCBzeW1ib2wgPSB0cnVlLCBub3RFbnVtZXJhYmxlID0gZmFsc2UsIGV4dGVuZCA9IHRydWUgfSA9IHt9KSB7XG4gIGxldCByZXN1bHQgPSB7fTtcbiAgLy8gcGlja+OAgW9taXQg57uf5LiA5oiQ5pWw57uE5qC85byPXG4gIHBpY2sgPSBuYW1lc1RvQXJyYXkocGljaywgeyBzZXBhcmF0b3IgfSk7XG4gIG9taXQgPSBuYW1lc1RvQXJyYXkob21pdCwgeyBzZXBhcmF0b3IgfSk7XG4gIGxldCBfa2V5cyA9IFtdO1xuICAvLyBwaWNr5pyJ5YC855u05o6l5ou/77yM5Li656m65pe25qC55o2uIGVtcHR5UGljayDpu5jorqTmi7/nqbrmiJblhajpg6hrZXlcbiAgX2tleXMgPSBwaWNrLmxlbmd0aCA+IDAgfHwgZW1wdHlQaWNrID09PSAnZW1wdHknID8gcGljayA6IGtleXMob2JqZWN0LCB7IHN5bWJvbCwgbm90RW51bWVyYWJsZSwgZXh0ZW5kIH0pO1xuICAvLyBvbWl0562b6YCJXG4gIF9rZXlzID0gX2tleXMuZmlsdGVyKGtleSA9PiAhb21pdC5pbmNsdWRlcyhrZXkpKTtcbiAgZm9yIChjb25zdCBrZXkgb2YgX2tleXMpIHtcbiAgICBjb25zdCBkZXNjID0gZGVzY3JpcHRvcihvYmplY3QsIGtleSk7XG4gICAgLy8g5bGe5oCn5LiN5a2Y5Zyo5a+86Ie0ZGVzY+W+l+WIsHVuZGVmaW5lZOaXtuS4jeiuvue9ruWAvFxuICAgIGlmIChkZXNjKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2MpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDpgJrov4fmjJHpgInmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXLnmoTnroDlhpnmlrnlvI9cbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0ga2V5cyB7c3RyaW5nfGFycmF5fSDlsZ7mgKflkI3pm4blkIhcbiAqIEBwYXJhbSBvcHRpb25zIHtvYmplY3R9IOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrKG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIGZpbHRlcihvYmplY3QsIHsgcGljazoga2V5cywgZW1wdHlQaWNrOiAnZW1wdHknLCAuLi5vcHRpb25zIH0pO1xufVxuLyoqXG4gKiDpgJrov4fmjpLpmaTmlrnlvI/pgInlj5blr7nosaHjgIJmaWx0ZXLnmoTnroDlhpnmlrnlvI9cbiAqIEBwYXJhbSBvYmplY3Qge29iamVjdH0g5a+56LGhXG4gKiBAcGFyYW0ga2V5cyB7c3RyaW5nfGFycmF5fSDlsZ7mgKflkI3pm4blkIhcbiAqIEBwYXJhbSBvcHRpb25zIHtvYmplY3R9IOmAiemhue+8jOWQjCBmaWx0ZXIg55qE5ZCE6YCJ6aG55YC8XG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbWl0KG9iamVjdCwga2V5cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIGZpbHRlcihvYmplY3QsIHsgb21pdDoga2V5cywgLi4ub3B0aW9ucyB9KTtcbn1cbiIsIi8qKlxuICogZXNsaW50IOmFjee9ru+8mmh0dHA6Ly9lc2xpbnQuY24vZG9jcy9ydWxlcy9cbiAqIGVzbGludC1wbHVnaW4tdnVlIOmFjee9ru+8mmh0dHBzOi8vZXNsaW50LnZ1ZWpzLm9yZy9ydWxlcy9cbiAqL1xuaW1wb3J0IHsgX09iamVjdCwgRGF0YSB9IGZyb20gJy4uL2Jhc2UnO1xuXG4vKipcbiAqIOWvvOWHuuW4uOmHj+S+v+aNt+S9v+eUqFxuICovXG5leHBvcnQgY29uc3QgT0ZGID0gJ29mZic7XG5leHBvcnQgY29uc3QgV0FSTiA9ICd3YXJuJztcbmV4cG9ydCBjb25zdCBFUlJPUiA9ICdlcnJvcic7XG4vKipcbiAqIOWumuWItueahOmFjee9rlxuICovXG4vLyDln7rnoYDlrprliLZcbmV4cG9ydCBjb25zdCBiYXNlQ29uZmlnID0ge1xuICAvLyDnjq/looPjgILkuIDkuKrnjq/looPlrprkuYnkuobkuIDnu4TpooTlrprkuYnnmoTlhajlsYDlj5jph49cbiAgZW52OiB7XG4gICAgYnJvd3NlcjogdHJ1ZSxcbiAgICBub2RlOiB0cnVlLFxuICB9LFxuICAvLyDop6PmnpDlmahcbiAgcGFyc2VyT3B0aW9uczoge1xuICAgIGVjbWFWZXJzaW9uOiAnbGF0ZXN0JyxcbiAgICBzb3VyY2VUeXBlOiAnbW9kdWxlJyxcbiAgICBlY21hRmVhdHVyZXM6IHtcbiAgICAgIGpzeDogdHJ1ZSxcbiAgICAgIGV4cGVyaW1lbnRhbE9iamVjdFJlc3RTcHJlYWQ6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgLyoqXG4gICAqIOe7p+aJv1xuICAgKiDkvb/nlKhlc2xpbnTnmoTop4TliJnvvJplc2xpbnQ66YWN572u5ZCN56ewXG4gICAqIOS9v+eUqOaPkuS7tueahOmFjee9ru+8mnBsdWdpbjrljIXlkI3nroDlhpkv6YWN572u5ZCN56ewXG4gICAqL1xuICBleHRlbmRzOiBbXG4gICAgLy8g5L2/55SoIGVzbGludCDmjqjojZDnmoTop4TliJlcbiAgICAnZXNsaW50OnJlY29tbWVuZGVkJyxcbiAgXSxcbiAgLyoqXG4gICAqIOinhOWImVxuICAgKiDmnaXoh6ogZXNsaW50IOeahOinhOWIme+8muinhOWImUlEIDogdmFsdWVcbiAgICog5p2l6Ieq5o+S5Lu255qE6KeE5YiZ77ya5YyF5ZCN566A5YaZL+inhOWImUlEIDogdmFsdWVcbiAgICovXG4gIHJ1bGVzOiB7XG4gICAgLyoqXG4gICAgICogUG9zc2libGUgRXJyb3JzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5LiOIEphdmFTY3JpcHQg5Luj56CB5Lit5Y+v6IO955qE6ZSZ6K+v5oiW6YC76L6R6ZSZ6K+v5pyJ5YWz77yaXG4gICAgICovXG4gICAgJ2dldHRlci1yZXR1cm4nOiBPRkYsIC8vIOW8uuWItiBnZXR0ZXIg5Ye95pWw5Lit5Ye6546wIHJldHVybiDor63lj6VcbiAgICAnbm8tY29uc3RhbnQtY29uZGl0aW9uJzogT0ZGLCAvLyDnpoHmraLlnKjmnaHku7bkuK3kvb/nlKjluLjph4/ooajovr7lvI9cbiAgICAnbm8tZW1wdHknOiBPRkYsIC8vIOemgeatouWHuueOsOepuuivreWPpeWdl1xuICAgICduby1leHRyYS1zZW1pJzogV0FSTiwgLy8g56aB5q2i5LiN5b+F6KaB55qE5YiG5Y+3XG4gICAgJ25vLWZ1bmMtYXNzaWduJzogT0ZGLCAvLyDnpoHmraLlr7kgZnVuY3Rpb24g5aOw5piO6YeN5paw6LWL5YC8XG4gICAgJ25vLXByb3RvdHlwZS1idWlsdGlucyc6IE9GRiwgLy8g56aB5q2i55u05o6l6LCD55SoIE9iamVjdC5wcm90b3R5cGVzIOeahOWGhee9ruWxnuaAp1xuXG4gICAgLyoqXG4gICAgICogQmVzdCBQcmFjdGljZXNcbiAgICAgKiDov5nkupvop4TliJnmmK/lhbPkuo7mnIDkvbPlrp7ot7XnmoTvvIzluK7liqnkvaDpgb/lhY3kuIDkupvpl67popjvvJpcbiAgICAgKi9cbiAgICAnYWNjZXNzb3ItcGFpcnMnOiBFUlJPUiwgLy8g5by65Yi2IGdldHRlciDlkowgc2V0dGVyIOWcqOWvueixoeS4reaIkOWvueWHuueOsFxuICAgICdhcnJheS1jYWxsYmFjay1yZXR1cm4nOiBXQVJOLCAvLyDlvLrliLbmlbDnu4Tmlrnms5XnmoTlm57osIPlh73mlbDkuK3mnIkgcmV0dXJuIOivreWPpVxuICAgICdibG9jay1zY29wZWQtdmFyJzogRVJST1IsIC8vIOW8uuWItuaKiuWPmOmHj+eahOS9v+eUqOmZkOWItuWcqOWFtuWumuS5ieeahOS9nOeUqOWfn+iMg+WbtOWGhVxuICAgICdjdXJseSc6IFdBUk4sIC8vIOW8uuWItuaJgOacieaOp+WItuivreWPpeS9v+eUqOS4gOiHtOeahOaLrOWPt+mjjuagvFxuICAgICduby1mYWxsdGhyb3VnaCc6IFdBUk4sIC8vIOemgeatoiBjYXNlIOivreWPpeiQveepulxuICAgICduby1mbG9hdGluZy1kZWNpbWFsJzogRVJST1IsIC8vIOemgeatouaVsOWtl+Wtl+mdoumHj+S4reS9v+eUqOWJjeWvvOWSjOacq+WwvuWwj+aVsOeCuVxuICAgICduby1tdWx0aS1zcGFjZXMnOiBXQVJOLCAvLyDnpoHmraLkvb/nlKjlpJrkuKrnqbrmoLxcbiAgICAnbm8tbmV3LXdyYXBwZXJzJzogRVJST1IsIC8vIOemgeatouWvuSBTdHJpbmfvvIxOdW1iZXIg5ZKMIEJvb2xlYW4g5L2/55SoIG5ldyDmk43kvZznrKZcbiAgICAnbm8tcHJvdG8nOiBFUlJPUiwgLy8g56aB55SoIF9fcHJvdG9fXyDlsZ7mgKdcbiAgICAnbm8tcmV0dXJuLWFzc2lnbic6IFdBUk4sIC8vIOemgeatouWcqCByZXR1cm4g6K+t5Y+l5Lit5L2/55So6LWL5YC86K+t5Y+lXG4gICAgJ25vLXVzZWxlc3MtZXNjYXBlJzogV0FSTiwgLy8g56aB55So5LiN5b+F6KaB55qE6L2s5LmJ5a2X56ymXG5cbiAgICAvKipcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKiDov5nkupvop4TliJnkuI7lj5jph4/lo7DmmI7mnInlhbPvvJpcbiAgICAgKi9cbiAgICAnbm8tdW5kZWYtaW5pdCc6IFdBUk4sIC8vIOemgeatouWwhuWPmOmHj+WIneWni+WMluS4uiB1bmRlZmluZWRcbiAgICAnbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOemgeatouWHuueOsOacquS9v+eUqOi/h+eahOWPmOmHj1xuICAgICduby11c2UtYmVmb3JlLWRlZmluZSc6IFtFUlJPUiwgeyAnZnVuY3Rpb25zJzogZmFsc2UsICdjbGFzc2VzJzogZmFsc2UsICd2YXJpYWJsZXMnOiBmYWxzZSB9XSwgLy8g56aB5q2i5Zyo5Y+Y6YeP5a6a5LmJ5LmL5YmN5L2/55So5a6D5LusXG5cbiAgICAvKipcbiAgICAgKiBTdHlsaXN0aWMgSXNzdWVzXG4gICAgICog6L+Z5Lqb6KeE5YiZ5piv5YWz5LqO6aOO5qC85oyH5Y2X55qE77yM6ICM5LiU5piv6Z2e5bi45Li76KeC55qE77yaXG4gICAgICovXG4gICAgJ2FycmF5LWJyYWNrZXQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuaVsOe7hOaWueaLrOWPt+S4reS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdibG9jay1zcGFjaW5nJzogV0FSTiwgLy8g56aB5q2i5oiW5by65Yi25Zyo5Luj56CB5Z2X5Lit5byA5ous5Y+35YmN5ZKM6Zet5ous5Y+35ZCO5pyJ56m65qC8XG4gICAgJ2JyYWNlLXN0eWxlJzogW1dBUk4sICcxdGJzJywgeyAnYWxsb3dTaW5nbGVMaW5lJzogdHJ1ZSB9XSwgLy8g5by65Yi25Zyo5Luj56CB5Z2X5Lit5L2/55So5LiA6Ie055qE5aSn5ous5Y+36aOO5qC8XG4gICAgJ2NvbW1hLWRhbmdsZSc6IFtXQVJOLCAnYWx3YXlzLW11bHRpbGluZSddLCAvLyDopoHmsYLmiJbnpoHmraLmnKvlsL7pgJflj7dcbiAgICAnY29tbWEtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOmAl+WPt+WJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdjb21tYS1zdHlsZSc6IFdBUk4sIC8vIOW8uuWItuS9v+eUqOS4gOiHtOeahOmAl+WPt+mjjuagvFxuICAgICdjb21wdXRlZC1wcm9wZXJ0eS1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25Zyo6K6h566X55qE5bGe5oCn55qE5pa55ous5Y+35Lit5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ2Z1bmMtY2FsbC1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5Zyo5Ye95pWw5qCH6K+G56ym5ZKM5YW26LCD55So5LmL6Ze05pyJ56m65qC8XG4gICAgJ2Z1bmN0aW9uLXBhcmVuLW5ld2xpbmUnOiBXQVJOLCAvLyDlvLrliLblnKjlh73mlbDmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTmjaLooYxcbiAgICAnaW1wbGljaXQtYXJyb3ctbGluZWJyZWFrJzogV0FSTiwgLy8g5by65Yi26ZqQ5byP6L+U5Zue55qE566t5aS05Ye95pWw5L2T55qE5L2N572uXG4gICAgJ2luZGVudCc6IFtXQVJOLCAyLCB7ICdTd2l0Y2hDYXNlJzogMSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE57yp6L+bXG4gICAgJ2pzeC1xdW90ZXMnOiBXQVJOLCAvLyDlvLrliLblnKggSlNYIOWxnuaAp+S4reS4gOiHtOWcsOS9v+eUqOWPjOW8leWPt+aIluWNleW8leWPt1xuICAgICdrZXktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqOWvueixoeWtl+mdoumHj+eahOWxnuaAp+S4remUruWSjOWAvOS5i+mXtOS9v+eUqOS4gOiHtOeahOmXtOi3nVxuICAgICdrZXl3b3JkLXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLblnKjlhbPplK7lrZfliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnbmV3LXBhcmVucyc6IFdBUk4sIC8vIOW8uuWItuaIluemgeatouiwg+eUqOaXoOWPguaehOmAoOWHveaVsOaXtuacieWchuaLrOWPt1xuICAgICduby1taXhlZC1zcGFjZXMtYW5kLXRhYnMnOiBXQVJOLFxuICAgICduby1tdWx0aXBsZS1lbXB0eS1saW5lcyc6IFtXQVJOLCB7ICdtYXgnOiAxLCAnbWF4RU9GJzogMCwgJ21heEJPRic6IDAgfV0sIC8vIOemgeatouWHuueOsOWkmuihjOepuuihjFxuICAgICduby10cmFpbGluZy1zcGFjZXMnOiBXQVJOLCAvLyDnpoHnlKjooYzlsL7nqbrmoLxcbiAgICAnbm8td2hpdGVzcGFjZS1iZWZvcmUtcHJvcGVydHknOiBXQVJOLCAvLyDnpoHmraLlsZ7mgKfliY3mnInnqbrnmb1cbiAgICAnbm9uYmxvY2stc3RhdGVtZW50LWJvZHktcG9zaXRpb24nOiBXQVJOLCAvLyDlvLrliLbljZXkuKror63lj6XnmoTkvY3nva5cbiAgICAnb2JqZWN0LWN1cmx5LW5ld2xpbmUnOiBbV0FSTiwgeyAnbXVsdGlsaW5lJzogdHJ1ZSwgJ2NvbnNpc3RlbnQnOiB0cnVlIH1dLCAvLyDlvLrliLblpKfmi6zlj7flhoXmjaLooYznrKbnmoTkuIDoh7TmgKdcbiAgICAnb2JqZWN0LWN1cmx5LXNwYWNpbmcnOiBbV0FSTiwgJ2Fsd2F5cyddLCAvLyDlvLrliLblnKjlpKfmi6zlj7fkuK3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAncGFkZGVkLWJsb2Nrcyc6IFtXQVJOLCAnbmV2ZXInXSwgLy8g6KaB5rGC5oiW56aB5q2i5Z2X5YaF5aGr5YWFXG4gICAgJ3F1b3Rlcyc6IFtXQVJOLCAnc2luZ2xlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlLCAnYWxsb3dUZW1wbGF0ZUxpdGVyYWxzJzogdHJ1ZSB9XSwgLy8g5by65Yi25L2/55So5LiA6Ie055qE5Y+N5Yu+5Y+344CB5Y+M5byV5Y+35oiW5Y2V5byV5Y+3XG4gICAgJ3NlbWknOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLkvb/nlKjliIblj7fku6Pmm78gQVNJXG4gICAgJ3NlbWktc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWIhuWPt+S5i+WJjeWSjOS5i+WQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzZW1pLXN0eWxlJzogV0FSTiwgLy8g5by65Yi25YiG5Y+355qE5L2N572uXG4gICAgJ3NwYWNlLWJlZm9yZS1ibG9ja3MnOiBXQVJOLCAvLyDlvLrliLblnKjlnZfkuYvliY3kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtYmVmb3JlLWZ1bmN0aW9uLXBhcmVuJzogW1dBUk4sIHsgJ2Fub255bW91cyc6ICduZXZlcicsICduYW1lZCc6ICduZXZlcicsICdhc3luY0Fycm93JzogJ2Fsd2F5cycgfV0sIC8vIOW8uuWItuWcqCBmdW5jdGlvbueahOW3puaLrOWPt+S5i+WJjeS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZS1pbi1wYXJlbnMnOiBXQVJOLCAvLyDlvLrliLblnKjlnIbmi6zlj7flhoXkvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnc3BhY2UtaW5maXgtb3BzJzogV0FSTiwgLy8g6KaB5rGC5pON5L2c56ym5ZGo5Zu05pyJ56m65qC8XG4gICAgJ3NwYWNlLXVuYXJ5LW9wcyc6IFdBUk4sIC8vIOW8uuWItuWcqOS4gOWFg+aTjeS9nOespuWJjeWQjuS9v+eUqOS4gOiHtOeahOepuuagvFxuICAgICdzcGFjZWQtY29tbWVudCc6IFdBUk4sIC8vIOW8uuWItuWcqOazqOmHiuS4rSAvLyDmiJYgLyog5L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ3N3aXRjaC1jb2xvbi1zcGFjaW5nJzogV0FSTiwgLy8g5by65Yi25ZyoIHN3aXRjaCDnmoTlhpLlj7flt6blj7PmnInnqbrmoLxcbiAgICAndGVtcGxhdGUtdGFnLXNwYWNpbmcnOiBXQVJOLCAvLyDopoHmsYLmiJbnpoHmraLlnKjmqKHmnb/moIforrDlkozlroPku6znmoTlrZfpnaLph4/kuYvpl7TnmoTnqbrmoLxcblxuICAgIC8qKlxuICAgICAqIEVDTUFTY3JpcHQgNlxuICAgICAqIOi/meS6m+inhOWImeWPquS4jiBFUzYg5pyJ5YWzLCDljbPpgJrluLjmiYDor7TnmoQgRVMyMDE177yaXG4gICAgICovXG4gICAgJ2Fycm93LXNwYWNpbmcnOiBXQVJOLCAvLyDlvLrliLbnrq3lpLTlh73mlbDnmoTnrq3lpLTliY3lkI7kvb/nlKjkuIDoh7TnmoTnqbrmoLxcbiAgICAnZ2VuZXJhdG9yLXN0YXItc3BhY2luZyc6IFtXQVJOLCB7ICdiZWZvcmUnOiBmYWxzZSwgJ2FmdGVyJzogdHJ1ZSwgJ21ldGhvZCc6IHsgJ2JlZm9yZSc6IHRydWUsICdhZnRlcic6IGZhbHNlIH0gfV0sIC8vIOW8uuWItiBnZW5lcmF0b3Ig5Ye95pWw5LitICog5Y+35ZGo5Zu05L2/55So5LiA6Ie055qE56m65qC8XG4gICAgJ25vLXVzZWxlc3MtcmVuYW1lJzogV0FSTiwgLy8g56aB5q2i5ZyoIGltcG9ydCDlkowgZXhwb3J0IOWSjOino+aehOi1i+WAvOaXtuWwhuW8leeUqOmHjeWRveWQjeS4uuebuOWQjOeahOWQjeWtl1xuICAgICdwcmVmZXItdGVtcGxhdGUnOiBXQVJOLCAvLyDopoHmsYLkvb/nlKjmqKHmnb/lrZfpnaLph4/ogIzpnZ7lrZfnrKbkuLLov57mjqVcbiAgICAncmVzdC1zcHJlYWQtc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWJqeS9meWSjOaJqeWxlei/kOeul+espuWPiuWFtuihqOi+vuW8j+S5i+mXtOacieepuuagvFxuICAgICd0ZW1wbGF0ZS1jdXJseS1zcGFjaW5nJzogV0FSTiwgLy8g6KaB5rGC5oiW56aB5q2i5qih5p2/5a2X56ym5Liy5Lit55qE5bWM5YWl6KGo6L6+5byP5ZGo5Zu056m65qC855qE5L2/55SoXG4gICAgJ3lpZWxkLXN0YXItc3BhY2luZyc6IFdBUk4sIC8vIOW8uuWItuWcqCB5aWVsZCog6KGo6L6+5byP5LitICog5ZGo5Zu05L2/55So56m65qC8XG4gIH0sXG4gIC8vIOimhuebllxuICBvdmVycmlkZXM6IFtdLFxufTtcbi8vIHZ1ZTIvdnVlMyDlhbHnlKhcbmV4cG9ydCBjb25zdCB2dWVDb21tb25Db25maWcgPSB7XG4gIHJ1bGVzOiB7XG4gICAgLy8gUHJpb3JpdHkgQTogRXNzZW50aWFsXG4gICAgJ3Z1ZS9tdWx0aS13b3JkLWNvbXBvbmVudC1uYW1lcyc6IE9GRiwgLy8g6KaB5rGC57uE5Lu25ZCN56ew5aeL57uI5Li65aSa5a2XXG4gICAgJ3Z1ZS9uby11bnVzZWQtY29tcG9uZW50cyc6IFdBUk4sIC8vIOacquS9v+eUqOeahOe7hOS7tlxuICAgICd2dWUvbm8tdW51c2VkLXZhcnMnOiBPRkYsIC8vIOacquS9v+eUqOeahOWPmOmHj1xuICAgICd2dWUvcmVxdWlyZS1yZW5kZXItcmV0dXJuJzogV0FSTiwgLy8g5by65Yi25riy5p+T5Ye95pWw5oC75piv6L+U5Zue5YC8XG4gICAgJ3Z1ZS9yZXF1aXJlLXYtZm9yLWtleSc6IE9GRiwgLy8gdi1mb3LkuK3lv4Xpobvkvb/nlKhrZXlcbiAgICAndnVlL3JldHVybi1pbi1jb21wdXRlZC1wcm9wZXJ0eSc6IFdBUk4sIC8vIOW8uuWItui/lOWbnuivreWPpeWtmOWcqOS6juiuoeeul+WxnuaAp+S4rVxuICAgICd2dWUvdmFsaWQtdGVtcGxhdGUtcm9vdCc6IE9GRiwgLy8g5by65Yi25pyJ5pWI55qE5qih5p2/5qC5XG4gICAgJ3Z1ZS92YWxpZC12LWZvcic6IE9GRiwgLy8g5by65Yi25pyJ5pWI55qEdi1mb3LmjIfku6RcbiAgICAvLyBQcmlvcml0eSBCOiBTdHJvbmdseSBSZWNvbW1lbmRlZFxuICAgICd2dWUvYXR0cmlidXRlLWh5cGhlbmF0aW9uJzogT0ZGLCAvLyDlvLrliLblsZ7mgKflkI3moLzlvI9cbiAgICAndnVlL2NvbXBvbmVudC1kZWZpbml0aW9uLW5hbWUtY2FzaW5nJzogT0ZGLCAvLyDlvLrliLbnu4Tku7ZuYW1l5qC85byPXG4gICAgJ3Z1ZS9odG1sLXF1b3Rlcyc6IFtXQVJOLCAnZG91YmxlJywgeyAnYXZvaWRFc2NhcGUnOiB0cnVlIH1dLCAvLyDlvLrliLYgSFRNTCDlsZ7mgKfnmoTlvJXlj7fmoLflvI9cbiAgICAndnVlL2h0bWwtc2VsZi1jbG9zaW5nJzogT0ZGLCAvLyDkvb/nlKjoh6rpl63lkIjmoIfnrb5cbiAgICAndnVlL21heC1hdHRyaWJ1dGVzLXBlci1saW5lJzogW1dBUk4sIHsgJ3NpbmdsZWxpbmUnOiBJbmZpbml0eSwgJ211bHRpbGluZSc6IDEgfV0sIC8vIOW8uuWItuavj+ihjOWMheWQq+eahOacgOWkp+WxnuaAp+aVsFxuICAgICd2dWUvbXVsdGlsaW5lLWh0bWwtZWxlbWVudC1jb250ZW50LW5ld2xpbmUnOiBPRkYsIC8vIOmcgOimgeWcqOWkmuihjOWFg+e0oOeahOWGheWuueWJjeWQjuaNouihjFxuICAgICd2dWUvcHJvcC1uYW1lLWNhc2luZyc6IE9GRiwgLy8g5Li6IFZ1ZSDnu4Tku7bkuK3nmoQgUHJvcCDlkI3np7DlvLrliLbmiafooYznibnlrprlpKflsI/lhplcbiAgICAndnVlL3JlcXVpcmUtZGVmYXVsdC1wcm9wJzogT0ZGLCAvLyBwcm9wc+mcgOimgem7mOiupOWAvFxuICAgICd2dWUvc2luZ2xlbGluZS1odG1sLWVsZW1lbnQtY29udGVudC1uZXdsaW5lJzogT0ZGLCAvLyDpnIDopoHlnKjljZXooYzlhYPntKDnmoTlhoXlrrnliY3lkI7mjaLooYxcbiAgICAndnVlL3YtYmluZC1zdHlsZSc6IE9GRiwgLy8g5by65Yi2di1iaW5k5oyH5Luk6aOO5qC8XG4gICAgJ3Z1ZS92LW9uLXN0eWxlJzogT0ZGLCAvLyDlvLrliLZ2LW9u5oyH5Luk6aOO5qC8XG4gICAgJ3Z1ZS92LXNsb3Qtc3R5bGUnOiBPRkYsIC8vIOW8uuWItnYtc2xvdOaMh+S7pOmjjuagvFxuICAgIC8vIFByaW9yaXR5IEM6IFJlY29tbWVuZGVkXG4gICAgJ3Z1ZS9uby12LWh0bWwnOiBPRkYsIC8vIOemgeatouS9v+eUqHYtaHRtbFxuICAgIC8vIFVuY2F0ZWdvcml6ZWRcbiAgICAndnVlL2Jsb2NrLXRhZy1uZXdsaW5lJzogV0FSTiwgLy8gIOWcqOaJk+W8gOWdl+e6p+agh+iusOS5i+WQjuWSjOWFs+mXreWdl+e6p+agh+iusOS5i+WJjeW8uuWItuaNouihjFxuICAgICd2dWUvaHRtbC1jb21tZW50LWNvbnRlbnQtc3BhY2luZyc6IFdBUk4sIC8vIOWcqEhUTUzms6jph4rkuK3lvLrliLbnu5/kuIDnmoTnqbrmoLxcbiAgICAndnVlL3NjcmlwdC1pbmRlbnQnOiBbV0FSTiwgMiwgeyAnYmFzZUluZGVudCc6IDEsICdzd2l0Y2hDYXNlJzogMSB9XSwgLy8g5ZyoPHNjcmlwdD7kuK3lvLrliLbkuIDoh7TnmoTnvKnov5tcbiAgICAvLyBFeHRlbnNpb24gUnVsZXPjgILlr7nlupRlc2xpbnTnmoTlkIzlkI3op4TliJnvvIzpgILnlKjkuo48dGVtcGxhdGU+5Lit55qE6KGo6L6+5byPXG4gICAgJ3Z1ZS9hcnJheS1icmFja2V0LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvYmxvY2stc3BhY2luZyc6IFdBUk4sXG4gICAgJ3Z1ZS9icmFjZS1zdHlsZSc6IFtXQVJOLCAnMXRicycsIHsgJ2FsbG93U2luZ2xlTGluZSc6IHRydWUgfV0sXG4gICAgJ3Z1ZS9jb21tYS1kYW5nbGUnOiBbV0FSTiwgJ2Fsd2F5cy1tdWx0aWxpbmUnXSxcbiAgICAndnVlL2NvbW1hLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvY29tbWEtc3R5bGUnOiBXQVJOLFxuICAgICd2dWUvZnVuYy1jYWxsLXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUva2V5LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUva2V5d29yZC1zcGFjaW5nJzogV0FSTixcbiAgICAndnVlL29iamVjdC1jdXJseS1uZXdsaW5lJzogW1dBUk4sIHsgJ211bHRpbGluZSc6IHRydWUsICdjb25zaXN0ZW50JzogdHJ1ZSB9XSxcbiAgICAndnVlL29iamVjdC1jdXJseS1zcGFjaW5nJzogW1dBUk4sICdhbHdheXMnXSxcbiAgICAndnVlL3NwYWNlLWluLXBhcmVucyc6IFdBUk4sXG4gICAgJ3Z1ZS9zcGFjZS1pbmZpeC1vcHMnOiBXQVJOLFxuICAgICd2dWUvc3BhY2UtdW5hcnktb3BzJzogV0FSTixcbiAgICAndnVlL2Fycm93LXNwYWNpbmcnOiBXQVJOLFxuICAgICd2dWUvcHJlZmVyLXRlbXBsYXRlJzogV0FSTixcbiAgfSxcbiAgb3ZlcnJpZGVzOiBbXG4gICAge1xuICAgICAgJ2ZpbGVzJzogWycqLnZ1ZSddLFxuICAgICAgJ3J1bGVzJzoge1xuICAgICAgICAnaW5kZW50JzogT0ZGLFxuICAgICAgfSxcbiAgICB9LFxuICBdLFxufTtcbi8vIHZ1ZTLnlKhcbmV4cG9ydCBjb25zdCB2dWUyQ29uZmlnID0gbWVyZ2UodnVlQ29tbW9uQ29uZmlnLCB7XG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggdnVlMiDmjqjojZDnmoTop4TliJlcbiAgICAncGx1Z2luOnZ1ZS9yZWNvbW1lbmRlZCcsXG4gIF0sXG59KTtcbi8vIHZ1ZTPnlKhcbmV4cG9ydCBjb25zdCB2dWUzQ29uZmlnID0gbWVyZ2UodnVlQ29tbW9uQ29uZmlnLCB7XG4gIGVudjoge1xuICAgICd2dWUvc2V0dXAtY29tcGlsZXItbWFjcm9zJzogdHJ1ZSwgLy8g5aSE55CGc2V0dXDmqKHmnb/kuK3lg48gZGVmaW5lUHJvcHMg5ZKMIGRlZmluZUVtaXRzIOi/meagt+eahOe8luivkeWZqOWuj+aKpSBuby11bmRlZiDnmoTpl67popjvvJpodHRwczovL2VzbGludC52dWVqcy5vcmcvdXNlci1ndWlkZS8jY29tcGlsZXItbWFjcm9zLXN1Y2gtYXMtZGVmaW5lcHJvcHMtYW5kLWRlZmluZWVtaXRzLWdlbmVyYXRlLW5vLXVuZGVmLXdhcm5pbmdzXG4gIH0sXG4gIGV4dGVuZHM6IFtcbiAgICAvLyDkvb/nlKggdnVlMyDmjqjojZDnmoTop4TliJlcbiAgICAncGx1Z2luOnZ1ZS92dWUzLXJlY29tbWVuZGVkJyxcbiAgXSxcbiAgcnVsZXM6IHtcbiAgICAvLyBQcmlvcml0eSBBOiBFc3NlbnRpYWxcbiAgICAndnVlL25vLXRlbXBsYXRlLWtleSc6IE9GRiwgLy8g56aB5q2iPHRlbXBsYXRlPuS4reS9v+eUqGtleeWxnuaAp1xuICAgIC8vIFByaW9yaXR5IEE6IEVzc2VudGlhbCBmb3IgVnVlLmpzIDMueFxuICAgICd2dWUvcmV0dXJuLWluLWVtaXRzLXZhbGlkYXRvcic6IFdBUk4sIC8vIOW8uuWItuWcqGVtaXRz6aqM6K+B5Zmo5Lit5a2Y5Zyo6L+U5Zue6K+t5Y+lXG4gICAgLy8gUHJpb3JpdHkgQjogU3Ryb25nbHkgUmVjb21tZW5kZWQgZm9yIFZ1ZS5qcyAzLnhcbiAgICAndnVlL3JlcXVpcmUtZXhwbGljaXQtZW1pdHMnOiBPRkYsIC8vIOmcgOimgWVtaXRz5Lit5a6a5LmJ6YCJ6aG555So5LqOJGVtaXQoKVxuICAgICd2dWUvdi1vbi1ldmVudC1oeXBoZW5hdGlvbic6IE9GRiwgLy8g5Zyo5qih5p2/5Lit55qE6Ieq5a6a5LmJ57uE5Lu25LiK5by65Yi25omn6KGMIHYtb24g5LqL5Lu25ZG95ZCN5qC35byPXG4gIH0sXG59KTtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZSguLi5vYmplY3RzKSB7XG4gIGNvbnN0IFt0YXJnZXQsIC4uLnNvdXJjZXNdID0gb2JqZWN0cztcbiAgY29uc3QgcmVzdWx0ID0gRGF0YS5kZWVwQ2xvbmUodGFyZ2V0KTtcbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpIHtcbiAgICAgIC8vIOeJueauiuWtl+auteWkhOeQhlxuICAgICAgaWYgKGtleSA9PT0gJ3J1bGVzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IGtleSwgdmFsdWUsICdyZXN1bHRba2V5XSc6IHJlc3VsdFtrZXldIH0pO1xuICAgICAgICAvLyDliJ3lp4vkuI3lrZjlnKjml7botYvpu5jorqTlgLznlKjkuo7lkIjlubZcbiAgICAgICAgcmVzdWx0W2tleV0gPSByZXN1bHRba2V5XSA/PyB7fTtcbiAgICAgICAgLy8g5a+55ZCE5p2h6KeE5YiZ5aSE55CGXG4gICAgICAgIGZvciAobGV0IFtydWxlS2V5LCBydWxlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICAgIC8vIOW3suacieWAvOe7n+S4gOaIkOaVsOe7hOWkhOeQhlxuICAgICAgICAgIGxldCBzb3VyY2VSdWxlVmFsdWUgPSByZXN1bHRba2V5XVtydWxlS2V5XSA/PyBbXTtcbiAgICAgICAgICBpZiAoIShzb3VyY2VSdWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHNvdXJjZVJ1bGVWYWx1ZSA9IFtzb3VyY2VSdWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDopoHlkIjlubbnmoTlgLznu5/kuIDmiJDmlbDnu4TlpITnkIZcbiAgICAgICAgICBpZiAoIShydWxlVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgIHJ1bGVWYWx1ZSA9IFtydWxlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyDnu5/kuIDmoLzlvI/lkI7ov5vooYzmlbDnu4Tlvqrnjq/mk43kvZxcbiAgICAgICAgICBmb3IgKGNvbnN0IFt2YWxJbmRleCwgdmFsXSBvZiBPYmplY3QuZW50cmllcyhydWxlVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyDlr7nosaHmt7HlkIjlubbvvIzlhbbku5bnm7TmjqXotYvlgLxcbiAgICAgICAgICAgIGlmIChEYXRhLmdldEV4YWN0VHlwZSh2YWwpID09PSBPYmplY3QpIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IF9PYmplY3QuZGVlcEFzc2lnbihzb3VyY2VSdWxlVmFsdWVbdmFsSW5kZXhdID8/IHt9LCB2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc291cmNlUnVsZVZhbHVlW3ZhbEluZGV4XSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8g6LWL5YC86KeE5YiZ57uT5p6cXG4gICAgICAgICAgcmVzdWx0W2tleV1bcnVsZUtleV0gPSBzb3VyY2VSdWxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyDlhbbku5blrZfmrrXmoLnmja7nsbvlnovliKTmlq3lpITnkIZcbiAgICAgIC8vIOaVsOe7hO+8muaLvOaOpVxuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgKHJlc3VsdFtrZXldID0gcmVzdWx0W2tleV0gPz8gW10pLnB1c2goLi4udmFsdWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIOWFtuS7luWvueixoe+8mua3seWQiOW5tlxuICAgICAgaWYgKERhdGEuZ2V0RXhhY3RUeXBlKHZhbHVlKSA9PT0gT2JqZWN0KSB7XG4gICAgICAgIF9PYmplY3QuZGVlcEFzc2lnbihyZXN1bHRba2V5XSA9IHJlc3VsdFtrZXldID8/IHt9LCB2YWx1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8g5YW25LuW55u05o6l6LWL5YC8XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiDkvb/nlKjlrprliLbnmoTphY3nva5cbiAqIEBwYXJhbSB7fe+8mumFjee9rumhuVxuICogICAgICAgICAgYmFzZe+8muS9v+eUqOWfuuehgGVzbGludOWumuWItu+8jOm7mOiupCB0cnVlXG4gKiAgICAgICAgICB2dWVWZXJzaW9u77yadnVl54mI5pys77yM5byA5ZCv5ZCO6ZyA6KaB5a6J6KOFIGVzbGludC1wbHVnaW4tdnVlXG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2UoeyBiYXNlID0gdHJ1ZSwgdnVlVmVyc2lvbiB9ID0ge30pIHtcbiAgbGV0IHJlc3VsdCA9IHt9O1xuICBpZiAoYmFzZSkge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgYmFzZUNvbmZpZyk7XG4gIH1cbiAgaWYgKHZ1ZVZlcnNpb24gPT0gMikge1xuICAgIHJlc3VsdCA9IG1lcmdlKHJlc3VsdCwgdnVlMkNvbmZpZyk7XG4gIH0gZWxzZSBpZiAodnVlVmVyc2lvbiA9PSAzKSB7XG4gICAgcmVzdWx0ID0gbWVyZ2UocmVzdWx0LCB2dWUzQ29uZmlnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiLy8g5Z+656GA5a6a5Yi2XG5leHBvcnQgY29uc3QgYmFzZUNvbmZpZyA9IHtcbiAgYmFzZTogJy4vJyxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICAvLyDliKvlkI1cbiAgICBhbGlhczoge1xuICAgICAgLy8gJ0Byb290JzogcmVzb2x2ZShfX2Rpcm5hbWUpLFxuICAgICAgLy8gJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8g6KeE5a6a6Kem5Y+R6K2m5ZGK55qEIGNodW5rIOWkp+Wwj+OAgu+8iOS7pSBrYnMg5Li65Y2V5L2N77yJXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyICoqIDEwLFxuICAgIC8vIOiHquWumuS5ieW6leWxgueahCBSb2xsdXAg5omT5YyF6YWN572u44CCXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIOWFpeWPo+aWh+S7tuWQjVxuICAgICAgICBlbnRyeUZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9lbnRyeS0ke2NodW5rSW5mby50eXBlfS1bbmFtZV0uanNgO1xuICAgICAgICB9LFxuICAgICAgICAvLyDlnZfmlofku7blkI1cbiAgICAgICAgY2h1bmtGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvJHtjaHVua0luZm8udHlwZX0tW25hbWVdLmpzYDtcbiAgICAgICAgfSxcbiAgICAgICAgLy8g6LWE5rqQ5paH5Lu25ZCN77yMY3Nz44CB5Zu+54mH562JXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzKGNodW5rSW5mbykge1xuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7Y2h1bmtJbmZvLnR5cGV9LVtuYW1lXS5bZXh0XWA7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbImJhc2VDb25maWciLCJEYXRhLmRlZXBDbG9uZSIsIkRhdGEuZ2V0RXhhY3RUeXBlIiwiX09iamVjdC5kZWVwQXNzaWduIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFO0FBQ3BDO0FBQ0EsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FB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
