import { _console, _Date, _Object } from 'hp-shared/base';
import { MonitorInfo } from 'hp-shared/performance';
import { _localStorage } from 'hp-shared/storage';

wx._localStorage = _localStorage;

const nativeRequest = wx.request;
wx.request = function (options = {}) {
  const { method = 'GET', url, header = {}, data } = options;
  const monitorInfo = new MonitorInfo({
    type: 'RequestError',
    trigger: 'wx.request',
    detail: {
      request: {
        method,
        url,
        headers: header,
        body: data,
      },
      response: {},
      startTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
      endTime: null,
    },
  });
  return nativeRequest.call(this, {
    ...options,
    success(res) {
      _Object.deepAssign(monitorInfo.detail, {
        endTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
      });
      if (res.statusCode === 0 || res.statusCode >= 400) {
        const body = res.data;
        const request = body._request || {};
        delete body._request;
        _Object.deepAssign(monitorInfo.detail, {
          request,
          response: {
            status: res.statusCode,
            statusText: '',
            headers: res.header,
            body,
          },
        });
      }
      return options.success(res);
    },
  });
};

wx.onError(function (message) {
  const monitorInfo = new MonitorInfo({
    type: 'CodeError',
    trigger: 'wx.onError',
    detail: {
      message,
    },
  });
  _console.success(monitorInfo);
});

for (const routeName of [
  'switchTab',
  'reLaunch',
  'redirectTo',
  'navigateTo',
  'navigateBack',
]) {
  const nativeMethod = wx[routeName];
  wx[routeName] = function (options = {}) {
    const { url, delta = 1 } = options;
    const pages = getCurrentPages();
    const fromPage = pages[pages.length - 1];
    const toPage = routeName === 'navigateBack' ? pages[pages.length - 1 - delta] : { route: url };
    const monitorInfo = new MonitorInfo({
      type: 'RouteChange',
      trigger: `wx.${routeName}`,
      detail: {
        success: null,
        from: fromPage.route,
        fromState: fromPage.options || getSearchParams(fromPage.route),
        to: toPage.route,
        toState: toPage.options || getSearchParams(toPage.route),
      },
    });
    nativeMethod.call(this, {
      ...options,
      success() {
        monitorInfo.detail.success = true;
        return options.success?.(...arguments);
      },
      fail() {
        monitorInfo.detail.success = false;
        return options.fail?.(...arguments);
      },
      complete() {
        _console.success(monitorInfo);
        return options.complete?.(...arguments);
      },
    });
  };
}

function getSearchParams(url = '') {
  const index = url.indexOf('?');
  if (index === -1) {
    return {};
  }
  const search = url.slice(index + 1);
  return Object.fromEntries(search.split('&').map(val => val.split('=')));
}
App({});
