/**
 * [rollup 配置](https://cn.rollupjs.org/configuration-options/)
 */
import { _Object } from '../base';

export const rollup = Object.create(null);
rollup.config1 = {

};
rollup.merge = function (...sources) {
  const simpleKeys = [];
  const objectKeys = [];
  const arrayKeys = [];

  let result = {};
  for (const source of sources) {
    for (let [key, value] of Object.entries(source)) {
      // 视为指定类型的属性
      if (simpleKeys.includes(key)) {
        result[key] = value;
        continue;
      }
      if (objectKeys.includes(key)) {
        result[key] = result[key] || {};
        _Object.deepAssign(result[key], value);
        continue;
      }
      if (arrayKeys.includes(key)) {
        result[key] = result[key] || [];
        if (!Array.isArray(value)) {
          value = [value];
        }
        result[key].push(...value);
        continue;
      }
      // 其他属性：直接赋值
      result[key] = value;
    }
  }
  return result;
};
