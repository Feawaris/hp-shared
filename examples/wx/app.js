import * as hpShared from 'hp-shared';
import { _console, Monitor } from 'hp-shared';
import shared from 'shared';
const { localConfig } = shared;

_console.log(hpShared);
wx.hpShared = hpShared;
wx.appMonitor = new Monitor({
  reportUrl: `${localConfig.remoteURL}/performance`,
  appInfo: {
    name: 'wx',
    version: '1.13.0',
  },
})
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange();

App({});
