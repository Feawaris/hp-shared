// @ts-nocheck
export const _Reflect: {
  ownValues<T, K extends keyof T>(target: T): T[K][],
  ownEntries<T, K extends keyof T>(target: T): [K, T[K]][]
} = Object.create(null);

// 对应 ownKeys 配套 ownValues 和 ownEntries
_Reflect.ownValues = function <T, K extends keyof T>(target: T): T[K][] {
  return Reflect.ownKeys(target).map(key => target[key as K]);
};
_Reflect.ownEntries = function <T, K extends keyof T>(target: T): [K, T[K]][] {
  return Reflect.ownKeys(target).map(key => [key as K, target[key as K]]);
};
