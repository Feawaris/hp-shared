const { _console } = require('hp-shared/base');

describe('_console', () => {
  test('getValues', () => {
    const stackInfo = _console.getStackInfo();
    const values = _console.getValues({ style: 'blue', type: 'log', stackInfo, values: [1, '1'] });
    expect(values.slice(1)).toEqual([
      '\x1B[94m1\x1B[39m',
      '\x1B[93m1\x1B[39m',
    ]);
  });
});
