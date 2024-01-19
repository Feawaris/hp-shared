export const clipboard = Object.create(null);

/**
 * 写入文本(复制)：异步
 * @param text
 * @returns {Promise<void>}
 */
clipboard.writeText = async function(text = '') {
  text = String(text);
  try {
    await navigator.clipboard.writeText(text);
    // 返回
    return text;
  } catch (e) {
    // 复制文本旧写法，在 clipboard api 不可用时代替
    return await (async function oldCopyText() {
      // 新建输入框
      const textarea = document.createElement('textarea');
      // 赋值
      textarea.value = text;
      // 样式设置
      Object.assign(textarea.style, {
        position: 'fixed',
        top: 0,
        clipPath: 'circle(0)',
      });
      // 加入到页面
      document.body.append(textarea);
      // 选中
      textarea.select();
      // 复制
      const success = document.execCommand('copy');
      // 从页面移除
      textarea.remove();
      // 返回
      return success ? Promise.resolve(text) : Promise.reject();
    })();
  }
};
/**
 * 读取文本(粘贴)：异步
 * @returns {Promise<string>}
 */
clipboard.readText = async function() {
  return await navigator.clipboard.readText();
};
// 浏览器端没有 sync 写法

/**
 * 简写方式
 */
clipboard.copy = clipboard.writeText.bind(clipboard);
clipboard.paste = clipboard.readText.bind(clipboard);
