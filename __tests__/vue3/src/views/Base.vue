<template>
  <div class="Base-root">
    <el-card header="总览">
      <header>
        <el-button @click="preview">base</el-button>
      </header>
      <AppValuesTable :value="base" :max-height="40 * 11"></AppValuesTable>
    </el-card>
    <el-card header="objects 扩展对象">
      <el-card v-for="[name, obj] in Object.entries(objectsInfo)" :header="name">
        <header>
          <el-button v-for="[fnName, fn] in Object.entries(obj)" @click="fn">{{ fnName }}</el-button>
        </header>
        <template v-if="name === '_String'">
          <el-table :data="namesTable">
            <el-table-column v-bind="{ type: 'index', label: '序号', width: 60, align: 'center' }"></el-table-column>
            <el-table-column #="{row}" v-bind="{ label: 'name', prop: 'name' }">
              <el-input v-show="row.editable" v-model="row.name" clearable></el-input>
              <AppValue v-show="!row.editable" :value="row.name"></AppValue>
            </el-table-column>
            <el-table-column #="{row}" v-bind="{ label: 'toLineCase', prop: 'toLineCase' }">
              <AppValue :value="row.toLineCase"></AppValue>
            </el-table-column>
            <el-table-column #="{row}" v-bind="{ label: 'toCamelCase', prop: 'toCamelCase' }">
              <AppValue :value="row.toCamelCase"></AppValue>
            </el-table-column>
          </el-table>
        </template>
        <template v-if="name === 'Data'">
          <el-card header="getExactType & getExactTypes">
            <AppValuesTable :max-height="40 * 11" :value="multiData" :columns="['name', 'value', 'typeof', 'Object.prototype.toString', 'jsminiType.type', 'Data.getExactType', 'Data.getExactTypes']"></AppValuesTable>
          </el-card>
        </template>
      </el-card>
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
  import { names } from '@root/modules/base/_String';
  import { multiData, simpleData } from '@root/modules/base/Data.js';
  import { createTestsProxy } from '@root/modules';
  import { reactive } from 'vue';
  import * as base from 'hp-shared/base';
  import { _Date, _Math, _Reflect, _String, _Object, Data } from 'hp-shared/base';
  import * as jsminiExtend from '@jsmini/extend';
  import _ from 'loadsh';

  function preview() {
    console.group('base');
    console.table(Object.getOwnPropertyDescriptors(base));
    console.groupEnd();
  }
  const objectsInfo = reactive({
    _Date: createTestsProxy({
      create() {
        console.warn('打开safari浏览器查看对比效果');
        const str = '2022-12-1';
        const data1 = new Date(str);
        const data2 = new _Date(str);
        console.log({
          data1,
          data2,
        });
      },
    }),
    _Math: createTestsProxy({
      methods() {
        const { log, lg, ln } = _Math;
        const { E } = Math;
        console.log('log(2,8)', log(2, 8));
        console.log('lg(100)', lg(100));
        console.log('ln(e^2)', ln(E ** 2));
      },
    }),
    _Object: createTestsProxy({
      assign() {
        // 生成测试对象
        function obj1() {
          return {
            type: 'text',
            get showPassword() {
              return this.type === 'password';
            },
          };
        }
        function obj2() {
          return {
            type: 'password',
            showPassword: false,
          };
        }
        // 对比 Object.assign 和 _Object.assign
        try {
          // 直接赋值会报 TypeError: Cannot set property showPassword of #<Object> which has only a getter
          console.log(Object.assign(obj1(), obj2()));
        } catch (e) {
          console.error(e);
        }
        // 使用重定义方式修改
        console.log(_Object.assign(obj1(), obj2()));
        console.log(_Object.assign(obj2(), obj1()));
      },
      deepAssign() {
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
              x: 2,
              y: 6,
            },
            extra: {
              options: {
                x: 2,
                y: 6,
              },
            },
          };
        }
        try {
          // 直接赋值会报 TypeError: Cannot set property y of #<Object> which has only a getter
          console.log(jsminiExtend.extendDeep(obj1(), obj2()));
        } catch (e) {
          console.error(e);
        }
        console.log(_Object.deepAssign(obj1(), obj2()));
      },
      owner() {
        const obj = { x: 1 };
        const obj_obj = Object.assign(Object.create(obj), {
          y: 2,
        });
        console.log(_Object.owner(Object.create(null), 'xx'));
        console.log(_Object.owner(obj, 'x') === obj);
        console.log(_Object.owner(obj_obj, 'x') === obj);
      },
      keys() {
        const symbol1 = Symbol('1');
        const obj = { a: 1, [symbol1]: symbol1 };
        Object.defineProperty(obj, 'notEnumerable', { value: '1' });
        console.log(_Object.keys(obj));
        console.log(_Object.keys(obj, { symbol: true, notEnumerable: true, extend: true }));

        const symbol2 = Symbol('2');
        const obj_obj = Object.assign(Object.create(obj), {
          b: 2,
          [symbol2]: symbol2,
        });
        console.log(_Object.keys(obj_obj));
        console.log(_Object.keys(obj_obj, { symbol: true, notEnumerable: true, extend: true }));
      },
      descriptors() {
        const symbol1 = Symbol('1');
        const obj = { a: 1, [symbol1]: symbol1 };
        Object.defineProperty(obj, 'notEnumerable', { value: '1' });
        console.log(_Object.descriptors(obj));
        console.log(_Object.descriptors(obj, { symbol: true, notEnumerable: true, extend: true }));

        const symbol2 = Symbol('2');
        const obj_obj = Object.assign(Object.create(obj), {
          b: 2,
          [symbol2]: symbol2,
        });
        console.log(_Object.descriptors(obj_obj));
        console.log(_Object.descriptors(obj_obj, { symbol: true, notEnumerable: true, extend: true }));
      },
      descriptorEntries() {
        const symbol1 = Symbol('1');
        const obj = { a: 1, [symbol1]: symbol1 };
        Object.defineProperty(obj, 'notEnumerable', { value: '1' });
        console.log(_Object.descriptorEntries(obj));
        console.log(_Object.descriptorEntries(obj, { symbol: true, notEnumerable: true, extend: true }));

        const symbol2 = Symbol('2');
        const obj_obj = Object.assign(Object.create(obj), {
          b: 2,
          [symbol2]: symbol2,
        });
        console.log(_Object.descriptorEntries(obj_obj));
        console.log(_Object.descriptorEntries(obj_obj, { symbol: true, notEnumerable: true, extend: true }));
      },
      filter() {
        const obj = {
          pageSize: 10,
          pageIndex: 1,
          total: 0,
        };
        console.log(_Object.filter(obj, { omit: 'total' }));
      },
      pick() {
        const obj = {
          pageSize: 10,
          pageIndex: 1,
          total: 0,

          get statusName() {
            return `statusName_${this.status}`;
          },
        };
        const symbol = Symbol('obj_obj');
        const obj_obj = Object.assign(Object.create(obj), {
          keyword: '',

          status: 1,
          [symbol]: symbol,
        });
        console.log(_.pick(obj_obj, []));
        console.log(_Object.pick(obj_obj, []));
        console.log(_.pick(obj_obj, ['keyword', 'status', 'total', 'statusName', symbol]));
        console.log(_Object.pick(obj_obj, ['keyword', 'status', 'total', 'statusName', symbol]));
      },
      omit() {
        const obj = {
          pageSize: 10,
          pageIndex: 1,
          total: 0,

          get statusName() {
            return `statusName_${this.status}`;
          },
        };
        Object.defineProperty(obj, 'notEnumerable', { value: '1' });
        const symbol = Symbol('obj_obj');
        const obj_obj = Object.assign(Object.create(obj), {
          keyword: '',

          status: 1,
          [symbol]: symbol,
        });
        Object.defineProperty(obj_obj, 'notEnumerable', { value: '2' });

        console.log(_.omit(obj_obj, []));
        console.log(_Object.omit(obj_obj, []));
        console.log(_.omit(obj_obj, ['total']));
        console.log(_Object.omit(obj_obj, ['total']));
      },
    }),
    _Reflect: createTestsProxy({
      ownKeys() {
        console.log(Reflect.ownKeys(simpleData));
      },
      ownValues() {
        console.log(_Reflect.ownValues(simpleData));
      },
      ownEntries() {
        console.log(_Reflect.ownEntries(simpleData));
      },
    }),
    _String: createTestsProxy({
      methods() {
        console.table(JSON.parse(JSON.stringify(namesTable)));
      },
    }),
    Data: createTestsProxy({
      deepClone() {
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
      },
    }),
  });
  function createNameItem(name, { editable } = {}) {
    return {
      name,
      get toLineCase() {
        return _String.toLineCase(this.name);
      },
      get toCamelCase() {
        return _String.toCamelCase(this.name);
      },
      editable,
    };
  }
  const namesTable = reactive(names.map(name => createNameItem(name, { editable: false })).concat(createNameItem('on-change', { editable: true })));
</script>
<style scoped lang="scss">
  .Base-root{}
</style>
