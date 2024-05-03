const {
  base: {
    BaseEnv, _console,
    _Object, _Date,
  },
  performance: {
    MonitorInfo
  }
} = window.hpShared;
window.addEventListener('DOMContentLoaded', function () {
  // vue2
  (function () {
    const Vue = window.Vue2;
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
    Vue.config.errorHandler = function (err, vm, info) {
      const monitorInfo = new MonitorInfo({
        type: 'VueError',
        trigger: 'Vue.config.errorHandler',
        detail: { err, info },
      });
      _console.success(monitorInfo);
    };
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
    app.config.errorHandler = function (err, instance, info) {
      const monitorInfo = new MonitorInfo({
        type: 'VueError',
        trigger: 'app.config.errorHandler',
        detail: { err, info },
      });
      _console.success(monitorInfo);
    };
    app.mount('#vue3');
  })();

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
    xhr.send(JSON.stringify({ a: 1 }));
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
  async Promise() {
    await new Promise((resolve, reject) => {
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

// window:error
window.addEventListener('error', function (event) {
  const monitorInfo = new MonitorInfo({
    trigger: 'window:error',
    ...((() => {
      // 代码报错
      if (event instanceof ErrorEvent) {
        return {
          type: 'CodeError',
          // ErrorEvent
          detail: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
          },
        };
      }
      // 资源报错
      if (event.target.tagName) {
        return {
          type: 'SourceError',
          // event.target
          detail: {
            tagName: event.target.tagName,
            src: event.target.src,
          },
        };
      }
    })()),
  });
  _console.error(monitorInfo);
}, true); // 设置为 true 以使用捕获阶段监听，以支持捕获资源加载错误

// xhr:loadend
const nativeOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
  const [method, url] = arguments;
  this._monitorInfo = new MonitorInfo({
    type: 'RequestError',
    trigger: 'xhr',
    detail: {
      // request 前端信息有限，借助后端返回更多信息，后端报错未返回时使用简版
      request: {
        method,
        url,
        headers: {},
        body: {},
      },
      // response 在 onloadend 中添加
      response: {
        status: this.status,
        statusText: this.statusText,
      },
      // 起止时间
      startTime: null,
      endTime: null,
    },
  });
  this.onloadend = function () {
    _Object.deepAssign(this._monitorInfo.detail, {
      endTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
    });
    if (this.status === 0 || this.status >= 400) {
      const headers = (() => {
        const str = this.getAllResponseHeaders();
        const arr = str.split(/[\r\n]+/).filter(val => val);
        return Object.fromEntries(arr.map((val) => {
          return val.split(/:\s+/);
        }));
      })();
      const body = (() => {
        try {
          return JSON.parse(this.response);
        } catch (e) {
          return {};
        }
      })();
      const request = body._request || {};
      delete body._request;
      _Object.deepAssign(this._monitorInfo.detail, {
        request,
        response: {
          status: this.status,
          statusText: this.statusText,
          headers,
          body,
        },
      });
      _console.success(this._monitorInfo);
    }
  };
  return nativeOpen.apply(this, arguments);
};
const nativeSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
  key = key.toLowerCase();
  _Object.deepAssign(this._monitorInfo.detail, {
    request: {
      headers: {
        [key]: value,
      },
    },
  });
  return nativeSetRequestHeader.apply(this, arguments);
};
const nativeSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (body) {
  _Object.deepAssign(this._monitorInfo.detail, {
    startTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
    request: {
      body: (() => {
        try {
          return JSON.parse(body);
        } catch (e) {
          return {};
        }
      })(),
    },
  });
  return nativeSend.apply(this, arguments);
};

// fetch
const nativeFetch = fetch;
fetch = async function () {
  const [url, { method = 'GET', headers: reqHeaders = {}, body: reqBody } = {}] = arguments;
  const monitorInfo = new MonitorInfo({
    type: 'RequestError',
    trigger: 'fetch',
    detail: {
      request: {
        method: method.toUpperCase(),
        url,
        headers: reqHeaders,
        body: (() => {
          try {
            return JSON.parse(reqBody);
          } catch (e) {
            return {};
          }
        })(),
      },
      response: {},
      startTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
      endTime: null,
    },
  });

  const res = await nativeFetch.apply(this, arguments);
  _Object.deepAssign(monitorInfo.detail, {
    endTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
  });
  if (res.status === 0 || res.status >= 400) {
    const clonedRes = res.clone();
    const headers = Object.fromEntries(clonedRes.headers.entries());
    const body = await clonedRes.json();
    const request = body._request || {};
    delete body._request;
    _Object.deepAssign(monitorInfo.detail, {
      request,
      response: {
        status: clonedRes.status,
        statusText: clonedRes.statusText,
        headers,
        body,
      },
    });
    _console.success(monitorInfo);
  }
  return res;
};

// Promise
window.addEventListener('unhandledrejection', function (event) {
  _console.dir(event);
  const monitorInfo = new MonitorInfo({
    type: 'PromiseError',
    trigger: 'window:unhandledrejection',
    // PromiseRejectionEvent
    detail: {
      reason: event.reason,
    },
  });
  _console.log(monitorInfo);
});

// route
const RECORD = {
  from: location.href,
  fromState: history.state || {},
  to: '',
  toState: {},
  update({ to, toState } = {}) {
    to = new URL(to || location.href, location.href).href;
    toState = toState || history.state || {};
    [this.from, this.fromState] = [this.to, this.toState];
    [this.to, this.toState] = [to, toState];

    return this;
  },
  isSamePage() {
    return this.to === this.from && JSON.stringify(this.toState) === JSON.stringify(this.fromState);
  },
};
window.addEventListener('popstate', function (event) {
  RECORD.update();
  if (!RECORD.isSamePage()) {
    const { from, to, fromState, toState } = RECORD;
    const monitorInfo = new MonitorInfo({
      type: 'RouteChange',
      trigger: 'window:popstate',
      detail: { success: true, from, to, fromState, toState },
    });
    _console.success(monitorInfo);
  }
});
const nativePushState = history.pushState;
history.pushState = function (state, unused, url) {
  RECORD.update({
    to: url || location.href,
    toState: state,
  });
  if (!RECORD.isSamePage()) {
    const { from, to, fromState, toState } = RECORD;
    const monitorInfo = new MonitorInfo({
      type: 'RouteChange',
      trigger: 'history.pushState',
      detail: { success: true, from, to, fromState, toState },
    });
    _console.success(monitorInfo);
  }
  nativePushState.apply(this, arguments);
};
const nativeReplaceState = history.replaceState;
history.replaceState = function (state, unused, url) {
  RECORD.update({
    to: url || location.href,
    toState: state,
  });
  if (!RECORD.isSamePage()) {
    const { from, to, fromState, toState } = RECORD;
    const monitorInfo = new MonitorInfo({
      type: 'RouteChange',
      trigger: 'history.replaceState',
      detail: { success: true, from, to, fromState, toState },
    });
    _console.success(monitorInfo);
  }
  nativeReplaceState.apply(this, arguments);
};

// Performance
const po = new PerformanceObserver(function (list, observer) {
  const entries = list.getEntries();
  _console.log('PerformanceObserver', entries);
  for (const entry of entries) {
    const monitorInfo = new MonitorInfo({
      type: 'performance',
      trigger: [
        'po',
        entry.entryType,
        ...(entry.entryType === 'paint' ? [entry.name] : []),
      ].join(':'),
      detail: entry.toJSON(),
    });
    _console.success(monitorInfo);
  }
});
po.observe({
  entryTypes: [
    'largest-contentful-paint', // LCP
    'layout-shift', // CLS
    'paint', // FP,FCP
    'first-input', // FID
    // 'navigation', // TTFB
  ],
  buffered: true,
});
