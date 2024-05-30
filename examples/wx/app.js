import { _console } from 'hp-shared/base';
import { Monitor } from 'hp-shared/performance';
import shared from 'shared';
const { localConfig } = shared;

wx.appMonitor = new Monitor({
  reportUrl: `${localConfig.remoteURL}/performance`,
  appInfo: {
    name: 'wx',
    version: '1.9.0',
  },
})
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange();

App({

});

