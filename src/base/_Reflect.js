export class _Reflect {
  // 对 ownKeys 配套 ownValues 和 ownEntries
  static ownValues(target) {
    return Reflect.ownKeys(target).map(key => target[key]);
  }
  static ownEntries(target) {
    return Reflect.ownKeys(target).map(key => [key, target[key]]);
  }
}
