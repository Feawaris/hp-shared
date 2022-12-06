<template>
  <div class="Network-root">
    <el-card header="总览">
      <header>
        <el-button @click="preview">network</el-button>
      </header>
      <AppValuesTable :value="network"></AppValuesTable>
    </el-card>
    <el-card header="METHODS & STATUSES 各方法和状态码测试">
      <el-form :label-width="100">
        <el-form-item label="method">
          <el-select v-model="statusInfo.method" filterable clearable @change="statusInfo.request">
            <el-option v-for="item in METHODS" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="status">
          <el-select v-model="statusInfo.status" filterable clearable @change="statusInfo.request">
            <el-option v-for="item in STATUSES" :key="item.status" :value="item.status"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="statusInfo.request">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <AppValuesTable :value="obj"></AppValuesTable>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'Network',
  };
</script>
<script setup>
  import { _Proxy } from 'hp-shared/base';
  import { reactive } from 'vue';
  import * as network from 'hp-shared/network';
  import { METHODS, STATUSES } from 'hp-shared/network';
  import axios from 'axios';

  function preview() {
    console.group('network');
    console.table(Object.getOwnPropertyDescriptors(network));
    console.groupEnd();
  }
  const statusInfo = reactive(_Proxy.bindThis({
    method: 'GET',
    status: 200,
    async request() {
      const response = await fetch(`http://localhost:36500/api/shared/network/statuses?status=${this.status}`, {
        method: this.method,
      });
      console.log(response);
      console.log(Object.fromEntries(response.headers));
      console.log(await response.json());
    },
  }));
  const obj = {
    XMLHttpRequest,
    XMLHttpRequestUpload,
    XMLHttpRequestEventTarget,
    fetch,
    axios,
    xhr: new XMLHttpRequest(),
  };
</script>
<style scoped lang="scss">
  .Network-root{}
</style>
