import { _console, _Date, _Object, BaseEnv } from '../base';
import ObjectId from 'bson-objectid';
import { _localStorage } from '../storage/web-storage';

export interface MonitorInfoData {
  // 生成 uid 以区分来源
  uid?: string;
  // 生成 id
  _id?: string,
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
  // uid 属性名用于本地存储
  uidName?: string;
}
export class MonitorInfo {
  private _options: MonitorInfoOptions;
  constructor(info: MonitorInfoData = {}, options: MonitorInfoOptions = {}) {
    Object.defineProperty(this, '_options', {
      value: _Object.deepAssign({
        uidName: 'monitor_id',
      }, options),
    });
    _Object.deepAssign(this, {
      uid: this.getUid(),
      _id: `${new ObjectId()}`,
      time: `${new _Date()}`,
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
              const pages= getCurrentPages();
              return pages[pages.length-1].route
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
  getUid(): string {
    const uid = _localStorage.getItem(this._options.uidName);
    return uid ? uid : (() => {
      const result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      _localStorage.setItem(this._options.uidName, result);
      return result;
    })();
  }
  request() {}
}
