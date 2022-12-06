export default [
  { path: '/home', name: 'home', component: () => import('@/views/Home.vue') },
  { path: '/base', name: 'base', component: () => import('@/views/Base.vue') },
  { path: '/network', name: 'network', component: () => import('@/views/Network.vue') },
  { path: '/storage', name: 'storage', component: () => import('@/views/Storage.vue') },
  { path: '/form', name: 'form', component: () => import('@/views/Form.vue') },
];
