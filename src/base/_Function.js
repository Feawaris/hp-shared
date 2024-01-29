export const _Function = Object.create(null);
_Function.pipe = function(value, ...funcs) {
  for (const func of funcs) {
    value = func(value);
  }
  return value;
};
