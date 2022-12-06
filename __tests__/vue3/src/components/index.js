/**
 * 全局组件 以 AppName 方式命名以便和局部组件区分。当前目录存放全局组件，局部组件放对应模块的 components 目录
 * Glob 导入：https://cn.vitejs.dev/guide/features.html#glob-import
 * 其他项目无法直接引当前文件进行一键导入，需要新建文件进行glob导入，同时vue组件中注意路径别名问题
 */
const globComponents = import.meta.glob(['./App*.vue', './**/App*.vue'], { eager: true });
export function install(app) {
  for (const esm of Object.values(globComponents)) {
    for (const component of Object.values(esm)) {
      app.component(component.name, component);
    }
  }
}
export const componentsWithInstall = { ...globComponents, install };
export default componentsWithInstall;
