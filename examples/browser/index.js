const {
  base: {
    BaseEnv, _console,
    _Object, _Date,
  },
  storage: {
    clipboard,
  },
  performance: {
    MonitorInfo,
    Monitor,
  },
} = window.hpShared;
Object.assign(window,{
  ...window.hpShared.base,
  ...window.hpShared.storage,
  ...window.hpShared.performance,
})
const { localConfig } = window.testsShared;

window.appMonitor = new Monitor({
  reportUrl: `${localConfig.remoteURL}/performance`,
  appInfo: {
    name: 'browser',
    version: '1.10.0',
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
    new Vue({
      data(vm) {
        return {
          message: 'hello vue2',
          click() {
            throw new Error('vue2 error');
          },
        };
      },
    }).$mount('#vue2');
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
  })();

  // 反馈给 jest 测试用
  // window.examples.test();
});
window.examples = {
  // 反馈给 jest 测试用
  async test() {
    const copyText = `browser:copy:${new _Date()}`;
    const copyTextRes = await clipboard.copy(copyText);
    const pasteText = `browser:paste:${new _Date()}`;
    await clipboard.copy(pasteText);
    const pasteTextRes = await clipboard.paste();

    const res = await fetch(`${localConfig.remoteURL}/set-data`, {
      method: 'post',
      body: JSON.stringify({
        platform: 'browser',
        data: {
          base: {
            BaseEnv,
          },
          storage: {
            clipboard: {
              copyText, copyTextRes,
              pasteText, pasteTextRes,
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
};
