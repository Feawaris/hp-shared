// @ts-nocheck

// 1.UserScript 在 rollup.config 中配置
// 2.对象全局挂载
const { base: { _Object } } = hpShared;
for (const esm of Object.values(hpShared)) {
  _Object.assign(window, esm);
}
// 3.常用全局挂载
// _Math
for (const key of _Object.keys(_Math, { includeExtend: true, includeNotEnumerable: true })) {
  window[key] = _Math[key];
}
const pi = Math.PI;
const π = Math.PI;
const e = Math.E;
const oo = Infinity;
_Object.assign(window, {
  pi, π, e, oo,
});
// _Date
_Object.assign(window, {
  get now() {
    return new _Date();
  },
});
