const { clipboard, nodeClipboardy } = require('hp-shared/storage');

console.log({ clipboard, nodeClipboardy });

(async function useClipboard() {
  await clipboard.writeText(`node_clipboard_${Date.now()}`);
  console.log('clipboard 复制成功');
  console.log(await clipboard.readText());
  console.log('clipboard 粘贴成功');
})();
