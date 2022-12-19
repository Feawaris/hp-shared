export const _Reflect = Object.create(Reflect);
Object.assign(_Reflect, {
// 对 ownKeys 配套 ownValues 和 ownEntries
  ownValues(target) {
    return Reflect.ownKeys(target).map(key => target[key]);
  },
  ownEntries(target) {
    return Reflect.ownKeys(target).map(key => [key, target[key]]);
  },
});
