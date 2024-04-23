const { BaseEnv } = require('hp-shared/base');

describe('BaseEnv', () => {
  test('envs', () => {
    expect(BaseEnv.envs).toContain('node');
  });
  test('isNode', () => {
    expect(BaseEnv.isNode).toBe(true);
  });
});
