import * as shared from './node_modules/hp-shared/dist/browser/index.js';
console.log(shared);

// 剪贴板方法测试
import * as clipboard from 'https://deno.land/x/copy_paste/mod.ts';
console.log(clipboard);
(async function useClipboard() {
  return;
  await clipboard.writeText(`deno_clipboard_${Date.now()}`);
  console.log('clipboard 复制成功');
  console.log(await clipboard.readText());
  console.log('clipboard 粘贴成功');
})();
