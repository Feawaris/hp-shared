import { clipboard } from '../../node_modules/hp-shared/dist/deno/storage.js';

console.log(clipboard);

// useClipboard
await clipboard.writeText(`deno_clipboard_${Date.now()}`);
console.log('复制成功');
console.log(await clipboard.readText());
console.log('粘贴成功');
