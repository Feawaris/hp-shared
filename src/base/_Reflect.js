export const _Reflect = Object.create(Reflect);

// apply 继承
// construct 继承
// defineProperty 继承
// deleteProperty 继承
// get 继承
// getOwnPropertyDescriptor 继承
// getPrototypeOf 继承
// ownKeys 继承
// set 继承
// setPrototypeOf 继承
// preventExtensions 继承
// has 继承
// isExtensible 继承

// 对 ownKeys 配套 ownValues 和 ownEntries
_Reflect.ownValues = function(target) {
  return Reflect.ownKeys(target).map(key => target[key]);
};
_Reflect.ownEntries = function(target) {
  return Reflect.ownKeys(target).map(key => [key, target[key]]);
};
