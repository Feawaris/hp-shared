import { _console, _Date, _Object, BaseEnv } from '../base';
import { _localStorage } from '../storage/web-storage';
import { v4 as uuidv4 } from 'uuid';

function getSearchParams(url = '') {
  const index = url.indexOf('?');
  if (index === -1) {
    return {};
  }
  const search = url.slice(index + 1);
  return Object.fromEntries(search.split('&').map(val => val.split('=')));
}

export interface MonitorInfoData {
  // 生成 uid 以区分用户
  uid?: string;
  // 生成时间
  time?: string,
  // BaseEnv 关键信息
  env?: {
    envs: string[],
    os: string,
  },
  // location 关键信息
  location?: {
    href: string,
  },
  // 项目信息
  appInfo?: {
    name?: string,
    version?: string | number,
  },

  // 类型
  type?: string,
  // 触发方式
  trigger?: string,
  // 详细数据
  detail?: object,
}
export interface MonitorInfoOptions {
  // 各实例共用 uid 属性名本地存储
  uidName?: string;
  // 上报地址
  reportUrl?: string,
  // 上报方式
  reportType?: 'fetch' | 'xhr' | 'img' | 'sendBeacon' | 'wxRequest',
}
export class MonitorInfo {
  private _options: MonitorInfoOptions;
  type: string;
  trigger: string;
  detail: object;
  constructor(info: MonitorInfoData = {}, options: MonitorInfoOptions = {}) {
    Object.defineProperty(this, '_options', {
      value: _Object.deepAssign({
        uidName: 'monitor_uid',
        reportType: BaseEnv.isWx ? 'wxRequest' : 'fetch',
      }, options),
      enumerable: false,
    });
    _Object.deepAssign(this, {
      uid: this.getUid(),
      time: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
      env: {
        envs: BaseEnv.envs,
        os: BaseEnv.os,
      },
      location: {
        href: (() => {
          if (BaseEnv.isBrowser) {
            return location.href;
          }
          if (BaseEnv.isWx) {
            return (() => {
              const pages = getCurrentPages();
              return pages[pages.length - 1].route;
            })();
          }
          return '';
        })(),
      },
      // 项目信息
      appInfo: {
        name: 'default',
        version: '0.0.0',
      },

      type: '',
      trigger: '',
      detail: {},
    }, info);
  }

  // 获取 uid
  getUid(): string {
    const uid = _localStorage.getItem(this._options.uidName);
    return uid || (() => {
      const result = (() => {
        try {
          return uuidv4();
        } catch (e) {
          // 小程序没有 Web Crypto API，使用 uuidv4 报错处理
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
      })();
      _localStorage.setItem(this._options.uidName, result);
      return result;
    })();
  }
  // 上报
  async report() {
    let { reportUrl, reportType } = this._options;
    reportUrl = `${reportUrl}?type=${this.type}`;
    // _console.log({ reportUrl, reportType });
    if (reportType === 'fetch') {
      await Monitor.fetch(reportUrl, {
        method: 'POST',
        body: JSON.stringify(this),
      });

      return this;
    }
    if (reportType === 'wxRequest') {
      Monitor.wxRequest({
        url: reportUrl,
        method: 'POST',
        data: this,
      });

      return this;
    }
  }
}
export class Monitor {
  static XMLHttpRequest: any;
  static fetch: any;
  static wxRequest: any;
  static {
    // _console.log('static',wx.request);
    // 自身发请求时使用未重写的方法防止循环触发
    this.XMLHttpRequest = BaseEnv.isBrowser ? (() => {
      const XHR = Object.create(XMLHttpRequest);
      Object.setPrototypeOf(XHR, Object.assign(Object.create(XMLHttpRequest), {
        open: XMLHttpRequest.prototype.open,
        setRequestHeader: XMLHttpRequest.prototype.setRequestHeader,
        send: XMLHttpRequest.prototype.send,
      }));
      return XHR;
    })() : null;
    this.fetch = BaseEnv.isBrowser ? window.fetch.bind(window) : null;
    this.wxRequest = BaseEnv.isWx ? wx.request.bind(wx) : null;
  }

  private monitorInfoData: MonitorInfoData;
  private monitorInfoOptions: MonitorInfoOptions;
  constructor(options = {}) {
    _Object.deepAssign(this, options);
    // MonitorInfoData 和 MonitorInfoOptions 收集
    this.monitorInfoData = _Object.filter(options, {
      pick: ['uid', 'appInfo'],
    });
    this.monitorInfoOptions = _Object.filter(options, {
      pick: ['uidName', 'reportUrl', 'reportType'],
    });
  }

