// 1.UserScript 在 rollup.config 中配置
// 2.对象全局挂载
const { hpShared } = globalThis;
const { base: { _Object, _Math, _Date } } = hpShared;
for (const esm of Object.values(hpShared)) {
  if (typeof esm === 'object' && esm !== null) {
    _Object.assign(globalThis, esm);
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
