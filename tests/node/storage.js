const { _Date, clipboard } = require('hp-shared');

describe('clipboard', () => {
  test('test_copy_paste_copySync_pasteSync', async () => {
    let text = '你好，js:node:copy,paste';
    let textWrite = await clipboard.copy(text);
    let textRead = await clipboard.paste();
    expect(textWrite).toBe(text);
    expect(textRead).toBe(text);

    await _Date.sleep();

    text = '你好，js:node:copySync,pasteSync';
    textWrite = clipboard.copySync(text);
    textRead = clipboard.pasteSync();
    expect(textWrite).toBe(text);
    expect(textRead).toBe(text);
  });
});
