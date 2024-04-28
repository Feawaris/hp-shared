const { BaseEnv, _Date } = require('hp-shared/base');

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
