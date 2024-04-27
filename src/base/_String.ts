// @ts-nocheck
export const _String = Object.create(null);

/**
 * 首字母大写
 * @param name
 * @returns {`${string}${string}`}
 */
_String.toFirstUpperCase = function (name = '') {
  return `${(name[0] || '').toUpperCase()}${name.slice(1)}`;
};
/**
 * 首字母小写
 * @param name 名称
 * @returns {`${string}${string}`}
 */
_String.toFirstLowerCase = function (name = '') {
  return `${(name[0] || '').toLowerCase()}${name.slice(1)}`;
};
/**
 * 转驼峰命名。常用于连接符命名转驼峰命名，如 xx-name -> xxName
 * @param name 名称
 * @param separator 连接符。用于生成正则，默认为中划线 - 对应regexp得到 /-(\w)/g
 * @param first 首字母处理方式。true 或 'uppercase'：转换成大写
 *                           false 或 'lowercase'：转换成小写
 *                           'raw' 或 其他无效值：默认原样返回，不进行处理
 * @returns {*|`${string}${string}`}
 */
_String.toCamelCase = function (name, { separator = '-', first = 'raw' } = {}) {
  // 生成正则
  const regexp = new RegExp(`${separator}(\\w)`, 'g');
  // 拼接成驼峰
  const camelName = name.replaceAll(regexp, (substr, $1) => {
    return $1.toUpperCase();
  });
  // 首字母大小写根据传参判断
  if ([true, 'uppercase'].includes(first)) {
    return this.toFirstUpperCase(camelName);
  }
  if ([false, 'lowercase'].includes(first)) {
    return this.toFirstLowerCase(camelName);
  }
  return camelName;
};
/**
 * 转连接符命名。常用于驼峰命名转连接符命名，如 xxName -> xx-name
 * @param name 名称
 * @param separator 连接符
 * @returns {string}
 */
_String.toLineCase = function (name = '', { separator = '-' } = {}) {
  return name.replaceAll(/([a-z])([A-Z])/g, `$1${separator}$2`).toLowerCase();
};
/**
 * 带单位字符串。对数字或数字格式的字符串自动拼单位，其他字符串原样返回
 * @param value 值
 * @param unit 单位。value没带单位时自动拼接，可传 px/em/% 等
 * @returns {string|string}
 */
_String.getUnitString = function (value = '', { unit = 'px' } = {}) {
  if (value === '') {
    return '';
  }
  return Number(value) === parseFloat(value) ? `${value}${unit}` : `${value}`;
};
