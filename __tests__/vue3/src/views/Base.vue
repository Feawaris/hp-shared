<template>
  <div class="Base-root">
    <el-card header="总览">
      <header>
        <el-button @click="preview">base</el-button>
      </header>
      <AppValuesTable :value="base" :max-height="40 * 11"></AppValuesTable>
    </el-card>
    <el-card header="constants 常量">
      <AppValuesTable :value="constants"></AppValuesTable>
    </el-card>
    <el-card header="data 数据处理：Data">
      <header>
        <el-button v-for="[name, fn] in Object.entries(dataInfo)" :key="name" @click="fn">{{ name }}</el-button>
      </header>
      <el-card header="getExactType & getExactTypes">
        <AppValuesTable :max-height="40 * 11" :value="multiData" :columns="['name', 'value', 'typeof', 'Object.prototype.toString', 'jsminiType.type', 'Data.getExactType', 'Data.getExactTypes']"></AppValuesTable>
      </el-card>
    </el-card>
    <el-card header="native-extend 扩展内置对象">
      <el-button v-for="[name, fn] in Object.entries(nativeExtendInfo)" :key="name" @click="fn">{{ name }}</el-button>
    </el-card>
  </div>
</template>
<script>
  export default {
    // eslint-disable-next-line vue/no-reserved-component-names
    name: 'Base',
  };
</script>
<script setup>
  import { reactive } from 'vue';
  import { createTestsProxy, simpleData, multiData, names } from '@__tests__/shared';
  import * as base from 'hp-shared/base';
  import * as constants from 'hp-shared/src/base/constants.js';
  import { _Date, _Math, _Reflect, _String, _Object, Data } from 'hp-shared/base';
  import * as jsminiExtend from '@jsmini/extend';

  function preview() {
    console.group('base');
    console.table(Object.getOwnPropertyDescriptors(base));
    console.groupEnd();
  }
  const dataInfo = reactive(createTestsProxy({
    Data() {
      (function deepClone() {
        console.group('deepClone');

        const data1 = {
          array: [],
          object: {
            method: 'post',
            params: {
              prop1: 1,
              prop2: 2,
            },
          },
          get object_get() {
            return this.object.method;
          },
          set: new Set(),
          map: new Map(),
          _function() {},
        };
        const data2 = Data.deepClone(data1);
        console.log(data1, data2);

        (function() {
          console.group('===');

          console.log('array', data2.array === data1.array);
          console.log('object', data2.object === data1.object, data2.object.params === data1.object.params);
          console.log('object_get', data2.object_get === data1.object_get);
          console.log('set', data2.set === data1.set);
          console.log('map', data2.map === data1.map);
          console.log('_function', data2._function === data1._function);

          console.groupEnd();
        })();

        console.groupEnd();
      })();
    },
  }));
  const nativeExtendInfo = reactive(createTestsProxy({
    _Date() {
      console.warn('打开safari浏览器查看对比效果');
      const str = '2022-12-1';
      const nativeDate = new Date(str);
      const customDate = _Date.create(str);
      console.log({ nativeDate, customDate });
    },
    _Math() {
      const { log, lg, ln, E } = _Math;
      console.log('log(2,8)', log(2, 8));
      console.log('lg(100)', lg(100));
      console.log('ln(e^2)', ln(E ** 2));
    },
    _Object() {
      (function assign() {
        console.group('assign');
        // 生成测试对象
        function obj1() {
          return {
            get y() { return this.x + 1; },
            get showPassword() {
              return this.type === 'password';
            },
          };
        }
        function obj2() {
          return { x: 1, y: 1 };
        }
        // 对比 Object.assign 和 _Object.assign
        try {
          console.log(Object.assign(obj1(), obj2()));
        } catch (e) {
          console.error(e);
        }
        console.log(_Object.assign(obj1(), obj2()));
        console.log(_Object.assign(obj2(), obj1()));

        console.groupEnd();
      })();
      (function deepAssign() {
        console.group('deepAssign');

        function obj1() {
          return {
            method: 'post',
            params: {
              x: 1,
              get y() { return this.x + 1; },
            },
            extra: {
              options: {
                x: 1,
                get y() { return this.x + 1; },
              },
            },
          };
        }
        function obj2() {
          return {
            params: {
              x: 1,
              x2: 2,
            },
            extra: {
              options: {
                x: 1,
                x2: 2,
              },
            },
          };
        }
        // 测试重定义属性
        function obj3() {
          return {
            params: {
              y: 4,
            },
            extra: {
              options: {
                y: 4,
              },
            },
          };
        }

        console.log(jsminiExtend.extendDeep(obj1(), obj2()));
        console.log(_Object.deepAssign(obj1(), obj2()));
        try {
          console.log(jsminiExtend.extendDeep(obj1(), obj2(), obj3()));
        } catch (e) {
          console.error(e);
        }
        console.log(_Object.deepAssign(obj1(), obj2(), obj3()));

        console.groupEnd();
      })();
    },
    _Reflect() {
      console.log('ownKeys: ', _Reflect.ownKeys(simpleData));
      console.log('ownValues: ', _Reflect.ownValues(simpleData));
      console.log('ownEntries: ', _Reflect.ownEntries(simpleData));
    },
    _String() {
      console.table(names.map((name) => {
        return {
          name,
          'toLineCase': _String.toLineCase(name),
          'toCamelCase': _String.toCamelCase(name),
        };
      }));
    },
  }));
</script>
<style scoped lang="scss">
  .Base-root{}
</style>
