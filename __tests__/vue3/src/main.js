/**
 * 1.vue
 */
import { createApp } from 'vue';
import App from '@/App.vue';
const app = createApp(App);
import router from '@/router';
app.use(router);
/**
 * 2.UI框架
 */
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn';
app.use(ElementPlus, {
  locale: zhCn,
});
/**
 * 3.其他全局挂载，全局组件、各种框架、挂载到window 等
 */
import * as shared from 'hp-shared';
import * as base from 'hp-shared/base';
import * as webStorage from 'hp-shared/src/storage/browser/storage.js';
const commonGlobal = {
  AsyncFunction: base._Data.getExactType(async function() {}),
  ...base,
  ...webStorage,
};
const vueGlobal = {
  window,
  globalThis,
  Function,
  Symbol,
};
const windowGlobal = {
  shared,
};
Object.assign(app.config.globalProperties, commonGlobal, vueGlobal);
Object.assign(window, commonGlobal, windowGlobal);
// 全局组件
import appComponents from '@/components';
app.use(appComponents);
/**
 * 4.全局样式，在其他框架的全局样式之后引用
 */
import '@/styles/index.scss';
/**
 * 5.vue实例挂载：
 */
app.mount('#app');
/**
 * 6.调试选项设置
 */
// 显示常用信息便于调试
console.log('import.meta.env: ', import.meta.env);
