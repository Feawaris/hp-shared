<template>
  <div class="Index-root">
    <aside class="index-left">
      <el-menu v-bind="{ router: true, defaultActive: $route.name }">
        <el-menu-item v-bind="{ route: { name: 'home' }, index: 'home' }"><span>home 首页</span></el-menu-item>
        <el-menu-item v-bind="{ route: { name: 'base' }, index: 'base' }"><span>base 基础通用</span></el-menu-item>
        <el-menu-item v-bind="{ route: { name: 'network' }, index: 'network' }"><span>network 网络</span></el-menu-item>
        <el-menu-item v-bind="{ route: { name: 'storage' }, index: 'storage' }"><span>storage 存储</span></el-menu-item>
        <el-menu-item v-bind="{ route: { name: 'form' }, index: 'form' }"><span>form 表单</span></el-menu-item>
      </el-menu>
    </aside>
    <section class="index-right">
      <header class="index-right-header">header</header>
      <router-view #="{ Component }" class="index-right-main">
        <KeepAlive>
          <component :is="Component" :key="$route.fullPath"></component>
        </KeepAlive>
      </router-view>
      <footer class="index-right-footer">footer</footer>
    </section>
  </div>
</template>
<script>
  export default {
    name: 'Index',
  };
</script>
<script setup>
</script>
<style scoped lang="scss">
  .Index-root{display: flex;}
  // 左侧
  .index-left{width: 220px;display: flex;flex-direction: column;
    .el-menu{flex: 1;}
  }
  // 右侧
  .index-right{flex: 1;overflow: auto;display: flex;flex-direction: column;
    // 顶部
    &-header{line-height: 50px;text-align: center;background: #ebecee;color: #848586;}
    // 主显示区
    &-main :deep(){flex: 1;overflow: auto;padding: 10px;
       > * + *{margin-top: 10px;}
    }
    // 底部
    &-footer{line-height: 50px;text-align: center;background: #ebecee;color: #848586;}
  }
</style>
