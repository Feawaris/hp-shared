/*!
 * hp-shared v0.1.0
 * (c) 2022 hp
 * Released under the MIT License.
 */ 

/*
 * rollup 打包配置：{"format":"cjs","sourcemap":"inline"}
 */
  
'use strict';

const nodeClipboardy = require('node-clipboardy');

const clipboard = {
// 对应浏览器端同名方法，减少代码修改
  /**
   * 写入文本(复制)
   * @param text
   * @returns {Promise<void>}
   */
  async writeText(text) {
    // 转换成字符串防止 clipboardy 报类型错误
    const textResult = String(text);
    return await nodeClipboardy.write(textResult);
  },
  /**
   * 读取文本(粘贴)
   * @returns {Promise<string>}
   */
  async readText() {
    return await nodeClipboardy.read();
  },
};

exports.clipboard = clipboard;
exports.nodeClipboardy = nodeClipboardy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0b3JhZ2Uvbm9kZS9jbGlwYm9hcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm9kZUNsaXBib2FyZHkgPSByZXF1aXJlKCdub2RlLWNsaXBib2FyZHknKTtcbi8vIOeUqOWIsOeahOW6k+S5n+WvvOWHuuS+v+S6juiHquihjOmAieeUqFxuZXhwb3J0IHsgbm9kZUNsaXBib2FyZHkgfTtcblxuZXhwb3J0IGNvbnN0IGNsaXBib2FyZCA9IHtcbi8vIOWvueW6lOa1j+iniOWZqOerr+WQjOWQjeaWueazle+8jOWHj+WwkeS7o+eggeS/ruaUuVxuICAvKipcbiAgICog5YaZ5YWl5paH5pysKOWkjeWItilcbiAgICogQHBhcmFtIHRleHRcbiAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gICAqL1xuICBhc3luYyB3cml0ZVRleHQodGV4dCkge1xuICAgIC8vIOi9rOaNouaIkOWtl+espuS4sumYsuatoiBjbGlwYm9hcmR5IOaKpeexu+Wei+mUmeivr1xuICAgIGNvbnN0IHRleHRSZXN1bHQgPSBTdHJpbmcodGV4dCk7XG4gICAgcmV0dXJuIGF3YWl0IG5vZGVDbGlwYm9hcmR5LndyaXRlKHRleHRSZXN1bHQpO1xuICB9LFxuICAvKipcbiAgICog6K+75Y+W5paH5pysKOeymOi0tClcbiAgICogQHJldHVybnMge1Byb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHJlYWRUZXh0KCkge1xuICAgIHJldHVybiBhd2FpdCBub2RlQ2xpcGJvYXJkeS5yZWFkKCk7XG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFLLE1BQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtBQUdsRDtBQUNZLE1BQUMsU0FBUyxHQUFHO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsTUFBTSxTQUFTLENBQUMsSUFBSSxFQUFFO0FBQ3hCO0FBQ0EsSUFBSSxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEMsSUFBSSxPQUFPLE1BQU0sY0FBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsRCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE1BQU0sUUFBUSxHQUFHO0FBQ25CLElBQUksT0FBTyxNQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2QyxHQUFHO0FBQ0g7Ozs7OyJ9
