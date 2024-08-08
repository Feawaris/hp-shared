const { localConfig } = window.testsShared;

window.appMonitor = new Monitor({
  reportUrl: `${localConfig.remoteURL}/performance`,
  appInfo: {
    name: 'browser',
    version: '1.12.0',
  },
})
  .watchResourceError()
  .watchCodeError()
  .watchPromiseError()
  .watchRequestError()
  .watchRouteChange();
window.addEventListener('DOMContentLoaded', function () {
  // vue2
  (function () {
    const Vue = window.Vue2;
    window.appMonitor.watchVueError(Vue);
    const app = new Vue({
      data(vm) {
        return {
          message: 'hello vue2',
          click() {
            throw new Error('vue2 error');
          },
        };
      },
    });
    app.$mount('#vue2');
    window.vue2App = app;
  })();
  // vue3
  (function () {
    const { createApp } = window.Vue3;
    const app = createApp({
      setup() {
        return {
          message: 'hello vue3',
          click() {
            throw new Error('vue3 error');
          },
        };
      },
    });
    window.appMonitor.watchVueError(app);
    app.mount('#vue3');
    window.vue3App = app;
  })();

  // 反馈给 jest 测试用
  if (location.search.includes('runTest=true')) {
    window.examples.test();
  }
});
window.examples = {
  // 反馈给 jest 测试用
  async test() {
    const text = `你好，js:browser:copy,paste`;
    const textWrite = await clipboard.copy(text);
    const textRead = await clipboard.paste();
    const { __filename, __dirname } = useNodeGlobals();
    _console.log({ __filename, __dirname });

    const res = await fetch(`${localConfig.remoteURL}/set-data`, {
      method: 'post',
      body: JSON.stringify({
        platform: 'browser',
        data: {
          base: {
            BaseEnv,
            node: { __filename, __dirname },
          },
          storage: {
            clipboard: {
              text, textWrite, textRead,
            },
          },
        },
      }),
    });
    const data = await res.json();
    _console.log(data);
  },

  codeError() {
    const a = 1;
    a = 2;
  },
  sourceError() {
    const img = document.createElement('img');
    img.src = './favicon.ico';
    document.body.append(img);
  },
  xhr() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', `${localConfig.remoteURL}`, true, 'user1', '123456');
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json;charset=utf-8',
    };
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.send(JSON.stringify({ a: 1 }));
  },
  xhrError() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', `${localConfig.remoteURL}/error`);
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json;charset=utf-8',
    };
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.send(JSON.stringify({ a: 1 }));
  },
  async fetch() {
    await fetch(`${localConfig.remoteURL}`, {
      method: 'post',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ a: 1 }),
    });
  },
  async fetchError() {
    await fetch(`${localConfig.remoteURL}/error`, {
      method: 'post',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json;charset=utf-8',
      },
    });
  },
  async promiseError() {
    new Promise((resolve, reject) => {
      reject(new Error());
    });
  },
  pushState() {
    history.pushState({ time: `${new _Date()}` }, '', '#id3');
  },
  replaceState() {
    history.replaceState({ time: `${new _Date()}` }, '', '#id4');
  },

  exit() {
    exit();
  },
  restart() {
    restart();
  },
};
