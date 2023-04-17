// 对 ownKeys 配套 ownValues 和 ownEntries
export function ownValues(target) {
  return Reflect.ownKeys(target).map(key => target[key]);
}
export function ownEntries(target) {
  return Reflect.ownKeys(target).map(key => [key, target[key]]);
}
