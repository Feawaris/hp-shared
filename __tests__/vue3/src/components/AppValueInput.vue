<template>
  <div class="AppValueInput-root">
    <el-select v-model="defaultInfo.type" clearable filterable placeholder="选择类型" :class="{ hasColor }" @change="defaultInfo.onChange($event)">
      <el-option v-for="item in defaultInfo.typeList" :key="item.value" :value="item.value" :label="getExactType(item.value) === Function ? item.value.name : String(item.value)" :style="item.style"></el-option>
    </el-select>
    <div class="values-right">
      <span v-show="[null, undefined].includes(defaultInfo.type)" style="color:#999;">{{ String(defaultInfo.value) }}</span>
      <el-input v-show="defaultInfo.type === String" v-model="defaultInfo.value" clearable></el-input>
      <el-input-number v-show="defaultInfo.type === Number" v-model="defaultInfo.value"></el-input-number>
      <el-radio-group v-show="defaultInfo.type === Boolean" v-model="defaultInfo.value">
        <el-radio :label="true"></el-radio>
        <el-radio :label="false"></el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AppValueInput',
  };
</script>
<script setup>
  import { reactive } from 'vue';

  const props = defineProps({
    // 是否彩色显示，当子组件el-option有颜色时显示对应选项样式，注意只对style属性有效，el-option中的自定义指令无法获取
    hasColor: { type: Boolean, default: true },
    // v-model
    modelValue: {},
    types: { type: Array, default() { return []; } },
  });
  const emit = defineEmits(['update:modelValue']);
  const defaultInfo = reactive({
    type: String,
    typeList: [
      { value: null, style: { color: '#999' } },
      { value: undefined, style: { color: '#999' } },
      { value: Number, style: { color: '#409eff' } },
      { value: String, style: { color: '#409eff' } },
      { value: Boolean, style: { color: '#409eff' } },
    ],
    // 当前选中项，style标签中有用到，编辑器可能无法识别而报常量未使用警告
    get selectedOption() {
      return this.typeList.find(obj => obj.value === this.type);
    },
    onChange(val) {
      this.value = [null, undefined].includes(val) ? val : val();
    },
    get value() { return props.modelValue; },
    set value(val) {
      emit('update:modelValue', val);
    },
  });
</script>
<style scoped lang="scss">
  .AppValueInput-root{display: flex;align-items: center;
    > *{flex: 1}
    > * + *{margin-left: 5px;}
    .hasColor:deep(.el-input__inner){color: v-bind("defaultInfo.selectedOption?.style?.color");}
  }
  .values-right{
    > *{width: 100%;}
  }
</style>
