import { _console } from 'hp-shared/base';
import { Monitor } from 'hp-shared/performance';
import * as hpShared from 'hp-shared';
import shared from 'shared';
const { localConfig } = shared;

wx.hpShared = hpShared;
wx.appMonitor = new Monitor({
  reportUrl: `${localConfig.remoteURL}/performance`,
  appInfo: {
    name: 'wx',
    version: '1.13.0-rc.0',
  },
})
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange();

App({});
