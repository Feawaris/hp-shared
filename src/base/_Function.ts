// @ts-nocheck
export const _Function: {
  pipe<T>(value: T, ...funcs: UnaryFunction<T>[]): T;
  NOOP: () => void;
  RAW: <T>(x: T) => T;
  FALSE: () => false;
  TRUE: () => true;
} = Object.create(null);

// 定义一个类型，用于 pipe 函数的参数，它接受一个值并返回一个值
type UnaryFunction<T> = (input: T) => T;
// 对应管道操作 |>，利用泛型提高函数的通用性和类型安全
_Function.pipe = function <T>(value: T, ...funcs: UnaryFunction<T>[]): T {
  for (const func of funcs) {
    value = func(value);
  }
  return value;
};

/**
 * 默认传参常用
 */
// 空函数
_Function.NOOP = function NOOP(): void {};
// 原样返回的函数，增加泛型支持
_Function.RAW = function RAW<T>(x: T): T {
  return x;
};
// 返回 false 的函数
_Function.FALSE = function FALSE(): false {
  return false;
};
// 返回 true 的函数
_Function.TRUE = function TRUE(): true {
  return true;
};
