// 增加部分命名以接近数学写法
export const arcsin = Math.asin.bind(Math);
export const arccos = Math.acos.bind(Math);
export const arctan = Math.atan.bind(Math);
export const arsinh = Math.asinh.bind(Math);
export const arcosh = Math.acosh.bind(Math);
export const artanh = Math.atanh.bind(Math);
export const loge = Math.log.bind(Math);
export const ln = loge;
export const lg = Math.log10.bind(Math);
export function log(a, x) {
  return Math.log(x) / Math.log(a);
}
