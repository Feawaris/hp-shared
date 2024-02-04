export const _Function = Object.create(null);
// 对应管道操作 |>
_Function.pipe = function(value, ...funcs) {
  for (const func of funcs) {
    value = func(value);
  }
  return value;
};
// 传参赋值常用
// 空函数
_Function.NOOP = function NOOP() {};
// 原样返回
_Function.RAW = function RAW(x) { return x; };
// 返回 false
_Function.FALSE = function FALSE() { return false; };
// 返回 true
_Function.TRUE = function TRUE() { return true; };