  // 创建 MonitorInfo 实例
  createMonitorInfo(data: MonitorInfoData = {}) {
    data = _Object.deepAssign({}, this.monitorInfoData, data);
    return new MonitorInfo(data, this.monitorInfoOptions);
  }
  // 资源异常
  watchResourceError() {
    if (BaseEnv.isBrowser) {
      window.addEventListener('error', (event) => {
        const target = event.target as any;
        if (target.tagName) {
          const monitorInfo = this.createMonitorInfo({
            type: 'SourceError',
            trigger: 'window:error',
            detail: {
              tagName: target.tagName,
              src: target.src,
            },
          });
          monitorInfo.report();
        }
      }, true); // 设置为 true 以使用捕获阶段监听，以支持捕获资源加载错误
      return this;
    }
    if (BaseEnv.isWx) {
      return this;
    }
    return this;
  }
  // 代码异常
  watchCodeError() {
    if (BaseEnv.isBrowser) {
      window.addEventListener('error', (event: ErrorEvent) => {
        if (event instanceof ErrorEvent) {
          const monitorInfo = this.createMonitorInfo({
            type: 'CodeError',
            trigger: 'window:error',
            detail: {
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
              error: event.error,
            },
          });
          monitorInfo.report();
        }
      });
      return this;
    }
    if (BaseEnv.isWx) {
      wx.onError((message) => {
        const monitorInfo = this.createMonitorInfo({
          type: 'CodeError',
          trigger: 'wx.onError',
          detail: {
            message,
          },
        });
        monitorInfo.report();
      });
      return this;
    }
    return this;
  }
  // Promise 异常
  watchPromiseError() {
    if (BaseEnv.isBrowser) {
      window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        const monitorInfo = this.createMonitorInfo({
          type: 'PromiseError',
          trigger: 'window:unhandledrejection',
          detail: {
            reason: event.reason,
          },
        });
        monitorInfo.report();
      });
      return this;
    }
    if (BaseEnv.isWx) {
      return this;
    }
    return this;
  }
  // Vue 异常
  watchVueError(app) {
    const _this = this;
    app.config.errorHandler = (err, instance, info) => {
      const monitorInfo = _this.createMonitorInfo({
        type: 'VueError',
        trigger: (() => {
          if (app.version.startsWith('3')) {
            return 'app.config.errorHandler';
          }
          if (app.version.startsWith('2')) {
            return 'Vue.config.errorHandler';
          }
          return '';
        })(),
        detail: {
          error: {
            stack: err.stack,
            message: err.message,
          },
          info,
        },
      });
      monitorInfo.report();
    };
    return this;
  }
  // 请求异常
  watchRequestError() {
    const _this = this;
    if (BaseEnv.isBrowser) {
      // XMLHttpRequest
      const nativeOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function () {
        const [method, url] = arguments;
        this._monitorInfo = _this.createMonitorInfo({
          type: 'RequestError',
          trigger: 'XMLHttpRequest',
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
        this.onloadend = function (event: ProgressEvent) {
          const monitorInfo = this._monitorInfo;
          _Object.deepAssign(monitorInfo.detail, {
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
            _Object.deepAssign(monitorInfo.detail, {
              request,
              response: {
                status: this.status,
                statusText: this.statusText,
                headers,
                body,
              },
            });
            monitorInfo.report();
          }
        };
        return nativeOpen.apply(this, arguments);
      };
      const nativeSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
      XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
        const monitorInfo = this._monitorInfo;
        _Object.deepAssign(monitorInfo.detail, {
          request: {
            headers: {
              [key.toLowerCase()]: value,
            },
          },
        });
        return nativeSetRequestHeader.apply(this, arguments);
      };
      const nativeSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function (body) {
        const monitorInfo = this._monitorInfo;
        _Object.deepAssign(monitorInfo.detail, {
          startTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
          request: {
            body: (() => {
              try {
                // @ts-ignore
                return JSON.parse(body);
              } catch (e) {
                return body;
              }
            })(),
          },
        });
        return nativeSend.apply(this, arguments);
      };

      // fetch
      const nativeFetch = fetch;
      // @ts-ignore
      fetch = async function () {
        const [url, { method = 'GET', headers: reqHeaders = {}, body: reqBody = '{}' } = {}] = arguments;
        const monitorInfo = _this.createMonitorInfo({
          type: 'RequestError',
          trigger: 'fetch',
          detail: {
            startTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
            endTime: null,
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
          },
        });
        return nativeFetch.apply(this, arguments).then(async (res) => {
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
            monitorInfo.report();
          }

          return res;
        }).catch((e) => {
          _Object.deepAssign(monitorInfo.detail, {
            endTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
          });
          monitorInfo.report();

          throw e;
        });
      };

      return this;
    }
    if (BaseEnv.isWx) {
      // wx.request
      const nativeRequest = wx.request;
      wx.request = function (options: WechatMiniprogram.RequestOption = { url: '' }) {
        const monitorInfo = _this.createMonitorInfo({
          type: 'RequestError',
          trigger: 'wx.request',
          detail: {
            request: {
              method: options.method || 'GET',
              url: options.url,
              headers: options.header,
              body: options.data,
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
              monitorInfo.report();
            }
            return options.success(res);
          },
          fail() {
            _Object.deepAssign(monitorInfo.detail, {
              endTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
            });
            monitorInfo.report();
          },
        });
      };

      return this;
    }
  }
  // 路由切换
  watchRouteChange() {
    const _this = this;
    if (BaseEnv.isBrowser) {
      const record = {
        from: location.href,
        fromState: history.state || {},
        to: '',
        toState: {},
        // @ts-ignore
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
        record.update();
        if (!record.isSamePage()) {
          const { from, to, fromState, toState } = record;
          const monitorInfo = _this.createMonitorInfo({
            type: 'RouteChange',
            trigger: 'window:popstate',
            detail: { success: true, from, to, fromState, toState },
          });
          monitorInfo.report();
        }
      });
      const nativePushState = history.pushState;
      history.pushState = function (state, unused, url) {
        record.update({
          to: url || location.href,
          toState: state,
        });
        if (!record.isSamePage()) {
          const { from, to, fromState, toState } = record;
          const monitorInfo = _this.createMonitorInfo({
            type: 'RouteChange',
            trigger: 'history.pushState',
            detail: { success: true, from, to, fromState, toState },
          });
          monitorInfo.report();
        }
        nativePushState.apply(this, arguments);
      };
      const nativeReplaceState = history.replaceState;
      history.replaceState = function (state, unused, url) {
        record.update({
          to: url || location.href,
          toState: state,
        });
        if (!record.isSamePage()) {
          const { from, to, fromState, toState } = record;
          const monitorInfo = _this.createMonitorInfo({
            type: 'RouteChange',
            trigger: 'history.replaceState',
            detail: { success: true, from, to, fromState, toState },
          });
          monitorInfo.report();
        }
        nativeReplaceState.apply(this, arguments);
      };

      return this;
    }
    if (BaseEnv.isWx) {
      for (const routeName of [
        'switchTab',
        'reLaunch',
        'redirectTo',
        'navigateTo',
        'navigateBack',
      ]) {
        const nativeMethod = wx[routeName];
        wx[routeName] = function (options = {}) {
          // @ts-ignore
          const { url, delta = 1 } = options;
          const pages = getCurrentPages();
          const fromPage = pages[pages.length - 1];
          const toPage = routeName === 'navigateBack' ? pages[pages.length - 1 - delta] : { route: url, options: {} };
          const monitorInfo = _this.createMonitorInfo({
            type: 'RouteChange',
            trigger: `wx.${routeName}`,
            detail: {
              success: null,
              from: fromPage.route,
              fromState: getSearchParams(fromPage.route),
              to: toPage.route,
              toState: getSearchParams(toPage.route),
            },
          });
          nativeMethod.call(this, {
            ...options,
            success() {
              // @ts-ignore
              monitorInfo.detail.success = true;
              // @ts-ignore
              return options.success?.(...arguments);
            },
            fail() {
              // @ts-ignore
              monitorInfo.detail.success = false;
              // @ts-ignore
              return options.fail?.(...arguments);
            },
            complete() {
              monitorInfo.report();
              // @ts-ignore
              return options.complete?.(...arguments);
            },
          });
        };
      }

      return this;
    }
    return this;
  }
  // 性能指标
  watchPerformance() {
    const _this = this;
    if (BaseEnv.isBrowser) {
      const po = new PerformanceObserver(function (list, observer) {
        const entries = list.getEntries();
        for (const entry of entries) {
          const monitorInfo = _this.createMonitorInfo({
            type: 'Performance',
            trigger: 'PerformanceObserver',
            detail: entry.toJSON(),
          });
          monitorInfo.report();
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

      return this;
    }
    if (BaseEnv.isWx) {
      return this;
    }
    return this;
  }
}