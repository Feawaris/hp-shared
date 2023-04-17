import { getExactType } from './Data';

/**
 * 创建Date对象
 * @param args {*[]} 多个值
 * @returns {Date|*}
 */
export function create(...args) {
  if (arguments.length === 1) {
    // safari 浏览器字符串格式兼容
    const value = arguments[0];
    const valueResult = getExactType(value) === String ? value.replaceAll('-', '/') : value;
    return new Date(valueResult);
  } else {
    // 传参行为先和Date一致，后续再收集需求加强定制(注意无参和显式undefined的区别)
    return arguments.length === 0 ? new Date() : new Date(...arguments);
  }
}
