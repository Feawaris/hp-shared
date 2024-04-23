const path = require('path');
const html = `file://${path.resolve(__dirname, '../index.html')}`;

describe('BaseEnv', () => {
  beforeAll(async () => {
    await page.goto(html);
  });
  test('envs', async () => {
    const { base: { BaseEnv } } = await page.evaluate(async () => {
      return window.hpShared;
    });
    expect(BaseEnv.envs).toContain('browser');
  });
  test('isBrowser', async () => {
    const { base: { BaseEnv } } = await page.evaluate(async () => {
      return window.hpShared;
    });
    expect(BaseEnv.isBrowser).toBe(true);
  });
});
