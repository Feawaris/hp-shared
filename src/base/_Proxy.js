import { _typeof } from './base';

export const _Proxy = Object.create(null);

/**
 * 绑定this。用于解构对象方法时绑定 this
 * @param target
 * @param options
 * @returns {*|object}
 */
_Proxy.bindThis = function(target, options = {}) {
  return new Proxy(target, {
    get(target, p, receiver) {
      const value = Reflect.get(...arguments);
      // 函数类型绑定this
      if (_typeof(value) === 'function') {
        return value.bind(target);
      }
      // 其他属性原样返回
      return value;
    },
  });
};
