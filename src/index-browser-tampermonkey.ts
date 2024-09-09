// 1.UserScript 注释在 rollup.config 中配置
// 2.对象全局挂载
const { hpShared } = globalThis;
const { _console, _Object, _Math, _Date } = hpShared;
for (const [key, value] of Object.entries(hpShared)) {
  if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
    try {
      globalThis[key] = value;
    } catch (e) {
      _console.error(key, key in globalThis);
    }
  }
}
// 3.常用全局挂载
// _Math
for (const key of _Object.keys(_Math, { includeExtend: true, includeNotEnumerable: true })) {
  globalThis[key] = _Math[key];
}
const pi = Math.PI;
const π = Math.PI;
const e = Math.E;
const oo = Infinity;
_Object.assign(globalThis, {
  pi, π, e, oo,
});
// _Date
_Object.assign(globalThis, {
  get now() {
    return new _Date();
  },
});
