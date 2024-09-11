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
    version: hpShared.version,
  },
})
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange();

App({});
