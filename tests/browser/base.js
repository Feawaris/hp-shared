const { TestData, timeout } = require('shared');

const testInfo = new TestData('browser');
describe('BaseEnv', () => {
  test('envs', async () => {
    const { base: { BaseEnv } } = await testInfo.getData();
    expect(BaseEnv.envs).toContain('browser');
  }, timeout);
  test('isBrowser', async () => {
    const { base: { BaseEnv } } = await testInfo.getData();
    expect(BaseEnv.isBrowser).toBe(true);
  }, timeout);
});
