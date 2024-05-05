const { BaseEnv, _console, _Date, } = require('hp-shared/base');

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
