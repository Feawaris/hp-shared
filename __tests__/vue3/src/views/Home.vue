<template>
  <div class="Home-root">
    <el-card header="总览">
      <header>
        <el-button @click="preview">shared</el-button>
      </header>
      <AppValuesTable :value="shared"></AppValuesTable>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'Home',
  };
</script>
<script setup>
  import * as shared from 'hp-shared';

  function preview() {
    console.group('shared');
    console.table(Object.getOwnPropertyDescriptors(shared));
    console.groupEnd();
  }
</script>
<style scoped lang="scss">
  .Home-root{}
</style>
