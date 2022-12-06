const shared = require('hp-shared');
const testsShared = require('@__tests__/shared');
const { _Reflect } = require('hp-shared/base');

(function preview() {
  console.log('shared');
  console.table(Object.getOwnPropertyDescriptors(shared));
  for (const obj of Object.values(shared)) {
    console.table(Object.getOwnPropertyDescriptors(obj));
  }

  console.log('testsSharedResult:');
  const testsSharedResult = Object.fromEntries(_Reflect.ownEntries(testsShared).filter(([key, value]) => {
    return !(value instanceof Error);
  }));
  console.table(Object.getOwnPropertyDescriptors(testsSharedResult));
  console.warn('由于Error对象影响console.table显示效果，已筛选');
})();

require('./storage');
