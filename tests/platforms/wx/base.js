const { TestData, timeout } = require('../../helpers/base');

const testInfo = new TestData('wx');
describe('BaseEnv', () => {
  test('envs', async () => {
    const { BaseEnv } = (await testInfo.getData()).base;
    expect(BaseEnv.envs).toContain('wx');
  }, timeout);
  test('isWx', async () => {
    const { BaseEnv } = (await testInfo.getData()).base;
    expect(BaseEnv.isWx).toBe(true);
  }, timeout);
});
