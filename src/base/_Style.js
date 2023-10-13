// 样式处理
export class _Style {
  /**
   * 单位字符串。对数字或数字格式的字符串自动拼单位，其他字符串原样返回
   * @param value 值
   * @param unit 单位。value没带单位时自动拼接，可传 px/em/% 等
   * @returns {string|string}
   */
  static getUnitString(value = '', { unit = 'px' } = {}) {
    if (value === '') {
      return '';
    }
    // 注意：这里使用 == 判断，不使用 ===
    return Number(value) == value ? `${value}${unit}` : String(value);
  }
}
