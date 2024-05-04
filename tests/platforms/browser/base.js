const { TestData, timeout } = require('../../helpers/base');

const testInfo = new TestData('browser');
describe('BaseEnv', () => {
  test('envs', async () => {
    const { BaseEnv } = (await testInfo.getData()).base;
    expect(BaseEnv.envs).toContain('browser');
  }, timeout);
  test('isBrowser', async () => {
    const { BaseEnv } = (await testInfo.getData()).base;
    expect(BaseEnv.isBrowser).toBe(true);
  }, timeout);
});
