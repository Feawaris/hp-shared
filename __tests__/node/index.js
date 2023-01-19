const shared = require('hp-shared');
console.log(shared);

// 剪贴板方法测试
const { clipboard, nodeClipboardy } = require('hp-shared/storage');
console.log({ clipboard, nodeClipboardy });
(function useClipboardy() {
  return;
  nodeClipboardy.writeSync(`node_nodeClipboardy_${Date.now()}`);
  console.log('nodeClipboardy 复制成功');
  console.log(nodeClipboardy.readSync());
  console.log('nodeClipboardy 粘贴成功');
})();
// 同时执行可能会导致上一条复制在剪贴板中找不到记录，延迟一下
setTimeout(async function useClipboard() {
  return;
  await clipboard.writeText(`node_clipboard_${Date.now()}`);
  console.log('clipboard 复制成功');
  console.log(await clipboard.readText());
  console.log('clipboard 粘贴成功');
}, 300);
