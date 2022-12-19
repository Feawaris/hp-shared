<!-- 数据总览用 -->
<template>
  <el-table
    class="AppValuesTable-root"
    v-bind="tablePropsResult"
  >
    <el-table-column v-bind="{ type: 'index', label: '序号', width: 60, align: 'center' }"></el-table-column>
    <el-table-column #="{row}" v-bind="{ type: 'expand' }">
      <div v-if="Object.keys(row.value).length" style="padding:0 60px;">
        <AppValuesTable :value="row.value"></AppValuesTable>
      </div>
    </el-table-column>
    <el-table-column v-for="prop in columnsResult" #="{ row }" v-bind="{ label: prop, prop, showOverflowTooltip: true }">
      <AppValue :value="row[prop]"></AppValue>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    name: 'AppValuesTable',
  };
</script>
<script setup>
  import { ElTable } from 'element-plus';
  import { Data } from 'hp-shared/base';
  import { computed, useAttrs } from 'vue';
  import { getValues } from '@__tests__/shared';
  const props = defineProps({
    // 原始数据，传import进来的对象即可
    value: { type: Object, default() { return {}; } },
    // 要显示的列
    columns: {
      type: [Array, String],
      default() {
        return ['name', 'value', 'Data.getExactTypes'];
      },
    },
  });
  const attrs = useAttrs();
  const tablePropsResult = computed(() => {
    return {
      border: true,
      defaultExpandAll: false,
      ...attrs,
      data: getValues(props.value),
      // 展开按钮显示状态
      cellClassName({ row, column }) {
        if (column.type === 'expand') {
          return !Data.SIMPLE_TYPES.includes(Data.getExactType(row.value)) && Object.keys(row.value).length > 0 ? '' : 'hide-cell';
        }
        return '';
      },
    };
  });
  const columnsResult = computed(() => {
    return props.columns.filter(val => ['name', 'value', 'typeof', 'Object.prototype.toString', 'jsminiType.type', 'Data.getExactType', 'Data.getExactTypes'].includes(val));
  });
</script>
<style scoped lang="scss">
  .AppValuesTable-root{}
  // 展开按钮显示状态
  :deep(.hide-cell) .cell{display: none;}
</style>
