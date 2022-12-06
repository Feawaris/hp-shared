// 剪贴板
/**
 * 复制文本旧写法。在 clipboard api 不可用时代替
 * @param text
 * @returns {Promise<Promise<void>|Promise<never>>}
 */
async function oldCopyText(text) {
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
  return success ? Promise.resolve() : Promise.reject();
}
export const clipboard = {
  /**
   * 写入文本(复制)
   * @param text
   * @returns {Promise<void>}
   */
  async writeText(text) {
    try {
      return await navigator.clipboard.writeText(text);
    } catch (e) {
      return await oldCopyText(text);
    }
  },
  /**
   * 读取文本(粘贴)
   * @returns {Promise<string>}
   */
  async readText() {
    return await navigator.clipboard.readText();
  },
};
