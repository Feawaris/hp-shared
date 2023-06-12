// cookie操作
import jsCookie from 'js-cookie';
// 用到的库也导出便于自行选用
export { jsCookie };

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
export class Cookie {
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
      attributes: assign({}, jsCookie.attributes, attributes),
      converter: assign({}, jsCookie.converter, converter),
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
    return jsCookie.set(name, value, attributes);
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
    let result = jsCookie.get(name);
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
    return jsCookie.remove(name, attributes);
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
export const cookie = new Cookie();
