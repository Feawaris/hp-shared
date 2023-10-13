export class _Function {
  // 空函数
  static NOOP() {
  }
  // 返回 false
  static FALSE() {
    return false;
  }
  // 返回 true
  static TRUE() {
    return true;
  }
  // 原样返回
  static RAW(value) {
    return value;
  }
  // catch 内的错误原样抛出去
  static THROW(e) {
    throw e;
  }
}
