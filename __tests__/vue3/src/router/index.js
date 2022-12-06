import { createRouter, createWebHashHistory } from 'vue-router';
// routes 各页面路由
// 各模块路由：通过glob导入进来，可根据接口返回筛选成动态路由
const staticRoutes = Object.values(import.meta.glob('../views/**/routes.js', { eager: true }))
  .map((esm) => esm.default || [])
  .flat();
export const routes = [
  // 根路径
  { path: '/', name: 'Root', redirect: '/index' },
  // 需登录进来的各页面
  {
    path: '/index', name: 'index', component: () => import('@/views/Index.vue'), redirect: '/Home',
    // 从view下的其他模块目录导入进来
    children: [
      // 首页
      { path: '/Home', name: 'Home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
      // 先全部加进来再用removeRoute方式实现动态路由
      ...staticRoutes,
    ],
  },
  // 错误页，404页面放最后以匹配*
  { path: '/404', component: () => import('@/views/error/404.vue'), meta: { title: '404' } },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/error/404.vue') },
];
// router
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
