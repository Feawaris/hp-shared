<!-- 对不同类型的值加样式显示 -->
<template>
  <div class="AppValue-root">
    <!-- 无属性时为隐式 undefined 显示空 -->
    <div v-if="!hasProp"></div>
    <!-- null 和显式的 undefined -->
    <div v-else-if="[null, undefined].includes(_Data.getExactType(value))" style="color:#999;">{{ String(value) }}</div>
    <div v-else-if="[Symbol].includes(_Data.getExactType(value))" style="color:#722ed1;">{{ value }}</div>
    <div v-else-if="[String].includes(_Data.getExactType(value))" style="color:#fec66d;">'{{ value }}'</div>
    <!-- 通过 new Boolean 方式声明的值直接判断会得到 true，需要用 valueOf 方法得到原始值 -->
    <div v-else-if="[Boolean].includes(_Data.getExactType(value))" :style="{ 'color': value.valueOf() ? '#67c23a' : '#f56c6c' }">{{ value }}</div>
    <div v-else-if="[Function, AsyncFunction].includes(_Data.getExactType(value))" style="font-style: italic;color:#409eff;">{{ value.name || '[anonymous]' }}</div>
    <div v-else-if="[Array].includes(_Data.getExactType(value))" style="color:#abc;">
      <div style="display: flex;">
        <i>[&nbsp;</i>
        <template v-for="(val, valIndex) in value">
          <AppValue :value="val"></AppValue>
          <em v-if="valIndex < value.length - 1">,&nbsp;</em>
        </template>
        <i>&nbsp;]</i>
      </div>
    </div>
    <div v-else>
      <!-- 加操作转换防止 template 中转换字符串 Module 类型([Object: null prototype])报 Uncaught TypeError: Cannot convert object to primitive value -->
      <template v-if="value[Symbol.toPrimitive] || value.toString || value.valueOf">{{ value }}</template>
      <template v-else>{{ Object.fromEntries(_Reflect.ownEntries(value)) }}</template>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AppValue',
  };
</script>
<script setup>
  const props = defineProps({
    // 辅助value判断，区分无属性和显式 undefined 的属性，如 in 运算符
    hasProp: { default: true },
    // 传入值
    value: {},
  });
</script>
<style scoped lang="scss">
  .AppValue-root{}
</style>
