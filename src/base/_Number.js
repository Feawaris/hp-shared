// 数字
export const _Number = Object.create(null);

/**
 * 区别于 Number.prototype.toFixed，会移除尾部多余的零和不必要的小数点，以精简显示
 * @param x
 * @param fractionDigits
 * @returns {string}
 */
_Number.toMaxFixed = function(x, fractionDigits = 0) {
  const str = Number.prototype.toFixed.call(x, fractionDigits);
  // 移除尾部多余的零和不必要的小数点
  return str.replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1');
};
/**
 * 进制转换
 * @param x
 * @param from
 * @param to
 * @returns {string}
 */
_Number.convertBase = function(x, { from = 10, to = 10 } = {}) {
  return Number.parseInt(x, from).toString(to);
};
/**
 * 素数判断
 * @param x
 * @returns {boolean}
 */
_Number.isPrime = function(x) {
  if (x < 2) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(x); i++) {
    if (x % i === 0) {
      return false;
    }
  }
  return true;
};
