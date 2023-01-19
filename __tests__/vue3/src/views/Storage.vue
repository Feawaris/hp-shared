<template>
  <div class="Storage-root">
    <el-card header="总览">
      <header>
        <el-button @click="preview()">storage</el-button>
      </header>
      <AppValuesTable :value="storage"></AppValuesTable>
    </el-card>
    <el-card header="clipboard 剪贴板">
      <el-form :label-width="100">
        <el-form-item label="输入内容">
          <el-input v-model="clipboardInfo.text" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clipboardInfo.writeText()">复制</el-button>
          <el-button type="primary" @click="clipboardInfo.readText()">粘贴</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="cookie">
      <AppValuesTable :value="cookieInfo.data"></AppValuesTable>
      <el-form :label-width="100">
        <el-form-item label="操作">
          <el-button v-for="[name, fn] in Object.entries(cookieInfo.console)" @click="fn">{{ name }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="storage">
      <AppValuesTable :value="storageInfo.data"></AppValuesTable>
      <el-form :label-width="100">
        <el-form-item label="storage">
          <!-- 直接绑storage时el-option会同时选中无法切换，改成绑 storageName -->
          <el-select v-model="storageInfo.storageName">
            <el-option value="_localStorage"></el-option>
            <el-option value="_sessionStorage"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作">
          <el-button v-for="[name, fn] in Object.entries(storageInfo.console)" @click="fn">{{ name }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card header="indexedDB">
      <AppValuesTable :value="indexedDBInfo.data"></AppValuesTable>
      <el-form :label-width="100">
        <el-form-item label="操作">
          <el-button v-for="[name, fn] in Object.entries(indexedDBInfo.idbKeyvalInfo)" @click="fn">{{ name }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'Storage',
  };
</script>
<script setup>
  import { reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import * as storage from 'hp-shared/storage';
  import { clipboard, cookie, _localStorage, _sessionStorage, idbKeyval } from 'hp-shared/storage';
  import { createTestsProxy, simpleData } from '@__tests__/shared';

  function preview() {
    console.group('storage');
    console.table(Object.getOwnPropertyDescriptors(storage));
    console.groupEnd();
  }
  const clipboardInfo = reactive({
    text: `vue3_clipboard_${Date.now()}`,
    async writeText() {
      await clipboard.writeText(this.text);
      ElMessage.success('复制成功');
    },
    async readText() {
      try {
        const text = await clipboard.readText();
        this.text += text;
        ElMessage.success('粘贴成功');
      } catch (e) {
        console.dir(e);
        ElMessage.error(`${e.name} : ${e.message}`);
      }
    },
  });
  const cookieInfo = reactive({
    data: {
      cookie: document.cookie,
    },
    console: createTestsProxy({
      set() {
        cookie.set('simpleData', simpleData);
        for (const [name, value] of Object.entries(simpleData.toJSON())) {
          cookie.set(name, value);
        }
      },
      get() {
        console.log('get simpleData : ', cookie.get('simpleData'));
        for (const [name, value] of Object.entries(simpleData.toJSON())) {
          console.log(`get ${name} : `, cookie.get(name));
        }
      },
      remove() {
        cookie.remove('simpleData');
        for (const [name, value] of Object.entries(simpleData.toJSON())) {
          cookie.remove(name);
        }
      },
      create() {
        const newCookie = cookie.create({
          json: false,
          attributes: {
            expires: 3,
          },
        });
        console.log(cookie, newCookie);
        newCookie.set('newCookie_simpleData', simpleData);
        console.log(newCookie.get('newCookie_simpleData'));
      },
    }),
  });
  const storageInfo = reactive({
    data: {
      localStorage,
      sessionStorage,
    },
    storages: {
      _localStorage,
      _sessionStorage,
    },
    storageName: '_localStorage',
    get storage() {
      return this.storages[this.storageName];
    },
    console: createTestsProxy({
      set() {
        storageInfo.storage.set('simpleData', simpleData);
        for (const [key, value] of Object.entries(simpleData.toJSONWithUndefined())) {
          storageInfo.storage.set(key, value);
        }
      },
      get() {
        console.log('get simpleData : ', storageInfo.storage.get('simpleData'));
        for (const [name, value] of Object.entries(simpleData.toJSONWithUndefined())) {
          console.log(`get ${name} : `, storageInfo.storage.get(name));
        }
      },
      remove() {
        storageInfo.storage.remove('simpleData');
        for (const [name, value] of Object.entries(simpleData.toJSONWithUndefined())) {
          storageInfo.storage.remove(name);
        }
      },
      create() {
        const newStorage = storageInfo.storage.create({
          json: false,
        });
        console.log(storageInfo.storage, newStorage);
        newStorage.set('newStorage_simpleData', simpleData);
        console.log(newStorage.get('newStorage_simpleData'));
      },
    }),
  });
  const indexedDBInfo = reactive({
    data: {
      IDBFactory,
      IDBOpenDBRequest,
      IDBDatabase,

      IDBObjectStore,
      IDBTransaction,
      IDBRequest,
      IDBCursor,
      IDBCursorWithValue,
      IDBIndex,
      IDBKeyRange,

      IDBVersionChangeEvent,
    },

    idbKeyvalInfo: createTestsProxy({
      async set() {
        await idbKeyval.set('simpleData', simpleData.toJSONWithUndefined());
        for (const [key, value] of Object.entries(simpleData.toJSONWithUndefined())) {
          await idbKeyval.set(key, value);
        }
      },
      async get() {
        console.log('get simpleData : ', await idbKeyval.get('simpleData'));
        for (const [name, value] of Object.entries(simpleData.toJSONWithUndefined())) {
          console.log(`get ${name} : `, await idbKeyval.get(name));
        }
      },
      async remove() {
        idbKeyval.remove('simpleData');
        for (const [name, value] of Object.entries(simpleData.toJSONWithUndefined())) {
          await idbKeyval.remove(name);
        }
      },
      async update() {
        await idbKeyval.update('counter', (val) => (val || 0) + 1);
      },
    }),
  });
</script>
<style scoped lang="scss">
  .Storage-root{}
</style>
