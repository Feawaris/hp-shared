const { TestData, timeout } = require('shared');

const testInfo = new TestData('browser');
describe('clipboard', () => {
  test('test_copy_paste', async () => {
    const {
      storage: {
        clipboard: {
          text, textWrite, textRead,
        },
      },
    } = await testInfo.getData();
    expect(textWrite).toBe(text);
    expect(textRead).toBe(text);
  }, timeout);
});
