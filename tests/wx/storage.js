const { TestData, timeout } = require('shared');

const testInfo = new TestData('wx');
describe('clipboard', () => {
  test('copy', async () => {
    const {
      storage: {
        clipboard: {
          copyText, copyTextRes,
        },
      },
    } = await testInfo.getData();
    expect(copyTextRes).toBe(copyText);
  }, timeout);
  test('paste', async () => {
    const {
      storage: {
        clipboard: {
          pasteText, pasteTextRes,
        },
      },
    } = await testInfo.getData();
    expect(pasteTextRes).toBe(pasteText);
  }, timeout);
});
