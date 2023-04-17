/**
 * 绑定this。常用于解构函数时绑定this避免报错
 * @param target {object} 目标对象
 * @param options {object} 选项。扩展用
 * @returns {*}
 */
export function bindThis(target, options = {}) {
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
