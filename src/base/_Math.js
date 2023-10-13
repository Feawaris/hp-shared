// 数学运算
export class _Math {
  // 增加部分命名以接近数学写法
  static arcsin = Math.asin.bind(Math);
  static arccos = Math.acos.bind(Math);
  static arctan = Math.atan.bind(Math);
  static arsinh = Math.asinh.bind(Math);
  static arcosh = Math.acosh.bind(Math);
  static artanh = Math.atanh.bind(Math);
  static loge = Math.log.bind(Math);
  static ln = Math.log.bind(Math);
  static lg = Math.log10.bind(Math);
  static log(a, x) {
    return Math.log(x) / Math.log(a);
  }
}
