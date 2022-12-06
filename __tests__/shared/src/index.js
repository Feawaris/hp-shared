// 测试共用模块
export * from './base';
// 创建代理tests增加辅助显示
export function createTestsProxy(tests) {
  return new Proxy(tests, {
    get(target, p, receiver) {
      if (Object.keys(target).includes(p)) {
        const fn = Reflect.get(...arguments);
        return function() {
          console.group(p);
          fn(...arguments);
          console.groupEnd();
        };
      }
    },
  });
}
