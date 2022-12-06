<!--  -->
<template>
  <div class="Form-root">
    <el-card>
      <el-form :label-width="100">
        <el-form-item label="username">
          <!-- type="new-text" 兼容 firefox -->
          <el-input v-model="formInfo.model.username" type="new-text"></el-input>
        </el-form-item>
        <el-form-item label="password">
          <el-input v-model="formInfo.model.password" type="new-password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="formInfo.submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  export default {
    // eslint-disable-next-line vue/no-reserved-component-names
    name: 'Form',
  };
</script>
<script setup>
  import { _Proxy } from 'hp-shared/src/base/index.js';
  import { reactive } from 'vue';
  const formInfo = reactive(_Proxy.bindThis({
    model: {
      username: '',
      password: '',
    },
    rules: {},
    submit() {
      console.log('submit', this.model);
    },
  }));
</script>
<style scoped lang="scss">
  .Form-root{}
</style>
