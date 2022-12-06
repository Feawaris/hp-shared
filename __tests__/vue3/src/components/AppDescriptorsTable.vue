<!-- 常用于总览显示 getOwnPropertyDescriptors 得到的对象 -->
<template>
  <el-table
    class="AppDescriptorsTable-root"
    v-bind="tablePropsResult"
  >
    <el-table-column v-bind="{ type: 'index', label: '序号', width: 60, align: 'center' }"></el-table-column>
    <el-table-column #="{ row }" v-bind="{ label: 'name', prop: 'name', showOverflowTooltip: true }">
      <AppValue :value="row.name"></AppValue>
    </el-table-column>
    <el-table-column v-bind="{ label: 'desc', align: 'center' }">
      <el-table-column v-if="tablePropsResult.data.some(obj => 'value' in obj.desc)" #="{ row }" v-bind="{ label: 'value', prop: 'desc.value', showOverflowTooltip: true }">
        <AppValue :hasProp="'value' in row.desc" :value="row.desc.value"></AppValue>
      </el-table-column>
      <el-table-column v-if="tablePropsResult.data.some(obj => 'get' in obj.desc)" #="{ row }" v-bind="{ label: 'get', prop: 'desc.get' }">
        <AppValue :hasProp="'get' in row.desc" :value="row.desc.get"></AppValue>
      </el-table-column>
      <el-table-column v-if="tablePropsResult.data.some(obj => 'set' in obj.desc)" #="{ row }" v-bind="{ label: 'set', prop: 'desc.set' }">
        <AppValue :hasProp="'set' in row.desc" :value="row.desc.set"></AppValue>
      </el-table-column>
      <el-table-column #="{ row }" v-bind="{ label: 'writable', prop: 'desc.writable', width: 120, align: 'center' }">
        <AppValue :value="row.desc.writable"></AppValue>
      </el-table-column>
      <el-table-column #="{ row }" v-bind="{ label: 'enumerable', prop: 'desc.enumerable', width: 120, align: 'center' }">
        <AppValue :value="row.desc.enumerable"></AppValue>
      </el-table-column>
      <el-table-column #="{ row }" v-bind="{ label: 'configurable', prop: 'desc.configurable', width: 120, align: 'center' }">
        <AppValue :value="row.desc.configurable"></AppValue>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    name: 'AppDescriptorsTable',
  };
</script>
<script setup>
  import { computed, useAttrs } from 'vue';
  import { _Reflect } from 'hp-shared/base';

  const props = defineProps({
    // 原始数据，传import进来的对象即可
    value: { type: Object },
  });
  const attrs = useAttrs();
  const tablePropsResult = computed(() => {
    return {
      border: true,
      maxHeight: 40 * 11,
      ...attrs,
      data: _Reflect.ownEntries(Object.getOwnPropertyDescriptors(props.value)).map(([name, desc]) => {
        return {
          name,
          desc,
        };
      }),
    };
  });
</script>
<style scoped lang="scss">
  .AppDescriptorsTable-root{}
</style>
