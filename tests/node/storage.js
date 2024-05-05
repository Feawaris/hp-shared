const { _Date } = require('hp-shared/base');
const { clipboard } = require('hp-shared/storage');

describe('clipboard', () => {
  test('copy', async () => {
    const copyText = `node:copy`;
    const copyTextRes = await clipboard.copy(copyText);
    expect(copyTextRes).toBe(copyText);
  });
  test('paste', async () => {
    const pasteText = `node:paste`;
    await clipboard.copy(pasteText);
    const pasteTextRes = await clipboard.paste();
    expect(pasteTextRes).toBe(pasteText);
  });
  test('copySync', async () => {
    const copyText = `node:copySync`;
    const copyTextRes = clipboard.copySync(copyText);
    expect(copyTextRes).toBe(copyText);
  });
  test('pasteSync', async () => {
    const pasteText = `node:pasteSync`;
    await clipboard.copy(pasteText);
    const pasteTextRes = clipboard.pasteSync();
    expect(pasteTextRes).toBe(pasteText);
  });
});
