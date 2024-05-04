const {
  base: {
    BaseEnv, _console,
    _Object, _Date,
  },
  performance: {
    MonitorInfo,
    Monitor,
  },
} = window.hpShared;
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
            throw new Error('vue2 error');
          },
        };
      },
    });
    window.appMonitor.watchVueError(app);
    app.mount('#vue3');
  })();

  // 打开时反馈到 jest 测试
  window.examples.test();
});
window.examples = {
  async test() {
    const res = await fetch('http://localhost:9001/set-data', {
      method: 'post',
      body: JSON.stringify({
        platform: 'browser',
        data: {
          base: {
            BaseEnv,
          },
        },
      }),
    });
    const data = await res.json();
    _console.log(data);
  },
  code() {
    const a = 1;
    a = 2;
  },
  source() {
    const img = document.createElement('img');
    img.src = './favicon.ico';
    document.body.append(img);
  },
  xhr() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:9001', true, 'user1', '123456');
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
    };
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.send({ a: 1 });
  },
  xhrError() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:9001/error');
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
    };
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.send(JSON.stringify({ a: 1 }));
  },
  async fetch() {
    await fetch('http://localhost:9001', {
      method: 'post',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ a: 1 }),
    });
  },
  async fetchError() {
    await fetch('http://localhost:9001/error', {
      method: 'post',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
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

window.appMonitor = new Monitor()
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange()
  .watchPerformance()

