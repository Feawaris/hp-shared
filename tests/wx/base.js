const { TestData, timeout } = require('shared');

const testInfo = new TestData('wx');
describe('BaseEnv', () => {
  test('envs', async () => {
    const { base: { BaseEnv } } = await testInfo.getData();
    expect(BaseEnv.envs).toContain('wx');
  }, timeout);
  test('isWx', async () => {
    const { base: { BaseEnv } } = await testInfo.getData();
    expect(BaseEnv.isWx).toBe(true);
  }, timeout);
});
