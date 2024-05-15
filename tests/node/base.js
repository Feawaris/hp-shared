const { BaseEnv, _console, _Date, _Number } = require('hp-shared/base');

describe('BaseEnv', () => {
  test('envs', () => {
    expect(BaseEnv.envs).toContain('node');
  });
  test('isNode', () => {
    expect(BaseEnv.isNode).toBe(true);
  });
  test('async', async () => {
    await _Date.sleep();
    expect(BaseEnv.isNode).toBe(true);
  });
});

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

describe('_Number', () => {
  test('convertBase', () => {
    expect(_Number.convertBase(10, { to: 2 })).toEqual('1010');
    expect(_Number.convertBase(10, { to: 8 })).toEqual('12');
    expect(_Number.convertBase('f', { from: 16 })).toEqual('15');
    expect(_Number.convertBase('f', { from: 16, to: 8 })).toEqual('17');
  });
  test('isPrime', () => {

  });

  describe('_Number.prototype', () => {
    test('toMaxFixed', () => {
      const num = new _Number('12px');
      expect(num.toFixed(2)).toEqual('12.00');
      expect(num.toMaxFixed(2)).toEqual('12');
    });
  });
});
